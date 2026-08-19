# Week 9 — Documentation, Type Safety & Gemini Resilience

## Tổng quan

Week 9 tập trung ổn định chất lượng dự án thay vì bổ sung UI hoặc API mới. Các thay đổi chính gồm hoàn thiện tài liệu kỹ thuật, xử lý lỗi lint ở frontend, tăng type-safety cho Auth Service và Backend, kiểm tra dữ liệu từ dịch vụ ngoài, sửa unit test AI Controller và bổ sung retry có giới hạn cho Gemini.

Phạm vi được ghi nhận từ tag `week-8` đến tag `week-9`:

- 9 commit.
- 35 file thay đổi.
- 1.275 dòng thêm và 233 dòng xóa.
- Không thay đổi API route, request body hoặc response format hiện tại.
- Không thay đổi database configuration, WebSocket event hoặc JWT secret.

---

## Kết quả đạt được

- Bổ sung bộ tài liệu nền tảng về kiến trúc, API, môi trường, testing, threat model, ADR và roadmap.
- Frontend vượt qua ESLint mà không dùng `any` để né type checking.
- Auth modal được reset theo lifecycle mount/unmount, giữ nguyên luồng đăng nhập và đăng ký.
- Auth Service sử dụng DTO/type cụ thể cho register, login và verify token.
- Backend kiểm tra an toàn response từ Auth Service và CoinGecko trước khi sử dụng.
- Record platform CoinGecko lỗi được bỏ qua riêng lẻ thay vì làm hỏng toàn bộ network refresh.
- Unit test của `AiController` có mock `AiService`, không gọi Gemini thật.
- Gemini sử dụng native retry của SDK cho lỗi tạm thời `429` và `503`.
- Unit test xác nhận cấu hình Gemini, request generation, success response và fallback hiện tại.

---

## Task 1 — Project Documentation Baseline

Bổ sung tài liệu phục vụ onboarding, review kiến trúc và vận hành:

```text
README.md
docs/api.md
docs/architecture.md
docs/environment-variables.md
docs/testing-strategy.md
docs/threat-model.md
docs/roadmap.md
docs/adr/
```

Các tài liệu mô tả kiến trúc frontend/backend/auth service, API hiện tại, biến môi trường, chiến lược kiểm thử, rủi ro bảo mật và các quyết định kiến trúc quan trọng.

File `.env.example` được bổ sung cho frontend và backend; không chứa secret thật.

---

## Task 2 — Frontend Lint & Type Safety

`AiCopilot` được bổ sung type tối thiểu cho Web Speech API:

- Loại bỏ các vị trí `any` trong Speech Recognition.
- Type an toàn cho recognition instance, result event và error event.
- Xử lý việc cuộn xuống cuối danh sách message mà không vi phạm React Hooks lint rule.

Lifecycle của `AuthModal` được điều chỉnh để reset state thông qua mount/unmount của modal. Luồng register/login, request body và response handling không thay đổi.

Các file chính:

```text
frontend/src/components/ai-copilot/AiCopilot.tsx
frontend/src/components/auth/AuthModal/AuthModal.tsx
frontend/src/components/layout/MainHeader/MainHeader.tsx
```

---

## Task 3 — Auth Service Type Safety

Auth Service được chuẩn hóa type mà không thay đổi contract:

- Thêm `AuthCredentials` và `AuthTokenPayload`.
- Dùng type-only import cho DTO được sử dụng với decorator.
- Bỏ `async` khỏi `verifyToken` vì hàm không có thao tác bất đồng bộ.
- Narrow lỗi an toàn hoặc dùng `catch {}` khi không cần biến lỗi.
- Xử lý `bootstrap()` theo quy tắc `no-floating-promises`.
- Chuẩn hóa formatting cho controller, service, entity và module.

Các route register, login, verify token, JWT payload và database configuration được giữ nguyên.

---

## Task 4 — Backend Authentication Boundary

`JwtAuthGuard` không còn tin trực tiếp Axios response:

- Request được type bằng Express/Nest phù hợp.
- Response từ Auth Service được nhận dưới dạng `unknown`.
- Type guard xác nhận payload có `user.sub` và `user.email` hợp lệ.
- Chỉ gán `request.user` sau khi validation thành công.

Flow gọi `http://localhost:3002/api/auth/verify`, Authorization header và thông báo lỗi hiện tại không thay đổi.

---

## Task 5 — CoinGecko Response Validation

`CryptoService` bổ sung các type và type guard tối thiểu cho dữ liệu thực sự được sử dụng:

- Market record và normalized coin.
- Các trường price, market cap, volume, supply, sparkline và last updated.
- Platform record dùng để xây dựng network map.
- Axios error được narrow an toàn bằng API chính thức.

Market response không hợp lệ tiếp tục đi vào fallback `[]` hiện tại. Với platform response dạng array, từng record được kiểm tra riêng; record malformed bị bỏ qua nhưng record hợp lệ vẫn được dùng để cập nhật network map.

Không thay đổi:

- Endpoint hoặc query parameters CoinGecko.
- Số lượng coin trả về.
- Mapping field và response API.
- Watchlist, cache hoặc WebSocket behavior.

---

## Task 6 — AI Tests & Market Context Safety

Unit test `AiController` được sửa bằng mock `AiService`, đồng thời kiểm tra response contract:

```ts
{ reply: string }
```

`AiService` kiểm tra dữ liệu market context trước khi tạo system instruction. Error trong `catch` được nhận dưới dạng `unknown` và narrow trước khi log.

Khi dữ liệu không hợp lệ hoặc Gemini cuối cùng vẫn lỗi, service tiếp tục trả fallback hiện tại thay vì làm thay đổi API response.

---

## Task 7 — Bounded Native Retry for Gemini

Gemini client sử dụng native retry của `@google/genai@2.15.0`:

```ts
{
  timeout: 12_000,
  retryOptions: {
    attempts: 3,
    initialDelay: 0.5,
    maxDelay: 2,
    expBase: 2,
    jitter: 1,
    httpStatusCodes: [429, 503],
  },
}
```

Behavior:

- Request thành công ngay lần đầu không thay đổi.
- Chỉ lỗi tạm thời `429` và `503` được retry.
- Các lỗi permanent như `400`, `401` và `403` không nằm trong retry policy.
- Retry có số attempt và timeout giới hạn để tránh request treo quá lâu.
- Khi SDK retry hết và throw, `catch` hiện tại vẫn trả fallback cũ.

Không thay model `gemini-flash-latest`, prompt, system instruction, temperature `0.2` hoặc response `{ reply }`.

Unit test mới không gọi Gemini thật và kiểm tra:

1. Client được khởi tạo với đúng `httpOptions`.
2. Success trả đúng nội dung Gemini.
3. Model, prompt, system instruction và temperature không thay đổi.
4. SDK throw vẫn trả fallback hiện tại.

---

## Danh sách commit

```text
cf79115 docs: add project documentation baseline
771b423 fix(frontend): resolve lint errors in AI copilot and auth modal
5b9e0b2 fix(auth): resolve lint and type-safety issues
47a3eed chore(backend): apply lint-safe formatting
8b77475 test(ai): mock service dependency in controller tests
bf2bab4 refactor(auth): validate token verification responses safely
70b8799 refactor(crypto): validate CoinGecko responses safely
0b20933 refactor(ai): validate market context and narrow errors
525f667 fix(ai): add bounded native retries for Gemini
```

---

## Cách chạy và kiểm tra

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

Auth Service:

```bash
cd auth-ms
npx eslint src test
npm run test
npm run build
```

Backend:

```bash
cd backend
npx eslint src test
npm run test
npm run build
```

Repository:

```bash
git diff --check
git status
```

---

## Release Tag

Tag `week-9` là lightweight tag và trỏ tới commit:

```text
525f667 fix(ai): add bounded native retries for Gemini
```

Lệnh tạo và push tag trong trường hợp cần tái tạo trên repository khác:

```bash
git tag week-9
git push origin week-9
```

---

## Tổng kết

Week 9 nâng chất lượng kỹ thuật của dự án trên ba lớp frontend, backend và auth service. Hệ thống có type boundary rõ ràng hơn với dữ liệu bên ngoài, test AI không phụ thuộc dịch vụ thật, và Gemini có khả năng phục hồi có giới hạn trước lỗi quá tải tạm thời. Các thay đổi giữ nguyên API contract và business flow hiện tại, đồng thời tạo nền tảng tốt hơn cho CI, security hardening và integration testing ở các tuần tiếp theo.

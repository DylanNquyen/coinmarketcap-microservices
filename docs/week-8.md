# Week 8 — Responsive Header, AI Assistant Controls & Scroll To Top

## Tổng quan

Week 8 tập trung hoàn thiện trải nghiệm frontend trên desktop và mobile. Các thay đổi gồm menu điều hướng mobile responsive, QR tải ứng dụng trong header, tùy chọn bật/tắt CMC AI Assistant và nút quay lại đầu trang.

Phạm vi thay đổi so với tag `week-7`:

- 3 commit local chưa được push lên `origin/main`.
- 12 file frontend được thay đổi.
- Không thay đổi backend, auth service hoặc API contract.

---

## Kết quả đạt được

- Header có menu mobile dạng drawer, hỗ trợ submenu và các thao tác tài khoản.
- Người dùng có thể đổi ngôn ngữ và tiền tệ ngay trong menu mobile.
- Header desktop có QR code dẫn tới trang tải ứng dụng CoinMarketCap.
- CMC AI Assistant có thể được ẩn và bật lại từ Account Menu.
- Trạng thái hiển thị AI Assistant được lưu trong `cmc-preferences`.
- Nút Scroll To Top xuất hiện sau khi cuộn 400 px và hỗ trợ `prefers-reduced-motion`.
- Cải thiện layout của Advertisement Card và Account Menu.

---

## Task 1 — CMC AI Assistant Visibility

Preferences store bổ sung trạng thái:

```ts
isAiAssistantEnabled: boolean;
setAiAssistantEnabled: (isEnabled: boolean) => void;
```

Hành vi chính:

- Nút ẩn trong AI Copilot sẽ đóng assistant và lưu trạng thái đã tắt.
- Hiển thị thông báo ngắn sau khi assistant bị ẩn.
- Phím tắt và event hỏi nhanh không mở assistant khi tính năng đang tắt.
- Người dùng có thể bật hoặc tắt lại trong Account Menu.
- Cấu hình tiếp tục được lưu bằng local storage key `cmc-preferences`.

Các file chính:

```text
frontend/src/components/ai-copilot/AiCopilot.tsx
frontend/src/components/ai-copilot/AiCopilot.module.css
frontend/src/components/auth/AccountMenu/AccountMenu.tsx
frontend/src/store/usePreferencesStore.ts
```

---

## Task 2 — Header QR Download Popup

Main Header bổ sung nút QR trên desktop:

- Mở popover chứa QR code tải ứng dụng.
- Đóng khi click bên ngoài.
- Đồng bộ trạng thái với Account Menu để tránh hai popover mở cùng lúc.
- Bổ sung `aria-label`, `aria-expanded` và `role="dialog"` cho accessibility.

QR code hiện trỏ tới:

```text
https://coinmarketcap.com/mobile/
```

---

## Task 3 — Responsive Mobile Navigation

Header bổ sung menu điều hướng dành cho màn hình mobile với:

- Drawer toàn màn hình và nút đóng.
- Các nhóm điều hướng có thể mở rộng/thu gọn.
- Watchlist, Portfolio, Diamonds, CMC AI, Notifications và Settings.
- Luồng Register/Login cho khách và Logout cho người dùng đã đăng nhập.
- Bộ chọn English/Tiếng Việt và USD/VND.
- Liên kết pháp lý và mạng xã hội.
- Đóng menu bằng phím `Escape` hoặc sau khi chọn liên kết.
- Khóa cuộn trang nền trong lúc menu đang mở.

Các thuộc tính accessibility quan trọng gồm `aria-modal`, `aria-controls`, `aria-expanded` và nhãn điều hướng riêng cho mobile.

---

## Task 4 — Scroll To Top

Component mới:

```text
frontend/src/components/layout/ScrollToTop/
├── ScrollToTop.tsx
├── ScrollToTop.module.css
└── index.ts
```

Component được mount tại `AppShell` và có behavior:

- Chỉ hiển thị khi `window.scrollY > 400`.
- Dùng passive scroll listener.
- Cuộn mượt về đầu trang.
- Tự chuyển sang cuộn tức thời nếu người dùng bật `prefers-reduced-motion`.
- Loại nút khỏi tab order khi đang ẩn.

---

## Task 5 — UI Layout Refinements

- Cập nhật style cho Main Header trên desktop và mobile.
- Điều chỉnh Account Menu để chứa tùy chọn hiển thị CMC AI Assistant.
- Cải thiện vị trí và khoảng cách của Advertisement Card.
- Bổ sung style cho thông báo ẩn AI Assistant và nút Scroll To Top.

---

## Danh sách commit chưa push

```text
3981512 feat(ui): add AI Copilot visibility toggle, header QR popup, and fix card layout
78822a1 feat(components): add ScrollToTop button component
a380810 feat(header): add responsive mobile navigation menu
```

---

## Cách chạy và kiểm tra

```bash
cd frontend
npm install
npm run build
npm run dev
```

Checklist thủ công:

1. Mở/đóng QR popup và kiểm tra click-outside.
2. Ẩn CMC AI Assistant, reload trang và xác nhận trạng thái được giữ lại.
3. Bật lại AI Assistant từ Account Menu.
4. Kiểm tra menu mobile, submenu, Login/Register/Logout và phím `Escape`.
5. Đổi ngôn ngữ và tiền tệ trong menu mobile.
6. Cuộn quá 400 px, bấm Scroll To Top và kiểm tra reduced motion.
7. Kiểm tra layout trên desktop, tablet và mobile.

---

## Git và Release Tag

Commit tài liệu Week 8, push nhánh `main`, tạo lightweight tag và push tag:

```bash
git add docs/week-8.md
git commit -m "docs: add week 8 release notes"
git push origin main
git tag week-8
git push origin week-8
```

Tag `week-8` là lightweight tag nên không cần tham số `-m`.

---

## Tổng kết

Week 8 hoàn thiện khả năng sử dụng trên mobile và bổ sung các điều khiển UI có lưu trạng thái. Header hiện đáp ứng tốt hơn trên nhiều kích thước màn hình, AI Assistant có thể tùy chỉnh hiển thị, và thao tác quay lại đầu trang thân thiện hơn với accessibility.

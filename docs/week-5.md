# Week 5 — Frontend Architecture, Authentication, Watchlist & Shared Layout

## Tổng quan

Tuần 5 tập trung hoàn thiện frontend theo hướng production-ready:

**Design System** Chuẩn hóa design system theo giao diện CoinMarketCap.  
**Shared Layout** Xây dựng layout dùng chung cho toàn bộ ứng dụng.  
**Coin Table** Hoàn thiện bảng coin responsive và cập nhật realtime qua WebSocket.  
**Authentication** Tích hợp đăng ký, đăng nhập, đăng xuất, tự động lưu trữ/restore JWT.  
**Watchlist** Kết nối dữ liệu Watchlist theo từng tài khoản người dùng.  
**Routing** Tách biệt Home Page và Watchlist Page bằng Hash Routing.  
**UI Polish** Thêm Footer và Bottom Market Bar chuyên nghiệp.  
**Performance** Tối ưu hóa request API, giảm request dư thừa tới CoinGecko khi chuyển trang.

---

## Kết quả đạt được

* Frontend build production thành công (`npm run build`).
* Toàn bộ Coin data được routed an toàn qua Kong Gateway.
* WebSocket kết nối duy nhất 1 lần và duy trì trong suốt vòng đời ứng dụng.
* State Auth tự động lưu (persist) sau khi reload trang.
* Watchlist lưu trữ trực tiếp vào MySQL theo `userId`.
* **Home Page:** Hiển thị toàn bộ dữ liệu crypto.
* **Watchlist Page:** Chỉ hiển thị danh sách các coin người dùng đã bấm lưu.
* **Footer & Bottom Market Bar:** Tích hợp cố định dùng chung trên mọi trang.
* **AI Copilot:** Tự động tính toán độ cao để không bị Bottom Bar cố định che mất.

---

## Chi tiết các Task thực hiện

### Task 1 — Design Audit

Phân tích giao diện CoinMarketCap để thu thập các giá trị design tokens nền tảng trước khi xây dựng UI:

* **Container Width:** Tối đa `1920px`, padding ngang mặc định `16px`.
* **Breakpoints:** `1400px`, `1280px`, `1024px`, `768px`, `640px`, `430px`.
* **Typography:** `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.
* **Color Tokens:**
  * `--cmc-bg-primary`: `#171924`
  * `--cmc-text-primary`: `#ffffff`
  * `--cmc-text-secondary`: `#a1a7bb`
  * `--cmc-border-primary`: `#222531`
  * `--cmc-brand-primary`: `#6188ff`
  * `--cmc-positive`: `#16c784`
  * `--cmc-negative`: `#ea3943`
* **Spacing Scale:** `4px` (badge), `8px` (gap), `12px` (input padding), `16px` (cell/page padding), `24px` (section margin), `32px`/`48px` (block spacing).

---

### Task 2 — Frontend Foundation

* Cấu hình Path Alias trong `tsconfig.json`:

  ```json
  {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
  ```

* Tạo các stylesheet global:
  * `src/styles/reset.css`
  * `src/styles/theme.css`
* Import stylesheet từ `src/main.tsx`.
* Fix lỗi build do thiếu file `./styles/reset.css`.
* Chuẩn hóa cấu hình TypeScript cho Vite:
  * `moduleResolution: "bundler"`
  * `jsx: "react-jsx"`
  * `noEmit: true`
  * `verbatimModuleSyntax: true`
* Xác nhận production build:

  ```bash
  npm run build
  ```

---

### Task 3 — Shared Page Container

Tạo `PageContainer` để đảm bảo toàn bộ các section dùng chung chiều rộng và padding:

```text
src/components/layout/PageContainer/
├── PageContainer.tsx
├── PageContainer.module.css
└── index.ts
```

CSS chính:

```css
.container {
  width: 100%;
  max-width: 1920px;
  margin-inline: auto;
  padding-inline: var(--cmc-page-padding-inline);
}
```

Kết quả:

* Các section được căn cùng lề.
* Hỗ trợ màn hình desktop rộng.
* Cho phép truyền thêm `className` và toàn bộ props của thẻ `<div>`.

---

### Task 4 — Global Stats Bar

Xây dựng thanh thống kê thị trường ở đầu trang với các thông tin:

* **Cryptos**
* **Exchanges**
* **Market Cap**
* **24h Volume**
* **Dominance**
* **ETH Gas**
* **Fear & Greed**

Dữ liệu được tách riêng thành `globalStats.data.ts` để dễ thay thế bằng API thật trong các giai đoạn sau.

Kết quả:

* Component dùng chung trên mọi trang.
* Hỗ trợ horizontal scrolling trên màn hình nhỏ.
* Sẵn sàng chuyển từ mock data sang live data.

---

### Task 5 — Main Header

Xây dựng `MainHeader` gần với giao diện CoinMarketCap gồm:

* Logo thương hiệu.
* Primary navigation.
* Portfolio.
* Watchlist.
* Search box.
* Mobile search icon.
* Burger menu.
* Authentication account menu.

Responsive behavior:

* **Desktop:** Hiển thị đầy đủ navigation và search.
* **Tablet:** Thu gọn các action không quan trọng.
* **Mobile:** Search chuyển thành icon, navigation chuyển thành burger menu.

Sau khi tích hợp Auth:

* Chưa đăng nhập hiển thị nút `Log In`.
* Đã đăng nhập hiển thị avatar, username và account dropdown.
* Account dropdown gồm:
  * Email
  * Portfolio
  * Watchlist
  * Log Out

---

### Task 6 — Secondary Navigation

Xây dựng thanh điều hướng cấp hai gồm:

* Top
* Trending
* Watchlist
* Stocks
* Prediction Markets
* Most Visited
* New
* Gainers
* More

Tính năng:

* Horizontal scroll trên màn hình nhỏ.
* Active state dựa trên URL hash hiện tại.
* Dùng `aria-current="page"` cho accessibility.
* Không hard-code trạng thái active trong data.

---

### Task 7 — Market Overview

Hoàn thiện cụm Market Overview gồm nhiều component nhỏ để dễ tái sử dụng.

#### 7.1 MarketStatCard

Hiển thị:

* Title.
* Value.
* Percentage change.
* Mini chart hoặc gauge.
* Tone tăng/giảm.

#### 7.2 MiniSparkline

* Render bằng SVG.
* Tự động scale theo danh sách data points.
* Có màu xanh hoặc đỏ tùy trạng thái.
* Không dùng ảnh tĩnh.

#### 7.3 Fear & Greed Gauge

* Gauge SVG chia nhiều vùng màu.
* Marker dạng chấm tròn.
* Marker di chuyển theo giá trị.
* Hiển thị điểm và trạng thái ở giữa gauge.
* Không dùng kim chỉ thị cố định.

#### 7.4 Advertisement Card

* Responsive theo container.
* Hiển thị headline, CTA và badge `Ad`.
* Có thể thay bằng quảng cáo thật sau này.

#### 7.5 Trending Topics

* Danh sách chủ đề dạng pill.
* Horizontal scroll.
* Hỗ trợ nút điều hướng trái/phải.
* Dễ thay dữ liệu từ mock sang API.

#### 7.6 Network Filter

Các network:

* All Networks
* BSC
* Solana
* Base
* Ethereum
* Arbitrum
* Avalanche
* Polygon
* Optimism
* Sui
* More

Tinh chỉnh UI:

* Tăng chiều cao row.
* Pill cao `36px`.
* Tăng padding ngang.
* Border dưới ngăn cách table.
* Horizontal scroll trên mobile.

---

### Task 8 — Coin Table

Hoàn thiện bảng coin responsive, realtime và có khả năng tái sử dụng.

#### 8.1 Các cột dữ liệu

* Watchlist.
* Rank.
* Name.
* Price.
* 1h %.
* 24h %.
* 7d %.
* Market Cap.
* Volume (24h).
* Circulating Supply.
* Last 7 Days.

#### 8.2 Currency Formatter

Tách formatter ra utility riêng:

* `formatCurrency`
* `formatCompactCurrency`
* `formatSupply`

Xử lý an toàn cho:

* `null`
* `undefined`
* `NaN`
* Giá trị rất nhỏ
* Giá trị market cap lớn

#### 8.3 Percentage Cell

* Số dương: màu xanh, ký hiệu `▲`.
* Số âm: màu đỏ, ký hiệu `▼`.
* Giá trị bằng `0`: trạng thái trung tính.
* Format cố định theo số chữ số thập phân.

#### 8.4 Realtime Price Cell

* Giá tăng: chuyển màu xanh.
* Giá giảm: chuyển màu đỏ.
* Có transition nhẹ.
* Dựa trên `isUp` từ WebSocket update.

#### 8.5 Sparkline 7 ngày

* Dùng dữ liệu `sparkline7d`.
* Xanh nếu `priceChange7d >= 0`.
* Đỏ nếu `priceChange7d < 0`.
* Responsive theo chiều rộng cell.

#### 8.6 Loading State

* Skeleton rows.
* Không làm layout bị nhảy.
* Loading chỉ hiển thị khi chưa có snapshot data.

#### 8.7 Responsive Table

* Horizontal scroll.
* Giữ min-width cho table.
* Không làm mất cột quan trọng.
* Cột Name có thể sticky trên mobile.
* Table header sticky trên từng `<th>`.

#### 8.8 Reusable CoinTable

Cho phép truyền dữ liệu từ ngoài:

```ts
type CoinTableProps = {
  coins?: Coin[];
};
```

```ts
const displayedCoins = providedCoins ?? storeCoins;
```

Nhờ đó:

* Home Page hiển thị toàn bộ coin.
* Watchlist Page chỉ hiển thị coin đã lưu.

---

### Task 9 — Frontend Authentication

Xây dựng đầy đủ luồng đăng ký, đăng nhập và đăng xuất.

#### 9.1 Cấu trúc thư mục

```text
src/
├── api/
│   ├── authApi.ts
│   └── httpClient.ts
├── components/auth-modal/
├── store/useAuthStore.ts
└── types/auth.ts
```

#### 9.2 HTTP Client

Axios instance dùng chung:

* `baseURL` từ `VITE_API_URL`.
* Timeout 30 giây.
* Tự động đọc `accessToken` từ localStorage.
* Tự động gắn header:

  ```http
  Authorization: Bearer <accessToken>
  ```

* Khi server trả `401`, tự xóa auth state không còn hợp lệ.

#### 9.3 Auth Store

State:

```ts
accessToken: string | null;
user: AuthUser | null;
loading: boolean;
error: string | null;
isAuthenticated: boolean;
```

Actions:

```ts
login();
register();
logout();
clearError();
```

#### 9.4 Auth Modal

Hai chế độ:

* Log In.
* Sign Up.

Validation:

* Email bắt buộc.
* Email phải đúng định dạng.
* Password tối thiểu 6 ký tự.
* Confirm password phải khớp.

UX:

* Đóng bằng `Escape`.
* Đóng khi click overlay.
* Disable form khi đang request.
* Hiển thị error/success state.
* Đăng ký thành công tự chuyển sang Login.

#### 9.5 Persist Authentication

* Token lưu vào localStorage.
* User info lưu vào localStorage.
* Reload trang tự restore trạng thái đăng nhập.
* Logout xóa toàn bộ auth state.

---

### Task 10 — Watchlist Backend

Hoàn thiện API Watchlist theo từng tài khoản.

#### 10.1 Entity Constraint

```ts
@Unique('UQ_watchlist_user_coin', ['userId', 'coinId'])
```

Mục đích:

* Ngăn cùng user lưu trùng một coin.
* Đảm bảo dữ liệu nhất quán tại tầng database.

#### 10.2 Watchlist API

```http
GET    /api/crypto/watchlist
POST   /api/crypto/watchlist
DELETE /api/crypto/watchlist/:coinId
```

Tất cả endpoint được bảo vệ bởi `JwtAuthGuard`.

#### 10.3 Service Logic

* Normalize `coinId`.
* Kiểm tra duplicate.
* Trả `409 Conflict` nếu coin đã tồn tại.
* Trả `404 Not Found` nếu coin cần xóa không tồn tại.
* Chỉ truy cập Watchlist của user hiện tại.
* Lưu dữ liệu trực tiếp vào MySQL.

---

### Task 11 — Watchlist Frontend

#### 11.1 Watchlist API Client

Tạo các hàm:

```ts
fetchWatchlistApi();
addToWatchlistApi();
removeFromWatchlistApi();
```

#### 11.2 Watchlist State

Bổ sung vào `useCryptoStore`:

```ts
watchlistCoinIds: Set<string>;
watchlistLoading: boolean;
pendingWatchlistCoinIds: Set<string>;
watchlistError: string | null;
```

Actions:

```ts
fetchWatchlist();
toggleWatchlist();
clearWatchlistState();
```

#### 11.3 Optimistic Update

Flow khi click nút sao:

1. Cập nhật UI ngay.
2. Gửi API request.
3. Nếu request thất bại, rollback về trạng thái trước đó.
4. Chặn double-click bằng `pendingWatchlistCoinIds`.

#### 11.4 Coin Table Integration

Trạng thái button:

* `☆`: Chưa nằm trong Watchlist.
* `★`: Đã nằm trong Watchlist.
* `…`: Request đang xử lý.
* Chưa đăng nhập: Hiển thị thông báo yêu cầu đăng nhập.

#### 11.5 Persist Watchlist

* Watchlist được lưu vào MySQL.
* Reload trang vẫn giữ.
* Logout xóa Watchlist state ở frontend.
* Login lại tự load Watchlist theo `userId`.

---

### Task 12 — AppShell

Tạo layout root dùng chung:

```text
src/components/layout/AppShell/
├── AppShell.tsx
├── AppShell.module.css
└── index.ts
```

Cấu trúc:

```tsx
<GlobalStatsBar />
<MainHeader />
<SecondaryNavigation />

<main>{children}</main>

<SiteFooter />
<AiCopilot />
<BottomMarketBar />
```

Nguyên tắc:

* AppShell chỉ quản lý layout toàn cục.
* Không chứa nội dung riêng của Home Page hoặc Watchlist Page.
* Footer và Bottom Market Bar chỉ cần mount một lần.

---

### Task 13 — Crypto Store Initialization

#### Vấn đề

Khi chuyển qua lại giữa Home và Watchlist:

* CoinTable bị unmount/mount.
* `fetchCoins()` gọi lại.
* WebSocket disconnect/connect liên tục.
* CoinGecko bị gọi quá nhiều.
* Backend trả `429 Too Many Requests`.

#### Giải pháp

Bổ sung:

```ts
initialized: boolean;
initialize: () => Promise<void>;
```

`initialize()` chỉ chạy một lần:

1. Fetch snapshot coin ban đầu.
2. Kết nối WebSocket.
3. Giữ socket trong toàn bộ vòng đời ứng dụng.

Sửa `fetchCoins()`:

* Không gọi nếu đang loading.
* Không xóa dữ liệu cũ khi API lỗi.
* Không overwrite state nếu backend trả mảng rỗng.
* Giữ snapshot gần nhất trên UI.

Kết quả:

* Không fetch lại khi đổi route.
* Không reconnect socket khi đổi route.
* Giảm nguy cơ CoinGecko trả `429`.
* UX ổn định hơn khi external API gặp lỗi.

---

### Task 14 — Home Page & Watchlist Page

#### 14.1 Cấu trúc Pages

```text
src/pages/
├── HomePage/
│   ├── HomePage.tsx
│   └── index.ts
└── WatchlistPage/
    ├── WatchlistPage.tsx
    ├── WatchlistPage.module.css
    └── index.ts
```

#### 14.2 Home Page

```tsx
<>
  <MarketOverview />
  <CoinTable />
</>
```

Hiển thị toàn bộ dữ liệu coin.

#### 14.3 Watchlist Page

* Dùng chung Market Overview.
* Filter coin theo `watchlistCoinIds`.
* Chỉ truyền coin đã lưu vào CoinTable.
* Empty state khi chưa đăng nhập.
* Empty state khi Watchlist chưa có coin.

#### 14.4 Hash Routing

```text
#top       → HomePage
#watchlist → WatchlistPage
```

App lắng nghe:

```ts
window.addEventListener('hashchange', handleHashChange);
```

Ưu điểm:

* Không cần cài React Router ở giai đoạn hiện tại.
* Chuyển trang không reload.
* Dễ mở rộng sang Router thật ở tuần sau.

---

### Task 15 — Site Footer

Tạo Footer dùng chung trong `components/layout/SiteFooter`.

#### 15.1 Newsletter Section

* Heading.
* Description.
* Email input.
* Submit button.
* Visual chart/Bitcoin illustration.

#### 15.2 Footer Navigation

Các nhóm:

* Products.
* Company.
* Support.
* Socials.

#### 15.3 Brand & Preferences

* Logo.
* Language button.
* Currency button.

#### 15.4 Footer Bottom

* Copyright.
* App Store badge.
* Google Play badge.

#### 15.5 Responsive

* Desktop: 4 columns.
* Tablet: 2 columns.
* Mobile: 1 column.
* Newsletter chuyển từ 2 cột sang 1 cột.

---

### Task 16 — Bottom Market Bar

Tạo thanh market information cố định dưới viewport.

Thông tin hiển thị:

* Cryptos.
* Exchanges.
* Market Cap.
* 24h Volume.
* Dominance.
* ETH Gas.
* Fear & Greed.
* Get listed.
* API.

CSS chính:

```css
.bar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 900;
}
```

AppShell được bổ sung padding-bottom để nội dung cuối không bị che.

AI Copilot được nâng lên:

```css
bottom: calc(
  var(--cmc-bottom-market-bar-height, 32px) + 28px
);
```

Kết quả:

* Bottom Bar luôn hiển thị khi cuộn.
* Footer không bị che.
* Coin Table không bị che.
* AI Copilot không chồng lên Bottom Bar.
* Mobile hỗ trợ cuộn ngang market stats.

---

## Cấu trúc Frontend sau Week 5

```text
frontend/src/
├── api/
│   ├── authApi.ts
│   ├── httpClient.ts
│   └── watchlistApi.ts
├── components/
│   ├── ai-copilot/
│   ├── auth-modal/
│   ├── coin-table/
│   ├── layout/
│   │   ├── AppShell/
│   │   ├── BottomMarketBar/
│   │   ├── GlobalStatsBar/
│   │   ├── MainHeader/
│   │   ├── PageContainer/
│   │   ├── SecondaryNavigation/
│   │   └── SiteFooter/
│   └── market-overview/
├── pages/
│   ├── HomePage/
│   └── WatchlistPage/
├── store/
│   ├── useAuthStore.ts
│   └── useCryptoStore.ts
├── styles/
├── theme/
└── types/
```

---

## Environment Variables

### Frontend

```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=http://localhost:3001
```

### Backend

```env
GEMINI_API_KEY=your_gemini_api_key
```

---

## Checklist kiểm thử

### Authentication

* Đăng ký tài khoản mới thành công.
* Không cho đăng ký email trùng.
* Đăng nhập sai thông tin hiển thị lỗi.
* Đăng nhập đúng lưu JWT.
* Reload trang vẫn giữ trạng thái đăng nhập.
* Logout xóa token và user state.

### Watchlist

* Chưa đăng nhập không thể thêm coin.
* Click `☆` chuyển thành `★`.
* Reload trang vẫn giữ coin đã lưu.
* Click `★` chuyển về `☆`.
* Watchlist Page chỉ hiển thị coin đã lưu.
* Logout xóa Watchlist state frontend.
* Login lại tự tải dữ liệu từ MySQL.

### Routing

* `#top` hiển thị Home Page.
* `#watchlist` hiển thị Watchlist Page.
* Chuyển trang không gọi lại CoinGecko.
* Chuyển trang không reconnect WebSocket.

### Layout

* Footer hiển thị ở Home và Watchlist.
* Bottom Market Bar luôn nằm cuối viewport.
* AI Copilot nằm phía trên Bottom Bar.
* Nội dung cuối trang không bị che.
* Table và market stats hỗ trợ horizontal scroll trên mobile.

### Production

```bash
npm run build
```

Kết quả kỳ vọng:

* Không có TypeScript error.
* Không có unresolved import.
* Vite build thành công.
* Bundle được tạo trong `frontend/dist`.


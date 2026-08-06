# Week 6 — UI/UX Refinement, Search Modal & Market Navigation

## Tổng quan

Tuần 6 tập trung hoàn thiện giao diện frontend theo CoinMarketCap, cải thiện trải nghiệm điều hướng và bổ sung các tương tác UI còn thiếu.

Các hạng mục chính:

- Thiết kế lại Account Menu sau đăng nhập.
- Hoàn thiện trạng thái active và dropdown của Secondary Navigation.
- Bổ sung điều khiển cuộn ngang cho Trending Topics.
- Thiết kế lại Network Filter, dropdown và tìm kiếm network.
- Bổ sung nhóm Market Cap, Volume, Filters và Columns.
- Xây dựng Search Modal cho Main Header.
- Căn chỉnh spacing giữa Market Overview, Network Filter và Coin Table.
- Rà soát backend/API phục vụ dữ liệu realtime cho các market cards.

---

## Kết quả đạt được

- Frontend production build thành công bằng `npm run build`.
- Giao diện header và các menu gần hơn với CoinMarketCap.
- Secondary Navigation cập nhật active state theo URL hash.
- Dropdown `More` hoạt động và hỗ trợ đóng bằng click-outside hoặc `Escape`.
- Trending Topics có nút cuộn trái/phải bằng smooth scrolling.
- Network Filter có dropdown, search và lựa chọn network.
- Search Modal tìm kiếm trực tiếp trên dữ liệu coin hiện có trong Zustand Store.
- Không thay đổi backend, API authentication hoặc logic Watchlist trong quá trình UI refinement.

---

## Chi tiết các task thực hiện

### Task 1 — Tái cấu trúc thư mục Authentication UI

Di chuyển các component xác thực về cùng namespace:

```text
frontend/src/components/auth/
├── AccountMenu/
│   ├── AccountMenu.tsx
│   ├── AccountMenu.module.css
│   └── index.ts
└── AuthModal/
    ├── AuthModal.tsx
    ├── AuthModal.module.css
    └── index.ts
```

Lợi ích:

- Gom các component liên quan đến authentication vào cùng thư mục.
- Giảm sự phân tán giữa `auth-modal` và các component tài khoản.
- Dễ mở rộng Settings, Profile hoặc Preferences trong các tuần sau.

Logic đăng nhập, đăng ký và đăng xuất trong `useAuthStore` được giữ nguyên.

---

### Task 2 — Account Menu

Thiết kế lại dropdown tài khoản theo giao diện CoinMarketCap.

Các khu vực hiển thị:

- Avatar và tên người dùng.
- Email tài khoản.
- API Dashboard.
- Language và Currency.
- Theme selector dạng segmented control.
- CMC AI Subscription.
- CMC AI Assistant.
- My Community Page.
- Settings.
- Log out.
- Get Listed và API actions.

Nguyên tắc triển khai:

- `AccountMenu` là presentational component.
- Dữ liệu user được truyền từ `MainHeader`.
- Logout vẫn gọi callback hiện có.
- Không đọc token hoặc gọi API trực tiếp trong Account Menu.
- Các mục chưa có nghiệp vụ hiện chỉ hiển thị UI.

---

### Task 3 — Main Header Improvements

#### 3.1 Portfolio và Watchlist

- Thêm icon cho Portfolio.
- Thêm icon ngôi sao cho Watchlist.
- Watchlist tiếp tục sử dụng `href="#watchlist"`.
- Không thay đổi hash routing đang hoạt động.

#### 3.2 Account Trigger

- Tăng kích thước avatar.
- Cải thiện border, hover và focus state.
- Giới hạn chiều rộng username bằng ellipsis.
- Responsive ẩn username ở viewport nhỏ.

#### 3.3 Search Entry

Search Modal có thể mở bằng:

- Click ô Search trên desktop.
- Click search icon trên mobile.
- Nhấn phím `/` khi không nhập liệu trong input hoặc textarea.

---

### Task 4 — Search Modal

Tạo component mới:

```text
frontend/src/components/search/SearchModal/
├── SearchModal.tsx
├── SearchModal.module.css
└── index.ts
```

Các chức năng:

- Tự focus input khi mở.
- Tìm kiếm theo tên hoặc symbol coin.
- Dùng dữ liệu `coins` hiện có từ `useCryptoStore`.
- Hiển thị logo, rank, price, market cap, volume 24h và biến động 24h.
- Hiển thị empty state khi không tìm thấy kết quả.
- Đóng bằng nút close, click backdrop hoặc phím `Escape`.
- Khóa scroll của body khi modal đang mở.
- Responsive full-screen trên mobile nhỏ.

Luồng dữ liệu:

```text
CoinGecko
   ↓
Backend / WebSocket
   ↓
useCryptoStore.coins
   ↓
SearchModal local filtering
```

Search Modal không tạo API search mới và không thay đổi backend.

---

### Task 5 — Secondary Navigation

Khắc phục trạng thái active bị hard-code tại tab `Top`.

Active state hiện được xác định từ:

```ts
window.location.hash
```

Kết quả:

- Click tab sẽ di chuyển màu chữ và underline xanh.
- `aria-current="page"` cập nhật theo tab hiện tại.
- Hash không thuộc secondary navigation mặc định hiển thị `Top` active.
- Không cần lưu `active: true` trong file data.

#### Dropdown More

Các mục:

- AI.
- RWA Protocols.
- Gaming.
- DePIN.
- More Categories.
- Token unlocks.
- NFTs.
- Yield.

Behavior:

- Click `More` để toggle dropdown.
- Chevron xoay theo trạng thái.
- Click-outside hoặc `Escape` để đóng.
- Chọn mục cập nhật URL hash.
- Bốn mục đầu có icon; bốn mục cuối căn theo cột icon nhưng không hiển thị icon.
- Dropdown được đặt ngoài horizontal scroller để không bị cắt bởi overflow.

---

### Task 6 — Trending Topics

#### 6.1 Chevron SVG

Thay ký tự font `‹` và `›` bằng SVG chevron có `viewBox` cân đối.

Kết quả:

- Icon nằm chính giữa button tròn.
- Không phụ thuộc font metrics của trình duyệt.
- Hai hướng trái/phải có kích thước đồng nhất.

#### 6.2 Horizontal Scroll Controls

Hai button điều khiển trực tiếp vùng scroller:

```ts
scroller.scrollBy({
  left: direction === 'left' ? -distance : distance,
  behavior: 'smooth',
});
```

Khoảng cuộn:

- Bằng khoảng 75% chiều rộng vùng hiển thị.
- Tối thiểu 240px.
- Tự thích nghi theo viewport.

---

### Task 7 — Network Filter

Thiết kế lại Network Filter theo giao diện website gốc.

#### 7.1 Featured Networks

Hiển thị trực tiếp:

- All Networks.
- BSC.
- Solana.
- Base.
- Ethereum.

#### 7.2 More Networks

Dropdown bổ sung:

- Arbitrum.
- Avalanche.
- Polygon.
- Optimism.
- Sui.

#### 7.3 Dropdown Search

- Tự focus input khi dropdown mở.
- Lọc network không phân biệt chữ hoa/thường.
- Hiển thị `No networks found` khi không có kết quả.
- Network đang chọn có dấu check.
- Chọn network cập nhật active state và đóng dropdown.
- Click-outside hoặc `Escape` để đóng.
- Reset search query khi dropdown đóng.

State hiện tại chỉ thuộc UI Network Filter. Việc chọn network chưa lọc dữ liệu trong Coin Table.

#### 7.4 Additional Filter Controls

Bổ sung nhóm UI bên phải:

- Market Cap.
- Volume (24h).
- Filters.
- Columns.

`Columns` đã được kết nối với Coin Table, cho phép bật/tắt 7 metric hiện có, áp dụng thay đổi, hủy hoặc khôi phục mặc định. `Filters` hỗ trợ lọc thật theo Visible Coin Range, Market Cap, Price Change 24h và Volume 24h; các trường chưa có dữ liệu được đánh dấu `Coming soon`. Market Cap và Volume quick filters vẫn mới là UI. Nhóm control tự ẩn dưới `1200px` để tránh overflow.

---

### Task 8 — Layout Spacing Polish

Chuẩn hóa khoảng cách giữa:

```text
Trending Topics
      ↓
Network Filter
      ↓
Coin Table
```

Điều chỉnh:

- Gap trong Market Overview từ 12px xuống 8px.
- Network toolbar từ 48px xuống 40px.
- Coin Table margin-top từ 12px xuống 8px.
- Giữ khoảng cards → Trending Topics bằng margin bổ sung cho `topRow`.
- Loại bỏ border thừa dưới Network Filter.

Mục tiêu là tạo khoảng nhìn thấy gần nhau và đồng đều giữa ba khu vực.

---

### Task 9 — Audit khả năng Realtime cho Market Cards

Đã scan backend mà không thay đổi source code.

#### Dữ liệu backend hiện có

`CryptoService` gọi CoinGecko để lấy:

- Current price.
- Price change 1h, 24h và 7d.
- Market cap từng coin.
- Volume 24h.
- Circulating supply.
- Sparkline 7 ngày.
- Last updated.

`CryptoGateway` phát event:

```text
price_updates
```

Chu kỳ mặc định:

```text
180000ms (3 phút)
```

#### Trạng thái bốn market cards

| Card | Trạng thái hiện tại | Nguồn free khả dụng |
|---|---|---|
| Global Market Cap | Static UI | CoinMarketCap Keyless hoặc CoinGecko Global |
| Fear & Greed | Static UI | CoinMarketCap Keyless hoặc Alternative.me |
| CMC20 | Static UI | CoinMarketCap Keyless CMC20 |
| Liquidations | Static UI | Public exchange streams hoặc paid aggregator |

Kết luận:

- Global Market Cap, Fear & Greed và CMC20 có thể lấy từ API miễn phí.
- Liquidations toàn thị trường cần tự tổng hợp nhiều sàn hoặc sử dụng dịch vụ trả phí như CoinGlass.
- Chưa tích hợp các API này trong Week 6 để tránh ảnh hưởng backend trước khi tạo Git checkpoint.

---

## Các file chính được bổ sung hoặc cập nhật

```text
frontend/src/components/
├── auth/
│   ├── AccountMenu/
│   └── AuthModal/
├── layout/
│   ├── MainHeader/
│   └── SecondaryNavigation/
├── market-overview/
│   ├── MarketOverview/
│   ├── NetworkFilter/
│   └── TrendingTopics/
├── search/
│   └── SearchModal/
└── coin-table/
    └── CoinTable/
```

---

## Kiểm thử

### Main Header

- Portfolio và Watchlist hiển thị icon.
- Watchlist điều hướng tới `#watchlist`.
- Account Menu mở và đóng bình thường.
- Logout tiếp tục sử dụng logic cũ.

### Search Modal

- Click Search mở modal.
- Phím `/` mở modal.
- Escape đóng modal.
- Click backdrop đóng modal.
- Search tìm theo tên và symbol.
- Mobile hiển thị full-screen.

### Secondary Navigation

- Underline di chuyển theo URL hash.
- More dropdown mở/đóng đúng.
- Click-outside và Escape hoạt động.
- Dropdown không bị cắt bởi horizontal overflow.

### Trending Topics

- Chevron được căn giữa.
- Nút trái/phải cuộn đúng hướng.
- Smooth scrolling hoạt động.

### Network Filter

- More dropdown mở đúng vị trí.
- Search network hoạt động.
- Active network có check mark.
- Empty state hiển thị đúng.
- Dropdown không vượt viewport.

### Production Build

```bash
cd frontend
npm run build
```

Kết quả:

- TypeScript compile thành công.
- Vite production build thành công.
- Không có unresolved import trong các component Week 6.

---

## Hạn chế hiện tại

- Market cards vẫn dùng dữ liệu static.
- Network selection chưa lọc Coin Table.
- Market Cap và Volume quick filters mới chỉ có UI.
- Network, Category, Exchange, FDV, Volume Change và Age trong Filter Modal chưa có dữ liệu backend.
- Một số mục trong Account Menu chưa có nghiệp vụ thật.
- Search Modal chỉ tìm trong danh sách coin hiện có của store.
- Chưa có route Coin Detail cho từng kết quả search.
- Liquidation toàn thị trường chưa có nguồn dữ liệu tổng hợp.

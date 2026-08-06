# Week 7 — Market Intelligence, User Preferences & Network Filtering

## Tổng quan

Tuần 7 tập trung biến các thành phần UI tĩnh thành chức năng có dữ liệu và trạng thái thực tế. Hệ thống được bổ sung Market Overview API, bộ lọc bảng coin, lọc theo blockchain network, tùy chỉnh ngôn ngữ/tiền tệ/theme và luồng hỏi nhanh AI Copilot từ Trending Topics.

Các hạng mục chính:

- Kết nối dữ liệu thật cho Market Overview và Bottom Market Bar.
- Cho phép tùy chỉnh cột và lọc dữ liệu Coin Table.
- Lọc coin theo blockchain network.
- Chuyển đổi English/Vietnamese, USD/VND và Light/Dark/System.
- Gửi Trending Topic trực tiếp tới AI Copilot.
- Hoàn thiện Search, Footer và Account Menu theo preferences.

---

## Kết quả đạt được

- Backend và frontend production build thành công.
- Market Cap, Volume 24h, Dominance và Fear & Greed sử dụng dữ liệu API.
- Network Filter thực sự thay đổi dữ liệu trong Coin Table.
- Các lựa chọn Language, Currency và Theme được lưu sau khi reload.
- Trending Topic tự mở AI Copilot, gửi prompt và nhận câu trả lời.
- Người dùng có thể chọn cột, giới hạn số dòng và lọc theo Market Cap, Volume hoặc biến động 24h.
- Bottom Market Bar không còn phụ thuộc hoàn toàn vào dữ liệu hard-code.

---

## Task 1 — Market Overview API

Tạo service backend:

```text
backend/src/crypto/market-overview.service.ts
```

Endpoint:

```http
GET /api/crypto/market-overview
```

Dữ liệu trả về:

```ts
interface MarketOverviewResponse {
  globalMarketCap: MarketOverviewMetric | null;
  globalMetrics: GlobalMetrics | null;
  cmc20: MarketOverviewMetric | null;
  fearAndGreed: FearAndGreedMetric | null;
  fetchedAt: string;
  stale: boolean;
}
```

Nguồn dữ liệu:

- CoinMarketCap Global Metrics.
- CoinMarketCap CMC20 Index.
- CoinMarketCap Fear & Greed Index.

Service sử dụng cache 5 phút và `Promise.allSettled()` để một nguồn lỗi không làm hỏng toàn bộ response. Nếu refresh thất bại, backend ưu tiên trả cache gần nhất và đánh dấu `stale: true`.

Frontend sử dụng:

```text
marketOverviewApi
    ↓
useMarketOverviewStore
    ↓
MarketOverview + BottomMarketBar
```

---

## Task 2 — Bottom Market Bar

Bottom Market Bar được chuyển từ dữ liệu tĩnh sang dữ liệu live cho:

- Số lượng cryptocurrency.
- Số lượng exchange.
- Tổng Market Cap và biến động 24h.
- Tổng Volume 24h và biến động 24h.
- BTC Dominance.
- ETH Dominance.
- Fear & Greed.

Hai chỉ số chưa có API phù hợp trong project:

- ETH Gas.
- Boosts.

Hai trường này hiển thị `N/A` thay vì số hard-code để tránh gây hiểu nhầm.

---

## Task 3 — Coin Table Filters & Columns

### Column Settings

Người dùng có thể bật/tắt và sắp xếp các cột:

- 1h %.
- 24h %.
- 7d %.
- Market Cap.
- Volume 24h.
- Circulating Supply.
- 7d Price%.

State được quản lý bởi:

```text
frontend/src/store/useTableColumnsStore.ts
```

### Filter Modal

Các điều kiện lọc gồm:

- Market Cap min/max.
- Volume 24h min/max.
- Biến động 24h min/max.
- Số lượng coin hiển thị.

State được quản lý bởi:

```text
frontend/src/store/useTableFiltersStore.ts
```

Coin Table kết hợp các điều kiện trong một pipeline:

```text
coins
  → network filter
  → market/volume/change filters
  → visible row limit
  → render selected columns
```

---

## Task 4 — Network Filtering

Network Filter không còn chỉ đổi active state. Network đang chọn được lưu trong:

```text
frontend/src/store/useNetworkFilterStore.ts
```

Backend bổ sung trường:

```ts
networks: string[];
```

Platform của coin được lấy từ CoinGecko:

```http
GET /api/v3/coins/list?include_platform=true
```

Dữ liệu mapping network được cache 6 giờ để tránh gọi danh sách platform liên tục.

Các native coin có fallback mapping, ví dụ:

```text
ETH  → Ethereum
BNB  → BSC
SOL  → Solana
AVAX → Avalanche
ADA  → Cardano
```

Behavior:

- `All Networks`: hiển thị toàn bộ coin hiện có.
- Chọn một network: chỉ hiển thị coin có network tương ứng.
- Chọn network trong dropdown `More`: áp dụng cùng logic với featured network.
- Nếu không có coin phù hợp trong dataset hiện tại, Coin Table hiển thị empty state.

Lưu ý: kết quả lọc phụ thuộc danh sách coin mà endpoint `/api/crypto` đang tải, không phải toàn bộ token tồn tại trên blockchain.

---

## Task 5 — Trending Topics → AI Copilot

Tạo event dùng chung:

```text
frontend/src/components/ai-copilot/aiCopilot.events.ts
```

Luồng xử lý:

```text
Click Trending Topic
        ↓
dispatch ai-copilot:ask
        ↓
AI Copilot tự mở
        ↓
gửi prompt tới /api/ai/chat
        ↓
hiển thị câu trả lời
```

Prompt sử dụng đúng ngôn ngữ hiện tại của người dùng.

---

## Task 6 — Language, Currency & Theme

Preferences được quản lý tập trung tại:

```text
frontend/src/store/usePreferencesStore.ts
```

### Language

Hỗ trợ:

- English.
- Tiếng Việt.

Các khu vực đã đồng bộ gồm Header, navigation, Market Overview, Trending Topics, Network Filter, Coin Table, Footer, Account Menu và Bottom Market Bar.

### Currency

Hỗ trợ:

- USD.
- VND.

Currency được áp dụng cho:

- Giá coin.
- Market Cap.
- Volume 24h.
- Search Modal.
- Market Overview.
- Bottom Market Bar.

VND sử dụng format riêng:

```text
triệu ₫
tỷ ₫
nghìn tỷ ₫
triệu tỷ ₫
```

Tỷ giá hiện tại được cấu hình trong frontend:

```ts
export const USD_TO_VND_RATE = 26_000;
```

Đây là tỷ giá cấu hình, chưa phải tỷ giá live từ API ngoại hối.

### Theme

Hỗ trợ:

- Light.
- Dark.
- System.

`System` theo dõi:

```css
prefers-color-scheme
```

Khi hệ điều hành thay đổi theme, giao diện tự cập nhật nếu người dùng đang chọn `System`.

### Persistence

Preferences được lưu bằng:

```text
localStorage key: cmc-preferences
```

---

## Cấu trúc file chính

```text
backend/src/crypto/
├── crypto.controller.ts
├── crypto.gateway.ts
├── crypto.module.ts
├── crypto.service.ts
└── market-overview.service.ts

frontend/src/
├── api/
│   └── marketOverviewApi.ts
├── components/
│   ├── ai-copilot/
│   │   └── aiCopilot.events.ts
│   ├── coin-table/
│   │   ├── ColumnSettingsModal/
│   │   └── FilterModal/
│   ├── layout/BottomMarketBar/
│   └── market-overview/NetworkFilter/
└── store/
    ├── useMarketOverviewStore.ts
    ├── useNetworkFilterStore.ts
    ├── usePreferencesStore.ts
    ├── useTableColumnsStore.ts
    └── useTableFiltersStore.ts
```

---

## Cách chạy và kiểm tra

### Backend

```bash
cd backend
npm install
npm run build
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm run build
npm run dev
```

### Checklist thủ công

1. Click từng Trending Topic và xác nhận AI Copilot tự gửi câu hỏi.
2. Chuyển English/Vietnamese và reload trang.
3. Chuyển USD/VND và kiểm tra giá, Market Cap, Volume.
4. Chuyển Light/Dark/System và thay đổi theme hệ điều hành.
5. Bật/tắt cột trong Columns Modal.
6. Áp dụng Market Cap, Volume và 24h filters.
7. Chọn BSC, Solana, Base, Ethereum và network trong More.
8. Chọn All Networks để reset network filter.
9. Kiểm tra Bottom Market Bar với dữ liệu API.

---

## Commit và Release Tag

Conventional Commit đề xuất:

```bash
git commit -m "feat: add market filtering and display preferences"
```

Tạo tag Week 7:

```bash
git tag -a week-7 -m "Week 7 - Market filtering and display preferences"
git push --atomic origin main week-7
```

---

## Hướng phát triển tiếp theo

- Thay tỷ giá VND cấu hình bằng exchange-rate API có cache.
- Tăng phạm vi coin dataset để network filter có nhiều kết quả hơn.
- Bổ sung ETH Gas API và Boosts API.
- Đồng bộ i18n bằng dictionary/module chuyên biệt thay vì map cục bộ.
- Thêm URL query cho filter để có thể chia sẻ trạng thái.
- Thêm unit test cho formatter, filter pipeline và network mapping.
- Thêm Playwright visual regression cho Light/Dark, English/Vietnamese và các viewport.

---

## Tổng kết

Week 7 đã chuyển nhiều thành phần từ giao diện mô phỏng sang chức năng có state và dữ liệu thực tế. Market Overview, Network Filter, Coin Table, Preferences và AI Copilot hiện phối hợp qua các store và API rõ ràng hơn, tạo nền tảng để tiếp tục mở rộng dữ liệu, kiểm thử và responsive trong các tuần tiếp theo.

## Tuần 1 - Xây dựng nền tảng Monolith
## Chức năng đã hoàn thành

### Frontend
- Xây dựng giao diện bằng React + TypeScript
- Khởi tạo dự án với Vite
- Thiết kế giao diện bằng Ant Design
- Quản lý trạng thái với Zustand
- Gọi API bằng Axios
- Hiển thị danh sách tiền điện tử với giao diện responsive

### Backend
- Xây dựng API bằng NestJS
- Thiết kế RESTful API
- Tích hợp CoinGecko API để lấy dữ liệu tiền điện tử
- Cấu hình biến môi trường
- Tổ chức mã nguồn theo kiến trúc module của NestJS

---

## Kiến trúc hệ thống

```text
Frontend (React)
        │
        ▼
Backend (NestJS Monolith)
        │
        ▼
CoinGecko API
```

---

## Công nghệ sử dụng

### Frontend
- React
- TypeScript
- Vite
- Ant Design
- Zustand
- Axios

### Backend
- NestJS
- TypeScript
- Axios

---

## Cấu trúc dự án

```text
1CoinMarketCap
│
├── frontend/
└── backend/
```

---

## Hướng dẫn chạy dự án

### Khởi động Backend

```bash
cd backend
npm install
npm run start:dev
```

### Khởi động Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Mục tiêu đạt được

- Hiểu và áp dụng kiến trúc Monolith.
- Xây dựng ứng dụng Full-stack với React và NestJS.
- Tích hợp API của bên thứ ba (CoinGecko).
- Tổ chức mã nguồn theo chuẩn module của NestJS.
- Chuẩn bị nền tảng để chuyển đổi sang kiến trúc Microservices ở Tuần 2.
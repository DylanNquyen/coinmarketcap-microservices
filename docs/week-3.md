# Tuần 3: Kong API Gateway & Realtime Price Updates (WebSocket)

Nhiệm vụ chính của Tuần 3 là chuyển đổi toàn bộ luồng giao tiếp của ứng dụng qua một cổng duy nhất (**Kong API Gateway**) và tích hợp cơ chế cập nhật giá theo thời gian thực (**Realtime Price Updates**) thông qua **WebSocket (Socket.io)** kết hợp với **RxJS**[cite: 3].

---

## Mục Tiêu Đã Hoàn Thành

1. **Dựng Kong API Gateway**: Sử dụng Docker Compose để quản lý Kong Gateway (với PostgreSQL Database) đứng trước các Microservices[cite: 2, 3].
2. **Định Tuyến Cổng (Routing)**: Cấu hình Kong Gateway nhận các request ở cổng `8000` và chuyển tiếp đến đúng dịch vụ (`auth-ms` ở port 3002, `backend` ở port 3001)[cite: 2, 3].
3. **Cơ Chế WebSocket Gateway & RxJS**: Tích hợp `Socket.io` và RxJS `interval` tại `backend` để biến động giá coin tự động mà không lo bị dính lỗi Rate Limit (HTTP 429) từ API công khai[cite: 1, 2, 3].
4. **Cập Nhật Giao Diện Realtime**: Cập nhật Zustand Store ở Frontend để nhận event `price_updates` và tạo hiệu ứng nhấp nháy xanh/đỏ sinh động trên Ant Design Table[cite: 1, 3].

---

## Kiến Trúc Hệ Thống Tuần 3

```text
[ React Frontend (Port 5173) ]
      │
      ├─── (REST Requests) ─────────► [ Kong API Gateway (Port 8000) ]
      │                                       │
      │                                       ├── /api/auth/*  ──► [ auth-ms (Port 3002) ]
      │                                       └── /api/crypto/* ──► [ backend (Port 3001) ]
      │
      └─── (WebSocket Connection) ───────────────────────────────► [ backend WS (Port 3001) ]
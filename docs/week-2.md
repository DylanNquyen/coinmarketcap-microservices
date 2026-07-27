# Tuần 2 - Tách Microservices & Docker Database

Sau khi hoàn thành kiến trúc **Monolith** ở Tuần 1, dự án được nâng cấp lên **Microservices Architecture** nhằm tăng khả năng mở rộng, tách biệt trách nhiệm giữa các dịch vụ và chuẩn bị cho việc triển khai API Gateway ở các giai đoạn tiếp theo.

---

# Mục tiêu

- Chuyển đổi Backend từ Monolith sang Microservices.
- Mỗi Microservice sử dụng một cơ sở dữ liệu MySQL riêng.
- Sử dụng Docker Compose để quản lý Database.
- Xây dựng Auth Service với JWT Authentication.
- Xây dựng Crypto Service quản lý dữ liệu Coin và Watchlist.
- Thiết lập giao tiếp nội bộ giữa các Microservices để xác thực JWT.

---

# Các chức năng đã hoàn thành

## 1. Tách Backend thành 2 Microservices

### Auth Service (`auth-ms`)

Chạy tại:

```text
http://localhost:3002
```

Chức năng:

- Đăng ký tài khoản
- Đăng nhập
- Mã hóa mật khẩu bằng bcrypt
- Sinh JWT Access Token
- Xác thực JWT Token
- Cung cấp API `/verify` cho các service khác

---

### Crypto Service (`backend`)

Chạy tại:

```text
http://localhost:3001
```

Chức năng:

- Lấy danh sách Top Coin từ CoinGecko
- Quản lý Watchlist
- Kết nối Database riêng
- Gọi sang Auth Service để xác thực Token trước khi xử lý các API yêu cầu đăng nhập

---

# Docker Compose

Triển khai hai MySQL Database độc lập bằng Docker Compose.

| Database | Container | Port |
|----------|-----------|------|
| auth_db | auth_mysql_db | 3306 |
| crypto_db | crypto_mysql_db | 3307 |

Mỗi Microservice sử dụng Database riêng theo mô hình:

> **Database per Service**

Điều này giúp:

- Không chia sẻ dữ liệu trực tiếp
- Dễ mở rộng
- Dễ triển khai
- Giảm phụ thuộc giữa các service

---

# Authentication

Đã triển khai đầy đủ quy trình xác thực:

### Đăng ký

```
POST /api/auth/register
```

- Kiểm tra email tồn tại
- Hash mật khẩu bằng bcrypt
- Lưu người dùng vào auth_db

---

### Đăng nhập

```
POST /api/auth/login
```

Sau khi đăng nhập thành công:

- Kiểm tra mật khẩu
- Sinh JWT Token
- Trả về Access Token

---

### Verify Token

```
POST /api/auth/verify
```

Crypto Service sẽ gọi API này để xác thực JWT trước khi cho phép truy cập các API được bảo vệ.

---

# Watchlist

Triển khai Entity Watchlist trong `crypto_db`.

Thông tin lưu gồm:

- User ID
- Coin ID
- Thời gian tạo

API:

### Thêm Watchlist

```
POST /api/crypto/watchlist
```

Yêu cầu:

```
Authorization: Bearer <access_token>
```

---

### Lấy Watchlist

```
GET /api/crypto/watchlist
```

Yêu cầu:

```
Authorization: Bearer <access_token>
```

User ID được lấy trực tiếp từ JWT Token sau khi Auth Service xác thực thành công.

---

# Giao tiếp giữa Microservices

Kiến trúc xác thực:

```text
Client
   │
   ▼
Crypto Service
   │
   │ Verify Token
   ▼
Auth Service
   │
   ▼
JWT Valid
   │
   ▼
Crypto Service xử lý yêu cầu
```

Quy trình hoạt động:

1. Người dùng đăng nhập tại Auth Service.
2. Auth Service trả về JWT Token.
3. Client gửi JWT khi gọi Watchlist API.
4. Crypto Service chuyển Token sang Auth Service.
5. Auth Service xác thực Token.
6. Nếu hợp lệ, Crypto Service tiếp tục xử lý yêu cầu.

---

# 🏗 Kiến trúc hệ thống

```text
                 React Frontend
                        │
                        ▼
        ┌───────────────────────────┐
        │      Crypto Service       │
        │      (Port 3001)          │
        └─────────────┬─────────────┘
                      │
        Verify JWT Token (HTTP)
                      │
                      ▼
        ┌───────────────────────────┐
        │       Auth Service        │
        │      (Port 3002)          │
        └─────────────┬─────────────┘
                      │
         JWT Authentication
                      │
        ┌─────────────┴─────────────┐
        ▼                           ▼
   auth_db                     crypto_db
(MySQL - Docker)          (MySQL - Docker)
```

---

# 🛠 Công nghệ sử dụng

## Frontend

- React
- TypeScript
- Vite
- Ant Design
- Zustand
- Axios

## Backend

- NestJS
- TypeORM
- MySQL
- JWT
- Passport
- bcrypt

## DevOps

- Docker
- Docker Compose

---

# Cấu trúc dự án

```text
1CoinMarketCap
│
├── frontend/
├── backend/
├── auth-ms/
├── docker-compose.yml
└── README.md
```

---

# Hướng dẫn chạy dự án

## Khởi động Database

```bash
docker compose up -d
```

## Chạy Crypto Service

```bash
cd backend
npm install
npm run start:dev
```

## Chạy Auth Service

```bash
cd auth-ms
npm install
npm run start:dev
```

## Chạy Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# Kiến thức đạt được

- Hiểu kiến trúc Microservices.
- Tách Backend thành nhiều dịch vụ độc lập.
- Thiết kế mô hình Database per Service.
- Sử dụng Docker Compose để quản lý môi trường phát triển.
- Triển khai JWT Authentication.
- Giao tiếp giữa các Microservices thông qua HTTP.
- Áp dụng Guard để bảo vệ API.
- Quản lý dữ liệu Watchlist bằng TypeORM và MySQL.

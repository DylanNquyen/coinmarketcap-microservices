# Week 4 - AI Copilot Integration

## Mục tiêu

Tích hợp **Google Gemini AI** vào dự án **CoinMarketCap Microservices** nhằm xây dựng một **AI Copilot** có khả năng trả lời các câu hỏi liên quan đến thị trường tiền mã hóa dựa trên **dữ liệu giá thực tế**, đồng thời tích hợp hoàn chỉnh với kiến trúc Microservices và Kong API Gateway.

---

# Kiến trúc tổng quan

Hệ thống được xây dựng theo kiến trúc **Microservices**, trong đó toàn bộ request từ Frontend đều đi qua **Kong API Gateway** trước khi được định tuyến đến từng dịch vụ tương ứng.

```text
                           +----------------------+
                           |      Frontend        |
                           |   React + Ant Design |
                           +----------+-----------+
                                      |
                                      |
                                      v
                          +------------------------+
                          |   Kong API Gateway     |
                          |    (Port 8000/8001)    |
                          +-----------+------------+
                                      |
                  +-------------------+-------------------+
                  |                                       |
                  |                                       |
                  v                                       v
      +------------------------+             +-------------------------+
      |      Auth Service      |             |     Crypto Service      |
      |     NestJS (3002)      |             |     NestJS (3001)       |
      +-----------+------------+             +------------+------------+
                  |                                         |
                  |                                         |
                  v                                         v
        +--------------------+                 +-------------------------+
        |      MySQL         |                 |         MySQL           |
        |     auth_db        |                 |       crypto_db         |
        +--------------------+                 +------------+------------+
                                                            |
                                      +---------------------+----------------------+
                                      |                                            |
                                      v                                            v
                           +---------------------+                   +----------------------+
                           |    CoinGecko API    |                   |   Google Gemini AI   |
                           +---------------------+                   +----------------------+
```

---

# Luồng xử lý AI Copilot

Khi người dùng gửi câu hỏi đến AI Copilot, hệ thống xử lý theo trình tự sau:

```text
Người dùng
      │
      ▼
Frontend (React)
      │
      ▼
Kong Gateway
      │
      ▼
AI Controller
      │
      ▼
AI Service
      │
      ├────────────► CryptoService
      │                    │
      │                    ▼
      │             CoinGecko API
      │
      ▼
Ghép dữ liệu thị trường vào System Prompt
      │
      ▼
Google Gemini AI
      │
      ▼
Sinh câu trả lời
      │
      ▼
Frontend hiển thị kết quả
```

Thay vì để AI tự trả lời bằng kiến thức chung, Backend sẽ chủ động lấy dữ liệu thị trường mới nhất rồi truyền vào **System Prompt**, giúp AI phân tích dựa trên dữ liệu thực tế.

---

# Các tính năng đã hoàn thành

## 1. Tích hợp Gemini AI vào Backend

Đã xây dựng một **AI Module** riêng trong **BE-ms (Crypto Service)**.

### Công nghệ sử dụng

- Google Gemini API (`@google/genai`)
- NestJS
- TypeScript

### API

```
POST /api/ai/chat
```

Ví dụ Request

```json
{
  "prompt": "BTC đang giá bao nhiêu?"
}
```

Ví dụ Response

```json
{
  "reply": "Hiện tại Bitcoin..."
}
```

---

## 2. AI có ngữ cảnh (Context-aware AI)

Backend sẽ lấy dữ liệu thị trường mới nhất từ **CryptoService** trước khi gửi câu hỏi tới Gemini AI.

Thông tin được truyền vào AI bao gồm:

- Giá hiện tại của các đồng coin
- Biến động giá trong 24 giờ
- Danh sách các đồng coin có vốn hóa lớn

Nhờ đó AI có thể:

- Trả lời dựa trên dữ liệu thực tế.
- Phân tích xu hướng thị trường.
- Đưa ra gợi ý phân bổ danh mục.
- Hạn chế việc trả lời theo kiến thức cũ.

---

## 3. Xây dựng giao diện AI Copilot

Đã phát triển giao diện Chatbot AI trên Frontend.

Các chức năng đã hoàn thành:

- Floating AI Button
- Chat Drawer
- Bong bóng hội thoại User / AI
- Loading Indicator
- Auto Scroll
- Hỗ trợ Enter để gửi
- Shift + Enter để xuống dòng
- Lưu lịch sử trò chuyện bằng LocalStorage
- Xóa lịch sử chat

---

## 4. Tích hợp Kong API Gateway

AI Endpoint được expose thông qua Kong Gateway.

```
Frontend
      │
      ▼
Kong Gateway
      │
      ▼
Backend AI Module
      │
      ▼
Google Gemini AI
```

Route AI:

```
/api/ai/*
```

Điều này giúp toàn bộ Frontend chỉ giao tiếp với một Gateway duy nhất thay vì gọi trực tiếp từng Microservice.

---

## 5. Biến môi trường

### Backend

```env
GEMINI_API_KEY=YOUR_API_KEY
```

### Frontend

```env
VITE_API_URL=http://localhost:8000
```

---

## 6. Tự động cấu hình Kong Gateway

Để thuận tiện cho việc dựng lại môi trường phát triển, dự án bổ sung thư mục:

```text
scripts/
└── setup-kong.ps1
```

Script này tự động:

- Tạo hoặc cập nhật `auth-service`
- Tạo hoặc cập nhật `crypto-service`
- Tạo Route `/api/auth`
- Tạo Route `/api/crypto`
- Tạo Route `/api/ai`

Chỉ cần chạy:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\setup-kong.ps1
```

thay vì phải nhập nhiều lệnh `curl` thủ công.

Ưu điểm:

- Tái tạo môi trường nhanh chóng.
- Đồng bộ cấu hình giữa các máy.
- Giảm sai sót khi cấu hình Kong.
- Thuận tiện cho việc demo và bảo trì.

---

# Kiểm thử

### Backend

Sử dụng Thunder Client:

```
POST http://localhost:3001/api/ai/chat
```

### Qua Kong Gateway

```
POST http://localhost:8000/api/ai/chat
```

Kết quả:

- AI trả lời thành công.
- Request đi qua Kong Gateway.
- Dữ liệu thị trường được lấy từ CryptoService.
- Gemini AI sinh câu trả lời dựa trên dữ liệu thực tế.

---

# Demo

AI Copilot hiện có thể:

- Trả lời các câu hỏi về thị trường Crypto.
- Phân tích dữ liệu giá hiện tại.
- So sánh các đồng coin.
- Gợi ý phân bổ danh mục đầu tư.
- Giải thích xu hướng thị trường.

Toàn bộ dữ liệu đều được lấy từ CoinGecko trước khi gửi tới Gemini AI.

---

# Cấu trúc dự án (Week 4)

```text
frontend/
auth-ms/
backend/
docs/
scripts/
└── setup-kong.ps1

docker-compose.yml
README.md
```

---

# Hạn chế hiện tại

Phiên bản hiện tại vẫn còn một số hạn chế:

- Lịch sử chat chỉ được lưu bằng LocalStorage.
- Chưa lưu lịch sử hội thoại vào Database.
- AI chưa ghi nhớ ngữ cảnh giữa nhiều cuộc hội thoại.
- AI chỉ sử dụng dữ liệu thị trường tại thời điểm xử lý request.
- Chưa hỗ trợ Markdown trong nội dung trả lời.

---

# Kế hoạch tuần tiếp theo

## Week 5 - UI/UX Improvement

Các hạng mục dự kiến:

- Cải thiện giao diện AI Copilot.
- Hỗ trợ hiển thị Markdown.
- Hiệu ứng AI đang gõ (Typing Animation).
- Gợi ý câu hỏi nhanh (Suggested Prompts).
- Responsive trên nhiều kích thước màn hình.
- Hoàn thiện Dark Mode.
- Tối ưu hiệu ứng Loading.
- Tối ưu trải nghiệm trên thiết bị di động.
- Cải thiện trải nghiệm hội thoại và khả năng tương tác với AI.

---

# Kết quả đạt được

Sau Week 4, hệ thống đã hoàn thiện luồng AI Copilot từ Frontend đến Backend:

- ✅ Frontend React tích hợp AI Chatbot.
- ✅ Kong Gateway định tuyến request AI.
- ✅ Backend gọi Google Gemini AI.
- ✅ AI sử dụng dữ liệu thị trường thực tế để trả lời.
- ✅ Chatbot hỗ trợ lưu lịch sử cục bộ.
- ✅ Có script tự động cấu hình Kong Gateway.

Đây là nền tảng để tiếp tục phát triển các tính năng nâng cao về UI/UX và AI trong các tuần tiếp theo.
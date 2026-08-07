# ✦ NOVA ACCOUNT VAULT — MVP

Web app quản lý tài khoản nội bộ cho đội ngũ vận hành NOVA. Tối ưu cho tốc độ cực cao, mã hóa an toàn, tự động sinh Username/Password dễ đọc và giao diện Dark Gaming chuyên nghiệp.

---

## 🚀 Khởi Chạy Local (Nhanh Nhất)

### 1. Khởi chạy Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 2. Khởi chạy Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Mở trình duyệt: `http://localhost:3000` (Truy cập từ điện thoại: `http://<IP_LAPTOP>:3000`)

---

## 🌐 Hướng Dẫn Up Lên Host / Production Deployment

### Cách 1: Chạy bằng Docker Compose trên VPS (Khuyên dùng - Đơn giản nhất)
Nếu bạn có VPS Ubuntu/Linux:
1. Copy toàn bộ thư mục code lên VPS.
2. Chạy 1 lệnh duy nhất:
   ```bash
   docker-compose up -d --build
   ```
3. Web App sẽ chạy ngay tại `http://<IP_VPS>:3000` và Backend tại `http://<IP_VPS>:8000`.

---

### Cách 2: Deploy Miễn Phí trên Cloud (Vercel + Render)

#### A. Frontend Deploy lên Vercel (Miễn phí)
1. Đẩy code `frontend/` lên GitHub repository.
2. Truy cập [Vercel.com](https://vercel.com) -> New Project -> Import GitHub repository.
3. Cấu hình Build Command: `npm run build`
4. Thêm Environment Variable: `NEXT_PUBLIC_API_BASE_URL` = `https://<your-backend-render-url>.onrender.com/api`
5. Bấm **Deploy**.

#### B. Backend Deploy lên Render.com (Miễn phí)
1. Đẩy code `backend/` lên GitHub repository.
2. Truy cập [Render.com](https://render.com) -> New Web Service -> Kết nối Repository.
3. Settings:
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port 8000`
4. Set Environment Variables:
   - `SECRET_KEY` = `<Chuỗi-Bảo-Mật-JWT>`
   - `CREDENTIAL_ENCRYPTION_KEY` = `Z083a216c3NldmVudGVlbmdlbmVyYXRlZHZhdWx0a2V5MjAyNg==`
   - `CORS_ORIGINS` = `*`
5. Bấm **Create Web Service**.

---

## 🔐 Tài Khoản Đăng Nhập Mặc Định
- **Admin**: `admin@nova.vault` / Mật khẩu: `admin123`
- **Worker**: `worker@nova.vault` / Mật khẩu: `worker123`

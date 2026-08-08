# ✦ NOVA ACCOUNT VAULT — MVP

Web app quản lý tài khoản nội bộ cho đội ngũ vận hành NOVA. Tối ưu cho tốc độ cực cao, mã hóa an toàn, tự động sinh Username/Password dễ đọc và giao diện Dark Gaming chuyên nghiệp.

> Phiên bản này được **chuyển đổi sang Node.js (Next.js API Routes)** để chạy được trên panel Pterodactyl **Nodejs 24** (chỉ 1 container, không cần Python/Docker).

---

## 🏗 Kiến trúc (Node.js — Pterodactyl compatible)

- **Frontend + Backend**: Next.js 14 (App Router) — chạy trên 1 container Node duy nhất.
- **Backend**: Next.js API Routes (`src/app/api/**`) thay thế FastAPI.
- **Database**: SQLite (module `node:sqlite` built-in trong Node 22+) — file nằm tại `data/nova_vault.db` (persistent).
- **Bảo mật** (dùng `node:crypto` built-in — không cần native dep):
  - Hash mật khẩu đăng nhập: **scrypt**
  - Mã hóa mật khẩu vault: **AES-256-GCM** tại lưu trữ
  - Token phiên: **JWT** (HMAC-SHA256)
- **Backup**: Nút **"Backup .txt"** trong header → tải toàn bộ tài khoản (kèm mật khẩu đã giải mã) ra file `.txt` phòng khi sập web vẫn giữ được dữ liệu.

---

## 🚀 Khởi chạy Local

```bash
npm install
npm run dev
```

Mở trình duyệt: `http://localhost:3000`

---

## 🌐 Deploy lên Panel Pterodactyl (PikaMC / fusion.pikamc.vn)

### Cấu hình panel
- **Docker Image**: `Nodejs 24`
- **Main File**: `server.js`
- **Startup**: Lệnh mặc định (`Main file + npm install`) — panel sẽ chạy `npm install` rồi `node server.js`.

### Các bước
1. Push toàn bộ repo này lên GitHub (repo gốc / hoặc dùng Git Repo Address + Access Token trên panel).
2. Panel clone code vào `/home/container`.
3. Panel chạy `npm install`.
4. Panel chạy `node server.js`:
   - Nếu chưa có build, `server.js` tự chạy `next build` lần đầu.
   - Rồi start Next.js production trên port `3000` (hoặc `PORT` nếu set).
5. Truy cập: **`http://fusion.pikamc.vn:25737`** (port 25737 của panel).

> **Lưu ý dữ liệu:** SQLite DB nằm tại `data/nova_vault.db` trong thư mục `/home/container` nên sẽ được **giữ nguyên** giữa các lần restart. Nên bấm **Backup .txt** định kỳ để phòng khi sập.

### ⚠️ Lỗi thường gặp & cách xử lý

**"sh: 1: next: Permission denied" / Exit code 127**
- Nguyên nhân: `npx next` thất bại vì file `node_modules/.bin/next` không có quyền thực thi trên panel.
- Đã fix: `server.js` giờ gọi trực tiếp CLI qua `node node_modules/next/dist/bin/next` (build & start) — **không phụ thuộc quyền của `.bin`**, nên chạy được trên panel.
- Nếu panel vẫn báo lỗi cũ sau khi code mới, hãy **xóa sạch thư mục `/home/container`** (hoặc ít nhất là `node_modules` và `.next`) rồi deploy lại để tránh giữ lại bản cũ.

**Nhớ**:
- `Main File` = `server.js`
- `Docker Image` = `Nodejs 24`
- Không bật "Custom Startup" nếu không rõ, cứ để lệnh mặc định (tự chạy `npm install` + `node server.js`).

### Environment variables (tùy chọn, set trên panel)
| Biến | Mô tả | Mặc định |
|------|-------|----------|
| `SECRET_KEY` | Khóa JWT | `nova_vault_super_secret_jwt_key_2026_change_in_production` |
| `CREDENTIAL_ENCRYPTION_KEY` | Khóa mã hóa mật khẩu vault | `nova_vault_encryption_master_key_2026_fallback` |
| `PORT` | Cổng app | `3000` |
| `DATA_DIR` | Thư mục lưu DB | `./data` |
| `DATABASE_PATH` | Đường dẫn file DB | `./data/nova_vault.db` |

---

## 🔐 Tài Khoản Đăng Nhập Mặc Định
- **Admin**: `admin@nova.vault` / Mật khẩu: `admin123`
- **Worker**: `worker@nova.vault` / Mật khẩu: `worker123`

---

## 📁 Cấu trúc thư mục
```
├── server.js                 # Main file cho panel (build + start)
├── package.json
├── next.config.mjs
├── src/
│   ├── app/
│   │   ├── api/              # Backend (API Routes)
│   │   │   ├── auth/login|me|logout/route.ts
│   │   │   └── accounts/...  # CRUD, stats, generate, export
│   │   ├── login/page.tsx
│   │   └── page.tsx
│   ├── components/           # UI components
│   └── lib/                  # db, security, password, auth, api
└── data/nova_vault.db        # SQLite (tự tạo, persistent)

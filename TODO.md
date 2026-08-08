# TODO — Chuyển đổi NOVA ACCOUNT VAULT sang Node.js (Panel Pterodactyl Nodejs 24)

## Mục tiêu
- Chuyển toàn bộ backend FastAPI (Python) → Next.js API Routes (TypeScript)
- Chạy trên panel Pterodactyl Nodejs 24 (main file `server.js`, `npm install` tại thư mục gốc)
- Chỉ dùng 1 container Node, SQLite + crypto built-in (không native dep rủi ro)
- Ưu tiên KHÔNG mất dữ liệu + tính năng export file txt
- Truy cập qua `fusion.pikamc.vn:25737`

## Kế hoạch triển khai
1. Tạo cấu trúc thư mục gốc (package.json, next.config, tsconfig, tailwind, postcss, server.js)
2. Tạo các lib backend: `src/lib/db.ts`, `security.ts`, `password.ts`, `auth.ts`
3. Tạo API routes: auth (login/me/logout), accounts CRUD, stats, generate
4. Chuyển components & pages từ `frontend/src` lên `src/`
5. Thêm tính năng export file txt (nút "Tải backup .txt")
6. Cập nhật `.gitignore`, README
7. Xóa thư mục `frontend/` và `backend/` (không còn dùng)
8. Kiểm tra build + hướng dẫn deploy

## Trạng thái
- [x] Tạo TODO.md
- [x] Cấu hình gốc (package.json, next.config, tsconfig, tailwind, postcss, next-env.d.ts, server.js)
- [x] Lib backend (db, security, password, auth)
- [x] API routes auth
- [x] API routes accounts
- [x] Components & pages frontend
- [x] Tính năng export .txt
- [x] .gitignore + README + .env.example
- [x] Xóa backend/, frontend/ cũ
- [x] Build & kiểm tra

## Kết quả kiểm chứng (đã thông qua)
- `npm run build` → SUCCESS (toàn bộ 13 route compile, không lỗi type)
- Server production `next start` → Ready (khởi động OK)
- Logic security: scrypt hash + AES-256-GCM encrypt/decrypt + JWT → hoạt động
- Test end-to-end HTTP: login (admin) → tạo account `NovaTest123` → stats → export → account lưu đúng vào DB (`NOVA-0001`)


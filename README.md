# Hải Sản Quảng Ninh - Frontend (Next.js)

Giao diện người dùng và quản trị cho hệ thống bán lẻ hải sản tươi sống.

## Tech Stack
- **Next.js 15 (App Router)**
- **TailwindCSS**
- **TanStack Query (React Query)**
- **Zustand (Global State)**
- **Next-Auth (Auth.js) v5**
- **Axios**

## Getting Started

### 1. Requirements
- Node.js 20+
- Backend NestJS đang chạy tại `http://localhost:3001`

### 2. Configuration
Tạo file `.env.local` tại thư mục gốc:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
AUTH_SECRET=your_nextauth_secret_here
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
```

### 3. Setup & Development
```bash
npm install
npm run dev
```

Truy cập: `http://localhost:3000`

## Credentials (Test)
- **Admin**: `admin@haisan.vn` / `admin123`
- **User**: (Có thể đăng ký trực tiếp hoặc dùng Google)

## Project Structure
- `app/`: Routing và các trang (Products, Cart, Order, Admin, Account).
- `components/`: UI components (Layout, Product, Home, Cart).
- `src/services/`: Quản lý API calls (Axios client & Services).
- `store/`: Quản lý trạng thái bằng Zustand (Giỏ hàng).
- `types/`: TypeScript definitions.
- `auth.ts`: Cấu hình Next-Auth v5 phối hợp với backend NestJS.

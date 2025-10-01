# 🚀 Hướng Dẫn Deploy Shoe Store - Đồ Án

## 📋 Tổng Quan
Đây là hướng dẫn deploy website bán giày cho đồ án tốt nghiệp. Project bao gồm:
- **Backend**: Django REST API
- **Frontend**: React.js
- **Database**: SQLite (đơn giản cho demo)

## 🎯 Demo Accounts
- **Admin**: `username: admin` / `password: admin123`
- **Customer**: `username: customer` / `password: customer123`

## 🚀 Cách 1: Chạy Với Docker (Khuyến Nghị)

### Yêu Cầu
- Docker
- Docker Compose

### Các Bước
1. **Clone project và vào thư mục:**
   ```bash
   cd /path/to/shoe_store_project
   ```

2. **Chạy script tự động:**
   ```bash
   ./start_demo.sh
   ```

3. **Hoặc chạy thủ công:**
   ```bash
   docker-compose -f docker-compose.demo.yml up --build
   ```

4. **Truy cập:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api/

## 🖥️ Cách 2: Chạy Local (Development)

### Yêu Cầu
- Python 3.11+
- Node.js 18+
- npm

### Các Bước
1. **Chạy script tự động:**
   ```bash
   ./start_local.sh
   ```

2. **Hoặc chạy thủ công:**

   **Backend:**
   ```bash
   cd shoe_store
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r ../requirements.txt
   export DJANGO_SETTINGS_MODULE=shoe_store.settings_demo
   python manage.py migrate
   python setup_demo_data.py
   python manage.py runserver
   ```

   **Frontend (terminal mới):**
   ```bash
   cd frontend
   npm install
   npm start
   ```

## 🌐 Deploy Lên Server (Production)

### 1. Chuẩn Bị Server
```bash
# Cài đặt Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Cài đặt Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Upload Code Lên Server
```bash
# Sử dụng git
git clone your-repository-url
cd shoe_store_project

# Hoặc upload qua scp/sftp
scp -r . user@server:/path/to/project
```

### 3. Cấu Hình Environment
```bash
# Tạo file .env cho production
cp shoe_store/.env.example shoe_store/.env
cp frontend/.env.example frontend/.env

# Chỉnh sửa các giá trị phù hợp
nano shoe_store/.env
nano frontend/.env
```

### 4. Chạy Trên Server
```bash
# Với Docker
docker-compose -f docker-compose.demo.yml up -d

# Kiểm tra logs
docker-compose -f docker-compose.demo.yml logs -f
```

## 🔧 Troubleshooting

### Lỗi Thường Gặp

1. **Port đã được sử dụng:**
   ```bash
   # Kiểm tra port
   lsof -i :3000
   lsof -i :8000
   
   # Kill process
   kill -9 PID
   ```

2. **Docker build lỗi:**
   ```bash
   # Xóa cache và build lại
   docker system prune -a
   docker-compose -f docker-compose.demo.yml build --no-cache
   ```

3. **Database lỗi:**
   ```bash
   # Reset database
   rm shoe_store/demo_db.sqlite3
   docker-compose -f docker-compose.demo.yml restart backend
   ```

4. **Frontend không kết nối được API:**
   - Kiểm tra `REACT_APP_API_URL` trong `.env`
   - Đảm bảo backend đang chạy trên đúng port

### Logs và Debug

```bash
# Xem logs Docker
docker-compose -f docker-compose.demo.yml logs backend
docker-compose -f docker-compose.demo.yml logs frontend

# Vào container để debug
docker exec -it shoe_store_backend_demo bash
docker exec -it shoe_store_frontend_demo sh
```

## 📊 Dữ Liệu Demo

Project tự động tạo dữ liệu mẫu bao gồm:
- 5 sản phẩm giày
- 4 danh mục
- 5 thương hiệu
- Sizes và colors
- 2 tài khoản demo

## 🎨 Tính Năng Chính

### Cho Khách Hàng:
- Xem sản phẩm, tìm kiếm, lọc
- Thêm vào giỏ hàng
- Đặt hàng
- Xem lịch sử đơn hàng
- Wishlist

### Cho Admin:
- Quản lý sản phẩm
- Quản lý đơn hàng
- Quản lý khách hàng
- Dashboard thống kê

## 📱 Responsive Design
Website tương thích với:
- Desktop
- Tablet
- Mobile

## 🔒 Bảo Mật (Đã Đơn Giản Hóa)
- JWT Authentication
- CORS configuration
- Basic input validation

## 📞 Hỗ Trợ
Nếu gặp vấn đề khi deploy, hãy kiểm tra:
1. Logs của containers
2. Network connectivity
3. Port availability
4. Environment variables

---
**Chúc bạn demo thành công! 🎉**
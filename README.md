# 👟 Website Bán Giày - E-Commerce Platform

Website bán giày trực tuyến với đầy đủ tính năng quản lý sản phẩm, đơn hàng, và chatbot AI thông minh.

## 📋 Mô Tả

Đây là một nền tảng thương mại điện tử hoàn chỉnh cho việc bán giày, được xây dựng với Django REST Framework (backend) và React (frontend). Website bao gồm các tính năng quản lý sản phẩm, đơn hàng, khách hàng, và một chatbot AI được tích hợp để hỗ trợ khách hàng tìm kiếm sản phẩm.

## ✨ Tính Năng Chính

### 👤 Dành Cho Người Dùng
- **Trang chủ**: Hiển thị sản phẩm nổi bật, danh mục, thương hiệu
- **Tìm kiếm & Lọc**: Tìm kiếm sản phẩm theo tên, thương hiệu, danh mục, giá, màu sắc, kích cỡ
- **Chi tiết sản phẩm**: Xem thông tin chi tiết, hình ảnh, đánh giá
- **Giỏ hàng**: Thêm/sửa/xóa sản phẩm trong giỏ hàng
- **Thanh toán**: Quy trình thanh toán hoàn chỉnh với địa chỉ giao hàng
- **Đơn hàng**: Xem lịch sử đơn hàng và chi tiết từng đơn
- **Yêu thích**: Lưu sản phẩm vào danh sách yêu thích
- **Tài khoản**: Quản lý thông tin cá nhân, địa chỉ giao hàng
- **Thông báo**: Nhận thông báo về đơn hàng và khuyến mãi
- **Chatbot AI**: Chatbot thông minh hỗ trợ tìm kiếm sản phẩm bằng tiếng Việt

### 🔧 Dành Cho Quản Trị Viên
- **Dashboard**: Thống kê tổng quan về doanh thu, đơn hàng, sản phẩm
- **Quản lý sản phẩm**: Thêm/sửa/xóa sản phẩm, quản lý hình ảnh
- **Quản lý đơn hàng**: Xem và xử lý đơn hàng, cập nhật trạng thái
- **Quản lý khách hàng**: Xem danh sách khách hàng và thông tin chi tiết
- **Quản lý danh mục**: Quản lý danh mục, thương hiệu, màu sắc, kích cỡ
- **Quản lý khuyến mãi**: Tạo và quản lý mã giảm giá
- **Dashboard Chatbot AI**: Quản lý chatbot, xem logs, training intents, cấu hình bot

## 🛠️ Công Nghệ Sử Dụng

### Backend
- **Django 5.0.14**: Web framework
- **Django REST Framework**: API development
- **MySQL**: Database
- **JWT Authentication**: Xác thực người dùng
- **Google Gemini AI**: Chatbot AI
- **Pillow**: Xử lý hình ảnh

### Frontend
- **React 19.1.1**: UI framework
- **React Router**: Điều hướng
- **Axios**: HTTP client
- **Styled Components**: Styling
- **Chart.js**: Biểu đồ thống kê
- **React Icons**: Icon library

## 📦 Cài Đặt

### Yêu Cầu Hệ Thống
- Python 3.8+
- Node.js 14+
- MySQL 5.7+

### Bước 1: Clone Repository
```bash
git clone <repository-url>
cd shoe_ecommerce
```

### Bước 2: Cài Đặt Backend

1. Tạo môi trường ảo Python:
```bash
cd shoe_store
python -m venv venv
```

2. Kích hoạt môi trường ảo:
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

3. Cài đặt dependencies:
```bash
pip install -r ../requirements.txt
```

4. Tạo file `.env` trong thư mục `shoe_store/`:
```env
SECRET_KEY=your-secret-key-here
GEMINI_API_KEY=your-gemini-api-key-here
DATABASE_NAME=shoe_store
DATABASE_USER=your-db-user
DATABASE_PASSWORD=your-db-password
DATABASE_HOST=localhost
DATABASE_PORT=3306
```

5. Cấu hình database trong `shoe_store/shoe_store/settings.py` nếu cần

6. Chạy migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

7. Tạo superuser (tùy chọn):
```bash
python manage.py createsuperuser
```

### Bước 3: Cài Đặt Frontend

1. Di chuyển đến thư mục frontend:
```bash
cd ../frontend
```

2. Cài đặt dependencies:
```bash
npm install
```

## 🚀 Chạy Ứng Dụng

### Chạy Backend

1. Di chuyển đến thư mục `shoe_store`:
```bash
cd shoe_store
```

2. Chạy server Django:
```bash
python manage.py runserver
```

Backend sẽ chạy tại: `http://localhost:8000`

### Chạy Frontend

1. Di chuyển đến thư mục `frontend`:
```bash
cd frontend
```

2. Chạy ứng dụng React:
```bash
npm start
```

Frontend sẽ chạy tại: `http://localhost:3000`

## 📖 Hướng Dẫn Sử Dụng

### Cho Người Dùng

1. **Đăng ký/Đăng nhập**: Tạo tài khoản mới hoặc đăng nhập vào hệ thống
2. **Tìm kiếm sản phẩm**: Sử dụng thanh tìm kiếm hoặc chatbot để tìm giày
3. **Xem chi tiết**: Click vào sản phẩm để xem thông tin chi tiết
4. **Thêm vào giỏ hàng**: Chọn size, màu và thêm vào giỏ hàng
5. **Thanh toán**: Vào giỏ hàng, chọn địa chỉ giao hàng và hoàn tất đơn hàng
6. **Theo dõi đơn hàng**: Vào "Đơn hàng của tôi" để xem trạng thái đơn hàng

### Sử Dụng Chatbot AI

Chatbot hỗ trợ tìm kiếm sản phẩm bằng tiếng Việt với các tính năng:

- **Tìm kiếm theo thương hiệu**: "Tìm giày Nike", "Có giày Adidas không?"
- **Tìm kiếm theo giá**: "Có giày dưới 2 triệu không?", "Tìm giày khoảng 1.5 triệu"
- **Tìm kiếm theo giới tính**: "Tìm giày nam", "Giày nữ"
- **Tìm kiếm theo màu sắc**: "Tìm giày màu đen", "Có giày trắng không?"
- **Tìm kiếm kết hợp**: "Tìm giày Nike nam màu đen dưới 2 triệu"
- **Sửa lỗi chính tả tự động**: Chatbot tự động sửa các lỗi chính tả phổ biến
- **Nhớ sở thích**: Chatbot nhớ sở thích của bạn và gợi ý sản phẩm phù hợp

Ví dụ sử dụng:
```
Bạn: "Xin chào"
Chatbot: "Chào bạn! Em có thể giúp bạn tìm giày. Bạn muốn tìm gì?"

Bạn: "Tìm giày Nike nam"
Chatbot: "Em đã tìm được mấy đôi Nike nam hot nhất cho bạn! 👟"
         [Hiển thị 5 sản phẩm Nike nam]

Bạn: "Có màu đen không?"
Chatbot: "Có nè! Em tìm được Nike nam màu đen cho bạn! 🖤"
         [Hiển thị Nike nam màu đen]
```

### Cho Quản Trị Viên

1. **Đăng nhập**: Đăng nhập với tài khoản admin (role = 1)
2. **Dashboard**: Xem thống kê tổng quan về doanh thu, đơn hàng, sản phẩm
3. **Quản lý sản phẩm**: 
   - Thêm sản phẩm mới với hình ảnh, thông tin chi tiết
   - Sửa/xóa sản phẩm
   - Quản lý danh mục, thương hiệu, màu sắc, kích cỡ
4. **Quản lý đơn hàng**: Xem danh sách đơn hàng, cập nhật trạng thái
5. **Quản lý khách hàng**: Xem thông tin khách hàng
6. **Quản lý khuyến mãi**: Tạo mã giảm giá
7. **Dashboard Chatbot**: 
   - Xem thống kê chatbot (số lượng tương tác, câu hỏi phổ biến)
   - Xem logs và lịch sử chat
   - Training intents (dạy bot hiểu câu hỏi mới)
   - Cấu hình bot (response templates, rules)
   - Test chatbot trực tiếp

## 📁 Cấu Trúc Dự Án

```
shoe_ecommerce/
├── shoe_store/              # Backend Django
│   ├── core/                # App chính
│   │   ├── ai_service/      # Chatbot AI service
│   │   ├── models.py        # Database models
│   │   ├── views.py         # API views
│   │   └── serializers.py  # API serializers
│   ├── shoe_store/          # Django settings
│   ├── manage.py
│   └── media/               # Uploaded files
├── frontend/                # Frontend React
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── features/        # Feature modules
│   │   │   ├── admin/       # Admin features
│   │   │   ├── auth/        # Authentication
│   │   │   └── user/        # User features
│   │   ├── services/        # API services
│   │   └── routes.js        # Route definitions
│   └── public/
└── requirements.txt         # Python dependencies
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register/` - Đăng ký
- `POST /api/auth/login/` - Đăng nhập
- `POST /api/auth/logout/` - Đăng xuất

### Products
- `GET /api/products/` - Danh sách sản phẩm
- `GET /api/products/:id/` - Chi tiết sản phẩm
- `POST /api/products/` - Tạo sản phẩm (admin)
- `PUT /api/products/:id/` - Cập nhật sản phẩm (admin)

### Orders
- `GET /api/orders/` - Danh sách đơn hàng
- `POST /api/orders/` - Tạo đơn hàng
- `GET /api/orders/:id/` - Chi tiết đơn hàng

### Chatbot
- `POST /api/chatbot/chat/` - Gửi tin nhắn đến chatbot
- `GET /api/chatbot/conversations/` - Lịch sử chat (admin)

Xem thêm trong `shoe_store/core/urls.py`

## 🐛 Xử Lý Lỗi

### Backend không chạy được
- Kiểm tra Python version: `python --version`
- Kiểm tra database connection trong settings.py
- Kiểm tra file .env có đầy đủ thông tin

### Frontend không chạy được
- Kiểm tra Node.js version: `node --version`
- Xóa node_modules và cài lại: `rm -rf node_modules && npm install`
- Kiểm tra port 3000 có bị chiếm không

### Chatbot không hoạt động
- Kiểm tra GEMINI_API_KEY trong file .env
- Kiểm tra kết nối internet
- Xem logs trong console và server logs

## 📝 Ghi Chú

- Đảm bảo MySQL đã được cài đặt và chạy trước khi start backend
- Cần có Gemini API key để sử dụng chatbot (lấy tại https://makersuite.google.com/app/apikey)
- File media (hình ảnh) được lưu trong `shoe_store/media/`

## 👥 Tác Giả

Đồ án Trí Tuệ Nhân Tạo

## 📄 License

MIT License

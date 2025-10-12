# 🔐 Hướng dẫn sử dụng tính năng quản lý mật khẩu

## 📋 Tổng quan

Đã thêm các tính năng quản lý mật khẩu hoàn chỉnh vào hệ thống e-commerce:

### ✅ Các tính năng đã thêm:

1. **Trang Cài đặt tài khoản** (`/settings`)
2. **Trang Quên mật khẩu** (`/forgot-password`)
3. **Trang Đặt lại mật khẩu** (`/reset-password`)
4. **API endpoints** cho password management

## 🚀 Cách sử dụng

### 1. Trang Cài đặt tài khoản

**URL:** `/settings`

**Tính năng:**
- ✅ Thay đổi mật khẩu (cần nhập mật khẩu hiện tại)
- ✅ Cài đặt thông báo (email, SMS, order updates, promotions, newsletters)
- ✅ Cài đặt giao diện (theme: sáng/tối, ngôn ngữ: Việt/English)
- ✅ Đăng xuất

**Cách truy cập:**
- Từ Header: Click vào tên user → "Cài đặt tài khoản"
- Hoặc truy cập trực tiếp: `/settings`

### 2. Quên mật khẩu

**URL:** `/forgot-password`

**Tính năng:**
- ✅ Nhập email để nhận link khôi phục
- ✅ Gửi email với link reset password
- ✅ Hướng dẫn chi tiết cho user

**Cách truy cập:**
- Từ trang Login: Click "Quên mật khẩu?"
- Hoặc truy cập trực tiếp: `/forgot-password`

### 3. Đặt lại mật khẩu

**URL:** `/reset-password?token=...&email=...`

**Tính năng:**
- ✅ Xác thực token từ email
- ✅ Đặt mật khẩu mới với validation
- ✅ Yêu cầu mật khẩu mạnh (chữ hoa, thường, số)
- ✅ Xác nhận mật khẩu

**Cách truy cập:**
- Từ link trong email khôi phục mật khẩu
- Tự động redirect từ `/forgot-password` sau khi gửi email

## 🔧 API Endpoints

### 1. Thay đổi mật khẩu
```
POST /api/change-password/
Content-Type: application/json
Authorization: Bearer <token>

{
  "current_password": "old_password",
  "new_password": "new_password"
}
```

### 2. Quên mật khẩu
```
POST /api/forgot-password/
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### 3. Xác thực token reset
```
POST /api/validate-reset-token/
Content-Type: application/json

{
  "token": "reset_token",
  "email": "user@example.com"
}
```

### 4. Đặt lại mật khẩu
```
POST /api/reset-password/
Content-Type: application/json

{
  "token": "reset_token",
  "email": "user@example.com",
  "password": "new_password"
}
```

## ⚙️ Cấu hình Email

### Development (Console)
```python
# settings.py
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
```

### Production (SMTP)
```python
# settings.py
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your-email@gmail.com'
EMAIL_HOST_PASSWORD = 'your-app-password'
DEFAULT_FROM_EMAIL = 'noreply@footfashion.com'
```

## 🎨 UI/UX Features

### Responsive Design
- ✅ Mobile-friendly
- ✅ Tablet support
- ✅ Desktop optimized

### User Experience
- ✅ Loading states
- ✅ Error handling
- ✅ Success notifications
- ✅ Form validation
- ✅ Password strength indicator

### Security Features
- ✅ Token-based password reset
- ✅ Password strength requirements
- ✅ Current password verification
- ✅ Secure token expiration (1 hour)

## 🔒 Bảo mật

### Password Requirements
- Ít nhất 6 ký tự
- Có chữ hoa
- Có chữ thường  
- Có số

### Token Security
- Token có thời hạn 1 giờ
- Token chỉ sử dụng được 1 lần
- Token được mã hóa an toàn

## 🚀 Deployment Notes

### Cần cấu hình:
1. **Email settings** trong `settings.py`
2. **BACKEND_ORIGIN** cho reset links
3. **CORS settings** nếu cần

### Environment Variables:
```bash
# .env file
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
SECRET_KEY=your-secret-key
```

## 📱 Mobile Support

Tất cả các trang đều responsive và hoạt động tốt trên:
- ✅ iPhone/Android
- ✅ Tablet
- ✅ Desktop

## 🎯 Testing

### Test Cases:
1. ✅ Đăng nhập → Settings → Đổi mật khẩu
2. ✅ Login → Quên mật khẩu → Nhập email
3. ✅ Click link email → Đặt lại mật khẩu
4. ✅ Validation các trường hợp lỗi
5. ✅ Responsive trên các thiết bị

## 🔄 Workflow hoàn chỉnh

1. **User quên mật khẩu** → Vào `/forgot-password`
2. **Nhập email** → Hệ thống gửi email với link reset
3. **Click link trong email** → Chuyển đến `/reset-password`
4. **Đặt mật khẩu mới** → Validation và lưu
5. **Đăng nhập với mật khẩu mới** → Thành công!

## 📞 Support

Nếu có vấn đề gì, hãy kiểm tra:
1. Console logs trong browser
2. Django logs trong terminal
3. Email configuration
4. CORS settings

---

**🎉 Hoàn thành!** Hệ thống quản lý mật khẩu đã sẵn sàng sử dụng!

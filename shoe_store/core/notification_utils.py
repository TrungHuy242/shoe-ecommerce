# core/notification_utils.py
from .models import Notification, User
from django.utils import timezone

def create_notification(user, notification_type, title, message, related_order=None, 
                        related_product=None, product_image=None, action_button_text=None, action_url=None):
    """
    Tạo thông báo mới cho user
    
    Args:
        user: User object
        notification_type: Loại thông báo (order_confirmed, order_shipped, etc.)
        title: Tiêu đề thông báo
        message: Nội dung thông báo
        related_order: Order liên quan (optional)
        related_product: Product liên quan (optional)
        product_image: URL hình ảnh sản phẩm (optional)
        action_button_text: Text nút hành động (optional)
        action_url: URL hành động (optional)
    """
    try:
        notification = Notification.objects.create(
            user=user,
            type=notification_type,
            title=title,
            message=message,
            related_order=related_order,
            related_product=related_product,
            product_image=product_image,
            action_button_text=action_button_text,
            action_url=action_url
        )
        return notification
    except Exception as e:
        print(f"Error creating notification: {e}")
        return None

def send_order_created_notification(order):
    """Gửi thông báo đơn hàng được tạo"""
    if not order.user:
        return
    
    title = "Đơn hàng đã được tạo"
    message = f"Đơn hàng #{order.id} của bạn đã được tạo thành công với tổng giá trị {order.total:,.0f}đ. Chúng tôi sẽ xử lý đơn hàng sớm nhất có thể."
    
    create_notification(
        user=order.user,
        notification_type='order_confirmed',
        title=title,
        message=message,
        related_order=order
    )

def send_order_confirmed_notification(order):
    """Gửi thông báo đơn hàng được xác nhận"""
    if not order.user:
        return
    
    # Lấy sản phẩm đầu tiên trong đơn hàng để hiển thị
    from .models import OrderDetail
    first_item = OrderDetail.objects.filter(order=order).first()
    
    title = "Đơn hàng đã được xác nhận"
    message = f"Đơn hàng #{order.id} của bạn đã được xác nhận và đang được chuẩn bị để giao hàng."
    
    # Lấy hình ảnh sản phẩm
    product_image = None
    related_product = None
    if first_item and first_item.product:
        related_product = first_item.product
        # Lấy hình ảnh đầu tiên từ model Image
        if first_item.product.images.exists():
            first_image = first_item.product.images.first()
            if first_image.image:
                # Tạo URL đầy đủ với domain
                from django.conf import settings
                product_image = f"{settings.BACKEND_ORIGIN}{first_image.image.url}"
    
    create_notification(
        user=order.user,
        notification_type='order_confirmed',
        title=title,
        message=message,
        related_order=order,
        related_product=related_product,
        product_image=product_image,
        action_button_text="Xem Đơn Hàng",
        action_url=f"/order/{order.id}"
    )

def send_order_shipped_notification(order):
    """Gửi thông báo đơn hàng đang giao hàng"""
    if not order.user:
        return
    
    # Lấy sản phẩm đầu tiên trong đơn hàng để hiển thị
    from .models import OrderDetail
    first_item = OrderDetail.objects.filter(order=order).first()
    
    title = "Đơn hàng đang được giao"
    message = f"Đơn hàng #{order.id} của bạn đã được giao hàng và đang trên đường đến bạn. Vui lòng chuẩn bị nhận hàng."
    
    # Lấy hình ảnh sản phẩm
    product_image = None
    related_product = None
    if first_item and first_item.product:
        related_product = first_item.product
        # Lấy hình ảnh đầu tiên từ model Image
        if first_item.product.images.exists():
            first_image = first_item.product.images.first()
            if first_image.image:
                # Tạo URL đầy đủ với domain
                from django.conf import settings
                product_image = f"{settings.BACKEND_ORIGIN}{first_image.image.url}"
    
    create_notification(
        user=order.user,
        notification_type='order_shipped',
        title=title,
        message=message,
        related_order=order,
        related_product=related_product,
        product_image=product_image,
        action_button_text="Theo Dõi Đơn Hàng",
        action_url=f"/order/{order.id}"
    )

def send_order_delivered_notification(order):
    """Gửi thông báo đơn hàng đã giao thành công"""
    if not order.user:
        return
    
    # Lấy sản phẩm đầu tiên trong đơn hàng để hiển thị
    from .models import OrderDetail
    first_item = OrderDetail.objects.filter(order=order).first()
    
    title = "Đơn hàng đã hoàn tất"
    message = f"Đơn hàng {order.id} đã hoàn thành. Bạn hãy đánh giá sản phẩm trước ngày {timezone.now().strftime('%d-%m-%Y')} để nhận 200 xu và giúp người dùng khác hiểu hơn về sản phẩm nhé!"
    
    # Lấy hình ảnh sản phẩm
    product_image = None
    related_product = None
    if first_item and first_item.product:
        related_product = first_item.product
        # Lấy hình ảnh đầu tiên từ model Image
        if first_item.product.images.exists():
            first_image = first_item.product.images.first()
            if first_image.image:
                # Tạo URL đầy đủ với domain
                from django.conf import settings
                product_image = f"{settings.BACKEND_ORIGIN}{first_image.image.url}"
    
    create_notification(
        user=order.user,
        notification_type='order_delivered',
        title=title,
        message=message,
        related_order=order,
        related_product=related_product,
        product_image=product_image,
        action_button_text="Đánh Giá Sản Phẩm",
        action_url=f"/order/{order.id}"
    )

def send_order_cancelled_notification(order):
    """Gửi thông báo đơn hàng bị hủy"""
    if not order.user:
        return
    
    title = "Đơn hàng đã bị hủy"
    message = f"Đơn hàng #{order.id} của bạn đã bị hủy. Nếu bạn đã thanh toán, số tiền sẽ được hoàn trả trong vòng 3-5 ngày làm việc."
    
    create_notification(
        user=order.user,
        notification_type='order_cancelled',
        title=title,
        message=message,
        related_order=order
    )

def send_promotion_notification(users, title, message, promotion=None):
    """Gửi thông báo khuyến mãi cho nhiều user"""
    notifications = []
    
    # Lấy hình ảnh từ promotion nếu có
    promotion_image = None
    if promotion and hasattr(promotion, 'image') and promotion.image:
        promotion_image = promotion.image.url
    
    for user in users:
        notification = create_notification(
            user=user,
            notification_type='promotion',
            title=title,
            message=message,
            product_image=promotion_image,
            action_button_text="Xem Khuyến Mãi",
            action_url="/promotions"
        )
        if notification:
            notifications.append(notification)
    return notifications

def send_system_notification(users, title, message):
    """Gửi thông báo hệ thống cho nhiều user"""
    notifications = []
    for user in users:
        notification = create_notification(
            user=user,
            notification_type='system',
            title=title,
            message=message
        )
        if notification:
            notifications.append(notification)
    return notifications

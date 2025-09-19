from rest_framework.permissions import BasePermission, SAFE_METHODS, AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly

class IsAdminOrReadOnly(BasePermission):
    """
    - Cho phép tất cả mọi người (kể cả chưa login) được xem (GET, HEAD, OPTIONS).
    - Chỉ Admin (role = 1) mới được POST/PUT/PATCH/DELETE.
    """
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:  # GET, HEAD, OPTIONS
            return True
        return (
            request.user
            and request.user.is_authenticated
            and getattr(request.user, 'role', 0) == 1
        )


class IsCustomerOrAdmin(BasePermission):
    """
    - Cho phép tất cả mọi người được xem (GET, HEAD, OPTIONS).
    - User có role = 0 (customer) hoặc role = 1 (admin) mới được thao tác khác.
    """
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:  # GET, HEAD, OPTIONS
            return True
        return (
            request.user
            and request.user.is_authenticated
            and getattr(request.user, 'role', -1) in [0, 1]
        )

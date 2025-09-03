from rest_framework.permissions import BasePermission

class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in ['GET']:
            return True
        return request.user and request.user.is_authenticated and getattr(request.user.customer, 'role', 0) == 1  # Chỉ admin (role=1)

class IsCustomerOrAdmin(BasePermission):
    def has_permission(self, request, view):
        if request.method in ['GET']:
            return True
        return request.user and request.user.is_authenticated and (getattr(request.user.customer, 'role', 0) in [0, 1])  # Chỉ khách hàng (role=0) hoặc admin (role=1)
    
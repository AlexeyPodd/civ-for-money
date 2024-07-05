from rest_framework import permissions


class RulesPermission(permissions.BasePermission):
    """
    Ensure that only owner can modify or delete rules,
    and only owner can read list of his rules.
    But anyone can see read specified rule.
    """
    def has_permission(self, request, view):
        if view.action == 'list':
            return request.user.is_authenticated
        return True

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.creator == request.user

from unittest.mock import Mock

from django.test import SimpleTestCase
from rest_framework import permissions

from game.permissions import RulesPermission


class TestRulesPermission(SimpleTestCase):
    def setUp(self):
        self.permission = RulesPermission()
        self.request = Mock()
        self.view = Mock()
        self.obj = Mock()

    def test_not_authenticated_user_denied_permission_to_access_list_action(self):
        self.request.user.is_authenticated = False
        self.view.action = 'list'

        self.assertFalse(self.permission.has_permission(self.request, self.view))

    def test_authenticated_user_granted_permission_to_access_list_action(self):
        self.request.user.is_authenticated = True
        self.view.action = 'list'

        self.assertTrue(self.permission.has_permission(self.request, self.view))

    def test_any_user_granted_permission_to_any_action_except_list(self):
        self.request.user.is_authenticated = False
        self.view.action = 'not_list'

        self.assertTrue(self.permission.has_permission(self.request, self.view))

    def test_permission_granted_for_object_for_every_safe_method(self):
        for safe_method in permissions.SAFE_METHODS:
            self.request.method = safe_method
            self.assertTrue(self.permission.has_object_permission(self.request, self.view, self.obj))

    def test_permission_denied_for_object_if_method_not_in_safe_methods_and_requester_is_not_creator(self):
        self.request.method = 'POST'
        self.request.user = 'user123'
        self.obj.creator = 'user321'

        self.assertFalse(self.permission.has_object_permission(self.request, self.view, self.obj))

    def test_permission_granted_for_object_if_method_not_in_safe_methods_and_requester_is_creator(self):
        self.request.method = 'POST'
        self.request.user = 'user123'
        self.obj.creator = 'user123'

        self.assertTrue(self.permission.has_object_permission(self.request, self.view, self.obj))

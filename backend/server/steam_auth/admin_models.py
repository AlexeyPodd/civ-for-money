from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.safestring import mark_safe


class UpdatedUserAdmin(UserAdmin):
    list_display = ("username", "get_html_avatar", "uuid", "is_staff",
                    "banned", "get_warnings_amount", "victories", "defeats", "draws")
    list_filter = ("is_staff", "is_superuser", "is_active", "groups", "banned")
    list_editable = ('banned',)

    def get_html_avatar(self, object):
        if object.avatar is not None:
            return mark_safe(f"<img src='{object.avatar}' width=50>")

    def get_warnings_amount(self, object):
        return object.warnings.count()

    get_html_avatar.short_description = "Avatar"
    get_warnings_amount.short_description = "Warnings"


class PreBanWarningAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "reason", "time_creation", "creator")
    list_display_links = ('id',)
    fields = ("user", "reason", "time_creation", "creator")
    readonly_fields = ("user", "time_creation", "creator")


class WalletAdmin(admin.ModelAdmin):
    list_display = ("id", "owner", "address")
    list_display_links = ('id', 'address')
    search_fields = ('address',)
    fields = ("owner", "address")
    readonly_fields = ("owner", "address")

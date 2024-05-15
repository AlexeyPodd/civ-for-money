from django.contrib import admin

from .admin_models import UpdatedUserAdmin, PreBanWarningAdmin, WalletAdmin
from .models import User, PreBanWarning, Wallet

admin.site.register(User, UpdatedUserAdmin)
admin.site.register(PreBanWarning, PreBanWarningAdmin)
admin.site.register(Wallet, WalletAdmin)

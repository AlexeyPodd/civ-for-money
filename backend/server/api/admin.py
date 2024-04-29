from django.contrib import admin

from .admin_models import UpdatedUserAdmin, WarningAdmin, WalletAdmin, GameAdmin, RulesAdmin
from .models import User, Warning, Wallet, Game, Rules

admin.site.register(User, UpdatedUserAdmin)
admin.site.register(Warning, WarningAdmin)
admin.site.register(Wallet, WalletAdmin)
admin.site.register(Game, GameAdmin)
admin.site.register(Rules, RulesAdmin)

admin.site.site_title = 'Admin'
admin.site.site_header = 'CivForMoney Administration'

from django.contrib import admin

from .admin_models import GameAdmin, RulesAdmin
from .models import Game, Rules

admin.site.register(Game, GameAdmin)
admin.site.register(Rules, RulesAdmin)

admin.site.site_title = 'Admin'
admin.site.site_header = 'DuelMasters Administration'

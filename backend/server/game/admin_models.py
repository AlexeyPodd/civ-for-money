from django.contrib import admin


class GameAdmin(admin.ModelAdmin):
    list_display = ('id', 'sc_address', 'title', 'game', 'time_creation', 'host', 'player2', 'started', 'closed', 'dispute')
    list_display_links = ('id', 'sc_address', 'title')
    search_fields = ('sc_address', 'title')
    list_filter = ('started', 'closed', 'dispute', 'time_creation', 'game')
    fields = ('sc_address', 'title', 'game', 'time_creation', 'rules', 'host', 'player2', 'started', 'closed', 'dispute')
    readonly_fields = ('sc_address', 'title', 'game', 'time_creation', 'rules', 'host', 'player2', 'started', 'closed', 'dispute')


class RulesAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'creator', 'deleted')
    list_display_links = ('id', 'title')
    list_filter = ('deleted',)
    search_fields = ('title',)
    fields = ('title', 'creator', 'description', 'deleted')
    readonly_fields = ('title', 'creator', 'description', 'deleted')

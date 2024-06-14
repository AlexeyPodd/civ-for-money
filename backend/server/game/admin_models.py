from django.contrib import admin


class GameAdmin(admin.ModelAdmin):
    list_display = ('id', 'game_index', 'title', 'game', 'time_creation', 'host', 'player2', 'bet', 'started', 'closed',
                    'dispute', 'play_period', 'time_start', 'host_vote', 'player2_vote')
    list_display_links = ('id', 'game_index', 'title')
    search_fields = ('game_index', 'title')
    list_filter = ('started', 'closed', 'dispute', 'time_creation', 'game', 'play_period', 'time_start')
    fields = ('game_index', 'title', 'game', 'time_creation', 'rules', 'host', 'player2', 'bet', 'started', 'closed',
              'dispute', 'play_period', 'time_start', 'host_vote', 'player2_vote')
    readonly_fields = ('game_index', 'title', 'game', 'time_creation', 'rules', 'host', 'player2', 'bet', 'started',
                       'closed', 'dispute', 'play_period', 'time_start', 'host_vote', 'player2_vote')


class RulesAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'creator', 'deleted')
    list_display_links = ('id', 'title')
    list_filter = ('deleted',)
    search_fields = ('title',)
    fields = ('title', 'creator', 'description', 'deleted')
    readonly_fields = ('title', 'creator', 'description', 'deleted')

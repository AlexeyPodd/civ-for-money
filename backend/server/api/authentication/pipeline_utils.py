def get_avatar(backend, strategy, details, response, user=None, *args, **kwargs):
    if backend.name == 'steam':
        url = details['player']['avatar']
        if url:
            user.avatar = url
            user.save()

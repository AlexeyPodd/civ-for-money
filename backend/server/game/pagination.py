from rest_framework.pagination import PageNumberPagination


class GameListPagination(PageNumberPagination):
    page_size = 30
    page_size_query_param = 'page_size'
    page_query_param = 'page_number'
    max_page_size = 200

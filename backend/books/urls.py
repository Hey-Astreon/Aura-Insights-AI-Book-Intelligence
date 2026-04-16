from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookViewSet, ChatMessageViewSet

router = DefaultRouter()
router.register(r'books', BookViewSet)
router.register(r'chat', ChatMessageViewSet, basename='chat')

urlpatterns = [
    path('', include(router.urls)),
]

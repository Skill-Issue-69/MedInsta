# chatbot/urls.py
from django.urls import path

from .all_views import auth_views
from .all_views import chat_views
from . import views

urlpatterns = [
    path("test/", views.test_view, name="test"),
    path("register/", auth_views.register_view, name="register"),
    path("login/", auth_views.login_view, name="login"),
    path("chats/", chat_views.create_chat),
    path("messaages/", chat_views.add_message),
    path("users/<uuid:user_id>/", auth_views.update_user, name="update-user"),
    path("chats/create/<uuid:chat_id>/", chat_views.update_chat, name="update-chat"),
    path("chats/<uuid:user_id>/", chat_views.get_chats, name="get-chats"),
]

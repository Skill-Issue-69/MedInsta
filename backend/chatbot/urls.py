# chatbot/urls.py
from django.urls import path
from . import views,auth_views

urlpatterns = [
    path('test/', views.test_view, name='test'),
    path('register/', auth_views.register_view, name='register'),
    path('login/', auth_views.login_view, name='login'),
]

from django.urls import path

from . import views

urlpatterns = [
    path('', views.home),
    path('login/', views.log_in),
    path('logout/', views.log_out),
    path('register/', views.register),
]

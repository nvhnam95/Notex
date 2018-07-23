from django.urls import path

from . import views

urlpatterns = [
    path('', views.login, name='index'),
    path('mynotes/', views.view_note, name='viewnote'),
    path('create/', views.create_note, name='createnote'),


]

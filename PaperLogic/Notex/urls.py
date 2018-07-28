from django.urls import path
from django.conf.urls.static import static
from django.conf import settings

from . import views

urlpatterns = [
    path('', views.home),
    path('login/', views.log_in),
    path('logout/', views.log_out),
    path('register/', views.register),
]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

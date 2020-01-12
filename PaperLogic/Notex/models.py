from django.db import models
from django.conf import settings
from django.contrib.auth.models import User

class Note(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE,)
    content = models.TextField()
    background = models.TextField(blank=True)
    created_date = models.DateTimeField('created date')

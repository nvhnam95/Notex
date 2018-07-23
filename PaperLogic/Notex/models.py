from django.db import models


class User(models.Model):
    user_name = models.CharField(max_length=200)
    password = models.CharField(max_length=200)

class Note(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_date = models.DateTimeField('created date')

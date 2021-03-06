from django.db import models
from django.contrib.auth.models import User


class Project(models.Model):
    name = models.CharField(max_length=30, unique=True)
    color = models.CharField(max_length=7)
    user = models.ForeignKey(User, on_delete=models.PROTECT)

    def __str__(self):
        return self.name


class Task(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    title = models.CharField(max_length=50, unique=True)
    date = models.DateField()
    priority = models.IntegerField()
    condition = models.IntegerField(default=1)

    def __str__(self):
        return self.title

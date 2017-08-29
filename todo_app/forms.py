from django.contrib.auth.models import User
from django import forms
from todo_app.models import Project, Task

class UserForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput())

    class Meta:
        model = User
        fields = ('username', 'password')


class ProjectForm(forms.ModelForm):
    name = forms.CharField(max_length=30)
    color = forms.CharField(max_length=7)
    user = forms.CharField()
    class Meta:
        model = Project
        fields = ('name', 'color', 'user')
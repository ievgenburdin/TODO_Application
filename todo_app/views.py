from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from todo_app.models import Project, Task
from todo_app.forms import UserForm
from django.contrib.auth.models import User
from django.contrib.auth import authenticate as auth_authenticate
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from django.contrib.auth.decorators import login_required

def root(request):
    return HttpResponseRedirect('/index/')


def login(request):
    message = None
    if request.method =='POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        try:
            check_user = User.objects.get(username=username)
            if check_user:
                user = auth_authenticate(username=username, password=password)
                if user:
                    if user.is_active:
                        auth_login(request, user)
                        return HttpResponseRedirect('/index/')
                else:
                    message = "User name or password is incorrect"
        except User.DoesNotExist:
            user_form = UserForm(data=request.POST)
            if user_form.is_valid():
                user = user_form.save()
                user.set_password(user.password)
                user.save()
                return HttpResponseRedirect('/index/')
            else:
                message = user_form.errors

    context_dict = {'message':message}
    return render(request, 'login.html', context_dict)


def logout(request):
    auth_logout(request)
    return HttpResponseRedirect('/index/')

@login_required
def index(request):
    username = request.user.username
    project_list = Project.objects.filter(user__username=username)
    task_list = Task.objects.filter(project__user__username=username)
    context_dict = {'projects':project_list,
                    'tasks': task_list}
    return render(request, 'index.html', context_dict)
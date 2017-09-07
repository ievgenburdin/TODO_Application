from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from todo_app.models import Project, Task
from todo_app.forms import UserForm, ProjectForm
from django.contrib.auth.models import User
from django.contrib.auth import authenticate as auth_authenticate
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
import json
from datetime import datetime, timedelta
from django.db import IntegrityError

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


@login_required
def get_today_task(request):
    username = request.user.username
    task_list = Task.objects.filter(project__user__username=username).order_by('date', 'priority')
    today = datetime.now().date()
    tasks = []
    response_data = {}
    for task in task_list:
        if task.date <= today:
            task_dict = {'project':task.project.name,
                         'projectColor': task.project.color,
                         'title':task.title,
                         'date':{'day':task.date.day,
                                 'month':task.date.month,
                                 'year':task.date.year},
                         'priority':task.priority}
            tasks.append(task_dict)
    response_data['tasks'] = tasks
    return HttpResponse(
        json.dumps(response_data),
        content_type="application/json")


@login_required
def get_week_task(request):
    username = request.user.username
    today = datetime.now().date()
    task_list = Task.objects.filter(project__user__username=username).order_by('date', 'priority')
    tasks = []
    response_data = {}
    for task in task_list:
        if task.date < today + timedelta(days=7):
            task_dict = {'project':task.project.name,
                         'projectColor': task.project.color,
                         'title':task.title,
                         'date':{'day':task.date.day,
                                 'month':task.date.month,
                                 'year':task.date.year},
                         'priority':task.priority}
            tasks.append(task_dict)
    response_data['tasks'] = tasks
    return HttpResponse(
        json.dumps(response_data),
        content_type="application/json")


@login_required
def get_project_task(request):
    username = request.user.username
    if request.method == 'GET':
        projectname = request.GET['project']
    today = datetime.now().date()
    task_list = Task.objects.filter(project__user__username=username, project__name=projectname).order_by('date', 'priority')
    tasks = []
    response_data = {}
    for task in task_list:
        if task.date < today + timedelta(days=7):
            task_dict = {'project':task.project.name,
                         'projectColor': task.project.color,
                         'title':task.title,
                         'date':{'day':task.date.day,
                                 'month':task.date.month,
                                 'year':task.date.year},
                         'priority':task.priority}
            tasks.append(task_dict)
    response_data['tasks'] = tasks
    return HttpResponse(
        json.dumps(response_data),
        content_type="application/json")


@login_required
@csrf_exempt
def add_project(request):
    response_data = {}
    if request.method == 'POST':
        project_data = json.loads(request.body.decode('utf-8'))
        user = User.objects.get(username=project_data['user'])
        project = Project(name=project_data['projectName'],
                           color=project_data['projectColor'],
                           user=user)
        try:
            project.save()
            response_data['name'] = project.name
            response_data['color'] = project.color

        except IntegrityError:
            response_data['errors'] = "Oops! Project name must be unique and max 30 char!"
    else:
        response_data['errors'] = "Wrong request method"

    return HttpResponse(
        json.dumps(response_data),
        content_type="application/json")


@login_required
@csrf_exempt
def add_task(request):
    response_data = {}
    if request.method == 'POST':
        task_data = json.loads(request.body.decode('utf-8'))
        project = Project.objects.get(name=task_data['taskProject'])
        task = Task(title=task_data['taskTitle'],
                    date=task_data['taskDate'],
                    priority=task_data['taskPriority'],
                    project=project,
                    condition=1)
        task.save()
        response_data['taskTitle'] = task.title
        response_data['taskDate'] = task.date
        response_data['taskPriority'] = task.priority
        response_data['taskProject'] = task.project.name
        response_data['taskProjectColor'] = task.project.color
    else:
        response_data['errors'] = "Wrong request method"
    return HttpResponse(
        json.dumps(response_data),
        content_type="application/json")


@login_required
@csrf_exempt
def delete_project(request):
    response_data = {}
    if request.method == 'POST':
        project_data = json.loads(request.body.decode('utf-8'))
        project = Project.objects.get(name=project_data['projectName'])
        project.delete()
        response_data['projectName'] = project.name
    else:
        response_data['errors'] = "Wrong request method"
    return HttpResponse(
        json.dumps(response_data),
        content_type="application/json")


@login_required
@csrf_exempt
def edit_project(request):
    response_data = {}
    if request.method == 'POST':
        project_data = json.loads(request.body.decode('utf-8'))
        project = Project.objects.get(name=project_data['oldProjectName'])
        project.name = project_data['projectName']
        project.color = project_data['projectColor']
        project.save()
        response_data['projectName'] = project.name
        response_data['projectColor'] = project.color
    else:
        response_data['errors'] = "Wrong request method"
    return HttpResponse(
        json.dumps(response_data),
        content_type="application/json")

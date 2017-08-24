from django.contrib import admin
from todo_app.models import Project, Task


class ProjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'color', 'user']


class TaskAdmin(admin.ModelAdmin):
    list_display = ['project', 'title', 'date', 'priority']


admin.site.register(Project, ProjectAdmin)
admin.site.register(Task, TaskAdmin)



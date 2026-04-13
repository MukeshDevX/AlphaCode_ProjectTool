from django.contrib import admin
from .models import Project, Task, Comment


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display  = ['name', 'owner', 'status', 'tasks_count', 'created_at']
    list_filter   = ['status', 'created_at']
    search_fields = ['name', 'description', 'owner__username']
    readonly_fields = ['created_at', 'updated_at']

    def tasks_count(self, obj):
        return obj.tasks.count()
    tasks_count.short_description = 'Total Tasks'


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display  = ['title', 'project', 'status', 'priority', 'assigned_to', 'due_date']
    list_filter   = ['status', 'priority']
    search_fields = ['title', 'project__name', 'assigned_to__username']
    list_editable = ['status', 'priority']
    readonly_fields = ['created_at', 'updated_at', 'created_by']


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display  = ['author', 'task', 'short_body', 'created_at']
    search_fields = ['body', 'author__username']
    readonly_fields = ['created_at']

    def short_body(self, obj):
        return obj.body[:60] + '...' if len(obj.body) > 60 else obj.body
    short_body.short_description = 'Comment'

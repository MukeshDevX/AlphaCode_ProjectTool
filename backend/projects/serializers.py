from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Project, Task, Comment


class SimpleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class CommentSerializer(serializers.ModelSerializer):
    author = SimpleUserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'author', 'body', 'created_at']
        read_only_fields = ['author', 'created_at']


class TaskSerializer(serializers.ModelSerializer):
    assigned_to    = SimpleUserSerializer(read_only=True)
    assigned_to_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    created_by     = SimpleUserSerializer(read_only=True)
    comments       = CommentSerializer(many=True, read_only=True)
    comments_count = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'status', 'priority',
            'assigned_to', 'assigned_to_id', 'created_by',
            'due_date', 'created_at', 'updated_at',
            'comments', 'comments_count'
        ]
        read_only_fields = ['created_by', 'created_at', 'updated_at']

    def get_comments_count(self, obj):
        return obj.comments.count()


class ProjectSerializer(serializers.ModelSerializer):
    owner                  = SimpleUserSerializer(read_only=True)
    members                = SimpleUserSerializer(many=True, read_only=True)
    tasks                  = TaskSerializer(many=True, read_only=True)
    tasks_count            = serializers.SerializerMethodField()
    completed_tasks_count  = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'name', 'description', 'status',
            'owner', 'members', 'tasks', 'tasks_count',
            'completed_tasks_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['owner', 'created_at', 'updated_at']

    def get_tasks_count(self, obj):
        return obj.tasks.count()

    def get_completed_tasks_count(self, obj):
        return obj.tasks.filter(status='done').count()


class ProjectListSerializer(serializers.ModelSerializer):
    owner                 = SimpleUserSerializer(read_only=True)
    tasks_count           = serializers.SerializerMethodField()
    completed_tasks_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'status', 'owner', 'tasks_count', 'completed_tasks_count', 'created_at']

    def get_tasks_count(self, obj):
        return obj.tasks.count()

    def get_completed_tasks_count(self, obj):
        return obj.tasks.filter(status='done').count()

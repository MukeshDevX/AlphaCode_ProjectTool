from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Project, Task, Comment
from .serializers import ProjectSerializer, ProjectListSerializer, TaskSerializer, CommentSerializer


@api_view(['GET', 'POST'])
def project_list(request):
    if request.method == 'GET':
        projects = Project.objects.filter(owner=request.user) | Project.objects.filter(members=request.user)
        serializer = ProjectListSerializer(projects.distinct(), many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def project_detail(request, pk):
    try:
        project = Project.objects.get(pk=pk)
    except Project.DoesNotExist:
        return Response({'error': 'Project not found'}, status=404)

    if request.user != project.owner and request.user not in project.members.all():
        return Response({'error': 'Access denied'}, status=403)

    if request.method == 'GET':
        return Response(ProjectSerializer(project).data)

    elif request.method == 'PUT':
        if request.user != project.owner:
            return Response({'error': 'Not authorized'}, status=403)
        serializer = ProjectSerializer(project, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        if request.user != project.owner:
            return Response({'error': 'Not authorized'}, status=403)
        project.delete()
        return Response(status=204)


@api_view(['POST'])
def add_member(request, pk):
    try:
        project = Project.objects.get(pk=pk, owner=request.user)
    except Project.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)

    try:
        user = User.objects.get(username=request.data.get('username'))
        project.members.add(user)
        return Response({'message': f'{user.username} has been added to the project!'})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=400)


@api_view(['GET', 'POST'])
def task_list(request, project_pk):
    try:
        project = Project.objects.get(pk=project_pk)
    except Project.DoesNotExist:
        return Response({'error': 'Project not found'}, status=404)

    if request.user != project.owner and request.user not in project.members.all():
        return Response({'error': 'Access denied'}, status=403)

    if request.method == 'GET':
        tasks = project.tasks.all()
        if request.query_params.get('status'):
            tasks = tasks.filter(status=request.query_params.get('status'))
        return Response(TaskSerializer(tasks, many=True).data)

    elif request.method == 'POST':
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            assigned_user = None
            if request.data.get('assigned_to_id'):
                try:
                    assigned_user = User.objects.get(pk=request.data.get('assigned_to_id'))
                except User.DoesNotExist:
                    pass
            serializer.save(project=project, created_by=request.user, assigned_to=assigned_user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


@api_view(['GET', 'PUT', 'DELETE'])
def task_detail(request, project_pk, task_pk):
    try:
        project = Project.objects.get(pk=project_pk)
        task    = Task.objects.get(pk=task_pk, project=project)
    except (Project.DoesNotExist, Task.DoesNotExist):
        return Response({'error': 'Not found'}, status=404)

    if request.user != project.owner and request.user not in project.members.all():
        return Response({'error': 'Access denied'}, status=403)

    if request.method == 'GET':
        return Response(TaskSerializer(task).data)

    elif request.method == 'PUT':
        serializer = TaskSerializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            if request.data.get('assigned_to_id') is not None:
                try:
                    serializer.save(assigned_to=User.objects.get(pk=request.data.get('assigned_to_id')))
                except User.DoesNotExist:
                    serializer.save(assigned_to=None)
            else:
                serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        task.delete()
        return Response(status=204)


@api_view(['POST'])
def add_comment(request, project_pk, task_pk):
    try:
        project = Project.objects.get(pk=project_pk)
        task    = Task.objects.get(pk=task_pk, project=project)
    except (Project.DoesNotExist, Task.DoesNotExist):
        return Response({'error': 'Not found'}, status=404)

    if request.user != project.owner and request.user not in project.members.all():
        return Response({'error': 'Access denied'}, status=403)

    serializer = CommentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(task=task, author=request.user)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['DELETE'])
def delete_comment(request, project_pk, task_pk, comment_pk):
    try:
        comment = Comment.objects.get(pk=comment_pk, task__pk=task_pk, author=request.user)
    except Comment.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)
    comment.delete()
    return Response(status=204)

from django.urls import path
from . import views

urlpatterns = [
    path('projects/',                                                          views.project_list),
    path('projects/<int:pk>/',                                                 views.project_detail),
    path('projects/<int:pk>/add-member/',                                      views.add_member),
    path('projects/<int:project_pk>/tasks/',                                   views.task_list),
    path('projects/<int:project_pk>/tasks/<int:task_pk>/',                     views.task_detail),
    path('projects/<int:project_pk>/tasks/<int:task_pk>/comments/',            views.add_comment),
    path('projects/<int:project_pk>/tasks/<int:task_pk>/comments/<int:comment_pk>/', views.delete_comment),
]

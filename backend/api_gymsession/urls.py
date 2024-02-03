from django.urls import path
from . import views

urlpatterns = [
    path('details/', views.GymSessionDetails.as_view(), name='gym_session_details'),
    path('details/<str:day>/', views.GymSessionDetails.as_view(), name='gym_session_detail_specific_day'),
    path('schedule/', views.GymSessionSchedule.as_view(), name='gym_session_schedule'),
]
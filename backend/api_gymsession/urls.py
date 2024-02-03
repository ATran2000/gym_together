from django.urls import path
from . import views

urlpatterns = [
    path('details/', views.GymSessionDetails.as_view(), name='gym_session_details'),
    path('schedule/', views.GymSessionSchedule.as_view(), name='gym_session_schedule'),
]
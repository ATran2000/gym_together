from django.urls import path
from . import views

urlpatterns = [
    # User Endpoints
    path('details/', views.UserDetails.as_view(), name='details'),
    path('register/', views.UserRegister.as_view(), name='register'),
    path('login/', views.UserLogin.as_view(), name='login'),
    path('logout/', views.UserLogout.as_view(), name='logout'),

    # User Friend Endpoints
    path('friend_requests/', views.GetFriendRequests.as_view(), name='friend_requests'),
    path('send_friend_request/', views.SendFriendRequests.as_view(), name='send_friend_request'),
    path('accept_friend_request/<int:friend_request_id>/', views.AcceptFriendRequest.as_view(), name='accept_friend_request'),
    path('remove_friend_request/<int:friend_request_id>/', views.RemoveFriendRequest.as_view(), name='remove_friend_request'),
]
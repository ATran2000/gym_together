from django.contrib.auth import login, logout

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authentication import SessionAuthentication
from rest_framework import permissions, status

from .models import User, Friendship
from .serializers import UserRegisterSerializer, UserLoginSerializer, UserSerializer, FriendshipSerializer
from .validations import custom_validation, validate_email, validate_password

# Create your views here.

class UserRegister(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        clean_data = custom_validation(request.data)
        serializer = UserRegisterSerializer(data=clean_data)
        
        if serializer.is_valid(raise_exception=True):
            user = serializer.create(clean_data) # creates a new user object with the validated clean data

            if user:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response("Something went wrong when registering.", status=status.HTTP_400_BAD_REQUEST)

class UserLogin(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = [SessionAuthentication]

    def post(self, request):
        data = request.data
        assert validate_email(data)
        assert validate_password(data)
        serializer = UserLoginSerializer(data=data)

        if serializer.is_valid(raise_exception=True):
            user = serializer.check_user(data) # attempts to authenticate the user by checking their credentials
            login(request, user)

            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response("Incorrect Credentials. Try again.", status=status.HTTP_400_BAD_REQUEST)

class UserLogout(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        logout(request)

        return Response("You are now logged out!", status=status.HTTP_200_OK)

class UserDetails(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [SessionAuthentication]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
class GetFriendRequests(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [SessionAuthentication]

    def get(self, request):
        user = request.user
        # gets the user's friend requests by filtering Friendship objects where the user is the receiver and the status is pending
        friend_requests = Friendship.objects.filter(receiver=user, friendship_status='pending')
        serializer = FriendshipSerializer(friend_requests, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
class SendFriendRequests(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [SessionAuthentication]

    def post(self, request):
        sender = request.user
        receiver_username = request.data.get('receiver_username')

        try:
            # Get the receiver user instance
            receiver = User.objects.get(username=receiver_username)
        except User.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Check if a friend request already exists
        existing_friend_request = Friendship.objects.filter(sender=sender, receiver=receiver, friendship_status='pending').exists()
        if existing_friend_request:
            return Response({'detail': 'Friend request already sent.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if they are already your friend
        existing_friend = Friendship.objects.filter(sender=sender, receiver=receiver, friendship_status='accepted').exists() \
            or Friendship.objects.filter(sender=receiver, receiver=sender, friendship_status='accepted').exists()
        if existing_friend:
            return Response({'detail': 'User is already your friend.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create a new Friendship object representing the friend request
        friend_request = Friendship.objects.create(sender=sender, receiver=receiver, friendship_status='pending')

        serializer = FriendshipSerializer(friend_request)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

class AcceptFriendRequest(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [SessionAuthentication]

    def post(self, request, friend_request_id):
        try:
            # gets the specifc friend requests that the user wants to accept
            friend_request = Friendship.objects.get(id=friend_request_id, receiver=request.user, friendship_status='pending')
        except Friendship.DoesNotExist:
            return Response({'detail': 'Friend request not found or already accepted.'}, status=status.HTTP_404_NOT_FOUND)

        friend_request.friendship_status = 'accepted' # change the status of 'pending' to 'accepted'
        friend_request.save()

        # Update the friends field for both the sender and receiver
        sender = friend_request.sender
        receiver = friend_request.receiver

        sender.friends.add(receiver)
        receiver.friends.add(sender)

        serializer = FriendshipSerializer(friend_request)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
class RemoveFriendRequest(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [SessionAuthentication]

    def post(self, request, friend_request_id):
        try:
            # gets the specifc friend requests that the user wants to remove
            friend_request = Friendship.objects.get(id=friend_request_id, receiver=request.user, friendship_status='pending')
        except Friendship.DoesNotExist:
            return Response({'detail': 'Friend request not found or already removed.'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = FriendshipSerializer(friend_request)

        friend_request.delete()

        return Response({'detail': 'Friend request removed.', 'data': serializer.data}, status=status.HTTP_200_OK)
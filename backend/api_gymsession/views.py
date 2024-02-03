from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authentication import SessionAuthentication
from rest_framework import permissions, status

from .models import GymSession, Workout
from .serializers import GymSessionSerializer, WorkoutSerializer

# Create your views here.

class GymSessionDetails(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [SessionAuthentication]

    def get(self, request):
        user = request.user
        gym_sessions = GymSession.objects.filter(user=user)
        serializer = GymSessionSerializer(gym_sessions, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

class GymSessionSchedule(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [SessionAuthentication]

    def post(self, request):
        user = request.user
        day = request.data.get('day')
        time = request.data.get('time')
        target_muscles = request.data.get('target_muscles')
        
        # Check if the user already created a gym session for the specified day
        existing_gym_session = GymSession.objects.filter(user=user, day=day).exists()
        if existing_gym_session:
            return Response({'detail': 'Gym Session for this day already created.'}, status=status.HTTP_400_BAD_REQUEST)

        # Creates a new GymSession instance
        new_gym_session = GymSession.objects.create(user=user, day=day, time=time, target_muscles=target_muscles)

        serializer = GymSessionSerializer(new_gym_session)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
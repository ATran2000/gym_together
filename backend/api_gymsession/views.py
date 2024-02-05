from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authentication import SessionAuthentication
from rest_framework import permissions, status

from .models import GymSession, Workout
from .serializers import GymSessionSerializer, WorkoutSerializer

from datetime import date, datetime

# Create your views here.

class GymSessionDetails(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [SessionAuthentication]

    def get(self, request, day=None):
        user = request.user

        # If day is provided, filter gym sessions for the specified day
        if day:
            try:
                day = date.fromisoformat(day)
                gym_sessions = GymSession.objects.filter(user=user, day=day)
            except ValueError:
                return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # If day is not provided, get all gym sessions for the user
            gym_sessions = GymSession.objects.filter(user=user)

        # manually serializing the data to include workouts data for the gym sessions because doing it in the serializers.py file wasnt working
        serialized_data = []
        for gym_session in gym_sessions:
            gym_data = GymSessionSerializer(gym_session).data
            workouts = Workout.objects.filter(gym_session=gym_session)
            workout_data = WorkoutSerializer(workouts, many=True).data
            gym_data['workouts'] = workout_data
            serialized_data.append(gym_data)

        return Response(serialized_data, status=status.HTTP_200_OK)

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
    
class AddWorkout(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [SessionAuthentication]

    def post(self, request):
        today = datetime.now().date() # user could only add workouts for the current day

        try:
            gym_session = GymSession.objects.get(day=today, user=request.user) # check if the user created a schedule for the current day
        except GymSession.DoesNotExist:
            # If the gym session doesn't exist, create a new one with today's date
            timenow = datetime.now().strftime('%H:%M')
            gym_session = GymSession.objects.create(user=request.user, day=today, time=timenow, target_muscles='null')

        exercise = request.data.get('exercise')
        weight = request.data.get('weight')
        reps = request.data.get('reps')

        # Creates a new Workout instance associated with the specified (or newly created) gym session
        new_workout = Workout.objects.create(gym_session=gym_session, exercise=exercise, weight=weight, reps=reps)

        serializer = WorkoutSerializer(new_workout)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
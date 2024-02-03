from rest_framework.serializers import ModelSerializer
from .models import GymSession, Workout

class GymSessionSerializer(ModelSerializer):
    class Meta:
        model = GymSession
        fields = '__all__'

class WorkoutSerializer(ModelSerializer):
    class Meta:
        model = Workout
        fields = '__all__'
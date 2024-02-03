from django.db import models
from django.contrib.auth import get_user_model

UserModel = get_user_model()

# Create your models here.

class GymSession(models.Model):
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE)
    day = models.DateField()
    time = models.TimeField()
    target_muscles = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.user.username}'s Gym Session on {self.day} at {self.time}"

    class Meta:
        unique_together = ['user', 'day']

class Workout(models.Model):
    gym_session = models.ForeignKey(GymSession, on_delete=models.CASCADE)
    exercise = models.CharField(max_length=100)
    weight = models.DecimalField(max_digits=5, decimal_places=1)
    reps = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.exercise} - {self.weight} lbs x {self.reps} reps"
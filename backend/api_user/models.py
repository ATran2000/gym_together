from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser, PermissionsMixin

# Create your models here.

class UserManager(BaseUserManager):
	def create_user(self, email, username, password=None):
		if not email:
			raise ValueError('An email is required.')
		if not username:
			raise ValueError('An username is required.')
		if not password:
			raise ValueError('A password is required.')
		
		email = self.normalize_email(email)
		user = self.model(email=email, username=username)
		user.set_password(password)
		user.save()
		
		return user
	
	def create_superuser(self, email, username, password=None):
		if not email:
			raise ValueError('An email is required.')
		if not username:
			raise ValueError('An username is required.')
		if not password:
			raise ValueError('A password is required.')
		
		user = self.create_user(email, username, password)
		user.is_staff = True
		user.is_superuser = True
		user.save()
		
		return user

class User(AbstractUser, PermissionsMixin):
	email = models.EmailField(max_length=50, unique=True)
	username = models.CharField(max_length=50, unique=True) # username is unique for friend request purposes
	friends = models.ManyToManyField('User', blank=True)
	
	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS = ['username']
	
	objects = UserManager()
	
	def __str__(self):
		return self.username
	
STATUS_CHOICES = (
    ('pending', 'pending'),
    ('accepted', 'accepted'),
)
	
class Friendship(models.Model):
	sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sender')
	receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='receiver')
	friendship_status = models.CharField(max_length=8, choices=STATUS_CHOICES)

	updated = models.DateTimeField(auto_now=True)
	created = models.DateTimeField(auto_now_add=True)
	

	def __str__(self):
		return f"{self.sender}-{self.receiver}-{self.friendship_status}"
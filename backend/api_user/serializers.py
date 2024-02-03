from rest_framework.serializers import ModelSerializer, EmailField, CharField
from django.contrib.auth import get_user_model, authenticate
from .models import Friendship

UserModel = get_user_model()

class UserRegisterSerializer(ModelSerializer):
    class Meta:
        model = UserModel
        fields = '__all__'

    def create(self, clean_data):
        user_obj = UserModel.objects.create_user(email=clean_data['email'], username=clean_data['username'], password=clean_data['password'])
        user_obj.save()

        return user_obj

class UserLoginSerializer(ModelSerializer):
    class Meta:
        model = UserModel
        fields = ['email', 'password']
        
    # this email variable is added because we do not need to enforce the UniqueValidator from the email field from the model since we are just authenticating the user
    email = EmailField()
    password = CharField()

    def check_user(self, clean_data):
        user = authenticate(email=clean_data['email'], password=clean_data['password'])
        if not user:
            raise ValueError('User not found.')
        
        return user

class FriendSerializer(ModelSerializer):
    class Meta:
        model = UserModel
        fields = ['id', 'username']

class UserSerializer(ModelSerializer):
    friends = FriendSerializer(many=True, read_only=True)
    
    class Meta:
        model = UserModel
        fields = ['username', 'email', 'friends']

class FriendshipSerializer(ModelSerializer):
    sender = FriendSerializer(many=False, read_only=True)
    receiver = FriendSerializer(many=False, read_only=True)

    class Meta:
        model = Friendship
        fields = '__all__'
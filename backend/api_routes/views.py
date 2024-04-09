from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

@api_view(['GET'])
@permission_classes([AllowAny])
def getRoutes(request):
    routes = [
        'api/user/details/',
        'api/user/register/',
        'api/user/login/',
        'api/user/logout/',
        'api/user/friend_requests/',
        'api/user/send_friend_request/',
        'api/user/accept_friend_request/<int:friend_request_id>/',
        'api/remove_friend_request/<int:friend_request_id>/',
        '',
        'api/gymsession/details',
        'api/gymsession/details/<str:day>/',
        'api/gymsession/schedule',
        'api/gymsession/addworkout/',
    ]

    return Response(routes)
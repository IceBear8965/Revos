from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from apps.common.loggers import log_event

from .serializers import RegisterUserSerializer


class RegisterUserView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        log_event(
            action="user_registered",
            user_id=user.id,
            extra={"email": user.email, "timezone": user.timezone},
        )
        return Response(
            {
                "refresh": str(refresh),
                "access": str(access),
            },
            status=HTTP_201_CREATED,
        )

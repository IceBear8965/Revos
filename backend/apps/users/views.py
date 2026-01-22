from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_202_ACCEPTED
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from apps.common.loggers import log_event

from .serializers import (
    ChangeNicknameSerializer,
    ChangeTimezoneSerializer,
    MeSerializer,
    RegisterUserSerializer,
)
from .services.generate_user_info import generate_user_info


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


class MeView(APIView):
    def get(self, request):
        user = request.user
        user_info = generate_user_info(user=user)
        serialiszer = MeSerializer(instance=user_info)
        validated_data = serialiszer.data
        return Response(validated_data, status=HTTP_200_OK)


class ChangeNicknameView(APIView):
    def patch(self, request):
        user = request.user
        serializer = ChangeNicknameSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.data

        previous_nickname = user.nickname
        user.nickname = validated_data["nickname"]
        user.save(update_fields=["nickname"])

        log_event(
            action="nickname_changed",
            user_id=user.id,
            extra={"previous_nickname": previous_nickname, "current_nickname": user.nickname},
        )
        return Response({"updated_nickname": user.nickname}, status=HTTP_202_ACCEPTED)


class ChangeTimezoneView(APIView):
    def patch(self, request):
        user = request.user
        serializer = ChangeTimezoneSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.data

        previous_timezone = user.timezone
        user.timezone = validated_data["timezone"]
        user.save(update_fields=["timezone"])

        log_event(
            action="timezone_changed",
            user_id=user.id,
            extra={"previous_timezone": previous_timezone, "current_timezone": user.timezone},
        )
        return Response({"updated_timezone": user.timezone}, status=HTTP_202_ACCEPTED)

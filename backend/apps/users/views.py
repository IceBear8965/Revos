from drf_spectacular.utils import extend_schema
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


@extend_schema(
    request=RegisterUserSerializer,
    responses={
        201: {
            "type": "object",
            "properties": {
                "refresh": {"type": "string", "description": "JWT refresh token"},
                "access": {"type": "string", "description": "JWT access token"},
            },
        }
    },
    description="Register a new user and return JWT tokens",
    summary="User registration",
)
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


@extend_schema(
    request=MeSerializer,
    responses={
        201: {
            "type": "object",
            "properties": {
                "user_id": {
                    "type": "number",
                    "format": "float",
                    "description": "Logged in user ID",
                },
                "email": {
                    "type": "string",
                    "format": "email",
                    "description": "Logged in user email",
                },
                "nickname": {"type": "string", "description": "Logged in user nickname"},
                "timezone": {
                    "type": "string",
                    "format": "date-time",
                    "description": "Logged in user timezone",
                },
                "load_order": {
                    "type": "object",
                    "format": "dict",
                    "description": "Logged in user load order",
                },
            },
        }
    },
    description="Return info about current user",
    summary="User info",
)
class MeView(APIView):
    def get(self, request):
        user = request.user
        user_info = generate_user_info(user=user)
        serialiszer = MeSerializer(instance=user_info)
        validated_data = serialiszer.data
        return Response(validated_data, status=HTTP_200_OK)


@extend_schema(
    request=ChangeNicknameSerializer,
    responses={
        202: {
            "type": "object",
            "properties": {
                "updated_nickname": {"type": "string", "description": "Updated user nickname"}
            },
        }
    },
    description="Change user nickname and return changed nickname",
    summary="Change user nickname",
)
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


@extend_schema(
    request=ChangeTimezoneSerializer,
    responses={
        202: {
            "type": "object",
            "properties": {
                "updated_timezone": {"type": "string", "description": "Updated user timezone"}
            },
        }
    },
    description="Change user timezone and return new timezone",
    summary="Change user timezone",
)
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

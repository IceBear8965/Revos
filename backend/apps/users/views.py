from rest_framework import serializers
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED
from rest_framework.views import APIView

from .serializers import RegisterUserSerializer


class RegisterUserView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data
        user = serializer.save()
        return Response(validated_data, status=HTTP_201_CREATED)

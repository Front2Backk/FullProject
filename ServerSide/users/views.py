from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from .serializers import RegisterSerializer
from django.contrib.auth.models import User
from rest_framework import generics
<<<<<<< HEAD
=======
from rest_framework_simplejwt.tokens import RefreshToken, TokenError, AccessToken
>>>>>>> 5d8cd179cdec0d528e635d1b6117018aa61d326a

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    

<<<<<<< HEAD
from rest_framework_simplejwt.tokens import RefreshToken, TokenError, AccessToken
=======
>>>>>>> 5d8cd179cdec0d528e635d1b6117018aa61d326a

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logout successful"}, status=status.HTTP_205_RESET_CONTENT)
        except TokenError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return Response({"error": "Invalid refresh token."}, status=status.HTTP_400_BAD_REQUEST)


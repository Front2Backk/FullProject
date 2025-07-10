from django.urls import path
from .views import RegisterView
from rest_framework_simplejwt.views import TokenObtainPairView
from .views import RegisterView, LogoutView
<<<<<<< HEAD
=======
from rest_framework_simplejwt.views import TokenRefreshView

>>>>>>> 5d8cd179cdec0d528e635d1b6117018aa61d326a

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
<<<<<<< HEAD
=======
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
>>>>>>> 5d8cd179cdec0d528e635d1b6117018aa61d326a
]

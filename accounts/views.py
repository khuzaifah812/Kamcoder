from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Student
from .serializers import (
    AdminLoginSerializer,
    LoginSerializer,
    RegisterSerializer,
    StudentSerializer,
)


def tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {"access": str(refresh.access_token), "refresh": str(refresh)}


class RegisterView(generics.CreateAPIView):
    """POST /api/auth/register/  -- replaces register.js localStorage write."""

    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        student = serializer.save()
        return Response(
            {"message": "Registration successful", "student": StudentSerializer(student).data},
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    """POST /api/auth/login/  -- replaces login.js localStorage lookup."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        student = user.student_profile
        return Response(
            {
                "message": "Login successful",
                "student": StudentSerializer(student).data,
                **tokens_for_user(user),
            }
        )


class MeView(APIView):
    """GET /api/auth/me/ -- replaces reading localStorage("loggedInUser")."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        student = getattr(request.user, "student_profile", None)
        if not student:
            return Response({"detail": "Not a student account."}, status=403)
        return Response(StudentSerializer(student).data)


class AdminLoginView(APIView):
    """POST /api/auth/admin/login/ -- replaces the hard-coded admin-login.js check."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = AdminLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        return Response({"message": "Admin login successful", **tokens_for_user(user)})


class AdminStudentListView(generics.ListAPIView):
    """GET /api/auth/admin/students/ -- replaces admin.html reading localStorage("students")."""

    serializer_class = StudentSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Student.objects.all().order_by("created_at")

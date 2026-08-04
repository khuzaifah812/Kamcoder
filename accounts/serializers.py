from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import Student, registration_validator


class StudentSerializer(serializers.ModelSerializer):
    """Read-only representation of a student, matching the shape the
    original frontend expected from localStorage's "loggedInUser"."""

    email = serializers.EmailField(source="user.email", read_only=True)
    date = serializers.DateTimeField(source="created_at", read_only=True, format="%d/%m/%Y")

    class Meta:
        model = Student
        fields = [
            "id",
            "fullname",
            "registration",
            "email",
            "phone",
            "course",
            "date",
        ]


class RegisterSerializer(serializers.Serializer):
    fullname = serializers.CharField(max_length=150)
    registration = serializers.CharField(max_length=20, validators=[registration_validator])
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    course = serializers.CharField(max_length=120, required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True, min_length=6)

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})

        if User.objects.filter(username=attrs["registration"]).exists() or \
                Student.objects.filter(registration=attrs["registration"]).exists():
            raise serializers.ValidationError({"registration": "Registration number already exists."})

        if User.objects.filter(email__iexact=attrs["email"]).exists():
            raise serializers.ValidationError({"email": "Email already exists."})

        validate_password(attrs["password"])
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["registration"],
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data["fullname"].split(" ")[0],
        )
        student = Student.objects.create(
            user=user,
            fullname=validated_data["fullname"],
            registration=validated_data["registration"],
            phone=validated_data.get("phone", ""),
            course=validated_data.get("course", ""),
        )
        return student


class LoginSerializer(serializers.Serializer):
    registration = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(username=attrs["registration"], password=attrs["password"])
        if not user:
            raise serializers.ValidationError("Invalid registration number or password.")
        if not hasattr(user, "student_profile"):
            raise serializers.ValidationError("This account has no student profile.")
        attrs["user"] = user
        return attrs


class AdminLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(username=attrs["username"], password=attrs["password"])
        if not user or not (user.is_staff or user.is_superuser):
            raise serializers.ValidationError("Invalid admin username or password.")
        attrs["user"] = user
        return attrs

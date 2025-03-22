from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone
from django.db import IntegrityError, DataError
from decimal import Decimal, InvalidOperation
import uuid
import logging
from chatbot.models import Users, Patients, Clinicians, Hospital

logger = logging.getLogger(__name__)

@api_view(["POST"])
def register_view(request):
    """Handle user registration with role-based profile creation."""
    try:
        data = request.data
        required_fields = ["name", "email", "password"]
        
        # Validate required fields
        missing_fields = [field for field in required_fields if not data.get(field)]
        if missing_fields:
            return Response(
                {"error": f"Missing required fields: {', '.join(missing_fields)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        email = data["email"]
        if Users.objects.filter(email=email).exists():
            return Response(
                {"error": "Email already registered"}, 
                status=status.HTTP_409_CONFLICT
            )

        # Create base user
        user = Users.objects.create(
            id=uuid.uuid4(),
            name=data["name"],
            email=email,
            password_hash=make_password(data["password"]),
            role=data.get("role", "patient"),
            created_at=timezone.now()
        )

        # Create role-specific profile
        role = user.role.lower()
        if role == "patient":
            try:
                Patients.objects.create(
                    id=user,  # Direct user instance reference
                    age=int(data.get("age", 0)),
                    weight=Decimal(str(data.get("weight", 0))),
                    allergies=data.get("allergies", "")
                )
            except (ValueError, InvalidOperation) as e:
                user.delete()
                return Response(
                    {"error": f"Invalid patient data: {str(e)}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        elif role == "clinician":
            hospital_id = data.get("hospital_id")
            if not hospital_id:
                user.delete()
                return Response(
                    {"error": "Hospital ID required for clinicians"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                hospital = Hospital.objects.get(id=uuid.UUID(hospital_id))
            except (Hospital.DoesNotExist, ValueError):
                user.delete()
                return Response(
                    {"error": "Invalid hospital ID"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            Clinicians.objects.create(
                id=user,
                specialization=data.get("specialization", ""),
                title=data.get("title", ""),
                rating=float(data.get("rating", 0.0)),
                verified=bool(data.get("verified", False)),
                hospital=hospital
            )

        else:
            user.delete()
            return Response(
                {"error": "Invalid user role"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {"message": f"{role.capitalize()} registered successfully"},
            status=status.HTTP_201_CREATED
        )

    except (IntegrityError, DataError) as e:
        logger.error(f"Database error during registration: {str(e)}")
        return Response(
            {"error": "Registration failed due to database constraints"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    except Exception as e:
        logger.error(f"Unexpected error during registration: {str(e)}")
        return Response(
            {"error": "Internal server error"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(["POST"])
def login_view(request):
    """Authenticate users and return success status."""
    try:
        data = request.data
        if not (email := data.get("email")):
            return Response(
                {"error": "Email required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        if not (password := data.get("password")):
            return Response(
                {"error": "Password required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = Users.objects.get(email=email)
        except Users.DoesNotExist:
            return Response(
                {"error": "Invalid credentials"}, 
                status=status.HTTP_401_UNAUTHORIZED
            )

        if check_password(password, user.password_hash):
            return Response({
                "message": "Login successful",
                "user_id": str(user.id),
                "name": user.name,
                "role": user.role
            }, status=status.HTTP_200_OK)
        
        return Response(
            {"error": "Invalid credentials"}, 
            status=status.HTTP_401_UNAUTHORIZED
        )

    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return Response(
            {"error": "Authentication failed"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone
import uuid
import logging
from datetime import date
from django.core.exceptions import ValidationError
from chatbot.models import Users, Patients, Clinicians, Hospital

logger = logging.getLogger(__name__)


@api_view(["POST"])
def register_view(request):
    print(111)
    """
    Register a new user with role-specific details
    Expected JSON:
    {
        "email": "user@example.com",
        "password": "securepass123",
        "role": "patient/clinician",
        "name": "Optional Name",
        "gender": "male/female",
        // Patient-specific
        "date_of_birth": "2000-01-01",
        "weight": 70.5,
        "allergies": "None",
        // Clinician-specific
        "specialization": "Cardiology",
        "title": "Dr.",
        "years_of_experience": 10,
        "qualification": "MD",
        "hospital_id": "uuid"
    }
    """
    print(222)
    try:
        data = request.data
        required = ["email", "password", "role"]
        if missing := [field for field in required if not data.get(field)]:
            return Response(
                {"error": f"Missing fields: {', '.join(missing)}"}, status=400
            )

        if Users.objects.filter(email=data["email"]).exists():
            return Response({"error": "Email already exists"}, status=409)
        # Base user creation
        user = Users.objects.create(
            id=uuid.uuid4(),
            email=data["email"],
            password_hash=make_password(data["password"]),
            role=data["role"].lower(),
            name=data.get("name", None),
            gender=data.get("gender", None),
            created_at=timezone.now(),
        )

        # Role-specific profile
        if user.role == "patient":
            # try:
            #     dob = date.fromisoformat(data["date_of_birth"])
            # except (ValueError, KeyError):
            #     user.delete()
            #     return Response(
            #         {"error": "Valid date_of_birth (YYYY-MM-DD) required"}, status=400
            #     )

            Patients.objects.create(
                id=user,
                date_of_birth=None,
                weight=data.get("weight", 0),
                allergies=data.get("allergies", ""),
            )

        elif user.role == "clinician":
            try:
                hospital = Hospital.objects.get(id=data["hospital_id"])
            except (Hospital.DoesNotExist, ValueError):
                user.delete()
                return Response({"error": "Invalid hospital ID"}, status=400)

            Clinicians.objects.create(
                id=user,
                specialization=data.get("specialization", ""),
                title=data.get("title", ""),
                years_of_experience=data.get("years_of_experience"),
                qualification=data.get("qualification"),
                hospital=hospital,
                rating=data.get("rating", 0.0),
                verified=data.get("verified", False),
            )
            print(6)

        else:
            user.delete()
            return Response({"error": "Invalid role"}, status=400)
        print("success")
        return Response(
            {"message": "Registration successful", "user_id": str(user.id)}, status=201
        )

    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        return Response({"error": "Registration failed"}, status=500)


@api_view(["POST"])
def login_view(request):
    """
    Authenticate user
    Expected JSON:
    {
        "email": "user@example.com",
        "password": "securepass123"
    }
    """
    try:
        data = request.data
        if not (email := data.get("email")):
            return Response({"error": "Email required"}, status=400)
        if not (password := data.get("password")):
            return Response({"error": "Password required"}, status=400)

        user = Users.objects.get(email=email)
        if check_password(password, user.password_hash):
            return Response(
                {
                    "message": "Login successful",
                    "user_id": str(user.id),
                    "role": user.role,
                    "name": user.name,
                }
            )
        return Response({"error": "Invalid credentials"}, status=401)

    except Users.DoesNotExist:
        return Response({"error": "Account not found"}, status=404)
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return Response({"error": "Login failed"}, status=500)


@api_view(["PUT"])
def update_user(request, user_id):
    try:
        # Validate UUID format
        try:
            # print(1)
            user_uuid = user_id
            # print(1)
            user = Users.objects.get(id=user_uuid)
        except (ValueError, Users.DoesNotExist):
            return Response({"error": "Invalid user ID"}, status=400)

        data = request.data

        # Update base user fields
        if "name" in data:
            user.name = data["name"]
        if "email" in data:
            if Users.objects.filter(email=data["email"]).exclude(id=user.id).exists():
                return Response({"error": "Email already in use"}, status=400)
            user.email = data["email"]
        if "password" in data:
            user.password_hash = make_password(data["password"])
        if "gender" in data:
            user.gender = data["gender"]
        user.save()

        # Update role-specific fields
        if user.role == "patient":
            patient = user.patients
            if "date_of_birth" in data:
                try:
                    patient.date_of_birth = date.fromisoformat(data["date_of_birth"])
                except ValueError:
                    return Response({"error": "Invalid date format"}, status=400)
            if "weight" in data:
                patient.weight = data["weight"]
            if "allergies" in data:
                patient.allergies = data["allergies"]
            patient.save()

        elif user.role == "clinician":
            clinician = user.clinicians
            if "specialization" in data:
                clinician.specialization = data["specialization"]
            if "years_of_experience" in data:
                clinician.years_of_experience = data["years_of_experience"]
            if "qualification" in data:
                clinician.qualification = data["qualification"]
            clinician.save()

        return Response({"message": "User updated successfully"}, status=200)

    except Exception as e:
        logger.error(f"Update error: {str(e)}")
        return Response({"error": "Update failed"}, status=500)

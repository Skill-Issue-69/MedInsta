# chat_views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Prefetch, Q
from django.utils import timezone
import uuid
import logging
import json
from chatbot.models import (
    Symptoms,
    Messages,
    Chats,
    Users,
    Patients,
    AiDiagnoses,
    Clinicians,
    QueryCategories,
)
from chatbot.final import analyze_medical_text

logger = logging.getLogger(__name__)

VALID_MESSAGE_TYPES = ["text", "image", "voice"]
VALID_STATUSES = ["open", "in_review", "resolved"]


def get_system_user():
    user, created = Users.objects.get_or_create(
        email="system@example.com",
        defaults={
            "id": uuid.uuid4(),  # Explicit ID
            "name": "System AI",
            "role": "system",
            "password_hash": "system",
        },
    )
    return user


def format_chat_history(chat_id):
    messages = Messages.objects.filter(chat_id=chat_id).order_by("timestamp")
    return "\n".join(
        [
            f"[{msg.timestamp}] {msg.sender.name} ({msg.message_type}): {msg.message}"
            + (f" [Media: {msg.media_url}]" if msg.media_url else "")
            for msg in messages
        ]
    )


def assign_best_clinician(chat, ai_specialty):
    try:
        clinicians = (
            Clinicians.objects.filter(
                Q(specialization__iexact=ai_specialty)
                | Q(specialization__iexact="General Practice")
            )
            .distinct()
            .order_by("-rating", "current_chats")
        )

        if not clinicians.exists():
            logger.error("No clinicians available for assignment")
            return None

        best_clinician = clinicians.first()
        best_clinician.current_chats += 1
        best_clinician.save()

        chat.clinician = best_clinician
        chat.status = "in_review"
        chat.save()
        return best_clinician

    except Exception as e:
        logger.error(f"Clinician assignment error: {str(e)}")
        return None


@api_view(["POST"])
def create_chat(request):
    try:
        system_user = get_system_user()
        data = request.data

        # Validate input
        if (
            not (message_type := data.get("message_type"))
            or message_type not in VALID_MESSAGE_TYPES
        ):
            return Response({"error": "Invalid message type"}, status=400)

        if message_type in ["image", "voice"] and not data.get("media_url"):
            return Response({"error": "Media URL required"}, status=400)

        try:
            patient = Patients.objects.get(id=uuid.UUID(data["patient_id"]))
        except (Patients.DoesNotExist, ValueError):
            return Response({"error": "Invalid patient ID"}, status=400)

        # Create chat (ID auto-generated by model)
        chat = Chats.objects.create(patient=patient, status="open")

        # Create symptom with explicit ID
        symptom = Symptoms.objects.create(
            id=uuid.uuid4(),  # Explicit ID
            patient=patient,
            description=data["message"],
            symptom_type=message_type,
            media_url=data.get("media_url"),
        )

        # Create initial message with explicit ID
        message = Messages.objects.create(
            id=uuid.uuid4(),  # Explicit ID
            chat=chat,
            sender=patient.id,
            message=data["message"],
            message_type=message_type,
            media_url=data.get("media_url"),
        )

        # Process through AI
        chat_history = format_chat_history(chat.id)
        ml_response = analyze_medical_text(chat_history)

        # Store diagnosis with explicit ID
        diagnosis = AiDiagnoses.objects.create(
            id=uuid.uuid4(),  # Explicit ID
            symptom=symptom,
            ai_response=json.dumps(ml_response),
            confidence_score=ml_response.get("confidence", 0.75),
        )

        # Assign clinician
        ai_specialty = ml_response.get("recommended_specialty", "General Practice")
        assigned_clinician = assign_best_clinician(chat, ai_specialty)

        # Create AI message with explicit ID
        msg = Messages.objects.create(
            id=uuid.uuid4(),  # Explicit ID
            chat=chat,
            sender=system_user,
            message=f"AI Analysis: {ml_response.get('summary', 'Initial assessment')}\n"
            f"Recommended specialty: {ai_specialty}\n"
            f"{'Assigned to: Dr. ' + assigned_clinician.id.name + ' (' + assigned_clinician.specialization + ')' if assigned_clinician else 'Awaiting clinician assignment'}",
            message_type="text",
        )
        print(ml_response)
        print(msg)
        return Response(
            {
                "message_id": str(msg.id),
                "chat_id": str(chat.id),
                "symptom_id": str(symptom.id),
                "diagnosis_id": str(diagnosis.id),
                "assigned_clinician": (
                    str(assigned_clinician.id.id) if assigned_clinician else None
                ),
                "ai_response": ml_response.get("symptoms"),
                "timestamp": str(ml_response.get("timestamp")),
            },
            status=status.HTTP_201_CREATED,
        )

    except Exception as e:
        logger.error(f"Chat creation failed: {str(e)}")
        return Response({"error": "Chat creation failed"}, status=500)


@api_view(["POST"])
def add_message(request):
    try:
        system_user = get_system_user()
        data = request.data

        # Validate input
        if (
            not (message_type := data.get("message_type"))
            or message_type not in VALID_MESSAGE_TYPES
        ):
            return Response({"error": "Invalid message type"}, status=400)

        try:
            chat = Chats.objects.get(id=uuid.UUID(data["chat_id"]))
            sender = Users.objects.get(id=uuid.UUID(data["sender_id"]))
        except (Chats.DoesNotExist, Users.DoesNotExist, ValueError):
            return Response({"error": "Invalid chat/sender ID"}, status=400)

        # Create symptom with explicit ID
        symptom = Symptoms.objects.create(
            id=uuid.uuid4(),  # Explicit ID
            patient=chat.patient,
            description=data["message"],
            symptom_type=message_type,
            media_url=data.get("media_url"),
        )

        # Create message with explicit ID
        message = Messages.objects.create(
            id=uuid.uuid4(),  # Explicit ID
            chat=chat,
            sender=sender,
            message=data["message"],
            message_type=message_type,
            media_url=data.get("media_url"),
        )

        # Process through AI
        chat_history = format_chat_history(chat.id)
        ml_response = analyze_medical_text(chat_history)

        # Update diagnosis with explicit ID
        diagnosis = AiDiagnoses.objects.create(
            id=uuid.uuid4(),  # Explicit ID
            symptom=symptom,
            ai_response=json.dumps(ml_response),
            confidence_score=ml_response.get("confidence", 0.75),
        )

        # Create AI response message with explicit ID
        Messages.objects.create(
            id=uuid.uuid4(),  # Explicit ID
            chat=chat,
            sender=system_user,
            message=f"AI Update: {ml_response.get('summary', 'New analysis')}",
            message_type="text",
        )

        return Response(
            {
                "message_id": str(message.id),
                "diagnosis_id": str(diagnosis.id),
                "ai_response": f"AI Update: {ml_response.get('summary', 'New analysis')}",
            },
            status=201,
        )

    except Exception as e:
        logger.error(f"Message error: {str(e)}")
        return Response({"error": "Message processing failed"}, status=500)


@api_view(["PUT"])
def update_chat(request, chat_id):
    try:
        chat = Chats.objects.get(id=uuid.UUID(chat_id))
    except Chats.DoesNotExist:
        return Response({"error": "Chat not found"}, status=404)

    data = request.data
    original_status = chat.status
    original_clinician = chat.clinician

    # Status update
    if new_status := data.get("status"):
        if new_status not in VALID_STATUSES:
            return Response({"error": "Invalid status"}, status=400)

        if (
            new_status == "resolved"
            and original_status != "resolved"
            and chat.clinician
        ):
            chat.clinician.current_chats = max(0, chat.clinician.current_chats - 1)
            chat.clinician.save()

        chat.status = new_status

    # Clinician assignment
    if clinician_id := data.get("clinician_id"):
        try:
            new_clinician = Clinicians.objects.get(id=uuid.UUID(clinician_id))

            if original_clinician:
                original_clinician.current_chats = max(
                    0, original_clinician.current_chats - 1
                )
                original_clinician.save()

            new_clinician.current_chats += 1
            new_clinician.save()
            chat.clinician = new_clinician

        except Clinicians.DoesNotExist:
            return Response({"error": "Clinician not found"}, status=404)

    chat.save()
    return Response(
        {
            "status": chat.status,
            "clinician_id": str(chat.clinician.id.id) if chat.clinician else None,
            "current_chats": chat.clinician.current_chats if chat.clinician else None,
        }
    )


@api_view(["GET"])
def get_chats(request, user_id):
    print(1)
    try:
        user = Users.objects.get(id=(user_id))
    except Users.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    chats = Chats.objects.none()
    print(2)
    # Check user role first
    if user.role == "patient":
        try:
            patient = user.patients  # Access through OneToOne reverse relation
            chats = Chats.objects.filter(patient=patient)
        except Patients.DoesNotExist:
            return Response({"error": "Patient profile not found"}, status=404)

    elif user.role == "clinician":
        try:
            clinician = user.clinicians  # Access through OneToOne reverse relation
            chats = Chats.objects.filter(clinician=clinician)
        except Clinicians.DoesNotExist:
            return Response({"error": "Clinician profile not found"}, status=404)
    print(3)
    # Correct prefetch using the proper related_name
    chats = chats.prefetch_related(
        Prefetch(
            "messages_set",  # Changed from 'messages' to 'messages_set'
            queryset=Messages.objects.order_by("-timestamp"),
            to_attr="latest_messages",
        )
    ).distinct()
    print(4)
    response_list = []
    for chat in chats:
        # Each chat's prefetch should return a list of messages; we take the first as the latest.
        latest_message = (
            chat.latest_messages[0]
            if hasattr(chat, "latest_messages") and chat.latest_messages
            else None
        )

        last_symptom = None
        if latest_message and latest_message.timestamp:
            last_symptom = {
                "description": latest_message.message,
                "message_type": latest_message.message_type,
                "media_url": latest_message.media_url,
                "timestamp": latest_message.timestamp.isoformat(),
            }
        clinician_info = {}
        if chat.clinician:
            clinician_info = {
                "clinician_id": str(chat.clinician.id.id),
                "name": chat.clinician.id.name,  # Access through OneToOne
                "specialization": chat.clinician.specialization,
            }
        chat_info = {
            "chat_id": str(chat.id),
            "patient_id": str(chat.patient.id) if chat.patient else None,
            "clinician_info": clinician_info if clinician_info else None,
            "last_symptom": last_symptom,
            "last_message_time": (
                latest_message.timestamp.isoformat()
                if latest_message and latest_message.timestamp
                else None
            ),
        }
        response_list.append(chat_info)

    # Sort the chats by last_message_time in descending order
    response_list.sort(
        key=lambda x: x["last_message_time"] or "1970-01-01T00:00:00Z", reverse=True
    )

    return Response(response_list)


@api_view(['GET'])
def get_messages(request, chat_id, user_id):
    try:
        # Validate UUIDs
        chat_uuid = (chat_id)
        user_uuid = (user_id)
        
        # Get user and chat
        user = Users.objects.get(id=user_uuid)
        chat = Chats.objects.get(id=chat_uuid)
        
        # Verify user has access to the chat
        if not (user == chat.patient.id or user == chat.clinician.id.id):
            return Response({'error': 'Unauthorized access'}, status=status.HTTP_403_FORBIDDEN)

        # Get messages with sender details
        messages = Messages.objects.filter(chat=chat).order_by('timestamp').select_related('sender')
        
        response_data = {
            'chat_id': str(chat.id),
            'participants': {
                'patient': {
                    'id': str(chat.patient.id.id),
                    'name': chat.patient.id.name
                },
                'clinician': {
                    'id': str(chat.clinician.id.id),
                    'name': chat.clinician.id.name
                } if chat.clinician else None
            },
            'messages': [
                {
                    'id': str(msg.id),
                    'content': msg.message,
                    'type': msg.message_type,
                    'timestamp': msg.timestamp.isoformat(),
                    'sender': {
                        'id': str(msg.sender.id),
                        'name': msg.sender.name,
                        'role': msg.sender.role,
                        'is_me': msg.sender == user
                    },
                    'media_url': msg.media_url
                } for msg in messages
            ]
        }

        return Response(response_data)
    
    except (ValueError, Users.DoesNotExist):
        return Response({'error': 'Invalid user ID'}, status=status.HTTP_404_NOT_FOUND)
    
    except Chats.DoesNotExist:
        return Response({'error': 'Chat not found'}, status=status.HTTP_404_NOT_FOUND)
    
    except Exception as e:
        logger.error(f'Message retrieval error: {str(e)}')
        return Response({'error': 'Failed to retrieve messages'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
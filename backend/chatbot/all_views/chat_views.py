# chat_views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Prefetch
from django.utils import timezone
import uuid
import logging
from chatbot.models import Symptoms, Messages, Chats, Users, Patients, AiDiagnoses, Clinicians, QueryCategories
from chatbot.final import analyze_medical_text

logger = logging.getLogger(__name__)
#(1)
VALID_MESSAGE_TYPES = ['text', 'image', 'voice']
VALID_STATUSES = ['open', 'in_review', 'resolved']

def format_chat_history(chat_id):
    """Format complete chat history for AI processing"""
    messages = Messages.objects.filter(chat_id=chat_id).order_by('timestamp')
    return "\n".join([
        f"[{msg.timestamp}] {msg.sender.name} ({msg.message_type}): {msg.message}"
        + (f" [Media: {msg.media_url}]" if msg.media_url else "")
        for msg in messages
    ])
system_user=Users.objects.get(email="system@example.com")

@api_view(["POST"])
def create_chat(request):
    """
    Create new chat with initial symptom/message
    Expected JSON:
    {
        "patient_id": "uuid",
        "message": "content",
        "message_type": "text/image/voice",
        "media_url": "required for image/voice"
    }
    """
    try:
        data = request.data
        
        # Validate input
        if not (message_type := data.get("message_type")) or message_type not in VALID_MESSAGE_TYPES:
            return Response({"error": f"Invalid type. Valid: {VALID_MESSAGE_TYPES}"}, status=400)

        if message_type in ['image', 'voice'] and not data.get("media_url"):
            return Response({"error": "media_url required for image/voice"}, status=400)

        # Get patient
        try:
            patient = Patients.objects.get(id=uuid.UUID(data["patient_id"]))
        except (Patients.DoesNotExist, ValueError):
            return Response({"error": "Invalid patient ID"}, status=400)

        # Create chat
        chat = Chats.objects.create(
            id=uuid.uuid4(),
            patient=patient,
            status="open",
            created_at=timezone.now()
        )

        # Create symptom
        symptom = Symptoms.objects.create(
            id=uuid.uuid4(),
            patient=patient,
            description=data["message"],
            symptom_type=message_type,
            media_url=data.get("media_url"),
            submitted_at=timezone.now()
        )

        # Create message
        message = Messages.objects.create(
            id=uuid.uuid4(),
            chat=chat,
            sender=patient.id,
            message=data["message"],
            message_type=message_type,
            media_url=data.get("media_url"),
            timestamp=timezone.now()
        )
        
        # Process through AI model
        chat_history = format_chat_history(chat.id)
        ml_response = analyze_medical_text(chat_history)
        print((ml_response))

        # Store AI diagnosis
        diagnosis = AiDiagnoses.objects.create(
            id=uuid.uuid4(),
            symptom=symptom,
            ai_response=ml_response,
            confidence_score=ml_response.get("confidence", 0.75),
            created_at=timezone.now()
        )
        print(ml_response)
        # Add AI response message
        ai_message = f"AI Analysis: {ml_response.get('summary', 'Initial analysis complete')}"
        Messages.objects.create(
            id=uuid.uuid4(),
            chat=chat,
            sender=system_user,
            message=ai_message,
            message_type="text",
            timestamp=timezone.now()
        )
        

        return Response({
            "chat_id": str(chat.id),
            "symptom_id": str(symptom.id),
            "message_id": str(message.id),
            "diagnosis_id": str(diagnosis.id),
            "ai_response": ai_message,
            "timestamp": timezone.now().isoformat()
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        logger.error(f"Chat creation error: {str(e)}")
        return Response({"error": "Chat creation failed"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
def add_message(request):
    """
    Add message to chat
    Expected JSON:
    {
        "chat_id": "uuid",
        "sender_id": "uuid",
        "message": "content",
        "message_type": "text/image/voice",
        "media_url": "required for image/voice"
    }
    """
    print(2)
    try:
        data = request.data
        
        # Validate input
        if not (message_type := data.get("message_type")) or message_type not in VALID_MESSAGE_TYPES:
            return Response({"error": f"Invalid type. Valid: {VALID_MESSAGE_TYPES}"}, status=400)

        if message_type in ['image', 'voice'] and not data.get("media_url"):
            return Response({"error": "media_url required for image/voice"}, status=400)

        # Get chat and sender
        try:
            chat = Chats.objects.get(id=uuid.UUID(data["chat_id"]))
            sender = Users.objects.get(id=uuid.UUID(data["sender_id"]))
        except (Chats.DoesNotExist, Users.DoesNotExist, ValueError):
            return Response({"error": "Invalid chat/sender ID"}, status=400)

        # Create symptom
        #print(sender.id)
        #print(sender)
        symptom = Symptoms.objects.create(
            id=uuid.uuid4(),
            patient=chat.patient,
            description=data["message"],
            symptom_type=message_type,
            media_url=data.get("media_url"),
            submitted_at=timezone.now()
        )

        # Create message
        message = Messages.objects.create(
            id=uuid.uuid4(),
            chat=chat,
            sender=sender,
            message=data["message"],
            message_type=message_type,
            media_url=data.get("media_url"),
            timestamp=timezone.now()
        )

        # Process through AI model
        chat_history = format_chat_history(chat.id)
        ml_response = analyze_medical_text(chat_history)
        print(ml_response)
        # Update AI diagnosis
        diagnosis = AiDiagnoses.objects.create(
            id=uuid.uuid4(),
            symptom=symptom,
            ai_response=ml_response,
            confidence_score=ml_response.get("confidence", 0.75),
            created_at=timezone.now()
        )

        # Add AI response message
        ai_message = f"AI Update: {ml_response.get('summary', 'New analysis available')}"
        Messages.objects.create(
            id=uuid.uuid4(),
            chat=chat,
            sender=system_user,
            message=ai_message,
            message_type="text",
            timestamp=timezone.now()
        )

        return Response({
            "message_id": str(message.id),
            "symptom_id": str(symptom.id),
            "diagnosis_id": str(diagnosis.id),
            "ai_response": ai_message,
            "timestamp": message.timestamp.isoformat()
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        logger.error(f"Message error: {str(e)}")
        return Response({"error": "Message processing failed"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["PUT"])
def update_chat(request, chat_id):
    print('hi')
    """
    Update chat details
    Expected JSON:
    {
        "status": "open/in_review/resolved",
        "clinician_id": "uuid (optional)",
        "category_id": "uuid (optional)"
    }
    """
    try:
        # Validate chat ID
        try:
            chat = Chats.objects.get(id=uuid.UUID(chat_id))
        except (Chats.DoesNotExist, ValueError):
            return Response({"error": "Invalid chat ID"}, status=status.HTTP_400_BAD_REQUEST)

        data = request.data

        # Status update
        if (new_status := data.get("status")):
            if new_status not in VALID_STATUSES:
                return Response({"error": f"Invalid status. Valid: {', '.join(VALID_STATUSES)}"}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            # Special case: Require clinician for in_review status
            if new_status == "in_review" and not chat.clinician:
                return Response({"error": "Clinician required for in_review status"}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            chat.status = new_status

        # Clinician assignment
        if (clinician_id := data.get("clinician_id")):
            try:
                clinician = Clinicians.objects.get(id=uuid.UUID(clinician_id))
                chat.clinician = clinician
            except (Clinicians.DoesNotExist, ValueError):
                return Response({"error": "Invalid clinician ID"}, status=status.HTTP_400_BAD_REQUEST)

        # Category update
        if (category_id := data.get("category_id")):
            try:
                category = QueryCategories.objects.get(id=uuid.UUID(category_id))
                chat.category = category
            except (QueryCategories.DoesNotExist, ValueError):
                return Response({"error": "Invalid category ID"}, status=status.HTTP_400_BAD_REQUEST)

        chat.save()
        return Response({
            "message": "Chat updated successfully",
            "status": chat.status,
            "clinician_id": str(chat.clinician.id) if chat.clinician else None,
            "category_id": str(chat.category.id) if chat.category else None
        }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"Chat update error: {str(e)}")
        return Response({"error": "Chat update failed"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@api_view(["GET"])
def get_chatss(request):
    print("hello")

@api_view(["GET"])
def get_chats(request, user_id):
    print("hhh")
    """
    Get all chats for a given user, including the last symptom (latest message)
    and the last message time, sorted by most recent message.
    
    URL example: GET /api/chats/<user_id>/
    
    Response:
    [
        {
            "chat_id": "uuid",
            "patient_id": "uuid",
            "clinician_id": "uuid or null",
            "last_symptom": {
                "description": "message content",
                "message_type": "text/image/voice",
                "media_url": "url or null",
                "timestamp": "ISO8601 timestamp"
            },
            "last_message_time": "ISO8601 timestamp"
        },
        ...
    ]
    """
    # Validate the user_id as a UUID
    print(1)
    try:

        user_uuid = (user_id)
    except ValueError:
        return Response({"error": "Invalid user ID format."},
                        status=status.HTTP_400_BAD_REQUEST)
    
    # Retrieve the user record
    try:
        user = Users.objects.get(id=user_uuid)
    except Users.DoesNotExist:
        return Response({"error": "User not found."},
                        status=status.HTTP_404_NOT_FOUND)
    
    # Determine if the user is a patient or a clinician
    chats_qs = Chats.objects.none()
    try:
        # Access patient's profile via the one-to-one relation
        patient_profile = user.patients
        chats_qs = Chats.objects.filter(patient=patient_profile)
    except Patients.DoesNotExist:
        pass

    try:
        # Access clinician's profile via the one-to-one relation
        clinician_profile = user.clinicians
        chats_qs = chats_qs | Chats.objects.filter(clinician=clinician_profile)
    except Clinicians.DoesNotExist:
        pass

    if not chats_qs.exists():
        return Response({"message": "No chats found for this user."},
                        status=status.HTTP_200_OK)
    
    # Prefetch the latest message for each chat. 
    # Note: If no custom related_name is set for the ForeignKey in Messages, the default is messages_set.
    messages_prefetch = Prefetch(
        'messages_set',  # Change to 'messages' if you set related_name="messages"
        queryset=Messages.objects.order_by('-timestamp'),
        to_attr='latest_messages'
    )
    chats = chats_qs.prefetch_related(messages_prefetch).distinct()

    # Build the response list
    response_list = []
    for chat in chats:
        # Each chat's prefetch should return a list of messages; we take the first as the latest.
        latest_message = chat.latest_messages[0] if hasattr(chat, 'latest_messages') and chat.latest_messages else None

        last_symptom = None
        if latest_message and latest_message.timestamp:
            last_symptom = {
                "description": latest_message.message,
                "message_type": latest_message.message_type,
                "media_url": latest_message.media_url,
                "timestamp": latest_message.timestamp.isoformat()
            }

        chat_info = {
            "chat_id": str(chat.id),
            "patient_id": str(chat.patient.id) if chat.patient else None,
            "clinician_id": str(chat.clinician.id) if chat.clinician else None,
            "last_symptom": last_symptom,
            "last_message_time": latest_message.timestamp.isoformat() if latest_message and latest_message.timestamp else None
        }
        response_list.append(chat_info)
    
    # Sort the chats by last_message_time in descending order
    response_list.sort(key=lambda x: x['last_message_time'] or "1970-01-01T00:00:00Z", reverse=True)
    
    return Response(response_list, status=status.HTTP_200_OK)
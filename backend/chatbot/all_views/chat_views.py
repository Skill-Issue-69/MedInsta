# chat_views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
import uuid
import logging
from django.core.exceptions import ValidationError
from chatbot.models import Chats, Messages, Users, Patients, Clinicians, QueryCategories

logger = logging.getLogger(__name__)

VALID_STATUSES = ['open', 'in_review', 'resolved']

# Chat Creation Endpoint
@api_view(["POST"])
def create_chat(request):
    """
    Create new chat session
    Expected JSON:
    {
        "patient_id": "uuid",
        "category_id": "uuid (optional)",
        "initial_message": "text (optional)"
    }
    """
    try:
        data = request.data
        
        # Validate required field
        if not (patient_id := data.get("patient_id")):
            return Response({"error": "patient_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        # UUID validation
        try:
            patient_uuid = uuid.UUID(patient_id)
            patient = Patients.objects.get(id=patient_uuid)
        except (ValueError, Patients.DoesNotExist):
            return Response({"error": "Invalid patient ID"}, status=status.HTTP_400_BAD_REQUEST)

        # Category validation
        category = None
        if category_id := data.get("category_id"):
            try:
                category = QueryCategories.objects.get(id=uuid.UUID(category_id))
            except (QueryCategories.DoesNotExist, ValueError):
                return Response({"error": "Invalid category ID"}, status=status.HTTP_400_BAD_REQUEST)

        # Create chat
        chat = Chats.objects.create(
            id=uuid.uuid4(),
            patient=patient,
            category=category,
            status="open",
            created_at=timezone.now()
        )

        # Create initial message if provided
        if initial_message := data.get("initial_message"):
            Messages.objects.create(
                id=uuid.uuid4(),
                chat=chat,
                sender=patient.id,
                message=initial_message,
                message_type="text",
                timestamp=timezone.now()
            )

        return Response({
            "chat_id": str(chat.id),
            "status": chat.status,
            "created_at": chat.created_at
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        logger.error(f"Chat creation error: {str(e)}")
        return Response({"error": "Chat creation failed"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@api_view(["GET"])
def get_chats(request,user_id):
    pass
# Chat Update Endpoint
@api_view(["PUT"])
def update_chat(request, chat_id):
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
            chat = Chats.objects.get(id=(chat_id))
        except (Chats.DoesNotExist, ValueError):
            return Response({"error": "Invalid chat ID"}, status=status.HTTP_400_BAD_REQUEST)

        data = request.data

        # Status update
        if (new_status := data.get("status")):
            if new_status not in VALID_STATUSES:
                return Response({"error": f"Invalid status. Valid values: {', '.join(VALID_STATUSES)}"}, 
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

# Message Creation Endpoint
@api_view(["POST"])
def add_message(request):
    """
    Add message to chat
    Expected JSON:
    {
        "chat_id": "uuid",
        "sender_id": "uuid",
        "message": "text",
        "message_type": "text/media",
        "media_url": "url (optional)"
    }
    """
    try:
        data = request.data
        required_fields = ["chat_id", "sender_id", "message"]
        
        # Validate required fields
        if missing := [f for f in required_fields if not data.get(f)]:
            return Response({"error": f"Missing fields: {', '.join(missing)}"}, 
                          status=status.HTTP_400_BAD_REQUEST)

        # Validate UUIDs
        try:
            chat = Chats.objects.get(id=uuid.UUID(data["chat_id"]))
            sender = Users.objects.get(id=uuid.UUID(data["sender_id"]))
        except (Chats.DoesNotExist, Users.DoesNotExist, ValueError):
            return Response({"error": "Invalid chat or sender ID"}, status=status.HTTP_400_BAD_REQUEST)

        # Validate sender permissions
        valid_senders = [str(chat.patient.id.id)]
        if chat.clinician:
            valid_senders.append(str(chat.clinician.id.id))
            
        if str(sender.id) not in valid_senders:
            return Response({"error": "Unauthorized sender"}, status=status.HTTP_403_FORBIDDEN)

        # Validate message type
        message_type = data.get("message_type", "text")
        if message_type == "media" and not data.get("media_url"):
            return Response({"error": "media_url required for media messages"}, 
                          status=status.HTTP_400_BAD_REQUEST)

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

        # Reopen resolved chats on new messages
        if chat.status == "resolved":
            chat.status = "open"
            chat.save()

        return Response({
            "message_id": str(message.id),
            "chat_status": chat.status,
            "timestamp": message.timestamp.isoformat()
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        logger.error(f"Message creation error: {str(e)}")
        return Response({"error": "Message creation failed"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
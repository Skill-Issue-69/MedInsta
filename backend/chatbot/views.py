from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Chat
from .serializers import ChatSerializer
from .ml.predict import chatbot_response  # ML integration

@api_view(["GET"])
def test_view(request):
    return Response({"message": "Chatbot backend is running!"})

@api_view(["POST"])
def chat(request):
    user_input = request.data.get("message", "")
    bot_reply = chatbot_response(user_input)  # ML model response

    chat = Chat.objects.create(user_input=user_input, bot_response=bot_reply)
    serializer = ChatSerializer(chat)

    return Response(serializer.data)


@api_view(["GET"])
def chat_history(request):
    chats = Chat.objects.all()
    serializer = ChatSerializer(chats, many=True)
    return Response(serializer.data)

from rest_framework import serializers
from .models import Book, ChatMessage

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'

class BookListSerializer(serializers.ModelSerializer):
    """
    Serializer optimized for list views.
    Includes image_url to support book cover display.
    """
    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'rating', 'reviews_count', 'book_url', 'genre', 'image_url']

class RAGQuerySerializer(serializers.Serializer):
    query = serializers.CharField(required=True)
    book_id = serializers.IntegerField(required=False)

class ChatMessageSerializer(serializers.ModelSerializer):
    """
    Serializer to fulfill the 'Saving chat history' bonus.
    """
    class Meta:
        model = ChatMessage
        fields = ['id', 'role', 'content', 'timestamp']

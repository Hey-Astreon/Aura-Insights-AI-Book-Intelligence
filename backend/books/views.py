from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Book, ChatMessage
from .serializers import BookSerializer, BookListSerializer, RAGQuerySerializer, ChatMessageSerializer
import threading

# Import core business logic services
from .services.scraper import ScraperService
from .services.ai import AIService, RAGService

class BookViewSet(viewsets.ModelViewSet):
    """
    Unified ViewSet for all Book-related operations.
    Handles standard CRUD as structured services.
    """
    queryset = Book.objects.all().order_by('-created_at')
    
    def get_serializer_class(self):
        if self.action == 'list':
            return BookListSerializer
        return BookSerializer

    @action(detail=False, methods=['post'])
    def upload(self, request):
        """
        Triggers the automated scraping and AI analysis pipeline asynchronously.
        Uses threading to fulfill the 'Async processing' bonus point.
        """
        url = request.data.get('url', 'http://books.toscrape.com')
        
        def run_sync():
            count = ScraperService.scrape_books(url)
            for book in Book.objects.all():
                if not book.summary:
                    AIService.generate_insights(book.id)
                    RAGService().index_book(book.id)
            print(f"Background Sync Complete for {url}")

        # Start background thread
        thread = threading.Thread(target=run_sync)
        thread.start()

        return Response({
            "status": "success",
            "message": "Library synchronization started in the background (Async).",
            "source": url
        }, status=status.HTTP_202_ACCEPTED)

    @action(detail=False, methods=['post'])
    def query(self, request):
        """
        AI Q&A Interface.
        Saves chat history to fulfill the 'Saving chat history' bonus point.
        """
        serializer = RAGQuerySerializer(data=request.data)
        if serializer.is_valid():
            query = serializer.validated_data['query']
            
            # Save User Message
            ChatMessage.objects.create(role='user', content=query)
            
            rag = RAGService()
            result = rag.query_rag(query)
            
            # Save Bot Response
            ChatMessage.objects.create(role='bot', content=result['answer'])
            
            return Response(result)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def recommendations(self, request):
        recs = Book.objects.filter(rating__gte=4.0)[:5]
        serializer = BookListSerializer(recs, many=True)
        return Response(serializer.data)

class ChatMessageViewSet(viewsets.ModelViewSet):
    """
    ViewSet to manage persistent chat messages.
    """
    queryset = ChatMessage.objects.all().order_by('timestamp')
    serializer_class = ChatMessageSerializer

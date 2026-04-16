from django.db import models

class Book(models.Model):
    """
    Main model representing a book and its associated metadata.
    Includes both scraped data and AI-generated insights.
    """
    title = models.CharField(max_length=255, help_text="The title of the book")
    author = models.CharField(max_length=255, blank=True, null=True)
    rating = models.FloatField(default=0.0)
    reviews_count = models.IntegerField(default=0)
    description = models.TextField(blank=True, null=True)
    book_url = models.URLField(unique=True)
    image_url = models.URLField(blank=True, null=True, help_text="URL to the book cover image")
    
    # AI-Generated Insights
    summary = models.TextField(blank=True, null=True, help_text="AI-generated summary")
    genre = models.CharField(max_length=100, blank=True, null=True)
    sentiment = models.CharField(max_length=50, blank=True, null=True)
    recommendation_logic = models.TextField(blank=True, null=True)
    
    # Metadata for tracking
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class BookChunk(models.Model):
    """
    Represents a specific segment of a book's description.
    Used for the RAG pipeline to ensure granular and relevant context retrieval.
    """
    book = models.ForeignKey(Book, related_name='chunks', on_delete=models.CASCADE)
    content = models.TextField()
    chunk_index = models.IntegerField()
    embedding_id = models.CharField(max_length=255, blank=True, null=True) # ID reference in Vector DB

    def __str__(self):
        return f"{self.book.title} - Chunk {self.chunk_index}"

class ChatMessage(models.Model):
    """
    Persists chat history between the user and AI.
    Fulfills the 'Saving chat history' bonus requirement.
    """
    role = models.CharField(max_length=10, choices=[('user', 'user'), ('bot', 'bot')])
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.role}: {self.content[:20]}..."

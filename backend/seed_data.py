import json
import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from books.models import Book
from books.services.ai import AIService, RAGService

def run():
    print("--- AuraInsights FINAL GOLD STATUS SEEDER ---")
    
    # Using internal Aura URLs to isolate these premium samples from scraper updates
    # Using verified high-quality literary IDs for visual perfection
    sample_books = [
        {
            "title": "Atomic Habits",
            "author": "James Clear",
            "rating": 4.9,
            "reviews_count": 1200,
            "description": "A transformative guide to building good habits and breaking bad ones. Focusing on tiny changes that lead to remarkable results.",
            "book_url": "https://aura.internal/atomic-habits",
            "image_url": "https://images.unsplash.com/photo-1614849963640-9cc74b2a826f?auto=format&fit=crop&q=80&w=600",
            "genre": "Self-Help / Psychology",
            "summary": "This book provides a proven framework for improving every day. James Clear reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.",
            "sentiment": "Empowering & Action-Oriented",
            "recommendation_logic": "Essential for anyone looking to optimize their daily routines and achieve long-term goals through compounded small wins."
        },
        {
            "title": "The Great Gatsby",
            "author": "F. Scott Fitzgerald",
            "rating": 4.8,
            "reviews_count": 500,
            "description": "A masterwork of 20th-century literature, exploring the American Dream through the lens of decadence and obsession.",
            "book_url": "https://aura.internal/gatsby",
            "image_url": "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600",
            "genre": "Classic Literature / Modernism",
            "summary": "Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan.",
            "sentiment": "Melancholic & Lyrical",
            "recommendation_logic": "A must-read for fans of literary prose and tragic narratives exploring social class and identity."
        }
    ]

    for data in sample_books:
        # Use update_or_create with the UNIQUE internal URL
        book, created = Book.objects.update_or_create(
            book_url=data['book_url'],
            defaults=data
        )
        print(f"Gold Status Secured: {book.title}")
        
        # Always re-index for the RAG pipeline
        rag = RAGService()
        rag.index_book(book.id)
            
    print("--- Gold Seeding Phase Complete ---")

if __name__ == "__main__":
    run()

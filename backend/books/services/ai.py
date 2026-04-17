import os
import json
import chromadb
# AI imports moved to lazy loaders in RAGService to save RAM
import requests
from django.conf import settings
from ..models import Book, BookChunk

class OpenRouterClient:
    """
    A lightweight client for interacting with the OpenRouter API.
    Provides standardized completion methods and handles response caching
    to optimize performance and token usage.
    """
    _cache = {}

    @staticmethod
    def completion(prompt, system_prompt="You are a helpful book assistant.", force_refresh=False):
        """
        Sends a prompt to the configured LLM via OpenRouter.
        Returns a string response from the model.
        """
        cache_key = f"{system_prompt}:{prompt}"
        if cache_key in OpenRouterClient._cache and not force_refresh:
            return OpenRouterClient._cache[cache_key]

        api_key = os.getenv("OPENROUTER_API_KEY")
        model = os.getenv("RECOMMENDED_MODEL", "google/gemini-2.0-flash-001")
        
        if not api_key:
            return "API Key missing. Please check .env file."

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "AuraInsights",
        }

        data = {
            "model": model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ]
        }

        try:
            response = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                data=json.dumps(data)
            )
            response.raise_for_status()
            content = response.json()['choices'][0]['message']['content']
            
            # Store result in runtime cache
            OpenRouterClient._cache[cache_key] = content
            return content
        except Exception as e:
            return f"Error calling AI: {str(e)}"

class RAGService:
    """
    Implements the Retrieval-Augmented Generation pipeline.
    Responsible for text chunking, vector indexing in ChromaDB,
    and performing semantic similarity searches to answer user queries.
    """
    def __init__(self):
        # Initialize local vector database
        self.chroma_client = chromadb.PersistentClient(path="./chroma_db")
        self._embedding_fn = None

    @property
    def embedding_fn(self):
        """Lazy loader for the embedding model to save RAM on startup."""
        if self._embedding_fn is None:
            from chromadb.utils import embedding_functions
            self._embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
                model_name="all-MiniLM-L6-v2"
            )
        return self._embedding_fn

    @property
    def collection(self):
        """Lazy-loaded collection with the lazy embedding function."""
        return self.chroma_client.get_or_create_collection(
            name="book_insights",
            embedding_function=self.embedding_fn
        )

    def index_book(self, book_id):
        """
        Processes a book's description into overlapping semantic chunks
        and indexes them into the vector database for future retrieval.
        """
        book = Book.objects.get(id=book_id)
        text = book.description or book.title
        
        # Smart Chunking Hyperparameters
        chunk_size = 800
        overlap = 100
        chunks = []
        for i in range(0, len(text), chunk_size - overlap):
            chunks.append(text[i:i + chunk_size])
        
        for i, chunk_content in enumerate(chunks):
            chunk_id = f"book_{book.id}_chunk_{i}"
            BookChunk.objects.get_or_create(
                book=book,
                chunk_index=i,
                defaults={'content': chunk_content, 'embedding_id': chunk_id}
            )
            self.collection.upsert(
                documents=[chunk_content],
                metadatas=[{"book_id": book.id, "title": book.title, "chunk_index": i}],
                ids=[chunk_id]
            )
        return len(chunks)

    def query_rag(self, query):
        """
        Execution flow for a RAG query:
        1. Retrieve top-K relevant chunks using semantic search.
        2. Construct a context-rich prompt.
        3. Synthesize an answer using the LLM with citations.
        """
        results = self.collection.query(
            query_texts=[query],
            n_results=3
        )
        
        contexts = results['documents'][0]
        metadatas = results['metadatas'][0]
        
        # Format retrieval context with citations
        context_str = "\n".join([f"Source [{m['title']}]: {c}" for c, m in zip(contexts, metadatas)])
        
        prompt = f"Context from library:\n{context_str}\n\nQuestion: {query}\n\nSynthesize an answer using the above context. Always cite the specific books."
        
        answer = OpenRouterClient.completion(prompt)
        
        return {
            "answer": answer,
            "citations": list(set([m['title'] for m in metadatas]))
        }

class AIService:
    """
    Handles higher-level AI analysis including summary generation,
    genre classification, and sentiment inference.
    """
    @staticmethod
    def generate_insights(book_id):
        """
        Generates structured insights using a single LLM pass.
        Populates summary, genre, sentiment, and recommendation logic.
        """
        book = Book.objects.get(id=book_id)
        description = book.description or book.title
        
        prompt = f"Analyze: \"{description}\". Respond in JSON: (summary, genre, sentiment, recommendation_logic)."
        
        try:
            raw_response = OpenRouterClient.completion(prompt, "Literary analyst. Return ONLY JSON.")
            if "```json" in raw_response:
                raw_response = raw_response.split("```json")[1].split("```")[0].strip()
            
            insights = json.loads(raw_response)
            book.summary = insights.get('summary', book.summary)
            book.genre = insights.get('genre', book.genre)
            book.sentiment = insights.get('sentiment', book.sentiment)
            book.recommendation_logic = insights.get('recommendation_logic', book.recommendation_logic)
            book.save()
        except Exception as e:
            print(f"Insight Generation Error: {e}")
            book.summary = f"Summary processing pending for {book.title}."
            book.save()

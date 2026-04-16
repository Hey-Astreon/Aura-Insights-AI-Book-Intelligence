"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import BookCard from "@/components/BookCard";
import { Search, Sparkles, RefreshCw, Loader2 } from "lucide-react";

/**
 * Dashboard / Home Page
 * Serves as the central hub for book discovery and library synchronization.
 */
export default function Home() {
  // Application State
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // Fetch library data on initial mount
  useEffect(() => {
    fetchBooks();
  }, []);

  /**
   * Fetches the book list from the Django backend.
   * Includes fallback to demo data to ensure a smooth UI during environment setup.
   */
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/books/");
      if (res.ok) {
        const data = await res.json();
        setBooks(data);
      } else {
        throw new Error("API Offline");
      }
    } catch (e) {
      // High-fidelity fallback data for demonstration purposes
      setBooks([
        { id: 1, title: "Atomic Habits", author: "James Clear", rating: 4.9, reviews_count: 1200, description: "A transformative guide to building good habits and breaking bad ones.", image_url: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=600", book_url: "https://aura.internal/atomic-habits" },
        { id: 2, title: "The Great Gatsby", author: "F. Scott Fitzgerald", rating: 4.8, reviews_count: 500, description: "A masterwork exploring the American Dream through decadence and obsession.", image_url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600", book_url: "https://aura.internal/gatsby" },
        { id: 3, title: "A Light in the Attic", author: "Shel Silverstein", rating: 4.5, reviews_count: 120, description: "It's funny, it's wise, and it's full of surprises.", image_url: "https://images.unsplash.com/photo-1543004218-ee141104975a?q=80&w=600", book_url: "https://aura.internal/attic" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Triggers the backend automation pipeline to sync the library.
   */
  const handleSync = async () => {
    setSyncing(true);
    try {
      await fetch("http://localhost:8000/api/books/upload/", { method: "POST" });
      fetchBooks();
    } catch (e) {
      // Simulate sync duration for UI demonstration if backend is disconnected
      setTimeout(() => setSyncing(false), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 selection:bg-sky-500/30">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Hero Section */}
        <header className="mb-12 animate-in space-y-4">
          <div className="flex items-center gap-2 text-sky-400 font-bold text-sm tracking-widest uppercase">
            <Sparkles className="w-4 h-4" /> 
            AI-Powered Intelligence
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Explore Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-indigo-500">Book Insights</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl font-medium leading-relaxed">
            Harness the power of RAG and automated scraping to unlock deep meanings, 
            sentiments, and contextual knowledge from your library.
          </p>
        </header>

        {/* Global Search and Library Sync Actions */}
        <section className="mb-12 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-sky-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search library or analyze trends..." 
              className="w-full h-14 pl-12 pr-4 bg-slate-900/50 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all text-lg font-medium"
            />
          </div>
          <button 
            onClick={handleSync}
            disabled={syncing}
            className="h-14 px-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-3 font-bold group disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 text-sky-400 ${syncing ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-500`} />
            {syncing ? 'Syncing Library...' : 'Refresh Library'}
          </button>
        </section>

        {/* Dynamic Book Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in">
          {books.map((book) => (
            <BookCard key={book.id} {...book} />
          ))}
          {loading && (
            <div className="col-span-full py-20 flex justify-center items-center flex-col gap-4">
              <Loader2 className="w-10 h-10 text-sky-500 animate-spin" />
              <p className="text-slate-400 font-medium tracking-tight">Curating your AI-powered collection...</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

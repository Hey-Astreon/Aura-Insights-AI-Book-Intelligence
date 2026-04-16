"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Star, ArrowLeft, BookOpen, Quote, Sparkles, TrendingUp, Smile, Compass, Loader2 } from "lucide-react";
import Link from "next/link";

/**
 * BookDetailPage Component
 * Renders the full suite of AI insights for a single book.
 */
export default function BookDetailPage() {
  const params = useParams();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch individual book details from the API
    const fetchDetail = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/books/${params.id}/`);
        if (res.ok) {
          const data = await res.json();
          setBook(data);
        } else {
          throw new Error("Detail fetch failed");
        }
      } catch (e) {
        // Fallback for demo mode
        setBook({
          id: params.id,
          title: "Book Analysis Pending",
          author: "Aura Intelligence",
          rating: 4.0,
          reviews_count: 0,
          description: "This book's full context is currently being indexed by our RAG engine. Please check back shortly for deep insights.",
          image_url: "https://images.unsplash.com/photo-1543004218-ee141104975a?q=80&w=600",
          summary: "Summary will appear here after AI processing is complete.",
          genre: "Under Analysis",
          sentiment: "Analyzing Tone...",
          recommendation_logic: "Analysis in progress."
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [params.id]);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-sky-500 gap-4">
      <Loader2 className="w-10 h-10 animate-spin" />
      <span className="font-bold tracking-widest text-xs uppercase">Deciphering Book Context...</span>
    </div>
  );

  // Use the new image_url field with a high-quality fallback
  const displayImage = book.image_url || "https://images.unsplash.com/photo-1543004218-ee141104975a?q=80&w=600";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 selection:bg-sky-500/20">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Navigation Layer */}
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-sky-400 transition-all mb-10 font-bold text-sm group">
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-sky-500 group-hover:text-slate-950 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Back to Library
        </Link>

        {/* Hero Section: Responsive Grid Layer */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 lg:gap-16 animate-in">
          
          {/* Left Column: Visual Identity */}
          <div className="lg:col-span-4 space-y-8">
            <div className="relative group rounded-[2rem] overflow-hidden border border-white/10 shadow-3xl shadow-sky-500/10 transition-transform duration-500 hover:scale-[1.02]">
              <img 
                src={displayImage} 
                alt={book.title} 
                className="w-full h-auto object-cover min-h-[400px]" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
            </div>
            
            <div className="p-8 glass rounded-[2rem] space-y-5 border border-white/10">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">{book.title}</h1>
                <p className="text-xl text-sky-400 font-bold tracking-tight">{book.author || "Aura Insight Library"}</p>
              </div>
              
              <div className="flex items-center gap-8 pt-2">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="font-black text-2xl">{book.rating}</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Rating</span>
                </div>
                <div className="h-10 w-px bg-white/10" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-black text-2xl">{book.reviews_count}</span>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sync Analyses</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: AI Knowledge Graph */}
          <div className="lg:col-span-8 space-y-10">
            <section className="space-y-6">
              <div className="flex items-center gap-3 text-sky-400 font-black text-xs tracking-[0.2em] uppercase">
                <Compass className="w-5 h-5" /> Semantic Description
              </div>
              <div className="p-1 rounded-2xl bg-white/5 backdrop-blur-sm">
                <p className="text-xl text-slate-300 leading-relaxed font-medium p-6">
                  {book.description}
                </p>
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InsightCard 
                icon={<BookOpen className="w-6 h-6 text-sky-400" />}
                title="AI Context Summary"
                content={book.summary}
                delay="0s"
              />
              <InsightCard 
                icon={<Sparkles className="w-6 h-6 text-indigo-400" />}
                title="Genre Classification"
                content={book.genre}
                delay="0.1s"
              />
              <InsightCard 
                icon={<Smile className="w-6 h-6 text-emerald-400" />}
                title="Sentiment Map"
                content={book.sentiment}
                delay="0.2s"
              />
              <InsightCard 
                icon={<TrendingUp className="w-6 h-6 text-amber-400" />}
                title="AI Recommendation Logic"
                content={book.recommendation_logic}
                delay="0.3s"
              />
            </div>

            {/* Smart Interaction CTA */}
            <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-sky-500/20 to-indigo-600/20 border border-sky-500/30 flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-sky-400/50 transition-all duration-500">
              <div className="space-y-3 text-center md:text-left">
                <h3 className="text-2xl font-black flex items-center justify-center md:justify-start gap-3">
                  <Quote className="w-6 h-6 text-sky-400" /> Curious about the plot?
                </h3>
                <p className="text-slate-400 font-bold text-lg">Initiate a RAG-powered conversation about this book.</p>
              </div>
              <Link href="/chat" className="whitespace-nowrap px-8 py-4 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black rounded-2xl shadow-[0_10px_30px_rgba(14,165,233,0.3)] transition-all hover:-translate-y-1">
                Start Discussing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/**
 * InsightCard Component
 * Local helper for rendering modular AI insights.
 */
function InsightCard({ icon, title, content, delay }: { icon: React.ReactNode, title: string, content: string, delay: string }) {
  return (
    <div 
      className="p-8 glass rounded-[2rem] border border-white/5 space-y-4 hover:border-sky-500/30 transition-all group/card shadow-xl"
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover/card:bg-sky-500/10 transition-colors">
          {icon}
        </div>
        <h4 className="font-black text-slate-100 uppercase tracking-widest text-[11px]">{title}</h4>
      </div>
      <p className="text-[15px] text-slate-400 leading-relaxed font-semibold">
        {content || "Aura is currently analyzing this segment..."}
      </p>
    </div>
  );
}

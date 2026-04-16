"use client";

import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";

/**
 * Interface for book metadata properties.
 */
interface BookCardProps {
  id: number;
  title: string;
  author?: string;
  rating: number;
  reviews_count: number;
  description?: string;
  genre?: string;
  image_url?: string;
}

/**
 * BookCard Component
 * Displays a premium preview of a book with glassmorphic effects and hover animations.
 */
export default function BookCard({ id, title, author, rating, reviews_count, description, genre, image_url }: BookCardProps) {
  // Fallback image if cover is missing
  const coverImage = image_url || `https://images.unsplash.com/photo-1543004218-ee141104975a?q=80&w=400&auto=format&fit=crop`;

  return (
    <Link 
      href={`/books/${id}`}
      className="group block relative rounded-3xl overflow-hidden glass transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.15)] border border-white/10"
    >
      {/* Visual Cover Layer */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={coverImage} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
        
        {/* Genre/Category Tag */}
        {genre && (
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-sky-500/20 backdrop-blur-md border border-sky-400/30 text-[10px] uppercase tracking-widest font-bold text-sky-300">
            {genre}
          </div>
        )}
      </div>

      {/* metadata Contents */}
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-bold text-slate-200">{rating}</span>
          </div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
            {reviews_count} Analysis
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-sky-400 transition-colors">
            {title}
          </h3>
          <p className="text-xs font-semibold text-slate-400">
            {author || "Aura Insight Library"}
          </p>
        </div>

        <div className="pt-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-[10px] font-bold text-sky-500 uppercase flex items-center gap-1">
            View Analysis <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

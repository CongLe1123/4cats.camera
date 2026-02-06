"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export function HomeSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/shop?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push('/shop');
    }
  };

  return (
      <div className="w-full max-w-3xl mx-auto px-1 sticky top-24 z-50">
      <form onSubmit={handleSearch} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 md:pl-6 flex items-center pointer-events-none">
          <Search className="h-5 w-5 md:h-6 md:w-6 text-primary group-focus-within:scale-110 transition-transform" />
        </div>
          <input
            type="text"
            className="block w-full pl-12 md:pl-16 pr-28 md:pr-36 py-4 md:py-5 bg-white backdrop-blur-xl border-2 border-primary/20 rounded-full text-sm md:text-lg font-medium focus:ring-4 md:focus:ring-8 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-xl md:shadow-2xl placeholder:text-muted-foreground/50 text-foreground"
          placeholder="Bạn đang tìm máy ảnh gì?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="absolute right-2 top-2 bottom-2 bg-primary text-white px-5 md:px-8 rounded-full font-bold text-xs md:text-base hover:brightness-110 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/25"
        >
          Tìm Kiếm
        </button>
      </form>
    </div>
  );
}

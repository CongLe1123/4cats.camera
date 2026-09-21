"use client";

import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function HomeSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/shop?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/shop");
    }
  };

  const popularChips = [
    { label: "Canon R50", q: "Canon R50" },
    { label: "Sony ZV-E10 II", q: "Sony ZV-E10 II" },
    { label: "Fujifilm X-T30 II", q: "Fujifilm X-T30 II" },
    { label: "Sony ZV-1 II", q: "Sony ZV-1 II" },
    { label: "Máy selfie", q: "selfie" },
    { label: "Màu film", q: "film" },
    { label: "Dưới 15 triệu", q: "dưới 15 triệu" }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3">
      {/* Search Input */}
      <form onSubmit={handleSearch} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 md:pl-5 flex items-center pointer-events-none">
          <Search className="h-4 w-4 md:h-5 md:w-5 text-primary group-focus-within:scale-110 transition-transform" />
        </div>
        <input
          type="text"
          className="block w-full pl-11 md:pl-13 pr-24 md:pr-32 py-3.5 md:py-4 bg-white border border-primary/20 rounded-full text-xs md:text-sm font-medium focus:ring-3 focus:ring-primary/15 focus:border-primary outline-hidden transition-all shadow-xs placeholder:text-muted-foreground/70 text-foreground"
          placeholder="Tìm máy ảnh, thương hiệu hoặc nhu cầu (VD: Canon R50, máy selfie, vlog)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1.5 bottom-1.5 bg-primary text-white px-4 md:px-6 rounded-full font-bold text-xs md:text-sm hover:brightness-110 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xs cursor-pointer"
        >
          Tìm kiếm
        </button>
      </form>

      {/* Quick Search Chips */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs">
        <span className="text-muted-foreground font-semibold hidden sm:inline">Tìm nhanh:</span>
        {popularChips.map((chip, idx) => (
          <Link
            key={idx}
            href={`/shop?q=${encodeURIComponent(chip.q)}`}
            className="px-2.5 py-0.5 rounded-full bg-white hover:bg-primary/10 border border-primary/15 text-muted-foreground hover:text-primary text-[11px] font-medium transition-colors shadow-2xs"
          >
            {chip.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

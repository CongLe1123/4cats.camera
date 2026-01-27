"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getBrands } from "../lib/fetchCameras";

const BRAND_STYLES = {
  canon: {
    gradient: "from-pink-200 to-rose-300",
    text: "text-rose-600",
  },
  sony: {
    gradient: "from-pink-100 to-purple-200",
    text: "text-purple-600",
  },
  fujifilm: {
    gradient: "from-red-100 to-orange-200",
    text: "text-orange-600",
  },
  casio: {
    gradient: "from-blue-100 to-indigo-200",
    text: "text-indigo-600",
  },
  nikon: {
    gradient: "from-rose-100 to-red-200",
    text: "text-red-600",
  },
  lumix: {
    gradient: "from-sky-100 to-blue-200",
    text: "text-blue-600",
  },
};

const FALLBACK_STYLES = [
  { gradient: "from-teal-100 to-emerald-200", text: "text-teal-600" },
  { gradient: "from-amber-100 to-yellow-200", text: "text-amber-600" },
  { gradient: "from-lime-100 to-green-200", text: "text-lime-600" },
  { gradient: "from-cyan-100 to-blue-200", text: "text-cyan-600" },
];

export function BrandList() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBrands() {
      try {
        const data = await getBrands();
        setBrands(data || []);
      } catch (error) {
        console.error("Failed to load brands", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBrands();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 bg-secondary/50 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
      {brands.map((brand, i) => {
        const normalizeName = brand.name.toLowerCase();
        const style =
          BRAND_STYLES[normalizeName] ||
          FALLBACK_STYLES[i % FALLBACK_STYLES.length];

        // If brand has an image, we use the "featured" card style from the reference
        if (brand.image) {
          return (
            <Link
              key={brand.id || i}
              href={`/shop?brand=${brand.name}`}
              className="group relative h-48 rounded-3xl overflow-hidden border border-white/40 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={brand.image} 
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Subtle overlay for contrast */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 p-6 flex flex-col justify-center z-10 bg-linear-to-r from-black/30 via-black/10 to-transparent">
                <h3 
                  className="text-4xl font-black italic uppercase tracking-tighter text-white font-genty"
                  style={{ 
                    WebkitTextStroke: "1.5px #ffb6c1",
                    paintOrder: "stroke fill"
                  }}
                >
                  {brand.name}
                </h3>
                <p className="text-white font-black tracking-[0.2em] text-sm mt-1 drop-shadow-md">
                  DIGITAL
                </p>
              </div>
            </Link>
          );
        }

        // Standard card style for brands without images
        return (
            <Link
            key={brand.id || i}
            href={`/shop?brand=${brand.name}`}
            className={`relative overflow-hidden rounded-2xl h-32 bg-linear-to-br ${style.gradient} group transition-all duration-300 hover:shadow-lg hover:scale-[1.05] flex items-center justify-center p-4 border border-white/50 text-center`}
            >
            {/* Text Content */}
            <div className="z-10 flex flex-col items-center gap-1">
                <h3
                className={`text-2xl font-black uppercase tracking-tighter drop-shadow-sm ${style.text}`}
                style={{ fontFamily: "var(--font-heading)" }}
                >
                {brand.name}
                </h3>
            </div>

            {/* Decorative shine */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 blur-2xl rounded-full -mr-10 -mt-10" />
            </Link>
        );
      })}
    </div>
  );
}

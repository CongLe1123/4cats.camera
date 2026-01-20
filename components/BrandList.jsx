"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const brands = [
  {
    name: "CANON",
    subtitle: "DIGITAL",
    gradient: "from-pink-200 to-rose-300",
    text: "text-rose-600",
    image: "https://images.unsplash.com/photo-1616423664033-2a6234cc99b9?q=80&w=400&auto=format&fit=crop", // Canon-ish
    href: "/shop?brand=Canon",
    rotate: "-rotate-6",
  },
  {
    name: "SONY",
    subtitle: "DIGITAL",
    gradient: "from-pink-100 to-purple-200",
    text: "text-purple-600",
    image: "https://images.unsplash.com/photo-1516724562728-afc824a36e84?q=80&w=400&auto=format&fit=crop", // Sony-ish
    href: "/shop?brand=Sony",
    rotate: "rotate-6",
  },
  {
    name: "FUJIFILM",
    subtitle: "DIGITAL",
    gradient: "from-red-100 to-orange-200",
    text: "text-orange-600",
    image: "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?q=80&w=400&auto=format&fit=crop", // Fuji-ish
    href: "/shop?brand=Fujifilm",
    rotate: "-rotate-3",
  },
  {
    name: "CASIO",
    subtitle: "DIGITAL",
    gradient: "from-blue-100 to-indigo-200",
    text: "text-indigo-600",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=400&auto=format&fit=crop", // Generic/Casio-ish
    href: "/shop?brand=Casio",
    rotate: "rotate-3",
  },
  {
    name: "NIKON",
    subtitle: "DIGITAL",
    gradient: "from-rose-100 to-red-200",
    text: "text-red-600",
    image: "https://images.unsplash.com/photo-1564466021184-463ac358547b?q=80&w=400&auto=format&fit=crop", // Nikon-ish
    href: "/shop?brand=Nikon",
    rotate: "-rotate-6",
  },
  {
    name: "LUMIX",
    subtitle: "DIGITAL",
    gradient: "from-sky-100 to-blue-200",
    text: "text-blue-600",
    image: "https://images.unsplash.com/photo-1624823180295-c155d288d227?q=80&w=400&auto=format&fit=crop", // Lumix-ish
    href: "/shop?brand=Lumix",
    rotate: "rotate-6",
  },
];

export function BrandList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {brands.map((brand, i) => (
        <Link
          key={i}
          href={brand.href}
          className={`relative overflow-hidden rounded-[2rem] h-48 bg-gradient-to-br ${brand.gradient} group transition-all duration-300 hover:shadow-lg hover:scale-[1.02] flex items-center p-6 border border-white/50`}
        >
          {/* Text Content */}
          <div className="z-10 flex flex-col items-start gap-1">
            <h3 className={`text-4xl font-black uppercase tracking-tighter drop-shadow-sm ${brand.text} style={{ fontFamily: 'var(--font-heading)' }}`}>
              {brand.name}
            </h3>
            <p className={`text-sm font-bold tracking-[0.2em] uppercase opacity-60 ${brand.text}`}>
              {brand.subtitle}
            </p>
            <div className={`mt-4 w-10 h-10 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center ${brand.text} opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0`}>
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>

          {/* Image */}
          <div className={`absolute right-[-20px] top-1/2 -translate-y-1/2 w-48 h-48 transition-transform duration-500 ease-out group-hover:scale-110 ${brand.rotate}`}>
             <img 
               src={brand.image} 
               alt={brand.name}
               className="w-full h-full object-contain drop-shadow-2xl mix-blend-multiply opacity-90 group-hover:opacity-100" 
             />
          </div>
          
          {/* Decorative shine */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full -mr-10 -mt-10" />
        </Link>
      ))}
    </div>
  );
}

"use client";

import { useState } from "react";
import { MessageCircle, Instagram, X, MessageSquareText, Facebook, Phone } from "lucide-react";

export function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);

  const contactOptions = [
    {
      name: "Gọi Hotline",
      icon: <Phone className="w-5 h-5" />,
      color: "bg-secondary-foreground",
      href: "tel:0398249856",
    },
    {
      name: "Instagram",
      icon: <Instagram className="w-6 h-6" />,
      color: "bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500",
      href: "https://www.instagram.com/4cats.camera/",
    },
    {
      name: "Facebook",
      icon: <Facebook className="w-6 h-6" />,
      color: "bg-gradient-to-tr from-blue-600 to-blue-700",
      href: "https://www.facebook.com/profile.php?id=100093056073018",
    },
    {
      name: "Zalo Chat",
      icon: <span className="font-bold text-xs">Zalo</span>,
      color: "bg-blue-600",
      href: "https://zalo.me/0398249856",
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-3">
      {/* Combined Hotline & Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 rounded-full flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 active:scale-95 group focus:outline-none"
      >
         {/* Sound waves (Ping animation) */}
        {!isOpen && <span className="absolute inline-flex h-full w-full rounded-full bg-secondary-foreground opacity-30 animate-ping"></span>}
        
        {/* Main Icon Button */}
        <span className={`relative inline-flex rounded-full h-14 w-14 items-center justify-center shadow-xl transition-all duration-300 ${isOpen ? "bg-slate-800 rotate-90" : "bg-secondary-foreground text-white animate-phone-ring"}`}>
            {isOpen ? <X className="w-6 h-6" /> : <Phone className="w-7 h-7" />}
        </span>

        {/* Label (Visible only when closed)
        {!isOpen && (
          <span className="absolute right-16 py-2 px-4 bg-white text-secondary-foreground text-sm font-bold rounded-full shadow-lg whitespace-nowrap border border-secondary-foreground/20 pointer-events-none">
            Hotline: 039 824 9856
          </span>
        )} */}
      </button>

      {/* Menu Items */}
      <div
        className={`flex flex-col items-end gap-3 transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 translate-y-10 invisible h-0"
        }`}
      >
        {contactOptions.map((option, index) => (
          <a
            key={index}
            href={option.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white transition-transform duration-300 hover:scale-110 relative group ${option.color}`}
            aria-label={`Contact via ${option.name}`}
          >
            {option.icon}
            
            {/* Tooltip Label */}
            <span className="absolute right-14 py-1 px-3 bg-white text-slate-800 text-xs font-bold rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              {option.name}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { MessageCircle, Instagram, X, MessageSquareText, Facebook } from "lucide-react";

export function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);

  const contactOptions = [
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
      name: "Zalo/Phone",
      icon: <span className="font-bold text-xs">Zalo</span>, // Fallback since no precise Zalo icon in Lucide
      color: "bg-blue-600",
      href: "https://zalo.me/0398249856",
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-3">
      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white transition-all duration-300 transform hover:scale-105 active:scale-95 ${
          isOpen ? "bg-slate-800 rotate-90" : "bg-primary animate-pulse"
        }`}
        aria-label="Contact Menu"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageSquareText className="w-7 h-7" />
        )}
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

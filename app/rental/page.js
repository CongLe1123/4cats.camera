"use client";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Camera, Calendar, Check } from "lucide-react";

const cameras = [
  {
    id: 1,
    name: "Fujifilm X-T30 II",
    rentalPrice: "$15/day",
    salePrice: "$799",
    image:
      "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?q=80&w=500&auto=format&fit=crop",
    category: "Mirrorless",
    condition: "Like New",
    tags: ["Aesthetic", "Beginner Friendly"],
    type: "both", // rent, buy, both
  },
  {
    id: 2,
    name: "Canon EOS R50",
    rentalPrice: "$12/day",
    salePrice: "$549",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=500&auto=format&fit=crop",
    category: "Mirrorless",
    condition: "New",
    tags: ["Compact", "Vlogging"],
    type: "both",
  },
  {
    id: 3,
    name: "Sony ZV-1 II",
    rentalPrice: "$10/day",
    salePrice: null,
    image:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=500&auto=format&fit=crop",
    category: "Compact",
    condition: "Used",
    tags: ["Selfie", "Lightweight"],
    type: "rent-only",
  },
  {
    id: 4,
    name: "Nikon Z fc",
    rentalPrice: null,
    salePrice: "$920",
    image:
      "https://images.unsplash.com/photo-1495707902641-75cac588d2e9?q=80&w=500&auto=format&fit=crop",
    category: "Retro",
    condition: "New",
    tags: ["Style", "Full Frame"],
    type: "buy-only",
  },
];

const categories = ["All", "Mirrorless", "Compact", "Retro"];
const filterTypes = ["both", "rent-only", "buy-only"];

export default function RentalPage() {
  const [activeFilter, setActiveFilter] = useState("both"); // Changed initial filter to 'both'

  const filteredCameras = cameras.filter((camera) => {
    if (activeFilter === "both") {
      return (
        camera.type === "both" ||
        camera.type === "rent-only" ||
        camera.type === "buy-only"
      );
    }
    return camera.type === activeFilter;
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-4">Rent & Buy Cameras</h1>
          <p className="text-muted-foreground text-lg max-w-xl">
            Pick your perfect match! Rent for a short trip or buy to keep
            forever.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {filterTypes.map((type) => (
            <Button
              key={type}
              variant={activeFilter === type ? "outline" : "ghost"}
              className={`rounded-full ${
                activeFilter === type
                  ? "border-primary text-primary bg-primary/5"
                  : ""
              }`}
              onClick={() => setActiveFilter(type)}
            >
              {type === "both"
                ? "Both"
                : type === "rent-only"
                ? "Rent only"
                : "Buy only"}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 animate-in fade-in duration-500">
        {filteredCameras.map((camera) => (
          <Card
            key={camera.id}
            className="overflow-hidden flex flex-col group h-full"
          >
            <div className="aspect-[4/3] relative overflow-hidden bg-muted">
              <img
                src={camera.image}
                alt={camera.name}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <Badge
                  variant="secondary"
                  className="glass border-none px-3 py-1 text-[10px] uppercase font-bold"
                >
                  {camera.category}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-white/80 border-primary/20 px-3 py-1 text-[10px] uppercase font-bold text-primary"
                >
                  {camera.condition}
                </Badge>
              </div>
              <div className="absolute top-4 right-4">
                {camera.type === "rent-only" && (
                  <Badge className="bg-blue-400">Rent Only</Badge>
                )}
                {camera.type === "buy-only" && (
                  <Badge className="bg-green-400">Buy Only</Badge>
                )}
              </div>
            </div>
            <CardHeader className="p-5">
              <CardTitle className="text-xl">{camera.name}</CardTitle>
              <CardDescription className="flex gap-1 mt-1">
                {camera.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] uppercase font-bold text-primary/70"
                  >
                    {tag}
                  </span>
                ))}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-5 pb-4 flex-grow space-y-3">
              {camera.rentalPrice && (
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-medium text-muted-foreground italic">
                    Rent
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-primary">
                      {camera.rentalPrice}
                    </span>
                  </div>
                </div>
              )}
              {camera.salePrice && (
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-medium text-muted-foreground italic">
                    Buy
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-primary">
                      {camera.salePrice}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="p-5 pt-0 flex flex-col gap-2">
              {camera.rentalPrice && (
                <Button className="w-full sticker h-10">Rent Now</Button>
              )}
              {camera.salePrice && (
                <Button
                  variant="outline"
                  className="w-full sticker h-10 border-primary text-primary hover:bg-primary/5"
                >
                  Buy Now
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Steps */}
      <section className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-primary/10 mb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-bold mb-8 italic text-primary">
              How to Rent
            </h2>
            <div className="space-y-8">
              {[
                {
                  step: 1,
                  title: "Choose a camera",
                  desc: "Selection is updated weekly with new gems.",
                },
                {
                  step: 2,
                  title: "Select rental dates",
                  desc: "Easy booking system for 3, 7, or 30 days.",
                },
                {
                  step: 3,
                  title: "Pay & receive",
                  desc: "Safe handling and tracking for every order.",
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center text-xl font-bold sticker shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-8 italic text-primary">
              How to Buy
            </h2>
            <div className="space-y-8">
              {[
                {
                  step: 1,
                  title: "Choose a camera",
                  desc: "Check if 'Buy' button is available on the listing.",
                },
                {
                  step: 2,
                  title: "Confirm price & condition",
                  desc: "See high-quality photos and condition grading.",
                },
                {
                  step: 3,
                  title: "Pay & ship",
                  desc: "Safe payment and insured shipping to you.",
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-secondary text-secondary-foreground rounded-xl flex items-center justify-center text-xl font-bold sticker shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Policies */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center italic">
          Cozy Rules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-secondary/30 border-none">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Check className="h-5 w-5 text-secondary-foreground" />
                Deposit Policy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Refundable deposits are required for rentals. Returned instantly
                after inspection!
              </p>
            </CardContent>
          </Card>
          <Card className="bg-secondary/30 border-none">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Check className="h-5 w-5 text-secondary-foreground" />
                Condition Grading
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Every camera is checked by our team. "Like New" means zero
                scratches. "Used" means slight signs but perfect function!
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

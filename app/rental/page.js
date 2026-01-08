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
    price: "$15/day",
    image:
      "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?q=80&w=500&auto=format&fit=crop",
    category: "Mirrorless",
    tags: ["Aesthetic", "Beginner Friendly"],
  },
  {
    id: 2,
    name: "Canon EOS R50",
    price: "$12/day",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=500&auto=format&fit=crop",
    category: "Mirrorless",
    tags: ["Compact", "Vlogging"],
  },
  {
    id: 3,
    name: "Sony ZV-1 II",
    price: "$10/day",
    image:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=500&auto=format&fit=crop",
    category: "Compact",
    tags: ["Selfie", "Lightweight"],
  },
  {
    id: 4,
    name: "Nikon Z fc",
    price: "$18/day",
    image:
      "https://images.unsplash.com/photo-1495707902641-75cac588d2e9?q=80&w=500&auto=format&fit=crop",
    category: "Retro",
    tags: ["Style", "Full Frame"],
  },
];

export default function RentalPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-4">Camera Rental</h1>
          <p className="text-muted-foreground text-lg max-w-xl">
            Choose from our curated collection of aesthetic and easy-to-use
            cameras.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-full">
            All Cameras
          </Button>
          <Button variant="ghost" className="rounded-full">
            Mirrorless
          </Button>
          <Button variant="ghost" className="rounded-full">
            Compact
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
        {cameras.map((camera) => (
          <Card
            key={camera.id}
            className="overflow-hidden flex flex-col group h-full sticker"
          >
            <div className="aspect-[4/3] relative overflow-hidden bg-muted">
              <img
                src={camera.image}
                alt={camera.name}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-4 left-4">
                <Badge
                  variant="secondary"
                  className="glass sticker border-none px-3 py-1"
                >
                  {camera.category}
                </Badge>
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
            <CardContent className="px-5 pb-2 flex-grow">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-primary">
                  {camera.price}
                </span>
                <span className="text-muted-foreground text-sm">per day</span>
              </div>
            </CardContent>
            <CardFooter className="p-5 pt-0">
              <Button className="w-full sticker">Rent Now</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Steps */}
      <section className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-primary/10 mb-20">
        <h2 className="text-3xl font-bold mb-10 text-center">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-0.5 border-t border-dashed border-primary/30"></div>
          {[
            {
              step: 1,
              title: "Choose camera",
              desc: "Browse our collection and find your perfect match.",
            },
            {
              step: 2,
              title: "Select rental dates",
              desc: "Pick your dates and check availability instantly.",
            },
            {
              step: 3,
              title: "Confirm & receive",
              desc: "Easy pickup or delivery. Start capturing memories!",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center relative z-10"
            >
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center text-2xl font-bold mb-6 sticker shadow-lg shadow-primary/20">
                {item.step}
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Policies */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Simple terms for simple rental
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
              <p className="text-sm leading-relaxed">
                We require a small refundable deposit for all rentals. It's
                returned instantly once the camera is checked back.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-secondary/30 border-none">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Check className="h-5 w-5 text-secondary-foreground" />
                Duration Rules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">
                Min. 1 day rental. Weekend specials available! Flexible
                extensions if you need more time with your 4cats friend.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Camera, Heart, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-12 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 md:py-32">
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/80 border px-4 py-2 rounded-full mb-6 glass sticker">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              Over 1,000+ happy photographers
            </span>
          </div>
          <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight">
            Rent or Order Your <br />
            <span className="text-primary italic">Perfect</span> Camera
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Cozy camera rental and proxy buying service. Rent easily or tell us
            what you want and we'll get it shipped to you!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="w-full sm:w-auto text-lg px-10 h-14 shadow-lg shadow-primary/20 sticker"
              asChild
            >
              <Link href="/rental">Rent a Camera</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-lg px-10 h-14 sticker"
              asChild
            >
              <Link href="/order-camera">Order a Camera</Link>
            </Button>
          </div>
        </div>

        {/* Floating elements/stickers (conceptual) */}
        <div className="hidden lg:block absolute top-1/4 left-10 p-4 bg-white rounded-2xl sticker shadow-sm rotate-[-10deg]">
          <Camera className="h-12 w-12 text-primary/60" />
        </div>
        <div className="hidden lg:block absolute bottom-1/4 right-10 p-4 bg-white rounded-2xl sticker shadow-sm rotate-[10deg]">
          <Heart className="h-12 w-12 text-primary/60" />
        </div>
      </section>

      {/* Features/Why Us */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Simple & Friendly",
              desc: "No technical jargon. We explain cameras in plain English so you can start shooting right away.",
              icon: Sparkles,
            },
            {
              title: "Proxy Buying Service",
              desc: "Request any camera model! We find it, purchase it, and ship it directly to your doorstep.",
              icon: CheckCircle2,
            },
            {
              title: "Beginner Ready",
              desc: "Custom sets that come with filters, batteries, and SD cards. Just hit the shutter!",
              icon: Camera,
            },
          ].map((item, i) => (
            <Card
              key={i}
              className="border-none shadow-none bg-primary/5 hover:bg-primary/10 transition-colors"
            >
              <CardContent className="pt-8">
                <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center mb-4 sticker">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA section with Grid background */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-primary text-primary-foreground rounded-[2rem] p-8 md:p-16 text-center shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to start your journey?
            </h2>
            <p className="text-primary-foreground/80 mb-10 text-lg md:text-xl max-w-xl mx-auto">
              Join our community of student and traveler photographers today.
            </p>
            <Button
              variant="secondary"
              size="lg"
              className="rounded-full px-12 h-14 text-lg"
            >
              Check out our catalog
            </Button>
          </div>
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
        </div>
      </section>
    </div>
  );
}

import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { MessageCircle, Instagram, Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Say Hello! 🐱✨</h1>
        <p className="text-muted-foreground text-lg">
          We're here to help you with your camera journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <Card className="p-8 border-none bg-primary text-primary-foreground shadow-2xl overflow-hidden relative">
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Studio</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 p-2 rounded-xl mt-1">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold">Visit Us</h4>
                    <p className="opacity-80">
                      123 Pastel Lane, Creative District
                      <br />
                      Camera City, 56789
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 p-2 rounded-xl mt-1">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold">Call Us</h4>
                    <p className="opacity-80">+1 (555) PASTEL-CAM</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 p-2 rounded-xl mt-1">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold">Email Us</h4>
                    <p className="opacity-80">hello@4cats.camera</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 flex gap-4">
              <Button variant="secondary" className="rounded-full px-8 sticker">
                Get Directions
              </Button>
            </div>
          </div>
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        </Card>

        {/* Social Cards */}
        <div className="flex flex-col gap-6">
          <Card className="hover:border-primary transition-all cursor-pointer group sticker">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] p-3 rounded-2xl shadow-lg">
                  <Instagram className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Instagram</h3>
                  <p className="text-sm text-muted-foreground">@4cats.camera</p>
                </div>
              </div>
              <Button variant="ghost" className="rounded-full">
                Follow
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:border-[#0084FF] transition-all cursor-pointer sticker">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-[#0084FF] p-3 rounded-2xl shadow-lg">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Messenger</h3>
                  <p className="text-sm text-muted-foreground">
                    Chat with us instantly
                  </p>
                </div>
              </div>
              <Button variant="ghost" className="rounded-full">
                Open Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:border-[#0068FF] transition-all cursor-pointer sticker">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-[#0068FF] p-3 rounded-2xl shadow-lg">
                  <span className="text-white font-black text-2xl h-8 w-8 flex items-center justify-center">
                    Z
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Zalo</h3>
                  <p className="text-sm text-muted-foreground">
                    Admin: 0123 456 789
                  </p>
                </div>
              </div>
              <Button variant="ghost" className="rounded-full">
                Chat
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

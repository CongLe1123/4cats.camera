import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Camera, HelpCircle, MessageCircle, Send } from "lucide-react";

export default function BuyAssistancePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-16">
        <div className="bg-primary/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 sticker">
          <HelpCircle className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 italic text-primary">
          Need help choosing?
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Searching for your first camera can be overwhelming. Let us help you
          find and order the right one for you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Form Section */}
        <Card className="shadow-xl border-primary/10">
          <CardHeader>
            <CardTitle>Camera Finder Quiz</CardTitle>
            <CardDescription>
              Tell us a bit about what you're looking for.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold">Planned Budget</label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="justify-start font-normal h-12"
                >
                  Under $500
                </Button>
                <Button
                  variant="outline"
                  className="justify-start font-normal h-12 border-primary bg-primary/5"
                >
                  $500 - $1,500
                </Button>
                <Button
                  variant="outline"
                  className="justify-start font-normal h-12"
                >
                  $1,500 - $3k
                </Button>
                <Button
                  variant="outline"
                  className="justify-start font-normal h-12"
                >
                  I'm balling! ✨
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold">
                What will you use it for?
              </label>
              <div className="grid grid-cols-1 gap-3">
                <Button
                  variant="outline"
                  className="justify-start font-normal h-12"
                >
                  ✈️ Traveling & Street Photography
                </Button>
                <Button
                  variant="outline"
                  className="justify-start font-normal h-12"
                >
                  🤳 Vlogging & Content Creation
                </Button>
                <Button
                  variant="outline"
                  className="justify-start font-normal h-12"
                >
                  🐈 Taking pictures of my pets (4cats!)
                </Button>
                <Button
                  variant="outline"
                  className="justify-start font-normal h-12"
                >
                  🎓 Professional / Work
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold">Experience Level</label>
              <Input
                placeholder="Beginner, Hobbyist, or Pro?"
                className="h-12"
              />
            </div>

            <Button size="lg" className="w-full h-14 text-lg">
              Get My Recommendations
              <Send className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>

        {/* Info Section */}
        <div className="space-y-8">
          <div className="bg-white/50 backdrop-blur p-8 rounded-[2rem] border border-primary/20 sticker">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Camera className="text-primary" />
              How we help
            </h3>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex gap-3">
                <div className="bg-primary/20 p-1 rounded-full h-fit mt-1">
                  <CheckIcon className="h-3 w-3 text-primary" />
                </div>
                <span>We research the best prices across multiple stores.</span>
              </li>
              <li className="flex gap-3">
                <div className="bg-primary/20 p-1 rounded-full h-fit mt-1">
                  <CheckIcon className="h-3 w-3 text-primary" />
                </div>
                <span>We check local availability and shipping times.</span>
              </li>
              <li className="flex gap-3">
                <div className="bg-primary/20 p-1 rounded-full h-fit mt-1">
                  <CheckIcon className="h-3 w-3 text-primary" />
                </div>
                <span>
                  We help with the technical specs so you don't have to.
                </span>
              </li>
              <li className="flex gap-3">
                <div className="bg-primary/20 p-1 rounded-full h-fit mt-1">
                  <CheckIcon className="h-3 w-3 text-primary" />
                </div>
                <span>We can even handle the ordering process for you!</span>
              </li>
            </ul>
          </div>

          <div className="bg-primary text-primary-foreground p-8 rounded-[2rem] sticker shadow-lg shadow-primary/20">
            <h3 className="text-2xl font-bold mb-4 italic">
              Rather just talk?
            </h3>
            <p className="mb-8 opacity-90">
              Message us directly on WhatsApp or Instagram for a quick
              consultation with our expert team members.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="secondary" className="flex-1 h-12 gap-2">
                <MessageCircle className="h-5 w-5" />
                WhatsApp
              </Button>
              <Button variant="secondary" className="flex-1 h-12 gap-2">
                Instagram
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

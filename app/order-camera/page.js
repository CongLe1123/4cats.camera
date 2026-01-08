import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Camera, Send, ShoppingCart, Truck, CreditCard } from "lucide-react";

export default function OrderCameraPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-16">
        <div className="bg-primary/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 sticker">
          <ShoppingCart className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 italic text-primary">
          Proxy Buying Service
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          We hunt down and purchase your dream camera for you. Just tell us what
          you want, and we'll handle the rest!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <Card className="shadow-xl border-primary/10">
            <CardHeader>
              <CardTitle>Order Request Form</CardTitle>
              <CardDescription>
                Provide as many details as possible so we can find exactly what
                you're looking for.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Camera Brand</label>
                  <Input placeholder="e.g. Fujifilm, Canon, Sony" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">
                    Model Name or Link
                  </label>
                  <Input placeholder="e.g. X100V or eBay link" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold">
                    Condition Preference
                  </label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 border-primary bg-primary/5"
                    >
                      New
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Used / Like New
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Doesn't matter
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">
                  Preferred Store (Optional)
                </label>
                <Input placeholder="e.g. BH Photo, Amazon, local shop" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">Shipping Address</label>
                <Input placeholder="Street, City, Country, Zip Code" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold">
                    Contact Email / Phone
                  </label>
                  <Input placeholder="How should we reach you?" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Special Requests</label>
                  <Input placeholder="Anything else we should know?" />
                </div>
              </div>

              <Button size="lg" className="w-full h-14 text-lg sticker">
                Submit Order Request
                <Send className="ml-2 h-5 w-5" />
              </Button>

              <p className="text-xs text-center text-muted-foreground italic">
                * We will contact you with a final price (Item + Service Fee +
                Shipping) before proceeding with the purchase.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <div className="space-y-6">
          <div className="bg-white/50 backdrop-blur p-8 rounded-[2rem] border border-primary/20 shadow-sm">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              How it works
            </h3>
            <div className="space-y-8">
              {[
                {
                  icon: Send,
                  title: "1. You Request",
                  desc: "Tell us the exact camera you want (or ask for a recommendation).",
                },
                {
                  icon: ShoppingCart,
                  title: "2. We Purchase",
                  desc: "We buy it from a trusted source on your behalf.",
                },
                {
                  icon: Truck,
                  title: "3. We Ship",
                  desc: "We ship it safely to your doorstep with tracking.",
                },
              ].map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="bg-primary/20 p-3 rounded-2xl h-fit">
                    <step.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold">{step.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Card className="bg-primary text-primary-foreground p-8 rounded-[2rem] border-none shadow-lg shadow-primary/20">
            <h3 className="text-2xl font-bold mb-4 italic flex items-center gap-2">
              <CreditCard className="h-6 w-6" />
              Pricing Notice
            </h3>
            <div className="space-y-4 text-sm opacity-90">
              <p>Your total price will be:</p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Official Camera Price</li>
                <li>Small Service Fee</li>
                <li>Shipping Costs</li>
              </ul>
              <hr className="border-white/20" />
              <p className="font-bold">
                Transparent communication every step of the way!
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

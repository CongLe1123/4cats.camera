import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Check, ShieldCheck, RefreshCcw, Camera } from "lucide-react";

export default function PricingPage() {
  const rentalPlans = [
    {
      name: "Short Trip",
      price: "$15",
      duration: "per day",
      features: [
        "Pick any camera",
        "Free 64GB SD Card",
        "Extra battery included",
        "Protective pouch",
      ],
    },
    {
      name: "Vacation",
      price: "$85",
      duration: "per week",
      features: [
        "20% discount applied",
        "Free 128GB SD Card",
        "Charger & 2 batteries",
        "Premium camera bag",
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 italic text-primary">
          Pricing & Policies
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Simple, transparent, and cozy. No hidden fees, just pure photography
          joy.
        </p>
      </div>

      {/* Rental Pricing */}
      <h2 className="text-3xl font-bold mb-8 text-center">Rental Pricing</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 max-w-3xl mx-auto">
        {rentalPlans.map((plan, i) => (
          <Card key={i} className="sticker border-primary/20 bg-white/50">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="flex items-baseline justify-center gap-1 mt-2">
                <span className="text-4xl font-black text-primary">
                  {plan.price}
                </span>
                <span className="text-muted-foreground text-sm">
                  {plan.duration}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-green-400" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Policies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        <Card className="border-none bg-primary/5 p-6 sticker">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            Camera Sale Policy
          </h3>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Condition Grading:</strong> We
              use strict New/Like New/Used grades. All sales include a detailed
              check report.
            </li>
            <li>
              <strong className="text-foreground">Warranty:</strong> 3-month
              limited warranty on all direct purchases for internal hardware
              defects.
            </li>
            <li>
              <strong className="text-foreground">Check & Verify:</strong> Every
              camera is cleaned and sensor-checked before being listed.
            </li>
          </ul>
        </Card>

        <Card className="border-none bg-secondary/20 p-6 sticker">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <RefreshCcw className="h-6 w-6 text-secondary-foreground" />
            Refund & Cancellation
          </h3>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li>
              <strong className="text-secondary-foreground">Rentals:</strong>{" "}
              Free cancellation up to 48h before rental start. 50% refund after
              that.
            </li>
            <li>
              <strong className="text-secondary-foreground">
                Direct Purchase:
              </strong>{" "}
              7-day return policy if the item doesn't match the described
              condition.
            </li>
            <li>
              <strong className="text-secondary-foreground">
                Proxy Buying:
              </strong>{" "}
              Service fee is non-refundable once purchase is confirmed by the
              store.
            </li>
          </ul>
        </Card>
      </div>

      {/* Proxy Fee Info */}
      <div className="bg-primary text-primary-foreground rounded-[2rem] p-8 md:p-12 sticker text-center">
        <h3 className="text-2xl font-bold mb-6 italic flex items-center justify-center gap-2">
          <Camera className="h-8 w-8" />
          Proxy Buying Service Fee
        </h3>
        <p className="max-w-2xl mx-auto mb-8 opacity-90">
          Our service fee covers finding, inspecting, communicating with
          sellers, handling taxes/customs (if any), and secure repackaging for
          you.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="bg-white/10 px-6 py-3 rounded-2xl border border-white/20">
            <div className="text-xs uppercase opacity-70">Under $500</div>
            <div className="text-xl font-bold">$25 Fee</div>
          </div>
          <div className="bg-white/10 px-6 py-3 rounded-2xl border border-white/20">
            <div className="text-xs uppercase opacity-70">$500 - $1,500</div>
            <div className="text-xl font-bold">$50 Fee</div>
          </div>
          <div className="bg-white/10 px-6 py-3 rounded-2xl border border-white/10">
            <div className="text-xs uppercase opacity-70">Above $1,500</div>
            <div className="text-xl font-bold">5% of Price</div>
          </div>
        </div>
      </div>
    </div>
  );
}

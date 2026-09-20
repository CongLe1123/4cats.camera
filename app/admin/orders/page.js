"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Loader2,
  Phone,
  Mail,
  MessageSquare,
  ShoppingBag,
  Camera,
  User,
  MapPin,
  Clock,
} from "lucide-react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    let isCancelled = false;

    async function loadOrders() {
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          camera:cameras(name, image)
        `,
        )
        .order("created_at", { ascending: false });

      if (!isCancelled) {
        if (error) console.error(error);
        else setOrders(data || []);
        setLoading(false);
      }
    }

    async function cleanupCancelledOrders() {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("status", "CANCELLED")
        .lt("created_at", oneDayAgo.toISOString());

      if (error) console.error("Auto-cleanup failed:", error);
    }

    loadOrders();
    cleanupCancelledOrders();

    // Realtime subscription
    const channel = supabase
      .channel("public:orders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            const { data: cameraData } = await supabase
              .from("cameras")
              .select("name, image")
              .eq("id", payload.new.camera_id)
              .single();

            const newOrder = { ...payload.new, camera: cameraData };
            setOrders((prev) => [newOrder, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setOrders((prev) =>
              prev.map((o) => {
                if (o.id === payload.new.id) {
                  return { ...payload.new, camera: o.camera };
                }
                return o;
              }),
            );
          } else if (payload.eventType === "DELETE") {
            setOrders((prev) => prev.filter((o) => o.id !== payload.old.id));
          }
        },
      )
      .subscribe();

    return () => {
      isCancelled = true;
      supabase.removeChannel(channel);
    };
  }, [refreshIndex]);

  const updateStatus = async (id, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)),
    );

    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      console.error("Failed to update status", error);
      setRefreshIndex((prev) => prev + 1);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "NEW":
        return "default";
      case "CONTACTED":
        return "secondary";
      case "COMPLETED":
        return "outline";
      case "CANCELLED":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-primary">Order Requests</h1>
        <Badge
          variant="outline"
          className="px-3 py-1 bg-white text-lg font-bold"
        >
          {orders.filter((o) => o.status === "NEW").length} New
        </Badge>
      </div>

      <Tabs defaultValue="NEW" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-12 rounded-xl bg-muted/50 p-1">
          <TabsTrigger
            value="NEW"
            className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold"
          >
            New ({orders.filter((o) => o.status === "NEW").length})
          </TabsTrigger>
          <TabsTrigger
            value="CONTACTED"
            className="rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white font-bold"
          >
            Contacted ({orders.filter((o) => o.status === "CONTACTED").length})
          </TabsTrigger>
          <TabsTrigger
            value="COMPLETED"
            className="rounded-lg data-[state=active]:bg-green-500 data-[state=active]:text-white font-bold"
          >
            Completed ({orders.filter((o) => o.status === "COMPLETED").length})
          </TabsTrigger>
          <TabsTrigger
            value="CANCELLED"
            className="rounded-lg data-[state=active]:bg-red-500 data-[state=active]:text-white font-bold"
          >
            Cancelled ({orders.filter((o) => o.status === "CANCELLED").length})
          </TabsTrigger>
        </TabsList>

        {["NEW", "CONTACTED", "COMPLETED", "CANCELLED"].map((status) => (
          <TabsContent key={status} value={status} className="mt-6">
            {status === "CANCELLED" && (
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-4 bg-muted/50 p-3 rounded-xl border border-border/50">
                <Clock className="w-4 h-4" />
                <span>
                  Cancelled orders are automatically deleted after 24 hours.
                </span>
              </div>
            )}
            <div className="grid grid-cols-1 gap-4">
              {orders
                .filter((o) => o.status === status)
                .map((order) => {
                  // Parse customer message for extra details
                  const details = order.customer_message
                    ? order.customer_message.split("|").reduce((acc, part) => {
                        const [key, value] = part
                          .split(":")
                          .map((s) => s.trim());
                        if (key && value) acc[key.toLowerCase()] = value;
                        return acc;
                      }, {})
                    : {};

                  const address = order.customer_address || details["address"];
                  const condition = details["condition"];
                  const color = details["color"];

                  return (
                    <Card
                      key={order.id}
                      className={`overflow-hidden border-l-4 ${order.status === "NEW" ? "border-l-primary shadow-md" : "border-l-transparent opacity-80"}`}
                    >
                      <CardHeader className="bg-secondary/5 pb-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className="font-mono text-xs text-muted-foreground"
                              >
                                {String(order.id).slice(0, 8)}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(order.created_at).toLocaleString(
                                  "vi-VN",
                                )}
                              </span>
                            </div>
                            <CardTitle className="flex items-center gap-3 text-xl pt-1">
                              {order.customer_name}
                              <Badge
                                variant={
                                  order.type === "RENT"
                                    ? "secondary"
                                    : "default"
                                }
                              >
                                {order.type}
                              </Badge>
                            </CardTitle>
                          </div>
                          <Select
                            value={order.status}
                            onValueChange={(val) => updateStatus(order.id, val)}
                          >
                            <SelectTrigger className="w-[140px] h-9 font-bold">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="NEW">New</SelectItem>
                              <SelectItem value="CONTACTED">
                                Contacted
                              </SelectItem>
                              <SelectItem value="COMPLETED">
                                Completed
                              </SelectItem>
                              <SelectItem value="CANCELLED">
                                Cancelled
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-6 grid md:grid-cols-2 gap-6">
                        {/* Customer Info */}
                        <div className="space-y-4">
                          <h4 className="font-bold text-sm uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                            <User className="w-4 h-4" /> Customer Info
                          </h4>
                          <div className="space-y-3 bg-white p-4 rounded-xl border border-border/50 shadow-sm">
                            <div className="flex items-start gap-3">
                              <Phone className="w-4 h-4 text-primary mt-1" />
                              <div>
                                <p className="text-xs text-muted-foreground font-bold">
                                  Phone
                                </p>
                                <p className="font-medium">
                                  {order.customer_contact}
                                </p>
                              </div>
                            </div>
                            {address && (
                              <div className="flex items-start gap-3 pt-2 border-t border-dashed">
                                <MapPin className="w-4 h-4 text-primary mt-1" />
                                <div>
                                  <p className="text-xs text-muted-foreground font-bold">
                                    Address
                                  </p>
                                  <p className="font-medium">{address}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="space-y-4">
                          <h4 className="font-bold text-sm uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                            <Camera className="w-4 h-4" /> Order Details
                          </h4>
                          {order.camera ? (
                            <div className="flex gap-4 items-start bg-secondary/10 p-4 rounded-xl border border-secondary/20">
                              {order.camera.image && (
                                <img
                                  src={order.camera.image}
                                  alt={order.camera.name}
                                  className="w-16 h-16 object-cover rounded-lg shadow-sm bg-white"
                                />
                              )}
                              <div className="space-y-1">
                                <p className="font-bold text-lg leading-tight">
                                  {order.camera.name}
                                </p>
                                <div className="flex flex-wrap gap-2 pt-1">
                                  {condition && (
                                    <Badge
                                      variant="outline"
                                      className="bg-white/50 text-xs"
                                    >
                                      Condition: {condition}
                                    </Badge>
                                  )}
                                  {color && (
                                    <Badge
                                      variant="outline"
                                      className="bg-white/50 text-xs"
                                    >
                                      Color: {color}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="p-4 bg-muted/30 rounded-lg text-sm italic text-muted-foreground">
                              Camera info not available
                            </div>
                          )}

                          {/* Fallback for raw message */}
                          {!address &&
                            !condition &&
                            !color &&
                            order.customer_message && (
                              <div className="text-sm bg-muted/30 p-3 rounded-lg border">
                                Message: &quot;{order.customer_message}&quot;
                              </div>
                            )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

              {orders.filter((o) => o.status === status).length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                  No {status.toLowerCase()} orders found.
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

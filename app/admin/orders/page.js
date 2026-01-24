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
} from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();

    // Realtime subscription
    const channel = supabase
      .channel("public:orders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          console.log("Change received!", payload);
          if (payload.eventType === "INSERT") {
            setOrders((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setOrders((prev) =>
              prev.map((o) => (o.id === payload.new.id ? payload.new : o)),
            );
          } else if (payload.eventType === "DELETE") {
            setOrders((prev) => prev.filter((o) => o.id !== payload.old.id));
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        camera:cameras(name, image)
      `,
      )
      .order("created_at", { ascending: false });

    if (error) console.error(error);
    else setOrders(data || []);
    setLoading(false);
  };

  const updateStatus = async (id, newStatus) => {
    // Optimistic update
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)),
    );

    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      console.error("Failed to update status", error);
      fetchOrders(); // Revert on error
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "NEW":
        return "default"; // primary
      case "CONTACTED":
        return "secondary";
      case "COMPLETED":
        return "outline"; // or custom green if I had it
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

      <div className="grid grid-cols-1 gap-4">
        {orders.map((order) => (
          <Card
            key={order.id}
            className={`border-l-4 ${order.status === "NEW" ? "border-l-primary shadow-md" : "border-l-transparent opacity-80"}`}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    {order.customer_name}
                    <Badge
                      variant={order.type === "RENT" ? "secondary" : "default"}
                    >
                      {order.type}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Phone className="w-4 h-4" /> {order.customer_contact}
                  </CardDescription>
                </div>
                <Select
                  value={order.status}
                  onValueChange={(val) => updateStatus(order.id, val)}
                >
                  <SelectTrigger className="w-[140px] h-8 text-xs font-bold uppercase tracking-wider">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEW">New</SelectItem>
                    <SelectItem value="CONTACTED">Contacted</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-start">
                {order.camera && (
                  <div className="flex items-center gap-3 bg-muted/30 p-2 rounded-lg border">
                    {order.camera.image && (
                      <img
                        src={order.camera.image}
                        alt={order.camera.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    )}
                    <div>
                      <p className="text-sm font-bold">{order.camera.name}</p>
                      <p className="text-xs text-muted-foreground">
                        ID: {order.camera_id}
                      </p>
                    </div>
                  </div>
                )}
                {order.customer_message && (
                  <div className="flex-1 bg-secondary/10 p-3 rounded-lg text-sm italic border-l-2 border-secondary">
                    "{order.customer_message}"
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0 text-xs text-muted-foreground flex justify-between">
              <span>
                Created: {new Date(order.created_at).toLocaleString("vi-VN")}
              </span>
            </CardFooter>
          </Card>
        ))}
        {orders.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            No orders found.
          </div>
        )}
      </div>
    </div>
  );
}

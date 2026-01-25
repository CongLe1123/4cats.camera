"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Camera,
  Image,
  ShoppingCart,
  Home,
  LogOut,
  User,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Toaster, toast } from "sonner";

export default function AdminLayout({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 1. Auth Check (Existing)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) router.push("/login");
      setLoading(false);
    });

    const {
      data: { subscription: authListener },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) router.push("/login");
    });

    // 2. Request Notification Permission
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    // 3. Realtime Order Listener (Updated Config)
    const channel = supabase
      .channel("admin-global-listener")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          console.log("🔔 Layout Realtime Event:", payload);
          if (payload.eventType === "INSERT") {
            const newOrder = payload.new;

            // Custom Alert Sound (Data URI)
            const audio = new Audio(
              "data:audio/wav;base64,UklGRl9vT1dAVEfmtAAAAABAAABwAAAAAgAAABAAAAABAAgAZGF0YTNvT1cAAAAAAACAAIAAAIAAAIAAAIAAAIAAAIAAAIAAAIAAAIAAAIAAAIAAAIAAAIAAAIAAAIAAAIAAAIAAAIAAAIAAAIA=",
            );
            audio.volume = 0.5;
            audio.play().catch((e) => console.error("Audio play failed", e));

            // Browser Push Notification
            if (Notification.permission === "granted") {
              new Notification(
                `Đơn hàng mới: ${newOrder.type === "RENT" ? "Thuê" : "Mua"}! 🔔`,
                {
                  body: `${newOrder.customer_name} - ${newOrder.customer_contact}`,
                  icon: "/favicon.ico",
                },
              );
            }

            // In-App Toast
            toast.success(
              `Đơn hàng mới: ${newOrder.type === "RENT" ? "Thuê" : "Mua"}!`,
              {
                description: `${newOrder.customer_name} - ${newOrder.customer_contact}`,
                action: {
                  label: "Xem",
                  onClick: () => router.push(`/admin/orders`),
                },
                duration: 10000,
              },
            );
          }
        },
      )
      .subscribe((status) => {
        console.log("🔔 Admin Layout Subscription Status:", status);
        if (status === "SUBSCRIBED") {
          toast.info("Đã kết nối hệ thống thông báo đơn hàng", {
            duration: 2000,
            icon: "📡",
          });
        }
      });

    return () => {
      authListener.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-muted/20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) return null; // Will redirect

  return (
    <div className="flex h-screen bg-muted/20">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r flex flex-col">
        <div className="p-6 border-b">
          <Link
            href="/"
            className="flex items-center gap-2 font-black text-2xl text-primary"
          >
            <span>4cats.</span>
          </Link>
          <p className="text-xs text-muted-foreground mt-1">Admin Dashboard</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            Orders
          </Link>
          <Link
            href="/admin/cameras"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <Camera className="w-4 h-4" />
            Cameras
          </Link>
          <Link
            href="/admin/banners"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <Image className="w-4 h-4" />
            Banners
          </Link>
        </nav>

        <div className="p-4 border-t space-y-2">
          <div className="flex items-center gap-3 px-4 py-2 text-xs font-bold text-muted-foreground">
            <User className="w-3 h-3" />
            {session?.user?.email}
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-muted transition-colors text-muted-foreground"
          >
            <Home className="w-4 h-4" />
            Back to Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
      <Toaster />
    </div>
  );
}

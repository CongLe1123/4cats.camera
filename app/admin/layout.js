"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Camera,
  Image as ImageIcon,
  ShoppingCart,
  Home,
  LogOut,
  User,
  Settings,
  Tag,
  Menu,
  X,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Toaster, toast } from "sonner";
import { BrandLogo } from "../../components/BrandLogo";

export default function AdminLayout({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsMobileOpen(false);
  }

  useEffect(() => {
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

    // Request Notification Permission
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission().catch(() => {});
    }

    // Realtime Order Listener
    const channel = supabase
      .channel("admin-global-listener")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newOrder = payload.new;

            // Browser Push Notification
            if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
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
                description: `${newOrder.customer_name} (${newOrder.customer_contact})`,
                action: {
                  label: "Xem ngay",
                  onClick: () => router.push(`/admin/orders`),
                },
                duration: 10000,
              },
            );
          }
        },
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          toast.info("Đã kết nối thông báo đơn hàng trực tiếp", {
            duration: 2000,
            icon: "📡",
          });
        }
      });

    return () => {
      authListener.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [router]);



  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const navLinks = [
    { href: "/admin", label: "Tổng quan", icon: LayoutDashboard },
    { href: "/admin/orders", label: "Đơn hàng", icon: ShoppingCart },
    { href: "/admin/cameras", label: "Máy ảnh", icon: Camera },
    { href: "/admin/banners", label: "Banners", icon: ImageIcon },
    { href: "/admin/lookups", label: "Danh mục", icon: Tag },
    { href: "/admin/settings", label: "Cấu hình", icon: Settings },
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-muted/20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="flex h-screen bg-muted/20 overflow-hidden">
      {/* Mobile Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b z-40 flex items-center justify-between px-4">
        <BrandLogo href="/admin" size="sm" />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Backdrop overlay for mobile drawer */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-card border-r flex flex-col transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 border-b flex flex-col gap-1">
          <BrandLogo href="/admin" size="md" />
          <p className="text-xs text-muted-foreground font-medium pl-1">
            Hệ thống Quản Trị Viên 🛠️
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navLinks.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "text-foreground/80 hover:bg-primary/10 hover:text-primary"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t space-y-2 bg-secondary/10">
          <div className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-muted-foreground truncate rounded-lg bg-white/60">
            <User className="w-3.5 h-3.5 shrink-0 text-primary" />
            <span className="truncate">{session?.user?.email}</span>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 font-bold rounded-xl"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Đăng xuất
          </Button>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl hover:bg-muted transition-colors text-muted-foreground"
          >
            <Home className="w-4 h-4 text-primary" />
            Xem website cửa hàng
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
        {children}
      </main>
      <Toaster position="top-right" richColors />
    </div>
  );
}

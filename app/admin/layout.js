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
  Boxes,
  MapPin,
  Sparkles,
  TicketPercent,
  Compass,
  FileQuestion,
  Search,
  BookmarkCheck,
  Globe2,
  FolderOpen
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Toaster, toast } from "sonner";
import { BrandLogo } from "../../components/BrandLogo";

export default function AdminLayout({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [newOrderCount, setNewOrderCount] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsMobileOpen(false);
  }

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setSession(session);
      if (!session) {
        window.location.href = "/login";
      }
      setLoading(false);
    }).catch(() => {
      if (!mounted) return;
      setLoading(false);
      window.location.href = "/login";
    });

    const {
      data: { subscription: authListener },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      setSession(session);
      if (event === "SIGNED_OUT") {
        window.location.href = "/login";
      }
    });

    // Fetch initial new order count
    supabase
      .from("orders")
      .select("id", { count: "exact" })
      .eq("status", "NEW")
      .then(({ count }) => {
        if (count !== null) setNewOrderCount(count);
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
            setNewOrderCount((prev) => prev + 1);

            // Browser Push Notification
            if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
              new Notification(
                `Đơn hàng mới: ${newOrder.customer_name} 🔔`,
                {
                  body: `${newOrder.customer_contact} - Vừa đặt mua máy!`,
                  icon: "/favicon.ico",
                },
              );
            }

            // In-App Toast
            toast.success(
              `Đơn hàng mới từ ${newOrder.customer_name}!`,
              {
                description: `Liên hệ: ${newOrder.customer_contact}`,
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
      .subscribe();

    return () => {
      mounted = false;
      authListener?.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const navGroups = [
    {
      title: "TỔNG QUAN",
      items: [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard }
      ]
    },
    {
      title: "DANH MỤC",
      items: [
        { href: "/admin/cameras", label: "Sản phẩm & SKUs", icon: Camera },
        { href: "/admin/lookups", label: "Danh mục & Hãng", icon: Tag },
        { href: "/admin/filters", label: "Bộ lọc cửa hàng", icon: Search }
      ]
    },
    {
      title: "KHO HÀNG",
      items: [
        { href: "/admin/inventory", label: "Quản lý tồn kho", icon: Boxes },
        { href: "/admin/branches", label: "Chi nhánh", icon: MapPin }
      ]
    },
    {
      title: "BÁN HÀNG",
      items: [
        { href: "/admin/orders", label: "Đơn đặt hàng", icon: ShoppingCart, badge: newOrderCount > 0 ? newOrderCount : null },
        { href: "/admin/reservations", label: "Yêu cầu giữ máy", icon: BookmarkCheck },
        { href: "/admin/promotions", label: "Khuyến mãi", icon: TicketPercent }
      ]
    },
    {
      title: "TRANG CHỦ",
      items: [
        { href: "/admin/banners", label: "Banner Carousel", icon: ImageIcon },
        { href: "/admin/featured", label: "Sản phẩm nổi bật", icon: Sparkles }
      ]
    },
    {
      title: "NỘI DUNG & SEO",
      items: [
        { href: "/admin/seo", label: "SEO & Redirects 301", icon: Globe2 },
        { href: "/admin/media", label: "Thư viện ảnh", icon: FolderOpen },
        { href: "/admin/content", label: "Đánh giá & FAQ", icon: FileQuestion }
      ]
    },
    {
      title: "CẤU HÌNH",
      items: [
        { href: "/admin/settings", label: "Cài đặt cửa hàng", icon: Settings }
      ]
    }
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
    <div className="flex h-screen bg-muted/20 overflow-hidden font-sans">
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
        <div className="p-5 border-b flex flex-col gap-1 bg-secondary/10">
          <BrandLogo href="/admin" size="md" />
          <p className="text-[11px] text-muted-foreground font-semibold pl-1">
            Hệ thống Quản Trị Viên 4cats 📸
          </p>
        </div>

        <nav className="flex-1 p-3 space-y-4 overflow-y-auto scrollbar-thin">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <p className="px-3 text-[10px] font-black text-muted-foreground/70 tracking-wider">
                {group.title}
              </p>
              {group.items.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-xs shadow-primary/20"
                        : "text-foreground/80 hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-destructive text-white animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="p-3 border-t space-y-1.5 bg-secondary/10">
          <div className="flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-muted-foreground truncate rounded-lg bg-white/70 border">
            <User className="w-3.5 h-3.5 shrink-0 text-primary" />
            <span className="truncate">{session?.user?.email}</span>
          </div>
          <div className="flex gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] font-bold rounded-xl bg-white border hover:bg-muted text-muted-foreground transition-colors"
              title="Xem website ngoài"
            >
              <Home className="w-3.5 h-3.5 text-primary" />
              Storefront
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center justify-center text-destructive hover:bg-destructive/10 text-xs font-bold rounded-xl px-3"
              onClick={handleLogout}
              title="Đăng xuất"
            >
              <LogOut className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8 bg-muted/20">
        {children}
      </main>
      <Toaster position="top-right" richColors />
    </div>
  );
}

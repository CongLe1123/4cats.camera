"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Lock, Eye, EyeOff, ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { BrandLogo } from "../../components/BrandLogo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setError("Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.");
        } else {
          setError("Đăng nhập không thành công. Vui lòng thử lại.");
        }
        setLoading(false);
      } else {
        router.push("/admin");
      }
    } catch {
      setError("Đã xảy ra lỗi kết nối. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-b from-secondary/40 via-background to-secondary/30 p-4 relative">
      {/* Back to site link */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors bg-white/80 px-4 py-2 rounded-full border border-primary/10 shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Về trang chủ
        </Link>
      </div>

      <Card className="w-full max-w-md shadow-2xl border-primary/20 rounded-4xl bg-white/95 backdrop-blur-md overflow-hidden">
        <CardHeader className="text-center space-y-4 pt-10 pb-6 px-8">
          <div className="mx-auto flex justify-center">
            <BrandLogo size="lg" showText={false} />
          </div>
          <div>
            <CardTitle className="text-2xl font-black text-primary font-genty">
              Đăng nhập Quản Trị Viên 🐾
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-1">
              Nhập thông tin tài khoản để truy cập trang quản trị cửa hàng
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-10">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2 text-left">
              <Label htmlFor="email" className="font-bold text-xs uppercase tracking-wider text-foreground">
                Email quản trị
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
                className="h-12 rounded-2xl border-primary/20 bg-secondary/20 focus-visible:ring-primary text-sm font-medium"
              />
            </div>

            <div className="space-y-2 text-left">
              <Label htmlFor="password" className="font-bold text-xs uppercase tracking-wider text-foreground">
                Mật khẩu
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="h-12 rounded-2xl border-primary/20 bg-secondary/20 focus-visible:ring-primary text-sm pr-11 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors p-1"
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-xs font-bold text-destructive bg-destructive/10 border border-destructive/20 p-3.5 rounded-2xl text-center animate-shake">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 rounded-2xl font-bold uppercase tracking-wider shadow-lg shadow-primary/25 sticker text-sm"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Đang đăng nhập...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4" /> Đăng nhập
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

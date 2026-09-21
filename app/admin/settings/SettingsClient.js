"use client";

import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "../../../components/ui/tabs";
import { Switch } from "../../../components/ui/switch";
import { toast } from "sonner";
import { supabase } from "../../../lib/supabase";
import {
  Plus,
  Trash2,
  Save,
  Store,
  MapPin,
  Link as LinkIcon,
  Phone,
  Mail,
  Clock,
  Truck,
  ShieldCheck,
  CreditCard,
  Share2,
  Boxes
} from "lucide-react";

export default function SettingsClient({ initialSettings }) {
  const [settings, setSettings] = useState(() => ({
    brand_name: initialSettings?.brand_name || "4cats.camera 📸",
    brand_description: initialSettings?.brand_description || "Chuyên cung cấp các dòng máy ảnh Mirrorless, Compact chính hãng mới 100% dành cho người mới và creator.",
    contact_email: initialSettings?.contact_email || "fourcatscamera@gmail.com",
    contact_phones: initialSettings?.contact_phones || ["039 824 9856", "093 235 68 69"],
    facebook_url: initialSettings?.facebook_url || "https://www.facebook.com/profile.php?id=100093056073018",
    instagram_url: initialSettings?.instagram_url || "https://www.instagram.com/4cats.camera/",
    opening_hours: initialSettings?.opening_hours || "09:00 - 21:00 (Tất cả các ngày trong tuần)",
    copyright_text: initialSettings?.copyright_text || "© 2026 4cats.camera - Máy ảnh mới chính hãng cho người mới 🐱📸",
    locations: initialSettings?.locations || [],
    support_links: initialSettings?.support_links || [],
    // Shipping defaults
    free_shipping_threshold: 10000000,
    shipping_flat_fee: 50000,
    delivery_hanoi: "Giao hỏa tốc 2h hoặc trong ngày (Nội thành Hà Nội)",
    delivery_provinces: "1 - 3 ngày (Các tỉnh thành toàn quốc qua bưu chính)",
    // Warranty defaults
    warranty_default_months: 12,
    return_days: 7,
    warranty_terms: "Bảo hành 12 - 24 tháng chính hãng. Đổi mới 100% nguyên seal trong 7 ngày đầu nếu lỗi nhà sản xuất."
  }));

  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("store_settings")
        .upsert({ id: 1, ...settings });

      if (error) throw error;
      toast.success("Đã cập nhật toàn bộ cấu hình cửa hàng! ✨");
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi lưu cấu hình.");
    } finally {
      setIsSaving(false);
    }
  };

  const updatePhone = (index, value) => {
    const newPhones = [...(settings.contact_phones || [])];
    newPhones[index] = value;
    setSettings({ ...settings, contact_phones: newPhones });
  };

  const addPhone = () => {
    setSettings({
      ...settings,
      contact_phones: [...(settings.contact_phones || []), ""],
    });
  };

  const removePhone = (index) => {
    setSettings({
      ...settings,
      contact_phones: settings.contact_phones.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6 pb-20 font-sans max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-primary flex items-center gap-2">
            Cấu Hình Hệ Thống Cửa Hàng ⚙️
          </h1>
          <p className="text-muted-foreground text-xs mt-0.5">
            Tập trung toàn bộ giá trị thương hiệu, vận chuyển, bảo hành và kênh liên lạc tại một nơi
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-xl text-xs font-bold h-9 shadow-xs"
        >
          <Save className="w-3.5 h-3.5 mr-1.5" />
          {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 h-auto p-1.5 bg-white border rounded-2xl gap-1">
          <TabsTrigger value="general" className="rounded-xl font-bold text-xs py-2">
            <Store className="w-3.5 h-3.5 mr-1" /> Thương hiệu
          </TabsTrigger>
          <TabsTrigger value="shipping" className="rounded-xl font-bold text-xs py-2">
            <Truck className="w-3.5 h-3.5 mr-1" /> Vận chuyển
          </TabsTrigger>
          <TabsTrigger value="warranty" className="rounded-xl font-bold text-xs py-2">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Bảo hành
          </TabsTrigger>
          <TabsTrigger value="contact" className="rounded-xl font-bold text-xs py-2">
            <Share2 className="w-3.5 h-3.5 mr-1" /> Kênh liên hệ
          </TabsTrigger>
          <TabsTrigger value="shopping" className="rounded-xl font-bold text-xs py-2">
            <Boxes className="w-3.5 h-3.5 mr-1" /> Tồn kho & Mua
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: THƯƠNG HIỆU (GENERAL) */}
        <TabsContent value="general" className="mt-4 space-y-4">
          <Card className="rounded-3xl border shadow-xs bg-white overflow-hidden">
            <CardHeader className="bg-muted/10 pb-4 border-b">
              <CardTitle className="text-sm font-black flex items-center gap-2">
                <Store className="w-4 h-4 text-primary" /> Thông tin thương hiệu 4cats
              </CardTitle>
              <CardDescription className="text-xs">
                Tên cửa hàng, câu định vị, email nhận thông báo mua hàng
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Tên thương hiệu</Label>
                  <Input
                    value={settings.brand_name}
                    onChange={(e) => setSettings({ ...settings, brand_name: e.target.value })}
                    className="h-9 text-xs rounded-xl font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-bold">Email nhận thông báo đơn hàng (Store Staff)</Label>
                  <Input
                    value={settings.contact_email}
                    onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                    className="h-9 text-xs rounded-xl font-mono"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Mặc định gửi email thông báo đơn đến: fourcatscamera@gmail.com
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Mô tả ngắn thương hiệu</Label>
                <Textarea
                  value={settings.brand_description}
                  onChange={(e) => setSettings({ ...settings, brand_description: e.target.value })}
                  rows={3}
                  className="text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Bản quyền chân trang (Copyright)</Label>
                <Input
                  value={settings.copyright_text}
                  onChange={(e) => setSettings({ ...settings, copyright_text: e.target.value })}
                  className="h-9 text-xs rounded-xl"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: VẬN CHUYỂN (SHIPPING) */}
        <TabsContent value="shipping" className="mt-4 space-y-4">
          <Card className="rounded-3xl border shadow-xs bg-white overflow-hidden">
            <CardHeader className="bg-muted/10 pb-4 border-b">
              <CardTitle className="text-sm font-black flex items-center gap-2">
                <Truck className="w-4 h-4 text-primary" /> Chính sách vận chuyển & Phí ship
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Mức miễn phí vận chuyển (VNĐ)</Label>
                  <Input
                    type="number"
                    value={settings.free_shipping_threshold}
                    onChange={(e) => setSettings({ ...settings, free_shipping_threshold: Number(e.target.value) })}
                    className="h-9 text-xs rounded-xl font-bold text-primary"
                  />
                  <p className="text-[10px] text-muted-foreground">Đơn từ 10.000.000đ được miễn phí giao hàng toàn quốc</p>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-bold">Phí ship đồng giá dưới ngưỡng (VNĐ)</Label>
                  <Input
                    type="number"
                    value={settings.shipping_flat_fee}
                    onChange={(e) => setSettings({ ...settings, shipping_flat_fee: Number(e.target.value) })}
                    className="h-9 text-xs rounded-xl font-bold text-foreground"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Thời gian giao hàng Hà Nội</Label>
                <Input
                  value={settings.delivery_hanoi}
                  onChange={(e) => setSettings({ ...settings, delivery_hanoi: e.target.value })}
                  className="h-9 text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Thời gian giao hàng các tỉnh</Label>
                <Input
                  value={settings.delivery_provinces}
                  onChange={(e) => setSettings({ ...settings, delivery_provinces: e.target.value })}
                  className="h-9 text-xs rounded-xl"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: BẢO HÀNH (WARRANTY) */}
        <TabsContent value="warranty" className="mt-4 space-y-4">
          <Card className="rounded-3xl border shadow-xs bg-white overflow-hidden">
            <CardHeader className="bg-muted/10 pb-4 border-b">
              <CardTitle className="text-sm font-black flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" /> Cam kết chính hãng & Đổi trả
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Thời hạn bảo hành mặc định (Tháng)</Label>
                  <Input
                    type="number"
                    value={settings.warranty_default_months}
                    onChange={(e) => setSettings({ ...settings, warranty_default_months: Number(e.target.value) })}
                    className="h-9 text-xs rounded-xl font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-bold">Thời hạn 1 đổi 1 máy mới (Ngày)</Label>
                  <Input
                    type="number"
                    value={settings.return_days}
                    onChange={(e) => setSettings({ ...settings, return_days: Number(e.target.value) })}
                    className="h-9 text-xs rounded-xl font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Nội dung cam kết hiển thị tại trang sản phẩm</Label>
                <Textarea
                  value={settings.warranty_terms}
                  onChange={(e) => setSettings({ ...settings, warranty_terms: e.target.value })}
                  rows={3}
                  className="text-xs rounded-xl"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: KÊNH LIÊN HỆ (CONTACT) */}
        <TabsContent value="contact" className="mt-4 space-y-4">
          <Card className="rounded-3xl border shadow-xs bg-white overflow-hidden">
            <CardHeader className="bg-muted/10 pb-4 border-b">
              <CardTitle className="text-sm font-black flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" /> Hotline, Mạng xã hội & Hỗ trợ
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4 text-xs">
              {/* Phone Numbers */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold">Số điện thoại hotline</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addPhone}
                    className="h-7 text-xs text-primary font-bold"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Thêm số
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {settings.contact_phones?.map((phone, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input
                        value={phone}
                        onChange={(e) => updatePhone(idx, e.target.value)}
                        className="h-9 text-xs rounded-xl"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removePhone(idx)}
                        className="h-9 w-9 text-destructive hover:bg-destructive/10 rounded-xl"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Channels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t">
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Link Fanpage Facebook</Label>
                  <Input
                    value={settings.facebook_url}
                    onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                    className="h-9 text-xs rounded-xl font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-bold">Link Instagram</Label>
                  <Input
                    value={settings.instagram_url}
                    onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                    className="h-9 text-xs rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Giờ mở cửa toàn hệ thống</Label>
                <Input
                  value={settings.opening_hours}
                  onChange={(e) => setSettings({ ...settings, opening_hours: e.target.value })}
                  className="h-9 text-xs rounded-xl"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 5: TỒN KHO & HÀNH VI MUA (SHOPPING) */}
        <TabsContent value="shopping" className="mt-4 space-y-4">
          <Card className="rounded-3xl border shadow-xs bg-white overflow-hidden">
            <CardHeader className="bg-muted/10 pb-4 border-b">
              <CardTitle className="text-sm font-black flex items-center gap-2">
                <Boxes className="w-4 h-4 text-primary" /> Hành vi giỏ hàng & Hết hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-secondary/15 border flex items-center justify-between">
                <div>
                  <p className="font-bold text-foreground">Tự động chuyển nút sang &quot;Liên hệ&quot; khi hết hàng</p>
                  <p className="text-muted-foreground text-[11px] mt-0.5">
                    Khi tổng tồn kho SKU = 0, khách bấm nút sẽ hiện pop-up dẫn sang Zalo, Fanpage hoặc Instagram để đặt hàng riêng
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="p-4 rounded-2xl bg-secondary/15 border flex items-center justify-between">
                <div>
                  <p className="font-bold text-foreground">Hiển thị số lượng tồn theo từng cơ sở (Cầu Giấy, Thanh Xuân)</p>
                  <p className="text-muted-foreground text-[11px] mt-0.5">
                    Cho phép khách biết cơ sở nào còn sẵn máy để ghé xem trải nghiệm trực tiếp
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

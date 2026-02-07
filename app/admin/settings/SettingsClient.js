"use client";

import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/card";
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
  Copyright,
  Share2,
} from "lucide-react";

export default function SettingsClient({ initialSettings }) {
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("store_settings")
        .upsert({ id: 1, ...settings });

      if (error) throw error;
      toast.success("Đã cập nhật cấu hình cửa hàng! ✨");
    } catch (error) {
      console.error(error);
      toast.error("Không thể lưu thay đổi. Vùi lòng kiểm tra lại DB.");
    } finally {
      setIsSaving(false);
    }
  };

  const updateLocation = (index, field, value) => {
    const newLocations = [...settings.locations];
    newLocations[index][field] = value;
    setSettings({ ...settings, locations: newLocations });
  };

  const addLocation = () => {
    setSettings({
      ...settings,
      locations: [...settings.locations, { name: "", address: "" }],
    });
  };

  const removeLocation = (index) => {
    setSettings({
      ...settings,
      locations: settings.locations.filter((_, i) => i !== index),
    });
  };

  const addLocationLink = (locIndex) => {
    const newLocations = [...settings.locations];
    if (!newLocations[locIndex].social_links) {
      newLocations[locIndex].social_links = [];
    }
    newLocations[locIndex].social_links.push({
      platform: "Facebook",
      url: "",
      label: "",
    });
    setSettings({ ...settings, locations: newLocations });
  };

  const removeLocationLink = (locIndex, linkIndex) => {
    const newLocations = [...settings.locations];
    newLocations[locIndex].social_links = newLocations[
      locIndex
    ].social_links.filter((_, i) => i !== linkIndex);
    setSettings({ ...settings, locations: newLocations });
  };

  const updateLocationLink = (locIndex, linkIndex, field, value) => {
    const newLocations = [...settings.locations];
    newLocations[locIndex].social_links[linkIndex][field] = value;
    setSettings({ ...settings, locations: newLocations });
  };

  const updateSupportLink = (index, field, value) => {
    const newLinks = [...settings.support_links];
    newLinks[index][field] = value;
    setSettings({ ...settings, support_links: newLinks });
  };

  const addSupportLink = () => {
    setSettings({
      ...settings,
      support_links: [
        ...settings.support_links,
        { label: "", href: "#", is_social: false },
      ],
    });
  };

  const addSocialLink = () => {
    setSettings({
      ...settings,
      support_links: [
        ...settings.support_links,
        { label: "", href: "#", is_social: true, platform: "Facebook" },
      ],
    });
  };

  const removeSupportLink = (index) => {
    setSettings({
      ...settings,
      support_links: settings.support_links.filter((_, i) => i !== index),
    });
  };

  const updatePhone = (index, value) => {
    const newPhones = [...settings.contact_phones];
    newPhones[index] = value;
    setSettings({ ...settings, contact_phones: newPhones });
  };

  const addPhone = () => {
    setSettings({
      ...settings,
      contact_phones: [...settings.contact_phones, ""],
    });
  };

  const removePhone = (index) => {
    setSettings({
      ...settings,
      contact_phones: settings.contact_phones.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-primary">
            Cấu hình cửa hàng
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý thông tin footer và liên hệ
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="sticker shadow-lg"
        >
          {isSaving ? (
            "Đang lưu..."
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" /> Lưu thay đổi
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Brand Info */}
        <Card className="rounded-4xl border-none shadow-xl bg-white/50 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-primary/5 pb-6">
            <CardTitle className="flex items-center gap-2">
              <Store className="w-5 h-5 text-primary" /> Thông tin thương hiệu
            </CardTitle>
            <CardDescription>
              Tên và mô tả xuất hiện ở đầu footer
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label>Tên thương hiệu</Label>
              <Input
                value={settings.brand_name}
                onChange={(e) =>
                  setSettings({ ...settings, brand_name: e.target.value })
                }
                className="rounded-xl border-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label>Mô tả ngắn</Label>
              <textarea
                className="w-full min-h-[100px] p-3 rounded-xl border border-primary/20 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={settings.brand_description}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    brand_description: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <LinkIcon className="w-3 h-3" /> Facebook URL
                </Label>
                <Input
                  value={settings.facebook_url}
                  onChange={(e) =>
                    setSettings({ ...settings, facebook_url: e.target.value })
                  }
                  className="rounded-xl border-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <LinkIcon className="w-3 h-3" /> Instagram URL
                </Label>
                <Input
                  value={settings.instagram_url}
                  onChange={(e) =>
                    setSettings({ ...settings, instagram_url: e.target.value })
                  }
                  className="rounded-xl border-primary/20"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="rounded-4xl border-none shadow-xl bg-white/50 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-secondary/20 pb-6">
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-secondary-foreground" /> Thông tin
              liên hệ
            </CardTitle>
            <CardDescription>Email, hotline và giờ mở cửa</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label>Email liên hệ</Label>
              <Input
                value={settings.contact_email}
                onChange={(e) =>
                  setSettings({ ...settings, contact_email: e.target.value })
                }
                className="rounded-xl border-primary/20"
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Số điện thoại / Hotline</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={addPhone}
                  className="h-8 text-primary font-bold"
                >
                  <Plus className="w-4 h-4 mr-1" /> Thêm số
                </Button>
              </div>
              {settings.contact_phones?.map((phone, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    value={phone}
                    onChange={(e) => updatePhone(idx, e.target.value)}
                    className="rounded-xl border-primary/20"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removePhone(idx)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock className="w-3 h-3" /> Giờ mở cửa
                </Label>
                <Input
                  value={settings.opening_hours}
                  onChange={(e) =>
                    setSettings({ ...settings, opening_hours: e.target.value })
                  }
                  className="rounded-xl border-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Copyright className="w-3 h-3" /> Bản quyền (Copyright)
                </Label>
                <Input
                  value={settings.copyright_text}
                  onChange={(e) =>
                    setSettings({ ...settings, copyright_text: e.target.value })
                  }
                  className="rounded-xl border-primary/20"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Locations */}
        <Card className="rounded-4xl border-none shadow-xl bg-white/50 backdrop-blur-sm overflow-hidden lg:col-span-2">
          <CardHeader className="bg-green-50/50 pb-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" /> Hệ thống cửa
                  hàng
                </CardTitle>
                <CardDescription>
                  Quản lý danh sách các cơ sở offline
                </CardDescription>
              </div>
              <Button
                onClick={addLocation}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white rounded-full"
              >
                <Plus className="w-4 h-4 mr-1" /> Thêm cơ sở
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {settings.locations?.map((loc, idx) => (
              <div
                key={idx}
                className="relative p-6 rounded-2xl border-2 border-green-100 bg-green-50/20 group"
              >
                <button
                  onClick={() => removeLocation(idx)}
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase font-black text-green-600">
                      Tên cơ sở (Ví dụ: Cơ sở 1 - Cầu Giấy)
                    </Label>
                    <Input
                      value={loc.name}
                      onChange={(e) =>
                        updateLocation(idx, "name", e.target.value)
                      }
                      className="rounded-xl border-green-200 focus-visible:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase font-black text-green-600">
                      Địa chỉ cụ thể
                    </Label>
                    <Input
                      value={loc.address}
                      onChange={(e) =>
                        updateLocation(idx, "address", e.target.value)
                      }
                      className="rounded-xl border-green-200 focus-visible:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase font-black text-green-600">
                      Google Maps Embed URL
                    </Label>
                    <Input
                      value={loc.iframe_url || ""}
                      onChange={(e) =>
                        updateLocation(idx, "iframe_url", e.target.value)
                      }
                      placeholder="https://www.google.com/maps/embed?..."
                      className="rounded-xl border-green-200 focus-visible:ring-green-500 font-mono text-xs"
                    />
                    <p className="text-[10px] text-muted-foreground italic">
                      Copy link trong thuộc tính src="..." của thẻ iframe Google
                      Maps
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-green-100">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-black text-green-600">
                        Hotline riêng
                      </Label>
                      <Input
                        value={loc.phone || ""}
                        onChange={(e) =>
                          updateLocation(idx, "phone", e.target.value)
                        }
                        className="rounded-xl border-green-200 text-xs"
                        placeholder="09xx..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-black text-green-600">
                        Email riêng
                      </Label>
                      <Input
                        value={loc.email || ""}
                        onChange={(e) =>
                          updateLocation(idx, "email", e.target.value)
                        }
                        className="rounded-xl border-green-200 text-xs"
                        placeholder="vidu@gmail.com"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-green-100">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs uppercase font-black text-green-600">
                        Liên kết Mạng xã hội & Khác
                      </Label>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => addLocationLink(idx)}
                        className="h-6 text-xs gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <Plus className="w-3 h-3" /> Thêm
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {loc.social_links?.map((link, linkIdx) => (
                        <div key={linkIdx} className="flex gap-2 items-center">
                          <select
                            className="h-8 rounded-lg border border-green-200 text-xs bg-white px-2 focus:outline-none focus:ring-1 focus:ring-green-500 w-24 shrink-0"
                            value={link.platform}
                            onChange={(e) =>
                              updateLocationLink(
                                idx,
                                linkIdx,
                                "platform",
                                e.target.value,
                              )
                            }
                          >
                            <option value="Facebook">Facebook</option>
                            <option value="Zalo">Zalo</option>
                            <option value="Instagram">Instagram</option>
                            <option value="TikTok">TikTok</option>
                            <option value="Threads">Threads</option>
                            <option value="Other">Khác</option>
                          </select>
                          <Input
                            placeholder="Nhãn (VD: Fanpage)"
                            value={link.label}
                            onChange={(e) =>
                              updateLocationLink(
                                idx,
                                linkIdx,
                                "label",
                                e.target.value,
                              )
                            }
                            className="h-8 text-xs rounded-lg border-green-200 w-28 shrink-0"
                          />
                          <Input
                            placeholder="URL..."
                            value={link.url}
                            onChange={(e) =>
                              updateLocationLink(
                                idx,
                                linkIdx,
                                "url",
                                e.target.value,
                              )
                            }
                            className="h-8 text-xs rounded-lg border-green-200 grow"
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive hover:bg-red-50 rounded-full shrink-0"
                            onClick={() => removeLocationLink(idx, linkIdx)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                      {(!loc.social_links || loc.social_links.length === 0) && (
                        <p className="text-[10px] text-muted-foreground italic text-center py-2 bg-green-50/30 rounded-lg border border-dashed border-green-100">
                          Chưa có liên kết nào. Nhấn "Thêm" để tạo mới.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Support Links */}
        <Card className="rounded-4xl border-none shadow-xl bg-white/50 backdrop-blur-sm overflow-hidden lg:col-span-2">
          <CardHeader className="bg-blue-50/50 pb-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-blue-600" /> Hỗ trợ khách
                  hàng
                </CardTitle>
                <CardDescription>
                  Các liên kết chính sách và hướng dẫn (Footer)
                </CardDescription>
              </div>
              <Button
                onClick={addSupportLink}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
              >
                <Plus className="w-4 h-4 mr-1" /> Thêm liên kết
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {settings.support_links?.map((link, idx) => {
                if (link.is_social) return null;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-blue-100 bg-blue-50/20 space-y-3 relative group"
                  >
                    <button
                      onClick={() => removeSupportLink(idx)}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold text-blue-400">
                        NHÃN (LABEL)
                      </Label>
                      <Input
                        value={link.label}
                        onChange={(e) =>
                          updateSupportLink(idx, "label", e.target.value)
                        }
                        className="h-8 rounded-lg border-blue-100 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold text-blue-400">
                        ĐƯỜNG DẪN (HREF)
                      </Label>
                      <Input
                        value={link.href}
                        onChange={(e) =>
                          updateSupportLink(idx, "href", e.target.value)
                        }
                        className="h-8 rounded-lg border-blue-100 text-xs"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card className="rounded-4xl border-none shadow-xl bg-white/50 backdrop-blur-sm overflow-hidden lg:col-span-2">
          <CardHeader className="bg-pink-50/50 pb-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-pink-600" /> Mạng xã hội &
                  Liên hệ
                </CardTitle>
                <CardDescription>
                  Các kênh liên kết trên trang Liên hệ (IG, Zalo, TikTok...)
                </CardDescription>
              </div>
              <Button
                onClick={addSocialLink}
                size="sm"
                className="bg-pink-600 hover:bg-pink-700 text-white rounded-full"
              >
                <Plus className="w-4 h-4 mr-1" /> Thêm kênh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {settings.support_links?.map((link, idx) => {
                if (!link.is_social) return null;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border-2 border-pink-100 bg-pink-50/20 space-y-4 relative group"
                  >
                    <button
                      onClick={() => removeSupportLink(idx)}
                      className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-[10px] font-bold text-pink-400">
                          NỀN TẢNG
                        </Label>
                        <select
                          value={link.platform || "Facebook"}
                          onChange={(e) =>
                            updateSupportLink(idx, "platform", e.target.value)
                          }
                          className="w-full h-9 px-3 rounded-xl border border-pink-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                        >
                          <option value="Facebook">Facebook</option>
                          <option value="Instagram">Instagram</option>
                          <option value="Zalo">Zalo</option>
                          <option value="TikTok">TikTok</option>
                          <option value="Threads">Threads</option>
                          <option value="Other">Khác</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-bold text-pink-400">
                          TÊN HIỂN THỊ
                        </Label>
                        <Input
                          value={link.label}
                          onChange={(e) =>
                            updateSupportLink(idx, "label", e.target.value)
                          }
                          className="h-9 rounded-xl border-pink-200 text-xs"
                          placeholder="VD: @4cats.camera"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold text-pink-400">
                        LINK / URL
                      </Label>
                      <Input
                        value={link.href}
                        onChange={(e) =>
                          updateSupportLink(idx, "href", e.target.value)
                        }
                        className="h-9 rounded-xl border-pink-200 text-xs"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function X({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

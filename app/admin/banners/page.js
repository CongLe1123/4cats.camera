"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Loader2, Plus, Trash2, Pencil } from "lucide-react";

export default function BannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    image: "",
    title: "",
    description: "",
    cta_text: "",
    link: "",
    display_order: 0,
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) console.error(error);
    else setBanners(data || []);
    setLoading(false);
  };

  const handleSave = async () => {
    if (editingBanner) {
      const { error } = await supabase
        .from("banners")
        .update(formData)
        .eq("id", editingBanner.id);
      if (error) alert("Error updating banner: " + error.message);
    } else {
      const { error } = await supabase.from("banners").insert([formData]);
      if (error) alert("Error creating banner: " + error.message);
    }
    setOpen(false);
    setEditingBanner(null);
    setFormData({
      image: "",
      title: "",
      description: "",
      cta_text: "",
      link: "",
      display_order: 0,
    });
    fetchBanners();
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    const { error } = await supabase.from("banners").delete().eq("id", id);
    if (error) alert("Error deleting: " + error.message);
    else fetchBanners();
  };

  const openEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      image: banner.image,
      title: banner.title || "",
      description: banner.description || "",
      cta_text: banner.cta_text || "",
      link: banner.link || "",
      display_order: banner.display_order || 0,
    });
    setOpen(true);
  };

  const openNew = () => {
    setEditingBanner(null);
    setFormData({
      image: "",
      title: "",
      description: "",
      cta_text: "",
      link: "",
      display_order: banners.length,
    });
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-primary">Carousel Banners</h1>
        <Button onClick={openNew}>
          <Plus className="w-4 h-4 mr-2" /> Add Banner
        </Button>
      </div>

      {loading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((banner) => (
            <Card key={banner.id} className="overflow-hidden group">
              <div className="aspect-video relative bg-muted">
                {banner.image && (
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => openEdit(banner)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleDelete(banner.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg">{banner.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {banner.description}
                </p>
                <div className="mt-2 text-xs flex gap-2">
                  <span className="bg-primary/10 px-2 py-1 rounded text-primary font-mono">
                    Order: {banner.display_order}
                  </span>
                  <span className="bg-secondary px-2 py-1 rounded font-mono">
                    Link: {banner.link}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingBanner ? "Edit Banner" : "New Banner"}
            </DialogTitle>
            <DialogDescription>
              Configure the banner details for the homepage carousel.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Banner Title"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Short description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>CTA Text</Label>
                <Input
                  value={formData.cta_text}
                  onChange={(e) =>
                    setFormData({ ...formData, cta_text: e.target.value })
                  }
                  placeholder="e.g. Shop Now"
                />
              </div>
              <div className="space-y-2">
                <Label>Link URL</Label>
                <Input
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                  placeholder="/shop/..."
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Display Order</Label>
              <Input
                type="number"
                value={formData.display_order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    display_order: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>Save Banner</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table"; // Assuming I have table or I will fallback to divs
import { Card, CardContent } from "../../../components/ui/card";
import { Loader2, Plus, Search, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

export default function CamerasPage() {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    let isCancelled = false;
    async function loadCameras() {
      const { data, error } = await supabase
        .from("cameras")
        .select(
          `
          id, name, image,
          brand:brands(name),
          category:categories(name)
        `,
        )
        .order("created_at", { ascending: false });

      if (!isCancelled) {
        if (error) console.error(error);
        else setCameras(data || []);
        setLoading(false);
      }
    }

    loadCameras();
    return () => {
      isCancelled = true;
    };
  }, [refreshIndex]);

  const handleDelete = async (id) => {
    if (typeof window !== "undefined" && !window.confirm("Bạn có chắc chắn muốn xóa máy ảnh này và các biến thể liên quan không?")) {
      return;
    }
    const { error } = await supabase.from("cameras").delete().eq("id", id);
    if (error) {
      console.error("Error deleting:", error);
    } else {
      setRefreshIndex((prev) => prev + 1);
    }
  };

  const filtered = cameras.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-primary">Cameras</h1>
        <Link href="/admin/cameras/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" /> New Camera
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search cameras..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((camera) => (
            <Card key={camera.id} className="overflow-hidden">
              <div className="flex items-center p-4 gap-4">
                <img
                  src={camera.image || "/placeholder.png"}
                  alt={camera.name}
                  className="w-16 h-16 object-cover rounded-md bg-muted"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{camera.name}</h3>
                  <div className="text-sm text-muted-foreground flex gap-3">
                    <span className="bg-secondary/20 px-2 py-0.5 rounded">
                      {camera.brand?.name}
                    </span>
                    <span className="bg-secondary/20 px-2 py-0.5 rounded">
                      {camera.category?.name}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/cameras/${camera.id}`}>
                      <Pencil className="w-4 h-4 mr-2" /> Edit
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(camera.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

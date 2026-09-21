import { supabase } from "./supabase.js";
import { getAllModels, STORE_POLICIES } from "./productData.js";

// Helper: Remove Vietnamese tones for search
export function removeVietnameseTones(str) {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

// Convert model from productData into Admin Product format
function mapProductModelToAdmin(m) {
  const variants = (m.variants || []).map((v, idx) => ({
    id: v.id || `var-${idx}-${Date.now()}`,
    sku: v.sku || `${m.model_name.toUpperCase().replace(/\s+/g, "")}-${idx + 1}`,
    color: v.color || "Standard",
    color_label: v.color_label || v.color || "Tiêu chuẩn",
    color_hex: v.color_hex || "#1F2937",
    kit_type: v.kit_type || "Body only",
    kit_label: v.kit_label || "Thân máy (Body only)",
    included_lens: v.included_lens || "",
    price: Number(v.price) || 0,
    compare_at_price: v.compare_at_price ? Number(v.compare_at_price) : null,
    stock_quantity: Number(v.stock_quantity) || 0,
    branch_stock: v.branch_stock || { "Cầu Giấy": 0, "Thanh Xuân": 0 },
    warranty: v.warranty || "12 tháng chính hãng",
    is_in_stock: v.is_in_stock !== false,
    weight_grams: v.weight_grams || 400,
    status: "active"
  }));

  const totalStock = variants.reduce((sum, v) => sum + (Number(v.stock_quantity) || 0), 0);
  const minPrice = variants.length > 0 ? Math.min(...variants.map((v) => v.price)) : 0;

  return {
    id: m.id,
    name: `${m.brand} ${m.model_name}`,
    model_name: m.model_name,
    brand: m.brand,
    series: m.series || "",
    camera_type: m.camera_type || "Mirrorless",
    slug: m.slug,
    image: m.main_image || m.image || "/favicon.ico",
    images: m.official_images || (m.image ? [m.image] : []),
    short_description: m.short_description || "",
    beginner_summary: m.beginner_summary || "",
    strengths: m.strengths || [],
    limitations: m.limitations || [],
    use_cases: m.use_cases || [],
    characteristics: m.characteristics || [],
    technical_specs: m.technical_specs || {},
    search_aliases: m.search_aliases || [m.model_name.toLowerCase()],
    compatible_accessories: m.compatible_accessories || [],
    variants,
    totalStock,
    minPrice,
    status: "published",
    is_published: true,
    is_featured: !!m.is_featured,
    featured_section: m.is_featured ? "featured" : "",
    featured_order: m.featured_order || 0,
    seo_title: m.seo_title || `${m.brand} ${m.model_name} Chính Hãng — 4cats Camera`,
    seo_description: m.seo_description || m.short_description || "",
    updated_at: new Date().toISOString()
  };
}

// Convert Supabase Camera Record into Unified Admin Product
function mapSupabaseToAdmin(cam) {
  const specs = cam.specs || {};
  const variants = Array.isArray(specs.variants) && specs.variants.length > 0
    ? specs.variants
    : (cam.camera_variants || []).map((cv, idx) => ({
        id: cv.id,
        sku: cv.sku || `SKU-${cam.id}-${idx + 1}`,
        color: cv.color || cv.colors?.name || "Standard",
        color_label: cv.color_label || cv.colors?.name || "Tiêu chuẩn",
        color_hex: cv.color_hex || "#1F2937",
        kit_type: cv.kit_type || "Body only",
        kit_label: cv.kit_label || "Thân máy (Body only)",
        included_lens: cv.included_lens || "",
        price: Number(cv.price) || 0,
        compare_at_price: cv.compare_at_price ? Number(cv.compare_at_price) : null,
        stock_quantity: cv.stock_quantity !== undefined ? Number(cv.stock_quantity) : (cv.in_stock ? 5 : 0),
        branch_stock: cv.branch_stock || { "Cầu Giấy": cv.in_stock ? 3 : 0, "Thanh Xuân": cv.in_stock ? 2 : 0 },
        warranty: cv.warranty || "12 tháng chính hãng",
        is_in_stock: cv.in_stock !== false,
        status: "active"
      }));

  const totalStock = variants.reduce((sum, v) => sum + (Number(v.stock_quantity) || 0), 0);
  const minPrice = variants.length > 0 ? Math.min(...variants.map((v) => v.price).filter(p => p > 0)) : 0;

  return {
    id: cam.id,
    name: cam.name,
    model_name: specs.model_name || cam.name,
    brand: cam.brand?.name || specs.brand || "Canon",
    brand_id: cam.brand_id,
    series: cam.series?.name || specs.series || "",
    series_id: cam.series_id,
    camera_type: cam.category?.name || specs.camera_type || "Mirrorless",
    category_id: cam.category_id,
    slug: cam.slug || specs.slug || `camera-${cam.id}`,
    image: cam.image || specs.main_image || "/favicon.ico",
    images: cam.images || specs.images || [],
    short_description: specs.short_description || "",
    beginner_summary: specs.beginner_summary || "",
    strengths: specs.strengths || [],
    limitations: specs.limitations || [],
    use_cases: specs.use_cases || (cam.features || []),
    technical_specs: specs.technical_specs || {},
    search_aliases: specs.search_aliases || [],
    compatible_accessories: specs.compatible_accessories || [],
    content: cam.content || [],
    variants,
    totalStock,
    minPrice: minPrice === Infinity ? 0 : minPrice,
    status: specs.status || "published",
    is_published: specs.is_published !== false,
    is_featured: !!specs.is_featured,
    featured_section: specs.featured_section || "",
    featured_order: specs.featured_order || 0,
    seo_title: specs.seo_title || `${cam.name} Chính Hãng — 4cats Camera`,
    seo_description: specs.seo_description || "",
    updated_at: cam.created_at || new Date().toISOString()
  };
}

// ----------------------------------------------------------------------
// 1. PRODUCTS & CATALOG
// ----------------------------------------------------------------------

export async function adminGetProducts(filters = {}) {
  let products = [];

  try {
    const { data: dbCameras, error } = await supabase
      .from("cameras")
      .select(`
        id, name, image, images, content, features, specs, created_at,
        brand:brands(id, name),
        category:categories(id, name),
        series:series(id, name),
        camera_variants(*)
      `)
      .order("id", { ascending: false });

    if (!error && dbCameras && dbCameras.length > 0) {
      products = dbCameras.map(mapSupabaseToAdmin);
    } else {
      // Use structured genuine models
      const models = getAllModels();
      products = models.map(mapProductModelToAdmin);
    }
  } catch (err) {
    console.warn("adminGetProducts fallback:", err);
    const models = getAllModels();
    products = models.map(mapProductModelToAdmin);
  }

  // Apply filters
  if (filters.search && filters.search.trim()) {
    const qNorm = removeVietnameseTones(filters.search);
    products = products.filter((p) => {
      const matchText = removeVietnameseTones(`${p.name} ${p.brand} ${p.camera_type} ${p.slug} ${(p.variants || []).map(v => v.sku).join(" ")}`);
      return matchText.includes(qNorm);
    });
  }

  if (filters.brand && filters.brand !== "All") {
    products = products.filter((p) => p.brand?.toLowerCase() === filters.brand.toLowerCase());
  }

  if (filters.category && filters.category !== "All") {
    products = products.filter((p) => p.camera_type?.toLowerCase() === filters.category.toLowerCase());
  }

  if (filters.stockStatus && filters.stockStatus !== "All") {
    if (filters.stockStatus === "in_stock") {
      products = products.filter((p) => p.totalStock > 0);
    } else if (filters.stockStatus === "out_of_stock") {
      products = products.filter((p) => p.totalStock === 0);
    } else if (filters.stockStatus === "low_stock") {
      products = products.filter((p) => p.totalStock > 0 && p.totalStock <= 3);
    }
  }

  if (filters.publishStatus && filters.publishStatus !== "All") {
    products = products.filter((p) => p.status === filters.publishStatus);
  }

  if (filters.featuredOnly) {
    products = products.filter((p) => p.is_featured);
  }

  return products;
}

export async function adminGetProductById(id) {
  if (!id) return null;
  const strId = String(id).trim();

  // 1. Try Supabase
  const numId = parseInt(strId, 10);
  if (!isNaN(numId)) {
    try {
      const { data, error } = await supabase
        .from("cameras")
        .select(`
          id, name, image, images, content, features, specs, created_at,
          brand:brands(id, name),
          category:categories(id, name),
          series:series(id, name),
          camera_variants(*)
        `)
        .eq("id", numId)
        .single();

      if (!error && data) {
        return mapSupabaseToAdmin(data);
      }
    } catch (e) {
      console.warn("adminGetProductById supabase error:", e);
    }
  }

  // 2. Fallback to productData
  const models = getAllModels();
  const found = models.find((m) => String(m.id) === strId || m.slug === strId);
  if (found) {
    return mapProductModelToAdmin(found);
  }

  return null;
}

export async function adminSaveProduct(product) {
  if (!product.name || !product.name.trim()) {
    throw new Error("Vui lòng nhập tên máy ảnh.");
  }
  if (!product.slug || !product.slug.trim()) {
    throw new Error("Vui lòng nhập đường dẫn (Slug) cho sản phẩm.");
  }

  const variants = product.variants || [];
  if (variants.length === 0) {
    throw new Error("Sản phẩm phải có ít nhất 1 phiên bản/màu sắc (Variant/SKU).");
  }

  for (const v of variants) {
    if (!v.sku || !v.sku.trim()) {
      throw new Error("Mỗi biến thể cần có mã SKU hợp lệ.");
    }
    if (v.price < 0) {
      throw new Error("Giá bán phải lớn hơn hoặc bằng 0.");
    }
  }

  // Compute total stock & update in_stock
  const enrichedVariants = variants.map((v) => {
    const cauGiay = Number(v.branch_stock?.["Cầu Giấy"] ?? 0);
    const thanhXuan = Number(v.branch_stock?.["Thanh Xuân"] ?? 0);
    const qty = v.stock_quantity !== undefined ? Number(v.stock_quantity) : cauGiay + thanhXuan;
    return {
      ...v,
      stock_quantity: qty,
      branch_stock: { "Cầu Giấy": cauGiay, "Thanh Xuân": thanhXuan },
      is_in_stock: qty > 0
    };
  });

  const specsPayload = {
    model_name: product.model_name || product.name,
    brand: product.brand,
    series: product.series,
    camera_type: product.camera_type,
    slug: product.slug.toLowerCase().trim(),
    short_description: product.short_description || "",
    beginner_summary: product.beginner_summary || "",
    strengths: product.strengths || [],
    limitations: product.limitations || [],
    use_cases: product.use_cases || [],
    technical_specs: product.technical_specs || {},
    search_aliases: product.search_aliases || [],
    compatible_accessories: product.compatible_accessories || [],
    variants: enrichedVariants,
    status: product.status || "published",
    is_published: product.status === "published",
    is_featured: !!product.is_featured,
    featured_section: product.featured_section || "featured",
    featured_order: Number(product.featured_order) || 0,
    seo_title: product.seo_title || `${product.name} Chính Hãng — 4cats Camera`,
    seo_description: product.seo_description || product.short_description || "",
    updated_at: new Date().toISOString()
  };

  const dbPayload = {
    name: product.name,
    image: product.image,
    images: product.images || [],
    content: product.content || [],
    features: product.use_cases || [],
    specs: specsPayload
  };

  if (product.brand_id) dbPayload.brand_id = product.brand_id;
  if (product.category_id) dbPayload.category_id = product.category_id;
  if (product.series_id) dbPayload.series_id = product.series_id;

  let savedId = product.id;
  const isNew = !product.id || String(product.id) === "new";

  if (isNew) {
    const safeIntId = Date.now() * 1000 + Math.floor(Math.random() * 1000);
    const { data, error } = await supabase
      .from("cameras")
      .insert([{ ...dbPayload, id: safeIntId }])
      .select("id")
      .single();

    if (error) throw new Error(error.message);
    savedId = data?.id || safeIntId;
  } else {
    const { error } = await supabase
      .from("cameras")
      .update(dbPayload)
      .eq("id", product.id);

    if (error) throw new Error(error.message);
  }

  // Also maintain camera_variants table records for backward compatibility
  try {
    await supabase.from("camera_variants").delete().eq("camera_id", savedId);
    const variantRows = enrichedVariants.map((v) => ({
      camera_id: savedId,
      price: v.price,
      in_stock: v.is_in_stock
    }));
    if (variantRows.length > 0) {
      await supabase.from("camera_variants").insert(variantRows);
    }
  } catch (e) {
    console.warn("Syncing camera_variants notice:", e);
  }

  return { id: savedId, success: true };
}

export async function adminDeleteProduct(id) {
  const { error } = await supabase.from("cameras").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return true;
}

export async function adminDuplicateProduct(id) {
  const original = await adminGetProductById(id);
  if (!original) throw new Error("Không tìm thấy sản phẩm để nhân bản.");

  const randomSuffix = Math.floor(100 + Math.random() * 900);
  const newSlug = `${original.slug}-copy-${randomSuffix}`;
  const newVariants = (original.variants || []).map((v, i) => ({
    ...v,
    id: `var-copy-${Date.now()}-${i}`,
    sku: `${v.sku}-COPY-${randomSuffix}`,
    stock_quantity: 0,
    branch_stock: { "Cầu Giấy": 0, "Thanh Xuân": 0 },
    is_in_stock: false
  }));

  const duplicated = {
    ...original,
    id: "new",
    name: `${original.name} (Bản sao)`,
    slug: newSlug,
    variants: newVariants,
    status: "draft",
    is_published: false
  };

  return await adminSaveProduct(duplicated);
}

export async function adminBulkUpdate(action, productIds, extraValue) {
  if (!productIds || productIds.length === 0) return true;

  for (const id of productIds) {
    const prod = await adminGetProductById(id);
    if (!prod) continue;

    if (action === "publish") {
      prod.status = "published";
      prod.is_published = true;
    } else if (action === "unpublish") {
      prod.status = "draft";
      prod.is_published = false;
    } else if (action === "archive") {
      prod.status = "archived";
      prod.is_published = false;
    } else if (action === "set_featured") {
      prod.is_featured = true;
    } else if (action === "remove_featured") {
      prod.is_featured = false;
    } else if (action === "assign_brand" && extraValue) {
      prod.brand = extraValue;
    } else if (action === "assign_category" && extraValue) {
      prod.camera_type = extraValue;
    }

    await adminSaveProduct(prod);
  }

  return true;
}

// ----------------------------------------------------------------------
// 2. INVENTORY & STOCK
// ----------------------------------------------------------------------

export async function adminGetInventory() {
  const products = await adminGetProducts();
  const skuList = [];

  for (const p of products) {
    for (const v of p.variants || []) {
      skuList.push({
        productId: p.id,
        productName: p.name,
        productSlug: p.slug,
        productImage: p.image,
        brand: p.brand,
        variantId: v.id,
        sku: v.sku,
        color: v.color_label || v.color,
        kit: v.kit_label || v.kit_type,
        price: v.price,
        compare_at_price: v.compare_at_price,
        cauGiayStock: Number(v.branch_stock?.["Cầu Giấy"] || 0),
        thanhXuanStock: Number(v.branch_stock?.["Thanh Xuân"] || 0),
        totalStock: Number(v.stock_quantity || 0),
        isInStock: v.is_in_stock
      });
    }
  }

  return skuList;
}

export async function adminUpdateSkuStock(productId, sku, branchStockUpdate, reason = "Cập nhật thủ công") {
  const product = await adminGetProductById(productId);
  if (!product) throw new Error("Không tìm thấy máy ảnh.");

  const vIdx = product.variants.findIndex((v) => v.sku === sku);
  if (vIdx === -1) throw new Error(`Không tìm thấy biến thể với SKU ${sku}`);

  const variant = product.variants[vIdx];
  const oldBranchStock = variant.branch_stock || { "Cầu Giấy": 0, "Thanh Xuân": 0 };
  const newBranchStock = { ...oldBranchStock, ...branchStockUpdate };

  const newTotal = Object.values(newBranchStock).reduce((sum, n) => sum + (Number(n) || 0), 0);
  variant.branch_stock = newBranchStock;
  variant.stock_quantity = newTotal;
  variant.is_in_stock = newTotal > 0;

  product.variants[vIdx] = variant;
  await adminSaveProduct(product);

  // Log movement if stock_movements table exists
  try {
    for (const [branch, newQty] of Object.entries(branchStockUpdate)) {
      const oldQty = oldBranchStock[branch] || 0;
      const diff = Number(newQty) - Number(oldQty);
      if (diff !== 0) {
        await supabase.from("stock_movements").insert([{
          sku,
          camera_id: product.id,
          branch_name: branch,
          quantity_change: diff,
          quantity_after: Number(newQty),
          reason
        }]);
      }
    }
  } catch (e) {
    console.warn("Stock movement logging notice:", e);
  }

  return true;
}

// ----------------------------------------------------------------------
// 3. HOMEPAGE & PROMOTION CAROUSEL
// ----------------------------------------------------------------------

export async function adminGetBanners() {
  try {
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .order("display_order", { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map((b) => {
        // Calculate status from start/end dates
        const now = new Date();
        let status = b.status || (b.is_active !== false ? "active" : "draft");
        if (b.start_at && new Date(b.start_at) > now) status = "scheduled";
        if (b.end_at && new Date(b.end_at) < now) status = "expired";

        return {
          ...b,
          calculatedStatus: status
        };
      });
    }
  } catch (e) {
    console.warn("adminGetBanners DB error:", e);
  }

  // Fallback initial banners
  return [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
      mobile_image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "ƯU ĐÃI CANON EOS R50",
      description: "Máy ảnh cho người mới & selfie đỉnh cao. Giảm ngay 1.500.000đ kèm quà tặng thẻ nhớ 64GB.",
      cta_text: "Xem ưu đãi ngay",
      link: "/may-anh/canon-eos-r50",
      display_order: 1,
      calculatedStatus: "active"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
      mobile_image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "SONY VLOG & CREATOR WEEK",
      description: "Bộ đôi Sony ZV-1 II & ZV-E10 II chính hãng. Quay video 4K siêu nét, thu âm trong trẻo.",
      cta_text: "Khám phá dòng ZV",
      link: "/shop?intent=Vlog",
      display_order: 2,
      calculatedStatus: "active"
    }
  ];
}

export async function adminSaveBanner(banner) {
  const payload = {
    image: banner.image,
    mobile_image: banner.mobile_image || banner.image,
    title: banner.title,
    description: banner.description || "",
    cta_text: banner.cta_text || "Mua ngay",
    link: banner.link || "/shop",
    display_order: Number(banner.display_order) || 0
  };

  if (banner.id) {
    const { error } = await supabase.from("banners").update(payload).eq("id", banner.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("banners").insert([payload]);
    if (error) throw error;
  }

  return true;
}

export async function adminDeleteBanner(id) {
  const { error } = await supabase.from("banners").delete().eq("id", id);
  if (error) throw error;
  return true;
}

// ----------------------------------------------------------------------
// 4. ORDERS & SALES
// ----------------------------------------------------------------------

export async function adminGetOrders() {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(`*, camera:cameras(id, name, image)`)
      .order("created_at", { ascending: false });

    if (!error && data) {
      return data;
    }
  } catch (e) {
    console.warn("adminGetOrders notice:", e);
  }
  return [];
}

export async function adminUpdateOrderStatus(id, newStatus, note = "") {
  const payload = { status: newStatus };
  if (note) payload.customer_message = note;

  const { error } = await supabase.from("orders").update(payload).eq("id", id);
  if (error) throw error;
  return true;
}

// ----------------------------------------------------------------------
// 5. SEED INITIAL CATALOG INTO SUPABASE
// ----------------------------------------------------------------------

export async function adminSeedInitialCatalog() {
  const models = getAllModels();
  let count = 0;

  for (const m of models) {
    const adminProd = mapProductModelToAdmin(m);
    await adminSaveProduct(adminProd);
    count++;
  }

  return { success: true, count };
}

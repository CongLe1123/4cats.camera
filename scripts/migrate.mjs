import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { cameras as rawCameras } from "../lib/data.js";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Cache for uploaded images to avoid re-uploading the same URL multiple times
const urlCache = new Map();

async function uploadImageToSupabase(url, filenamePrefix = "img") {
  if (!url || typeof url !== "string") return null;
  if (urlCache.has(url)) return urlCache.get(url);

  try {
    console.log(`Downloading ${url}...`);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}`);

    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    let ext = "jpg";
    if (url.includes(".png")) ext = "png";
    if (url.includes(".webp")) ext = "webp";

    const filename = `${filenamePrefix}-${timestamp}-${randomString}.${ext}`;
    const filePath = `${filename}`;

    console.log(`Uploading to Supabase Storage as ${filePath}...`);
    const { data, error } = await supabase.storage
      .from("products")
      .upload(filePath, buffer, {
        contentType: blob.type || "image/jpeg",
        upsert: true,
      });

    if (error) {
      console.error("Storage upload error:", error);
      return url;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("products").getPublicUrl(filePath);

    urlCache.set(url, publicUrl);
    return publicUrl;
  } catch (err) {
    console.error("Image processing failed:", err);
    return url;
  }
}

async function migrate() {
  console.log("Starting migration...");

  try {
    // 0. Process Images First
    console.log("Processing Images... this may take a while.");
    const processedCameras = [];

    for (const cam of rawCameras) {
      const newCam = { ...cam };
      if (newCam.image) {
        newCam.image = await uploadImageToSupabase(
          newCam.image,
          `cam-${newCam.id}-main`,
        );
      }
      if (newCam.images && newCam.images.length > 0) {
        newCam.images = await Promise.all(
          newCam.images.map((img, idx) =>
            uploadImageToSupabase(img, `cam-${newCam.id}-gallery-${idx}`),
          ),
        );
      }
      if (newCam.content) {
        newCam.content = await Promise.all(
          newCam.content.map(async (block) => {
            if (block.type === "image" && block.value) {
              const newUrl = await uploadImageToSupabase(
                block.value,
                `cam-${newCam.id}-content`,
              );
              return { ...block, value: newUrl };
            }
            return block;
          }),
        );
      }
      processedCameras.push(newCam);
    }
    const rawCamerasWithSupabaseImages = processedCameras;

    // 1. Brands
    console.log("Migrating Brands...");
    const uniqueBrands = [
      ...new Set(
        rawCamerasWithSupabaseImages.filter((c) => c.brand).map((c) => c.brand),
      ),
    ].map((name) => ({ name }));
    const { data: brands, error: brandsError } = await supabase
      .from("brands")
      .upsert(uniqueBrands, { onConflict: "name" })
      .select();
    if (brandsError) throw new Error(`Brands Error: ${brandsError.message}`);
    const brandMap = new Map(brands.map((b) => [b.name, b.id]));

    // 2. Categories
    console.log("Migrating Categories...");
    const uniqueCategories = [
      ...new Set(
        rawCamerasWithSupabaseImages
          .filter((c) => c.category)
          .map((c) => c.category),
      ),
    ].map((name) => ({ name }));
    const { data: categories, error: catsError } = await supabase
      .from("categories")
      .upsert(uniqueCategories, { onConflict: "name" })
      .select();
    if (catsError) throw new Error(`Categories Error: ${catsError.message}`);
    const categoryMap = new Map(categories.map((c) => [c.name, c.id]));

    // 3. Specialties
    console.log("Migrating Specialties...");
    const allSpecialties = rawCamerasWithSupabaseImages.flatMap(
      (c) => c.specialties || [],
    );
    const uniqueSpecialties = [...new Set(allSpecialties)].map((name) => ({
      name,
    }));
    const { data: specialties, error: specsError } = await supabase
      .from("specialties")
      .upsert(uniqueSpecialties, { onConflict: "name" })
      .select();
    if (specsError) throw new Error(`Specialties Error: ${specsError.message}`);
    const specialtyMap = new Map(specialties.map((s) => [s.name, s.id]));

    // 4. Conditions
    console.log("Migrating Conditions...");
    const allConditions = rawCamerasWithSupabaseImages.flatMap(
      (c) => c.availableConditions || [],
    );
    const uniqueConditions = [...new Set(allConditions)].map((name) => ({
      name,
    }));
    const { data: conditions, error: condsError } = await supabase
      .from("conditions")
      .upsert(uniqueConditions, { onConflict: "name" })
      .select();
    if (condsError) throw new Error(`Conditions Error: ${condsError.message}`);
    const conditionMap = new Map(conditions.map((c) => [c.name, c.id]));

    // 5. Colors
    console.log("Migrating Colors...");
    const allColors = rawCamerasWithSupabaseImages.flatMap(
      (c) => c.availableColors || [],
    );
    const uniqueColors = [...new Set(allColors)].map((name) => ({ name }));
    const { data: colors, error: colorsError } = await supabase
      .from("colors")
      .upsert(uniqueColors, { onConflict: "name" })
      .select();
    if (colorsError) throw new Error(`Colors Error: ${colorsError.message}`);
    const colorMap = new Map(colors.map((c) => [c.name, c.id]));

    // 6. Series
    console.log("Migrating Series...");
    const seriesToInsert = [];
    const processedSeries = new Set();

    for (const cam of rawCamerasWithSupabaseImages) {
      if (cam.series && cam.brand) {
        const key = `${cam.brand}-${cam.series}`;
        if (!processedSeries.has(key)) {
          seriesToInsert.push({
            name: cam.series,
            brand_id: brandMap.get(cam.brand),
          });
          processedSeries.add(key);
        }
      }
    }
    const { data: seriesData, error: seriesError } = await supabase
      .from("series")
      .upsert(seriesToInsert, { onConflict: "name, brand_id" })
      .select();
    if (seriesError) throw new Error(`Series Error: ${seriesError.message}`);
    const seriesMap = new Map(
      seriesData.map((s) => [`${s.brand_id}-${s.name}`, s.id]),
    );

    // 7. Cameras
    console.log("Migrating Cameras...");
    const camerasData = rawCamerasWithSupabaseImages.map((c) => {
      const brandId = brandMap.get(c.brand);
      return {
        id: c.id,
        name: c.name,
        brand_id: brandId,
        series_id: c.series ? seriesMap.get(`${brandId}-${c.series}`) : null,
        category_id: categoryMap.get(c.category),
        image: c.image,
        images: c.images,
        rental: c.rental,
        specs: c.specs,
        content: c.content,
        features: c.features,
      };
    });

    const { error: camsError } = await supabase
      .from("cameras")
      .upsert(camerasData, { onConflict: "id" });
    if (camsError) throw new Error(`Cameras Error: ${camsError.message}`);

    // 8. Camera Specialties
    console.log("Linking Specialties...");
    const camSpecialties = [];
    for (const c of rawCamerasWithSupabaseImages) {
      if (c.specialties) {
        for (const s of c.specialties) {
          camSpecialties.push({
            camera_id: c.id,
            specialty_id: specialtyMap.get(s),
          });
        }
      }
    }
    if (camSpecialties.length > 0) {
      const { error: csError } = await supabase
        .from("cameras_specialties")
        .upsert(camSpecialties, { ignoreDuplicates: true });
      if (csError)
        throw new Error(`Camera Specialties Error: ${csError.message}`);
    }

    // 9. Camera Variants
    console.log("Migrating Variants...");
    const cameraIds = rawCamerasWithSupabaseImages.map((c) => c.id);
    await supabase.from("camera_variants").delete().in("camera_id", cameraIds);

    const variantsToInsert = [];
    for (const c of rawCamerasWithSupabaseImages) {
      if (c.variants) {
        for (const v of c.variants) {
          variantsToInsert.push({
            camera_id: c.id,
            condition_id: conditionMap.get(v.condition),
            color_id: colorMap.get(v.color),
            price: v.price,
            in_stock: v.inStock,
          });
        }
      }
    }
    if (variantsToInsert.length > 0) {
      const { error: vError } = await supabase
        .from("camera_variants")
        .insert(variantsToInsert);
      if (vError) throw new Error(`Variants Error: ${vError.message}`);
    }

    // 10. Featured Cameras (Hot Trend)
    console.log("Migrating Featured Cameras...");
    // Mock data matching the original hardcoded ones
    const featuredItems = [
      {
        camera_id: 1, // Fujifilm X-T30 II
        label: "Hot Trend",
        description:
          "Dòng máy Mirrorless được yêu thích nhất với thiết kế hoài cổ.",
        features: ["Film Simulation", "Retro Design"],
        display_order: 1,
      },
      {
        camera_id: 3, // Sony ZV-1 II
        label: "Best Vlog",
        description: "Lựa chọn hàng đầu cho Vlogger và Content Creator.",
        features: ["4K Video", "Fast AF"],
        display_order: 2,
      },
      {
        camera_id: 2, // Canon EOS R50
        label: "Best Seller",
        description: "Màu da nịnh mắt, dễ sử dụng cho người mới bắt đầu.",
        features: ["Skin Tone", "Easy to use"],
        display_order: 3,
      },
    ];

    // Only insert if camera exists in the list (ids might differ if data.js changes, but here we assume 1,2,3 exist)
    const validFeaturedItems = featuredItems.filter((f) =>
      rawCamerasWithSupabaseImages.find((c) => c.id === f.camera_id),
    );

    if (validFeaturedItems.length > 0) {
      // Clear old ones first
      await supabase.from("featured_cameras").delete().neq("id", 0);

      const { error: featError } = await supabase
        .from("featured_cameras")
        .insert(validFeaturedItems);
      if (featError)
        throw new Error(`Featured Cameras Error: ${featError.message}`);
    }

    // 11. Banners
    console.log("Migrating Banners...");
    const banners = [
      {
        image:
          "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1600&auto=format&fit=crop",
        link: "/shop",
        display_order: 1,
      },
      {
        image:
          "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=1600&auto=format&fit=crop",
        link: "/shop",
        display_order: 2,
      },
      {
        image:
          "https://images.unsplash.com/photo-1552168324-d612d77725e3?q=80&w=1600&auto=format&fit=crop",
        link: "/order-camera",
        display_order: 3,
      },
    ];

    const processedBanners = [];
    for (const banner of banners) {
      const uploadedImage = await uploadImageToSupabase(
        banner.image,
        `banner-${banner.display_order}`,
      );
      processedBanners.push({ ...banner, image: uploadedImage });
    }

    // Clear old banners
    await supabase.from("banners").delete().neq("id", 0);

    const { error: bannerError } = await supabase
      .from("banners")
      .insert(processedBanners);

    if (bannerError) throw new Error(`Banners Error: ${bannerError.message}`);

    console.log("Migration Complete!");
  } catch (err) {
    console.error("Migration Failed:", err);
    process.exit(1);
  }
}

migrate();

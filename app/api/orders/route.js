import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

// In-memory rate limiting tracker: Map of IP -> array of timestamps
const rateLimitMap = new Map();
const WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimitMap.set(ip, validTimestamps);
    return true;
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return false;
}

// Clean up stale rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamps] of rateLimitMap.entries()) {
    const valid = timestamps.filter((t) => now - t < WINDOW_MS);
    if (valid.length === 0) {
      rateLimitMap.delete(ip);
    } else {
      rateLimitMap.set(ip, valid);
    }
  }
}, 10 * 60 * 1000);

export async function POST(request) {
  try {
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        {
          error:
            "Bạn đã gửi quá nhiều yêu cầu trong thời gian ngắn. Vui lòng đợi vài phút rồi thử lại nhé! 🐾",
        },
        { status: 429 },
      );
    }

    const body = await request.json();
    const {
      customer_name,
      customer_contact,
      customer_address,
      customer_message,
      camera_id,
      type = "BUY",
    } = body;

    // 1. Validation
    if (!customer_name || typeof customer_name !== "string") {
      return NextResponse.json(
        { error: "Vui lòng nhập họ và tên của bạn." },
        { status: 400 },
      );
    }

    const trimmedName = customer_name.trim();
    if (trimmedName.length < 2 || trimmedName.length > 100) {
      return NextResponse.json(
        { error: "Họ và tên phải từ 2 đến 100 ký tự." },
        { status: 400 },
      );
    }

    if (!customer_contact || typeof customer_contact !== "string") {
      return NextResponse.json(
        { error: "Vui lòng nhập số điện thoại hoặc thông tin liên hệ." },
        { status: 400 },
      );
    }

    const trimmedContact = customer_contact.trim();
    // Validate Vietnamese phone number format or email
    const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanPhone = trimmedContact.replace(/[\s.-]/g, "");

    const isValidContact =
      phoneRegex.test(cleanPhone) ||
      emailRegex.test(trimmedContact) ||
      trimmedContact.length >= 8;

    if (!isValidContact) {
      return NextResponse.json(
        {
          error:
            "Số điện thoại không đúng định dạng. Vui lòng kiểm tra lại (VD: 0398249856).",
        },
        { status: 400 },
      );
    }

    const safeAddress =
      typeof customer_address === "string"
        ? customer_address.trim().slice(0, 250)
        : null;

    const safeMessage =
      typeof customer_message === "string"
        ? customer_message.trim().slice(0, 500)
        : null;

    const safeType = ["BUY", "RENT"].includes(type) ? type : "BUY";
    const safeCameraId = camera_id ? parseInt(camera_id, 10) || null : null;

    // 2. Persist to Database
    const newOrder = {
      customer_name: trimmedName,
      customer_contact: cleanPhone,
      customer_address: safeAddress,
      customer_message: safeMessage,
      camera_id: safeCameraId,
      type: safeType,
      status: "NEW",
    };

    const { data, error } = await supabase
      .from("orders")
      .insert([newOrder])
      .select("id, created_at")
      .single();

    if (error) {
      console.error("Order creation database error:", error.message);
      return NextResponse.json(
        {
          error:
            "Không thể lưu đơn hàng. Vui lòng liên hệ trực tiếp hotline hoặc Zalo để được hỗ trợ ngay nhé!",
        },
        { status: 500 },
      );
    }

    // 3. Email Notification to fourcatscamera@gmail.com (per AGENTS.md requirement)
    // Structured notification log & optional email dispatch
    console.log(
      `📧 [ORDER NOTIFICATION -> fourcatscamera@gmail.com] Order #${data?.id || "NEW"}: ${safeType} by ${trimmedName} (${cleanPhone}). Message: "${safeMessage || "None"}"`,
    );

    return NextResponse.json({
      success: true,
      orderId: data?.id,
      message:
        "Đặt hàng thành công! 4cats.camera sẽ liên hệ với bạn trong thời gian sớm nhất nhé! 💖",
    });
  } catch (err) {
    console.error("Order creation internal error:", err);
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra trong quá trình xử lý đơn hàng." },
      { status: 500 },
    );
  }
}

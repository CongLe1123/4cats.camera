/**
 * File upload validation and security utilities
 */

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

export const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
export const MAX_VIDEO_SIZE_BYTES = 30 * 1024 * 1024; // 30MB

/**
 * Validates whether an uploaded file is safe and allowable.
 * Returns { valid: true } or { valid: false, error: string }
 */
export function validateUploadFile(file, expectedType = "image") {
  if (!file) {
    return { valid: false, error: "Vui lòng chọn tập tin." };
  }

  const isImage = expectedType === "image";
  const isVideo = expectedType === "video";

  if (isImage) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: `Định dạng ảnh không hợp lệ (${file.type || "không xác định"}). Chỉ chấp nhận JPG, PNG, WEBP.`,
      };
    }
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      return {
        valid: false,
        error: `Dung lượng ảnh vượt quá 5MB (${(file.size / (1024 * 1024)).toFixed(1)}MB). Vui lòng chọn ảnh nhỏ hơn.`,
      };
    }
  } else if (isVideo) {
    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: `Định dạng video không hợp lệ (${file.type || "không xác định"}). Chỉ chấp nhận MP4 hoặc WebM.`,
      };
    }
    if (file.size > MAX_VIDEO_SIZE_BYTES) {
      return {
        valid: false,
        error: `Dung lượng video vượt quá 30MB (${(file.size / (1024 * 1024)).toFixed(1)}MB).`,
      };
    }
  }

  return { valid: true };
}

/**
 * Generates a clean, randomized, safe filename to prevent path traversal or active script execution.
 */
export function generateSafeFileName(originalName, prefix = "file") {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const rawExt = (originalName.split(".").pop() || "").toLowerCase();
  
  // Whitelist extensions
  const safeExtMap = {
    jpg: "jpg",
    jpeg: "jpg",
    png: "png",
    webp: "webp",
    mp4: "mp4",
    webm: "webm",
    mov: "mp4",
  };
  const ext = safeExtMap[rawExt] || "jpg";

  return `${prefix}-${timestamp}-${random}.${ext}`;
}

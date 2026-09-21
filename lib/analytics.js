// ==============================================================================
// 4cats Camera — Privacy-Conscious E-commerce Event Analytics
// ==============================================================================

export const ANALYTICS_EVENTS = {
  SHOP_VIEW: "shop_view",
  SEARCH: "search",
  SEARCH_NO_RESULTS: "search_no_results",
  FILTER_USED: "filter_used",
  SORT_USED: "sort_used",
  PRODUCT_MODEL_VIEW: "product_model_view",
  INVENTORY_UNIT_SELECTED: "inventory_unit_selected",
  GALLERY_OPENED: "gallery_opened",
  DEFECT_PHOTO_VIEWED: "defect_photo_viewed",
  TEST_VIDEO_CLICKED: "test_video_clicked",
  CONTACT_CLICKED: "contact_clicked",
  RESERVATION_STARTED: "reservation_started",
  RESERVATION_COMPLETED: "reservation_completed",
  COMPARE_VIEWED: "compare_viewed",
  QUIZ_COMPLETED: "quiz_completed",
  SHIPPING_INFO_OPENED: "shipping_info_opened",
  WARRANTY_INFO_OPENED: "warranty_info_opened"
};

export function trackEvent(eventName, properties = {}) {
  if (typeof window === "undefined") return;

  const eventPayload = {
    event: eventName,
    timestamp: new Date().toISOString(),
    path: window.location.pathname,
    ...properties
  };

  // 1. Log in dev console
  if (process.env.NODE_ENV !== "production") {
    console.log(`📊 [4cats Analytics] ${eventName}`, eventPayload);
  }

  // 2. Dispatch custom DOM event for custom listeners
  try {
    const customEvent = new CustomEvent("4cats_event", { detail: eventPayload });
    window.dispatchEvent(customEvent);
  } catch {}

  // 3. Forward to GTM / dataLayer if installed
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push(eventPayload);
  }
}

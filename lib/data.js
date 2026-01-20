export const cameras = [
  {
    id: 1,
    name: "Fujifilm X-T30 II",
    brand: "Fujifilm",
    series: "X-Series",
    category: "Mirrorless",
    image:
      "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?q=80&w=500&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516961642265-531546e84af2?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520390138845-fd2d229dd553?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513635269975-5906d4b99d65?q=80&w=800&auto=format&fit=crop",
    ],
    features: ["Aesthetic", "Beginner Friendly", "Film Simulation"],
    specialties: ["WiFi", "Bluetooth", "Touch Screen"],
    availableConditions: ["Like New", "99%", "95%"],
    availableColors: ["Silver", "Black"],
    variants: [
      {
        condition: "Like New",
        color: "Silver",
        price: 19500000,
        inStock: true,
      },
      { condition: "Like New", color: "Black", price: 19200000, inStock: true },
      { condition: "99%", color: "Silver", price: 18500000, inStock: true },
      { condition: "99%", color: "Black", price: 18300000, inStock: true },
      { condition: "95%", color: "Silver", price: 17000000, inStock: false },
      { condition: "95%", color: "Black", price: 16800000, inStock: true },
    ],
    content: [
      {
        type: "text",
        value:
          "Chiếc máy ảnh quốc dân với thiết kế hoài cổ tuyệt đẹp. Tích hợp sẵn các giả lập màu film trứ danh của Fujifilm, giúp bạn chụp ảnh đẹp ngay (JPEG) mà không cần chỉnh sửa nhiều. Phù hợp cho cả người mới bắt đầu và những ai yêu thích sự gọn nhẹ.",
      },
      {
        type: "image",
        value:
          "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?q=80&w=800&auto=format&fit=crop",
        caption: "Thiết kế vintage sang trọng",
      },
      {
        type: "text",
        value:
          "Hệ thống lấy nét nhanh nhạy cùng màn hình cảm ứng xoay lật linh hoạt giúp bạn bắt trọn mọi khoảnh khắc trong cuộc sống hàng ngày hay những chuyến du lịch xa.",
      },
      {
        type: "video",
        value: "https://www.w3schools.com/html/mov_bbb.mp4",
        caption: "Clip review thực tế khả năng lấy nét",
      },
    ],
  },
  {
    id: 2,
    name: "Canon EOS R50",
    brand: "Canon",
    series: "EOS R",
    category: "Mirrorless",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=500&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1495707902641-75cac588d2e9?q=80&w=800&auto=format&fit=crop",
    ],
    features: ["Compact", "Vlogging", "4K Video"],
    specialties: ["WiFi", "Bluetooth", "Flip Screen"],
    availableConditions: ["Mới 100%", "99%"],
    availableColors: ["Black", "White"],
    variants: [
      { condition: "Mới 100%", color: "Black", price: 15200000, inStock: true },
      { condition: "Mới 100%", color: "White", price: 15500000, inStock: true },
      { condition: "99%", color: "Black", price: 13800000, inStock: true },
      { condition: "99%", color: "White", price: 14100000, inStock: false },
    ],
    content: [
      {
        type: "text",
        value:
          "Dòng máy Mirrorless nhỏ gọn nhất của Canon, cực kỳ phù hợp cho các bạn nữ hoặc người làm Vlog. Khả năng lấy nét tự động siêu nhanh và màn hình xoay lật tiện lợi.",
      },
      {
        type: "image",
        value:
          "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop",
        caption: "Kích thước siêu gọn nhẹ trong lòng bàn tay",
      },
      {
        type: "text",
        value:
          "Với cảm biến APS-C 24.2MP và bộ xử lý hình ảnh DIGIC X, R50 mang lại chất lượng hình ảnh xuất sắc ngay cả trong điều kiện thiếu sáng.",
      },
      {
        type: "video",
        value: "https://www.w3schools.com/html/mov_bbb.mp4",
        caption: "Trải nghiệm quay Film 4K sắc nét",
      },
    ],
  },
  {
    id: 3,
    name: "Sony ZV-1 II",
    brand: "Sony",
    series: "ZV",
    category: "Compact",
    image:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=500&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop",
    ],
    features: ["Selfie", "Lightweight", "Vlogging"],
    specialties: ["WiFi", "Touch Screen", "Face Tracking"],
    availableConditions: ["Like New", "95%"],
    availableColors: ["Black", "White"],
    variants: [
      { condition: "Like New", color: "Black", price: 12500000, inStock: true },
      {
        condition: "Like New",
        color: "White",
        price: 12800000,
        inStock: false,
      },
      { condition: "95%", color: "Black", price: 11200000, inStock: true },
      { condition: "95%", color: "White", price: 11500000, inStock: true },
    ],
    content: [
      {
        type: "text",
        value:
          "Ông vua của dòng máy compact vlogging. Mic thu âm chất lượng cao, chế độ làm đẹp da tự nhiên và tiêu cự rộng giúp bạn dễ dàng ghi lại mọi khoảnh khắc.",
      },
      {
        type: "image",
        value:
          "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=800&auto=format&fit=crop",
        caption: "Ống kính góc rộng lý tưởng cho Selfie",
      },
      {
        type: "video",
        value: "https://www.w3schools.com/html/mov_bbb.mp4",
        caption: "Test Micro thu âm tích hợp chuyên dụng",
      },
    ],
  },
  {
    id: 4,
    name: "Sony A6400",
    brand: "Sony",
    series: "Alpha 6000",
    category: "Mirrorless",
    image:
      "https://images.unsplash.com/photo-1516961642265-531546e84af2?q=80&w=500&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1516961642265-531546e84af2?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520390138845-fd2d229dd553?q=80&w=800&auto=format&fit=crop",
    ],
    features: ["Reliable AF", "4K Video", "Compact"],
    specialties: ["WiFi", "Touch Screen", "Face Tracking"],
    availableConditions: ["Like New", "99%"],
    availableColors: ["Black", "Silver"],
    variants: [
      { condition: "Like New", color: "Black", price: 14500000, inStock: true },
      {
        condition: "Like New",
        color: "Silver",
        price: 14800000,
        inStock: true,
      },
      { condition: "99%", color: "Black", price: 13500000, inStock: false },
    ],
    content: [
      {
        type: "text",
        value:
          "Sony A6400 là chiếc máy ảnh mirrorless tầm trung tuyệt vời dành cho cả chụp ảnh và quay phim. Với hệ thống lấy nét tự động vào mắt theo thời gian thực (Real-time Eye AF) hàng đầu thế giới.",
      },
      {
        type: "image",
        value:
          "https://images.unsplash.com/photo-1516961642265-531546e84af2?q=80&w=800&auto=format&fit=crop",
        caption: "Lấy nét siêu nhanh 0.02 giây",
      },
      {
        type: "text",
        value:
          "Màn hình cảm ứng lật 180 độ hoàn hảo cho vlogger và chụp ảnh selfie, cùng khả năng quay phim 4K không gộp điểm ảnh.",
      },
    ],
  },
];

// ==============================================================================
// 4cats Camera — Modern New-Camera Storefront Data Layer
// Source of truth: 100% Genuine, Brand New Cameras with Official Warranty
// ==============================================================================

export const STORE_POLICIES = {
  brandName: "4cats.camera 🐱📸",
  tagline: "Cửa hàng máy ảnh mới chính hãng dành cho người mới và creator",
  warranty: {
    title: "Bảo hành chính hãng 12 – 24 tháng",
    inspection: "Hàng mới 100% nguyên seal fullbox, kiểm tra kích hoạt bảo hành điện tử chính hãng",
    defaultMonths: 12,
    returnDays: 7,
    returnPolicy: "Trong 7 ngày đầu tiên, nếu sản phẩm có lỗi kỹ thuật từ nhà sản xuất: Đổi ngay máy mới nguyên seal 100% hoặc hoàn tiền 100%",
    conditions: [
      "Sản phẩm còn nguyên hộp, đầy đủ phụ kiện, tem và phiếu bảo hành",
      "Thân máy và ống kính không bị trầy xước, cấn móp hoặc có dấu hiệu vào nước",
      "Số serial/IMEI trùng khớp với phiếu bảo hành và hệ thống"
    ]
  },
  shipping: {
    freeThreshold: 10000000, // 10 million VND
    flatFee: 50000,
    freeText: "Miễn phí giao hàng toàn quốc cho đơn từ 10.000.000đ",
    flatText: "Đồng giá ship 50.000đ toàn quốc cho đơn dưới 10.000.000đ",
    deliveryTimeHanoi: "Giao hỏa tốc 2h hoặc trong ngày (Nội thành Hà Nội)",
    deliveryTimeProvinces: "1 - 3 ngày (Các tỉnh thành toàn quốc qua bưu chính)",
    cod: "Hỗ trợ thanh toán khi nhận hàng (COD có cọc phí ship)",
    paymentMethods: [
      "Chuyển khoản ngân hàng (Vietcombank / Techcombank)",
      "Ví điện tử MoMo / VNPAY-QR",
      "Thanh toán tiền mặt hoặc quẹt thẻ tại cửa hàng",
      "Hỗ trợ trả góp 0% qua thẻ tín dụng"
    ]
  },
  branches: [
    {
      id: 1,
      name: "Cơ sở 1 - Cầu Giấy",
      shortName: "Cầu Giấy",
      address: "Số 6A2, ngõ 158 Nguyễn Khánh Toàn, Quan Hoa, Cầu Giấy, Hà Nội",
      phone: "039 824 9856",
      zalo: "https://zalo.me/0398249856",
      facebook: "https://www.facebook.com/profile.php?id=100093056073018",
      openingHours: "09:00 - 21:00 (Tất cả các ngày trong tuần)"
    },
    {
      id: 2,
      name: "Cơ sở 2 - Thanh Xuân",
      shortName: "Thanh Xuân",
      address: "Số 51 Nguyễn Trãi, Ngã tư Sở, Thanh Xuân, Hà Nội",
      phone: "093 235 68 69",
      zalo: "https://zalo.me/0932356869",
      facebook: "https://www.facebook.com/profile.php?id=100093056073018",
      openingHours: "09:00 - 21:00 (Tất cả các ngày trong tuần)"
    }
  ]
};

export const PRODUCT_MODELS = [
  {
    id: 2,
    slug: "canon-eos-r50",
    brand: "Canon",
    model_name: "EOS R50",
    series: "EOS R",
    camera_type: "Mirrorless",
    sensor_type: "APS-C CMOS",
    sensor_size: "22.3 x 14.9 mm",
    megapixels: "24.2 MP",
    lens_mount: "Canon RF",
    compatible_native_mounts: ["Canon RF", "Canon RF-S"],
    compatible_adapter_mounts: ["Canon EF", "Canon EF-S (qua ngàm chuyển EF-EOS R)"],
    lens_ecosystem_note: "Dùng trực tiếp tất cả lens RF và RF-S. Dùng được toàn bộ kho lens Canon EF/EF-S huyền thoại chỉ cần ngàm chuyển EF-EOS R.",
    video_capabilities: "4K 30p (oversampled từ 6K, không crop), Full HD 120p slow-motion",
    screen_type: "Cảm ứng xoay lật đa góc 180° (Vari-angle Touchscreen)",
    weight: "375g (Thân máy kèm pin và thẻ nhớ)",
    weight_interpretation: "Rất nhỏ nhẹ, đeo cổ cả ngày không mỏi, bỏ vừa túi vải hoặc balo mini.",
    ibis: false,
    ibis_note: "Chống rung điện tử Movie Digital IS và chống rung quang học IS trên ống kính.",
    viewfinder: "Kính ngắm điện tử OLED EVF 2.36 triệu điểm ảnh sắc nét",
    built_in_flash: true,
    flash_note: "Có đèn flash cóc tích hợp sẵn trên thân máy, rất tiện khi chụp tiệc tối hoặc sinh nhật.",
    wifi: true,
    bluetooth: true,
    connectivity_note: "Kết nối không dây với iPhone / Android qua app Canon Camera Connect. Bắn ảnh sang điện thoại trong 30 giây.",
    mic_input: true,
    release_year: 2023,
    is_featured: true,
    featured_order: 1,
    is_new_arrival: false,
    main_image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop",
    official_images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1495707902641-75cac588d2e9?q=80&w=1000&auto=format&fit=crop"
    ],
    short_description: "Canon EOS R50 là chiếc máy ảnh mirrorless nhỏ gọn bán chạy nhất hệ EOS R của Canon. Lấy nét Dual Pixel AF II nhận diện mắt cực nhạy và tông màu da hồng hào nịnh mắt trứ danh.",
    beginner_summary: "Lựa chọn số 1 cho bạn trẻ và người mới bắt đầu: chụp chân dung, selfie du lịch, quay TikTok/Vlog cực kỳ đơn giản.",
    strengths: [
      "Màu ảnh chụp người (da trắng hồng nịnh mắt), chụp JPEG đẹp ngay không cần chỉnh sửa hậu kỳ.",
      "Hệ thống lấy nét Dual Pixel AF II tự động bám nét mắt người, thú cưng và xe cộ siêu nhanh.",
      "Màn hình cảm ứng xoay lật 180° linh hoạt, selfie hoặc quay vlog dễ dàng.",
      "Kích thước siêu nhẹ chỉ 375g, cầm tay cả ngày không mỏi.",
      "Quay video 4K sắc nét không bị crop khung hình, có tích hợp đèn flash cóc."
    ],
    limitations: [
      "Thân máy không có chống rung cảm biến cơ học (IBIS), nên ưu tiên dùng lens có chống rung IS khi chụp thiếu sáng.",
      "Thời lượng pin khoảng 370 shot, bạn nên trang bị thêm 1 pin dự phòng khi đi du lịch cả ngày."
    ],
    use_cases: ["Người mới", "Selfie", "Chụp người", "Vlog", "Du lịch"],
    skill_levels: ["Người mới bắt đầu", "Sáng tạo nội dung"],
    characteristics: ["Nhỏ nhẹ", "Màu da đẹp", "Lấy nét nhanh", "Màn xoay lật", "Có Flash"],
    technical_specs: {
      "Cảm biến (Sensor)": "APS-C CMOS 24.2 Megapixels mới",
      "Bộ xử lý hình ảnh": "DIGIC X thế hệ mới",
      "Hệ thống lấy nét": "Dual Pixel CMOS AF II (651 vùng nét, nhận diện mắt & mặt)",
      "Độ nhạy sáng (ISO)": "100 - 32.000 (Mở rộng lên đến 51.200)",
      "Tốc độ màn trập": "1/4000s đến 30s, chụp liên tiếp 15 fps",
      "Quay Video": "4K 30p UHD (Oversampled từ 6K, không crop), Full HD 120p",
      "Màn hình LCD": "3.0 inch cảm ứng xoay lật đa hướng 1.04 triệu điểm ảnh",
      "Kính ngắm EVF": "OLED 0.39 inch 2.36 triệu điểm ảnh",
      "Đèn flash": "Flash cóc tích hợp sẵn (Guide Number 6)",
      "Cổng kết nối": "USB Type-C (hỗ trợ sạc), Micro HDMI, Mic 3.5mm",
      "Pin sử dụng": "LP-E17 chính hãng"
    },
    sample_images: [
      {
        url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
        title: "Chụp chân dung ngoại cảnh da hồng hào",
        lens: "RF-S 18-45mm F4.5-6.3 IS STM",
        settings: "45mm · f/6.3 · 1/250s · ISO 200"
      },
      {
        url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop",
        title: "Tone da nịnh mắt trong quán cafe",
        lens: "RF 50mm F1.8 STM",
        settings: "50mm · f/1.8 · 1/160s · ISO 400"
      }
    ],
    seo_title: "Canon EOS R50 Chính Hãng — Máy Ảnh Mirrorless Cho Người Mới & Selfie",
    seo_description: "Mua máy ảnh Canon EOS R50 mới 100% chính hãng tại 4cats Camera. Lấy nét mắt Dual Pixel AF II, màn hình xoay lật 180°, bảo hành chính hãng 12 tháng, freeship.",
    variants: [
      {
        id: "r50-body-white",
        sku: "R50-BODY-WHT",
        color: "White",
        color_label: "Trắng Ngọc Trai",
        color_hex: "#F8F9FA",
        kit_type: "Body only",
        kit_label: "Thân máy (Body only)",
        included_lens: null,
        configuration_note: "Chưa kèm ống kính. Bạn cần có thêm ống kính ngàm Canon RF/RF-S để chụp.",
        price: 14990000,
        compare_at_price: 16490000,
        stock_quantity: 6,
        branch_stock: { "Cầu Giấy": 4, "Thanh Xuân": 2 },
        warranty: "12 tháng chính hãng Canon Lê Bảo Minh",
        is_in_stock: true
      },
      {
        id: "r50-body-black",
        sku: "R50-BODY-BLK",
        color: "Black",
        color_label: "Đen Cổ Điển",
        color_hex: "#1F2937",
        kit_type: "Body only",
        kit_label: "Thân máy (Body only)",
        included_lens: null,
        configuration_note: "Chưa kèm ống kính. Bạn cần có thêm ống kính ngàm Canon RF/RF-S để chụp.",
        price: 14990000,
        compare_at_price: 16490000,
        stock_quantity: 8,
        branch_stock: { "Cầu Giấy": 5, "Thanh Xuân": 3 },
        warranty: "12 tháng chính hãng Canon Lê Bảo Minh",
        is_in_stock: true
      },
      {
        id: "r50-kit-white",
        sku: "R50-KIT-WHT",
        color: "White",
        color_label: "Trắng Ngọc Trai",
        color_hex: "#F8F9FA",
        kit_type: "Kit 18-45mm",
        kit_label: "Kèm Lens Kit 18-45mm IS STM",
        included_lens: "Canon RF-S 18-45mm F4.5-6.3 IS STM",
        configuration_note: "Đã bao gồm ống kính zoom tiêu chuẩn, mua về lắp thẻ nhớ chụp ảnh ngay!",
        price: 17490000,
        compare_at_price: 18990000,
        stock_quantity: 10,
        branch_stock: { "Cầu Giấy": 6, "Thanh Xuân": 4 },
        warranty: "12 tháng chính hãng Canon Lê Bảo Minh",
        is_in_stock: true
      },
      {
        id: "r50-kit-black",
        sku: "R50-KIT-BLK",
        color: "Black",
        color_label: "Đen Cổ Điển",
        color_hex: "#1F2937",
        kit_type: "Kit 18-45mm",
        kit_label: "Kèm Lens Kit 18-45mm IS STM",
        included_lens: "Canon RF-S 18-45mm F4.5-6.3 IS STM",
        configuration_note: "Đã bao gồm ống kính zoom tiêu chuẩn, mua về lắp thẻ nhớ chụp ảnh ngay!",
        price: 17490000,
        compare_at_price: 18990000,
        stock_quantity: 7,
        branch_stock: { "Cầu Giấy": 4, "Thanh Xuân": 3 },
        warranty: "12 tháng chính hãng Canon Lê Bảo Minh",
        is_in_stock: true
      }
    ]
  },
  {
    id: 1,
    slug: "fujifilm-x-t30-ii",
    brand: "Fujifilm",
    model_name: "X-T30 II",
    series: "X-Series",
    camera_type: "Mirrorless",
    sensor_type: "APS-C X-Trans CMOS 4",
    sensor_size: "23.5 x 15.6 mm",
    megapixels: "26.1 MP",
    lens_mount: "Fujifilm X",
    compatible_native_mounts: ["Fujifilm X"],
    compatible_adapter_mounts: ["M42", "Leica M", "Canon EF (qua ngàm chuyển thông minh Fringer)"],
    lens_ecosystem_note: "Hệ lens ngàm X cực kỳ đồ sộ từ Fujifilm, Sigma, Tamron, Viltrox với nhiều lens khẩu lớn giá rẻ.",
    video_capabilities: "4K 30p DCI/UHD, Full HD 240p siêu chậm, F-Log 10-bit",
    screen_type: "Màn hình cảm ứng lật 2 chiều (Tilt LCD)",
    weight: "378g (Thân máy kèm pin và thẻ nhớ)",
    weight_interpretation: "Thiết kế hoài cổ retro cực đẹp, đeo như phụ kiện thời trang OOTD.",
    ibis: false,
    ibis_note: "Không có chống rung trong body. Bù lại máy giữ được thiết kế siêu mỏng nhẹ cổ điển.",
    viewfinder: "Kính ngắm điện tử OLED 2.36 triệu điểm ngắm giữa cổ điển",
    built_in_flash: true,
    flash_note: "Có gạt mở đèn flash cóc tiện dụng giấu gọn trên đỉnh máy.",
    wifi: true,
    bluetooth: true,
    connectivity_note: "Kết nối app Fujifilm XApp bắn ảnh film sang điện thoại nhanh chóng.",
    mic_input: true,
    release_year: 2021,
    is_featured: true,
    featured_order: 2,
    is_new_arrival: false,
    main_image: "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?q=80&w=800&auto=format&fit=crop",
    official_images: [
      "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516961642265-531546e84af2?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520390138845-fd2d229dd553?q=80&w=1000&auto=format&fit=crop"
    ],
    short_description: "Chiếc máy ảnh quốc dân với thiết kế hoài cổ vintage tuyệt đẹp. Tích hợp 18 giả lập màu film trứ danh của Fujifilm (Classic Chrome, Classic Neg...), chụp xong là có ảnh màu film thơ mộng.",
    beginner_summary: "Hoàn hảo cho bạn yêu thích phong cách ảnh film nghệ thuật, chụp cafe, đường phố, du lịch và thời trang sống ảo.",
    strengths: [
      "18 công thức giả lập màu film độc quyền, ảnh chụp ra có chất thơ hoài niệm đặc trưng.",
      "Thiết kế cơ học retro với các bánh răng kim loại xoay chỉnh tốc độ, bù sáng đầy cảm hứng.",
      "Cảm biến X-Trans CMOS 4 26.1MP cao cấp tương tự máy ảnh chuyên nghiệp X-T4.",
      "Lấy nét tự động theo pha toàn khung hình, nhận diện khuôn mặt chính xác.",
      "Hệ sinh thái ống kính ngàm X cực kỳ phong phú và đa dạng giá thành."
    ],
    limitations: [
      "Màn hình dạng lật lên xuống (Tilt), không lật 180° ra phía trước nên không chụp selfie trực diện được.",
      "Không có chống rung trong thân máy (IBIS)."
    ],
    use_cases: ["Film look", "Chụp người", "Du lịch", "Street", "Cafe/OOTD"],
    skill_levels: ["Người mới bắt đầu", "Bán chuyên", "Đam mê màu Film"],
    characteristics: ["Giả lập màu film", "Thiết kế Vintage", "Cảm biến X-Trans", "Có Flash"],
    technical_specs: {
      "Cảm biến (Sensor)": "APS-C X-Trans CMOS 4 26.1 Megapixels",
      "Bộ xử lý hình ảnh": "X-Processor 4",
      "Giả lập màu film": "18 chế độ (Classic Neg, Classic Chrome, Astia, Velvia, Eterna...)",
      "Hệ thống lấy nét": "Hybrid AF 425 điểm nét theo pha",
      "Độ nhạy sáng (ISO)": "160 - 12.800 (Mở rộng 80 - 51.200)",
      "Quay Video": "4K 30p DCI/UHD, Full HD 240p",
      "Màn hình LCD": "3.0 inch cảm ứng lật 2 chiều 1.62 triệu điểm ảnh",
      "Kính ngắm EVF": "OLED 0.39 inch 2.36 triệu điểm ảnh",
      "Đèn flash": "Flash cóc gạt cơ tích hợp",
      "Pin sử dụng": "NP-W126S chính hãng"
    },
    sample_images: [
      {
        url: "https://images.unsplash.com/photo-1513635269975-5906d4b99d65?q=80&w=800&auto=format&fit=crop",
        title: "Chụp phố với màu Classic Chrome",
        lens: "XF 35mm F2 R WR",
        settings: "35mm · f/2.8 · 1/500s · ISO 160"
      },
      {
        url: "https://images.unsplash.com/photo-1520390138845-fd2d229dd553?q=80&w=800&auto=format&fit=crop",
        title: "Tông màu Classic Negative hoài niệm",
        lens: "XC 15-45mm OIS PZ",
        settings: "24mm · f/4.5 · 1/200s · ISO 320"
      }
    ],
    seo_title: "Fujifilm X-T30 II Chính Hãng — Máy Ảnh Giả Lập Màu Film Quốc Dân",
    seo_description: "Mua Fujifilm X-T30 II mới chính hãng 100% tại 4cats Camera. 18 giả lập màu film trứ danh, bảo hành chính hãng 24 tháng, hỗ trợ trả góp 0%, freeship.",
    variants: [
      {
        id: "xt30ii-body-silver",
        sku: "XT30II-BODY-SLV",
        color: "Silver",
        color_label: "Bạc Vintage",
        color_hex: "#D1D5DB",
        kit_type: "Body only",
        kit_label: "Thân máy (Body only)",
        included_lens: null,
        configuration_note: "Chưa kèm ống kính. Cần trang bị thêm ống kính ngàm X để chụp ảnh.",
        price: 21990000,
        compare_at_price: 23500000,
        stock_quantity: 5,
        branch_stock: { "Cầu Giấy": 3, "Thanh Xuân": 2 },
        warranty: "24 tháng chính hãng Fujifilm Việt Nam",
        is_in_stock: true
      },
      {
        id: "xt30ii-body-black",
        sku: "XT30II-BODY-BLK",
        color: "Black",
        color_label: "Đen Nam Tính",
        color_hex: "#1F2937",
        kit_type: "Body only",
        kit_label: "Thân máy (Body only)",
        included_lens: null,
        configuration_note: "Chưa kèm ống kính. Cần trang bị thêm ống kính ngàm X để chụp ảnh.",
        price: 21990000,
        compare_at_price: 23500000,
        stock_quantity: 4,
        branch_stock: { "Cầu Giấy": 2, "Thanh Xuân": 2 },
        warranty: "24 tháng chính hãng Fujifilm Việt Nam",
        is_in_stock: true
      },
      {
        id: "xt30ii-kit-silver",
        sku: "XT30II-KIT-SLV",
        color: "Silver",
        color_label: "Bạc Vintage",
        color_hex: "#D1D5DB",
        kit_type: "Kit 15-45mm",
        kit_label: "Kèm Lens Kit XC 15-45mm OIS PZ",
        included_lens: "Fujifilm XC 15-45mm F3.5-5.6 OIS PZ",
        configuration_note: "Đã có lens zoom nhỏ gọn có chống rung, chụp ngay phong cảnh & chân dung!",
        price: 24990000,
        compare_at_price: 26500000,
        stock_quantity: 6,
        branch_stock: { "Cầu Giấy": 4, "Thanh Xuân": 2 },
        warranty: "24 tháng chính hãng Fujifilm Việt Nam",
        is_in_stock: true
      }
    ]
  },
  {
    id: 3,
    slug: "sony-zv-1-ii",
    brand: "Sony",
    model_name: "ZV-1 II",
    series: "ZV",
    camera_type: "Compact",
    sensor_type: "1.0-type Exmor RS BSI CMOS",
    sensor_size: "13.2 x 8.8 mm",
    megapixels: "20.1 MP",
    lens_mount: "Gắn liền (Ống kính ZEISS Vario-Sonnar T* 18-50mm F1.8-4)",
    compatible_native_mounts: [],
    compatible_adapter_mounts: [],
    lens_ecosystem_note: "Máy ảnh Compact ống kính liền máy, không cần thay lens. Đã bao gồm sẵn ống kính zoom góc rộng ZEISS từ 18mm đến 50mm.",
    video_capabilities: "4K 30p, Full HD 120p, chế độ Vlog Điện ảnh (Cinematic Vlog Setting)",
    screen_type: "Màn hình cảm ứng xoay lật đa góc 180°",
    weight: "292g (Đã bao gồm pin và thẻ nhớ)",
    weight_interpretation: "Siêu nhẹ bỏ túi áo khoác hoặc túi xách nhỏ, nhẹ nhất trong các dòng máy quay chụp.",
    ibis: false,
    ibis_note: "Chống rung điện tử Active Mode chuyên dụng cho video đi bộ cầm tay.",
    viewfinder: "Không trang bị (Ngắm trực tiếp qua màn hình cảm ứng sắc nét)",
    built_in_flash: false,
    flash_note: "Không có flash cóc. Bù lại có micro định hướng 3 củ thu âm lọc tạp âm cực tốt kèm màng lọc gió tặng kèm.",
    wifi: true,
    bluetooth: true,
    connectivity_note: "Truyền video và ảnh cực nhanh sang điện thoại qua app Sony Creators' App.",
    mic_input: true,
    release_year: 2023,
    is_featured: true,
    featured_order: 3,
    is_new_arrival: false,
    main_image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=800&auto=format&fit=crop",
    official_images: [
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?q=80&w=1000&auto=format&fit=crop"
    ],
    short_description: "Chiếc máy ảnh compact chuyên quay vlog và selfie tối tân nhất của Sony. Trang bị ống kính góc siêu rộng 18mm giúp quay cầm tay không bị gò bó, cùng mic 3 củ thông minh thu âm trong trẻo.",
    beginner_summary: "Giải pháp 'tất cả trong một' cho bạn trẻ thích quay TikTok, Reels, Vlog du lịch hoặc livestream mà không cần mua thêm ống kính.",
    strengths: [
      "Đã tích hợp sẵn ống kính ZEISS góc rộng 18-50mm, mua về dùng ngay không cần đầu tư thêm lens.",
      "Kích thước siêu nhỏ gọn chỉ 292g, bỏ vừa túi xách mang đi chơi hàng ngày.",
      "Màn hình xoay lật cảm ứng hỗ trợ chụp selfie, quay vlog thuận tiện.",
      "Chế độ Product Showcase lấy nét sản phẩm tức thì và chế độ làm mịn da Soft Skin nịnh mắt.",
      "Micro 3 đầu thu định hướng thu âm cực rõ nét, có tặng kèm bông lọc gió chống ồn."
    ],
    limitations: [
      "Ống kính gắn liền không thể thay đổi tiêu cự xa (zoom tối đa 50mm).",
      "Không có kính ngắm ngắm mắt (EVF), không có đèn flash cóc."
    ],
    use_cases: ["Selfie", "Vlog", "Du lịch", "Người mới", "Cafe/OOTD"],
    skill_levels: ["Người mới bắt đầu", "Vlogger", "Tiktoker"],
    characteristics: ["Góc rộng 18mm", "Thu âm đỉnh", "Siêu nhẹ", "Màn xoay lật", "Ống kính liền"],
    technical_specs: {
      "Cảm biến (Sensor)": "1.0-type Exmor RS CMOS 20.1 Megapixels",
      "Bộ xử lý hình ảnh": "BIONZ X",
      "Ống kính": "ZEISS Vario-Sonnar T* 18-50mm f/1.8 - 4",
      "Hệ thống lấy nét": "Fast Hybrid AF 315 điểm, nhận diện mắt người & động vật",
      "Độ nhạy sáng (ISO)": "125 - 12.800",
      "Quay Video": "4K 30p, Full HD 120p, S-Log3, Cinematic Vlog Setting",
      "Âm thanh": "Micro 3 củ định hướng thông minh tích hợp (kèm mút lọc gió)",
      "Màn hình LCD": "3.0 inch cảm ứng xoay lật 921.600 điểm ảnh",
      "Pin sử dụng": "NP-BX1 chính hãng"
    },
    sample_images: [
      {
        url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
        title: "Selfie góc rộng tự nhiên với làn da mịn",
        lens: "Ống kính ZEISS tích hợp 18mm",
        settings: "18mm · f/2.0 · 1/320s · ISO 125"
      }
    ],
    seo_title: "Sony ZV-1 II Chính Hãng — Máy Ảnh Compact Vlogging Góc Rộng",
    seo_description: "Mua máy ảnh Sony ZV-1 II mới chính hãng 100% tại 4cats Camera. Ống kính ZEISS 18-50mm góc rộng, mic lọc gió 3 củ, bảo hành 12 tháng chính hãng Sony, freeship.",
    variants: [
      {
        id: "zv1ii-black",
        sku: "ZV1II-BLK",
        color: "Black",
        color_label: "Đen Nhám Chuyên Nghiệp",
        color_hex: "#1F2937",
        kit_type: "Ống kính liền",
        kit_label: "Trọn bộ (Kèm lens ZEISS 18-50mm)",
        included_lens: "ZEISS Vario-Sonnar T* 18-50mm",
        configuration_note: "Máy compact ống kính liền cao cấp, kèm bông lọc gió chính hãng.",
        price: 18490000,
        compare_at_price: 19990000,
        stock_quantity: 6,
        branch_stock: { "Cầu Giấy": 4, "Thanh Xuân": 2 },
        warranty: "12 tháng chính hãng Sony Việt Nam",
        is_in_stock: true
      },
      {
        id: "zv1ii-white",
        sku: "ZV1II-WHT",
        color: "White",
        color_label: "Trắng Tinh Khôi",
        color_hex: "#F8F9FA",
        kit_type: "Ống kính liền",
        kit_label: "Trọn bộ (Kèm lens ZEISS 18-50mm)",
        included_lens: "ZEISS Vario-Sonnar T* 18-50mm",
        configuration_note: "Máy compact ống kính liền cao cấp, kèm bông lọc gió chính hãng.",
        price: 18490000,
        compare_at_price: 19990000,
        stock_quantity: 5,
        branch_stock: { "Cầu Giấy": 3, "Thanh Xuân": 2 },
        warranty: "12 tháng chính hãng Sony Việt Nam",
        is_in_stock: true
      }
    ]
  },
  {
    id: 5,
    slug: "sony-zv-e10-ii",
    brand: "Sony",
    model_name: "ZV-E10 II",
    series: "ZV",
    camera_type: "Mirrorless",
    sensor_type: "APS-C Exmor R BSI CMOS",
    sensor_size: "23.5 x 15.6 mm",
    megapixels: "26.0 MP",
    lens_mount: "Sony E",
    compatible_native_mounts: ["Sony E", "Sony FE"],
    compatible_adapter_mounts: ["Canon EF", "Nikon F"],
    lens_ecosystem_note: "Kho lens Sony E phong phú bậc nhất thế giới từ rẻ đến chuyên nghiệp.",
    video_capabilities: "4K 60p 10-bit 4:2:2 oversampled 5.6K, Full HD 120p, S-Cinetone, S-Log3",
    screen_type: "Màn hình cảm ứng xoay lật đa góc 180°",
    weight: "377g (Thân máy kèm pin và thẻ nhớ)",
    weight_interpretation: "Rất nhỏ gọn, dùng pin lớn FZ100 quay chụp cả ngày không lo hết pin.",
    ibis: false,
    ibis_note: "Chống rung quang học trên lens và chống rung điện tử Active Mode.",
    viewfinder: "Không trang bị (Tập trung tối đa cho màn hình xoay lật)",
    built_in_flash: false,
    flash_note: "Không có flash cóc, có mic 3 capsule thông minh.",
    wifi: true,
    bluetooth: true,
    connectivity_note: "Kết nối app Creators' App truyền ảnh và video siêu tốc.",
    mic_input: true,
    release_year: 2024,
    is_featured: true,
    featured_order: 4,
    is_new_arrival: true,
    main_image: "https://images.unsplash.com/photo-1516961642265-531546e84af2?q=80&w=800&auto=format&fit=crop",
    official_images: [
      "https://images.unsplash.com/photo-1516961642265-531546e84af2?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520390138845-fd2d229dd553?q=80&w=1000&auto=format&fit=crop"
    ],
    short_description: "Dòng máy ảnh quay chụp thế hệ mới đỉnh cao từ Sony. Cảm biến 26.0MP BSI cao cấp từ FX30/A6700, quay video 4K 60p 10-bit màu điện ảnh S-Cinetone cùng pin Z dung lượng gấp đôi.",
    beginner_summary: "Mẫu máy hoàn hảo cho nhà sáng tạo nội dung, vlogger và bạn trẻ muốn chất lượng hình ảnh chuẩn chuyên nghiệp.",
    strengths: [
      "Cảm biến 26MP BSI cao cấp cùng màu phim điện ảnh S-Cinetone quay ăn ngay.",
      "Pin FZ100 dung lượng lớn, quay chụp cả ngày thoải mái.",
      "Màn hình cảm ứng xoay lật 180° góc rộng, giao diện chạm cực kỳ trực quan.",
      "Kho ống kính Sony E ngập tràn phân khúc giá để nâng cấp sau này."
    ],
    limitations: [
      "Không có kính ngắm mắt EVF (chuyên dụng ngắm qua màn hình xoay lật)."
    ],
    use_cases: ["Vlog", "Selfie", "Chụp người", "Du lịch", "Người mới"],
    skill_levels: ["Người mới bắt đầu", "Content Creator", "Bán chuyên"],
    characteristics: ["4K 60p 10-bit", "Pin Z trâu", "Màu S-Cinetone", "Màn xoay lật"],
    technical_specs: {
      "Cảm biến (Sensor)": "APS-C Exmor R CMOS 26.0 Megapixels",
      "Bộ xử lý hình ảnh": "BIONZ XR",
      "Quay Video": "4K 60p 10-bit 4:2:2, Full HD 120p",
      "Hệ thống lấy nét": "759 điểm lấy nét theo pha bao phủ 93% khung hình",
      "Màn hình LCD": "3.0 inch cảm ứng xoay lật 1.03 triệu điểm",
      "Pin sử dụng": "NP-FZ100 dung lượng cao"
    },
    sample_images: [
      {
        url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop",
        title: "Chất màu S-Cinetone nịnh mắt tự nhiên",
        lens: "E PZ 16-50mm F3.5-5.6 OSS II",
        settings: "24mm · f/4.0 · 1/250s · ISO 100"
      }
    ],
    seo_title: "Sony ZV-E10 II Chính Hãng — Máy Ảnh Vlogging 4K 60p Đẳng Cấp",
    seo_description: "Mua Sony ZV-E10 II mới chính hãng tại 4cats Camera. Cảm biến 26MP, pin Z dung lượng lớn, bảo hành 12 tháng chính hãng Sony.",
    variants: [
      {
        id: "zve10ii-body-black",
        sku: "ZVE10II-BODY-BLK",
        color: "Black",
        color_label: "Đen Sang Trọng",
        color_hex: "#1F2937",
        kit_type: "Body only",
        kit_label: "Thân máy (Body only)",
        included_lens: null,
        configuration_note: "Chưa kèm ống kính. Cần có ống kính ngàm Sony E để chụp ảnh.",
        price: 24990000,
        compare_at_price: 26990000,
        stock_quantity: 4,
        branch_stock: { "Cầu Giấy": 2, "Thanh Xuân": 2 },
        warranty: "12 tháng chính hãng Sony Việt Nam",
        is_in_stock: true
      },
      {
        id: "zve10ii-body-white",
        sku: "ZVE10II-BODY-WHT",
        color: "White",
        color_label: "Trắng Thanh Lịch",
        color_hex: "#F8F9FA",
        kit_type: "Body only",
        kit_label: "Thân máy (Body only)",
        included_lens: null,
        configuration_note: "Chưa kèm ống kính. Cần có ống kính ngàm Sony E để chụp ảnh.",
        price: 24990000,
        compare_at_price: 26990000,
        stock_quantity: 4,
        branch_stock: { "Cầu Giấy": 2, "Thanh Xuân": 2 },
        warranty: "12 tháng chính hãng Sony Việt Nam",
        is_in_stock: true
      },
      {
        id: "zve10ii-kit-black",
        sku: "ZVE10II-KIT-BLK",
        color: "Black",
        color_label: "Đen Sang Trọng",
        color_hex: "#1F2937",
        kit_type: "Kit 16-50mm II",
        kit_label: "Kèm Lens Kit E PZ 16-50mm F3.5-5.6 OSS II",
        included_lens: "Sony E PZ 16-50mm F3.5-5.6 OSS II",
        configuration_note: "Kèm ống kính zoom điện thế hệ 2 mới nhất, lấy nét siêu êm và chống rung!",
        price: 27990000,
        compare_at_price: 29990000,
        stock_quantity: 5,
        branch_stock: { "Cầu Giấy": 3, "Thanh Xuân": 2 },
        warranty: "12 tháng chính hãng Sony Việt Nam",
        is_in_stock: true
      }
    ]
  },
  {
    id: 4,
    slug: "sony-a6400",
    brand: "Sony",
    model_name: "A6400",
    series: "Alpha 6000",
    camera_type: "Mirrorless",
    sensor_type: "APS-C Exmor CMOS",
    sensor_size: "23.5 x 15.6 mm",
    megapixels: "24.2 MP",
    lens_mount: "Sony E",
    compatible_native_mounts: ["Sony E", "Sony FE"],
    compatible_adapter_mounts: ["Canon EF", "Nikon F"],
    lens_ecosystem_note: "Hệ ngàm Sony E có số lượng ống kính phong phú nhất thế giới từ Sony, Tamron, Sigma, Samyang.",
    video_capabilities: "4K 30p không gộp điểm ảnh (oversampled từ 6K), Full HD 120p, S-Log2, S-Log3, HLG",
    screen_type: "Màn hình cảm ứng lật 180° lên trên (Tilt 180°)",
    weight: "403g (Thân máy kèm pin và thẻ nhớ)",
    weight_interpretation: "Thân vỏ hợp kim magie đầm tay, bền bỉ, chống chịu thời tiết tốt.",
    ibis: false,
    ibis_note: "Không có chống rung trong thân máy. Nên chọn lens có chống rung OSS của Sony khi chụp thiếu sáng.",
    viewfinder: "Kính ngắm điện tử OLED Tru-Finder 2.36 triệu điểm ảnh sắc nét phong cách rangefinder",
    built_in_flash: true,
    flash_note: "Có đèn flash cóc tích hợp sẵn gập mở cơ học.",
    wifi: true,
    bluetooth: true,
    connectivity_note: "Truyền ảnh nhanh chóng qua app Sony Imaging Edge / Creators' App.",
    mic_input: true,
    release_year: 2020,
    is_featured: false,
    featured_order: 5,
    is_new_arrival: false,
    main_image: "https://images.unsplash.com/photo-1516961642265-531546e84af2?q=80&w=800&auto=format&fit=crop",
    official_images: [
      "https://images.unsplash.com/photo-1516961642265-531546e84af2?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520390138845-fd2d229dd553?q=80&w=1000&auto=format&fit=crop"
    ],
    short_description: "Chiếc máy ảnh mirrorless 'nồi đồng cối đá' bền bỉ bậc nhất phân khúc tầm trung. Nổi tiếng với hệ thống lấy nét Real-time Eye AF khóa nét mắt người & thú cưng với tốc độ chớp nhoáng 0.02 giây.",
    beginner_summary: "Phù hợp cho ai cần chiếc máy bền bỉ, lấy nét cực nhanh, quay phim 4K không giới hạn thời gian và muốn khám phá kho lens Sony E khổng lồ.",
    strengths: [
      "Lấy nét Real-time Eye AF cực nhanh và chuẩn xác hàng đầu, không bao giờ lo out nét.",
      "Không bị giới hạn thời gian quay 30 phút, tản nhiệt tốt, quay liên tục ổn định.",
      "Màn hình lật 180° lên trên hỗ trợ selfie và vlogging.",
      "Khung vỏ kim loại Magie cứng cáp, bền bỉ, có gioăng kháng bụi ẩm.",
      "Kho ống kính ngàm Sony E phong phú bậc nhất hiện nay."
    ],
    limitations: [
      "Màn hình lật lên trên nên nếu gắn mic thu âm trên hotshoe cần cold-shoe dời bên hông.",
      "Không có chống rung cảm biến IBIS trong máy."
    ],
    use_cases: ["Chụp người", "Du lịch", "Street", "Vlog", "Người mới"],
    skill_levels: ["Người mới bắt đầu", "Bán chuyên", "Quay phim"],
    characteristics: ["Lấy nét siêu nhanh", "Vỏ kim loại bền", "Quay 4K sắc nét", "Kho lens phong phú"],
    technical_specs: {
      "Cảm biến (Sensor)": "APS-C Exmor CMOS 24.2 Megapixels",
      "Bộ xử lý hình ảnh": "BIONZ X thế hệ mới",
      "Hệ thống lấy nét": "Fast Hybrid AF 425 điểm nét theo pha phủ 84% khung hình",
      "Độ nhạy sáng (ISO)": "100 - 32.000 (Mở rộng lên 102.400)",
      "Tốc độ chụp liên tiếp": "11 fps với màn trập cơ",
      "Quay Video": "4K 30p không gộp điểm ảnh, Full HD 120p, S-Log2/3, HLG",
      "Màn hình LCD": "3.0 inch cảm ứng lật 180° lên trên 921.600 điểm ảnh",
      "Kính ngắm EVF": "OLED 0.39 inch 2.36 triệu điểm ảnh",
      "Đèn flash": "Flash cóc tích hợp sẵn (GN 6)",
      "Pin sử dụng": "NP-FW50 chính hãng"
    },
    sample_images: [
      {
        url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop",
        title: "Bắt trọn khoảnh khắc chuyển động nhanh",
        lens: "Sony E 35mm F1.8 OSS",
        settings: "35mm · f/2.0 · 1/1000s · ISO 200"
      }
    ],
    seo_title: "Sony A6400 Chính Hãng — Máy Ảnh Mirrorless Lấy Nét Mắt 0.02s",
    seo_description: "Mua Sony A6400 mới chính hãng tại 4cats Camera. Khóa nét Real-time Eye AF siêu nhanh, vỏ magie bền bỉ, bảo hành chính hãng 12 tháng, freeship.",
    variants: [
      {
        id: "a6400-body-black",
        sku: "A6400-BODY-BLK",
        color: "Black",
        color_label: "Đen Chắc Khỏe",
        color_hex: "#1F2937",
        kit_type: "Body only",
        kit_label: "Thân máy (Body only)",
        included_lens: null,
        configuration_note: "Chưa kèm ống kính. Cần có thêm lens ngàm Sony E để chụp.",
        price: 18490000,
        compare_at_price: 19990000,
        stock_quantity: 4,
        branch_stock: { "Cầu Giấy": 2, "Thanh Xuân": 2 },
        warranty: "12 tháng chính hãng Sony Việt Nam",
        is_in_stock: true
      },
      {
        id: "a6400-kit-black",
        sku: "A6400-KIT-BLK",
        color: "Black",
        color_label: "Đen Chắc Khỏe",
        color_hex: "#1F2937",
        kit_type: "Kit 16-50mm",
        kit_label: "Kèm Lens Kit E 16-50mm OSS",
        included_lens: "Sony E 16-50mm F3.5-5.6 OSS",
        configuration_note: "Đã có sẵn lens zoom nhỏ gọn có chống rung, chụp ngay được!",
        price: 20990000,
        compare_at_price: 22490000,
        stock_quantity: 6,
        branch_stock: { "Cầu Giấy": 4, "Thanh Xuân": 2 },
        warranty: "12 tháng chính hãng Sony Việt Nam",
        is_in_stock: true
      }
    ]
  },
  {
    id: 6,
    slug: "fujifilm-x-s20",
    brand: "Fujifilm",
    model_name: "X-S20",
    series: "X-Series",
    camera_type: "Mirrorless",
    sensor_type: "APS-C X-Trans CMOS 4",
    sensor_size: "23.5 x 15.6 mm",
    megapixels: "26.1 MP",
    lens_mount: "Fujifilm X",
    compatible_native_mounts: ["Fujifilm X"],
    compatible_adapter_mounts: ["M42", "Leica M", "Canon EF"],
    lens_ecosystem_note: "Hệ lens ngàm X phong phú với nhiều ống kính khẩu lớn xóa phông lung linh.",
    video_capabilities: "6.2K 30p open gate, 4K 60p 10-bit 4:2:2, Full HD 240p",
    screen_type: "Màn hình cảm ứng xoay lật 180° đa hướng",
    weight: "491g (Thân máy kèm pin và thẻ nhớ)",
    weight_interpretation: "Báng cầm sâu cực kỳ êm tay, cầm cả ngày quay chụp rất chắc chắn.",
    ibis: true,
    ibis_note: "Chống rung trong thân máy (IBIS 5 trục) lên đến 7.0 stop cực kỳ mạnh mẽ.",
    viewfinder: "Kính ngắm OLED 2.36 triệu điểm sắc nét",
    built_in_flash: true,
    flash_note: "Có đèn flash cóc tích hợp sẵn trên máy.",
    wifi: true,
    bluetooth: true,
    connectivity_note: "Truyền ảnh nhanh chóng qua app Fujifilm XApp.",
    mic_input: true,
    release_year: 2023,
    is_featured: true,
    featured_order: 5,
    is_new_arrival: false,
    main_image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop",
    official_images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop"
    ],
    short_description: "Chiếc máy ảnh toàn năng thế hệ mới của Fujifilm: Vừa có 19 giả lập màu film hoài cổ, vừa có chống rung IBIS 7.0 stops, màn xoay lật selfie và quay video 6.2K siêu nét.",
    beginner_summary: "Nếu bạn muốn chiếc máy 'hoàn hảo không điểm trừ' để chụp ảnh film nghệ thuật và quay vlog chất lượng cao, X-S20 là lựa chọn xứng đáng nhất.",
    strengths: [
      "Chống rung cảm biến IBIS 7.0 stops chụp đêm và quay video cầm tay cực êm.",
      "19 công thức màu film Fujifilm, bao gồm Nostalgic Neg nịnh mắt.",
      "Màn hình cảm ứng xoay lật 180° tiện selfie & quay vlog.",
      "Pin lớn NP-W235 chụp được tới 750 tấm/lần sạc."
    ],
    limitations: [
      "Giá thành cao hơn dòng X-T30 II."
    ],
    use_cases: ["Film look", "Vlog", "Chụp người", "Du lịch", "Người mới"],
    skill_levels: ["Người mới bắt đầu", "Bán chuyên", "Chuyên nghiệp"],
    characteristics: ["Có chống rung IBIS", "19 màu film", "Pin trâu 750 tấm", "Màn xoay lật"],
    technical_specs: {
      "Cảm biến (Sensor)": "APS-C X-Trans CMOS 4 26.1 Megapixels",
      "Bộ xử lý hình ảnh": "X-Processor 5 mới nhất",
      "Chống rung IBIS": "Chống rung cảm biến 5 trục 7.0 stops",
      "Quay Video": "6.2K 30p, 4K 60p 10-bit",
      "Màn hình LCD": "3.0 inch cảm ứng xoay lật đa hướng",
      "Pin sử dụng": "NP-W235 dung lượng cao"
    },
    sample_images: [],
    seo_title: "Fujifilm X-S20 Chính Hãng — Máy Ảnh Chống Rung IBIS & Màu Film Thơ",
    seo_description: "Mua Fujifilm X-S20 mới 100% chính hãng tại 4cats Camera. Chống rung 7 stops, 19 giả lập màu film, bảo hành chính hãng 24 tháng.",
    variants: [
      {
        id: "xs20-body-black",
        sku: "XS20-BODY-BLK",
        color: "Black",
        color_label: "Đen Chuyên Nghiệp",
        color_hex: "#1F2937",
        kit_type: "Body only",
        kit_label: "Thân máy (Body only)",
        included_lens: null,
        configuration_note: "Chưa kèm ống kính. Cần mua thêm lens ngàm X để chụp ảnh.",
        price: 31990000,
        compare_at_price: 33990000,
        stock_quantity: 3,
        branch_stock: { "Cầu Giấy": 2, "Thanh Xuân": 1 },
        warranty: "24 tháng chính hãng Fujifilm Việt Nam",
        is_in_stock: true
      },
      {
        id: "xs20-kit-black",
        sku: "XS20-KIT-BLK",
        color: "Black",
        color_label: "Đen Chuyên Nghiệp",
        color_hex: "#1F2937",
        kit_type: "Kit 15-45mm",
        kit_label: "Kèm Lens Kit XC 15-45mm OIS PZ",
        included_lens: "Fujifilm XC 15-45mm F3.5-5.6 OIS PZ",
        configuration_note: "Đã có lens zoom góc rộng, chụp ngay mọi thể loại!",
        price: 34990000,
        compare_at_price: 36990000,
        stock_quantity: 4,
        branch_stock: { "Cầu Giấy": 2, "Thanh Xuân": 2 },
        warranty: "24 tháng chính hãng Fujifilm Việt Nam",
        is_in_stock: true
      }
    ]
  }
];

// Helper: Enrich product model with computed fields for easy storefront consumption
function enrichProduct(product) {
  if (!product) return null;
  const variants = product.variants || [];
  const prices = variants.map((v) => v.price).filter(Boolean);
  const comparePrices = variants.map((v) => v.compare_at_price).filter(Boolean);

  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
  const minComparePrice = comparePrices.length > 0 ? Math.min(...comparePrices) : 0;
  const maxComparePrice = comparePrices.length > 0 ? Math.max(...comparePrices) : 0;

  const availableColors = [...new Set(variants.map((v) => v.color_label || v.color).filter(Boolean))];
  const kitTypes = [...new Set(variants.map((v) => v.kit_type).filter(Boolean))];
  const totalStock = variants.reduce((sum, v) => sum + (v.stock_quantity || 0), 0);

  const branchCounts = {};
  variants.forEach((v) => {
    if (v.branch_stock) {
      Object.entries(v.branch_stock).forEach(([branch, count]) => {
        branchCounts[branch] = (branchCounts[branch] || 0) + count;
      });
    }
  });

  const discountPercent =
    minComparePrice > minPrice
      ? Math.round(((minComparePrice - minPrice) / minComparePrice) * 100)
      : 0;

  return {
    ...product,
    name: `${product.brand} ${product.model_name}`,
    image: product.main_image,
    images: product.official_images || [product.main_image],
    features: product.use_cases || [],
    specialties: product.characteristics || [],
    specs: product.technical_specs || {},
    desc: product.beginner_summary || product.short_description || "",
    link: `/may-anh/${product.slug}`,
    minPrice,
    maxPrice,
    compare_at_price: minComparePrice > minPrice ? minComparePrice : null,
    discountPercent,
    availableColors,
    kitTypes,
    totalStock,
    isAvailable: totalStock > 0,
    branchCounts,
    warrantySummary: "Bảo hành 12–24 tháng chính hãng · 7 ngày 1 đổi 1",
    conditionBadge: "Mới 100% Chính Hãng",
    // Backward compatibility for components expecting unit list
    units: variants.map((v) => ({
      id: v.id,
      unit_code: v.sku,
      color: v.color,
      color_label: v.color_label,
      price: v.price,
      original_price: v.compare_at_price,
      is_kit: v.kit_type !== "Body only",
      stock_status: v.stock_quantity > 0 ? "in_stock" : "out_of_stock",
      branch_name: "Cầu Giấy & Thanh Xuân",
      condition_grade: "Mới 100% Chính Hãng",
      condition_percentage: 100
    }))
  };
}

export function getAllModels() {
  return PRODUCT_MODELS.map(enrichProduct);
}

export function getAllProducts() {
  return getAllModels();
}

export function getFeaturedProducts() {
  return getAllModels()
    .filter((p) => p.is_featured)
    .sort((a, b) => (a.featured_order || 99) - (b.featured_order || 99));
}

export function getDiscountedProducts() {
  return getAllModels().filter((p) => p.discountPercent > 0);
}

export function getNewArrivalProducts() {
  return getAllModels().filter((p) => p.is_new_arrival || p.release_year >= 2023);
}

export function getModelByIdOrSlug(idOrSlug) {
  if (!idOrSlug) return null;
  const str = String(idOrSlug).trim().toLowerCase();

  let found = PRODUCT_MODELS.find((m) => m.slug.toLowerCase() === str);
  if (!found) {
    const numId = parseInt(str, 10);
    if (!isNaN(numId)) {
      found = PRODUCT_MODELS.find((m) => m.id === numId);
    }
  }
  if (!found) {
    found = PRODUCT_MODELS.find(
      (m) => `${m.brand} ${m.model_name}`.toLowerCase().replace(/\s+/g, "-") === str
    );
  }

  return enrichProduct(found);
}

// Legacy helper preserved safely for backward compatibility
export function getInventoryUnitByCode(unitCode) {
  if (!unitCode) return null;
  const models = getAllModels();
  for (const m of models) {
    const v = m.variants?.find(
      (varItem) => varItem.sku?.toUpperCase() === unitCode.toUpperCase()
    );
    if (v) {
      return {
        ...v,
        unit_code: v.sku,
        model: m
      };
    }
  }
  return null;
}

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

export function searchModelsAndUnits(query = "", filters = {}, sort = "default") {
  let list = getAllModels();

  if (query && query.trim()) {
    const qNorm = removeVietnameseTones(query);
    const tokens = qNorm.split(/\s+/).filter(Boolean);

    const isSelfieQuery = qNorm.includes("selfie");
    const isVlogQuery = qNorm.includes("vlog");
    const isBeginnerQuery = qNorm.includes("nguoi moi") || qNorm.includes("moi tap");
    const isTravelQuery = qNorm.includes("du lich") || qNorm.includes("nho nhe");
    const isFilmQuery = qNorm.includes("film") || qNorm.includes("vintage") || qNorm.includes("mau film");

    list = list.filter((item) => {
      const itemText = removeVietnameseTones(
        `${item.brand} ${item.model_name} ${item.series} ${item.camera_type} ${item.short_description} ${(item.use_cases || []).join(" ")} ${(item.characteristics || []).join(" ")} ${(item.availableColors || []).join(" ")}`
      );

      const matchesTokens = tokens.every((token) => itemText.includes(token));
      if (matchesTokens) return true;

      if (isSelfieQuery && item.use_cases?.includes("Selfie")) return true;
      if (isVlogQuery && item.use_cases?.includes("Vlog")) return true;
      if (isBeginnerQuery && item.use_cases?.includes("Người mới")) return true;
      if (isTravelQuery && (item.use_cases?.includes("Du lịch") || item.characteristics?.includes("Nhỏ nhẹ"))) return true;
      if (isFilmQuery && item.use_cases?.includes("Film look")) return true;

      return false;
    });
  }

  if (filters.brand && filters.brand !== "All" && filters.brand !== "Tất cả") {
    list = list.filter((m) => m.brand?.toLowerCase() === filters.brand.toLowerCase());
  }

  if (filters.category && filters.category !== "All" && filters.category !== "Tất cả") {
    list = list.filter((m) => m.camera_type?.toLowerCase() === filters.category.toLowerCase());
  }

  if (filters.useCase && filters.useCase !== "All") {
    list = list.filter((m) => m.use_cases?.includes(filters.useCase));
  }

  if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
    list = list.filter((m) => {
      if (!m.minPrice) return false;
      return m.minPrice >= filters.minPrice && m.minPrice <= filters.maxPrice;
    });
  }

  if (sort === "price-asc") {
    list.sort((a, b) => (a.minPrice || 0) - (b.minPrice || 0));
  } else if (sort === "price-desc") {
    list.sort((a, b) => (b.minPrice || 0) - (a.minPrice || 0));
  } else if (sort === "newest") {
    list.sort((a, b) => (b.release_year || 0) - (a.release_year || 0));
  } else if (sort === "beginner-friendly") {
    list.sort((a, b) => {
      const aIsBeg = a.use_cases?.includes("Người mới") ? 1 : 0;
      const bIsBeg = b.use_cases?.includes("Người mới") ? 1 : 0;
      return bIsBeg - aIsBeg;
    });
  }

  return list;
}

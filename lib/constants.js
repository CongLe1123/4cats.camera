// ==============================================================================
// 4cats Camera — Store Policies & Constants
// 100% Genuine, Brand New Cameras with Official Warranty
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
  }
};

# AGENTS.md

## Tổng quan dự án

Dự án là một **Website Cửa Hàng Máy Ảnh** chuyên **bán máy ảnh**.

Website sử dụng **Supabase làm backend** (database, authentication, storage, admin).

Phong cách giao diện theo hướng **dễ thương – pastel – Instagram style**.

Đối tượng người dùng:

- Sinh viên
- Content creator
- Người đi du lịch
- Người mới bắt đầu
- Người chụp ảnh casual

---

## Yêu cầu thiết kế & phong cách

### Giao diện

- Tông **hồng pastel** chủ đạo
- Cảm giác dễ thương, ấm áp, thân thiện
- Bo góc tròn cho card, button, input
- Shadow mềm
- Icon dạng sticker, minh họa máy ảnh
- Background dạng lưới nhẹ hoặc tiled

### Typography

- Font sans-serif bo tròn
- Câu chữ đơn giản, dễ hiểu
- Micro-copy thân thiện

### Tone nội dung

- Thân thiện
- Đáng tin cậy
- Dễ hiểu cho người mới
- Tránh thuật ngữ kỹ thuật phức tạp

---

## Cấu trúc website & các trang

---

## Navbar

Các mục chính trên thanh điều hướng:

- **Hệ thống cửa hàng**
- **Gọi mua hàng**
- **Chính sách bảo hành**
- **Chính sách mua hàng**

---

## Trang chủ

### Nội dung chính

- **Banner quảng cáo**
- **Khu vực khuyến mãi**
- **Tin hot**
- **Dòng máy hot / trend**

### CTA chính

- Mua máy
- Xem sản phẩm hot

> Nội dung trang chủ được quản lý động từ admin (Supabase).

---

## Trang mua máy

Trang này dùng để **xem và mua máy ảnh**.

Tất cả dữ liệu máy ảnh được quản lý từ **Supabase**.

---

### Card sản phẩm

- Hình ảnh máy
- Tên model
- Hãng
- Độ mới
- Màu sắc
- Giá bán
- Trạng thái còn hàng
- Nút **Mua ngay**

---

### Bộ lọc sản phẩm

- Hãng (có thể bao gồm nhiều dòng)
- Giá
- Màu sắc
- **Tính năng**
  (admin có thể thêm mới hoặc dùng danh sách có sẵn)
- **Độ mới**
  (admin có thể thêm mới hoặc dùng danh sách có sẵn)

---

### Trang chi tiết sản phẩm

Mỗi sản phẩm có trang chi tiết riêng.

#### Mô tả chi tiết

- Nội dung mô tả
- Có thể gắn **ảnh**
- Có thể gắn **video**

#### Các option lựa chọn

- **Màu sắc**
- **Độ mới**:

  - Mới
  - Like new
  - Trầy xước ít (mới 95%)
  - Trầy xước vừa (mới 90%)
  - Cũ (cấn xước nhiều)

#### Hiển thị giá & tồn kho

- Nếu option **còn hàng** → hiển thị giá bán
- Nếu **hết hàng**:

  - Hiển thị text **“Liên hệ”**
  - Icon pop-up dẫn sang:

    - Instagram
    - Zalo
    - Facebook

---

## Trang chính sách

- Chính sách mua hàng
- Chính sách bảo hành
- Điều kiện đổi trả (nếu có)

Ngôn ngữ đơn giản, dễ hiểu, không dùng thuật ngữ pháp lý.

---

## Trang liên hệ

- Layout ưu tiên mạng xã hội
- Card style Instagram
- Nút chat:

  - Messenger
  - WhatsApp
  - Zalo

- CTA thân thiện

---

## Trang Admin

### Phân quyền

- Đăng nhập bằng **Supabase Auth**
- Chỉ admin truy cập

---

### Chức năng admin

#### Quản lý nội dung trang chủ

Admin có thể chỉnh sửa trực tiếp:

- Banner quảng cáo

  - Hình ảnh
  - Video (nếu có)
  - Text / slogan
  - Link điều hướng

- Khuyến mãi

  - Tiêu đề
  - Mô tả
  - Thời gian áp dụng

- Tin hot

  - Tiêu đề
  - Nội dung ngắn
  - Ảnh

- Dòng máy hot / trend

  - Chọn từ danh sách sản phẩm
  - Sắp xếp thứ tự

Nội dung có thể:

- Bật / tắt hiển thị
- Sắp xếp thứ tự
- Hẹn thời gian hiển thị

---

#### Quản lý sản phẩm

- Thêm / sửa / ẩn máy ảnh
- Upload ảnh & video (Supabase Storage)
- Thiết lập:

  - Giá bán
  - Màu sắc
  - Độ mới
  - Tính năng
  - Tồn kho
  - Trạng thái hiển thị

---

#### Thông báo mua hàng

- Nhận thông báo khi có người mua
- Gửi email thông báo đến:
  **[fourcatscamera@gmail.com](mailto:fourcatscamera@gmail.com)**

---

## Dev environment

- Khởi tạo:

  ```bash
  pnpm create vite@latest <project_name> -- --template react-ts
  ```

- Tailwind CSS cho UI pastel

- Supabase cho:

  - Database
  - Auth
  - Storage

- Component tái sử dụng:

  - Product card
  - Filter
  - Form
  - Badge trạng thái

---

## Testing

- Test:

  - Luồng mua hàng
  - Bộ lọc
  - Option hết hàng
  - Thông báo admin

- Mobile-first
- Trước khi merge:

  ```bash
  pnpm lint
  pnpm test
  ```

---

## PR rules

- Title:

  ```
  [camera-store] <Title>
  ```

- UI phải đúng pastel / cute
- Không dùng màu gắt, theme tối
- Luôn chạy:

  ```bash
  pnpm lint
  pnpm test
  ```

- Có screenshot khi thay đổi UI

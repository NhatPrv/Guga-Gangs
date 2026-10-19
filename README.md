# 🌸 Guga Gangs - JLPT Master (N5 - N3)

> **Hệ thống Nền tảng Học tiếng Nhật Toàn diện: Từ vựng, Hán tự chuyên sâu & Đấu trường Ngữ pháp 2 chiều thực chiến**

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Web%20SPA%20%7C%20Windows-blue.svg)](start.bat)
[![JLPT Levels](https://img.shields.io/badge/JLPT-N5%20%7C%20N4%20%7C%20N3-emerald.svg)](#)
[![Zero Dependency](https://img.shields.io/badge/Dependencies-Zero%20Install-orange.svg)](#)

---

## 🌟 Giới thiệu Dự án

**Guga Gangs - JLPT Master** là ứng dụng web mã nguồn mở được thiết kế tối ưu cho người tự học tiếng Nhật từ cấp độ **N5, N4 đến N3**. Dự án hướng đến sự mượt mà, tiện lợi tối đa: **không cần cài đặt cơ sở dữ liệu hay npm phức tạp**, chỉ cần tải về, giải nén và nhấp đúp file `start.bat` là có thể học ngay trên trình duyệt máy tính của bạn.

---

## ✨ Các Phân hệ Tính năng Nổi bật

### 1. 📖 Phân hệ Từ vựng (Vocabulary Hub)
- **Hơn 50+ bài học** phân chia theo giáo trình Minna no Nihongo (N5, N4) và các chuyên đề thực tế (Liên từ, Phó từ chỉ mức độ, tần suất, trạng từ tượng thanh - tượng hình).
- **Học 3 chế độ**:
  - **Danh sách Từ vựng**: Bảng tra cứu trực quan, phát âm tự động từng từ, ẩn/hiện cách đọc Kanji hoặc nghĩa tiếng Việt, đánh dấu yêu thích (Bookmarks).
  - **Thẻ Flashcard 3D**: Lật thẻ 2 chiều với hiệu ứng mượt mà, hỗ trợ phím tắt Space, phím mũi tên và chế độ xáo trộn ngẫu nhiên.
  - **Luyện gõ Test (Typing Arena)**: Chọn phạm vi câu (từ câu a đến câu b), xáo trộn câu hỏi, làm lại các câu bị sai sau khi kết thúc.

### 2. 🈴 Phân hệ Hán tự (Kanji Hub)
- Cây bài học tách biệt chuyên biệt cho Kanji.
- Thông tin chữ Hán đầy đủ: Số nét, Hán Việt, **Âm On**, **Âm Kun**, giải nghĩa tiếng Việt chuẩn xác.
- Mỗi chữ Hán đều kèm theo **các cặp từ ghép thông dụng** (kèm phiên âm Hiragana và nghĩa chi tiết).
- Hỗ trợ học Flashcard và làm bài Test tương tự phân hệ Từ vựng.

### 3. ⚡ Đấu trường Ngữ pháp (Grammar Mastery Hub)
- Cây bài học ngữ pháp phân cấp theo trình độ: **JLPT N5**, **JLPT N4**, **JLPT N3** (chia theo từng Bài 1, Bài 2...).
- **Mục 1: ÔN TẬP NHANH**: Luyện riêng từng mẫu ngữ pháp với bộ đề 5 câu 2 chiều (từ tiếng Nhật chọn nghĩa & từ nghĩa tiếng Việt chọn ngữ pháp, tình huống đời sống).
- **Mục 2: ÔN TẬP TỔNG HỢP**:
  - **3 Bộ đề thi tổng hợp** cho mỗi bài học: Đề 01 (Tiêu chuẩn JLPT), Đề 02 (Tăng cường phản xạ), Đề 03 (Thực chiến nâng cao).
  - Số câu mỗi đề = **Số lượng mẫu ngữ pháp × 5** (xáo trộn ngẫu nhiên toàn bộ câu hỏi).
  - **Phản hồi tức thì**: Chọn đáp án đổi màu xanh lá (đúng) hoặc màu đỏ (sai), hiển thị ngay bản dịch nghĩa câu tiếng Việt và giải thích chi tiết.
  - Tổng kết điểm số và tính năng **Làm lại riêng các câu vừa làm sai**.

---

## 🚀 Hướng dẫn Cài đặt & Sử dụng Nhanh

### 📦 Cách 1: Dành cho người dùng (Không cần biết lập trình)

1. **Tải mã nguồn về máy**:
   - Nhấn vào nút xanh **`Code`** ở đầu trang GitHub ➔ Chọn **`Download ZIP`**.
   - Hoặc tải trực tiếp theo link: [Download ZIP](https://github.com/NhatPrv/Guga-Gangs/archive/refs/heads/main.zip).
2. **Giải nén**:
   - Nhấp chuột phải vào file `Guga-Gangs-main.zip` vừa tải về ➔ Chọn **`Extract All...`** (Giải nén ra thư mục).
3. **Khởi chạy máy chủ**:
   - Vào thư mục vừa giải nén, nhấp đúp vào file:
     ```
     start.bat
     ```
   - *Lưu ý*: Máy tính cần có sẵn [Node.js](https://nodejs.org/) (nếu máy bạn chưa có, file `start.bat` sẽ tự động mở trang web hướng dẫn bạn tải chỉ với 1 click).
4. **Bắt đầu học**:
   - Ứng dụng sẽ tự động mở trình duyệt web tại địa chỉ:
     ```
     http://localhost:48921
     ```
   - Cổng `48921` là cổng riêng biệt, độc lập, không lo bị trùng với bất kỳ phần mềm nào khác trên máy tính của bạn!

---

### 💻 Cách 2: Dành cho lập trình viên (Git Clone)

```bash
# 1. Clone repository về máy
git clone https://github.com/NhatPrv/Guga-Gangs.git

# 2. Di chuyển vào thư mục dự án
cd Guga-Gangs

# 3. Khởi chạy máy chủ (Zero-dependency, không cần npm install)
npm start

# 4. Mở trình duyệt truy cập:
# http://localhost:48921
```

---

## ⌨️ Bảng Phím tắt Thao tác Nhanh

| Phím tắt | Tính năng | Vị trí áp dụng |
| :--- | :--- | :--- |
| `Space` | Lật mặt thẻ Flashcard | Tab Thẻ Flashcard |
| `←` / `→` | Chuyển thẻ Flashcard trước / tiếp theo | Tab Thẻ Flashcard |
| `1`, `2`, `3`, `4` hoặc `A`, `B`, `C`, `D` | Chọn nhanh đáp án trắc nghiệm | Đấu trường Ngữ pháp |
| `H` | Ẩn / Hiện bản dịch nghĩa câu hỏi | Đấu trường Ngữ pháp |
| `Enter` | Chuyển sang câu hỏi tiếp theo sau khi làm bài | Đấu trường Ngữ pháp |

---

## 📁 Cấu trúc Thư mục Dự án

```
Guga-Gangs/
├── data/                               # Kho dữ liệu bài học JSON
│   ├── minna-no-nihongo-n5/            # Giáo trình N5 (Unit 01 - 25)
│   ├── minna-no-nihongo-n4/            # Giáo trình N4 (Unit 26 - 50)
│   ├── special-topics-.../             # Chuyên đề Liên từ & Phó từ
│   ├── grammar/                        # Dữ liệu Ngữ pháp N5, N4, N3 & Manifest
│   ├── vocab-manifest.json             # Manifest tổng hợp Từ vựng
│   └── kanji-manifest.json             # Manifest tổng hợp Hán tự
├── web/                                # Giao diện ứng dụng SPA
│   ├── index.html                      # HTML cấu trúc ứng dụng
│   ├── css/custom.css                  # Tùy biến phong cách giao diện
│   └── js/app.js                       # Logic tương tác người dùng
├── scripts/                            # Các công cụ kiểm tra và xử lý dữ liệu
├── docs/                               # Tài liệu hướng dẫn sử dụng chi tiết
├── server.js                           # Máy chủ HTTP Node.js tĩnh tích hợp
├── start.bat                           # File khởi chạy tự động trên Windows
├── LICENSE                             # Giấy phép bản quyền MIT
└── README.md                           # Giới thiệu & hướng dẫn dự án
```

---

## 🤝 Đóng góp & Tác giả

- **Tác giả**: [NhatPrv](https://github.com/NhatPrv)
- **Repository chính thức**: [https://github.com/NhatPrv/Guga-Gangs](https://github.com/NhatPrv/Guga-Gangs)
- Mọi đóng góp, báo lỗi hoặc yêu cầu tính năng mới đều được hoan nghênh tại mục [Issues](https://github.com/NhatPrv/Guga-Gangs/issues) và [Pull Requests](https://github.com/NhatPrv/Guga-Gangs/pulls).

---

## 📜 Giấy phép (License)

Dự án được phân phối dưới giấy phép [MIT License](LICENSE). Bạn hoàn toàn tự do sử dụng, học tập và phát triển tiếp vì mục đích phi thương mại.

# JLPT N4 Master: Hệ thống Crawl, Lưu trữ & Web Học Từ Vựng / Hán Tự

Hệ thống toàn diện từ A đến Z phục vụ việc quản lý, tự động sinh dữ liệu và học Từ vựng / Hán tự JLPT N4 với kiến trúc hiện đại, chuẩn hóa và tối ưu hiệu năng.

---

## 1. Cấu trúc thư mục (Directory Architecture)

```text
CrawlN4/
├── package.json                        # Khai báo cấu hình, metadata & npm scripts
├── server.js                           # Máy chủ tĩnh Zero-dependency (Node.js native http)
├── data/
│   ├── manifest.json                   # [TỰ ĐỘNG SINH] Sơ đồ cây thư mục toàn bộ kho dữ liệu
│   ├── minna-no-nihongo-n4/            # Giáo trình 1: Minna no Nihongo II (Bài 26 - 50)
│   │   ├── _meta.json                  # { "title": "Minna no Nihongo II (N4)", "order": 1 }
│   │   ├── unit-26/                    # { _meta.json, vocabulary.json, kanji.json }
│   │   ├── unit-27/
│   │   ├── unit-28/
│   │   ├── unit-29/
│   │   └── unit-30/
│   ├── soumatome-n4/                   # Giáo trình 2: Nihongo Soumatome N4 (Tuần / Ngày)
│   │   ├── _meta.json
│   │   ├── week-1-day-1/
│   │   └── week-1-day-2/
│   └── mimikara-oboeru-n4/             # Giáo trình 3: Mimikara Oboeru N4 (Theo chủ đề/loại từ)
│       ├── _meta.json
│       └── unit-01-verbs/
├── scripts/
│   ├── build-manifest.js               # Quét đệ quy thư mục /data và tự động xuất manifest.json
│   └── auto-crawler.js                 # Sinh tiếp bài học chuẩn hóa (Offline / Ollama / Gemini / OpenAI)
└── web/
    ├── index.html                      # Ứng dụng Web SPA chuẩn IDE / Notion
    ├── css/
    │   └── custom.css                  # Hiệu ứng blur che chữ, 3D flip card, scrollbar mượt mà
    └── js/
        └── app.js                      # Core SPA: Tree View, Audio Speech, Quiz Mode, Flashcard
```

---

## 2. Chuẩn dữ liệu JSON Schema

### 2.1. File `_meta.json` (Giáo trình & Bài học)
```json
{
  "title": "Minna no Nihongo II (N4)",
  "order": 1,
  "description": "Giáo trình tiếng Nhật Minna no Nihongo Trung cấp (Bài 26 đến Bài 50)"
}
```

### 2.2. File `vocabulary.json` (Từ vựng chuẩn)
```json
[
  {
    "word": "逃げる",
    "meaning": "chạy trốn, bỏ chạy",
    "reading": "にげる",
    "sinoVietnamese": "ĐÀO",
    "example": "犯人は海外に逃げた。(Thủ phạm đã trốn ra nước ngoài.)"
  }
]
```

### 2.3. File `kanji.json` (Hán tự)
```json
[
  {
    "id": "k26-01",
    "character": "診",
    "onyomi": "シン",
    "kunyomi": "み.る",
    "meaning": "Chẩn (chẩn đoán, khám)",
    "strokes": 12,
    "examples": [
      {
        "compound": "診察",
        "reading": "しんさつ",
        "meaning": "khám bệnh"
      }
    ]
  }
]
```

---

## 3. Hướng dẫn sử dụng & Lệnh NPM Scripts

### 3.1. Khởi chạy Ứng dụng Web
Khởi động máy chủ web cục bộ trên cổng `3000`:
```bash
npm start
```
Truy cập giao diện tại: **`http://localhost:3000`**

### 3.2. Quét & Tự động sinh `manifest.json` (Tree Indexer)
Mỗi khi thêm bài học hoặc sửa đổi nội dung trong thư mục `data/`, chỉ cần chạy:
```bash
npm run build:manifest
```
Script sẽ tự động đếm số lượng từ vựng, hán tự, liên kết đường dẫn tương đối và sắp xếp bài học theo `order`.

### 3.3. Tự động sinh bài học (Auto Crawler / AI Generator)
- **Chế độ Offline (Mặc định)**:
  Tự động sinh các bài học tiếp theo từ cơ sở tri thức N4 tích hợp sẵn:
  ```bash
  npm run crawl
  ```
- **Sinh bài cụ thể**:
  ```bash
  node scripts/auto-crawler.js --curriculum minna-no-nihongo-n4 --unit unit-29
  ```
- **Chế độ Ollama Local** (Dành cho máy chạy LLM offline trên cổng `11434`):
  ```bash
  node scripts/auto-crawler.js --mode ollama
  ```

---

## 4. Các tính năng nổi bật trên Web SPA

1. **Giao diện dạng IDE / Notion**: Thanh điều hướng cây thư mục bên trái với hiệu ứng mở/gập các nhóm giáo trình, tìm kiếm bài học nhanh, huy hiệu hiển thị số lượng từ và hán tự theo thời gian thực.
2. **Học tập đa chế độ**:
   - 📝 **Từ vựng (Vocabulary View)**: Hiển thị Kanji kích thước lớn, Furigana, Romaji, loại từ, nghĩa tiếng Việt và câu ví dụ song ngữ.
   - 🈴 **Hán tự (Kanji View)**: Hiển thị số nét, Âm On (Katakana), Âm Kun (Hiragana), giải nghĩa Hán Việt và các từ ghép thường gặp (Jukugo).
   - 🎴 **Thẻ ghi nhớ (Flashcard 3D)**: Hỗ trợ phím tắt (`Space` để lật mặt thẻ, `Mũi tên trái/phải` để chuyển thẻ), chế độ xáo trộn ngẫu nhiên.
3. **Chế độ tự kiểm tra (Quiz / Blur Mask Mode)**:
   - Tùy chọn ẩn: **Ẩn Furigana**, **Ẩn Nghĩa tiếng Việt**, hoặc **Ẩn Từ vựng/Hán tự**.
   - Di chuột (`hover`) hoặc nhấp chuột (`click`) vào phần bị che để lật mở đáp án tức thì.
4. **Phát âm tiếng Nhật chuẩn (Web Speech API)**:
   - Phát âm từng từ hoặc câu ví dụ với giọng đọc `ja-JP`.
   - Nút **"Nghe toàn bộ"** tự động phát âm lần lượt danh sách từ vựng.
   - Tùy chỉnh tốc độ đọc linh hoạt (`0.8x`, `1.0x`, `1.2x`).
5. **Đánh dấu yêu thích & Bộ lọc tìm kiếm**:
   - Lưu các từ khó nhớ vào bộ nhớ trình duyệt (`localStorage`).
   - Tìm kiếm tức thì theo chữ Hán, Romaji, Hiragana hoặc Nghĩa tiếng Việt.
6. **Dark Mode**: Giao diện tối mượt mà, lưu trạng thái giao diện theo phiên làm việc.

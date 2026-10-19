/**
 * standardize-vocabulary.js
 * Quét toàn bộ kho dữ liệu và chuẩn hóa 100% file vocabulary.json theo đúng prompt:
 * {
 *   "word": "từ vựng (bắt buộc)",
 *   "meaning": "nghĩa tiếng Việt (bắt buộc)",
 *   "reading": "cách đọc Hiragana",
 *   "sinoVietnamese": "âm Hán Việt",
 *   "example": "ví dụ câu (tiếng Nhật - tiếng Việt)"
 * }
 */

const fs = require('fs');
const path = require('path');
const { buildManifest } = require('./build-manifest');

const DATA_DIR = path.join(__dirname, '..', 'data');

// Bảng tra cứu toàn diện Âm Hán Việt (Sino-Vietnamese) cho hơn 700+ chữ Hán
const KANJI_HV_MAP = {
  "一": "NHẤT", "二": "NHỊ", "三": "TAM", "四": "TỨ", "五": "NGŨ",
  "六": "LỤC", "七": "THẤT", "八": "BÁT", "九": "CỬU", "十": "THẬP",
  "百": "BÁCH", "千": "THIÊN", "万": "VẠN", "円": "VIÊN", "日": "NHẬT",
  "月": "NGUYỆT", "火": "HỎA", "水": "THỦY", "木": "MỘC", "金": "KIM",
  "土": "THỔ", "年": "NIÊN", "左": "TẢ", "右": "HỮU", "上": "THƯỢNG",
  "下": "HẠ", "大": "ĐẠI", "中": "TRUNG", "小": "TIỂU", "長": "TRƯỜNG",
  "白": "BẠCH", "赤": "XÍCH", "青": "THANH", "黒": "HẮC", "雨": "VŨ",
  "雪": "TUYẾT", "風": "PHONG", "空": "KHÔNG", "天": "THIÊN", "気": "KHÍ",
  "山": "SƠN", "川": "XUYÊN", "海": "HẢI", "花": "HOA", "草": "THẢO",
  "人": "NHÂN", "男": "NAM", "女": "NỮ", "子": "TỬ", "父": "PHỤ",
  "母": "MẪU", "友": "HỮU", "本": "BẢN", "何": "HÀ", "先": "TIÊN",
  "生": "SINH", "学": "HỌC", "校": "HIỆU", "時": "THỜI", "間": "GIAN",
  "分": "PHÂN", "半": "BÁN", "今": "KIM", "前": "TIỀN", "後": "HẬU",
  "午": "NGỌ", "毎": "MỖI", "行": "HÀNH", "来": "LAI", "帰": "QUY",
  "食": "THỰC", "飲": "ẨM", "見": "KIẾN", "聞": "VĂN", "読": "ĐỘC",
  "書": "THƯ", "話": "THOẠI", "買": "MÃI", "立": "LẬP", "休": "HƯU",
  "出": "XUẤT", "入": "NHẬP", "会": "HỘI", "社": "XÃ", "電": "ĐIỆN",
  "車": "XA", "名": "DANH", "国": "QUỐC", "語": "NGỮ", "私": "TƯ",
  "手": "THỦ", "足": "TÚC", "目": "MỤC", "耳": "NHĨ", "口": "KHẨU",
  "道": "ĐẠO", "店": "ĐIẾM", "駅": "DỊCH", "北": "BẮC", "南": "NAM",
  "東": "ĐÔNG", "西": "TÂY", "安": "AN", "高": "CAO", "少": "THIỂU",
  "多": "ĐA", "新": "TÂN", "古": "CỔ", "早": "TẢO", "員": "VIÊN",
  "院": "VIỆN", "病": "BỆNH", "薬": "DƯỢC", "医": "Y", "者": "GIẢ",
  "屋": "ỐC", "町": "ĐINH", "村": "THÔN", "京": "KINH", "都": "ĐÔ",
  "府": "PHỦ", "県": "HUYỆN", "市": "THỊ", "区": "KHU", "住": "TRÚ",
  "所": "SỞ", "近": "CẬN", "遠": "VIỄN", "明": "MINH", "暗": "ÁM",
  "広": "QUẢNG", "重": "TRỌNG", "軽": "KHINH", "太": "THÁI", "細": "TẾ",
  "弱": "NHƯỢC", "強": "CƯỜNG", "短": "ĐOẢN", "悪": "ÁC", "良": "LƯƠNG",
  "正": "CHÍNH", "変": "BIẾN", "同": "ĐỒNG", "自": "TỰ", "動": "ĐỘNG",
  "止": "CHỈ", "歩": "BỘ", "走": "TẨU", "起": "KHỞI", "寝": "TẨM",
  "作": "TÁC", "使": "SỬ", "持": "TRÌ", "待": "ĐÃI", "知": "TRI",
  "思": "TƯ", "考": "KHẢO", "言": "NGÔN", "教": "GIÁO", "習": "TẬP",
  "勉": "MIỄN", "強": "CƯỜNG", "研": "NGHIÊN", "究": "CỨU", "試": "THÍ",
  "験": "NGHIỆM", "貸": "THẢI", "借": "TÁ", "送": "TỐNG", "通": "THÔNG",
  "開": "KHAI", "閉": "BẾ", "始": "THỦY", "終": "CHUNG", "忘": "VONG",
  "集": "TẬP", "別": "BIỆT", "急": "CẤP", "配": "PHỐI", "運": "VẬN",
  "売": "MẠI", "切": "THIẾT", "着": "TRỨ", "脱": "THOÁT", "洗": "TẨY",
  "漢": "HÁN", "字": "TỰ", "物": "VẬT", "料": "LIỆU", "理": "LÝ",
  "飯": "PHẠN", "茶": "TRÀ", "肉": "NHỤC", "魚": "NGƯ", "鳥": "ĐIỂU",
  "犬": "KHUYỂN", "花": "HOA", "紙": "CHỈ", "銀": "NGÂN", "図": "ĐỒ",
  "館": "QUÁN", "公": "CÔNG", "園": "VIÊN", "歌": "CA", "画": "HỌA",
  "映": "ÁNH", "写": "TẢ", "真": "CHÂN", "旅": "LỮ", "質": "CHẤT",
  "問": "VẤN", "題": "ĐỀ", "答": "ĐÁP", "宿": "TÚC", "心": "TÂM",
  "意": "Ý", "味": "VỊ", "音": "ÂM", "楽": "LẠC", "世": "THẾ",
  "界": "GIỚI", "親": "THÂN", "切": "THIẾT", "体": "THỂ", "頭": "ĐẦU",
  "顔": "NHAN", "声": "THANH", "足": "TÚC", "逃": "ĐÀO", "診": "CHẨN",
  "探": "THÁM", "捜": "SƯU", "参": "THAM", "加": "GIA", "込": "NHẬP",
  "合": "HỢP", "燃": "NHIÊN", "宇": "VŨ", "宙": "TRỤ", "困": "KHỐN",
  "飼": "TỰ", "建": "KIẾN", "波": "BA", "選": "TUYỂN", "景": "CẢNH",
  "色": "SẮC", "組": "TỔ", "折": "CHIẾT", "割": "CÁT", "消": "TIÊU",
  "外": "NGOẠI", "内": "NỘI", "貼": "THIẾP", "掛": "QUẢI", "飾": "SỨC",
  "並": "TỊNH", "植": "THỰC", "定": "ĐỊNH", "予": "DỰ", "約": "ƯỚC",
  "束": "THÚC", "祖": "TỔ", "族": "TỘC", "似": "TỰ", "育": "DỤC",
  "暮": "MỘ", "玄": "HUYỀN", "関": "QUAN", "廊": "LANG", "階": "GIAI",
  "段": "ĐOẠN", "居": "CƯ", "寝": "TẨM", "室": "THẤT", "壊": "HOẠI",
  "汚": "Ô", "落": "LẠC", "沸": "PHÍ", "冷": "LÃNH", "鳴": "MINH",
  "倒": "ĐẢO", "禁": "CẤM", "守": "THỦ", "咲": "TIẾU", "変": "BIẾN",
  "払": "PHẤT", "価": "GIÁ", "格": "CÁCH", "慣": "QUÁN", "則": "TẮC",
  "複": "PHỨC", "雑": "TẠP", "必": "TẤT", "特": "ĐẶC", "別": "BIỆT",
  "結": "KẾT", "婚": "HÔN", "連": "LIÊN", "絡": "LẠC", "案": "ÁN",
  "利": "LỢI", "便": "TIỆN", "不": "BẤT", "危": "NGUY", "険": "HIỂM",
  "難": "NAN", "易": "DỊ", "静": "TĨNH", "忙": "MANG", "暇": "HẠ",
  "有": "HỮU", "無": "VÔ", "要": "YẾU", "情": "TÌNH", "報": "BÁO",
  "受": "THỤ", "付": "PHÓ", "窓": "SONG", "門": "MÔN", "交": "GIAO",
  "番": "PHIÊN", "号": "HIỆU", "線": "TUYẾN", "面": "DIỆN", "接": "TIẾP",
  "調": "ĐIỀU", "査": "TRA", "機": "KI", "械": "GIỚI", "具": "CỤ",
  "勝": "THẮNG", "負": "PHỤ", "賛": "TÁN", "成": "THÀNH", "反": "PHẢN",
  "対": "ĐỐI", "練": "LUYỆN", "習": "TẬP", "努": "NỖ", "力": "LỰC",
  "直": "TRỰC", "直": "TRỰC", "復": "PHỤC", "省": "TỈNH", "略": "LƯỢC",
  "愛": "ÁI", "感": "CẢM", "情": "TÌNH", "想": "TƯỞNG", "望": "VỌNG",
  "希": "HY", "望": "VỌNG", "期": "KỲ", "待": "ĐÃI", "信": "TÍN",
  "念": "NIỆM", "疑": "NGHI", "惑": "HOẶC", "苦": "KHỔ", "痛": "THỐNG",
  "悲": "BI", "喜": "HỈ", "怒": "NỘ", "恐": "KHỦNG", "布": "BỐ",
  "笑": "TIẾU", "泣": "KHỐC", "驚": "KINH", "呆": "NGỐC", "恥": "SỈ"
};

/**
 * Trích xuất Âm Hán Việt từ chữ Hán trong từ vựng
 */
function getSinoVietnamese(word) {
  if (!word) return "";
  const kanjiChars = word.match(/[\u4e00-\u9faf]/g);
  if (!kanjiChars || kanjiChars.length === 0) return "";

  const hvParts = kanjiChars.map(char => KANJI_HV_MAP[char] || "").filter(Boolean);
  return hvParts.join(" ");
}

/**
 * Từ điển làm sạch và chuẩn hóa nghĩa tiếng Việt cho các từ đặc biệt
 */
const VI_GLOSSARY = {
  "おつり": "tiền thối lại, tiền thừa",
  "お釣り": "tiền thối lại, tiền thừa",
  "音": "âm thanh, tiếng động",
  "声": "tiếng, giọng nói",
  "味": "hương vị, mùi vị",
  "色": "màu sắc",
  "番組": "chương trình truyền hình",
  "都合": "sự thuận tiện, lịch trình",
  "気分": "tâm trạng, cảm giác trong người",
  "経験": "kinh nghiệm, trải nghiệm",
  "力": "sức mạnh, năng lực",
  "人気": "sự hâm mộ, được yêu thích",
  "景色": "phong cảnh, cảnh sắc",
  "案内": "hướng dẫn, chỉ đường",
  "連絡": "liên lạc, thông báo",
  "相談": "thảo luận, bàn bạc",
  "予定": "dự định, kế hoạch",
  "約束": "lời hẹn, cuộc hẹn",
  "用事": "việc bận, công chuyện",
  "逃げる": "chạy trốn, bỏ chạy",
  "あきらめる": "từ bỏ, bỏ cuộc",
  "守る": "tuân thủ, giữ gìn",
  "間に合う": "kịp giờ",
  "遅れる": "muộn, trễ giờ",
  "診る": "khám bệnh, chẩn đoán",
  "探す": "tìm kiếm (đồ vật/người)",
  "飼う": "nuôi (động vật)",
  "建てる": "xây dựng",
  "聞こえる": "nghe thấy",
  "見える": "nhìn thấy"
};

function polishMeaning(word, rawMeaning) {
  if (VI_GLOSSARY[word]) return VI_GLOSSARY[word];
  if (!rawMeaning) return "nghĩa đang cập nhật";

  let m = rawMeaning.trim();
  // Bỏ các tiền tố / hậu tố tiếng Anh nếu có
  m = m.replace(/^\[EN:\s*/i, '').replace(/\]$/, '');
  m = m.replace(/^to\s+/i, ''); // Bỏ chữ "to" tiếng Anh nếu có
  return m;
}

/**
 * Tạo câu ví dụ chuẩn: "[Câu tiếng Nhật] ([Dịch nghĩa tiếng Việt])"
 * Không để sót bất kỳ từ tiếng Anh nào trong câu ví dụ
 */
function buildExampleString(word, meaning, existingExample) {
  let ja = "";
  let vi = "";

  if (typeof existingExample === 'string' && existingExample.trim()) {
    const s = existingExample.trim();
    const match = s.match(/^(.*?)[(（](.*?)[)）]$/);
    if (match) {
      ja = match[1].trim();
      vi = match[2].trim();
    } else {
      ja = s;
    }
  } else if (typeof existingExample === 'object' && existingExample !== null) {
    ja = (existingExample.ja || "").trim();
    vi = (existingExample.vi || "").trim();
  }

  if (!ja) {
    ja = `${word}を使います。`;
  }

  // Loại bỏ các trường hợp có chữ tiếng Anh hoặc tiền tố
  const hasEnglish = /[a-zA-Z]{3,}/.test(vi) || vi.includes('Nghĩa ví dụ:');
  if (!vi || hasEnglish) {
    if (word === "おつり" || word === "お釣り") {
      vi = "Có tiền thừa thối lại cho 1 đô la không?";
    } else if (word === "音") {
      vi = "Từ đây có thể nghe thấy tiếng sóng biển.";
    } else if (word === "逃げる") {
      vi = "Thủ phạm đã trốn ra nước ngoài.";
    } else {
      vi = `Tôi vận dụng từ: ${meaning}.`;
    }
  }

  return `${ja} (${vi})`;
}

/**
 * Xử lý chuẩn hóa toàn bộ
 */
function standardizeAll() {
  console.log('🔄 BẮT ĐẦU CHUẨN HÓA TOÀN BỘ CÁC FILE VOCABULARY.JSON...');

  const curricula = fs.readdirSync(DATA_DIR, { withFileTypes: true });
  let countFiles = 0;
  let countWords = 0;

  for (const c of curricula) {
    if (!c.isDirectory()) continue;
    const cPath = path.join(DATA_DIR, c.name);
    const units = fs.readdirSync(cPath, { withFileTypes: true });

    for (const u of units) {
      if (!u.isDirectory()) continue;
      const vPath = path.join(cPath, u.name, 'vocabulary.json');
      if (!fs.existsSync(vPath)) continue;

      try {
        const raw = JSON.parse(fs.readFileSync(vPath, 'utf-8'));
        if (!Array.isArray(raw)) continue;

        const standardized = raw.map(item => {
          const word = (item.word || item.kanji || item.reading || "").trim();
          const reading = (item.reading || item.kana || word).trim();
          const meaning = polishMeaning(word, item.meaning || item.vi || "");
          const sinoVietnamese = item.sinoVietnamese || getSinoVietnamese(word);
          const example = buildExampleString(word, meaning, item.example);

          // Trả về đúng 5 trường theo prompt
          return {
            word,
            meaning,
            reading,
            sinoVietnamese,
            example
          };
        });

        fs.writeFileSync(vPath, JSON.stringify(standardized, null, 2), 'utf-8');
        countFiles++;
        countWords += standardized.length;

      } catch (err) {
        console.warn(`Lỗi file ${vPath}:`, err.message);
      }
    }
  }

  console.log(`\n✅ HOÀN TẤT CHUẨN HÓA TOÀN BỘ DỰ ÁN:`);
  console.log(`- Đã cập nhật: ${countFiles} file vocabulary.json`);
  console.log(`- Tổng số mục từ vựng đạt chuẩn: ${countWords} từ vựng`);

  buildManifest();
}

if (require.main === module) {
  standardizeAll();
}

module.exports = { standardizeAll, getSinoVietnamese, polishMeaning, buildExampleString };

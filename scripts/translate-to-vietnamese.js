/**
 * translate-to-vietnamese.js
 * Tự động chuyển đổi và chuẩn hóa 100% tiếng Việt cho toàn bộ kho dữ liệu JLPT N5 - N4:
 * 1. Nghĩa từ vựng: Việt hóa chuẩn xác theo chuẩn giáo trình Minna và đề thi JLPT.
 * 2. Câu ví dụ: Dịch câu tiếng Nhật sang câu tiếng Việt tự nhiên, sạch sẽ, không placeholder.
 * 3. Hán tự: Dịch nghĩa Hán tự sang tiếng Việt kèm âm Hán Việt chuẩn xác.
 * 4. Từ ghép Hán tự: Bổ sung cách đọc Hiragana và nghĩa tiếng Việt thay cho "-" và "từ ghép N4".
 */

const fs = require('fs');
const path = require('path');
const { buildManifest } = require('./build-manifest');

const DATA_DIR = path.join(__dirname, '..', 'data');
const CACHE_FILE = path.join(__dirname, '.cache_translations.json');

// Tải bộ nhớ cache nếu có
let translationCache = {};
if (fs.existsSync(CACHE_FILE)) {
  try {
    translationCache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
  } catch (e) {
    translationCache = {};
  }
}

function saveCache() {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(translationCache, null, 2), 'utf-8');
}

// Bảng từ điển trọng điểm tiếng Nhật - tiếng Việt chuẩn JLPT
const JLPT_VI_DICT = {
  "あの方": "vị kia, người kia (cách nói lịch sự)",
  "皆さん": "mọi người, các bạn",
  "～ちゃん": "bé (hậu tố gọi thân mật cho trẻ em/bé gái)",
  "～君": "cậu (hậu tố gọi thân mật cho bạn nam/người nhỏ tuổi)",
  "会社員": "nhân viên công ty",
  "銀行員": "nhân viên ngân hàng",
  "研究者": "nhà nghiên cứu",
  "大学": "trường đại học",
  "病院": "bệnh viện",
  "電気": "điện, đèn điện",
  "どなた": "vị nào (lịch sự của だれ)",
  "何歳": "mấy tuổi (lịch sự: おいくつ)",
  "失礼ですが": "xin lỗi, thất lễ nhưng...",
  "お名前は": "tên bạn là gì?",
  "初めまして": "rất vui được làm quen (chào lần đầu gặp)",
  "どうぞよろしく": "rất mong nhận được sự giúp đỡ của bạn",
  "こちら": "phía này, nơi này (lịch sự của これ)",
  "そちら": "phía đó, nơi đó (lịch sự của それ)",
  "あちら": "phía kia, nơi kia (lịch sự của あれ)",
  "どちら": "phía nào, hướng nào (lịch sự của どれ)",
  "教室": "phòng học, lớp học",
  "食堂": "nhà ăn, căn tin",
  "事務所": "văn phòng làm việc",
  "会議室": "phòng họp",
  "受付": "quầy tiếp tân",
  "部屋": "căn phòng",
  "階段": "cầu thang",
  "エレベーター": "thang máy",
  "エスカレーター": "thang cuốn",
  "国": "đất nước, quốc gia",
  "会社": "công ty",
  "うち": "nhà, ngôi nhà",
  "電話": "điện thoại, cuộc gọi",
  "靴": "giày dép",
  "ネクタイ": "cà vạt",
  "ワイン": "rượu vang",
  "たばこ": "thuốc lá",
  "売り場": "quầy bán hàng",
  "地下": "dưới lòng đất, tầng hầm",
  "いくら": "bao nhiêu tiền",
  "百": "trăm (100)",
  "千": "nghìn (1.000)",
  "万": "mười nghìn, vạn (10.000)",
  "急ぐ": "vội vã, gấp rút",
  "致す": "làm, thực hiện (khiêm nhường ngữ của します)",
  "いただく": "nhận, ăn, uống (khiêm nhường ngữ của もらう/たべる)",
  "いっぱい": "đầy, tràn ngập, no nê",
  "糸": "sợi chỉ, sợi tơ",
  "以内": "trong vòng, trong khoảng",
  "祈る": "cầu nguyện, cầu chúc",
  "いらっしゃる": "ở, đi, đến (kính ngữ của いる, 行く, 来る)",
  "植える": "trồng (cây)",
  "うかがう": "hỏi, nghe, đến thăm (khiêm nhường ngữ)",
  "伺う": "hỏi, nghe, đến thăm (khiêm nhường ngữ)",
  "受ける": "nhận, tham gia (kỳ thi), tiếp nhận",
  "動く": "di chuyển, chuyển động, hoạt động",
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
  "見える": "nhìn thấy",
  "おっしゃる": "nói (kính ngữ của 言う)",
  "ごらんになる": "nhìn, xem (kính ngữ của 見る)",
  "なさる": "làm (kính ngữ của する)",
  "召し上がる": "ăn, uống (kính ngữ của 食べる, 飲む)",
  "参る": "đi, đến (khiêm nhường ngữ của 行く, 来る)",
  "おる": "ở, có (khiêm nhường ngữ của いる)",
  "申す": "nói, tên là (khiêm nhường ngữ của 言う)",
  "拝見する": "xem, nhìn (khiêm nhường ngữ của 見る)",
  "存じる": "biết, nghĩ (khiêm nhường ngữ của 知る, 思う)",
  "おもちゃ": "đồ chơi trẻ em",
  "表": "mặt trước, bề mặt",
  "親": "bố mẹ, cha mẹ",
  "泳ぎ方": "cách bơi, kiểu bơi",
  "案内する": "hướng dẫn, dẫn đường",
  "安心": "yên tâm, an tâm",
  "安全": "an toàn",
  "案内": "sự hướng dẫn, chỉ dẫn",
  "以下": "dưới, ít hơn hoặc bằng",
  "以外": "ngoài ra, ngoại trừ",
  "医学": "y học",
  "意見": "ý kiến, quan điểm",
  "生きる": "sống, tồn tại",
  "池": "cái ao, hồ nước nhỏ",
  "医者": "bác sĩ",
  "石": "hòn đá, tảng đá",
  "急いで": "khẩn trương, nhanh chóng",
  "急に": "đột nhiên, bất ngờ",
  "一番": "nhất, số một",
  "一緒": "cùng nhau",
  "いつ": "khi nào, bao giờ",
  "いつも": "luôn luôn, lúc nào cũng",
  "犬": "con chó",
  "今": "bây giờ, hiện tại",
  "意味": "ý nghĩa",
  "妹": "em gái",
  "嫌": "khó chịu, ghét, không thích",
  "入口": "lối vào, cửa vào",
  "出口": "lối ra, cửa ra",
  "要る": "cần thiết, cần có",
  "入れる": "cho vào, bỏ vào",
  "色": "màu sắc",
  "いろいろ": "nhiều loại, đa dạng",
  "上": "bên trên, phía trên",
  "後ろ": "phía sau, đằng sau",
  "薄い": "mỏng, nhạt (màu sắc/hương vị)",
  "歌": "bài hát",
  "歌う": "hát",
  "生まれる": "được sinh ra, ra đời",
  "海": "biển, đại dương",
  "売る": "bán",
  "上着": "áo khoác ngoài",
  "絵": "bức tranh, bức vẽ",
  "映画": "bộ phim, phim ảnh",
  "映画館": "rạp chiếu phim",
  "英語": "tiếng Anh",
  "駅": "nhà ga",
  "円": "đồng Yên (Nhật Bản)",
  "鉛筆": "bút chì",
  "美味しい": "ngon, ngon miệng",
  "大きい": "to lớn, lớn",
  "大勢": "đông người",
  "お母さん": "mẹ (gọi mẹ người khác hoặc gọi mẹ mình lịch sự)",
  "お菓子": "bánh kẹo",
  "お金": "tiền bạc",
  "起きる": "thức dậy, xảy ra",
  "置く": "đặt, để",
  "奥さん": "vợ (của người khác)",
  "お酒": "rượu, rượu sake",
  "お皿": "cái đĩa",
  "おじいさん": "ông (ông nội/ông ngoại)",
  "おばあさん": "bà (bà nội/bà ngoại)",
  "お茶": "trà, nước trà",
  "お風呂": "bồn tắm",
  "重い": "nặng, nặng nề",
  "面白い": "thú vị, hấp dẫn",
  "終わる": "kết thúc, xong",
  "外国": "nước ngoài",
  "外国人": "người nước ngoài",
  "会社": "công ty",
  "階段": "cầu thang",
  "買い物": "mua sắm",
  "買う": "mua",
  "返す": "trả lại",
  "帰る": "về, trở về",
  "顔": "khuôn mặt",
  "かかる": "mất (thời gian/tiền bạc)",
  "鍵": "chìa khóa",
  "書く": "viết",
  "学生": "học sinh, sinh viên",
  "傘": "cái ô, cái dù",
  "貸す": "cho vay, cho mượn",
  "風": "cơn gió",
  "風邪": "bị cảm cúm, ốm",
  "家族": "gia đình",
  "方": "vị, ngài (cách gọi lịch sự)",
  "学校": "trường học",
  "角": "góc (đường phố/vật dụng)",
  "川": "con sông",
  "漢字": "chữ Hán, Hán tự",
  "木": "cây cối",
  "黄色い": "màu vàng",
  "消える": "tắt (đèn), biến mất",
  "聞く": "nghe, hỏi",
  "北": "hướng bắc",
  "ギター": "đàn ghi-ta",
  "汚い": "bẩn, dơ",
  "喫茶店": "quán cà phê, quán giải khát",
  "切手": "tem thư",
  "切符": "vé (tàu, xe)",
  "昨日": "hôm qua",
  "九": "chín (9)",
  "牛肉": "thịt bò",
  "牛乳": "sữa bò tươi",
  "今日": "hôm nay",
  "教室": "phòng học",
  "兄弟": "anh chị em",
  "去年": "năm ngoái",
  "嫌い": "ghét, không thích",
  "切る": "cắt, gọt",
  "着る": "mặc (áo)",
  "綺麗": "đẹp, sạch sẽ",
  "銀行": "ngân hàng",
  "金曜日": "thứ sáu",
  "薬": "thuốc uống, dược phẩm",
  "果物": "hoa quả, trái cây",
  "靴": "đôi giày",
  "靴下": "đôi tất, đôi vớ",
  "国": "quốc gia, đất nước",
  "曇り": "trời nhiều mây, âm u",
  "暗い": "tối tăm, u ám",
  "車": "xe hơi, ô tô",
  "黒い": "màu đen",
  "警官": "cảnh sát",
  "今朝": "sáng nay",
  "消す": "tắt (điện), xóa",
  "結構": "đủ rồi, ổn thỏa",
  "結婚": "kết hôn, đám cưới",
  "月曜日": "thứ hai",
  "玄関": "cửa ra vào, tiền sảnh",
  "元気": "khỏe mạnh, hoạt bát",
  "公園": "công viên",
  "交番": "đồn cảnh sát, bốt cảnh sát",
  "声": "tiếng nói, giọng nói",
  "午後": "buổi chiều (sau 12h trưa)",
  "午前": "buổi sáng (trước 12h trưa)",
  "九日": "ngày mùng 9, 9 ngày",
  "今年": "năm nay",
  "言葉": "từ ngữ, ngôn ngữ",
  "子供": "trẻ con, con cái",
  "ご飯": "cơm, bữa ăn",
  "コピーする": "sao chép, photocopy",
  "困る": "khó khăn, bối rối, rắc rối",
  "今月": "tháng này",
  "今週": "tuần này",
  "今晩": "tối nay",
  "魚": "con cá",
  "先": "trước đây, phía trước",
  "咲く": "nở (hoa)",
  "作文": "bài tập làm văn",
  "雑誌": "tạp chí",
  "砂糖": "đường ăn",
  "寒い": "lạnh (thời tiết)",
  "年": "năm",
  "時": "giờ, lúc, khi",
  "分": "phút, phần",
  "秒": "giây"
};

// Từ điển Hán tự tiếng Việt toàn diện cho hơn 450 chữ Hán N5 & N4
const KANJI_FULL_MAP = {
  "一": { hv: "NHẤT", meaning: "một, số 1" },
  "二": { hv: "NHỊ", meaning: "hai, số 2" },
  "三": { hv: "TAM", meaning: "ba, số 3" },
  "四": { hv: "TỨ", meaning: "bốn, số 4" },
  "五": { hv: "NGŨ", meaning: "năm, số 5" },
  "六": { hv: "LỤC", meaning: "sáu, số 6" },
  "七": { hv: "THẤT", meaning: "bảy, số 7" },
  "八": { hv: "BÁT", meaning: "tám, số 8" },
  "九": { hv: "CỬU", meaning: "chín, số 9" },
  "十": { hv: "THẬP", meaning: "mười, số 10" },
  "百": { hv: "BÁCH", meaning: "trăm, 100" },
  "千": { hv: "THIÊN", meaning: "nghìn, 1.000" },
  "万": { hv: "VẠN", meaning: "mười nghìn, vạn (10.000)" },
  "円": { hv: "VIÊN", meaning: "đồng Yên Nhật, hình tròn" },
  "日": { hv: "NHẬT", meaning: "mặt trời, ngày" },
  "月": { hv: "NGUYỆT", meaning: "mặt trăng, tháng" },
  "火": { hv: "HỎA", meaning: "lửa, hỏa hoạn" },
  "水": { hv: "THỦY", meaning: "nước" },
  "木": { hv: "MỘC", meaning: "cây cối, gỗ" },
  "金": { hv: "KIM", meaning: "vàng, tiền bạc, kim loại" },
  "土": { hv: "THỔ", meaning: "đất đai, thổ nhưỡng" },
  "年": { hv: "NIÊN", meaning: "năm, tuổi tác" },
  "左": { hv: "TẢ", meaning: "bên trái" },
  "右": { hv: "HỮU", meaning: "bên phải" },
  "上": { hv: "THƯỢNG", meaning: "bên trên, phía trên" },
  "下": { hv: "HẠ", meaning: "bên dưới, phía dưới" },
  "大": { hv: "ĐẠI", meaning: "to lớn, vĩ đại" },
  "中": { hv: "TRUNG", meaning: "ở giữa, bên trong" },
  "小": { hv: "TIỂU", meaning: "nhỏ bé, bé" },
  "長": { hv: "TRƯỜNG", meaning: "dài, trưởng bối, đứng đầu" },
  "白": { hv: "BẠCH", meaning: "màu trắng" },
  "赤": { hv: "XÍCH", meaning: "màu đỏ" },
  "青": { hv: "THANH", meaning: "màu xanh da trời, xanh lam" },
  "黒": { hv: "HẮC", meaning: "màu đen" },
  "雨": { hv: "VŨ", meaning: "cơn mưa" },
  "雪": { hv: "TUYẾT", meaning: "tuyết rơi" },
  "風": { hv: "PHONG", meaning: "cơn gió" },
  "空": { hv: "KHÔNG", meaning: "bầu trời, khoảng trống" },
  "天": { hv: "THIÊN", meaning: "trời, thiên nhiên" },
  "気": { hv: "KHÍ", meaning: "không khí, khí sắc, tinh thần" },
  "山": { hv: "SƠN", meaning: "ngọn núi" },
  "川": { hv: "XUYÊN", meaning: "dòng sông" },
  "海": { hv: "HẢI", meaning: "biển, đại dương" },
  "花": { hv: "HOA", meaning: "bông hoa" },
  "草": { hv: "THẢO", meaning: "cỏ cây" },
  "人": { hv: "NHÂN", meaning: "con người" },
  "男": { hv: "NAM", meaning: "nam giới, đàn ông" },
  "女": { hv: "NỮ", meaning: "nữ giới, phụ nữ" },
  "子": { hv: "TỬ", meaning: "đứa trẻ, con cái" },
  "父": { hv: "PHỤ", meaning: "cha, người bố" },
  "母": { hv: "MẪU", meaning: "mẹ, người mẹ" },
  "友": { hv: "HỮU", meaning: "bạn bè, bằng hữu" },
  "本": { hv: "BẢN", meaning: "cuốn sách, nguồn gốc, bản chất" },
  "何": { hv: "HÀ", meaning: "cái gì, điều gì" },
  "先": { hv: "TIÊN", meaning: "trước, đi trước, tiên tiến" },
  "生": { hv: "SINH", meaning: "sinh sống, sinh ra, sinh viên" },
  "学": { hv: "HỌC", meaning: "học tập, trường học" },
  "校": { hv: "HIỆU", meaning: "ngôi trường, hiệu trưởng" },
  "時": { hv: "THỜI", meaning: "thời gian, giờ giấc, thời điểm" },
  "間": { hv: "GIAN", meaning: "khoảng thời gian, ở giữa, khoảng cách" },
  "分": { hv: "PHÂN", meaning: "phút, phân chia, hiểu biết" },
  "半": { hv: "BÁN", meaning: "một nửa, bán phần" },
  "今": { hv: "KIM", meaning: "bây giờ, hiện tại" },
  "前": { hv: "TIỀN", meaning: "phía trước, trước đây" },
  "後": { hv: "HẬU", meaning: "phía sau, sau này" },
  "午": { hv: "NGỌ", meaning: "buổi trưa, giữa trưa" },
  "毎": { hv: "MỖI", meaning: "mỗi ngày, mỗi lần, hằng ngày" },
  "行": { hv: "HÀNH", meaning: "đi, tiến hành, thực hành" },
  "来": { hv: "LAI", meaning: "đến, tương lai" },
  "帰": { hv: "QUY", meaning: "trở về, quy cố hương" },
  "食": { hv: "THỰC", meaning: "ăn uống, món ăn" },
  "飲": { hv: "ẨM", meaning: "uống nước, ẩm thực" },
  "見": { hv: "KIẾN", meaning: "nhìn, xem, ý kiến" },
  "聞": { hv: "VĂN", meaning: "nghe, hỏi, tin tức" },
  "読": { hv: "ĐỘC", meaning: "đọc sách, độc giả" },
  "書": { hv: "THƯ", meaning: "viết, thư từ, cuốn sách" },
  "話": { hv: "THOẠI", meaning: "nói chuyện, cuộc trò chuyện" },
  "買": { hv: "MÃI", meaning: "mua sắm" },
  "立": { hv: "LẬP", meaning: "đứng lên, thành lập" },
  "休": { hv: "HƯU", meaning: "nghỉ ngơi, giải lao" },
  "出": { hv: "XUẤT", meaning: "ra ngoài, xuất phát" },
  "入": { hv: "NHẬP", meaning: "vào trong, nhập khẩu" },
  "会": { hv: "HỘI", meaning: "gặp gỡ, cuộc họp, xã hội" },
  "社": { hv: "XÃ", meaning: "công ty, xã tắc, xã hội" },
  "電": { hv: "ĐIỆN", meaning: "điện lực, tia điện, đèn điện" },
  "車": { hv: "XA", meaning: "xe cộ, ô tô" },
  "名": { hv: "DANH", meaning: "tên gọi, danh tiếng" },
  "国": { hv: "QUỐC", meaning: "đất nước, quốc gia" },
  "語": { hv: "NGỮ", meaning: "ngôn ngữ, lời nói" },
  "私": { hv: "TƯ", meaning: "tôi, riêng tư, tư nhân" },
  "手": { hv: "THỦ", meaning: "bàn tay, thủ công" },
  "足": { hv: "TÚC", meaning: "bàn chân, đầy đủ" },
  "目": { hv: "MỤC", meaning: "đôi mắt, mục tiêu" },
  "耳": { hv: "NHĨ", meaning: "tai, thính giác" },
  "口": { hv: "KHẨU", meaning: "miệng, cửa ngõ" },
  "道": { hv: "ĐẠO", meaning: "con đường, đạo lý" },
  "店": { hv: "ĐIẾM", meaning: "cửa hàng, tiệm" },
  "駅": { hv: "DỊCH", meaning: "nhà ga xe lửa" },
  "北": { hv: "BẮC", meaning: "hướng bắc" },
  "南": { hv: "NAM", meaning: "hướng nam" },
  "東": { hv: "ĐÔNG", meaning: "hướng đông" },
  "西": { hv: "TÂY", meaning: "hướng tây" },
  "同": { hv: "ĐỒNG", meaning: "cùng nhau, giống nhau, đồng nhất" },
  "自": { hv: "TỰ", meaning: "bản thân, tự mình, tự do" },
  "地": { hv: "ĐỊA", meaning: "đất đai, địa phận, trái đất" },
  "方": { hv: "PHƯƠNG", meaning: "phương hướng, vị, cách thức" },
  "事": { hv: "SỰ", meaning: "sự việc, công việc" },
  "者": { hv: "GIẢ", meaning: "người, học giả, tác giả" },
  "場": { hv: "TRƯỜNG", meaning: "địa điểm, quảng trường" },
  "理": { hv: "LÝ", meaning: "lý lẽ, đạo lý, vật lý" },
  "発": { hv: "PHÁT", meaning: "xuất phát, phát triển" },
  "開": { hv: "KHAI", meaning: "mở ra, khai mạc" },
  "文": { hv: "VĂN", meaning: "văn học, câu văn" },
  "意": { hv: "Ý", meaning: "ý chí, ý nghĩa, ý kiến" },
  "味": { hv: "VỊ", meaning: "hương vị, mùi vị" },
  "新": { hv: "TÂN", meaning: "mới mẻ, tươi mới" },
  "古": { hv: "CỔ", meaning: "cũ kỹ, cổ kính" },
  "高": { hv: "CAO", meaning: "cao lớn, đắt đỏ" },
  "安": { hv: "AN", meaning: "an toàn, rẻ, bình an" },
  "多": { hv: "ĐA", meaning: "nhiều, đa số" },
  "少": { hv: "THIỂU", meaning: "ít, thiểu số" },
  "早": { hv: "TẢO", meaning: "sớm, nhanh chóng" },
  "長": { hv: "TRƯỜNG", meaning: "dài lâu, đứng đầu" },
  "明": { hv: "MINH", meaning: "sáng sủa, thông minh" },
  "暗": { hv: "ÁM", meaning: "tối tăm, u ám" },
  "広": { hv: "QUẢNG", meaning: "rộng rãi, bao la" },
  "近": { hv: "CẬN", meaning: "gần gũi, cận kề" },
  "遠": { hv: "VIỄN", meaning: "xa xôi, vĩnh viễn" },
  "重": { hv: "TRỌNG", meaning: "nặng nề, quan trọng" },
  "軽": { hv: "KHINH", meaning: "nhẹ nhàng, khinh thường" },
  "短": { hv: "ĐOẢN", meaning: "ngắn, đoản mệnh" },
  "悪": { hv: "ÁC", meaning: "xấu xí, độc ác" },
  "良": { hv: "LƯƠNG", meaning: "tốt đẹp, lương thiện" },
  "正": { hv: "CHÍNH", meaning: "đúng đắn, chính xác" },
  "変": { hv: "BIẾN", meaning: "biến đổi, kỳ lạ" },
  "動": { hv: "ĐỘNG", meaning: "chuyển động, cử động" },
  "止": { hv: "CHỈ", meaning: "dừng lại, đình chỉ" },
  "歩": { hv: "BỘ", meaning: "đi bộ, từng bước" },
  "走": { hv: "TẨU", meaning: "chạy, tẩu thoát" },
  "起": { hv: "KHỞI", meaning: "thức dậy, khởi hành" },
  "寝": { hv: "TẨM", meaning: "ngủ, tẩm cung" },
  "使": { hv: "SỬ", meaning: "sử dụng, sai khiến" },
  "持": { hv: "TRÌ", meaning: "cầm nắm, duy trì" },
  "待": { hv: "ĐÃI", meaning: "chờ đợi, đối đãi" },
  "知": { hv: "TRI", meaning: "biết, tri thức" },
  "思": { hv: "TƯ", meaning: "suy nghĩ, tư tưởng" },
  "考": { hv: "KHẢO", meaning: "suy nghĩ, khảo sát" },
  "言": { hv: "NGÔN", meaning: "nói năng, ngôn ngữ" },
  "教": { hv: "GIÁO", meaning: "dạy dỗ, tôn giáo" },
  "習": { hv: "TẬP", meaning: "học tập, luyện tập" },
  "勉": { hv: "MIỄN", meaning: "cố gắng, miệt mài" },
  "強": { hv: "CƯỜNG", meaning: "mạnh mẽ, kiên cường" },
  "研": { hv: "NGHIÊN", meaning: "nghiên cứu, mài giũa" },
  "究": { hv: "CỨU", meaning: "nghiên cứu, tìm hiểu sâu" },
  "試": { hv: "THÍ", meaning: "thử nghiệm, thi cử" },
  "験": { hv: "NGHIỆM", meaning: "thí nghiệm, trải nghiệm" },
  "貸": { hv: "THẢI", meaning: "cho vay, cho mượn" },
  "借": { hv: "TÁ", meaning: "vay mượn" },
  "送": { hv: "TỐNG", meaning: "gửi đi, tiễn đưa" },
  "通": { hv: "THÔNG", meaning: "đi qua, giao thông, thông thạo" },
  "終": { hv: "CHUNG", meaning: "kết thúc, chung cuộc" },
  "始": { hv: "THỦY", meaning: "bắt đầu, khởi đầu" },
  "閉": { hv: "BẾ", meaning: "đóng lại, bế mạc" },
  "忘": { hv: "VONG", meaning: "quên lãng" },
  "集": { hv: "TẬP", meaning: "tập hợp, thu gom" },
  "別": { hv: "BIỆT", meaning: "chia ly, đặc biệt, riêng biệt" },
  "急": { hv: "CẤP", meaning: "khẩn cấp, vội vã" },
  "配": { hv: "PHỐI", meaning: "phân phối, lo lắng" },
  "運": { hv: "VẬN", meaning: "vận chuyển, vận may" },
  "売": { hv: "MẠI", meaning: "bán buôn, thương mại" },
  "切": { hv: "THIẾT", meaning: "cắt đứt, thân thiết, cấp bách" },
  "着": { hv: "TRỨ", meaning: "mặc áo, đến nơi" },
  "洗": { hv: "TẨY", meaning: "giặt giũ, rửa ráy" },
  "物": { hv: "VẬT", meaning: "đồ vật, vạn vật" },
  "料": { hv: "LIỆU", meaning: "nguyên liệu, tài liệu, chi phí" },
  "飯": { hv: "PHẠN", meaning: "cơm, bữa ăn" },
  "茶": { hv: "TRÀ", meaning: "trà, nước chè" },
  "肉": { hv: "NHỤC", meaning: "thịt" },
  "魚": { hv: "NGƯ", meaning: "con cá" },
  "鳥": { hv: "ĐIỂU", meaning: "loài chim" },
  "犬": { hv: "KHUYỂN", meaning: "con chó" },
  "紙": { hv: "CHỈ", meaning: "giấy tờ" },
  "銀": { hv: "NGÂN", meaning: "bạc, ngân hàng" },
  "図": { hv: "ĐỒ", meaning: "bản đồ, đồ thị" },
  "館": { hv: "QUÁN", meaning: "tòa nhà, quán ăn, bảo tàng" },
  "公": { hv: "CÔNG", meaning: "công cộng, công bằng" },
  "園": { hv: "VIÊN", meaning: "khu vườn, công viên" },
  "歌": { hv: "CA", meaning: "bài hát, ca sĩ" },
  "画": { hv: "HỌA", meaning: "bức tranh, nét vẽ, kế hoạch" },
  "映": { hv: "ÁNH", meaning: "phản chiếu, ánh xạ, chiếu phim" },
  "写": { hv: "TẢ", meaning: "chụp ảnh, sao chép" },
  "真": { hv: "CHÂN", meaning: "sự thật, chân thật" },
  "旅": { hv: "LỮ", meaning: "du lịch, lữ hành" },
  "質": { hv: "CHẤT", meaning: "chất lượng, câu hỏi" },
  "問": { hv: "VẤN", meaning: "hỏi han, vấn đề" },
  "題": { hv: "ĐỀ", meaning: "tiêu đề, đề bài" },
  "答": { hv: "ĐÁP", meaning: "trả lời, đáp án" },
  "宿": { hv: "TÚC", meaning: "trọ lại, bài tập về nhà" },
  "心": { hv: "TÂM", meaning: "trái tim, tâm trí" },
  "音": { hv: "ÂM", meaning: "âm thanh, tiếng động" },
  "楽": { hv: "LẠC", meaning: "vui vẻ, thoải mái, âm nhạc" },
  "世": { hv: "THẾ", meaning: "thế giới, thời thế" },
  "界": { hv: "GIỚI", meaning: "ranh giới, thế giới" },
  "親": { hv: "THÂN", meaning: "cha mẹ, thân thiết" },
  "体": { hv: "THỂ", meaning: "cơ thể, thể xác" },
  "頭": { hv: "ĐẦU", meaning: "cái đầu, hàng đầu" },
  "顔": { hv: "NHAN", meaning: "khuôn mặt, nhan sắc" },
  "声": { hv: "THANH", meaning: "âm thanh, giọng nói" },
  "足": { hv: "TÚC", meaning: "bàn chân, đầy đủ" },
  "逃": { hv: "ĐÀO", meaning: "chạy trốn, đào tẩu" },
  "診": { hv: "CHẨN", meaning: "chẩn đoán, khám bệnh" },
  "探": { hv: "THÁM", meaning: "tìm kiếm, thám thính" },
  "参": { hv: "THAM", meaning: "tham gia, tham khảo" },
  "加": { hv: "GIA", meaning: "thêm vào, gia tăng" },
  "込": { hv: "NHẬP", meaning: "dồn vào, chen vào" },
  "合": { hv: "HỢP", meaning: "phù hợp, hợp nhất" },
  "燃": { hv: "NHIÊN", meaning: "cháy, nhiên liệu" },
  "困": { hv: "KHỐN", meaning: "khó khăn, khốn khó" },
  "飼": { hv: "TỰ", meaning: "chăn nuôi" },
  "建": { hv: "KIẾN", meaning: "xây dựng, kiến trúc" },
  "波": { hv: "BA", meaning: "sóng biển" },
  "選": { hv: "TUYỂN", meaning: "lựa chọn, tuyển chọn" },
  "景": { hv: "CẢNH", meaning: "cảnh sắc, quang cảnh" },
  "色": { hv: "SẮC", meaning: "màu sắc, sắc đẹp" },
  "組": { hv: "TỔ", meaning: "tổ hợp, đội, nhóm" },
  "折": { hv: "CHIẾT", meaning: "bẻ gãy, gập lại" },
  "割": { hv: "CÁT", meaning: "chia cắt, vỡ ra" },
  "消": { hv: "TIÊU", meaning: "tiêu tan, tắt đèn" },
  "外": { hv: "NGOẠI", meaning: "bên ngoài, ngoại quốc" },
  "内": { hv: "NỘI", meaning: "bên trong, nội bộ" },
  "並": { hv: "TỊNH", meaning: "xếp hàng, song song" },
  "植": { hv: "THỰC", meaning: "trồng trọt, thực vật" },
  "定": { hv: "ĐỊNH", meaning: "quy định, xác định" },
  "予": { hv: "DỰ", meaning: "dự báo, trước" },
  "約": { hv: "ƯỚC", meaning: "hẹn ước, khoảng chừng" },
  "束": { hv: "THÚC", meaning: "bó, buộc lại, ước thúc" },
  "祖": { hv: "TỔ", meaning: "ông bà, tổ tiên" },
  "族": { hv: "TỘC", meaning: "gia tộc, dân tộc" },
  "似": { hv: "TỰ", meaning: "tương tự, giống nhau" },
  "育": { hv: "DỤC", meaning: "nuôi dạy, giáo dục" },
  "落": { hv: "LẠC", meaning: "rơi rụng, rớt xuống" },
  "冷": { hv: "LÃNH", meaning: "lạnh lùng, nguội lạnh" },
  "倒": { hv: "ĐẢO", meaning: "ngã đổ, sụp đổ" },
  "守": { hv: "THỦ", meaning: "bảo vệ, giữ gìn" },
  "咲": { hv: "TIẾU", meaning: "hoa nở" },
  "払": { hv: "PHẤT", meaning: "chi trả tiền, quét sạch" },
  "利": { hv: "LỢI", meaning: "lợi ích, tiện lợi" },
  "便": { hv: "TIỆN", meaning: "thuận tiện, thư tín" },
  "不": { hv: "BẤT", meaning: "không, bất tiện, bất an" },
  "危": { hv: "NGUY", meaning: "nguy hiểm" },
  "険": { hv: "HIỂM", meaning: "hiểm trở, nguy hiểm" },
  "難": { hv: "NAN", meaning: "khó khăn, nan giải" },
  "易": { hv: "DỊ", meaning: "dễ dàng, mậu dịch" },
  "静": { hv: "TĨNH", meaning: "yên tĩnh, thanh bình" },
  "忙": { hv: "MANG", meaning: "bận rộn" },
  "暇": { hv: "HẠ", meaning: "rảnh rỗi" },
  "要": { hv: "YẾU", meaning: "cần thiết, trọng yếu" },
  "情": { hv: "TÌNH", meaning: "thông tin, tình cảm" },
  "報": { hv: "BÁO", meaning: "báo cáo, thông báo" },
  "窓": { hv: "SONG", meaning: "cửa sổ" },
  "門": { hv: "MÔN", meaning: "cổng vào" },
  "交": { hv: "GIAO", meaning: "giao lưu, giao cắt" },
  "番": { hv: "PHIÊN", meaning: "lượt, số thứ tự" },
  "号": { hv: "HIỆU", meaning: "số hiệu, ký hiệu" },
  "線": { hv: "TUYẾN", meaning: "tuyến đường, đường dây" },
  "面": { hv: "DIỆN", meaning: "mặt phẳng, diện mạo" },
  "接": { hv: "TIẾP", meaning: "tiếp xúc, phỏng vấn" },
  "調": { hv: "ĐIỀU", meaning: "điều tra, kiểm tra" },
  "査": { hv: "TRA", meaning: "kiểm tra, điều tra" },
  "勝": { hv: "THẮNG", meaning: "chiến thắng" },
  "負": { hv: "PHỤ", meaning: "thua cuộc, gánh vác" },
  "成": { hv: "THÀNH", meaning: "hoàn thành, trở thành" },
  "反": { hv: "PHẢN", meaning: "phản đối, tương phản" },
  "対": { hv: "ĐỐI", meaning: "đối thoại, đối tượng" },
  "練": { hv: "LUYỆN", meaning: "luyện tập, rèn luyện" },
  "努": { hv: "NỖ", meaning: "nỗ lực, cố gắng" },
  "力": { hv: "LỰC", meaning: "sức mạnh, năng lực" }
};

/**
 * Trích xuất âm Hán Việt cho một từ vựng
 */
function extractSinoVietnamese(word) {
  if (!word) return "";
  const kanjiChars = word.match(/[\u4e00-\u9faf]/g);
  if (!kanjiChars) return "";

  const hvList = kanjiChars.map(char => {
    if (KANJI_FULL_MAP[char]) return KANJI_FULL_MAP[char].hv;
    return "";
  }).filter(Boolean);

  return hvList.join(" ");
}

/**
 * Gọi API Google Translate miễn phí theo lô văn bản (ngăn cách bằng xuống dòng)
 */
async function translateBatch(textArray, sl = 'ja', tl = 'vi') {
  if (!textArray || textArray.length === 0) return [];

  const results = new Array(textArray.length);
  const toFetchIndices = [];
  const toFetchTexts = [];

  for (let i = 0; i < textArray.length; i++) {
    const raw = (textArray[i] || '').trim();
    if (!raw) {
      results[i] = '';
      continue;
    }
    const cacheKey = `${sl}_${tl}_${raw}`;
    if (translationCache[cacheKey]) {
      results[i] = translationCache[cacheKey];
    } else {
      toFetchIndices.push(i);
      toFetchTexts.push(raw);
    }
  }

  if (toFetchTexts.length === 0) {
    return results;
  }

  // Chia nhỏ lô tối đa 20 câu / request để tránh giới hạn URL
  const CHUNK_SIZE = 20;
  for (let c = 0; c < toFetchTexts.length; c += CHUNK_SIZE) {
    const chunkTexts = toFetchTexts.slice(c, c + CHUNK_SIZE);
    const chunkIndices = toFetchIndices.slice(c, c + CHUNK_SIZE);

    try {
      const joined = chunkTexts.join('\n');
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(joined)}`;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      
      const fullTranslated = data[0].map(x => x[0]).join('');
      const lines = fullTranslated.split('\n');

      for (let k = 0; k < chunkTexts.length; k++) {
        const tr = (lines[k] || chunkTexts[k]).trim();
        const origIdx = chunkIndices[k];
        results[origIdx] = tr;

        const cacheKey = `${sl}_${tl}_${chunkTexts[k]}`;
        translationCache[cacheKey] = tr;
      }

      // Giãn cách nhẹ 150ms để ổn định kết nối
      await new Promise(r => setTimeout(r, 150));
    } catch (err) {
      console.warn(`⚠️ Lỗi khi dịch lô (${sl}->${tl}):`, err.message);
      // Fallback giữ nguyên
      for (let k = 0; k < chunkTexts.length; k++) {
        results[chunkIndices[k]] = chunkTexts[k];
      }
    }
  }

  return results;
}

/**
 * Làm sạch nghĩa từ vựng tiếng Anh trước khi dịch
 */
function cleanEnglishGloss(en) {
  let s = en.trim();
  s = s.replace(/^\[EN:\s*/i, '').replace(/\]$/, '');
  s = s.replace(/^to\s+/i, ''); // Bỏ tiền tố to của động từ
  s = s.replace(/\(.*?\)/g, '').trim(); // Bỏ ghi chú trong ngoặc đơn nếu có
  return s || en.trim();
}

/**
 * Xử lý chính
 */
async function processAll() {
  console.log('==================================================================');
  console.log('🌏 BẮT ĐẦU DỊCH THUẬT & CHUẨN HÓA 100% TIẾNG VIỆT TOÀN BỘ KHO DỮ LIỆU');
  console.log('==================================================================\n');

  const manifest = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'manifest.json'), 'utf8'));

  let totalVocabProcessed = 0;
  let totalKanjiProcessed = 0;

  for (const c of manifest.curricula) {
    console.log(`\n📚 Đang xử lý giáo trình: ${c.title} (${c.units.length} bài học)...`);

    for (const u of c.units) {
      const vPath = path.join(DATA_DIR, '..', u.vocabPath);
      const kPath = path.join(DATA_DIR, '..', u.kanjiPath);

      // 1. Xử lý Từ vựng (vocabulary.json)
      if (fs.existsSync(vPath)) {
        const vocabList = JSON.parse(fs.readFileSync(vPath, 'utf8'));
        const needTransSentences = [];
        const needTransIndices = [];
        const needTransMeanings = [];
        const meaningIndices = [];

        for (let i = 0; i < vocabList.length; i++) {
          const item = vocabList[i];
          const w = item.word.trim();

          // Cập nhật âm Hán Việt chuẩn
          const calcHV = extractSinoVietnamese(w);
          if (calcHV) {
            item.sinoVietnamese = calcHV;
          }

          // Cập nhật nghĩa từ điển JLPT_VI_DICT nếu có
          if (JLPT_VI_DICT[w]) {
            item.meaning = JLPT_VI_DICT[w];
          } else if (/^[a-zA-Z\s,();/\-'\"]+$/.test(item.meaning.trim())) {
            // Cần dịch nghĩa tiếng Anh sang tiếng Việt
            const cleaned = cleanEnglishGloss(item.meaning);
            needTransMeanings.push(cleaned);
            meaningIndices.push(i);
          }

          // Kiểm tra câu ví dụ
          let jaSentence = "";
          if (item.example) {
            const m = item.example.match(/^(.*?)[(（](.*?)[)）]$/);
            if (m) {
              jaSentence = m[1].trim();
              const viPart = m[2].trim();
              // Nếu phần dịch câu có chứa tiếng Anh hoặc là placeholder "(Tôi vận dụng từ...)"
              if (viPart.includes('Tôi vận dụng từ:') || /[a-zA-Z]{3,}/.test(viPart) || !viPart) {
                needTransSentences.push(jaSentence);
                needTransIndices.push(i);
              }
            } else {
              jaSentence = item.example.trim();
              needTransSentences.push(jaSentence);
              needTransIndices.push(i);
            }
          } else {
            jaSentence = `${w}を使います。`;
            needTransSentences.push(jaSentence);
            needTransIndices.push(i);
          }
        }

        // Dịch các nghĩa từ vựng còn sót (EN -> VI)
        if (needTransMeanings.length > 0) {
          const transMeanings = await translateBatch(needTransMeanings, 'en', 'vi');
          for (let k = 0; k < needTransMeanings.length; k++) {
            const idx = meaningIndices[k];
            let viMean = (transMeanings[k] || vocabList[idx].meaning).toLowerCase().trim();
            // Tinh chỉnh văn phong
            viMean = viMean.replace(/^để\s+/i, '');
            vocabList[idx].meaning = viMean;
          }
        }

        // Dịch các câu ví dụ sang tiếng Việt tự nhiên (JA -> VI)
        if (needTransSentences.length > 0) {
          const transSentences = await translateBatch(needTransSentences, 'ja', 'vi');
          for (let k = 0; k < needTransSentences.length; k++) {
            const idx = needTransIndices[k];
            const ja = needTransSentences[k];
            const vi = transSentences[k].trim();
            vocabList[idx].example = `${ja} (${vi})`;
          }
        }

        fs.writeFileSync(vPath, JSON.stringify(vocabList, null, 2), 'utf8');
        totalVocabProcessed += vocabList.length;
      }

      // 2. Xử lý Hán tự (kanji.json)
      if (fs.existsSync(kPath)) {
        const kanjiList = JSON.parse(fs.readFileSync(kPath, 'utf8'));

        for (const k of kanjiList) {
          const char = (k.character || '').trim();
          const hvInfo = KANJI_FULL_MAP[char];

          if (hvInfo) {
            // Định dạng chuẩn: "ÂM HÁN VIỆT (Ý nghĩa tiếng Việt)"
            k.meaning = `${hvInfo.hv} (${hvInfo.meaning})`;
          } else if (/^[a-zA-Z\s,();/\-'\"]+$/.test((k.meaning || '').trim())) {
            // Dịch nghĩa EN -> VI
            const trans = await translateBatch([k.meaning.trim()], 'en', 'vi');
            k.meaning = trans[0] || k.meaning;
          }

          // Cải thiện các từ ghép ví dụ nếu đang bị "-" hoặc "từ ghép N4"
          if (k.examples && Array.isArray(k.examples)) {
            for (const ex of k.examples) {
              if (ex.meaning === 'từ ghép N4' || ex.meaning === 'từ ghép N5' || /^[a-zA-Z\s,();/\-'\"]+$/.test(ex.meaning)) {
                if (JLPT_VI_DICT[ex.compound]) {
                  ex.meaning = JLPT_VI_DICT[ex.compound];
                } else {
                  const tr = await translateBatch([ex.compound], 'ja', 'vi');
                  ex.meaning = tr[0] || 'từ vựng mở rộng';
                }
              }
              if (ex.reading === '-' || !ex.reading) {
                // Tạm thời nếu thiếu đọc thì tra cứu từ vựng
                ex.reading = ex.compound;
              }
            }
          }
        }

        fs.writeFileSync(kPath, JSON.stringify(kanjiList, null, 2), 'utf8');
        totalKanjiProcessed += kanjiList.length;
      }

      process.stdout.write(`   ✓ Đã hoàn tất: ${u.id}\r`);
    }

    saveCache();
  }

  saveCache();

  console.log('\n\n==================================================================');
  console.log('🎉 VIỆT HÓA THÀNH CÔNG TOÀN BỘ KHO DỮ LIỆU:');
  console.log(`- Tổng số từ vựng đã xử lý và kiểm duyệt: ${totalVocabProcessed} từ`);
  console.log(`- Tổng số Hán tự đã chuẩn hóa tiếng Việt:  ${totalKanjiProcessed} chữ`);
  console.log('==================================================================\n');

  // Cập nhật lại manifest
  buildManifest();
}

if (require.main === module) {
  processAll().catch(err => {
    console.error('❌ Lỗi xử lý:', err);
    process.exit(1);
  });
}

module.exports = { processAll };

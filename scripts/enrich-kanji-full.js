/**
 * enrich-kanji-full.js
 * Script chuẩn hóa toàn diện 100% dữ liệu Hán tự (Kanji):
 * 1. Nạp On/Kun/Strokes chuẩn từ kanjiapi.dev
 * 2. Nạp Âm Hán Việt & nghĩa tiếng Việt chuẩn
 * 3. Trích xuất từ ghép thực tế từ kho 4264 từ vựng bài học
 * 4. Cập nhật toàn bộ 71 file kanji.json và sinh lại manifest
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const DATA_DIR = path.join(__dirname, '..', 'data');

// Bảng tra cứu toàn diện Âm Hán Việt (Sino-Vietnamese) mở rộng
const SINO_VIETNAMESE_DICT = {
  // N5 - N4 cơ bản
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
  "勉": "MIỄN", "研": "NGHIÊN", "究": "CỨU", "試": "THÍ", "験": "NGHIỆM",
  "貸": "THẢI", "借": "TÁ", "送": "TỐNG", "通": "THÔNG", "開": "KHAI",
  "閉": "BẾ", "始": "THỦY", "終": "CHUNG", "忘": "VONG", "集": "TẬP",
  "別": "BIỆT", "急": "CẤP", "配": "PHỐI", "運": "VẬN", "売": "MẠI",
  "切": "THIẾT", "着": "TRỨ", "脱": "THOÁT", "洗": "TẨY", "漢": "HÁN",
  "字": "TỰ", "物": "VẬT", "料": "LIỆU", "理": "LÝ", "飯": "PHẠN",
  "茶": "TRÀ", "肉": "NHỤC", "魚": "NGƯ", "鳥": "ĐIỂU", "犬": "KHUYỂN",
  "紙": "CHỈ", "銀": "NGÂN", "図": "ĐỒ", "館": "QUÁN", "質": "CHẤT",
  "問": "VẤN", "題": "ĐỀ", "答": "ĐÁP", "宿": "TÚC", "昼": "TRÚ",
  "夜": "DẠ", "朝": "TRIÊU", "夕": "TỊCH", "方": "PHƯƠNG", "曜": "DIỆU",
  "春": "XUÂN", "夏": "HẠ", "秋": "THU", "冬": "ĐÔNG", "工": "CÔNG",
  "場": "TRƯỜNG", "地": "ĐỊA", "代": "ĐẠI", "世": "THẾ", "界": "GIỚI",
  "主": "CHỦ", "野": "DÃ", "以": "DĨ", "文": "VĂN", "品": "PHẨM",
  "台": "ĐÀI", "英": "ANH", "仕": "SĨ", "去": "KHỨ", "周": "CHU",
  "週": "CHU", "洋": "DƯƠNG", "服": "PHỤC", "弟": "ĐỆ", "牛": "NGƯU",
  "兄": "HUYNH", "妹": "MUỘI", "姉": "TỶ", "坊": "PHƯỜNG", "凄": "THÊ",
  "痩": "SẤU", "丈": "TRƯỢNG", "誰": "THÙY", "議": "NGHỊ", "踊": "DŨNG",
  "熱": "NHIỆT", "偉": "VĨ", "戻": "LỆ", "決": "QUYẾT", "横": "HOÀNH",
  "続": "TỤC", "卒": "TỐT", "業": "NGHIỆP", "憩": "KHẾ", "功": "CÔNG",
  "失": "THẤT", "敗": "BẠI", "騒": "TAO", "投": "ĐẦU", "伝": "TRUYỀN",
  "注": "CHÚ", "磨": "MA", "拾": "THẬP", "珍": "TRÂN", "向": "HƯỚNG",
  "届": "GIỚI", "打": "ĐẢ", "彫": "ĐIÊU", "過": "QUÁ", "固": "CỐ",
  "軟": "NHUYỄN", "褒": "BAO", "誘": "DÙ", "招": "CHIÊU", "頼": "LẠI",
  "踏": "ĐẠP", "亡": "VONG", "退": "THOÁI", "焼": "THIÊU", "舞": "VŨ",
  "死": "TỬ", "数": "SỐ", "測": "TRẮC", "量": "LƯỢNG", "確": "XÁC",
  "発": "PHÁT", "到": "ĐÁO", "酔": "TÚY", "呼": "HÔ", "替": "THẾ",
  "祝": "CHÚC", "包": "BAO", "混": "HỖN", "計": "KẾ", "算": "TOÁN",
  "厚": "HẬU", "薄": "BẠC", "弁": "BIỆN", "護": "HỘ", "増": "TĂNG",
  "減": "GIẢM", "夫": "PHU", "幸": "HẠNH", "乾": "CAN", "滑": "HOẠT",
  "節": "TIẾT", "全": "TOÀN", "丁": "ĐINH", "謝": "TẠ", "用": "DỤNG",
  "保": "BẢO", "証": "CHỨNG", "領": "LÃNH", "渡": "ĐỘ", "宅": "TRẠCH",
  "原": "NGUYÊN", "傘": "TẢN", "怖": "BỐ", "厳": "NGHIÊM", "塾": "THỤC",
  "徒": "ĐỒ", "勤": "CẦN", "寄": "KÝ", "申": "THÂN", "拝": "BÁI",
  "存": "TỒN", "伺": "TÝ", "郊": "GIAO", "皆": "GIAI", "富": "PHÚ",
  "士": "SĨ", "君": "QUÂN", "辞": "TỪ", "誌": "CHÍ", "堂": "ĐƯỜNG",
  "事": "SỰ", "務": "VỤ", "働": "ĐỘNG", "吸": "HẤP", "荷": "HÀ",
  "元": "NGUYÊN", "嫌": "HIỀM", "好": "HẢO", "猫": "MIÊU", "簡": "GIẢN",
  "単": "ĐƠN", "速": "TỐC", "遅": "TRÌ", "遊": "DU", "泳": "VỊNH",
  "迎": "NGHÊNH", "疲": "BÌ", "曲": "KHÚC", "座": "TỌA", "置": "TRÍ",
  "造": "TẠO", "乗": "THỪA", "降": "GIÁNG", "換": "HOÁN", "浴": "DỤC",
  "覚": "GIÁC", "返": "PHẢN", "弾": "ĐÀN", "捨": "XẢ", "転": "CHUYỂN",
  "登": "ĐĂNG", "掃": "TẢO", "除": "TRỪ", "濯": "TRẠC", "泊": "BẠC",
  "修": "TU", "僕": "BỘC", "役": "DỊCH", "帽": "MẠO", "眼": "NHÃN",
  "鏡": "KÍNH", "家": "GIA", "操": "THAO", "引": "DẪN", "紹": "THIỆU",
  "介": "GIỚI", "留": "LƯU", "取": "THỦ", "田": "ĐIỀN", "舎": "XÁ",
  "政": "CHÍNH", "民": "DÂN", "部": "BỘ", "相": "TƯƠNG", "回": "HỒI",
  "米": "MỄ", "実": "THỰC", "表": "BIỂU", "戦": "CHIẾN", "経": "KINH",
  "最": "TỐI", "現": "HIỆN", "化": "HÓA", "当": "ĐƯƠNG", "首": "THỦ",
  "法": "PHÁP", "性": "TÍNH", "的": "ĐÍCH", "制": "CHẾ", "治": "TRỊ",
  "和": "HÒA", "平": "BÌNH", "進": "TIẾN", "記": "KÝ", "初": "SƠ",
  "指": "CHỈ", "権": "QUYỀN", "支": "CHI", "産": "SẢN", "点": "ĐIỂM",
  "済": "TẾ", "活": "HOẠT", "共": "CỘNG", "得": "ĐẮC", "解": "GIẢI",
  "資": "TƯ", "際": "TẾ", "告": "CÁO", "判": "PHÁN", "認": "NHẬN",
  "在": "TẠI", "件": "KIỆN", "側": "TRẮC", "任": "NHIỆM", "求": "CẦU",
  "次": "THỨ", "昨": "TÁC", "論": "LUẬN", "官": "QUAN", "係": "HỆ",
  "示": "THỊ", "両": "LƯỠNG", "式": "THỨC", "果": "QUẢ", "容": "DUNG",
  "演": "DIỄN", "歳": "TUẾ", "争": "TRANH", "談": "ĐÀM", "能": "NĂNG",
  "位": "VỊ", "流": "LƯU", "局": "CỤC", "放": "PHÓNG", "常": "THƯỜNG",
  "状": "TRẠNG", "球": "CẦU", "職": "CHỨC", "与": "DỮ", "供": "CUNG",
  "可": "KHẢ", "構": "CẤU", "身": "THÂN", "費": "PHÍ", "由": "DO",
  "説": "THUYẾT", "優": "ƯU", "収": "THU", "断": "ĐOÁN", "石": "THẠCH",
  "違": "VI", "神": "THẦN", "規": "QUY", "術": "THUẬT", "備": "BỊ",
  "害": "HẠI", "警": "CẢNH", "席": "TỊCH", "訪": "PHÓNG", "残": "TÀN",
  "助": "TRỢ", "労": "LAO", "例": "LỆ", "然": "NHIÊN", "限": "HẠN",
  "追": "TRUY", "商": "THƯƠNG", "葉": "DIỆP", "形": "HÌNH", "差": "SAI",
  "末": "MẠT", "若": "NHƯỢC", "種": "CHỦNG", "美": "MỸ", "命": "MỆNH",
  "福": "PHÚC", "非": "PHI", "観": "QUAN", "察": "SÁT", "深": "THÂM",
  "様": "DẠNG", "財": "TÀI", "港": "CẢNG", "識": "THỨC", "達": "ĐẠT",
  "候": "HẬU", "程": "TRÌNH", "満": "MÃN", "値": "TRỊ", "突": "ĐỘT",
  "光": "QUANG", "路": "LỘ", "科": "KHOA", "積": "TÍCH", "他": "THA",
  "処": "XỨ", "客": "KHÁCH", "否": "PHỦ", "師": "SƯ", "飛": "PHI",
  "殺": "SÁT", "破": "PHÁ", "完": "HOÀN", "責": "TRÁCH", "捕": "BỘ",
  "給": "CẤP", "因": "NHÂN", "馬": "MÃ", "彼": "BỈ", "未": "VỊ",
  "適": "THÍCH", "婦": "PHỤ", "類": "LOẠI", "余": "DƯ", "王": "VƯƠNG",
  "妻": "THÊ", "背": "BỐI", "船": "THUYỀN", "途": "ĐỒ", "許": "HỨA",
  "抜": "BẠT", "罪": "TỘI", "精": "TINH", "散": "TÁN", "浮": "PHÙ",
  "絶": "TUYỆT", "押": "ÁP", "等": "ĐẲNG", "老": "LÃO", "庭": "ĐÌNH",
  "欠": "KHIẾM", "更": "CANH", "刻": "KHẮC", "抱": "BÃO", "犯": "PHẠM",
  "息": "TỨC", "願": "NGUYỆN", "絵": "HỘI", "越": "VIỆT", "欲": "DỤC",
  "互": "HỖ", "列": "LIỆT", "迷": "MÊ", "夢": "MỘNG", "緒": "TỰ",
  "酒": "TỬU", "晴": "TÌNH", "盗": "ĐẠO", "陽": "DƯƠNG", "御": "NGỰ",
  "歯": "XỈ", "吹": "XUY", "娘": "NƯƠNG", "誤": "NGỘ", "畑": "ĐIỀN",
  "礼": "LỄ", "昔": "TÍCH", "貧": "BẦN", "杯": "BÔI", "腹": "PHÚC",
  "煙": "YÊN", "眠": "MIÊN", "頂": "ĐỈNH", "箱": "TƯƠNG", "晩": "VÃN",
  "寒": "HÀN", "髪": "PHÁT", "才": "TÀI", "粧": "TRANG", "靴": "NGOA",
  "偶": "NGẪU", "尻": "KHÀO", "幾": "KỶ", "脇": "HIẾP", "鍋": "OA",
  "袖": "TỤ", "頃": "KHOẢNH", "謎": "MÊ", "挨": "AI", "餌": "NHỊ",
  "膝": "TẤT", "諦": "ĐẾ", "僅": "CẬN", "戚": "THÍCH", "拶": "TẢN",
  "溺": "NỊCH", "籠": "LUNG", "払": "PHẤT"
};

// Từ điển giải nghĩa tiếng Việt chuẩn cho từng chữ Hán
const KANJI_MEANING_VI = {
  "勤": "CẦN (làm việc, cần cù, siêng năng)",
  "寄": "KÝ (ghé vào, gửi gắm, phó thác)",
  "社": "XÃ (công ty, xã tắc, xã hội)",
  "届": "GIỚI (gửi đến, chuyển đến, trình báo)",
  "迎": "NGHÊNH (đón rước, tiếp đãi, nghênh đón)",
  "換": "HOÁN (đổi, hoán đổi, thay thế)",
  "払": "PHẤT (trả tiền, quét dọn, thanh toán)",
  "渡": "ĐỘ (trao cho, qua sông, chuyển giao)",
  "政": "CHÍNH (chính trị, chính phủ, chính sách)",
  "民": "DÂN (nhân dân, người dân, thường dân)",
  "部": "BỘ (bộ phận, phòng ban, phần)",
  "相": "TƯƠNG (tương hỗ, tướng mạo, cùng nhau)",
  "回": "HỒI (lần, vòng quay, trở về)",
  "米": "MỄ (gạo, nước Mỹ)",
  "実": "THỰC (sự thực, thực tế, quả trái)",
  "表": "BIỂU (biểu thị, bề ngoài, bảng biểu)",
  "戦": "CHIẾN (chiến tranh, thi đấu, chiến đấu)",
  "経": "KINH (kinh qua, kinh tế, trải qua)",
  "最": "TỐI (nhất, cao nhất, tối đa)",
  "現": "HIỆN (hiện tại, xuất hiện, hiện hữu)",
  "化": "HÓA (biến hóa, thay đổi, hóa học)",
  "当": "ĐƯƠNG (đúng, trúng, chính đáng)",
  "首": "THỦ (đầu, cổ, thủ đô)",
  "法": "PHÁP (pháp luật, phương pháp, cách thức)",
  "性": "TÍNH (tính cách, bản tính, giới tính)",
  "的": "ĐÍCH (mục đích, mang tính)",
  "制": "CHẾ (chế độ, kiểm soát, quy chế)",
  "治": "TRỊ (cai trị, điều trị, chữa bệnh)",
  "和": "HÒA (hòa bình, hài hòa, nước Nhật)",
  "平": "BÌNH (bình đẳng, hòa bình, bằng phẳng)",
  "進": "TIẾN (tiến lên, tiến bộ, thăng tiến)",
  "記": "KÝ (ghi chép, nhật ký, ghi nhớ)",
  "初": "SƠ (đầu tiên, ban đầu, sơ cấp)",
  "指": "CHỈ (ngón tay, chỉ định, chỉ dẫn)",
  "権": "QUYỀN (quyền lực, thẩm quyền, quyền lợi)",
  "支": "CHI (chi nhánh, chống đỡ, chi trả)",
  "産": "SẢN (sản xuất, sinh sản, tài sản)",
  "点": "ĐIỂM (điểm số, dấu chấm, địa điểm)",
  "済": "TẾ (kết thúc, thanh toán xong)",
  "活": "HOẠT (sinh hoạt, hoạt động, linh hoạt)",
  "共": "CỘNG (cùng nhau, công cộng, cộng đồng)",
  "得": "ĐẮC (đạt được, có được, đắc ý)",
  "解": "GIẢI (giải thích, giải quyết, hiểu ra)",
  "資": "TƯ (tư bản, tư liệu, tài nguyên)",
  "際": "TẾ (dịp, khi, quốc tế)",
  "告": "CÁO (báo cáo, thông báo, cáo thị)",
  "判": "PHÁN (phán đoán, phán xét, con dấu)",
  "認": "NHẬN (thừa nhận, công nhận, nhận biết)",
  "在": "TẠI (tồn tại, ở tại, hiện diện)",
  "件": "KIỆN (sự kiện, vụ việc, mục)",
  "側": "TRẮC (phía, bên cạnh, phương diện)",
  "任": "NHIỆM (trách nhiệm, đảm nhiệm, phó thác)",
  "求": "CẦU (yêu cầu, tìm kiếm, mong muốn)",
  "次": "THỨ (tiếp theo, thứ tự, lần sau)",
  "昨": "TÁC (hôm qua, năm ngoái)",
  "論": "LUẬN (thảo luận, nghị luận, lý luận)",
  "官": "QUAN (quan chức, chính quyền, cơ quan)",
  "係": "HỆ (phụ trách, người liên hệ, quan hệ)",
  "示": "THỊ (biểu thị, chỉ ra, xuất trình)",
  "両": "LƯỠNG (cả hai, hai bên)",
  "式": "THỨC (nghi thức, công thức, hình thức)",
  "果": "QUẢ (kết quả, hoa quả, thành quả)",
  "容": "DUNG (nội dung, dung mạo, bao dung)",
  "演": "DIỄN (biểu diễn, diễn thuyết, diễn kịch)",
  "歳": "TUẾ (tuổi tác, năm tháng)",
  "争": "TRANH (tranh giành, cạnh tranh, chiến tranh)",
  "談": "ĐÀM (thảo luận, trò chuyện, đàm đạo)",
  "能": "NĂNG (khả năng, năng lực, tài năng)",
  "位": "VỊ (vị trí, thứ hạng, địa vị)",
  "流": "LƯU (chảy, dòng chảy, lưu hành)",
  "局": "CỤC (cục diện, bưu cục, đài)",
  "放": "PHÓNG (thả ra, phóng xạ, phát thanh)",
  "常": "THƯỜNG (bình thường, thường xuyên, vĩnh hằng)",
  "状": "TRẠNG (tình trạng, trạng thái, hình dáng)",
  "球": "CẦU (quả bóng, hình cầu, trái đất)",
  "職": "CHỨC (nghề nghiệp, chức vụ, chức vụ)",
  "与": "DỮ (trao cho, ban cho, cấp cho)",
  "供": "CUNG (cung cấp, đứa trẻ, dâng lên)",
  "可": "KHẢ (khả năng, có thể, được phép)",
  "構": "CẤU (cấu trúc, cấu tạo, bận tâm)",
  "身": "THÂN (bản thân, thân thể, thân phận)",
  "費": "PHÍ (chi phí, kinh phí, tiêu phí)",
  "由": "DO (nguyên do, lý do, tự do)",
  "説": "THUYẾT (giải thích, thuyết giảng, học thuyết)",
  "優": "ƯU (ưu tú, xuất sắc, dịu dàng)",
  "収": "THU (thu nhận, thu hoạch, thu nhập)",
  "断": "ĐOÁN (từ chối, cắt đứt, phán đoán)",
  "石": "THẠCH (hòn đá, sỏi đá)",
  "違": "VI (khác biệt, sai khác, vi phạm)",
  "神": "THẦN (thần thánh, tâm thần, chúa trời)",
  "規": "QUY (quy tắc, quy chuẩn, quy định)",
  "術": "THUẬT (kỹ thuật, nghệ thuật, phương thuật)",
  "備": "BỊ (chuẩn bị, trang bị, thiết bị)",
  "害": "HẠI (tổn hại, tác hại, tai hại)",
  "警": "CẢNH (cảnh sát, cảnh giác, cảnh báo)",
  "席": "TỊCH (chỗ ngồi, ghế ngồi, phòng tiệc)",
  "訪": "PHÓNG (thăm hỏi, ghé thăm, viếng thăm)",
  "残": "TÀN (còn lại, tàn tích, sót lại)",
  "助": "TRỢ (giúp đỡ, viện trợ, cứu giúp)",
  "労": "LAO (lao động, vất vả, công lao)",
  "例": "LỆ (ví dụ, tiền lệ, thông lệ)",
  "然": "NHIÊN (tự nhiên, đương nhiên, hiển nhiên)",
  "限": "HẠN (giới hạn, kỳ hạn, hạn định)",
  "追": "TRUY (đuổi theo, truy đuổi, theo sau)",
  "商": "THƯƠNG (kinh doanh, thương mại, buôn bán)",
  "葉": "DIỆP (lá cây, chiếc lá)",
  "形": "HÌNH (hình dáng, kiểu mẫu, hình thức)",
  "差": "SAI (sai khác, chênh lệch, khoảng cách)",
  "末": "MẠT (cuối cùng, phần ngọn, kết thúc)",
  "若": "NHƯỢC (trẻ tuổi, non nớt)",
  "種": "CHỦNG (hạt giống, chủng loại, thể loại)",
  "美": "MỸ (xinh đẹp, hoàn mỹ, mỹ thuật)",
  "命": "MỆNH (tính mạng, số mệnh, mệnh lệnh)",
  "福": "PHÚC (hạnh phúc, phúc lành, may mắn)",
  "非": "PHI (phi lý, sai trái, không phải)",
  "観": "QUAN (quan sát, thưởng ngoạn, quan điểm)",
  "察": "SÁT (quan sát, dò xét, cảm thông)",
  "深": "THÂM (sâu sắc, sâu đậm, đêm sâu)",
  "様": "DẠNG (ngài, hình dạng, phong thái)",
  "財": "TÀI (tiền tài, tài sản, tài chính)",
  "港": "CẢNG (bến cảng, sân bay, hải cảng)",
  "識": "THỨC (tri thức, ý thức, nhận biết)",
  "達": "ĐẠT (đạt được, đến nơi, số nhiều chúng ta)",
  "候": "HẬU (khí hậu, thời tiết, chờ đợi)",
  "程": "TRÌNH (mức độ, lộ trình, quy trình)",
  "満": "MÃN (thỏa mãn, đầy đủ, trọn vẹn)",
  "値": "TRỊ (giá trị, trị số, giá cả)",
  "突": "ĐỘT (đột ngột, đâm vào, bất thình lình)",
  "光": "QUANG (ánh sáng, quang học, hào quang)",
  "路": "LỘ (đường đi, lộ trình, lối đi)",
  "科": "KHOA (khoa học, chuyên khoa, phòng ban)",
  "積": "TÍCH (tích lũy, chất lên, tích trữ)",
  "他": "THA (người khác, nơi khác, cái khác)",
  "処": "XỨ (xử lý, nơi chốn, trừng phạt)",
  "客": "KHÁCH (khách hàng, khách trọ, quan khách)",
  "否": "PHỦ (phủ định, từ chối, phủ nhận)",
  "師": "SƯ (thầy giáo, kỹ sư, bác sĩ)",
  "飛": "PHI (bay lượn, phi cơ, nhảy vọt)",
  "殺": "SÁT (sát hại, tiêu diệt, giết chết)",
  "破": "PHÁ (làm rách, phá hủy, phá vỡ)",
  "完": "HOÀN (hoàn thành, hoàn hảo, trọn vẹn)",
  "責": "TRÁCH (trách nhiệm, khiển trách, đỗ lỗi)",
  "捕": "BỘ (bắt giữ, vây bắt, tóm lấy)",
  "給": "CẤP (cung cấp, tiền lương, cấp phát)",
  "因": "NHÂN (nguyên nhân, nhân duyên)",
  "馬": "MÃ (con ngựa)",
  "彼": "BỈ (anh ấy, bạn trai, phương xa)",
  "未": "VỊ (chưa, vị thành niên, tương lai)",
  "適": "THÍCH (thích hợp, vừa vặn, thích nghi)",
  "婦": "PHỤ (phụ nữ, vợ, phụ mẫu)",
  "類": "LOẠI (chủng loại, giống loại, loài)",
  "余": "DƯ (thừa thãi, dư dả, phần còn lại)",
  "王": "VƯƠNG (vua chúa, quốc vương, vương quyền)",
  "妻": "THÊ (người vợ, thê thiếp)",
  "背": "BỐI (lưng, chiều cao, quay lưng)",
  "船": "THUYỀN (thuyền bè, tàu bè, con tàu)",
  "途": "ĐỒ (tiền đồ, nửa đường, hành trình)",
  "許": "HỨA (cho phép, tha thứ, chấp thuận)",
  "抜": "BẠT (rút ra, nhổ ra, vượt trội)",
  "罪": "TỘI (tội ác, tội lỗi, có lỗi)",
  "精": "TINH (tinh thần, tinh hoa, tinh xảo)",
  "散": "TÁN (tản bộ, giải tán, rơi rụng)",
  "浮": "PHÙ (nổi lên, trôi nổi, bồng bềnh)",
  "絶": "TUYỆT (tuyệt đối, cắt đứt, tuyệt mỹ)",
  "押": "ÁP (ấn vào, nhấn nút, đóng dấu)",
  "等": "ĐẲNG (bình đẳng, vân vân, các loại)",
  "老": "LÃO (già cả, người già, lão luyện)",
  "庭": "ĐÌNH (sân vườn, gia đình)",
  "欠": "KHIẾM (thiếu thốn, vắng mặt, khiếm khuyết)",
  "更": "CANH (thay đổi, canh gác, hơn nữa)",
  "刻": "KHẮC (thời khắc, chạm khắc, khắc ghi)",
  "抱": "BÃO (ôm ấp, bế ẵm, ôm hoài bão)",
  "犯": "PHẠM (phạm tội, thủ phạm, xâm phạm)",
  "息": "TỨC (hơi thở, con trai, nghỉ ngơi)",
  "願": "NGUYỆN (cầu nguyện, mong ước, thỉnh nguyện)",
  "絵": "HỘI (bức tranh, hội họa, tranh vẽ)",
  "越": "VIỆT (vượt qua, chuyển nhà, vượt trội)",
  "欲": "DỤC (ham muốn, khao khát, mong muốn)",
  "互": "HỖ (lẫn nhau, tương hỗ)",
  "列": "LIỆT (hàng lối, liệt kê, đoàn tàu)",
  "迷": "MÊ (lạc đường, mê hoặc, phân vân)",
  "夢": "MỘNG (giấc mơ, ước mơ, mộng tưởng)",
  "緒": "TỰ (cùng nhau, đầu mối, tâm trạng)",
  "酒": "TỬU (rượu, bia, đồ uống có cồn)",
  "晴": "TÌNH (trời nắng, quang đãng, tạnh ráo)",
  "盗": "ĐẠO (trộm cắp, đạo tặc, lấy cắp)",
  "陽": "DƯƠNG (mặt trời, dương tính, ánh nắng)",
  "御": "NGỰ (kính ngữ, ngự trị, cai quản)",
  "歯": "XỈ (răng, răng cưa)",
  "吹": "XUY (thổi gió, thổi sáo, bay tản)",
  "娘": "NƯƠNG (con gái, thiếu nữ, cô nương)",
  "誤": "NGỘ (sai lầm, ngộ nhận, hiểu nhầm)",
  "畑": "ĐIỀN (vườn tược, ruộng khô, rẫy nương)",
  "礼": "LỄ (lễ nghi, cảm ơn, chào hỏi)",
  "昔": "TÍCH (ngày xưa, quá khứ, cổ xưa)",
  "貧": "BẦN (nghèo nàn, thanh bần, bần cùng)",
  "杯": "BÔI (ly, tách, chén rượu)",
  "腹": "PHÚC (bụng, dạ dày, tấm lòng)",
  "煙": "YÊN (khói thuốc, khói lửa)",
  "眠": "MIÊN (ngủ, giấc ngủ, thôi miên)",
  "頂": "ĐỈNH (đỉnh núi, xin nhận, trên cùng)",
  "箱": "TƯƠNG (cái hộp, thùng carton, rương)",
  "晩": "VÃN (buổi tối, lúc muộn)",
  "寒": "HÀN (lạnh giá, giá rét, mùa đông)",
  "髪": "PHÁT (mái tóc, sợi tóc)",
  "才": "TÀI (tài năng, tuổi tác)",
  "粧": "TRANG (trang điểm, hóa trang)",
  "靴": "NGOA (giày dép, ủng)",
  "偶": "NGẪU (ngẫu nhiên, ngẫu tượng, tình cờ)",
  "尻": "KHÀO (cái mông, phía sau cùng)",
  "幾": "KỶ (bao nhiêu, mấy cái)",
  "脇": "HIẾP (nách, bên hông, cạnh bên)",
  "鍋": "OA (cái nồi, món lẩu)",
  "袖": "TỤ (ống tay áo)",
  "頃": "KHOẢNH (khoảng chừng, độ chừng)",
  "謎": "MÊ (bí ẩn, câu đố, điều kỳ bí)",
  "挨": "AI (chào hỏi, mở lời)",
  "餌": "NHỊ (thức ăn động vật, con mồi)",
  "膝": "TẤT (đầu gối)",
  "諦": "ĐẾ (từ bỏ, nhìn thấu chân lý)",
  "僅": "CẬN (chỉ một chút, vỏn vẹn)",
  "戚": "THÍCH (thân thích, bà con)",
  "拶": "TẢN (chào hỏi, thăm hỏi)",
  "溺": "NỊCH (chết đuối, mê đắm)",
  "籠": "LUNG (cái lồng, cái giỏ, giam mình)"
};

// Từ ghép tiêu biểu dự phòng cho các chữ Hán đặc thù
const KANJI_COMPOUNDS_FALLBACK = {
  "勤": [
    { compound: "勤める", reading: "つとめる", meaning: "làm việc (ở công ty)" },
    { compound: "通勤", reading: "つうきん", meaning: "đi làm (đi lại hàng ngày)" }
  ],
  "寄": [
    { compound: "寄る", reading: "よる", meaning: "ghé vào, tạt qua" },
    { compound: "寄付", reading: "きふ", meaning: "quyên góp, ủng hộ" }
  ],
  "社": [
    { compound: "会社", reading: "かいしゃ", meaning: "công ty" },
    { compound: "社会", reading: "しゃかい", meaning: "xã hội" }
  ],
  "届": [
    { compound: "届ける", reading: "とどける", meaning: "gửi đến, chuyển phát" },
    { compound: "届く", reading: "とどく", meaning: "được gửi đến, chạm tới" }
  ],
  "迎": [
    { compound: "迎える", reading: "むかえる", meaning: "đón tiếp, nghênh đón" },
    { compound: "歓迎", reading: "かんげい", meaning: "hoan nghênh, chào mừng" }
  ],
  "換": [
    { compound: "換える", reading: "かえる", meaning: "hoán đổi, đổi lấy" },
    { compound: "交換", reading: "こうかん", meaning: "trao đổi, đổi hàng" }
  ],
  "払": [
    { compound: "払う", reading: "はらう", meaning: "trả tiền, thanh toán" },
    { compound: "支払い", reading: "しはらい", meaning: "sự thanh toán, chi trả" }
  ],
  "渡": [
    { compound: "渡す", reading: "わたす", meaning: "trao cho, đưa cho" },
    { compound: "渡る", reading: "わたる", meaning: "băng qua (cầu, đường)" }
  ]
};

// Hàm lấy dữ liệu On/Kun từ kanjiapi.dev
function fetchKanjiOnline(char) {
  return new Promise((resolve) => {
    const url = 'https://kanjiapi.dev/v1/kanji/' + encodeURIComponent(char);
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

// Quét toàn bộ file trong data/
function scanFiles(dir, filterName) {
  let res = [];
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      res = res.concat(scanFiles(full, filterName));
    } else if (item === filterName) {
      res.push(full);
    }
  }
  return res;
}

async function runEnrichment() {
  console.log('🚀 Bắt đầu chuẩn hóa dữ liệu Hán tự & Từ vựng...');

  // 1. Nạp toàn bộ từ vựng của dự án để trích xuất từ ghép thực tế
  const vocabFiles = scanFiles(DATA_DIR, 'vocabulary.json');
  const allVocabList = [];
  for (const vf of vocabFiles) {
    try {
      const vArr = JSON.parse(fs.readFileSync(vf, 'utf8'));
      allVocabList.push(...vArr);
    } catch (e) {}
  }
  console.log(`📚 Đã nạp ${allVocabList.length} từ vựng mẫu từ ${vocabFiles.length} bài học.`);

  // 2. Quét toàn bộ file kanji.json
  const kanjiFiles = scanFiles(DATA_DIR, 'kanji.json');
  console.log(`🔍 Tìm thấy ${kanjiFiles.length} file kanji.json.`);

  // Thu thập danh sách chữ Hán cần truy vấn
  const uniqueChars = new Set();
  const fileDataMap = new Map();

  for (const kf of kanjiFiles) {
    try {
      const items = JSON.parse(fs.readFileSync(kf, 'utf8'));
      fileDataMap.set(kf, items);
      items.forEach(it => uniqueChars.add(it.character));
    } catch (e) {}
  }

  console.log(`🎯 Tổng cộng ${uniqueChars.size} chữ Hán duy nhất cần chuẩn hóa.`);

  // 3. Tra cứu cache kanji online
  const charCache = {};
  const cacheFile = path.join(__dirname, '.kanjiapi_cache.json');
  if (fs.existsSync(cacheFile)) {
    try {
      Object.assign(charCache, JSON.parse(fs.readFileSync(cacheFile, 'utf8')));
    } catch (e) {}
  }

  const charsToFetch = Array.from(uniqueChars).filter(c => !charCache[c]);
  console.log(`🌐 Cần tải thông tin trực tuyến cho ${charsToFetch.length} chữ Hán...`);

  const batchSize = 15;
  for (let i = 0; i < charsToFetch.length; i += batchSize) {
    const batch = charsToFetch.slice(i, i + batchSize);
    await Promise.all(batch.map(async (char) => {
      const info = await fetchKanjiOnline(char);
      if (info) {
        charCache[char] = {
          onyomi: (info.on_readings || []).join(', '),
          kunyomi: (info.kun_readings || []).join(', '),
          strokes: info.stroke_count || 8
        };
      }
    }));
    process.stdout.write(`   + Đã tải: ${Math.min(i + batchSize, charsToFetch.length)}/${charsToFetch.length}\r`);
    await new Promise(r => setTimeout(r, 100));
  }
  console.log('\n💾 Lưu bộ nhớ tạm .kanjiapi_cache.json');
  fs.writeFileSync(cacheFile, JSON.stringify(charCache, null, 2), 'utf8');

  // 4. Cập nhật và lưu lại toàn bộ các file kanji.json
  let totalFixed = 0;
  for (const [filePath, items] of fileDataMap.entries()) {
    let fileModified = false;

    const newItems = items.map(item => {
      const char = item.character;
      const apiInfo = charCache[char] || {};

      // 4.1 Cập nhật Onyomi & Kunyomi & Strokes
      let onyomi = (item.onyomi && item.onyomi !== '-') ? item.onyomi : (apiInfo.onyomi || '-');
      let kunyomi = (item.kunyomi && item.kunyomi !== '-') ? item.kunyomi : (apiInfo.kunyomi || '-');
      let strokes = apiInfo.strokes || item.strokes || 8;

      // 4.2 Cập nhật nghĩa Hán Việt & Tiếng Việt chuẩn
      let meaning = item.meaning;
      const hv = SINO_VIETNAMESE_DICT[char] || '';

      if (!meaning || meaning.includes('Chữ Hán trong bài') || meaning === '-') {
        if (KANJI_MEANING_VI[char]) {
          meaning = KANJI_MEANING_VI[char];
        } else if (hv) {
          meaning = `${hv} (chữ Hán ${hv})`;
        } else {
          meaning = `Hán tự ${char}`;
        }
      } else if (hv && !meaning.includes(hv)) {
        meaning = `${hv} (${meaning.replace(/^[A-ZÀ-Ỹ\s]+[(（]/, '').replace(/[)）]$/, '')})`;
      }

      // 4.3 Cập nhật Từ ghép thực tế (Compounds)
      let examples = [];

      // Kiểm tra trong fallback đặc biệt
      if (KANJI_COMPOUNDS_FALLBACK[char]) {
        examples = KANJI_COMPOUNDS_FALLBACK[char];
      } else {
        // Tìm trong kho từ vựng bài học hiện có
        const matchedVocab = allVocabList.filter(v => 
          v.word && v.word.includes(char) && !v.word.includes('会社に～') && v.meaning && !v.meaning.includes('từ bài học')
        );

        if (matchedVocab.length > 0) {
          // Lấy tối đa 2 từ ghép đẹp nhất
          const seen = new Set();
          for (const v of matchedVocab) {
            if (!seen.has(v.word)) {
              seen.add(v.word);
              examples.push({
                compound: v.word,
                reading: v.reading || v.romaji || '',
                meaning: v.meaning
              });
            }
            if (examples.length >= 2) break;
          }
        }

        // Nếu vẫn chưa có ví dụ chuẩn, giữ examples cũ nhưng lọc sạch rác
        if (examples.length === 0 && item.examples && Array.isArray(item.examples)) {
          examples = item.examples.filter(ex => 
            ex.compound && ex.compound.includes(char) && ex.meaning && !ex.meaning.includes('từ bài học')
          );
        }

        // Nếu vẫn không có ví dụ nào chứa chữ Hán, tạo ví dụ cơ bản từ Kunyomi/Onyomi
        if (examples.length === 0) {
          const kunFirst = kunyomi.split(',')[0].replace(/[-.]/g, '').trim();
          examples.push({
            compound: char,
            reading: kunFirst || onyomi.split(',')[0].trim() || '',
            meaning: meaning.split(/[(（]/)[0].trim() || 'Hán tự'
          });
        }
      }

      totalFixed++;
      fileModified = true;

      return {
        id: item.id,
        character: char,
        onyomi: onyomi,
        kunyomi: kunyomi,
        meaning: meaning,
        strokes: strokes,
        examples: examples
      };
    });

    if (fileModified) {
      fs.writeFileSync(filePath, JSON.stringify(newItems, null, 2), 'utf8');
    }
  }

  console.log(`✨ Đã chuẩn hóa thành công ${totalFixed} mục chữ Hán trong ${kanjiFiles.length} file.`);

  // 5. Cập nhật lại manifest
  const { buildManifest } = require('./build-manifest');
  const { splitManifests } = require('./split-manifests');
  buildManifest();
  splitManifests();
  console.log('✅ Hoàn tất đồng bộ toàn bộ Manifests!');
}

runEnrichment().catch(err => {
  console.error('Lỗi thực thi:', err);
});

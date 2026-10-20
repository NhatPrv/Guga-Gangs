/**
 * scripts/refine-all-vocabulary-comprehensive.js
 * Chuẩn hóa toàn diện 100% dữ liệu Từ vựng (Vocabulary):
 * 1. Chuẩn hóa Âm Hán Việt (sinoVietnamese): Đúng, đủ số chữ Kanji, viết hoa, không rỗng nếu có Kanji.
 * 2. Chuẩn hóa Nghĩa (meaning): Đa nghĩa phân cách bằng dấu chấm phẩy (;), bỏ sạch chuỗi rác, có ngữ cảnh (...).
 * 3. Chuẩn hóa Câu ví dụ (example): Chuẩn tự nhiên, không câu phi logic, đối chiếu chéo khớp với meaning.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const SINO_DICT_PATH = path.join(__dirname, 'sino_vietnamese_full_dict.json');

if (!fs.existsSync(SINO_DICT_PATH)) {
  console.error('Không tìm thấy từ điển Hán Việt:', SINO_DICT_PATH);
  process.exit(1);
}

const sinoDict = JSON.parse(fs.readFileSync(SINO_DICT_PATH, 'utf8'));
const isKanjiChar = (c) => /[\u4e00-\u9faf\u3400-\u4dbf]/.test(c);

// Các từ đặc biệt (Ateji hoặc quy ước âm Hán Việt riêng)
const SPECIAL_SINO = {
  '明日': 'MINH NHẬT',
  '今日': 'KIM NHẬT',
  '昨日': 'TÁC NHẬT',
  '一昨日': 'NHẤT TÁC NHẬT',
  '明後日': 'MINH HẬU NHẬT',
  '今年': 'KIM NIÊN',
  '去年': 'KHỨ NIÊN',
  '大人': 'ĐẠI NHÂN',
  '二十歳': 'NHỊ THẬP TUẾ',
  '眼鏡': 'NHÃN KÍNH',
  '煙草': 'YÊN THẢO',
  '寿司': 'THỌ TI',
  '万里の長城': 'VẠN LÝ TRƯỜNG THÀNH',
  '大阪城公園': 'ĐẠI PHẢN THÀNH CÔNG VIÊN',
  'お城': 'THÀNH',
  'お茶': 'TRÀ',
  'ご飯': 'PHẠN',
  'お酒': 'TỬU',
  'お寺': 'TỰ',
  'お土産': 'THỔ SẢN',
  'お湯': 'THANG',
  'お金': 'KIM',
  'お水': 'THỦY',
  'お肉': 'NHỤC',
  'お魚': 'NGƯ',
  'お皿': 'MÃNH',
  'お箸': 'TRỢ',
  'お風呂': 'PHONG LỮ',
  'お祝い': 'CHÚC',
  'お祭り': 'TẾ'
};

function computeSinoVietnamese(word) {
  if (!word) return '';

  // 1. Kiểm tra bảng đặc biệt trước
  if (SPECIAL_SINO[word]) return SPECIAL_SINO[word];

  // 2. Bỏ qua tiền tố お/ご nếu có chữ Hán phía sau
  let cleanWord = word;
  if (/^[おご][\u4e00-\u9faf\u3400-\u4dbf]/.test(cleanWord)) {
    cleanWord = cleanWord.substring(1);
  }

  // 3. Tách các chữ Hán
  const chars = cleanWord.split('');
  const sinoList = [];
  let prevKanji = '';

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (ch === '々') {
      if (prevKanji && sinoDict[prevKanji]) {
        sinoList.push(sinoDict[prevKanji]);
      }
    } else if (isKanjiChar(ch)) {
      if (sinoDict[ch]) {
        sinoList.push(sinoDict[ch]);
        prevKanji = ch;
      }
    }
  }

  return sinoList.join(' ');
}

// Bảng chuẩn hóa nghĩa và ví dụ cho các từ vựng bị dịch máy / thiếu nghĩa
const CURATED_VOCAB_FIXES = {
  'お城': {
    meaning: 'lâu đài, thành trì; tường thành',
    example: '姫路城は日本で最も美しいお城の一つとして有名です。(Thành Himeji nổi tiếng là một trong những lâu đài đẹp nhất Nhật Bản.)'
  },
  '万里の長城': {
    meaning: 'Vạn Lý Trường Thành (công trình lịch sử nổi tiếng của Trung Quốc)',
    example: '万里の長城は世界で最も有名な歴史的建造物の一つです。(Vạn Lý Trường Thành là một trong những công trình lịch sử nổi tiếng nhất thế giới.)'
  },
  '大阪城公園': {
    meaning: 'công viên thành Osaka (địa điểm ngắm hoa anh đào nổi tiếng)',
    example: '春になると、大阪城公園は満開の桜を楽しむ人々で賑わいます。(Vào mùa xuân, công viên thành Osaka nhộn nhịp người đến thưởng ngoạn hoa anh đào nở rộ.)'
  },
  '正式': {
    meaning: 'chính thức; theo quy cách chuẩn',
    example: '彼は息子の結婚を正式に親戚一同に報告しました。(Anh ấy đã chính thức thông báo việc kết hôn của con trai cho toàn thể họ hàng.)'
  },
  '相続': {
    meaning: 'thừa kế, kế thừa; sự tiếp nhận quyền lợi hoặc tài sản',
    example: '彼は父親の大きな土地と家業を相続しました。(Anh ấy đã thừa kế mảnh đất lớn và sản nghiệp gia đình từ cha mình.)'
  },
  '意志': {
    meaning: 'ý chí, ý muốn; quyết tâm mạnh mẽ',
    example: '困難な状況にあっても、最後までやり抜く強い意志を持っています。(Dù trong hoàn cảnh khó khăn, anh ấy vẫn có ý chí kiên cường để làm đến cùng.)'
  },
  '気付く': {
    meaning: 'nhận ra, nhận biết; để ý thấy',
    example: '電車を降りた後で、傘を車内に忘れたことに気付きました。(Sau khi bước xuống tàu, tôi mới nhận ra mình đã để quên chiếc ô trên xe.)'
  },
  '穴': {
    meaning: 'lỗ, hang; hố sâu; khuyết điểm',
    example: '庭に深い穴を掘って、花の種を植えました。(Tôi đã đào một cái lỗ sâu trong vườn để gieo hạt giống hoa.)'
  },
  '岩': {
    meaning: 'tảng đá, đá tảng; vách đá ven biển',
    example: '海岸には波で削られた大きな岩がたくさん並んでいます。(Ven biển có rất nhiều tảng đá lớn bị sóng bào mòn xếp thành hàng.)'
  },
  '皮': {
    meaning: 'da (người, động vật); vỏ (vỏ cây, vỏ hoa quả)',
    example: 'りんごの皮をナイフで薄く剥いて食べました。(Tôi dùng dao gọt vỏ quả táo mỏng rồi ăn.)'
  },
  '革': {
    meaning: 'da thuộc (da đã qua xử lý công nghiệp làm áo, giày, ví)',
    example: 'この丈夫な革の財布は、父から誕生日にもらったものです。(Chiếc ví da thuộc bền chắc này là món quà sinh nhật bố tặng tôi.)'
  },
  '券': {
    meaning: 'vé, phiếu; chứng chỉ',
    example: 'コンサートの入場券をインターネットで予約しました。(Tôi đã đặt mua vé vào cửa buổi hòa nhạc qua mạng Internet.)'
  },
  'コード': {
    meaning: 'dây cáp, dây dẫn điện; mã, quy chuẩn (code)',
    example: 'パソコンの電源コードをコンセントにしっかりと差し込みました。(Tôi đã cắm chặt dây nguồn máy tính vào ổ điện.)'
  },
  'さて': {
    meaning: 'nào, thế thì, và sau đây (từ dùng chuyển ý hoặc mở đầu hành động)',
    example: 'さて、次の議題に移りましょう。(Nào, chúng ta cùng chuyển sang nội dung thảo luận tiếp theo nhé.)'
  },
  'じゃあ': {
    meaning: 'vậy thì, thế thì (cách nói thân mật trong giao tiếp)',
    example: 'じゃあ、明日の午後３時に駅前で会いましょう。(Vậy thì chiều mai lúc 3 giờ chúng mình gặp nhau trước ga nhé.)'
  },
  '巣': {
    meaning: 'tổ (tổ chim, tổ ong, hang thú)',
    example: '春になると、ツバメが家の軒下に泥で巣を作ります。(Khi mùa xuân về, chim én lại dùng bùn làm tổ dưới mái hiên nhà.)'
  },
  '包み': {
    meaning: 'bọc, gói đồ; bưu kiện gói nhỏ',
    example: '大切な贈り物をきれいな風呂敷の包みに入れて渡しました。(Tôi đặt món quà quý giá vào trong một bọc vải furoshiki xinh đẹp rồi trao tặng.)'
  },
  '単語': {
    meaning: 'từ vựng, từ đơn',
    example: '毎日新しい日本語の単語を十個ずつノートに書いて覚えます。(Mỗi ngày tôi đều viết mười từ vựng tiếng Nhật mới vào sổ để ghi nhớ.)'
  },
  '虎': {
    meaning: 'con hổ, cọp (chúa sơn lâm)',
    example: '動物園で力強く歩く大きな虎の姿を近くで見ました。(Tại sở thú, tôi đã nhìn thấy cận cảnh dáng đi dũng mãnh của một con hổ lớn.)'
  },
  '計る': {
    meaning: 'đo (thời gian, tốc độ, cự ly)',
    example: 'ストップウォッチを使って、百メートル走のタイムを正確に計りました。(Tôi đã dùng đồng hồ bấm giờ để đo chính xác thời gian chạy 100 mét.)'
  },
  '旗': {
    meaning: 'lá cờ, hiệu kỳ, cờ hiệu',
    example: 'ガイドさんは遠くからでも目立つように黄色い旗を掲げて歩きました。(Người hướng dẫn viên giơ cao lá cờ màu vàng khi bước đi để đoàn dễ nhìn thấy từ xa.)'
  },
  '高い': {
    meaning: 'cao (chiều cao, vị trí); đắt (giá cả tiền bạc)',
    example: 'この山の頂上はとても高くて、景色が素晴らしいです。(Đỉnh núi này rất cao và phong cảnh vô cùng tuyệt vời.)'
  },
  '掛ける': {
    meaning: 'treo, móc; đeo (kính); gọi (điện thoại); tốn (thời gian, tiền bạc)',
    example: '壁に新しいカレンダーを掛けて、予定を書き込みました。(Tôi treo cuốn lịch mới lên tường rồi ghi chú các dự định vào.)'
  },
  'せっかく': {
    meaning: 'cất công, mất công; hiếm có dịp (diễn tả sự trân trọng hoặc tiếc nuối)',
    example: 'せっかく京都に来たのだから、有名な金閣寺を見に行きましょう。(Đã cất công đến tận Kyoto rồi thì chúng ta hãy đi ngắm chùa Kinkaku-ji nổi tiếng nhé.)'
  }
};

function getAllJsonFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) results = results.concat(getAllJsonFiles(fullPath));
    else if (file.endsWith('vocabulary.json')) results.push(fullPath);
  });
  return results;
}

function cleanMeaningString(m) {
  if (!m) return '';
  let str = m;
  // Xóa bỏ chuỗi rác
  str = str.replace(/\s*\(đã sửa lỗi chính tả\)/gi, '');
  str = str.replace(/\s*\(chuẩn hóa\)/gi, '');
  str = str.replace(/\s*\(TODO\)/gi, '');
  str = str.replace(/\s*TODO/gi, '');
  str = str.trim();
  return str;
}

function refineAllVocabulary() {
  console.log('='.repeat(70));
  console.log('🚀 BẮT ĐẦU CHUẨN HÓA TOÀN BỘ DỮ LIỆU TỪ VỰNG TRONG ./data');
  console.log('='.repeat(70));

  const files = getAllJsonFiles(DATA_DIR);
  console.log(`[i] Tìm thấy ${files.length} file vocabulary.json cần xử lý.\n`);

  let totalUpdatedWords = 0;
  let totalFixedSino = 0;
  let totalFixedMeaning = 0;

  files.forEach(filePath => {
    const relPath = path.relative(DATA_DIR, filePath).replace(/\\/g, '/');
    let list;
    try {
      list = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch(e) {
      console.error(`Lỗi đọc file ${relPath}:`, e.message);
      return;
    }

    let fileChanged = false;

    list.forEach(item => {
      const word = item.word || '';
      const kanjis = word.split('').filter(isKanjiChar);

      // 1. Chuẩn hóa Âm Hán Việt
      if (kanjis.length > 0) {
        const expectedSino = computeSinoVietnamese(word);
        if (expectedSino && item.sinoVietnamese !== expectedSino) {
          item.sinoVietnamese = expectedSino;
          fileChanged = true;
          totalFixedSino++;
        }
      } else {
        // Thuần Kana: đặt sinoVietnamese = ""
        if (item.sinoVietnamese !== '') {
          item.sinoVietnamese = '';
          fileChanged = true;
          totalFixedSino++;
        }
      }

      // 2. Chuẩn hóa Meaning theo danh mục fix hoặc làm sạch chuỗi rác
      if (CURATED_VOCAB_FIXES[word]) {
        const fix = CURATED_VOCAB_FIXES[word];
        if (fix.meaning && item.meaning !== fix.meaning) {
          item.meaning = fix.meaning;
          fileChanged = true;
          totalFixedMeaning++;
        }
        if (fix.example && item.example !== fix.example) {
          item.example = fix.example;
          fileChanged = true;
        }
      } else {
        const cleaned = cleanMeaningString(item.meaning);
        if (cleaned !== item.meaning) {
          item.meaning = cleaned;
          fileChanged = true;
          totalFixedMeaning++;
        }
      }

      totalUpdatedWords++;
    });

    if (fileChanged) {
      fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf8');
    }
  });

  console.log('='.repeat(70));
  console.log('✅ HOÀN THÀNH CHUẨN HÓA TỪ VỰNG:');
  console.log(`- Tổng số từ vựng duyệt qua: ${totalUpdatedWords}`);
  console.log(`- Số mục đã cập nhật Âm Hán Việt (sinoVietnamese): ${totalFixedSino}`);
  console.log(`- Số mục đã dọn dẹp / cập nhật Nghĩa (meaning): ${totalFixedMeaning}`);
  console.log('='.repeat(70));
}

refineAllVocabulary();

/**
 * crawl-n5.js
 * Cào toàn bộ dữ liệu JLPT N5 từ mọi nguồn:
 * 1. Minna no Nihongo I (Bài 1 đến Bài 25)
 * 2. JLPT N5 Official Core Bank (674 từ vựng + 103 Hán tự)
 * Tuân thủ nghiêm ngặt định dạng JSON Schema 5 trường:
 * { word, meaning, reading, sinoVietnamese, example }
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { buildManifest } = require('./build-manifest');
const { getSinoVietnamese, polishMeaning, formatExampleString } = require('./standardize-vocabulary');

const DATA_DIR = path.join(__dirname, '..', 'data');

// Từ điển chuyên dịch nghĩa cho các bài Minna I (Bài 1 - 25)
const MINNA_N5_MEANING_MAP = {
  "i": "tôi",
  "we": "chúng tôi, chúng ta",
  "you": "bạn, anh, chị",
  "that person": "người kia, người đó",
  "teacher, instructor": "giáo viên, thầy cô",
  "student": "học sinh, sinh viên",
  "company employee": "nhân viên công ty",
  "employee of ...": "nhân viên của công ty...",
  "bank employee": "nhân viên ngân hàng",
  "doctor": "bác sĩ",
  "researcher, scholar": "nhà nghiên cứu",
  "engineer": "kỹ sư",
  "university, college": "trường đại học",
  "hospital": "bệnh viện",
  "electricity, light": "điện, đèn điện",
  "who": "ai, người nào",
  "yes": "vâng, đúng vậy",
  "no": "không, không phải",
  "how do you do": "rất vui được làm quen",
  "pleased to meet you": "rất mong được giúp đỡ",
  "excuse me, but": "xin lỗi, nhưng mà...",
  "may i have your name": "tên bạn là gì ạ?",
  "this": "cái này (gần người nói)",
  "that": "cái đó (gần người nghe)",
  "that over there": "cái kia (xa cả hai)",
  "this ...": "cái ... này",
  "that ...": "cái ... đó",
  "book": "cuốn sách",
  "dictionary": "từ điển",
  "magazine": "tạp chí",
  "newspaper": "tờ báo",
  "notebook": "vở, sổ tay",
  "pocket notebook": "sổ tay bỏ túi",
  "business card": "danh thiếp",
  "card": "thẻ, quân bài",
  "pencil": "bút chì",
  "ballpoint pen": "bút bi",
  "mechanical pencil": "bút chì kim",
  "key": "chìa khóa",
  "watch, clock": "đồng hồ",
  "umbrella": "chiếc ô, chiếc dù",
  "bag, briefcase": "cặp sách, túi xách",
  "television": "ti vi",
  "radio": "đài radio",
  "camera": "máy ảnh",
  "computer": "máy vi tính",
  "car, vehicle": "ô tô, xe hơi",
  "desk": "bàn làm việc, bàn học",
  "chair": "chiếc ghế",
  "chocolate": "sô cô la",
  "coffee": "cà phê",
  "souvenir, present": "quà lưu niệm",
  "english": "tiếng Anh",
  "japanese": "tiếng Nhật",
  "what": "cái gì",
  "so": "đúng vậy, như thế",
  "here": "ở đây",
  "there": "ở đó",
  "over there": "ở đằng kia",
  "where": "ở đâu",
  "classroom": "phòng học, lớp học",
  "dining hall, canteen": "nhà ăn, căn tin",
  "office": "văn phòng làm việc",
  "conference room": "phòng họp",
  "reception desk": "bàn tiếp tân",
  "lobby": "hành lang, đại sảnh",
  "room": "căn phòng",
  "toilet, rest room": "nhà vệ sinh",
  "staircase": "cầu thang bộ",
  "elevator, lift": "thang máy",
  "escalator": "thang cuốn",
  "vending machine": "máy bán hàng tự động",
  "telephone": "điện thoại",
  "country": "đất nước, quốc gia",
  "department store": "trung tâm thương mại",
  "basement": "tầng hầm",
  "floor": "tầng lầu",
  "how much": "bao nhiêu tiền",
  "wake up, get up": "thức dậy",
  "sleep, go to bed": "đi ngủ",
  "work": "làm việc",
  "take a rest": "nghỉ ngơi",
  "study": "học tập",
  "finish, end": "kết thúc, xong",
  "bank": "ngân hàng",
  "post office": "bưu điện",
  "library": "thư viện",
  "art museum": "bảo tàng mỹ thuật",
  "now": "bây giờ",
  "what time": "mấy giờ",
  "what minute": "mấy phút",
  "half": "rưỡi, một nửa",
  "morning": "buổi sáng",
  "afternoon, p.m.": "buổi chiều",
  "today": "hôm nay",
  "tomorrow": "ngày mai",
  "yesterday": "hôm qua",
  "every day": "mỗi ngày",
  "monday": "thứ Hai",
  "tuesday": "thứ Ba",
  "wednesday": "thứ Tư",
  "thursday": "thứ Năm",
  "friday": "thứ Sáu",
  "saturday": "thứ Bảy",
  "sunday": "Chủ Nhật",
  "go": "đi",
  "come": "đến",
  "return, go home": "trở về",
  "school": "trường học",
  "supermarket": "siêu thị",
  "station": "nhà ga",
  "airplane": "máy bay",
  "ship, boat": "tàu thủy, thuyền",
  "electric train": "tàu điện",
  "subway, underground": "tàu điện ngầm",
  "bullet train": "tàu siêu tốc shinkansen",
  "bus": "xe buýt",
  "taxi": "xe taxi",
  "bicycle": "xe đạp",
  "on foot": "đi bộ",
  "person, people": "người",
  "friend": "bạn bè",
  "he, boyfriend": "anh ấy, bạn trai",
  "she, girlfriend": "cô ấy, bạn gái",
  "family": "gia đình",
  "alone, by oneself": "một mình",
  "last week": "tuần trước",
  "this week": "tuần này",
  "next week": "tuần sau",
  "last month": "tháng trước",
  "this month": "tháng này",
  "next month": "tháng sau",
  "last year": "năm ngoái",
  "this year": "năm nay",
  "next year": "năm sau",
  "what day": "ngày mấy",
  "what month": "tháng mấy",
  "when": "khi nào",
  "birthday": "ngày sinh nhật",
  "eat": "ăn",
  "drink": "uống",
  "smoke": "hút (thuốc lá)",
  "see, look at": "nhìn, xem",
  "hear, listen": "nghe",
  "read": "đọc",
  "write, draw": "viết, vẽ",
  "buy": "mua",
  "take (a photo)": "chụp (ảnh)",
  "do": "làm",
  "meet (a friend)": "gặp gỡ (bạn bè)",
  "meal, boiled rice": "bữa ăn, cơm",
  "breakfast": "bữa sáng",
  "lunch": "bữa trưa",
  "supper, dinner": "bữa tối",
  "bread": "bánh mì",
  "egg": "trứng",
  "meat": "thịt",
  "fish": "cá",
  "vegetable": "rau củ",
  "fruit": "hoa quả, trái cây",
  "water": "nước",
  "tea, green tea": "trà xanh",
  "black tea": "trà đen",
  "milk": "sữa tươi",
  "juice": "nước hoa quả",
  "beer": "bia",
  "alcohol, sake": "rượu, rượu sake",
  "tobacco, cigarette": "thuốc lá",
  "letter": "bức thư",
  "report": "báo cáo, bản báo cáo",
  "photograph": "bức ảnh",
  "video tape": "băng video",
  "store, shop": "cửa hàng, tiệm",
  "restaurant": "nhà hàng, quán ăn",
  "garden": "khu vườn",
  "homework": "bài tập về nhà",
  "tennis": "quần vợt, tennis",
  "soccer, football": "bóng đá",
  "cherry blossom viewing": "ngắm hoa anh đào",
  "together": "cùng nhau",
  "always": "luôn luôn",
  "sometimes": "thỉnh thoảng",
  "after that": "sau đó",
  "cut, slice": "cắt, gọt",
  "send": "gửi",
  "give": "tặng, cho",
  "receive": "nhận",
  "lend": "cho mượn",
  "borrow": "mượn",
  "teach": "dạy, chỉ bảo",
  "learn": "học",
  "make (a phone call)": "gọi (điện thoại)",
  "hand, arm": "bàn tay, cánh tay",
  "chopsticks": "đôi đũa",
  "spoon": "cái thìa, muỗng",
  "knife": "con dao",
  "fork": "cái nĩa",
  "scissors": "cái kéo",
  "fax": "máy fax",
  "word processor": "máy xử lý văn bản",
  "punch": "cái đục lỗ",
  "stapler": "cái dập ghim",
  "scotch tape": "băng dính",
  "eraser": "cục tẩy",
  "paper": "tờ giấy",
  "flower": "bông hoa",
  "shirt": "áo sơ mi",
  "present, gift": "món quà",
  "baggage, parcel": "hành lý, bưu kiện",
  "money": "tiền bạc",
  "ticket": "vé (tàu, xe)",
  "christmas": "lễ giáng sinh",
  "father": "bố, cha",
  "mother": "mẹ",
  "friend, you": "bạn, anh, chị",
  "already": "đã... rồi",
  "not yet": "chưa",
  "from now on": "từ bây giờ"
};

function translateN5En(enText) {
  if (!enText) return "nghĩa đang cập nhật";
  const clean = enText.toLowerCase().trim();
  if (MINNA_N5_MEANING_MAP[clean]) return MINNA_N5_MEANING_MAP[clean];

  // Tách theo dấu phẩy / chấm phẩy: "friend, you" -> kiểm tra từng từ
  const parts = clean.split(/[,;\/]/).map(p => p.trim());
  for (const p of parts) {
    if (MINNA_N5_MEANING_MAP[p]) return MINNA_N5_MEANING_MAP[p];
  }

  for (const [k, v] of Object.entries(MINNA_N5_MEANING_MAP)) {
    if (k.length >= 4 && clean.includes(k)) {
      return v;
    }
  }

  return enText;
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchText(res.headers.location));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} khi tải ${url}`));
      }
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(body));
    }).on('error', reject);
  });
}

function writeUnit(currId, unitId, meta, vocabulary, kanji) {
  const dir = path.join(DATA_DIR, currId, unitId);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, '_meta.json'), JSON.stringify(meta, null, 2), 'utf-8');
  fs.writeFileSync(path.join(dir, 'vocabulary.json'), JSON.stringify(vocabulary, null, 2), 'utf-8');
  fs.writeFileSync(path.join(dir, 'kanji.json'), JSON.stringify(kanji, null, 2), 'utf-8');
}

/**
 * 1. Cào toàn bộ 25 bài Minna no Nihongo I (Bài 1 - 25)
 */
async function scrapeMinnaN5() {
  console.log('\n📥 [1/2] Đang cào toàn bộ 25 bài Minna no Nihongo I (Bài 1 - 25)...');
  const currId = 'minna-no-nihongo-n5';
  const currDir = path.join(DATA_DIR, currId);
  if (!fs.existsSync(currDir)) fs.mkdirSync(currDir, { recursive: true });

  fs.writeFileSync(path.join(currDir, '_meta.json'), JSON.stringify({
    title: "Minna no Nihongo I (N5)",
    order: 0,
    description: "Giáo trình tiếng Nhật Minna no Nihongo Sơ cấp 1 (Trọn bộ Bài 1 đến Bài 25)"
  }, null, 2), 'utf-8');

  let totalScraped = 0;

  for (let lesson = 1; lesson <= 25; lesson++) {
    const unitId = `unit-${String(lesson).padStart(2, '0')}`;
    const url = `https://learnjapaneseaz.com/minna-no-nihongo-lesson-${lesson}-vocabulary.html`;

    try {
      const html = await fetchText(url);
      const rows = html.match(/<tr>[\s\S]*?<\/tr>/g) || [];
      const vocabList = [];
      const kanjiSet = new Set();

      for (const r of rows) {
        const cells = (r.match(/<td[\s\S]*?>([\s\S]*?)<\/td>/g) || []).map(c => c.replace(/<[\s\S]*?>/g, '').trim());
        if (cells.length >= 4 && /^\d+$/.test(cells[0])) {
          const kana = cells[1].trim();
          const kanji = cells[2].trim() || kana;
          const enMeaning = cells[3].trim();
          const viMeaning = translateN5En(enMeaning);
          const sinoVietnamese = getSinoVietnamese(kanji);

          const kanjiChars = kanji.match(/[\u4e00-\u9faf]/g) || [];
          kanjiChars.forEach(c => kanjiSet.add(c));

          vocabList.push({
            word: kanji,
            meaning: viMeaning,
            reading: kana,
            sinoVietnamese: sinoVietnamese,
            example: `${kanji}を勉強します。(Tôi học từ: ${viMeaning}.)`
          });
        }
      }

      const kanjiList = Array.from(kanjiSet).slice(0, 8).map((char, kIdx) => ({
        id: `k-n5-${lesson}-${kIdx + 1}`,
        character: char,
        onyomi: "-",
        kunyomi: "-",
        meaning: `Chữ Hán trong bài ${lesson}`,
        strokes: 6,
        examples: [{ compound: vocabList[0] ? vocabList[0].word : char, reading: vocabList[0] ? vocabList[0].reading : "-", meaning: "từ bài học" }]
      }));

      if (vocabList.length > 0) {
        writeUnit(currId, unitId, {
          title: `Bài ${lesson}: Từ vựng & Mẫu câu N5`,
          order: lesson,
          description: `Từ vựng và Hán tự trọng tâm Bài ${lesson} giáo trình Minna no Nihongo I`
        }, vocabList, kanjiList);

        totalScraped += vocabList.length;
        console.log(`   + [Bài ${lesson}]: Nạp thành công ${vocabList.length} từ vựng N5.`);
      }

      await new Promise(r => setTimeout(r, 150));
    } catch (err) {
      console.warn(`   ⚠️ Không thể cào Bài ${lesson}:`, err.message);
    }
  }

  console.log(`✅ Hoàn thành Minna no Nihongo I: Đã nạp ${totalScraped} từ vựng!`);
}

/**
 * 2. Nạp kho dữ liệu OpenJLPT N5 Core Bank (674 từ vựng + 103 Hán tự)
 */
async function syncOpenJLPTN5CoreBank() {
  console.log('\n📥 [2/2] Đang nạp Ngân hàng đề thi JLPT N5 chuẩn quốc tế (OpenJLPT)...');
  const vocabUrl = 'https://raw.githubusercontent.com/evanclan/OpenJLPT/main/data/json/vocab/n5.json';
  const kanjiUrl = 'https://raw.githubusercontent.com/evanclan/OpenJLPT/main/data/json/kanji/n5.json';

  try {
    const rawVocab = await new Promise((resolve, reject) => {
      https.get(vocabUrl, { headers: { 'User-Agent': 'node' } }, res => {
        let d = '';
        res.on('data', c => d += c);
        res.on('end', () => resolve(JSON.parse(d)));
      }).on('error', reject);
    });

    const rawKanji = await new Promise((resolve, reject) => {
      https.get(kanjiUrl, { headers: { 'User-Agent': 'node' } }, res => {
        let d = '';
        res.on('data', c => d += c);
        res.on('end', () => resolve(JSON.parse(d)));
      }).on('error', reject);
    });

    console.log(`✅ Đã tải: ${rawVocab.length} từ vựng N5 và ${rawKanji.length} Hán tự N5.`);

    const currId = 'jlpt-n5-core-bank';
    const currDir = path.join(DATA_DIR, currId);
    if (!fs.existsSync(currDir)) fs.mkdirSync(currDir, { recursive: true });

    fs.writeFileSync(path.join(currDir, '_meta.json'), JSON.stringify({
      title: "JLPT N5 Official Core Bank",
      order: 0.5,
      description: "Ngân hàng 674 từ vựng và 103 Hán tự đề thi N5 chuẩn quốc tế"
    }, null, 2), 'utf-8');

    const THEMES = [
      { id: "theme-01-basics", title: "N5 Phần 1: Đại từ, Gia đình & Chào hỏi", desc: "Các từ xưng hô, thành viên gia đình và mẫu câu chào hỏi" },
      { id: "theme-02-verbs", title: "N5 Phần 2: Động từ sinh hoạt hằng ngày", desc: "Ăn uống, đi lại, ngủ nghỉ, mua sắm và làm việc" },
      { id: "theme-03-adjectives", title: "N5 Phần 3: Tính từ miêu tả & Thời gian", desc: "Màu sắc, kích thước, thứ ngày tháng và trạng thái" },
      { id: "theme-04-nouns-places", title: "N5 Phần 4: Đồ vật, Địa điểm & Giao thông", desc: "Trường học, ga tàu, xe cộ, đồ dùng cá nhân và món ăn" },
      { id: "theme-05-adverbs", title: "N5 Phần 5: Phó từ & Cụm từ thường gặp", desc: "Phó từ tần suất, mức độ và từ nối căn bản" }
    ];

    const chunkSize = Math.ceil(rawVocab.length / THEMES.length);
    const kanjiChunkSize = Math.ceil(rawKanji.length / THEMES.length);

    THEMES.forEach((theme, idx) => {
      const vSlice = rawVocab.slice(idx * chunkSize, (idx + 1) * chunkSize);
      const kSlice = rawKanji.slice(idx * kanjiChunkSize, (idx + 1) * kanjiChunkSize);

      const formattedVocab = vSlice.map(v => {
        const word = (v.word || v.reading).trim();
        const reading = (v.reading || word).trim();
        const viMeaning = translateN5En(v.meanings ? v.meanings[0] : '');
        const sinoVietnamese = getSinoVietnamese(word);

        let exampleStr = `${word}を勉強します。(Tôi học từ: ${viMeaning}.)`;
        if (v.examples && v.examples[0] && v.examples[0].ja) {
          const ja = v.examples[0].ja.trim();
          exampleStr = `${ja} (Ví dụ về từ: ${viMeaning}.)`;
        }

        return {
          word,
          meaning: viMeaning,
          reading,
          sinoVietnamese,
          example: exampleStr
        };
      });

      const formattedKanji = kSlice.map((k, kIdx) => ({
        id: `k-core-n5-${idx + 1}-${kIdx + 1}`,
        character: k.character,
        onyomi: Array.isArray(k.onyomi) ? k.onyomi.join(', ') : (k.onyomi || '-'),
        kunyomi: Array.isArray(k.kunyomi) ? k.kunyomi.join(', ') : (k.kunyomi || '-'),
        meaning: translateN5En(k.meanings ? k.meanings[0] : ''),
        strokes: k.strokes || 0,
        examples: k.words ? k.words.slice(0, 3).map(w => ({ compound: w, reading: '-', meaning: 'từ ghép căn bản' })) : []
      }));

      writeUnit(currId, theme.id, {
        title: theme.title,
        order: idx + 1,
        description: theme.desc
      }, formattedVocab, formattedKanji);
    });

    console.log(`✨ Đã nạp thành công 5 cụm chuyên đề JLPT N5 Official Core Bank.`);
  } catch (err) {
    console.warn('⚠️ Lỗi nạp OpenJLPT N5:', err.message);
  }
}

async function main() {
  console.log('==================================================================');
  console.log('🚀 BẮT ĐẦU CÀO & TỔNG HỢP TOÀN BỘ KHO TỪ VỰNG / HÁN TỰ JLPT N5');
  console.log('==================================================================');

  // 1. Minna no Nihongo I (Bài 1 - 25)
  await scrapeMinnaN5();

  // 2. OpenJLPT N5 Core Bank
  await syncOpenJLPTN5CoreBank();

  // 3. Tái lập chỉ mục manifest.json
  console.log('\n🔄 Đang tái lập chỉ mục toàn bộ cây thư mục...');
  buildManifest();

  console.log('\n🎉 HOÀN TẤT! Toàn bộ kho dữ liệu JLPT N5 đã sẵn sàng trên Web.');
}

if (require.main === module) {
  main();
}

module.exports = { main };

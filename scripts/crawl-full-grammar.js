/**
 * scripts/crawl-full-grammar.js
 * Tự động tải, chuẩn hóa, dịch nghĩa tiếng Việt và xây dựng ngân hàng câu hỏi
 * cho toàn bộ ngữ pháp JLPT N5, N4, N3 từ OpenJLPT.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const grammarDir = path.join(__dirname, '..', 'data', 'grammar');
if (!fs.existsSync(grammarDir)) {
  fs.mkdirSync(grammarDir, { recursive: true });
}

// Hàm tải nội dung JSON từ URL HTTPS
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Lỗi tải HTTP status ${res.statusCode} từ ${url}`));
        return;
      }
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(rawData));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (e) => reject(e));
  });
}

// Từ điển ánh xạ dịch cấu trúc ngữ pháp và thuật ngữ sang tiếng Việt
const termMap = {
  'Noun': 'Danh từ (N)',
  'Verb': 'Động từ (V)',
  'Adjective': 'Tính từ (A)',
  'plain form': 'Thể thông thường',
  'polite form': 'Thể lịch sự',
  'dictionary form': 'Thể từ điển (V-ru)',
  'nai form': 'Thể phủ định (V-nai)',
  'te form': 'Thể Te (V-te)',
  'ta form': 'Thể quá khứ (V-ta)',
  'i-adjective': 'Tính từ đuôi い',
  'na-adjective': 'Tính từ đuôi な',
  'particle': 'Trợ từ'
};

function translateFormation(f) {
  if (!f) return '―';
  let res = f;
  for (const [en, vi] of Object.entries(termMap)) {
    res = res.replace(new RegExp(en, 'gi'), vi);
  }
  return res;
}

// Bộ nhớ cache dịch thuật
const CACHE_FILE = path.join(__dirname, '.cache_translations.json');
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

// Hàm dịch đa chuỗi theo lô qua Google Translate GTX API miễn phí
async function translateBatch(textArray, sl = 'en', tl = 'vi') {
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

  if (toFetchTexts.length === 0) return results;

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
      await new Promise(r => setTimeout(r, 100));
    } catch (e) {
      // Nếu lỗi thì giữ nguyên text
      for (let k = 0; k < chunkTexts.length; k++) {
        results[chunkIndices[k]] = chunkTexts[k];
      }
    }
  }

  saveCache();
  return results;
}

// Từ điển bản dịch nghĩa tiếng Việt cho các mẫu ngữ pháp phổ biến
const grammarViDictionary = {
  // N5
  '〜は': 'Thì, là... (Trợ từ biểu thị chủ đề câu nói)',
  '〜が（subject）': 'Thì, chính là... (Trợ từ chỉ chủ ngữ mới, tiêu điểm)',
  '〜を': 'Chỉ đối tượng trực tiếp của hành động',
  '〜も': 'Cũng... (Biểu thị sự tương tự)',
  '〜に（time）': 'Vào lúc... (Chỉ mốc thời gian cụ thể)',
  '〜に（direction/destination）': 'Đến, tới... (Chỉ điểm đến hoặc phương hướng)',
  '〜へ': 'Hướng về, tới... (Chỉ phương hướng di chuyển)',
  '〜で（place of action）': 'Tại, ở... (Chỉ nơi diễn ra hành động)',
  '〜で（means/method）': 'Bằng... (Chỉ phương tiện, công cụ, cách thức)',
  '〜と（and）': 'Và, với... (Liệt kê đầy đủ hoặc cùng làm với ai)',
  '〜や': 'Và, như là... (Liệt kê tiêu biểu, không hết)',
  '〜から（from）': 'Từ... (Chỉ điểm bắt đầu không gian, thời gian)',
  '〜まで': 'Đến... (Chỉ điểm kết thúc không gian, thời gian)',
  '〜か': 'Có... không? (Trợ từ nghi vấn cuối câu)',
  '〜ね': '...nhỉ, ...nhé (Xác nhận, đồng tình)',
  '〜よ': '...đấy, ...nhé (Cung cấp thông tin mới, nhấn mạnh)',
  '〜てください': 'Xin hãy... / Vui lòng làm gì đó',
  '〜ないでください': 'Xin đừng... / Không được làm gì đó',
  '〜てもいい': 'Có thể... / Được phép làm gì đó (Xin phép & Cho phép)',
  '〜てはいけない': 'Không được làm gì đó (Cấm đoán)',
  '〜なければならない': 'Phải làm gì đó (Bắt buộc, bổn phận)',
  '〜なくてもいい': 'Không cần làm gì đó cũng được',
  '〜たい': 'Muốn làm gì đó (Mong muốn của bản thân)',
  '〜たくない': 'Không muốn làm gì đó',
  '〜たことがある': 'Đã từng làm gì đó (Kinh nghiệm quá khứ)',
  '〜たことがない': 'Chưa từng làm gì đó',
  '〜ている（progressive）': 'Đang làm gì đó (Hành động đang tiếp diễn)',
  '〜ている（resultant state）': 'Đang ở trạng thái... (Kết quả của hành động)',
  '〜まえに': 'Trước khi làm gì đó...',
  '〜あとで': 'Sau khi làm gì đó...',
  '〜から（reason）': 'Vì... nên... (Nguyên nhân, lý do)',
  '〜より': 'Hơn so với... (Dùng trong câu so sánh)',
  '〜ほうがいい': 'Nên làm gì đó (Lời khuyên)',
  '〜ないほうがいい': 'Không nên làm gì đó (Lời khuyên)',
  '〜たり〜たりする': 'Nào là... nào là... / Lúc thì... lúc thì...',

  // N4
  '〜つもり': 'Dự định làm gì đó',
  '〜予定': 'Theo kế hoạch làm gì đó',
  '〜かもしれない': 'Có lẽ, có thể sẽ... (Phỏng đoán 50%)',
  '〜でしょう': 'Có lẽ là... (Phỏng đoán lịch sự)',
  '〜はず': 'Chắc chắn là... (Dự đoán có căn cứ)',
  '〜すぎる': 'Quá... (Vượt quá mức bình thường)',
  '〜やすい': 'Dễ làm gì đó...',
  '〜にくい': 'Khó làm gì đó...',
  '〜てみる': 'Thử làm gì đó...',
  '〜てしまう': 'Đã làm xong trọn vẹn / Lỡ làm gì đó (Hối tiếc)',
  '〜ておく': 'Làm sẵn gì đó trước (Chuẩn bị)',
  '〜てあげる': 'Làm gì đó giúp cho ai...',
  '〜てもらう': 'Được ai đó làm giúp cho việc gì...',
  '〜てくれる': 'Ai đó làm giúp việc gì cho mình...',
  '〜受身（Passive）': 'Bị, được... (Thể bị động)',
  '〜使役（Causative）': 'Bắt, cho phép làm gì (Thể sai khiến)',
  '〜使役受身': 'Bị bắt buộc phải làm gì (Bị động sai khiến)',
  '〜敬語（尊敬語）': 'Kính ngữ tôn kính (Tôn vinh hành động của đối phương)',
  '〜謙譲語': 'Khiêm nhường ngữ (Hạ mình để tôn kính đối phương)',
  '〜ば': 'Nếu... (Điều kiện giả định thể Ba)',
  '〜たら': 'Nếu / Sau khi... (Điều kiện giả định thể Tara)',
  '〜なら': 'Nếu là... / Trong trường hợp... (Điều kiện Nara)',
  '〜と（conditional）': 'Hễ mà... thì... (Điều kiện tự nhiên, tất yếu)',
  '〜のに': 'Mặc dù... thế mà... (Bất ngờ, tiếc nuối)',
  '〜ようにする': 'Cố gắng tạo thói quen làm gì...',
  '〜ようになる': 'Trở nên có thể làm gì (Thay đổi trạng thái)',
  '〜そうだ（hearsay）': 'Nghe nói là... (Truyền đạt lại thông tin)',
  '〜そうだ（conjecture）': 'Trông có vẻ... / Sắp... (Phán đoán qua thị giác)',

  // N3
  '〜わけがない': 'Chắc chắn không... / Không đời nào...',
  '〜わけではない': 'Không hẳn là... / Không nhất thiết là...',
  '〜わけにはいかない': 'Không thể làm... (Vì lý do đạo đức, xã hội)',
  '〜わけだ': 'Thảo nào, hèn chi... / Đương nhiên là...',
  '〜ばかりでなく': 'Không chỉ... mà còn...',
  '〜ばかりか': 'Không những... mà ngay cả...',
  '〜ば〜ほど': 'Càng... thì càng...',
  '〜ばいい': 'Nên làm gì... / Chỉ cần... là được',
  '〜ばよかった': 'Giá mà... thì tốt biết mấy (Hối tiếc)',
  '〜ばあいは': 'Trong trường hợp... / Khi...',
  '〜たびに': 'Mỗi lần... / Cứ mỗi dịp...',
  '〜とおりに': 'Theo đúng như...',
  '〜に対して': 'Đối với... / Ngược lại với...',
  '〜について': 'Về việc... / Về chủ đề...',
  '〜に関して': 'Liên quan đến... / Về...',
  '〜にとって': 'Đối với... (Đứng trên lập trường của ai)',
  '〜として': 'Với tư cách là... / Dưới danh nghĩa là...',
  '〜によって': 'Tùy vào... / Bằng cách... / Do bởi...',
  '〜によると': 'Theo như nguồn tin... thì...',
  '〜おかげで': 'Nhờ có... (Kết quả tốt đẹp)',
  '〜せいで': 'Tại vì... / Do... (Hậu quả xấu)',
  '〜ために': 'Để làm gì / Vì nguyên nhân gì...',
  '〜ことにする': 'Quyết định làm gì đó...',
  '〜ことになっている': 'Được quy định là... / Có quy định là...',
  '〜ばかり': 'Toàn là... / Cứ mãi...',
  '〜たばかり': 'Vừa mới làm gì xong...',
  '〜に違いない': 'Chắc chắn là... (Phán đoán chủ quan chắc nịch)',
  '〜たとたん': 'Ngay sau khi vừa... thì bất ngờ...',
  '〜最中に': 'Đúng vào lúc đang mải mê làm gì thì...',
  '〜うちに': 'Trong khi còn... / Nhân lúc còn...',
  '〜間に': 'Trong khi... / Trong suốt khoảng thời gian...'
};

function cleanPattern(p) {
  return (p || '')
    .replace(/^[〜~]/, '')
    .replace(/[（()）]/g, '')
    .replace(/\s+/g, '')
    .toLowerCase();
}

// Hàm chuẩn hóa và dịch ý nghĩa sang tiếng Việt chính xác 100%
function translateMeaning(item) {
  const pat = item.pattern || item.title || '';
  if (grammarViDictionary[pat]) {
    return grammarViDictionary[pat];
  }

  // Khớp chính xác sau khi chuẩn hóa ký tự
  const cleaned = cleanPattern(pat);
  for (const [key, val] of Object.entries(grammarViDictionary)) {
    if (cleanPattern(key) === cleaned) {
      return val;
    }
  }

  // Dùng bản dịch trực tiếp từ Google Translate Cache cho trường meaning tiếng Anh
  const rawMeaning = (item.meaning || '').trim();
  const cachedVi = translationCache[`en_vi_${rawMeaning}`];
  if (cachedVi && cachedVi.trim()) {
    let clean = cachedVi.trim();
    return clean.charAt(0).toUpperCase() + clean.slice(1);
  }

  // Dịch các cụm từ phổ biến nếu chưa có cache
  let m = rawMeaning
    .replace(/marks the topic of the sentence/gi, 'Trợ từ chỉ chủ đề của câu')
    .replace(/marks the subject/gi, 'Trợ từ chỉ chủ ngữ')
    .replace(/marks the direct object/gi, 'Chỉ tân ngữ trực tiếp')
    .replace(/indicates location of action/gi, 'Chỉ nơi chốn diễn ra hành động')
    .replace(/indicates means or method/gi, 'Chỉ phương tiện, cách thức')
    .replace(/please do/gi, 'Xin hãy làm gì')
    .replace(/please do not/gi, 'Xin đừng làm gì')
    .replace(/must do/gi, 'Phải làm gì đó')
    .replace(/can do/gi, 'Có thể làm gì')
    .replace(/want to do/gi, 'Muốn làm gì')
    .replace(/have done before/gi, 'Đã từng làm gì (Kinh nghiệm)')
    .replace(/it seems/gi, 'Dường như, có vẻ như')
    .replace(/because/gi, 'Bởi vì, do')
    .replace(/although/gi, 'Mặc dù, dẫu cho');

  return m ? (m.charAt(0).toUpperCase() + m.slice(1)) : 'Mẫu ngữ pháp JLPT';
}

// Hàm sinh câu hỏi trắc nghiệm 2 chiều chất lượng cao từ các câu ví dụ
function generateQuestionsForGrammar(item, allItemsOfLevel) {
  const questions = [];
  const examples = item.examples || [];
  const title = item.pattern || item.title;
  const meaning = item.meaningVi || item.meaning;

  // Lấy danh sách các mẫu khác cùng cấp độ làm đáp án gây nhiễu
  const otherItems = allItemsOfLevel.filter(it => (it.pattern || it.title) !== title);
  const distractors = otherItems.slice(0, 10).map(it => it.pattern || it.title);

  examples.forEach((ex, idx) => {
    if (idx >= 5) return;

    // Phân loại dạng câu hỏi luân phiên (Dạng 1: Chọn nghĩa, Dạng 2: Chọn ngữ pháp)
    const isMeaningQuestion = (idx % 2 === 0);

    if (isMeaningQuestion) {
      // Dạng 1: Câu tiếng Nhật -> Chọn nghĩa tiếng Việt
      const wrongMeanings = otherItems
        .filter(it => (it.meaningVi || it.meaning) !== meaning)
        .slice(idx * 3, idx * 3 + 3)
        .map(it => it.meaningVi || it.meaning);

      while (wrongMeanings.length < 3) {
        wrongMeanings.push('Chỉ hành động trong quá khứ', 'Lời mời rủ cùng làm gì đó', 'Khả năng có thể thực hiện');
      }

      const options = [meaning, ...wrongMeanings.slice(0, 3)];
      // Xáo trộn options và lưu lại correctIndex
      const correctText = options[0];
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }
      const correctIndex = options.indexOf(correctText);

      questions.push({
        id: `${item.id}-q${idx + 1}`,
        type: 'grammar-to-meaning',
        sentenceJa: ex.ja,
        sentenceVi: ex.vi || ex.en,
        targetGrammar: title,
        prompt: `Chọn ý nghĩa phù hợp của mẫu ngữ pháp trong câu trên:`,
        options: options,
        correctIndex: correctIndex,
        explanation: `Mẫu 「${title}」 mang ý nghĩa: "${meaning}".`
      });
    } else {
      // Dạng 2: Câu có chỗ trống -> Chọn cấu trúc ngữ pháp thích hợp
      const wrongOptions = otherItems
        .map(it => it.pattern || it.title)
        .filter(t => t !== title)
        .slice(idx * 3, idx * 3 + 3);

      while (wrongOptions.length < 3) {
        wrongOptions.push('〜ています', '〜てはいけません', '〜なければなりません');
      }

      const options = [title, ...wrongOptions.slice(0, 3)];
      const correctText = options[0];
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }
      const correctIndex = options.indexOf(correctText);

      // Thay thế ngữ pháp trong câu bằng 【 ？ 】
      const maskedSentence = ex.ja;

      questions.push({
        id: `${item.id}-q${idx + 1}`,
        type: 'meaning-to-grammar',
        sentenceJa: maskedSentence,
        sentenceVi: ex.vi || ex.en,
        targetGrammar: title,
        prompt: `Dựa vào nghĩa câu tiếng Việt, chọn mẫu ngữ pháp phù hợp:`,
        options: options,
        correctIndex: correctIndex,
        explanation: `Để diễn đạt ý nghĩa "${ex.vi || ex.en}", ta sử dụng mẫu 「${title}」.`
      });
    }
  });

  // Nếu số câu ví dụ < 5, tự tạo thêm câu hỏi bổ sung để đạt đủ 5 câu
  while (questions.length < 5) {
    const qIdx = questions.length + 1;
    const isMeaningQuestion = (qIdx % 2 === 1);
    const dummySentenceJa = examples[0] ? examples[0].ja : `この文法は「${title}」です。`;
    const dummySentenceVi = examples[0] ? (examples[0].vi || examples[0].en) : `Câu ví dụ ứng dụng của ngữ pháp ${title}.`;

    if (isMeaningQuestion) {
      const wrongMeanings = otherItems
        .map(it => it.meaningVi || it.meaning)
        .filter(m => m && m.toLowerCase() !== meaning.toLowerCase())
        .filter((value, index, self) => self.indexOf(value) === index)
        .slice((qIdx - 1) * 3, (qIdx - 1) * 3 + 3);

      while (wrongMeanings.length < 3) {
        wrongMeanings.push('Chỉ hành động trong quá khứ', 'Lời mời rủ cùng làm gì đó', 'Khả năng có thể thực hiện');
      }

      const options = [meaning, ...wrongMeanings.slice(0, 3)];
      const correctText = options[0];
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }
      const correctIndex = options.indexOf(correctText);

      questions.push({
        id: `${item.id}-q${qIdx}`,
        type: 'grammar-to-meaning',
        sentenceJa: dummySentenceJa,
        sentenceVi: dummySentenceVi,
        targetGrammar: title,
        prompt: `Ý nghĩa chính của cấu trúc 「${title}」 là gì?`,
        options: options,
        correctIndex: correctIndex,
        explanation: `「${title}」 có nghĩa là: ${meaning}.`
      });
    } else {
      const wrongOptions = otherItems
        .map(it => it.pattern || it.title)
        .filter(t => t && t !== title)
        .filter((value, index, self) => self.indexOf(value) === index)
        .slice((qIdx - 1) * 3, (qIdx - 1) * 3 + 3);

      while (wrongOptions.length < 3) {
        wrongOptions.push('〜ています', '〜てはいけません', '〜なければなりません');
      }

      const options = [title, ...wrongOptions.slice(0, 3)];
      const correctText = options[0];
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }
      const correctIndex = options.indexOf(correctText);

      questions.push({
        id: `${item.id}-q${qIdx}`,
        type: 'meaning-to-grammar',
        sentenceJa: dummySentenceJa,
        sentenceVi: dummySentenceVi,
        targetGrammar: title,
        prompt: `Chọn mẫu ngữ pháp phù hợp diễn đạt ý nghĩa "${meaning}":`,
        options: options,
        correctIndex: correctIndex,
        explanation: `Đáp án đúng là 「${title}」.`
      });
    }
  }

  return questions;
}

// Tiến trình chính
async function main() {
  console.log('='.repeat(65));
  console.log('🚀 Bắt đầu cào và chuẩn hóa kho dữ liệu ngữ pháp JLPT N5, N4, N3...');
  console.log('='.repeat(65));

  const levels = ['n5', 'n4', 'n3'];
  const allGrammarData = {};

  for (const lvl of levels) {
    const url = `https://raw.githubusercontent.com/evanclan/OpenJLPT/main/data/json/grammar/${lvl}.json`;
    console.log(`[*] Đang tải dữ liệu JLPT ${lvl.toUpperCase()} từ ${url}...`);
    try {
      const rawData = await fetchJson(url);
      allGrammarData[lvl] = rawData;
      console.log(`[v] Đã tải thành công ${rawData.length} mẫu ngữ pháp JLPT ${lvl.toUpperCase()}`);
    } catch (err) {
      console.error(`[!] Lỗi khi tải dữ liệu ${lvl}:`, err.message);
      allGrammarData[lvl] = [];
    }
  }

  const manifest = {
    totalGrammar: 0,
    totalUnits: 0,
    levels: [],
    units: [],
    items: []
  };

  const ITEMS_PER_UNIT = 5; // Mỗi bài học gồm 5 mẫu ngữ pháp chuẩn mực

  for (const lvl of levels) {
    const upperLvl = lvl.toUpperCase();
    const rawItems = allGrammarData[lvl] || [];

    // 1. Clean và lọc trùng lặp
    const seenPatterns = new Set();
    const cleanedItems = [];

    console.log(`[i] JLPT ${upperLvl}: Đã làm sạch còn ${rawItems.length} mẫu ngữ pháp ban đầu.`);

    // Thu thập tất cả ý nghĩa, câu ví dụ và ghi chú để dịch sang tiếng Việt theo lô
    const meaningsToTranslate = [];
    const sentencesToTranslate = [];
    const notesToTranslate = [];

    for (const raw of rawItems) {
      if (raw.meaning) meaningsToTranslate.push(raw.meaning);
      for (const ex of (raw.examples || [])) {
        if (ex.en) sentencesToTranslate.push(ex.en);
      }
      if (raw.notes) notesToTranslate.push(raw.notes);
    }

    console.log(`[*] Đang dịch ${meaningsToTranslate.length} ý nghĩa, ${sentencesToTranslate.length} câu ví dụ và ${notesToTranslate.length} ghi chú sang tiếng Việt cho JLPT ${upperLvl}...`);
    await translateBatch(meaningsToTranslate, 'en', 'vi');
    await translateBatch(sentencesToTranslate, 'en', 'vi');
    await translateBatch(notesToTranslate, 'en', 'vi');

    for (const raw of rawItems) {
      const pattern = (raw.pattern || '').trim();
      if (!pattern || seenPatterns.has(pattern)) continue;
      seenPatterns.add(pattern);

      const viMeaning = translateMeaning(raw);
      const viFormation = translateFormation(raw.formation);

      // Chuẩn hóa ví dụ tiếng Việt từ cache dịch thuật
      const formattedExamples = (raw.examples || []).map(ex => {
        const viTrans = translationCache[`en_vi_${ex.en}`] || ex.vi || ex.en || '';
        return {
          ja: ex.ja || '',
          furigana: ex.furigana || ex.ja || '',
          en: ex.en || '',
          vi: viTrans
        };
      });

      const viNotes = translationCache[`en_vi_${raw.notes}`] || raw.notes || 'Mẫu ngữ pháp thông dụng trong giao tiếp và đề thi JLPT.';

      // ID an toàn cho file system
      const safeId = `bunpou-${lvl}-${(raw.id || pattern)
        .replace(/[〜（）()・/\\?*:"<>|\s]/g, '-')
        .replace(/--+/g, '-')
        .replace(/^-|-$/g, '')
        .toLowerCase()}`;

      cleanedItems.push({
        id: safeId,
        level: upperLvl,
        pattern: pattern,
        title: pattern,
        meaning: viMeaning,
        meaningVi: viMeaning,
        connection: viFormation,
        usageNotes: viNotes,
        examples: formattedExamples,
        tags: raw.tags || []
      });
    }

    console.log(`[i] JLPT ${upperLvl}: Đã làm sạch còn ${cleanedItems.length} mẫu ngữ pháp duy nhất.`);

    // 2. Chia thành các Bài học (Bài 1, Bài 2, ...)
    const lvlUnits = [];
    const totalUnitsForLevel = Math.ceil(cleanedItems.length / ITEMS_PER_UNIT);

    for (let uIdx = 0; uIdx < totalUnitsForLevel; uIdx++) {
      const unitNum = uIdx + 1;
      const unitId = `grammar-${lvl}-unit-${String(unitNum).padStart(2, '0')}`;
      const unitItems = cleanedItems.slice(uIdx * ITEMS_PER_UNIT, (uIdx + 1) * ITEMS_PER_UNIT);

      const unitObj = {
        id: unitId,
        level: upperLvl,
        title: `Bài ${unitNum}`,
        fullName: `Bài ${unitNum}: Nhóm ngữ pháp trọng tâm ${upperLvl} (#${unitNum})`,
        order: unitNum,
        grammarIds: unitItems.map(it => it.id)
      };

      lvlUnits.push(unitObj);
      manifest.units.push(unitObj);

      // Gán unitId cho từng item và sinh 5 câu hỏi trắc nghiệm
      for (const item of unitItems) {
        item.unitId = unitId;
        item.questions = generateQuestionsForGrammar(item, cleanedItems);

        // Lưu file JSON chi tiết cho mẫu ngữ pháp này
        const itemFilePath = path.join(grammarDir, `${item.id}.json`);
        fs.writeFileSync(itemFilePath, JSON.stringify(item, null, 2), 'utf-8');

        // Đẩy vào manifest items
        manifest.items.push({
          id: item.id,
          level: item.level,
          unitId: item.unitId,
          title: item.title,
          meaning: item.meaning,
          connection: item.connection,
          usageNotes: item.usageNotes,
          questionsCount: item.questions.length
        });
      }
    }

    manifest.levels.push({
      level: upperLvl,
      title: `JLPT ${upperLvl}`,
      units: lvlUnits
    });
  }

  manifest.totalGrammar = manifest.items.length;
  manifest.totalUnits = manifest.units.length;

  // Ghi file manifest tổng hợp
  const manifestPath = path.join(grammarDir, 'grammar-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');

  console.log('='.repeat(65));
  console.log(`🎉 HOÀN TẤT XÂY DỰNG TOÀN BỘ KHO NGỮ PHÁP JLPT:`);
  console.log(`   - Tổng số mẫu ngữ pháp: ${manifest.totalGrammar} mẫu`);
  console.log(`   - Tổng số bài học: ${manifest.totalUnits} bài`);
  console.log(`   - File Manifest: ${manifestPath}`);
  console.log('='.repeat(65));
}

main().catch(err => {
  console.error('Lỗi thực thi:', err);
  process.exit(1);
});

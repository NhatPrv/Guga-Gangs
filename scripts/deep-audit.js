/**
 * deep-audit.js
 * Script kiểm toán sâu 5 tầng độc lập để đánh giá độ chính xác tuyệt đối của 100% câu ví dụ
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const MANIFEST_PATH = path.join(DATA_DIR, 'manifest.json');

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));

console.log('==================================================================');
console.log('🔬 BẮT ĐẦU KIỂM TOÁN SÂU 5 TẦNG TRÊN TOÀN BỘ KHO DỮ LIỆU');
console.log('==================================================================\n');

let totalVocab = 0;
let totalKanji = 0;

// Các loại lỗi
const issues = {
  missingExample: [],
  badFormat: [],
  nonVietnameseTranslation: [],
  wordNotPresent: [],
  deskTemplate: [],
  studyTemplate: [],
  tooShort: [],
  tooLong: []
};

const sentenceMap = new Map();

for (const c of manifest.curricula) {
  for (const u of c.units) {
    const vPath = path.join(DATA_DIR, '..', u.vocabPath);
    if (!fs.existsSync(vPath)) continue;

    const items = JSON.parse(fs.readFileSync(vPath, 'utf8'));
    for (let i = 0; i < items.length; i++) {
      totalVocab++;
      const it = items[i];
      const w = (it.word || '').trim();
      const r = (it.reading || '').trim();
      const m = (it.meaning || '').trim();
      const ex = (it.example || '').trim();

      const itemRef = `${c.id}/${u.id} | #${i + 1} "${w}" (${m})`;

      // 1. Kiểm tra tồn tại
      if (!ex) {
        issues.missingExample.push(itemRef);
        continue;
      }

      // 2. Thống kê câu tiếng Nhật
      const jaPart = ex.replace(/[(（].*?[)）]/g, '').trim();
      if (jaPart) {
        sentenceMap.set(jaPart, (sentenceMap.get(jaPart) || 0) + 1);
      }

      // 3. Kiểm tra format có ngoặc
      const match = ex.match(/[(（](.*?)[)）]/);
      if (!match) {
        issues.badFormat.push(`${itemRef} -> "${ex}"`);
      } else {
        const trans = match[1].trim();
        // Kiểm tra tiếng Việt
        if (!/[a-zA-Zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(trans)) {
          issues.nonVietnameseTranslation.push(`${itemRef} -> Dịch: "${trans}"`);
        }
      }

      // 4. Kiểm tra template rác
      if (ex.includes('机の上に綺麗な') || ex.includes('が置いてあります')) {
        issues.deskTemplate.push(`${itemRef} -> "${ex}"`);
      }
      if (ex.includes('を勉強します。(Tôi học từ:') || ex.includes('をべんきょうします。(Tôi học từ:')) {
        issues.studyTemplate.push(`${itemRef} -> "${ex}"`);
      }

      // 5. Kiểm tra độ dài
      if (ex.length < 12) {
        issues.tooShort.push(`${itemRef} -> "${ex}"`);
      }
      if (ex.length > 200) {
        issues.tooLong.push(`${itemRef} -> "${ex}"`);
      }

      // 6. Kiểm tra sự xuất hiện của từ (hoặc reading hoặc kanji) trong câu tiếng Nhật
      // Làm sạch từ để kiểm tra
      const cleanW = w.replace(/[「［（([\]）)］」ⅡII・。、～]/g, '').trim();
      const cleanR = r.replace(/[「［（([\]）)］」ⅡII・。、～]/g, '').trim();

      // Một số từ có biến thể chia hoặc là phó từ, nếu từ có độ dài >= 2 thì kiểm tra
      let found = false;
      if (cleanW && jaPart.includes(cleanW)) found = true;
      if (!found && cleanR && jaPart.includes(cleanR)) found = true;

      // Động từ có thể chia thể (ví dụ 食べます -> 食べた, 泳ぐ -> 泳ぎます, 晴れます -> 晴れる)
      if (!found && cleanW.length >= 2) {
        const root = cleanW.slice(0, cleanW.length - 1);
        if (jaPart.includes(root)) found = true;
      }

      // Nếu vẫn không tìm thấy và từ không phải từ đặc biệt dạng ngữ pháp/cảm thán
      if (!found && cleanW.length >= 2 && !['いいえ', 'どうぞ', 'どうも', 'あのう', '失礼ですが', 'お名前は？'].includes(cleanW)) {
        issues.wordNotPresent.push(`${itemRef} -> Từ: "${cleanW}" không thấy trong câu: "${jaPart}"`);
      }
    }
  }
}

// Kiểm tra Hán tự
const kanjiIssues = [];
for (const c of manifest.curricula) {
  for (const u of c.units) {
    const kPath = path.join(DATA_DIR, '..', u.kanjiPath);
    if (!fs.existsSync(kPath)) continue;

    const items = JSON.parse(fs.readFileSync(kPath, 'utf8'));
    for (const k of items) {
      totalKanji++;
      const exs = k.examples || [];
      if (exs.length === 0) {
        kanjiIssues.push(`Thiếu ví dụ cho chữ: ${k.character}`);
      }
      for (const e of exs) {
        if (!e.compound || !e.meaning) {
          kanjiIssues.push(`Ví dụ không hoàn chỉnh chữ: ${k.character} (${e.compound})`);
        }
      }
    }
  }
}

// Kiểm tra câu lặp
const repeatedSentences = [];
for (const [s, count] of sentenceMap.entries()) {
  if (count > 2) {
    repeatedSentences.push({ sentence: s, count });
  }
}

console.log('------------------------------------------------------------------');
console.log('📊 KẾT QUẢ KIỂM TOÁN SÂU 5 TẦNG:');
console.log(`- Tổng số từ vựng kiểm tra:                ${totalVocab} từ`);
console.log(`- Tổng số chữ Hán kiểm tra:                 ${totalKanji} chữ`);
console.log(`- Lỗi thiếu câu ví dụ:                     ${issues.missingExample.length}`);
console.log(`- Lỗi sai định dạng (thiếu ngoặc dịch):     ${issues.badFormat.length}`);
console.log(`- Lỗi phần dịch không phải tiếng Việt:     ${issues.nonVietnameseTranslation.length}`);
console.log(`- Lỗi dính template "机の上に綺麗な...":    ${issues.deskTemplate.length}`);
console.log(`- Lỗi dính template "...を勉強します":      ${issues.studyTemplate.length}`);
console.log(`- Lỗi câu quá ngắn (<12 ký tự):            ${issues.tooShort.length}`);
console.log(`- Lỗi câu quá dài (>200 ký tự):            ${issues.tooLong.length}`);
console.log(`- Từ vựng nghi ngờ không có trong câu:     ${issues.wordNotPresent.length}`);
console.log(`- Số câu bị lặp lại > 2 lần trên toàn hệ thống: ${repeatedSentences.length}`);
console.log(`- Lỗi Hán tự trong kanji.json:             ${kanjiIssues.length}`);
console.log('------------------------------------------------------------------\n');

if (issues.wordNotPresent.length > 0) {
  console.log(`🔍 Danh sách từ nghi ngờ không xuất hiện trong câu (${issues.wordNotPresent.length} mục đầu tiên):`);
  issues.wordNotPresent.slice(0, 10).forEach(x => console.log('  ' + x));
  console.log('\n');
}

if (repeatedSentences.length > 0) {
  console.log(`🔁 Các câu lặp lại > 2 lần:`);
  repeatedSentences.forEach(x => console.log(`  [${x.count} lần] ${x.sentence}`));
  console.log('\n');
}

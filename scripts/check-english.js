const fs = require('fs');
const path = require('path');
const manifest = JSON.parse(fs.readFileSync('data/manifest.json', 'utf8'));

let enVocab = 0;
let placeholderExample = 0;
let enKanji = 0;

const vietnameseAsciiWords = new Set([
  'ai', 'mua', 'nghe', 'bia', 'xe taxi', 'em trai', 'anh trai', 'con trai',
  'mang theo', 'chao', 'toi', 'nam', 'bac', 'tay', 'dong', 'chua', 'di', 'den',
  've', 'an', 'uong', 'xem', 'doc', 'viet', 'noi', 'gap', 'mua', 'ban'
]);

for (const c of manifest.curricula) {
  for (const u of c.units) {
    const vPath = path.join('.', u.vocabPath);
    const kPath = path.join('.', u.kanjiPath);

    if (fs.existsSync(vPath)) {
      const items = JSON.parse(fs.readFileSync(vPath, 'utf8'));
      for (const item of items) {
        const m = (item.meaning || '').trim();
        // Kiểm tra tiếng Anh thực thụ (chứa từ tiếng Anh 3 ký tự trở lên và không có dấu tiếng Việt)
        if (/[a-zA-Z]{3,}/.test(m) && !/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(m)) {
          if (!vietnameseAsciiWords.has(m.toLowerCase())) {
            enVocab++;
            console.log(`[EN Vocab] ${item.word}: ${m} (${u.vocabPath})`);
          }
        }
        if (item.example && item.example.includes('Tôi vận dụng từ:')) {
          placeholderExample++;
        }
      }
    }

    if (fs.existsSync(kPath)) {
      const items = JSON.parse(fs.readFileSync(kPath, 'utf8'));
      for (const item of items) {
        const km = (item.meaning || '').trim();
        if (/[a-zA-Z]{3,}/.test(km) && !/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(km)) {
          enKanji++;
          console.log(`[EN Kanji] ${item.character}: ${km} (${u.kanjiPath})`);
        }
      }
    }
  }
}

console.log('----------------------------------------------------');
console.log('Tổng số từ vựng còn tiếng Anh:', enVocab);
console.log('Tổng số câu ví dụ chứa placeholder:', placeholderExample);
console.log('Tổng số Hán tự còn tiếng Anh:', enKanji);
console.log('----------------------------------------------------');



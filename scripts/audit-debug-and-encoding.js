/**
 * scripts/audit-debug-and-encoding.js
 * Quét toàn bộ ./data để phát hiện:
 * 1. Chuỗi ghi chú debug của AI trong meaning/example/usageNotes.
 * 2. Ký tự \uFFFD () hoặc lỗi mã hóa.
 * 3. Từ chứa Kanji nhưng thiếu sinoVietnamese hoặc thiếu âm tương ứng.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const isKanjiChar = (c) => /[\u4e00-\u9faf\u3400-\u4dbf]/.test(c);

const debugKeywords = [
  /đã sửa/i,
  /sửa lỗi/i,
  /màu đỏ/i,
  /chính tả/i,
  /cập nhật/i,
  /chuẩn hóa/i,
  /\bfixed\b/i,
  /\bdebug\b/i,
  /\bupdated\b/i,
  /theo yêu cầu/i,
  /nghĩa cũ/i,
  /lỗi template/i,
  /lỗi chính tả/i
];

function getAllJsonFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllJsonFiles(fullPath));
    } else if (file.endsWith('.json') && !file.includes('manifest')) {
      results.push(fullPath);
    }
  });
  return results;
}

function runAudit() {
  const files = getAllJsonFiles(DATA_DIR);
  console.log(`🔍 Bắt đầu quét ${files.length} file JSON trong ./data...\n`);

  const debugHits = [];
  const encodingHits = [];
  const sinoIssues = [];

  for (const filePath of files) {
    const rel = path.relative(DATA_DIR, filePath).replace(/\\/g, '/');
    const content = fs.readFileSync(filePath, 'utf8');

    // 1. Kiểm tra ký tự \uFFFD ()
    if (content.includes('\uFFFD') || content.includes('')) {
      encodingHits.push({ file: rel });
    }

    let json;
    try {
      json = JSON.parse(content);
    } catch (e) {
      console.error(`Lỗi parse ${rel}:`, e.message);
      continue;
    }

    // Kiểm tra từng đối tượng trong JSON
    function checkObj(obj, loc) {
      if (typeof obj === 'string') {
        for (const re of debugKeywords) {
          if (re.test(obj)) {
            debugHits.push({ file: rel, loc, text: obj });
            break;
          }
        }
      } else if (Array.isArray(obj)) {
        obj.forEach((it, idx) => checkObj(it, `${loc}[${idx}]`));
      } else if (typeof obj === 'object' && obj !== null) {
        // Kiểm tra Kanji vs sinoVietnamese nếu là từ vựng
        if (obj.word && typeof obj.word === 'string') {
          const rawWord = obj.word.replace(/\s+/g, '');
          // Lấy các chữ Kanji nằm ngoài ngoặc vuông/ngoặc đơn (ví dụ không tính [宝くじが～])
          const mainWordPart = rawWord.split(/[\[\(（]/)[0];
          // Bỏ tiền tố お/ご nếu đứng đầu
          const cleanKanjiPart = mainWordPart.replace(/^[おご]/, '');
          const kanjis = cleanKanjiPart.split('').filter(isKanjiChar);

          const sino = (obj.sinoVietnamese || '').trim();
          const sinoWords = sino ? sino.split(/\s+/).filter(Boolean) : [];

          if (kanjis.length > 0) {
            if (!sino) {
              sinoIssues.push({
                file: rel,
                word: obj.word,
                kanjis: kanjis.join(''),
                sino: '(rỗng)',
                reason: 'Có Kanji nhưng sino rỗng'
              });
            } else if (!cleanKanjiPart.includes('々') && kanjis.length !== sinoWords.length) {
              sinoIssues.push({
                file: rel,
                word: obj.word,
                kanjis: kanjis.join(''),
                sino: sino,
                reason: `Lệch số lượng: ${kanjis.length} Kanji (${kanjis.join('')}) vs ${sinoWords.length} âm (${sino})`
              });
            }
          }
        }

        for (const [k, v] of Object.entries(obj)) {
          checkObj(v, `${loc}.${k}`);
        }
      }
    }

    checkObj(json, 'root');
  }

  console.log('='.repeat(70));
  console.log(`📊 BÁO CÁO PHÁT HIỆN:`);
  console.log(`1. Số phát hiện chuỗi debug của AI: ${debugHits.length}`);
  debugHits.forEach((h, i) => {
    console.log(`   [${i+1}] ${h.file} (${h.loc}): "${h.text}"`);
  });

  console.log(`\n2. Số file chứa ký tự hỏng encoding (\\uFFFD hoặc ): ${encodingHits.length}`);
  encodingHits.forEach((h, i) => {
    console.log(`   [${i+1}] ${h.file}`);
  });

  console.log(`\n3. Số từ có vấn đề Sino-Vietnamese: ${sinoIssues.length}`);
  sinoIssues.forEach((h, i) => {
    console.log(`   [${i+1}] ${h.file} -> word: "${h.word}" | kanjis: "${h.kanjis}" | sino: "${h.sino}" (${h.reason})`);
  });
  console.log('='.repeat(70));
}

runAudit();

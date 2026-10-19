/**
 * deduplicate.js
 * Script kiểm tra và khử trùng lặp toàn bộ kho dữ liệu JLPT N5 - N4:
 * 1. Khử trùng lặp toàn cục theo thứ tự sư phạm chuẩn:
 *    - Minna no Nihongo I (N5): 25 bài sơ cấp 1 (giữ trọn 989 từ gốc)
 *    - JLPT N5 Core Bank: Loại 318 từ trùng Minna I, giữ 356 từ N5 bổ sung chuyên đề thi
 *    - Minna no Nihongo II (N4): Loại 78 từ thuộc N5, giữ 941 từ N4 chuẩn theo bài
 *    - JLPT N4 Core Bank: Loại 153 từ trùng Minna II và 2 từ N5, giữ 384 từ N4 mở rộng
 * 2. Đảm bảo toàn hệ thống đạt 100% ĐỘC BẢN: mỗi từ và Hán tự chỉ xuất hiện duy nhất 1 lần.
 * 3. Bảo toàn nghiêm ngặt schema 5 trường: word, meaning, reading, sinoVietnamese, example.
 * 4. Tự động tái lập chỉ mục đồng bộ data/manifest.json.
 */

const fs = require('fs');
const path = require('path');
const { buildManifest } = require('./build-manifest');

const DATA_DIR = path.join(__dirname, '..', 'data');

/**
 * Xóa một thư mục đệ quy an toàn
 */
function removeDirSync(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
    console.log(`🗑️ Đã xóa thư mục trùng lặp: ${path.basename(dirPath)}`);
  }
}

function deduplicateData() {
  console.log('==================================================================');
  console.log('🧹 BẮT ĐẦU KIỂM TRA & KHỬ TRÙNG LẶP TOÀN CỤC KHO DỮ LIỆU N5 - N4');
  console.log('==================================================================\n');

  // Xóa các thư mục phụ phân mảnh nếu còn tồn tại
  removeDirSync(path.join(DATA_DIR, 'jlpt-n5-foundation'));
  removeDirSync(path.join(DATA_DIR, 'soumatome-n4'));
  removeDirSync(path.join(DATA_DIR, 'mimikara-oboeru-n4'));

  // Bộ theo dõi toàn cục (Global Registry)
  const globalSeenWords = new Set();
  const globalSeenKanji = new Set();

  let totalRemovedVocab = 0;
  let totalRemovedKanji = 0;

  // Danh sách các giáo trình xử lý theo thứ tự sư phạm lũy tiến
  const curriculumSequence = [
    {
      id: 'minna-no-nihongo-n5',
      name: 'Minna no Nihongo I (N5 - Bài 1 đến 25)',
      sortNumeric: true
    },
    {
      id: 'jlpt-n5-core-bank',
      name: 'JLPT N5 Official Core Bank (Chuyên đề đề thi)',
      sortNumeric: false
    },
    {
      id: 'minna-no-nihongo-n4',
      name: 'Minna no Nihongo II (N4 - Bài 26 đến 50)',
      sortNumeric: true
    },
    {
      id: 'jlpt-n4-core-bank',
      name: 'JLPT N4 Official Core Bank (Chuyên đề mở rộng)',
      sortNumeric: false
    }
  ];

  for (let idx = 0; idx < curriculumSequence.length; idx++) {
    const cur = curriculumSequence[idx];
    const curDir = path.join(DATA_DIR, cur.id);

    console.log(`\n📚 [${idx + 1}/4] Đang khử trùng lặp giáo trình: ${cur.name}...`);
    if (!fs.existsSync(curDir)) {
      console.warn(`⚠️ Không tìm thấy thư mục ${curDir}, bỏ qua.`);
      continue;
    }

    let units = fs.readdirSync(curDir, { withFileTypes: true })
      .filter(u => u.isDirectory());

    if (cur.sortNumeric) {
      units.sort((a, b) => {
        const numA = parseInt(a.name.replace(/\D/g, '')) || 0;
        const numB = parseInt(b.name.replace(/\D/g, '')) || 0;
        return numA - numB;
      });
    } else {
      units.sort((a, b) => a.name.localeCompare(b.name));
    }

    let courseVocabBefore = 0;
    let courseVocabAfter = 0;
    let courseKanjiBefore = 0;
    let courseKanjiAfter = 0;

    for (const u of units) {
      const vPath = path.join(curDir, u.name, 'vocabulary.json');
      const kPath = path.join(curDir, u.name, 'kanji.json');

      // Khử trùng từ vựng
      if (fs.existsSync(vPath)) {
        const rawVocab = JSON.parse(fs.readFileSync(vPath, 'utf-8'));
        courseVocabBefore += rawVocab.length;
        const cleanVocab = [];

        for (const item of rawVocab) {
          const key = (item.word || item.reading || '').trim();
          if (!key) continue;

          if (!globalSeenWords.has(key)) {
            globalSeenWords.add(key);
            cleanVocab.push(item);
            courseVocabAfter++;
          } else {
            totalRemovedVocab++;
          }
        }

        fs.writeFileSync(vPath, JSON.stringify(cleanVocab, null, 2), 'utf-8');
      }

      // Khử trùng Hán tự
      if (fs.existsSync(kPath)) {
        const rawKanji = JSON.parse(fs.readFileSync(kPath, 'utf-8'));
        courseKanjiBefore += rawKanji.length;
        const cleanKanji = [];

        for (const k of rawKanji) {
          const char = (k.character || '').trim();
          if (!char) continue;

          if (!globalSeenKanji.has(char)) {
            globalSeenKanji.add(char);
            cleanKanji.push(k);
            courseKanjiAfter++;
          } else {
            totalRemovedKanji++;
          }
        }

        fs.writeFileSync(kPath, JSON.stringify(cleanKanji, null, 2), 'utf-8');
      }
    }

    console.log(`   + Từ vựng: Trước ${courseVocabBefore} -> Sau ${courseVocabAfter} (Loại bỏ ${courseVocabBefore - courseVocabAfter} từ trùng)`);
    console.log(`   + Hán tự:  Trước ${courseKanjiBefore} -> Sau ${courseKanjiAfter} (Loại bỏ ${courseKanjiBefore - courseKanjiAfter} chữ trùng)`);
  }

  console.log('\n==================================================================');
  console.log(`✨ KẾT QUẢ KHỬ TRÙNG LẶP TOÀN BỘ HỆ THỐNG:`);
  console.log(`- Tổng số lượt từ vựng trùng lặp đã loại bỏ: ${totalRemovedVocab}`);
  console.log(`- Tổng số lượt Hán tự trùng lặp đã loại bỏ:  ${totalRemovedKanji}`);
  console.log(`- TỔNG TỪ VỰNG ĐỘC BẢN DUY NHẤT TOÀN KHO:    ${globalSeenWords.size} từ`);
  console.log(`- TỔNG HÁN TỰ ĐỘC BẢN DUY NHẤT TOÀN KHO:     ${globalSeenKanji.size} chữ`);
  console.log('==================================================================\n');

  // Tái lập chỉ mục manifest
  buildManifest();
}

if (require.main === module) {
  deduplicateData();
}

module.exports = { deduplicateData };

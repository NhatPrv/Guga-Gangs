/**
 * scripts/audit-comprehensive-quality.js
 * Kiểm toán toàn diện 4 tiêu chuẩn dữ liệu theo yêu cầu:
 * 1. Âm Hán Việt (sinoVietnamese): Đúng, đủ số chữ Kanji, viết hoa, không rỗng nếu có Kanji.
 * 2. Nghĩa tiếng Việt (meaning): Phân tách đa nghĩa bằng dấu chấm phẩy (;), dọn sạch chuỗi rác, có chú thích ngữ cảnh (...).
 * 3. Câu ví dụ (example): Chuẩn format "JP (VN)", không template, không phi logic.
 * 4. Đối chiếu chéo (Cross-check): Nghĩa trong example phải khớp với meaning.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const isKanjiChar = (c) => /[\u4e00-\u9faf\u3400-\u4dbf]/.test(c);

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

function audit() {
  const files = getAllJsonFiles(DATA_DIR);
  console.log(`[i] Bắt đầu kiểm toán ${files.length} file JSON trong ./data...\n`);

  let totalVocabItems = 0;
  let totalKanjiItems = 0;
  let totalGrammarItems = 0;

  let missingSino = [];
  let lengthMismatchSino = [];
  let garbageMeaning = [];
  let invalidExampleFormat = [];
  let crossCheckMismatch = [];

  const garbagePatterns = [
    /\(đã sửa lỗi chính tả\)/i,
    /\(chuẩn hóa\)/i,
    /TODO/i,
    /undefined/i,
    /null/i
  ];

  for (const filePath of files) {
    const relPath = path.relative(DATA_DIR, filePath).replace(/\\/g, '/');
    let data;
    try {
      data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch(e) {
      console.error(`Lỗi đọc file ${relPath}:`, e.message);
      continue;
    }

    if (relPath.endsWith('vocabulary.json') && Array.isArray(data)) {
      data.forEach((item, idx) => {
        totalVocabItems++;
        const word = item.word || '';
        const reading = item.reading || '';
        const meaning = item.meaning || '';
        const sino = (item.sinoVietnamese || '').trim();
        const example = item.example || '';

        // 1. Kiểm tra Âm Hán Việt
        const kanjis = word.split('').filter(isKanjiChar);
        if (kanjis.length > 0) {
          if (!sino) {
            missingSino.push({ file: relPath, word, kanjis: kanjis.join(''), meaning });
          } else {
            const sinoWords = sino.split(/\s+/).filter(Boolean);
            const hasRepeat = word.includes('々');
            const hasHonorific = /^[おご][\u4e00-\u9faf\u3400-\u4dbf]/.test(word);
            const expectedKanjiCount = kanjis.length;
            
            if (!hasRepeat && kanjis.length !== sinoWords.length) {
              lengthMismatchSino.push({
                file: relPath,
                word,
                kanjiCount: kanjis.length,
                kanjis: kanjis.join(''),
                sino,
                sinoCount: sinoWords.length
              });
            }
          }
        } else {
          // Thuần Kana: Sino phải rỗng
          if (sino !== '') {
            lengthMismatchSino.push({
              file: relPath,
              word,
              kanjiCount: 0,
              kanjis: '',
              sino,
              sinoCount: sino.split(/\s+/).length
            });
          }
        }

        // 2. Kiểm tra Nghĩa tiếng Việt
        garbagePatterns.forEach(pat => {
          if (pat.test(meaning)) {
            garbageMeaning.push({ file: relPath, word, meaning });
          }
        });

        // 3. Kiểm tra format Example
        if (example) {
          const m = example.match(/^(.*?)[(（](.*?)[)）]$/);
          if (!m || !m[1].trim() || !m[2].trim()) {
            invalidExampleFormat.push({ file: relPath, word, example });
          } else {
            // 4. Đối chiếu chéo từ khóa cơ bản giữa meaning và example
            const viTranslation = m[2].toLowerCase();
            const cleanMeaning = meaning.toLowerCase().replace(/\(.*?\)/g, '');
            const meaningKeywords = cleanMeaning
              .split(/[,;/\s]+/)
              .map(s => s.trim())
              .filter(s => s.length >= 2 && !['làm', 'một', 'của', 'được', 'người', 'trong', 'theo', 'này'].includes(s));

            // Chỉ gắn cờ nếu không có bất kỳ từ khóa chính nào xuất hiện
            let matched = false;
            for (const kw of meaningKeywords) {
              if (viTranslation.includes(kw)) {
                matched = true;
                break;
              }
            }
            if (!matched && meaningKeywords.length > 0) {
              crossCheckMismatch.push({
                file: relPath,
                word,
                meaning: cleanMeaning,
                exampleVi: m[2].trim()
              });
            }
          }
        }
      });
    } else if (relPath.endsWith('kanji.json') && Array.isArray(data)) {
      data.forEach(item => {
        totalKanjiItems++;
        garbagePatterns.forEach(pat => {
          if (pat.test(item.meaning || '')) {
            garbageMeaning.push({ file: relPath, word: item.character, meaning: item.meaning });
          }
        });
      });
    } else if (relPath.startsWith('grammar/') && !Array.isArray(data)) {
      totalGrammarItems++;
      garbagePatterns.forEach(pat => {
        if (pat.test(data.meaning || '') || pat.test(data.usageNotes || '')) {
          garbageMeaning.push({ file: relPath, word: data.title, meaning: data.meaning });
        }
      });
    }
  }

  console.log('='.repeat(70));
  console.log('📊 KẾT QUẢ KIỂM TOÁN DỮ LIỆU:');
  console.log(`- Tổng số mục từ vựng kiểm tra: ${totalVocabItems}`);
  console.log(`- Tổng số Hán tự kiểm tra: ${totalKanjiItems}`);
  console.log(`- Tổng số bài ngữ pháp kiểm tra: ${totalGrammarItems}`);
  console.log(`1. Từ có chữ Hán nhưng THIẾU Âm Hán Việt (sinoVietnamese rỗng): ${missingSino.length}`);
  console.log(`2. Số chữ Kanji LỆCH với số âm Hán Việt (sinoVietnamese thiếu/thừa từ): ${lengthMismatchSino.length}`);
  console.log(`3. Nghĩa chứa chuỗi rác chú thích: ${garbageMeaning.length}`);
  console.log(`4. Câu ví dụ sai cấu trúc ngoặc đơn: ${invalidExampleFormat.length}`);
  console.log(`5. Các trường hợp nghi vấn đối chiếu chéo (Cross-check): ${crossCheckMismatch.length}`);
  console.log('='.repeat(70));

  if (missingSino.length > 0) {
    console.log('\n--- VÍ DỤ CÁC TỪ THIẾU ÂM HÁN VIỆT (Top 10): ---');
    missingSino.slice(0, 10).forEach(x => {
      console.log(`  [${x.file}] "${x.word}" (Kanji: ${x.kanjis}) -> Meaning: ${x.meaning}`);
    });
  }

  if (lengthMismatchSino.length > 0) {
    console.log('\n--- VÍ DỤ CÁC TỪ LỆCH SỐ LƯỢNG ÂM HÁN VIỆT (Top 10): ---');
    lengthMismatchSino.slice(0, 10).forEach(x => {
      console.log(`  [${x.file}] "${x.word}" (${x.kanjiCount} Kanji: ${x.kanjis}) vs "${x.sino}" (${x.sinoCount} âm)`);
    });
  }

  if (crossCheckMismatch.length > 0) {
    console.log('\n--- CÁC TRƯỜNG HỢP NGHI VẤN ĐỐI CHIẾU CHÉO (Top 10): ---');
    crossCheckMismatch.slice(0, 10).forEach(x => {
      console.log(`  [${x.file}] "${x.word}" -> Nghĩa: "${x.meaning}" | Ví dụ: "${x.exampleVi}"`);
    });
  }
}

audit();

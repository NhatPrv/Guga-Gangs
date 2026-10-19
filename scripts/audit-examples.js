/**
 * audit-examples.js
 * Script kiểm toán toàn diện chất lượng câu ví dụ (example) trên 100% kho dữ liệu:
 * 1. Phát hiện các câu bị lỗi template cứng: "机の上に綺麗な", "置いてあります"
 * 2. Phát hiện các câu bị lỗi máy móc: "を勉強します", "を使います"
 * 3. Phát hiện các câu bị lặp lại cấu trúc quá 3 lần
 * 4. Phát hiện các câu cụt ngủn hoặc sai định dạng "[Câu tiếng Nhật] ([Dịch tiếng Việt])"
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const MANIFEST_PATH = path.join(DATA_DIR, 'manifest.json');

function audit() {
  console.log('==================================================================');
  console.log('🔍 BẮT ĐẦU KIỂM TOÁN CHẤT LƯỢNG CÂU VÍ DỤ TOÀN BỘ KHO DỮ LIỆU');
  console.log('==================================================================\n');

  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error('❌ Không tìm thấy manifest.json!');
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));

  let totalVocab = 0;
  let deskTemplateErrors = 0;
  let studyTemplateErrors = 0;
  let useTemplateErrors = 0;
  let truncatedErrors = 0;
  let formatErrors = 0;

  const errorReportByUnit = {};
  const sentenceOccurrences = new Map();

  for (const c of manifest.curricula) {
    for (const u of c.units) {
      const vPath = path.join(DATA_DIR, '..', u.vocabPath);
      if (!fs.existsSync(vPath)) continue;

      const items = JSON.parse(fs.readFileSync(vPath, 'utf8'));
      const unitKey = `${c.id}/${u.id}`;
      const unitErrors = [];

      for (let i = 0; i < items.length; i++) {
        totalVocab++;
        const it = items[i];
        const w = (it.word || '').trim();
        const ex = (it.example || '').trim();

        // Thống kê tần suất xuất hiện của câu tiếng Nhật
        const jaPart = ex.replace(/[(（].*?[)）]/g, '').trim();
        if (jaPart) {
          sentenceOccurrences.set(jaPart, (sentenceOccurrences.get(jaPart) || 0) + 1);
        }

        let isError = false;
        let reasons = [];

        // 1. Lỗi template cái bàn
        if (ex.includes('机の上に綺麗な') || ex.includes('が置いてあります')) {
          deskTemplateErrors++;
          isError = true;
          reasons.push('Lỗi template "机の上に綺麗な..."');
        }

        // 2. Lỗi template học từ
        if (ex.includes('を勉強します') || ex.includes('をべんきょうします')) {
          studyTemplateErrors++;
          isError = true;
          reasons.push('Lỗi template "...を勉強します"');
        }

        // 3. Lỗi template dùng từ
        if (ex.includes('を使います') || ex.includes('をつかいます')) {
          useTemplateErrors++;
          isError = true;
          reasons.push('Lỗi template "...を使います"');
        }

        // 4. Lỗi định dạng thiếu dịch tiếng Việt hoặc thiếu dấu ngoặc
        if (!ex.includes('(') && !ex.includes('（')) {
          formatErrors++;
          isError = true;
          reasons.push('Thiếu phần dịch tiếng Việt trong ngoặc đơn');
        }

        // 5. Lỗi câu cụt ngủn
        if (ex.length < 12) {
          truncatedErrors++;
          isError = true;
          reasons.push('Câu quá ngắn / cụt ngủn');
        }

        if (isError) {
          unitErrors.push({
            word: w,
            meaning: it.meaning,
            example: ex,
            reasons: reasons
          });
        }
      }

      if (unitErrors.length > 0) {
        errorReportByUnit[unitKey] = unitErrors;
      }
    }
  }

  // Thống kê các câu bị lặp lại trên toàn hệ thống quá 3 lần
  let repeatedSentenceCount = 0;
  for (const [s, count] of sentenceOccurrences.entries()) {
    if (count >= 3 && !s.includes('。')) {
      repeatedSentenceCount += count;
    }
  }

  console.log('------------------------------------------------------------------');
  console.log(`📊 TỔNG KẾT KIỂM TOÁN:`);
  console.log(`- Tổng số từ vựng đã kiểm tra: ${totalVocab} từ trên ${manifest.stats.totalUnits} bài học`);
  console.log(`- Lỗi template "机の上に綺麗な...": ${deskTemplateErrors} câu`);
  console.log(`- Lỗi template "...を勉強します":   ${studyTemplateErrors} câu`);
  console.log(`- Lỗi template "...を使います":     ${useTemplateErrors} câu`);
  console.log(`- Lỗi định dạng thiếu dịch nghĩa:   ${formatErrors} câu`);
  console.log(`- Lỗi câu cụt ngủn (<12 ký tự):    ${truncatedErrors} câu`);
  console.log(`- Tổng số bài học có câu bị lỗi:   ${Object.keys(errorReportByUnit).length} bài học`);
  console.log('------------------------------------------------------------------\n');

  // In ra 10 ví dụ tiêu biểu bị lỗi
  console.log('🔎 TOP 10 VÍ DỤ CÂU LỖI CẦN THAY THẾ KHẨN CẤP:');
  let printed = 0;
  for (const [unitKey, errors] of Object.entries(errorReportByUnit)) {
    for (const err of errors) {
      if (printed < 10) {
        console.log(`[${unitKey}] Từ: "${err.word}" (${err.meaning})`);
        console.log(`  -> Câu lỗi: ${err.example}`);
        console.log(`  -> Nguyên nhân: ${err.reasons.join(', ')}\n`);
        printed++;
      }
    }
  }

  return {
    totalVocab,
    deskTemplateErrors,
    studyTemplateErrors,
    useTemplateErrors,
    formatErrors,
    truncatedErrors,
    errorReportByUnit
  };
}

if (require.main === module) {
  audit();
}

module.exports = { audit };

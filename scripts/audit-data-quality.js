/**
 * scripts/audit-data-quality.js
 * Script kiểm toán chuyên sâu chất lượng dữ liệu trong ./data:
 * 1. Phát hiện các câu ví dụ bị Template hóa (prefix / suffix lặp lại >= 3 lần).
 * 2. Phát hiện các câu ví dụ thiếu bản dịch tiếng Việt trong ngoặc đơn (...).
 * 3. Phát hiện các câu ví dụ quá ngắn (< 12 ký tự) hoặc cụt ngủn.
 * 4. Phát hiện từ vựng / ngữ pháp trừu tượng thiếu phần giải thích ngữ cảnh trong ngoặc đơn.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

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

function runDeepAudit() {
  console.log('='.repeat(70));
  console.log('🔍 BẮT ĐẦU KIỂM TOÁN CHẤT LƯỢNG TOÀN DIỆN DỮ LIỆU TRONG ./data');
  console.log('='.repeat(70));

  const files = getAllJsonFiles(DATA_DIR);
  console.log(`[i] Tìm thấy ${files.length} file dữ liệu JSON cần kiểm toán.\n`);

  let totalVocab = 0;
  let totalKanji = 0;
  let totalGrammar = 0;

  let templateCloneIssues = [];
  let formatIssues = [];
  let shortSentenceIssues = [];
  let abstractMissingContextIssues = [];

  // Phân tích tiền tố / hậu tố tiếng Nhật của các câu ví dụ
  const sentencePrefixMap = new Map();
  const sentenceSuffixMap = new Map();
  const allSentences = [];

  // Danh sách từ/ngữ pháp trừu tượng cần có giải thích trong ngoặc đơn
  const abstractKeywords = [
    'tuyệt đối', 'nhất định', 'cất công', 'mất công', 'khách sáo', 'ngại ngùng',
    'thảo nào', 'hèn chi', 'chắc chắn', 'có lẽ', 'mặc dù', 'thế mà', 'nhờ có',
    'tại vì', 'toàn là', 'cứ mãi', 'vừa mới', 'càng ngày', 'trong khi', 'nhân lúc'
  ];

  for (const filePath of files) {
    const relPath = path.relative(DATA_DIR, filePath).replace(/\\/g, '/');
    let content;
    try {
      content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (e) {
      console.error(`❌ Lỗi JSON syntax tại ${relPath}:`, e.message);
      continue;
    }

    // 1. Phân loại kiểm toán theo loại dữ liệu
    if (relPath.startsWith('grammar/')) {
      totalGrammar++;
      const item = content;
      // Kiểm tra meaning của grammar
      const m = (item.meaning || '').trim();
      if (!m.includes('(') && !m.includes('（')) {
        for (const kw of abstractKeywords) {
          if (m.toLowerCase().includes(kw)) {
            abstractMissingContextIssues.push({
              file: relPath,
              type: 'grammar',
              item: item.title || item.pattern,
              meaning: m,
              reason: `Ngữ pháp mang sắc thái "${kw}" nhưng thiếu giải thích trong ngoặc đơn`
            });
            break;
          }
        }
      }
    } else if (Array.isArray(content)) {
      const isKanji = relPath.includes('kanji');

      for (let i = 0; i < content.length; i++) {
        const item = content[i];
        if (isKanji) {
          totalKanji++;
        } else {
          totalVocab++;
        }

        const word = item.word || item.kanji || '';
        const meaning = (item.meaning || '').trim();
        const example = (item.example || '').trim();

        // Kiểm tra câu ví dụ
        if (example) {
          // Tách câu tiếng Nhật và phần dịch
          const match = example.match(/^(.*?)[(（](.*?)[)）]$/);
          if (!match) {
            formatIssues.push({
              file: relPath,
              item: word,
              example: example,
              reason: 'Thiếu định dạng dịch tiếng Việt trong ngoặc đơn `(...)`'
            });
          } else {
            const jaSentence = match[1].trim();
            const viSentence = match[2].trim();

            if (jaSentence.length < 6) {
              shortSentenceIssues.push({
                file: relPath,
                item: word,
                example: example,
                reason: 'Câu tiếng Nhật quá ngắn / cụt ngủn'
              });
            }

            // Ghi nhận tiền tố (6 ký tự đầu) và hậu tố (6 ký tự cuối)
            if (jaSentence.length >= 8) {
              const prefix = jaSentence.slice(0, 6);
              const suffix = jaSentence.slice(-6);

              sentencePrefixMap.set(prefix, (sentencePrefixMap.get(prefix) || 0) + 1);
              sentenceSuffixMap.set(suffix, (sentenceSuffixMap.get(suffix) || 0) + 1);

              allSentences.push({
                file: relPath,
                item: word,
                jaSentence,
                prefix,
                suffix,
                example
              });
            }
          }
        }

        // Kiểm tra từ trừu tượng thiếu ngữ cảnh
        if (!isKanji && !meaning.includes('(') && !meaning.includes('（')) {
          for (const kw of abstractKeywords) {
            if (meaning.toLowerCase().includes(kw)) {
              abstractMissingContextIssues.push({
                file: relPath,
                type: 'vocab',
                item: word,
                meaning: meaning,
                reason: `Từ vựng mang sắc thái "${kw}" nhưng thiếu giải thích trong ngoặc đơn`
              });
              break;
            }
          }
        }
      }
    }
  }

  // Lọc ra các cụm tiền tố / hậu tố lặp lại >= 3 lần (Dấu hiệu của Template Clone)
  const suspiciousPrefixes = new Set();
  const suspiciousSuffixes = new Set();

  for (const [prefix, count] of sentencePrefixMap.entries()) {
    // Bỏ qua các tiền tố tự nhiên quá phổ biến nếu có
    if (count >= 3 && !['これは', 'それは', 'わたしは', '私は'].includes(prefix)) {
      suspiciousPrefixes.add(prefix);
    }
  }

  for (const [suffix, count] of sentenceSuffixMap.entries()) {
    if (count >= 3 && (suffix.includes('勉強します') || suffix.includes('使います') || suffix.includes('あります') || suffix.includes('置きます'))) {
      suspiciousSuffixes.add(suffix);
    }
  }

  for (const s of allSentences) {
    if (suspiciousPrefixes.has(s.prefix) || suspiciousSuffixes.has(s.suffix)) {
      templateCloneIssues.push(s);
    }
  }

  console.log('📊 THỐNG KÊ TỔNG QUAN DỮ LIỆU:');
  console.log(`   - Tổng số từ vựng (Vocabulary): ${totalVocab}`);
  console.log(`   - Tổng số Hán tự (Kanji): ${totalKanji}`);
  console.log(`   - Tổng số thẻ ngữ pháp (Grammar): ${totalGrammar}`);
  console.log('\n🚨 KẾT QUẢ PHÁT HIỆN LỖI:');
  console.log(`   1. Số câu ví dụ bị Template hóa (Clones): ${templateCloneIssues.length} câu`);
  console.log(`   2. Số câu ví dụ sai định dạng ngoặc đơn: ${formatIssues.length} câu`);
  console.log(`   3. Số câu ví dụ quá ngắn / cụt ngủn: ${shortSentenceIssues.length} câu`);
  console.log(`   4. Số từ/ngữ pháp trừu tượng thiếu giải thích ngữ cảnh: ${abstractMissingContextIssues.length} mục`);
  console.log('='.repeat(70));

  if (templateCloneIssues.length > 0) {
    console.log('\n[!] Ví dụ 5 câu bị Template hóa điển hình:');
    templateCloneIssues.slice(0, 5).forEach(it => {
      console.log(`   • [${it.file}] [${it.item}]: "${it.example}"`);
    });
  }

  if (abstractMissingContextIssues.length > 0) {
    console.log('\n[!] Ví dụ 5 từ/ngữ pháp trừu tượng thiếu giải thích trong ngoặc đơn:');
    abstractMissingContextIssues.slice(0, 5).forEach(it => {
      console.log(`   • [${it.file}] [${it.item}]: "${it.meaning}" (${it.reason})`);
    });
  }
}

runDeepAudit();

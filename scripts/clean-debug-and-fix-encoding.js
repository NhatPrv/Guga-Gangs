/**
 * scripts/clean-debug-and-fix-encoding.js
 * 1. Dọn sạch ghi chú debug của AI trong meaning/example mà bảo toàn 100% ngoặc học thuật.
 * 2. Khôi phục hoàn toàn các ký tự UTF-8 lỗi (\uFFFD / ).
 * 3. Chuẩn hóa khớp số lượng chữ Kanji và Âm Hán Việt.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

// 1. Dọn sạch chuỗi debug trong meaning
const debugReplacements = [
  {
    pattern: /\s*\(đã chuẩn hóa từ lỗi\)/gi,
    replacement: ''
  },
  {
    pattern: /\s*\(đã sửa lỗi chính tả từ ゆうに\)/gi,
    replacement: ''
  },
  {
    pattern: /\s*,\s*đã sửa nghĩa sai từ cuối cùng\)/gi,
    replacement: ')'
  },
  {
    pattern: /\s*\(đã sửa chữ Hán Trung Quốc 烏龜 thành chữ Nhật 亀\)/gi,
    replacement: ''
  },
  {
    pattern: /\s*\(đã sửa nghĩa từ thu dọn thành thứ tự\)/gi,
    replacement: ''
  },
  {
    pattern: /\s*\(đã sửa nghĩa từ đáng lo ngại\)/gi,
    replacement: ''
  },
  {
    pattern: /\s*\(đã sửa lỗi chính tả từ ロース\)/gi,
    replacement: ''
  },
  {
    pattern: /\(start,\s*đã sửa nghĩa sai từ ngôi sao\)/gi,
    replacement: '(vạch xuất phát)'
  },
  {
    pattern: /\s*\(đã sửa nghĩa từ đầu tiên\)/gi,
    replacement: ''
  },
  {
    pattern: /\s*,\s*đã sửa nghĩa từ bác sĩ\)/gi,
    replacement: ')'
  },
  {
    pattern: /\s*\(đã sửa nghĩa sai từ bài giảng\)/gi,
    replacement: ''
  },
  {
    pattern: /\s*\(đã sửa nghĩa sai từ làm việc\)/gi,
    replacement: ''
  },
  {
    pattern: /\s*\(đã sửa nghĩa sai từ âm nhạc\)/gi,
    replacement: ''
  },
  {
    pattern: /\s*\(đã sửa lỗi màu đỏ\)/gi,
    replacement: ''
  },
  {
    pattern: /\s*,\s*đã sửa lỗi màu đỏ\)/gi,
    replacement: ')'
  },
  {
    pattern: /\s*\(đã sửa từ lỗi 政界 thành chữ 世界\)/gi,
    replacement: ''
  },
  {
    pattern: /\s*\(đã chuẩn hóa chính tả\)/gi,
    replacement: ''
  },
  {
    pattern: /\s*\(đã sửa lỗi chính tả từ 操作店 thành 交差点\)/gi,
    replacement: ''
  },
  {
    pattern: /\s*\(đã sửa nghĩa từ mẹ thành bà\)/gi,
    replacement: ''
  }
];

function cleanDebugInDir(dir) {
  let count = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += cleanDebugInDir(full);
    } else if (entry.name === 'vocabulary.json') {
      const data = JSON.parse(fs.readFileSync(full, 'utf8'));
      let modified = false;

      for (let item of data) {
        if (typeof item.meaning === 'string') {
          let orig = item.meaning;
          for (const rep of debugReplacements) {
            item.meaning = item.meaning.replace(rep.pattern, rep.replacement).trim();
          }
          if (orig !== item.meaning) {
            console.log(`[Clean Debug] ${path.relative(DATA_DIR, full)} (${item.word}):\n  - Trước: "${orig}"\n  + Sau:   "${item.meaning}"`);
            modified = true;
            count++;
          }
        }
      }

      if (modified) {
        fs.writeFileSync(full, JSON.stringify(data, null, 2), 'utf8');
      }
    }
  }
  return count;
}

// 2. Sửa lỗi ký tự \uFFFD () trong các file cụ thể
function fixEncodingIssues() {
  console.log('\n--- BẮT ĐẦU SỬA LỖI MÃ HÓA UTF-8 (\\uFFFD) ---');

  // File 1: grammar/bunpou-n3-kiru-kirenai.json
  const f1 = path.join(DATA_DIR, 'grammar/bunpou-n3-kiru-kirenai.json');
  if (fs.existsSync(f1)) {
    let t = fs.readFileSync(f1, 'utf8');
    t = t.replace(/数え\uFFFDb/g, '数えきれない').replace(/数え\uFFFDれない/g, '数えきれない');
    fs.writeFileSync(f1, t, 'utf8');
    console.log('✅ Đã sửa bunpou-n3-kiru-kirenai.json');
  }

  // File 2: grammar/bunpou-n3-to-shite.json
  const f2 = path.join(DATA_DIR, 'grammar/bunpou-n3-to-shite.json');
  if (fs.existsSync(f2)) {
    let t = fs.readFileSync(f2, 'utf8');
    t = t.replace(/\uFFFDにとって/g, '〜にとって');
    fs.writeFileSync(f2, t, 'utf8');
    console.log('✅ Đã sửa bunpou-n3-to-shite.json');
  }

  // File 3: grammar/bunpou-n5-kara-reason.json
  const f3 = path.join(DATA_DIR, 'grammar/bunpou-n5-kara-reason.json');
  if (fs.existsSync(f3)) {
    let t = fs.readFileSync(f3, 'utf8');
    t = t.replace(/\{痛\|いた\}\uFFFDった/g, '{痛|いた}かった');
    fs.writeFileSync(f3, t, 'utf8');
    console.log('✅ Đã sửa bunpou-n5-kara-reason.json');
  }

  // File 4: jlpt-n3-core-bank/theme-04-nature-science/kanji.json
  const f4 = path.join(DATA_DIR, 'jlpt-n3-core-bank/theme-04-nature-science/kanji.json');
  if (fs.existsSync(f4)) {
    const list = JSON.parse(fs.readFileSync(f4, 'utf8'));
    for (let k of list) {
      if (k.character === '危') {
        for (let ex of k.examples) {
          if (ex.compound === '危篤') {
            ex.reading = 'きとく';
            ex.meaning = 'bệnh tình nguy kịch, nguy cấp';
          }
        }
      }
    }
    fs.writeFileSync(f4, JSON.stringify(list, null, 2), 'utf8');
    console.log('✅ Đã sửa theme-04-nature-science/kanji.json (危篤)');
  }

  // File 5: jlpt-n5-core-bank/theme-04-nouns-places/vocabulary.json
  const f5 = path.join(DATA_DIR, 'jlpt-n5-core-bank/theme-04-nouns-places/vocabulary.json');
  if (fs.existsSync(f5)) {
    const list = JSON.parse(fs.readFileSync(f5, 'utf8'));
    for (let v of list) {
      if (v.word === 'なぜ') {
        v.example = 'あなたはなぜ日本語を勉強しているのですか。(Tại sao bạn lại học tiếng Nhật vậy?)';
      }
    }
    fs.writeFileSync(f5, JSON.stringify(list, null, 2), 'utf8');
    console.log('✅ Đã sửa theme-04-nouns-places/vocabulary.json (なぜ)');
  }
}

// 3. Chuẩn hóa đồng bộ Kanji vs Sino-Vietnamese cho các từ có collocation
function fixCollocationSino() {
  console.log('\n--- CHUẨN HÓA ĐỒNG BỘ SỐ LƯỢNG KANJI & ÂM HÁN VIỆT ---');
  const collocationFixes = [
    {
      file: 'data/minna-no-nihongo-n4/unit-26/vocabulary.json',
      wordMatch: '大阪弁',
      word: '大阪弁',
      reading: 'おおさかべん',
      sino: 'ĐẠI PHẢN BIỆN',
      meaning: 'tiếng Osaka, giọng Osaka (phương ngôn: 方言)'
    },
    {
      file: 'data/minna-no-nihongo-n4/unit-32/vocabulary.json',
      wordMatch: '失敗します',
      word: '失敗します [試験に～]',
      reading: 'しっぱいします',
      sino: 'THẤT BẠI',
      meaning: 'thất bại, thi trượt (kỳ thi: 試験に～)'
    },
    {
      file: 'data/minna-no-nihongo-n4/unit-32/vocabulary.json',
      wordMatch: '合格します',
      word: '合格します [試験に～]',
      reading: 'ごうかくします',
      sino: 'HỢP CÁCH',
      meaning: 'thi đỗ, thi đạt (kỳ thi: 試験に～)'
    },
    {
      file: 'data/minna-no-nihongo-n4/unit-32/vocabulary.json',
      wordMatch: '吹きます',
      word: '吹きます [風が～]',
      reading: 'ふきます',
      sino: 'XUY',
      meaning: 'thổi (gió: 風が～)'
    },
    {
      file: 'data/minna-no-nihongo-n4/unit-33/vocabulary.json',
      wordMatch: '打ちます',
      word: '打ちます [電報を～]',
      reading: 'うちます',
      sino: 'ĐẢ',
      meaning: 'đánh, gửi (điện báo: 電報を～)'
    },
    {
      file: 'data/minna-no-nihongo-n4/unit-36/vocabulary.json',
      wordMatch: '大勢',
      word: '大勢の [人]',
      reading: 'おおぜいの',
      sino: 'ĐẠI THẾ',
      meaning: 'đông người, nhiều người'
    },
    {
      file: 'data/minna-no-nihongo-n4/unit-49/vocabulary.json',
      wordMatch: '出します [熱を～]',
      word: '出します [熱を～]',
      reading: 'だします',
      sino: 'XUẤT',
      meaning: 'phát sốt, bị sốt (sốt: 熱を～)'
    },
    {
      file: 'data/minna-no-nihongo-n5/unit-12/vocabulary.json',
      wordMatch: '多い',
      word: '多い [人が～]',
      reading: 'おおい',
      sino: 'ĐA',
      meaning: 'nhiều (người: 人が～)'
    },
    {
      file: 'data/minna-no-nihongo-n5/unit-12/vocabulary.json',
      wordMatch: '少ない',
      word: '少ない [人が～]',
      reading: 'すくない',
      sino: 'THIỂU',
      meaning: 'ít (người: 人が～)'
    },
    {
      file: 'data/minna-no-nihongo-n5/unit-13/vocabulary.json',
      wordMatch: '出します [手紙を～]',
      word: '出します [手紙を～]',
      reading: 'だします',
      sino: 'XUẤT',
      meaning: 'gửi (thư: 手紙を～)'
    },
    {
      file: 'data/minna-no-nihongo-n5/unit-13/vocabulary.json',
      wordMatch: '入ります [喫茶店に～]',
      word: '入ります [喫茶店に～]',
      reading: 'はいります',
      sino: 'NHẬP',
      meaning: 'vào (quán giải khát: 喫茶店に～)'
    },
    {
      file: 'data/minna-no-nihongo-n5/unit-13/vocabulary.json',
      wordMatch: '出ます [喫茶店を～]',
      word: '出ます [喫茶店を～]',
      reading: 'でます',
      sino: 'XUẤT',
      meaning: 'ra khỏi (quán giải khát: 喫茶店を～)'
    },
    {
      file: 'data/minna-no-nihongo-n5/unit-13/vocabulary.json',
      wordMatch: '散歩します',
      word: '散歩します [公園を～]',
      reading: 'さんぽします',
      sino: 'TÁN BỘ',
      meaning: 'đi dạo, tản bộ (công viên: 公園を～)'
    },
    {
      file: 'data/minna-no-nihongo-n5/unit-14/vocabulary.json',
      wordMatch: '曲がります',
      word: '曲がります [右へ～]',
      reading: 'まがります',
      sino: 'KHÚC',
      meaning: 'rẽ, quẹo (sang phải: 右へ～)'
    },
    {
      file: 'data/minna-no-nihongo-n5/unit-15/vocabulary.json',
      wordMatch: '住んで います',
      word: '住んでいます [大阪に～]',
      reading: 'すんでいます',
      sino: 'TRÚ',
      meaning: 'sống, cư trú (ở Osaka: 大阪に～)'
    },
    {
      file: 'data/minna-no-nihongo-n5/unit-16/vocabulary.json',
      wordMatch: '乗ります',
      word: '乗ります [電車に～]',
      reading: 'のります',
      sino: 'THỪA',
      meaning: 'lên xe, đi tàu (tàu điện: 電車に～)'
    },
    {
      file: 'data/minna-no-nihongo-n5/unit-16/vocabulary.json',
      wordMatch: '降ります',
      word: '降ります [電車に～]',
      reading: 'おります',
      sino: 'GIÁNG',
      meaning: 'xuống xe, xuống tàu (tàu điện: 電車に～)'
    },
    {
      file: 'data/minna-no-nihongo-n5/unit-16/vocabulary.json',
      wordMatch: '入ります [大学に～]',
      word: '入ります [大学に～]',
      reading: 'はいります',
      sino: 'NHẬP',
      meaning: 'nhập học, vào học (đại học: 大学に～)'
    },
    {
      file: 'data/minna-no-nihongo-n5/unit-16/vocabulary.json',
      wordMatch: '出ます [大学を～]',
      word: '出ます [大学を～]',
      reading: 'でます',
      sino: 'XUẤT',
      meaning: 'tốt nghiệp, ra trường (đại học: 大学を～)'
    }
  ];

  let c = 0;
  for (const item of collocationFixes) {
    const full = path.join(__dirname, '..', item.file);
    if (!fs.existsSync(full)) continue;
    const list = JSON.parse(fs.readFileSync(full, 'utf8'));
    for (let it of list) {
      if (it.word.includes(item.wordMatch) || it.word === item.wordMatch) {
        it.word = item.word;
        it.reading = item.reading;
        it.sinoVietnamese = item.sino;
        it.meaning = item.meaning;
        c++;
        break;
      }
    }
    fs.writeFileSync(full, JSON.stringify(list, null, 2), 'utf8');
  }
  console.log(`✅ Đã chuẩn hóa ${c} từ có collocation phụ.`);
}

function run() {
  console.log('--- BẮT ĐẦU DỌN SẠCH CHUỖI DEBUG TRONG NGOẶC ĐƠN ---');
  const cleaned = cleanDebugInDir(DATA_DIR);
  console.log(`✅ Đã làm sạch ghi chú debug trong ${cleaned} từ vựng.`);

  fixEncodingIssues();
  fixCollocationSino();
}

run();

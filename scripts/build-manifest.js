/**
 * build-manifest.js
 * Quét toàn bộ cây thư mục /data và tự động xuất ra file data/manifest.json
 * dành cho ứng dụng Web SPA.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const OUTPUT_FILE = path.join(DATA_DIR, 'manifest.json');

function buildManifest() {
  console.log('🔍 Bắt đầu quét thư mục dữ liệu:', DATA_DIR);

  if (!fs.existsSync(DATA_DIR)) {
    console.error('❌ Thư mục data không tồn tại!');
    process.exit(1);
  }

  const entries = fs.readdirSync(DATA_DIR, { withFileTypes: true });
  const curricula = [];

  let totalVocab = 0;
  let totalKanji = 0;
  let totalUnits = 0;

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const curriculumId = entry.name;
    const curriculumPath = path.join(DATA_DIR, curriculumId);
    const metaPath = path.join(curriculumPath, '_meta.json');

    let curriculumMeta = {
      title: curriculumId,
      order: 999,
      description: ''
    };

    if (fs.existsSync(metaPath)) {
      try {
        const raw = fs.readFileSync(metaPath, 'utf-8');
        curriculumMeta = { ...curriculumMeta, ...JSON.parse(raw) };
      } catch (err) {
        console.warn(`⚠️ Không thể đọc ${metaPath}:`, err.message);
      }
    }

    const unitEntries = fs.readdirSync(curriculumPath, { withFileTypes: true });
    const units = [];

    for (const unitEntry of unitEntries) {
      if (!unitEntry.isDirectory()) continue;

      const unitId = unitEntry.name;
      const unitPath = path.join(curriculumPath, unitId);
      const unitMetaPath = path.join(unitPath, '_meta.json');
      const vocabPath = path.join(unitPath, 'vocabulary.json');
      const kanjiPath = path.join(unitPath, 'kanji.json');

      let unitMeta = {
        title: unitId,
        order: 999,
        description: ''
      };

      if (fs.existsSync(unitMetaPath)) {
        try {
          const raw = fs.readFileSync(unitMetaPath, 'utf-8');
          unitMeta = { ...unitMeta, ...JSON.parse(raw) };
        } catch (err) {
          console.warn(`⚠️ Không thể đọc ${unitMetaPath}:`, err.message);
        }
      }

      let vocabCount = 0;
      let hasVocab = fs.existsSync(vocabPath);
      if (hasVocab) {
        try {
          const vocabData = JSON.parse(fs.readFileSync(vocabPath, 'utf-8'));
          vocabCount = Array.isArray(vocabData) ? vocabData.length : 0;
        } catch (err) {
          console.warn(`⚠️ Lỗi đọc từ vựng ${vocabPath}:`, err.message);
        }
      }

      let kanjiCount = 0;
      let hasKanji = fs.existsSync(kanjiPath);
      if (hasKanji) {
        try {
          const kanjiData = JSON.parse(fs.readFileSync(kanjiPath, 'utf-8'));
          kanjiCount = Array.isArray(kanjiData) ? kanjiData.length : 0;
        } catch (err) {
          console.warn(`⚠️ Lỗi đọc Hán tự ${kanjiPath}:`, err.message);
        }
      }

      totalVocab += vocabCount;
      totalKanji += kanjiCount;
      totalUnits++;

      units.push({
        id: unitId,
        title: unitMeta.title,
        order: unitMeta.order,
        description: unitMeta.description || '',
        vocabPath: hasVocab ? `data/${curriculumId}/${unitId}/vocabulary.json` : null,
        kanjiPath: hasKanji ? `data/${curriculumId}/${unitId}/kanji.json` : null,
        vocabCount,
        kanjiCount
      });
    }

    // Sắp xếp các bài học theo thứ tự tăng dần của order
    units.sort((a, b) => a.order - b.order);

    curricula.push({
      id: curriculumId,
      title: curriculumMeta.title,
      order: curriculumMeta.order,
      description: curriculumMeta.description || '',
      unitsCount: units.length,
      units
    });
  }

  // Sắp xếp các giáo trình theo thứ tự order
  curricula.sort((a, b) => a.order - b.order);

  const manifest = {
    generatedAt: new Date().toISOString(),
    stats: {
      totalCurricula: curricula.length,
      totalUnits,
      totalVocab,
      totalKanji
    },
    curricula
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log('✅ Đã tạo thành công:', OUTPUT_FILE);
  console.log(`📊 Tổng kết: ${curricula.length} giáo trình | ${totalUnits} bài học | ${totalVocab} từ vựng | ${totalKanji} Hán tự`);
}

if (require.main === module) {
  buildManifest();
}

module.exports = { buildManifest };

// scripts/split-manifests.js
// Tách cây cấu trúc file thành 2 manifest độc lập: vocab-manifest.json và kanji-manifest.json

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const mainManifestPath = path.join(dataDir, 'manifest.json');

if (!fs.existsSync(mainManifestPath)) {
  console.error('Không tìm thấy file manifest.json');
  process.exit(1);
}

const mainManifest = JSON.parse(fs.readFileSync(mainManifestPath, 'utf8'));

// 1. TẠO VOCAB MANIFEST (Chỉ chứa các bài học và dữ liệu Từ vựng)
const vocabCurricula = [];
let totalVocabUnits = 0;
let totalVocabWords = 0;

mainManifest.curricula.forEach(curr => {
  const vocabUnits = [];
  curr.units.forEach(u => {
    if (u.vocabCount > 0 && u.vocabPath) {
      vocabUnits.push({
        id: u.id,
        title: u.title.replace('Từ vựng & Mẫu câu', 'Từ vựng').replace('Từ vựng & Hán tự', 'Từ vựng'),
        order: u.order,
        description: u.description || '',
        vocabPath: u.vocabPath,
        vocabCount: u.vocabCount
      });
      totalVocabWords += u.vocabCount;
    }
  });

  if (vocabUnits.length > 0) {
    vocabCurricula.push({
      id: curr.id,
      title: curr.title.replace('Từ vựng & Hán tự', 'Từ vựng').replace('Minna no Nihongo', 'Minna Từ vựng'),
      order: curr.order,
      level: curr.level,
      category: curr.category,
      description: curr.description,
      unitsCount: vocabUnits.length,
      units: vocabUnits
    });
    totalVocabUnits += vocabUnits.length;
  }
});

const vocabManifest = {
  hub: 'vocab',
  title: 'Cây danh mục Từ vựng JLPT (N5 - N3)',
  generatedAt: new Date().toISOString(),
  stats: {
    totalCurricula: vocabCurricula.length,
    totalUnits: totalVocabUnits,
    totalVocab: totalVocabWords
  },
  curricula: vocabCurricula
};

fs.writeFileSync(
  path.join(dataDir, 'vocab-manifest.json'),
  JSON.stringify(vocabManifest, null, 2),
  'utf8'
);
console.log(`✅ Đã tạo vocab-manifest.json (${totalVocabUnits} bài, ${totalVocabWords} từ vựng)`);

// 2. TẠO KANJI MANIFEST (Chỉ chứa các bài học và dữ liệu Hán tự)
const kanjiCurricula = [];
let totalKanjiUnits = 0;
let totalKanjiChars = 0;

mainManifest.curricula.forEach(curr => {
  const kanjiUnits = [];
  curr.units.forEach(u => {
    if (u.kanjiCount > 0 && u.kanjiPath) {
      kanjiUnits.push({
        id: u.id,
        title: u.title.replace('Từ vựng & Mẫu câu', 'Hán tự').replace('Từ vựng & Hán tự', 'Hán tự'),
        order: u.order,
        description: u.description || '',
        kanjiPath: u.kanjiPath,
        kanjiCount: u.kanjiCount
      });
      totalKanjiChars += u.kanjiCount;
    }
  });

  if (kanjiUnits.length > 0) {
    kanjiCurricula.push({
      id: curr.id,
      title: curr.title.replace('Từ vựng & Hán tự', 'Hán tự').replace('Minna no Nihongo', 'Minna Hán tự'),
      order: curr.order,
      level: curr.level,
      category: curr.category,
      description: curr.description,
      unitsCount: kanjiUnits.length,
      units: kanjiUnits
    });
    totalKanjiUnits += kanjiUnits.length;
  }
});

const kanjiManifest = {
  hub: 'kanji',
  title: 'Cây danh mục Hán tự JLPT (N5 - N3)',
  generatedAt: new Date().toISOString(),
  stats: {
    totalCurricula: kanjiCurricula.length,
    totalUnits: totalKanjiUnits,
    totalKanji: totalKanjiChars
  },
  curricula: kanjiCurricula
};

fs.writeFileSync(
  path.join(dataDir, 'kanji-manifest.json'),
  JSON.stringify(kanjiManifest, null, 2),
  'utf8'
);
console.log(`✅ Đã tạo kanji-manifest.json (${totalKanjiUnits} bài, ${totalKanjiChars} chữ Hán)`);

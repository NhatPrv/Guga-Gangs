const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');

function tokenizeMeaning(meaning) {
  const cleaned = meaning.replace(/\([^)]*\)/g, ' ');
  const parts = cleaned.split(/[,;\/]/).map(s => s.trim().toLowerCase()).filter(Boolean);
  const words = [];
  for (const part of parts) {
    if (part.length >= 2) words.push(part);
    const subWords = part.split(/\s+/).filter(w => w.length >= 2);
    words.push(...subWords);
  }
  return [...new Set(words)];
}

const mismatches = [];

function checkVocab(filePath, relativePath) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  data.forEach((item, idx) => {
    const meaning = item.meaning || '';
    const example = item.example || '';
    const match = example.match(/[（\(](.*?)[）\)]/);
    const exampleVi = match ? match[1] : '';

    if (!exampleVi) return;

    const keywords = tokenizeMeaning(meaning);
    const lowerEx = exampleVi.toLowerCase();
    const matched = keywords.some(kw => lowerEx.includes(kw));

    if (!matched && keywords.length > 0) {
      mismatches.push({
        path: relativePath,
        word: item.word,
        reading: item.reading,
        sino: item.sinoVietnamese,
        meaning: item.meaning,
        exampleVi: exampleVi,
        exampleFull: item.example
      });
    }
  });
}

function walk(dir, rel) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const res = path.join(dir, entry.name);
    const r = rel ? `${rel}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      walk(res, r);
    } else if (entry.name === 'vocabulary.json') {
      checkVocab(res, r);
    }
  }
}

walk(dataDir, '');

fs.writeFileSync(path.join(__dirname, 'remaining_mismatches.json'), JSON.stringify(mismatches, null, 2), 'utf8');
console.log(`Đã xuất ${mismatches.length} trường hợp nghi vấn còn lại vào scripts/remaining_mismatches.json`);

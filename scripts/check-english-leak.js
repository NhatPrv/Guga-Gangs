const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'data', 'grammar');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json') && f !== 'grammar-manifest.json');

const englishWords = new Set([
  'the','and','of','to','in','that','with','for','as','on','by','from','about',
  'like','should','must','cannot','without','when','while','after','before',
  'because','if','although','whether','each','every','never','always','only',
  'even','just','also','very','much','more','most','some','any','can','could',
  'would','will','shall','might','have','has','had','been','being','are','is',
  'was','were','not','or','at','be','do','does','did','say','says','said'
]);

let issues = [];

files.forEach(f => {
  const p = path.join(dir, f);
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  
  const checkEn = (text) => {
    if (!text) return null;
    const words = text.toLowerCase().replace(/[^a-z\s]/g, ' ').split(/\s+/).filter(Boolean);
    const found = words.filter(w => englishWords.has(w));
    return found.length >= 2 ? found : null;
  };

  const mEn = checkEn(data.meaning);
  if (mEn) issues.push({ file: f, field: 'meaning', words: mEn, text: data.meaning });

  (data.examples || []).forEach((ex, idx) => {
    const eEn = checkEn(ex.vi);
    if (eEn) issues.push({ file: f, field: 'ex-' + idx, words: eEn, text: ex.vi });
  });
});

console.log('Tổng số mẫu phát hiện có từ tiếng Anh sót lại:', issues.length);
if (issues.length > 0) {
  issues.forEach(it => {
    console.log(`- [${it.file}] [${it.field}]: "${it.text}" (chứa từ: ${it.words.join(', ')})`);
  });
}

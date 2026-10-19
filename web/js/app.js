/**
 * app.js
 * Core Single Page Application Logic for JLPT N4 Master
 * Bao gồm: Tree View, Dynamic Unit Loading, Audio Speech Synthesis,
 * Quiz Masking, 3D Flashcards, Search/Filter, Bookmarks & Dark Mode.
 */

// Trạng thái ứng dụng (Application State)
const state = {
  activeHub: 'vocab', // 'vocab' | 'kanji' | 'grammar'
  manifest: null,
  vocabManifest: null,
  kanjiManifest: null,
  grammarManifest: null,
  activeCurriculum: null,
  activeUnit: null,
  currentVocabList: [],
  currentKanjiList: [],
  currentTab: 'vocab', // 'vocab' | 'kanji' | 'flashcard' | 'practice' | 'grammar'
  quizMaskMode: 'none', // 'none' | 'reading' | 'meaning' | 'word'
  audioSpeed: 1.0,
  searchQuery: '',
  showOnlyBookmarks: false,
  bookmarks: new Set(JSON.parse(localStorage.getItem('jlpt_n4_bookmarks') || '[]')),
  flashcards: [],
  flashcardIndex: 0,
  isFlashcardFlipped: false,
  isPlayingAll: false,
  practice: {
    mode: 'prompt-word', // 'prompt-word' | 'prompt-meaning'
    delaySeconds: 1.5,
    rangeA: 1,
    rangeB: 10,
    isShuffled: false,
    questions: [],
    currentIndex: 0,
    scoreCorrect: 0,
    scoreWrong: 0,
    wrongList: [],
    isAnswered: false,
    autoNextTimer: null,
    countdownInterval: null
  },
  grammar: {
    manifest: null,
    currentLevelFilter: 'all',
    activeGrammar: null,
    questions: [],
    currentIndex: 0,
    scoreCorrect: 0,
    scoreWrong: 0,
    wrongList: [],
    isAnswered: false,
    isHintVisible: false
  }
};

// Khởi tạo Speech Synthesis API
const synth = window.speechSynthesis;
let jaVoice = null;

function initSpeechVoice() {
  if (!synth) return;
  const voices = synth.getVoices();
  jaVoice = voices.find(v => v.lang.startsWith('ja') || v.lang === 'ja-JP') || null;
}

if (synth) {
  if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = initSpeechVoice;
  }
  initSpeechVoice();
}

/**
 * Phát âm một từ hoặc câu tiếng Nhật
 */
function speakJapanese(text, onEndCallback = null) {
  if (!synth) {
    showToast('Trình duyệt không hỗ trợ Web Speech API', 'warning');
    return;
  }

  // Dừng âm thanh cũ nếu đang đọc
  synth.cancel();

  const cleanText = text.trim();
  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'ja-JP';
  utterance.rate = state.audioSpeed;
  utterance.pitch = 1.0;

  if (jaVoice) {
    utterance.voice = jaVoice;
  }

  if (onEndCallback) {
    utterance.onend = onEndCallback;
    utterance.onerror = onEndCallback;
  }

  synth.speak(utterance);
}

/**
 * Hiển thị thông báo Toast
 */
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.remove('opacity-0', 'translate-y-3', 'pointer-events-none');
  toast.classList.add('opacity-100', 'translate-y-0');

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'translate-y-3', 'pointer-events-none');
  }, 2500);
}

function resolveDataPath(relPath) {
  if (!relPath) return '';
  if (relPath.startsWith('http://') || relPath.startsWith('https://')) return relPath;
  const clean = relPath.replace(/^(\.\.\/|\/)+/, '');
  if (window.location.protocol === 'file:') {
    return '../' + clean;
  }
  return '/' + clean;
}

/**
 * Nạp song song 3 file Manifest độc lập:
 * 1. data/vocab-manifest.json (Phân hệ Từ vựng)
 * 2. data/kanji-manifest.json (Phân hệ Hán tự)
 * 3. data/grammar/grammar-manifest.json (Phân hệ Ngữ pháp)
 */
async function loadManifest() {
  try {
    const pVocab = fetch(resolveDataPath('data/vocab-manifest.json') + '?t=' + Date.now()).then(r => r.ok ? r.json() : null);
    const pKanji = fetch(resolveDataPath('data/kanji-manifest.json') + '?t=' + Date.now()).then(r => r.ok ? r.json() : null);
    const pGrammar = fetch(resolveDataPath('data/grammar/grammar-manifest.json') + '?t=' + Date.now()).then(r => r.ok ? r.json() : null);

    const [vManifest, kManifest, gManifest] = await Promise.all([pVocab, pKanji, pGrammar]);

    state.vocabManifest = vManifest;
    state.kanjiManifest = kManifest;
    state.grammarManifest = gManifest;
    if (gManifest) state.grammar.manifest = gManifest;

    // Thiết lập manifest mặc định cho hub hiện tại
    state.manifest = (state.activeHub === 'kanji') ? kManifest : vManifest;

    updateStatsDisplay();
    renderTreeView();

    // Mặc định nạp bài học đầu tiên
    const currentManifest = (state.activeHub === 'kanji') ? kManifest : vManifest;
    if (currentManifest && currentManifest.curricula && currentManifest.curricula.length > 0) {
      const firstCurr = currentManifest.curricula[0];
      if (firstCurr.units && firstCurr.units.length > 0) {
        selectUnit(firstCurr.id, firstCurr.units[0].id);
      }
    }
  } catch (err) {
    console.error('Lỗi nạp manifests:', err);
    document.getElementById('tree-container').innerHTML = `
      <div class="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400">
        <p class="font-bold mb-1">Không thể tải dữ liệu cây bài học:</p>
        <p>${err.message}</p>
      </div>
    `;
  }
}

/**
 * Cập nhật thống kê trên giao diện Sidebar Footer theo Phân hệ đang hoạt động
 */
function updateStatsDisplay() {
  const hub = state.activeHub;
  const iconEl = document.getElementById('stat-hub-icon');
  const titleEl = document.getElementById('stat-hub-title');
  const unitsCountEl = document.getElementById('stat-units-count');
  const box1Count = document.getElementById('stat-box-1-count');
  const box1Label = document.getElementById('stat-box-1-label');
  const box2Count = document.getElementById('stat-box-2-count');
  const box2Label = document.getElementById('stat-box-2-label');

  if (hub === 'vocab' && state.vocabManifest) {
    if (iconEl) iconEl.className = 'w-3.5 h-3.5 text-brand-500';
    if (titleEl) titleEl.textContent = 'Dữ liệu Từ vựng';
    if (unitsCountEl) unitsCountEl.textContent = `${state.vocabManifest.stats.totalUnits} bài`;
    if (box1Count) {
      box1Count.textContent = state.vocabManifest.stats.totalVocab;
      box1Count.className = 'font-bold text-brand-600 dark:text-brand-400 text-sm';
    }
    if (box1Label) box1Label.textContent = 'Từ vựng';
    if (box2Count) box2Count.textContent = state.vocabManifest.stats.totalCurricula;
    if (box2Label) box2Label.textContent = 'Khóa học';

  } else if (hub === 'kanji' && state.kanjiManifest) {
    if (iconEl) iconEl.className = 'w-3.5 h-3.5 text-emerald-500';
    if (titleEl) titleEl.textContent = 'Dữ liệu Hán tự';
    if (unitsCountEl) unitsCountEl.textContent = `${state.kanjiManifest.stats.totalUnits} bài`;
    if (box1Count) {
      box1Count.textContent = state.kanjiManifest.stats.totalKanji;
      box1Count.className = 'font-bold text-emerald-600 dark:text-emerald-400 text-sm';
    }
    if (box1Label) box1Label.textContent = 'Chữ Hán';
    if (box2Count) box2Count.textContent = state.kanjiManifest.stats.totalCurricula;
    if (box2Label) box2Label.textContent = 'Khóa học';

  } else if (hub === 'grammar' && state.grammarManifest) {
    const totalG = state.grammarManifest.totalGrammar || (state.grammarManifest.items ? state.grammarManifest.items.length : 6);
    if (iconEl) iconEl.className = 'w-3.5 h-3.5 text-purple-500';
    if (titleEl) titleEl.textContent = 'Dữ liệu Ngữ pháp';
    if (unitsCountEl) unitsCountEl.textContent = `${totalG} mẫu`;
    if (box1Count) {
      box1Count.textContent = '36 câu';
      box1Count.className = 'font-bold text-purple-600 dark:text-purple-400 text-sm';
    }
    if (box1Label) box1Label.textContent = 'Trắc nghiệm';
    if (box2Count) box2Count.textContent = 'Đa cấp độ';
    if (box2Label) box2Label.textContent = 'JLPT Master';
  }

  lucide.createIcons();
}

/**
 * Điều phối render cây thư mục Sidebar tương ứng với Phân hệ hiện tại
 */
function renderTreeView(filterKeyword = '') {
  const container = document.getElementById('tree-container');
  if (!container) return;

  if (state.activeHub === 'vocab') {
    renderVocabTree(filterKeyword);
  } else if (state.activeHub === 'kanji') {
    renderKanjiTree(filterKeyword);
  } else if (state.activeHub === 'grammar') {
    renderGrammarTree(filterKeyword);
  }
}

/**
 * 1. RENDER CÂY TỪ VỰNG (Chuyên biệt cho Phân hệ Từ vựng)
 */
function renderVocabTree(filterKeyword = '') {
  const container = document.getElementById('tree-container');
  const manifest = state.vocabManifest;
  if (!container || !manifest) return;

  const curricula = manifest.curricula || [];
  const keyword = filterKeyword.trim().toLowerCase();

  const levelOrder = ['🌟 Chuyên đề JLPT', 'JLPT N5', 'JLPT N4', 'JLPT N3', 'Khác'];
  const levelGroups = { '🌟 Chuyên đề JLPT': [], 'JLPT N5': [], 'JLPT N4': [], 'JLPT N3': [], 'Khác': [] };

  curricula.forEach(curr => {
    let lvl = 'Khác';
    const idLower = (curr.id || '').toLowerCase();
    if (idLower.includes('special') || idLower.includes('topic') || curr.category === 'special') lvl = '🌟 Chuyên đề JLPT';
    else if (curr.level === 'N5' || idLower.includes('n5')) lvl = 'JLPT N5';
    else if (curr.level === 'N4' || idLower.includes('n4')) lvl = 'JLPT N4';
    else if (curr.level === 'N3' || idLower.includes('n3')) lvl = 'JLPT N3';
    levelGroups[lvl].push(curr);
  });

  let html = '';

  levelOrder.forEach(lvlName => {
    const currList = levelGroups[lvlName] || [];
    if (currList.length === 0) return;

    const filteredCourses = [];
    let totalUnitsInLevel = 0;

    currList.forEach(curr => {
      const filteredUnits = curr.units.filter(u => 
        !keyword || u.title.toLowerCase().includes(keyword) || u.id.toLowerCase().includes(keyword) || curr.title.toLowerCase().includes(keyword)
      );

      if (!keyword || filteredUnits.length > 0) {
        filteredCourses.push({ curr, units: filteredUnits });
        totalUnitsInLevel += filteredUnits.length;
      }
    });

    if (keyword && totalUnitsInLevel === 0) return;

    let badgeColor = 'bg-brand-100 text-brand-700 dark:bg-brand-950/80 dark:text-brand-300 border-brand-200';
    if (lvlName === '🌟 Chuyên đề JLPT') badgeColor = 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-300 font-extrabold';
    else if (lvlName === 'JLPT N5') badgeColor = 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200';
    else if (lvlName === 'JLPT N4') badgeColor = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200';
    else if (lvlName === 'JLPT N3') badgeColor = 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-200';

    html += `
      <div class="level-group mb-3 border border-slate-200/80 dark:border-slate-800/80 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/30">
        <button class="level-toggle-btn w-full px-3 py-2.5 flex items-center justify-between text-left text-xs font-extrabold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition group">
          <div class="flex items-center space-x-2 truncate">
            <span class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${badgeColor}">${lvlName}</span>
            <span class="text-[11px] text-slate-500 font-medium truncate">(${filteredCourses.length} khóa)</span>
          </div>
          <div class="flex items-center space-x-1.5 shrink-0">
            <span class="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">${totalUnitsInLevel} bài</span>
            <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 tree-chevron expanded transition-transform duration-200"></i>
          </div>
        </button>

        <div class="level-children-list px-1.5 pb-1.5 space-y-1.5">
          ${filteredCourses.map(({ curr, units }) => `
            <div class="curriculum-item rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
              <button class="curr-toggle-btn w-full px-2.5 py-2 flex items-center justify-between text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition group" data-curr-id="${curr.id}">
                <div class="flex items-center space-x-2 truncate">
                  <i data-lucide="book-open" class="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0"></i>
                  <span class="truncate">${curr.title}</span>
                </div>
                <div class="flex items-center space-x-1.5 shrink-0">
                  <span class="text-[10px] text-slate-400 font-medium">${units.length}</span>
                  <i data-lucide="chevron-down" class="w-3 h-3 text-slate-400 group-hover:text-slate-600 tree-chevron expanded transition-transform duration-200"></i>
                </div>
              </button>

              <div class="units-list pl-2 pr-1 pb-1 pt-0.5 space-y-0.5 border-t border-slate-100 dark:border-slate-700/40">
                ${units.map(unit => {
                  const isActive = state.activeUnit && state.activeUnit.id === unit.id && state.activeCurriculum && state.activeCurriculum.id === curr.id;
                  return `
                    <button class="unit-item-btn w-full px-2 py-1.5 rounded-md flex items-center justify-between text-left text-xs transition ${
                      isActive 
                        ? 'bg-brand-50 dark:bg-brand-950/70 text-brand-700 dark:text-brand-300 font-bold border-l-2 border-brand-600' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                    }" data-curr-id="${curr.id}" data-unit-id="${unit.id}">
                      <div class="flex items-center space-x-2 truncate">
                        <span class="w-1.5 h-1.5 rounded-full ${isActive ? 'bg-brand-600' : 'bg-slate-300'} shrink-0"></span>
                        <span class="truncate">${unit.title}</span>
                      </div>
                      <span class="px-1.5 py-0.2 rounded bg-brand-100/70 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 font-mono text-[10px] shrink-0 font-bold">${unit.vocabCount} từ</span>
                    </button>
                  `;
                }).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  });

  container.innerHTML = html || `<div class="p-4 text-center text-xs text-slate-400">Không tìm thấy bài học từ vựng nào.</div>`;
  lucide.createIcons();
  attachTreeEvents();
}

/**
 * 2. RENDER CÂY HÁN TỰ (Chuyên biệt cho Phân hệ Hán tự)
 */
function renderKanjiTree(filterKeyword = '') {
  const container = document.getElementById('tree-container');
  const manifest = state.kanjiManifest;
  if (!container || !manifest) return;

  const curricula = manifest.curricula || [];
  const keyword = filterKeyword.trim().toLowerCase();

  const levelOrder = ['🌟 Chuyên đề JLPT', 'JLPT N5', 'JLPT N4', 'JLPT N3', 'Khác'];
  const levelGroups = { '🌟 Chuyên đề JLPT': [], 'JLPT N5': [], 'JLPT N4': [], 'JLPT N3': [], 'Khác': [] };

  curricula.forEach(curr => {
    // Bỏ qua hoàn toàn chuyên đề liên từ / phó từ hoặc khóa học không có Hán tự
    if (curr.id.includes('conjunction') || curr.id.includes('adverb')) return;

    let lvl = 'Khác';
    const idLower = (curr.id || '').toLowerCase();
    if (idLower.includes('special') || idLower.includes('topic') || curr.category === 'special') lvl = '🌟 Chuyên đề JLPT';
    else if (curr.level === 'N5' || idLower.includes('n5')) lvl = 'JLPT N5';
    else if (curr.level === 'N4' || idLower.includes('n4')) lvl = 'JLPT N4';
    else if (curr.level === 'N3' || idLower.includes('n3')) lvl = 'JLPT N3';
    levelGroups[lvl].push(curr);
  });

  let html = '';

  levelOrder.forEach(lvlName => {
    const currList = levelGroups[lvlName] || [];
    if (currList.length === 0) return;

    const filteredCourses = [];
    let totalUnitsInLevel = 0;

    currList.forEach(curr => {
      const filteredUnits = curr.units.filter(u => 
        !keyword || u.title.toLowerCase().includes(keyword) || u.id.toLowerCase().includes(keyword) || curr.title.toLowerCase().includes(keyword)
      );

      if (!keyword || filteredUnits.length > 0) {
        filteredCourses.push({ curr, units: filteredUnits });
        totalUnitsInLevel += filteredUnits.length;
      }
    });

    if (keyword && totalUnitsInLevel === 0) return;

    const badgeColor = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 font-bold';

    html += `
      <div class="level-group mb-3 border border-emerald-200/80 dark:border-emerald-900/60 rounded-xl overflow-hidden bg-emerald-50/20 dark:bg-slate-900/40">
        <button class="level-toggle-btn w-full px-3 py-2.5 flex items-center justify-between text-left text-xs font-extrabold text-slate-800 dark:text-slate-100 hover:bg-emerald-50 dark:hover:bg-slate-800/60 transition group">
          <div class="flex items-center space-x-2 truncate">
            <span class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${badgeColor}">${lvlName}</span>
            <span class="text-[11px] text-slate-500 font-medium truncate">(${filteredCourses.length} khóa Hán tự)</span>
          </div>
          <div class="flex items-center space-x-1.5 shrink-0">
            <span class="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold">${totalUnitsInLevel} bài</span>
            <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 tree-chevron expanded transition-transform duration-200"></i>
          </div>
        </button>

        <div class="level-children-list px-1.5 pb-1.5 space-y-1.5">
          ${filteredCourses.map(({ curr, units }) => `
            <div class="curriculum-item rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
              <button class="curr-toggle-btn w-full px-2.5 py-2 flex items-center justify-between text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition group" data-curr-id="${curr.id}">
                <div class="flex items-center space-x-2 truncate">
                  <i data-lucide="languages" class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0"></i>
                  <span class="truncate">${curr.title}</span>
                </div>
                <div class="flex items-center space-x-1.5 shrink-0">
                  <span class="text-[10px] text-slate-400 font-medium">${units.length}</span>
                  <i data-lucide="chevron-down" class="w-3 h-3 text-slate-400 group-hover:text-slate-600 tree-chevron expanded transition-transform duration-200"></i>
                </div>
              </button>

              <div class="units-list pl-2 pr-1 pb-1 pt-0.5 space-y-0.5 border-t border-slate-100 dark:border-slate-700/40">
                ${units.map(unit => {
                  const isActive = state.activeUnit && state.activeUnit.id === unit.id && state.activeCurriculum && state.activeCurriculum.id === curr.id;
                  return `
                    <button class="unit-item-btn w-full px-2 py-1.5 rounded-md flex items-center justify-between text-left text-xs transition ${
                      isActive 
                        ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-bold border-l-2 border-emerald-600' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-emerald-50/50 dark:hover:bg-slate-700/60'
                    }" data-curr-id="${curr.id}" data-unit-id="${unit.id}">
                      <div class="flex items-center space-x-2 truncate">
                        <span class="w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-600' : 'bg-slate-300'} shrink-0"></span>
                        <span class="truncate">${unit.title}</span>
                      </div>
                      <span class="px-1.5 py-0.2 rounded bg-emerald-100/70 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] shrink-0 font-bold">${unit.kanjiCount} chữ</span>
                    </button>
                  `;
                }).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  });

  container.innerHTML = html || `<div class="p-4 text-center text-xs text-slate-400">Không tìm thấy bài học Hán tự nào.</div>`;
  lucide.createIcons();
  attachTreeEvents();
}

/**
 * 3. RENDER CÂY NGỮ PHÁP (Chuyên biệt cho Phân hệ Ngữ pháp)
 */
function renderGrammarTree(filterKeyword = '') {
  const container = document.getElementById('tree-container');
  const manifest = state.grammarManifest;
  if (!container || !manifest) return;

  const keyword = filterKeyword.trim().toLowerCase();
  const levels = manifest.levels || [
    { level: 'N5', title: 'JLPT N5', units: (manifest.units || []).filter(u => u.level === 'N5') },
    { level: 'N4', title: 'JLPT N4', units: (manifest.units || []).filter(u => u.level === 'N4') },
    { level: 'N3', title: 'JLPT N3', units: (manifest.units || []).filter(u => u.level === 'N3') }
  ];

  let html = '';

  levels.forEach(lvl => {
    const lvlUnits = lvl.units || [];
    if (lvlUnits.length === 0) return;

    // Lọc theo từ khóa tìm kiếm
    const filteredUnits = [];
    lvlUnits.forEach(unit => {
      const unitGrammars = (manifest.items || []).filter(it => 
        it.unitId === unit.id || (unit.grammarIds && unit.grammarIds.includes(it.id))
      );

      const matchedGrammars = unitGrammars.filter(g => 
        !keyword || g.title.toLowerCase().includes(keyword) || g.meaning.toLowerCase().includes(keyword) || unit.title.toLowerCase().includes(keyword)
      );

      if (!keyword || matchedGrammars.length > 0) {
        filteredUnits.push({ unit, grammars: matchedGrammars });
      }
    });

    if (keyword && filteredUnits.length === 0) return;

    html += `
      <div class="level-group mb-3 border border-purple-200/80 dark:border-purple-900/60 rounded-xl overflow-hidden bg-purple-50/20 dark:bg-slate-900/40">
        <button class="level-toggle-btn w-full px-3 py-2.5 flex items-center justify-between text-left text-xs font-extrabold text-slate-800 dark:text-slate-100 hover:bg-purple-50 dark:hover:bg-slate-800/60 transition group">
          <div class="flex items-center space-x-2 truncate">
            <span class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-300 font-bold">${lvl.title}</span>
            <span class="text-[11px] text-slate-500 font-medium truncate">(${filteredUnits.length} bài)</span>
          </div>
          <div class="flex items-center space-x-1.5 shrink-0">
            <span class="px-1.5 py-0.5 rounded-full text-[10px] bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-bold">${filteredUnits.reduce((acc, u) => acc + u.grammars.length, 0)} mẫu</span>
            <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 tree-chevron expanded transition-transform duration-200"></i>
          </div>
        </button>

        <div class="level-children-list px-1.5 pb-1.5 space-y-1.5">
          ${filteredUnits.map(({ unit, grammars }) => {
            const isActiveUnit = state.grammar && state.grammar.activeUnit && state.grammar.activeUnit.id === unit.id;
            return `
              <div class="grammar-unit-card rounded-lg bg-white dark:bg-slate-800/80 border ${isActiveUnit ? 'border-purple-500 dark:border-purple-500 ring-1 ring-purple-500/50' : 'border-slate-200/60 dark:border-slate-700/60'} overflow-hidden">
                <button class="grammar-unit-btn w-full px-2.5 py-2 flex items-center justify-between text-left text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-purple-50/50 transition group" data-unit-id="${unit.id}">
                  <div class="flex items-center space-x-2 truncate">
                    <i data-lucide="book-mark" class="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0"></i>
                    <span class="truncate font-bold">${unit.title}</span>
                  </div>
                  <div class="flex items-center space-x-1.5 shrink-0">
                    <span class="px-1.5 py-0.2 rounded bg-purple-100/70 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-mono text-[10px] font-bold">${grammars.length} mẫu</span>
                    <i data-lucide="chevron-down" class="w-3 h-3 text-slate-400 group-hover:text-slate-600 tree-chevron expanded transition-transform duration-200"></i>
                  </div>
                </button>

                <div class="units-list pl-2 pr-1 pb-1 pt-0.5 space-y-0.5 border-t border-slate-100 dark:border-slate-700/40">
                  ${grammars.map(g => {
                    const isActive = state.grammar && state.grammar.activeGrammar && state.grammar.activeGrammar.id === g.id;
                    return `
                      <button class="grammar-tree-item-btn w-full px-2 py-1.5 rounded-md flex items-center justify-between text-left text-xs transition ${
                        isActive 
                          ? 'bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 font-bold border-l-2 border-purple-600' 
                          : 'text-slate-600 dark:text-slate-400 hover:bg-purple-50/50 dark:hover:bg-slate-700/60'
                      }" data-grammar-id="${g.id}">
                        <div class="flex items-center space-x-2 truncate">
                          <span class="w-1.5 h-1.5 rounded-full ${isActive ? 'bg-purple-600' : 'bg-slate-300'} shrink-0"></span>
                          <span class="truncate font-jp text-[11px]">${g.title}</span>
                        </div>
                        <span class="text-[10px] text-purple-600 font-mono shrink-0">5q</span>
                      </button>
                    `;
                  }).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  });

  container.innerHTML = html || `<div class="p-4 text-center text-xs text-slate-400">Không tìm thấy bài học ngữ pháp nào.</div>`;
  lucide.createIcons();
  attachTreeEvents();
}

/**
 * Chọn bài học Ngữ pháp trên cây thư mục (Bài 1, Bài 2,...)
 */
function selectGrammarUnit(unitId) {
  const manifest = state.grammarManifest;
  if (!manifest) return;

  const unit = (manifest.units || []).find(u => u.id === unitId);
  if (!unit) return;

  state.grammar.activeUnit = unit;

  // Cập nhật Breadcrumb
  document.getElementById('breadcrumb-curriculum').textContent = `JLPT ${unit.level}`;
  document.getElementById('breadcrumb-unit').textContent = unit.title;

  switchTab('grammar-catalog');
  renderGrammarCatalog();
  renderGrammarTree();
}

/**
 * Gán sự kiện click vào các nút trên sidebar (Accordion và Bài học)
 */
function attachTreeEvents() {
  // Cấp 1: Bật/tắt mở rộng Cấp độ JLPT
  document.querySelectorAll('.level-toggle-btn').forEach(btn => {
    btn.onclick = () => {
      const childrenList = btn.nextElementSibling;
      const chevron = btn.querySelector('.tree-chevron');
      if (childrenList) {
        childrenList.classList.toggle('hidden');
        chevron.classList.toggle('expanded');
      }
    };
  });

  // Cấp 2: Bật/tắt mở rộng Khóa học / Giáo trình
  document.querySelectorAll('.curr-toggle-btn').forEach(btn => {
    btn.onclick = () => {
      const unitsList = btn.nextElementSibling;
      const chevron = btn.querySelector('.tree-chevron');
      if (unitsList) {
        unitsList.classList.toggle('hidden');
        chevron.classList.toggle('expanded');
      }
    };
  });

  // Cấp 2 Ngữ pháp: Chọn bài học Ngữ pháp (Bài 1, Bài 2)
  document.querySelectorAll('.grammar-unit-btn').forEach(btn => {
    btn.onclick = (e) => {
      const unitId = btn.getAttribute('data-unit-id');
      const unitsList = btn.nextElementSibling;
      const chevron = btn.querySelector('.tree-chevron');

      // Nếu click vào chevron thì chỉ toggle
      if (e.target.closest('.tree-chevron')) {
        if (unitsList) {
          unitsList.classList.toggle('hidden');
          chevron.classList.toggle('expanded');
        }
        return;
      }

      selectGrammarUnit(unitId);

      if (window.innerWidth < 1024) {
        closeMobileSidebar();
      }
    };
  });

  // Cấp 3: Chọn bài học Từ vựng / Hán tự
  document.querySelectorAll('.unit-item-btn').forEach(btn => {
    btn.onclick = () => {
      const currId = btn.getAttribute('data-curr-id');
      const unitId = btn.getAttribute('data-unit-id');
      selectUnit(currId, unitId);

      if (window.innerWidth < 1024) {
        closeMobileSidebar();
      }
    };
  });

  // Cấp 3: Chọn trực tiếp mẫu Ngữ pháp
  document.querySelectorAll('.grammar-tree-item-btn').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const grammarId = btn.getAttribute('data-grammar-id');
      startGrammarQuiz(grammarId);

      if (window.innerWidth < 1024) {
        closeMobileSidebar();
      }
    };
  });
}

/**
 * Chọn bài học và tải dữ liệu JSON tương ứng
 */
async function selectUnit(curriculumId, unitId) {
  const currentManifest = (state.activeHub === 'kanji' && state.kanjiManifest) 
    ? state.kanjiManifest 
    : (state.vocabManifest || state.manifest);

  if (!currentManifest) return;

  const curriculum = currentManifest.curricula.find(c => c.id === curriculumId);
  if (!curriculum) return;
  const unit = curriculum.units.find(u => u.id === unitId);
  if (!unit) return;

  state.activeCurriculum = curriculum;
  state.activeUnit = unit;

  // Cập nhật Breadcrumb & Hero Card
  document.getElementById('breadcrumb-curriculum').textContent = curriculum.title;
  document.getElementById('breadcrumb-unit').textContent = unit.title;
  document.getElementById('unit-hero-curriculum').textContent = curriculum.title;
  document.getElementById('unit-hero-title').textContent = unit.title;
  document.getElementById('unit-hero-desc').textContent = unit.description || 'Học từ vựng và Hán tự chuẩn JLPT N4.';

  // Highlight trên sidebar
  renderTreeView(document.getElementById('sidebar-unit-filter').value);

  // Tải vocabulary.json và kanji.json song song
  state.currentVocabList = [];
  state.currentKanjiList = [];

  const promises = [];

  // Tìm đường dẫn vocab và kanji từ manifest tương ứng
  let vocabPath = unit.vocabPath;
  let kanjiPath = unit.kanjiPath;

  if (!vocabPath && state.vocabManifest) {
    const vCurr = state.vocabManifest.curricula.find(c => c.id === curriculumId);
    const vUnit = vCurr && vCurr.units.find(u => u.id === unitId);
    if (vUnit) vocabPath = vUnit.vocabPath;
  }

  if (!kanjiPath && state.kanjiManifest) {
    const kCurr = state.kanjiManifest.curricula.find(c => c.id === curriculumId);
    const kUnit = kCurr && kCurr.units.find(u => u.id === unitId);
    if (kUnit) kanjiPath = kUnit.kanjiPath;
  }

  if (vocabPath) {
    promises.push(
      fetch(resolveDataPath(vocabPath) + '?t=' + Date.now())
        .then(r => r.ok ? r.json() : [])
        .then(data => state.currentVocabList = data)
        .catch(err => console.warn('Lỗi tải từ vựng:', err))
    );
  }

  if (kanjiPath) {
    promises.push(
      fetch(resolveDataPath(kanjiPath) + '?t=' + Date.now())
        .then(r => r.ok ? r.json() : [])
        .then(data => state.currentKanjiList = data)
        .catch(err => console.warn('Lỗi tải Hán tự:', err))
    );
  }

  await Promise.all(promises);

  // Cập nhật badge số lượng trên tabs
  document.getElementById('tab-vocab-badge').textContent = state.currentVocabList.length;
  document.getElementById('tab-kanji-badge').textContent = state.currentKanjiList.length;

  // Thiết lập danh sách Flashcards & Practice theo phân hệ đang chọn
  setupFlashcards(state.activeHub === 'kanji' ? 'kanji' : (state.activeHub === 'grammar' ? 'grammar' : 'vocab'));
  initPracticeSetup(state.activeHub === 'kanji' ? 'kanji' : 'vocab');

  // Render nội dung theo view hiện tại
  renderCurrentView();
}

/**
 * Render nội dung theo Tab đang chọn bao quát cả 3 Phân hệ
 */
function renderCurrentView() {
  const query = state.searchQuery.trim().toLowerCase();

  if (state.currentTab === 'vocab') {
    renderVocabularyView(query);
  } else if (state.currentTab === 'kanji') {
    renderKanjiView(query);
  } else if (['flashcard', 'vocab-flashcard', 'kanji-flashcard', 'grammar-flashcard'].includes(state.currentTab)) {
    renderFlashcardView();
  } else if (['practice', 'vocab-practice', 'kanji-practice'].includes(state.currentTab)) {
    renderPracticeView();
  } else if (['grammar', 'grammar-catalog', 'grammar-test'].includes(state.currentTab)) {
    initGrammarModule();
  }
}

/**
 * Render danh sách Từ vựng
 */
function renderVocabularyView(query = '') {
  const container = document.getElementById('vocab-list-container');
  const emptyState = document.getElementById('empty-state');
  if (!container) return;

  let list = state.currentVocabList;

  // Lọc theo Bookmarks
  if (state.showOnlyBookmarks) {
    list = list.filter(item => {
      const k = item.word + '::' + (item.reading || '');
      return state.bookmarks.has(k) || state.bookmarks.has(item.word);
    });
  }

  // Lọc theo Search Query (Kanji, Hiragana, Nghĩa tiếng Việt, Âm Hán Việt)
  if (query) {
    list = list.filter(item => 
      item.word.toLowerCase().includes(query) ||
      (item.reading && item.reading.toLowerCase().includes(query)) ||
      (item.meaning && item.meaning.toLowerCase().includes(query)) ||
      (item.sinoVietnamese && item.sinoVietnamese.toLowerCase().includes(query))
    );
  }

  if (list.length === 0) {
    container.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  container.innerHTML = list.map(item => {
    const itemKey = item.word + '::' + (item.reading || '');
    const isBookmarked = state.bookmarks.has(itemKey) || state.bookmarks.has(item.word);

    // Xác định class mask cho Quiz mode
    const wordMaskClass = state.quizMaskMode === 'word' ? 'mask-hidden' : '';
    const readingMaskClass = state.quizMaskMode === 'reading' ? 'mask-hidden' : '';
    const meaningMaskClass = state.quizMaskMode === 'meaning' ? 'mask-hidden' : '';

    // Tách câu ví dụ thành phần tiếng Nhật và tiếng Việt
    let exJa = item.example || '';
    let exVi = '';
    if (typeof item.example === 'string') {
      const match = item.example.match(/^(.*?)[(（](.*?)[)）]$/);
      if (match) {
        exJa = match[1].trim();
        exVi = match[2].trim();
      }
    }

    return `
      <div class="vocab-card p-4 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-brand-300 dark:hover:border-slate-700 transition flex flex-col justify-between group relative" data-key="${itemKey}">
        
        <!-- Card Top Bar: Sino-Vietnamese Badge & Actions -->
        <div class="flex items-center justify-between gap-2 mb-2">
          <div class="flex items-center gap-1.5 flex-wrap">
            ${item.sinoVietnamese ? `
              <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-mono tracking-wide border border-amber-200/60 dark:border-amber-900/40">
                Hán Việt: ${item.sinoVietnamese}
              </span>
            ` : `
              <span class="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-700/80 text-slate-500 dark:text-slate-400">
                Từ thuần Kana
              </span>
            `}
          </div>
          <div class="flex items-center space-x-1">
            <button 
              class="btn-audio-speak p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-slate-700 transition" 
              title="Phát âm tiếng Nhật"
              data-text="${item.word}"
            >
              <i data-lucide="volume-2" class="w-4 h-4"></i>
            </button>
            <button 
              class="btn-bookmark p-1.5 rounded-lg transition ${isBookmarked ? 'text-red-500 hover:text-red-600' : 'text-slate-400 hover:text-red-500'}" 
              title="${isBookmarked ? 'Bỏ lưu' : 'Lưu từ này'}"
              data-id="${itemKey}"
            >
              <i data-lucide="bookmark" class="w-4 h-4 ${isBookmarked ? 'fill-red-500' : ''}"></i>
            </button>
          </div>
        </div>

        <!-- Japanese Word & Furigana -->
        <div class="mb-2.5">
          <div class="font-jp text-xs text-brand-600 dark:text-brand-400 font-medium ${readingMaskClass}">
            ${item.reading || ''}
          </div>
          <h3 class="font-jp text-2xl font-bold text-slate-900 dark:text-white tracking-wide cursor-pointer hover:text-brand-600 ${wordMaskClass}" data-speak="${item.word}">
            ${item.word}
          </h3>
        </div>

        <!-- Vietnamese Meaning -->
        <div class="mb-3">
          <p class="text-sm font-semibold text-slate-800 dark:text-slate-200 ${meaningMaskClass}">
            ${item.meaning}
          </p>
        </div>

        <!-- Example Sentence -->
        ${exJa ? `
          <div class="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400 space-y-1 bg-slate-50/50 dark:bg-slate-900/40 p-2.5 rounded-lg">
            <div class="flex items-start justify-between gap-2">
              <p class="font-jp font-medium text-slate-800 dark:text-slate-200 leading-snug">
                ${exJa}
              </p>
              <button class="btn-audio-speak shrink-0 text-slate-400 hover:text-brand-600 p-0.5" data-text="${exJa}" title="Phát âm câu ví dụ">
                <i data-lucide="volume-1" class="w-3.5 h-3.5"></i>
              </button>
            </div>
            ${exVi ? `
              <p class="text-[11px] text-slate-500 dark:text-slate-400 italic ${meaningMaskClass}">
                (${exVi})
              </p>
            ` : ''}
          </div>
        ` : ''}

      </div>
    `;
  }).join('');

  lucide.createIcons();
  attachCardEvents();
}

/**
 * Lấy 1 - 2 từ ghép tiêu biểu (熟語) cho chữ Hán
 * Ưu tiên:
 * 1. Các ví dụ trong item.examples có chứa chính chữ Hán đó và không phải template rác
 * 2. Tìm trong danh sách từ vựng bài học (state.currentVocabList) có chứa chữ Hán đó
 */
function getKanjiDisplayCompounds(item) {
  const compounds = [];
  const char = item.character;

  // 1. Kiểm tra examples có sẵn
  if (item.examples && Array.isArray(item.examples)) {
    for (const ex of item.examples) {
      if (!ex.compound) continue;
      // Bỏ qua template rác "見る" nếu chữ Hán không phải là 見
      if (char !== '見' && ex.compound.includes('見') && !ex.compound.includes(char)) {
        continue;
      }
      if (ex.compound.includes(char)) {
        compounds.push({
          compound: ex.compound,
          reading: ex.reading || '',
          meaning: ex.meaning || ''
        });
      }
      if (compounds.length >= 2) break;
    }
  }

  // 2. Tìm trong từ vựng bài học hiện tại nếu chưa đủ 2 từ
  if (compounds.length < 2 && state.currentVocabList && state.currentVocabList.length > 0) {
    for (const v of state.currentVocabList) {
      if (v.word && v.word.includes(char)) {
        if (!compounds.some(c => c.compound === v.word)) {
          compounds.push({
            compound: v.word,
            reading: v.reading || '',
            meaning: v.meaning || ''
          });
        }
      }
      if (compounds.length >= 2) break;
    }
  }

  return compounds.slice(0, 2);
}

/**
 * Render danh sách Hán tự
 */
function renderKanjiView(query = '') {
  const container = document.getElementById('kanji-list-container');
  const emptyState = document.getElementById('empty-state');
  if (!container) return;

  let list = state.currentKanjiList;

  // Lọc chỉ giữ các mục có chữ Hán hợp lệ (loại bỏ hoàn toàn các mục rỗng hoặc undefined)
  list = (list || []).filter(item => item && item.character && item.character.trim() !== '' && item.character !== 'undefined');

  // Lọc theo Bookmarks
  if (state.showOnlyBookmarks) {
    list = list.filter(item => state.bookmarks.has(item.id));
  }

  // Lọc theo Search Query
  if (query) {
    list = list.filter(item => 
      item.character.toLowerCase().includes(query) ||
      (item.onyomi && item.onyomi.toLowerCase().includes(query)) ||
      (item.kunyomi && item.kunyomi.toLowerCase().includes(query)) ||
      (item.meaning && item.meaning.toLowerCase().includes(query))
    );
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div class="col-span-full p-8 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div class="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3">
          <i data-lucide="info" class="w-6 h-6"></i>
        </div>
        <h4 class="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">Bài học này không có Hán tự riêng biệt</h4>
        <p class="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
          Nội dung hiện tại là chuyên đề thuần Từ vựng (Liên từ & Phó từ). Bạn hãy chuyển sang Phân hệ Từ vựng để học toàn bộ từ vựng và câu ví dụ của bài học này.
        </p>
        <button onclick="switchHub('vocab')" class="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition inline-flex items-center gap-2">
          <i data-lucide="book-open" class="w-4 h-4"></i>
          <span>Mở trong Phân hệ Từ vựng</span>
        </button>
      </div>
    `;
    lucide.createIcons();
    emptyState.classList.add('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  container.innerHTML = list.map(item => {
    const isBookmarked = state.bookmarks.has(item.id);

    const wordMaskClass = state.quizMaskMode === 'word' ? 'mask-hidden' : '';
    const readingMaskClass = state.quizMaskMode === 'reading' ? 'mask-hidden' : '';
    const meaningMaskClass = state.quizMaskMode === 'meaning' ? 'mask-hidden' : '';

    const compounds = getKanjiDisplayCompounds(item);

    return `
      <div class="kanji-card p-4 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-emerald-400 dark:hover:border-emerald-800 transition flex flex-col justify-between group relative" data-id="${item.id}">
        
        <!-- Header: Stroke Count & Bookmark -->
        <div class="flex items-center justify-between mb-2">
          <span class="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200/60 dark:border-emerald-900/40">
            ${item.strokes ? `${item.strokes} nét` : 'Hán tự'}
          </span>
          <div class="flex items-center space-x-1">
            <button 
              class="btn-audio-speak p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-700 transition" 
              title="Phát âm Hán tự"
              data-text="${item.character}"
            >
              <i data-lucide="volume-2" class="w-4 h-4"></i>
            </button>
            <button 
              class="btn-bookmark p-1.5 rounded-lg transition ${isBookmarked ? 'text-red-500 hover:text-red-600' : 'text-slate-400 hover:text-red-500'}" 
              title="${isBookmarked ? 'Bỏ lưu' : 'Lưu Hán tự này'}"
              data-id="${item.id}"
            >
              <i data-lucide="bookmark" class="w-4 h-4 ${isBookmarked ? 'fill-red-500' : ''}"></i>
            </button>
          </div>
        </div>

        <!-- Large Kanji Character + Sino Vietnamese Title -->
        <div class="flex items-center space-x-3 mb-3">
          <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-700 dark:to-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center font-jp text-3xl font-bold text-slate-900 dark:text-white shrink-0 cursor-pointer ${wordMaskClass}" data-speak="${item.character}">
            ${item.character}
          </div>
          <div>
            <h4 class="text-base font-bold text-slate-900 dark:text-white ${meaningMaskClass}">
              ${item.meaning}
            </h4>
            <div class="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
              <span class="text-emerald-600 dark:text-emerald-400 font-semibold">Phân hệ Hán tự</span>
            </div>
          </div>
        </div>

        <!-- Onyomi & Kunyomi Reading Pills -->
        <div class="grid grid-cols-2 gap-2 text-xs mb-3 ${readingMaskClass}">
          <div class="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
            <span class="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Âm On:</span>
            <span class="font-jp font-semibold text-emerald-700 dark:text-emerald-300">${item.onyomi || '-'}</span>
          </div>
          <div class="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
            <span class="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Âm Kun:</span>
            <span class="font-jp font-semibold text-teal-700 dark:text-teal-300">${item.kunyomi || '-'}</span>
          </div>
        </div>

        <!-- Các thẻ từ ghép riêng biệt tạo từ chữ Hán (coi như 1 từ vựng độc lập) -->
        ${compounds.length > 0 ? `
          <div class="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span class="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-extrabold">
                <i data-lucide="layers" class="w-3.5 h-3.5"></i>
                Từ ghép tạo từ Hán tự này (${compounds.length} từ):
              </span>
              <span class="text-[10px] text-slate-400 font-medium">Học như từ vựng</span>
            </div>

            <div class="grid grid-cols-1 gap-2">
              ${compounds.map(ex => `
                <div class="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-emerald-200/60 dark:border-emerald-900/40 hover:border-emerald-400 dark:hover:border-emerald-600 transition flex flex-col justify-between group/compound">
                  <div class="flex items-center justify-between gap-2 mb-1">
                    <div class="flex items-baseline gap-1.5 flex-wrap">
                      <span class="font-jp font-bold text-sm text-slate-900 dark:text-white group-hover/compound:text-emerald-600 transition cursor-pointer" data-speak="${ex.compound}">
                        ${ex.compound}
                      </span>
                      <span class="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-200/40">
                        ${ex.reading}
                      </span>
                    </div>
                    <button class="btn-audio-speak shrink-0 p-1 rounded-md text-slate-400 hover:text-emerald-600 hover:bg-white dark:hover:bg-slate-800 transition" data-text="${ex.compound}" title="Phát âm từ ghép này">
                      <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
                    </button>
                  </div>
                  <div class="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed pl-0.5">
                    ${ex.meaning}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

      </div>
    `;
  }).join('');

  lucide.createIcons();
  attachCardEvents();
}

/**
 * Gán các sự kiện tương tác trên thẻ Từ vựng / Hán tự
 */
function attachCardEvents() {
  // Nút Audio
  document.querySelectorAll('.btn-audio-speak').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const text = btn.getAttribute('data-text');
      btn.classList.add('playing-audio');
      speakJapanese(text, () => {
        btn.classList.remove('playing-audio');
      });
    };
  });

  // Bấm vào từ Kanji để phát âm
  document.querySelectorAll('[data-speak]').forEach(el => {
    el.onclick = () => {
      const text = el.getAttribute('data-speak');
      speakJapanese(text);
    };
  });

  // Bấm vào phần tử che mờ để lật mở đáp án (Quiz Mask)
  document.querySelectorAll('.mask-hidden').forEach(el => {
    el.onclick = (e) => {
      e.stopPropagation();
      el.classList.toggle('mask-revealed');
    };
  });

  // Nút Bookmark / Yêu thích
  document.querySelectorAll('.btn-bookmark').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      toggleBookmark(id);
    };
  });
}

/**
 * Thêm / Xóa Bookmark
 */
function toggleBookmark(id) {
  if (state.bookmarks.has(id)) {
    state.bookmarks.delete(id);
    showToast('Đã xóa khỏi danh sách yêu thích');
  } else {
    state.bookmarks.add(id);
    showToast('Đã lưu vào danh sách yêu thích!');
  }

  // Lưu vào localStorage
  localStorage.setItem('jlpt_n4_bookmarks', JSON.stringify(Array.from(state.bookmarks)));

  // Cập nhật lại view hiện tại
  renderCurrentView();
}

/**
 * Thiết lập dữ liệu Flashcards theo phân hệ độc lập:
 * - 'vocab': Chỉ nạp từ vựng của bài (không pha tạp Hán tự đơn lẻ)
 * - 'kanji': Chỉ nạp Hán tự của bài kèm 1-2 từ ghép tiêu biểu
 * - 'grammar': Chỉ nạp các mẫu ngữ pháp JLPT
 */
function setupFlashcards(deckType = 'vocab') {
  state.flashcardDeckType = deckType;
  const cards = [];

  if (deckType === 'vocab') {
    // 1. Phân hệ TỪ VỰNG
    state.currentVocabList.forEach(v => {
      let exJa = '';
      let exVi = '';
      if (typeof v.example === 'string') {
        const m = v.example.match(/^(.*?)[(（](.*?)[)）]$/);
        if (m) {
          exJa = m[1].trim();
          exVi = m[2].trim();
        } else {
          exJa = v.example;
        }
      }

      cards.push({
        type: 'vocab',
        tag: v.sinoVietnamese ? `Hán Việt: ${v.sinoVietnamese}` : 'Từ vựng',
        frontWord: v.word,
        frontReading: v.reading || '',
        backMeaning: v.meaning,
        backDetailType: v.sinoVietnamese ? `Âm Hán: ${v.sinoVietnamese}` : 'Từ vựng JLPT',
        exampleJa: exJa,
        exampleVi: exVi
      });
    });
  } else if (deckType === 'kanji') {
    // 2. Phân hệ HÁN TỰ (Tách riêng biệt 100%)
    state.currentKanjiList.forEach(k => {
      const compounds = getKanjiDisplayCompounds(k);
      let compoundExJa = '';
      let compoundExVi = '';

      if (compounds.length > 0) {
        compoundExJa = compounds.map(c => `${c.compound} (${c.reading})`).join('  |  ');
        compoundExVi = compounds.map(c => `${c.meaning}`).join('  |  ');
      }

      cards.push({
        type: 'kanji',
        tag: k.strokes ? `Hán tự (${k.strokes} nét)` : 'Hán tự',
        frontWord: k.character,
        frontReading: `On: ${k.onyomi || '-'} | Kun: ${k.kunyomi || '-'}`,
        backMeaning: k.meaning,
        backDetailType: 'Hán tự & Từ ghép tiêu biểu',
        exampleJa: compoundExJa ? `Từ ghép: ${compoundExJa}` : '',
        exampleVi: compoundExVi ? `Ý nghĩa: ${compoundExVi}` : ''
      });
    });
  } else if (deckType === 'grammar') {
    // 3. Phân hệ NGỮ PHÁP (Flashcard 3D)
    const items = (state.grammar && state.grammar.manifest && state.grammar.manifest.items) ? state.grammar.manifest.items : [];
    items.forEach(g => {
      cards.push({
        type: 'grammar',
        tag: `Ngữ pháp ${g.level || 'JLPT'}`,
        frontWord: g.title,
        frontReading: g.connection || 'Cấu trúc kết hợp',
        backMeaning: g.meaning,
        backDetailType: g.usageNotes || 'Sắc thái sử dụng',
        exampleJa: 'Áp dụng qua bộ đề trắc nghiệm tình huống thực tế',
        exampleVi: 'Nhấn vào Đấu trường để luyện 2 chiều'
      });
    });
  }

  state.flashcards = cards;
  state.flashcardIndex = 0;
  state.isFlashcardFlipped = false;
}

/**
 * Render chế độ Thẻ Flashcard
 */
function renderFlashcardView() {
  const counter = document.getElementById('flashcard-counter');
  const innerCard = document.getElementById('flashcard-inner');

  if (state.flashcards.length === 0) {
    document.getElementById('fc-front-word').textContent = 'Chưa có dữ liệu';
    document.getElementById('fc-front-reading').textContent = '';
    counter.textContent = '0 / 0';
    return;
  }

  const current = state.flashcards[state.flashcardIndex];

  counter.textContent = `Thẻ ${state.flashcardIndex + 1} / ${state.flashcards.length}`;

  // Mặt trước
  document.getElementById('fc-front-tag').textContent = current.tag;
  document.getElementById('fc-front-word').textContent = current.frontWord;
  document.getElementById('fc-front-reading').textContent = current.frontReading;

  // Mặt sau
  document.getElementById('fc-back-meaning').textContent = current.backMeaning;
  document.getElementById('fc-back-type').textContent = current.backDetailType;

  const exampleBox = document.getElementById('fc-back-example-box');
  if (current.exampleJa) {
    exampleBox.classList.remove('hidden');
    document.getElementById('fc-back-example-ja').textContent = current.exampleJa;
    document.getElementById('fc-back-example-vi').textContent = current.exampleVi;
  } else {
    exampleBox.classList.add('hidden');
  }

  // Đặt lại trạng thái lật
  if (!state.isFlashcardFlipped) {
    innerCard.classList.remove('rotate-y-180');
  } else {
    innerCard.classList.add('rotate-y-180');
  }

  // Nút audio trên thẻ flashcard
  document.querySelector('.fc-audio-btn').onclick = (e) => {
    e.stopPropagation();
    speakJapanese(current.frontWord);
  };
}

function flipFlashcard() {
  state.isFlashcardFlipped = !state.isFlashcardFlipped;
  const innerCard = document.getElementById('flashcard-inner');
  innerCard.classList.toggle('rotate-y-180');
}

function nextFlashcard() {
  if (state.flashcards.length === 0) return;
  state.flashcardIndex = (state.flashcardIndex + 1) % state.flashcards.length;
  state.isFlashcardFlipped = false;
  renderFlashcardView();
}

function prevFlashcard() {
  if (state.flashcards.length === 0) return;
  state.flashcardIndex = (state.flashcardIndex - 1 + state.flashcards.length) % state.flashcards.length;
  state.isFlashcardFlipped = false;
  renderFlashcardView();
}

function shuffleFlashcards() {
  for (let i = state.flashcards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [state.flashcards[i], state.flashcards[j]] = [state.flashcards[j], state.flashcards[i]];
  }
  state.flashcardIndex = 0;
  state.isFlashcardFlipped = false;
  renderFlashcardView();
  showToast('Đã xáo trộn ngẫu nhiên danh sách thẻ');
}

/**
 * Đọc liên tục toàn bộ danh sách từ vựng trong bài
 */
async function pronounceAllWords() {
  if (state.isPlayingAll) {
    synth.cancel();
    state.isPlayingAll = false;
    document.getElementById('btn-pronounce-all').innerHTML = `
      <i data-lucide="volume-2" class="w-4 h-4 text-brand-500"></i>
      Nghe toàn bộ
    `;
    lucide.createIcons();
    return;
  }

  const list = state.currentVocabList;
  if (!list || list.length === 0) {
    showToast('Bài học này chưa có danh sách từ vựng');
    return;
  }

  state.isPlayingAll = true;
  document.getElementById('btn-pronounce-all').innerHTML = `
    <i data-lucide="square" class="w-4 h-4 text-red-500 fill-red-500"></i>
    Dừng đọc
  `;
  lucide.createIcons();

  for (let i = 0; i < list.length; i++) {
    if (!state.isPlayingAll) break;
    const item = list[i];
    await new Promise(resolve => {
      speakJapanese(item.word, () => {
        setTimeout(resolve, 800); // Tạm dừng 800ms giữa mỗi từ
      });
    });
  }

  state.isPlayingAll = false;
  document.getElementById('btn-pronounce-all').innerHTML = `
    <i data-lucide="volume-2" class="w-4 h-4 text-brand-500"></i>
    Nghe toàn bộ
  `;
  lucide.createIcons();
}

/**
 * Thiết lập các sự kiện toàn cục trong App
 */
function setupEventListeners() {
  // 1. Topbar Tri-Hub Switcher Buttons
  const btnHubVocab = document.getElementById('btn-hub-vocab');
  const btnHubKanji = document.getElementById('btn-hub-kanji');
  const btnHubGrammar = document.getElementById('btn-hub-grammar');

  // 2. Secondary Sub-nav Toolbars
  const navTabsVocab = document.getElementById('nav-tabs-vocab');
  const navTabsKanji = document.getElementById('nav-tabs-kanji');
  const navTabsGrammar = document.getElementById('nav-tabs-grammar');

  // 3. Sub-tabs trong Hub 1: TỪ VỰNG
  const tabVocab = document.getElementById('tab-vocab');
  const tabFlashcard = document.getElementById('tab-flashcard');
  const tabPractice = document.getElementById('tab-practice');

  // 4. Sub-tabs trong Hub 2: HÁN TỰ (Tách riêng biệt)
  const tabKanji = document.getElementById('tab-kanji');
  const tabKanjiFlashcard = document.getElementById('tab-kanji-flashcard');
  const tabKanjiPractice = document.getElementById('tab-kanji-practice');

  // 5. Sub-tabs trong Hub 3: NGỮ PHÁP
  const tabGrammarCatalog = document.getElementById('tab-grammar-catalog');
  const tabGrammarFlashcard = document.getElementById('tab-grammar-flashcard');
  const tabGrammarTest = document.getElementById('tab-grammar-test');

  // 6. View Sections
  const viewVocab = document.getElementById('view-vocab');
  const viewKanji = document.getElementById('view-kanji');
  const viewFlashcard = document.getElementById('view-flashcard');
  const viewPractice = document.getElementById('view-practice');
  const viewGrammar = document.getElementById('view-grammar');

  /**
   * Chuyển đổi tab con bên trong từng Phân hệ
   */
  function switchTab(tab) {
    state.currentTab = tab;

    // Danh sách tất cả sub-tabs
    const allTabBtns = [
      tabVocab, tabFlashcard, tabPractice,
      tabKanji, tabKanjiFlashcard, tabKanjiPractice,
      tabGrammarCatalog, tabGrammarFlashcard, tabGrammarTest
    ];

    // Reset styles toàn bộ tab về trạng thái không active
    allTabBtns.forEach(btn => {
      if (btn) {
        btn.className = 'tab-btn px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 flex items-center gap-1.5 transition';
      }
    });

    // Ẩn tất cả view
    if (viewVocab) viewVocab.classList.add('hidden');
    if (viewKanji) viewKanji.classList.add('hidden');
    if (viewFlashcard) viewFlashcard.classList.add('hidden');
    if (viewPractice) viewPractice.classList.add('hidden');
    if (viewGrammar) viewGrammar.classList.add('hidden');

    // Kích hoạt tab và view tương ứng
    if (tab === 'vocab') {
      if (tabVocab) tabVocab.className = 'tab-btn active px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition';
      if (viewVocab) viewVocab.classList.remove('hidden');
      renderVocabularyView(state.searchQuery.trim().toLowerCase());

    } else if (tab === 'vocab-flashcard' || tab === 'flashcard') {
      if (tabFlashcard) tabFlashcard.className = 'tab-btn active px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition';
      if (viewFlashcard) viewFlashcard.classList.remove('hidden');
      setupFlashcards('vocab');
      renderFlashcardView();

    } else if (tab === 'vocab-practice' || tab === 'practice') {
      if (tabPractice) tabPractice.className = 'tab-btn active px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition';
      if (viewPractice) viewPractice.classList.remove('hidden');
      initPracticeSetup('vocab');

    } else if (tab === 'kanji') {
      if (tabKanji) tabKanji.className = 'tab-btn active px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition';
      if (viewKanji) viewKanji.classList.remove('hidden');
      renderKanjiView(state.searchQuery.trim().toLowerCase());

    } else if (tab === 'kanji-flashcard') {
      if (tabKanjiFlashcard) tabKanjiFlashcard.className = 'tab-btn active px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 transition';
      if (viewFlashcard) viewFlashcard.classList.remove('hidden');
      setupFlashcards('kanji');
      renderFlashcardView();

    } else if (tab === 'kanji-practice') {
      if (tabKanjiPractice) tabKanjiPractice.className = 'tab-btn active px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 transition';
      if (viewPractice) viewPractice.classList.remove('hidden');
      initPracticeSetup('kanji');

    } else if (tab === 'grammar' || tab === 'grammar-catalog') {
      if (tabGrammarCatalog) tabGrammarCatalog.className = 'tab-btn active px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-sm border border-purple-200 dark:border-purple-800 flex items-center gap-1.5 transition';
      if (viewGrammar) {
        viewGrammar.classList.remove('hidden');
        initGrammarModule();
        quitGrammarArena();
      }

    } else if (tab === 'grammar-flashcard') {
      if (tabGrammarFlashcard) tabGrammarFlashcard.className = 'tab-btn active px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-sm border border-purple-200 dark:border-purple-800 flex items-center gap-1.5 transition';
      if (viewFlashcard) viewFlashcard.classList.remove('hidden');
      setupFlashcards('grammar');
      renderFlashcardView();

    } else if (tab === 'grammar-test') {
      if (tabGrammarTest) tabGrammarTest.className = 'tab-btn active px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-sm border border-purple-200 dark:border-purple-800 flex items-center gap-1.5 transition';
      if (viewGrammar) {
        viewGrammar.classList.remove('hidden');
        initGrammarModule();
      }
    }

    lucide.createIcons();
  }

  /**
   * Chuyển đổi giữa 3 Phân hệ Độc lập lớn (Tri-Hub Navigation):
   * 'vocab' ⟷ 'kanji' ⟷ 'grammar'
   */
  function switchHub(hub) {
    state.activeHub = hub;

    const baseClass = 'hub-switcher-btn px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition ';

    // Reset ô lọc bài học trên sidebar và đổi placeholder theo phân hệ
    const sidebarFilter = document.getElementById('sidebar-unit-filter');
    if (sidebarFilter) {
      sidebarFilter.value = '';
      if (hub === 'vocab') sidebarFilter.placeholder = '🔍 Lọc bài học từ vựng...';
      else if (hub === 'kanji') sidebarFilter.placeholder = '🔍 Lọc bài học Hán tự...';
      else if (hub === 'grammar') sidebarFilter.placeholder = '🔍 Lọc mẫu ngữ pháp theo tên hoặc nghĩa...';
    }

    if (hub === 'vocab') {
      state.manifest = state.vocabManifest;
      if (btnHubVocab) btnHubVocab.className = baseClass + 'active bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm font-semibold';
      if (btnHubKanji) btnHubKanji.className = baseClass + 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-300 font-medium';
      if (btnHubGrammar) btnHubGrammar.className = baseClass + 'text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 font-medium';

      if (navTabsVocab) navTabsVocab.classList.remove('hidden');
      if (navTabsKanji) navTabsKanji.classList.add('hidden');
      if (navTabsGrammar) navTabsGrammar.classList.add('hidden');

      updateStatsDisplay();
      renderTreeView();

      // Đảm bảo có bài học được chọn trong cây từ vựng
      const currManifest = state.vocabManifest;
      if (currManifest && currManifest.curricula && currManifest.curricula.length > 0) {
        const currExists = state.activeCurriculum && currManifest.curricula.find(c => c.id === state.activeCurriculum.id);
        const unitExists = currExists && state.activeUnit && currExists.units.find(u => u.id === state.activeUnit.id);
        if (!unitExists) {
          const firstC = currManifest.curricula[0];
          if (firstC.units && firstC.units.length > 0) {
            selectUnit(firstC.id, firstC.units[0].id);
          }
        }
      }

      switchTab('vocab');

    } else if (hub === 'kanji') {
      state.manifest = state.kanjiManifest;
      if (btnHubKanji) btnHubKanji.className = baseClass + 'active bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm font-bold';
      if (btnHubVocab) btnHubVocab.className = baseClass + 'text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 font-medium';
      if (btnHubGrammar) btnHubGrammar.className = baseClass + 'text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 font-medium';

      if (navTabsKanji) navTabsKanji.classList.remove('hidden');
      if (navTabsVocab) navTabsVocab.classList.add('hidden');
      if (navTabsGrammar) navTabsGrammar.classList.add('hidden');

      updateStatsDisplay();
      renderTreeView();

      // Kiểm tra nếu bài hiện tại có chữ Hán thì nạp, nếu không thì chọn bài đầu tiên có chữ Hán
      const currManifest = state.kanjiManifest;
      if (currManifest && currManifest.curricula && currManifest.curricula.length > 0) {
        const currExists = state.activeCurriculum && currManifest.curricula.find(c => c.id === state.activeCurriculum.id);
        const unitExists = currExists && state.activeUnit && currExists.units.find(u => u.id === state.activeUnit.id && u.kanjiCount > 0);
        if (!unitExists) {
          let found = false;
          for (const c of currManifest.curricula) {
            const u = c.units.find(un => un.kanjiCount > 0);
            if (u) {
              selectUnit(c.id, u.id);
              found = true;
              break;
            }
          }
        } else {
          selectUnit(currExists.id, unitExists.id);
        }
      }

      switchTab('kanji');

    } else if (hub === 'grammar') {
      if (btnHubGrammar) btnHubGrammar.className = baseClass + 'active bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-sm font-bold';
      if (btnHubVocab) btnHubVocab.className = baseClass + 'text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 font-medium';
      if (btnHubKanji) btnHubKanji.className = baseClass + 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-300 font-medium';

      if (navTabsGrammar) navTabsGrammar.classList.remove('hidden');
      if (navTabsVocab) navTabsVocab.classList.add('hidden');
      if (navTabsKanji) navTabsKanji.classList.add('hidden');

      updateStatsDisplay();
      renderTreeView();

      switchTab('grammar');
    }

    lucide.createIcons();
  }

  // Gắn sự kiện cho 3 Nút Switcher trên Topbar
  if (btnHubVocab) btnHubVocab.onclick = () => switchHub('vocab');
  if (btnHubKanji) btnHubKanji.onclick = () => switchHub('kanji');
  if (btnHubGrammar) btnHubGrammar.onclick = () => switchHub('grammar');

  // Gắn sự kiện cho Sub-tabs Từ vựng
  if (tabVocab) tabVocab.onclick = () => switchTab('vocab');
  if (tabFlashcard) tabFlashcard.onclick = () => switchTab('vocab-flashcard');
  if (tabPractice) tabPractice.onclick = () => switchTab('vocab-practice');

  // Gắn sự kiện cho Sub-tabs Hán tự (Độc lập)
  if (tabKanji) tabKanji.onclick = () => switchTab('kanji');
  if (tabKanjiFlashcard) tabKanjiFlashcard.onclick = () => switchTab('kanji-flashcard');
  if (tabKanjiPractice) tabKanjiPractice.onclick = () => switchTab('kanji-practice');

  // Gắn sự kiện cho Sub-tabs Ngữ pháp
  if (tabGrammarCatalog) tabGrammarCatalog.onclick = () => switchTab('grammar-catalog');
  if (tabGrammarFlashcard) tabGrammarFlashcard.onclick = () => switchTab('grammar-flashcard');
  if (tabGrammarTest) tabGrammarTest.onclick = () => switchTab('grammar-test');

  // Sidebar Filter Input
  const sidebarFilter = document.getElementById('sidebar-unit-filter');
  sidebarFilter.oninput = (e) => {
    renderTreeView(e.target.value);
  };

  // Global Search Input
  const searchInput = document.getElementById('global-search');
  const btnClearSearch = document.getElementById('btn-clear-search');

  searchInput.oninput = (e) => {
    state.searchQuery = e.target.value;
    if (state.searchQuery) {
      btnClearSearch.classList.remove('hidden');
    } else {
      btnClearSearch.classList.add('hidden');
    }
    renderCurrentView();
  };

  btnClearSearch.onclick = () => {
    searchInput.value = '';
    state.searchQuery = '';
    btnClearSearch.classList.add('hidden');
    renderCurrentView();
  };

  // Quiz Mode Dropdown Menu (nếu tồn tại)
  const btnQuizMode = document.getElementById('btn-quiz-mode');
  const quizMenu = document.getElementById('quiz-menu');

  if (btnQuizMode && quizMenu) {
    btnQuizMode.onclick = (e) => {
      e.stopPropagation();
      quizMenu.classList.toggle('hidden');
    };

    document.addEventListener('click', () => {
      quizMenu.classList.add('hidden');
    });

    document.querySelectorAll('.quiz-option').forEach(option => {
      option.onclick = (e) => {
        e.stopPropagation();
        const mask = option.getAttribute('data-mask');
        state.quizMaskMode = mask;

        document.querySelectorAll('.quiz-option .check-icon').forEach(icon => icon.classList.add('hidden'));
        option.querySelector('.check-icon').classList.remove('hidden');

        const labels = {
          none: 'Chế độ xem',
          reading: 'Ẩn Furigana',
          meaning: 'Ẩn Nghĩa',
          word: 'Ẩn Từ vựng'
        };
        const lbl = document.getElementById('quiz-mode-label');
        if (lbl) lbl.textContent = labels[mask];

        quizMenu.classList.add('hidden');
        renderCurrentView();
        showToast(`Đã bật: ${labels[mask]}`);
      };
    });
  }

  // Audio Speed Buttons
  document.querySelectorAll('.audio-speed-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.audio-speed-btn').forEach(b => {
        b.className = 'audio-speed-btn px-2 py-1 rounded text-slate-600 dark:text-slate-300 hover:text-brand-600';
      });
      btn.className = 'audio-speed-btn px-2 py-1 rounded bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm';
      state.audioSpeed = parseFloat(btn.getAttribute('data-speed'));
      showToast(`Tốc độ đọc: ${state.audioSpeed}x`);
    };
  });

  // Bookmark Filter Toggle
  const btnToggleBookmarks = document.getElementById('btn-toggle-bookmarks');
  btnToggleBookmarks.onclick = () => {
    state.showOnlyBookmarks = !state.showOnlyBookmarks;
    btnToggleBookmarks.classList.toggle('text-red-500', state.showOnlyBookmarks);
    btnToggleBookmarks.classList.toggle('bg-red-50', state.showOnlyBookmarks);
    btnToggleBookmarks.classList.toggle('dark:bg-red-950/40', state.showOnlyBookmarks);
    renderCurrentView();
    showToast(state.showOnlyBookmarks ? 'Chỉ hiển thị các từ đã đánh dấu' : 'Hiển thị tất cả');
  };

  // Dark Mode Toggle
  const btnThemeToggle = document.getElementById('btn-theme-toggle');
  btnThemeToggle.onclick = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    showToast(isDark ? 'Giao diện Tối' : 'Giao diện Sáng');
  };

  // GitHub Dropdown Menu Toggle
  const btnGithubMenu = document.getElementById('btn-github-menu');
  const githubDropdown = document.getElementById('github-dropdown-menu');
  if (btnGithubMenu && githubDropdown) {
    btnGithubMenu.onclick = (e) => {
      e.stopPropagation();
      const isHidden = githubDropdown.classList.toggle('hidden');
      btnGithubMenu.setAttribute('aria-expanded', !isHidden);
    };

    // Đóng dropdown khi click ra bên ngoài
    document.addEventListener('click', (e) => {
      if (!btnGithubMenu.contains(e.target) && !githubDropdown.contains(e.target)) {
        githubDropdown.classList.add('hidden');
        btnGithubMenu.setAttribute('aria-expanded', 'false');
      }
    });

    // Tự động đóng dropdown khi nhấn vào một trong hai liên kết
    githubDropdown.querySelectorAll('.github-link-item').forEach(link => {
      link.addEventListener('click', () => {
        githubDropdown.classList.add('hidden');
        btnGithubMenu.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Khôi phục theme đã lưu
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // Pronounce All Button
  document.getElementById('btn-pronounce-all').onclick = pronounceAllWords;

  // Flashcard Controls
  document.getElementById('flashcard-element').onclick = flipFlashcard;
  document.getElementById('btn-fc-flip').onclick = flipFlashcard;
  document.getElementById('btn-fc-next').onclick = nextFlashcard;
  document.getElementById('btn-fc-prev').onclick = prevFlashcard;
  document.getElementById('btn-flashcard-shuffle').onclick = shuffleFlashcards;

  // Keyboard Navigation for Flashcard
  window.addEventListener('keydown', (e) => {
    if (state.currentTab !== 'flashcard') return;
    if (e.code === 'Space') {
      e.preventDefault();
      flipFlashcard();
    } else if (e.code === 'ArrowRight') {
      e.preventDefault();
      nextFlashcard();
    } else if (e.code === 'ArrowLeft') {
      e.preventDefault();
      prevFlashcard();
    }
  });

  // ==========================================
  // SIDEBAR TOGGLE & SHORTCUT (Mobile & Desktop)
  // ==========================================
  const btnToggleSidebar = document.getElementById('btn-toggle-sidebar');
  const btnCloseSidebar = document.getElementById('btn-close-sidebar');
  const btnSidebarCollapse = document.getElementById('btn-sidebar-collapse');
  const sidebarCollapseIcon = document.getElementById('sidebar-collapse-icon');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  function openMobileSidebar() {
    sidebar.classList.remove('-translate-x-full');
    overlay.classList.remove('hidden');
  }

  function closeMobileSidebar() {
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
  }

  function toggleDesktopSidebar() {
    sidebar.classList.toggle('desktop-collapsed');
    const isCollapsed = sidebar.classList.contains('desktop-collapsed');
    if (btnSidebarCollapse) {
      btnSidebarCollapse.classList.toggle('sidebar-collapsed', isCollapsed);
      btnSidebarCollapse.title = isCollapsed ? 'Hiện thanh bài học (Ctrl + B)' : 'Ẩn thanh bài học (Ctrl + B)';
      btnSidebarCollapse.innerHTML = isCollapsed 
        ? '<i data-lucide="chevron-right" class="w-4 h-4"></i>'
        : '<i data-lucide="chevron-left" class="w-4 h-4"></i>';
      lucide.createIcons();
    }
  }

  function toggleSidebar() {
    if (window.innerWidth < 1024) {
      if (sidebar.classList.contains('-translate-x-full')) {
        openMobileSidebar();
      } else {
        closeMobileSidebar();
      }
    } else {
      toggleDesktopSidebar();
    }
  }

  if (btnToggleSidebar) btnToggleSidebar.onclick = toggleSidebar;
  if (btnSidebarCollapse) btnSidebarCollapse.onclick = toggleDesktopSidebar;
  if (btnCloseSidebar) btnCloseSidebar.onclick = closeMobileSidebar;
  if (overlay) overlay.onclick = closeMobileSidebar;

  // Cài đặt phím tắt bàn phím Ctrl + B (hoặc Cmd + B) để ẩn/hiện thanh cây bài học
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      toggleSidebar();
    }
  });

  // ==========================================
  // PRACTICE TYPING TEST EVENT LISTENERS
  // ==========================================
  setupPracticeListeners();
}

/**
 * Gắn các sự kiện cho giao diện Luyện gõ (Practice Mode)
 */
function setupPracticeListeners() {
  // 1. Radio Mode Selector
  const modeRadios = document.querySelectorAll('input[name="practice-mode"]');
  const labelWord = document.getElementById('label-mode-prompt-word');
  const labelMeaning = document.getElementById('label-mode-prompt-meaning');

  modeRadios.forEach(r => {
    r.addEventListener('change', (e) => {
      state.practice.mode = e.target.value;
      if (e.target.value === 'prompt-word') {
        labelWord.className = 'relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition border-brand-500 bg-brand-50/40 dark:bg-brand-950/20';
        labelWord.querySelector('.w-2').className = 'w-2 h-2 rounded-full bg-brand-600';
        labelMeaning.className = 'relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition border-slate-200 dark:border-slate-700 hover:border-slate-300';
        labelMeaning.querySelector('.w-2').className = 'w-2 h-2 rounded-full bg-transparent';
      } else {
        labelMeaning.className = 'relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition border-brand-500 bg-brand-50/40 dark:bg-brand-950/20';
        labelMeaning.querySelector('.w-2').className = 'w-2 h-2 rounded-full bg-brand-600';
        labelWord.className = 'relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition border-slate-200 dark:border-slate-700 hover:border-slate-300';
        labelWord.querySelector('.w-2').className = 'w-2 h-2 rounded-full bg-transparent';
      }
    });
  });

  // 2. Slider Delay (n giây)
  const delaySlider = document.getElementById('practice-delay-slider');
  const delayVal = document.getElementById('practice-delay-val');
  const quickDelayBtns = document.querySelectorAll('.btn-quick-delay');

  if (delaySlider && delayVal) {
    delaySlider.oninput = (e) => {
      const val = parseFloat(e.target.value);
      state.practice.delaySeconds = val;
      delayVal.textContent = val.toFixed(1);
      quickDelayBtns.forEach(b => {
        const bVal = parseFloat(b.dataset.delay);
        if (bVal === val) {
          b.className = 'btn-quick-delay px-2 py-1 text-xs rounded-lg border border-brand-500 bg-brand-50 dark:bg-brand-950/30 text-brand-600 font-bold';
        } else {
          b.className = 'btn-quick-delay px-2 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:text-brand-600 font-semibold';
        }
      });
    };

    quickDelayBtns.forEach(btn => {
      btn.onclick = () => {
        const val = parseFloat(btn.dataset.delay);
        delaySlider.value = val;
        state.practice.delaySeconds = val;
        delayVal.textContent = val.toFixed(1);
        quickDelayBtns.forEach(b => {
          b.className = 'btn-quick-delay px-2 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:text-brand-600 font-semibold';
        });
        btn.className = 'btn-quick-delay px-2 py-1 text-xs rounded-lg border border-brand-500 bg-brand-50 dark:bg-brand-950/30 text-brand-600 font-bold';
      };
    });
  }

  // 3. Shuffle Checkbox
  const shuffleToggle = document.getElementById('practice-shuffle-toggle');
  if (shuffleToggle) {
    shuffleToggle.onchange = (e) => {
      state.practice.isShuffled = e.target.checked;
    };
  }

  // 4. Action Buttons
  const btnStart = document.getElementById('btn-practice-start');
  if (btnStart) btnStart.onclick = startPracticeTest;

  const btnSubmit = document.getElementById('btn-arena-submit');
  if (btnSubmit) btnSubmit.onclick = () => submitPracticeAnswer(false);

  const btnSkip = document.getElementById('btn-arena-skip');
  if (btnSkip) btnSkip.onclick = () => submitPracticeAnswer(true);

  const btnNextNow = document.getElementById('btn-arena-next-now');
  if (btnNextNow) btnNextNow.onclick = nextPracticeQuestion;

  const btnQuit = document.getElementById('btn-arena-quit');
  if (btnQuit) btnQuit.onclick = quitPracticeArena;

  const btnRestart = document.getElementById('btn-summary-restart');
  if (btnRestart) btnRestart.onclick = startPracticeTest;

  const btnBack = document.getElementById('btn-summary-back');
  if (btnBack) btnBack.onclick = quitPracticeArena;

  // 5. Typing Input Enter & Clear
  const inputEl = document.getElementById('arena-typing-input');
  const btnClear = document.getElementById('btn-arena-clear-input');

  if (inputEl) {
    inputEl.onkeydown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        submitPracticeAnswer(false);
      }
    };

    inputEl.oninput = (e) => {
      if (btnClear) {
        if (e.target.value.length > 0) {
          btnClear.classList.remove('hidden');
        } else {
          btnClear.classList.add('hidden');
        }
      }
    };
  }

  if (btnClear && inputEl) {
    btnClear.onclick = () => {
      inputEl.value = '';
      btnClear.classList.add('hidden');
      inputEl.focus();
    };
  }
}

/**
 * ===================================================================
 * CORE LOGIC CHO CHẾ ĐỘ LUYỆN GÕ TEST (TỪ VỰNG & HÁN TỰ ĐỘC LẬP)
 * ===================================================================
 */

/**
 * Kiểm tra xem một chuỗi có thuần là Katakana hay không
 */
function isPureKatakana(str) {
  const clean = (str || '').replace(/[・\s\-[\]()（）「」~～]/g, '').trim();
  return clean.length > 0 && /^[\u30A0-\u30FFー]+$/.test(clean);
}

/**
 * Chuyển đổi Katakana sang Hiragana
 */
function katakanaToHiragana(str) {
  return (str || '').replace(/[\u30A1-\u30F6]/g, match => {
    const chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
}

/**
 * Kiểm tra tính hợp lệ của câu trả lời người dùng
 * - Đối với Hán tự: Chấp nhận gõ chữ Hán, âm On, âm Kun, hoặc âm Hán Việt
 * - Đối với Từ vựng: Chấp nhận gõ Hiragana hoặc chữ Hán
 */
function checkPracticeAnswerMatch(userInput, q) {
  const user = (userInput || '').trim().replace(/\s+/g, '');
  if (!user) return false;

  const cleanWord = (q.word || '').trim().replace(/[・\s\-[\]()（）「」~～]/g, '');
  const cleanReading = (q.reading || '').trim().replace(/[・\s\-[\]()（）「」~～]/g, '');

  // 1. Nếu đang làm Test Hán tự
  if (state.practiceTarget === 'kanji') {
    // a. Gõ đúng chữ Hán
    if (user === cleanWord) return true;

    // b. Gõ đúng âm On (hỗ trợ cả Katakana và Hiragana)
    if (q.onyomi && q.onyomi !== '-') {
      const onParts = q.onyomi.split(/[,、\s/]+/).map(s => s.trim().replace(/[・\s\-[\]()（）「」~～]/g, ''));
      for (const on of onParts) {
        if (!on) continue;
        if (user === on || user === katakanaToHiragana(on)) return true;
      }
    }

    // c. Gõ đúng âm Kun
    if (q.kunyomi && q.kunyomi !== '-') {
      const kunParts = q.kunyomi.split(/[,、\s/]+/).map(s => s.trim().replace(/[・\s\-[\]()（）「」~～.]/g, ''));
      for (const kun of kunParts) {
        if (!kun) continue;
        if (user === kun) return true;
      }
    }

    // d. Gõ đúng âm Hán Việt
    if (q.sinoVietnamese) {
      const sinoClean = q.sinoVietnamese.toLowerCase().replace(/[^a-zà-ỹ0-9]/gi, '');
      const userClean = user.toLowerCase().replace(/[^a-zà-ỹ0-9]/gi, '');
      if (userClean && userClean === sinoClean) return true;
    }

    // e. Khớp reading chung
    if (cleanReading && (user === cleanReading || user === katakanaToHiragana(cleanReading))) {
      return true;
    }

    return false;
  }

  // 2. Nếu đang làm Test Từ vựng
  if (isPureKatakana(cleanWord)) {
    return user === cleanWord;
  }

  if (user === cleanReading || user === cleanWord) {
    return true;
  }

  return false;
}

/**
 * Cập nhật cấu hình bảng Setup Test (hỗ trợ cả Từ vựng và Hán tự)
 */
function initPracticeSetup(target = null) {
  if (target) {
    state.practiceTarget = target;
  } else if (!state.practiceTarget) {
    state.practiceTarget = 'vocab';
  }

  const isKanji = (state.practiceTarget === 'kanji');
  const sourceList = isKanji ? state.currentKanjiList : state.currentVocabList;
  const total = sourceList.length;

  const titleEl = document.getElementById('practice-setup-title');
  const descEl = document.getElementById('practice-setup-desc');
  const badgeTotal = document.getElementById('practice-badge-total');
  const rangeFrom = document.getElementById('practice-range-from');
  const rangeTo = document.getElementById('practice-range-to');
  const rangeCount = document.getElementById('practice-range-count');
  const btnRangeAll = document.getElementById('btn-practice-range-all');

  if (titleEl) {
    titleEl.textContent = isKanji ? 'Luyện Test Hán tự & Phản xạ cách đọc' : 'Luyện gõ từ vựng & Kiểm tra';
  }
  if (descEl) {
    descEl.textContent = isKanji 
      ? 'Đánh máy âm On/Kun hoặc chữ Hán giúp ghi nhớ sâu cách đọc và ý nghĩa'
      : 'Đánh máy tiếng Nhật giúp ghi nhớ phản xạ Hiragana, Katakana & Hán tự';
  }
  if (badgeTotal) {
    badgeTotal.textContent = isKanji ? `${total} chữ Hán` : `${total} từ`;
  }

  if (rangeFrom) {
    rangeFrom.min = 1;
    rangeFrom.max = Math.max(1, total);
    rangeFrom.value = 1;
  }
  if (rangeTo) {
    rangeTo.min = 1;
    rangeTo.max = Math.max(1, total);
    rangeTo.value = Math.max(1, total);
  }

  function updateCount() {
    let a = parseInt(rangeFrom.value) || 1;
    let b = parseInt(rangeTo.value) || total;
    if (a < 1) a = 1;
    if (a > total && total > 0) a = total;
    if (b < a) b = a;
    if (b > total && total > 0) b = total;
    rangeFrom.value = a;
    rangeTo.value = b;
    state.practice.rangeA = a;
    state.practice.rangeB = b;
    const count = total > 0 ? Math.max(0, b - a + 1) : 0;
    if (rangeCount) rangeCount.textContent = `${count} câu`;
  }

  if (rangeFrom) rangeFrom.onchange = updateCount;
  if (rangeTo) rangeTo.onchange = updateCount;

  if (btnRangeAll) {
    btnRangeAll.onclick = () => {
      if (rangeFrom) rangeFrom.value = 1;
      if (rangeTo) rangeTo.value = Math.max(1, total);
      updateCount();
    };
  }

  updateCount();
}

/**
 * Hiển thị giao diện Practice View
 */
function renderPracticeView() {
  const setupPanel = document.getElementById('practice-setup-panel');
  const arena = document.getElementById('practice-arena');
  const summary = document.getElementById('practice-summary');

  if (setupPanel && arena && summary) {
    if (arena.classList.contains('hidden') && summary.classList.contains('hidden')) {
      setupPanel.classList.remove('hidden');
      initPracticeSetup(state.practiceTarget || 'vocab');
    }
  }
}

/**
 * Bắt đầu làm bài Test (Tự động thích ứng Từ vựng hoặc Hán tự)
 */
function startPracticeTest() {
  const isKanji = (state.practiceTarget === 'kanji');
  const rawList = isKanji ? state.currentKanjiList : state.currentVocabList;
  const total = rawList.length;

  if (total === 0) {
    showToast(isKanji ? 'Bài học này chưa có Hán tự để làm test!' : 'Bài học này chưa có từ vựng để luyện tập!', 'warning');
    return;
  }

  let a = state.practice.rangeA;
  let b = state.practice.rangeB;
  if (a < 1) a = 1;
  if (b > total) b = total;
  if (a > b) a = b;

  let sourceItems = [];
  if (isKanji) {
    sourceItems = rawList.map(k => {
      const compounds = getKanjiDisplayCompounds(k);
      let exText = '';
      if (compounds.length > 0) {
        exText = compounds.map(c => `${c.compound} (${c.reading}): ${c.meaning}`).join('  |  ');
      }
      return {
        word: k.character,
        reading: (k.kunyomi || k.onyomi || '').replace(/[.-]/g, '').trim(),
        onyomi: k.onyomi || '',
        kunyomi: k.kunyomi || '',
        meaning: k.meaning,
        sinoVietnamese: k.meaning.split(/[(（]/)[0].trim(),
        example: exText,
        strokes: k.strokes
      };
    });
  } else {
    sourceItems = [...rawList];
  }

  let slice = sourceItems.slice(a - 1, b);
  if (slice.length === 0) {
    showToast('Phạm vi câu hỏi không hợp lệ!', 'warning');
    return;
  }

  if (state.practice.isShuffled) {
    slice = [...slice].sort(() => Math.random() - 0.5);
  }

  state.practice.questions = slice;
  state.practice.currentIndex = 0;
  state.practice.scoreCorrect = 0;
  state.practice.scoreWrong = 0;
  state.practice.wrongList = [];
  state.practice.isAnswered = false;

  document.getElementById('practice-setup-panel').classList.add('hidden');
  document.getElementById('practice-summary').classList.add('hidden');
  document.getElementById('practice-arena').classList.remove('hidden');

  renderPracticeQuestion();
}

/**
 * Hiển thị câu hỏi hiện tại trong Arena
 */
function renderPracticeQuestion() {
  const p = state.practice;
  if (p.currentIndex >= p.questions.length) {
    showPracticeSummary();
    return;
  }

  const q = p.questions[p.currentIndex];
  p.isAnswered = false;

  // Hủy các timer trước đó
  if (p.autoNextTimer) clearTimeout(p.autoNextTimer);
  if (p.countdownInterval) clearInterval(p.countdownInterval);

  // Cập nhật Top bar
  document.getElementById('arena-current-idx').textContent = p.currentIndex + 1;
  document.getElementById('arena-total-count').textContent = p.questions.length;
  document.getElementById('arena-score-correct').textContent = p.scoreCorrect;
  document.getElementById('arena-score-wrong').textContent = p.scoreWrong;

  const pct = ((p.currentIndex) / p.questions.length) * 100;
  document.getElementById('arena-progress-bar').style.width = `${pct}%`;

  // Reset Arena Card
  const arenaCard = document.getElementById('arena-card');
  arenaCard.classList.remove('shake-error');
  document.getElementById('arena-feedback').classList.add('hidden');

  // Input Box Reset
  const inputEl = document.getElementById('arena-typing-input');
  const btnClear = document.getElementById('btn-arena-clear-input');
  const revealedWordEl = document.getElementById('arena-revealed-word');
  if (revealedWordEl) {
    revealedWordEl.textContent = '';
    revealedWordEl.classList.remove('pop-success');
  }
  inputEl.value = '';
  inputEl.disabled = false;
  inputEl.className = 'practice-typing-input w-full px-5 py-3.5 text-xl sm:text-2xl font-jp text-center bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl border-2 border-slate-200 dark:border-slate-700 focus:outline-none focus:border-brand-500 transition duration-200 font-medium';
  if (btnClear) btnClear.classList.add('hidden');
  setTimeout(() => inputEl.focus(), 60);

  // Xử lý chế độ hiển thị Đề bài
  const promptModeA = document.getElementById('arena-prompt-mode-a');
  const promptModeB = document.getElementById('arena-prompt-mode-b');

  if (p.mode === 'prompt-word') {
    // Mode A: Nhìn từ vựng (Hira/Kata/Kanji) ➔ Gõ cách đọc
    promptModeA.classList.remove('hidden');
    promptModeB.classList.add('hidden');

    document.getElementById('arena-word-display').textContent = q.word;

    const sinoEl = document.getElementById('arena-sino-display');
    if (q.sinoVietnamese) {
      sinoEl.textContent = q.sinoVietnamese;
      sinoEl.classList.remove('hidden');
    } else {
      sinoEl.classList.add('hidden');
    }

    inputEl.placeholder = 'Gõ cách đọc Hiragana rồi nhấn Enter...';
  } else {
    // Mode B: Nhìn nghĩa tiếng Việt ➔ Gõ cách đọc / từ vựng
    // ƯU TIÊN NGHĨA TIẾNG VIỆT Ở TRÊN VÀ TO HƠN
    promptModeA.classList.add('hidden');
    promptModeB.classList.remove('hidden');

    document.getElementById('arena-meaning-display').textContent = q.meaning;
    inputEl.placeholder = 'Gõ cách đọc hoặc từ vựng rồi nhấn Enter...';
  }

  // Âm thanh phát âm
  const btnSpeak = document.getElementById('btn-arena-speak');
  if (btnSpeak) {
    btnSpeak.onclick = () => speakJapanese(q.word);
  }

  lucide.createIcons();
}

/**
 * Kiểm tra câu trả lời của người dùng
 */
function submitPracticeAnswer(isSkipped = false) {
  const p = state.practice;
  if (p.isAnswered) {
    // Nếu đang trong thời gian chờ n giây -> nhấn Enter để chuyển ngay tức thì
    nextPracticeQuestion();
    return;
  }

  const q = p.questions[p.currentIndex];
  const inputEl = document.getElementById('arena-typing-input');
  const userText = inputEl.value.trim();

  const isCorrect = !isSkipped && checkPracticeAnswerMatch(userText, q);

  if (!isCorrect && !isSkipped) {
    // Trả lời sai
    const arenaCard = document.getElementById('arena-card');
    arenaCard.classList.remove('shake-error');
    void arenaCard.offsetWidth; // trigger reflow
    arenaCard.classList.add('shake-error');

    inputEl.classList.add('border-rose-500', 'bg-rose-50/50', 'dark:bg-rose-950/20');
    setTimeout(() => {
      inputEl.classList.remove('border-rose-500', 'bg-rose-50/50', 'dark:bg-rose-950/20');
    }, 600);

    inputEl.select();
    showToast('Chưa chính xác! Hãy thử lại hoặc bấm "Xem đáp án"', 'warning');
    return;
  }

  // Đã trả lời đúng hoặc chọn Xem đáp án (Bỏ qua)
  p.isAnswered = true;
  inputEl.disabled = true;

  const revealedWordEl = document.getElementById('arena-revealed-word');

  if (isCorrect) {
    p.scoreCorrect++;
    speakJapanese(q.word);

    // Khi đúng: Khung và chữ ở khung chuyển sang màu xanh lá
    inputEl.className = 'practice-typing-input w-full px-5 py-3.5 text-xl sm:text-2xl font-jp text-center bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-2xl border-2 border-emerald-500 focus:outline-none transition duration-200 font-bold';

    // Hiển thị từ vựng gốc trong danh sách (hira, kanji, kata kèm cách đọc) ngay dưới nghĩa tiếng Việt
    if (revealedWordEl) {
      let disp = q.word;
      if (q.reading && q.reading !== q.word) {
        disp += ` (${q.reading})`;
      }
      if (q.sinoVietnamese) {
        disp += ` [${q.sinoVietnamese}]`;
      }
      revealedWordEl.textContent = disp;
      revealedWordEl.className = 'font-jp text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400 min-h-[36px] transition-all duration-300 pop-success';
    }
  } else {
    p.scoreWrong++;
    p.wrongList.push(q);

    // Khi bỏ qua / xem đáp án
    inputEl.className = 'practice-typing-input w-full px-5 py-3.5 text-xl sm:text-2xl font-jp text-center bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-2xl border-2 border-rose-300 dark:border-rose-700 focus:outline-none font-medium';
    
    if (revealedWordEl) {
      let disp = q.word;
      if (q.reading && q.reading !== q.word) {
        disp += ` (${q.reading})`;
      }
      revealedWordEl.textContent = disp;
      revealedWordEl.className = 'font-jp text-2xl sm:text-3xl font-bold text-rose-500 dark:text-rose-400 min-h-[36px] transition-all duration-300 pop-success';
    }
  }

  // Cập nhật điểm
  document.getElementById('arena-score-correct').textContent = p.scoreCorrect;
  document.getElementById('arena-score-wrong').textContent = p.scoreWrong;

  // Hiển thị Feedback
  const feedbackEl = document.getElementById('arena-feedback');
  const statusText = document.getElementById('arena-feedback-status');
  const statusIcon = document.getElementById('arena-feedback-icon');

  feedbackEl.classList.remove('hidden');

  if (isCorrect) {
    feedbackEl.className = 'p-5 rounded-2xl text-left border border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/30 transition-all duration-300 pop-success';
    statusText.textContent = 'Chính xác! Rất tuyệt vời!';
    statusText.className = 'font-bold text-sm text-emerald-600 dark:text-emerald-400';
    statusIcon.className = 'w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs bg-emerald-500 text-white';
    statusIcon.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i>';
  } else {
    feedbackEl.className = 'p-5 rounded-2xl text-left border border-rose-200 dark:border-rose-800 bg-rose-50/60 dark:bg-rose-950/30 transition-all duration-300 pop-success';
    statusText.textContent = `Đáp án đúng: ${q.word} (${q.reading})`;
    statusText.className = 'font-bold text-sm text-rose-600 dark:text-rose-400';
    statusIcon.className = 'w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs bg-rose-500 text-white';
    statusIcon.innerHTML = '<i data-lucide="info" class="w-4 h-4"></i>';
  }

  // Điền thông tin chi tiết: Có cả Hira/Kanji/Kata và nghĩa tiếng Việt
  document.getElementById('feedback-word').textContent = q.word;
  document.getElementById('feedback-reading').textContent = q.reading ? `(${q.reading})` : '';
  document.getElementById('feedback-meaning').textContent = q.meaning;

  // Hiển thị câu ví dụ
  const exBox = document.getElementById('feedback-example-box');
  if (q.example) {
    exBox.classList.remove('hidden');
    const match = q.example.match(/^(.*?)\s*[(（](.*?)[)）]$/);
    if (match) {
      document.getElementById('feedback-example-ja').textContent = match[1].trim();
      document.getElementById('feedback-example-vi').textContent = match[2].trim();
    } else {
      document.getElementById('feedback-example-ja').textContent = q.example;
      document.getElementById('feedback-example-vi').textContent = '';
    }
    document.getElementById('btn-feedback-speak-ex').onclick = () => {
      const matchJa = q.example.replace(/[(（].*?[)）]/g, '').trim();
      speakJapanese(matchJa);
    };
  } else {
    exBox.classList.add('hidden');
  }

  lucide.createIcons();

  // Xử lý n giây tự động chuyển câu tiếp theo
  const delaySec = p.delaySeconds;
  const countdownContainer = document.getElementById('arena-countdown-container');
  const countdownSec = document.getElementById('arena-countdown-sec');

  if (delaySec <= 0) {
    // n = 0 giây: Chuyển câu tiếp theo ngay tức thì!
    countdownContainer.classList.add('hidden');
    nextPracticeQuestion();
    return;
  }

  countdownContainer.classList.remove('hidden');
  let remainMs = Math.round(delaySec * 1000);
  countdownSec.textContent = (remainMs / 1000).toFixed(1);

  p.countdownInterval = setInterval(() => {
    remainMs -= 100;
    if (remainMs <= 0) {
      clearInterval(p.countdownInterval);
      countdownSec.textContent = '0.0';
    } else {
      countdownSec.textContent = (remainMs / 1000).toFixed(1);
    }
  }, 100);

  p.autoNextTimer = setTimeout(() => {
    clearInterval(p.countdownInterval);
    nextPracticeQuestion();
  }, delaySec * 1000);
}

/**
 * Chuyển sang câu hỏi tiếp theo
 */
function nextPracticeQuestion() {
  const p = state.practice;
  if (p.autoNextTimer) clearTimeout(p.autoNextTimer);
  if (p.countdownInterval) clearInterval(p.countdownInterval);

  p.currentIndex++;
  if (p.currentIndex < p.questions.length) {
    renderPracticeQuestion();
  } else {
    showPracticeSummary();
  }
}

/**
 * Hiển thị màn hình Tổng kết sau khi hoàn thành dải từ
 */
function showPracticeSummary() {
  const p = state.practice;
  document.getElementById('practice-arena').classList.add('hidden');
  document.getElementById('practice-setup-panel').classList.add('hidden');
  document.getElementById('practice-summary').classList.remove('hidden');

  const total = p.questions.length;
  const correct = p.scoreCorrect;
  const wrong = p.scoreWrong;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  document.getElementById('summary-correct-count').textContent = correct;
  document.getElementById('summary-wrong-count').textContent = wrong;
  document.getElementById('summary-percent').textContent = `${pct}%`;

  const wrongListContainer = document.getElementById('summary-wrong-list-container');
  const wrongListEl = document.getElementById('summary-wrong-list');
  const btnRetryWrong = document.getElementById('btn-summary-retry-wrong');
  const countRetrySpan = document.getElementById('summary-retry-wrong-count');

  if (wrong > 0 && p.wrongList.length > 0) {
    wrongListContainer.classList.remove('hidden');
    wrongListEl.innerHTML = p.wrongList.map(it => `
      <div class="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 border border-rose-100 dark:border-rose-900/40">
        <div class="flex items-baseline gap-2">
          <span class="font-jp font-bold text-slate-900 dark:text-white">${it.word}</span>
          <span class="font-jp text-slate-500 dark:text-slate-400 text-[11px]">${it.reading || ''}</span>
        </div>
        <span class="text-slate-600 dark:text-slate-300 font-medium text-[11px]">${it.meaning}</span>
      </div>
    `).join('');

    if (btnRetryWrong) {
      btnRetryWrong.classList.remove('hidden');
      if (countRetrySpan) countRetrySpan.textContent = p.wrongList.length;
      btnRetryWrong.onclick = () => {
        // Chỉ nạp đúng danh sách các câu sai để luyện lại
        state.practice.questions = [...state.practice.wrongList];
        state.practice.currentIndex = 0;
        state.practice.scoreCorrect = 0;
        state.practice.scoreWrong = 0;
        state.practice.wrongList = [];
        state.practice.isAnswered = false;

        document.getElementById('practice-summary').classList.add('hidden');
        document.getElementById('practice-arena').classList.remove('hidden');
        renderPracticeQuestion();
      };
    }
  } else {
    wrongListContainer.classList.add('hidden');
    if (btnRetryWrong) btnRetryWrong.classList.add('hidden');
  }

  // Nút làm lại toàn bộ bài ban đầu
  const btnRestart = document.getElementById('btn-summary-restart');
  if (btnRestart) {
    btnRestart.onclick = () => {
      startPracticeTest();
    };
  }

  lucide.createIcons();
}

/**
 * Thoát màn hình làm bài quay về bảng cài đặt
 */
function quitPracticeArena() {
  const p = state.practice;
  if (p.autoNextTimer) clearTimeout(p.autoNextTimer);
  if (p.countdownInterval) clearInterval(p.countdownInterval);

  document.getElementById('practice-arena').classList.add('hidden');
  document.getElementById('practice-summary').classList.add('hidden');
  document.getElementById('practice-setup-panel').classList.remove('hidden');
  initPracticeSetup();
}

// ====================================================================
// MODULE: GRAMMAR MASTERY HUB (ĐẤU TRƯỜNG NGỮ PHÁP 2 CHIỀU CHUYÊN BIỆT)
// ====================================================================

/**
 * Khởi tạo Module Ngữ pháp khi mở tab
 */
async function initGrammarModule() {
  if (!state.grammar.manifest) {
    try {
      const res = await fetch('data/grammar/grammar-manifest.json');
      if (res.ok) {
        state.grammar.manifest = await res.json();
        const badgeEl = document.getElementById('tab-grammar-badge');
        if (badgeEl && state.grammar.manifest.items) {
          badgeEl.textContent = state.grammar.manifest.items.length;
        }
      }
    } catch (err) {
      console.warn('Lỗi tải grammar manifest:', err.message);
    }
  }

  // Luôn hiển thị Catalog nếu không trong phiên làm bài
  const arena = document.getElementById('grammar-arena');
  const summary = document.getElementById('grammar-summary');
  const catalog = document.getElementById('grammar-catalog');

  if (arena && summary && catalog) {
    if (arena.classList.contains('hidden') && summary.classList.contains('hidden')) {
      catalog.classList.remove('hidden');
      renderGrammarCatalog();
    }
  }

  setupGrammarListeners();
}

/**
 * Hiển thị danh sách các mẫu ngữ pháp theo bài học đang chọn (ÔN TẬP NHANH & ÔN TẬP TỔNG HỢP)
 */
function renderGrammarCatalog() {
  const container = document.getElementById('grammar-cards-grid');
  const comprehensiveContainer = document.getElementById('grammar-comprehensive-grid');
  const totalCountEl = document.getElementById('grammar-total-count');
  const activeUnitNameEl = document.getElementById('grammar-active-unit-name');
  const compBadgeEl = document.getElementById('grammar-comprehensive-badge');

  const manifest = state.grammarManifest || state.grammar.manifest;
  if (!manifest) return;

  const units = manifest.units || [];
  const currentFilter = state.grammar.currentLevelFilter || 'all';

  // Xác định bài học đang chọn (mặc định lấy bài đầu tiên của cấp độ lọc hoặc bài đầu tiên của hệ thống)
  let activeUnit = state.grammar.activeUnit;
  if (!activeUnit || (currentFilter !== 'all' && activeUnit.level !== currentFilter)) {
    if (currentFilter !== 'all') {
      activeUnit = units.find(u => u.level === currentFilter) || units[0];
    } else {
      activeUnit = units[0];
    }
    state.grammar.activeUnit = activeUnit;
  }

  // Cập nhật tên bài học đang chọn và breadcrumb
  if (activeUnit) {
    if (activeUnitNameEl) {
      activeUnitNameEl.textContent = `${activeUnit.level} - ${activeUnit.title}`;
    }
    const breadcrumbUnit = document.getElementById('breadcrumb-unit');
    const breadcrumbCurr = document.getElementById('breadcrumb-curriculum');
    if (breadcrumbUnit) breadcrumbUnit.textContent = activeUnit.title;
    if (breadcrumbCurr) breadcrumbCurr.textContent = `JLPT ${activeUnit.level}`;
  }

  // Lọc các mẫu ngữ pháp thuộc bài học đang chọn
  const allItems = manifest.items || [];
  const unitItems = activeUnit 
    ? allItems.filter(item => item.unitId === activeUnit.id || (activeUnit.grammarIds && activeUnit.grammarIds.includes(item.id)))
    : allItems;

  if (totalCountEl) totalCountEl.textContent = unitItems.length;
  if (compBadgeEl) {
    compBadgeEl.textContent = `3 Bộ đề (${unitItems.length * 5} câu/đề)`;
  }

  // 1. RENDER MỤC 1: ÔN TẬP NHANH (Luyện riêng từng mẫu 5 câu)
  if (container) {
    if (unitItems.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-12 text-center text-xs text-slate-400">
          Chưa có mẫu ngữ pháp nào cho bài học này.
        </div>
      `;
    } else {
      container.innerHTML = unitItems.map(item => {
        let badgeColor = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200';
        if (item.level === 'N5') {
          badgeColor = 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200';
        } else if (item.level === 'N3') {
          badgeColor = 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-200';
        }

        return `
          <div class="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 hover:border-purple-400 dark:hover:border-purple-500 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between group">
            <div>
              <div class="flex items-center justify-between gap-2 mb-2">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${badgeColor}">
                  ${item.level}
                </span>
                <span class="text-[11px] text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1">
                  <i data-lucide="layers" class="w-3.5 h-3.5"></i>
                  ${item.questionsCount || 5} câu 2 chiều
                </span>
              </div>

              <h3 class="font-jp text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition mb-1">
                ${item.title}
              </h3>

              <p class="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                ${item.meaning}
              </p>

              <div class="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 font-mono text-[11px] text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800/60 mb-3">
                ${item.connection}
              </div>
            </div>

            <button 
              type="button" 
              class="btn-start-grammar-quiz w-full py-2.5 px-4 rounded-xl bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white dark:bg-purple-950/40 dark:hover:bg-purple-600 dark:text-purple-300 dark:hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
              data-grammar-id="${item.id}"
            >
              <i data-lucide="zap" class="w-4 h-4 text-purple-600 group-hover:text-white"></i>
              Luyện bộ đề 5 câu
            </button>
          </div>
        `;
      }).join('');

      // Gắn sự kiện click bắt đầu làm bài ôn tập nhanh
      container.querySelectorAll('.btn-start-grammar-quiz').forEach(btn => {
        btn.onclick = () => {
          const gId = btn.getAttribute('data-grammar-id');
          startGrammarQuiz(gId);
        };
      });
    }
  }

  // 2. RENDER MỤC 2: ÔN TẬP TỔNG HỢP (3 Bộ đề thi trắc nghiệm cả bài, số câu = số mẫu * 5)
  if (comprehensiveContainer && activeUnit) {
    const totalQuestions = unitItems.length * 5;
    const examTitles = [
      { name: 'Bộ đề tổng hợp 01', tag: 'Đề chuẩn JLPT', desc: 'Rèn luyện phản xạ nhận diện ý nghĩa và chọn ngữ pháp toàn diện' },
      { name: 'Bộ đề tổng hợp 02', tag: 'Tăng cường ứng dụng', desc: 'Tình huống đời sống và các câu phân biệt ngữ pháp tương đương' },
      { name: 'Bộ đề tổng hợp 03', tag: 'Thực chiến nâng cao', desc: 'Kiểm tra tốc độ phản xạ và loại trừ bẫy ngữ pháp thường gặp' }
    ];

    comprehensiveContainer.innerHTML = examTitles.map((ex, idx) => `
      <div class="p-5 rounded-2xl bg-gradient-to-br from-white to-purple-50/30 dark:from-slate-800 dark:to-slate-800/90 border-2 border-indigo-200/80 dark:border-indigo-900/60 hover:border-indigo-500 dark:hover:border-indigo-400 shadow-sm hover:shadow-lg transition duration-200 flex flex-col justify-between group">
        <div>
          <div class="flex items-center justify-between gap-2 mb-2">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200/60">
              ${ex.tag}
            </span>
            <span class="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1 font-mono">
              <i data-lucide="shuffle" class="w-3.5 h-3.5"></i>
              ${totalQuestions} câu xáo trộn
            </span>
          </div>

          <h3 class="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition mb-1 flex items-center gap-2">
            <i data-lucide="file-check-2" class="w-4 h-4 text-indigo-500"></i>
            ${ex.name}
          </h3>

          <p class="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
            ${ex.desc}
          </p>

          <div class="space-y-1 p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 mb-4">
            <div class="flex items-center justify-between">
              <span>Phạm vi:</span>
              <span class="font-bold text-slate-700 dark:text-slate-200">${activeUnit.title} (${unitItems.length} mẫu)</span>
            </div>
            <div class="flex items-center justify-between">
              <span>Cơ cấu đề:</span>
              <span class="font-bold text-indigo-600 dark:text-indigo-400">1 ngữ pháp × 5 câu = ${totalQuestions} câu</span>
            </div>
          </div>
        </div>

        <button 
          type="button" 
          class="btn-start-comprehensive-quiz w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20 transition transform active:scale-[0.99]"
          data-unit-id="${activeUnit.id}"
          data-exam-idx="${idx}"
        >
          <i data-lucide="play" class="w-4 h-4 fill-current"></i>
          Bắt đầu thi đề ${idx + 1} (${totalQuestions} câu)
        </button>
      </div>
    `).join('');

    // Gắn sự kiện click thi bộ đề tổng hợp
    comprehensiveContainer.querySelectorAll('.btn-start-comprehensive-quiz').forEach(btn => {
      btn.onclick = () => {
        const uId = btn.getAttribute('data-unit-id');
        const eIdx = parseInt(btn.getAttribute('data-exam-idx'), 10);
        startGrammarComprehensiveQuiz(uId, eIdx);
      };
    });
  }

  lucide.createIcons();
}

/**
 * Bắt đầu làm bài thi bộ đề ôn tập tổng hợp cho toàn bộ ngữ pháp của bài học
 * Số câu = số mẫu ngữ pháp * 5 câu, xáo trộn câu hỏi ngẫu nhiên
 */
async function startGrammarComprehensiveQuiz(unitId, examIndex = 0) {
  try {
    const manifest = state.grammarManifest || state.grammar.manifest;
    if (!manifest) throw new Error('Chưa tải được danh mục ngữ pháp');

    const unit = (manifest.units || []).find(u => u.id === unitId) || state.grammar.activeUnit;
    if (!unit) throw new Error('Không tìm thấy thông tin bài học');

    const grammarIds = unit.grammarIds || [];
    if (grammarIds.length === 0) throw new Error('Bài học này chưa có mẫu ngữ pháp');

    showToast(`Đang tải dữ liệu bộ đề tổng hợp #${examIndex + 1}...`, 'info');

    // Tải song song toàn bộ file JSON của các mẫu ngữ pháp trong bài
    const responses = await Promise.all(
      grammarIds.map(id => fetch(`data/grammar/${id}.json`).then(r => {
        if (!r.ok) throw new Error(`Không thể tải mẫu ngữ pháp ${id}`);
        return r.json();
      }))
    );

    // Lấy 5 câu hỏi từ mỗi mẫu ngữ pháp
    let aggregatedQuestions = [];
    responses.forEach(data => {
      const qList = (data.questions && data.questions.length > 0) ? [...data.questions] : [];
      // Lấy 5 câu của mẫu này
      const sample = qList.slice(0, 5);
      aggregatedQuestions.push(...sample);
    });

    if (aggregatedQuestions.length === 0) {
      throw new Error('Chưa có câu hỏi cho bài học này');
    }

    // Xáo trộn ngẫu nhiên toàn bộ câu hỏi (Fisher-Yates Shuffle)
    for (let i = aggregatedQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [aggregatedQuestions[i], aggregatedQuestions[j]] = [aggregatedQuestions[j], aggregatedQuestions[i]];
    }

    const g = state.grammar;
    g.activeGrammar = {
      id: `comp-${unit.id}-${examIndex + 1}`,
      isComprehensive: true,
      unitId: unit.id,
      examIndex: examIndex,
      title: `${unit.title} - Đề tổng hợp #${examIndex + 1}`,
      connection: `Tổng hợp toàn bộ ${grammarIds.length} mẫu ngữ pháp (${unit.level})`,
      level: unit.level,
      questions: aggregatedQuestions
    };
    g.questions = aggregatedQuestions;
    g.currentIndex = 0;
    g.scoreCorrect = 0;
    g.scoreWrong = 0;
    g.wrongList = [];
    g.isAnswered = false;
    g.isHintVisible = false;

    // Chuyển sang giao diện Grammar Arena
    document.getElementById('grammar-catalog').classList.add('hidden');
    document.getElementById('grammar-summary').classList.add('hidden');
    document.getElementById('grammar-arena').classList.remove('hidden');

    // Cập nhật Top bar Arena
    document.getElementById('grammar-arena-title').textContent = `${unit.title} - Đề tổng hợp #${examIndex + 1}`;
    document.getElementById('grammar-arena-connection').textContent = `Tổng hợp ${grammarIds.length} mẫu ngữ pháp • ${aggregatedQuestions.length} câu trắc nghiệm`;
    document.getElementById('grammar-arena-badge-level').textContent = unit.level || 'N4';

    renderGrammarQuestion();
  } catch (err) {
    showToast(`Lỗi: ${err.message}`, 'error');
  }
}

/**
 * Bắt đầu làm bài test 5 câu cho một mẫu ngữ pháp riêng lẻ (ÔN TẬP NHANH)
 */
async function startGrammarQuiz(grammarId) {
  try {
    const res = await fetch(`data/grammar/${grammarId}.json`);
    if (!res.ok) throw new Error('Không thể tải bài tập ngữ pháp');
    const data = await res.json();

    const g = state.grammar;
    g.activeGrammar = data;
    g.questions = data.questions || [];
    g.currentIndex = 0;
    g.scoreCorrect = 0;
    g.scoreWrong = 0;
    g.wrongList = [];
    g.isAnswered = false;
    g.isHintVisible = false;

    // Chuyển giao diện
    document.getElementById('grammar-catalog').classList.add('hidden');
    document.getElementById('grammar-summary').classList.add('hidden');
    document.getElementById('grammar-arena').classList.remove('hidden');

    // Cập nhật Top bar
    document.getElementById('grammar-arena-title').textContent = data.title;
    document.getElementById('grammar-arena-connection').textContent = data.connection || '';
    document.getElementById('grammar-arena-badge-level').textContent = data.level || 'N4';

    renderGrammarQuestion();
  } catch (err) {
    showToast(`Lỗi: ${err.message}`, 'error');
  }
}

/**
 * Hiển thị câu hỏi hiện tại trong Grammar Arena
 */
function renderGrammarQuestion() {
  const g = state.grammar;
  if (g.currentIndex >= g.questions.length) {
    showGrammarSummary();
    return;
  }

  const q = g.questions[g.currentIndex];
  g.isAnswered = false;
  g.isHintVisible = false;

  // Cập nhật chỉ số câu & điểm số
  document.getElementById('grammar-current-idx').textContent = g.currentIndex + 1;
  document.getElementById('grammar-total-questions').textContent = g.questions.length;
  document.getElementById('grammar-score-correct').textContent = g.scoreCorrect;
  document.getElementById('grammar-score-wrong').textContent = g.scoreWrong;

  const pct = (g.currentIndex / g.questions.length) * 100;
  document.getElementById('grammar-progress-bar').style.width = `${pct}%`;

  // Badge dạng câu hỏi (3 dạng tương tác thực chiến)
  const typeBadge = document.getElementById('grammar-q-type-badge');
  if (q.type === 'grammar-to-meaning') {
    typeBadge.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60';
    typeBadge.innerHTML = '<i data-lucide="compass" class="w-3.5 h-3.5"></i> Chiều 1: Ngữ pháp tiếng Nhật ➔ Chọn nghĩa';
  } else if (q.type === 'situation-to-grammar') {
    typeBadge.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60';
    typeBadge.innerHTML = '<i data-lucide="map-pin" class="w-3.5 h-3.5"></i> Dạng 3: Tình huống đời sống ➔ Điền ngữ pháp';
  } else {
    typeBadge.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60';
    typeBadge.innerHTML = '<i data-lucide="sparkles" class="w-3.5 h-3.5"></i> Chiều 2: Nghĩa tiếng Việt ➔ Chọn Ngữ pháp';
  }

  // Câu tiếng Nhật
  document.getElementById('grammar-q-sentence-ja').textContent = q.sentenceJa;
  document.getElementById('btn-grammar-speak').onclick = () => speakJapanese(q.sentenceJa);

  // Câu dịch nghĩa gợi ý
  const hintBtn = document.getElementById('btn-grammar-toggle-hint');
  const hintBox = document.getElementById('grammar-q-sentence-vi');
  hintBox.textContent = q.sentenceVi;
  hintBox.classList.add('hidden');
  document.getElementById('grammar-hint-btn-text').textContent = 'Xem dịch nghĩa câu (Phím H)';

  hintBtn.onclick = toggleGrammarHint;

  // Lời nhắc
  document.getElementById('grammar-q-prompt').textContent = q.prompt || 'Chọn phương án phù hợp nhất:';

  // 4 phương án lựa chọn A, B, C, D
  const optionsContainer = document.getElementById('grammar-options-container');
  const optionLetters = ['A', 'B', 'C', 'D'];

  optionsContainer.innerHTML = (q.options || []).map((opt, idx) => `
    <button 
      type="button" 
      class="grammar-option-card w-full p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 text-left flex items-start gap-3 hover:border-purple-400 dark:hover:border-purple-500 transition"
      data-idx="${idx}"
    >
      <span class="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300 shrink-0">
        ${optionLetters[idx] || (idx + 1)}
      </span>
      <span class="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 flex-1 leading-snug">
        ${opt}
      </span>
    </button>
  `).join('');

  // Gắn sự kiện chọn đáp án
  optionsContainer.querySelectorAll('.grammar-option-card').forEach(card => {
    card.onclick = () => {
      const idx = parseInt(card.getAttribute('data-idx'), 10);
      selectGrammarOption(idx);
    };
  });

  // Reset feedback panel
  const feedbackPanel = document.getElementById('grammar-feedback-panel');
  feedbackPanel.classList.add('hidden');

  lucide.createIcons();
}

/**
 * Ẩn / Hiện dịch nghĩa câu hỏi gợi ý
 */
function toggleGrammarHint() {
  const g = state.grammar;
  g.isHintVisible = !g.isHintVisible;
  const hintBox = document.getElementById('grammar-q-sentence-vi');
  const hintBtnText = document.getElementById('grammar-hint-btn-text');

  if (g.isHintVisible) {
    hintBox.classList.remove('hidden');
    hintBtnText.textContent = 'Ẩn dịch nghĩa câu (Phím H)';
  } else {
    hintBox.classList.add('hidden');
    hintBtnText.textContent = 'Xem dịch nghĩa câu (Phím H)';
  }
}

/**
 * Chọn phương án đáp án trong câu hỏi ngữ pháp
 * Sau khi chọn:
 * - Đổi màu đáp án: Đúng màu xanh lá (correct), Sai màu đỏ (wrong)
 * - Hiện bản dịch nghĩa tiếng Việt của câu
 * - Hiện giải thích ngữ pháp chi tiết
 */
function selectGrammarOption(selectedIndex) {
  const g = state.grammar;
  if (g.isAnswered) return;

  g.isAnswered = true;
  const q = g.questions[g.currentIndex];
  const isCorrect = (selectedIndex === q.correctIndex);

  // Disable tất cả các nút đáp án và tô màu đáp án đúng/sai
  const cards = document.querySelectorAll('.grammar-option-card');
  cards.forEach((card, idx) => {
    card.disabled = true;
    card.style.pointerEvents = 'none';

    if (idx === q.correctIndex) {
      card.classList.add('correct');
    } else if (idx === selectedIndex && !isCorrect) {
      card.classList.add('wrong');
    }
  });

  const feedbackPanel = document.getElementById('grammar-feedback-panel');
  const statusIcon = document.getElementById('grammar-feedback-icon');
  const statusText = document.getElementById('grammar-feedback-status');
  const meaningText = document.getElementById('grammar-feedback-meaning');
  const explanationText = document.getElementById('grammar-feedback-explanation');

  feedbackPanel.classList.remove('hidden');

  if (isCorrect) {
    g.scoreCorrect++;
    speakJapanese(q.sentenceJa);

    feedbackPanel.className = 'p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/30 transition-all duration-300 pop-success space-y-3';
    statusIcon.className = 'w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs bg-emerald-500 text-white';
    statusIcon.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i>';
    statusText.textContent = 'Chính xác! Rất tuyệt vời!';
    statusText.className = 'font-bold text-sm text-emerald-600 dark:text-emerald-400';
  } else {
    g.scoreWrong++;
    g.wrongList.push({
      sentenceJa: q.sentenceJa,
      sentenceVi: q.sentenceVi,
      selected: q.options[selectedIndex],
      correct: q.options[q.correctIndex],
      explanation: q.explanation
    });

    feedbackPanel.className = 'p-5 rounded-2xl border border-rose-200 dark:border-rose-800 bg-rose-50/70 dark:bg-rose-950/30 transition-all duration-300 pop-success space-y-3';
    statusIcon.className = 'w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs bg-rose-500 text-white';
    statusIcon.innerHTML = '<i data-lucide="x" class="w-4 h-4"></i>';
    statusText.textContent = `Chưa chính xác! Đáp án đúng: ${q.options[q.correctIndex]}`;
    statusText.className = 'font-bold text-sm text-rose-600 dark:text-rose-400';
  }

  // 1. Hiển thị nghĩa dịch tiếng Việt của câu
  if (meaningText) {
    meaningText.textContent = q.sentenceVi || '―';
  }

  // 2. Hiển thị giải thích ngữ pháp chi tiết
  if (explanationText) {
    explanationText.textContent = q.explanation || 'Không có giải thích chi tiết.';
  }

  // Cập nhật điểm
  document.getElementById('grammar-score-correct').textContent = g.scoreCorrect;
  document.getElementById('grammar-score-wrong').textContent = g.scoreWrong;

  lucide.createIcons();
}

/**
 * Chuyển sang câu hỏi ngữ pháp tiếp theo
 */
function nextGrammarQuestion() {
  const g = state.grammar;
  g.currentIndex++;
  if (g.currentIndex < g.questions.length) {
    renderGrammarQuestion();
  } else {
    showGrammarSummary();
  }
}

/**
 * Hiển thị màn hình tổng kết bộ đề ngữ pháp
 */
function showGrammarSummary() {
  const g = state.grammar;
  document.getElementById('grammar-arena').classList.add('hidden');
  document.getElementById('grammar-summary').classList.remove('hidden');

  document.getElementById('grammar-summary-title').textContent = g.activeGrammar ? g.activeGrammar.title : '';
  document.getElementById('grammar-summary-correct').textContent = g.scoreCorrect;
  document.getElementById('grammar-summary-wrong').textContent = g.scoreWrong;

  const btnRetryWrong = document.getElementById('btn-grammar-retry-wrong');
  const countSpan = document.getElementById('grammar-retry-wrong-count');

  if (g.scoreWrong > 0 && g.wrongList.length > 0) {
    if (btnRetryWrong) {
      btnRetryWrong.classList.remove('hidden');
      if (countSpan) countSpan.textContent = g.wrongList.length;
      btnRetryWrong.onclick = () => {
        // Lấy danh sách câu hỏi gốc khớp với câu bị làm sai
        const retryQuestions = g.activeGrammar ? g.activeGrammar.questions.filter(q => 
          g.wrongList.some(w => w.sentenceJa === q.sentenceJa)
        ) : [];

        state.grammar.questions = retryQuestions.length > 0 ? retryQuestions : [...g.wrongList];
        state.grammar.currentIndex = 0;
        state.grammar.scoreCorrect = 0;
        state.grammar.scoreWrong = 0;
        state.grammar.wrongList = [];
        state.grammar.isAnswered = false;

        document.getElementById('grammar-summary').classList.add('hidden');
        document.getElementById('grammar-arena').classList.remove('hidden');
        renderGrammarQuestion();
      };
    }
  } else {
    if (btnRetryWrong) btnRetryWrong.classList.add('hidden');
  }

  lucide.createIcons();
}

/**
 * Thoát khỏi Grammar Arena quay về danh mục mẫu ngữ pháp
 */
function quitGrammarArena() {
  document.getElementById('grammar-arena').classList.add('hidden');
  document.getElementById('grammar-summary').classList.add('hidden');
  document.getElementById('grammar-catalog').classList.remove('hidden');
  renderGrammarCatalog();
}

/**
 * Thiết lập các sự kiện của Module Ngữ pháp
 */
function setupGrammarListeners() {
  // Level filter buttons
  document.querySelectorAll('.grammar-filter-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.grammar-filter-btn').forEach(b => {
        b.className = 'grammar-filter-btn px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900';
      });
      btn.className = 'grammar-filter-btn px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-sm font-semibold';
      state.grammar.currentLevelFilter = btn.getAttribute('data-level');
      renderGrammarCatalog();
    };
  });

  // Action Buttons
  const btnBack = document.getElementById('btn-grammar-arena-back');
  if (btnBack) btnBack.onclick = quitGrammarArena;

  const btnNext = document.getElementById('btn-grammar-next');
  if (btnNext) btnNext.onclick = nextGrammarQuestion;

  const btnRestart = document.getElementById('btn-grammar-summary-restart');
  if (btnRestart) {
    btnRestart.onclick = () => {
      if (state.grammar.activeGrammar) {
        if (state.grammar.activeGrammar.isComprehensive) {
          startGrammarComprehensiveQuiz(state.grammar.activeGrammar.unitId, state.grammar.activeGrammar.examIndex);
        } else {
          startGrammarQuiz(state.grammar.activeGrammar.id);
        }
      }
    };
  }

  const btnSummaryBack = document.getElementById('btn-grammar-summary-back');
  if (btnSummaryBack) btnSummaryBack.onclick = quitGrammarArena;

  // Keyboard shortcut trong Grammar Hub
  window.addEventListener('keydown', (e) => {
    if (state.currentTab !== 'grammar') return;

    const arena = document.getElementById('grammar-arena');
    if (!arena || arena.classList.contains('hidden')) return;

    // Phím H: Xem / Ẩn dịch nghĩa câu
    if (e.key === 'h' || e.key === 'H') {
      e.preventDefault();
      toggleGrammarHint();
    }

    // Phím 1, 2, 3, 4 hoặc A, B, C, D để chọn phương án
    if (!state.grammar.isAnswered) {
      const keyMap = { '1': 0, '2': 1, '3': 2, '4': 3, 'a': 0, 'b': 1, 'c': 2, 'd': 3, 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
      if (keyMap[e.key] !== undefined) {
        e.preventDefault();
        selectGrammarOption(keyMap[e.key]);
      }
    } else {
      // Khi đã trả lời: Phím Enter để chuyển sang câu tiếp theo
      if (e.key === 'Enter') {
        e.preventDefault();
        nextGrammarQuestion();
      }
    }
  });
}

// Khởi chạy ứng dụng
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  loadManifest();
});


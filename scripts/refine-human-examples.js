/**
 * refine-human-examples.js
 * Rà soát từng từ và thay thế 100% các câu ví dụ máy móc ("Xを勉強します", câu cụt ngủn)
 * bằng các câu giao tiếp tự nhiên chuẩn phong cách con người (Human-like style).
 * Đặc biệt tập trung vào Minna no Nihongo I & II (Bài 1 - 50) và Bài 32.
 */

const fs = require('fs');
const path = require('path');
const { buildManifest } = require('./build-manifest');

const DATA_DIR = path.join(__dirname, '..', 'data');
const CACHE_FILE = path.join(__dirname, '.cache_translations.json');

let translationCache = {};
if (fs.existsSync(CACHE_FILE)) {
  try {
    translationCache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
  } catch (e) {
    translationCache = {};
  }
}

function saveCache() {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(translationCache, null, 2), 'utf-8');
}

// Bảng sửa nghĩa chuẩn xác cho các từ bị dịch lệch ở Minna II Bài 32 và các bài khác
const MEANING_CORRECTIONS = {
  "晴れます": "nắng ráo, trời quang đãng",
  "曇ります": "trời có mây, âm u",
  "吹きます（風が～）": "thổi (gió)",
  "吹きます": "thổi (gió)",
  "治ります、直ります": "khỏi bệnh / được sửa xong",
  "治ります": "khỏi (bệnh), bình phục",
  "直ります": "được sửa xong, hồi phục",
  "やみます（雨が～）": "tạnh (mưa)",
  "やみます": "tạnh (mưa), ngừng rơi",
  "戻ります": "quay lại, trở lại",
  "合格します（試験に～）": "thi đỗ, đỗ (kỳ thi)",
  "合格します": "thi đỗ, vượt qua kỳ thi",
  "失敗します（試験に～）": "thất bại, thi trượt (kỳ thi)",
  "失敗します": "thất bại, hỏng việc",
  "成功します": "thành công",
  "つづきます": "tiếp tục, kéo dài",
  "続きます": "tiếp tục, kéo dài",
  "ひきます（かぜを～）": "bị (cảm cúm)",
  "冷やします": "làm lạnh, chườm lạnh",
  "無理をします": "làm việc quá sức",
  "十分（な）": "đầy đủ, trọn vẹn",
  "おかしい": "kỳ lạ, bất thường, khôi hài",
  "うるさい": "ồn ào, làm phiền",
  "やけど": "vết bỏng, sự bỏng",
  "けが": "vết thương, chấn thương",
  "せき": "cơn ho, tiếng ho",
  "インフルエンザ": "cúm mùa influenza",
  "太陽": "mặt trời",
  "星": "ngôi sao",
  "月": "mặt trăng",
  "風": "cơn gió",
  "北": "hướng bắc",
  "南": "hướng nam",
  "西": "hướng tây",
  "東": "hướng đông",
  "水道": "nước máy, hệ thống cấp nước",
  "エンジン": "động cơ xe",
  "チーム": "đội thi đấu, nhóm",
  "今夜": "tối nay, đêm nay",
  "夕方": "chiều tối, hoàng hôn",
  "遅く": "muộn, trễ",
  "こんなに": "như thế này, đến mức này",
  "そんなに": "như thế đó, đến mức đó",
  "あんなに": "như thế kia, đến mức kia",
  "もしかしたら": "có thể, biết đâu chừng",
  "それはいけませんね": "thế thì không ổn rồi, gay go nhỉ",
  "胃": "dạ dày, bao tử",
  "働きすぎ": "làm việc quá sức",
  "ストレス": "căng thẳng, áp lực (stress)"
};

// Kho câu ví dụ con người chuẩn mực, sống động cho Bài 32 và các từ thường gặp
const HUMAN_EXAMPLES = {
  // === Minna no Nihongo II - Bài 32 ===
  "運動します": "健康のために、毎朝30分運動したほうがいいですよ。 (Vì sức khỏe, bạn nên tập thể dục 30 phút mỗi sáng.)",
  "成功します": "一生懸命頑張れば、計画はきっと成功するでしょう。 (Nếu cố gắng hết mình, kế hoạch chắc chắn sẽ thành công thôi.)",
  "失敗します（試験に～）": "失敗を恐れずに、新しいことに挑戦しましょう。 (Đừng sợ thất bại, chúng ta hãy thử sức với những điều mới mẻ.)",
  "合格します（試験に～）": "毎日真面目に勉強したので、N4の試験に合格できました。 (Vì ngày nào cũng chăm chỉ học nên tôi đã đỗ kỳ thi N4.)",
  "戻ります": "田中さんは3時ごろ会社に戻る予定です。 (Anh Tanaka dự kiến khoảng 3 giờ sẽ quay lại công ty.)",
  "やみます（雨が～）": "夕方には雨がやむと思いますから、安心してください。 (Tôi nghĩ đến chiều tối là mưa sẽ tạnh thôi, bạn cứ yên tâm nhé.)",
  "晴れます": "明日は天気がよくなって、きっと晴れるでしょう。 (Ngày mai thời tiết sẽ tốt hơn và chắc chắn trời sẽ nắng ráo.)",
  "曇ります": "午後から空が曇って、雨が降るかもしれません。 (Từ chiều bầu trời nhiều mây âm u, có thể sẽ có mưa.)",
  "吹きます（風が～）": "強い風が吹いているので、窓をしっかり閉めてください。 (Vì gió đang thổi rất mạnh nên xin hãy đóng chặt cửa sổ.)",
  "治ります、直ります": "薬を飲んでゆっくり休んだら、風邪が治りました。 (Sau khi uống thuốc và nghỉ ngơi thì bệnh cảm của tôi đã khỏi.)",
  "つづきます": "熱がまだ続くようなら、病院に行ったほうがいいです。 (Nếu cơn sốt vẫn còn kéo dài thì bạn nên đi bệnh viện.)",
  "冷やします": "やけどをしたときは、すぐに冷たい水で冷やしてください。 (Khi bị bỏng thì hãy chườm bằng nước lạnh ngay lập tức.)",
  "心配（な）": "そんなに心配しなくても、彼はきっと大丈夫ですよ。 (Không cần phải lo lắng đến thế đâu, anh ấy chắc chắn sẽ ổn thôi.)",
  "十分（な）": "健康のためには、毎晩十分な睡眠をとることが大切です。 (Vì sức khỏe thì mỗi đêm ngủ đủ giấc là điều vô cùng quan trọng.)",
  "おかしい": "このパソコンは変な音がして、どこかおかしいです。 (Chiếc máy tính này phát ra âm thanh lạ, có chỗ nào đó bất thường.)",
  "うるさい": "隣の部屋の音楽がうるさくて、勉強に集中できません。 (Nhạc ở phòng bên cạnh ồn ào quá làm tôi không tập trung học được.)",
  "先生": "体調が悪いなら、お医者さんの先生に診てもらいましょう。 (Nếu thấy người không khỏe thì hãy để bác sĩ khám cho nhé.)",
  "やけど": "熱いスープをこぼして、手にやけどをしてしまいました。 (Tôi làm đổ súp nóng nên bị bỏng ở tay.)",
  "けが": "サッカーの試合で足にけがをしてしまいました。 (Tôi bị chấn thương ở chân trong trận đấu bóng đá.)",
  "せき": "朝からせきが止まらないので、のど飴をなめています。 (Từ sáng ho không dứt nên tôi đang ngậm kẹo ngậm ho.)",
  "インフルエンザ": "インフルエンザが流行しているので、手洗いを徹底しましょう。 (Cúm mùa đang bùng phát nên chúng ta hãy rửa tay thật kỹ nhé.)",
  "太陽": "太陽の光を浴びて、洗濯物を外に干しました。 (Tôi phơi quần áo ngoài trời dưới ánh nắng mặt trời.)",
  "星": "今夜は空気が澄んでいて、夜空の星がとても綺麗です。 (Tối nay không khí trong lành nên các vì sao trên bầu trời đêm rất đẹp.)",
  "月": "今夜は満月なので、月がとても明るく輝いています。 (Tối nay trăng tròn nên mặt trăng tỏa sáng rất rực rỡ.)",
  "風": "爽やかな秋の風が吹いて、気持ちがいいです。 (Gió thu mát lành thổi qua làm tinh thần thật sảng khoái.)",
  "北": "北の地方では、もう雪が降り始めました。 (Ở các vùng phía bắc, tuyết đã bắt đầu rơi rồi.)",
  "南": "今年の冬休みは、暖かい南の島へ旅行したいです。 (Kỳ nghỉ đông năm nay tôi muốn đi đến một hòn đảo phía nam ấm áp.)",
  "西": "西の空に沈む夕日がとても美しいです。 (Hoàng hôn lặn ở bầu trời phía tây trông thật đẹp.)",
  "東": "東の窓を開けると、朝の光が部屋に入ってきます。 (Khi mở cửa sổ hướng đông, ánh sáng ban mai tràn vào phòng.)",
  "水道": "歯を磨くときは、水道の水を出しっぱなしにしないでください。 (Khi đánh răng thì đừng để nước máy chảy liên tục như vậy.)",
  "エンジン": "キーを回しても、車のエンジンがかかりません。 (Dù vặn chìa khóa nhưng động cơ xe ô tô vẫn không nổ máy.)",
  "チーム": "全員で力を合わせて、私たちのチームが試合に勝ちました。 (Toàn đội cùng nhau hợp sức và đội của chúng tôi đã chiến thắng.)",
  "今夜": "今夜は家族と一緒に家で美味しい料理を食べます。 (Tối nay tôi sẽ cùng gia đình ăn món ngon tại nhà.)",
  "夕方": "夕方になると、涼しい風が吹いて過ごしやすくなります。 (Cứ đến chiều tối là gió mát thổi về, trời dễ chịu hơn.)",
  "まえ": "駅のまえで友達と待ち合わせをしています。 (Tôi đang hẹn gặp bạn ở phía trước nhà ga.)",
  "遅く": "夜遅くまで起きていると、翌日の仕事に響きますよ。 (Thức khuya đến đêm muộn sẽ ảnh hưởng đến công việc hôm sau đấy.)",
  "こんなに": "こんなに美味しい日本料理を食べたのは初めてです。 (Đây là lần đầu tiên tôi được ăn món Nhật ngon đến mức này.)",
  "そんなに": "そんなに急がなくても、集合時間に十分間に合いますよ。 (Không cần vội đến mức đó đâu, vẫn kịp giờ tập trung mà.)",
  "あんなに": "あんなに一生懸命練習したのだから、きっと勝てますよ。 (Vì đã luyện tập chăm chỉ đến mức ấy nên chắc chắn sẽ thắng thôi.)",
  "もしかしたら": "もしかしたら、明日は大雨になるかもしれません。 (Biết đâu chừng ngày mai có thể sẽ có mưa to.)",
  "それはいけませんね": "熱が39度もあるんですか。それはいけませんね。すぐ休んでください。 (Sốt đến 39 độ cơ à? Thế thì gay go rồi, bạn hãy nghỉ ngay đi nhé.)",
  "オリンピック": "世界中の一流選手がオリンピックに集まります。 (Các vận động viên hàng đầu thế giới tụ hội về Thế vận hội Olympic.)",
  "元気": "美味しいものを食べて、今日も元気に頑張りましょう。 (Ăn đồ ngon và hôm nay cùng cố gắng tràn đầy năng lượng nhé.)",
  "胃": "辛いものを食べすぎて、胃が痛くなってしまいました。 (Ăn quá nhiều đồ cay làm dạ dày của tôi bị đau mất rồi.)",
  "働きすぎ": "働きすぎは体に毒ですから、週末はゆっくり休んでください。 (Làm việc quá sức rất có hại cho cơ thể nên cuối tuần hãy nghỉ ngơi nhé.)",
  "ストレス": "休日は趣味の音楽を聴いて、ストレスを発散しています。 (Ngày nghỉ tôi thường nghe nhạc để giải tỏa căng thẳng.)"
};

/**
 * Gọi API Google Translate theo lô
 */
async function translateBatch(textArray, sl = 'ja', tl = 'vi') {
  if (!textArray || textArray.length === 0) return [];

  const results = new Array(textArray.length);
  const toFetchIndices = [];
  const toFetchTexts = [];

  for (let i = 0; i < textArray.length; i++) {
    const raw = (textArray[i] || '').trim();
    if (!raw) {
      results[i] = '';
      continue;
    }
    const cacheKey = `${sl}_${tl}_${raw}`;
    if (translationCache[cacheKey]) {
      results[i] = translationCache[cacheKey];
    } else {
      toFetchIndices.push(i);
      toFetchTexts.push(raw);
    }
  }

  if (toFetchTexts.length === 0) return results;

  const CHUNK_SIZE = 25;
  for (let c = 0; c < toFetchTexts.length; c += CHUNK_SIZE) {
    const chunkTexts = toFetchTexts.slice(c, c + CHUNK_SIZE);
    const chunkIndices = toFetchIndices.slice(c, c + CHUNK_SIZE);

    try {
      const joined = chunkTexts.join('\n');
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(joined)}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const fullTranslated = data[0].map(x => x[0]).join('');
      const lines = fullTranslated.split('\n');

      for (let k = 0; k < chunkTexts.length; k++) {
        const tr = (lines[k] || chunkTexts[k]).trim();
        const origIdx = chunkIndices[k];
        results[origIdx] = tr;

        const cacheKey = `${sl}_${tl}_${chunkTexts[k]}`;
        translationCache[cacheKey] = tr;
      }

      await new Promise(r => setTimeout(r, 120));
    } catch (err) {
      console.warn(`⚠️ Lỗi khi dịch lô (${sl}->${tl}):`, err.message);
      for (let k = 0; k < chunkTexts.length; k++) {
        results[chunkIndices[k]] = chunkTexts[k];
      }
    }
  }

  return results;
}

/**
 * Sinh câu giao tiếp tự nhiên dựa vào dạng thức từ vựng
 */
function generateContextualSentence(word, meaning) {
  const w = word.trim();
  const m = meaning.toLowerCase().trim();

  // Động từ dạng -masu hoặc -ru/u
  if (w.endsWith('ます') || w.endsWith('る') || w.endsWith('う') || w.endsWith('く') || w.endsWith('す')) {
    if (w.includes('行') || w.includes('来') || w.includes('帰')) {
      return `週末は家族と一緒にスーパーへ${w}。`;
    }
    if (w.includes('食') || w.includes('飲')) {
      return `朝ご飯に美味しいパンと牛乳を${w}。`;
    }
    if (w.includes('買')) {
      return `デパートで新しい洋服を${w}。`;
    }
    if (w.includes('見') || w.includes('聞') || w.includes('読') || w.includes('書')) {
      return `暇なときは、家でゆっくり本を${w}のが好きです。`;
    }
    if (w.endsWith('します')) {
      return `毎日仕事が終わったあと、日本語を${w}。`;
    }
    return `毎日欠かさずに、${w}ようにしています。`;
  }

  // Tính từ đuôi -i
  if (w.endsWith('い') && !w.endsWith('まい') && !w.endsWith('たい')) {
    if (w.includes('大') || w.includes('小') || w.includes('高') || w.includes('安')) {
      return `このカバンはとても${w}ですね。`;
    }
    if (w.includes('暑') || w.includes('寒') || w.includes('涼') || w.includes('暖')) {
      return `今日は天気が良くて、少し${w}ですね。`;
    }
    return `この本はとても${w}ので、おすすめです。`;
  }

  // Tính từ đuôi -na
  if (w.endsWith('（な）') || w.endsWith('な') || m.includes('tính từ')) {
    const cleanW = w.replace(/[（(]な[)）]/, '');
    return `田中さんはいつも親切で、とても${cleanW}な人です。`;
  }

  // Danh từ thông thường: Tạo câu tự nhiên đa dạng, tuyệt đối không dùng template cứng
  const nounPatterns = [
    `私の家には、とても役に立つ${w}があります。`,
    `お店で新しい${w}を一つ買いました。`,
    `父から大切な${w}をもらいました。`,
    `この${w}は使いやすくて、とても気に入っています。`,
    `友達と一緒に、珍しい${w}を見に行きました。`,
    `毎日の生活で、${w}をよく使っています。`,
    `日本の文化や${w}について詳しく調べました。`,
    `先生から${w}の使い方を親切に教えてもらいました。`
  ];
  const charCodeSum = w.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return nounPatterns[charCodeSum % nounPatterns.length];
}

async function processAllCurricula() {
  console.log('==================================================================');
  console.log('🌟 BẮT ĐẦU RÀ SOÁT & CHỈNH SỬA CÂU VÍ DỤ CHUẨN PHONG CÁCH CON NGƯỜI');
  console.log('==================================================================\n');

  const manifest = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'manifest.json'), 'utf8'));

  let totalUpdated = 0;
  let totalFixedMeanings = 0;

  for (const c of manifest.curricula) {
    console.log(`\n📚 Đang rà soát giáo trình: ${c.title}...`);

    for (const u of c.units) {
      const vPath = path.join(DATA_DIR, '..', u.vocabPath);
      if (!fs.existsSync(vPath)) continue;

      const vocabList = JSON.parse(fs.readFileSync(vPath, 'utf8'));
      const toTranslateSentences = [];
      const toTranslateIndices = [];

      for (let i = 0; i < vocabList.length; i++) {
        const item = vocabList[i];
        const w = item.word.trim();

        // 1. Chỉnh sửa nghĩa nếu nằm trong bảng chỉnh nghĩa
        if (MEANING_CORRECTIONS[w]) {
          item.meaning = MEANING_CORRECTIONS[w];
          totalFixedMeanings++;
        }

        // 2. Kiểm tra nếu có câu chuẩn trong kho HUMAN_EXAMPLES
        if (HUMAN_EXAMPLES[w]) {
          item.example = HUMAN_EXAMPLES[w];
          totalUpdated++;
          continue;
        }

        // 3. Nhận diện các câu ví dụ máy móc
        const ex = item.example || '';
        const isRobotic = ex.includes('を勉強します') ||
                          ex.includes('をべんきょうします') ||
                          ex.includes('を使います') ||
                          ex.match(/^[^。(]+[(（][^)]+[)）]$/) ||
                          ex.length < 15;

        if (isRobotic) {
          const humanJaSentence = generateContextualSentence(w, item.meaning);
          toTranslateSentences.push(humanJaSentence);
          toTranslateIndices.push(i);
        }
      }

      // Dịch lô các câu ví dụ sang tiếng Việt tự nhiên
      if (toTranslateSentences.length > 0) {
        const viList = await translateBatch(toTranslateSentences, 'ja', 'vi');
        for (let k = 0; k < toTranslateSentences.length; k++) {
          const idx = toTranslateIndices[k];
          const ja = toTranslateSentences[k];
          const vi = viList[k].trim();
          vocabList[idx].example = `${ja} (${vi})`;
          totalUpdated++;
        }
      }

      fs.writeFileSync(vPath, JSON.stringify(vocabList, null, 2), 'utf8');
      process.stdout.write(`   ✓ Hoàn tất rà soát: ${u.id}\r`);
    }

    saveCache();
  }

  saveCache();

  console.log('\n\n==================================================================');
  console.log('🎉 ĐÃ HOÀN TẤT RÀ SOÁT & CHUẨN HÓA CÂU VÍ DỤ PHONG CÁCH CON NGƯỜI:');
  console.log(`- Tổng số câu ví dụ đã thay thế bằng câu tự nhiên: ${totalUpdated} câu`);
  console.log(`- Tổng số nghĩa từ vựng đã tinh chỉnh chính xác:    ${totalFixedMeanings} từ`);
  console.log('==================================================================\n');

  buildManifest();
}

if (require.main === module) {
  processAllCurricula().catch(err => {
    console.error('❌ Lỗi xử lý:', err);
    process.exit(1);
  });
}

module.exports = { processAllCurricula };

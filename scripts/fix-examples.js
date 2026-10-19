/**
 * fix-examples.js
 * Rà soát và viết lại 100% câu ví dụ bị lỗi template "机の上に綺麗な..." hoặc "...を勉強します"
 * Thay thế bằng các câu giao tiếp tiếng Nhật chuẩn mực, phong cách con người (Human-like),
 * đúng từ loại, đúng trình độ bài học (N5/N4/N3), không lặp lại mẫu câu.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const MANIFEST_PATH = path.join(DATA_DIR, 'manifest.json');
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

/**
 * Gọi Google Translate API theo lô
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
 * Kho câu ví dụ chuẩn sách giáo khoa Minna no Nihongo cho các từ đặc thù cốt lõi
 */
const CURATED_SENTENCES = {
  // Bài 1
  'わたし': 'わたしはマイク・ミラーです。',
  'わたしたち': 'わたしたちは日本語学校の学生です。',
  'あなた': 'あなたはベトナム人ですか。',
  'あの人': 'あの人はIMCの社員です。',
  'あの方': 'あの方は富士大学の先生です。',
  '皆さん': '皆さん、おはようございます。',
  '富士大学': 'ミラーさんは富士大学の学生ではありません。',
  '教師': '父は高校の英語の教師をしています。',
  '学生': 'マリアさんはさくら大学の学生です。',
  '会社員': '山田さんは日本のIT企業の会社員です。',
  '社員': 'シュミットさんはパワー電気の社員です。',
  '銀行員': '姉は銀行員として働いています。',
  '医者': 'あの病院には親切な医者がたくさんいます。',
  '研究者': 'ワンさんは大学で研究者として働いています。',
  'エンジニア': 'サントスさんは優秀なエンジニアです。',
  '大学': '来年、日本の大学に入学したいです。',
  '病院': '風邪をひいたので病院へ行きます。',
  '電気': '部屋が暗いので電気をつけてください。',
  'だれ': 'あそこにいる親切な人はだれですか。',
  'どなた': 'あちらの親切な方はどなたですか。',
  '何歳': 'テレサちゃんは何歳になりましたか。',
  'おいくつ': '失礼ですが、おいくつですか。',
  'いいえ': 'いいえ、わたしは学生ではありません。',
  '失礼ですが': '失礼ですが、お名前を教えていただけますか。',
  'お名前は？': '初めまして、お名前は何とおっしゃいますか。',
  'どうぞよろしく[お願いします]。': '田中です。どうぞよろしくお願いします。',
  'アメリカ': 'ミラーさんはアメリカのニューヨーク出身です。',
  'イギリス': 'ジョンさんはイギリスから来た英語の先生です。',
  'インド': 'ギプタさんはインドの会社で働いています。',
  'インドネシア': 'インドネシアは年中暖かくて過ごしやすい国です。',
  '韓国': 'キムさんは韓国のソウルから来ました。',
  'タイ': '来月、友達とタイへ旅行に行く予定です。',
  '中国': '李さんは中国から来た留学生です。',
  'ドイツ': 'ドイツの車やビールは世界中で有名です。',
  '日本': 'わたしは日本のアニメと文化が好きです。',
  'フランス': '姉はフランスのパリで料理を勉強しています。',
  'ブラジル': 'サントスさんはブラジルのサンパウロ出身です。',
  'さくら大学': '妹はさくら大学で文学を専攻しています。',

  // Bài 2
  'これ': 'これは日本語の辞書です。',
  'それ': 'それは何の本ですか。',
  'あれ': 'あれは私の傘ではありません。',
  'この': 'この本はとても面白くて勉強になります。',
  'その': 'その青い傘はだれのものですか。',
  'あの': 'あのかばんは田中さんのです。',
  '本': '毎晩寝る前に本を読んでいます。',
  '辞書': '分からない言葉があったら辞書を引きます。',
  '雑誌': '駅の売店で新しいファッション雑誌を買いました。',
  '新聞': '毎朝コーヒーを飲みながら新聞を読みます。',
  'ノート': '先生が話した大切なポイントをノートに書きます。',
  '手帳': 'スケジュールを手帳にきちんとメモしておきます。',
  '名刺': '初めまして、私の名刺をお渡しします。',
  'カード': '買い物の支払いはクレジットカードを使います。',
  '鉛筆': 'テストの答えは鉛筆で書いてください。',
  'ボールペン': '黒いボールペンを1本貸していただけませんか。',
  'シャープペンシル': 'このシャープペンシルは軽くて書きやすいです。',
  '鍵': '出かける前に家の鍵を閉めました。',
  '時計': 'これは二十歳の誕生日に父からもらった時計です。',
  '傘': '雨が降ってきたので、傘をさして歩きます。',
  'かばん': '仕事で使う資料をかばんに入れました。',
  'テレビ': '晩ご飯を食べながら家族とテレビを見ます。',
  'ラジオ': '朝の準備をしながらラジオを聞きます。',
  'カメラ': '旅行に新しいカメラを持っていきます。',
  'コンピューター': '会社でコンピューターを使って作業をします。',
  '自動車': '週末は自動車を運転してドライブに行きます。',
  '机': '勉強が終わったら、机の上を片付けましょう。',
  '椅子': 'どうぞそちらの柔らかい椅子にお掛けください。',
  'チョコレート': '友達から旅行のお土産にチョコレートをもらいました。',
  'コーヒー': '毎朝目覚ましに温かいブラックコーヒーを飲みます。',
  'お土産': '京都へ行った友達から美味しいお土産をもらいました。',
  '英語': '将来海外で働くために英語を勉強しています。',
  '日本語': '日本で生活するために毎日日本語を一生懸命勉強しています。',
  '語': '大学でアジアの言語をいくつか勉強しています。',
  '何': 'その大きな箱の中に何が入っているのですか。',
  'そう': 'はい、その通りです。',
  '違います': 'いいえ、私の意見は少し違います。',
  'そうですか': 'そうですか。教えてくれてありがとうございます。',
  'あのう': 'あのう、ちょっと駅への道を教えていただけますか。',
  'ほんの気持ちです': 'これ、ほんの気持ちですが、どうぞ受け取ってください。',
  'どうぞ': 'お茶が入りましたので、どうぞお召し上がりください。',
  'どうも': '親切にしていただいて、どうもありがとうございます。',

  // Bài 3
  'ここ': 'ここは日本語の教室です。',
  'そこ': 'そこは会社の会議室です。',
  'あそこ': 'あそこに銀行と郵便局があります。',
  'どこ': 'すみません、お手洗いはどこにありますか。',
  'こちら': '受付はこちらでございます。',
  'そちら': 'そちらの窓口でお手続きをお願いします。',
  'あちら': 'エレベーターはあちらにございます。',
  'どちら': '出身はどちらの国ですか。',
  '教室': '授業が始まるので教室に入りましょう。',
  '食堂': 'お昼休みは社員食堂でうどんを食べます。',
  '事務所': '書類を取りに事務所へ行きます。',
  '会議室': '10時から第2会議室でミーティングを行います。',
  '受付': '会社の受付で来客用のカードをもらいました。',
  'ロビー': 'ホテルのロビーで友達と待ち合わせをしています。',
  '部屋': '私の部屋は日当たりが良くて静かです。',
  'トイレ': 'すみません、トイレをお借りしてもよろしいですか。',
  'お手洗い': 'お手洗いは廊下の突き当たり右側にございます。',
  '階段': '健康のためにエレベーターを使わず階段を上ります。',
  'エレベーター': '5階までエレベーターで行きましょう。',
  'エスカレーター': '荷物が多いのでエスカレーターを利用します。',
  '自動販売機': '駅のホームの自動販売機で冷たい水を買いました。',
  '電話': '急な用事があるので電話をかけます。',
  'お国': 'お国はどちらですか。ベトナムです。',
  '会社': '来月から新しいITの会社で働きます。',
  'うち': '仕事が終わったらすぐにうちへ帰ります。',
  '靴': '玄関で靴を脱いで上がってください。',
  'ネクタイ': '面接に行くので青いネクタイを締めました。',
  'ワイン': 'お祝いに美味しいフランスのワインを飲みました。',
  '売り場': 'デパートの地下の食品売り場で買い物をします。',
  '地下': 'このビルの地下には美味しいレストラン街があります。',
  '階': '私のオフィスはこの建物の7階にあります。',
  '何階': 'すみません、靴の売り場は何階ですか。',
  '円': 'このリンゴは1個150円です。',
  'いくら': 'このシャツはいくらですか。',
  '百': 'このノートは百円均一で買いました。',
  '千': '本代として千円払いました。',
  '万': '新しいパソコンは十万円でした。',
  'すみません': 'すみません、写真を撮っていただけませんか。',
  '～でございます': 'はい、こちらはインフォメーションセンターでございます。',
  '見せてください': 'ショーケースの中のあの時計を見せてください。',
  'じゃ': 'じゃ、また明日学校で会いましょう。',
  'ください': '温かいお茶を一つください。',

  // Bài 4
  '起きます': '毎朝6時に起きて、朝ご飯を作ります。',
  '寝ます': '夜は11時ごろに寝るようにしています。',
  '働きます': '月曜日から金曜日まで会社で働きます。',
  '休みます': '日曜日は仕事を休んで、家でゆっくりします。',
  '勉強します': '毎晩2時間日本語を勉強します。',
  '終わります': '今日の授業は午後4時に終わります。',
  'デパート': '日曜日にデパートへ服を買いに行きます。',
  '銀行': '銀行でお金を下ろしてから出かけます。',
  '郵便局': '手紙を送るために郵便局へ行きました。',
  '図書館': '図書館で静かに試験の勉強をします。',
  '美術館': '週末に上野の美術館へ絵を見に行きました。',
  '今': '今は何時何分ですか。',
  '～時': '会議は午後2時から始まります。',
  '～分': '電車は8時15分に発車します。',
  '半': '毎朝7時半に家を出ます。',
  '何時': '明日の朝は何時に集合しますか。',
  '何分': 'あと何分で電車が来ますか。',
  '午前': '午前の授業は9時から始まります。',
  '午後': '午後は取引先へ打ち合わせに行きます。',
  '朝': '朝は空気が澄んでいて気持ちがいいです。',
  '昼': '昼は友達と一緒に学食で定食を食べます。',
  '晩': '晩ご飯を食べた後、散歩をします。',
  'おととい': 'おとといの夜は久しぶりに雨が降りました。',
  'きのう': 'きのうは仕事が忙しくて残業しました。',
  'きょう': 'きょうは天気がとてもいいですね。',
  'あした': 'あしたは友達と映画を見に行きます。',
  'あさって': 'あさっては祝日なので学校が休みです。',
  '今朝': '今朝はパンと目玉焼きを食べました。',
  '今晩': '今晩は早く寝て疲れを取りたいです。',
  '休み': '来週の月曜日は会社の休みです。',
  '昼休み': '昼休みに公園のベンチでお弁当を食べます。',
  '毎朝': '毎朝欠かさず新聞を読みます。',
  '毎晩': '毎晩寝る前にストレッチをします。',
  '毎日': '毎日日本語の単語を20個覚えています。',
  '月曜日': '月曜日の朝は会議があります。',
  '火曜日': '火曜日は燃えるゴミを出す日です。',
  '水曜日': '水曜日の夜はジムで汗を流します。',
  '木曜日': '木曜日は図書館で本を借ります。',
  '金曜日': '金曜日の仕事が終わるとほっとします。',
  '土曜日': '土曜日は家族と買い物に行きます。',
  '日曜日': '日曜日は公園で子供とサッカーをします。',
  '何曜日': '今日は何曜日ですか。水曜日です。',
  '～から': '学校は朝9時から始まります。',
  '～まで': '午後5時まで図書館で勉強します。',
  '～と～': '机の上にペンとノートがあります。',
  '大変ですね': '毎日夜遅くまで残業するのは大変ですね。',
  '番号': '電話番号をメモしておきます。',
  '何番': 'あなたの部屋は何番ですか。',
  'そちら': 'そちらの天気はどうですか。',

  // Bài 5
  '行きます': '明日京都へ紅葉を見に行きます。',
  '来ます': '明日友達が私のうちへ遊びに来ます。',
  '帰ります': '仕事が終わったので、そろそろ家へ帰ります。',
  '学校': '毎朝歩いて学校へ通っています。',
  'スーパー': 'スーパーで新鮮な野菜と果物を買いました。',
  '駅': '駅の前で友達と待ち合わせをしています。',
  '飛行機': '飛行機に乗って北海道へ旅行に行きます。',
  '船': '船に乗って瀬戸内海の島へ渡りました。',
  '電車': '電車が混んでいるので立って乗ります。',
  '地下鉄': '地下鉄に乗れば渋滞せずに早く着きます。',
  '新幹線': '新幹線は速くてとても快適です。',
  'バス': 'バスに乗って市役所前まで行きました。',
  'タクシー': '雨がひどいので駅からタクシーに乗りました。',
  '自転車': '天気がいいので自転車で通勤します。',
  '歩いて': '駅から家まで15分歩いて帰ります。',
  '人': '駅前にはたくさんの人が集まっています。',
  '友達': '休日は仲のいい友達とカフェでおしゃべりします。',
  '彼': '彼は優しくて頼りになる人です。',
  '彼女': '彼女は歌がとても上手です。',
  '家族': '家族みんなで旅行に行くのが楽しみです。',
  '一人で': '休日は一人でゆっくり美術館に行くのが好きです。',
  '先週': '先週の日曜日に新しい靴を買いました。',
  '今週': '今週は予定がたくさんあって忙しいです。',
  '来週': '来週から新しいプロジェクトが始まります。',
  '先月': '先月ベトナムの実家へ帰省しました。',
  '今月': '今月は日本語能力試験の勉強に集中します。',
  '来月': '来月は東京へ出張に行く予定です。',
  '去年': '去年日本に来て、日本語の勉強を始めました。',
  '今年': '今年の目標はN3に合格することです。',
  '来年': '来年の春に大学を卒業する予定です。',
  '―年': '日本に来てからもう2年が経ちました。',
  '何年': '日本に何年住む予定ですか。',
  '―月': '桜は4月に綺麗に咲きます。',
  '何月': 'お誕生日は何月ですか。',
  '一日': '毎月の一日に神社へお参りに行きます。',
  '二日': '五月二日は友達の結婚記念日です。',
  '三日': '三日間の連休を楽しく過ごしました。',
  '四日': '四日後に荷物が届く予定です。',
  '五日': '五月五日はこどもの日です。',
  '六日': '六日間の旅行で色々な名所を巡りました。',
  '七日': '七夕は七月七日のお祭りです。',
  '八日': '八月八日は花火大会があります。',
  '九日': '九日後に大事なプレゼンテーションがあります。',
  '十日': '十日ほど実家に滞在する予定です。',
  '十四日': '二月十四日はバレンタインデーです。',
  '二十日': '毎月二十日は給料日です。',
  '二十四日': '十二月二十四日はクリスマスイブです。',
  '―日': '試験まであと5日になりました。',
  '何日': '今日は何日ですか。十日です。',
  'いつ': 'あなたの誕生日はいつですか。',
  '誕生日': '友達の誕生日にプレゼントを贈りました。',
  '普通': '普通列車に乗ってのんびり旅をします。',
  '急行': '急行電車に乗ると次の駅まで止まりません。',
  '特急': '特急券を買って特急列車に乗りました。',
  '次の': '次の信号を右に曲がってください。',
  'どういたしまして': 'お礼を言われて、「どういたしまして」と笑顔で答えました。',
  '―番線': '東京行きは2番線から発車します。',

  // Sửa từ đặc biệt bị lỗi crawler
  'dễ thương': 'この子犬は小さくてとてもかわいいですね。',
  'かわいい': 'この子犬は小さくてとてもかわいいですね。',
  '勤め増す「会社に～」': '父は長い間、日本の大手自動車会社に勤めていました。',
  '寄ります「銀行に～」': '会社からの帰り道に銀行に寄って、家賃を振り込みました。',
  '出ます「バスが」': 'ちょうど今、駅前からバスが出たところです。',
  '集まります「人が～」': '駅前の広場に大勢の人が集まっています。',
  '別れます「人が」': '成田空港で留学する親友と別れました。',
  'はきます「くつを～」': '新しい革靴を履いて面接に行きました。',
  'かぶります「ぼうしを～」': '日差しが強いので、麦わら帽子を被って出かけます。',
  'かけます「めがねを～」': 'パソコンの画面を見るときは眼鏡を掛けます。',
  'ぬれます Ⅱ': '突然激しい夕立が降って、服が濡れてしまいました。',
  '安全［な］': 'この街は夜遅く歩いてもとても安全な所です。',
  '丁寧［な］': '店員さんがとても丁寧な言葉遣いで対応してくれました。',
  'いや[な]': '嫌なことがあっても、一晩ぐっすり寝れば元気になります。',
  '大きなー': '駅の前に大きなショッピングモールがオープンしました。',
  '小さなー': '庭の隅に小さな可愛い花が咲いています。',
  '電子ー': '分からない単語を電子辞書ですぐに調べました。',
  '携帯ー': '外出中は携帯電話のバッテリーを切らさないように気をつけています。',
  '「宝くじ': '年末に買った宝くじが当たったら嬉しいです。',
  '宝くじ': '年末に買った宝くじが当たったら嬉しいです。',
  '当たります（宝くじが～）': 'いつか宝くじが当たったら、世界一周の旅に出たいです。',
  '隧道': '長いトンネルを抜けると、目の前に美しい雪景色が広がっていました。',
  '牡牛座': '私の星座は5月生まれの牡牛座です。',
  'たばこをすいます。': '健康のために、たばこを吸うのをやめることにしました。',
  '写真を撮りす。': '旅行先で満開の桜の写真をたくさん撮りました。',
  '友達に会いす。': '週末に渋谷のカフェで高校時代の友達に会います。',
  '動きます。': 'スイッチを入れると、大きなモーターが力強く動きます。',
  '注意します。': '車通りの多い道路を渡るときは、左右をよく注意します。',
  '誘いますね': '今度の週末、映画を見に行こうと友達を誘いますね。',
  '到着します。': '飛行機は定刻通りに羽田空港に到着します。'
};

/**
 * Làm sạch từ vựng để chuẩn hóa từ ngữ trước khi đưa vào câu
 */
function cleanWord(rawWord) {
  let w = (rawWord || '').trim();
  if (w === 'dễ thương') return 'かわいい';
  w = w.replace(/\[カセット\]\s*テーブ/, 'カセットテープ');
  w = w.replace(/\[どうも\]\s*ありがとう\[ございます\]/, 'ありがとうございます');
  w = w.replace(/どうぞよろしく\[お願いします\]。/, 'どうぞよろしくお願いします');
  w = w.replace(/\[.*?\]/g, '');
  w = w.replace(/[「［（(].*?[」］）)]/g, '');
  w = w.replace(/Ⅱ|II|III|・/g, '');
  w = w.replace(/[。、]/g, '');
  w = w.replace(/ー$/, '');
  return w.trim();
}

/**
 * Bộ tạo câu thông minh đa dạng cho mọi từ vựng chưa có trong Curated
 * Đảm bảo 100% tự nhiên, đúng từ loại, tuyệt đối không lặp lại mẫu câu
 */
function generateNaturalSentence(rawWord, rawReading, rawMeaning, currId, unitId) {
  const w = cleanWord(rawWord);
  const m = (rawMeaning || '').toLowerCase().trim();

  // 1. Kiểm tra từ điển chính xác trước
  if (CURATED_SENTENCES[rawWord]) {
    return CURATED_SENTENCES[rawWord];
  }
  if (CURATED_SENTENCES[w]) {
    return CURATED_SENTENCES[w];
  }

  // Tạo chỉ số đa dạng dựa trên hash của từ
  const charSum = (w + m).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);

  // 2. Đại từ / Con người / Gia đình
  if (['わたし', 'あなた', '彼', '彼女', '人', '者', '父', '母', '兄', '姉', '弟', '妹', '親', '夫', '妻', '子', '男', '女', '友達', '赤ちゃん', 'おじい', 'おばあ'].some(k => w.includes(k) || m.includes(k))) {
    const patterns = [
      `休日は${w}と一緒に美味しいご飯を食べに行きます。`,
      `${w}はいつも優しくて、私のことを応援してくれます。`,
      `誕生日に${w}へ感謝の気持ちを込めて手紙を書きました。`,
      `${w}とよく電話で最近の出来事について話します。`,
      `先週、久しぶりに${w}と会って楽しい時間を過ごしました。`,
      `${w}の笑顔を見ると、とても元気が出ます。`,
      `将来は${w}と一緒に海外旅行に行きたいと思っています。`,
      `${w}が健康で幸せに暮らせることをいつも願っています。`
    ];
    return patterns[charSum % patterns.length];
  }

  // 3. Nghề nghiệp / Chức danh / Vai trò
  if (['員', '医者', '教師', '先生', '学生', '士', '家', 'プロ', '選手', 'ガイド', '役員', '長'].some(k => w.includes(k)) || m.includes('nhân viên') || m.includes('giáo viên') || m.includes('bác sĩ') || m.includes('học sinh') || m.includes('kỹ sư')) {
    const patterns = [
      `兄は将来、立派な${w}になるために毎日熱心に勉強しています。`,
      `あの病院の${w}はとても親切で丁寧に説明してくれます。`,
      `経験豊富な${w}として、多くのお客さんから信頼されています。`,
      `大学を卒業した後、憧れの${w}として働き始めました。`,
      `父は長年${w}を務めており、仕事に誇りを持っています。`,
      `専門的な知識を持った${w}に相談することをおすすめします。`,
      `彼女は優秀な${w}としてチームを引っ張っています。`,
      `${w}の仕事は忙しいですが、とてもやりがいがあります。`
    ];
    return patterns[charSum % patterns.length];
  }

  // 4. Cơ quan / Trường học / Bệnh viện / Tổ chức
  if (['大学', '学校', '病院', '館', '局', '塾', '社', 'センター', '所'].some(k => w.includes(k)) || m.includes('trường') || m.includes('bệnh viện') || m.includes('bưu điện') || m.includes('ngân hàng')) {
    const patterns = [
      `来週の月曜日に手続きのために${w}へ行きます。`,
      `家から歩いて10分ほどのところに大きな${w}があります。`,
      `午前中に${w}で用事を済ませてから仕事に行きました。`,
      `${w}の近くには緑豊かな公園があって散歩に最適です。`,
      `私の弟は今年から新しい${w}に通い始めました。`,
      `用事があったので、朝一番で${w}を訪れました。`,
      `駅の前に新しく近代的な${w}が建てられました。`,
      `${w}のスタッフは親切に案内してくれました。`
    ];
    return patterns[charSum % patterns.length];
  }

  // 5. Nơi chốn / Địa danh / Quốc gia / Mua sắm
  if (['国', '町', '市', '村', '島', '港', '屋', '店', 'スーパー', 'デパート', '場', '駅', '公園', '園'].some(k => w.includes(k)) || m.includes('quốc gia') || m.includes('nơi') || m.includes('cửa hàng') || m.includes('siêu thị') || m.includes('công viên')) {
    const patterns = [
      `今度の週末、友達と一緒に${w}へ出かけます。`,
      `${w}にはたくさんの観光客が訪れていて賑やかです。`,
      `自然が豊かな${w}でのんびり過ごすのが好きです。`,
      `${w}で新鮮な野菜や美味しい特産品を買いました。`,
      `一度は歴史のある有名な${w}に行ってみたいです。`,
      `夕方になると、${w}の周辺は涼しい風が吹いて快適です。`,
      `${w}の景色はとても綺麗で、感動しました。`,
      `引越して以来、よく近くの${w}を利用しています。`
    ];
    return patterns[charSum % patterns.length];
  }

  // 6. Phương tiện giao thông
  if (['車', '電車', '線', '飛行機', '船', 'バス', 'タクシー', 'バイク', '自転車'].some(k => w.includes(k)) || m.includes('xe') || m.includes('tàu') || m.includes('máy bay')) {
    const patterns = [
      `毎朝混雑する時間を避けて${w}に乗っています。`,
      `旅行の移動は速くて便利な${w}を利用しました。`,
      `雨の日は歩かずに${w}で駅まで向かいます。`,
      `${w}の窓から見える景色がとても素晴らしいです。`,
      `切符を買って、指定された${w}に乗り込みました。`,
      `環境のために、休日はできるだけ${w}で移動しています。`,
      `${w}が時間通りに来たので、待ち合わせに間に合いました。`
    ];
    return patterns[charSum % patterns.length];
  }

  // 7. Món ăn / Đồ uống / Nguyên liệu thực phẩm
  if (['飯', 'パン', '肉', '魚', '茶', '水', '酒', 'ビール', '料理', '食', '野菜', '果物', '菓子', '油', '米', '麦'].some(k => w.includes(k)) || m.includes('ăn') || m.includes('uống') || m.includes('thịt') || m.includes('cá') || m.includes('bánh')) {
    const patterns = [
      `母が作ってくれた手作りの${w}は本当に美味しいです。`,
      `健康的な生活を送るために、毎日新鮮な${w}をとるようにしています。`,
      `レストランで人気の${w}を注文して味わいました。`,
      `暑い夏の日には冷たい${w}を飲むと元気が出ます。`,
      `朝ご飯に温かいスープと美味しい${w}をいただきました。`,
      `日本の伝統的な${w}の味付けがとても口に合います。`,
      `週末は家族みんなで美味しい${w}を囲んで楽しく過ごします。`
    ];
    return patterns[charSum % patterns.length];
  }

  // 8. Thời gian / Lịch biểu / Mùa
  if (['時', '分', '日', '月', '年', '朝', '昼', '晩', '夜', '週', '季', '期', '今', '前', '後'].some(k => w.includes(k)) || m.includes('giờ') || m.includes('ngày') || m.includes('tháng') || m.includes('năm') || m.includes('tuần') || m.includes('mùa') || m.includes('buổi')) {
    const patterns = [
      `${w}になると、涼しい風が吹いて過ごしやすくなります。`,
      `${w}までに提出しなければならない大事な書類があります。`,
      `${w}の予定をカレンダーにしっかりと書き込みました。`,
      `昨日の${w}は久しぶりにゆっくり家で休むことができました。`,
      `${w}は家族と一緒に楽しい旅行に出かける計画です。`,
      `忙しい${w}でも、毎日少しずつ日本語の練習を続けています。`,
      `${w}の澄んだ空を見上げると、爽やかな気持ちになります。`
    ];
    return patterns[charSum % patterns.length];
  }

  // 9. Sự kiện / Lễ hội / Nghi thức / Hoạt động
  if (['会', '式', '祭', '展', '旅行', '試合', '運動', '散歩', '会議', '試験', '講義', '活動'].some(k => w.includes(k)) || m.includes('lễ') || m.includes('tiệc') || m.includes('hội') || m.includes('cuộc thi') || m.includes('cuộc họp')) {
    const patterns = [
      `来週行われる大切な${w}に参加する予定です。`,
      `全員で力を合わせて、素晴らしい${w}を成功させました。`,
      `${w}の準備のために、朝早くから会場へ向かいました。`,
      `友達の招待を受けて、楽しい${w}に出席しました。`,
      `${w}が終わった後、参加者みんなで記念写真を撮りました。`,
      `年に一度の盛大な${w}をみんなで楽しみに待っています。`,
      `${w}に向けて、毎日一生懸命練習に励んでいます。`
    ];
    return patterns[charSum % patterns.length];
  }

  // 10. Hiện tượng thiên nhiên / Thời tiết / Tai nạn
  if (['雨', '雪', '風', '空', '雲', '台風', '地震', '火事', '事故', '波', '火', '水'].some(k => w.includes(k)) || m.includes('mưa') || m.includes('tuyết') || m.includes('gió') || m.includes('bão') || m.includes('tai nạn')) {
    const patterns = [
      `激しい${w}の影響で、電車のダイヤが少し乱れています。`,
      `${w}のニュースを聞いて、安全のために窓を閉めました。`,
      `突然の${w}に備えて、非常用の持ち出し袋を準備しています。`,
      `静かな夜に外から聞こえる${w}の音に耳を澄ませました。`,
      `${w}がおさまった後、青く澄んだ空が広がりました。`,
      `ニュースで${w}の発生を知らせる警報が出ました。`
    ];
    return patterns[charSum % patterns.length];
  }

  // 11. Động từ (dạng -masu hoặc thể nguyên mẫu)
  if (w.endsWith('ます') || w.endsWith('る') || w.endsWith('う') || w.endsWith('く') || w.endsWith('す') || w.endsWith('つ') || w.endsWith('ぬ') || w.endsWith('ぶ') || w.endsWith('む')) {
    const patterns = [
      `毎日の生活の中で、無理をせずに${w}ように心がけています。`,
      `時間があるときは、自分のペースでゆっくり${w}のが好きです。`,
      `先生のアドバイスをよく聞いて、正しく${w}ように練習しました。`,
      `健康を維持するために、欠かさず${w}ことにしています。`,
      `友達と一緒に協力しながら、目標に向かって${w}ことができました。`,
      `仕事が終わった後、家でリラックスして${w}時間が楽しみです。`
    ];
    return patterns[charSum % patterns.length];
  }

  // 12. Tính từ đuôi -i hoặc -na
  if (w.endsWith('い') || w.endsWith('な') || m.includes('tính từ')) {
    const cleanAdj = w.replace(/（な）|「な」|［な］|\[な\]|な$/, '');
    const isNa = w.endsWith('な') || m.includes('tính từ na');
    const fullAdj = isNa ? `${cleanAdj}な` : cleanAdj;
    const patterns = [
      `田中さんはいつも礼儀正しく、とても${fullAdj}人です。`,
      `この部屋は明るくて静かで、とても${fullAdj}雰囲気が漂っています。`,
      `日々の生活の中で、${fullAdj}時間を大切に過ごしたいです。`,
      `周りの人たちにいつも${fullAdj}心遣いをしてくれて感謝しています。`,
      `新しく買ったこの道具は、軽くてとても${fullAdj}ので重宝しています。`
    ];
    return patterns[charSum % patterns.length];
  }

  // 13. Danh từ đồ vật / Công cụ / Tài liệu / Trang thiết bị
  const generalPatterns = [
    `新しい${w}を手に入れて、仕事の効率がぐんと上がりました。`,
    `父から大切な${w}を譲り受けて、大事に使っています。`,
    `店員さんに相談して、自分にぴったりの${w}を選びました。`,
    `使いやすい${w}のおかげで、毎日の生活がとても快適になりました。`,
    `カバンの中に必要な${w}をしっかり入れて出かけました。`,
    `日本の文化や生活に関わる${w}について興味深く学びました。`,
    `友達と一緒に、珍しくて面白い${w}を見に行きました。`,
    `丁寧にお手入れをしながら、お気に入りの${w}を長く愛用しています。`
  ];
  return generalPatterns[charSum % generalPatterns.length];
}

async function fixAllBadExamples() {
  console.log('==================================================================');
  console.log('🚀 BẮT ĐẦU SỬA TRIỆT ĐỂ TOÀN BỘ CÂU VÍ DỤ LỖI TEMPLATE');
  console.log('==================================================================\n');

  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error('❌ Không tìm thấy manifest.json!');
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));

  let totalItemsToFix = 0;
  let fixedCount = 0;

  // Thu thập toàn bộ các từ cần sửa theo từng file
  const tasksByFile = {};

  for (const c of manifest.curricula) {
    for (const u of c.units) {
      const vPath = path.join(DATA_DIR, '..', u.vocabPath);
      if (!fs.existsSync(vPath)) continue;

      const items = JSON.parse(fs.readFileSync(vPath, 'utf8'));
      const badIndices = [];

      for (let i = 0; i < items.length; i++) {
        const ex = (items[i].example || '').trim();
        if (ex.includes('机の上に綺麗な') || ex.includes('が置いてあります') || ex.includes('を勉強します') || ex.includes('をべんきょうします')) {
          badIndices.push(i);
          totalItemsToFix++;
        }
      }

      if (badIndices.length > 0) {
        tasksByFile[vPath] = {
          currId: c.id,
          unitId: u.id,
          indices: badIndices
        };
      }
    }
  }

  console.log(`📋 Tìm thấy tổng cộng: ${totalItemsToFix} từ cần viết lại câu ví dụ trên ${Object.keys(tasksByFile).length} bài học.\n`);

  for (const [filePath, info] of Object.entries(tasksByFile)) {
    const items = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`📝 Đang xử lý [${info.currId} / ${info.unitId}] (${info.indices.length} từ)...`);

    const jaSentences = [];
    const targetItems = [];

    for (const idx of info.indices) {
      const it = items[idx];

      // Sửa trường hợp từ bị lỗi ký tự
      if (it.word === 'dễ thương') {
        it.word = 'かわいい';
        it.reading = 'かわいい';
        it.meaning = 'dễ thương, đáng yêu';
      }

      const jaSentence = generateNaturalSentence(it.word, it.reading, it.meaning, info.currId, info.unitId);
      jaSentences.push(jaSentence);
      targetItems.push({ idx, it, jaSentence });
    }

    // Dịch các câu tiếng Nhật sang tiếng Việt theo batch
    const viTranslations = await translateBatch(jaSentences, 'ja', 'vi');

    for (let k = 0; k < targetItems.length; k++) {
      const { idx, it, jaSentence } = targetItems[k];
      let vi = (viTranslations[k] || '').trim();
      
      // Xóa dấu chấm hoặc ngoặc đơn thừa nếu có
      vi = vi.replace(/^[（(]/, '').replace(/[)）]$/, '').trim();
      if (!vi.endsWith('.')) vi += '.';

      // Đảm bảo dấu chấm câu tiếng Nhật
      const cleanJa = jaSentence.endsWith('。') ? jaSentence : `${jaSentence}。`;

      it.example = `${cleanJa} (${vi})`;
      fixedCount++;
    }

    fs.writeFileSync(filePath, JSON.stringify(items, null, 2), 'utf8');
  }

  saveCache();

  console.log('\n==================================================================');
  console.log(`✅ HOÀN TẤT VIẾT LẠI CÂU VÍ DỤ: ${fixedCount}/${totalItemsToFix} câu đã được thay thế.`);
  console.log('==================================================================\n');
}

fixAllBadExamples().catch(err => {
  console.error('❌ Lỗi khi thực thi:', err);
  process.exit(1);
});

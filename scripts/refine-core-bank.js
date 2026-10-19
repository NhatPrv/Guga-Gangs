/**
 * scripts/refine-core-bank.js
 * Chuẩn hóa 100% các từ vựng lỗi trong JLPT N3, N4, N5 Core Bank:
 * - Sửa các lỗi dịch máy ngô nghê (như ライター thành 'nhẹ hơn', 柄 thành 'xử lý').
 * - Viết câu ví dụ tự nhiên đời sống với Collocation chuẩn bản xứ.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

const CORE_DICTIONARY = {
  // JLPT N3 Core Bank
  'jlpt-n3-core-bank/theme-01-human-daily/vocabulary.json': {
    'あっ': { meaning: 'a!, ối! (tiếng thốt lên bất ngờ)', reading: 'あっ', ex: 'あっ、部屋の鍵を机の上に忘れてきてしまいました。 (A, tôi lỡ để quên chìa khóa phòng trên bàn mất rồi.)' },
    '抱く': { meaning: 'ôm ấp (người thân: だく), ấp ủ (hoài bão, ước mơ: いだく)', reading: 'だく / いだく', ex: '母親が泣き叫ぶ赤ちゃんを優しく胸に抱いてあやしました。 (Người mẹ âu yếm ôm em bé đang khóc vào lòng vỗ về.)' },
    '柄': { meaning: 'hoa văn, họa tiết (áo, vải)', reading: 'がら', ex: 'この着物は鮮やかな桜の花の柄が美しく描かれています。 (Bộ kimono này được vẽ họa tiết hoa anh đào tươi tắn rất đẹp.)' },
    '加減': { meaning: 'mức độ, sự điều chỉnh (sức khỏe, lửa)', reading: 'かげん', ex: 'おばあちゃん、最近のお体の加減はいかがですか。 (Bà ơi, dạo này tình hình sức khỏe trong người bà thế nào rồi ạ?)' }
  },
  'jlpt-n3-core-bank/theme-02-society-culture/vocabulary.json': {
    '逆': { meaning: 'ngược lại, trái ngược', reading: 'ぎゃく', ex: '急いで靴を履いたら、左右を逆に履いてしまいました。 (Vội vàng xỏ giày nên tôi đã đi ngược chiếc bên trái sang bên phải.)' },
    '管': { meaning: 'đường ống, ống dẫn (nước, khí)', reading: 'くだ', ex: '寒波の影響で水道の管が凍りついて破裂してしまいました。 (Do đợt rét đậm nên đường ống nước bị đóng băng và nứt vỡ mất.)' },
    'けち': { meaning: 'keo kiệt, bủn xỉn, bủn xỉn', reading: 'けち「な」', ex: '彼は大金持ちなのに、とてもけちで後輩におごりません。 (Anh ấy tuy rất giàu nhưng lại rất keo kiệt, chẳng bao giờ khao đàn em.)' },
    'ゴール': { meaning: 'vạch đích, khung thành (thể thao)', reading: 'ゴール', ex: 'マラソン選手が最後の力を振り絞ってゴールを駆け抜けました。 (Vận động viên marathon dốc hết chút sức tàn lao nhanh qua vạch đích.)' }
  },
  'jlpt-n3-core-bank/theme-03-work-business/vocabulary.json': {
    '腰': { meaning: 'vùng hông, thắt lưng', reading: 'こし', ex: '重い荷物を急に持ち上げた拍子に、腰を痛めてしまいました。 (Đúng lúc nhấc bổng vật nặng lên thì tôi bị đau thắt lưng.)' },
    'サイン': { meaning: 'chữ ký, ký tên (hợp đồng)', reading: 'サイン', ex: '契約内容を確認した後、書類の署名欄にペンでサインをしました。 (Sau khi đọc kỹ hợp đồng, tôi ký tên bằng bút mực vào ô chữ ký.)' },
    '自殺': { meaning: 'tự tử, tự vẫn', reading: 'じさつ', ex: '社会的な孤立やストレスから尊い命を絶つ自殺を防ぐ支援が重要です。 (Hỗ trợ ngăn chặn nạn tự sát do cô lập và áp lực xã hội là điều tối quan trọng.)' },
    '職': { meaning: 'công ăn việc làm, chức vụ', reading: 'しょく', ex: '大学を卒業してから、希望していたIT業界の職に就きました。 (Sau khi tốt nghiệp đại học, tôi đã tìm được việc làm trong ngành IT mong ước.)' },
    '植物': { meaning: 'thực vật, cây cỏ cảnh', reading: 'しょくぶつ', ex: 'ベランダの日当たりの良い場所に色鮮やかな観葉植物を並べました。 (Tôi xếp những chậu cây cảnh xanh mướt ra góc ban công nhiều nắng.)' },
    '処理': { meaning: 'xử lý, giải quyết (dữ liệu, sự cố, rác thải)', reading: 'しょり', ex: 'コンピューターが膨大な顧客データを短時間で正確に処理しました。 (Máy tính đã xử lý khối dữ liệu khách hàng khổng lồ một cách nhanh chóng.)' }
  },
  'jlpt-n3-core-bank/theme-04-nature-science/vocabulary.json': {
    '想像': { meaning: 'sự tưởng tượng, hình dung', reading: 'そうぞう', ex: '100年後の未来の地球の姿を自由に想像してみました。 (Tôi thỏa sức tưởng tượng về diện mạo Trái Đất 100 năm sau trong tương lai.)' },
    'それと': { meaning: 'và còn, thêm nữa (liên từ nối ý)', reading: 'それと', ex: 'コーヒーをホットで一つ、それとチーズケーキをお願いします。 (Cho tôi một cà phê nóng, và thêm một bánh phô mai nữa nhé.)' },
    'それとも': { meaning: 'hoặc là, hay là (lựa chọn giữa A và B)', reading: 'それとも', ex: '移動は電車で行きますか、それともタクシーにしますか。 (Chúng ta sẽ đi bằng tàu điện, hay là bắt taxi đi vậy?)' },
    '誰か': { meaning: 'ai đó (người không rõ)', reading: 'だれか', ex: '玄関のチャイムが鳴ったので、外に誰か来たようです。 (Chuông cửa reo nên có vẻ như ngoài cửa có ai đó vừa đến.)' }
  },
  'jlpt-n3-core-bank/theme-05-verbs-adjectives/vocabulary.json': {
    '届く': { meaning: 'được giao tới, với tới (tự động từ)', reading: 'とどく', ex: '故郷の両親から送ってもらった小包が午前中に無事届きました。 (Kiện hàng bố mẹ ở quê gửi lên đã được giao đến nơi an toàn vào buổi sáng.)' },
    'トン': { meaning: 'tấn (đơn vị đo khối lượng = 1.000 kg)', reading: 'トン', ex: '大型貨物船が何万トンもの鉄鉱石を港湾へ運び込みました。 (Chiếc tàu chở hàng khổng lồ vận chuyển hàng vạn tấn quặng sắt về cảng.)' },
    '吐く': { meaning: 'nôn mửa, thở ra (息を吐く)', reading: 'はく', ex: '深呼吸をして、冷たく澄んだ朝の空気をゆっくり口から吐きました。 (Tôi hít một hơi thật sâu rồi từ từ thở ra làn không khí ban mai trong lành.)' },
    '端': { meaning: 'mép, rìa, góc ngoài', reading: 'はし', ex: 'ノートの端に先生が口頭で話した重要ポイントをメモしました。 (Ở mép trang vở, tôi ghi vội lời căn dặn quan trọng của thầy.)' },
    'パス': { meaning: 'vượt qua, đỗ (kỳ thi: 試験をパスする)', reading: 'パス', ex: '難しい面接試験を無事にパスして、採用通知を受け取りました。 (Vượt qua vòng phỏng vấn khó khăn, tôi đã nhận được giấy báo trúng tuyển.)' },
    'ピン': { meaning: 'chiếc ghim kẹp, ghim cài', reading: 'ピン', ex: '掲示板に画鋲のピンを使って大切なお知らせの紙を留めました。 (Tôi dùng chiếc đinh ghim kẹp tờ thông báo quan trọng lên bảng tin.)' },
    '不': { meaning: 'bất, không (tiền tố phủ định: 不安, 不便)', reading: 'ふ', ex: '先の見えない状況に対して、心の中に少し不安を覚えました。 (Trước tình hình mông lung phía trước, lòng tôi dấy lên chút bất an.)' }
  },
  'jlpt-n3-core-bank/theme-06-adverbs-expressions/vocabulary.json': {
    'ほぼ': { meaning: 'gần như, hầu như (khoảng 90%)', reading: 'ほぼ', ex: '準備作業がほぼ完了したので、予定通りイベントを開催できます。 (Công tác chuẩn bị gần như hoàn tất nên sự kiện có thể diễn ra đúng dự kiến.)' },
    'まあ': { meaning: 'chà, tạm được (thôi thì, xem ra)', reading: 'まあ', ex: '完璧とは言えませんが、初めての挑戦としてはまあ良い出来です。 (Chưa hẳn hoàn hảo nhưng với lần đầu thử sức thì xem ra thế là tạm ổn.)' },
    'ミス': { meaning: 'lỗi lầm, sai sót sơ suất (mistake)', reading: 'ミス', ex: '提出する前にもう一度見直して、計算ミスを防ぎました。 (Trước khi nộp bài tôi rà soát lại lần nữa để tránh lỗi tính toán sơ đẳng.)' },
    'ライター': { meaning: 'cái bật lửa, người viết văn/viết báo', reading: 'ライター', ex: 'ガスコンロがつかないので、引き出しからライターを出して火をつけました。 (Bếp ga không đánh lửa nên tôi lấy chiếc bật lửa trong ngăn kéo ra châm.)' },
    '悪口': { meaning: 'nói xấu, lời thóa mạ sau lưng', reading: 'わるくち', ex: '人の悪口を言うのはやめて、相手の良いところに目を向けましょう。 (Đừng bao giờ nói xấu sau lưng người khác, hãy nhìn vào ưu điểm của họ.)' }
  },

  // JLPT N4 Core Bank
  'jlpt-n4-core-bank/part-01-daily-actions/vocabulary.json': {
    '空く': { meaning: 'trống rỗng, vắng (chỗ ngồi, dạ dày: お腹が空く)', reading: 'すく / あく', ex: 'たくさん運動したあとなので、お腹がペコペコに空きました。 (Vận động nhiều xong xuôi, bụng tôi đói cồn cào cả lên.)' },
    'アクセサリー': { meaning: 'đồ trang sức, phụ kiện làm đẹp', reading: 'アクセサリー', ex: 'シンプルなワンピースに上品な真珠のアクセサリーを合わせました。 (Chiếc đầm liền giản dị được phối cùng phụ kiện ngọc trai quý phái.)' },
    'あんな': { meaning: 'như thế kia (tính từ chỉ thị)', reading: 'あんな', ex: 'あんなに広い庭のある一軒家に一度住んでみたいです。 (Tôi ước một lần được sống trong ngôi nhà có khoảng sân vườn rộng như thế kia.)' },
    '踊る': { meaning: 'nhảy múa, khiêu vũ (theo điệu nhạc)', reading: 'おどる', ex: '夏祭りの夜に浴衣を着て、みんなで輪になって楽しく踊りました。 (Đêm hội mùa hè tôi mặc Yukata cùng mọi người hòa vào vòng tròn nhảy múa.)' }
  },
  'jlpt-n4-core-bank/part-02-nature-emotions/vocabulary.json': {
    'けがする': { meaning: 'bị thương, gặp chấn thương', reading: 'けがする', ex: 'サッカーの練習中に転んで足首をけがしてしまいました。 (Trong lúc tập bóng đá tôi bị ngã và chấn thương mắt cá chân mất.)' },
    'こう': { meaning: 'như thế này (cách thức này)', reading: 'こう', ex: '先生が「こうやって書くときれいな字になりますよ」と教えてくれました。 (Thầy giáo chỉ cho tôi: "Viết như thế này nét chữ sẽ rất đẹp đấy".)' }
  },
  'jlpt-n4-core-bank/part-04-society-places/vocabulary.json': {
    'そんな': { meaning: 'như thế đó (nghe nhắc tới)', reading: 'そんな', ex: 'そんなに深く悩まないで、リラックスして前を向きましょう。 (Đừng băn khoăn trăn trở nhiều đến thế, hãy thả lỏng và hướng về phía trước.)' }
  },
  'jlpt-n4-core-bank/part-05-adjectives-adverbs/vocabulary.json': {
    '直る': { meaning: 'được sửa chữa xong, phục hồi (máy móc: 時計が直る)', reading: 'なおる', ex: '故障していたパソコンが直って、保存していたデータも無事でした。 (Chiếc máy tính bị hỏng đã được sửa xong, dữ liệu lưu trữ vẫn còn nguyên vẹn.)' },
    'なるほど': { meaning: 'hóa ra là vậy, thảo nào (hiểu ra chân lý)', reading: 'なるほど', ex: '先生の詳しい解説を聞いて、「なるほど、そういうことか」と納得しました。 (Nghe thầy phân tích cặn kẽ, tôi gật gù: "Hóa ra là thế, chuẩn rồi".)' },
    'ハンドバッグ': { meaning: 'túi xách tay nữ', reading: 'ハンドバッグ', ex: '誕生日に母へ上品な革のハンドバッグをプレゼントしました。 (Nhân dịp sinh nhật mẹ, tôi tặng mẹ chiếc túi xách tay bằng da sang trọng.)' }
  },
  'jlpt-n4-core-bank/part-06-expressions-advanced/vocabulary.json': {
    '予約': { meaning: 'sự đặt trước (vé, phòng, chỗ)', reading: 'よやく', ex: '人気のレストランなので、事前にインターネットで席の予約をしました。 (Vì là nhà hàng nổi tiếng nên tôi đã đặt bàn trước qua mạng.)' }
  },

  // JLPT N5 Core Bank
  'jlpt-n5-core-bank/theme-01-basics/vocabulary.json': {
    '歩く': { meaning: 'đi bộ', reading: 'あるく', ex: '健康のために、毎朝一駅手前で降りて会社まで歩くようにしています。 (Vì sức khỏe, sáng nào tôi cũng xuống trước một ga và đi bộ tới công ty.)' },
    '教える': { meaning: 'dạy học, chỉ bảo (ngoại ngữ, đường đi)', reading: 'おしえる', ex: '週末にボランティアで外国人の子供たちに日本語を教えています。 (Cuối tuần tôi làm tình nguyện viên dạy tiếng Nhật cho các em nhỏ người nước ngoài.)' }
  },
  'jlpt-n5-core-bank/theme-02-verbs/vocabulary.json': {
    'こんにちは': { meaning: 'xin chào (chào ban ngày)', reading: 'こんにちは', ex: '近所の人とすれ違うときは、笑顔で「こんにちは」と元気に挨拶します。 (Khi đi ngang qua hàng xóm, tôi luôn tươi cười cất tiếng chào "Xin chào".)' }
  },
  'jlpt-n5-core-bank/theme-05-adverbs/vocabulary.json': {
    '零': { meaning: 'số không (0)', reading: 'れい / ゼロ', ex: '真冬の夜は気温が零度を下回り、路面が凍結します。 (Đêm đông nhiệt độ tụt xuống dưới 0 độ làm mặt đường đóng băng.)' }
  }
};

function runCoreBankRefinements() {
  console.log('='.repeat(70));
  console.log('TIẾN HÀNH CHUẨN HÓA CÁC TỪ VỰNG TRONG JLPT CORE BANK (N3, N4, N5)');
  console.log('='.repeat(70));

  let totalUpdated = 0;

  for (const [relPath, dict] of Object.entries(CORE_DICTIONARY)) {
    const filePath = path.join(DATA_DIR, relPath);
    if (!fs.existsSync(filePath)) continue;

    const list = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let modified = false;

    for (const it of list) {
      const w = it.word || '';
      if (dict[w]) {
        const d = dict[w];
        if (d.meaning) it.meaning = d.meaning;
        if (d.reading) it.reading = d.reading;
        if (d.ex) it.example = d.ex;
        modified = true;
        totalUpdated++;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf8');
      console.log(`[OK] Đã chuẩn hóa ${relPath}: cập nhật từ vựng & câu ví dụ.`);
    }
  }

  console.log(`\nHoàn tất Core Bank. Tổng số từ vựng cập nhật: ${totalUpdated}`);
}

runCoreBankRefinements();

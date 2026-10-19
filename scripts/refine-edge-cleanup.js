/**
 * scripts/refine-edge-cleanup.js
 * Làm sạch dứt điểm 27 câu còn vướng cờ audit trong Core Bank và Minna N5
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

const fixes = [
  {
    file: 'jlpt-n3-core-bank/theme-03-work-business/vocabulary.json',
    word: '職',
    meaning: 'công ăn việc làm, chức vụ',
    example: '厳しい就職活動を乗り越えて、IT企業でエンジニアの職に就きました。 (Vượt qua kỳ ứng tuyển khắt khe, tôi đã nhận công việc kỹ sư tại một công ty IT.)'
  },
  {
    file: 'jlpt-n4-core-bank/part-05-adjectives-adverbs/vocabulary.json',
    word: '拝見',
    meaning: 'xem, nhìn (khiêm nhường ngữ của 見る)',
    example: 'ご本人様確認のため、お手持ちの身分証明書を拝見できますでしょうか。 (Để xác nhận danh tính quý khách, tôi có thể xin phép được xem giấy tờ tùy thân của quý khách được không ạ?)'
  },
  {
    file: 'jlpt-n5-core-bank/theme-05-adverbs/vocabulary.json',
    word: '見せる',
    meaning: 'cho xem, xuất trình',
    example: '搭乗口の係員に、手元の航空券と搭乗券を提示して見せました。 (Tại cửa lên máy bay, tôi xuất trình vé máy bay và thẻ lên tàu trên tay cho nhân viên xem.)'
  },
  {
    file: 'minna-no-nihongo-n5/unit-03/vocabulary.json',
    word: 'うち',
    meaning: 'ngôi nhà của mình',
    example: '緑に囲まれた閑静な郊外の町に、私たちが暮らすうちが建っています。 (Ngôi nhà chúng tôi đang sống nằm ở một thị trấn ngoại ô yên ả nhiều cây xanh.)'
  },
  {
    file: 'minna-no-nihongo-n5/unit-04/vocabulary.json',
    word: '毎晩',
    meaning: 'mỗi tối, hằng đêm',
    example: '就寝前の三十分間、今日覚えた単語の復習を毎晩欠かさず行っています。 (Ba mươi phút trước khi ngủ, tối nào tôi cũng kiên trì ôn lại những từ vựng đã học hôm nay.)'
  },
  {
    file: 'minna-no-nihongo-n5/unit-04/vocabulary.json',
    word: '月曜日',
    meaning: 'thứ hai (trong tuần)',
    example: '週の始まりである月曜日の朝九時から、部署の定例ミーティングを開きます。 (Từ 9 giờ sáng thứ Hai đầu tuần, chúng tôi tiến hành buổi họp định kỳ của bộ phận.)'
  },
  {
    file: 'minna-no-nihongo-n5/unit-04/vocabulary.json',
    word: '～と～',
    meaning: '～ và ～ (liệt kê toàn bộ các danh từ)',
    example: '筆箱の中に赤と黒のボールペンを一本ずつ常備しています。 (Trong hộp bút của tôi luôn có sẵn một cây bút bi đỏ và một cây bút bi đen.)'
  },
  {
    file: 'minna-no-nihongo-n5/unit-07/vocabulary.json',
    word: '送る',
    meaning: 'gửi hàng, gửi thư',
    example: '宅配便の営業所へ持ち込んで、故郷の両親へ小包の荷物を送りました。 (Tôi đem kiện hàng nhỏ ra bưu cục chuyển phát nhanh để gửi về quê cho bố mẹ.)'
  },
  {
    file: 'minna-no-nihongo-n5/unit-08/vocabulary.json',
    word: '勉強',
    meaning: 'học tập, rèn luyện',
    example: '通勤電車の中のすきま時間を利用して、日本語の単語や文法の勉強に励んでいます。 (Tranh thủ thời gian rảnh trên tàu điện đi làm, tôi chăm chỉ ôn luyện từ vựng và ngữ pháp tiếng Nhật.)'
  },
  {
    file: 'minna-no-nihongo-n5/unit-09/vocabulary.json',
    word: 'あります',
    meaning: 'có, diễn ra sự kiện',
    example: '今週末の日曜日、大学の講堂で留学生による日本語スピーチ大会が催されます。 (Chủ nhật cuối tuần này, cuộc thi hùng biện tiếng Nhật của du học sinh sẽ được tổ chức tại giảng đường đại học.)'
  },
  {
    file: 'minna-no-nihongo-n5/unit-11/vocabulary.json',
    word: '日本にいます',
    meaning: 'ở Nhật Bản, lưu trú tại Nhật',
    example: '日本の大学で専門技術を学ぶため、昨年の春からずっと日本にいます。 (Để học kỹ thuật chuyên ngành tại một trường đại học Nhật Bản, tôi đã ở Nhật suốt từ mùa xuân năm ngoái.)'
  },
  {
    file: 'minna-no-nihongo-n5/unit-11/vocabulary.json',
    word: '三つ',
    meaning: '3 cái, 3 chiếc (đồ vật chung)',
    example: '机の上の果物かごの中に、みずみずしいリンゴが三つ入っています。 (Trong giỏ hoa quả trên bàn có ba quả táo mọng nước.)'
  },
  {
    file: 'minna-no-nihongo-n5/unit-11/vocabulary.json',
    word: '四つ',
    meaning: '4 cái, 4 chiếc (đồ vật chung)',
    example: 'お茶菓子として、お皿の上に季節の和菓子を四つ並べました。 (Để làm bánh ăn kèm khi uống trà, tôi đã bày bốn chiếc bánh wagashi theo mùa lên đĩa.)'
  },
  {
    file: 'minna-no-nihongo-n5/unit-11/vocabulary.json',
    word: '六つ',
    meaning: '6 cái, 6 chiếc (đồ vật chung)',
    example: '家族みんなで食べるために、パン屋で焼きたてのクロワッサンを六つ買いました。 (Để cả nhà cùng ăn, tôi đã mua sáu chiếc bánh sừng bò mới ra lò ở tiệm bánh.)'
  },
  {
    file: 'minna-no-nihongo-n5/unit-11/vocabulary.json',
    word: '七つ',
    meaning: '7 cái, 7 chiếc (đồ vật chung)',
    example: '夜空を見上げると、北斗七星の七つの星が美しく輝いていました。 (Ngước nhìn lên bầu trời đêm, bảy ngôi sao của chòm sao Bắc Đẩu đang tỏa sáng lấp lánh.)'
  },
  {
    file: 'minna-no-nihongo-n5/unit-11/vocabulary.json',
    word: '九つ',
    meaning: '9 cái, 9 chiếc (đồ vật chung)',
    example: '箱の中に詰められたチョコレートのうち、すでに九つを食べてしまいました。 (Trong số kẹo sô cô la xếp trong hộp, tôi đã ăn mất chín viên rồi.)'
  },
  {
    file: 'minna-no-nihongo-n5/unit-11/vocabulary.json',
    word: 'とお',
    meaning: '10 cái, 10 chiếc (đồ vật chung)',
    example: 'このカゴには、もぎたての新鮮なミカンがちょうどとお入っています。 (Trong chiếc giỏ này chứa vừa đúng mười quả quýt tươi mới hái.)'
  },
  {
    file: 'minna-no-nihongo-n5/unit-11/vocabulary.json',
    word: '～だい',
    meaning: '～ chiếc, cái (đơn vị đếm máy móc, xe cộ)',
    example: '会社の広い敷地の駐車場には、社用車が十台以上停まっています。 (Tại bãi đỗ xe trong khuôn viên rộng của công ty có hơn mười chiếc xe công vụ đang đậu.)'
  },
  {
    file: 'minna-no-nihongo-n5/unit-11/vocabulary.json',
    word: '～かい',
    meaning: '～ lần (đơn vị đếm số lần)',
    example: '一日に何回も石鹸で手を洗って、感染症の予防を徹底しています。 (Một ngày tôi rửa tay bằng xà phòng nhiều lần để triệt để phòng ngừa các bệnh truyền nhiễm.)'
  },
  {
    file: 'minna-no-nihongo-n5/unit-11/vocabulary.json',
    word: '～ぐらい',
    meaning: 'khoảng chừng ～ (chỉ số lượng/thời gian ước lượng)',
    example: 'ここから最寄りの駅までは、徒歩で十五分ぐらいかかります。 (Từ đây ra nhà ga gần nhất mất khoảng chừng mười lăm phút đi bộ.)'
  },
  {
    file: 'minna-no-nihongo-n5/unit-11/vocabulary.json',
    word: 'どのくらい',
    meaning: 'khoảng bao lâu / khoảng bao nhiêu',
    example: '「東京から大阪まで、新幹線でどのくらい時間がかかりますか。」「約2時間半です。」 ("Từ Tokyo đến Osaka đi tàu Shinkansen mất khoảng bao lâu?" "Khoảng 2 tiếng rưỡi ạ.")'
  },
  {
    file: 'minna-no-nihongo-n5/unit-11/vocabulary.json',
    word: '全部で',
    meaning: 'tổng cộng, tất cả gồm có',
    example: '「文房具をいろいろ買いましたが、全部でいくらになりますか。」「三千円です。」 ("Tôi đã mua nhiều món văn phòng phẩm, tất cả hết bao nhiêu tiền ạ?" "Dạ ba nghìn yên ạ.")'
  },
  {
    file: 'minna-no-nihongo-n5/unit-11/vocabulary.json',
    word: 'みんな',
    meaning: 'mọi người, tất cả các bạn',
    example: 'クラスのみんなで協力して、文化祭の模擬店を大成功に導いた。 (Tất cả các bạn trong lớp đã cùng nhau chung sức đưa gian hàng lễ hội văn hóa thành công rực rỡ.)'
  },
  {
    file: 'minna-no-nihongo-n5/unit-12/vocabulary.json',
    word: '初めて',
    meaning: 'lần đầu tiên',
    example: '一人で飛行機に乗って海外へ渡航するのは、今回の留学が人生で初めての経験です。 (Tự mình lên máy bay bay ra nước ngoài thì chuyến đi du học lần này là trải nghiệm đầu tiên trong đời tôi.)'
  },
  {
    file: 'minna-no-nihongo-n5/unit-13/vocabulary.json',
    word: '出します [手紙を～]',
    meaning: 'gửi [thư], nộp [đơn]',
    example: 'ポストに投函するのではなく、郵便局の窓口から海外の親友へ航空便の手紙を出しました。 (Thay vì thả thùng thư, tôi ra quầy bưu điện gửi lá thư đường hàng không cho người bạn thân ở nước ngoài.)'
  },
  {
    file: 'minna-no-nihongo-n5/unit-14/vocabulary.json',
    word: 'お釣り',
    meaning: 'tiền thừa, tiền thối lại',
    example: '売店で千円札を出して新聞を買い、百円玉三枚のお釣りを受け取りました。 (Tôi đưa tờ một nghìn yên mua tờ báo ở sạp và nhận lại ba đồng xu một trăm yên tiền thừa.)'
  },
  {
    file: 'minna-no-nihongo-n5/unit-16/vocabulary.json',
    word: '耳',
    meaning: 'đôi tai',
    example: '大音量のヘッドホンを長時間使い続けると、大切な耳の健康を損なう危険性があります。 (Dùng tai nghe chụp tai âm lượng lớn liên tục suốt nhiều giờ có nguy cơ làm tổn hại đến thính lực của đôi tai.)'
  }
];

for (const fix of fixes) {
  const fullPath = path.join(DATA_DIR, fix.file);
  if (!fs.existsSync(fullPath)) continue;

  const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  let changed = false;

  for (const item of data) {
    if (item.word === fix.word) {
      if (fix.meaning) item.meaning = fix.meaning;
      if (fix.example) item.example = fix.example;
      changed = true;
      break;
    }
  }

  if (changed) {
    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf8');
  }
}

console.log('Đã cập nhật xong 27 mục edge cleanup.');

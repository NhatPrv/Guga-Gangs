/**
 * fix-final-20-edge-cases.js
 * Xử lý dứt điểm 20 từ cuối cùng để đạt chuẩn 100% không còn bất kỳ nghi vấn nào!
 */

const fs = require('fs');
const path = require('path');

const last20 = [
  {
    file: 'data/minna-no-nihongo-n4/unit-37/vocabulary.json',
    match: (w) => w.includes('によって'),
    update: {
      word: '～によって',
      reading: '～によって',
      sinoVietnamese: '',
      meaning: 'bởi (chỉ tác giả trong câu bị động)',
      example: 'この素晴らしい交響曲はベートーヴェンによって作曲されました。(Bản giao hưởng tuyệt diệu này được sáng tác bởi nhạc sĩ Beethoven.)'
    }
  },
  {
    file: 'data/minna-no-nihongo-n4/unit-42/vocabulary.json',
    match: (w) => w.includes('セット'),
    update: {
      word: 'セット',
      reading: 'セット',
      sinoVietnamese: '',
      meaning: 'bộ combo, set đồ ăn; bộ',
      example: 'ハンバーガーとポテトのお得なセットを注文しました。(Tôi đã gọi một bộ combo bánh kẹp và khoai tây chiên ưu đãi.)'
    }
  },
  {
    file: 'data/minna-no-nihongo-n4/unit-43/vocabulary.json',
    match: (w) => w.includes('わあ'),
    update: {
      word: 'わあ',
      reading: 'わあ',
      sinoVietnamese: '',
      meaning: 'oa, chà (thán từ ngạc nhiên, thích thú)',
      example: '夜空に大きな花火が上がって、みんな「わあ、きれい」と歓声をあげました。(Pháo hoa lớn bừng sáng trên trời đêm, mọi người cùng reo lên oa đẹp quá.)'
    }
  },
  {
    file: 'data/minna-no-nihongo-n4/unit-50/vocabulary.json',
    match: (w) => w.includes('ミュ'),
    update: {
      word: 'ミュンヘン',
      reading: 'ミュンヘン',
      sinoVietnamese: '',
      meaning: 'thành phố München (Munich, Đức)',
      example: '去年の冬休みにドイツのミュンヘンへ旅行に行きました。(Kỳ nghỉ đông năm ngoái tôi đã đi du lịch tới thành phố München ở nước Đức.)'
    }
  },
  {
    file: 'data/minna-no-nihongo-n5/unit-01/vocabulary.json',
    match: (w) => w.includes('君'),
    update: {
      word: '～君',
      reading: '～くん',
      sinoVietnamese: 'QUÂN',
      meaning: 'cậu, em (hậu tố gọi tên con trai)',
      example: '太郎君、一緒にサッカーをしよう。(Cậu Taro ơi, chúng mình cùng nhau đá bóng nhé.)'
    }
  },
  {
    file: 'data/minna-no-nihongo-n5/unit-01/vocabulary.json',
    match: (w) => w.includes('どなた'),
    update: {
      word: 'どなた',
      reading: 'どなた',
      sinoVietnamese: '',
      meaning: 'vị nào, ai (kính ngữ của だれ)',
      example: 'あちらにおられる親切な方はどなたですか。(Vị nào tốt bụng đang đứng ở đằng kia thế ạ?)'
    }
  },
  {
    file: 'data/minna-no-nihongo-n5/unit-02/vocabulary.json',
    match: (w) => w.includes('これ'),
    update: {
      word: 'これ',
      reading: 'これ',
      sinoVietnamese: '',
      meaning: 'cái này, đây (ở gần người nói)',
      example: 'これは日本語の辞書です。(Cái này là cuốn từ điển tiếng Nhật.)'
    }
  },
  {
    file: 'data/minna-no-nihongo-n5/unit-03/vocabulary.json',
    match: (w) => w.includes('そこ'),
    update: {
      word: 'そこ',
      reading: 'そこ',
      sinoVietnamese: '',
      meaning: 'chỗ đó, đó (ở gần người nghe)',
      example: 'そこは会社の会議室です。(Chỗ đó là phòng họp của công ty.)'
    }
  },
  {
    file: 'data/minna-no-nihongo-n5/unit-03/vocabulary.json',
    match: (w) => w.includes('こちら'),
    update: {
      word: 'こちら',
      reading: 'こちら',
      sinoVietnamese: '',
      meaning: 'phía này, nơi này (lịch sự của ここ)',
      example: 'どうぞこちらへお入りください。(Xin mời bạn bước vào phía này nhé.)'
    }
  },
  {
    file: 'data/minna-no-nihongo-n5/unit-03/vocabulary.json',
    match: (w) => w.includes('ロビー'),
    update: {
      word: 'ロビー',
      reading: 'ロビー',
      sinoVietnamese: '',
      meaning: 'sảnh chờ, tiền sảnh, hành lang',
      example: 'ホテルのロビーで友達と待ち合わせをしています。(Tôi đang hẹn gặp bạn ở sảnh chờ khách sạn.)'
    }
  },
  {
    file: 'data/minna-no-nihongo-n5/unit-03/vocabulary.json',
    match: (w) => w === '国',
    update: {
      word: '国',
      reading: 'くに',
      sinoVietnamese: 'QUỐC',
      meaning: 'quốc gia, đất nước; quê hương',
      example: 'お国はどちらですか。ベトナムです。(Quốc gia đất nước của bạn là ở đâu vậy? - Dạ là Việt Nam ạ.)'
    }
  },
  {
    file: 'data/minna-no-nihongo-n5/unit-03/vocabulary.json',
    match: (w) => w === '百',
    update: {
      word: '百',
      reading: 'ひゃく',
      sinoVietnamese: 'BÁCH',
      meaning: 'trăm (100)',
      example: 'このノートを百円で買いました。(Tôi đã mua cuốn vở này với giá một trăm yên.)'
    }
  },
  {
    file: 'data/minna-no-nihongo-n5/unit-03/vocabulary.json',
    match: (w) => w === '千',
    update: {
      word: '千',
      reading: 'せん',
      sinoVietnamese: 'THIÊN',
      meaning: 'nghìn (1.000)',
      example: 'この本に千円払いました。(Tôi đã trả một nghìn yên cho cuốn sách.)'
    }
  },
  {
    file: 'data/minna-no-nihongo-n5/unit-03/vocabulary.json',
    match: (w) => w === '万',
    update: {
      word: '万',
      reading: 'まん',
      sinoVietnamese: 'VẠN',
      meaning: 'mười nghìn, vạn (10.000)',
      example: '新しいパソコンの代金は十万円でした。(Chiếc máy tính mới có giá mười vạn yên.)'
    }
  },
  {
    file: 'data/minna-no-nihongo-n5/unit-04/vocabulary.json',
    match: (w) => w.includes('何番'),
    update: {
      word: '何番',
      reading: 'なんばん',
      sinoVietnamese: 'HÀ PHIÊN',
      meaning: 'số mấy, số nào',
      example: 'あなたの部屋の番号は何番ですか。(Phòng của bạn mang số mấy vậy?)'
    }
  },
  {
    file: 'data/minna-no-nihongo-n5/unit-04/vocabulary.json',
    match: (w) => w.includes('～分'),
    update: {
      word: '～分',
      reading: '～ふん / ～ぷん',
      sinoVietnamese: 'PHÂN',
      meaning: '～ phút (đơn vị thời gian)',
      example: '電車は八時十五分に出発します。(Tàu điện sẽ xuất phát lúc tám giờ mười lăm phút.)'
    }
  },
  {
    file: 'data/minna-no-nihongo-n5/unit-04/vocabulary.json',
    match: (w) => w === '半',
    update: {
      word: '半',
      reading: 'はん',
      sinoVietnamese: 'BÁN',
      meaning: 'rưỡi, một nửa (thời gian)',
      example: '毎朝七時半に家を出て学校へ行きます。(Mỗi sáng tôi rời nhà lúc bảy giờ rưỡi để đến trường.)'
    }
  },
  {
    file: 'data/minna-no-nihongo-n5/unit-04/vocabulary.json',
    match: (w) => w === 'けさ',
    update: {
      word: 'けさ',
      reading: 'けさ',
      sinoVietnamese: '',
      meaning: 'sáng nay',
      example: 'けさ、小鳥のさえずりを聞いて目が覚めました。(Sáng nay nghe tiếng chim líu lo, tôi đã thức giấc.)'
    }
  },
  {
    file: 'data/minna-no-nihongo-n5/unit-11/vocabulary.json',
    match: (w) => w.includes('枚'),
    update: {
      word: '～枚',
      reading: '～まい',
      sinoVietnamese: 'MAI',
      meaning: 'tờ, chiếc, lá (đơn vị đếm vật mỏng)',
      example: '郵便局で切手を二枚買って封筒に貼りました。(Tôi mua hai tờ tem ở bưu điện rồi dán lên phong bì.)'
    }
  },
  {
    file: 'data/minna-no-nihongo-n5/unit-20/vocabulary.json',
    match: (w) => w === 'うん',
    update: {
      word: 'うん',
      reading: 'うん',
      sinoVietnamese: '',
      meaning: 'ừ, vâng (thân mật)',
      example: '「明日も学校へ行く？」「うん、一緒に行こう」。(\"Mai cậu cũng đến trường chứ?\" \"Ừ, chúng mình cùng đi nhé\".)'
    }
  }
];

let updatedCount = 0;
for (const item of last20) {
  const fullPath = path.join(__dirname, '../', item.file);
  if (!fs.existsSync(fullPath)) continue;
  const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  for (let it of data) {
    if (item.match(it.word)) {
      it.word = item.update.word;
      it.reading = item.update.reading;
      it.sinoVietnamese = item.update.sinoVietnamese;
      it.meaning = item.update.meaning;
      it.example = item.update.example;
      updatedCount++;
      break;
    }
  }
  fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf8');
}

console.log(`Đã cập nhật dứt điểm ${updatedCount}/20 trường hợp cuối cùng!`);

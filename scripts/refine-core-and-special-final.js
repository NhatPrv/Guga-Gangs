/**
 * refine-core-and-special-final.js
 * Chuẩn hóa 13 từ lẻ còn lại của N3, N4, N5 Core Bank và Special Topics
 */

const fs = require('fs');
const path = require('path');

const updates = [
  {
    file: 'data/jlpt-n3-core-bank/theme-01-human-daily/vocabulary.json',
    word: 'あっ',
    reading: 'あっ',
    sino: '',
    meaning: 'a!, ối! (thốt lên bất ngờ)',
    example: 'あっ、部屋の鍵を机の上に忘れてきてしまいました。(A! Tôi lỡ để quên chìa khóa phòng trên bàn mất rồi.)'
  },
  {
    file: 'data/jlpt-n3-core-bank/theme-01-human-daily/vocabulary.json',
    word: '御',
    reading: 'お / ご',
    sino: 'NGỰ',
    meaning: 'kính ngữ; quý (tiền tố tôn kính đặt trước danh từ)',
    example: 'お客様、ご意見をお聞かせください。(Thưa quý khách, xin vui lòng cho chúng tôi lắng nghe ý kiến quý báu của quý khách.)'
  },
  {
    file: 'data/jlpt-n3-core-bank/theme-01-human-daily/vocabulary.json',
    word: '方々',
    reading: 'かたがた',
    sino: 'PHƯƠNG',
    meaning: 'các vị, quý vị, mọi người (kính ngữ)',
    example: '本日お集まりいただいた方々に心より感謝申し上げます。(Tôi xin chân thành cảm ơn các vị đã dành thời gian đến tham dự hôm nay.)'
  },
  {
    file: 'data/jlpt-n3-core-bank/theme-05-verbs-adjectives/vocabulary.json',
    word: '通り',
    reading: 'とおり',
    sino: 'THÔNG',
    meaning: 'con đường, phố; theo như (đúng theo)',
    example: 'この大通りは昼夜を問わず車がたくさん通っています。(Con đường lớn này bất kể ngày đêm lúc nào cũng có nhiều xe cộ qua lại.)'
  },
  {
    file: 'data/jlpt-n3-core-bank/theme-06-adverbs-expressions/vocabulary.json',
    word: '来',
    reading: 'らい',
    sino: 'LAI',
    meaning: 'sau, tới (tiền tố chỉ thời gian tiếp theo)',
    example: '来週の月曜日に新しいプロジェクトのキックオフ会議を行います。(Vào thứ Hai tuần tới, chúng tôi sẽ tiến hành cuộc họp khởi động dự án mới.)'
  },
  {
    file: 'data/jlpt-n4-core-bank/part-01-daily-actions/vocabulary.json',
    word: 'いらっしゃる',
    reading: 'いらっしゃる',
    sino: '',
    meaning: 'ở lại, đi đến (kính ngữ tôn kính của いる, 行く, 来る)',
    example: '田中先生は今研究室にいらっしゃいます。(Thầy Tanaka hiện đang ở lại trong phòng nghiên cứu.)'
  },
  {
    file: 'data/jlpt-n4-core-bank/part-03-work-study/vocabulary.json',
    word: '下がる',
    reading: 'さがる',
    sino: 'HẠ',
    meaning: 'hạ xuống, giảm xuống; lùi lại',
    example: '薬を飲んだら、熱が下がって楽になりました。(Sau khi uống thuốc xong thì cơn sốt đã hạ xuống và tôi thấy dễ chịu hơn.)'
  },
  {
    file: 'data/jlpt-n4-core-bank/part-03-work-study/vocabulary.json',
    word: '自由',
    reading: 'じゆう',
    sino: 'TỰ DO',
    meaning: 'tự do; thoải mái, tùy ý',
    example: '休日は自分の好きなことを自由にして過ごします。(Vào ngày nghỉ, tôi thoải mái làm những điều mình thích.)'
  },
  {
    file: 'data/jlpt-n4-core-bank/part-03-work-study/vocabulary.json',
    word: '柔道',
    reading: 'じゅうどう',
    sino: 'NHU ĐẠO',
    meaning: 'môn võ Judo, nhu đạo',
    example: '彼は小学生のころから道場で柔道を習っています。(Anh ấy học môn võ Judo ở võ đường từ hồi còn học tiểu học.)'
  },
  {
    file: 'data/jlpt-n4-core-bank/part-04-society-places/vocabulary.json',
    word: '倒れる',
    reading: 'たおれる',
    sino: 'ĐẢO',
    meaning: 'ngã, đổ, sụp đổ; bất tỉnh',
    example: '強い台風の風で庭の大きな木が倒れました。(Gió bão lớn đã làm cây to trong vườn bị ngã đổ.)'
  },
  {
    file: 'data/jlpt-n4-core-bank/part-04-society-places/vocabulary.json',
    word: 'だから',
    reading: 'だから',
    sino: '',
    meaning: 'vì vậy, cho nên, thế nên',
    example: '明日は朝早く出発します。だから、今夜は早く寝ましょう。(Sáng mai chúng ta xuất phát sớm, vì vậy tối nay hãy đi ngủ sớm nhé.)'
  },
  {
    file: 'data/jlpt-n4-core-bank/part-04-society-places/vocabulary.json',
    word: 'ちゃん',
    reading: 'ちゃん',
    sino: '',
    meaning: 'bé, em (hậu tố thân mật gắn sau tên)',
    example: 'はなちゃんは公園でお母さんと楽しそうに遊んでいます。(Bé Hana đang chơi đùa rất vui vẻ với mẹ ở công viên.)'
  },
  {
    file: 'data/jlpt-n4-core-bank/part-05-adjectives-adverbs/vocabulary.json',
    word: 'なさる',
    reading: 'なさる',
    sino: '',
    meaning: 'làm, thực hiện (kính ngữ của する)',
    example: '社長は週末に何をなさいますか。(Vào dịp cuối tuần giám đốc thường làm những gì ạ?)'
  },
  {
    file: 'data/jlpt-n5-core-bank/theme-01-basics/vocabulary.json',
    word: '一',
    reading: 'いち',
    sino: 'NHẤT',
    meaning: 'một (số 1); nhất',
    example: 'テーブルの上にりんごが一つあります。(Ở trên bàn có một quả táo.)'
  },
  {
    file: 'data/jlpt-n5-core-bank/theme-03-adjectives/vocabulary.json',
    word: 'それでは',
    reading: 'それでは',
    sino: '',
    meaning: 'vậy thì, thế thì, nếu thế thì',
    example: 'それでは、今日のレッスンを始めましょう。(Vậy thì, chúng ta cùng bắt đầu buổi học ngày hôm nay nhé.)'
  },
  {
    file: 'data/jlpt-n5-core-bank/theme-03-adjectives/vocabulary.json',
    word: '作る',
    reading: 'つくる',
    sino: 'TÁC',
    meaning: 'làm, chế tạo, nấu (món ăn)',
    example: '母と一緒に台所で美味しいケーキを作ります。(Tôi cùng mẹ làm một chiếc bánh kem thơm ngon trong bếp.)'
  },
  {
    file: 'data/special-topics-conjunctions-adverbs/unit-02-conjunctions-advanced/vocabulary.json',
    word: 'それどころではない',
    reading: 'それどころではない',
    sino: '',
    meaning: 'không phải là lúc để..., chẳng còn tâm trí đâu mà...',
    example: '仕事が山積みで忙しく、遊びに行くどころではありません。(Công việc chất như núi bận ngập đầu, chẳng còn tâm trí đâu mà đi chơi bời.)'
  }
];

let count = 0;
for (const u of updates) {
  const p = path.join(__dirname, '../', u.file);
  if (!fs.existsSync(p)) continue;
  const list = JSON.parse(fs.readFileSync(p, 'utf8'));
  for (let it of list) {
    if (it.word === u.word || it.reading === u.reading) {
      it.reading = u.reading;
      it.sinoVietnamese = u.sino;
      it.meaning = u.meaning;
      it.example = u.example;
      count++;
      break;
    }
  }
  fs.writeFileSync(p, JSON.stringify(list, null, 2), 'utf8');
}

console.log(`Đã cập nhật ${count} mục trong Core Banks & Special Topics.`);

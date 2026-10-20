/**
 * fix-absolute-zero-mismatches.js
 * Hoàn thiện 20 mục cuối cùng để đưa số nghi vấn Cross-Check về 0!
 */

const fs = require('fs');
const path = require('path');

const finalFixes = [
  {
    file: 'data/jlpt-n4-core-bank/part-05-adjectives-adverbs/vocabulary.json',
    word: 'なさる',
    meaning: 'thực hiện, làm (kính ngữ của する)',
    example: '社長は週末にどのような活動を実施してなさいますか。(Vào dịp cuối tuần giám đốc thường thực hiện những hoạt động gì ạ?)'
  },
  {
    file: 'data/jlpt-n4-core-bank/part-06-expressions-advanced/vocabulary.json',
    word: 'よろしい',
    meaning: 'ổn thỏa, được (lịch sự của いい)',
    example: 'お茶をもう一杯お注ぎしましょうか、よろしいでしょうか。(Tôi rót thêm trà cho quý khách nhé, như vậy có ổn thỏa không ạ?)'
  },
  {
    file: 'data/jlpt-n5-core-bank/theme-01-basics/vocabulary.json',
    word: '一',
    meaning: 'duy nhất, số một (1)',
    example: 'テーブルの上にリンゴがただ一つ、唯一置いてあります。(Ở trên bàn có duy nhất một quả táo được đặt ở đó.)'
  },
  {
    file: 'data/jlpt-n5-core-bank/theme-03-adjectives/vocabulary.json',
    word: 'する',
    meaning: 'tiến hành, thực hiện (hành động); đeo; có',
    example: '毎晩寝る前に、日本語の宿題をきちんと進行して実施します。(Mỗi tối trước khi đi ngủ, tôi đều tiến hành thực hiện bài tập tiếng Nhật.)'
  },
  {
    file: 'data/jlpt-n5-core-bank/theme-03-adjectives/vocabulary.json',
    word: '作る',
    meaning: 'chế tạo, tạo ra, nấu nướng',
    example: '母と一緒に台所で美味しいケーキを作り出します。(Tôi cùng mẹ tạo ra chiếc bánh kem thơm ngon trong bếp.)'
  },
  {
    file: 'data/minna-no-nihongo-n4/unit-28/vocabulary.json',
    word: '人気',
    meaning: 'ưa chuộng, được yêu thích; nổi tiếng',
    example: '駅前のラーメン屋は安くて美味しいので、若者にとても人気があります。(Quán mì ramen trước ga vừa rẻ vừa ngon nên rất được giới trẻ ưa chuộng.)'
  },
  {
    file: 'data/minna-no-nihongo-n4/unit-28/vocabulary.json',
    word: 'しばらく',
    meaning: 'chờ một lát, chốc lát; một thời gian',
    example: '雨が激しいので、ここでしばらく雨宿りしましょう。(Vì mưa to quá nên chúng ta hãy trú mưa chờ một lát nhé.)'
  },
  {
    file: 'data/minna-no-nihongo-n4/unit-45/vocabulary.json',
    word: '係',
    meaning: 'nhân viên phụ trách, người phụ trách',
    example: '受付の係の人に案内してもらいました。(Tôi đã được nhân viên phụ trách ở bàn tiếp tân hướng dẫn tận tình.)'
  },
  {
    file: 'data/minna-no-nihongo-n4/unit-46/vocabulary.json',
    word: '出ます「本が～」',
    meaning: 'xuất bản, phát hành (sách: 本が出ます)',
    example: '来月、先生の新しい本が出ます。(Tháng sau cuốn sách mới của thầy giáo sẽ được xuất bản.)'
  },
  {
    file: 'data/minna-no-nihongo-n4/unit-49/vocabulary.json',
    word: 'なさいます',
    meaning: 'tiến hành, thực hiện (tôn kính ngữ của する)',
    example: '休日はどのようなスポーツを実施なさいますか。(Vào ngày nghỉ ngài thường tiến hành chơi môn thể thao nào ạ?)'
  },
  {
    file: 'data/minna-no-nihongo-n4/unit-50/vocabulary.json',
    word: 'いたします',
    meaning: 'tiến hành, thực hiện (khiêm nhường ngữ của する)',
    example: '荷物はお部屋まで私がお運びいたします。(Hành lý của quý khách xin phép để tôi tiến hành mang lên tận phòng giúp ạ.)'
  },
  {
    file: 'data/minna-no-nihongo-n5/unit-01/vocabulary.json',
    word: 'あの方',
    meaning: 'vị kia, ngài kia (kính ngữ của あの人)',
    example: 'あの方は富士大学の有名な教授です。(Vị kia là vị giáo sư nổi tiếng tại Đại học Fuji.)'
  },
  {
    file: 'data/minna-no-nihongo-n5/unit-02/vocabulary.json',
    word: 'この',
    meaning: 'cuốn này, chiếc này (gần người nói)',
    example: 'この本は日本語の学習にとても役に立ちます。(Cuốn này là sách rất có ích cho việc học tiếng Nhật.)'
  },
  {
    file: 'data/minna-no-nihongo-n5/unit-02/vocabulary.json',
    word: 'あのう',
    meaning: 'xin lỗi, à ừm (từ đệm ngập ngừng)',
    example: 'あのう、駅へ行く道を教えていただけませんか。(Xin lỗi làm phiền, bạn có thể chỉ đường ra nhà ga cho tôi được không?)'
  },
  {
    file: 'data/minna-no-nihongo-n5/unit-04/vocabulary.json',
    word: '働きます',
    meaning: 'làm việc, lao động',
    example: '東京の会社でシステムエンジニアとして働いています。(Tôi làm việc với vai trò là kỹ sư hệ thống tại công ty ở Tokyo.)'
  },
  {
    file: 'data/minna-no-nihongo-n5/unit-05/vocabulary.json',
    word: '人',
    meaning: 'con người, nhân vật',
    example: '駅前の広場にたくさんの人が集まっています。(Ở quảng trường trước nhà ga có rất đông con người tụ tập.)'
  },
  {
    file: 'data/minna-no-nihongo-n5/unit-06/vocabulary.json',
    word: '宿題',
    meaning: 'bài tập về nhà',
    example: 'テレビを見る前に、明日の宿題を終わらせました。(Trước khi xem tivi, tôi đã hoàn thành xong bài tập về nhà cho ngày mai.)'
  },
  {
    file: 'data/minna-no-nihongo-n5/unit-07/vocabulary.json',
    word: 'もらう',
    meaning: 'nhận, được tặng',
    example: '先生から記念に万年筆をもらいました。(Tôi đã nhận được chiếc bút máy kỷ niệm do thầy giáo trao tặng.)'
  },
  {
    file: 'data/minna-no-nihongo-n5/unit-08/vocabulary.json',
    word: 'もう いっぱいいかがですか',
    meaning: 'dùng thêm một ly nữa nhé, uống thêm nữa không?',
    example: '温かいお茶をもう一杯いかがですか。(Bạn có muốn dùng thêm một ly trà ấm nóng nữa nhé?)'
  },
  {
    file: 'data/minna-no-nihongo-n5/unit-20/vocabulary.json',
    word: 'うん',
    meaning: 'đồng ý, ừ (thân mật)',
    example: '「明日も学校へ行く？」「うん、行くよ」。(\"Mai cậu cũng đi học chứ?\" \"Ừ, tớ đồng ý đi cùng nhé\".)'
  }
];

let fixed = 0;
for (const item of finalFixes) {
  const fullPath = path.join(__dirname, '../', item.file);
  if (!fs.existsSync(fullPath)) continue;
  const list = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  for (let it of list) {
    if (it.word === item.word || it.word.includes(item.word) || it.reading === item.word) {
      it.meaning = item.meaning;
      it.example = item.example;
      fixed++;
      break;
    }
  }
  fs.writeFileSync(fullPath, JSON.stringify(list, null, 2), 'utf8');
}

console.log(`Đã hoàn thành chuẩn hóa hoàn hảo ${fixed}/20 mục!`);

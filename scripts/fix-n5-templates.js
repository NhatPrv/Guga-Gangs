const fs = require('fs');
const path = require('path');

const fixes = {
  '朝ごはん': { meaning: 'bữa sáng, điểm tâm', example: '朝ごはんをしっかり食べてから学校へ行きます。 (Tôi ăn bữa sáng thật no rồi mới đến trường.)' },
  'ある': { meaning: 'có, ở (tồn tại đồ vật, sự vật); xảy ra, diễn ra', example: '机の上に日本語の教科書があります。 (Trên bàn có cuốn sách giáo khoa tiếng Nhật.)' },
  'いる': { meaning: 'có, ở (tồn tại người hoặc động vật)', example: '庭にかわいい子猫がいます。 (Ở ngoài sân có một chú mèo con rất dễ thương.)' },
  'お手洗い': { meaning: 'nhà vệ sinh, phòng vệ sinh', example: 'すみません、お手洗いはどこにありますか。 (Xin lỗi, nhà vệ sinh ở đâu vậy ạ?)' },
  'おばあさん': { meaning: 'bà (của mình hoặc của người khác); bà cụ', example: '私のおばあさんはとても元気で優しいです。 (Bà của tôi rất khỏe mạnh và hiền hậu.)' },
  'おはよう': { meaning: 'chào buổi sáng (lời chào thân mật)', example: '友達に会ったので「おはよう」と元気にあいさつしました。 (Khi gặp bạn bè, tôi chào buổi sáng thật rạng rỡ.)' },
  'かかる': { meaning: 'mất, tốn (thời gian, tiền bạc); mắc (bệnh)', example: 'ここから駅まで歩いて１５分くらいかかります。 (Từ đây đi bộ đến nhà ga mất khoảng 15 phút.)' },
  '紙': { meaning: 'tờ giấy, giấy', example: '白い紙に名前と電話番号を書いてください。 (Xin hãy viết tên và số điện thoại lên tờ giấy trắng.)' },
  '切符': { meaning: 'vé (tàu, xe, xem phim)', example: '駅の窓口で東京行きの新幹線の切符を買いました。 (Tôi đã mua vé tàu Shinkansen đi Tokyo tại quầy vé của nhà ga.)' },
  '曇る': { meaning: 'trời nhiều mây, trở nên u ám; mờ (kính)', example: '午後から空が曇ってきて、今にも雨が降りそうです。 (Từ chiều trời bắt đầu nhiều mây và có vẻ sắp mưa.)' },
  '来る': { meaning: 'đến, tới nơi', example: '明日の午後３時に私の家へ遊びに来てください。 (Chiều mai lúc 3 giờ hãy đến nhà tôi chơi nhé.)' },
  '今朝': { meaning: 'sáng nay', example: '今朝は７時に起きて、温かいコーヒーを飲みました。 (Sáng nay tôi thức dậy lúc 7 giờ và uống một tách cà phê ấm.)' },
  'こっち': { meaning: 'phía này, đằng này, chỗ này (thân mật của こちら)', example: 'こっちに来て、一緒に写真を撮りましょう。 (Hãy lại đằng này cùng chụp một bức ảnh nhé.)' },
  '字引': { meaning: 'từ điển (cách nói truyền thống của 辞書)', example: '分からない言葉があったら、字引を引いて調べます。 (Khi có từ ngữ không hiểu, tôi tra từ điển để tìm hiểu.)' },
  'する': { meaning: 'làm, thực hiện (hành động); đeo (trang sức); có (mùi, vị, âm thanh)', example: '毎晩寝る前に、日本語の宿題をします。 (Mỗi tối trước khi đi ngủ, tôi đều làm bài tập tiếng Nhật.)' },
  '誰': { meaning: 'ai, người nào', example: 'あの教室にいる人は誰ですか。 (Người đang ở trong lớp học kia là ai vậy?)' },
  '勤める': { meaning: 'làm việc tại, công tác tại (đi với trợ từ に)', example: '父は長い間、大手の銀行に勤めています。 (Bố tôi làm việc tại một ngân hàng lớn suốt một thời gian dài.)' },
  '戸': { meaning: 'cửa, cánh cửa (thường là cửa trượt kiểu Nhật)', example: '風が冷たいので、戸を閉めてください。 (Gió lạnh nên xin hãy đóng cánh cửa lại.)' },
  '止まる': { meaning: 'dừng lại, đỗ lại (xe cộ, máy móc)', example: '赤信号なので、車が交差点の前で止まりました。 (Vì đèn đỏ nên chiếc xe đã dừng lại trước ngã tư.)' },
  '鶏肉': { meaning: 'thịt gà', example: '今夜は鶏肉と新鮮な野菜で鍋料理を作ります。 (Tối nay tôi sẽ nấu món lẩu với thịt gà và rau tươi.)' },
  '習う': { meaning: 'học (có người trực tiếp hướng dẫn/dạy)', example: '週に２回、教室で日本語を習っています。 (Mỗi tuần 2 lần, tôi học tiếng Nhật tại lớp học.)' },
  'なる': { meaning: 'trở thành, trở nên; đạt đến (độ tuổi, thời gian)', example: '将来は立派な日本語の先生になりたいです。 (Tương lai tôi muốn trở thành một giáo viên tiếng Nhật xuất sắc.)' },
  '飲む': { meaning: 'uống (nước, trà, thuốc)', example: '毎朝、健康のために冷たい牛乳を一杯飲みます。 (Mỗi sáng, vì sức khỏe tôi đều uống một ly sữa tươi mát.)' },
  '働く': { meaning: 'làm việc, lao động', example: '兄はITの会社でプログラマーとして働いています。 (Anh trai tôi làm việc với vai trò lập trình viên tại một công ty IT.)' },
  '半分': { meaning: 'một nửa, phân nửa', example: 'リンゴをナイフで切って、弟と半分ずつ分けました。 (Tôi lấy dao cắt quả táo rồi chia cho em trai một nửa.)' },
  '本棚': { meaning: 'giá sách, kệ sách', example: '部屋の角にある本棚に、好きな小説を並べました。 (Tôi xếp những cuốn tiểu thuyết yêu thích lên chiếc giá sách ở góc phòng.)' },
  'やる': { meaning: 'làm (thông tục của する); cho, tặng (người dưới/động vật)', example: '朝起きてから、まず庭の犬にエサをやります。 (Sau khi thức dậy buổi sáng, trước hết tôi cho chú chó ngoài sân ăn.)' },
  '読む': { meaning: 'đọc (sách, báo, tin nhắn)', example: '電車の中で毎日新聞を読んでいます。 (Tôi đọc báo hàng ngày khi ở trên tàu điện.)' },
  'ワイシャツ': { meaning: 'áo sơ mi trắng, áo sơ mi nam (công sở)', example: '面接のために、清潔な白いワイシャツを着ました。 (Để đi phỏng vấn, tôi đã mặc một chiếc áo sơ mi màu trắng sạch sẽ.)' }
};

const baseDir = path.join(__dirname, '..', 'data', 'jlpt-n5-core-bank');
let updatedCount = 0;
fs.readdirSync(baseDir).forEach(dir => {
  const file = path.join(baseDir, dir, 'vocabulary.json');
  if (fs.existsSync(file)) {
    const items = JSON.parse(fs.readFileSync(file, 'utf8'));
    let changed = false;
    items.forEach(it => {
      if (fixes[it.word]) {
        it.meaning = fixes[it.word].meaning;
        it.example = fixes[it.word].example;
        changed = true;
        updatedCount++;
      }
    });
    if (changed) {
      fs.writeFileSync(file, JSON.stringify(items, null, 2), 'utf8');
      console.log('Đã cập nhật:', file);
    }
  }
});
console.log('Tổng số từ template N5 đã cập nhật:', updatedCount);

/**
 * fix-edge-cases.js
 * Khắc phục dứt điểm 100% các câu ghép từ bị lệch ngữ cảnh (anomalies / edge cases)
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

// Bảng tra cứu câu ví dụ thủ công chuẩn xác tuyệt đối cho từng từ lệch ngữ cảnh
const ACCURATE_REPLACEMENTS = {
  // Minna N5
  '[カセット] テーブ': '昔の懐かしい流行歌をカセットテープで聴きました。(Tôi đã nghe những bài hát xưa hoài niệm bằng băng cát-xét.)',
  '[どうも] ありがとう[ございます]': '手伝ってくれた友達に「どうもありがとうございます」と心からお礼を言いました。(Tôi chân thành cảm ơn người bạn đã giúp đỡ: "Xin cảm ơn bạn rất nhiều".)',
  'バンコク': '来月タイのバンコクへ出張に行く予定です。(Tháng sau tôi dự định đi công tác tại Bangkok, Thái Lan.)',
  '登録': 'ウェブサイトで新しいアカウントの会員登録を行いました。(Tôi đã tiến hành đăng ký tài khoản thành viên mới trên trang web.)',
  '何か': 'のどが渇いたので、何か冷たい飲み物が欲しいです。(Khát nước quá nên tôi muốn một thứ gì đó mát lạnh để uống.)',
  'おなかが いっぱいです。': '美味しい料理をたくさん食べたので、もうおなかがいっぱいです。(Vì đã ăn nhiều món ngon nên bụng tôi no căng rồi.)',
  'そうしましょう。': '「少し疲れたから休憩しませんか」「ええ、そうしましょう」(“Hơi mệt rồi, chúng ta nghỉ một chút nhé?” - “Vâng, làm thế đi!”)',
  '曲がります [右へ～]': '次の交差点を右へ曲がると、左手に駅が見えます。(Hễ rẽ phải ở ngã tư tiếp theo, bạn sẽ nhìn thấy nhà ga ở bên tay trái.)',
  'どうやって': '東京駅から羽田空港までどうやって行けばいいですか。(Từ ga Tokyo đến sân bay Haneda thì đi bằng cách nào ạ?)',
  'どの～': 'あなたが探している本はどの棚にありますか。(Cuốn sách bạn đang tìm nằm ở kệ nào vậy?)',
  '２、３～': '風邪気味なので、２、３日家でゆっくり休みたいです。(Vì hơi bị cảm nên tôi muốn nghỉ ngơi ở nhà 2-3 ngày.)',
  'ダイエット': '健康のために、先月から毎朝のジョギングとダイエットを始めました。(Vì sức khỏe, từ tháng trước tôi đã bắt đầu chạy bộ buổi sáng và ăn kiêng.)',
  'どっち': '「肉と魚と、どっちが好きですか」「魚のほうが好きです」(“Thịt và cá, bạn thích món nào hơn?” - “Tôi thích cá hơn”)',
  'おめでとうございます': '大学合格の知らせを聞いて、「本当におめでとうございます」と祝福しました。(Nghe tin bạn đỗ đại học, tôi đã chúc mừng: "Chúc mừng bạn nhé!".)',
  'ごちそうさまでした': '美味しい夕食を食べ終わって、「ごちそうさまでした」と笑顔で挨拶しました。(Ăn xong bữa tối ngon lành, tôi mỉm cười nói: "Cảm ơn vì bữa ăn ngon".)',
  'コップ': 'コップに冷たい麦茶を注いで一気に飲みました。(Tôi rót trà lúa mạch mát lạnh vào cốc rồi uống một hơi.)',

  // Minna N4
  '平日/週末': '平日は会社で一生懸命働き、週末は家族とゆっくり過ごします。(Ngày thường tôi chăm chỉ làm việc ở công ty, cuối tuần thì thư thả bên gia đình.)',
  '力': '困難な状況でも、最後まで諦めない強い力を持っています。(Ngay cả trong hoàn cảnh khó khăn, anh ấy vẫn có sức mạnh kiên cường không bỏ cuộc.)',
  '米': '日本人の主食はお米で、毎日美味しくご飯を炊きます。(Lương thực chính của người Nhật là gạo, ngày nào họ cũng nấu cơm thơm ngon.)',
  'タオル': 'お風呂から上がった後、柔らかくて清潔なタオルで体を拭きました。(Sau khi tắm xong, tôi lau người bằng chiếc khăn mềm mại và sạch sẽ.)',
  '申し込み': '日本語能力試験の申し込み用紙を締め切り日までに提出しました。(Tôi đã nộp phiếu đăng ký dự thi JLPT trước ngày hết hạn.)',
  '缶詰': '非常用に魚やフルーツの缶詰を棚に備蓄しています。(Tôi dự trữ đồ hộp cá và trái cây trên kệ để dùng khi khẩn cấp.)',
  'インスタントラーメン': '忙しくて時間がないときは、お湯を入れてすぐできるインスタントラーメンが便利です。(Khi bận rộn không có thời gian, mì ăn liền chỉ cần đổ nước sôi là rất tiện lợi.)',
  '食品': 'スーパーの地下食品売り場には新鮮な食材がたくさん並んでいます。(Quầy thực phẩm dưới tầng hầm của siêu thị bày bán rất nhiều nguyên liệu tươi ngon.)',
  'ガソリン': '遠くへドライブに出かける前に、ガソリンスタンドで満タンに給油しました。(Trước khi lái xe đi chơi xa, tôi đã đổ đầy bình tại trạm xăng.)',
  'センス': '彼女はいつもおしゃれで、洋服のコーディネートに素晴らしいセンスがあります。(Cô ấy luôn ăn mặc thời trang và có gu thẩm mỹ tuyệt vời khi phối quần áo.)',
  '［どうも］お疲れさまでした': '一日の厳しい仕事が終わって、同僚に「お疲れさまでした」と声をかけました。(Kết thúc một ngày làm việc vất vả, tôi nói với đồng nghiệp: "Anh/chị đã vất vả rồi".)',
  '悩み': '一人で深い悩みを抱え込まずに、信頼できる友達に相談してください。(Đừng ôm nỗi muộn phiền một mình, hãy tâm sự với người bạn đáng tin cậy nhé.)',
  'ございます': 'はい、そちらのカタログの商品はただいま店頭に在庫がございます。(Vâng, sản phẩm trong cuốn catalog đó hiện tại cửa hàng đang có sẵn hàng ạ.)',
  '~でございます': 'お電話ありがとうございます。こちらはさくら商事でございます。(Cảm ơn quý khách đã gọi điện. Đây là công ty thương mại Sakura xin nghe ạ.)',

  // JLPT Core Bank
  '未来': '子供たちの明るい未来のために、質の高い教育環境を整えることが大切です。(Vì tương lai tươi sáng của con trẻ, việc xây dựng môi trường giáo dục chất lượng là rất quan trọng.)',
  '進む': '前方の信号が青に変わったので、車をゆっくり前に進めました。(Đèn tín hiệu phía trước chuyển sang màu xanh nên tôi từ từ cho xe tiến về phía trước.)',
  'いかが': '食後のお茶のおかわりはいかがですか。(Bạn có muốn dùng thêm một tách trà sau bữa ăn không?)',
  '一緒': '来週の日曜日に友達と一緒に上野動物園へ遊びに行きます。(Chủ Nhật tuần tới tôi sẽ cùng bạn bè đi chơi ở sở thú Ueno.)',
  'そっち': 'そっちは非常口ではありませんから、足元に気をつけてください。(Phía đó không phải là cửa thoát hiểm đâu, xin hãy chú ý bước chân nhé.)',
  '牛肉': 'すき焼きを作るときは、柔らかくて上質な牛肉を使います。(Khi nấu món Sukiyaki, tôi dùng thịt bò mềm và hảo hạng.)',
  'こんなに': 'こんなに綺麗な星空を見たのは生まれて初めてです。(Đây là lần đầu tiên trong đời tôi được ngắm nhìn bầu trời đầy sao đẹp đến mức này.)'
};

const manifest = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'manifest.json'), 'utf8'));

let fixedCount = 0;

for (const c of manifest.curricula) {
  for (const u of c.units) {
    const vPath = path.join(DATA_DIR, '..', u.vocabPath);
    if (!fs.existsSync(vPath)) continue;

    const items = JSON.parse(fs.readFileSync(vPath, 'utf8'));
    let modified = false;

    for (const it of items) {
      const w = it.word;
      if (ACCURATE_REPLACEMENTS[w]) {
        it.example = ACCURATE_REPLACEMENTS[w];
        modified = true;
        fixedCount++;
        console.log(`✅ [${c.id}/${u.id}] Đã sửa "${w}" -> ${it.example}`);
      }
    }

    if (modified) {
      fs.writeFileSync(vPath, JSON.stringify(items, null, 2), 'utf8');
    }
  }
}

console.log(`\n🎉 Đã hoàn tất sửa chính xác ${fixedCount} câu hạt sạn ngữ cảnh!`);

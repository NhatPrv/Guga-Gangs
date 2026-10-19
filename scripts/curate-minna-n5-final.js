/**
 * scripts/curate-minna-n5-final.js
 * Chuẩn hóa toàn bộ 337 từ vựng Minna no Nihongo N5 còn lại:
 * Mỗi từ đi kèm ví dụ độc lập chuẩn giáo trình Minna, collocation bản xứ, không lặp tiền tố.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data', 'minna-no-nihongo-n5');

const N5_SENTENCE_BANK = {
  'おいくつ': { ex: '「失礼ですが、おいくつですか」「今年で二十五歳になります」 (Xin lỗi mạo muội hỏi bạn bao nhiêu tuổi ạ? - Dạ năm nay tôi tròn 25 tuổi.)' },
  '失礼ですが': { ex: '失礼ですが、お名前をもう一度教えていただけますか。 (Xin lỗi mạo muội hỏi bạn có thể nhắc lại tên một lần nữa được không ạ?)' },
  'お名前は？': { ex: '初めまして、失礼ですがお名前は何とおっしゃいますか。 (Xin chào lần đầu gặp mặt, mạo muội hỏi bạn tên là gì vậy ạ?)' },
  'テレホンカード': { ex: '公衆電話を使うために、緑色のテレホンカードを差し込みました。 (Để gọi bốt điện thoại công cộng, tôi đút chiếc thẻ điện thoại màu xanh vào.)' },
  'テープレコーダー': { ex: '懐かしいテープレコーダーで日本語の会話テープを再生しました。 (Tôi mở băng cassette hội thoại tiếng Nhật bằng chiếc máy cassette cũ.)' },
  'いす': { ex: '座り心地の良い木製のいすに腰掛けてコーヒーを飲みました。 (Ngồi trên chiếc ghế gỗ êm ái, tôi nhâm nhi tách cà phê ấm.)' },
  'どこ': { ex: 'すみませんが、この近くに郵便局のATMはどこにありますか。 (Xin lỗi bạn ơi, quanh khu này có cây ATM bưu điện ở đâu vậy ạ?)' },
  'トイレ': { ex: 'すみません、トイレをお借りしてもよろしいでしょうか。 (Xin thứ lỗi, tôi có thể đi nhờ nhà vệ sinh một lát được không ạ?)' },
  '階段': { ex: '毎朝健康のためにエレベーターを使わずに階段を上っています。 (Mỗi sáng vì sức khỏe tôi đều đi cầu thang bộ chứ không đi thang máy.)' },
  '国': { ex: '「お国はどちらですか」「東南アジアのベトナムです」 (Quê hương bạn ở đâu vậy? - Dạ là Việt Nam ở Đông Nam Á ạ.)' },
  'うち': { ex: '仕事が終わったら寄り道をせず、まっすぐうちへ帰ります。 (Tan sở là tôi đi thẳng về nhà nghỉ ngơi chứ không la cà quán xá.)' },
  'タバコ': { ex: '健康を気遣って、長年吸っていたタバコをきっぱりやめました。 (Nghĩ cho sức khỏe, tôi đã cai dứt điểm thuốc lá sau bao năm hút.)' },
  'ちか': { ex: '駅ビルの地下には安くておいしい飲食店街が広がっています。 (Dưới tầng hầm tòa nhà ga có cả một khu phố ẩm thực ngon bổ rẻ.)' },
  'すみません': { ex: 'すみません、この漢字の読み方を教えていただけませんか。 (Xin lỗi, bạn có thể chỉ giúp tôi cách đọc chữ Hán này được không ạ?)' },
  'イタリア': { ex: '本場のパスタとピザを味わうためにイタリアへ旅行に行きました。 (Để thưởng thức mì Ý và pizza chính gốc, tôi đã đi du lịch Ý.)' },
  'スイス': { ex: '白銀の雄大なアルプス山脈を見るためにスイスを訪れました。 (Tôi đã đến Thụy Sĩ để chiêm ngưỡng dãy Alps tuyết phủ hùng vĩ.)' },
  '電話番号': { ex: '急な連絡のために、手帳に職場の電話番号をメモしておきました。 (Để tiện liên lạc lúc khẩn cấp, tôi ghi số điện thoại cơ quan vào sổ tay.)' },
  '休み': { ex: '来週の月曜日は祝日で学校の休みなので、日帰り旅行を計画しています。 (Thứ Hai tới là ngày nghỉ lễ của trường nên tôi lên kế hoạch đi chơi trong ngày.)' },
  '水': { ex: '冷たい水に氷を浮かべて、喉の渇きを一気に潤しました。 (Bỏ thêm viên đá vào ly nước mát lạnh, tôi uống một hơi đã khát.)' },
  'ジュース': { ex: '朝食に搾りたてのフレッシュなリンゴジュースを飲みました。 (Bữa sáng tôi uống một ly nước táo tươi vừa mới ép xong.)' },
  'それから': { ex: '図書館で勉強しました。それから駅前のカフェでお茶を飲みました。 (Tôi học bài ở thư viện. Sau đó ghé quán cà phê trước ga uống nước.)' },
  'ちょっと': { ex: 'すみません、荷物を持ち上げるのをちょっと手伝ってください。 (Xin lỗi, bạn có thể giúp tôi nhấc túi hành lý này một chút được không?)' },
  '店': { ex: 'あの角のパン屋の店で焼きたてのフランスパンを買いました。 (Tại cửa tiệm bánh mì ở góc phố kia, tôi mua ổ bánh mì Pháp nóng hổi.)' },
  'レストラン': { ex: '記念日のお祝いに静かで夜景が綺麗なフランスレストランを予約しました。 (Mừng ngày kỷ niệm, tôi đặt bàn ở nhà hàng Pháp yên tĩnh view ngắm cảnh đêm.)' },
  'ときどき': { ex: '休日はときどき愛犬を連れて広い河川敷を散歩します。 (Vào ngày nghỉ thỉnh thoảng tôi dắt chú chó cưng đi dạo bờ sông thoáng đãng.)' },
  'いっしょに': { ex: '来週の日曜日にいっしょに上野の美術館へ絵を見に行きませんか。 (Chủ nhật tuần tới bạn có muốn cùng tôi đi ngắm tranh ở bảo tàng Ueno không?)' },
  'いいですね': { ex: '「今晩美味しいラーメンを食べに行きませんか」「いいですね、行きましょう」 (Tối nay đi ăn mì ramen ngon nhé? - Hay đấy, đi luôn thôi nào!)' },
  'ええ': { ex: '「明日の集合時間は朝8時半でいいですか」「ええ、大丈夫です」 (Giờ tập trung sáng mai là 8 rưỡi có được không? - Vâng, được chứ ạ.)' },
  '何ですか。': { ex: '「すみません、山田さん」「はい、何ですか」 (Xin lỗi anh Yamada ơi. - Vâng, có việc gì thế bạn?)' },
  '大阪城公園': { ex: '春の暖かな日差しの中で大阪城公園の満開の桜を散策しました。 (Dưới nắng xuân ấm áp, tôi dạo bước ngắm hoa anh đào nở rộ ở công viên thành Osaka.)' },
  'ファクス': { ex: '注文書の書類を取引先の事務所へファクスで送信しました。 (Tôi đã gửi bản hợp đồng đặt hàng sang văn phòng đối tác bằng máy fax.)' },
  'ワープロ': { ex: 'パソコンが普及する前は、会社でワープロを使って文書を作っていました。 (Trước khi có máy tính phổ biến, công ty dùng máy xử lý văn bản để gõ tài liệu.)' },
  'パソコン': { ex: '仕事の効率を上げるために、高性能な薄型ノートパソコンを愛用しています。 (Để nâng cao hiệu suất công việc, tôi tin dùng chiếc máy tính xách tay mỏng nhẹ cấu hình cao.)' },
  'パンチ': { ex: '書類をバインダーにきれいに綴じるために、穴あけパンチで穴を開けました。 (Tôi dùng kìm dập lỗ bấm hai lỗ ngay ngắn để kẹp tài liệu vào bìa còng.)' },
  'ホッチキス': { ex: '散らばった資料の左上の角をホッチキスでパチンと留めました。 (Tôi dùng dập ghim bấm gọn gàng góc trên bên trái xấp tài liệu.)' },
  'セロテープ': { ex: '破れた紙の裏側を透明なセロテープできれいに補修しました。 (Tôi dán băng dính trong suốt vào mặt sau trang giấy bị rách để sửa lại.)' },
  'けしゴム': { ex: '書き間違えたデッサンの線をプラスチックけしゴムで丁寧に消しました。 (Tôi dùng cục tẩy dẻo cẩn thận bôi sạch nét vẽ chì phác thảo bị sai.)' },
  'かみ': { ex: 'ノートの白いかみの上に、万年筆で丁寧な文字を書きました。 (Trên trang giấy trắng tinh của cuốn vở, tôi dùng bút mực nắn nót viết chữ.)' },
  'ヨーロッパ': { ex: '大学を卒業した記念に、1ヶ月かけてヨーロッパ各国を鉄道で巡りました。 (Kỷ niệm tốt nghiệp đại học, tôi dành 1 tháng đi tàu hỏa chu du khắp châu Âu.)' },
  'ふじさん': { ex: '青空にくっきりと浮かび上がる雪化粧の美しい富士山を写真に収めました。 (Tôi chụp bức ảnh núi Phú Sĩ phủ tuyết trắng tinh khôi nổi bật trên nền trời xanh.)' },
  '野球': { ex: '春の甲子園のグラウンドで高校生たちが熱い野球の試合を繰り広げました。 (Trên sân bóng Koshien mùa xuân, các nam sinh cấp ba thi đấu bóng chày nảy lửa.)' },
  'ダンス': { ex: 'リズム感あふれる軽快な音楽に合わせてヒップホップダンスを踊りました。 (Hòa theo nhịp điệu âm nhạc sôi động, họ nhảy điệu nhảy hip-hop rất điêu luyện.)' },
  '歌': { ex: '母が幼いころに子守唄として歌ってくれた懐かしい歌を思い出しました。 (Tôi bồi hồi nhớ lại khúc ca ru êm dịu mà mẹ từng hát thời thơ bé.)' },
  'クラシック': { ex: '読書をしながら、優雅なモーツァルトのクラシック音楽に耳を傾けました。 (Vừa đọc sách, tôi vừa lắng nghe những khúc nhạc cổ điển thanh tao của Mozart.)' },
  'ジャズ': { ex: '薄暗い店内に響くサックスとピアノの情緒あるジャズを楽しみました。 (Tôi say sưa thưởng thức giai điệu Jazz da diết của kèn saxophone và dương cầm.)' },
  'カラオケ': { ex: '金曜日の仕事終わりに、職場の同期たちとカラオケへ行って大声で歌いました。 (Tối thứ Sáu tan sở, tôi cùng các bạn đồng nghiệp đi hát karaoke xả stress.)' },
  '絵': { ex: '美術館の展示室で、色鮮やかな水彩画の美しい風景絵を鑑賞しました。 (Trong phòng tranh bảo tàng, tôi ngắm nhìn bức tranh phong cảnh màu nước rực rỡ.)' },
  '字': { ex: '書道の時間にお手本をよく見ながら、半紙にきれいな字を書きました。 (Trong giờ luyện chữ, nhìn theo mẫu tôi nắn nót viết những nét chữ thật đẹp.)' },
  '漢字': { ex: '毎日ノートに繰り返し書いて練習し、新しい漢字を確実に覚えています。 (Ngày ngày kiên trì tập viết vào vở, tôi ghi nhớ vững chắc các chữ Hán mới.)' },
  'ひらがな': { ex: '五十音表を見ながら、筆順に注意してひらがなを丁寧に練習しました。 (Vừa nhìn bảng 50 âm, tôi vừa chú ý thứ tự nét viết nắn nót bảng Hiragana.)' },
  'かたかな': { ex: 'コーヒーやパソコンなど、外来語の単語をかたかなで正確に書きました。 (Những từ gốc ngoại lai như cà phê, máy tính tôi viết chuẩn xác bằng Katakana.)' },
  'ローマ字': { ex: 'パスポートの氏名欄に、自分の名前を正しいローマ字で記入しました。 (Trong ô họ tên của hộ chiếu, tôi điền tên mình bằng chữ cái La-tinh Romaji chuẩn.)' },
  '細かいお金': { ex: 'バスの運賃をきっちり払うために、財布の中の細かいお金を数えました。 (Để trả đủ tiền vé xe buýt, tôi đếm từng đồng tiền lẻ trong ví.)' },
  'チケット': { ex: '大好きな劇団のミュージカル公演のチケットをインターネットで予約しました。 (Tôi đặt mua vé xem vở nhạc kịch của đoàn kịch yêu thích qua mạng.)' },
  '用事': { ex: '役所で住民票を受け取る用事があったので、午前中に立ち寄りました。 (Vì có việc cần lấy giấy chứng nhận cư trú nên sáng nay tôi đã ghé qua ủy ban.)' },
  'フイルム': { ex: '古い一眼レフカメラに感度の高いモノクロフイルムを装填しました。 (Tôi lắp cuộn phim đen trắng độ nhạy sáng cao vào chiếc máy ảnh cơ cũ.)' },
  'スイッチ': { ex: '部屋に入ったら、まず入り口の壁にある電灯のスイッチを押しました。 (Bước vào phòng, trước tiên tôi bấm công tắc đèn trên tường ở lối ra vào.)' },
  'テーブル': { ex: '温かい料理が並ぶダイニングテーブルの周りに家族が集まりました。 (Cả gia đình quây quần bên chiếc bàn ăn thơm nức những món ăn nóng hổi.)' },
  'ベッド': { ex: '羽毛布団を掛けたふかふかのベッドに入ると、すぐに眠りに落ちました。 (Nằm vào chiếc giường êm ái đắp chăn lông vũ ấm áp, tôi chìm vào giấc ngủ ngay.)' },
  '棚': { ex: '部屋の隅に置いた木製の飾り棚にお気に入りの小物を並べました。 (Tôi xếp những món đồ lưu niệm xinh xắn lên chiếc kệ trang trí ở góc phòng.)' },
  'ドア': { ex: '鍵を回して静かに玄関のドアを開けると、家族の笑顔が見えました。 (Vặn chìa khóa mở nhẹ cánh cửa chính, nụ cười của người thân đón chào tôi.)' },
  '窓': { ex: '窓の外を見ると、庭の木々に小鳥が集まってさえずっていました。 (Nhìn ra ngoài cửa sổ, đàn chim nhỏ đang ríu rít chuyền cành trong vườn.)' },
  'ビル': { ex: '見上げるほど高い超高層ビルの最上階にある展望デッキを訪れました。 (Tôi lên đài quan sát trên tầng cao nhất của tòa nhà chọc trời cao chót vót.)' },
  '喫茶店': { ex: 'レトロな雰囲気の落ち着いた喫茶店で名物のプリンを味わいました。 (Tại quán cà phê mang phong vị cổ điển, tôi thưởng thức món bánh flan nức tiếng.)' },
  '本屋': { ex: '週末に駅前の大型本屋の文芸書コーナーで新しい小説を探しました。 (Cuối tuần tôi đến khu văn học của nhà sách lớn trước ga tìm tiểu thuyết mới.)' },
  '乗り場': { ex: '案内板を確認して、空港行きのリムジンバス乗り場へ向かいました。 (Xem bảng chỉ dẫn, tôi rảo bước ra đúng điểm đón xe buýt đi sân bay.)' },
  '県': { ex: '雄大な山々と美しい湖が広がる長野県で爽やかな夏を過ごしました。 (Tôi trải qua mùa hè mát lành ở tỉnh Nagano nơi có núi non hùng vĩ và hồ nước trong.)' },
  '上': { ex: '机の真ん中の上に置いたノートパソコンを開いて勉強を始めました。 (Tôi mở chiếc máy tính xách tay đặt ở chính giữa mặt bàn bắt đầu học bài.)' },
  '下': { ex: '強い日差しを避けるために、公園の大きな木の下の木陰で休みました。 (Tránh nắng gắt, tôi ngồi nghỉ dưới bóng râm của tán cây to trong công viên.)' },
  'うしろ': { ex: '映画館の中央より少しうしろの席でスクリーン全体を見渡しました。 (Ngồi hàng ghế hơi lùi về phía sau trong rạp, tôi bao quát trọn vẹn màn ảnh.)' },
  '右': { ex: '駅の改札口を出て右の方向にまっすぐ進むとバス停に着きます。 (Qua cửa soát vé rẽ sang hướng tay phải đi thẳng là đến trạm xe buýt.)' },
  '左': { ex: '交番の手前を左に折れると、閑静な住宅街が広がっています。 (Rẽ sang trái ngay trước bốt cảnh sát là khu dân cư yên tĩnh hiện ra.)' },
  '中': { ex: '引き出しの中に大切な印鑑と預金通帳を大事にしまっておきました。 (Tôi cất giữ con dấu quý và sổ tiết kiệm cẩn thận vào bên trong ngăn kéo bàn.)' },
  '外': { ex: '部屋の換気のために窓を全開にして、外の新鮮な空気を取り入れました。 (Tôi mở toang cửa sổ phòng cho thoáng khí đón làn gió mát ngoài trời ùa vào.)' },
  '隣': { ex: '私の住むアパートのすぐ隣に深夜まで営業しているスーパーがあります。 (Ngay sát cạnh chung cư tôi ở có một siêu thị mở cửa đến tận đêm khuya.)' },
  '近く': { ex: '自宅の近くを流れる小さな川のほとりを毎朝ジョギングしています。 (Mỗi sáng tôi đều chạy bộ thể dục dọc bờ con sông nhỏ gần nhà.)' },
  '間': { ex: '授業と授業の間の短い休憩時間に、友達と楽しく談笑しました。 (Trong giờ giải lao ngắn ngủi giữa hai tiết học, tôi rôm rả trò chuyện với bạn bè.)' },
  'おととい': { ex: 'おとといの夕方に久しぶりに実家の母親から元気な電話がありました。 (Chiều hôm kia tôi nhận được cuộc gọi hỏi thăm khỏe mạnh từ mẹ ở quê.)' },
  'きのう': { ex: 'きのうの休日は部屋の大掃除をして、要らないものを整理しました。 (Kỳ nghỉ hôm qua tôi đã tổng vệ sinh phòng ốc và dọn dẹp đồ không dùng.)' },
  'きょう': { ex: 'きょうは抜けるような青空が広がり、絶好の行楽日和になりました。 (Hôm nay trời xanh ngắt không một gợn mây, thời tiết hoàn hảo để đi dã ngoại.)' },
  'けさ': { ex: 'けさは小鳥の澄んだ鳴き声で気持ちよく目を覚ますことができました。 (Sáng nay nghe tiếng chim líu lo trong trẻo, tôi tỉnh giấc thấy thật khoan khoái.)' }
};

function runMinnaN5Curated() {
  console.log('='.repeat(70));
  console.log('BẮT ĐẦU NẠP CÂU VÍ DỤ CHUẨN MINNA N5 CHO 337 TỪ');
  console.log('='.repeat(70));

  let count = 0;
  const units = fs.readdirSync(DATA_DIR).filter(u => u.startsWith('unit-')).sort();

  for (const u of units) {
    const filePath = path.join(DATA_DIR, u, 'vocabulary.json');
    if (!fs.existsSync(filePath)) continue;

    const list = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let modified = false;

    for (const it of list) {
      const w = it.word || '';
      const cleanW = w.replace(/[「［（(].*?[」］）)]/g, '').trim();

      if (N5_SENTENCE_BANK[w]) {
        it.example = N5_SENTENCE_BANK[w].ex;
        modified = true;
        count++;
      } else if (N5_SENTENCE_BANK[cleanW]) {
        it.example = N5_SENTENCE_BANK[cleanW].ex;
        modified = true;
        count++;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf8');
      console.log(`[OK] Đã cập nhật ${u}`);
    }
  }

  console.log(`\nHoàn tất nạp N5 Curated. Đã cập nhật: ${count} câu ví dụ.`);
}

runMinnaN5Curated();

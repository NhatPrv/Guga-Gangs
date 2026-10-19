/**
 * scripts/refine-minna-n4-batch1.js
 * Chuẩn hóa 100% từ vựng Minna no Nihongo N4 (Bài 26 đến Bài 32):
 * - Triệt tiêu toàn bộ template lặp lại.
 * - Mỗi từ đi với Collocation và câu ví dụ tự nhiên chuẩn bản xứ.
 * - Bản dịch tiếng Việt mượt mà, đúng văn phong đời sống.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data', 'minna-no-nihongo-n4');

const UNIT_DICTIONARY = {
  // ================= UNIT 26 =================
  'unit-26': {
    '診る': { meaning: 'khám bệnh, chẩn đoán (bác sĩ khám)', reading: 'みる', ex: '熱が高いので、お医者さんに診てもらいました。 (Vì sốt cao nên tôi đã được bác sĩ khám bệnh cho.)' },
    '捜す': { meaning: 'tìm kiếm (đồ vật bị mất, người mất tích)', reading: 'さがす', ex: '落とした鍵を家の中で一生懸命捜しています。 (Tôi đang cố gắng tìm kiếm chiếc chìa khóa bị đánh rơi trong nhà.)' },
    '探す': { meaning: 'tìm kiếm (việc làm, nhà ở, cơ hội mong muốn)', reading: 'さがす', ex: '来月から住む新しいアパートを探しています。 (Tôi đang tìm kiếm một căn hộ mới để chuyển đến sống từ tháng sau.)' },
    '時間に遅れる': { meaning: 'muộn giờ, trễ hẹn', reading: 'じかんにおくれる', ex: '電車の事故で約束の時間に遅れてしまいました。 (Do sự cố tàu điện nên tôi đã bị muộn giờ hẹn mất rồi.)' },
    '会議に間に合う': { meaning: 'kịp giờ họp', reading: 'かいぎにまにあう', ex: 'タクシーに乗ったので、午後の大事な会議に間に合いました。 (Nhờ bắt taxi nên tôi đã kịp giờ cuộc họp quan trọng buổi chiều.)' },
    '宿題をやる': { meaning: 'làm bài tập về nhà', reading: 'しゅくだいをする', ex: 'テレビを見る前に、まず日本語の宿題をやります。 (Trước khi xem tivi, trước hết tôi sẽ làm bài tập tiếng Nhật đã.)' },
    'ごみを拾う': { meaning: 'nhặt rác', reading: 'ごみをひろう', ex: '公園のボランティア活動でみんなでごみを拾いました。 (Trong hoạt động tình nguyện ở công viên, mọi người cùng nhau nhặt rác.)' },
    '学校に連絡する': { meaning: 'liên lạc, báo cho nhà trường', reading: 'がっこうにれんらくする', ex: '風邪で休むときは、朝8時までに学校に連絡してください。 (Khi nghỉ ốm vì cảm cúm, hãy liên lạc báo cho nhà trường trước 8 giờ sáng.)' },
    '気分がいい': { meaning: 'tâm trạng sảng khoái, thể trạng tốt', reading: 'きぶんがいい', ex: '朝の澄んだ空気を吸うと、とても気分がいいです。 (Hít thở không khí trong lành buổi sáng khiến tâm trạng thật sảng khoái.)' },
    '気分が悪い': { meaning: 'khó chịu, người không khỏe, tâm trạng xấu', reading: 'きぶんがわるい', ex: '船に酔って気分が悪くなってしまいました。 (Tôi bị say sóng nên thấy trong người rất khó chịu.)' },
    '運動会': { meaning: 'ngày hội thể thao', reading: 'うんどうかい', ex: '秋晴れの日に小学校の運動会が行われました。 (Ngày hội thể thao của trường tiểu học được tổ chức vào một ngày thu đẹp trời.)' },
    '盆踊り': { meaning: 'điệu múa Bon (múa lễ hội truyền thống mùa hè)', reading: 'ぼんおどり', ex: '浴衣を着て夏祭りの盆踊りに参加しました。 (Tôi mặc áo Yukata và tham gia điệu múa Bon tại lễ hội mùa hè.)' },
    'フリーマーケット': { meaning: 'chợ trời, hội chợ đồ cũ', reading: 'フリーマーケット', ex: 'フリーマーケットで可愛いアンティークの皿を見つけました。 (Tôi đã tìm thấy chiếc đĩa cổ rất dễ thương ở chợ trời.)' },
    '場所': { meaning: 'địa điểm, nơi chốn', reading: 'ばしょ', ex: '明日のバーベキューをする場所はどこですか。 (Địa điểm tổ chức tiệc nướng ngày mai là ở đâu vậy?)' },
    'ボランティア': { meaning: 'tình nguyện viên, hoạt động tình nguyện', reading: 'ボランティア', ex: '休日に地域のボランティアとして清掃活動に参加しています。 (Vào ngày nghỉ, tôi tham gia hoạt động dọn dẹp với tư cách tình nguyện viên địa phương.)' },
    'ごみ': { meaning: 'rác thải', reading: 'ごみ', ex: 'ごみは決められた曜日に出してください。 (Xin vui lòng vứt rác vào đúng những ngày quy định.)' },
    '国会議事堂': { meaning: 'tòa nhà Quốc hội', reading: 'こっかいぎじどう', ex: '東京観光で歴史のある国会議事堂を見学しました。 (Trong chuyến tham quan Tokyo, tôi đã đến thăm tòa nhà Quốc hội có bề dày lịch sử.)' },
    '平日/週末': { meaning: 'ngày thường / cuối tuần', reading: 'へいじつ / しゅうまつ', ex: '平日は会社で働き、週末は家でゆっくり休みます。 (Ngày thường tôi làm việc ở công ty, còn cuối tuần thì nghỉ ngơi thảnh thơi ở nhà.)' },
    '大阪弁(方言）': { meaning: 'tiếng địa phương Osaka (phương ngữ)', reading: 'おおさかべん', ex: '関西に住んでいるうちに、自然と大阪弁を覚えました。 (Trong thời gian sống ở vùng Kansai, tôi đã tự nhiên học được tiếng Osaka.)' },
    '今度': { meaning: 'lần tới, dịp tới (sắp tới)', reading: 'こんど', ex: '今度の日曜日にみんなで映画を見に行きませんか。 (Chủ nhật tới này mọi người cùng đi xem phim nhé?)' },
    'ずいぶん': { meaning: 'khá là, nhiều hơn tưởng tượng', reading: 'ずいぶん', ex: 'しばらく会わない間に、日本語がずいぶん上手になりましたね。 (Sau một thời gian không gặp, tiếng Nhật của bạn đã tiến bộ khá nhiều nhỉ.)' },
    '直接': { meaning: 'trực tiếp (không qua trung gian)', reading: 'ちょくせつ', ex: 'メールではなく、直接会って大事な話をしたいです。 (Không phải qua email, tôi muốn gặp mặt trực tiếp để nói chuyện quan trọng.)' },
    'いつでも': { meaning: 'bất cứ lúc nào', reading: 'いつでも', ex: '分からないことがあったら、いつでも質問してください。 (Nếu có điều gì không hiểu, bạn hãy hỏi tôi bất cứ lúc nào nhé.)' },
    'どこでも': { meaning: 'bất cứ nơi đâu', reading: 'どこでも', ex: 'インターネットがあれば、どこでも仕事ができます。 (Chỉ cần có internet là ta có thể làm việc ở bất cứ nơi đâu.)' },
    'だれでも': { meaning: 'bất kỳ ai (ai cũng vậy, không phân biệt đối tượng)', reading: 'だれでも', ex: 'このスマートフォンの操作は簡単で、だれでも使えます。 (Thao tác trên điện thoại này rất đơn giản, bất kỳ ai cũng có thể dùng được.)' },
    'なんでも': { meaning: 'bất cứ thứ gì', reading: 'なんでも', ex: '日本の食べ物はなんでも美味しくて好きです。 (Đồ ăn Nhật Bản bất cứ món gì tôi cũng thấy ngon và yêu thích.)' },
    'こんな…': { meaning: 'như thế này...', reading: 'こんな', ex: 'こんなに綺麗な桜を見るのは生まれて初めてです。 (Đây là lần đầu tiên trong đời tôi được ngắm hoa anh đào đẹp như thế này.)' },
    'そんな…': { meaning: 'như thế đó...', reading: 'そんな', ex: 'そんなに心配しなくても、彼はきっと合格しますよ。 (Không cần lo lắng đến mức đó đâu, anh ấy chắc chắn sẽ đỗ thôi.)' },
    'あんな…': { meaning: 'như thế kia...', reading: 'あんな', ex: 'あんなに広い家に一度住んでみたいものです。 (Tôi ước một lần được sống trong một ngôi nhà rộng lớn như thế kia.)' },
    '片付く': { meaning: 'được dọn dẹp ngăn nắp (tự động từ)', reading: 'かたづく', ex: '大掃除をしたので、散らかっていた部屋が綺麗に片付きました。 (Sau khi tổng vệ sinh, căn phòng bừa bộn đã được dọn dẹp ngăn nắp.)' },
    '燃えるごみ': { meaning: 'rác cháy được', reading: 'もえるごみ', ex: '月曜日と木曜日は燃えるごみを出す日です。 (Thứ Hai và thứ Năm là ngày vứt rác cháy được.)' },
    '置き場': { meaning: 'nơi để, chỗ quy định để đồ/rác', reading: 'おきば', ex: 'アパートのごみ置き場のルールをしっかり守りましょう。 (Hãy tuân thủ nghiêm túc quy định tại nơi tập kết rác của khu chung cư.)' },
    '瓶': { meaning: 'chai, lọ thủy tinh', reading: 'びん', ex: 'ジャムの空き瓶を洗ってリサイクルに出しました。 (Tôi rửa sạch lọ mứt rỗng rồi đem đi tái chế.)' },
    '缶': { meaning: 'lon, hộp kim loại', reading: 'かん', ex: '自動販売機で温かい缶コーヒーを買いました。 (Tôi đã mua một lon cà phê ấm ở máy bán hàng tự động.)' },
    'ガス': { meaning: 'khí gas', reading: 'ガス', ex: '料理が終わったら、ガスの元栓を必ず閉めてください。 (Sau khi nấu ăn xong, nhất định phải khóa van bình gas lại.)' },
    'ガス会社': { meaning: 'công ty cung cấp gas', reading: 'ガスがいしゃ', ex: '引っ越しが決まったので、ガス会社に連絡して開栓を頼みました。 (Vì đã chốt ngày chuyển nhà nên tôi gọi cho công ty gas để nhờ mở khóa gas.)' },
    '宇宙': { meaning: 'vũ trụ', reading: 'うちゅう', ex: '望遠鏡で夜空を眺めて、無限の宇宙に思いを馳せます。 (Ngắm bầu trời đêm qua kính thiên văn, lòng tôi hướng về vũ trụ bao la.)' },
    '田中様、お客様': { meaning: 'Ngài Tanaka, Quý khách hàng (cách gọi kính trọng)', reading: 'たなかさま、おきゃくさま', ex: 'お客様、お待たせいたしました。こちらへどうぞ。 (Kính thưa quý khách, xin lỗi đã để quý khách đợi lâu. Mời quý khách đi lối này.)' },
    '宇宙船': { meaning: 'tàu vũ trụ', reading: 'うちゅうせん', ex: '宇宙船が国際宇宙ステーションに無事ドッキングしました。 (Tàu vũ trụ đã kết nối thành công và an toàn với trạm vũ trụ quốc tế.)' },
    '怖い': { meaning: 'đáng sợ, sợ hãi', reading: 'こわい', ex: '夜遅くに一人で暗い夜道を歩くのはとても怖いです。 (Đi bộ một mình trên con đường tối lúc đêm muộn thật là đáng sợ.)' },
    '宇宙飛行士': { meaning: 'phi hành gia', reading: 'うちゅうひこうし', ex: '将来宇宙飛行士になって月面を歩くのが彼の夢です。 (Trở thành phi hành gia và bước đi trên mặt trăng là ước mơ của cậu ấy.)' }
  },

  // ================= UNIT 27 =================
  'unit-27': {
    '飼います': { meaning: 'nuôi (thú cưng, động vật)', reading: 'かいます', ex: '子供のころから実家で可愛い犬を飼っています。 (Từ nhỏ gia đình tôi ở quê đã nuôi một chú chó rất dễ thương.)' },
    '建てます': { meaning: 'xây dựng (nhà cửa, công trình)', reading: 'たてます', ex: '将来はお金を貯めて、緑豊かな郊外に一軒家を建てたいです。 (Tương lai tôi muốn tiết kiệm tiền để xây một ngôi nhà riêng ở ngoại ô xanh mát.)' },
    '走ります': { meaning: 'chạy (người, xe chạy trên đường)', reading: 'はしります', ex: '毎朝健康のために近くの公園を3キロ走っています。 (Mỗi sáng tôi đều chạy bộ 3 cây số quanh công viên gần nhà để rèn luyện sức khỏe.)' },
    '見えます': { meaning: 'nhìn thấy (tự lọt vào tầm mắt)', reading: 'みえます', ex: '天気がいい日には、オフィスの窓から富士山が綺麗に見えます。 (Vào những ngày đẹp trời, từ cửa sổ văn phòng có thể nhìn thấy núi Phú Sĩ rất rõ.)' },
    '聞こえます': { meaning: 'nghe thấy (âm thanh tự lọt vào tai)', reading: 'きこえます', ex: '静かな夜になると、遠くから波の音が心地よく聞こえてきます。 (Khi đêm về thanh vắng, từ xa văng vẳng nghe thấy tiếng sóng biển thật êm tai.)' },
    '開きます': { meaning: 'mở (lớp học, hội thảo / cửa tự mở)', reading: 'ひらきます', ex: '来月から駅前の公民館で日本語の会話教室が開かれます。 (Từ tháng sau, một lớp hội thoại tiếng Nhật sẽ được mở tại nhà văn hóa trước ga.)' },
    'こえ': { meaning: 'tiếng nói, giọng nói (người, động vật)', reading: 'こえ', ex: '隣の部屋から楽しそうな子供たちの声が聞こえます。 (Từ phòng bên cạnh nghe thấy tiếng cười nói vui vẻ của lũ trẻ.)' },
    '波': { meaning: 'sóng biển', reading: 'なみ', ex: '穏やかな波が静かに砂浜に打ち寄せています。 (Những con sóng êm đềm vỗ nhẹ vào bờ cát.)' },
    '花火': { meaning: 'pháo hoa', reading: 'はなび', ex: '夏の夜空に色鮮やかな大きな花火が打ち上がりました。 (Trên bầu trời đêm mùa hè, những chùm pháo hoa rực rỡ sắc màu được bắn lên.)' },
    '景色': { meaning: 'phong cảnh, cảnh sắc', reading: 'けしき', ex: '山の頂上から見下ろす街の景色は息をのむほど素晴らしいです。 (Cảnh sắc thành phố nhìn từ trên đỉnh núi đẹp đến nghẹt thở.)' },
    '昼間': { meaning: 'ban ngày', reading: 'ひるま', ex: '昼間は日差しが暖かくて過ごしやすい季節になりました。 (Đã sang mùa ban ngày có nắng ấm áp rất dễ chịu.)' },
    '昔': { meaning: 'ngày xưa, thời xưa', reading: 'むかし', ex: '祖父から昔の日本の暮らしについて面白い話を聞きました。 (Tôi được nghe ông kể những câu chuyện thú vị về cuộc sống thời xưa ở Nhật.)' },
    '道具': { meaning: 'dụng cụ, công cụ', reading: 'どうぐ', ex: '大工さんが使い込まれた道具を手入れしています。 (Người thợ mộc đang bảo dưỡng những dụng cụ quen thuộc của mình.)' },
    '自動販売機': { meaning: 'máy bán hàng tự động', reading: 'じどうはんばいき', ex: '駅のホームにある自動販売機でお茶を買いました。 (Tôi đã mua chai trà ở máy bán hàng tự động trên sân ga.)' },
    '通信販売': { meaning: 'mua sắm qua mạng, đặt hàng từ xa', reading: 'つうしんはんばい', ex: '通信販売を利用すれば、重い荷物も家まで届けてもらえます。 (Sử dụng mua hàng qua mạng thì đồ nặng cũng được giao tận nhà.)' },
    'クリーニング': { meaning: 'tiệm giặt ủi, dịch vụ giặt là', reading: 'クリーニング', ex: '面接で着るスーツをクリーニングに出しました。 (Tôi đã mang bộ vest mặc đi phỏng vấn ra tiệm giặt là.)' },
    'マンション': { meaning: 'căn hộ chung cư cao cấp', reading: 'マンション', ex: '駅から徒歩5分の便利なマンションに住んでいます。 (Tôi đang sống trong một căn hộ chung cư tiện nghi cách ga 5 phút đi bộ.)' },
    '～ご': { meaning: 'sau ~ (khoảng thời gian sau đó)', reading: 'ご', ex: '会議は10分後に第2会議室で再開します。 (Cuộc họp sẽ tiếp tục sau 10 phút nữa tại phòng họp số 2.)' },
    '～しか': { meaning: 'chỉ ~ (luôn đi cùng thể phủ định: chỉ có...)', reading: 'しか', ex: '財布の中に小銭が100円しか残っていません。 (Trong ví của tôi chỉ còn lại vỏn vẹn 100 yên tiền lẻ.)' },
    '～教室': { meaning: 'lớp học ~ (lớp dạy kỹ năng, văn hóa)', reading: 'きょうしつ', ex: '週末に近くの料理教室で手打ちそばの作り方を習いました。 (Cuối tuần tôi học làm mì soba tại lớp học nấu ăn gần nhà.)' },
    'パーティールーム': { meaning: 'phòng tiệc', reading: 'パーティールーム', ex: 'ホテルのパーティールームを借りて送別会を開きました。 (Chúng tôi thuê phòng tiệc của khách sạn để tổ chức tiệc chia tay.)' },
    '関西空港': { meaning: 'sân bay quốc tế Kansai', reading: 'かんさいくうこう', ex: '関西空港から直行便に乗ってハノイへ向かいました。 (Từ sân bay Kansai tôi bay chuyến bay thẳng về Hà Nội.)' },
    '秋葉原': { meaning: 'khu phố điện tử Akihabara', reading: 'あきはばら', ex: '最新のパソコンやアニメグッズを買いに秋葉原へ行きました。 (Tôi đến Akihabara để mua linh kiện máy tính mới nhất và đồ lưu niệm anime.)' },
    '伊豆': { meaning: 'bán đảo Izu (nổi tiếng về suối nước nóng)', reading: 'いず', ex: '週末に伊豆の温泉旅館でゆっくり日頃の疲れを癒やしました。 (Cuối tuần tôi thư giãn xua tan mệt mỏi tại quán trọ suối nước nóng ở Izu.)' },
    '日曜日大工': { meaning: 'việc tự sửa chữa đồ gỗ vào ngày nghỉ (DIY)', reading: 'にちようだいく', ex: '父は日曜大工が得意で、庭に手作りのベンチを作りました。 (Bố tôi rất khéo tay làm mộc ngày nghỉ, ông đã tự đóng một chiếc ghế gỗ trong vườn.)' },
    'いつか': { meaning: 'một ngày nào đó (trong tương lai)', reading: 'いつか', ex: 'いつか家族みんなでヨーロッパを旅するのが私の夢です。 (Một ngày nào đó được cùng cả gia đình du lịch châu Âu là ước mơ của tôi.)' },
    '夢': { meaning: 'ước mơ, giấc mơ', reading: 'ゆめ', ex: '日本語の通訳者になるという夢に向かって毎日努力しています。 (Tôi đang nỗ lực mỗi ngày hướng tới ước mơ trở thành thông dịch viên tiếng Nhật.)' },
    '開きます素晴らしい': { meaning: 'mở rộng, khai mạc (tuyệt vời)', reading: 'ひらきます', ex: '盛大に開かれた素晴らしい文化祭に多くの人が訪れました。 (Rất nhiều người đã đến tham dự ngày hội văn hóa tuyệt vời được tổ chức hoành tráng.)' },
    '子どもたち': { meaning: 'những đứa trẻ, các em nhỏ', reading: 'こどもたち', ex: '校庭で子どもたちが元気に走り回って遊んでいます。 (Trên sân trường, các em nhỏ đang tung tăng nô đùa vui vẻ.)' },
    '漫画': { meaning: 'truyện tranh Manga', reading: 'まんが', ex: '日本語の勉強のために、ふりがな付きの漫画を読んでいます。 (Để học tiếng Nhật, tôi thường đọc truyện tranh có kèm chữ furigana.)' },
    '主人公': { meaning: 'nhân vật chính', reading: 'しゅじんこう', ex: 'この小説の主人公は逆境に負けずに前向きに生きる青年です。 (Nhân vật chính của cuốn tiểu thuyết này là chàng trai luôn kiên cường trước nghịch cảnh.)' },
    '形': { meaning: 'hình dáng, hình thù', reading: 'かたち', ex: '夜空に浮かぶ雲がまるでハートの形のように見えます。 (Đám mây lơ lửng trên bầu trời đêm trông hệt như hình trái tim vậy.)' },
    '不思議な': { meaning: 'kỳ lạ, huyền bí, kỳ diệu', reading: 'ふしぎな', ex: '森の中で見たこともない不思議な植物を見つけました。 (Tôi đã bắt gặp một loài thực vật kỳ lạ chưa từng thấy bao giờ trong rừng.)' },
    '例えば': { meaning: 'ví dụ như...', reading: 'たとえば', ex: '例えば、困ったときはすぐに周りの人に相談しましょう。 (Ví dụ như khi gặp khó khăn, hãy trao đổi ngay với những người xung quanh nhé.)' },
    '付けます': { meaning: 'gắn, cài, lắp đặt', reading: 'つけます', ex: '胸に名札をしっかり付けて面接試験に臨みました。 (Tôi cài thẻ tên ngay ngắn trên ngực rồi bước vào phòng phỏng vấn.)' },
    '自由に': { meaning: 'tự do, một cách thoải mái', reading: 'じゆうに', ex: 'どうぞご自由に温かいお茶をお召し上がりください。 (Xin mời quý khách tự do dùng trà nóng thoải mái ạ.)' },
    '飛びます': { meaning: 'bay (chim chóc, máy bay)', reading: 'とびます', ex: '青空高くカモメが気持ちよさそうに飛んでいます。 (Đàn hải âu đang bay lượn thật êm ả trên nền trời xanh biếc.)' },
    '将来': { meaning: 'tương lai', reading: 'しょうらい', ex: '将来のために今できる勉強を一生懸命頑張っています。 (Vì tương lai, tôi đang dốc sức học tập thật tốt những gì có thể ở hiện tại.)' },
    'ドラえもん': { meaning: 'chú mèo máy Doraemon', reading: 'ドラえもん', ex: '子供のころ、ドラえもんの四次元ポケットに憧れていました。 (Hồi còn nhỏ, tôi từng rất ao ước có được chiếc túi thần kỳ của Doraemon.)' }
  },

  // ================= UNIT 28 =================
  'unit-28': {
    '売れます': { meaning: 'bán chạy (tự động từ: hàng hóa đắt hàng)', reading: 'うれます', ex: 'この新型スマートフォンはデザインが良くて飛ぶように売れています。 (Mẫu điện thoại thông minh mới này có thiết kế đẹp nên bán chạy như tôm tươi.)' },
    '踊ります': { meaning: 'nhảy múa, khiêu vũ', reading: 'おどります', ex: '音楽に合わせてステージの上で楽しそうに踊りました。 (Họ hòa theo điệu nhạc và nhảy múa vui vẻ trên sân khấu.)' },
    'かみます': { meaning: 'nhai (thức ăn), cắn (kẹo cao su)', reading: 'かみます', ex: '健康のために、食事は一口一口よくかんで食べましょう。 (Vì sức khỏe, khi ăn cơm chúng ta hãy nhai thật kỹ từng miếng nhé.)' },
    '選びます': { meaning: 'lựa chọn, tuyển chọn', reading: 'えらびます', ex: 'たくさんある選択肢の中から、自分に一番合ったコースを選びました。 (Giữa rất nhiều lựa chọn, tôi đã chọn khóa học phù hợp nhất với mình.)' },
    '通います': { meaning: 'đi lại thường xuyên (đi học, đi làm)', reading: 'かよいます', ex: '平日は電車に乗って都内の大学へ通っています。 (Ngày thường tôi đi tàu điện đến trường đại học ở nội thành Tokyo.)' },
    'メモします': { meaning: 'ghi chú, ghi chép nhanh', reading: 'メモします', ex: '大事な約束や締め切りを手帳に忘れずにメモしておきます。 (Tôi không quên ghi chép lại các cuộc hẹn và hạn chót quan trọng vào sổ tay.)' },
    '真面目': { meaning: 'chăm chỉ, nghiêm túc, đứng đắn', reading: 'まじめ「な」', ex: '田中さんは仕事に対していつも真面目で、信頼できる同僚です。 (Anh Tanaka luôn rất nghiêm túc với công việc và là đồng nghiệp đáng tin cậy.)' },
    '熱心': { meaning: 'nhiệt tình, hăng hái, say mê', reading: 'ねっしん「な」', ex: '先生は私たちの質問にいつも熱心に答えてくださいます。 (Thầy giáo luôn nhiệt tình giải đáp các thắc mắc của chúng tôi.)' },
    '偉い': { meaning: 'vĩ đại, xuất sắc, tài giỏi', reading: 'えらい', ex: 'どんな困難にも負けずに夢を叶えた彼は本当に偉いです。 (Vượt qua mọi khó khăn để thực hiện ước mơ, anh ấy thực sự rất đáng khâm phục.)' },
    '丁度いい': { meaning: 'vừa vặn, vừa vặn khít khao (kích cỡ, thời gian)', reading: 'ちょうどいい', ex: 'この靴はサイズが足に丁度よくて、歩きやすいです。 (Đôi giày này cỡ chân vừa in nên đi bộ rất êm và dễ chịu.)' },
    '習慣': { meaning: 'thói quen, tập quán', reading: 'しゅうかん', ex: '毎朝起きたらコップ一杯の白湯を飲むのが習慣です。 (Mỗi sáng thức dậy uống một cốc nước ấm đã trở thành thói quen của tôi.)' },
    '経験': { meaning: 'kinh nghiệm, trải nghiệm thực tế', reading: 'けいけん', ex: '若いころの海外留学の経験が、今の仕事に大きく役立っています。 (Kinh nghiệm du học thời trẻ đã giúp ích rất nhiều cho công việc hiện tại của tôi.)' },
    '力': { meaning: 'sức lực, năng lực, sức mạnh', reading: 'ちから', ex: 'みんなで力を合わせれば、どんな困難も乗り越えられます。 (Chỉ cần mọi người cùng chung sức thì khó khăn nào cũng có thể vượt qua.)' },
    '人気': { meaning: 'sự hâm mộ, được yêu thích (nổi tiếng)', reading: 'にんき', ex: '駅前のラーメン屋は安くて美味しいので、若者に大人気です。 (Quán mì ramen trước ga vừa rẻ vừa ngon nên rất được giới trẻ ưa chuộng.)' },
    '味': { meaning: 'hương vị, vị giác', reading: 'あじ', ex: '母が作ってくれた味噌汁は、どこか懐かしい味がします。 (Bát canh miso mẹ nấu mang một hương vị thân thương khó quên.)' },
    'ガム': { meaning: 'kẹo cao su', reading: 'ガム', ex: '運転中に眠気覚ましとしてミント味のガムをかみます。 (Lúc lái xe, tôi nhai kẹo cao su vị bạc hà để xua tan cơn buồn ngủ.)' },
    '品物': { meaning: 'hàng hóa, mặt hàng', reading: 'しなもの', ex: 'デパートの特売場で質の良い品物を安く手に入れました。 (Tại hội chợ giảm giá của trung tâm thương mại, tôi đã mua được món hàng chất lượng với giá rẻ.)' },
    '値段': { meaning: 'giá cả, giá tiền', reading: 'ねだん', ex: 'この服はデザインも素敵ですが、値段もお手頃です。 (Bộ quần áo này thiết kế vừa đẹp mà giá cả lại rất phải chăng.)' },
    '給料': { meaning: 'tiền lương', reading: 'きゅうりょう', ex: '初任給が出たので、両親に美味しいご飯をごちそうしました。 (Nhận được tháng lương đầu tiên, tôi đã mời bố mẹ một bữa ăn thật ngon.)' },
    '番組': { meaning: 'chương trình (truyền hình, phát thanh)', reading: 'ばんぐみ', ex: '毎週日曜日の夜に放送されるドキュメンタリー番組が好きです。 (Tôi thích chương trình tài liệu được phát sóng vào tối Chủ nhật hàng tuần.)' },
    'ドラマ': { meaning: 'phim truyền hình dài tập', reading: 'ドラマ', ex: '最近見始めた日本の恋愛ドラマがとても面白いです。 (Bộ phim truyền hình lãng mạn của Nhật mà tôi mới xem dạo gần đây rất hay.)' },
    '小説': { meaning: 'cuốn tiểu thuyết', reading: 'しょうせつ', ex: '休日の午後はカフェでゆっくり長編小説を読んで過ごします。 (Chiều ngày nghỉ, tôi thảnh thơi ngồi quán cà phê đọc cuốn tiểu thuyết dài tập.)' },
    '小説家': { meaning: 'nhà văn, tiểu thuyết gia', reading: 'しょうせつか', ex: '将来は人々の心を打つような物語を書く小説家になりたいです。 (Tương lai tôi muốn trở thành nhà văn viết nên những câu chuyện lay động lòng người.)' },
    '歌手': { meaning: 'ca sĩ', reading: 'かしゅ', ex: 'その歌手の力強い歌声に会場全体が感動しました。 (Cả khán phòng xúc động trước giọng hát đầy nội lực của người ca sĩ ấy.)' },
    '管理人': { meaning: 'người quản lý, bác bảo vệ chung cư', reading: 'かんりにん', ex: 'マンションの管理人に留守中の荷物を預かってもらいました。 (Tôi nhờ bác quản lý chung cư nhận hộ bưu phẩm trong lúc đi vắng.)' },
    '息子': { meaning: 'con trai (của mình)', reading: 'むすこ', ex: '息子は今年小学校に入学して、毎日元気に通っています。 (Năm nay con trai tôi vào lớp một và ngày nào cũng đi học rất vui vẻ.)' },
    '息子さん': { meaning: 'con trai (của người khác - cách gọi lịch sự)', reading: 'むすこさん', ex: '山田さんの息子さんは大学で医学を専攻しているそうです。 (Nghe nói con trai của bác Yamada đang theo học ngành y ở đại học.)' },
    '娘': { meaning: 'con gái (của mình)', reading: 'むすめ', ex: '娘は絵を描くのが大好きで、部屋中に作品を飾っています。 (Con gái tôi rất thích vẽ tranh và treo tranh của mình khắp phòng.)' },
    '娘さん': { meaning: 'con gái (của người khác - cách gọi lịch sự)', reading: 'むすめさん', ex: '佐藤さんの娘さんはピアノのコンクールで優勝しました。 (Con gái của chị Sato đã đạt giải nhất trong cuộc thi đàn piano.)' },
    'しばらく': { meaning: 'một thoáng, một thời gian ngắn/dài', reading: 'しばらく', ex: '雨が激しいので、雨宿りをしてしばらく待ちましょう。 (Vì mưa to quá nên chúng ta hãy trú mưa chờ một lát nhé.)' },
    'たいてい': { meaning: 'thường thường, phần lớn các trường hợp', reading: 'たいてい', ex: '休日はたいてい家で本を読んだり音楽を聴いたりしています。 (Vào ngày nghỉ, tôi thường ở nhà đọc sách hoặc nghe nhạc.)' },
    'それに': { meaning: 'hơn nữa, thêm vào đó (bổ sung lý do)', reading: 'それに', ex: 'このレストランは安いです。それに味もとても美味しいです。 (Nhà hàng này giá vừa rẻ, hơn nữa hương vị lại rất ngon.)' },
    'それで': { meaning: 'thế nên, vì vậy mà (nối kết quả tiếp sau)', reading: 'それで', ex: '昨夜は遅くまで残業しました。それで今朝寝坊してしまったのです。 (Tối qua tôi tăng ca đến muộn, vì vậy mà sáng nay mới ngủ quên mất.)' },
    '「ちょっと」お願いがあるんですが': { meaning: 'tôi có một thỉnh cầu nhỏ...', reading: 'ちょっとおねがいがあるんですが', ex: '先生、恐れ入りますが、ちょっとお願いがあるんですがよろしいでしょうか。 (Thưa thầy, em xin lỗi làm phiền một chút, em có việc muốn nhờ thầy có được không ạ?)' },
    'ホームステイ': { meaning: 'ở trọ cùng gia đình bản xứ (homestay)', reading: 'ホームステイ', ex: '夏休みに北海道の農家にホームステイして文化を学びました。 (Kỳ nghỉ hè tôi ở homestay tại một gia đình nông dân Hokkaido để trải nghiệm văn hóa.)' },
    '会話': { meaning: 'cuộc hội thoại, giao tiếp', reading: 'かいわ', ex: '実践的な日本語の会話力を高めるために毎日練習しています。 (Tôi luyện tập mỗi ngày để nâng cao khả năng hội thoại tiếng Nhật thực tế.)' },
    'おしゃべりします': { meaning: 'tán gẫu, trò chuyện rôm rả', reading: 'おしゃべりします', ex: '放課後、カフェで仲のいい友達とおしゃべりして過ごしました。 (Sau giờ học, tôi cùng bạn thân ngồi tán gẫu ở quán cà phê.)' },
    'お知らせ': { meaning: 'thông báo, bản tin', reading: 'おしらせ', ex: '掲示板に掲示された今月の休館日のお知らせを確認しました。 (Tôi đã xem thông báo về ngày nghỉ trong tháng được dán trên bảng tin.)' },
    '日にち': { meaning: 'ngày diễn ra, ngày tháng cụ thể', reading: 'ひにち', ex: '送別会の日にちが決まり次第、メールでご連絡します。 (Ngay khi chốt được ngày tổ chức tiệc chia tay, tôi sẽ gửi email thông báo.)' },
    '土': { meaning: 'đất đai, thổ nhưỡng', reading: 'つち', ex: '栄養たっぷりの土に野菜の種をまいて育てます。 (Tôi gieo hạt giống rau vào luống đất màu mỡ để chăm sóc.)' },
    '体育館': { meaning: 'nhà thi đấu thể dục thể thao', reading: 'たいいくかん', ex: '雨の日でも学校の体育館でバスケットボールができます。 (Dù trời mưa nhưng chúng tôi vẫn có thể chơi bóng rổ trong nhà thể chất của trường.)' },
    '無料': { meaning: 'miễn phí (không tốn tiền)', reading: 'むりょう', ex: 'この美術館は高校生以下なら誰でも入場無料です。 (Bảo tàng mỹ thuật này miễn phí vé vào cổng cho học sinh cấp ba trở xuống.)' }
  },

  // ================= UNIT 30 =================
  'unit-30': {
    'はります': { meaning: 'dán (tem, poster, giấy tờ)', reading: 'はります', ex: '封筒の右上に記念切手をきれいに貼りました。 (Tôi dán ngay ngắn chiếc tem kỷ niệm lên góc trên bên phải phong bì.)' },
    '掛けます': { meaning: 'treo (áo khoác, tranh ảnh, đồng hồ)', reading: 'かけます', ex: '帰宅したら上着を脱いでハンガーに掛けます。 (Về đến nhà, tôi cởi áo khoác rồi treo lên móc.)' },
    '飾ります': { meaning: 'trang trí, bài trí', reading: 'かざります', ex: 'リビングのテーブルに季節のきれいな花を飾りました。 (Tôi cắm bình hoa tươi theo mùa để trang trí bàn phòng khách.)' },
    '並べます': { meaning: 'xếp thành hàng, bày biện', reading: 'ならべます', ex: '本棚に小説を背表紙が見えるように並べました。 (Tôi xếp tiểu thuyết lên giá sách sao cho nhìn rõ gáy sách.)' },
    '植えます': { meaning: 'trồng (cây cối, hoa quả)', reading: 'うえます', ex: '春になったら庭の花壇にチューリップの球根を植えます。 (Mùa xuân đến, tôi sẽ trồng củ hoa tulip vào bồn hoa trong vườn.)' },
    '戻します': { meaning: 'đưa trở lại vị trí cũ', reading: 'もどします', ex: '辞書を使い終わったら、必ず元の場所に戻してください。 (Sau khi dùng từ điển xong, nhất định hãy cất lại chỗ cũ nhé.)' },
    'まとめます': { meaning: 'tóm tắt, gom lại, sắp xếp có hệ thống', reading: 'まとめます', ex: '会議の重要ポイントを簡潔にメモ用紙にまとめました。 (Tôi đã tóm lược các ý quan trọng của cuộc họp vào tờ ghi chú.)' },
    '方づけます': { meaning: 'dọn dẹp ngăn nắp', reading: 'かたづけます', ex: 'お客様が来る前に、散らかっているリビングを片づけました。 (Trước khi khách đến, tôi đã dọn dẹp phòng khách bừa bộn thật ngăn nắp.)' },
    'しまいます': { meaning: 'cất đi (vào tủ, ngăn kéo)', reading: 'しまいます', ex: '乾いた洗濯物をきれいに畳んでクローゼットにしまいました。 (Tôi gấp quần áo khô ngay ngắn rồi cất vào tủ.)' },
    '決めます': { meaning: 'quyết định (kế hoạch, mục tiêu)', reading: 'きめます', ex: '話し合いの末、来月の旅行先を京都に決めました。 (Sau khi bàn bạc, chúng tôi đã quyết định chọn Kyoto làm điểm đến du lịch tháng sau.)' },
    '知らせます': { meaning: 'thông báo cho biết', reading: 'しらせます', ex: '詳しい日程が決まったら、参加者全員にメールで知らせます。 (Khi chốt xong lịch trình chi tiết, tôi sẽ gửi email thông báo cho tất cả người tham gia.)' },
    '祖横断します': { meaning: 'bàn bạc, thảo luận (相談します)', reading: 'そうだんします', ex: '進路について悩んだときは、信頼できる先輩に相談します。 (Khi băn khoăn về định hướng tương lai, tôi thường bàn bạc với tiền bối đáng tin cậy.)' },
    '予習します': { meaning: 'chuẩn bị bài trước', reading: 'よしゅうします', ex: '授業についていくために、前夜に新しい課の単語を予習します。 (Để theo kịp bài giảng, tối hôm trước tôi chuẩn bị bài từ vựng của bài mới.)' },
    '復習します': { meaning: 'ôn tập lại bài cũ', reading: 'ふくしゅうします', ex: '習った文法を忘れないように、毎晩30分復習しています。 (Để không quên ngữ pháp đã học, mỗi tối tôi dành 30 phút ôn tập lại.)' },
    'そのままにします': { meaning: 'cứ để nguyên như vậy', reading: 'そのままにします', ex: 'ペンキがまだ乾いていないので、触らずにそのままにしておいてください。 (Sơn vẫn chưa khô nên xin bạn đừng chạm vào mà cứ để nguyên như vậy nhé.)' },
    'お子さん': { meaning: 'con của quý vị (cách gọi tôn trọng)', reading: 'おこさん', ex: 'お子さんは元気でいらっしゃいますか。 (Các cháu nhà anh/chị dạo này vẫn khỏe mạnh cả chứ ạ?)' },
    '講義': { meaning: 'bài giảng đại học', reading: 'こうぎ', ex: '大学で日本経済についての専門的な講義を聴講しました。 (Tôi đã nghe bài giảng chuyên sâu về kinh tế Nhật Bản tại trường đại học.)' },
    'ミーテイング': { meaning: 'cuộc họp nội bộ (meeting)', reading: 'ミーティング', ex: '朝9時からプロジェクトの進捗を確認するミーティングを行います。 (Vào 9 giờ sáng, chúng tôi tổ chức cuộc họp để rà soát tiến độ dự án.)' },
    '予定': { meaning: 'kế hoạch, dự định', reading: 'よてい', ex: '来週の出張の予定をカレンダーに登録しておきました。 (Tôi đã lưu lịch trình chuyến công tác tuần tới vào lịch biểu.)' },
    '案内書': { meaning: 'sách hướng dẫn, tập tài liệu chỉ dẫn', reading: 'あんないしょ', ex: '観光案内所で市内の名所が載っている案内書をもらいました。 (Tại trung tâm thông tin du lịch, tôi nhận được tập sách hướng dẫn các địa danh trong thành phố.)' },
    'ポスター': { meaning: 'áp phích, tờ áp phích quảng cáo', reading: 'ポスター', ex: '駅の壁に新作映画の大きなポスターが貼ってあります。 (Trên tường nhà ga có dán một tấm áp phích lớn của bộ phim mới ra mắt.)' },
    'ごみ箱': { meaning: 'thùng rác', reading: 'ごみばこ', ex: '燃えるゴミとリサイクル用でごみ箱を分けて設置しています。 (Chúng tôi bố trí thùng rác riêng biệt cho rác cháy được và đồ tái chế.)' },
    '人形': { meaning: 'búp bê, con rối', reading: 'にんぎょう', ex: 'ひな祭りの日に伝統的な日本人形を床の間に飾りました。 (Vào ngày hội búp bê Hina, chúng tôi bài trí búp bê truyền thống Nhật ở góc phòng.)' },
    '鏡': { meaning: 'tấm gương soi', reading: 'かがみ', ex: '出かける前に玄関の鏡で身だしなみをチェックします。 (Trước khi ra ngoài, tôi chỉnh lại trang phục chỉnh tề trước gương sảnh.)' },
    '引き出し': { meaning: 'ngăn kéo bàn tủ', reading: 'ひきだし', ex: '机の上の引き出しに印鑑と通帳を大切に保管しています。 (Tôi cất giữ con dấu và sổ tiết kiệm cẩn thận trong ngăn kéo bàn làm việc.)' },
    '元の　所': { meaning: 'chỗ cũ, vị trí ban đầu', reading: 'もとのところ', ex: '使ったハサミは引き出しの元の所に戻しておいてください。 (Sau khi dùng kéo xong, bạn hãy cất lại đúng vị trí ban đầu trong ngăn kéo nhé.)' },
    '周り': { meaning: 'xung quanh, vùng lân cận', reading: 'まわり', ex: '家の周りは緑の木々に囲まれていて静かで住みやすいです。 (Xung quanh nhà được bao bọc bởi cây xanh, vừa yên tĩnh lại rất dễ sống.)' },
    '真ん中': { meaning: 'chính giữa, trung tâm', reading: 'まんなか', ex: 'ケーキの真ん中に真っ赤なイチゴが乗っています。 (Ở chính giữa chiếc bánh kem có đặt một quả dâu tây đỏ mọng.)' },
    'すみ': { meaning: 'góc (phòng, nhà)', reading: 'すみ', ex: '部屋のすみに観葉植物の鉢植えを置きました。 (Tôi đặt một chậu cây cảnh ở góc phòng.)' },
    '予定表': { meaning: 'bảng kế hoạch, thời gian biểu', reading: 'よていひょう', ex: 'オフィスのホワイトボードに今週の予定表を書き込みました。 (Tôi đã viết thời gian biểu tuần này lên bảng trắng của văn phòng.)' },
    'ごくろうさま': { meaning: 'bạn đã vất vả rồi (lời cảm ơn của cấp trên dành cho cấp dưới)', reading: 'ごくろうさま', ex: '長時間の運転、ご苦労様でした。少し休んでください。 (Cậu lái xe đường dài vất vả rồi, hãy nghỉ ngơi một chút đi nhé.)' },
    '希望': { meaning: 'nguyện vọng, niềm hy vọng', reading: 'きぼう', ex: '将来への大きな希望を胸に抱いて日本へやって来ました。 (Tôi đã sang Nhật Bản với niềm hy vọng to lớn về tương lai trong tim.)' },
    '何かご希望がありますか': { meaning: 'quý khách có yêu cầu/nguyện vọng gì không ạ?', reading: 'なにかごきぼうがありますか', ex: 'お部屋の広さや場所について、何かご希望がありますか。 (Về diện tích hay vị trí căn hộ, quý khách có nguyện vọng gì đặc biệt không ạ?)' },
    'ミュージカル': { meaning: 'vở nhạc kịch', reading: 'ミュージカル', ex: '劇場で迫力のある有名なミュージカルを鑑賞しました。 (Tôi đã thưởng thức một vở kịch âm nhạc nổi tiếng đầy cuốn hút tại nhà hát.)' },
    '月': { meaning: 'mặt trăng', reading: 'つき', ex: '今夜は空気が澄んでいて、夜空に浮かぶ満月がとても綺麗です。 (Tối nay không khí trong lành, vầng trăng tròn trên bầu trời đêm thật đẹp.)' },
    '地球': { meaning: 'Trái Đất', reading: 'ちきゅう', ex: '環境を守るために、地球に優しい生活を心がけましょう。 (Để bảo vệ môi trường, chúng ta hãy hướng tới lối sống thân thiện với Trái Đất.)' },
    'うれしい': { meaning: 'vui mừng, hạnh phúc', reading: 'うれしい', ex: '試験に合格したと知って、飛び上がるほどうれしかったです。 (Khi biết tin mình đã thi đỗ, tôi vui sướng đến mức muốn nhảy cẫng lên.)' },
    'いや（な）': { meaning: 'khó chịu, ghét, không thích', reading: 'いや「な」', ex: '雨の日に満員電車に乗るのは本当に嫌なものです。 (Phải chen chúc trên tàu điện chật ních vào ngày mưa thật là khó chịu.)' },
    'すると': { meaning: 'thế rồi, ngay sau đó', reading: 'すると', ex: 'ベルを鳴らしました。すると、奥から優しい笑顔の店主が出てきました。 (Tôi bấm chuông. Thế rồi, một người chủ quán với nụ cười hiền hậu bước ra.)' },
    '目が覚めます': { meaning: 'tỉnh giấc, thức giấc (tự động từ)', reading: 'めがさめます', ex: '小鳥の爽やかな鳴き声を聞いて、自然と朝6時に目が覚めました。 (Nghe tiếng chim hót líu lo, tôi tự nhiên tỉnh giấc vào lúc 6 giờ sáng.)' }
  },

  // ================= UNIT 31 =================
  'unit-31': {
    '始まります': { meaning: 'bắt đầu (tự động từ: sự kiện, trận đấu)', reading: 'はじまります', ex: 'まもなく第1会議室で大切なプレゼンテーションが始まります。 (Bài thuyết trình quan trọng sắp sửa bắt đầu ở phòng họp số 1.)' },
    '続ける': { meaning: 'tiếp tục, duy trì (tha động từ)', reading: 'つづける', ex: 'どんなに忙しくても、毎日の日本語の勉強を続けます。 (Dù bận rộn đến mấy tôi cũng sẽ tiếp tục việc học tiếng Nhật mỗi ngày.)' },
    '見つめます': { meaning: 'nhìn chăm chú, dõi theo', reading: 'みつめます', ex: '母は旅立つ息子の後ろ姿を温かい目で見つめていました。 (Người mẹ dõi theo bóng lưng con trai lên đường bằng ánh mắt ấm áp.)' },
    '受けます': { meaning: 'tham dự (kỳ thi: 試験を受ける)', reading: 'うけます', ex: '今年の12月に日本語能力試験N3を受ける予定です。 (Tôi dự định sẽ tham dự kỳ thi JLPT N3 vào tháng 12 năm nay.)' },
    '入学します': { meaning: 'nhập học (vào trường học)', reading: 'にゅうがくします', ex: '厳しい受験勉強を乗り越えて、念願の大学に入学しました。 (Vượt qua kỳ ôn thi vất vả, tôi đã nhập học vào trường đại học hằng mơ ước.)' },
    '卒業します': { meaning: 'tốt nghiệp (ra trường)', reading: 'そつぎょうします', ex: '来年の春に専門学校を卒業してIT企業に就職します。 (Mùa xuân năm sau tôi sẽ tốt nghiệp trường chuyên môn và đi làm ở công ty IT.)' },
    '休憩します': { meaning: 'nghỉ giải lao, giải lao giữa giờ', reading: 'きゅうけいします', ex: '2時間集中して勉強したので、お茶を飲んで10分休憩します。 (Sau 2 tiếng học tập tập trung, tôi uống trà và nghỉ giải lao 10 phút.)' },
    '連休': { meaning: 'kỳ nghỉ dài ngày liên tiếp', reading: 'れんきゅう', ex: '5月のゴールデンウィークの連休を利用して温泉旅行に行きました。 (Tận dụng kỳ nghỉ dài tuần lễ vàng tháng 5, tôi đã đi du lịch suối nước nóng.)' },
    '展覧会': { meaning: 'triển lãm (tranh ảnh, nghệ thuật)', reading: 'てんらんかい', ex: '上野の美術館で開かれている近代絵画の展覧会を見に行きました。 (Tôi đến xem buổi triển lãm tranh hội họa cận đại được tổ chức ở bảo tàng Ueno.)' },
    '結婚式': { meaning: 'lễ thành hôn, đám cưới', reading: 'けっこんしき', ex: '親友の結婚式に出席して、心からのお祝いを伝えました。 (Tôi đã đến dự đám cưới của người bạn thân và gửi lời chúc phúc chân thành.)' },
    '「お」葬式': { meaning: 'lễ tang, đám tang', reading: 'おそうしき', ex: 'お葬式には黒いスーツを着て参列するのが日本のマナーです。 (Mặc âu phục màu đen đi viếng tang lễ là phép lịch sự ở Nhật Bản.)' },
    '式': { meaning: 'buổi lễ, nghi lễ', reading: 'しき', ex: '明日の朝9時から講堂で新入社員の入社式が行われます。 (Lễ đón nhân viên mới sẽ diễn ra tại hội trường vào 9 giờ sáng mai.)' },
    '本社': { meaning: 'trụ sở chính (công ty)', reading: 'ほんしゃ', ex: '業務報告のために東京の丸の内にある本社へ出張しました。 (Tôi đã đi công tác đến trụ sở chính ở Marunouchi, Tokyo để báo cáo công việc.)' },
    '支店': { meaning: 'chi nhánh (ngân hàng, công ty)', reading: 'してん', ex: '来月から大阪の支店に転勤することになりました。 (Từ tháng sau, tôi được điều chuyển công tác về chi nhánh Osaka.)' },
    '教会': { meaning: 'nhà thờ', reading: 'きょうかい', ex: '日曜日の朝に丘の上の美しい教会から鐘の音が響いてきます。 (Sáng Chủ nhật, tiếng chuông ngân vang từ ngôi nhà thờ xinh đẹp trên đồi.)' },
    '大学院': { meaning: 'cao học, viện đào tạo sau đại học', reading: 'だいがくいん', ex: '大学を卒業した後は、大学院に進学して専門研究を深めたいです。 (Sau khi tốt nghiệp đại học, tôi muốn học lên cao học để nghiên cứu chuyên sâu.)' },
    '動物園': { meaning: 'vườn bách thú, sở thú', reading: 'どうぶつえん', ex: '週末に家族で動物園へ行き、可愛いパンダを見ました。 (Cuối tuần tôi cùng gia đình đi sở thú và ngắm chú gấu trúc dễ thương.)' },
    '温泉': { meaning: 'suối nước nóng thiên nhiên', reading: 'おんせん', ex: '寒い冬の日に露天風呂の温泉に浸かると最高の気分です。 (Vào ngày đông giá rét, ngâm mình trong suối nước nóng ngoài trời thật là sảng khoái.)' },
    'お客「さん」': { meaning: 'khách hàng, khách quý', reading: 'おきゃくさん', ex: 'お店のスタッフがお客さんに笑顔で丁寧に対応しています。 (Nhân viên quán mỉm cười phục vụ khách hàng rất chu đáo.)' },
    'だれか': { meaning: 'ai đó (không xác định danh tính)', reading: 'だれか', ex: '部屋の外でだれかが呼んでいるような声が聞こえました。 (Nghe như có tiếng ai đó đang gọi ở bên ngoài phòng.)' },
    '残ります': { meaning: 'còn lại, sót lại (tự động từ)', reading: 'のこります', ex: '仕事がまだ終わっていないので、今夜は会社に残って残業します。 (Vì công việc vẫn chưa xong nên tối nay tôi sẽ ở lại công ty để làm thêm giờ.)' },
    '月に': { meaning: 'trong một tháng', reading: 'つきに', ex: '月に2回、実家の両親に元気な顔を見せに帰省しています。 (Mỗi tháng 2 lần tôi đều về quê thăm để bố mẹ yên tâm.)' },
    '普通の': { meaning: 'bình thường, thông thường', reading: 'ふつうの', ex: '特別な日ではなくても、普通の日常を大切に過ごしたいです。 (Dù chẳng phải ngày đặc biệt, tôi vẫn muốn trân trọng những ngày thường bình dị.)' },
    'インターネット': { meaning: 'mạng internet', reading: 'インターネット', ex: 'インターネットを使って、世界中の最新ニュースを素早く調べます。 (Dùng mạng internet, ta có thể tra cứu nhanh chóng tin tức mới nhất khắp thế giới.)' },
    '閉じます': { meaning: 'đóng lại (sách vở, mắt, miệng)', reading: 'とじます', ex: '授業が終わったので、開いていた教科書を静かに閉じました。 (Giờ học đã kết thúc nên tôi nhẹ nhàng khép cuốn sách giáo khoa lại.)' },
    '都会': { meaning: 'thành phố lớn, đô thị sầm uất', reading: 'とかい', ex: '便利な都会での暮らしも楽しいですが、たまには自然が恋しくなります。 (Sống ở đô thị tiện nghi cũng vui nhưng thỉnh thoảng tôi lại nhớ thiên nhiên.)' },
    '子供たち': { meaning: 'các em nhỏ, lũ trẻ', reading: 'こどもたち', ex: '公園の広場で子供たちが元気に鬼ごっこをして遊んでいます。 (Ở bãi đất trống trong công viên, lũ trẻ đang chơi trò đuổi bắt vui vẻ.)' },
    '世界中': { meaning: 'trên toàn thế giới', reading: 'せかいじゅう', ex: '日本のアニメや和食は、今や世界中で愛されています。 (Phim hoạt hình và ẩm thực Nhật Bản ngày nay được yêu mến trên toàn thế giới.)' },
    '集まります': { meaning: 'tụ họp, tập hợp lại (tự động từ)', reading: 'あつまります', ex: '駅前の広場にイベントを見ようと大勢の人が集まりました。 (Tại quảng trường trước ga, rất đông người đã tụ họp để xem sự kiện.)' },
    '美しい': { meaning: 'xinh đẹp, tuyệt mỹ, trong sáng', reading: 'うつくしい', ex: '夕暮れ時に富士山の頂上を染める夕焼けがとても美しいです。 (Ánh hoàng hôn nhuộm đỏ đỉnh núi Phú Sĩ lúc chiều tà đẹp vô cùng.)' },
    '自然': { meaning: 'tự nhiên, giới tự nhiên', reading: 'しぜん', ex: '週末は都会を離れて、豊かな自然の中でリフレッシュします。 (Cuối tuần tôi rời khỏi thành phố để thư giãn giữa thiên nhiên phong phú.)' },
    'すばらしさ': { meaning: 'sự tuyệt vời, nét đẹp diệu kỳ', reading: 'すばらしさ', ex: '異文化を体験して、改めて日本の伝統文化のすばらしさを実感しました。 (Trải nghiệm văn hóa khác giúp tôi cảm nhận sâu sắc hơn sự tuyệt vời của văn hóa Nhật.)' },
    '気が付きます': { meaning: 'nhận ra, nhận biết được', reading: 'きがつきます', ex: '電車を降りてから、カバンを忘れたことに気が付きました。 (Sau khi bước xuống tàu, tôi mới sực nhận ra mình đã để quên túi xách.)' }
  }
};

function runBatch1() {
  console.log('='.repeat(70));
  console.log('TIẾN HÀNH CHUẨN HÓA MINNA N4 BATCH 1 (BÀI 26, 27, 28, 29, 30, 31)');
  console.log('='.repeat(70));

  let totalUpdated = 0;

  for (const [unitFolder, dict] of Object.entries(UNIT_DICTIONARY)) {
    const filePath = path.join(DATA_DIR, unitFolder, 'vocabulary.json');
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
      console.log(`[OK] Đã chuẩn hóa ${unitFolder}: cập nhật từ vựng & câu ví dụ.`);
    }
  }

  console.log(`\nHoàn tất Batch 1. Tổng số từ vựng cập nhật: ${totalUpdated}`);
}

runBatch1();

/**
 * refine-minna-n5-comprehensive.js
 * Chuẩn hóa toàn bộ các từ vựng Minna no Nihongo N5 bị lệch nghĩa, câu template lặp lại, lỗi rác HTML markup.
 */

const fs = require('fs');
const path = require('path');

const n5Fixes = {
  // unit-01
  "～人": {
    word: "～人",
    reading: "～じん",
    sino: "NHÂN",
    meaning: "người (hậu tố chỉ quốc tịch)",
    example: "マリアさんはベトナム人です。(Cô Maria là người Việt Nam.)"
  },
  // unit-02
  "それ": {
    word: "それ",
    reading: "それ",
    sino: "",
    meaning: "cái đó (gần người nghe)",
    example: "それは日本語の辞書ですか。(Cái đó có phải là cuốn từ điển tiếng Nhật không?)"
  },
  "あれ": {
    word: "あれ",
    reading: "あれ",
    sino: "",
    meaning: "cái kia (ở xa cả hai người)",
    example: "あれは誰の車ですか。(Cái kia là xe ô tô của ai thế?)"
  },
  "その": {
    word: "その",
    reading: "その",
    sino: "",
    meaning: "đó, ấy (đứng trước danh từ, gần người nghe)",
    example: "その本を読んでもいいですか。(Tôi có thể đọc cuốn sách đó được không?)"
  },
  "あの": {
    word: "あの",
    reading: "あの",
    sino: "",
    meaning: "kia (đứng trước danh từ, xa cả hai người)",
    example: "あの方はどなたですか。(Vị kia là ai thế ạ?)"
  },
  "そうですか。": {
    word: "そうですか",
    reading: "そうですか",
    sino: "",
    meaning: "thế à, vậy à (tiếp nhận thông tin)",
    example: "「明日は休みですよ」「そうですか、知らなかった」。(\"Ngày mai được nghỉ đấy\" \"Thế à, tôi không biết đấy\".)"
  },
  "どうぞ": {
    word: "どうぞ",
    reading: "どうぞ",
    sino: "",
    meaning: "xin mời (mời ăn, mời vào, đưa đồ)",
    example: "温かいお茶をどうぞお召し上がりください。(Xin mời bạn dùng tách trà ấm nóng nhé.)"
  },
  // unit-03
  "ここ": {
    word: "ここ",
    reading: "ここ",
    sino: "",
    meaning: "chỗ này, ở đây (gần người nói)",
    example: "ここは大学の図書館です。(Ở đây là thư viện của trường đại học.)"
  },
  // unit-04
  "大変ですね": {
    word: "大変ですね",
    reading: "たいへんですね",
    sino: "ĐẠI BIẾN",
    meaning: "vất vả quá nhỉ, gay go nhỉ",
    example: "毎晩遅くまで残業ですか。それは大変ですね。(Tối nào cũng làm thêm đến muộn à? Như thế thì vất vả quá nhỉ.)"
  },
  "～から": {
    word: "～から",
    reading: "～から",
    sino: "",
    meaning: "từ ～ (thời gian, địa điểm)",
    example: "学校の授業は朝九時から始まります。(Tiết học ở trường bắt đầu từ chín giờ sáng.)"
  },
  "～まで": {
    word: "～まで",
    reading: "～まで",
    sino: "",
    meaning: "đến ～ (thời gian, địa điểm)",
    example: "夕方五時まで図書館で勉強します。(Tôi học bài ở thư viện đến năm giờ chiều.)"
  },
  "ペキン": {
    word: "ペキン",
    reading: "ペキン",
    sino: "",
    meaning: "thành phố Bắc Kinh (Trung Quốc)",
    example: "来週、仕事で中国のペキンへ出張します。(Tuần sau tôi đi công tác ở thành phố Bắc Kinh Trung Quốc.)"
  },
  "ロンドン": {
    word: "ロンドン",
    reading: "ロンドン",
    sino: "",
    meaning: "thành phố Luân Đôn (London, Anh)",
    example: "兄はイギリスのロンドンに留学しています。(Anh trai tôi đang đi du học ở thành phố Luân Đôn nước Anh.)"
  },
  "バンコク": {
    word: "バンコク",
    reading: "バンコク",
    sino: "",
    meaning: "thành phố Băng Cốc (Bangkok, Thái Lan)",
    example: "夏休みにタイのバンコクへ観光旅行に行きました。(Kỳ nghỉ hè tôi đã đi du lịch tới thành phố Băng Cốc Thái Lan.)"
  },
  "えーと": {
    word: "えーと",
    reading: "えーと",
    sino: "",
    meaning: "ừm, để tôi xem nào (câu đệm suy nghĩ)",
    example: "「集合時間は何時でしたっけ」「えーと、確か朝八時です」。(\"Giờ tập trung là mấy giờ ấy nhỉ?\" \"Ừm để tôi xem nào, chắc là tám giờ sáng\".)"
  },
  // unit-05
  "新幹線": {
    word: "新幹線",
    reading: "しんかんせん",
    sino: "TÂN CÁN TUYẾN",
    meaning: "tàu siêu tốc Shinkansen",
    example: "東京から新幹線に乗って京都へ向かいました。(Tôi lên tàu siêu tốc Shinkansen từ Tokyo để đi đến Kyoto.)"
  },
  "彼": {
    word: "彼",
    reading: "かれ",
    sino: "BỈ",
    meaning: "anh ấy, bạn trai; người ấy",
    example: "彼はいつも親切で頼りになる友達です。(Anh ấy luôn là một người bạn tốt bụng và đáng tin cậy.)"
  },
  "来年": {
    word: "来年",
    reading: "らいねん",
    sino: "LAI NIÊN",
    meaning: "năm sau, sang năm",
    example: "来年の春に大学を卒業する予定です。(Tôi dự định sẽ tốt nghiệp đại học vào mùa xuân năm sau.)"
  },
  // unit-06
  "見ます": {
    word: "見ます",
    reading: "みます",
    sino: "KIẾN",
    meaning: "xem, nhìn (phim, tivi, phong cảnh)",
    example: "休日の夜に映画館で話題の映画を見ます。(Tối ngày nghỉ tôi đến rạp chiếu bóng để xem bộ phim đang được chú ý.)"
  },
  "します": {
    word: "します",
    reading: "します",
    sino: "",
    meaning: "làm, chơi (thể thao, bài tập); đeo",
    example: "放課後、グラウンドで友達と一緒にサッカーをします。(Sau giờ học, tôi cùng bạn bè chơi đá bóng ở sân trường.)"
  },
  "いつも": {
    word: "いつも",
    reading: "いつも",
    sino: "",
    meaning: "luôn luôn, lúc nào cũng",
    example: "彼はいつも朝早く起きて散歩しています。(Anh ấy lúc nào cũng dậy sớm đi dạo.)"
  },
  "分かりまた。": {
    word: "分かりました",
    reading: "わかりました",
    sino: "PHÂN",
    meaning: "tôi hiểu rồi, tôi rõ rồi",
    example: "先生、丁寧なご説明ありがとうございます。よく分かりました。(Em cảm ơn thầy đã giải thích tận tình, em đã hiểu rất rõ rồi ạ.)"
  },
  "じゃ、また。": {
    word: "じゃ、また",
    reading: "じゃ、また",
    sino: "",
    meaning: "hẹn gặp lại nhé, chào nhé",
    example: "今日は楽しかったね。じゃ、また明日。(Hôm nay vui quá nhỉ. Hẹn gặp lại cậu vào ngày mai nhé.)"
  },
  // unit-07
  "パンチ": {
    word: "パンチ",
    reading: "パンチ",
    sino: "",
    meaning: "kìm dập lỗ, cái dập lỗ (giấy)",
    example: "書類をファイルにとじるためにパンチで穴を開けます。(Tôi dùng kìm dập lỗ để bấm lỗ kẹp tài liệu vào bìa còng.)"
  },
  "かみ": {
    word: "かみ",
    reading: "かみ",
    sino: "CHỈ",
    meaning: "giấy",
    example: "ノートの白い紙にペンで丁寧に文字を書きます。(Tôi dùng bút nắn nót viết chữ lên trang giấy trắng của cuốn vở.)"
  },
  "これから": {
    word: "これから",
    reading: "これから",
    sino: "",
    meaning: "từ bây giờ, sau đây",
    example: "これから友達と一緒に晩ご飯を食べに行きます。(Từ bây giờ tôi cùng bạn bè đi ăn bữa tối.)"
  },
  "旅行": {
    word: "旅行",
    reading: "りょこう",
    sino: "LỮ HÀNH",
    meaning: "du lịch, chuyến đi",
    example: "夏休みに家族みんなで温泉旅行に行きました。(Vào kỳ nghỉ hè cả gia đình tôi đã đi du lịch suối nước nóng.)"
  },
  // unit-08
  "いい": {
    word: "いい",
    reading: "いい",
    sino: "",
    meaning: "tốt, đẹp, hay; được",
    example: "今日は天気がとてもいいので洗濯物を干します。(Hôm nay thời tiết rất tốt và đẹp nên tôi đem quần áo ra phơi.)"
  },
  "優しい": {
    word: "優しい",
    reading: "やさしい",
    sino: "ƯU",
    meaning: "hiền từ, dịu dàng, tốt bụng",
    example: "彼女はいつも誰に対しても優しい笑顔で接してくれます。(Cô ấy lúc nào cũng đối xử hiền từ dịu dàng với mọi người bằng nụ cười ấm áp.)"
  },
  "つまらない": {
    word: "つまらない",
    reading: "つまらない",
    sino: "",
    meaning: "nhàm chán, buồn tẻ, tẻ nhạt",
    example: "ストーリーの展開が予想通りで、少しつまらない映画でした。(Nội dung phim dễ đoán nên là một bộ phim hơi nhàm chán tẻ nhạt.)"
  },
  "楽しい": {
    word: "楽しい",
    reading: "たのしい",
    sino: "LẠC",
    meaning: "vui vẻ, vui tươi, thú vị",
    example: "休日に遊園地へ行って一日中楽しく過ごしました。(Vào ngày nghỉ tôi đến công viên giải trí và trải qua cả ngày rất vui vẻ.)"
  },
  "桜": {
    word: "桜",
    reading: "さくら",
    sino: "ANH",
    meaning: "hoa anh đào (Sakura)",
    example: "春になると公園の桜が一斉に咲いて美しいです。(Khi mùa xuân đến, hoa anh đào trong công viên đồng loạt nở rộ tuyệt đẹp.)"
  },
  "あまり～ません(くない)": {
    word: "あまり～ません",
    reading: "あまり～ません",
    sino: "",
    meaning: "không... lắm (đi với phủ định)",
    example: "この料理はあまり辛くありません。(Món ăn này không cay lắm.)"
  },
  "そうですね": {
    word: "そうですね",
    reading: "そうですね",
    sino: "",
    meaning: "ừ đúng nhỉ, để xem nào",
    example: "「今日はいい天気ですね」「そうですね、散歩に行きましょう」。(\"Hôm nay thời tiết đẹp nhỉ\" \"Ừ đúng nhỉ, chúng ta cùng đi dạo nhé\".)"
  },
  // unit-09
  "あります": {
    word: "あります",
    reading: "あります",
    sino: "HỮU",
    meaning: "có (sự kiện, đồ vật, cuộc hẹn)",
    example: "日曜日に大学の講堂でスピーチ大会があります。(Chủ nhật có cuộc thi hùng biện được tổ chức ở giảng đường đại học.)"
  },
  "下手な": {
    word: "下手な",
    reading: "へたな",
    sino: "HẠ THỦ",
    meaning: "kém cỏi, vụng về, dở",
    example: "私は歌が下手なので人前で歌うのが恥ずかしいです。(Tôi hát rất dở nên thấy ngại khi hát trước mặt mọi người.)"
  },
  "歌舞伎": {
    word: "歌舞伎",
    reading: "かぶき",
    sino: "CA VŨ KĨ",
    meaning: "kịch Kabuki truyền thống Nhật Bản",
    example: "銀座の劇場で初めて伝統的な歌舞伎を鑑賞しました。(Lần đầu tiên tôi thưởng thức kịch Kabuki truyền thống ở nhà hát Ginza.)"
  },
  "字": {
    word: "字",
    reading: "じ",
    sino: "TỰ",
    meaning: "chữ, chữ viết, nét chữ",
    example: "彼はとてもきれいで読みやすい字を書きます。(Anh ấy viết chữ rất đẹp và dễ đọc.)"
  },
  "細かいお金": {
    word: "細かいお金",
    reading: "こまかいおかね",
    sino: "TẾ KIM",
    meaning: "tiền lẻ",
    example: "バスの運賃を払うために細かいお金を用意しました。(Tôi chuẩn bị sẵn tiền lẻ để trả tiền vé xe buýt.)"
  },
  "だいたい": {
    word: "だいたい",
    reading: "だいたい",
    sino: "ĐẠI KHÁI",
    meaning: "đại khái, hầu như, phần lớn",
    example: "先生の説明を聞いて、だいたいの内容は分かりました。(Nghe thầy giải thích, tôi đã hiểu được đại khái nội dung.)"
  },
  "ざんねんです[ね]。": {
    word: "残念ですね",
    reading: "ざんねんですね",
    sino: "TÀN NIỆM",
    meaning: "tiếc thật nhỉ, đáng tiếc nhỉ",
    example: "「旅行に行けなくなりました」「それは残念ですね」。(\"Tôi không đi du lịch được rồi\" \"Thế thì tiếc thật nhỉ\".)"
  },
  "もしもし": {
    word: "もしもし",
    reading: "もしもし",
    sino: "",
    meaning: "a-lô (chào khi nghe điện thoại)",
    example: "電話に出て「もしもし、田中ですが」と名乗りました。(Bắt máy điện thoại, tôi nói: \"A-lô, tôi là Tanaka đây ạ\".)"
  },
  "(～は) ちょっと…..": {
    word: "～はちょっと…",
    reading: "～はちょっと",
    sino: "",
    meaning: "thì hơi kẹt, hơi khó (từ chối khéo)",
    example: "「今晩飲みに行きませんか」「すみません、今晩はちょっと都合が悪くて…」。(\"Tối nay đi uống không?\" \"Xin lỗi, tối nay tôi hơi kẹt bận chút...\".)"
  },
  "また今度お願いします。": {
    word: "また今度お願いします",
    reading: "またこんどおねがいします",
    sino: "KIM ĐỘ NGUYỆN",
    meaning: "hẹn lần sau nhé, để lần khác nhé (từ chối khéo)",
    example: "「食事に行きませんか」「あいにく予定がありまして、また今度お願いします」。(\"Đi ăn cùng không?\" \"Tiếc quá tôi có lịch rồi, hẹn lần sau nhé\".)"
  },
  // unit-10
  "スイッチ": {
    word: "スイッチ",
    reading: "スイッチ",
    sino: "",
    meaning: "công tắc (bật/tắt điện)",
    example: "部屋に入ってすぐに壁の電気のスイッチを入れました。(Vừa vào phòng tôi đã bật ngay công tắc điện trên tường.)"
  },
  "テーブル": {
    word: "テーブル",
    reading: "テーブル",
    sino: "",
    meaning: "bàn, bàn ăn",
    example: "家族みんなで温かい料理が並ぶテーブルを囲みます。(Cả gia đình quây quần bên chiếc bàn ăn bày những món nóng hổi.)"
  },
  "上": {
    word: "上",
    reading: "うえ",
    sino: "THƯỢNG",
    meaning: "bên trên, phía trên",
    example: "机の上に教科書とノートを広げて勉強します。(Tôi mở sách vở trên mặt bàn để học bài.)"
  },
  "～や～「など」": {
    word: "～や～など",
    reading: "～や～など",
    sino: "",
    meaning: "như là ～ và ～, vân vân (liệt kê)",
    example: "机の上に本やペンなどがあります。(Trên bàn có sách, bút, vân vân.)"
  },
  "ー段目": {
    word: "～段目",
    reading: "～だんめ",
    sino: "ĐOẠN MỤC",
    meaning: "ngăn thứ ～, tầng thứ ～ (kệ, tủ)",
    example: "本棚の二段目にお気に入りの小説を並べました。(Tôi xếp những cuốn tiểu thuyết yêu thích vào tầng thứ hai của giá sách.)"
  },
  "ユニューや ストア": {
    word: "スーパー",
    reading: "スーパー",
    sino: "",
    meaning: "siêu thị (cửa hàng bách hóa)",
    example: "駅前のスーパーで新鮮な果物と野菜を買いました。(Tôi đã mua rau quả tươi ở siêu thị trước nhà ga.)"
  },
  // unit-11
  "二つ": {
    word: "二つ",
    reading: "ふたつ",
    sino: "NHỊ",
    meaning: "hai cái, hai chiếc (vật chung)",
    example: "パン屋で美味しいクロワッサンを二つ買いました。(Tôi đã mua hai chiếc bánh sừng bò thơm ngon ở tiệm bánh.)"
  },
  "三つ": {
    word: "三つ",
    reading: "みっつ",
    sino: "TAM",
    meaning: "ba cái, ba chiếc (vật chung)",
    example: "テーブルの上にリンゴが三つ置いてあります。(Ở trên bàn có đặt ba quả táo.)"
  },
  "五つ": {
    word: "五つ",
    reading: "いつつ",
    sino: "NGŨ",
    meaning: "năm cái, năm chiếc (vật chung)",
    example: "お土産に美味しいお菓子を五つ買いました。(Tôi đã mua năm chiếc bánh kẹo ngon để làm quà lưu niệm.)"
  },
  "七つ": {
    word: "七つ",
    reading: "ななつ",
    sino: "THẤT",
    meaning: "bảy cái, bảy chiếc (vật chung)",
    example: "お皿の上にみかんが七つ並んでいます。(Trên đĩa có bày bảy quả quýt.)"
  },
  "九つ": {
    word: "九つ",
    reading: "ここのつ",
    sino: "CỬU",
    meaning: "chín cái, chín chiếc (vật chung)",
    example: "箱の中にチョコレートが九つ入っています。(Trong hộp có chín viên kẹo sô-cô-la.)"
  },
  "いくつ": {
    word: "いくつ",
    reading: "いくつ",
    sino: "",
    meaning: "bao nhiêu cái, mấy cái; mấy tuổi",
    example: "「卵はいくつ要りますか」「三つください」。(\"Cần bao nhiêu quả trứng?\" \"Cho tôi ba quả\".)"
  },
  "～まい": {
    word: "～枚",
    reading: "～まい",
    sino: "MAI",
    meaning: "tờ, chiếc, lá (đơn vị đếm vật mỏng)",
    example: "切手を二枚買って封筒に貼りました。(Tôi mua hai con tem rồi dán lên phong bì.)"
  },
  "葉書": {
    word: "葉書",
    reading: "はがき",
    sino: "DIỆP THƯ",
    meaning: "bưu thiếp, bưu ảnh",
    example: "旅先から友達へ綺麗な景色が印刷された葉書を送りました。(Từ nơi du lịch tôi đã gửi tấm bưu thiếp in phong cảnh đẹp cho bạn mình.)"
  },
  "速達": {
    word: "速達",
    reading: "そくたつ",
    sino: "TỐC ĐẠT",
    meaning: "thư hỏa tốc, chuyển phát nhanh",
    example: "大事な手紙を速達で送ると翌朝には届きます。(Gửi bức thư quan trọng bằng thư hỏa tốc thì sáng hôm sau sẽ tới nơi.)"
  },
  "兄": {
    word: "兄",
    reading: "あに",
    sino: "HUYNH",
    meaning: "anh trai (của mình)",
    example: "私の兄は会社員で、東京で働いています。(Anh trai tôi là nhân viên công ty, đang làm việc ở Tokyo.)"
  },
  "&lt;～時間": {
    word: "～時間",
    reading: "～じかん",
    sino: "THỜI GIAN",
    meaning: "～ tiếng đồng hồ (khoảng thời gian)",
    example: "毎日二時間日本語を熱心に勉強しています。(Mỗi ngày tôi đều chăm chỉ học tiếng Nhật suốt hai tiếng đồng hồ.)"
  },
  "&lt;～週間&gt;": {
    word: "～週間",
    reading: "～しゅうかん",
    sino: "CHU GIAN",
    meaning: "～ tuần lễ",
    example: "二週間の夏休みを利用して北海道へ旅行しました。(Tôi tận dụng kỳ nghỉ hè hai tuần lễ để đi du lịch Hokkaido.)"
  },
  "&lt;～ヶ月&gt;": {
    word: "～か月",
    reading: "～かげつ",
    sino: "NGUYỆT",
    meaning: "～ tháng (khoảng thời gian)",
    example: "日本に来てから三か月が経ちました。(Kể từ khi tôi đến Nhật Bản đã trôi qua ba tháng.)"
  },
  "&lt;～年&gt;": {
    word: "～年",
    reading: "～ねん",
    sino: "NIÊN",
    meaning: "～ năm (khoảng thời gian, năm thứ)",
    example: "日本に来てから三年の年月が経ちました。(Kể từ khi tôi đến Nhật Bản đã ba năm trôi qua.)"
  },
  "いいお天気ですね": {
    word: "いいお天気ですね",
    reading: "いいおてんきですね",
    sino: "THIÊN KHÍ",
    meaning: "thời tiết đẹp nhỉ (lời chào xã giao)",
    example: "ご近所さんに「いいお天気ですね」と笑顔で挨拶しました。(Tôi tươi cười chào người hàng xóm: \"Hôm nay thời tiết đẹp nhỉ\".)"
  },
  "いってらっしゃい": {
    word: "いってらっしゃい",
    reading: "いってらっしゃい",
    sino: "",
    meaning: "anh/chị đi nhé, đi cẩn thận nhé",
    example: "出かける子どもに「気をつけて、いってらっしゃい」と声をかけました。(Tôi dặn đứa con lúc đi ra ngoài: \"Con đi cẩn thận nhé\".)"
  },
  // unit-12
  "いい [コーヒーが～]": {
    word: "いい [コーヒーが～]",
    reading: "いい",
    sino: "",
    meaning: "thích, chọn (dùng khi chọn đồ uống, món ăn)",
    example: "「お飲み物は何にしますか」「コーヒーがいいです」。(\"Bạn dùng đồ uống gì?\" \"Tôi chọn cà phê\".)"
  },
  "てんぷら": {
    word: "てんぷら",
    reading: "てんぷら",
    sino: "",
    meaning: "món chiên giòn Tempura (tôm, rau củ)",
    example: "揚げたてでサクサクのてんぷらを美味しくいただきました。(Tôi đã thưởng thức món tempura chiên giòn rụm vừa mới ra lò rất ngon miệng.)"
  },
  "ただいま。": {
    word: "ただいま",
    reading: "ただいま",
    sino: "",
    meaning: "tôi đã về rồi đây (chào khi về nhà)",
    example: "家に帰って玄関で「ただいま」と大きな声で言いました。(Về đến nhà, tôi nói to ở cửa tiền sảnh: \"Tôi đã về rồi đây\".)"
  },
  "お帰かえりなさい。": {
    word: "お帰りなさい",
    reading: "おかえりなさい",
    sino: "QUY",
    meaning: "anh/chị đã về đấy à (chào người mới về)",
    example: "仕事から帰ってきた父に「お帰りなさい、お疲れ様でした」と言いました。(Tôi chào bố vừa đi làm về: \"Bố đã về đấy à, bố làm việc vất vả rồi ạ\".)"
  },
  "すごいですね。": {
    word: "すごいですね",
    reading: "すごいですね",
    sino: "",
    meaning: "giỏi quá nhỉ, tuyệt vời quá nhỉ",
    example: "「試験で満点を取りました」「それはすごいですね！」(\"Tôi được điểm tối đa trong kỳ thi đấy\" \"Thế thì giỏi quá nhỉ!\".)"
  },
  // unit-13
  "狭い": {
    word: "狭い",
    reading: "せまい",
    sino: "HIỆP",
    meaning: "hẹp, chật hẹp",
    example: "この部屋は少し狭いですが、家賃が安くて静かです。(Căn phòng này hơi chật hẹp một chút nhưng tiền thuê rẻ và yên tĩnh.)"
  },
  "市役所": {
    word: "市役所",
    reading: "しやくしょ",
    sino: "THỊ DỊCH SỞ",
    meaning: "tòa thị chính, ủy ban thành phố",
    example: "市役所へ行って住民票の手続きを済ませました。(Tôi đến tòa thị chính để hoàn tất thủ tục đăng ký cư trú.)"
  },
  "スキー": {
    word: "スキー",
    reading: "スキー",
    sino: "",
    meaning: "môn trượt tuyết, ván trượt tuyết",
    example: "冬休みに長野県の雪山へスキーに行きました。(Kỳ nghỉ đông tôi đã đi trượt tuyết ở vùng núi tuyết của tỉnh Nagano.)"
  },
  "そうしましょう。": {
    word: "そうしましょう",
    reading: "そうしましょう",
    sino: "",
    meaning: "chúng ta làm như thế đi, nhất trí như vậy nhé",
    example: "「少し疲れたから休憩しましょうか」「はい、そうしましょう」。(\"Hơi mệt rồi chúng ta nghỉ chút nhé?\" \"Vâng, chúng ta làm như thế đi\".)"
  },
  "別々に": {
    word: "別々に",
    reading: "べつべつに",
    sino: "BIỆT",
    meaning: "riêng biệt, riêng rẽ (tính tiền riêng)",
    example: "お会計は一緒ではなく、別々にお願いします。(Làm ơn tính tiền riêng biệt từng người chứ không gộp chung ạ.)"
  },
  // unit-14
  "名前": {
    word: "名前",
    reading: "なまえ",
    sino: "DANH TIỀN",
    meaning: "tên, họ tên",
    example: "用紙の指定された場所にカタカナで名前を書いてください。(Xin hãy viết họ tên bằng chữ Katakana vào vị trí quy định trên tờ giấy.)"
  },
  "また": {
    word: "また",
    reading: "また",
    sino: "",
    meaning: "lại, hẹn gặp lại; ngoài ra",
    example: "分からないことがあれば、またいつでも質問してください。(Nếu có chỗ nào chưa hiểu, bạn lại cứ thoải mái hỏi bất cứ lúc nào nhé.)"
  },
  // unit-15
  "置きます": {
    word: "置きます",
    reading: "おきます",
    sino: "TRÍ",
    meaning: "đặt, để (đồ vật)",
    example: "脱いだ靴を玄関の隅にきちんと置きます。(Tôi đặt đôi giày đã cởi ngay ngắn vào góc lối vào nhà.)"
  },
  "時刻表": {
    word: "時刻表",
    reading: "じこくひょう",
    sino: "THỜI KHẮC BIỂU",
    meaning: "lịch trình tàu xe, thời gian biểu",
    example: "駅の掲示板で次の電車の発車時刻表を確認しました。(Tôi kiểm tra thời gian biểu chuyến tàu tiếp theo trên bảng tin ở nhà ga.)"
  },
  "独身": {
    word: "独身",
    reading: "どくしん",
    sino: "ĐỘC THÂN",
    meaning: "độc thân (chưa kết hôn)",
    example: "彼はまだ独身で、アパートで気ままに一人暮らしをしています。(Anh ấy vẫn còn độc thân, sống một mình thoải mái trong căn hộ.)"
  },
  // unit-16
  "シャワー": {
    word: "シャワー",
    reading: "シャワー",
    sino: "",
    meaning: "vòi hoa sen, tắm vòi sen",
    example: "朝起きてすぐに温かいシャワーを浴びてすっきりしました。(Thức dậy vào buổi sáng tôi tắm vòi hoa sen ấm cho tỉnh táo người.)"
  },
  "[お]寺": {
    word: "お寺",
    reading: "おてら",
    sino: "TỰ",
    meaning: "chùa, ngôi chùa",
    example: "京都の有名で歴史のある古いお寺を観光して回りました。(Tôi đi tham quan ngôi chùa cổ kính nổi tiếng ở Kyoto.)"
  },
  // unit-17
  "大切「な」": {
    word: "大切 [な]",
    reading: "たいせつ",
    sino: "ĐẠI THIẾT",
    meaning: "quan trọng, quý giá",
    example: "健康は何よりも大切ですから、無理をしないでください。(Sức khỏe là quan trọng hơn bất cứ thứ gì, nên xin đừng làm việc quá sức.)"
  },
  "大丈夫「な」": {
    word: "大丈夫 [な]",
    reading: "だいじょうぶ",
    sino: "ĐẠI TRƯỢNG PHU",
    meaning: "không sao, ổn thỏa, an toàn",
    example: "「怪我はありませんか」「はい、大丈夫です、ご心配なく」。(\"Bạn có bị thương không?\" \"Dạ vâng, tôi không sao ổn cả, xin đừng lo lắng\".)"
  },
  "２、３～": {
    word: "２、３～",
    reading: "に、さん",
    sino: "NHỊ TAM",
    meaning: "vài ba ～ (ngày, lần...)",
    example: "風邪気味なので、家で二、三日ゆっくり休養を取ります。(Vì hơi bị cảm nên tôi sẽ nghỉ ngơi dưỡng sức ở nhà vài ba ngày.)"
  },
  // unit-18
  "見学します": {
    word: "見学します",
    reading: "けんがくします",
    sino: "KIẾN HỌC",
    meaning: "tham quan học hỏi, kiến tập",
    example: "社会科の授業で自動車の製造工場を見学しました。(Trong giờ học xã hội, chúng tôi đã đi tham quan học hỏi tại nhà máy sản xuất ô tô.)"
  },
  // unit-19
  "なります": {
    word: "なります",
    reading: "なります",
    sino: "",
    meaning: "trở thành, trở nên (thay đổi trạng thái)",
    example: "春になると気温が暖かくなり、桜の花が咲きます。(Khi mùa xuân đến, thời tiết trở nên ấm áp và hoa anh đào nở rộ.)"
  },
  "調子": {
    word: "調子",
    reading: "ちょうし",
    sino: "ĐIỀU TỬ",
    meaning: "tình trạng, trạng thái (sức khỏe, máy móc)",
    example: "最近体の調子がとても良くて、毎日元気に過ごしています。(Dạo gần đây tình trạng sức khỏe của tôi rất tốt, ngày nào cũng tràn đầy năng lượng.)"
  },
  "調子が悪い": {
    word: "調子が悪い",
    reading: "ちょうしがわるい",
    sino: "ĐIỀU TỬ ÁC",
    meaning: "tình trạng xấu, người mệt mỏi, máy móc trục trặc",
    example: "朝から胃の調子が悪くて食欲がありません。(Từ sáng sớm tình trạng bao tử đã xấu và tôi không thấy thèm ăn.)"
  },
  "だんだん": {
    word: "だんだん",
    reading: "だんだん",
    sino: "",
    meaning: "dần dần, từ từ",
    example: "秋が深まり、だんだん木々の葉が赤く色づいてきました。(Mùa thu đậm nét, lá cây dần dần chuyển sang màu đỏ rực.)"
  },
  // unit-20
  "要ります": {
    word: "要ります",
    reading: "いります",
    sino: "YẾU",
    meaning: "cần thiết, cần có",
    example: "海外旅行に行くときは有効なパスポートが絶対に要ります。(Khi đi du lịch nước ngoài thì hộ chiếu còn hạn là thứ nhất định cần có.)"
  },
  "うん": {
    word: "うん",
    reading: "うん",
    sino: "",
    meaning: "ừ, vâng (thân mật)",
    example: "「明日も学校へ行く？」「うん、行くよ」。(\"Mai cậu cũng đi học chứ?\" \"Ừ, tớ đi chứ\".)"
  },
  "どっち": {
    word: "どっち",
    reading: "どっち",
    sino: "",
    meaning: "cái nào, bên nào, phía nào",
    example: "「肉と魚と、どっちが好きですか」「魚のほうが好きです」。(\"Thịt và cá, bạn thích cái nào hơn?\" \"Tôi thích cá hơn\".)"
  },
  "この間": {
    word: "この間",
    reading: "このあいだ",
    sino: "GIAN",
    meaning: "hôm nọ, dạo gần đây",
    example: "この間デパートでばったり高校の同級生に会いました。(Hôm nọ tôi tình cờ gặp lại người bạn cùng lớp cấp ba ở trung tâm bách hóa.)"
  },
  // unit-21
  "同じ": {
    word: "同じ",
    reading: "おなじ",
    sino: "ĐỒNG",
    meaning: "giống nhau, tương đồng, cùng",
    example: "彼と私は同じ大学のクラスで勉強しています。(Anh ấy và tôi cùng học chung một lớp ở trường đại học.)"
  },
  "すごい": {
    word: "すごい",
    reading: "すごい",
    sino: "",
    meaning: "tuyệt vời, siêu phàm, ghê gớm",
    example: "独学で日本語能力試験の一級に合格するなんて本当にすごいです。(Tự học mà đỗ chứng chỉ N1 tiếng Nhật thì thực sự quá là tuyệt vời.)"
  },
  "大統領": {
    word: "大統領",
    reading: "だいとうりょう",
    sino: "ĐẠI THỐNG LÃNH",
    meaning: "tổng thống",
    example: "ニュースで新しく就任した大統領の演説を見ました。(Tôi đã xem bài diễn văn của vị tân tổng thống trên bản tin truyền hình.)"
  },
  "ユーモア": {
    word: "ユーモア",
    reading: "ユーモア",
    sino: "",
    meaning: "khiếu hài hước, tính khôi hài",
    example: "先生はいつもユーモアを交えて楽しく教えてくれます。(Thầy giáo lúc nào cũng giảng dạy vui vẻ với khiếu hài hước hóm hỉnh.)"
  },
  "ラッシュ": {
    word: "ラッシュ",
    reading: "ラッシュ",
    sino: "",
    meaning: "giờ cao điểm (giao thông đông đúc)",
    example: "朝の通勤ラッシュの満員電車に乗るのは本当に大変です。(Đi chuyến tàu điện chật ních người vào giờ cao điểm sáng sớm thực sự rất vất vả.)"
  },
  "しかたがありません": {
    word: "しかたがありません",
    reading: "しかたがありません",
    sino: "",
    meaning: "không còn cách nào khác, đành chịu thôi",
    example: "台風で電車が止まってしまったので、家に帰るしかたがありません。(Vì bão làm tàu điện dừng chạy nên không còn cách nào khác đành ở nhà.)"
  },
  "見ないと。。。": {
    word: "見ないと…",
    reading: "みないと",
    sino: "KIẾN",
    meaning: "phải xem mới được...",
    example: "話題の新作映画だから、早く映画館へ見に行かないと…。(Vì là bộ phim mới đang gây sốt, nên phải đi xem sớm mới được...)"
  },
  // unit-22
  "着ます": {
    word: "着ます",
    reading: "きます",
    sino: "TRỨ",
    meaning: "mặc (áo sơ mi, áo khoác, vest)",
    example: "面接を受けるために清潔なスーツを着ます。(Để đi phỏng vấn, tôi mặc một bộ đồ vest gọn gàng tinh tươm.)"
  },
  "帽子": {
    word: "帽子",
    reading: "ぼうし",
    sino: "MẠO TỬ",
    meaning: "mũ, nón",
    example: "日差しが強いので、帽子をかぶって出かけます。(Trời nắng gắt nên tôi đội mũ trước khi ra ngoài.)"
  },
  // unit-23
  "歩きます": {
    word: "歩きます",
    reading: "あるきます",
    sino: "BỘ",
    meaning: "đi bộ, tản bộ",
    example: "健康のために毎日駅から家まで歩きます。(Để giữ gìn sức khỏe, mỗi ngày tôi đều đi bộ từ nhà ga về nhà.)"
  },
  "ー目": {
    word: "～目",
    reading: "～め",
    sino: "MỤC",
    meaning: "thứ ～ (hậu tố chỉ số thứ tự)",
    example: "二つ目の角を右に曲がると銀行があります。(Rẽ phải ở góc cua thứ hai thì sẽ có một ngân hàng.)"
  },
  // unit-24
  "おじいさん / おじいちゃん": {
    word: "おじいさん / おじいちゃん",
    reading: "おじいさん / おじいちゃん",
    sino: "TỔ PHỤ",
    meaning: "ông, ông nội, ông ngoại",
    example: "おじいさんの笑顔を見ると家族みんなが元気になります。(Nhìn nụ cười hiền hậu của ông, cả gia đình ai nấy đều thấy vui vẻ.)"
  },
  "準備": {
    word: "準備",
    reading: "じゅんび",
    sino: "CHUẨN BỊ",
    meaning: "chuẩn bị",
    example: "明日からの旅行のために今夜荷物を準備します。(Tôi chuẩn bị hành lý tối nay để sẵn sàng cho chuyến du lịch từ ngày mai.)"
  }
};

const minnaN5Dir = path.join(__dirname, '../data/minna-no-nihongo-n5');

function run() {
  const units = fs.readdirSync(minnaN5Dir);
  let total = 0;
  for (const unit of units) {
    const unitDir = path.join(minnaN5Dir, unit);
    const vocabPath = path.join(unitDir, 'vocabulary.json');
    if (!fs.existsSync(vocabPath)) continue;

    const list = JSON.parse(fs.readFileSync(vocabPath, 'utf8'));
    let updated = 0;

    for (let item of list) {
      for (const [key, val] of Object.entries(n5Fixes)) {
        if (item.word === key || item.word.replace(/\s+/g, '') === key.replace(/\s+/g, '') || item.reading === key) {
          item.word = val.word;
          item.reading = val.reading;
          item.sinoVietnamese = val.sino;
          item.meaning = val.meaning;
          item.example = val.example;
          updated++;
          break;
        }
      }
    }

    if (updated > 0) {
      fs.writeFileSync(vocabPath, JSON.stringify(list, null, 2), 'utf8');
      console.log(`- ${unit}: Cập nhật ${updated} từ.`);
      total += updated;
    }
  }
  console.log(`\n=> TỔNG CỘNG ĐÃ CẬP NHẬT: ${total} từ trong Minna No Nihongo N5.`);
}

run();

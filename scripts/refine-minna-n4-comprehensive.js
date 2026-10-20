/**
 * refine-minna-n4-comprehensive.js
 * Chuẩn hóa toàn bộ 80 từ vựng của Minna no Nihongo N4 bị lệch nghĩa, câu template lặp lại, lỗi HTML markup.
 */

const fs = require('fs');
const path = require('path');

const n4Fixes = {
  // unit-26
  "そんな…": {
    word: "そんなに",
    reading: "そんなに",
    sino: "",
    meaning: "đến mức đó, như thế đó",
    example: "そんなに心配しなくても、彼はきっと合格しますよ。(Không cần lo lắng đến mức đó đâu, anh ấy chắc chắn sẽ đỗ thôi.)"
  },
  // unit-27
  "開きます素晴らしい": {
    word: "開きます",
    reading: "ひらきます",
    sino: "KHAI",
    meaning: "mở (lớp học), tổ chức, khai mạc",
    example: "来月から駅前で新しい日本語教室が開かれます。(Từ tháng sau một lớp học tiếng Nhật mới sẽ được mở ra ở trước nhà ga.)"
  },
  // unit-28
  "偉い": {
    word: "偉い",
    reading: "えらい",
    sino: "VĨ",
    meaning: "vĩ đại, xuất sắc, tài giỏi; đáng khâm phục",
    example: "どんな困難にも負けずに夢を叶えた彼は本当に偉いです。(Vượt qua mọi khó khăn để thực hiện ước mơ, anh ấy thực sự rất đáng khâm phục.)"
  },
  // unit-30
  "お子さん": {
    word: "お子さん",
    reading: "おこさん",
    sino: "TỬ",
    meaning: "con của quý vị, các cháu (tôn kính)",
    example: "お子さんはお元気でいらっしゃいますか。(Các cháu nhà anh chị dạo này vẫn khỏe mạnh cả chứ ạ?)"
  },
  "予定": {
    word: "予定",
    reading: "よてい",
    sino: "DỰ ĐỊNH",
    meaning: "kế hoạch, dự định, lịch trình",
    example: "来週の出張の予定をカレンダーに登録しておきました。(Tôi đã lưu lịch trình dự định của chuyến công tác tuần tới vào lịch biểu.)"
  },
  // unit-31
  "～の　方": {
    word: "～の方",
    reading: "～のほう",
    sino: "PHƯƠNG",
    meaning: "hướng về phía ～, về phía ～",
    example: "駅の改札を出て、右の方へ進んでください。(Sau khi ra khỏi cửa soát vé nhà ga, xin hãy đi về phía bên phải.)"
  },
  // unit-32
  "隧道": {
    word: "トンネル",
    reading: "トンネル",
    sino: "",
    meaning: "đường hầm",
    example: "長いトンネルを抜けると、目の前に美しい雪景色が広がっていました。(Khi đi qua một đường hầm dài, khung cảnh tuyết trắng tuyệt đẹp đã hiện ra trước mắt.)"
  },
  "当たります（宝くじが～）": {
    word: "当たります [宝くじが～]",
    reading: "あたります",
    sino: "ĐƯƠNG",
    meaning: "trúng (xổ số, vé số)",
    example: "もし宝くじが当たったら、世界一周の旅に出たいです。(Nếu mà trúng xổ số, tôi muốn đi du lịch vòng quanh thế giới.)"
  },
  "恋人": {
    word: "恋人",
    reading: "こいびと",
    sino: "LUYẾN NHÂN",
    meaning: "người yêu, bạn trai/bạn gái",
    example: "休日は恋人と一緒に映画を見に行きます。(Vào ngày nghỉ tôi cùng người yêu đi xem phim.)"
  },
  // unit-33
  "守ります": {
    word: "守ります",
    reading: "まもります",
    sino: "THỦ",
    meaning: "bảo vệ, tuân thủ (lời hứa, luật lệ)",
    example: "社会で信頼されるためには、約束の時間を守ることが大切です。(Để được tin tưởng trong xã hội, việc tuân thủ đúng giờ giấc đã hẹn là điều rất quan trọng.)"
  },
  "どういうー": {
    word: "どういう～",
    reading: "どういう",
    sino: "",
    meaning: "loại... nào, có nghĩa là gì",
    example: "「立入禁止」とはどういう意味ですか。(Biển báo này có nghĩa là gì vậy ạ?)"
  },
  "(お）いわい": {
    word: "お祝い",
    reading: "おいわい",
    sino: "CHÚC",
    meaning: "lời chúc mừng; quà chúc mừng, lễ kỷ niệm",
    example: "友達の結婚のお祝いにプレゼントを贈りました。(Tôi đã gửi tặng một món quà để chúc mừng đám cưới của bạn mình.)"
  },
  // unit-34
  "今夜先に/td&gt;": {
    word: "先に",
    reading: "さきに",
    sino: "TIÊN",
    meaning: "trước, đi trước (hành động)",
    example: "用事がありますので、お先に失礼します。(Vì có chút việc bận nên tôi xin phép về trước ạ.)"
  },
  "ー分": {
    word: "～分",
    reading: "～ぶん",
    sino: "PHÂN",
    meaning: "phần, khẩu phần (đơn vị lượng)",
    example: "スーパーで三人分の夕食の材料を買いました。(Tôi đã mua nguyên liệu làm bữa tối cho ba phần người ăn ở siêu thị.)"
  },
  // unit-36
  "携帯ー": {
    word: "携帯電話",
    reading: "けいたいでんわ",
    sino: "HUỀ ĐỚI ĐIỆN THOẠI",
    meaning: "điện thoại di động",
    example: "外出中は携帯電話のバッテリーを切らさないように気をつけています。(Khi ra ngoài, tôi chú ý không để điện thoại di động bị hết pin.)"
  },
  "かなり": {
    word: "かなり",
    reading: "かなり",
    sino: "",
    meaning: "khá là, tương đối",
    example: "今朝の通勤ラッシュはいつもよりかなり混雑していました。(Giờ cao điểm sáng nay đông đúc khá là nhiều so với mọi khi.)"
  },
  "上手に": {
    word: "上手に",
    reading: "じょうずに",
    sino: "THƯỢNG THỦ",
    meaning: "giỏi, khéo léo, điêu luyện",
    example: "発表会でショパンのピアノ曲をとても上手に演奏できました。(Trong buổi biểu diễn, tôi đã chơi bản nhạc piano của Chopin rất giỏi.)"
  },
  "乗り物": {
    word: "乗り物",
    reading: "のりもの",
    sino: "THỪA VẬT",
    meaning: "phương tiện giao thông, phương tiện đi lại",
    example: "電車やバスなどの便利な乗り物を利用します。(Tôi sử dụng các phương tiện giao thông tiện lợi như tàu điện và xe buýt.)"
  },
  // unit-37
  "―によって": {
    word: "～によって",
    reading: "～によって",
    sino: "",
    meaning: "bởi... (chỉ tác giả trong câu bị động)",
    example: "この素晴らしい交響曲はベートーヴェンによって作曲されました。(Bản giao hưởng tuyệt diệu này được sáng tác bởi nhạc sĩ Beethoven.)"
  },
  // unit-39
  "死にます": {
    word: "死にます",
    reading: "しにます",
    sino: "TỬ",
    meaning: "chết, qua đời",
    example: "長年飼っていた愛犬が寿命で死にました。(Chú chó cưng nuôi nhiều năm đã qua đời vì tuổi già.)"
  },
  "今では": {
    word: "今では",
    reading: "いまでは",
    sino: "KIM",
    meaning: "hiện nay, ngày nay",
    example: "昔は不便でしたが、今ではインターネットで何でも買えます。(Ngày xưa thì bất tiện, nhưng hiện nay có thể mua mọi thứ qua mạng Internet.)"
  },
  // unit-40
  "出発します": {
    word: "出発します",
    reading: "しゅっぱつします",
    sino: "XUẤT PHÁT",
    meaning: "khởi hành, xuất phát",
    example: "新幹線は定刻通りに東京駅を出発します。(Tàu Shinkansen xuất phát từ ga Tokyo đúng giờ theo lịch trình.)"
  },
  "コンテスト": {
    word: "コンテスト",
    reading: "コンテスト",
    sino: "",
    meaning: "cuộc thi, hội thi",
    example: "来月開催されるスピーチコンテストに参加します。(Tôi sẽ tham gia cuộc thi hùng biện được tổ chức vào tháng sau.)"
  },
  "―こ": {
    word: "～個",
    reading: "～こ",
    sino: "CÁ",
    meaning: "cái, chiếc, quả (đơn vị đếm vật nhỏ)",
    example: "リンゴを三箱、合わせて三十個買いました。(Tôi đã mua 3 hộp táo, tổng cộng là 30 quả.)"
  },
  "～キロ": {
    word: "～キロ",
    reading: "～キロ",
    sino: "",
    meaning: "ki-lô-gam (kg); ki-lô-mét (km)",
    example: "ジョギングを続けて3キロ痩せました。(Chạy bộ đều đặn giúp tôi giảm được 3 ki-lô-gam.)"
  },
  "～ミリ": {
    word: "～ミリ",
    reading: "～ミリ",
    sino: "",
    meaning: "mi-li-mét (mm)",
    example: "精密機械の製造では1ミリの狂いも許されません。(Trong chế tạo máy móc chính xác, sai lệch dù chỉ 1 mi-li-mét cũng không được phép.)"
  },
  // unit-41
  "興味": {
    word: "興味",
    reading: "きょうみ",
    sino: "HƯNG VỊ",
    meaning: "hứng thú, sự quan tâm",
    example: "日本の歴史や文化に深い興味を持っています。(Tôi có niềm hứng thú sâu sắc với lịch sử và văn hóa Nhật Bản.)"
  },
  "祖父": {
    word: "祖父",
    reading: "そふ",
    sino: "TỔ PHỤ",
    meaning: "ông, ông nội, ông ngoại (của mình)",
    example: "私の祖父は毎朝元気に散歩をしています。(Ông tôi mỗi sáng đều khỏe mạnh đi dạo bộ.)"
  },
  "祖母": {
    word: "祖母",
    reading: "そぼ",
    sino: "TỔ MẪU",
    meaning: "bà, bà nội, bà ngoại (của mình)",
    example: "私の祖母は美味しい料理を作るのが得意です。(Bà tôi nấu những món ăn ngon rất khéo.)"
  },
  "先日": {
    word: "先日",
    reading: "せんじつ",
    sino: "TIÊN NHẬT",
    meaning: "hôm trước, mấy hôm trước",
    example: "先日お会いした時は大変お世話になりました。(Hôm trước khi được gặp ngài, tôi đã được giúp đỡ rất nhiều ạ.)"
  },
  "煙": {
    word: "煙",
    reading: "けむり",
    sino: "YÊN",
    meaning: "khói",
    example: "工場の煙突から白い煙が上がっています。(Khói trắng đang bốc lên từ ống khói nhà máy.)"
  },
  // unit-42
  "セット": {
    word: "セット",
    reading: "セット",
    sino: "",
    meaning: "bộ (combo, set đồ ăn)",
    example: "ハンバーガーとポテトのお得なセットを注文しました。(Tôi đã gọi combo set bánh kẹp và khoai tây chiên ưu đãi.)"
  },
  "食品": {
    word: "食品",
    reading: "しょくひん",
    sino: "THỰC PHẨM",
    meaning: "thực phẩm, đồ ăn",
    example: "デパ地下の食品売り場で新鮮な食材を買いました。(Tôi đã mua thực phẩm tươi sống tại quầy bán đồ ăn dưới tầng hầm bách hóa.)"
  },
  "どこででも": {
    word: "どこででも",
    reading: "どこででも",
    sino: "",
    meaning: "ở bất cứ đâu, bất kỳ nơi nào",
    example: "パソコンとネットがあれば、どこででも仕事ができます。(Chỉ cần có máy tính và mạng là có thể làm việc ở bất cứ đâu.)"
  },
  // unit-43
  "丈夫「な」": {
    word: "丈夫 [な]",
    reading: "じょうぶ",
    sino: "TRƯỢNG PHU",
    meaning: "chắc chắn, bền; khỏe mạnh",
    example: "この革の鞄はとても丈夫で長く使えます。(Chiếc cặp da này rất bền chắc chắn và dùng được lâu dài.)"
  },
  "うまい": {
    word: "うまい",
    reading: "うまい",
    sino: "",
    meaning: "ngon; giỏi, khéo léo",
    example: "運動のあとに冷たい水を飲むと本当にうまいです。(Uống một cốc nước lạnh sau khi vận động thực sự rất ngon đã khát.)"
  },
  "わあ": {
    word: "わあ",
    reading: "わあ",
    sino: "",
    meaning: "oa!, chà! (thán từ ngạc nhiên, thích thú)",
    example: "夜空に大きな花火が上がって、みんな「わあ、きれい」と歓声をあげました。(Pháo hoa lớn bừng sáng trên trời đêm, mọi người cùng reo lên: \"Oa, đẹp quá!\".)"
  },
  // unit-44
  "量": {
    word: "量",
    reading: "りょう",
    sino: "LƯỢNG",
    meaning: "lượng, số lượng, khối lượng",
    example: "この食堂の定食はご飯の量が多くて満足できます。(Suất ăn của quán này lượng cơm rất nhiều khiến tôi thấy thỏa mãn.)"
  },
  "ツイン": {
    word: "ツイン",
    reading: "ツイン",
    sino: "",
    meaning: "phòng đôi (khách sạn hai giường đơn)",
    example: "出張先のホテルでツインの部屋を予約しました。(Tôi đã đặt một phòng đôi hai giường đơn ở khách sạn nơi công tác.)"
  },
  "理由": {
    word: "理由",
    reading: "りゆう",
    sino: "LÝ DO",
    meaning: "lý do, nguyên cớ",
    example: "遅刻した理由を先生にきちんと説明しました。(Tôi đã giải thích rõ ràng lý do mình đi muộn cho thầy giáo.)"
  },
  "どう なさいますか": {
    word: "どうなさいますか",
    reading: "どうなさいますか",
    sino: "",
    meaning: "quý khách muốn làm thế nào ạ? (kính ngữ)",
    example: "美容院で「本日は髪をどうなさいますか」と聞かれました。(Ở tiệm làm tóc, thợ hỏi: \"Hôm nay quý khách muốn làm tóc như thế nào ạ?\".)"
  },
  "どういうふうに なさいますか": {
    word: "どういうふうになさいますか",
    reading: "どういうふうになさいますか",
    sino: "",
    meaning: "quý khách muốn kiểu dáng như thế nào ạ?",
    example: "「髪の長さはどういうふうになさいますか」「少し短くしてください」。(\"Độ dài tóc quý khách muốn cắt như thế nào ạ?\" \"Xin hãy cắt ngắn bớt một chút ạ\".)"
  },
  "表現": {
    word: "表現",
    reading: "ひょうげん",
    sino: "BIỂU HIỆN",
    meaning: "cách nói, diễn đạt, biểu hiện",
    example: "日本語には敬語など様々な表現があります。(Trong tiếng Nhật có rất nhiều cách nói biểu đạt phong phú như kính ngữ.)"
  },
  // unit-45
  "点": {
    word: "点",
    reading: "てん",
    sino: "ĐIỂM",
    meaning: "điểm số; điểm (vấn đề)",
    example: "一生懸命勉強して、テストで満点の百点を取りました。(Chăm chỉ học tập, tôi đã đạt được điểm số tối đa 100 điểm trong bài thi.)"
  },
  "それでも": {
    word: "それでも",
    reading: "それでも",
    sino: "",
    meaning: "dù vậy, tuy nhiên",
    example: "外は大雨でしたが、それでも彼らは出かけていきました。(Bên ngoài trời mưa to, dù vậy họ vẫn quyết định ra ngoài.)"
  },
  // unit-46
  "～の所": {
    word: "～のところ",
    reading: "～のところ",
    sino: "SỞ",
    meaning: "ở chỗ ～, nơi ～",
    example: "週末に先生のところへ相談に行きました。(Vào cuối tuần tôi đã đến chỗ thầy giáo để trao đổi xin ý kiến.)"
  },
  "今いいでしょうか": {
    word: "今いいでしょうか",
    reading: "いまいいでしょうか",
    sino: "KIM",
    meaning: "bây giờ có tiện không ạ?",
    example: "課長、少しご相談があるのですが、今いいでしょうか。(Thưa trưởng phòng, em có chút việc muốn bàn, bây giờ có tiện không ạ?)"
  },
  "どちら様でしょうか": {
    word: "どちら様でしょうか",
    reading: "どちらさまでしょうか",
    sino: "DẠNG",
    meaning: "xin hỏi ai đấy ạ? (hỏi tên lịch sự qua điện thoại)",
    example: "電話に出て「恐れ入りますが、どちら様でしょうか」と尋ねました。(Nhấc máy điện thoại, tôi lịch sự hỏi: \"Xin lỗi, xin hỏi ai đấy ạ?\".)"
  },
  "知識": {
    word: "知識",
    reading: "ちしき",
    sino: "TRI THỨC",
    meaning: "kiến thức, tri thức",
    example: "本をたくさん読んで幅広い知識を身につけたいです。(Tôi muốn đọc thật nhiều sách để trang bị kiến thức sâu rộng.)"
  },
  "手に入ります「情報が～）": {
    word: "手に入ります [情報が～]",
    reading: "てにはいります",
    sino: "THỦ NHẬP",
    meaning: "có được, thu thập được (thông tin)",
    example: "インターネットのおかげで最新の正確な情報が手に入ります。(Nhờ có mạng Internet, chúng ta có thể thu thập được thông tin mới nhất và chuẩn xác.)"
  },
  // unit-47
  "ひどい": {
    word: "ひどい",
    reading: "ひどい",
    sino: "",
    meaning: "tồi tệ, khủng khiếp, nghiêm trọng",
    example: "昨夜の台風のせいで各地にひどい被害が出ました。(Do cơn bão đêm qua nên nhiều nơi đã phải gánh chịu thiệt hại nghiêm trọng.)"
  },
  "文学": {
    word: "文学",
    reading: "ぶんがく",
    sino: "VĂN HỌC",
    meaning: "văn học",
    example: "大学で日本の古典文学を熱心に研究しています。(Tôi đang say mê nghiên cứu văn học cổ điển Nhật Bản tại trường đại học.)"
  },
  "パトカー": {
    word: "パトカー",
    reading: "パトカー",
    sino: "",
    meaning: "xe cảnh sát tuần tra",
    example: "サイレンを鳴らしながらパトカーが猛スピードで走っていきました。(Hụ còi inh ỏi, chiếc xe cảnh sát tuần tra phóng đi với tốc độ cao.)"
  },
  "賛成": {
    word: "賛成",
    reading: "さんせい",
    sino: "TÁN THÀNH",
    meaning: "tán thành, đồng ý",
    example: "会議の参加者全員が彼の新しい提案に賛成しました。(Toàn bộ người tham gia cuộc họp đều tán thành với đề xuất mới của anh ấy.)"
  },
  "平均十冥": {
    word: "平均寿命",
    reading: "へいきんじゅみょう",
    sino: "BÌNH QUÂN THỌ MỆNH",
    meaning: "tuổi thọ trung bình",
    example: "医療の進歩により、人々の平均寿命は年々伸びています。(Nhờ sự tiến bộ của y tế, tuổi thọ trung bình của con người ngày càng tăng lên.)"
  },
  // unit-48
  "営業": {
    word: "営業",
    reading: "えいぎょう",
    sino: "DOANH NGHIỆP",
    meaning: "kinh doanh, mở cửa phục vụ",
    example: "このスーパーは夜遅くまで営業しているので助かります。(Siêu thị này mở cửa phục vụ kinh doanh đến tận đêm khuya nên rất tiện.)"
  },
  "サーカス": {
    word: "サーカス",
    reading: "サーカス",
    sino: "",
    meaning: "rạp xiếc, xiếc",
    example: "休日に子どもたちを連れて賑やかなサーカスを見に行きました。(Vào ngày nghỉ tôi dẫn các con đi xem biểu diễn rạp xiếc sôi động.)"
  },
  "芸": {
    word: "芸",
    reading: "げい",
    sino: "NGHỆ",
    meaning: "tiết mục, tài nghệ, diễn xuất",
    example: "水族館のイルカが見事な芸を披露して観客を沸かせました。(Chú cá heo ở thủy cung đã biểu diễn tiết mục tài nghệ xuất sắc khiến khán giả thích thú.)"
  },
  // unit-49
  "過ごします": {
    word: "過ごします",
    reading: "すごします",
    sino: "QUÁ",
    meaning: "trải qua, sinh hoạt (thời gian)",
    example: "週末は家で家族と一緒にのんびりと過ごします。(Dịp cuối tuần tôi trải qua thời gian thư thả ấm cúng ở nhà cùng gia đình.)"
  },
  "おっしゃいます": {
    word: "おっしゃいます",
    reading: "おっしゃいます",
    sino: "",
    meaning: "nói, bảo (tôn kính ngữ của 言う)",
    example: "先生がそのようにおっしゃいました。(Thầy giáo đã nói dặn dò như vậy ạ.)"
  },
  "なさいます": {
    word: "なさいます",
    reading: "なさいます",
    sino: "",
    meaning: "làm, thực hiện (tôn kính ngữ của する)",
    example: "週末はどのようなスポーツをなさいますか。(Vào dịp cuối tuần ngài thường chơi làm môn thể thao nào ạ?)"
  },
  "会場": {
    word: "会場",
    reading: "かいじょう",
    sino: "HỘI TRƯỜNG",
    meaning: "hội trường, địa điểm tổ chức",
    example: "コンサートの会場には開演前から多くの人が集まっていました。(Tại hội trường buổi hòa nhạc, rất nhiều người đã tập trung từ trước giờ mở màn.)"
  },
  "～様": {
    word: "～様",
    reading: "～さま",
    sino: "DẠNG",
    meaning: "ngài, ông, bà (hậu tố tôn kính sau tên)",
    example: "山田様、こちらのお席へどうぞ。(Kính mời ngài Yamada dùng vị trí ngồi này ạ.)"
  },
  "たまに": {
    word: "たまに",
    reading: "たまに",
    sino: "",
    meaning: "thỉnh thoảng, đôi khi",
    example: "普段は自炊ですが、たまに友達と外食します。(Bình thường tôi tự nấu ăn nhưng thỉnh thoảng cũng đi ăn ngoài với bạn bè.)"
  },
  "ちっとも": {
    word: "ちっとも",
    reading: "ちっとも",
    sino: "",
    meaning: "một chút cũng không... (đi với phủ định)",
    example: "この本は難しくて、何度読んでもちっとも分かりません。(Cuốn sách này khó quá, đọc bao nhiêu lần cũng một chút không hiểu.)"
  },
  "～年～（1年3組）": {
    word: "～年～組",
    reading: "～ねん～くみ",
    sino: "NIÊN TỔ",
    meaning: "năm thứ... lớp...",
    example: "弟は小学校の三年二組で勉強しています。(Em trai tôi đang học ở năm thứ ba lớp hai trường tiểu học.)"
  },
  "出します（熱を～）": {
    word: "出します [熱を～]",
    reading: "だします",
    sino: "XUẤT NHIỆT",
    meaning: "bị sốt (phát sốt)",
    example: "風邪をひいてしまい、高い熱を出しました。(Tôi bị nhiễm cảm lạnh nên đã bị phát sốt rất cao.)"
  },
  "多くの～": {
    word: "多くの～",
    reading: "おおくの～",
    sino: "ĐA",
    meaning: "nhiều ～, phần lớn ～",
    example: "この神社には毎年多くの観光客が参拝に訪れます。(Ngôi đền này mỗi năm có rất nhiều khách du lịch đến viếng thăm.)"
  },
  "世界的に": {
    word: "世界的に",
    reading: "せかいてきに",
    sino: "THẾ GIỚI ĐÍCH",
    meaning: "mang tính toàn cầu, trên toàn thế giới",
    example: "アニメや和食は世界的に高い人気を誇っています。(Phim hoạt hình anime và ẩm thực Nhật Bản nổi tiếng được yêu thích trên toàn thế giới.)"
  },
  "作家": {
    word: "作家",
    reading: "さっか",
    sino: "TÁC GIA",
    meaning: "nhà văn, tác giả",
    example: "彼は数々の名作を生み出した世界的な有名作家です。(Ông ấy là một nhà văn tác giả nổi tiếng thế giới đã sáng tác nên nhiều kiệt tác.)"
  },
  "~でございます。": {
    word: "～でございます",
    reading: "～でございます",
    sino: "",
    meaning: "là, thì (kính ngữ trang trọng của です)",
    example: "お電話ありがとうございます。さくら商事でございます。(Cảm ơn quý khách đã gọi điện. Đây là công ty Sakura ạ.)"
  },
  "障害": {
    word: "障害",
    reading: "しょうがい",
    sino: "CHƯỚNG HẠI",
    meaning: "khuyết tật, trở ngại, khiếm khuyết",
    example: "駅にスロープが設置され、車椅子の障害のある方も利用しやすくなりました。(Đường dốc được lắp đặt tại nhà ga giúp người khuyết tật dùng xe lăn đi lại dễ dàng hơn.)"
  },
  // unit-50
  "参ります": {
    word: "参ります",
    reading: "まいります",
    sino: "THAM",
    meaning: "đi đến (khiêm nhường ngữ của 行く, 来る)",
    example: "ただいまから資料をお届けに参ります。(Ngay bây giờ tôi xin phép mang tài liệu đi đến chỗ ngài ạ.)"
  },
  "いたします": {
    word: "いたします",
    reading: "いたします",
    sino: "",
    meaning: "làm, thực hiện (khiêm nhường ngữ của する)",
    example: "お客様のお荷物は私がお部屋までお運びいたします。(Hành lý của quý khách xin phép để tôi làm nhiệm vụ mang lên tận phòng giúp ạ.)"
  },
  "お目にかかります": {
    word: "お目にかかります",
    reading: "おめにかかります",
    sino: "MỤC",
    meaning: "gặp mặt (khiêm nhường ngữ của 会う)",
    example: "本日先生にお目にかかることができ、大変光栄に存じます。(Hôm nay được gặp mặt thầy, em cảm thấy vô cùng vinh dự ạ.)"
  },
  "半年": {
    word: "半年",
    reading: "はんとし",
    sino: "BÁN NIÊN",
    meaning: "nửa năm, sáu tháng",
    example: "日本に留学してからあっという間に半年が過ぎました。(Kể từ khi sang Nhật du học, thoắt cái nửa năm đã trôi qua rồi.)"
  },
  "ただ今": {
    word: "ただ今",
    reading: "ただいま",
    sino: "KIM",
    meaning: "bây giờ, ngay bây giờ; tôi đã về rồi đây",
    example: "ただ今ご紹介にあずかりました田中と申します。(Tôi là Tanaka, người vừa được giới thiệu ngay bây giờ ạ.)"
  },
  "きりん": {
    word: "きりん",
    reading: "きりん",
    sino: "",
    meaning: "hươu cao cổ",
    example: "動物園できりんが長い首を伸ばして木の葉を食べていました。(Ở vườn bách thú, chú hươu cao cổ vươn chiếc cổ dài ăn lá cây.)"
  },
  "ころ": {
    word: "ころ",
    reading: "ころ",
    sino: "",
    meaning: "khoảng chừng, hồi, thời gian",
    example: "子どものころ、よく友達とこの野原を走り回っていました。(Hồi còn là trẻ con, tôi thường cùng bạn bè chạy nhảy khắp cánh đồng này.)"
  },
  "ミュヘン": {
    word: "ミュンヘン",
    reading: "ミュンヘン",
    sino: "",
    meaning: "thành phố München (Munich, Đức)",
    example: "去年の冬休みにドイツのミュンヘンへ旅行に行きました。(Kỳ nghỉ đông năm ngoái tôi đã đi du lịch tới thành phố München ở nước Đức.)"
  }
};

const minnaN4Dir = path.join(__dirname, '../data/minna-no-nihongo-n4');

function run() {
  const units = fs.readdirSync(minnaN4Dir);
  let total = 0;
  for (const unit of units) {
    const unitDir = path.join(minnaN4Dir, unit);
    const vocabPath = path.join(unitDir, 'vocabulary.json');
    if (!fs.existsSync(vocabPath)) continue;

    const list = JSON.parse(fs.readFileSync(vocabPath, 'utf8'));
    let updated = 0;

    for (let item of list) {
      // Tìm theo word hoặc reading
      for (const [key, val] of Object.entries(n4Fixes)) {
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
  console.log(`\n=> TỔNG CỘNG ĐÃ CẬP NHẬT: ${total} từ trong Minna No Nihongo N4.`);
}

run();

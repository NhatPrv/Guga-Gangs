/**
 * refine-n5-core-bank.js
 * Chuẩn hóa 83 từ vựng của JLPT N5 Core Bank bị lệch nghĩa, câu dịch ngô nghê hoặc sai nghĩa.
 */

const fs = require('fs');
const path = require('path');

const n5CoreUpdates = {
  // theme-01-basics
  "上げる": {
    sino: "THƯỢNG",
    reading: "あげる",
    meaning: "nâng lên, giơ lên; tặng, cho",
    example: "質問がある人は手を高く上げてください。(Người nào có câu hỏi xin hãy giơ tay lên cao.)"
  },
  "厚い": {
    sino: "HẬU",
    reading: "あつい",
    meaning: "dày (sách, áo); nồng hậu, sâu đậm",
    example: "この本はとても厚いので、読むのに時間がかかります。(Quyển sách này rất dày nên mất nhiều thời gian để đọc.)"
  },
  "いかが": {
    sino: "",
    reading: "いかが",
    meaning: "như thế nào, ra sao (cách nói lịch sự)",
    example: "食後に温かいお茶はいかがですか。(Sau bữa ăn, bạn có muốn dùng thêm một tách trà nóng như thế nào không?)"
  },
  "いただきます": {
    sino: "",
    reading: "いただきます",
    meaning: "xin phép ăn, xin phép uống (lời nói lịch sự trước bữa ăn); nhận (khiêm nhường ngữ)",
    example: "ご飯を食べる前に、手を合わせて「いただきます」と言います。(Trước khi ăn cơm, chúng ta chắp tay và nói \"xin phép ăn\".)"
  },
  "入れる": {
    sino: "NHẬP",
    reading: "いれる",
    meaning: "cho vào, bỏ vào; pha (trà, cà phê)",
    example: "コーヒーに砂糖とミルクを入れます。(Tôi cho đường và sữa vào cà phê.)"
  },
  "薄い": {
    sino: "BẠC",
    reading: "うすい",
    meaning: "mỏng (giấy, áo); nhạt (vị, màu sắc); loãng",
    example: "この紙はとても薄いので気をつけてめくってください。(Tờ giấy này rất mỏng nên xin hãy lật cẩn thận nhé.)"
  },
  "大勢": {
    sino: "ĐẠI THẾ",
    reading: "おおぜい",
    meaning: "đông người, nhiều người",
    example: "駅前の広場に大勢の人が集まっています。(Ở quảng trường trước nhà ga có rất đông người đang tụ tập.)"
  },
  "起きる": {
    sino: "KHỞI",
    reading: "おきる",
    meaning: "thức dậy; xảy ra (sự cố, tai nạn)",
    example: "私は毎朝六時に起きて散歩をします。(Mỗi sáng tôi thức dậy lúc sáu giờ rồi đi dạo.)"
  },
  "お祖父さん": {
    sino: "TỔ PHỤ",
    reading: "おじいさん",
    meaning: "ông (nội/ngoại); cụ già",
    example: "私のお祖父さんは毎朝新聞を読みます。(Ông tôi đọc báo vào mỗi buổi sáng.)"
  },
  "押す": {
    sino: "ÁP",
    reading: "おす",
    meaning: "ấn, bấm (nút); đẩy",
    example: "エレベーターのボタンを押してください。(Xin hãy bấm nút thang máy.)"
  },
  "お願いします": {
    sino: "NGUYỆN",
    reading: "おねがいします",
    meaning: "xin vui lòng, làm ơn (lời nhờ vả lịch sự)",
    example: "すみません、田中さんをお願いします。(Xin lỗi, làm ơn cho tôi gặp anh Tanaka.)"
  },

  // theme-02-verbs
  "方": {
    sino: "PHƯƠNG",
    reading: "かた",
    meaning: "vị, ngài (kính ngữ của người); cách làm, phương hướng",
    example: "あちらにおられる方は私の日本語の先生です。(Vị đang đứng đằng kia là giáo viên dạy tiếng Nhật của tôi.)"
  },
  "家庭": {
    sino: "GIA ĐÌNH",
    reading: "かてい",
    meaning: "gia đình, tổ ấm",
    example: "彼らはいつも明るく温かい家庭を築いています。(Họ luôn xây dựng một gia đình vui vẻ và ấm áp.)"
  },
  "きれい": {
    sino: "",
    reading: "きれい",
    meaning: "đẹp; sạch sẽ",
    example: "公園にきれいな花がたくさん咲いています。(Trong công viên có rất nhiều bông hoa đẹp đang nở.)"
  },
  "キロ": {
    sino: "",
    reading: "キロ",
    meaning: "ki-lô-mét (km); ki-lô-gam (kg)",
    example: "駅から私の家まで約二キロあります。(Từ nhà ga đến nhà tôi có khoảng 2 ki-lô-mét.)"
  },
  "ください": {
    sino: "",
    reading: "ください",
    meaning: "xin vui lòng, hãy cho tôi (yêu cầu lịch sự)",
    example: "お水を一杯ください。(Xin vui lòng cho tôi một cốc nước.)"
  },
  "グラム": {
    sino: "",
    reading: "グラム",
    meaning: "gam, gram (đơn vị trọng lượng)",
    example: "スーパーで豚肉を三百グラム買いました。(Tôi đã mua 300 gam thịt lợn ở siêu thị.)"
  },
  "結構": {
    sino: "KẾT CẤU",
    reading: "けっこう",
    meaning: "đủ rồi, ổn thỏa (từ chối lịch sự); khá là, tương đối",
    example: "「お茶をもう一杯いかがですか」「いいえ、もう結構です」。(\"Bạn dùng thêm tách trà nữa nhé?\" \"Dạ thôi, tôi đủ rồi.\")"
  },
  "元気": {
    sino: "NGUYÊN KHÍ",
    reading: "げんき",
    meaning: "khỏe mạnh; tràn đầy năng lượng, hoạt bát",
    example: "「お元気ですか」「はい、とても元気です」。(\"Bạn có khỏe mạnh không?\" \"Vâng, tôi rất khỏe mạnh.\")"
  },
  "ごちそうさま": {
    sino: "",
    reading: "ごちそうさま",
    meaning: "cảm ơn vì bữa ăn ngon (nói sau khi dùng bữa)",
    example: "料理がとても美味しかったです。ごちそうさまでした。(Món ăn ngon lắm. Cảm ơn vì bữa ăn ngon ạ.)"
  },
  "先": {
    sino: "TIÊN",
    reading: "さき",
    meaning: "phía trước; trước tiên; tương lai, sắp tới",
    example: "用事があるので、お先に失礼します。(Tôi có chút việc bận nên xin phép về trước ạ.)"
  },
  "差す": {
    sino: "SAI",
    reading: "さす",
    meaning: "giương, che (ô); chiếu (ánh sáng); châm, nhỏ (thuốc)",
    example: "雨が激しく降ってきたので傘を差します。(Trời bắt đầu mưa to nên tôi che ô.)"
  },

  // theme-03-adjectives
  "三": {
    sino: "TAM",
    reading: "さん",
    meaning: "ba (số 3)",
    example: "テーブルの上にりんごが三個あります。(Trên bàn có ba quả táo.)"
  },
  "締める": {
    sino: "ĐẾ",
    reading: "しめる",
    meaning: "thắt (cà vạt, dây an toàn); vặn chặt, đóng",
    example: "車に乗ったら、必ずシートベルトを締めてください。(Khi lên xe ô tô, xin hãy luôn thắt dây an toàn.)"
  },
  "上手": {
    sino: "THƯỢNG THỦ",
    reading: "じょうず",
    meaning: "giỏi, khéo léo",
    example: "彼女はピアノの演奏がとても上手です。(Cô ấy chơi đàn piano rất giỏi.)"
  },
  "吸う": {
    sino: "HẤP",
    reading: "すう",
    meaning: "hút (thuốc, không khí); hít thở",
    example: "この部屋ではタバコを吸わないでください。(Xin đừng hút thuốc trong căn phòng này.)"
  },
  "好き": {
    sino: "HẢO",
    reading: "すき",
    meaning: "thích, ưa chuộng",
    example: "私は甘い果物が大好きです。(Tôi rất thích những loại trái cây ngọt ngào.)"
  },
  "少ない": {
    sino: "THIỂU",
    reading: "すくない",
    meaning: "ít, hiếm",
    example: "雨の日は公園に遊びに来る子どもが少ないです。(Vào ngày mưa, có rất ít trẻ em đến công viên chơi.)"
  },
  "ストーブ": {
    sino: "",
    reading: "ストーブ",
    meaning: "lò sưởi, máy sưởi",
    example: "冬になると部屋が冷えるのでストーブをつけます。(Vào mùa đông phòng lạnh nên tôi bật lò sưởi lên.)"
  },
  "する": {
    sino: "",
    reading: "する",
    meaning: "làm, thực hiện (hành động); đeo (trang sức); có (mùi, vị, âm thanh)",
    example: "毎晩寝る前に、日本語の宿題をします。(Mỗi tối trước khi đi ngủ, tôi đều làm bài tập tiếng Nhật.)"
  },
  "せっけん": {
    sino: "",
    reading: "せっけん",
    meaning: "xà phòng, xà bông",
    example: "食事の前に、せっけんでしっかりと手を洗います。(Trước bữa ăn, tôi rửa tay thật sạch bằng xà phòng.)"
  },
  "ゼロ": {
    sino: "",
    reading: "ゼロ",
    meaning: "số không (0)",
    example: "テストの結果はゼロ点ではなくて安心しました。(Tôi đã thở phào nhẹ nhõm vì kết quả bài kiểm tra không phải là số không điểm.)"
  },
  "洗濯": {
    sino: "TẨY TRẠC",
    reading: "せんたく",
    meaning: "giặt giũ, giặt đồ",
    example: "天気がいい休日に、まとめて服を洗濯します。(Vào ngày nghỉ thời tiết đẹp, tôi giặt giũ quần áo một thể.)"
  },
  "掃除": {
    sino: "TẢO TRỪ",
    reading: "そうじ",
    meaning: "dọn dẹp, vệ sinh",
    example: "年末に家族みんなで家じゅうを掃除します。(Vào cuối năm, cả gia đình tôi cùng nhau dọn dẹp khắp cả nhà.)"
  },
  "そうして": {
    sino: "",
    reading: "そうして",
    meaning: "và, sau đó, rồi thì",
    example: "図書館で本を借りました。そうして、家でゆっくり読みました。(Tôi đã mượn sách ở thư viện, và sau đó đọc thong thả ở nhà.)"
  },
  "そっち": {
    sino: "",
    reading: "そっち",
    meaning: "chỗ đó, phía đó (phía người nghe)",
    example: "そっちは危ないですから、こちらへ来てください。(Phía đó nguy hiểm đấy, xin bạn hãy qua phía bên này.)"
  },
  "大丈夫": {
    sino: "ĐẠI TRƯỢNG PHU",
    reading: "だいじょうぶ",
    meaning: "không sao, ổn thỏa, an toàn",
    example: "「怪我はありませんか」「はい、大丈夫です」。(\"Bạn có bị thương không?\" \"Dạ vâng, tôi không sao cả.\")"
  },
  "大好き": {
    sino: "ĐẠI HẢO",
    reading: "だいすき",
    meaning: "rất thích, rất yêu",
    example: "私は日本の寿司やラーメンが大好きです。(Tôi rất thích các món sushi và ramen của Nhật Bản.)"
  },
  "たいへん": {
    sino: "",
    reading: "たいへん",
    meaning: "vất vả, khó khăn; rất (mức độ cao)",
    example: "毎日の仕事はたいへんですが、とてもやりがいがあります。(Công việc hằng ngày tuy vất vả nhưng rất đáng để làm.)"
  },
  "出す": {
    sino: "XUẤT",
    reading: "だす",
    meaning: "lấy ra; đưa ra; nộp (bài tập); gửi (thư)",
    example: "カバンからノートと筆箱を出します。(Tôi lấy tập vở và hộp bút ra khỏi cặp sách.)"
  },
  "たて": {
    sino: "",
    reading: "たて",
    meaning: "chiều dọc, bề dọc",
    example: "この紙のたての長さを定規で測ってください。(Xin hãy dùng thước đo chiều dọc của tờ giấy này.)"
  },
  "頼む": {
    sino: "LẠI",
    reading: "たのむ",
    meaning: "nhờ cậy, nhờ vả; gọi món (nhà hàng)",
    example: "友人に引っ越しの手伝いを頼みます。(Tôi nhờ cậy bạn bè giúp đỡ việc chuyển nhà.)"
  },
  "小さな": {
    sino: "TIỂU",
    reading: "ちいさな",
    meaning: "nhỏ, bé",
    example: "机の上に小さな可愛い置物があります。(Trên bàn có một món đồ trang trí nhỏ xinh xắn.)"
  },
  "ちょうど": {
    sino: "",
    reading: "ちょうど",
    meaning: "vừa đúng, đúng lúc, vừa vặn",
    example: "私が駅に着いた時、ちょうど電車が来ました。(Khi tôi đến nhà ga thì vừa đúng lúc tàu điện tới.)"
  },
  "着く": {
    sino: "TRỨ",
    reading: "つく",
    meaning: "đến nơi, tới nơi",
    example: "午後三時に東京駅に着く予定です。(Dự kiến tôi sẽ đến nơi ga Tokyo lúc 3 giờ chiều.)"
  },
  "テープ": {
    sino: "",
    reading: "テープ",
    meaning: "băng dính; băng cát-xét",
    example: "荷物の箱を透明なテープでしっかりととめます。(Tôi dán chặt thùng hàng lại bằng băng dính trong suốt.)"
  },
  "では": {
    sino: "",
    reading: "では",
    meaning: "thế thì, vậy thì; trong, ở tại",
    example: "では、本日の会議をこれで終了します。(Vậy thì, cuộc họp ngày hôm nay xin kết thúc tại đây.)"
  },

  // theme-04-nouns-places
  "出る": {
    sino: "XUẤT",
    reading: "でる",
    meaning: "ra ngoài, rời khỏi; xuất hiện; tham gia",
    example: "朝七時に家を出て学校に向かいます。(Lúc bảy giờ sáng tôi rời khỏi nhà để đi tới trường.)"
  },
  "どうぞよろしく": {
    sino: "",
    reading: "どうぞよろしく",
    meaning: "rất mong nhận được sự giúp đỡ của bạn (chào hỏi khi mới gặp)",
    example: "初めまして、田中と申します。どうぞよろしくお願いします。(Xin chào lần đầu gặp mặt, tôi tên là Tanaka. Rất mong nhận được sự giúp đỡ của bạn.)"
  },
  "年": {
    sino: "NIÊN",
    reading: "とし",
    meaning: "năm; tuổi tác",
    example: "新しい年を迎えて、目標を立てました。(Đón chào một năm mới, tôi đã đặt ra những mục tiêu cho mình.)"
  },
  "飛ぶ": {
    sino: "PHI",
    reading: "とぶ",
    meaning: "bay; nhảy vọt",
    example: "青い空を鳥たちが気持ちよさそうに飛んでいます。(Những chú chim đang bay lượn khoan khoái trên bầu trời xanh.)"
  },
  "鳴く": {
    sino: "MINH",
    reading: "なく",
    meaning: "kêu, hót (tiếng chim, động vật)",
    example: "朝早くから小鳥が木の上で鳴いています。(Từ sáng sớm, những chú chim non đã hót ríu rít trên ngọn cây.)"
  },
  "など": {
    sino: "",
    reading: "など",
    meaning: "vân vân, những thứ như... (liệt kê)",
    example: "カバンの中に本やノートや筆箱などが入っています。(Trong cặp có sách vở, bút và thước kẻ, vân vân.)"
  },
  "並べる": {
    sino: "TỊNH",
    reading: "ならべる",
    meaning: "sắp xếp, xếp thành hàng, bày biện",
    example: "本棚に新しい本をきれいに並べました。(Tôi đã sắp xếp những quyển sách mới gọn gàng ngay ngắn vào giá sách.)"
  },
  "二": {
    sino: "NHỊ",
    reading: "に",
    meaning: "hai (số 2)",
    example: "りんごを二つ買って帰りました。(Tôi đã mua hai quả táo rồi mang về nhà.)"
  },
  "賑やか": {
    sino: "CHẨN",
    reading: "にぎやか",
    meaning: "nhộn nhịp, náo nhiệt, đông vui",
    example: "お祭りの日は通りがとても賑やかになります。(Vào ngày lễ hội, đường phố trở nên rất nhộn nhịp.)"
  },
  "登る": {
    sino: "ĐĂNG",
    reading: "のぼる",
    meaning: "leo lên, trèo (núi, dốc)",
    example: "今年の夏休みに富士山に登るつもりです。(Vào kỳ nghỉ hè năm nay, tôi dự định sẽ leo lên núi Phú Sĩ.)"
  },
  "乗る": {
    sino: "THỪA",
    reading: "のる",
    meaning: "lên xe, đi xe (tàu, xe buýt); cưỡi (ngựa)",
    example: "毎朝地下鉄に乗って会社へ通っています。(Mỗi sáng tôi đều lên xe tàu điện ngầm để đi làm.)"
  },
  "入る": {
    sino: "NHẬP",
    reading: "はいる",
    meaning: "vào, bước vào; nhập",
    example: "ドアをノックしてから部屋に入ってください。(Xin hãy gõ cửa trước khi bước vào phòng.)"
  },
  "はく": {
    sino: "",
    reading: "はく",
    meaning: "mặc, xỏ, đi (quần, tất, giày)",
    example: "新しい靴をはいて出かけます。(Tôi xỏ đôi giày mới rồi ra ngoài.)"
  },
  "早い": {
    sino: "TẢO",
    reading: "はやい",
    meaning: "sớm (về thời gian, thời điểm)",
    example: "明日は試験があるので、朝早く起きます。(Ngày mai có bài thi nên tôi sẽ thức dậy từ sáng sớm.)"
  },
  "貼る": {
    sino: "THIẾP",
    reading: "はる",
    meaning: "dán, dán lên (tem, áp phích)",
    example: "封筒の表に切手を貼ってポストに入れます。(Tôi dán tem vào mặt trước phong bì rồi bỏ vào hòm thư.)"
  },

  // theme-05-adverbs
  "吹く": {
    sino: "XUY",
    reading: "ふく",
    meaning: "thổi (gió); thổi (sáo, kèn)",
    example: "今日は冷たい北風が強く吹いています。(Hôm nay gió bắc lạnh buốt đang thổi rất mạnh.)"
  },
  "太い": {
    sino: "THÁI",
    reading: "ふとい",
    meaning: "béo, mập; to, dày (thân cây, sợi dây)",
    example: "この神社には幹の太い古い大木があります。(Ngôi đền này có một cây đại thụ cổ kính với thân cây rất to.)"
  },
  "降る": {
    sino: "GIÁNG",
    reading: "ふる",
    meaning: "rơi (mưa, tuyết)",
    example: "午後から冷たい雨が降り始めました。(Từ buổi chiều trời đã bắt đầu rơi những hạt mưa lạnh.)"
  },
  "文章": {
    sino: "VĂN CHƯƠNG",
    reading: "ぶんしょう",
    meaning: "đoạn văn, bài văn; câu văn",
    example: "教科書の短い文章を声に出して読みます。(Tôi đọc to đoạn văn ngắn trong sách giáo khoa.)"
  },
  "下手": {
    sino: "HẠ THỦ",
    reading: "へた",
    meaning: "kém, dở, vụng về",
    example: "私はまだ日本語の会話が下手ですが、頑張って練習します。(Tôi nói tiếng Nhật vẫn còn dở nhưng tôi sẽ cố gắng luyện tập.)"
  },
  "便利": {
    sino: "TIỆN LỢI",
    reading: "べんり",
    meaning: "tiện lợi, thuận tiện",
    example: "駅の近くに住むと買い物ができてとても便利です。(Sống ở gần nhà ga rất tiện lợi vì có thể mua sắm dễ dàng.)"
  },
  "細い": {
    sino: "TẾ",
    reading: "ほそい",
    meaning: "thon nhỏ, mảnh khảnh; gầy, thon dài",
    example: "彼女は指が長くて細いです。(Cô ấy có những ngón tay dài và thon nhỏ.)"
  },
  "ボタン": {
    sino: "",
    reading: "ボタン",
    meaning: "cúc áo, khuy áo; nút bấm",
    example: "シャツの第一ボタンをとめてネクタイを締めます。(Tôi cài cúc áo đầu tiên của áo sơ mi rồi thắt cà vạt.)"
  },
  "まずい": {
    sino: "",
    reading: "まずい",
    meaning: "dở, không ngon (món ăn); dở tệ, nguy rồi (tình thế bất lợi)",
    example: "このスープは味が薄くてまずいです。(Món súp này vị nhạt và không ngon chút nào.)"
  },
  "待つ": {
    sino: "ĐÃI",
    reading: "まつ",
    meaning: "chờ, đợi",
    example: "駅の改札口の前で友達を待っています。(Tôi đang đứng chờ bạn ở trước cửa soát vé nhà ga.)"
  },
  "見る": {
    sino: "KIẾN",
    reading: "みる",
    meaning: "nhìn, xem, ngắm",
    example: "休みの日は家でテレビの映画を見ます。(Những ngày nghỉ tôi ở nhà xem phim truyện trên tivi.)"
  },
  "もう一度": {
    sino: "NHẤT ĐỘ",
    reading: "もういちど",
    meaning: "một lần nữa, lại một lần nữa",
    example: "聞き取れなかったので、もう一度言ってください。(Vì tôi chưa nghe rõ nên xin hãy nói lại một lần nữa.)"
  },
  "持つ": {
    sino: "TRÌ",
    reading: "もつ",
    meaning: "cầm, nắm; mang theo; sở hữu, có",
    example: "その重い荷物を私が持ちましょうか。(Để tôi cầm giúp bạn đống hành lý nặng đó nhé?)"
  },
  "ゆっくりと": {
    sino: "",
    reading: "ゆっくりと",
    meaning: "thong thả, từ từ, chậm rãi",
    example: "分かりやすく、ゆっくりと話してください。(Xin hãy nói từ từ, chậm rãi cho dễ hiểu nhé.)"
  },
  "よく": {
    sino: "",
    reading: "よく",
    meaning: "thường xuyên; giỏi, tốt; rõ",
    example: "週末はよく近所の図書館へ行って本を読みます。(Vào cuối tuần tôi thường xuyên đến thư viện gần nhà để đọc sách.)"
  },
  "横": {
    sino: "HOÀNH",
    reading: "よこ",
    meaning: "bên cạnh; bề ngang, chiều ngang",
    example: "机のすぐ横に背の高い本棚を置きました。(Tôi đặt một chiếc giá sách cao ngay bên cạnh bàn học.)"
  },
  "より": {
    sino: "",
    reading: "より",
    meaning: "hơn (so sánh); từ (thời gian, địa điểm)",
    example: "富士山は高尾山よりずっと高いです。(Núi Phú Sĩ cao hơn nhiều so với núi Takao.)"
  },
  "りっぱ": {
    sino: "",
    reading: "りっぱ",
    meaning: "lộng lẫy, nguy nga; xuất sắc, đàng hoàng",
    example: "駅前に大きくてりっぱな建物が建ちました。(Trước nhà ga một tòa nhà to lớn và lộng lẫy đã được xây dựng.)"
  },
  "零": {
    sino: "LINH",
    reading: "れい",
    meaning: "số không (0)",
    example: "今夜の気温は零度まで下がる予報です。(Dự báo đêm nay nhiệt độ sẽ hạ xuống mức số không độ.)"
  },
  "分かる": {
    sino: "PHÂN",
    reading: "わかる",
    meaning: "hiểu, biết; nhận ra",
    example: "先生の説明を聞いて、文法の使い方がよく分かりました。(Nghe thầy giáo giải thích, tôi đã hiểu rất rõ cách dùng ngữ pháp.)"
  },
  "渡す": {
    sino: "ĐỘ",
    reading: "わたす",
    meaning: "trao, đưa cho; chở qua sông",
    example: "先生に宿題のノートを両手で渡しました。(Tôi dùng cả hai tay đưa cho thầy giáo cuốn vở bài tập.)"
  }
};

const n5CoreDir = path.join(__dirname, '../data/jlpt-n5-core-bank');

function processThemeDir(themeDir) {
  const vocabPath = path.join(themeDir, 'vocabulary.json');
  if (!fs.existsSync(vocabPath)) return 0;

  const data = JSON.parse(fs.readFileSync(vocabPath, 'utf8'));
  let updatedCount = 0;

  for (let item of data) {
    const key = item.word;
    if (n5CoreUpdates[key]) {
      const u = n5CoreUpdates[key];
      item.sinoVietnamese = u.sino;
      item.reading = u.reading;
      item.meaning = u.meaning;
      item.example = u.example;
      updatedCount++;
    }
  }

  fs.writeFileSync(vocabPath, JSON.stringify(data, null, 2), 'utf8');
  return updatedCount;
}

function run() {
  const themes = fs.readdirSync(n5CoreDir);
  let total = 0;
  for (const theme of themes) {
    const themePath = path.join(n5CoreDir, theme);
    if (fs.statSync(themePath).isDirectory()) {
      const c = processThemeDir(themePath);
      console.log(`- ${theme}: Cập nhật ${c} từ.`);
      total += c;
    }
  }
  console.log(`\n=> TỔNG CỘNG ĐÃ CẬP NHẬT: ${total} từ trong jlpt-n5-core-bank.`);
}

run();

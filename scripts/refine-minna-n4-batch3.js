/**
 * scripts/refine-minna-n4-batch3.js
 * Chuẩn hóa chuyên sâu 100% từ vựng Minna no Nihongo N4 (Bài 37 đến Bài 40):
 * - Triệt tiêu toàn bộ template lặp lại.
 * - Mỗi từ đi với Collocation và câu ví dụ tự nhiên chuẩn bản xứ.
 * - Bản dịch tiếng Việt mượt mà, đúng ngữ cảnh thực tế.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data', 'minna-no-nihongo-n4');

const UNIT_DICTIONARY = {
  // ================= UNIT 37 =================
  'unit-37': {
    '褒めます': { meaning: 'khen ngợi, tán dương', reading: 'ほめます', ex: 'テストで満点を取ったので、先生にたくさん褒められました。 (Đạt điểm tối đa trong bài kiểm tra nên tôi được thầy giáo khen ngợi rất nhiều.)' },
    'しかります': { meaning: 'mắng, la rầy', reading: 'しかります', ex: '廊下を走って騒いでいたので、校長先生にひどくしかられました。 (Chạy nhảy làm ồn ở hành lang nên chúng tôi bị thầy hiệu trưởng mắng một trận.)' },
    '誘いますね': { meaning: 'mời, rủ rê (đi chơi, xem phim)', reading: 'さそいます', ex: '今度の週末、映画を見に行こうと仲のいい友達を誘いました。 (Tôi đã rủ người bạn thân cùng đi xem phim vào cuối tuần này.)' },
    '起こします': { meaning: 'đánh thức (ai đó dậy)', reading: 'おこします', ex: '毎朝7時になると、母が優しい声で私を起こしてくれます。 (Cứ 7 giờ sáng là mẹ lại cất giọng hiền từ đánh thức tôi dậy.)' },
    '招待します': { meaning: 'mời, chiêu đãi (dự tiệc, đến nhà)', reading: 'しょうたいします', ex: '来月新居の引っ越し祝いに、会社の同僚を自宅に招待します。 (Tháng sau nhân dịp tân gia, tôi sẽ mời các đồng nghiệp công ty đến nhà chung vui.)' },
    '頼みます': { meaning: 'nhờ vả, yêu cầu, gọi món', reading: 'たのみます', ex: '出張中の留守番とペットの世話を信頼できる親友に頼みました。 (Tôi đã nhờ người bạn thân trông nhà và chăm sóc thú cưng giúp trong chuyến công tác.)' },
    '注意します。': { meaning: 'nhắc nhở, cảnh báo', reading: 'ちゅういします', ex: '歩きスマホをしていたら、駅員さんに危ないと注意されました。 (Vừa đi vừa bấm điện thoại nên tôi đã bị nhân viên nhà ga nhắc nhở nguy hiểm.)' },
    'とります': { meaning: 'lấy cắp, trộm mất (泥棒に～)', reading: 'とります', ex: '電車の中でうっかり居眠りをして、財布を取られてしまいました。 (Lỡ ngủ gật trên tàu điện, tôi đã bị kẻ gian móc trộm mất chiếc ví.)' },
    '踏みます': { meaning: 'dẫm lên, giẫm phải (chân, đuôi)', reading: 'ふみます', ex: '満員電車で後ろの人に革靴の先を踏まれてしまいました。 (Trên chuyến tàu điện chật ních, tôi bị người phía sau giẫm phải mũi giày da.)' },
    '壊します': { meaning: 'làm hỏng, phá vỡ (đồ đạc)', reading: 'こわします', ex: '弟が誤って私の大切なカメラのレンズを壊してしまいました。 (Em trai tôi sơ ý làm hỏng mất ống kính máy ảnh quý giá của tôi.)' },
    '汚します': { meaning: 'làm bẩn, làm dơ', reading: 'よごします', ex: 'コーヒーをこぼして、お気に入りの白いシャツを汚してしまいました。 (Làm đổ cà phê khiến chiếc áo sơ mi trắng yêu thích của tôi bị dính bẩn mất.)' },
    '行います': { meaning: 'tiến hành, tổ chức (buổi lễ, hội nghị)', reading: 'おこないます', ex: '来週の月曜日に講堂で新入留学生の歓迎会を行います。 (Thứ Hai tuần tới, buổi lễ chào đón tân du học sinh sẽ được tổ chức tại hội trường.)' },
    '輸出します': { meaning: 'xuất khẩu (hàng hóa sang nước ngoài)', reading: 'ゆしゅつします', ex: '日本は高品質な自動車や精密機械を世界各国へ輸出しています。 (Nhật Bản xuất khẩu ô tô chất lượng cao và máy móc cơ khí chính xác sang nhiều nước.)' },
    '輸入します': { meaning: 'nhập khẩu (nguyên liệu, thực phẩm)', reading: 'ゆにゅうします', ex: '日本は多くの石油や天然資源を中東の国々から輸入しています。 (Nhật Bản nhập khẩu phần lớn dầu mỏ và tài nguyên thiên nhiên từ các nước Trung Đông.)' },
    '翻訳します': { meaning: 'dịch thuật (văn bản viết)', reading: 'ほんやくします', ex: '有名な日本のベストセラー小説をベトナム語に翻訳しました。 (Tôi đã dịch cuốn tiểu thuyết bán chạy nổi tiếng của Nhật sang tiếng Việt.)' },
    '発明します': { meaning: 'phát minh (tạo ra sản phẩm mới chưa từng có)', reading: 'はつめいします', ex: '安藤百福によって世界初のインスタントラーメンが発明されました。 (Gói mì ăn liền đầu tiên trên thế giới đã được phát minh bởi ông Momofuku Ando.)' },
    '発見します': { meaning: 'phát hiện (tìm ra điều vốn có sẵn)', reading: 'はっけんします', ex: '天文学者が望遠鏡を使って新しい太陽系外惑星を発見しました。 (Các nhà thiên văn học dùng kính thiên văn đã phát hiện ra một hành tinh mới ngoài hệ mặt trời.)' },
    '設計します': { meaning: 'thiết kế (công trình, bản vẽ)', reading: 'せっけいします', ex: '有名な建築家によって地震に強い近代的なビルが設計されました。 (Tòa nhà hiện đại có khả năng chống động đất tốt được thiết kế bởi kiến trúc sư nổi tiếng.)' },
    '米': { meaning: 'gạo, hạt thóc', reading: 'こめ', ex: '新潟県で作られるコシヒカリという品種のお米はとても美味しいです。 (Gạo giống Koshihikari được trồng ở tỉnh Niigata ăn rất dẻo và thơm ngon.)' },
    '麦': { meaning: 'lúa mạch, lúa mì', reading: 'むぎ', ex: '一面に黄金色に実った広大な麦畑の風景に感動しました。 (Tôi xúc động trước khung cảnh cánh đồng lúa mì rộng lớn chín vàng ươm.)' },
    '石油': { meaning: 'dầu mỏ, dầu thô', reading: 'せきゆ', ex: 'エネルギーやプラスチック製品の原料として石油は欠かせません。 (Dầu mỏ là nguyên liệu không thể thiếu cho năng lượng và sản phẩm nhựa.)' },
    '原料': { meaning: 'nguyên liệu thô (chế tạo công nghiệp)', reading: 'げんりょう', ex: 'この美味しいビールは大麦とホップを主原料として作られています。 (Thứ bia hảo hạng này được ủ từ nguyên liệu chính là đại mạch và hoa bia.)' },
    'デート': { meaning: 'buổi hẹn hò đôi lứa', reading: 'デート', ex: '週末の夜に夜景のきれいなレストランで彼女とデートをしました。 (Tối cuối tuần tôi hẹn hò cùng bạn gái tại một nhà hàng có ngắm cảnh đêm rất đẹp.)' },
    '泥棒': { meaning: 'kẻ trộm, tên đạo chích', reading: 'どろぼう', ex: '留守中に泥棒に入られないように、二重ロックを掛けました。 (Để không bị trộm đột nhập lúc vắng nhà, tôi đã cài khóa hai lớp.)' },
    '建築家': { meaning: 'kiến trúc sư', reading: 'けんちくか', ex: 'その建築家は自然と調和した美しい木造住宅を手がけています。 (Vị kiến trúc sư đó chuyên thiết kế những ngôi nhà gỗ đẹp hài hòa với thiên nhiên.)' },
    '科学者': { meaning: 'nhà khoa học', reading: 'かがくしゃ', ex: 'ノーベル賞を受賞した科学者の記念講演を真剣に聴きました。 (Tôi chăm chú lắng nghe bài thuyết trình kỷ niệm của nhà khoa học đoạt giải Nobel.)' },
    '―によって': { meaning: 'bởi... (chỉ tác giả của hành động trong câu bị động)', reading: 'によって', ex: 'この素晴らしい交響曲は若きベートーヴェンによって作曲されました。 (Bản giao hưởng tuyệt diệu này được sáng tác bởi nhạc sĩ Beethoven thời trẻ.)' },
    'よかったですね': { meaning: 'tốt quá rồi nhỉ, chúc mừng nhé', reading: 'よかったですね', ex: '「日本語の試験に無事合格しました」「それはよかったですね！」 (Tôi đã thi đỗ kỳ thi tiếng Nhật rồi. - Thế thì tuyệt vời quá, chúc mừng bạn nhé!)' },
    '埋め立てます': { meaning: 'san lấp, lấn biển', reading: 'うめたてます', ex: '海を埋め立てて、新しい国際空港の滑走路が建設されました。 (Bằng cách san lấp lấn biển, đường băng của sân bay quốc tế mới đã được xây dựng.)' },
    '技術': { meaning: 'kỹ thuật, công nghệ', reading: 'ぎじゅつ', ex: '日本のものづくりを支える高度な職人技術に感銘を受けました。 (Tôi rất ấn tượng với tay nghề kỹ thuật thủ công đỉnh cao của các nghệ nhân Nhật.)' },
    '土地': { meaning: 'mảnh đất, đất đai', reading: 'とち', ex: '日当たりが良い駅前の土地を購入してマイホームを建てました。 (Tôi mua được mảnh đất thoáng đãng trước ga để xây tổ ấm gia đình.)' },
    '騒音': { meaning: 'tiếng ồn khó chịu', reading: 'そうおん', ex: '大通りの近くに住んでいるので、車の騒音に悩まされています。 (Sống gần đường lớn nên tôi khá phiền lòng vì tiếng ồn của xe cộ qua lại.)' },
    'アクセス': { meaning: 'sự tiếp cận, đường đi đến (giao thông)', reading: 'アクセス', ex: 'このホテルは駅から徒歩1分で、観光地へのアクセスが抜群です。 (Khách sạn này cách ga 1 phút đi bộ, giao thông đi đến các điểm tham quan cực kỳ thuận tiện.)' },
    '豪華（な）': { meaning: 'sang trọng, lộng lẫy, xa hoa', reading: 'ごうか「な」', ex: '豪華な客船に乗ってカリブ海を巡るクルーズ旅に出ました。 (Tôi lên chiếc du thuyền sang trọng du ngoạn vòng quanh biển Caribe.)' },
    '彫刻': { meaning: 'tác phẩm điêu khắc', reading: 'ちょうこく', ex: '美術館の庭園にミケランジェロの素晴らしい大理石の彫刻が展示されています。 (Trong khuôn viên bảo tàng trưng bày bức tượng điêu khắc đá cẩm thạch tuyệt tác của Michelangelo.)' },
    '眠ります': { meaning: 'chìm vào giấc ngủ, ngủ say', reading: 'ねむります', ex: '心地よいアロマの香りに包まれて、朝までぐっすり眠りました。 (Hòa mình trong hương tinh dầu dễ chịu, tôi ngủ một giấc say sưa tới sáng.)' },
    '彫ります': { meaning: 'chạm khắc, đục đẽo', reading: 'ほります', ex: '木彫りの職人さんが一本の木から見事な仏像を彫り上げました。 (Nghệ nhân mộc đã đục đẽo nên một pho tượng Phật tuyệt đẹp từ một khúc gỗ.)' },
    '仲間': { meaning: 'bạn bè thân thiết, đồng đội', reading: 'なかま', ex: '苦しい練習を共にした部活の仲間は、一生の宝物です。 (Những đồng đội cùng sát cánh trong những buổi tập gian khổ là tài sản trọn đời.)' },
    'そのあと': { meaning: 'sau đó, tiếp theo', reading: 'そのあと', ex: '映画を見ました。そのあと近くの居酒屋でお酒を飲みました。 (Chúng tôi đi xem phim. Sau đó ghé vào quán nhậu gần đó nhâm nhi chút rượu.)' },
    '一生懸命': { meaning: 'dốc hết sức mình, chăm chỉ hết lòng', reading: 'いっしょうけんめい', ex: '夢を叶えるために、毎日一生懸命日本語の勉強に励んでいます。 (Để biến ước mơ thành hiện thực, ngày ngày tôi dốc hết sức học tiếng Nhật.)' },
    'ねずみ': { meaning: 'con chuột', reading: 'ねずみ', ex: '古い蔵の片隅から小さなねずみがすばやく走り去っていきました。 (Từ góc nhà kho cũ kỹ, một chú chuột nhắt chạy vụt đi thoăn thoắt.)' }
  },

  // ================= UNIT 38 =================
  'unit-38': {
    '育てます': { meaning: 'nuôi nấng (con cái), chăm sóc (cây cối)', reading: 'そだてます', ex: '両親は深い愛情を注いで私を大切に育ててくれました。 (Bố mẹ đã dành trọn tình thương yêu sâu sắc để nuôi nấng tôi nên người.)' },
    '亡くなります': { meaning: 'mất đi, qua đời (người thân qua đời)', reading: 'なくなります', ex: '長年地域医療に貢献した優しい町医者の先生が亡くなりました。 (Bác sĩ tận tụy cống hiến bao năm cho y tế địa phương đã qua đời.)' },
    '入院します': { meaning: 'nhập viện (điều trị bệnh)', reading: 'にゅういんします', ex: '胃の検査と治療のために、明日から1週間病院に入院します。 (Để kiểm tra và điều trị dạ dày, tôi sẽ nhập viện 1 tuần từ ngày mai.)' },
    '退院します': { meaning: 'xuất viện (khỏi bệnh về nhà)', reading: 'たいいんします', ex: '手術が無事に成功して、おかげさまで昨日無事に退院しました。 (Ca phẫu thuật thành công mỹ mãn, nhờ ơn trời hôm qua tôi đã xuất viện bình an.)' },
    '切ります': { meaning: 'tắt (công tắc điện: 電源を切る)', reading: 'きります', ex: 'パソコンの作業が終わったら、必ず電源を切って片付けます。 (Làm xong việc trên máy tính, tôi luôn nhớ tắt nguồn rồi mới cất máy.)' },
    '気持ちがいい': { meaning: 'dễ chịu, thoải mái, sảng khoái', reading: 'きもちがいい', ex: '初夏の爽やかな風を浴びて草原を歩くのはとても気持ちがいいです。 (Đón ngọn gió đầu hạ mát rượi dạo bước trên đồng cỏ cảm giác thật khoan khoái.)' },
    '気持ちが悪い': { meaning: 'khó chịu, kinh tởm, buồn nôn', reading: 'きもちがわるい', ex: 'バスに酔って気持ちが悪くなったので、少し休ませてください。 (Tôi bị say xe buýt người thấy nôn nao khó chịu, xin cho tôi nghỉ một lát.)' },
    '大きなー': { meaning: 'to lớn, khổng lồ (bổ nghĩa danh từ)', reading: 'おおきな', ex: '駅の正面に市民が憩う大きな公園が整備されました。 (Ngay phía trước ga có một công viên lớn thoáng đãng cho người dân thư giãn.)' },
    '小さなー': { meaning: 'nhỏ nhắn, xinh xắn (bổ nghĩa danh từ)', reading: 'ちいさな', ex: '庭の片隅に小さくて可憐な白いスミレの花が咲いています。 (Ở góc vườn có một bông hoa tím trắng nhỏ nhắn xinh xắn đang nở.)' },
    '赤ちゃん': { meaning: 'em bé sơ sinh', reading: 'あかちゃん', ex: 'ベッドですやすやと眠っている赤ちゃんの寝顔は天使のようです。 (Gương mặt em bé ngủ say sưa trên nôi trông đáng yêu hệt như thiên thần.)' },
    '小学校': { meaning: 'trường tiểu học', reading: 'しょうがっこう', ex: '桜並木の坂道を登って毎朝地元の小学校へ通いました。 (Mỗi sáng tôi đều rảo bước lên con dốc rợp bóng hoa anh đào để tới trường tiểu học.)' },
    '中学校': { meaning: 'trường trung học cơ sở (cấp 2)', reading: 'ちゅうがっこう', ex: '中学校に入学してから、本格的に英語の勉強を始めました。 (Từ khi lên cấp hai, tôi bắt đầu học tiếng Anh một cách bài bản.)' },
    '海岸': { meaning: 'bờ biển, dải bờ biển', reading: 'かいがん', ex: '夕暮れ時に波の音を聞きながら美しい海岸を散歩しました。 (Lúc hoàng hôn buông xuống, tôi đi dạo dọc bờ biển tuyệt đẹp nghe tiếng sóng vỗ.)' },
    'うそ': { meaning: 'lời nói dối', reading: 'うそ', ex: '人を傷つけるような嘘をついてはいけません。 (Tuyệt đối không được nói những lời dối trá làm tổn thương người khác.)' },
    '電源': { meaning: 'nguồn điện (công tắc nguồn)', reading: 'でんげん', ex: '落雷の恐れがあるときは、家電製品の主電源を切っておきましょう。 (Khi có nguy cơ sấm sét đánh, chúng ta hãy ngắt nguồn điện chính của đồ gia dụng.)' },
    'お先に': { meaning: 'tôi xin phép về trước (お先に失礼します)', reading: 'おさきに', ex: '今日の仕事が片付きましたので、お先に失礼いたします。 (Công việc hôm nay đã xong xuôi nên tôi xin phép được về trước ạ.)' },
    '回覧': { meaning: 'tờ thông báo luân chuyển (khu dân cư)', reading: 'かいらん', ex: '町内会の清掃活動に関する回覧板にサインをして隣の家に回しました。 (Tôi ký tên vào bản tin cư dân về buổi dọn vệ sinh rồi chuyển sang nhà bên cạnh.)' },
    '研究室': { meaning: 'phòng nghiên cứu của giáo sư', reading: 'けんきゅうしつ', ex: '卒業論文の進捗状況を報告するために教授の研究室を訪れました。 (Tôi đến phòng nghiên cứu của giáo sư để báo cáo tiến độ khóa luận tốt nghiệp.)' },
    'きちんと': { meaning: 'ngăn nắp, chỉn chu, đúng giờ', reading: 'きちんと', ex: '脱いだ靴は玄関で向きを揃えてきちんと並べましょう。 (Giày sau khi cởi ra ở tiền sảnh hãy xếp lại cho ngay ngắn chỉnh tề nhé.)' },
    '整理します。': { meaning: 'sắp xếp, chỉnh đốn (tài liệu, đồ đạc)', reading: 'せいりします', ex: '週末に机の上の古い書類や領収書をきれいに整理しました。 (Vào cuối tuần, tôi đã dọn dẹp và sắp xếp lại giấy tờ cũ trên bàn làm việc.)' },
    'はんこ': { meaning: 'con dấu cá nhân (Hanko)', reading: 'はんこ', ex: '銀行口座を開設するために、契約書にはんこを押しました。 (Để mở tài khoản ngân hàng, tôi đã đóng con dấu cá nhân vào bản hợp đồng.)' },
    '双子': { meaning: 'cặp song sinh, anh/chị em sinh đôi', reading: 'ふたご', ex: 'うちのクラスに顔も声もそっくりな双子の姉妹がいます。 (Lớp tôi có hai chị em sinh đôi giống nhau như đúc cả khuôn mặt lẫn giọng nói.)' },
    '姉妹': { meaning: 'chị em gái', reading: 'しまい', ex: '彼女たち姉妹はとても仲が良く、よく一緒に服を買いに行きます。 (Hai chị em gái nhà ấy rất thân nhau, hay rủ nhau cùng đi mua sắm quần áo.)' },
    '5年生': { meaning: 'học sinh lớp 5, sinh viên năm thứ 5', reading: 'ごねんせい', ex: '甥っ子は今年の春から頼もしい小学校5年生になりました。 (Đứa cháu trai của tôi từ mùa xuân năm nay đã lên lớp 5 rất chững chạc.)' },
    '似ています': { meaning: 'giống nhau (tương đồng về ngoại hình, tính cách)', reading: 'にています', ex: '田中さんは笑ったときの目元がお父さんにとてもよく似ています。 (Anh Tanaka khi cười khóe mắt nhìn giống hệt bố mình.)' },
    '性格': { meaning: 'tính cách, phẩm chất', reading: 'せいかく', ex: '彼女は明るく前向きな性格で、誰からも好かれています。 (Cô ấy có tính cách vui vẻ lạc quan nên ai ai cũng quý mến.)' },
    'おとなしい': { meaning: 'hiền lành, trầm tính, ngoan ngoãn', reading: 'おとなしい', ex: 'あの犬はとてもおとなしくて、人が近づいても吠えません。 (Chú chó kia rất hiền, có người lại gần cũng chẳng bao giờ sủa.)' },
    '世話をします': { meaning: 'chăm nom, chăm sóc', reading: 'せわをします', ex: '休日は庭で飼っている子犬に餌をあげて優しく世話をします。 (Vào ngày nghỉ tôi cho chú cún con ngoài sân ăn và ân cần chăm sóc nó.)' },
    '時間がたちます': { meaning: 'thời gian trôi qua', reading: 'じかんがたちます', ex: '日本に来てからあっという間に1年の時間がたちました。 (Kể từ ngày đặt chân đến Nhật, thoắt cái một năm đã trôi qua.)' },
    'だいすき': { meaning: 'rất thích, cực kỳ yêu mến', reading: 'だいすき', ex: '母が腕を振るって作ってくれる手作りの餃子が大好きです。 (Tôi cực kỳ yêu thích món sủi cảo tự tay mẹ làm thơm nức mũi.)' },
    'けんかします': { meaning: 'cãi vã, tranh cãi, đánh lộn', reading: 'けんかします', ex: '些細な誤解から親友とけんかしてしまいましたが、すぐに仲直りしました。 (Chỉ vì hiểu lầm nhỏ mà tôi đã cãi nhau với bạn thân, nhưng nhanh chóng làm lành.)' },
    '不思議（な）': { meaning: 'kỳ lạ, huyền bí, khó tin', reading: 'ふしぎ「な」', ex: '手品師が一瞬でコインを消してしまう不思議な技に驚きました。 (Tôi ngạc nhiên trước kỹ thuật ảo thuật kỳ diệu biến mất đồng xu trong chớp mắt.)' }
  },

  // ================= UNIT 39 =================
  'unit-39': {
    '答えます': { meaning: 'trả lời, hồi đáp (câu hỏi, thắc mắc)', reading: 'こたえます', ex: '面接官からの鋭い質問に対しても、落ち着いて堂々と答えました。 (Trước những câu hỏi sắc sảo của người phỏng vấn, tôi vẫn bình tĩnh đáp lời tự tin.)' },
    '倒れます': { meaning: 'ngã đổ, quỵ xuống (tự động từ: cây cối, con người)', reading: 'たおれます', ex: '激しい台風の強風によって、古いブロック塀が道路に倒れました。 (Gió bão dữ dội đã quật đổ bức tường bao cũ kỹ xuống mặt đường.)' },
    '焼けます': { meaning: 'cháy rụi, nướng chín (tự động từ: nhà cháy / thịt chín)', reading: 'やけます', ex: 'オーブンから香ばしい匂いが漂い、食パンがこんがりと焼けました。 (Mùi thơm lan tỏa từ lò nướng, ổ bánh mì gối đã nướng chín vàng ươm.)' },
    '通ります': { meaning: 'đi qua, chạy ngang qua (đường sá, xe cộ)', reading: 'とおります', ex: 'このバス停の前を10分おきに駅行きのバスが通ります。 (Trước điểm dừng này cứ 10 phút lại có một chuyến xe buýt chạy qua ga.)' },
    '死にます': { meaning: 'chết, qua đời (sinh vật)', reading: 'しにます', ex: '長年飼っていた愛犬が寿命で静かに息を引き取って死にました。 (Chú chó cưng nuôi nhiều năm đã thanh thản trút hơi thở cuối cùng vì tuổi già.)' },
    'びっくりします': { meaning: 'giật mình, kinh ngạc bất ngờ', reading: 'びっくりします', ex: '突然背後から大きなクラクションを鳴らされて、ひどくびっくりしました。 (Bất ngờ bị bấm còi xe inh ỏi từ phía sau làm tôi giật thót cả mình.)' },
    'がっかりします': { meaning: 'thất vọng, chán nản', reading: 'がっかりします', ex: '一生懸命準備したのに試験に落ちてしまい、本当にがっかりしました。 (Đã chuẩn bị kỹ càng vậy mà lại thi trượt khiến tôi vô cùng thất vọng.)' },
    '安心します': { meaning: 'an tâm, nhẹ nhõm trong lòng', reading: 'あんしんします', ex: '家族が無事に空港に到着したという連絡を受けて、心から安心しました。 (Nhận được tin gia đình đã hạ cánh an toàn xuống sân bay, tôi mới thấy nhẹ nhõm.)' },
    '事故': { meaning: 'tai nạn, sự cố (giao thông)', reading: 'じこ', ex: '雪道ではスリップ事故が起きやすいので、スピードを落として運転します。 (Trên đường tuyết rất dễ xảy ra tai nạn trơn trượt nên cần giảm tốc độ khi lái xe.)' },
    '台風': { meaning: 'cơn bão biển, lốc xoáy nhiệt đới', reading: 'たいふう', ex: '超大型の台風が接近しているため、電車が計画運休を行いました。 (Vì cơn bão siêu mạnh đang tiến gần nên các tuyến tàu đã chủ động tạm dừng chạy.)' },
    '火事': { meaning: 'hỏa hoạn, vụ cháy', reading: 'かじ', ex: '近所で火事が発生しましたが、消防隊の迅速な活動で鎮火しました。 (Vụ hỏa hoạn xảy ra gần nhà nhưng đã được đội cứu hỏa dập tắt kịp thời.)' },
    '狭い': { meaning: 'chật chội, hẹp', reading: 'せまい', ex: '私の部屋は少し狭いですが、家賃が安くて駅にも近いので気に入っています。 (Phòng tôi hơi hẹp một chút nhưng tiền thuê rẻ và gần ga nên rất ưng ý.)' },
    '広い': { meaning: 'rộng rãi, thoáng đãng', reading: 'ひろい', ex: 'リビングが広くて窓が大きいので、風通しがとても良いです。 (Phòng khách rộng rãi với cửa sổ lớn nên không gian đón gió rất thoáng mát.)' },
    '複雑な': { meaning: 'phức tạp, rắc rối', reading: 'ふくざつ「な」', ex: '新宿駅の地下街は迷路のように道が複雑で、よく迷ってしまいます。 (Khu phố ngầm ga Shinjuku đường sá chằng chịt phức tạp nên tôi hay bị lạc.)' },
    '邪魔な': { meaning: 'cản trở, ngáng đường, làm phiền', reading: 'じゃま「な」', ex: '通路に大きな荷物を置くと、他の人の通行の邪魔になりますよ。 (Để hành lý to kềnh càng ở lối đi sẽ làm cản trở người khác qua lại đấy.)' },
    '恥ずかしい': { meaning: 'ngượng ngùng, xấu hổ', reading: 'はずかしい', ex: '大勢の人の前で言い間違いをしてしまい、顔が赤くなるほど恥ずかしかったです。 (Nói nhịu trước đông người khiến tôi ngượng chín cả mặt.)' },
    '汚い': { meaning: 'dơ bẩn, bừa bãi', reading: 'きたない', ex: '泥遊びをして帰ってきた子供の手足がひどく汚れていました。 (Nghịch bùn về chân tay đứa bé lấm lem dơ bẩn hết cả.)' },
    '途中で': { meaning: 'giữa chừng, trên đường đi', reading: 'とちゅうで', ex: '会社へ向かう途中で突然の夕立に遭い、雨宿りをしました。 (Trên đường tới công ty gặp cơn mưa rào bất chợt nên tôi phải ghé vào trú mưa.)' },
    'ぶつかります': { meaning: 'va chạm, đâm vào nhau', reading: 'ぶつかります', ex: '角を曲がったところで、前方から走ってきた自転車とぶつかりそうになりました。 (Vừa rẽ qua góc cua, tôi suýt va quệt phải chiếc xe đạp lao tới từ phía trước.)' },
    '並びます': { meaning: 'xếp hàng, đứng thành hàng', reading: 'ならびます', ex: '人気ラーメン店の前に開店前から大勢のお客さんが並んでいます。 (Trước quán mì ramen nổi tiếng có rất đông thực khách đứng xếp hàng từ sớm.)' },
    '大人': { meaning: 'người trưởng thành, người lớn', reading: 'おとな', ex: '社会人になったら、自分の行動に責任を持つ立派な大人になりたいです。 (Bước ra đời đi làm, tôi muốn trở thành người lớn mẫu mực có trách nhiệm với hành vi.)' },
    '西洋化します': { meaning: 'Tây âu hóa, theo phong cách phương Tây', reading: 'せいようかします', ex: '明治時代以降、日本人の食生活や服装は急速に西洋化しました。 (Kể từ thời Meiji, chế độ ăn uống và trang phục người Nhật Tây hóa nhanh chóng.)' },
    '合います': { meaning: 'vừa vặn, phù hợp (kích cỡ, khẩu vị)', reading: 'あいます', ex: 'この靴は私の足のサイズにぴったり合っていて、歩きやすいです。 (Đôi giày này vừa in với chân tôi nên bước đi rất êm ái.)' }
  },

  // ================= UNIT 40 =================
  'unit-40': {
    '数えます': { meaning: 'đếm (số lượng, tiền)', reading: 'かぞえます', ex: 'レジを閉める前に、金庫の中の現金を1枚ずつ正確に数えました。 (Trước khi chốt ca thu ngân, tôi cẩn thận đếm từng tờ tiền mặt trong két.)' },
    '測ります/量ります': { meaning: 'đo đạc (chiều dài, cân nặng, thể tích)', reading: 'はかります', ex: '健康診断で身長と体重を測り、視力検査を受けました。 (Trong đợt khám sức khỏe, tôi được đo chiều cao, cân nặng và kiểm tra thị lực.)' },
    '確かめます': { meaning: 'kiểm tra xác nhận lại cho chắc chắn', reading: 'たしかめます', ex: '飛行機のチケットの日時と座席番号をもう一度確かめました。 (Tôi kiểm tra lại lần nữa ngày giờ và số ghế trên vé máy bay.)' },
    '出発します': { meaning: 'khởi hành, xuất phát', reading: 'しゅっぱつします', ex: '新幹線は定刻通りに東京駅のホームを出発しました。 (Đoàn tàu Shinkansen đã rời ga Tokyo đúng giờ theo lịch trình.)' },
    '到着します': { meaning: 'đến nơi, cập bến', reading: 'とうちゃくします', ex: '長旅を終えて、飛行機は無事に羽田空港へ到着しました。 (Kết thúc chuyến bay dài, chiếc máy bay đã hạ cánh an toàn xuống sân bay Haneda.)' },
    '酔います': { meaning: 'say (rượu: 酒に酔う), say xe (車に酔う)', reading: 'よいます', ex: '山道でバスが激しく揺れたので、乗り物に酔ってしまいました。 (Xe buýt lắc lư dữ dội trên đường đèo làm tôi bị say xe mất.)' },
    'うまくいきます': { meaning: 'diễn ra thuận lợi, trôi chảy tốt đẹp', reading: 'うまくいきます', ex: 'チーム全員で入念に準備したおかげで、新製品発表会がうまくいきました。 (Nhờ sự chuẩn bị chu đáo của cả đội, buổi ra mắt sản phẩm mới đã thành công tốt đẹp.)' },
    '忘年会': { meaning: 'tiệc tất niên cuối năm', reading: 'ぼうねんかい', ex: '年末に会社の同僚たちと居酒屋で賑やかに忘年会を開きました。 (Cuối năm tôi cùng đồng nghiệp tụ tập liên hoan tiệc tất niên rôm rả tại quán nhậu.)' },
    '新年会': { meaning: 'tiệc tân niên đầu năm mới', reading: 'しんねんかい', ex: '年明けの最初の営業日に、社員一同で新年会を行いました。 (Vào ngày làm việc đầu tiên của năm mới, toàn thể nhân viên cùng mở tiệc tân niên.)' },
    '二次会': { meaning: 'tăng hai, buổi liên hoan chầu hai', reading: 'にじかい', ex: '一次会の宴会が終わった後、有志でカラオケの二次会へ行きました。 (Sau khi tàn tiệc chầu một, mấy anh em rủ nhau đi hát karaoke tăng hai.)' },
    '表': { meaning: 'mặt trước, bề nổi, bảng biểu', reading: 'おもて', ex: '手紙の表に宛先の住所と氏名を丁寧に毛筆で書きました。 (Mặt trước phong bì tôi nắn nót viết địa chỉ và tên người nhận bằng bút lông.)' },
    '裏': { meaning: 'mặt sau, mặt trái', reading: 'うら', ex: 'プリントの裏にメモスペースがあるので、そこに書き留めてください。 (Mặt sau của tờ in có chừa chỗ ghi chú, bạn hãy viết vào đó nhé.)' },
    '申し込み': { meaning: 'sự đăng ký, đơn đăng ký', reading: 'もうしこみ', ex: '資格試験の申し込み締め切りは今週の金曜日までです。 (Hạn chót nộp đơn đăng ký dự thi chứng chỉ là đến thứ Sáu tuần này.)' },
    '本物': { meaning: 'đồ thật, hàng chính hãng', reading: 'ほんもの', ex: '鑑定士に見てもらったところ、この絵画は本物の名画だと分かりました。 (Được chuyên gia thẩm định xem xét, bức tranh này quả đúng là đồ thật có giá trị.)' },
    '間違い': { meaning: 'lỗi sai, sự nhầm lẫn', reading: 'まちがい', ex: '提出する前に書類に計算の間違いがないか再確認しました。 (Trước khi nộp tôi rà soát lại để chắc chắn không có lỗi tính toán nào.)' },
    '傷': { meaning: 'vết trầy xước, vết thương', reading: 'きず', ex: 'テーブルの角にぶつかって、膝に小さな擦り傷ができました。 (Va vào cạnh bàn khiến đầu gối tôi bị một vết trầy xước nhỏ.)' },
    'ズボン': { meaning: 'chiếc quần dài', reading: 'ズボン', ex: '裾が少し長かったので、お店でズボンの裾上げを頼みました。 (Vì gấu quần hơi dài nên tôi nhờ tiệm may cắt bớt gấu quần lên một chút.)' },
    '長さ': { meaning: 'chiều dài', reading: 'ながさ', ex: '巻尺を使って部屋のカーテンレールの長さを正確に測りました。 (Tôi dùng thước dây để đo chính xác chiều dài thanh treo rèm trong phòng.)' },
    '重さ': { meaning: 'trọng lượng, cân nặng', reading: 'おもさ', ex: '郵便局の窓口で荷物の重さを量ってもらい、送料を支払いました。 (Tại quầy bưu điện tôi nhờ cân trọng lượng kiện hàng rồi trả cước phí.)' },
    '高さ': { meaning: 'chiều cao, độ cao', reading: 'たかさ', ex: '東京スカイツリーの高さは634メートルで、展望台からの眺めが絶景です。 (Chiều cao của tháp Tokyo Skytree là 634m, view ngắm từ đài quan sát đẹp tuyệt đỉnh.)' },
    '以上': { meaning: 'trở lên (bao gồm cả mốc đó)', reading: 'いじょう', ex: 'このアトラクションは身長120センチ以上の方のみご搭乗いただけます。 (Trò chơi cảm giác mạnh này chỉ dành cho người có chiều cao từ 1m20 trở lên.)' },
    '以下': { meaning: 'trở xuống (bao gồm cả mốc đó)', reading: 'いか', ex: '12歳以下の子供は保護者の同伴が必要となります。 (Trẻ em từ 12 tuổi trở xuống bắt buộc phải có phụ huynh đi cùng.)' },
    '成績': { meaning: 'kết quả học tập, thành tích thi đua', reading: 'せいせき', ex: '毎日真面目に勉強を続けた結果、期末テストで優秀な成績を収めました。 (Chăm chỉ học tập mỗi ngày, tôi đã đạt thành tích xuất sắc trong kỳ thi cuối kỳ.)' },
    '様子': { meaning: 'tình hình, trạng thái, dáng vẻ', reading: 'ようす', ex: '体調を崩した友達の様子を見に、お見舞いに行ってきました。 (Tôi ghé thăm để xem tình hình sức khỏe của người bạn bị ốm.)' },
    '事件': { meaning: 'vụ án, biến cố, sự việc bất thường', reading: 'じけん', ex: '警察は目撃者の証言をもとに、昨夜起きた事件の真相を追っています。 (Cảnh sát đang lần theo lời khai nhân chứng để điều tra chân tướng vụ án đêm qua.)' },
    '運転手': { meaning: 'người lái xe, tài xế', reading: 'うんてんしゅ', ex: 'ベテランのバスの運転手さんが安全に目的地まで送り届けてくれました。 (Bác tài xế xe buýt lâu năm đã đưa chúng tôi đến đích một cách an toàn.)' },
    '手に入れます': { meaning: 'sở hữu được, có trong tay', reading: 'てにいれます', ex: 'ずっと探していた絶版の貴重な専門書をついに手に入れました。 (Cuối cùng tôi đã có được cuốn sách chuyên ngành quý hiếm đã ngừng xuất bản.)' }
  }
};

function runBatch3() {
  console.log('='.repeat(70));
  console.log('TIẾN HÀNH CHUẨN HÓA MINNA N4 BATCH 3 (BÀI 37, 38, 39, 40)');
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

  console.log(`\nHoàn tất Batch 3. Tổng số từ vựng cập nhật: ${totalUpdated}`);
}

runBatch3();

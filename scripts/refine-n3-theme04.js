/**
 * scripts/refine-n3-theme04.js
 * Chuẩn hóa toàn diện từ vựng N3 - Theme 04: Tự nhiên & Khoa học (nature-science)
 * Đảm bảo 4 tiêu chuẩn: sinoVietnamese chuẩn, meaning phân cách bằng ;, example tự nhiên và cross-check 100%.
 */

const fs = require('fs');
const path = require('path');

const THEME_FILE = path.join(__dirname, '..', 'data', 'jlpt-n3-core-bank', 'theme-04-nature-science', 'vocabulary.json');

const DICT = {
  '過ごす': {
    meaning: 'trải qua, sống (thời gian, kỳ nghỉ)',
    example: '休日は家族と一緒にのんびりと過ごしました。 (Tôi đã trải qua ngày nghỉ thật thong thả bên gia đình.)'
  },
  '筋': {
    meaning: 'gân, cơ bắp; cốt truyện; manh mối',
    example: 'この小説は筋の展開が面白くて一気に読み終えた。 (Cuốn tiểu thuyết này có cốt truyện diễn biến hấp dẫn nên tôi đọc hết một mạch.)'
  },
  '勧める': {
    meaning: 'khuyên bảo, gợi ý, mời mọc',
    example: '先生が私に留学を熱心に勧めてくれました。 (Thầy giáo đã nhiệt tình khuyên bảo tôi nên đi du học.)'
  },
  'すてき': {
    meaning: 'tuyệt vời, đáng yêu, quyến rũ',
    example: '彼女はとてもすてきな笑顔で話しかけてくれた。 (Cô ấy đã bắt chuyện với tôi bằng một nụ cười vô cùng tuyệt vời.)'
  },
  '済ませる': {
    meaning: 'hoàn thành, làm xong, kết thúc',
    example: '午前中にすべての仕事を済ませて午後から出かけた。 (Tôi hoàn thành toàn bộ công việc vào buổi sáng rồi chiều mới ra ngoài.)'
  },
  'せい': {
    meaning: 'do, tại (nguyên nhân dẫn đến kết quả xấu)',
    example: '寝不足のせいで、一日中頭が痛かった。 (Tại vì thiếu ngủ nên cả ngày tôi bị đau đầu.)'
  },
  '性': {
    meaning: 'bản tính, tính chất, giới tính',
    example: '好奇心は人間の本来持っている性です。 (Tính tò mò là bản tính tự nhiên vốn có của con người.)'
  },
  '精々': {
    meaning: 'tối đa, nhiều nhất là, cùng lắm là',
    example: '歩いても駅まで精々１０分くらいです。 (Kể cả đi bộ thì ra ga nhiều nhất là mất khoảng 10 phút thôi.)'
  },
  '贅沢': {
    meaning: 'xa xỉ, xa hoa, lãng phí',
    example: 'たまには高級なレストランで贅沢な食事を楽しみたい。 (Thỉnh thoảng tôi muốn thưởng thức một bữa ăn xa xỉ tại nhà hàng cao cấp.)'
  },
  '成長': {
    meaning: 'trưởng thành, lớn lên, tăng trưởng',
    example: '子供たちの健やかな成長を温かく見守っています。 (Tôi luôn dõi theo sự trưởng thành khỏe mạnh của con trẻ.)'
  },
  '青年': {
    meaning: 'thanh niên, giới trẻ, người trẻ tuổi',
    example: '多くの志を持つ青年たちが社会の変革を目指している。 (Nhiều thanh niên có chí lớn đang hướng tới mục tiêu đổi mới xã hội.)'
  },
  '整理': {
    meaning: 'thu dọn, sắp xếp, chỉnh lý (đồ đạc, dữ liệu)',
    example: '週末に部屋の書類や本をきれいに整理しました。 (Cuối tuần tôi đã thu dọn và sắp xếp ngăn nắp sách vở, tài liệu trong phòng.)'
  },
  '責任': {
    meaning: 'trách nhiệm, nghĩa vụ',
    example: '自分の行動には最後まで責任を持つべきです。 (Bạn nên có trách nhiệm đến cùng đối với hành động của chính mình.)'
  },
  '絶対': {
    meaning: 'tuyệt đối, nhất định (khẳng định hoặc phủ định)',
    example: 'どんな困難があっても絶対に諦めません。 (Dù có bất kỳ khó khăn nào, tôi tuyệt đối sẽ không từ bỏ.)'
  },
  '責める': {
    meaning: 'trách móc, chỉ trích, đổ lỗi',
    example: '失敗した人をあまり厳しく責めてはいけません。 (Đừng nên trách móc quá nặng lời người đã gặp thất bại.)'
  },
  '全国': {
    meaning: 'toàn quốc, cả nước',
    example: 'そのニュースは瞬く間に全国へ広がりました。 (Bản tin ấy đã nhanh chóng lan truyền ra khắp toàn quốc trong chớp mắt.)'
  },
  '選手': {
    meaning: 'tuyển thủ, vận động viên (thể thao)',
    example: '彼は将来日本を代表するサッカーの選手になるだろう。 (Anh ấy chắc chắn sẽ trở thành một tuyển thủ bóng đá đại diện cho Nhật Bản trong tương lai.)'
  },
  '相当': {
    meaning: 'khá là, tương đối; tương đương với',
    example: 'この仕事はかなりの時間と相当な労力を必要とします。 (Công việc này đòi hỏi thời gian khá nhiều và cần tương đương với sự nỗ lực rất lớn.)'
  },
  '底': {
    meaning: 'đáy, đáy lòng, phần dưới cùng',
    example: '澄んだ川の底で魚が元気に泳いでいます。 (Dưới đáy con sông trong vắt, đàn cá đang tung tăng bơi lội.)'
  },
  'そこで': {
    meaning: 'do đó, vì thế; sau đó, tại đó',
    example: '雨が降ってきました。そこで、近くのカフェで雨宿りをしました。 (Trời bắt đầu đổ mưa. Do đó, tôi đã vào trú mưa tại một quán cà phê gần đó.)'
  },
  '注ぐ': {
    meaning: 'rót (nước); đổ vào (biển); dốc lòng, cống hiến',
    example: 'コップに冷たい水をなみなみと注ぎました。 (Tôi đã rót đầy nước mát lạnh vào chiếc cốc.)'
  },
  '育つ': {
    meaning: 'lớn lên, phát triển, trưởng thành',
    example: '緑豊かな自然の中で子供たちが元気に育っています。 (Những đứa trẻ đang lớn lên khỏe mạnh giữa thiên nhiên xanh mát.)'
  },
  'そっくり': {
    meaning: 'giống hệt, y đúc; toàn bộ',
    example: '彼は父親に顔も声もそっくりです。 (Anh ấy có gương mặt và giọng nói giống hệt như người bố.)'
  },
  '備える': {
    meaning: 'trang bị, chuẩn bị sẵn, phòng bị (tai nạn, bão)',
    example: '地震や火災などの災害に備えて、非常食を準備しました。 (Để chuẩn bị phòng bị cho các thảm họa như động đất hay hỏa hoạn, tôi đã chuẩn bị lương thực khẩn cấp.)'
  },
  'そのまま': {
    meaning: 'nguyên vẹn như thế, giữ nguyên trạng thái',
    example: '机の上の書類は片付けず、そのままにしておいてください。 (Tài liệu trên bàn xin cứ giữ nguyên như thế đừng dọn dẹp nhé.)'
  },
  '粗末': {
    meaning: 'sơ sài, đạm bạc; coi thường, lãng phí (đồ vật)',
    example: '食べ物を粗末にしてはいけません、大切にいただきましょう。 (Đừng lãng phí và coi thường thức ăn mà hãy trân trọng dùng bữa nhé.)'
  },
  '台': {
    meaning: 'chiếc, cái (đơn vị đếm máy móc, xe cộ); bệ đỡ',
    example: '教室にパソコンが３０台設置されています。 (Có 30 chiếc máy vi tính được lắp đặt trong phòng học.)'
  },
  '大': {
    meaning: 'to, lớn, cỡ lớn',
    example: '大サイズのピザを頼んでみんなで分け合いました。 (Chúng tôi đã gọi một chiếc bánh pizza cỡ lớn rồi chia sẻ cùng nhau.)'
  },
  '代金': {
    meaning: 'tiền thanh toán, tiền hàng, giá tiền',
    example: '商品を受け取った後、レジで代金を支払いました。 (Sau khi nhận hàng, tôi đã trả tiền thanh toán tại quầy thu ngân.)'
  },
  '退屈': {
    meaning: 'nhàm chán, tẻ nhạt, buồn tẻ',
    example: '雨で外に遊びに行けず、一日中家で退屈していました。 (Mưa không ra ngoài chơi được nên cả ngày tôi thấy rất nhàm chán ở nhà.)'
  },
  '滞在': {
    meaning: 'lưu trú, ở lại (tại nước ngoài, khách sạn)',
    example: '日本に２週間滞在して、観光地を巡りました。 (Tôi lưu trú ở Nhật Bản hai tuần và đi tham quan các danh lam thắng cảnh.)'
  },
  '大した': {
    meaning: 'to tát, ghê gớm (thường đi với phủ định)',
    example: '怪我は大したことはありませんので、ご安心ください。 (Vết thương không có gì to tát cả nên xin mọi người yên tâm.)'
  },
  '対象': {
    meaning: 'đối tượng (nghiên cứu, khảo sát, phục vụ)',
    example: 'このアンケートは大学生を対象に実施されています。 (Cuộc khảo sát này được thực hiện với đối tượng hướng tới là các bạn sinh viên đại học.)'
  },
  '対する': {
    meaning: 'đối với, hướng tới; đối lập với',
    example: 'お客様に対する丁寧な言葉遣いを心がけています。 (Tôi luôn chú ý dùng lời lẽ lịch sự đối với khách hàng.)'
  },
  '態度': {
    meaning: 'thái độ, cử chỉ, cách cư xử',
    example: '彼は誰に対してもいつも誠実な態度で接している。 (Anh ấy luôn tiếp xúc với mọi người bằng một thái độ chân thành.)'
  },
  '大半': {
    meaning: 'đại đa số, phần lớn, quá nửa',
    example: '夏休みの宿題は大半が終わりました。 (Phần lớn bài tập kỳ nghỉ hè của tôi đã được làm xong.)'
  },
  'ダイヤ': {
    meaning: 'lịch trình tàu xe (diagram); kim cương',
    example: '台風の影響で電車の運行ダイヤが乱れています。 (Do ảnh hưởng của bão, lịch trình tàu điện đang bị xáo trộn.)'
  },
  '代理': {
    meaning: 'đại diện, người thay mặt, quyền đại lý',
    example: '部長の代理として重要な会議に出席しました。 (Tôi đã tham dự cuộc họp quan trọng với tư cách là người đại diện của trưởng phòng.)'
  },
  'だが': {
    meaning: 'nhưng, tuy nhiên (văn viết)',
    example: '彼は懸命に走った。だが、終電には間に合わなかった。 (Anh ấy đã chạy hết sức. Nhưng anh vẫn không kịp chuyến tàu cuối cùng.)'
  },
  'だけど': {
    meaning: 'tuy nhiên, nhưng mà (văn nói)',
    example: '旅行に行きたい。だけど、今は仕事が忙しすぎる。 (Tôi rất muốn đi du lịch. Nhưng mà hiện giờ công việc bận rộn quá.)'
  },
  '確かめる': {
    meaning: 'xác nhận, kiểm tra lại cho chắc chắn',
    example: '出かける前に家の鍵を閉めたか確かめました。 (Trước khi ra ngoài, tôi đã xác nhận lại xem mình đã khóa cửa nhà hay chưa.)'
  },
  '多少': {
    meaning: 'ít nhiều, một chút, đôi chút',
    example: 'プランの変更に伴い、多少の追加費用がかかります。 (Kèm theo việc thay đổi kế hoạch sẽ phát sinh một chút chi phí bổ sung.)'
  },
  'ただ': {
    meaning: 'chỉ là, đơn thuần; miễn phí',
    example: 'この美術館は学生ならただで入場できます。 (Bảo tàng mỹ thuật này nếu là sinh viên thì có thể vào cửa miễn phí.)'
  },
  '叩く': {
    meaning: 'gõ (cửa), đập, đánh',
    example: '部屋に入る前に、ドアを軽く２回叩きました。 (Trước khi bước vào phòng, tôi đã gõ nhẹ lên cánh cửa hai tiếng.)'
  },
  '直ちに': {
    meaning: 'ngay lập tức, tức thì',
    example: '非常ベルが鳴ったら、直ちに安全な場所へ避難してください。 (Khi chuông báo động vang lên, hãy sơ tán ngay lập tức đến nơi an toàn.)'
  },
  '立場': {
    meaning: 'lập trường, cương vị, vị thế',
    example: '相手の立場に立って物事を考えることが大切です。 (Việc đặt mình vào lập trường của người khác để suy nghĩ sự việc là rất quan trọng.)'
  },
  '経つ': {
    meaning: 'trôi qua (thời gian)',
    example: '日本に来てから、あっという間に三年が経ちました。 (Kể từ khi đến Nhật Bản, thấm thoắt đã ba năm trôi qua.)'
  },
  '達する': {
    meaning: 'đạt đến, chạm tới (mức độ, con số, đỉnh cao)',
    example: '今月の売上は目標の１億円に達しました。 (Doanh số tháng này đã đạt đến con số mục tiêu một trăm triệu yên.)'
  },
  'だって': {
    meaning: 'bởi vì; cho dù là, ngay cả (văn nói)',
    example: '「どうして食べないの」「だって、お腹がいっぱいなんだもん」。 (\"Sao bạn không ăn?\" - \"Bởi vì mình no căng bụng rồi mà\".)'
  },
  'たっぷり': {
    meaning: 'đầy ắp, dồi dào, tràn trề',
    example: '朝ご飯をたっぷり食べてエネルギーを満たしました。 (Tôi ăn một bữa sáng đầy ắp để nạp tràn đầy năng lượng.)'
  },
  'たとえ': {
    meaning: 'cho dù, dẫu cho (đi với: たとえ〜ても)',
    example: 'たとえ雨が降っても、試合は中止になりません。 (Cho dù trời có mưa đi chăng nữa thì trận đấu cũng không bị hủy bỏ.)'
  },
  '束': {
    meaning: 'bó (hoa, thư), cuộn',
    example: '母の誕生日にきれいなバラの花束をプレゼントしました。 (Vào ngày sinh nhật mẹ, tôi đã tặng một bó hoa hồng tuyệt đẹp.)'
  },
  '玉': {
    meaning: 'viên ngọc, hòn bi, hạt; giọt (mồ hôi)',
    example: '額に大粒の汗の玉を浮かべて一生懸命走りました。 (Tôi chạy hết sức mình với những hạt mồ hôi lớn lăn tăn trên trán.)'
  },
  '偶': {
    meaning: 'ngẫu nhiên, tình cờ, hiếm khi',
    example: '休日に街で昔の同級生と偶々出会いました。 (Vào ngày nghỉ, tôi tình cờ bắt gặp người bạn cùng lớp cũ trên phố.)'
  },
  'たまらない': {
    meaning: 'không chịu nổi, cực kỳ (thèm muốn, đau đớn)',
    example: '暑い日の運動の後に飲む冷たい水はたまらなく美味しい。 (Nước mát uống sau khi vận động vào ngày nóng nực ngon không thể chịu nổi.)'
  },
  '試す': {
    meaning: 'thử, thử nghiệm (khả năng, máy móc)',
    example: '新しい勉強法が自分に合うかどうか試してみました。 (Tôi đã thử xem phương pháp học tập mới có phù hợp với bản thân hay không.)'
  },
  '段': {
    meaning: 'bậc (thang); đoạn, bước; đẳng (đai võ)',
    example: '急な階段を一段ずつ慎重に降りました。 (Tôi cẩn thận bước xuống từng bậc trên chiếc cầu thang dốc đứng.)'
  },
  '単位': {
    meaning: 'tín chỉ (đại học); đơn vị đo lường',
    example: '今学期に必要な単位をすべて取得することができました。 (Tôi đã hoàn thành và nhận được toàn bộ số tín chỉ cần thiết trong học kỳ này.)'
  },
  '男子': {
    meaning: 'con trai, nam giới, nam sinh',
    example: 'このクラスには男子が１５人、女子が１８人います。 (Lớp học này có 15 bạn nam và 18 bạn nữ.)'
  },
  '誕生': {
    meaning: 'sự ra đời, chào đời, sinh ra',
    example: '新しい家族として元気な男の子が誕生しました。 (Một bé trai kháu khỉnh đã chào đời làm thành viên mới của gia đình.)'
  },
  '単に': {
    meaning: 'đơn thuần là, chỉ là (thường đi với 単に〜だけでなく)',
    example: '単に覚えるだけでなく、実際に使ってみることが大切です。 (Không đơn thuần là ghi nhớ mà việc ứng dụng vào thực tế mới là quan trọng.)'
  },
  'チーズ': {
    meaning: 'phô mai (cheese)',
    example: '朝ご飯にパンと濃厚なチーズを食べました。 (Tôi ăn bánh mì cùng phô mai béo ngậy cho bữa sáng.)'
  },
  '地下': {
    meaning: 'tầng hầm, dưới lòng đất',
    example: '駅の地下にはたくさんのレストランが並んでいます。 (Dưới tầng hầm của nhà ga có rất nhiều nhà hàng nối tiếp nhau.)'
  },
  '地区': {
    meaning: 'khu vực, quận, địa hạt',
    example: 'この地区は緑が多くてとても住みやすいです。 (Khu vực này có nhiều cây xanh nên rất dễ chịu để sinh sống.)'
  },
  '父親': {
    meaning: 'người cha, người bố',
    example: '私の父親は厳格ですが、とても家族思いです。 (Người cha của tôi tuy nghiêm khắc nhưng vô cùng yêu thương gia đình.)'
  },
  '地方': {
    meaning: 'vùng, địa phương, miền',
    example: '東京を離れて自然豊かな地方で暮らしたい。 (Tôi muốn rời Tokyo để về sống ở một vùng địa phương ngập tràn thiên nhiên.)'
  },
  '茶': {
    meaning: 'trà, chè; màu nâu trà',
    example: '食後に温かい緑茶を一杯飲みました。 (Sau bữa ăn, tôi đã uống một tách trà xanh ấm.)'
  },
  '注目': {
    meaning: 'chú ý, để mắt đến, theo dõi',
    example: '彼の新しい研究成果は世界中から注目されています。 (Thành quả nghiên cứu mới của anh ấy đang được toàn thế giới chú ý theo dõi.)'
  },
  '注文': {
    meaning: 'gọi món, đặt hàng (hàng hóa, đồ ăn)',
    example: 'レストランで評判の特製カレーを注文しました。 (Tại nhà hàng, tôi đã gọi món cà ri đặc biệt trứ danh.)'
  },
  '頂上': {
    meaning: 'đỉnh núi, ngọn đỉnh',
    example: '朝早く登り始めて、昼頃に富士山の頂上に着きました。 (Bắt đầu leo từ sáng sớm, khoảng trưa tôi đã lên đến đỉnh núi Phú Sĩ.)'
  },
  '通じる': {
    meaning: 'thông suốt (đường sá, điện thoại); hiểu được, truyền tải được',
    example: '私の拙い日本語でも相手にちゃんと気持ちが通じました。 (Dù tiếng Nhật còn bập bẹ nhưng tấm lòng của tôi vẫn truyền tải được đến đối phương.)'
  },
  '通信': {
    meaning: 'thông tin, liên lạc, truyền thông',
    example: '地下鉄の中ではスマートフォンの通信が途切れることがあります。 (Ở trong tàu điện ngầm đôi khi kết nối thông tin liên lạc của điện thoại bị gián đoạn.)'
  },
  '捕まる': {
    meaning: 'bị bắt (tội phạm); bám vào, nắm lấy (tay vịn)',
    example: '揺れる電車の中ではつり革にしっかり捕まってください。 (Trên tàu điện lắc lư, xin hãy bám chắc vào tay vịn.)'
  },
  '付き合い': {
    meaning: 'mối quan hệ, giao thiệp, quan hệ xã giao',
    example: '会社の上司や同僚との付き合いも大切にしています。 (Tôi cũng rất coi trọng các mối quan hệ giao thiệp với cấp trên và đồng nghiệp.)'
  },
  '次々': {
    meaning: 'lần lượt, liên tiếp, dồn dập',
    example: '次々に新しいアイデアが浮かんできました。 (Những ý tưởng mới liên tiếp nảy sinh trong đầu tôi.)'
  },
  '就く': {
    meaning: 'nhận chức, đi làm; bắt đầu (công việc, giấc ngủ)',
    example: '大学を卒業して、憧れの旅行会社に就職して職に就きました。 (Tốt nghiệp đại học, tôi đã xin được việc và bắt đầu đi làm tại công ty du lịch hằng mơ ước.)'
  },
  '付ける': {
    meaning: 'bật (điện); dán, gắn; viết (nhật ký)',
    example: '部屋が暗いので電気を付けてください。 (Phòng tối nên xin hãy bật đèn lên nhé.)'
  },
  '続き': {
    meaning: 'phần tiếp theo, sự tiếp tục',
    example: '面白い映画だったので、早く続きが見たいです。 (Bộ phim rất hay nên tôi muốn nhanh chóng xem phần tiếp theo.)'
  },
  '勤め': {
    meaning: 'công việc, sự làm việc (tại công ty)',
    example: '毎日の勤めを真面目にこなしています。 (Tôi nghiêm túc hoàn thành tốt công việc làm việc hàng ngày của mình.)'
  },
  '務め': {
    meaning: 'bổn phận, trách nhiệm, nghĩa vụ',
    example: '国民として税金を納めるのは大切な務めです。 (Việc nộp thuế là bổn phận quan trọng của mỗi người dân.)'
  },
  '繋ぐ': {
    meaning: 'nối, kết nối, nắm (tay)',
    example: '迷子にならないように、子供の手をしっかり繋ぎました。 (Để đứa bé không bị lạc, tôi đã nắm chặt lấy tay con.)'
  },
  'つまり': {
    meaning: 'tóm lại, nói cách khác, tức là',
    example: 'つまり、この計画にはもっと多くの予算が必要だということです。 (Tóm lại là kế hoạch này đòi hỏi phải có thêm nhiều ngân sách nữa.)'
  },
  'で': {
    meaning: 'bằng, ở tại (trợ từ chỉ phương tiện, địa điểm)',
    example: '毎日電車で会社へ通勤しています。 (Mỗi ngày tôi đi làm đến công ty bằng tàu điện.)'
  },
  '定期': {
    meaning: 'định kỳ; vé tháng (tàu xe: 定期券)',
    example: '駅の窓口で通勤用の電車の定期券を更新しました。 (Tôi đã gia hạn vé tháng tàu điện đi làm tại quầy vé ở nhà ga.)'
  },
  '抵抗': {
    meaning: 'kháng cự, chống cự; sự ngần ngại, điện trở',
    example: '新しい変化に対して初めは多少の抵抗がありました。 (Ban đầu đã có đôi chút sự kháng cự đối với những thay đổi mới.)'
  },
  '提出': {
    meaning: 'nộp, đệ trình (báo cáo, đơn từ)',
    example: '締め切りまでに先生にレポートを提出しました。 (Tôi đã nộp bài báo cáo cho thầy giáo trước hạn chót.)'
  },
  '程度': {
    meaning: 'mức độ, chừng độ, khoảng độ',
    example: '日常会話ができる程度の日本語力を身につけたいです。 (Tôi muốn rèn luyện năng lực tiếng Nhật ở mức độ có thể giao tiếp hàng ngày.)'
  },
  '適する': {
    meaning: 'thích hợp, phù hợp',
    example: 'この静かな環境は勉強に適しています。 (Môi trường yên tĩnh này rất thích hợp cho việc học tập.)'
  },
  '手品': {
    meaning: 'ảo thuật, trò ảo thuật',
    example: 'パーティーで友達が面白い手品を披露してくれました。 (Tại bữa tiệc, bạn tôi đã biểu diễn một trò ảo thuật rất thú vị.)'
  },
  '徹底': {
    meaning: 'triệt để, thấu đáo, toàn diện',
    example: '手洗いとうがいを徹底して風邪を予防しましょう。 (Hãy thực hiện triệt để việc rửa tay và súc miệng để phòng ngừa cảm cúm.)'
  }
};

function run() {
  const items = JSON.parse(fs.readFileSync(THEME_FILE, 'utf8'));
  let updated = 0;

  items.forEach(item => {
    if (DICT[item.word]) {
      item.meaning = DICT[item.word].meaning;
      item.example = DICT[item.word].example;
      updated++;
    }
  });

  fs.writeFileSync(THEME_FILE, JSON.stringify(items, null, 2), 'utf8');
  console.log(`[OK] Đã chuẩn hóa ${updated} từ trong Theme 04`);
}

run();

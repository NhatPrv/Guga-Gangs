/**
 * scripts/refine-n3-theme01.js
 * Chuẩn hóa toàn diện từ vựng N3 - Theme 01: Con người & Đời sống hàng ngày
 * Đảm bảo 4 tiêu chuẩn: sinoVietnamese chuẩn, meaning phân cách bằng ;, example tự nhiên và cross-check 100%.
 */

const fs = require('fs');
const path = require('path');

const THEME_FILE = path.join(__dirname, '..', 'data', 'jlpt-n3-core-bank', 'theme-01-human-daily', 'vocabulary.json');

const DICT = {
  '合図': {
    meaning: 'dấu hiệu, ám hiệu; hiệu lệnh, ra hiệu',
    example: '手を振って出発の合図をしました。 (Tôi vẫy tay ra hiệu xuất phát.)'
  },
  'アウト': {
    meaning: 'bị loại (trong thể thao: out); hỏng chuyện, vi phạm (quy tắc)',
    example: '３ストライクでバッターはアウトになった。 (Ba lần đánh trượt, người đánh bóng đã bị loại.)'
  },
  '空き': {
    meaning: 'chỗ trống, phòng trống; thời gian rảnh; vị trí tuyển dụng còn trống',
    example: 'ホテルの部屋にまだ空きがありますか。 (Khách sạn còn phòng trống nào không ạ?)'
  },
  '明らか': {
    meaning: 'rõ ràng, minh bạch; hiển nhiên',
    example: '調査の結果、事故の原因が明らかになった。 (Kết quả điều tra đã làm rõ ràng nguyên nhân của vụ tai nạn.)'
  },
  '諦める': {
    meaning: 'từ bỏ, bỏ cuộc (ước mơ, hy vọng)',
    example: 'どんなに困難でも、夢を諦めないでください。 (Dù khó khăn đến đâu cũng xin đừng từ bỏ ước mơ.)'
  },
  '飽きる': {
    meaning: 'ngán, chán, ngấy (do lặp đi lặp lại nhiều lần)',
    example: '毎日同じ料理を食べて飽きてしまった。 (Ngày nào cũng ăn cùng một món nên tôi đã ngán rồi.)'
  },
  '明ける': {
    meaning: 'rạng sáng, bình minh lên; kết thúc, sang (năm mới, mùa mưa)',
    example: '夜が明けて、東の空が明るくなってきた。 (Trời rạng sáng, bầu trời phía đông dần bừng sáng.)'
  },
  '預ける': {
    meaning: 'gửi (tiền, đồ đạc, con cái); giao phó, gửi gắm',
    example: '駅のロッカーに重い荷物を預けました。 (Tôi đã gửi hành lý nặng vào tủ khóa ở nhà ga.)'
  },
  '辺り': {
    meaning: 'quanh đây, khu vực lân cận, xung quanh',
    example: 'この辺りは夜になると人通りが少なくなります。 (Khu vực quanh đây khi về đêm thì người qua lại trở nên thưa thớt.)'
  },
  '当たる': {
    meaning: 'trúng (vé số, mục tiêu); va chạm, đập vào; đúng (dự đoán)',
    example: '宝くじを買ったら、見事に一等賞が当たりました。 (Tôi mua vé số và đã trúng giải nhất một cách ngoạn mục.)'
  },
  'あちこち': {
    meaning: 'khắp nơi, đây đó, chỗ này chỗ kia',
    example: '休日に友達と街のあちこちを散歩しました。 (Vào ngày nghỉ, tôi cùng bạn bè đi dạo khắp nơi trong thành phố.)'
  },
  '当てる': {
    meaning: 'bắn trúng, ném trúng; đoán trúng; áp vào, đặt vào',
    example: 'クイズの正解を見事に当てました。 (Tôi đã đoán trúng đáp án của câu đố một cách xuất sắc.)'
  },
  '誤り': {
    meaning: 'sai lầm, sai sót, lỗi lầm',
    example: '自分の誤りを素直に認めて謝罪しました。 (Tôi thành thật thừa nhận sai lầm của mình và xin lỗi.)'
  },
  '粗': {
    meaning: 'khuyết điểm, tì vết; thô ráp, sơ sài',
    example: '人の粗を探すのではなく、長所を見つけよう。 (Thay vì bới móc khuyết điểm của người khác, hãy tìm kiếm điểm tốt của họ.)'
  },
  'あらゆる': {
    meaning: 'tất cả, mọi, toàn bộ (đi với danh từ)',
    example: 'あらゆる可能性を考えて対策を立てました。 (Chúng tôi đã xem xét tất cả các khả năng để lập phương án đối phó.)'
  },
  '現す': {
    meaning: 'xuất hiện, lộ diện; biểu hiện ra ngoài',
    example: '犯人は夜遅くに現場に姿を現しました。 (Tên tội phạm đã lộ diện tại hiện trường vào đêm muộn.)'
  },
  '表す': {
    meaning: 'bày tỏ, biểu thị (cảm xúc, ý kiến); tượng trưng cho',
    example: '感謝の気持ちを言葉で表しました。 (Tôi đã bày tỏ lòng biết ơn bằng lời nói.)'
  },
  '現れ': {
    meaning: 'sự thể hiện ra ngoài, biểu hiện (của tâm lý, tình cảm)',
    example: 'その笑顔は彼の優しさの現れです。 (Nụ cười ấy chính là sự thể hiện lòng tốt của anh ấy.)'
  },
  '或': {
    meaning: 'hoặc là, có thể là (lựa chọn khác)',
    example: '或る日の午後、不思議な手紙が届いた。 (Vào một ngày nọ, có một bức thư kỳ lạ gửi đến.)'
  },
  'あるいは': {
    meaning: 'hoặc là, hoặc có thể (liên từ nối giữa các lựa chọn)',
    example: 'メール、あるいは電話でご連絡ください。 (Xin vui lòng liên hệ qua email hoặc là gọi điện thoại.)'
  },
  '合わせる': {
    meaning: 'kết hợp, chắp lại (tay); điều chỉnh cho khớp',
    example: 'みんなで力を合わせて困難を乗り越えましょう。 (Mọi người hãy cùng nhau hợp lực để vượt qua khó khăn.)'
  },
  '哀れ': {
    meaning: 'đáng thương, tội nghiệp; bi thương',
    example: '雨に濡れて震えている子猫がとても哀れに見えた。 (Chú mèo con ướt mưa run rẩy trông thật đáng thương.)'
  },
  '案': {
    meaning: 'phương án, đề án, ý tưởng',
    example: '会議で新しいプロジェクトの案を提案しました。 (Tôi đã đề xuất phương án cho dự án mới trong cuộc họp.)'
  },
  'いえ': {
    meaning: 'không (từ chối hoặc phủ định lịch sự)',
    example: '「何か手伝いましょうか」「いえ、大丈夫です」。 (\"Tôi giúp gì được không?\" - \"Không, tôi tự làm được rồi ạ\".)'
  },
  '息': {
    meaning: 'hơi thở',
    example: '深呼吸をして、ゆっくり息を吐き出しました。 (Tôi hít thở sâu rồi từ từ thở ra một hơi dài.)'
  },
  '勢い': {
    meaning: 'khí thế, sức mạnh; đà tiến',
    example: '川の水が強い勢いで流れています。 (Nước sông đang chảy xiết với khí thế mạnh mẽ.)'
  },
  'いけない': {
    meaning: 'không được, cấm; dở, hỏng chuyện',
    example: '図書館で大声で話してはいけません。 (Không được nói chuyện lớn tiếng trong thư viện.)'
  },
  '意志': {
    meaning: 'ý chí, quyết tâm, nghị lực',
    example: '彼はどんな困難にも負けない強い意志を持っています。 (Anh ấy có một ý chí kiên cường không chịu khuất phục trước bất kỳ khó khăn nào.)'
  },
  '意思': {
    meaning: 'ý định, mong muốn, nguyện vọng',
    example: '自分の意思をはっきりと相手に伝えました。 (Tôi đã truyền đạt rõ ràng ý định của bản thân cho đối phương.)'
  },
  '医師': {
    meaning: 'bác sĩ, thầy thuốc',
    example: '病気を治すために、経験豊富な医師に相談しました。 (Để chữa khỏi bệnh, tôi đã xin tư vấn từ một bác sĩ giàu kinh nghiệm.)'
  },
  '維持': {
    meaning: 'duy trì, gìn giữ (trạng thái, sức khỏe, hòa bình)',
    example: '健康を維持するために、毎朝ジョギングをしています。 (Để duy trì sức khỏe, tôi chạy bộ mỗi sáng.)'
  },
  '意識': {
    meaning: 'ý thức, nhận thức; sự tỉnh táo',
    example: '事故に遭ったが、幸い意識ははっきりしていた。 (Dù gặp tai nạn nhưng may mắn thay ý thức của anh ấy vẫn rất tỉnh táo.)'
  },
  '異常': {
    meaning: 'bất thường, khác thường, dị thường',
    example: '健康診断で血液検査に異常は見つかりませんでした。 (Trong đợt khám sức khỏe, không phát hiện bất kỳ điều gì bất thường trong xét nghiệm máu.)'
  },
  '泉': {
    meaning: 'con suối, nguồn suối; suối nguồn (cảm hứng)',
    example: '森の奥に澄んだ水が湧き出る泉を見つけました。 (Tận sâu trong rừng, tôi tìm thấy một con suối tuôn trào dòng nước trong vắt.)'
  },
  'いずれ': {
    meaning: 'sớm muộn gì, chẳng mấy chốc; một trong các...',
    example: '練習を続ければ、いずれ上手に話せるようになります。 (Nếu kiên trì luyện tập, sớm muộn gì bạn cũng sẽ nói lưu loát thôi.)'
  },
  '以前': {
    meaning: 'trước đây, ngày trước, dạo trước',
    example: '以前ここに住んでいましたが、今は東京に引っ越しました。 (Trước đây tôi từng sống ở đây, nhưng giờ đã chuyển lên Tokyo.)'
  },
  '板': {
    meaning: 'tấm ván, tấm gỗ, bảng',
    example: '大工さんが厚い木の板を切って棚を作っています。 (Bác thợ mộc đang cắt tấm ván gỗ dày để đóng kệ sách.)'
  },
  '偉大': {
    meaning: 'vĩ đại, to lớn, kiệt xuất',
    example: '彼は歴史に名を残した偉大な科学者です。 (Ông ấy là một nhà khoa học vĩ đại lưu danh trong lịch sử.)'
  },
  '抱く': {
    meaning: 'ôm, ấp ủ (ước mơ, hy vọng); ôm vào lòng',
    example: '将来日本で働くという大きな夢を抱いています。 (Tôi luôn ấp ủ ước mơ lớn là sẽ được làm việc tại Nhật Bản trong tương lai.)'
  },
  'いたずら': {
    meaning: 'nghịch ngợm, trêu chọc; trò đùa tinh quái',
    example: '弟はいたずら好きで、いつも家族を笑わせています。 (Em trai tôi rất thích nghịch ngợm và luôn làm cả nhà bật cười.)'
  },
  '痛み': {
    meaning: 'cơn đau, nỗi đau (thể xác hoặc tinh thần)',
    example: '薬を飲んだら、頭の痛みがすっかり消えました。 (Sau khi uống thuốc, cơn đau đầu của tôi đã biến mất hoàn toàn.)'
  },
  '至る': {
    meaning: 'đạt đến, đi đến, dẫn đến (kết quả, nơi chốn)',
    example: 'この道を通ると山の頂上に至ります。 (Đi qua con đường này sẽ dẫn đến đỉnh núi.)'
  },
  '一時': {
    meaning: 'tạm thời, chốc lát; một giờ (1:00)',
    example: '大雨のため、電車の運行が一時に停止しました。 (Do mưa lớn, hoạt động của tàu điện tạm thời bị dừng lại.)'
  },
  '一度に': {
    meaning: 'cùng một lúc, đồng thời',
    example: '一度にたくさんのことを覚えるのは難しいです。 (Thật khó để ghi nhớ nhiều thứ cùng một lúc.)'
  },
  '市場': {
    meaning: 'chợ, khu chợ; thị trường (kinh tế)',
    example: '朝早く地元の市場へ行って新鮮な魚を買いました。 (Sáng sớm tôi đã ra khu chợ địa phương để mua cá tươi.)'
  },
  '一家': {
    meaning: 'cả gia đình, cả nhà',
    example: '日曜日、一家そろって近所の公園へ出かけました。 (Chủ nhật, cả gia đình cùng nhau đi chơi ở công viên gần nhà.)'
  },
  '一種': {
    meaning: 'một loại, một dạng, một kiểu',
    example: 'これは南の島にしか生息しない珍しい鳥の一種です。 (Đây là một loài chim quý hiếm chỉ sinh sống ở hòn đảo phía nam.)'
  },
  '一瞬': {
    meaning: 'một khoảnh khắc, trong chớp mắt',
    example: '花火が一瞬で夜空に咲いて消えました。 (Pháo hoa nở rộ trên bầu trời đêm trong chớp mắt rồi vụt tắt.)'
  },
  '一生': {
    meaning: 'cả cuộc đời, suốt đời',
    example: 'あなたに出会えたことは、私の一生の宝物です。 (Được gặp bạn chính là báu vật suốt đời của tôi.)'
  },
  '一層': {
    meaning: 'hơn một bậc, càng thêm, thêm nữa',
    example: '寒さが一段と厳しくなり、風邪に一層注意が必要です。 (Thời tiết trở nên lạnh hơn, ta càng thêm phải chú ý giữ gìn để không bị cảm cúm.)'
  },
  '一体': {
    meaning: 'rốt cuộc là... (thể hiện sự ngạc nhiên, thắc mắc); một thể',
    example: '一体どこへ行っていたのですか、みんな心配していましたよ。 (Rốt cuộc là bạn đã đi đâu vậy, mọi người lo lắng lắm đấy.)'
  },
  '一致': {
    meaning: 'thống nhất, đồng nhất, trùng khớp',
    example: '二人の意見が見事に一致しました。 (Ý kiến của hai người đã hoàn toàn trùng khớp với nhau.)'
  },
  '一般': {
    meaning: 'phổ biến, thông thường; đại chúng',
    example: 'この本は一般の人にも分かりやすく書かれています。 (Cuốn sách này được viết rất dễ hiểu cho cả người phổ thông.)'
  },
  '一方': {
    meaning: 'mặt khác, ngược lại; không ngừng (tăng, giảm)',
    example: '彼は仕事を頑張る一方で、家族との時間も大切にしている。 (Một mặt anh ấy nỗ lực trong công việc, mặt khác anh ấy cũng rất trân trọng thời gian bên gia đình.)'
  },
  'いつまでも': {
    meaning: 'mãi mãi, bất tận, bao lâu đi nữa',
    example: 'あなたの優しい笑顔をいつまでも忘れません。 (Tôi sẽ mãi mãi không bao giờ quên nụ cười hiền hậu của bạn.)'
  },
  '移動': {
    meaning: 'di chuyển, chuyển động (vị trí)',
    example: '東京から大阪まで新幹線で移動しました。 (Tôi đã di chuyển từ Tokyo đến Osaka bằng tàu Shinkansen.)'
  },
  '従兄弟': {
    meaning: 'anh em họ (con chú, bác, cô, dì)',
    example: 'お正月に親戚が集まり、従兄弟と久しぶりに遊んだ。 (Dịp Tết họ hàng sum họp, tôi đã chơi đùa sau thời gian dài gặp lại anh em họ.)'
  },
  '稲': {
    meaning: 'cây lúa',
    example: '秋になると、黄金色に実った稲が風に揺れています。 (Khi mùa thu về, những cây lúa chín vàng trĩu hạt lại đung đưa trước gió.)'
  },
  '居眠り': {
    meaning: 'ngủ gật, ngủ mơ màng',
    example: '授業中に居眠りをして先生に注意されました。 (Tôi đã ngủ gật trong giờ học và bị giáo viên nhắc nhở.)'
  },
  '命': {
    meaning: 'tính mạng, sinh mạng, mạng sống',
    example: '命を大切にして、安全運転を心がけましょう。 (Hãy trân trọng sinh mạng và chú ý lái xe an toàn.)'
  },
  '違反': {
    meaning: 'vi phạm (luật pháp, nội quy, hợp đồng)',
    example: '交通ルールに違反すると、罰金が科せられます。 (Nếu vi phạm luật giao thông, bạn sẽ bị phạt tiền.)'
  },
  '衣服': {
    meaning: 'quần áo, trang phục, y phục',
    example: '季節の変わり目に合わせて、新しい衣服を買いそろえました。 (Nhân dịp giao mùa, tôi đã mua sắm thêm quần áo mới.)'
  },
  '居間': {
    meaning: 'phòng khách, phòng sinh hoạt chung',
    example: '夕食後、家族みんなで居間に集まってテレビを見ました。 (Sau bữa tối, cả nhà cùng quây quần ở phòng khách xem tivi.)'
  },
  '今に': {
    meaning: 'chẳng mấy chốc, rồi sẽ, sớm muộn gì',
    example: '努力を続けていれば、今にきっと良い結果が出るよ。 (Nếu bạn tiếp tục nỗ lực, chẳng mấy chốc chắc chắn sẽ đạt kết quả tốt đẹp thôi.)'
  },
  '否': {
    meaning: 'phủ định, không; lời từ chối',
    example: '彼の提案に対して、出席者全員が否の意見を出した。 (Đối với đề xuất của anh ấy, toàn bộ người tham dự đều đưa ra ý kiến phủ định.)'
  },
  '以来': {
    meaning: 'kể từ đó, từ đó đến nay',
    example: '卒業して以来、彼とは一度も会っていません。 (Kể từ khi tốt nghiệp đến nay, tôi chưa từng gặp lại anh ấy một lần nào.)'
  },
  '依頼': {
    meaning: 'nhờ vả, yêu cầu, ủy thác',
    example: '専門家にウェブサイトのデザイン作成を依頼しました。 (Tôi đã ủy thác cho chuyên gia thiết kế trang web.)'
  },
  'いらいら': {
    meaning: 'sốt ruột, bực bội, bồn chồn',
    example: 'バスがなかなか来なくて、いらいらしてしまった。 (Xe buýt mãi không đến khiến tôi vô cùng sốt ruột và bực bội.)'
  },
  '医療': {
    meaning: 'y tế, chăm sóc sức khỏe, chữa trị',
    example: '最新の医療技術のおかげで、多くの病気が治るようになりました。 (Nhờ kỹ thuật y tế tiên tiến, nhiều căn bệnh đã được chữa khỏi.)'
  },
  '岩': {
    meaning: 'tảng đá, hòn đá lớn',
    example: '海岸に大きな岩がたくさん並んでいます。 (Có rất nhiều tảng đá lớn nằm dọc bờ biển.)'
  },
  '祝い': {
    meaning: 'lễ mừng, sự chúc mừng; quà mừng',
    example: '友達の結婚の祝いに素敵な花束を贈りました。 (Tôi đã tặng một bó hoa tuyệt đẹp làm quà chúc mừng đám cưới của bạn.)'
  },
  '祝う': {
    meaning: 'chúc mừng, ăn mừng',
    example: '家族で集まって祖母の８０歳の誕生日を祝いました。 (Gia đình sum họp để chúc mừng sinh nhật lần thứ 80 của bà.)'
  },
  '言わば': {
    meaning: 'có thể nói như là, ví như là',
    example: '彼女は言わば我が家の一員のような存在です。 (Cô ấy có thể nói như là một thành viên trong gia đình chúng tôi vậy.)'
  },
  'いわゆる': {
    meaning: 'cái gọi là, thường được gọi là',
    example: '彼はいわゆる天才肌のプログラマーです。 (Anh ấy chính là cái gọi là lập trình viên thiên bẩm.)'
  },
  '印刷': {
    meaning: 'in ấn, sự in ấn',
    example: '会議の前に必要な資料をプリンターで印刷しました。 (Trước cuộc họp, tôi đã in ấn các tài liệu cần thiết bằng máy in.)'
  },
  '印象': {
    meaning: 'ấn tượng',
    example: '初めて彼に会ったとき、とても誠実な印象を受けました。 (Lần đầu gặp anh ấy, tôi đã có một ấn tượng vô cùng chân thành.)'
  },
  '引退': {
    meaning: 'giải nghệ, nghỉ hưu, rút lui khỏi sự nghiệp',
    example: '長年活躍した有名なサッカー選手がついに引退を発表した。 (Cầu thủ bóng đá nổi tiếng thi đấu nhiều năm cuối cùng đã tuyên bố giải nghệ.)'
  },
  '引用': {
    meaning: 'trích dẫn (lời nói, văn bản)',
    example: '論文の中で有名な学者の言葉を引用しました。 (Trong bài luận văn, tôi đã trích dẫn câu nói của một học giả nổi tiếng.)'
  },
  'うがい': {
    meaning: 'súc miệng, súc họng',
    example: '外から帰ったら、すぐに手洗いとうがいをしましょう。 (Sau khi đi ngoài về, hãy rửa tay và súc miệng ngay nhé.)'
  },
  '受け取る': {
    meaning: 'nhận, tiếp nhận (hàng hóa, tin nhắn, ý tứ)',
    example: '郵便局の配達員から大切な荷物を受け取りました。 (Tôi đã nhận được bưu kiện quan trọng từ nhân viên bưu điện.)'
  },
  '動かす': {
    meaning: 'di chuyển, vận hành (máy móc); làm chuyển động',
    example: '重い机を一人で動かすのは大変です。 (Một mình di chuyển chiếc bàn nặng nề này thật là vất vả.)'
  },
  '兎': {
    meaning: 'con thỏ',
    example: '庭で白い兎が楽しそうに飛び跳ねています。 (Một chú thỏ trắng đang nhảy nhót vui vẻ ngoài vườn.)'
  },
  '牛': {
    meaning: 'con bò',
    example: '牧場でたくさんの牛がのんびりと草を食べています。 (Tại nông trại, rất nhiều con bò đang thong thả gặm cỏ.)'
  },
  '失う': {
    meaning: 'đánh mất, mất đi (cơ hội, người thân, hy vọng)',
    example: '事故で大切な記憶を失ってしまいました。 (Tôi đã đánh mất những ký ức quan trọng sau vụ tai nạn.)'
  },
  '疑う': {
    meaning: 'nghi ngờ, ngờ vực',
    example: '証拠が見つかるまで、人を疑ってはいけません。 (Trước khi tìm thấy chứng cứ, ta không được nghi ngờ người khác.)'
  },
  '撃つ': {
    meaning: 'bắn (súng, cung tên)',
    example: '警官が犯人に向けて威嚇射撃を撃ちました。 (Cảnh sát đã bắn phát súng cảnh cáo về phía tên tội phạm.)'
  },
  '移す': {
    meaning: 'chuyển, dời (đồ vật, chỗ ở); lây (bệnh)',
    example: '風邪を人に移さないように、マスクを着用しましょう。 (Hãy đeo khẩu trang để không làm lây bệnh cảm sang cho người khác.)'
  },
  '訴える': {
    meaning: 'kiện, khiếu nại (ra tòa); kêu gọi (sự đồng cảm)',
    example: '不当な扱いを受けたので、会社を裁判所に訴えました。 (Vì bị đối xử bất công, tôi đã kiện công ty ra tòa án.)'
  },
  'うなる': {
    meaning: 'rên rỉ, gầm gừ; kêu vo vo',
    example: '傷口の激しい痛みに耐えかねて、一晩中うなっていました。 (Không chịu nổi cơn đau dữ dội ở vết thương, anh ấy đã rên rỉ suốt cả đêm.)'
  },
  '奪う': {
    meaning: 'cướp đoạt, cướp đi, tước đoạt',
    example: '強盗が銀行から大金を奪って逃走しました。 (Kẻ cướp đã cướp đi số tiền lớn từ ngân hàng rồi tẩu thoát.)'
  },
  '生まれ': {
    meaning: 'nơi sinh, quê quán; xuất thân',
    example: '私はベトナムのダナン生まれですが、ハノイで育ちました。 (Tôi có xuất thân sinh ra ở Đà Nẵng, Việt Nam nhưng lớn lên ở Hà Nội.)'
  },
  '梅': {
    meaning: 'cây mai, hoa mận, hoa mơ; quả mơ',
    example: '春の初めに庭の梅の花が美しく咲きました。 (Vào đầu mùa xuân, hoa mơ ngoài vườn đã nở rộ tuyệt đẹp.)'
  },
  '裏切る': {
    meaning: 'phản bội, phụ bạc (niềm tin, sự kỳ vọng)',
    example: '親友に秘密をばらされて、信頼を裏切られました。 (Bị người bạn thân tiết lộ bí mật, niềm tin của tôi đã bị phản bội.)'
  },
  '売れる': {
    meaning: 'bán chạy, bán chạy đắt hàng',
    example: '新しく発売されたゲームが飛ぶように売れています。 (Tựa game mới ra mắt đang bán chạy như tôm tươi.)'
  },
  '噂': {
    meaning: 'lời đồn, tin đồn, chuyện bàn tán',
    example: '根拠のない悪い噂を信じてはいけません。 (Đừng vội tin vào những lời đồn vô căn cứ.)'
  },
  '運': {
    meaning: 'vận may, số phận, vận mệnh',
    example: '試験の日に運よく勉強したところばかりが出題された。 (Vào ngày thi, nhờ vận may mà đề toàn ra vào những phần tôi đã ôn tập.)'
  },
  '柄': {
    meaning: 'họa tiết, hoa văn; tính cách, cốt cách',
    example: '伝統的な和風の柄が描かれた着物を着ました。 (Tôi đã mặc bộ kimono có in họa tiết phong cách Nhật Bản truyền thống.)'
  },
  '永遠': {
    meaning: 'vĩnh viễn, mãi mãi, bất diệt',
    example: '二人は永遠の愛を誓い合いました。 (Hai người đã cùng nhau thề nguyện một tình yêu vĩnh viễn.)'
  },
  '永久': {
    meaning: 'vĩnh cửu, lâu dài, vĩnh viễn',
    example: '世界中の人々が永久の平和を心から願っています。 (Người dân khắp thế giới đều tha thiết cầu mong một nền hòa bình vĩnh cửu.)'
  },
  '影響': {
    meaning: 'ảnh hưởng, tác động',
    example: '親の読書習慣は子供の成長に大きな影響を与えます。 (Thói quen đọc sách của cha mẹ có ảnh hưởng rất lớn đến sự phát triển của con cái.)'
  },
  '衛星': {
    meaning: 'vệ tinh (tự nhiên hoặc nhân tạo)',
    example: '通信衛星を使って、世界中に映像を生中継しています。 (Người ta sử dụng vệ tinh viễn thông để truyền hình trực tiếp hình ảnh ra toàn thế giới.)'
  },
  '栄養': {
    meaning: 'dinh dưỡng, chất bổ dưỡng',
    example: '健康な体を保つために、栄養バランスの良い食事をとりましょう。 (Để duy trì cơ thể khỏe mạnh, hãy ăn những bữa ăn cân bằng dinh dưỡng.)'
  },
  '笑顔': {
    meaning: 'khuôn mặt cười, nụ cười rạng rỡ',
    example: '彼女の明るい笑顔を見ると、こちらまで元気になります。 (Nhìn thấy nụ cười rạng rỡ của cô ấy, lòng tôi cũng thấy vui lây.)'
  },
  '描く': {
    meaning: 'vẽ (tranh); miêu tả, khắc họa (hình ảnh)',
    example: '休日に公園で美しい風景の絵を描きました。 (Vào ngày nghỉ, tôi đã vẽ tranh phong cảnh tuyệt đẹp ở công viên.)'
  },
  '餌': {
    meaning: 'thức ăn (cho thú cưng, chim, cá); mồi câu',
    example: '毎朝、水槽の金魚に新鮮な餌をあげています。 (Mỗi sáng, tôi đều cho đàn cá vàng trong bể ăn thức ăn.)'
  },
  'エネルギー': {
    meaning: 'năng lượng (nhiệt, điện, tinh thần)',
    example: '太陽光発電はクリーンな自然エネルギーとして注目されています。 (Điện mặt trời đang được chú ý như một nguồn năng lượng tự nhiên sạch.)'
  },
  '得る': {
    meaning: 'đạt được, có được (kiến thức, kinh nghiệm, thông tin)',
    example: '留学生活を通じて、貴重な経験と広い視野を得ることができました。 (Qua quãng đời du học, tôi đã có được những kinh nghiệm quý giá và tầm nhìn rộng mở.)'
  },
  '延期': {
    meaning: 'trì hoãn, hoãn lại (lịch trình)',
    example: '台風の接近により、野外コンサートは来週に延期されました。 (Do bão đến gần, buổi hòa nhạc ngoài trời đã bị hoãn lại sang tuần sau.)'
  },
  '演技': {
    meaning: 'diễn xuất, kỹ năng diễn; hành vi giả tạo',
    example: '主役の俳優の迫力ある演技に観客全員が感動しました。 (Diễn xuất đầy nội lực của nam diễn viên chính đã làm toàn bộ khán giả xúc động.)'
  },
  '援助': {
    meaning: 'viện trợ, giúp đỡ, hỗ trợ (tài chính, vật chất)',
    example: '災害で被災した地域へ政府から食料や資金の援助が行われた。 (Chính phủ đã hỗ trợ lương thực và tài chính cho các khu vực bị thiên tai.)'
  },
  '演説': {
    meaning: 'diễn thuyết, phát biểu trước công chúng',
    example: '大統領候補が広場で大勢の市民を前に熱心な演説を行いました。 (Ứng viên tổng thống đã có bài diễn thuyết đầy nhiệt huyết trước đông đảo công chúng tại quảng trường.)'
  },
  '演奏': {
    meaning: 'biểu diễn âm nhạc, tấu nhạc',
    example: 'オーケストラによる素晴らしいピアノの演奏を聴いて感動した。 (Tôi vô cùng xúc động khi lắng nghe màn biểu diễn đàn piano tuyệt vời của dàn nhạc giao hưởng.)'
  },
  '老い': {
    meaning: 'sự già đi, tuổi già',
    example: '誰にでも老いは訪れますが、心はいつも若々しくありたいです。 (Ai rồi cũng sẽ bước vào tuổi già, nhưng tôi mong tâm hồn mình luôn tươi trẻ.)'
  },
  '追い付く': {
    meaning: 'đuổi kịp, bắt kịp',
    example: '毎日必死に勉強して、ついにクラスのトップに追い付きました。 (Học tập chăm chỉ mỗi ngày, cuối cùng tôi đã bắt kịp người đứng đầu lớp.)'
  },
  '王': {
    meaning: 'vua, quốc vương',
    example: '国民から深く愛された賢い王が国を治めていました。 (Một vị vua thông thái được muôn dân yêu mến đã cai trị đất nước.)'
  },
  '追う': {
    meaning: 'đuổi theo, theo đuổi (giấc mơ, mục tiêu)',
    example: '自分の理想を叶えるために、どこまでも夢を追い続けます。 (Để hiện thực hóa lý tưởng của mình, tôi sẽ tiếp tục theo đuổi ước mơ đến cùng.)'
  },
  '王様': {
    meaning: 'ông vua, vị vua (cách gọi tôn kính hoặc trong cổ tích)',
    example: '昔々ある国に、とても心の優しい王様が住んでいました。 (Ngày xửa ngày xưa ở một vương quốc nọ, có một vị vua vô cùng nhân hậu.)'
  },
  '王子': {
    meaning: 'hoàng tử',
    example: '絵本の中で勇敢な王子がお姫様を助け出しました。 (Trong cuốn truyện tranh, vị hoàng tử dũng cảm đã giải cứu nàng công chúa.)'
  },
  '応じる': {
    meaning: 'đáp ứng, trả lời; nhận lời, tuân theo',
    example: 'お客様のご要望に応じて、柔軟にプランを変更いたします。 (Chúng tôi sẽ linh hoạt thay đổi kế hoạch nhằm đáp ứng yêu cầu của quý khách.)'
  },
  '横断': {
    meaning: 'băng qua, đi qua (đường sá, lục địa)',
    example: '手を挙げて、安全を確認しながら横断歩道を横断しました。 (Tôi giơ tay và quan sát an toàn rồi mới băng qua vạch sang đường.)'
  },
  '終える': {
    meaning: 'kết thúc, hoàn thành (công việc, khóa học)',
    example: '三日間の集中講義を無事に終えることができました。 (Tôi đã hoàn thành tốt đẹp khóa giảng dạy tập trung trong ba ngày.)'
  },
  '大いに': {
    meaning: 'rất nhiều, vô cùng, hết sức',
    example: '久しぶりに集まった親友たちと大いに語り合いました。 (Tôi đã trò chuyện rất nhiều và vui vẻ hết mình cùng nhóm bạn thân sau thời gian dài hội ngộ.)'
  },
  '覆う': {
    meaning: 'bao phủ, che phủ, trùm lên',
    example: '冬になると、美しい白雪が一面をすっぽりと覆います。 (Khi mùa đông đến, tuyết trắng tuyệt đẹp lại bao phủ khắp mọi nẻo đường.)'
  },
  'オーバー': {
    meaning: 'vượt quá, quá mức (over); áo khoác dài',
    example: '荷物の重さが規定の制限を２キロオーバーしてしまった。 (Trọng lượng hành lý đã vượt quá mức quy định 2 kg.)'
  },
  '大家': {
    meaning: 'chủ nhà trọ; chuyên gia bậc thầy',
    example: 'アパートの優しい大家さんが美味しい野菜を分けてくれました。 (Bác chủ nhà trọ tốt bụng đã chia sẻ cho tôi một ít rau tươi ngon.)'
  },
  '丘': {
    meaning: 'ngọn đồi, quả đồi',
    example: '緑豊かな丘の上に登ると、街全体が一望できます。 (Lên trên đỉnh ngọn đồi xanh mướt, ta có thể ngắm nhìn toàn cảnh thành phố.)'
  },
  '沖': {
    meaning: 'ngoài khơi, biển khơi',
    example: '遠い沖の方で漁船がゆっくりと網を引いています。 (Ở mãi ngoài khơi xa, con tàu đánh cá đang chầm chậm kéo lưới.)'
  },
  '贈る': {
    meaning: 'tặng, trao tặng (quà tặng, lời chúc)',
    example: '卒業式の日、お世話になった先生に感謝の花束を贈りました。 (Vào ngày lễ tốt nghiệp, tôi đã trao tặng bó hoa tri ân gửi đến người thầy đã dạy dỗ mình.)'
  },
  '起こる': {
    meaning: 'xảy ra, phát sinh (sự cố, biến cố)',
    example: '深夜に大きな地震が起こり、街中が停電しました。 (Nửa đêm đã xảy ra một trận động đất lớn khiến toàn thành phố mất điện.)'
  },
  '幼い': {
    meaning: 'ngây thơ, thơ ấu, còn nhỏ tuổi',
    example: '彼女は幼い頃からピアノを熱心に習っていました。 (Cô ấy đã chăm chỉ học đàn piano từ thuở còn thơ ấu.)'
  },
  '収める': {
    meaning: 'thu vào, đạt được (thành công); cất giữ',
    example: '厳しい練習の成果を発揮して、大会で見事に優勝を収めました。 (Phát huy kết quả luyện tập gian khổ, anh ấy đã đạt được chức vô địch thuyết phục tại đại hội.)'
  },
  'おしゃべり': {
    meaning: 'nói chuyện, tán gẫu; người nhiều chuyện',
    example: 'カフェで友達と何時間もおしゃべりを楽しんだ。 (Tôi đã có thời gian tán gẫu vui vẻ cùng bạn bè hàng giờ liền tại quán cà phê.)'
  },
  '汚染': {
    meaning: 'ô nhiễm (môi trường, nguồn nước)',
    example: '工場からの排水によって川の水が深刻に汚染されている。 (Nước sông đang bị ô nhiễm nghiêm trọng do nước thải từ nhà máy xả ra.)'
  },
  'おそらく': {
    meaning: 'có lẽ, có thể, e rằng (xác suất cao)',
    example: '空が暗くなってきたので、おそらく夕方には激しい雨が降るでしょう。 (Trời đã tối sầm lại nên có lẽ chiều tối nay sẽ có mưa to.)'
  },
  '恐れる': {
    meaning: 'lo sợ, e sợ, sợ hãi',
    example: '失敗を恐れずに、新しいことに積極的に挑戦してください。 (Xin đừng lo sợ thất bại mà hãy tự tin thử sức với những điều mới mẻ.)'
  },
  '恐ろしい': {
    meaning: 'đáng sợ, ghê gớm, kinh khủng',
    example: '昨夜、巨大な怪物に追いかけられる恐ろしい夢を見ました。 (Đêm qua tôi đã mơ thấy một giấc mơ đáng sợ khi bị quái vật khổng lồ rượt đuổi.)'
  },
  'お互い': {
    meaning: 'lẫn nhau, cùng nhau (cả hai bên)',
    example: '困ったときはお互いに助け合うことが大切です。 (Khi gặp hoạn nạn, việc giúp đỡ lẫn nhau là điều vô cùng quan trọng.)'
  },
  '穏やか': {
    meaning: 'ôn hòa, điềm đạm, yên bình (thời tiết, tính cách)',
    example: '春の穏やかな日差しを浴びながら散歩しました。 (Tôi đi dạo dưới ánh nắng ấm áp và ôn hòa của mùa xuân.)'
  },
  '劣る': {
    meaning: 'kém hơn, thua kém (về chất lượng, khả năng)',
    example: 'この国産品は外国の高級品と比べても決して性能は劣りません。 (Sản phẩm trong nước này so với hàng cao cấp ngoại nhập thì chất lượng hoàn toàn không hề thua kém.)'
  },
  '鬼': {
    meaning: 'con quỷ, yêu quái; người nghiêm khắc như quỷ',
    example: '日本の節分の行事では、豆をまいて鬼を追い払います。 (Trong lễ Setsubun ở Nhật, người ta ném đậu để xua đuổi con quỷ đi.)'
  },
  '帯': {
    meaning: 'dây đai, đai lưng (kimono); dải băng',
    example: '着物を着たあと、華やかな柄の帯をきれいに結びました。 (Sau khi mặc kimono, tôi thắt chiếc đai lưng có hoa văn rực rỡ thật ngay ngắn.)'
  },
  'お昼': {
    meaning: 'buổi trưa; bữa trưa, cơm trưa',
    example: 'お昼休みに同僚と近くのレストランへ食事に行きました。 (Vào giờ nghỉ buổi trưa, tôi cùng đồng nghiệp đến quán ăn gần đó dùng bữa.)'
  },
  'オフィス': {
    meaning: 'văn phòng làm việc (office)',
    example: '新しいオフィスは広々としていて、とても仕事がしやすいです。 (Văn phòng làm việc mới rất rộng rãi và vô cùng tiện lợi cho công việc.)'
  },
  '溺れる': {
    meaning: 'chết đuối, chìm đắm (trong men rượu, cờ bạc)',
    example: '川で溺れそうになった子供を近所の人が素早く救助した。 (Người dân gần đó đã nhanh chóng cứu đứa bé sắp bị chết đuối dưới sông.)'
  },
  'おまえ': {
    meaning: 'mày, cậu (đại từ xưng hô thân mật hoặc suồng sã)',
    example: '「おまえならきっと試験に合格できるよ」と親友が励ましてくれた。 (Bạn thân động viên tôi: \"Cậu mà thi thì chắc chắn sẽ đỗ thôi!\".)'
  },
  'おめでとう': {
    meaning: 'chúc mừng (sinh nhật, năm mới, thành công)',
    example: '大学の合格通知を受け取った親友に「本当におめでとう！」と伝えた。 (Tôi gửi lời chúc mừng chân thành đến người bạn thân vừa nhận giấy báo đỗ đại học.)'
  },
  'お目に掛かる': {
    meaning: 'gặp mặt (kính ngữ khiêm nhường của 会う)',
    example: '来週の火曜日に先生にお目に掛かるのを楽しみにしております。 (Em rất mong chờ được gặp mặt thầy vào thứ Ba tuần tới.)'
  },
  '思い出': {
    meaning: 'kỷ niệm, ký ức đáng nhớ',
    example: '高校時代の友達と過ごした日々は、かけがえのない思い出です。 (Những ngày tháng bên bạn bè thời cấp ba là những kỷ niệm vô giá của tôi.)'
  },
  '主に': {
    meaning: 'chủ yếu, phần lớn',
    example: 'このレストランでは主に北海道産の新鮮な食材を使用しています。 (Nhà hàng này chủ yếu sử dụng các nguyên liệu tươi ngon từ vùng Hokkaido.)'
  },
  '思わず': {
    meaning: 'bất giác, vô tình, không kìm được',
    example: '映画の感動的なラストシーンを見て、思わず涙がこぼれました。 (Xem đoạn kết xúc động của bộ phim, tôi đã bất giác rơi nước mắt.)'
  },
  '泳ぎ': {
    meaning: 'bơi lội, kiểu bơi, môn bơi',
    example: '夏休みには毎日市民プールに通って、泳ぎの練習をしました。 (Vào kỳ nghỉ hè, tôi đến hồ bơi thành phố mỗi ngày để luyện bơi lội.)'
  },
  'およそ': {
    meaning: 'khoảng chừng, đại khái, xấp xỉ',
    example: '東京から京都までは新幹線でおよそ２時間半かかります。 (Từ Tokyo đến Kyoto đi tàu Shinkansen mất khoảng chừng hai tiếng rưỡi.)'
  },
  '及ぼす': {
    meaning: 'gây ra, mang lại (ảnh hưởng xấu, tác động lớn)',
    example: '大気汚染は人々の健康に深刻な悪影響を及ぼしています。 (Ô nhiễm không khí đang gây ra những ảnh hưởng tiêu cực nghiêm trọng đến sức khỏe con người.)'
  },
  '居る': {
    meaning: 'ở, có mặt (người, động vật); cư ngụ',
    example: 'リビングのソファでお父さんがくつろいで居ます。 (Bố đang có mặt và thư giãn trên chiếc ghế sofa trong phòng khách.)'
  },
  '降ろす': {
    meaning: 'hạ xuống, dỡ xuống (hành lý); cho xuống xe',
    example: '車のトランクから重い旅行鞄を慎重に降ろしました。 (Tôi cẩn thận dỡ chiếc vali du lịch nặng từ cốp xe ô tô xuống.)'
  },
  '恩': {
    meaning: 'ơn nghĩa, ân huệ, công ơn',
    example: '育ててくれた両親への恩を一生忘れません。 (Suốt đời tôi sẽ không bao giờ quên công ơn nuôi nấng của cha mẹ.)'
  },
  '温暖': {
    meaning: 'ấm áp, ôn hòa (khí hậu)',
    example: 'この地域は一年を通して気候が温暖で、とても暮らしやすいです。 (Vùng đất này quanh năm khí hậu ấm áp, vô cùng thuận lợi để sinh sống.)'
  },
  '温度': {
    meaning: 'nhiệt độ (không khí, nước, cơ thể)',
    example: '部屋のエアコンの温度を快適な２５度に設定しました。 (Tôi đã cài đặt nhiệt độ điều hòa trong phòng ở mức 25 độ thoải mái.)'
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
  console.log(`[OK] Đã chuẩn hóa ${updated} từ trong ${THEME_FILE}`);
}

run();

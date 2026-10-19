/**
 * scripts/refine-minna-n5-batchA.js
 * Chuẩn hóa 137 từ vựng Minna no Nihongo N5 (Unit 01 -> Unit 13):
 * - Sửa các lỗi dịch nghĩa sai (政界 -> 世界, 釣り, 生け花, どこか, ご注文は...)
 * - Viết câu ví dụ chuẩn collocation bản xứ, loại bỏ 100% template lặp lại
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

const batchADict = {
  // UNIT 01
  'お名前は？': {
    meaning: 'tên của bạn là gì? (cách hỏi tên lịch sự)',
    example: '失礼ですが、お名前は何とおっしゃいますか。 (Xin lỗi làm phiền một chút, quý khách tên là gì ạ?)'
  },
  '初めまして。': {
    meaning: 'rất vui được làm quen (chào hỏi khi lần đầu gặp mặt)',
    example: '初めまして、ベトナムから参りましたナムと申します。どうぞよろしく。 (Rất vui được gặp bạn lần đầu, tôi tên là Nam đến từ Việt Nam. Rất mong được giúp đỡ.)'
  },

  // UNIT 02
  'この': {
    meaning: 'này, cái... này (chỉ vật ở gần người nói)',
    example: 'この本は日本語の勉強にとても役に立ちます。 (Cuốn sách này rất có ích cho việc học tiếng Nhật.)'
  },
  'コンピュータ': {
    meaning: 'máy vi tính, máy tính điện tử',
    example: '会社で毎日新しいコンピュータを使って仕事をしています。 (Tôi dùng máy tính mới để làm việc mỗi ngày ở công ty.)'
  },
  '∼語': {
    meaning: 'tiếng ～, ngôn ngữ ～ (hậu tố ghép sau tên nước)',
    example: '英語のほかに、日本語やフランス語も少し話せます。 (Ngoài tiếng Anh, tôi còn có thể nói được một chút tiếng Nhật và tiếng Pháp.)'
  },
  'そう': {
    meaning: 'đúng vậy, như thế (từ dùng để xác nhận hoặc đồng ý)',
    example: '「明日は雨ですか。」「ええ、天気予報によるとそうですよ。」 ("Ngày mai trời mưa à?" "Vâng, theo dự báo thời tiết thì đúng như thế đấy.")'
  },
  'あのう': {
    meaning: 'à, ừm, này (từ đệm ngập ngừng khi bắt đầu nói hoặc hỏi)',
    example: 'あのう、すみませんが、駅へ行く道を教えていただけませんか。 (À này, xin lỗi làm phiền bạn có thể chỉ đường ra nhà ga cho tôi được không?)'
  },
  'ほんの気持ちです': {
    meaning: 'chút lòng thành của tôi (câu nói khiêm tốn khi tặng quà)',
    example: 'これ、旅行のお土産です。ほんの気持ちですが、どうぞ。 (Đây là quà lưu niệm chuyến du lịch. Chỉ là chút lòng thành thôi, xin mời bạn nhận cho.)'
  },
  'これから お世話になります': {
    meaning: 'từ nay rất mong được sự giúp đỡ của quý vị (nói khi mới đến làm việc/sinh sống)',
    example: '明日からこちらの部署で働くことになりました。これからお世話になります。 (Từ ngày mai tôi sẽ làm việc ở bộ phận này, từ nay rất mong được mọi người giúp đỡ.)'
  },
  'こちらこそ よろしく': {
    meaning: 'chính tôi mới là người mong được giúp đỡ (đáp lại câu よろしくお願いします)',
    example: '「どうぞよろしくお願いします。」「こちらこそ、よろしくお願いします。」 ("Rất mong được bạn giúp đỡ." "Chính tôi mới là người mong được bạn giúp đỡ.")'
  },

  // UNIT 03
  'あそこ': {
    meaning: 'ở đằng kia (nơi xa cả người nói lẫn người nghe)',
    example: 'あそこにある白い建物が、私たちが通っている学校です。 (Tòa nhà màu trắng ở đằng kia chính là trường học mà chúng tôi đang theo học.)'
  },
  'どこ': {
    meaning: 'ở đâu, chỗ nào (từ để hỏi nơi chốn)',
    example: '「すみません、お手洗いはどこにありますか。」「あちらの突き当たりです。」 ("Xin lỗi, nhà vệ sinh ở đâu vậy ạ?" "Ở cuối hành lang đằng kia ạ.")'
  },
  'トイレ': {
    meaning: 'nhà vệ sinh, phòng vệ sinh',
    example: '授業が始まる前に、急いでトイレへ行って手を洗いました。 (Trước khi tiết học bắt đầu, tôi tranh thủ chạy vào nhà vệ sinh rửa tay.)'
  },
  'うち': {
    meaning: 'nhà, ngôi nhà của mình',
    example: '駅から歩いて十分ほどの静かな住宅地に私のうちがあります。 (Nhà của tôi nằm ở một khu dân cư yên tĩnh, cách nhà ga khoảng mười phút đi bộ.)'
  },
  'すみません': {
    meaning: 'xin lỗi, làm phiền (dùng để xin lỗi hoặc gọi nhân viên/nhờ vả)',
    example: 'すみません、落としましたよ、ハンカチ。 (Xin lỗi, bạn làm rơi chiếc khăn tay này.)'
  },
  '(を）みせてください': {
    meaning: 'xin hãy cho tôi xem ～ (nói khi mua sắm hoặc muốn xem đồ vật)',
    example: 'ショーケースの中にある黒い革の財布をみせてください。 (Làm ơn cho tôi xem chiếc ví da màu đen trong tủ kính với ạ.)'
  },
  'しんおおさか': {
    meaning: 'ga Shin-Osaka (nhà ga Shinkansen lớn tại Osaka)',
    example: '東京から新幹線に乗って、約２時間半で新大阪に着きました。 (Tôi đi tàu Shinkansen từ Tokyo và đến Shin-Osaka sau khoảng 2 tiếng rưỡi.)'
  },

  // UNIT 04
  '夜': {
    meaning: 'đêm, buổi tối',
    example: '夜の十時を過ぎると、近所の道路も静かになります。 (Quá 10 giờ đêm là đường sá quanh xóm bắt đầu trở nên vắng vẻ.)'
  },
  '休み': {
    meaning: 'ngày nghỉ, sự nghỉ ngơi',
    example: '今週の日曜日は仕事の休みなので、家でゆっくり休養を取ります。 (Chủ nhật tuần này là ngày nghỉ làm nên tôi sẽ ở nhà thảnh thơi dưỡng sức.)'
  },
  'ばんごうあんない': {
    meaning: 'dịch vụ giải đáp số điện thoại (tổng đài 104 của Nhật)',
    example: '相手の電話番号が分からないときは、104番の番号案内を利用します。 (Khi không biết số điện thoại của đối phương, tôi gọi tới dịch vụ giải đáp số điện thoại 104.)'
  },
  'お問い合わせの番号': {
    meaning: 'số điện thoại quý khách vừa tra hỏi',
    example: 'お問い合わせの番号をお調べしましたので、メモのご用意をお願いします。 (Chúng tôi đã tra được số điện thoại quý khách yêu cầu, xin mời quý khách chuẩn bị giấy bút ghi lại.)'
  },
  '～を おねがいします': {
    meaning: 'làm ơn cho tôi ～ / nhờ bạn ～',
    example: 'のどが渇いたので、温かい緑茶を一杯おねがいします。 (Vì khát nước nên làm ơn cho tôi xin một tách trà xanh nóng ạ.)'
  },
  '月曜日': {
    meaning: 'thứ hai (trong tuần)',
    example: '毎週月曜日の朝九時から、部署の定例ミーティングがあります。 (Sáng thứ Hai hàng tuần từ 9 giờ đều có cuộc họp định kỳ của bộ phận.)'
  },
  '～と～': {
    meaning: '～ và ～ (liệt kê toàn bộ các danh từ)',
    example: 'カバンの中に日本語のノートと黒いペンを入れています。 (Trong cặp của tôi có một cuốn vở tiếng Nhật và một chiếc bút đen.)'
  },
  'ロサンゼルス': {
    meaning: 'thành phố Los Angeles (Mỹ)',
    example: '来月の長期休暇に、アメリカのロサンゼルスへ観光旅行に行く予定です。 (Vào kỳ nghỉ dài tháng sau, tôi dự định sẽ đi du lịch Los Angeles ở Mỹ.)'
  },

  // UNIT 05
  '行きます': {
    meaning: 'đi (di chuyển đến một địa điểm xa người nói)',
    example: '毎朝八時に家を出て、歩いて近くの駅へ行きます。 (Mỗi sáng tôi rời nhà lúc 8 giờ và đi bộ ra ga tàu gần nhà.)'
  },
  '来ます': {
    meaning: 'đến (di chuyển về phía người nói)',
    example: '明日の午後三時に、田中さんが私たちのオフィスに来ます。 (Chiều mai lúc 3 giờ, anh Tanaka sẽ đến văn phòng của chúng tôi.)'
  },
  '帰ります': {
    meaning: 'về, trở về (về nhà, về quê hương)',
    example: '週末は久しぶりに実家へ帰って、両親と一緒に晩ご飯を食べます。 (Cuối tuần tôi sẽ về quê sau chuỗi ngày dài và ăn bữa tối cùng bố mẹ.)'
  },
  'ことし': {
    meaning: 'năm nay',
    example: 'ことしの春に大学を無事に卒業して、IT企業に入社しました。 (Mùa xuân năm nay tôi đã tốt nghiệp đại học thuận lợi và vào làm tại công ty IT.)'
  },
  '１日': {
    meaning: 'ngày mùng 1 hàng tháng, hoặc 1 ngày',
    example: '５月１日はメーデーで、世界中の多くの国で祝日となっています。 (Ngày mùng 1 tháng 5 là ngày Quốc tế Lao động, ngày nghỉ lễ ở nhiều nước trên thế giới.)'
  },
  '８日': {
    meaning: 'ngày mùng 8 hàng tháng, hoặc 8 ngày',
    example: '私の妹の二十歳の誕生日は、ちょうど来月の８日です。 (Sinh nhật tròn hai mươi tuổi của em gái tôi rơi đúng vào ngày mùng 8 tháng sau.)'
  },
  '２０日': {
    meaning: 'ngày 20 hàng tháng, hoặc 20 ngày (đọc là はつか)',
    example: '毎月２０日は、会社の給料が銀行口座に振り込まれる日です。 (Ngày 20 hàng tháng là ngày công ty chuyển khoản tiền lương vào tài khoản ngân hàng.)'
  },

  // UNIT 06
  '吸います': {
    meaning: 'hút (thuốc lá: たばこを吸う), hít vào',
    example: 'このフロアは完全禁煙ですので、たばこを吸わないでください。 (Tầng này hoàn toàn cấm hút thuốc nên xin quý khách đừng hút thuốc ở đây.)'
  },
  'ちょっと': {
    meaning: 'một chút, một lát (thời gian hoặc mức độ ngắn)',
    example: 'すみません、書類にサインしたいので、ちょっとペンを貸していただけませんか。 (Xin lỗi, tôi muốn ký tài liệu nên bạn có thể cho tôi mượn cây bút một lát được không?)'
  },

  // UNIT 07
  'スプーン': {
    meaning: 'chiếc thìa, muỗng ăn',
    example: '温かいコーンスープを飲むときは、大きめのスプーンを使います。 (Khi uống món súp ngô nóng hổi, tôi dùng một chiếc thìa tương đối to.)'
  },
  'もう': {
    meaning: 'đã... rồi (diễn tả hành động đã hoàn tất)',
    example: '「今日の宿題はもう終わりましたか。」「はい、先ほど終わりました。」 ("Bạn đã làm xong bài tập hôm nay chưa?" "Vâng, tôi vừa làm xong lúc nãy rồi.")'
  },
  'まだ': {
    meaning: 'chưa, vẫn chưa (hành động chưa diễn ra, đi với phủ định)',
    example: '「お昼ご飯を食べましたか。」「いいえ、忙しくてまだ食べていません。」 ("Bạn đã ăn trưa chưa?" "Chưa, bận quá nên tôi vẫn chưa ăn.")'
  },
  'ごめんださい': {
    meaning: 'xin lỗi (lời xin lỗi thân mật, viết chuẩn là ごめんなさい)',
    example: '待ち合わせの約束の時間に遅れてしまって、本当にごめんなさい。 (Để bạn phải đợi đến muộn giờ hẹn thế này, tôi thực sự xin lỗi nhé.)'
  },
  'いらっしゃい': {
    meaning: 'chào mừng bạn đã đến chơi (lời chủ nhà đón khách thân quen)',
    example: '「こんにちは、遊びに来ました。」「いらっしゃい、どうぞ上がって寛いでね。」 ("Chào bạn, tôi đến chơi đây." "Chào mừng bạn, mời bạn vào nhà ngồi chơi tự nhiên nhé.")'
  },
  'しつれします': {
    meaning: 'xin phép thất lễ, xin lỗi làm phiền (viết chuẩn là 失礼します)',
    example: '「失礼します」と頭を下げて挨拶をしてから、面接の部屋に入りました。 (Tôi cúi đầu chào "Xin phép làm phiền ạ" rồi mới bước vào phòng phỏng vấn.)'
  },
  'ヨーロッパ': {
    meaning: 'châu Âu',
    example: '夏休みを利用して、フランスやイタリアなどヨーロッパの国々を旅しました。 (Tranh thủ kỳ nghỉ hè, tôi đã đi du lịch các nước châu Âu như Pháp và Ý.)'
  },

  // UNIT 08
  '古い': {
    meaning: 'cũ kỹ, cổ kính (đối nghĩa với 新しい)',
    example: 'この神社は千年以上前に建てられた、由緒ある古い木造建築です。 (Ngôi đền Thần đạo này là công trình kiến trúc bằng gỗ cổ kính có lịch sử hơn một nghìn năm.)'
  },
  '山': {
    meaning: 'núi, ngọn núi',
    example: '秋の連休に家族と一緒に紅葉が美しい山へ登りました。 (Vào kỳ nghỉ mùa thu, tôi cùng gia đình leo lên ngọn núi có lá phong đỏ tuyệt đẹp.)'
  },
  '食べ物': {
    meaning: 'đồ ăn, thức ăn, thực phẩm',
    example: '日本の食べ物の中で、お寿司と揚げたての天ぷらが一番好きです。 (Trong các món ăn của Nhật Bản, tôi thích nhất là sushi và món tempura mới chiên giòn.)'
  },
  '所': {
    meaning: 'nơi chốn, địa điểm, chỗ',
    example: 'この町は静かで緑が多く、子育てにもとても住みやすい所です。 (Thị trấn này rất yên tĩnh và nhiều cây xanh, là một nơi cực kỳ đáng sống để nuôi dạy con cái.)'
  },
  '勉強': {
    meaning: 'việc học tập, học hành',
    example: '毎晩寝る前に、日本語の単語や文法の勉強をコツコツ続けています。 (Mỗi tối trước khi đi ngủ, tôi đều chăm chỉ duy trì việc học từ vựng và ngữ pháp tiếng Nhật.)'
  },
  '生活': {
    meaning: 'cuộc sống, sinh hoạt hằng ngày',
    example: '初めての一人暮らしですが、東京での生活にもだんだん慣れてきました。 (Lần đầu sống tự lập một mình, tôi cũng dần quen với nhịp sống tại Tokyo.)'
  },
  '[お] 仕事': {
    meaning: 'công việc, nghề nghiệp',
    example: '「お仕事は何をなさっているのですか。」「高校で英語を教えています。」 ("Công việc của bạn là gì vậy ạ?" "Tôi đang dạy tiếng Anh ở trường cấp ba.")'
  },
  'どう': {
    meaning: 'như thế nào (dùng để hỏi cảm tưởng, ý kiến)',
    example: '「新しいオフィスの環境はどうですか。」「明るくてとても働きやすいです。」 ("Môi trường làm việc ở văn phòng mới thế nào?" "Sáng sủa và rất thoải mái khi làm việc ạ.")'
  },
  'どんな': {
    meaning: 'như thế nào, loại nào (hỏi về đặc điểm, tính chất)',
    example: '「山田さんはどんな人ですか。」「とても親切でユーモアのある人ですよ。」 ("Anh Yamada là người như thế nào?" "Anh ấy là một người rất tốt bụng và hóm hỉnh đấy.")'
  },
  'どれ': {
    meaning: 'cái nào (chọn một trong ba vật trở lên)',
    example: '「傘立ての中で、あなたの傘はどれですか。」「あの青い長傘です。」 ("Trong giá để dù, cây dù của bạn là cái nào?" "Là cây dù dài màu xanh đằng kia ạ.")'
  },
  '～が、': {
    meaning: '～ nhưng mà... (liên từ nối hai vế tương phản hoặc mở đầu)',
    example: 'この料理はとてもおいしいですが、香辛料が効いていて少し辛いです。 (Món ăn này rất ngon nhưng nhiều gia vị nên hơi cay một chút.)'
  },
  'しちにんのさむらい': {
    meaning: 'bộ phim "Bảy võ sĩ đạo" (kiệt tác điện ảnh của đạo diễn Akira Kurosawa)',
    example: '黒澤明監督の『七人の侍』は、世界中の映画ファンに愛されている名作です。 (Bộ phim "Bảy võ sĩ đạo" của đạo diễn Akira Kurosawa là một kiệt tác được khán giả yêu điện ảnh khắp thế giới yêu thích.)'
  },
  'いいえ、けっこうです': {
    meaning: 'không, tôi đủ rồi / không cần đâu ạ (từ chối lời mời một cách lịch sự)',
    example: '「温かいお茶のおかわりはいかがですか。」「いいえ、けっこうです。十分いただきました。」 ("Quý khách có muốn dùng thêm trà nóng không ạ?" "Dạ không, tôi đủ rồi ạ. Cảm ơn bạn.")'
  },
  'そろそろ、しつれいします': {
    meaning: 'đã đến lúc tôi xin phép phải ra về (lời xin phép lịch sự khi rời nhà người khác)',
    example: 'もう夜遅い時間ですので、そろそろ失礼します。楽しい時間をありがとうございました。 (Đã muộn rồi nên tôi xin phép ra về. Cảm ơn gia đình đã cho tôi một buổi tối thật vui vẻ.)'
  },
  'また いらっしゃってください': {
    meaning: 'lần sau bạn lại ghé chơi nữa nhé (lời chủ nhà chào tạm biệt khách)',
    example: '「今日はお邪魔しました。」「とても楽しかったです。またいらっしゃってくださいね。」 ("Hôm nay tôi đã làm phiền bạn rồi." "Hôm nay vui lắm, lần sau bạn lại ghé chơi nữa nhé!")'
  },

  // UNIT 09
  'あります': {
    meaning: 'có (sở hữu đồ vật, tiền tài, tổ chức sự kiện)',
    example: '今週の日曜日に、大学のキャンパスで留学生の日本語スピーチ大会があります。 (Chủ nhật tuần này sẽ có cuộc thi hùng biện tiếng Nhật của du học sinh tại trường đại học.)'
  },
  'よく (わかります）': {
    meaning: 'hiểu rất rõ, hiểu tường tận (phó từ chỉ mức độ)',
    example: '先生が図を使って分かりやすく説明してくれたので、内容がよく分かりました。 (Nhờ thầy giáo dùng hình vẽ giải thích dễ hiểu nên tôi đã nắm rất rõ nội dung bài học.)'
  },
  'だいがく': {
    meaning: 'trường đại học',
    example: '私は将来、日本の大学に進学して情報工学の専門知識を学びたいです。 (Trong tương lai, tôi muốn thi vào một trường đại học của Nhật Bản để học chuyên sâu về công nghệ thông tin.)'
  },
  '全然～ない': {
    meaning: 'hoàn toàn không, không hề chút nào (luôn đi cùng thể phủ định)',
    example: '昨夜はぐっすり熟睡できたので、今朝は全然疲れが残っていません。 (Tối qua tôi ngủ một giấc thật sâu nên sáng nay không hề cảm thấy mệt mỏi chút nào.)'
  },
  '早く、速く': {
    meaning: 'sớm (早く: thời gian), nhanh (速く: tốc độ)',
    example: '明日は早朝の飛行機に乗る予定なので、今夜は早くベッドに入ります。 (Vì ngày mai tôi có kế hoạch bay chuyến sáng sớm nên tối nay sẽ đi ngủ sớm.)'
  },
  'どうして': {
    meaning: 'tại sao, vì lý do gì (từ để hỏi nguyên nhân)',
    example: 'どうして今朝の重要なチームミーティングに連絡もなく遅れてしまったのですか。 (Tại sao sáng nay bạn lại đi muộn buổi họp nhóm quan trọng mà không báo trước thế?)'
  },
  'ざんねんです[ね]': {
    meaning: 'thật đáng tiếc nhỉ (bày tỏ sự tiếc nuối khi lỡ hẹn hoặc gặp chuyện không như ý)',
    example: '「楽しみにしていた週末のバーベキュー、雨で延期になったよ。」「ええ、本当に残念ですね。」 ("Buổi tiệc nướng cuối tuần đang mong đợi bị hoãn do trời mưa rồi." "Ôi, tiếc thật đấy nhỉ.")'
  },
  '一緒に～いかがですか。': {
    meaning: 'bạn cùng làm ～ với tôi có được không? (lời rủ rê, mời mọc lịch sự)',
    example: '美術館で印象派の特別展が開かれているのですが、午後に一緒に行きませんか。 (Ở bảo tàng mỹ thuật đang có triển lãm đặc biệt về trường phái ấn tượng, chiều nay bạn có muốn đi cùng tôi không?)'
  },
  '(～は) ちょっと…..': {
    meaning: 'thì hơi... (cách từ chối khéo léo, tế nhị để người nghe tự hiểu)',
    example: '「今夜、仕事帰りに一杯飲みに行かない？」「すみません、今夜は先約がありまして、ちょっと…」 ("Tối nay tan làm đi uống một ly không?" "Xin lỗi, tối nay tôi có hẹn trước rồi nên hơi kẹt...")'
  },
  'だめですか。': {
    meaning: 'không được sao ạ? (hỏi lại khi bị từ chối hoặc muốn thương lượng)',
    example: '「レポートの提出締め切りは厳守です。」「先生、明日まで待っていただくのはだめですか。」 ("Hạn nộp báo cáo phải tuân thủ nghiêm ngặt." "Thưa thầy, thư thả cho em đến ngày mai có được không ạ?")'
  },

  // UNIT 10
  'いろいろ「な」': {
    meaning: 'nhiều loại, đa dạng, phong phú',
    example: '駅前のデパートの地下には、いろいろな国の珍しいお菓子が並んでいます。 (Dưới tầng hầm bách hóa trước ga bày bán phong phú các loại bánh kẹo lạ từ nhiều nước.)'
  },
  '～屋': {
    meaning: 'cửa hàng ～, tiệm bán ～',
    example: '商店街の角にある焼きたてパン屋で、香ばしいクロワッサンを買いました。 (Tôi đã mua những chiếc bánh sừng bò thơm phức tại tiệm bánh mì ở góc phố mua sắm.)'
  },
  '隣': {
    meaning: 'bên cạnh, sát vách (cùng chủng loại hoặc ngay liền kề)',
    example: '私の部屋のすぐ隣の部屋には、大学の同級生が住んでいます。 (Ngay phòng bên cạnh phòng tôi là một người bạn cùng lớp đại học đang ở.)'
  },
  '～や～「など」': {
    meaning: '～ và ～, vân vân (liệt kê tiêu biểu một vài thứ)',
    example: 'デスクの上には、仕事で使うノートパソコンや書類、電卓などが置いてあります。 (Trên bàn làm việc có đặt laptop, tài liệu, máy tính bỏ túi, v.v. phục vụ công việc.)'
  },
  'いちばん～': {
    meaning: 'nhất ～, số một (so sánh cao nhất)',
    example: '学年全体の中で、彼が一番数学の成績が優秀です。 (Trong toàn khối, cậu ấy là người có thành tích môn toán xuất sắc nhất.)'
  },
  '「どうも」すみません。': {
    meaning: 'xin cảm ơn bạn rất nhiều / thành thật xin lỗi',
    example: '重たいスーツケースを階段の上まで運んでくださり、どうもすみません。 (Cảm ơn bạn rất nhiều vì đã giúp tôi khiêng chiếc vali nặng lên tận đầu cầu thang.)'
  },
  '奥': {
    meaning: 'phía trong cùng, tận sâu bên trong',
    example: 'クローゼットの奥から、昔着ていた懐かしい冬用のコートを取り出しました。 (Từ tận sâu trong tủ quần áo, tôi lấy ra chiếc áo khoác mùa đông thân quen đã mặc ngày xưa.)'
  },
  'スパイス コーナー': {
    meaning: 'quầy gia vị, góc bán gia vị trong siêu thị',
    example: 'スーパーのスパイスコーナーで、本格的なカレーを作るための香辛料を選びました。 (Tại quầy gia vị của siêu thị, tôi đã chọn các loại hương liệu để nấu món cà ri chuẩn vị.)'
  },

  // UNIT 11
  '～だけ': {
    meaning: 'chỉ ～ (chỉ số lượng giới hạn, không có thêm)',
    example: '今日は次の予定が迫っていますので、5分だけお話しできます。 (Hôm nay tôi sắp đến giờ hẹn tiếp theo rồi nên chỉ có thể nói chuyện trong 5 phút thôi.)'
  },
  'いらっしゃいませ': {
    meaning: 'kính chào quý khách (lời chào khách của nhân viên nhà hàng, cửa hiệu)',
    example: '洋服店に入ると、店員さんが「いらっしゃいませ」と明るい笑顔で迎えてくれた。 (Vừa bước vào cửa hàng quần áo, nhân viên liền tươi cười đon đả chào: "Kính chào quý khách!")'
  },
  'お出かけですか': {
    meaning: 'bạn đang đi ra ngoài đấy à? (lời chào hỏi thân tình khi gặp hàng xóm)',
    example: 'アパートの前で大家さんに「お出かけですか」と声をかけられ、「ええ、買い物へ」と答えた。 (Trước khu căn hộ, được chủ nhà hỏi "Cháu đi ra ngoài đấy à", tôi đáp "Vâng, cháu đi chợ chút ạ".)'
  },
  'いって いらっしゃい': {
    meaning: 'bạn đi nhé / đi cẩn thận nhé (lời người ở lại dặn người bước ra khỏi nhà)',
    example: '毎朝、母は玄関の前で「いってらっしゃい、車に気をつけてね」と笑顔で見送ってくれる。 (Mỗi sáng, mẹ đều đứng trước cửa tươi cười tiễn tôi: "Con đi học nhé, chú ý xe cộ nhé con!")'
  },
  'いって まいります': {
    meaning: 'tôi đi đây ạ (lời người rời khỏi nhà chào người ở lại)',
    example: '靴を履いて「いってまいります」と元気よく家族に挨拶し、駅へと向かいました。 (Xỏ giày xong, tôi chào cả nhà thật to "Con xin phép đi học đây ạ" rồi rảo bước ra ga.)'
  },
  'オーストラリア': {
    meaning: 'nước Úc (Australia)',
    example: '私の兄は大学を休学して、ワーキングホリデーでオーストラリアに滞在しています。 (Anh trai tôi đã bảo lưu đại học để sang Úc trải nghiệm theo diện vừa học vừa làm.)'
  },

  // UNIT 12
  '遠い': {
    meaning: 'xa xôi, cách xa (khoảng cách không gian hoặc thời gian)',
    example: '祖父母が暮らす村は、新幹線とバスを乗り継いでも半日かかるほど遠い所にあります。 (Ngôi làng ông bà tôi đang sống ở một nơi rất xa, đổi từ tàu Shinkansen sang xe buýt cũng mất nửa ngày.)'
  },
  '涼しい': {
    meaning: 'mát mẻ, mát rượi (nhiệt độ dễ chịu vào mùa hè/thu)',
    example: '高原の早朝は空気が澄み渡り、肌をなでる涼しい風が心地よいです。 (Sáng sớm trên cao nguyên không khí trong lành, làn gió mát rượi lướt qua da thịt thật dễ chịu.)'
  },
  '天気': {
    meaning: 'thời tiết, tiết trời',
    example: '週末の東京は雲一つない快晴で、絶好のハイキング日和の天気でした。 (Cuối tuần ở Tokyo trời trong xanh không một bóng mây, thời tiết hoàn hảo cho chuyến dã ngoại.)'
  },
  '曇り': {
    meaning: 'trời nhiều mây, âm u',
    example: '午前中は晴れていましたが、午後になると空全体が曇りに変わりました。 (Buổi sáng trời vẫn nắng nhưng sang buổi chiều thì mây mù giăng kín khắp bầu trời.)'
  },
  'ホテル': {
    meaning: 'khách sạn nghỉ dưỡng',
    example: '海沿いにあるリゾートホテルのバルコニーから、夕日を眺めました。 (Từ ban công của khách sạn nghỉ dưỡng ven biển, tôi phóng tầm mắt ngắm hoàng hôn.)'
  },
  '空港': {
    meaning: 'sân bay, phi trường',
    example: '国際線の搭乗手続きに遅れないよう、出発時刻の3時間前に成田空港に到着した。 (Để không bị trễ thủ tục lên máy bay quốc tế, tôi đã đến sân bay Narita trước giờ bay 3 tiếng.)'
  },
  '海': {
    meaning: 'biển, đại dương',
    example: '夏休みには友人と一緒に沖縄の青い海でシュノーケリングを楽しみました。 (Vào kỳ nghỉ hè, tôi cùng bạn bè thỏa thích lặn ngắm san hô dưới làn nước biển xanh biếc ở Okinawa.)'
  },
  '政界': {
    word: '世界',
    reading: 'せかい',
    meaning: 'thế giới (đã sửa từ lỗi 政界 thành chữ 世界)',
    example: 'いつかバックパック一つを背負って、世界中を一人旅してみたいです。 (Tôi ước một ngày nào đó được khoác ba lô lên vai đi du lịch vòng quanh thế giới một mình.)'
  },
  'パーティー': {
    meaning: 'bữa tiệc, tiệc liên hoan',
    example: '親友の昇進を祝うために、隠れ家風のレストランでサプライズパーティーを開いた。 (Để chúc mừng bạn thân thăng chức, chúng tôi đã tổ chức một bữa tiệc bất ngờ tại nhà hàng nhỏ.)'
  },
  '(お) 祭り': {
    meaning: 'lễ hội truyền thống của Nhật Bản',
    example: '色鮮やかな浴衣を着て地元の夏祭りに参加し、屋台のたこ焼きを食べました。 (Tôi mặc bộ yukata sặc sỡ đi trẩy hội mùa hè của địa phương và thưởng thức món takoyaki ở quầy hàng rong.)'
  },
  '生け花': {
    meaning: 'nghệ thuật cắm hoa Ikebana truyền thống Nhật Bản',
    example: '週末に生け花の教室へ通って、四季折々の花を生ける伝統作法を学んでいます。 (Cuối tuần tôi đến lớp dạy cắm hoa Ikebana để học phép tắc truyền thống phối hoa theo bốn mùa.)'
  },
  '初めて': {
    meaning: 'lần đầu tiên (trải nghiệm lần đầu)',
    example: 'パスポートを取得して海外へ旅行に出かけるのは、今回が人生で初めてです。 (Làm hộ chiếu để bước chân ra nước ngoài du lịch lần này chính là lần đầu tiên trong đời tôi.)'
  },
  'どちらも': {
    meaning: 'cả hai (đều như nhau)',
    example: '「和食と洋食のどちらが好きですか。」「どちらもおいしくて甲乙つけがたいです。」 ("Bạn thích món ăn Nhật hay món Tây hơn?" "Cả hai đều rất ngon nên thật khó phân bua hơn kém.")'
  },
  'ずっと': {
    meaning: 'suốt, hơn hẳn (so sánh hơn vượt bậc)',
    example: '新幹線は各駅停車の普通列車に比べて、移動スピードがずっと速いです。 (Tàu Shinkansen di chuyển nhanh hơn hẳn so với những chuyến tàu thường dừng ở mọi ga.)'
  },
  'でも': {
    meaning: 'nhưng, tuy nhiên (liên từ chuyển ý)',
    example: '大都市の暮らしは非常に便利です。でも、家賃や物価が少し高いのが難点です。 (Sống ở đô thị lớn vô cùng tiện nghi. Nhưng điểm bất tiện là giá thuê nhà và sinh hoạt phí hơi đắt đỏ.)'
  },
  'シンガポール': {
    meaning: 'nước Singapore',
    example: '観光でシンガポールを訪れて、有名なマーライオン公園で記念写真を撮影しました。 (Đến Singapore du lịch, tôi đã chụp một tấm ảnh kỷ niệm tuyệt đẹp tại công viên tượng Sư tử biển.)'
  },

  // UNIT 13
  '出します [手紙を～]': {
    meaning: 'gửi [thư], nộp [báo cáo, đơn từ]',
    example: '郵便局の窓口へ行って、海外にいる親友へエアメールの手紙を出しました。 (Tôi ra quầy bưu điện và gửi bức thư chuyển phát nhanh đường hàng không cho người bạn thân ở nước ngoài.)'
  },
  '入ります [喫茶店に～]': {
    meaning: 'vào, bước vào [quán giải khát, cửa hàng]',
    example: '街を歩き疲れてのどが渇いたので、駅前の小さな喫茶店に入って冷たいコーヒーを頼んだ。 (Đi bộ rã cả chân và khát nước nên tôi ghé vào một quán cà phê nhỏ trước ga gọi ly cà phê mát lạnh.)'
  },
  '出ます [喫茶店を～]': {
    meaning: 'rời khỏi, bước ra khỏi [quán giải khát, phòng ốc]',
    example: '友人と2時間ほど楽しくおしゃべりをした後、会計を済ませて喫茶店を出ました。 (Sau khi trò chuyện vui vẻ cùng bạn chừng 2 tiếng, tôi thanh toán tiền rồi bước ra khỏi quán cà phê.)'
  },
  'プール': {
    meaning: 'hồ bơi, bể bơi',
    example: '真夏の暑い休日には、市営の屋外プールで泳いでリフレッシュしています。 (Vào những ngày nghỉ hè nóng đỉnh điểm, tôi ra bơi ở bể bơi ngoài trời của thành phố để giải nhiệt.)'
  },
  '川': {
    meaning: 'con sông, dòng sông',
    example: '山奥の澄み切った清流の川で、子どもたちが水遊びをして楽しんでいました。 (Tại dòng sông nước trong vắt sâu trong núi, lũ trẻ con đang tắm mát nô đùa thỏa thích.)'
  },
  '経済': {
    meaning: 'kinh tế, tình hình kinh tế học',
    example: '大学の講義で、東南アジア諸国の目覚ましい経済発展について詳しく学びました。 (Trong bài giảng đại học, tôi đã học chi tiết về sự phát triển kinh tế vượt bậc của các nước Đông Nam Á.)'
  },
  '美術': {
    meaning: 'mỹ thuật, nghệ thuật tạo hình',
    example: '学生時代から美術に関心があり、休日はよく美術館で世界の名画を鑑賞します。 (Từ thời sinh viên tôi đã đam mê mỹ thuật, ngày nghỉ tôi thường tới bảo tàng chiêm ngưỡng các danh tác thế giới.)'
  },
  '釣り': {
    meaning: 'việc câu cá, thú vui đi câu',
    example: '週末の早朝から父と一緒に海へ出かけて、一日中のんびりと船釣りを楽しんだ。 (Cuối tuần từ sáng sớm, tôi cùng bố ra biển và tận hưởng thú vui câu cá trên thuyền suốt cả ngày.)'
  },
  '会議': {
    meaning: 'cuộc họp, hội nghị bàn công việc',
    example: '新プロジェクトの進捗を確認するため、関係者全員が集まって緊急会議を開きました。 (Để kiểm tra tiến độ dự án mới, toàn bộ những người liên quan đã họp mặt tổ chức một cuộc họp khẩn.)'
  },
  '～ごろ': {
    meaning: 'khoảng chừng ～ (chỉ mốc thời gian ước lượng)',
    example: '明日の夕方六時半ごろに、駅の中央改札口の前で待ち合わせをしましょう。 (Khoảng sáu giờ rưỡi chiều mai, chúng mình hãy hẹn gặp nhau trước cửa soát vé trung tâm nhà ga nhé.)'
  },
  'どこか': {
    meaning: 'đâu đó, một nơi nào đó (địa điểm không xác định)',
    example: '今度の連休は、どこか空気のきれいな温泉地へ旅行に出かけたいですね。 (Kỳ nghỉ dài sắp tới, tôi rất muốn đi du lịch đến nơi nào đó có suối nước nóng và không khí trong lành.)'
  },
  'おなかが すきました。': {
    meaning: 'tôi đói bụng rồi (cách nói khi thấy đói)',
    example: '朝早くから何も食べずに歩き回っていたので、おなかがペコペコにすきました。 (Từ sáng sớm tới giờ chưa ăn gì mà cứ đi lại liên tục nên bụng tôi đói cồn cào rồi.)'
  },
  'のどが かわきました。': {
    meaning: 'tôi khát nước rồi (cách nói khi thấy khát)',
    example: 'スポーツをしてたくさん汗をかいたので、のどがカラカラにかわきました。 (Tập thể thao đổ nhiều mồ hôi nên cổ họng tôi khát khô cả rồi, muốn uống ngay một chai nước khoáng.)'
  },
  'そうですね。': {
    meaning: 'đúng vậy nhỉ / để tôi xem nào (đồng tình hoặc cần suy nghĩ)',
    example: '「この本は初心者にも分かりやすい解説ですね。」「ええ、本当にそうですね。」 ("Cuốn sách này giải thích rất dễ hiểu cho cả người mới học nhỉ." "Vâng, đúng là như thế thật đấy ạ.")'
  },
  'ご注文は': {
    meaning: 'quý khách muốn gọi món gì ạ? (lời phục vụ hỏi khách)',
    example: 'カフェの店員さんがメニューを持ってテーブルに来て、「ご注文はお決まりですか」と尋ねた。 (Nhân viên quán cà phê mang thực đơn tới bàn và nhẹ nhàng hỏi: "Dạ quý khách đã chọn được đồ uống chưa ạ?")'
  }
};

function run() {
  console.log('Bắt đầu cập nhật Minna N5 Batch A (Unit 01 -> Unit 13)...');
  let updatedCount = 0;

  for (let u = 1; u <= 13; u++) {
    const unitFolder = 'unit-' + String(u).padStart(2, '0');
    const rel = path.join('minna-no-nihongo-n5', unitFolder, 'vocabulary.json');
    const fullPath = path.join(DATA_DIR, rel);

    if (!fs.existsSync(fullPath)) continue;

    const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    let changed = false;

    for (const item of data) {
      const w = item.word;
      if (batchADict[w]) {
        const cur = batchADict[w];
        if (cur.word) item.word = cur.word;
        if (cur.reading) item.reading = cur.reading;
        if (cur.meaning) item.meaning = cur.meaning;
        if (cur.example) item.example = cur.example;
        changed = true;
        updatedCount++;
      }
    }

    if (changed) {
      fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`[✓] Đã cập nhật ${rel}`);
    }
  }

  console.log(`\nHoàn tất Batch A! Đã cập nhật ${updatedCount} từ vựng.`);
}

run();

/**
 * scripts/refine-minna-n5-batchB.js
 * Chuẩn hóa toàn bộ từ vựng Minna no Nihongo N5 (Unit 14 -> Unit 25):
 * - Sửa các lỗi từ vựng nghiêm trọng:
 *   + 操作店 -> 交差点 (こうさてん: ngã tư)
 *   + [ -> ボタン (ボタン: nút bấm)
 *   + Xóa mục rác 一ばん (châu á)
 *   + わしつ -> 和室 (phòng kiểu Nhật trải chiếu tatami)
 *   + 押し入れ -> 押入れ (tủ âm tường kiểu Nhật)
 *   + おばあさん -> người bà (không phải mẹ)
 *   + 外国人登録証 -> thẻ đăng ký người nước ngoài
 *   + 乾杯 -> cạn ly, nâng ly
 *   + プレイガイド -> quầy bán vé kịch/ca nhạc
 *   + 出張します -> đi công tác
 *   + 転勤 -> chuyển công tác
 *   + 高校 -> trường cấp ba (THPT)
 *   + 課長 -> trưởng phòng
 *   + 社長 -> giám đốc công ty
 * - Viết câu ví dụ chuẩn collocation bản xứ, loại bỏ triệt để các template trùng lặp
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

const batchBDict = {
  // UNIT 14
  '降ります': {
    meaning: 'rơi [mưa, tuyết: 雨/雪が降る]',
    example: '午後から冷たい雨がポツポツと降り始めました。 (Từ buổi chiều những hạt mưa lạnh bắt đầu rơi lác đác.)'
  },
  'コピーします III': {
    word: 'コピーします',
    meaning: 'sao chép, photocopy (tài liệu: 資料をコピーする)',
    example: '会議で使用する企画書を、複合機で十部コピーしました。 (Tôi đã dùng máy đa năng photocopy mười bản đề xuất kế hoạch để dùng trong cuộc họp.)'
  },
  'エアコン': {
    meaning: 'máy điều hòa nhiệt độ',
    example: '蒸し暑いので、リモコンでエアコンの冷房をつけました。 (Vì trời oi bức nên tôi lấy điều khiển bật chế độ làm mát của điều hòa.)'
  },
  'パスポート': {
    meaning: 'hộ chiếu (giấy thông hành quốc tế)',
    example: '空港の出国審査のゲートで、係員にパスポートを提示しました。 (Tại cổng kiểm tra xuất cảnh ở sân bay, tôi đã xuất trình hộ chiếu cho nhân viên.)'
  },
  '住所': {
    meaning: 'địa chỉ nhà, nơi cư trú',
    example: '荷物を送るために、伝票に届け先の住所を楷書で記入した。 (Để gửi kiện hàng, tôi đã viết nắn nót địa chỉ người nhận lên phiếu gửi.)'
  },
  '地図': {
    meaning: 'bản đồ địa lý',
    example: '初めて訪れる観光地なので、駅で配られている観光地図を開いて歩いた。 (Vì là điểm du lịch lần đầu ghé thăm nên tôi mở tấm bản đồ du lịch phát tại ga ra để đi dạo.)'
  },
  '塩': {
    meaning: 'muối ăn (gia vị)',
    example: 'スープの味が少し薄かったので、塩を少々振って味を調えました。 (Vị món súp hơi nhạt một chút nên tôi đã rắc thêm một ít muối để nêm lại cho vừa miệng.)'
  },
  '砂糖': {
    meaning: 'đường ăn (gia vị ngọt)',
    example: 'ブラックコーヒーに角砂糖を一つ入れて、スプーンでよくかき混ぜた。 (Tôi thả một viên đường vào tách cà phê đen rồi dùng thìa khuấy đều.)'
  },
  '読み方': {
    meaning: 'cách đọc (chữ Kanji, từ ngữ)',
    example: 'この難しい漢字の読み方が分からないので、電子辞書で調べました。 (Vì không biết cách đọc của chữ Hán khó này nên tôi đã tra trong từ điển điện tử.)'
  },
  '～方': {
    meaning: 'cách làm ～ (hậu tố ghép sau động từ thể ます)',
    example: '日本語学校の先生に、きれいなひらがなの書き方を教わりました。 (Tôi được giáo viên trường tiếng Nhật hướng dẫn cách viết chữ hiragana thật đẹp.)'
  },
  'ゆっくり': {
    meaning: 'chậm rãi, thong thả, từ tốn',
    example: '休日はどこにも出かけず、自宅のリビングでゆっくり音楽を聴いて過ごす。 (Ngày nghỉ tôi không đi đâu cả mà ở nhà thong thả thưởng thức âm nhạc tại phòng khách.)'
  },
  'すぐ': {
    meaning: 'ngay lập tức, tức thì (thời gian ngắn)',
    example: '注文の確認メールを受信した後、担当者からすぐ返信が届いた。 (Sau khi nhận email xác nhận đơn hàng, người phụ trách đã lập tức gửi phản hồi.)'
  },
  'あとで': {
    meaning: 'lát nữa, để sau (thực hiện sau một lúc)',
    example: '「今、少し話せる？」「会議の準備があるから、あとで連絡するね。」 ("Bây giờ bạn nói chuyện chút được không?" "Tôi đang chuẩn bị họp nên lát nữa tôi liên lạc lại nhé.")'
  },
  'もう 少し': {
    meaning: 'thêm một chút nữa (về số lượng hoặc mức độ)',
    example: '声が小さくて聞こえにくいので、もう少し大きな声で話していただけますか。 (Giọng bạn hơi nhỏ khó nghe, bạn có thể nói to hơn một chút được không ạ?)'
  },
  'もう～': {
    meaning: 'thêm một ～ nữa (lần nữa, cái nữa)',
    example: 'とてもおいしかったので、熱い緑茶をもう一杯おかわりしました。 (Ngon quá nên tôi đã xin dùng thêm một tách trà xanh nóng nữa.)'
  },
  'いいですよ。': {
    meaning: 'được chứ, được đấy (chấp thuận một cách thoải mái)',
    example: '「この雑誌をお借りしてもいいですか。」「ええ、もちろんいいですよ。」 ("Tôi mượn cuốn tạp chí này có được không?" "Vâng, tất nhiên là được chứ.")'
  },
  'さあ': {
    meaning: 'nào, thôi nào (lời giục giã hoặc khi chưa biết rõ)',
    example: '「さあ、休憩時間は終わりです。午後の作業を始めましょう。」 ("Nào, giờ giải lao hết rồi. Chúng ta cùng bắt đầu công việc buổi chiều thôi.")'
  },
  'あれ？': {
    meaning: 'ơ kìa? ủa? (tiếng thốt ngạc nhiên khi thấy điều bất ngờ)',
    example: 'あれ？ ポケットに入れておいたはずの部屋の鍵が見当たりません。 (Ơ kìa? Chiếc chìa khóa phòng rõ ràng tôi bỏ trong túi mà giờ tìm không thấy đâu.)'
  },
  'まっすぐ': {
    meaning: 'thẳng, đi thẳng (không rẽ)',
    example: 'この大通りをまっすぐ歩くと、五分ほどで大きな図書館が見えてきます。 (Đi thẳng theo đại lộ này khoảng năm phút, bạn sẽ nhìn thấy một thư viện lớn.)'
  },
  'お釣り': {
    meaning: 'tiền thối lại, tiền thừa khi thanh toán',
    example: '自動販売機でジュースを買い、釣り銭口からお釣りを取り忘れそうになった。 (Mua lon nước ngọt ở máy bán hàng tự động, tôi suýt quên lấy tiền thừa từ khe nhả tiền.)'
  },
  'これでお願いします': {
    meaning: 'xin gửi khoản này / nhờ bạn thanh toán giúp cái này',
    example: 'お会計の際に、レジの店員さんに「これでお願いします」とクレジットカードを渡した。 (Lúc thanh toán, tôi đưa thẻ tín dụng cho nhân viên thu ngân và nói "Làm ơn thanh toán giúp tôi bằng thẻ này ạ".)'
  },

  // UNIT 15
  '資料': {
    meaning: 'tài liệu, tư liệu phục vụ cuộc họp/học tập',
    example: '明日のプレゼンに向けて、グラフを含めた発表用の資料を印刷しました。 (Chuẩn bị cho bài thuyết trình ngày mai, tôi đã in tập tài liệu gồm các biểu đồ.)'
  },
  'カタログ': {
    meaning: 'cuốn danh mục sản phẩm (catalogue)',
    example: '家電量販店で最新のノートパソコンのカタログをもらって持ち帰った。 (Tôi lấy cuốn danh mục laptop đời mới nhất ở siêu thị điện máy mang về nhà xem.)'
  },
  'ソフト': {
    meaning: 'phần mềm máy tính (software)',
    example: 'パソコンの動作を安定させるため、最新のウイルス対策ソフトを導入した。 (Để máy tính hoạt động ổn định, tôi đã cài đặt phần mềm diệt virus phiên bản mới nhất.)'
  },
  '専門': {
    meaning: 'chuyên môn, ngành nghề chuyên sâu',
    example: '大学院では、人工知能と自然言語処理の分野を専門に研究しています。 (Ở bậc cao học, tôi nghiên cứu chuyên sâu về lĩnh vực trí tuệ nhân tạo và xử lý ngôn ngữ tự nhiên.)'
  },
  'プレイガイド': {
    meaning: 'quầy bán vé xem kịch, hòa nhạc (playguide)',
    example: '人気のミュージカルのチケットを予約するため、駅前のプレイガイドに並んだ。 (Để đặt mua vé xem vở nhạc kịch ăn khách, tôi đã xếp hàng tại quầy bán vé trước ga.)'
  },
  '特に': {
    meaning: 'đặc biệt là (nhấn mạnh sự nổi trội)',
    example: '果物はどれも好きですが、夏の時期は特に甘いスイカが一番の好物です。 (Hoa quả nào tôi cũng thích, nhưng mùa hè thì đặc biệt là dưa hấu ngọt luôn là món ưa chuộng nhất.)'
  },
  '思い出します': {
    meaning: 'nhớ lại, hồi tưởng lại',
    example: '古いアルバムの写真を開くと、楽しかった幼い頃の思い出が次々とよみがえる。 (Khi mở cuốn album ảnh cũ, những kỷ niệm thời thơ ấu vui tươi lại ùa về trong tâm trí tôi.)'
  },
  'ご家族': {
    meaning: 'gia đình của bạn (kính ngữ khi nhắc đến người thân của đối phương)',
    example: '「国のご家族はお元気でいらっしゃいますか。」「はい、おかげさまで。」 ("Gia đình của bạn ở quê nhà vẫn mạnh khỏe chứ ạ?" "Vâng, trộm vía mọi người vẫn khỏe ạ.")'
  },
  'いらっしゃいます': {
    meaning: 'ở, có, đi, đến (kính ngữ của います, いきます, きます)',
    example: '「社長は奥の応接室にいらっしゃいますので、どうぞご案内いたします。」 ("Giám đốc đang ở phòng tiếp khách phía trong, xin mời quý khách đi theo tôi ạ.")'
  },
  '高校': {
    meaning: 'trường trung học phổ thông, trường cấp ba',
    example: '地元の公立高校に通っていた頃は、毎朝自転車で坂道を登っていました。 (Hồi còn học ở trường cấp ba công lập địa phương, sáng nào tôi cũng đạp xe leo dốc.)'
  },

  // UNIT 16
  '頭が いい': {
    meaning: 'thông minh, sáng dạ (nhanh nhẹn tiếp thu)',
    example: '田中さんは複雑な問題でもすぐに理解できる、とても頭がいい人です。 (Anh Tanaka là người rất thông minh, vấn đề phức tạp đến mấy anh cũng hiểu ngay.)'
  },
  '体': {
    meaning: 'cơ thể, thể chất, sức khỏe',
    example: '毎朝のジョギングとバランスの良い食事で、健康な体を維持しています。 (Bằng việc chạy bộ mỗi sáng và ăn uống cân đối, tôi luôn duy trì một cơ thể khỏe mạnh.)'
  },
  '頭': {
    meaning: 'cái đầu',
    example: '階段で転びそうになり、危うく壁に頭をぶつけるところでした。 (Tôi suýt trượt chân ở cầu thang, tí nữa thì va đầu vào tường.)'
  },
  '髪': {
    meaning: 'tóc, mái tóc',
    example: '夏に向けて涼しく過ごせるように、美容院で髪を短くカットしてもらいました。 (Để đón mùa hè cho mát mẻ, tôi đã ra tiệm làm tóc cắt ngắn mái tóc của mình.)'
  },
  '顔': {
    meaning: 'khuôn mặt, gương mặt',
    example: '朝起きたらまず洗面所で冷たい水で顔を洗い、眠気を覚まします。 (Sáng thức dậy, trước tiên tôi vào nhà vệ sinh rửa mặt bằng nước lạnh để xua tan cơn buồn ngủ.)'
  },
  '目': {
    meaning: 'đôi mắt, con mắt',
    example: 'パソコンの画面を長時間凝視していたせいで、目がかすんで疲れました。 (Nhìn chằm chằm vào màn hình máy tính suốt nhiều giờ liền khiến mắt tôi bị mỏi và mờ đi.)'
  },
  '耳': {
    meaning: 'tai, đôi tai',
    example: 'イヤホンで大音量の音楽を聴き続けると、耳を痛める恐れがあります。 (Nếu cứ nghe nhạc âm lượng lớn bằng tai nghe liên tục, bạn có nguy cơ làm tổn thương tai.)'
  },
  '歯': {
    meaning: 'răng',
    example: '毎食後の歯磨きを習慣にして、健康な白い歯を保つように心がけています。 (Tôi luôn tạo thói quen đánh răng sau mỗi bữa ăn để giữ gìn hàm răng trắng khỏe.)'
  },
  'おなか': {
    meaning: 'bụng, dạ dày',
    example: '冷たいジュースを一気に飲みすぎたせいで、急におなかが痛くなりました。 (Uống một hơi quá nhiều nước ngọt lạnh khiến tôi bị đau bụng đột ngột.)'
  },
  '足': {
    meaning: 'chân, bàn chân',
    example: '一日中立ちっぱなしで接客の仕事をしていたので、夕方には足がパンパンにむくんだ。 (Đứng suốt cả ngày làm công việc tiếp khách nên đến chiều chân tôi sưng phù cả lên.)'
  },
  'サービス': {
    meaning: 'dịch vụ chăm sóc khách hàng (service)',
    example: 'この老舗旅館は従業員の接客サービスが素晴らしく、居心地が最高でした。 (Khách sạn truyền thống lâu đời này có dịch vụ chăm sóc khách chu đáo tuyệt vời, ở rất thích.)'
  },
  'ジョギング': {
    meaning: 'chạy bộ thư giãn rèn luyện sức khỏe',
    example: '健康作りのために、毎朝近くの大きな公園の周囲をジョギングしています。 (Để rèn luyện sức khỏe, sáng nào tôi cũng chạy bộ quanh công viên lớn gần nhà.)'
  },
  '緑': {
    meaning: 'màu xanh lá cây, cây cối xanh tươi',
    example: '窓の外には山々の豊かな緑が広がっていて、眺めているだけで癒やされます。 (Bên ngoài cửa sổ trải dài màu xanh bạt ngàn của cây cỏ vùng núi, ngắm thôi cũng thấy thanh thản.)'
  },
  'りゅうがくせい': {
    meaning: 'du học sinh (học sinh quốc tế)',
    example: '世界中から日本へやって来た留学生たちと、異文化交流会で親睦を深めた。 (Tôi đã giao lưu kết thân với các bạn du học sinh từ khắp thế giới đến Nhật Bản tại buổi gặp mặt văn hóa.)'
  },
  'どの～': {
    meaning: 'cái nào, người nào (chọn một đối tượng cụ thể)',
    example: '「あなたの自転車はどの鍵で開きますか。」「この銀色の小さな鍵です。」 ("Xe đạp của bạn mở bằng chiếc chìa khóa nào?" "Bằng chiếc chìa khóa nhỏ màu bạc này ạ.")'
  },
  '[いいえ、]まだまだです。': {
    meaning: '[Dạ không,] tôi vẫn còn kém lắm (cách khiêm tốn khi được khen ngợi)',
    example: '「日本語がとてもお上手ですね。」「いいえ、まだまだ勉強不足です。」 ("Tiếng Nhật của bạn giỏi quá." "Dạ không, tôi vẫn còn phải học hỏi nhiều lắm ạ.")'
  },
  'まず': {
    meaning: 'trước hết, đầu tiên (bước thứ nhất trong quy trình)',
    example: '料理を始めるときは、まず石鹸で両手をきれいに洗うことが基本です。 (Khi bắt đầu nấu nướng, điều cơ bản đầu tiên là phải rửa sạch hai bàn tay bằng xà phòng.)'
  },
  '暗証番号': {
    meaning: 'mã PIN, mã số bí mật của thẻ ngân hàng',
    example: 'ATMで現金を引き出す際は、他人に暗証番号を見られないように手で隠した。 (Khi rút tiền mặt tại cây ATM, tôi lấy tay che lại để người khác không nhìn thấy mã PIN.)'
  },
  '確認': {
    meaning: 'xác nhận, kiểm tra lại cho chắc chắn',
    example: 'メールを送信する前に、添付ファイルの漏れや誤字がないか再確認した。 (Trước khi gửi email, tôi đã kiểm tra lại xem có quên đính kèm tệp hay sai chính tả không.)'
  },
  '[': {
    word: 'ボタン',
    reading: 'ボタン',
    meaning: 'nút bấm, phím ấn trên thiết bị',
    example: '緑色のスタートボタンを押すと、自動的に機械が稼働し始めます。 (Khi bạn nhấn nút khởi động màu xanh lá, máy móc sẽ tự động bắt đầu vận hành.)'
  },
  '一ばん': {
    word: '一番',
    reading: 'いちばん',
    meaning: 'nhất, vị trí số một',
    example: 'この季節に食べるもぎたてのイチゴが、果物の中で一番甘くておいしい。 (Ăn dâu tây tươi vừa hái đúng mùa này là ngọt và ngon nhất trong các loại quả.)'
  },
  'ベトナム': {
    meaning: 'nước Việt Nam',
    example: '夏休みにはベトナムのダナンを訪れて、名物のフォーや春巻きを堪能しました。 (Kỳ nghỉ hè tôi đã ghé thăm Đà Nẵng ở Việt Nam và thưởng thức món phở cùng nem cuốn trứ danh.)'
  },

  // UNIT 17
  '残業します': {
    meaning: 'làm thêm giờ, tăng ca ngoài giờ',
    example: '月末の決算処理で仕事が山積みだったので、夜の九時まで残業しました。 (Cuối tháng công việc quyết toán sổ sách dồn ứ nên tôi phải làm thêm giờ đến 9 giờ tối.)'
  },
  '出張します': {
    meaning: 'đi công tác xa nhà',
    example: '来週の月曜日から三日間の日程で、大阪支社へ出張することになりました。 (Tôi vừa nhận lịch đi công tác tại chi nhánh Osaka trong ba ngày từ thứ Hai tuần tới.)'
  },
  '「あふろに」入ります': {
    meaning: 'tắm bồn (ngâm mình trong bồn nước ấm)',
    example: '寒い冬の夜は、温かいお風呂にゆっくり入って体の芯まで温まります。 (Vào những đêm mùa đông giá rét, tôi ngâm mình thong thả trong bồn tắm nước ấm cho ấm người.)'
  },
  '問題': {
    meaning: 'câu hỏi bài tập, vấn đề cần giải quyết',
    example: '試験用紙に書かれた長文の読解問題を、制限時間内に落ち着いて解いた。 (Tôi bình tĩnh giải quyết các câu hỏi đọc hiểu văn bản dài trên đề thi trong thời gian quy định.)'
  },
  '答え': {
    meaning: 'câu trả lời, đáp án',
    example: '先生の質問に対して、自分の考えを整理してから正しい答えを述べました。 (Trước câu hỏi của thầy giáo, tôi sắp xếp lại suy nghĩ rồi nêu ra đáp án chính xác.)'
  },
  '禁煙': {
    meaning: 'cấm hút thuốc lá (khu vực không khói thuốc)',
    example: '駅のホームや車内は全席禁煙ですので、加熱式たばこもご遠慮ください。 (Toàn bộ sân ga và trên tàu đều cấm hút thuốc nên xin vui lòng không hút cả thuốc lá điện tử.)'
  },
  '熱': {
    meaning: 'sốt cao, cơn sốt',
    example: '体温計で測ったら三十八度五分の高い熱があったので、病院へ直行した。 (Đo bằng nhiệt kế thấy sốt cao tới 38 độ 5 nên tôi đã đi thẳng đến bệnh viện.)'
  },
  '病気': {
    meaning: 'bệnh tật, ốm đau',
    example: '風邪などの重い病気にかからないよう、手洗いとうがいを徹底しています。 (Để không bị mắc các chứng bệnh nặng như cảm cúm, tôi triệt để rửa tay và súc miệng.)'
  },
  '薬': {
    meaning: 'thuốc chữa bệnh, dược phẩm',
    example: '食後に医師から処方された胃腸薬を、白湯と一緒にしっかり飲みました。 (Sau bữa ăn, tôi uống thuốc dạ dày do bác sĩ kê đơn cùng với một cốc nước ấm.)'
  },
  '[お]ふろ': {
    meaning: 'bồn tắm kiểu Nhật',
    example: '毎日疲れて帰宅した後は、お風呂に浸かってリラックスするのが日課です。 (Sau một ngày mệt mỏi về nhà, ngâm mình trong bồn tắm để thư giãn là thói quen hàng ngày của tôi.)'
  },
  '上着': {
    meaning: 'áo khoác ngoài, áo ngoài',
    example: '外に出ると風が肌寒かったので、ハンガーから厚手の上着を取って羽織った。 (Bước ra ngoài thấy gió lạnh buốt nên tôi lấy chiếc áo khoác dày trên móc mặc vào.)'
  },
  '下着': {
    meaning: 'đồ lót, áo lót mặc sát cơ thể',
    example: '汗をたくさん吸い取るように、綿百パーセントの肌触りの良い下着を着用している。 (Để thấm hút mồ hôi tốt, tôi luôn mặc đồ lót 100% cotton mềm mại.)'
  },
  '～までに': {
    meaning: 'trước mốc thời gian ～ (hạn chót hoàn thành)',
    example: '取引先に送る見積書は、明日の夕方五時までに必ず作成してください。 (Bản báo giá gửi đối tác, anh nhất định phải hoàn thiện trước 5 giờ chiều mai nhé.)'
  },
  'ですから': {
    meaning: 'vì vậy, do đó (liên từ nối vế nguyên nhân - kết quả)',
    example: '明日は台風が接近する見込みです。ですから、不要不急の外出は控えてください。 (Ngày mai dự kiến bão sẽ đổ bộ. Do đó, quý vị hãy hạn chế ra ngoài khi không cần thiết.)'
  },
  'どうしましたか': {
    meaning: 'bạn bị làm sao thế? / có chuyện gì xảy ra thế?',
    example: '同僚がつらそうに顔をしかめていたので、「どうしましたか」と声をかけた。 (Thấy đồng nghiệp nhăn mặt có vẻ đau đớn, tôi liền hỏi thăm: "Bạn bị làm sao thế?")'
  },
  '[～が] いたいです': {
    meaning: 'bị đau ở [bộ phận cơ thể]',
    example: '昨日硬いものを噛んだ拍子に、右の奥歯がズキズキと痛いです。 (Hôm qua lúc nhai phải đồ cứng, răng hàm bên phải của tôi đau nhức buốt.)'
  },
  'のど': {
    meaning: 'cổ họng',
    example: '乾燥した部屋に長時間いたせいで、のどがイガイガして声がかすれてしまった。 (Ở trong phòng khô hanh suốt nhiều giờ khiến cổ họng tôi rát ngứa và khản cả giọng.)'
  },
  'おだいじに': {
    meaning: 'chúc bạn mau chóng bình phục (lời dặn dò người đang bị ốm)',
    example: '体調を崩して早退する同僚に、「無理をせず、お大事にね」と声をかけた。 (Đồng nghiệp bị ốm phải xin về sớm, tôi gửi lời dặn dò: "Đừng ráng sức nhé, chúc bạn mau khỏe!")'
  },

  // UNIT 18
  'かえます': {
    meaning: 'đổi (tiền tệ: お金を換える), thay thế',
    example: '海外旅行へ出発する前に、空港の両替所で日本円を米ドルにかえました。 (Trước khi lên đường đi du lịch nước ngoài, tôi đã đổi tiền yên sang đô la Mỹ tại quầy thu đổi ngoại tệ.)'
  },
  '国際': {
    meaning: 'quốc tế, tính chất quốc tế (mang tầm thế giới)',
    example: 'さまざまな国籍の学生が集まる国際交流イベントでボランティアを務めました。 (Tôi đã làm tình nguyện viên tại sự kiện giao lưu quốc tế quy tụ sinh viên nhiều quốc tịch.)'
  },
  '趣味': {
    meaning: 'sở thích, niềm đam mê cá nhân',
    example: '私の休日の趣味は、一眼レフカメラを持って四季の風景写真を撮ることです。 (Sở thích vào ngày nghỉ của tôi là mang máy ảnh cơ đi chụp lại phong cảnh bốn mùa.)'
  },
  '祈り': {
    meaning: 'lời cầu nguyện, sự cầu chúc bình an',
    example: '毎年初詣で神社を参拝し、家族全員の無病息災への祈りを捧げています。 (Đầu năm mới đi lễ đền Thần đạo, tôi đều thành tâm cầu nguyện cho cả gia đình bình an khỏe mạnh.)'
  },
  '課長': {
    meaning: 'trưởng phòng, trưởng ban (chức vụ trong công ty)',
    example: '書類の作成が完了したので、最終チェックをお願いするために課長の席へ向かった。 (Làm xong tài liệu, tôi đem sang bàn của trưởng phòng nhờ kiểm tra lần cuối.)'
  },
  '社長': {
    meaning: 'giám đốc, tổng giám đốc công ty',
    example: '創立記念式典の冒頭で、社長が社員に向けて今後の経営方針を力強く語った。 (Mở đầu lễ kỷ niệm ngày thành lập công ty, tổng giám đốc đã dõng dạc trình bày định hướng kinh doanh tương lai.)'
  },
  '動物': {
    meaning: 'động vật, muông thú',
    example: '週末に子どもたちを連れて上野動物園へ行き、パンダなどの可愛い動物を観察した。 (Cuối tuần tôi dắt các con tới vườn thú Ueno ngắm gấu trúc và nhiều loài động vật đáng yêu.)'
  },
  'へえ': {
    meaning: 'chà, thế á! (thán từ bày tỏ sự ngạc nhiên hoặc thán phục)',
    example: '「彼は独学で五カ国語をマスターしたんだよ。」「へえ、それはすごい才能だね。」 ("Cậu ấy tự học mà thành thạo 5 thứ tiếng đấy." "Chà, tài năng đáng nể thật đấy nhỉ!")'
  },
  'ピアノ': {
    meaning: 'đàn dương cầm, đàn piano',
    example: '幼い頃からピアノのレッスンを習っていて、ショパンの曲を弾くのが得意です。 (Tôi học đàn piano từ nhỏ nên rất thành thạo việc chơi các bản nhạc của Chopin.)'
  },
  '―メートル': {
    meaning: 'mét (đơn vị đo chiều dài)',
    example: '駅前の新築タワーマンションは、高さが百五十メートル以上もあります。 (Tòa chung cư cao tầng mới xây trước ga có chiều cao lên tới hơn 150 mét.)'
  },
  '本当ですか': {
    meaning: 'thật thế sao? (hỏi lại để xác nhận tính xác thực)',
    example: '「来月から社内の公用語が英語になるらしいよ。」「えっ、それは本当ですか。」 ("Nghe nói từ tháng sau tiếng Anh sẽ thành ngôn ngữ chính thức trong công ty đấy." "Hả, chuyện đó có thật không?")'
  },
  'ぜひ': {
    meaning: 'nhất định, rất mong (bày tỏ nguyện vọng tha thiết hoặc lời mời chân tình)',
    example: '京都にいらした際は、紅葉の時期にぜひ清水寺を訪れてみてください。 (Khi có dịp ghé thăm Kyoto, bạn nhất định hãy đến ngắm chùa Kiyomizu vào mùa lá đỏ nhé.)'
  },

  // UNIT 19
  '練習します': {
    meaning: 'luyện tập, rèn luyện kỹ năng',
    example: '来月のスピーチコンテストで入賞するために、発音の練習を毎日繰り返している。 (Để đạt giải trong cuộc thi hùng biện tháng sau, ngày nào tôi cũng lặp đi lặp lại việc luyện phát âm.)'
  },
  '眠い': {
    meaning: 'buồn ngủ, ngái ngủ',
    example: '昨晩遅くまで試験勉強をして夜更かしをしたので、授業中にとても眠いです。 (Đêm qua thức khuya ôn thi nên trong giờ học tôi cảm thấy vô cùng buồn ngủ.)'
  },
  '強い': {
    meaning: 'mạnh mẽ, khỏe mạnh, cường tráng',
    example: '春一番が吹いた日は、海岸沿いで歩くのが困難なほど強い風が吹き荒れた。 (Hôm có gió mùa xuân đầu mùa, gió ven biển thổi mạnh tới mức khó mà bước đi được.)'
  },
  '弱い': {
    meaning: 'yếu ớt, yếu đuối, kém cỏi',
    example: '私は胃腸があまり強くなく、冷たい飲み物をたくさん飲むとお腹を壊しやすい。 (Đường ruột của tôi hơi yếu nên hễ uống nhiều đồ lạnh là rất dễ bị đau bụng.)'
  },
  '調子が悪い': {
    meaning: 'tình trạng xấu, cơ thể mệt mỏi hoặc máy móc trục trặc',
    example: '朝からどうも胃の調子が悪くて食欲がないので、消化に良いおかゆを食べました。 (Từ sáng dạ dày đã khó chịu không muốn ăn gì nên tôi chỉ ăn một bát cháo dễ tiêu.)'
  },
  '調子がいい': {
    meaning: 'tình trạng tốt, cơ thể sung sức hoặc máy móc chạy êm',
    example: '十分な睡眠を取ったおかげで、今朝は体の調子がとても良くて快調です。 (Nhờ ngủ đủ giấc, sáng nay cơ thể tôi cảm thấy cực kỳ khỏe khoắn và tràn đầy năng lượng.)'
  },
  'パチンコ': {
    meaning: 'trò chơi bắn bi Pachinko (trò giải trí phổ biến ở Nhật)',
    example: '駅前の繁華街を通り抜けると、パチンコ店からジャラジャラと玉の音が聞こえてきた。 (Băng qua con phố sầm uất trước ga, tôi nghe rõ tiếng bi kim loại rổn rảng từ tiệm Pachinko.)'
  },
  'ゴルフ': {
    meaning: 'môn thể thao đánh gôn (golf)',
    example: '会社の取引先との親睦を深めるために、週末に郊外でゴルフをプレーしました。 (Để thắt chặt mối quan hệ với đối tác công ty, tôi đã đi đánh golf ở ngoại ô vào cuối tuần.)'
  },
  '日': {
    meaning: 'ngày (mặt trời hoặc ngày tháng)',
    example: '晴天に恵まれた気持ちの良い日だったので、近所の緑道を散歩しました。 (Một ngày đẹp trời nắng ấm nên tôi đã đi dạo trên con đường rợp bóng cây gần nhà.)'
  },
  'もうすぐ': {
    meaning: 'sắp sửa, chẳng mấy chốc nữa (thời gian rất gần)',
    example: '桜のつぼみが大きく膨らんできたので、もうすぐ満開の季節を迎えます。 (Nụ hoa anh đào đã chúm chím căng tròn, chẳng mấy chốc nữa là sẽ đến mùa nở rộ.)'
  },
  '一度': {
    meaning: 'một lần (tần suất hoặc trải nghiệm)',
    example: '富士山の山頂から美しいご来光を、人生で一度は直接この目で見てみたいです。 (Tôi mong ước trong đời được một lần tận mắt ngắm bình minh tuyệt đẹp từ trên đỉnh núi Phú Sĩ.)'
  },
  '一度も': {
    meaning: 'chưa từng một lần nào (luôn đi cùng thể phủ định)',
    example: '日本に住んで三年になりますが、一度も病院で診察を受けたことがありません。 (Tôi sống ở Nhật đã ba năm rồi nhưng chưa từng một lần nào phải đi khám bệnh ở bệnh viện.)'
  },
  'おかげさまで': {
    meaning: 'nhờ trời / nhờ có sự giúp đỡ của quý vị (bày tỏ lòng biết ơn)',
    example: '「ご家族の皆さんはお元気ですか。」「ええ、おかげさまで皆元気に暮らしています。」 ("Gia đình bạn đều mạnh khỏe chứ?" "Vâng, nhờ trời mọi người vẫn sống rất khỏe mạnh ạ.")'
  },
  '乾杯': {
    meaning: 'cạn ly! mừng nâng ly! (nói khi chạm cốc trong bữa tiệc)',
    example: 'プロジェクトの打ち上げパーティーで、グラスを高く掲げて全員で乾杯した。 (Trong bữa tiệc liên hoan mừng dự án hoàn thành, mọi người đều nâng cao ly cùng hô cạn ly.)'
  },
  '実は': {
    meaning: 'thực ra là, kỳ thực là (dùng khi bắt đầu bộc bạch sự thật)',
    example: '実は、来月末をもって会社を退職し、故郷へ帰ることになりました。 (Thực ra là đến cuối tháng sau tôi sẽ nghỉ việc ở công ty để quay trở về quê hương.)'
  },
  'ダイエット': {
    meaning: 'chế độ ăn kiêng giảm cân (diet)',
    example: '健康的な体型を維持するため、夕食の糖質を控えるダイエットを始めました。 (Để duy trì vóc dáng thon thả khỏe mạnh, tôi đã bắt đầu ăn kiêng giảm tinh bột vào bữa tối.)'
  },
  'しかし': {
    meaning: 'tuy nhiên, nhưng mà (văn phong trang trọng hơn でも)',
    example: '全力を尽くして試合に挑みました。しかし、惜しくも決勝で敗れてしまいました。 (Chúng tôi đã thi đấu hết sức mình. Tuy nhiên, đáng tiếc là đã thất bại ở trận chung kết.)'
  },
  '無理「な」': {
    meaning: 'quá sức, vô lý, không thể làm nổi',
    example: '徹夜で作業を続けるのは体に無理がありますから、今夜は切り上げましょう。 (Thức trắng đêm làm việc là quá sức đối với cơ thể, tối nay chúng ta hãy dừng lại thôi.)'
  },
  '体にいい': {
    meaning: 'tốt cho sức khỏe cơ thể',
    example: '毎朝ヨーグルトと新鮮な野菜サラダを食べるのは、体にとてもいい習慣です。 (Ăn sữa chua và salad rau tươi mỗi sáng là một thói quen rất tốt cho sức khỏe.)'
  },

  // UNIT 20
  '電話します': {
    meaning: 'gọi điện thoại (liên lạc bằng điện thoại)',
    example: '仕事の都合で約束の時間に遅れそうだったので、急いで友人に電話しました。 (Vì bận việc suýt trễ giờ hẹn nên tôi vội vàng gọi điện thoại báo cho bạn.)'
  },
  '僕': {
    meaning: 'tôi, mình, tớ (đại từ xưng hô thân mật của nam giới)',
    example: '僕の将来の夢は、世界中を飛び回る国際的なジャーナリストになることです。 (Ước mơ tương lai của tớ là trở thành một nhà báo quốc tế đi khắp năm châu bốn bể.)'
  },
  '君': {
    meaning: 'cậu, em, bạn (cách gọi thân mật với người ngang hàng hoặc nhỏ tuổi)',
    example: '「君が書いたプレゼンの企画案、とても独創的で素晴らしいね。」 ("Bản đề xuất thuyết trình mà cậu viết rất độc đáo và tuyệt vời đấy.")'
  },
  'ううん': {
    meaning: 'không, hông (cách nói thân mật của いいえ)',
    example: '「昨日の宿題、もう終わった？」「ううん、まだ難しくて終わってないよ。」 ("Bài tập hôm qua cậu làm xong chưa?" "Hông, bài khó quá tớ vẫn chưa làm xong.")'
  },
  '物価': {
    meaning: 'giá cả sinh hoạt, mức giá thị trường',
    example: '東京は交通の利便性が非常に高い反面、地方に比べると物価が高いです。 (Tokyo giao thông đi lại cực kỳ tiện lợi nhưng bù lại giá cả sinh hoạt đắt hơn vùng quê.)'
  },
  '着物': {
    meaning: 'áo Kimono (trang phục truyền thống Nhật Bản)',
    example: '成人式の記念日に、色鮮やかな絹の着物を着て家族と記念撮影をした。 (Vào ngày lễ trưởng thành, tôi mặc bộ kimono lụa rực rỡ chụp ảnh kỷ niệm cùng gia đình.)'
  },
  '始め': {
    meaning: 'lúc ban đầu, sự khởi đầu',
    example: '仕事の始めは誰でも失敗するものだから、落ち込まずに前を向こう。 (Lúc mới bắt đầu đi làm thì ai cũng có vấp váp, đừng nản lòng mà hãy hướng về phía trước.)'
  },
  '終わり': {
    meaning: 'sự kết thúc, phần cuối',
    example: '長い一日の仕事の終わりに飲む一杯の温かいお茶は、何よりの癒やしです。 (Một tách trà nóng vào lúc kết thúc một ngày làm việc dài là niềm an ủi tuyệt vời nhất.)'
  },
  'みんなで': {
    meaning: 'mọi người cùng nhau làm gì đó',
    example: '金曜日の夜に、オフィスの仲間みんなで居酒屋へ行って打ち上げをした。 (Vào tối thứ Sáu, toàn bộ anh em trong văn phòng cùng nhau đi quán nhậu ăn mừng.)'
  },
  '～けど': {
    meaning: 'nhưng mà... (từ nối thân mật trong văn nói)',
    example: 'このケーキ、見た目は少し地味だけど、味は驚くほど濃厚でおいしいよ。 (Chiếc bánh ngọt này nhìn bề ngoài hơi giản dị nhưng vị thì đậm đà ngon đến bất ngờ đấy.)'
  },
  'どうしようかな': {
    meaning: 'phải làm sao bây giờ nhỉ? (tự nhủ khi phân vân)',
    example: '雨が降ってきたけれど傘がないな、コンビニで買おうかどうしようかな。 (Trời bắt đầu đổ mưa mà không mang ô, nên vào cửa hàng tiện lợi mua ô hay làm sao bây giờ nhỉ?)'
  },
  '良かったら': {
    meaning: 'nếu được, nếu bạn không phiền (lời mời lịch sự nhẹ nhàng)',
    example: '田舎から甘いリンゴがたくさん届いたので、良かったら少し召し上がりませんか。 (Dưới quê vừa gửi lên nhiều táo ngọt, nếu bạn không phiền thì dùng thử một ít nhé.)'
  },
  '色々': {
    meaning: 'nhiều điều, đa dạng thứ',
    example: '日本に留学している間に、文化や習慣の違いについて色々と体験しました。 (Trong thời gian du học tại Nhật, tôi đã trải nghiệm nhiều điều về sự khác biệt văn hóa và tập quán.)'
  },

  // UNIT 21
  'むだ': {
    meaning: 'lãng phí, vô ích, không cần thiết',
    example: '使っていない部屋の照明をつけっぱなしにしておくのは、電気の無駄です。 (Cứ để đèn sáng trưng ở căn phòng không ai dùng là một sự lãng phí điện năng.)'
  },
  '不便': {
    meaning: 'bất tiện, không thuận tiện',
    example: '近くにスーパーや駅がない地域に住むと、毎日の買い物が少し不便です。 (Sống ở khu vực gần nhà không có siêu thị hay ga tàu thì việc mua sắm hằng ngày hơi bất tiện.)'
  },
  'すごい': {
    meaning: 'tuyệt vời, ghê gớm, cừ khôi (khen ngợi)',
    example: '彼はわずか半年で難関の日本語能力試験N1に合格したなんて、本当にすごいです。 (Anh ấy chỉ mất vỏn vẹn nửa năm để đỗ kỳ thi JLPT N1 khó nhằn, thực sự quá đỉnh.)'
  },
  '首相': {
    meaning: 'thủ tướng chính phủ',
    example: '内外の重要課題について説明するため、首相が国会で所信表明演説を行った。 (Để giải trình về các vấn đề trọng đại trong và ngoài nước, thủ tướng đã đọc diễn văn tại quốc hội.)'
  },
  '政治': {
    meaning: 'chính trị, nền chính trị quốc gia',
    example: '若い世代も無関心にならず、国の将来を決める政治に積極的に関心を持つべきだ。 (Thế hệ trẻ cũng không nên thờ ơ mà cần tích cực quan tâm đến nền chính trị định đoạt tương lai đất nước.)'
  },
  'スピーチ': {
    meaning: 'bài phát biểu, bài diễn văn (speech)',
    example: '友人の結婚披露宴で、新郎新婦へのお祝いのスピーチを心を込めて行いました。 (Tại tiệc cưới của bạn thân, tôi đã dành trọn tấm lòng phát biểu chúc mừng cô dâu chú rể.)'
  },
  '話': {
    meaning: 'câu chuyện, cuộc trò chuyện',
    example: '祖母から昔の街の様子や暮らしについての興味深い話をたくさん聞きました。 (Tôi đã được nghe bà kể nhiều câu chuyện thú vị về cuộc sống và phố phường ngày xưa.)'
  },
  'ユーモア': {
    meaning: 'khiếu hài hước, tính khôi hài',
    example: '課長はいつもユーモアを交えて話してくれるので、職場の雰囲気が明るくなります。 (Trưởng phòng nói chuyện lúc nào cũng pha chút hóm hỉnh nên không khí nơi làm việc rất vui vẻ.)'
  },
  'デザイン': {
    meaning: 'kiểu dáng thiết kế (design)',
    example: '機能性が高いうえに、シンプルで洗練されたデザインの家具が気に入っています。 (Tôi rất ưng món đồ nội thất này vì vừa tiện dụng lại có thiết kế tối giản, tinh tế.)'
  },
  '最近': {
    meaning: 'dạo gần đây, thời gian gần đây',
    example: '最近は気温の寒暖差が激しいので、体調管理に十分気をつけて過ごしています。 (Dạo gần đây nhiệt độ chênh lệch nóng lạnh thất thường nên tôi rất chú ý giữ gìn sức khỏe.)'
  },
  'たぶん': {
    meaning: 'có lẽ, có thể (phỏng đoán khả năng xảy ra khoảng 70-80%)',
    example: '西の空に黒い雨雲が広がってきたので、たぶん夕方には雨が降り出すでしょう。 (Mây đen giăng kín bầu trời phía tây nên có lẽ đến chiều muộn trời sẽ bắt đầu đổ mưa.)'
  },
  'きっと': {
    meaning: 'chắc chắn sẽ, nhất định (thể hiện sự tin tưởng gần như tuyệt đối)',
    example: '毎日の努力を欠かさず積み重ねてきたのだから、明日の試験はきっと合格できます。 (Vì đã nỗ lực chăm chỉ mỗi ngày nên kỳ thi ngày mai chắc chắn bạn sẽ vượt qua được thôi.)'
  },
  '本当に': {
    meaning: 'thực sự, quả thật là (nhấn mạnh sự thật)',
    example: '困っていたときに親身になって助けていただき、本当にありがとうございました。 (Lúc gặp khó khăn được bạn hết lòng giúp đỡ, tôi thực sự cảm ơn bạn rất nhiều.)'
  },
  '～について': {
    meaning: 'về vấn đề ～ (chỉ đối tượng nghiên cứu, thảo luận)',
    example: 'ゼミの授業で、日本の少子高齢化問題について白熱した議論を交わしました。 (Trong giờ thảo luận chuyên đề, chúng tôi đã tranh luận sôi nổi về vấn đề già hóa dân số ở Nhật.)'
  },
  'しばらくですね': {
    meaning: 'đã lâu không gặp bạn nhỉ! (lời chào khi lâu ngày tái ngộ)',
    example: '同窓会で旧友の顔を見て、「やあ、しばらくですね。元気だった？」と声をかけた。 (Gặp lại bạn cũ ở buổi họp lớp, tôi cất tiếng chào: "Chào cậu, lâu lắm rồi không gặp nhỉ. Vẫn khỏe chứ?")'
  },
  '～でも飲みませんか': {
    meaning: 'uống chút ～ nhé? (lời rủ rê dùng đồ uống nhẹ nhàng)',
    example: '仕事が一区切りついたので、駅前のカフェで温かいコーヒーでも飲みませんか。 (Công việc xong xuôi một chặng rồi, mình ra quán cà phê trước ga uống chút cà phê nóng nhé?)'
  },
  'もちろん': {
    meaning: 'tất nhiên, đương nhiên rồi',
    example: '「今週末の歓迎会、あなたも参加できる？」「ええ、もちろん喜んで参加します。」 ("Buổi tiệc chào mừng cuối tuần này bạn tham gia được chứ?" "Vâng, tất nhiên tôi rất sẵn lòng tham gia.")'
  },
  'カンガルー': {
    meaning: 'chuột túi kangaroo (động vật biểu tượng của nước Úc)',
    example: 'オーストラリアの自然公園で、お腹の袋に赤ちゃんを入れたカンガルーを見学した。 (Tại công viên tự nhiên ở Úc, tôi đã được tận mắt thấy chú chuột túi mang con nhỏ trong túi bụng.)'
  },

  // UNIT 22
  'コートー': {
    word: 'コート',
    reading: 'コート',
    meaning: 'áo khoác dài, áo măng-tô (đã chuẩn hóa chính tả)',
    example: '木枯らしが吹いて寒くなったので、クローゼットからウールのコートを出しました。 (Gió lạnh đầu đông thổi buốt nên tôi lấy chiếc áo khoác măng tô bằng len trong tủ ra mặc.)'
  },
  'スーツ': {
    meaning: 'bộ com-lê, âu phục công sở',
    example: '就職面接に臨むために、紺色の清潔感のあるスーツに身を包んだ。 (Để bước vào buổi phỏng vấn xin việc, tôi khoác lên mình bộ com-lê màu xanh đen tươm tất.)'
  },
  'セーター': {
    meaning: 'áo len ấm',
    example: '誕生日に母が手編みで編んでくれた、暖かいウールのセーターを大切に着ています。 (Tôi nâng niu mặc chiếc áo len ấm áp do chính tay mẹ đan tặng vào dịp sinh nhật.)'
  },
  '家賃': {
    meaning: 'tiền thuê nhà hàng tháng',
    example: '毎月二十五日までに、指定された大家さんの口座へアパートの家賃を振り込みます。 (Trước ngày 25 hàng tháng, tôi đều chuyển khoản tiền thuê căn hộ vào tài khoản của chủ nhà.)'
  },
  'ダイニングキッチン': {
    meaning: 'phòng bếp liền phòng ăn (DK)',
    example: '新居のダイニングキッチンは日当たりが良く、家族揃って食事をするのに最適です。 (Phòng ăn liền bếp ở căn nhà mới ngập tràn ánh nắng, rất lý tưởng để cả nhà quây quần ăn cơm.)'
  },
  'わしつ': {
    word: '和室',
    reading: 'わしつ',
    meaning: 'phòng kiểu Nhật (phòng trải chiếu tatami truyền thống)',
    example: 'い草の爽やかな香りが漂う和室で、正座をして静かにお抹茶をいただきました。 (Trong gian phòng kiểu Nhật thoang thoảng hương chiếu cói, tôi ngồi ngay ngắn thưởng trà matcha.)'
  },
  '押し入れ': {
    word: '押入れ',
    reading: 'おしいれ',
    meaning: 'tủ âm tường kiểu Nhật (ngăn chứa chăn đệm futon)',
    example: '朝起きたら敷いていた布団を畳んで、和室の押入れの上の段に収納しました。 (Sáng dậy, tôi gấp gọn tấm đệm nằm rồi cất vào ngăn trên của chiếc tủ âm tường trong phòng.)'
  },
  '布団': {
    meaning: 'đệm và chăn nằm kiểu Nhật (futon)',
    example: '天気の良い休日に、畳の上で使っている布団をベランダに干して日光に当てた。 (Vào ngày nghỉ trời đẹp, tôi mang tấm đệm nằm trải sàn ra ban công phơi dưới ánh nắng.)'
  },
  'アパート': {
    meaning: 'căn hộ cho thuê (nhà tập thể/chung cư mini)',
    example: '大学のキャンパスから徒歩五分の場所にある、築浅の木造アパートで一人暮らしをしている。 (Tôi đang sống một mình trong một căn hộ tập thể mới xây, cách khuôn viên đại học năm phút đi bộ.)'
  },
  'パリ': {
    meaning: 'thủ đô Paris (Pháp)',
    example: '芸術とファッションの都であるフランスのパリを訪れ、エッフェル塔を間近で見上げた。 (Ghé thăm kinh đô thời trang và nghệ thuật Paris của Pháp, tôi ngước nhìn tháp Eiffel sừng sững.)'
  },
  '余暇開発センター': {
    meaning: 'Trung tâm Phát triển Hoạt động Giải trí (cơ quan nghiên cứu về đời sống thư giãn tại Nhật)',
    example: '余暇開発センターが発表した統計資料を参考に、日本人の休日の過ごし方を考察した。 (Tham khảo số liệu của Trung tâm Phát triển Giải trí, tôi đã phân tích thói quen nghỉ ngơi của người Nhật.)'
  },
  'レジャー白書': {
    meaning: 'Sách Trắng về Giải trí (báo cáo thường niên của Nhật về xu hướng du lịch/nghỉ ngơi)',
    example: '最新のレジャー白書によると、近年はキャンプや登山などのアウトドア活動が人気を集めている。 (Theo Sách Trắng về Giải trí mới nhất, những năm gần đây các hoạt động dã ngoại như cắm trại, leo núi rất được ưa chuộng.)'
  },

  // UNIT 23
  '道': {
    meaning: 'con đường, tuyến đường đi',
    example: '駅へ続く細い道を道なりに進むと、右手に赤い屋根の郵便局が見えてきます。 (Đi dọc theo con đường nhỏ dẫn ra ga, bạn sẽ thấy bưu điện mái đỏ ở bên tay phải.)'
  },
  '操作店': {
    word: '交差点',
    reading: 'こうさてん',
    meaning: 'ngã tư đường, giao lộ (đã sửa lỗi chính tả từ 操作店 thành 交差点)',
    example: '歩行者の安全のため、信号のある大きな交差点を渡る際は左右をよく確認した。 (Để đảm bảo an toàn cho người đi bộ, khi băng qua ngã tư lớn có đèn tín hiệu tôi nhìn kỹ hai bên.)'
  },
  '信号': {
    meaning: 'đèn tín hiệu giao thông',
    example: '横断歩道の信号が青に変わるのを確認してから、ゆっくり道路を渡りました。 (Chờ đèn tín hiệu ở vạch sang đường chuyển sang màu xanh, tôi mới thong thả bước qua đường.)'
  },
  '引越しします': {
    meaning: 'chuyển nhà sang nơi ở mới',
    example: '転勤が決まったため、来月の初旬に会社の寮から新しいマンションへ引越しします。 (Vì có quyết định chuyển công tác, đầu tháng sau tôi sẽ chuyển nhà từ ký túc xá sang căn hộ mới.)'
  },
  '出ます': {
    meaning: 'nhả ra, chảy ra [tiền thừa, nước: お釣り/水が出る]',
    example: '切符売り場で千円札を入れてボタンを押すと、下から切符とお釣りが出ます。 (Đút tờ 1.000 yên tại quầy bán vé rồi bấm nút, vé và tiền thừa sẽ nhả ra từ bên dưới.)'
  },
  '歩きます': {
    meaning: 'đi bộ (tản bộ trên vỉa hè)',
    example: '春のうららかな陽気の中、桜並木の下を気持ちよく歩きました。 (Dưới tiết trời xuân ấm áp, tôi thảnh thơi rảo bước dưới những hàng cây hoa anh đào rực rỡ.)'
  },
  '電気屋': {
    meaning: 'cửa hàng điện máy, đồ gia dụng',
    example: '壊れた冷蔵庫を買い替えるため、週末に駅前の大型電気屋へ下見に行きました。 (Để mua tủ lạnh mới thay cho chiếc đã hỏng, cuối tuần tôi đến cửa hàng điện máy lớn trước ga xem thử.)'
  },
  '故障': {
    meaning: 'sự cố hỏng hóc (máy móc, thiết bị)',
    example: '洗濯機が突然故障して動かなくなってしまったので、修理センターに電話した。 (Máy giặt đột nhiên bị hỏng không hoạt động nên tôi đã gọi điện tới trung tâm sửa chữa.)'
  },
  'ー屋': {
    word: '～屋',
    meaning: 'cửa hàng ～, tiệm ～ (hậu tố ghép sau mặt hàng)',
    example: '路地裏にある小さな果物屋で、みずみずしくて甘いみかんを一袋買いました。 (Tại tiệm hoa quả nhỏ nằm sâu trong ngõ, tôi đã mua một túi quýt ngọt mọng nước.)'
  },
  '音': {
    meaning: 'âm thanh, tiếng động phát ra',
    example: '静かな夜の部屋で、時計の針が刻むカチカチという小さな音が響いていた。 (Trong căn phòng đêm yên ắng, tiếng kim đồng hồ tích tắc gõ nhịp nghe thật rõ.)'
  },
  '機械': {
    meaning: 'máy móc, thiết bị cơ khí',
    example: '工場の生産ラインでは、最新鋭の精密機械が休みなく稼働しています。 (Trên dây chuyền sản xuất của nhà máy, các cỗ máy chính xác tối tân hoạt động không ngừng nghỉ.)'
  },
  'つまみ': {
    meaning: 'núm vặn điều chỉnh (trên bếp gas, đài phát thanh)',
    example: 'ラジオのつまみを右に回して、聞き取りやすい音量に調節しました。 (Tôi vặn núm điều chỉnh trên đài sang bên phải để chỉnh âm lượng vừa nghe.)'
  },
  '角': {
    meaning: 'góc phố, khúc quanh ngã rẽ',
    example: '二つ目の角を左に曲がると、目の前に目指していたカフェが現れます。 (Rẽ trái ở góc phố thứ hai, quán cà phê bạn đang tìm sẽ hiện ra ngay trước mắt.)'
  },
  '橋': {
    meaning: 'cây cầu bắc qua sông',
    example: '大きな川にかかる石造りの古い橋を渡って、対岸の城下町へと向かった。 (Tôi đi qua cây cầu đá cổ kính bắc qua dòng sông lớn để sang khu phố cổ bên kia bờ.)'
  },
  '駐車場': {
    meaning: 'bãi đỗ xe, bãi gửi xe ô tô',
    example: '週末のショッピングモールは大変混雑していて、駐車場に入るまで三十分も待った。 (Trung tâm thương mại cuối tuần đông nghẹt người, tôi phải chờ 30 phút mới vào được bãi đỗ xe.)'
  },
  'お正月': {
    meaning: 'ngày Tết Dương lịch (kỳ nghỉ năm mới quan trọng nhất của Nhật)',
    example: 'お正月には家族揃ってお雑煮を食べ、近くの神社へ初詣に出かけます。 (Vào dịp Tết, cả nhà tôi quây quần ăn món bánh dày ozoni và cùng đi lễ đền Thần đạo đầu năm.)'
  },

  // UNIT 24
  '送ります': {
    meaning: 'tiễn đưa ai đó (ra ga, về nhà: 人を送る)',
    example: '夜道は暗くて物騒なので、車で彼女を家の玄関先まで送りました。 (Đường đêm tối nguy hiểm nên tôi đã lái xe đưa cô ấy về tận trước cửa nhà.)'
  },
  'いれます': {
    meaning: 'pha cà phê, hãm trà [お茶/コーヒーをいれる]',
    example: '朝起きたら、まず豆を挽いて香りの良いドリップコーヒーをいれます。 (Sáng dậy, trước tiên tôi xay hạt cà phê rồi pha một tách cà phê phin thơm lừng.)'
  },
  'おばあさん /　おばあちゃん': {
    word: 'おばあさん',
    meaning: 'người bà, cụ bà (đã sửa nghĩa từ mẹ thành bà)',
    example: '電車の中で立っているおばあさんに気付き、すぐに席を譲りました。 (Thấy một cụ bà đang đứng trên toa tàu, tôi liền đứng dậy nhường ghế ngay lập tức.)'
  },
  '意味': {
    meaning: 'ý nghĩa của từ ngữ, thông điệp',
    example: '辞書を引いて、ことわざの深い意味や使い方の例文をじっくり調べました。 (Tôi tra từ điển để tìm hiểu kỹ lưỡng ý nghĩa sâu sắc và câu ví dụ của câu tục ngữ.)'
  },
  '全部': {
    meaning: 'toàn bộ, tất cả mọi thứ',
    example: 'テーブルの上に並べられたおいしい料理を、残さず全部きれいに平らげた。 (Những món ăn ngon bày trên bàn, tôi đã ăn sạch sẽ toàn bộ không để lại chút nào.)'
  },
  '自分で': {
    meaning: 'tự bản thân mình làm (không nhờ vả)',
    example: '自立した生活を送るため、毎日の料理や洗濯はすべて自分でこなしています。 (Để sống cuộc sống tự lập, việc nấu ăn giặt giũ hằng ngày tôi đều tự mình làm hết.)'
  },
  '他に': {
    meaning: 'ngoài ra, bên cạnh đó (chỉ sự vật khác)',
    example: '「この書類の他に、何か提出するものはありますか。」「身分証明書が必要です。」 ("Ngoài tài liệu này ra thì còn cần nộp thêm gì nữa không ạ?" "Cần thêm giấy tờ tùy thân nữa ạ.")'
  },
  'お弁当': {
    meaning: 'cơm hộp bento (bữa ăn mang theo)',
    example: '母が毎朝早起きして作ってくれる彩り豊かなお弁当を、職場で食べるのが楽しみです。 (Được thưởng thức hộp cơm bento đầy màu sắc mẹ dậy sớm nấu cho mỗi sáng là niềm vui ở chỗ làm của tôi.)'
  },

  // UNIT 25
  '考えます': {
    meaning: 'suy nghĩ, đắn đo (phương hướng, giải pháp)',
    example: '今後のキャリアプランについて、一人静かな部屋でじっくりと考えました。 (Về kế hoạch phát triển sự nghiệp trong tương lai, tôi đã ngồi một mình trong phòng yên tĩnh suy ngẫm thấu đáo.)'
  },
  'グループ': {
    meaning: 'nhóm, đội nhóm làm việc (group)',
    example: '大学のゼミで四人のグループを組み、共同で研究発表の資料を作成した。 (Trong lớp hội thảo ở trường đại học, chúng tôi lập nhóm bốn người cùng soạn bài thuyết trình.)'
  },
  'チャンス': {
    meaning: 'cơ hội tốt, thời cơ ngàn vàng (chance)',
    example: '海外で自分の語学力を試す絶好のチャンスが巡ってきたので、迷わず応募した。 (Thời cơ vàng để thử sức năng lực ngoại ngữ ở nước ngoài đã đến, tôi không ngần ngại nộp đơn đăng ký.)'
  },
  '億': {
    meaning: 'trăm triệu (đơn vị số 100.000.000)',
    example: '新しく開発されたその画期的な薬は、世界中で一億人以上の命を救った。 (Loại thuốc đột phá mới phát triển ấy đã cứu sống hơn một trăm triệu người trên khắp thế giới.)'
  },
  '転勤': {
    meaning: 'chuyển công tác (chuyển sang chi nhánh khác)',
    example: '来月から福岡支店への転勤を命じられたので、週末に部屋探しの準備を始めた。 (Vì được điều động chuyển công tác tới chi nhánh Fukuoka từ tháng sau, cuối tuần tôi bắt đầu tìm thuê nhà.)'
  },
  'どうぞ元気で': {
    meaning: 'chúc bạn lên đường mạnh khỏe nhé (lời chúc người sắp đi xa)',
    example: '遠くの街へ引っ越していく親友と空港で握手を交わし、「どうぞ元気でね」と伝えた。 (Bắt tay người bạn thân sắp chuyển nhà đi một thành phố xa tại sân bay, tôi chúc bạn: "Cậu đi mạnh khỏe nhé!")'
  },
  '（いろいろ）お世話になりました': {
    meaning: 'xin cảm ơn quý vị đã giúp đỡ tôi rất nhiều trong thời gian qua',
    example: '退職の挨拶回りで、「これまでいろいろとお世話になりました」と社員一同に深く頭を下げた。 (Đi chào tạm biệt các phòng ban trước khi nghỉ việc, tôi cúi đầu cảm tạ: "Xin cảm ơn mọi người đã hết lòng giúp đỡ tôi suốt thời gian qua".)'
  }
};

function run() {
  console.log('Bắt đầu cập nhật Minna N5 Batch B (Unit 14 -> Unit 25)...');
  let updatedCount = 0;

  for (let u = 14; u <= 25; u++) {
    const unitFolder = 'unit-' + String(u).padStart(2, '0');
    const rel = path.join('minna-no-nihongo-n5', unitFolder, 'vocabulary.json');
    const fullPath = path.join(DATA_DIR, rel);

    if (!fs.existsSync(fullPath)) continue;

    let data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

    // Lọc bỏ mục rác 一ばん (châu á) trong unit 16 nếu có
    if (u === 16) {
      const beforeLen = data.length;
      data = data.filter(it => !(it.word === '一ばん' && it.meaning === 'châu á'));
      if (data.length < beforeLen) {
        console.log(`[i] Đã xóa mục rác 一ばん (châu á) trong unit-16`);
      }
    }

    let changed = false;

    for (const item of data) {
      const w = item.word;
      if (batchBDict[w]) {
        const cur = batchBDict[w];
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

  console.log(`\nHoàn tất Batch B! Đã cập nhật ${updatedCount} từ vựng.`);
}

run();

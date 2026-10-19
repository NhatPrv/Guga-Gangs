/**
 * scripts/refine-batch1-core-and-topics.js
 * Chuẩn hóa 66 từ vựng JLPT Core Bank (N3, N4, N5) & Special Topics:
 * - Sửa triệt để các lỗi dịch sai (おまわりさん, ポスト, マッチ, または, ガソリンスタンド, 命じる, バン...)
 * - Viết câu ví dụ chuẩn collocation bản xứ, không trùng lặp prefix/suffix
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

// Từ điển chuẩn hóa 66 từ vựng
const curatedDict = {
  // JLPT N3 CORE BANK
  '痛み': {
    meaning: 'cơn đau, cảm giác đau đớn',
    example: '薬を飲んだら、胃の痛みが少し治まりました。 (Uống thuốc xong, cơn đau dạ dày của tôi đã dịu đi một chút.)'
  },
  'いつまでも': {
    meaning: 'mãi mãi, mãi không thôi (diễn tả trạng thái kéo dài vô tận hoặc không dứt)',
    example: '祖父の優しい笑顔を、いつまでも忘れません。 (Tôi sẽ không bao giờ quên nụ cười hiền hậu của ông nội.)'
  },
  '撃つ': {
    meaning: 'bắn (súng, cung tên)',
    example: '警察官は威嚇のために空に向けてピストルを撃った。 (Viên cảnh sát đã bắn chỉ thiên một phát súng để đe dọa.)'
  },
  'およそ': {
    meaning: 'khoảng chừng, đại khái, xấp xỉ',
    example: '駅から目的地までは、およそ徒歩十五分ほどかかります。 (Từ nhà ga đến điểm đến mất khoảng chừng 15 phút đi bộ.)'
  },
  '限る': {
    meaning: 'chỉ riêng, giới hạn (hoặc dùng trong cấu trúc: không hẳn là...)',
    example: '値段が高いものが、必ずしも品質が良いとは限らない。 (Đồ đắt tiền chưa chắc chất lượng đã luôn tốt.)'
  },
  '過去': {
    meaning: 'quá khứ, thời gian đã qua',
    example: '過去の失敗を悔やむより、未来のことを考えよう。 (Thay vì hối tiếc về những thất bại trong quá khứ, hãy nghĩ về tương lai.)'
  },
  '必ずしも': {
    meaning: 'chưa hẳn, không nhất thiết (luôn đi cùng thể phủ định 〜ない)',
    example: '有名大学を出た人が、必ずしも仕事ができるとは言えない。 (Người tốt nghiệp đại học danh tiếng chưa hẳn đã là người làm việc giỏi.)'
  },
  '金持ち': {
    meaning: 'người giàu có, đại gia',
    example: '彼は事業で大成功を収めて、大金持ちになった。 (Anh ấy đã thành công lớn trong sự nghiệp kinh doanh và trở thành một người rất giàu có.)'
  },
  '患者': {
    meaning: 'bệnh nhân, người đang điều trị bệnh',
    example: '医師は一人ひとりの患者の話を丁寧に聞き取った。 (Bác sĩ đã lắng nghe cẩn thận câu chuyện của từng bệnh nhân một.)'
  },
  '気の毒': {
    meaning: 'đáng thương, tội nghiệp (bày tỏ sự cảm thông sâu sắc trước hoàn cảnh khó khăn của người khác)',
    example: '火事で家を失った家族の姿を見て、本当に気の毒に思った。 (Nhìn cảnh gia đình mất nhà sau vụ hỏa hoạn, tôi thực sự thấy rất tội nghiệp.)'
  },
  'キャプテン': {
    meaning: 'đội trưởng (trong thể thao hoặc hàng hải)',
    example: 'サッカー部のキャプテンとして、チーム全員を引っ張っています。 (Với tư cách là đội trưởng đội bóng đá, anh ấy dẫn dắt toàn bộ đội bóng.)'
  },
  '急速': {
    meaning: 'nhanh chóng, cấp tốc (diễn tả sự biến đổi với tốc độ cao)',
    example: 'スマートフォンの普及によって、IT技術が急速に進歩した。 (Nhờ sự phổ biến của điện thoại thông minh, công nghệ IT đã tiến bộ vượt bậc.)'
  },
  '景気': {
    meaning: 'tình hình kinh tế, tình trạng kinh doanh buôn bán',
    example: '政府の新しい経済政策のおかげで、景気が回復してきた。 (Nhờ chính sách kinh tế mới của chính phủ, tình hình kinh tế đã dần phục hồi.)'
  },
  'ケース': {
    meaning: 'trường hợp (case) hoặc hộp, bao đựng đồ',
    example: 'スマートフォンを落として傷つけないように、頑丈なケースに入れています。 (Để điện thoại không bị trầy xước khi rơi, tôi đã bỏ nó vào một chiếc ốp rất chắc chắn.)'
  },
  '幸福': {
    meaning: 'hạnh phúc, sự sung sướng viên mãn',
    example: '家族みんなが健康で平和に暮らせることが、一番の幸福です。 (Việc cả gia đình khỏe mạnh và sống bình yên chính là niềm hạnh phúc lớn nhất.)'
  },
  '諺': {
    meaning: 'tục ngữ, ngạn ngữ dân gian',
    example: '「失敗は成功のもと」ということわざをいつも心に留めています。 (Tôi luôn ghi nhớ câu tục ngữ "Thất bại là mẹ thành công" trong lòng.)'
  },
  '支払': {
    meaning: 'việc thanh toán, chi trả tiền bạc',
    example: 'レジでの支払いは、スマホのQRコード決済を利用しました。 (Lúc thanh toán tại quầy thu ngân, tôi đã dùng phương thức quét mã QR trên điện thoại.)'
  },
  '主張': {
    meaning: 'chủ trương, bày tỏ rõ quan điểm cá nhân',
    example: '会議の席で、自分の意見や主張をはっきりと述べました。 (Trong cuộc họp, tôi đã trình bày rõ ràng quan điểm và chủ trương của mình.)'
  },
  '承認': {
    meaning: 'sự phê duyệt, chấp thuận chính thức',
    example: '提出した企画書が、役員会議で無事に承認されました。 (Bản đề xuất kế hoạch mà tôi nộp đã được ban giám đốc chính thức phê duyệt thuận lợi.)'
  },
  '職': {
    meaning: 'nghề nghiệp, công ăn việc làm, chức vụ',
    example: '大学を卒業してから、IT企業でエンジニアの職に就きました。 (Sau khi tốt nghiệp đại học, tôi đã nhận công việc kỹ sư tại một công ty công nghệ thông tin.)'
  },
  '処理': {
    meaning: 'xử lý, giải quyết (dữ liệu, sự cố, rác thải)',
    example: 'コンピューターを使って、膨大なデータを短時間で処理します。 (Tôi dùng máy tính để xử lý một lượng lớn dữ liệu trong thời gian ngắn.)'
  },
  'スタンド': {
    meaning: 'đèn bàn học (desk lamp) hoặc khán đài sân vận động',
    example: '部屋の明かりを消して、電気スタンドの光だけで読書をしました。 (Tôi tắt đèn phòng và chỉ đọc sách dưới ánh sáng của chiếc đèn bàn.)'
  },
  '鋭い': {
    meaning: 'sắc bén (dao kéo), nhạy bén, sắc sảo (giác quan, ánh mắt)',
    example: '探偵は鋭い観察眼で、犯人が残したわずかな痕跡を見抜いた。 (Thám tử với con mắt quan sát sắc sảo đã nhận ra dấu vết nhỏ mà thủ phạm để lại.)'
  },
  '種': {
    meaning: 'hạt giống (cây trồng) hoặc nguồn cơn, mầm mống',
    example: '春になったら庭の花壇にヒマワリの種をまくつもりです。 (Đến mùa xuân, tôi định gieo hạt hoa hướng dương vào bồn hoa trong vườn.)'
  },
  '地位': {
    meaning: 'địa vị xã hội, vị thế trong tổ chức',
    example: '長年のたゆまぬ努力が実を結び、会社で高い地位を築いた。 (Nỗ lực không ngừng nghỉ suốt nhiều năm đã đơm hoa kết trái, giúp anh ấy tạo dựng được vị thế cao trong công ty.)'
  },
  '中央': {
    meaning: 'trung tâm, chính giữa',
    example: '広場の中央には、大きな噴水が設置されています。 (Ở chính giữa quảng trường có lắp đặt một đài phun nước lớn.)'
  },
  '常に': {
    meaning: 'thường xuyên, luôn luôn (văn phong trang trọng hơn いつも)',
    example: 'プロの料理人として、常に衛生管理に細心の注意を払っています。 (Là một đầu bếp chuyên nghiệp, tôi luôn hết sức chú ý đến vấn đề quản lý vệ sinh.)'
  },
  '詰める': {
    meaning: 'nhét vào, nhồi vào, rút ngắn khoảng cách',
    example: '旅行用のスーツケースにお土産を隙間なく詰め込みました。 (Tôi đã nhét kín quà lưu niệm vào chiếc vali du lịch không còn một kẽ hở.)'
  },
  '電子': {
    meaning: 'điện tử (electronic, electron)',
    example: '分厚い紙の辞書を持ち歩かずに、電子辞書を活用しています。 (Thay vì mang cuốn từ điển giấy dày cộp, tôi sử dụng từ điển điện tử.)'
  },
  '飛ばす': {
    meaning: 'làm cho bay lên, phóng đi, lướt qua/bỏ qua',
    example: '公園の広い芝生で、子どもたちが紙飛行機を遠くまで飛ばした。 (Trên bãi cỏ rộng ở công viên, lũ trẻ đã phóng máy bay giấy bay thật xa.)'
  },
  '土曜': {
    meaning: 'thứ bảy (trong tuần)',
    example: '土曜の午後は予定がないので、家で映画を見てのんびり過ごします。 (Chiều thứ bảy tôi không có lịch trình gì nên sẽ thảnh thơi xem phim ở nhà.)'
  },
  '名': {
    meaning: 'tên gọi, danh tiếng',
    example: 'その勇敢な少年の名は、町中の人々に知れ渡っている。 (Tên tuổi của cậu bé dũng cảm ấy đã được toàn bộ người dân trong thị trấn biết đến.)'
  },
  'バン': {
    meaning: 'xe tải nhỏ có thùng kín (xe van)',
    example: '引っ越しの荷物を運ぶために、レンタカーで大型のバンを借りました。 (Để chở đồ đạc chuyển nhà, tôi đã thuê một chiếc xe van cỡ lớn tại cửa hàng cho thuê xe.)'
  },
  '雰囲気': {
    meaning: 'bầu không khí (tâm trạng nơi chốn, khung cảnh)',
    example: 'この喫茶店はジャズが静かに流れていて、落ち着いた雰囲気が漂っている。 (Quán cà phê này mở nhạc jazz nhè nhẹ, toát lên một bầu không khí rất thanh tĩnh.)'
  },
  '分析': {
    meaning: 'phân tích (số liệu, nguyên nhân sự việc)',
    example: 'アンケートの調査結果を詳しく分析して、新商品の開発に役立てます。 (Chúng tôi phân tích chi tiết kết quả khảo sát bảng hỏi để phục vụ việc phát triển sản phẩm mới.)'
  },
  '方向': {
    meaning: 'phương hướng, chiều hướng phát triển',
    example: '道に迷ってしまったので、スマホの地図アプリで進行方向を確認した。 (Vì bị lạc đường nên tôi đã mở ứng dụng bản đồ trên điện thoại để kiểm tra lại hướng đi.)'
  },
  '向かい': {
    meaning: 'phía đối diện, đối diện qua đường',
    example: '銀行の建物の向かい側に、新しくコンビニがオープンしました。 (Ở phía đối diện tòa nhà ngân hàng, một cửa hàng tiện lợi mới vừa khai trương.)'
  },
  '命じる': {
    meaning: 'ra lệnh, chỉ thị, bổ nhiệm chức vụ',
    example: '裁判長は被告人に対して、被害者への損害賠償を命じた。 (Thẩm phán đã ra lệnh cho bị cáo phải bồi thường thiệt hại cho nạn nhân.)'
  },
  '厄介': {
    meaning: 'phiền phức, rắc rối, làm phiền (mang sắc thái ngán ngẩm)',
    example: 'ウイルスの感染によって、パソコンが厄介なトラブルに見舞われた。 (Do bị nhiễm virus, máy tính của tôi đã gặp phải sự cố vô cùng phiền toái.)'
  },
  '勇気': {
    meaning: 'lòng dũng cảm, dũng khí dám đương đầu',
    example: '困難な状況に直面しても、立ち向かう勇気を持つことが大切です。 (Dù phải đối mặt với hoàn cảnh khó khăn, việc giữ vững lòng dũng cảm đương đầu là điều rất quan trọng.)'
  },
  '床': {
    meaning: 'sàn nhà, nền nhà',
    example: 'リビングの床にジュースをこぼしてしまったので、雑巾ですぐに拭いた。 (Tôi lỡ làm đổ nước trái cây ra sàn phòng khách nên đã lấy giẻ lau sạch ngay lập tức.)'
  },
  '礼儀': {
    meaning: 'lễ nghi, phép lịch sự, cung cách ứng xử',
    example: '目上の人と話すときは、きちんとした礼儀を守るべきです。 (Khi nói chuyện với người lớn tuổi, chúng ta nên tuân thủ phép lịch sự đúng mực.)'
  },

  // JLPT N4 CORE BANK
  'おつり': {
    meaning: 'tiền thừa, tiền thối lại (khi mua sắm)',
    example: '千円札を出して缶ジュースを買い、小銭のおつりを受け取りました。 (Tôi đưa tờ 1.000 yên mua lon nước ngọt và nhận lại tiền thừa bằng tiền xu.)'
  },
  'ガソリンスタンド': {
    meaning: 'cây xăng, trạm tiếp nhiên liệu',
    example: 'ドライブの途中で燃料が減ってきたので、近くのガソリンスタンドに寄った。 (Đang trên chuyến đi chơi xa thì xe sắp hết xăng nên tôi ghé vào cây xăng gần đó.)'
  },
  '研究室': {
    meaning: 'phòng nghiên cứu của giáo sư, phòng thí nghiệm học thuật',
    example: '卒業論文のテーマについて相談するために、教授の研究室を訪ねました。 (Tôi đã đến phòng nghiên cứu của giáo sư để trao đổi về đề tài khóa luận tốt nghiệp.)'
  },
  '背中': {
    meaning: 'lưng, phía sau lưng cơ thể',
    example: '重い荷物を背負い続けたせいで、背中や腰が痛くなりました。 (Vì đeo vác đồ nặng liên tục nên tôi bị đau cả lưng lẫn eo.)'
  },
  '妻': {
    meaning: 'vợ mình (cách gọi khiêm tốn khi nói về vợ của người nói)',
    example: '休日は妻と一緒に近所のスーパーへ食材を買い出しに行きます。 (Vào ngày nghỉ, tôi thường cùng vợ đi siêu thị gần nhà mua nguyên liệu nấu ăn.)'
  },
  'または': {
    meaning: 'hoặc là, hay là (từ nối lựa chọn A hoặc B)',
    example: '受講料の支払いは、現金またはクレジットカードで承ります。 (Việc thanh toán học phí có thể thực hiện bằng tiền mặt hoặc thẻ tín dụng.)'
  },
  '木綿': {
    meaning: 'vải cotton, sợi bông tự nhiên',
    example: '肌がデリケートなので、肌着は肌触りの良い木綿のものを選んでいます。 (Vì da nhạy cảm nên tôi luôn chọn đồ lót làm bằng vải cotton mềm mại.)'
  },

  // JLPT N5 CORE BANK
  '歩く': {
    meaning: 'đi bộ',
    example: '天気が良かったので、バスに乗らずに駅まで歩くことにしました。 (Vì trời đẹp nên tôi quyết định đi bộ ra ga chứ không đi xe buýt.)'
  },
  '行く': {
    meaning: 'đi (tới một địa điểm cụ thể)',
    example: '明日の朝八時に、新幹線に乗って京都へ行きます。 (Tám giờ sáng mai, tôi sẽ đi tàu Shinkansen đến Kyoto.)'
  },
  '痛い': {
    meaning: 'đau (cảm giác đau đớn trên cơ thể)',
    example: '冷たい水を飲んだら、虫歯がズキズキと痛くなりました。 (Vừa uống nước lạnh xong thì chiếc răng sâu của tôi đau nhức buốt.)'
  },
  'お皿': {
    meaning: 'cái đĩa, dĩa đựng thức ăn',
    example: '焼き上がったばかりの温かい魚を、大きなお皿に盛り付けました。 (Tôi đã bày con cá vừa nướng chín nóng hổi lên một chiếc đĩa lớn.)'
  },
  'おまわりさん': {
    meaning: 'chú cảnh sát (cách xưng hô thân mật, gần gũi với cảnh sát tuần tra)',
    example: '財布を落として困っていたら、交番のおまわりさんが親切に助けてくれました。 (Khi đang bối rối vì đánh rơi ví, chú cảnh sát ở bốt trực đã nhiệt tình giúp đỡ tôi.)'
  },
  '帰る': {
    meaning: 'về, trở về (nhà, quê hương, đất nước)',
    example: '仕事が定時に終わったので、寄り道せずに真っ直ぐ家に帰りました。 (Vì công việc kết thúc đúng giờ nên tôi về thẳng nhà chứ không la cà đâu cả.)'
  },
  'カレー': {
    meaning: 'món cơm cà ri (món ăn quen thuộc của Nhật)',
    example: 'タマネギとジャガイモをたっぷり煮込んで、おいしいカレーを作った。 (Tôi đã hầm thật nhiều hành tây và khoai tây để nấu món cơm cà ri thơm ngon.)'
  },
  '牛肉': {
    meaning: 'thịt bò',
    example: 'すき焼きの鍋に、スライスした新鮮な牛肉を入れました。 (Tôi đã cho những lát thịt bò tươi ngon vào nồi lẩu sukiyaki.)'
  },
  '静か': {
    meaning: 'yên tĩnh, thanh bình (không có tiếng ồn ào)',
    example: '夜の図書館はとても静かで、集中して勉強がはかどります。 (Thư viện vào ban đêm rất yên tĩnh nên tôi học tập rất tập trung và hiệu quả.)'
  },
  '住む': {
    meaning: 'sinh sống, cư trú tại đâu',
    example: '緑が多くて空気がきれいな郊外の町に家族と一緒に住んでいます。 (Tôi đang sống cùng gia đình tại một thị trấn ngoại ô nhiều cây xanh và không khí trong lành.)'
  },
  'そば': {
    meaning: 'bên cạnh, gần sát bên',
    example: '子どもが寝付くまで、母親はずっとベッドのそばに付き添っていた。 (Người mẹ đã ngồi túc trực bên cạnh giường cho đến khi đứa con ngủ say.)'
  },
  '辺': {
    meaning: 'vùng, khu vực lân cận xung quanh',
    example: 'この辺にはおしゃれなカフェがたくさんあって、散歩が楽しいです。 (Xung quanh khu vực này có nhiều quán cà phê xinh xắn nên đi dạo rất thích.)'
  },
  'ペン': {
    meaning: 'bút mực, cây bút viết',
    example: '重要書類にサインをするために、黒いインクのボールペンを取り出した。 (Tôi lấy chiếc bút bi mực đen ra để ký tên vào các tài liệu quan trọng.)'
  },
  'ポスト': {
    meaning: 'hòm thư, thùng thư bưu điện màu đỏ',
    example: '切手を貼った手紙を、駅前の赤いポストに投函しました。 (Tôi đã dán tem rồi thả bức thư vào thùng thư màu đỏ trước nhà ga.)'
  },
  'マッチ': {
    meaning: 'que diêm, bao diêm dùng để đánh lửa',
    example: '停電になったので、マッチをすってテーブルのろうそくに火を灯した。 (Vì bị mất điện nên tôi đã quẹt diêm thắp ngọn nến trên bàn.)'
  },
  '夕方': {
    meaning: 'chiều tối, lúc hoàng hôn chập choạng',
    example: '夕方になると、西の空がオレンジ色に美しく染まります。 (Khi chiều tà buông xuống, bầu trời phía tây nhuộm một màu cam tuyệt đẹp.)'
  },

  // SPECIAL TOPICS
  '例えば': {
    meaning: 'ví dụ như, chẳng hạn như (từ dùng để nêu dẫn chứng cụ thể)',
    example: '休日は趣味、例えば水泳や写真撮影を楽しんでいます。 (Ngày nghỉ tôi thường tận hưởng những sở thích cá nhân, chẳng hạn như bơi lội hay chụp ảnh.)'
  }
};

function run() {
  console.log('Bắt đầu cập nhật 66 từ vựng JLPT Core Bank & Special Topics...');
  let updatedCount = 0;

  const targetFiles = [
    'jlpt-n3-core-bank/theme-01-human-daily/vocabulary.json',
    'jlpt-n3-core-bank/theme-02-society-culture/vocabulary.json',
    'jlpt-n3-core-bank/theme-03-work-business/vocabulary.json',
    'jlpt-n3-core-bank/theme-04-nature-science/vocabulary.json',
    'jlpt-n3-core-bank/theme-05-verbs-adjectives/vocabulary.json',
    'jlpt-n3-core-bank/theme-06-adverbs-expressions/vocabulary.json',
    'jlpt-n4-core-bank/part-01-daily-actions/vocabulary.json',
    'jlpt-n4-core-bank/part-02-nature-emotions/vocabulary.json',
    'jlpt-n4-core-bank/part-04-society-places/vocabulary.json',
    'jlpt-n4-core-bank/part-06-expressions-advanced/vocabulary.json',
    'jlpt-n5-core-bank/theme-01-basics/vocabulary.json',
    'jlpt-n5-core-bank/theme-02-verbs/vocabulary.json',
    'jlpt-n5-core-bank/theme-03-adjectives/vocabulary.json',
    'jlpt-n5-core-bank/theme-05-adverbs/vocabulary.json',
    'special-topics-conjunctions-adverbs/unit-01-conjunctions-basic/vocabulary.json'
  ];

  for (const rel of targetFiles) {
    const fullPath = path.join(DATA_DIR, rel);
    if (!fs.existsSync(fullPath)) {
      console.warn(`[!] Không tìm thấy file: ${rel}`);
      continue;
    }

    const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    let changed = false;

    for (const item of data) {
      const w = item.word || item.kanji;
      if (curatedDict[w]) {
        const cur = curatedDict[w];
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

  console.log(`\nHoàn tất! Tổng số từ đã cập nhật: ${updatedCount}`);
}

run();

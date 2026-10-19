/**
 * scripts/refine-minna-n4-batchA.js
 * Chuẩn hóa và sửa lỗi từ vựng Minna no Nihongo N4 (Unit 26 -> Unit 41):
 * - Sửa các lỗi chính tả/crawler cũ:
 *   + 非常宇口 -> 非常口 (ひじょうぐち: cửa thoát hiểm)
 *   + 彫金ます -> 貯金します (ちょきんします: tiết kiệm tiền)
 *   + 星上手に -> 上手に (じょうずに: giỏi, khéo)
 *   + 歴史く -> 歴史 (れきし: lịch sử)
 *   + 焼け舞う / 入院します(パン/肉が～) -> 焼けます (やけます: nướng chín, bị cháy)
 *   + 烏龜 -> 亀 (かめ: con rùa)
 *   + ー代 [nghiêm khắc] -> ―代 (tiền phí, cước phí)
 *   + お疲れさまでした [màu đỏ] -> Anh/chị đã vất vả rồi
 *   + おととし [cuối cùng] -> năm kia (hai năm trước)
 * - Viết câu ví dụ chuẩn collocation bản xứ, tuyệt đối không lặp lại tiền tố/hậu tố
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

const batchADict = {
  // UNIT 26
  'どこでも': {
    meaning: 'bất cứ nơi đâu, bất kỳ chỗ nào',
    example: 'ポータブルWi-Fiがあれば、旅先の山奥でもどこでも快適に仕事ができます。 (Có bộ phát Wi-Fi cầm tay thì dù ở tận vùng núi sâu chuyến đi, ta vẫn làm việc ngon lành ở bất cứ nơi đâu.)'
  },

  // UNIT 28
  'かみます': {
    meaning: 'nhai (thức ăn: ご飯をかむ), cắn',
    example: '消化を助けて胃肠の健康を守るため、一口三十回以上よくかんで食べます。 (Để hỗ trợ tiêu hóa và bảo vệ dạ dày, mỗi miếng tôi đều nhai kỹ hơn 30 lần.)'
  },

  // UNIT 29
  '確か': {
    meaning: 'chắc là, hình như (nhớ mang máng nhưng khá tự tin)',
    example: '確か駅前のロータリーの右側に、処方箋を扱っている調剤薬局があったはずです。 (Tôi nhớ chắc mẩm là phía bên phải vòng xoay trước ga có một hiệu thuốc bán theo đơn.)'
  },

  // UNIT 30
  '―ほど': {
    meaning: 'khoảng chừng ～, mức độ tầm ～',
    example: '駅前の行列のできるラーメン屋で、入店まで三十分ほど並んで待ちました。 (Tại quán mì ramen xếp hàng trước ga, tôi đã đứng đợi khoảng chừng ba mươi phút mới vào được quán.)'
  },
  'それはいいですな': {
    meaning: 'thế thì hay quá nhỉ! (lời tán thưởng, đồng ý một cách sảng khoái)',
    example: '「今週末は温泉宿でゆっくりくつろぐ予定だよ。」「おや、それはいいですな。」 ("Cuối tuần này tớ định đi nghỉ ngơi thư giãn ở nhà trọ suối nước nóng đấy." "Chà, thế thì hay quá nhỉ!")'
  },

  // UNIT 31
  'インターネット': {
    meaning: 'mạng internet toàn cầu',
    example: '世界中の最新ニュースや学術論文を、インターネットを介して瞬時に検索できる。 (Chúng ta có thể tra cứu tin tức mới nhất và các bài báo khoa học trên toàn thế giới ngay tức khắc qua mạng internet.)'
  },
  '集まります': {
    meaning: 'tụ họp, tập hợp lại (tự động từ: 人が集まる)',
    example: '放課後のグラウンドに、サッカー部の部員たちが元気に集まってウォーミングアップを始めた。 (Trên sân bóng sau giờ học, các thành viên đội bóng đá tập hợp đông đủ bắt đầu khởi động.)'
  },

  // UNIT 32
  '運動します': {
    meaning: 'vận động, tập thể dục thể thao',
    example: '週末の涼しい早朝に、近所のフィットネスクラブで汗を流して運動します。 (Vào sáng sớm mát mẻ cuối tuần, tôi ra câu lạc bộ thể hình gần nhà tập thể dục toát mồ hôi.)'
  },
  '十分（な）': {
    meaning: 'đầy đủ, trọn vẹn (không thiếu thốn)',
    example: '災害時に備えて、家族三日分の食料と飲料水を十分な量備蓄しています。 (Để phòng ngừa khi có thiên tai, tôi đã dự trữ đầy đủ lượng thức ăn và nước uống cho cả nhà dùng trong ba ngày.)'
  },
  '無理をします': {
    meaning: 'làm việc quá sức, gượng ép bản thân',
    example: '熱があるのに無理をして出勤すると、かえって病状が悪化してしまいますよ。 (Đang sốt mà còn ráng sức đi làm thì bệnh tình sẽ càng trở nặng thêm đấy.)'
  },
  'ゆっくりします': {
    meaning: 'nghỉ ngơi thư thả, dưỡng sức nhàn nhã',
    example: '忙しかった繁忙期が終わったので、週末は温泉旅館に泊まってゆっくりします。 (Đợt cao điểm công việc bận rộn đã qua, cuối tuần tôi sẽ ở nhà trọ suối nước nóng nghỉ ngơi thư thả.)'
  },
  '星占い': {
    meaning: 'thuật chiêm tinh, bói toán theo các chòm sao',
    example: '朝のテレビ番組の星占いで今日の運勢をチェックするのが、毎日のささやかな楽しみです。 (Xem vận mệnh hôm nay qua mục bói sao trên chương trình truyền hình buổi sáng là niềm vui nho nhỏ mỗi ngày của tôi.)'
  },
  '困ります': {
    meaning: 'gặp khó khăn, bối rối, rắc rối',
    example: '出先でスマートフォンの充電が切れてしまい、連絡が取れなくなって大変困りました。 (Đang ở ngoài đường mà điện thoại hết pin không liên lạc được khiến tôi gặp rắc rối to.)'
  },
  '健康': {
    meaning: 'sức khỏe, sự lành mạnh về thể chất',
    example: '日頃の規則正しい生活習慣と適度な運動が、健やかな健康の土台となります。 (Thói quen sinh hoạt điều độ và tập luyện thể dục vừa sức hằng ngày chính là nền tảng của một sức khỏe dẻo dai.)'
  },
  '恋愛': {
    meaning: 'tình yêu, sự lãng mạn lứa đôi',
    example: '青春時代の甘酸っぱい恋愛をテーマにした純愛小説を読んで、深く胸を打たれた。 (Đọc cuốn tiểu thuyết lấy chủ đề về tình yêu ngọt ngào thời thanh xuân, lòng tôi xúc động khôn nguôi.)'
  },
  'お）金持ち': {
    word: 'お金持ち',
    meaning: 'người giàu có, đại gia',
    example: '彼は一代で巨大なIT企業を築き上げ、一代で世界有数のお金持ちへと登りつめた。 (Tự tay gây dựng nên tập đoàn IT khổng lồ, anh ấy đã vươn lên thành một trong những người giàu có bậc nhất thế giới.)'
  },

  // UNIT 33
  '（な）': {
    word: '逃げます',
    reading: 'にげます',
    meaning: 'chạy trốn, bỏ trốn (đã chuẩn hóa từ lỗi)',
    example: '火災警報器のけたたましいベルが鳴り響いたので、慌てて非常口から外へ逃げました。 (Chuông báo cháy vang lên inh ỏi nên tôi vội vàng chạy trốn ra ngoài qua lối thoát hiểm.)'
  },
  'ー機': {
    word: '～機',
    meaning: '～ máy, chiếc máy (hậu tố: コピー機, 洗濯機)',
    example: 'オフィスの片隅に最新型の高速カラー印刷機が新しく導入されました。 (Ở góc văn phòng vừa được trang bị thêm một chiếc máy in màu tốc độ cao đời mới nhất.)'
  },
  '使用禁止': {
    meaning: 'cấm sử dụng (biển báo)',
    example: '故障中のエレベーターの扉に「点検中につき使用禁止」の貼り紙が貼ってあった。 (Trên cửa thang máy đang hỏng có dán tấm biển "Đang bảo trì - Cấm sử dụng".)'
  },
  '非常宇口': {
    word: '非常口',
    reading: 'ひじょうぐち',
    meaning: 'cửa thoát hiểm, lối thoát khẩn cấp (đã sửa lỗi chính tả)',
    example: '映画館や劇場の館内に入ったら、万が一に備えてまず非常口の場所を確認しておく。 (Khi bước vào rạp chiếu phim hay nhà hát, việc đầu tiên là phải xác nhận vị trí cửa thoát hiểm đề phòng sự cố.)'
  },
  'ー中': {
    word: '～中',
    meaning: 'đang trong quá trình ～ (授業中, 会議中, 営業中)',
    example: 'ただいま役員会議の真っ最中ですので、お急ぎのご用件以外はお控えください。 (Hiện tại đang trong cuộc họp ban giám đốc nên xin vui lòng không làm phiền trừ việc khẩn cấp.)'
  },
  'あと': {
    meaning: 'còn lại ～, sau đó (khoảng cách hoặc thời gian còn lại)',
    example: '試験終了の合図まであと十分しか残っていないので、解答の見直しを急いだ。 (Chỉ còn mười phút nữa là hết giờ làm bài nên tôi nhanh chóng soát lại đáp án.)'
  },
  'そりゃあ': {
    meaning: 'thì hẳn là thế rồi! / điều đó thì đương nhiên rồi! (khẩu ngữ rút gọn của それは)',
    example: '「憧れの難関大学に現役合格したんだって？」「そりゃあ、毎日十時間も猛勉強していたからね。」 ("Nghe nói cậu ấy thi đỗ ngay trường đại học danh tiếng à?" "Thì hẳn là thế rồi, ngày nào cậu ấy cũng cày 10 tiếng cơ mà.")'
  },
  '～い内': {
    word: '～以内',
    meaning: 'trong vòng ～, trong phạm vi ～ (thời gian, khoảng cách)',
    example: 'ご注文いただいた商品は、営業日の三日以内にお手元へ迅速に発送いたします。 (Sản phẩm quý khách đặt mua sẽ được gửi nhanh chóng tới tận tay trong vòng 3 ngày làm việc.)'
  },
  '電報代': {
    meaning: 'cước phí gửi điện báo',
    example: '祝電を慶事の会場へ打電してもらうため、電報代を手元の小銭で支払った。 (Để gửi bức điện mừng tới hội trường tiệc vui, tôi đã thanh toán tiền cước điện báo bằng tiền lẻ.)'
  },
  'できるだけ': {
    meaning: 'cố gắng hết sức có thể, trong khả năng tối đa',
    example: '相手に失礼のないよう、できるだけ丁寧で分かりやすい言葉遣いを心がけています。 (Để không thất lễ với đối phương, tôi luôn cố gắng sử dụng từ ngữ lịch thiệp và dễ hiểu nhất có thể.)'
  },

  // UNIT 34
  'ーグラマ': {
    word: '～グラム',
    meaning: '～ gam (đơn vị đo khối lượng)',
    example: 'ケーキの生地を作るために、計量器で小麦粉をきっちり二百グラム量りました。 (Để làm cốt bánh gato, tôi đã dùng cân điện tử đong chuẩn xác hai trăm gam bột mì.)'
  },
  'たまねぎ': {
    meaning: 'củ hành tây',
    example: '包丁でたまねぎを薄切りにしていたら、目に染みて涙が止まらなくなった。 (Lúc lấy dao thái mỏng củ hành tây, hơi cay xộc vào mắt khiến tôi chảy nước mắt ròng ròng.)'
  },

  // UNIT 35
  'しゅ': {
    word: '朱色',
    reading: 'しゅいろ',
    meaning: 'màu đỏ son (màu truyền thống trên cổng đền Torii)',
    example: '京都の伏見稲荷大社には、鮮やかな朱色の鳥居が千本以上も連なっています。 (Ở đền Fushimi Inari tại Kyoto có hơn một nghìn chiếc cổng Torii màu đỏ son rực rỡ nối tiếp nhau.)'
  },
  '交わります': {
    meaning: 'giao nhau, cắt nhau (con đường, dòng sông: 道/川が交わる)',
    example: '二つの主要な幹線道路が交わる地点に、巨大な立体交差橋が建設された。 (Tại điểm giao nhau của hai tuyến quốc lộ huyết mạch, một cây cầu vượt lập thể khổng lồ đã được xây dựng.)'
  },

  // UNIT 36
  '彫金ます': {
    word: '貯金します',
    reading: 'ちょきんします',
    meaning: 'tiết kiệm tiền, gửi tiền tiết kiệm (đã sửa lỗi chính tả)',
    example: '将来自分のカフェを開業するという夢を叶えるため、毎月の給料から五万円ずつ貯金しています。 (Để hiện thực hóa ước mơ mở quán cà phê, mỗi tháng tôi đều trích 50.000 yên từ tiền lương để tiết kiệm.)'
  },
  'なれます': {
    meaning: 'quen với, quen thuộc [cuộc sống, công việc: 生活/仕事に慣れる]',
    example: '日本に来たばかりの頃は不安でしたが、半年が過ぎてこちらの生活習慣にもすっかり慣れました。 (Hồi mới sang Nhật tôi rất lo lắng, nhưng qua nửa năm tôi đã quen hẳn với tập quán sinh hoạt nơi đây.)'
  },
  '星上手に': {
    word: '上手に',
    reading: 'じょうずに',
    meaning: 'một cách khéo léo, giỏi giang (đã sửa lỗi chính tả)',
    example: '毎日の練習の成果を発揮して、発表会でショパンのピアノ曲をとても上手に演奏できた。 (Phát huy thành quả luyện tập mỗi ngày, tôi đã biểu diễn bản nhạc piano của Chopin vô cùng điêu luyện trong buổi hòa nhạc.)'
  },
  'そのほうがー': {
    word: 'そのほうが～',
    meaning: 'làm như thế thì sẽ tốt hơn ～',
    example: '雨が本降りになりそうだから、無理に歩かずにタクシーを呼ぼう。そのほうが安全だよ。 (Trời sắp mưa to rồi nên đừng ráng đi bộ mà hãy gọi taxi đi. Làm thế an toàn hơn đấy.)'
  },
  '特別（な）': {
    meaning: 'đặc biệt, riêng biệt khác thường',
    example: '両親の結婚三十周年の記念日をお祝いするため、老舗ホテルの特別なディナーを予約した。 (Để mừng kỷ niệm 30 năm ngày cưới của bố mẹ, tôi đã đặt một bữa tối đặc biệt tại khách sạn danh tiếng.)'
  },
  '～とか、～とか': {
    meaning: 'nào là ～ nào là ～ (liệt kê ví dụ thân mật)',
    example: '休日は家で映画を見るとか、近所の公園を散歩するとかして、のんびり気ままに過ごしています。 (Ngày nghỉ tôi thường thảnh thơi làm những việc như xem phim ở nhà, rồi đi dạo quanh công viên gần nhà.)'
  },
  '歴史く': {
    word: '歴史',
    reading: 'れきし',
    meaning: 'lịch sử, bề dày lịch sử (đã sửa lỗi chính tả)',
    example: '古都奈良には、千三百年以上の古い歴史を持つ貴重な寺院や仏像が数多く残されています。 (Ở cố đô Nara còn lưu giữ vô vàn chùa chiền và pho tượng Phật quý giá với bề dày lịch sử hơn 1.300 năm.)'
  },
  'ー世紀': {
    word: '～世紀',
    meaning: 'thế kỷ thứ ～ (đơn vị 100 năm)',
    example: '情報通信技術の急速な進歩によって、二十一世紀の人々の生活様式は劇的に変化した。 (Nhờ sự tiến bộ vượt bậc của công nghệ thông tin, lối sống của con người thế kỷ 21 đã thay đổi ngoạn mục.)'
  },
  'とおく': {
    word: '遠く',
    reading: 'とおく',
    meaning: 'phía xa, nơi xa xôi',
    example: '展望台のデッキに立つと、遠くの青空にくっきりと雪化粧した富士山の姿が見えた。 (Đứng trên đài quan sát phóng tầm mắt, tôi nhìn thấy đỉnh núi Phú Sĩ phủ tuyết trắng xóa từ phía xa tít tắp.)'
  },
  '大勢の（人）': {
    meaning: 'đông người, đám đông quần chúng',
    example: '駅前広場で開催された音楽フェスティバルには、大勢の観客が詰めかけて熱気に包まれていた。 (Tại lễ hội âm nhạc tổ chức ở quảng trường trước ga, đông đảo khán giả đã kéo đến tạo nên bầu không khí vô cùng sôi động.)'
  },

  // UNIT 37
  'ドミニカ': {
    meaning: 'nước Cộng hòa Dominica (vùng biển Caribe)',
    example: '豊かな自然とカリブ海の美しいビーチに惹かれて、観光でドミニカ共和国を訪れました。 (Bị thu hút bởi thiên nhiên trù phú và bãi biển tuyệt đẹp vùng Caribe, tôi đã tới du lịch Cộng hòa Dominica.)'
  },
  '一匹もいません': {
    meaning: 'không có lấy một con nào cả (đếm động vật nhỏ)',
    example: '近所の野良猫を捜して路地裏をくまなく歩き回ったが、今日は一匹も見当たりませんでした。 (Đi lùng khắp các ngõ hẻm tìm chú mèo hoang quen thuộc nhưng hôm nay chẳng thấy bóng dáng con nào cả.)'
  },

  // UNIT 38
  '―せい': {
    word: '～製',
    meaning: 'sản xuất tại ～, chế tạo bằng chất liệu ～ (日本製, ドイツ製)',
    example: '日本の熟練職人が一つずつ丁寧に仕上げた革靴は、耐久性に優れた日本製です。 (Đôi giày da do các nghệ nhân lành nghề Nhật Bản tỉ mỉ hoàn thiện là sản phẩm chất lượng cao sản xuất tại Nhật.)'
  },
  'あ、いけない': {
    meaning: 'ôi chết rồi! / ôi hỏng rồi! (khi sực nhớ ra sai sót hoặc lỡ quên)',
    example: '「あ、いけない！ 玄関の鍵をかけ忘れたまま駅まで来てしまった。」 ("Ôi chết rồi! Tôi để quên không khóa cửa nhà mà đã đi tót ra tận ga rồi.")'
  },

  // UNIT 39
  '焼け舞う': {
    word: '焼けます',
    reading: 'やけます',
    meaning: 'cháy, bị thiêu rụi (nhà: 家が焼ける), nướng chín',
    example: '近所の工場で深夜に大規模な火災が発生し、倉庫が一棟丸ごと焼けてしまいました。 (Vụ hỏa hoạn lớn lúc nửa đêm tại nhà máy gần xóm đã thiêu rụi hoàn toàn một dãy nhà kho.)'
  },
  '入院します（パン/肉が～）': {
    word: '入院します',
    reading: 'にゅういんします',
    meaning: 'nhập viện điều trị (đã tách rời nhầm lẫn với nướng)',
    example: '交通事故で骨折してしまったため、総合病院の整形外科に二週間入院することになりました。 (Bị gãy xương sau tai nạn giao thông, tôi phải nằm viện điều trị hai tuần ở khoa chỉnh hình.)'
  },
  '遅刻します': {
    meaning: 'đến muộn, trễ giờ (học, làm: 会社/学校に遅刻する)',
    example: '人身事故で電車の運行ダイヤが大幅に乱れたため、午前の重要講義に遅刻してしまった。 (Sự cố đường sắt khiến lịch tàu chạy bị đảo lộn nghiêm trọng nên tôi đã đến muộn buổi giảng quan trọng sáng nay.)'
  },
  '早退します': {
    meaning: 'về sớm trước giờ quy định (do ốm hoặc có việc bận)',
    example: '午後から急に激しい頭痛と寒気がしてきたので、上司に事情を説明して一時間早退しました。 (Đột nhiên bị đau đầu dữ dội và ớn lạnh vào buổi chiều, tôi đã báo cáo cấp trên xin phép về sớm một tiếng.)'
  },
  '離婚します': {
    meaning: 'ly hôn, ly dị (chấm dứt hôn nhân)',
    example: '夫婦でお互いの価値観のズレについて長い間話し合った結果、円満に離婚することを選んだ。 (Sau thời gian dài cùng trao đổi về sự bất đồng quan điểm sống, hai vợ chồng đã chọn cách ly hôn trong hòa bình.)'
  },
  '複雑（な）': {
    meaning: 'phức tạp, rắc rối (cấu trúc, thủ tục, tâm lý)',
    example: '大都市の地下鉄の路線図はクモの巣のように張り巡らされていて、慣れないと非常に複雑です。 (Bản đồ các tuyến tàu điện ngầm ở đô thị lớn giăng như mạng nhện, chưa quen thì thấy cực kỳ phức tạp.)'
  },
  '邪魔（な）': {
    meaning: 'vướng víu, cản trở, ngáng đường',
    example: '狭い廊下に大きな段ボール箱を放置しておくと、他の人の通行の邪魔になって危険です。 (Để các thùng các-tông to bừa bãi ở hành lang hẹp sẽ ngáng đường đi của người khác và rất nguy hiểm.)'
  },
  '見合い': {
    meaning: 'buổi xem mắt (nam nữ gặp nhau làm quen qua mối mai)',
    example: '親戚の熱心な仲介を受けて、ホテルの格式高いラウンジでお見合いに臨みました。 (Được sự mai mối nhiệt tình của người họ hàng, tôi đã bước vào buổi xem mắt tại sảnh khách sạn sang trọng.)'
  },
  '電話代': {
    meaning: 'tiền cước điện thoại hằng tháng',
    example: 'スマートフォンを格安SIMのプランに乗り換えたおかげで、毎月の電話代を半分に抑えられた。 (Nhờ chuyển sang dùng gói cước SIM giá rẻ, tôi đã cắt giảm được một nửa tiền cước điện thoại mỗi tháng.)'
  },
  'ー代': {
    word: '～代',
    meaning: 'tiền cước phí, chi phí cho khoản ～ (hậu tố: 部屋代, 食事代)',
    example: '今月は友人たちとの外食の機会が多かったので、家計簿の飲食代が予算を大幅にオーバーした。 (Tháng này ăn ngoài cùng bạn bè nhiều lần nên tiền ăn uống trong sổ chi tiêu đã vượt xa ngân sách.)'
  },
  '汗': {
    meaning: 'mồ hôi cơ thể',
    example: '急な坂道を自転車で懸命に漕ぎ上がったら、額から大粒の汗が吹き出してきた。 (Gò lưng đạp xe leo con dốc dựng đứng, mồ hôi trên trán tôi vã ra từng giọt to tướng.)'
  },
  'お疲れさまでした': {
    meaning: 'anh/chị đã vất vả rồi! (lời chào trân trọng sau khi hoàn thành công việc)',
    example: '定時になりオフィスの全員に向かって「今日も一日お疲れさまでした」と挨拶して退勤した. (Đúng giờ tan sở, tôi cất lời chào mọi người "Hôm nay cả nhà vất vả rồi ạ" rồi bấm thẻ ra về.)'
  },
  '伺います': {
    meaning: 'đến thăm, hỏi thăm (khiêm nhường ngữ của 行く, 来る, 聞く)',
    example: '明日のお約束の時間である午後二時ちょうどに、貴社の受付へ伺います。 (Đúng 2 giờ chiều theo lịch hẹn ngày mai, tôi xin phép được đến quầy lễ tân quý công ty.)'
  },
  'トラック': {
    meaning: 'xe tải chở hàng hóa',
    example: '引っ越し業者の大型トラックがアパートの前に横付けされ、手際よく家具が積み込まれた。 (Chiếc xe tải lớn của đội chuyển nhà đỗ sát trước căn hộ, đồ đạc nội thất được bốc lên thoăn thoắt.)'
  },

  // UNIT 40
  '合います': {
    meaning: 'vừa vặn, hợp [kích cỡ, khẩu vị: サイズ/味が合う]',
    example: '靴屋で試着した革靴が自分の足の形にぴったり合って、とても歩きやすかった。 (Đôi giày da tôi thử ở tiệm giày vừa vặn ôm khít phom chân, đi lại cực kỳ êm ái.)'
  },
  '危険（な）': {
    meaning: 'nguy hiểm, mất an toàn',
    example: '歩行中のスマートフォン操作は周囲への注意が散漫になり、事故につながり大変危険です。 (Vừa đi bộ vừa bấm điện thoại làm phân tán sự chú ý xung quanh, rất nguy hiểm và dễ dẫn đến tai nạn.)'
  },
  '大会': {
    meaning: 'đại hội thể thao, cuộc thi quy mô lớn',
    example: '全国から予選を勝ち抜いた精鋭たちが集まり、東京体育館で熱戦の大会が開催された。 (Các tuyển thủ xuất sắc vượt qua vòng loại toàn quốc đã quy tụ, tranh tài quyết liệt tại nhà thi đấu Tokyo.)'
  },
  'マラソン': {
    meaning: 'chạy việt dã Ma-ra-tông (cự ly 42.195 km)',
    example: '毎週末の地道な走り込みを重ねた末、ホノルルマラソンを無事に四時間台で完走した。 (Sau nhiều tháng miệt mài rèn thể lực cuối tuần, tôi đã hoàn thành cự ly chạy marathon trong 4 tiếng.)'
  },
  '本当': {
    meaning: 'sự thật, tính chân thực',
    example: '最初は信じられなかった奇跡のような出来事だが、調べてみると紛れもない本当の話だった。 (Lúc đầu chuyện kỳ diệu đó khó tin thật, nhưng kiểm tra lại thì quả đúng là câu chuyện có thật 100%.)'
  },
  'まちがい': {
    meaning: 'lỗi sai, sự nhầm lẫn',
    example: 'テストの答案用紙を見直していたら、計算の単純なまちがいに気付いて慌てて消しゴムで直した。 (Soát lại bài thi, tôi phát hiện một lỗi tính toán sơ đẳng nên vội vàng lấy tẩy sửa lại.)'
  },
  'ー便': {
    word: '～便',
    meaning: 'chuyến bay số ～ (hàng không: JL123便)',
    example: 'ハノイ行きの最終便は、天候不良の影響により出発時刻が三十分遅延する見込みです。 (Chuyến bay cuối ngày đi Hà Nội dự kiến khởi hành muộn 30 phút do thời tiết xấu.)'
  },
  'ー号': {
    word: '～号',
    meaning: 'chuyến tàu số ～, số phòng ～, cơn bão số ～',
    example: '大型で非常に強い勢力を持つ台風十号が、明日の夜遅くに九州地方へ接近する見通しです。 (Cơn bão số 10 với cường độ rất mạnh dự báo sẽ áp sát khu vực Kyushu vào đêm muộn ngày mai.)'
  },
  'ー本': {
    word: '～本',
    meaning: '～ chai, lọ, cây, que (đơn vị đếm vật thon dài: ほん/ぽん/ぼん)',
    example: '喉の渇きを潤すために、駅のホームの自動販売機で冷たいお茶を一本買いました。 (Để làm dịu cơn khát cổ họng, tôi mua một chai trà lạnh ở máy bán nước tự động trên sân ga.)'
  },
  '―はい': {
    word: '～杯',
    meaning: '～ chén, tách, bát, ly (đơn vị đếm đồ uống trong cốc/bát: はい/ぱい/ばい)',
    example: '寒い冬の夜、湯気の立つ熱い味噌汁をもう一杯おかわりして体を温めた。 (Trong đêm đông giá rét, tôi xin thêm một bát súp miso bốc khói nghi ngút để sưởi ấm cơ thể.)'
  },
  '―キロ': {
    word: '～キロ',
    meaning: '～ ki-lô (ki-lô-gam kg hoặc ki-lô-mét km)',
    example: '毎日のジョギングで基礎体力を鍛えた結果、体重が無理なく三キロ減量できました。 (Nhờ chạy bộ rèn thể lực mỗi ngày, tôi đã giảm được 3 kg một cách nhẹ nhàng, khỏe khoắn.)'
  },
  '―グラム': {
    word: '～グラム',
    meaning: '～ gam (đơn vị đo khối lượng)',
    example: 'ステーキの専門店で、霜降りの極上和牛を三百グラム注文して堪能しました。 (Tại nhà hàng chuyên bò bít tết, tôi đã gọi một miếng bò Wagyu thượng hạng 300 gam thưởng thức.)'
  },
  'ーセンチ': {
    word: '～センチ',
    meaning: '～ xăng-ti-mét (cm)',
    example: '健康診断で身長を計測したところ、去年よりも一センチ背が伸びていました。 (Đo chiều cao trong đợt khám sức khỏe, tôi thấy mình đã cao thêm một xăng-ti-mét so với năm ngoái.)'
  },
  'ーミリ': {
    word: '～ミリ',
    meaning: '～ mi-li-mét (mm)',
    example: '精密部品の金型加工では、わずか零点一ミリの狂いも許されない厳密さが求められる。 (Trong gia công khuôn mẫu linh kiện chính xác, độ sai số 0.1 mm cũng tuyệt đối không được phép xảy ra.)'
  },
  'ー以上': {
    word: '～以上',
    meaning: 'từ ～ trở lên (bao gồm cả mốc tính)',
    example: 'このアトラクションは安全確保のため、身長百二十センチ以上のお子様のみ搭乗可能です。 (Để đảm bảo an toàn, trò chơi này chỉ dành cho trẻ em có chiều cao từ 120 cm trở lên tham gia.)'
  },
  'ー以下': {
    word: '～以下',
    meaning: 'từ ～ trở xuống, dưới mốc ～',
    example: '小学生以下の小さなお子様は、保護者の方の同伴が必要となります。 (Trẻ nhỏ từ độ tuổi tiểu học trở xuống bắt buộc phải có phụ huynh đi cùng giám sát.)'
  },
  'どうでしょうか': {
    meaning: 'thấy thế nào ạ? (cách hỏi ý kiến trang trọng của どうですか)',
    example: '「新しいオフィスのレイアウト案を作成してみたのですが、社長、いかがでしょうか。」 ("Em vừa dựng xong phương án bố trí mặt bằng văn phòng mới, thưa giám đốc xem có được không ạ?")'
  },
  '積みます': {
    meaning: 'chất lên xe, xếp hàng hóa (荷物を積む)',
    example: 'キャンプ場へ向かう前に、車の広いトランクにテントやバーベキュー用品を積みました。 (Trước khi lên đường đi cắm trại, tôi đã xếp lều bạt và dụng cụ nướng thịt vào cốp xe ô tô.)'
  },
  '離れた': {
    meaning: 'cách xa, cách biệt (về khoảng cách)',
    example: '都会の喧騒から遠く離れた静かな山里で、澄んだ空気を吸って心身を癒やした。 (Tại một ngôi làng trên núi cách xa sự ồn ào của phố thị, tôi hít thở bầu không khí trong lành thanh lọc tâm hồn.)'
  },
  'ゆうに': {
    word: '急に',
    reading: 'きゅうに',
    meaning: 'đột ngột, bất thình lình (đã sửa lỗi chính tả từ ゆうに)',
    example: '夕方に空が暗くなったかと思うと、前ぶれもなく急に大粒の雨が激しく降り出した。 (Chiều muộn trời sầm tối lại, rồi bất thình lình cơn mưa rào trút nước như trút không báo trước.)'
  },
  '動かします': {
    meaning: 'vận hành, làm cho máy móc chuyển động (máy móc: 機械を動かす)',
    example: 'レバーを手前に引いてエンジンのスイッチを入れると、大型の建設機械が力強く動いた。 (Kéo cần gạt về phía mình rồi bật công tắc, cỗ máy công trình hạng nặng gầm vang chuyển động.)'
  },
  '今でも': {
    meaning: 'ngay cả bây giờ, cho đến tận hôm nay',
    example: '祖母が若い頃に愛用していたアンティークの懐中時計は、今でも正確に時を刻んでいます。 (Chiếc đồng hồ bỏ túi cổ của bà tôi dùng thời trẻ, cho đến tận hôm nay vẫn chạy giờ rất chuẩn xác.)'
  },
  'うわさします': {
    meaning: 'đồn đại, bàn tán xôn xao',
    example: 'あの二人が近々結婚するらしいという噂が、社内で密かに囁かれています。 (Tin đồn hai người họ sắp làm đám cưới đang được mọi người trong công ty xì xào bàn tán.)'
  },

  // UNIT 41
  '［お］見舞い': {
    meaning: 'thăm người ốm, quà thăm bệnh',
    example: '入院中の同僚の病室を訪れて、元気づけるためにきれいなお見舞いの花束を手渡した。 (Tới thăm phòng bệnh đồng nghiệp nằm viện, tôi trao tặng bó hoa thăm bệnh tươi tắn để động viên tinh thần.)'
  },
  '情報': {
    meaning: 'thông tin, tin tức dữ liệu',
    example: 'インターネット上の膨大な情報の中から、信頼できる確かな根拠のあるデータを選び出す。 (Từ lượng thông tin khổng lồ trên mạng, tôi chọn lọc ra những số liệu có căn cứ xác thực tin cậy.)'
  },
  '絵本': {
    meaning: 'sách tranh, truyện tranh thiếu nhi',
    example: '寝る前にベッドの横で、色鮮やかなイラストが描かれた絵本を子どもに読み聞かせた。 (Trước giờ ngủ, tôi ngồi cạnh giường đọc cuốn truyện tranh vẽ hình sinh động cho con nghe.)'
  },
  'バッグ': {
    meaning: 'túi xách, túi đeo vai (bag)',
    example: '通勤用の革製バッグの中に、ノートパソコンと折りたたみ傘をコンパクトに収納した。 (Trong chiếc túi xách da đi làm, tôi xếp gọn gàng chiếc laptop cùng cây dù gấp.)'
  },
  '孫': {
    meaning: 'cháu (con của con mình)',
    example: 'お正月には遠方に住む孫たちが遊びに来て、家の中が笑い声で一気に賑やかになった。 (Dịp Tết các cháu ở xa về chơi, cả căn nhà rộn rã hẳn lên trong tiếng cười đùa.)'
  },
  'おじ': {
    meaning: 'chú, bác, cậu của mình',
    example: '北海道で牧場を経営しているおじから、絞りたての濃厚な生乳チーズが届きました。 (Bác tôi làm chủ trang trại chăn nuôi ở Hokkaido vừa gửi tặng món phô mai sữa tươi béo ngậy.)'
  },
  'おば': {
    meaning: 'cô, dì, bác gái của mình',
    example: '裁縫が得意なおばが、私の入学祝いに丈夫な手提げ袋をミシンで縫ってプレゼントしてくれた。 (Người dì khéo tay may vá đã tự may chiếc túi vải bền đẹp bằng máy may làm quà nhập học cho tôi.)'
  },
  'おばさん': {
    meaning: 'cô, bác gái (cách gọi người phụ nữ trung niên)',
    example: '近所の八百屋のおばさんはいつも元気いっぱいで、新鮮なおまけをサービスしてくれる。 (Bác gái bán rau ở tiệm rau gần nhà lúc nào cũng vui vẻ xởi lởi, hay cho thêm rau củ tươi ngon.)'
  },
  'おととし': {
    meaning: 'năm kia (hai năm trước, đã sửa nghĩa sai từ cuối cùng)',
    example: '私が初めて日本へ旅行でやって来たのは、パンデミックが始まる前のおととしの冬でした。 (Lần đầu tiên tôi sang Nhật du lịch là vào mùa đông năm kia, trước khi đại dịch bùng phát.)'
  },
  'はあ': {
    meaning: 'vâng, tôi hiểu rồi ạ (cách tiếp lời trang trọng)',
    example: '「こちらのお席でお掛けになってお待ちください。」「はあ、分かりました。恐れ入ります。」 ("Xin mời quý khách ngồi chờ ở ghế này ạ." "Vâng, tôi hiểu rồi. Cảm ơn cô.")'
  },
  '預かります': {
    meaning: 'trông nom hộ, giữ hộ đồ đạc [荷物を預かる]',
    example: 'ホテルにチェックインする前、フロントのクロークに重いキャリーバッグを預けました。 (Trước giờ nhận phòng khách sạn, tôi gửi chiếc vali kéo nặng tại quầy giữ đồ lễ tân.)'
  },
  '助かります': {
    meaning: 'được cứu giúp, đỡ quá (nhờ ai giúp đỡ)',
    example: '雨が降って困っていたときに傘を貸していただき、本当に助かりました。 (Lúc trời mưa đang bối rối được bạn cho mượn cây dù, tôi thực sự đỡ quá, cảm ơn bạn nhiều.)'
  },
  '昔話': {
    meaning: 'chuyện cổ tích ngày xưa, truyện ngụ ngôn',
    example: '囲炉裏の火を囲みながら、祖母が語ってくれた『桃太郎』の昔話に夢中で聞き入った。 (Quây quần bên bếp sưởi, tôi say sưa lắng nghe câu chuyện cổ tích Momotaro do bà kể.)'
  },
  'ある~': {
    meaning: 'có một ～ nọ (mở đầu truyện: ある日, ある所)',
    example: 'ある晴れた春の日の朝、森の奥深くで小さな子鹿の赤ちゃんが誕生しました。 (Vào một buổi sáng mùa xuân nắng đẹp nọ, sâu trong cánh rừng già một chú hươu con vừa chào đời.)'
  },
  'いじめます': {
    meaning: 'bắt nạt, trêu chọc ác ý',
    example: 'どんな理由があろうとも、自分より立場の弱い者をいじめる行為は決して許されません。 (Dù với bất kỳ lý do gì, hành vi bắt nạt kẻ yếu thế hơn mình là điều tuyệt đối không thể dung thứ.)'
  },
  '烏龜': {
    word: '亀',
    reading: 'かめ',
    meaning: 'con rùa (đã sửa chữ Hán Trung Quốc 烏龜 thành chữ Nhật 亀)',
    example: '浦島太郎の昔話では、浜辺で子どもにいじめられていた亀を心優しい青年が助け出します。 (Trong truyện cổ tích Urashima Taro, chàng trai nhân hậu đã cứu chú rùa bị lũ trẻ trêu chọc ngoài bãi biển.)'
  },
  '助けます': {
    meaning: 'cứu giúp, giải thoát khỏi hoạn nạn',
    example: '川で溺れかけていた子犬の鳴き声を聞きつけ、通りかかった男性が水に飛び込んで助け出した。 (Nghe tiếng chú cún con kêu cứu suýt chết đuối dưới sông, một người đàn ông đi ngang đã lao xuống cứu.)'
  },
  '[お］城': {
    word: 'お城',
    reading: 'おしろ',
    meaning: 'tòa lâu đài, thành quách cổ',
    example: '白鷺が羽を広げたような優美な白壁を持つ姫路城は、世界遺産に登録された名城です。 (Thành Himeji với những bức tường trắng thanh thoát tựa chim hạc tung cánh là tòa thành nổi tiếng di sản thế giới.)'
  },
  'お姫様': {
    meaning: 'nàng công chúa xinh đẹp',
    example: '豪華絢爛なドレスをまとった美しいお姫様が、王宮のバルコニーから民衆に手を振った。 (Nàng công chúa xinh đẹp lộng lẫy trong bộ váy kiêu sa đứng trên ban công hoàng cung vẫy tay chào muôn dân.)'
  },
  '楽しく': {
    meaning: 'một cách vui vẻ, hào hứng (phó từ)',
    example: '放課後の教室で、クラスメイトたちと文化祭の準備を夜遅くまで楽しく進めました。 (Trong lớp học sau giờ tan trường, chúng tôi cùng các bạn hào hứng chuẩn bị cho ngày hội văn hóa tới tận tối muộn.)'
  },
  '暮らします': {
    meaning: 'sinh sống, an cư lạc nghiệp',
    example: '定年退職した後は、海と山の自然に恵まれた温暖な田舎町でのんびり暮らしたいです。 (Sau khi về hưu, tôi mong muốn được an nhàn sinh sống ở một miền quê ấm áp chan hòa thiên nhiên biển núi.)'
  },
  '陸': {
    meaning: 'đất liền, lục địa',
    example: '数週間にわたる過酷な航海を終えた船乗りたちは、はるか前方に陸地の影を見つけて歓喜した。 (Kết thúc chuyến hải trình gian khổ kéo dài nhiều tuần, các thủy thủ vỡ òa reo hò khi nhìn thấy bóng dáng đất liền phía trước.)'
  },
  '中身': {
    meaning: 'ruột bên trong, nội dung bên trong',
    example: 'プレゼント用の箱をそっと開けると、中身は高級なスイス製のオルゴールでした。 (Khẽ mở chiếc hộp quà tặng, món đồ bên trong là chiếc hộp nhạc Thụy Sĩ sang trọng.)'
  }
};

function run() {
  console.log('Bắt đầu cập nhật Minna N4 Batch A (Unit 26 -> Unit 41)...');
  let updatedCount = 0;

  for (let u = 26; u <= 41; u++) {
    const unitFolder = 'unit-' + u;
    const rel = path.join('minna-no-nihongo-n4', unitFolder, 'vocabulary.json');
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

  console.log(`\nHoàn tất Batch A N4! Đã cập nhật ${updatedCount} từ vựng.`);
}

run();

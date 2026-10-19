/**
 * scripts/refine-minna-n4-batch4.js
 * Chuẩn hóa chuyên sâu 100% từ vựng Minna no Nihongo N4 (Bài 41 đến Bài 50):
 * - Triệt tiêu toàn bộ template lặp lại.
 * - Mỗi từ đi với Collocation và câu ví dụ tự nhiên chuẩn bản xứ.
 * - Bản dịch tiếng Việt mượt mà, đúng ngữ cảnh thực tế.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data', 'minna-no-nihongo-n4');

const UNIT_DICTIONARY = {
  // Sửa từ ở unit-40
  'unit-40': {
    '確かめます': { meaning: 'kiểm tra, xác nhận (kiểm tra lại cho chắc chắn, tránh sai sót)', reading: 'たしかめます', ex: '飛行機のチケットの日時と座席番号をもう一度確かめました。 (Tôi kiểm tra lại lần nữa ngày giờ và số ghế trên vé máy bay.)' }
  },

  // ================= UNIT 41 =================
  'unit-41': {
    '取り替えます': { meaning: 'đổi lại, thay thế (pin, bóng đèn, phụ tùng)', reading: 'とりかえます', ex: '時計の電池が切れたので、新しい電池に取り替えました。 (Đồng hồ hết pin nên tôi đã thay một viên pin mới vào.)' },
    '親切に します': { meaning: 'đối xử tốt bụng, ân cần, tử tế', reading: 'しんせつにします', ex: '困っている留学生に対して、みんなで親切にしてあげました。 (Mọi người cùng đối xử rất ân cần giúp đỡ bạn du học sinh gặp khó khăn.)' },
    'かわいい': { meaning: 'dễ thương, đáng yêu', reading: 'かわいい', ex: '白いふわふわの子犬がしっぽを振っていてとてもかわいいです。 (Chú cún con lông trắng muốt xù bông vẫy vẫy đuôi trông thật đáng yêu.)' },
    'お祝い': { meaning: 'món quà mừng, lời chúc mừng', reading: 'おいわい', ex: '友達の出産のお祝いに可愛いベビー服をプレゼントしました。 (Tôi tặng bộ quần áo sơ sinh xinh xắn làm quà mừng bạn sinh em bé.)' },
    'お年玉': { meaning: 'tiền mừng tuổi, lì xì đầu năm', reading: 'おとしだま', ex: 'お正月におじいちゃんとおばあちゃんからお年玉をもらいました。 (Vào dịp Tết, tôi được ông bà mừng tuổi cho tiền lì xì.)' },
    'お見舞い': { meaning: 'việc đi thăm người ốm, quà thăm bệnh', reading: 'おみまい', ex: '入院している同僚のお見舞いに果物の詰め合わせを持参しました。 (Tôi mang giỏ hoa quả đến bệnh viện thăm người đồng nghiệp nằm viện.)' },
    '興味': { meaning: 'hứng thú, sự quan tâm yêu thích', reading: 'きょうみ', ex: '子供のころから日本の伝統的な建築に強い興味を持っています。 (Từ nhỏ tôi đã có niềm đam mê sâu sắc với kiến trúc truyền thống Nhật Bản.)' },
    '情報': { meaning: 'thông tin, tin tức', reading: 'じょうほう', ex: 'インターネットを通じて世界中の最新情報を瞬時に手に入れられます。 (Qua internet, ta có thể tiếp cận tin tức mới nhất khắp thế giới trong chớp mắt.)' },
    '文法': { meaning: 'ngữ pháp (ngôn ngữ)', reading: 'ぶんぽう', ex: '日本語の文法を正しく理解するために、毎日例文を書いています。 (Để nắm vững ngữ pháp tiếng Nhật, ngày nào tôi cũng tự đặt câu ví dụ.)' },
    '発音': { meaning: 'phát âm, cách đọc', reading: 'はつおん', ex: '先生のきれいな日本語の発音をよく真似して練習しました。 (Tôi chăm chú lắng nghe và bắt chước theo cách phát âm chuẩn của thầy.)' },
    '猿': { meaning: 'con khỉ', reading: 'さる', ex: '日光の山道で野生の猿が木の実を食べているのを見かけました。 (Trên con đường núi ở Nikko, tôi bắt gặp chú khỉ hoang dã đang ăn quả cây.)' },
    'えさ': { meaning: 'thức ăn cho động vật, mồi câu', reading: 'えさ', ex: '池の鯉にパンくずのえさをあげると、口を開けて集まってきました。 (Khi tôi ném vụn bánh mì cho cá koi trong hồ, đàn cá liền xúm lại đớp mồi.)' },
    'おもちゃ': { meaning: 'đồ chơi trẻ em', reading: 'おもちゃ', ex: '甥っ子の誕生日に木で作られた温かみのあるおもちゃを贈りました。 (Nhân dịp sinh nhật cháu trai, tôi tặng cháu một bộ đồ chơi bằng gỗ ấm áp.)' },
    'えほん': { meaning: 'sách tranh thiếu nhi', reading: 'えほん', ex: '毎晩寝る前に、子供にカラフルな絵本を読み聞かせています。 (Mỗi tối trước khi đi ngủ, tôi đều đọc sách tranh nhiều màu sắc cho con nghe.)' },
    '絵はがき': { meaning: 'bưu thiếp có hình ảnh', reading: 'えはがき', ex: '旅先の京都から実家の両親へ桜の綺麗な絵葉書を送りました。 (Từ Kyoto nơi du lịch, tôi gửi bức bưu thiếp ảnh hoa anh đào về cho bố mẹ.)' },
    'ドライバー': { meaning: 'tua vít, tài xế', reading: 'ドライバー', ex: '本棚のネジが緩んでいたので、プラスドライバーでしっかり締めました。 (Ốc vít kệ sách bị lỏng nên tôi dùng tua vít bốn cạnh siết chặt lại.)' },
    'ハンカチ': { meaning: 'chiếc khăn tay', reading: 'ハンカチ', ex: '手を洗った後は、清潔なハンカチできちんと水気を拭き取ります。 (Sau khi rửa tay, tôi dùng chiếc khăn tay sạch sẽ lau khô tay.)' },
    '靴下': { meaning: 'đôi tất, đôi vớ', reading: 'くつした', ex: '寒い冬の夜は、暖かいウールの靴下を履いて寝ます。 (Vào những đêm đông lạnh giá, tôi xỏ đôi tất len ấm áp đi ngủ.)' },
    '手袋': { meaning: 'đôi găng tay', reading: 'てぶくろ', ex: '雪が降ってきたので、ポケットから厚手の手袋を出してはめました。 (Trời bắt đầu đổ tuyết nên tôi rút đôi găng tay dày trong túi ra đeo.)' },
    '幼稚園': { meaning: 'trường mẫu giáo', reading: 'ようちえん', ex: '毎朝母親が笑顔で幼い子供の手を引いて幼稚園へ通っています。 (Mỗi sáng người mẹ mỉm cười dắt tay con thơ đến trường mẫu giáo.)' },
    '暖房': { meaning: 'hệ thống sưởi, lò sưởi', reading: 'だんぼう', ex: '部屋が冷え込んできたので、エアコンの暖房をつけて部屋を暖めました。 (Căn phòng trở nên giá buốt nên tôi bật chế độ sưởi điều hòa cho ấm áp.)' },
    '冷房': { meaning: 'hệ thống làm mát, máy lạnh', reading: 'れいぼう', ex: '真夏の暑い日には、冷房を28度に設定して快適に過ごします。 (Những ngày hè oi bức, tôi cài điều hòa mát ở 28 độ để sinh hoạt dễ chịu.)' },
    '温度': { meaning: 'nhiệt độ', reading: 'おんど', ex: 'お風呂の温度を40度に設定して、ゆっくり湯船に浸かりました。 (Tôi cài nhiệt độ nước bồn tắm ở 40 độ rồi thư thả ngâm mình.)' },
    'このあいだ': { meaning: 'hôm nọ, dạo gần đây', reading: 'このあいだ', ex: 'この間駅前のスーパーで久しぶりに高校時代の恩師に会いました。 (Hôm nọ tại siêu thị trước ga, tôi tình cờ gặp lại người thầy giáo cũ cấp ba.)' },
    'ひとこと': { meaning: 'đôi lời, một vài câu ngắn gọn', reading: 'ひとこと', ex: '送別会の最後に、転勤する同僚へ感謝の気持ちを一言伝えました。 (Cuối tiệc chia tay, tôi nói đôi lời tri ân gửi tới người đồng nghiệp chuyển công tác.)' },
    '～ずつ': { meaning: 'từng... một (phân bổ số lượng)', reading: 'ずつ', ex: '新しい漢字を1日5個ずつノートに書いて着実に覚えています。 (Mỗi ngày tôi viết 5 chữ Hán mới vào vở để ghi nhớ thật vững chắc.)' },
    'お宅': { meaning: 'nhà của quý vị (kính ngữ của うち/いえ)', reading: 'おたく', ex: '先日は先生のお宅にお邪魔させていただき、ありがとうございました。 (Hôm trước em rất cảm ơn thầy vì đã cho phép em đến thăm nhà thầy ạ.)' },
    'どうぞお上がりください': { meaning: 'xin mời vào nhà (mời cởi giày bước lên)', reading: 'どうぞおあがりください', ex: '「いらっしゃい、どうぞお上がりください」「お邪魔します」 (Chào bạn đã đến chơi, xin mời bạn vào nhà nhé. - Dạ làm phiền cả nhà ạ.)' },
    '内緒': { meaning: 'bí mật, chuyện riêng kín đáo', reading: 'ないしょ', ex: 'このサプライズパーティーの計画は、彼には当日まで内緒ですよ。 (Kế hoạch bữa tiệc bất ngờ này nhất định phải giữ bí mật với anh ấy đến phút chót nhé.)' }
  },

  // ================= UNIT 42 =================
  'unit-42': {
    '包みます': { meaning: 'bọc, gói ghém (quà tặng, bánh kẹo)', reading: 'つつみます', ex: '割れないように、ガラスのコップを新聞紙で丁寧に包みました。 (Để không bị vỡ, tôi bọc chiếc cốc thủy tinh cẩn thận bằng giấy báo.)' },
    '沸かします': { meaning: 'đun sôi (nước: お湯を沸かす)', reading: 'わかします', ex: '温かいお茶を飲むために、やかんでお湯を沸かしました。 (Để pha ấm trà nóng, tôi đã bắc ấm đun sôi nước.)' },
    '混ぜます': { meaning: 'khuấy đều, trộn lẫn', reading: 'まぜます', ex: 'ボウルに卵と牛乳を入れて、泡立て器でしっかり混ぜました。 (Tôi cho trứng và sữa vào tô rồi dùng phới lồng khuấy đều.)' },
    '計算します': { meaning: 'tính toán (chi phí, sổ sách)', reading: 'けいさんします', ex: '旅行にかかる全体の費用を電卓を使って正確に計算しました。 (Tôi dùng máy tính bỏ túi tính toán chính xác tổng chi phí cho chuyến du lịch.)' },
    '並びます': { meaning: 'xếp hàng (chờ đợi)', reading: 'ならびます', ex: '映画館の窓口の前にチケットを買う大勢の人が並んでいます。 (Trước quầy vé rạp chiếu phim có rất đông người đứng xếp hàng.)' },
    '丈夫な': { meaning: 'bền bỉ, chắc chắn (đồ vật, sức khỏe)', reading: 'じょうぶ「な」', ex: 'この革のビジネスバッグはとても丈夫で、10年使い続けています。 (Chiếc cặp da công sở này rất bền, tôi dùng suốt 10 năm nay vẫn tốt.)' },
    '弁護士': { meaning: 'luật sư', reading: 'べんごし', ex: '契約のトラブルを解決するために、専門の弁護士に相談しました。 (Để giải quyết rắc rối hợp đồng, tôi đã tham vấn ý kiến luật sư chuyên môn.)' },
    '音楽家': { meaning: 'nhạc sĩ, nhà soạn nhạc', reading: 'おんがくか', ex: '世界的に有名な音楽家が作曲したピアノ曲に深く感動しました。 (Tôi vô cùng xúc động trước bản dương cầm của nhà soạn nhạc danh tiếng thế giới.)' },
    '教育': { meaning: 'giáo dục', reading: 'きょういく', ex: '子供たちの未来を豊かにするために、質の高い教育が不可欠です。 (Để làm giàu tương lai cho con trẻ, một nền giáo dục chất lượng là điều tất yếu.)' },
    '文化': { meaning: 'văn hóa', reading: 'ぶんか', ex: '京都の古い街並みを歩きながら、日本の伝統文化を肌で感じました。 (Dạo bước giữa phố cổ Kyoto, tôi cảm nhận sâu sắc nét đẹp văn hóa truyền thống Nhật.)' },
    '社会': { meaning: 'xã hội', reading: 'しゃかい', ex: '大学を卒業して、自立した社会人の一員として歩み始めました。 (Tốt nghiệp đại học, tôi bắt đầu bước vào đời với tư cách một thành viên xã hội tự lập.)' },
    '法律': { meaning: 'luật pháp, pháp luật', reading: 'ほうりつ', ex: '公正で安全な社会を守るために、定められた法律を守りましょう。 (Để duy trì xã hội công bằng và an toàn, chúng ta hãy sống thượng tôn pháp luật.)' },
    '戦争': { meaning: 'chiến tranh', reading: 'せんそう', ex: '二度と悲惨な戦争を繰り返してはならないと平和資料館で誓いました。 (Tại bảo tàng chứng tích hòa bình, tôi tự nhủ không bao giờ được để chiến tranh tái diễn.)' },
    '平和': { meaning: 'hòa bình', reading: 'へいわ', ex: '世界中の人々が安心して暮らせる平和な社会を心から願っています。 (Tôi tha thiết mong ước một xã hội hòa bình nơi mọi người khắp năm châu được an cư.)' },
    '目的': { meaning: 'mục đích, mục tiêu', reading: 'もくてき', ex: '日本へ来た最大の目的は、最先端のIT技術を学ぶことです。 (Mục đích lớn nhất khi tôi sang Nhật là để học hỏi công nghệ IT tối tân.)' },
    '論文': { meaning: 'luận văn, bài báo khoa học', reading: 'ろんぶん', ex: '図書館で多くの参考文献を読み込み、卒業論文を書き上げました。 (Nghiên cứu kỹ nhiều tài liệu tham khảo trong thư viện, tôi đã hoàn thành khóa luận.)' },
    'ミキサー': { meaning: 'máy xay sinh tố', reading: 'ミキサー', ex: 'バナナと牛乳をミキサーにかけて、フレッシュジュースを作りました。 (Tôi cho chuối và sữa vào máy xay để làm một ly sinh tố tươi ngon.)' },
    'やかん': { meaning: 'cái ấm đun nước', reading: 'やかん', ex: 'お湯が沸くとピーと音が鳴るやかんを長年愛用しています。 (Tôi rất thích chiếc ấm đun nước có còi reo báo hiệu mỗi khi nước sôi.)' },
    'ふた': { meaning: 'cái nắp (nồi, hộp)', reading: 'ふた', ex: '煮込み料理を作るときは、落としぶたをして味を染み込ませます。 (Khi nấu món kho, tôi dùng nắp đậy lọt lòng để gia vị ngấm đều.)' },
    '栓抜き': { meaning: 'cái mở nắp chai bia, bật nắp', reading: 'せんぬき', ex: '瓶ビールの王冠を開けるために栓抜きを探しました。 (Tôi đi tìm chiếc mở nắp chai để bật nắp chai bia thủy tinh.)' },
    '缶切り': { meaning: 'cái khui đồ hộp', reading: 'かんきり', ex: 'キャンプ場で缶詰を開けるために缶切りを使いました。 (Ở khu cắm trại, tôi dùng chiếc khui đồ hộp để mở hộp thức ăn.)' },
    '缶詰': { meaning: 'đồ hộp, thực phẩm đóng hộp', reading: 'かんづめ', ex: '非常用の備蓄食料として、ツナや果物の缶詰を常備しています。 (Tôi luôn dự trữ sẵn đồ hộp cá ngừ và trái cây để làm thực phẩm phòng chống thiên tai.)' },
    'のし袋': { meaning: 'phong bao phong bì mừng hỷ/viếng', reading: 'のしぶくろ', ex: '結婚式のご祝儀を水引が付いたのし袋に包んで持参しました。 (Tôi bỏ tiền mừng đám cưới vào phong bao trang trọng có buộc dây Mizuhiki.)' },
    'ふろしき': { meaning: 'khăn gói đồ truyền thống Furoshiki', reading: 'ふろしき', ex: 'お中元の菓子折りを美しい和柄の風呂敷に包んで訪問しました。 (Tôi bọc hộp bánh quà biếu bằng chiếc khăn Furoshiki họa tiết Nhật rồi sang thăm.)' },
    'そろばん': { meaning: 'bàn tính gảy Soroban', reading: 'そろばん', ex: '小学生のころにそろばん塾に通っていたので、暗算が得意です。 (Hồi tiểu học từng đi học bàn tính Soroban nên tôi tính nhẩm rất nhanh.)' },
    '体温計': { meaning: 'nhiệt kế đo thân nhiệt', reading: 'たいおんけい', ex: '熱っぽいと感じたので、電子体温計で熱を測りました。 (Thấy người nong nóng, tôi liền lấy nhiệt kế điện tử đo nhiệt độ cơ thể.)' }
  },

  // ================= UNIT 43 =================
  'unit-43': {
    '増えます': { meaning: 'tăng lên (tự động từ: số lượng, cân nặng, xuất khẩu)', reading: 'ふえます', ex: '最近この街に住む外国人観光客の数が急速に増えています。 (Dạo gần đây số lượng du khách nước ngoài đến thành phố này đang tăng vọt.)' },
    '減ります': { meaning: 'giảm đi (tự động từ: dân số, chi phí, rác thải)', reading: 'へります', ex: 'ペーパーレス化を進めたことで、職場の紙の消費量が減りました。 (Đẩy mạnh số hóa không dùng giấy đã giúp lượng giấy tiêu thụ ở văn phòng giảm rõ rệt.)' },
    '上がります': { meaning: 'tăng giá, đi lên (tự động từ: giá cả: 物価が上がる)', reading: 'あがります', ex: '円安の影響で、輸入品の食料品の値段が上がっています。 (Do ảnh hưởng đồng Yên giảm giá, giá các mặt hàng thực phẩm nhập khẩu tăng lên.)' },
    '下がります': { meaning: 'hạ giá, tụt xuống (tự động từ: nhiệt độ, giá cả)', reading: 'さがります', ex: '夕方から冷たい雨が降り、気温が急激に下がりました。 (Từ chiều có mưa lạnh trút xuống khiến nhiệt độ tụt dốc nhanh chóng.)' },
    '切れます': { meaning: 'bị đứt (dây), hết (pin: 電池が切れる)', reading: 'きれます', ex: '重い荷物を持ち上げた拍子に、紙袋の取っ手が切れてしまいました。 (Đúng lúc nhấc túi đồ nặng lên thì quai túi giấy bị đứt phụt mất.)' },
    'とれます': { meaning: 'bị tuột, bị rơi ra (cúc áo: ボタンがとれる)', reading: 'とれます', ex: 'コートの第一ボタンがとれてしまったので、針と糸で縫い直しました。 (Cúc đầu tiên của áo khoác bị đứt tuột nên tôi lấy kim chỉ khâu lại.)' },
    '落ちます': { meaning: 'bị rơi, rớt (tự động từ)', reading: 'おちます', ex: 'ポケットから定期券が落ちて、親切な人が拾ってくれました。 (Vé tháng từ túi áo tôi bị rơi ra và được một người tốt bụng nhặt giúp.)' },
    'なくなります': { meaning: 'hết sạch, biến mất (tự động từ: tiền, xăng)', reading: 'なくなります', ex: '長距離をドライブしていたら、車のガソリンがなくなりそうになりました。 (Lái xe đường dài liên tục khiến bình xăng ô tô suýt nữa cạn kiệt.)' },
    '変な': { meaning: 'kỳ lạ, bất thường, quái dị', reading: 'へん「な」', ex: 'エンジンから変な音が聞こえるので、整備工場で見てもらいます。 (Từ động cơ xe phát ra tiếng kêu lạ bất thường nên tôi đem ra xưởng bảo dưỡng.)' },
    '幸せな': { meaning: 'hạnh phúc, viên mãn', reading: 'しあわせ「な」', ex: '家族みんなが健康で笑顔で暮らせることが、私の一番の幸せです。 (Cả gia đình luôn khỏe mạnh và tràn ngập tiếng cười là niềm hạnh phúc lớn nhất của tôi.)' },
    'うまい': { meaning: 'ngon miệng, khéo léo (văn nói thân mật)', reading: 'うまい', ex: '運動した後に飲む冷たい一杯の水は本当にうまいですね。 (Sau khi vận động xong, uống một cốc nước mát lạnh thật là đã!)' },
    'まずい': { meaning: 'dở tệ (món ăn), gay go (tình huống)', reading: 'まずい', ex: '塩と砂糖を間違えて入れてしまい、まずい料理になってしまいました。 (Bỏ nhầm muối thành đường làm món ăn có vị dở tệ không nuốt nổi.)' },
    'つまらない': { meaning: 'nhàm chán, tẻ nhạt, vô vị', reading: 'つまらない', ex: '期待していた映画のストーリーが平坦で、少しつまらなかったです。 (Cốt truyện bộ phim tôi từng kỳ vọng lại khá bằng phẳng và hơi tẻ nhạt.)' },
    'ガソリン': { meaning: 'nhiên liệu xăng', reading: 'ガソリン', ex: '高速道路に乗る前に、ガソリンスタンドで満タンに給油しました。 (Trước khi vào đường cao tốc, tôi ghé trạm xăng đổ đầy bình nhiên liệu.)' },
    'センス': { meaning: 'gu thẩm mỹ, cảm khiếu tinh tế', reading: 'センス', ex: '彼女はいつも色使いが素敵な服を着ていて、ファッションセンスが良いです。 (Cô ấy luôn diện những trang phục phối màu tuyệt đẹp, gu thời trang rất tinh tế.)' },
    '今にも': { meaning: 'sắp sửa... đến nơi rồi (chuẩn bị xảy ra ngay)', reading: 'いまにも', ex: '空が真っ黒になってきて、今にも激しい夕立が降り出しそうです。 (Trời tối sầm lại, trông như sắp đổ một trận mưa rào dữ dội đến nơi rồi.)' }
  },

  // ================= UNIT 44 =================
  'unit-44': {
    '泣きます': { meaning: 'khóc (nước mắt tuôn rơi)', reading: 'なきます', ex: '感動的な映画のクライマックスシーンを見て、思わず泣いてしまいました。 (Xem cảnh cao trào đầy xúc động của bộ phim, tôi đã bất giác bật khóc.)' },
    '笑います': { meaning: 'cười, mỉm cười', reading: 'わらいます', ex: 'テレビのお笑い番組を見て、家族みんなで声を出して大笑いしました。 (Xem chương trình hài trên tivi, cả nhà tôi cười vang sảng khoái.)' },
    '乾きます': { meaning: 'khô ráo (tự động từ: quần áo khô: 洗濯物が乾く)', reading: 'かわきます', ex: '天気が良くて風があったので、外に干した洗濯物がよく乾きました。 (Thời tiết đẹp và có gió nên quần áo phơi ngoài trời đã khô cong.)' },
    'ぬれます': { meaning: 'bị ướt sũng (quần áo: 服がぬれる)', reading: 'ぬれます', ex: '突然のゲリラ豪雨に降られて、傘を持っていなかったのでびしょ濡れになりました。 (Gặp cơn mưa rào bất chợt mà không mang ô nên người tôi ướt như chuột lột.)' },
    '滑ります': { meaning: 'trơn trượt (tuyết, sàn ướt)', reading: 'すべります', ex: '冬の凍った坂道は滑りやすいので、足元に十分気をつけて歩きます。 (Con dốc đóng băng mùa đông rất trơn trượt nên cần hết sức cẩn thận từng bước chân.)' },
    '起きます': { meaning: 'xảy ra (sự cố, tai nạn: 事故が起きる)', reading: 'おきます', ex: '交差点でトラックと乗用車の衝突事故が起きました。 (Tại ngã tư đã xảy ra một vụ va chạm giữa xe tải và xe con.)' },
    '細かい': { meaning: 'nhỏ li ti, tiền lẻ (細かいお金)', reading: 'こまかい', ex: '自動販売機で切符を買うために、千円札を細かい小銭に両替しました。 (Để mua vé ở máy bán tự động, tôi đã đổi tờ nghìn yên thành tiền lẻ.)' },
    '濃い': { meaning: 'đậm đặc (trà, cà phê, màu sắc)', reading: 'こい', ex: '眠気を覚ますために、濃いめのブラックコーヒーを淹れました。 (Để tỉnh ngủ, tôi đã pha một tách cà phê đen thật đậm đặc.)' },
    '薄い': { meaning: 'nhạt (vị), mỏng (áo, giấy)', reading: 'うすい', ex: '健康のために、塩分を控えた薄い味付けの料理を好んで食べています。 (Vì sức khỏe, tôi thường chuộng các món ăn nấu nhạt ít muối.)' },
    '空気': { meaning: 'không khí, bầu không khí', reading: 'くうき', ex: '都会を離れて標高の高い高原へ行くと、空気が澄んでいて清々しいです。 (Rời xa thành phố lên vùng cao nguyên, không khí trong lành thật khoan khoái.)' },
    '涙': { meaning: 'giọt nước mắt', reading: 'なみだ', ex: '卒業式で先生への感謝の手紙を読みながら、感動の涙を流しました。 (Đọc lá thư tri ân thầy cô trong lễ tốt nghiệp, tôi đã rơi những giọt nước mắt xúc động.)' },
    '和食': { meaning: 'ẩm thực truyền thống Nhật Bản (Washoku)', reading: 'わしょく', ex: 'ユネスコ無形文化遺産にも登録された和食は、素材の味が生きています。 (Ẩm thực truyền thống Nhật Bản được UNESCO công nhận luôn tôn vinh hương vị tự nhiên.)' },
    '洋食': { meaning: 'món ăn kiểu Tây phương', reading: 'ようしょく', ex: '老舗のレストランで名物のオムライスやハンバーグなどの洋食を味わいました。 (Tại nhà hàng lâu đời, tôi thưởng thức các món Tây nức tiếng như cơm cuộn trứng và thịt băm nướng.)' },
    'おかず': { meaning: 'món ăn kèm, thức ăn với cơm', reading: 'おかず', ex: 'お弁当箱に卵焼きや唐揚げなど、彩りの良いおかずを詰めました。 (Tôi xếp vào hộp cơm những món ăn kèm bắt mắt như trứng cuộn và gà chiên giòn.)' },
    '量': { meaning: 'lượng, khối lượng', reading: 'りょう', ex: 'この食堂の定食はご飯とおかずの量がとても多くて大満足です。 (Suất cơm của quán này thức ăn và cơm đầy đặn ăn no nê thỏa thích.)' }
  },

  // ================= UNIT 45 =================
  'unit-45': {
    '謝ります': { meaning: 'xin lỗi, tạ lỗi', reading: 'あやまります', ex: '不注意で約束に遅れてしまったことを、相手に誠心誠意謝りました。 (Do bất cẩn đến muộn hẹn, tôi đã chân thành xin lỗi người bạn.)' },
    'あいます（じこに～）': { meaning: 'gặp phải (tai nạn giao thông: 事故にあう)', reading: 'あいます', ex: '雪の日に危うく追突事故にあいそうになりました。 (Vào một ngày tuyết rơi, tôi suýt chút nữa gặp phải tai nạn đâm va từ phía sau.)' },
    '信じます': { meaning: 'tin tưởng, đặt niềm tin', reading: 'しんじます', ex: '努力を続ければ必ず夢は叶うと自分自身の力を信じています。 (Tôi tin vào năng lực của chính mình rằng kiên trì nỗ lực ắt sẽ thành công.)' },
    '用意します': { meaning: 'chuẩn bị sẵn sàng (đồ đạc, dụng cụ)', reading: 'よういします', ex: '明日の大事な面接に向けて、履歴書とスーツを前もって用意しました。 (Chuẩn bị cho buổi phỏng vấn quan trọng ngày mai, tôi soạn sẵn sơ yếu lý lịch và âu phục.)' },
    'キャンセルします': { meaning: 'hủy bỏ (lịch hẹn, phòng khách sạn)', reading: 'キャンセルします', ex: '急な仕事が入ってしまったので、旅行のホテル予約をキャンセルしました。 (Đột xuất có việc gấp nên tôi đã hủy đặt phòng khách sạn cho chuyến du lịch.)' },
    '保証書': { meaning: 'phiếu bảo hành sản phẩm', reading: 'ほしょうしょ', ex: '故障したときのために、購入時の領収書と製品の保証書を大切に保管しています。 (Để phòng khi hỏng hóc, tôi cất giữ cẩn thận hóa đơn mua hàng và phiếu bảo hành.)' },
    '領収書': { meaning: 'hóa đơn thanh toán, biên lai', reading: 'りょうしゅうしょ', ex: '経費精算をするために、タクシーを降りる際に領収書を受け取りました。 (Để thanh toán công tác phí, lúc xuống taxi tôi đã lấy hóa đơn biên lai.)' },
    '中止': { meaning: 'sự hoãn lại, hủy bỏ', reading: 'ちゅうし', ex: '強い台風が直撃する予報が出たため、野外コンサートは中止になりました。 (Vì có dự báo bão lớn đổ bộ trực tiếp nên buổi hòa nhạc ngoài trời đã bị hủy bỏ.)' },
    'ちゃんと': { meaning: 'chỉn chu, đàng hoàng, nghiêm túc', reading: 'ちゃんと', ex: '毎晩寝る前に、明日の持ち物をカバンの中にちゃんと確認して入れます。 (Mỗi tối trước khi ngủ, tôi đều kiểm tra chỉn chu và xếp đồ dùng ngày mai vào cặp.)' },
    '楽しみにしています': { meaning: 'rất háo hức trông chờ', reading: 'たのしみにしています', ex: '来週の週末に久しぶりに友達と再会できるのを心から楽しみにしています。 (Tôi đang rất háo hức mong chờ buổi gặp lại bạn bè vào cuối tuần sau.)' }
  },

  // ================= UNIT 46 =================
  'unit-46': {
    '焼きます': { meaning: 'nướng (thịt, cá, bánh: 魚を焼く)', reading: 'やきます', ex: '七輪の炭火で脂ののった秋刀魚を香ばしく焼きました。 (Trên bếp than hồng, tôi nướng những con cá thu đao béo ngậy thơm lừng.)' },
    '渡します': { meaning: 'trao tận tay, đưa cho (giấy tờ, quà)', reading: 'わたします', ex: '卒業式の壇上で、校長先生から一人ひとりに卒業証書が手渡されました。 (Trên bục lễ tốt nghiệp, thầy hiệu trưởng đã tận tay trao bằng cho từng học sinh.)' },
    '帰ってきます': { meaning: 'trở về (về nhà, về nước)', reading: 'かえってきます', ex: '出張で海外に行っていた父が無事に今夜帰ってきます。 (Bố tôi đi công tác nước ngoài tối nay sẽ trở về nhà an toàn.)' },
    '出ます': { meaning: 'rời khỏi (ga: バスが出る / nhà)', reading: 'でます', ex: '定刻の朝8時ちょうどに、駅前ロータリーから空港行きのリムジンバスが出ました。 (Đúng 8 giờ sáng, xe buýt sân bay đã xuất bến từ bến vòng xuyến trước ga.)' },
    '宅配便': { meaning: 'dịch vụ chuyển phát nhanh tận nhà', reading: 'たくはいびん', ex: '田舎の実家から採れたての新鮮な野菜が宅配便で届きました。 (Thùng rau tươi vừa hái ở quê nhà đã được gửi chuyển phát nhanh tới tận cửa.)' },
    '原因': { meaning: 'nguyên nhân, căn nguyên', reading: 'げんいん', ex: 'エンジニアがシステム障害の根本的な原因を徹底的に調査しています。 (Các kỹ sư đang điều tra kỹ lưỡng nguyên nhân gốc rễ của sự cố hệ thống.)' },
    '注射': { meaning: 'mũi tiêm phòng, tiêm thuốc', reading: 'ちゅうしゃ', ex: 'インフルエンザを予防するために、病院でワクチンの予防注射を受けました。 (Để phòng ngừa cúm mùa, tôi đã đến bệnh viện tiêm một mũi vắc-xin.)' },
    '食欲': { meaning: 'sự thèm ăn, cảm giác ngon miệng', reading: 'しょくよく', ex: '風邪が治って元気になったら、自然と食欲が戻ってきました。 (Sau khi khỏi cảm cúm người khỏe lại, cảm giác thèm ăn của tôi tự nhiên quay trở lại.)' },
    'パンフレット': { meaning: 'tập gấp giới thiệu, brochure', reading: 'パンフレット', ex: '旅行会社で観光地の見どころがたくさん紹介されているパンフレットをもらいました。 (Tôi lấy tập brochure giới thiệu nhiều điểm đến hấp dẫn tại công ty du lịch.)' },
    'たった今': { meaning: 'vừa mới tức thì (vừa xong tích tắc)', reading: 'たったいま', ex: 'たった今、成田空港に到着したばかりの友達から着信がありました。 (Tôi vừa nhận được cuộc gọi từ người bạn mới hạ cánh xuống sân bay Narita tức thì.)' },
    '具合': { meaning: 'thể trạng sức khỏe, tình trạng máy móc', reading: 'ぐあい', ex: '少し体の具合が悪いので、早めに帰宅して薬を飲んで寝ます。 (Thể trạng trong người hơi mệt nên tôi xin về sớm uống thuốc rồi nghỉ ngơi.)' },
    '向かいます': { meaning: 'hướng về, đi về phía (đích đến)', reading: 'むかいます', ex: '待ち合わせのカフェへ向かって、駅から足早に歩いています。 (Tôi đang rảo bước nhanh từ nhà ga hướng về quán cà phê nơi đã hẹn.)' },
    '転びます': { meaning: 'ngã nhào, vấp ngã', reading: 'ころびます', ex: '濡れた階段で足を滑らせて転びそうになり、手すりを掴みました。 (Bị trượt chân trên bậc thang ướt suýt ngã nhào, tôi vội bám lấy tay vịn.)' },
    '慌てて': { meaning: 'vội vàng, cuống cuồng', reading: 'あわてて', ex: '寝坊して遅刻しそうになったので、慌てて服を着替えて家を飛び出しました。 (Ngủ quên suýt muộn giờ, tôi cuống cuồng thay quần áo rồi lao vội ra khỏi nhà.)' }
  },

  // ================= UNIT 47 =================
  'unit-47': {
    '集まります「人が～」': { meaning: 'tụ họp, tập hợp lại (người tụ tập)', reading: 'あつまります', ex: '駅前の広場に大道芸を見ようと大勢の観客が集まりました。 (Tại bãi đất trống trước ga, rất đông khán giả đã tụ tập xem biểu diễn đường phố.)' },
    '別れます「人が」': { meaning: 'chia tay, chia ly (người chia tay)', reading: 'わかれます', ex: '成田空港の出発ゲートで、母国へ帰る留学生の友人と笑顔で別れました。 (Tại cửa khởi hành sân bay Narita, tôi mỉm cười chia tay người bạn về nước.)' },
    '長生きます': { meaning: 'sống lâu, thọ (長生きする)', reading: 'ながいきします', ex: '祖父母には栄養バランスの良い食事をとって、いつまでも長生きしてほしいです。 (Tôi mong ông bà ăn uống đủ chất và sống thật lâu thật thọ cùng con cháu.)' },
    '味がします': { meaning: 'có vị... (cảm nhận vị giác)', reading: 'あじがします', ex: 'この手作りのスープはレモンが入っていて、爽やかな酸味の味がします。 (Món súp tự nấu này có thêm chút chanh nên mang một hương vị chua thanh dịu mát.)' },
    'においがします': { meaning: 'có mùi... (mùi thơm/mùi khét)', reading: 'においがします', ex: '台所から焼きたてのクッキーの甘くて香ばしい匂いが漂ってきます。 (Từ trong bếp thoang thoảng bay ra mùi bánh quy nướng thơm lừng ngọt ngào.)' },
    '傘をさします': { meaning: 'che ô, giương ô (dưới mưa)', reading: 'かさをさします', ex: 'ポツポツと小雨が降り始めたので、カバンから折りたたみ傘を出してさしました。 (Trời bắt đầu lất phất mưa phùn nên tôi lấy chiếc ô gấp trong túi ra che.)' },
    '婚約します': { meaning: 'đính hôn, hứa hôn', reading: 'こんやくします', ex: '3年間の交際を経て、大好きな彼女と正式に婚約しました。 (Sau 3 năm hẹn hò tìm hiểu, tôi đã chính thức làm lễ đính hôn cùng bạn gái.)' },
    '知り合います': { meaning: 'quen biết nhau (lần đầu gặp gỡ)', reading: 'しりあいます', ex: '日本語学校のオリエンテーションで世界各国の留学生と知り合いました。 (Trong buổi định hướng của trường tiếng Nhật, tôi đã làm quen với nhiều bạn bè quốc tế.)' },
    '男性': { meaning: 'nam giới, phái nam', reading: 'だんせい', ex: '料理教室には女性だけでなく、男性の参加者も多く集まっています。 (Tại lớp học nấu ăn không chỉ có nữ giới mà rất nhiều nam giới cũng tham gia.)' },
    '女性': { meaning: 'nữ giới, phái nữ', reading: 'じょせい', ex: '多くの女性が社会の様々な分野でリーダーとして活躍しています。 (Rất nhiều phụ nữ đang tỏa sáng và giữ vai trò lãnh đạo ở nhiều lĩnh vực.)' },
    '比べます': { meaning: 'so sánh, đối chiếu', reading: 'くらべます', ex: '去年の売上データと今年の数字をじっくり比べて傾向を分析しました。 (Tôi đối chiếu kỹ số liệu năm ngoái với năm nay để phân tích xu hướng.)' }
  },

  // ================= UNIT 48 =================
  'unit-48': {
    '降ろします、下ろします': { meaning: 'hạ xuống, dỡ xuống (hành lý từ trên cao)', reading: 'おろします', ex: '電車の網棚から重いスーツケースを両手で慎重に下ろしました。 (Tôi dùng cả hai tay cẩn thận nhấc chiếc vali nặng trên giá để đồ xuống.)' },
    '届けます': { meaning: 'giao tới, chuyển đến (tận nhà)', reading: 'とどけます', ex: '郵便局の配達員さんが大切な書留の手紙を玄関まで届けてくれました。 (Nhân viên bưu điện đã giao tận tay lá thư bảo đảm đến cửa nhà tôi.)' },
    'いや[な]': { meaning: 'khó chịu, đáng ghét, không ưng ý', reading: 'いや「な」', ex: '嫌なことがあった日でも、温かいお風呂に入れば気分が晴れますよ。 (Dù gặp chuyện bực mình khó chịu, ngâm bồn nước ấm là tâm trạng lại sảng khoái.)' },
    '厳しい': { meaning: 'nghiêm khắc, khắt khe (kỷ luật, quy tắc)', reading: 'きびしい', ex: '柔道の先生は練習中は厳しいですが、普段はとても優しい方です。 (Thầy dạy võ Judo lúc tập luyện rất nghiêm khắc nhưng ngày thường lại rất hiền.)' },
    '塾': { meaning: 'lớp học thêm, lò luyện thi (Juku)', reading: 'じゅく', ex: '高校受験を目指して、放課後は毎日駅前の進学塾に通っています。 (Hướng tới kỳ thi vào cấp ba, mỗi chiều sau giờ học tôi đều đến lò luyện thi.)' },
    'スケジュール': { meaning: 'lịch trình, thời gian biểu', reading: 'スケジュール', ex: '来週の出張スケジュールを分単位でしっかりと組み立てました。 (Tôi đã lên lịch trình chi tiết cho chuyến công tác tuần sau rất chu đáo.)' },
    '入管': { meaning: 'Cục xuất nhập cảnh', reading: 'にゅうかん', ex: 'ビザの更新手続きをするために、朝早く品川の入管へ行きました。 (Để làm thủ tục gia hạn visa, sáng sớm tôi đã có mặt tại Cục xuất nhập cảnh ở Shinagawa.)' }
  },

  // ================= UNIT 49 =================
  'unit-49': {
    '勤め増す「会社に～」': { meaning: 'công tác, làm việc tại (勤める)', reading: 'つとめます', ex: '父は長年にわたり日本の大手自動車メーカーに勤めていました。 (Bố tôi đã công tác cống hiến nhiều năm tại tập đoàn ô tô lớn của Nhật.)' },
    '過ごします': { meaning: 'trải qua, sinh hoạt (kỳ nghỉ, thời gian)', reading: 'すごします', ex: '年末年始の休暇は実家で家族とこたつに入ってのんびり過ごしました。 (Kỳ nghỉ Tết tôi về quê sưởi bàn Kotatsu thảnh thơi cùng gia đình.)' },
    '寄ります「銀行に～」': { meaning: 'ghé qua, tạt vào (ngân hàng, cửa hàng tiện lợi)', reading: 'よります', ex: '会社からの帰り道に銀行に寄って、家賃を口座に振り込みました。 (Trên đường đi làm về tôi ghé vào ngân hàng để chuyển khoản tiền thuê nhà.)' },
    'いらっしゃいます': { meaning: 'ở, đi, đến (tôn kính ngữ của いる, 行く, 来る)', reading: 'いらっしゃいます', ex: '社長はただいま社長室にいらっしゃいますので、ご案内いたします。 (Giám đốc hiện đang có mặt trong phòng làm việc, tôi xin phép dẫn đường ạ.)' },
    '召し上がります': { meaning: 'dùng bữa, ăn, uống (tôn kính ngữ của 食べる, 飲む)', reading: 'めしあがります', ex: '温かいうちに、どうぞお菓子を召し上がってください。 (Xin kính mời quý khách dùng chút bánh ngọt trong lúc bánh còn ấm ạ.)' },
    'おっしゃいます': { meaning: 'nói, phát biểu (tôn kính ngữ của 言う)', reading: 'おっしゃいます', ex: '先生がおっしゃったアドバイスを心に留めて努力を続けます。 (Tôi luôn ghi khắc trong tim lời khuyên quý báu mà thầy đã căn dặn.)' },
    'なさいます': { meaning: 'làm, thực hiện (tôn kính ngữ của する)', reading: 'なさいます', ex: '週末はゴルフをなさると部長から伺いました。 (Tôi được nghe nói cuối tuần này trưởng phòng sẽ đi chơi golf ạ.)' },
    'ご覧になります': { meaning: 'nhìn, xem (tôn kính ngữ của 見る)', reading: 'ごらんになります', ex: '壁に掲示された新しい案内資料をどうぞご覧になってください。 (Kính mời quý vị cùng xem bản tài liệu hướng dẫn mới được dán trên tường.)' },
    'ご存じです': { meaning: 'biết, nắm rõ (tôn kính ngữ của 知っている)', reading: 'ごぞんじです', ex: '山田先生のご連絡先をご存じでしょうか。 (Dạ anh/chị có biết thông tin liên lạc của thầy Yamada không ạ?)' },
    '挨拶': { meaning: 'lời chào hỏi, sự chào hỏi', reading: 'あいさつ', ex: '毎朝明るい声で「おはようございます」と挨拶を交わします。 (Mỗi sáng tôi đều cất giọng tươi vui cất lời chào "Chào buổi sáng" với mọi người.)' },
    '遠慮なく': { meaning: 'không khách sáo, cứ tự nhiên', reading: 'えんりょなく', ex: '喉が渇いたら、どうぞ遠慮なくお茶をおかわりしてくださいね。 (Nếu khát nước bạn cứ tự nhiên lấy thêm trà, đừng ngại ngùng gì nhé.)' }
  },

  // ================= UNIT 50 =================
  'unit-50': {
    '参ります': { meaning: 'đi, đến (khiêm nhường ngữ của 行く, 来る)', reading: 'まいります', ex: 'ただいまから明日の会議の資料をお届けに参ります。 (Ngay bây giờ tôi xin phép mang tài liệu cuộc họp ngày mai sang trình bày ạ.)' },
    'おります': { meaning: 'ở (khiêm nhường ngữ của いる)', reading: 'おります', ex: '私は東京の新宿にある小さなアパートに住んでおります。 (Tôi hiện đang sinh sống tại một căn hộ nhỏ ở Shinjuku, Tokyo.)' },
    '申します': { meaning: 'tên là, nói là (khiêm nhường ngữ của 言う)', reading: 'もうします', ex: '初めまして、ベトナムのハノイから参りましたグエンと申します。 (Kính chào anh/chị, tôi tên là Nguyễn, đến từ Hà Nội, Việt Nam ạ.)' },
    'いたします': { meaning: 'làm, thực hiện (khiêm nhường ngữ của する)', reading: 'いたします', ex: 'お荷物は私がお部屋までお運びいたします。 (Hành lý của quý khách xin phép để tôi mang lên tận phòng giúp ạ.)' },
    '拝見します': { meaning: 'xem, nhìn (khiêm nhường ngữ của 見る)', reading: 'はいけんします', ex: '送っていただいた素晴らしい企画書をじっくり拝見いたしました。 (Tôi đã được xem rất kỹ bản đề án tuyệt vời mà quý công ty gửi sang ạ.)' },
    '存じます': { meaning: 'nghĩ là, biết là (khiêm nhường ngữ của 思う, 知る)', reading: 'ぞんじます', ex: '皆様のご多幸を心よりお祈り申し上げて存じます。 (Tôi xin thành tâm cầu chúc mọi điều tốt lành, may mắn nhất đến với quý vị.)' },
    '伺います': { meaning: 'hỏi, nghe, ghé thăm (khiêm nhường ngữ)', reading: 'うかがいます', ex: '明日の午後2時に貴社のオフィスへお伺いしてもよろしいでしょうか。 (Khoảng 2 giờ chiều mai tôi xin phép ghé qua văn phòng quý công ty có được không ạ?)' },
    'お目にかかります': { meaning: 'gặp mặt (khiêm nhường ngữ của 会う)', reading: 'おめにかかります', ex: '本日は先生にお目にかかることができて、大変光栄でございます。 (Hôm nay được diện kiến thầy, em cảm thấy vô cùng vinh dự ạ.)' },
    '淹れます': { meaning: 'pha (trà, cà phê: お茶/コーヒーを淹れる)', reading: 'いれます', ex: 'お客様のために、香りの良い宇治茶を心を込めて淹れました。 (Tôi đã thành tâm pha một ấm trà Uji thơm ngát để chiêu đãi khách quý.)' },
    '緊張します': { meaning: 'hồi hộp, căng thẳng (tâm lý)', reading: 'きんちょうします', ex: '大勢の人の前でスピーチをするのは、とても緊張するものです。 (Đứng phát biểu trước đông người quả thực là một điều rất hồi hộp.)' },
    '感謝します': { meaning: 'biết ơn, cảm tạ', reading: 'かんしゃします', ex: '困っていたときに温かく支えてくれた恩師に心から感謝しています。 (Tôi xin chân thành cảm tạ người thầy kính yêu đã luôn ấm áp nâng đỡ lúc khó khăn.)' },
    '迷惑': { meaning: 'sự phiền hà, làm phiền', reading: 'めいわく', ex: '夜間に大音量で音楽を流すと、近所迷惑になりますよ。 (Bật nhạc lớn lúc nửa đêm sẽ làm phiền tới hàng xóm xung quanh đấy.)' }
  }
};

function runBatch4() {
  console.log('='.repeat(70));
  console.log('TIẾN HÀNH CHUẨN HÓA MINNA N4 BATCH 4 (BÀI 41 ĐẾN BÀI 50)');
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

  console.log(`\nHoàn tất Batch 4. Tổng số từ vựng cập nhật: ${totalUpdated}`);
}

runBatch4();

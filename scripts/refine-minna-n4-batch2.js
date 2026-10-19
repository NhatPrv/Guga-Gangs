/**
 * scripts/refine-minna-n4-batch2.js
 * Chuẩn hóa chuyên sâu 100% từ vựng Minna no Nihongo N4 (Bài 33 đến Bài 40):
 * - Triệt tiêu toàn bộ template lặp lại.
 * - Mỗi từ đi với Collocation và câu ví dụ tự nhiên chuẩn bản xứ.
 * - Bản dịch tiếng Việt mượt mà, đúng ngữ cảnh thực tế.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data', 'minna-no-nihongo-n4');

const UNIT_DICTIONARY = {
  // ================= UNIT 33 =================
  'unit-33': {
    '逃げます': { meaning: 'chạy trốn, tẩu thoát', reading: 'にげます', ex: '火災警報器が鳴ったので、非常口から外へ逃げました。 (Chuông báo cháy vang lên nên tôi đã chạy thoát ra ngoài bằng cửa thoát hiểm.)' },
    '騒ぎます': { meaning: 'làm ồn ào, hò hét gây mất trật tự', reading: 'さわぎます', ex: '夜遅くにアパートの廊下で大声で騒いではいけません。 (Không được hò hét làm ồn lớn tiếng ở hành lang chung cư vào đêm muộn.)' },
    'あきらめます': { meaning: 'từ bỏ, bỏ cuộc', reading: 'あきらめます', ex: '途中でどんなに苦しくても、最後まで夢をあきらめません。 (Dù trên đường đi có gian nan đến mấy, tôi cũng không bao giờ từ bỏ ước mơ.)' },
    '投げま': { meaning: 'ném (bóng, đồ vật)', reading: 'なげます', ex: 'ピッチャーがキャッチャーに向かって力強くボールを投げました。 (Cầu thủ ném bóng đã ném thật mạnh quả bóng về phía người bắt bóng.)' },
    '守ります': { meaning: 'bảo vệ, tuân thủ (lời hứa, luật lệ)', reading: 'まもります', ex: '社会で信頼されるためには、約束の時間を守ることが大切です。 (Để được tin tưởng trong xã hội, việc giữ đúng hẹn là vô cùng quan trọng.)' },
    '上げます': { meaning: 'nâng lên, giơ lên (tay, cờ, giá)', reading: 'あげます', ex: '質問がある方は、静かに右手を上げてください。 (Ai có câu hỏi xin vui lòng giơ tay phải lên một cách trật tự ạ.)' },
    '下げます': { meaning: 'hạ xuống, cúi xuống (đầu, giá)', reading: 'さげます', ex: '丁寧にお辞儀をして、深々と頭を下げました。 (Tôi cúi chào lịch sự và gập đầu thật sâu để cảm ơn.)' },
    '伝えます': { meaning: 'truyền đạt, nhắn lại (thông tin, lời nhắn)', reading: 'つたえます', ex: '部長が戻られたら、折り返し電話するようにお伝えいただけますか。 (Khi trưởng phòng quay lại, nhờ anh nhắn lại giúp tôi gọi điện lại nhé.)' },
    '注意します': { meaning: 'nhắc nhở, chú ý cẩn thận', reading: 'ちゅういします', ex: '交差点を渡るときは、左右の安全をよく注意してください。 (Khi băng qua ngã tư, xin hãy chú ý cẩn thận quan sát hai bên đường.)' },
    '外します': { meaning: 'rời khỏi (chỗ ngồi: 席を外す)', reading: 'はずします', ex: '担当の田中はあいにく今、席を外しております。 (Người phụ trách anh Tanaka tiếc là hiện tại đang rời khỏi chỗ ngồi một lát ạ.)' },
    'だめ': { meaning: 'không được, vô ích, hỏng', reading: 'だめ「な」', ex: 'テスト中に隣の人の答えを見てはいけません、だめですよ。 (Trong giờ thi không được nhìn bài người bên cạnh, không được đâu đấy nhé.)' },
    '席': { meaning: 'chỗ ngồi, ghế ngồi', reading: 'せき', ex: '電車でお年寄りに笑顔で席を譲りました。 (Tôi đã mỉm cười nhường chỗ ngồi trên tàu điện cho người cao tuổi.)' },
    'マーク': { meaning: 'ký hiệu, biểu tượng', reading: 'マーク', ex: '非常口のマークを目印にして避難訓練を行いました。 (Chúng tôi thực hành diễn tập sơ tán bằng cách lấy biểu tượng cửa thoát hiểm làm mốc.)' },
    'ボール': { meaning: 'quả bóng, trái banh', reading: 'ボール', ex: '庭で子供たちが楽しそうにサッカーボールを蹴っています。 (Ngoài sân các em nhỏ đang đá quả bóng vui vẻ cùng nhau.)' },
    '洗濯機': { meaning: 'máy giặt', reading: 'せんたくき', ex: '汚れた服を洗濯機に入れてスイッチを押しました。 (Tôi bỏ quần áo bẩn vào máy giặt rồi nhấn nút khởi động.)' },
    '規則': { meaning: 'quy tắc, quy định, luật lệ', reading: 'きそく', ex: '寮の共同生活では、決められた規則を守らなければなりません。 (Trong đời sống chung tại ký túc xá, ta phải tuân thủ nghiêm quy định đã đề ra.)' },
    '使用禁止': { meaning: 'cấm sử dụng', reading: 'しようきんし', ex: '故障中のエレベーターの前に「使用禁止」の貼り紙があります。 (Trước chiếc thang máy đang bị hỏng có dán tấm biển "Cấm sử dụng".)' },
    '立ち入り禁止': { meaning: 'cấm vào, không phận sự miễn vào', reading: 'たちいりきんし', ex: '工事現場の入り口に「立ち入り禁止」の看板が立てられています。 (Tại lối vào công trường có dựng tấm biển "Cấm vào".)' },
    '非常口': { meaning: 'cửa thoát hiểm', reading: 'ひじょうぐち', ex: '映画館に入ったら、まず非常口の場所を確認しておきましょう。 (Khi vào rạp chiếu phim, trước tiên hãy xác định vị trí cửa thoát hiểm nhé.)' },
    '本日休業': { meaning: 'hôm nay đóng cửa, tạm nghỉ', reading: 'ほんじつきゅうぎょう', ex: '楽しみにしていたカフェのドアに「本日休業」と書いてありました。 (Cánh cửa quán cà phê tôi mong chờ đến có ghi dòng chữ "Hôm nay tạm nghỉ".)' },
    '営業中': { meaning: 'đang mở cửa kinh doanh', reading: 'えいぎょうちゅう', ex: 'お店の看板が「営業中」になっていたので中に入りました。 (Tấm biển ngoài quán ghi "Đang mở cửa" nên tôi đã bước vào trong.)' },
    '使用中': { meaning: 'đang sử dụng', reading: 'しようちゅう', ex: 'お手洗いのドアが「使用中」になっていたので少し待ちました。 (Cửa phòng vệ sinh hiện "Đang có người dùng" nên tôi đợi một chút.)' },
    '駐車違反': { meaning: 'vi phạm đỗ xe trái phép', reading: 'ちゅうしゃいはん', ex: '駐停車禁止の場所に車を止めて、駐車違反の切符を切られました。 (Đỗ xe ở nơi cấm dừng đỗ nên tôi đã bị công an phạt vi phạm đỗ xe.)' },
    '警察': { meaning: 'cảnh sát, cơ quan công an', reading: 'けいさつ', ex: '道に迷って困っていたら、親切な警察官が道を教えてくれました。 (Lúc lạc đường bối rối, một chú cảnh sát tốt bụng đã chỉ đường cho tôi.)' },
    '罰金': { meaning: 'tiền phạt', reading: 'ばっきん', ex: '交通ルールを破って高額な罰金を払うことになりました。 (Vì vi phạm luật giao thông nên tôi đã phải nộp một khoản tiền phạt khá lớn.)' },
    '電報': { meaning: 'bức điện tín, điện báo', reading: 'でんぽう', ex: '祖母の米寿の祝いに、親戚一同でお祝いの電報を送りました。 (Nhân dịp mừng thọ 88 tuổi của bà, cả họ đã gửi một bức điện tín chúc mừng.)' },
    '人々': { meaning: 'mọi người, người dân', reading: 'ひとびと', ex: 'お祭りの広場には、笑顔にあふれた多くの人々が集まっています。 (Tại quảng trường lễ hội, rất đông người dân rạng rỡ tiếng cười tụ họp về.)' },
    '急用': { meaning: 'việc gấp, việc khẩn cấp', reading: 'きゅうよう', ex: '急用ができたので、申し訳ありませんが先に失礼します。 (Vì có việc khẩn cấp đột xuất, xin thứ lỗi cho tôi xin phép về trước ạ.)' },
    '打ちます': { meaning: 'đánh (máy tính, gửi điện tín: 打つ)', reading: 'うちます', ex: 'パソコンのキーボードで素早くメールの返信を打ちました。 (Tôi gõ phím máy tính thật nhanh để gửi thư hồi đáp.)' },
    'できるだけ': { meaning: 'hết sức có thể, trong khả năng tối đa', reading: 'できるだけ', ex: '健康のために、毎食できるだけ野菜を多く摂るようにしています。 (Vì sức khỏe, trong mỗi bữa ăn tôi cố gắng ăn nhiều rau nhất có thể.)' },
    '短く': { meaning: 'ngắn gọn, súc tích', reading: 'みじかく', ex: 'スピーチは聞く人が飽きないように、短くまとめました。 (Để người nghe không thấy chán, tôi đã tóm tắt bài phát biểu thật ngắn gọn.)' },
    '危篤': { meaning: 'nguy kịch (tình trạng bệnh nặng sắp mất)', reading: 'きとく', ex: '故郷の祖父が危篤だという連絡を受け、急いで病院へ駆けつけました。 (Nhận được tin báo ông ở quê đang nguy kịch, tôi tức tốc bắt xe về bệnh viện.)' },
    '重い病気': { meaning: 'căn bệnh hiểm nghèo, bệnh nặng', reading: 'おもいびょうき', ex: '彼は重い病気と闘いながらも、前向きに毎日を生きています。 (Dù đang kiên cường chống chọi với bệnh nặng, anh ấy vẫn sống lạc quan mỗi ngày.)' },
    '留守': { meaning: 'sự vắng nhà, đi vắng', reading: 'るす', ex: '留守の間に友達が遊びに来てくれたようです。 (Trong lúc tôi vắng nhà, dường như có người bạn đã ghé qua chơi.)' },
    '留守番': { meaning: 'việc trông coi nhà khi người lớn vắng mặt', reading: 'るすばん', ex: '両親が買い物に出かけている間、一人でしっかり留守番をしました。 (Trong lúc bố mẹ đi mua sắm, tôi ở nhà trông nhà rất cẩn thận.)' },
    'お祝い': { meaning: 'lời chúc mừng, món quà mừng', reading: 'おいわい', ex: '友達の結婚のお祝いに素敵なペアグラスをプレゼントしました。 (Tôi tặng một cặp ly tuyệt đẹp làm quà mừng đám cưới cho bạn.)' },
    'なくなります': { meaning: 'qua đời, mất đi (mất người thân)', reading: 'なくなります', ex: '長年地域のために尽くした優しい名誉教授が亡くなりました。 (Vị giáo sư đáng kính cống hiến trọn đời cho cộng đồng đã qua đời.)' },
    '悲しい': { meaning: 'buồn bã, đau lòng', reading: 'かなしい', ex: '大切にしていたペットの小鳥が死んでしまい、とても悲しいです。 (Chú chim cưng nuôi bao lâu bị chết khiến tôi vô cùng đau lòng.)' },
    '利用します': { meaning: 'tận dụng, sử dụng (tiện ích, dịch vụ)', reading: 'りようします', ex: '時間を有効に利用して、通勤電車の中で英単語を覚えています。 (Tận dụng thời gian hiệu quả, tôi học từ vựng tiếng Anh ngay trên tàu điện.)' }
  },

  // ================= UNIT 34 =================
  'unit-34': {
    '磨きます': { meaning: 'đánh (răng: 歯を磨く), đánh bóng', reading: 'みがきます', ex: '毎食後に虫歯を予防するために丁寧に歯を磨きます。 (Sau mỗi bữa ăn tôi đều đánh răng cẩn thận để phòng ngừa sâu răng.)' },
    '組み立てます': { meaning: 'lắp ráp, ghép lại (nội thất, máy móc)', reading: 'くみたてます', ex: '説明書を見ながら、新しく買った本棚を自分で組み立てました。 (Vừa nhìn sách hướng dẫn, tôi vừa tự tay lắp ráp chiếc kệ sách mới mua.)' },
    '折ります': { meaning: 'gấp (giấy origami), bẻ gập', reading: 'おります', ex: '色紙を使って、日本の伝統的な折り紙で鶴を折りました。 (Dùng giấy màu, tôi gấp một con hạc bằng nghệ thuật xếp giấy truyền thống Nhật.)' },
    '見つかります': { meaning: 'được tìm thấy (tự động từ: đồ thất lạc)', reading: 'みつかります', ex: '交番に届けを出していた落とし物の財布が無事に見つかりました。 (Chiếc ví đánh rơi báo ở bốt cảnh sát đã được tìm thấy an toàn.)' },
    'します（ネクタイを）': { meaning: 'thắt cà vạt (ネクタイをする)', reading: 'します', ex: '大事な商談に行くので、紺色の落ち着いたネクタイをしました。 (Đi gặp đối tác quan trọng nên tôi đã thắt chiếc cà vạt màu xanh tím than trang nhã.)' },
    '質問します': { meaning: 'đặt câu hỏi, thắc mắc', reading: 'しつもんします', ex: '分からない文法があったので、授業の後に先生に質問しました。 (Vì có mẫu ngữ pháp chưa hiểu nên sau giờ học tôi đã hỏi lại thầy giáo.)' },
    'スポーツクラブ': { meaning: 'câu lạc bộ thể thao, phòng gym', reading: 'スポーツクラブ', ex: '運動不足を解消するために、仕事帰りにスポーツクラブに通っています。 (Để bớt lười vận động, tôi ghé phòng tập thể thao sau giờ làm việc.)' },
    '家具': { meaning: 'đồ nội thất gia đình', reading: 'かぐ', ex: '新しいアパートに合わせて、シンプルで温かみのある木製家具を揃えました。 (Phù hợp với căn hộ mới, tôi sắm sửa đồ nội thất gỗ giản dị ấm cúng.)' },
    'キー': { meaning: 'chìa khóa xe, phím bấm', reading: 'キー', ex: '車のキーを回すと、静かにハイブリッドエンジンが始動しました。 (Vặn chìa khóa xe, động cơ hybrid khởi động một cách êm ái.)' },
    'シートべルト': { meaning: 'dây an toàn trên xe', reading: 'シートベルト', ex: '車に乗ったら、発車する前に必ずシートベルトを締めてください。 (Khi lên xe, trước khi xe lăn bánh nhất định hãy thắt dây an toàn nhé.)' },
    '説明書': { meaning: 'bản hướng dẫn sử dụng', reading: 'せつめいしょ', ex: '電子レンジを使う前に、付属の取扱説明書をよく読みました。 (Trước khi dùng lò vi sóng, tôi đã đọc kỹ bản hướng dẫn sử dụng đi kèm.)' },
    '図': { meaning: 'hình vẽ, sơ đồ', reading: 'ず', ex: '説明書に分かりやすい図が載っているので、組み立てが簡単でした。 (Trong sách hướng dẫn có sơ đồ minh họa dễ hiểu nên việc lắp ráp rất dễ.)' },
    '線': { meaning: 'đường kẻ, tuyến đường', reading: 'せん', ex: '定規を使ってノートに真っ直ぐな赤ペンで線を引きました。 (Tôi dùng thước kẻ để kẻ một đường thẳng bằng bút đỏ vào cuốn vở.)' },
    '矢印': { meaning: 'mũi tên chỉ hướng', reading: 'やじるし', ex: '駅の案内板の黄色い矢印に従って進むと改札口に着きました。 (Đi theo mũi tên màu vàng trên biển chỉ dẫn nhà ga là tới cổng soát vé.)' },
    '紺': { meaning: 'màu xanh tím than, xanh lam sẫm', reading: 'こん', ex: '面接のために紺色の落ち着いたスーツを新調しました。 (Tôi đã may một bộ vest màu xanh tím than lịch lãm để đi phỏng vấn.)' },
    'ソース': { meaning: 'nước sốt (nước chấm)', reading: 'ソース', ex: '揚げたてのとんかつに特製ソースをたっぷりかけて食べました。 (Tôi rưới thật nhiều nước sốt đặc biệt lên miếng thịt chiên xù nóng hổi rồi thưởng thức.)' },
    'ゆうべ': { meaning: 'tối qua, đêm qua', reading: 'ゆうべ', ex: 'ゆうべは久しぶりに学生時代の懐かしい友達と長電話をしました。 (Tối qua tôi đã có cuộc nói chuyện điện thoại thật lâu với bạn thân thời đi học.)' },
    'さっき': { meaning: 'vừa nãy, lúc nãy', reading: 'さっき', ex: 'さっき駅の改札口で偶然高校の先輩に会いました。 (Vừa nãy tôi tình cờ gặp lại đàn anh cấp ba ở cổng soát vé nhà ga.)' },
    '茶道': { meaning: 'trà đạo Nhật Bản', reading: 'さどう', ex: '日本の伝統的な礼儀作法を学ぶために、週末に茶道を習っています。 (Để học quy tắc lễ nghi truyền thống Nhật, tôi học trà đạo vào cuối tuần.)' },
    'お茶をたてます': { meaning: 'pha trà, đánh trà matcha', reading: 'おちゃをたてます', ex: '茶筅を使って心を込めて美味しい抹茶のお茶をたてました。 (Tôi dùng chổi đót đánh trà chuyên dụng để pha một chén trà matcha thơm ngon.)' },
    '載せます': { meaning: 'đặt lên, chở lên (xe, giá)', reading: 'のせます', ex: 'お皿の上に焼き立てのパンと目玉焼きをきれいに載せました。 (Tôi bày bánh mì mới nướng và trứng ốp la ngay ngắn lên đĩa.)' },
    'これでいいですか': { meaning: 'như thế này đã được chưa ạ?', reading: 'これでいいですか', ex: '書類の書き方はこれでいいですか。ご確認をお願いします。 (Cách viết giấy tờ như thế này đã chuẩn chưa ạ? Nhờ anh xem lại giúp.)' },
    '苦い': { meaning: 'đắng (vị đắng)', reading: 'にがい', ex: 'この漢方薬はとても苦いですが、体にはよく効きます。 (Thang thuốc bắc này tuy rất đắng nhưng lại có công hiệu chữa bệnh rất tốt.)' },
    '親子どんぶり': { meaning: 'cơm gà xào trứng Oyakodon', reading: 'おやこどんぶり', ex: 'お昼休みに学食で温かくて美味しい親子どんぶりを食べました。 (Vào giờ nghỉ trưa, tôi ăn bát cơm gà xào trứng nóng hổi thơm ngon ở căng tin.)' },
    '材料': { meaning: 'nguyên liệu nấu ăn, vật liệu', reading: 'ざいりょう', ex: 'カレーを作るために、スーパーで新鮮な材料を買い揃えました。 (Để nấu món cà ri, tôi đã ra siêu thị mua đầy đủ các nguyên liệu tươi ngon.)' },
    '調味料': { meaning: 'gia vị nêm nếm', reading: 'ちょうみりょう', ex: '料理の味を引き立てるために、適切な調味料を使います。 (Để món ăn dậy vị đậm đà, ta cần nêm các gia vị thích hợp.)' },
    'なべ': { meaning: 'nồi nấu, món lẩu', reading: 'なべ', ex: '寒い冬の夜には、家族みんなで温かい寄せ鍋を囲みます。 (Vào đêm đông lạnh giá, cả nhà cùng quây quần bên nồi lẩu nóng ấm.)' },
    '火': { meaning: 'ngọn lửa', reading: 'ひ', ex: '料理をするときは、火の取り扱いに十分注意してください。 (Khi nấu ăn, bạn hãy hết sức cẩn thận với lửa nhé.)' },
    '火にかけます': { meaning: 'bắc lên bếp đun', reading: 'ひにかけます', ex: '具材を入れたなべを火にかけて、中火でじっくり煮込みます。 (Tôi bắc chiếc nồi có nguyên liệu lên bếp và đun nhỏ lửa cho chín nhừ.)' },
    '煮ます': { meaning: 'nấu, kho, hầm (thực phẩm)', reading: 'にます', ex: '大根と豚肉をしょうゆとみりんで柔らかく煮ました。 (Tôi kho củ cải và thịt heo cùng nước tương và rượu mirin cho thật mềm.)' },
    '煮えます': { meaning: 'chín nhừ, sôi chín (tự động từ)', reading: 'にえます', ex: 'スープの野菜が柔らかく煮えたので、火を止めました。 (Rau củ trong súp đã chín nhừ mềm mại nên tôi tắt bếp.)' },
    'どんぶり': { meaning: 'cái tô lớn, bát tô', reading: 'どんぶり', ex: '大きなどんぶりに熱々のラーメンを盛り付けました。 (Tôi múc món mì ramen nóng hổi vào chiếc bát tô lớn.)' }
  },

  // ================= UNIT 35 =================
  'unit-35': {
    '咲きます': { meaning: 'nở hoa (tự động từ: hoa nở)', reading: 'さきます', ex: '春の暖かな日差しを浴びて、庭の桜が見事に咲きました。 (Đón ánh nắng xuân ấm áp, hoa anh đào trong vườn đã nở rộ tuyệt đẹp.)' },
    '変わります': { meaning: 'thay đổi, biến đổi (tự động từ)', reading: 'かわります', ex: '季節が変わると、周りの木々の葉の色も美しく変化します。 (Khi giao mùa, màu lá của cây cối xung quanh cũng thay đổi đẹp đẽ.)' },
    '拾います': { meaning: 'nhặt lên, lượm lặt', reading: 'ひろいます', ex: '海岸を散歩しながら、きれいな貝殻をいくつも拾いました。 (Vừa đi dạo dọc bờ biển, tôi vừa nhặt được mấy vỏ sò xinh xắn.)' },
    '楽（な）': { meaning: 'nhàn nhã, thoải mái, dễ chịu', reading: 'らく「な」', ex: '最新の家電製品を導入したおかげで、毎日の家事がとても楽になりました。 (Nhờ có các thiết bị gia dụng hiện đại, việc nhà mỗi ngày trở nên nhàn hơn rất nhiều.)' },
    '正しい': { meaning: 'chính xác, đúng đắn', reading: 'ただしい', ex: '辞書で単語の正しい発音とアクセントを確認しました。 (Tôi tra từ điển để kiểm tra cách phát âm và trọng âm chính xác của từ.)' },
    '珍しい': { meaning: 'hiếm có, quý hiếm, độc đáo', reading: 'めずらしい', ex: '植物園で熱帯地方にしか生息しない珍しい花を見ました。 (Tại vườn thực vật tôi đã ngắm một loài hoa quý hiếm chỉ có ở xứ nhiệt đới.)' },
    '島': { meaning: 'hòn đảo', reading: 'しま', ex: 'フェリーに乗って青い海に浮かぶ美しい離島へ渡りました。 (Tôi lên phà đi ra một hòn đảo xinh đẹp nằm giữa biển xanh.)' },
    '港': { meaning: 'bến cảng, hải cảng', reading: 'みなと', ex: '夕暮れ時の港にはたくさんの漁船が静かに停泊しています。 (Lúc hoàng hôn buông xuống, rất nhiều tàu cá đậu bình yên trong bến cảng.)' },
    '近所': { meaning: 'hàng xóm, khu vực lân cận', reading: 'きんじょ', ex: '引っ越してきた初日に、近所のお宅へ挨拶回りをしました。 (Vào ngày đầu tiên chuyển tới, tôi đã đi chào hỏi các nhà hàng xóm xung quanh.)' },
    '屋上': { meaning: 'sân thượng (tòa nhà)', reading: 'おくじょう', ex: 'ビルの屋上から見下ろす夜景は星空のように輝いています。 (Cảnh đêm nhìn từ sân thượng tòa nhà rực rỡ sáng như bầu trời đầy sao.)' },
    '海外': { meaning: 'nước ngoài, hải ngoại', reading: 'かいがい', ex: '夏休みに海外旅行へ行き、異文化の魅力を体験しました。 (Kỳ nghỉ hè tôi đi du lịch nước ngoài và trải nghiệm nét đẹp của nền văn hóa mới.)' },
    '山登り': { meaning: 'việc leo núi, môn leo núi', reading: 'やまのぼり', ex: '秋の連休に友達と一緒に山登りに出かけました。 (Vào kỳ nghỉ thu, tôi cùng bạn bè đi leo núi dã ngoại.)' },
    'ハイキング': { meaning: 'chuyến dã ngoại, đi bộ leo đồi', reading: 'ハイキング', ex: 'お弁当を持って爽やかな高原へハイキングに行きました。 (Chúng tôi mang theo cơm hộp và đi dã ngoại trên cao nguyên mát lành.)' },
    '機会': { meaning: 'cơ hội, dịp thuận lợi', reading: 'きかい', ex: '日本で働く貴重な機会を無駄にしないよう努力します。 (Tôi sẽ nỗ lực để không lãng phí cơ hội quý báu được làm việc tại Nhật Bản.)' },
    '許可': { meaning: 'sự cho phép, cấp phép', reading: 'きょか', ex: '留学生がアルバイトをするには資格外活動の許可が必要です。 (Du học sinh muốn làm thêm cần phải có giấy phép hoạt động ngoài tư cách lưu trú.)' },
    '丸': { meaning: 'vòng tròn, hình tròn', reading: 'まる', ex: '正解の番号のところに赤ペンできれいに丸をつけました。 (Tôi khoanh một vòng tròn đỏ ngay ngắn vào số đáp án đúng.)' },
    '操作': { meaning: 'thao tác, điều khiển máy móc', reading: 'そうさ', ex: 'タッチパネルの簡単な操作で誰でもチケットが買えます。 (Bằng thao tác đơn giản trên màn hình cảm ứng, ai cũng có thể mua được vé.)' },
    '方法': { meaning: 'phương pháp, cách thức', reading: 'ほうほう', ex: '効率よく日本語を上達させるための良い方法を探しています。 (Tôi đang tìm kiếm phương pháp hiệu quả để nâng cao trình độ tiếng Nhật.)' },
    '設備': { meaning: 'trang thiết bị, cơ sở vật chất', reading: 'せつび', ex: 'この新しいマンションは最新の防犯設備が整っています。 (Khu căn hộ mới này được trang bị hệ thống thiết bị an ninh tân tiến nhất.)' },
    'カ－テン': { meaning: 'tấm rèm cửa sổ', reading: 'カーテン', ex: '朝起きて部屋のカーテンを開けると、明るい光が差し込みました。 (Sáng dậy mở rèm cửa sổ, ánh nắng chan hòa rọi khắp căn phòng.)' },
    'ひも': { meaning: 'sợi dây buộc', reading: 'ひも', ex: '古新聞を束ねて、ビニールひもで固く縛りました。 (Tôi gom báo cũ lại rồi dùng dây nilon buộc thật chặt.)' },
    'ふた': { meaning: 'cái nắp (nồi, hộp, chai)', reading: 'ふた', ex: 'スープが冷めないように、なべのふたをしっかり閉めておきます。 (Để súp không bị nguội, tôi đậy chặt nắp nồi lại.)' },
    '葉': { meaning: 'lá cây', reading: 'は', ex: '秋になると庭の木々の葉が黄色や赤に色づきます。 (Mùa thu sang, lá cây trong vườn chuyển sang sắc vàng và đỏ rực rỡ.)' },
    '曲': { meaning: 'bản nhạc, khúc ca', reading: 'きょく', ex: 'ピアノで静かで優しいメロディーのクラシック曲を弾きました。 (Tôi chơi một bản nhạc cổ điển có giai điệu êm dịu trên cây đàn piano.)' },
    '楽しみ': { meaning: 'niềm vui, sự trông đợi', reading: 'たのしみ', ex: '来週末に家族と久しぶりに会えるのが今からとても楽しみです。 (Được gặp lại gia đình vào cuối tuần tới là điều tôi đang rất háo hức chờ đợi.)' },
    '初めに': { meaning: 'trước tiên, lúc đầu', reading: 'はじめに', ex: '初めに自己紹介をしてから、本日の研究発表を始めます。 (Trước tiên tôi xin tự giới thiệu, sau đó sẽ bắt đầu bài thuyết trình nghiên cứu.)' },
    'これで終わります': { meaning: 'đến đây là kết thúc', reading: 'これでおわります', ex: 'ご清聴ありがとうございました。これで発表を終わります。 (Xin cảm ơn quý vị đã lắng nghe. Bài báo cáo của tôi đến đây là kết thúc.)' },
    'それなら': { meaning: 'nếu vậy thì, thế thì', reading: 'それなら', ex: '「雨が降ってきました」「それなら、私の傘をお貸しします」 (Trời đổ mưa rồi. - Nếu vậy thì tôi cho bạn mượn ô nhé.)' },
    '夜行バス': { meaning: 'xe buýt chạy đêm', reading: 'やこうバス', ex: '交通費を節約するために、東京から京都まで夜行バスを利用しました。 (Để tiết kiệm chi phí đi lại, tôi đi xe buýt đêm từ Tokyo đến Kyoto.)' },
    '旅行社': { meaning: 'công ty du lịch, hãng lữ hành', reading: 'りょこうしゃ', ex: '駅前の旅行社で夏休みの沖縄ツアーを予約しました。 (Tôi đặt tour du lịch Okinawa kỳ nghỉ hè tại công ty du lịch trước ga.)' },
    '詳しい': { meaning: 'tường tận, chi tiết, hiểu biết sâu', reading: 'くわしい', ex: '田中さんはパソコンのハードウェアについてとても詳しいです。 (Anh Tanaka rất am hiểu tường tận về phần cứng máy tính.)' },
    'スキー場': { meaning: 'khu trượt tuyết', reading: 'スキーじょう', ex: '冬休みに長野の有名なスキー場でスノーボードを楽しみました。 (Kỳ nghỉ đông tôi trượt ván thỏa thích tại khu trượt tuyết nổi tiếng ở Nagano.)' },
    'ことわざ': { meaning: 'câu tục ngữ, châm ngôn dân gian', reading: 'ことわざ', ex: '「継続は力なり」という日本のことわざが大好きです。 (Tôi rất yêu thích câu tục ngữ tiếng Nhật "Kiên trì chính là sức mạnh".)' },
    '仲よくします': { meaning: 'chơi thân thiết, hòa thuận với nhau', reading: 'なかよくします', ex: 'クラスメートのみんなと仲よく協力して学校生活を送っています。 (Tôi sống chan hòa và hợp tác thân thiết cùng các bạn trong lớp.)' },
    '必要（な）': { meaning: 'cần thiết, thiết yếu', reading: 'ひつよう「な」', ex: '日本で一人暮らしをするには、計画的な貯金が必要です。 (Để sống tự lập ở Nhật Bản, việc tiết kiệm có kế hoạch là vô cùng cần thiết.)' }
  },

  // ================= UNIT 36 =================
  'unit-36': {
    '届きます': { meaning: 'được giao đến (tự động từ: thư từ, hàng hóa)', reading: 'とどきます', ex: '田舎の母から美味しい手作りの味噌がクール便で届きました。 (Thùng tương miso mẹ tự tay làm thơm ngon đã được giao đến tận nhà.)' },
    '打ちます': { meaning: 'đánh máy, gõ (chữ, phím)', reading: 'うちます', ex: '会議の議事録をパソコンのキーボードで素早く打ちました。 (Tôi gõ biên bản cuộc họp rất nhanh trên bàn phím máy tính.)' },
    '貯金します': { meaning: 'tiết kiệm tiền, gửi tiền tiết kiệm', reading: 'ちょきんします', ex: '将来自分の店を持つために、毎月の給料から少しずつ貯金しています。 (Để mở quán ăn riêng trong tương lai, mỗi tháng tôi đều trích lương tiết kiệm.)' },
    '太ります': { meaning: 'béo lên, tăng cân', reading: 'ふとります', ex: '最近運動をサボっていたら、体重が3キロも太ってしまいました。 (Dạo này lười tập thể dục nên tôi đã bị tăng lên mất 3 cân.)' },
    'やせます': { meaning: 'gầy đi, giảm cân', reading: 'やせます', ex: '野菜中心のヘルシーな食事を続けて、健康的にやせました。 (Ăn uống thanh đạm nhiều rau củ giúp tôi giảm cân một cách khỏe mạnh.)' },
    '過ぎます': { meaning: 'quá giờ, trôi qua (thời gian)', reading: 'すぎます', ex: '約束の時間を30分も過ぎてから友達が慌ててやって来ました。 (Quá giờ hẹn đến 30 phút thì người bạn mới hớt hải chạy đến.)' },
    '慣れます': { meaning: 'quen với, quen thuộc (tập quán, khí hậu)', reading: 'なれます', ex: '日本に来て半年が経ち、こちらの生活習慣にもすっかり慣れました。 (Sang Nhật được nửa năm, tôi đã hoàn toàn quen với nếp sống nơi đây.)' },
    '固い': { meaning: 'cứng cáp, rắn chắc', reading: 'かたい', ex: 'このフランスパンは外側がとても固いですが、中はふわふわです。 (Ổ bánh mì Pháp này vỏ ngoài rất giòn cứng nhưng ruột lại rất mềm.)' },
    '軟らかい': { meaning: 'mềm mại, êm ái', reading: 'やわらかい', ex: 'よく煮込んだ牛肉がとても軟らかくて美味しかったです。 (Thịt bò hầm kỹ rất mềm và thơm ngon vô cùng.)' },
    '工場': { meaning: 'nhà máy, xưởng sản xuất', reading: 'こうじょう', ex: '最新のロボットが自動車を組み立てる工場を見学しました。 (Tôi đã đến tham quan nhà máy nơi robot hiện đại lắp ráp ô tô.)' },
    '剣道': { meaning: 'kiếm đạo Nhật Bản (Kendo)', reading: 'けんどう', ex: '精神を鍛えるために、放課後に道場で剣道を習っています。 (Để rèn luyện tinh thần, sau giờ học tôi tập kiếm đạo tại võ đường.)' },
    'やっと': { meaning: 'cuối cùng cũng... (sau bao nỗ lực đạt kết quả mừng)', reading: 'やっと', ex: '何ヶ月も猛勉強を重ねて、やっと運転免許の試験に合格しました。 (Sau nhiều tháng miệt mài học, cuối cùng tôi cũng đã đỗ kỳ thi lấy bằng lái xe.)' },
    'かなり': { meaning: 'khá là, tương đối nhiều', reading: 'かなり', ex: '今朝の通勤ラッシュはいつもよりかなり混雑していました。 (Giờ cao điểm sáng nay đông đúc hơn hẳn mọi khi.)' },
    '必ず': { meaning: 'nhất định, chắc chắn (quy tắc tất yếu, quyết tâm)', reading: 'かならず', ex: '出かけるときは、必ず部屋の電気を消して鍵を閉めてください。 (Khi ra ngoài, nhất định hãy tắt điện và khóa cửa cẩn thận nhé.)' },
    '絶対に': { meaning: 'tuyệt đối (thường đi với phủ định: tuyệt đối không...)', reading: 'ぜったいに', ex: '大切な友達との約束は絶対に破りません。 (Lời hứa với người bạn thân quý tôi tuyệt đối không bao giờ phá vỡ.)' },
    '上手に': { meaning: 'khéo léo, giỏi giang', reading: 'じょうずに', ex: '彼女は箸をとても上手に使って魚をきれいに食べます。 (Cô ấy dùng đũa rất khéo léo để gắp cá ăn thật gọn gàng.)' },
    'このごろ': { meaning: 'dạo gần đây, thời gian này', reading: 'このごろ', ex: 'このごろ朝晩の冷え込みが厳しくなってきました。 (Dạo gần đây tiết trời sáng sớm và đêm muộn đã trở nên se lạnh rõ rệt.)' },
    'そのほうが': { meaning: 'như thế thì hơn, cách đó tốt hơn', reading: 'そのほうが', ex: '風邪気味なら無理に出勤せず、家で休むほうがいいですよ。 (Nếu thấy chớm cảm thì đừng cố đi làm, ở nhà nghỉ ngơi sẽ tốt hơn đấy.)' },
    'お客様': { meaning: 'quý khách hàng (kính cẩn)', reading: 'おきゃくさま', ex: 'お客様のご要望に寄り添った丁寧なサービスを心がけています。 (Chúng tôi luôn nỗ lực phục vụ chu đáo theo đúng mong muốn của quý khách.)' },
    '特別な': { meaning: 'đặc biệt, riêng biệt', reading: 'とくべつ「な」', ex: '結婚記念日には特別なレストランでディナーを楽しみました。 (Vào ngày kỷ niệm ngày cưới, chúng tôi thưởng thức bữa tối tại một nhà hàng đặc biệt.)' },
    '水泳': { meaning: 'môn bơi lội', reading: 'すいえい', ex: '全身の筋肉をバランスよく使う水泳は健康維持に最適です。 (Môn bơi lội vận động đều cơ bắp toàn thân rất tốt cho sức khỏe.)' },
    'タンゴ': { meaning: 'điệu nhảy Tango', reading: 'タンゴ', ex: '情熱的な音楽に合わせて優雅にタンゴを踊りました。 (Họ khiêu vũ điệu tango duyên dáng hòa theo tiếng nhạc nồng nàn.)' },
    '気持ち': { meaning: 'tâm trạng, cảm xúc, tấm lòng', reading: 'きもち', ex: '感謝の気持ちを込めて、手作りのプレゼントを贈りました。 (Gửi trọn tấm lòng biết ơn, tôi đã tặng món quà do chính tay mình làm.)' },
    '乗り物': { meaning: 'phương tiện đi lại, phương tiện giao thông', reading: 'のりもの', ex: '遊園地でジェットコースターなどの楽しい乗り物に乗りました。 (Tại công viên giải trí, tôi đã chơi những trò cảm giác mạnh rất vui.)' },
    '歴史': { meaning: 'lịch sử', reading: 'れきし', ex: '京都には千年以上もの長い歴史を持つ寺院がたくさんあります。 (Ở Kyoto có rất nhiều ngôi chùa cổ mang bề dày lịch sử hơn một ngàn năm.)' },
    '世紀': { meaning: 'thế kỷ (100 năm)', reading: 'せいき', ex: '21世紀に入り、AIやデジタル技術が目覚ましく発展しました。 (Bước sang thế kỷ 21, công nghệ AI và kỹ thuật số đã phát triển vượt bậc.)' },
    '遠く': { meaning: 'nơi xa xôi, phía xa', reading: 'とおく', ex: '遠くの空に夕焼け雲が美しく広がっています。 (Phía chân trời xa xa, những đám mây hoàng hôn trải dài tuyệt đẹp.)' },
    '汽車': { meaning: 'tàu hỏa chạy bằng hơi nước', reading: 'きしゃ', ex: '昔懐かしい蒸気機関車の汽車が黒い煙を上げて走っています。 (Đoàn tàu hỏa hơi nước cổ xưa phun khói đen chạy xình xịch.)' },
    '汽船': { meaning: 'tàu thủy chạy bằng hơi nước', reading: 'きせん', ex: '博物館で近代化を支えた巨大な汽船の模型を見ました。 (Tại bảo tàng tôi đã xem mô hình con tàu thủy chạy bằng hơi nước khổng lồ.)' },
    '大勢の（人）': { meaning: 'đông người, đám đông quần chúng', reading: 'おおぜいのひと', ex: '駅前の広場に大勢の人が集まって大道芸を見ていました。 (Rất đông người tụ tập ở quảng trường trước ga để xem biểu diễn đường phố.)' },
    '運びます': { meaning: 'vận chuyển, khiêng vác', reading: 'はこびます', ex: '引っ越しのトラックに重い段ボール箱を次々と運び込みました。 (Tôi lần lượt khiêng những thùng các-tông nặng lên xe tải chuyển nhà.)' },
    'あんぜん（な）': { meaning: 'an toàn', reading: 'あんぜん「な」', ex: '日本の街は夜遅く一人で歩いてもとても安全です。 (Đường phố Nhật Bản rất an toàn dù bạn đi bộ một mình lúc đêm muộn.)' }
  }
};

function runBatch2() {
  console.log('='.repeat(70));
  console.log('TIẾN HÀNH CHUẨN HÓA MINNA N4 BATCH 2 (BÀI 33, 34, 35, 36)');
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

  console.log(`\nHoàn tất Batch 2. Tổng số từ vựng cập nhật: ${totalUpdated}`);
}

runBatch2();

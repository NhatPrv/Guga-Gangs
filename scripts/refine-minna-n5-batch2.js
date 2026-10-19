/**
 * scripts/refine-minna-n5-batch2.js
 * Chuẩn hóa chuyên sâu 100% từ vựng Minna no Nihongo N5 (Bài 13 đến Bài 25):
 * - Triệt tiêu toàn bộ template lặp lại.
 * - Mỗi từ đi với Collocation và câu ví dụ tự nhiên chuẩn bản xứ.
 * - Bản dịch tiếng Việt mượt mà, đúng ngữ cảnh thực tế.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data', 'minna-no-nihongo-n5');

const UNIT_DICTIONARY = {
  // ================= UNIT 13 =================
  'unit-13': {
    '遊びます': { meaning: 'chơi đùa, vui chơi', reading: 'あそびます', ex: '週末はテーマパークへ行って友達と思い切り遊びました。 (Vào cuối tuần tôi đến công viên giải trí và chơi đùa thỏa thích cùng bạn bè.)' },
    '泳ぎます': { meaning: 'bơi lội (ở hồ bơi, biển)', reading: 'およぎます', ex: '夏休みに南の島の透き通ったきれいな海で泳ぎました。 (Kỳ nghỉ hè tôi đã bơi lội thỏa thích ở vùng biển trong vắt của hòn đảo phía nam.)' },
    '迎えます': { meaning: 'đón (ai đó tại ga, sân bay)', reading: 'むかえます', ex: '成田空港の到着ロビーで、ベトナムから来た両親を笑顔で迎えました。 (Tại sảnh đến sân bay Narita, tôi mỉm cười đón bố mẹ từ Việt Nam sang chơi.)' },
    '疲れます': { meaning: 'mệt mỏi, kiệt sức', reading: 'つかれます', ex: '1日中歩き回ったので、足がパンパンに疲れてしまいました。 (Đi bộ loanh quanh suốt cả ngày làm đôi chân tôi mỏi rã rời.)' },
    '結婚します': { meaning: 'kết hôn, cưới hỏi', reading: 'けっこんします', ex: '学生時代から長く付き合っていた恋人と来年結婚します。 (Tôi sẽ kết hôn vào năm tới cùng người yêu đã gắn bó từ thời sinh viên.)' },
    '買い物します': { meaning: 'mua sắm đồ đạc', reading: 'かいものします', ex: '日曜日の午後に駅前の大きなショッピングモールで買い物します。 (Chiều Chủ nhật tôi đi mua sắm ở trung tâm thương mại lớn trước ga.)' },
    '食事します': { meaning: 'dùng bữa, ăn uống', reading: 'しょくじします', ex: '久しぶりに会った昔の友達と落ち着いた和食店で食事しました。 (Tôi cùng người bạn cũ lâu ngày mới gặp đi ăn cơm ở một quán ăn Nhật thanh tịnh.)' },
    '散歩します [公園を～]': { meaning: 'đi dạo (trong công viên)', reading: 'さんぽします', ex: '夕暮れ時の涼しい風を感じながら、愛犬と一緒に近所の公園を散歩しました。 (Đón làn gió mát lúc hoàng hôn, tôi cùng chú chó cưng dạo bộ trong công viên gần nhà.)' },
    '大変「な」': { meaning: 'vất vả, khó khăn, gian nan', reading: 'たいへん「な」', ex: '毎日夜遅くまで残業が続いていて、体がとても大変です。 (Tăng ca liên miên đến đêm muộn mỗi ngày khiến cơ thể tôi vô cùng vất vả.)' },
    '欲しい': { meaning: 'muốn có (đồ vật, bạn bè)', reading: 'ほしい', ex: '通勤がもっと便利になるように、新しい折りたたみ自転車が欲しいです。 (Để đi lại thuận tiện hơn, tôi rất muốn có một chiếc xe đạp gấp mới.)' },
    '寂しい': { meaning: 'cô đơn, buồn bã (thiếu vắng)', reading: 'さびしい', ex: '家族と離れて外国で一人暮らしを始めたころは、とても寂しかったです。 (Hồi mới rời xa gia đình bắt đầu cuộc sống tự lập ở xứ người, tôi thấy rất cô đơn.)' }
  },

  // ================= UNIT 14 =================
  'unit-14': {
    'つけます II': { meaning: 'bật (đèn, điều hòa: 電気を～)', reading: 'つけます', ex: '部屋が暗くなってきたので、天井の電気をつけて明るくしました。 (Trời tối dần nên tôi bật đèn trần lên cho căn phòng sáng sủa.)' },
    '消します': { meaning: 'tắt (điện, tivi, máy móc)', reading: 'けします', ex: '部屋を出て外出するときは、必ずエアコンのスイッチを消してください。 (Khi rời khỏi phòng đi ra ngoài, nhất định hãy tắt công tắc máy điều hòa nhé.)' },
    '開けます': { meaning: 'mở (cửa sổ, cửa ra vào, sách)', reading: 'あけます', ex: '空気を入れ替えるために、リビングの大きな窓を開けました。 (Để không khí trong phòng được lưu thông, tôi mở toang cánh cửa sổ lớn ở phòng khách.)' },
    '閉めます': { meaning: 'đóng (cửa sổ, cửa ra vào)', reading: 'しめます', ex: '外から冷たい風が吹き込んできたので、窓をしっかり閉めました。 (Vì gió lạnh bên ngoài lùa vào nên tôi đóng chặt cửa sổ lại.)' },
    '急ぎます': { meaning: 'khẩn trương, vội vã', reading: 'いそぎます', ex: '電車の発車時刻が迫っているので、駅の階段を急いで駆け上がりました。 (Giờ tàu chạy đã cận kề nên tôi vội vã rảo bước chạy nhanh lên cầu thang ga.)' },
    '待ちます': { meaning: 'chờ đợi (ai đó, xe buýt)', reading: 'まちます', ex: '駅前の喫茶店で温かいコーヒーを飲みながら友達が来るのを待ちました。 (Ngồi nhâm nhi tách cà phê ấm ở quán nước trước ga, tôi đợi người bạn đến.)' },
    '止めます': { meaning: 'dừng đỗ (xe ô tô, xe máy)', reading: 'とめます', ex: '指定されたコインパーキングに車をバックできちんと止めました。 (Tôi lùi xe đỗ cẩn thận và ngay ngắn vào bãi đỗ xe trả tiền tự động quy định.)' },
    '曲がります [右へ～]': { meaning: 'rẽ (sang phải/trái)', reading: 'まがります', ex: '次の大きな交差点を右へ曲がると、左手に郵便局が見えてきます。 (Rẽ phải ở ngã tư lớn tiếp theo là bạn sẽ thấy bưu điện nằm ở phía tay trái.)' },
    '持ちます': { meaning: 'cầm, nắm, xách (hành lý)', reading: 'もちます', ex: '重そうな荷物を持っていたお年寄りに「手伝いましょうか」と声をかけました。 (Thấy cụ già mang túi đồ nặng, tôi cất lời: "Cháu xách giúp cụ nhé ạ".)' },
    '取ります': { meaning: 'lấy giúp (muối, tài liệu: 塩を取る)', reading: 'とります', ex: 'すみませんが、そこのテーブルの上にある塩を取っていただけませんか。 (Xin lỗi bạn lấy giùm tôi lọ muối ở trên chiếc bàn kia với được không ạ?)' },
    '手伝います': { meaning: 'giúp đỡ, phụ giúp (công việc, dọn dẹp)', reading: 'てつだいます', ex: '週末に引越しをする同僚の荷造りをみんなで手伝いました。 (Chúng tôi cùng xắn tay giúp người đồng nghiệp đóng gói đồ đạc chuyển nhà cuối tuần.)' },
    '呼びます': { meaning: 'gọi (taxi: タクシーを呼ぶ / gọi tên)', reading: 'よびます', ex: '雨が激しく降ってきたので、スマホの配車アプリでタクシーを呼びました。 (Trời đổ mưa to dữ dội nên tôi dùng ứng dụng gọi taxi trên điện thoại để bắt xe.)' },
    '話します': { meaning: 'nói chuyện, trò chuyện', reading: 'はなします', ex: '日本語が上手になるために、学校の先生と積極的に日本語で話します。 (Để giỏi tiếng Nhật, tôi chủ động nói chuyện thật nhiều với thầy cô giáo.)' },
    '見せます': { meaning: 'cho xem, xuất trình (vé, ảnh, hộ chiếu)', reading: 'みせます', ex: '空港の入国審査のカウンターで審査官にパスポートを見せました。 (Tại quầy kiểm soát nhập cảnh sân bay, tôi xuất trình hộ chiếu cho viên chức xem.)' },
    '教えます': { meaning: 'chỉ dẫn, dạy (đường đi: 道を教える / số điện thoại)', reading: 'おしえます', ex: '駅までの行き方が分からない観光客に、地図を見せながら親切に道を教えました。 (Tôi mở bản đồ nhiệt tình chỉ đường cho vị khách du lịch chưa biết lối ra ga.)' },
    '始めます': { meaning: 'bắt đầu (buổi học, công việc: 授業を始める)', reading: 'はじめます', ex: 'チャイムが鳴ったので、教科書を開いて今日の授業を始めましょう。 (Chuông đã reo rồi, chúng ta hãy mở sách giáo khoa ra bắt đầu buổi học hôm nay nhé.)' },
    'コピーします': { meaning: 'photocopy, sao chép (tài liệu)', reading: 'コピーします', ex: '会議で出席者に配布するために、この資料を20部コピーしました。 (Tôi đã photocopy tài liệu này thành 20 bản để phát cho người dự họp.)' }
  },

  // ================= UNIT 15 =================
  'unit-15': {
    '立ちます': { meaning: 'đứng dậy, đứng (tự động từ)', reading: 'たちます', ex: '電車でお年寄りが乗ってきたので、すぐに席を立って譲りました。 (Thấy cụ già bước lên tàu điện, tôi lập tức đứng dậy nhường chỗ.)' },
    '座ります': { meaning: 'ngồi xuống (ghế: いすに座る)', reading: 'すわります', ex: '公園の木陰のベンチに座って、持ってきたお弁当を食べました。 (Ngồi trên chiếc ghế dài dưới bóng râm công viên, tôi ăn hộp cơm mang theo.)' },
    '使います': { meaning: 'sử dụng, dùng (máy tính, bút, dụng cụ)', reading: 'つかいます', ex: '料理を作るときは、よく研いだ包丁を注意しながら使います。 (Khi nấu ăn, tôi cẩn thận dùng con dao làm bếp đã được mài sắc.)' },
    '置きます': { meaning: 'đặt, để (đồ vật lên bàn)', reading: 'おきます', ex: '脱いだ靴を玄関の隅にきれいに揃えて置きました。 (Tôi xếp đôi giày đã cởi ngay ngắn gọn gàng vào góc tiền sảnh.)' },
    '作ります，造ります': { meaning: 'chế tạo, nấu nướng, làm ra', reading: 'つくります', ex: '週末に市場で買った新鮮な材料を使って、美味しいカレーを作りました。 (Dùng nguyên liệu tươi ngon mua ở chợ cuối tuần, tôi đã nấu nồi cà ri tuyệt hảo.)' },
    '売ります': { meaning: 'bán (hàng hóa, vé)', reading: 'うります', ex: '駅前のベーカリーでは、毎日焼きたての美味しいパンを売っています。 (Tiệm bánh trước ga ngày nào cũng bày bán những mẻ bánh mì nướng thơm lừng.)' },
    '知ります': { meaning: 'biết, nhận biết (thông tin)', reading: 'しります', ex: 'ニュースを見て初めてその大事件の真相を知りました。 (Xem bản tin thời sự tôi mới vỡ lẽ biết được chân tướng vụ đại án đó.)' },
    '住みます': { meaning: 'sinh sống, định cư (ở đâu: 大阪に住む)', reading: 'すみます', ex: '日本の大学を卒業した後は、交通が便利な東京に住みたいです。 (Sau khi tốt nghiệp đại học ở Nhật, tôi muốn sinh sống tại Tokyo tiện nghi.)' },
    '研究します': { meaning: 'nghiên cứu (chuyên ngành khoa học)', reading: 'けんきゅうします', ex: '大学院の実験室で再生可能エネルギーの新しい技術を研究しています。 (Tại phòng thí nghiệm cao học, tôi đang nghiên cứu công nghệ năng lượng tái tạo mới.)' },
    '知って います': { meaning: 'đang biết, nắm rõ', reading: 'しっています', ex: '「あの有名なピアニストを知っていますか」「はい、よく知っています」 (Bạn có biết người nghệ sĩ dương cầm nổi tiếng kia không? - Vâng, tôi biết rất rõ ạ.)' },
    '住んで います [大阪に～]': { meaning: 'đang cư trú, đang sống tại', reading: 'すんでいます', ex: '私は現在、緑が多くて静かな神奈川県の横浜市に住んでいます。 (Hiện tại tôi đang sống tại thành phố Yokohama thanh bình nhiều cây xanh ở Kanagawa.)' }
  },

  // ================= UNIT 16 =================
  'unit-16': {
    '乗ります [電車に～]': { meaning: 'lên xe, đi tàu (phương tiện: 電車に乗る)', reading: 'のります', ex: '毎朝7時半に最寄りの駅から山手線に乗って通勤しています。 (Mỗi sáng vào lúc 7 rưỡi tôi lên tuyến Yamanote từ ga gần nhà để đi làm.)' },
    '降ります [電車に～]': { meaning: 'xuống tàu xe (phương tiện: 電車を降りる)', reading: 'おります', ex: '新宿駅に着いたら、混雑する人の波に気をつけて電車を降ります。 (Khi tàu đến ga Shinjuku, tôi chú ý dòng người đông đúc rồi bước xuống tàu.)' },
    '乗り換えます': { meaning: 'chuyển tuyến, đổi tàu xe', reading: 'のりかえます', ex: '東京駅で新幹線から在来線の東海道線にスムーズに乗り換えました。 (Tại ga Tokyo, tôi chuyển tuyến nhịp nhàng từ tàu Shinkansen sang tuyến Tokaido.)' },
    '浴びます': { meaning: 'tắm (vòi sen: シャワーを浴びる)', reading: 'あびます', ex: '朝起きたらまず熱いシャワーをサッと浴びて頭をすっきりさせます。 (Mỗi sáng ngủ dậy tôi tắm nhanh bằng vòi sen nước ấm để tinh thần tỉnh táo.)' },
    '入れます': { meaning: 'cho vào, bỏ vào (tiền, đồ vật: 財布に入れる)', reading: 'いれます', ex: '自動販売機の投入口に百円玉を2枚入れて冷たいお茶を買いました。 (Tôi nhét hai đồng xu 100 yên vào khe máy bán tự động để mua lon trà mát.)' },
    '出します': { meaning: 'rút ra, nộp (báo cáo, tiền: お金を出す)', reading: 'だします', ex: '銀行のATMにキャッシュカードを入れて、生活費のお金を下ろしました。 (Tôi đút thẻ rút tiền vào cây ATM của ngân hàng để rút tiền sinh hoạt.)' },
    '入ります [大学に～]': { meaning: 'vào đại học, nhập học (大学に入る)', reading: 'はいります', ex: '長年の猛勉強が実を結び、念願だった国立大学の工学部に入りました。 (Bao năm miệt mài đèn sách đơm hoa kết trái, tôi đã đỗ vào khoa kỹ thuật đại học công lập.)' },
    '出ます [大学を～]': { meaning: 'tốt nghiệp đại học (大学を出る)', reading: 'でます', ex: '来年の春に無事に大学を出て、日本の商社で働き始めます。 (Mùa xuân năm sau tốt nghiệp đại học suôn sẻ, tôi sẽ đi làm tại công ty thương mại Nhật.)' },
    'やめます [会社を～]': { meaning: 'nghỉ việc, từ bỏ (công việc: 会社をやめる)', reading: 'やめます', ex: '自分の夢だったカフェを開くために、長年勤めた会社をやめました。 (Để mở quán cà phê mơ ước bấy lâu, tôi đã xin nghỉ việc ở công ty gắn bó bao năm.)' },
    '押します': { meaning: 'nhấn, ấn (nút bấm: ボタンを押す)', reading: 'おします', ex: '目的の階に着く前に、エレベーターの押しボタンを軽く押しました。 (Trước khi thang máy lên tới tầng mong muốn, tôi nhấn nhẹ vào nút bấm bảng điều khiển.)' }
  },

  // ================= UNIT 17 =================
  'unit-17': {
    '覚えます': { meaning: 'ghi nhớ, học thuộc', reading: 'おぼえます', ex: '毎日寝る前の15分間を使って、新しい英単語を10個ずつ覚えます。 (Mỗi tối tôi dành 15 phút trước khi đi ngủ để học thuộc 10 từ vựng mới.)' },
    '忘れます': { meaning: 'quên (đồ vật, ký ức)', reading: 'わすれます', ex: '電車の荷物棚の上に大切な書類が入ったカバンを忘れてしまいました。 (Tôi lỡ để quên chiếc cặp đựng tài liệu quan trọng trên giá hành lý của tàu điện.)' },
    'なくします': { meaning: 'làm mất, đánh mất', reading: 'なくします', ex: '買い物の途中で家の鍵をなくしてしまい、大家さんに開けてもらいました。 (Đang đi mua sắm thì đánh mất chìa khóa nhà nên tôi phải nhờ chủ nhà mở cửa hộ.)' },
    '払います': { meaning: 'trả tiền, thanh toán (tiền mặt, hóa đơn)', reading: 'はらいます', ex: '月末にコンビニのレジで電気代と水道代の料金をまとめて払いました。 (Cuối tháng tôi ra quầy thanh toán cửa hàng tiện lợi nộp trọn gói tiền điện nước.)' },
    '返します': { meaning: 'trả lại (đồ đã mượn, tiền vay)', reading: 'かえします', ex: '図書館から借りていた本を、返却期限の前にきちんとカウンターへ返しました。 (Tôi đã mang trả những cuốn sách mượn từ thư viện về đúng quầy trước kỳ hạn.)' },
    '出かけます': { meaning: 'ra ngoài, đi ra ngoài có việc', reading: 'でかけます', ex: '天気がとてもいいので、お気に入りの靴を履いて散歩に出かけました。 (Trời đẹp nên tôi xỏ đôi giày yêu thích rồi thảnh thơi ra ngoài đi dạo.)' },
    '脱ぎます': { meaning: 'cởi (quần áo, giày dép: 靴を脱ぐ)', reading: 'ぬぎます', ex: '日本の住宅に上がるときは、必ず玄関で靴を脱いでスリッパを履きます。 (Khi bước vào nhà ở Nhật, ta luôn cởi giày ở bậc thềm rồi mới xỏ dép đi trong nhà.)' },
    '持って行きます': { meaning: 'mang theo đi (từ đây đến nơi khác)', reading: 'もっていきます', ex: '午後から雨が降る予報なので、折りたたみ傘をカバンに入れて持って行きます。 (Dự báo chiều nay trời mưa nên tôi nhét chiếc ô gấp vào ba lô mang theo.)' },
    '持って来ます': { meaning: 'mang lại đây (từ nơi khác đến)', reading: 'もってきます', ex: '明日の日本語の授業には、必ず辞書と教科書を持って来てください。 (Trong tiết học tiếng Nhật ngày mai, các bạn nhớ mang theo từ điển và sách giáo khoa nhé.)' },
    '心配します': { meaning: 'lo lắng, bồn chồn', reading: 'しんぱいします', ex: '初めての一人暮らしで、両親が健康や食事のことをとても心配しています。 (Lần đầu sống xa nhà tự lập, bố mẹ ở quê rất lo lắng cho sức khỏe và ăn uống của tôi.)' }
  },

  // ================= UNIT 18 =================
  'unit-18': {
    'できます': { meaning: 'có thể làm được, hoàn thành', reading: 'できます', ex: '毎日練習を重ねたおかげで、難しい漢字がすらすら書けるようになりました。 (Nhờ kiên trì luyện tập mỗi ngày, giờ tôi đã có thể viết trơn tru những chữ Hán khó.)' },
    '洗います': { meaning: 'rửa, giặt giũ (tay, bát đĩa, xe hơi)', reading: 'あらいます', ex: 'ご飯を食べる前には、薬用石けんで両手をきれいに洗います。 (Trước khi dùng bữa cơm, tôi rửa sạch hai bàn tay bằng xà phòng diệt khuẩn.)' },
    '弾きます': { meaning: 'chơi, gảy (nhạc cụ có dây, phím: ピアノを弾く)', reading: 'ひきます', ex: '放課後の音楽室で、ショパンの美しいノクターンをピアノで弾きました。 (Trong phòng nhạc sau giờ học, tôi chơi bản dạ khúc tuyệt đẹp của Chopin trên đàn piano.)' },
    '歌います': { meaning: 'hát (bài hát: 歌を歌う)', reading: 'うたいます', ex: '友達の結婚披露宴で、心を込めてお祝いの歌をステージで歌いました。 (Trong tiệc cưới của bạn thân, tôi cất cao tiếng hát chúc mừng nồng nhiệt trên sân khấu.)' },
    '集めます': { meaning: 'thu thập, sưu tầm (tem, đồng xu)', reading: 'あつめます', ex: '旅行先で記念として、ご当地のユニークなポストカードを集めています。 (Tôi có sở thích sưu tầm những tấm bưu thiếp độc đáo ở mỗi miền đất du lịch.)' },
    '捨てます': { meaning: 'vứt bỏ, ném đi (rác: ごみを捨てる)', reading: 'すてます', ex: '古くなって破れた雑誌をリサイクルの回収ボックスに捨てました。 (Tôi bỏ những cuốn tạp chí cũ rách vào thùng thu gom rác tái chế.)' },
    '運転します': { meaning: 'lái xe (ô tô: 車を運転する)', reading: 'うんてんします', ex: '週末にレンタカーを借りて、家族と一緒に箱根まで車を運転しました。 (Cuối tuần tôi thuê xe tự lái chở cả gia đình vi vu lên Hakone ngắm cảnh.)' },
    '予約します': { meaning: 'đặt trước (chỗ ngồi, vé máy bay, phòng khách sạn)', reading: 'よやくします', ex: '連休の旅行のために、インターネットで人気の温泉旅館を予約しました。 (Chuẩn bị cho kỳ nghỉ lễ, tôi đã đặt trước phòng tại quán trọ suối nước nóng nổi tiếng qua mạng.)' }
  },

  // ================= UNIT 19 =================
  'unit-19': {
    '登ります': { meaning: 'leo lên, trèo (núi: 山に登る)', reading: 'のぼります', ex: '夏休みに友達と一緒に夜通し歩いて富士山の山頂まで登りました。 (Kỳ nghỉ hè tôi cùng bạn bè đi bộ xuyên đêm leo lên tận đỉnh núi Phú Sĩ.)' },
    '泊まります': { meaning: 'trọ lại, nghỉ qua đêm (ở khách sạn, nhà bạn)', reading: 'とまります', ex: '京都を旅行した際、風情のある古い町屋の宿に泊まりました。 (Khi đi du lịch Kyoto, tôi đã trọ lại một ngôi nhà cổ mang đậm phong vị xưa.)' },
    '掃除します': { meaning: 'dọn dẹp vệ sinh (quét dọn phòng ốc)', reading: 'そうじします', ex: '日曜日の朝に掃除機をかけて、部屋の隅々まできれいに掃除しました。 (Sáng Chủ nhật tôi bật máy hút bụi dọn dẹp sạch bong mọi ngóc ngách căn phòng.)' },
    '洗濯します': { meaning: 'giặt giũ quần áo', reading: 'せんたくします', ex: '天気が良い休日に、たまっていたシーツやタオルを一気に洗濯しました。 (Vào ngày nghỉ nắng đẹp, tôi gom hết ga trải giường và khăn tắm ra giặt một mẻ.)' },
    'なります': { meaning: 'trở thành, trở nên (biến đổi trạng thái)', reading: 'なります', ex: '春になって暖かくなると、近所の公園の桜が一斉に咲き始めます。 (Khi trời sang xuân ấm áp, hoa anh đào trong công viên đồng loạt bung nở.)' }
  },

  // ================= UNIT 20 =================
  'unit-20': {
    '要ります': { meaning: 'cần thiết (cần có: ビザが要る)', reading: 'いります', ex: '海外へ旅行するときは、有効期限内のパスポートが絶対に要ります。 (Khi đi du lịch nước ngoài, hộ chiếu còn hạn là thứ tuyệt đối bắt buộc phải có.)' },
    '調べます': { meaning: 'tra cứu, điều tra (từ điển, internet)', reading: 'しらべます', ex: '電車の乗り換えルートや到着時刻をスマートフォンのアプリで調べました。 (Tôi tra cứu lộ trình chuyển tàu và giờ đến trên ứng dụng điện thoại.)' },
    '直します': { meaning: 'sửa chữa (lỗi sai, viết lại cho đúng)', reading: 'なおします', ex: '先生に赤ペンで直してもらった作文を、もう一度きれいに書き直しました。 (Bài văn được thầy chữa bằng bút đỏ, tôi nắn nót viết lại cho thật chuẩn.)' },
    '修理します': { meaning: 'sửa chữa (máy móc, xe cộ, đồ gia dụng)', reading: 'しゅうりします', ex: '画面が割れてしまったスマートフォンを専門の修理店で直してもらいました。 (Chiếc điện thoại vỡ màn hình đã được thợ ở tiệm sửa chữa phục hồi lại như mới.)' }
  },

  // ================= UNIT 21 =================
  'unit-21': {
    '思います': { meaning: 'nghĩ rằng, cho rằng (bày tỏ quan điểm cá nhân)', reading: 'おもいます', ex: '日本で生活するためには、日常会話の能力が最も大切だと思います。 (Tôi cho rằng để sinh sống ở Nhật, khả năng giao tiếp thường nhật là quan trọng nhất.)' },
    '言います': { meaning: 'nói rằng (phát biểu lời nói)', reading: 'いいます', ex: '先生は「諦めずに努力を続ければ必ず道は開ける」と言いました。 (Thầy giáo từng nói: "Nếu không bỏ cuộc mà kiên trì nỗ lực thì ắt sẽ mở ra con đường".)' },
    '足ります': { meaning: 'đủ, đầy đủ (tiền nong, thời gian: 時間が足りる)', reading: 'たります', ex: '試験の時間は60分間ありましたが、問題を解くのに十分足りました。 (Thời gian thi kéo dài 60 phút và hoàn toàn đủ để tôi hoàn thành hết bài làm.)' },
    '勝ちます': { meaning: 'chiến thắng (trận đấu, đối thủ: 試合に勝つ)', reading: 'かちます', ex: 'チーム全員で力を合わせて、強豪校との決勝戦で見事に勝ちました。 (Toàn đội cùng nhau hợp sức và đã xuất sắc giành chiến thắng trong trận chung kết.)' },
    '負けます': { meaning: 'thua cuộc, thất bại (試合に負ける)', reading: 'まけます', ex: '試合に負けて悔しかったですが、全力を出し切ったので後悔はありません。 (Thua trận tuy rất tiếc nuối nhưng vì đã dốc hết sức nên tôi không hề hối hận.)' },
    '役に立ちます': { meaning: 'có ích, giúp ích (hữu dụng trong đời sống)', reading: 'やくにたちます', ex: '学生時代に培ったパソコンのスキルが、現在の職場で大いに役に立っています。 (Kỹ năng tin học tích lũy thời sinh viên đang giúp ích rất nhiều cho công việc hiện tại.)' }
  },

  // ================= UNIT 22 =================
  'unit-22': {
    '着ます': { meaning: 'mặc (áo sơ mi, áo khoác, vest: シャツを着る)', reading: 'きます', ex: '面接を受けるために、清潔感のある白いシャツとスーツを着ました。 (Để đi phỏng vấn, tôi diện bộ vest lịch lãm cùng chiếc áo sơ mi trắng tinh tươm.)' },
    'はきます「くつを～」': { meaning: 'xỏ, đi (quần, giày dép, váy: 靴をはく)', reading: 'はきます', ex: '休日のウォーキングのために、履き心地の良いスニーカーをはきました。 (Để đi bộ thể dục ngày nghỉ, tôi xỏ đôi giày thể thao êm ái.)' },
    'かぶります「ぼうしを～」': { meaning: 'đội (mũ nón: 帽子をかぶる)', reading: 'かぶります', ex: '真夏の強い日差しを遮るために、つばの広い麦わら帽子をかぶりました。 (Để che bớt ánh nắng hè gay gắt, tôi đội một chiếc mũ cói vành rộng.)' },
    'かけます「めがねを～」': { meaning: 'đeo (kính mắt: めがねをかける)', reading: 'かけます', ex: '黒板の小さな文字がよく見えるように、度数の合った眼鏡をかけました。 (Để nhìn rõ chữ nhỏ trên bảng, tôi đeo chiếc kính cận vừa độ vào.)' },
    '生まれます': { meaning: 'sinh ra, chào đời (ở đâu: ハノイで生まれる)', reading: 'うまれます', ex: '私は豊かな自然と穏やかな川に囲まれたベトナムの地方都市で生まれました。 (Tôi được sinh ra tại một thành phố êm đềm nhiều cây xanh và sông ngòi ở Việt Nam.)' }
  },

  // ================= UNIT 23 =================
  'unit-23': {
    '回します': { meaning: 'vặn, xoay (núm xoay, chìa khóa)', reading: 'まわします', ex: '水道の蛇口を右へ回すと、勢いよくきれいな水が流れ出しました。 (Vặn vòi nước sang bên phải, dòng nước trong veo liền tuôn trào mát rượi.)' },
    '引きます': { meaning: 'kéo (cửa kéo, dây: ドアを引く)', reading: 'ひきます', ex: 'ドアの取っ手を強く引いて開けると、中から温かい光が漏れてきました。 (Tôi kéo mạnh tay nắm cửa mở ra, ánh sáng ấm áp bên trong liền ùa tới.)' },
    '変えます': { meaning: 'thay đổi (kế hoạch, mật khẩu)', reading: 'かえます', ex: '安全性を高めるために、定期的にアカウントのパスワードを変えています。 (Để nâng cao tính bảo mật, tôi thường xuyên đổi mật khẩu tài khoản định kỳ.)' },
    '触ります': { meaning: 'chạm vào, sờ vào (đồ vật: ボタンに触る)', reading: 'さわります', ex: '展示室の美術品は壊れやすいので、絶対に手で触らないでください。 (Các hiện vật mỹ thuật trong phòng trưng bày rất dễ vỡ, xin tuyệt đối không sờ tay vào.)' },
    '動きます。': { meaning: 'hoạt động, chuyển động (máy móc: 機械が動く)', reading: 'うごきます', ex: '電源プラグをコンセントに差し込むと、モーターが力強く動きました。 (Cắm phích vào ổ điện, động cơ liền khởi động chạy một cách mạnh mẽ.)' },
    '歩きます': { meaning: 'đi bộ (tản bộ trên vỉa hè)', reading: 'あるきます', ex: '健康のために、毎朝家から駅までの2キロの道のりを歩いています。 (Để rèn luyện sức khỏe, sáng nào tôi cũng đi bộ quãng đường 2km từ nhà ra ga.)' },
    '渡ります': { meaning: 'băng qua (cầu, đường: 橋/道を渡る)', reading: 'わたります', ex: '信号が青に変わったのを確認してから、横断歩道を渡りました。 (Chờ đèn tín hiệu chuyển xanh an toàn, tôi mới bước qua vạch sang đường.)' },
    '気を付けます': { meaning: 'chú ý, cẩn thận', reading: 'きをつけます', ex: '暗い夜道を歩くときは、後ろから来る自転車や車によく気を付けます。 (Lúc đi bộ đường tối ban đêm, tôi luôn chú ý quan sát xe cộ từ phía sau.)' }
  },

  // ================= UNIT 24 =================
  'unit-24': {
    'くれます': { meaning: 'cho tôi, tặng tôi (người khác làm cho mình)', reading: 'くれます', ex: '誕生日に日本のホストファミリーが素敵なアルバムをくれました。 (Vào ngày sinh nhật, gia đình cha mẹ nuôi người Nhật đã tặng cho tôi một cuốn album rất đẹp.)' },
    '連れて行きます': { meaning: 'dẫn đi (dẫn ai đi đâu)', reading: 'つれていきます', ex: '週末に日本から遊びに来た友達を浅草の浅草寺へ連れて行きました。 (Cuối tuần tôi dẫn người bạn mới từ Nhật sang chơi đi tham quan chùa Asakusa.)' },
    '連れて来ます': { meaning: 'dẫn đến (dẫn ai đến đây)', reading: 'つれてきます', ex: '明日のホームパーティーに私の仲のいいベトナム人の友達を連れて来ます。 (Trong bữa tiệc tại nhà ngày mai, tôi sẽ dẫn người bạn thân Việt Nam đến cùng.)' },
    '紹介します': { meaning: 'giới thiệu (bạn bè, đối tác)', reading: 'しょうかいします', ex: '同じクラスに新しく入ってきた留学生のみんなを先生に紹介しました。 (Tôi giới thiệu những bạn du học sinh mới vào lớp cho thầy giáo làm quen.)' },
    '案内します': { meaning: 'hướng dẫn, dẫn đường (thăm quan thành phố)', reading: 'あんないします', ex: '東京を初めて訪れた友人に、秋葉原や銀座の街並みを一日案内しました。 (Tôi dành trọn một ngày dẫn người bạn lần đầu đến Tokyo đi dạo phố Akihabara và Ginza.)' },
    '説明します': { meaning: 'giải thích, thuyết minh (cách dùng, nội quy)', reading: 'せつめいします', ex: '新入社員に向けて、社内システムの基本的な使い方を分かりやすく説明しました。 (Tôi giải thích dễ hiểu về cách sử dụng hệ thống nội bộ cho các bạn nhân viên mới.)' }
  },

  // ================= UNIT 25 =================
  'unit-25': {
    '考えます': { meaning: 'suy nghĩ, đắn đo (phương hướng, giải pháp)', reading: 'かんがえます', ex: '大学を卒業した後の進路について、一人で部屋でじっくり考えました。 (Tôi ngồi trầm ngâm suy nghĩ kỹ lưỡng về định hướng tương lai sau khi tốt nghiệp.)' },
    '着きます': { meaning: 'đến nơi, cập bến (ga: 駅に着く)', reading: 'つきます', ex: '定刻通りに新幹線が京都駅のホームに静かに着きました。 (Đúng theo lịch trình, đoàn tàu Shinkansen đã cập bến sân ga Kyoto một cách êm ả.)' },
    '留学します': { meaning: 'du học (ở nước ngoài: 日本へ留学する)', reading: 'りゅうがくします', ex: '先端のロボット工学を学ぶために、来年の秋から日本へ留学します。 (Để theo đuổi ngành kỹ thuật robot tiên tiến, tôi sẽ sang Nhật du học từ mùa thu tới.)' },
    '頑張ります': { meaning: 'cố gắng, nỗ lực hết mình', reading: 'がんばります', ex: '日本語能力試験で必ず満点合格できるように、最後まで諦めずに頑張ります。 (Để đạt điểm tuyệt đối trong kỳ thi JLPT, tôi sẽ dốc sức nỗ lực đến cùng không bỏ cuộc.)' }
  }
};

function runMinnaN5Batch2() {
  console.log('='.repeat(70));
  console.log('TIẾN HÀNH CHUẨN HÓA MINNA N5 BATCH 2 (BÀI 13 ĐẾN BÀI 25)');
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

  console.log(`\nHoàn tất Minna N5 Batch 2. Tổng số từ vựng cập nhật: ${totalUpdated}`);
}

runMinnaN5Batch2();

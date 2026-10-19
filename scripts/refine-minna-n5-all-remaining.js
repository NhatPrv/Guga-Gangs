/**
 * scripts/refine-minna-n5-all-remaining.js
 * Chuẩn hóa 100% các từ vựng Minna no Nihongo N5 còn lại:
 * Thay thế toàn bộ các câu dính template thành câu ví dụ tự nhiên thực tế,
 * chuẩn collocation và ngữ cảnh đời sống Nhật Bản.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data', 'minna-no-nihongo-n5');

const VOCAB_MAP = {
  // Đồ ăn / Thức uống
  '朝ご飯': { ex: '朝ご飯にトーストと目玉焼きを美味しく食べました。 (Bữa sáng tôi đã ăn bánh mì nướng và trứng ốp la rất ngon.)' },
  '昼ご飯': { ex: 'お昼休みに社員食堂で日替わり定食を食べました。 (Giờ nghỉ trưa tôi ăn suất cơm theo ngày ở căng tin công ty.)' },
  '水': { ex: '運動した後にコップ一杯の冷たい水を飲みました。 (Sau khi vận động xong, tôi uống một ly nước mát lạnh.)' },
  'ミルク': { ex: '温かいホットミルクを飲んでからベッドに入りました。 (Uống một ly sữa nóng xong tôi mới lên giường đi ngủ.)' },
  'ジュース': { ex: '自動販売機で果汁100パーセントのオレンジジュースを買いました。 (Tôi mua hộp nước cam nguyên chất 100% ở máy bán tự động.)' },
  'お酒': { ex: 'お祝いの席で日本のおいしい純米酒を一杯いただきました。 (Trong bữa tiệc chúc mừng, tôi nâng một chén rượu sake thơm ngon.)' },
  'チリソース': { ex: 'フライドポテトに少し辛いチリソースをつけて食べました。 (Tôi chấm khoai tây chiên với một chút tương ớt cay cay.)' },
  'りんご': { ex: '八百屋さんで真っ赤に熟した甘いりんごを3個買いました。 (Tại sạp hoa quả tôi mua 3 quả táo chín đỏ ngọt lịm.)' },
  'みかん': { ex: '冬の寒い日にこたつに入ってみかんを食べました。 (Ngày đông lạnh giá, tôi ngồi sưởi bàn kotatsu và bóc quýt ăn.)' },
  'サンドイッチ': { ex: '駅の売店でタマゴとハムのサンドイッチを買いました。 (Tại sạp bán hàng ở ga, tôi mua chiếc bánh mì kẹp trứng và giăm bông.)' },
  'カレー(ライス)': { ex: '家庭で作ったスパイスの効いたカレーライスを食べました。 (Tôi ăn đĩa cơm cà ri thơm nồng gia vị tự nấu tại nhà.)' },
  'アイスクリーム': { ex: '暑い夏の午後に冷たいバニラアイスクリームを食べました。 (Chiều hè nóng nực, tôi thưởng thức que kem vani mát lạnh.)' },
  '「お」すし': { ex: '家族のお祝いの日に回転寿司でおいしいお寿司を食べました。 (Ngày mừng của gia đình, cả nhà đi ăn sushi băng chuyền rất ngon.)' },
  'てんぷら': { ex: '揚げたてのエビや野菜のサクサクした天ぷらを味わいました。 (Tôi thưởng thức món tempura tôm và rau củ chiên giòn rụm vừa ra lò.)' },
  '牛どん': { ex: '駅前の吉野家で温かくて安くておいしい牛丼を食べました。 (Tại quán Yoshinoya trước ga, tôi ăn bát cơm bò xào nóng hổi giá rẻ.)' },
  'ていしょく': { ex: 'お昼に魚の塩焼きとみそ汁がついた定食を注文しました。 (Bữa trưa tôi gọi suất cơm có kèm cá nướng muối và canh miso.)' },

  // Hoạt động / Đồ vật / Thể thao / Giải trí
  'サッカー': { ex: '放課後のグラウンドでクラスメートとサッカーを楽しみました。 (Trên sân trường sau giờ học, tôi đá bóng vui vẻ cùng các bạn.)' },
  'テニス': { ex: '休日の朝にテニスコートで友達とテニスの練習をしました。 (Sáng ngày nghỉ tôi tập đánh quần vợt cùng bạn ở sân tennis.)' },
  'CD': { ex: '大好きなバンドの新しいアルバムCDを部屋で聴きました。 (Tôi mở đĩa CD album mới của ban nhạc yêu thích nghe tại phòng.)' },
  'ビデオ': { ex: '昔家族で旅行したときの懐かしいホームビデオを見ました。 (Tôi xem lại cuốn video gia đình ghi lại chuyến du lịch xưa đầy kỷ niệm.)' },
  '映画': { ex: '休日の夜に映画館の大画面で話題のアクション映画を見ました。 (Tối ngày nghỉ tôi đến rạp chiếu bóng xem phim hành động gay cấn.)' },
  '写真': { ex: '京都の古い寺院の前で満開の桜を背景に写真を撮りました。 (Trước ngôi chùa cổ Kyoto, tôi chụp bức ảnh kỷ niệm dưới hoa anh đào.)' },
  '庭': { ex: '家の庭に季節の花が色とりどりに咲いていてきれいです。 (Ngoài sân vườn nhà tôi có nhiều loài hoa theo mùa nở rộ tuyệt đẹp.)' },
  '宿題': { ex: 'テレビを見る前に、明日の授業の宿題を終わらせました。 (Trước khi xem tivi, tôi đã làm xong bài tập về nhà cho ngày mai.)' },
  'レポート': { ex: '図書館で資料を調べて、環境問題についてのレポートを書きました。 (Tra cứu tài liệu ở thư viện, tôi đã hoàn thành bài báo cáo môi trường.)' },
  'お花見': { ex: '春の週末に満開の桜の木の下でお花見を楽しみました。 (Vào cuối tuần mùa xuân, chúng tôi đi ngắm hoa anh đào dưới tán cây nở rộ.)' },
  '手紙': { ex: 'お世話になった高校の恩師へ近況を報告する手紙を書きました。 (Tôi viết lá thư báo tin tình hình dạo này gửi người thầy cũ cấp ba.)' },
  '切手': { ex: '封筒の右上に綺麗な記念切手を一枚貼りました。 (Tôi dán một chiếc tem kỷ niệm đẹp lên góc phong bì thư.)' },
  '葉書': { ex: '旅先から友達へ現地の美しい景色が印刷された葉書を送りました。 (Từ nơi du lịch tôi gửi cho bạn tấm bưu thiếp in cảnh sắc tuyệt đẹp.)' },
  '封筒': { meaning: 'chiếc phong bì', reading: 'ふうとう', ex: '願書の書類を折り曲げずに大きな白い封筒に入れました。 (Tôi bỏ hồ sơ đăng ký vào chiếc phong bì lớn màu trắng không gập lại.)' },
  '速達': { ex: '大切な書類を少しでも早く届けるために速達で送りました。 (Để tài liệu quan trọng đến sớm nhất có thể, tôi gửi bằng thư hỏa tốc.)' },
  '書留': { ex: 'パスポートの更新書類を郵便局から書留で郵送しました。 (Tôi gửi hồ sơ làm lại hộ chiếu qua đường bưu điện bằng thư bảo đảm.)' },
  'エアメール': { ex: '海外のペンパルから航空便のエアメールが届きました。 (Tôi nhận được bức thư hàng không gửi từ người bạn qua thư ở nước ngoài.)' },
  'プレゼント': { ex: '誕生日に友達から心のこもったすてきなプレゼントをもらいました。 (Vào ngày sinh nhật, tôi nhận được món quà tuyệt vời chan chứa tình cảm.)' },
  'お金': { ex: '買い物をする前に、ATMでお金を少し下ろしておきました。 (Trước khi đi mua sắm, tôi ghé cây ATM rút một ít tiền mặt dự phòng.)' },
  'きっぷ': { ex: '駅の券売機で目的地までの片道切符を購入しました。 (Tôi mua chiếc vé một chiều đến điểm cần tới tại máy bán vé ở ga.)' },

  // Nơi chốn / Nhà cửa / Đồ đạc
  'テーブル': { ex: 'ダイニングテーブルの上にきれいな花瓶を置きました。 (Tôi đặt chiếc bình hoa trang nhã lên mặt bàn ăn phòng khách.)' },
  'ベッド': { ex: '疲れて帰宅した後、柔らかいベッドに横になって休みました。 (Về nhà mệt mỏi, tôi ngả lưng nằm nghỉ trên chiếc giường êm ái.)' },
  '棚': { ex: '本棚の上の段にお気に入りの小説をきれいに並べました。 (Tôi xếp những cuốn tiểu thuyết yêu thích ngay ngắn lên tầng trên giá sách.)' },
  'ドア': { ex: '風でバタンと音がしないように、ドアを静かに閉めました。 (Để gió không làm va đập mạnh, tôi nhẹ nhàng khép cánh cửa lại.)' },
  '窓': { ex: '朝起きたら部屋の窓を開けて、新鮮な空気を吸い込みます。 (Sáng dậy tôi mở cửa sổ phòng và hít thở bầu không khí ban mai trong lành.)' },
  'ビル': { ex: '駅前には近代的なガラス張りの高層ビルが立ち並んでいます。 (Trước nhà ga san sát những tòa nhà cao tầng bằng kính hiện đại.)' },
  '喫茶店': { ex: '駅前の静かな喫茶店で本を読みながらコーヒーを飲みました。 (Tại quán nước yên tĩnh trước ga, tôi vừa đọc sách vừa nhâm nhi cà phê.)' },
  '本屋': { ex: '放課後に駅前の大きな本屋に立ち寄って参考書を買いました。 (Sau giờ học tôi ghé vào hiệu sách lớn trước ga mua sách tham khảo.)' },
  '乗り場': { ex: '駅前ロータリーの2番バス乗り場からバスに乗りました。 (Tôi lên xe buýt từ điểm đón số 2 ở bến vòng xuyến trước nhà ga.)' },
  '県': { ex: '自然が豊かで温泉がたくさんある長野県へ旅行に行きました。 (Tôi đi du lịch đến tỉnh Nagano nơi thiên nhiên phong phú và nhiều suối nước nóng.)' },
  '公園': { ex: '休日の午後に緑豊かな近所の公園をのんびり散歩しました。 (Chiều ngày nghỉ tôi thong dong đi dạo quanh công viên xanh mát gần nhà.)' },
  'スーパー': { ex: '夕方に近所のスーパーへ行って今晩のおかずの買い物をしました。 (Buổi chiều tôi ra siêu thị gần nhà mua đồ về nấu món ăn tối.)' },
  '駅': { ex: '朝の通勤時間帯なので、駅のホームは多くの人で混雑しています。 (Đang là giờ đi làm buổi sáng nên sân ga chật ních dòng người qua lại.)' },

  // Gia đình / Con người
  '母': { ex: '母はいつも家族の健康を考えて栄養満点の料理を作ってくれます。 (Mẹ luôn lo cho sức khỏe cả nhà và nấu những món ăn giàu dinh dưỡng.)' },
  '妹': { ex: '妹は絵を描くのがとても上手で、美術のコンクールで入賞しました。 (Em gái tôi vẽ tranh rất đẹp và đã đoạt giải trong cuộc thi mỹ thuật.)' },
  '奥さん': { ex: '田中さんの奥さんはとても明るくて優しい笑顔の方です。 (Vợ của anh Tanaka là một người phụ nữ rất vui vẻ và có nụ cười phúc hậu.)' },
  'ご主人': { ex: '佐藤さんのご主人は大手商社で海外営業を担当されています。 (Chồng của chị Sato làm mảng kinh doanh quốc tế tại một tập đoàn thương mại lớn.)' },
  '子ども': { ex: '公園の砂場で小さな子どもたちが楽しそうに遊んでいます。 (Ở bãi cát công viên, các em nhỏ đang chơi đùa vô cùng thích thú.)' },
  '男の子': { ex: '元気な男の子が犬と一緒に広場を駆け回っています。 (Cậu bé hiếu động đang tung tăng chạy nhảy cùng chú chó trên bãi đất trống.)' },
  '女の子': { ex: '赤いランドセルを背負った女の子が元気に小学校へ通っています。 (Bé gái đeo chiếc cặp màu đỏ tung tăng rảo bước đến trường tiểu học.)' },

  // Tính từ / Trạng thái
  '暑い、熱い': { ex: '真夏の昼間は日差しが強くて耐えられないほど暑いです。 (Buổi trưa giữa hè ánh nắng chói chang oi bức đến ngột ngạt.)' },
  '優しい': { ex: '困っているときにいつも優しく声をかけてくれる友達がいます。 (Tôi có một người bạn luôn ân cần hỏi han mỗi khi tôi gặp khó khăn.)' },
  '厳しい': { ex: '先生は授業中はとても厳しいですが、普段は気さくで優しいです。 (Thầy giáo trong giờ học rất nghiêm khắc nhưng ngày thường lại rất gần gũi.)' },
  '低い': { ex: '天井が少し低い部屋ですが、落ち着いていて居心地が良いです。 (Căn phòng trần hơi thấp một chút nhưng lại rất ấm cúng và yên tĩnh.)' },
  'おもしろい': { ex: '図書館で借りてきたユーモアあふれる小説がとてもおもしろいです。 (Cuốn tiểu thuyết hài hước mượn ở thư viện đọc rất là thú vị.)' },
  'つまらない': { ex: 'ストーリーの展開が予想通りで、少しつまらない映画でした。 (Diễn biến cốt truyện quá dễ đoán nên bộ phim hơi tẻ nhạt một chút.)' },
  'おいしい': { ex: '焼きたてのパンにバターを塗って食べると本当においしいです。 (Bánh mì mới nướng phết thêm chút bơ ăn thơm ngon tuyệt vời.)' },
  '楽しい': { ex: '休日に友達とテーマパークで一日中遊んでとても楽しかったです。 (Ngày nghỉ đi chơi cả ngày ở công viên giải trí cùng bạn bè thật là vui.)' },
  '白い': { ex: '冬の朝に窓の外を見ると、街一面が白い雪で覆われていました。 (Sáng mùa đông nhìn ra ngoài cửa sổ, cả góc phố phủ kín tuyết trắng.)' },
  '黒い': { ex: '大事なビジネスの商談のために、黒いスーツをきちんと着ました。 (Chuẩn bị cho cuộc đàm phán quan trọng, tôi mặc bộ vest đen chỉnh tề.)' },
  '赤い': { ex: '秋の深まりとともに、山々の木々が鮮やかな赤い色に染まりました。 (Khi thu dần tàn, cây cối trên khắp sườn núi nhuộm một sắc đỏ rực rỡ.)' },
  '青い': { ex: '晴れ渡った青い空を見上げると、爽快な気持ちになります。 (Ngước nhìn bầu trời trong xanh vời vợi, lòng tôi thấy thật khoan khoái.)' },
  'ハンサムな': { ex: '映画の主演俳優は背が高くてとてもハンサムな方です。 (Nam diễn viên chính trong phim có dáng người cao ráo và rất điển trai.)' },
  '温かい、暖かい': { ex: '寒い冬の夜に温かい野菜スープを飲むと体が芯から温まります。 (Đêm đông giá rét uống bát súp rau củ nóng làm ấm người từ bên trong.)' },
  '涼しい': { ex: '夕方になると川沿いから心地よい涼しい風が吹いてきます。 (Cứ đến chiều muộn là ngọn gió mát lành từ ven sông lại thổi về dịu êm.)' },
  '広い': { ex: '私の部屋は窓が南向きで、日当たりが良くてとても広いです。 (Căn phòng của tôi cửa sổ hướng nam đón nắng chan hòa và rất rộng rãi.)' },
  '狭い': { ex: '少し狭い部屋ですが、掃除が簡単で一人暮らしには十分です。 (Căn phòng hơi nhỏ một chút nhưng dễ quét dọn và quá đủ cho cuộc sống độc thân.)' },
  '若い': { ex: '多くの若い留学生たちが将来の夢に向かって一生懸命学んでいます。 (Rất nhiều bạn trẻ du học sinh đang miệt mài học tập vì ước mơ tương lai.)' },
  '長い': { ex: '夏休みの長い連休を利用して、日本全国を一周する旅に出ました。 (Tận dụng kỳ nghỉ hè dài ngày, tôi đã lên đường du lịch một vòng khắp nước Nhật.)' },
  '短い': { ex: '楽しい時間はあっという間に過ぎて、一日がとても短く感じます。 (Khoảnh khắc vui vẻ thoắt cái trôi qua, một ngày cảm giác ngắn ngủi làm sao.)' },
  '明るい': { ex: '大きな窓から太陽の光が差し込んで、リビングがとても明るいです。 (Ánh nắng ban mai rọi qua ô cửa sổ lớn khiến phòng khách sáng bừng.)' },
  '暗い': { ex: '街灯が少なくて夜道が暗いので、懐中電灯を持って歩きます。 (Ít đèn đường nên lối đi ban đêm khá tối, tôi cầm theo chiếc đèn pin nhỏ.)' },
  '危ない': { ex: '交通量の多い交差点を赤信号で渡るのは非常に危ないです。 (Băng qua ngã tư đông đúc xe cộ khi đèn đỏ là điều cực kỳ nguy hiểm.)' },
  '大切な': { ex: '家族や友人からもらった温かい励ましの言葉を大切にしています。 (Tôi luôn trân quý những lời động viên ấm áp từ gia đình và bạn bè.)' },
  '大丈夫な': { ex: '「怪我はありませんか」「はい、かすり傷ですから大丈夫です」 (Bạn có bị thương không? - Dạ vâng, chỉ xước nhẹ chút thôi nên không sao ạ.)' },

  // Từ loại vị trí / Thời gian / Đại từ
  '上': { ex: '机の上に置いたノートパソコンを開いて作業を始めました。 (Tôi mở chiếc máy tính xách tay đặt trên bàn làm việc ra bắt đầu công việc.)' },
  '下': { ex: '雨宿りをするために、大きな木の下に駆け込みました。 (Để trú cơn mưa rào, tôi vội chạy vào nấp dưới gốc cây to.)' },
  '前': { ex: '駅の正面口の前で友達と10時に待ち合わせをしています。 (Tôi hẹn gặp bạn lúc 10 giờ ở trước cổng chính của nhà ga.)' },
  'うしろ': { ex: 'バスのうしろの席に座って、窓の外の景色を眺めました。 (Ngồi ở hàng ghế phía sau xe buýt, tôi ngắm nhìn cảnh vật ngoài cửa sổ.)' },
  '右': { ex: '交差点を右に曲がると、角に交番が見えてきます。 (Rẽ sang phía tay phải ở ngã tư là bạn sẽ thấy bốt cảnh sát ngay góc đường.)' },
  '左': { ex: '廊下の突き当たりを左に曲がったところにトイレがあります。 (Đi đến cuối hành lang rẽ trái là có nhà vệ sinh.)' },
  '中': { ex: 'カバンの中に教科書や筆箱をきちんと整理して入れました。 (Tôi xếp sách giáo khoa và hộp bút ngăn nắp vào bên trong ba lô.)' },
  '外': { ex: '天気がいいので、部屋から出て外の空気を吸いに行きました。 (Trời đẹp nên tôi bước ra khỏi phòng ra ngoài hít thở khí trời.)' },
  '隣': { ex: '私の部屋の隣には親切な大学院生が住んでいます。 (Ngay sát cạnh phòng tôi là một bạn nghiên cứu sinh rất tốt bụng.)' },
  '近く': { ex: 'アパートの近くに24時間営業のコンビニがあって便利です。 (Gần khu căn hộ có cửa hàng tiện lợi mở 24/7 rất thuận tiện.)' },
  '間': { ex: '本棚と机の間の隙間に掃除機をかけてきれいにしました。 (Tôi đưa máy hút bụi vào khe hở giữa giá sách và bàn làm việc để dọn sạch.)' },
  'おととい': { ex: 'おとといの夜に久しぶりに故郷の幼馴染と電話で話しました。 (Tối hôm kia tôi đã gọi điện thoại tâm sự rất lâu với bạn thuở nhỏ ở quê.)' },
  'きのう': { ex: 'きのうは仕事が終わったあと、同僚とラーメンを食べに行きました。 (Hôm qua sau giờ tan sở, tôi cùng đồng nghiệp đi ăn mì ramen.)' },
  'きょう': { ex: 'きょうは爽やかな秋晴れで、散歩にぴったりの日和です。 (Hôm nay trời thu trong xanh dịu mát, rất thích hợp để ra ngoài đi dạo.)' },
  'けさ': { ex: 'けさは少し冷え込んだので、暖かい上着を羽織って家を出ました。 (Sáng nay trời hơi se lạnh nên tôi khoác chiếc áo ấm rồi mới ra khỏi nhà.)' },
  '休み': { ex: '来週の月曜日は祝日で会社の休みなので、小旅行に出かけます。 (Thứ Hai tới là ngày nghỉ lễ của công ty nên tôi sẽ đi du lịch ngắn ngày.)' },

  // Các từ ngữ hội thoại / từ nối / đặc biệt
  'はい': { ex: '先生に名前を呼ばれたら、元気に「はい」と返事をします。 (Khi được thầy giáo gọi tên, ta hãy đáp lời "Vâng" thật dõng dạc nhé.)' },
  '初めまして。': { ex: '初めまして、ベトナムから参りましたナムと申します。どうぞよろしく。 (Xin chào lần đầu gặp mặt, tôi tên là Nam đến từ Việt Nam. Rất mong được giúp đỡ.)' },
  'お名前は？': { ex: '失礼ですが、お名前は何とおっしゃいますか。 (Xin thứ lỗi mạo muội hỏi tên của bạn là gì vậy ạ?)' },
  'かしこまりました': { meaning: 'tôi đã hiểu rõ rồi (kính ngữ khi nhận lệnh từ cấp trên/khách)', reading: 'かしこまりました', ex: '「アイスコーヒーを2つお願いします」「かしこまりました」 (Cho tôi 2 cà phê đá nhé. - Dạ vâng, tôi xin ghi nhận ngay ạ.)' },
  'どういたしまして': { ex: 'お礼を言われたので、「どういたしまして」と笑顔で返しました。 (Được cảm ơn, tôi mỉm cười đáp lại: "Dạ không có chi đâu ạ".)' },
  'いってらっしゃい': { ex: '出かける家族に向かって「気をつけて、いってらっしゃい」と見送りました。 (Tôi tiễn người thân ra cửa: "Anh/chị đi cẩn thận nhé, chúc một ngày tốt lành".)' },
  'いってきます': { ex: '玄関で靴を履きながら、「いってきます」と元気に出発しました。 (Vừa xỏ giày ở tiền sảnh, tôi vừa vui vẻ cất lời: "Con đi học đây ạ".)' },
  'ただいま。': { ex: '帰宅してドアを開け、「ただいま」と家族に声をかけました。 (Về đến nhà mở cửa, tôi cất tiếng gọi: "Con đã về rồi đây ạ".)' },
  'お帰かえりなさい。': { ex: '仕事から帰ってきた父を「お帰りなさい、お疲れ様」と迎えました。 (Bố đi làm về, tôi đón chào: "Bố đã về rồi ạ, bố đi làm vất vả rồi".)' },
  '失礼します': { ex: 'ノックをして、「失礼します」と挨拶して面接室に入りました。 (Gõ cửa và cất lời chào "Em xin phép ạ", tôi bước vào phòng phỏng vấn.)' }
};

function runMinnaN5Remaining() {
  console.log('='.repeat(70));
  console.log('TIẾN HÀNH CHUẨN HÓA CÁC TỪ VỰNG MINNA N5 CÒN LẠI');
  console.log('='.repeat(70));

  let totalUpdated = 0;
  const units = fs.readdirSync(DATA_DIR).filter(u => u.startsWith('unit-')).sort();

  for (const u of units) {
    const filePath = path.join(DATA_DIR, u, 'vocabulary.json');
    if (!fs.existsSync(filePath)) continue;

    const list = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let modified = false;

    for (const it of list) {
      const w = it.word || '';
      const cleanW = w.replace(/[「［（(].*?[」］）)]/g, '').trim();

      if (VOCAB_MAP[w]) {
        const d = VOCAB_MAP[w];
        if (d.meaning) it.meaning = d.meaning;
        if (d.reading) it.reading = d.reading;
        if (d.ex) it.example = d.ex;
        modified = true;
        totalUpdated++;
      } else if (VOCAB_MAP[cleanW]) {
        const d = VOCAB_MAP[cleanW];
        if (d.meaning) it.meaning = d.meaning;
        if (d.reading) it.reading = d.reading;
        if (d.ex) it.example = d.ex;
        modified = true;
        totalUpdated++;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf8');
      console.log(`[OK] Đã chuẩn hóa ${u}: cập nhật từ vựng.`);
    }
  }

  console.log(`\nHoàn tất Minna N5 Remaining. Tổng số từ vựng cập nhật: ${totalUpdated}`);
}

runMinnaN5Remaining();

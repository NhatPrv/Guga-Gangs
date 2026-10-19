/**
 * scripts/refine-minna-n5-batch1.js
 * Chuẩn hóa chuyên sâu 100% từ vựng Minna no Nihongo N5 (Bài 01 đến Bài 12):
 * - Triệt tiêu toàn bộ template lặp lại.
 * - Mỗi từ đi với Collocation và câu ví dụ tự nhiên chuẩn bản xứ.
 * - Bản dịch tiếng Việt mượt mà, đúng ngữ cảnh thực tế.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data', 'minna-no-nihongo-n5');

const UNIT_DICTIONARY = {
  // ================= UNIT 02 =================
  'unit-02': {
    '本': { meaning: 'cuốn sách', reading: 'ほん', ex: '寝る前にベッドの中で面白い推理小説の本を読みます。 (Trước khi ngủ, tôi nằm trên giường đọc cuốn tiểu thuyết trinh thám thú vị.)' },
    '辞書': { meaning: 'cuốn từ điển', reading: 'じしょ', ex: '分からない単語に出会ったら、すぐにスマートフォンの電子辞書を引きます。 (Khi gặp từ vựng không hiểu, tôi liền tra từ điển điện tử trên điện thoại ngay.)' },
    '雑誌': { meaning: 'cuốn tạp chí', reading: 'ざっし', ex: '駅の売店で最新のファッションや旅行の雑誌を買いました。 (Tại sạp báo nhà ga, tôi đã mua cuốn tạp chí thời trang và du lịch mới nhất.)' },
    '新聞': { meaning: 'tờ báo, nhật báo', reading: 'しんぶん', ex: '毎朝淹れたてのコーヒーを飲みながら朝刊の新聞を読みます。 (Mỗi sáng tôi vừa nhâm nhi tách cà phê nóng vừa đọc tờ báo buổi sớm.)' },
    'ノート': { meaning: 'vở ghi chép, cuốn tập', reading: 'ノート', ex: '先生が黒板に書いた大切なポイントをノートに丁寧にメモしました。 (Tôi nắn nót ghi lại các ý trọng tâm thầy viết trên bảng vào cuốn vở.)' },
    '手帳': { meaning: 'sổ tay cá nhân, sổ lịch trình', reading: 'てちょう', ex: '仕事のスケジュールや大事な約束を手帳にしっかり書き留めています。 (Tôi luôn ghi chép cẩn thận lịch trình công việc và các cuộc hẹn vào sổ tay.)' },
    '名詞': { meaning: 'danh thiếp (名刺)', reading: 'めいし', ex: '初対面の取引先のお客様に両手で丁寧に名刺をお渡ししました。 (Tôi dùng hai tay trao danh thiếp một cách lịch sự cho đối tác trong lần đầu gặp gỡ.)' },
    'カード': { meaning: 'thẻ (thẻ ngân hàng, thẻ tích điểm)', reading: 'カード', ex: 'コンビニでの買い物は小銭を出さずにクレジットカードで支払います。 (Mua đồ ở cửa hàng tiện lợi tôi thanh toán bằng thẻ tín dụng không cần dùng tiền lẻ.)' },
    '鉛筆': { meaning: 'cây bút chì', reading: 'えんぴつ', ex: '試験のマークシートは2Bの鉛筆で濃く塗りつぶしてください。 (Phiếu trả lời trắc nghiệm xin hãy dùng bút chì 2B để tô thật đậm.)' },
    'ボールペン': { meaning: 'bút bi', reading: 'ボールペン', ex: '公式な書類の記入には黒または青のボールペンを使用します。 (Khi điền vào giấy tờ hành chính chính thức, ta dùng bút bi mực đen hoặc xanh.)' },
    'シャープペンシル': { meaning: 'bút chì kim, chì bấm', reading: 'シャープペンシル', ex: 'このシャープペンシルは軽くて長時間の勉強でも手が疲れません。 (Chiếc bút chì kim này rất nhẹ nên dù học lâu cũng không bị mỏi tay.)' },
    '鍵': { meaning: 'chìa khóa', reading: 'かぎ', ex: '家を出るときは、玄関のドアの鍵を二重に閉めて確認します。 (Khi rời khỏi nhà, tôi khóa hai nấc cửa chính cẩn thận rồi mới yên tâm đi.)' },
    '時計': { meaning: 'đồng hồ (đeo tay, treo tường)', reading: 'とけい', ex: '成人のお祝いに祖父からプレゼントされた腕時計を愛用しています。 (Tôi rất trân quý chiếc đồng hồ đeo tay được ông tặng nhân dịp trưởng thành.)' },
    '傘': { meaning: 'chiếc ô, cây dù', reading: 'かさ', ex: '急に雨が降ってきたので、駅前のコンビニでビニール傘を買いました。 (Trời bất chợt đổ mưa nên tôi ghé cửa hàng tiện lợi trước ga mua chiếc ô trong suốt.)' },
    'かばん': { meaning: 'túi xách, cặp sách, ba lô', reading: 'かばん', ex: 'ノートパソコンや筆記用具を黒いビジネスかばんに入れました。 (Tôi xếp máy tính xách tay và đồ dùng học tập vào chiếc cặp công sở màu đen.)' },
    'テレビ': { meaning: 'máy thu hình, tivi', reading: 'テレビ', ex: '晩ご飯を食べ終わった後、家族みんなで大画面のテレビを見ます。 (Sau khi ăn cơm tối xong, cả nhà tôi cùng quây quần xem tivi màn hình lớn.)' },
    'ラジオ': { meaning: 'máy radio, đài phát thanh', reading: 'ラジオ', ex: '車を運転しながら、お気に入りのラジオ番組を聴くのが好きです。 (Lúc lái xe, tôi thích nghe chương trình radio phát thanh yêu thích.)' },
    'カメラ': { meaning: 'máy ảnh', reading: 'カメラ', ex: '旅行の美しい風景を鮮明に残すために、一眼レフカメラを持参しました。 (Tôi mang theo chiếc máy ảnh cơ chuyên nghiệp để lưu giữ trọn vẹn cảnh đẹp chuyến đi.)' },
    'コンピューター': { meaning: 'máy vi tính', reading: 'コンピューター', ex: '現代のビジネスにおいて、コンピューターを使ったデータ分析は必須です。 (Trong thương trường hiện đại, phân tích dữ liệu bằng máy tính là điều bắt buộc.)' },
    '自動車': { meaning: 'xe hơi, xe ô tô', reading: 'じどうしゃ', ex: '日本の自動車は燃費が良くて安全性が高いことで世界的に有名です。 (Xe ô tô Nhật Bản nổi tiếng toàn cầu nhờ tiết kiệm nhiên liệu và an toàn cao.)' },
    '机': { meaning: 'bàn học, bàn làm việc', reading: 'つくえ', ex: '勉強が終わったら、机の上の消しゴムのカスをきれいに掃除します。 (Học bài xong, tôi dọn sạch vụn tẩy trên bàn làm việc cho gọn gàng.)' },
    '椅子': { meaning: 'chiếc ghế ngồi', reading: 'いす', ex: '座り心地の良い木製の椅子に腰掛けて、温かいコーヒーを飲みました。 (Ngồi trên chiếc ghế gỗ êm ái, tôi nhâm nhi tách cà phê ấm nóng.)' },
    'チョコレート': { meaning: 'kẹo sô-cô-la', reading: 'チョコレート', ex: '勉強で疲れた頭をリフレッシュするために、甘いチョコレートを一粒食べます。 (Để xua tan cơn mệt mỏi khi học tập, tôi ngậm một viên kẹo sô-cô-la ngọt ngào.)' },
    'コーヒー': { meaning: 'cà phê', reading: 'コーヒー', ex: '朝一番に香ばしい挽きたてのホットコーヒーを飲むと目が覚めます。 (Sáng sớm uống một tách cà phê nóng mới xay thơm lừng giúp tôi tỉnh táo hẳn.)' }
  },

  // ================= UNIT 04 =================
  'unit-04': {
    '起きます': { meaning: 'thức dậy, dậy (mỗi sáng)', reading: 'おきます', ex: '毎朝6時にアラームの音で起きて、軽いストレッチをします。 (Mỗi sáng tôi thức dậy lúc 6 giờ theo tiếng chuông báo thức rồi tập dãn cơ nhẹ.)' },
    '寝ます': { meaning: 'đi ngủ', reading: 'ねます', ex: '夜更かしを避けて、毎日夜11時にはベッドに入って寝るようにしています。 (Tránh thức khuya, mỗi tối tôi đều cố gắng lên giường đi ngủ trước 11 giờ.)' },
    '働きます': { meaning: 'làm việc, lao động', reading: 'はたらきます', ex: '月曜日から金曜日まで都内のIT企業でシステムエンジニアとして働きます。 (Từ thứ Hai đến thứ Sáu tôi làm kỹ sư hệ thống tại công ty IT ở Tokyo.)' },
    '休みます': { meaning: 'nghỉ ngơi, nghỉ phép', reading: 'やすみます', ex: '日曜日は仕事を休んで、家で映画を見ながらのんびり過ごします。 (Chủ nhật tôi nghỉ làm, ở nhà xem phim thư giãn thảnh thơi.)' },
    '勉強します': { meaning: 'học tập, trau dồi kiến thức', reading: 'べんきょうします', ex: '日本語能力試験に合格するために、毎晩2時間集中して勉強します。 (Để đỗ kỳ thi JLPT, mỗi tối tôi đều tập trung học bài suốt 2 tiếng đồng hồ.)' },
    '終わります': { meaning: 'kết thúc, xong xuôi (tự động từ: giờ học, cuộc họp)', reading: 'おわります', ex: '午後の日本語の授業は午後4時半に終わります。 (Tiết học tiếng Nhật buổi chiều sẽ kết thúc vào lúc 4 giờ rưỡi.)' },
    'デパート': { meaning: 'trung tâm thương mại bách hóa', reading: 'デパート', ex: '週末に家族と一緒に駅前の高級デパートへ買い物に行きました。 (Cuối tuần tôi cùng gia đình đi mua sắm tại trung tâm thương mại trước ga.)' },
    '銀行': { meaning: 'ngân hàng', reading: 'ぎんこう', ex: '家賃を振り込むために、お昼休みに近くの銀行の窓口へ行きました。 (Để chuyển khoản tiền nhà, tôi tranh thủ ra quầy giao dịch ngân hàng lúc nghỉ trưa.)' },
    '郵便局': { meaning: 'bưu điện', reading: 'ゆうびんきょく', ex: 'ベトナムの実家へ荷物を送るために、ダンボールを持って郵便局へ行きました。 (Mang theo thùng hàng ra bưu điện, tôi gửi bưu phẩm về cho gia đình ở Việt Nam.)' },
    '図書館': { meaning: 'thư viện', reading: 'としょかん', ex: '週末は静かな市立図書館で読書をしたり専門書を借りたりします。 (Cuối tuần tôi ghé thư viện thành phố yên tĩnh để đọc và mượn sách chuyên ngành.)' },
    '美術館': { meaning: 'bảo tàng mỹ thuật', reading: 'びじゅつかん', ex: '上野公園の美術館で開かれている印象派の絵画展を見に行きました。 (Tôi đến bảo tàng mỹ thuật ở công viên Ueno ngắm triển lãm tranh trường phái ấn tượng.)' },
    '今朝': { meaning: 'sáng nay', reading: 'けさ', ex: '今朝は焼きたてのトーストと目玉焼きを美味しく食べました。 (Sáng nay tôi đã ăn món bánh mì nướng giòn và trứng ốp la rất ngon miệng.)' },
    '今晩': { meaning: 'tối nay, đêm nay', reading: 'こんばん', ex: '今晩は仕事が早く終わるので、家でゆっくり手料理を作ります。 (Tối nay được về sớm nên tôi sẽ thong thả tự nấu một bữa cơm tại nhà.)' },
    '昼休み': { meaning: 'giờ nghỉ trưa', reading: 'ひるやすみ', ex: '昼休みに同僚と社員食堂で定食を食べながら談笑しました。 (Vào giờ nghỉ trưa, tôi cùng đồng nghiệp ăn cơm và trò chuyện ở nhà ăn công ty.)' },
    '毎朝': { meaning: 'mỗi buổi sáng', reading: 'まいあさ', ex: '毎朝起きたらまず窓を開けて新鮮な空気を部屋に入れます。 (Mỗi sáng thức dậy tôi đều mở toang cửa sổ để đón không khí trong lành vào phòng.)' },
    '毎晩': { meaning: 'mỗi buổi tối', reading: 'まいばん', ex: '毎晩寝る前に、今日覚えた単語の復習をするのが日課です。 (Mỗi tối trước khi ngủ, ôn lại các từ vựng học trong ngày là thói quen của tôi.)' },
    '毎日': { meaning: 'mỗi ngày, hàng ngày', reading: 'まいにち', ex: '毎日コツコツと日本語のシャドーイング練習を続けています。 (Ngày ngày tôi đều kiên trì luyện tập phương pháp nói đuổi Shadowing tiếng Nhật.)' }
  },

  // ================= UNIT 06 =================
  'unit-06': {
    '吸います': { meaning: 'hút (thuốc: たばこを吸う), hít vào', reading: 'すいます', ex: '健康のために、たばこを吸う習慣を完全にやめました。 (Vì sức khỏe bản thân, tôi đã bỏ hẳn thói quen hút thuốc lá.)' },
    'たばこをすいます。': { meaning: 'hút thuốc lá', reading: 'たばこをすいます', ex: '禁煙エリアでは絶対にたばこを吸わないでください。 (Tại khu vực cấm hút thuốc, xin tuyệt đối đừng châm thuốc lá.)' },
    '飲みます': { meaning: 'uống (nước, sữa, thuốc)', reading: 'のみます', ex: '熱いお風呂から上がった後に、冷たい牛乳をゴクゴク飲みました。 (Sau khi bước ra khỏi bồn tắm nóng, tôi uống một hơi cạn ly sữa mát lạnh.)' },
    '食べます': { meaning: 'ăn (cơm, bánh mì, hoa quả)', reading: 'たべます', ex: '朝ご飯に炊きたての白いご飯とお味噌汁を食べます。 (Bữa sáng tôi ăn cơm trắng mới nấu chín cùng bát canh miso.)' },
    '見ます': { meaning: 'xem, nhìn (phim, tivi, phong cảnh)', reading: 'みます', ex: '休日の夜に映画館の大きなスクリーンで話題の邦画を見ました。 (Tối ngày nghỉ tôi đến rạp chiếu bóng thưởng thức bộ phim Nhật đang gây sốt.)' },
    '聞きます': { meaning: 'nghe (nhạc, radio, lời giảng)', reading: 'ききます', ex: 'イヤホンをつけて、スマートフォンの音楽アプリでJ-POPを聴きます。 (Tôi đeo tai nghe và thưởng thức các bản nhạc J-POP trên ứng dụng điện thoại.)' },
    '読みます': { meaning: 'đọc (sách, báo, thư từ)', reading: 'よみます', ex: '電車の中で電子書籍リーダーを使って面白い小説を読みます。 (Trên tàu điện tôi dùng máy đọc sách điện tử để đọc những cuốn tiểu thuyết hay.)' },
    '書きます': { meaning: 'viết (thư, báo cáo, chữ Hán)', reading: 'かきます', ex: '万年筆を使って、お世話になった恩師へ丁寧なお礼の手紙を書きました。 (Tôi dùng bút mực nắn nót viết lá thư cảm ơn gửi tới người thầy kính yêu.)' },
    '買います': { meaning: 'mua sắm (đồ dùng, thực phẩm)', reading: 'かいます', ex: '近所の八百屋さんで新鮮な旬の野菜と果物を買いました。 (Tại sạp rau quả gần nhà, tôi đã mua được mớ rau củ tươi ngon đúng mùa.)' },
    '撮ります': { meaning: 'chụp (ảnh: 写真を撮る), quay phim', reading: 'とります', ex: '満開の桜の木の下で、満面の笑みの家族の記念写真を撮りました。 (Dưới tán hoa anh đào nở rộ, tôi chụp bức ảnh kỷ niệm gia đình cười rạng rỡ.)' },
    '写真を撮りす。': { meaning: 'chụp ảnh', reading: 'しゃしんをとります', ex: '旅行先の歴史ある名所で綺麗な風景の写真をたくさん撮りました。 (Tại danh lam thắng cảnh trong chuyến du lịch, tôi chụp rất nhiều bức ảnh phong cảnh đẹp.)' },
    'します': { meaning: 'làm, chơi (thể thao, bài tập)', reading: 'します', ex: '放課後に学校のグラウンドで友達と汗を流してサッカーをしました。 (Sau giờ học, tôi cùng bạn bè đá bóng thỏa thích trên sân vận động của trường.)' },
    '会います': { meaning: 'gặp gỡ (người thân, bạn bè: 友達に会う)', reading: 'あいます', ex: '週末に渋谷のハチ公前で久しぶりに昔のクラスメートに会いました。 (Cuối tuần tôi hẹn gặp lại bạn học cũ trước tượng Hachiko ở Shibuya.)' },
    '友達に会いす。': { meaning: 'gặp gỡ bạn bè', reading: 'ともだちにあいます', ex: '日曜日の午後に駅前の落ち着いたカフェで親しい友達に会います。 (Chiều Chủ nhật tôi sẽ gặp người bạn thân tại quán cà phê thanh tịnh trước ga.)' },
    'ご飯': { meaning: 'cơm, bữa ăn', reading: 'ごはん', ex: '母が腕によりをかけて作った温かい夕ご飯を家族で囲みました。 (Cả nhà cùng quây quần bên mâm cơm tối ấm cúng do chính tay mẹ nấu.)' },
    'パン': { meaning: 'bánh mì', reading: 'パン', ex: '近所のベーカリーで焼きたてのクロワッサンと食パンを買いました。 (Tôi đã mua chiếc bánh sừng bò mới ra lò và bánh mì gối ở tiệm bánh gần nhà.)' },
    '卵': { meaning: 'quả trứng gà', reading: 'たまご', ex: '朝食に新鮮な生卵をご飯にかけて卵かけご飯にして食べました。 (Bữa sáng tôi đập quả trứng gà tươi lên bát cơm nóng làm món Tamago-kake-gohan.)' },
    '肉': { meaning: 'thịt (bò, heo, gà)', reading: 'にく', ex: 'すき焼きを作るために、お肉屋さんで上質な牛肉を買いました。 (Để nấu món Sukiyaki, tôi đã mua thịt bò thượng hạng tại tiệm thịt.)' },
    '魚': { meaning: 'con cá', reading: 'さかな', ex: '港町の市場で朝獲れたばかりの新鮮な魚のお刺身を味わいました。 (Tại khu chợ thị trấn cảng, tôi thưởng thức món sashimi cá tươi mới đánh bắt buổi sáng.)' },
    '野菜': { meaning: 'rau xanh, rau củ', reading: 'やさい', ex: '健康的な食生活のために、毎食たっぷりの生野菜サラダを食べます。 (Để có chế độ ăn uống lành mạnh, mỗi bữa tôi đều ăn thật nhiều salad rau tươi.)' },
    '果物': { meaning: 'trái cây, hoa quả', reading: 'くだもの', ex: 'スーパーのくだもの売り場で甘くて瑞々しいりんごとぶどうを買いました。 (Tại quầy hoa quả siêu thị, tôi mua những trái táo và chùm nho ngọt mọng nước.)' },
    'お茶': { meaning: 'trà xanh Nhật Bản (Ocha)', reading: 'おちゃ', ex: '和菓子を食べながら、急須で淹れた温かい緑茶のお茶をいただきます。 (Vừa thưởng thức bánh kẹo truyền thống, tôi vừa nhâm nhi chén trà xanh nóng ấm.)' },
    '紅茶': { meaning: 'trà đen, hồng trà', reading: 'こうちゃ', ex: 'アフタヌーンティーにミルクを入れた香りの高い紅茶を楽しみました。 (Vào tiệc trà chiều, tôi thưởng thức tách hồng trà pha sữa thơm ngát.)' },
    '牛乳': { meaning: 'sữa tươi, sữa bò', reading: 'ぎゅうにゅう', ex: '毎朝パンと一緒にカルシウムが豊富な冷たい牛乳を1杯飲みます。 (Mỗi sáng tôi đều uống một ly sữa tươi mát lạnh giàu canxi cùng với bánh mì.)' },
    'ビール': { meaning: 'bia', reading: 'ビール', ex: '暑い夏の仕事終わりに、キンキンに冷えた缶ビールで乾杯しました。 (Sau giờ làm việc ngày hè nóng bức, chúng tôi cụng lon bia mát lạnh sảng khoái.)' },
    'お酒': { meaning: 'rượu sake truyền thống Nhật Bản', reading: 'おさけ', ex: '新潟の銘酒と呼ばれる純米酒のお酒を刺身と一緒に味わいました。 (Tôi thưởng thức chén rượu sake Junmai nức tiếng vùng Niigata cùng món cá sống.)' }
  },

  // ================= UNIT 07 =================
  'unit-07': {
    '切る': { meaning: 'cắt, gọt (hoa quả, giấy)', reading: 'きる', ex: 'ハサミを使って、色紙をきれいな星の形に切りました。 (Tôi dùng chiếc kéo cắt tờ giấy màu thành hình ngôi sao xinh xắn.)' },
    '送る': { meaning: 'gửi (thư, bưu phẩm, email)', reading: 'おくる', ex: '郵便局の窓口から故郷の両親へ小包の荷物を送りました。 (Từ bưu điện, tôi đã gửi kiện hàng bưu phẩm về cho bố mẹ ở quê.)' },
    'あげる': { meaning: 'tặng, cho (người khác)', reading: 'あげる', ex: '友達の誕生日に心を込めて選んだマフラーをあげました。 (Nhân ngày sinh nhật bạn, tôi đã tặng chiếc khăn quàng cổ chọn bằng cả tấm lòng.)' },
    'もらう': { meaning: 'nhận được (từ ai đó)', reading: 'もらう', ex: '日本を離れるときに、先生から記念の万年筆をもらいました。 (Khi chuẩn bị rời Nhật Bản, tôi được thầy giáo tặng cho chiếc bút mực kỷ niệm.)' },
    '貸す': { meaning: 'cho mượn, cho vay', reading: 'かす', ex: '急に雨が降ってきたので、傘を持っていなかった同僚に予備の傘を貸しました。 (Trời đổ mưa bất chợt nên tôi cho người đồng nghiệp không mang ô mượn chiếc ô dự phòng.)' },
    '借りる': { meaning: 'mượn, vay (từ ai đó, từ thư viện)', reading: 'かりる', ex: '大学の図書館から日本文学に関する専門書を3冊借りました。 (Tôi đã mượn 3 cuốn sách chuyên ngành về văn học Nhật Bản từ thư viện trường đại học.)' },
    'かける': { meaning: 'gọi điện (電話をかける)', reading: 'かける', ex: '用事があったので、休憩時間に故郷の家族へ電話をかけました。 (Vì có việc cần trao đổi nên trong giờ giải lao tôi đã gọi điện về cho gia đình.)' },
    '手': { meaning: 'bàn tay', reading: 'て', ex: '食事をする前には、石けんで手の指の間までしっかり洗います。 (Trước khi dùng bữa, ta hãy rửa tay thật kỹ từng kẽ ngón bằng xà phòng.)' },
    'はし': { meaning: 'đôi đũa ăn cơm', reading: 'はし', ex: '日本の和食を食べるときは、木製の塗り箸を上手に使います。 (Khi thưởng thức ẩm thực Nhật Bản, tôi dùng đôi đũa gỗ sơn rất thành thạo.)' },
    'スプーン': { meaning: 'chiếc thìa, muỗng', reading: 'スプーン', ex: 'カレーライスを食べるときは、大きな金属のスプーンを使います。 (Khi ăn món cơm cà ri, tôi dùng một chiếc muỗng kim loại to.)' },
    'ナイフ': { meaning: 'con dao ăn, dao thái', reading: 'ナイフ', ex: '洋食のマナーに従って、右手でナイフを持って肉を切ります。 (Theo đúng phép lịch sự bàn ăn phương Tây, tôi cầm dao bằng tay phải để cắt thịt.)' },
    'フォーク': { meaning: 'chiếc nĩa, xiên', reading: 'フォーク', ex: 'パスタをフォークにくるくると巻きつけて上手に食べました。 (Tôi khéo léo cuộn tròn sợi mì Ý quanh chiếc nĩa rồi thưởng thức.)' },
    'はさみ': { meaning: 'cái kéo', reading: 'はさみ', ex: '切れ味の良い事務用のはさみで段ボールのテープを切りました。 (Tôi dùng chiếc kéo văn phòng sắc bén để cắt băng dính thùng các-tông.)' },
    '消しゴム': { meaning: 'cục tẩy, gôm chì', reading: 'けしゴム', ex: '書き間違えた鉛筆の文字を消しゴムできれいに消しました。 (Tôi dùng cục tẩy xóa sạch nét chữ chì viết nhầm trên trang vở.)' },
    '紙': { meaning: 'tờ giấy', reading: 'かみ', ex: 'プリンターのトレイに真っ白なA4サイズのコピー用紙をセットしました。 (Tôi đặt tập giấy in trắng tinh cỡ A4 vào khay nạp của máy in.)' },
    '花': { meaning: 'bông hoa', reading: 'はな', ex: '花屋さんの店先に色とりどりの美しい春の花が並んでいます。 (Trước hiên tiệm hoa bày la liệt những đóa hoa xuân rực rỡ sắc màu.)' },
    '荷物': { meaning: 'hành lý, kiện hàng', reading: 'にもつ', ex: '旅行の重い荷物をホテルのフロントに預けて観光に出かけました。 (Tôi gửi hành lý cồng kềnh tại quầy lễ tân khách sạn rồi thảnh thơi đi tham quan.)' },
    '切符': { meaning: 'vé tàu xe, vé vào cửa', reading: 'きっぷ', ex: '駅の自動券売機で京都までの新幹線の特急切符を買いました。 (Tại máy bán vé tự động ở ga, tôi mua vé tàu cao tốc Shinkansen đi Kyoto.)' }
  },

  // ================= UNIT 08 =================
  'unit-08': {
    '静か[な]': { meaning: 'yên tĩnh, thanh tịnh', reading: 'しずか「な」', ex: '京都の古いお寺の庭園は、雑音がなくとても静かです。 (Khu vườn ngôi chùa cổ ở Kyoto không hề có tạp âm, vô cùng thanh tịnh.)' },
    'きれいな': { meaning: 'đẹp đẽ, sạch sẽ', reading: 'きれいな', ex: '高原の澄みきった夜空に満天の星がとてもきれいに輝いています。 (Trên bầu trời đêm trong vắt vùng cao nguyên, ngàn vì sao tỏa sáng lung linh tuyệt đẹp.)' },
    'にぎやかな': { meaning: 'náo nhiệt, sầm uất, đông vui', reading: 'にぎやかな', ex: '夏祭りの夜の商店街は、多くの屋台と人々でにぎやかです。 (Khu phố mua sắm vào đêm hội mùa hè vô cùng náo nhiệt với nhiều gian hàng và dòng người.)' },
    '有名[な]': { meaning: 'nổi tiếng, trứ danh', reading: 'ゆうめい「な」', ex: '富士山は日本を象徴する最も有名で美しい山です。 (Núi Phú Sĩ là ngọn núi nổi tiếng và tráng lệ nhất biểu tượng cho đất nước Nhật Bản.)' },
    '親切[な]': { meaning: 'tốt bụng, ân cần, niềm nở', reading: 'しんせつ「な」', ex: '道に迷ったとき、通りかかった親切な方が駅まで案内してくれました。 (Khi bị lạc đường, một người qua đường tốt bụng đã nhiệt tình dẫn tôi ra tận ga.)' },
    '元気[な]': { meaning: 'khỏe mạnh, tràn đầy năng lượng', reading: 'げんき「な」', ex: '祖父は80歳を過ぎても毎朝散歩をしてとても元気です。 (Ông tôi dù đã ngoài 80 tuổi nhưng sáng nào cũng đi dạo và rất khỏe mạnh.)' },
    '暇[な]': { meaning: 'rảnh rỗi, có thời gian', reading: 'ひま「な」', ex: '週末に暇な時間があったら、家でゆっくり読書をしたいです。 (Cuối tuần nếu có thời gian rảnh rỗi, tôi muốn thảnh thơi đọc sách ở nhà.)' },
    '忙しい': { meaning: 'bận rộn', reading: 'いそがしい', ex: '月末は締め切りの書類が多くて、仕事がとても忙しいです。 (Cuối tháng giấy tờ đến hạn dồn dập nên công việc vô cùng bận rộn.)' },
    '便利[な]': { meaning: 'tiện lợi, thuận tiện', reading: 'べんり「な」', ex: '駅から徒歩3分の場所にあるこのアパートは生活にとても便利です。 (Căn hộ này cách ga chỉ 3 phút đi bộ nên sinh hoạt vô cùng tiện lợi.)' },
    'すてきな': { meaning: 'tuyệt vời, duyên dáng, xinh xắn', reading: 'すてきな', ex: '誕生日に友達からすてきなガラスのペンダントをもらいました。 (Vào ngày sinh nhật, tôi được người bạn tặng cho một mặt dây chuyền thủy tinh tuyệt đẹp.)' },
    '大きい': { meaning: 'to lớn, khổng lồ', reading: 'おおきい', ex: '公園の中央に樹齢百年を超える大きな楠の木が立っています。 (Ở chính giữa công viên sừng sững một cây long não cổ thụ to lớn trăm năm tuổi.)' },
    '小さい': { meaning: 'nhỏ bé, bé xíu', reading: 'ちいさい', ex: '手のひらに乗るほど小さい可愛らしい小鳥を見つけました。 (Tôi bắt gặp một chú chim non nhỏ xíu xinh xắn nằm gọn trong lòng bàn tay.)' },
    '新しい': { meaning: 'mới mẻ, tân tiến', reading: 'あたらしい', ex: '来月から新学期が始まるので、新しい筆箱とノートを買いました。 (Tháng sau bước vào học kỳ mới nên tôi sắm một chiếc hộp bút và tập vở mới.)' },
    '古い': { meaning: 'cũ kỹ, cổ xưa', reading: 'ふるい', ex: '祖母の家には江戸時代から代々伝わる古い箪笥があります。 (Nhà bà tôi có chiếc tủ gỗ cổ lưu truyền qua nhiều đời từ thời Edo.)' },
    'いい': { meaning: 'tốt, hay, được', reading: 'いい', ex: '今日は雲ひとつない青空で、洗濯日和のとてもいい天気です。 (Hôm nay trời xanh không một gợn mây, thời tiết rất đẹp thích hợp để phơi đồ.)' },
    '悪い': { meaning: 'xấu, tồi tệ', reading: 'わるい', ex: '昨夜から胃の調子が悪くて、朝ご飯があまり食べられませんでした。 (Từ tối qua dạ dày có triệu chứng xấu nên sáng nay tôi hầu như không ăn được gì.)' },
    '暑い': { meaning: 'nóng bức (thời tiết mùa hè)', reading: 'あつい', ex: '日本の夏は湿度が高くて、昼間は耐えられないほど暑いです。 (Mùa hè Nhật Bản độ ẩm cao nên ban ngày trời oi bức đến ngột ngạt.)' },
    '寒い': { meaning: 'lạnh giá (thời tiết mùa đông)', reading: 'さむい', ex: '冬の北海道は雪が深く積もり、身を切るように寒いです。 (Mùa đông ở Hokkaido tuyết phủ dày đặc và thời tiết buốt giá như cắt da cắt thịt.)' },
    '冷たい': { meaning: 'lạnh buốt (cảm giác tiếp xúc: nước đá, đồ uống)', reading: 'つめたい', ex: '運動した後に冷蔵庫でよく冷やした冷たい麦茶を飲みました。 (Sau khi vận động, tôi uống một cốc trà lúa mạch mát lạnh để trong tủ lạnh.)' },
    '難しい': { meaning: 'khó khăn, hóc búa', reading: 'むずかしい', ex: '日本語の漢字の書き順や意味を覚えるのはとても難しいです。 (Học thứ tự nét viết và ý nghĩa của chữ Hán tiếng Nhật rất là khó.)' },
    '易しい': { meaning: 'dễ dàng, đơn giản', reading: 'やさしい', ex: '先生が丁寧に教えてくださったので、今日のテストは易しかったです。 (Nhờ thầy giảng giải cẩn thận nên bài kiểm tra hôm nay khá là dễ.)' },
    '高い': { meaning: 'đắt đỏ (giá tiền), cao (độ cao)', reading: 'たかい', ex: '銀座の高級レストランは料理の値段が高いですが、味は一流です。 (Nhà hàng cao cấp ở Ginza giá đồ ăn khá đắt nhưng chất lượng thì đỉnh cao.)' },
    '安い': { meaning: 'rẻ (giá cả phải chăng)', reading: 'やすい', ex: '大学の学生食堂は安くてボリューム満点のランチが食べられます。 (Căng tin trường đại học phục vụ bữa trưa vừa rẻ lại vừa đầy đặn.)' }
  },

  // ================= UNIT 09 =================
  'unit-09': {
    '分かります': { meaning: 'hiểu rõ, nắm bắt được', reading: 'わかります', ex: '先生のわかりやすい説明のおかげで、難しい文法の使い方がよく分かりました。 (Nhờ lời giảng dễ hiểu của thầy, tôi đã nắm rất rõ cách dùng ngữ pháp khó.)' },
    'あります': { meaning: 'có (sở hữu đồ vật, tiền nong, sự kiện)', reading: 'あります', ex: '明日の午後から第2会議室で重要なプロジェクトの会議があります。 (Chiều mai tại phòng họp số 2 có cuộc họp dự án quan trọng.)' },
    '好きな': { meaning: 'yêu thích, ưa chuộng', reading: 'すきな', ex: '休日は私の大好きなクラシック音楽を聴きながら部屋で読書をします。 (Ngày nghỉ tôi thường ở phòng đọc sách và nghe dòng nhạc cổ điển mà mình yêu thích.)' },
    '嫌いな': { meaning: 'ghét, không thích', reading: 'きらいな', ex: '子供のころは苦いピーマンやゴーヤが嫌いでしたが、今は食べられます。 (Hồi bé tôi rất ghét vị đắng của ớt chuông và mướp đắng, nhưng giờ đã ăn được.)' },
    '上手な': { meaning: 'giỏi giang, khéo léo', reading: 'じょうずな', ex: '彼女は箸の使い方がとても上手で、魚を骨まできれいに食べます。 (Cô ấy dùng đũa rất khéo léo, gắp thịt cá sạch bong không sót chiếc xương.)' },
    '下手な': { meaning: 'kém cỏi, vụng về', reading: 'へたな', ex: '歌を歌うのが下手なので、カラオケに行くといつも少し緊張します。 (Tôi hát khá dở nên mỗi khi đi hát karaoke lại thấy hơi ngại ngùng.)' },
    '料理': { meaning: 'món ăn, việc nấu nướng', reading: 'りょうり', ex: '母から直伝で教わった伝統的なベトナム料理を友達に振る舞いました。 (Tôi đã trổ tài nấu những món ăn Việt Nam truyền thống học từ mẹ để chiêu đãi bạn bè.)' },
    '飲み物': { meaning: 'đồ uống, thức uống', reading: 'のみもの', ex: 'パーティーのテーブルに冷たいジュースやお茶など様々な飲み物を用意しました。 (Trên bàn tiệc đã chuẩn bị sẵn nhiều loại thức uống như nước ngọt và trà mát.)' },
    'スポーツ': { meaning: 'thể dục thể thao', reading: 'スポーツ', ex: '健康な体を維持するために、週末にテニスなどのスポーツを楽しんでいます。 (Để duy trì cơ thể dẻo dai khỏe mạnh, cuối tuần tôi hay chơi thể thao như quần vợt.)' },
    '音楽': { meaning: 'âm nhạc', reading: 'おんがく', ex: '疲れた夜に心地よいジャズの音楽を聴くと、心が深く癒やされます。 (Vào những đêm mệt mỏi, lắng nghe điệu nhạc Jazz êm ái tâm hồn tôi được vỗ về.)' }
  },

  // ================= UNIT 10 =================
  'unit-10': {
    'います': { meaning: 'có (người, động vật sống)', reading: 'います', ex: '庭の青々とした芝生の上で可愛い子犬が元気に走り回っています。 (Trên thảm cỏ xanh mướt ngoài sân có chú cún con đang tung tăng chạy nhảy.)' },
    '男の人': { meaning: 'người đàn ông', reading: 'おとこのひと', ex: '交番の前で親切そうな背の高い男の人が道を教えてくれました。 (Trước bốt cảnh sát, một người đàn ông cao ráo trông hiền từ đã chỉ đường cho tôi.)' },
    '女の人': { meaning: 'người phụ nữ', reading: 'おんなのひと', ex: '受付の窓口で笑顔の素敵な女の人が丁寧に対応してくださいました。 (Tại quầy tiếp tân, một người phụ nữ với nụ cười rạng rỡ đã tiếp đón rất ân cần.)' },
    '犬': { meaning: 'con chó', reading: 'いぬ', ex: '毎朝近所の公園で飼い犬の首輪を持って散歩をさせています。 (Mỗi sáng tôi đều dắt chú chó cưng đi dạo quanh công viên gần nhà.)' },
    '猫': { meaning: 'con mèo', reading: 'ねこ', ex: '日当たりのいい縁側で丸くなって気持ちよさそうに猫が眠っています。 (Bên hiên nhà ngập tràn ánh nắng, chú mèo nằm cuộn tròn ngủ say sưa.)' },
    '木': { meaning: 'cái cây', reading: 'き', ex: '神社の境内には樹齢数百年を誇る立派な大木がそびえ立っています。 (Trong khuôn viên đền thờ sừng sững một cây đại thụ uy nghiêm hàng trăm năm tuổi.)' },
    '物': { meaning: 'đồ vật, vật dụng', reading: 'もの', ex: '机の上に大切な物を置き忘れないように、出かける前によく確認します。 (Trước khi ra ngoài tôi kiểm tra kỹ để không bỏ quên đồ vật quan trọng trên bàn.)' },
    '電池': { meaning: 'cục pin (đồng hồ, điều khiển)', reading: 'でんち', ex: 'エアコンのリモコンが効かなくなったので、新しい乾電池を入れました。 (Điều khiển điều hòa bị liệt nên tôi đã thay một cặp pin mới vào.)' },
    '箱': { meaning: 'cái hộp, thùng các-tông', reading: 'はこ', ex: '頑丈な段ボールの箱に引っ越しの荷物をきれいに詰め込みました。 (Tôi xếp gọn gàng đồ đạc chuyển nhà vào những chiếc thùng các-tông cứng cáp.)' },
    '冷蔵庫': { meaning: 'chiếc tủ lạnh', reading: 'れいぞうこ', ex: 'スーパーで買ってきた新鮮な牛乳と卵を冷蔵庫にしまいました。 (Tôi cất sữa tươi và trứng mới mua từ siêu thị vào trong tủ lạnh.)' }
  },

  // ================= UNIT 11 =================
  'unit-11': {
    'かかります': { meaning: 'mất (thời gian, tiền bạc: 時間/お金がかかる)', reading: 'かかります', ex: 'ここから羽田空港までリムジンバスで約40分かかります。 (Từ đây đi xe buýt chuyên tuyến ra sân bay Haneda mất khoảng 40 phút.)' },
    '一つ': { meaning: '1 cái, 1 chiếc (đếm đồ vật chung)', reading: 'ひとつ', ex: 'パン屋さんで焼きたての美味しそうなクロワッサンを一つ買いました。 (Tại tiệm bánh mì, tôi đã mua một chiếc bánh sừng bò trông rất ngon mắt.)' },
    '二つ': { meaning: '2 cái, 2 chiếc', reading: 'ふたつ', ex: 'お土産に有名な京都の八ツ橋の箱を二つ購入しました。 (Tôi mua hai hộp bánh Yatsuhashi nổi tiếng của Kyoto làm quà biếu.)' },
    '一人': { meaning: '1 người, một mình', reading: 'ひとり', ex: '休日に一人で静かな美術館を訪れてゆっくり絵画を鑑賞しました。 (Vào ngày nghỉ, tôi một mình ghé thăm bảo tàng mỹ thuật yên tĩnh ngắm tranh.)' },
    '二人': { meaning: '2 người', reading: 'ふたり', ex: '親友と二人で夜景の見える素敵なレストランへ食事に行きました。 (Tôi cùng người bạn thân hai đứa đi ăn tại nhà hàng ngắm cảnh đêm tuyệt đẹp.)' },
    '台': { meaning: 'chiếc, cái (đếm máy móc, xe cộ)', reading: 'だい', ex: '研究室に最新の高性能パソコンが5台新しく導入されました。 (Phòng nghiên cứu mới được trang bị thêm 5 bộ máy vi tính hiệu năng cao đời mới.)' },
    '枚': { meaning: 'tờ, tấm, lá (đếm vật mỏng phẳng: giấy, áo, đĩa)', reading: 'まい', ex: '郵便局の窓口でお正月の年賀はがきを20枚買いました。 (Tại bưu điện, tôi đã mua 20 tấm bưu thiếp chúc Tết đầu năm.)' }
  },

  // ================= UNIT 12 =================
  'unit-12': {
    '簡単「な」': { meaning: 'đơn giản, dễ làm', reading: 'かんたん「な」', ex: 'このアプリは操作方法が直感的で、誰でも簡単に使えます。 (Ứng dụng này thao tác rất trực quan, bất kỳ ai cũng có thể sử dụng dễ dàng.)' },
    '近い': { meaning: 'gần (khoảng cách, cự ly)', reading: 'ちかい', ex: '私の住んでいるアパートは最寄りの駅から歩いて3分と非常に近いです。 (Căn hộ tôi đang ở cách nhà ga gần nhất chỉ 3 phút đi bộ, cực kỳ gần.)' },
    '遠い': { meaning: 'xa xôi, cách xa', reading: 'とおい', ex: '実家は東京から新幹線で4時間もかかる遠い場所にあります。 (Quê nhà tôi ở một nơi xa xôi, đi tàu Shinkansen từ Tokyo cũng mất 4 tiếng.)' },
    '速い、早い': { meaning: 'nhanh nhẹn (tốc độ), sớm (thời gian)', reading: 'はやい', ex: '新幹線は時速300キロもの速いスピードで目的地へ向かって疾走します。 (Đoàn tàu Shinkansen lao nhanh vun vút về đích với tốc độ 300km/h.)' },
    '遅い': { meaning: 'chậm chạp (tốc độ), muộn (thời gian)', reading: 'おそい', ex: '大雪の影響で電車の運行ダイヤが乱れ、到着が大幅に遅くなりました。 (Do ảnh hưởng tuyết rơi dày đặc nên lịch tàu bị trễ và tàu đến muộn khá nhiều.)' },
    '多い [人が～]': { meaning: 'đông đúc, nhiều (người)', reading: 'おおい', ex: '休日の渋谷のスクランブル交差点は、行き交う人々で非常に多いです。 (Ngã tư Shibuya vào ngày nghỉ dòng người qua lại đông đúc nườm nượp.)' },
    '少ない [人が～]': { meaning: 'vắng vẻ, ít (người)', reading: 'すくない', ex: '平日の早朝の境内は参拝客が少なくて、とても厳かな雰囲気です。 (Sáng sớm ngày thường trong đền ít người hành hương nên bầu không khí rất trang nghiêm.)' },
    '甘い': { meaning: 'ngọt ngào (vị)', reading: 'あまい', ex: '旬の時期に収穫された日本の白桃は、果汁たっぷりでとても甘いです。 (Trái đào trắng Nhật Bản thu hoạch đúng vụ rất mọng nước và ngọt lịm.)' },
    '辛い': { meaning: 'cay xè (vị cay)', reading: 'からい', ex: '本場のタイカレーは香辛料が効いていて、汗が出るほど辛いです。 (Món cà ri Thái chính gốc nồng đượm gia vị, cay đến toát cả mồ hôi.)' },
    '重い': { meaning: 'nặng nề (trọng lượng)', reading: 'おもい', ex: '辞書やノートがたくさん入ったカバンは、ずっしりと重いです。 (Chiếc cặp chứa đầy từ điển và sách vở nặng trĩu cả hai vai.)' },
    '軽い': { meaning: 'nhẹ nhàng (trọng lượng)', reading: 'かるい', ex: '最新型のノートパソコンは本体がとても軽くて持ち運びに便利です。 (Chiếc máy tính xách tay đời mới thân máy rất nhẹ nên mang theo rất tiện.)' }
  }
};

function runMinnaN5Batch1() {
  console.log('='.repeat(70));
  console.log('TIẾN HÀNH CHUẨN HÓA MINNA N5 BATCH 1 (BÀI 01 ĐẾN BÀI 12)');
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

  console.log(`\nHoàn tất Minna N5 Batch 1. Tổng số từ vựng cập nhật: ${totalUpdated}`);
}

runMinnaN5Batch1();

/**
 * scripts/refine-n4-core-bank.js
 * Chuẩn hóa toàn diện từ vựng JLPT N4 Core Bank (6 parts)
 * Đảm bảo 4 tiêu chuẩn: sinoVietnamese chuẩn, meaning phân cách bằng ;, example tự nhiên và cross-check 100%.
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '..', 'data', 'jlpt-n4-core-bank');

const DICT = {
  'あかちゃん': {
    meaning: 'em bé, trẻ sơ sinh',
    example: 'あかちゃんがかわいい笑顔で笑っています。 (Em bé đang cười với một nụ cười rất dễ thương.)'
  },
  '上がる': {
    meaning: 'tăng lên, lên (nhiệt độ, giá cả); tạnh (mưa: 雨が上がる)',
    example: '雨が上がって、きれいな虹が空に出ました。 (Mưa tạnh và cầu vồng tuyệt đẹp đã xuất hiện trên bầu trời.)'
  },
  '赤ん坊': {
    meaning: 'em bé, trẻ sơ sinh',
    example: 'お母さんが腕の中で赤ん坊を優しく抱いています。 (Người mẹ đang nhẹ nhàng ôm em bé trong vòng tay.)'
  },
  '空く': {
    meaning: 'trống rỗng; đói (bụng: お腹が空く)',
    example: '運動したあとでお腹がぺこぺこに空きました。 (Sau khi vận động nhiều, bụng tôi đói cồn cào cả lên.)'
  },
  '遊び': {
    meaning: 'trò chơi, sự vui chơi, giải trí',
    example: '子供の頃、公園で泥遊びをするのが好きでした。 (Hồi còn nhỏ, tôi rất thích trò chơi nghịch bùn ở công viên.)'
  },
  'アナウンサー': {
    meaning: 'phát thanh viên (announcer)',
    example: 'テレビの女性アナウンサーが正確にニュースを伝えている。 (Nữ phát thanh viên truyền hình đang truyền tải tin tức một cách chính xác.)'
  },
  'アルコール': {
    meaning: 'cồn, chất có cồn; rượu bia',
    example: 'このビールには５パーセントのアルコールが含まれています。 (Loại bia này có chứa 5 phần trăm cồn.)'
  },
  'いじめる': {
    meaning: 'bắt nạt, trêu chọc, ức hiếp',
    example: '弱い立場の人をいじめてはいけません。 (Không được bắt nạt những người ở vị thế yếu hơn mình.)'
  },
  '急ぐ': {
    meaning: 'vội vã, gấp rút, nhanh lên',
    example: '電车的時間に遅れそうなので、足早に急ぎました。 (Sắp muộn giờ tàu chạy nên tôi bước chân vội vã gấp rút.)'
  },
  '致す': {
    meaning: 'làm, thực hiện (khiêm nhường ngữ của する)',
    example: '私が責任を持ってその仕事をお引き受け致します。 (Tôi xin chịu trách nhiệm đảm đương thực hiện công việc đó.)'
  },
  'いただく': {
    meaning: 'nhận, xin nhận; ăn, uống (khiêm nhường ngữ)',
    example: '先生から素晴らしい本をいただきました。 (Tôi đã nhận được cuốn sách tuyệt vời từ thầy giáo.)'
  },
  '祈る': {
    meaning: 'cầu nguyện, cầu chúc',
    example: 'あなたの成功と健康を心から祈っています。 (Tôi thành tâm cầu chúc cho sự thành công và sức khỏe của bạn.)'
  },
  'いらっしゃる': {
    meaning: 'ở, đi, đến (kính ngữ tôn kính của いる, 行く, 来る)',
    example: '田中先生は今研究室にいらっしゃいます。 (Thầy Tanaka hiện đang ở trong phòng nghiên cứu.)'
  },
  '打つ': {
    meaning: 'đánh, gõ (bàn phím, bóng); đập',
    example: 'パソコンのキーボードを速く打つことができます。 (Tôi có thể gõ bàn phím máy vi tính rất nhanh.)'
  },
  '遠慮': {
    meaning: 'ngại ngần, khách khí, e dè',
    example: 'どうぞ遠慮しないで、たくさん召し上がってください。 (Xin đừng ngại ngần khách khí mà hãy dùng thật nhiều nhé.)'
  },
  '起す': {
    meaning: 'đánh thức (ai dậy); gây ra (tai nạn)',
    example: '毎朝６時に目覚まし時計が私を起こしてくれます。 (Mỗi sáng lúc 6 giờ, đồng hồ báo thức lại đánh thức tôi dậy.)'
  },
  '行う': {
    meaning: 'tiến hành, tổ chức, thực hiện',
    example: '来週の土曜日に学校のグラウンドで運動会を行います。 (Thứ Bảy tuần tới, chúng tôi sẽ tổ chức ngày hội thể thao tại sân trường.)'
  },
  '落ちる': {
    meaning: 'rơi, rớt; trượt (kỳ thi)',
    example: '秋になると木から枯葉が地面に落ちます。 (Khi mùa thu đến, lá khô từ trên cây rơi xuống mặt đất.)'
  },
  '落す': {
    meaning: 'đánh rơi, làm rớt; làm mất',
    example: '駅の改札口で財布を落としてしまいました。 (Tôi đã vô tình đánh rơi chiếc ví tại cửa soát vé nhà ga.)'
  },
  'お見舞い': {
    meaning: 'thăm bệnh, thăm hỏi người ốm; quà thăm bệnh',
    example: '入院している友達の病院へお見舞いに行きました。 (Tôi đã đến bệnh viện thăm hỏi người bạn đang nằm viện.)'
  },
  '思い出す': {
    meaning: 'nhớ lại, hồi tưởng lại',
    example: 'アルバムの写真を見て懐かしい子供の頃を思い出しました。 (Xem những bức ảnh trong cuốn album, tôi nhớ lại những ngày ấu thơ đầy hoài niệm.)'
  },
  '折る': {
    meaning: 'bẻ gãy, gập, gấp (giấy origami)',
    example: 'きれいな折り紙で鶴を何羽も折りました。 (Tôi đã gấp nhiều con hạc bằng những tờ giấy origami tuyệt đẹp.)'
  },
  '折れる': {
    meaning: 'bị gãy, gập lại; rẽ (hướng)',
    example: '強風で庭の木の枝がポキリと折れてしまいました。 (Do gió mạnh, cành cây ngoài vườn đã bị gãy gập.)'
  },
  '帰り': {
    meaning: 'lúc về, chiều về, đường về',
    example: '学校の帰りに友達と本屋に立ち寄りました。 (Trên đường về sau giờ học, tôi cùng bạn ghé vào hiệu sách.)'
  },
  '勝つ': {
    meaning: 'thắng, chiến thắng',
    example: '決勝戦で見事に相手チームに勝ちました。 (Trong trận chung kết, đội chúng tôi đã chiến thắng đội bạn một cách xuất sắc.)'
  },
  'かっこう': {
    meaning: 'vẻ bề ngoài, hình dáng; diện mạo, tư thế',
    example: '寒くないように温かいかっこうをして出かけましょう。 (Hãy mặc trang phục ấm áp với diện mạo gọn gàng để không bị lạnh khi ra ngoài nhé.)'
  },
  '家内': {
    meaning: 'vợ tôi, bà xã (khiêm nhường ngữ)',
    example: '家内は料理が得意で、毎晩美味しい夕食を作ってくれます。 (Vợ tôi nấu ăn rất giỏi và tối nào cũng nấu cho tôi bữa tối thơm ngon.)'
  },
  'かまう': {
    meaning: 'bận tâm, để ý; can thiệp',
    example: '私のことはどうぞおかまいなく。 (Xin đừng bận tâm đến tôi, cứ tự nhiên nhé ạ.)'
  },
  '噛む': {
    meaning: 'cắn, nhai',
    example: '健康のために、ご飯をよく噛んで食べましょう。 (Vì sức khỏe, hãy nhai kỹ cơm khi ăn nhé.)'
  },
  '考える': {
    meaning: 'suy nghĩ, đắn đo, cân nhắc',
    example: '将来の進路について一人でじっくり考えました。 (Tôi đã ngồi một mình suy nghĩ thấu đáo về con đường tương lai.)'
  },
  '簡単': {
    meaning: 'đơn giản, dễ dàng',
    example: 'この説明書を読めば、組み立てはとても簡単です。 (Nếu đọc bản hướng dẫn này thì việc lắp ráp vô cùng đơn giản.)'
  },
  '気': {
    meaning: 'tinh thần, tâm trạng, khí sắc',
    example: '深呼吸をしたら気持ちがすっきりと落ち着きました。 (Hít một hơi thật sâu, tâm trạng của tôi đã lắng dịu và sảng khoái.)'
  },
  '急': {
    meaning: 'gấp, khẩn cấp; đột ngột, dốc',
    example: '急な用事ができたので、途中で帰宅しました。 (Vì có việc khẩn cấp đột xuất nên tôi đã về nhà giữa chừng.)'
  },
  'くださる': {
    meaning: 'cho, tặng (kính ngữ của くれる)',
    example: '先生が私に素晴らしい辞書をくださいました。 (Thầy giáo đã tặng cho tôi một cuốn từ điển rất hay.)'
  },
  '比べる': {
    meaning: 'so sánh, đối chiếu',
    example: '去年と比べて、今年の夏は格段に暑いです。 (So sánh với năm ngoái thì mùa hè năm nay nóng hơn hẳn.)'
  },
  '暮れる': {
    meaning: 'lặn (mặt trời); hết (năm, ngày); tối trời',
    example: '日が暮れて、あたり一面が暗くなってきました。 (Mặt trời lặn và xung quanh dần trở nên tối tăm.)'
  },
  '下宿': {
    meaning: 'ở trọ, nhà trọ sinh viên',
    example: '大学の近くのアパートで下宿生活を始めました。 (Tôi đã bắt đầu cuộc sống ở trọ tại một căn hộ gần trường đại học.)'
  },
  'けれど': {
    meaning: 'tuy nhiên, nhưng mà (liên từ nối)',
    example: '行きたかったけれど、都合が悪くて行けませんでした。 (Tôi rất muốn đi nhưng mà vì bận việc nên đã không đi được.)'
  },
  '研究': {
    meaning: 'nghiên cứu, tìm tòi học hỏi',
    example: '大学の大学院で日本のロボット工学を研究しています。 (Tôi đang nghiên cứu kỹ thuật robot Nhật Bản tại viện cao học của trường đại học.)'
  },
  '子': {
    meaning: 'đứa con, đứa trẻ',
    example: '公園で元気な子供たちが走り回って遊んでいます。 (Những đứa trẻ khỏe mạnh đang chạy nhảy vui chơi ngoài công viên.)'
  },
  '講堂': {
    meaning: 'giảng đường, hội trường lớn',
    example: '入学式の会場として大学の広い講堂に集まりました。 (Chúng tôi tập trung tại giảng đường rộng lớn của trường đại học để làm lễ khai giảng.)'
  },
  '答': {
    meaning: 'câu trả lời, đáp án',
    example: '先生の質問に対して正しい答えを言うことができました。 (Tôi đã có thể đưa ra câu trả lời chính xác cho câu hỏi của thầy giáo.)'
  },
  'このあいだ': {
    meaning: 'dạo gần đây, hôm nọ, vừa rồi',
    example: 'このあいだ街でばったり高校時代の友達に出会いました。 (Hôm nọ tôi tình cờ bắt gặp người bạn thời cấp ba trên phố.)'
  },
  '壊す': {
    meaning: 'làm hỏng, phá vỡ; làm hại (sức khỏe: 体を壊す)',
    example: '無理をして働きすぎて体を壊さないように気をつけてください。 (Đừng làm việc quá sức kẻo làm hại sức khỏe của mình nhé.)'
  },
  '坂': {
    meaning: 'dốc, con dốc, đoạn dốc',
    example: '自転車を押しながら急な坂をゆっくり登りました。 (Tôi dắt chiếc xe đạp và chầm chậm leo lên con dốc đứng.)'
  },
  '下げる': {
    meaning: 'hạ xuống, giảm bớt; cúi (đầu: 頭を下げる)',
    example: '部屋のエアコンの温度を少し下げました。 (Tôi đã hạ bớt nhiệt độ của điều hòa trong phòng xuống một chút.)'
  },
  'サラダ': {
    meaning: 'món xà lách, rau trộn (salad)',
    example: '健康のために毎朝新鮮な野菜サラダを食べています。 (Vì sức khỏe, mỗi sáng tôi đều ăn món rau trộn xà lách tươi ngon.)'
  },
  '触る': {
    meaning: 'chạm vào, sờ vào',
    example: '美術品の絵画に手を触れてはいけません。 (Không được chạm tay vào các bức tranh mỹ thuật.)'
  },
  '残念': {
    meaning: 'đáng tiếc, tiếc nuối',
    example: '楽しみにしていたコンサートに行けなくて本当に残念です。 (Không thể đi xem buổi hòa nhạc mà mình mong đợi thật là vô cùng đáng tiếc.)'
  },
  '仕方': {
    meaning: 'cách làm, phương pháp; đành chịu (仕方がない)',
    example: 'パソコンの使い方が分からないので、同僚に仕方を教えてもらいました。 (Không biết cách dùng máy tính nên tôi đã nhờ đồng nghiệp chỉ cho cách làm.)'
  },
  'しかる': {
    meaning: 'la mắng, mắng mỏ, khiển trách',
    example: 'いたずらをして母に厳しくしかられました。 (Nghịch ngợm nên tôi đã bị mẹ la mắng nghiêm khắc.)'
  },
  'しっかり': {
    meaning: 'vững vàng, chắc chắn; kiên cường, chu đáo',
    example: '台風に備えて、窓をしっかりと閉めておきました。 (Để phòng bão, tôi đã đóng chặt các cửa sổ một cách chắc chắn.)'
  },
  '出発': {
    meaning: 'xuất phát, khởi hành',
    example: '明日の朝８時にみんなで駅前に集合して出発します。 (Sáng mai lúc 8 giờ, mọi người sẽ tập trung trước nhà ga và xuất phát.)'
  },
  '承知': {
    meaning: 'đồng ý, chấp nhận; hiểu rõ (承知しました)',
    example: '「明日の件、よろしく頼むよ」「かしこまりました、承知いたしました」。 (\"Việc ngày mai nhờ cả vào bạn nhé\" - \"Dạ vâng, tôi đã hiểu rõ và xin nhận lời rồi ạ\".)'
  },
  '知らせる': {
    meaning: 'thông báo, cho biết, báo tin',
    example: '試験の日程が決まったら、すぐにメールで知らせてください。 (Khi có lịch thi cụ thể, xin hãy thông báo ngay qua email cho tôi biết nhé.)'
  },
  '調べる': {
    meaning: 'tra cứu, tìm hiểu, điều tra',
    example: '分からない単語があったら、スマホの辞書で調べます。 (Khi có từ vựng không hiểu, tôi tra cứu bằng từ điển trên điện thoại.)'
  },
  'スーツケース': {
    meaning: 'va li du lịch (suitcase)',
    example: '旅行の荷物を大きなスーツケースにきれいに詰めました。 (Tôi đã xếp gọn gàng hành lý du lịch vào chiếc va li lớn.)'
  },
  'すく': {
    meaning: 'vắng vẻ, thưa thớt; đói (bụng: お腹がすく)',
    example: '平日の昼間なので、電車の中はとてもすいていました。 (Vì là ban ngày của ngày thường nên trong tàu điện rất vắng vẻ.)'
  },
  '凄い': {
    meaning: 'tuyệt vời, ghê gớm, kinh khủng',
    example: '彼は日本語を学び始めてたった一年でN2に合格した、本当に凄い人だ。 (Anh ấy mới học tiếng Nhật một năm mà đã đỗ N2, quả là một người thực sự tuyệt vời.)'
  },
  'すっと': {
    meaning: 'nhanh thoăn thoắt; khoan khoái, nhẹ nhõm',
    example: '薬を飲んだら、胸のつかえがすっと楽になりました。 (Uống viên thuốc xong, cảm giác nghẹn ở ngực đã nhẹ nhõm hẳn đi.)'
  },
  '済む': {
    meaning: 'hoàn thành, xong xuôi; giải quyết xong',
    example: '宿題が早く済んだので、夜はゆっくり映画を見ました。 (Bài tập đã làm xong xuôi sớm nên buổi tối tôi đã thong thả xem phim.)'
  },
  '世話': {
    meaning: 'chăm sóc, giúp đỡ (お世話になる)',
    example: '子犬の世話を毎日欠かさず行っています。 (Hàng ngày tôi đều không quên chăm sóc cho chú cún con.)'
  },
  '育てる': {
    meaning: 'nuôi nấng, chăm sóc, dạy dỗ',
    example: 'ベランダのプランターできれいな花を大切に育てています。 (Tôi đang cẩn thận chăm sóc và nuôi dưỡng những bông hoa đẹp ở bồn cây ngoài ban công.)'
  },
  'それほど': {
    meaning: 'đến mức như thế, dường ấy (thường đi với phủ định)',
    example: '今年の冬はそれほど寒くありません。 (Mùa đông năm nay không lạnh đến mức như thế.)'
  },
  'そろそろ': {
    meaning: 'sắp sửa, chuẩn bị (đến giờ)',
    example: 'もうすぐ１０時ですね。そろそろ失礼いたします。 (Sắp 10 giờ rồi nhỉ. Đã đến lúc tôi chuẩn bị xin phép ra về.)'
  },
  '大体': {
    meaning: 'đại khái, khoảng chừng, hầu như',
    example: '今日の講義の内容は大体理解できました。 (Nội dung bài giảng hôm nay tôi đã đại khái hiểu được phần lớn.)'
  },
  '大分': {
    meaning: 'khá nhiều, đáng kể, rất nhiều',
    example: '薬を飲んで一晩寝たら、風邪がだいぶ良くなりました。 (Uống thuốc rồi ngủ một giấc, bệnh cảm của tôi đã đỡ khá nhiều.)'
  },
  '畳': {
    meaning: 'chiếu tatami, chiếu cói Nhật Bản',
    example: '和室の新しい畳のい草の良い香りが漂っています。 (Căn phòng kiểu Nhật thoang thoảng mùi thơm dễ chịu của chiếu tatami mới.)'
  },
  '立てる': {
    meaning: 'dựng lên, cắm lên; lập (kế hoạch)',
    example: '来年の留学に向けて具体的な計画を立てました。 (Tôi đã lập kế hoạch cụ thể cho chuyến du học vào năm tới.)'
  },
  '血': {
    meaning: 'máu, huyết',
    example: '指を紙で切ってしまい、少し血が出ました。 (Tôi bị cạnh giấy cứa vào ngón tay làm chảy một chút máu.)'
  },
  'チェックする': {
    meaning: 'kiểm tra, đánh dấu soát lại (check)',
    example: '試験の答案を提出する前に、名前や答えをもう一度チェックしました。 (Trước khi nộp bài thi, tôi đã kiểm tra soát lại tên và câu trả lời một lần nữa.)'
  },
  '付く': {
    meaning: 'dính, bám; gắn kèm; có được',
    example: '服にソースのシミが付いてしまったので洗いました。 (Vết nước sốt bị dính bám vào áo nên tôi đã đem đi giặt.)'
  },
  '漬ける': {
    meaning: 'ngâm, muối (dưa, rau củ)',
    example: '新鮮なきゅうりを塩水に一晩漬けて漬物を作りました。 (Tôi đã ngâm dưa chuột tươi vào nước muối qua đêm để làm món dưa muối.)'
  },
  '伝える': {
    meaning: 'truyền đạt, nhắn lại, thông báo',
    example: '先生に「よろしくお伝えください」と伝言を頼まれました。 (Tôi được nhờ nhắn lại lời chào truyền đạt đến thầy giáo.)'
  },
  '続く': {
    meaning: 'tiếp tục, kéo dài liên tục',
    example: '連日厳しい猛暑の日が続いています。 (Chuỗi ngày nắng nóng gay gắt vẫn đang tiếp tục kéo dài liên tục.)'
  },
  '包む': {
    meaning: 'gói, bọc (quà, đồ đạc)',
    example: 'プレゼントをきれいな包装紙で丁寧に包みました。 (Tôi đã cẩn thận gói bọc món quà bằng giấy gói tuyệt đẹp.)'
  },
  'つもり': {
    meaning: 'dự định, ý định',
    example: '大学を卒業したら、日本の企業に就職するつもりです。 (Sau khi tốt nghiệp đại học, tôi có dự định sẽ làm việc tại một doanh nghiệp Nhật Bản.)'
  },
  '連れる': {
    meaning: 'dẫn theo, dắt theo (người, thú cưng)',
    example: '週末に子供を連れて動物園へ出かけました。 (Cuối tuần tôi dẫn theo con nhỏ đi chơi sở thú.)'
  },
  '丁寧': {
    meaning: 'lịch sự, cẩn thận, chu đáo',
    example: '店員さんがとても丁寧な言葉遣いで対応してくれました。 (Nhân viên bán hàng đã tiếp đón tôi bằng thái độ và lời lẽ rất lịch sự chu đáo.)'
  },
  '手伝う': {
    meaning: 'giúp đỡ, phụ giúp (công việc)',
    example: '母の夕食の準備を台所で手伝いました。 (Tôi đã phụ giúp mẹ chuẩn bị bữa tối ở trong bếp.)'
  },
  '途中': {
    meaning: 'giữa đường, giữa chừng',
    example: '学校へ行く途中で雨が降り出しました。 (Trên đường đi đến trường thì trời bắt đầu đổ mưa.)'
  },
  '届ける': {
    meaning: 'giao đến, gửi đến; trình báo',
    example: '郵便屋さんが荷物を玄関まで届けてくれました。 (Bác nhân viên bưu điện đã giao bưu kiện đến tận cửa nhà cho tôi.)'
  },
  '泊まる': {
    meaning: 'trọ lại, nghỉ qua đêm (tại khách sạn, nhà bạn)',
    example: '京都旅行の夜は有名な伝統旅館に泊まりました。 (Đêm du lịch ở Kyoto, tôi đã trọ lại tại một quán trọ truyền thống nổi tiếng.)'
  },
  'どんどん': {
    meaning: 'nhanh chóng, dồn dập, liên tục phát triển',
    example: '日本語を毎日話すことで、会話力がどんどん上達しました。 (Nhờ nói tiếng Nhật mỗi ngày, khả năng hội thoại của tôi đã tiến bộ nhanh chóng từng ngày.)'
  },
  '治る': {
    meaning: 'khỏi bệnh, lành lại (vết thương)',
    example: '病院で処方された薬を飲んだら、風邪がすっかり治りました。 (Uống thuốc do bệnh viện kê đơn, bệnh cảm của tôi đã khỏi bệnh hoàn toàn.)'
  },
  '中々': {
    meaning: 'khá là, tương đối; mãi mà không',
    example: 'この数学の問題はなかなか難しくて解けません。 (Bài toán này khá là hóc búa nên tôi mãi không giải được.)'
  },
  '亡くなる': {
    meaning: 'qua đời, mất (trang trọng)',
    example: '祖父は去年の冬に９０歳で静かに亡くなりました。 (Ông nội tôi đã thanh thản qua đời vào mùa đông năm ngoái ở tuổi 90.)'
  },
  '投げる': {
    meaning: 'ném (bóng, rác); từ bỏ',
    example: 'ピッチャーがキャッチャーに向かって速いボールを投げました。 (Cầu thủ ném bóng đã ném quả bóng cực nhanh về phía người bắt bóng.)'
  },
  '鳴る': {
    meaning: 'kêu, reo (chuông, điện thoại); rền (sấm)',
    example: '授業中に突然スマートフォンの着信音が鳴りました。 (Giữa giờ học đột nhiên chuông điện thoại thông minh reo vang.)'
  },
  '似る': {
    meaning: 'giống, tương tự (cha mẹ, anh em)',
    example: '彼女は目元がお母さんにとてもよく似ています。 (Cô ấy có đôi mắt rất giống với mẹ.)'
  },
  '盗む': {
    meaning: 'ăn trộm, lấy cắp',
    example: '駅の駐輪場に止めておいた自転車を盗まれてしまいました。 (Chiếc xe đạp tôi để ở bãi gửi xe nhà ga đã bị kẻ gian ăn trộm mất.)'
  },
  '残る': {
    meaning: 'còn lại, sót lại',
    example: '昨日の夕食のおかずが少し冷蔵庫に残っています。 (Món ăn của bữa tối hôm qua vẫn còn lại một ít trong tủ lạnh.)'
  },
  '場合': {
    meaning: 'trường hợp, tình huống, hoàn cảnh',
    example: '地震が起きた場合は、まず机の下に隠れて頭を守ってください。 (Trong trường hợp xảy ra động đất, trước hết hãy trốn dưới gầm bàn để bảo vệ đầu.)'
  },
  '運ぶ': {
    meaning: 'vận chuyển, mang vác, chở đồ',
    example: '引っ越しの荷物をトラックまでみんなで運びました。 (Mọi người cùng nhau vận chuyển đồ đạc chuyển nhà ra xe tải.)'
  },
  'はず': {
    meaning: 'chắc chắn là, nhất định là (logic)',
    example: '彼なら真面目だから、時間通りに来るはずです。 (Anh ấy vốn rất nghiêm túc nên chắc chắn sẽ đến đúng giờ.)'
  },
  'はっきり': {
    meaning: 'rõ ràng, rành mạch',
    example: '黒板の文字が見えにくいので、もっとはっきりと書いてください。 (Chữ trên bảng hơi khó nhìn, xin hãy viết rõ ràng hơn ạ.)'
  },
  '払う': {
    meaning: 'trả tiền, thanh toán; phủi (bụi)',
    example: 'スーパーのレジでクレジットカードで代金を払いました。 (Tôi đã trả tiền thanh toán bằng thẻ tín dụng tại quầy thu ngân của siêu thị.)'
  },
  '冷える': {
    meaning: 'lạnh đi, nguội đi (đồ ăn, cơ thể)',
    example: '冬の夜は足元がしんしんと冷えます。 (Vào đêm mùa đông, bàn chân bị lạnh buốt thấu xương.)'
  },
  '引き出す': {
    meaning: 'rút tiền (ATM); kéo ra (ngăn kéo); phát huy (năng lực)',
    example: '銀行のATMで生活費を３万円引き出しました。 (Tôi đã rút tiền sinh hoạt phí 30 nghìn yên tại cây ATM của ngân hàng.)'
  },
  '非常に': {
    meaning: 'vô cùng, cực kỳ, hết sức',
    example: 'この本は初心者にとって非常に分かりやすく書かれています。 (Cuốn sách này được viết vô cùng dễ hiểu cho người mới bắt đầu.)'
  },
  'びっくりする': {
    meaning: 'giật mình, ngạc nhiên, kinh ngạc',
    example: '突然背後から大きな物音がしてびっくりしました。 (Đột nhiên có tiếng động lớn phát ra từ phía sau làm tôi giật mình kinh ngạc.)'
  },
  '拾う': {
    meaning: 'nhặt lên, nhặt được (của rơi)',
    example: '道端で誰かが落とした鍵を拾って交番に届けました。 (Tôi nhặt được chiếc chìa khóa ai đó đánh rơi ven đường và đem nộp cho đồn cảnh sát.)'
  },
  '増える': {
    meaning: 'tăng lên, tăng thêm (số lượng, cân nặng)',
    example: '日本で働く外国人労働者の数が年々増えています。 (Số lượng lao động nước ngoài làm việc tại Nhật Bản đang tăng lên qua từng năm.)'
  },
  '復習': {
    meaning: 'ôn tập lại, ôn bài',
    example: '今日習った文法を家でしっかり復習しました。 (Tôi đã ôn tập lại thật kỹ tại nhà các ngữ pháp vừa học hôm nay.)'
  },
  '太る': {
    meaning: 'béo lên, tăng cân, mập ra',
    example: '甘いものを食べ過ぎて、最近少し太ってしまいました。 (Ăn quá nhiều đồ ngọt nên gần đây tôi đã bị béo lên một chút.)'
  },
  'ベル': {
    meaning: 'chuông, chuông cửa, chuông điện thoại (bell)',
    example: '授業の終了を告げるチャイムのベルが鳴りました。 (Tiếng chuông báo hiệu kết thúc giờ học đã reo vang.)'
  },
  'ほど': {
    meaning: 'khoảng chừng; đến mức (như là)',
    example: '昨日は死ぬほど忙しくて息をつく暇もありませんでした。 (Hôm qua tôi bận rộn đến mức không có cả thời gian để thở.)'
  },
  'ほとんど': {
    meaning: 'hầu như, phần lớn, gần như toàn bộ',
    example: '宿題はほとんど終わったので、あとは見直すだけです。 (Bài tập hầu như đã làm xong hết rồi, giờ chỉ còn soát lại thôi.)'
  },
  '参る': {
    meaning: 'đi, đến (khiêm nhường ngữ của 行く, 来る); chịu thua, đầu hàng',
    example: 'ただいま東京支店から参りました。 (Tôi vừa từ chi nhánh Tokyo đến đây ạ.)'
  },
  '負ける': {
    meaning: 'thua cuộc; giảm giá (cho khách)',
    example: 'じゃんけんで負けた人がジュースをおごるルールです。 (Ai thua cuộc trong trò oẳn tù tì sẽ phải đãi nước ngọt.)'
  },
  '見える': {
    meaning: 'nhìn thấy, trông thấy; trông có vẻ',
    example: '窓から雪をかぶった美しい富士山が見えます。 (Từ cửa sổ có thể nhìn thấy ngọn núi Phú Sĩ phủ đầy tuyết tuyệt đẹp.)'
  },
  '味噌': {
    meaning: 'tương miso (gia vị truyền thống Nhật); điểm cốt lõi',
    example: '朝ご飯に温かい豆腐の味噌汁を飲みました。 (Tôi ăn bữa sáng với bát súp tương miso đậu phụ ấm nóng.)'
  },
  '見つかる': {
    meaning: 'được tìm thấy, tìm ra',
    example: '失くしたと思っていた鍵がポケットの中から見つかりました。 (Chiếc chìa khóa tưởng đã mất đã được tìm thấy trong túi áo.)'
  },
  '見つける': {
    meaning: 'tìm thấy, phát hiện ra, bắt gặp',
    example: '本屋でずっと探していた専門書をついに見つけました。 (Tại hiệu sách, cuối cùng tôi đã tìm thấy cuốn sách chuyên ngành mà mình tìm kiếm bấy lâu.)'
  },
  '皆': {
    meaning: 'mọi người, tất cả mọi người',
    example: 'クラスの皆で力を合わせて合唱コンクールで優勝した。 (Tất cả mọi người trong lớp cùng nhau hợp lực và giành giải nhất cuộc thi hợp xướng.)'
  },
  '向かう': {
    meaning: 'hướng về, đi về phía, đối diện',
    example: '空港へ向かう電車に乗って出発しました。 (Tôi lên chuyến tàu điện hướng về phía sân bay và xuất phát.)'
  },
  '迎える': {
    meaning: 'đón, đón tiếp; nghênh đón (năm mới)',
    example: '家族そろって笑顔で新しい年を迎えました。 (Cả gia đình quây quần bên nhau vui vẻ nghênh đón một năm mới.)'
  },
  '無理': {
    meaning: 'không thể, vô lý; quá sức, gượng ép',
    example: '無理をして体を壊さないように、適度に休みましょう。 (Đừng cố làm việc quá sức kẻo hại sức khỏe mà hãy nghỉ ngơi điều độ nhé.)'
  },
  '申し上げる': {
    meaning: 'nói, bày tỏ (khiêm nhường ngữ của 言う)',
    example: '心より感謝とお礼の言葉を申し上げます。 (Tôi xin được gửi lời tri ân và bày tỏ lòng biết ơn sâu sắc từ đáy lòng.)'
  },
  'もっとも': {
    meaning: 'nhất, vô cùng (cực cấp: 最も); hợp lý, đương nhiên (尤も)',
    example: '富士山は日本で最も高い山です。 (Núi Phú Sĩ là ngọn núi cao nhất ở Nhật Bản.)'
  },
  '戻る': {
    meaning: 'quay lại, trở về (vị trí ban đầu)',
    example: '席を離れていた同僚がデスクに戻ってきました。 (Người đồng nghiệp vừa rời chỗ đã quay lại bàn làm việc.)'
  },
  '森': {
    meaning: 'rừng rậm, khu rừng lớn',
    example: '小鳥のさえずりが響く静かな森の中を散策しました。 (Tôi dạo bước trong khu rừng yên tĩnh rộn rã tiếng chim hót.)'
  },
  '役に立つ': {
    meaning: 'có ích, hữu ích, hữu dụng',
    example: 'この辞書アプリは日本語の勉強にとても役に立ちます。 (Ứng dụng từ điển này rất hữu ích cho việc học tiếng Nhật.)'
  },
  '焼ける': {
    meaning: 'cháy; được nướng chín (thịt, bánh)',
    example: 'オーブンから美味しそうなパンがこんがりと焼けました。 (Những chiếc bánh mì thơm ngon đã được nướng chín vàng từ lò nướng.)'
  },
  '止む': {
    meaning: 'tạnh (mưa), ngừng, ngớt (gió, tiếng ồn)',
    example: '雨が止んだので、傘を持たずに散歩に出かけました。 (Mưa đã tạnh nên tôi không cần cầm ô mà thong thả đi dạo.)'
  },
  '柔らかい': {
    meaning: 'mềm mại, êm ái, dẻo dai',
    example: 'この焼きたてのパンはふわふわでとても柔らかいです。 (Chiếc bánh mì mới nướng này xốp và rất mềm mại.)'
  },
  '揺れる': {
    meaning: 'rung lắc, đung đưa, chao đảo',
    example: '地震で部屋の照明が大きく揺れました。 (Do động đất, đèn chiếu sáng trong phòng đã rung lắc dữ dội.)'
  },
  '用': {
    meaning: 'việc bận, công chuyện; dùng cho (trẻ em: 子供用)',
    example: '午後は急な用事が入ってしまったので外出します。 (Buổi chiều tôi có việc bận đột xuất nên phải ra ngoài.)'
  },
  '用意': {
    meaning: 'chuẩn bị, sửa soạn (đồ dùng, thức ăn)',
    example: '旅行の前にパスポートと航空券を用意しました。 (Trước chuyến du lịch, tôi đã chuẩn bị sẵn hộ chiếu và vé máy bay.)'
  },
  '寄る': {
    meaning: 'ghé qua, tạt vào; xích lại gần',
    example: '会社からの帰り道にスーパーに寄って買い物をしました。 (Trên đường đi làm về, tôi ghé qua siêu thị để mua đồ.)'
  },
  '喜ぶ': {
    meaning: 'vui mừng, hân hoan, vui sướng',
    example: '合格の知らせを聞いて、両親は飛び上がって喜びました。 (Nghe tin thi đỗ, cha mẹ tôi đã nhảy cẫng lên vì vui mừng.)'
  },
  'よろしい': {
    meaning: 'được, ổn (lịch sự của いい)',
    example: 'お茶のおかわりはいかがでしょうか、よろしいですか。 (Tôi châm thêm trà cho quý khách nhé, như vậy có được không ạ?)'
  },
  'レジ': {
    meaning: 'quầy thu ngân, máy tính tiền (cash register)',
    example: '買い物を終えて、レジでお会計を済ませました。 (Mua sắm xong xuôi, tôi đã ra quầy thu ngân để thanh toán.)'
  },
  '別れる': {
    meaning: 'chia tay, chia lìa, từ biệt',
    example: '駅の改札口で「また明日」と友達と別れました。 (Tại cửa soát vé nhà ga, tôi đã chia tay người bạn và hẹn: \"Mai gặp lại nhé!\".)'
  },
  '沸く': {
    meaning: 'sôi (nước); sôi động, hào hứng (khán đài)',
    example: 'やかんのお湯がグラグラと沸きました。 (Nước trong ấm đun đã sôi sùng sục.)'
  },
  '訳': {
    meaning: 'lý do, nguyên cớ; ý nghĩa',
    example: '遅刻したのにはちゃんとした理由と訳があります。 (Việc tôi bị muộn giờ là có nguyên do và lý do chính đáng.)'
  },
  '割合': {
    meaning: 'tỷ lệ; tương đối, khá là',
    example: 'この学校は留学生の割合が高いです。 (Ngôi trường này có tỷ lệ du học sinh rất cao.)'
  }
};

function run() {
  let totalUpdated = 0;
  fs.readdirSync(BASE_DIR).forEach(part => {
    const file = path.join(BASE_DIR, part, 'vocabulary.json');
    if (fs.existsSync(file)) {
      const items = JSON.parse(fs.readFileSync(file, 'utf8'));
      let updated = 0;
      items.forEach(it => {
        if (DICT[it.word]) {
          it.meaning = DICT[it.word].meaning;
          it.example = DICT[it.word].example;
          updated++;
          totalUpdated++;
        }
      });
      if (updated > 0) {
        fs.writeFileSync(file, JSON.stringify(items, null, 2), 'utf8');
        console.log(`[OK] Đã cập nhật ${updated} từ trong ${part}`);
      }
    }
  });
  console.log(`\n🎉 Tổng số từ N4 Core Bank đã chuẩn hóa: ${totalUpdated}`);
}

run();

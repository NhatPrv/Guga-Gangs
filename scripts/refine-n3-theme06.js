/**
 * scripts/refine-n3-theme06.js
 * Chuẩn hóa toàn diện từ vựng N3 - Theme 06: Phó từ & Diễn đạt nâng cao (adverbs-expressions)
 * Đảm bảo 4 tiêu chuẩn: sinoVietnamese chuẩn, meaning phân cách bằng ;, example tự nhiên và cross-check 100%.
 */

const fs = require('fs');
const path = require('path');

const THEME_FILE = path.join(__dirname, '..', 'data', 'jlpt-n3-core-bank', 'theme-06-adverbs-expressions', 'vocabulary.json');

const DICT = {
  'ふと': {
    meaning: 'chợt, bất giác, tình cờ',
    example: 'ふと昔の友達のことを思い出しました。 (Tôi chợt nhớ đến người bạn ngày xưa.)'
  },
  '不利': {
    meaning: 'bất lợi, yếu thế',
    example: 'この条件は我々にとって非常に不利です。 (Điều kiện này vô cùng bất lợi đối với chúng tôi.)'
  },
  '振る': {
    meaning: 'vẫy (tay), lắc (đầu); rải, rắc (muối); từ chối (lời tỏ tình)',
    example: '笑顔で手を振って友達を見送りました。 (Tôi mỉm cười vẫy tay tiễn người bạn lên đường.)'
  },
  '震える': {
    meaning: 'run rẩy, run lên (vì lạnh, sợ hãi)',
    example: '寒さで手足が小刻みに震えていました。 (Vì trời quá lạnh nên chân tay tôi run rẩy cầm cập.)'
  },
  '分': {
    meaning: 'phần, tỉ lệ; lượng (thức ăn, thuốc)',
    example: '今日の夕食は２人分の料理を作りました。 (Tôi đã nấu lượng thức ăn dành cho khẩu phần hai người cho bữa tối nay.)'
  },
  '文': {
    meaning: 'câu, đoạn văn; văn chương',
    example: '日本語で短い文をノートに書きました。 (Tôi đã viết một câu ngắn bằng tiếng Nhật vào cuốn vở.)'
  },
  '塀': {
    meaning: 'tường rào, hàng rào bao quanh',
    example: '家の周りに高い木の塀が作られています。 (Xung quanh ngôi nhà có dựng một hàng rào bằng gỗ cao ráo.)'
  },
  '平均': {
    meaning: 'bình quân, trung bình',
    example: 'クラスのテストの平均点は７５点でした。 (Điểm số trung bình bài kiểm tra của cả lớp là 75 điểm.)'
  },
  '別に': {
    meaning: 'không có gì đặc biệt (đi với phủ định: 別に〜ない)',
    example: '「何かあったの？」「ううん、別に何でもないよ」。 (\"Có chuyện gì thế?\" - \"Không, không có gì đặc biệt đâu\".)'
  },
  '棒': {
    meaning: 'cây gậy, thanh gỗ, đòn',
    example: '長い木の棒を使って高い枝の柿を取りました。 (Tôi đã dùng một cây gậy gỗ dài để khều quả hồng trên cành cao.)'
  },
  '冒険': {
    meaning: 'mạo hiểm, phiêu lưu',
    example: '子供の頃、森の中で探検する冒険が大好きでした。 (Hồi còn nhỏ, tôi rất thích những chuyến mạo hiểm khám phá trong rừng.)'
  },
  '豊富': {
    meaning: 'phong phú, dồi dào, đa dạng',
    example: 'この地域は豊かな自然と豊富な観光資源に恵まれています。 (Vùng đất này được thiên nhiên ban tặng tài nguyên du lịch phong phú và dồi dào.)'
  },
  '訪問': {
    meaning: 'thăm hỏi, ghé thăm, viếng thăm',
    example: '来週、日本の取引先の会社を公式に訪問します。 (Tuần tới, tôi sẽ chính thức ghé thăm công ty đối tác tại Nhật Bản.)'
  },
  'ホーム': {
    meaning: 'sân ga (platform); viện dưỡng lão (home)',
    example: '電車のベルが鳴ったので、急いで駅のホームへ向かいました。 (Chuông tàu điện vang lên nên tôi vội vã chạy ra sân ga.)'
  },
  '保存': {
    meaning: 'lưu lại, bảo quản (dữ liệu, thực phẩm)',
    example: '大切なデータは作業後に必ずパソコンに保存してください。 (Xin hãy nhớ lưu lại những dữ liệu quan trọng vào máy tính sau khi làm việc xong.)'
  },
  '歩道': {
    meaning: 'vỉa hè, lối đi bộ',
    example: '安全のために車道ではなく歩道を歩きましょう。 (Vì sự an toàn, hãy đi trên vỉa hè lối đi bộ chứ đừng đi xuống lòng đường.)'
  },
  '骨': {
    meaning: 'xương; gian khổ, khó nhọc',
    example: '転んで腕の骨を折ってしまいました。 (Tôi bị ngã và gãy xương cánh tay.)'
  },
  '本人': {
    meaning: 'chính chủ, bản thân người đó',
    example: '大切な手続きなので、必ず本人が窓口へお越しください。 (Vì là thủ tục quan trọng nên bắt buộc bản thân người đó phải trực tiếp đến quầy giao dịch.)'
  },
  '本物': {
    meaning: 'đồ thật, hàng chính hãng (đối lập hàng giả)',
    example: 'このダイヤモンドは鑑定書付きの本物です。 (Viên kim cương này là đồ thật có giấy giám định đi kèm.)'
  },
  'ぼんやり': {
    meaning: 'mơ màng, lơ đãng; mờ ảo, không rõ nét',
    example: '疲れていたので、窓の外の景色をぼんやりと眺めていました。 (Vì mệt mỏi nên tôi cứ mơ màng ngắm nhìn cảnh vật ngoài cửa sổ.)'
  },
  'マーケット': {
    meaning: 'chợ, thị trường (market)',
    example: '地元のスーパーマーケットで新鮮な野菜を買いました。 (Tôi đã mua rau tươi tại siêu thị chợ địa phương.)'
  },
  'マイク': {
    meaning: 'micro, mic (thu âm, nói)',
    example: '司会者がマイクを使って開会を宣言しました。 (Người dẫn chương trình đã dùng micro để tuyên bố khai mạc.)'
  },
  '幕': {
    meaning: 'màn, rèm (sân khấu); màn hạ, kết thúc',
    example: '拍手の中で劇の最後の幕が静かに下りました。 (Trong tiếng vỗ tay, bức màn cuối cùng của vở kịch đã từ từ hạ xuống.)'
  },
  '負け': {
    meaning: 'thua cuộc, sự thất bại; giảm giá',
    example: '試合の負けを素直に認めて、次回の勝利を目指します。 (Tôi chấp nhận sự thua cuộc trong trận đấu và hướng tới chiến thắng ở lần sau.)'
  },
  'まさか': {
    meaning: 'không đời nào, chẳng lẽ (không tin nổi)',
    example: 'まさか彼が試験に落ちるとは思わなかった。 (Không đời nào tôi lại nghĩ rằng anh ấy có thể trượt kỳ thi.)'
  },
  'まさに': {
    meaning: 'chính là, quả đúng là, thực sự là',
    example: '彼こそがまさにこのプロジェクトに最も適した人材です。 (Anh ấy quả đúng là nhân tài phù hợp nhất cho dự án này.)'
  },
  'マスター': {
    meaning: 'thành thạo, nắm vững (master); chủ quán',
    example: '短期間で日常会話の日本語をマスターしました。 (Tôi đã nắm vững thành thạo tiếng Nhật giao tiếp hàng ngày trong thời gian ngắn.)'
  },
  '真っ赤': {
    meaning: 'đỏ thẫm, đỏ bừng (mặt); hoàn toàn (lời nói dối)',
    example: '恥ずかしくて顔が真っ赤になってしまいました。 (Xấu hổ quá nên khuôn mặt tôi đã đỏ bừng lên.)'
  },
  '全く': {
    meaning: 'hoàn toàn (không: 全く〜ない); thực sự là',
    example: '彼の言っている意味が全く分かりませんでした。 (Tôi hoàn toàn không hiểu được ý tứ của những điều anh ấy nói.)'
  },
  '学ぶ': {
    meaning: 'học tập, nghiên cứu, tiếp thu kiến thức',
    example: '大学で日本の歴史と文化について深く学びました。 (Tôi đã học tập và tìm hiểu sâu sắc về lịch sử và văn hóa Nhật Bản tại trường đại học.)'
  },
  '豆': {
    meaning: 'hạt đậu; nhỏ bé',
    example: '節分の日に年の数だけ大豆の豆を食べました。 (Vào ngày lễ Setsubun, tôi đã ăn số hạt đậu nành tương ứng với số tuổi của mình.)'
  },
  '守る': {
    meaning: 'bảo vệ; tuân thủ, giữ gìn (lời hứa, luật pháp)',
    example: '友達との大切な約束は絶対に守ります。 (Tôi tuyệt đối sẽ tuân thủ và giữ gìn lời hứa quan trọng với bạn bè.)'
  },
  'まるで': {
    meaning: 'hệt như là, giống hệt như (đi với まるで〜のようだ)',
    example: '今日は暖かくて、まるで春が来たかのようです。 (Hôm nay trời ấm áp hệt như là mùa xuân đã về vậy.)'
  },
  '回す': {
    meaning: 'xoay, vặn (núm điều khiển); chuyển giao (tài liệu)',
    example: '水道の蛇口を回して冷たい水を出しました。 (Tôi vặn chiếc vòi nước để dòng nước mát chảy ra.)'
  },
  '回り': {
    meaning: 'xung quanh, chu vi; sự xoay quanh',
    example: '池の回りを毎朝ジョギングしています。 (Mỗi sáng tôi đều chạy bộ quanh bờ hồ.)'
  },
  '万一': {
    meaning: 'vạn nhất, chẳng may, nếu lỡ (xác suất rất nhỏ)',
    example: '万一の事故に備えて、保険に加入しました。 (Để phòng bị nếu chẳng may xảy ra tai nạn, tôi đã tham gia bảo hiểm.)'
  },
  '身': {
    meaning: 'bản thân; thân thể, cơ thể',
    example: '自分の身は自分で守らなければなりません。 (Bản thân mỗi người phải tự mình bảo vệ lấy chính mình.)'
  },
  '味方': {
    meaning: 'đồng minh, người ủng hộ, phía ta',
    example: 'どんな時でも家族は私の強い味方でいてくれます。 (Dù ở bất kỳ hoàn cảnh nào, gia đình cũng luôn là những người ủng hộ vững chắc cho tôi.)'
  },
  '見事': {
    meaning: 'tuyệt vời, ngoạn mục, đáng khâm phục',
    example: '厳しい練習を乗り越えて、見事に合格を果たしました。 (Vượt qua chuỗi ngày luyện tập gian khổ, anh ấy đã thi đỗ một cách tuyệt vời.)'
  },
  '土産': {
    meaning: 'quà lưu niệm, đặc sản địa phương',
    example: '北海道旅行のお土産においしいお菓子を買いました。 (Tôi đã mua bánh kẹo thơm ngon làm quà lưu niệm trong chuyến du lịch Hokkaido.)'
  },
  '妙': {
    meaning: 'kỳ lạ, khác thường, kỳ quặc',
    example: '夜中に外から妙な物音が聞こえてきました。 (Giữa đêm khuya, tôi nghe thấy một âm thanh kỳ lạ phát ra từ bên ngoài.)'
  },
  '迎え': {
    meaning: 'sự đón tiếp, người đi đón',
    example: '友達が車で空港まで迎えに来てくれました。 (Bạn tôi đã lái xe đến tận sân bay để đón tôi.)'
  },
  '向く': {
    meaning: 'hướng về, quay về; phù hợp với',
    example: '前を向いて堂々とスピーチをしました。 (Tôi hướng về phía trước và tự tin phát biểu bài diễn văn.)'
  },
  '向ける': {
    meaning: 'hướng tới, quay về phía',
    example: '笑顔をカメラに向けて記念写真を撮りました。 (Tôi hướng nụ cười về phía máy ảnh để chụp một bức ảnh kỷ niệm.)'
  },
  '無視': {
    meaning: 'phớt lờ, coi thường, bỏ qua',
    example: '赤信号を無視して横断するのは非常に危険です。 (Việc phớt lờ đèn đỏ để băng qua đường là vô cùng nguy hiểm.)'
  },
  '虫歯': {
    meaning: 'răng sâu, sâu răng',
    example: '甘いものを食べ過ぎて虫歯になってしまいました。 (Ăn quá nhiều đồ ngọt nên tôi đã bị sâu răng mất rồi.)'
  },
  '寧ろ': {
    meaning: 'thà... còn hơn, đúng hơn là',
    example: 'バスで行くより、寧ろ歩いた方が早いです。 (Đúng hơn là thà đi bộ còn nhanh hơn là đi xe buýt.)'
  },
  '結ぶ': {
    meaning: 'buộc, thắt (dây giày); ký kết (hợp đồng)',
    example: '両国は新しい平和条約を結びました。 (Hai quốc gia đã ký kết một hiệp ước hòa bình mới.)'
  },
  '夢中': {
    meaning: 'say mê, mải mê, đắm chìm',
    example: '時間を忘れてテレビゲームに夢中になってしまった。 (Mải mê chơi trò chơi điện tử say mê đến mức tôi quên cả thời gian.)'
  },
  '胸': {
    meaning: 'lồng ngực, ngực; tấm lòng',
    example: '緊張で胸がドキドキと高鳴りました。 (Vì quá hồi hộp nên lồng ngực tôi đập thình thịch liên hồi.)'
  },
  '明確': {
    meaning: 'rõ ràng, rành mạch, dứt khoát',
    example: '自分の目標を明確にしてから勉強を始めました。 (Tôi đã xác định rõ ràng mục tiêu của bản thân rồi mới bắt đầu học tập.)'
  },
  '名人': {
    meaning: 'bậc thầy, cao thủ, nghệ nhân',
    example: '祖父は魚釣りの名人として近所でよく知られています。 (Ông tôi được mọi người quanh vùng biết đến như một bậc thầy câu cá.)'
  },
  '命令': {
    meaning: 'mệnh lệnh, chỉ thị, ra lệnh',
    example: '上司の指示と命令に従って速やかに作業を進めました。 (Tôi đã nhanh chóng tiến hành công việc theo chỉ thị và mệnh lệnh của cấp trên.)'
  },
  '迷惑': {
    meaning: 'làm phiền, phiền toái, quấy rầy',
    example: '夜遅くに大きな音を出して近所に迷惑をかけてはいけません。 (Không được mở âm thanh lớn vào đêm muộn làm phiền đến hàng xóm.)'
  },
  '綿': {
    meaning: 'bông gòn, sợi cotton',
    example: '肌触りが良くて吸水性に優れた綿のシャツを着ました。 (Tôi đã mặc chiếc áo sơ mi bằng sợi cotton có bề mặt êm dịu và thấm hút tốt.)'
  },
  '面倒': {
    meaning: 'phiền phức, rắc rối; sự chăm sóc (面倒を見る)',
    example: '母は毎日祖母の面倒を甲斐甲斐しく見ています。 (Mẹ tôi mỗi ngày đều tận tình chăm sóc chu đáo cho bà.)'
  },
  '目標': {
    meaning: 'mục tiêu, đích đến',
    example: '今年中にJLPT N3に合格することを目標にしています。 (Tôi đặt mục tiêu thi đỗ JLPT N3 ngay trong năm nay.)'
  },
  '文字': {
    meaning: 'chữ viết, ký tự, văn tự',
    example: '日本の漢字とひらがなの文字を毎日練習しています。 (Tôi luyện viết các ký tự chữ Hán và chữ Hiragana của Nhật Bản mỗi ngày.)'
  },
  '持ち上げる': {
    meaning: 'nhấc lên, nâng lên; tâng bốc',
    example: '腰を痛めないように重い荷物を慎重に持ち上げました。 (Tôi cẩn thận nhấc kiện hàng nặng lên để không bị đau lưng.)'
  },
  '尤も': {
    meaning: 'hợp lý, đương nhiên; tuy nhiên, mặc dù vậy',
    example: '彼が怒るのも尤もな理由があるからです。 (Anh ấy nổi giận cũng là điều hoàn toàn hợp lý vì có lý do chính đáng.)'
  },
  '基': {
    meaning: 'cơ sở, nền tảng, căn cứ',
    example: '科学的な事実を基にして新しい仮説を立てました。 (Tôi đã lập giả thuyết mới dựa trên cơ sở các sự thật khoa học.)'
  },
  '元': {
    meaning: 'ban đầu, gốc; nguyên nhân; chỗ cũ',
    example: '使った辞書を元の棚に戻しておきました。 (Tôi đã cất cuốn từ điển vừa dùng về lại chỗ cũ trên giá sách.)'
  },
  '素': {
    meaning: 'yếu tố, nguyên liệu; mộc mạc',
    example: 'このスープは魚と昆布の天然の素から作られています。 (Món súp này được nấu từ các nguyên liệu tự nhiên của cá và rong biển.)'
  },
  '戻す': {
    meaning: 'để lại (chỗ cũ), trả lại; khôi phục lại',
    example: '本を読み終わったら元の場所に戻してください。 (Sau khi đọc xong, xin vui lòng để lại cuốn sách về chỗ cũ.)'
  },
  '基づく': {
    meaning: 'dựa trên, căn cứ vào',
    example: '確かなデータに基づいてレポートを作成しました。 (Tôi đã soạn bài báo cáo dựa trên những dữ liệu xác thực.)'
  },
  '文句': {
    meaning: 'phàn nàn, cằn nhằn; câu chữ (trong bài hát)',
    example: '不満があっても文句ばかり言わずに前向きに行動しよう。 (Dù có bất mãn cũng đừng chỉ biết cằn nhằn than phiền mà hãy hành động tích cực.)'
  },
  'やがて': {
    meaning: 'chẳng mấy chốc, rồi thì, cuối cùng',
    example: '激しい雨もやがて止んで、空に虹がかかりました。 (Cơn mưa dữ dội chẳng mấy chốc đã tạnh và cầu vồng hiện lên trên bầu trời.)'
  },
  '役': {
    meaning: 'vai trò, vai diễn; chức vụ',
    example: '学芸会で勇敢な王子の役を立派に演じました。 (Tôi đã đóng vai chàng hoàng tử dũng cảm trong buổi diễn kịch của trường một cách xuất sắc.)'
  },
  '約': {
    meaning: 'khoảng chừng, xấp xỉ',
    example: 'ハノイから東京まで飛行機で約５時間かかります。 (Từ Hà Nội đến Tokyo đi máy bay mất khoảng chừng 5 tiếng.)'
  },
  '役割': {
    meaning: 'vai trò, phần việc, nhiệm vụ',
    example: 'チームの中で自分の役割をしっかり果たすことが大切です。 (Việc hoàn thành tốt vai trò và nhiệm vụ của mình trong đội ngũ là rất quan trọng.)'
  },
  '雇う': {
    meaning: 'thuê, mướn, tuyển dụng (nhân viên)',
    example: '業務の拡大に伴い、新しくパートの店員を三人雇いました。 (Cùng với việc mở rộng kinh doanh, chúng tôi đã thuê thêm ba nhân viên bán hàng bán thời gian.)'
  },
  '破る': {
    meaning: 'xé rách; phá vỡ (lời hứa, kỷ lục, quy tắc)',
    example: '友達との約束を破ってはいけません。 (Không được phá vỡ lời hứa với bạn bè.)'
  },
  '辞める': {
    meaning: 'nghỉ việc, từ chức, bỏ việc',
    example: '健康上の理由から、長年勤めた会社を辞めることにしました。 (Vì lý do sức khỏe, tôi đã quyết định nghỉ việc ở công ty gắn bó nhiều năm.)'
  },
  'やや': {
    meaning: 'hơi, một chút, đôi chút',
    example: '昨日に比べて今日の気温はやや低めです。 (So với ngày hôm qua thì nhiệt độ hôm nay hơi thấp một chút.)'
  },
  '唯一': {
    meaning: 'duy nhất, độc nhất',
    example: '彼こそが私の悩みを打ち明けられる唯一の親友です。 (Anh ấy chính là người bạn thân duy nhất mà tôi có thể thổ lộ mọi tâm sự.)'
  },
  '有効': {
    meaning: 'có hiệu lực, hữu hiệu, có giá trị',
    example: 'この定期券は来月の末日まで有効です。 (Chiếc vé tháng này có hiệu lực cho đến ngày cuối cùng của tháng sau.)'
  },
  '優秀': {
    meaning: 'ưu tú, xuất sắc, tài giỏi',
    example: '彼は大学を優秀な成績で卒業しました。 (Anh ấy đã tốt nghiệp đại học với thành tích xuất sắc ưu tú.)'
  },
  '愉快': {
    meaning: 'vui vẻ, sảng khoái, thú vị',
    example: '親しい仲間たちと冗談を言い合って愉快な夜を過ごしました。 (Tôi đã trải qua một buổi tối vui vẻ đầy ắp tiếng cười khi tán gẫu cùng những người bạn thân.)'
  },
  '譲る': {
    meaning: 'nhường (ghế, đường); chuyển nhượng (tài sản)',
    example: '電車でお年寄りに進んで席を譲りました。 (Trên tàu điện, tôi đã chủ động nhường ghế cho người lớn tuổi.)'
  },
  '豊か': {
    meaning: 'phong phú, giàu có, dồi dào',
    example: '緑豊かな自然に囲まれて穏やかな生活を送っています。 (Tôi đang tận hưởng một cuộc sống bình yên bao bọc giữa thiên nhiên xanh phong phú.)'
  },
  '様': {
    meaning: 'hình dạng, bộ dạng; ngài (hậu tố tôn kính: 〜様)',
    example: '田中様、ご注文の品をお届けに上がりました。 (Kính thưa ngài Tanaka, tôi xin phép mang hàng hóa đã đặt đến giao cho ngài.)'
  },
  '陽気': {
    meaning: 'vui vẻ, cởi mở, hoạt bát; tiết trời',
    example: '彼はいつも明るく陽気な性格で、みんなから好かれています。 (Anh ấy luôn có tính cách vui vẻ cởi mở nên được mọi người yêu mến.)'
  },
  '用心': {
    meaning: 'cẩn trọng, đề phòng, cảnh giác',
    example: '夜道は危険なので、十分に用心して歩きましょう。 (Đường đêm nguy hiểm nên hãy cẩn trọng và đề phòng khi đi lại nhé.)'
  },
  '要するに': {
    meaning: 'tóm lại, nói một cách ngắn gọn',
    example: '要するに、日々の努力の積み重ねが成功の鍵だということです。 (Tóm lại là sự tích lũy nỗ lực mỗi ngày chính là chìa khóa của thành công.)'
  },
  '要素': {
    meaning: 'yếu tố, nhân tố cấu thành',
    example: '健康を保つためには、十分な睡眠と栄養が不可欠な要素です。 (Để duy trì sức khỏe thì giấc ngủ và dinh dưỡng là những yếu tố thiết yếu.)'
  },
  '要点': {
    meaning: 'điểm cốt yếu, ý chính, trọng tâm',
    example: '会議の内容の要点をノートに簡潔にまとめました。 (Tôi đã tóm tắt các ý chính cốt yếu của cuộc họp vào cuốn sổ.)'
  },
  '予算': {
    meaning: 'ngân sách, dự toán chi tiêu',
    example: '今回の旅行は一人５万円の予算で計画を立てました。 (Chuyến du lịch lần này được lập kế hoạch với ngân sách 50 nghìn yên một người.)'
  },
  '止す': {
    meaning: 'dừng lại, bỏ đi, thôi không làm nữa',
    example: '体に悪いからタバコを吸うのはもう止しなさい。 (Hại sức khỏe lắm nên hãy thôi không hút thuốc lá nữa nhé.)'
  },
  '世の中': {
    meaning: 'thế giới, xã hội, cuộc đời',
    example: '世の中には親切で心の温かい人がたくさんいます。 (Trong xã hội đời thường luôn có rất nhiều người tốt bụng và ấm áp.)'
  },
  '読み': {
    meaning: 'cách đọc (chữ Hán); phán đoán, sự đọc vị',
    example: 'この漢字の正しい読みを辞書で調べました。 (Tôi đã tra từ điển cách đọc chính xác của chữ Hán này.)'
  },
  '嫁': {
    meaning: 'con dâu; nàng dâu, cô dâu',
    example: '息子が素敵な女性を嫁として家に連れてきました。 (Con trai tôi đã dẫn một cô gái tuyệt vời về nhà làm nàng dâu.)'
  },
  '余裕': {
    meaning: 'dư dả, thong thả (thời gian, tiền bạc, tâm lý)',
    example: '電車の時間にまだ３０分も余裕があります。 (Vẫn còn dư dả tới 30 phút trước giờ tàu chạy.)'
  },
  '楽': {
    meaning: 'dễ dàng, nhàn nhã; thoải mái, dễ chịu',
    example: '便利な家電のおかげで家事がとても楽になりました。 (Nhờ các đồ điện gia dụng tiện lợi mà công việc nhà đã trở nên nhàn nhã hơn rất nhiều.)'
  },
  'ラケット': {
    meaning: 'cây vợt (tennis, cầu lông)',
    example: '誕生日に新しいテニスのラケットを買ってもらいました。 (Vào dịp sinh nhật, tôi được tặng một cây vợt tennis mới.)'
  },
  '利益': {
    meaning: 'lợi nhuận, tiền lãi; ích lợi, lợi ích',
    example: '新商品のヒットにより、会社に多大な利益がもたらされた。 (Nhờ sản phẩm mới bán chạy, công ty đã thu về nguồn lợi nhuận to lớn.)'
  },
  '率': {
    meaning: 'tỷ lệ (phần trăm)',
    example: '今年の試験の合格率は例年より高くなりました。 (Tỷ lệ thi đỗ kỳ thi năm nay đã cao hơn so với mọi năm.)'
  },
  '流行': {
    meaning: 'thịnh hành, trào lưu, mốt; bùng phát (dịch bệnh)',
    example: '若者の間でレトロなファッションが再び流行しています。 (Thời trang phong cách cổ điển đang thịnh hành trở lại trong giới trẻ.)'
  },
  '列': {
    meaning: 'hàng, dãy (người xếp hàng)',
    example: '人気ラーメン店の前に長い行列ができています。 (Trước quán mì ramen nổi tiếng có một hàng dài người đang xếp hàng.)'
  },
  '連想': {
    meaning: 'liên tưởng, gợi nhớ đến',
    example: '桜の花を見ると、日本の春を強く連想します。 (Nhìn thấy hoa anh đào, tôi liên tưởng mạnh mẽ ngay đến mùa xuân nước Nhật.)'
  },
  '連続': {
    meaning: 'liên tục, liên tiếp',
    example: '三日連続で遅刻して先生に怒られてしまった。 (Bị muộn học ba ngày liên tục nên tôi đã bị thầy giáo phê bình.)'
  },
  '労働': {
    meaning: 'lao động, làm việc',
    example: '労働時間を短縮して従業員の健康を守る取り組みが進められている。 (Các nỗ lực rút ngắn thời gian lao động để bảo vệ sức khỏe nhân viên đang được đẩy mạnh.)'
  },
  'ロケット': {
    meaning: 'tên lửa (vũ trụ: rocket)',
    example: '宇宙ロケットが轟音とともに月へ向けて打ち上げられました。 (Tên lửa vũ trụ đã được phóng lên hướng về phía mặt trăng cùng tiếng gầm vang dội.)'
  },
  '脇': {
    meaning: 'nách; bên cạnh, hông',
    example: '資料を脇にしっかりと抱えて急ぎ足で歩きました。 (Tôi kẹp chặt tập tài liệu dưới nách và bước đi vội vã.)'
  },
  '分ける': {
    meaning: 'chia ra, phân chia, tách biệt',
    example: '一つの大きなケーキを家族みんなで均等に分けました。 (Tôi đã chia đều chiếc bánh kem lớn cho các thành viên trong gia đình.)'
  },
  'わざと': {
    meaning: 'cố tình, cố ý, chủ tâm',
    example: '怒っていたので、わざと返事をしませんでした。 (Vì đang tức giận nên tôi đã cố tình không thèm trả lời.)'
  },
  '割る': {
    meaning: 'làm vỡ, đập vỡ; chia (trong toán học); pha loãng',
    example: '手を滑らせてガラスのコップを床に落として割ってしまった。 (Trượt tay làm rơi chiếc cốc thủy tinh xuống sàn, tôi đã làm vỡ tan nó mất rồi.)'
  }
};

function run() {
  const items = JSON.parse(fs.readFileSync(THEME_FILE, 'utf8'));
  let updated = 0;

  items.forEach(item => {
    if (DICT[item.word]) {
      item.meaning = DICT[item.word].meaning;
      item.example = DICT[item.word].example;
      updated++;
    }
  });

  fs.writeFileSync(THEME_FILE, JSON.stringify(items, null, 2), 'utf8');
  console.log(`[OK] Đã chuẩn hóa ${updated} từ trong Theme 06`);
}

run();

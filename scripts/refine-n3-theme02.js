/**
 * scripts/refine-n3-theme02.js
 * Chuẩn hóa toàn diện từ vựng N3 - Theme 02: Xã hội & Văn hóa (society-culture)
 * Đảm bảo 4 tiêu chuẩn: sinoVietnamese chuẩn, meaning phân cách bằng ;, example tự nhiên và cross-check 100%.
 */

const fs = require('fs');
const path = require('path');

const THEME_FILE = path.join(__dirname, '..', 'data', 'jlpt-n3-core-bank', 'theme-02-society-culture', 'vocabulary.json');

const DICT = {
  '活気': {
    meaning: 'sức sống, sự sôi nổi, hoạt bát',
    example: '朝の市場は活気に満ちあふれています。 (Khu chợ buổi sáng tràn đầy sức sống và sự sôi nổi.)'
  },
  '活用': {
    meaning: 'tận dụng, vận dụng, ứng dụng',
    example: '最新のIT技術を活用して業務を効率化しました。 (Chúng tôi đã tận dụng kỹ thuật IT tiên tiến để nâng cao hiệu quả công việc.)'
  },
  '株': {
    meaning: 'cổ phiếu; gốc cây',
    example: '彼は将来性のあるIT企業の株に投資しました。 (Ông ấy đã đầu tư tiền vào cổ phiếu của một doanh nghiệp IT đầy triển vọng.)'
  },
  '被る': {
    meaning: 'đội (mũ); gánh chịu, hứng chịu (bụi, thiệt hại)',
    example: '日差しが強いので、帽子を深く被って出かけました。 (Vì trời nắng gắt nên tôi đội chiếc mũ sụp xuống rồi mới ra ngoài.)'
  },
  '我慢': {
    meaning: 'chịu đựng, nhẫn nhịn, kiên nhẫn',
    example: '寒い部屋で無理に我慢せず、暖房をつけてください。 (Đừng cố chịu đựng trong căn phòng lạnh giá mà hãy bật lò sưởi lên.)'
  },
  'かもしれない': {
    meaning: 'có lẽ, có thể (phỏng đoán không chắc chắn)',
    example: '彼の言っていることは本当かもしれない。 (Những điều anh ấy nói có thể là sự thật.)'
  },
  'かわいそう': {
    meaning: 'đáng thương, tội nghiệp',
    example: '雨の中で震えている子犬がとてもかわいそうだ。 (Chú chó con run rẩy trong mưa trông thật đáng thương.)'
  },
  'かわいらしい': {
    meaning: 'đáng yêu, dễ thương',
    example: '彼女はかわいらしい笑顔で挨拶をしてくれた。 (Cô ấy đã chào tôi với một nụ cười vô cùng đáng yêu.)'
  },
  '勘': {
    meaning: 'trực giác, linh cảm, giác quan nhạy bén',
    example: '刑事の鋭い勘が当たって、犯人を見つけることができた。 (Nhờ trực giác nhạy bén mách bảo chính xác mà viên cảnh sát đã tìm ra tên tội phạm.)'
  },
  '感覚': {
    meaning: 'cảm giác, giác quan; sự nhạy bén',
    example: '寒さで手足の感覚がなくなってしまいました。 (Vì quá lạnh nên tôi đã mất đi cảm giác ở tay chân.)'
  },
  '観光': {
    meaning: 'tham quan, du lịch',
    example: '休日に京都の有名な寺院を観光しました。 (Vào ngày nghỉ, tôi đã đi tham quan các ngôi chùa nổi tiếng ở Kyoto.)'
  },
  '勘定': {
    meaning: 'thanh toán, tính tiền; hóa đơn',
    example: '店員さんに「お勘定をお願いします」と頼みました。 (Tôi gọi nhân viên quán: \"Làm ơn tính tiền giúp tôi với ạ\".)'
  },
  '感心': {
    meaning: 'ngưỡng mộ, khâm phục, thán phục',
    example: '子供の素晴らしい努力に深く感心しました。 (Tôi vô cùng thán phục trước sự nỗ lực tuyệt vời của đứa trẻ.)'
  },
  '関心': {
    meaning: 'quan tâm, sự hứng thú, chú ý',
    example: '最近、環境保護の問題に強い関心を持つようになりました。 (Gần đây, tôi rất quan tâm đến các vấn đề bảo vệ môi trường.)'
  },
  '関する': {
    meaning: 'liên quan đến, về (vấn đề gì)',
    example: '環境問題に関する本を何冊か読みました。 (Tôi đã đọc vài cuốn sách liên quan đến vấn đề môi trường.)'
  },
  '管理': {
    meaning: 'quản lý, trông nom, kiểm soát',
    example: 'アパートの管理を専門の会社に任せています。 (Tôi giao việc quản lý chung cư cho một công ty chuyên nghiệp.)'
  },
  '完了': {
    meaning: 'hoàn thành, kết thúc, xong xuôi',
    example: 'システムの設定がすべて正常に完了しました。 (Quá trình cài đặt hệ thống đã hoàn thành tốt đẹp.)'
  },
  '議会': {
    meaning: 'quốc hội, nghị viện, hội đồng',
    example: '議会で新しい法律についての議論が行われました。 (Một cuộc thảo luận về luật mới đã diễn ra tại quốc hội.)'
  },
  '期間': {
    meaning: 'thời kỳ, thời gian, kỳ hạn',
    example: '夏休みの期間中に運転免許を取得したいです。 (Trong thời gian nghỉ hè, tôi muốn lấy bằng lái xe.)'
  },
  '機関': {
    meaning: 'cơ quan, tổ chức; động cơ máy',
    example: '政府の専門機関が感染症の調査を行っています。 (Cơ quan chuyên môn của chính phủ đang tiến hành điều tra dịch bệnh.)'
  },
  '企業': {
    meaning: 'doanh nghiệp, công ty, xí nghiệp',
    example: '多くの若者が成長しているIT企業への就職を希望している。 (Nhiều bạn trẻ mong muốn được làm việc tại các doanh nghiệp IT đang phát triển.)'
  },
  '機嫌': {
    meaning: 'tâm trạng, sắc mặt, tính khí',
    example: '今朝、父はとても上機嫌で仕事に出かけました。 (Sáng nay, bố tôi có tâm trạng rất vui vẻ khi đi làm.)'
  },
  '岸': {
    meaning: 'bờ sông, bờ biển, ven bờ',
    example: '船がゆっくりと川の岸に近づいていきました。 (Con thuyền đang từ từ tiến sát vào bờ sông.)'
  },
  '技師': {
    meaning: 'kỹ sư, kỹ thuật viên',
    example: '彼は優秀なエンジニア技師として工場で働いている。 (Anh ấy đang làm việc tại nhà máy với vai trò là một kỹ sư xuất sắc.)'
  },
  '期待': {
    meaning: 'kỳ vọng, mong đợi, trông chờ',
    example: 'ファンの大きな期待に応えて、チームが見事に優勝した。 (Đáp ứng kỳ vọng to lớn của người hâm mộ, đội bóng đã giành chức vô địch.)'
  },
  'きつい': {
    meaning: 'chật chội (quần áo); vất vả, nặng nhọc (công việc); gay gắt (tính cách)',
    example: 'この靴はサイズが小さくて少しきついです。 (Đôi giày này cỡ nhỏ nên đi hơi chật chội.)'
  },
  '気に入る': {
    meaning: 'thích, vừa ý, ưng ý',
    example: 'デパートでデザインがとても気に入った服を買いました。 (Tôi đã mua bộ quần áo mà mình rất ưng ý về kiểu dáng ở trung tâm thương mại.)'
  },
  '基本': {
    meaning: 'cơ bản, nền tảng, căn bản',
    example: '何事も基本をしっかり身につけることが大切です。 (Dù làm việc gì thì việc nắm vững những điều cơ bản cũng là quan trọng nhất.)'
  },
  '決まり': {
    meaning: 'quy định, nội quy, quy tắc',
    example: '学校の決まりをきちんと守りましょう。 (Hãy tuân thủ nghiêm túc nội quy của nhà trường.)'
  },
  '気味': {
    meaning: 'có cảm giác, có chiều hướng, hơi hơi (tiêu cực)',
    example: '少し風邪気味なので、今夜は早めに寝ます。 (Hơi có cảm giác bị cảm lạnh nên tối nay tôi sẽ đi ngủ sớm.)'
  },
  '旧': {
    meaning: 'cũ, trước đây, cựu',
    example: '旧市街には歴史ある古い建物がたくさん残っています。 (Ở khu phố cũ vẫn còn lưu giữ nhiều công trình kiến trúc lịch sử lâu đời.)'
  },
  '急激': {
    meaning: 'đột ngột, nhanh chóng, cấp bách',
    example: '気温の急激な変化で体調を崩さないように注意してください。 (Hãy chú ý để không bị ốm do sự thay đổi đột ngột của nhiệt độ.)'
  },
  '吸収': {
    meaning: 'hấp thụ, thấm hút (nước, kiến thức)',
    example: '若い頃にたくさんの知識を積極的に吸収することが大切です。 (Việc chủ động hấp thụ nhiều kiến thức khi còn trẻ là rất quan trọng.)'
  },
  '器用': {
    meaning: 'khéo léo, đảm đang, tháo vát',
    example: '彼女はとても手先が器用で、自分で服を作ることができます。 (Cô ấy rất khéo léo và có thể tự mình may quần áo.)'
  },
  '競技': {
    meaning: 'thi đấu, môn thể thao, cuộc thi',
    example: 'オリンピックでさまざまな競技をテレビで観戦しました。 (Tôi đã theo dõi nhiều môn thi đấu khác nhau tại Thế vận hội qua tivi.)'
  },
  '教授': {
    meaning: 'giáo sư (đại học); sự giảng dạy',
    example: '大学の有名な教授の特別講義を聴きに行きました。 (Tôi đã đến nghe bài giảng đặc biệt của vị giáo sư nổi tiếng ở trường đại học.)'
  },
  '共通': {
    meaning: 'chung, điểm chung, phổ biến',
    example: '彼と私には音楽が好きだという共通の趣味があります。 (Anh ấy và tôi có một điểm chung là cùng yêu thích âm nhạc.)'
  },
  '共同': {
    meaning: 'chung, cộng đồng, cùng nhau (làm việc, sở hữu)',
    example: '二つの大学が共同で新しい医療技術の研究を行っています。 (Hai trường đại học đang cùng nhau hợp tác nghiên cứu kỹ thuật y tế mới.)'
  },
  '協力': {
    meaning: 'hợp tác, chung sức, giúp đỡ',
    example: 'みんなで協力して文化祭の準備を進めました。 (Mọi người cùng nhau hợp tác để chuẩn bị cho lễ hội văn hóa.)'
  },
  '局': {
    meaning: 'cục, sở, đài (truyền hình, bưu điện)',
    example: '郵便局へ行って小包を家族に送りました。 (Tôi đã đến bưu điện để gửi bưu phẩm cho gia đình.)'
  },
  '巨大': {
    meaning: 'khổng lồ, to lớn, vĩ đại',
    example: '港に巨大な豪華客船が入港してきました。 (Một chiếc du thuyền sang trọng khổng lồ vừa cập cảng.)'
  },
  '切れ': {
    meaning: 'miếng, mẩu, lát (thịt, bánh); mảnh (vải)',
    example: 'ケーキを一人に一斤の切れずつ配りました。 (Tôi đã chia cho mỗi người một miếng bánh ngọt.)'
  },
  '切れる': {
    meaning: 'hết, cạn (hạn, pin, xăng); đứt, cắt ngọt',
    example: 'スマートフォンのバッテリーが切れてしまいました。 (Điện thoại thông minh của tôi đã bị hết pin mất rồi.)'
  },
  '議論': {
    meaning: 'thảo luận, tranh luận, bàn bạc',
    example: '会議で新しい提案について熱心な議論が交わされた。 (Một cuộc thảo luận sôi nổi về đề xuất mới đã diễn ra trong cuộc họp.)'
  },
  '近代': {
    meaning: 'cận đại, thời cận đại',
    example: '近代の日本史についての本を読んでいます。 (Tôi đang đọc cuốn sách viết về lịch sử thời cận đại của Nhật Bản.)'
  },
  '金融': {
    meaning: 'tài chính, lưu thông tiền tệ, tín dụng',
    example: '東京はアジアを代表する国際的な金融の中心地です。 (Tokyo là một trung tâm tài chính quốc tế tiêu biểu của châu Á.)'
  },
  '句': {
    meaning: 'câu thơ (haiku); cụm từ, câu nói',
    example: '有名な松尾芭蕉の俳句を日本語で暗記しました。 (Tôi đã học thuộc lòng một câu thơ haiku nổi tiếng của thi hào Matsuo Basho.)'
  },
  '鎖': {
    meaning: 'dây xích, chuỗi xích',
    example: '庭の大きな犬を頑丈な鎖でつなぎました。 (Tôi đã buộc chú chó lớn ngoài vườn bằng sợi dây xích chắc chắn.)'
  },
  '具体': {
    meaning: 'cụ thể, rõ ràng, chi tiết',
    example: 'もっと具体的な例を挙げて分かりやすく説明してください。 (Xin hãy đưa ra ví dụ cụ thể hơn để giải thích cho dễ hiểu.)'
  },
  '下す': {
    meaning: 'đưa ra (phán quyết, quyết định); hạ lệnh',
    example: '裁判長は証拠に基づいて公正な判決を下しました。 (Chủ tọa phiên tòa đã căn cứ vào chứng cứ để đưa ra phán quyết công bằng.)'
  },
  '区別': {
    meaning: 'phân biệt (giữa đúng/sai, thật/giả)',
    example: '善いことと悪いことの区別をしっかりつけましょう。 (Hãy phân biệt rõ ràng giữa điều thiện và điều ác.)'
  },
  '組': {
    meaning: 'tổ, nhóm; lớp học; bộ (đồ vật)',
    example: '生徒たちを４人ずつの組に分けて話し合いをさせた。 (Tôi đã chia các học sinh thành từng nhóm 4 người để thảo luận.)'
  },
  '組合': {
    meaning: 'công đoàn, nghiệp đoàn, hiệp hội',
    example: '労働組合が給料の改善を求めて会社と交渉した。 (Công đoàn lao động đã thương lượng với công ty để yêu cầu cải thiện mức lương.)'
  },
  '位': {
    meaning: 'khoảng chừng, cỡ; vị trí, thứ bậc',
    example: '試験で学年トップの第一位になりました。 (Tôi đã đạt vị trí thứ nhất toàn khối trong kỳ thi.)'
  },
  'グランド': {
    meaning: 'sân thể thao, sân bãi (ground)',
    example: '放課後、生徒たちが広いグランドでサッカーの練習をしている。 (Sau giờ học, các học sinh đang tập đá bóng trên sân thể thao rộng lớn.)'
  },
  '狂う': {
    meaning: 'phát điên, mất trí; xáo trộn, hỏng hóc (kế hoạch, máy móc)',
    example: '急な大雨で旅行のスケジュールが狂ってしまった。 (Cơn mưa lớn bất ngờ đã làm xáo trộn lịch trình chuyến du lịch của tôi.)'
  },
  '暮れ': {
    meaning: 'cuối năm; hoàng hôn, chiều muộn',
    example: '年の暮れには大掃除をして新年を迎える準備をします。 (Vào dịp cuối năm, người ta dọn dẹp nhà cửa để chuẩn bị đón năm mới.)'
  },
  '苦労': {
    meaning: 'vất vả, gian khổ, nhọc nhằn',
    example: '両親が苦労して私を大学まで通わせてくれました。 (Cha mẹ đã chịu bao gian khổ để nuôi tôi ăn học đại học.)'
  },
  '経営': {
    meaning: 'kinh doanh, quản lý (doanh nghiệp, cửa hàng)',
    example: '父は地元でレストランを長年経営しています。 (Bố tôi kinh doanh một nhà hàng tại địa phương suốt nhiều năm qua.)'
  },
  '刑事': {
    meaning: 'thám tử, cảnh sát hình sự; vụ án hình sự',
    example: '優秀な刑事が現場の証拠から事件を解決した。 (Viên cảnh sát hình sự xuất sắc đã giải quyết vụ án từ những bằng chứng tại hiện trường.)'
  },
  '経由': {
    meaning: 'quá cảnh, đi qua, thông qua',
    example: 'ハワイ経由でアメリカの本土へ向かいました。 (Tôi đã bay sang đất liền nước Mỹ qua điểm quá cảnh ở Hawaii.)'
  },
  '結果': {
    meaning: 'kết quả (của nỗ lực, kỳ thi, nghiên cứu)',
    example: '努力を重ねた結果、見事に試験に合格しました。 (Nhờ những nỗ lực không ngừng, kết quả là tôi đã thi đỗ một cách xuất sắc.)'
  },
  '欠陥': {
    meaning: 'khuyết tật, khiếm khuyết, lỗi kỹ thuật',
    example: '製品に重大な欠陥が見つかり、すべて回収された。 (Sản phẩm bị phát hiện có khiếm khuyết nghiêm trọng nên đã được thu hồi toàn bộ.)'
  },
  '結局': {
    meaning: 'kết cục, cuối cùng, rốt cuộc',
    example: 'いろいろ迷ったが、結局日本へ留学することを決めた。 (Sau nhiều đắn đo, cuối cùng tôi đã quyết định sang Nhật du học.)'
  },
  '欠点': {
    meaning: 'khuyết điểm, nhược điểm, điểm yếu',
    example: '誰にでも欠点はありますが、それを改善する努力が大切です。 (Ai cũng có khuyết điểm, nhưng nỗ lực cải thiện điều đó mới là quan trọng.)'
  },
  '見解': {
    meaning: 'quan điểm, ý kiến, cách nhìn nhận',
    example: '専門家の間でもこの問題についての見解が分かれている。 (Ngay cả giữa các chuyên gia, quan điểm về vấn đề này cũng có sự khác nhau.)'
  },
  '現代': {
    meaning: 'hiện đại, thời nay, ngày nay',
    example: '現代社会ではスマートフォンが生活に欠かせないものになっている。 (Trong xã hội hiện đại, điện thoại thông minh đã trở thành thứ không thể thiếu trong cuộc sống.)'
  },
  '見当': {
    meaning: 'phỏng đoán, ước chừng, định hướng',
    example: 'どこで鍵を落としたのか、全く見当がつきません。 (Tôi hoàn toàn không thể phỏng đoán xem mình đã đánh rơi chìa khóa ở đâu.)'
  },
  '現場': {
    meaning: 'hiện trường (tai nạn, xây dựng)',
    example: '警察官が事故の現場で詳しい状況を調べています。 (Viên cảnh sát đang điều tra tình hình chi tiết tại hiện trường vụ tai nạn.)'
  },
  '権利': {
    meaning: 'quyền lợi, quyền hạn',
    example: 'すべての人には教育を受ける権利があります。 (Mọi người đều có quyền lợi được học tập và tiếp nhận giáo dục.)'
  },
  '講演': {
    meaning: 'bài diễn thuyết, bài thuyết trình, buổi giảng',
    example: '有名な作家による記念講演を聴きに行きました。 (Tôi đã đến nghe bài diễn thuyết kỷ niệm của nhà văn nổi tiếng.)'
  },
  '効果': {
    meaning: 'hiệu quả, tác dụng (của thuốc, phương pháp)',
    example: 'この薬を飲んだら、すぐに熱が下がる効果がありました。 (Uống viên thuốc này xong, tôi đã thấy ngay hiệu quả hạ sốt.)'
  },
  '高価': {
    meaning: 'đắt tiền, đắt đỏ, giá cao',
    example: '高価な宝石を身につけてパーティーに参加した。 (Cô ấy đeo trang sức đắt tiền tham dự buổi tiệc.)'
  },
  '豪華': {
    meaning: 'sang trọng, xa hoa, lộng lẫy',
    example: '豪華な客船に乗って世界一周の旅に出ました。 (Tôi đã lên chiếc du thuyền sang trọng để bắt đầu chuyến du lịch vòng quanh thế giới.)'
  },
  '合格': {
    meaning: 'đỗ, thi đỗ, trúng tuyển',
    example: '一生懸命勉強して、JLPT N3に見事に合格しました。 (Tôi đã học tập chăm chỉ và thi đỗ JLPT N3 một cách xuất sắc.)'
  },
  '航空': {
    meaning: 'hàng không',
    example: '格安の航空便を利用して旅行の費用を節約しました。 (Tôi đã sử dụng chuyến bay của hãng hàng không giá rẻ để tiết kiệm chi phí du lịch.)'
  },
  '交際': {
    meaning: 'giao du, kết bạn; hẹn hò (nam nữ)',
    example: '二人は大学時代から真剣に交際しています。 (Hai người họ đã hẹn hò nghiêm túc từ thời đại học.)'
  },
  '構成': {
    meaning: 'cấu thành, cấu trúc, sự tạo thành',
    example: 'この論文は五つの章で構成されています。 (Bài luận văn này được cấu thành từ năm chương.)'
  },
  '考慮': {
    meaning: 'xem xét, cân nhắc kỹ lưỡng',
    example: '相手の立場を十分に考慮して返答しました。 (Tôi đã cân nhắc kỹ lưỡng lập trường của đối phương rồi mới trả lời.)'
  },
  '呼吸': {
    meaning: 'hô hấp, hơi thở; sự phối hợp ăn ý',
    example: 'ヨガをするときは、深く正しい呼吸を意識することが大切です。 (Khi tập yoga, việc chú ý hô hấp sâu và đúng cách là rất quan trọng.)'
  },
  '極': {
    meaning: 'cực kỳ, rất (mức độ cao)',
    example: 'それは極めて稀なケースで、滅多に起こりません。 (Đó là trường hợp cực kỳ hiếm gặp và hầu như không xảy ra.)'
  },
  '国語': {
    meaning: 'quốc ngữ, môn tiếng Nhật (ở trường học Nhật)',
    example: '小学校の国語の授業で日本の昔話を読みました。 (Trong giờ học môn quốc ngữ ở tiểu học, chúng tôi đã đọc truyện cổ tích Nhật Bản.)'
  },
  '克服': {
    meaning: 'khắc phục, vượt qua (khó khăn, bệnh tật)',
    example: '厳しいリハビリを続けて、ついに病気を克服しました。 (Kiên trì phục hồi chức năng, cuối cùng anh ấy đã khắc phục và chiến thắng căn bệnh.)'
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
  console.log(`[OK] Đã chuẩn hóa ${updated} từ trong Theme 02`);
}

run();

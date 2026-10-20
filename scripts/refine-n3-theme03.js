/**
 * scripts/refine-n3-theme03.js
 * Chuẩn hóa toàn diện từ vựng N3 - Theme 03: Công việc & Thương mại kinh doanh (work-business)
 * Đảm bảo 4 tiêu chuẩn: sinoVietnamese chuẩn, meaning phân cách bằng ;, example tự nhiên và cross-check 100%.
 */

const fs = require('fs');
const path = require('path');

const THEME_FILE = path.join(__dirname, '..', 'data', 'jlpt-n3-core-bank', 'theme-03-work-business', 'vocabulary.json');

const DICT = {
  '国民': {
    meaning: 'người dân, nhân dân, công dân',
    example: '国民の幸せと平和を心から願っています。 (Tôi tha thiết cầu mong hạnh phúc và hòa bình cho người dân trong nước.)'
  },
  '国家': {
    meaning: 'quốc gia, đất nước, nhà nước',
    example: '国家の発展のために多くの優秀な人材が必要とされている。 (Để phát triển quốc gia, cần có rất nhiều nhân tài xuất sắc.)'
  },
  '頃': {
    meaning: 'khoảng chừng (thời gian), hồi, độ (khi nào)',
    example: '子供の頃、よくこの川で友達と魚釣りをしました。 (Hồi còn nhỏ, tôi thường cùng bạn bè câu cá ở con sông này.)'
  },
  '転ぶ': {
    meaning: 'ngã, té ngã, trượt ngã',
    example: '滑りやすい雪道で足を滑らせて転んでしまった。 (Tôi trượt chân và bị ngã trên con đường đầy tuyết trơn trượt.)'
  },
  '今回': {
    meaning: 'lần này, dịp này',
    example: '今回のJLPT試験で必ず合格できるように全力を尽くします。 (Tôi sẽ dốc toàn lực để chắc chắn thi đỗ trong kỳ thi JLPT lần này.)'
  },
  '今後': {
    meaning: 'từ nay về sau, sau này, trong tương lai',
    example: '今後の進路について先生や両親とじっくり相談しました。 (Tôi đã bàn bạc kỹ lưỡng với thầy cô và cha mẹ về định hướng tương lai sau này.)'
  },
  '混雑': {
    meaning: 'đông đúc, tắc nghẽn, hỗn loạn',
    example: '朝の通勤時間帯は電車がとても混雑します。 (Vào khung giờ đi làm buổi sáng, tàu điện vô cùng đông đúc.)'
  },
  '際': {
    meaning: 'khi, nhân dịp, trong trường hợp',
    example: '火災の際は、エレベーターを使わずに階段で避難してください。 (Trong trường hợp xảy ra hỏa hoạn, xin đừng dùng thang máy mà hãy sơ tán bằng cầu thang bộ.)'
  },
  '最中': {
    meaning: 'đúng lúc, đang giữa lúc (hành động cao trào)',
    example: '食事の最中に突然電話がかかってきました。 (Đúng lúc đang ăn cơm thì đột nhiên có điện thoại gọi đến.)'
  },
  '裁判': {
    meaning: 'xét xử, phiên tòa, tòa án',
    example: '裁判長は公平な証拠に基づいて厳正な判決を下しました。 (Chủ tọa phiên tòa đã căn cứ vào các chứng cứ công bằng để đưa ra phán quyết nghiêm minh.)'
  },
  '幸い': {
    meaning: 'may mắn, thật may (khi thoát nạn/gặp điều tốt)',
    example: '事故に遭いましたが、幸い怪我はありませんでした。 (Gặp tai nạn nhưng thật may mắn là tôi không bị thương tích gì.)'
  },
  '境': {
    meaning: 'ranh giới, biên giới, ranh giới chia cắt',
    example: '川を境にして二つの町に分かれています。 (Lấy dòng sông làm ranh giới, vùng đất này chia thành hai thị trấn.)'
  },
  '昨': {
    meaning: 'hôm qua, năm ngoái, trước đây (tiền tố ghép)',
    example: '昨年の秋に日本へ留学に来ました。 (Tôi đã sang Nhật du học từ mùa thu năm ngoái.)'
  },
  '作物': {
    meaning: 'hoa màu, cây trồng, nông sản',
    example: '台風の被害で畑の大切な作物が倒れてしまった。 (Do ảnh hưởng của cơn bão, những cây trồng quý giá ngoài ruộng đã bị đổ rạp.)'
  },
  '支える': {
    meaning: 'nâng đỡ, chống đỡ; ủng hộ, chu cấp',
    example: '家族みんなで病気の父を支えました。 (Cả gia đình cùng nhau nâng đỡ và chăm sóc người bố bị ốm.)'
  },
  '座席': {
    meaning: 'chỗ ngồi, ghế ngồi',
    example: '電車の指定席の座席を予約しました。 (Tôi đã đặt trước chỗ ngồi ghế chỉ định trên tàu điện.)'
  },
  '誘う': {
    meaning: 'rủ rê, mời mọc (đi chơi, ăn uống)',
    example: '週末に友達を誘って映画を見に行きました。 (Cuối tuần tôi rủ bạn bè đi xem phim.)'
  },
  '札': {
    meaning: 'tiền giấy; thẻ, thẻ bài (thẻ tên, bùa hộ mệnh)',
    example: '財布の中に一万円の札が３枚入っています。 (Trong ví có ba tờ tiền giấy mệnh giá mười nghìn yên.)'
  },
  'ざっと': {
    meaning: 'đại khái, sơ qua, lướt qua',
    example: '会議の前に資料をざっと読みました。 (Trước cuộc họp, tôi đã đọc lướt qua các tài liệu một cách sơ bộ.)'
  },
  'さっぱり': {
    meaning: 'sảng khoái, nhẹ nhõm; hoàn toàn không (đi với phủ định)',
    example: 'お風呂に入って気分がさっぱりしました。 (Sau khi tắm bồn xong, tâm trạng tôi thấy vô cùng sảng khoái.)'
  },
  '左右': {
    meaning: 'trái phải; chi phối, tác động làm thay đổi',
    example: '道を渡るときは左右をよく見て安全を確認しましょう。 (Khi qua đường, hãy quan sát kỹ hai bên trái phải để đảm bảo an toàn.)'
  },
  '更に': {
    meaning: 'hơn nữa, thêm nữa, càng thêm',
    example: '夜になると雨が更に激しく降り始めました。 (Đến đêm, cơn mưa bắt đầu trút xuống càng thêm dữ dội.)'
  },
  '直に': {
    meaning: 'trực tiếp, gián tiếp; ngay bên cạnh',
    example: '大切な用件なので、電話ではなく直に会って話したい。 (Vì là việc quan trọng nên tôi muốn gặp trực tiếp để trao đổi chứ không qua điện thoại.)'
  },
  'しかも': {
    meaning: 'hơn nữa, lại còn (bổ sung tính chất)',
    example: 'この店の料理は美味しくて、しかも値段が安いです。 (Món ăn của quán này vừa ngon mà giá lại còn rất rẻ nữa.)'
  },
  '支給': {
    meaning: 'cấp phát, chi trả (lương, phụ cấp, đồng phục)',
    example: '会社から毎月交通費が全額支給されます。 (Công ty chi trả toàn bộ tiền trợ cấp đi lại mỗi tháng.)'
  },
  'しきりに': {
    meaning: 'liên tục, không ngừng, dồn dập',
    example: '外で犬がしきりに吠えています。 (Ở bên ngoài, con chó đang sủa liên tục không ngừng.)'
  },
  '時刻': {
    meaning: 'thời khắc, thời gian, giờ giấc',
    example: '電車の出発時刻を確認してから家を出ました。 (Tôi kiểm tra thời gian xuất phát của tàu điện rồi mới rời khỏi nhà.)'
  },
  '自身': {
    meaning: 'bản thân, tự mình',
    example: '自分自身の力で問題を解決することが大切です。 (Việc tự mình giải quyết vấn đề bằng năng lực của bản thân là rất quan trọng.)'
  },
  '思想': {
    meaning: 'tư tưởng, triết lý, quan điểm',
    example: '彼の思想は多くの若者に深い影響を与えました。 (Tư tưởng của ông ấy đã có ảnh hưởng sâu sắc đến nhiều thanh niên.)'
  },
  '次第': {
    meaning: 'ngay sau khi (V-stem + 次第); tùy thuộc vào (N + 次第)',
    example: '準備ができ次第、すぐに出発しましょう。 (Ngay sau khi chuẩn bị xong, chúng ta hãy xuất phát ngay nhé.)'
  },
  '従う': {
    meaning: 'tuân theo, làm theo; đi dọc theo',
    example: '会社のルールに従って業務を進めてください。 (Xin hãy tiến hành công việc theo đúng quy định của công ty.)'
  },
  'したがって': {
    meaning: 'do đó, vì vậy (liên từ nối quan hệ nhân quả)',
    example: '事故で電車が止まりました。したがって、遅刻しました。 (Tàu điện bị dừng do sự cố. Vì vậy tôi đã bị muộn giờ.)'
  },
  '実現': {
    meaning: 'hiện thực hóa, trở thành hiện thực',
    example: '長年の夢がついに実現しました。 (Ước mơ ấp ủ suốt nhiều năm cuối cùng đã trở thành hiện thực.)'
  },
  '実行': {
    meaning: 'thực hành, thực hiện, thi hành (kế hoạch)',
    example: '計画を立てるだけでなく、すぐに行動に移して実行することが大切です。 (Không chỉ lập kế hoạch mà việc bắt tay thực hiện ngay mới là quan trọng.)'
  },
  'じっと': {
    meaning: 'chăm chú, bất động, kiên nhẫn',
    example: '子供はじっと猫の動きを見つめていました。 (Đứa bé chăm chú nhìn từng cử động của chú mèo.)'
  },
  '指導': {
    meaning: 'chỉ đạo, hướng dẫn, dẫn dắt',
    example: '先生の熱心な指導のおかげで、無事に合格できました。 (Nhờ sự chỉ đạo và hướng dẫn tận tình của thầy giáo mà tôi đã thi đỗ tốt đẹp.)'
  },
  '品': {
    meaning: 'hàng hóa, món đồ, phẩm chất',
    example: 'デパートには高品質な品がたくさん並んでいます。 (Tại trung tâm thương mại có bày bán rất nhiều món hàng chất lượng cao.)'
  },
  '芝居': {
    meaning: 'kịch, vở kịch; trò giả vờ',
    example: '劇場で感動的な歌舞伎の芝居を観劇しました。 (Tôi đã đi xem một vở kịch Kabuki vô cùng xúc động tại nhà hát.)'
  },
  '死亡': {
    meaning: 'tử vong, qua đời, chết',
    example: '大地震による死亡者の数はさらに増え続けています。 (Số người tử vong do trận động đất lớn vẫn tiếp tục gia tăng.)'
  },
  '資本': {
    meaning: 'tiền vốn, vốn đầu tư; tư bản',
    example: '新しい事業を始めるために十分な資本を集めました。 (Tôi đã huy động đủ nguồn tiền vốn để khởi nghiệp kinh doanh mới.)'
  },
  'しまう': {
    meaning: 'cất vào, để vào chỗ cũ; hoàn tất',
    example: '使ったハサミを元の引き出しにしまいました。 (Tôi đã cất chiếc kéo vừa dùng xong vào lại ngăn kéo cũ.)'
  },
  'しまった': {
    meaning: 'thôi rồi!, chết rồi! (thốt lên khi lỡ làm điều gì)',
    example: 'しまった、宿題を家に忘れてきてしまった！ (Chết rồi, tôi lỡ để quên bài tập ở nhà mất rồi!)'
  },
  '自慢': {
    meaning: 'tự hào, khoe khoang',
    example: '母は料理の腕前をいつも自慢にしています。 (Mẹ luôn tự hào khoe về tài nấu ăn khéo léo của mình.)'
  },
  '事務': {
    meaning: 'công việc văn phòng, sự vụ',
    example: '大学を卒業してから、商社で事務の仕事をしています。 (Sau khi tốt nghiệp đại học, tôi làm công việc văn phòng tại một công ty thương mại.)'
  },
  '示す': {
    meaning: 'cho thấy, xuất trình, biểu thị',
    example: '入り口で警備員に身分証明書を示してください。 (Xin hãy xuất trình thẻ căn cước cho nhân viên bảo vệ tại lối vào.)'
  },
  '占める': {
    meaning: 'chiếm, nắm giữ (tỷ lệ, vị trí)',
    example: 'この製品は国内市場の半分以上のシェアを占めています。 (Sản phẩm này chiếm hơn một nửa thị phần trong nước.)'
  },
  '周囲': {
    meaning: 'xung quanh, chu vi; người xung quanh',
    example: '周囲の人々に迷惑をかけないように静かにしましょう。 (Hãy giữ trật tự để không làm phiền đến những người xung quanh.)'
  },
  '住宅': {
    meaning: 'nhà ở, khu dân cư',
    example: '駅から歩いて５分の静かな住宅街に住んでいます。 (Tôi sống trong một khu nhà ở yên tĩnh chỉ cách ga 5 phút đi bộ.)'
  },
  '主義': {
    meaning: 'chủ nghĩa, nguyên tắc sống, phương châm',
    example: '何事も諦めないのが私の人生の主義です。 (Không bao giờ từ bỏ trước bất kỳ điều gì chính là nguyên tắc sống của đời tôi.)'
  },
  '宿泊': {
    meaning: 'trọ lại, nghỉ qua đêm, lưu trú',
    example: '旅行の初日は温泉旅館に宿泊しました。 (Ngày đầu tiên của chuyến du lịch, tôi đã nghỉ qua đêm tại một quán trọ suối nước nóng.)'
  },
  '手段': {
    meaning: 'phương thức, biện pháp, cách thức',
    example: '目的を達成するためにあらゆる手段を尽くしました。 (Tôi đã dùng mọi phương thức và biện pháp để đạt được mục tiêu.)'
  },
  '出版': {
    meaning: 'xuất bản (sách, báo)',
    example: '有名な小説家の新作がついに来月出版されます。 (Tác phẩm mới của nhà văn nổi tiếng cuối cùng cũng sẽ được xuất bản vào tháng sau.)'
  },
  '主要': {
    meaning: 'chủ yếu, cốt lõi, trọng yếu',
    example: 'この街の主要な産業は自動車の製造です。 (Ngành công nghiệp chủ yếu của thành phố này là sản xuất xe ô tô.)'
  },
  '種類': {
    meaning: 'chủng loại, loại hình, các loại',
    example: 'この店には数百種類もの美味しいチーズがあります。 (Cửa hàng này có tới hàng trăm chủng loại phô mai thơm ngon.)'
  },
  '順': {
    meaning: 'thứ tự, tuần tự, theo thứ tự',
    example: '名前の五十音順に並んで教室に入ってください。 (Xin hãy xếp hàng theo thứ tự bảng chữ cái rồi bước vào lớp học.)'
  },
  '瞬間': {
    meaning: 'khoảnh khắc, chớp mắt, giây lát',
    example: '合格を知った瞬間、家族全員で抱き合って喜んだ。 (Khoảnh khắc biết tin thi đỗ, cả gia đình đã ôm chầm lấy nhau trong niềm vui sướng.)'
  },
  '順調': {
    meaning: 'thuận lợi, suôn sẻ, trôi chảy',
    example: '新しいプロジェクトは予定通り順調に進んでいます。 (Dự án mới đang tiến triển rất thuận lợi theo đúng kế hoạch.)'
  },
  '上京': {
    meaning: 'lên thủ đô (Tokyo), lên Tokyo',
    example: '大学に進学するために、地元の町を出て上京しました。 (Để theo học đại học, tôi đã rời quê nhà và lên thủ đô Tokyo.)'
  },
  '常識': {
    meaning: 'kiến thức thông thường, lẽ thường, phép lịch sự cơ bản',
    example: '公共の場所で静かにするのは社会人の常識です。 (Giữ trật tự ở nơi công cộng là phép lịch sự thông thường của người trưởng thành.)'
  },
  '少々': {
    meaning: 'một chút, một lát, một ít',
    example: '担当者が参りますので、こちらで少々お待ちください。 (Người phụ trách sắp đến rồi, xin quý khách vui lòng đợi một chút tại đây ạ.)'
  },
  '生じる': {
    meaning: 'phát sinh, nảy sinh (vấn đề, hiểu lầm)',
    example: '二人の間にちょっとした誤解が生じてしまった。 (Giữa hai người đã nảy sinh một chút hiểu lầm nhỏ.)'
  },
  '上等': {
    meaning: 'cao cấp, thượng hạng, chất lượng cao',
    example: '記念日にレストランで上等なワインを味わいました。 (Vào ngày kỷ niệm, tôi đã thưởng thức chai rượu vang thượng hạng tại nhà hàng.)'
  },
  '衝突': {
    meaning: 'va chạm, đâm nhau; xung đột (ý kiến)',
    example: '交差点で車とバイクが衝突する事故が起きました。 (Tại ngã tư đã xảy ra vụ va chạm giữa xe ô tô và xe máy.)'
  },
  '少年': {
    meaning: 'thiếu niên, cậu bé',
    example: 'その少年は将来プロのサッカー選手になりたいと夢見ている。 (Cậu thiếu niên ấy luôn mơ ước tương lai sẽ trở thành cầu thủ bóng đá chuyên nghiệp.)'
  },
  '商売': {
    meaning: 'buôn bán, kinh doanh, thương mại',
    example: '祖父の代から続く八百屋の商売を継ぎました。 (Tôi đã kế thừa nghề buôn bán cửa hàng rau củ gia truyền từ thời ông nội.)'
  },
  '食糧': {
    meaning: 'lương thực, thực phẩm',
    example: '世界中で食糧の不足に苦しむ人々を支援する活動が求められている。 (Rất cần các hoạt động hỗ trợ những người đang thiếu thốn lương thực trên khắp thế giới.)'
  },
  '知らせ': {
    meaning: 'tin tức, thông báo, tin báo',
    example: '故郷の両親から元気で過ごしているという嬉しい知らせが届いた。 (Tôi đã nhận được tin báo vui từ cha mẹ ở quê nhà báo rằng mọi người vẫn khỏe mạnh.)'
  },
  '神経': {
    meaning: 'thần kinh; sự nhạy cảm, tâm trạng',
    example: '試験の前日は神経が過敏になり、なかなか眠れなかった。 (Đêm trước ngày thi, dây thần kinh của tôi căng thẳng đến mức mãi không ngủ được.)'
  },
  '信仰': {
    meaning: 'tín ngưỡng, đức tin',
    example: '人々は神聖な神社で深い信仰の祈りを捧げました。 (Mọi người đã dâng lời cầu nguyện với đức tin sâu sắc tại ngôi đền thần thánh.)'
  },
  '親戚': {
    meaning: 'họ hàng, bà con thân thuộc',
    example: 'お正月に親戚がみんな集まって賑やかに過ごしました。 (Dịp Tết, tất cả họ hàng đều sum họp quây quần thật ấm cúng.)'
  },
  '慎重': {
    meaning: 'thận trọng, cẩn trọng, chu đáo',
    example: '大事な契約を結ぶ前に、書類を慎重に確認しました。 (Trước khi ký hợp đồng quan trọng, tôi đã thận trọng kiểm tra lại toàn bộ giấy tờ.)'
  },
  '審判': {
    meaning: 'trọng tài (thể thao); sự phán xét',
    example: '審判が試合終了の笛をピッと吹きました。 (Vị trọng tài đã thổi còi kết thúc trận đấu.)'
  },
  '人物': {
    meaning: 'nhân vật, con người, nhân tài',
    example: '彼は我が国の歴史上、極めて重要な指導者的人物です。 (Ông ấy là một nhân vật lãnh đạo cực kỳ quan trọng trong lịch sử nước nhà.)'
  },
  '人類': {
    meaning: 'nhân loại, loài người',
    example: '月への着陸は全人類にとって偉大な一歩でした。 (Việc đặt chân lên mặt trăng là một bước tiến vĩ đại đối với toàn nhân loại.)'
  },
  '水準': {
    meaning: 'tiêu chuẩn, trình độ, mực nước',
    example: 'この国の医療水準は世界でもトップクラスです。 (Trình độ y tế của quốc gia này thuộc hàng đầu trên thế giới.)'
  },
  '推薦': {
    meaning: 'tiến cử, đề cử, giới thiệu',
    example: '先生が私を奨学金の候補者として推薦してくれました。 (Thầy giáo đã đề cử tôi làm ứng viên nhận học bổng.)'
  },
  '末': {
    meaning: 'cuối (tháng, năm); kết cục sau cùng',
    example: '今月の末までにレポートを提出しなければなりません。 (Tôi phải nộp bài báo cáo trước thời điểm cuối tháng này.)'
  },
  '優れる': {
    meaning: 'xuất sắc, vượt trội, ưu tú',
    example: '彼女は語学の才能に極めて優れています。 (Cô ấy xuất sắc vượt trội về năng khiếu ngoại ngữ.)'
  },
  '少しも': {
    meaning: 'một chút cũng không... (đi với phủ định)',
    example: '彼は危険な状況でも少しも慌てませんでした。 (Anh ấy không hề tỏ ra hoảng loạn một chút nào ngay cả trong tình huống nguy hiểm.)'
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
  console.log(`[OK] Đã chuẩn hóa ${updated} từ trong Theme 03`);
}

run();

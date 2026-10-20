/**
 * scripts/refine-n3-theme05.js
 * Chuẩn hóa toàn diện từ vựng N3 - Theme 05: Động từ & Tính từ (verbs-adjectives)
 * Đảm bảo 4 tiêu chuẩn: sinoVietnamese chuẩn, meaning phân cách bằng ;, example tự nhiên và cross-check 100%.
 */

const fs = require('fs');
const path = require('path');

const THEME_FILE = path.join(__dirname, '..', 'data', 'jlpt-n3-core-bank', 'theme-05-verbs-adjectives', 'vocabulary.json');

const DICT = {
  'デモ': {
    meaning: 'biểu tình, tuần hành; bản thử nghiệm (demo)',
    example: '平和を求める大規模なデモが街で行われました。 (Một cuộc biểu tình quy mô lớn đòi hòa bình đã diễn ra trên phố.)'
  },
  '典型': {
    meaning: 'điển hình, khuôn mẫu tiêu biểu',
    example: 'これは日本の伝統的な木造建築の典型的な例です。 (Đây là một ví dụ điển hình của kiến trúc nhà gỗ truyền thống Nhật Bản.)'
  },
  '党': {
    meaning: 'đảng, đảng phái chính trị',
    example: '彼は新しい政党を結成して選挙に立候補した。 (Anh ấy đã thành lập một đảng phái chính trị mới để ra tranh cử.)'
  },
  '答案': {
    meaning: 'bài thi, giấy thi, bài làm',
    example: '試験時間が終了したので、先生に答案を提出しました。 (Thời gian làm bài thi kết thúc, tôi đã nộp bài thi cho giáo viên.)'
  },
  '同一': {
    meaning: 'đồng nhất, giống hệt nhau, cùng một...',
    example: '二つの事件の現場から同一の指紋が検出されました。 (Cùng một dấu vân tay đồng nhất đã được phát hiện tại hiện trường hai vụ án.)'
  },
  'どうか': {
    meaning: 'xin vui lòng, làm ơn (khẩn khoản)',
    example: 'どうか私の願いを聞き入れてください。 (Xin vui lòng lắng nghe và chấp thuận ước nguyện của tôi.)'
  },
  '同時': {
    meaning: 'đồng thời, cùng một lúc',
    example: '雷の光と音がほぼ同時に響き渡りました。 (Ánh chớp và tiếng sấm rền vang gần như đồng thời cùng một lúc.)'
  },
  'どうしても': {
    meaning: 'dù thế nào đi nữa, nhất định phải; không thể nào (đi với phủ định)',
    example: 'どうしても思い出せない単語を辞書で調べました。 (Tôi đã tra từ điển từ vựng mà mình dù thế nào cũng không thể nhớ ra.)'
  },
  '同様': {
    meaning: 'giống như, tương tự như, như nhau',
    example: '昨日と同様に、今日も一日中晴天が続いています。 (Tương tự như ngày hôm qua, hôm nay trời cũng tiếp tục nắng ráo cả ngày.)'
  },
  '通す': {
    meaning: 'cho qua, dẫn đường (khách); xuyên qua, xâu qua',
    example: '案内係がお客様を静かな応接室へ通しました。 (Người hướng dẫn đã dẫn khách vào phòng tiếp tân yên tĩnh.)'
  },
  '時': {
    meaning: 'khi, lúc, thời gian',
    example: '困った時には、いつでも友達に相談してください。 (Những khi gặp khó khăn, bạn hãy luôn tâm sự với bạn bè nhé.)'
  },
  '解く': {
    meaning: 'giải (toán, câu đố); tháo gỡ (nút thắt, hiểu lầm)',
    example: '難しい数学の難問を自分の力で見事に解きました。 (Tôi đã tự mình giải xong câu hỏi toán học hóc búa một cách xuất sắc.)'
  },
  '得意': {
    meaning: 'giỏi, sở trường; tự đắc, đắc ý',
    example: '私の得意な料理は母から教わったカレーライスです。 (Món ăn sở trường mà tôi giỏi nấu nhất là món cơm cà ri học từ mẹ.)'
  },
  '独特': {
    meaning: 'độc đáo, đặc sắc, mang nét riêng biệt',
    example: 'この地方には独特の方言と伝統文化が残っています。 (Vùng đất này vẫn lưu giữ nét phương ngữ độc đáo và văn hóa truyền thống riêng biệt.)'
  },
  '解ける': {
    meaning: 'được giải tỏa, được giải quyết (hiểu lầm, bài toán); tuột ra',
    example: 'じっくり話し合ったおかげで、二人の誤解が解けました。 (Nhờ nói chuyện thấu đáo mà hiểu lầm giữa hai người đã được giải tỏa hoàn toàn.)'
  },
  'ところで': {
    meaning: 'nhân tiện, tiện đây (chuyển chủ đề)',
    example: 'もうすぐ試験ですね。ところで、昨日の宿題は終わりましたか。 (Sắp thi rồi nhỉ. Nhân tiện cho hỏi bạn đã làm xong bài tập hôm qua chưa?)'
  },
  '都市': {
    meaning: 'đô thị, thành phố lớn',
    example: '東京は世界で最も人口密度が高い都市の一つです。 (Tokyo là một trong những đô thị có mật độ dân số cao nhất thế giới.)'
  },
  '閉じる': {
    meaning: 'đóng (sách, mắt, hội nghị)',
    example: '目を閉じて、静かに心を落ち着かせました。 (Tôi nhắm mắt lại và để cho tâm hồn mình lắng dịu.)'
  },
  '途端': {
    meaning: 'ngay khi, vừa mới... thì ngay lập tức (〜たとたん)',
    example: '部屋に入った途端、懐かしい香りが漂ってきた。 (Ngay khi vừa bước vào phòng thì một mùi hương quen thuộc đã thoang thoảng bay đến.)'
  },
  'トップ': {
    meaning: 'hàng đầu, vị trí đầu bảng, người dẫn đầu',
    example: '彼は学年トップの成績で名門大学に合格しました。 (Anh ấy thi đỗ vào trường đại học danh tiếng với thành tích đứng hàng đầu toàn khối.)'
  },
  '留める': {
    meaning: 'giữ lại, đọng lại, ghim lại',
    example: '心に深く留めておくべき大切な教訓を学びました。 (Tôi đã học được một bài học quý giá cần ghi nhớ và giữ lại sâu trong lòng.)'
  },
  '共に': {
    meaning: 'cùng nhau, cùng với; đồng thời',
    example: '苦難を共に乗り越えてきた仲間との絆は強い。 (Mối dây liên kết với những người bạn đã cùng nhau vượt qua gian khó là vô cùng bền chặt.)'
  },
  '取り上げる': {
    meaning: 'cầm lấy, nhặt lên; đưa ra thảo luận (chủ đề); tước đoạt',
    example: '今日の会議では若者の教育問題をテーマに取り上げました。 (Cuộc họp hôm nay đã đưa ra thảo luận chủ đề về vấn đề giáo dục giới trẻ.)'
  },
  '努力': {
    meaning: 'nỗ lực, cố gắng, phấn đấu',
    example: '目標を達成するために日々努力を重ねています。 (Tôi nỗ lực từng ngày để đạt được mục tiêu.)'
  },
  'ドレス': {
    meaning: 'váy dạ hội, đầm dự tiệc (dress)',
    example: '結婚式のために華やかな白いドレスを選びました。 (Tôi đã chọn một chiếc váy dạ hội màu trắng lộng lẫy cho lễ cưới.)'
  },
  '取れる': {
    meaning: 'tuột ra, rơi ra (cúc áo); tháo bỏ được (mệt mỏi)',
    example: 'シャツのボタンが取れてしまったので、自分で縫いました。 (Chiếc cúc áo sơ mi bị tuột ra nên tôi đã tự khâu lại.)'
  },
  '内容': {
    meaning: 'nội dung (bài giảng, cuốn sách, hợp đồng)',
    example: '契約書の内容をサインする前にしっかり確認しました。 (Tôi đã kiểm tra kỹ nội dung hợp đồng trước khi ký tên.)'
  },
  '仲': {
    meaning: 'mối quan hệ (giữa người với người: 仲が良い)',
    example: '私たちは昔から何でも話し合える仲が良い友達です。 (Chúng tôi từ xưa đến nay là những người bạn có mối quan hệ rất thân thiết có thể tâm sự mọi điều.)'
  },
  '眺め': {
    meaning: 'tầm nhìn, phong cảnh, quang cảnh',
    example: 'ホテルの部屋の窓からの眺めが素晴らしかったです。 (Tầm nhìn quang cảnh từ cửa sổ phòng khách sạn thật tuyệt vời.)'
  },
  '眺める': {
    meaning: 'ngắm nhìn, nhìn chăm chú (cảnh vật)',
    example: '夕暮れ時に海辺で沈む夕日を静かに眺めました。 (Vào lúc hoàng hôn, tôi lặng lẽ ngắm nhìn ánh mặt trời lặn bên bờ biển.)'
  },
  '流れる': {
    meaning: 'chảy (dòng nước, thời gian); phát ra (âm nhạc)',
    example: '澄んだ川の清流が静かに流れています。 (Dòng nước trong vắt của con sông đang êm ả chảy.)'
  },
  '謎': {
    meaning: 'điều bí ẩn, câu đố, bí mật',
    example: '古代文明には今でも解明されていない多くの謎があります。 (Nền văn minh cổ đại vẫn còn rất nhiều điều bí ẩn chưa được giải mã.)'
  },
  '生': {
    meaning: 'sống, tươi sống (thực phẩm: 生魚); tươi (bia: 生ビール)',
    example: '居酒屋で冷たい生ビールと新鮮な刺身を注文しました。 (Tại quán nhậu izakaya, tôi đã gọi một ly bia tươi mát lạnh và món cá sống sashimi tươi ngon.)'
  },
  '怠ける': {
    meaning: 'lười biếng, chểnh mảng (học tập, công việc)',
    example: '仕事を怠けていると、周りの信頼を失ってしまいます。 (Nếu lười biếng trong công việc, bạn sẽ đánh mất niềm tin của mọi người xung quanh.)'
  },
  '何とか': {
    meaning: 'bằng cách nào đó, xoay sở (vượt qua)',
    example: 'みんなで協力して何とか危機を乗り越えることができました。 (Mọi người cùng hợp tác và bằng cách nào đó đã vượt qua được cuộc khủng hoảng.)'
  },
  '苦手': {
    meaning: 'kém, không giỏi; không hợp, sợ (món ăn, người)',
    example: '私は人前で話すことや数字の計算が苦手です。 (Tôi không giỏi và rất sợ việc phải phát biểu trước đám đông hay tính toán các con số.)'
  },
  '握る': {
    meaning: 'nắm (tay), cầm (vô lăng); làm (cơm nắm)',
    example: '母親の手をしっかり握りながら歩きました。 (Tôi vừa đi vừa nắm chặt lấy bàn tay của mẹ.)'
  },
  '日常': {
    meaning: 'hàng ngày, thường ngày, cuộc sống đời thường',
    example: '忙しい日常を忘れて、温泉でゆっくりくつろぎました。 (Quên đi cuộc sống thường ngày bận rộn, tôi thư giãn thong thả tại suối nước nóng.)'
  },
  '日中': {
    meaning: 'ban ngày (thời gian có ánh sáng); Nhật - Trung (quan hệ)',
    example: '日中は暖かくなりますが、朝晩は冷え込みます。 (Ban ngày trời ấm dần lên nhưng sáng và tối thì se lạnh.)'
  },
  '抜く': {
    meaning: 'nhổ (răng, cỏ); rút ra, vượt qua',
    example: '休日に庭の雑草をきれいに抜きました。 (Vào ngày nghỉ, tôi đã nhổ sạch cỏ dại ngoài vườn.)'
  },
  '抜ける': {
    meaning: 'rụng (tóc, răng); thoát ra, biến mất (hơi ga, mệt mỏi)',
    example: 'お風呂に入ったら一日の疲れがすっかり抜けました。 (Ngâm mình trong bồn tắm xong, sự mệt mỏi trong ngày đã biến mất hoàn toàn.)'
  },
  '根': {
    meaning: 'rễ (cây); gốc rễ, bản chất',
    example: '大きな木の根が地面深くまでしっかりと伸びています。 (Những chiếc rễ của cái cây to cắm sâu và vững chắc vào lòng đất.)'
  },
  '願う': {
    meaning: 'cầu nguyện, ước mong, nhờ vả',
    example: '家族全員の健康と幸せを神社で願いました。 (Tôi đã cầu nguyện cho sức khỏe và hạnh phúc của cả gia đình tại ngôi đền.)'
  },
  '熱中': {
    meaning: 'say mê, mải mê, chuyên tâm',
    example: '時間を忘れるほど小説の読書に熱中してしまった。 (Tôi mải mê đọc tiểu thuyết say mê đến mức quên cả thời gian.)'
  },
  '年代': {
    meaning: 'thập niên, niên đại, thế hệ',
    example: '１９８０年代の日本の流行歌を聴くのが好きです。 (Tôi thích nghe những ca khúc thịnh hành vào thập niên 1980 của Nhật Bản.)'
  },
  '野': {
    meaning: 'cánh đồng, đồng nội',
    example: '緑の野に色とりどりの可憐な花が咲いています。 (Trên cánh đồng xanh ngát nở rộ muôn sắc hoa rực rỡ.)'
  },
  '能': {
    meaning: 'kịch Noh (nghệ thuật truyền thống Nhật); năng lực',
    example: '日本の伝統芸能である能の舞台を初めて鑑賞しました。 (Lần đầu tiên tôi được thưởng thức sân khấu kịch Noh, một loại hình nghệ thuật truyền thống của Nhật Bản.)'
  },
  '残り': {
    meaning: 'phần còn lại, số còn thừa',
    example: '今日中に残りの宿題をすべて終わらせます。 (Tôi sẽ hoàn thành tất cả phần bài tập còn lại ngay trong hôm nay.)'
  },
  '乗せる': {
    meaning: 'cho lên xe, chở (khách); đặt lên',
    example: '駅まで友達を車に乗せて送ってあげました。 (Tôi đã cho người bạn lên xe và chở bạn ra tận nhà ga.)'
  },
  '除く': {
    meaning: 'loại trừ, trừ ra, ngoại trừ',
    example: '日曜日を除いて、毎日図書館で自習しています。 (Ngoại trừ ngày Chủ nhật, ngày nào tôi cũng tự học ở thư viện.)'
  },
  '望み': {
    meaning: 'ước nguyện, nguyện vọng, hy vọng',
    example: 'あなたの望みが叶うことを心から祈っています。 (Tôi thành tâm cầu chúc cho ước nguyện của bạn sẽ trở thành hiện thực.)'
  },
  '伸ばす': {
    meaning: 'kéo dài, duỗi (tay, chân); nuôi (tóc, râu); phát triển (năng lực)',
    example: 'ストレッチをして背中や足の筋肉をしっかり伸ばしました。 (Tôi tập thể dục kéo giãn để duỗi thẳng cơ lưng và chân.)'
  },
  '伸びる': {
    meaning: 'dài ra (tóc, râu); phát triển, tăng trưởng (doanh số, chiều cao)',
    example: '彼の日本語能力はここ数ヶ月でぐんと伸びました。 (Năng lực tiếng Nhật của anh ấy đã phát triển vượt bậc trong vài tháng qua.)'
  },
  '述べる': {
    meaning: 'bày tỏ, trình bày, nêu ra (ý kiến, cảm tưởng)',
    example: '会議の最後に自分の意見を堂々と述べました。 (Vào cuối cuộc họp, tôi đã đàng hoàng bày tỏ ý kiến của bản thân.)'
  },
  '昇る': {
    meaning: 'mọc (mặt trời); lên cao, thăng tiến',
    example: '東の空から朝日が美しく昇ってきました。 (Ánh mặt trời buổi sớm đang mọc lên tuyệt đẹp từ phía đông.)'
  },
  'のんびり': {
    meaning: 'thong thả, thảnh thơi, ung dung',
    example: '休日は家で音楽を聴きながらのんびりと過ごすのが好きです。 (Ngày nghỉ tôi thích thong thả nghỉ ngơi ở nhà vừa nghe nhạc.)'
  },
  '場': {
    meaning: 'nơi chốn, địa điểm; tình huống, hoàn cảnh',
    example: 'その場の空気を読んで適切に行動することが大切です。 (Việc biết quan sát tình huống hoàn cảnh để hành xử phù hợp là rất quan trọng.)'
  },
  'パーセント': {
    meaning: 'phần trăm (%)',
    example: '消費税が８パーセントから１０パーセントに上がりました。 (Thuế tiêu thụ đã tăng từ 8 phần trăm lên 10 phần trăm.)'
  },
  'バイオリン': {
    meaning: 'đàn vĩ cầm, đàn vi-ô-lông (violin)',
    example: '彼女は子供の頃からバイオリンを熱心に練習しています。 (Cô ấy đã chăm chỉ luyện tập đàn vĩ cầm từ thuở nhỏ.)'
  },
  'パイプ': {
    meaning: 'đường ống (nước); tẩu thuốc; mối quan hệ',
    example: '工場の地下に太い水道のパイプが通っています。 (Dưới lòng đất nhà máy có đường ống dẫn nước lớn chạy qua.)'
  },
  '莫大': {
    meaning: 'khổng lồ, to lớn, kếch xù (chi phí, tài sản)',
    example: '新しい事業を始めるために莫大な資金が必要になります。 (Cần một nguồn tiền vốn khổng lồ để bắt đầu dự án kinh doanh mới.)'
  },
  '爆発': {
    meaning: 'phát nổ, vụ nổ; bùng nổ (cảm xúc, dân số)',
    example: '火災の現場でガスボンベが突然爆発しました。 (Bình ga đột nhiên phát nổ tại hiện trường vụ hỏa hoạn.)'
  },
  '激しい': {
    meaning: 'dữ dội, mãnh liệt, gay gắt',
    example: '外では激しい雨と強い風が吹き荒れています。 (Ở bên ngoài, cơn mưa dữ dội và gió mạnh đang gào thét.)'
  },
  '始まり': {
    meaning: 'sự bắt đầu, khởi đầu, nguồn gốc',
    example: '桜の花が咲くと、新しい春の始まりを感じます。 (Khi hoa anh đào nở rộ, tôi cảm nhận được sự bắt đầu của mùa xuân mới.)'
  },
  '外す': {
    meaning: 'tháo ra, cởi ra (kính, khẩu trang); rời khỏi (chỗ ngồi)',
    example: '食事の時はマスクを外してください。 (Xin hãy tháo khẩu trang ra khi dùng bữa nhé.)'
  },
  '肌': {
    meaning: 'làn da; tính cách, phong cách',
    example: '冬は空気が乾燥して肌が荒れやすくなります。 (Mùa đông không khí khô hanh nên làn da rất dễ bị nứt nẻ.)'
  },
  '畑': {
    meaning: 'ruộng, cánh đồng trồng hoa màu',
    example: '祖父が畑で新鮮なトマトやキュウリを育てています。 (Ông tôi đang trồng cà chua và dưa chuột tươi ngon ngoài ruộng.)'
  },
  '発行': {
    meaning: 'phát hành (hộ chiếu, thẻ, sách báo)',
    example: '市役所で新しいマイナンバーカードを発行してもらいました。 (Tôi đã được tòa thị chính phát hành thẻ My Number mới.)'
  },
  'ばったり': {
    meaning: 'tình cờ bắt gặp (người quen); ngã phịch xuống',
    example: '駅の改札口で昔の同僚にばったり会いました。 (Tôi tình cờ bắt gặp người đồng nghiệp cũ tại cửa soát vé nhà ga.)'
  },
  '放す': {
    meaning: 'thả ra, buông tay (chim, cá, tay)',
    example: '捕まえた小鳥を空へ逃がして放してあげました。 (Tôi đã thả chú chim nhỏ vừa bắt được bay về bầu trời.)'
  },
  '離す': {
    meaning: 'tách ra, để cách xa, buông ra',
    example: '目を離さないように、子供をしっかり見守ってください。 (Xin hãy chú ý trông chừng đứa trẻ, đừng buông lơi rời mắt nhé.)'
  },
  '離れる': {
    meaning: 'cách xa, rời xa, xa cách',
    example: '実家を離れて東京で一人暮らしを始めました。 (Tôi đã rời xa gia đình để bắt đầu cuộc sống tự lập một mình tại Tokyo.)'
  },
  '羽': {
    meaning: 'lông vũ, cánh (chim); con (đơn vị đếm chim, thỏ)',
    example: '鳥が美しい羽を広げて大空を飛んでいます。 (Chú chim dang đôi cánh lông vũ tuyệt đẹp bay lượn trên bầu trời.)'
  },
  '原': {
    meaning: 'cánh đồng, thảo nguyên, đồng cỏ',
    example: '広大な高原で牛や羊がのんびりと草を食んでいます。 (Trên thảo nguyên rộng lớn, đàn bò và cừu đang thong thả gặm cỏ.)'
  },
  '張る': {
    meaning: 'căng ra, giăng (lưới); dán (tem, áp phích); đóng băng',
    example: '冬になると池に厚い氷が張ります。 (Khi mùa đông đến, mặt hồ đóng một lớp băng dày.)'
  },
  '反抗': {
    meaning: 'chống đối, phản kháng, cãi lại',
    example: '思春期の子供は親に対して反抗的な態度をとることがあります。 (Trẻ con ở tuổi dậy thì đôi khi có thái độ phản kháng đối với cha mẹ.)'
  },
  '判断': {
    meaning: 'phán đoán, đánh giá, nhận định',
    example: '状況を冷静に観察して、正しい判断を下すことが大切です。 (Việc quan sát tình hình một cách bình tĩnh để đưa ra phán đoán đúng đắn là rất quan trọng.)'
  },
  '轢く': {
    meaning: 'cán qua, chèn qua (bằng xe cộ)',
    example: '道路を横断していた猫が車に轢かれそうになった。 (Chú mèo đang băng qua đường suýt chút nữa thì bị xe ô tô cán qua.)'
  },
  '飛行': {
    meaning: 'chuyến bay, sự bay (trên không)',
    example: '飛行機の長時間の飛行で少し疲れました。 (Tôi thấy hơi mệt mỏi sau chuyến bay dài của máy bay.)'
  },
  '膝': {
    meaning: 'đầu gối',
    example: '転んで膝をすりむいてしまいました。 (Tôi bị ngã và trầy xước cả đầu gối.)'
  },
  '必死': {
    meaning: 'liều mạng, dốc hết sức, quyết tử',
    example: '試験に合格するために、毎日必死に勉強しています。 (Để thi đỗ kỳ thi, tôi đang dốc hết sức học tập mỗi ngày.)'
  },
  '一言': {
    meaning: 'vài lời, một lời, lời ngắn gọn',
    example: 'パーティーの終わりに感謝の一言を述べました。 (Vào cuối bữa tiệc, tôi đã nói vài lời tri ân ngắn gọn.)'
  },
  '独り': {
    meaning: 'một mình, đơn độc',
    example: '休日は部屋で独り静かに読書を楽しんでいます。 (Vào ngày nghỉ, tôi thích ở một mình trong phòng yên tĩnh đọc sách.)'
  },
  '批評': {
    meaning: 'phê bình, bình phẩm, đánh giá',
    example: '専門家が新作の映画について鋭い批評を行いました。 (Chuyên gia đã đưa ra bài phê bình sắc sảo về bộ phim mới.)'
  },
  '紐': {
    meaning: 'sợi dây, dây buộc (dây giày, dây gói)',
    example: '靴の紐がほどけてしまったので、結び直しました。 (Dây giày bị tuột nên tôi đã cúi xuống buộc lại sợi dây.)'
  },
  '表情': {
    meaning: 'nét mặt, biểu cảm khuôn mặt',
    example: '彼女の明るい表情を見て安心しました。 (Nhìn thấy nét mặt rạng rỡ của cô ấy, tôi đã yên tâm phần nào.)'
  },
  '便': {
    meaning: 'chuyến bay, bưu kiện; sự tiện lợi',
    example: 'ハノイ行きの最終便の飛行機に無事に乗ることができました。 (Tôi đã kịp lên chuyến bay cuối cùng đi Hà Nội an toàn.)'
  },
  '笛': {
    meaning: 'tiếng còi, cái còi; cây sáo',
    example: '審判が笛を吹いてサッカーの試合が始まりました。 (Trọng tài thổi còi và trận đấu bóng đá bắt đầu.)'
  },
  '不可': {
    meaning: 'không được, không thể; điểm không đạt',
    example: 'この部屋への無断立ち入りは不可となっています。 (Nghiêm cấm không được tự ý bước vào căn phòng này.)'
  },
  '服装': {
    meaning: 'trang phục, quần áo ăn mặc',
    example: '面接には清潔で礼儀正しい服装で行きましょう。 (Hãy mặc trang phục lịch sự và sạch sẽ khi đi phỏng vấn.)'
  },
  '含む': {
    meaning: 'bao gồm, chứa đựng',
    example: 'この料金には宿泊費と朝食代が含まれています。 (Mức giá này đã bao gồm cả tiền phòng ở và bữa sáng.)'
  },
  '不幸': {
    meaning: 'bất hạnh, không may; tang sự',
    example: '親戚に不幸があったため、急遽実家に帰省しました。 (Vì nhà họ hàng có tang sự nên tôi phải vội vã về quê.)'
  },
  '節': {
    meaning: 'khớp xương; đốt tre; giai điệu, khúc ca',
    example: '風邪をひいて手足の関節の節々が痛みます。 (Bị cảm cúm nên các khớp xương ở tay chân của tôi đau nhức.)'
  },
  '不思議': {
    meaning: 'kỳ lạ, huyền bí, kỳ diệu',
    example: '森の中でとても不思議な形をしたキノコを見つけました。 (Tôi tìm thấy một cây nấm có hình thù rất kỳ lạ trong rừng.)'
  },
  '不自由': {
    meaning: 'bất tiện; tàn tật, khiếm khuyết (thân thể)',
    example: '足を怪我して歩くのに不自由しています。 (Bị thương ở chân nên việc đi lại của tôi gặp nhiều bất tiện.)'
  },
  '夫人': {
    meaning: 'phu nhân, bà (vợ của người có địa vị)',
    example: '大使館のパーティーで大統領夫人にご挨拶いたしました。 (Tôi đã chào hỏi phu nhân tổng thống tại bữa tiệc ở đại sứ quán.)'
  },
  '防ぐ': {
    meaning: 'phòng ngừa, ngăn chặn, bảo vệ',
    example: 'うがいをしてウイルスの感染を防ぎましょう。 (Hãy súc miệng để ngăn chặn sự lây nhiễm của virus.)'
  },
  '舞台': {
    meaning: 'sân khấu (kịch, ca múa); vũ đài',
    example: 'スポットライトを浴びて俳優が舞台に登場しました。 (Dưới ánh đèn sân khấu, người diễn viên đã bước ra biểu diễn.)'
  },
  '縁': {
    meaning: 'mép, rìa, viền; duyên nợ',
    example: 'メガネの縁を拭いてきれいにしました。 (Tôi đã lau sạch phần viền mép của chiếc kính mắt.)'
  },
  '筆': {
    meaning: 'bút lông (viết thư pháp), cọ vẽ',
    example: '日本の書道では筆と墨を使って文字を書きます。 (Trong nghệ thuật thư pháp Nhật Bản, người ta dùng bút lông và mực tàu để viết chữ.)'
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
  console.log(`[OK] Đã chuẩn hóa ${updated} từ trong Theme 05`);
}

run();

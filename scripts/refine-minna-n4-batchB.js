/**
 * scripts/refine-minna-n4-batchB.js
 * Chuẩn hóa toàn bộ 129 từ vựng cuối cùng của Minna N4 (Unit 42 -> Unit 50 & 3 từ liên quan):
 * - Sửa các lỗi chính tả và dịch máy trầm trọng:
 *   + 生懸命 -> 一生懸命 (いっしょうけんめい: hết sức, chăm chỉ)
 *   + おちゃます -> 落ちます (おちます: rơi, rớt)
 *   + ポーランド: Phần Lan -> Ba Lan
 *   + ミキサ -> ミキサー (máy xay sinh tố)
 *   + 順序: thu dọn -> thứ tự, tuần tự
 *   + 縁起が 悪い -> điềm gở, không may mắn
 *   + ロース -> コース (course: cung đường chạy, lộ trình)
 *   + スタート: ngôi sao -> vạch xuất phát, bắt đầu
 *   + 以上です: làm ơn chạy ra ngoài -> Xin hết ạ (kết thúc báo cáo)
 *   + 優勝します: đầu tiên -> đoạt chức vô địch
 *   + 博士: bác sĩ -> tiến sĩ
 *   + ホルチン -> ホルモン (hormone, nội tiết tố)
 *   + 講師: bài giảng -> giảng viên
 *   + 作品: làm việc -> tác phẩm nghệ thuật
 *   + 作曲: âm nhạc -> sáng tác nhạc
 *   + 入館: cơ sở nhập cư -> Cục Quản lý Xuất nhập cảnh
 *   + かないます: màu đỏ -> [ước mơ] thành hiện thực
 *   + おげんきでいらっしゃいますか: màu đỏ -> Quý vị dạo này vẫn mạnh khỏe chứ ạ
 *   + お」城 -> お城 (tòa thành cổ)
 *   + ミュヘン -> ミュンヘン (thành phố Munich)
 * - Đảm bảo 100% câu ví dụ độc lập, không lặp lại tiền tố/hậu tố
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

const batchBDict = {
  // THEME 02 & UNIT 39
  '急速': {
    meaning: 'nhanh chóng, cấp tốc (diễn tả sự biến đổi với tốc độ cao)',
    example: 'モバイル端末の目覚ましい普及に伴い、デジタル技術が急速に進歩した。 (Cùng với sự phổ biến vượt bậc của thiết bị di động, công nghệ số đã tiến bộ chóng mặt.)'
  },
  'ケース': {
    meaning: 'trường hợp (case) hoặc hộp, ốp bảo vệ đồ vật',
    example: '大切な楽器を衝撃から守るため、頑丈な専用ケースに入れて持ち運んでいる。 (Để bảo vệ nhạc cụ quý khỏi va đập, tôi luôn bỏ nó vào hộp chuyên dụng rất chắc chắn khi mang đi.)'
  },
  '電話代': {
    meaning: 'tiền cước điện thoại hằng tháng',
    example: '携帯料金のプランを格安SIMに見直したことで、毎月の電話代を半分近くに抑えられた。 (Nhờ xem xét đổi gói cước di động sang SIM giá rẻ, tôi đã tiết kiệm được gần một nửa tiền điện thoại mỗi tháng.)'
  },

  // UNIT 42
  '安全': {
    meaning: 'an toàn, bình an vô sự',
    example: '工事現場ではヘルメットと安全靴を必ず着用し、作業員の安全を最優先にしている。 (Tại công trường, công nhân luôn đội mũ bảo hộ và đi giày bảo hộ, đặt sự an toàn lên hàng đầu.)'
  },
  '関係': {
    meaning: 'mối quan hệ, mối liên hệ qua lại',
    example: '近隣の住民同士で日頃から挨拶を交わし、良好な人間関係を築くよう心がけている。 (Hàng xóm láng giềng thường xuyên chào hỏi nhau để cùng xây dựng mối quan hệ tốt đẹp.)'
  },
  'ミキサ': {
    word: 'ミキサー',
    reading: 'ミキサー',
    meaning: 'máy xay sinh tố, máy trộn thực phẩm',
    example: '朝食に栄養満点のスムージーを作るため、ミキサーに新鮮なバナナと牛乳を入れた。 (Để làm món sinh tố giàu dinh dưỡng cho bữa sáng, tôi cho chuối tươi và sữa tươi vào máy xay sinh tố.)'
  },
  '石': {
    meaning: 'hòn đá, tảng đá',
    example: '小川の浅瀬に並んだ丸い平らな石の上を、滑らないように慎重に渡った。 (Tôi bước cẩn thận qua những hòn đá tròn nhẵn xếp thành hàng dưới con suối nông để không bị trượt chân.)'
  },
  'データ': {
    meaning: 'dữ liệu, số liệu thống kê',
    example: 'クラウドストレージにバックアップを取り、貴重な研究データが消えないように保護した。 (Tôi sao lưu lên bộ nhớ đám mây để bảo vệ những dữ liệu nghiên cứu quý giá không bị mất.)'
  },
  'ファイル': {
    meaning: 'tệp tin máy tính, kẹp hồ sơ tài liệu',
    example: '取引先ごとに書類を色分けし、プラスチックの薄型ファイルに整然と綴じた。 (Tôi phân loại giấy tờ theo từng đối tác bằng các màu khác nhau rồi kẹp ngay ngắn vào file nhựa mỏng.)'
  },
  'ある～': {
    meaning: 'nào đó, một ～ nọ (đối tượng không nêu tên cụ thể)',
    example: 'ある有名な老舗の和菓子屋で、伝統的な製法で作られた銘菓を購入した。 (Tại một tiệm bánh ngọt truyền thống danh tiếng nọ, tôi đã mua món bánh gia truyền nổi tiếng.)'
  },
  '生懸命': {
    word: '一生懸命',
    reading: 'いっしょうけんめい',
    meaning: 'chăm chỉ, hết mình, nỗ lực hết sức (đã sửa lỗi chính tả)',
    example: '憧れの第一志望校に合格するため、毎日一生懸命受験勉強に励んでいます。 (Để thi đỗ vào ngôi trường mơ ước, ngày nào tôi cũng nỗ lực hết mình ôn luyện thi cử.)'
  },
  'ポーランド': {
    meaning: 'nước Ba Lan (quốc gia Trung Âu, quê hương nhà soạn nhạc Chopin)',
    example: 'ピアノの巨匠ショパンの生誕地として名高い、東欧のポーランドを旅しました。 (Tôi đã đi du lịch đất nước Ba Lan ở Đông Âu, nơi nổi tiếng là quê hương của thiên tài piano Chopin.)'
  },
  'ローン': {
    meaning: 'khoản vay trả góp, tiền vay ngân hàng mua nhà/xe',
    example: '三十年の住宅ローンを組んで、緑豊かな郊外に念願の一戸建てを購入した。 (Vay gói trả góp ngân hàng 30 năm, tôi đã mua được căn nhà riêng mơ ước ở ngoại ô xanh mát.)'
  },
  'セット': {
    meaning: 'bộ (set đồ, combo suất ăn)',
    example: 'ランチタイム限定のセットメニューを注文し、ハンバーグとサラダを満喫した。 (Tôi gọi set cơm trưa khuyến mãi và thưởng thức món thịt bò băm viên kèm salad.)'
  },
  'あとは': {
    meaning: 'phần còn lại là ～, việc tiếp theo là ～',
    example: '部屋の掃除と洗濯は終わったので、あとは夕飯の買い出しに行くだけです。 (Dọn dẹp phòng ốc và giặt giũ đã xong xuôi, việc còn lại chỉ là đi siêu thị mua đồ nấu cơm tối.)'
  },
  '調査': {
    meaning: 'khảo sát, điều tra số liệu',
    example: '消費者の購買意欲を把握するため、大規模な街頭アンケート調査を実施した。 (Để nắm bắt nhu cầu mua sắm của người tiêu dùng, chúng tôi đã tiến hành khảo sát phỏng vấn trên diện rộng.)'
  },
  '～の代わりに': {
    meaning: 'thay cho ～, thay vì ～',
    example: '健康管理のために白米の代わりに、食物繊維が豊富な玄米を主食にしています。 (Để giữ gìn sức khỏe, thay vì ăn cơm trắng tôi dùng gạo lứt giàu chất xơ làm bữa chính.)'
  },

  // UNIT 43
  'おちゃます': {
    word: '落ちます',
    reading: 'おちます',
    meaning: 'rơi, rớt xuống [đồ đạc, quả: 荷物/果物が落ちる] (đã sửa lỗi chính tả)',
    example: '秋風が木々を揺らし、枝の上から赤く熟したリンゴの実がポトリと落ちた。 (Gió thu lay động tán cây, từ trên cành một quả táo chín đỏ mọng rơi rụng xuống đất.)'
  },
  '変「な」': {
    meaning: 'kỳ lạ, kỳ quặc, bất thường',
    example: '真夜中の静まり返った部屋の奥から、何やらガタガタと変な物音が聞こえた。 (Từ sâu trong căn phòng tĩnh mịch giữa đêm khuya, tôi nghe thấy tiếng động lách cách rất kỳ lạ.)'
  },
  '幸せ': {
    meaning: 'hạnh phúc, niềm vui sướng an lành',
    example: '家族みんなが病気もせず、笑顔で食卓を囲める日常が何よりの幸せです。 (Cả gia đình không ốm đau gì, cùng quây quần bên mâm cơm rộn rã tiếng cười là niềm hạnh phúc lớn nhất.)'
  },
  '暖房': {
    meaning: 'lò sưởi, chế độ sưởi ấm mùa đông',
    example: '雪が降り積もって冷え込んできたので、リビングの暖房をつけて部屋を暖めた。 (Tuyết rơi dày trời trở lạnh căm căm nên tôi bật máy sưởi phòng khách cho ấm áp.)'
  },
  '冷房': {
    meaning: 'máy lạnh, chế độ làm mát mùa hè',
    example: '真夏の厳しい猛暑が続く日は、無理をせず室内の冷房を適切に利用しましょう。 (Những ngày hè nắng nóng gay gắt kéo dài, chúng ta hãy bật điều hòa mát trong phòng để giữ sức.)'
  },
  'わあ': {
    meaning: 'oa! chà! (thán từ thốt lên khi kinh ngạc, thích thú)',
    example: '夜空に色とりどりの巨大な花火が打ち上がると、観客から「わあ」と大歓声が上がった。 (Khi chùm pháo hoa khổng lồ rực rỡ bừng sáng trên trời đêm, khán giả đồng thanh reo lên: "Oa, đẹp quá!")'
  },
  '適当「な」': {
    meaning: 'thích hợp, vừa phải, phù hợp',
    example: '健康を保つためには、自分の体力に合った適当な運動を毎日継続することが大切だ。 (Để giữ sức khỏe, việc duy trì bài tập thể dục vừa sức với thể lực mỗi ngày là rất quan trọng.)'
  },
  '収入': {
    meaning: 'thu nhập, tiền kiếm được hằng tháng',
    example: '毎月の安定した給与収入の中から、将来の投資資金を計画的に積み立てている。 (Từ nguồn thu nhập lương ổn định hàng tháng, tôi trích một phần tích lũy cho quỹ đầu tư tương lai.)'
  },
  'ぴったり': {
    meaning: 'vừa khít, vừa vặn hoàn hảo',
    example: '試着室で履いてみたジーンズのウエストが、まるでオーダーメイドのようにぴったりだった。 (Chiếc quần bò tôi thử trong phòng thay đồ vừa khít vòng eo như thể được may đo riêng vậy.)'
  },
  'そのうえ': {
    meaning: 'hơn nữa, thêm vào đó (bổ sung lý do cùng chiều)',
    example: 'この定食屋は値段がとてもリーズナブルで、そのうえボリュームも満点です。 (Quán cơm bình dân này giá cả rất phải chăng, hơn nữa suất ăn lại đầy đặn no nê.)'
  },
  '～と言います': {
    meaning: 'được gọi là ～, có tên gọi là ～',
    example: 'この可愛らしい小さな黄色い花は、日本語でタンポポと言います。 (Loài hoa nhỏ xinh xắn màu vàng này trong tiếng Nhật được gọi là hoa bồ công anh.)'
  },
  'ばら': {
    meaning: 'hoa hồng (loài hoa biểu tượng của tình yêu)',
    example: '母の日の感謝の気持ちを込めて、真っ赤なばらの花束をプレゼントした。 (Gửi gắm lòng biết ơn nhân Ngày của Mẹ, tôi đã tặng bà một bó hoa hồng đỏ thắm.)'
  },

  // UNIT 44
  '調節します': {
    meaning: 'điều chỉnh (nhiệt độ, âm lượng, dây đeo: 温度/音量を調節する)',
    example: '外の気温の変化に合わせて、エアコンの設定温度をこまめに調節しています。 (Để thích ứng với nhiệt độ ngoài trời, tôi thường xuyên điều chỉnh nhiệt độ điều hòa cho phù hợp.)'
  },
  '倍': {
    meaning: 'gấp ～ lần (bội số: hai lần, ba lần)',
    example: 'オンライン販売を強化した成果が現れ、今年の売上は去年の二倍に急増した。 (Nhờ đẩy mạnh bán hàng trực tuyến, doanh thu năm nay đã tăng vọt gấp đôi so với năm ngoái.)'
  },
  'シングル': {
    meaning: 'phòng đơn khách sạn (single room), người độc thân',
    example: '出張先のビジネスホテルで、静かで清潔なシングルルームにチェックインした。 (Tại khách sạn công vụ nơi công tác, tôi nhận một phòng đơn yên tĩnh và sạch sẽ.)'
  },
  'たんす': {
    meaning: 'tủ gỗ đựng quần áo',
    example: '乾いた洗濯物をきれいに畳んで、寝室の木製たんすの引き出しにしまった。 (Quần áo phơi khô được gấp gọn gàng rồi cất vào ngăn kéo tủ gỗ trong phòng ngủ.)'
  },
  '洗濯物': {
    meaning: 'quần áo giặt, đồ cần giặt/phơi',
    example: '晴天の心地よい風が吹くベランダに、朝一番で洗濯物をたくさん干した。 (Trên ban công lộng gió ngày nắng đẹp, tôi mang thật nhiều quần áo giặt ra phơi từ sáng sớm.)'
  },
  'カット': {
    meaning: 'cắt tóc tạo kiểu (haircut)',
    example: '伸びて重くなった髪をさっぱりさせるため、駅前のサロンでカットしてもらった。 (Để mái tóc dài nặng nề được gọn gàng mát mẻ, tôi ra salon trước ga cắt tóc tạo kiểu.)'
  },
  'シャンプー': {
    meaning: 'dầu gội đầu, việc gội đầu',
    example: 'シトラスの爽やかな香りが広がるオーガニックのシャンプーで髪を丁寧に洗った。 (Tôi gội đầu nhẹ nhàng bằng loại dầu gội hữu cơ thoang thoảng hương cam chanh sảng khoái.)'
  },
  'ショート': {
    meaning: 'tóc ngắn (short hair)',
    example: 'ずっと長かったロングヘアを思い切って短くし、爽やかなショートヘアに変身した。 (Quyết định cắt phăng mái tóc dài nuôi bấy lâu, cô ấy đã biến hóa thành một kiểu tóc ngắn đầy năng động.)'
  },
  '～みたいに して ください': {
    meaning: 'xin hãy làm giống như ～ (yêu cầu tạo mẫu)',
    example: '美容師に雑誌の切り抜き写真を見せて、「このモデルさんみたいにしてください」と頼んだ。 (Đưa bức ảnh cắt từ tạp chí cho thợ làm tóc, tôi yêu cầu: "Nhờ anh cắt giống như người mẫu này giúp em".)'
  },
  'これで よろしいでしょうか': {
    meaning: 'như thế này đã vừa ý quý khách chưa ạ? (hỏi xác nhận của nhân viên)',
    example: '手鏡で後頭部の仕上がりを映しながら、美容師が「これでよろしいでしょうか」と尋ねた。 (Vừa cầm gương soi phần gáy phía sau, người thợ làm tóc vừa nhẹ nhàng hỏi: "Dạ như thế này đã vừa ý quý khách chưa ạ?")'
  },
  '嫌がります': {
    meaning: 'tỏ ra ghét bỏ, khó chịu, không muốn làm (ngôi thứ ba)',
    example: 'うちの飼い犬は水に濡れるのを嫌がるので、お風呂に入れるのに一苦労します。 (Chú cún nhà tôi rất ghét bị ướt lông nên mỗi lần tắm cho nó là cả một trận chiến vất vả.)'
  },
  '順序': {
    meaning: 'thứ tự, tuần tự các bước (đã sửa nghĩa từ thu dọn thành thứ tự)',
    example: 'マニュアルに記載された正しい順序に従って組み立てれば、誰でも簡単に完成できます。 (Nếu lắp ráp theo đúng trình tự hướng dẫn trong sổ tay, bất cứ ai cũng hoàn thành dễ dàng.)'
  },
  '別れます': {
    meaning: 'chia tay, tạm biệt nhau [人/道が分かれる]',
    example: '楽しい同窓会がお開きになり、駅の改札口前で友人たちと名残惜しく別れました。 (Buổi họp lớp vui vẻ kết thúc, trước cửa soát vé nhà ga chúng tôi bịn rịn chia tay nhau.)'
  },
  'これら': {
    meaning: 'những thứ này, các điều này (chỉ thị đại từ số nhiều)',
    example: '実験で得られたこれらの貴重なデータをもとに、学会発表の論文を執筆した。 (Dựa trên những số liệu quý báu thu được từ thực nghiệm này, tôi đã viết bài báo cáo học thuật.)'
  },
  '縁起が 悪い': {
    meaning: 'điềm gở, không may mắn, xui xẻo (đã sửa nghĩa từ đáng lo ngại)',
    example: '鏡が割れるのは昔から縁起が悪いと言い伝えられていますが、迷信にすぎません。 (Gương vỡ xưa nay vẫn bị coi là điềm xui xẻo, nhưng đó chẳng qua chỉ là điều mê tín.)'
  },

  // UNIT 45
  '贈り物': {
    meaning: 'món quà tặng, quà biếu tri ân',
    example: '長年お世話になった恩師への贈り物として、高級な万年筆を選んで包んでもらった。 (Làm quà biếu tri ân người thầy dạy dỗ bao năm, tôi đã chọn chiếc bút máy cao cấp bọc hộp trang trọng.)'
  },
  '間違い電話': {
    meaning: 'cuộc gọi nhầm số (điện thoại gọi nhầm)',
    example: '深夜にベルが鳴って受話器を取ったら、全く知らない人からの間違い電話だった。 (Nửa đêm chuông reo nhấc máy lên nghe, hóa ra lại là một cuộc gọi nhầm số từ người lạ hoắc.)'
  },
  'キャンプ': {
    meaning: 'buổi cắm trại ngoài trời',
    example: '大自然に囲まれた湖畔のキャンプ場で、テントを張って満天の星空を眺めた。 (Tại bãi cắm trại ven hồ giữa thiên nhiên đại ngàn, chúng tôi dựng lều ngắm bầu trời sao lung linh.)'
  },
  'レバー': {
    meaning: 'cần gạt điều khiển, đòn bẩy máy móc',
    example: '非常ブレーキの緊急レバーを力強く手前に引くと、車両がゆっくりと停止した。 (Kéo mạnh cần gạt phanh khẩn cấp về phía mình, đoàn tàu từ từ hãm đà dừng lại.)'
  },
  '「円」札': {
    word: '～円札',
    meaning: 'tờ tiền giấy mệnh giá ～ yên (千円札, 一万円札)',
    example: '自動券売機に一万円札を投入して、Suicaに五千円分チャージした。 (Đút tờ tiền giấy một vạn yên vào máy bán vé tự động, tôi nạp 5.000 yên vào thẻ Suica.)'
  },
  '急に': {
    meaning: 'đột nhiên, bất ngờ (thay đổi trạng thái đột ngột)',
    example: '青空が広がっていたのに急に大粒の通り雨が降ってきたので、近くの軒下で雨宿りした。 (Trời đang trong xanh bỗng đổ mưa rào bất chợt, tôi phải tấp vào mái hiên gần đó trú tạm.)'
  },
  '以上です': {
    meaning: 'xin hết ạ, đến đây là hết (câu kết thúc bài thuyết trình, báo cáo)',
    example: '「新規事業の進捗状況についての報告は以上です。ご静聴ありがとうございました。」 ("Bản báo cáo tiến độ dự án mới của tôi đến đây là hết. Xin chân thành cảm ơn quý vị đã lắng nghe.")'
  },
  '係員': {
    meaning: 'nhân viên phụ trách, người trực ban',
    example: 'チケットの購入方法が分からなかったので、窓口の係員に親切に教えてもらった。 (Không biết cách mua vé trên máy, tôi đã được anh nhân viên trực quầy hướng dẫn rất tận tình.)'
  },
  'ロース': {
    word: 'コース',
    reading: 'コース',
    meaning: 'lộ trình, cung đường chạy (đã sửa lỗi chính tả từ ロース)',
    example: 'マラソン大会のランナーたちは、海岸線沿いの風光明媚なコースを一斉に駆け抜けた。 (Các vận động viên chạy marathon cùng nhau sải bước trên cung đường tuyệt đẹp men theo bờ biển.)'
  },
  'スタート': {
    meaning: 'xuất phát, vạch bắt đầu (start, đã sửa nghĩa sai từ ngôi sao)',
    example: 'ピストルの合図と同時に、選手たちが勢いよくスタートラインから飛び出した。 (Đúng lúc tiếng súng hiệu vang lên, các tuyển thủ bứt phá lao nhanh khỏi vạch xuất phát.)'
  },
  '優勝します': {
    meaning: 'đoạt chức vô địch, giành giải quán quân (đã sửa nghĩa từ đầu tiên)',
    example: '厳しい日々の猛練習を乗り越えて、全国高校野球大会で見事に優勝を飾った。 (Vượt qua chuỗi ngày khổ luyện khắc nghiệt, đội tuyển đã xuất sắc giành chức vô địch giải bóng chày.)'
  },
  '大学生': {
    meaning: 'sinh viên đại học',
    example: '日本の大学生たちは、講義の合間を縫ってアルバイトやサークル活動に励んでいる。 (Các bạn sinh viên đại học ở Nhật ngoài giờ lên lớp còn năng nổ đi làm thêm và hoạt động câu lạc bộ.)'
  },
  'ー便回答': {
    word: '回答',
    reading: 'かいとう',
    meaning: 'câu trả lời, lời giải đáp thắc mắc',
    example: 'お客様相談室へ問い合わせた内容について、専門の担当部署から詳細な回答を受け取った。 (Về nội dung thắc mắc gửi phòng chăm sóc khách hàng, tôi đã nhận được câu trả lời chi tiết.)'
  },
  'セットします': {
    meaning: 'cài đặt, đặt giờ (báo thức: 目覚まし時計をセットする)',
    example: '明日の早朝フライトに絶対に遅刻しないよう、スマートフォンのアラームを午前五時にセットした。 (Để tuyệt đối không trễ chuyến bay sáng sớm mai, tôi cài chuông báo thức điện thoại lúc 5 giờ sáng.)'
  },

  // UNIT 46
  'ガスサービスセンター': {
    meaning: 'trung tâm dịch vụ cung cấp khí gas (cơ quan hỗ trợ gas dân dụng)',
    example: '引っ越し当日にガスを開栓してもらうため、事前にガスサービスセンターへ連絡を入れた。 (Để được mở khóa van gas vào đúng ngày dọn nhà, tôi đã liên hệ trước với trung tâm dịch vụ gas.)'
  },
  'ガスコンロ': {
    meaning: 'bếp gas nấu ăn gia đình',
    example: '安全装置が付いた最新式のガスコンロをキッチンに設置し、火災予防に配慮した。 (Tôi lắp đặt chiếc bếp gas đời mới có cảm biến an toàn trong bếp để phòng chống cháy nổ.)'
  },
  'お待たせしました': {
    meaning: 'xin lỗi đã để quý khách phải chờ lâu (lời phục vụ khi mang đồ ra)',
    example: 'ウェイターが湯気の立つ温かい料理をテーブルに運び、「大変お待たせいたしました」と一礼した。 (Người phục vụ bưng món ăn nóng hổi bốc khói ra bàn và cúi chào: "Xin lỗi đã để quý khách đợi lâu ạ".)'
  },
  'システム': {
    meaning: 'hệ thống phần mềm, cơ chế vận hành (system)',
    example: '社内の業務効率を飛躍的に向上させるため、次世代のクラウド業務システムを導入した。 (Để nâng cao vượt bậc hiệu suất làm việc nội bộ, công ty đã đưa vào hệ thống điện toán đám mây thế hệ mới.)'
  },
  'キーワード': {
    meaning: 'từ khóa tìm kiếm, từ mấu chốt (keyword)',
    example: '検索エンジンの入力欄に適切なキーワードを入力して、欲しい情報を素早くヒットさせた。 (Nhập từ khóa chuẩn xác vào thanh tìm kiếm, tôi nhanh chóng tìm ra thông tin mình cần.)'
  },
  '一部分': {
    meaning: 'một phần, một bộ phận',
    example: '激しい嵐によって屋根の一部が吹き飛ばされ、翌朝すぐに修理の手配を行った。 (Cơn bão dữ dội đã thổi bay một phần mái nhà, sáng hôm sau tôi lập tức gọi thợ sửa chữa.)'
  },
  '入力します': {
    meaning: 'nhập dữ liệu, gõ văn bản vào máy tính',
    example: '会員登録の専用画面で、氏名やメールアドレスなどの必要事項をキーボードで入力した。 (Trên màn hình đăng ký thành viên, tôi gõ bàn phím nhập các thông tin cần thiết như họ tên, email.)'
  },
  '秒': {
    meaning: 'giây (đơn vị đo thời gian)',
    example: '陸上短距離走の百メートル走で、自己ベストとなる十秒台の記録を叩き出した。 (Ở cự ly chạy nước rút 100 mét, anh ấy đã xác lập kỷ lục cá nhân tốt nhất trong khoảng 10 giây.)'
  },

  // UNIT 47
  '「音/声が～」します': {
    meaning: 'nghe thấy âm thanh, phát ra tiếng động [音/声がする]',
    example: '静かな夜の庭の茂みから、草を踏みしめるようなガサガサという小さな音がします。 (Từ bụi cây trong vườn đêm thanh vắng, nghe thấy tiếng sột soạt nho nhỏ như tiếng giẫm lên cỏ.)'
  },
  '「味が～」します': {
    meaning: 'có vị, nếm thấy mùi vị [味がする]',
    example: 'この手作りのクッキーは、隠し味にレモンの皮が入っていて爽やかな味がします。 (Món bánh quy tự làm này có thêm chút vỏ chanh làm gia vị bí mật nên ăn có vị thanh mát.)'
  },
  '[においが~] します': {
    meaning: 'ngửi thấy mùi hương, có mùi bốc lên [においがする]',
    example: 'パン屋の前を通りかかると、焼きたての香ばしいクロワッサンの甘いにおいがします。 (Đi ngang qua tiệm bánh mì, tôi ngửi thấy mùi thơm ngòn ngọt quyến rũ của mẻ bánh sừng bò mới ra lò.)'
  },
  '「傘を～」さします': {
    meaning: 'che ô, giương dù [傘をさす]',
    example: '突然ポツポツと大粒の雨が降ってきたので、カバンから折りたたみ傘を出してさしました。 (Bất thình lình mưa hạt to trút xuống, tôi liền lấy cây dù gấp trong cặp ra giương lên che.)'
  },
  'ひどい': {
    meaning: 'tồi tệ, khủng khiếp, nghiêm trọng',
    example: '台風が直撃した沿岸地域では、強風と高波によってひどい被害がもたらされた。 (Tại vùng duyên hải nơi tâm bão quét qua, gió bão và sóng lớn đã gây ra thiệt hại vô cùng nặng nề.)'
  },
  '天気予報': {
    meaning: 'bản tin dự báo thời tiết',
    example: '毎朝出かける前にテレビの天気予報を確認し、降水確率が高ければ折りたたみ傘を持参する。 (Mỗi sáng trước khi ra ngoài tôi đều xem dự báo thời tiết trên TV, nếu xác suất mưa cao sẽ mang theo ô gấp.)'
  },
  '実験': {
    meaning: 'thí nghiệm khoa học, thử nghiệm',
    example: '理科の実験室で薬品を慎重に配合し、化学反応の変化をフラスコの中で観察した。 (Trong phòng thí nghiệm khoa học, tôi cẩn thận phối trộn hóa chất quan sát phản ứng hóa học trong bình tam giác.)'
  },
  'におい': {
    meaning: 'mùi hương, mùi vị',
    example: '春の陽気に誘われて公園を歩くと、満開の沈丁花の甘く心地よいにおいが漂ってきた。 (Đi dạo công viên trong tiết trời xuân ấm áp, hương hoa thụy hương thơm ngát phảng phất đưa lại.)'
  },
  '科学': {
    meaning: 'khoa học, công nghệ tự nhiên',
    example: '最新の科学技術の進展によって、かつては不治の病とされた難病の治療法が確立された。 (Nhờ sự tiến bộ của khoa học kỹ thuật hiện đại, các phương pháp chữa trị căn bệnh nan y đã được xác lập.)'
  },
  '医学': {
    meaning: 'y học, y khoa',
    example: '将来は医学の道へ進み、最先端の再生医療の研究で多くの苦しむ患者を救いたい。 (Tương lai tôi muốn theo đuổi ngành y học, nghiên cứu y học tái tạo tiên tiến để cứu chữa cho nhiều bệnh nhân.)'
  },
  '反対': {
    meaning: 'phản đối, không đồng tình',
    example: '住民の安全を脅かす危険な開発計画に対して、町内会全体で一致団結して反対の声を上げた。 (Trước dự án quy hoạch nguy hiểm đe dọa an toàn cư dân, cả khu phố đã đồng lòng lên tiếng phản đối.)'
  },
  '~によると': {
    meaning: 'theo như nguồn tin ～ (dẫn nguồn tin tức)',
    example: '今朝の新聞の報道によると、世界経済の成長率は来期にかけて緩やかに回復する見込みだ。 (Theo thông tin trên báo sáng nay, tốc độ tăng trưởng kinh tế thế giới dự kiến sẽ dần hồi phục vào kỳ tới.)'
  },
  '相手': {
    meaning: 'đối phương, đối tác, bạn đời',
    example: 'ビジネスの商談を円滑に進めるためには、交渉相手の立場に立った配慮が欠かせない。 (Để đàm phán kinh doanh diễn ra thuận lợi, việc suy nghĩ cho lập trường của đối tác là điều không thể thiếu.)'
  },
  '博士': {
    meaning: 'tiến sĩ (học vị cao nhất, đã sửa nghĩa từ bác sĩ)',
    example: 'ノーベル物理学賞を受賞した高名な博士が、大学のホールで記念講演を行った。 (Vị tiến sĩ lừng danh từng nhận giải Nobel Vật lý đã có buổi thuyết trình kỷ niệm tại giảng đường đại học.)'
  },
  'ホルチン': {
    word: 'ホルモン',
    reading: 'ホルモン',
    meaning: 'hoóc-môn, nội tiết tố cơ thể (đã sửa lỗi chính tả)',
    example: '成長ホルモンの分泌を促すためには、毎晩十分な質の高い睡眠を確保することが不可欠です。 (Để kích thích sự tiết hoóc-môn tăng trưởng, việc đảm bảo giấc ngủ sâu mỗi đêm là vô cùng cần thiết.)'
  },
  '化粧品': {
    meaning: 'mỹ phẩm làm đẹp',
    example: '敏感肌でも安心して毎日使えるように、無香料で肌に優しい天然成分の化粧品を選んだ。 (Để da nhạy cảm cũng an tâm dùng hằng ngày, tôi chọn mỹ phẩm thiên nhiên dịu nhẹ không hương liệu.)'
  },
  '調べ': {
    meaning: 'kết quả điều tra, cuộc khảo sát',
    example: '警察の厳密な調べによって、防犯カメラの映像から事件の手がかりがついに特定された。 (Qua cuộc điều tra gắt gao của cảnh sát, manh mối vụ án cuối cùng đã được xác định từ hình ảnh camera.)'
  },

  // UNIT 48
  '入館': {
    word: '入管',
    reading: 'にゅうかん',
    meaning: 'Cục Quản lý Xuất nhập cảnh (viết tắt của 入国管理局)',
    example: 'ビザの在留資格更新の手続きを行うため、品川にある東京入管の窓口を訪ねた。 (Để làm thủ tục gia hạn tư cách lưu trú visa, tôi đã đến quầy làm việc của Cục Xuất nhập cảnh Tokyo ở Shinagawa.)'
  },
  '～間': {
    meaning: 'trong khoảng thời gian ～ (ba ngày: 三日間, hai tuần: 二週間)',
    example: '夏休みの二週間の間、北海道の雄大な自然の中をレンタカーでドライブ旅行した。 (Trong khoảng thời gian hai tuần nghỉ hè, tôi thuê xe tự lái vi vu giữa thiên nhiên hùng vĩ của Hokkaido.)'
  },
  'いいことですね。': {
    meaning: 'điều đó thật tốt đẹp nhỉ! (lời tán thưởng, động viên)',
    example: '「毎朝近所のゴミ拾いボランティアをしているんだ。」「素晴らしい、本当にいいことですね。」 ("Mỗi sáng tôi đều đi nhặt rác tình nguyện quanh xóm đấy." "Tuyệt vời quá, đó thực sự là điều rất tốt đẹp!")'
  },
  'お忙しいですか': {
    meaning: 'dạo này anh/chị có bận rộn không? (lời hỏi thăm công việc)',
    example: '「山田課長、今期末の業務でお忙しいですか。」「ええ、決算で目が回りそうだよ。」 ("Thưa trưởng phòng Yamada, đợt cuối kỳ này công việc của anh bận lắm ạ?" "Ừ, quyết toán sổ sách hoa cả mắt đây.")'
  },
  '久しぶり': {
    meaning: 'sau một khoảng thời gian dài lâu ngày',
    example: '故郷を離れて三年ぶりに帰省し、久しぶりに幼馴染たちと昔話に花を咲かせた。 (Xa quê 3 năm mới có dịp về thăm, sau bao ngày xa cách tôi đã hàn huyên ôn lại kỷ niệm cùng lũ bạn thuở nhỏ.)'
  },
  'それまでに': {
    meaning: 'trước thời điểm đó (hạn chót hoàn thành)',
    example: '来週の金曜日に発表会がありますから、それまでに原稿を完璧に仕上げてください。 (Thứ Sáu tuần tới là buổi thuyết trình rồi, trước lúc đó anh hãy hoàn thiện bài viết thật hoàn hảo nhé.)'
  },
  'かまいません': {
    meaning: 'không sao đâu, không phiền gì cả (chấp thuận, cho phép)',
    example: '「こちらのお席、相席でもよろしいでしょうか。」「ええ、私は全くかまいませんよ。」 ("Bàn này cho người khác ngồi ghép cùng được không ạ?" "Vâng, tôi thấy không sao đâu ạ, cứ tự nhiên.")'
  },
  '楽しみます': {
    meaning: 'tận hưởng, thưởng thức niềm vui',
    example: 'たまの連休くらいは仕事を完全に忘れ、家族水入らずで温泉旅行を思い切り楽しみたい。 (Hiếm hoi lắm mới có kỳ nghỉ dài, tôi muốn gác lại công việc cùng gia đình tận hưởng chuyến du lịch suối nước nóng.)'
  },
  'もともと': {
    meaning: 'vốn dĩ, ngay từ đầu',
    example: '彼はもともと内向的な性格だったが、留学をきっかけに積極的で社交的な人物に変わった。 (Cậu ấy vốn dĩ tính tình khép kín, nhưng nhờ đi du học đã thay đổi thành người hoạt bát và cởi mở.)'
  },
  '代わりをします': {
    meaning: 'làm thay, đảm nhiệm thay vai trò của người khác',
    example: '風邪で急に休んだ先輩の代わりをして、午後のプレゼンテーションの大役を務め上げた。 (Đảm nhiệm vai trò thay cho người tiền bối bị ốm đột xuất, tôi đã hoàn thành xuất sắc bài thuyết trình buổi chiều.)'
  },
  'スピード': {
    meaning: 'tốc độ, vận tốc di chuyển',
    example: '急カーブの手前では必ずブレーキを踏み、安全なスピードまで十分に減速しなければならない。 (Trước khi vào khúc cua gấp, người lái xe nhất thiết phải đạp phanh giảm tốc độ an toàn.)'
  },
  '競走します': {
    meaning: 'chạy đua, thi đua tốc độ',
    example: '運動会の花形種目である学級対抗リレーで、クラスの代表選手たちが全力で競走した。 (Tại phần thi chạy tiếp sức sôi nổi nhất của hội thao, các vận động viên đại diện lớp đã dốc sức chạy đua.)'
  },
  '姿': {
    meaning: 'bóng dáng, vóc dáng, diện mạo',
    example: '遠くの改札口に向かって歩いていく友人の後ろ姿を、見えなくなるまでずっと見送った。 (Tôi dõi mắt nhìn theo bóng dáng người bạn bước về phía cửa soát vé xa xa cho đến khi khuất hẳn.)'
  },
  '心': {
    meaning: 'trái tim, tấm lòng, tâm hồn',
    example: '被災地の方々へ少しでも温かい支援の手を差し伸べようと、心からの祈りと義援金を届けた。 (Với mong muốn sẻ chia khó khăn cùng đồng bào vùng bão lũ, tôi gửi gắm lời cầu nguyện và tiền ủng hộ từ tận đáy lòng.)'
  },
  'とらえます': {
    meaning: 'nắm bắt [cơ hội, ý nghĩa: チャンス/意味を捉える], tóm lấy',
    example: '時代の変化の潮流を的確にとらえ、ニーズに合致した革新的なサービスを次々と打ち出した。 (Nắm bắt chuẩn xác xu thế chuyển dịch của thời đại, công ty đã liên tiếp tung ra các dịch vụ đổi mới sáng tạo.)'
  },
  '~にとって': {
    meaning: 'đối với ～ (xét từ lập trường của ai)',
    example: '幼い子どもたちにとって、家族と過ごす温かい団らんの時間は何物にも代えがたい宝物です。 (Đối với những đứa trẻ thơ, khoảng thời gian ấm áp bên gia đình là báu vật không gì sánh được.)'
  },

  // UNIT 49
  '旅館': {
    meaning: 'nhà trọ truyền thống kiểu Nhật (ryokan)',
    example: '源泉かけ流しの天然温泉と豪華な会席料理が自慢の、老舗の温泉旅館に宿泊した。 (Tôi đã nghỉ đêm tại một nhà trọ truyền thống lâu đời nổi tiếng với suối nước nóng tự nhiên và ẩm thực Kaiseki thịnh soạn.)'
  },
  'バスてい': {
    meaning: 'trạm dừng xe buýt, bến xe buýt',
    example: '小雨が降る肌寒い夕暮れ時、傘をさしながら次のバスが到着するのをバス停で待った。 (Trong buổi hoàng hôn se lạnh lất phất mưa, tôi che ô đứng chờ chuyến xe buýt tiếp theo tại trạm dừng.)'
  },
  '貿易': {
    meaning: 'thương mại quốc tế, xuất nhập khẩu',
    example: '海運会社で国際貿易の実務を担当し、世界各国の港へコンテナ貨物を輸出入している。 (Đảm nhiệm nghiệp vụ thương mại quốc tế tại hãng tàu biển, tôi phụ trách xuất nhập khẩu hàng container khắp năm châu.)'
  },
  '帰りに': {
    meaning: 'trên đường đi về (nhà, công ty: 帰りがけに)',
    example: '仕事の帰りに駅前のスーパーへ立ち寄り、夕食用の新鮮な食材をカゴいっぱいに買った。 (Trên đường đi làm về tôi ghé vào siêu thị trước ga, chọn mua một giỏ đầy ắp thực phẩm tươi ngon cho bữa tối.)'
  },
  'ちっとも': {
    meaning: 'một chút cũng không... (luôn đi cùng phủ định, nhấn mạnh hơn 全然)',
    example: '難解な専門書を数時間かけて読み進めてみたが、ちっとも理解できず途方に暮れた。 (Tôi cặm cụi đọc cuốn sách chuyên ngành hóc búa suốt mấy tiếng mà chẳng hiểu được tí nào, đành chịu thua.)'
  },
  'よろしくお伝えください': {
    meaning: 'xin vui lòng chuyển lời hỏi thăm sức khỏe của tôi tới ～',
    example: '「ご両親様にも、どうぞよろしくお伝えください。」「ありがとうございます、伝えておきます。」 ("Xin gửi lời hỏi thăm sức khỏe chân thành của cháu tới hai bác nhé." "Cảm ơn bạn, tôi sẽ chuyển lời.")'
  },
  '失礼いたします': {
    meaning: 'tôi xin phép làm phiền / xin phép ra về (khiêm nhường ngữ lịch sự)',
    example: '「本日はお忙しい中お時間をいただきありがとうございました。それでは、失礼いたします。」 ("Hôm nay cảm ơn quý vị đã bớt chút thời gian tiếp đón. Tôi xin phép ra về ạ.")'
  },
  '講師': {
    meaning: 'giảng viên, báo cáo viên (đã sửa nghĩa sai từ bài giảng)',
    example: 'ビジネス実務の第一線で活躍する特別講師を招き、全社員向けの特別セミナーを実施した。 (Chúng tôi mời một giảng viên đặc biệt đang trực tiếp quản trị doanh nghiệp tới giảng dạy chuyên đề cho toàn thể nhân viên.)'
  },
  '多くの～': {
    meaning: 'nhiều ～, phần lớn ～',
    example: '歴史ある名所旧跡には、四季を通じて世界中から多くの観光客が足を運んでいます。 (Tại các danh lam thắng cảnh lịch sử lâu đời, quanh năm bốn mùa đều có rất đông du khách quốc tế ghé thăm.)'
  },
  '作品': {
    meaning: 'tác phẩm nghệ thuật, văn học, hội họa (đã sửa nghĩa sai từ làm việc)',
    example: 'ルーブル美術館の展示室に飾られたレオナルド・ダ・ヴィンチの不朽の名作に圧倒された。 (Tôi hoàn toàn bị choáng ngợp trước những danh tác bất hủ của Leonardo da Vinci trưng bày tại bảo tàng Louvre.)'
  },
  '受賞します': {
    meaning: 'đoạt giải thưởng, nhận giải',
    example: '独自の視点で社会問題に鋭く切り込んだドキュメンタリー映画が、国際映画祭で最優秀賞を受賞した。 (Bộ phim tài liệu với góc nhìn sắc sảo về vấn đề xã hội đã xuất sắc đoạt giải thưởng cao nhất tại liên hoan phim quốc tế.)'
  },
  'お持ちです': {
    meaning: 'có mang theo, đang sở hữu (kính ngữ của 持っている)',
    example: '「会員証やポイントカードをお持ちでしたら、お会計の前にご提示ください。」 ("Nếu quý khách có mang theo thẻ hội viên hoặc thẻ tích điểm, xin vui lòng xuất trình trước khi thanh toán ạ.")'
  },
  '作曲': {
    meaning: 'sáng tác ca khúc, phổ nhạc (đã sửa nghĩa sai từ âm nhạc)',
    example: '映画の感動的なクライマックスシーンに流れる切ない旋律は、著名な音楽家によって作曲された。 (Giai điệu da diết vang lên trong phân cảnh cao trào xúc động của bộ phim do một nhạc sĩ lừng danh phổ nhạc.)'
  },

  // UNIT 50
  'ガイド': {
    meaning: 'hướng dẫn viên du lịch, sách chỉ dẫn (guide)',
    example: '古都の歴史に精通したベテランの観光ガイドが、寺院の庭園の見どころを分かりやすく案内してくれた。 (Người hướng dẫn viên kỳ cựu am tường lịch sử cố đô đã giới thiệu cặn kẽ những nét đặc sắc của khu vườn chùa.)'
  },
  'お宅': {
    meaning: 'nhà của quý vị, tư gia (kính ngữ của 家)',
    example: '「お近くにお越しの際は、ぜひ私どものお宅へもお立ち寄りください。」 ("Khi nào có dịp đi ngang qua khu này, rất mong quý vị bớt chút thời gian ghé chơi tư gia của chúng tôi.")'
  },
  '郊外': {
    meaning: 'ngoại ô, vùng ven đô thị',
    example: '休日は都心の喧騒を離れて、緑豊かで閑静な郊外のドライブコースへ車を走らせた。 (Ngày nghỉ tôi rời xa khói bụi trung tâm đô thị, lái xe thong dong trên cung đường ngoại ô rợp bóng cây.)'
  },
  'アルバム': {
    meaning: 'cuốn album ảnh lưu niệm (album)',
    example: '押し入れの奥に眠っていた家族の古いアルバムをめくり、懐かしい思い出話に花を咲かせた。 (Lật giở cuốn album ảnh gia đình cất kỹ trong tủ, chúng tôi cùng say sưa chuyện trò về những kỷ niệm ngày xưa.)'
  },
  '放送します': {
    meaning: 'phát sóng đài phát thanh/truyền hình',
    example: '災害発生時には、緊急避難情報を住民へいち早く伝達するため自治体の防災行政無線で放送します。 (Khi có thiên tai, thông tin sơ tán khẩn cấp sẽ được phát sóng trên hệ thống truyền thanh để người dân kịp thời nắm bắt.)'
  },
  '像': {
    meaning: 'bức tượng điêu khắc (銅像: tượng đồng, 仏像: tượng phật)',
    example: '渋谷駅前の広場には、飼い主の帰りを待ち続けた忠犬ハチ公の有名な銅像が鎮座しています。 (Tại quảng trường trước ga Shibuya có đặt bức tượng đồng nổi tiếng của chú chó trung thành Hachiko.)'
  },
  'かないます': {
    meaning: '[ước mơ, nguyện vọng] thành hiện thực [夢/願いが叶う] (đã sửa lỗi màu đỏ)',
    example: '長年の地道な努力が実を結び、ついに念願のプロサッカー選手になるという夢がかないました。 (Những nỗ lực không ngừng nghỉ suốt bao năm đã đơm hoa kết trái, ước mơ trở thành cầu thủ bóng đá chuyên nghiệp đã thành hiện thực.)'
  },
  'ひとことよろしいでしょうか': {
    meaning: 'tôi xin phép được nói đôi lời có được không ạ? (lời mở đầu phát biểu lịch sự)',
    example: '送別会の席でグラスを手にして立ち上がり、「皆様、ひとことよろしいでしょうか」と感謝を述べた。 (Trong buổi tiệc chia tay, tôi cầm ly đứng dậy cất tiếng: "Thưa quý vị, tôi xin phép được nói đôi lời cảm tạ có được không ạ?")'
  },
  '協力します': {
    meaning: 'chung sức hiệp lực, hợp tác cùng làm',
    example: '地域の防犯パトロール活動を円滑に進めるため、住民全員が一丸となって積極的に協力している。 (Để hoạt động tuần tra phòng chống tội phạm địa phương hiệu quả, toàn thể cư dân đều đồng lòng nhiệt tình hợp tác.)'
  },
  '心から': {
    meaning: 'từ tận đáy lòng, thành tâm sâu sắc',
    example: '困難な状況下でも温かいご支援を寄せてくださった皆様に、心からの感謝を申し上げます。 (Tôi xin gửi lời cảm tạ chân thành từ tận đáy lòng tới quý vị đã hết lòng ủng hộ trong giai đoạn khó khăn.)'
  },
  '拝啓': {
    meaning: 'kính gửi (từ mở đầu trang trọng trong thư từ Nhật Bản)',
    example: 'ビジネスの公式な書簡では、冒頭に「拝啓」と記し、末尾を結語の「敬具」で締めくくります。 (Trong thư tín thương mại trang trọng, mở đầu thư luôn viết "Kính gửi" và kết thúc bằng chữ "Trân trọng".)'
  },
  'おげんきでいらっしゃいますか?': {
    meaning: 'quý vị dạo này vẫn mạnh khỏe chứ ạ? (lời thăm hỏi đầu thư, đã sửa lỗi màu đỏ)',
    example: '手紙の書き出しに「初夏の候、皆様におかれましては益々お元気でいらっしゃいますか」と筆を執った。 (Mở đầu lá thư, tôi đặt bút viết lời thăm hỏi: "Tiết trời đầu hạ, quý vị dạo này vẫn mạnh khỏe vạn an chứ ạ?")'
  },
  '迷惑をかけます': {
    meaning: 'gây phiền hà, làm phiền người khác',
    example: '私の確認ミスによって納品が遅れ、取引先の皆様に多大なご迷惑をおかけしてしまいました。 (Do sơ suất của tôi trong khâu kiểm tra khiến hàng giao chậm, làm phiền hà rất nhiều tới quý khách hàng.)'
  },
  '生かします': {
    meaning: 'phát huy tối đa [năng lực, kinh nghiệm: 能力/経験を生かす]',
    example: '学生時代に培った語学力と留学経験を存分に生かして、海外事業部で即戦力として活躍したい。 (Tôi muốn phát huy tối đa vốn ngoại ngữ và trải nghiệm du học thời sinh viên để cống hiến cho bộ phận kinh doanh quốc tế.)'
  },
  'お」城': {
    word: 'お城',
    reading: 'おしろ',
    meaning: 'tòa thành quách, lâu đài cổ (đã sửa lỗi chính tả)',
    example: '春になると満開の桜の花に包まれる大阪城は、国内外から多くの観光客が訪れる名城です。 (Vào mùa xuân ngập tràn trong sắc hoa anh đào rực rỡ, thành Osaka là tòa thành nổi tiếng đón lượng lớn du khách muôn phương.)'
  },
  '敬具': {
    meaning: 'trân trọng, kính thư (từ kết thúc trang trọng đi liền với 拝啓)',
    example: '手紙の結びの挨拶を丁寧に添えた後、右下に小さく「敬具」と記して封筒に納めた。 (Sau khi viết trọn vẹn lời chào kết thúc lá thư, tôi ghi chữ "Kính thư" ở góc phải rồi bỏ vào phong bì.)'
  },
  'ミュヘン': {
    word: 'ミュンヘン',
    reading: 'ミュンヘン',
    meaning: 'thành phố Munich (thủ phủ bang Bayern của Đức, đã sửa lỗi encoding)',
    example: '秋にドイツのミュンヘンで開催されるオクトーバーフェストには、世界中からビール愛好家が集まる。 (Lễ hội bia Oktoberfest diễn ra vào mùa thu tại Munich - Đức thu hút đông đảo tín đồ yêu bia khắp thế giới.)'
  }
};

function run() {
  console.log('Bắt đầu cập nhật Minna N4 Batch B (Unit 42 -> Unit 50 & 3 từ liên quan)...');
  let updatedCount = 0;

  // 1. Cập nhật 3 từ ngoài Minna N4
  const extraFiles = [
    'jlpt-n3-core-bank/theme-02-society-culture/vocabulary.json',
    'minna-no-nihongo-n4/unit-39/vocabulary.json'
  ];

  for (const rel of extraFiles) {
    const fullPath = path.join(DATA_DIR, rel);
    if (!fs.existsSync(fullPath)) continue;
    const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    let changed = false;
    for (const item of data) {
      if (batchBDict[item.word]) {
        const cur = batchBDict[item.word];
        if (cur.meaning) item.meaning = cur.meaning;
        if (cur.example) item.example = cur.example;
        changed = true;
        updatedCount++;
      }
    }
    if (changed) {
      fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`[✓] Đã cập nhật ${rel}`);
    }
  }

  // 2. Cập nhật Unit 42 -> Unit 50
  for (let u = 42; u <= 50; u++) {
    const unitFolder = 'unit-' + u;
    const rel = path.join('minna-no-nihongo-n4', unitFolder, 'vocabulary.json');
    const fullPath = path.join(DATA_DIR, rel);

    if (!fs.existsSync(fullPath)) continue;

    const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    let changed = false;

    for (const item of data) {
      const w = item.word;
      if (batchBDict[w]) {
        const cur = batchBDict[w];
        if (cur.word) item.word = cur.word;
        if (cur.reading) item.reading = cur.reading;
        if (cur.meaning) item.meaning = cur.meaning;
        if (cur.example) item.example = cur.example;
        changed = true;
        updatedCount++;
      }
    }

    if (changed) {
      fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`[✓] Đã cập nhật ${rel}`);
    }
  }

  console.log(`\nHoàn tất Batch B N4! Đã cập nhật ${updatedCount} từ vựng.`);
}

run();

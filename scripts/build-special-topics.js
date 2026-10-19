// scripts/build-special-topics.js
// Tạo bộ dữ liệu Chuyên đề Liên từ & Phó từ JLPT (N5 - N3) chất lượng cao

const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', 'data', 'special-topics-conjunctions-adverbs');

const units = [
  {
    dir: 'unit-01-conjunctions-basic',
    meta: {
      title: 'Bài 1: Liên từ cơ bản N5 - N4 (Tiếp nối, Nguyên nhân & Đối lập)',
      order: 1,
      description: 'Tổng hợp các liên từ nền tảng thiết yếu để nối câu, diễn đạt nguyên nhân kết quả và tương phản'
    },
    vocab: [
      {
        word: 'そして',
        reading: 'そして',
        meaning: 'và, rồi thì',
        sinoVietnamese: '',
        example: '朝起きて、顔を洗いました。そして、朝ご飯を食べました。 (Sáng dậy, tôi rửa mặt. Và rồi, tôi ăn bữa sáng.)'
      },
      {
        word: 'それから',
        reading: 'それから',
        meaning: 'sau đó, tiếp theo',
        sinoVietnamese: '',
        example: 'スーパーで野菜を買いました。それから、本屋へ行きました。 (Tôi mua rau ở siêu thị. Sau đó, tôi đến hiệu sách.)'
      },
      {
        word: 'しかし',
        reading: 'しかし',
        meaning: 'nhưng, tuy nhiên (văn trang trọng)',
        sinoVietnamese: '',
        example: '一生懸命勉強しました。しかし、試験に合格できませんでした。 (Tôi đã học hết sức chăm chỉ. Tuy nhiên, tôi vẫn không đỗ kỳ thi.)'
      },
      {
        word: 'でも',
        reading: 'でも',
        meaning: 'nhưng (văn nói thông dụng)',
        sinoVietnamese: '',
        example: '日本料理が好きです。でも、納豆は食べられません。 (Tôi thích món ăn Nhật. Nhưng món natto thì tôi không ăn được.)'
      },
      {
        word: 'けれども',
        reading: 'けれども',
        meaning: 'tuy nhiên, dù vậy',
        sinoVietnamese: '',
        example: '値段は少し高いです。けれども、品質はとても良いです。 (Giá hơi đắt một chút. Dù vậy, chất lượng rất tốt.)'
      },
      {
        word: 'だから',
        reading: 'だから',
        meaning: 'vì thế, do đó (văn nói thân mật)',
        sinoVietnamese: '',
        example: '今日は雨が降っています。だから、家で映画を見ます。 (Hôm nay trời mưa. Vì thế, tôi ở nhà xem phim.)'
      },
      {
        word: 'ですから',
        reading: 'ですから',
        meaning: 'vì vậy, cho nên (lịch sự)',
        sinoVietnamese: '',
        example: '明日は大事な試験があります。ですから、早く寝てください。 (Ngày mai có bài thi quan trọng. Vì vậy, hãy ngủ sớm nhé.)'
      },
      {
        word: 'それで',
        reading: 'それで',
        meaning: 'do đó, vì thế mà (kể lại sự việc)',
        sinoVietnamese: '',
        example: '道がとても混んでいました。それで、約束の時間に遅れました。 (Đường rất đông đúc. Do đó, tôi đã bị muộn giờ hẹn.)'
      },
      {
        word: 'それに',
        reading: 'それに',
        meaning: 'hơn nữa, thêm vào đó',
        sinoVietnamese: '',
        example: 'この店は料理が美味しいです。それに、値段も安いです。 (Quán này đồ ăn ngon. Hơn nữa, giá cả cũng rẻ.)'
      },
      {
        word: 'また',
        reading: 'また',
        meaning: 'ngoài ra, hơn nữa, lại',
        sinoVietnamese: '',
        example: '彼は英語が上手です。また、日本語も話せます。 (Anh ấy giỏi tiếng Anh. Ngoài ra, anh ấy cũng nói được tiếng Nhật.)'
      },
      {
        word: 'ところで',
        reading: 'ところで',
        meaning: 'nhân tiện, à này (chuyển đổi đề tài)',
        sinoVietnamese: '',
        example: 'もうすぐ夏休みですね。ところで、どこかへ旅行に行きますか。 (Sắp đến kỳ nghỉ hè rồi nhỉ. Nhân tiện, bạn có đi du lịch đâu không?)'
      },
      {
        word: '例えば',
        reading: 'たとえば',
        meaning: 'ví dụ như',
        sinoVietnamese: 'LỆ',
        example: '日本の文化、例えばアニメや茶道に興味があります。 (Tôi quan tâm đến văn hóa Nhật Bản, ví dụ như anime hay trà đạo.)'
      },
      {
        word: 'それなら',
        reading: 'それなら',
        meaning: 'nếu thế thì, vậy thì',
        sinoVietnamese: '',
        example: '頭が痛いですか。それなら、この薬を飲んで休んでください。 (Bạn bị đau đầu à? Nếu thế thì hãy uống thuốc này rồi nghỉ ngơi nhé.)'
      },
      {
        word: 'すると',
        reading: 'すると',
        meaning: 'thế là, ngay sau đó thì',
        sinoVietnamese: '',
        example: '窓を開けました。すると、冷たい風が入ってきました。 (Tôi mở cửa sổ ra. Thế là một luồng gió lạnh ùa vào.)'
      },
      {
        word: 'じゃあ',
        reading: 'じゃあ',
        meaning: 'vậy thì, thế thì (văn nói thân mật)',
        sinoVietnamese: '',
        example: '時間になりましたね。じゃあ、そろそろ出かけましょう。 (Đến giờ rồi nhỉ. Vậy thì chúng ta chuẩn bị xuất phát thôi.)'
      },
      {
        word: 'では',
        reading: 'では',
        meaning: 'vậy thì (văn trang trọng/lịch sự)',
        sinoVietnamese: '',
        example: 'では、今日の会議を始めます。 (Vậy thì, tôi xin phép bắt đầu cuộc họp ngày hôm nay.)'
      },
      {
        word: '実は',
        reading: 'じつは',
        meaning: 'thực ra là, sự thật là',
        sinoVietnamese: 'THỰC',
        example: '実は、来月日本へ留学することになりました。 (Thực ra là, tháng sau tôi sẽ đi du học Nhật Bản.)'
      },
      {
        word: 'なぜなら',
        reading: 'なぜなら',
        meaning: 'lý do là vì, bởi vì',
        sinoVietnamese: '',
        example: '今日は出かけません。なぜなら、熱があるからです。 (Hôm nay tôi không ra ngoài. Lý do là vì tôi bị sốt.)'
      },
      {
        word: 'それとも',
        reading: 'それとも',
        meaning: 'hoặc là, hay là (dùng trong câu hỏi)',
        sinoVietnamese: '',
        example: 'コーヒーにしますか。それとも、紅茶にしますか。 (Bạn chọn cà phê, hay là chọn trà?)'
      },
      {
        word: 'つまり',
        reading: 'つまり',
        meaning: 'tóm lại là, nói cách khác',
        sinoVietnamese: '',
        example: '母の兄、つまり私の叔父が家に来ました。 (Anh trai của mẹ, tóm lại là bác tôi đã đến nhà chơi.)'
      },
      {
        word: 'ですから',
        reading: 'ですから',
        meaning: 'chính vì thế, vì vậy mà',
        sinoVietnamese: '',
        example: '危険な場所です。ですから、近づかないでください。 (Đây là nơi nguy hiểm. Chính vì thế, xin đừng lại gần.)'
      },
      {
        word: 'ただし',
        reading: 'ただし',
        meaning: 'tuy nhiên, với điều kiện là',
        sinoVietnamese: '',
        example: '入場は無料です。ただし、事前の予約が必要です。 (Vé vào cửa miễn phí. Tuy nhiên, cần phải đặt trước.)'
      },
      {
        word: 'その上',
        reading: 'そのうえ',
        meaning: 'hơn nữa, thêm vào đó',
        sinoVietnamese: 'THƯỢNG',
        example: '雨が強くなり、その上風も激しく吹いてきました。 (Trời mưa to, hơn nữa gió cũng thổi mạnh dữ dội.)'
      },
      {
        word: 'それにしても',
        reading: 'それにしても',
        meaning: 'dù vậy đi nữa thì, thế nhưng',
        sinoVietnamese: '',
        example: '今年の夏は暑いですが、それにしても今日は暑すぎます。 (Mùa hè năm nay nóng thật, dù vậy thì hôm nay cũng quá nóng.)'
      },
      {
        word: 'それなのに',
        reading: 'それなのに',
        meaning: 'thế mà, vậy mà (bất mãn, ngạc nhiên)',
        sinoVietnamese: '',
        example: '薬を飲みました。それなのに、熱が下がりません。 (Tôi đã uống thuốc rồi. Thế mà cơn sốt vẫn không hạ.)'
      },
      {
        word: 'その結果',
        reading: 'そのけっか',
        meaning: 'kết quả là',
        sinoVietnamese: 'KẾT QUẢ',
        example: '毎日練習しました。その結果、試合に勝つことができました。 (Tôi luyện tập mỗi ngày. Kết quả là tôi đã giành chiến thắng trong trận đấu.)'
      }
    ],
    kanji: [
      { kanji: '例', on: 'レイ', kun: 'たと.える', meaning: 'Ví dụ, tiền lệ', sinoVietnamese: 'LỆ', examples: '例えば (ví dụ)' },
      { kanji: '実', on: 'ジツ', kun: 'み, みの.る', meaning: 'Thực tế, quả thật', sinoVietnamese: 'THỰC', examples: '実は (thực ra)' },
      { kanji: '上', on: 'ジョウ', kun: 'うえ, あ.がる', meaning: 'Ở trên, bên trên', sinoVietnamese: 'THƯỢNG', examples: 'その上 (hơn nữa)' },
      { kanji: '結', on: 'ケツ', kun: 'むす.ぶ', meaning: 'Kết nối, kết thúc', sinoVietnamese: 'KẾT', examples: '結果 (kết quả)' },
      { kanji: '果', on: 'カ', kun: 'は.たす', meaning: 'Hoa quả, kết quả', sinoVietnamese: 'QUẢ', examples: 'その結果 (kết quả là)' }
    ]
  },
  {
    dir: 'unit-02-conjunctions-advanced',
    meta: {
      title: 'Bài 2: Liên từ nâng cao & Đọc hiểu N3 (Giải thích, Đối lập & Tóm tắt)',
      order: 2,
      description: 'Các liên từ quyết định trong phần Đọc hiểu (Dokkai) và bài thi Ngữ pháp N3'
    },
    vocab: [
      {
        word: '一方',
        reading: 'いっぽう',
        meaning: 'mặt khác, trái lại',
        sinoVietnamese: 'NHẤT PHƯƠNG',
        example: '兄は活発な一方、弟はおとなしい性格です。 (Người anh rất năng động, mặt khác người em lại có tính cách trầm lặng.)'
      },
      {
        word: '要するに',
        reading: 'ようするに',
        meaning: 'tóm lại là, nói tóm lại',
        sinoVietnamese: 'YẾU',
        example: '彼の話は長いが、要するに断りたいのだ。 (Câu chuyện của anh ấy dài dòng, nhưng tóm lại là anh ấy muốn từ chối.)'
      },
      {
        word: 'すなわち',
        reading: 'すなわち',
        meaning: 'nói cách khác, tức là',
        sinoVietnamese: '',
        example: '日本の首都、すなわち東京には人がたくさん集まります。 (Thủ đô của Nhật Bản, tức là Tokyo, tập trung rất đông người.)'
      },
      {
        word: 'したがって',
        reading: 'したがって',
        meaning: 'do đó, theo đó (văn viết logic)',
        sinoVietnamese: '',
        example: '台風が接近しています。したがって、午後の授業は休みです。 (Bão đang đến gần. Do đó, buổi học chiều nay được nghỉ.)'
      },
      {
        word: 'ところが',
        reading: 'ところが',
        meaning: 'thế nhưng, ai ngờ (ngạc nhiên, trái kỳ vọng)',
        sinoVietnamese: '',
        example: '晴れると思って傘を持たずに出かけました。ところが、雨が降ってきました。 (Tôi nghĩ trời nắng nên ra ngoài không mang ô. Ai ngờ trời lại đổ mưa.)'
      },
      {
        word: 'さらに',
        reading: 'さらに',
        meaning: 'hơn nữa, thêm nữa',
        sinoVietnamese: '',
        example: '物価が上がり、さらに税金も高くなりました。 (Vật giá tăng, hơn nữa tiền thuế cũng trở nên đắt đỏ hơn.)'
      },
      {
        word: 'もっとも',
        reading: 'もっとも',
        meaning: 'mặc dù vậy, tuy nhiên (bổ sung điều kiện)',
        sinoVietnamese: '',
        example: '全員が参加する予定です。もっとも、体調が悪い人は無理をしなくていいです。 (Dự kiến tất cả mọi người sẽ tham gia. Mặc dù vậy, ai thấy mệt thì không cần phải gượng ép.)'
      },
      {
        word: 'あるいは',
        reading: 'あるいは',
        meaning: 'hoặc là, có lẽ',
        sinoVietnamese: '',
        example: 'メール、あるいは電話でご連絡ください。 (Xin vui lòng liên hệ qua email, hoặc là gọi điện thoại.)'
      },
      {
        word: 'または',
        reading: 'または',
        meaning: 'hoặc là (dùng trong văn bản)',
        sinoVietnamese: '',
        example: '黒、または青のボールペンで記入してください。 (Xin hãy điền bằng bút bi màu đen hoặc màu xanh.)'
      },
      {
        word: 'なぜかというと',
        reading: 'なぜかというと',
        meaning: 'sở dĩ như vậy là vì',
        sinoVietnamese: '',
        example: '旅行先を変更しました。なぜかというと、ホテルが満室だったからです。 (Tôi đã đổi điểm đến du lịch. Sở dĩ như vậy là vì khách sạn đã kín phòng.)'
      },
      {
        word: 'さて',
        reading: 'さて',
        meaning: 'và sau đây, nào (chuyển sang chủ đề chính)',
        sinoVietnamese: '',
        example: '挨拶はここまでにして、さて、本題に入りましょう。 (Lời chào xin dừng ở đây, nào, chúng ta hãy bước vào chủ đề chính.)'
      },
      {
        word: 'そのために',
        reading: 'そのために',
        meaning: 'chính vì lý do đó mà',
        sinoVietnamese: '',
        example: '大雪が降りました。そのために、電車が止まってしまいました。 (Tuyết rơi rất lớn. Chính vì lý do đó mà tàu điện đã bị ngừng chạy.)'
      },
      {
        word: 'それに対して',
        reading: 'それにたいして',
        meaning: 'trái ngược với điều đó',
        sinoVietnamese: 'ĐỐI',
        example: '都市部は若者が多い。それに対して、農村部は高齢化が進んでいる。 (Khu vực thành thị có nhiều người trẻ. Trái ngược với điều đó, vùng nông thôn đang ngày càng già hóa.)'
      },
      {
        word: 'それどころか',
        reading: 'それどころか',
        meaning: 'trái lại, chẳng những không mà còn',
        sinoVietnamese: '',
        example: '風邪は治るどころか、悪化してしまいました。 (Bệnh cảm chẳng những không khỏi mà ngược lại còn trở nặng hơn.)'
      },
      {
        word: 'いわば',
        reading: 'いわば',
        meaning: 'có thể ví như là, nói ví von là',
        sinoVietnamese: '',
        example: '彼は私たちチームの、いわばリーダーのような存在です。 (Anh ấy có thể ví như là chỗ dựa tinh thần của cả đội chúng tôi.)'
      },
      {
        word: 'いわゆる',
        reading: 'いわゆる',
        meaning: 'cái gọi là (ngôn ngữ thông dụng)',
        sinoVietnamese: '',
        example: '彼女はいわゆるキャリアウーマンです。 (Cô ấy là mẫu người phụ nữ mà người ta thường gọi là phụ nữ thành đạt.)'
      },
      {
        word: 'それにしても',
        reading: 'それにしても',
        meaning: 'dù là như thế thì, kể cả vậy',
        sinoVietnamese: '',
        example: '遅刻の理由は分かりました。それにしても、連絡ぐらいはするべきでした。 (Tôi hiểu lý do bạn đến muộn rồi. Kể cả vậy, ít nhất bạn cũng nên liên lạc trước.)'
      },
      {
        word: 'とはいえ',
        reading: 'とはいえ',
        meaning: 'mặc dù nói là vậy nhưng',
        sinoVietnamese: '',
        example: '春になったとはいえ、朝晩はまだ冷え込みます。 (Mặc dù nói là đã sang xuân nhưng sáng tối trời vẫn còn se lạnh.)'
      },
      {
        word: 'にもかかわらず',
        reading: 'にもかかわらず',
        meaning: 'mặc dù, bất chấp',
        sinoVietnamese: '',
        example: '大雨にもかかわらず、多くの観客が集まりました。 (Bất chấp cơn mưa to, rất nhiều khán giả đã đến tụ họp.)'
      },
      {
        word: 'その反面',
        reading: 'そのはんめん',
        meaning: 'mặt khác, bù lại',
        sinoVietnamese: 'PHẢN DIỆN',
        example: 'この車は便利だが、その反面ガソリン代がかかる。 (Chiếc xe này tiện lợi, nhưng mặt khác chi phí xăng dầu khá tốn kém.)'
      },
      {
        word: '要は',
        reading: 'ようは',
        meaning: 'tóm lại, điểm mấu chốt là',
        sinoVietnamese: 'YẾU',
        example: 'いろいろ議論したが、要はやる気があるかどうかだ。 (Đã bàn luận nhiều thứ, nhưng tóm lại điểm mấu chốt là có quyết tâm làm hay không.)'
      },
      {
        word: 'それどころではない',
        reading: 'それどころではない',
        meaning: 'không phải là lúc để...',
        sinoVietnamese: '',
        example: '仕事が忙しくて、遊びに行くどころではありません。 (Công việc bận ngập đầu, chẳng còn tâm trí đâu để mà đi chơi.)'
      },
      {
        word: 'むしろ',
        reading: 'むしろ',
        meaning: 'thà rằng, đúng hơn là',
        sinoVietnamese: '',
        example: '失敗を恐れるより、むしろ積極的に挑戦するべきだ。 (Thay vì sợ thất bại, đúng hơn là nên chủ động đương đầu thử thách.)'
      },
      {
        word: 'ただ',
        reading: 'ただ',
        meaning: 'chỉ có điều, nhưng mà',
        sinoVietnamese: '',
        example: 'この部屋はとても気に入りました。ただ、家賃が少し高いです。 (Tôi rất thích căn phòng này. Chỉ có điều, tiền thuê nhà hơi đắt một chút.)'
      },
      {
        word: 'それに引き換え',
        reading: 'それにひきかえ',
        meaning: 'trái ngược hẳn với điều đó',
        sinoVietnamese: 'DẪN HOÁN',
        example: '去年は豊作だった。それに引き換え、今年は不作だ。 (Năm ngoái được mùa bội thu. Trái ngược hẳn, năm nay lại mất mùa.)'
      },
      {
        word: 'あるいはまた',
        reading: 'あるいはまた',
        meaning: 'hoặc giả là, hoặc hơn nữa là',
        sinoVietnamese: '',
        example: '電車で行くか、あるいはまたバスを利用するのもいい。 (Đi bằng tàu điện cũng được, hoặc là đi xe buýt cũng rất ổn.)'
      }
    ],
    kanji: [
      { kanji: '方', on: 'ホウ', kun: 'かた', meaning: 'Phương hướng, cách thức', sinoVietnamese: 'PHƯƠNG', examples: '一方 (mặt khác)' },
      { kanji: '要', on: 'ヨウ', kun: 'い.る', meaning: 'Cốt yếu, quan trọng', sinoVietnamese: 'YẾU', examples: '要するに (tóm lại)' },
      { kanji: '対', on: 'タイ, ツイ', kun: '', meaning: 'Đối lập, đối với', sinoVietnamese: 'ĐỐI', examples: 'それに対して (trái ngược với điều đó)' },
      { kanji: '面', on: 'メン', kun: 'おも, おもて', meaning: 'Mặt, bề mặt', sinoVietnamese: 'DIỆN', examples: '反面 (mặt khác)' }
    ]
  },
  {
    dir: 'unit-03-adverbs-degree-frequency',
    meta: {
      title: 'Bài 3: Phó từ chỉ Mức độ & Tần suất N5 - N3',
      order: 3,
      description: 'Các phó từ diễn tả mức độ đậm nhạt và tần suất hành động thường gặp nhất'
    },
    vocab: [
      {
        word: 'とても',
        reading: 'とても',
        meaning: 'rất, vô cùng',
        sinoVietnamese: '',
        example: '日本の富士山はとても綺麗です。 (Núi Phú Sĩ của Nhật Bản vô cùng đẹp.)'
      },
      {
        word: 'たいへん',
        reading: 'たいへん',
        meaning: 'rất nhiều, vô cùng (lịch sự)',
        sinoVietnamese: 'ĐẠI BIẾN',
        example: '昨日は大変お世話になりました。 (Hôm qua tôi đã nhận được sự giúp đỡ rất nhiều từ bạn.)'
      },
      {
        word: 'かなり',
        reading: 'かなり',
        meaning: 'khá là, tương đối',
        sinoVietnamese: '',
        example: '今日の試験はかなり難しかったです。 (Bài thi hôm nay khá là khó.)'
      },
      {
        word: 'ずいぶん',
        reading: 'ずいぶん',
        meaning: 'đáng kể, nhiều hơn mong đợi',
        sinoVietnamese: '',
        example: 'しばらく会わない間に、ずいぶん背が伸びましたね。 (Một thời gian không gặp, cậu đã cao lên đáng kể nhỉ.)'
      },
      {
        word: 'すこし',
        reading: 'すこし',
        meaning: 'một chút, một ít',
        sinoVietnamese: 'THIỂU',
        example: '日本語が少し話せます。 (Tôi có thể nói được một chút tiếng Nhật.)'
      },
      {
        word: 'ちょっと',
        reading: 'ちょっと',
        meaning: 'một chút (văn nói thông dụng)',
        sinoVietnamese: '',
        example: 'ちょっと待ってください。 (Xin hãy chờ tôi một chút.)'
      },
      {
        word: 'もっと',
        reading: 'もっと',
        meaning: 'hơn nữa, thêm nữa',
        sinoVietnamese: '',
        example: 'もっと大きい声で話してください。 (Xin hãy nói với giọng to hơn nữa.)'
      },
      {
        word: 'ずっと',
        reading: 'ずっと',
        meaning: 'hơn hẳn / suốt từ đó đến giờ',
        sinoVietnamese: '',
        example: '新幹線は普通電車よりずっと速いです。 (Tàu Shinkansen nhanh hơn hẳn so với tàu thông thường.)'
      },
      {
        word: 'だいたい',
        reading: 'だいたい',
        meaning: 'đại khái, hầu như',
        sinoVietnamese: 'ĐẠI THỂ',
        example: '今日の宿題はだいたい終わりました。 (Bài tập hôm nay tôi đã làm đại khái xong rồi.)'
      },
      {
        word: 'ほとんど',
        reading: 'ほとんど',
        meaning: 'hầu hết, gần như toàn bộ',
        sinoVietnamese: '',
        example: '冷蔵庫の中の食べ物はほとんど食べました。 (Thức ăn trong tủ lạnh tôi đã ăn gần hết rồi.)'
      },
      {
        word: 'すっかり',
        reading: 'すっかり',
        meaning: 'hoàn toàn, sạch trơn',
        sinoVietnamese: '',
        example: '桜の花はすっかり散ってしまいました。 (Hoa anh đào đã rụng hoàn toàn sạch trơn rồi.)'
      },
      {
        word: 'ぴったり',
        reading: 'ぴったり',
        meaning: 'vừa vặn, khít khao',
        sinoVietnamese: '',
        example: 'この靴は私の足にぴったりです。 (Đôi giày này vừa vặn khít khao với chân tôi.)'
      },
      {
        word: 'いつも',
        reading: 'いつも',
        meaning: 'luôn luôn, lúc nào cũng',
        sinoVietnamese: '',
        example: '父はいつも朝6時に起きます。 (Bố tôi lúc nào cũng thức dậy vào lúc 6 giờ sáng.)'
      },
      {
        word: 'たいてい',
        reading: 'たいてい',
        meaning: 'thông thường, phần lớn',
        sinoVietnamese: '',
        example: '休みの日はたいてい家で本を読んでいます。 (Vào ngày nghỉ, thông thường tôi ở nhà đọc sách.)'
      },
      {
        word: 'よく',
        reading: 'よく',
        meaning: 'thường xuyên / rõ ràng',
        sinoVietnamese: '',
        example: '暇なときはよく友達とカフェに行きます。 (Khi rảnh rỗi tôi thường đi cà phê cùng bạn bè.)'
      },
      {
        word: 'ときどき',
        reading: 'ときどき',
        meaning: 'thỉnh thoảng, đôi khi',
        sinoVietnamese: 'THỜI',
        example: '週末は時々家族で外食します。 (Cuối tuần tôi thỉnh thoảng đi ăn ngoài cùng gia đình.)'
      },
      {
        word: 'たまに',
        reading: 'たまに',
        meaning: 'hiếm khi, họa hoằn lắm',
        sinoVietnamese: '',
        example: '映画館にはたまにしか行きません。 (Tôi hiếm khi mới đến rạp chiếu phim.)'
      },
      {
        word: 'あまり',
        reading: 'あまり',
        meaning: 'không... lắm (đi với phủ định)',
        sinoVietnamese: '',
        example: '辛い料理はあまり好きではありません。 (Tôi không thích món ăn cay cho lắm.)'
      },
      {
        word: 'ぜんぜん',
        reading: 'ぜんぜん',
        meaning: 'hoàn toàn không (đi với phủ định)',
        sinoVietnamese: 'TOÀN NHIÊN',
        example: '彼の話は全然分かりませんでした。 (Tôi hoàn toàn không hiểu câu chuyện của anh ấy.)'
      },
      {
        word: 'めったに',
        reading: 'めったに',
        meaning: 'hầu như không bao giờ (đi với phủ định)',
        sinoVietnamese: '',
        example: '彼はめったに怒りません。 (Anh ấy hầu như không bao giờ nổi giận.)'
      },
      {
        word: '決して',
        reading: 'けっして',
        meaning: 'tuyệt đối không bao giờ',
        sinoVietnamese: 'QUYẾT',
        example: 'この秘密は決して誰にも言いません。 (Bí mật này tôi tuyệt đối không nói cho bất kỳ ai.)'
      },
      {
        word: 'まったく',
        reading: 'まったく',
        meaning: 'hoàn toàn không / thực sự là',
        sinoVietnamese: '',
        example: '最近まったく運動をしていません。 (Dạo gần đây tôi hoàn toàn không tập thể dục.)'
      },
      {
        word: 'ちっとも',
        reading: 'ちっとも',
        meaning: 'một chút cũng không',
        sinoVietnamese: '',
        example: '何回説明されても、ちっとも分かりません。 (Dù được giải thích bao nhiêu lần, tôi vẫn chẳng hiểu một chút nào.)'
      },
      {
        word: '少しも',
        reading: 'すこしも',
        meaning: 'một chút cũng không',
        sinoVietnamese: 'THIỂU',
        example: '夜になっても少しも涼しくなりません。 (Trời đã về đêm rồi mà một chút cũng không mát hơn.)'
      },
      {
        word: 'きわめて',
        reading: 'きわめて',
        meaning: 'cực kỳ, vô cùng (văn trang trọng)',
        sinoVietnamese: 'CỰC',
        example: 'この問題の解決は極めて重要です。 (Việc giải quyết vấn đề này là cực kỳ quan trọng.)'
      },
      {
        word: 'いっそう',
        reading: 'いっそう',
        meaning: 'càng thêm, hơn một bậc',
        sinoVietnamese: 'NHẤT TẦNG',
        example: '雨が止んで、寒さがいっそう厳しくなりました。 (Mưa tạnh, cái lạnh lại càng thêm khắc nghiệt.)'
      },
      {
        word: 'だんだん',
        reading: 'だんだん',
        meaning: 'dần dần, từ từ',
        sinoVietnamese: 'ĐOÀN',
        example: '暖かくなって、だんだん春らしくなってきました。 (Trời ấm lên, dần dần đã mang không khí mùa xuân.)'
      },
      {
        word: 'ますます',
        reading: 'ますます',
        meaning: 'ngày càng, càng ngày càng',
        sinoVietnamese: '',
        example: '日本語を勉強すればするほど、ますます面白くなります。 (Càng học tiếng Nhật, tôi lại càng thấy thú vị hơn.)'
      },
      {
        word: '徐々に',
        reading: 'じょじょに',
        meaning: 'chầm chậm, từng bước một',
        sinoVietnamese: 'TỪ',
        example: '病気は徐々に良くなっています。 (Bệnh tình đang dần dần tiến triển tốt lên từng bước.)'
      },
      {
        word: '一気に',
        reading: 'いっきに',
        meaning: 'một mạch, một hơi',
        sinoVietnamese: 'NHẤT KHÍ',
        example: '冷たい水を一気に飲み干しました。 (Tôi uống cạn một hơi cốc nước mát lạnh.)'
      }
    ],
    kanji: [
      { kanji: '変', on: 'ヘン', kun: 'か.わる', meaning: 'Biến đổi, kỳ lạ', sinoVietnamese: 'BIẾN', examples: '大変 (vô cùng, vất vả)' },
      { kanji: '少', on: 'ショウ', kun: 'すく.ない, すこ.し', meaning: 'Ít, một chút', sinoVietnamese: 'THIỂU', examples: '少し (một chút)' },
      { kanji: '時', on: 'ジ', kun: 'とき', meaning: 'Thời gian, khi', sinoVietnamese: 'THỜI', examples: '時々 (thỉnh thoảng)' },
      { kanji: '決', on: 'ケツ', kun: 'き.める', meaning: 'Quyết định', sinoVietnamese: 'QUYẾT', examples: '決して (tuyệt đối không)' }
    ]
  },
  {
    dir: 'unit-04-adverbs-attitude-onomatopoeia',
    meta: {
      title: 'Bài 4: Phó từ Phán đoán, Tâm trạng & Trạng thái N5 - N3',
      order: 4,
      description: 'Các phó từ chỉ tâm thế người nói, sự phán đoán và từ láy trạng thái sinh động'
    },
    vocab: [
      {
        word: 'きっと',
        reading: 'きっと',
        meaning: 'chắc chắn là, nhất định',
        sinoVietnamese: '',
        example: '明日はきっといい天気になるでしょう。 (Ngày mai chắc chắn trời sẽ đẹp.)'
      },
      {
        word: 'かならず',
        reading: 'かならず',
        meaning: 'nhất định (quy luật, lời hứa)',
        sinoVietnamese: 'TẤT',
        example: '借りたお金は必ず返します。 (Tiền đã mượn tôi nhất định sẽ trả.)'
      },
      {
        word: 'ぜひ',
        reading: 'ぜひ',
        meaning: 'nhất định (tha thiết muốn làm)',
        sinoVietnamese: 'THỊ PHI',
        example: '日本へ来たら、ぜひ私の家に遊びに来てください。 (Khi đến Nhật Bản, bạn nhất định phải ghé nhà tôi chơi nhé.)'
      },
      {
        word: 'たぶん',
        reading: 'たぶん',
        meaning: 'có lẽ, có thể',
        sinoVietnamese: 'ĐA PHẦN',
        example: '彼は忙しいので、たぶんパーティーには来ないでしょう。 (Anh ấy bận rộn nên có lẽ sẽ không đến bữa tiệc đâu.)'
      },
      {
        word: 'もしかしたら',
        reading: 'もしかしたら',
        meaning: 'có khả năng là, biết đâu chừng',
        sinoVietnamese: '',
        example: 'もしかしたら彼の言っていることは本当かもしれません。 (Biết đâu chừng những điều anh ấy đang nói lại là sự thật.)'
      },
      {
        word: 'どうしても',
        reading: 'どうしても',
        meaning: 'dù thế nào cũng, bằng mọi giá',
        sinoVietnamese: '',
        example: 'どうしても日本で働きたいです。 (Dù thế nào đi nữa tôi cũng muốn được làm việc tại Nhật Bản.)'
      },
      {
        word: 'やっと',
        reading: 'やっと',
        meaning: 'cuối cùng thì (kết quả mong đợi sau nỗ lực)',
        sinoVietnamese: '',
        example: '長い間勉強して、やっとN3に合格しました。 (Sau thời gian dài học tập, cuối cùng tôi cũng đã thi đỗ N3.)'
      },
      {
        word: 'とうとう',
        reading: 'とうとう',
        meaning: 'cuối cùng thì (kết cục xảy ra sau thời gian dài)',
        sinoVietnamese: '',
        example: '可愛がっていた猫がとうとう死んでしまいました。 (Chú mèo mà tôi hết mực yêu quý cuối cùng cũng đã qua đời.)'
      },
      {
        word: 'ついに',
        reading: 'ついに',
        meaning: 'rốt cuộc thì, sau cùng thì',
        sinoVietnamese: 'CHUNG',
        example: '長年の研究がついに実を結びました。 (Nhiều năm nghiên cứu rốt cuộc cũng đã gặt hái thành quả.)'
      },
      {
        word: 'まるで',
        reading: 'まるで',
        meaning: 'giống hệt như là (đi với ようだ)',
        sinoVietnamese: '',
        example: '今日は暖かくて、まるで春のようです。 (Hôm nay trời ấm áp, giống hệt như mùa xuân vậy.)'
      },
      {
        word: 'せっかく',
        reading: 'せっかく',
        meaning: 'đã mất công, cất công',
        sinoVietnamese: '',
        example: 'せっかく料理を作ったのに、誰も食べてくれませんでした。 (Đã cất công nấu nướng thế mà chẳng có ai ăn giúp cho.)'
      },
      {
        word: 'わざわざ',
        reading: 'わざわざ',
        meaning: 'cố tình, cất công đặc biệt',
        sinoVietnamese: '',
        example: '雨の中をわざわざ届けに来てくれて、ありがとうございます。 (Cảm ơn bạn đã cất công đội mưa mang đến tận nơi cho tôi.)'
      },
      {
        word: '思い切り',
        reading: 'おもいきり',
        meaning: 'thỏa thích, hết mình',
        sinoVietnamese: 'TƯ THIẾT',
        example: '休日は友達と思い切り遊びました。 (Vào ngày nghỉ tôi đã chơi hết mình thỏa thích cùng bạn bè.)'
      },
      {
        word: 'うっかり',
        reading: 'うっかり',
        meaning: 'lơ đễnh, vô ý, đãng trí',
        sinoVietnamese: '',
        example: 'うっかり傘を電車の中に忘れてしまいました。 (Tôi đã lơ đễnh để quên chiếc ô ở trên tàu điện mất rồi.)'
      },
      {
        word: 'がっかり',
        reading: 'がっかり',
        meaning: 'thất vọng, chán nản',
        sinoVietnamese: '',
        example: '不合格の知らせを聞いて、とてもがっかりしました。 (Nghe tin trượt kỳ thi, tôi cảm thấy rất thất vọng.)'
      },
      {
        word: 'しっかり',
        reading: 'しっかり',
        meaning: 'chắc chắn, vững vàng, cẩn thận',
        sinoVietnamese: '',
        example: '手すりをしっかりつかんで階段を降りてください。 (Xin hãy nắm chắc tay vịn rồi bước xuống cầu thang nhé.)'
      },
      {
        word: 'はっきり',
        reading: 'はっきり',
        meaning: 'rõ ràng, dứt khoát',
        sinoVietnamese: '',
        example: '遠くの山がはっきり見えます。 (Tôi có thể nhìn thấy ngọn núi ở đằng xa một cách rất rõ ràng.)'
      },
      {
        word: 'すっきり',
        reading: 'すっきり',
        meaning: 'khoan khoái, sảng khoái, gọn gàng',
        sinoVietnamese: '',
        example: 'シャワーを浴びて気分がすっきりしました。 (Sau khi tắm vòi sen, tinh thần tôi cảm thấy thật sảng khoái.)'
      },
      {
        word: 'ゆっくり',
        reading: 'ゆっくり',
        meaning: 'thong thả, từ từ, chậm rãi',
        sinoVietnamese: '',
        example: 'お茶を飲みながら、ゆっくり休んでください。 (Xin hãy vừa uống trà vừa thong thả nghỉ ngơi nhé.)'
      },
      {
        word: 'ばったり',
        reading: 'ばったり',
        meaning: 'tình cờ, bất ngờ gặp',
        sinoVietnamese: '',
        example: '駅前で昔の同級生にばったり会いました。 (Tôi đã tình cờ gặp lại người bạn cùng lớp cũ ngay trước ga.)'
      },
      {
        word: 'ぎりぎり',
        reading: 'ぎりぎり',
        meaning: 'sát nút, vừa khít giờ',
        sinoVietnamese: '',
        example: '電車の発車時刻にぎりぎり間に合いました。 (Tôi đã kịp sát nút giờ tàu điện lăn bánh.)'
      },
      {
        word: 'どんどん',
        reading: 'どんどん',
        meaning: 'dồn dập, nhanh chóng, liên tục',
        sinoVietnamese: '',
        example: '分からない言葉があれば、どんどん質問してください。 (Nếu có từ nào không hiểu, các bạn hãy cứ liên tục đặt câu hỏi nhé.)'
      },
      {
        word: 'いきなり',
        reading: 'いきなり',
        meaning: 'đột ngột, bất thình lình',
        sinoVietnamese: '',
        example: '後ろからいきなり声をかけられて驚きました。 (Bất thình lình bị gọi từ đằng sau khiến tôi giật mình.)'
      },
      {
        word: 'とっくに',
        reading: 'とっくに',
        meaning: 'từ lâu rồi, xong từ đời nào rồi',
        sinoVietnamese: '',
        example: 'その仕事なら、とっくに終わっていますよ。 (Công việc đó thì tôi đã hoàn thành xong từ lâu rồi đấy.)'
      },
      {
        word: 'どうせ',
        reading: 'どうせ',
        meaning: 'đằng nào thì cũng, tiện thể',
        sinoVietnamese: '',
        example: 'どうせやるなら、最後まで全力でやりたい。 (Đằng nào cũng làm, tôi muốn dốc hết sức làm đến cùng.)'
      },
      {
        word: 'まさか',
        reading: 'まさか',
        meaning: 'không đời nào, lẽ nào lại',
        sinoVietnamese: '',
        example: 'まさか彼が犯人だとは思いませんでした。 (Không đời nào tôi lại nghĩ rằng anh ấy lại là thủ phạm.)'
      },
      {
        word: '案外',
        reading: 'あんがい',
        meaning: 'ngoài dự tính, không ngờ',
        sinoVietnamese: 'ÁN NGOẠI',
        example: '難しいと思った料理が、案外簡単に作れました。 (Món ăn tưởng chừng phức tạp lại làm được dễ dàng ngoài dự tính.)'
      },
      {
        word: 'およそ',
        reading: 'およそ',
        meaning: 'khoảng chừng, ước chừng',
        sinoVietnamese: '',
        example: '駅から会社までおよそ徒歩10分です。 (Từ nhà ga đến công ty ước chừng đi bộ khoảng 10 phút.)'
      },
      {
        word: 'たいして',
        reading: 'たいして',
        meaning: 'không đến mức... lắm (với phủ định)',
        sinoVietnamese: 'ĐẠI',
        example: 'ニュースで騒ぐほど、大して大きな被害はありませんでした。 (Không có thiệt hại quá lớn đến mức ồn ào như tin tức đưa.)'
      },
      {
        word: 'いよいよ',
        reading: 'いよいよ',
        meaning: 'cuối cùng thì, ngày càng',
        sinoVietnamese: '',
        example: 'いよいよ明日はJLPTの試験当日です。 (Cuối cùng thì ngày mai cũng đã là ngày thi JLPT rồi.)'
      },
      {
        word: 'じっくり',
        reading: 'じっくり',
        meaning: 'kỹ càng, thấu đáo',
        sinoVietnamese: '',
        example: '将来の進路について、じっくり考えたい。 (Tôi muốn suy nghĩ thật thấu đáo, kỹ càng về con đường tương lai.)'
      },
      {
        word: 'そろそろ',
        reading: 'そろそろ',
        meaning: 'chuẩn bị, sắp sửa',
        sinoVietnamese: '',
        example: 'もう10時ですね。そろそろ失礼します。 (Đã 10 giờ rồi nhỉ. Tôi chuẩn bị xin phép ra về.)'
      }
    ],
    kanji: [
      { kanji: '必', on: 'ヒツ', kun: 'かなら.ず', meaning: 'Nhất định, tất yếu', sinoVietnamese: 'TẤT', examples: '必ず (nhất định)' },
      { kanji: '終', on: 'シュウ', kun: 'お.わる, つい.に', meaning: 'Kết thúc, sau cùng', sinoVietnamese: 'CHUNG', examples: 'ついに (sau cùng thì)' },
      { kanji: '案', on: 'アン', kun: '', meaning: 'Phương án, dự tính', sinoVietnamese: 'ÁN', examples: '案外 (ngoài dự tính)' },
      { kanji: '外', on: 'ガイ, ゲ', kun: 'そと, はず.す', meaning: 'Bên ngoài', sinoVietnamese: 'NGOẠI', examples: '案外 (không ngờ)' }
    ]
  }
];

// Tạo cấu trúc thư mục và ghi dữ liệu
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir, { recursive: true });
}

let totalVocab = 0;
let totalKanji = 0;

units.forEach(u => {
  const unitPath = path.join(baseDir, u.dir);
  if (!fs.existsSync(unitPath)) {
    fs.mkdirSync(unitPath, { recursive: true });
  }

  // Ghi _meta.json
  fs.writeFileSync(path.join(unitPath, '_meta.json'), JSON.stringify(u.meta, null, 2), 'utf8');

  // Ghi vocabulary.json
  fs.writeFileSync(path.join(unitPath, 'vocabulary.json'), JSON.stringify(u.vocab, null, 2), 'utf8');

  // Ghi kanji.json
  fs.writeFileSync(path.join(unitPath, 'kanji.json'), JSON.stringify(u.kanji, null, 2), 'utf8');

  totalVocab += u.vocab.length;
  totalKanji += u.kanji.length;

  console.log(`Đã tạo ${u.dir}: ${u.vocab.length} từ vựng, ${u.kanji.length} hán tự.`);
});

console.log(`Tổng cộng: ${totalVocab} từ vựng, ${totalKanji} hán tự chuyên đề.`);

/**
 * scripts/build-grammar-data.js
 * Tạo kho dữ liệu Ngữ pháp JLPT N5 - N3 phân cấp theo Bài học (Bài 1, Bài 2,...)
 * Hỗ trợ 2 chế độ:
 * 1. Ôn tập nhanh: Luyện riêng từng mẫu ngữ pháp (5 câu/mẫu)
 * 2. Ôn tập tổng hợp: 3 Bộ đề tổng hợp cho cả bài (số câu = số mẫu x 5, xáo trộn câu hỏi JLPT)
 */

const fs = require('fs');
const path = require('path');

const grammarDir = path.join(__dirname, '..', 'data', 'grammar');
if (!fs.existsSync(grammarDir)) {
  fs.mkdirSync(grammarDir, { recursive: true });
}

// 1. Danh sách chi tiết các mẫu ngữ pháp JLPT kèm ngân hàng câu hỏi phong phú
const grammarItems = [
  // --- N5: BÀI 1 ---
  {
    id: 'bunpou-n5-te-mo-ii-desu',
    level: 'N5',
    unitId: 'grammar-n5-unit-01',
    title: '〜てもいいですか / 〜てもいいです',
    meaning: 'Làm ... có được không? / Được phép làm...',
    connection: 'V-て + もいいです (か)',
    usageNotes: 'Dùng để xin phép (か) hoặc cho phép ai đó thực hiện hành vi. Thể thường là 〜てもいい.',
    questions: [
      {
        id: 'n5-u1-g1-q1',
        type: 'grammar-to-meaning',
        sentenceJa: 'ここで写真を撮ってもいいですか。',
        sentenceVi: 'Tôi chụp ảnh ở đây có được không?',
        targetGrammar: '〜てもいいですか',
        prompt: 'Chọn ý nghĩa chính xác của mẫu ngữ pháp trong câu trên:',
        options: [
          'Hỏi xin phép làm gì đó',
          'Cấm đoán không được làm',
          'Lời khuyên nên làm gì',
          'Kể về kinh nghiệm quá khứ'
        ],
        correctIndex: 0,
        explanation: '「〜てもいいですか」 là mẫu câu xin phép lịch sự: "Tôi làm... có được không?".'
      },
      {
        id: 'n5-u1-g1-q2',
        type: 'meaning-to-grammar',
        sentenceJa: '暑いですから、エアコンを【　？　】。',
        sentenceVi: 'Vì trời nóng nên bạn có thể bật máy điều hòa lên.',
        targetGrammar: 'つけてもいいです',
        prompt: 'Chọn dạng chia đúng để biểu thị sự cho phép (bật máy lạnh):',
        options: [
          'つけてもいいです',
          'つけてはいけません',
          'つけなければなりません',
          'つけたいです'
        ],
        correctIndex: 0,
        explanation: 'Cho phép đối phương làm gì dùng V-て + もいいです. Động từ つける ➔ つけてもいいです.'
      },
      {
        id: 'n5-u1-g1-q3',
        type: 'grammar-to-meaning',
        sentenceJa: 'この辞書を使ってもいいですか。ーーええ、どうぞ。',
        sentenceVi: 'Tôi dùng cuốn từ điển này có được không? -- Vâng, xin mời.',
        targetGrammar: '〜てもいいですか',
        prompt: 'Mục đích của câu hỏi trên là gì?',
        options: [
          'Hỏi mượn và xin phép sử dụng đồ vật',
          'Bắt buộc người khác phải dùng từ điển',
          'Từ chối cho mượn từ điển',
          'Khoe khoang cuốn từ điển mới mua'
        ],
        correctIndex: 0,
        explanation: 'Câu này dùng để hỏi xin phép sử dụng từ điển của người khác.'
      },
      {
        id: 'n5-u1-g1-q4',
        type: 'meaning-to-grammar',
        sentenceJa: 'もう遅いですから、家に【　？　】よ。',
        sentenceVi: 'Đã muộn rồi nên em có thể về nhà rồi đấy.',
        targetGrammar: '帰ってもいいです',
        prompt: 'Chọn dạng cho phép về nhà phù hợp:',
        options: [
          '帰ってもいいです',
          '帰ってはいけません',
          '帰るつもりです',
          '帰らないでください'
        ],
        correctIndex: 0,
        explanation: 'Cho phép người khác ra về dùng 帰る ➔ 帰って + もいいです.'
      },
      {
        id: 'n5-u1-g1-q5',
        type: 'meaning-to-grammar',
        sentenceJa: 'すみません、ここに座っても【　？　】。',
        sentenceVi: 'Xin lỗi, tôi ngồi ở đây có được không ạ?',
        targetGrammar: 'いいですか',
        prompt: 'Điền phần còn thiếu của mẫu câu xin phép:',
        options: [
          'いいですか',
          'いけませんか',
          'だめですか',
          'ほしいですか'
        ],
        correctIndex: 0,
        explanation: 'Cụm từ hoàn chỉnh xin phép lịch sự là: 座ってもいいですか.'
      }
    ]
  },
  {
    id: 'bunpou-n5-te-wa-ikemasen-basic',
    level: 'N5',
    unitId: 'grammar-n5-unit-01',
    title: '〜てはいけません (Cơ bản N5)',
    meaning: 'Không được làm gì (Cấm đoán cơ bản)',
    connection: 'V-て + はいけません',
    usageNotes: 'Diễn tả lời nhắc nhở cấm đoán các hành vi sai quy định trong lớp học, công viên.',
    questions: [
      {
        id: 'n5-u1-g2-q1',
        type: 'grammar-to-meaning',
        sentenceJa: '教室の中で走ってはいけません。',
        sentenceVi: 'Không được chạy nhảy trong lớp học.',
        targetGrammar: '〜てはいけません',
        prompt: 'Ý nghĩa của câu trên là gì?',
        options: [
          'Cấm chạy nhảy trong lớp học',
          'Nên chạy nhảy trong lớp học',
          'Được phép chạy nhảy trong lớp học',
          'Muốn chạy nhảy trong lớp học'
        ],
        correctIndex: 0,
        explanation: '「走ってはいけません」 mang ý cấm đoán không được chạy trong phòng học.'
      },
      {
        id: 'n5-u1-g2-q2',
        type: 'meaning-to-grammar',
        sentenceJa: '病院ですから、大声で【　？　】。',
        sentenceVi: 'Vì là bệnh viện nên không được nói lớn tiếng.',
        targetGrammar: '話してはいけません',
        prompt: 'Chọn câu cấm đoán nói chuyện to tiếng:',
        options: [
          '話してはいけません',
          '話してもいいです',
          '話しましょう',
          '話したいです'
        ],
        correctIndex: 0,
        explanation: 'Cấm nói lớn tiếng ở nơi công cộng dùng 話す ➔ 話してはいけません.'
      },
      {
        id: 'n5-u1-g2-q3',
        type: 'meaning-to-grammar',
        sentenceJa: '赤信号ですから、道を【　？　】。',
        sentenceVi: 'Vì đèn đỏ nên không được qua đường.',
        targetGrammar: '渡ってはいけません',
        prompt: 'Chọn dạng chia cấm qua đường của động từ 渡る:',
        options: [
          '渡ってはいけません',
          '渡ってもいいです',
          '渡らなければなりません',
          '渡りましょう'
        ],
        correctIndex: 0,
        explanation: '渡る (nhóm 1) chia thể Te là 渡って ➔ 渡ってはいけません (không được qua đường).'
      },
      {
        id: 'n5-u1-g2-q4',
        type: 'grammar-to-meaning',
        sentenceJa: '美術館の展示品に触ってはいけません。',
        sentenceVi: 'Không được chạm vào hiện vật trưng bày của bảo tàng mỹ thuật.',
        targetGrammar: '〜てはいけません',
        prompt: 'Nội quy trên yêu cầu điều gì?',
        options: [
          'Tuyệt đối không sờ chạm vào đồ vật trưng bày',
          'Khuyến khích du khách sờ chạm hiện vật',
          'Xin phép chạm vào đồ vật',
          'Hỏi giá hiện vật trưng bày'
        ],
        correctIndex: 0,
        explanation: '「触ってはいけません」 là quy định cấm sờ chạm vào hiện vật trong bảo tàng.'
      },
      {
        id: 'n5-u1-g2-q5',
        type: 'meaning-to-grammar',
        sentenceJa: 'ここでタバコを吸っては【　？　】。',
        sentenceVi: 'Không được hút thuốc lá ở đây.',
        targetGrammar: 'いけません',
        prompt: 'Điền phần còn lại của cấu trúc cấm đoán:',
        options: [
          'いけません',
          'いいです',
          'なります',
          'あります'
        ],
        correctIndex: 0,
        explanation: 'Mẫu cấm đoán chuẩn là 〜てはいけません.'
      }
    ]
  },

  // --- N4: BÀI 1 (Cấm đoán & Nghĩa vụ) ---
  {
    id: 'bunpou-n4-te-wa-ikemasen',
    level: 'N4',
    unitId: 'grammar-n4-unit-01',
    title: '〜てはいけません / 〜てはいけない',
    meaning: 'Không được làm gì (Cấm đoán nâng cao & Thể ngắn)',
    connection: 'V-て + はいけません / はいけない',
    usageNotes: 'Diễn tả sự cấm đoán mạnh mẽ trong nội quy, biển báo pháp luật hoặc lời dặn của bác sĩ.',
    questions: [
      {
        id: 'n4-u1-g1-q1',
        type: 'grammar-to-meaning',
        sentenceJa: '美術館の中で写真を撮ってはいけません。',
        sentenceVi: 'Không được chụp ảnh bên trong bảo tàng mỹ thuật.',
        targetGrammar: '〜てはいけません',
        prompt: 'Chọn ý nghĩa chính xác của mẫu ngữ pháp trong câu trên:',
        options: [
          'Không được làm gì đó (Cấm đoán)',
          'Nên làm gì đó (Lời khuyên)',
          'Có thể làm gì đó (Khả năng)',
          'Phải làm gì đó (Bắt buộc)'
        ],
        correctIndex: 0,
        explanation: '「〜てはいけません」 mang ý nghĩa cấm đoán "Không được làm...".'
      },
      {
        id: 'n4-u1-g1-q2',
        type: 'meaning-to-grammar',
        sentenceJa: 'テスト中ですから、隣の人と【　？　】。',
        sentenceVi: 'Vì đang kiểm tra nên không được nói chuyện với người bên cạnh.',
        targetGrammar: '話してはいけません',
        prompt: 'Chọn phương án cấm đoán phù hợp trong phòng thi:',
        options: [
          '話してはいけません',
          '話してもいいです',
          '話さなければなりません',
          '話したいです'
        ],
        correctIndex: 0,
        explanation: 'Quy chế thi cấm nói chuyện dùng 話す ➔ 話してはいけません.'
      },
      {
        id: 'n4-u1-g1-q3',
        type: 'meaning-to-grammar',
        sentenceJa: '病気ですから、お酒を【　？　】と医者に言われました。',
        sentenceVi: 'Bác sĩ bảo tôi rằng vì đang bị ốm nên không được uống rượu.',
        targetGrammar: '飲んではいけない',
        prompt: 'Chọn thể ngắn (thường) phù hợp đi với と言われました:',
        options: [
          '飲んではいけない',
          '飲んでもいい',
          '飲むべきだ',
          '飲まないで'
        ],
        correctIndex: 0,
        explanation: 'Thể thường của 「〜てはいけません」 là 「〜てはいけない」.'
      },
      {
        id: 'n4-u1-g1-q4',
        type: 'meaning-to-grammar',
        sentenceJa: '危ないですから、川で【　？　】。',
        sentenceVi: 'Vì nguy hiểm nên không được bơi ở khúc sông này.',
        targetGrammar: '泳いではいけません',
        prompt: 'Chọn dạng chia đúng của động từ 泳ぐ (bơi):',
        options: [
          '泳いではいけません',
          '泳いでもいいです',
          '泳がなければなりません',
          '泳ぎたいです'
        ],
        correctIndex: 0,
        explanation: '泳ぐ chia thể Te là 泳いで ➔ 泳いではいけません.'
      },
      {
        id: 'n4-u1-g1-q5',
        type: 'grammar-to-meaning',
        sentenceJa: '図書館の中では、大声で騒いではいけない。',
        sentenceVi: 'Trong thư viện không được làm ồn lớn tiếng.',
        targetGrammar: '〜てはいけない',
        prompt: 'Ý nghĩa của câu quy định trên là gì?',
        options: [
          'Quy định cấm làm ồn nơi công cộng',
          'Lời nhờ vả người khác giữ im lặng',
          'Mong muốn người khác nói to lên',
          'Khen ngợi thư viện yên tĩnh'
        ],
        correctIndex: 0,
        explanation: 'Cấm làm ồn (騒ぐ ➔ 騒いではいけない).'
      }
    ]
  },
  {
    id: 'bunpou-n4-nakereba-naranai',
    level: 'N4',
    unitId: 'grammar-n4-unit-01',
    title: '〜なければならない / 〜なければなりません',
    meaning: 'Phải làm gì đó (Bắt buộc / Bổn phận)',
    connection: 'V-ない (bỏ い) + ければならない',
    usageNotes: 'Diễn tả nghĩa vụ pháp luật hoặc hoàn cảnh bắt buộc không thể không làm.',
    questions: [
      {
        id: 'n4-u1-g2-q1',
        type: 'grammar-to-meaning',
        sentenceJa: '明日までにレポートを出さなければなりません。',
        sentenceVi: 'Tôi phải nộp báo cáo trước ngày mai.',
        targetGrammar: '〜なければなりません',
        prompt: 'Chọn ý nghĩa của mẫu câu trên:',
        options: [
          'Phải làm gì đó (Nghĩa vụ, bắt buộc)',
          'Không cần làm cũng được',
          'Có thể làm nếu có thời gian',
          'Không được phép làm'
        ],
        correctIndex: 0,
        explanation: '「〜なければなりません」 diễn tả bổn phận bắt buộc nộp báo cáo đúng hạn.'
      },
      {
        id: 'n4-u1-g2-q2',
        type: 'meaning-to-grammar',
        sentenceJa: '熱がありますから、今日は薬を【　？　】。',
        sentenceVi: 'Vì bị sốt nên hôm nay tôi phải uống thuốc.',
        targetGrammar: '飲まなければなりません',
        prompt: 'Chọn dạng chia chính xác cho động từ 飲む (uống):',
        options: [
          '飲まなければなりません',
          '飲まなくてもいいです',
          '飲んではいけません',
          '飲みたいです'
        ],
        correctIndex: 0,
        explanation: '飲む ➔ 飲まない ➔ 飲まなければなりません.'
      },
      {
        id: 'n4-u1-g2-q3',
        type: 'grammar-to-meaning',
        sentenceJa: '日本で車を運転するときは、免許証を持っていなければならない。',
        sentenceVi: 'Khi lái xe ở Nhật, bắt buộc phải mang theo bằng lái xe.',
        targetGrammar: '〜なければならない',
        prompt: 'Ý nghĩa của quy định giao thông trên là gì?',
        options: [
          'Quy định pháp luật bắt buộc tuân theo',
          'Lời khuyên cá nhân tùy ý chọn',
          'Có thể mang hoặc không mang',
          'Cấm mang bằng lái xe'
        ],
        correctIndex: 0,
        explanation: 'Bắt buộc tuân thủ quy định pháp luật giao thông.'
      },
      {
        id: 'n4-u1-g2-q4',
        type: 'meaning-to-grammar',
        sentenceJa: '図書館で借りた本は、来週までに【　？　】。',
        sentenceVi: 'Sách mượn ở thư viện thì phải trả lại trước tuần sau.',
        targetGrammar: '返さなければならない',
        prompt: 'Chọn dạng đúng của động từ 返す (trả lại):',
        options: [
          '返さなければならない',
          '返してもいい',
          '返してはいけない',
          '返したい'
        ],
        correctIndex: 0,
        explanation: '返す ➔ 返さない ➔ 返さなければならない.'
      },
      {
        id: 'n4-u1-g2-q5',
        type: 'meaning-to-grammar',
        sentenceJa: '飛行機の時間に間に合うように、早く【　？　】。',
        sentenceVi: 'Để kịp giờ chuyến bay, tôi phải thức dậy sớm.',
        targetGrammar: '起きなければならない',
        prompt: 'Chọn dạng chia đúng của động từ 起きる (nhóm 2):',
        options: [
          '起きなければならない',
          '起きてもいい',
          '起きてはいけない',
          '起きたほうがいい'
        ],
        correctIndex: 0,
        explanation: '起きる ➔ 起きない ➔ 起きなければならない.'
      }
    ]
  },

  // --- N4: BÀI 2 (Kinh nghiệm & Lời khuyên) ---
  {
    id: 'bunpou-n4-ta-koto-ga-aru',
    level: 'N4',
    unitId: 'grammar-n4-unit-02',
    title: '〜たことがある / 〜たことがありません',
    meaning: 'Đã từng / Chưa từng làm gì (Kinh nghiệm quá khứ)',
    connection: 'V-た + ことがある / ない',
    usageNotes: 'Diễn tả trải nghiệm từng trải qua trong quá khứ tính đến thời điểm nói.',
    questions: [
      {
        id: 'n4-u2-g1-q1',
        type: 'grammar-to-meaning',
        sentenceJa: '富士山に登ったことがありますか。',
        sentenceVi: 'Bạn đã từng leo núi Phú Sĩ bao giờ chưa?',
        targetGrammar: '〜たことがありますか',
        prompt: 'Mục đích của câu hỏi trên là gì?',
        options: [
          'Hỏi về kinh nghiệm đã từng leo núi trong quá khứ',
          'Rủ đối phương cùng đi leo núi',
          'Cấm leo núi Phú Sĩ',
          'Hỏi về kế hoạch leo núi ngày mai'
        ],
        correctIndex: 0,
        explanation: '「V-たことがありますか」 dùng để hỏi kinh nghiệm trong quá khứ.'
      },
      {
        id: 'n4-u2-g1-q2',
        type: 'meaning-to-grammar',
        sentenceJa: '私は一度も日本へ【　？　】。',
        sentenceVi: 'Tôi chưa từng đến Nhật Bản lần nào cả.',
        targetGrammar: '行ったことがありません',
        prompt: 'Chọn dạng phủ định diễn tả chưa từng trải nghiệm:',
        options: [
          '行ったことがありません',
          '行ったことがあります',
          '行かなければなりません',
          '行ってはいけません'
        ],
        correctIndex: 0,
        explanation: 'Chưa từng làm gì bao giờ dùng V-たことがありません.'
      },
      {
        id: 'n4-u2-g1-q3',
        type: 'meaning-to-grammar',
        sentenceJa: '納豆を【　？　】ことがありますか。',
        sentenceVi: 'Bạn đã từng ăn món Natto bao giờ chưa?',
        targetGrammar: '食べた',
        prompt: 'Chọn dạng thể Ta chính xác của động từ 食べる:',
        options: [
          '食べた',
          '食べて',
          '食べる',
          '食べない'
        ],
        correctIndex: 0,
        explanation: 'Cấu trúc kinh nghiệm yêu cầu động từ ở thể quá khứ Ta (食べた).'
      },
      {
        id: 'n4-u2-g1-q4',
        type: 'grammar-to-meaning',
        sentenceJa: '歌舞伎を見たことがあるけれど、内容が難しかったです。',
        sentenceVi: 'Tôi đã từng xem kịch Kabuki rồi nhưng nội dung rất khó hiểu.',
        targetGrammar: '〜たことがある',
        prompt: 'Ý nghĩa của câu trên là gì?',
        options: [
          'Người nói đã từng trải nghiệm xem kịch Kabuki trong quá khứ',
          'Người nói sắp đi xem kịch Kabuki lần đầu',
          'Người nói không thích xem kịch',
          'Người nói đang diễn kịch Kabuki'
        ],
        correctIndex: 0,
        explanation: 'Diễn tả trải nghiệm đã từng xem kịch Kabuki trong quá khứ.'
      },
      {
        id: 'n4-u2-g1-q5',
        type: 'meaning-to-grammar',
        sentenceJa: '馬に【　？　】ことがあります。',
        sentenceVi: 'Tôi đã từng cưỡi ngựa rồi.',
        targetGrammar: '乗った',
        prompt: 'Chọn thể Ta của động từ 乗る (nhóm 1):',
        options: [
          '乗った',
          '乗って',
          '乗る',
          '乗らない'
        ],
        correctIndex: 0,
        explanation: '乗る ➔ chia thể Ta là 乗った ➔ 乗ったことがあります.'
      }
    ]
  },
  {
    id: 'bunpou-n4-hou-ga-ii',
    level: 'N4',
    unitId: 'grammar-n4-unit-02',
    title: '〜ほうがいい / 〜ないほうがいい',
    meaning: 'Nên / Không nên làm gì (Lời khuyên)',
    connection: 'V-た + ほうがいい / V-ない + ほうがいい',
    usageNotes: 'Đưa ra lời khuyên cụ thể nên làm gì (thể Ta) hoặc không nên làm gì (thể Nai).',
    questions: [
      {
        id: 'n4-u2-g2-q1',
        type: 'grammar-to-meaning',
        sentenceJa: '風邪をひいたときは、温かいお風呂に入って早く寝たほうがいいです。',
        sentenceVi: 'Khi bị cảm thì nên tắm nước ấm và đi ngủ sớm.',
        targetGrammar: '〜たほうがいい',
        prompt: 'Mục đích câu nói trên là gì?',
        options: [
          'Đưa ra lời khuyên tốt nhất cho sức khỏe người ốm',
          'Bắt buộc người ốm phải đi ngủ',
          'Hỏi xin phép đi ngủ sớm',
          'Cấm không được đi tắm'
        ],
        correctIndex: 0,
        explanation: '「V-たほうがいい」 dùng để đưa ra lời khuyên có lợi cho đối phương.'
      },
      {
        id: 'n4-u2-g2-q2',
        type: 'meaning-to-grammar',
        sentenceJa: 'お腹が痛いですから、冷たい物は【　？　】。',
        sentenceVi: 'Vì đang bị đau bụng nên không nên ăn đồ lạnh.',
        targetGrammar: '食べないほうがいいです',
        prompt: 'Chọn dạng khuyên không nên làm gì:',
        options: [
          '食べないほうがいいです',
          '食べたほうがいいです',
          '食べてもいいです',
          '食べなければなりません'
        ],
        correctIndex: 0,
        explanation: 'Khuyên không nên làm gì dùng V-ない + ほうがいい (食べないほうがいいです).'
      },
      {
        id: 'n4-u2-g2-q3',
        type: 'meaning-to-grammar',
        sentenceJa: '雨が降りそうですから、傘を【　？　】。',
        sentenceVi: 'Trời sắp mưa nên bạn nên mang theo dù.',
        targetGrammar: '持って行ったほうがいいです',
        prompt: 'Chọn thể Ta khuyên nên mang theo dù:',
        options: [
          '持って行ったほうがいいです',
          '持って行かないほうがいいです',
          '持って行ってはいけません',
          '持って行ってもいいです'
        ],
        correctIndex: 0,
        explanation: 'Khuyên nên mang theo dùng V-たほうがいい (持って行ったほうがいいです).'
      },
      {
        id: 'n4-u2-g2-q4',
        type: 'meaning-to-grammar',
        sentenceJa: '夜遅く一人で歩かない【　？　】。',
        sentenceVi: 'Đêm muộn không nên đi bộ một mình.',
        targetGrammar: 'ほうがいいです',
        prompt: 'Điền phần còn lại của mẫu câu khuyên nhủ:',
        options: [
          'ほうがいいです',
          'ことができます',
          'いけません',
          'つもりです'
        ],
        correctIndex: 0,
        explanation: 'Cấu trúc khuyên không nên làm: V-ない + ほうがいいです.'
      },
      {
        id: 'n4-u2-g2-q5',
        type: 'grammar-to-meaning',
        sentenceJa: '疲れているときは、無理をしないほうがいいよ。',
        sentenceVi: 'Khi mệt mỏi thì không nên ráng sức quá mức nhé.',
        targetGrammar: '〜ないほうがいい',
        prompt: 'Ý nghĩa của câu trên là gì?',
        options: [
          'Lời khuyên bạn bè không nên quá sức',
          'Yêu cầu bắt buộc phải làm việc tiếp',
          'Cấm không được nghỉ ngơi',
          'Khen ngợi sự chăm chỉ'
        ],
        correctIndex: 0,
        explanation: 'Lời khuyên thân mật không nên làm việc quá sức khi cơ thể mệt mỏi.'
      }
    ]
  },

  // --- N3: BÀI 1 (Phán đoán & Phủ định chắc chắn) ---
  {
    id: 'bunpou-n3-wake-ga-nai',
    level: 'N3',
    unitId: 'grammar-n3-unit-01',
    title: '〜わけがない / 〜わけはない',
    meaning: 'Chắc chắn không... / Không đời nào...',
    connection: 'Thể thường (V/A-i/A-naな/Nの) + わけがない',
    usageNotes: 'Diễn tả sự phủ định mạnh mẽ dựa trên logic hoặc bằng chứng xác thực.',
    questions: [
      {
        id: 'n3-u1-g1-q1',
        type: 'grammar-to-meaning',
        sentenceJa: 'こんなに難しい問題、小学生に解けるわけがない。',
        sentenceVi: 'Câu hỏi khó thế này thì học sinh tiểu học không đời nào giải được.',
        targetGrammar: '〜わけがない',
        prompt: 'Ý nghĩa của mẫu câu trên là gì?',
        options: [
          'Tuyệt đối chắc chắn không có khả năng xảy ra',
          'Có thể giải được nếu cố gắng',
          'Nên giải câu hỏi này',
          'Hỏi xin phép giải câu hỏi'
        ],
        correctIndex: 0,
        explanation: '「〜わけがない」 là phủ định tuyệt đối: "Không đời nào / Chắc chắn không thể...".'
      },
      {
        id: 'n3-u1-g1-q2',
        type: 'meaning-to-grammar',
        sentenceJa: '彼は真面目ですから、嘘を【　？　】。',
        sentenceVi: 'Anh ấy rất đứng đắn nên không đời nào lại nói dối.',
        targetGrammar: 'つくわけがない',
        prompt: 'Chọn dạng kết hợp đúng với 嘘をつく:',
        options: [
          'つくわけがない',
          'ついてもいい',
          'つかなければならない',
          'ついたほうがいい'
        ],
        correctIndex: 0,
        explanation: 'Khẳng định người nghiêm túc không đời nào nói dối ➔ つくわけがない.'
      },
      {
        id: 'n3-u1-g1-q3',
        type: 'grammar-to-meaning',
        sentenceJa: 'あんなに練習したんだから、負けるわけがない！',
        sentenceVi: 'Đã luyện tập nhiều đến thế kia thì làm sao mà thua được!',
        targetGrammar: '〜わけがない',
        prompt: 'Thái độ của người nói trong câu trên là gì?',
        options: [
          'Tin tưởng tuyệt đối vào chiến thắng, không đời nào thua',
          'Lo lắng sẽ bị thua trận',
          'Khuyên nhủ đối thủ đầu hàng',
          'Thất vọng vì thất bại'
        ],
        correctIndex: 0,
        explanation: 'Dựa trên việc đã khổ luyện để khẳng định tuyệt đối không thể thua.'
      },
      {
        id: 'n3-u1-g1-q4',
        type: 'meaning-to-grammar',
        sentenceJa: '高級ブランドのバッグが100円の【　？　】。',
        sentenceVi: 'Túi hiệu cao cấp mà giá 100 yên thì làm sao có chuyện đó được!',
        targetGrammar: 'わけがないでしょう',
        prompt: 'Chọn mẫu phản bác điều hoàn toàn vô lý:',
        options: [
          'わけがないでしょう',
          'はずでしょう',
          'かもしれないでしょう',
          'でしょう'
        ],
        correctIndex: 0,
        explanation: 'Phản bác điều phi lý: Danh từ + の + わけがない.'
      },
      {
        id: 'n3-u1-g1-q5',
        type: 'meaning-to-grammar',
        sentenceJa: '昨日あんなに食べたのに、お腹が【　？　】。',
        sentenceVi: 'Hôm qua ăn nhiều đến thế kia thì làm sao mà đói bụng được.',
        targetGrammar: 'すくわけがない',
        prompt: 'Chọn dạng đúng của お腹がすく (đói):',
        options: [
          'すくわけがない',
          'すいてもいい',
          'すかなければならない',
          'すいたほうがいい'
        ],
        correctIndex: 0,
        explanation: 'Thể thường V-ru + わけがない ➔ すくわけがない.'
      }
    ]
  },
  {
    id: 'bunpou-n3-ni-chigainai',
    level: 'N3',
    unitId: 'grammar-n3-unit-01',
    title: '〜に違いない / 〜に相違ない',
    meaning: 'Chắc chắn là... / Nhất định là...',
    connection: 'Thể thường (bỏ だ) + に違いない',
    usageNotes: 'Diễn tả sự phán đoán với độ tin cậy rất cao của người nói dựa trên trực giác hoặc bằng chứng.',
    questions: [
      {
        id: 'n3-u1-g2-q1',
        type: 'grammar-to-meaning',
        sentenceJa: '電気が消えていますから、彼はもう寝たに違いない。',
        sentenceVi: 'Đèn đã tắt rồi nên chắc chắn anh ấy đã ngủ rồi.',
        targetGrammar: '〜に違いない',
        prompt: 'Ý nghĩa của câu phán đoán trên là gì?',
        options: [
          'Phán đoán chắc chắn dựa trên bằng chứng (đèn đã tắt)',
          'Hỏi xin phép đối phương đi ngủ',
          'Khuyên đối phương nên đi ngủ',
          'Cấm không được bật đèn'
        ],
        correctIndex: 0,
        explanation: '「〜に違いない」 dùng để phán đoán chắc chắn: "Chắc chắn là...".'
      },
      {
        id: 'n3-u1-g2-q2',
        type: 'meaning-to-grammar',
        sentenceJa: '夜遅くまで勉強していたから、今日は【　？　】。',
        sentenceVi: 'Học đến tận khuya nên hôm nay chắc chắn là cậu ấy mệt rồi.',
        targetGrammar: '疲れているに違いない',
        prompt: 'Chọn phán đoán chắc chắn đang mệt:',
        options: [
          '疲れているに違いない',
          '疲れてはいけない',
          '疲れてもいい',
          '疲れたほうがいい'
        ],
        correctIndex: 0,
        explanation: 'Phán đoán chắc chắn: V-ている + に違いない.'
      },
      {
        id: 'n3-u1-g2-q3',
        type: 'meaning-to-grammar',
        sentenceJa: 'こんなに美味しいケーキ、有名なお店のものに【　？　】。',
        sentenceVi: 'Bánh ngon thế này thì chắc chắn là đồ của cửa tiệm nổi tiếng rồi.',
        targetGrammar: '違いない',
        prompt: 'Điền phần còn lại của mẫu phán đoán chắc chắn:',
        options: [
          '違いない',
          'いけない',
          'ならない',
          'かまわない'
        ],
        correctIndex: 0,
        explanation: 'Mẫu câu chuẩn là 〜に違いない.'
      },
      {
        id: 'n3-u1-g2-q4',
        type: 'grammar-to-meaning',
        sentenceJa: '鍵が閉まっているから、留守に違いない。',
        sentenceVi: 'Cửa đang khóa nên chắc chắn là họ vắng nhà rồi.',
        targetGrammar: '〜に違いない',
        prompt: 'Mục đích của câu nói trên là gì?',
        options: [
          'Đưa ra phán đoán chắc chắn họ đi vắng',
          'Hỏi mượn chìa khóa',
          'Nhờ người khác khóa cửa',
          'Cấm vào nhà'
        ],
        correctIndex: 0,
        explanation: 'Dựa trên việc cửa khóa để phán đoán chắc chắn đối phương đi vắng.'
      },
      {
        id: 'n3-u1-g2-q5',
        type: 'meaning-to-grammar',
        sentenceJa: '犯人はあの男に【　？　】。',
        sentenceVi: 'Thủ phạm chắc chắn là người đàn ông đó.',
        targetGrammar: '違いない',
        prompt: 'Điền dạng phán đoán chắc nịch của cảnh sát:',
        options: [
          '違いない',
          'いいです',
          'なりません',
          'ありません'
        ],
        correctIndex: 0,
        explanation: 'Danh từ + に違いない ➔ あの男に違いない.'
      }
    ]
  }
];

// 2. Định nghĩa cấu trúc Bài học (Units) theo Cấp độ (Levels)
const grammarUnits = [
  {
    id: 'grammar-n5-unit-01',
    level: 'N5',
    title: 'Bài 1',
    fullName: 'Bài 1: Mẫu câu Xin phép & Cấm đoán cơ bản',
    order: 1,
    grammarIds: [
      'bunpou-n5-te-mo-ii-desu',
      'bunpou-n5-te-wa-ikemasen-basic'
    ]
  },
  {
    id: 'grammar-n4-unit-01',
    level: 'N4',
    title: 'Bài 1',
    fullName: 'Bài 1: Mẫu câu Cấm đoán & Bổn phận/Nghĩa vụ',
    order: 1,
    grammarIds: [
      'bunpou-n4-te-wa-ikemasen',
      'bunpou-n4-nakereba-naranai'
    ]
  },
  {
    id: 'grammar-n4-unit-02',
    level: 'N4',
    title: 'Bài 2',
    fullName: 'Bài 2: Mẫu câu Kinh nghiệm & Lời khuyên',
    order: 2,
    grammarIds: [
      'bunpou-n4-ta-koto-ga-aru',
      'bunpou-n4-hou-ga-ii'
    ]
  },
  {
    id: 'grammar-n3-unit-01',
    level: 'N3',
    title: 'Bài 1',
    fullName: 'Bài 1: Mẫu câu Phán đoán & Phủ định chắc chắn',
    order: 1,
    grammarIds: [
      'bunpou-n3-wake-ga-nai',
      'bunpou-n3-ni-chigainai'
    ]
  }
];

// Ghi từng file json chi tiết cho từng mẫu ngữ pháp
grammarItems.forEach(item => {
  const itemFile = path.join(grammarDir, `${item.id}.json`);
  fs.writeFileSync(itemFile, JSON.stringify(item, null, 2), 'utf8');
});

// Ghi grammar-manifest.json chuẩn phân cấp Trình độ ➔ Bài 1, Bài 2 ➔ Mẫu ngữ pháp
const manifest = {
  totalGrammar: grammarItems.length,
  totalUnits: grammarUnits.length,
  levels: [
    {
      level: 'N5',
      title: 'JLPT N5',
      units: grammarUnits.filter(u => u.level === 'N5')
    },
    {
      level: 'N4',
      title: 'JLPT N4',
      units: grammarUnits.filter(u => u.level === 'N4')
    },
    {
      level: 'N3',
      title: 'JLPT N3',
      units: grammarUnits.filter(u => u.level === 'N3')
    }
  ],
  units: grammarUnits,
  items: grammarItems.map(item => ({
    id: item.id,
    level: item.level,
    unitId: item.unitId,
    title: item.title,
    meaning: item.meaning,
    connection: item.connection,
    usageNotes: item.usageNotes,
    questionsCount: item.questions.length
  }))
};

fs.writeFileSync(path.join(grammarDir, 'grammar-manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
console.log(`✅ Đã tạo thành công ${grammarItems.length} mẫu ngữ pháp và ${grammarUnits.length} bài học chuẩn cấp độ tại ${grammarDir}`);

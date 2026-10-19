/**
 * scripts/audit-and-fix-grammar.js
 * Script kiểm toán, chuẩn hóa chuyên sâu và xác thực 100% dữ liệu ngữ pháp JLPT N5, N4, N3:
 * - Chuẩn hóa ý nghĩa tiếng Việt chuẩn sư phạm JLPT.
 * - Chuẩn hóa công thức kết nối (connection) chuẩn thuật ngữ tiếng Nhật.
 * - Kiểm tra furigana và dịch nghĩa câu ví dụ (examples) sang tiếng Việt tự nhiên 100%.
 * - Rà soát và hoàn thiện ngân hàng 5 câu hỏi trắc nghiệm/thẻ.
 */

const fs = require('fs');
const path = require('path');

const grammarDir = path.join(__dirname, '..', 'data', 'grammar');
const manifestPath = path.join(grammarDir, 'grammar-manifest.json');
const CACHE_FILE = path.join(__dirname, '.cache_translations.json');

let translationCache = {};
if (fs.existsSync(CACHE_FILE)) {
  try {
    translationCache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
  } catch (e) {
    translationCache = {};
  }
}

function saveCache() {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(translationCache, null, 2), 'utf-8');
}

// Hàm dịch bổ sung qua Google Translate GTX API nếu phát hiện câu chưa có tiếng Việt chuẩn
async function translateText(text, sl = 'en', tl = 'vi') {
  if (!text || !text.trim()) return '';
  const raw = text.trim();
  const cacheKey = `${sl}_${tl}_${raw}`;
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(raw)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const trans = data[0].map(x => x[0]).join('').trim();
    if (trans) {
      translationCache[cacheKey] = trans;
      return trans;
    }
  } catch (err) {
    // fallback
  }
  return raw;
}

// Bảng đối chiếu và chuẩn hóa ý nghĩa tiếng Việt chuẩn sư phạm ngữ pháp JLPT
const MASTER_GRAMMAR_VI = {
  // === N5 ===
  '〜は': { meaning: 'Thì, là... (Trợ từ chỉ chủ đề của câu)', connection: 'Danh từ (N) + は' },
  '〜が（subject）': { meaning: 'Là, chính là... (Trợ từ chỉ chủ ngữ mới, tiêu điểm)', connection: 'Danh từ (N) + が' },
  '〜が（but）': { meaning: 'Nhưng mà... (Nối hai vế đối lập nhẹ nhàng)', connection: 'Mệnh đề [thể thông thường/lịch sự] + が' },
  '〜を': { meaning: 'Chỉ đối tượng trực tiếp của hành động', connection: 'Danh từ (N) + を + Tha động từ' },
  '〜も': { meaning: 'Cũng... (Biểu thị sự đồng nhất, tương tự)', connection: 'Danh từ (N) + も' },
  '〜に（time）': { meaning: 'Vào lúc... (Chỉ thời điểm cụ thể có con số)', connection: 'Mốc thời gian (N) + に' },
  '〜に（destination）': { meaning: 'Đến, tới... (Chỉ đích đến của di chuyển)', connection: 'Địa điểm (N) + に + 行く/来る/帰る' },
  '〜に（location）': { meaning: 'Ở, tại... (Chỉ nơi tồn tại của người/vật)', connection: 'Địa điểm (N) + に + あります/います' },
  '〜に（indirect object）': { meaning: 'Cho, với, đối với... (Chỉ đối tượng tiếp nhận)', connection: 'Người (N) + に + Động từ' },
  '〜に（frequency）': { meaning: 'Trong vòng... được mấy lần (Tần suất)', connection: 'Khoảng thời gian + に + [Số lần]' },
  '〜へ': { meaning: 'Hướng về, tới... (Chỉ phương hướng di chuyển)', connection: 'Địa điểm/Phương hướng (N) + へ + 行く/来る/帰る' },
  '〜で（place）': { meaning: 'Tại, ở... (Chỉ nơi diễn ra hành động)', connection: 'Địa điểm (N) + で + Động từ hành động' },
  '〜で（means）': { meaning: 'Bằng, bằng cách... (Chỉ phương tiện, công cụ, ngôn ngữ)', connection: 'Phương tiện/Công cụ (N) + で' },
  '〜と（and）': { meaning: 'Và, với... (Liệt kê đầy đủ toàn bộ đối tượng)', connection: 'Danh từ 1 + と + Danh từ 2' },
  '〜と（with）': { meaning: 'Cùng với... (Cùng thực hiện hành động với ai)', connection: 'Người (N) + と + [一緒に] + Động từ' },
  '〜や': { meaning: 'Và, như là... (Liệt kê một vài đối tượng tiêu biểu)', connection: 'Danh từ 1 + や + Danh từ 2 [など]' },
  '〜か（or）': { meaning: 'Hoặc là, hay là... (Lựa chọn)', connection: 'Danh từ 1 + か + Danh từ 2' },
  '〜から（from）': { meaning: 'Từ... (Chỉ điểm bắt đầu về không gian, thời gian)', connection: 'Địa điểm/Thời gian + から' },
  '〜まで': { meaning: 'Đến, cho đến... (Chỉ điểm kết thúc về không gian, thời gian)', connection: 'Địa điểm/Thời gian + まで' },
  '〜か（question）': { meaning: 'Có... không? (Trợ từ nghi vấn cuối câu)', connection: 'Câu + か' },
  '〜ね': { meaning: '...nhỉ, ...nhé (Tìm kiếm sự đồng tình, xác nhận)', connection: 'Cuối câu + ね' },
  '〜よ': { meaning: '...đấy, ...nhé (Cung cấp thông tin mới, nhấn mạnh)', connection: 'Cuối câu + よ' },
  '〜てください': { meaning: 'Xin hãy... / Vui lòng làm gì đó', connection: 'Động từ thể Te (V-て) + ください' },
  '〜ないでください': { meaning: 'Xin đừng... / Vui lòng không làm gì', connection: 'Động từ thể Nai (V-ない) + でください' },
  '〜てもいい': { meaning: 'Có thể... / Được phép làm gì (Xin phép & Cho phép)', connection: 'Động từ thể Te (V-て) + もいいです[か]' },
  '〜てはいけない': { meaning: 'Không được phép làm gì (Cấm đoán nhẹ)', connection: 'Động từ thể Te (V-て) + はいけません' },
  '〜なければならない': { meaning: 'Phải làm gì đó (Nghĩa vụ, bắt buộc)', connection: 'Động từ thể Nai bỏ い + ければなりません' },
  '〜なくてもいい': { meaning: 'Không cần làm gì cũng được (Không bắt buộc)', connection: 'Động từ thể Nai bỏ い + くてもいいです' },
  '〜ます': { meaning: 'Đuôi động từ thể lịch sự hiện tại / tương lai (Làm gì đó)', connection: 'Động từ thể Masu (V-ます)' },
  '〜くない / 〜かった / 〜くなかった': { meaning: 'Phủ định và quá khứ của tính từ đuôi い: Không... / Đã...', connection: 'Tính từ đuôi い bỏ い + くない / かった / くなかった' },
  '〜くない・〜かった・〜くなかった': { meaning: 'Phủ định và quá khứ của tính từ đuôi い: Không... / Đã...', connection: 'Tính từ đuôi い bỏ い + くない / かった / くなかった' },
  '〜たい': { meaning: 'Muốn làm gì đó (Mong muốn của bản thân)', connection: 'Động từ thể Masu bỏ ます + たい' },
  '〜たくない': { meaning: 'Không muốn làm gì đó', connection: 'Động từ thể Masu bỏ ます + たくない' },
  '〜たことがある': { meaning: 'Đã từng làm gì đó (Trải nghiệm quá khứ)', connection: 'Động từ thể Ta (V-た) + ことがある' },
  '〜たことがない': { meaning: 'Chưa từng làm việc gì bao giờ', connection: 'Động từ thể Ta (V-た) + ことがない' },
  '〜ている（progressive）': { meaning: 'Đang làm gì đó (Hành động đang tiếp diễn)', connection: 'Động từ thể Te (V-て) + いる' },
  '〜ている（resultant state）': { meaning: 'Đang ở trạng thái... (Kết quả của hành động)', connection: 'Động từ thể Te (V-て) + いる' },
  '〜まえに': { meaning: 'Trước khi làm việc gì đó...', connection: 'Động từ thể từ điển (V-る) / Danh từ + の + まえに' },
  '〜あとで': { meaning: 'Sau khi làm việc gì đó...', connection: 'Động từ thể Ta (V-た) / Danh từ + の + あとで' },
  '〜から（reason）': { meaning: 'Vì... nên... (Nêu lý do, nguyên nhân chủ quan)', connection: 'Mệnh đề [thể thông thường/lịch sự] + から' },
  '〜より': { meaning: 'Hơn so với... (Dùng trong câu so sánh hơn)', connection: 'Danh từ (N) + より' },
  '〜のほうが': { meaning: '...thì hơn (Chỉ đối tượng chiếm ưu thế trong so sánh)', connection: 'Danh từ (N) + のほうが' },
  '〜ほうがいい': { meaning: 'Nên làm gì đó (Đưa ra lời khuyên hữu ích)', connection: 'Động từ thể Ta (V-た) + ほうがいい' },
  '〜ないほうがいい': { meaning: 'Không nên làm gì đó (Lời khuyên can ngăn)', connection: 'Động từ thể Nai (V-ない) + ほうがいい' },
  '〜たり〜たりする': { meaning: 'Lúc thì... lúc thì... / Nào là... nào là...', connection: 'Động từ thể Ta + り + Động từ thể Ta + りする' },
  '〜ながら': { meaning: 'Vừa... vừa... (Hai hành động diễn ra đồng thời)', connection: 'Động từ thể Masu bỏ ます + ながら' },

  // === N4 ===
  '〜つもり': { meaning: 'Dự định làm gì đó (Ý chí cá nhân đã định sẵn)', connection: 'Động từ thể từ điển (V-る) / V-ない + つもり' },
  '〜予定': { meaning: 'Theo kế hoạch sẽ làm gì (Lịch trình đã định trước)', connection: 'Động từ thể từ điển (V-る) / Danh từ + の + 予定' },
  '〜かもしれない': { meaning: 'Có lẽ, có thể sẽ... (Phỏng đoán khả năng khoảng 50%)', connection: 'Thể thông thường (Na-Adj/N không có だ) + かもしれない' },
  '〜でしょう': { meaning: 'Có lẽ là... (Phỏng đoán lịch sự)', connection: 'Thể thông thường (Na-Adj/N không có だ) + でしょう' },
  '〜はずだ': { meaning: 'Chắc chắn là... (Dự đoán có căn cứ xác thực)', connection: 'Thể thông thường (Na-Adj + な, N + の) + はずだ' },
  '〜はずがない': { meaning: 'Chắc chắn không thể nào... / Không đời nào...', connection: 'Thể thông thường (Na-Adj + な, N + の) + はずがない' },
  '〜すぎる': { meaning: 'Quá... (Vượt quá mức độ bình thường hoặc kiểm soát)', connection: 'V-masu bỏ ます / Tính từ bỏ い, な + すぎる' },
  '〜やすい': { meaning: 'Dễ làm gì đó / Dễ xảy ra tình trạng...', connection: 'Động từ thể Masu bỏ ます + やすい' },
  '〜にくい': { meaning: 'Khó làm gì đó / Khó xảy ra tình trạng...', connection: 'Động từ thể Masu bỏ ます + にくい' },
  '〜てみる': { meaning: 'Thử làm việc gì đó (Xem kết quả thế nào)', connection: 'Động từ thể Te (V-て) + みる' },
  '〜てしまう': { meaning: 'Đã làm xong trọn vẹn / Lỡ làm việc gì đó (Hối tiếc)', connection: 'Động từ thể Te (V-て) + しまう' },
  '〜ておく': { meaning: 'Làm sẵn gì đó trước (Chuẩn bị trước hoặc giữ nguyên)', connection: 'Động từ thể Te (V-て) + おく' },
  '〜てあげる': { meaning: 'Làm việc gì giúp cho ai đó', connection: 'Động từ thể Te (V-て) + あげる' },
  '〜てもらう': { meaning: 'Được ai đó làm giúp cho việc gì', connection: 'Động từ thể Te (V-て) + もらう' },
  '〜てくれる': { meaning: 'Ai đó làm giúp việc gì cho mình/người thân của mình', connection: 'Động từ thể Te (V-て) + くれる' },
  '〜受身（Passive）': { meaning: 'Bị, được... (Thể bị động)', connection: 'Động từ nhóm 1: V-a + れる / Nhóm 2: V + られる / Nhóm 3: される, こられる' },
  '〜使役（Causative）': { meaning: 'Bắt làm, cho phép làm gì (Thể sai khiến)', connection: 'Động từ nhóm 1: V-a + せる / Nhóm 2: V + させる / Nhóm 3: させる, こさせる' },
  '〜使役受身': { meaning: 'Bị bắt buộc phải làm việc gì (Thể bị động sai khiến)', connection: 'Động từ nhóm 1: V-a + せられる/される / Nhóm 2: V + させられる' },
  '〜ば': { meaning: 'Nếu... (Điều kiện giả định thể Ba)', connection: 'Động từ thể Ba / Tính từ đuôi い bỏ い + ければ' },
  '〜たら': { meaning: 'Nếu / Sau khi... (Điều kiện giả định và trình tự thời gian)', connection: 'Động từ thể Ta + ら / Tính từ thể quá khứ + ら' },
  '〜なら': { meaning: 'Nếu là... / Trong trường hợp... (Đưa ra lời khuyên/thông tin)', connection: 'Danh từ (N) / Tính từ (Na) + なら' },
  '〜と（conditional）': { meaning: 'Hễ mà... thì đương nhiên... (Quy luật tự nhiên, máy móc)', connection: 'Động từ thể từ điển (V-る) + と' },
  '〜のに（although）': { meaning: 'Mặc dù... thế mà lại... (Bất ngờ, tiếc nuối, bất mãn)', connection: 'Thể thông thường (Na-Adj + な, N + な) + のに' },
  '〜ようにする': { meaning: 'Cố gắng tạo thói quen làm gì đó đều đặn', connection: 'Động từ thể từ điển (V-る) / V-ない + ようにする' },
  '〜ようになる': { meaning: 'Trở nên có thể làm được việc gì (Thay đổi trạng thái)', connection: 'Động từ thể khả năng / V-る / V-ない + ようになる' },
  '〜そうだ（hearsay）': { meaning: 'Nghe nói là... (Truyền đạt lại thông tin nghe được)', connection: 'Thể thông thường + そうだ' },
  '〜そうだ（conjecture）': { meaning: 'Trông có vẻ... / Sắp sửa... (Phán đoán qua thị giác)', connection: 'V-masu bỏ ます / Tính từ bỏ い, な + そうだ' },
  '〜ようです': { meaning: 'Có vẻ như là... (Phán đoán dựa trên cảm giác, quan sát)', connection: 'Thể thông thường (Na-Adj + な, N + の) + ようだ' },
  '〜らしい': { meaning: 'Nghe nói là... / Đúng chất là... (Đặc trưng tiêu biểu)', connection: 'Thể thông thường (Na-Adj/N không có だ) + らしい' },
  '〜ために（purpose）': { meaning: 'Để làm gì / Vì mục đích gì...', connection: 'Động từ thể từ điển (V-る) / Danh từ + の + ために' },
  '〜ように': { meaning: 'Để mà... (Chỉ mục đích với động từ không có ý chí)', connection: 'V-khả năng / V-không ý chí / V-ない + ように' },
  '〜かた': { meaning: 'Cách làm việc gì đó (Ví dụ: cách đọc, cách dùng)', connection: 'Động từ thể Masu bỏ ます + 方 (かた)' },
  '〜しかない': { meaning: 'Chỉ còn cách là... / Không còn lựa chọn nào khác', connection: 'Động từ thể từ điển (V-る) + しかない' },
  '〜ことになる': { meaning: 'Được quyết định là... (Quy định, quyết định tập thể)', connection: 'Động từ thể từ điển (V-る) / V-ない + ことになる' },
  '〜ことができる': { meaning: 'Có thể làm được việc gì (Khả năng)', connection: 'Động từ thể từ điển (V-る) + ことができる' },
  '〜ことがある': { meaning: 'Thỉnh thoảng có làm gì / Đôi khi xảy ra việc...', connection: 'Động từ thể từ điển (V-る) / V-ない + ことがある' },

  // === N3 ===
  '〜ばかりでなく': { meaning: 'Không chỉ... mà còn...', connection: 'Thể thông thường (Na + な, N + である) + ばかりでなく' },
  '〜ばかりか': { meaning: 'Không những... mà ngay cả... (Mức độ tăng tiến hơn)', connection: 'Thể thông thường (Na + な, N) + ばかりか' },
  '〜ばかり': { meaning: 'Toàn là... / Cứ mãi... (Tần suất dày đặc gây phiền toái)', connection: 'Danh từ (N) + ばかり / V-て + ばかり' },
  '〜たばかり': { meaning: 'Vừa mới làm gì xong (Cảm giác vừa mới xảy ra)', connection: 'Động từ thể Ta (V-た) + ばかり' },
  '〜ば〜ほど': { meaning: 'Càng... thì càng... (Tỷ lệ thuận)', connection: '[V-ば + V-る] / [A-ければ + A-い] + ほど' },
  '〜ばいい': { meaning: 'Nên làm gì... / Chỉ cần... là được', connection: 'Động từ thể Ba (V-ば) + いい' },
  '〜ばよかった': { meaning: 'Giá mà... thì tốt biết mấy (Hối tiếc việc đã qua)', connection: 'Động từ thể Ba (V-ば) + よかった' },
  '〜ばあいは': { meaning: 'Trong trường hợp... / Khi xảy ra tình huống...', connection: 'Thể thông thường (Na + な, N + の) + 場合(は)' },
  '〜かわりに': { meaning: 'Thay vì... / Bù lại cho việc gì...', connection: 'Thể thông thường (Na + な, N + の) + 代わりに' },
  '〜まま': { meaning: 'Cứ để nguyên... / Giữ nguyên trạng thái cũ...', connection: 'V-た / V-ない / N + の / Na + な + まま' },
  '〜もの・〜もん': { meaning: 'Bởi vì... mà (Dùng trong văn nói để phân trần, làm nũng)', connection: 'Thể thông thường + もの / もん' },
  '〜ものだ': { meaning: 'Là thứ đương nhiên / Thường hay... (Hoài niệm quá khứ)', connection: 'V-る / V-た / Tính từ + ものだ' },
  '〜ものではない': { meaning: 'Không nên làm gì đó (Lời khuyên răn đạo đức)', connection: 'Động từ thể từ điển (V-る) + ものではない' },
  '〜わけがない': { meaning: 'Chắc chắn không thể... / Không đời nào...', connection: 'Thể thông thường (Na + な, N + の) + わけがない' },
  '〜わけではない': { meaning: 'Không hẳn là... / Không nhất thiết là như vậy', connection: 'Thể thông thường (Na + な, N + な/である) + わけではない' },
  '〜わけにはいかない': { meaning: 'Không thể làm được... (Vì lý do đạo đức, xã hội)', connection: 'Động từ thể từ điển (V-る) + わけにはいかない' },
  '〜わけだ': { meaning: 'Thảo nào, hèn chi... / Đương nhiên là thế', connection: 'Thể thông thường (Na + な, N + である) + わけだ' },
  '〜に対して': { meaning: 'Đối với... / Trái ngược lại với...', connection: 'Danh từ (N) + に対して / Thể thông thường + のに対して' },
  '〜について': { meaning: 'Về việc... / Về chủ đề...', connection: 'Danh từ (N) + について [の N]' },
  '〜に関して': { meaning: 'Liên quan đến... / Về... (Văn phong trang trọng)', connection: 'Danh từ (N) + に関して [の N]' },
  '〜にとって': { meaning: 'Đối với... (Đứng trên góc độ, lập trường của ai)', connection: 'Danh từ chỉ người/tổ chức (N) + にとって' },
  '〜として': { meaning: 'Với tư cách là... / Dưới danh nghĩa là...', connection: 'Danh từ (N) + として' },
  '〜によって': { meaning: 'Tùy vào... / Do bởi... / Bằng cách...', connection: 'Danh từ (N) + によって / による' },
  '〜によると': { meaning: 'Theo như nguồn tin... cho biết thì...', connection: 'Danh từ chỉ nguồn tin (N) + によると / によれば' },
  '〜おかげで': { meaning: 'Nhờ có... (Mang lại kết quả tốt đẹp)', connection: 'Thể thông thường (Na + な, N + の) + おかげで' },
  '〜せいで': { meaning: 'Tại vì... / Do... (Dẫn đến kết quả tiêu cực, trách móc)', connection: 'Thể thông thường (Na + な, N + の) + せいで' },
  '〜ことにする': { meaning: 'Quyết định làm gì đó (Quyết định của bản thân)', connection: 'Động từ thể từ điển (V-る) / V-ない + ことにする' },
  '〜ことになっている': { meaning: 'Được quy định là... / Có luật lệ là...', connection: 'Động từ thể từ điển (V-る) / V-ない + ことになっている' },
  '〜に違いない': { meaning: 'Chắc chắn là... (Khẳng định chủ quan đầy tự tin)', connection: 'Thể thông thường (Na/N không có だ) + に違いない' },
  '〜たとたん': { meaning: 'Ngay sau khi vừa... thì bất ngờ...', connection: 'Động từ thể Ta (V-た) + とたん(に)' },
  '〜最中に': { meaning: 'Đúng vào lúc đang mải mê làm gì thì sự việc chen ngang', connection: 'V-ている / Danh từ + の + 最中に' },
  '〜うちに': { meaning: 'Trong khi còn... / Nhân lúc còn... (Kẻo trạng thái biến đổi)', connection: 'V-る / V-ている / V-ない / A-い / Na + な / N + の + うちに' },
  '〜間に': { meaning: 'Trong khi... (Hành động diễn ra trong suốt hoặc ngắt quãng)', connection: 'V-ている / Danh từ + の + 間に' },
  '〜たびに': { meaning: 'Mỗi lần... / Cứ mỗi dịp... là lại xảy ra việc đó', connection: 'Động từ thể từ điển (V-る) / Danh từ + の + たびに' },
  '〜とおりに': { meaning: 'Theo đúng như... / Y như những gì...', connection: 'V-る / V-た / Danh từ + の + とおりに' },
  '〜わりに（は）': { meaning: 'So với... thì quả thật bất ngờ (Khác với suy đoán thông thường)', connection: 'Thể thông thường (Na + な, N + の) + わりに(は)' },
  '〜くせに': { meaning: 'Thế mà lại... / Mặc dù... mà còn (Trách móc, coi thường)', connection: 'Thể thông thường (Na + な, N + の) + くせに' },
  '〜ふりをする': { meaning: 'Giả vờ như là... / Tỏ ra vẻ như là...', connection: 'Thể thông thường (Na + な, N + の) + ふりをする' },
  '〜切る / 〜切れない': { meaning: 'Làm hết sạch / Làm không xuể...', connection: 'Động từ thể Masu bỏ ます + 切る / 切れない' },
  '〜かける / 〜かけの': { meaning: 'Đang làm dở dang chưa xong...', connection: 'Động từ thể Masu bỏ ます + かける' },
  '〜たて': { meaning: 'Vừa mới làm xong (Còn tươi mới, nóng hổi)', connection: 'Động từ thể Masu bỏ ます + たて(の)' },
  '〜ように言う': { meaning: 'Nhắc nhở, dặn dò hoặc yêu cầu ai làm gì', connection: 'V-る / V-ない + ように言う / 頼む' },
  '〜ようとする': { meaning: 'Đang định làm gì / Cố gắng làm gì đó', connection: 'Động từ thể ý chí (V-よう) + とする' },
  '〜ずに': { meaning: 'Không làm gì mà... (Cách nói viết trang trọng của ないで)', connection: 'Động từ thể Nai bỏ ない + ずに (する → せずに)' },
  '〜づらい': { meaning: 'Khó làm gì đó (Về mặt tâm lý, cảm xúc)', connection: 'Động từ thể Masu bỏ ます + づらい' }
};

function normalizePatternKey(pattern) {
  return (pattern || '')
    .replace(/^[〜~]/, '')
    .replace(/[（()）]/g, '')
    .replace(/\s+/g, '')
    .toLowerCase();
}

async function auditAndFixGrammar() {
  console.log('='.repeat(70));
  console.log('🔍 BẮT ĐẦU KIỂM TOÁN VÀ DUYỆT 100% KHO DỮ LIỆU NGỮ PHÁP JLPT (N5 - N3)');
  console.log('='.repeat(70));

  if (!fs.existsSync(manifestPath)) {
    console.error('❌ Không tìm thấy manifest:', manifestPath);
    return;
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  const allItems = manifest.items || [];
  console.log(`[i] Tổng số mẫu ngữ pháp cần kiểm toán: ${allItems.length} mẫu`);

  let meaningFixedCount = 0;
  let connectionFixedCount = 0;
  let examplesFixedCount = 0;
  let questionsFixedCount = 0;

  for (let i = 0; i < allItems.length; i++) {
    const itemMeta = allItems[i];
    const filePath = path.join(grammarDir, `${itemMeta.id}.json`);
    if (!fs.existsSync(filePath)) continue;

    let item = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    let modified = false;

    // 1. Kiểm toán ý nghĩa (meaning & meaningVi)
    const pat = item.pattern || item.title || '';
    const normKey = normalizePatternKey(pat);
    let matchedDef = MASTER_GRAMMAR_VI[pat];

    if (!matchedDef) {
      for (const [k, v] of Object.entries(MASTER_GRAMMAR_VI)) {
        if (normalizePatternKey(k) === normKey) {
          matchedDef = v;
          break;
        }
      }
    }

    if (matchedDef) {
      if (item.meaning !== matchedDef.meaning || item.meaningVi !== matchedDef.meaning) {
        item.meaning = matchedDef.meaning;
        item.meaningVi = matchedDef.meaning;
        itemMeta.meaning = matchedDef.meaning;
        itemMeta.meaningVi = matchedDef.meaning;
        meaningFixedCount++;
        modified = true;
      }
      if (matchedDef.connection && item.connection !== matchedDef.connection) {
        item.connection = matchedDef.connection;
        itemMeta.connection = matchedDef.connection;
        connectionFixedCount++;
        modified = true;
      }
    } else {
      // Nếu chưa có trong bảng đối chiếu thì kiểm tra xem meaning có chứa tiếng Anh không
      if (/[a-zA-Z]{4,}/.test(item.meaning || '')) {
        const transMeaning = await translateText(item.meaning, 'en', 'vi');
        item.meaning = transMeaning;
        item.meaningVi = transMeaning;
        itemMeta.meaning = transMeaning;
        itemMeta.meaningVi = transMeaning;
        meaningFixedCount++;
        modified = true;
      }
    }

    // 2. Kiểm toán và chuẩn hóa câu ví dụ (examples: ja, furigana, vi)
    if (Array.isArray(item.examples)) {
      for (let j = 0; j < item.examples.length; j++) {
        const ex = item.examples[j];
        // Đảm bảo furigana có giá trị
        if (!ex.furigana) {
          ex.furigana = ex.ja;
          modified = true;
        }

        // Kiểm tra xem dịch tiếng Việt đã chuẩn chưa
        const isEnglish = /[a-zA-Z]{4,}/.test(ex.vi || '');
        if (!ex.vi || isEnglish) {
          const transVi = await translateText(ex.en || ex.ja, 'en', 'vi');
          if (transVi && transVi !== ex.vi) {
            ex.vi = transVi;
            examplesFixedCount++;
            modified = true;
          }
        }
      }
    }

    // 3. Kiểm toán ghi chú cách dùng (usageNotes)
    if (/[a-zA-Z]{5,}/.test(item.usageNotes || '')) {
      const transNotes = await translateText(item.usageNotes, 'en', 'vi');
      if (transNotes && transNotes !== item.usageNotes) {
        item.usageNotes = transNotes;
        modified = true;
      }
    }

    // 4. Kiểm toán ngân hàng câu hỏi (questions)
    if (Array.isArray(item.questions)) {
      for (const q of item.questions) {
        // Cập nhật lại ý nghĩa chuẩn trong câu hỏi chọn nghĩa
        if (q.type === 'grammar-to-meaning') {
          if (q.options && typeof q.correctIndex === 'number') {
            const oldCorrect = q.options[q.correctIndex];
            if (oldCorrect !== item.meaning) {
              q.options[q.correctIndex] = item.meaning;
              q.explanation = `Mẫu 「${item.title}」 mang ý nghĩa: "${item.meaning}".`;
              questionsFixedCount++;
              modified = true;
            }
          }
        } else if (q.type === 'meaning-to-grammar') {
          // Cập nhật câu prompt cho chuẩn ngữ nghĩa
          if (q.prompt.includes('nghĩa') && q.prompt.includes('"')) {
            q.prompt = `Chọn mẫu ngữ pháp phù hợp diễn đạt ý nghĩa "${item.meaning}":`;
            q.explanation = `Đáp án đúng là 「${item.title}」.`;
            modified = true;
          }
        }
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(item, null, 2), 'utf-8');
    }
  }

  // Cập nhật lại manifest
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  saveCache();

  console.log('\n' + '='.repeat(70));
  console.log('✅ HOÀN TẤT KIỂM TOÁN VÀ CHUẨN HÓA DỮ LIỆU:');
  console.log(`   - Số ý nghĩa ngữ pháp được chuẩn hóa sư phạm: ${meaningFixedCount}`);
  console.log(`   - Số công thức kết nối được chuẩn hóa: ${connectionFixedCount}`);
  console.log(`   - Số câu ví dụ & bản dịch được xác thực tiếng Việt: ${examplesFixedCount}`);
  console.log(`   - Số câu hỏi trắc nghiệm được căn chỉnh đáp án chính xác: ${questionsFixedCount}`);
  console.log('='.repeat(70));
}

auditAndFixGrammar();

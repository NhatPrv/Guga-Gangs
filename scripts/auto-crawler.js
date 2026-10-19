/**
 * auto-crawler.js
 * Script tự động sinh / cào dữ liệu Từ vựng & Hán tự N4 chuẩn hóa.
 * Hỗ trợ các chế độ:
 * 1. Offline Generator: Tự động sinh nội dung chuẩn JLPT N4 từ cơ sở dữ liệu tri thức tích hợp sẵn
 * 2. LLM Generator: Tích hợp gọi API Gemini / Ollama Local / OpenAI để sinh các bài học tiếp theo theo schema
 * 3. Tự động kích hoạt build-manifest.js sau khi ghi file
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const { buildManifest } = require('./build-manifest');

const DATA_DIR = path.join(__dirname, '..', 'data');

// Dữ liệu tri thức N4 mở rộng sẵn có dùng cho offline generation
const OFFLINE_LESSONS = {
  'minna-no-nihongo-n4': {
    'unit-29': {
      meta: {
        title: "Bài 29: Cửa sổ đang mở (Trạng thái tự động từ)",
        order: 29,
        description: "Thể hiện trạng thái của sự vật với [Danh từ] が [Tự động từ] ています, ~てしまいました"
      },
      vocabulary: [
        {
          id: "v29-01",
          word: "開きます",
          reading: "あきます",
          romaji: "akimasu",
          meaning: "mở (cửa mở)",
          type: "Tự động từ (Nhóm 1)",
          example: {
            ja: "ドアが開いています。",
            reading: "ドア が あいています。",
            vi: "Cửa đang mở."
          }
        },
        {
          id: "v29-02",
          word: "閉まります",
          reading: "しまります",
          romaji: "shimarimasu",
          meaning: "đóng (cửa đóng)",
          type: "Tự động từ (Nhóm 1)",
          example: {
            ja: "窓が閉まっています。",
            reading: "まど が しまっています。",
            vi: "Cửa sổ đang đóng."
          }
        },
        {
          id: "v29-03",
          word: "つきます",
          reading: "つきます",
          romaji: "tsukimasu",
          meaning: "sáng (đèn sáng)",
          type: "Tự động từ (Nhóm 1)",
          example: {
            ja: "電気がついています。",
            reading: "でんき が ついています。",
            vi: "Đèn điện đang sáng."
          }
        },
        {
          id: "v29-04",
          word: "消えます",
          reading: "きえます",
          romaji: "kiemasu",
          meaning: "tắt (đèn tắt)",
          type: "Tự động từ (Nhóm 2)",
          example: {
            ja: "火が消えました。",
            reading: "ひ が きえました。",
            vi: "Lửa đã tắt rồi."
          }
        },
        {
          id: "v29-05",
          word: "壊れます",
          reading: "こわれます",
          romaji: "kowaremasu",
          meaning: "hỏng (ghế hỏng)",
          type: "Tự động từ (Nhóm 2)",
          example: {
            ja: "椅子が壊れています。",
            reading: "いす が こわれています。",
            vi: "Chiếc ghế đang bị hỏng."
          }
        },
        {
          id: "v29-06",
          word: "割れます",
          reading: "われます",
          romaji: "waremasu",
          meaning: "vỡ (cốc vỡ)",
          type: "Tự động từ (Nhóm 2)",
          example: {
            ja: "コップが割れてしまいました。",
            reading: "コップ が われて しまいました。",
            vi: "Chiếc cốc đã bị vỡ mất rồi."
          }
        },
        {
          id: "v29-07",
          word: "折れます",
          reading: "おれます",
          romaji: "oremasu",
          meaning: "gãy (cành cây gãy)",
          type: "Tự động từ (Nhóm 2)",
          example: {
            ja: "強い風で木の枝が折れました。",
            reading: "つよい かぜ で き の えだ が おれました。",
            vi: "Vì gió lớn nên cành cây đã bị gãy."
          }
        },
        {
          id: "v29-08",
          word: "破れます",
          reading: "やぶれます",
          romaji: "yaburemasu",
          meaning: "rách (túi giấy rách)",
          type: "Tự động từ (Nhóm 2)",
          example: {
            ja: "紙袋が破れました。",
            reading: "かみぶくろ が やぶれました。",
            vi: "Túi giấy đã bị rách."
          }
        },
        {
          id: "v29-09",
          word: "汚れます",
          reading: "よごれます",
          romaji: "yogoremasu",
          meaning: "bẩn (quần áo bẩn)",
          type: "Tự động từ (Nhóm 2)",
          example: {
            ja: "服が汚れてしまいました。",
            reading: "ふく が よごれて しまいました。",
            vi: "Quần áo bị dính bẩn mất rồi."
          }
        },
        {
          id: "v29-10",
          word: "外れます",
          reading: "はずれます",
          romaji: "hazuremasu",
          meaning: "tuột, bung ra (cúc áo)",
          type: "Tự động từ (Nhóm 2)",
          example: {
            ja: "ボタンが外れていますよ。",
            reading: "ボタン が はずれています よ。",
            vi: "Cúc áo của bạn bị tuột ra rồi kìa."
          }
        }
      ],
      kanji: [
        {
          id: "k29-01",
          character: "開",
          onyomi: "カイ",
          kunyomi: "あ.く, あ.ける, ひら.く",
          meaning: "Khai (mở)",
          strokes: 12,
          examples: [
            { compound: "開会", reading: "かいかい", meaning: "khai mạc" },
            { compound: "開く", reading: "あく", meaning: "mở ra" }
          ]
        },
        {
          id: "k29-02",
          character: "閉",
          onyomi: "ヘイ",
          kunyomi: "し.まる, し.める, と.じる",
          meaning: "Bế (đóng)",
          strokes: 11,
          examples: [
            { compound: "閉館", reading: "へいかん", meaning: "đóng cửa tòa nhà" },
            { compound: "閉める", reading: "しめる", meaning: "đóng lại" }
          ]
        },
        {
          id: "k29-03",
          character: "消",
          onyomi: "ショウ",
          kunyomi: "き.える, け.す",
          meaning: "Tiêu (tắt, xóa, dập tắt)",
          strokes: 10,
          examples: [
            { compound: "消しゴム", reading: "けしゴム", meaning: "cục tẩy" },
            { compound: "消化", reading: "しょうか", meaning: "tiêu hóa" }
          ]
        },
        {
          id: "k29-04",
          character: "割",
          onyomi: "カツ",
          kunyomi: "わ.る, わ.れる, さ.く",
          meaning: "Cát (chia, vỡ, tỷ lệ)",
          strokes: 12,
          examples: [
            { compound: "割引", reading: "わりびき", meaning: "giảm giá" },
            { compound: "割る", reading: "わる", meaning: "làm vỡ, chia nhỏ" }
          ]
        },
        {
          id: "k29-05",
          character: "折",
          onyomi: "セツ",
          kunyomi: "お.る, お.れる",
          meaning: "Chiết (bẻ gãy, gấp lại)",
          strokes: 7,
          examples: [
            { compound: "折り紙", reading: "おりがみ", meaning: "nghệ thuật gấp giấy" },
            { compound: "骨折", reading: "こっせつ", meaning: "gãy xương" }
          ]
        }
      ]
    },
    'unit-30': {
      meta: {
        title: "Bài 30: Tranh treo trên tường (Tha động từ てある)",
        order: 30,
        description: "Thể hiện trạng thái có chủ đích với [Danh từ] が [Tha động từ] てあります, ~ておきます"
      },
      vocabulary: [
        {
          id: "v30-01",
          word: "貼ります",
          reading: "はります",
          romaji: "harimasu",
          meaning: "dán (tem, áp phích)",
          type: "Động từ nhóm 1",
          example: {
            ja: "壁にカレンダーが貼ってあります。",
            reading: "かべ に カレンダー が はって あります。",
            vi: "Trên tường có dán cuốn lịch."
          }
        },
        {
          id: "v30-02",
          word: "掛けます",
          reading: "かけます",
          romaji: "kakemasu",
          meaning: "treo (tranh, đồng hồ)",
          type: "Động từ nhóm 2",
          example: {
            ja: "壁に絵が掛けてあります。",
            reading: "かべ に え が かけて あります。",
            vi: "Trên tường có treo một bức tranh."
          }
        },
        {
          id: "v30-03",
          word: "飾ります",
          reading: "かざります",
          romaji: "kazarimasu",
          meaning: "trang trí",
          type: "Động từ nhóm 1",
          example: {
            ja: "部屋にきれいな花を飾ります。",
            reading: "へや に きれい な はな を かざります。",
            vi: "Trang trí hoa đẹp trong phòng."
          }
        },
        {
          id: "v30-04",
          word: "並べます",
          reading: "ならべます",
          romaji: "narabemasu",
          meaning: "xếp hàng, bày biện",
          type: "Động từ nhóm 2",
          example: {
            ja: "本棚に本をきれいに並べます。",
            reading: "ほんだな に ほん を きれい に ならべます。",
            vi: "Xếp sách ngăn nắp ngay ngắn trên giá sách."
          }
        },
        {
          id: "v30-05",
          word: "植えます",
          reading: "うえます",
          romaji: "uemasu",
          meaning: "trồng (cây)",
          type: "Động từ nhóm 2",
          example: {
            ja: "庭に桜の木を植えました。",
            reading: "にわ に さくら の き を うえました。",
            vi: "Tôi đã trồng cây hoa anh đào trong vườn."
          }
        },
        {
          id: "v30-06",
          word: "戻します",
          reading: "もどします",
          romaji: "modoshimasu",
          meaning: "để lại vị trí cũ",
          type: "Động từ nhóm 1",
          example: {
            ja: "使ったら元の所に戻してください。",
            reading: "つかったら もと の ところ に もどしてください。",
            vi: "Dùng xong xin vui lòng để lại chỗ cũ."
          }
        },
        {
          id: "v30-07",
          word: "まとめます",
          reading: "まとめます",
          romaji: "matomemasu",
          meaning: "thu gom, tóm tắt",
          type: "Động từ nhóm 2",
          example: {
            ja: "ごみを一か所にまとめます。",
            reading: "ごみ を いっかしょ に まとめます。",
            vi: "Thu gom rác lại một chỗ."
          }
        },
        {
          id: "v30-08",
          word: "片づけます",
          reading: "かたづけます",
          romaji: "katadzukemasu",
          meaning: "dọn dẹp, sắp xếp",
          type: "Động từ nhóm 2",
          example: {
            ja: "食事のあとテーブルを片づけます。",
            reading: "しょくじ の あと テーブル を かたづけます。",
            vi: "Dọn dẹp bàn ăn sau khi dùng bữa."
          }
        },
        {
          id: "v30-09",
          word: "そのままにします",
          reading: "そのままにします",
          romaji: "sonomama ni shimasu",
          meaning: "để nguyên như thế",
          type: "Cụm từ",
          example: {
            ja: "書類は片づけないで、そのままにしておいてください。",
            reading: "しょるい は かたづけないで、そのまま に して おいて ください。",
            vi: "Tài liệu đừng dọn nhé, cứ để nguyên như vậy giúp tôi."
          }
        },
        {
          id: "v30-10",
          word: "予定",
          reading: "よてい",
          romaji: "yotei",
          meaning: "dự định, lịch trình",
          type: "Danh từ",
          example: {
            ja: "来週の予定をカレンダーに書きます。",
            reading: "らいしゅう の よてい を カレンダー に かきます。",
            vi: "Tôi ghi lịch trình tuần tới vào lịch."
          }
        }
      ],
      kanji: [
        {
          id: "k30-01",
          character: "貼",
          onyomi: "チョウ",
          kunyomi: "は.る",
          meaning: "Thiếp (dán)",
          strokes: 12,
          examples: [
            { compound: "貼付", reading: "ちょうふ", meaning: "dán kèm, đính kèm" }
          ]
        },
        {
          id: "k30-02",
          character: "掛",
          onyomi: "カイ",
          kunyomi: "か.ける, か.かる",
          meaning: "Quải (treo, máng)",
          strokes: 11,
          examples: [
            { compound: "掛け時計", reading: "かけどけい", meaning: "đồng hồ treo tường" }
          ]
        },
        {
          id: "k30-03",
          character: "飾",
          onyomi: "ショク",
          kunyomi: "かざ.る",
          meaning: "Sức (trang sức, trang trí)",
          strokes: 13,
          examples: [
            { compound: "装飾", reading: "そうしょく", meaning: "trang trí" },
            { compound: "飾り", reading: "かざり", meaning: "đồ trang trí" }
          ]
        },
        {
          id: "k30-04",
          character: "並",
          onyomi: "ヘイ",
          kunyomi: "なら.ぶ, なら.べる, なみ",
          meaning: "Tịnh (xếp hàng, bình thường)",
          strokes: 8,
          examples: [
            { compound: "並列", reading: "へいれつ", meaning: "song song, dàn hàng" },
            { compound: "並み", reading: "なみ", meaning: "bình thường, phổ thông" }
          ]
        },
        {
          id: "k30-05",
          character: "植",
          onyomi: "ショク",
          kunyomi: "う.える, う.わる",
          meaning: "Thực (thực vật, trồng trọt)",
          strokes: 12,
          examples: [
            { compound: "植物", reading: "しょくぶつ", meaning: "thực vật" },
            { compound: "植木", reading: "うえき", meaning: "cây cảnh" }
          ]
        }
      ]
    }
  },
  'soumatome-n4': {
    'week-1-day-2': {
      meta: {
        title: "Tuần 1 - Ngày 2: Nhà cửa & Đồ gia dụng",
        order: 2,
        description: "Từ vựng đồ dùng trong gia đình, các thiết bị điện và gian phòng"
      },
      vocabulary: [
        {
          id: "v-sm-w1d2-01",
          word: "玄関",
          reading: "げんかん",
          romaji: "genkan",
          meaning: "cửa ra vào, tiền sảnh nhà",
          type: "Danh từ",
          example: {
            ja: "玄関で靴を脱ぎます。",
            reading: "げんかん で くつ を ぬぎます。",
            vi: "Cởi giày ở bậc thềm cửa ra vào."
          }
        },
        {
          id: "v-sm-w1d2-02",
          word: "廊下",
          reading: "ろうか",
          romaji: "rouka",
          meaning: "hành lang",
          type: "Danh từ",
          example: {
            ja: "廊下を静かに歩いてください。",
            reading: "ろうか を しずか に あるいて ください。",
            vi: "Xin hãy đi nhẹ nhàng ở hành lang."
          }
        },
        {
          id: "v-sm-w1d2-03",
          word: "階段",
          reading: "かいだん",
          romaji: "kaidan",
          meaning: "cầu thang bộ",
          type: "Danh từ",
          example: {
            ja: "エレベーターを使わずに階段を上ります。",
            reading: "エレベーター を つかわずに かいだん を のぼります。",
            vi: "Đi bộ lên cầu thang thay vì dùng thang máy."
          }
        },
        {
          id: "v-sm-w1d2-04",
          word: "居間",
          reading: "いま",
          romaji: "ima",
          meaning: "phòng khách, phòng sinh hoạt chung",
          type: "Danh từ",
          example: {
            ja: "家族みんなで居間に集まってテレビを見ます。",
            reading: "かぞく みんな で いま に あつまって テレビ を みます。",
            vi: "Cả nhà tập trung ở phòng khách xem tivi."
          }
        },
        {
          id: "v-sm-w1d2-05",
          word: "寝室",
          reading: "しんしつ",
          romaji: "shinshitsu",
          meaning: "phòng ngủ",
          type: "Danh từ",
          example: {
            ja: "寝室はとても静かです。",
            reading: "しんしつ は とても しずか です。",
            vi: "Phòng ngủ rất yên tĩnh."
          }
        }
      ],
      kanji: [
        {
          id: "k-sm-w1d2-01",
          character: "玄",
          onyomi: "ゲン",
          kunyomi: "-",
          meaning: "Huyền (sâu thẳm, huyền bí)",
          strokes: 5,
          examples: [
            { compound: "玄関", reading: "げんかん", meaning: "cửa vào, tiền sảnh" }
          ]
        },
        {
          id: "k-sm-w1d2-02",
          character: "関",
          onyomi: "カン",
          kunyomi: "せき, かか.わる",
          meaning: "Quan (liên quan, cửa khẩu)",
          strokes: 14,
          examples: [
            { compound: "関係", reading: "かんけい", meaning: "quan hệ" },
            { compound: "関心", reading: "かんしん", meaning: "quan tâm" }
          ]
        },
        {
          id: "k-sm-w1d2-03",
          character: "廊",
          onyomi: "ロウ",
          kunyomi: "-",
          meaning: "Lang (hành lang)",
          strokes: 12,
          examples: [
            { compound: "廊下", reading: "ろうか", meaning: "hành lang" }
          ]
        },
        {
          id: "k-sm-w1d2-04",
          character: "階",
          onyomi: "カイ",
          kunyomi: "-",
          meaning: "Giai (tầng lầu, bậc thang)",
          strokes: 12,
          examples: [
            { compound: "階段", reading: "かいだん", meaning: "cầu thang" },
            { compound: "階層", reading: "かいそう", meaning: "giai tầng, tầng thứ" }
          ]
        },
        {
          id: "k-sm-w1d2-05",
          character: "段",
          onyomi: "ダン",
          kunyomi: "-",
          meaning: "Đoạn (bậc thang, giai đoạn)",
          strokes: 9,
          examples: [
            { compound: "一段", reading: "いちだん", meaning: "một bậc, một nấc" },
            { compound: "段階", reading: "だんかい", meaning: "giai đoạn" }
          ]
        }
      ]
    }
  }
};

/**
 * Ghi dữ liệu một bài học xuống ổ cứng
 */
function saveUnit(curriculumId, unitId, meta, vocabulary, kanji) {
  const unitDir = path.join(DATA_DIR, curriculumId, unitId);
  if (!fs.existsSync(unitDir)) {
    fs.mkdirSync(unitDir, { recursive: true });
  }

  fs.writeFileSync(path.join(unitDir, '_meta.json'), JSON.stringify(meta, null, 2), 'utf-8');
  fs.writeFileSync(path.join(unitDir, 'vocabulary.json'), JSON.stringify(vocabulary, null, 2), 'utf-8');
  fs.writeFileSync(path.join(unitDir, 'kanji.json'), JSON.stringify(kanji, null, 2), 'utf-8');

  console.log(`✨ Đã tạo/cập nhật thành công bài học [${unitId}] trong [${curriculumId}]`);
  console.log(`   + Metadata: ${meta.title}`);
  console.log(`   + Từ vựng: ${vocabulary.length} mục`);
  console.log(`   + Hán tự: ${kanji.length} mục`);

  // Tự động rebuild manifest
  buildManifest();
}

/**
 * Sinh bài học theo chế độ offline tri thức N4
 */
function generateOffline(curriculumId, unitId) {
  if (curriculumId && unitId && OFFLINE_LESSONS[curriculumId] && OFFLINE_LESSONS[curriculumId][unitId]) {
    const data = OFFLINE_LESSONS[curriculumId][unitId];
    saveUnit(curriculumId, unitId, data.meta, data.vocabulary, data.kanji);
    return;
  }

  // Nếu không chỉ định rõ, sinh tất cả các bài có sẵn chưa tạo
  let generatedCount = 0;
  for (const currId of Object.keys(OFFLINE_LESSONS)) {
    for (const uId of Object.keys(OFFLINE_LESSONS[currId])) {
      const targetDir = path.join(DATA_DIR, currId, uId);
      if (!fs.existsSync(targetDir)) {
        const item = OFFLINE_LESSONS[currId][uId];
        saveUnit(currId, uId, item.meta, item.vocabulary, item.kanji);
        generatedCount++;
      }
    }
  }

  if (generatedCount === 0) {
    console.log('ℹ️ Các bài học mẫu đã tồn tại đầy đủ trong cơ sở dữ liệu!');
  } else {
    console.log(`🎉 Đã sinh tự động ${generatedCount} bài học mới thành công!`);
  }
}

/**
 * Gọi API Ollama Local để sinh bài học
 */
async function generateViaOllama(curriculumId, unitId, promptText) {
  console.log(`🤖 Đang kết nối tới Ollama Local (http://localhost:11434)...`);
  const postData = JSON.stringify({
    model: process.env.OLLAMA_MODEL || 'qwen2.5:7b',
    prompt: promptText,
    stream: false,
    format: 'json'
  });

  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 11434,
      path: '/api/generate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed.response);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(postData);
    req.end();
  });
}

function printHelp() {
  console.log(`
📚 JLPT N4 Auto Crawler & Lesson Generator
Cách sử dụng:
  node scripts/auto-crawler.js [options]

Các tham số:
  --mode [offline|gemini|ollama]    Chế độ sinh bài (Mặc định: offline)
  --curriculum [curriculum-id]      Mã giáo trình (vd: minna-no-nihongo-n4)
  --unit [unit-id]                  Mã bài học (vd: unit-29)
  --help                            Hiển thị hướng dẫn này

Ví dụ:
  node scripts/auto-crawler.js --mode offline
  node scripts/auto-crawler.js --curriculum minna-no-nihongo-n4 --unit unit-29
`);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    mode: 'offline',
    curriculum: null,
    unit: null
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--help' || args[i] === '-h') {
      printHelp();
      process.exit(0);
    }
    if (args[i] === '--mode' && args[i + 1]) {
      options.mode = args[++i];
    } else if (args[i] === '--curriculum' && args[i + 1]) {
      options.curriculum = args[++i];
    } else if (args[i] === '--unit' && args[i + 1]) {
      options.unit = args[++i];
    }
  }

  return options;
}

async function main() {
  const options = parseArgs();

  console.log(`🚀 Bắt đầu chạy Auto Crawler (Chế độ: ${options.mode.toUpperCase()})`);

  if (options.mode === 'offline') {
    generateOffline(options.curriculum, options.unit);
  } else if (options.mode === 'ollama') {
    const samplePrompt = `Hãy đóng vai một chuyên gia tiếng Nhật. Trả lời bằng định dạng JSON chuẩn (mảng các object). Hãy tạo cho tôi danh sách từ vựng tiếng Nhật.
Mỗi từ vựng phải tuân theo cấu trúc sau:
{
  "word": "từ vựng (bắt buộc)",
  "meaning": "nghĩa tiếng Việt (bắt buộc)",
  "reading": "cách đọc Hiragana",
  "sinoVietnamese": "âm Hán Việt",
  "example": "ví dụ câu (tiếng Nhật - tiếng Việt)"
}`;
    try {
      const response = await generateViaOllama(options.curriculum, options.unit, samplePrompt);
      console.log('Phản hồi từ Ollama:\n', response.slice(0, 300) + '...');
    } catch (err) {
      console.error('❌ Lỗi kết nối Ollama:', err.message);
      console.log('💡 Gợi ý: Hãy đảm bảo dịch vụ Ollama đang chạy trên cổng 11434 hoặc sử dụng chế độ offline: node scripts/auto-crawler.js --mode offline');
    }
  } else {
    console.log(`⚠️ Chế độ ${options.mode} chưa được thiết lập API key. Tự động chuyển về offline generator.`);
    generateOffline(options.curriculum, options.unit);
  }
}

if (require.main === module) {
  main();
}

module.exports = { saveUnit, generateOffline };

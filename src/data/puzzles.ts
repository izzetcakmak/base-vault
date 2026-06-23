// ════════════════════════════════════════════════════════════════
//  BASE VAULT — Multilingual Puzzle Bank
//
//  Every puzzle is presented in all 5 supported languages.
//  Answers are LANGUAGE-NEUTRAL (numbers, crypto terms, ciphers)
//  so the same answer is valid regardless of the player's language.
// ════════════════════════════════════════════════════════════════

export type Lang = 'EN' | 'DE' | 'AR' | 'ZH' | 'JA'

export type PuzzleContent = {
  category:   string
  lines:      string[]
  prompt:     string
  hint:       string
  successMsg: string
}

export type Puzzle = {
  // Language-neutral answer(s). Matched case-insensitively, trimmed.
  answer: string | string[]
  i18n:   Record<Lang, PuzzleContent>
}

// ── Shared prompt labels per language ──────────────────────────────────────────
const P = {
  EN: { ans: 'Answer > ', num: 'Number > ' },
  DE: { ans: 'Antwort > ', num: 'Zahl > ' },
  AR: { ans: 'الإجابة > ', num: 'رقم > ' },
  ZH: { ans: '答案 > ', num: '数字 > ' },
  JA: { ans: '答え > ', num: '数字 > ' },
} as const

// ════════════════════════════════════════════════════════════════
//  THE PUZZLES
// ════════════════════════════════════════════════════════════════
export const ALL_PUZZLES: Puzzle[] = [

  // ── 1. Caesar cipher ──────────────────────────────────────────
  {
    answer: 'hello',
    i18n: {
      EN: { category:'Cipher', lines:['> CAESAR CIPHER:','','  Each letter is shifted 3 places forward.','  Decode this word:','','     K H O O R'], prompt:P.EN.ans, hint:'Shift each letter 3 steps BACK in the alphabet.', successMsg:'> CIPHER BROKEN.' },
      DE: { category:'Chiffre', lines:['> CÄSAR-CHIFFRE:','','  Jeder Buchstabe ist 3 Stellen verschoben.','  Entschlüssle dieses Wort:','','     K H O O R'], prompt:P.DE.ans, hint:'Verschiebe jeden Buchstaben 3 Schritte ZURÜCK.', successMsg:'> CHIFFRE GEKNACKT.' },
      AR: { category:'شيفرة', lines:['> شيفرة قيصر:','','  كل حرف مُزاح 3 مواضع للأمام.','  فُكّ هذه الكلمة:','','     K H O O R'], prompt:P.AR.ans, hint:'أرجِع كل حرف 3 خطوات للخلف في الأبجدية الإنجليزية.', successMsg:'> تم كسر الشيفرة.' },
      ZH: { category:'密码', lines:['> 凯撒密码：','','  每个字母向后移动了3位。','  解码这个单词：','','     K H O O R'], prompt:P.ZH.ans, hint:'把每个字母在字母表中向前回退3位。', successMsg:'> 密码已破解。' },
      JA: { category:'暗号', lines:['> シーザー暗号:','','  各文字は3つ後ろにずれています。','  この単語を解読せよ:','','     K H O O R'], prompt:P.JA.ans, hint:'各文字をアルファベットで3つ前に戻す。', successMsg:'> 暗号解読成功。' },
    },
  },

  // ── 2. Binary → text ──────────────────────────────────────────
  {
    answer: 'base',
    i18n: {
      EN: { category:'Binary', lines:['> BINARY SIGNAL:','','  Decode these 4 bytes to ASCII text:','','  01000010 01000001','  01010011 01000101'], prompt:P.EN.ans, hint:'Each byte is one uppercase letter. The chain you stand on.', successMsg:'> SIGNAL DECODED.' },
      DE: { category:'Binär', lines:['> BINÄRSIGNAL:','','  Wandle diese 4 Bytes in ASCII-Text um:','','  01000010 01000001','  01010011 01000101'], prompt:P.DE.ans, hint:'Jedes Byte ist ein Großbuchstabe. Die Chain, auf der du stehst.', successMsg:'> SIGNAL DEKODIERT.' },
      AR: { category:'ثنائي', lines:['> إشارة ثنائية:','','  حوّل هذه البايتات الأربعة إلى نص ASCII:','','  01000010 01000001','  01010011 01000101'], prompt:P.AR.ans, hint:'كل بايت حرف كبير واحد. السلسلة التي تقف عليها.', successMsg:'> تم فك الإشارة.' },
      ZH: { category:'二进制', lines:['> 二进制信号：','','  将这4个字节解码为ASCII文本：','','  01000010 01000001','  01010011 01000101'], prompt:P.ZH.ans, hint:'每个字节是一个大写字母。你所在的链。', successMsg:'> 信号已解码。' },
      JA: { category:'バイナリ', lines:['> バイナリ信号:','','  この4バイトをASCII文字に変換せよ:','','  01000010 01000001','  01010011 01000101'], prompt:P.JA.ans, hint:'各バイトは大文字1つ。君が立つチェーン。', successMsg:'> 信号を解読した。' },
    },
  },

  // ── 3. Reversed word ──────────────────────────────────────────
  {
    answer: 'blockchain',
    i18n: {
      EN: { category:'Cipher', lines:['> MIRROR PROTOCOL:','','  This word is written backwards.','  Restore it:','','     niahckcolb'], prompt:P.EN.ans, hint:'Read it right-to-left. A chain of blocks.', successMsg:'> MIRROR CLEARED.' },
      DE: { category:'Chiffre', lines:['> SPIEGEL-PROTOKOLL:','','  Dieses Wort steht rückwärts.','  Stelle es wieder her:','','     niahckcolb'], prompt:P.DE.ans, hint:'Von rechts nach links lesen. Eine Kette von Blöcken.', successMsg:'> SPIEGEL AUFGELÖST.' },
      AR: { category:'شيفرة', lines:['> بروتوكول المرآة:','','  هذه الكلمة مكتوبة بالعكس.','  أعِد ترتيبها:','','     niahckcolb'], prompt:P.AR.ans, hint:'اقرأها من اليمين لليسار. سلسلة من الكتل.', successMsg:'> تم حل المرآة.' },
      ZH: { category:'密码', lines:['> 镜像协议：','','  这个单词是反着写的。','  还原它：','','     niahckcolb'], prompt:P.ZH.ans, hint:'从右往左读。区块组成的链。', successMsg:'> 镜像已破除。' },
      JA: { category:'暗号', lines:['> ミラープロトコル:','','  この単語は逆さに書かれている。','  元に戻せ:','','     niahckcolb'], prompt:P.JA.ans, hint:'右から左に読む。ブロックの連鎖。', successMsg:'> ミラー解除。' },
    },
  },

  // ── 4. Which L2 ───────────────────────────────────────────────
  {
    answer: 'base',
    i18n: {
      EN: { category:'Crypto', lines:['> CHAIN QUERY:','','  This entire game runs on a single','  Ethereum Layer 2 network.','','  Which one?'], prompt:P.EN.ans, hint:'Its name is also the foundation of a building.', successMsg:'> HOME CHAIN CONFIRMED.' },
      DE: { category:'Krypto', lines:['> CHAIN-ABFRAGE:','','  Dieses ganze Spiel läuft auf einem','  einzigen Ethereum Layer 2.','','  Auf welchem?'], prompt:P.DE.ans, hint:'Sein Name ist auch das Fundament eines Gebäudes.', successMsg:'> HEIMAT-CHAIN BESTÄTIGT.' },
      AR: { category:'كريبتو', lines:['> استعلام السلسلة:','','  هذه اللعبة كلها تعمل على شبكة','  Ethereum Layer 2 واحدة.','','  ما اسمها؟'], prompt:P.AR.ans, hint:'اسمها يعني أيضاً أساس المبنى.', successMsg:'> تم تأكيد السلسلة.' },
      ZH: { category:'加密', lines:['> 链查询：','','  整个游戏运行在一个','  以太坊 Layer 2 网络上。','','  是哪一个？'], prompt:P.ZH.ans, hint:'它的名字也是建筑的“基础”。', successMsg:'> 主链已确认。' },
      JA: { category:'暗号資産', lines:['> チェーン照会:','','  このゲームは単一の','  Ethereum Layer 2 上で動く。','','  どれか?'], prompt:P.JA.ans, hint:'その名は建物の「土台」も意味する。', successMsg:'> ホームチェーン確認。' },
    },
  },

  // ── 5. Ethereum ticker ────────────────────────────────────────
  {
    answer: ['eth', 'ether'],
    i18n: {
      EN: { category:'Crypto', lines:['> TOKEN QUERY:','','  What is the ticker symbol of','  Ethereum\'s native coin?'], prompt:P.EN.ans, hint:'Three letters. Gas is paid in it.', successMsg:'> TOKEN IDENTIFIED.' },
      DE: { category:'Krypto', lines:['> TOKEN-ABFRAGE:','','  Wie lautet das Tickersymbol der','  nativen Münze von Ethereum?'], prompt:P.DE.ans, hint:'Drei Buchstaben. Gas wird damit bezahlt.', successMsg:'> TOKEN IDENTIFIZIERT.' },
      AR: { category:'كريبتو', lines:['> استعلام العملة:','','  ما رمز التداول للعملة','  الأصلية في إيثيريوم؟'], prompt:P.AR.ans, hint:'ثلاثة أحرف. تُدفع بها رسوم الغاز.', successMsg:'> تم تحديد العملة.' },
      ZH: { category:'加密', lines:['> 代币查询：','','  以太坊原生币的','  交易代码是什么？'], prompt:P.ZH.ans, hint:'三个字母。Gas 用它支付。', successMsg:'> 代币已识别。' },
      JA: { category:'暗号資産', lines:['> トークン照会:','','  イーサリアムのネイティブ通貨の','  ティッカーシンボルは?'], prompt:P.JA.ans, hint:'3文字。ガス代の支払いに使う。', successMsg:'> トークン特定。' },
    },
  },

  // ── 6. Satoshi's coin ─────────────────────────────────────────
  {
    answer: ['bitcoin', 'btc'],
    i18n: {
      EN: { category:'Crypto', lines:['> ORIGIN QUERY:','','  In 2009, Satoshi Nakamoto launched','  the first decentralized currency.','','  Name it.'], prompt:P.EN.ans, hint:'Digital gold. Ticker: BTC.', successMsg:'> GENESIS RECOGNIZED.' },
      DE: { category:'Krypto', lines:['> URSPRUNGS-ABFRAGE:','','  2009 startete Satoshi Nakamoto','  die erste dezentrale Währung.','','  Benenne sie.'], prompt:P.DE.ans, hint:'Digitales Gold. Ticker: BTC.', successMsg:'> GENESIS ERKANNT.' },
      AR: { category:'كريبتو', lines:['> استعلام الأصل:','','  في 2009 أطلق ساتوشي ناكاموتو','  أول عملة لامركزية.','','  ما اسمها؟'], prompt:P.AR.ans, hint:'الذهب الرقمي. الرمز: BTC.', successMsg:'> تم التعرف على البداية.' },
      ZH: { category:'加密', lines:['> 起源查询：','','  2009年，中本聪发布了','  第一种去中心化货币。','','  它叫什么？'], prompt:P.ZH.ans, hint:'数字黄金。代码：BTC。', successMsg:'> 创世已识别。' },
      JA: { category:'暗号資産', lines:['> 起源照会:','','  2009年、サトシ・ナカモトが','  最初の分散型通貨を立ち上げた。','','  その名は?'], prompt:P.JA.ans, hint:'デジタルゴールド。ティッカー: BTC。', successMsg:'> ジェネシス認識。' },
    },
  },

  // ── 7. Address prefix ─────────────────────────────────────────
  {
    answer: '0x',
    i18n: {
      EN: { category:'Crypto', lines:['> ADDRESS QUERY:','','  Every wallet address on Base','  begins with the same 2 characters.','','  Type them.'], prompt:P.EN.ans, hint:'A zero, then a letter. Marks hexadecimal.', successMsg:'> PREFIX MATCHED.' },
      DE: { category:'Krypto', lines:['> ADRESS-ABFRAGE:','','  Jede Wallet-Adresse auf Base','  beginnt mit denselben 2 Zeichen.','','  Tippe sie.'], prompt:P.DE.ans, hint:'Eine Null, dann ein Buchstabe. Kennzeichnet Hexadezimal.', successMsg:'> PRÄFIX ERKANNT.' },
      AR: { category:'كريبتو', lines:['> استعلام العنوان:','','  كل عنوان محفظة على Base','  يبدأ بنفس الحرفين.','','  اكتبهما.'], prompt:P.AR.ans, hint:'صفر ثم حرف. يدل على النظام الست عشري.', successMsg:'> تطابقت البادئة.' },
      ZH: { category:'加密', lines:['> 地址查询：','','  Base 上每个钱包地址','  都以相同的2个字符开头。','','  输入它们。'], prompt:P.ZH.ans, hint:'一个零，然后一个字母。表示十六进制。', successMsg:'> 前缀匹配。' },
      JA: { category:'暗号資産', lines:['> アドレス照会:','','  Base 上の全ウォレットアドレスは','  同じ2文字で始まる。','','  入力せよ。'], prompt:P.JA.ans, hint:'ゼロのあとに文字。16進数を示す。', successMsg:'> プレフィックス一致。' },
    },
  },

  // ── 8. Doubling sequence ──────────────────────────────────────
  {
    answer: '32',
    i18n: {
      EN: { category:'Logic', lines:['> SEQUENCE LOCK:','','  2, 4, 8, 16, ?','','  What number comes next?'], prompt:P.EN.num, hint:'Each number doubles the one before.', successMsg:'> SEQUENCE SOLVED.' },
      DE: { category:'Logik', lines:['> FOLGEN-SCHLOSS:','','  2, 4, 8, 16, ?','','  Welche Zahl folgt?'], prompt:P.DE.num, hint:'Jede Zahl ist das Doppelte der vorigen.', successMsg:'> FOLGE GELÖST.' },
      AR: { category:'منطق', lines:['> قفل المتتالية:','','  2, 4, 8, 16, ?','','  ما الرقم التالي؟'], prompt:P.AR.num, hint:'كل رقم ضعف الذي قبله.', successMsg:'> حُلّت المتتالية.' },
      ZH: { category:'逻辑', lines:['> 数列锁：','','  2, 4, 8, 16, ?','','  下一个数字是什么？'], prompt:P.ZH.num, hint:'每个数字是前一个的两倍。', successMsg:'> 数列已解。' },
      JA: { category:'論理', lines:['> 数列ロック:','','  2, 4, 8, 16, ?','','  次の数は?'], prompt:P.JA.num, hint:'各数は前の数の2倍。', successMsg:'> 数列を解いた。' },
    },
  },

  // ── 9. Cats & mice ────────────────────────────────────────────
  {
    answer: '3',
    i18n: {
      EN: { category:'Logic', lines:['> RIDDLE LOCK:','','  3 cats catch 3 mice in 3 minutes.','','  How many cats catch 100 mice','  in 100 minutes?'], prompt:P.EN.num, hint:'One cat catches one mouse in 3 minutes. The rate never changes.', successMsg:'> RIDDLE SOLVED.' },
      DE: { category:'Logik', lines:['> RÄTSEL-SCHLOSS:','','  3 Katzen fangen 3 Mäuse in 3 Minuten.','','  Wie viele Katzen fangen 100 Mäuse','  in 100 Minuten?'], prompt:P.DE.num, hint:'Eine Katze fängt eine Maus in 3 Minuten. Die Rate bleibt gleich.', successMsg:'> RÄTSEL GELÖST.' },
      AR: { category:'منطق', lines:['> قفل اللغز:','','  3 قطط تصطاد 3 فئران في 3 دقائق.','','  كم قطة تصطاد 100 فأر','  في 100 دقيقة؟'], prompt:P.AR.num, hint:'قطة واحدة تصطاد فأراً في 3 دقائق. المعدل ثابت.', successMsg:'> حُلّ اللغز.' },
      ZH: { category:'逻辑', lines:['> 谜题锁：','','  3只猫3分钟抓3只老鼠。','','  100分钟抓100只老鼠','  需要几只猫？'], prompt:P.ZH.num, hint:'一只猫3分钟抓一只老鼠。速率不变。', successMsg:'> 谜题已解。' },
      JA: { category:'論理', lines:['> 謎かけロック:','','  3匹の猫が3分で3匹のネズミを捕る。','','  100分で100匹のネズミを捕るには','  猫は何匹必要?'], prompt:P.JA.num, hint:'1匹の猫は3分で1匹を捕る。割合は不変。', successMsg:'> 謎を解いた。' },
    },
  },

  // ── 10. Fibonacci ─────────────────────────────────────────────
  {
    answer: '13',
    i18n: {
      EN: { category:'Logic', lines:['> FIBONACCI LOCK:','','  1, 1, 2, 3, 5, 8, ?','','  What number comes next?'], prompt:P.EN.num, hint:'Add the two previous numbers together.', successMsg:'> PATTERN MATCHED.' },
      DE: { category:'Logik', lines:['> FIBONACCI-SCHLOSS:','','  1, 1, 2, 3, 5, 8, ?','','  Welche Zahl folgt?'], prompt:P.DE.num, hint:'Addiere die beiden vorherigen Zahlen.', successMsg:'> MUSTER ERKANNT.' },
      AR: { category:'منطق', lines:['> قفل فيبوناتشي:','','  1, 1, 2, 3, 5, 8, ?','','  ما الرقم التالي؟'], prompt:P.AR.num, hint:'اجمع الرقمين السابقين معاً.', successMsg:'> تطابق النمط.' },
      ZH: { category:'逻辑', lines:['> 斐波那契锁：','','  1, 1, 2, 3, 5, 8, ?','','  下一个数字是什么？'], prompt:P.ZH.num, hint:'把前两个数字相加。', successMsg:'> 规律匹配。' },
      JA: { category:'論理', lines:['> フィボナッチロック:','','  1, 1, 2, 3, 5, 8, ?','','  次の数は?'], prompt:P.JA.num, hint:'前の2つの数を足す。', successMsg:'> パターン一致。' },
    },
  },

  // ── 11. 7 × 8 ─────────────────────────────────────────────────
  {
    answer: '56',
    i18n: {
      EN: { category:'Math', lines:['> ARITHMETIC LOCK:','','  7 × 8 = ?'], prompt:P.EN.num, hint:'Fifty-something.', successMsg:'> CALCULATION ACCEPTED.' },
      DE: { category:'Mathe', lines:['> ARITHMETIK-SCHLOSS:','','  7 × 8 = ?'], prompt:P.DE.num, hint:'Fünfzig-etwas.', successMsg:'> BERECHNUNG AKZEPTIERT.' },
      AR: { category:'حساب', lines:['> قفل حسابي:','','  7 × 8 = ?'], prompt:P.AR.num, hint:'في نطاق الخمسينات.', successMsg:'> قُبِل الحساب.' },
      ZH: { category:'数学', lines:['> 算术锁：','','  7 × 8 = ?'], prompt:P.ZH.num, hint:'五十多。', successMsg:'> 计算已接受。' },
      JA: { category:'算数', lines:['> 計算ロック:','','  7 × 8 = ?'], prompt:P.JA.num, hint:'50いくつ。', successMsg:'> 計算を受理。' },
    },
  },

  // ── 12. Order of operations ───────────────────────────────────
  {
    answer: '8',
    i18n: {
      EN: { category:'Math', lines:['> ORDER OF OPERATIONS:','','  2 + 2 × 3 = ?'], prompt:P.EN.num, hint:'Multiply before you add.', successMsg:'> ORDER RESPECTED.' },
      DE: { category:'Mathe', lines:['> RECHENREIHENFOLGE:','','  2 + 2 × 3 = ?'], prompt:P.DE.num, hint:'Punkt vor Strich — erst multiplizieren.', successMsg:'> REIHENFOLGE BEACHTET.' },
      AR: { category:'حساب', lines:['> ترتيب العمليات:','','  2 + 2 × 3 = ?'], prompt:P.AR.num, hint:'الضرب قبل الجمع.', successMsg:'> احتُرم الترتيب.' },
      ZH: { category:'数学', lines:['> 运算顺序：','','  2 + 2 × 3 = ?'], prompt:P.ZH.num, hint:'先乘后加。', successMsg:'> 顺序正确。' },
      JA: { category:'算数', lines:['> 演算の順序:','','  2 + 2 × 3 = ?'], prompt:P.JA.num, hint:'足す前に掛ける。', successMsg:'> 順序を順守。' },
    },
  },

  // ── 13. Planets ───────────────────────────────────────────────
  {
    answer: '8',
    i18n: {
      EN: { category:'Science', lines:['> COSMIC LOCK:','','  How many planets orbit the Sun','  in our solar system?'], prompt:P.EN.num, hint:'Pluto was reclassified in 2006.', successMsg:'> ORBIT ALIGNED.' },
      DE: { category:'Wissenschaft', lines:['> KOSMISCHES SCHLOSS:','','  Wie viele Planeten umkreisen die Sonne','  in unserem Sonnensystem?'], prompt:P.DE.num, hint:'Pluto wurde 2006 neu eingestuft.', successMsg:'> UMLAUFBAHN AUSGERICHTET.' },
      AR: { category:'علوم', lines:['> قفل كوني:','','  كم عدد الكواكب التي تدور حول الشمس','  في نظامنا الشمسي؟'], prompt:P.AR.num, hint:'أُعيد تصنيف بلوتو في 2006.', successMsg:'> اصطفّ المدار.' },
      ZH: { category:'科学', lines:['> 宇宙锁：','','  我们的太阳系中','  有多少颗行星绕太阳运行？'], prompt:P.ZH.num, hint:'冥王星于2006年被重新归类。', successMsg:'> 轨道对齐。' },
      JA: { category:'科学', lines:['> 宇宙ロック:','','  太陽系で太陽を周回する','  惑星はいくつ?'], prompt:P.JA.num, hint:'冥王星は2006年に分類変更された。', successMsg:'> 軌道が整った。' },
    },
  },

  // ── 14. Gold symbol ───────────────────────────────────────────
  {
    answer: 'au',
    i18n: {
      EN: { category:'Science', lines:['> ELEMENT LOCK:','','  What is the chemical symbol','  for gold?'], prompt:P.EN.ans, hint:'Two letters, from the Latin "aurum".', successMsg:'> ELEMENT CONFIRMED.' },
      DE: { category:'Wissenschaft', lines:['> ELEMENT-SCHLOSS:','','  Was ist das chemische Symbol','  für Gold?'], prompt:P.DE.ans, hint:'Zwei Buchstaben, vom lateinischen "aurum".', successMsg:'> ELEMENT BESTÄTIGT.' },
      AR: { category:'علوم', lines:['> قفل العنصر:','','  ما الرمز الكيميائي','  للذهب؟'], prompt:P.AR.ans, hint:'حرفان، من اللاتينية "aurum".', successMsg:'> تم تأكيد العنصر.' },
      ZH: { category:'科学', lines:['> 元素锁：','','  黄金的化学','  符号是什么？'], prompt:P.ZH.ans, hint:'两个字母，源自拉丁语 “aurum”。', successMsg:'> 元素已确认。' },
      JA: { category:'科学', lines:['> 元素ロック:','','  金の化学記号は','  何か?'], prompt:P.JA.ans, hint:'2文字、ラテン語の "aurum" から。', successMsg:'> 元素確認。' },
    },
  },

  // ── 15. Base's parent exchange ────────────────────────────────
  {
    answer: 'coinbase',
    i18n: {
      EN: { category:'Crypto', lines:['> BUILDER QUERY:','','  Base was incubated by a major','  US crypto exchange.','','  Which company?'], prompt:P.EN.ans, hint:'It is publicly listed on NASDAQ. One word.', successMsg:'> BUILDER CONFIRMED.' },
      DE: { category:'Krypto', lines:['> BUILDER-ABFRAGE:','','  Base wurde von einer großen','  US-Krypto-Börse inkubiert.','','  Welches Unternehmen?'], prompt:P.DE.ans, hint:'Börsennotiert an der NASDAQ. Ein Wort.', successMsg:'> BUILDER BESTÄTIGT.' },
      AR: { category:'كريبتو', lines:['> استعلام المطوّر:','','  Base احتضنتها منصة تداول','  كريبتو أمريكية كبرى.','','  ما اسم الشركة؟'], prompt:P.AR.ans, hint:'مُدرجة في بورصة ناسداك. كلمة واحدة.', successMsg:'> تم تأكيد المطوّر.' },
      ZH: { category:'加密', lines:['> 建设者查询：','','  Base 由一家大型','  美国加密交易所孵化。','','  哪家公司？'], prompt:P.ZH.ans, hint:'在纳斯达克上市。一个单词。', successMsg:'> 建设者已确认。' },
      JA: { category:'暗号資産', lines:['> ビルダー照会:','','  Base は大手の米国','  暗号資産取引所が育てた。','','  どの企業か?'], prompt:P.JA.ans, hint:'NASDAQ 上場。1単語。', successMsg:'> ビルダー確認。' },
    },
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Get the localized content for a puzzle (falls back to EN). */
export function getContent(puzzle: Puzzle, lang: Lang): PuzzleContent {
  return puzzle.i18n[lang] ?? puzzle.i18n.EN
}

/** True if the given user input matches the puzzle's language-neutral answer. */
export function isCorrect(puzzle: Puzzle, input: string): boolean {
  const guess = input.trim().toLowerCase()
  const answers = Array.isArray(puzzle.answer) ? puzzle.answer : [puzzle.answer]
  return answers.some(a => a.toLowerCase() === guess)
}

/** Pick `count` random distinct puzzles (seeded by current time). */
export function selectPuzzles(count = 3): Puzzle[] {
  const pool = [...ALL_PUZZLES]
  let rng = Date.now()
  const rand = () => {
    rng ^= rng << 13
    rng ^= rng >> 17
    rng ^= rng << 5
    return Math.abs(rng) / 2147483648
  }
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, count)
}

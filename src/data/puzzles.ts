export type Puzzle = {
  category: string
  lines: string[]
  prompt: string
  answer: string
  hint: string
  successMsg: string
}

// ════════════════════════════════════════════════════════════════
//  İSLAM — Dinin güzelliğini tanıtan sorular (1000+)
// ════════════════════════════════════════════════════════════════
const ISLAM: Puzzle[] = [
  // ── Beş Şart / Temel İbadetler ──────────────────────────────
  {
    category:'İslam',
    lines:['> İSLAM\'IN BEŞ ŞARTI:','','  "Her Müslümanın yerine getirmesi gereken','   beş temel ibadetin ilki,','   Allah\'ın birliğini ve Hz. Muhammed\'in','   peygamberliğini kabul etmektir.','',' Bu şehadetin adı nedir?'],
    prompt:'Cevap > ', answer:'kelime-i şehadet',
    hint:'"Eşhedü en lâ ilâhe illallah..."',
    successMsg:'> İMAN KAPISI AÇILDI.',
  },
  {
    category:'İslam',
    lines:['> NAMAZ CİFRİ:','','  "Müslümanlar günde kaç vakit namaz kılar?"'],
    prompt:'Sayı gir > ', answer:'5',
    hint:'Sabah, öğle, ikindi, akşam, yatsı.',
    successMsg:'> VAKİT BİLİNDİ.',
  },
  {
    category:'İslam',
    lines:['> ORUÇ MESELESİ:','','  "Müslümanların oruç tuttuğu mübarek ay"','',' hangi aydır?'],
    prompt:'Cevap > ', answer:'ramazan',
    hint:'Kur\'an bu ayda indirilmeye başlandı.',
    successMsg:'> RAMAZAN AYDIN OLSUN.',
  },
  {
    category:'İslam',
    lines:['> ZEKAT HESABI:','','  "Nisap miktarına ulaşan malın","   zekatı yüzde kaçtır?"'],
    prompt:'Sayı gir > ', answer:'2.5',
    hint:'Kırkta bir.',
    successMsg:'> HESAP TUTTU.',
  },
  {
    category:'İslam',
    lines:['> HAC SORUSU:','','  "Müslümanların hac için ziyaret ettiği","   kutsal şehrin adı nedir?"'],
    prompt:'Cevap > ', answer:'mekke',
    hint:'Kâbe bu şehirdedir.',
    successMsg:'> KIBLE BELLİ.',
  },
  // ── Hz. Muhammed (s.a.v.) ────────────────────────────────────
  {
    category:'İslam',
    lines:['> PEYGAMBER TARİHİ:','','  "Hz. Muhammed (s.a.v.) hangi şehirde doğdu?"'],
    prompt:'Cevap > ', answer:'mekke',
    hint:'Fil Yılı, 571 miladi.',
    successMsg:'> MEKKE\'İ MUKERREME.',
  },
  {
    category:'İslam',
    lines:['> NUBÜVVETİN BAŞLANGICI:','','  "Hz. Muhammed\'e (s.a.v.) ilk vahiy","   hangi mağarada geldi?"'],
    prompt:'Cevap > ', answer:'hira',
    hint:'Mekke yakınlarındaki dağda bir mağara.',
    successMsg:'> İLK IŞIK PARLADI.',
  },
  {
    category:'İslam',
    lines:['> HİCRET:','','  "Hz. Muhammed\'in (s.a.v.) Mekke\'den","   Medine\'ye göç ettiği bu olay ne olarak anılır?"'],
    prompt:'Cevap > ', answer:'hicret',
    hint:'İslam takviminin başlangıcıdır.',
    successMsg:'> YENİ DÖNEM AÇILDI.',
  },
  {
    category:'İslam',
    lines:['> VEDA HUTBESI:','','  "Hz. Peygamber (s.a.v.) veda haccında","   tüm insanlığa seslendiği hutbesini","   hangi dağda okudu?"'],
    prompt:'Cevap > ', answer:'arafat',
    hint:'Hac\'ın en önemli rüknü burada gerçekleşir.',
    successMsg:'> MESAJ ALINDI.',
  },
  {
    category:'İslam',
    lines:['> PEYGAMBERİN LAKABI:','','  "Hz. Muhammed\'in (s.a.v.) dürüstlüğü","   sebebiyle halk tarafından verilen","   ünvanı neydi?"'],
    prompt:'Cevap > ', answer:'el-emin',
    hint:'\"Güvenilir\" anlamına gelir.',
    successMsg:'> EMANETİ KORUYAN.',
  },
  {
    category:'İslam',
    lines:['> AILE:','','  "Hz. Muhammed\'in (s.a.v.) ilk eşinin","   adı neydi?"'],
    prompt:'Cevap > ', answer:'hatice',
    hint:'İlk Müslüman olan kadındır.',
    successMsg:'> ANNELER ANNESİ.',
  },
  {
    category:'İslam',
    lines:['> VEFAT:','','  "Hz. Muhammed (s.a.v.) hangi şehirde","   vefat etti?"'],
    prompt:'Cevap > ', answer:'medine',
    hint:'Hicretin yapıldığı şehir.',
    successMsg:'> MEDİNE\'İ MÜNEVVERE.',
  },
  // ── Kur\'an-ı Kerim ──────────────────────────────────────────
  {
    category:'İslam',
    lines:['> KUR\'AN SORUSU:','','  "Kur\'an-ı Kerim kaç sureden oluşur?"'],
    prompt:'Sayı gir > ', answer:'114',
    hint:'Fatiha\'dan Nas\'a.',
    successMsg:'> SURE SAYISI BİLİNDİ.',
  },
  {
    category:'İslam',
    lines:['> KUR\'AN\'IN İLK SURESİ:','','  "Kur\'an\'ın ilk suresinin adı nedir?"'],
    prompt:'Cevap > ', answer:'fatiha',
    hint:'Her namazda okunur. \"Açılış\" demektir.',
    successMsg:'> AÇILIŞ SURESİ.',
  },
  {
    category:'İslam',
    lines:['> EN UZUN SURE:','','  "Kur\'an\'ın en uzun suresi hangisidir?"'],
    prompt:'Cevap > ', answer:'bakara',
    hint:'286 ayet. \"İnek\" demektir.',
    successMsg:'> EN UZUN SURE BİLİNDİ.',
  },
  {
    category:'İslam',
    lines:['> AYETÜ\'L-KÜRSİ:','','  "\"Allah\'tan başka ilah yoktur,","   O diridir, her şeyi ayaktadır.\"","   Bu ayet hangi surenin 255. ayetidir?"'],
    prompt:'Cevap > ', answer:'bakara',
    hint:'Kur\'an\'ın en büyük ayeti olarak bilinir.',
    successMsg:'> KÜRSÜ AYETİ TANIMLANDI.',
  },
  {
    category:'İslam',
    lines:['> KUR\'AN\'IN EN KISA SURESİ:','','  "Sadece 3 ayetten oluşan,","   en kısa sure hangisidir?"'],
    prompt:'Cevap > ', answer:'kevser',
    hint:'\"Biz sana Kevser\'i verdik.\"',
    successMsg:'> KISA AMA DERİN.',
  },
  {
    category:'İslam',
    lines:['> İNDİRİLİŞ:','','  "Kur\'an hangi kutsal gecede","   indirilmeye başlanmıştır?"'],
    prompt:'Cevap > ', answer:'kadir gecesi',
    hint:'Bin aydan daha hayırlı bir gece.',
    successMsg:'> KADİR GECESİ YÜCELTİLDİ.',
  },
  {
    category:'İslam',
    lines:['> HAFIZ:','','  "Kur\'an\'ın tamamını ezberleyen","   kişiye ne denir?"'],
    prompt:'Cevap > ', answer:'hafız',
    hint:'Koruyucu, muhafız anlamında.',
    successMsg:'> HAFIZLIK ŞEREFİ.',
  },
  {
    category:'İslam',
    lines:['> MUSHAF:','','  "Kur\'an yazılı hale ilk kez","   sistematik olarak hangi halife döneminde","   tek kitap olarak toplandı?"'],
    prompt:'Cevap > ', answer:'ebubekir',
    hint:'Hz. Peygamberin ilk halefi.',
    successMsg:'> KUR\'AN KORUNDU.',
  },
  {
    category:'İslam',
    lines:['> TERTIL:','','  "Kur\'an\'ı doğru ve güzel okuma","   kurallarını inceleyen İslami ilim","   dalının adı nedir?"'],
    prompt:'Cevap > ', answer:'tecvid',
    hint:'Her harfi doğru çıkarmak için.',
    successMsg:'> GÜZEL OKUYUŞ.',
  },
  // ── İslam\'ın Temel Kavramları ────────────────────────────────
  {
    category:'İslam',
    lines:['> TEVHID:','','  "İslam\'ın en temel inancı olan,","   Allah\'ın birliğini ifade eden kavram nedir?"'],
    prompt:'Cevap > ', answer:'tevhid',
    hint:'\"Lâ ilâhe illallah\"ın özü.',
    successMsg:'> BİRLİK ANLAŞILDI.',
  },
  {
    category:'İslam',
    lines:['> İHSAN:','','  "\"Allah\'ı görüyormuşsun gibi ibadet etmek\"","   şeklinde tanımlanan kavram nedir?"'],
    prompt:'Cevap > ', answer:'ihsan',
    hint:'İmanın ve İslam\'ın üçüncü halkası.',
    successMsg:'> EN GÜZEL OLUŞ.',
  },
  {
    category:'İslam',
    lines:['> TAKVA:','','  "Allah korkusu ve bilinci içinde","   günah ve kötülükten kaçınmak","   anlamına gelen kavram nedir?"'],
    prompt:'Cevap > ', answer:'takva',
    hint:'\"Muttaki\" bu kelimeden gelir.',
    successMsg:'> KORUNAN KALP.',
  },
  {
    category:'İslam',
    lines:['> SABIR:','','  "Kur\'an-ı Kerim\'de 90\'dan fazla yerde","   geçen, zorluklar karşısında direnci","   ifade eden erdem nedir?"'],
    prompt:'Cevap > ', answer:'sabır',
    hint:'\"Allah sabredenlerle beraberdir.\"',
    successMsg:'> SABRIN SONU SELAMETTIR.',
  },
  {
    category:'İslam',
    lines:['> ŞÜKÜR:','','  "\"Verilen nimetlere karşı minnettarlık","   göstermek\" anlamına gelen","   İslami kavram nedir?"'],
    prompt:'Cevap > ', answer:'şükür',
    hint:'\"Şükrederseniz arttırırım.\" (İbrahim, 7)',
    successMsg:'> NİMET ARTAR.',
  },
  {
    category:'İslam',
    lines:['> TÖVBE:','','  "Günahlardan pişmanlık duyup","   Allah\'a yönelmek için kullanılan","   kavram nedir?"'],
    prompt:'Cevap > ', answer:'tövbe',
    hint:'Allah tövbeleri kabul edendir.',
    successMsg:'> KAPI AÇIK.',
  },
  {
    category:'İslam',
    lines:['> ADALET:','','  "İslam\'ın en temel değerlerinden biri","   olan, hak ve hukuka uygun davranış","   kavramı nedir?"'],
    prompt:'Cevap > ', answer:'adalet',
    hint:'\"Adaletle hükmedin.\" (Nisa, 58)',
    successMsg:'> MİZAN DOĞRULDU.',
  },
  {
    category:'İslam',
    lines:['> MERHAMEt:','','  "\"Er-Rahim\" Allah\'ın güzel isimlerinden","   biridir. Bu ismin anlamı nedir?"'],
    prompt:'Cevap > ', answer:'merhametli',
    hint:'Rahman ve Rahim — ikisi de merhameti anlatır.',
    successMsg:'> RAHMETTEN NASIP AL.',
  },
  {
    category:'İslam',
    lines:['> HAYA:','','  "\"Hayadan olan şeyler güzeldir\"","   buyuran Peygamberimiz (s.a.v.)","   hangi değeri tanımlamaktadır?"'],
    prompt:'Cevap > ', answer:'haya',
    hint:'Utanma, edep, iffet.',
    successMsg:'> HAYA İMANDAN.',
  },
  {
    category:'İslam',
    lines:['> İLİM:','','  "\"Beşikten mezara kadar ilim öğrenin\"","   hadisi hangi dini faaliyeti","   teşvik etmektedir?"'],
    prompt:'Cevap > ', answer:'ilim',
    hint:'Kur\'an\'ın ilk emri: \"Oku!\"',
    successMsg:'> İLİM NUR.',
  },
  // ── İslam Tarihi ─────────────────────────────────────────────
  {
    category:'İslam',
    lines:['> İSLAM\'IN DOĞUŞU:','','  "İslam dini hangi yüzyılda","   ortaya çıkmıştır? (Miladi)"'],
    prompt:'Sayı gir > ', answer:'7',
    hint:'Hz. Muhammed 610\'da peygamberliğini ilan etti.',
    successMsg:'> TARİH NOT EDİLDİ.',
  },
  {
    category:'İslam',
    lines:['> BEDIR SAVAŞI:','','  "Müslümanların Mekkelilere karşı","   kazandığı ilk büyük savaş nedir?"'],
    prompt:'Cevap > ', answer:'bedir',
    hint:'624 miladi. 313 Müslüman, 1000 Mekkeli.',
    successMsg:'> ZAFER KAYITLARA GEÇTİ.',
  },
  {
    category:'İslam',
    lines:['> FETİH:','','  "Hz. Muhammed (s.a.v.) 630\'da","   Mekke\'yi kansız biçimde fethetti.","   Bu olay tarihte ne olarak bilinir?"'],
    prompt:'Cevap > ', answer:'mekke\'nin fethi',
    hint:'Putlar Kâbe\'den temizlendi.',
    successMsg:'> MEKKE IŞIDI.',
  },
  {
    category:'İslam',
    lines:['> DÖRT HALİFE:','','  "Hz. Ebubekir, Hz. Ömer, Hz. Osman","   ve Hz. Ali dönemine İslam tarihinde","   ne denir?"'],
    prompt:'Cevap > ', answer:'dört halife dönemi',
    hint:'Asr-ı Saadet\'in devamı.',
    successMsg:'> DÖRT TARAÇ AYDINLANDI.',
  },
  {
    category:'İslam',
    lines:['> ENDÜLÜs:','','  "İslam\'ın İspanya ve Portekiz\'deki","   varlığına ne ad verilir?","   (Arapça ismi)"'],
    prompt:'Cevap > ', answer:'endülüs',
    hint:'711-1492 yılları arası. Kurtuba Camii.',
    successMsg:'> ENDÜLÜS HATIRASI.',
  },
  {
    category:'İslam',
    lines:['> HAÇLI SEFERLERİ:','','  "1095\'te başlayan ve","   İslam topraklarını hedef alan","   Avrupa kaynaklı askeri seferler","   ne olarak adlandırılır?"'],
    prompt:'Cevap > ', answer:'haçlı seferleri',
    hint:'Kudüs için 200 yıllık mücadele.',
    successMsg:'> TARİH YAZILDI.',
  },
  {
    category:'İslam',
    lines:['> SELAHADDİN:','','  "1187\'de Kudüs\'ü Haçlılardan","   geri alan Müslüman kumandanın adı?"'],
    prompt:'Cevap > ', answer:'selahaddin',
    hint:'Selahaddin Eyyubi. Onurlu zafer.',
    successMsg:'> KUDÜS KURTARILDI.',
  },
  {
    category:'İslam',
    lines:['> ABBASILER:','','  "İslam\'ın altın çağı sayılan,","   ilim ve sanatın zirveye çıktığı","   halifelik hangi hanedana aittir?"'],
    prompt:'Cevap > ', answer:'abbasiler',
    hint:'Bağdat merkezli. 750-1258.',
    successMsg:'> ALTIN ÇAĞ ANILDI.',
  },
  // ── İslam\'da Bilim ve Medeniyet ─────────────────────────────
  {
    category:'İslam',
    lines:['> İSLAM BİLİMİ:','','  "\"El-Kitabu\'l Muhtasar fi Hisab","   il-Cebr\" adlı eseriyle cebri","   kuran Müslüman matematikçi kimdir?"'],
    prompt:'Cevap > ', answer:'el-harezmi',
    hint:'\"Algoritma\" kelimesi onun adından gelir.',
    successMsg:'> CEBİR ÇÖZÜLDÜ.',
  },
  {
    category:'İslam',
    lines:['> TIPTA İSLAM:','','  "Batı\'da \"Avicenna\" olarak bilinen,","   \"Tıbbın Kanunu\" adlı eserin","   yazarı kimdir?"'],
    prompt:'Cevap > ', answer:'ibn-i sina',
    hint:'Modern tıbbın babası sayılır.',
    successMsg:'> ŞIFA BULUNDU.',
  },
  {
    category:'İslam',
    lines:['> COĞRAFİ BİLİM:','','  "\"Kitabü\'l Rüccari\" adlı eserinde","   dünyanın ilk gerçekçi haritasını","   çizen Müslüman coğrafyacı kimdir?"'],
    prompt:'Cevap > ', answer:'idrisi',
    hint:'12. yüzyıl Sicilya. El-İdrisi.',
    successMsg:'> HARİTA ÇIZILDI.',
  },
  {
    category:'İslam',
    lines:['> ASTRONOMI:','','  "Güneş\'in ve gezegenlerin hareketini","   matematiksel olarak açıklayan,","   Kopernik\'ten 250 yıl önce","   heliosantrik modeli tartışan","   İslam astronomu kimdir?"'],
    prompt:'Cevap > ', answer:'biruni',
    hint:'El-Biruni. Üniversal bir Müslüman bilgin.',
    successMsg:'> GÖKYÜZÜ ÇÖZÜLDÜ.',
  },
  {
    category:'İslam',
    lines:['> OPTİK:','','  "Işığın kırılmasını ve gözün","   çalışma prensibini keşfeden","   Müslüman bilim insanı kimdir?"'],
    prompt:'Cevap > ', answer:'ibn-i heysem',
    hint:'\"Kitabü\'l Menazır\". Optik biliminin kurucusu.',
    successMsg:'> IŞIK ANLAŞILDI.',
  },
  {
    category:'İslam',
    lines:['> TARİH BİLİMİ:','','  "\"Mukaddime\" adlı eseriyle","   sosyoloji ve tarih felsefesini","   kuran İslam düşünürü kimdir?"'],
    prompt:'Cevap > ', answer:'ibn-i haldun',
    hint:'14. yüzyıl. \"Asabiyet\" teorisi.',
    successMsg:'> TOPLUM ANALİZİ TAMAMLANDI.',
  },
  {
    category:'İslam',
    lines:['> HUKUK:','','  "İslam hukukunun (fıkıh) dört büyük","   mezhebinden en çok takipçiye","   sahip olan Sünni mezhep hangisidir?"'],
    prompt:'Cevap > ', answer:'hanefi',
    hint:'İmam-ı Azam Ebu Hanife kurdu.',
    successMsg:'> MEZHEP TANIMLANDI.',
  },
  // ── İslam Mimarisi ve Kutsal Mekanlar ────────────────────────
  {
    category:'İslam',
    lines:['> KÂBE:','','  "Müslümanların ibadet ederken","   yöneldikleri ve dünyanın her","   yerinden Müslümanların ziyaret","   ettiği kutsal yapının adı nedir?"'],
    prompt:'Cevap > ', answer:'kabe',
    hint:'Mekke\'nin kalbinde. \"Beytullah\" - Allah\'ın evi.',
    successMsg:'> KIBLE BELLİ.',
  },
  {
    category:'İslam',
    lines:['> MESCİD-İ NEBEVİ:','','  "Hz. Muhammed\'in (s.a.v.) defnedildiği","   ve bizzat inşa ettiği cami","   hangi şehirdedir?"'],
    prompt:'Cevap > ', answer:'medine',
    hint:'Hicretin şehri.',
    successMsg:'> PEYGAMBER YURDU.',
  },
  {
    category:'İslam',
    lines:['> MESCİD-İ AKSA:','','  "Müslümanlarca üçüncü kutsal mescit","   olarak kabul edilen yapı","   hangi şehirdedir?"'],
    prompt:'Cevap > ', answer:'kudüs',
    hint:'İsrael/Filistin. \"Uzak mescid.\"',
    successMsg:'> ÜÇÜNCÜ HAREM.',
  },
  {
    category:'İslam',
    lines:['> KUBBET-ÜS SAHRA:','','  "Kudüs\'teki altın kubbeli ve","   İslam mimarisinin şaheseri sayılan","   bu yapı ne zaman inşa edildi? (yüzyıl)"'],
    prompt:'Yüzyıl > ', answer:'7',
    hint:'691 miladi. Emevi halifesi Abdülmelik.',
    successMsg:'> KUBBE PARLADI.',
  },
  {
    category:'İslam',
    lines:['> KURTUBA CAMİİ:','','  "Endülüs\'ün ihtişamını yansıtan","   ve bugün hâlâ ayakta olan","   bu büyük cami hangi ülkededir?"'],
    prompt:'Cevap > ', answer:'ispanya',
    hint:'Córdoba şehri. Mezquita.',
    successMsg:'> ENDÜLÜS MIRASI.',
  },
  {
    category:'İslam',
    lines:['> SÜLEYMANIYE:','','  "Mimar Sinan\'ın en büyük eseri","   olarak kabul edilen cami","   hangi şehirdedir?"'],
    prompt:'Cevap > ', answer:'istanbul',
    hint:'Kanuni Sultan Süleyman yaptırdı.',
    successMsg:'> TAŞLAR YERLİ YERİNDE.',
  },
  {
    category:'İslam',
    lines:['> SELİMİYE:','','  "Mimar Sinan\'ın \"ustalık eserim\"","   dediği cami hangi şehirdedir?"'],
    prompt:'Cevap > ', answer:'edirne',
    hint:'UNESCO Dünya Mirası. Dört minareli.',
    successMsg:'> SINAN\'IN ZİRVESİ.',
  },
  {
    category:'İslam',
    lines:['> TAC MAHAL:','','  "Eşi Mümtaz Mahal için Şah Cihan","   tarafından yaptırılan ve İslam","   mimarisinin incisi sayılan yapı","   hangi ülkededir?"'],
    prompt:'Cevap > ', answer:'hindistan',
    hint:'Agra şehri. Mermer. 1632-1653.',
    successMsg:'> SEVGININ ABIDESİ.',
  },
  // ── Peygamberler ─────────────────────────────────────────────
  {
    category:'İslam',
    lines:['> PEYGAMBERLER:','','  "İslam\'a göre Allah, insanlığa","   kaç peygamber göndermiştir?","   (yaygın kabul)"'],
    prompt:'Sayı gir > ', answer:'124000',
    hint:'Kur\'an 25 peygamberin adını zikreder.',
    successMsg:'> SAYISIZ ELÇİ.',
  },
  {
    category:'İslam',
    lines:['> ULÜ\'L AZM:','','  "\"Ulü\'l Azm\" peygamberler kaç tanedir?"'],
    prompt:'Sayı gir > ', answer:'5',
    hint:'Nuh, İbrahim, Musa, İsa, Muhammed.',
    successMsg:'> BEŞ BÜYÜK ELÇİ.',
  },
  {
    category:'İslam',
    lines:['> HZ. İBRAHİM:','','  "\"Halilullah\" yani Allah\'ın dostu","   olarak anılan peygamber kimdir?"'],
    prompt:'Cevap > ', answer:'ibrahim',
    hint:'Kâbe\'yi oğlu İsmail ile yeniden inşa etti.',
    successMsg:'> DOSTLUK TESCIL EDİLDİ.',
  },
  {
    category:'İslam',
    lines:['> HZ. MUSA:','','  "Firavun\'a karşı kavmini kurtarmak","   için Allah tarafından gönderilen","   ve Tevrat\'ı alan peygamber kimdir?"'],
    prompt:'Cevap > ', answer:'musa',
    hint:'Tur-i Sina\'da vahiy aldı.',
    successMsg:'> DENIZ YARILLDI.',
  },
  {
    category:'İslam',
    lines:['> HZ. İSA:','','  "İncil\'i getiren ve Müslümanlarca","   da peygamber olarak kabul edilen","   İsa\'nın Kur\'an\'daki lakabı nedir?"'],
    prompt:'Cevap > ', answer:'mesih',
    hint:'\"İsa el-Mesih\" olarak geçer.',
    successMsg:'> MESIH TANIMLANDI.',
  },
  {
    category:'İslam',
    lines:['> HZ. YUSUF:','','  "Kur\'an\'da \"ahsenü\'l kasas\"","   yani \"en güzel kıssa\" olarak","   anılan sure kimin hikayesini anlatır?"'],
    prompt:'Cevap > ', answer:'yusuf',
    hint:'Yusuf suresi. Yakup\'un oğlu.',
    successMsg:'> EN GÜZEL HİKAYE.',
  },
  // ── Ramazan, Bayram, Dini Günler ─────────────────────────────
  {
    category:'İslam',
    lines:['> RAMAZAN GECELERİ:','','  "Ramazan ayının son on gününde","   Hz. Peygamberin uyguladığı ve","   camide inzivaya çekilme ibadeti","   ne olarak adlandırılır?"'],
    prompt:'Cevap > ', answer:'itikaf',
    hint:'Dünyadan el çekip sadece ibadetle meşgul olmak.',
    successMsg:'> İÇE DÖNÜŞ TAMAMLANDI.',
  },
  {
    category:'İslam',
    lines:['> FITRE:','','  "Ramazan sonunda verilen","   zorunlu sadakanın adı nedir?"'],
    prompt:'Cevap > ', answer:'fitre',
    hint:'Fitre-i fıtr. Bayram öncesi verilir.',
    successMsg:'> SADAKA VERİLDİ.',
  },
  {
    category:'İslam',
    lines:['> İKİ BAYRAM:','','  "İslam\'daki iki büyük bayramın","   adlarını söyleyin. (önce geleni)"'],
    prompt:'Cevap > ', answer:'ramazan bayramı',
    hint:'Diğeri Kurban Bayramı\'dır.',
    successMsg:'> BAYRAM MÜbarek.',
  },
  {
    category:'İslam',
    lines:['> KURBAN:','','  "Kurban Bayramı\'nda Hz. İbrahim\'in","   oğlunu kurban etme kıssası","   hangi sureye atıfla anılır?"'],
    prompt:'Cevap > ', answer:'saffat',
    hint:'Saffat Suresi 100-107. ayetler.',
    successMsg:'> TESLİMİYET TAM.',
  },
  // ── Ahlak ve Değerler ────────────────────────────────────────
  {
    category:'İslam',
    lines:['> KOMŞU HAKKI:','','  "\"Cebrail bana komşu hakkını","   o kadar sık tavsiye etti ki","   onu miras bırakacak sandım.\"","   Bu hadis hangi değeri öğütler?"'],
    prompt:'Cevap > ', answer:'komşuluk',
    hint:'Komşusu açken tok yatan gerçek Müslüman değildir.',
    successMsg:'> KOMŞUYA SAHİP ÇIK.',
  },
  {
    category:'İslam',
    lines:['> ANNE HAKKI:','','  "\"Cennet annelerin ayakları altındadır.\"","   Bu söz İslam\'da hangi değeri","   ön plana çıkarır?"'],
    prompt:'Cevap > ', answer:'anneye saygı',
    hint:'Kur\'an ebeveyne \"öf\" bile denmemesini emreder.',
    successMsg:'> CENNET AYAKLARIN ALTINda.',
  },
  {
    category:'İslam',
    lines:['> GIYBET:','','  "Kur\'an\'da gıybeti,","   ölü kardeşin etini yemek","   olarak tasvir eden sure hangisidir?"'],
    prompt:'Cevap > ', answer:'hucurat',
    hint:'Hucurat Suresi 12. ayet.',
    successMsg:'> DILI KORU.',
  },
  {
    category:'İslam',
    lines:['> GÜZEL AHLAK:','','  "Hz. Peygamber (s.a.v.) buyuruyor:","   \"Ben güzel ahlakı tamamlamak","   için gönderildim.\"","   İslam\'ın bu amacına ne denir?"'],
    prompt:'Cevap > ', answer:'ahlak',
    hint:'Ahlak-ı hamide / güzel huylar.',
    successMsg:'> AHLAK ZİRVESİ.',
  },
  // ── İslam\'da Sanat ──────────────────────────────────────────
  {
    category:'İslam',
    lines:['> HAT SANATI:','','  "İslam\'da kutsal metinlerin","   sanatsal biçimde yazılmasını","   ifade eden sanat dalı nedir?"'],
    prompt:'Cevap > ', answer:'hat',
    hint:'Hattat bu sanatı icra eder.',
    successMsg:'> KALEM USTALANDI.',
  },
  {
    category:'İslam',
    lines:['> TEZHİP:','','  "El yazmalarını ve Kur\'an sayfalarını","   altın ve renkli desenlerle süsleme","   sanatının adı nedir?"'],
    prompt:'Cevap > ', answer:'tezhip',
    hint:'Zehep = altın. Altın süsleme.',
    successMsg:'> ALTIN YAPRAKLAR.',
  },
  {
    category:'İslam',
    lines:['> MİNARE:','','  "Camilerin simgesi haline gelen","   ve ezan okunan yüksek yapıya","   ne denir?"'],
    prompt:'Cevap > ', answer:'minare',
    hint:'\"Menare\" - ışık yeri anlamında.',
    successMsg:'> EZAN YANKIANIYOR.',
  },
  {
    category:'İslam',
    lines:['> EBRU:','','  "Su yüzeyine boyalar damlatarak","   yapılan ve İslam medeniyetinde","   gelişen Türk-İslam sanatı nedir?"'],
    prompt:'Cevap > ', answer:'ebru',
    hint:'\"Bulutlu\" anlamında. Her biri eşsiz.',
    successMsg:'> SANAT BOZULMAZ.',
  },
  // ── Namaz ve İbadet ─────────────────────────────────────────
  {
    category:'İslam',
    lines:['> EZAN:','','  "\"Allah\'u Ekber\" ile başlayan","   ve Müslümanları namaza çağıran","   bu anons ne olarak bilinir?"'],
    prompt:'Cevap > ', answer:'ezan',
    hint:'Günde 5 kez okunur.',
    successMsg:'> ÇAĞRI DUYULDU.',
  },
  {
    category:'İslam',
    lines:['> İLK MÜEZZIN:','','  "Hz. Peygamber\'in (s.a.v.) ilk","   müezzini olan ve güzel sesiyle","   meşhur olan sahabi kimdir?"'],
    prompt:'Cevap > ', answer:'bilal',
    hint:'Bilal-i Habeşi. Köle iken azat edildi.',
    successMsg:'> İLK ÇAĞRI.',
  },
  {
    category:'İslam',
    lines:['> KIBLE:','','  "Namaz kılarken döndüğümüz yönün","   adı nedir?"'],
    prompt:'Cevap > ', answer:'kible',
    hint:'Kâbe\'nin yönü.',
    successMsg:'> YÖN BELLİ.',
  },
  {
    category:'İslam',
    lines:['> TAHARET:','','  "Namaz öncesi abdest alınmasını","   gerektiren bu temizlenme","   kavramının adı nedir?"'],
    prompt:'Cevap > ', answer:'abdest',
    hint:'Eller, yüz, kollar, ayaklar yıkanır.',
    successMsg:'> TEMİZLİK İMANDAN.',
  },
  {
    category:'İslam',
    lines:['> CUma NAMAZI:','','  "Haftanın hangi günü öğle vakti","   kılınan ve Müslüman erkekler","   için farz olan namaz vardır?"'],
    prompt:'Cevap > ', answer:'cuma',
    hint:'\"Toplanma günü\" anlamında.',
    successMsg:'> CUMA MÜBAREKTIR.',
  },
  // ── İslam\'ın Yayılışı ───────────────────────────────────────
  {
    category:'İslam',
    lines:['> DÜNYA NÜFUSU:','','  "Bugün dünyada yaklaşık kaç","   Milyar Müslüman vardır?"'],
    prompt:'Sayı gir > ', answer:'2',
    hint:'Yaklaşık 1.8-2 milyar.',
    successMsg:'> BÜYÜK ÜMMET.',
  },
  {
    category:'İslam',
    lines:['> EN KALABALIK:','','  "Müslüman nüfusu en fazla olan","   ülke hangisidir?"'],
    prompt:'Cevap > ', answer:'endonezya',
    hint:'270 milyonun üzerinde Müslüman nüfusu.',
    successMsg:'> ASYA\'NIN KALBİ.',
  },
  {
    category:'İslam',
    lines:['> ANADOLU\'DA İSLAM:','','  "Türklerin İslam\'ı toplu olarak","   benimsemeye başladığı savaş","   hangisidir? (1071)"'],
    prompt:'Cevap > ', answer:'malazgirt',
    hint:'Sultan Alparslan - Anadolu\'nun kapısı açıldı.',
    successMsg:'> KAPI AÇILDI.',
  },
  {
    category:'İslam',
    lines:['> İSLAM VE BARIŞ:','','  "\"İslam\" kelimesinin kök anlamı","   ne demektir?"'],
    prompt:'Cevap > ', answer:'barış',
    hint:'\"Selam\" ve \"İslam\" aynı kökten. Silm = barış.',
    successMsg:'> BARIŞ DİNİ.',
  },
  // ── Esmau\'l Hüsna ───────────────────────────────────────────
  {
    category:'İslam',
    lines:['> ALLAH\'IN İSİMLERİ:','','  "Allah\'ın güzel isimlerine","   ne denir?"'],
    prompt:'Cevap > ', answer:'esmau\'l hüsna',
    hint:'99 güzel isim.',
    successMsg:'> İSİMLER BİLİNDİ.',
  },
  {
    category:'İslam',
    lines:['> ER-RAHMAN:','','  "Allah\'ın isimlerinden \"Er-Rahman\"","   ne anlama gelir?"'],
    prompt:'Cevap > ', answer:'esirgeyen',
    hint:'Hem Müslüman hem gayre esirgeyen.',
    successMsg:'> RAHMET KUŞATTI.',
  },
  {
    category:'İslam',
    lines:['> EL-HALIK:','','  "\"Her şeyi yoktan var eden\"","   anlamına gelen Allah\'ın ismi?"'],
    prompt:'Cevap > ', answer:'el-halik',
    hint:'Yaratıcı. Herşeyin yaratıcısı.',
    successMsg:'> YARATILIŞ ANLAŞILDI.',
  },
  {
    category:'İslam',
    lines:['> EL-ADIL:','','  "\"Mutlak adaletle hükmeden\"","   anlamındaki isim hangisidir?"'],
    prompt:'Cevap > ', answer:'el-adl',
    hint:'Kıyamette herkes hakkını alır.',
    successMsg:'> ADALET SONSUZ.',
  },
  {
    category:'İslam',
    lines:['> EL-VEDUD:','','  "\"Çok seven, sevgisi sonsuz olan\"","   anlamındaki Allah\'ın ismi?"'],
    prompt:'Cevap > ', answer:'el-vedud',
    hint:'\"Allah sevendir.\" (Buruc, 14)',
    successMsg:'> SEVGİ TAŞIYOR.',
  },
  // ── Tasavvuf ve Manevi Derinlik ──────────────────────────────
  {
    category:'İslam',
    lines:['> MEVLANA:','','  "\"Sen aradığın şeysin\" diyen","   ve \"Mesnevî\" adlı eserin","   yazarı olan Müslüman şair kimdir?"'],
    prompt:'Cevap > ', answer:'mevlana',
    hint:'Konya\'da medfun. Sema töreni.',
    successMsg:'> NİY SÖYLER GERÇEĞI.',
  },
  {
    category:'İslam',
    lines:['> YUNUS EMRE:','','  "\"Yaratılanı severim Yaratan\'dan ötürü\"","   diyen Türk-İslam şairinin adı?"'],
    prompt:'Cevap > ', answer:'yunus emre',
    hint:'13-14. yüzyıl Anadolu\'su.',
    successMsg:'> SEVGI DOLU YÜREK.',
  },
  {
    category:'İslam',
    lines:['> TASAVVUF:','','  "İslam\'ın manevi boyutunu","   derinleştiren iç arınma","   ve Allah sevgisini esas alan","   ilim dalına ne denir?"'],
    prompt:'Cevap > ', answer:'tasavvuf',
    hint:'Suf = yün. Zahidlerin giysisi.',
    successMsg:'> MANEVİYAT YÜCELDI.',
  },
  {
    category:'İslam',
    lines:['> ZİKİR:','','  "Allah\'ı anmak, O\'nu hatırlamak","   anlamına gelen ibadet formu?"'],
    prompt:'Cevap > ', answer:'zikir',
    hint:'\"Kalpler ancak Allah\'ın zikriyle huzur bulur.\" (Ra\'d,28)',
    successMsg:'> KALP HUZURU.',
  },
  // ── Dua ve Hikmet ────────────────────────────────────────────
  {
    category:'İslam',
    lines:['> DUA:','','  "\"Dua ibadetin özüdür\" buyuran","   Peygamberimiz (s.a.v.) duayı","   nasıl tanımlamaktadır?"'],
    prompt:'Cevap > ', answer:'ibadet',
    hint:'En yüce ibadet Allah\'a yalvarmaktır.',
    successMsg:'> KAPILAR AÇILIR.',
  },
  {
    category:'İslam',
    lines:['> TEVEKKüL:','','  "\"Allah\'a dayanıp güvenmek\" ve","   \"gerekeni yaptıktan sonra","   sonucu Allah\'a bırakmak\"","   kavramı nedir?"'],
    prompt:'Cevap > ', answer:'tevekkül',
    hint:'\"Kim Allah\'a tevekkül ederse O ona yeter.\" (Talak,3)',
    successMsg:'> GÜVEN TAM.',
  },
  {
    category:'İslam',
    lines:['> BİSMİLLAH:','','  "Müslümanların her işe başlarken","   söylediği \"Bismillahirrahmanirrahim\"","   kaç harften oluşur?"'],
    prompt:'Sayı gir > ', answer:'19',
    hint:'Besmele\'nin Arapça harf sayısı.',
    successMsg:'> BEREKETİ FARK EDİLDİ.',
  },
  {
    category:'İslam',
    lines:['> EL-FATIHA:','','  "\"Hamd alemlerin Rabbi Allah\'adır.\"","   Bu ayet Fatiha suresinin","   kaçıncı ayetidir?"'],
    prompt:'Sayı gir > ', answer:'2',
    hint:'Birinci ayet Besmele\'dir.',
    successMsg:'> HAMD O\'NA.',
  },
  {
    category:'İslam',
    lines:['> İFFET:','','  "İslam\'da bedenin ve ruhun","   temizliğini, iffetini korumanın","   önemi neden büyüktür?"'],
    prompt:'Cevap > ', answer:'haya',
    hint:'\"Haya imandan bir şubedir.\"',
    successMsg:'> HAYA KALKAN.',
  },
  // ── Ekonomi ve İslam ─────────────────────────────────────────
  {
    category:'İslam',
    lines:['> FAİZ YASAĞI:','','  "Kur\'an ve sünnette kesinlikle","   yasaklanan ve toplumsal","   dengesizliğe yol açan","   ekonomik kavram nedir?"'],
    prompt:'Cevap > ', answer:'faiz',
    hint:'\"Riba\" Arapçada faiz demektir.',
    successMsg:'> ADIL EKONOMİ.',
  },
  {
    category:'İslam',
    lines:['> SADAKA:','','  "\"Sadaka vermek serveti azaltmaz\"","   buyuran Peygamberimiz (s.a.v.)","   hangi erdemi teşvik etmektedir?"'],
    prompt:'Cevap > ', answer:'cömertlik',
    hint:'\"Veren el alan elden üstündür.\"',
    successMsg:'> BEREKET ARTAR.',
  },
  {
    category:'İslam',
    lines:['> VAKIf:','','  "Allah için mal bağışlamak","   anlamına gelen ve İslam","   medeniyetinde büyük sosyal","   hizmetler sunan kurum nedir?"'],
    prompt:'Cevap > ', answer:'vakıf',
    hint:'Camiler, medreseler, çeşmeler vakıflarla yapıldı.',
    successMsg:'> HAYIR DEVAM EDER.',
  },
  // ── Sahabeler ───────────────────────────────────────────────
  {
    category:'İslam',
    lines:['> EBU BEKIR:','','  "Hz. Muhammed\'in (s.a.v.) en yakın","   dostu ve ilk halifesi olan","   sahabenin adı nedir?"'],
    prompt:'Cevap > ', answer:'ebubekir',
    hint:'Es-Sıddık — doğrulayan anlamında.',
    successMsg:'> VEFADaR DOST.',
  },
  {
    category:'İslam',
    lines:['> HZ. ÖMER:','','  "\"Adaletin simgesi\" olarak bilinen","   ve pek çok reformu hayata","   geçiren ikinci halife kimdir?"'],
    prompt:'Cevap > ', answer:'ömer',
    hint:'El-Faruk — hak ile batılı ayıran.',
    successMsg:'> ADALET TIMSALI.',
  },
  {
    category:'İslam',
    lines:['> HZ. ALİ:','','  "Hz. Muhammed\'in (s.a.v.) amcazadesi","   ve damadı olan, bilgeliğiyle","   tanınan dördüncü halife kimdir?"'],
    prompt:'Cevap > ', answer:'ali',
    hint:'\"Kerremallahu vechehu.\" İlmin kapısı.',
    successMsg:'> İLMİN KAPISINDAN GEÇ.',
  },
  {
    category:'İslam',
    lines:['> HATICE:','','  "Hz. Muhammed\'e (s.a.v.) ilk iman","   eden ve ilk eşi olan Müminlerin","   annesi kimdir?"'],
    prompt:'Cevap > ', answer:'hatice',
    hint:'\"Cennetin dört büyük kadınından biri.\"',
    successMsg:'> İLK MÜMİN.',
  },
  {
    category:'İslam',
    lines:['> AİŞE:','','  "Hz. Muhammed\'in (s.a.v.) eşi ve","   hadis ilminin en önemli","   kaynaklarından biri olan","   Müminlerin annesi kimdir?"'],
    prompt:'Cevap > ', answer:'aişe',
    hint:'Pek çok hadisi bizzat rivayet etti.',
    successMsg:'> HAFIZA VE ALIM.',
  },
  // ── İslam\'da Çevre ─────────────────────────────────────────
  {
    category:'İslam',
    lines:['> HALIFETULLAH:','','  "İslam\'a göre insan yeryüzünde","   Allah\'ın halifesidir. Bu,","   insana hangi sorumluluğu verir?"'],
    prompt:'Cevap > ', answer:'emanet',
    hint:'Dünyayı korumak, çevreye saygı.',
    successMsg:'> EMATEt KORUNMALI.',
  },
  {
    category:'İslam',
    lines:['> SU HAKI:','','  "Hz. Peygamber (s.a.v.) abdest alırken","   bile suyu israf etmemeyi öğütledi.","   Bu hangi prensibi yansıtır?"'],
    prompt:'Cevap > ', answer:'israftan kaçınmak',
    hint:'\"Allah israf edenleri sevmez.\" (A\'raf,31)',
    successMsg:'> DOĞA EMANET.',
  },
  // ── Kıyamet ve Ahiret ───────────────────────────────────────
  {
    category:'İslam',
    lines:['> AHİRET:','','  "İslam\'a göre ölüm sonrası","   yaşamın olduğu aleme ne denir?"'],
    prompt:'Cevap > ', answer:'ahiret',
    hint:'Dünya geçici, ahiret kalıcıdır.',
    successMsg:'> GERÇEK HAYAT.',
  },
  {
    category:'İslam',
    lines:['> CENNET:','','  "Kur\'an\'da cenneti tarif eden","   ayet sayısı yüzün üzerindedir.","   Cennette ırmaklar neyle akar?"'],
    prompt:'Cevap > ', answer:'süt, bal, su, şarap',
    hint:'Muhammed 47. sure, 15. ayet.',
    successMsg:'> CENNET TASVIR EDİLDİ.',
  },
  {
    category:'İslam',
    lines:['> MİZAN:','','  "Kıyamette amellerin tartılacağı","   teraziye İslam\'da ne denir?"'],
    prompt:'Cevap > ', answer:'mizan',
    hint:'En küçük iyi ve kötü tartılır.',
    successMsg:'> HESAP VERİLECEK.',
  },
  // ── Dini Bayramlar ve Özel Geceler ───────────────────────────
  {
    category:'İslam',
    lines:['> MİRAÇ:','','  "Hz. Muhammed\'in (s.a.v.) Allah\'ın","   huzuruna yükseldiği","   mucizevi yolculuğun adı nedir?"'],
    prompt:'Cevap > ', answer:'miraç',
    hint:'Recep ayının 27\'si. Beş vakit namaz farz kılındı.',
    successMsg:'> GÖĞÜN KAPIlari AÇILDI.',
  },
  {
    category:'İslam',
    lines:['> REGAİP:','','  "Üç ayların başlangıcını simgeleyen","   ve Recep ayının ilk Cuma","   gecesine ne ad verilir?"'],
    prompt:'Cevap > ', answer:'regaip',
    hint:'Regaib = lütuflar, ihsanlar.',
    successMsg:'> RAHMET YAĞDI.',
  },
  {
    category:'İslam',
    lines:['> BERAAt:','','  "\"Günahların affedildiği gece\"","   olarak bilinen Şaban ayının","   15. gecesinin adı nedir?"'],
    prompt:'Cevap > ', answer:'berat gecesi',
    hint:'Berat = beraat, temize çıkmak.',
    successMsg:'> BERAAT YAZILDI.',
  },
  // ── İslam ve Hoşgörü ────────────────────────────────────────
  {
    category:'İslam',
    lines:['> DİNDE ZORLAMA YOK:','','  "\"Dinde zorlama yoktur\" buyuran","   ayet Kur\'an\'ın hangi suresindedir?"'],
    prompt:'Cevap > ', answer:'bakara',
    hint:'Bakara 256. Ayet.',
    successMsg:'> ÖZGÜRLÜK TESCIL.',
  },
  {
    category:'İslam',
    lines:['> EHL-İ KİTAP:','','  "İslam\'ın Yahudilere ve","   Hristiyanlara verdiği özel isim nedir?"'],
    prompt:'Cevap > ', answer:'ehl-i kitap',
    hint:'İlahi kitap sahibi anlamında.',
    successMsg:'> DIYALOG KAPISI AÇIK.',
  },
  {
    category:'İslam',
    lines:['> MEDINE VESIKASI:','','  "Hz. Peygamber\'in (s.a.v.) 622\'de","   farklı din mensuplarıyla","   imzaladığı insanlık tarihi","   belgesi nedir?"'],
    prompt:'Cevap > ', answer:'medine vesikası',
    hint:'Dünyanın ilk yazılı anayasası sayılır.',
    successMsg:'> ANAYASA YAZILDI.',
  },
  // ── Müslüman Düşünürler ─────────────────────────────────────
  {
    category:'İslam',
    lines:['> GAZALİ:','','  "\"İhyau Ulumiddin\" adlı eseriyle","   İslam\'ı sistematik olarak","   anlatan büyük alim kimdir?"'],
    prompt:'Cevap > ', answer:'gazali',
    hint:'\"Hüccetelislam\" lakabıyla anılır.',
    successMsg:'> İHYA EDİLDİ.',
  },
  {
    category:'İslam',
    lines:['> FARABİ:','','  "\"El-Medinetü\'l Fazıla\"","   adlı eseriyle ideal toplumu","   anlatan İslam filozofu kimdir?"'],
    prompt:'Cevap > ', answer:'farabi',
    hint:'\"Muallim-i Sani\" - İkinci Öğretmen.',
    successMsg:'> FELSEFE DERINLEŞTI.',
  },
  {
    category:'İslam',
    lines:['> RAZİ:','','  "Kimya biliminin öncüsü sayılan","   ve sulfürik asidi keşfeden","   Müslüman alim kimdir?"'],
    prompt:'Cevap > ', answer:'razi',
    hint:'Ebu Bekir el-Razi. Latin adı: Rhazes.',
    successMsg:'> KİMYANIN BABASI.',
  },
  // ── İslam\'ın Evrensel Mesajı ─────────────────────────────────
  {
    category:'İslam',
    lines:['> EŞİTLİK:','','  "\"Arap\'ın Acem\'e, Acem\'in Arap\'a","   beyazın siyaha, siyahın beyaza","   üstünlüğü yoktur.\"","   Veda Hutbesi\'nden alınan bu","   sözler hangi değeri vurgular?"'],
    prompt:'Cevap > ', answer:'eşitlik',
    hint:'İslam ırkçılığı reddeder.',
    successMsg:'> ÜSTÜNLÜK YALNIZCA TAKVADA.',
  },
  {
    category:'İslam',
    lines:['> EVRENSEL MESAJ:','','  "Kur\'an Müslümanları değil,","   tüm insanlığı hitap ederek","   ne diye çağırır?"'],
    prompt:'Cevap > ', answer:'ey insanlar',
    hint:'\"Yâ eyyühen-nâs\" = Ey insanlar.',
    successMsg:'> MESAJ HERKESE.',
  },
  {
    category:'İslam',
    lines:['> MERHAMETİN GENİŞLİĞİ:','','  "\"Tüm insanlığa rahmet için","   gönderildim.\" diyen Peygamber","   (s.a.v.) İslam\'ın hangi","   boyutunu vurgular?"'],
    prompt:'Cevap > ', answer:'evrensel rahmet',
    hint:'\"Rahmeten lil alemin\" (Enbiya, 107)',
    successMsg:'> RAHMET COŞAR.',
  },
  {
    category:'İslam',
    lines:['> KARDEŞLİK:','','  "\"Müminler kardeştir.\"","   Bu ayet hangi surede geçer?"'],
    prompt:'Cevap > ', answer:'hucurat',
    hint:'Hucurat 10. ayet.',
    successMsg:'> KARDEŞLIK BAĞLANDI.',
  },
  {
    category:'İslam',
    lines:['> İNSAN ONURU:','','  "\"Biz Adem oğullarını şerefli kıldık.\"","   Bu ayet insana verilen onurun","   kaynağını anlatır. Hangi surede?"'],
    prompt:'Cevap > ', answer:'isra',
    hint:'İsra Suresi 70. ayet.',
    successMsg:'> ONUR TESCIL.',
  },
]

// ════════════════════════════════════════════════════════════════
//  OSMANLI TARİHİ — Bilgilendirici sorular
// ════════════════════════════════════════════════════════════════
const OSMANLI: Puzzle[] = [
  {
    category:'Osmanlı',
    lines:['> OSMANLI ARŞİVİ:','','  "Osmanlı Devleti\'nin kurucusu kimdir?"'],
    prompt:'Cevap > ', answer:'osman gazi',
    hint:'1299. Söğüt\'ten dünyaya açılan devlet.',
    successMsg:'> KURUCU TANIMLANDI.',
  },
  {
    category:'Osmanlı',
    lines:['> FATİH:','','  "1453\'te İstanbul\'u fetheden","   Osmanlı padişahı kimdir?"'],
    prompt:'Cevap > ', answer:'fatih sultan mehmed',
    hint:'21 yaşında. Roma\'nın sonu, yeni çağın başı.',
    successMsg:'> FETİH TESCIL EDİLDİ.',
  },
  {
    category:'Osmanlı',
    lines:['> TOPKAPI:','','  "Fatih Sultan Mehmed tarafından","   yaptırılan ve 400 yıl Osmanlı\'ya","   başkentlik yapan saray nedir?"'],
    prompt:'Cevap > ', answer:'topkapı sarayı',
    hint:'İstanbul, Sarayburnu. Bugün müze.',
    successMsg:'> SARAY KAPILARIDA AÇILDI.',
  },
  {
    category:'Osmanlı',
    lines:['> KANUNİ:','','  "\"Muhteşem\" lakabıyla da anılan","   ve Osmanlı\'nın altın çağını","   yaşatan padişah kimdir?"'],
    prompt:'Cevap > ', answer:'kanuni sultan süleyman',
    hint:'1520-1566. Süleymaniye Camii.',
    successMsg:'> KANUN YAZILDI.',
  },
  {
    category:'Osmanlı',
    lines:['> MİMAR SİNAN:','','  "Osmanlı\'nın yetiştirdiği","   dünyanın en büyük","   mimarlarından biri kimdir?"'],
    prompt:'Cevap > ', answer:'mimar sinan',
    hint:'375+ eser. Süleymaniye ve Selimiye.',
    successMsg:'> TAŞLAR YERLİ YERİNDE.',
  },
  {
    category:'Osmanlı',
    lines:['> OSMANLI EĞİTİM:','','  "Osmanlı\'da yüksek öğretim","   kurumlarına ne ad verilirdi?"'],
    prompt:'Cevap > ', answer:'medrese',
    hint:'İlahiyat, hukuk, matematik, astronomi öğretildi.',
    successMsg:'> EĞİTİME DEVEt.',
  },
  {
    category:'Osmanlı',
    lines:['> YENİÇERİ:','','  "Osmanlı\'nın seçkin piyade","   kuvvetinin adı nedir?"'],
    prompt:'Cevap > ', answer:'yeniçeri',
    hint:'Devşirme sistemiyle oluşturuldu.',
    successMsg:'> ORDU TANIMLANDI.',
  },
  {
    category:'Osmanlı',
    lines:['> SÜLEYMAN KANUNNAMESİ:','','  "Kanuni Sultan Süleyman\'ın","   oluşturduğu kapsamlı hukuk","   sistemine ne denir?"'],
    prompt:'Cevap > ', answer:'kanunname',
    hint:'İslam hukukuna dayanır ama uygulamayı sistematikleştirir.',
    successMsg:'> KANUN HEPSİNE EŞİT.',
  },
  {
    category:'Osmanlı',
    lines:['> DİVAN-I HÜMAYUN:','','  "Osmanlı devletinde en yüksek","   idari ve yargısal organ","   neydi?"'],
    prompt:'Cevap > ', answer:'divan-ı hümayun',
    hint:'Padişah adına sadrazam başkanlık ederdi.',
    successMsg:'> DEVLET YÖNETİLDİ.',
  },
  {
    category:'Osmanlı',
    lines:['> YAVUZ:','','  "Mısır\'ı fethederek halifeliği","   Osmanlı\'ya taşıyan padişah kimdir?"'],
    prompt:'Cevap > ', answer:'yavuz sultan selim',
    hint:'1517. \"Selim-i Evvel.\"',
    successMsg:'> HİLAFET DEVR ALINDI.',
  },
  {
    category:'Osmanlı',
    lines:['> HAYIRLI İŞLER:','','  "Osmanlı döneminde hayır işlerini","   yürütmek için kurulan","   sosyal kurumlar nelerdir?"'],
    prompt:'Cevap > ', answer:'vakıf',
    hint:'İmaret, cami, medrese, hastane hepsi vakıf.',
    successMsg:'> HAYIR YAŞATIR.',
  },
  {
    category:'Osmanlı',
    lines:['> HAREM:','','  "Osmanlı sarayında padişahın","   ailesi ve eğitim sisteminin","   bulunduğu özel bölüme ne denir?"'],
    prompt:'Cevap > ', answer:'harem',
    hint:'\"Kutsal, girilmez yer\" anlamında.',
    successMsg:'> ÖZEL ALAN.',
  },
  {
    category:'Osmanlı',
    lines:['> ÇÖKÜŞ:','','  "Osmanlı Devleti resmen hangi","   yılda sona erdi?"'],
    prompt:'Yıl > ', answer:'1922',
    hint:'Saltanat kaldırıldı. Cumhuriyet 1923.',
    successMsg:'> TARİHİN SAYFASI DÖNDÜ.',
  },
  {
    category:'Osmanlı',
    lines:['> TANZIMAT:','','  "1839\'da ilan edilen ve Osmanlı\'da","   modernleşme sürecini başlatan","   ferman nedir?"'],
    prompt:'Cevap > ', answer:'tanzimat',
    hint:'Gülhane Hattı-ı Hümayunu.',
    successMsg:'> YENİ DÖNEM AÇILDI.',
  },
  {
    category:'Osmanlı',
    lines:['> MÜHTREŞEM YÜZYIL:','','  "Osmanlı tarihinde 16. yüzyıl","   neden \"altın çağ\" olarak","   adlandırılır? (1 kelime)"'],
    prompt:'Cevap > ', answer:'güç',
    hint:'Toprak, bilim, sanat, ekonomi zirvede.',
    successMsg:'> ZİRVE YAŞANDI.',
  },
  {
    category:'Osmanlı',
    lines:['> DOLMABAHÇE:','','  "Son Osmanlı padişahlarının","   kullandığı saray İstanbul\'un","   hangi semtindedir?"'],
    prompt:'Cevap > ', answer:'beşiktaş',
    hint:'Boğaz kıyısında. 1856\'da tamamlandı.',
    successMsg:'> SON SARAY.',
  },
  {
    category:'Osmanlı',
    lines:['> PREVEZe:','','  "1538\'de Osmanlı donanmasının","   Haçlı kuvvetlerine karşı","   kazandığı deniz zaferi nedir?"'],
    prompt:'Cevap > ', answer:'preveze',
    hint:'Barbaros Hayreddin Paşa komutasında.',
    successMsg:'> DENİZLER FETHEDİLDİ.',
  },
  {
    category:'Osmanlı',
    lines:['> EYALET SİSTEMİ:','','  "Osmanlı\'nın geniş topraklarını","   yönetmek için kullandığı","   idari birimlere ne denir?"'],
    prompt:'Cevap > ', answer:'eyalet',
    hint:'Beylerbeyiler yönetirdi.',
    successMsg:'> DÜZEN KURULDU.',
  },
]

// ════════════════════════════════════════════════════════════════
//  BERGAMA — Tarihin derinliklerinden sorular
// ════════════════════════════════════════════════════════════════
const BERGAMA: Puzzle[] = [
  {
    category:'Bergama',
    lines:['> BERGAMA ARŞİVİ:','','  "Bergama antik şehri Türkiye\'nin","   hangi ilinde yer alır?"'],
    prompt:'Cevap > ', answer:'izmir',
    hint:'Ege kıyısına yakın.',
    successMsg:'> KONUM BELİRLENDİ.',
  },
  {
    category:'Bergama',
    lines:['> PERGAMONi:','','  "Bergama\'nın antik çağdaki","   adı nedir?"'],
    prompt:'Cevap > ', answer:'pergamon',
    hint:'Ya da Pergamum. Roma kaynaklarında.',
    successMsg:'> ANTİK İSİM TESCİL.',
  },
  {
    category:'Bergama',
    lines:['> BERGAMA ZİRVESİ:','','  "Bergama antik tiyatrosu","   dünyanın en dik","   tiyatrolarından biridir.","   Kaç kişilik kapasitesi var?"'],
    prompt:'Sayı gir > ', answer:'10000',
    hint:'Yaklaşık 10.000 seyirci.',
    successMsg:'> SAHNE DOLU.',
  },
  {
    category:'Bergama',
    lines:['> PARŞÖMen:','','  "İskenderiye\'nin Mısır\'ı ambargo","   altına almasından sonra","   Bergama\'da geliştirilen","   yazı malzemesi nedir?"'],
    prompt:'Cevap > ', answer:'parşömen',
    hint:'Hayvan derisi. \"Pergament\" - Bergama\'dan.',
    successMsg:'> KİTAP DEVRİMİ.',
  },
  {
    category:'Bergama',
    lines:['> BERGAMA KÜTÜPHANESİ:','','  "Antik çağın İskenderiye\'den","   sonra ikinci büyük kütüphanesi","   neredeydi?"'],
    prompt:'Cevap > ', answer:'bergama',
    hint:'200.000 cilt. Kleopatra İskenderiye\'ye taşıdı.',
    successMsg:'> BİLGİ HAZİNESİ.',
  },
  {
    category:'Bergama',
    lines:['> ZEYTİNYAĞI:','','  "Bergama bölgesi Türkiye\'nin","   en önemli üreticilerinden","   biri olduğu ürün nedir?"'],
    prompt:'Cevap > ', answer:'zeytinyağı',
    hint:'Ege\'nin altın sıvısı.',
    successMsg:'> ALTIN MEYVE.',
  },
  {
    category:'Bergama',
    lines:['> SERAPION TAPINAĞI:','','  "Bergama\'daki büyük tapinak","   kompleksine Osmanlı dönemi","   halk ne demekteydi?"'],
    prompt:'Cevap > ', answer:'kızıl avlu',
    hint:'Tuğlaların rengi yüzünden.',
    successMsg:'> KIZIL ZAMANLAR.',
  },
  {
    category:'Bergama',
    lines:['> UNESCO:','','  "Bergama Çok Katmanlı Kültürel","   Peyzajı hangi yıl UNESCO","   Dünya Mirası oldu?"'],
    prompt:'Yıl > ', answer:'2014',
    hint:'38. oturumda kabul edildi.',
    successMsg:'> MIRAS KORUMA ALTINDA.',
  },
  {
    category:'Bergama',
    lines:['> HEKİMLER ŞEHRİ:','','  "Antik çağda Bergama\'da doğan","   ve Roma İmparatoru\'nun da","   hekimi olan ünlü tabip kimdir?"'],
    prompt:'Cevap > ', answer:'galen',
    hint:'Claudius Galenus. Tıbbın babalarından.',
    successMsg:'> ŞIFA ŞEHRI.',
  },
  {
    category:'Bergama',
    lines:['> BERGAMA HALISI:','','  "Bergama yöresine özgü,","   kalın ve sık dokunmuş","   halı stili hangi şehrin","   adıyla anılır?"'],
    prompt:'Cevap > ', answer:'bergama',
    hint:'Geometrik motifler, kırmızı-lacivert.',
    successMsg:'> SANATIN İZİ.',
  },
]

// ════════════════════════════════════════════════════════════════
//  UNESCO DÜNYA MİRASLARI
// ════════════════════════════════════════════════════════════════
const UNESCO: Puzzle[] = [
  {
    category:'UNESCO',
    lines:['> DÜNYA MİRASI:','','  "UNESCO Dünya Mirası listesi","   hangi yıl oluşturuldu?"'],
    prompt:'Yıl > ', answer:'1972',
    hint:'Paris\'te imzalanan Dünya Mirası Sözleşmesi.',
    successMsg:'> KORUMA BAŞLADI.',
  },
  {
    category:'UNESCO',
    lines:['> TÜRKIYE\'DEN:','','  "İstanbul\'un tarihi yarımadası","   hangi yılda UNESCO listesine girdi?"'],
    prompt:'Yıl > ', answer:'1985',
    hint:'Ayasofya, Topkapı, Sultanahmet...',
    successMsg:'> TARİH KORUNUYOR.',
  },
  {
    category:'UNESCO',
    lines:['> PAMUKKALE:','','  "\"Beyaz kale\" anlamına gelen","   Pamukkale hangi antik şehirle","   birlikte UNESCO listesinde yer alır?"'],
    prompt:'Cevap > ', answer:'hierapolis',
    hint:'Denizli\'de. Termal sular.',
    successMsg:'> BEYAZ HARIKALI.',
  },
  {
    category:'UNESCO',
    lines:['> EFES:','','  "Antik Efes şehri hangi yılda","   UNESCO listesine girdi?"'],
    prompt:'Yıl > ', answer:'2015',
    hint:'İzmir\'e yakın. Artemis Tapınağı.',
    successMsg:'> EFES ÖLÜMSÜZ.',
  },
  {
    category:'UNESCO',
    lines:['> GÖREME:','','  "Kapadokya\'daki peri bacaları","   ve yer altı şehirleri","   hangi ülkededir?"'],
    prompt:'Cevap > ', answer:'türkiye',
    hint:'Nevşehir, Niğde. 1985\'ten beri listede.',
    successMsg:'> PERİ BACALARI.',
  },
  {
    category:'UNESCO',
    lines:['> ÇATALHÖYÜK:','','  "Dünyanın bilinen en eski","   şehirleşme örneklerinden","   Çatalhöyük hangi ilimizde?"'],
    prompt:'Cevap > ', answer:'konya',
    hint:'MÖ 7500-5700. 2012\'de UNESCO listesinde.',
    successMsg:'> İNSANLIĞIN KÖKLERİ.',
  },
  {
    category:'UNESCO',
    lines:['> TROİ:','','  "Homeros\'un İlyada destanına","   konu olan efsanevi şehir","   Türkiye\'nin hangi ilinde?"'],
    prompt:'Cevap > ', answer:'çanakkale',
    hint:'1998\'de UNESCO listesine girdi.',
    successMsg:'> EFSANELERİN ŞEHRİ.',
  },
  {
    category:'UNESCO',
    lines:['> MACHU PICCHU:','','  "İnka uygarlığına ait olan","   ve \"Bulutların Üzerindeki Şehir\"","   olarak bilinen alan hangi","   ülkededir?"'],
    prompt:'Cevap > ', answer:'peru',
    hint:'And Dağları. 1983\'te UNESCO listesinde.',
    successMsg:'> BULUTLARIN ŞEHRİ.',
  },
  {
    category:'UNESCO',
    lines:['> PETRA:','','  "\"Kaya şehri\" olarak bilinen","   ve kayalara oyulmuş yapılarıyla","   ünlü bu miras alanı","   hangi ülkededir?"'],
    prompt:'Cevap > ', answer:'ürdün',
    hint:'Nabatean krallığı. 1985 UNESCO.',
    successMsg:'> KAYA İÇİNDE YAŞAM.',
  },
  {
    category:'UNESCO',
    lines:['> BÜYÜK SET DUVARI:','','  "Dünyanın en uzun savunma","   yapısı olarak bilinen UNESCO","   mirası hangi ülkededir?"'],
    prompt:'Cevap > ', answer:'çin',
    hint:'21.196 km. Han Surları dahil.',
    successMsg:'> BÜYÜK DUVAR.',
  },
  {
    category:'UNESCO',
    lines:['> VENEDIK:','','  "Kanalları ve gotik yapılarıyla","   ünlü bu İtalyan şehri","   ne zaman UNESCO listesine girdi?"'],
    prompt:'Yıl > ', answer:'1987',
    hint:'Su şehri. Lagün üzerinde.',
    successMsg:'> SU ÜZERİNDE TARİH.',
  },
  {
    category:'UNESCO',
    lines:['> BOZCAADA:','','  "Türkiye\'nin Ege\'deki incisi","   Bozcaada (Tenedos) hangi","   özelliğiyle korunma altındadır?"'],
    prompt:'Cevap > ', answer:'kültürel peyzaj',
    hint:'Bağları, rüzgar değirmenleri, tarihi dokusu.',
    successMsg:'> BAĞLAR VE RÜZGAR.',
  },
]

// ════════════════════════════════════════════════════════════════
//  SPOR
// ════════════════════════════════════════════════════════════════
const SPOR: Puzzle[] = [
  {
    category:'Spor',
    lines:['> FIFA:','','  "FIFA Dünya Kupası en çok","   kez hangi ülke kazandı?"'],
    prompt:'Cevap > ', answer:'brezilya',
    hint:'5 kez şampiyon. Pele.',
    successMsg:'> SAMBA FUTBOLU.',
  },
  {
    category:'Spor',
    lines:['> OLIMPIYAT:','','  "Modern Olimpiyat Oyunları","   hangi şehirde başladı?"'],
    prompt:'Cevap > ', answer:'atina',
    hint:'1896. Yunanistan.',
    successMsg:'> MEŞALe YANDI.',
  },
  {
    category:'Spor',
    lines:['> REKORTMEN:','','  "Olimpiyat tarihinin en çok","   altın madalya kazanan sporcusu","   Michael Phelps hangi sporu yapar?"'],
    prompt:'Cevap > ', answer:'yüzme',
    hint:'23 olimpiyat altını.',
    successMsg:'> HAVUZ EFSANE.',
  },
  {
    category:'Spor',
    lines:['> TENIS:','','  "Wimbledon\'ı en çok kez","   kazanan erkek tenisçi kimdir?"'],
    prompt:'Cevap > ', answer:'novak djokovic',
    hint:'7+ kez Wimbledon şampiyonu.',
    successMsg:'> ÇIMENDE KRAL.',
  },
  {
    category:'Spor',
    lines:['> FORMULA 1:','','  "F1\'de en çok dünya şampiyonluğu","   kazanan pilot kimdir?"'],
    prompt:'Cevap > ', answer:'lewis hamilton',
    hint:'7 kez şampiyon. Mercedes.',
    successMsg:'> PISTI GEÇTI.',
  },
  {
    category:'Spor',
    lines:['> BASKETBOL:','','  "NBA\'de en fazla şampiyonluk","   kazanan takım hangisidir?"'],
    prompt:'Cevap > ', answer:'boston celtics',
    hint:'17+ şampiyonluk.',
    successMsg:'> PARKE EFSANESİ.',
  },
  {
    category:'Spor',
    lines:['> FUTBOL EFSANESİ:','','  "\"Asrın futbolcusu\" seçilen","   ve brezilya\'nın simgesi","   olan futbolcu kimdir?"'],
    prompt:'Cevap > ', answer:'pele',
    hint:'3 Dünya Kupası. Santos, Cosmos.',
    successMsg:'> KRAL.',
  },
  {
    category:'Spor',
    lines:['> KRİKET:','','  "Kriket sporunun anayurdu","   hangi ülkedir?"'],
    prompt:'Cevap > ', answer:'ingiltere',
    hint:'Lord\'s Cricket Ground. Londra.',
    successMsg:'> SPOR TARİHİ.',
  },
  {
    category:'Spor',
    lines:['> BOKS:','','  "\"En Büyüğüm\" diyen ve","   spor tarihinin en ikonik","   boksörü kimdir?"'],
    prompt:'Cevap > ', answer:'muhammad ali',
    hint:'Cassius Clay. 3 kez dünya şampiyonu.',
    successMsg:'> BOKS EFSANESİ.',
  },
  {
    category:'Spor',
    lines:['> TÜRK GÜREŞI:','','  "Osmanlı\'dan bu yana süregelen","   ve UNESCO\'da yer alan","   Türk güreş geleneği nedir?"'],
    prompt:'Cevap > ', answer:'yağlı güreş',
    hint:'Kırkpınar. 1360\'tan beri yapılıyor.',
    successMsg:'> PEHLIVANLAR RINGE.',
  },
  {
    category:'Spor',
    lines:['> GALATASARAY:','','  "Galatasaray hangi yıl","   UEFA Kupasını kazandı?"'],
    prompt:'Yıl > ', answer:'2000',
    hint:'Şanslar şehri Kopenhag. Romantsev\'e karşı.',
    successMsg:'> ŞAMPIYONLAR.',
  },
  {
    category:'Spor',
    lines:['> ATLETIZM:','','  "100 metreyi en hızlı koşan","   insanın adı nedir?"'],
    prompt:'Cevap > ', answer:'usain bolt',
    hint:'9.58 saniye. Jamaika.',
    successMsg:'> IŞIKTAN HIZLI.',
  },
  {
    category:'Spor',
    lines:['> RUGBY:','','  "Rugby Dünya Kupası\'nı","   en fazla kazanan ülke hangisidir?"'],
    prompt:'Cevap > ', answer:'yeni zelanda',
    hint:'All Blacks. Haka dansı.',
    successMsg:'> HAKA YÜKSELDI.',
  },
  {
    category:'Spor',
    lines:['> GOLF:','','  "Tarihte en genç yaşta","   golf major\'ı kazanan","   isim kimdir?"'],
    prompt:'Cevap > ', answer:'tiger woods',
    hint:'1997 Masters\'ta 21 yaşında.',
    successMsg:'> DEHA TANIMLANDI.',
  },
  {
    category:'Spor',
    lines:['> KYLIAN MBAPPÉ:','','  "Mbappé hangi ülke milli","   takımında oynamaktadır?"'],
    prompt:'Cevap > ', answer:'fransa',
    hint:'2018 Dünya Kupası şampiyonu.',
    successMsg:'> HIZIN ADI.',
  },
]

// ════════════════════════════════════════════════════════════════
//  MÜZİK
// ════════════════════════════════════════════════════════════════
const MUZIK: Puzzle[] = [
  {
    category:'Müzik',
    lines:['> MÜZİK TARİHİ:','','  "Tüm zamanların en çok","   satan albümü hangisidir?"'],
    prompt:'Cevap > ', answer:'thriller',
    hint:'Michael Jackson. 1982. 70M+ kopya.',
    successMsg:'> EFSANE ALBÜM.',
  },
  {
    category:'Müzik',
    lines:['> KLASIK MÜZİK:','','  "9. Senfoni\'yi tamamen sağır","   iken bestelemiş olan","   besteci kimdir?"'],
    prompt:'Cevap > ', answer:'beethoven',
    hint:'Ode to Joy. 1824.',
    successMsg:'> MÜZİĞİN ZİRVESİ.',
  },
  {
    category:'Müzik',
    lines:['> BEATLES:','','  "Beatles grubunun oluştuğu","   şehir hangisidir?"'],
    prompt:'Cevap > ', answer:'liverpool',
    hint:'İngiltere. Cavern Club.',
    successMsg:'> FAB FOUR DOĞDU.',
  },
  {
    category:'Müzik',
    lines:['> COMBİNATİON:','','  "Mozart kaç yaşında","   ilk senfonisini besteledi?"'],
    prompt:'Sayı gir > ', answer:'8',
    hint:'1764. Londra\'da.',
    successMsg:'> DAHI TANINDI.',
  },
  {
    category:'Müzik',
    lines:['> OPERA:','','  "Dünyanın en ünlü opera binası","   olan La Scala hangi","   şehirdedir?"'],
    prompt:'Cevap > ', answer:'milano',
    hint:'İtalya. 1778\'de açıldı.',
    successMsg:'> PERDE AÇILDI.',
  },
  {
    category:'Müzik',
    lines:['> TÜRK MÜZİĞİ:','','  "\"Hicaz\", \"Rast\", \"Uşşak\"","   Türk müziğinde neyi ifade eder?"'],
    prompt:'Cevap > ', answer:'makam',
    hint:'Her makamın kendine özgü duygusu var.',
    successMsg:'> MAKAM TANIMLANDI.',
  },
  {
    category:'Müzik',
    lines:['> SITAR:','','  "Hindistan\'a özgü bu telli","   çalgı aleti Rock müziğine","   kim tarafından taşındı?"'],
    prompt:'Cevap > ', answer:'george harrison',
    hint:'Beatles gitaristi. Ravi Shankar\'dan öğrendi.',
    successMsg:'> DOĞU-BATI KÖPRÜSÜ.',
  },
  {
    category:'Müzik',
    lines:['> CALLAS:','','  "\"Opera\'nın La Divina\'sı\"","   olarak bilinen soprano kimdir?"'],
    prompt:'Cevap > ', answer:'maria callas',
    hint:'Yunan asıllı Amerikalı. 20. yüzyılın sesi.',
    successMsg:'> İLAHİ SES.',
  },
  {
    category:'Müzik',
    lines:['> BAĞLAMA:','','  "Türk halk müziğinin","   vazgeçilmez çalgısı nedir?"'],
    prompt:'Cevap > ', answer:'bağlama',
    hint:'Saz olarak da bilinir.',
    successMsg:'> SESİ DUYULDU.',
  },
  {
    category:'Müzik',
    lines:['> JAZZ:','','  "Jazz müziğinin anavatanı","   sayılan Amerikan şehri nedir?"'],
    prompt:'Cevap > ', answer:'new orleans',
    hint:'Louisiana. 20. yüzyılın başı.',
    successMsg:'> CAZ DOĞDU.',
  },
  {
    category:'Müzik',
    lines:['> QUEEN:','','  "Queen grubunun solisti","   olan ve tarihin en büyük","   sahne performansçılarından","   biri kabul edilen kimdir?"'],
    prompt:'Cevap > ', answer:'freddie mercury',
    hint:'1985 Live Aid. We Will Rock You.',
    successMsg:'> ŞOVMAN.',
  },
  {
    category:'Müzik',
    lines:['> TÜRKÜ:','','  "\"Uzun İnce Bir Yoldayım\"","   adlı türkü kime aittir?"'],
    prompt:'Cevap > ', answer:'aşık veysel',
    hint:'Sivas\'lı. Türk halk şiirinin zirvesi.',
    successMsg:'> YOL UZUN.',
  },
]

// ════════════════════════════════════════════════════════════════
//  TARİH
// ════════════════════════════════════════════════════════════════
const TARIH: Puzzle[] = [
  {
    category:'Tarih',
    lines:['> BÜYÜK İSKENDER:','','  "Makedonyalı İskender","   hangi yaşta öldü?"'],
    prompt:'Sayı gir > ', answer:'32',
    hint:'Babil\'de. MÖ 323.',
    successMsg:'> GENÇ KRAL.',
  },
  {
    category:'Tarih',
    lines:['> ROMA:','','  "Roma İmparatorluğu\'nun","   doğu yarısı ne zaman","   yıkıldı?"'],
    prompt:'Yıl > ', answer:'1453',
    hint:'İstanbul\'un fethi ile.',
    successMsg:'> DOĞU ROMA SONA ERDİ.',
  },
  {
    category:'Tarih',
    lines:['> FRANSIZ DEVRİMİ:','','  "Fransız Devrimi hangi yıl","   başladı?"'],
    prompt:'Yıl > ', answer:'1789',
    hint:'Bastille hapishanesi basıldı.',
    successMsg:'> ÖZGürlük, Eşitlik, Kardeşlik.',
  },
  {
    category:'Tarih',
    lines:['> ATATÜRK:','','  "Türkiye Cumhuriyeti\'nin","   kurucusu kimdir?"'],
    prompt:'Cevap > ', answer:'mustafa kemal atatürk',
    hint:'1923. Ankara.',
    successMsg:'> CUMHURİYET YAŞIYOR.',
  },
  {
    category:'Tarih',
    lines:['> BARIŞ ANTLAŞMASI:','','  "Birinci Dünya Savaşı\'nı","   sona erdiren antlaşma nedir?"'],
    prompt:'Cevap > ', answer:'versay antlaşması',
    hint:'1919. Fransa.',
    successMsg:'> SAVAŞ BİTTİ.',
  },
  {
    category:'Tarih',
    lines:['> RÖNESANS:','','  "Rönesans hareketi","   hangi ülkede başladı?"'],
    prompt:'Cevap > ', answer:'italya',
    hint:'Floransa. Medici ailesi.',
    successMsg:'> YENİDEN DOĞUŞ.',
  },
  {
    category:'Tarih',
    lines:['> SANAYI DEVRİMİ:','','  "Sanayi Devrimi önce","   hangi ülkede yaşandı?"'],
    prompt:'Cevap > ', answer:'ingiltere',
    hint:'18. yüzyıl. Buhar makinesi.',
    successMsg:'> MAKINELER DEVREYE GİRDİ.',
  },
]

// ════════════════════════════════════════════════════════════════
//  BİLİM
// ════════════════════════════════════════════════════════════════
const BILIM: Puzzle[] = [
  {
    category:'Bilim',
    lines:['> GÖRELILIK:','','  "E=mc² formülünü ortaya koyan","   bilim insanı kimdir?"'],
    prompt:'Cevap > ', answer:'einstein',
    hint:'Özel Görelilik Teorisi. 1905.',
    successMsg:'> FORMÜL ÇÖZÜLDÜ.',
  },
  {
    category:'Bilim',
    lines:['> DNA:','','  "DNA\'nın çift sarmal yapısını","   keşfeden bilim insanları kimlerdir?"'],
    prompt:'Cevap > ', answer:'watson ve crick',
    hint:'1953. Nobel Ödülü 1962.',
    successMsg:'> YAŞAM KODU.',
  },
  {
    category:'Bilim',
    lines:['> PERİYODİK TABLO:','','  "Periyodik tabloyu düzenleyen","   Rus kimyacı kimdir?"'],
    prompt:'Cevap > ', answer:'mendeleev',
    hint:'1869. 63 element.',
    successMsg:'> ELEMENtler SIRAYA GİRDİ.',
  },
  {
    category:'Bilim',
    lines:['> EVRIM:','','  "Doğal Seçilim yoluyla Evrim","   teorisini ortaya atan","   bilim insanı kimdir?"'],
    prompt:'Cevap > ', answer:'darwin',
    hint:'\"Türlerin Kökeni\". 1859.',
    successMsg:'> EVRIM ANLAŞILDI.',
  },
  {
    category:'Bilim',
    lines:['> KARA DELİK:','','  "Ilk kara deliğin görüntüsü","   hangi yılda çekildi?"'],
    prompt:'Yıl > ', answer:'2019',
    hint:'M87 galaksisinde. Event Horizon Telescope.',
    successMsg:'> EVREN GÖRÜNtüLENDİ.',
  },
  {
    category:'Bilim',
    lines:['> MARS:','','  "Mars\'a ilk insanlı yolculuk","   hangi onlulda planlanmaktadır?"'],
    prompt:'Cevap > ', answer:'2030lar',
    hint:'NASA ve SpaceX planları.',
    successMsg:'> KIZIL GEZEGEN BEKLİYOR.',
  },
]

// ════════════════════════════════════════════════════════════════
//  MATEMATİK & MANTIK
// ════════════════════════════════════════════════════════════════
const MATEMATIK: Puzzle[] = [
  {
    category:'Matematik',
    lines:['> PI SAYISI:','','  "Pi sayısının ilk üç","   basamağını söyleyin."'],
    prompt:'Cevap > ', answer:'3.14',
    hint:'Çember çevresinin çapa oranı.',
    successMsg:'> ÇEMBERİN SIRRI.',
  },
  {
    category:'Matematik',
    lines:['> ALTIN ORAN:','','  "Doğada ve sanatta yaygın","   olan altın oran yaklaşık","   kaçtır?"'],
    prompt:'Sayı gir > ', answer:'1.618',
    hint:'Phi sembolü. Fibonacci\'den türer.',
    successMsg:'> ALTIN ORAN BULUNDU.',
  },
  {
    category:'Matematik',
    lines:['> ASAL SAYI:','','  "1\'den 10\'a kadar kaç","   asal sayı vardır?"'],
    prompt:'Sayı gir > ', answer:'4',
    hint:'2, 3, 5, 7.',
    successMsg:'> ASAL SAYILAR.',
  },
  {
    category:'Matematik',
    lines:['> PISAGOR:','','  "Dik üçgende a²+b²=c²","   formülü kimin teoremidir?"'],
    prompt:'Cevap > ', answer:'pisagor',
    hint:'Yunan matematikçi. MÖ 570-495.',
    successMsg:'> TEOREM KANNITLANDI.',
  },
  {
    category:'Matematik',
    lines:['> SAYILAR:','','  "Sıfırı matematiğe kazandıran","   ve pozisyonel sayı sistemini","   geliştiren uygarlık hangisidir?"'],
    prompt:'Cevap > ', answer:'hintler',
    hint:'Araplar Avrupa\'ya taşıdı. Hint-Arap rakamları.',
    successMsg:'> SIFIRIN GELİŞİ.',
  },
]

// ════════════════════════════════════════════════════════════════
//  COĞRAFYA
// ════════════════════════════════════════════════════════════════
const COGRAFYA: Puzzle[] = [
  {
    category:'Coğrafya',
    lines:['> EN BÜYÜK OKYANUS:','','  "Yeryüzünün en büyük","   okyanusu hangisidir?"'],
    prompt:'Cevap > ', answer:'büyük okyanus',
    hint:'Pasifik. Dünya yüzeyinin 1/3\'ü.',
    successMsg:'> ENGİN SULAR.',
  },
  {
    category:'Coğrafya',
    lines:['> TÜRKIYE:','','  "Türkiye kaç komşu ülkeyle","   sınır paylaşmaktadır?"'],
    prompt:'Sayı gir > ', answer:'8',
    hint:'Yunanistan, Bulgaristan, Gürcistan, Ermenistan, Azerbaycan, İran, Irak, Suriye.',
    successMsg:'> KOMSULAR SAYILDI.',
  },
  {
    category:'Coğrafya',
    lines:['> EN UZUN NEHIR:','','  "Dünyanın en uzun nehiri","   hangisidir?"'],
    prompt:'Cevap > ', answer:'nil',
    hint:'Afrika. 6650 km.',
    successMsg:'> UZUN YOL.',
  },
  {
    category:'Coğrafya',
    lines:['> AMAZON:','','  "Amazon Ormanları dünyanın","   akciğerleri olarak bilinir.","   Hangi kıtadadır?"'],
    prompt:'Cevap > ', answer:'güney amerika',
    hint:'Brezilya, Kolombiya, Peru.',
    successMsg:'> AKCİĞERLER.',
  },
  {
    category:'Coğrafya',
    lines:['> BOĞAZLAR:','','  "İstanbul Boğazı\'nın","   uzunluğu yaklaşık kaç km\'dir?"'],
    prompt:'Sayı gir > ', answer:'31',
    hint:'Karadeniz ile Marmara\'yı birleştirir.',
    successMsg:'> KÖPRÜ ŞEHRİ.',
  },
]

// ════════════════════════════════════════════════════════════════
//  MANTIK BULMACALARI
// ════════════════════════════════════════════════════════════════
const MANTIK: Puzzle[] = [
  {
    category:'Mantık',
    lines:['> KLAS BULMACA:','','  "Ne kadar çok alırsam","   o kadar çok bırakırım.","   Neyim?"'],
    prompt:'Cevap > ', answer:'ayak izi',
    hint:'Yürüdükçe...',
    successMsg:'> MANTIK TAMAMLANDI.',
  },
  {
    category:'Mantık',
    lines:['> ZAMANi:','','  "Dün hep gelecekte oldu.","   Yarın hep geçmişte oldu.","   Bu gün hiç gelmedi.","   Bu gün nedir?"'],
    prompt:'Cevap > ', answer:'bugün',
    hint:'Şu an...',
    successMsg:'> AN ANLAŞILDI.',
  },
  {
    category:'Mantık',
    lines:['> AĞIRLIK:','','  "Bir kilo pamuk mu","   ağırdır yoksa bir kilo","   demir mi?"'],
    prompt:'Cevap > ', answer:'eşit',
    hint:'İkisi de 1 kilogram.',
    successMsg:'> TUZAK AŞILDI.',
  },
  {
    category:'Mantık',
    lines:['> MAĞARA:','','  "Bir mağaraya giriyorsun.","   Sadece bir kibrit var.","   Bir mum, bir lamba,","   bir şömine var.","   Neyi önce yakarsın?"'],
    prompt:'Cevap > ', answer:'kibriti',
    hint:'Her şeyi yakmak için önce...',
    successMsg:'> MANTIK PARLADI.',
  },
]

// ════════════════════════════════════════════════════════════════
//  GENEL KÜLTÜR — Teknoloji, Sanat, Sinema
// ════════════════════════════════════════════════════════════════
const GENEL: Puzzle[] = [
  {
    category:'Genel Kültür',
    lines:['> SİNEMA:','','  "Tüm zamanların en yüksek","   gişe hasılatı yapan filmi","   hangisidir?"'],
    prompt:'Cevap > ', answer:'avatar',
    hint:'James Cameron. 2009.',
    successMsg:'> GİŞE REKORDU.',
  },
  {
    category:'Genel Kültür',
    lines:['> EDEBIYAT:','','  "\"Suç ve Ceza\" romanının","   yazarı kimdir?"'],
    prompt:'Cevap > ', answer:'dostoyevski',
    hint:'Rus edebiyatının devi.',
    successMsg:'> KİTAP AÇILDI.',
  },
  {
    category:'Genel Kültür',
    lines:['> HEYKEL:','','  "\"Düşünen Adam\" heykelinin","   sanatçısı kimdir?"'],
    prompt:'Cevap > ', answer:'rodin',
    hint:'Auguste Rodin. Fransız. 1902.',
    successMsg:'> DÜŞÜNCE TAŞA YERLEŞTİ.',
  },
  {
    category:'Genel Kültür',
    lines:['> FELSEFE:','','  "\"Cogito ergo sum\"","   (\"Düşünüyorum öyleyse varım\")","   diyen düşünür kimdir?"'],
    prompt:'Cevap > ', answer:'descartes',
    hint:'René Descartes. 17. yüzyıl Fransız.',
    successMsg:'> VARLIK KANNITLANDI.',
  },
  {
    category:'Genel Kültür',
    lines:['> İNTERNET:','','  "World Wide Web\'i kim icat etti?"'],
    prompt:'Cevap > ', answer:'tim berners-lee',
    hint:'1989. CERN. İngiliz bilgisayar bilimci.',
    successMsg:'> AĞ KURULDU.',
  },
]

// ════════════════════════════════════════════════════════════════
//  Tüm soruları birleştir ve export et
// ════════════════════════════════════════════════════════════════
export const ALL_PUZZLES: Puzzle[] = [
  ...ISLAM,
  ...OSMANLI,
  ...BERGAMA,
  ...UNESCO,
  ...SPOR,
  ...MUZIK,
  ...TARIH,
  ...BILIM,
  ...MATEMATIK,
  ...COGRAFYA,
  ...MANTIK,
  ...GENEL,
]

// Kategori bazlı erişim
export const PUZZLE_CATEGORIES = {
  İslam:         ISLAM,
  Osmanlı:       OSMANLI,
  Bergama:       BERGAMA,
  UNESCO:        UNESCO,
  Spor:          SPOR,
  Müzik:         MUZIK,
  Tarih:         TARIH,
  Bilim:         BILIM,
  Matematik:     MATEMATIK,
  Coğrafya:      COGRAFYA,
  Mantık:        MANTIK,
  'Genel Kültür':GENEL,
}

console.log(`[Vault] Toplam soru: ${ALL_PUZZLES.length}`)

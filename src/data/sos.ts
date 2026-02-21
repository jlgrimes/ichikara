export interface SOSPhrase {
  japanese: string;
  romaji: string;
  english: string;
}

export interface SOSCategory {
  id: string;
  emoji: string;
  name: string;
  color: string; // bg color for card
  phrases: SOSPhrase[];
}

export const SOS_CATEGORIES: SOSCategory[] = [
  {
    id: 'basics',
    emoji: '🙏',
    name: 'Survival',
    color: 'bg-slate-50',
    phrases: [
      { japanese: 'はい', romaji: 'hai', english: 'Yes' },
      { japanese: 'いいえ', romaji: 'iie', english: 'No' },
      { japanese: 'おねがいします', romaji: 'onegaishimasu', english: 'Please' },
      { japanese: 'ありがとうございます', romaji: 'arigatō gozaimasu', english: 'Thank you' },
      { japanese: 'すみません', romaji: 'sumimasen', english: 'Excuse me / Sorry' },
      { japanese: 'わかりません', romaji: 'wakarimasen', english: "I don't understand" },
      { japanese: 'えいごをはなせますか？', romaji: 'eigo o hanasemasu ka?', english: 'Do you speak English?' },
      { japanese: 'もういちどおねがいします', romaji: 'mō ichido onegaishimasu', english: 'Once more please' },
      { japanese: 'ゆっくりはなしてください', romaji: 'yukkuri hanashite kudasai', english: 'Please speak slowly' },
      { japanese: 'にほんごがわかりません', romaji: 'nihongo ga wakarimasen', english: "I don't understand Japanese" },
    ],
  },
  {
    id: 'restaurant',
    emoji: '🍜',
    name: 'Restaurant',
    color: 'bg-orange-50',
    phrases: [
      { japanese: 'すみません！', romaji: 'sumimasen!', english: 'Excuse me! (to get attention)' },
      { japanese: 'これをください', romaji: 'kore o kudasai', english: 'I\'ll have this please (point at menu)' },
      { japanese: 'おすすめはなんですか？', romaji: 'osusume wa nan desu ka?', english: 'What do you recommend?' },
      { japanese: 'ひとりです', romaji: 'hitori desu', english: 'Just one person' },
      { japanese: 'ふたりです', romaji: 'futari desu', english: 'Two people' },
      { japanese: 'べジタリアンです', romaji: 'bejitarian desu', english: "I'm vegetarian" },
      { japanese: 'アレルギーがあります', romaji: 'arerugī ga arimasu', english: 'I have allergies' },
      { japanese: 'からくないですか？', romaji: 'karakunai desu ka?', english: 'Is it spicy?' },
      { japanese: 'おいしい！', romaji: 'oishii!', english: 'Delicious!' },
      { japanese: 'おかわりをください', romaji: 'okawari o kudasai', english: 'Refill please / Another one please' },
      { japanese: 'おかいけいをおねがいします', romaji: 'okaikei o onegaishimasu', english: 'Check please' },
      { japanese: 'べつべつにしてください', romaji: 'betsubetsu ni shite kudasai', english: 'Separate bills please' },
      { japanese: 'クレジットカードはつかえますか？', romaji: 'kurejitto kādo wa tsukaemasu ka?', english: 'Can I use a credit card?' },
    ],
  },
  {
    id: 'directions',
    emoji: '🗺️',
    name: 'Directions',
    color: 'bg-blue-50',
    phrases: [
      { japanese: '〜はどこですか？', romaji: '〜 wa doko desu ka?', english: 'Where is 〜?' },
      { japanese: 'えきはどこですか？', romaji: 'eki wa doko desu ka?', english: 'Where is the station?' },
      { japanese: 'トイレはどこですか？', romaji: 'toire wa doko desu ka?', english: 'Where is the bathroom?' },
      { japanese: 'みぎ', romaji: 'migi', english: 'Right' },
      { japanese: 'ひだり', romaji: 'hidari', english: 'Left' },
      { japanese: 'まっすぐ', romaji: 'massugu', english: 'Straight ahead' },
      { japanese: 'ちかい', romaji: 'chikai', english: 'Near / Close' },
      { japanese: 'とおい', romaji: 'tōi', english: 'Far' },
      { japanese: 'まよってしまいました', romaji: 'mayotte shimaimashita', english: 'I got lost' },
      { japanese: 'このじゅうしょにつれていってください', romaji: 'kono jūsho ni tsurete itte kudasai', english: 'Please take me to this address (show phone)' },
      { japanese: 'タクシーをよんでください', romaji: 'takushī o yonde kudasai', english: 'Please call a taxi' },
      { japanese: 'くうこうまでいってください', romaji: 'kūkō made itte kudasai', english: 'To the airport please' },
    ],
  },
  {
    id: 'shopping',
    emoji: '🛍️',
    name: 'Shopping',
    color: 'bg-pink-50',
    phrases: [
      { japanese: 'いくらですか？', romaji: 'ikura desu ka?', english: 'How much is it?' },
      { japanese: 'これはなんですか？', romaji: 'kore wa nan desu ka?', english: 'What is this?' },
      { japanese: 'みているだけです', romaji: 'mite iru dake desu', english: 'Just looking' },
      { japanese: 'これをください', romaji: 'kore o kudasai', english: 'I\'ll take this one' },
      { japanese: 'Lサイズはありますか？', romaji: 'L saizu wa arimasu ka?', english: 'Do you have size L?' },
      { japanese: 'べつのいろはありますか？', romaji: 'betsu no iro wa arimasu ka?', english: 'Do you have another color?' },
      { japanese: 'しちゃくしてもいいですか？', romaji: 'shichaku shite mo ii desu ka?', english: 'Can I try it on?' },
      { japanese: 'ふくろをください', romaji: 'fukuro o kudasai', english: 'A bag please' },
      { japanese: 'プレゼントようにつつんでください', romaji: 'purezento-yō ni tsutsunde kudasai', english: 'Please gift-wrap it' },
      { japanese: 'めんぜいはできますか？', romaji: 'menzei wa dekimasu ka?', english: 'Is tax-free available?' },
      { japanese: 'カードではらえますか？', romaji: 'kādo de haraemasu ka?', english: 'Can I pay by card?' },
    ],
  },
  {
    id: 'hotel',
    emoji: '🏨',
    name: 'Hotel',
    color: 'bg-amber-50',
    phrases: [
      { japanese: 'チェックインをおねがいします', romaji: 'chekku-in o onegaishimasu', english: 'Check-in please' },
      { japanese: 'チェックアウトをおねがいします', romaji: 'chekku-auto o onegaishimasu', english: 'Check-out please' },
      { japanese: 'よやくをしています', romaji: 'yoyaku o shite imasu', english: 'I have a reservation' },
      { japanese: 'Wifiのパスワードはなんですか？', romaji: 'WiFi no pasuwādo wa nan desu ka?', english: "What's the WiFi password?" },
      { japanese: 'タオルをください', romaji: 'taoru o kudasai', english: 'Towels please' },
      { japanese: 'クーラーがこわれています', romaji: 'kūrā ga kowarete imasu', english: 'The AC is broken' },
      { japanese: 'もっとしずかなへやにしてください', romaji: 'motto shizuka na heya ni shite kudasai', english: 'A quieter room please' },
      { japanese: 'にもつをあずかってもらえますか？', romaji: 'nimotsu o azukatte moraemasu ka?', english: 'Can you hold my luggage?' },
      { japanese: 'ルームサービスをおねがいします', romaji: 'rūmu sābisu o onegaishimasu', english: 'Room service please' },
    ],
  },
  {
    id: 'emergency',
    emoji: '🚑',
    name: 'Emergency',
    color: 'bg-red-50',
    phrases: [
      { japanese: 'たすけてください！', romaji: 'tasukete kudasai!', english: 'Help me please!' },
      { japanese: 'きゅうきゅうしゃをよんでください！', romaji: 'kyūkyūsha o yonde kudasai!', english: 'Call an ambulance!' },
      { japanese: 'けいさつをよんでください！', romaji: 'keisatsu o yonde kudasai!', english: 'Call the police!' },
      { japanese: 'びょういんにつれていってください', romaji: 'byōin ni tsurete itte kudasai', english: 'Take me to a hospital' },
      { japanese: 'ぐあいがわるいです', romaji: 'guai ga warui desu', english: 'I feel sick / I am unwell' },
      { japanese: 'アレルギーがあります', romaji: 'arerugī ga arimasu', english: 'I have allergies' },
      { japanese: 'くすりがひつようです', romaji: 'kusuri ga hitsuyō desu', english: 'I need medicine' },
      { japanese: 'ぬすまれました', romaji: 'nusumaremashita', english: 'I was robbed / It was stolen' },
      { japanese: 'たいしかんはどこですか？', romaji: 'taishikan wa doko desu ka?', english: 'Where is the embassy?' },
      { japanese: 'いたいです', romaji: 'itai desu', english: 'It hurts / I am in pain' },
    ],
  },
  {
    id: 'transport',
    emoji: '🚆',
    name: 'Transport',
    color: 'bg-green-50',
    phrases: [
      { japanese: '〜いきのきっぷをください', romaji: '〜 yuki no kippu o kudasai', english: 'One ticket to 〜 please' },
      { japanese: 'つぎのでんしゃはなんじですか？', romaji: 'tsugi no densha wa nanji desu ka?', english: 'What time is the next train?' },
      { japanese: 'このでんしゃは〜にとまりますか？', romaji: 'kono densha wa 〜 ni tomarimasu ka?', english: 'Does this train stop at 〜?' },
      { japanese: 'のりかえはどこですか？', romaji: 'norikae wa doko desu ka?', english: 'Where do I transfer?' },
      { japanese: 'ICカードをつかえますか？', romaji: 'IC kādo o tsukaemasu ka?', english: 'Can I use an IC card?' },
      { japanese: 'のりすごしました', romaji: 'norisugo shimashita', english: 'I missed my stop' },
      { japanese: 'くうこうにいきたいです', romaji: 'kūkō ni ikitai desu', english: 'I want to go to the airport' },
      { japanese: 'バスていはどこですか？', romaji: 'basutei wa doko desu ka?', english: 'Where is the bus stop?' },
    ],
  },
];

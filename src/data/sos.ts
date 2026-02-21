export interface SOSPhrase {
  target: string;
  romaji?: string;
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
      { target: 'はい', romaji: 'hai', english: 'Yes' },
      { target: 'いいえ', romaji: 'iie', english: 'No' },
      { target: 'おねがいします', romaji: 'onegaishimasu', english: 'Please' },
      { target: 'ありがとうございます', romaji: 'arigatō gozaimasu', english: 'Thank you' },
      { target: 'すみません', romaji: 'sumimasen', english: 'Excuse me / Sorry' },
      { target: 'わかりません', romaji: 'wakarimasen', english: "I don't understand" },
      { target: 'えいごをはなせますか？', romaji: 'eigo o hanasemasu ka?', english: 'Do you speak English?' },
      { target: 'もういちどおねがいします', romaji: 'mō ichido onegaishimasu', english: 'Once more please' },
      { target: 'ゆっくりはなしてください', romaji: 'yukkuri hanashite kudasai', english: 'Please speak slowly' },
      { target: 'にほんごがわかりません', romaji: 'nihongo ga wakarimasen', english: "I don't understand Japanese" },
    ],
  },
  {
    id: 'restaurant',
    emoji: '🍜',
    name: 'Restaurant',
    color: 'bg-orange-50',
    phrases: [
      { target: 'すみません！', romaji: 'sumimasen!', english: 'Excuse me! (to get attention)' },
      { target: 'これをください', romaji: 'kore o kudasai', english: 'I\'ll have this please (point at menu)' },
      { target: 'おすすめはなんですか？', romaji: 'osusume wa nan desu ka?', english: 'What do you recommend?' },
      { target: 'ひとりです', romaji: 'hitori desu', english: 'Just one person' },
      { target: 'ふたりです', romaji: 'futari desu', english: 'Two people' },
      { target: 'べジタリアンです', romaji: 'bejitarian desu', english: "I'm vegetarian" },
      { target: 'アレルギーがあります', romaji: 'arerugī ga arimasu', english: 'I have allergies' },
      { target: 'からくないですか？', romaji: 'karakunai desu ka?', english: 'Is it spicy?' },
      { target: 'おいしい！', romaji: 'oishii!', english: 'Delicious!' },
      { target: 'おかわりをください', romaji: 'okawari o kudasai', english: 'Refill please / Another one please' },
      { target: 'おかいけいをおねがいします', romaji: 'okaikei o onegaishimasu', english: 'Check please' },
      { target: 'べつべつにしてください', romaji: 'betsubetsu ni shite kudasai', english: 'Separate bills please' },
      { target: 'クレジットカードはつかえますか？', romaji: 'kurejitto kādo wa tsukaemasu ka?', english: 'Can I use a credit card?' },
    ],
  },
  {
    id: 'directions',
    emoji: '🗺️',
    name: 'Directions',
    color: 'bg-blue-50',
    phrases: [
      { target: '〜はどこですか？', romaji: '〜 wa doko desu ka?', english: 'Where is 〜?' },
      { target: 'えきはどこですか？', romaji: 'eki wa doko desu ka?', english: 'Where is the station?' },
      { target: 'トイレはどこですか？', romaji: 'toire wa doko desu ka?', english: 'Where is the bathroom?' },
      { target: 'みぎ', romaji: 'migi', english: 'Right' },
      { target: 'ひだり', romaji: 'hidari', english: 'Left' },
      { target: 'まっすぐ', romaji: 'massugu', english: 'Straight ahead' },
      { target: 'ちかい', romaji: 'chikai', english: 'Near / Close' },
      { target: 'とおい', romaji: 'tōi', english: 'Far' },
      { target: 'まよってしまいました', romaji: 'mayotte shimaimashita', english: 'I got lost' },
      { target: 'このじゅうしょにつれていってください', romaji: 'kono jūsho ni tsurete itte kudasai', english: 'Please take me to this address (show phone)' },
      { target: 'タクシーをよんでください', romaji: 'takushī o yonde kudasai', english: 'Please call a taxi' },
      { target: 'くうこうまでいってください', romaji: 'kūkō made itte kudasai', english: 'To the airport please' },
    ],
  },
  {
    id: 'shopping',
    emoji: '🛍️',
    name: 'Shopping',
    color: 'bg-pink-50',
    phrases: [
      { target: 'いくらですか？', romaji: 'ikura desu ka?', english: 'How much is it?' },
      { target: 'これはなんですか？', romaji: 'kore wa nan desu ka?', english: 'What is this?' },
      { target: 'みているだけです', romaji: 'mite iru dake desu', english: 'Just looking' },
      { target: 'これをください', romaji: 'kore o kudasai', english: 'I\'ll take this one' },
      { target: 'Lサイズはありますか？', romaji: 'L saizu wa arimasu ka?', english: 'Do you have size L?' },
      { target: 'べつのいろはありますか？', romaji: 'betsu no iro wa arimasu ka?', english: 'Do you have another color?' },
      { target: 'しちゃくしてもいいですか？', romaji: 'shichaku shite mo ii desu ka?', english: 'Can I try it on?' },
      { target: 'ふくろをください', romaji: 'fukuro o kudasai', english: 'A bag please' },
      { target: 'プレゼントようにつつんでください', romaji: 'purezento-yō ni tsutsunde kudasai', english: 'Please gift-wrap it' },
      { target: 'めんぜいはできますか？', romaji: 'menzei wa dekimasu ka?', english: 'Is tax-free available?' },
      { target: 'カードではらえますか？', romaji: 'kādo de haraemasu ka?', english: 'Can I pay by card?' },
    ],
  },
  {
    id: 'hotel',
    emoji: '🏨',
    name: 'Hotel',
    color: 'bg-amber-50',
    phrases: [
      { target: 'チェックインをおねがいします', romaji: 'chekku-in o onegaishimasu', english: 'Check-in please' },
      { target: 'チェックアウトをおねがいします', romaji: 'chekku-auto o onegaishimasu', english: 'Check-out please' },
      { target: 'よやくをしています', romaji: 'yoyaku o shite imasu', english: 'I have a reservation' },
      { target: 'Wifiのパスワードはなんですか？', romaji: 'WiFi no pasuwādo wa nan desu ka?', english: "What's the WiFi password?" },
      { target: 'タオルをください', romaji: 'taoru o kudasai', english: 'Towels please' },
      { target: 'クーラーがこわれています', romaji: 'kūrā ga kowarete imasu', english: 'The AC is broken' },
      { target: 'もっとしずかなへやにしてください', romaji: 'motto shizuka na heya ni shite kudasai', english: 'A quieter room please' },
      { target: 'にもつをあずかってもらえますか？', romaji: 'nimotsu o azukatte moraemasu ka?', english: 'Can you hold my luggage?' },
      { target: 'ルームサービスをおねがいします', romaji: 'rūmu sābisu o onegaishimasu', english: 'Room service please' },
    ],
  },
  {
    id: 'emergency',
    emoji: '🚑',
    name: 'Emergency',
    color: 'bg-red-50',
    phrases: [
      { target: 'たすけてください！', romaji: 'tasukete kudasai!', english: 'Help me please!' },
      { target: 'きゅうきゅうしゃをよんでください！', romaji: 'kyūkyūsha o yonde kudasai!', english: 'Call an ambulance!' },
      { target: 'けいさつをよんでください！', romaji: 'keisatsu o yonde kudasai!', english: 'Call the police!' },
      { target: 'びょういんにつれていってください', romaji: 'byōin ni tsurete itte kudasai', english: 'Take me to a hospital' },
      { target: 'ぐあいがわるいです', romaji: 'guai ga warui desu', english: 'I feel sick / I am unwell' },
      { target: 'アレルギーがあります', romaji: 'arerugī ga arimasu', english: 'I have allergies' },
      { target: 'くすりがひつようです', romaji: 'kusuri ga hitsuyō desu', english: 'I need medicine' },
      { target: 'ぬすまれました', romaji: 'nusumaremashita', english: 'I was robbed / It was stolen' },
      { target: 'たいしかんはどこですか？', romaji: 'taishikan wa doko desu ka?', english: 'Where is the embassy?' },
      { target: 'いたいです', romaji: 'itai desu', english: 'It hurts / I am in pain' },
    ],
  },
  {
    id: 'transport',
    emoji: '🚆',
    name: 'Transport',
    color: 'bg-green-50',
    phrases: [
      { target: '〜いきのきっぷをください', romaji: '〜 yuki no kippu o kudasai', english: 'One ticket to 〜 please' },
      { target: 'つぎのでんしゃはなんじですか？', romaji: 'tsugi no densha wa nanji desu ka?', english: 'What time is the next train?' },
      { target: 'このでんしゃは〜にとまりますか？', romaji: 'kono densha wa 〜 ni tomarimasu ka?', english: 'Does this train stop at 〜?' },
      { target: 'のりかえはどこですか？', romaji: 'norikae wa doko desu ka?', english: 'Where do I transfer?' },
      { target: 'ICカードをつかえますか？', romaji: 'IC kādo o tsukaemasu ka?', english: 'Can I use an IC card?' },
      { target: 'のりすごしました', romaji: 'norisugo shimashita', english: 'I missed my stop' },
      { target: 'くうこうにいきたいです', romaji: 'kūkō ni ikitai desu', english: 'I want to go to the airport' },
      { target: 'バスていはどこですか？', romaji: 'basutei wa doko desu ka?', english: 'Where is the bus stop?' },
    ],
  },
];

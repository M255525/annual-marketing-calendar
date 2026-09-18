/* ==========================================================================
   全年度行銷行事曆產生器 — 共用資料檔
   天時（節慶檔期庫）／地利（通路類型）／人和（六大整合行銷工具）＋規則式共鳴模板＋五組內建範例。
   佔位符：{{FESTIVAL}} {{TA}} {{BRAND}} {{PLACE}} {{PEOPLE}}
   ========================================================================== */
(function (global) {
  'use strict';

  /* ---------------- 人和：六大整合行銷工具 ---------------- */
  var CHANNELS = {
    selfMedia:     { label: '自媒體',   desc: '官方社群帳號、官網、LINE官方帳號、Email 自主經營的渠道' },
    otherMedia:    { label: '他媒體',   desc: '付費廣告、KOL／KOC合作、新聞稿、聯播網等借力渠道' },
    crm:           { label: 'CRM',      desc: '會員系統、簡訊／Email／LINE推播、會員分級經營' },
    event:         { label: '活動',     desc: '實體或線上活動、快閃店、體驗會' },
    curation:      { label: '策展',     desc: '主題陳列、選物企劃、內容策展' },
    crossIndustry: { label: '異業',     desc: '品牌聯名、跨業合作、通路異業結盟' }
  };
  var CHANNEL_ORDER = ['selfMedia', 'otherMedia', 'crm', 'event', 'curation', 'crossIndustry'];

  /* ---------------- 地利：交易通路類型 ---------------- */
  var PLACE_TYPE_LABELS = {
    online: '網路商城／官網',
    offline: '實體店／門市',
    special: '特殊通路'
  };

  /* ---------------- 天時：產業分類 ---------------- */
  var INDUSTRY_LABELS = {
    beautyFashion: '美妝保養／時尚服飾',
    foodBeverage: '餐飲／食品飲料',
    electronics3c: '3C科技／家電',
    eduChildren: '親子教育／兒童',
    healthWellness: '健康保健／運動',
    general: '一般零售／其他'
  };
  var INDUSTRY_ORDER = ['beautyFashion', 'foodBeverage', 'electronics3c', 'eduChildren', 'healthWellness', 'general'];

  /* ---------------- 天時：全國性檔期（TA 真正會過的節，非品牌自己的紀念日） ----------------
     priority: 1=優先保留 2=次要（總數超過18檔時優先被裁掉）
     week: 落在第幾週的近似值；lunar:true 表示農曆日期需依當年月曆微調 */
  var NATIONAL_FESTIVALS = [
    { id: 'nf01', name: '元旦跨年', week: 1, dateLabel: '1/1', lunar: false, priority: 1, placeHint: ['online', 'offline'], peoplePriority: ['selfMedia', 'event', 'otherMedia'] },
    { id: 'nf02', name: '農曆春節／年貨大街', week: 6, dateLabel: '約2月（農曆春節前）', lunar: true, priority: 1, placeHint: ['offline', 'online', 'special'], peoplePriority: ['crm', 'event', 'crossIndustry'] },
    { id: 'nf03', name: '西洋情人節', week: 7, dateLabel: '2/14', lunar: false, priority: 1, placeHint: ['online', 'offline'], peoplePriority: ['selfMedia', 'otherMedia', 'crm'] },
    { id: 'nf04', name: '婦女節／女神購物節', week: 10, dateLabel: '3/8', lunar: false, priority: 1, placeHint: ['online'], peoplePriority: ['otherMedia', 'selfMedia', 'crm'] },
    { id: 'nf05', name: '兒童節連假', week: 14, dateLabel: '4/4', lunar: false, priority: 2, placeHint: ['offline', 'special'], peoplePriority: ['event', 'curation', 'crossIndustry'] },
    { id: 'nf06', name: '母親節', week: 19, dateLabel: '5月第2週', lunar: false, priority: 1, placeHint: ['online', 'offline'], peoplePriority: ['crm', 'event', 'crossIndustry'] },
    { id: 'nf07', name: '端午節', week: 23, dateLabel: '約6月（農曆5月初五）', lunar: true, priority: 2, placeHint: ['offline', 'special'], peoplePriority: ['curation', 'crm', 'otherMedia'] },
    { id: 'nf08', name: '畢業季／謝師宴', week: 25, dateLabel: '6月', lunar: false, priority: 2, placeHint: ['offline', 'special'], peoplePriority: ['event', 'crossIndustry', 'selfMedia'] },
    { id: 'nf09', name: '父親節', week: 32, dateLabel: '8/8', lunar: false, priority: 1, placeHint: ['online', 'offline'], peoplePriority: ['crm', 'selfMedia', 'event'] },
    { id: 'nf10', name: '開學季', week: 36, dateLabel: '9月初', lunar: false, priority: 1, placeHint: ['online', 'offline', 'special'], peoplePriority: ['otherMedia', 'curation', 'crossIndustry'] },
    { id: 'nf11', name: '中秋節', week: 38, dateLabel: '約9月（農曆8月15日）', lunar: true, priority: 1, placeHint: ['offline', 'special'], peoplePriority: ['crossIndustry', 'curation', 'crm'] },
    { id: 'nf12', name: '雙十國慶連假', week: 41, dateLabel: '10/10', lunar: false, priority: 1, placeHint: ['offline', 'online'], peoplePriority: ['event', 'selfMedia', 'otherMedia'] },
    { id: 'nf13', name: '萬聖節', week: 44, dateLabel: '10/31', lunar: false, priority: 2, placeHint: ['offline', 'online'], peoplePriority: ['curation', 'selfMedia', 'event'] },
    { id: 'nf14', name: '雙11購物節', week: 45, dateLabel: '11/11', lunar: false, priority: 1, placeHint: ['online'], peoplePriority: ['otherMedia', 'selfMedia', 'crm'] },
    { id: 'nf15', name: '感恩節／黑色星期五購物潮', week: 48, dateLabel: '11月底', lunar: false, priority: 1, placeHint: ['online'], peoplePriority: ['otherMedia', 'crm', 'selfMedia'] },
    { id: 'nf16', name: '雙12購物節', week: 50, dateLabel: '12/12', lunar: false, priority: 1, placeHint: ['online'], peoplePriority: ['crm', 'otherMedia', 'selfMedia'] },
    { id: 'nf17', name: '聖誕節', week: 51, dateLabel: '12/25', lunar: false, priority: 1, placeHint: ['offline', 'online', 'special'], peoplePriority: ['curation', 'event', 'crossIndustry'] },
    { id: 'nf18', name: '尾牙／歲末年終慶', week: 52, dateLabel: '12月底', lunar: false, priority: 2, placeHint: ['offline', 'special'], peoplePriority: ['crm', 'event', 'crossIndustry'] }
  ];

  /* ---------------- 天時：各產業專屬檔期 ---------------- */
  var INDUSTRY_FESTIVALS = {
    beautyFashion: [
      { id: 'bf01', name: '換季保養／春夏新品季', week: 11, dateLabel: '3月中', lunar: false, priority: 2, placeHint: ['online', 'offline'], peoplePriority: ['curation', 'selfMedia', 'otherMedia'] },
      { id: 'bf02', name: '夏日防曬／美白保養季', week: 22, dateLabel: '6月', lunar: false, priority: 2, placeHint: ['online', 'offline'], peoplePriority: ['selfMedia', 'otherMedia', 'crm'] },
      { id: 'bf03', name: '秋冬新品／時裝週話題季', week: 39, dateLabel: '9月底', lunar: false, priority: 2, placeHint: ['online', 'offline'], peoplePriority: ['curation', 'otherMedia', 'crossIndustry'] },
      { id: 'bf04', name: '年終保養品囤貨季', week: 49, dateLabel: '12月初', lunar: false, priority: 1, placeHint: ['online'], peoplePriority: ['crm', 'otherMedia', 'selfMedia'] }
    ],
    foodBeverage: [
      { id: 'fb01', name: '尾牙春酒訂位旺季', week: 4, dateLabel: '1月', lunar: false, priority: 2, placeHint: ['offline', 'special'], peoplePriority: ['event', 'crm', 'crossIndustry'] },
      { id: 'fb02', name: '夏季冰品飲料旺季', week: 26, dateLabel: '6月底－8月', lunar: false, priority: 1, placeHint: ['offline', 'online'], peoplePriority: ['selfMedia', 'curation', 'otherMedia'] },
      { id: 'fb03', name: '火鍋暖胃旺季', week: 47, dateLabel: '11月中', lunar: false, priority: 2, placeHint: ['offline'], peoplePriority: ['curation', 'crm', 'event'] },
      { id: 'fb04', name: '聖誕聚餐檔期', week: 51, dateLabel: '12月', lunar: false, priority: 2, placeHint: ['offline'], peoplePriority: ['event', 'crossIndustry', 'crm'] }
    ],
    electronics3c: [
      { id: 'ec01', name: '618購物節', week: 25, dateLabel: '6/18', lunar: false, priority: 1, placeHint: ['online'], peoplePriority: ['otherMedia', 'selfMedia', 'crm'] },
      { id: 'ec02', name: '開學3C採購季', week: 35, dateLabel: '8月底', lunar: false, priority: 2, placeHint: ['online', 'offline'], peoplePriority: ['otherMedia', 'crm', 'selfMedia'] },
      { id: 'ec03', name: '新機發表換機潮', week: 38, dateLabel: '9月', lunar: false, priority: 2, placeHint: ['online', 'offline'], peoplePriority: ['selfMedia', 'otherMedia', 'curation'] },
      { id: 'ec04', name: '尾牙抽獎採購季', week: 50, dateLabel: '12月中', lunar: false, priority: 2, placeHint: ['offline', 'special'], peoplePriority: ['crossIndustry', 'event', 'crm'] }
    ],
    eduChildren: [
      { id: 'ec11', name: '寒假營隊招生季', week: 3, dateLabel: '1月中', lunar: false, priority: 2, placeHint: ['online', 'offline'], peoplePriority: ['otherMedia', 'crm', 'selfMedia'] },
      { id: 'ec12', name: '暑假營隊招生季', week: 24, dateLabel: '6月中', lunar: false, priority: 1, placeHint: ['online', 'offline'], peoplePriority: ['otherMedia', 'crm', 'event'] },
      { id: 'ec13', name: '教師節感恩活動', week: 39, dateLabel: '9/28', lunar: false, priority: 2, placeHint: ['offline', 'special'], peoplePriority: ['event', 'crossIndustry', 'curation'] },
      { id: 'ec14', name: '下學期招生說明會季', week: 45, dateLabel: '11月', lunar: false, priority: 2, placeHint: ['offline'], peoplePriority: ['event', 'crm', 'selfMedia'] }
    ],
    healthWellness: [
      { id: 'hw01', name: '新年運動決心季', week: 2, dateLabel: '1月', lunar: false, priority: 1, placeHint: ['online', 'offline'], peoplePriority: ['selfMedia', 'crm', 'otherMedia'] },
      { id: 'hw02', name: '夏季體態雕塑季', week: 20, dateLabel: '5月', lunar: false, priority: 2, placeHint: ['online', 'offline'], peoplePriority: ['otherMedia', 'selfMedia', 'event'] },
      { id: 'hw03', name: '秋冬免疫力保健季', week: 43, dateLabel: '10月底', lunar: false, priority: 2, placeHint: ['online'], peoplePriority: ['crm', 'otherMedia', 'curation'] },
      { id: 'hw04', name: '年度健檢／回饋季', week: 49, dateLabel: '12月', lunar: false, priority: 2, placeHint: ['offline', 'special'], peoplePriority: ['crm', 'crossIndustry', 'event'] }
    ],
    general: [
      { id: 'gn01', name: '换季出清特賣週', week: 12, dateLabel: '3月', lunar: false, priority: 2, placeHint: ['offline', 'online'], peoplePriority: ['otherMedia', 'selfMedia', 'crm'] },
      { id: 'gn02', name: '夏季特賣週', week: 27, dateLabel: '7月', lunar: false, priority: 2, placeHint: ['online', 'offline'], peoplePriority: ['otherMedia', 'selfMedia', 'curation'] },
      { id: 'gn03', name: '百貨公司週年慶檔期（產業共同檔期，非品牌自身週年慶）', week: 40, dateLabel: '10月', lunar: false, priority: 1, placeHint: ['offline', 'online'], peoplePriority: ['crm', 'event', 'otherMedia'] },
      { id: 'gn04', name: '年初清倉特賣', week: 5, dateLabel: '1月', lunar: false, priority: 2, placeHint: ['offline', 'online'], peoplePriority: ['otherMedia', 'crm', 'selfMedia'] }
    ]
  };

  /* ---------------- 戰略整合共鳴：規則式模板（3 變體，確定性挑選） ---------------- */
  var SYNERGY_TEMPLATES = [
    '當「{{FESTIVAL}}」——{{TA}}真正會過的節——撞上{{BRAND}}在{{PLACE}}的轉換點，只要用{{PEOPLE}}把訊息精準打上，ROAS的爆發就不是單點操作的運氣，而是流量×情境×定位三線收斂的必然結果。',
    '{{FESTIVAL}}正是{{TA}}情境切換的關鍵週——{{BRAND}}若能提前在{{PLACE}}布好轉換動線，搭配{{PEOPLE}}的整合操作，天時、地利、人和三線自然收斂，轉換率會比平日操作高出一個量級。',
    '不要把「{{FESTIVAL}}」當成單純的檔期促銷，而是{{TA}}主動尋找解方的時刻——{{BRAND}}在{{PLACE}}接住這股流量，再用{{PEOPLE}}持續對話，才是{{FESTIVAL}}真正該打的整合戰。'
  ];

  function hashString(s) {
    var h = 5381;
    for (var i = 0; i < s.length; i++) { h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; }
    return h;
  }

  /* ---------------- 五組內建範例 ---------------- */
  var PRESETS = [
    {
      label: '美妝保養｜蒔光植萃',
      brandName: '蒔光植萃 TimeBloom',
      industry: 'beautyFashion',
      ta: '25-40歲重視成分與保養儀式感的都會女性',
      places: [
        { name: '官方網站商城', type: 'online' },
        { name: '百貨專櫃', type: 'offline' },
        { name: '美妝生活選物店', type: 'special' }
      ],
      channels: ['selfMedia', 'otherMedia', 'crm', 'event', 'curation'],
      startWeek: 1,
      weeksCount: 52,
      extra: '主打植萃成分與慢保養儀式感，希望文案避免過度誇大功效字眼。'
    },
    {
      label: '餐飲｜暖心鍋物',
      brandName: '暖心鍋物 WarmPot',
      industry: 'foodBeverage',
      ta: '25-45歲重視聚餐氛圍的小家庭與上班族',
      places: [
        { name: '門市外帶櫃', type: 'offline' },
        { name: '外送平台官方賣場', type: 'online' }
      ],
      channels: ['selfMedia', 'crm', 'event', 'curation'],
      startWeek: 1,
      weeksCount: 52,
      extra: '希望強調圍爐聚餐的溫暖感，冬季檔期是全年營收重心。'
    },
    {
      label: '3C科技｜疾風科技',
      brandName: '疾風科技 SwiftTech',
      industry: 'electronics3c',
      ta: '25-35歲重度3C使用者與科技早期採用者',
      places: [
        { name: '官方商城', type: 'online' },
        { name: '3C連鎖賣場', type: 'offline' }
      ],
      channels: ['selfMedia', 'otherMedia', 'crm', 'crossIndustry'],
      startWeek: 1,
      weeksCount: 52,
      extra: '主力商品為藍牙耳機與行動電源，希望帶出開箱體驗感。'
    },
    {
      label: '親子教育｜探索學苑',
      brandName: '探索學苑 ExploreKids',
      industry: 'eduChildren',
      ta: '家有6-12歲孩子、重視探索式學習的家長',
      places: [
        { name: '官網報名系統', type: 'online' },
        { name: '教室據點', type: 'offline' }
      ],
      channels: ['otherMedia', 'crm', 'event', 'crossIndustry'],
      startWeek: 1,
      weeksCount: 52,
      extra: '寒暑假營隊是主力招生檔期，希望文案能安撫家長對安全性的疑慮。'
    },
    {
      label: '健康保健｜活力補給站',
      brandName: '活力補給站 VitaBoost',
      industry: 'healthWellness',
      ta: '30-50歲重視體態與免疫力的健康意識族群',
      places: [
        { name: '官方電商', type: 'online' },
        { name: '健身房合作櫃位', type: 'special' }
      ],
      channels: ['selfMedia', 'otherMedia', 'crm', 'curation'],
      startWeek: 1,
      weeksCount: 52,
      extra: '希望強調科學實證與長期陪伴感，避免速效誇大用語。'
    }
  ];

  global.AMC_DATA = {
    CHANNELS: CHANNELS,
    CHANNEL_ORDER: CHANNEL_ORDER,
    PLACE_TYPE_LABELS: PLACE_TYPE_LABELS,
    INDUSTRY_LABELS: INDUSTRY_LABELS,
    INDUSTRY_ORDER: INDUSTRY_ORDER,
    NATIONAL_FESTIVALS: NATIONAL_FESTIVALS,
    INDUSTRY_FESTIVALS: INDUSTRY_FESTIVALS,
    SYNERGY_TEMPLATES: SYNERGY_TEMPLATES,
    hashString: hashString,
    PRESETS: PRESETS
  };
})(window);

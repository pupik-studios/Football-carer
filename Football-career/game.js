"use strict";

const SAVE_KEY = "fc-career-v2";
const TRAIN_COST = 16;
const MATCH_COST = 22;
const REST_GAIN = 50;
const REST_FAST_COST = 100;
const ENERGY_MAX = 100;
const REST_LOCK_MS = 30000;
const REST_FAST_MS = 1000;
const MATCH_EVERY = 2;
const AUTOSAVE_MS = 20000;
const BRIBE_CATCH = 0.7;
const RECORDS_KEY = "fc-records-v1";
const ONLINE_COST = 18;
const ONLINE_LOCK_MS = 40000;

const OUTFIELD_KEYS = ["pace", "shooting", "passing", "dribbling", "defending", "physical"];
const GK_KEYS = ["diving", "handling", "kicking", "reflexes", "speed", "positioning"];
const CB_KEYS = ["marking", "tackling", "heading", "strength", "jumping", "passing"];

const STAT_NAMES = {
    pace: "Скорость",
    shooting: "Удар",
    passing: "Пас",
    dribbling: "Дриблинг",
    defending: "Защита",
    physical: "Физика",
    diving: "Прыжок",
    handling: "Руки",
    kicking: "Вынос",
    reflexes: "Реакция",
    speed: "Скорость",
    positioning: "Позиция",
    marking: "Опека",
    tackling: "Отбор",
    heading: "Голова",
    strength: "Сила",
    jumping: "Прыжок"
};

const STAT_LABELS = {
    pace: "⚡ Скорость",
    shooting: "🎯 Удар",
    passing: "🅰️ Пас",
    dribbling: "🕺 Дриблинг",
    defending: "🛡️ Защита",
    physical: "💪 Физика",
    diving: "🧤 Прыжок",
    handling: "✋ Руки",
    kicking: "🦶 Вынос",
    reflexes: "⚡ Реакция",
    speed: "🏃 Скорость",
    positioning: "📍 Позиция",
    marking: "🛡️ Опека",
    tackling: "🦵 Отбор",
    heading: "🦅 Голова",
    strength: "💪 Сила",
    jumping: "🦘 Прыжок"
};

const START_STATS = {
    ST:  { pace: 64, shooting: 68, passing: 52, dribbling: 60, defending: 32, physical: 58 },
    LW:  { pace: 70, shooting: 58, passing: 56, dribbling: 68, defending: 34, physical: 50 },
    RW:  { pace: 70, shooting: 58, passing: 56, dribbling: 68, defending: 34, physical: 50 },
    CAM: { pace: 58, shooting: 62, passing: 68, dribbling: 66, defending: 38, physical: 52 },
    CM:  { pace: 56, shooting: 52, passing: 68, dribbling: 58, defending: 54, physical: 60 },
    CDM: { pace: 52, shooting: 42, passing: 62, dribbling: 50, defending: 68, physical: 66 },
    CB:  { marking: 70, tackling: 68, heading: 72, strength: 74, jumping: 70, passing: 52 },
    LB:  { pace: 68, shooting: 40, passing: 60, dribbling: 58, defending: 62, physical: 58 },
    RB:  { pace: 68, shooting: 40, passing: 60, dribbling: 58, defending: 62, physical: 58 },
    GK:  { diving: 68, handling: 66, kicking: 58, reflexes: 70, speed: 44, positioning: 67 }
};

const OVR_WEIGHTS = {
    ST:  { pace: 1.2, shooting: 1.7, passing: 0.7, dribbling: 1.1, defending: 0.35, physical: 1.0 },
    LW:  { pace: 1.5, shooting: 1.1, passing: 1.0, dribbling: 1.5, defending: 0.4, physical: 0.7 },
    RW:  { pace: 1.5, shooting: 1.1, passing: 1.0, dribbling: 1.5, defending: 0.4, physical: 0.7 },
    CAM: { pace: 0.9, shooting: 1.2, passing: 1.6, dribbling: 1.3, defending: 0.5, physical: 0.7 },
    CM:  { pace: 0.8, shooting: 0.8, passing: 1.6, dribbling: 1.0, defending: 1.0, physical: 1.1 },
    CDM: { pace: 0.7, shooting: 0.5, passing: 1.2, dribbling: 0.7, defending: 1.6, physical: 1.3 },
    CB:  { marking: 1.6, tackling: 1.55, heading: 1.35, strength: 1.4, jumping: 1.1, passing: 0.75 },
    LB:  { pace: 1.3, shooting: 0.5, passing: 1.1, dribbling: 1.0, defending: 1.2, physical: 1.0 },
    RB:  { pace: 1.3, shooting: 0.5, passing: 1.1, dribbling: 1.0, defending: 1.2, physical: 1.0 },
    GK:  { diving: 1.5, handling: 1.4, kicking: 0.85, reflexes: 1.65, speed: 0.55, positioning: 1.5 }
};

const ROLE = {
    ST:  { goal: 1.4, assist: 0.7, save: 0 },
    LW:  { goal: 1.15, assist: 1.15, save: 0 },
    RW:  { goal: 1.15, assist: 1.15, save: 0 },
    CAM: { goal: 1.05, assist: 1.35, save: 0 },
    CM:  { goal: 0.7, assist: 1.2, save: 0 },
    CDM: { goal: 0.35, assist: 0.8, save: 0 },
    CB:  { goal: 0.2, assist: 0.4, save: 0 },
    LB:  { goal: 0.35, assist: 0.9, save: 0 },
    RB:  { goal: 0.35, assist: 0.9, save: 0 },
    GK:  { goal: 0.03, assist: 0.08, save: 1 }
};

const CLUBS = [
    { name: "Академия", required: 0, city: "Астана", country: "🇰🇿", league: "Молодёжка", color: "#3d5a80", accent: "#ffd83d" },
    { name: "Кайрат", required: 56, city: "Алматы", country: "🇰🇿", league: "КПЛ", color: "#f5c400", accent: "#111111" },
    { name: "Тобол", required: 59, city: "Костанай", country: "🇰🇿", league: "КПЛ", color: "#1e6b3a", accent: "#ffd83d" },
    { name: "FC Astana", required: 62, city: "Астана", country: "🇰🇿", league: "КПЛ", color: "#0b6e4f", accent: "#ffd83d" },
    { name: "Ростов", required: 64, city: "Ростов-на-Дону", country: "🇷🇺", league: "РПЛ", color: "#0033a0", accent: "#ffd83d" },
    { name: "Црвена Звезда", required: 65, city: "Белград", country: "🇷🇸", league: "Суперлига", color: "#c8102e", accent: "#ffffff" },
    { name: "Динамо Москва", required: 66, city: "Москва", country: "🇷🇺", league: "РПЛ", color: "#1c4da1", accent: "#ffffff" },
    { name: "Локомотив", required: 67, city: "Москва", country: "🇷🇺", league: "РПЛ", color: "#a6192e", accent: "#046a38" },
    { name: "Ajax", required: 68, city: "Амстердам", country: "🇳🇱", league: "Eredivisie", color: "#d2122e", accent: "#ffffff" },
    { name: "ЦСКА", required: 70, city: "Москва", country: "🇷🇺", league: "РПЛ", color: "#d52b1e", accent: "#0033a0" },
    { name: "Porto", required: 71, city: "Порту", country: "🇵🇹", league: "Primeira Liga", color: "#003087", accent: "#ffffff" },
    { name: "Спартак", required: 73, city: "Москва", country: "🇷🇺", league: "РПЛ", color: "#e21a23", accent: "#ffffff" },
    { name: "Borussia Dortmund", required: 74, city: "Дортмунд", country: "🇩🇪", league: "Bundesliga", color: "#fde100", accent: "#000000" },
    { name: "Краснодар", required: 76, city: "Краснодар", country: "🇷🇺", league: "РПЛ", color: "#00a650", accent: "#111111" },
    { name: "AC Milan", required: 77, city: "Милан", country: "🇮🇹", league: "Serie A", color: "#ac2a2a", accent: "#111111" },
    { name: "Зенит", required: 78, city: "Санкт-Петербург", country: "🇷🇺", league: "РПЛ", color: "#1b4e9b", accent: "#7ac143" },
    { name: "Atlético Madrid", required: 79, city: "Мадрид", country: "🇪🇸", league: "La Liga", color: "#c8102e", accent: "#ffffff" },
    { name: "Manchester United", required: 81, city: "Манчестер", country: "🇬🇧", league: "Premier League", color: "#da291c", accent: "#ffd83d" },
    { name: "Bayern Munich", required: 84, city: "Мюнхен", country: "🇩🇪", league: "Bundesliga", color: "#dc052d", accent: "#ffffff" },
    { name: "FC Barcelona", required: 87, city: "Барселона", country: "🇪🇸", league: "La Liga", color: "#a50044", accent: "#004d98" },
    { name: "Manchester City", required: 89, city: "Манчестер", country: "🇬🇧", league: "Premier League", color: "#6cabdd", accent: "#1c2c5b" },
    { name: "Real Madrid", required: 92, city: "Мадрид", country: "🇪🇸", league: "La Liga", color: "#f4f4f4", accent: "#ffd83d" }
];

const LEAGUES = [
    { name: "Дворовый чемпионат", required: 0, city: "Район", country: "🇰🇿", league: "Любители", color: "#3d5a80", accent: "#ffd83d" },
    { name: "Вторая лига", required: 56, city: "Регион", country: "🇰🇿", league: "Казахстан", color: "#1e6b3a", accent: "#ffd83d" },
    { name: "ФНЛ", required: 59, city: "Россия", country: "🇷🇺", league: "Первая лига", color: "#1c4da1", accent: "#ffd83d" },
    { name: "КПЛ", required: 62, city: "Астана", country: "🇰🇿", league: "Казахстан", color: "#0b6e4f", accent: "#ffd83d" },
    { name: "РПЛ", required: 66, city: "Москва", country: "🇷🇺", league: "Премьер-лига", color: "#d52b1e", accent: "#0033a0" },
    { name: "Лига конференций", required: 68, city: "Европа", country: "🇪🇺", league: "UEFA", color: "#003087", accent: "#ffffff" },
    { name: "Лига Европы", required: 74, city: "Европа", country: "🇪🇺", league: "UEFA", color: "#fde100", accent: "#000000" },
    { name: "Лига чемпионов", required: 81, city: "Европа", country: "🇪🇺", league: "UEFA", color: "#004d98", accent: "#ffd83d" },
    { name: "Суперклубы", required: 88, city: "Европа", country: "🌍", league: "Элита", color: "#a50044", accent: "#ffd83d" },
    { name: "Финал ЛЧ", required: 92, city: "Мир", country: "🏆", league: "Вершина", color: "#f4f4f4", accent: "#ffd83d" }
];

const LEAGUE_OPPONENTS = {
    "Дворовый чемпионат": ["Двор Север", "Школа №12", "Гараж FC", "Улица Мира"],
    "Вторая лига": ["Каспий", "Тараз", "Атырау", "Окжетпес"],
    "ФНЛ": ["Балтика", "Сочи", "Родина", "Енисей", "СКА-Хабаровск"],
    "КПЛ": ["Кайрат", "Астана", "Тобол", "Ордабасы"],
    "РПЛ": ["ЦСКА", "Спартак", "Зенит", "Краснодар", "Локомотив", "Динамо"],
    "Лига конференций": ["Fiorentina", "AZ", "PAOK", "Union SG"],
    "Лига Европы": ["Leverkusen", "Roma", "West Ham", "Marseille"],
    "Лига чемпионов": ["Bayern", "City", "PSG", "Inter"],
    "Суперклубы": ["Real Madrid", "Barcelona", "Bayern", "City"],
    "Финал ЛЧ": ["Real Madrid", "Bayern", "City", "PSG"]
};

const OPPONENTS = {
    "Академия": ["Кайрат U19", "Астана U19", "Шахтёр U19", "Ордабасы U19"],
    "Кайрат": ["Астана", "Актобе", "Ордабасы", "Тобол"],
    "Тобол": ["Кайрат", "Актобе", "Астана", "Шахтёр"],
    "FC Astana": ["Кайрат", "Тобол", "Ордабасы", "Актобе"],
    "Ростов": ["ЦСКА", "Спартак", "Зенит", "Краснодар"],
    "Црвена Звезда": ["Partizan", "Dinamo Zagreb", "Olympiacos", "PAOK"],
    "Динамо Москва": ["Спартак", "ЦСКА", "Зенит", "Локомотив"],
    "Локомотив": ["ЦСКА", "Спартак", "Динамо", "Зенит"],
    "Ajax": ["PSV", "Feyenoord", "AZ", "Twente"],
    "ЦСКА": ["Спартак", "Зенит", "Динамо", "Краснодар"],
    "Porto": ["Benfica", "Sporting", "Braga", "Guimaraes"],
    "Спартак": ["ЦСКА", "Зенит", "Динамо", "Локомотив"],
    "Borussia Dortmund": ["Bayern", "Leipzig", "Leverkusen", "Gladbach"],
    "Краснодар": ["Зенит", "ЦСКА", "Спартак", "Ростов"],
    "AC Milan": ["Inter", "Juventus", "Napoli", "Roma"],
    "Зенит": ["ЦСКА", "Спартак", "Краснодар", "Динамо"],
    "Atlético Madrid": ["Real Madrid", "Barcelona", "Sevilla", "Villarreal"],
    "Manchester United": ["Liverpool", "City", "Arsenal", "Chelsea"],
    "Bayern Munich": ["Dortmund", "Leipzig", "Leverkusen", "Stuttgart"],
    "FC Barcelona": ["Real Madrid", "Atletico", "Sevilla", "Girona"],
    "Manchester City": ["Arsenal", "Liverpool", "United", "Real Madrid"],
    "Real Madrid": ["Barcelona", "Bayern", "City", "PSG"]
};

const NATIONS = [
    { id: "KZ", flag: "🇰🇿", name: "Казахстан", city: "Астана" },
    { id: "RU", flag: "🇷🇺", name: "Россия", city: "Москва" },
    { id: "UZ", flag: "🇺🇿", name: "Узбекистан", city: "Ташкент" },
    { id: "BY", flag: "🇧🇾", name: "Беларусь", city: "Минск" },
    { id: "UA", flag: "🇺🇦", name: "Украина", city: "Киев" },
    { id: "RS", flag: "🇷🇸", name: "Сербия", city: "Белград" },
    { id: "BR", flag: "🇧🇷", name: "Бразилия", city: "Сан-Паулу" },
    { id: "AR", flag: "🇦🇷", name: "Аргентина", city: "Буэнос-Айрес" },
    { id: "FR", flag: "🇫🇷", name: "Франция", city: "Париж" },
    { id: "DE", flag: "🇩🇪", name: "Германия", city: "Берлин" },
    { id: "ES", flag: "🇪🇸", name: "Испания", city: "Мадрид" },
    { id: "IT", flag: "🇮🇹", name: "Италия", city: "Милан" },
    { id: "PT", flag: "🇵🇹", name: "Португалия", city: "Лиссабон" },
    { id: "GB", flag: "🇬🇧", name: "Англия", city: "Лондон" },
    { id: "NL", flag: "🇳🇱", name: "Нидерланды", city: "Амстердам" },
    { id: "HR", flag: "🇭🇷", name: "Хорватия", city: "Загреб" },
    { id: "NG", flag: "🇳🇬", name: "Нигерия", city: "Лагос" },
    { id: "SN", flag: "🇸🇳", name: "Сенегал", city: "Дакар" },
    { id: "JP", flag: "🇯🇵", name: "Япония", city: "Токио" },
    { id: "TR", flag: "🇹🇷", name: "Турция", city: "Стамбул" }
];

const PLAYER_AVATARS = ["⚽", "😎", "🧔", "🦁", "🐺", "🦅", "🔥", "👑", "🧊", "💫", "🎯", "🧤", "🛡️", "👦", "🥷"];
const CLUB_AVATARS = ["🏟️", "⭐", "🦅", "🐻", "🦁", "🔥", "👑", "💎", "⚡", "🌹", "🧿", "🌙", "🛡️", "🚀"];

const ONLINE_RIVALS = [
    { n: "xGoalzz", a: "😎", p: "ST", c: "Кайрат" },
    { n: "Neftyanik", a: "🦁", p: "ST", c: "ЦСКА" },
    { n: "ПасМастер", a: "🎯", p: "CAM", c: "Спартак" },
    { n: "WallCB", a: "🛡️", p: "CB", c: "Зенит" },
    { n: "Glove99", a: "🧤", p: "GK", c: "Динамо Москва" },
    { n: "WingKing", a: "⚡", p: "RW", c: "Краснодар" },
    { n: "ДворЛегенда", a: "👑", p: "CM", c: "Академия" },
    { n: "RodriFan", a: "🧱", p: "CDM", c: "Manchester City" },
    { n: "IceFinisher", a: "🧊", p: "ST", c: "Real Madrid" },
    { n: "LeftCut", a: "🌪️", p: "LW", c: "FC Barcelona" },
    { n: "Бортовой", a: "➡️", p: "RB", c: "Локомотив" },
    { n: "KazakhPace", a: "🐺", p: "LB", c: "FC Astana" },
    { n: "PenaltyGod", a: "🔥", p: "ST", c: "Bayern Munich" },
    { n: "NoLook", a: "💫", p: "CAM", c: "Ajax" },
    { n: "TackleOnly", a: "🥷", p: "CDM", c: "Atlético Madrid" },
    { n: "U19Boss", a: "👦", p: "CM", c: "Академия" }
];

const ONLINE_CLUBS = [
    { n: "Двор Юг", a: "🏟️", p: "CLUB", c: "Любители" },
    { n: "Гараж United", a: "🔧", p: "CLUB", c: "Любители" },
    { n: "Ночная Смена", a: "🌙", p: "CLUB", c: "ФНЛ" },
    { n: "Астана Prime", a: "⭐", p: "CLUB", c: "КПЛ" },
    { n: "Красный Борт", a: "🦅", p: "CLUB", c: "РПЛ" },
    { n: "Синий Вектор", a: "💎", p: "CLUB", c: "РПЛ" },
    { n: "Europa Dogs", a: "🐺", p: "CLUB", c: "Лига Европы" },
    { n: "UCL Night", a: "👑", p: "CLUB", c: "Лига чемпионов" }
];

const AVATARS = {
    GK: "🧤",
    CB: "🛡️",
    LB: "⬅️",
    RB: "➡️",
    CDM: "🧱",
    CM: "🎯",
    CAM: "🧠",
    LW: "🌪️",
    RW: "⚡",
    ST: "⚽"
};

const TRANSFER_STARS = [
    { id: "kislyak", name: "Кисляк", pos: "CM", ovr: 73, club: "ЦСКА", flag: "🇷🇺", tier: "rpl" },
    { id: "zabolotny", name: "Заболотный", pos: "ST", ovr: 74, club: "ЦСКА", flag: "🇷🇺", tier: "rpl" },
    { id: "kuchaev", name: "Кучаев", pos: "RW", ovr: 75, club: "ЦСКА", flag: "🇷🇺", tier: "rpl" },
    { id: "gajic", name: "Гайич", pos: "RB", ovr: 75, club: "ЦСКА", flag: "🇷🇸", tier: "rpl" },
    { id: "karavaev", name: "Караваев", pos: "RB", ovr: 76, club: "Зенит", flag: "🇷🇺", tier: "rpl" },
    { id: "smolnikov", name: "Смольников", pos: "RB", ovr: 77, club: "Краснодар", flag: "🇷🇺", tier: "rpl" },
    { id: "mfernandes", name: "М. Фернандес", pos: "RB", ovr: 81, club: "ЦСКА", flag: "🇷🇺", tier: "rpl" },
    { id: "krag", name: "Краг", pos: "CB", ovr: 75, club: "ЦСКА", flag: "🇩🇰", tier: "rpl" },
    { id: "fayzullaev", name: "Файзуллаев", pos: "LW", ovr: 76, club: "ЦСКА", flag: "🇺🇿", tier: "rpl" },
    { id: "rocha", name: "Роша", pos: "CB", ovr: 76, club: "ЦСКА", flag: "🇧🇷", tier: "rpl" },
    { id: "diveev", name: "Дивеев", pos: "CB", ovr: 76, club: "ЦСКА", flag: "🇷🇺", tier: "rpl" },
    { id: "moises", name: "Мойзес", pos: "CDM", ovr: 77, club: "ЦСКА", flag: "🇧🇷", tier: "rpl" },
    { id: "chalov", name: "Чалов", pos: "ST", ovr: 77, club: "ЦСКА", flag: "🇷🇺", tier: "rpl" },
    { id: "oblyakov", name: "Обляков", pos: "CM", ovr: 78, club: "ЦСКА", flag: "🇷🇺", tier: "rpl" },
    { id: "akinfeev", name: "Акинфеев", pos: "GK", ovr: 84, club: "ЦСКА", flag: "🇷🇺", tier: "rpl" },
    { id: "glebov", name: "Глебов", pos: "CM", ovr: 76, club: "Ростов", flag: "🇷🇺", tier: "rpl" },
    { id: "osipenko", name: "Осипенко", pos: "CB", ovr: 77, club: "Ростов", flag: "🇷🇺", tier: "rpl" },
    { id: "jikia", name: "Джикия", pos: "CB", ovr: 77, club: "Спартак", flag: "🇬🇪", tier: "rpl" },
    { id: "makarov", name: "Макаров", pos: "RW", ovr: 77, club: "Динамо", flag: "🇷🇺", tier: "rpl" },
    { id: "batxi", name: "Батчи", pos: "RW", ovr: 77, club: "Краснодар", flag: "🇪🇸", tier: "rpl" },
    { id: "fomin", name: "Фомин", pos: "CM", ovr: 78, club: "Динамо", flag: "🇷🇺", tier: "rpl" },
    { id: "alonso", name: "Алонсо", pos: "CB", ovr: 78, club: "Краснодар", flag: "🇪🇸", tier: "rpl" },
    { id: "mostovoy", name: "Мостовой", pos: "LW", ovr: 78, club: "Зенит", flag: "🇷🇺", tier: "rpl" },
    { id: "sobolev", name: "Соболев", pos: "ST", ovr: 78, club: "Спартак", flag: "🇷🇺", tier: "rpl" },
    { id: "cordoba", name: "Кордоба", pos: "ST", ovr: 79, club: "Краснодар", flag: "🇨🇴", tier: "rpl" },
    { id: "tyukavin", name: "Тюкавин", pos: "ST", ovr: 79, club: "Динамо", flag: "🇷🇺", tier: "rpl" },
    { id: "dzyuba", name: "Дзюба", pos: "ST", ovr: 79, club: "Локомотив", flag: "🇷🇺", tier: "rpl" },
    { id: "spertsyan", name: "Сперцян", pos: "CAM", ovr: 80, club: "Краснодар", flag: "🇦🇲", tier: "rpl" },
    { id: "cassierra", name: "Кассьерра", pos: "ST", ovr: 80, club: "Зенит", flag: "🇨🇴", tier: "rpl" },
    { id: "douglas", name: "Дуглас Сантос", pos: "LB", ovr: 80, club: "Зенит", flag: "🇧🇷", tier: "rpl" },
    { id: "miranchuk", name: "Миранчук", pos: "CAM", ovr: 81, club: "Локомотив", flag: "🇷🇺", tier: "rpl" },
    { id: "wendel", name: "Вендел", pos: "CM", ovr: 81, club: "Зенит", flag: "🇧🇷", tier: "rpl" },
    { id: "promes", name: "Промес", pos: "RW", ovr: 82, club: "Спартак", flag: "🇳🇱", tier: "rpl" },
    { id: "barrios", name: "Барриос", pos: "CDM", ovr: 82, club: "Зенит", flag: "🇨🇴", tier: "rpl" },
    { id: "claudinho", name: "Клаудинйо", pos: "CAM", ovr: 82, club: "Зенит", flag: "🇧🇷", tier: "rpl" },
    { id: "malcom", name: "Малком", pos: "LW", ovr: 83, club: "Зенит", flag: "🇧🇷", tier: "rpl" },
    { id: "frimpong", name: "Фримпонг", pos: "RB", ovr: 84, club: "Leverkusen", flag: "🇳🇱", tier: "eu" },
    { id: "walker", name: "Уокер", pos: "RB", ovr: 84, club: "City", flag: "🇬🇧", tier: "eu" },
    { id: "osimhen", name: "Осимхен", pos: "ST", ovr: 85, club: "Наполи", flag: "🇳🇬", tier: "eu" },
    { id: "kvara", name: "Кварацхелия", pos: "LW", ovr: 86, club: "Наполи", flag: "🇬🇪", tier: "eu" },
    { id: "barella", name: "Барелла", pos: "CM", ovr: 86, club: "Интер", flag: "🇮🇹", tier: "eu" },
    { id: "rodri", name: "Родри", pos: "CDM", ovr: 90, club: "City", flag: "🇪🇸", tier: "eu" },
    { id: "lewandowski", name: "Левандовски", pos: "ST", ovr: 88, club: "Barcelona", flag: "🇵🇱", tier: "eu" },
    { id: "valverde", name: "Вальверде", pos: "CM", ovr: 88, club: "Real Madrid", flag: "🇺🇾", tier: "eu" },
    { id: "vinicius", name: "Винисиус", pos: "LW", ovr: 89, club: "Real Madrid", flag: "🇧🇷", tier: "eu" },
    { id: "bellingham", name: "Беллингем", pos: "CM", ovr: 89, club: "Real Madrid", flag: "🇬🇧", tier: "eu" },
    { id: "kane", name: "Кейн", pos: "ST", ovr: 89, club: "Bayern", flag: "🇬🇧", tier: "eu" },
    { id: "debruyne", name: "Де Брёйне", pos: "CAM", ovr: 89, club: "City", flag: "🇧🇪", tier: "eu" },
    { id: "salah", name: "Салах", pos: "RW", ovr: 89, club: "Liverpool", flag: "🇪🇬", tier: "eu" },
    { id: "vandijk", name: "Ван Дейк", pos: "CB", ovr: 89, club: "Liverpool", flag: "🇳🇱", tier: "eu" },
    { id: "trent", name: "Трент", pos: "RB", ovr: 86, club: "Liverpool", flag: "🇬🇧", tier: "eu" },
    { id: "hakimi", name: "Хакими", pos: "RB", ovr: 86, club: "PSG", flag: "🇲🇦", tier: "eu" },
    { id: "carvajal", name: "Карвахаль", pos: "RB", ovr: 86, club: "Real Madrid", flag: "🇪🇸", tier: "eu" },
    { id: "makelele", name: "Макелеле", pos: "CDM", ovr: 89, club: "Real Madrid", flag: "🇫🇷", tier: "leg" },
    { id: "carlos", name: "Р. Карлос", pos: "LB", ovr: 90, club: "Real Madrid", flag: "🇧🇷", tier: "leg" },
    { id: "marcelo", name: "Марсело", pos: "LB", ovr: 90, club: "Real Madrid", flag: "🇧🇷", tier: "leg" },
    { id: "hierro", name: "Йерро", pos: "CB", ovr: 90, club: "Real Madrid", flag: "🇪🇸", tier: "leg" },
    { id: "redondo", name: "Редондо", pos: "CM", ovr: 90, club: "Real Madrid", flag: "🇦🇷", tier: "leg" },
    { id: "bale", name: "Бэйл", pos: "RW", ovr: 90, club: "Real Madrid", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", tier: "leg" },
    { id: "courtois", name: "Куртуа", pos: "GK", ovr: 90, club: "Real Madrid", flag: "🇧🇪", tier: "eu" },
    { id: "cafu", name: "Кафу", pos: "RB", ovr: 91, club: "Milan", flag: "🇧🇷", tier: "leg" },
    { id: "zanetti", name: "Санетти", pos: "RB", ovr: 90, club: "Inter", flag: "🇦🇷", tier: "leg" },
    { id: "casillas", name: "Касильяс", pos: "GK", ovr: 91, club: "Real Madrid", flag: "🇪🇸", tier: "leg" },
    { id: "raul", name: "Рауль", pos: "ST", ovr: 91, club: "Real Madrid", flag: "🇪🇸", tier: "leg" },
    { id: "kroos", name: "Кроос", pos: "CM", ovr: 91, club: "Real Madrid", flag: "🇩🇪", tier: "leg" },
    { id: "figo", name: "Фигу", pos: "RW", ovr: 91, club: "Real Madrid", flag: "🇵🇹", tier: "leg" },
    { id: "mbappe", name: "Мбаппе", pos: "ST", ovr: 91, club: "Real Madrid", flag: "🇫🇷", tier: "eu" },
    { id: "haaland", name: "Холанд", pos: "ST", ovr: 91, club: "City", flag: "🇳🇴", tier: "eu" },
    { id: "ramos", name: "Рамос", pos: "CB", ovr: 92, club: "Real Madrid", flag: "🇪🇸", tier: "leg" },
    { id: "benzema", name: "Бензема", pos: "ST", ovr: 92, club: "Real Madrid", flag: "🇫🇷", tier: "leg" },
    { id: "modric", name: "Модрич", pos: "CM", ovr: 93, club: "Real Madrid", flag: "🇭🇷", tier: "leg" },
    { id: "puskas", name: "Пушкаш", pos: "ST", ovr: 93, club: "Real Madrid", flag: "🇭🇺", tier: "leg" },
    { id: "zidane", name: "Зидан", pos: "CAM", ovr: 94, club: "Real Madrid", flag: "🇫🇷", tier: "leg" },
    { id: "distefano", name: "Ди Стефано", pos: "ST", ovr: 94, club: "Real Madrid", flag: "🇦🇷", tier: "leg" },
    { id: "cr7", name: "Роналду", pos: "ST", ovr: 95, club: "Real Madrid", flag: "🇵🇹", tier: "leg" }
];

let player = newPlayer("");
let selectedMode = "player";
let selectedNation = "KZ";
let selectedAvatar = "⚽";
let marketFilter = "all";
let marketPos = "all";
let lastOvr = null;
let lastRespect = null;
let lastFame = null;
let restTimer = null;
let autoSaveTimer = null;
let matchBusy = false;
let fxTimer = null;
let onlineTimer = null;
let onlineRival = null;

function newPlayer(name, position, nation, avatar) {
    const pos = position || "ST";
    const nat = nationById(nation);
    return {
        name: name || "",
        position: pos,
        club: "Академия",
        age: 16,
        week: 1,
        energy: ENERGY_MAX,
        matches: 0,
        goals: 0,
        assists: 0,
        saves: 0,
        cleanSheets: 0,
        tackles: 0,
        conceded: 0,
        lastMatch: null,
        restUntil: 0,
        respect: 0,
        fame: 50,
        mode: "player",
        nation: nat.id,
        avatar: avatar || AVATARS[pos] || "⚽",
        squad: [],
        grid: [],
        nextMatchWeek: 2,
        nextOpponent: null,
        lastSaveAt: 0,
        onlineWins: 0,
        onlineLosses: 0,
        onlineUntil: 0,
        codeMadrid: false,
        stats: Object.assign({}, START_STATS[pos] || START_STATS.ST)
    };
}

function newClub(name, city, nation, avatar) {
    const nat = nationById(nation);
    return {
        mode: "club",
        name: name,
        position: "CLUB",
        club: "Дворовый чемпионат",
        city: city || nat.city,
        country: nat.flag,
        color: "#0b6e4f",
        accent: "#ffd83d",
        age: 0,
        week: 1,
        energy: ENERGY_MAX,
        matches: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goals: 0,
        conceded: 0,
        assists: 0,
        saves: 0,
        lastMatch: null,
        restUntil: 0,
        respect: 0,
        fame: 50,
        nation: nat.id,
        avatar: avatar || "🏟️",
        squad: [],
        grid: [],
        nextMatchWeek: 2,
        nextOpponent: null,
        lastSaveAt: 0,
        onlineWins: 0,
        onlineLosses: 0,
        onlineUntil: 0,
        codeMadrid: false,
        stats: {
            pace: 55,
            shooting: 56,
            passing: 55,
            dribbling: 54,
            defending: 55,
            physical: 56
        }
    };
}

function isClub() {
    return player.mode === "club";
}

function isGk() {
    return !isClub() && player.position === "GK";
}

function isCb() {
    return !isClub() && player.position === "CB";
}

function nationById(id) {
    return NATIONS.find((n) => n.id === id) || NATIONS[0];
}

function nationLabel(id) {
    const nat = nationById(id);
    return nat.flag + " " + nat.name;
}

function statKeys() {
    if (isGk()) return GK_KEYS;
    if (isCb()) return CB_KEYS;
    return OUTFIELD_KEYS;
}

function migrateGkStats(data) {
    if (!data || data.position !== "GK" || !data.stats) return;
    if (typeof data.stats.diving === "number") return;
    const s = data.stats;
    data.stats = {
        diving: s.defending || 68,
        handling: Math.round(((s.defending || 66) + (s.physical || 66)) / 2),
        kicking: s.passing || 58,
        reflexes: Math.max(s.physical || 60, s.defending || 60),
        speed: s.pace || 44,
        positioning: s.defending || 67
    };
}

function migrateCbStats(data) {
    if (!data || data.position !== "CB" || !data.stats) return;
    if (typeof data.stats.marking === "number") return;
    const s = data.stats;
    data.stats = {
        marking: s.defending || 70,
        tackling: s.defending || 68,
        heading: s.physical || 72,
        strength: s.physical || 74,
        jumping: Math.round(((s.physical || 70) + (s.pace || 48)) / 2),
        passing: s.passing || 52
    };
}

function get(id) {
    return document.getElementById(id);
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function money(n) {
    return "$" + (n || 0);
}

function fameValue() {
    return clamp(typeof player.fame === "number" ? player.fame : 50, 0, 99);
}

function fameRank(n) {
    if (n >= 90) return "легенда";
    if (n >= 75) return "звезда";
    if (n >= 60) return "уважение";
    if (n >= 40) return "норма";
    if (n >= 20) return "пятно";
    return "скандал";
}

function addFame(n) {
    if (!n) return 0;
    const before = fameValue();
    player.fame = clamp(before + n, 0, 99);
    return player.fame - before;
}

function getOverall() {
    if (isClub()) {
        const values = Object.values(player.stats);
        let total = 0;
        values.forEach((n) => { total += n; });
        return Math.round(total / values.length);
    }
    const keys = statKeys();
    const weights = isGk() ? OVR_WEIGHTS.GK : isCb() ? OVR_WEIGHTS.CB : (OVR_WEIGHTS[player.position] || OVR_WEIGHTS.ST);
    let total = 0;
    let weight = 0;
    keys.forEach((key) => {
        const w = weights[key] || 1;
        total += (player.stats[key] || 0) * w;
        weight += w;
    });
    return Math.round(total / weight);
}

function clubByName(name) {
    const list = isClub() ? LEAGUES : CLUBS;
    return list.find((club) => club.name === name) || list[0];
}

function save() {
    if (player && player.name) player.lastSaveAt = Date.now();
    localStorage.setItem(SAVE_KEY, JSON.stringify(player));
    updateRecords();
    updateSaveUI();
}

function formatClock(ts) {
    if (!ts) return "—";
    const d = new Date(ts);
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return hh + ":" + mm;
}

function updateSaveUI() {
    const el = get("saveHint");
    if (!el) return;
    el.textContent = player.lastSaveAt
        ? "💾 Автосохранение · последнее " + formatClock(player.lastSaveAt)
        : "💾 Автосохранение каждые 20 сек";
}

function startAutoSave() {
    if (autoSaveTimer) clearInterval(autoSaveTimer);
    autoSaveTimer = setInterval(function () {
        if (!player.name || !document.body.classList.contains("in-career")) return;
        save();
    }, AUTOSAVE_MS);
}

function stopAutoSave() {
    if (autoSaveTimer) {
        clearInterval(autoSaveTimer);
        autoSaveTimer = null;
    }
}

function opponentPool() {
    const table = isClub() ? LEAGUE_OPPONENTS : OPPONENTS;
    return table[player.club] || table["Академия"] || table["Дворовый чемпионат"] || ["Соперник"];
}

function pickOpponent() {
    const list = opponentPool();
    return list[Math.floor(Math.random() * list.length)];
}

function makeGrid(fromWeek, count) {
    const pool = opponentPool();
    const rows = [];
    let week = fromWeek;
    let last = "";
    for (let i = 0; i < count; i++) {
        let opp = pool[i % pool.length];
        if (opp === last) opp = pool[(i + 1) % pool.length];
        last = opp;
        rows.push({
            week: week,
            opp: opp,
            home: i % 2 === 0,
            score: "",
            pens: "",
            result: ""
        });
        week += MATCH_EVERY;
    }
    return rows;
}

function pendingFixture() {
    ensureCalendar();
    return (player.grid || []).find((row) => !row.result) || null;
}

function ensureCalendar() {
    if (!Array.isArray(player.grid)) player.grid = [];
    if (!player.grid.length) {
        const start = typeof player.nextMatchWeek === "number" ? player.nextMatchWeek : 2;
        player.grid = makeGrid(Math.max(start, player.week || 1), 8);
    }
    let next = player.grid.find((row) => !row.result);
    if (!next) {
        const lastWeek = player.grid[player.grid.length - 1].week;
        player.grid = player.grid.concat(makeGrid(lastWeek + MATCH_EVERY, 8));
        next = player.grid.find((row) => !row.result);
    }
    player.nextMatchWeek = next.week;
    player.nextOpponent = next.opp;
}

function scheduleNextMatch() {
    ensureCalendar();
}

function runPens(delta) {
    let us = 0;
    let them = 0;
    const seq = [];
    function chance(isUs) {
        let p = isUs ? 0.72 + delta * 0.1 : 0.68 - delta * 0.1;
        if (isGk() && !isUs) p -= 0.14;
        if (isGk() && isUs) p += 0.05;
        if (isClub()) p += isUs ? 0.04 : 0;
        return clamp(p, 0.34, 0.9);
    }
    function take(isUs) {
        const hit = Math.random() < chance(isUs);
        if (isUs) {
            if (hit) us += 1;
        } else if (hit) them += 1;
        seq.push(hit ? "⚽" : "❌");
        return hit;
    }
    for (let i = 0; i < 5; i++) {
        take(true);
        take(false);
        const left = 4 - i;
        if (us > them + left || them > us + left) break;
    }
    while (us === them && seq.length < 24) {
        take(true);
        take(false);
    }
    return { us: us, them: them, win: us > them, seq: seq };
}

function updateGridUI() {
    const box = get("matchGrid");
    if (!box) return;
    ensureCalendar();
    box.innerHTML = "";
    const rows = player.grid || [];
    const done = rows.filter((row) => row.result);
    const todo = rows.filter((row) => !row.result);
    const shown = done.slice(-6).concat(todo);
    const pending = todo[0];
    shown.forEach((row) => {
        const el = document.createElement("div");
        el.className = "grid-row";
        if (row.result) el.classList.add("done", row.result);
        if (pending && row === pending) el.classList.add("now");
        const week = document.createElement("span");
        week.className = "gw";
        week.textContent = "Н" + row.week;
        const who = document.createElement("span");
        who.className = "gwho";
        who.textContent = (row.home ? "дом vs " : "выезд @ ") + row.opp;
        const sc = document.createElement("span");
        sc.className = "gsc";
        if (row.result) {
            sc.textContent = row.score + (row.pens ? " (" + row.pens + " пен.)" : "");
        } else if (pending && row === pending) {
            sc.textContent = "сейчас";
        } else {
            sc.textContent = "—";
        }
        el.appendChild(week);
        el.appendChild(who);
        el.appendChild(sc);
        box.appendChild(el);
    });
}

function matchDue() {
    ensureCalendar();
    return player.week >= player.nextMatchWeek;
}

function weeksUntilMatch() {
    ensureCalendar();
    return Math.max(0, player.nextMatchWeek - player.week);
}

function updateScheduleUI() {
    ensureCalendar();
    const due = matchDue();
    const wait = weeksUntilMatch();
    const opp = player.nextOpponent || pickOpponent();
    const box = get("fixtureBox");
    const label = get("fixtureLabel");
    const next = get("fixtureNext");
    const hint = get("fixtureHint");
    const matchBtn = get("matchBtn");
    const dockMatch = get("dockMatch");
    const canPlay = due && !matchBusy && player.energy >= MATCH_COST;

    if (box) box.classList.toggle("due", due);
    if (label) label.textContent = due ? "Игровой день" : "Следующий матч";
    if (next) {
        next.textContent = due
            ? "vs " + opp
            : "Неделя " + player.nextMatchWeek + " · vs " + opp;
    }
    if (hint) {
        hint.textContent = due
            ? "Сегодня игра. Ничья → серия пенальти. Лишний матч сыграть нельзя."
            : ("Матч раз в " + MATCH_EVERY + " недели. Ещё " + wait + (wait === 1 ? " неделя" : " нед.") + " — тренируйся до игрового дня.");
    }
    if (matchBtn) {
        matchBtn.disabled = !canPlay;
        matchBtn.textContent = due
            ? (player.energy < MATCH_COST ? "⚡ МАЛО ЭНЕРГИИ" : "⚽ ИГРАТЬ · vs " + opp)
            : "📅 ЧЕРЕЗ " + wait + (wait === 1 ? " НЕДЕЛЮ" : " НЕД.") + " · vs " + opp;
    }
    if (dockMatch) {
        dockMatch.disabled = !canPlay;
        dockMatch.textContent = due
            ? (player.energy < MATCH_COST ? "⚡ Энергия" : "⚽ Матч")
            : "📅 " + wait + "нед";
    }
    const bribeBtn = get("bribeBtn");
    const fee = bribeCost();
    const canBribe = canPlay && (player.respect || 0) >= fee;
    if (bribeBtn) {
        bribeBtn.disabled = !canBribe;
        bribeBtn.textContent = !due
            ? "🤫 ПОДКУП ПОСЛЕ ИГРОВОГО ДНЯ"
            : (player.energy < MATCH_COST
                ? "⚡ МАЛО ЭНЕРГИИ"
                : ((player.respect || 0) < fee
                    ? "🤫 НУЖНО " + money(fee)
                    : "🤫 ПОДКУП · " + money(fee) + " · 70% штраф"));
    }
    updateGridUI();
}

function bribeCost() {
    const req = clubByName(player.club).required;
    return 35 + Math.round(req * 0.65);
}

function fineCost() {
    return Math.round(bribeCost() * 2.2);
}

function emptyRecords() {
    return {
        respect: 0,
        fame: 0,
        ovr: 0,
        goals: 0,
        matches: 0,
        club: "—",
        clubReq: -1,
        name: ""
    };
}

function loadRecords() {
    try {
        const data = JSON.parse(localStorage.getItem(RECORDS_KEY) || "null");
        return data && typeof data.respect === "number" ? data : emptyRecords();
    } catch (err) {
        return emptyRecords();
    }
}

function updateRecords() {
    if (!player.name) return;
    const rec = loadRecords();
    const ovr = getOverall();
    const req = clubByName(player.club).required;
    const respect = player.respect || 0;
    const fame = fameValue();
    if (fame > (rec.fame || 0)) rec.fame = fame;
    if (respect > rec.respect) {
        rec.respect = respect;
        rec.name = player.name;
    }
    if (ovr > rec.ovr) rec.ovr = ovr;
    if (player.goals > rec.goals) rec.goals = player.goals;
    if (player.matches > rec.matches) rec.matches = player.matches;
    if (req > rec.clubReq) {
        rec.club = isClub() ? player.name : player.club;
        rec.clubReq = req;
    }
    localStorage.setItem(RECORDS_KEY, JSON.stringify(rec));
    renderRecords();
}

function renderRecords() {
    const rec = loadRecords();
    const rows = [
        ["$", rec.respect],
        ["Реп", rec.fame || 0],
        ["OVR", rec.ovr],
        ["Голы", rec.goals],
        ["Клуб", rec.club || "—"]
    ];
    ["recordsCreate", "recordsCareer"].forEach((id) => {
        const el = get(id);
        if (!el) return;
        el.textContent = "";
        rows.forEach((row) => {
            const box = document.createElement("div");
            box.className = "record";
            const small = document.createElement("small");
            small.textContent = row[0];
            const b = document.createElement("b");
            b.textContent = String(row[1]);
            box.appendChild(small);
            box.appendChild(b);
            el.appendChild(box);
        });
    });
}

function load() {
    try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return false;
        const data = JSON.parse(raw);
        if (!data || !data.name) return false;
        player = data;
        if (typeof player.energy !== "number") player.energy = ENERGY_MAX;
        if (typeof player.week !== "number") player.week = 1;
        if (typeof player.saves !== "number") player.saves = 0;
        if (typeof player.restUntil !== "number") player.restUntil = 0;
        if (typeof player.respect !== "number") player.respect = 0;
        if (typeof player.fame !== "number") player.fame = 50;
        if (typeof player.onlineWins !== "number") player.onlineWins = 0;
        if (typeof player.onlineLosses !== "number") player.onlineLosses = 0;
        if (typeof player.onlineUntil !== "number") player.onlineUntil = 0;
        if (!player.codeMadrid) player.codeMadrid = false;
        if (!player.mode) player.mode = "player";
        if (typeof player.wins !== "number") player.wins = 0;
        if (typeof player.draws !== "number") player.draws = 0;
        if (typeof player.losses !== "number") player.losses = 0;
        if (typeof player.conceded !== "number") player.conceded = 0;
        if (typeof player.cleanSheets !== "number") player.cleanSheets = 0;
        if (typeof player.tackles !== "number") player.tackles = 0;
        if (!player.nation) player.nation = "KZ";
        if (!player.avatar) {
            player.avatar = player.mode === "club" ? "🏟️" : (AVATARS[player.position] || "⚽");
        }
        if (!Array.isArray(player.squad)) player.squad = [];
        if (!Array.isArray(player.grid)) player.grid = [];
        migrateGkStats(player);
        migrateCbStats(player);
        ensureCalendar();
        grantPendingPromo();
        return true;
    } catch (err) {
        return false;
    }
}

function addLog(text, kind) {
    const log = get("log");
    if (!log) return;
    const item = document.createElement("div");
    item.className = kind ? "log " + kind : "log";
    item.textContent = text;
    log.prepend(item);
    while (log.children.length > 40) log.removeChild(log.lastChild);
}

function statTint(n) {
    if (n >= 85) return "#32d583";
    if (n >= 70) return "#ffd83d";
    if (n >= 50) return "#f59e0b";
    return "#e57373";
}

function updateStats() {
    const keys = statKeys();
    const rows = document.querySelectorAll("#statList .stat");
    keys.forEach((key, i) => {
        const row = rows[i];
        if (!row) return;
        const label = row.querySelector("span");
        const value = row.querySelector("b");
        const bar = row.querySelector("i");
        const n = player.stats[key];
        if (label) {
            label.textContent = isClub()
                ? ({ pace: "Темп", shooting: "Атака", passing: "Пас", dribbling: "Техника", defending: "Оборона", physical: "Физика" }[key])
                : (STAT_LABELS[key] || STAT_NAMES[key]);
        }
        if (value) value.textContent = n;
        if (bar) {
            bar.style.width = n + "%";
            bar.style.background = statTint(n);
        }
    });
}

function updateOverall() {
    const el = get("ovrDisplay");
    if (!el) return;
    const ovr = getOverall();
    el.textContent = ovr;
    if (lastOvr !== null && ovr !== lastOvr) {
        const box = el.parentElement;
        box.classList.remove("pop");
        void box.offsetWidth;
        box.classList.add("pop");
    }
    lastOvr = ovr;
}

function updateRespect() {
    const el = get("respectDisplay");
    if (!el) return;
    const value = player.respect || 0;
    el.textContent = money(value);
    if (lastRespect !== null && value !== lastRespect) {
        const box = el.parentElement;
        box.classList.remove("pop");
        void box.offsetWidth;
        box.classList.add("pop");
    }
    lastRespect = value;
}

function updateFame() {
    const el = get("fameDisplay");
    const label = get("fameLabel");
    const box = el && el.parentElement;
    const value = fameValue();
    if (el) el.textContent = value;
    if (label) label.textContent = fameRank(value);
    if (box) {
        box.classList.toggle("low", value < 40);
        box.classList.toggle("high", value >= 75);
        if (lastFame !== null && value !== lastFame) {
            box.classList.remove("pop");
            void box.offsetWidth;
            box.classList.add("pop");
        }
    }
    lastFame = value;
}

function updateEnergy() {
    const fill = get("energyFill");
    const label = get("energyDisplay");
    if (label) label.textContent = player.energy;
    if (fill) {
        fill.style.width = player.energy + "%";
        fill.classList.toggle("low", player.energy < 24);
    }
}

function updateCareerNumbers() {
    const clubMode = isClub();
    get("matches").textContent = player.matches;
    get("goals").textContent = player.goals;
    get("assists").textContent = player.assists;
    get("saves").textContent = player.saves;
    if (get("wins")) get("wins").textContent = player.wins || 0;
    if (get("draws")) get("draws").textContent = player.draws || 0;
    if (get("losses")) get("losses").textContent = player.losses || 0;
    if (get("conceded")) get("conceded").textContent = player.conceded || 0;
    const savesRow = get("savesRow");
    const gk = isGk();
    if (savesRow) savesRow.hidden = clubMode || !gk;
    if (get("winsRow")) get("winsRow").hidden = !clubMode;
    if (get("assistsRow")) get("assistsRow").hidden = clubMode || gk;
    if (get("goalsRow")) get("goalsRow").hidden = gk;
    if (get("concededRow")) get("concededRow").hidden = !clubMode;
    if (get("cleanRow")) {
        get("cleanRow").hidden = !gk && !isCb();
        if (get("cleanSheets")) get("cleanSheets").textContent = player.cleanSheets || 0;
    }
    if (get("gkConcededRow")) {
        get("gkConcededRow").hidden = !gk;
        if (get("gkConceded")) get("gkConceded").textContent = player.conceded || 0;
    }
    if (get("tacklesRow")) {
        get("tacklesRow").hidden = !isCb();
        if (get("tackles")) get("tackles").textContent = player.tackles || 0;
    }
    const rec = get("onlineRecord");
    if (rec) rec.textContent = (player.onlineWins || 0) + "–" + (player.onlineLosses || 0);
    const last = get("lastMatch");
    if (last) {
        if (player.lastMatch) {
            last.className = "last-match " + player.lastMatch.result;
            last.textContent = player.lastMatch.text;
        } else {
            last.className = "last-match";
            last.textContent = "Пока нет матчей";
        }
    }
}

function updateHeader() {
    const clubMode = isClub();
    get("playerNameDisplay").textContent = player.name;
    get("labelNation").textContent = clubMode ? "Страна" : "Нация";
    get("nationDisplay").textContent = nationLabel(player.nation);
    get("labelPosition").textContent = clubMode ? "Город" : "Позиция";
    get("positionDisplay").textContent = clubMode ? (player.city || "Астана") : player.position;
    get("labelClub").textContent = clubMode ? "Лига" : "Клуб";
    get("clubDisplay").textContent = player.club;
    if (get("clubLine")) get("clubLine").textContent = player.club;
    if (get("futPos")) get("futPos").textContent = clubMode ? "CLB" : player.position;
    get("ageDisplay").textContent = player.age;
    get("weekDisplay").textContent = player.week;
    if (get("weekDisplayClub")) get("weekDisplayClub").textContent = player.week;
    get("ageLine").hidden = clubMode;
    if (get("weekLine")) get("weekLine").hidden = !clubMode;
    get("avatar").textContent = player.avatar || (clubMode ? "🏟️" : (AVATARS[player.position] || "⚽"));
    if (get("careerTitle")) {
        get("careerTitle").textContent = clubMode ? "Мой клуб" : "Моя карьера";
    }
    if (get("tabClub")) get("tabClub").textContent = clubMode ? "Клуб" : "Клубы";
    if (get("transfersTitle")) {
        get("transfersTitle").textContent = clubMode ? "📈 Лиги" : "🔄 Трансферы";
    }
    if (get("marketCard")) get("marketCard").hidden = !clubMode;
    if (get("squadCard")) get("squadCard").hidden = !clubMode;
    if (get("trainHint")) {
        get("trainHint").textContent = clubMode
            ? "Тренировка состава: −16 энергии. Отдых +50 бесплатно (30 сек) или 100% за $100 (1 сек)."
            : isGk()
                ? "Вратарские тренировки. Отдых +50 бесплатно (30 сек) или 100% за $100 (1 сек)."
                : isCb()
                    ? "Тренировки ЦЗ. Отдых +50 бесплатно (30 сек) или 100% за $100 (1 сек)."
                    : "Тренировка: −16 энергии, +1 неделя. Отдых +50 бесплатно (30 сек) или 100% за $100 (1 сек).";
    }
}

function updateTrainButtons() {
    const gain = trainGain();
    const keys = statKeys();
    const clubLabels = {
        pace: "⚡ Темп",
        shooting: "🎯 Атака",
        passing: "🅰️ Пас",
        dribbling: "🕺 Техника",
        defending: "🛡️ Оборона",
        physical: "💪 Физика"
    };
    document.querySelectorAll("[data-train]").forEach((button, i) => {
        const key = keys[i];
        if (!key) return;
        button.setAttribute("data-train", key);
        const label = isClub() ? clubLabels[key] : STAT_LABELS[key];
        button.textContent = label + " +" + gain;
    });
}

function renderAll() {
    updateHeader();
    updateStats();
    updateOverall();
    updateRespect();
    updateFame();
    updateEnergy();
    updateCareerNumbers();
    updateTrainButtons();
    updateClubs();
    updateSquad();
    updateMarket();
    applyClubAura();
    updateRestLockUI();
    updateScheduleUI();
    updateOnlineUI();
    updateSaveUI();
}

function showModeScreen() {
    get("modeScreen").style.display = "block";
    get("createScreen").style.display = "none";
    get("careerScreen").style.display = "none";
    if (get("auctionScreen")) get("auctionScreen").style.display = "none";
    document.body.classList.remove("in-career", "mode-club", "in-auction");
    if (get("auctionScreen")) {
        get("auctionScreen").hidden = true;
        get("auctionScreen").style.display = "none";
    }
    document.documentElement.style.removeProperty("--club");
    document.documentElement.style.removeProperty("--club-accent");
    hideAura();
    closeOnlineLobby();
    matchBusy = false;
    stopAutoSave();
    updateContinueBtn();
}

function updateContinueBtn() {
    const btn = get("continueBtn");
    const meta = get("continueMeta");
    if (!btn) return;
    const has = !!(player && player.name);
    btn.hidden = !has;
    if (!has || !meta) return;
    meta.textContent = isClub()
        ? (player.name + " · " + player.club + " · неделя " + player.week)
        : (player.name + " · " + player.position + " · " + player.club);
}

function exitToMenu() {
    Sfx.unlock();
    Sfx.click();
    if (player && player.name) save();
    showModeScreen();
    renderRecords();
}

function selectMode(mode) {
    Sfx.unlock();
    Sfx.click();
    selectedMode = mode;
    get("modeScreen").style.display = "none";
    get("createScreen").style.display = "block";
    get("playerFields").hidden = mode !== "player";
    get("clubFields").hidden = mode !== "club";
    get("createTitle").textContent = mode === "club"
        ? "Создай свой клуб"
        : "Создай своего футболиста";
    if (get("createHeading")) {
        get("createHeading").textContent = mode === "club" ? "Новый клуб" : "Новый игрок";
    }
    get("startBtn").textContent = mode === "club"
        ? "Начать клуб"
        : "Начать карьеру";
    if (mode === "club") {
        selectedAvatar = CLUB_AVATARS[0];
        get("clubName").focus();
        const nat = nationById(selectedNation);
        get("clubCity").placeholder = "Город (например " + nat.city + ")";
    } else {
        selectedAvatar = PLAYER_AVATARS[0];
        get("playerName").focus();
    }
    renderCreatePicks();
}

function renderCreatePicks() {
    const nationBox = get("nationPick");
    const avatarBox = get("avatarPick");
    if (!nationBox || !avatarBox) return;
    const avatars = selectedMode === "club" ? CLUB_AVATARS : PLAYER_AVATARS;
    if (avatars.indexOf(selectedAvatar) < 0) selectedAvatar = avatars[0];

    nationBox.innerHTML = "";
    NATIONS.forEach((nat) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = nat.flag + " " + nat.name;
        if (nat.id === selectedNation) btn.classList.add("on");
        btn.addEventListener("click", function () {
            Sfx.click();
            selectedNation = nat.id;
            if (selectedMode === "club") {
                get("clubCity").placeholder = "Город (например " + nat.city + ")";
            }
            renderCreatePicks();
        });
        nationBox.appendChild(btn);
    });

    avatarBox.innerHTML = "";
    avatars.forEach((face) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = face;
        if (face === selectedAvatar) btn.classList.add("on");
        btn.addEventListener("click", function () {
            Sfx.click();
            selectedAvatar = face;
            renderCreatePicks();
        });
        avatarBox.appendChild(btn);
    });
}

function showCareer() {
    get("modeScreen").style.display = "none";
    get("createScreen").style.display = "none";
    get("careerScreen").style.display = "block";
    if (get("auctionScreen")) get("auctionScreen").style.display = "none";
    document.body.classList.remove("in-auction");
    document.body.classList.toggle("mode-club", isClub());
    document.body.classList.add("in-career");
    if (get("auctionScreen")) {
        get("auctionScreen").hidden = true;
        get("auctionScreen").style.display = "none";
    }
    ensureCalendar();
    renderAll();
    startAutoSave();
    showPanel("home");
}

function showPanel(id) {
    document.querySelectorAll(".panel").forEach(function (panel) {
        panel.classList.toggle("on", panel.getAttribute("data-panel") === id);
    });
    document.querySelectorAll(".career-tabs button").forEach(function (btn) {
        btn.classList.toggle("on", btn.getAttribute("data-panel") === id);
    });
}

function advanceWeek() {
    player.week += 1;
    const nextAge = 16 + Math.floor((player.week - 1) / 36);
    if (nextAge > player.age) {
        player.age = nextAge;
        addLog("🎂 День рождения! Теперь " + player.age + " лет");
        Sfx.ding();
        if (player.age >= 30) {
            addLog("⚠️ После 30 тренировка даёт только +1");
        }
    }
}

function needEnergy(cost) {
    if (player.energy >= cost) return true;
    Sfx.error();
    addLog("⚠️ Мало энергии. Восстановись!");
    return false;
}

function restLocked() {
    return Date.now() < (player.restUntil || 0);
}

function restRemain() {
    return Math.max(0, Math.ceil(((player.restUntil || 0) - Date.now()) / 1000));
}

function updateRestLockUI() {
    const locked = restLocked();
    const seconds = restRemain();
    document.querySelectorAll("[data-train]").forEach((button) => {
        button.disabled = locked;
    });
    const restBtn = get("restBtn");
    const restFastBtn = get("restFastBtn");
    const dockRest = get("dockRest");
    const broke = (player.respect || 0) < REST_FAST_COST;
    [restBtn, dockRest].forEach((button) => {
        if (!button) return;
        button.disabled = locked;
        if (button.id === "dockRest") {
            button.textContent = locked ? "⏳ " + seconds + "с" : "😴 Отдых";
        } else {
            button.textContent = locked
                ? "⏳ Подожди " + seconds + " сек"
                : "😴 ВОССТАНОВИТЬСЯ +50 · бесплатно";
        }
    });
    if (restFastBtn) {
        restFastBtn.disabled = locked || broke;
        restFastBtn.textContent = locked
            ? "⏳ " + seconds + " сек"
            : (broke ? "⚡ НУЖНО $100" : "⚡ 100% ЗА $100 · 1 сек");
    }
    const hint = get("restLockHint");
    if (hint) {
        hint.hidden = !locked;
        hint.textContent = locked
            ? "После отдыха пауза " + seconds + " сек"
            : "";
    }
}

function startRestTicker() {
    updateRestLockUI();
    updateOnlineUI();
    if (restTimer) clearInterval(restTimer);
    if (!restLocked() && !onlineLocked()) return;
    restTimer = setInterval(function () {
        updateRestLockUI();
        updateOnlineUI();
        if (!restLocked() && !onlineLocked()) {
            clearInterval(restTimer);
            restTimer = null;
            updateRestLockUI();
            updateOnlineUI();
        }
    }, 250);
}

function applyClubAura() {
    const club = clubByName(player.club);
    const color = player.color || club.color || "#30466f";
    const accent = player.accent || club.accent || "#ffd83d";
    document.documentElement.style.setProperty("--club", color);
    document.documentElement.style.setProperty("--club-accent", accent);
}

function hideAura() {
    const overlay = get("fxOverlay");
    if (overlay) overlay.hidden = true;
    if (fxTimer) {
        clearTimeout(fxTimer);
        fxTimer = null;
    }
}

function showAura(kind, kicker, title, sub, color, duration) {
    const overlay = get("fxOverlay");
    if (!overlay) return;
    overlay.hidden = false;
    overlay.className = "fx-overlay " + kind;
    overlay.style.setProperty("--fx", color || "#ffd83d");
    get("fxKicker").textContent = kicker;
    get("fxTitle").textContent = title;
    get("fxSub").textContent = sub;
    if (fxTimer) clearTimeout(fxTimer);
    fxTimer = setTimeout(hideAura, duration || 2200);
}

function trainGain() {
    return player.age >= 30 ? 1 : 2;
}

function startCareer() {
    Sfx.unlock();
    Sfx.click();
    if (localStorage.getItem(SAVE_KEY) && player && player.name) {
        if (!confirm("Текущая карьера будет перезаписана. Начать новую?")) return;
    }
    if (selectedMode === "club") {
        const name = get("clubName").value.trim();
        if (!name) {
            Sfx.error();
            alert("⚠️ Введи название клуба!");
            get("clubName").focus();
            return;
        }
        const city = get("clubCity").value.trim() || nationById(selectedNation).city;
        player = newClub(name, city, selectedNation, selectedAvatar);
        Sfx.start();
        showCareer();
        addLog("🏟️ Клуб основан! " + player.name + " · " + player.city + " · " + nationLabel(player.nation));
        addLog("📅 Первый матч на неделе " + player.nextMatchWeek);
        grantPendingPromo();
        save();
        return;
    }
    const name = get("playerName").value.trim();
    if (!name) {
        Sfx.error();
        alert("⚠️ Введи имя футболиста!");
        get("playerName").focus();
        return;
    }
    const position = get("position").value;
    player = newPlayer(name, position, selectedNation, selectedAvatar);
    Sfx.start();
    showCareer();
    addLog("🚀 Карьера началась! " + player.name + " — " + player.position + " · " + nationLabel(player.nation));
    addLog("📅 Первый матч на неделе " + player.nextMatchWeek);
    grantPendingPromo();
    save();
}

function train(stat) {
    Sfx.unlock();
    if (!player.name) return;
    if (player.stats[stat] === undefined) return;
    if (restLocked()) {
        Sfx.error();
        addLog("⏳ После восстановления подожди " + restRemain() + " сек");
        return;
    }
    if (!needEnergy(TRAIN_COST)) return;
    if (player.stats[stat] >= 99) {
        Sfx.error();
        addLog("⭐ " + STAT_NAMES[stat] + " уже 99");
        return;
    }
    player.energy -= TRAIN_COST;
    player.stats[stat] = Math.min(99, player.stats[stat] + trainGain());
    advanceWeek();
    Sfx.train();
    addLog("🏋️ " + STAT_NAMES[stat] + " +" + trainGain());
    renderAll();
    save();
}

function rest() {
    Sfx.unlock();
    if (!player.name) return;
    if (restLocked()) {
        Sfx.error();
        addLog("⏳ Ещё " + restRemain() + " сек до следующей тренировки");
        return;
    }
    player.energy = Math.min(ENERGY_MAX, player.energy + REST_GAIN);
    player.restUntil = Date.now() + REST_LOCK_MS;
    advanceWeek();
    Sfx.rest();
    addLog("😴 Восстановление. Энергия " + player.energy + ". 30 сек отдыха");
    showAura(
        "rest",
        "ВОССТАНОВЛЕНИЕ",
        "Энергия " + player.energy,
        "Бесплатно · пауза 30 сек",
        "#32d583",
        1600
    );
    startRestTicker();
    renderAll();
    save();
}

function restFast() {
    Sfx.unlock();
    if (!player.name) return;
    if (restLocked()) {
        Sfx.error();
        addLog("⏳ Ещё " + restRemain() + " сек");
        return;
    }
    if ((player.respect || 0) < REST_FAST_COST) {
        Sfx.error();
        addLog("⚠️ Быстрый отдых стоит " + money(REST_FAST_COST));
        return;
    }
    player.respect -= REST_FAST_COST;
    player.energy = ENERGY_MAX;
    player.restUntil = Date.now() + REST_FAST_MS;
    advanceWeek();
    Sfx.rest();
    addLog("⚡ Энергия 100% · −" + money(REST_FAST_COST) + " · пауза 1 сек");
    showAura(
        "rest",
        "БУСТ",
        "Энергия 100%",
        "−" + money(REST_FAST_COST) + " · пауза 1 сек",
        "#ffd83d",
        1100
    );
    startRestTicker();
    renderAll();
    save();
}

function onlineLocked() {
    return Date.now() < (player.onlineUntil || 0);
}

function onlineRemain() {
    return Math.max(0, Math.ceil(((player.onlineUntil || 0) - Date.now()) / 1000));
}

function myBattleCard() {
    const nat = nationById(player.nation);
    return {
        n: player.name,
        a: player.avatar || (isClub() ? "🏟️" : "⚽"),
        p: isClub() ? "CLUB" : player.position,
        c: player.club,
        o: getOverall(),
        f: fameValue(),
        flag: nat.flag || "🌍"
    };
}

function packBattle(card) {
    const raw = [card.n, card.o, card.p, card.c, card.f, card.a || "⚽"].join("\t");
    try {
        return btoa(unescape(encodeURIComponent(raw)))
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");
    } catch (err) {
        return "";
    }
}

function unpackBattle(code) {
    if (!code) return null;
    const clean = String(code).trim().replace(/-/g, "+").replace(/_/g, "/");
    const pad = clean + "===".slice((clean.length + 3) % 4);
    try {
        const raw = decodeURIComponent(escape(atob(pad)));
        const p = raw.split("\t");
        if (p.length < 5 || !p[0] || !Number.isFinite(+p[1])) return null;
        return {
            n: p[0].slice(0, 28),
            o: clamp(+p[1], 40, 99),
            p: p[2] || "ST",
            c: p[3] || "Арена",
            f: clamp(+p[4] || 50, 0, 99),
            a: p[5] || "⚽",
            flag: "🌐",
            ping: 20 + Math.round(Math.random() * 40),
            live: true
        };
    } catch (err) {
        return null;
    }
}

function pickOnlineRival() {
    const pool = isClub() ? ONLINE_CLUBS : ONLINE_RIVALS;
    const base = pool[Math.floor(Math.random() * pool.length)];
    const my = getOverall();
    const ovr = clamp(my + Math.round(Math.random() * 13 - 5), 48, 97);
    const nat = NATIONS[Math.floor(Math.random() * NATIONS.length)];
    return {
        n: base.n,
        a: base.a,
        p: isClub() ? "CLUB" : base.p,
        c: isClub() ? base.c : base.c,
        o: ovr,
        f: clamp(48 + Math.round((ovr - 60) * 0.8) + Math.round(Math.random() * 10 - 4), 18, 96),
        flag: nat.flag,
        ping: 14 + Math.round(Math.random() * 72),
        live: false
    };
}

function fillBattleSide(id, card) {
    const el = get(id);
    if (!el || !card) return;
    el.innerHTML = "";
    const face = document.createElement("span");
    face.className = "face";
    face.textContent = card.a || "⚽";
    const name = document.createElement("strong");
    name.textContent = (card.flag ? card.flag + " " : "") + card.n;
    const meta = document.createElement("small");
    meta.textContent = (card.p === "CLUB" ? card.c : card.p + " · " + card.c) +
        " · OVR " + card.o +
        (card.ping ? " · " + card.ping + " мс" : "");
    el.appendChild(face);
    el.appendChild(name);
    el.appendChild(meta);
}

function updateOnlineUI() {
    const btn = get("onlineBtn");
    const dock = get("dockBattle");
    const rec = get("onlineRecord");
    if (rec) rec.textContent = (player.onlineWins || 0) + "–" + (player.onlineLosses || 0);
    const locked = onlineLocked();
    const wait = onlineRemain();
    const busy = matchBusy;
    const low = player.energy < ONLINE_COST;
    const can = player.name && !busy && !locked && !low;
    const label = !player.name
        ? "🌐 НУЖНА КАРЬЕРА"
        : busy
            ? "🌐 МАТЧ ИДЁТ"
            : locked
                ? "🌐 ЧЕРЕЗ " + wait + " СЕК"
                : (low ? "🌐 МАЛО ЭНЕРГИИ" : "🌐 ОНЛАЙН БАТЛ");
    if (btn) {
        btn.disabled = !can;
        btn.textContent = label;
    }
    if (dock) {
        dock.disabled = !can;
        dock.textContent = locked ? "⏳ " + wait + "с" : (low ? "⚡ Батл" : "🌐 Батл");
    }
}

function closeOnlineLobby() {
    if (onlineTimer) {
        clearTimeout(onlineTimer);
        onlineTimer = null;
    }
    onlineRival = null;
    const overlay = get("battleOverlay");
    if (overlay) overlay.hidden = true;
}

function openOnlineLobby() {
    Sfx.unlock();
    if (!player.name) {
        Sfx.error();
        addLog("⚠️ Сначала создай игрока или клуб");
        return;
    }
    if (matchBusy) return;
    if (onlineLocked()) {
        Sfx.error();
        addLog("⏳ Батл через " + onlineRemain() + " сек");
        updateOnlineUI();
        return;
    }
    if (!needEnergy(ONLINE_COST)) return;

    const overlay = get("battleOverlay");
    const vs = get("battleVs");
    const go = get("battleGo");
    const box = get("battleCodeBox");
    const mine = get("myBattleCode");
    const friend = get("friendBattleCode");
    if (!overlay) return;

    onlineRival = null;
    overlay.hidden = false;
    if (vs) vs.hidden = true;
    if (go) go.hidden = true;
    if (box) box.hidden = false;
    if (mine) mine.value = packBattle(myBattleCard());
    if (friend) friend.value = "";
    fillBattleSide("battleYou", myBattleCard());
    const them = get("battleThem");
    if (them) them.classList.remove("found");
    get("battleKicker").textContent = "ОНЛАЙН АРЕНА";
    get("battleTitle").textContent = "Поиск соперника";
    get("battleSub").textContent = "сканируем лобби…";
    Sfx.ding();
    startOnlineSearch();
}

function startOnlineSearch() {
    if (onlineTimer) clearTimeout(onlineTimer);
    const pool = isClub() ? ONLINE_CLUBS : ONLINE_RIVALS;
    let ticks = 0;
    const max = 6 + Math.floor(Math.random() * 5);
    function tick() {
        if (get("battleOverlay").hidden) return;
        ticks += 1;
        const ghost = pool[Math.floor(Math.random() * pool.length)];
        const ping = 18 + Math.round(Math.random() * 90);
        get("battleSub").textContent = "онлайн: " + ghost.n + " · " + ping + " мс";
        if (ticks >= max) {
            onlineRival = pickOnlineRival();
            showOnlineFound(onlineRival);
            return;
        }
        onlineTimer = setTimeout(tick, 220);
    }
    tick();
}

function showOnlineFound(rival) {
    onlineRival = rival;
    const vs = get("battleVs");
    const go = get("battleGo");
    const box = get("battleCodeBox");
    const them = get("battleThem");
    fillBattleSide("battleYou", myBattleCard());
    fillBattleSide("battleThem", rival);
    if (them) them.classList.add("found");
    if (vs) vs.hidden = false;
    if (go) go.hidden = false;
    if (box) box.hidden = true;
    get("battleTitle").textContent = "Соперник найден";
    get("battleSub").textContent = rival.live
        ? "карточка друга · OVR " + rival.o
        : "пинг " + rival.ping + " мс · OVR " + rival.o;
    Sfx.ding();
    if (onlineTimer) clearTimeout(onlineTimer);
    onlineTimer = setTimeout(function () {
        if (!get("battleOverlay").hidden && onlineRival) playOnline();
    }, 900);
}

function joinOnlineCode() {
    Sfx.click();
    const raw = (get("friendBattleCode") && get("friendBattleCode").value) || "";
    const card = unpackBattle(raw);
    if (!card) {
        Sfx.error();
        get("battleSub").textContent = "код не подошёл";
        return;
    }
    const mine = packBattle(myBattleCard());
    if (raw.trim() === mine) {
        Sfx.error();
        get("battleSub").textContent = "это твой код";
        return;
    }
    if (onlineTimer) {
        clearTimeout(onlineTimer);
        onlineTimer = null;
    }
    showOnlineFound(card);
}

function copyBattleCode() {
    const el = get("myBattleCode");
    const code = el && el.value;
    if (!code) return;
    Sfx.click();
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(function () {
            get("battleSub").textContent = "код скопирован";
        }).catch(function () {
            el.select();
        });
        return;
    }
    el.select();
}

function playOnline() {
    if (!player.name || matchBusy || !onlineRival) return;
    if (onlineLocked()) {
        Sfx.error();
        closeOnlineLobby();
        return;
    }
    if (!needEnergy(ONLINE_COST)) {
        closeOnlineLobby();
        return;
    }

    const rival = onlineRival;
    closeOnlineLobby();
    matchBusy = true;
    updateOnlineUI();
    updateScheduleUI();

    player.energy -= ONLINE_COST;
    player.onlineUntil = Date.now() + ONLINE_LOCK_MS;
    updateEnergy();

    const me = myBattleCard();
    const delta = clamp((me.o - rival.o) / 18 + (me.f - (rival.f || 50)) / 160, -0.95, 1.15);

    showAura("match", "ОНЛАЙН  " + rival.ping + " мс", "БАТЛ", me.n + " vs " + rival.n, "#a78bfa", 1000);
    Sfx.matchKickoff();

    let scored = Math.max(0, Math.round(1.25 + delta * 1.45 + Math.random() * 1.4 - 0.35));
    let conceded = Math.max(0, Math.round(1.15 - delta * 1.25 + Math.random() * 1.4 - 0.35));
    if (me.p === "GK") conceded = Math.max(0, conceded - (Math.random() < 0.35 ? 1 : 0));
    if (me.p === "CB") conceded = Math.max(0, conceded - (Math.random() < 0.28 ? 1 : 0));
    if (me.p === "ST" && Math.random() < 0.3) scored += 1;

    let pen = null;
    let result = "draw";
    if (scored === conceded) {
        pen = runPens(delta);
        result = pen.win ? "win" : "loss";
    } else if (scored > conceded) result = "win";
    else result = "loss";

    if (result === "win") player.onlineWins = (player.onlineWins || 0) + 1;
    else player.onlineLosses = (player.onlineLosses || 0) + 1;

    let gained = result === "win" ? (pen ? 26 : 32) : (pen ? 8 : 6);
    gained += Math.round((fameValue() - 50) / 25);
    player.respect = (player.respect || 0) + Math.max(0, gained);

    const fameGain = result === "win" ? (pen ? 5 : 4) : (pen ? 0 : -1);
    const fameDelta = addFame(fameGain);
    const score = scored + ":" + conceded;
    const summary = "🌐 " + score + " vs " + rival.n +
        (pen ? " · пен. " + pen.us + ":" + pen.them : "") +
        (rival.live ? " · код" : "");

    setTimeout(function () {
        const last = get("lastMatch");
        if (last) {
            last.className = "last-match " + result;
            last.textContent = summary;
        }
        player.lastMatch = { text: summary, result: result };

        if (result === "win") {
            Sfx.goal();
            showAura(
                "champ",
                "ОНЛАЙН ПОБЕДА  +" + money(gained),
                score,
                "vs " + rival.n + (pen ? " · пенальти" : ""),
                "#32d583",
                2000
            );
            addLog("🌐 Победа " + score + " vs " + rival.n, "goal");
        } else {
            Sfx.miss();
            showAura(
                "match",
                "ОНЛАЙН ПОРАЖЕНИЕ  +" + money(gained),
                score,
                "vs " + rival.n,
                "#c4b5fd",
                1700
            );
            addLog("🌐 Поражение " + score + " vs " + rival.n);
        }
        addLog("⭐ +" + money(gained) + " · всего " + money(player.respect));
        if (fameDelta) {
            addLog((fameDelta > 0 ? "✨ Репутация +" : "💢 Репутация ") + fameDelta + " · " + fameRank(fameValue()) + " " + fameValue());
        }
        matchBusy = false;
        startRestTicker();
        renderAll();
        save();
    }, 1000);
}

function startOnlineFromMenu() {
    Sfx.unlock();
    Sfx.click();
    if (!player || !player.name) {
        Sfx.error();
        alert("Сначала создай игрока или клуб — батл идёт от твоей карточки.");
        return;
    }
    showCareer();
    openOnlineLobby();
}

function playMatch(useBribe) {
    Sfx.unlock();
    if (!player.name || matchBusy) return;
    if (!matchDue()) {
        Sfx.error();
        addLog("📅 Матч только по расписанию. Следующий: неделя " + player.nextMatchWeek + " vs " + player.nextOpponent);
        updateScheduleUI();
        return;
    }
    if (!needEnergy(MATCH_COST)) return;

    useBribe = useBribe === true;
    let bribeOk = false;
    let bribeFined = false;
    if (useBribe) {
        const fee = bribeCost();
        if ((player.respect || 0) < fee) {
            Sfx.error();
            addLog("⚠️ На подкуп нужно " + money(fee));
            return;
        }
        player.respect -= fee;
        if (Math.random() < clamp(BRIBE_CATCH + (50 - fameValue()) / 250, 0.58, 0.82)) {
            bribeFined = true;
            const fine = fineCost();
            player.respect = Math.max(0, (player.respect || 0) - fine);
            Sfx.error();
            addLog("⚖️ Поймали! Штраф " + money(fine) + " · репутация падает", "goal");
        } else {
            bribeOk = true;
            Sfx.ding();
            addLog("🤫 Судья куплен. Репутация падает");
        }
        updateRespect();
    }

    matchBusy = true;
    updateScheduleUI();
    updateOnlineUI();

    ensureCalendar();
    const fixture = pendingFixture();
    const opponent = (fixture && fixture.opp) || player.nextOpponent || pickOpponent();

    player.energy -= MATCH_COST;
    player.matches += 1;
    advanceWeek();
    updateEnergy();
    updateHeader();

    const ovr = getOverall();
    const club = clubByName(player.club);
    const diff = Math.max(club.required, 55);
    const delta = clamp((ovr - diff) / 22 + (fameValue() - 50) / 140, -0.9, 1.1);
    const role = isClub() ? { goal: 1.15, assist: 0.9, save: 0 } : (ROLE[player.position] || ROLE.ST);

    showAura("match", club.country + "  " + club.league, "СВИСТОК", "vs " + opponent, club.color || "#ffd83d", 1100);
    Sfx.matchKickoff();

    let goals = 0;
    let assists = 0;
    let saves = 0;
    let tackles = 0;
    let scored = 0;
    let conceded = 0;

    if (isGk()) {
        const s = player.stats;
        const gkSkill = (s.diving * 1.2 + s.handling + s.reflexes * 1.4 + s.positioning * 1.2) / 4.8;
        const gkDelta = clamp((gkSkill - diff) / 18, -0.8, 1.3);
        const shots = Math.round(8 + Math.random() * 5);
        saves = Math.round(shots * clamp(0.52 + gkDelta * 0.22 + (s.reflexes - 60) / 160, 0.32, 0.94));
        saves = clamp(saves, 2, shots);
        conceded = shots - saves;
        if (s.handling >= 78 && Math.random() < 0.32) conceded = Math.max(0, conceded - 1);
        if (s.positioning >= 80 && Math.random() < 0.28) conceded = Math.max(0, conceded - 1);
        if (s.diving >= 82 && Math.random() < 0.22) {
            saves += 1;
            conceded = Math.max(0, conceded - 1);
        }
        saves = Math.min(shots, saves);
        player.saves += saves;
        player.conceded = (player.conceded || 0) + conceded;
        scored = Math.max(0, Math.round(0.7 + Math.random() * 2.3 + delta * 0.45));
        if (conceded === 0) player.cleanSheets = (player.cleanSheets || 0) + 1;
        if (Math.random() < 0.03 + (s.kicking || 50) / 500) assists = 1;
        player.assists += assists;
    } else if (isCb()) {
        const s = player.stats;
        const def = (s.marking * 1.3 + s.tackling * 1.35 + s.strength * 0.85) / 3.5;
        const defDelta = clamp((def - diff) / 20, -0.7, 1.2);
        tackles = Math.round(5 + Math.random() * 5 + defDelta * 3 + ((s.tackling || 68) - 60) / 10);
        player.tackles = (player.tackles || 0) + tackles;
        if (Math.random() < 0.07 + (s.heading || 70) / 900) goals = 1;
        if (Math.random() < 0.06 + (s.passing || 50) / 400) assists = 1;
        player.goals += goals;
        player.assists += assists;
        const teamBase = clamp(1.1 + delta * 1.2 + goals * 0.4, 0.2, 3.8);
        const oppBase = clamp(1.25 - defDelta * 1.3, 0.15, 3.4);
        scored = Math.max(goals, Math.round(teamBase + Math.random() * 1.3 - 0.4));
        conceded = Math.max(0, Math.round(oppBase + Math.random() * 1.2 - 0.5));
        if (s.marking >= 80 && Math.random() < 0.3) conceded = Math.max(0, conceded - 1);
        if (s.tackling >= 82 && Math.random() < 0.25) conceded = Math.max(0, conceded - 1);
        if (conceded === 0) player.cleanSheets = (player.cleanSheets || 0) + 1;
    } else {
        const attack = clamp(0.22 + delta * 0.28, 0.06, 0.82) * role.goal;
        const roll = Math.random();
        if (roll < attack * 0.28) goals = 2;
        else if (roll < attack) goals = 1;

        const assistChance = clamp(0.16 + delta * 0.12, 0.05, 0.55) * role.assist;
        if (Math.random() < assistChance * 0.25) assists = 2;
        else if (Math.random() < assistChance) assists = 1;

        player.goals += isClub() ? 0 : goals;
        player.assists += isClub() ? 0 : assists;

        const teamBase = clamp(1.2 + delta * 1.4 + goals * 0.35, 0.2, 4.2);
        const oppBase = clamp(1.1 - delta * 1.1, 0.2, 3.6);
        scored = Math.max(goals, Math.round(teamBase + Math.random() * 1.4 - 0.4));
        conceded = Math.max(0, Math.round(oppBase + Math.random() * 1.4 - 0.5));
    }

    if (bribeOk) {
        scored += 1;
        conceded = Math.max(0, conceded - 1);
        if (!isClub() && !isGk() && Math.random() < 0.45) {
            goals += 1;
            player.goals += 1;
        }
        if (isClub() && scored <= conceded) scored = conceded + 1;
    }

    let pen = null;
    let result = "draw";
    if (scored === conceded) {
        pen = runPens(delta);
        result = pen.win ? "win" : "loss";
    } else if (scored > conceded) result = "win";
    else result = "loss";

    if (isClub()) {
        player.goals += scored;
        player.conceded = (player.conceded || 0) + conceded;
        if (result === "win") player.wins = (player.wins || 0) + 1;
        else player.losses = (player.losses || 0) + 1;
    }

    if (fixture) {
        fixture.result = result;
        fixture.score = scored + ":" + conceded;
        fixture.pens = pen ? (pen.us + ":" + pen.them) : "";
    }

    const summary = scored + ":" + conceded + " vs " + opponent +
        (pen ? (" · пен. " + pen.us + ":" + pen.them) : "") +
        (isClub() ? "" : isGk()
            ? (" · " + saves + " сейвов" + (conceded === 0 ? " · сухой" : "") + (assists ? " · ассист" : ""))
            : isCb()
                ? (" · " + tackles + " отборов" + (goals ? " · гол головой" : "") + (conceded === 0 ? " · сухой" : ""))
                : (
                    (goals ? " · ты: " + goals + " гол" : "") +
                    (assists ? " · " + assists + " ассист" : "")
                )) +
        (bribeOk ? " · 🤫 судья" : "") +
        (bribeFined ? " · ⚖️ штраф" : "");

    let gained = result === "win" ? (pen ? 18 : 20) : (pen ? 5 : 3);
    gained += goals * 15;
    gained += assists * 10;
    gained += saves * 3;
    gained += tackles * 2;
    if (isGk() && conceded === 0) gained += 18;
    if (isCb() && conceded === 0) gained += 12;
    gained += Math.round((fameValue() - 50) / 20);
    player.respect = (player.respect || 0) + Math.max(0, gained);

    let fameGain = result === "win" ? 4 : 1;
    if (pen && result === "win") fameGain += 1;
    if (conceded === 0) fameGain += 2;
    if (!isClub() && goals) fameGain += goals;
    if (bribeOk) fameGain -= 14;
    if (bribeFined) fameGain -= 22;
    const fameDelta = addFame(fameGain);

    setTimeout(function () {
        const last = get("lastMatch");
        last.className = "last-match " + result;
        last.textContent = summary;
        player.lastMatch = { text: summary, result: result };

        if (pen) {
            if (pen.win) Sfx.goal();
            else Sfx.miss();
            showAura(
                pen.win ? "champ" : "match",
                "ПЕНАЛЬТИ " + pen.us + ":" + pen.them,
                scored + ":" + conceded,
                (pen.win ? "Победа" : "Поражение") + " vs " + opponent + "  +" + money(gained),
                pen.win ? "#32d583" : "#e57373",
                2000
            );
            addLog("🎯 Пенальти " + pen.us + ":" + pen.them + " vs " + opponent + (pen.win ? " · победа" : " · поражение"), pen.win ? "goal" : "");
        } else if (isGk()) {
            if (conceded === 0) {
                Sfx.goal();
                showAura("champ", "СУХОЙ  +" + money(gained), scored + ":" + conceded, saves + " сейвов vs " + opponent, "#32d583", 1800);
                addLog("🧤 Сухой матч! " + scored + ":" + conceded + " vs " + opponent + " · сейвы: " + saves, "goal");
            } else {
                Sfx.whistle();
                showAura("match", "СЕЙВЫ " + saves, scored + ":" + conceded, "vs " + opponent + "  +" + money(gained), "#7dd3fc", 1600);
                addLog("🧤 " + scored + ":" + conceded + " vs " + opponent + " · сейвы: " + saves);
            }
        } else if (isCb()) {
            if (goals > 0) {
                Sfx.goal();
                showAura("goal", "ГОЛ ГОЛОВОЙ  +" + money(gained), scored + ":" + conceded, tackles + " отборов vs " + opponent, "#ffd83d", 1800);
                addLog("🦅 Гол головой! " + scored + ":" + conceded + " vs " + opponent + " · отборы: " + tackles, "goal");
            } else if (conceded === 0) {
                Sfx.whistle();
                showAura("match", "СУХОЙ  +" + money(gained), scored + ":" + conceded, tackles + " отборов vs " + opponent, "#32d583", 1600);
                addLog("🛡️ Сухой матч · " + tackles + " отборов vs " + opponent);
            } else {
                Sfx.whistle();
                showAura("match", "ОТБОРЫ " + tackles, scored + ":" + conceded, "vs " + opponent + "  +" + money(gained), "#8aa0c8", 1500);
                addLog("🛡️ " + scored + ":" + conceded + " vs " + opponent + " · отборы: " + tackles);
            }
        } else if (goals > 0) {
            Sfx.goal();
            showAura("goal", "ГОЛ!  +" + money(gained), scored + ":" + conceded, "vs " + opponent, "#ffd83d", 1800);
            addLog("⚽ " + scored + ":" + conceded + " vs " + opponent + " — голы: " + goals, "goal");
        } else if (result === "win") {
            Sfx.whistle();
            showAura("match", "ПОБЕДА  +" + money(gained), scored + ":" + conceded, "vs " + opponent, "#32d583", 1600);
            addLog("🏟️ Победа " + scored + ":" + conceded + " vs " + opponent);
        } else {
            Sfx.miss();
            showAura("match", "ПОРАЖЕНИЕ  +" + money(gained), scored + ":" + conceded, "vs " + opponent, "#8aa0c8", 1500);
            addLog("🏟️ " + scored + ":" + conceded + " vs " + opponent);
        }
        addLog("⭐ +" + money(gained) + " · всего " + money(player.respect));
        if (fameDelta) {
            addLog((fameDelta > 0 ? "✨ Репутация +" : "💢 Репутация ") + fameDelta + " · " + fameRank(fameValue()) + " " + fameValue());
        }

        if (player.matches % 5 === 0) {
            const keys = statKeys();
            const stat = keys[Math.floor(Math.random() * keys.length)];
            if (player.stats[stat] < 99) {
                player.stats[stat] += 1;
                addLog("⭐ Игровая форма: " + STAT_NAMES[stat] + " +1");
                Sfx.ding();
            }
        }

        scheduleNextMatch();
        matchBusy = false;
        renderAll();
        save();
    }, 1100);
}

function transferTo(club) {
    Sfx.unlock();
    player.club = club.name;
    const bonus = 20 + club.required * 2;
    player.respect = (player.respect || 0) + bonus;
    const peak = isClub() ? club.name === "Финал ЛЧ" : club.name === "Real Madrid";
    if (peak) {
        Sfx.champ();
        addLog(isClub() ? "👑 Финал Лиги чемпионов! Вершина клуба" : "👑 Контракт с Real Madrid! Вершина карьеры", "goal");
        showAura("champ", "+" + money(bonus), club.name, isClub() ? "Твой клуб на вершине Европы" : "Добро пожаловать в " + club.city, club.accent, 2800);
    } else {
        Sfx.transferBig(club.required);
        addLog(isClub() ? "📈 Повышение: " + club.name : "🔄 Переход в " + club.name + " · " + club.city);
        showAura("transfer", "+" + money(bonus), club.name, isClub() ? "Новая лига · " + club.league : "Добро пожаловать в " + club.city, club.color, 2400);
    }
    addLog("⭐ +" + money(bonus) + " · всего " + money(player.respect));
    const fameDelta = addFame(6);
    if (fameDelta) addLog("✨ Репутация +" + fameDelta + " · " + fameRank(fameValue()));
    if (Array.isArray(player.grid)) {
        player.grid = player.grid.filter((row) => row.result);
    }
    player.nextOpponent = null;
    ensureCalendar();
    renderAll();
    save();
}

function updateClubs() {
    const container = get("clubs");
    if (!container) return;
    container.innerHTML = "";
    const overall = getOverall();
    const currentReq = clubByName(player.club).required;
    const list = isClub() ? LEAGUES : CLUBS;

    list.forEach((club) => {
        const row = document.createElement("div");
        row.className = "club";
        row.style.setProperty("--club", club.color);
        row.style.setProperty("--club-accent", club.accent);

        const badge = document.createElement("span");
        badge.className = "club-badge";
        badge.style.background = club.color;
        badge.textContent = club.country;
        row.appendChild(badge);

        const info = document.createElement("div");
        info.style.flex = "1";
        const title = document.createElement("strong");
        title.textContent = club.name;
        info.appendChild(title);
        const meta = document.createElement("div");
        meta.className = "meta";
        meta.textContent = club.city + " · " + club.league + " · OVR " + club.required;
        info.appendChild(meta);
        row.appendChild(info);

        if (player.club === club.name) {
            row.classList.add("current");
            const mark = document.createElement("b");
            mark.textContent = isClub() ? "✅ ТЕКУЩАЯ" : "✅ ТЕКУЩИЙ";
            row.appendChild(mark);
        } else if (club.required < currentReq) {
            row.classList.add("passed");
            const mark = document.createElement("b");
            mark.textContent = isClub() ? "Пройдена" : "Пройден";
            row.appendChild(mark);
        } else if (overall >= club.required) {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = isClub() ? "ПОВЫСИТЬСЯ" : "ПЕРЕЙТИ";
            button.addEventListener("click", function () {
                Sfx.click();
                transferTo(club);
            });
            row.appendChild(button);
        } else {
            row.classList.add("locked");
            const mark = document.createElement("b");
            mark.textContent = "🔒 OVR " + club.required;
            row.appendChild(mark);
        }

        container.appendChild(row);
    });
}

function starCost(ovr) {
    if (ovr >= 90) return 160 + (ovr - 90) * 24;
    if (ovr >= 82) return 72 + (ovr - 82) * 10;
    return 36 + Math.max(0, ovr - 74) * 5;
}

function starBoostKeys(pos) {
    if (pos === "GK" || pos === "CB" || pos === "CDM") return ["defending", "physical"];
    if (pos === "ST" || pos === "LW" || pos === "RW") return ["shooting", "pace", "dribbling"];
    if (pos === "CAM" || pos === "CM") return ["passing", "dribbling"];
    return ["pace", "defending"];
}

function signStar(star) {
    Sfx.unlock();
    if (!isClub()) return;
    if (!Array.isArray(player.squad)) player.squad = [];
    if (player.squad.indexOf(star.id) >= 0) return;
    if (player.squad.length >= 11) {
        Sfx.error();
        addLog("⚠️ Состав полный (11).");
        return;
    }
    if ((player.respect || 0) < starCost(star.ovr)) {
        Sfx.error();
        addLog("⚠️ Нужно " + money(starCost(star.ovr)) + " на " + star.name);
        return;
    }
    player.respect -= starCost(star.ovr);
    player.squad.push(star.id);
    const gain = Math.max(1, Math.round((star.ovr - 74) / 5));
    starBoostKeys(star.pos).forEach((key) => {
        if (typeof player.stats[key] === "number") {
            player.stats[key] = Math.min(99, player.stats[key] + gain);
        }
    });
    Sfx.transferBig(star.ovr);
    addLog("🔄 Куплен " + star.flag + " " + star.name + " · " + star.pos + " " + star.ovr + " (−" + money(starCost(star.ovr)) + ")");
    showAura("transfer", "−" + money(starCost(star.ovr)), star.name, star.club + " · " + star.pos + " " + star.ovr, "#ffd83d", 1800);
    renderAll();
    save();
}

function releaseStar(star) {
    Sfx.unlock();
    if (!isClub() || !Array.isArray(player.squad)) return;
    const index = player.squad.indexOf(star.id);
    if (index < 0) return;
    player.squad.splice(index, 1);
    const refund = Math.round(starCost(star.ovr) * 0.4);
    player.respect = (player.respect || 0) + refund;
    const gain = Math.max(1, Math.round((star.ovr - 74) / 5));
    starBoostKeys(star.pos).forEach((key) => {
        if (typeof player.stats[key] === "number") {
            player.stats[key] = Math.max(40, player.stats[key] - gain);
        }
    });
    Sfx.rest();
    addLog("📤 Продан " + star.name + " · +" + money(refund));
    renderAll();
    save();
}

function squadStars() {
    if (!Array.isArray(player.squad)) return [];
    return player.squad.map((id) => TRANSFER_STARS.find((s) => s.id === id)).filter(Boolean);
}

function slotScore(slotPos, playerPos) {
    if (slotPos === playerPos) return 2;
    const groups = [
        ["GK"],
        ["CB"],
        ["LB", "RB"],
        ["CDM", "CM", "CAM"],
        ["LW", "RW", "ST"]
    ];
    const group = groups.find((row) => row.indexOf(slotPos) >= 0);
    return group && group.indexOf(playerPos) >= 0 ? 1 : 0;
}

function updateSquad() {
    const pitch = get("squadPitch");
    const box = get("squad");
    const hint = get("squadHint");
    if (!pitch || !box) return;
    pitch.innerHTML = "";
    box.innerHTML = "";
    if (!isClub()) return;
    const stars = squadStars();
    const avg = stars.length
        ? Math.round(stars.reduce((sum, star) => sum + star.ovr, 0) / stars.length)
        : 0;
    if (hint) {
        hint.textContent = stars.length
            ? ("В заявке " + stars.length + "/11 · средний OVR " + avg)
            : "Своих игроков пока нет. Купи в трансферном окне.";
    }

    const lines = [
        ["GK"],
        ["LB", "CB", "CB", "RB"],
        ["CDM", "CM", "CAM"],
        ["LW", "ST", "RW"]
    ];
    const taken = {};
    lines.forEach((line) => {
        const row = document.createElement("div");
        row.className = "pitch-line";
        line.forEach((slotPos) => {
            let pick = null;
            let best = 0;
            stars.forEach((star) => {
                if (taken[star.id]) return;
                const score = slotScore(slotPos, star.pos);
                if (score > best) {
                    best = score;
                    pick = star;
                }
            });
            const slot = document.createElement("div");
            slot.className = "pitch-slot";
            if (pick) {
                taken[pick.id] = true;
                slot.classList.add("filled");
                const name = document.createElement("b");
                name.textContent = pick.flag + " " + pick.name;
                slot.appendChild(name);
                const meta = document.createElement("small");
                meta.textContent = pick.pos + " " + pick.ovr;
                slot.appendChild(meta);
            } else {
                slot.textContent = slotPos;
            }
            row.appendChild(slot);
        });
        pitch.appendChild(row);
    });

    if (!stars.length) {
        const empty = document.createElement("div");
        empty.className = "market-row";
        empty.textContent = "Пусто. Открой трансферы ниже.";
        box.appendChild(empty);
        return;
    }

    stars.forEach((star) => {
        const row = document.createElement("div");
        row.className = "market-row owned";
        const pos = document.createElement("span");
        pos.className = "pos";
        pos.textContent = star.pos;
        row.appendChild(pos);
        const who = document.createElement("span");
        who.className = "who";
        who.textContent = star.flag + " " + star.name + " ";
        const club = document.createElement("small");
        club.textContent = star.club;
        who.appendChild(club);
        row.appendChild(who);
        const ovn = document.createElement("span");
        ovn.className = "ovn";
        ovn.textContent = String(star.ovr);
        row.appendChild(ovn);
        const sell = document.createElement("button");
        sell.type = "button";
        sell.className = "sell";
        sell.setAttribute("data-sell", star.id);
        sell.textContent = "продать";
        row.appendChild(sell);
        box.appendChild(row);
    });
}

function updateMarket() {
    const box = get("market");
    const hint = get("marketHint");
    if (!box) return;
    box.innerHTML = "";
    if (!isClub()) return;
    if (!Array.isArray(player.squad)) player.squad = [];
    const list = TRANSFER_STARS.filter((star) => {
        const tierOk = marketFilter === "all" || star.tier === marketFilter;
        const posOk = marketPos === "all" || star.pos === marketPos;
        return tierOk && posOk;
    });
    if (hint) {
        hint.textContent = list.length + " игроков · состав " + player.squad.length + "/11 · " + money(player.respect);
    }
    document.querySelectorAll("#marketTabs [data-tier]").forEach((btn) => {
        btn.classList.toggle("on", btn.getAttribute("data-tier") === marketFilter);
    });
    document.querySelectorAll("#marketPos [data-pos]").forEach((btn) => {
        btn.classList.toggle("on", btn.getAttribute("data-pos") === marketPos);
    });
    list.forEach((star) => {
        const cost = starCost(star.ovr);
        const owned = player.squad.indexOf(star.id) >= 0;
        const row = document.createElement("div");
        row.className = "market-row" + (owned ? " owned" : (player.respect || 0) < cost ? " locked" : "");

        const pos = document.createElement("span");
        pos.className = "pos";
        pos.textContent = star.pos;
        row.appendChild(pos);

        const who = document.createElement("span");
        who.className = "who";
        who.textContent = star.flag + " " + star.name + " ";
        const club = document.createElement("small");
        club.textContent = star.club;
        who.appendChild(club);
        row.appendChild(who);

        const ovn = document.createElement("span");
        ovn.className = "ovn";
        ovn.textContent = String(star.ovr);
        row.appendChild(ovn);

        if (owned) {
            const mark = document.createElement("b");
            mark.textContent = "свой";
            row.appendChild(mark);
        } else if ((player.respect || 0) >= cost) {
            const button = document.createElement("button");
            button.type = "button";
            button.setAttribute("data-star", star.id);
            button.textContent = money(cost);
            row.appendChild(button);
        } else {
            const mark = document.createElement("b");
            mark.textContent = money(cost);
            row.appendChild(mark);
        }
        box.appendChild(row);
    });
}

function newCareer() {
    Sfx.unlock();
    Sfx.click();
    if (!confirm("Начать заново? Карьера сбросится, рекорды останутся.")) return;
    updateRecords();
    localStorage.removeItem(SAVE_KEY);
    location.reload();
}

const PROMO_CODE = "MADRID.CR7.ISTAS";
const PROMO_PAY = 100000;
const PROMO_PENDING = "fc-promo-madrid";
const AUCTION_KEY = "fc-auction-wc-v1";
const AUCTION_SLOTS = ["GK", "LB", "CB", "CB", "RB", "CM", "CM", "CM", "LW", "ST", "RW"];
const AUCTION_LINES = [["GK"], ["LB", "CB", "CB", "RB"], ["CM", "CM", "CM"], ["LW", "ST", "RW"]];
const WC_STARS = [
    { name: "Ромарио", pos: "ST", flag: "🇧🇷", nation: "Бразилия", wc: 1994, ovr: 92 },
    { name: "Баджо", pos: "CAM", flag: "🇮🇹", nation: "Италия", wc: 1994, ovr: 90 },
    { name: "Мальдини", pos: "CB", flag: "🇮🇹", nation: "Италия", wc: 1994, ovr: 91 },
    { name: "Барези", pos: "CB", flag: "🇮🇹", nation: "Италия", wc: 1994, ovr: 90 },
    { name: "Стоичков", pos: "ST", flag: "🇧🇬", nation: "Болгария", wc: 1994, ovr: 89 },
    { name: "Хаджи", pos: "CAM", flag: "🇷🇴", nation: "Румыния", wc: 1994, ovr: 88 },
    { name: "Клинсманн", pos: "ST", flag: "🇩🇪", nation: "Германия", wc: 1994, ovr: 88 },
    { name: "Бебето", pos: "ST", flag: "🇧🇷", nation: "Бразилия", wc: 1994, ovr: 87 },
    { name: "Вальдеррама", pos: "CM", flag: "🇨🇴", nation: "Колумбия", wc: 1994, ovr: 86 },
    { name: "Зидан", pos: "CAM", flag: "🇫🇷", nation: "Франция", wc: 1998, ovr: 94 },
    { name: "Роналдо", pos: "ST", flag: "🇧🇷", nation: "Бразилия", wc: 1998, ovr: 94 },
    { name: "Бергкамп", pos: "ST", flag: "🇳🇱", nation: "Нидерланды", wc: 1998, ovr: 91 },
    { name: "Давидс", pos: "CDM", flag: "🇳🇱", nation: "Нидерланды", wc: 1998, ovr: 87 },
    { name: "Шукер", pos: "ST", flag: "🇭🇷", nation: "Хорватия", wc: 1998, ovr: 88 },
    { name: "Батистута", pos: "ST", flag: "🇦🇷", nation: "Аргентина", wc: 1998, ovr: 90 },
    { name: "Оуэн", pos: "ST", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", nation: "Англия", wc: 1998, ovr: 87 },
    { name: "Тюрам", pos: "CB", flag: "🇫🇷", nation: "Франция", wc: 1998, ovr: 88 },
    { name: "Бартез", pos: "GK", flag: "🇫🇷", nation: "Франция", wc: 1998, ovr: 88 },
    { name: "Ривалдо", pos: "CAM", flag: "🇧🇷", nation: "Бразилия", wc: 2002, ovr: 90 },
    { name: "Роналдиньо", pos: "LW", flag: "🇧🇷", nation: "Бразилия", wc: 2002, ovr: 93 },
    { name: "Роналдо", pos: "ST", flag: "🇧🇷", nation: "Бразилия", wc: 2002, ovr: 95 },
    { name: "Кафу", pos: "RB", flag: "🇧🇷", nation: "Бразилия", wc: 2002, ovr: 89 },
    { name: "Роберто Карлос", pos: "LB", flag: "🇧🇷", nation: "Бразилия", wc: 2002, ovr: 90 },
    { name: "Кан", pos: "GK", flag: "🇩🇪", nation: "Германия", wc: 2002, ovr: 91 },
    { name: "Баллак", pos: "CM", flag: "🇩🇪", nation: "Германия", wc: 2002, ovr: 89 },
    { name: "Недвед", pos: "CAM", flag: "🇨🇿", nation: "Чехия", wc: 2002, ovr: 90 },
    { name: "Фигу", pos: "RW", flag: "🇵🇹", nation: "Португалия", wc: 2002, ovr: 90 },
    { name: "Рауль", pos: "ST", flag: "🇪🇸", nation: "Испания", wc: 2002, ovr: 88 },
    { name: "Буффон", pos: "GK", flag: "🇮🇹", nation: "Италия", wc: 2006, ovr: 93 },
    { name: "Каннаваро", pos: "CB", flag: "🇮🇹", nation: "Италия", wc: 2006, ovr: 91 },
    { name: "Пирло", pos: "CM", flag: "🇮🇹", nation: "Италия", wc: 2006, ovr: 90 },
    { name: "Тотти", pos: "CAM", flag: "🇮🇹", nation: "Италия", wc: 2006, ovr: 89 },
    { name: "Анри", pos: "ST", flag: "🇫🇷", nation: "Франция", wc: 2006, ovr: 91 },
    { name: "Клозе", pos: "ST", flag: "🇩🇪", nation: "Германия", wc: 2006, ovr: 88 },
    { name: "Лам", pos: "RB", flag: "🇩🇪", nation: "Германия", wc: 2006, ovr: 88 },
    { name: "Криштиану", pos: "LW", flag: "🇵🇹", nation: "Португалия", wc: 2006, ovr: 92 },
    { name: "Джеррард", pos: "CM", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", nation: "Англия", wc: 2006, ovr: 89 },
    { name: "Лэмпард", pos: "CM", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", nation: "Англия", wc: 2006, ovr: 88 },
    { name: "Иньеста", pos: "CAM", flag: "🇪🇸", nation: "Испания", wc: 2010, ovr: 91 },
    { name: "Хави", pos: "CM", flag: "🇪🇸", nation: "Испания", wc: 2010, ovr: 91 },
    { name: "Касильяс", pos: "GK", flag: "🇪🇸", nation: "Испания", wc: 2010, ovr: 90 },
    { name: "Вилья", pos: "ST", flag: "🇪🇸", nation: "Испания", wc: 2010, ovr: 89 },
    { name: "Рамос", pos: "CB", flag: "🇪🇸", nation: "Испания", wc: 2010, ovr: 88 },
    { name: "Снейдер", pos: "CAM", flag: "🇳🇱", nation: "Нидерланды", wc: 2010, ovr: 90 },
    { name: "Роббен", pos: "RW", flag: "🇳🇱", nation: "Нидерланды", wc: 2010, ovr: 90 },
    { name: "Форлан", pos: "ST", flag: "🇺🇾", nation: "Уругвай", wc: 2010, ovr: 89 },
    { name: "Месси", pos: "RW", flag: "🇦🇷", nation: "Аргентина", wc: 2010, ovr: 90 },
    { name: "Мюллер", pos: "CAM", flag: "🇩🇪", nation: "Германия", wc: 2010, ovr: 87 },
    { name: "Гётце", pos: "CAM", flag: "🇩🇪", nation: "Германия", wc: 2014, ovr: 86 },
    { name: "Нойер", pos: "GK", flag: "🇩🇪", nation: "Германия", wc: 2014, ovr: 92 },
    { name: "Кроос", pos: "CM", flag: "🇩🇪", nation: "Германия", wc: 2014, ovr: 90 },
    { name: "Неймар", pos: "LW", flag: "🇧🇷", nation: "Бразилия", wc: 2014, ovr: 91 },
    { name: "Хамес", pos: "CAM", flag: "🇨🇴", nation: "Колумбия", wc: 2014, ovr: 88 },
    { name: "Роббен", pos: "RW", flag: "🇳🇱", nation: "Нидерланды", wc: 2014, ovr: 90 },
    { name: "Месси", pos: "RW", flag: "🇦🇷", nation: "Аргентина", wc: 2014, ovr: 93 },
    { name: "Азар", pos: "LW", flag: "🇧🇪", nation: "Бельгия", wc: 2014, ovr: 88 },
    { name: "Мбаппе", pos: "ST", flag: "🇫🇷", nation: "Франция", wc: 2018, ovr: 89 },
    { name: "Гризманн", pos: "ST", flag: "🇫🇷", nation: "Франция", wc: 2018, ovr: 89 },
    { name: "Канте", pos: "CDM", flag: "🇫🇷", nation: "Франция", wc: 2018, ovr: 89 },
    { name: "Модрич", pos: "CM", flag: "🇭🇷", nation: "Хорватия", wc: 2018, ovr: 91 },
    { name: "Кейн", pos: "ST", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", nation: "Англия", wc: 2018, ovr: 89 },
    { name: "Де Брюйне", pos: "CM", flag: "🇧🇪", nation: "Бельгия", wc: 2018, ovr: 91 },
    { name: "Неймар", pos: "LW", flag: "🇧🇷", nation: "Бразилия", wc: 2018, ovr: 92 },
    { name: "Салах", pos: "RW", flag: "🇪🇬", nation: "Египет", wc: 2018, ovr: 89 },
    { name: "Месси", pos: "RW", flag: "🇦🇷", nation: "Аргентина", wc: 2022, ovr: 94 },
    { name: "Ди Мария", pos: "RW", flag: "🇦🇷", nation: "Аргентина", wc: 2022, ovr: 87 },
    { name: "Мбаппе", pos: "ST", flag: "🇫🇷", nation: "Франция", wc: 2022, ovr: 93 },
    { name: "Модрич", pos: "CM", flag: "🇭🇷", nation: "Хорватия", wc: 2022, ovr: 88 },
    { name: "Хакими", pos: "RB", flag: "🇲🇦", nation: "Марокко", wc: 2022, ovr: 87 },
    { name: "Винисиус", pos: "LW", flag: "🇧🇷", nation: "Бразилия", wc: 2022, ovr: 88 },
    { name: "Криштиану", pos: "ST", flag: "🇵🇹", nation: "Португалия", wc: 2014, ovr: 95 },
    { name: "Криштиану", pos: "ST", flag: "🇵🇹", nation: "Португалия", wc: 2018, ovr: 94 },
    { name: "Криштиану", pos: "ST", flag: "🇵🇹", nation: "Португалия", wc: 2022, ovr: 91 },
    { name: "Кейн", pos: "ST", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", nation: "Англия", wc: 2022, ovr: 89 },
    { name: "Ямаль", pos: "RW", flag: "🇪🇸", nation: "Испания", wc: 2026, ovr: 89 },
    { name: "Беллингем", pos: "CM", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", nation: "Англия", wc: 2026, ovr: 91 },
    { name: "Холанн", pos: "ST", flag: "🇳🇴", nation: "Норвегия", wc: 2026, ovr: 92 },
    { name: "Винисиус", pos: "LW", flag: "🇧🇷", nation: "Бразилия", wc: 2026, ovr: 91 },
    { name: "Мбаппе", pos: "ST", flag: "🇫🇷", nation: "Франция", wc: 2026, ovr: 93 },
    { name: "Мусиала", pos: "CAM", flag: "🇩🇪", nation: "Германия", wc: 2026, ovr: 89 },
    { name: "Педри", pos: "CM", flag: "🇪🇸", nation: "Испания", wc: 2026, ovr: 88 },
    { name: "Родри", pos: "CDM", flag: "🇪🇸", nation: "Испания", wc: 2026, ovr: 91 },
    { name: "Сака", pos: "RW", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", nation: "Англия", wc: 2026, ovr: 88 },
    { name: "Осимхен", pos: "ST", flag: "🇳🇬", nation: "Нигерия", wc: 2026, ovr: 88 },
    { name: "Таффарел", pos: "GK", flag: "🇧🇷", nation: "Бразилия", wc: 1994, ovr: 86 },
    { name: "Льорис", pos: "GK", flag: "🇫🇷", nation: "Франция", wc: 2018, ovr: 87 },
    { name: "Доннарумма", pos: "GK", flag: "🇮🇹", nation: "Италия", wc: 2022, ovr: 88 },
    { name: "Алиссон", pos: "GK", flag: "🇧🇷", nation: "Бразилия", wc: 2022, ovr: 89 },
    { name: "Куртуа", pos: "GK", flag: "🇧🇪", nation: "Бельгия", wc: 2018, ovr: 90 },
    { name: "Лизаразю", pos: "LB", flag: "🇫🇷", nation: "Франция", wc: 1998, ovr: 86 },
    { name: "Коул", pos: "LB", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", nation: "Англия", wc: 2006, ovr: 86 },
    { name: "Гроссо", pos: "LB", flag: "🇮🇹", nation: "Италия", wc: 2006, ovr: 84 },
    { name: "Альба", pos: "LB", flag: "🇪🇸", nation: "Испания", wc: 2010, ovr: 86 },
    { name: "Марсело", pos: "LB", flag: "🇧🇷", nation: "Бразилия", wc: 2014, ovr: 88 },
    { name: "Эрнандес", pos: "LB", flag: "🇫🇷", nation: "Франция", wc: 2018, ovr: 87 },
    { name: "Тео", pos: "LB", flag: "🇫🇷", nation: "Франция", wc: 2022, ovr: 87 },
    { name: "Занетти", pos: "RB", flag: "🇦🇷", nation: "Аргентина", wc: 1998, ovr: 88 },
    { name: "Алвес", pos: "RB", flag: "🇧🇷", nation: "Бразилия", wc: 2010, ovr: 88 },
    { name: "Карвахаль", pos: "RB", flag: "🇪🇸", nation: "Испания", wc: 2022, ovr: 86 },
    { name: "Уокер", pos: "RB", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", nation: "Англия", wc: 2018, ovr: 86 },
    { name: "Неста", pos: "CB", flag: "🇮🇹", nation: "Италия", wc: 2006, ovr: 91 },
    { name: "Пуйоль", pos: "CB", flag: "🇪🇸", nation: "Испания", wc: 2010, ovr: 89 },
    { name: "Пике", pos: "CB", flag: "🇪🇸", nation: "Испания", wc: 2010, ovr: 87 },
    { name: "Хуммельс", pos: "CB", flag: "🇩🇪", nation: "Германия", wc: 2014, ovr: 88 },
    { name: "Кьеллини", pos: "CB", flag: "🇮🇹", nation: "Италия", wc: 2014, ovr: 90 },
    { name: "Ван Дейк", pos: "CB", flag: "🇳🇱", nation: "Нидерланды", wc: 2022, ovr: 90 },
    { name: "Маркиньос", pos: "CB", flag: "🇧🇷", nation: "Бразилия", wc: 2022, ovr: 88 },
    { name: "Фердинанд", pos: "CB", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", nation: "Англия", wc: 2006, ovr: 88 },
    { name: "Лусио", pos: "CB", flag: "🇧🇷", nation: "Бразилия", wc: 2002, ovr: 87 },
    { name: "Этоо", pos: "ST", flag: "🇨🇲", nation: "Камерун", wc: 2002, ovr: 87 },
    { name: "Этоо", pos: "ST", flag: "🇨🇲", nation: "Камерун", wc: 2010, ovr: 90 },
    { name: "Сонг", pos: "CB", flag: "🇨🇲", nation: "Камерун", wc: 2002, ovr: 84 },
    { name: "Сонг", pos: "CDM", flag: "🇨🇲", nation: "Камерун", wc: 2010, ovr: 85 },
    { name: "Онана", pos: "GK", flag: "🇨🇲", nation: "Камерун", wc: 2022, ovr: 85 },
    { name: "Абубакар", pos: "ST", flag: "🇨🇲", nation: "Камерун", wc: 2022, ovr: 84 },
    { name: "Эссьен", pos: "CM", flag: "🇬🇭", nation: "Гана", wc: 2006, ovr: 88 },
    { name: "Гьян", pos: "ST", flag: "🇬🇭", nation: "Гана", wc: 2010, ovr: 85 },
    { name: "Аппиа", pos: "CM", flag: "🇬🇭", nation: "Гана", wc: 2006, ovr: 84 },
    { name: "Айю", pos: "LW", flag: "🇬🇭", nation: "Гана", wc: 2010, ovr: 84 },
    { name: "Партей", pos: "CDM", flag: "🇬🇭", nation: "Гана", wc: 2022, ovr: 85 },
    { name: "Кудус", pos: "CAM", flag: "🇬🇭", nation: "Гана", wc: 2022, ovr: 84 },
    { name: "Манса", pos: "CB", flag: "🇬🇭", nation: "Гана", wc: 2010, ovr: 82 },
    { name: "Дьоф", pos: "ST", flag: "🇸🇳", nation: "Сенегал", wc: 2002, ovr: 84 },
    { name: "Диао", pos: "CM", flag: "🇸🇳", nation: "Сенегал", wc: 2002, ovr: 82 },
    { name: "Мане", pos: "LW", flag: "🇸🇳", nation: "Сенегал", wc: 2018, ovr: 90 },
    { name: "Мане", pos: "LW", flag: "🇸🇳", nation: "Сенегал", wc: 2022, ovr: 89 },
    { name: "Кулибали", pos: "CB", flag: "🇸🇳", nation: "Сенегал", wc: 2022, ovr: 87 },
    { name: "Гейе", pos: "CM", flag: "🇸🇳", nation: "Сенегал", wc: 2018, ovr: 84 },
    { name: "Менди", pos: "GK", flag: "🇸🇳", nation: "Сенегал", wc: 2022, ovr: 86 },
    { name: "Сарр", pos: "RW", flag: "🇸🇳", nation: "Сенегал", wc: 2022, ovr: 83 }
];

let auction = { slots: AUCTION_SLOTS.map(function () { return null; }), rerolls: 1 };

function slotFamily(pos) {
    if (pos === "GK") return "GK";
    if (pos === "LB" || pos === "RB" || pos === "CB") return pos === "CB" ? "CB" : pos;
    if (pos === "ST" || pos === "LW" || pos === "RW") return pos;
    return "CM";
}

function promoNorm(raw) {
    return String(raw || "").replace(/[\s-]/g, "").toUpperCase();
}
function promoOk(raw) {
    const v = promoNorm(raw);
    return v === PROMO_CODE || v.replace(/\./g, "") === "MADRIDCR7ISTAS";
}
function setPromoHints(text) {
    ["promoHint", "promoHintCareer"].forEach(function (id) {
        const el = get(id);
        if (el) el.textContent = text;
    });
}
function givePromoMoney(silent) {
    if (!player || !player.name) return false;
    if (player.codeMadrid) return false;
    player.codeMadrid = true;
    player.respect = (player.respect || 0) + PROMO_PAY;
    save();
    if (!silent) {
        renderAll();
        showAura("champ", "КОД", "+100 000 $", PROMO_CODE, "#ffd83d", 2000);
        addLog("💰 Код " + PROMO_CODE + " · +" + money(PROMO_PAY));
        Sfx.ding();
    }
    return true;
}
function grantPendingPromo() {
    if (localStorage.getItem(PROMO_PENDING) === "1") {
        if (givePromoMoney(true)) localStorage.removeItem(PROMO_PENDING);
    }
}
function tryPromo(raw) {
    Sfx.unlock();
    Sfx.click();
    if (!promoOk(raw)) {
        Sfx.error();
        setPromoHints("Неверный код");
        return;
    }
    if (player && player.name) {
        if (player.codeMadrid) {
            setPromoHints("Код уже активирован");
            return;
        }
        givePromoMoney();
        setPromoHints("Готово · +100 000 $");
        return;
    }
    if (localStorage.getItem(PROMO_PENDING) === "1") {
        setPromoHints("Код уже сохранён — открой карьеру");
        return;
    }
    localStorage.setItem(PROMO_PENDING, "1");
    setPromoHints("Код принят. +100 000 $ при старте / продолжении карьеры");
    Sfx.ding();
}

function pickArr(list) { return list[Math.floor(Math.random() * list.length)]; }
function starKey(p) { return (p.name || "") + "|" + (p.wc || ""); }
function posFitsSlot(playerPos, slotPos) {
    return slotFamily(playerPos) === slotFamily(slotPos);
}
function copyStar(src) {
    return { name: src.name, pos: src.pos, flag: src.flag, nation: src.nation, wc: src.wc, ovr: src.ovr };
}
function usedStars(exceptIdx) {
    const used = {};
    auction.slots.forEach(function (p, i) {
        if (p && i !== exceptIdx) used[starKey(p)] = true;
    });
    return used;
}
function starsForSlot(slotIdx, exceptIdx) {
    const slotPos = AUCTION_SLOTS[slotIdx];
    const used = usedStars(exceptIdx);
    return WC_STARS.filter(function (s) {
        return !used[starKey(s)] && posFitsSlot(s.pos, slotPos);
    });
}
function nextEmptyMatching(pos) {
    const want = slotFamily(pos);
    for (let i = 0; i < 11; i++) {
        if (auction.slots[i]) continue;
        if (slotFamily(AUCTION_SLOTS[i]) === want) return i;
    }
    return -1;
}
function repairAuctionSlots() {
    const stray = [];
    for (let i = 0; i < 11; i++) {
        const p = auction.slots[i];
        if (!p) continue;
        if (!posFitsSlot(p.pos, AUCTION_SLOTS[i])) {
            stray.push(p);
            auction.slots[i] = null;
        }
    }
    stray.forEach(function (p) {
        const idx = nextEmptyMatching(p.pos);
        if (idx >= 0) auction.slots[idx] = p;
    });
}
function loadAuction() {
    try {
        const raw = localStorage.getItem(AUCTION_KEY);
        if (!raw) return;
        const data = JSON.parse(raw);
        if (!data || !Array.isArray(data.slots) || data.slots.length !== 11) return;
        auction = { slots: data.slots, rerolls: data.rerolls === 0 ? 0 : 1 };
        repairAuctionSlots();
    } catch (err) {}
}
function saveAuction() {
    localStorage.setItem(AUCTION_KEY, JSON.stringify(auction));
}
function auctionFilled() {
    let n = 0;
    auction.slots.forEach(function (p) { if (p) n++; });
    return n;
}
function renderAuction() {
    const pitch = get("auctionPitch");
    const meta = get("auctionMeta");
    if (!pitch) return;
    pitch.innerHTML = "";
    let i = 0;
    AUCTION_LINES.forEach(function (line) {
        const row = document.createElement("div");
        row.className = "pitch-line";
        line.forEach(function () {
            const idx = i++;
            const slotPos = AUCTION_SLOTS[idx];
            const p = auction.slots[idx];
            const slot = document.createElement("button");
            slot.type = "button";
            slot.className = "pitch-slot" + (p ? " filled" : "");
            slot.setAttribute("data-auc", String(idx));
            if (p) {
                const name = document.createElement("b");
                name.textContent = p.flag + " " + p.name;
                slot.appendChild(name);
                const metaLine = document.createElement("small");
                metaLine.textContent = p.pos + " " + p.ovr + " · ЧМ " + p.wc;
                slot.appendChild(metaLine);
            } else {
                slot.textContent = slotPos;
            }
            row.appendChild(slot);
        });
        pitch.appendChild(row);
    });
    if (meta) {
        meta.textContent = "4-3-3 · " + auctionFilled() + "/11 · строго по позициям · перекруток: " + auction.rerolls;
    }
}
function showAuction() {
    Sfx.unlock();
    Sfx.click();
    loadAuction();
    get("modeScreen").style.display = "none";
    get("createScreen").style.display = "none";
    get("careerScreen").style.display = "none";
    const box = get("auctionScreen");
    box.hidden = false;
    box.style.display = "block";
    document.body.classList.add("in-auction");
    document.body.classList.remove("in-career", "mode-club");
    renderAuction();
}
let auctionBusy = false;
function paintSlotFace(el, p, spinning) {
    if (!el) return;
    el.className = "pitch-slot filled" + (spinning ? " spinning" : "");
    el.innerHTML = "";
    const name = document.createElement("b");
    name.textContent = p.flag + " " + p.name;
    el.appendChild(name);
    const metaLine = document.createElement("small");
    metaLine.textContent = spinning ? "…" : (p.pos + " " + p.ovr + " · ЧМ " + p.wc);
    el.appendChild(metaLine);
}
function auctionReveal(idx, star, isReroll) {
    if (auctionBusy) return;
    auctionBusy = true;
    const rollBtn = get("auctionRollAll");
    if (rollBtn) rollBtn.disabled = true;
    renderAuction();
    const el = document.querySelector('[data-auc="' + idx + '"]');
    const flicker = starsForSlot(idx, idx);
    Sfx.unlock();
    if (Sfx.suspense) Sfx.suspense();
    let n = 0;
    const ticks = 14;
    const timer = setInterval(function () {
        n++;
        const fake = pickArr(flicker.length ? flicker : WC_STARS);
        paintSlotFace(el, fake, true);
        if (n < ticks) return;
        clearInterval(timer);
        if (isReroll) auction.rerolls = 0;
        auction.slots[idx] = copyStar(star);
        saveAuction();
        renderAuction();
        const done = document.querySelector('[data-auc="' + idx + '"]');
        if (done) done.classList.add("reveal");
        if (star.ovr >= 92) {
            showAura("champ", "ЧМ " + star.wc, star.name, star.flag + " " + star.pos + " " + star.ovr, "#ffd83d", 1500);
        }
        Sfx.ding();
        auctionBusy = false;
        if (rollBtn) rollBtn.disabled = false;
    }, 110);
}
function auctionRollSlot(idx) {
    if (auctionBusy) return;
    if (!auction.slots[idx]) {
        Sfx.error();
        return;
    }
    if (auction.rerolls < 1) {
        Sfx.error();
        const meta = get("auctionMeta");
        if (meta) meta.textContent = "Перекрутка уже использована. Жми ЗАНОВО.";
        return;
    }
    const pool = starsForSlot(idx, idx);
    if (!pool.length) {
        Sfx.error();
        return;
    }
    auctionReveal(idx, pickArr(pool), true);
}
function auctionRollOne() {
    if (auctionBusy) return;
    Sfx.unlock();
    const empty = [];
    for (let i = 0; i < 11; i++) if (!auction.slots[i]) empty.push(i);
    if (!empty.length) {
        Sfx.error();
        const meta = get("auctionMeta");
        if (meta) meta.textContent = "Состав полный. ЗАНОВО — новый.";
        return;
    }
    const idx = pickArr(empty);
    const pool = starsForSlot(idx, idx);
    if (!pool.length) {
        Sfx.error();
        return;
    }
    auctionReveal(idx, pickArr(pool), false);
}
function auctionReset() {
    Sfx.unlock();
    Sfx.click();
    auction = { slots: AUCTION_SLOTS.map(function () { return null; }), rerolls: 1 };
    auctionBusy = false;
    saveAuction();
    renderAuction();
}

function syncMuteButton() {
    get("muteBtn").textContent = Sfx.isMuted() ? "🔇" : "🔊";
}

function on(id, ev, fn) {
    const el = get(id);
    if (!el) return;
    el.addEventListener(ev, fn);
}

function bind() {
    on("modePlayer", "click", function () { selectMode("player"); });
    on("modeClub", "click", function () { selectMode("club"); });
    on("modeBattle", "click", startOnlineFromMenu);
    on("modeAuction", "click", showAuction);
    on("auctionBack", "click", function () {
        Sfx.click();
        showModeScreen();
    });
    on("auctionRollAll", "click", auctionRollOne);
    on("auctionReset", "click", auctionReset);
    on("auctionPitch", "click", function (event) {
        const slot = event.target.closest("[data-auc]");
        if (!slot) return;
        auctionRollSlot(+slot.getAttribute("data-auc"));
    });
    on("openAuctionBtn", "click", showAuction);
    on("promoBtn", "click", function () { tryPromo(get("promoCode").value); });
    on("promoBtnCareer", "click", function () { tryPromo(get("promoCodeCareer").value); });
    on("promoCode", "keydown", function (event) {
        if (event.key === "Enter") tryPromo(get("promoCode").value);
    });
    on("promoCodeCareer", "keydown", function (event) {
        if (event.key === "Enter") tryPromo(get("promoCodeCareer").value);
    });
    get("backToMode").addEventListener("click", function () {
        Sfx.click();
        showModeScreen();
    });
    get("continueBtn").addEventListener("click", function () {
        Sfx.unlock();
        Sfx.click();
        if (player && player.name) showCareer();
    });
    get("exitCareerBtn").addEventListener("click", exitToMenu);
    get("startBtn").addEventListener("click", startCareer);
    get("restBtn").addEventListener("click", rest);
    get("restFastBtn").addEventListener("click", restFast);
    get("matchBtn").addEventListener("click", function () { playMatch(false); });
    get("bribeBtn").addEventListener("click", function () { playMatch(true); });
    get("onlineBtn").addEventListener("click", openOnlineLobby);
    get("newCareerBtn").addEventListener("click", newCareer);
    get("dockMatch").addEventListener("click", function () {
        showPanel("match");
        playMatch(false);
    });
    get("dockBattle").addEventListener("click", function () {
        showPanel("match");
        openOnlineLobby();
    });
    get("dockRest").addEventListener("click", function () {
        showPanel("train");
        rest();
    });
    get("dockMenu").addEventListener("click", exitToMenu);
    const tabs = get("careerTabs");
    if (tabs) {
        tabs.addEventListener("click", function (event) {
            const btn = event.target.closest("[data-panel]");
            if (!btn) return;
            Sfx.click();
            showPanel(btn.getAttribute("data-panel"));
        });
    }
    get("fxOverlay").addEventListener("click", hideAura);
    get("battleCancel").addEventListener("click", function () {
        Sfx.click();
        closeOnlineLobby();
    });
    get("battleGo").addEventListener("click", function () {
        Sfx.click();
        playOnline();
    });
    get("joinBattleBtn").addEventListener("click", joinOnlineCode);
    get("copyBattleCode").addEventListener("click", copyBattleCode);
    get("friendBattleCode").addEventListener("keydown", function (event) {
        if (event.key === "Enter") joinOnlineCode();
    });
    get("battleOverlay").addEventListener("click", function (event) {
        if (event.target === get("battleOverlay") && !matchBusy) closeOnlineLobby();
    });
    const marketTabs = get("marketTabs");
    if (marketTabs) {
        marketTabs.addEventListener("click", function (event) {
            const btn = event.target.closest("[data-tier]");
            if (!btn) return;
            Sfx.click();
            marketFilter = btn.getAttribute("data-tier");
            updateMarket();
        });
    }
    const posTabs = get("marketPos");
    if (posTabs) {
        posTabs.addEventListener("click", function (event) {
            const btn = event.target.closest("[data-pos]");
            if (!btn) return;
            Sfx.click();
            marketPos = btn.getAttribute("data-pos");
            updateMarket();
        });
    }
    const marketBox = get("market");
    if (marketBox) {
        marketBox.addEventListener("click", function (event) {
            const btn = event.target.closest("[data-star]");
            if (!btn) return;
            const star = TRANSFER_STARS.find((s) => s.id === btn.getAttribute("data-star"));
            if (star) {
                Sfx.click();
                signStar(star);
            }
        });
    }
    const squadBox = get("squad");
    if (squadBox) {
        squadBox.addEventListener("click", function (event) {
            const btn = event.target.closest("[data-sell]");
            if (!btn) return;
            const star = TRANSFER_STARS.find((s) => s.id === btn.getAttribute("data-sell"));
            if (star) {
                Sfx.click();
                releaseStar(star);
            }
        });
    }
    get("muteBtn").addEventListener("click", function () {
        Sfx.unlock();
        Sfx.setMuted(!Sfx.isMuted());
        syncMuteButton();
        if (!Sfx.isMuted()) Sfx.click();
    });
    document.querySelectorAll("[data-train]").forEach((button) => {
        button.addEventListener("click", function () {
            train(button.getAttribute("data-train"));
        });
    });
    get("playerName").addEventListener("keydown", function (event) {
        if (event.key === "Enter") startCareer();
    });
    get("clubName").addEventListener("keydown", function (event) {
        if (event.key === "Enter") startCareer();
    });
    get("clubCity").addEventListener("keydown", function (event) {
        if (event.key === "Enter") startCareer();
    });
    document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === "hidden" && player.name) save();
    });
    window.addEventListener("pagehide", function () {
        if (player.name) save();
    });
}

document.addEventListener("DOMContentLoaded", function () {
    ["promoCode", "promoCodeCareer"].forEach(function (id) {
        const el = get(id);
        if (el) el.value = "";
    });
    bind();
    syncMuteButton();
    renderRecords();
    loadAuction();
    load();
    showModeScreen();
});

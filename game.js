"use strict";

const SAVE_KEY = "fc-career-v2";
const TRAIN_COST = 16;
const MATCH_COST = 22;
const REST_GAIN = 50;
const REST_FAST_COST = 100;
const ENERGY_MAX = 100;
const REST_LOCK_MS = 12000;
const REST_FAST_MS = 1000;
const MATCH_EVERY = 2;
const YEAR_WEEKS = 36;
const SQUAD_XI = 11;
const SQUAD_BENCH = 7;
const WC_IN_YEAR = 24;
const BALLON_IN_YEAR = 34;
const INJURIES = [
    { id: "bruise", name: "ушиб", weeks: 1, emoji: "🩹", w: 58, zones: ["head", "shoulder", "ribs", "arm"] },
    { id: "sprain", name: "растяжение", weeks: 2, emoji: "🤕", w: 28, zones: ["hamstring", "ankle", "groin", "shoulder"] },
    { id: "muscle", name: "мышца", weeks: 3, emoji: "💢", w: 11, zones: ["hamstring", "calf", "groin"] },
    { id: "break", name: "перелом", weeks: 4, emoji: "🚑", w: 3, zones: ["ankle", "arm", "ribs", "knee"] }
];
const PART_NAMES = {
    head: "голова",
    shoulder: "плечо",
    arm: "рука",
    ribs: "рёбра",
    back: "спина",
    groin: "пах",
    hamstring: "бедро",
    knee: "колено",
    calf: "икра",
    ankle: "лодыжка"
};
const SPONSORS = [
    { id: "mcduck", name: "McDuck", emoji: "🦆", base: 22, fame: 34, cost: 150 },
    { id: "abibas", name: "Abibas", emoji: "👟", base: 36, fame: 44, cost: 280 },
    { id: "nikke", name: "Nikke", emoji: "✔️", base: 32, fame: 42, cost: 240 },
    { id: "tucci", name: "Tucci", emoji: "👜", base: 48, fame: 52, cost: 420 },
    { id: "samsong", name: "Samsong", emoji: "📱", base: 60, fame: 58, cost: 560 },
    { id: "mersedez", name: "Mersedez", emoji: "🚗", base: 74, fame: 64, cost: 720 },
    { id: "pupik", name: "Pupik Studios", emoji: "💻", base: 88, fame: 68, cost: 860 },
    { id: "pmw", name: "PMW", emoji: "🏎️", base: 120, fame: 74, cost: 1100, best: true }
];
const DEAL_CAP = 3;
const BRAND_TYPES = [
    { id: "wear", name: "одежда", emoji: "👕", minFame: 52, cost: 600, mult: 1, grade: 2, loanCap: 1400, loanRate: 0.16 },
    { id: "boots", name: "бутсы", emoji: "⚽", minFame: 60, cost: 900, mult: 1.15, grade: 4, loanCap: 3500, loanRate: 0.08 },
    { id: "drink", name: "напиток", emoji: "🥤", minFame: 48, cost: 450, mult: 0.9, grade: 1, loanCap: 700, loanRate: 0.22 },
    { id: "perfume", name: "парфюм", emoji: "🧴", minFame: 58, cost: 750, mult: 1.1, grade: 3, loanCap: 2200, loanRate: 0.12 },
    { id: "eatery", name: "ресторан", emoji: "🍽️", minFame: 50, cost: 1200, mult: 1.2, grade: 3, loanCap: 2800, loanRate: 0.11 },
    { id: "agency", name: "агентство", emoji: "💼", minFame: 72, cost: 2200, mult: 1.45, grade: 5, loanCap: 8000, loanRate: 0.05 }
];
const AUTOSAVE_MS = 20000;
const BRIBE_CATCH = 0.7;
const RECORDS_KEY = "fc-records-v1";
const ONLINE_COST = 18;
const ONLINE_LOCK_MS = 15000;
const TREAT_COST = { muscle: 450, break: 900 };
const WC_WIN_PAY = 3000;
const WC_LOSS_PAY = { group: 400, qf: 800, sf: 1400, final: 2000 };
const BALLON_RIVALS = [
    { n: "Haaland", flag: "🇳🇴", s: 76 },
    { n: "Mbappé", flag: "🇫🇷", s: 75 },
    { n: "Bellingham", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", s: 71 },
    { n: "Vinícius", flag: "🇧🇷", s: 70 },
    { n: "Rodri", flag: "🇪🇸", s: 69 },
    { n: "Kane", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", s: 67 },
    { n: "Salah", flag: "🇪🇬", s: 66 },
    { n: "De Bruyne", flag: "🇧🇪", s: 64 },
    { n: "Yamal", flag: "🇪🇸", s: 63 },
    { n: "Osimhen", flag: "🇳🇬", s: 61 },
    { n: "Pedri", flag: "🇪🇸", s: 60 },
    { n: "Wirtz", flag: "🇩🇪", s: 59 }
];

const OUTFIELD_KEYS = ["pace", "shooting", "passing", "dribbling", "defending", "physical", "stamina", "vision", "setpieces"];
const GK_KEYS = ["diving", "handling", "kicking", "reflexes", "speed", "positioning", "stamina", "command"];
const CB_KEYS = ["marking", "tackling", "heading", "strength", "jumping", "passing", "stamina", "vision"];

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
    jumping: "Прыжок",
    stamina: "Выносливость",
    vision: "Видение",
    setpieces: "Стандарты",
    command: "Команда"
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
    jumping: "🦘 Прыжок",
    stamina: "🫁 Выносливость",
    vision: "👁️ Видение",
    setpieces: "🎯 Стандарты",
    command: "🗣️ Команда"
};

const START_STATS = {
    ST:  { pace: 64, shooting: 68, passing: 52, dribbling: 60, defending: 32, physical: 58, stamina: 60, vision: 54, setpieces: 58 },
    LW:  { pace: 70, shooting: 58, passing: 56, dribbling: 68, defending: 34, physical: 50, stamina: 62, vision: 56, setpieces: 54 },
    RW:  { pace: 70, shooting: 58, passing: 56, dribbling: 68, defending: 34, physical: 50, stamina: 62, vision: 56, setpieces: 54 },
    CAM: { pace: 58, shooting: 62, passing: 68, dribbling: 66, defending: 38, physical: 52, stamina: 58, vision: 68, setpieces: 64 },
    CM:  { pace: 56, shooting: 52, passing: 68, dribbling: 58, defending: 54, physical: 60, stamina: 64, vision: 66, setpieces: 60 },
    CDM: { pace: 52, shooting: 42, passing: 62, dribbling: 50, defending: 68, physical: 66, stamina: 66, vision: 60, setpieces: 52 },
    CB:  { marking: 70, tackling: 68, heading: 72, strength: 74, jumping: 70, passing: 52, stamina: 66, vision: 50 },
    LB:  { pace: 68, shooting: 40, passing: 60, dribbling: 58, defending: 62, physical: 58, stamina: 64, vision: 56, setpieces: 50 },
    RB:  { pace: 68, shooting: 40, passing: 60, dribbling: 58, defending: 62, physical: 58, stamina: 64, vision: 56, setpieces: 50 },
    GK:  { diving: 68, handling: 66, kicking: 58, reflexes: 70, speed: 44, positioning: 67, stamina: 58, command: 62 }
};

const OVR_WEIGHTS = {
    ST:  { pace: 1.2, shooting: 1.7, passing: 0.7, dribbling: 1.1, defending: 0.35, physical: 1.0, stamina: 0.7, vision: 0.45, setpieces: 0.4 },
    LW:  { pace: 1.5, shooting: 1.1, passing: 1.0, dribbling: 1.5, defending: 0.4, physical: 0.7, stamina: 0.65, vision: 0.5, setpieces: 0.35 },
    RW:  { pace: 1.5, shooting: 1.1, passing: 1.0, dribbling: 1.5, defending: 0.4, physical: 0.7, stamina: 0.65, vision: 0.5, setpieces: 0.35 },
    CAM: { pace: 0.9, shooting: 1.2, passing: 1.6, dribbling: 1.3, defending: 0.5, physical: 0.7, stamina: 0.55, vision: 0.7, setpieces: 0.55 },
    CM:  { pace: 0.8, shooting: 0.8, passing: 1.6, dribbling: 1.0, defending: 1.0, physical: 1.1, stamina: 0.7, vision: 0.65, setpieces: 0.45 },
    CDM: { pace: 0.7, shooting: 0.5, passing: 1.2, dribbling: 0.7, defending: 1.6, physical: 1.3, stamina: 0.75, vision: 0.5, setpieces: 0.3 },
    CB:  { marking: 1.6, tackling: 1.55, heading: 1.35, strength: 1.4, jumping: 1.1, passing: 0.75, stamina: 0.6, vision: 0.35 },
    LB:  { pace: 1.3, shooting: 0.5, passing: 1.1, dribbling: 1.0, defending: 1.2, physical: 1.0, stamina: 0.7, vision: 0.45, setpieces: 0.3 },
    RB:  { pace: 1.3, shooting: 0.5, passing: 1.1, dribbling: 1.0, defending: 1.2, physical: 1.0, stamina: 0.7, vision: 0.45, setpieces: 0.3 },
    GK:  { diving: 1.5, handling: 1.4, kicking: 0.85, reflexes: 1.65, speed: 0.55, positioning: 1.5, stamina: 0.45, command: 0.5 }
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
    { id: "KZ", flag: "🇰🇿", name: "Казахстан", nameEn: "Kazakhstan", city: "Астана", cityEn: "Astana" },
    { id: "RU", flag: "🇷🇺", name: "Россия", nameEn: "Russia", city: "Москва", cityEn: "Moscow" },
    { id: "UZ", flag: "🇺🇿", name: "Узбекистан", nameEn: "Uzbekistan", city: "Ташкент", cityEn: "Tashkent" },
    { id: "BY", flag: "🇧🇾", name: "Беларусь", nameEn: "Belarus", city: "Минск", cityEn: "Minsk" },
    { id: "RS", flag: "🇷🇸", name: "Сербия", nameEn: "Serbia", city: "Белград", cityEn: "Belgrade" },
    { id: "BR", flag: "🇧🇷", name: "Бразилия", nameEn: "Brazil", city: "Сан-Паулу", cityEn: "Sao Paulo" },
    { id: "AR", flag: "🇦🇷", name: "Аргентина", nameEn: "Argentina", city: "Буэнос-Айрес", cityEn: "Buenos Aires" },
    { id: "FR", flag: "🇫🇷", name: "Франция", nameEn: "France", city: "Париж", cityEn: "Paris" },
    { id: "DE", flag: "🇩🇪", name: "Германия", nameEn: "Germany", city: "Берлин", cityEn: "Berlin" },
    { id: "ES", flag: "🇪🇸", name: "Испания", nameEn: "Spain", city: "Мадрид", cityEn: "Madrid" },
    { id: "IT", flag: "🇮🇹", name: "Италия", nameEn: "Italy", city: "Милан", cityEn: "Milan" },
    { id: "PT", flag: "🇵🇹", name: "Португалия", nameEn: "Portugal", city: "Лиссабон", cityEn: "Lisbon" },
    { id: "GB", flag: "🇬🇧", name: "Англия", nameEn: "England", city: "Лондон", cityEn: "London" },
    { id: "NL", flag: "🇳🇱", name: "Нидерланды", nameEn: "Netherlands", city: "Амстердам", cityEn: "Amsterdam" },
    { id: "HR", flag: "🇭🇷", name: "Хорватия", nameEn: "Croatia", city: "Загреб", cityEn: "Zagreb" },
    { id: "NG", flag: "🇳🇬", name: "Нигерия", nameEn: "Nigeria", city: "Лагос", cityEn: "Lagos" },
    { id: "SN", flag: "🇸🇳", name: "Сенегал", nameEn: "Senegal", city: "Дакар", cityEn: "Dakar" },
    { id: "JP", flag: "🇯🇵", name: "Япония", nameEn: "Japan", city: "Токио", cityEn: "Tokyo" },
    { id: "TR", flag: "🇹🇷", name: "Турция", nameEn: "Turkey", city: "Стамбул", cityEn: "Istanbul" }
];

const OLD_AVATARS = ["⚽", "😎", "🧔", "🦁", "🐺", "🦅", "🔥", "👑", "🧊", "💫", "🎯", "🧤", "🛡️", "👦", "🥷"];
const PLAYER_AVATARS = OLD_AVATARS;

function avatarIndex(value) {
    const m = /^p(\d+)$/.exec(String(value || ""));
    if (m) return (+m[1]) % 12;
    const old = OLD_AVATARS.indexOf(value);
    if (old >= 0) return old % 12;
    let h = 0;
    const s = String(value || "p");
    for (let i = 0; i < s.length; i++) h = (h + s.charCodeAt(i) * (i + 1)) % 12;
    return h;
}

function portraitSvg(n, wear) {
    n = Math.abs(n | 0) % 12;
    wear = wear || {};
    const skin = ["#f3d2b5", "#e7b48a", "#c68642", "#8d5524", "#f6d7c3", "#a86b45"][n % 6];
    const hair = (wear.hairInk) || ["#1c1c1c", "#4a2c17", "#c9a227", "#2c1810", "#6b4423", "#d9d9d9", "#111111", "#7a1f1f"][n % 8];
    const shirt = (wear.shirtInk) || ["#163a5f", "#9b1c1c", "#14532d", "#f4f4f4", "#1f2937", "#b45309", "#312e81", "#0f766e"][n % 8];
    const boots = wear.bootInk || "";
    const sole = wear.soleInk || boots;
    const beard = n % 4 === 0;
    const style = wear.hairStyle || (n % 3 !== 2 ? "fringe" : "short");
    let hairSvg = "";
    if (style === "mohawk") hairSvg = '<path d="M29 6h6c1 8 1 18 0 24h-6c-1-6-1-16 0-24z" fill="' + hair + '"/>';
    else if (style === "curls") hairSvg = '<circle cx="22" cy="20" r="6" fill="' + hair + '"/><circle cx="32" cy="14" r="7" fill="' + hair + '"/><circle cx="42" cy="20" r="6" fill="' + hair + '"/>';
    else if (style === "long") hairSvg = '<path d="M16 26c0-16 8-20 16-20s16 4 16 20v16h-6V30c-2-6-6-8-10-8s-8 2-10 8v12h-6z" fill="' + hair + '"/>';
    else if (style === "fringe") hairSvg = '<path d="M16 28c1-14 8-20 16-20s15 6 16 20c-4-7-10-9-16-9s-12 2-16 9z" fill="' + hair + '"/>';
    else if (style !== "bald") hairSvg = '<path d="M18 22c2-8 8-12 14-12s12 4 14 12c-6-3-22-3-28 0z" fill="' + hair + '"/>';
    const cap = wear.capInk
        ? '<path d="M16 22h32v7H16z" fill="' + wear.capInk + '"/><path d="M42 24h12l-2 5H42z" fill="' + wear.capInk + '"/>'
        : "";
    const stripe = wear.stripeInk ? '<rect x="0" y="50" width="64" height="4" fill="' + wear.stripeInk + '"/>' : "";
    const sleeve = wear.sleeve === "long"
        ? '<rect x="0" y="36" width="14" height="22" rx="3" fill="' + shirt + '"/><rect x="50" y="36" width="14" height="22" rx="3" fill="' + shirt + '"/>'
        : "";
    const sockH = wear.sockLen === "long" ? 16 : wear.sockLen === "short" ? 4 : 9;
    const sockSvg = wear.sockInk
        ? '<rect x="18" y="' + (62 - sockH) + '" width="10" height="' + sockH + '" fill="' + wear.sockInk + '"/><rect x="36" y="' + (62 - sockH) + '" width="10" height="' + sockH + '" fill="' + wear.sockInk + '"/>'
        + (wear.shin ? '<rect x="19" y="' + (60 - Math.min(sockH, 8)) + '" width="8" height="6" fill="#d6d3d1" opacity="0.9"/><rect x="37" y="' + (60 - Math.min(sockH, 8)) + '" width="8" height="6" fill="#d6d3d1" opacity="0.9"/>' : "")
        : "";
    const bootSvg = boots
        ? '<ellipse cx="24" cy="61" rx="8" ry="3" fill="' + boots + '"/><ellipse cx="42" cy="61" rx="8" ry="3" fill="' + boots + '"/><rect x="17" y="62" width="14" height="2" fill="' + sole + '"/><rect x="35" y="62" width="14" height="2" fill="' + sole + '"/>'
        : "";
    return '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
        + '<rect width="64" height="64" fill="' + shirt + '"/>'
        + '<path d="M6 64c6-16 14-22 26-22s20 6 26 22z" fill="' + shirt + '"/>'
        + sleeve
        + stripe
        + sockSvg
        + '<circle cx="32" cy="30" r="16" fill="' + skin + '"/>'
        + hairSvg
        + cap
        + '<circle cx="26" cy="31" r="1.7" fill="#1a1a1a"/>'
        + '<circle cx="38" cy="31" r="1.7" fill="#1a1a1a"/>'
        + '<path d="M28 38c2.2 2 6 2 8.2 0" fill="none" stroke="#6b3f2a" stroke-width="1.3" stroke-linecap="round"/>'
        + (beard && style !== "bald" ? '<path d="M22 36c2 11 18 11 20 0" fill="' + hair + '" opacity="0.9"/>' : "")
        + bootSvg
        + "</svg>";
}

function crestSvg(seed) {
    const colors = ["#1d4ed8", "#b91c1c", "#15803d", "#111827", "#ca8a04", "#7c3aed"];
    const ink = ["#ffffff", "#fde68a", "#ffffff", "#d4af37", "#111111", "#ffffff"];
    const i = Math.abs(seed | 0) % colors.length;
    return '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
        + '<rect width="64" height="64" fill="' + colors[i] + '"/>'
        + '<path d="M32 8l18 7v16c0 13-8 22-18 26-10-4-18-13-18-26V15z" fill="' + ink[i] + '"/>'
        + '<circle cx="32" cy="30" r="6" fill="' + colors[i] + '"/>'
        + "</svg>";
}

function skinInk() {
    const s = player && player.skin;
    return typeof SKIN_TONES !== "undefined" && SKIN_TONES.indexOf(s) >= 0 ? s : "#e7b48a";
}

function headSvg(wear, skin) {
    wear = wear || {};
    const skinC = skin || "#e7b48a";
    const hair = wear.hairInk || "#1c1c1c";
    const style = wear.hairStyle || "short";
    let top = "";
    if (wear.capInk) {
        top = '<path d="M15 33c1-15 8-20 17-20s16 5 17 20v8H15z" fill="' + wear.capInk + '" stroke="#111" stroke-width="1.2"/>'
            + '<path d="M44 35h18l-3 8H44z" fill="' + wear.capInk + '" stroke="#111" stroke-width="1.2"/>';
    } else if (style === "bald") {
        top = "";
    } else if (style === "mohawk") {
        top = '<path d="M29 8h6c1 8 1 16 0 22h-6c-1-6-1-14 0-22z" fill="' + hair + '"/>';
    } else if (style === "curls") {
        top = '<circle cx="20" cy="24" r="6" fill="' + hair + '"/><circle cx="32" cy="16" r="7" fill="' + hair + '"/><circle cx="44" cy="24" r="6" fill="' + hair + '"/>';
    } else if (style === "long") {
        top = '<path d="M16 30c0-16 8-20 16-20s16 4 16 20v8h-5v-6c-2-6-6-8-11-8s-9 2-11 8v6h-5z" fill="' + hair + '"/>';
    } else if (style === "fringe") {
        top = '<path d="M16 34c1-16 8-22 16-22s15 6 16 22c-4-8-10-10-16-10s-12 2-16 10z" fill="' + hair + '"/>';
    } else {
        top = '<path d="M18 28c2-10 8-14 14-14s12 4 14 14c-6-4-22-4-28 0z" fill="' + hair + '"/>';
    }
    return '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
        + '<circle cx="32" cy="36" r="16" fill="' + skinC + '"/>'
        + '<rect x="26" y="50" width="12" height="14" fill="' + skinC + '"/>'
        + top
        + '<circle cx="26" cy="36" r="1.6" fill="#1a1a1a"/>'
        + '<circle cx="38" cy="36" r="1.6" fill="#1a1a1a"/>'
        + '<path d="M28 43c2 2 6 2 8 0" fill="none" stroke="#6b3f2a" stroke-width="1.2" stroke-linecap="round"/>'
        + "</svg>";
}

const FACE_PEOPLE = ["👦", "👨", "🧔", "🧓", "👴"];

function ageFace(age) {
    age = typeof age === "number" ? age : 16;
    if (age < 19) return "👦";
    if (age < 28) return "👨";
    if (age < 50) return "🧔";
    if (age < 58) return "🧓";
    return "👴";
}

function personBase(value) {
    const bare = String(value || "").replace(/[\u{1F3FB}-\u{1F3FF}]/gu, "");
    return FACE_PEOPLE.indexOf(bare) >= 0 ? bare : "👦";
}

function personEmoji(value, skin) {
    const mod = {
        "#f6d7c3": "\u{1F3FB}",
        "#e7b48a": "\u{1F3FC}",
        "#c68642": "\u{1F3FD}",
        "#8d5524": "\u{1F3FE}",
        "#5c3317": "\u{1F3FF}",
        "#3b2212": "\u{1F3FF}"
    };
    return personBase(value) + (mod[skin || skinInk()] || "\u{1F3FD}");
}

function shownFaceAge() {
    if (!player) return 16;
    if (typeof player.faceAge === "number" && player.faceAge >= 16) return player.faceAge;
    return typeof player.age === "number" ? player.age : 16;
}

function playerFaceHtml() {
    const look = wearLook() || {};
    const flower = look.flower ? '<span class="face-flower">' + look.flower + "</span>" : "";
    const face = player && player.name && !isClub() ? ageFace(shownFaceAge()) : "👨";
    return '<span class="face-emoji">' + personEmoji(face, skinInk()) + "</span>" + flower;
}

function setFace(el, value, asClub) {
    if (!el) return;
    if (asClub) {
        el.innerHTML = crestSvg(socSeed(String(value || "club")));
        return;
    }
    el.innerHTML = playerFaceHtml(value);
}

const SHOP = [
    { id: "h1", mode: "off", tab: "hair", slot: "hair", style: "bald", price: 15, ru: "Налысо", en: "Shaved" },
    { id: "h2", mode: "off", tab: "hair", slot: "hair", style: "short", price: 25, ru: "Короткая", en: "Short" },
    { id: "h3", mode: "off", tab: "hair", slot: "hair", style: "fringe", price: 40, ru: "Чёлка", en: "Fringe" },
    { id: "h4", mode: "off", tab: "hair", slot: "hair", style: "curls", price: 90, ru: "Кудри", en: "Curls" },
    { id: "h5", mode: "off", tab: "hair", slot: "hair", style: "mohawk", ink: "#111111", price: 140, ru: "Ирокез", en: "Mohawk" },
    { id: "h6", mode: "off", tab: "hair", slot: "hair", style: "long", price: 180, ru: "Длинные", en: "Long" },
    { id: "h7", mode: "off", tab: "hair", slot: "hair", style: "fringe", ink: "#e6c36a", price: 220, ru: "Светлые", en: "Blonde" },
    { id: "h8", mode: "off", tab: "hair", slot: "hair", style: "curls", ink: "#9a3412", price: 260, ru: "Рыжие", en: "Red" },
    { id: "s1", mode: "off", tab: "cloth", slot: "shirt", ink: "#64748b", price: 15, ru: "Дворовая, линяет", en: "Yard shirt, fades" },
    { id: "s2", mode: "off", tab: "cloth", slot: "shirt", ink: "#166534", price: 35, ru: "С рынка", en: "Market tee" },
    { id: "s3", mode: "off", tab: "cloth", slot: "shirt", ink: "#e7e5e4", price: 60, ru: "Тонкий хлопок", en: "Thin cotton" },
    { id: "st1", mode: "off", tab: "cloth", slot: "shirt", ink: "#111827", price: 180, ru: "Костюм на пресс", en: "Press suit" },
    { id: "st2", mode: "off", tab: "cloth", slot: "shirt", ink: "#1e3a5f", price: 260, ru: "Костюм тёмно-синий", en: "Navy suit" },
    { id: "j1", mode: "off", tab: "jacket", slot: "jacket", price: 45, ru: "Куртка с рынка", en: "Market jacket" },
    { id: "ja", mode: "off", tab: "jacket", slot: "jacket", price: 520, ru: "Куртка Abibas", en: "Abibas jacket" },
    { id: "jj", mode: "off", tab: "jacket", slot: "jacket", price: 690, ru: "Куртка Jordon", en: "Jordon jacket" },
    { id: "c1", mode: "off", tab: "cap", slot: "cap", ink: "#44403c", price: 20, ru: "Кепка двора", en: "Yard cap" },
    { id: "cw", mode: "off", tab: "cap", slot: "cap", ink: "#f8fafc", price: 30, ru: "Кепка белая", en: "White cap" },
    { id: "cr", mode: "off", tab: "cap", slot: "cap", ink: "#b91c1c", price: 35, ru: "Кепка красная", en: "Red cap" },
    { id: "cb", mode: "off", tab: "cap", slot: "cap", ink: "#2563eb", price: 35, ru: "Кепка синяя", en: "Blue cap" },
    { id: "cg", mode: "off", tab: "cap", slot: "cap", ink: "#15803d", price: 35, ru: "Кепка зелёная", en: "Green cap" },
    { id: "cy", mode: "off", tab: "cap", slot: "cap", ink: "#eab308", price: 35, ru: "Кепка жёлтая", en: "Yellow cap" },
    { id: "cp", mode: "off", tab: "cap", slot: "cap", ink: "#ec4899", price: 35, ru: "Кепка розовая", en: "Pink cap" },
    { id: "cj", mode: "off", tab: "cap", slot: "cap", ink: "#111111", price: 380, ru: "Кепка Jordon", en: "Jordon cap" },
    { id: "cn", mode: "off", tab: "cap", slot: "cap", ink: "#171717", price: 320, ru: "Кепка Nikke", en: "Nikke cap" },
    { id: "ca", mode: "off", tab: "cap", slot: "cap", ink: "#f8fafc", price: 340, ru: "Кепка Abibas", en: "Abibas cap" },
    { id: "f1", mode: "off", tab: "flower", slot: "flower", flower: "🌼", price: 15, ru: "Ромашка", en: "Daisy" },
    { id: "f2", mode: "off", tab: "flower", slot: "flower", flower: "🌹", price: 40, ru: "Роза", en: "Rose" },
    { id: "f3", mode: "off", tab: "flower", slot: "flower", flower: "🌷", price: 35, ru: "Тюльпан", en: "Tulip" },
    { id: "f4", mode: "off", tab: "flower", slot: "flower", flower: "🌻", price: 50, ru: "Подсолнух", en: "Sunflower" },
    { id: "f5", mode: "off", tab: "flower", slot: "flower", flower: "🌸", price: 30, ru: "Сакура", en: "Cherry blossom" },
    { id: "f6", mode: "off", tab: "flower", slot: "flower", flower: "🪻", price: 45, ru: "Лаванда", en: "Lavender" },
    { id: "w1", mode: "off", tab: "watch", slot: "watch", price: 8, ru: "Кварц, стекло мутное", en: "Quartz, cloudy glass" },
    { id: "w2", mode: "off", tab: "watch", slot: "watch", price: 18, ru: "Кварц с рынка", en: "Market quartz" },
    { id: "w3", mode: "off", tab: "watch", slot: "watch", price: 35, ru: "Кварц на резинке", en: "Rubber quartz" },
    { id: "w4", mode: "off", tab: "watch", slot: "watch", price: 90, ru: "Кварц стальной", en: "Steel quartz" },
    { id: "w5", mode: "off", tab: "watch", slot: "watch", price: 240, ru: "Часы с браслетом", en: "Bracelet watch" },
    { id: "w6", mode: "off", tab: "watch", slot: "watch", price: 2400, ru: "Роликсы", en: "Roliks" },
    { id: "w7", mode: "off", tab: "watch", slot: "watch", price: 5200, ru: "Роликсы золото", en: "Gold Roliks" },
    { id: "d3", mode: "off", tab: "shoes", slot: "boots", ink: "#e7e5e4", sole: "#a8a29e", price: 22, ru: "Кеды двора", en: "Yard sneakers" },
    { id: "d2", mode: "off", tab: "shoes", slot: "boots", ink: "#78350f", sole: "#451a03", price: 40, ru: "Ботинки дешёвые", en: "Cheap boots" },
    { id: "d1", mode: "off", tab: "shoes", slot: "boots", ink: "#1c1917", sole: "#1c1917", price: 70, ru: "Туфли на пресс", en: "Press shoes" },
    { id: "d4", mode: "off", tab: "shoes", slot: "boots", ink: "#f8fafc", sole: "#e5e7eb", price: 95, ru: "Кеды белые", en: "White sneakers" },
    { id: "d5", mode: "off", tab: "shoes", slot: "boots", ink: "#1d4ed8", sole: "#1e3a8a", price: 160, ru: "Кроссовки беговые", en: "Running shoes" },
    { id: "d6", mode: "off", tab: "shoes", slot: "boots", ink: "#44403c", sole: "#292524", price: 240, ru: "Туфли кожа", en: "Leather shoes" },
    { id: "d7", mode: "off", tab: "shoes", slot: "boots", ink: "#7c2d12", sole: "#451a03", price: 380, ru: "Лоферы", en: "Loafers" },
    { id: "d8", mode: "off", tab: "shoes", slot: "boots", ink: "#111827", sole: "#facc15", price: 540, ru: "Кроссовки ночные", en: "Night sneakers" },
    { id: "d9", mode: "off", tab: "shoes", slot: "boots", ink: "#0f172a", sole: "#e2e8f0", price: 720, ru: "Туфли на лак", en: "Patent shoes" },
    { id: "b1", mode: "game", tab: "boots", slot: "boots", ink: "#6b5344", sole: "#3f2e22", price: 12, ru: "Дворовые, швы торчат", en: "Yard boots, seams out" },
    { id: "b8", mode: "game", tab: "boots", slot: "boots", ink: "#78716c", sole: "#44403c", price: 18, ru: "Шиповки детские", en: "Kids studs" },
    { id: "b2", mode: "game", tab: "boots", slot: "boots", ink: "#57534e", sole: "#a8a29e", price: 28, ru: "Рынок, подошва отходит", en: "Market, sole peeling" },
    { id: "b3", mode: "game", tab: "boots", slot: "boots", ink: "#44403c", sole: "#292524", price: 55, ru: "Спорттовары, жмут", en: "Sports shop, tight" },
    { id: "b7", mode: "game", tab: "boots", slot: "boots", ink: "#2563eb", sole: "#1e3a8a", price: 70, ru: "Футзалки", en: "Indoor shoes" },
    { id: "b4", mode: "game", tab: "boots", slot: "boots", ink: "#1e3a8a", sole: "#1e3a8a", price: 90, ru: "Тренировочные", en: "Training boots" },
    { id: "b9", mode: "game", tab: "boots", slot: "boots", ink: "#0f766e", sole: "#134e4a", price: 110, ru: "Без шипов", en: "No studs" },
    { id: "b10", mode: "game", tab: "boots", slot: "boots", ink: "#78350f", sole: "#451a03", price: 150, ru: "Шиповки кожа", en: "Leather studs" },
    { id: "b11", mode: "game", tab: "boots", slot: "boots", ink: "#1e40af", sole: "#1e3a8a", price: 210, ru: "Бутсы на липучке", en: "Strap boots" },
    { id: "b5", mode: "game", tab: "boots", slot: "boots", ink: "#111827", sole: "#facc15", price: 240, ru: "Матчевые", en: "Match boots" },
    { id: "b12", mode: "game", tab: "boots", slot: "boots", ink: "#0f172a", sole: "#38bdf8", price: 360, ru: "Бутсы с носком", en: "Sock boots" },
    { id: "b6", mode: "game", tab: "boots", slot: "boots", ink: "#0f172a", sole: "#e11d48", price: 480, ru: "Профессиональные", en: "Pro boots" },
    { id: "bp", mode: "game", tab: "boots", slot: "boots", ink: "#111111", sole: "#eab308", price: 700, ru: "Pumma", en: "Pumma" },
    { id: "bb", mode: "game", tab: "boots", slot: "boots", ink: "#1e293b", sole: "#94a3b8", price: 740, ru: "New Balanse", en: "New Balanse" },
    { id: "bn", mode: "game", tab: "boots", slot: "boots", ink: "#171717", sole: "#f5f5f5", price: 860, ru: "Nikke", en: "Nikke" },
    { id: "ba", mode: "game", tab: "boots", slot: "boots", ink: "#f8fafc", sole: "#111111", price: 920, ru: "Abibas", en: "Abibas" },
    { id: "bj", mode: "game", tab: "boots", slot: "boots", ink: "#111111", sole: "#dc2626", price: 980, ru: "Jordon", en: "Jordon" },
    { id: "bz", mode: "game", tab: "boots", slot: "boots", ink: "#111111", sole: "#facc15", price: 1800, ru: "Zibane Predator", en: "Zibane Predator" },
    { id: "bzg", mode: "game", tab: "boots", slot: "boots", ink: "#1c1917", sole: "#d4af37", price: 3400, ru: "Zibane Predator золото", en: "Zibane Predator gold" },
    { id: "k1", mode: "game", tab: "socks", slot: "socks", len: "short", ink: "#d6d3d1", price: 10, ru: "Короткие, дырявые", en: "Short, holey" },
    { id: "k3", mode: "game", tab: "socks", slot: "socks", len: "short", ink: "#f8fafc", price: 30, ru: "Короткие белые", en: "Short white" },
    { id: "kp", mode: "game", tab: "socks", slot: "socks", len: "short", ink: "#111111", price: 140, ru: "Короткие Pumma", en: "Short Pumma" },
    { id: "k4", mode: "game", tab: "socks", slot: "socks", len: "mid", ink: "#111827", price: 60, ru: "Средние чёрные", en: "Mid black" },
    { id: "k2", mode: "game", tab: "socks", slot: "socks", len: "mid", ink: "#1d4ed8", price: 80, ru: "Средние игровые", en: "Mid match" },
    { id: "kn", mode: "game", tab: "socks", slot: "socks", len: "mid", ink: "#171717", price: 240, ru: "Средние Nikke", en: "Mid Nikke" },
    { id: "kj", mode: "game", tab: "socks", slot: "socks", len: "mid", ink: "#7f1d1d", price: 260, ru: "Средние Jordon", en: "Mid Jordon" },
    { id: "k5", mode: "game", tab: "socks", slot: "socks", len: "long", ink: "#f8fafc", price: 70, ru: "Длинные белые", en: "Long white" },
    { id: "k6", mode: "game", tab: "socks", slot: "socks", len: "long", ink: "#b91c1c", price: 90, ru: "Длинные красные", en: "Long red" },
    { id: "kb", mode: "game", tab: "socks", slot: "socks", len: "long", ink: "#1e293b", price: 200, ru: "Длинные New Balanse", en: "Long New Balanse" },
    { id: "ka", mode: "game", tab: "socks", slot: "socks", len: "long", ink: "#f8fafc", price: 220, ru: "Длинные Abibas", en: "Long Abibas" },
    { id: "s4", mode: "game", tab: "shirt", slot: "shirt", ink: "#1d4ed8", price: 160, ru: "Тренировочная", en: "Training shirt" },
    { id: "s5", mode: "game", tab: "shirt", slot: "shirt", ink: "#b91c1c", stripe: "#f8fafc", price: 320, ru: "Игровая", en: "Match shirt" },
    { id: "s6", mode: "game", tab: "shirt", slot: "shirt", ink: "#ffffff", stripe: "#111111", price: 450, ru: "Полосатая", en: "Striped" },
    { id: "sl3", mode: "game", tab: "shirt", slot: "shirt", sleeve: "long", ink: "#0f172a", price: 150, ru: "Длинный рукав, на холод", en: "Long sleeve, cold" },
    { id: "sl1", mode: "game", tab: "shirt", slot: "shirt", sleeve: "long", ink: "#1e3a8a", price: 200, ru: "Длинный рукав, тренировка", en: "Long sleeve, training" },
    { id: "sl2", mode: "game", tab: "shirt", slot: "shirt", sleeve: "long", ink: "#991b1b", stripe: "#f8fafc", price: 380, ru: "Длинный рукав, матч", en: "Long sleeve, match" },
    { id: "sp", mode: "game", tab: "shirt", slot: "shirt", ink: "#111111", stripe: "#eab308", mark: "Pumma", price: 460, ru: "Футболка Pumma", en: "Pumma tee" },
    { id: "sb", mode: "game", tab: "shirt", slot: "shirt", ink: "#1e3a5f", stripe: "#cbd5e1", mark: "New Balanse", price: 490, ru: "Футболка New Balanse", en: "New Balanse tee" },
    { id: "sn", mode: "game", tab: "shirt", slot: "shirt", ink: "#0a0a0a", stripe: "#fafafa", price: 540, mark: "Nikke", ru: "Футболка Nikke", en: "Nikke tee" },
    { id: "sa", mode: "game", tab: "shirt", slot: "shirt", ink: "#ffffff", stripe: "#111111", price: 580, mark: "Abibas", ru: "Футболка Abibas", en: "Abibas tee" },
    { id: "sj", mode: "game", tab: "shirt", slot: "shirt", ink: "#111111", stripe: "#dc2626", price: 640, mark: "Jordon", ru: "Футболка Jordon", en: "Jordon tee" },
    { id: "q1", mode: "game", tab: "gear", slot: "shorts", price: 12, ru: "Шорты, резинка слабая", en: "Shorts, weak elastic" },
    { id: "q2", mode: "game", tab: "gear", slot: "shorts", price: 40, ru: "Шорты белые", en: "White shorts" },
    { id: "q3", mode: "game", tab: "gear", slot: "shorts", price: 40, ru: "Шорты чёрные", en: "Black shorts" },
    { id: "qb", mode: "game", tab: "gear", slot: "shorts", price: 190, ru: "Шорты New Balanse", en: "New Balanse shorts" },
    { id: "qp", mode: "game", tab: "gear", slot: "shorts", price: 210, ru: "Шорты Pumma", en: "Pumma shorts" },
    { id: "qn", mode: "game", tab: "gear", slot: "shorts", price: 250, ru: "Шорты Nikke", en: "Nikke shorts" },
    { id: "g1", mode: "game", tab: "gear", slot: "gloves", price: 18, ru: "Перчатки, пальцы мокрые", en: "Wet-finger gloves" },
    { id: "gp", mode: "game", tab: "gear", slot: "gloves", price: 210, ru: "Перчатки Pumma", en: "Pumma gloves" },
    { id: "gn", mode: "game", tab: "gear", slot: "gloves", price: 260, ru: "Перчатки Nikke", en: "Nikke gloves" },
    { id: "sh1", mode: "game", tab: "gear", slot: "shin", price: 15, ru: "Щитки картонные", en: "Cardboard shin pads" },
    { id: "sh2", mode: "game", tab: "gear", slot: "shin", price: 80, ru: "Щитки игровые", en: "Match shin pads" },
    { id: "tp1", mode: "game", tab: "gear", slot: "tape", price: 8, ru: "Тейп на щиколотку", en: "Ankle tape" },
    { id: "u1", mode: "game", tab: "gear", slot: "base", price: 25, ru: "Нательная", en: "Base layer" },
    { id: "a1", mode: "game", tab: "gear", slot: "arm", price: 40, ru: "Капитанская повязка", en: "Captain armband" }
];

const SHOP_TABS = {
    off: ["hair", "cloth", "cap", "flower", "jacket", "watch", "shoes"],
    game: ["boots", "socks", "shirt", "gear"]
};

let shopMode = "off";
let shopFilter = "hair";

function shopById(id) {
    for (let i = 0; i < SHOP.length; i++) if (SHOP[i].id === id) return SHOP[i];
    return null;
}

function ensureWear() {
    if (!player.closet) player.closet = [];
    if (!player.wear || typeof player.wear !== "object") player.wear = {};
}

function shopLabel(item) {
    return document.documentElement.lang === "en" ? item.en : item.ru;
}

function wearLook() {
    if (!player || !player.wear) return null;
    const look = {};
    const hair = shopById(player.wear.hair);
    const shirt = shopById(player.wear.shirt);
    const boots = shopById(player.wear.boots);
    const cap = shopById(player.wear.cap);
    if (hair) {
        look.hairStyle = hair.style;
        if (hair.ink) look.hairInk = hair.ink;
    }
    const socks = shopById(player.wear.socks);
    if (shirt) {
        look.shirtInk = shirt.ink;
        if (shirt.stripe) look.stripeInk = shirt.stripe;
        if (shirt.sleeve) look.sleeve = shirt.sleeve;
        if (shirt.mark) look.mark = shirt.mark;
    }
    if (boots) {
        look.bootInk = boots.ink;
        look.soleInk = boots.sole || boots.ink;
    }
    if (cap) look.capInk = cap.ink;
    const flower = shopById(player.wear.flower);
    if (flower && flower.flower) look.flower = flower.flower;
    if (socks && socks.ink) {
        look.sockInk = socks.ink;
        look.sockLen = socks.len || "mid";
    }
    if (shopById(player.wear.shin)) look.shin = true;
    return look;
}

function paintShop() {
    const list = get("shopList");
    if (!list || !player || !player.name) return;
    ensureWear();
    const worn = [];
    ["hair", "shirt", "cap", "flower", "jacket", "watch", "boots", "socks", "shorts", "gloves", "shin", "tape", "base", "arm"].forEach(function (slot) {
        const item = shopById(player.wear[slot]);
        if (item) worn.push(shopLabel(item));
    });
    const wornEl = get("shopWorn");
    if (wornEl) wornEl.textContent = worn.length ? t("shopWorn", { n: worn.join(" · ") }) : t("shopNone");
    const modes = get("shopMode");
    if (modes) {
        modes.querySelectorAll("button").forEach(function (btn) {
            const key = btn.getAttribute("data-mode");
            btn.classList.toggle("on", key === shopMode);
            btn.textContent = t(key === "game" ? "shopGame" : "shopOffMode");
        });
    }
    const tabs = get("shopTabs");
    const tabKeys = SHOP_TABS[shopMode] || SHOP_TABS.off;
    if (tabKeys.indexOf(shopFilter) < 0) shopFilter = tabKeys[0];
    if (tabs) {
        const labels = {
            hair: t("shopHair"), cloth: t("shopCloth"), cap: t("shopCap"), flower: t("shopFlower"), jacket: t("shopJacket"), watch: t("shopWatch"), shoes: t("shopShoes"),
            boots: t("shopBoots"), socks: t("shopSocks"), shirt: t("shopShirts"), gear: t("shopGear")
        };
        tabs.innerHTML = tabKeys.map(function (key) {
            return '<button type="button" data-shop="' + key + '"' + (key === shopFilter ? ' class="on"' : "") + ">" + (labels[key] || key) + "</button>";
        }).join("");
    }
    const rows = SHOP.filter(function (item) {
        return item.mode === shopMode && item.tab === shopFilter;
    });
    list.innerHTML = rows.map(function (item) {
        const owned = player.closet.indexOf(item.id) >= 0;
        const on = player.wear[item.slot] === item.id;
        const label = on ? t("shopOff") : (owned ? t("shopOn") : t("shopBuy", { pay: money(item.price) }));
        return '<div class="shop-row"><span>' + shopLabel(item) + '</span><button type="button" data-buy="' + item.id + '">' + label + '</button></div>';
    }).join("");
    paintSkin();
}

function buyWear(id) {
    const item = shopById(id);
    if (!item || !player || !player.name) return;
    ensureWear();
    const owned = player.closet.indexOf(id) >= 0;
    if (owned && player.wear[item.slot] === id) {
        player.wear[item.slot] = "";
        Sfx.click();
        paintShop();
        updateHeader();
        renderSocial();
        save();
        return;
    }
    if (!owned) {
        if (tillShort(item.price)) {
            Sfx.error();
            addLog(t("shopNeed", { pay: money(item.price) }));
            return;
        }
        chargeAsk(homeClubName(), "kit", item.price, function (ok) {
            if (!ok) return;
            if (player.closet.indexOf(id) < 0) player.closet.push(id);
            player.wear[item.slot] = id;
            addLog(t("shopGot", { name: shopLabel(item) }));
            Sfx.ding();
            paintShop();
            updateHeader();
            renderSocial();
            save();
        }, { id: "kit", name: shopLabel(item) });
        return;
    }
    player.wear[item.slot] = id;
    paintShop();
    updateHeader();
    renderSocial();
    save();
}

const KIT_COLORS = ["#163a5f", "#b91c1c", "#14532d", "#f8fafc", "#111827", "#facc15", "#7c3aed", "#0f766e", "#ea580c", "#1d4ed8"];
const KIT_ADS = [
    { id: "", ru: "Без рекламы", en: "No sponsor" },
    { id: "pmw", ru: "PMW", en: "PMW" },
    { id: "pupik", ru: "Pupik", en: "Pupik" },
    { id: "jordon", ru: "Jordon", en: "Jordon" },
    { id: "nikke", ru: "Nikke", en: "Nikke" },
    { id: "balanse", ru: "New Balanse", en: "New Balanse" },
    { id: "pumma", ru: "Pumma", en: "Pumma" },
    { id: "abibas", ru: "Abibas", en: "Abibas" },
    { id: "chai", ru: "ЧайДвор", en: "YardTea" },
    { id: "neft", ru: "Нефть+", en: "Neft+" }
];

function kitPickName(list, id) {
    for (let i = 0; i < list.length; i++) {
        if (list[i].id === id) return document.documentElement.lang === "en" ? list[i].en : list[i].ru;
    }
    return "";
}

function ensureKit() {
    if (!player.kit || typeof player.kit !== "object") {
        player.kit = { shirt: "#163a5f", shorts: "#f8fafc", socks: "#163a5f", trim: "#d4af37", ad: "", stick: "" };
    }
}

function inkOn(hex) {
    const n = parseInt(String(hex || "#000").slice(1), 16);
    if (!n && n !== 0) return "#f8fafc";
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    return (r * 299 + g * 587 + b * 114) > 150000 ? "#111111" : "#f8fafc";
}

function svgText(s) {
    return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

const SKIN_TONES = ["#f6d7c3", "#e7b48a", "#c68642", "#8d5524", "#5c3317", "#3b2212"];

function kitSvg(kit) {
    kit = kit || {};
    const shirt = kit.shirt || "#163a5f";
    const shorts = kit.shorts || "#f8fafc";
    const socks = kit.socks || shirt;
    const ink = inkOn(shirt);
    const label = kit.ad ? svgText(kitPickName(KIT_ADS, kit.ad)) : "";
    const size = label.length > 11 ? 6 : label.length > 8 ? 7 : 9;
    const sponsor = label
        ? '<text x="50" y="84" text-anchor="middle" font-size="' + size + '" font-family="sans-serif" font-weight="800" fill="' + ink + '"' + (label.length > 8 ? ' textLength="28" lengthAdjust="spacingAndGlyphs"' : "") + ">" + label + "</text>"
        : "";
    return '<svg viewBox="0 0 100 168" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
        + '<rect width="100" height="168" fill="#0c1018"/>'
        + '<path d="M34 52 L16 72 L24 80 L40 62z" fill="' + shirt + '"/>'
        + '<path d="M66 52 L84 72 L76 80 L60 62z" fill="' + shirt + '"/>'
        + '<path d="M36 50h28l6 52H30z" fill="' + shirt + '"/>'
        + sponsor
        + '<path d="M30 102h16l-2 18H32z" fill="' + shorts + '"/>'
        + '<path d="M54 102h16l-2 18H56z" fill="' + shorts + '"/>'
        + '<rect x="34" y="120" width="10" height="22" rx="3" fill="' + socks + '"/>'
        + '<rect x="56" y="120" width="10" height="22" rx="3" fill="' + socks + '"/>'
        + "</svg>";
}

function paintSkin() {
    const html = SKIN_TONES.map(function (color) {
        const on = skinInk() === color ? " on" : "";
        return '<button type="button" class="kit-swatch' + on + '" data-skin="' + color + '" style="background:' + color + '"></button>';
    }).join("");
    const shop = get("skinPicks");
    if (shop) shop.innerHTML = html;
    const kit = get("kitSkin");
    if (kit) {
        kit.innerHTML = SKIN_TONES.map(function (color) {
            const on = skinInk() === color ? " on" : "";
            return '<button type="button" class="kit-swatch' + on + '" data-kit="skin" data-ink="' + color + '" style="background:' + color + '"></button>';
        }).join("");
    }
}

function setSkin(color) {
    if (!player || !player.name || SKIN_TONES.indexOf(color) < 0 || player.skin === color) return;
    player.skin = color;
    Sfx.click();
    paintSkin();
    if (isClub()) paintKit();
    updateHeader();
    renderSocial();
    save();
}

function paintKit() {
    const card = get("kitCard");
    if (!card || !player || !player.name) return;
    card.hidden = !isClub() || !!player.coach;
    if (card.hidden) return;
    ensureKit();
    const preview = get("kitPreview");
    if (preview) preview.innerHTML = '<div class="kit-figure">' + kitSvg(player.kit) + "</div>";
    const line = get("kitLine");
    if (line) {
        line.textContent = player.kit.ad ? kitPickName(KIT_ADS, player.kit.ad) : "";
    }
    paintSkin();
    [["kitShirt", "shirt"], ["kitShorts", "shorts"], ["kitSocks", "socks"]].forEach(function (pair) {
        const box = get(pair[0]);
        if (!box) return;
        box.innerHTML = KIT_COLORS.map(function (color) {
            const on = player.kit[pair[1]] === color ? " on" : "";
            return '<button type="button" class="kit-swatch' + on + '" data-kit="' + pair[1] + '" data-ink="' + color + '" style="background:' + color + '"></button>';
        }).join("");
    });
    const ads = get("kitAds");
    if (ads) {
        ads.innerHTML = KIT_ADS.map(function (row) {
            const on = (player.kit.ad || "") === row.id ? " on" : "";
            return '<button type="button" class="' + on + '" data-kit="ad" data-ink="' + row.id + '">' + kitPickName(KIT_ADS, row.id) + "</button>";
        }).join("");
    }
}

function setKit(part, value) {
    if (!player || !player.name || !isClub() || player.coach) return;
    ensureKit();
    if (part === "skin") {
        setSkin(value);
        return;
    }
    if (player.kit[part] === value) return;
    let cost = 0;
    if (part === "ad" && value) cost = 60;
    if ((player.respect || 0) < cost) {
        Sfx.error();
        addLog(t("kitNeed", { pay: money(cost) }));
        return;
    }
    if (cost) {
        player.respect -= cost;
        updateRespect();
        addLog(t("kitSet", { pay: money(cost) }));
        Sfx.ding();
    } else Sfx.click();
    player.kit[part] = value;
    paintKit();
    updateHeader();
    save();
}

function takeKitAd(result) {
    if (!isClub() || player.coach || !player.kit || !player.kit.ad) return 0;
    const rep = fameValue();
    const base = 10 + Math.round((rep / 99) * 90);
    const mul = result === "win" ? 1 : result === "draw" ? 0.6 : 0.35;
    const pay = Math.max(1, Math.round(base * mul));
    player.respect = (player.respect || 0) + pay;
    return pay;
}

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
    { id: "kislyak", name: "Кисляк", en: "Kislyak", pos: "CM", ovr: 73, club: "ЦСКА", flag: "🇷🇺", tier: "rpl" },
    { id: "zabolotny", name: "Заболотный", en: "Zabolotny", pos: "ST", ovr: 74, club: "ЦСКА", flag: "🇷🇺", tier: "rpl" },
    { id: "kuchaev", name: "Кучаев", en: "Kuchaev", pos: "RW", ovr: 75, club: "ЦСКА", flag: "🇷🇺", tier: "rpl" },
    { id: "gajic", name: "Гайич", en: "Gajic", pos: "RB", ovr: 75, club: "ЦСКА", flag: "🇷🇸", tier: "rpl" },
    { id: "karavaev", name: "Караваев", en: "Karavaev", pos: "RB", ovr: 76, club: "Зенит", flag: "🇷🇺", tier: "rpl" },
    { id: "smolnikov", name: "Смольников", en: "Smolnikov", pos: "RB", ovr: 77, club: "Краснодар", flag: "🇷🇺", tier: "rpl" },
    { id: "mfernandes", name: "М. Фернандес", en: "M. Fernandes", pos: "RB", ovr: 81, club: "ЦСКА", flag: "🇷🇺", tier: "rpl" },
    { id: "krag", name: "Краг", en: "Kragh", pos: "CB", ovr: 75, club: "ЦСКА", flag: "🇩🇰", tier: "rpl" },
    { id: "fayzullaev", name: "Файзуллаев", en: "Fayzullaev", pos: "LW", ovr: 76, club: "ЦСКА", flag: "🇺🇿", tier: "rpl" },
    { id: "rocha", name: "Роша", en: "Rocha", pos: "CB", ovr: 76, club: "ЦСКА", flag: "🇧🇷", tier: "rpl" },
    { id: "diveev", name: "Дивеев", en: "Diveev", pos: "CB", ovr: 76, club: "ЦСКА", flag: "🇷🇺", tier: "rpl" },
    { id: "moises", name: "Мойзес", en: "Moises", pos: "CDM", ovr: 77, club: "ЦСКА", flag: "🇧🇷", tier: "rpl" },
    { id: "chalov", name: "Чалов", en: "Chalov", pos: "ST", ovr: 77, club: "ЦСКА", flag: "🇷🇺", tier: "rpl" },
    { id: "oblyakov", name: "Обляков", en: "Oblyakov", pos: "CM", ovr: 78, club: "ЦСКА", flag: "🇷🇺", tier: "rpl" },
    { id: "akinfeev", name: "Акинфеев", en: "Akinfeev", pos: "GK", ovr: 84, club: "ЦСКА", flag: "🇷🇺", tier: "rpl" },
    { id: "glebov", name: "Глебов", en: "Glebov", pos: "CM", ovr: 76, club: "Ростов", flag: "🇷🇺", tier: "rpl" },
    { id: "osipenko", name: "Осипенко", en: "Osipenko", pos: "CB", ovr: 77, club: "Ростов", flag: "🇷🇺", tier: "rpl" },
    { id: "jikia", name: "Джикия", en: "Dzhikiya", pos: "CB", ovr: 77, club: "Спартак", flag: "🇬🇪", tier: "rpl" },
    { id: "makarov", name: "Макаров", en: "Makarov", pos: "RW", ovr: 77, club: "Динамо", flag: "🇷🇺", tier: "rpl" },
    { id: "batxi", name: "Батчи", en: "Batchi", pos: "RW", ovr: 77, club: "Краснодар", flag: "🇪🇸", tier: "rpl" },
    { id: "fomin", name: "Фомин", en: "Fomin", pos: "CM", ovr: 78, club: "Динамо", flag: "🇷🇺", tier: "rpl" },
    { id: "alonso", name: "Алонсо", en: "Alonso", pos: "CB", ovr: 78, club: "Краснодар", flag: "🇪🇸", tier: "rpl" },
    { id: "mostovoy", name: "Мостовой", en: "Mostovoy", pos: "LW", ovr: 78, club: "Зенит", flag: "🇷🇺", tier: "rpl" },
    { id: "sobolev", name: "Соболев", en: "Sobolev", pos: "ST", ovr: 78, club: "Спартак", flag: "🇷🇺", tier: "rpl" },
    { id: "cordoba", name: "Кордоба", en: "Cordoba", pos: "ST", ovr: 79, club: "Краснодар", flag: "🇨🇴", tier: "rpl" },
    { id: "tyukavin", name: "Тюкавин", en: "Tyukavin", pos: "ST", ovr: 79, club: "Динамо", flag: "🇷🇺", tier: "rpl" },
    { id: "dzyuba", name: "Дзюба", en: "Dzyuba", pos: "ST", ovr: 79, club: "Локомотив", flag: "🇷🇺", tier: "rpl" },
    { id: "spertsyan", name: "Сперцян", en: "Spertsyan", pos: "CAM", ovr: 80, club: "Краснодар", flag: "🇦🇲", tier: "rpl" },
    { id: "cassierra", name: "Кассьерра", en: "Cassierra", pos: "ST", ovr: 80, club: "Зенит", flag: "🇨🇴", tier: "rpl" },
    { id: "douglas", name: "Дуглас Сантос", en: "Douglas Santos", pos: "LB", ovr: 80, club: "Зенит", flag: "🇧🇷", tier: "rpl" },
    { id: "miranchuk", name: "Миранчук", en: "Miranchuk", pos: "CAM", ovr: 81, club: "Аталанта", flag: "🇷🇺", tier: "eu" },
    { id: "wendel", name: "Вендел", en: "Wendel", pos: "CM", ovr: 81, club: "Зенит", flag: "🇧🇷", tier: "rpl" },
    { id: "promes", name: "Промес", en: "Promes", pos: "RW", ovr: 82, club: "Спартак", flag: "🇳🇱", tier: "rpl" },
    { id: "barrios", name: "Барриос", en: "Barrios", pos: "CDM", ovr: 82, club: "Зенит", flag: "🇨🇴", tier: "rpl" },
    { id: "claudinho", name: "Клаудинйо", en: "Claudinho", pos: "CAM", ovr: 82, club: "Al-Sadd", flag: "🇧🇷", tier: "eu" },
    { id: "malcom", name: "Малком", en: "Malcom", pos: "LW", ovr: 83, club: "Al-Hilal", flag: "🇧🇷", tier: "eu" },
    { id: "frimpong", name: "Фримпонг", en: "Frimpong", pos: "RB", ovr: 84, club: "Liverpool", flag: "🇳🇱", tier: "eu" },
    { id: "walker", name: "Уокер", en: "Walker", pos: "RB", ovr: 84, club: "AC Milan", flag: "🇬🇧", tier: "eu" },
    { id: "osimhen", name: "Осимхен", en: "Osimhen", pos: "ST", ovr: 85, club: "Галатасарай", flag: "🇳🇬", tier: "eu" },
    { id: "kvara", name: "Кварацхелия", en: "Kvaratskhelia", pos: "LW", ovr: 86, club: "PSG", flag: "🇬🇪", tier: "eu" },
    { id: "barella", name: "Барелла", en: "Barella", pos: "CM", ovr: 86, club: "Интер", flag: "🇮🇹", tier: "eu" },
    { id: "rodri", name: "Родри", en: "Rodri", pos: "CDM", ovr: 90, club: "City", flag: "🇪🇸", tier: "eu" },
    { id: "lewandowski", name: "Левандовски", en: "Lewandowski", pos: "ST", ovr: 88, club: "Barcelona", flag: "🇵🇱", tier: "eu" },
    { id: "kane", name: "Кейн", en: "Kane", pos: "ST", ovr: 89, club: "Bayern", flag: "🇬🇧", tier: "eu" },
    { id: "debruyne", name: "Де Брёйне", en: "De Bruyne", pos: "CAM", ovr: 89, club: "Наполи", flag: "🇧🇪", tier: "eu" },
    { id: "salah", name: "Салах", en: "Salah", pos: "RW", ovr: 89, club: "Liverpool", flag: "🇪🇬", tier: "eu" },
    { id: "vandijk", name: "Ван Дейк", en: "Van Dijk", pos: "CB", ovr: 89, club: "Liverpool", flag: "🇳🇱", tier: "eu" },
    { id: "trent", name: "Трент", en: "Trent", pos: "RB", ovr: 86, club: "Real Madrid", flag: "🇬🇧", tier: "eu" },
    { id: "diaz", name: "Луис Диас", en: "Luis Diaz", pos: "LW", ovr: 86, club: "Bayern", flag: "🇨🇴", tier: "eu" },
    { id: "alisson", name: "Алиссон", en: "Alisson", pos: "GK", ovr: 89, club: "Liverpool", flag: "🇧🇷", tier: "eu" },
    { id: "hakimi", name: "Хакими", en: "Hakimi", pos: "RB", ovr: 86, club: "PSG", flag: "🇲🇦", tier: "eu" },
    { id: "makelele", name: "Макелеле", en: "Makelele", pos: "CDM", ovr: 89, club: "Real Madrid", flag: "🇫🇷", tier: "leg", ended: true },
    { id: "carlos", name: "Р. Карлос", en: "R. Carlos", pos: "LB", ovr: 90, club: "Real Madrid", flag: "🇧🇷", tier: "leg", ended: true },
    { id: "marcelo", name: "Марсело", en: "Marcelo", pos: "LB", ovr: 90, club: "Real Madrid", flag: "🇧🇷", tier: "leg", ended: true },
    { id: "hierro", name: "Йерро", en: "Hierro", pos: "CB", ovr: 90, club: "Real Madrid", flag: "🇪🇸", tier: "leg", ended: true },
    { id: "redondo", name: "Редондо", en: "Redondo", pos: "CM", ovr: 90, club: "Real Madrid", flag: "🇦🇷", tier: "leg", ended: true },
    { id: "bale", name: "Бэйл", en: "Bale", pos: "RW", ovr: 90, club: "Real Madrid", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", tier: "leg", ended: true },
    { id: "cafu", name: "Кафу", en: "Cafu", pos: "RB", ovr: 91, club: "Milan", flag: "🇧🇷", tier: "leg" },
    { id: "zanetti", name: "Санетти", en: "Zanetti", pos: "RB", ovr: 90, club: "Inter", flag: "🇦🇷", tier: "leg" },
    { id: "casillas", name: "Касильяс", en: "Casillas", pos: "GK", ovr: 91, club: "Real Madrid", flag: "🇪🇸", tier: "leg", ended: true },
    { id: "raul", name: "Рауль", en: "Raul", pos: "ST", ovr: 91, club: "Real Madrid", flag: "🇪🇸", tier: "leg", ended: true },
    { id: "kroos", name: "Кроос", en: "Kroos", pos: "CM", ovr: 91, club: "Real Madrid", flag: "🇩🇪", tier: "leg", ended: true },
    { id: "figo", name: "Фигу", en: "Figo", pos: "RW", ovr: 91, club: "Real Madrid", flag: "🇵🇹", tier: "leg", ended: true },
    { id: "haaland", name: "Холанд", en: "Haaland", pos: "ST", ovr: 91, club: "City", flag: "🇳🇴", tier: "eu" },
    { id: "ramos", name: "Рамос", en: "Ramos", pos: "CB", ovr: 92, club: "Real Madrid", flag: "🇪🇸", tier: "leg", ended: true },
    { id: "benzema", name: "Бензема", en: "Benzema", pos: "ST", ovr: 92, club: "Real Madrid", flag: "🇫🇷", tier: "leg", ended: true },
    { id: "puskas", name: "Пушкаш", en: "Puskas", pos: "ST", ovr: 93, club: "Real Madrid", flag: "🇭🇺", tier: "leg", ended: true, dead: true },
    { id: "zidane", name: "Зидан", en: "Zidane", pos: "CAM", ovr: 94, club: "Real Madrid", flag: "🇫🇷", tier: "leg", ended: true },
    { id: "distefano", name: "Ди Стефано", en: "Di Stefano", pos: "ST", ovr: 94, club: "Real Madrid", flag: "🇦🇷", tier: "leg", ended: true, dead: true },
    { id: "gento", name: "Хенто", en: "Gento", pos: "LW", ovr: 91, club: "Real Madrid", flag: "🇪🇸", tier: "leg", ended: true, dead: true },
    { id: "santamaria", name: "Сантамария", en: "Santamaria", pos: "CB", ovr: 90, club: "Real Madrid", flag: "🇺🇾", tier: "leg", ended: true, dead: true },
    { id: "kopa", name: "Копа", en: "Kopa", pos: "CAM", ovr: 90, club: "Real Madrid", flag: "🇫🇷", tier: "leg", ended: true, dead: true },
    { id: "amancio", name: "Амансио", en: "Amancio", pos: "RW", ovr: 89, club: "Real Madrid", flag: "🇪🇸", tier: "leg", ended: true, dead: true },
    { id: "juanito", name: "Хуанито", en: "Juanito", pos: "RW", ovr: 88, club: "Real Madrid", flag: "🇪🇸", tier: "leg", ended: true, dead: true },
    { id: "cr7", name: "Криштиану Роналду", en: "Cristiano Ronaldo", pos: "ST", ovr: 99, club: "Al-Nassr", flag: "🇵🇹", tier: "eu", active: true },
    { id: "felix", name: "Жоау Феликс", en: "João Félix", pos: "CAM", ovr: 85, club: "Al-Nassr", flag: "🇵🇹", tier: "eu", active: true },
    { id: "messi", name: "Лионель Месси", en: "Lionel Messi", pos: "RW", ovr: 98, club: "Inter Miami", flag: "🇦🇷", tier: "eu", active: true },
    { id: "u19-khusanov", name: "Хусанов", en: "Khusanov", pos: "CB", ovr: 74, club: "Узбекистан U19", flag: "🇺🇿", tier: "rook", youth: "u19" },
    { id: "u19-alijonov", name: "Алижонов", en: "Alijonov", pos: "LB", ovr: 68, club: "Узбекистан U19", flag: "🇺🇿", tier: "rook", youth: "u19" },
    { id: "u19-urunov", name: "Урунов", en: "Urunov", pos: "CAM", ovr: 70, club: "Узбекистан U19", flag: "🇺🇿", tier: "rook", youth: "u19" },
    { id: "u19-nasrullaev", name: "Насруллаев", en: "Nasrullaev", pos: "RW", ovr: 67, club: "Узбекистан U19", flag: "🇺🇿", tier: "rook", youth: "u19" },
    { id: "u19-shukurov", name: "Шукуров", en: "Shukurov", pos: "CDM", ovr: 66, club: "Узбекистан U19", flag: "🇺🇿", tier: "rook", youth: "u19" },
    { id: "u17-yuldoshev", name: "Юлдашев", en: "Yuldoshev", pos: "ST", ovr: 60, club: "Узбекистан U17", flag: "🇺🇿", tier: "rook", youth: "u17" },
    { id: "u17-rakhimov", name: "Рахимов", en: "Rakhimov", pos: "GK", ovr: 57, club: "Узбекистан U17", flag: "🇺🇿", tier: "rook", youth: "u17" },
    { id: "u17-alimov", name: "Алимов", en: "Alimov", pos: "CB", ovr: 59, club: "Узбекистан U17", flag: "🇺🇿", tier: "rook", youth: "u17" },
    { id: "u17-toshev", name: "Тошев", en: "Toshev", pos: "LW", ovr: 61, club: "Узбекистан U17", flag: "🇺🇿", tier: "rook", youth: "u17" },
    { id: "u17-juraev", name: "Жураев", en: "Juraev", pos: "CM", ovr: 58, club: "Узбекистан U17", flag: "🇺🇿", tier: "rook", youth: "u17" },
    { id: "u19-cubarsi", name: "Кубарси", en: "Cubarsí", pos: "CB", ovr: 74, club: "Испания U19", flag: "🇪🇸", tier: "rook", youth: "u19" },
    { id: "u19-turrientes", name: "Турриентес", en: "Turrientes", pos: "CM", ovr: 70, club: "Испания U19", flag: "🇪🇸", tier: "rook", youth: "u19" },
    { id: "u19-barrios", name: "Барриос", en: "Barrios", pos: "CM", ovr: 71, club: "Испания U19", flag: "🇪🇸", tier: "rook", youth: "u19" },
    { id: "u19-gasiorowski", name: "Гасиоровски", en: "Gąsiorowski", pos: "CB", ovr: 69, club: "Испания U19", flag: "🇪🇸", tier: "rook", youth: "u19" },
    { id: "u19-fort", name: "Форт", en: "Fort", pos: "LW", ovr: 68, club: "Испания U19", flag: "🇪🇸", tier: "rook", youth: "u19" },
    { id: "u19-guiu", name: "Гиу", en: "Guiu", pos: "ST", ovr: 67, club: "Испания U19", flag: "🇪🇸", tier: "rook", youth: "u19" },
    { id: "u17-dro", name: "Дро Фернандес", en: "Dro Fernández", pos: "RW", ovr: 63, club: "Испания U17", flag: "🇪🇸", tier: "rook", youth: "u17" },
    { id: "u17-cuenca", name: "Андрес Куэнка", en: "Andrés Cuenca", pos: "LB", ovr: 61, club: "Испания U17", flag: "🇪🇸", tier: "rook", youth: "u17" },
    { id: "u17-guille", name: "Гилье Фернандес", en: "Guille Fernández", pos: "CM", ovr: 60, club: "Испания U17", flag: "🇪🇸", tier: "rook", youth: "u17" },
    { id: "u17-junyent", name: "Ким Жуньент", en: "Quim Junyent", pos: "CB", ovr: 59, club: "Испания U17", flag: "🇪🇸", tier: "rook", youth: "u17" },
    { id: "u17-prim", name: "Пау Прим", en: "Pau Prim", pos: "CDM", ovr: 58, club: "Испания U17", flag: "🇪🇸", tier: "rook", youth: "u17" },
    { id: "u17-ronaldojr", name: "Роналду Джр", en: "Ronaldo Jr", pos: "ST", ovr: 64, club: "Португалия U17", flag: "🇵🇹", tier: "rook", youth: "u17" }
];

const SEASON_XI = {
    "Real Madrid": [
        { id: "s26-courtois", name: "Куртуа", en: "Courtois", pos: "GK", ovr: 89, flag: "🇧🇪", season: "2026/27" },
        { id: "trent", name: "Трент", en: "Trent", pos: "RB", ovr: 86, flag: "🇬🇧", season: "2026/27" },
        { id: "s26-huijsen", name: "Хёйсен", en: "Huijsen", pos: "CB", ovr: 83, flag: "🇪🇸", season: "2026/27" },
        { id: "s26-tchouameni", name: "Чуамени", en: "Tchouameni", pos: "CDM", ovr: 86, flag: "🇫🇷", season: "2026/27" },
        { id: "s26-valverde", name: "Вальверде", en: "Valverde", pos: "CM", ovr: 88, flag: "🇺🇾", season: "2026/27" },
        { id: "s26-guler", name: "Арда Гюлер", en: "Arda Guler", pos: "CAM", ovr: 86, flag: "🇹🇷", season: "2026/27" },
        { id: "s26-vinicius", name: "Винисиус", en: "Vinicius", pos: "LW", ovr: 90, flag: "🇧🇷", season: "2026/27" },
        { id: "s26-bellingham", name: "Беллингем", en: "Bellingham", pos: "CM", ovr: 89, flag: "🇬🇧", season: "2026/27" },
        { id: "s26-diomande", name: "Диаманде", en: "Diomande", pos: "RW", ovr: 86, flag: "🇨🇮", season: "2026/27" },
        { id: "s26-mbappe", name: "Мбаппе", en: "Mbappe", pos: "ST", ovr: 91, flag: "🇫🇷", season: "2026/27" }
    ],
    "Liverpool": [
        { id: "s26-konate", name: "Конате", en: "Konate", pos: "CB", ovr: 87, flag: "🇫🇷", season: "2026/27" }
    ],
    "Интер": [
        { id: "s26-dumfries", name: "Думфрис", en: "Dumfries", pos: "RB", ovr: 84, flag: "🇳🇱", season: "2026/27" }
    ],
    "Chelsea": [
        { id: "s26-cucurella", name: "Кукурелья", en: "Cucurella", pos: "LB", ovr: 84, flag: "🇪🇸", season: "2026/27" }
    ]
};

let player = newPlayer("");
let selectedMode = "player";
let selectedNation = "KZ";
let selectedAvatar = "⚽";
let selectedSkin = "#e7b48a";
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
let matchPlan = "balance";

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
        skin: "#e7b48a",
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
        streak: 0,
        injury: null,
        brands: [],
        sponsors: [],
        ntCalled: false,
        ntCaps: 0,
        wcCycle: -1,
        wcWins: 0,
        awards: [],
        titles: [],
        ballonYear: 0,
        bank: 0,
        loan: 0,
        bankPlan: "",
        loanPlan: "",
        bankUntil: 0,
        matchPlan: "balance",
        draftTokens: 0,
        draftRun: null,
        exclusives: [],
        draftMark: "",
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
        streak: 0,
        injury: null,
        brands: [],
        sponsors: [],
        bank: 0,
        loan: 0,
        bankPlan: "",
        loanPlan: "",
        bankUntil: 0,
        matchPlan: "balance",
        draftTokens: 0,
        draftRun: null,
        exclusives: [],
        draftMark: "",
        stats: {
            pace: 55,
            shooting: 56,
            passing: 55,
            dribbling: 54,
            defending: 55,
            physical: 56,
            stamina: 56,
            vision: 54,
            setpieces: 52
        }
    };
}

const START_XI = [
    { id: "xi-gk", name: "Арсен", en: "Arsen", pos: "GK", ovr: 58 },
    { id: "xi-lb", name: "Бекзат", en: "Bekzat", pos: "LB", ovr: 57 },
    { id: "xi-cb1", name: "Дамир", en: "Damir", pos: "CB", ovr: 60 },
    { id: "xi-cb2", name: "Ермек", en: "Ermek", pos: "CB", ovr: 59 },
    { id: "xi-rb", name: "Жанибек", en: "Zhanibek", pos: "RB", ovr: 57 },
    { id: "xi-cdm", name: "Ильяс", en: "Ilyas", pos: "CDM", ovr: 58 },
    { id: "xi-cm", name: "Канат", en: "Kanat", pos: "CM", ovr: 60 },
    { id: "xi-cam", name: "Марат", en: "Marat", pos: "CAM", ovr: 61 },
    { id: "xi-lw", name: "Нурлан", en: "Nurlan", pos: "LW", ovr: 62 },
    { id: "xi-st", name: "Олжас", en: "Olzhas", pos: "ST", ovr: 63 },
    { id: "xi-rw", name: "Рустем", en: "Rustem", pos: "RW", ovr: 61 }
];

function ensureStartSquad() {
    if (!player || !player.name || player.mode !== "club") return;
    if (player.squadSeeded) return;
    if (!Array.isArray(player.squad)) player.squad = [];
    if (player.squad.length) {
        player.squadSeeded = true;
        return;
    }
    const nat = nationById(player.nation);
    player.startXI = START_XI.map(function (row) {
        return {
            id: row.id,
            name: row.name,
            en: row.en,
            pos: row.pos,
            ovr: row.ovr,
            flag: nat.flag,
            club: player.name
        };
    });
    player.squad = player.startXI.map(function (row) { return row.id; });
    player.squadSeeded = true;
    addLog(t("logStartXI", { n: player.squad.length }));
    save();
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

function langEn() {
    return !!(window.Loc && Loc.get && Loc.get() === "en");
}

function nationName(nat) {
    if (!nat) return "";
    return langEn() ? (nat.nameEn || nat.name) : nat.name;
}

function nationCity(nat) {
    if (!nat) return "";
    return langEn() ? (nat.cityEn || nat.city) : nat.city;
}

function nationLabel(id) {
    const nat = nationById(id);
    return nat.flag + " " + nationName(nat);
}

const UI_EN = {
    "Академия": "Academy",
    "Кайрат": "Kairat",
    "Тобол": "Tobol",
    "Ростов": "Rostov",
    "Црвена Звезда": "Red Star",
    "Динамо Москва": "Dynamo Moscow",
    "Локомотив": "Lokomotiv",
    "ЦСКА": "CSKA",
    "Спартак": "Spartak",
    "Краснодар": "Krasnodar",
    "Зенит": "Zenit",
    "Дворовый чемпионат": "Street Cup",
    "Вторая лига": "Second League",
    "ФНЛ": "FNL",
    "КПЛ": "KPL",
    "РПЛ": "RPL",
    "Лига конференций": "Conference League",
    "Лига Европы": "Europa League",
    "Лига чемпионов": "Champions League",
    "Суперклубы": "Superclubs",
    "Финал ЛЧ": "UCL Final",
    "Астана": "Astana",
    "Алматы": "Almaty",
    "Костанай": "Kostanay",
    "Ростов-на-Дону": "Rostov-on-Don",
    "Белград": "Belgrade",
    "Москва": "Moscow",
    "Амстердам": "Amsterdam",
    "Порту": "Porto",
    "Дортмунд": "Dortmund",
    "Милан": "Milan",
    "Санкт-Петербург": "Saint Petersburg",
    "Мадрид": "Madrid",
    "Манчестер": "Manchester",
    "Мюнхен": "Munich",
    "Барселона": "Barcelona",
    "Район": "District",
    "Регион": "Region",
    "Россия": "Russia",
    "Европа": "Europe",
    "Мир": "World",
    "Молодёжка": "Youth",
    "Суперлига": "Superliga",
    "Любители": "Amateur",
    "Казахстан": "Kazakhstan",
    "Первая лига": "First League",
    "Премьер-лига": "Premier League",
    "Элита": "Elite",
    "Вершина": "The Top",
    "Двор Север": "North Yard",
    "Школа №12": "School 12",
    "Гараж FC": "Garage FC",
    "Улица Мира": "Peace Street",
    "Каспий": "Caspian",
    "Тараз": "Taraz",
    "Атырау": "Atyrau",
    "Окжетпес": "Okzhetpes",
    "Балтика": "Baltika",
    "Сочи": "Sochi",
    "Родина": "Rodina",
    "Енисей": "Yenisey",
    "СКА-Хабаровск": "SKA Khabarovsk",
    "Ордабасы": "Ordabasy",
    "Динамо": "Dynamo",
    "Кайрат U19": "Kairat U19",
    "Астана U19": "Astana U19",
    "Шахтёр U19": "Shakhter U19",
    "Ордабасы U19": "Ordabasy U19",
    "Актобе": "Aktobe",
    "Шахтёр": "Shakhter",
    "Соперник": "Opponent",
    "ПасМастер": "PassMaster",
    "ДворЛегенда": "YardLegend",
    "Бортовой": "Touchline",
    "Двор Юг": "South Yard",
    "Гараж United": "Garage United",
    "Ночная Смена": "Night Shift",
    "Астана Prime": "Astana Prime",
    "Красный Борт": "Red Line",
    "Синий Вектор": "Blue Vector",
    "Наполи": "Napoli",
    "Интер": "Inter"
};

function ui(text) {
    if (text == null || text === "") return text || "";
    if (!langEn()) return String(text);
    return UI_EN[text] || String(text);
}

function clubLabel(name) {
    if (name === "Al-Nassr") return langEn() ? "Al-Nassr" : "Аль-Наср";
    if (name === "Inter Miami") return langEn() ? "Inter Miami" : "Интер Майами";
    if (name === "Al-Hilal") return langEn() ? "Al-Hilal" : "Аль-Хиляль";
    if (name === "Al-Sadd") return langEn() ? "Al-Sadd" : "Аль-Садд";
    if (name === "Chelsea") return langEn() ? "Chelsea" : "Челси";
    if (name === "Галатасарай") return langEn() ? "Galatasaray" : "Галатасарай";
    if (name === "Аталанта") return langEn() ? "Atalanta" : "Аталанта";
    return ui(name);
}

function shown(p) {
    if (!p) return "";
    if (typeof p === "string") return ui(p);
    if (!langEn()) return p.name || "";
    if (p.en) return p.en;
    const name = p.name || "";
    const pools = [];
    if (typeof TRANSFER_STARS !== "undefined") pools.push(TRANSFER_STARS);
    if (typeof WC_STARS !== "undefined") pools.push(WC_STARS);
    for (let i = 0; i < pools.length; i++) {
        const hit = pools[i].find(function (row) { return row.name === name; });
        if (hit && hit.en) return hit.en;
    }
    return ui(name);
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

function hideStudioSplash() {
    const splash = get("studioSplash");
    if (!splash) return;
    splash.classList.add("gone");
    splash.hidden = true;
    splash.style.display = "none";
    if (splash.parentNode) splash.parentNode.removeChild(splash);
}

function t(key, vars) {
    const loc = (typeof window !== "undefined" && window.Loc) || (typeof Loc !== "undefined" ? Loc : null);
    return (loc && loc.t) ? loc.t(key, vars) : key;
}

function statWord(key) {
    if (!langEn()) return STAT_NAMES[key] || key;
    const en = {
        pace: "Pace", shooting: "Shooting", passing: "Passing", dribbling: "Dribbling",
        defending: "Defending", physical: "Physical", diving: "Diving", handling: "Handling",
        kicking: "Kicking", reflexes: "Reflexes", speed: "Speed", positioning: "Positioning",
        marking: "Marking", tackling: "Tackling", heading: "Heading", strength: "Strength",
        jumping: "Jumping", stamina: "Stamina", vision: "Vision", setpieces: "Set pieces",
        command: "Command"
    };
    return en[key] || STAT_NAMES[key] || key;
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

function clubRepValue() {
    if (!player) return 50;
    return clamp(typeof player.clubRep === "number" ? player.clubRep : fameValue(), 1, 99);
}

function fameRank(n) {
    if (n >= 90) return t("fame_legend");
    if (n >= 75) return t("fame_star");
    if (n >= 60) return t("fame_respect");
    if (n >= 40) return t("fame_ok");
    if (n >= 20) return t("fame_stain");
    return t("fame_scandal");
}

function fameCap() {
    if (!player) return 64;
    const matches = player.matches || 0;
    const age = typeof player.age === "number" ? player.age : 16;
    const years = isClub() ? Math.floor((player.week || 1) / YEAR_WEEKS) : Math.max(0, age - 16);
    const titles = (player.titles || []).length;
    const wc = player.wcWins || 0;
    return clamp(66 + Math.floor(matches / 5) + years * 2 + titles * 3 + wc * 4, 66, 99);
}

function addFame(n) {
    if (!n || !player) return 0;
    const before = fameValue();
    let delta = n;
    if (delta > 0) {
        if (before >= 92) delta = Math.max(1, Math.round(delta * 0.35));
        else if (before >= 80) delta = Math.max(1, Math.round(delta * 0.55));
        else if (before >= 66) delta = Math.max(1, Math.round(delta * 0.8));
        const room = fameCap() - before;
        if (room <= 0) delta = 0;
        else delta = Math.min(delta, room);
    }
    player.fame = clamp(Math.round(before + delta), 0, 99);
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
        ? t("saveLast", { t: formatClock(player.lastSaveAt) })
        : t("saveEvery");
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
    if (player && player.coach && OPPONENTS[player.name]) return OPPONENTS[player.name];
    const table = isClub() ? LEAGUE_OPPONENTS : OPPONENTS;
    return table[player.club] || table["Академия"] || table["Дворовый чемпионат"] || ["Соперник"];
}

const NATION_POWER = {
    BR: 88, FR: 88, AR: 87, ES: 86, DE: 86, GB: 85, PT: 84, IT: 84,
    NL: 82, HR: 80, RS: 78, JP: 76, NG: 76, TR: 75, SN: 75, RU: 74,
    UZ: 68, BY: 66, KZ: 70
};

function nationPower(id) {
    return NATION_POWER[id] || 74;
}

function pickNationOpp(lastId) {
    const pool = NATIONS.filter(function (n) { return n.id !== player.nation; });
    if (!pool.length) return "BR";
    let pick = pool[Math.floor(Math.random() * pool.length)];
    if (pool.length > 1 && pick.id === lastId) pick = pool[(pool.indexOf(pick) + 1) % pool.length];
    return pick.id;
}

function fixtureName(row) {
    if (!row) return "";
    if (row.intl) return nationLabel(row.opp);
    return ui(row.opp);
}

function nextOppName() {
    const row = (player.grid || []).find(function (r) { return !r.result; });
    if (row) return fixtureName(row);
    return ui(player.nextOpponent || pickOpponent());
}

function pickOpponent() {
    const list = opponentPool();
    return list[Math.floor(Math.random() * list.length)];
}

function seedInternationals() {
    if (!player || !player.ntCalled || isClub()) return;
    ensureCalendar();
    const todo = player.grid.filter(function (row) { return !row.result && !row.intl; });
    let last = "";
    let n = 0;
    todo.forEach(function (row, i) {
        if (i % 3 !== 1) return;
        const id = pickNationOpp(last);
        last = id;
        row.opp = id;
        row.intl = true;
        n += 1;
    });
    if (!n && todo[0]) {
        todo[0].opp = pickNationOpp("");
        todo[0].intl = true;
    }
    const next = player.grid.find(function (row) { return !row.result; });
    if (next) {
        player.nextMatchWeek = next.week;
        player.nextOpponent = next.opp;
    }
    player.ntFixtures = true;
}

function makeGrid(fromWeek, count) {
    const pool = opponentPool();
    const rows = [];
    let week = fromWeek;
    let last = "";
    let lastNat = "";
    const intlOn = !isClub() && !!(player && player.ntCalled);
    for (let i = 0; i < count; i++) {
        const intl = intlOn && i % 4 === 3;
        let opp;
        if (intl) {
            opp = pickNationOpp(lastNat);
            lastNat = opp;
        } else {
            opp = pool[i % pool.length];
        if (opp === last) opp = pool[(i + 1) % pool.length];
        last = opp;
        }
        rows.push({
            week: week,
            opp: opp,
            intl: intl,
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
        if (row.intl) el.classList.add("intl");
        if (pending && row === pending) el.classList.add("now");
        const week = document.createElement("span");
        week.className = "gw";
        week.textContent = t("weekAbbr") + row.week;
        const who = document.createElement("span");
        who.className = "gwho";
        who.textContent = (row.home ? t("homeVs") : t("awayAt")) + fixtureName(row);
        const sc = document.createElement("span");
        sc.className = "gsc";
        if (row.result) {
            sc.textContent = row.score + (row.pens ? " (" + row.pens + " " + t("pens") + ")" : "");
        } else if (pending && row === pending) {
            sc.textContent = t("nowGrid");
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

function isInjured() {
    return !!(player && player.injury && player.week < player.injury.until);
}

function injuryLeft() {
    return isInjured() ? Math.max(0, player.injury.until - player.week) : 0;
}

function injuryLabel() {
    if (!isInjured()) return "";
    const left = injuryLeft();
    const part = t("part_" + (player.injury.part || "knee"));
    const kind = t("inj_" + (player.injury.id || "bruise"));
    if (player.injury.needPay) {
        return player.injury.emoji + " " + kind + " · " + part + " · " + t("treatNeedShort");
    }
    return player.injury.emoji + " " + kind + " · " + part + " · " + left + " " + t("weeksShort");
}

function clearInjuryIfHealed() {
    if (!player || !player.injury) return false;
    if (player.injury.needPay) return false;
    if (player.week < player.injury.until) return false;
    const was = player.injury.name;
    player.injury = null;
    addLog(t("logHeal", { was: was ? t("logHealWas", { name: was }) : "" }));
    Sfx.ding();
    return true;
}

function scaledPrice(base, rate) {
    const cash = (player && player.respect) || 0;
    return Math.round(base + Math.min(cash * rate, base * 6));
}

function treatCost() {
    if (!player || !player.injury) return 0;
    const base = TREAT_COST[player.injury.id] || 0;
    if (!base) return 0;
    return scaledPrice(base, player.injury.id === "break" ? 0.05 : 0.025);
}

function restFastPrice() {
    return scaledPrice(REST_FAST_COST, 0.008);
}

function brandPrice(bt) {
    return scaledPrice(bt.cost, 0.012);
}

function canTreatInjury() {
    return !!(player && player.injury && treatCost() > 0 && player.week < player.injury.until);
}

function treatInjury() {
    Sfx.unlock();
    if (!canTreatInjury()) return;
    const cost = treatCost();
    if ((player.respect || 0) < cost) {
        Sfx.error();
        addLog(t("logTreatNeed", { pay: money(cost) }));
        return;
    }
    player.respect -= cost;
    const kind = t("inj_" + (player.injury.id || "break"));
    player.injury = null;
    Sfx.ding();
    addLog(t("logTreat", { kind: kind, pay: money(cost) }));
    showAura("champ", t("treatAura"), kind, t("treatSub", { pay: money(cost) }), "#32d583", 1800);
    renderAll();
    save();
}

function wcCycleNow() {
    if (isClub()) return Math.floor(Math.max(0, (player.week || 1) - 1) / (YEAR_WEEKS * 4));
    return Math.floor(Math.max(0, (player.age || 16) - 18) / 4);
}

function wcYearNow() {
    return 2026 + wcCycleNow() * 4;
}

function maybeCallUp() {
    if (!player || !player.name || isClub() || player.ntCalled) return false;
    if ((player.age || 16) < 18 || (player.age || 16) > 37) return false;
    if (fameValue() < 68 || getOverall() < 76) return false;
    player.ntCalled = true;
    seedInternationals();
    addLog(t("logCallUp", { nation: nationLabel(player.nation) }), "goal");
    showAura("champ", t("callKicker"), t("callTitle"), nationLabel(player.nation), "#ffd83d", 2200);
    Sfx.champ ? Sfx.champ() : Sfx.ding();
    return true;
}

function wcOnCalendar() {
    return !!(player && weekInYear(player.week) === WC_IN_YEAR);
}

function canPlayWc() {
    if (!player || !player.name || isInjured() || player.retired) return false;
    if ((player.wcCycle || -1) === wcCycleNow()) return false;
    const started = wcRunNow() && ((player.wcRun.path && player.wcRun.path.length) || (player.wcRun.played || 0) > 0 || player.wcRun.phase !== "group");
    if (!wcOnCalendar() && !started) return false;
    if (isClub()) return true;
    if (!player.ntCalled) return false;
    if ((player.age || 16) < 18 || (player.age || 16) > 38) return false;
    return true;
}

function awardName(id) {
    return t("award_" + id);
}

function seasonYear() {
    return 2008 + (player && player.age ? player.age : 16);
}

function ageAtWeek(week) {
    return 16 + Math.floor((Math.max(1, week) - 1) / YEAR_WEEKS);
}

function weekInYear(week) {
    return ((Math.max(1, week) - 1) % YEAR_WEEKS) + 1;
}

function weekOf(age, inYear) {
    return (age - 16) * YEAR_WEEKS + inYear;
}

function monthOfWeek(inYear) {
    return clamp(Math.ceil(inYear / 3), 1, 12);
}

function careerEvents() {
    const w = player.week || 1;
    const age = player.age || ageAtWeek(w);
    const list = [];
    for (let c = 0; c <= 5; c++) {
        const a = 18 + c * 4;
        if (a > 38) break;
        const year = 2008 + a;
        const at = weekOf(a, WC_IN_YEAR);
        const played = (player.wcCycle || -1) >= c;
        let state = "soon";
        if (played) state = "done";
        else if (age >= a && age < a + 4 && w >= at) state = "now";
        list.push({
            kind: "wc",
            year: year,
            week: at,
            wiy: WC_IN_YEAR,
            month: monthOfWeek(WC_IN_YEAR),
            left: Math.max(0, at - w),
            state: state
        });
    }
    const fromAge = Math.max(19, age - 1);
    for (let a = fromAge; a <= age + 3; a++) {
        const year = 2008 + a;
        const at = weekOf(a, BALLON_IN_YEAR);
        const done = (player.ballonYear || 0) >= year;
        let state = "soon";
        if (done) state = "done";
        else if (seasonYear() === year && weekInYear(w) >= BALLON_IN_YEAR - 2) state = "now";
        list.push({
            kind: "ballon",
            year: year,
            week: at,
            wiy: BALLON_IN_YEAR,
            month: monthOfWeek(BALLON_IN_YEAR),
            left: Math.max(0, at - w),
            state: state
        });
    }
    list.sort(function (a, b) { return a.week - b.week; });
    return list.filter(function (ev) {
        return ev.week >= w - YEAR_WEEKS && ev.week <= w + YEAR_WEEKS * 5;
    });
}

function openEventCal() {
    const box = get("calOverlay");
    if (!box) return;
    Sfx.unlock();
    Sfx.click();
    updateEventCal();
    box.hidden = false;
}

function closeEventCal() {
    const box = get("calOverlay");
    if (box) box.hidden = true;
}

function updateEventCal() {
    const now = get("calNow");
    const yearBox = get("calYear");
    const listBox = get("calEvents");
    if (!player || !player.name) return;
    const w = player.week || 1;
    const wiy = weekInYear(w);
    const mon = monthOfWeek(wiy);
    if (now) {
        now.textContent = t("calNow", {
            year: seasonYear(),
            w: wiy,
            week: w,
            age: player.age || 16
        });
    }
    if (yearBox) {
        yearBox.textContent = "";
        const marked = {};
        careerEvents().forEach(function (ev) {
            if (ev.year === seasonYear()) marked[ev.month] = ev.kind;
        });
        for (let m = 1; m <= 12; m++) {
            const cell = document.createElement("button");
            cell.type = "button";
            cell.className = "cal-month";
            if (m === mon) cell.classList.add("on");
            if (marked[m] === "wc") cell.classList.add("wc");
            if (marked[m] === "ballon") cell.classList.add("ballon");
            cell.textContent = t("m" + m);
            yearBox.appendChild(cell);
        }
    }
    if (listBox) {
        listBox.textContent = "";
        careerEvents().forEach(function (ev) {
            const row = document.createElement("div");
            row.className = "cal-ev " + ev.state + " " + ev.kind;
            const when = document.createElement("b");
            when.textContent = ev.year + " · " + t("m" + ev.month);
            const what = document.createElement("span");
            what.textContent = ev.kind === "wc" ? t("calWc", { year: ev.year }) : t("calBallon", { year: ev.year });
            const st = document.createElement("small");
            st.textContent = ev.state === "done"
                ? t("calDone")
                : (ev.state === "now"
                    ? t("calLive")
                    : t("calIn", { n: ev.left, unit: ev.left === 1 ? t("unit1") : t("unitN") }));
            row.appendChild(when);
            row.appendChild(what);
            row.appendChild(st);
            listBox.appendChild(row);
        });
    }
}

function addTitle(id, year, note) {
    if (!player) return false;
    if (!Array.isArray(player.titles)) player.titles = [];
    if (!Array.isArray(player.awards)) player.awards = [];
    const y = year || seasonYear();
    const dup = player.titles.some(function (row) { return row.id === id && row.year === y && (row.note || "") === (note || ""); });
    if (dup) return false;
    player.titles.push({ id: id, year: y, note: note || "" });
    if (player.awards.indexOf(id) < 0) player.awards.push(id);
    return true;
}

function youBallonScore() {
    const ovr = getOverall();
    const fame = fameValue();
    const goals = player.goals || 0;
    let n = clamp(ovr - 70, 0, 30) * 1.45 + clamp(fame - 58, 0, 42) * 0.95 + Math.min(goals, 90) * 0.09;
    n += (player.wcWins || 0) * 7;
    if ((player.awards || []).indexOf("golden_boot") >= 0) n += 5;
    if ((player.awards || []).indexOf("best_player") >= 0) n += 4;
    if (player.ntCalled) n += 2;
    if (isGk()) n += Math.min(player.cleanSheets || 0, 20) * 0.35;
    return Math.round(n);
}

function ballonBoard() {
    const year = seasonYear();
    const you = youBallonScore();
    const rows = BALLON_RIVALS.map(function (r, i) {
        const wobble = ((year * 11 + i * 17) % 7) - 3;
        return { name: r.flag + " " + r.n, score: r.s + wobble, you: false };
    });
    rows.push({ name: (player.avatar || "⚽") + " " + player.name, score: you, you: true });
    rows.sort(function (a, b) { return b.score - a.score; });
    return rows;
}

function ballonRank() {
    const rows = ballonBoard();
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].you) return i + 1;
    }
    return 99;
}

function ballonRaceOn() {
    if (!player || !player.name || isClub()) return false;
    if ((player.age || 16) < 19) return false;
    return youBallonScore() >= 52 || ballonRank() <= 10;
}

function maybeGrantBallon() {
    if (!ballonRaceOn()) return false;
    if (weekInYear(player.week) !== BALLON_IN_YEAR) return false;
    if (ballonRank() !== 1) return false;
    if (player.ballonYear === seasonYear()) return false;
    player.ballonYear = seasonYear();
    addTitle("ballon", seasonYear());
    addFame(12);
    player.respect = (player.respect || 0) + 2000;
    addLog(t("logBallon", { year: seasonYear() }), "goal");
    showAura("champ", t("ballonKicker"), t("award_ballon"), String(seasonYear()), "#ffd83d", 2400);
    Sfx.ding();
    return true;
}

const CWC_CLUBS = [
    { name: "Al Ahly", power: 72 },
    { name: "Urawa", power: 73 },
    { name: "Monterrey", power: 74 },
    { name: "Al Hilal", power: 76 },
    { name: "Ajax", power: 77 },
    { name: "Porto", power: 78 },
    { name: "Flamengo", power: 80 },
    { name: "Borussia Dortmund", power: 82 },
    { name: "Inter", power: 84 },
    { name: "PSG", power: 86 },
    { name: "Liverpool", power: 87 },
    { name: "FC Barcelona", power: 88 },
    { name: "Bayern Munich", power: 89 },
    { name: "Manchester City", power: 90 },
    { name: "Real Madrid", power: 92 }
];

function pickWcFace(stage, used) {
    used = used || [];
    if (isClub()) {
        const bands = [
            CWC_CLUBS.filter(function (c) { return c.power < 78; }),
            CWC_CLUBS.filter(function (c) { return c.power >= 78 && c.power < 86; }),
            CWC_CLUBS.filter(function (c) { return c.power >= 84 && c.power < 90; }),
            CWC_CLUBS.filter(function (c) { return c.power >= 88; })
        ];
        let pool = (bands[stage] || CWC_CLUBS).filter(function (c) {
            return c.name !== player.name && used.indexOf(c.name) < 0;
        });
        if (!pool.length) pool = CWC_CLUBS.filter(function (c) { return c.name !== player.name; });
        const row = pool[Math.floor(Math.random() * pool.length)];
        return { id: row.name, label: ui(row.name), power: row.power };
    }
    const bands = [
        ["KZ", "UZ", "BY", "JP", "NG", "SN", "TR", "RU"],
        ["RS", "HR", "NL", "IT", "PT"],
        ["GB", "PT", "IT", "NL", "HR", "DE"],
        ["BR", "FR", "AR", "ES", "DE", "GB"]
    ];
    let ids = (bands[stage] || bands[3]).filter(function (id) {
        return id !== player.nation && used.indexOf(id) < 0;
    });
    if (!ids.length) {
        ids = NATIONS.map(function (n) { return n.id; }).filter(function (id) { return id !== player.nation; });
    }
    const id = ids[Math.floor(Math.random() * ids.length)];
    return { id: id, label: nationLabel(id), power: nationPower(id) };
}

function wcFixture(skill, stage, oppPower) {
    const bar = [76, 79, 81, 82][stage] || 76;
    const them0 = [1.05, 1.1, 1.12, 1.05][stage] || 1.05;
    const tilt = ((oppPower || 78) - 78) / 100;
    const edge = clamp((skill - bar) / 18 - tilt, -0.55, 0.4);
    let us = Math.max(0, Math.round(0.85 + edge * 1.4 + Math.random() * 1.45));
    let them = Math.max(0, Math.round(them0 - edge * 1.15 + Math.random() * 1.35));
    if (us === them) {
        if (Math.random() < 0.48 + edge * 0.2) us += 1;
        else them += 1;
    }
    let g = 0;
    if (!isGk()) {
        if (isCb()) {
            g = us > 0 && Math.random() < 0.22 ? 1 : 0;
        } else {
            const hot = clamp(0.28 + (skill - 70) / 70, 0.18, 0.78);
            if (us >= 2 && Math.random() < hot * 0.42) g = 2;
            else if (Math.random() < hot) g = 1;
            g = Math.min(us, g);
        }
    }
    return { win: us > them, us: us, them: them, g: g, clean: them === 0 };
}

function wcRunNow() {
    const cycle = wcCycleNow();
    if (!player.wcRun || player.wcRun.cycle !== cycle || player.wcRun.phase === "done") return null;
    return player.wcRun;
}

function wcRoundOf(phase) {
    if (phase === "qf") return 4;
    if (phase === "sf") return 5;
    if (phase === "final") return 6;
    return 3;
}

function playWorldCup() {
    Sfx.unlock();
    if (player && player.retired) {
        Sfx.error();
        addLog(t("logRetired"));
        return;
    }
    if (!canPlayWc() || matchBusy) {
        Sfx.error();
        return;
    }
    if (!needEnergy(MATCH_COST)) return;
    const year = wcYearNow();
    const cycle = wcCycleNow();
    if (!player.wcRun || player.wcRun.cycle !== cycle || player.wcRun.phase === "done") {
        player.wcRun = { cycle: cycle, phase: "group", played: 0, wins: 0, goals: 0, saves: 0, clean: 0, path: [] };
    }
    const run = player.wcRun;
    if (!run.faced) run.faced = [];
    const stage = run.phase === "qf" ? 1 : run.phase === "sf" ? 2 : run.phase === "final" ? 3 : 0;
    const key = run.phase === "group" ? "wcGroup" : run.phase === "qf" ? "wcQf" : run.phase === "sf" ? "wcSf" : "wcFinal";
    const face = run.next && run.next.label ? run.next : pickWcFace(stage, run.faced);
    run.faced.push(face.id);
    run.next = null;
    player.energy -= MATCH_COST;
    advanceWeek();
    matchBusy = true;
    const m = wcFixture(getOverall(), stage, face.power);
    const scoreLine = m.us + ":" + m.them + " vs " + face.label;
    run.path.push(t(key) + " " + scoreLine);
    run.goals += m.g;
    if (isClub()) player.goals = (player.goals || 0) + m.us;
    else if (!isGk() && !isCb()) player.goals += m.g;
    else if (isCb()) player.goals += m.g;
    if (isGk()) {
        const sv = 2 + Math.round(Math.random() * 3);
        run.saves += sv;
        player.saves += sv;
        if (m.clean) {
            run.clean += 1;
            player.cleanSheets = (player.cleanSheets || 0) + 1;
        }
    }
    if (!isClub()) player.ntCaps = (player.ntCaps || 0) + 1;
    addLog(t(key) + " " + scoreLine + (m.win ? " · " + t("winWord") : " · " + t("loseWord")));
    showAura("match", t(isClub() ? "cwcTag" : "wcTag") + " " + year, t(key) + " vs " + face.label, scoreLine, m.win ? "#5b8cff" : "#e57373", 900);

    let champ = false;
    let over = false;
    if (run.phase === "group") {
        run.played += 1;
        if (m.win) run.wins += 1;
        if (run.played >= 3) {
            over = run.wins < 2;
            if (!over) run.phase = "qf";
        }
    } else if (!m.win) {
        over = true;
    } else if (run.phase === "qf") {
        run.phase = "sf";
    } else if (run.phase === "sf") {
        run.phase = "final";
    } else {
        champ = true;
        over = true;
    }

    function release() {
        matchBusy = false;
        updateNationUI();
    }

    if (!over) {
        const nextStage = run.phase === "qf" ? 1 : run.phase === "sf" ? 2 : run.phase === "final" ? 3 : 0;
        run.next = pickWcFace(nextStage, run.faced);
        save();
        renderAll();
        setTimeout(release, 700);
        return;
    }

    const round = wcRoundOf(run.phase === "group" ? "group" : (champ ? "final" : run.phase));
    if (isCb()) player.tackles = (player.tackles || 0) + 8 + round * 3;
    const pay = champ ? WC_WIN_PAY : (round >= 6 ? WC_LOSS_PAY.final : round >= 5 ? WC_LOSS_PAY.sf : round >= 4 ? WC_LOSS_PAY.qf : WC_LOSS_PAY.group);
    player.respect = (player.respect || 0) + pay;
    const got = [];
    if (champ) {
        player.wcWins = (player.wcWins || 0) + 1;
        player.wins = (player.wins || 0) + 1;
        addFame(8);
        if (isClub()) {
            addTitle("cwc", year);
            got.push("cwc");
        } else {
            addTitle("wc_champ", year);
            got.push("wc_champ");
        }
    } else {
        player.losses = (player.losses || 0) + 1;
        addFame(1);
    }
    if (!isClub() && isGk() && run.clean >= 2) got.push("best_gk");
    if (!isClub() && !isGk() && run.goals >= 4) got.push("golden_boot");
    if (!isClub() && (player.age || 16) <= 23 && (champ || run.goals >= 2)) got.push("best_young");
    if (!isClub() && champ && getOverall() >= 86) got.push("best_player");
    if (!isClub() && champ && (getOverall() >= 90 || run.goals >= 6 || (isGk() && run.clean >= 4))) got.push("golden_ball");
    got.forEach(function (id) {
        if (id === "wc_champ" || id === "cwc") return;
        addTitle(id, year);
        addFame(id === "golden_ball" ? 6 : 2);
    });
    player.wcCycle = cycle;
    run.phase = "done";
    const names = got.map(awardName).join(" · ");
    const trail = run.path.join(" · ");
    addLog(champ
        ? t("logWcWin", { year: year, pay: money(pay) })
        : t("logWcOut", { year: year, pay: money(pay) }));
    if (trail) addLog(trail);
    if (names) addLog(t("logWcAwards", { list: names }), "goal");
    setTimeout(function () {
        showAura(
            champ ? "champ" : "match",
            t(isClub() ? "cwcTag" : "wcTag") + " " + year,
            champ ? t("wcChamp") : t("wcExit"),
            "+" + money(pay) + (trail ? " · " + trail : ""),
            champ ? "#ffd83d" : "#8aa0c8",
            2600
        );
        if (champ && Sfx.champ) Sfx.champ();
        else Sfx.whistle ? Sfx.whistle() : Sfx.ding();
        release();
        maybeCallUp();
        maybeGrantBallon();
        renderAll();
        save();
    }, 700);
}

function updateTreatUI() {
    const btn = get("treatBtn");
    const hint = get("treatHint");
    const show = canTreatInjury();
    if (btn) {
        btn.hidden = !show;
        if (show) {
            const cost = treatCost();
            const must = !!(player.injury && player.injury.needPay);
            btn.disabled = (player.respect || 0) < cost;
            btn.textContent = (must ? t("treatMust") : t("treatOpt")) + " · " + money(cost);
        }
    }
    if (hint) {
        hint.hidden = !show;
        hint.textContent = show
            ? (player.injury.needPay ? t("treatHintMust") : t("treatHintOpt"))
            : "";
    }
}

function updateNationUI() {
    const card = get("nationCard");
    if (!card) return;
    card.hidden = !player || !player.name;
    if (card.hidden) return;
    const status = get("ntStatus");
    const meta = get("ntMeta");
    const btn = get("wcBtn");
    const heading = card.querySelector("h2");
    if (heading) heading.textContent = t(isClub() ? "cwcTitle" : "ntTitle");
    const tab = document.querySelector('#moreTabs [data-more="nation"]');
    if (tab) tab.textContent = t(isClub() ? "cwcTab" : "moreNation");
    const hint = get("ntHint");
    if (hint) hint.textContent = t(isClub() ? "cwcHint" : "ntHint");
    if (isClub()) {
        if (status) status.textContent = t("cwcStatus", { name: player.name });
        if (meta) meta.textContent = t("cwcMeta", { year: wcYearNow(), wins: player.wcWins || 0 });
    } else if (status) {
        status.textContent = player.ntCalled
            ? t("ntIn", { nation: nationLabel(player.nation) })
            : t("ntWait");
    }
    if (meta && !isClub()) {
        meta.textContent = t("ntMeta", {
            caps: player.ntCaps || 0,
            year: wcYearNow(),
            wins: player.wcWins || 0
        });
    }
    if (btn) {
        const ready = canPlayWc();
        const run = wcRunNow();
        btn.disabled = !ready || matchBusy;
        if (ready && !run) {
            player.wcRun = { cycle: wcCycleNow(), phase: "group", played: 0, wins: 0, goals: 0, saves: 0, clean: 0, path: [], faced: [] };
        }
        const live = ready ? (run || player.wcRun) : run;
        if (live && ready && !live.next) {
            const st = live.phase === "qf" ? 1 : live.phase === "sf" ? 2 : live.phase === "final" ? 3 : 0;
            live.next = pickWcFace(st, live.faced || []);
        }
        const vs = live && live.next ? " vs " + live.next.label : "";
        if (ready && live) {
            const label = live.phase === "group"
                ? t("wcGroup") + " " + ((live.played || 0) + 1) + "/3"
                : t(live.phase === "qf" ? "wcQf" : live.phase === "sf" ? "wcSf" : "wcFinal");
            btn.textContent = "🏆 " + label + " · " + wcYearNow() + vs;
        } else {
            const done = (player.wcCycle || -1) === wcCycleNow();
            const called = isClub() || player.ntCalled;
            btn.textContent = ready
                ? t(isClub() ? "cwcPlay" : "wcPlay", { year: wcYearNow() })
                : (done ? t("wcDone") : (called ? t("wcWeek") : t("wcNeedCall")));
        }
    }
}

function updateTitlesUI() {
    const card = get("titlesCard");
    const body = get("titlesBody");
    if (!card || !body) return;
    card.hidden = !player || !player.name;
    const rows = (player.titles || []).slice().reverse();
    body.textContent = "";
    if (!rows.length) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 2;
        td.className = "empty";
        td.textContent = t("titlesEmpty");
        tr.appendChild(td);
        body.appendChild(tr);
        return;
    }
    rows.forEach(function (row) {
        const tr = document.createElement("tr");
        const name = document.createElement("td");
        name.textContent = awardName(row.id) + (row.note ? " · " + ui(row.note) : "");
        const year = document.createElement("td");
        year.className = "cash";
        year.textContent = String(row.year || "—");
        tr.appendChild(name);
        tr.appendChild(year);
        body.appendChild(tr);
    });
}

function updateBallonUI() {
    const card = get("ballonCard");
    const body = get("ballonBody");
    const hint = get("ballonHint");
    if (!card || !body) return;
    const show = ballonRaceOn();
    card.hidden = !show;
    if (!show) return;
    const rows = ballonBoard().slice(0, 10);
    const rank = ballonRank();
    if (hint) {
        hint.textContent = rank <= 3
            ? t("ballonHot", { n: rank, year: seasonYear() })
            : t("ballonNear", { n: rank, year: seasonYear() });
    }
    body.textContent = "";
    rows.forEach(function (row, i) {
        const tr = document.createElement("tr");
        if (row.you) tr.className = "owned";
        const pos = document.createElement("td");
        pos.textContent = String(i + 1);
        const who = document.createElement("td");
        who.textContent = row.name;
        const sc = document.createElement("td");
        sc.className = "cash";
        sc.textContent = String(row.score);
        tr.appendChild(pos);
        tr.appendChild(who);
        tr.appendChild(sc);
        body.appendChild(tr);
    });
}

function pickInjury() {
    let roll = Math.random() * INJURIES.reduce(function (s, x) { return s + x.w; }, 0);
    for (let i = 0; i < INJURIES.length; i++) {
        roll -= INJURIES[i].w;
        if (roll <= 0) return INJURIES[i];
    }
    return INJURIES[0];
}

function injuryChance() {
    let p = 0.035;
    if ((player.energy || 0) < 24) p += 0.03;
    if ((player.age || 16) >= 30) p += 0.025;
    if ((player.age || 16) >= 34) p += 0.02;
    const phys = (player.stats && (player.stats.physical || player.stats.strength)) || 62;
    p += (68 - phys) / 700;
    if (isGk()) p *= 0.72;
    return clamp(p, 0.02, 0.11);
}

function rollMatchInjury() {
    if (isInjured()) return null;
    if (Math.random() >= injuryChance()) return null;
    const hit = pickInjury();
    const zones = hit.zones || ["knee"];
    const part = zones[Math.floor(Math.random() * zones.length)];
    player.injury = {
        id: hit.id,
        name: hit.name,
        emoji: hit.emoji,
        until: player.week + hit.weeks,
        part: part,
        partName: PART_NAMES[part] || part,
        needPay: false,
        treat: hit.id === "break" || hit.id === "muscle"
    };
    return player.injury;
}

function updateBodyMap() {
    const hint = get("bodyMapHint");
    const skel = get("skel");
    const card = get("bodyCard");
    const title = card && card.querySelector("h2");
    const club = isClub();
    if (card) card.hidden = club && !isInjured();
    if (skel) skel.hidden = club;
    if (title) title.hidden = club;
    if (!skel) return;
    skel.querySelectorAll("[data-part]").forEach(function (el) {
        el.classList.toggle("hit", isInjured() && el.getAttribute("data-part") === player.injury.part);
    });
    if (hint) hint.textContent = isInjured()
        ? (t("hurt") + ": " + t("part_" + (player.injury.part || "knee")) + " · " + t("inj_" + (player.injury.id || "bruise"))
            + (player.injury.needPay ? " · " + t("treatHintMust") : ""))
        : t("intact");
    updateTreatUI();
}

function brandTypeById(id) {
    return BRAND_TYPES.find(function (t) { return t.id === id; }) || BRAND_TYPES[0];
}

function ownedBrands() {
    return (player && Array.isArray(player.brands)) ? player.brands : [];
}

function ownedBrand(typeId) {
    return ownedBrands().find(function (b) { return b.type === typeId; }) || null;
}

function brandIncomeFor(brand) {
    const id = typeof brand === "string" ? brand : (brand && (brand.type || brand.id));
    const type = brandTypeById(id);
    const fame = fameValue();
    const wealth = Math.max(0, player.respect || 0);
    const ads = 1 + Math.min(2, player.adBoost || 0);
    return Math.max(4, Math.round((fame * 0.18 + Math.sqrt(wealth) * 0.28) * (type.mult || 1) * ads));
}

function brandIncome() {
    return ownedBrands().reduce(function (s, b) { return s + brandIncomeFor(b); }, 0);
}

function sponsorById(id) {
    return SPONSORS.find(function (row) { return row.id === id; }) || null;
}

function ownedSponsor(id) {
    return (player && Array.isArray(player.sponsors) ? player.sponsors : []).find(function (row) { return row.id === id; }) || null;
}

function sponsorWeek(sp) {
    const fame = fameValue();
    return Math.max(sp.base, Math.round(sp.base * (0.75 + fame / 200)));
}

function sponsorIncome() {
    return (player && player.sponsors || []).reduce(function (sum, deal) {
        const sp = sponsorById(deal.id);
        return sum + (sp ? sponsorWeek(sp) : 0);
    }, 0);
}

function payoutSponsors() {
    const list = (player && player.sponsors) || [];
    if (!list.length) return 0;
    let total = 0;
    list.forEach(function (deal) {
        const sp = sponsorById(deal.id);
        if (!sp) return;
        const pay = sponsorWeek(sp);
        player.respect = (player.respect || 0) + pay;
        deal.earned = (deal.earned || 0) + pay;
        total += pay;
    });
    if (total && player.week % 4 === 0) addLog(t("logDealWeek", { pay: money(total) }));
    return total;
}

function signSponsor(id) {
    Sfx.unlock();
    if (!player || !player.name) return;
    const sp = sponsorById(id);
    if (!sp) return;
    if (ownedSponsor(sp.id)) {
        Sfx.error();
        addLog(t("dealYours"));
        return;
    }
    if ((player.sponsors || []).length >= DEAL_CAP) {
        Sfx.error();
        addLog(t("dealFull", { n: DEAL_CAP }));
        return;
    }
    if (fameValue() < sp.fame) {
        Sfx.error();
        addLog(t("dealFame", { n: sp.fame, now: fameValue() }));
        return;
    }
    if ((player.respect || 0) < sp.cost) {
        Sfx.error();
        addLog(t("dealPoor", { pay: money(sp.cost) }));
        return;
    }
    player.respect -= sp.cost;
    if (!Array.isArray(player.sponsors)) player.sponsors = [];
    player.sponsors.push({ id: sp.id, week: player.week, earned: 0 });
    Sfx.ding();
    addLog(t("logDeal", { name: sp.emoji + " " + sp.name, pay: money(sp.cost) }));
    showAura("champ", t("dealsTitle"), sp.emoji + " " + sp.name, t("dealSigned"), "#ffd83d", 1600);
    renderAll();
    save();
}

function dropSponsor(id) {
    if (!player || !player.name) return;
    const sp = sponsorById(id);
    if (!sp || !ownedSponsor(id)) return;
    player.sponsors = (player.sponsors || []).filter(function (row) { return row.id !== id; });
    Sfx.click();
    addLog(t("logDealDrop", { name: sp.emoji + " " + sp.name }));
    renderAll();
    save();
}

function updateSponsors() {
    const box = get("sponsorList");
    const week = get("sponsorWeek");
    if (week) week.textContent = money(sponsorIncome());
    if (!box) return;
    box.textContent = "";
    SPONSORS.forEach(function (sp) {
        const mine = ownedSponsor(sp.id);
        const btn = document.createElement("button");
        btn.type = "button";
        btn.setAttribute("data-deal", sp.id);
        btn.classList.toggle("best", !!sp.best);
        btn.classList.toggle("on", !!mine);
        const pay = sponsorWeek(sp);
        btn.textContent = mine
            ? t("dealOwned", { name: sp.emoji + " " + sp.name, n: money(mine.earned || 0) })
            : t("dealBtn", {
                name: sp.emoji + " " + sp.name,
                fame: sp.fame,
                cost: money(sp.cost),
                pay: money(pay),
                best: sp.best ? t("dealBest") : ""
            });
        btn.disabled = !!mine || !player || !player.name;
        box.appendChild(btn);
        if (mine) {
            const drop = document.createElement("button");
            drop.type = "button";
            drop.setAttribute("data-drop", sp.id);
            drop.textContent = t("dealDrop");
            box.appendChild(drop);
        }
    });
}

function payoutBrand() {
    const list = ownedBrands();
    if (!list.length) return 0;
    let total = 0;
    list.forEach(function (b) {
        const pay = brandIncomeFor(b);
        player.respect = (player.respect || 0) + pay;
        b.earned = (b.earned || 0) + pay;
        b.lastPay = pay;
        total += pay;
    });
    if (total && player.week % 4 === 0) {
        addLog(t("logBrandWeek", { pay: money(total) }));
    }
    return total;
}

function foundBrand(typeId) {
    Sfx.unlock();
    if (!player || !player.name) return;
    const type = brandTypeById(typeId || "wear");
    if (ownedBrand(type.id)) {
        Sfx.error();
        addLog(t("logBrandOwn"));
        return;
    }
    const cost = brandPrice(type);
    if ((player.respect || 0) < cost) {
        Sfx.error();
        addLog(t("logBrandNeed", { pay: money(cost), have: money(player.respect || 0) }));
        return;
    }
    if (fameValue() < type.minFame) {
        Sfx.error();
        addLog(t("logBrandRep", { n: type.minFame, now: fameValue() }));
        return;
    }
    const typed = (get("brandName") && get("brandName").value.trim()) || "";
    const name = typed || (player.name + " " + type.name);
    player.respect -= cost;
    if (!Array.isArray(player.brands)) player.brands = [];
    player.brands.push({
        name: name,
        type: type.id,
        emoji: type.emoji,
        week: player.week,
        earned: 0,
        lastPay: 0
    });
    if (get("brandName")) get("brandName").value = "";
    Sfx.ding();
    addLog(t("logBrandFound", { pay: money(cost), name: type.emoji + " " + name }));
    showAura("champ", "−" + money(cost), type.emoji + " " + name, t("firm_" + type.id) + " · " + t("brandWeekIncome"), "#ffd83d", 1800);
    renderAll();
    save();
}

function updateBrand() {
    if (get("brandCash")) get("brandCash").textContent = money(player && player.respect);
    if (get("brandWeekPay")) get("brandWeekPay").textContent = money(brandIncome());
    const body = get("brandTableBody");
    if (!body) return;
    body.textContent = "";
    BRAND_TYPES.forEach(function (bt) {
        const mine = ownedBrand(bt.id);
        const tr = document.createElement("tr");
        if (mine) tr.className = "owned";
        function cell(text, cls) {
            const td = document.createElement("td");
            if (cls) td.className = cls;
            td.textContent = text;
            tr.appendChild(td);
        }
        const price = brandPrice(bt);
        cell(bt.emoji + " " + (mine ? mine.name : t("firm_" + bt.id)), "firm");
        cell(money(price), "cash");
        cell(String(bt.minFame), "");
        cell(money(brandIncomeFor(bt)), "cash");
        const td = document.createElement("td");
        if (mine) {
            const pledged = player.loanPlan === bt.id && (player.loan || 0) > 0;
            td.textContent = t("yours") + " · " + money(mine.earned || 0) + (pledged ? " · " + t("bankPledged") : "");
            td.className = "ok";
        } else {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.setAttribute("data-found", bt.id);
            const cashOk = (player && (player.respect || 0) >= price);
            const fameOk = fameValue() >= bt.minFame;
            btn.disabled = !player || !player.name || !cashOk || !fameOk;
            btn.textContent = !cashOk
                ? t("need") + " " + money(price)
                : (!fameOk ? t("needRep") + " " + bt.minFame : t("buy") + " " + money(price));
            td.appendChild(btn);
        }
        tr.appendChild(td);
        body.appendChild(tr);
    });
    updateSponsors();
}

const EXCLUSIVES = [
    { id: "x-cr7", name: "Роналду Драфт", en: "Draft Ronaldo", pos: "ST", ovr: 99, flag: "🇵🇹", club: "Эксклюзив", exclusive: true },
    { id: "x-felix", name: "Феликс Драфт", en: "Draft Félix", pos: "CAM", ovr: 92, flag: "🇵🇹", club: "Эксклюзив", exclusive: true },
    { id: "x-messi", name: "Месси", en: "Messi", pos: "RW", ovr: 96, flag: "🇦🇷", club: "Inter Miami", exclusive: true },
    { id: "x-modric", name: "Модрич", en: "Modrić", pos: "CM", ovr: 85, flag: "🇭🇷", club: "Milan", exclusive: true },
    { id: "x-mbappe", name: "Мбаппе", en: "Mbappé", pos: "ST", ovr: 94, flag: "🇫🇷", club: "Real Madrid", exclusive: true },
    { id: "x-vini", name: "Винисиус", en: "Vinicius", pos: "LW", ovr: 90, flag: "🇧🇷", club: "Real Madrid", exclusive: true },
    { id: "x-bellingham", name: "Беллингем", en: "Bellingham", pos: "CM", ovr: 89, flag: "🇬🇧", club: "Real Madrid", exclusive: true },
    { id: "x-diomande", name: "Диаманде", en: "Diomande", pos: "RW", ovr: 86, flag: "🇨🇮", club: "Real Madrid", exclusive: true },
    { id: "x-lautaro", name: "Лаутаро", en: "Lautaro", pos: "ST", ovr: 90, flag: "🇦🇷", club: "Интер", exclusive: true },
    { id: "x-barella", name: "Барелла", en: "Barella", pos: "CM", ovr: 87, flag: "🇮🇹", club: "Интер", exclusive: true },
    { id: "x-leao", name: "Леау", en: "Leão", pos: "LW", ovr: 88, flag: "🇵🇹", club: "Галатасарай", exclusive: true },
    { id: "x-musiala", name: "Мусиала", en: "Musiala", pos: "CAM", ovr: 91, flag: "🇩🇪", club: "Bayern", exclusive: true },
    { id: "x-kane", name: "Кейн", en: "Kane", pos: "ST", ovr: 90, flag: "🇬🇧", club: "Bayern", exclusive: true },
    { id: "x-kimmich", name: "Киммих", en: "Kimmich", pos: "CM", ovr: 88, flag: "🇩🇪", club: "Bayern", exclusive: true },
    { id: "x-yamal", name: "Ямаль", en: "Yamal", pos: "RW", ovr: 89, flag: "🇪🇸", club: "Barcelona", exclusive: true },
    { id: "x-pedri", name: "Педри", en: "Pedri", pos: "CM", ovr: 87, flag: "🇪🇸", club: "Barcelona", exclusive: true },
    { id: "x-raphinha", name: "Рафинья", en: "Raphinha", pos: "RW", ovr: 86, flag: "🇧🇷", club: "Barcelona", exclusive: true },
    { id: "x-salah", name: "Салах", en: "Salah", pos: "RW", ovr: 93, flag: "🇪🇬", club: "Liverpool", exclusive: true },
    { id: "x-haaland", name: "Холанд", en: "Haaland", pos: "ST", ovr: 94, flag: "🇳🇴", club: "City", exclusive: true },
    { id: "x-vandijk", name: "Ван Дейк", en: "Van Dijk", pos: "CB", ovr: 88, flag: "🇳🇱", club: "Liverpool", exclusive: true },
    { id: "x-r9", name: "Роналдо Феномен", en: "Ronaldo Fenomeno", pos: "ST", ovr: 96, flag: "🇧🇷", club: "Бразилия", exclusive: true },
    { id: "x-dembele", name: "Дембеле", en: "Dembélé", pos: "RW", ovr: 93, flag: "🇫🇷", club: "PSG", exclusive: true },
    { id: "x-olise", name: "Майкл Олисе", en: "Michael Olise", pos: "RW", ovr: 90, flag: "🇫🇷", club: "Bayern", exclusive: true }
];
const DAY_MS = 24 * 60 * 60 * 1000;
const DRAFTS = [
    { id: "duo", title: "dropLinkT", text: "dropLink", reward: ["x-messi", "x-modric"], tone: "dusk" },
    { id: "ucl", title: "dropUclT", text: "dropUcl", reward: ["x-cr7", "x-bellingham", "x-diomande"], tone: "rainbow", ms: 4 * DAY_MS },
    { id: "ballon", title: "dropBallonT", text: "dropBallon", only: "liveOnlyBallon", reward: ["x-r9", "x-cr7", "x-haaland", "x-dembele", "x-mbappe", "x-olise"], tone: "ballon", ms: 14 * DAY_MS },
    { id: "serie", title: "dropSerieT", text: "dropSerie", reward: ["x-lautaro", "x-barella"], tone: "serie" },
    { id: "liga", title: "dropLigaT", text: "dropLiga", reward: ["x-yamal", "x-pedri", "x-raphinha"], tone: "liga" }
];
const DRAFT_XI = ["GK", "LB", "CB", "CB", "RB", "CM", "CAM", "CM", "LW", "ST", "RW"];
const DRAFT_LINE_IX = [[8, 9, 10], [5, 6, 7], [1, 2, 3, 4], [0]];
const DROP_MS = 5 * 24 * 60 * 60 * 1000;
const DROP_START = Date.UTC(2026, 9, 14);
const CLOCK_KEY = "fc-clock";

function poolARate() {
    try {
        const raw = localStorage.getItem("fc-pool-a");
        if (raw == null || raw === "") return 0.06;
        const n = Number(raw);
        if (n >= 0 && n <= 100) return n / 100;
    } catch (e) {}
    return 0.06;
}

function gameNow() {
    let extra = 0;
    try { extra = Number(localStorage.getItem(CLOCK_KEY)) || 0; } catch (e) {}
    return Date.now() + extra;
}

function shiftClock(ms) {
    let extra = 0;
    try { extra = Number(localStorage.getItem(CLOCK_KEY)) || 0; } catch (e) {}
    try { localStorage.setItem(CLOCK_KEY, String(extra + ms)); } catch (e) {}
}

function exclusiveById(id) {
    return EXCLUSIVES.find(function (row) { return row.id === id; }) || null;
}

function dropLength(drop) {
    return (drop && drop.ms) || DROP_MS;
}

function dropCycle() {
    return DRAFTS.reduce(function (sum, drop) { return sum + dropLength(drop); }, 0) || DROP_MS;
}

function dropNow() {
    const gone = Math.max(0, gameNow() - DROP_START);
    const cycle = dropCycle();
    const loop = Math.floor(gone / cycle);
    let rest = gone % cycle;
    for (let i = 0; i < DRAFTS.length; i++) {
        const len = dropLength(DRAFTS[i]);
        if (rest < len) {
            const left = len - rest;
            return {
                drop: DRAFTS[i],
                n: loop * DRAFTS.length + i,
                days: Math.max(1, Math.ceil(left / 86400000)),
                left: left
            };
        }
        rest -= len;
    }
    return { drop: DRAFTS[0], n: loop * DRAFTS.length, days: 1, left: dropLength(DRAFTS[0]) };
}

const PITY_A = 25;
const PITY_B = 10;
const DRAFT_SPIN_COST = 100;
const PHASE_PAY = { A: 8, B: 3, C: 1 };

function ensureDraft() {
    if (!player) return;
    if (typeof player.draftTokens !== "number") player.draftTokens = 0;
    if (typeof player.draftNote !== "string") player.draftNote = "";
    if (!Array.isArray(player.exclusives)) player.exclusives = [];
    if (!player.draftMark) player.draftMark = "";
    if (typeof player.draftPityA !== "number") player.draftPityA = PITY_A;
    if (typeof player.draftPityB !== "number") player.draftPityB = PITY_B;
    if (typeof player.phaseTokens !== "number") player.phaseTokens = 0;
    if (!Array.isArray(player.draftBag)) player.draftBag = [];
    if (player.draftOffer && !Array.isArray(player.draftOffer.ids)) player.draftOffer = null;
    if (player.draftRun) {
        player.draftTokens += 1;
        player.draftRun = null;
        save();
    }
}

function syncDraftWindow() {
    if (!player || !player.name) return;
    ensureDraft();
    const now = dropNow();
    const mark = now.drop.id + ":" + now.n;
    if (player.draftMark === mark) return;
    player.draftMark = mark;
    player.draftTokens += 1;
    addLog(t("logDraft", { name: t(now.drop.title) }));
    save();
}

function updateDrop() {
    const card = get("dropCard");
    if (card) card.hidden = true;
    const club = !!(player && player.name && isClub());
    if (!club) {
        closeDraft();
        paintLive();
        return;
    }
    syncDraftWindow();
    paintLive();
}

function draftBag(pos) {
    if (pos === "GK") return ["GK"];
    if (pos === "LB") return ["LB"];
    if (pos === "RB") return ["RB"];
    if (pos === "CB") return ["CB"];
    if (pos === "CAM") return ["CAM"];
    if (pos === "LW") return ["LW"];
    if (pos === "RW") return ["RW"];
    if (pos === "ST") return ["ST"];
    return ["CM", "CDM"];
}

function shuffleIds(list) {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = copy[i];
        copy[i] = copy[j];
        copy[j] = tmp;
    }
    return copy;
}

function draftPool(round, picked, run) {
    const pos = DRAFT_XI[round];
    const bag = draftBag(pos);
    const pool = everyStar().filter(function (star) {
        return star.id && bag.indexOf(star.pos) >= 0 && picked.indexOf(star.id) < 0;
    });
    const ids = shuffleIds(pool).slice(0, 5).map(function (star) { return star.id; });
    const draft = DRAFTS.find(function (row) { return row.id === (run && run.id); }) || dropNow().drop;
    if (!run.shownEx) run.shownEx = [];
    const ex = (draft.reward || []).map(exclusiveById).find(function (row) {
        return row && row.pos === pos && run.shownEx.indexOf(row.id) < 0 && picked.indexOf(row.id) < 0;
    });
    if (ex && ids.length) {
        ids[Math.floor(Math.random() * ids.length)] = ex.id;
        run.shownEx.push(ex.id);
    }
    return ids;
}

function wcId(src) {
    return "wc-" + String(src && src.wc || 0) + "-" + String(src && src.name || "").replace(/\s+/g, "");
}

function wcById(id) {
    if (!id || String(id).indexOf("wc-") !== 0 || typeof WC_STARS === "undefined") return null;
    const hit = WC_STARS.find(function (star) { return wcId(star) === id; });
    if (!hit) return null;
    const row = copyStar(hit);
    row.id = id;
    return row;
}

function starCard(id) {
    const home = player && Array.isArray(player.startXI)
        ? player.startXI.find(function (star) { return star.id === id; })
        : null;
    return home || exclusiveById(id) || TRANSFER_STARS.find(function (star) { return star.id === id; }) || everyStar().find(function (star) { return star.id === id; }) || wcById(id) || null;
}

function futTier(star) {
    if (!star) return "gold";
    if (star.exclusive) return "exclusive";
    if ((star.ovr || 0) >= 90) return "special";
    if ((star.ovr || 0) >= 83) return "gold";
    if ((star.ovr || 0) >= 75) return "silver";
    return "bronze";
}

function liveReward(id) {
    return (dropNow().drop.reward || []).indexOf(id) >= 0;
}

function paintExclusiveCards(box) {
    if (!box) return;
    box.innerHTML = "";
    (dropNow().drop.reward || []).forEach(function (id) {
        const star = exclusiveById(id);
        if (!star) return;
        const card = document.createElement("div");
        card.className = "live-card tone-" + (dropNow().drop.tone || "dusk");
        const ovr = document.createElement("b");
        ovr.textContent = String(star.ovr);
        const name = document.createElement("span");
        name.textContent = (star.flag ? star.flag + " " : "") + (shown(star) || star.name || "");
        const pos = document.createElement("small");
        pos.textContent = star.pos || "";
        card.appendChild(ovr);
        card.appendChild(name);
        card.appendChild(pos);
        box.appendChild(card);
    });
}

function liveClock() {
    const sec = Math.max(0, Math.ceil(dropNow().left / 1000));
    const d = Math.floor(sec / 86400);
    const h = Math.floor((sec % 86400) / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    const pad = function (n) { return (n < 10 ? "0" : "") + n; };
    return t("liveClock", { d: d, h: pad(h), m: pad(m), s: pad(s) });
}

let liveMark = "";
function paintLive() {
    const bar = get("liveUpd");
    const club = !!(player && player.name && isClub());
    const now = dropNow();
    if (bar) bar.hidden = !club;
    if (!club) return;
    const title = get("liveTitle");
    const text = get("liveText");
    const left = get("liveLeft");
    const kicker = get("liveKicker");
    if (kicker) kicker.textContent = t("liveKicker");
    if (title) title.textContent = t(now.drop.title);
    if (text) text.textContent = t(now.drop.text);
    if (left) left.textContent = liveClock();
    const only = get("liveOnly");
    if (only) only.textContent = t(now.drop.only || (now.drop.tone === "rainbow" ? "liveOnlyLong" : "liveOnly"));
    const next = get("liveNext");
    if (next) next.textContent = t("dropNext", { n: now.days, t: player && player.name ? player.draftTokens : 0 });
    const open = get("liveDraft");
    if (open) open.hidden = false;
    if (bar) bar.className = "live-upd tone-" + (now.drop.tone || "dusk");
    paintExclusiveCards(get("liveCards"));
    const mark = now.drop.id + ":" + now.n;
    const flipped = liveMark && liveMark !== mark;
    liveMark = mark;
    if (flipped) updateDrop();
}

function openDraft() {
    const box = get("draftOverlay");
    if (!box || !player || !player.name || !isClub()) return;
    box.hidden = false;
    renderDraft();
}

function closeDraft() {
    const box = get("draftOverlay");
    if (box) box.hidden = true;
}

function taleKind() {
    if (player && player.coach) return "coach";
    return isClub() ? "club" : "player";
}

function ensureTale() {
    if (!player) return;
    const kind = taleKind();
    if (!player.tale || typeof player.tale.step !== "number") {
        player.tale = { step: 0, tone: "", end: "", kind: kind };
    }
    if (player.coach && player.tale.kind !== "coach") {
        player.tale = { step: 0, tone: "", end: "", kind: "coach" };
        return;
    }
    if (!player.tale.kind) {
        if (kind === "club") player.tale = { step: 0, tone: "", end: "", kind: "club" };
        else player.tale.kind = "player";
    }
}

function coachTaleBeats() {
    const tone = (player.tale && player.tale.tone) || "straight";
    return [
        {
            id: "room",
            title: "k1t",
            text: function () { return t("k1", { club: ui(player.name) }); },
            ready: function () { return true; },
            picks: [
                { id: "a", label: "k1a", log: "k1alog", fame: 2, tone: "straight" },
                { id: "b", label: "k1b", log: "k1blog", fame: 1, tone: "soft" },
                { id: "c", label: "k1c", log: "k1clog", fame: 1, tone: "kids" },
                { id: "d", label: "k1d", log: "k1dlog", fame: -1, tone: "quiet" }
            ]
        },
        {
            id: "press",
            title: "k2t",
            text: function () { return t("k2" + tone); },
            ready: function () { return (player.matches || 0) >= 1; },
            picks: [
                { id: "a", label: "k2a", log: "k2alog", fame: 1 },
                { id: "b", label: "k2b", log: "k2blog", fame: 2 },
                { id: "c", label: "k2c", log: "k2clog", cash: 40 },
                { id: "d", label: "k2d", log: "k2dlog", fame: -1 }
            ]
        },
        {
            id: "board",
            title: "k3t",
            text: function () { return t("k3" + tone); },
            ready: function () { return (player.week || 1) >= 6; },
            picks: [
                { id: "a", label: "k3a", log: "k3alog", fame: 2 },
                { id: "b", label: "k3b", log: "k3blog", cash: 60 },
                { id: "c", label: "k3c", log: "k3clog", fame: 1 },
                { id: "d", label: "k3d", log: "k3dlog", fame: -1 }
            ]
        },
        {
            id: "derby",
            title: "k4t",
            text: function () { return t("k4" + tone); },
            ready: function () { return (player.matches || 0) >= 3 && (player.week || 1) >= 8; },
            picks: [
                { id: "a", label: "k4a", log: "k4alog", fame: 2 },
                { id: "b", label: "k4b", log: "k4blog", fame: 1 },
                { id: "c", label: "k4c", log: "k4clog", cash: 30 },
                { id: "d", label: "k4d", log: "k4dlog", fame: -1 }
            ]
        },
        {
            id: "call",
            title: "k5t",
            text: function () { return t("k5" + tone, { club: ui(player.name) }); },
            ready: function () { return (player.week || 1) >= 14; },
            picks: [
                { id: "a", label: "k5a", log: "k5alog", fame: 1 },
                { id: "b", label: "k5b", log: "k5blog", fame: 2 },
                { id: "c", label: "k5c", log: "k5clog", cash: 40 },
                { id: "d", label: "k5d", log: "k5dlog", fame: -1 }
            ]
        },
        {
            id: "close",
            title: "k6t",
            text: function () { return t("k6" + tone); },
            ready: function () { return (player.week || 1) >= 22; },
            picks: [
                { id: "a", label: "k6a", log: "k6alog", fame: 2, end: "stay" },
                { id: "b", label: "k6b", log: "k6blog", fame: 1, end: "step" },
                { id: "c", label: "k6c", log: "k6clog", cash: 50, end: "bench" },
                { id: "d", label: "k6d", log: "k6dlog", fame: -1, end: "door" }
            ]
        }
    ];
}

function clubTaleBeats() {
    return [
        {
            id: "gate",
            title: "c1t",
            text: function () { return t("c1"); },
            ready: function () { return true; },
            picks: [
                { id: "a", label: "c1a", log: "c1alog", fame: 2, tone: "crowd" },
                { id: "b", label: "c1b", log: "c1blog", fame: -1, cash: 100, tone: "cash" },
                { id: "c", label: "c1c", log: "c1clog", fame: 1, tone: "yard" },
                { id: "d", label: "c1d", log: "c1dlog", fame: 3, cash: -40, tone: "wreck" }
            ]
        },
        {
            id: "column",
            title: "c2t",
            text: function () { return t("c2" + ((player.tale && player.tale.tone) || "crowd")); },
            ready: function () { return (player.matches || 0) >= 1; },
            picks: [
                { id: "a", label: "c2a", log: "c2alog", fame: 1, cash: 80 },
                { id: "b", label: "c2b", log: "c2blog", fame: 2, cash: -20 },
                { id: "c", label: "c2c", log: "c2clog", fame: 1, cash: 30 },
                { id: "d", label: "c2d", log: "c2dlog", fame: 1 }
            ]
        },
        {
            id: "plan",
            title: "c3t",
            text: function () { return t("c3" + ((player.tale && player.tale.tone) || "crowd")); },
            ready: function () { return (player.week || 1) >= 6; },
            picks: [
                { id: "a", label: "c3a", log: "c3alog", fame: 2, stad: 1, end: "bowl" },
                { id: "b", label: "c3b", log: "c3blog", fame: 2, cash: 40, end: "home" },
                { id: "c", label: "c3c", log: "c3clog", cash: 100, end: "school" },
                { id: "d", label: "c3d", log: "c3dlog", fame: -1, cash: 20, end: "shut" }
            ]
        },
        {
            id: "derby",
            title: "c4t",
            text: function () { return t("c4" + ((player.tale && player.tale.tone) || "crowd")); },
            ready: function () { return (player.matches || 0) >= 3 && (player.week || 1) >= 8; },
            picks: [
                { id: "a", label: "c4a", log: "c4alog", fame: 2 },
                { id: "b", label: "c4b", log: "c4blog", cash: 60 },
                { id: "c", label: "c4c", log: "c4clog", fame: 1 },
                { id: "d", label: "c4d", log: "c4dlog", fame: -1 }
            ]
        },
        {
            id: "office",
            title: "c5t",
            text: function () { return t("c5" + ((player.tale && player.tale.tone) || "crowd")); },
            ready: function () { return (player.week || 1) >= 14; },
            picks: [
                { id: "a", label: "c5a", log: "c5alog", fame: 2, cash: 40 },
                { id: "b", label: "c5b", log: "c5blog", cash: 120, fame: -1 },
                { id: "c", label: "c5c", log: "c5clog", fame: 1 },
                { id: "d", label: "c5d", log: "c5dlog", fame: 1 }
            ]
        },
        {
            id: "season",
            title: "c6t",
            text: function () { return t("c6" + ((player.tale && player.tale.tone) || "crowd")); },
            ready: function () { return (player.week || 1) >= 22; },
            picks: [
                { id: "a", label: "c6a", log: "c6alog", fame: 2, end: "people" },
                { id: "b", label: "c6b", log: "c6blog", cash: 80, end: "money" },
                { id: "c", label: "c6c", log: "c6clog", fame: 1, end: "ground" },
                { id: "d", label: "c6d", log: "c6dlog", fame: 1, end: "open" }
            ]
        }
    ];
}

function taleBeats() {
    if (player && player.coach) return coachTaleBeats();
    if (isClub()) return clubTaleBeats();
    return [
        {
            id: "arrive",
            title: "tale1t",
            text: function () { return t("tale1"); },
            ready: function () { return true; },
            picks: [
                { id: "a", label: "tale1a", log: "tale1alog", fame: 2, stat: "passing", tone: "team" },
                { id: "b", label: "tale1b", log: "tale1blog", fame: -1, stat: "shooting", cash: 80, tone: "star" },
                { id: "c", label: "tale1c", log: "tale1clog", fame: 1, stat: "defending", tone: "quiet" },
                { id: "d", label: "tale1d", log: "tale1dlog", fame: 3, cash: -20, stat: "physical", tone: "loud" }
            ]
        },
        {
            id: "column",
            title: "tale2t",
            text: function () { return t(player.tale.tone === "star" || player.tale.tone === "loud" ? "tale2star" : "tale2team"); },
            ready: function () { return (player.matches || 0) >= 1; },
            picks: [
                { id: "a", label: "tale2a", log: "tale2alog", fame: 1, cash: 60 },
                { id: "b", label: "tale2b", log: "tale2blog", fame: 3, cash: -30 },
                { id: "c", label: "tale2c", log: "tale2clog", fame: 2, cash: 20 },
                { id: "d", label: "tale2d", log: "tale2dlog", stat: "pace" }
            ]
        },
        {
            id: "mic",
            title: "tale3t",
            text: function () { return t("tale3" + ((player.tale && player.tale.tone) || "team")); },
            ready: function () { return (player.week || 1) >= 6; },
            picks: [
                { id: "a", label: "tale3a", log: "tale3alog", fame: 2, cash: 150, end: "a" },
                { id: "b", label: "tale3b", log: "tale3blog", fame: 1, stat: "physical", statN: 2, end: "b" },
                { id: "c", label: "tale3c", log: "tale3clog", fame: 2, stat: "passing", cash: 40, end: "c" },
                { id: "d", label: "tale3d", log: "tale3dlog", fame: -1, stat: "shooting", cash: 30, end: "d" }
            ]
        },
        {
            id: "derby",
            title: "tale4t",
            text: function () { return t("tale4" + ((player.tale && player.tale.tone) || "team")); },
            ready: function () { return (player.matches || 0) >= 3 && (player.week || 1) >= 8; },
            picks: [
                { id: "a", label: "tale4a", log: "tale4alog", fame: 1, stat: "physical" },
                { id: "b", label: "tale4b", log: "tale4blog", fame: 2, cash: 40 },
                { id: "c", label: "tale4c", log: "tale4clog", stat: "passing" },
                { id: "d", label: "tale4d", log: "tale4dlog", fame: -1 }
            ]
        },
        {
            id: "agent",
            title: "tale5t",
            text: function () { return t("tale5" + ((player.tale && player.tale.tone) || "team")); },
            ready: function () { return (player.week || 1) >= 14; },
            picks: [
                { id: "a", label: "tale5a", log: "tale5alog", fame: 1 },
                { id: "b", label: "tale5b", log: "tale5blog", fame: 2, cash: 50 },
                { id: "c", label: "tale5c", log: "tale5clog", stat: "vision" },
                { id: "d", label: "tale5d", log: "tale5dlog", fame: 1, cash: -15 }
            ]
        },
        {
            id: "letter",
            title: "tale6t",
            text: function () { return t("tale6" + ((player.tale && player.tale.tone) || "team")); },
            ready: function () { return (player.week || 1) >= 22; },
            picks: [
                { id: "a", label: "tale6a", log: "tale6alog", fame: 2, end: "stay" },
                { id: "b", label: "tale6b", log: "tale6blog", fame: 1, cash: 70, end: "exit" },
                { id: "c", label: "tale6c", log: "tale6clog", stat: "stamina", end: "bus" },
                { id: "d", label: "tale6d", log: "tale6dlog", fame: -1, end: "ink" }
            ]
        }
    ];
}

function currentTale() {
    ensureTale();
    const beats = taleBeats();
    const beat = beats[player.tale.step];
    if (!beat || !beat.ready()) return null;
    return beat;
}

function taleStat(key, n) {
    if (!player.stats) return;
    if (typeof player.stats[key] !== "number") {
        const keys = statKeys();
        key = keys[0];
    }
    if (typeof player.stats[key] !== "number") return;
    player.stats[key] = Math.min(99, player.stats[key] + (n || 1));
}

let taleAuto = "";

function closeTale() {
    const box = get("taleOverlay");
    if (box) box.hidden = true;
}

function openTale() {
    const beat = currentTale();
    const box = get("taleOverlay");
    if (!beat || !box) return;
    const kicker = get("taleKicker");
    const title = get("taleTitle");
    const text = get("taleText");
    const acts = get("taleActs");
    const later = get("taleLater");
    if (kicker) kicker.textContent = t("taleKicker");
    if (title) title.textContent = t(beat.title);
    if (text) text.textContent = beat.text();
    if (acts) {
        acts.textContent = "";
        (beat.picks || []).forEach(function (pick) {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.setAttribute("data-pick", pick.id);
            btn.textContent = t(pick.label);
            acts.appendChild(btn);
        });
    }
    if (later) later.textContent = t("taleLater");
    taleAuto = beat.id;
    box.hidden = false;
}

function pickTale(side) {
    const beat = currentTale();
    const pick = beat.picks && beat.picks.find(function (row) { return row.id === side; });
    if (!pick) return;
    if (pick.cash) player.respect = Math.max(0, (player.respect || 0) + pick.cash);
    if (pick.fame) addFame(pick.fame);
    if (pick.stat) taleStat(pick.stat, pick.statN || 1);
    if (pick.tone) player.tale.tone = pick.tone;
    if (pick.end) player.tale.end = pick.end;
    if (pick.stad) {
        ensureStadium();
        player.stadium.level = Math.min(STADIUM.length - 1, player.stadium.level + pick.stad);
        paintStadium();
    }
    player.tale.step += 1;
    addLog(t(pick.log));
    closeTale();
    save();
    updateRespect();
    updateFame();
    updateStats();
    paintTale();
    Sfx.ding();
}

function paintTale() {
    const card = get("taleCard");
    if (!card) return;
    const on = !!(player && player.name);
    card.hidden = !on;
    if (!on) return;
    ensureTale();
    const beat = currentTale();
    const open = get("taleOpen");
    const title = get("taleCardTitle");
    const text = get("taleCardText");
    if (beat) {
        if (title) title.textContent = t(beat.title);
        if (text) text.textContent = beat.text();
        if (open) {
            open.hidden = false;
            open.textContent = t(player.coach ? "kOpen" : (isClub() ? "cOpen" : "taleOpen"));
        }
    } else {
        if (open) open.hidden = true;
        const coach = !!player.coach;
        if (player.tale.step >= taleBeats().length) {
            const tone = player.tale.tone || (coach ? "straight" : (isClub() ? "crowd" : "team"));
            const end = player.tale.end || "";
            const head = (coach ? "kEnd_" : (isClub() ? "cEnd_" : "pEnd_")) + tone;
            const tail = (coach ? "kClose_" : (isClub() ? "cClose_" : "pClose_")) + end;
            if (title) title.textContent = end ? t((coach ? "kEndT_" : (isClub() ? "cEndT_" : "pEndT_")) + tone) : t("taleEndT");
            if (text) text.textContent = end ? (t(head) + " " + t(tail)) : t("taleEnd");
        } else {
            if (title) title.textContent = t(coach ? "kWho" : (isClub() ? "cWho" : "taleWho"));
            if (text) text.textContent = t((player.matches || 0) < 1
                ? (coach ? "kWait" : (isClub() ? "cWait" : "taleWait"))
                : (coach ? "kWaitLate" : (isClub() ? "cWaitLate" : "taleWaitLate")));
        }
    }
    const box = get("taleOverlay");
    if (box && !box.hidden) openTale();
}

function maybeTale() {
    const screen = get("careerScreen");
    if (!screen || screen.style.display === "none") return;
    const beat = currentTale();
    if (!beat || taleAuto === beat.id) return;
    const box = get("taleOverlay");
    if (!box || !box.hidden) return;
    const draft = get("draftOverlay");
    if (draft && !draft.hidden) return;
    openTale();
}

function personKey(star) {
    const raw = String((star && (star.en || star.name)) || "").toLowerCase();
    const plain = raw.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const bits = plain.split(/[^a-z]+/).filter(Boolean);
    if (bits.length >= 2 && (bits[bits.length - 2] === "van" || bits[bits.length - 2] === "de")) {
        return bits[bits.length - 2] + bits[bits.length - 1];
    }
    return bits.length ? bits[bits.length - 1] : "";
}

function draftPools() {
    const blocked = {};
    (dropNow().drop.reward || []).forEach(function (id) {
        const ex = exclusiveById(id);
        const key = personKey(ex);
        if (key) blocked[key] = true;
    });
    const stars = everyStar().filter(function (star) {
        if (!star || !star.id || star.dead || star.exclusive) return false;
        const key = personKey(star);
        return !key || !blocked[key];
    });
    const pools = {
        A: stars.filter(function (star) { return (star.ovr || 0) >= 90; }),
        B: stars.filter(function (star) { return (star.ovr || 0) >= 83 && (star.ovr || 0) < 90; }),
        C: stars.filter(function (star) { return (star.ovr || 0) >= 74 && (star.ovr || 0) < 83; })
    };
    (dropNow().drop.reward || []).forEach(function (id) {
        const ex = exclusiveById(id);
        if (ex && !pools.A.some(function (star) { return star.id === ex.id; })) pools.A.push(ex);
    });
    return pools;
}

function keepStar(star) {
    if (!star) return;
    if (star.exclusive) grantExclusive([star.id]);
    else if (!isFriend(star.id)) addFriend(star);
}

function spinDraft() {
    ensureDraft();
    if (!isClub()) return;
    if (player.draftOffer) return;
    if (player.draftTokens < 1) {
        player.draftNote = t("draftNeed", { n: dropNow().days });
        renderDraft();
        return;
    }
    if ((player.respect || 0) < DRAFT_SPIN_COST) {
        player.draftNote = t("draftCostNeed", { n: money(DRAFT_SPIN_COST) });
        renderDraft();
        return;
    }
    const pools = draftPools();
    const pityA = player.draftPityA - 1;
    const pityB = player.draftPityB - 1;
    const roll = Math.random();
    let pool = "C";
    if (pityA <= 0 || roll < poolARate()) pool = "A";
    else if (pityB <= 0 || roll < 0.28) pool = "B";
    if (!pools[pool].length) pool = pools.B.length ? "B" : "C";
    const ready = (pools[pool] || []).filter(function (row) { return row && row.id && row.name && row.ovr; });
    if (!ready.length) {
        player.draftNote = t("draftNeed", { n: dropNow().days });
        renderDraft();
        return;
    }
    player.draftTokens -= 1;
    player.draftPityA = pool === "A" ? PITY_A : pityA;
    player.draftPityB = pool === "A" || pool === "B" ? PITY_B : pityB;
    player.respect = (player.respect || 0) - DRAFT_SPIN_COST;
    const star = ready[Math.floor(Math.random() * ready.length)];
    player.draftBag.unshift({ uid: Date.now() + "-" + Math.floor(Math.random() * 999), id: star.id, pool: pool });
    if (player.draftBag.length > 12) player.draftBag.length = 12;
    player.draftLast = {
        id: star.id,
        pool: pool,
        name: star.name,
        en: star.en || "",
        ovr: star.ovr,
        pos: star.pos || "",
        flag: star.flag || "",
        club: star.club || star.home || ""
    };
    keepStar(star);
    grantSquad(star);
    player.draftNote = t("draftGot", { pool: pool, name: shown(star) });
    addLog(player.draftNote);
    showPull(player.draftLast);
    updateSquad();
    updateRespect();
    save();
    updateDrop();
    renderDraft();
}

function exchangeBag(uid) {
    ensureDraft();
    const item = player.draftBag.find(function (row) { return row.uid === uid; });
    if (!item) return;
    const pay = PHASE_PAY[item.pool] || 1;
    player.phaseTokens += pay;
    player.draftBag = player.draftBag.filter(function (row) { return row.uid !== uid; });
    player.draftNote = t("draftSold", { n: pay });
    save();
    renderDraft();
}

function openPick(count, cost, poolKey) {
    ensureDraft();
    if (player.draftOffer) return;
    if (player.phaseTokens < cost) {
        player.draftNote = t("pickPoor");
        renderDraft();
        return;
    }
    const pools = draftPools();
    const list = pools[poolKey] && pools[poolKey].length ? pools[poolKey] : pools.C;
    const ids = shuffleIds(list).slice(0, count).map(function (star) { return star.id; });
    if (count === 3) {
        const ex = (dropNow().drop.reward || []).map(exclusiveById).find(function (row) {
            return row && player.exclusives.indexOf(row.id) < 0;
        });
        if (ex) ids[0] = ex.id;
    }
    player.phaseTokens -= cost;
    player.draftOffer = { ids: ids.filter(Boolean) };
    save();
    renderDraft();
}

function takeOffer(id) {
    ensureDraft();
    if (!player.draftOffer || player.draftOffer.ids.indexOf(id) < 0) return;
    const star = starCard(id);
    if (star && star.exclusive && !liveReward(star.id)) {
        player.draftOffer = null;
        player.draftNote = t("liveGone");
        save();
        renderDraft();
        return;
    }
    keepStar(star);
    player.draftOffer = null;
    player.draftNote = star ? t("draftGot", { pool: star.exclusive ? "A" : "B", name: shown(star) }) : "";
    if (player.draftNote) addLog(player.draftNote);
    save();
    renderDraft();
}

function grantExclusive(ids) {
    ensureDraft();
    for (let i = 0; i < ids.length; i++) {
        const ex = exclusiveById(ids[i]);
        if (!ex || player.exclusives.indexOf(ex.id) >= 0) continue;
        player.exclusives.push(ex.id);
        addFriend(ex);
        const row = player.socFriends.find(function (friend) { return friend.id === ex.id; });
        if (row) {
            row.exclusive = true;
            row.en = ex.en;
            row.ovr = ex.ovr;
            row.club = ex.club;
        }
        return ex;
    }
    return null;
}

function pullFace(last) {
    if (!last) return null;
    const live = last.id ? starCard(last.id) : null;
    const name = (live && live.name) || last.name || "";
    const ovr = (live && live.ovr) || last.ovr || 0;
    if (!name || !ovr) return null;
    const row = live || last;
    return {
        name: shown(row) || name,
        ovr: ovr,
        pos: (live && live.pos) || last.pos || "",
        flag: (live && live.flag) || last.flag || "",
        club: (live && (live.club || live.home)) || last.club || "",
        pool: last.pool || ""
    };
}

function clubTitle(club) {
    const ru = {
        "City": "Манчестер Сити", "Real Madrid": "Реал Мадрид", "Liverpool": "Ливерпуль",
        "Bayern": "Бавария", "Barcelona": "Барселона", "Milan": "Милан", "Интер": "Интер",
        "Inter Miami": "Интер Майами", "Al-Nassr": "Аль-Наср", "Chelsea": "Челси"
    };
    const en = {
        "City": "Manchester City", "Real Madrid": "Real Madrid", "Liverpool": "Liverpool",
        "Bayern": "Bayern", "Barcelona": "Barcelona", "Milan": "Milan", "Интер": "Inter",
        "Inter Miami": "Inter Miami", "Al-Nassr": "Al-Nassr", "Chelsea": "Chelsea"
    };
    if (!club) return "";
    const table = langEn() ? en : ru;
    return table[club] || club;
}

let pullTimer = 0;
function clearPullTimer() {
    if (pullTimer) {
        clearTimeout(pullTimer);
        pullTimer = 0;
    }
}

function showPull(last) {
    const face = pullFace(last);
    const box = get("pullReveal");
    if (!box || !face) return;
    clearPullTimer();
    const kicker = get("pullKicker");
    const pool = get("pullPool");
    const ovr = get("pullOvr");
    const name = get("pullName");
    const meta = get("pullMeta");
    if (kicker) kicker.textContent = t("draftDrop");
    if (pool) pool.textContent = "Пул " + face.pool;
    if (ovr) ovr.textContent = String(face.ovr);
    if (name) name.textContent = (face.flag ? face.flag + " " : "") + face.name;
    if (meta) meta.textContent = face.pos + (face.club ? " · " + clubTitle(face.club) : "");
    const card = box.querySelector(".pull-card");
    const intro = get("pullIntro");
    const introText = get("pullIntroText");
    if (card) {
        const tone = last && last.id && liveReward(last.id) ? (dropNow().drop.tone || "dusk") : "";
        card.className = "pull-card" + (tone ? " tone-" + tone : "");
    }
    if (face.pool !== "A" || !intro || !introText) {
        if (intro) intro.hidden = true;
        if (card) card.hidden = false;
        box.hidden = false;
        return;
    }
    const steps = [
        { ms: 2000, kind: "pos", text: face.pos || "" },
        { ms: 2000, kind: "flag", text: face.flag || "" },
        { ms: 2000, kind: "club", text: clubTitle(face.club) },
        { ms: 1000, kind: "black", text: "" }
    ];
    if (card) card.hidden = true;
    intro.hidden = false;
    box.hidden = false;
    Sfx.unlock();
    if (Sfx.poolA) Sfx.poolA();
    let step = 0;
    function frame() {
        const beat = steps[step];
        intro.className = "pull-intro" + (beat.kind === "black" ? " black" : "");
        introText.className = beat.kind;
        introText.textContent = beat.text;
        step += 1;
        pullTimer = setTimeout(function () {
            pullTimer = 0;
            if (step < steps.length) frame();
            else {
                intro.hidden = true;
                if (card) card.hidden = false;
            }
        }, beat.ms);
    }
    frame();
}

function hidePull() {
    clearPullTimer();
    const box = get("pullReveal");
    const intro = get("pullIntro");
    if (intro) intro.hidden = true;
    if (box) box.hidden = true;
}

function futButton(star, onPick) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "fut-card " + futTier(star);
    const ovr = document.createElement("span");
    ovr.className = "fut-ovr";
    ovr.textContent = String(star.ovr || 0);
    const pos = document.createElement("span");
    pos.className = "fut-pos";
    pos.textContent = star.pos || "";
    const name = document.createElement("b");
    name.textContent = shown(star);
    const meta = document.createElement("small");
    meta.textContent = (star.flag || "") + " " + (star.club || "");
    btn.appendChild(ovr);
    btn.appendChild(pos);
    btn.appendChild(name);
    btn.appendChild(meta);
    btn.addEventListener("click", function () { Sfx.click(); onPick(); });
    return btn;
}

let draftShowPools = false;

function poolLine(label, pity) {
    const row = document.createElement("p");
    row.className = "pool-row";
    const name = document.createElement("b");
    name.textContent = label;
    row.appendChild(name);
    if (pity) {
        const left = document.createElement("span");
        left.textContent = pity;
        row.appendChild(left);
    }
    return row;
}

function renderDraft() {
    ensureDraft();
    const now = dropNow();
    const pools = draftPools();
    const kicker = get("draftKicker");
    const title = get("draftTitle");
    const hint = get("draftHint");
    const picks = get("draftPicks");
    if (kicker) kicker.textContent = t("dropKicker");
    if (title) title.textContent = t(now.drop.title);
    if (hint) hint.textContent = player.draftNote || t(now.drop.text);
    if (!picks) return;
    picks.textContent = "";
    const face = pullFace(player.draftLast);
    if (!face) player.draftLast = null;
    if (face && !player.draftOffer) {
        const reveal = document.createElement("div");
        reveal.className = "drop-reveal";
        const k = document.createElement("p");
        k.className = "k";
        k.textContent = t("draftDrop");
        const who = document.createElement("p");
        who.className = "drop-who";
        who.textContent = (face.flag ? face.flag + " " : "") + face.name;
        const sub = document.createElement("p");
        sub.className = "drop-sub";
        sub.textContent = "Пул " + face.pool + " · " + face.ovr + " " + face.pos + (face.club ? " · " + face.club : "");
        reveal.appendChild(k);
        reveal.appendChild(who);
        reveal.appendChild(sub);
        picks.appendChild(reveal);
    }
    picks.appendChild(poolLine(t("poolA"), t("pityA", { n: player.draftPityA })));
    picks.appendChild(poolLine(t("poolB"), t("pityB", { n: player.draftPityB })));
    picks.appendChild(poolLine(t("poolC"), t("poolCsub", { n: pools.C.length })));
    if (player.draftOffer) {
        const row = document.createElement("div");
        row.className = "fut-row";
        player.draftOffer.ids.forEach(function (id) {
            const star = starCard(id);
            if (!star) return;
            row.appendChild(futButton(star, function () { takeOffer(id); }));
        });
        picks.appendChild(row);
        return;
    }
    const spin = document.createElement("button");
    spin.type = "button";
    spin.className = "gold";
    spin.textContent = t("draftSpin", { n: money(DRAFT_SPIN_COST) });
    spin.addEventListener("click", function () { Sfx.click(); spinDraft(); });
    picks.appendChild(spin);
    const phase = document.createElement("p");
    phase.className = "hint";
    phase.textContent = t("phaseN", { n: player.phaseTokens });
    picks.appendChild(phase);
    const pick5 = document.createElement("button");
    pick5.type = "button";
    pick5.textContent = t("pick5");
    pick5.addEventListener("click", function () { Sfx.click(); openPick(5, 5, "B"); });
    const pick3 = document.createElement("button");
    pick3.type = "button";
    pick3.textContent = t("pick3");
    pick3.addEventListener("click", function () { Sfx.click(); openPick(3, 12, "A"); });
    picks.appendChild(pick5);
    picks.appendChild(pick3);
    if (player.draftBag.length) {
        const bagTitle = document.createElement("p");
        bagTitle.className = "hint";
        bagTitle.textContent = t("draftBag");
        picks.appendChild(bagTitle);
        player.draftBag.forEach(function (item) {
            const star = starCard(item.id);
            const row = document.createElement("div");
            row.className = "bag-row";
            const name = document.createElement("b");
            name.textContent = (star ? shown(star) : item.id) + " · " + item.pool;
            const sell = document.createElement("button");
            sell.type = "button";
            sell.textContent = t("draftSell", { n: PHASE_PAY[item.pool] || 1 });
            sell.addEventListener("click", function () { Sfx.click(); exchangeBag(item.uid); });
            row.appendChild(name);
            row.appendChild(sell);
            picks.appendChild(row);
        });
    }
    const more = document.createElement("button");
    more.type = "button";
    more.textContent = t("draftMore");
    more.addEventListener("click", function () {
        Sfx.click();
        draftShowPools = !draftShowPools;
        renderDraft();
    });
    picks.appendChild(more);
    if (draftShowPools) {
        ["A", "B", "C"].forEach(function (key) {
            const line = document.createElement("p");
            line.className = "hint";
            line.textContent = key + ": " + pools[key].slice(0, 4).map(shown).join(", ");
            picks.appendChild(line);
        });
    }
}

function updateHook() {
    const bar = get("hookBar");
    const kicker = get("hookKicker");
    const text = get("hookText");
    if (!bar || !player || !player.name) return;
    const due = matchDue();
    const streak = player.streak || 0;
    const wait = weeksUntilMatch();
    if (isInjured()) {
        kicker.textContent = t("ward");
        text.textContent = (player.injury && player.injury.needPay)
            ? t("hookHurtPay")
            : (due ? t("hookHurtDue") : t("hookHurtWait", { label: injuryLabel() }));
        return;
    }
    if (due) {
        kicker.textContent = t("now");
        text.textContent = player.energy < MATCH_COST ? t("hookNowLow") : t("hookNow");
        return;
    }
    if (streak >= 3) {
        kicker.textContent = t("streak") + " ×" + streak;
        text.textContent = t("hookStreakWait", { w: wait, unit: wait === 1 ? t("unit1") : t("unitN") });
        return;
    }
    if (!isClub() && ballonRaceOn()) {
        kicker.textContent = t("ballonKicker");
        text.textContent = t("hookBallon", { n: ballonRank(), year: seasonYear() });
        return;
    }
    if (!isClub() && canPlayWc()) {
        kicker.textContent = t("wcTag");
        text.textContent = t("hookWc", { year: wcYearNow() });
        return;
    }
    if (!isClub() && !player.ntCalled && fameValue() >= 60) {
        kicker.textContent = t("ntHook");
        text.textContent = t("hookNt");
        return;
    }
    kicker.textContent = t("next");
    text.textContent = wait === 1 ? t("hookTomorrow") : t("hookWait", { w: wait });
}

function updatePlanUI() {
    document.querySelectorAll("[data-plan]").forEach(function (btn) {
        btn.classList.toggle("on", btn.getAttribute("data-plan") === matchPlan);
    });
    const hint = get("planHint");
    if (hint) hint.textContent = t("planHint_" + (matchPlan || "balance"));
}

function updateScheduleUI() {
    ensureCalendar();
    const due = matchDue();
    const wait = weeksUntilMatch();
    const opp = nextOppName();
    const box = get("fixtureBox");
    const label = get("fixtureLabel");
    const next = get("fixtureNext");
    const hint = get("fixtureHint");
    const matchBtn = get("matchBtn");
    const dockMatch = get("dockMatch");
    const hurt = isInjured();
    const canPlay = due && !matchBusy && !hurt && player.energy >= MATCH_COST;
    const canSkip = due && !matchBusy && hurt;

    if (box) box.classList.toggle("due", due);
    document.body.classList.toggle("matchday", !!(player && player.name && due && !hurt));
    document.body.classList.toggle("hot", !!(player && (player.streak || 0) >= 3 && !hurt));
    document.body.classList.toggle("injured", !!(player && player.name && hurt));
    if (label) label.textContent = due ? t("matchday") : t("nextMatch");
    if (next) {
        next.textContent = due
            ? "vs " + opp
            : t("weekN") + " " + player.nextMatchWeek + " · vs " + opp;
    }
    if (hint) {
        const unit = wait === 1 ? t("unit1") : t("unitN");
        hint.textContent = hurt
            ? t(isClub() ? "hintClubInj" : "hintInj")
            : (!isClub() && onBench()
                ? t("youBench", { ovr: getOverall(), club: ui(player.club) })
                : (due ? t("hintDue") : t("hintWait", { every: MATCH_EVERY, w: wait, unit: unit })));
    }
    if (matchBtn) {
        const retireBtn = get("retireBtn");
        if (retireBtn) {
            retireBtn.disabled = !!player.retired;
            retireBtn.textContent = player.retired ? t("retiredBtn") : t("retireBtn");
        }
        const coachHome = get("coachHome");
        if (coachHome) coachHome.hidden = !player.retired || isClub();
        if (player.retired) {
            matchBtn.disabled = true;
            matchBtn.textContent = t("retiredBtn");
        } else if (propsDue()) {
            matchBtn.disabled = true;
            matchBtn.textContent = t("propMiss");
        } else if (gearDue()) {
            matchBtn.disabled = true;
            matchBtn.textContent = t("gearBlock");
        } else {
            matchBtn.disabled = !(canPlay || canSkip);
            matchBtn.textContent = hurt && due
                ? (player.injury.emoji + " " + t("skip") + " · " + t("inj_" + (player.injury.id || "bruise")))
                : (due
                    ? (player.energy < MATCH_COST ? t("lowEnergy") : t("playVs") + " " + opp)
                    : t("inWeeks", { w: wait, unit: wait === 1 ? t("unit1u") : t("unitNu") }) + " · vs " + opp);
        }
    }
    if (dockMatch) {
        dockMatch.disabled = player.retired || propsDue() || gearDue() || !(canPlay || canSkip);
        dockMatch.textContent = hurt && due
            ? "🤕 " + t("skipShort")
            : (due
                ? (player.energy < MATCH_COST ? t("energyShort") : t("matchShort"))
                : "📅 " + wait + t("wk"));
    }
    const bribeBtn = get("bribeBtn");
    const fee = bribeCost();
    const dirty = !!(player.coach);
    const purse = dirty ? (player.stolen || 0) : (player.respect || 0);
    const canBribe = canPlay && purse >= fee;
    if (bribeBtn) {
        bribeBtn.disabled = !canBribe;
        bribeBtn.textContent = !due
            ? t("bribeWait")
            : (player.energy < MATCH_COST
                ? t("lowEnergy")
                : (purse < fee
                    ? (dirty ? t("bribeStolenNeed", { pay: money(fee), bag: money(player.stolen || 0) }) : t("need") + " " + money(fee))
                    : (dirty
                        ? t("bribeStolen", { pay: money(fee), bag: money(player.stolen || 0) })
                        : t("bribe") + " · " + money(fee) + " · " + t("bribeFine"))));
    }
    updateGridUI();
    updatePlanUI();
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
        [t("recRep"), rec.fame || 0],
        ["OVR", rec.ovr],
        [t("recGoals"), rec.goals],
        [t("recClub"), ui(rec.club || "—")]
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
        if (typeof player.bank !== "number") player.bank = 0;
        if (typeof player.loan !== "number") player.loan = 0;
        if (!player.bankPlan) player.bankPlan = player.bank > 0 ? "season" : "";
        if (!player.loanPlan) player.loanPlan = "";
        if (!player.dropSeen) player.dropSeen = "";
        if (typeof player.draftTokens !== "number") player.draftTokens = 0;
        if (!Array.isArray(player.exclusives)) player.exclusives = [];
        if (!player.draftMark) player.draftMark = "";
        if (!player.draftRun || typeof player.draftRun !== "object") player.draftRun = null;
        if (typeof player.bankUntil !== "number") player.bankUntil = 0;
        if (typeof player.fame !== "number") player.fame = 50;
        if (typeof player.onlineWins !== "number") player.onlineWins = 0;
        if (typeof player.onlineLosses !== "number") player.onlineLosses = 0;
        if (typeof player.onlineUntil !== "number") player.onlineUntil = 0;
        if (!player.codeMadrid) player.codeMadrid = false;
        if (!player.mode) player.mode = "player";
        if (typeof player.wins !== "number") player.wins = 0;
        if (typeof player.streak !== "number") player.streak = 0;
        if (player.injury && (typeof player.injury.until !== "number" || !player.injury.name)) {
            player.injury = null;
        }
        if (player.injury) {
            player.injury.needPay = false;
            if (player.injury.id === "break" && player.injury.until > player.week + 4) {
                player.injury.until = player.week + 4;
            }
            if (player.week >= player.injury.until) player.injury = null;
        }
        if (player.matchPlan === "attack" || player.matchPlan === "defend") matchPlan = player.matchPlan;
        else {
            matchPlan = "balance";
            player.matchPlan = "balance";
        }
        if (!Array.isArray(player.awards)) player.awards = [];
        if (!Array.isArray(player.titles)) player.titles = [];
        if (player.awards.length && !player.titles.length) {
            player.titles = player.awards.map(function (id) {
                return { id: id, year: 2026 };
            });
        }
        if (typeof player.ballonYear !== "number") player.ballonYear = 0;
        if (!player.ntCalled) player.ntCalled = false;
        if (typeof player.ntCaps !== "number") player.ntCaps = 0;
        if (typeof player.wcCycle !== "number") player.wcCycle = -1;
        if (typeof player.wcWins !== "number") player.wcWins = 0;
        if (!Array.isArray(player.brands)) {
            player.brands = player.brand && player.brand.name ? [player.brand] : [];
        }
        if (!Array.isArray(player.sponsors)) player.sponsors = [];
        player.sponsors = player.sponsors.filter(function (row) { return row && row.id !== "applle"; });
        player.brand = null;
        if (player.loanPlan === "short" || player.loanPlan === "mid" || player.loanPlan === "big") {
            const pledged = ownedBrands().slice().sort(function (a, b) {
                return (brandTypeById(b.type).grade || 0) - (brandTypeById(a.type).grade || 0);
            })[0];
            player.loanPlan = pledged ? pledged.type : "";
        }
        if (typeof player.draws !== "number") player.draws = 0;
        if (typeof player.losses !== "number") player.losses = 0;
        if (typeof player.conceded !== "number") player.conceded = 0;
        if (typeof player.cleanSheets !== "number") player.cleanSheets = 0;
        if (typeof player.tackles !== "number") player.tackles = 0;
        if (player.nation === "UA") player.nation = "KZ";
        if (!Array.isArray(player.posts)) player.posts = [];
        if (typeof player.postCount !== "number") player.postCount = player.posts.length;
        if (typeof player.socSinceMatch !== "number") player.socSinceMatch = 0;
        if (!Array.isArray(player.xiPins)) player.xiPins = [];
        if (!Array.isArray(player.benchPins)) player.benchPins = [];
        if (!Array.isArray(player.socFriends)) player.socFriends = [];
        if (!Array.isArray(player.socSubs)) player.socSubs = [];
        if (player.pulsePlan !== "silver" && player.pulsePlan !== "gold") player.pulsePlan = "noob";
        if (!player.socChat || typeof player.socChat !== "object" || Array.isArray(player.socChat)) player.socChat = {};
        if (!player.socUnread || typeof player.socUnread !== "object" || Array.isArray(player.socUnread)) player.socUnread = {};
        if (!player.socLikes || typeof player.socLikes !== "object" || Array.isArray(player.socLikes)) player.socLikes = {};
        if (!player.socDislikes || typeof player.socDislikes !== "object" || Array.isArray(player.socDislikes)) player.socDislikes = {};
        if (!player.socReplies || typeof player.socReplies !== "object" || Array.isArray(player.socReplies)) player.socReplies = {};
        if (typeof player.fame === "number") player.fame = Math.min(player.fame, fameCap());
        if (!player.nation) player.nation = "KZ";
        if (SKIN_TONES.indexOf(player.skin) < 0) player.skin = "#e7b48a";
        if (player.ntCalled && !player.ntFixtures) seedInternationals();
        if (!player.avatar) {
            player.avatar = player.mode === "club" ? "🏟️" : (AVATARS[player.position] || "⚽");
        } else if (player.mode !== "club") {
            player.avatar = personBase(player.avatar);
        }
        if (!player.tale || typeof player.tale.step !== "number") player.tale = { step: 0, tone: "" };
        if (!Array.isArray(player.squad)) player.squad = [];
        if (!Array.isArray(player.grid)) player.grid = [];
        migrateGkStats(player);
        migrateCbStats(player);
        ensureCalendar();
        grantPendingPromo();
        maybeGoat();
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

function ensureExtraStats() {
    if (!player || !player.stats) return;
    const s = player.stats;
    if (typeof s.stamina !== "number") s.stamina = s.physical || s.strength || s.speed || 58;
    if (isGk()) {
        if (typeof s.command !== "number") s.command = s.positioning || 62;
        return;
    }
    if (typeof s.vision !== "number") s.vision = s.passing || 56;
    if (!isCb() && typeof s.setpieces !== "number") {
        s.setpieces = Math.round(((s.shooting || 55) + (s.passing || 55)) / 2);
    }
}

function updateStats() {
    ensureExtraStats();
    const keys = statKeys();
    const rows = document.querySelectorAll("#statList .stat");
    rows.forEach(function (row, i) { row.hidden = i >= keys.length; });
    keys.forEach((key, i) => {
        const row = rows[i];
        if (!row) return;
        const label = row.querySelector("span");
        const value = row.querySelector("b");
        const bar = row.querySelector("i");
        const n = player.stats[key];
        if (label) {
            label.textContent = isClub()
                ? t("club_" + key)
                : (t("lbl_" + key) || STAT_LABELS[key] || STAT_NAMES[key]);
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
    const inj = get("injuryLine");
    if (inj) {
        inj.hidden = !isInjured();
        inj.textContent = isInjured() ? injuryLabel() : "";
    }
    const last = get("lastMatch");
    if (last) {
        if (player.lastMatch) {
            last.className = "last-match " + player.lastMatch.result;
            last.textContent = player.lastMatch.text;
        } else {
            last.className = "last-match";
            last.textContent = t("noMatches");
        }
    }
}

function updateHeader() {
    const clubMode = isClub();
    get("playerNameDisplay").textContent = player.name;
    get("labelNation").textContent = clubMode ? t("labelCountry") : t("labelNation");
    get("nationDisplay").textContent = nationLabel(player.nation);
    get("labelPosition").textContent = clubMode ? t("labelCity") : t("labelPos");
    get("positionDisplay").textContent = clubMode ? ui(player.city || "Астана") : player.position;
    get("labelClub").textContent = clubMode ? t("labelLeague") : t("labelClub");
    get("clubDisplay").textContent = ui(player.club);
    if (get("clubLine")) get("clubLine").textContent = ui(player.club);
    if (get("futPos")) get("futPos").textContent = clubMode ? "CLB" : player.position;
    get("ageDisplay").textContent = player.age;
    get("weekDisplay").textContent = player.week;
    if (get("weekDisplayClub")) get("weekDisplayClub").textContent = player.week;
    get("ageLine").hidden = clubMode;
    if (get("weekLine")) get("weekLine").hidden = !clubMode;
    const shopTab = document.querySelector('#careerTabs [data-panel="shop"]');
    if (shopTab) shopTab.hidden = clubMode;
    const stadTab = document.querySelector('#careerTabs [data-panel="stad"]');
    if (stadTab) stadTab.hidden = !clubMode;
    if (!clubMode) {
        const on = document.querySelector(".panel.on");
        if (on && on.getAttribute("data-panel") === "stad") showPanel("home");
    }
    const aucCard = get("auctionCareerCard");
    if (aucCard) aucCard.hidden = !clubMode;
    setFace(get("avatar"), clubMode ? player.name : (player.avatar || "p0"), clubMode, clubMode ? null : wearLook());
    if (get("careerTitle")) {
        get("careerTitle").textContent = clubMode
            ? (player.coach && player.coachFrom ? t("coachTitle", { name: player.coachFrom }) : t("myClub"))
            : t("myCareer");
    }
    if (get("tabClub")) get("tabClub").textContent = clubMode ? t("tabClub") : t("tabClubs");
    if (get("transfersTitle")) {
        get("transfersTitle").textContent = clubMode ? t("leagues") : t("transfers");
    }
    if (get("marketCard")) get("marketCard").hidden = !clubMode;
    if (get("squadCard")) get("squadCard").hidden = !clubMode;
    if (get("trainHint")) {
        get("trainHint").textContent = clubMode
            ? t("trainHintClub")
            : isGk()
                ? t("trainHintGk")
                : isCb()
                    ? t("trainHintCb")
                    : t("trainHint");
    }
}

function updateTrainButtons() {
    ensureExtraStats();
    const keys = statKeys();
    document.querySelectorAll("[data-train]").forEach((button, i) => {
        const key = keys[i];
        button.hidden = !key;
        if (!key) return;
        button.setAttribute("data-train", key);
        const label = isClub() ? t("club_" + key) : t("lbl_" + key);
        const need = trainNeed(key);
        const mark = need <= 1 ? "+1" : ((trainBank(key)) + "/" + need);
        button.textContent = player.retired ? t("retiredBtn") : (label + " " + mark);
        button.disabled = !!player.retired;
    });
}

const SOC_TAGS = [
    "ABOBUS6-7!", "xX_GOL99_Xx", "SKUF_228!", "LUNTIK_FC7",
    "4el_s_divana", "GOAT??11", "VAR_NET!", "PENALTI_6-7",
    "KIRYA2009!!", "ZOLOTO_7", "TAPOK_FC", "BIBA_BOBA9!",
    "NOOB_MASTER", "ZOV_FAN_7!", "OFFSIDE_KING", "MAMA_SKAZALA",
    "ABOBA_PRIME!", "CR7_KZ_6", "SHASHLYK11!", "OVR_99_NET"
];
let socialPane = "feed";
let socialFocusId = "";

function fanAt(i) {
    return SOC_TAGS[Math.abs(i) % SOC_TAGS.length];
}

function textMuddy(text) {
    const s = String(text || "").trim();
    const letters = s.replace(/[^A-Za-zА-Яа-яЁё]/g, "");
    if (letters.length < 2) return true;
    if (/(.)\1{5,}/.test(letters)) return true;
    const vowels = (letters.match(/[aeiouyаеёиоуыэюя]/gi) || []).length;
    if (vowels === 0 && letters.length >= 4) return true;
    if (/\s/.test(s) && vowels > 0) return false;
    if (vowels / letters.length < 0.12 && letters.length >= 6) return true;
    return false;
}

function ensureFollow() {
    if (!player) return 0;
    if (typeof player.socFollow !== "number" || !isFinite(player.socFollow)) {
        player.socFollow = Math.max(20, Math.round(fameValue() * 0.8 + (player.matches || 0)));
    }
    player.socFollow = Math.max(0, Math.round(player.socFollow));
    return player.socFollow;
}

function socVerified() {
    const weeks = player.week || 1;
    return weeks >= 80 && fameValue() >= 74;
}

function userReplies(id) {
    const bag = player && player.socReplies;
    if (!bag || !Array.isArray(bag[id])) return [];
    return bag[id];
}

function socPitchLocked() {
    return !!(player && player.socPitchNeed);
}

function socHint(msg) {
    const hint = get("socialHint");
    if (!hint) return;
    if (!msg) {
        hint.hidden = true;
        hint.textContent = "";
        return;
    }
    hint.hidden = false;
    hint.textContent = msg;
}

function muddyHit(logKey) {
    const drop = 8 + (socSeed(String(Date.now())) % 10);
    player.socFollow = Math.max(0, ensureFollow() - drop);
    addFame(-2);
    addLog(t(logKey));
    socHint(t(logKey));
}

function postWorthy(text) {
    if (textMuddy(text)) return false;
    const letters = String(text || "").replace(/[^A-Za-zА-Яа-яЁё]/g, "");
    return letters.length >= 16 && /\s/.test(String(text));
}

function maybeSocField() {
    if (!player || (player.socSinceMatch || 0) < 8) return;
    player.socPitchNeed = true;
    if (player.socField) return;
    player.socField = true;
    addTitle("soc_field", seasonYear(), "");
    addLog(t("logSocField"));
    showAura("match", t("socFieldKicker"), t("socFieldTitle"), t("socField"), "#d4af37", 2600);
}

function replyLikes(row) {
    if (!row || !row.text) return 0;
    if (textMuddy(row.text)) return socSeed(row.text) % 2;
    const fame = fameValue();
    const seed = socSeed(row.text);
    return 24 + (seed % 50) + Math.round(fame * 2.2) + (player.matches || 0) * 3;
}

function closeSocial() {
    const box = get("socialOverlay");
    if (box) box.hidden = true;
    socialPane = "feed";
    socialFocusId = "";
}

function socCount(n) {
    n = Math.max(0, Math.round(n || 0));
    if (n >= 1000000) {
        const v = (n / 1000000).toFixed(n >= 10000000 ? 0 : 1).replace(".0", "");
        return v + (langEn() ? "M" : " млн");
    }
    if (n >= 1000) {
        const v = (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(".0", "");
        return v + (langEn() ? "k" : " тыс");
    }
    return String(n);
}

function followerCount() {
    const fame = fameValue();
    const club = clubByName(player && player.club);
    const req = Math.max(40, (club && club.required) || 0);
    let n = fame * fame * 40
        + (player.matches || 0) * 90
        + (player.goals || 0) * 220
        + (player.wcWins || 0) * 400000
        + ((player.titles || []).length) * 25000;
    if (fame >= 99) n = Math.max(n, 28000000 + req * 150000);
    else if (fame >= 90) n = Math.round(n * 6 + 2500000);
    else if (fame >= 75) n = Math.round(n * 2.5);
    if (isClub()) n = Math.round(n * 1.35);
    return n;
}

function maybeGoat() {
    if (!player || isClub() || player.goatStay) return;
    if ((player.age || 0) < 89) return;
    player.goatStay = true;
    addTitle("goat_stay", seasonYear(), "");
    addLog(t("logGoat"));
    showAura("champ", t("goatKicker"), "G.O.A.T.", t("goatStay"), "#ffd83d", 2800);
}

function socHandle() {
    const raw = String(player.name || "pulse").replace(/\s+/g, "").slice(0, 16);
    return "@" + raw;
}

function socSeed(text) {
    let h = 7;
    const s = String(text || "");
    for (let i = 0; i < s.length; i++) h = (h * 33 + s.charCodeAt(i)) >>> 0;
    return h || 1;
}

function socRoll(seed, count, mod) {
    const out = [];
    let x = seed || 1;
    let guard = 0;
    while (out.length < count && out.length < mod && guard < 80) {
        x = (x * 1664525 + 1013904223) >>> 0;
        const idx = x % mod;
        if (out.indexOf(idx) === -1) out.push(idx);
        guard += 1;
    }
    return out;
}

const CLUB_ALIAS = {
    "Manchester City": "City",
    "Bayern Munich": "Bayern",
    "FC Barcelona": "Barcelona",
    "AC Milan": "Milan",
    "Динамо Москва": "Динамо"
};

const CLUB_MATES = {
    "Академия": [
        { id: "aca-alibek", name: "Алибек", en: "Alibek", pos: "CM", ovr: 61, flag: "🇰🇿" },
        { id: "aca-daniyar", name: "Данияр", en: "Daniyar", pos: "CB", ovr: 60, flag: "🇰🇿" },
        { id: "aca-yerlan", name: "Ерлан", en: "Yerlan", pos: "LW", ovr: 63, flag: "🇰🇿" },
        { id: "aca-timur", name: "Тимур", en: "Timur", pos: "GK", ovr: 59, flag: "🇰🇿" }
    ],
    "Кайрат": [
        { id: "islamkhan", name: "Исламхан", en: "Islamkhan", pos: "CAM", ovr: 74, flag: "🇰🇿" },
        { id: "kuat", name: "Куат", en: "Kuat", pos: "RB", ovr: 72, flag: "🇰🇿" },
        { id: "alip", name: "Алип", en: "Alip", pos: "CB", ovr: 73, flag: "🇰🇿" },
        { id: "shushenachev", name: "Шушеначев", en: "Shushenachev", pos: "GK", ovr: 71, flag: "🇰🇿" }
    ],
    "Тобол": [
        { id: "tob-nesterov", name: "Нестеров", en: "Nesterov", pos: "ST", ovr: 70, flag: "🇰🇿" },
        { id: "tob-malyi", name: "Малый", en: "Malyi", pos: "CB", ovr: 71, flag: "🇰🇿" },
        { id: "tob-tomasov", name: "Томасов", en: "Tomasov", pos: "LW", ovr: 72, flag: "🇭🇷" },
        { id: "tob-moser", name: "Мозер", en: "Moser", pos: "GK", ovr: 69, flag: "🇰🇿" }
    ],
    "FC Astana": [
        { id: "ast-aimbetov", name: "Аймбетов", en: "Aymbetov", pos: "CM", ovr: 72, flag: "🇰🇿" },
        { id: "ast-beysebekov", name: "Бейсебеков", en: "Beysebekov", pos: "CDM", ovr: 73, flag: "🇰🇿" },
        { id: "ast-tomasov", name: "Томасов", en: "Tomasov", pos: "RW", ovr: 74, flag: "🇭🇷" },
        { id: "ast-eric", name: "Эрик", en: "Eric", pos: "GK", ovr: 71, flag: "🇧🇷" }
    ],
    "Црвена Звезда": [
        { id: "katai", name: "Катай", en: "Katai", pos: "CAM", ovr: 76, flag: "🇷🇸" },
        { id: "dragovic", name: "Драгович", en: "Dragovic", pos: "CB", ovr: 77, flag: "🇦🇹" },
        { id: "ivanic", name: "Иванич", en: "Ivanic", pos: "CM", ovr: 75, flag: "🇷🇸" },
        { id: "borjan", name: "Борьян", en: "Borjan", pos: "GK", ovr: 78, flag: "🇨🇦" }
    ],
    "Ajax": [
        { id: "bergwijn", name: "Бергвейн", en: "Bergwijn", pos: "LW", ovr: 81, flag: "🇳🇱" },
        { id: "brobbey", name: "Бробби", en: "Brobbey", pos: "ST", ovr: 80, flag: "🇳🇱" },
        { id: "sutalo", name: "Сутало", en: "Sutalo", pos: "CB", ovr: 79, flag: "🇭🇷" },
        { id: "rulli", name: "Рульи", en: "Rulli", pos: "GK", ovr: 80, flag: "🇦🇷" }
    ],
    "Porto": [
        { id: "pepe", name: "Пепе", en: "Pepe", pos: "CB", ovr: 84, flag: "🇵🇹" },
        { id: "galeno", name: "Галену", en: "Galeno", pos: "RW", ovr: 82, flag: "🇧🇷" },
        { id: "costa", name: "Диогу Кошта", en: "Diogo Costa", pos: "GK", ovr: 84, flag: "🇵🇹" }
    ],
    "Borussia Dortmund": [
        { id: "brandt", name: "Брандт", en: "Brandt", pos: "CAM", ovr: 84, flag: "🇩🇪" },
        { id: "schlotterbeck", name: "Шлоттербек", en: "Schlotterbeck", pos: "CB", ovr: 84, flag: "🇩🇪" },
        { id: "adeyemi", name: "Адейеми", en: "Adeyemi", pos: "LW", ovr: 82, flag: "🇩🇪" },
        { id: "kobel", name: "Кобель", en: "Kobel", pos: "GK", ovr: 87, flag: "🇨🇭" }
    ],
    "Галатасарай": [
        { id: "leao", name: "Леау", en: "Leao", pos: "LW", ovr: 86, flag: "🇵🇹" }
    ],
    "AC Milan": [
        { id: "theo", name: "Тео Эрнандес", en: "Theo Hernandez", pos: "LB", ovr: 85, flag: "🇫🇷" },
        { id: "giroud", name: "Жиру", en: "Giroud", pos: "ST", ovr: 82, flag: "🇫🇷" },
        { id: "maignan", name: "Меньян", en: "Maignan", pos: "GK", ovr: 87, flag: "🇫🇷" }
    ],
    "Atlético Madrid": [
        { id: "griezmann", name: "Гризманн", en: "Griezmann", pos: "ST", ovr: 87, flag: "🇫🇷" },
        { id: "koke", name: "Коке", en: "Koke", pos: "CM", ovr: 84, flag: "🇪🇸" },
        { id: "morata", name: "Мората", en: "Morata", pos: "ST", ovr: 82, flag: "🇪🇸" },
        { id: "oblak", name: "Облак", en: "Oblak", pos: "GK", ovr: 88, flag: "🇸🇮" }
    ],
    "Manchester United": [
        { id: "bruno", name: "Бруну Фернандеш", en: "Bruno Fernandes", pos: "CAM", ovr: 87, flag: "🇵🇹" },
        { id: "rashford", name: "Рашфорд", en: "Rashford", pos: "LW", ovr: 84, flag: "🇬🇧" },
        { id: "mainoo", name: "Мейну", en: "Mainoo", pos: "CM", ovr: 82, flag: "🇬🇧" },
        { id: "onana", name: "Онана", en: "Onana", pos: "GK", ovr: 84, flag: "🇨🇲" }
    ],
    "Bayern Munich": [
        { id: "musiala", name: "Мусиала", en: "Musiala", pos: "CAM", ovr: 88, flag: "🇩🇪" },
        { id: "kimmich", name: "Киммих", en: "Kimmich", pos: "CM", ovr: 88, flag: "🇩🇪" },
        { id: "sane", name: "Сане", en: "Sane", pos: "LW", ovr: 85, flag: "🇩🇪" },
        { id: "neuer", name: "Нойер", en: "Neuer", pos: "GK", ovr: 88, flag: "🇩🇪" }
    ],
    "FC Barcelona": [
        { id: "yamal", name: "Ямаль", en: "Yamal", pos: "RW", ovr: 86, flag: "🇪🇸" },
        { id: "pedri", name: "Педри", en: "Pedri", pos: "CM", ovr: 87, flag: "🇪🇸" },
        { id: "raphinha", name: "Рафинья", en: "Raphinha", pos: "RW", ovr: 86, flag: "🇧🇷" },
        { id: "terstegen", name: "Тер Штеген", en: "Ter Stegen", pos: "GK", ovr: 87, flag: "🇩🇪" }
    ],
    "Локомотив": [
        { id: "tiknizyan", name: "Тикнизян", en: "Tiknizyan", pos: "LB", ovr: 76, flag: "🇦🇲" },
        { id: "pinyaev", name: "Пиняев", en: "Pinyaev", pos: "LW", ovr: 74, flag: "🇷🇺" }
    ],
    "Ростов": [
        { id: "komlichenko", name: "Комличенко", en: "Komlichenko", pos: "ST", ovr: 76, flag: "🇷🇺" }
    ],
    "Спартак": [
        { id: "zobnin", name: "Зобнин", en: "Zobnin", pos: "CDM", ovr: 77, flag: "🇷🇺" }
    ],
    "Liverpool": [
        { id: "salah", name: "Салах", en: "Salah", pos: "RW", ovr: 89, flag: "🇪🇬" },
        { id: "vandijk", name: "Ван Дейк", en: "Van Dijk", pos: "CB", ovr: 89, flag: "🇳🇱" },
        { id: "alisson", name: "Алиссон", en: "Alisson", pos: "GK", ovr: 89, flag: "🇧🇷" }
    ]
};

const MATE_KEYS = ["socMateA", "socMateB", "socMateC", "socMateD", "socMateE", "socMateF", "socMateG", "socMateH", "socMateI", "socMateJ", "socMateK", "socMateL", "socMateM", "socMateN", "socMateO", "socMateP"];

function matesForClub(club) {
    const alias = CLUB_ALIAS[club];
    const realOnly = club === "Real Madrid" || alias === "Real Madrid";
    const pool = [];
    function add(row, force) {
        if (!row || pool.some(function (star) { return star.id === row.id; })) return;
        if (realOnly && !force && !row.ended) return;
        pool.push(row);
    }
    (SEASON_XI[club] || []).forEach(function (star) { add(star, true); });
    TRANSFER_STARS.forEach(function (star) {
        if (star.club === club || (alias && star.club === alias)) add(star);
    });
    (CLUB_MATES[club] || []).forEach(add);
    return pool;
}

function likeBoostFor(name) {
    const alias = {
        "City": 89,
        "Milan": 77,
        "Динамо": 66,
        "Наполи": 80,
        "Leverkusen": 78,
        "Интер": 84,
        "Inter": 84,
        "Barcelona": 87,
        "Bayern": 84,
        "Liverpool": 86,
        "PSG": 88,
        "Al-Nassr": 84
    };
    const hit = CLUBS.find(function (club) { return club.name === name; });
    const req = Math.max(46, (hit && hit.required) || alias[name] || 58);
    if (req >= 90) return req * 14;
    if (req >= 80) return req * 6;
    if (req >= 68) return req * 3;
    return Math.round(req * 1.5);
}

function clubLikeBoost() {
    return likeBoostFor(player && player.club);
}

function ensureFriends() {
    if (!player) return;
    if (!Array.isArray(player.socFriends)) player.socFriends = [];
    if (!player.socChat || typeof player.socChat !== "object" || Array.isArray(player.socChat)) player.socChat = {};
}

function ensureFinAdmin() {
    if (!player || !player.name || player.mode !== "club") return null;
    ensureFriends();
    let index = player.socFriends.findIndex(function (row) { return row.id === "fin-admin"; });
    const row = index >= 0 ? player.socFriends[index] : { id: "fin-admin", ovr: 0 };
    row.name = t("finName");
    row.pos = t("finRole");
    row.flag = "💼";
    row.club = player.name || "";
    if (index > 0) player.socFriends.splice(index, 1);
    if (index !== 0) player.socFriends.unshift(row);
    return row;
}

function isFriend(id) {
    ensureFriends();
    return player.socFriends.some(function (row) { return row.id === id; });
}

function addFriend(who) {
    if (!who || !who.id || isFriend(who.id)) return false;
    player.socFriends.push({
        id: who.id,
        name: who.name || shown(who),
        pos: who.pos || "",
        ovr: who.ovr || 0,
        flag: who.flag || "",
        legend: who.tier === "leg" || (who.ovr || 0) >= 88 || !!who.season,
        dead: !!who.dead
    });
    save();
    Sfx.ding();
    return true;
}

function everyStar() {
    const pool = [];
    const seen = {};
    function add(star, home) {
        if (!star || !star.id || seen[star.id]) return;
        seen[star.id] = true;
        const row = {};
        Object.keys(star).forEach(function (key) { row[key] = star[key]; });
        row.home = home || star.club || "";
        pool.push(row);
    }
    Object.keys(SEASON_XI).forEach(function (club) {
        SEASON_XI[club].forEach(function (star) { add(star, club); });
    });
    Object.keys(CLUB_MATES).forEach(function (club) {
        CLUB_MATES[club].forEach(function (star) { add(star, club); });
    });
    TRANSFER_STARS.forEach(function (star) { add(star, star.club); });
    return pool;
}

function ensureSubs() {
    if (!player) return;
    if (!Array.isArray(player.socSubs)) player.socSubs = [];
}

function isSub(id) {
    ensureSubs();
    return player.socSubs.some(function (row) { return row.id === id; });
}

function toggleSub(who) {
    if (!who || !who.id) return;
    ensureSubs();
    if (isSub(who.id)) {
        player.socSubs = player.socSubs.filter(function (row) { return row.id !== who.id; });
    } else {
        player.socSubs.push({
            id: who.id,
            name: who.name || shown(who),
            pos: who.pos || "",
            flag: who.flag || "",
            club: who.club || who.home || ""
        });
        player.socFollow = ensureFollow() + 1;
    }
    save();
    Sfx.ding();
    renderSocial();
}

function legendBook() {
    const mates = matesForClub(player.club || "");
    const seen = {};
    mates.forEach(function (star) { seen[star.id] = true; });
    return TRANSFER_STARS.filter(function (star) { return star.dead && !seen[star.id]; });
}

function mateLine(star, club, index) {
    const seed = socSeed((star.id || star.en || star.name) + "|" + club + "|" + (player.week || 1));
    const key = MATE_KEYS[(seed + index * 3) % MATE_KEYS.length];
    return t(key, { name: shown(star), pos: star.pos || "", club: ui(club) });
}

function mateCard(star, home, mine) {
    return {
        author: shown(star),
        pos: star.pos,
        ovr: star.ovr,
        face: "p" + (socSeed(star.id) % 12),
        crest: false,
        key: star.id,
        star: star,
        season: star.season || "",
        home: home || star.club || "",
        mine: !!mine
    };
}

function mateRoster() {
    const club = player.club || "";
    const authors = [];
    const seen = {};
    function push(star, home, mine) {
        if (!star || !star.id || seen[star.id]) return;
        seen[star.id] = true;
        authors.push(mateCard(star, home, mine));
    }
    if (isClub()) squadStars().forEach(function (star) { push(star, club, true); });
    else matesForClub(club).forEach(function (star) { push(star, star.club || club, true); });
    return authors.map(function (row, i) {
        return {
            id: "mate:" + (player.week || 1) + ":" + (row.home || club) + ":" + row.key,
            tag: row.mine ? (row.season ? t("socSeason") : t("socMates")) : (row.home || t("socWorld")),
            world: !row.mine,
            text: row.crest
                ? t(MATE_KEYS[i % MATE_KEYS.length], { name: row.author, pos: "", club: ui(club) })
                : mateLine(row.star, row.home || club, i),
            week: player.week || 1,
            heat: 0.7,
            mine: false,
            mate: !!row.mine,
            author: row.pos ? row.author + " · " + row.pos : row.author,
            face: row.face,
            crest: !!row.crest,
            tick: (row.ovr || 0) >= 82,
            who: row.crest ? null : {
                id: row.star.id,
                name: row.author,
                pos: row.pos || "",
                ovr: row.ovr || 0,
                flag: row.star.flag || "",
                tier: row.star.tier || "",
                dead: !!row.star.dead,
                club: row.home || "",
                home: row.home || "",
                flag: row.star.flag || ""
            }
        };
    });
}

function likedMate(id) {
    return !!(player.socLikes && player.socLikes[id]);
}

function toggleMateLike(id) {
    if (!player.socLikes || typeof player.socLikes !== "object" || Array.isArray(player.socLikes)) player.socLikes = {};
    if (!player.socDislikes || typeof player.socDislikes !== "object" || Array.isArray(player.socDislikes)) player.socDislikes = {};
    if (player.socLikes[id]) delete player.socLikes[id];
    else {
        player.socLikes[id] = 1;
        delete player.socDislikes[id];
    }
    save();
    Sfx.ding();
    renderSocial();
}

function dislikedMate(id) {
    return !!(player.socDislikes && player.socDislikes[id]);
}

function toggleMateDown(id) {
    if (!player.socLikes || typeof player.socLikes !== "object" || Array.isArray(player.socLikes)) player.socLikes = {};
    if (!player.socDislikes || typeof player.socDislikes !== "object" || Array.isArray(player.socDislikes)) player.socDislikes = {};
    if (player.socDislikes[id]) delete player.socDislikes[id];
    else {
        player.socDislikes[id] = 1;
        delete player.socLikes[id];
    }
    save();
    Sfx.ding();
    renderSocial();
}

function socialPosts() {
    const posts = (player.posts || []).map(function (post) {
        return {
            id: post.id,
            tag: t("socMine"),
            text: post.text,
            week: post.week,
            heat: 1.1,
            likes: post.likes || [],
            comments: post.comments || [],
            extra: post.extra || 0,
            muddy: !!post.muddy,
            mine: true
        };
    });
    mateRoster().forEach(function (mate) { posts.push(mate); });
    function auto(tag, text, heat) {
        const id = "a" + socSeed(tag + "|" + text);
        posts.push({ id: id, tag: tag, text: text, week: player.week || 1, heat: heat, mine: false, career: true });
    }
    if (player.lastMatch && player.lastMatch.text) {
        auto(t("socMatch"), player.lastMatch.text, player.lastMatch.result === "win" ? 1.5 : 0.75);
    }
    if ((player.goals || 0) > 0) {
        auto(t("socStat"), t(isClub() ? "socGoalsClub" : "socGoals", { n: player.goals }), 1);
    }
    if (!isClub() && player.ntCalled) {
        auto(t("socNt"), t("socCall", { nation: nationLabel(player.nation) }), 1.7);
    }
    const titles = player.titles || [];
    if (titles.length) {
        const last = titles[titles.length - 1];
        auto(t("socTrophy"), awardName(last.id) + (last.note ? " · " + ui(last.note) : ""), 1.8);
    }
    const brands = player.brands || [];
    if (brands.length) {
        auto(t("socBrand"), t("socBrandPost", { name: brands[brands.length - 1].name || "" }), 1.25);
    }
    auto(
        t(isClub() ? "socClubTag" : "socLife"),
        isClub()
            ? t("socClubLine", { name: player.name, city: ui(player.city || ""), league: ui(player.club) })
            : t("socLifeLine", { name: player.name, club: ui(player.club), pos: player.position }),
        0.65
    );
    const mates = [];
    const mine = [];
    const career = [];
    const world = [];
    posts.forEach(function (post) {
        if (post.mate) mates.push(post);
        else if (post.world) world.push(post);
        else if (post.career) career.push(post);
        else mine.push(post);
    });
    return career.concat(mine).concat(mates).concat(world).concat(papaPosts());
}

function papaPosts() {
    const week = player.week || 1;
    const posts = [];
    for (let i = 0; i < 3; i++) {
        posts.push({
            id: "papa:" + week + ":" + i,
            tag: t("socSpamTag"),
            text: t("socSpam"),
            week: week,
            heat: 0.5,
            mine: false,
            world: true,
            author: fanAt(socSeed("papa|" + week) + i * 3),
            face: "p" + (socSeed("papaf|" + i) % 12)
        });
    }
    return posts;
}

function withDown(post, meta) {
    const seed = socSeed((post.id || post.text) + "|down");
    const n = post.muddy ? 3 + (seed % 3) : 1 + (seed % 3);
    const crowd = Math.max(2, Math.round((meta.extra || 0) * 0.18));
    meta.downs = socRoll(seed, n, SOC_TAGS.length);
    meta.downExtra = post.muddy ? crowd + 24 : crowd;
    return meta;
}

function postMeta(post) {
    if (post.mine) {
        const muddy = textMuddy(post.text);
        if (muddy) return withDown(post, { likes: (post.likes || []).slice(0, 1), comments: [], extra: 0 });
        const seed = socSeed(post.id || post.text);
        const likeN = clamp(4 + Math.floor(fameValue() / 18), 3, 8);
        const likes = (post.likes && post.likes.length) ? post.likes : socRoll(seed, likeN, SOC_TAGS.length);
        return withDown(post, {
            likes: likes,
            comments: (post.comments && post.comments.length) ? post.comments : socRoll(seed + 3, 3, 8).map(function (n) { return n + 1; }),
            extra: clubLikeBoost() + Math.round(fameValue() * 0.35)
        });
    }
    if (post.mate || post.world) {
        const seed = socSeed(post.id || post.text);
        const likeN = 5 + (seed % 8);
        const commentN = 3 + ((seed >> 3) % 3);
        return withDown(post, {
            likes: socRoll(seed, likeN, SOC_TAGS.length),
            comments: socRoll(seed + 9, commentN, 8).map(function (n) { return n + 1; }),
            extra: Math.round(likeBoostFor((post.who && (post.who.home || post.who.club)) || "") * (post.heat || 1))
        });
    }
    const seed = socSeed(post.id || post.text);
    return withDown(post, {
        likes: socRoll(seed, 4, SOC_TAGS.length),
        comments: socRoll(seed + 9, 2, 8).map(function (n) { return n + 1; }),
        extra: 0
    });
}

function commentSocial(postId, raw) {
    const text = String(raw || "").trim().slice(0, 80);
    if (!player || !postId) return;
    if (socPitchLocked()) {
        Sfx.error();
        socHint(t("socFieldLock"));
        return;
    }
    if (!text) {
        Sfx.error();
        socHint(t("socNeedText"));
        return;
    }
    if (!player.socReplies || typeof player.socReplies !== "object" || Array.isArray(player.socReplies)) player.socReplies = {};
    if (!Array.isArray(player.socReplies[postId])) player.socReplies[postId] = [];
    const muddy = textMuddy(text);
    player.socReplies[postId].unshift({ text: text, week: player.week || 1, muddy: muddy });
    if (player.socReplies[postId].length > 12) player.socReplies[postId].length = 12;
    if (muddy) {
        muddyHit("socGibberishC");
        Sfx.error();
    } else {
        player.socFollow = ensureFollow() + 1;
        socHint("");
        Sfx.ding();
    }
    save();
    renderSocial();
}

function replyRow(postId) {
    const form = document.createElement("form");
    form.className = "soc-reply";
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const input = form.querySelector("input");
        commentSocial(postId, input ? input.value : "");
    });
    const input = document.createElement("input");
    input.maxLength = 80;
    input.placeholder = t("socCommentPh");
    input.setAttribute("aria-label", t("socCommentPh"));
    const btn = document.createElement("button");
    btn.type = "submit";
    btn.textContent = t("socSend");
    form.appendChild(input);
    form.appendChild(btn);
    return form;
}

function friendPack(who) {
    return {
        id: who.id,
        name: who.name || shown(who),
        pos: who.pos || "",
        ovr: who.ovr || 0,
        flag: who.flag || "",
        tier: who.tier || "",
        season: who.season || "",
        dead: !!who.dead,
        active: !!who.active
    };
}

function friendRow(who, added) {
    const row = document.createElement("div");
    row.className = "soc-friend";
    const name = document.createElement("b");
    name.textContent = (who.flag ? who.flag + " " : "") + (who.name || shown(who)) + (who.pos ? " · " + who.pos : "") + (who.exclusive ? " · EX" : "");
    const unread = added ? unreadFor(who.id) : 0;
    if (unread) {
        const dot = document.createElement("i");
        dot.className = "soc-dot";
        dot.textContent = unread > 99 ? "99" : String(unread);
        name.appendChild(dot);
    }
    row.appendChild(name);
    const btn = document.createElement("button");
    btn.type = "button";
    if (added) {
        btn.textContent = t("socWrite");
        btn.addEventListener("click", function () {
            Sfx.click();
            socialPane = "chat";
            socialFocusId = who.id;
            renderSocial();
        });
        const ad = document.createElement("button");
        ad.type = "button";
        ad.textContent = t("socAd");
        ad.addEventListener("click", function () {
            sendAd(who.id);
        });
        row.appendChild(btn);
        if (who.id !== "fin-admin") row.appendChild(ad);
    } else {
        btn.textContent = t("socAddFriend");
        btn.addEventListener("click", function () {
            if (!addFriend(friendPack(who))) return;
            socialPane = "chat";
            socialFocusId = who.id;
            renderSocial();
        });
        row.appendChild(btn);
    }
    return row;
}

function subRow(star, home, withClub) {
    const row = document.createElement("div");
    row.className = "soc-friend";
    const name = document.createElement("b");
    name.textContent = (star.flag ? star.flag + " " : "") + shown(star) + " · " + (star.pos || "") + (withClub && home ? " · " + clubLabel(home) : "");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = isSub(star.id) ? t("socSubbed") : t("socSub");
    btn.addEventListener("click", function () {
        toggleSub({
            id: star.id,
            name: shown(star),
            pos: star.pos || "",
            flag: star.flag || "",
            club: home || star.home || ""
        });
    });
    row.appendChild(name);
    row.appendChild(btn);
    return row;
}

function renderSubs(feed) {
    ensureSubs();
    const mine = player.club || "";
    const head = document.createElement("p");
    head.className = "hint";
    head.textContent = player.socSubs.length ? t("socSubsN", { n: player.socSubs.length }) : t("socSubsEmpty");
    feed.appendChild(head);
    player.socSubs.forEach(function (who) {
        const row = document.createElement("div");
        row.className = "soc-friend";
        const name = document.createElement("b");
        const live = everyStar().find(function (star) { return star.id === who.id; });
        name.textContent = (who.flag ? who.flag + " " : "") + (live ? shown(live) : who.name) + (who.club ? " · " + clubLabel(who.club) : "");
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = t("socUnsub");
        btn.addEventListener("click", function () { toggleSub(who); });
        row.appendChild(name);
        row.appendChild(btn);
        feed.appendChild(row);
    });
    const playing = everyStar().filter(function (star) { return star.active; });
    if (playing.length) {
        const title = document.createElement("h3");
        title.textContent = t("socStillTitle");
        feed.appendChild(title);
        playing.forEach(function (star) { feed.appendChild(subRow(star, star.home, true)); });
    }
    const groups = {};
    everyStar().forEach(function (star) {
        if (star.active) return;
        const home = star.home || "—";
        if (!groups[home]) groups[home] = [];
        groups[home].push(star);
    });
    const clubs = Object.keys(groups).sort(function (a, b) {
        if (a === mine) return -1;
        if (b === mine) return 1;
        return a.localeCompare(b);
    });
    clubs.forEach(function (home) {
        const title = document.createElement("h3");
        title.textContent = (home === mine ? t("socMates") + " · " : "") + clubLabel(home);
        feed.appendChild(title);
        groups[home].forEach(function (star) { feed.appendChild(subRow(star, home, false)); });
    });
}

function renderFriends(feed) {
    ensureFriends();
    ensureFinAdmin();
    const mine = player.club || "";
    const head = document.createElement("p");
    head.className = "hint";
    head.textContent = player.socFriends.length ? t("socFriendN", { n: player.socFriends.length }) : t("socNoFriends");
    feed.appendChild(head);
    player.socFriends.forEach(function (who) { feed.appendChild(friendRow(liveFriend(who), true)); });
    const groups = {};
    everyStar().forEach(function (star) {
        if (isFriend(star.id)) return;
        const home = star.home || "—";
        if (!groups[home]) groups[home] = [];
        groups[home].push(star);
    });
    Object.keys(groups).sort(function (a, b) {
        const mineA = a === mine ? 1 : 0;
        const mineB = b === mine ? 1 : 0;
        if (mineA !== mineB) return mineA - mineB;
        const top = function (home) {
            return groups[home].reduce(function (best, star) { return Math.max(best, star.ovr || 0); }, 0);
        };
        return top(b) - top(a) || a.localeCompare(b);
    }).forEach(function (home) {
        const title = document.createElement("h3");
        title.textContent = (home === mine ? t("socMatesPick") + " · " : "") + clubLabel(home);
        feed.appendChild(title);
        groups[home].sort(function (a, b) { return (b.ovr || 0) - (a.ovr || 0); });
        groups[home].forEach(function (star) { feed.appendChild(friendRow(star, false)); });
    });
}

function liveFriend(who) {
    if (!who) return who;
    const ex = exclusiveById(who.id);
    if (ex) {
        who.name = shown(ex);
        who.flag = ex.flag;
        who.pos = ex.pos;
        who.ovr = ex.ovr;
        who.exclusive = true;
        who.en = ex.en;
        return who;
    }
    const star = everyStar().find(function (row) { return row.id === who.id; });
    if (!star) return who;
    who.name = shown(star);
    if (star.flag) who.flag = star.flag;
    if (star.pos) who.pos = star.pos;
    if (star.ovr) who.ovr = star.ovr;
    if (star.home || star.club) who.club = star.home || star.club;
    return who;
}

function fillBubble(el, text) {
    const raw = String(text || "");
    el.textContent = "";
    const re = /pulse\.fake\/buy/g;
    let last = 0;
    let match;
    while ((match = re.exec(raw))) {
        if (match.index > last) el.appendChild(document.createTextNode(raw.slice(last, match.index)));
        const link = document.createElement("a");
        link.className = "soc-link";
        link.href = "#";
        link.textContent = match[0];
        link.addEventListener("click", function (event) {
            event.preventDefault();
            socHint(t("socAdDead"));
        });
        el.appendChild(link);
        last = match.index + match[0].length;
    }
    if (last < raw.length) el.appendChild(document.createTextNode(raw.slice(last)));
}

function chatPlain(text) {
    let s = String(text || "");
    if (player && player.name && s.indexOf(player.name + ": ") === 0) s = s.slice(player.name.length + 2);
    return s;
}

function copyCount(thread, text, upto) {
    const key = chatPlain(text).trim().toLowerCase();
    let n = 0;
    const end = Math.min(upto, thread.length - 1);
    for (let i = 0; i <= end; i++) {
        if (thread[i].me && chatPlain(thread[i].text).trim().toLowerCase() === key) n++;
    }
    return n;
}

function isMessiFriend(friend) {
    const mine = ((friend && friend.id) || "") + " " + ((friend && friend.name) || "");
    return !!(friend && (friend.id === "messi" || /messi|месси|меси|лионел|lionel/i.test(mine)));
}

function messiLine(seed) {
    const keys = ["socChip1", "socChip2", "socChip3", "socChip4", "socChip5"];
    return t(keys[socSeed(String(seed || "chips")) % keys.length]);
}

function cr7Math(raw) {
    let s = String(raw || "").toLowerCase();
    const asked = /калькулятор|посчитай|сколько будет|calc/.test(s);
    s = s.replace(/калькулятор|посчитай|сколько будет|calc|calculate/g, " ");
    s = s.replace(/,/g, ".").replace(/×/g, "*").replace(/÷/g, "/").replace(/[xх]/g, "*");
    s = s.replace(/\s+/g, "");
    if (!s) return asked ? "ask" : "";
    if (!/^[\d.+\-*/()]+$/.test(s) || !/\d/.test(s) || s.length > 40) return "";
    try {
        const n = Function("\"use strict\";return(" + s + ")")();
        if (typeof n !== "number" || !isFinite(n)) return "";
        return String(Math.round(n * 1000) / 1000);
    } catch (e) {
        return "";
    }
}

function finYear() {
    return Math.floor(Math.max(0, (player.week || 1) - 1) / YEAR_WEEKS);
}

function finCap() {
    const pop = clubPop();
    const cap = pop >= 78 ? 900 : pop >= 52 ? 420 : 180;
    return Math.max(500, cap);
}

function finAsk(raw) {
    if (!player || player.mode !== "club") return t("finNo");
    const text = chatPlain(raw).toLowerCase();
    const nums = text.match(/\d+/g);
    const pay = nums ? Math.round(Number(nums[nums.length - 1])) : 0;
    if (!pay || pay < 1) return t("finNeedSum");
    if (pay > 999999) return t("finTight", { left: money(0) });
    const year = finYear();
    if (player.finYear !== year) {
        player.finYear = year;
        player.finOut = 0;
    }
    const left = Math.max(0, finCap() - (player.finOut || 0));
    if (pay > left) return t("finTight", { left: money(left) });
    player.finOut = (player.finOut || 0) + pay;
    player.respect = (player.respect || 0) + pay;
    updateRespect();
    save();
    return t("finYes", { pay: money(pay), left: money(Math.max(0, finCap() - player.finOut)) });
}

function talkReply(text, friend, times, before) {
    const raw = chatPlain(text).trim();
    const low = raw.toLowerCase();
    if (friend && friend.id === "fin-admin") return t("finHeard");
    const prev = chatPlain(before || "").trim().toLowerCase();
    if (isMessiFriend(friend)) {
        const asked = /калькулятор|посчитай|сколько будет|calc/.test(low);
        const looks = /^[\d\s.+\-*/()xх×÷,]+$/.test(low) && /\d/.test(low);
        if (asked || looks) return t("socCalc", { n: (socSeed(raw) % 997) + 2 });
        if (/матч|гол|сч[её]т|игр|match|goal|score/.test(low)) return t("socMessiPitch");
        if (/привет|здравств|hello|hey|хай/.test(low)) return t("socMessiHi");
        return messiLine(raw);
    }
    if ((times || 1) >= 3) {
        const keys = ["socCopy1", "socCopy2", "socCopy3"];
        return t(keys[(times - 3) % keys.length]);
    }
    const mine = ((friend && friend.id) || "") + " " + ((friend && friend.name) || "");
    const self = /cr7|ронал|криштиан|cristiano/i.test(mine);
    function has(words) {
        return words.some(function (w) { return low.indexOf(w) !== -1; });
    }
    function casual() {
        const keys = ["socGot1", "socGot2", "socGot3", "socGot4", "socGot5", "socGot6"];
        return t(keys[socSeed(raw) % keys.length]);
    }
    function aboutMe() {
        const star = (friend && friend.id && everyStar().find(function (row) { return row.id === friend.id; })) || friend || {};
        const card = {
            name: shown(star) || (friend && friend.name) || "",
            pos: star.pos || (friend && friend.pos) || "—",
            club: clubLabel(star.home || star.club || (friend && friend.club) || ""),
            ovr: star.ovr || (friend && friend.ovr) || "—"
        };
        if (!card.name) return "";
        if (has(["о себе", "о тебе", "расскажи о себе", "about yourself", "about you"])) return t("socMe", card);
        if (has(["как зовут", "кто ты", "твоё имя", "твое имя", "your name", "who are you"])) return t("socMeWho", card);
        if (has(["позиц", "амплуа", "position"])) return t("socMePos", card);
        if (has(["ovr", "рейтинг", "насколько ты", "how good"])) return t("socMeOvr", card);
        if (has(["клуб", "где игра", "за кого", "в каком клуб", "what club", "where do you play"])) {
            return star.ended ? t("socMeWas", card) : t("socMeClub", card);
        }
        return "";
    }
    if (raw.indexOf("pulse.fake/buy") !== -1) return t("socAdReply");
    if (self) {
        const math = cr7Math(raw);
        if (math === "ask") return t("socCalcAsk");
        if (math) return t("socCalc", { n: math });
    }
    if (textMuddy(raw)) return t("socTalkMud");
    const messi = has(["месси", "меси", "messi", "лионел", "lionel", "лео"]);
    const ronaldo = has(["ронал", "криштиан", "cristiano", "криш", "cr7", "ronal"]) || /(^|[^a-zа-яё])рона([^a-zа-яё]|$)/.test(low) || /(^|[^a-zа-яё])рону([^a-zа-яё]|$)/.test(low);
    if (messi && ronaldo) return t(self ? "socGoatMe" : "socGoat");
    const about = aboutMe();
    if (about) return about;
    if (has(["доброе утро", "добрым утр", "утро", "morning"])) return t("socMorning");
    if (has(["привет", "здравств", "хай", "добрый", "hello", "hey", "салют"]) || /(^|[^a-z])hi([^a-z]|$)/.test(low)) return t("socHi");
    if (has(["футболок", "футболк", "фанат", "люблю", "обожа", "лучший", "красав", "кумир", "goat", "idol"])) return t("socFan");
    if (has(["как дела", "как ты", "как жизнь", "как сам", "how are you"])) return t("socHow");
    if (has(["хорошего", "удачи", "good luck"])) return t("socLuck");
    if (has(["чемпион", "чм", "world cup", "любишь"])) return t("socWc");
    if (low === "ок" || low === "ok" || low === "окей" || has(["окей", "ладно", "лады", "понял"])) return t("socOk");
    if (has(["спасибо", "благодар", "thanks", "thank you"])) return t("socThanks");
    if (has(["пока", "бывай", "до встречи", "встрет", "bye"])) return t("socBye");
    if (has(["готов"])) return t("socBye");
    if (has(["матч", "игр", "гол", "поле", "трен", "match", "goal"])) return t("socPitch");
    if (has(["?", "почему", "когда", "зачем", "where", "why", "when"])) return t("socAsk");
    const yes = low === "да" || low === "yes" || low === "ага" || low === "угу" || low === "конечно";
    const hot = has(["идеально", "отлично", "супер", "класс", "perfect", "great"]);
    if (prev.indexOf("как форма") !== -1 || prev.indexOf("the form") !== -1) {
        if (hot) return t("socGreat");
        if (yes) return t("socFormOk");
    }
    if ((prev.indexOf("есть минута") !== -1 || prev.indexOf("a minute") !== -1) && (yes || hot)) return t("socPingListen");
    if ((prev.indexOf("завтра на поле") !== -1 || prev.indexOf("pitch tomorrow") !== -1) && (yes || hot)) return t("socPingPitch");
    if ((prev.indexOf("видел пост") !== -1 || prev.indexOf("saw the post") !== -1) && (yes || hot)) return t("socThanks");
    if ((prev.indexOf("будет время") !== -1 || prev.indexOf("when you can") !== -1) && (yes || hot)) return t("socPingWrite");
    if ((prev.indexOf("в сети") !== -1 || prev.indexOf("online") !== -1) && (yes || hot)) return t("socPingOn");
    if (has(["анекдот", "анигдот", "шутк", "joke"])) {
        const jokes = ["socJoke1", "socJoke2", "socJoke3", "socJoke4", "socJoke5"];
        return t(jokes[socSeed(raw + ((friend && friend.id) || "")) % jokes.length]);
    }
    if (hot) return t("socGreat");
    if (yes) return t("socYes");
    return casual();
}

const chatArmed = {};

function armReply(id, uid, left) {
    const key = id + "|" + uid;
    if (chatArmed[key]) return;
    chatArmed[key] = true;
    setTimeout(function () { finishReply(id, uid); }, Math.max(0, left));
}

function finishReply(id, uid) {
    if (!player || !player.socChat) return;
    const thread = player.socChat[id];
    if (!thread) return;
    const i = thread.findIndex(function (note) { return note.uid === uid; });
    if (i < 0 || thread[i].answered) return;
    thread[i].answered = true;
    const friend = liveFriend((player.socFriends || []).find(function (row) { return row.id === id; }));
    const prev = i > 0 && !thread[i - 1].me ? thread[i - 1].text : "";
    const replyText = id === "fin-admin"
        ? finAsk(thread[i].text)
        : talkReply(thread[i].text, friend, copyCount(thread, thread[i].text, i), prev);
    const reply = { me: false, text: replyText, week: player.week || 1, live: true };
    if (id === "fin-admin") reply.locked = true;
    thread.splice(i + 1, 0, reply);
    if (thread.length > 40) thread.splice(0, thread.length - 40);
    addUnread(id);
    save();
    paintUnread();
    const log = document.querySelector("#socialFeed .soc-chat");
    if (socialPane === "chat" && socialFocusId === id && log) {
        const bubble = document.createElement("p");
        bubble.className = "soc-bubble";
        fillBubble(bubble, replyText);
        const typing = log.querySelector(".soc-typing");
        if (typing) log.insertBefore(bubble, typing);
        else log.appendChild(bubble);
        if (typing && !chatWaiting(id)) typing.remove();
        Sfx.ding();
        return;
    }
    const box = get("socialOverlay");
    if (box && !box.hidden && socialPane === "friends") renderSocial();
    Sfx.ding();
}

function chatWaiting(id) {
    const thread = (player && player.socChat && player.socChat[id]) || [];
    return thread.some(function (note) {
        return note.me && note.uid && !note.answered && note.at && (Date.now() - note.at < 5000);
    });
}

function unreadFor(id) {
    return (player && player.socUnread && player.socUnread[id]) || 0;
}

function unreadTotal() {
    const bag = player && player.socUnread;
    if (!bag) return 0;
    return Object.keys(bag).reduce(function (sum, key) { return sum + (bag[key] || 0); }, 0);
}

function chatOpen(id) {
    const box = get("socialOverlay");
    return !!(box && !box.hidden && socialPane === "chat" && socialFocusId === id);
}

function addUnread(id) {
    if (!player || !id || chatOpen(id)) return;
    if (!player.socUnread || typeof player.socUnread !== "object" || Array.isArray(player.socUnread)) player.socUnread = {};
    player.socUnread[id] = Math.min(99, (player.socUnread[id] || 0) + 1);
}

function clearUnread(id) {
    if (!player || !player.socUnread || !player.socUnread[id]) return;
    delete player.socUnread[id];
    save();
}

function paintUnread() {
    const n = player && player.name ? unreadTotal() : 0;
    const label = n ? (n > 99 ? "99" : String(n)) : "";
    [get("socialOpen"), document.querySelector('#socTabs [data-soc="friends"]')].forEach(function (el) {
        if (!el) return;
        if (label) el.setAttribute("data-unread", label);
        else el.removeAttribute("data-unread");
    });
}

const PING_KEYS = ["socPing1", "socPing2", "socPing3", "socPing4", "socPing5", "socPing6", "socJoke1", "socJoke2", "socJoke3", "socJoke4", "socJoke5"];
let lastFriendPing = 0;
let lastMessiPing = 0;

function messiPal() {
    ensureFriends();
    return (player.socFriends || []).find(function (row) { return isMessiFriend(row); }) || null;
}

function messiChipPing() {
    if (!player || !player.name || !document.body.classList.contains("in-career")) return;
    const who = messiPal();
    if (!who || chatWaiting(who.id)) return;
    const now = Date.now();
    const open = chatOpen(who.id);
    if (now - lastMessiPing < (open ? 90000 : 240000)) return;
    if (!open && unreadFor(who.id) > 0) return;
    const thread = player.socChat[who.id] || [];
    const last = thread.length ? chatPlain(thread[thread.length - 1].text) : "";
    let text = messiLine(who.id + "|" + now);
    if (text === last) text = messiLine(who.id + "|next|" + now);
    dropFriendNote(who, text);
    lastMessiPing = now;
}

function friendPing(force) {
    if (!player || !player.name || !document.body.classList.contains("in-career")) return;
    ensureFriends();
    if (!player.socFriends.length) return;
    const now = Date.now();
    if (now - lastFriendPing < 1800000) return;
    if (unreadTotal() > 0) return;
    const pool = player.socFriends.filter(function (row) {
        if (row.id === "fin-admin" || isMessiFriend(row) || chatOpen(row.id) || chatWaiting(row.id)) return false;
        return true;
    });
    if (!pool.length) return;
    const who = pool[socSeed(String(player.week || 1) + "|" + now) % pool.length];
    const thread = player.socChat[who.id] || [];
    const lastText = thread.length ? chatPlain(thread[thread.length - 1].text) : "";
    let pick = socSeed(who.id + "|" + (player.week || 1) + "|" + thread.length + "|" + now) % PING_KEYS.length;
    let text = t(PING_KEYS[pick]);
    if (text === lastText) text = t(PING_KEYS[(pick + 1) % PING_KEYS.length]);
    dropFriendNote(who, text);
    lastFriendPing = now;
}

function dropFriendNote(who, text) {
    if (!who || !who.id || !text) return;
    ensureFriends();
    if (!Array.isArray(player.socChat[who.id])) player.socChat[who.id] = [];
    player.socChat[who.id].push({ me: false, text: text, week: player.week || 1, ping: true });
    if (player.socChat[who.id].length > 40) player.socChat[who.id].splice(0, player.socChat[who.id].length - 40);
    addUnread(who.id);
    save();
    const log = document.querySelector("#socialFeed .soc-chat");
    if (chatOpen(who.id) && log) {
        const bubble = document.createElement("p");
        bubble.className = "soc-bubble";
        fillBubble(bubble, text);
        log.appendChild(bubble);
    } else if (get("socialOverlay") && !get("socialOverlay").hidden && socialPane === "friends") {
        renderSocial();
    }
    paintUnread();
    if (!chatOpen(who.id)) showSocPush(who, text);
    Sfx.ding();
}

let socPushTimer = 0;

function showSocPush(who, text) {
    const box = get("socPush");
    if (!box || !who) return;
    box.hidden = false;
    box.setAttribute("data-id", who.id || "");
    const name = get("socPushWho");
    const line = get("socPushText");
    if (name) name.textContent = (who.flag ? who.flag + " " : "") + (who.name || "");
    if (line) line.textContent = String(text || "").slice(0, 90);
    clearTimeout(socPushTimer);
    socPushTimer = setTimeout(function () { box.hidden = true; }, 6000);
}

function friendSawMatch(info) {
    if (!player || !player.name) return;
    const score = info.score || "0:0";
    const goals = info.goals || 0;
    let key = "socSawLoss";
    if (goals >= 3) key = "socSawHat";
    else if (goals > 0) key = "socSawGoal";
    else if (info.result === "win") key = "socSawWin";
    else if (info.result === "draw") key = "socSawDraw";
    const line = t(key, { score: score });
    const crowd = get("crowdLine");
    if (crowd) {
        crowd.hidden = false;
        crowd.textContent = line;
        clearTimeout(friendSawMatch.timer);
        friendSawMatch.timer = setTimeout(function () { crowd.hidden = true; }, 7000);
    }
    const btn = get("socialOpen");
    if (btn) {
        btn.classList.add("soc-hot");
        setTimeout(function () { btn.classList.remove("soc-hot"); }, 3200);
    }
    ensureFriends();
    if (!player.socFriends.length) return;
    if (Date.now() - lastFriendPing < 1800000) return;
    const who = player.socFriends[socSeed(score + "|" + (player.week || 1)) % player.socFriends.length];
    dropFriendNote(who, isMessiFriend(who) ? t("socMessiSaw", { score: score }) : line);
    lastFriendPing = Date.now();
}

function queueChat(id, text) {
    if (!Array.isArray(player.socChat[id])) player.socChat[id] = [];
    const uid = "m" + Date.now() + Math.floor(Math.random() * 1000);
    player.socChat[id].push({ me: true, text: text, week: player.week || 1, at: Date.now(), uid: uid });
    if (player.socChat[id].length > 40) player.socChat[id].splice(0, player.socChat[id].length - 40);
    save();
    renderSocial();
    armReply(id, uid, 5000);
}

function sendChat(id, raw) {
    const text = String(raw || "").trim().slice(0, 80);
    if (!text || !id) return;
    ensureFriends();
    const friend = liveFriend(player.socFriends.find(function (row) { return row.id === id; }));
    if (!friend) return;
    queueChat(id, text);
}

function renderChat(feed) {
    ensureFriends();
    const friend = liveFriend(player.socFriends.find(function (row) { return row.id === socialFocusId; }));
    if (!friend) {
        socialPane = "friends";
        renderFriends(feed);
        return;
    }
    clearUnread(friend.id);
    paintUnread();
    const back = document.createElement("button");
    back.type = "button";
    back.className = "back-btn";
    back.textContent = t("socFriends");
    back.addEventListener("click", function () {
        Sfx.click();
        socialPane = "friends";
        socialFocusId = "";
        renderSocial();
    });
    feed.appendChild(back);
    const title = document.createElement("h3");
    title.textContent = (friend.flag ? friend.flag + " " : "") + friend.name;
    feed.appendChild(title);
    const log = document.createElement("div");
    log.className = "soc-chat";
    const notes = player.socChat[friend.id] || [];
    notes.forEach(function (note, i) {
        const bubble = document.createElement("p");
        bubble.className = "soc-bubble" + (note.me ? " me" : "");
        const src = notes[i - 1];
        const earlier = i >= 2 ? notes[i - 2] : null;
        const ctx = earlier && !earlier.me ? earlier.text : "";
        const regen = !note.me && !note.ping && !note.locked && src && src.me;
        fillBubble(bubble, regen ? talkReply(src.text, friend, copyCount(notes, src.text, i - 1), ctx) : chatPlain(note.text));
        log.appendChild(bubble);
    });
    let waiting = false;
    notes.forEach(function (note) {
        if (!note.me || !note.uid || note.answered || !note.at) return;
        const left = 5000 - (Date.now() - note.at);
        waiting = waiting || left > 0;
        armReply(friend.id, note.uid, left);
    });
    if (waiting) {
        const typing = document.createElement("p");
        typing.className = "soc-bubble soc-typing";
        typing.textContent = t("socTyping");
        log.appendChild(typing);
    }
    feed.appendChild(log);
    const form = document.createElement("form");
    form.className = "soc-chat-form";
    const input = document.createElement("input");
    input.maxLength = 80;
    input.placeholder = t("socChatPh");
    const ad = document.createElement("button");
    ad.type = "button";
    ad.textContent = t("socAd");
    ad.addEventListener("click", function () {
        sendAd(friend.id);
    });
    const wipe = document.createElement("button");
    wipe.type = "button";
    wipe.textContent = t("socClear");
    wipe.addEventListener("click", function () {
        Sfx.click();
        if (!player.socChat) player.socChat = {};
        player.socChat[friend.id] = [];
        clearUnread(friend.id);
        save();
        paintUnread();
        renderSocial();
    });
    form.appendChild(input);
    if (friend.id !== "fin-admin") form.appendChild(ad);
    form.appendChild(wipe);
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        sendChat(friend.id, input.value);
    });
    feed.appendChild(form);
}

function renderSocial() {
    const box = get("socialOverlay");
    if (!box || box.hidden || !player || !player.name) return;
    if (player.mode === "club") ensureFinAdmin();
    const clubMode = isClub();
    if (get("socialKind")) get("socialKind").textContent = t(clubMode ? "socClub" : "socPlayer");
    setFace(get("socialAva"), clubMode ? player.name : (player.avatar || "p0"), clubMode, clubMode ? null : wearLook());
    if (get("socialName")) get("socialName").textContent = player.name;
    const tick = get("socialTick");
    if (tick) {
        const gold = pulsePlan() === "gold";
        tick.hidden = !gold && !socVerified();
        tick.classList.toggle("gold", gold);
    }
    if (get("socialHandle")) get("socialHandle").textContent = socHandle();
    if (get("socialBio")) {
        get("socialBio").textContent = clubMode
            ? t("socBioClub", { city: ui(player.city || "—"), league: ui(player.club) })
            : t("socBioPlayer", { pos: player.position, club: ui(player.club), nation: nationLabel(player.nation) });
    }
    const posts = socialPosts();
    if (get("socialFollowers")) get("socialFollowers").textContent = socCount(followerCount());
    ensureSubs();
    if (get("socialFollowing")) get("socialFollowing").textContent = String(player.socSubs.length);
    if (get("socialPostsN")) get("socialPostsN").textContent = String(player.postCount || 0);
    if (socPitchLocked()) socHint(t("socFieldLock"));
    const composer = get("socialComposer");
    const feed = get("socialFeed");
    const detail = get("socialDetail");
    const focus = posts.find(function (post) { return post.id === socialFocusId; });
    const special = socialPane === "friends" || socialPane === "chat" || socialPane === "plan";
    const reading = (socialPane === "likes" || socialPane === "comments" || socialPane === "downs") && !!focus;
    if (socialPane === "subs") socialPane = "feed";
    if (!special && !reading) socialPane = "feed";
    const tabOn = socialPane === "chat" ? "friends" : (socialPane === "plan" || socialPane === "friends" ? socialPane : "feed");
    document.querySelectorAll("#socTabs button").forEach(function (btn) {
        btn.classList.toggle("on", btn.getAttribute("data-soc") === tabOn);
    });
    if (composer) composer.hidden = reading || special;
    if (feed) feed.hidden = !!reading;
    if (detail) detail.hidden = !reading;
    if (reading) {
        renderSocialDetail(focus);
        return;
    }
    if (!feed) return;
    feed.textContent = "";
    if (socialPane === "plan") {
        renderPlan(feed);
        return;
    }
    if (socialPane === "friends") {
        renderFriends(feed);
        return;
    }
    if (socialPane === "chat") {
        renderChat(feed);
        return;
    }
    posts.forEach(function (post) {
        const meta = postMeta(post);
        const card = document.createElement("article");
        card.className = "soc-post";
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = post.tag;
        const text = document.createElement("p");
        text.textContent = post.text;
        const when = document.createElement("small");
        when.className = "soc-when";
        when.textContent = t("socWeek", { n: post.week || player.week || 1 });
        const row = document.createElement("div");
        row.className = "soc-actions";
        const canLike = !!(post.mate || post.world);
        const mineLike = canLike && likedMate(post.id);
        const likeBtn = document.createElement("button");
        likeBtn.type = "button";
        likeBtn.className = "soc-act" + (mineLike ? " on" : "");
        likeBtn.textContent = (mineLike ? "♥ " : "♡ ") + socCount(meta.likes.length + meta.extra + (mineLike ? 1 : 0));
        likeBtn.addEventListener("click", function () {
            if (canLike) {
                toggleMateLike(post.id);
                return;
            }
            Sfx.click();
            socialPane = "likes";
            socialFocusId = post.id;
            renderSocial();
        });
        const commentBtn = document.createElement("button");
        commentBtn.type = "button";
        commentBtn.className = "soc-act";
        commentBtn.textContent = "💬 " + (meta.comments.length + userReplies(post.id).length);
        commentBtn.addEventListener("click", function () {
            Sfx.click();
            socialPane = "comments";
            socialFocusId = post.id;
            renderSocial();
        });
        row.appendChild(likeBtn);
        const mineDown = canLike && dislikedMate(post.id);
        const downBtn = document.createElement("button");
        downBtn.type = "button";
        downBtn.className = "soc-act" + (mineDown ? " down" : "");
        downBtn.textContent = "👎 " + socCount((meta.downs || []).length + (meta.downExtra || 0) + (mineDown ? 1 : 0));
        downBtn.addEventListener("click", function () {
            if (canLike) {
                toggleMateDown(post.id);
                return;
            }
            Sfx.click();
            socialPane = "downs";
            socialFocusId = post.id;
            renderSocial();
        });
        row.appendChild(downBtn);
        row.appendChild(commentBtn);
        if (post.who && post.who.id) {
            const pal = document.createElement("button");
            pal.type = "button";
            pal.className = "soc-act";
            const known = isFriend(post.who.id);
            pal.textContent = known ? t("socWrite") : t("socAddFriend");
            pal.addEventListener("click", function () {
                if (!isFriend(post.who.id) && !addFriend(friendPack(post.who))) return;
                socialPane = "chat";
                socialFocusId = post.who.id;
                renderSocial();
            });
            row.appendChild(pal);
        }
        if (post.mate || post.world) {
            const who = document.createElement("div");
            who.className = "soc-author";
            const face = document.createElement("span");
            face.className = "soc-face";
            face.innerHTML = post.crest ? crestSvg(socSeed(post.face)) : portraitSvg(avatarIndex(post.face));
            const name = document.createElement("b");
            name.textContent = post.author || "";
            if (post.tick) {
                const tick = document.createElement("i");
                tick.className = "soc-tick";
                tick.textContent = "✓";
                name.appendChild(tick);
            }
            who.appendChild(face);
            who.appendChild(name);
            card.appendChild(who);
        }
        card.appendChild(tag);
        card.appendChild(text);
        card.appendChild(when);
        card.appendChild(row);
        card.appendChild(replyRow(post.id));
        feed.appendChild(card);
    });
}

function renderSocialDetail(post) {
    const meta = postMeta(post);
    const title = get("socialDetailTitle");
    const quote = get("socialDetailPost");
    const list = get("socialDetailList");
    if (title) title.textContent = socialPane === "likes" ? t("socLikesTitle") : (socialPane === "downs" ? t("socDownsTitle") : t("socCommentsTitle"));
    if (quote) quote.textContent = post.text;
    if (!list) return;
    list.textContent = "";
    if (socialPane === "likes" || socialPane === "downs") {
        const bag = socialPane === "downs" ? (meta.downs || []) : meta.likes;
        bag.forEach(function (idx) {
            const handle = fanAt(idx);
            const row = document.createElement("div");
            row.className = "soc-person";
            const name = document.createElement("b");
            name.textContent = handle;
            row.appendChild(name);
            list.appendChild(row);
        });
        const moreN = socialPane === "downs" ? (meta.downExtra || 0) : meta.extra;
        if (moreN > 0) {
            const more = document.createElement("p");
            more.className = "hint";
            more.textContent = t("socMoreLikes", { n: socCount(moreN) });
            list.appendChild(more);
        }
        return;
    }
    meta.comments.forEach(function (key, i) {
        const handle = fanAt(meta.likes[i % Math.max(1, meta.likes.length)] || 0);
        const row = document.createElement("div");
        row.className = "soc-comment";
        const name = document.createElement("b");
        name.textContent = handle;
        const body = document.createElement("p");
        body.textContent = t("socC" + key);
        row.appendChild(name);
        row.appendChild(body);
        list.appendChild(row);
    });
    const spamRow = document.createElement("div");
    spamRow.className = "soc-comment";
    const spamName = document.createElement("b");
    spamName.textContent = fanAt(socSeed((post.id || "") + "|papa"));
    const spamBody = document.createElement("p");
    spamBody.textContent = t("socSpam");
    spamRow.appendChild(spamName);
    spamRow.appendChild(spamBody);
    list.appendChild(spamRow);
    userReplies(post.id).forEach(function (note) {
        const row = document.createElement("div");
        row.className = "soc-comment";
        const name = document.createElement("b");
        name.textContent = socHandle();
        const body = document.createElement("p");
        body.textContent = note.text;
        const likes = document.createElement("small");
        likes.textContent = "♥ " + replyLikes(note);
        row.appendChild(name);
        row.appendChild(body);
        row.appendChild(likes);
        list.appendChild(row);
    });
    list.appendChild(replyRow(post.id));
}

function publishSocial() {
    const input = get("socialDraft");
    const text = input ? input.value.trim() : "";
    if (socPitchLocked()) {
        Sfx.error();
        socHint(t("socFieldLock"));
        return;
    }
    if (!text) {
        Sfx.error();
        socHint(t("socNeedText"));
        return;
    }
    if (!Array.isArray(player.posts)) player.posts = [];
    const muddy = textMuddy(text);
    const seed = socSeed(text + "|" + Date.now());
    const likeN = muddy ? (seed % 2) : clamp(4 + Math.floor(fameValue() / 18), 3, 8);
    const commentN = muddy ? 0 : clamp(2 + (fameValue() >= 70 ? 1 : 0), 2, 4);
    player.posts.unshift({
        id: "u" + Date.now(),
        text: text.slice(0, 140),
        week: player.week || 1,
        muddy: muddy,
        likes: muddy ? [] : socRoll(seed, likeN, SOC_TAGS.length),
        comments: muddy ? [] : socRoll(seed + 3, commentN, 8).map(function (n) { return n + 1; }),
        extra: muddy ? 0 : Math.max(0, Math.round(fameValue() / 6) - likeN)
    });
    if (player.posts.length > 20) player.posts.length = 20;
    player.postCount = (player.postCount || 0) + 1;
    if (!muddy && postWorthy(text)) player.socSinceMatch = (player.socSinceMatch || 0) + 1;
    if (input) input.value = "";
    if (muddy) {
        muddyHit("socGibberish");
        Sfx.error();
    } else {
        player.socFollow = ensureFollow() + 2;
        socHint("");
        Sfx.ding();
    }
    maybeSocField();
    socialPane = "feed";
    save();
    renderSocial();
}

function retireCareer() {
    if (!player || !player.name || player.retired) return;
    if (!confirm(t("retireAsk"))) return;
    player.retired = true;
    addTitle("retired", seasonYear(), "");
    addLog(t("logRetire"));
    showAura("match", t("retireKicker"), t("retireTitle"), t("retireSub"), "#d4af37", 2400);
    Sfx.champ();
    save();
    renderAll();
    showPanel("home");
}

function openCoachCreate() {
    if (!player || !player.name) {
        Sfx.error();
        alert(t("coachNeed"));
        return;
    }
    selectMode("coach");
}

function coachWage(club) {
    return 80 + (club.required || 0) * 12;
}

function leagueForHire(club) {
    let hit = LEAGUES[0];
    LEAGUES.forEach(function (row) {
        if (row.required <= club.required) hit = row;
    });
    return hit;
}

function coachOfferList() {
    const score = Math.max(getOverall(), fameValue());
    const fit = CLUBS.filter(function (club) { return club.required <= score + 6; });
    const pool = (fit.length ? fit : CLUBS.slice(0, 1)).slice(-4);
    const seen = {};
    pool.forEach(function (club) { seen[club.name] = true; });
    CLUBS.forEach(function (club) {
        if (pool.length >= 3) return;
        if (seen[club.name]) return;
        seen[club.name] = true;
        pool.push(club);
    });
    return pool.slice(0, 4);
}

function paintCoachOffers() {
    const box = get("coachOffers");
    const lead = get("coachLead");
    if (lead) lead.textContent = t("coachLead");
    if (!box) return;
    box.innerHTML = "";
    coachOfferList().forEach(function (club) {
        const pay = coachWage(club);
        const btn = document.createElement("button");
        btn.type = "button";
        btn.setAttribute("data-hire", club.name);
        const title = document.createElement("b");
        title.textContent = club.country + " " + ui(club.name);
        const meta = document.createElement("small");
        meta.textContent = t("coachMeta", { city: ui(club.city), league: ui(club.league) }) + " · " + t("coachSign", { pay: money(pay) });
        btn.appendChild(title);
        btn.appendChild(meta);
        box.appendChild(btn);
    });
}

function startCoachCareer(clubName) {
    if (!player || !player.name) {
        Sfx.error();
        alert(t("coachNeed"));
        return;
    }
    const club = CLUBS.find(function (row) { return row.name === clubName; }) || coachOfferList().slice(-1)[0];
    if (!club) return;
    const league = leagueForHire(club);
    const pay = coachWage(club);
    if (isClub()) {
        if (!confirm(t("coachKeep", { name: ui(club.name) }))) return;
        const from = player.coachFrom || player.name;
        player.name = club.name;
        player.city = club.city;
        player.color = club.color;
        player.accent = club.accent;
        player.club = league.name;
        player.coach = true;
        player.coachFrom = from;
        player.coachWage = pay;
        player.retired = false;
        player.grid = [];
        if (typeof player.clubRep !== "number") player.clubRep = fameValue();
        player.clubOffers = null;
        Sfx.start();
        showCareer();
        addLog(t("logCoach", { name: ui(club.name), from: from, pay: money(pay) }));
        if (inPreseason()) openPreseason();
        else refreshClubOffers();
        renderAll();
        save();
        return;
    }
    if (!player.retired && !confirm(t("retireAsk"))) return;
    const from = player.name;
    if (!player.retired) {
        player.retired = true;
        addTitle("retired", seasonYear(), "");
    }
    const next = newClub(club.name, club.city, player.nation, "🏟️");
    next.club = league.name;
    next.color = club.color;
    next.accent = club.accent;
    next.respect = player.respect || 0;
    next.fame = typeof player.fame === "number" ? player.fame : 50;
    next.bank = player.bank || 0;
    next.bankPlan = player.bankPlan || "";
    next.bankUntil = player.bankUntil || 0;
    next.loan = player.loan || 0;
    next.loanPlan = player.loanPlan || "";
    next.titles = Array.isArray(player.titles) ? player.titles : [];
    next.draftTokens = player.draftTokens || 0;
    next.exclusives = Array.isArray(player.exclusives) ? player.exclusives : [];
    next.codeMadrid = !!player.codeMadrid;
    next.coach = true;
    next.coachFrom = from;
    next.coachWage = pay;
    next.clubRep = typeof player.fame === "number" ? player.fame : 50;
    next.grid = [];
    player = next;
    Sfx.start();
    showCareer();
    addLog(t("logCoach", { name: ui(club.name), from: from, pay: money(pay) }));
    if (inPreseason()) openPreseason();
    else refreshClubOffers();
    addLog(t("logFirstMatch", { n: player.nextMatchWeek }));
    renderAll();
    save();
}

function canAdvertise() {
    return ownedBrands().length > 0 || ((player && player.sponsors) || []).length > 0;
}

function adCopy() {
    const lines = [t("socAdBank")];
    ((player && player.sponsors) || []).forEach(function (deal) {
        const sp = sponsorById(deal.id);
        if (sp) lines.push(t("socAdDeal", { brand: sp.emoji + " " + sp.name }));
    });
    ownedBrands().forEach(function (brand) {
        lines.push(t("socAdFirm", { name: (brand.emoji || "") + " " + brand.name }));
    });
    return lines[socSeed(String(Date.now()) + "|" + (player.sales || 0)) % lines.length];
}

function pulsePlan() {
    const id = player && player.pulsePlan;
    return id === "silver" || id === "gold" ? id : "noob";
}

function adCap() {
    const plan = pulsePlan();
    if (plan === "gold") return Infinity;
    return plan === "silver" ? 67 : 10;
}

function adRoom() {
    const cap = adCap();
    if (cap === Infinity) return Infinity;
    return Math.max(0, cap - (player.sales || 0));
}

function adsAnnoy() {
    if (!player || pulsePlan() === "gold") return false;
    const ads = player.sales || 0;
    return ads >= 4 && ads > (player.matches || 0) + 2;
}

function bumpSales() {
    if (adRoom() <= 0 || (player.respect || 0) < 1) return null;
    player.sales = (player.sales || 0) + 1;
    let hit = 1;
    if (adsAnnoy()) {
        player.adBoost = Math.max(0, (player.adBoost || 0) - 0.35);
        hit += 1 + Math.floor(player.sales / 5);
    } else {
        player.adBoost = Math.min(2, (player.adBoost || 0) + 0.08);
    }
    player.respect = Math.max(0, (player.respect || 0) - hit);
    return -hit;
}

function buyPulse(id) {
    if (!player || (id !== "noob" && id !== "silver" && id !== "gold")) return;
    if (pulsePlan() === id) {
        socHint(t("socPlanBuy", { plan: id }));
        return;
    }
    const price = id === "gold" ? 120 : (id === "silver" ? 67 : 0);
    if ((player.respect || 0) < price) {
        Sfx.error();
        socHint(t("socPlanPoor"));
        return;
    }
    player.respect -= price;
    player.pulsePlan = id;
    addLog(t("socPlanBuy", { plan: id }));
    Sfx.ding();
    save();
    renderAll();
}

function renderPlan(feed) {
    const head = document.createElement("p");
    head.className = "hint";
    const cap = adCap();
    head.textContent = t("socPlanNow", {
        plan: pulsePlan(),
        n: (player.sales || 0) + (cap === Infinity ? "" : "/" + cap)
    });
    feed.appendChild(head);
    [["noob", "socPlanNoob"], ["silver", "socPlanSilver"], ["gold", "socPlanGold"]].forEach(function (row) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "soc-plan" + (pulsePlan() === row[0] ? " on" : "");
        btn.textContent = t(row[1]);
        btn.addEventListener("click", function () { buyPulse(row[0]); });
        feed.appendChild(btn);
    });
}

function sendAd(friendId) {
    if (!player || !player.name || !friendId) return;
    if (!canAdvertise()) {
        Sfx.error();
        socHint(t("socAdNoFirm"));
        return;
    }
    ensureFriends();
    const friend = player.socFriends.find(function (row) { return row.id === friendId; });
    if (!friend) return;
    if (adRoom() <= 0) {
        Sfx.error();
        socHint(t("socPlanCap", { plan: pulsePlan() }));
        return;
    }
    if ((player.respect || 0) < 1) {
        Sfx.error();
        socHint(t("socPlanPoor"));
        return;
    }
    const pay = bumpSales();
    if (pay < -1) {
        addLog(t("logAdTired", { hit: -pay }));
        showAura("match", t("socAdKicker"), "−" + money(-pay), t("socAdTired"), "#e57373", 1800);
        socHint(t("socAdTired"));
    } else {
        addLog(t("logAdFriend", { name: friend.name, pay: money(-pay) }));
        showAura("match", t("socAdKicker"), "−" + money(-pay), t("socAdSent", { name: friend.name }), "#ffd83d", 1800);
        socHint(t("socAdSent", { name: friend.name }));
    }
    socialPane = "chat";
    socialFocusId = friendId;
    queueChat(friendId, adCopy());
    renderAll();
}

function postAd() {
    if (!player || !player.name) return;
    if (!canAdvertise()) {
        Sfx.error();
        socHint(t("socAdNoFirm"));
        return;
    }
    if (socPitchLocked()) {
        Sfx.error();
        socHint(t("socFieldLock"));
        return;
    }
    if (adRoom() <= 0) {
        Sfx.error();
        socHint(t("socPlanCap", { plan: pulsePlan() }));
        return;
    }
    if ((player.respect || 0) < 1) {
        Sfx.error();
        socHint(t("socPlanPoor"));
        return;
    }
    const text = adCopy();
    if (!Array.isArray(player.posts)) player.posts = [];
    const seed = socSeed(text + "|" + Date.now());
    player.posts.unshift({
        id: "ad" + Date.now(),
        text: text.slice(0, 140),
        week: player.week || 1,
        muddy: false,
        likes: socRoll(seed, 8, SOC_TAGS.length),
        comments: socRoll(seed + 3, 3, 8).map(function (n) { return n + 1; }),
        extra: 0
    });
    if (player.posts.length > 20) player.posts.length = 20;
    player.postCount = (player.postCount || 0) + 1;
    const pay = bumpSales();
    if (pay < -1) {
        addLog(t("logAdTired", { hit: -pay }));
        showAura("match", t("socAdKicker"), "−" + money(-pay), t("socAdTired"), "#e57373", 2000);
        socHint(t("socAdTired"));
    } else {
        addLog(t("logAd", { pay: money(-pay), n: player.sales }));
        showAura("match", t("socAdKicker"), "−" + money(-pay), t("socAdUp", { n: player.sales }), "#ffd83d", 2000);
        socHint(t("socAdUp", { n: player.sales }));
    }
    Sfx.ding();
    socialPane = "feed";
    save();
    renderAll();
    renderSocial();
}

function openSocial() {
    if (!player || !player.name) return;
    const box = get("socialOverlay");
    if (!box) return;
    box.hidden = false;
    renderSocial();
}

function inPreseason() {
    return !!(player && player.coach) && weekInYear(player.week || 1) <= 2;
}

function ensurePrep() {
    if (!player || !player.coach) return;
    const year = finYear();
    if (!player.prep || player.prep.year !== year) {
        player.prep = { year: year, fit: false, tac: false, friend: false };
    }
}

function doPrep(kind) {
    if (!player || !player.coach || !inPreseason()) return;
    if (kind !== "fit" && kind !== "tac" && kind !== "friend") return;
    ensurePrep();
    if (player.prep[kind]) return;
    player.prep[kind] = true;
    if (kind === "fit") player.energy = Math.min(100, (player.energy || 0) + 20);
    if (kind === "friend") addFame(1);
    addLog(t("logPrep_" + kind));
    Sfx.ding();
    updateEnergy();
    updateFame();
    save();
    paintCoachDesk();
}

function coachHere() {
    const mine = CLUBS.find(function (club) { return club.name === (player && player.name); });
    return mine ? mine.required : 56;
}

function offerFits(club) {
    if (!club || !player || club.name === player.name) return false;
    const here = coachHere();
    return club.required <= here + 6 && club.required >= Math.max(0, here - 8);
}

function refreshClubOffers() {
    if (!player || !player.coach) return;
    const here = coachHere();
    const rep = clubRepValue();
    const rise = rep >= here + 8 ? 6 : rep >= here ? 3 : 0;
    let pool = CLUBS.filter(function (club) {
        return club.name !== player.name && club.required >= Math.max(0, here - 8) && club.required <= here + rise;
    });
    if (!pool.length) {
        pool = CLUBS.filter(function (club) {
            return club.name !== player.name && Math.abs(club.required - here) <= 6;
        });
    }
    const pick = [];
    const start = pool.length ? socSeed(player.name + "|" + finYear()) % pool.length : 0;
    for (let i = 0; i < pool.length && pick.length < 2; i++) pick.push(pool[(start + i) % pool.length].name);
    player.clubOffers = pick;
}

function openPreseason() {
    if (!player || !player.coach) return;
    player.grid = [];
    player.nextMatchWeek = (player.week || 1) + Math.max(1, 3 - weekInYear(player.week || 1));
    ensurePrep();
    refreshClubOffers();
    addLog(t("logPreseason"));
}

function paintCoachDesk() {
    const card = get("coachDesk");
    if (!card) return;
    const on = !!(player && player.name && player.coach);
    card.hidden = !on;
    if (!on) return;
    if (typeof player.clubRep !== "number") player.clubRep = fameValue();
    const stale = !Array.isArray(player.clubOffers) || player.clubOffers.some(function (name) {
        return !offerFits(CLUBS.find(function (club) { return club.name === name; }));
    });
    if (stale) refreshClubOffers();
    const club = get("coachDeskClub");
    if (club) club.textContent = ui(player.name);
    const rep = get("coachDeskRep");
    if (rep) rep.textContent = t("clubRepLine", { n: clubRepValue(), rank: fameRank(clubRepValue()) });
    const list = get("coachDeskTitles");
    if (list) {
        list.textContent = "";
        const rows = (player.titles || []).slice().reverse().slice(0, 4);
        if (!rows.length) {
            const li = document.createElement("li");
            li.textContent = t("coachTitlesEmpty");
            list.appendChild(li);
        } else {
            rows.forEach(function (row) {
                const li = document.createElement("li");
                li.textContent = awardName(row.id) + (row.year ? " · " + row.year : "");
                list.appendChild(li);
            });
        }
    }
    const prep = get("coachDeskPrep");
    if (prep) {
        prep.hidden = !inPreseason();
        prep.textContent = "";
        if (inPreseason()) {
            ensurePrep();
            const lead = document.createElement("p");
            lead.className = "hint";
            lead.textContent = t("prepLead");
            prep.appendChild(lead);
            [["fit", "prepFit"], ["tac", "prepTac"], ["friend", "prepFriend"]].forEach(function (row) {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.setAttribute("data-prep", row[0]);
                btn.disabled = !!player.prep[row[0]];
                btn.textContent = t(row[1]) + (player.prep[row[0]] ? " · " + t("prepDone") : "");
                prep.appendChild(btn);
            });
        }
    }
    const offers = get("coachDeskOffers");
    if (offers) {
        offers.textContent = "";
        const head = document.createElement("p");
        head.className = "hint";
        head.textContent = t("offerLead");
        offers.appendChild(head);
        (player.clubOffers || []).forEach(function (name) {
            const club = CLUBS.find(function (row) { return row.name === name; });
            if (!club || club.name === player.name) return;
            const btn = document.createElement("button");
            btn.type = "button";
            btn.setAttribute("data-offer", club.name);
            const title = document.createElement("b");
            title.textContent = club.country + " " + ui(club.name);
            const meta = document.createElement("small");
            meta.textContent = t("coachMeta", { city: ui(club.city), league: ui(club.league) }) + " · " + t("coachSign", { pay: money(coachWage(club)) });
            btn.appendChild(title);
            btn.appendChild(meta);
            offers.appendChild(btn);
        });
    }
}

function renderAll() {
    ensureStartSquad();
    paintCoachDesk();
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
    updateHook();
    updateBodyMap();
    updateBrand();
    updateOnlineUI();
    updateSaveUI();
    updateTreatUI();
    updateNationUI();
    updateTitlesUI();
    updateBallonUI();
    updateEventCal();
    renderBank();
    paintStadium();
    paintGear();
    paintShop();
    paintKit();
    updateDrop();
    paintTale();
    maybeTale();
    renderSocial();
    paintBet();
    paintBuyout();
    paintUnread();
    maybeCallUp();
    maybeGrantBallon();
}

function showModeScreen() {
    hideStudioSplash();
    closeEventCal();
    closeSocial();
    get("modeScreen").style.display = "block";
    get("createScreen").style.display = "none";
    get("careerScreen").style.display = "none";
    if (get("auctionScreen")) get("auctionScreen").style.display = "none";
    document.body.classList.remove("in-career", "mode-club", "in-auction", "matchday", "hot", "injured");
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
        ? t("continueClub", { name: player.name, club: ui(player.club), week: player.week })
        : t("continuePlayer", { name: player.name, pos: player.position, club: ui(player.club) });
}

function exitToMenu() {
    Sfx.unlock();
    Sfx.click();
    if (player && player.name) save();
    showModeScreen();
    renderRecords();
}

function selectMode(mode) {
    hideStudioSplash();
    Sfx.unlock();
    Sfx.click();
    selectedMode = mode;
    get("modeScreen").style.display = "none";
    get("createScreen").style.display = "block";
    get("playerFields").hidden = mode !== "player";
    get("clubFields").hidden = mode !== "club";
    if (get("coachFields")) get("coachFields").hidden = mode !== "coach";
    ["nationLabel", "nationPick", "avatarLabel", "avatarPick"].forEach(function (id) {
        if (get(id)) get(id).hidden = mode === "coach";
    });
    if (get("startBtn")) get("startBtn").hidden = mode === "coach";
    get("createTitle").textContent = mode === "coach"
        ? t("createCoach")
        : (mode === "club" ? t("createClub") : t("createPlayer"));
    if (get("createHeading")) {
        get("createHeading").textContent = mode === "coach"
            ? t("newCoach")
            : (mode === "club" ? t("newClub") : t("newPlayer"));
    }
    get("startBtn").textContent = mode === "club" ? t("startClub") : t("startCareer");
    if (mode === "coach") {
        if (player && player.nation) selectedNation = player.nation;
        paintCoachOffers();
        return;
    }
    if (mode === "club") {
        selectedAvatar = CLUB_AVATARS[0];
        get("clubName").focus();
        const nat = nationById(selectedNation);
        get("clubCity").placeholder = t("cityEg", { city: nationCity(nat) });
    } else {
        selectedAvatar = "👦";
        get("playerName").focus();
    }
    renderCreatePicks();
}

function renderCreatePicks() {
    const nationBox = get("nationPick");
    const avatarBox = get("avatarPick");
    if (!nationBox || !avatarBox) return;
    const avatars = selectedMode === "club" || selectedMode === "coach" ? CLUB_AVATARS : PLAYER_AVATARS;
    if (avatars.indexOf(selectedAvatar) < 0) selectedAvatar = avatars[0];

    nationBox.innerHTML = "";
    NATIONS.forEach((nat) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = nat.flag + " " + nationName(nat);
        if (nat.id === selectedNation) btn.classList.add("on");
        btn.addEventListener("click", function () {
            Sfx.click();
            selectedNation = nat.id;
            if (selectedMode === "club" || selectedMode === "coach") {
            if (nat) get("clubCity").placeholder = t("cityEg", { city: nationCity(nat) });
            }
            renderCreatePicks();
        });
        nationBox.appendChild(btn);
    });

    avatarBox.innerHTML = "";
    const label = get("avatarLabel");
    if (selectedMode !== "club" && selectedMode !== "coach") {
        if (label) label.textContent = t("shopSkin");
        selectedAvatar = "👦";
        if (SKIN_TONES.indexOf(selectedSkin) < 0) selectedSkin = "#e7b48a";
        SKIN_TONES.forEach(function (color) {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "kit-swatch" + (color === selectedSkin ? " on" : "");
            btn.style.background = color;
            btn.addEventListener("click", function () {
                Sfx.click();
                selectedSkin = color;
                renderCreatePicks();
            });
            avatarBox.appendChild(btn);
        });
        const preview = document.createElement("span");
        preview.className = "age-face";
        preview.textContent = personEmoji(ageFace(16), selectedSkin);
        avatarBox.appendChild(preview);
        return;
    }
    if (label) label.textContent = t("avatar");
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
    hideStudioSplash();
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
    if (id === "shop" && isClub()) id = "club";
    if (id === "stad" && player && player.name && !isClub()) id = "home";
    document.querySelectorAll(".panel").forEach(function (panel) {
        panel.classList.toggle("on", panel.getAttribute("data-panel") === id);
    });
    document.querySelectorAll(".career-tabs button").forEach(function (btn) {
        btn.classList.toggle("on", btn.getAttribute("data-panel") === id);
    });
}

const STADIUM = [
    { seats: 2000, gate: 8 },
    { seats: 9000, gate: 30, cost: 250 },
    { seats: 22000, gate: 70, cost: 800 },
    { seats: 48000, gate: 140, cost: 2000 },
    { seats: 80000, gate: 240, cost: 4500 }
];

function stadNum(n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function ensureGear() {
    if (!player) return;
    if (!player.gear || typeof player.gear.at !== "number") {
        const flip = ((player.name || "").length) % 2;
        player.gear = { at: 0, every: flip ? 11 : 10 };
    }
    if (player.gear.every !== 10 && player.gear.every !== 11) player.gear.every = 10;
}

function gearLeft() {
    ensureGear();
    return player.gear.every - ((player.matches || 0) - player.gear.at);
}

function gearDue() {
    if (!player || !player.name || !isClub()) return false;
    return gearLeft() <= 0;
}

function gearCost() {
    ensureStadium();
    return 90 + ((player.stadium && player.stadium.level) || 0) * 50;
}

function paintGear() {
    if (!player || !player.name) return;
    const due = gearDue();
    const left = gearLeft();
    const cost = gearCost();
    const hintText = due
        ? t("gearRust", { pay: money(cost) })
        : t(left === 1 ? "gearLeft1" : "gearLeft", { n: left });
    ["stadGear", "stadKGear"].forEach(function (id) {
        const node = get(id);
        if (!node) return;
        node.hidden = false;
        node.textContent = hintText;
    });
    const matchHint = get("gearHint");
    if (matchHint) {
        matchHint.hidden = !due;
        matchHint.textContent = hintText;
    }
    ["gearBuy", "stadGearBtn", "stadKGearBtn"].forEach(function (id) {
        const btn = get(id);
        if (!btn) return;
        btn.hidden = !due;
        btn.disabled = !due;
        btn.textContent = t("gearBuy", { pay: money(cost) });
    });
    if (propsDue() && matchHint) {
        matchHint.hidden = false;
        matchHint.textContent = t("propMiss");
    }
}

function buyGear() {
    if (!player || !player.name || !gearDue()) return;
    const cost = gearCost();
    if (tillShort(cost)) {
        Sfx.error();
        addLog(t("gearNeed", { pay: money(cost) }));
        return;
    }
    chargeAsk(homeClubName(), "yard", cost, function (ok, pay) {
        if (!ok) return;
        ensureGear();
        player.gear.at = player.matches || 0;
        player.gear.every = player.gear.every === 10 ? 11 : 10;
        Sfx.ding();
        addLog(t("gearNew", { pay: money(pay), n: player.gear.every }));
        updateRespect();
        paintGear();
        updateScheduleUI();
        save();
    }, { id: "gear" });
}

function ensureStadium() {
    if (!player) return;
    if (!player.stadium || typeof player.stadium.level !== "number") {
        player.stadium = { level: 0, crowd: 0, pay: 0 };
    }
    player.stadium.level = Math.max(0, Math.min(STADIUM.length - 1, player.stadium.level | 0));
}

function ensureYard() {
    if (!player) return;
    if (!player.yard) player.yard = { lines: false, staff: false };
    if (!player.yard.props || typeof player.yard.props !== "object") player.yard.props = {};
    if (!player.yard.ups || typeof player.yard.ups !== "object") player.yard.ups = {};
}

const YARD_COST = { lines: 100, staff: 160 };
const YARD_PROPS = [
    { id: "goals", cost: 180 },
    { id: "balls", cost: 80 },
    { id: "nets", cost: 60 },
    { id: "flags", cost: 40 },
    { id: "cones", cost: 50 }
];
const YARD_UPS = [
    { id: "lights", cost: 240 },
    { id: "gym", cost: 320 },
    { id: "drain", cost: 180 },
    { id: "med", cost: 260 }
];

function propsDue() {
    if (!player || !player.name || !isClub()) return false;
    ensureYard();
    return YARD_PROPS.some(function (row) { return !player.yard.props[row.id]; });
}

function trainEnergy() {
    ensureYard();
    return player.yard.ups.drain ? 12 : TRAIN_COST;
}

function buyYardItem(group, id) {
    const table = group === "props" ? YARD_PROPS : YARD_UPS;
    const row = table.find(function (item) { return item.id === id; });
    if (!player || !player.name || !row) return;
    ensureYard();
    if (player.yard[group][id]) return;
    if (tillShort(row.cost)) {
        Sfx.error();
        addLog(t(group === "props" ? "propNeed" : "upNeed", { name: t("yard_" + id), pay: money(row.cost) }));
        return;
    }
    chargeAsk(homeClubName(), "yard", row.cost, function (ok, pay) {
        if (!ok) return;
        player.yard[group][id] = true;
        Sfx.ding();
        addLog(t(group === "props" ? "propBuy" : "upBuy", { name: t("yard_" + id), pay: money(pay) }));
        updateRespect();
        paintStadium();
        updateScheduleUI();
        save();
    }, { id: id });
}

function buyYard(kind) {
    if (!player || !player.name || !YARD_COST[kind]) return;
    ensureYard();
    if (player.yard[kind]) return;
    const cost = YARD_COST[kind];
    if (tillShort(cost)) {
        Sfx.error();
        addLog(t(kind === "lines" ? "linesNeed" : "staffNeed", { pay: money(cost) }));
        return;
    }
    chargeAsk(homeClubName(), "yard", cost, function (ok, pay) {
        if (!ok) return;
        player.yard[kind] = true;
        Sfx.ding();
        addLog(t(kind === "lines" ? "linesBuy" : "staffBuy", { pay: money(pay) }));
        updateRespect();
        paintStadium();
        save();
    }, { id: kind });
}

function paintStadium() {
    const clubBox = get("stadClub");
    if (clubBox) clubBox.hidden = !(player && player.name && isClub());
    if (!player || !player.name) return;
    ensureStadium();
    ["stad", "stadK"].forEach(function (prefix) {
        const bowl = get(prefix + "Bowl");
        if (!bowl) return;
        const row = STADIUM[player.stadium.level];
        const next = STADIUM[player.stadium.level + 1];
        ensureYard();
        bowl.setAttribute("data-lv", String(player.stadium.level));
        bowl.setAttribute("data-mark", player.yard.lines ? "1" : "0");
        const crew = get(prefix + "Crew");
        if (crew) {
            const got = YARD_PROPS.filter(function (row) { return player.yard.props[row.id]; }).length;
            const ownedUps = YARD_UPS.filter(function (row) { return player.yard.ups[row.id]; }).map(function (row) { return t("yard_" + row.id); });
            crew.textContent = t(player.yard.lines ? "linesOn" : "linesOff") + " · " + t(player.yard.staff ? "staffOn" : "staffOff")
                + " · " + t("propLine", { have: got, n: YARD_PROPS.length })
                + (ownedUps.length ? " · " + ownedUps.join(", ") : "");
        }
        paintYardShop(prefix);
        const linesBtn = get(prefix + "Lines");
        if (linesBtn) {
            linesBtn.hidden = !!player.yard.lines;
            linesBtn.textContent = t("linesBtn", { pay: money(YARD_COST.lines) });
        }
        const staffBtn = get(prefix + "Staff");
        if (staffBtn) {
            staffBtn.hidden = !!player.yard.staff;
            staffBtn.textContent = t("staffBtn", { pay: money(YARD_COST.staff) });
        }
        const name = get(prefix + "Name");
        if (name) name.textContent = t("stadName", { club: ui(player.club) });
        const rank = get(prefix + "Rank");
        if (rank) rank.textContent = t("stad" + player.stadium.level);
        const seats = get(prefix + "Seats");
        if (seats) seats.textContent = stadNum(row.seats);
        const gate = get(prefix + "Gate");
        if (gate) gate.textContent = money(row.gate);
        const last = get(prefix + "Last");
        if (last) {
            last.textContent = player.stadium.crowd
                ? t("stadLast", { n: stadNum(player.stadium.crowd), pay: money(player.stadium.pay || 0) })
                : t("stadEmpty");
        }
        const btn = get(prefix + "Up");
        if (!btn) return;
        if (!next) {
            btn.disabled = true;
            btn.textContent = t("stadMax");
        } else {
            btn.disabled = false;
            btn.textContent = t("stadUp", { pay: money(next.cost) });
        }
    });
}

function paintYardShop(prefix) {
    const props = get(prefix + "Props");
    const ups = get(prefix + "Ups");
    if (props) {
        props.innerHTML = "";
        YARD_PROPS.forEach(function (row) {
            if (player.yard.props[row.id]) return;
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "gold";
            btn.setAttribute("data-prop", row.id);
            btn.textContent = t("yardBtn", { name: t("yard_" + row.id), pay: money(row.cost) });
            props.appendChild(btn);
        });
    }
    if (ups) {
        ups.innerHTML = "";
        YARD_UPS.forEach(function (row) {
            if (player.yard.ups[row.id]) return;
            const btn = document.createElement("button");
            btn.type = "button";
            btn.setAttribute("data-up", row.id);
            btn.textContent = t("yardBtn", { name: t("yard_" + row.id), pay: money(row.cost) });
            ups.appendChild(btn);
        });
    }
}

function upgradeStadium() {
    if (!player || !player.name) return;
    ensureStadium();
    const next = STADIUM[player.stadium.level + 1];
    if (!next) return;
    if (player.coach) {
        chargeAsk(homeClubName(), "stad", next.cost, function (ok) {
            if (!ok) return;
            player.stadium.level += 1;
            Sfx.ding();
            addLog(t("stadBuilt", { name: t("stad" + player.stadium.level) }));
            updateRespect();
            paintStadium();
            save();
        }, { id: "stad" });
        return;
    }
    if ((player.respect || 0) < next.cost) {
        Sfx.error();
        addLog(t("stadNeed", { pay: money(next.cost) }));
        return;
    }
    player.respect -= next.cost;
    player.stadium.level += 1;
    Sfx.ding();
    addLog(t("stadBuilt", { name: t("stad" + player.stadium.level) }));
    updateRespect();
    paintStadium();
    save();
}

function takeStadiumGate(result) {
    if (!isClub()) return null;
    ensureStadium();
    const row = STADIUM[player.stadium.level];
    const fill = result === "win" ? 0.92 : result === "draw" ? 0.74 : 0.58;
    const crowd = Math.round(row.seats * fill);
    const mul = result === "win" ? 1.25 : result === "draw" ? 1 : 0.7;
    ensureYard();
    let pay = Math.max(1, Math.round(row.gate * mul));
    if (!player.yard.staff) pay = Math.max(1, Math.round(pay * 0.5));
    if (player.yard.ups && player.yard.ups.lights) pay = Math.max(1, Math.round(pay * 1.2));
    player.stadium.crowd = crowd;
    player.stadium.pay = pay;
    player.respect = (player.respect || 0) + pay;
    return { crowd: crowd, pay: pay };
}

const BANK_SAVES = {
    copy: { rate: 0.04, lock: 0, best: false },
    season: { rate: 0.12, lock: 1, best: false },
    long: { rate: 0.18, lock: 3, best: true }
};

const BANK_LOANS = {
    small: { cap: 800, rate: 0.08 },
    mid: { cap: 2500, rate: 0.14 }
};

function bankSavePlan() {
    return BANK_SAVES[player.bankPlan] || null;
}

function bankLoanType() {
    if (!player || !player.loanPlan || BANK_LOANS[player.loanPlan]) return null;
    return BRAND_TYPES.find(function (bt) { return bt.id === player.loanPlan; }) || null;
}

function bankLoanFixed() {
    return (player && BANK_LOANS[player.loanPlan]) || null;
}

function bankLockLeft() {
    const until = player.bankUntil || 0;
    if (!until || player.week >= until) return 0;
    return Math.ceil((until - player.week) / YEAR_WEEKS);
}

function readSum(id) {
    const raw = get(id) && String(get(id).value || "").trim();
    if (!raw) return null;
    const n = Math.floor(Number(raw));
    if (!n || n < 1) return 0;
    return n;
}

function bankTake() {
    return readSum("bankSum");
}

function debtTake() {
    return readSum("debtSum");
}

function renderBank() {
    if (!player) return;
    const cash = get("bankCash");
    const save = get("bankSave");
    const debt = get("bankDebt");
    const debtCard = get("bankDebtCard");
    const hint = get("bankHint");
    const debtHint = get("debtHint");
    if (cash) cash.textContent = money(player.respect || 0);
    const plan = bankSavePlan();
    const held = player.bank || 0;
    if (save) {
        save.textContent = held && plan
            ? money(held) + " · " + t("bankSave_" + player.bankPlan)
            : money(held);
    }
    const loan = bankLoanType();
    const fixed = bankLoanFixed();
    const owe = player.loan || 0;
    const pledge = get("bankPledge");
    const debtText = owe && fixed
        ? money(owe) + " · " + t("bankLoan_" + player.loanPlan)
        : owe && loan
            ? money(owe) + " · +" + Math.round(loan.loanRate * 100) + "%"
            : money(owe);
    if (debt) debt.textContent = debtText;
    if (debtCard) debtCard.textContent = debtText;
    if (pledge) {
        const mine = loan && ownedBrand(loan.id);
        pledge.textContent = mine
            ? (mine.emoji + " " + mine.name + " · " + t("bankGrade" + loan.grade))
            : (fixed && owe ? t("bankPledgeFree") : t("bankNoPledge"));
    }
    if (hint) {
        const left = bankLockLeft();
        hint.textContent = left ? t("bankLocked", { n: left }) : t("bankSaveHint");
    }
    if (debtHint) debtHint.textContent = t("bankHint");
    document.querySelectorAll("[data-save]").forEach(function (btn) {
        btn.classList.toggle("on", btn.getAttribute("data-save") === player.bankPlan && held > 0);
    });
    const loans = get("bankLoans");
    if (loans) {
        loans.textContent = "";
        ["small", "mid"].forEach(function (id) {
            const offer = BANK_LOANS[id];
            const btn = document.createElement("button");
            btn.type = "button";
            btn.setAttribute("data-loan", id);
            btn.classList.toggle("on", player.loanPlan === id && owe > 0);
            btn.textContent = t("bankOffer_" + id, {
                cap: money(offer.cap),
                rate: Math.round(offer.rate * 100)
            });
            loans.appendChild(btn);
        });
        const note = document.createElement("p");
        note.className = "hint";
        note.textContent = t("bankBigNeed");
        loans.appendChild(note);
        const list = ownedBrands().slice().sort(function (a, b) {
            const ta = brandTypeById(a.type);
            const tb = brandTypeById(b.type);
            return (tb.grade || 0) - (ta.grade || 0) || (tb.loanCap || 0) - (ta.loanCap || 0);
        });
        if (!list.length) {
            const p = document.createElement("p");
            p.className = "hint";
            p.textContent = t("bankNoFirm");
            loans.appendChild(p);
        }
        list.forEach(function (brand) {
            const type = brandTypeById(brand.type);
            const btn = document.createElement("button");
            btn.type = "button";
            btn.setAttribute("data-loan", type.id);
            btn.classList.toggle("best", type.id === "agency");
            btn.classList.toggle("on", player.loanPlan === type.id && owe > 0);
            btn.textContent = t("bankLoanBtn", {
                name: (brand.emoji || type.emoji) + " " + brand.name,
                grade: t("bankGrade" + (type.grade || 1)),
                cap: money(type.loanCap || 0),
                rate: Math.round((type.loanRate || 0) * 100)
            });
            loans.appendChild(btn);
        });
    }
}

function bankIn(kind) {
    const offer = BANK_SAVES[kind];
    if (!offer) return;
    const held = player.bank || 0;
    if (held > 0 && player.bankPlan && player.bankPlan !== kind) {
        Sfx.error();
        addLog(t("bankOther"));
        return;
    }
    const room = player.respect || 0;
    const n = bankTake();
    const sum = n === null ? room : Math.min(n, room);
    if (sum < 1) {
        Sfx.error();
        addLog(t("bankPoor"));
        return;
    }
    player.respect -= sum;
    player.bank = held + sum;
    player.bankPlan = kind;
    if (offer.lock > 0) {
        const season = Math.floor((Math.max(1, player.week) - 1) / YEAR_WEEKS);
        const until = (season + offer.lock) * YEAR_WEEKS + 1;
        if (until > (player.bankUntil || 0)) player.bankUntil = until;
    }
    Sfx.click();
    addLog(t("logBankIn", { n: money(sum), plan: t("bankSave_" + kind) }));
    renderAll();
    save();
}

function bankOut() {
    if (bankLockLeft() > 0) {
        Sfx.error();
        addLog(t("bankLocked", { n: bankLockLeft() }));
        return;
    }
    const room = player.bank || 0;
    const n = bankTake();
    const sum = n === null ? room : Math.min(n, room);
    if (sum < 1) {
        Sfx.error();
        addLog(t("bankEmpty"));
        return;
    }
    player.bank -= sum;
    player.respect = (player.respect || 0) + sum;
    if (player.bank < 1) {
        player.bank = 0;
        player.bankPlan = "";
        player.bankUntil = 0;
    }
    Sfx.click();
    addLog(t("logBankOut", { n: money(sum) }));
    renderAll();
    save();
}

function bankBorrow(kind) {
    const fixed = BANK_LOANS[kind];
    const type = fixed ? null : BRAND_TYPES.find(function (bt) { return bt.id === kind; });
    if (!fixed && !(type && type.loanCap)) return;
    const mine = type ? ownedBrand(type.id) : null;
    if (type && !mine) {
        Sfx.error();
        addLog(t("bankNeedFirm"));
        return;
    }
    const owe = player.loan || 0;
    if (owe > 0) {
        Sfx.error();
        addLog(t("bankOtherLoan"));
        return;
    }
    const cap = fixed ? fixed.cap : type.loanCap;
    const room = cap - owe;
    const n = debtTake();
    const sum = n === null ? room : Math.min(n, room);
    if (room < 1 || sum < 1) {
        Sfx.error();
        addLog(t("bankNoLoan", { n: money(cap) }));
        return;
    }
    player.loan = owe + sum;
    player.loanPlan = kind;
    player.respect = (player.respect || 0) + sum;
    Sfx.ding();
    const plan = fixed
        ? t("bankLoan_" + kind)
        : ((mine.emoji || type.emoji) + " " + mine.name);
    addLog(t("logBankLoan", { n: money(sum), plan: plan }));
    renderAll();
    save();
}

function bankRepay() {
    const owe = player.loan || 0;
    const cash = player.respect || 0;
    const n = debtTake();
    const sum = n === null ? Math.min(owe, cash) : Math.min(n, owe, cash);
    if (owe < 1) {
        Sfx.error();
        addLog(t("bankNoDebt"));
        return;
    }
    if (sum < 1) {
        Sfx.error();
        addLog(t("bankPoor"));
        return;
    }
    player.respect -= sum;
    player.loan = owe - sum;
    if (player.loan < 1) {
        player.loan = 0;
        player.loanPlan = "";
    }
    Sfx.click();
    addLog(t("logBankPay", { n: money(sum) }));
    renderAll();
    save();
}

function bankSeason() {
    const save = player.bank || 0;
    const plan = bankSavePlan();
    if (save > 0 && plan) {
        const add = Math.max(1, Math.round(save * plan.rate));
        player.bank = save + add;
        addLog(t("logBankGrow", { n: money(add), plan: t("bankSave_" + player.bankPlan) }));
    }
    const owe = player.loan || 0;
    if (owe > 0) {
        const fixed = bankLoanFixed();
        const loan = bankLoanType();
        const rate = fixed ? fixed.rate : (loan ? loan.loanRate : 0.18);
        const add = Math.max(1, Math.round(owe * rate));
        const label = fixed ? t("bankLoan_" + player.loanPlan) : (loan ? t("firm_" + loan.id) : t("bankDebt"));
        let due = add;
        const fromCash = Math.min(player.respect || 0, due);
        player.respect = (player.respect || 0) - fromCash;
        due -= fromCash;
        const fromBank = Math.min(player.bank || 0, due);
        player.bank = (player.bank || 0) - fromBank;
        due -= fromBank;
        if (player.bank < 1) {
            player.bank = 0;
            player.bankPlan = "";
            player.bankUntil = 0;
        }
        if (due > 0) {
            player.loan = owe + due;
            addLog(t("logBankDebt", { n: money(due), plan: label }));
        } else {
            addLog(t("logBankPaid", { n: money(add), plan: label }));
        }
    }
}

function advanceWeek() {
    player.week += 1;
    const nextAge = 16 + Math.floor((player.week - 1) / 36);
    if (nextAge > player.age) {
        player.age = nextAge;
        addLog(t("logBday", { n: player.age }));
        updateHeader();
        Sfx.ding();
        if (player.age >= 30) {
            addLog(t("logOver30"));
        }
        maybeGoat();
    }
    payoutBrand();
    payoutSponsors();
    if (player.coach && player.coachWage) {
        player.respect = (player.respect || 0) + player.coachWage;
        addLog(t("logCoachPay", { n: money(player.coachWage) }));
    }
    if (player.boss && player.boss.wage) {
        const wage = player.boss.wage;
        const name = shown(player.boss);
        if ((player.respect || 0) < wage) {
            player.boss = null;
            addLog(t("bossFired", { name: name }));
        } else {
            player.respect -= wage;
            addLog(t("bossPay", { name: name, n: money(wage) }));
        }
    }
    clearInjuryIfHealed();
    friendPing(true);
    if (player.week > 1 && (player.week - 1) % YEAR_WEEKS === 0) {
        bankSeason();
        if (player.mode === "club") auditYear();
        if (player.coach) openPreseason();
    }
}

function needEnergy(cost) {
    if (player.energy >= cost) return true;
    Sfx.error();
    addLog(t("logNeedEnergy"));
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
    const gone = !!(player && player.retired);
    const seconds = restRemain();
    document.querySelectorAll("[data-train]").forEach((button) => {
        button.disabled = locked || gone;
    });
    const restBtn = get("restBtn");
    const restFastBtn = get("restFastBtn");
    const dockRest = get("dockRest");
    const price = restFastPrice();
    const broke = (player.respect || 0) < price;
    [restBtn, dockRest].forEach((button) => {
        if (!button) return;
        button.disabled = locked || gone;
        if (button.id === "dockRest") {
            button.textContent = locked ? "⏳ " + seconds + t("sec") : t("dockRest");
        } else {
            button.textContent = locked
                ? t("waitSec", { s: seconds })
                : t("restFree");
        }
    });
    if (restFastBtn) {
        restFastBtn.disabled = locked || gone || broke;
        restFastBtn.textContent = locked
            ? "⏳ " + seconds + " " + t("secWord")
            : (broke ? t("need") + " " + money(price) : t("restPaid") + " · " + money(price));
    }
    const hint = get("restLockHint");
    if (hint) {
        hint.hidden = !locked;
        hint.textContent = locked
            ? t("restPause", { s: seconds })
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

function trainNeed(stat) {
    const cur = (player && player.stats && player.stats[stat]) || 0;
    let need = 1;
    if (cur >= 95) need = 4;
    else if (cur >= 90) need = 3;
    else if (cur >= 80) need = 2;
    if (player && player.age >= 30) need += 1;
    if (isInjured()) need += 1;
    if (player && player.yard && player.yard.ups && player.yard.ups.gym) need = Math.max(1, need - 1);
    return need;
}

function trainBank(stat, next) {
    if (!player.trainBank || typeof player.trainBank !== "object" || Array.isArray(player.trainBank)) player.trainBank = {};
    if (typeof next === "number") player.trainBank[stat] = next;
    return player.trainBank[stat] || 0;
}

function applyTrain(stat) {
    const need = trainNeed(stat);
    const got = trainBank(stat) + 1;
    if (got < need) {
        trainBank(stat, got);
        return 0;
    }
    trainBank(stat, 0);
    player.stats[stat] = Math.min(99, (player.stats[stat] || 0) + 1);
    return 1;
}

function startCareer() {
    Sfx.unlock();
    Sfx.click();
    if (selectedMode === "coach") return;
    if (localStorage.getItem(SAVE_KEY) && player && player.name) {
        if (!confirm(t("confirmOverwrite"))) return;
    }
    if (selectedMode === "club") {
        const name = get("clubName").value.trim();
        if (!name) {
            Sfx.error();
            alert(t("alertClubName"));
            get("clubName").focus();
            return;
        }
        const city = get("clubCity").value.trim() || nationById(selectedNation).city;
        player = newClub(name, city, selectedNation, selectedAvatar);
        Sfx.start();
        showCareer();
        addLog(t("logClubBorn", { name: player.name, city: player.city, nation: nationLabel(player.nation) }));
        addLog(t("logFirstMatch", { n: player.nextMatchWeek }));
        grantPendingPromo();
        save();
        return;
    }
    const name = get("playerName").value.trim();
    if (!name) {
        Sfx.error();
        alert(t("alertPlayerName"));
        get("playerName").focus();
        return;
    }
    const position = get("position").value;
    player = newPlayer(name, position, selectedNation, selectedAvatar);
    player.skin = selectedSkin;
    Sfx.start();
    showCareer();
    addLog(t("logCareerBorn", { name: player.name, pos: player.position, nation: nationLabel(player.nation) }));
    addLog(t("logFirstMatch", { n: player.nextMatchWeek }));
    grantPendingPromo();
    save();
}

function train(stat) {
    Sfx.unlock();
    if (!player.name) return;
    if (player.retired) {
        Sfx.error();
        addLog(t("logRetired"));
        return;
    }
    if (player.stats[stat] === undefined) return;
    if (restLocked()) {
        Sfx.error();
        addLog(t("logRestLock", { n: restRemain() }));
        return;
    }
    const drill = trainEnergy();
    if (!needEnergy(drill)) return;
    if (player.stats[stat] >= 99) {
        Sfx.error();
        addLog(t("logStatMax", { stat: statWord(stat) }));
        return;
    }
    player.energy -= drill;
    const need = trainNeed(stat);
    const gain = applyTrain(stat);
    advanceWeek();
    Sfx.train();
    addLog((gain
        ? t("logTrain", { stat: statWord(stat), n: gain })
        : t("logTrainSlow", { stat: statWord(stat), have: trainBank(stat), need: need })) + (isInjured() ? t("rehab") : ""));
    renderAll();
    save();
}

function rest() {
    Sfx.unlock();
    if (!player.name) return;
    if (player.retired) {
        Sfx.error();
        addLog(t("logRetired"));
        return;
    }
    if (restLocked()) {
        Sfx.error();
        addLog(t("logRestWaitTrain", { n: restRemain() }));
        return;
    }
    const restGain = REST_GAIN + (player.yard && player.yard.ups && player.yard.ups.med ? 20 : 0);
    player.energy = Math.min(ENERGY_MAX, player.energy + restGain);
    player.restUntil = Date.now() + REST_LOCK_MS;
    Sfx.rest();
    addLog(t("logRest", { n: player.energy }));
    showAura(
        "rest",
        t("restAura"),
        t("energyN", { n: player.energy }),
        t("restAuraSub"),
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
    if (player.retired) {
        Sfx.error();
        addLog(t("logRetired"));
        return;
    }
    if (restLocked()) {
        Sfx.error();
        addLog(t("logRestWait", { n: restRemain() }));
        return;
    }
    const price = restFastPrice();
    if ((player.respect || 0) < price) {
        Sfx.error();
        addLog(t("logRestCost", { pay: money(price) }));
        return;
    }
    player.respect -= price;
    player.energy = ENERGY_MAX;
    player.restUntil = Date.now() + REST_FAST_MS;
    Sfx.rest();
    addLog(t("logRestPaid", { pay: money(price) }));
    showAura(
        "rest",
        t("boost"),
        t("energy100"),
        t("restPaidSub", { pay: money(price) }),
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
    name.textContent = (card.flag ? card.flag + " " : "") + ui(card.n);
    const meta = document.createElement("small");
    meta.textContent = (card.p === "CLUB" ? ui(card.c) : card.p + " · " + ui(card.c)) +
        " · OVR " + card.o +
        (card.ping ? " · " + card.ping + (langEn() ? " ms" : " мс") : "");
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
        ? t("onlineNeed")
        : busy
            ? t("onlineBusy")
            : locked
                ? t("onlineWait", { n: wait })
                : (low ? t("onlineLow") : t("onlineBtn"));
    if (btn) {
        btn.disabled = !can;
        btn.textContent = label;
    }
    if (dock) {
        dock.disabled = !can;
        dock.textContent = locked ? t("dockBattleWait", { n: wait }) : (low ? t("dockBattleLow") : t("dockBattle"));
    }
}

let pvpPoll = 0;

function pvpSession() {
    try {
        const name = localStorage.getItem("fc-pvp-name") || "";
        const pin = localStorage.getItem("fc-pvp-pin") || "";
        if (name && pin) return { name: name, pin: pin };
    } catch (err) {}
    return null;
}

function stopPvpPoll() {
    if (pvpPoll) {
        clearInterval(pvpPoll);
        pvpPoll = 0;
    }
}

function pvpLeave() {
    stopPvpPoll();
    const session = pvpSession();
    if (!session) return;
    fetch("/api/leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(session)
    }).catch(function () {});
}

function paintPvpGate() {
    const reg = get("pvpReg");
    const wait = get("pvpWait");
    const session = pvpSession();
    if (reg) reg.hidden = !!session;
    if (wait) wait.hidden = !session;
    const hint = get("pvpRegHint");
    const name = get("pvpName");
    const pin = get("pvpPin");
    const enter = get("pvpRegBtn");
    const hello = get("pvpWaitText");
    const queueBtn = get("pvpQueueBtn");
    const botBtn = get("pvpBotBtn");
    if (hint) hint.textContent = t("pvpRegHint");
    if (name) name.placeholder = t("pvpName");
    if (pin) pin.placeholder = t("pvpPin");
    if (enter) enter.textContent = t("pvpEnter");
    if (hello && session) hello.textContent = t("pvpHello", { name: session.name });
    if (queueBtn) queueBtn.textContent = t("pvpQueue");
    if (botBtn) botBtn.textContent = t("pvpBot");
}

function pvpEnter() {
    const nameEl = get("pvpName");
    const pinEl = get("pvpPin");
    const name = nameEl ? nameEl.value.trim() : "";
    const pin = pinEl ? pinEl.value : "";
    if (name.length < 2 || pin.length < 4) {
        Sfx.error();
        get("battleSub").textContent = t("pvpBad");
        return;
    }
    fetch("/api/enter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name, pin: pin })
    }).then(function (res) {
        if (res.status === 403) {
            Sfx.error();
            get("battleSub").textContent = t("pvpWrong");
            return null;
        }
        if (!res.ok) {
            Sfx.error();
            get("battleSub").textContent = t("pvpBad");
            return null;
        }
        return res.json();
    }).then(function (data) {
        if (!data || !data.ok) return;
        localStorage.setItem("fc-pvp-name", data.name || name);
        localStorage.setItem("fc-pvp-pin", pin);
        paintPvpGate();
        get("battleSub").textContent = t("pvpHello", { name: data.name || name });
        Sfx.ding();
    }).catch(function () {
        Sfx.error();
        get("battleSub").textContent = t("pvpOff");
    });
}

function pvpQueue() {
    const session = pvpSession();
    if (!session) return;
    const card = myBattleCard();
    card.pvp = true;
    fetch("/api/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: session.name, pin: session.pin, card: card })
    }).then(function (res) {
        if (!res.ok) throw new Error("queue");
        return res.json();
    }).then(function () {
        get("battleTitle").textContent = t("search");
        get("battleSub").textContent = t("pvpWait");
        stopPvpPoll();
        pvpPoll = setInterval(pvpPollTick, 1200);
    }).catch(function () {
        Sfx.error();
        get("battleSub").textContent = t("pvpOff");
    });
}

function pvpPollTick() {
    const session = pvpSession();
    const overlay = get("battleOverlay");
    if (!session || !overlay || overlay.hidden) {
        stopPvpPoll();
        return;
    }
    const q = "name=" + encodeURIComponent(session.name) + "&pin=" + encodeURIComponent(session.pin);
    fetch("/api/poll?" + q).then(function (res) { return res.json(); }).then(function (data) {
        if (!data || data.state !== "found" || !data.rival) return;
        stopPvpPoll();
        showOnlineFound(data.rival);
    }).catch(function () {});
}

function closeOnlineLobby() {
    if (onlineTimer) {
        clearTimeout(onlineTimer);
        onlineTimer = null;
    }
    pvpLeave();
    onlineRival = null;
    const overlay = get("battleOverlay");
    if (overlay) overlay.hidden = true;
}

function openOnlineLobby() {
    Sfx.unlock();
    if (player && player.retired) {
        Sfx.error();
        addLog(t("logRetired"));
        return;
    }
    if (!player.name) {
        Sfx.error();
        addLog(t("logNeedCareer"));
        return;
    }
    if (matchBusy) return;
    if (isInjured()) {
        Sfx.error();
        addLog(t("logNoBattleInj", { label: injuryLabel() }));
        return;
    }
    if (onlineLocked()) {
        Sfx.error();
        addLog(t("logBattleWait", { n: onlineRemain() }));
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
    get("battleKicker").textContent = t("arena");
    get("battleTitle").textContent = t("search");
    get("battleSub").textContent = t("scan");
    paintPvpGate();
    Sfx.ding();
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
        get("battleSub").textContent = t("scanning", { n: ghost.n, ping: ping });
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
    get("battleTitle").textContent = t("foundRival");
    get("battleSub").textContent = rival.pvp
        ? t("pvpTag")
        : rival.live
            ? t("friendCard", { o: rival.o })
            : t("pingOvr", { ping: rival.ping, o: rival.o });
    Sfx.ding();
    if (onlineTimer) clearTimeout(onlineTimer);
}

function joinOnlineCode() {
    Sfx.click();
    const raw = (get("friendBattleCode") && get("friendBattleCode").value) || "";
    const card = unpackBattle(raw);
    if (!card) {
        Sfx.error();
        get("battleSub").textContent = t("badCode");
        return;
    }
    const mine = packBattle(myBattleCard());
    if (raw.trim() === mine) {
        Sfx.error();
        get("battleSub").textContent = t("ownCode");
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
            get("battleSub").textContent = t("copied");
        }).catch(function () {
            el.select();
        });
        return;
    }
    el.select();
}

function playOnline() {
    if (!player.name || matchBusy || !onlineRival) return;
    if (isInjured()) {
        Sfx.error();
        addLog(t("logNoBattleInj", { label: injuryLabel() }));
        closeOnlineLobby();
        return;
    }
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

    showAura("match", "0'", "0:0", ui(me.n) + " vs " + ui(rival.n), "#a78bfa", 900);
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
    const marks = pvpMarks(scored, conceded);
    marks.forEach(function (row, i) {
        setTimeout(function () {
            showAura("match", row.min + "'", row.score, ui(me.n) + " vs " + ui(rival.n), "#a78bfa", 900);
        }, 700 * (i + 1));
    });
    const summary = "🌐 " + score + " vs " + ui(rival.n) +
        (pen ? " · " + t("pensShort") + " " + pen.us + ":" + pen.them : "") +
        (rival.pvp ? " · " + t("pvpTag") : (rival.live ? " · " + t("codeTag") : ""));

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
                t("onlineWin", { pay: money(gained) }),
                score,
                "vs " + ui(rival.n) + (pen ? " · " + t("pensTag") : ""),
                "#32d583",
                2000
            );
            addLog(t("logWin", { score: score, name: ui(rival.n) }), "goal");
        } else {
            Sfx.miss();
            showAura(
                "match",
                t("onlineLose", { pay: money(gained) }),
                score,
                "vs " + ui(rival.n),
                "#c4b5fd",
                1700
            );
            addLog(t("logLose", { score: score, name: ui(rival.n) }));
        }
        addLog(t("logCash", { pay: money(gained), total: money(player.respect) }));
        if (fameDelta) {
            addLog(t(fameDelta > 0 ? "logFameUp" : "logFameDown", { n: fameDelta, rank: fameRank(fameValue()), val: fameValue() }));
        }
        player.socPitchNeed = false;
        player.socSinceMatch = 0;
        matchBusy = false;
        startRestTicker();
        renderAll();
        save();
    }, 700 * (marks.length + 1) + 500);
}

function pvpMarks(scored, conceded) {
    const events = [];
    let i;
    for (i = 0; i < scored; i++) events.push("us");
    for (i = 0; i < conceded; i++) events.push("them");
    for (i = events.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = events[i];
        events[i] = events[j];
        events[j] = tmp;
    }
    const mins = [14, 28, 43, 57, 71, 84];
    let us = 0;
    let them = 0;
    if (!events.length) return [{ min: 90, score: "0:0" }];
    return events.map(function (side, index) {
        if (side === "us") us += 1;
        else them += 1;
        return { min: mins[index] || 88, score: us + ":" + them };
    });
}

function startOnlineFromMenu() {
    Sfx.unlock();
    Sfx.click();
    if (!player || !player.name) {
        Sfx.error();
        alert(t("alertNeedCard"));
        return;
    }
    showCareer();
    openOnlineLobby();
}

function skipInjuredMatch() {
    Sfx.unlock();
    if (!player.name || matchBusy || !isInjured() || !matchDue()) return;
    voidBet();
    matchBusy = true;
    ensureCalendar();
    const fixture = pendingFixture();
    const opponent = fixture ? fixtureName(fixture) : nextOppName();
    advanceWeek();
    player.streak = 0;
    if (fixture) {
        fixture.result = "injury";
        fixture.score = "—";
        fixture.pens = "";
    }
    const text = (isClub() ? t("skipLastClub") : t("skipLastPlayer")) + " · " + player.injury.emoji + " " + t("inj_" + (player.injury.id || "bruise")) + " vs " + opponent;
    player.lastMatch = { text: text, result: "injury" };
    showAura(
        "injury",
        injuryLabel(),
        t("skipTitle"),
        "vs " + opponent + " · " + t("streakReset"),
        "#e57373",
        1800
    );
    Sfx.injury ? Sfx.injury() : Sfx.error();
    addLog(t("logSkip", { opp: opponent, label: injuryLabel() }));
    scheduleNextMatch();
    matchBusy = false;
    renderAll();
    save();
}

const BUYOUT = 2000;
let betPick = "win";
let betStake = 50;

function betOpen() {
    return !!(player && player.bet && typeof player.bet.stake === "number");
}

function betOdds(pick) {
    const ovr = getOverall();
    const opp = (clubByName(player.club).required || 50);
    const edge = (ovr - opp) / 18;
    const raw = pick === "win" ? 2.35 - edge * 0.7 : pick === "loss" ? 2.15 + edge * 0.85 : 3.1;
    return Math.round(clamp(raw, 1.4, 4.6) * 10) / 10;
}

function paintBet() {
    const card = get("betCard");
    if (!card) return;
    const on = !!(player && player.name && !player.retired);
    card.hidden = !on;
    if (!on) return;
    const hint = get("betHint");
    const go = get("betGo");
    if (betOpen()) {
        const bet = player.bet;
        if (hint) hint.textContent = t("betWait", { pick: t("bet_" + bet.pick), pay: money(bet.stake), odds: bet.odds });
        if (go) go.disabled = true;
    } else {
        if (hint) hint.textContent = t("betHint");
        if (go) {
            go.disabled = false;
            go.textContent = t("betGo", { pay: money(betStake), pick: t("bet_" + betPick), odds: betOdds(betPick) });
        }
    }
    document.querySelectorAll("#betPick button").forEach(function (btn) {
        btn.classList.toggle("on", btn.getAttribute("data-bet") === betPick);
        btn.disabled = betOpen();
        const pick = btn.getAttribute("data-bet");
        btn.textContent = t("bet_" + pick) + " · ×" + betOdds(pick);
    });
    document.querySelectorAll("#betStake button").forEach(function (btn) {
        btn.classList.toggle("on", Number(btn.getAttribute("data-stake")) === betStake);
        btn.disabled = betOpen();
    });
}

function placeBet() {
    if (!player || !player.name || player.retired || betOpen()) {
        Sfx.error();
        return;
    }
    if ((player.respect || 0) < betStake) {
        Sfx.error();
        addLog(t("betNeed", { pay: money(betStake) }));
        return;
    }
    const odds = betOdds(betPick);
    player.respect -= betStake;
    player.bet = { pick: betPick, stake: betStake, odds: odds, due: player.nextMatchWeek };
    Sfx.click();
    addLog(t("logBetOn", { pick: t("bet_" + betPick), pay: money(betStake), odds: odds }));
    updateRespect();
    paintBet();
    save();
}

function settleBet(result) {
    if (!betOpen()) return;
    const bet = player.bet;
    player.bet = null;
    if (bet.pick === result) {
        const pay = Math.round(bet.stake * bet.odds);
        player.respect = (player.respect || 0) + pay;
        addLog(t("logBetWin", { pay: money(pay) }));
        Sfx.ding();
    } else {
        addLog(t("logBetLose", { pay: money(bet.stake) }));
    }
}

function voidBet() {
    if (!betOpen()) return;
    const stake = player.bet.stake;
    player.respect = (player.respect || 0) + stake;
    player.bet = null;
    addLog(t("logBetBack", { pay: money(stake) }));
}

function boughtClubs() {
    if (!Array.isArray(player.boughtClubs)) player.boughtClubs = [];
    return player.boughtClubs;
}

function ownsClub(name) {
    return boughtClubs().indexOf(name) >= 0;
}

function paintBuyout() {
    const card = get("buyoutCard");
    if (!card) return;
    const show = !!(player && player.name && !isClub() && !player.retired);
    card.hidden = !show;
    if (!show) return;
    const mates = matesForClub(player.club);
    const list = get("buyoutList");
    const owned = ownsClub(player.club);
    if (list) {
        list.innerHTML = "";
        if (!mates.length) {
            const empty = document.createElement("p");
            empty.className = "hint";
            empty.textContent = t("buyoutEmpty");
            list.appendChild(empty);
        } else {
            mates.forEach(function (star) {
                const row = document.createElement("div");
                row.className = "market-row";
                const who = document.createElement("div");
                who.className = "who";
                who.textContent = (star.flag ? star.flag + " " : "") + shown(star);
                const meta = document.createElement("small");
                meta.textContent = star.pos + " · " + star.ovr;
                who.appendChild(meta);
                row.appendChild(who);
                list.appendChild(row);
            });
        }
    }
    const hint = get("buyoutHint");
    if (hint) hint.textContent = t("buyoutHint", { club: ui(player.club), n: mates.length });
    const btn = get("buyoutBtn");
    if (!btn) return;
    if (owned) {
        btn.disabled = true;
        btn.textContent = t("buyoutYours");
    } else if (!mates.length) {
        btn.disabled = true;
        btn.textContent = t("buyoutWait");
    } else {
        btn.disabled = false;
        btn.textContent = t("buyoutBtn", { pay: money(BUYOUT) });
    }
}

function buyoutTeam() {
    if (!player || !player.name || isClub() || player.retired) return;
    if (ownsClub(player.club)) return;
    const mates = matesForClub(player.club);
    if (!mates.length) {
        Sfx.error();
        return;
    }
    if (tillShort(BUYOUT)) {
        Sfx.error();
        addLog(t("buyoutNeed", { pay: money(BUYOUT) }));
        return;
    }
    const clubName = player.club;
    const count = mates.length;
    chargeAsk(clubName, "player", BUYOUT, function (ok, pay) {
        if (!ok) return;
        if (ownsClub(clubName)) return;
        boughtClubs().push(clubName);
        Sfx.transferBig(70);
        addLog(t("logBuyout", { club: ui(clubName), n: count, pay: money(pay) }));
        showAura("transfer", "−" + money(pay), ui(clubName), t("buyoutYours"), "#ffd83d", 1800);
        renderAll();
        save();
    });
}

function playMatch(useBribe) {
    Sfx.unlock();
    if (!player.name || matchBusy) return;
    if (player.retired) {
        Sfx.error();
        addLog(t("logRetired"));
        return;
    }
    if (isInjured()) {
        if (matchDue()) skipInjuredMatch();
        else {
            Sfx.error();
            addLog("🤕 " + injuryLabel());
        }
        return;
    }
    if (propsDue()) {
        Sfx.error();
        addLog(t("propMiss"));
        paintStadium();
        updateScheduleUI();
        return;
    }
    if (gearDue()) {
        Sfx.error();
        addLog(t("gearRust", { pay: money(gearCost()) }));
        paintGear();
        updateScheduleUI();
        return;
    }
    if (!matchDue()) {
        Sfx.error();
        addLog(t("logOnlyCal", { n: player.nextMatchWeek, opp: nextOppName() }));
        updateScheduleUI();
        return;
    }
    if (!needEnergy(MATCH_COST)) return;

    useBribe = useBribe === true;
    let bribeOk = false;
    let bribeFined = false;
    if (useBribe) {
        const fee = bribeCost();
        const dirty = !!player.coach;
        const purse = dirty ? (player.stolen || 0) : (player.respect || 0);
        if (purse < fee) {
            Sfx.error();
            addLog(t(dirty ? "logBribeStolen" : "logBribeNeed", { pay: money(fee) }));
            return;
        }
        if (dirty) player.stolen = purse - fee;
        else player.respect -= fee;
        if (Math.random() < clamp(BRIBE_CATCH + (50 - fameValue()) / 250, 0.58, 0.82)) {
            bribeFined = true;
            const fine = fineCost();
            player.respect = Math.max(0, (player.respect || 0) - fine);
            Sfx.error();
            addLog(t("logCaught", { pay: money(fine) }), "goal");
        } else {
            bribeOk = true;
            Sfx.ding();
            addLog(t("logBribed"));
        }
        updateRespect();
    }

    matchBusy = true;
    updateScheduleUI();
    updateOnlineUI();

    ensureCalendar();
    const fixture = pendingFixture();
    const intl = !!(fixture && fixture.intl);
    const opponent = fixture ? fixtureName(fixture) : nextOppName();

    player.energy -= MATCH_COST;
    player.matches += 1;
    const rusted = gearDue();
    player.socPitchNeed = false;
    player.socSinceMatch = 0;
    advanceWeek();
    updateEnergy();
    updateHeader();

    const ovr = getOverall();
    const club = clubByName(player.club);
    const diff = intl ? nationPower(fixture.opp) : Math.max(club.required, 55);
    let squadBoost = 0;
    if (isClub()) {
        const xi = clubLineup();
        const starters = xi.slots.map(function (slot) { return slot.star; }).filter(Boolean);
        if (!starters.length) squadBoost = -0.28;
        else {
            const avg = starters.reduce(function (sum, star) { return sum + star.ovr; }, 0) / starters.length;
            const depth = Math.min(SQUAD_BENCH, xi.bench.length) * 0.02;
            squadBoost = ((avg - 76) / 28) * (starters.length / SQUAD_XI) + depth;
        }
        if (player.boss && player.boss.ovr) {
            squadBoost += clamp((player.boss.ovr - 74) / 90, 0, 0.2);
        }
        if (player.coach && player.prep && player.prep.year === finYear()) {
            const bits = (player.prep.fit ? 1 : 0) + (player.prep.tac ? 1 : 0) + (player.prep.friend ? 1 : 0);
            squadBoost += bits * 0.04;
        }
    } else if (ownsClub(player.club)) {
        const mates = matesForClub(player.club);
        if (mates.length) {
            const avg = mates.reduce(function (sum, star) { return sum + (star.ovr || 60); }, 0) / mates.length;
            squadBoost = ((avg - 70) / 40) * 0.45;
        }
    }
    const delta = clamp((ovr - diff) / 22 + (fameValue() - 50) / 140 + squadBoost, -0.9, 1.25);
    const role = isClub() ? { goal: 1.15, assist: 0.9, save: 0 } : (ROLE[player.position] || ROLE.ST);
    const plan = matchPlan || "balance";
    const shift = plan === "attack"
        ? { atk: 1.15, def: -0.95 }
        : plan === "defend"
            ? { atk: -0.7, def: 1.15 }
            : { atk: 0, def: 0 };

    showAura("match", intl ? nationLabel(player.nation) : (club.country + "  " + ui(club.league)), t("whistle") + " · " + t("plan_" + plan), "vs " + opponent, club.color || "#ffd83d", 1100);
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
        conceded = Math.max(0, Math.round(conceded - shift.def));
        if (plan === "defend" && Math.random() < 0.35) {
            saves += 1;
            conceded = Math.max(0, conceded - 1);
        }
        saves = Math.min(shots + 1, saves);
        player.saves += saves;
        player.conceded = (player.conceded || 0) + conceded;
        scored = Math.max(0, Math.round(0.7 + shift.atk + Math.random() * 2.3 + delta * 0.45));
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
        const teamBase = clamp(1.1 + delta * 1.2 + goals * 0.4 + shift.atk, 0.15, 4.8);
        const oppBase = clamp(1.25 - defDelta * 1.3 - shift.def, 0.1, 4.4);
        scored = Math.max(goals, Math.round(teamBase + Math.random() * 1.3 - 0.4));
        conceded = Math.max(0, Math.round(oppBase + Math.random() * 1.2 - 0.5));
        if (s.marking >= 80 && Math.random() < 0.3) conceded = Math.max(0, conceded - 1);
        if (s.tackling >= 82 && Math.random() < 0.25) conceded = Math.max(0, conceded - 1);
        if (conceded === 0) player.cleanSheets = (player.cleanSheets || 0) + 1;
    } else {
        const attack = clamp(0.22 + delta * 0.28 + (plan === "attack" ? 0.16 : plan === "defend" ? -0.1 : 0), 0.05, 0.88) * role.goal;
        const roll = Math.random();
        if (roll < attack * 0.28) goals = 2;
        else if (roll < attack) goals = 1;

        const assistChance = clamp(0.16 + delta * 0.12, 0.05, 0.55) * role.assist;
        if (Math.random() < assistChance * 0.25) assists = 2;
        else if (Math.random() < assistChance) assists = 1;

        player.goals += isClub() ? 0 : goals;
        player.assists += isClub() ? 0 : assists;

        const teamBase = clamp(1.2 + delta * 1.4 + goals * 0.35 + shift.atk, 0.15, 5.2);
        const oppBase = clamp(1.1 - delta * 1.1 - shift.def, 0.1, 4.6);
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

    let benched = false;
    if (!isClub() && onBench()) {
        benched = true;
        const cameoG = goals > 0 && Math.random() < 0.28 ? 1 : 0;
        const cameoA = assists > 0 && Math.random() < 0.22 ? 1 : 0;
        if (goals > cameoG) player.goals = Math.max(0, (player.goals || 0) - (goals - cameoG));
        if (assists > cameoA) player.assists = Math.max(0, (player.assists || 0) - (assists - cameoA));
        goals = cameoG;
        assists = cameoA;
        if (isGk() && saves > 1) {
            const keep = Math.max(1, Math.round(saves * 0.35));
            player.saves = Math.max(0, (player.saves || 0) - (saves - keep));
            saves = keep;
        }
        if (isCb() && tackles > 1) {
            const keep = Math.max(1, Math.round(tackles * 0.4));
            player.tackles = Math.max(0, (player.tackles || 0) - (tackles - keep));
            tackles = keep;
        }
    }

    let pen = null;
    let result = "draw";
    if (scored > conceded) result = "win";
    else if (scored < conceded) result = "loss";
    settleBet(result);

    if (result === "win") {
        player.streak = (player.streak || 0) + 1;
        if (!isClub()) player.wins = (player.wins || 0) + 1;
    } else if (result === "draw") {
        if (!isClub()) player.draws = (player.draws || 0) + 1;
    } else {
        player.streak = 0;
        if (!isClub()) player.losses = (player.losses || 0) + 1;
    }

    if (isClub()) {
        player.goals += scored;
        player.conceded = (player.conceded || 0) + conceded;
        if (result === "win") player.wins = (player.wins || 0) + 1;
        else if (result === "draw") player.draws = (player.draws || 0) + 1;
        else player.losses = (player.losses || 0) + 1;
        if (player.coach) {
            const delta = result === "win" ? 4 : result === "draw" ? 1 : -3;
            player.clubRep = clamp(clubRepValue() + delta, 1, 99);
        }
    }

    if (fixture) {
        fixture.result = result;
        fixture.score = scored + ":" + conceded;
        fixture.pens = pen ? (pen.us + ":" + pen.them) : "";
        if ((player.grid || []).indexOf(fixture) < 0) player.grid.push(fixture);
    }

    if (intl) player.ntCaps = (player.ntCaps || 0) + 1;

    let summary = (benched ? "🪑 " : "") + scored + ":" + conceded + " vs " + opponent +
        (pen ? (" · " + t("pensShort") + " " + pen.us + ":" + pen.them) : "") +
        (isClub() ? "" : isGk()
            ? (" · " + t("savesN", { n: saves }) + (conceded === 0 ? " · " + t("cleanTag") : "") + (assists ? " · " + t("assistTag") : ""))
            : isCb()
                ? (" · " + t("tacklesN", { n: tackles }) + (goals ? " · " + t("headerTag") : "") + (conceded === 0 ? " · " + t("cleanTag") : ""))
                : (
                    (goals ? " · " + t("youGoals", { n: goals }) : "") +
                    (assists ? " · " + t("assistsN", { n: assists }) : "")
                )) +
        (bribeOk ? " · " + t("refTag") : "") +
        (bribeFined ? " · " + t("fineTag") : "");

    const injuryHit = rollMatchInjury();
    if (injuryHit) {
        summary += " · " + injuryHit.emoji + " " + t("inj_" + injuryHit.id);
    }

    let gained = result === "win" ? 20 : result === "draw" ? 10 : 3;
    gained += goals * 15;
    gained += assists * 10;
    gained += saves * 3;
    gained += tackles * 2;
    if ((player.streak || 0) >= 2) gained += (player.streak - 1) * 6;
    if (isGk() && conceded === 0) gained += 18;
    if (isCb() && conceded === 0) gained += 12;
    gained += Math.round((fameValue() - 50) / 20);
    player.respect = (player.respect || 0) + Math.max(0, gained);
    const gate = takeStadiumGate(result);
    const adPay = takeKitAd(result);

    let fameGain = result === "win" ? 4 : result === "draw" ? 2 : 1;
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
        if (benched) addLog(t("logYouBench", { ovr: getOverall(), club: ui(player.club) }));

        if (pen) {
            if (pen.win) Sfx.goal();
            else Sfx.miss();
            showAura(
                pen.win ? "champ" : "match",
                t("pensAura", { a: pen.us, b: pen.them }),
                scored + ":" + conceded,
                (pen.win ? t("winWord") : t("loseWord")) + " vs " + opponent + "  +" + money(gained) +
                    (player.streak > 1 ? " · " + t("streak") + " ×" + player.streak : ""),
                pen.win ? "#32d583" : "#e57373",
                2000
            );
            addLog(t("logPens", { a: pen.us, b: pen.them, opp: opponent, res: pen.win ? t("winWord") : t("loseWord") }), pen.win ? "goal" : "");
        } else if (result === "draw") {
            Sfx.whistle();
            showAura("match", t("drawAura", { pay: money(gained) }), scored + ":" + conceded, "vs " + opponent, "#8aa0c8", 1600);
            addLog(t("logDraw", { score: scored + ":" + conceded, opp: opponent }));
        } else if (isGk()) {
            if (conceded === 0) {
                Sfx.goal();
                showAura("champ", t("cleanSheet", { pay: money(gained) }), scored + ":" + conceded, t("savesN", { n: saves }) + " vs " + opponent, "#32d583", 1800);
                addLog(t("logClean", { score: scored + ":" + conceded, opp: opponent, n: saves }), "goal");
            } else {
                Sfx.whistle();
                showAura("match", t("savesAura", { n: saves }), scored + ":" + conceded, "vs " + opponent + "  +" + money(gained), "#7dd3fc", 1600);
                addLog(t("logSaves", { score: scored + ":" + conceded, opp: opponent, n: saves }));
            }
        } else if (isCb()) {
            if (goals > 0) {
                Sfx.goal();
                showAura("goal", t("headerGoal", { pay: money(gained) }), scored + ":" + conceded, t("tacklesN", { n: tackles }) + " vs " + opponent, "#ffd83d", 1800);
                addLog(t("logHeader", { score: scored + ":" + conceded, opp: opponent, n: tackles }), "goal");
            } else if (conceded === 0) {
                Sfx.whistle();
                showAura("match", t("cleanSheet", { pay: money(gained) }), scored + ":" + conceded, t("tacklesN", { n: tackles }) + " vs " + opponent, "#32d583", 1600);
                addLog(t("logCleanCb", { n: tackles, opp: opponent }));
            } else {
                Sfx.whistle();
                showAura("match", t("tacklesAura", { n: tackles }), scored + ":" + conceded, "vs " + opponent + "  +" + money(gained), "#8aa0c8", 1500);
                addLog(t("logTackles", { score: scored + ":" + conceded, opp: opponent, n: tackles }));
            }
        } else if (goals > 0) {
            Sfx.goal();
            showAura("goal", t("goalAura", { pay: money(gained) }), scored + ":" + conceded, "vs " + opponent, "#ffd83d", 1800);
            addLog(t("logGoals", { score: scored + ":" + conceded, opp: opponent, n: goals }), "goal");
        } else if (result === "win") {
            Sfx.whistle();
            showAura(
                "match",
                (player.streak >= 2 ? t("streakAura", { n: player.streak, pay: money(gained) }) : t("winAura", { pay: money(gained) })),
                scored + ":" + conceded,
                t("keepGoing", { opp: opponent }),
                "#32d583",
                1800
            );
            addLog(t("logMatchWin", { score: scored + ":" + conceded, opp: opponent, streak: player.streak >= 2 ? " · " + t("streak") + " ×" + player.streak : "" }));
        } else {
            Sfx.miss();
            showAura("match", t("loseAura", { pay: money(gained) }), scored + ":" + conceded, "vs " + opponent, "#8aa0c8", 1500);
            addLog(t("logMatch", { score: scored + ":" + conceded, opp: opponent }));
        }
        addLog(t("logCash", { pay: money(gained), total: money(player.respect) }));
        if (gate && gate.pay) addLog(t("stadCash", { n: stadNum(gate.crowd), pay: money(gate.pay) }));
        if (adPay) addLog(t("kitAdPay", { name: kitPickName(KIT_ADS, player.kit.ad), pay: money(adPay) }));
        if (rusted) addLog(t("gearLog"));
        if (fameDelta) {
            addLog(t(fameDelta > 0 ? "logFameUp" : "logFameDown", { n: fameDelta, rank: fameRank(fameValue()), val: fameValue() }));
        }
        if (injuryHit) {
            if (Sfx.injury) Sfx.injury();
            addLog(t("logInj", { label: injuryHit.emoji + " " + t("inj_" + (injuryHit.id || "bruise")), n: injuryHit.until }));
            setTimeout(function () {
                showAura(
                    "injury",
                    isClub() ? t("injAuraClub") : t("injAura"),
                    injuryHit.emoji + " " + t("inj_" + (injuryHit.id || "bruise")).toUpperCase(),
                    (injuryHit.part ? t("injPart", { part: t("part_" + injuryHit.part) }) : "") + t("wardUntil", { n: injuryHit.until }),
                    "#e57373",
                    2200
                );
            }, 900);
        }

        if (player.matches % 5 === 0) {
            const keys = statKeys();
            const stat = keys[Math.floor(Math.random() * keys.length)];
            if (player.stats[stat] < 87) {
                player.stats[stat] += 1;
                addLog(t("logForm", { stat: statWord(stat) }));
                Sfx.ding();
            }
        }

        scheduleNextMatch();
        maybeCallUp();
        friendSawMatch({ result: result, goals: goals, score: scored + ":" + conceded });
        matchBusy = false;
        renderAll();
        save();
    }, 1100);
}

function stepBonus(row) {
    return 20 + row.required * 2;
}

function transferTo(club) {
    Sfx.unlock();
    if (!player || player.retired) {
        Sfx.error();
        addLog(t("logRetire"));
        return;
    }
    const list = isClub() ? LEAGUES : CLUBS;
    const fromReq = clubByName(player.club).required;
    const steps = list.filter(function (row) {
        return row.required > fromReq && row.required <= club.required;
    });
    const path = steps.length ? steps : [club];
    const bonus = path.reduce(function (sum, row) { return sum + stepBonus(row); }, 0);
    player.club = club.name;
    player.respect = (player.respect || 0) + bonus;
    const peak = isClub() ? club.name === "Финал ЛЧ" : club.name === "Real Madrid";
    path.forEach(function (row) {
        const top = isClub() ? row.name === "Финал ЛЧ" : row.name === "Real Madrid";
        addTitle(top ? (isClub() ? "ucl" : "club") : (isClub() ? "league" : "club"), seasonYear(), row.name);
    });
    if (peak) {
        Sfx.champ();
        addLog(isClub() ? t("logPeakClub") : t("logPeakPlayer"), "goal");
        showAura("champ", "+" + money(bonus), ui(club.name), isClub() ? t("peakClubSub") : t("welcome", { city: ui(club.city) }), club.accent, 2800);
    } else {
        Sfx.transferBig(club.required);
        addLog(isClub() ? t("logPromote", { name: ui(club.name) }) : t("logTransfer", { name: ui(club.name), city: ui(club.city) }));
        showAura("transfer", "+" + money(bonus), ui(club.name), isClub() ? t("newLeague", { league: ui(club.league) }) : t("welcome", { city: ui(club.city) }), club.color, 2400);
    }
    if (path.length > 1) {
        addLog(t(isClub() ? "logJumpLeague" : "logJump", { n: path.length, pay: money(bonus) }));
    }
    addLog(t("logCash", { pay: money(bonus), total: money(player.respect) }));
    const fameDelta = addFame(6);
    if (fameDelta) addLog(t("logFameUp", { n: fameDelta, rank: fameRank(fameValue()), val: fameValue() }));
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
        title.textContent = ui(club.name);
        info.appendChild(title);
        const meta = document.createElement("div");
        meta.className = "meta";
        meta.textContent = ui(club.city) + " · " + ui(club.league) + " · OVR " + club.required;
        info.appendChild(meta);
        row.appendChild(info);

        if (player.club === club.name) {
            row.classList.add("current");
            const mark = document.createElement("b");
            mark.textContent = isClub() ? t("currentClub") : t("currentPlayer");
            row.appendChild(mark);
        } else if (club.required < currentReq) {
            row.classList.add("passed");
            const mark = document.createElement("b");
            mark.textContent = isClub() ? t("passedClub") : t("passedPlayer");
            row.appendChild(mark);
        } else if (player.retired) {
            row.classList.add("locked");
            const mark = document.createElement("b");
            mark.textContent = t("retiredBtn");
            row.appendChild(mark);
        } else if (overall >= club.required) {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = isClub() ? t("promote") : t("transfer");
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

function starCost(ovr, star) {
    if (star && star.tier === "rook") return star.youth === "u17" ? 16 : 32;
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

let clubAsk = null;

function homeClubName() {
    if (!player) return "";
    if (isClub()) return player.name || player.club || "";
    return player.club || "";
}

function squadBar() {
    if (!player) return 60;
    if (isClub()) {
        const stars = squadStars();
        if (!stars.length) return 52;
        const sum = stars.reduce(function (total, star) { return total + (star.ovr || 60); }, 0);
        return Math.round(sum / stars.length);
    }
    return getOverall();
}

function tillShort(cost) {
    return !(player && player.coach) && (player.respect || 0) < cost;
}

function clubPop() {
    if (!player) return 48;
    const row = CLUBS.find(function (club) { return club.name === player.name; });
    if (row) return row.required;
    return Math.max(40, Math.min(92, fameValue()));
}

function dealWeight(kind, meta) {
    const id = meta && meta.id || "";
    const small = { lines: 1, flags: 1, cones: 1, nets: 1, balls: 1, goals: 2, gear: 2, kit: 1, slip: 1 };
    const solid = { staff: 3, lights: 4, drain: 4, med: 4, gym: 5, academy: 5, stad: 6 };
    if (kind === "player") {
        const ovr = meta && meta.ovr || 60;
        if (ovr >= 90) return 8;
        if (ovr >= 84) return 6;
        if (ovr >= 78) return 4;
        if (ovr >= 70) return 3;
        return 1;
    }
    if (small[id]) return small[id];
    if (solid[id]) return solid[id];
    if (kind === "stad") return 6;
    if (kind === "yard") return 2;
    return 2;
}

function dealListName(kind, meta) {
    if (meta && meta.name) return meta.name;
    const id = meta && meta.id || "";
    if (id === "lines" || id === "staff" || id === "gear" || id === "stad" || id === "slip" || id === "kit" || id === "academy") {
        return t("askItem_" + id);
    }
    if (id) {
        const label = t("yard_" + id);
        if (label && label !== "yard_" + id) return label;
    }
    return t(kind === "player" ? "askItem_player" : "askItem_yard");
}

function skimLimit() {
    const pop = clubPop();
    if (pop >= 78) return 280;
    if (pop >= 52) return 520;
    return 980;
}

function pocketSkim(pay, cost) {
    const skim = Math.max(0, Math.round(pay) - Math.round(cost || 0));
    if (!skim) return 0;
    player.stolen = (player.stolen || 0) + skim;
    player.skimmed = (player.skimmed || 0) + skim;
    return skim;
}

function catchThief() {
    if (!player || !player.coach) return false;
    if ((player.skimmed || 0) < skimLimit()) return false;
    const fine = Math.max(80, Math.round(player.skimmed * 0.65));
    const drop = Math.min(28, 12 + Math.round(player.skimmed / 80));
    player.respect = Math.max(0, (player.respect || 0) - fine);
    addFame(-drop);
    const club = player.name || "";
    player.stolen = 0;
    player.coach = false;
    player.coachWage = 0;
    player.fired = club;
    addLog(t("logThief", { club: ui(club), pay: money(fine), fame: drop }));
    Sfx.error();
    updateFame();
    return true;
}

function auditYear() {
    if (!player || player.mode !== "club") return;
    const who = ensureFinAdmin();
    const skimmed = player.skimmed || 0;
    if (skimmed >= skimLimit()) {
        if (player.coach) catchThief();
        else {
            const fine = Math.max(80, Math.round(skimmed * 0.65));
            const drop = Math.min(28, 12 + Math.round(skimmed / 80));
            player.respect = Math.max(0, (player.respect || 0) - fine);
            addFame(-drop);
            player.stolen = 0;
            addLog(t("logThief", { club: ui(player.name || ""), pay: money(fine), fame: drop }));
            Sfx.error();
            updateFame();
        }
        player.skimmed = 0;
        player.finOut = 0;
        player.finYear = finYear();
        if (who) dropFriendNote(who, t("finAuditBad", { pay: money(skimmed) }));
        return;
    }
    const note = skimmed ? t("finAuditOk", { pay: money(skimmed) }) : t("finAuditClean");
    player.skimmed = 0;
    player.finOut = 0;
    player.finYear = finYear();
    if (who) dropFriendNote(who, note);
}

function coachVerdict(pay, kind, meta) {
    pay = Math.round(Number(pay));
    if (!isFinite(pay) || pay < 1) return { ok: false, why: "sum", pay: 0 };
    if (pay > 999999) pay = 999999;
    const cash = player.respect || 0;
    if (cash < pay) return { ok: false, why: "cash", pay: pay };
    const pop = clubPop();
    const weight = dealWeight(kind, meta);
    const tight = pop >= 78 ? 22 : pop >= 52 ? 40 : 140;
    if (weight <= 2 && pay > weight * tight) return { ok: false, why: "list", pay: pay };
    if (pay > weight * tight * 3) return { ok: false, why: "list", pay: pay };
    return { ok: true, why: "deal", pay: pay };
}

function clubVerdict(cost, tier) {
    const squad = squadBar();
    const fame = fameValue();
    const cash = player.respect || 0;
    const pay = Math.max(1, Math.round(cost * (tier === "cheap" ? 0.62 : 1.28)));
    if (cash < pay) return { ok: false, why: "cash", pay: pay };
    if (tier === "cheap") {
        if (squad >= 81 && cost >= 90) return { ok: false, why: "squad", pay: pay };
        if (fame >= 86 && squad >= 76 && cost >= 160) return { ok: false, why: "fame", pay: pay };
        return { ok: true, why: "cheap", pay: pay };
    }
    if (fame < 58 && pay >= 400) return { ok: false, why: "fame", pay: pay };
    if (squad < 66 && pay >= 700) return { ok: false, why: "squad", pay: pay };
    return { ok: true, why: "rich", pay: pay };
}

function openClubAsk(clubName, kind, done, meta) {
    const box = get("askOverlay");
    if (!box || clubAsk) {
        if (done) done("busy");
        return;
    }
    const coach = !!(player && player.coach);
    clubAsk = { done: done, coach: coach };
    const kicker = get("askKicker");
    const title = get("askTitle");
    const text = get("askText");
    const acts = get("askActs");
    const who = ui(clubName || homeClubName() || "");
    if (kicker) kicker.textContent = t("askKicker");
    if (title) title.textContent = who;
    if (text) {
        text.textContent = coach
            ? t("askDeal", { club: who, list: dealListName(kind, meta), fair: money((meta && meta.fair) || 0) })
            : t("askBoard", { club: who });
    }
    if (acts) {
        acts.textContent = "";
        if (coach) {
            const input = document.createElement("input");
            input.id = "askSum";
            input.className = "ask-sum";
            input.type = "number";
            input.inputMode = "numeric";
            input.min = "1";
            input.placeholder = t("askSumPh");
            input.addEventListener("keydown", function (event) {
                if (event.key !== "Enter") return;
                event.preventDefault();
                Sfx.click();
                closeClubAsk("send", input.value);
            });
            acts.appendChild(input);
            [["self", "askSelf"], ["send", "askSend"], ["off", "askOff"]].forEach(function (row) {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.setAttribute("data-ask", row[0]);
                btn.textContent = t(row[1]);
                acts.appendChild(btn);
            });
        } else {
            [["cheap", "askCheap"], ["rich", "askRich"], ["off", "askOff"]].forEach(function (row) {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.setAttribute("data-ask", row[0]);
                btn.textContent = t(row[1]);
                acts.appendChild(btn);
            });
        }
    }
    box.hidden = false;
}

function closeClubAsk(pick, sum) {
    const job = clubAsk;
    clubAsk = null;
    const box = get("askOverlay");
    if (box) box.hidden = true;
    if (job && job.done) job.done(pick, sum);
}

function chargeAsk(clubName, kind, cost, done, meta) {
    const coach = !!(player && player.coach);
    const who = coach ? (homeClubName() || clubName) : clubName;
    const dealMeta = Object.assign({}, meta || {});
    if (coach) dealMeta.fair = cost;
    openClubAsk(who, kind, function (pick, sum) {
        if (pick === "busy") {
            done(false, 0);
            return;
        }
        if (!pick || pick === "off") {
            addLog(t("askLogD", { club: ui(who || "") }));
            Sfx.click();
            done(false, 0);
            return;
        }
        if (coach && pick === "self") {
            const pay = Math.max(1, Math.round(cost || 0));
            const list = dealListName(kind, meta);
            if ((player.respect || 0) < pay) {
                Sfx.error();
                addLog(t("askNo_cash", { club: ui(who || ""), pay: money(pay), list: list }));
                done(false, 0);
                return;
            }
            player.respect -= pay;
            addLog(t("askYesSelf", { pay: money(pay), list: list }));
            updateRespect();
            done(true, pay);
            return;
        }
        if (coach) {
            const verdict = coachVerdict(sum, kind, meta);
            const list = dealListName(kind, meta);
            if (!verdict.ok) {
                Sfx.error();
                addLog(t("askNo_" + verdict.why, {
                    club: ui(who || ""),
                    pay: money(verdict.pay),
                    list: list
                }));
                done(false, 0);
                return;
            }
            player.respect -= verdict.pay;
            const skim = pocketSkim(verdict.pay, cost);
            addLog(t("askYesDeal", { club: ui(who || ""), pay: money(verdict.pay), list: list }));
            if (skim) addLog(t("logSkim", { pay: money(skim), bag: money(player.stolen || 0) }));
            updateRespect();
            done(true, verdict.pay);
            return;
        }
        const verdict = clubVerdict(cost, pick === "cheap" ? "cheap" : "rich");
        if (!verdict.ok) {
            Sfx.error();
            addLog(t("askNo_" + verdict.why, { club: ui(who || ""), pay: money(verdict.pay) }));
            done(false, 0);
            return;
        }
        player.respect -= verdict.pay;
        addLog(t(pick === "cheap" ? "askYesCheap" : "askYesRich", { club: ui(who || ""), pay: money(verdict.pay) }));
        updateRespect();
        done(true, verdict.pay);
    }, dealMeta);
}

function signStar(star) {
    Sfx.unlock();
    if (!isClub()) return;
    if (!Array.isArray(player.squad)) player.squad = [];
    if (player.squad.indexOf(star.id) >= 0) return;
    if (player.squad.length >= SQUAD_XI + SQUAD_BENCH) {
        Sfx.error();
        addLog(t("logSquadFull"));
        return;
    }
    const cost = starCost(star.ovr, star);
    if (tillShort(cost)) {
        Sfx.error();
        addLog(t("logNeedStar", { pay: money(cost), name: shown(star) }));
        return;
    }
    chargeAsk(star.club || homeClubName(), "player", cost, function (ok, pay) {
        if (!ok) return;
        if (player.squad.indexOf(star.id) >= 0) return;
        player.squad.push(star.id);
        const gain = Math.max(1, Math.round((star.ovr - 74) / 5));
        starBoostKeys(star.pos).forEach((key) => {
            if (typeof player.stats[key] === "number") {
                player.stats[key] = Math.min(99, player.stats[key] + gain);
            }
        });
        Sfx.transferBig(star.ovr);
        addLog(t("logBought", { flag: star.flag, name: shown(star), pos: star.pos, ovr: star.ovr, pay: money(pay) }));
        if (lineupOf(squadStars()).bench.some(function (row) { return row.id === star.id; })) {
            addLog(t("logBench", { name: shown(star), ovr: star.ovr }));
        }
        showAura("transfer", "−" + money(pay), shown(star), ui(star.club) + " · " + star.pos + " " + star.ovr, "#ffd83d", 1800);
        renderAll();
        save();
    }, { id: star.id, ovr: star.ovr, name: shown(star) });
}

function releaseStar(star) {
    Sfx.unlock();
    if (!isClub() || !Array.isArray(player.squad)) return;
    const index = player.squad.indexOf(star.id);
    if (index < 0) return;
    player.squad.splice(index, 1);
    if (Array.isArray(player.draftBag)) {
        player.draftBag = player.draftBag.filter(function (item) { return item.id !== star.id; });
    }
    if (player.draftLast && player.draftLast.id === star.id) player.draftLast = null;
    const refund = Math.round(starCost(star.ovr, star) * 0.4);
    player.respect = (player.respect || 0) + refund;
    const gain = Math.max(1, Math.round((star.ovr - 74) / 5));
    starBoostKeys(star.pos).forEach((key) => {
        if (typeof player.stats[key] === "number") {
            player.stats[key] = Math.max(40, player.stats[key] - gain);
        }
    });
    Sfx.rest();
    addLog(t("logSold", { name: shown(star), pay: money(refund) }));
    renderAll();
    save();
}

function squadStars() {
    if (!Array.isArray(player.squad)) return [];
    return player.squad.map(function (id) { return starCard(id); }).filter(Boolean);
}

function grantSquad(star) {
    if (!isClub() || !star || !star.id) return false;
    if (!Array.isArray(player.squad)) player.squad = [];
    if (player.squad.indexOf(star.id) >= 0) return false;
    if (player.squad.length >= SQUAD_XI + SQUAD_BENCH) return false;
    player.squad.push(star.id);
    return true;
}

function onBench() {
    if (!player || !player.name || isClub()) return false;
    const need = (clubByName(player.club).required || 0);
    if (need < 56) return false;
    return getOverall() + 3 < need;
}

function lineupOf(stars) {
    const taken = {};
    const slots = [];
    const benchSet = {};
    const pinSet = {};
    (player && player.benchPins || []).forEach(function (id) { benchSet[id] = true; });
    (player && player.xiPins || []).forEach(function (id) {
        if (!benchSet[id]) pinSet[id] = true;
    });
    [
        ["GK"],
        ["LB", "CB", "CB", "RB"],
        ["CDM", "CM", "CAM"],
        ["LW", "ST", "RW"]
    ].forEach(function (line) {
        line.forEach(function (slotPos) {
            slots.push({ pos: slotPos, star: null });
        });
    });
    function claim(pool, slot, minFit, minOvr) {
        if (slot.star) return;
            let pick = null;
        let best = -1;
        pool.forEach(function (star) {
            if (taken[star.id] || benchSet[star.id] || star.ovr < minOvr) return;
            const fit = slotScore(slot.pos, star.pos);
            if (fit < minFit) return;
            const score = star.ovr + (fit === 2 ? 6 : 0);
                if (score > best) {
                    best = score;
                    pick = star;
                }
            });
        if (!pick) return;
                taken[pick.id] = true;
        slot.star = pick;
    }
    const pinned = stars.filter(function (star) { return pinSet[star.id]; });
    const open = stars.filter(function (star) { return !benchSet[star.id]; });
    slots.forEach(function (slot) { claim(pinned, slot, 2, 0); });
    slots.forEach(function (slot) { claim(pinned, slot, 1, 0); });
    slots.forEach(function (slot) { claim(open, slot, 2, 0); });
    slots.forEach(function (slot) { claim(open, slot, 1, 76); });
    const bench = stars.filter(function (star) { return !taken[star.id]; })
        .sort(function (a, b) { return a.ovr - b.ovr; });
    return { slots: slots, bench: bench };
}

function toggleSquadRole(starId) {
    if (!isClub() || !Array.isArray(player.squad) || player.squad.indexOf(starId) < 0) return;
    if (!Array.isArray(player.xiPins)) player.xiPins = [];
    if (!Array.isArray(player.benchPins)) player.benchPins = [];
    const star = starCard(starId);
    if (!star) return;
    const xi = clubLineup();
    const starting = xi.slots.some(function (slot) { return slot.star && slot.star.id === starId; });
    player.xiPins = player.xiPins.filter(function (id) { return id !== starId && player.squad.indexOf(id) >= 0; });
    player.benchPins = player.benchPins.filter(function (id) { return id !== starId && player.squad.indexOf(id) >= 0; });
    if (starting) {
        player.benchPins.push(starId);
        addLog(t("logToBench", { name: shown(star) }));
            } else {
        const slot = xi.slots.slice().sort(function (a, b) {
            return slotScore(b.pos, star.pos) - slotScore(a.pos, star.pos);
        }).find(function (row) { return slotScore(row.pos, star.pos) >= 1 && !row.star; })
            || xi.slots.find(function (row) { return row.star && row.pos === star.pos; })
            || xi.slots.find(function (row) { return row.star && slotScore(row.pos, star.pos) >= 1; });
        if (slot && slot.star) {
            player.xiPins = player.xiPins.filter(function (id) { return id !== slot.star.id; });
            if (player.benchPins.indexOf(slot.star.id) < 0) player.benchPins.push(slot.star.id);
        }
        player.xiPins.push(starId);
        addLog(t("logToXi", { name: shown(star) }));
    }
    Sfx.click();
    renderAll();
    save();
}

function clubLineup() {
    return lineupOf(squadStars());
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

function squadRow(star, onTheBench) {
        const row = document.createElement("div");
    row.className = "market-row owned" + (onTheBench ? " bench-row" : "");
        const pos = document.createElement("span");
        pos.className = "pos";
        pos.textContent = star.pos;
        row.appendChild(pos);
        const who = document.createElement("span");
        who.className = "who";
    who.textContent = (star.flag ? star.flag + " " : "") + (shown(star) || star.name || "");
        const club = document.createElement("small");
    club.textContent = (star.club || star.home || "") + (onTheBench ? " · " + t("benchTag") : "");
        who.appendChild(club);
        row.appendChild(who);
        const ovn = document.createElement("span");
        ovn.className = "ovn";
        ovn.textContent = String(star.ovr);
        row.appendChild(ovn);
    const role = document.createElement("button");
    role.type = "button";
    role.className = "role";
    role.setAttribute("data-role", star.id);
    role.textContent = onTheBench ? t("toXi") : t("toBench");
    row.appendChild(role);
        const sell = document.createElement("button");
        sell.type = "button";
        sell.className = "sell";
        sell.setAttribute("data-sell", star.id);
    sell.textContent = t("sell");
        row.appendChild(sell);
    return row;
}

function updateSquad() {
    const pitch = get("squadPitch");
    const box = get("squad");
    const hint = get("squadHint");
    const benchBox = get("benchBox");
    const bench = get("squadBench");
    if (!pitch || !box) return;
    pitch.innerHTML = "";
    box.innerHTML = "";
    if (bench) bench.innerHTML = "";
    if (!isClub()) {
        if (benchBox) benchBox.hidden = true;
        return;
    }
    ensureDraft();
    let draftedIn = false;
    (player.draftBag || []).forEach(function (item) {
        const star = starCard(item.id);
        if (star && grantSquad(star)) draftedIn = true;
    });
    if (player.draftLast) {
        const last = starCard(player.draftLast.id) || player.draftLast;
        if (last && last.name && grantSquad(last)) draftedIn = true;
    }
    if (draftedIn) save();
    const voucherCount = get("voucherCount");
    const voucherBuy = get("voucherBuy");
    if (voucherCount) voucherCount.textContent = t("voucherHave", { n: player.draftTokens });
    if (voucherBuy) {
        voucherBuy.textContent = t("voucherBuy", { n: money(VOUCHER_COST) });
        voucherBuy.disabled = (player.respect || 0) < VOUCHER_COST;
    }
    const xi = clubLineup();
    const starters = xi.slots.map(function (slot) { return slot.star; }).filter(Boolean);
    const avg = starters.length
        ? Math.round(starters.reduce(function (sum, star) { return sum + star.ovr; }, 0) / starters.length)
        : 0;
    if (hint) {
        hint.textContent = starters.length || xi.bench.length
            ? t("squadCount", { xi: starters.length, b: xi.bench.length, avg: avg })
            : t("squadHint");
    }

    let line = null;
    let last = "";
    xi.slots.forEach(function (slot) {
        const band = slot.pos === "GK" ? "g" : (slot.pos === "LB" || slot.pos === "CB" || slot.pos === "RB") ? "d" : (slot.pos === "LW" || slot.pos === "ST" || slot.pos === "RW") ? "a" : "m";
        if (band !== last) {
            line = document.createElement("div");
            line.className = "pitch-line";
            pitch.appendChild(line);
            last = band;
        }
        const cell = document.createElement(slot.star ? "button" : "div");
        cell.type = slot.star ? "button" : undefined;
        cell.className = "pitch-slot" + (slot.star ? " filled" : "") + (slot.star && slot.star.exclusive ? " exclusive" : "");
        if (slot.star) {
            cell.setAttribute("data-role", slot.star.id);
            const name = document.createElement("b");
            name.textContent = (slot.star.flag ? slot.star.flag + " " : "") + (shown(slot.star) || slot.star.name || "");
            cell.appendChild(name);
            const meta = document.createElement("small");
            meta.textContent = (slot.star.pos || "") + " " + (slot.star.ovr || "");
            cell.appendChild(meta);
        } else {
            cell.textContent = slot.pos;
        }
        line.appendChild(cell);
    });

    if (benchBox) benchBox.hidden = !xi.bench.length;
    if (bench) {
        xi.bench.forEach(function (star) {
            const chip = document.createElement("button");
            chip.type = "button";
            chip.className = "bench-chip" + (star.ovr < 78 ? " low" : "");
            chip.setAttribute("data-role", star.id);
            const name = document.createElement("b");
            name.textContent = (star.flag ? star.flag + " " : "") + (shown(star) || star.name || "");
            const meta = document.createElement("small");
            meta.textContent = (star.pos || "") + " · " + (star.ovr || "");
            chip.appendChild(name);
            chip.appendChild(meta);
            bench.appendChild(chip);
        });
    }

    pitch.hidden = false;
    if (!starters.length && !xi.bench.length) {
        const empty = document.createElement("div");
        empty.className = "market-row";
        empty.textContent = t("squadEmpty");
        box.appendChild(empty);
        return;
    }

    starters.forEach(function (star) { box.appendChild(squadRow(star, false)); });
    xi.bench.forEach(function (star) { box.appendChild(squadRow(star, true)); });
}

const VOUCHER_COST = 150;
const DRAFT_SHOP = [
    { n: 1, cost: 150 },
    { n: 5, cost: 750 },
    { n: 10, cost: 1500 }
];

function buyVouchers(n, cost) {
    if (!player || !isClub()) return;
    ensureDraft();
    if (tillShort(cost)) return;
    chargeAsk(homeClubName(), "slip", cost, function (ok, pay) {
        if (!ok) return;
        ensureDraft();
        player.draftTokens += n;
        save();
        updateRespect();
        addLog(t("logVoucher", { n: n, cost: money(pay) }));
        updateMarket();
        updateSquad();
        updateDrop();
        Sfx.ding();
    }, { id: "slip" });
}

const ACADEMY_COST = { u17: 220, u19: 480 };

function ensureAcademy() {
    if (!player) return;
    if (!player.academy || typeof player.academy !== "object") player.academy = { u17: false, u19: false };
}

function openAcademy(which) {
    if (!player || !isClub() || !ACADEMY_COST[which]) return;
    ensureAcademy();
    if (player.academy[which]) return;
    const cost = ACADEMY_COST[which];
    const name = which.toUpperCase();
    if (tillShort(cost)) {
        Sfx.error();
        addLog(t("academyNeed", { name: name, pay: money(cost) }));
        return;
    }
    chargeAsk(homeClubName(), "slip", cost, function (ok, pay) {
        if (!ok) return;
        ensureAcademy();
        if (player.academy[which]) return;
        player.academy[which] = true;
        Sfx.ding();
        addLog(t("academyOpen", { name: name, pay: money(pay) }));
        updateRespect();
        updateMarket();
        save();
    }, { id: "academy", name: name });
}

function paintAcademyChoice(box) {
    ["u17", "u19"].forEach(function (which) {
        if (player.academy[which]) {
            const note = document.createElement("p");
            note.className = "hint";
            note.textContent = t("academyOn", { name: which.toUpperCase() });
            box.appendChild(note);
            return;
        }
        const button = document.createElement("button");
        button.type = "button";
        button.className = "gold";
        button.setAttribute("data-academy", which);
        button.textContent = t("academyBuy", { name: which.toUpperCase(), pay: money(ACADEMY_COST[which]) });
        box.appendChild(button);
    });
}

const BOSS_MARKET = [
    { id: "boss-baba", name: "Бабаян", en: "Babayan", flag: "🇰🇿", club: "Кайрат", ovr: 68, cost: 280, wage: 35 },
    { id: "boss-karp", name: "Карпин", en: "Karpin", flag: "🇷🇺", club: "Ростов", ovr: 74, cost: 480, wage: 55 },
    { id: "boss-cherch", name: "Черчесов", en: "Cherchesov", flag: "🇷🇺", club: "Динамо Москва", ovr: 76, cost: 560, wage: 60 },
    { id: "boss-klopp", name: "Клопп", en: "Klopp", flag: "🇩🇪", club: "Borussia Dortmund", ovr: 86, cost: 1500, wage: 130 },
    { id: "boss-mourinho", name: "Моуринью", en: "Mourinho", flag: "🇵🇹", club: "Porto", ovr: 87, cost: 1600, wage: 150 },
    { id: "boss-simeone", name: "Симеоне", en: "Simeone", flag: "🇦🇷", club: "Atlético Madrid", ovr: 88, cost: 1700, wage: 140 },
    { id: "boss-alonso", name: "Хаби Алонсо", en: "Xabi Alonso", flag: "🇪🇸", club: "Real Madrid", ovr: 84, cost: 1200, wage: 110 },
    { id: "boss-carlo", name: "Анчелотти", en: "Ancelotti", flag: "🇮🇹", club: "Real Madrid", ovr: 91, cost: 2400, wage: 190 },
    { id: "boss-pep", name: "Гвардиола", en: "Guardiola", flag: "🇪🇸", club: "Manchester City", ovr: 93, cost: 2800, wage: 210 }
];

function hireBoss(id) {
    if (!player || !isClub()) return;
    if (id === "off") {
        if (!player.boss) return;
        const name = shown(player.boss);
        player.boss = null;
        addLog(t("bossLeft", { name: name }));
        Sfx.click();
        updateMarket();
        save();
        return;
    }
    const boss = BOSS_MARKET.find(function (row) { return row.id === id; });
    if (!boss || (player.boss && player.boss.id === boss.id)) return;
    if (tillShort(boss.cost)) {
        Sfx.error();
        addLog(t("bossNeed", { name: shown(boss), pay: money(boss.cost) }));
        return;
    }
    chargeAsk(boss.club, "player", boss.cost, function (ok) {
        if (!ok) return;
        player.boss = {
            id: boss.id,
            name: boss.name,
            en: boss.en,
            flag: boss.flag,
            club: boss.club,
            ovr: boss.ovr,
            wage: boss.wage
        };
        addLog(t("bossGot", { name: shown(player.boss), pay: money(boss.wage) }));
        Sfx.transferBig(boss.ovr);
        updateMarket();
        save();
    }, { id: boss.id, ovr: boss.ovr, name: shown(boss) });
}

function paintBossMarket(box) {
    if (player.boss) {
        const fire = document.createElement("button");
        fire.type = "button";
        fire.setAttribute("data-boss", "off");
        fire.textContent = t("bossFire");
        box.appendChild(fire);
    }
    BOSS_MARKET.forEach(function (boss) {
        const mine = player.boss && player.boss.id === boss.id;
        const row = document.createElement("div");
        row.className = "market-row" + (mine ? " owned" : (player.respect || 0) < boss.cost ? " locked" : "");
        const pos = document.createElement("span");
        pos.className = "pos";
        pos.textContent = String(boss.ovr);
        row.appendChild(pos);
        const who = document.createElement("span");
        who.className = "who";
        who.textContent = boss.flag + " " + shown(boss) + " ";
        const club = document.createElement("small");
        club.textContent = ui(boss.club) + " · " + money(boss.wage) + "/" + (langEn() ? "wk" : "нед");
        who.appendChild(club);
        row.appendChild(who);
        if (mine) {
            const mark = document.createElement("b");
            mark.textContent = t("bossHave");
            row.appendChild(mark);
        } else if ((player.respect || 0) >= boss.cost) {
            const button = document.createElement("button");
            button.type = "button";
            button.setAttribute("data-boss", boss.id);
            button.textContent = money(boss.cost);
            row.appendChild(button);
        } else {
            const mark = document.createElement("b");
            mark.textContent = money(boss.cost);
            row.appendChild(mark);
        }
        box.appendChild(row);
    });
}

function updateMarket() {
    const box = get("market");
    const hint = get("marketHint");
    const posTabs = get("marketPos");
    if (!box) return;
    box.innerHTML = "";
    if (posTabs) posTabs.hidden = marketFilter === "drafts" || marketFilter === "boss";
    if (!isClub()) return;
    if (!Array.isArray(player.squad)) player.squad = [];
    document.querySelectorAll("#marketTabs [data-tier]").forEach((btn) => {
        btn.classList.toggle("on", btn.getAttribute("data-tier") === marketFilter);
    });
    if (marketFilter === "drafts") {
        ensureDraft();
        if (hint) hint.textContent = t("draftShop", { n: player.draftTokens, cash: money(player.respect) });
        DRAFT_SHOP.forEach(function (offer) {
            const row = document.createElement("div");
            row.className = "market-row" + ((player.respect || 0) < offer.cost ? " locked" : "");
            const who = document.createElement("span");
            who.className = "who";
            who.textContent = offer.n === 1 ? t("draftPack1") : t("draftPack", { n: offer.n });
            row.appendChild(who);
            if ((player.respect || 0) >= offer.cost) {
                const button = document.createElement("button");
                button.type = "button";
                button.setAttribute("data-voucher", String(offer.n));
                button.setAttribute("data-cost", String(offer.cost));
                button.textContent = money(offer.cost);
                row.appendChild(button);
            } else {
                const mark = document.createElement("b");
                mark.textContent = money(offer.cost);
                row.appendChild(mark);
            }
            box.appendChild(row);
        });
        const open = document.createElement("button");
        open.type = "button";
        open.className = "gold";
        open.id = "marketDraftOpen";
        open.textContent = t("draftOpen");
        open.addEventListener("click", function () { Sfx.click(); openDraft(); });
        box.appendChild(open);
        return;
    }
    if (marketFilter === "boss") {
        if (hint) {
            hint.textContent = player.boss
                ? t("bossHint", { name: shown(player.boss), pay: money(player.boss.wage || 0) })
                : t("bossNone");
        }
        paintBossMarket(box);
        return;
    }
    ensureAcademy();
    if (marketFilter === "rook") paintAcademyChoice(box);
    const list = TRANSFER_STARS.filter((star) => {
        if (star.tier === "rook") {
            const posOk = marketPos === "all" || star.pos === marketPos;
            return marketFilter === "rook" && posOk && !!(player.academy && player.academy[star.youth]);
        }
        if (marketFilter === "rook") return false;
        const tierOk = marketFilter === "all" || star.tier === marketFilter || (marketFilter === "leg" && star.id === "cr7");
        const posOk = marketPos === "all" || star.pos === marketPos;
        return tierOk && posOk;
    }).sort(function (a, b) { return (b.ovr || 0) - (a.ovr || 0); });
    if (hint) {
        hint.textContent = marketFilter === "rook"
            ? t("academyHint")
            : t("marketCount", { n: list.length, sq: player.squad.length, cash: money(player.respect) });
    }
    document.querySelectorAll("#marketPos [data-pos]").forEach((btn) => {
        btn.classList.toggle("on", btn.getAttribute("data-pos") === marketPos);
    });
    list.forEach((star) => {
        const cost = starCost(star.ovr, star);
        const owned = player.squad.indexOf(star.id) >= 0;
        const row = document.createElement("div");
        row.className = "market-row" + (owned ? " owned" : (player.respect || 0) < cost ? " locked" : "");

        const pos = document.createElement("span");
        pos.className = "pos";
        pos.textContent = star.pos;
        row.appendChild(pos);

        const who = document.createElement("span");
        who.className = "who";
        who.textContent = star.flag + " " + shown(star) + " ";
        const club = document.createElement("small");
        club.textContent = clubLabel(star.club);
        who.appendChild(club);
        row.appendChild(who);

        const ovn = document.createElement("span");
        ovn.className = "ovn";
        ovn.textContent = String(star.ovr);
        row.appendChild(ovn);

        if (owned) {
            const mark = document.createElement("b");
            mark.textContent = t("ownedStar");
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
    if (!confirm(t("confirmReset"))) return;
    updateRecords();
    localStorage.removeItem(SAVE_KEY);
    location.reload();
}

const PROMO_CODE = "MADRID.CR7.ISTAS";
const PROMO_PAY = 100000;
const PROMO_PENDING = "fc-promo-madrid";
const AUCTION_KEY = "fc-auction-wc-v1";
const AUCTION_PAY = 4000;
const AUCTION_SLOTS = ["GK", "LB", "CB", "CB", "RB", "CM", "CM", "CM", "LW", "ST", "RW"];
const AUCTION_LINES = [["GK"], ["LB", "CB", "CB", "RB"], ["CM", "CM", "CM"], ["LW", "ST", "RW"]];
const WC_STARS = [
    { name: "Ромарио", en: "Romario", pos: "ST", flag: "🇧🇷", nation: "Бразилия", wc: 1994, ovr: 92 },
    { name: "Баджо", en: "Baggio", pos: "CAM", flag: "🇮🇹", nation: "Италия", wc: 1994, ovr: 90 },
    { name: "Мальдини", en: "Maldini", pos: "CB", flag: "🇮🇹", nation: "Италия", wc: 1994, ovr: 91 },
    { name: "Барези", en: "Baresi", pos: "CB", flag: "🇮🇹", nation: "Италия", wc: 1994, ovr: 90 },
    { name: "Стоичков", en: "Stoichkov", pos: "ST", flag: "🇧🇬", nation: "Болгария", wc: 1994, ovr: 89 },
    { name: "Хаджи", en: "Hagi", pos: "CAM", flag: "🇷🇴", nation: "Румыния", wc: 1994, ovr: 88 },
    { name: "Клинсманн", en: "Klinsmann", pos: "ST", flag: "🇩🇪", nation: "Германия", wc: 1994, ovr: 88 },
    { name: "Бебето", en: "Bebeto", pos: "ST", flag: "🇧🇷", nation: "Бразилия", wc: 1994, ovr: 87 },
    { name: "Вальдеррама", en: "Valderrama", pos: "CM", flag: "🇨🇴", nation: "Колумбия", wc: 1994, ovr: 86 },
    { name: "Зидан", en: "Zidane", pos: "CAM", flag: "🇫🇷", nation: "Франция", wc: 1998, ovr: 94 },
    { name: "Роналдо", en: "Ronaldo", pos: "ST", flag: "🇧🇷", nation: "Бразилия", wc: 1998, ovr: 94 },
    { name: "Бергкамп", en: "Bergkamp", pos: "ST", flag: "🇳🇱", nation: "Нидерланды", wc: 1998, ovr: 91 },
    { name: "Давидс", en: "Davids", pos: "CDM", flag: "🇳🇱", nation: "Нидерланды", wc: 1998, ovr: 87 },
    { name: "Шукер", en: "Suker", pos: "ST", flag: "🇭🇷", nation: "Хорватия", wc: 1998, ovr: 88 },
    { name: "Батистута", en: "Batistuta", pos: "ST", flag: "🇦🇷", nation: "Аргентина", wc: 1998, ovr: 90 },
    { name: "Оуэн", en: "Owen", pos: "ST", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", nation: "Англия", wc: 1998, ovr: 87 },
    { name: "Тюрам", en: "Thuram", pos: "CB", flag: "🇫🇷", nation: "Франция", wc: 1998, ovr: 88 },
    { name: "Бартез", en: "Barthez", pos: "GK", flag: "🇫🇷", nation: "Франция", wc: 1998, ovr: 88 },
    { name: "Ривалдо", en: "Rivaldo", pos: "CAM", flag: "🇧🇷", nation: "Бразилия", wc: 2002, ovr: 90 },
    { name: "Роналдиньо", en: "Ronaldinho", pos: "LW", flag: "🇧🇷", nation: "Бразилия", wc: 2002, ovr: 93 },
    { name: "Роналдо", en: "Ronaldo", pos: "ST", flag: "🇧🇷", nation: "Бразилия", wc: 2002, ovr: 95 },
    { name: "Кафу", en: "Cafu", pos: "RB", flag: "🇧🇷", nation: "Бразилия", wc: 2002, ovr: 89 },
    { name: "Роберто Карлос", en: "R. Carlos", pos: "LB", flag: "🇧🇷", nation: "Бразилия", wc: 2002, ovr: 90 },
    { name: "Кан", en: "Kahn", pos: "GK", flag: "🇩🇪", nation: "Германия", wc: 2002, ovr: 91 },
    { name: "Баллак", en: "Ballack", pos: "CM", flag: "🇩🇪", nation: "Германия", wc: 2002, ovr: 89 },
    { name: "Недвед", en: "Nedved", pos: "CAM", flag: "🇨🇿", nation: "Чехия", wc: 2002, ovr: 90 },
    { name: "Фигу", en: "Figo", pos: "RW", flag: "🇵🇹", nation: "Португалия", wc: 2002, ovr: 90 },
    { name: "Рауль", en: "Raul", pos: "ST", flag: "🇪🇸", nation: "Испания", wc: 2002, ovr: 88 },
    { name: "Буффон", en: "Buffon", pos: "GK", flag: "🇮🇹", nation: "Италия", wc: 2006, ovr: 93 },
    { name: "Каннаваро", en: "Cannavaro", pos: "CB", flag: "🇮🇹", nation: "Италия", wc: 2006, ovr: 91 },
    { name: "Пирло", en: "Pirlo", pos: "CM", flag: "🇮🇹", nation: "Италия", wc: 2006, ovr: 90 },
    { name: "Тотти", en: "Totti", pos: "CAM", flag: "🇮🇹", nation: "Италия", wc: 2006, ovr: 89 },
    { name: "Анри", en: "Henry", pos: "ST", flag: "🇫🇷", nation: "Франция", wc: 2006, ovr: 91 },
    { name: "Клозе", en: "Klose", pos: "ST", flag: "🇩🇪", nation: "Германия", wc: 2006, ovr: 88 },
    { name: "Лам", en: "Lahm", pos: "RB", flag: "🇩🇪", nation: "Германия", wc: 2006, ovr: 88 },
    { name: "Криштиану", en: "Ronaldo", pos: "LW", flag: "🇵🇹", nation: "Португалия", wc: 2006, ovr: 99 },
    { name: "Джеррард", en: "Gerrard", pos: "CM", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", nation: "Англия", wc: 2006, ovr: 89 },
    { name: "Лэмпард", en: "Lampard", pos: "CM", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", nation: "Англия", wc: 2006, ovr: 88 },
    { name: "Иньеста", en: "Iniesta", pos: "CAM", flag: "🇪🇸", nation: "Испания", wc: 2010, ovr: 91 },
    { name: "Хави", en: "Xavi", pos: "CM", flag: "🇪🇸", nation: "Испания", wc: 2010, ovr: 91 },
    { name: "Касильяс", en: "Casillas", pos: "GK", flag: "🇪🇸", nation: "Испания", wc: 2010, ovr: 90 },
    { name: "Вилья", en: "Villa", pos: "ST", flag: "🇪🇸", nation: "Испания", wc: 2010, ovr: 89 },
    { name: "Рамос", en: "Ramos", pos: "CB", flag: "🇪🇸", nation: "Испания", wc: 2010, ovr: 88 },
    { name: "Снейдер", en: "Sneijder", pos: "CAM", flag: "🇳🇱", nation: "Нидерланды", wc: 2010, ovr: 90 },
    { name: "Роббен", en: "Robben", pos: "RW", flag: "🇳🇱", nation: "Нидерланды", wc: 2010, ovr: 90 },
    { name: "Форлан", en: "Forlan", pos: "ST", flag: "🇺🇾", nation: "Уругвай", wc: 2010, ovr: 89 },
    { name: "Месси", en: "Messi", pos: "RW", flag: "🇦🇷", nation: "Аргентина", wc: 2010, ovr: 90 },
    { name: "Мюллер", en: "Muller", pos: "CAM", flag: "🇩🇪", nation: "Германия", wc: 2010, ovr: 87 },
    { name: "Гётце", en: "Gotze", pos: "CAM", flag: "🇩🇪", nation: "Германия", wc: 2014, ovr: 86 },
    { name: "Нойер", en: "Neuer", pos: "GK", flag: "🇩🇪", nation: "Германия", wc: 2014, ovr: 92 },
    { name: "Кроос", en: "Kroos", pos: "CM", flag: "🇩🇪", nation: "Германия", wc: 2014, ovr: 90 },
    { name: "Неймар", en: "Neymar", pos: "LW", flag: "🇧🇷", nation: "Бразилия", wc: 2014, ovr: 91 },
    { name: "Хамес", en: "James", pos: "CAM", flag: "🇨🇴", nation: "Колумбия", wc: 2014, ovr: 88 },
    { name: "Роббен", en: "Robben", pos: "RW", flag: "🇳🇱", nation: "Нидерланды", wc: 2014, ovr: 90 },
    { name: "Месси", en: "Messi", pos: "RW", flag: "🇦🇷", nation: "Аргентина", wc: 2014, ovr: 93 },
    { name: "Азар", en: "Hazard", pos: "LW", flag: "🇧🇪", nation: "Бельгия", wc: 2014, ovr: 88 },
    { name: "Мбаппе", en: "Mbappe", pos: "ST", flag: "🇫🇷", nation: "Франция", wc: 2018, ovr: 89 },
    { name: "Гризманн", en: "Griezmann", pos: "ST", flag: "🇫🇷", nation: "Франция", wc: 2018, ovr: 89 },
    { name: "Канте", en: "Kante", pos: "CDM", flag: "🇫🇷", nation: "Франция", wc: 2018, ovr: 89 },
    { name: "Модрич", en: "Modric", pos: "CM", flag: "🇭🇷", nation: "Хорватия", wc: 2018, ovr: 91 },
    { name: "Кейн", en: "Kane", pos: "ST", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", nation: "Англия", wc: 2018, ovr: 89 },
    { name: "Де Брюйне", en: "De Bruyne", pos: "CM", flag: "🇧🇪", nation: "Бельгия", wc: 2018, ovr: 91 },
    { name: "Неймар", en: "Neymar", pos: "LW", flag: "🇧🇷", nation: "Бразилия", wc: 2018, ovr: 92 },
    { name: "Салах", en: "Salah", pos: "RW", flag: "🇪🇬", nation: "Египет", wc: 2018, ovr: 89 },
    { name: "Месси", en: "Messi", pos: "RW", flag: "🇦🇷", nation: "Аргентина", wc: 2022, ovr: 94 },
    { name: "Ди Мария", en: "Di Maria", pos: "RW", flag: "🇦🇷", nation: "Аргентина", wc: 2022, ovr: 87 },
    { name: "Мбаппе", en: "Mbappe", pos: "ST", flag: "🇫🇷", nation: "Франция", wc: 2022, ovr: 93 },
    { name: "Модрич", en: "Modric", pos: "CM", flag: "🇭🇷", nation: "Хорватия", wc: 2022, ovr: 88 },
    { name: "Хакими", en: "Hakimi", pos: "RB", flag: "🇲🇦", nation: "Марокко", wc: 2022, ovr: 87 },
    { name: "Винисиус", en: "Vinicius", pos: "LW", flag: "🇧🇷", nation: "Бразилия", wc: 2022, ovr: 88 },
    { name: "Криштиану", en: "Ronaldo", pos: "ST", flag: "🇵🇹", nation: "Португалия", wc: 2014, ovr: 99 },
    { name: "Криштиану", en: "Ronaldo", pos: "ST", flag: "🇵🇹", nation: "Португалия", wc: 2018, ovr: 99 },
    { name: "Криштиану", en: "Ronaldo", pos: "ST", flag: "🇵🇹", nation: "Португалия", wc: 2022, ovr: 99 },
    { name: "Кейн", en: "Kane", pos: "ST", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", nation: "Англия", wc: 2022, ovr: 89 },
    { name: "Ямаль", en: "Yamal", pos: "RW", flag: "🇪🇸", nation: "Испания", wc: 2026, ovr: 89 },
    { name: "Беллингем", en: "Bellingham", pos: "CM", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", nation: "Англия", wc: 2026, ovr: 91 },
    { name: "Холанн", en: "Haaland", pos: "ST", flag: "🇳🇴", nation: "Норвегия", wc: 2026, ovr: 92 },
    { name: "Винисиус", en: "Vinicius", pos: "LW", flag: "🇧🇷", nation: "Бразилия", wc: 2026, ovr: 91 },
    { name: "Мбаппе", en: "Mbappe", pos: "ST", flag: "🇫🇷", nation: "Франция", wc: 2026, ovr: 93 },
    { name: "Мусиала", en: "Musiala", pos: "CAM", flag: "🇩🇪", nation: "Германия", wc: 2026, ovr: 89 },
    { name: "Педри", en: "Pedri", pos: "CM", flag: "🇪🇸", nation: "Испания", wc: 2026, ovr: 88 },
    { name: "Родри", en: "Rodri", pos: "CDM", flag: "🇪🇸", nation: "Испания", wc: 2026, ovr: 91 },
    { name: "Сака", en: "Saka", pos: "RW", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", nation: "Англия", wc: 2026, ovr: 88 },
    { name: "Осимхен", en: "Osimhen", pos: "ST", flag: "🇳🇬", nation: "Нигерия", wc: 2026, ovr: 88 },
    { name: "Таффарел", en: "Taffarel", pos: "GK", flag: "🇧🇷", nation: "Бразилия", wc: 1994, ovr: 86 },
    { name: "Льорис", en: "Lloris", pos: "GK", flag: "🇫🇷", nation: "Франция", wc: 2018, ovr: 87 },
    { name: "Доннарумма", en: "Donnarumma", pos: "GK", flag: "🇮🇹", nation: "Италия", wc: 2022, ovr: 88 },
    { name: "Алиссон", en: "Alisson", pos: "GK", flag: "🇧🇷", nation: "Бразилия", wc: 2022, ovr: 89 },
    { name: "Куртуа", en: "Courtois", pos: "GK", flag: "🇧🇪", nation: "Бельгия", wc: 2018, ovr: 90 },
    { name: "Лизаразю", en: "Lizarazu", pos: "LB", flag: "🇫🇷", nation: "Франция", wc: 1998, ovr: 86 },
    { name: "Коул", en: "Cole", pos: "LB", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", nation: "Англия", wc: 2006, ovr: 86 },
    { name: "Гроссо", en: "Grosso", pos: "LB", flag: "🇮🇹", nation: "Италия", wc: 2006, ovr: 84 },
    { name: "Альба", en: "Alba", pos: "LB", flag: "🇪🇸", nation: "Испания", wc: 2010, ovr: 86 },
    { name: "Марсело", en: "Marcelo", pos: "LB", flag: "🇧🇷", nation: "Бразилия", wc: 2014, ovr: 88 },
    { name: "Эрнандес", en: "Hernandez", pos: "LB", flag: "🇫🇷", nation: "Франция", wc: 2018, ovr: 87 },
    { name: "Тео", en: "Theo", pos: "LB", flag: "🇫🇷", nation: "Франция", wc: 2022, ovr: 87 },
    { name: "Занетти", en: "Zanetti", pos: "RB", flag: "🇦🇷", nation: "Аргентина", wc: 1998, ovr: 88 },
    { name: "Алвес", en: "Alves", pos: "RB", flag: "🇧🇷", nation: "Бразилия", wc: 2010, ovr: 88 },
    { name: "Карвахаль", en: "Carvajal", pos: "RB", flag: "🇪🇸", nation: "Испания", wc: 2022, ovr: 86 },
    { name: "Уокер", en: "Walker", pos: "RB", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", nation: "Англия", wc: 2018, ovr: 86 },
    { name: "Неста", en: "Nesta", pos: "CB", flag: "🇮🇹", nation: "Италия", wc: 2006, ovr: 91 },
    { name: "Пуйоль", en: "Puyol", pos: "CB", flag: "🇪🇸", nation: "Испания", wc: 2010, ovr: 89 },
    { name: "Пике", en: "Pique", pos: "CB", flag: "🇪🇸", nation: "Испания", wc: 2010, ovr: 87 },
    { name: "Хуммельс", en: "Hummels", pos: "CB", flag: "🇩🇪", nation: "Германия", wc: 2014, ovr: 88 },
    { name: "Кьеллини", en: "Chiellini", pos: "CB", flag: "🇮🇹", nation: "Италия", wc: 2014, ovr: 90 },
    { name: "Ван Дейк", en: "Van Dijk", pos: "CB", flag: "🇳🇱", nation: "Нидерланды", wc: 2022, ovr: 90 },
    { name: "Маркиньос", en: "Marquinhos", pos: "CB", flag: "🇧🇷", nation: "Бразилия", wc: 2022, ovr: 88 },
    { name: "Фердинанд", en: "Ferdinand", pos: "CB", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", nation: "Англия", wc: 2006, ovr: 88 },
    { name: "Лусио", en: "Lucio", pos: "CB", flag: "🇧🇷", nation: "Бразилия", wc: 2002, ovr: 87 },
    { name: "Этоо", en: "Eto'o", pos: "ST", flag: "🇨🇲", nation: "Камерун", wc: 2002, ovr: 87 },
    { name: "Этоо", en: "Eto'o", pos: "ST", flag: "🇨🇲", nation: "Камерун", wc: 2010, ovr: 90 },
    { name: "Сонг", en: "Song", pos: "CB", flag: "🇨🇲", nation: "Камерун", wc: 2002, ovr: 84 },
    { name: "Сонг", en: "Song", pos: "CDM", flag: "🇨🇲", nation: "Камерун", wc: 2010, ovr: 85 },
    { name: "Онана", en: "Onana", pos: "GK", flag: "🇨🇲", nation: "Камерун", wc: 2022, ovr: 85 },
    { name: "Абубакар", en: "Aboubakar", pos: "ST", flag: "🇨🇲", nation: "Камерун", wc: 2022, ovr: 84 },
    { name: "Эссьен", en: "Essien", pos: "CM", flag: "🇬🇭", nation: "Гана", wc: 2006, ovr: 88 },
    { name: "Гьян", en: "Gyan", pos: "ST", flag: "🇬🇭", nation: "Гана", wc: 2010, ovr: 85 },
    { name: "Аппиа", en: "Appiah", pos: "CM", flag: "🇬🇭", nation: "Гана", wc: 2006, ovr: 84 },
    { name: "Айю", en: "Ayew", pos: "LW", flag: "🇬🇭", nation: "Гана", wc: 2010, ovr: 84 },
    { name: "Партей", en: "Partey", pos: "CDM", flag: "🇬🇭", nation: "Гана", wc: 2022, ovr: 85 },
    { name: "Кудус", en: "Kudus", pos: "CAM", flag: "🇬🇭", nation: "Гана", wc: 2022, ovr: 84 },
    { name: "Манса", en: "Mensah", pos: "CB", flag: "🇬🇭", nation: "Гана", wc: 2010, ovr: 82 },
    { name: "Дьоф", en: "Diouf", pos: "ST", flag: "🇸🇳", nation: "Сенегал", wc: 2002, ovr: 84 },
    { name: "Диао", en: "Diao", pos: "CM", flag: "🇸🇳", nation: "Сенегал", wc: 2002, ovr: 82 },
    { name: "Мане", en: "Mane", pos: "LW", flag: "🇸🇳", nation: "Сенегал", wc: 2018, ovr: 90 },
    { name: "Мане", en: "Mane", pos: "LW", flag: "🇸🇳", nation: "Сенегал", wc: 2022, ovr: 89 },
    { name: "Кулибали", en: "Koulibaly", pos: "CB", flag: "🇸🇳", nation: "Сенегал", wc: 2022, ovr: 87 },
    { name: "Гейе", en: "Gueye", pos: "CM", flag: "🇸🇳", nation: "Сенегал", wc: 2018, ovr: 84 },
    { name: "Менди", en: "Mendy", pos: "GK", flag: "🇸🇳", nation: "Сенегал", wc: 2022, ovr: 86 },
    { name: "Сарр", en: "Sarr", pos: "RW", flag: "🇸🇳", nation: "Сенегал", wc: 2022, ovr: 83 }
];

let auction = { slots: AUCTION_SLOTS.map(function () { return null; }), rerolls: 1, open: false };

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
        showAura("champ", t("promoAura"), "+100 000 $", PROMO_CODE, "#ffd83d", 2000);
        addLog(t("logPromo", { code: PROMO_CODE, pay: money(PROMO_PAY) }));
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
        setPromoHints(t("promoBad"));
        return;
    }
    if (player && player.name) {
        if (player.codeMadrid) {
            setPromoHints(t("promoUsed"));
            return;
        }
        givePromoMoney();
        setPromoHints(t("promoOk"));
        return;
    }
    if (localStorage.getItem(PROMO_PENDING) === "1") {
        setPromoHints(t("promoSaved"));
        return;
    }
    localStorage.setItem(PROMO_PENDING, "1");
    setPromoHints(t("promoPending"));
    Sfx.ding();
}

function pickArr(list) { return list[Math.floor(Math.random() * list.length)]; }
function starKey(p) { return (p.name || "") + "|" + (p.wc || ""); }
function posFitsSlot(playerPos, slotPos) {
    return slotFamily(playerPos) === slotFamily(slotPos);
}
function copyStar(src) {
    return { id: src.id || wcId(src), name: src.name, en: src.en || "", pos: src.pos, flag: src.flag, nation: src.nation, wc: src.wc, ovr: src.ovr, exclusive: !!src.exclusive };
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
    return WC_STARS.concat(EXCLUSIVES).filter(function (s) {
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
        auction = { slots: data.slots, rerolls: data.rerolls === 0 ? 0 : 1, open: data.open === true };
        repairAuctionSlots();
        auction.slots.forEach(function (star) { if (star && !star.id) star.id = wcId(star); });
        if (auctionFilled() >= 11) auction.open = false;
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
            slot.className = "pitch-slot" + (p ? " filled" : "") + (p && p.exclusive ? " exclusive" : "");
            slot.setAttribute("data-auc", String(idx));
            if (p) {
                const name = document.createElement("b");
                name.textContent = p.flag + " " + shown(p);
                slot.appendChild(name);
                const metaLine = document.createElement("small");
                metaLine.textContent = p.pos + " " + p.ovr + " · " + t("wc") + " " + p.wc;
                slot.appendChild(metaLine);
            } else {
                slot.textContent = slotPos;
            }
            row.appendChild(slot);
        });
        pitch.appendChild(row);
    });
    if (meta) {
        meta.textContent = t("auctionMetaLine", { n: auctionFilled(), r: auction.rerolls });
    }
    const rollBtn = get("auctionRollAll");
    if (rollBtn && !auctionBusy) {
        rollBtn.textContent = auction.open && auctionFilled() < 11
            ? t("player")
            : t("dreamSpin", { pay: money(AUCTION_PAY) });
    }
}
function dropAuctionStars() {
    if (!player || !Array.isArray(player.squad)) return;
    const ids = {};
    auction.slots.forEach(function (star) { if (star && star.id) ids[star.id] = true; });
    player.squad = player.squad.filter(function (id) { return !ids[id]; });
}

function keepAuctionStar(star) {
    if (!isClub() || !star || !star.id) return false;
    if (!Array.isArray(player.squad)) player.squad = [];
    if (player.squad.indexOf(star.id) >= 0) return true;
    if (player.squad.length >= SQUAD_XI + SQUAD_BENCH) {
        addLog(t("logSquadFull"));
        return false;
    }
    player.squad.push(star.id);
    save();
    return true;
}

function showAuction() {
    if (!player || !player.name || !isClub()) {
        Sfx.error();
        alert(t("auctionClubOnly"));
        return;
    }
    hideStudioSplash();
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
    el.className = "pitch-slot filled" + (p && p.exclusive ? " exclusive" : "") + (spinning ? " spinning" : "");
    el.innerHTML = "";
    const name = document.createElement("b");
    name.textContent = p.flag + " " + shown(p);
    el.appendChild(name);
    const metaLine = document.createElement("small");
    metaLine.textContent = spinning ? "…" : (p.pos + " " + p.ovr + " · " + t("wc") + " " + p.wc);
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
        const prev = auction.slots[idx];
        if (prev && prev.id && player && Array.isArray(player.squad)) {
            player.squad = player.squad.filter(function (id) { return id !== prev.id; });
        }
        auction.slots[idx] = copyStar(star);
        if (auctionFilled() === 11) auction.open = false;
        keepAuctionStar(auction.slots[idx]);
        saveAuction();
        renderAuction();
        const done = document.querySelector('[data-auc="' + idx + '"]');
        if (done) done.classList.add("reveal");
        if (star.ovr >= 92) {
            showAura("champ", t("wc") + " " + star.wc, shown(star), star.flag + " " + star.pos + " " + star.ovr, "#ffd83d", 1500);
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
        if (meta) meta.textContent = t("auctionReroll");
        return;
    }
    const pool = starsForSlot(idx, idx);
    if (!pool.length) {
        Sfx.error();
        return;
    }
    auctionReveal(idx, pickArr(pool), true);
}
function auctionPay() {
    const meta = get("auctionMeta");
    if (!player || !player.name || !isClub()) {
        Sfx.error();
        if (meta) meta.textContent = t("auctionClubOnly");
        return false;
    }
    if ((player.respect || 0) < AUCTION_PAY) {
        Sfx.error();
        if (meta) meta.textContent = t("dreamNeed", { pay: money(AUCTION_PAY) });
        return false;
    }
    player.respect -= AUCTION_PAY;
    save();
    updateRespect();
    return true;
}

function auctionBlank() {
    return AUCTION_SLOTS.map(function () { return null; });
}

function auctionBuySession() {
    if (auctionBusy) return;
    if (auction.open && auctionFilled() < 11) {
        auctionRollOne();
        return;
    }
    if (!auctionPay()) return;
    dropAuctionStars();
    auction.slots = auctionBlank();
    save();
    auction.open = true;
    auction.rerolls = 1;
    saveAuction();
    renderAuction();
    showAura("transfer", "−" + money(AUCTION_PAY), t("dreamTitle"), t("dreamOpen"), "#ffd83d", 1400);
    Sfx.ding();
}

function auctionRollOne() {
    if (auctionBusy) return;
    Sfx.unlock();
    const empty = [];
    for (let i = 0; i < 11; i++) if (!auction.slots[i]) empty.push(i);
    if (!empty.length) {
        Sfx.error();
        const meta = get("auctionMeta");
        if (meta) meta.textContent = t("auctionFull");
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
    if (auctionBusy) return;
    Sfx.unlock();
    Sfx.click();
    if (auctionFilled() === 11) {
        if (!auctionPay()) return;
        auction.open = true;
    }
    dropAuctionStars();
    auction.slots = auctionBlank();
    save();
    auction.rerolls = 1;
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
    on("modeCoach", "click", openCoachCreate);
    on("coachHome", "click", openCoachCreate);
    on("coachOffers", "click", function (event) {
        const hire = event.target.closest("[data-hire]");
        if (!hire) return;
        startCoachCareer(hire.getAttribute("data-hire"));
    });
    on("modeBattle", "click", startOnlineFromMenu);
    on("modeAuction", "click", showAuction);
    on("auctionBack", "click", function () {
        Sfx.click();
        if (player && player.name && isClub()) {
            showCareer();
            showPanel("club");
            return;
        }
        showModeScreen();
    });
    on("auctionRollAll", "click", auctionBuySession);
    on("auctionReset", "click", auctionReset);
    on("auctionPitch", "click", function (event) {
        const slot = event.target.closest("[data-auc]");
        if (!slot) return;
        auctionRollSlot(+slot.getAttribute("data-auc"));
    });
    on("openAuctionBtn", "click", showAuction);
    const planRow = get("planRow");
    if (planRow) {
        planRow.addEventListener("click", function (event) {
            const btn = event.target.closest("[data-plan]");
            if (!btn) return;
            Sfx.click();
            matchPlan = btn.getAttribute("data-plan") || "balance";
            if (matchPlan !== "attack" && matchPlan !== "defend") matchPlan = "balance";
            if (player) player.matchPlan = matchPlan;
            updatePlanUI();
            save();
        });
    }
    const moreTabs = get("moreTabs");
    if (moreTabs) {
        moreTabs.addEventListener("click", function (event) {
            const btn = event.target.closest("[data-more]");
            if (!btn) return;
            Sfx.click();
            const id = btn.getAttribute("data-more");
            moreTabs.querySelectorAll("[data-more]").forEach(function (el) {
                el.classList.toggle("on", el === btn);
            });
            document.querySelectorAll(".more-pane").forEach(function (pane) {
                pane.classList.toggle("on", pane.getAttribute("data-more") === id);
            });
        });
    }
    on("calOpenMatch", "click", openEventCal);
    on("calOpenMore", "click", openEventCal);
    on("calClose", "click", function () { Sfx.click(); closeEventCal(); });
        on("socialOpen", "click", function () { Sfx.click(); openSocial(); });
        const socPush = get("socPush");
        if (socPush) socPush.addEventListener("click", function () {
            const id = socPush.getAttribute("data-id");
            socPush.hidden = true;
            if (!id) return;
            Sfx.click();
            socialPane = "chat";
            socialFocusId = id;
            openSocial();
        });
        const coachDesk = get("coachDesk");
        if (coachDesk) coachDesk.addEventListener("click", function (event) {
            const prep = event.target.closest("[data-prep]");
            const offer = event.target.closest("[data-offer]");
            if (prep) {
                Sfx.click();
                doPrep(prep.getAttribute("data-prep"));
                return;
            }
            if (offer) {
                Sfx.click();
                startCoachCareer(offer.getAttribute("data-offer"));
            }
        });
    on("socialClose", "click", function () { Sfx.click(); closeSocial(); });
    on("socialPublish", "click", publishSocial);
    on("socialAd", "click", postAd);
    on("retireBtn", "click", retireCareer);
    on("socialBack", "click", function () {
        Sfx.click();
        socialPane = "feed";
        socialFocusId = "";
        renderSocial();
    });
    const socFollowBox = get("socFollowBox");
    if (socFollowBox && !socFollowBox._wired) {
        socFollowBox._wired = true;
        socFollowBox.addEventListener("click", function () {
            Sfx.click();
            socialPane = "subs";
            socialFocusId = "";
            renderSocial();
        });
    }
    const socTabs = get("socTabs");
    if (socTabs) {
        socTabs.addEventListener("click", function (event) {
            const btn = event.target.closest("[data-soc]");
            if (!btn) return;
            Sfx.click();
            const key = btn.getAttribute("data-soc");
            socialPane = key === "friends" || key === "plan" ? key : "feed";
            socialFocusId = "";
            renderSocial();
        });
    }
    const socialComposer = get("socialComposer");
    if (socialComposer) {
        socialComposer.addEventListener("submit", function (event) {
            event.preventDefault();
            publishSocial();
        });
    }
    const socialOverlay = get("socialOverlay");
    if (socialOverlay) {
        socialOverlay.addEventListener("click", function (event) {
            if (event.target === socialOverlay) {
                Sfx.click();
                closeSocial();
            }
        });
    }
    const calOverlay = get("calOverlay");
    if (calOverlay) {
        calOverlay.addEventListener("click", function (event) {
            if (event.target === calOverlay) {
                Sfx.click();
                closeEventCal();
            }
        });
    }
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
    on("treatBtn", "click", treatInjury);
    on("wcBtn", "click", playWorldCup);
    get("matchBtn").addEventListener("click", function () { playMatch(false); });
    const betPickBox = get("betPick");
    if (betPickBox) {
        betPickBox.addEventListener("click", function (event) {
            const btn = event.target.closest("[data-bet]");
            if (!btn || betOpen()) return;
            betPick = btn.getAttribute("data-bet");
            paintBet();
            Sfx.click();
        });
    }
    const betStakeBox = get("betStake");
    if (betStakeBox) {
        betStakeBox.addEventListener("click", function (event) {
            const btn = event.target.closest("[data-stake]");
            if (!btn || betOpen()) return;
            betStake = Number(btn.getAttribute("data-stake")) || 50;
            paintBet();
            Sfx.click();
        });
    }
    const betGo = get("betGo");
    if (betGo) betGo.addEventListener("click", placeBet);
    const buyoutBtn = get("buyoutBtn");
    if (buyoutBtn) buyoutBtn.addEventListener("click", buyoutTeam);
    get("bribeBtn").addEventListener("click", function () { playMatch(true); });
    get("onlineBtn").addEventListener("click", openOnlineLobby);
    get("newCareerBtn").addEventListener("click", newCareer);
    const sponsorList = get("sponsorList");
    if (sponsorList) {
        sponsorList.addEventListener("click", function (event) {
            const drop = event.target.closest("[data-drop]");
            if (drop) {
                dropSponsor(drop.getAttribute("data-drop"));
                return;
            }
            const btn = event.target.closest("[data-deal]");
            if (!btn || btn.disabled) return;
            signSponsor(btn.getAttribute("data-deal"));
        });
    }
    const brandTable = get("brandTableBody");
    if (brandTable) {
        brandTable.addEventListener("click", function (event) {
            const btn = event.target.closest("[data-found]");
            if (!btn || btn.disabled) return;
            foundBrand(btn.getAttribute("data-found"));
        });
    }
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
    document.querySelectorAll("[data-save]").forEach(function (btn) {
        btn.addEventListener("click", function () {
            bankIn(btn.getAttribute("data-save"));
        });
    });
    const loanBox = get("bankLoans");
    if (loanBox) {
        loanBox.addEventListener("click", function (event) {
            const btn = event.target.closest("[data-loan]");
            if (!btn) return;
            bankBorrow(btn.getAttribute("data-loan"));
        });
    }
    const bankOutBtn = get("bankOut");
    if (bankOutBtn) bankOutBtn.addEventListener("click", bankOut);
    const bankRepayBtn = get("bankRepay");
    if (bankRepayBtn) bankRepayBtn.addEventListener("click", bankRepay);
    document.querySelectorAll("[data-bank]").forEach(function (btn) {
        btn.addEventListener("click", function () {
            const sum = get("bankSum");
            if (!sum) return;
            Sfx.click();
            sum.value = btn.getAttribute("data-bank") === "all" ? "" : btn.getAttribute("data-bank");
        });
    });
    document.querySelectorAll("[data-debt]").forEach(function (btn) {
        btn.addEventListener("click", function () {
            const sum = get("debtSum");
            if (!sum) return;
            Sfx.click();
            sum.value = btn.getAttribute("data-debt") === "all" ? "" : btn.getAttribute("data-debt");
        });
    });
    const debtOpen = get("bankDebtOpen");
    if (debtOpen) {
        debtOpen.addEventListener("click", function () {
            Sfx.click();
            const box = get("debtOverlay");
            if (box) box.hidden = false;
            renderBank();
        });
    }
    const debtClose = get("debtClose");
    if (debtClose) {
        debtClose.addEventListener("click", function () {
            Sfx.click();
            const box = get("debtOverlay");
            if (box) box.hidden = true;
        });
    }
    const debtOverlay = get("debtOverlay");
    if (debtOverlay) {
        debtOverlay.addEventListener("click", function (event) {
            if (event.target !== debtOverlay) return;
            debtOverlay.hidden = true;
        });
    }
    const stadUp = get("stadUp");
    if (stadUp) stadUp.addEventListener("click", function () { Sfx.click(); upgradeStadium(); });
    const stadKUp = get("stadKUp");
    if (stadKUp) stadKUp.addEventListener("click", function () { Sfx.click(); upgradeStadium(); });
    ["gearBuy", "stadGearBtn", "stadKGearBtn"].forEach(function (id) {
        const btn = get(id);
        if (btn) btn.addEventListener("click", function () { Sfx.click(); buyGear(); });
    });
    ["stadLines", "stadKLines"].forEach(function (id) {
        const btn = get(id);
        if (btn) btn.addEventListener("click", function () { Sfx.click(); buyYard("lines"); });
    });
    ["stadStaff", "stadKStaff"].forEach(function (id) {
        const btn = get(id);
        if (btn) btn.addEventListener("click", function () { Sfx.click(); buyYard("staff"); });
    });
    ["stadProps", "stadKProps", "stadUps", "stadKUps"].forEach(function (id) {
        const box = get(id);
        if (!box) return;
        box.addEventListener("click", function (event) {
            const prop = event.target.closest("[data-prop]");
            const up = event.target.closest("[data-up]");
            if (prop) {
                Sfx.click();
                buyYardItem("props", prop.getAttribute("data-prop"));
            } else if (up) {
                Sfx.click();
                buyYardItem("ups", up.getAttribute("data-up"));
            }
        });
    });
    const shopModeBox = get("shopMode");
    if (shopModeBox) {
        shopModeBox.addEventListener("click", function (event) {
            const btn = event.target.closest("[data-mode]");
            if (!btn) return;
            shopMode = btn.getAttribute("data-mode");
            shopFilter = (SHOP_TABS[shopMode] || ["hair"])[0];
            Sfx.click();
            paintShop();
        });
    }
    const shopTabs = get("shopTabs");
    if (shopTabs) {
        shopTabs.addEventListener("click", function (event) {
            const btn = event.target.closest("[data-shop]");
            if (!btn) return;
            shopFilter = btn.getAttribute("data-shop");
            Sfx.click();
            paintShop();
        });
    }
    const shopList = get("shopList");
    if (shopList) {
        shopList.addEventListener("click", function (event) {
            const btn = event.target.closest("[data-buy]");
            if (!btn) return;
            buyWear(btn.getAttribute("data-buy"));
        });
    }
    const skinPicks = get("skinPicks");
    if (skinPicks) {
        skinPicks.addEventListener("click", function (event) {
            const btn = event.target.closest("[data-skin]");
            if (!btn) return;
            setSkin(btn.getAttribute("data-skin"));
        });
    }
    const kitCard = get("kitCard");
    if (kitCard) {
        kitCard.addEventListener("click", function (event) {
            const btn = event.target.closest("[data-kit]");
            if (!btn) return;
            setKit(btn.getAttribute("data-kit"), btn.getAttribute("data-ink") || "");
        });
    }
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
    const pvpRegBtn = get("pvpRegBtn");
    const pvpQueueBtn = get("pvpQueueBtn");
    const pvpBotBtn = get("pvpBotBtn");
    if (pvpRegBtn) pvpRegBtn.addEventListener("click", function () { Sfx.click(); pvpEnter(); });
    if (pvpQueueBtn) pvpQueueBtn.addEventListener("click", function () { Sfx.click(); pvpQueue(); });
    if (pvpBotBtn) pvpBotBtn.addEventListener("click", function () {
        Sfx.click();
        if (onlineTimer) clearTimeout(onlineTimer);
        stopPvpPoll();
        showOnlineFound(pickOnlineRival());
    });
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
            const voucher = event.target.closest("[data-voucher]");
            if (voucher) {
                Sfx.click();
                buyVouchers(Number(voucher.getAttribute("data-voucher")), Number(voucher.getAttribute("data-cost")));
                return;
            }
            const academyBtn = event.target.closest("[data-academy]");
            if (academyBtn) {
                Sfx.click();
                openAcademy(academyBtn.getAttribute("data-academy"));
                return;
            }
            const bossBtn = event.target.closest("[data-boss]");
            if (bossBtn) {
                Sfx.click();
                hireBoss(bossBtn.getAttribute("data-boss"));
                return;
            }
            const btn = event.target.closest("[data-star]");
            if (!btn) return;
            const star = TRANSFER_STARS.find((s) => s.id === btn.getAttribute("data-star"));
            if (star) {
                Sfx.click();
                signStar(star);
            }
        });
    }
    const squadCard = get("squadCard");
    if (squadCard) {
        squadCard.addEventListener("click", function (event) {
            const sell = event.target.closest("[data-sell]");
            if (sell) {
                const star = starCard(sell.getAttribute("data-sell"));
            if (star) {
                Sfx.click();
                releaseStar(star);
            }
                return;
            }
            const role = event.target.closest("[data-role]");
            if (!role) return;
            toggleSquadRole(role.getAttribute("data-role"));
        });
    }
    get("muteBtn").addEventListener("click", function (event) {
        event.stopPropagation();
        Sfx.unlock();
        Sfx.setMuted(!Sfx.isMuted());
        syncMuteButton();
        if (!Sfx.isMuted()) Sfx.click();
    });
    const splash = get("studioSplash");
    if (splash) {
        let studioDone = false;
        function dismissStudio() {
            if (studioDone) return;
            studioDone = true;
            Sfx.unlock();
            Sfx.logo();
            Sfx.themeStart();
            hideStudioSplash();
        }
        splash.addEventListener("pointerup", dismissStudio);
        splash.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") dismissStudio();
        });
        splash.tabIndex = 0;
    }
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
        if (document.visibilityState === "hidden") {
            if (player.name) save();
            Sfx.halt();
        } else {
            Sfx.wake();
        }
    });
    window.addEventListener("pagehide", function () {
        if (player.name) save();
        Sfx.halt();
    });
}

window.onLangChange = function () {
    if (get("createScreen") && get("createScreen").style.display === "block") {
        const mode = selectedMode || "player";
        get("createTitle").textContent = mode === "club" ? t("createClub") : t("createPlayer");
        if (get("createHeading")) get("createHeading").textContent = mode === "club" ? t("newClub") : t("newPlayer");
        get("startBtn").textContent = mode === "club" ? t("startClub") : t("startCareer");
        if (mode === "club") {
            const nat = nationById(selectedNation);
            if (nat) get("clubCity").placeholder = t("cityEg", { city: nationCity(nat) });
        }
        if (typeof renderCreatePicks === "function") renderCreatePicks();
    }
    updateContinueBtn();
    if (player && player.name) {
        renderAll();
        const draftBox = get("draftOverlay");
        if (draftBox && !draftBox.hidden) renderDraft();
    }
    if (typeof renderAuction === "function") renderAuction();
};

function applyStyle(id) {
    if (id !== "plain" && id !== "arcade" && id !== "board" && id !== "premium") id = "premium";
    document.documentElement.setAttribute("data-style", id);
    try { localStorage.setItem("fc-style", id); } catch (e) {}
    document.querySelectorAll("#stylePanel [data-style]").forEach(function (btn) {
        btn.classList.toggle("on", btn.getAttribute("data-style") === id);
    });
}

function deskNote(text) {
    const note = get("deskNote");
    if (note) note.textContent = text || "";
}

function tryDesk() {
    const input = get("deskPass");
    const pass = input ? String(input.value || "").trim() : "";
    if (pass !== "120115") {
        const tools = get("deskTools");
        if (tools) tools.hidden = true;
        if (input) input.value = "";
        deskNote(t("deskBad"));
        Sfx.error();
        return;
    }
    const lock = get("deskLock");
    const tools = get("deskTools");
    if (lock) lock.hidden = true;
    if (tools) tools.hidden = false;
    if (input) input.value = "";
    const pool = get("deskPool");
    if (pool) pool.value = String(Math.round(poolARate() * 100));
    paintDeskFace();
    deskNote("");
    Sfx.ding();
}

function paintDeskFace() {
    const el = get("deskFaceAge");
    if (el) el.textContent = String(shownFaceAge());
}

function deskFaceStep(dir) {
    if (!deskCareer()) return;
    if (isClub()) {
        deskNote(t("deskFaceClub"));
        Sfx.error();
        return;
    }
    const career = typeof player.age === "number" ? player.age : 16;
    let age = Math.max(16, Math.min(60, shownFaceAge() + dir));
    if (age === career) delete player.faceAge;
    else player.faceAge = age;
    updateHeader();
    renderSocial();
    paintDeskFace();
    save();
    deskNote(t("deskFaceSet", { n: age }));
    Sfx.click();
}

function deskCareer() {
    if (player && player.name) return true;
    deskNote(t("adminNoCareer"));
    Sfx.error();
    return false;
}

function deskShift(days) {
    shiftClock(days * 24 * 60 * 60 * 1000);
    if (player && player.name && isClub()) syncDraftWindow();
    updateDrop();
    deskNote(t("adminTime"));
    Sfx.ding();
}

function deskMoney() {
    if (!deskCareer()) return;
    player.respect = (player.respect || 0) + 10000;
    updateRespect();
    save();
    deskNote(t("adminCash"));
    Sfx.ding();
}

function deskVoucher() {
    if (!deskCareer()) return;
    ensureDraft();
    player.draftTokens += 1;
    save();
    updateDrop();
    const voucherCount = get("voucherCount");
    if (voucherCount) voucherCount.textContent = t("voucherHave", { n: player.draftTokens });
    deskNote(t("adminTok"));
    Sfx.ding();
}

function deskPoolSet() {
    const input = get("deskPool");
    let n = Math.round(Number(input && input.value));
    if (!(n >= 0)) n = 6;
    n = Math.max(0, Math.min(100, n));
    if (input) input.value = String(n);
    try { localStorage.setItem("fc-pool-a", String(n)); } catch (e) {}
    deskNote(t("adminPoolASet", { n: n }));
    Sfx.click();
}

document.addEventListener("DOMContentLoaded", function () {
    ["promoCode", "promoCodeCareer"].forEach(function (id) {
        const el = get(id);
        if (el) el.value = "";
    });
    bind();
    applyStyle(document.documentElement.getAttribute("data-style") || "premium");
    const styleBtn = get("styleBtn");
    const stylePanel = get("stylePanel");
    if (styleBtn && stylePanel) {
        let styleHold = 0;
        styleBtn.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
            Sfx.click();
            stylePanel.hidden = !stylePanel.hidden;
            if (!stylePanel.hidden) styleHold = Date.now() + 450;
        });
        stylePanel.addEventListener("click", function (event) {
            event.stopPropagation();
            const btn = event.target.closest("button[data-style]");
            if (!btn) return;
            event.stopPropagation();
            Sfx.click();
            applyStyle(btn.getAttribute("data-style"));
            stylePanel.hidden = true;
        });
        const draftOpen = get("draftOpen");
        const draftClose = get("draftClose");
        if (draftOpen) draftOpen.addEventListener("click", function () { Sfx.click(); openDraft(); });
        const taleOpen = get("taleOpen");
        const taleActs = get("taleActs");
        const taleLater = get("taleLater");
        if (taleOpen) taleOpen.addEventListener("click", function () { Sfx.click(); openTale(); });
        if (taleActs) taleActs.addEventListener("click", function (event) {
            const btn = event.target.closest("[data-pick]");
            if (!btn) return;
            Sfx.click();
            pickTale(btn.getAttribute("data-pick"));
        });
        if (taleLater) taleLater.addEventListener("click", function () { Sfx.click(); closeTale(); });
        const askActs = get("askActs");
        if (askActs) askActs.addEventListener("click", function (event) {
            const btn = event.target.closest("[data-ask]");
            if (!btn) return;
            Sfx.click();
            const pick = btn.getAttribute("data-ask");
            const input = get("askSum");
            closeClubAsk(pick, pick === "send" && input ? input.value : "");
        });
        const liveDraft = get("liveDraft");
        if (liveDraft) liveDraft.addEventListener("click", function () { Sfx.click(); openDraft(); });
        const voucherBuy = get("voucherBuy");
        if (voucherBuy) voucherBuy.addEventListener("click", function () {
            Sfx.click();
            buyVouchers(1, VOUCHER_COST);
        });
        if (draftClose) draftClose.addEventListener("click", function () { Sfx.click(); closeDraft(); });
        const pullReveal = get("pullReveal");
        const pullOk = get("pullOk");
        if (pullReveal) pullReveal.addEventListener("click", function (event) {
            if (event.target === pullReveal || event.target === pullOk) hidePull();
        });
        if (pullOk) pullOk.addEventListener("click", function () { Sfx.click(); hidePull(); });
        document.addEventListener("click", function (event) {
            if (Date.now() < styleHold) return;
            if (event.target.closest("#stylePanel") || event.target.closest("#styleBtn")) return;
            stylePanel.hidden = true;
        });
        const deskGo = get("deskGo");
        const deskPass = get("deskPass");
        if (deskGo) deskGo.addEventListener("click", function () { tryDesk(); });
        if (deskPass) deskPass.addEventListener("keydown", function (event) {
            if (event.key === "Enter") tryDesk();
        });
        const deskDay = get("deskDay");
        const deskSkip = get("deskSkip");
        const deskMoneyBtn = get("deskMoney");
        const deskDraft = get("deskDraft");
        const deskPoolBtn = get("deskPoolSet");
        if (deskDay) deskDay.addEventListener("click", function () { deskShift(1); });
        if (deskSkip) deskSkip.addEventListener("click", function () { deskShift(4); });
        if (deskMoneyBtn) deskMoneyBtn.addEventListener("click", deskMoney);
        if (deskDraft) deskDraft.addEventListener("click", deskVoucher);
        if (deskPoolBtn) deskPoolBtn.addEventListener("click", deskPoolSet);
        const deskFaceBack = get("deskFaceBack");
        const deskFaceFwd = get("deskFaceFwd");
        if (deskFaceBack) deskFaceBack.addEventListener("click", function () { deskFaceStep(-1); });
        if (deskFaceFwd) deskFaceFwd.addEventListener("click", function () { deskFaceStep(1); });
    }
    syncMuteButton();
    try {
        localStorage.removeItem("fc-admin");
    } catch (e) {}
    paintLive();
    setInterval(paintLive, 1000);
    renderRecords();
    loadAuction();
    load();
    showModeScreen();
    setTimeout(function () { messiChipPing(); }, 240000);
    setInterval(function () { messiChipPing(); }, 240000);
    setInterval(function () { friendPing(false); }, 1800000);
});

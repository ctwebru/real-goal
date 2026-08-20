export const HOMES = ["Радужная", "Щукина-1", "Щукина-2"] as const;
export type Home = (typeof HOMES)[number];

export const WAVES = ["Март", "Апрель", "Май", "Июнь", "Июль", "Август"];

export const NETWORK_TREND = [
  { wave: "Март", csat: 4.2, nps: 41, responses: 38 },
  { wave: "Апрель", csat: 4.3, nps: 45, responses: 44 },
  { wave: "Май", csat: 4.1, nps: 38, responses: 41 },
  { wave: "Июнь", csat: 4.4, nps: 52, responses: 47 },
  { wave: "Июль", csat: 4.5, nps: 57, responses: 52 },
  { wave: "Август", csat: 4.4, nps: 54, responses: 49 },
];

export const HOME_STATS = [
  { home: "Радужная", csat: 4.7, nps: 68, responses: 21, lowShare: 4, delta: 0.2 },
  { home: "Щукина-1", csat: 4.4, nps: 55, responses: 17, lowShare: 9, delta: 0.1 },
  { home: "Щукина-2", csat: 3.9, nps: 31, responses: 11, lowShare: 23, delta: -0.4 },
];

export const CATEGORY_SCORES = [
  { category: "Уход", Радужная: 4.8, "Щукина-1": 4.5, "Щукина-2": 4.0 },
  { category: "Чистота", Радужная: 4.7, "Щукина-1": 4.4, "Щукина-2": 3.7 },
  { category: "Питание", Радужная: 4.4, "Щукина-1": 4.0, "Щукина-2": 3.4 },
  { category: "Персонал", Радужная: 4.9, "Щукина-1": 4.6, "Щукина-2": 4.1 },
  { category: "Досуг", Радужная: 4.5, "Щукина-1": 4.2, "Щукина-2": 3.6 },
  { category: "Прогулки", Радужная: 4.6, "Щукина-1": 4.3, "Щукина-2": 3.8 },
  { category: "Медицина", Радужная: 4.8, "Щукина-1": 4.5, "Щукина-2": 4.2 },
  { category: "Информирование", Радужная: 4.5, "Щукина-1": 4.1, "Щукина-2": 3.5 },
  { category: "Управляющий", Радужная: 4.7, "Щукина-1": 4.3, "Щукина-2": 3.3 },
];

export type Resident = {
  id: string;
  name: string;
  home: Home;
  relative: string;
  trend: { wave: string; csat: number }[];
  lastNps: number;
  flag: "ok" | "watch" | "risk";
  lastComment?: string;
  lastDate: string;
};

export const RESIDENTS: Resident[] = [
  {
    id: "r-104",
    name: "Мария Ивановна К.",
    home: "Радужная",
    relative: "Ольга (дочь)",
    trend: [
      { wave: "Март", csat: 4.4 },
      { wave: "Май", csat: 4.6 },
      { wave: "Июль", csat: 4.8 },
      { wave: "Август", csat: 4.9 },
    ],
    lastNps: 10,
    flag: "ok",
    lastComment: "Отдельное спасибо за прогулки и внимание к маме.",
    lastDate: "12 августа",
  },
  {
    id: "r-217",
    name: "Пётр Николаевич С.",
    home: "Щукина-1",
    relative: "Андрей (сын)",
    trend: [
      { wave: "Март", csat: 4.6 },
      { wave: "Май", csat: 4.3 },
      { wave: "Июль", csat: 3.9 },
      { wave: "Август", csat: 3.6 },
    ],
    lastNps: 6,
    flag: "watch",
    lastComment: "Стало сложнее дозвониться, об изменениях узнаём последними.",
    lastDate: "10 августа",
  },
  {
    id: "r-318",
    name: "Анна Петровна Л.",
    home: "Щукина-2",
    relative: "Ирина (дочь)",
    trend: [
      { wave: "Март", csat: 4.1 },
      { wave: "Май", csat: 3.5 },
      { wave: "Июль", csat: 3.0 },
      { wave: "Август", csat: 2.4 },
    ],
    lastNps: 3,
    flag: "risk",
    lastComment: "Питание однообразное, дважды не выполнили назначение врача.",
    lastDate: "9 августа",
  },
  {
    id: "r-402",
    name: "Валентина Сергеевна М.",
    home: "Радужная",
    relative: "Наталья (дочь)",
    trend: [
      { wave: "Март", csat: 4.2 },
      { wave: "Май", csat: 4.4 },
      { wave: "Июль", csat: 4.4 },
      { wave: "Август", csat: 4.6 },
    ],
    lastNps: 9,
    flag: "ok",
    lastDate: "11 августа",
  },
  {
    id: "r-511",
    name: "Григорий Львович Б.",
    home: "Щукина-2",
    relative: "Елена (внучка)",
    trend: [
      { wave: "Март", csat: 3.8 },
      { wave: "Май", csat: 3.9 },
      { wave: "Июль", csat: 3.7 },
      { wave: "Август", csat: 3.8 },
    ],
    lastNps: 7,
    flag: "watch",
    lastComment: "Хотелось бы больше занятий в будние дни.",
    lastDate: "8 августа",
  },
];

export const FLAG_LABEL: Record<Resident["flag"], string> = {
  ok: "Всё хорошо",
  watch: "Наблюдение",
  risk: "Требует внимания",
};

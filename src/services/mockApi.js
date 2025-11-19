import { v4 as uuid } from "uuid";
import {
  addMinutes,
  isWithinInterval,
  setHours,
  setMinutes,
  setSeconds,
  isAfter,
  isBefore,
} from "date-fns";

// ===== THEME =====
export function setTheme(mode) {
  if (mode === "light") {
    document.documentElement.style.setProperty("--bg", "#f5f7fb");
    document.documentElement.style.setProperty("--panel", "#ffffff");
    document.documentElement.style.setProperty("--panel-2", "#f1f3f8");
    document.documentElement.style.setProperty("--text", "#141a21");
    document.documentElement.style.setProperty("--muted", "#4b5b70");
    document.documentElement.style.setProperty("--border", "#dde3ee");
  } else {
    // по умолчанию — тёмная тема
    document.documentElement.style.removeProperty("--bg");
    document.documentElement.style.removeProperty("--panel");
    document.documentElement.style.removeProperty("--panel-2");
    document.documentElement.style.removeProperty("--text");
    document.documentElement.style.removeProperty("--muted");
    document.documentElement.style.removeProperty("--border");
  }
}

// ===== AUTH =====
const LS_USERS = "reels.users";
const LS_SESSION = "reels.session";

export function ensureSeed() {
  if (!localStorage.getItem(LS_USERS)) {
    const users = [
      {
        id: uuid(),
        email: "admin@agency.local",
        password: "admin123",
        role: "admin",
      },
      {
        id: uuid(),
        email: "worker@agency.local",
        password: "worker123",
        role: "worker",
      },
    ];
    localStorage.setItem(LS_USERS, JSON.stringify(users));
  }
  if (!localStorage.getItem("reels.accounts")) {
    const example = [
      {
        id: uuid(),
        name: "Client A",
        igUserId: "1789xxxx1",
        token: "EAAGm0PX4ZCpsBA-EXAMPLE-TOKEN-1",
      },
      {
        id: uuid(),
        name: "Client B",
        igUserId: "1789xxxx2",
        token: "EAAGm0PX4ZCpsBA-EXAMPLE-TOKEN-2",
      },
    ];
    localStorage.setItem("reels.accounts", JSON.stringify(example));
  }
  if (!localStorage.getItem("reels.schedule")) {
    const sched = {
      intervalMinutes: 120,
      dailyWindowStartHour: 9,
      dailyWindowEndHour: 21,
      maxPerDay: 8,
      daysOfWeek: [1, 2, 3, 4, 5], // 0=Вс ... 6=Сб (как в date-fns)
    };
    localStorage.setItem("reels.schedule", JSON.stringify(sched));
  }
}

export function signIn(email, password) {
  const users = JSON.parse(localStorage.getItem(LS_USERS) || "[]");
  const found = users.find((u) => u.email === email && u.password === password);
  if (!found) return Promise.resolve(false);
  localStorage.setItem(
    LS_SESSION,
    JSON.stringify({ email: found.email, role: found.role, id: found.id })
  );
  return Promise.resolve(true);
}
export function signOut() {
  localStorage.removeItem(LS_SESSION);
}
export function getCurrentUser() {
  const raw = localStorage.getItem(LS_SESSION);
  return raw ? JSON.parse(raw) : null;
}
export function changePassword(email, oldPwd, newPwd) {
  const users = JSON.parse(localStorage.getItem(LS_USERS) || "[]");
  const idx = users.findIndex(
    (u) => u.email === email && u.password === oldPwd
  );
  if (idx === -1) return false;
  users[idx].password = newPwd;
  localStorage.setItem(LS_USERS, JSON.stringify(users));
  return true;
}

// ===== ACCOUNTS =====
export function listAccounts() {
  return JSON.parse(localStorage.getItem("reels.accounts") || "[]");
}
export function addAccount({ name, igUserId, token }) {
  const list = listAccounts();
  list.push({ id: uuid(), name, igUserId, token });
  localStorage.setItem("reels.accounts", JSON.stringify(list));
}
export function removeAccount(id) {
  const list = listAccounts().filter((a) => a.id !== id);
  localStorage.setItem("reels.accounts", JSON.stringify(list));
}

// ===== SCHEDULE =====
export function getSchedule() {
  return JSON.parse(localStorage.getItem("reels.schedule") || "{}");
}
export function saveSchedule(s) {
  localStorage.setItem("reels.schedule", JSON.stringify(s));
}

// ===== VIDEOS / QUEUE (сессионно) =====
let sessionVideos = []; // теряется при перезагрузке — это осознанно для фронтенд-демо

export function registerSessionVideos(items) {
  sessionVideos = [...sessionVideos, ...items];
}
export function getSessionVideos() {
  return sessionVideos.slice();
}
export function removeQueueItem(id) {
  sessionVideos = sessionVideos.filter((v) => v.id !== id);
}
export function toggleQueueItemPause(id) {
  sessionVideos = sessionVideos.map((v) =>
    v.id === id ? { ...v, paused: !v.paused } : v
  );
}

// Расчёт «когда публиковать», если явное время не задано.
export function computePlannedQueue() {
  const sched = getSchedule();
  const now = new Date();
  const videos = getSessionVideos();

  // 1) Разделяем: explicit (фиксированное время) и auto (по интервалу)
  const explicit = [];
  const auto = [];
  for (const v of videos) {
    if (v.explicitTime) {
      const dt = new Date(v.explicitTime);
      explicit.push({ ...v, when: dt });
    } else {
      auto.push({ ...v, when: null });
    }
  }

  // 2) Фильтруем explicit по окну/дням, если не попадает — оставляем как есть (в реальном бэке — валидировать)
  const filteredExplicit = explicit.map((v) => {
    const dayOk = sched.daysOfWeek.includes(v.when.getDay());
    const wnd = dayWindowInterval(
      v.when,
      sched.dailyWindowStartHour,
      sched.dailyWindowEndHour
    );
    const inWnd = isWithinInterval(v.when, wnd);
    return { ...v, valid: dayOk && inWnd };
  });

  // 3) Для auto генерируем ближайшие слоты
  let cursor = nextStart(now, sched.dailyWindowStartHour);
  const endOfWindow = (d) =>
    setHours(
      setMinutes(setSeconds(new Date(d), 0), 0),
      sched.dailyWindowEndHour
    );

  const slots = [];
  // генерируем на 14 дней вперёд максимум 200 слотов
  let count = 0;
  for (let i = 0; i < 14 && slots.length < 200; i++) {
    let day =
      i === 0
        ? now
        : addMinutes(
            setHours(setMinutes(setSeconds(new Date(now), 0), 0), 0),
            i * 24 * 60
          );
    if (!sched.daysOfWeek.includes(day.getDay())) continue;

    let start = setHours(
      setMinutes(setSeconds(new Date(day), 0), 0),
      sched.dailyWindowStartHour
    );
    if (i === 0) start = isAfter(cursor, start) ? cursor : start;

    let end = endOfWindow(day);
    let perDay = 0;
    while (isBefore(start, end) && perDay < sched.maxPerDay) {
      if (isAfter(start, now)) slots.push(new Date(start));
      start = addMinutes(start, sched.intervalMinutes);
      perDay++;
      count++;
      if (count > 200) break;
    }
  }

  const autosWithTimes = auto.map((v, i) => ({ ...v, when: slots[i] || null }));

  // 4) Итоговая очередь: explicit (валидные впереди, невалидные помечены), затем auto
  const combined = [
    ...filteredExplicit.sort((a, b) => a.when - b.when),
    ...autosWithTimes,
  ].map((v) => ({ ...v, paused: v.paused || false }));

  return combined;
}

function dayWindowInterval(date, startHour, endHour) {
  const start = setHours(
    setMinutes(setSeconds(new Date(date), 0), 0),
    startHour
  );
  const end = setHours(setMinutes(setSeconds(new Date(date), 59), 59), endHour);
  return { start, end };
}
function nextStart(from, startHour) {
  const candidate = setHours(
    setMinutes(setSeconds(new Date(from), 0), 0),
    startHour
  );
  return isAfter(from, candidate) ? from : candidate;
}

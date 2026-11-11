const STORAGE_KEY = "caleb-command-centre";

function getTodayKey() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function updateClock() {
  const now = new Date();
  const dateEl = document.getElementById("current-date");
  const timeEl = document.getElementById("current-time");

  dateEl.textContent = now.toLocaleDateString("en-NG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  timeEl.textContent = now.toLocaleTimeString("en-NG", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getTodayData() {
  const all = loadData();
  const key = getTodayKey();
  return all[key] || {
    morning: {},
    night: { mode: null },
    money: { earned: 0, saved: 0, note: "" },
    body: {},
    wins: "",
    morningNote: "",
    nightLog: ""
  };
}

function updateNet() {
  const earned = Number(document.getElementById("money-earned").value) || 0;
  const saved = Number(document.getElementById("money-saved").value) || 0;
  document.getElementById("money-net").textContent = "₦" + (earned + saved).toLocaleString();
}

function applyData(data) {
  document.querySelectorAll("#morning-checklist input").forEach(input => {
    input.checked = !!data.morning[input.dataset.key];
  });
  document.getElementById("morning-note").value = data.morningNote || "";

  document.querySelectorAll("#night-checklist input").forEach(input => {
    input.checked = !!data.night[input.dataset.key];
  });
  document.getElementById("night-log").value = data.nightLog || "";

  document.querySelectorAll(".mode-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.mode === data.night.mode);
  });

  document.getElementById("money-earned").value = data.money.earned || "";
  document.getElementById("money-saved").value = data.money.saved || "";
  document.getElementById("money-note").value = data.money.note || "";
  updateNet();

  document.querySelectorAll("#body-checklist input").forEach(input => {
    input.checked = !!data.body[input.dataset.key];
  });
  document.getElementById("body-focus").value = data.body.focus || "";
  document.getElementById("body-volume").value = data.body.volume || "";
  document.getElementById("body-note").value = data.body.note || "";

  document.getElementById("wins").value = data.wins || "";
}

function collectData() {
  const data = {
    morning: {},
    night: { mode: null },
    money: {},
    body: {},
    wins: "",
    morningNote: "",
    nightLog: ""
  };

  document.querySelectorAll("#morning-checklist input").forEach(input => {
    data.morning[input.dataset.key] = input.checked;
  });
  data.morningNote = document.getElementById("morning-note").value;

  document.querySelectorAll("#night-checklist input").forEach(input => {
    data.night[input.dataset.key] = input.checked;
  });
  data.nightLog = document.getElementById("night-log").value;

  const activeMode = document.querySelector(".mode-btn.active");
  data.night.mode = activeMode ? activeMode.dataset.mode : null;

  data.money.earned = Number(document.getElementById("money-earned").value) || 0;
  data.money.saved = Number(document.getElementById("money-saved").value) || 0;
  data.money.note = document.getElementById("money-note").value;

  document.querySelectorAll("#body-checklist input").forEach(input => {
    data.body[input.dataset.key] = input.checked;
  });
  data.body.focus = document.getElementById("body-focus").value;
  data.body.volume = document.getElementById("body-volume").value;
  data.body.note = document.getElementById("body-note").value;

  data.wins = document.getElementById("wins").value;

  return data;
}

function showStatus(msg) {
  const el = document.getElementById("status");
  el.textContent = msg;
  setTimeout(() => {
    el.textContent = "";
  }, 2500);
}

document.getElementById("save-btn").addEventListener("click", () => {
  const all = loadData();
  all[getTodayKey()] = collectData();
  saveData(all);
  showStatus("Saved ✓");
});

document.getElementById("reset-btn").addEventListener("click", () => {
  if (!confirm("Clear today’s data?")) return;
  const all = loadData();
  delete all[getTodayKey()];
  saveData(all);
  applyData(getTodayData());
  showStatus("Cleared");
});

document.querySelectorAll(".mode-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

document.getElementById("money-earned").addEventListener("input", updateNet);
document.getElementById("money-saved").addEventListener("input", updateNet);

updateClock();
setInterval(updateClock, 1000);
applyData(getTodayData());

const KEY = "caleb-cc-v2";

function today() {
  return new Date().toISOString().slice(0, 10);
}

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

function getToday() {
  const all = load();
  return all[today()] || {
    primary: "",
    morning: {},
    night: { mode: null },
    nightLog: "",
    earned: 0,
    saved: 0,
    body: {},
    bodyFocus: "",
    bodyVolume: "",
    bodyNote: "",
    wins: "",
    fails: "",
    adjust: ""
  };
}

function getGoals() {
  const all = load();
  return all.goals || {
    big: "₦5,000,000 in account. Siblings living better. Strong body. Family respect.",
    ninety: "",
    week: "",
    identity: "I am becoming the man my family will respect."
  };
}

function updateClock() {
  const now = new Date();
  document.getElementById("sidebar-date").textContent = now.toLocaleDateString("en-NG", {
    weekday: "short", day: "numeric", month: "short"
  });
  document.getElementById("sidebar-time").textContent = now.toLocaleTimeString("en-NG", {
    hour: "2-digit", minute: "2-digit"
  });
}

function showStatus(msg) {
  const el = document.getElementById("status");
  if (el) {
    el.textContent = msg;
    setTimeout(() => el.textContent = "", 2000);
  }
}

function applyToday(data) {
  document.getElementById("primary-focus").value = data.primary || "";
  document.querySelectorAll("#section-today .checks input").forEach(inp => {
    inp.checked = !!(data.morning && data.morning[inp.dataset.key]) || !!(data.night && data.night[inp.dataset.key]);
  });
  document.querySelectorAll(".mode").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.mode === (data.night && data.night.mode));
  });
  document.getElementById("night-log").value = data.nightLog || "";
  document.getElementById("earned").value = data.earned || "";
  document.getElementById("saved").value = data.saved || "";
}

function collectToday() {
  const data = getToday();
  data.primary = document.getElementById("primary-focus").value;
  data.morning = {};
  data.night = { mode: null };
  document.querySelectorAll("#section-today .checks input").forEach(inp => {
    const key = inp.dataset.key;
    if (key.startsWith("m-")) data.morning[key] = inp.checked;
    if (key.startsWith("n-")) data.night[key] = inp.checked;
  });
  const active = document.querySelector(".mode.active");
  data.night.mode = active ? active.dataset.mode : null;
  data.nightLog = document.getElementById("night-log").value;
  data.earned = Number(document.getElementById("earned").value) || 0;
  data.saved = Number(document.getElementById("saved").value) || 0;
  return data;
}

function applyGoals(g) {
  document.getElementById("big-goal").value = g.big || "";
  document.getElementById("ninety-day").value = g.ninety || "";
  document.getElementById("week-goals").value = g.week || "";
  document.getElementById("identity").value = g.identity || "";
}

function updateMoneyProgress() {
  const bal = Number(document.getElementById("current-balance").value) || 0;
  const pct = Math.min(100, (bal / 5000000) * 100);
  document.getElementById("money-progress").style.width = pct + "%";
  document.getElementById("money-progress-text").textContent = pct.toFixed(1) + "% of ₦5M";
}
// Navigation
document.querySelectorAll(".nav-item").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("section-" + btn.dataset.section).classList.add("active");
  });
});

// Mode buttons
document.querySelectorAll(".mode").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".mode").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// Save buttons
document.getElementById("save-today").addEventListener("click", () => {
  const all = load();
  all[today()] = collectToday();
  save(all);
  showStatus("Saved");
});

document.getElementById("save-goals").addEventListener("click", () => {
  const all = load();
  all.goals = {
    big: document.getElementById("big-goal").value,
    ninety: document.getElementById("ninety-day").value,
    week: document.getElementById("week-goals").value,
    identity: document.getElementById("identity").value
  };
  save(all);
  showStatus("Goals saved");
});

document.getElementById("save-review")?.addEventListener("click", () => {
  const all = load();
  const t = getToday();
  t.wins = document.getElementById("wins").value;
  t.fails = document.getElementById("fails").value;
  t.adjust = document.getElementById("adjust").value;
  all[today()] = t;
  save(all);
  showStatus("Review saved");
});

document.getElementById("current-balance")?.addEventListener("input", updateMoneyProgress);

// Init
updateClock();
setInterval(updateClock, 1000);
applyToday(getToday());
applyGoals(getGoals());
updateMoneyProgress();

/* =========================
   GLOBAL STATE
========================= */
let players = [];
let view = "rankings";

/* =========================
   LOAD LIVE DATA (GOOGLE SHEETS)
========================= */
async function loadData() {
  try {
    const res = await fetch(
      "https://opensheet.elk.sh/1ZYNGWyFP74w6ruXFtjLudu8sz6w0Y3KsuOJLm0Ro9fM/Sheet1"
    );

    const data = await res.json();

    players = data.map(p => ({
      name: p.Player,
      position: p.Position,
      scores: [
        Number(p.R1),
        Number(p.R2),
        Number(p.R3),
        Number(p.R4),
        Number(p.R5)
      ].filter(x => !isNaN(x))
    }));

    render();
  } catch (err) {
    console.log("Data load failed:", err);
    document.getElementById("app").innerHTML =
      "<h3>⚠️ Failed to load data</h3>";
  }
}

/* =========================
   CORE MATH
========================= */
function avg(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function trend(s) {
  return s[s.length - 1] - s[0];
}

function last3(s) {
  return avg(s.slice(-3));
}

function projection(s) {
  return last3(s) * 0.7 + avg(s) * 0.3;
}

function rating10(s) {
  let a = avg(s);
  let p = projection(s);
  let t = trend(s);

  let score =
    (a / 120) * 4 +
    (p / 120) * 4 +
    ((t + 20) / 40) * 2;

  return Math.max(1, Math.min(10, score));
}

/* =========================
   NAVIGATION
========================= */
function setView(v) {
  view = v;
  render();
}

/* =========================
   RENDER CONTROLLER
========================= */
function render() {
  if (view === "rankings") renderRankings();
  if (view === "analytics") renderAnalytics();
}

/* =========================
   RANKINGS VIEW (SUPERCOACH STYLE)
========================= */
function renderRankings() {
  const groups = groupByPosition();

  document.getElementById("app").innerHTML = `
    <h2>🏉 AFL Rankings</h2>

    ${renderGroup("MIDFIELD", groups.MID || [])}
    ${renderGroup("DEFENCE", groups.DEF || [])}
    ${renderGroup("RUCK", groups.RUC || [])}
    ${renderGroup("FORWARD", groups.FWD || [])}
  `;
}

/* group players by position */
function groupByPosition() {
  let g = { MID: [], DEF: [], RUC: [], FWD: [] };

  players.forEach(p => {
    if (p.position.includes("MID")) g.MID.push(p);
    if (p.position.includes("DEF")) g.DEF.push(p);
    if (p.position.includes("RUC")) g.RUC.push(p);
    if (p.position.includes("FWD")) g.FWD.push(p);
  });

  for (let key in g) {
    g[key].sort((a, b) => projection(b.scores) - projection(a.scores));
  }

  return g;
}

/* render a position group */
function renderGroup(title, list) {
  return `
    <h3>${title}</h3>
    ${list.slice(0, 5).map(card).join("")}
  `;
}

/* player card */
function card(p) {
  return `
    <div class="card">
      <b>${p.name}</b> (${p.position})<br>
      Avg: ${avg(p.scores).toFixed(1)}<br>
      Projection: ${projection(p.scores).toFixed(1)}<br>
      Rating: ${rating10(p.scores).toFixed(1)} / 10
    </div>
  `;
}

/* =========================
   ANALYTICS VIEW
========================= */
function renderAnalytics() {
  document.getElementById("app").innerHTML = `
    <h2>📊 Analytics</h2>
    <canvas id="chart"></canvas>
  `;

  new Chart(document.getElementById("chart"), {
    type: "line",
    data: {
      labels: ["R1", "R2", "R3", "R4", "R5"],
      datasets: players.slice(0, 3).map(p => ({
        label: p.name,
        data: p.scores,
        fill: false
      }))
    }
  });
}

/* =========================
   INIT
========================= */
loadData();

/* expose nav */
window.setView = setView;

let players = [];
let filter = "ALL";

const SHEET_URL =
  "https://opensheet.elk.sh/1ZYNGWyFP74w6ruXFtjLudu8sz6w0Y3KsuOJLm0Ro9fM/Sheet1";

/* =========================
   LOAD DATA
========================= */
async function loadData() {
  const res = await fetch(SHEET_URL);
  const data = await res.json();

  players = data.map(p => {
    const values = Object.values(p);

    const name = values[1];
    const team = values[2];
    const points = Number(values[3]) || 0;
    const avg = Number(values[4]) || 0;

    return {
      name,
      team,
      points,
      avg,
      position: detectPosition(name, team)
    };
  });

  render();
}

/* =========================
   SIMPLE POSITION DETECTION (fallback)
========================= */
function detectPosition(name, team) {
  const t = (team || "").toUpperCase();

  if (t.includes("DEF")) return "DEF";
  if (t.includes("MID")) return "MID";
  if (t.includes("FWD")) return "FWD";
  if (t.includes("RUC")) return "RUC";

  return "MID"; // fallback
}

/* =========================
   VALUE SCORE
========================= */
function valueScore(p, rankIndex) {
  return p.avg / (rankIndex + 1);
}

/* =========================
   TIER SYSTEM
========================= */
function getTier(avg) {
  if (avg >= 110) return "elite";
  if (avg >= 95) return "premium";
  if (avg >= 80) return "value";
  return "avoid";
}

/* =========================
   FILTER
========================= */
function setFilter(f) {
  filter = f;
  render();
}

/* =========================
   RENDER
========================= */
function render() {
  let list = [...players];

  if (filter !== "ALL") {
    list = list.filter(p => p.position === filter);
  }

  list.sort((a, b) => b.avg - a.avg);

  document.getElementById("app").innerHTML = `
    <div class="topbar">
      Showing: ${filter} | Players: ${list.length}
    </div>

    ${list.map((p, i) => `
      <div class="card ${getTier(p.avg)}">
        <b>${p.name}</b> (${p.position})<br>
        Team: ${p.team}<br>
        Avg: ${p.avg.toFixed(1)}<br>
        Points: ${p.points}<br>
        Value: ${valueScore(p, i).toFixed(2)}<br>
        Tier: ${getTier(p.avg).toUpperCase()}
      </div>
    `).join("")}
  `;
}

/* =========================
   INIT
========================= */
loadData();

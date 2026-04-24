let players = [];
let view = "top";
let search = "";

const SHEET_URL =
  "https://opensheet.elk.sh/1ZYNGWyFP74w6ruXFtjLudu8sz6w0Y3KsuOJLm0Ro9fM/Sheet1";

/* =========================
   LOAD DATA
========================= */
async function loadData() {
  const res = await fetch(SHEET_URL);
  const data = await res.json();

  players = data.map(p => {
    const v = Object.values(p);

    return {
      name: v[1],
      team: v[2],
      points: Number(v[3]) || 0,
      avg: Number(v[4]) || 0
    };
  });

  render();
}

/* =========================
   GLOBALS
========================= */
window.setView = (v) => {
  view = v;
  render();
};

window.setSearch = (s) => {
  search = s.toLowerCase();
  render();
};

/* =========================
   HELPERS
========================= */
function tier(avg) {
  if (avg >= 110) return "elite";
  if (avg >= 95) return "premium";
  if (avg >= 80) return "value";
  return "avoid";
}

function valueScore(p, rank) {
  return p.avg / (rank + 1);
}

/* =========================
   INSIGHTS ENGINE
========================= */
function getInsights(list) {
  const sorted = [...list].sort((a, b) => b.avg - a.avg);

  const best = sorted[0];
  const topScorer = [...list].sort((a,b)=>b.points-a.points)[0];
  const bestValue = [...list]
    .sort((a,b)=>(b.avg/b.points)-(a.avg/a.points))[0];

  return `
    <div class="insights">
      <b>🔥 Insights</b><br><br>
      🏆 Best Player: ${best?.name || "-"}<br>
      📈 Top Scorer: ${topScorer?.name || "-"}<br>
      💰 Best Value: ${bestValue?.name || "-"}
    </div>
  `;
}

/* =========================
   FILTER
========================= */
function applyFilters(list) {
  if (!search) return list;
  return list.filter(p =>
    p.name.toLowerCase().includes(search)
  );
}

/* =========================
   RENDER
========================= */
function render() {
  let list = [...players];
  list = applyFilters(list);

  if (view === "top") {
    list.sort((a, b) => b.avg - a.avg);
  }

  if (view === "value") {
    list.sort((a, b) => (b.avg / (b.points || 1)) - (a.avg / (a.points || 1)));
  }

  if (view === "form") {
    list.sort((a, b) => b.points - a.points);
  }

  document.getElementById("app").innerHTML = `
    <div class="topbar">
      View: ${view.toUpperCase()} | Players: ${list.length}
    </div>

    ${getInsights(list)}

    ${list.map((p, i) => `
      <div class="card ${tier(p.avg)}">
        <b>${p.name}</b><br>
        ${p.team}<br>
        Avg: ${p.avg.toFixed(1)}<br>
        Points: ${p.points}<br>
        Value: ${valueScore(p, i).toFixed(2)}<br>
        Tier: ${tier(p.avg).toUpperCase()}
      </div>
    `).join("")}
  `;
}

/* =========================
   INIT
========================= */
loadData();

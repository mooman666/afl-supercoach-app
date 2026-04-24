let players = [];
let view = "rankings";

const SHEET_URL =
  "https://opensheet.elk.sh/1ZYNGWyFP74w6ruXFtjLudu8sz6w0Y3KsuOJLm0Ro9fM/Sheet1";

/* =========================
   SAFE DATA LOADER
========================= */
async function loadData() {
  try {
    const res = await fetch(SHEET_URL);
    const data = await res.json();

    players = data.map(p => {
      // Use KEY names OR fallback to values safely
      return {
        name: (p.Name || p.name || "").toString().trim(),
        team: (p.Team || p.team || "").toString().trim(),
        rank: Number(p["Season Rank"] || p.rank || 0),
        points: Number(p["Total yearly points"] || p.points || 0),
        avg: Number(p["Yearly average"] || p.avg || 0)
      };
    }).filter(p => p.name); // remove blanks

    render();
  } catch (err) {
    console.log(err);
    document.getElementById("app").innerHTML =
      "<h3>⚠️ Failed to load data</h3>";
  }
}

/* =========================
   NAV
========================= */
function setView(v) {
  view = v;
  render();
}

/* =========================
   RENDER
========================= */
function render() {
  document.getElementById("app").innerHTML =
    view === "rankings" ? renderRankings() : renderTop10();
}

/* =========================
   RANKINGS (NO NaN POSSIBLE)
========================= */
function renderRankings() {
  let sorted = [...players].sort((a, b) => b.avg - a.avg);

  return `
    <h2>🏉 AFL Rankings</h2>

    ${sorted.map((p, i) => `
      <div class="card">
        <b>#${i + 1} ${p.name || "Unknown"}</b><br>
        ${p.team || "-"}<br>
        Avg: ${(p.avg || 0).toFixed(1)}<br>
        Points: ${(p.points || 0).toFixed(0)}
      </div>
    `).join("")}
  `;
}

/* =========================
   TOP 10
========================= */
function renderTop10() {
  let top = [...players]
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 10);

  return `
    <h2>📊 Top 10</h2>

    ${top.map(p => `
      <div class="card">
        ${p.name} — Avg ${(p.avg || 0).toFixed(1)}
      </div>
    `).join("")}
  `;
}

/* =========================
   INIT
========================= */
loadData();
window.setView = setView;

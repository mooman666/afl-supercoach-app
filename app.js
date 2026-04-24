let players = [];
let view = "rankings";

const SHEET_URL =
  "https://opensheet.elk.sh/1ZYNGWyFP74w6ruXFtjLudu8sz6w0Y3KsuOJLm0Ro9fM/Sheet1";

/* =========================
   LOAD DATA (SAFE PARSER)
========================= */
async function loadData() {
  try {
    const res = await fetch(SHEET_URL);
    const data = await res.json();

    players = data.map(row => {
      const values = Object.values(row);

      return {
        // SAFE POSITION-BASED MAPPING
        rank: Number(values[0]) || 0,
        name: String(values[1] || "").trim(),
        team: String(values[2] || "").trim(),
        points: Number(values[3]) || 0,
        avg: Number(values[4]) || 0
      };
    }).filter(p => p.name); // remove empty rows

    render();
  } catch (err) {
    console.log(err);
    document.getElementById("app").innerHTML =
      "<h3>⚠️ Data load failed</h3>";
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
   RANKINGS (FIXED NaN)
========================= */
function renderRankings() {
  let sorted = [...players].sort((a, b) => b.avg - a.avg);

  return `
    <h2>🏉 AFL Rankings</h2>

    ${sorted.map((p, i) => `
      <div class="card">
        <b>#${i + 1} ${p.name || "Unknown"}</b><br>
        ${p.team || "-"}<br>
        Avg: ${p.avg.toFixed(1)}<br>
        Points: ${p.points.toFixed(0)}
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
        ${p.name} — Avg ${p.avg.toFixed(1)}
      </div>
    `).join("")}
  `;
}

/* =========================
   INIT
========================= */
loadData();
window.setView = setView;

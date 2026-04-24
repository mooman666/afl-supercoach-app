let players = [];
let view = "rankings";

/* =========================
   LOAD DATA
========================= */
async function loadData() {
  try {
    const res = await fetch(
      "https://opensheet.elk.sh/1ZYNGWyFP74w6ruXFtjLudu8sz6w0Y3KsuOJLm0Ro9fM/Sheet1"
    );

    const data = await res.json();

    // SAFE PARSING (no header dependency)
    players = data.map(p => {
      const values = Object.values(p);

      return {
        name: values[1],
        team: values[2],
        points: Number(values[3]) || 0,
        avg: Number(values[4]) || 0
      };
    });

    render();
  } catch (err) {
    document.getElementById("app").innerHTML =
      "<h3>⚠️ Failed to load data</h3>";
    console.log(err);
  }
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
  if (view === "rankings") {
    document.getElementById("app").innerHTML = renderRankings();
  } else {
    document.getElementById("app").innerHTML = renderAnalytics();
  }
}

/* =========================
   RANKINGS (FIXED)
========================= */
function renderRankings() {
  let sorted = [...players].sort((a, b) => b.avg - a.avg);

  return `
    <h2>🏉 AFL Rankings</h2>

    ${sorted.map((p, i) => `
      <div class="card">
        <b>#${i + 1} ${p.name}</b><br>
        ${p.team}<br>
        Avg: ${p.avg}<br>
        Points: ${p.points}
      </div>
    `).join("")}
  `;
}

/* =========================
   ANALYTICS
========================= */
function renderAnalytics() {
  let top = [...players].sort((a, b) => b.avg - a.avg).slice(0, 10);

  return `
    <h2>📊 Top 10 Players</h2>

    ${top.map(p => `
      <div class="card">
        ${p.name} — ${p.avg}
      </div>
    `).join("")}
  `;
}

/* =========================
   INIT
========================= */
loadData();
window.setView = setView;

let players = [];
let view = "rankings";

/* LOAD DATA */
async function loadData() {
  const res = await fetch(
    "https://opensheet.elk.sh/1ZYNGWyFP74w6ruXFtjLudu8sz6w0Y3KsuOJLm0Ro9fM/Sheet1"
  );

  const data = await res.json();

  players = data.map(p => ({
    rank: Number(p["Season rank"] || p["Rank"]),
    name: p["Name"],
    team: p["Team"],
    points: Number(p["Total yearly points"] || p["Points"]),
    avg: Number(p["Yearly average"] || p["Avg"])
  }));

  render();
}

/* NAV */
function setView(v) {
  view = v;
  render();
}

/* RENDER */
function render() {
  document.getElementById("app").innerHTML =
    view === "rankings" ? renderRankings() : renderAnalytics();
}

/* RANKINGS */
function renderRankings() {
  let sorted = [...players].sort((a, b) => b.avg - a.avg);

  return `
    <h2>🏉 AFL Rankings</h2>

    ${sorted.map(p => `
      <div class="card">
        <b>#${p.rank} ${p.name}</b><br>
        ${p.team}<br>
        Avg: ${p.avg}<br>
        Points: ${p.points}
      </div>
    `).join("")}
  `;
}

/* ANALYTICS */
function renderAnalytics() {
  return `
    <h2>📊 Analytics</h2>
    <p>Top 10 by average:</p>

    ${[...players]
      .sort((a,b)=>b.avg-a.avg)
      .slice(0,10)
      .map(p => `<div class="card">${p.name} - ${p.avg}</div>`)
      .join("")}
  `;
}

/* INIT */
loadData();
window.setView = setView;

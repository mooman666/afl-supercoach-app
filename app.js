let players = [];
let view = "top";
let search = "";

/* ✔ YOUR REAL GOOGLE SHEET */
const SHEET_URL =
"https://docs.google.com/spreadsheets/d/1ZYNGWyFP74w6ruXFtjLudu8sz6w0Y3KsuOJLm0Ro9fM/gviz/tq?tqx=out:csv";

/* =========================
   LOAD DATA (FIXED PARSER)
========================= */
async function loadData() {
  const res = await fetch(SHEET_URL);
  const text = await res.text();

  const rows = text.trim().split("\n").map(r => r.split(","));
  rows.shift(); // remove headers

  players = rows.map(r => ({
    rank: Number(r[0]),
    name: r[1],
    team: r[2],
    points: Number(r[3]) || 0,
    avg: Number(r[4]) || 0
  })).filter(p => p.name);

  render();
}

/* =========================
   NAV
========================= */
function setView(v) {
  view = v;
  render();
}

function setSearch(s) {
  search = s.toLowerCase();
  render();
}

window.setView = setView;
window.setSearch = setSearch;

/* =========================
   VALUE MODEL (SAFE VERSION)
========================= */
function valueScore(p) {
  return p.avg / (p.points > 0 ? p.points : 1);
}

/* =========================
   FILTER
========================= */
function applyFilters(list) {
  if (search) {
    list = list.filter(p =>
      p.name.toLowerCase().includes(search)
    );
  }
  return list;
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
    list.sort((a, b) => valueScore(b) - valueScore(a));
  }

  if (view === "form") {
    list.sort((a, b) => b.points - a.points);
  }

  document.getElementById("app").innerHTML = `
    <div class="topbar">
      Showing: ${view.toUpperCase()} | Players: ${list.length}
    </div>

    ${list.map(p => `
      <div class="card">
        <b>${p.name}</b><br>
        ${p.team}<br><br>
        Avg: ${p.avg}<br>
        Points: ${p.points}<br>
        Value: ${valueScore(p).toFixed(2)}
      </div>
    `).join("")}
  `;
}

/* =========================
   START
========================= */
loadData();

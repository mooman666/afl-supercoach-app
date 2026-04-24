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
   GLOBAL FUNCTIONS (IMPORTANT)
========================= */
window.setView = function(v) {
  view = v;
  render();
};

window.setSearch = function(s) {
  search = s.toLowerCase();
  render();
};

/* =========================
   HELPERS
========================= */
function valueScore(p, index) {
  return p.avg / (index + 1);
}

function filterPlayers(list) {
  if (!search) return list;
  return list.filter(p =>
    p.name.toLowerCase().includes(search)
  );
}

/* =========================
   RENDER ENGINE
========================= */
function render() {
  let list = [...players];

  list = filterPlayers(list);

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

    ${list.map((p, i) => `
      <div class="card">
        <b>${p.name}</b><br>
        ${p.team}<br>
        Avg: ${p.avg.toFixed(1)}<br>
        Points: ${p.points}<br>
        Value: ${valueScore(p, i).toFixed(2)}
      </div>
    `).join("")}
  `;
}

/* =========================
   INIT
========================= */
loadData();

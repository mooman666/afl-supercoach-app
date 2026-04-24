let players = [];
let filter = "ALL";

const SHEET_URL =
  "https://opensheet.elk.sh/1ZYNGWyFP74w6ruXFtjLudu8sz6w0Y3KsuOJLm0Ro9fM/Sheet1";

/* =========================
   LOAD DATA
========================= */
async function loadData() {
  try {
    const res = await fetch(SHEET_URL);
    const data = await res.json();

    players = data.map(p => {
      const values = Object.values(p);

      return {
        name: values[1],
        team: values[2],
        points: Number(values[3]) || 0,
        avg: Number(values[4]) || 0,
        position: (values[2] || "").toString().toUpperCase()
      };
    });

    render();
  } catch (err) {
    document.getElementById("app").innerHTML =
      "<h3>⚠️ Load failed</h3>";
    console.log(err);
  }
}

/* =========================
   FILTER FUNCTION (FOR GLOBAL ACCESS)
========================= */
function setFilter(f) {
  filter = f;
  render();
}

/* 🔥 CRITICAL FIX: expose to browser */
window.setFilter = setFilter;

/* =========================
   RENDER
========================= */
function render() {
  let list = [...players];

  if (filter !== "ALL") {
    list = list.filter(p => p.position.includes(filter));
  }

  list.sort((a, b) => b.avg - a.avg);

  document.getElementById("app").innerHTML = `
    <div class="topbar">
      Showing: ${filter} | Players: ${list.length}
    </div>

    ${list.map((p, i) => `
      <div class="card">
        <b>${p.name}</b><br>
        ${p.position}<br>
        Avg: ${p.avg.toFixed(1)}<br>
        Points: ${p.points}
      </div>
    `).join("")}
  `;
}

/* =========================
   INIT
========================= */
loadData();

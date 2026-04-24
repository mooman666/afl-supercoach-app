const SHEET_URL =
"https://docs.google.com/spreadsheets/d/1O4c-KYHjBPpMX81ZLGRHtzBq31qOdcBghEMA0S8aCjA/gviz/tq?tqx=out:csv";

let players = [];
let search = "";

window.setSearch = (v) => {
  search = (v || "").toLowerCase();
  render();
};

function tier(avg){
  if(avg >= 110) return "elite";
  if(avg >= 95) return "premium";
  if(avg >= 80) return "value";
  return "avoid";
}

/* CORE METRICS */
function form(p){
  return (p.last - p.avg).toFixed(1);
}

function projection(p){
  return Math.round((p.avg * 0.65) + (p.last * 0.35));
}

function value(p){
  return (p.avg / (p.games || 1)).toFixed(2);
}

function filter(list){
  if(!search) return list;
  return list.filter(p =>
    (p.name || "").toLowerCase().includes(search)
  );
}

/* LOAD DATA FROM SHEET */
async function load(){
  const res = await fetch(SHEET_URL);
  const text = await res.text();

  const rows = text.trim().split("\n").map(r => r.split(","));
  rows.shift(); // headers

  players = rows.map(r => ({
    name: r[0],
    team: r[1],
    avg: Number(r[2]) || 0,
    last: Number(r[3]) || 0,
    high: Number(r[4]) || 0,
    games: Number(r[5]) || 0
  })).filter(p => p.name);

  render();
}

/* UI */
function render(){
  let list = filter([...players]).sort((a,b)=>b.avg-a.avg);

  const best = list[0];
  const captain = [...list].sort((a,b)=>projection(b)-projection(a))[0];

  document.getElementById("app").innerHTML = `
    <div class="card">
      <b>🔥 Insights</b><br><br>
      Best: ${best?.name || "-"}<br>
      Captain: ${captain?.name || "-"}
    </div>

    ${list.map(p => `
      <div class="card ${tier(p.avg)}">
        <b>${p.name}</b> (${p.team})<br><br>

        Avg: ${p.avg}<br>
        Last: ${p.last}<br>
        High: ${p.high}<br><br>

        Form: ${form(p)}<br>
        Projection: ${projection(p)}<br>
        Value: ${value(p)}
      </div>
    `).join("")}
  `;
}

load();

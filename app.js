const SHEET_URL =
"https://opensheet.elk.sh/1O4c-KYHjBPpMX81ZLGRHtzBq31qOdcBghEMA0S8aCjA/AFL_DATA";

let players = [];
let search = "";

window.setSearch = (v) => {
  search = v.toLowerCase();
  render();
};

function tier(avg){
  if(avg >= 110) return "elite";
  if(avg >= 95) return "premium";
  if(avg >= 80) return "value";
  return "avoid";
}

/* FORM ENGINE (REAL, NOT RANDOM) */
function formScore(p){
  return (p.last - p.avg);
}

/* PROJECTION */
function projection(p){
  return Math.round((p.avg * 0.6) + (p.last * 0.4));
}

/* VALUE */
function value(p){
  return (p.avg / (p.games || 1)).toFixed(2);
}

/* LOAD DATA */
async function load(){
  const res = await fetch(SHEET_URL);
  const data = await res.json();

  players = data.map(p => ({
    name: p.name,
    team: p.team,
    avg: Number(p.avg) || 0,
    last: Number(p.last) || 0,
    high: Number(p.high) || 0,
    games: Number(p.games) || 0
  }));

  render();
}

/* FILTER */
function filter(list){
  if(!search) return list;
  return list.filter(p =>
    p.name.toLowerCase().includes(search)
  );
}

/* INSIGHTS */
function insights(list){
  const best = [...list].sort((a,b)=>b.avg-a.avg)[0];
  const captain = [...list].sort((a,b)=>projection(b)-projection(a))[0];

  return `
    <div class="card">
      <b>🔥 Insights</b><br><br>
      🏆 Best: ${best?.name || "-"}<br>
      🎯 Captain: ${captain?.name || "-"}<br>
    </div>
  `;
}

/* RENDER */
function render(){
  let list = [...players];
  list = filter(list);

  list.sort((a,b)=>b.avg-a.avg);

  document.getElementById("app").innerHTML = `
    ${insights(list)}

    ${list.map(p => `
      <div class="card ${tier(p.avg)}">
        <b>${p.name}</b> <span class="small">(${p.team})</span><br><br>

        Avg: ${p.avg}<br>
        Last: ${p.last}<br>
        High: ${p.high}<br><br>

        Form: ${formScore(p)}<br>
        Projection: ${projection(p)}<br>
        Value: ${value(p)}<br>
      </div>
    `).join("")}
  `;
}

load();

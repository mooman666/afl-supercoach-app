const SHEET_URL =
"https://docs.google.com/spreadsheets/d/1O4c-KYHjBPpMX81ZLGRHtzBq31qOdcBghEMA0S8aCjA/gviz/tq?tqx=out:json";

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

function formScore(p){
  return (p.last - p.avg).toFixed(1);
}

function projection(p){
  return Math.round((p.avg * 0.6) + (p.last * 0.4));
}

function filter(list){
  if(!search) return list;
  return list.filter(p => (p.name || "").toLowerCase().includes(search));
}

async function load(){
  try {
    const res = await fetch(SHEET_URL);
    const text = await res.text();

    const json = JSON.parse(
      text.match(/google\.visualization\.Query\.setResponse\((.*)\);/s)[1]
    );

    const rows = json.table.rows || [];

    players = rows.map(r => ({
      name: r.c?.[0]?.v || "",
      team: r.c?.[1]?.v || "",
      avg: Number(r.c?.[2]?.v || 0),
      last: Number(r.c?.[3]?.v || 0),
      high: Number(r.c?.[4]?.v || 0),
      games: Number(r.c?.[5]?.v || 0)
    })).filter(p => p.name);

    render();

  } catch (e) {
    document.getElementById("app").innerHTML =
      "Failed to load data — check sheet sharing + headers";
    console.log(e);
  }
}

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
        <b>${p.name}</b> <span class="small">(${p.team})</span><br><br>

        Avg: ${p.avg}<br>
        Last: ${p.last}<br>
        High: ${p.high}<br><br>

        Form: ${formScore(p)}<br>
        Projection: ${projection(p)}
      </div>
    `).join("")}
  `;
}

load();

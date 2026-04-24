const SHEET_URL =
"https://docs.google.com/spreadsheets/d/1O4c-KYHjBPpMX81ZLGRHtzBq31qOdcBghEMA0S8aCjA/gviz/tq?tqx=out:csv";

let players = [];
let search = "";

window.setSearch = (v) => {
  search = (v || "").toLowerCase();
  render();
};

function filter(list){
  if(!search) return list;
  return list.filter(p =>
    (p.name || "").toLowerCase().includes(search)
  );
}

async function load(){
  const res = await fetch(SHEET_URL);
  const text = await res.text();

  const rows = text.trim().split("\n").map(r => r.split(","));
  rows.shift(); // headers

  players = rows.map(r => ({
    rank: Number(r[0]) || 0,
    name: r[1],
    team: r[2],
    total: Number(r[3]) || 0,
    avg: Number(r[4]) || 0
  })).filter(p => p.name);

  render();
}

function render(){
  let list = filter([...players]).sort((a,b)=>a.rank-b.rank);

  document.getElementById("app").innerHTML = list.map(p => `
    <div class="card">
      <b>#${p.rank} ${p.name}</b> (${p.team})<br><br>
      Total: ${p.total}<br>
      Avg: ${p.avg}
    </div>
  `).join("");
}

load();

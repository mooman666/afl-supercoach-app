const SHEET_URL =
"https://docs.google.com/spreadsheets/d/1O4c-KYHjBPpMX81ZLGRHtzBq31qOdcBghEMA0S8aCjA/gviz/tq?tqx=out:csv";

let players = [];
let search = "";
let mode = "all";

window.setSearch = (v) => {
  search = v.toLowerCase();
  render();
};

window.setMode = (m) => {
  mode = m;
  render();
};

function filterData(list){
  return list.filter(p => {
    if(search && !p.name.toLowerCase().includes(search)) return false;
    if(mode !== "all" && p.pos !== mode) return false;
    return true;
  });
}

async function load(){
  const res = await fetch(SHEET_URL);
  const text = await res.text();

  const rows = text.trim().split("\n").map(r => r.split(","));
  rows.shift(); // headers

  players = rows.map(r => ({
    name: r[0],
    team: r[1],
    pos: r[2],        // MID / DEF / FWD
    avg: Number(r[3]) || 0,
    points: Number(r[4]) || 0,
    form: Number(r[5]) || 0
  }));

  render();
}

function render(){
  let list = filterData([...players]).sort((a,b)=>b.avg-a.avg);

  document.getElementById("app").innerHTML = list.map(p => `
    <div class="card">
      <b>${p.name}</b> (${p.team})<br>
      Pos: ${p.pos}<br><br>

      Avg: ${p.avg}<br>
      Points: ${p.points}<br>
      Form: ${p.form}
    </div>
  `).join("");
}

load();

const SHEET_URL =
"https://docs.google.com/spreadsheets/d/1O4c-KYHjBPpMX81ZLGRHtzBq31qOdcBghEMA0S8aCjA/gviz/tq?tqx=out:csv";

let players = [];
let search = "";
let view = "top";
let chart;

window.setSearch = (v) => {
  search = (v || "").toLowerCase();
  render();
};

window.setView = (v) => {
  view = v;
  render();
};

function filterData(list){
  return list.filter(p => {
    if(search && !p.name.toLowerCase().includes(search)) return false;
    return true;
  });
}

function tier(avg){
  if(avg >= 110) return "elite";
  if(avg >= 95) return "premium";
  if(avg >= 80) return "value";
  return "avoid";
}

async function load(){
  const res = await fetch(SHEET_URL);
  const text = await res.text();

  const rows = text.trim().split("\n").map(r => r.split(","));
  rows.shift();

  players = rows.map(r => ({
    rank: Number(r[0]) || 0,
    name: r[1],
    team: r[2],
    total: Number(r[3]) || 0,
    avg: Number(r[4]) || 0
  })).filter(p => p.name);

  render();
}

function getList(){
  let list = filterData([...players]);

  if(view === "top"){
    return list.sort((a,b)=>b.avg-a.avg);
  }

  if(view === "value"){
    return list.sort((a,b)=>(b.total/b.avg)-(a.total/a.avg));
  }

  if(view === "form"){
    return list.sort((a,b)=>b.total-a.total);
  }

  return list;
}

function render(){
  const list = getList();

  document.getElementById("app").innerHTML = `
    <div class="insights">
      <b>Players:</b> ${list.length}
    </div>

    ${list.map(p => `
      <div class="card ${tier(p.avg)}">
        <b>#${p.rank} ${p.name}</b> (${p.team})<br><br>
        Total: ${p.total}<br>
        Average: ${p.avg}
      </div>
    `).join("")}
  `;

  renderChart(list.slice(0,10));
}

function renderChart(list){
  const ctx = document.getElementById("chart");

  const labels = list.map(p => p.name);
  const data = list.map(p => p.avg);

  if(chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Avg Points",
        data
      }]
    }
  });
}

load();

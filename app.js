let players = [];
let view = "top";
let search = "";

const URL =
"https://opensheet.elk.sh/1ZYNGWyFP74w6ruXFtjLudu8sz6w0Y3KsuOJLm0Ro9fM/Sheet1";

/* LOAD */
async function load() {
  const res = await fetch(URL);
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

window.setView = v => { view = v; render(); };
window.setSearch = s => { search = s.toLowerCase(); render(); };

/* TIER */
function tier(avg){
  if(avg>=110) return "elite";
  if(avg>=95) return "premium";
  if(avg>=80) return "value";
  return "avoid";
}

/* VALUE */
function value(p,i){
  return p.avg / (i+1);
}

/* INSIGHTS */
function insights(list){
  const sorted = [...list].sort((a,b)=>b.avg-a.avg);
  const best = sorted[0];
  const topScore = [...list].sort((a,b)=>b.points-a.points)[0];
  const bestValue = [...list].sort((a,b)=>(b.avg/b.points)-(a.avg/a.points))[0];

  return `
  <div class="insights">
    <b>🔥 Insights</b><br><br>
    🏆 Best Player: ${best?.name}<br>
    📈 Top Scorer: ${topScore?.name}<br>
    💰 Best Value: ${bestValue?.name}
  </div>`;
}

/* CHART */
function drawChart(list){
  const top = [...list].sort((a,b)=>b.avg-a.avg).slice(0,10);

  const ctx = document.getElementById("chart");

  new Chart(ctx,{
    type:"bar",
    data:{
      labels: top.map(p=>p.name),
      datasets:[{
        label:"Avg",
        data: top.map(p=>p.avg)
      }]
    }
  });
}

/* RENDER */
function render(){
  let list = [...players];

  if(search){
    list = list.filter(p=>p.name.toLowerCase().includes(search));
  }

  if(view==="top") list.sort((a,b)=>b.avg-a.avg);
  if(view==="value") list.sort((a,b)=>(b.avg/(b.points||1))-(a.avg/(a.points||1)));
  if(view==="form") list.sort((a,b)=>b.points-a.points);

  document.getElementById("app").innerHTML = `
    ${insights(list)}

    ${list.map((p,i)=>`
      <div class="card ${tier(p.avg)}">
        <b>${p.name}</b><br>
        ${p.team}<br>
        Avg: ${p.avg.toFixed(1)}<br>
        Points: ${p.points}<br>
        Value: ${value(p,i).toFixed(2)}<br>
        Tier: ${tier(p.avg).toUpperCase()}
      </div>
    `).join("")}
  `;

  drawChart(list);
}

load();

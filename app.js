let squad = [];

// NAV
function show(tab){
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  document.getElementById(tab).classList.add('active');

  if(tab === "dashboard") renderDashboard();
}

// FIND
function find(i){
  i = (i||"").toLowerCase();
  return Object.keys(players).find(k =>
    i.includes(k) || players[k].name.toLowerCase().includes(i)
  );
}

// METRICS
function m(p){
  let trend = p.scores[2] - p.scores[0];
  let consistency = Math.abs(p.scores[0]-p.avg)+Math.abs(p.scores[1]-p.avg)+Math.abs(p.scores[2]-p.avg);
  let value = p.avg/(p.price/100000);
  return {trend, consistency, value};
}

// ANALYSIS
function analyse(){
  let k = find(document.getElementById("player").value);
  if(!k) return out("result","Not found");

  let p = players[k];
  let mm = m(p);

  let score = (p.avg + mm.value*10 - mm.consistency).toFixed(1);

  out("result", `
  <b>${p.name}</b><br>
  Rating: ${score}<br>
  Value: ${mm.value.toFixed(2)}
  `);
}

// TRADE
function trade(){
  let k = find(document.getElementById("tradeInput").value);
  if(!k) return;

  let p = players[k];
  let mm = m(p);

  let res =
    mm.value > 1.7 ? "🟢 BUY" :
    mm.value > 1.3 ? "🟡 HOLD" :
    "🔴 SELL";

  out("tradeResult", `${p.name}<br>${res}`);
}

// CAPTAIN
function captain(){
  let best=null, bestScore=-999;

  Object.values(players).forEach(p=>{
    let mm=m(p);
    let s=p.avg+mm.value*10-mm.consistency;
    if(s>bestScore){bestScore=s;best=p;}
  });

  out("captainResult", `🏆 ${best.name}`);
}

// SQUAD
function addPlayer(){
  let k=find(document.getElementById("squadInput").value);
  if(!k || squad.includes(k)) return;

  squad.push(k);
  renderSquad();
}

function renderSquad(){
  let el=document.getElementById("squadList");
  el.innerHTML="";

  let total=0, avg=0;

  squad.forEach(k=>{
    let p=players[k];
    total+=p.price;
    avg+=p.avg;
    el.innerHTML+=`<div class="playerCard">${p.name}</div>`;
  });

  out("squadStats", `Value: $${total}`);
}

// DASHBOARD
function renderDashboard(){
  let best = null, bestScore=-999;

  Object.values(players).forEach(p=>{
    let mm=m(p);
    let s=p.avg+mm.value*10;
    if(s>bestScore){bestScore=s;best=p;}
  });

  document.getElementById("kpis").innerHTML = `
    <b>Top Player:</b> ${best.name}
  `;

  new Chart(document.getElementById("chart"), {
    type:"bar",
    data:{
      labels:Object.values(players).map(p=>p.name),
      datasets:[{data:Object.values(players).map(p=>p.avg)}]
    }
  });
}

// OUTPUT
function out(id,html){
  document.getElementById(id).innerHTML=html;
}

// INIT
renderDashboard();

// GLOBAL FIX
window.show=show;
window.analyse=analyse;
window.trade=trade;
window.addPlayer=addPlayer;
window.captain=captain;

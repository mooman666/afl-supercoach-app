let squad = [];

// NAV
function show(tab){
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  document.getElementById(tab).classList.add('active');

  if(tab==="dashboard") renderDashboard();
}

// FIND
function find(input){
  input = (input||"").toLowerCase();
  return Object.keys(players).find(k =>
    input.includes(k) || players[k].name.toLowerCase().includes(input)
  );
}

// 🔥 RESTORED STRONG METRICS MODEL
function metrics(p){

  // trend (form direction)
  let trend = p.scores[2] - p.scores[0];

  // volatility (consistency penalty)
  let variance =
    Math.abs(p.scores[0]-p.avg)+
    Math.abs(p.scores[1]-p.avg)+
    Math.abs(p.scores[2]-p.avg);

  // value metric
  let value = p.avg / (p.price / 100000);

  // ceiling impact (important for captains)
  let ceiling = Math.max(...p.scores);

  // form momentum weighting (IMPORTANT RESTORE)
  let momentum = (p.scores[2]*2 + p.scores[1] - p.scores[0]) / 2;

  return {trend, variance, value, ceiling, momentum};
}

// ANALYSIS (FIXED SCORING SPREAD)
function analyse(){
  let k = find(document.getElementById("player").value);
  if(!k) return out("result","Player not found");

  let p = players[k];
  let m = metrics(p);

  // restored stronger model
  let rating =
    (p.avg * 0.6) +
    (m.momentum * 0.2) +
    (m.value * 15) -
    (m.variance * 0.3);

  let verdict =
    rating > 120 ? "🔥 ELITE PREMIUM" :
    rating > 110 ? "🟡 STRONG" :
    rating > 100 ? "⚪ SOLID" :
    "🔴 RISK";

  out("result",`
    <b>${p.name}</b><br>
    Rating: ${rating.toFixed(1)}<br>
    Value: ${m.value.toFixed(2)}<br>
    <b>${verdict}</b>
  `);
}

// TRADE
function trade(){
  let k=find(document.getElementById("tradeInput").value);
  if(!k) return;

  let p=players[k];
  let m=metrics(p);

  let score = (m.value*20 - m.variance + m.momentum/2);

  let decision =
    score > 30 ? "🟢 BUY STRONG" :
    score > 20 ? "🟡 HOLD" :
    "🔴 SELL";

  out("tradeResult",`${p.name}<br>${decision}`);
}

// CAPTAIN (FIXED ACCURACY)
function captain(){
  let best=null;
  let bestScore=-999;

  Object.values(players).forEach(p=>{
    let m=metrics(p);

    let score =
      (p.avg * 0.7) +
      (m.ceiling * 0.2) -
      (m.variance * 0.2);

    if(score>bestScore){
      bestScore=score;
      best=p;
    }
  });

  out("captainResult",`🏆 ${best.name}<br>${bestScore.toFixed(1)}`);
}

// SQUAD
function addPlayer(){
  let k=find(document.getElementById("squadInput").value);
  if(!k||squad.includes(k)) return;

  squad.push(k);
  renderSquad();
}

function renderSquad(){
  let el=document.getElementById("squadList");
  el.innerHTML="";

  squad.forEach(k=>{
    el.innerHTML+=`<div>${players[k].name}</div>`;
  });
}

// DASHBOARD (UNCHANGED)
function renderDashboard(){

  let top = Object.values(players)
    .sort((a,b)=>b.avg-a.avg)
    .slice(0,3);

  document.getElementById("kpis").innerHTML = `
    <div>🥇 ${top[0].name}</div>
    <div>🥈 ${top[1].name}</div>
    <div>🥉 ${top[2].name}</div>
  `;

  new Chart(document.getElementById("chart"),{
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

console.log("APP VERSION 1 LOADED ✅");

let squad = [];

// NAV
function show(tab){
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  document.getElementById(tab).classList.add('active');
  if(tab==="dashboard") renderDashboard();
}

// FIND
function find(input){
  input=(input||"").toLowerCase();
  return Object.keys(players).find(k =>
    input.includes(k) || players[k].name.toLowerCase().includes(input)
  );
}

// SAFE METRICS
function avg(scores){
  return scores.reduce((a,b)=>a+b,0)/scores.length;
}

// ANALYSIS (SIMPLE BUT STABLE)
function analyse(){
  let k=find(document.getElementById("player").value);
  if(!k) return out("result","Not found");

  let p=players[k];

  let a=avg(p.scores);

  out("result",`
    <b>${p.name}</b><br>
    Year Avg: ${a.toFixed(1)}<br>
    Scores: ${p.scores.join(", ")}
  `);
}

// TRADE
function trade(){
  let k=find(document.getElementById("tradeInput").value);
  if(!k) return;

  let p=players[k];
  let a=avg(p.scores);

  let decision =
    a>110?"🟢 BUY":
    a>100?"🟡 HOLD":"🔴 SELL";

  out("tradeResult",`${p.name}<br>${decision}`);
}

// CAPTAIN
function captain(){
  let best=null,bestScore=-999;

  Object.values(players).forEach(p=>{
    let a=avg(p.scores);
    if(a>bestScore){
      bestScore=a;
      best=p;
    }
  });

  out("captainResult",`🏆 ${best.name}`);
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

// DASHBOARD
function renderDashboard(){
  let top=Object.values(players).sort((a,b)=>avg(b.scores)-avg(a.scores));

  document.getElementById("kpis").innerHTML=`
    🥇 ${top[0].name}<br>
    🥈 ${top[1].name}<br>
    🥉 ${top[2].name}
  `;

  new Chart(document.getElementById("chart"),{
    type:"bar",
    data:{
      labels:Object.values(players).map(p=>p.name),
      datasets:[{data:Object.values(players).map(p=>avg(p.scores))}]
    }
  });
}

// OUTPUT
function out(id,html){
  document.getElementById(id).innerHTML=html;
}

// INIT
renderDashboard();

// GLOBALS
window.show=show;
window.analyse=analyse;
window.trade=trade;
window.addPlayer=addPlayer;
window.captain=captain;

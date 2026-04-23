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

// 📊 CORE STATS
function avg(arr){
  return arr.reduce((a,b)=>a+b,0)/arr.length;
}

function max(arr){
  return Math.max(...arr);
}

function min(arr){
  return Math.min(...arr);
}

// 🔮 REALISTIC PROJECTION MODEL
function projection(scores){
  let recent = scores.slice(-3);

  let weighted =
    (recent[2]*0.5) +
    (recent[1]*0.3) +
    (recent[0]*0.2);

  let seasonAvg = avg(scores);

  // regression to mean (important realism factor)
  let projection = (weighted * 0.7) + (seasonAvg * 0.3);

  return projection;
}

// ⭐ 10 POINT RATING (REAL VERSION)
function rating10(p){

  let a = avg(p.scores);
  let consistency = 100 - (max(p.scores) - min(p.scores));
  let trend = p.scores[2] - p.scores[0];
  let proj = projection(p.scores);

  let score =
    (a / 120) * 4 +
    (consistency / 100) * 3 +
    (trend / 20) * 1.5 +
    (proj / 120) * 1.5;

  if(score > 10) score = 10;
  if(score < 1) score = 1;

  return score;
}

// 🧠 ANALYSIS (NOW USEFUL)
function analyse(){
  let k=find(document.getElementById("player").value);
  if(!k) return out("result","Player not found");

  let p=players[k];

  let a=avg(p.scores);
  let proj=projection(p.scores);
  let rating=rating10(p);

  out("result",`
    <b>${p.name}</b><br><br>

    ⭐ Rating: ${rating.toFixed(1)} / 10<br>
    📊 Season Avg: ${a.toFixed(1)}<br>
    🔮 Projection: ${proj.toFixed(1)}<br><br>

    📅 Weekly Scores:<br>
    ${p.scores.map((s,i)=>`Round ${i+1}: ${s}`).join("<br>")}
  `);
}

// 🔁 TRADE LOGIC
function trade(){
  let k=find(document.getElementById("tradeInput").value);
  if(!k) return;

  let p=players[k];

  let proj=projection(p.scores);
  let a=avg(p.scores);

  let decision =
    proj > a + 5 ? "🟢 BUY (uptrend)" :
    proj < a - 5 ? "🔴 SELL (decline)" :
    "🟡 HOLD (stable)";

  out("tradeResult",`${p.name}<br>${decision}`);
}

// 🏆 CAPTAIN LOGIC
function captain(){
  let best=null,bestScore=-999;

  Object.values(players).forEach(p=>{
    let score = (projection(p.scores) * 0.6) + (avg(p.scores) * 0.4);

    if(score>bestScore){
      bestScore=score;
      best=p;
    }
  });

  out("captainResult",`🏆 ${best.name}`);
}

// 📊 DASHBOARD
function renderDashboard(){

  let ranked = Object.values(players)
    .sort((a,b)=>avg(b.scores)-avg(a.scores));

  document.getElementById("kpis").innerHTML=`
    🥇 ${ranked[0].name}<br>
    🥈 ${ranked[1].name}<br>
    🥉 ${ranked[2].name}
  `;

  new Chart(document.getElementById("chart"),{
    type:"line",
    data:{
      labels:["R1","R2","R3"],
      datasets:Object.values(players).map(p=>({
        label:p.name,
        data:p.scores,
        fill:false
      }))
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
window.captain=captain;

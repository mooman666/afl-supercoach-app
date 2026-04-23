let squad = [];

// NAV
function show(tab){
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  document.getElementById(tab).classList.add('active');

  if(tab==="dashboard") renderDashboard();
}

// FIND PLAYER
function find(input){
  input=(input||"").toLowerCase();
  return Object.keys(players).find(k =>
    input.includes(k) || players[k].name.toLowerCase().includes(input)
  );
}

// ------------------------------
// CORE ANALYTICS MODEL
// ------------------------------
function getAvg(scores){
  return scores.reduce((a,b)=>a+b,0)/scores.length;
}

function getTrend(scores){
  return scores[scores.length-1] - scores[0];
}

// 🔮 SIMPLE PROJECTION MODEL
function projectNext(scores){
  let recent = scores.slice(-2);
  let momentum = recent[1] - recent[0];
  let base = getAvg(scores);

  // weighted projection (simple but realistic)
  return base + (momentum * 1.2);
}

// ⭐ 10 POINT RATING SYSTEM
function rating10(avg, trend, consistency){
  let score =
    (avg/120)*4 +          // base output strength
    (trend/10)*2 +         // form direction
    (1 - consistency/50)*4; // reliability

  if(score > 10) score = 10;
  if(score < 1) score = 1;

  return score;
}

// ------------------------------
// PLAYER ANALYSIS
// ------------------------------
function analyse(){
  let k=find(document.getElementById("player").value);
  if(!k) return out("result","Player not found");

  let p=players[k];

  let avg = getAvg(p.scores);
  let trend = getTrend(p.scores);

  let consistency =
    Math.abs(p.scores[0]-avg)+
    Math.abs(p.scores[1]-avg)+
    Math.abs(p.scores[2]-avg);

  let rating = rating10(avg, trend, consistency);
  let projection = projectNext(p.scores);

  out("result",`
    <b>${p.name}</b><br><br>

    ⭐ Rating: ${rating.toFixed(1)} / 10<br>
    📊 Year Avg: ${avg.toFixed(1)}<br>
    🔁 Trend: ${trend > 0 ? "↗ +" : "↘ "}${trend}<br>
    🔮 Next Week Projection: ${projection.toFixed(1)}<br><br>

    <b>Weekly Scores:</b><br>
    ${p.scores.map((s,i)=>`Round ${i+1}: ${s}`).join("<br>")}
  `);
}

// ------------------------------
// TRADE LOGIC (SIMPLIFIED USEFUL)
// ------------------------------
function trade(){
  let k=find(document.getElementById("tradeInput").value);
  if(!k) return;

  let p=players[k];
  let avg=getAvg(p.scores);
  let proj=projectNext(p.scores);

  let decision =
    proj > avg + 5 ? "🟢 BUY (improving)" :
    proj < avg - 5 ? "🔴 SELL (declining)" :
    "🟡 HOLD (stable)";

  out("tradeResult",`
    <b>${p.name}</b><br>
    Avg: ${avg.toFixed(1)}<br>
    Projection: ${proj.toFixed(1)}<br>
    <b>${decision}</b>
  `);
}

// ------------------------------
// CAPTAIN (REALISTIC)
// ------------------------------
function captain(){
  let best=null,bestScore=-999;

  Object.values(players).forEach(p=>{
    let avg=getAvg(p.scores);
    let proj=projectNext(p.scores);

    let score = (proj*0.6)+(avg*0.4);

    if(score>bestScore){
      bestScore=score;
      best=p;
    }
  });

  out("captainResult",`
    🏆 Captain Pick: <b>${best.name}</b><br>
    Score: ${bestScore.toFixed(1)}
  `);
}

// ------------------------------
// DASHBOARD (CLEANER)
// ------------------------------
function renderDashboard(){

  let ranked = Object.values(players)
    .map(p=>({
      name:p.name,
      avg:getAvg(p.scores)
    }))
    .sort((a,b)=>b.avg-a.avg);

  document.getElementById("kpis").innerHTML=`
    🥇 ${ranked[0].name} (${ranked[0].avg.toFixed(1)})<br>
    🥈 ${ranked[1].name} (${ranked[1].avg.toFixed(1)})<br>
    🥉 ${ranked[2].name} (${ranked[2].avg.toFixed(1)})
  `;

  new Chart(document.getElementById("chart"),{
    type:"line",
    data:{
      labels:["R1","R2","R3"],
      datasets:Object.values(players).map(p=>({
        label:p.name,
        data:p.scores
      }))
    }
  });
}

// ------------------------------
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

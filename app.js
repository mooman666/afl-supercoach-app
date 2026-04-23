let squad = [];

/* ---------------- NAV ---------------- */
function show(tab){
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  document.getElementById(tab).classList.add('active');

  if(tab === "dashboard") renderDashboard();
}

/* ---------------- BASIC HELPERS ---------------- */
function avg(arr){
  return arr.reduce((a,b)=>a+b,0)/arr.length;
}

function trend(scores){
  return scores[scores.length-1] - scores[0];
}

function last3Avg(scores){
  let last3 = scores.slice(-3);
  return avg(last3);
}

/* ---------------- PROJECTION MODEL ---------------- */
function projection(scores){
  return (last3Avg(scores) * 0.7) + (avg(scores) * 0.3);
}

/* ---------------- 10 POINT RATING ---------------- */
function rating10(p){
  let a = avg(p.scores);
  let t = trend(p.scores);
  let proj = projection(p.scores);

  let score =
    (a / 120) * 4 +
    (proj / 120) * 4 +
    ((t + 20) / 40) * 2;

  if(score > 10) score = 10;
  if(score < 1) score = 1;

  return score;
}

/* ---------------- FIND PLAYER ---------------- */
function find(input){
  input = (input || "").toLowerCase();
  return players.find(p =>
    p.name.toLowerCase().includes(input)
  );
}

/* ---------------- ANALYSIS ---------------- */
function analyse(){
  let k = document.getElementById("player").value;
  let p = find(k);

  if(!p) return out("result","Player not found");

  let a = avg(p.scores);
  let proj = projection(p.scores);
  let rating = rating10(p);

  out("result", `
    <b>${p.name}</b><br><br>

    ⭐ Rating: ${rating.toFixed(1)} / 10<br>
    📊 Season Avg: ${a.toFixed(1)}<br>
    🔮 Projection: ${proj.toFixed(1)}<br>
    📈 Trend: ${trend(p.scores)}<br><br>

    📅 Weekly Scores:<br>
    ${p.scores.map((s,i)=>`Round ${i+1}: ${s}`).join("<br>")}
  `);
}

/* ---------------- TRADE ---------------- */
function trade(){
  let k = document.getElementById("tradeInput").value;
  let p = find(k);

  if(!p) return;

  let proj = projection(p.scores);
  let a = avg(p.scores);

  let decision =
    proj > a + 5 ? "🟢 BUY (form rising)" :
    proj < a - 5 ? "🔴 SELL (form dropping)" :
    "🟡 HOLD (stable)";

  out("tradeResult", `
    <b>${p.name}</b><br>
    Avg: ${a.toFixed(1)}<br>
    Projection: ${proj.toFixed(1)}<br>
    <b>${decision}</b>
  `);
}

/* ---------------- CAPTAIN ---------------- */
function captain(){
  let best = null;
  let bestScore = -999;

  players.forEach(p => {
    let score = (projection(p.scores) * 0.6) + (avg(p.scores) * 0.4);

    if(score > bestScore){
      bestScore = score;
      best = p;
    }
  });

  out("captainResult", `🏆 ${best.name}`);
}

/* ---------------- SQUAD ---------------- */
function addPlayer(){
  let k = find(document.getElementById("squadInput").value);
  if(!k || squad.includes(k)) return;

  squad.push(k);
  renderSquad();
}

function renderSquad(){
  let el = document.getElementById("squadList");
  el.innerHTML = "";

  squad.forEach(p=>{
    el.innerHTML += `<div>${p.name}</div>`;
  });
}

/* ---------------- DASHBOARD ---------------- */
function renderDashboard(){

  let ranked = [...players].sort((a,b)=>
    avg(b.scores) - avg(a.scores)
  );

  document.getElementById("kpis").innerHTML = `
    🥇 ${ranked[0].name}<br>
    🥈 ${ranked[1].name}<br>
    🥉 ${ranked[2].name}
  `;

  new Chart(document.getElementById("chart"),{
    type:"bar",
    data:{
      labels: players.map(p=>p.name),
      datasets:[{
        data: players.map(p=>avg(p.scores))
      }]
    }
  });
}

/* ---------------- OUTPUT ---------------- */
function out(id,html){
  document.getElementById(id).innerHTML = html;
}

/* ---------------- INIT ---------------- */
renderDashboard();

/* ---------------- GLOBAL ---------------- */
window.show = show;
window.analyse = analyse;
window.trade = trade;
window.addPlayer = addPlayer;
window.captain = captain;

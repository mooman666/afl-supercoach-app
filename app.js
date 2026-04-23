/* ---------------- STATE ---------------- */
let players = [];
let view = "rankings";

/* ---------------- LOAD DATA (LIVE) ---------------- */
async function loadData(){
  try {
    const res = await fetch("https://opensheet.elk.sh/YOUR_SHEET_ID/Sheet1");
    const data = await res.json();

    players = data.map(p => ({
      name: p.Player,
      position: p.Position,
      scores: [
        Number(p.R1),
        Number(p.R2),
        Number(p.R3),
        Number(p.R4),
        Number(p.R5)
      ].filter(n => !isNaN(n))
    }));

    render();
  } catch (e){
    console.log("Data load failed, using fallback");
  }
}

/* ---------------- CORE STATS ---------------- */
function avg(arr){
  return arr.reduce((a,b)=>a+b,0)/arr.length;
}

function trend(s){
  return s[s.length-1] - s[0];
}

function projection(s){
  let last3 = s.slice(-3);
  return (avg(last3) * 0.7) + (avg(s) * 0.3);
}

function rating(s){
  let a = avg(s);
  let t = trend(s);
  let p = projection(s);

  let r =
    (a/120)*4 +
    (p/120)*4 +
    ((t+20)/40)*2;

  return Math.max(1, Math.min(10, r));
}

/* ---------------- NAV ---------------- */
function setView(v){
  view = v;
  render();
}

/* ---------------- RENDER ---------------- */
function render(){

  if(view === "rankings"){
    renderRankings();
  } else {
    renderAnalytics();
  }
}

/* ---------------- SUPERCOACH STYLE VIEW ---------------- */
function renderRankings(){

  let mids = players.filter(p=>p.position.includes("MID"))
    .sort((a,b)=>projection(b.scores)-projection(a.scores));

  let defs = players.filter(p=>p.position.includes("DEF"))
    .sort((a,b)=>projection(b.scores)-projection(a.scores));

  let rucks = players.filter(p=>p.position.includes("RUC"))
    .sort((a,b)=>projection(b.scores)-projection(a.scores));

  document.getElementById("app").innerHTML = `
    <h2>🏉 Rankings</h2>

    <h3>MIDFIELD</h3>
    ${mids.slice(0,5).map(card).join("")}

    <h3>DEFENCE</h3>
    ${defs.slice(0,5).map(card).join("")}

    <h3>RUCK</h3>
    ${rucks.slice(0,3).map(card).join("")}
  `;
}

/* ---------------- ANALYTICS VIEW ---------------- */
function renderAnalytics(){

  document.getElementById("app").innerHTML = `
    <h2>📊 Analytics</h2>
    <canvas id="chart"></canvas>
  `;

  new Chart(document.getElementById("chart"),{
    type:"line",
    data:{
      labels:["R1","R2","R3","R4","R5"],
      datasets: players.slice(0,3).map(p=>({
        label:p.name,
        data:p.scores
      }))
    }
  });
}

/* ---------------- PLAYER CARD ---------------- */
function card(p){
  return `
    <div class="card">
      <b>${p.name}</b> (${p.position})<br>
      Avg: ${avg(p.scores).toFixed(1)}<br>
      Projection: ${projection(p.scores).toFixed(1)}<br>
      Rating: ${rating(p.scores).toFixed(1)} / 10
    </div>
  `;
}

/* ---------------- INIT ---------------- */
loadData();

/* ---------------- GLOBAL ---------------- */
window.setView = setView;

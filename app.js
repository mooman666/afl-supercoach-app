let players = [];
let view = "top";
let search = "";

const URL =
"https://opensheet.elk.sh/1ZYNGWyFP74w6ruXFtjLudu8sz6w0Y3KsuOJLm0Ro9fM/Sheet1";

/* =========================
   LOAD DATA
========================= */
async function load(){
  const res = await fetch(URL);
  const data = await res.json();

  players = data.map((p, index) => {
    const v = Object.values(p);
    const avg = Number(v[4]) || 0;

    return {
      id: index,
      name: v[1],
      team: v[2],
      points: Number(v[3]) || 0,
      avg,

      // 🔥 stable synthetic form (NOT random each refresh)
      form: generateStableForm(avg, index)
    };
  });

  render();
}

window.setView = v => { view = v; render(); };
window.setSearch = s => { search = s.toLowerCase(); render(); };

/* =========================
   STABLE FORM ENGINE (KEY IMPROVEMENT)
========================= */
function generateStableForm(avg, seed){
  const variance = avg * 0.12;

  return [
    stableNoise(avg, seed + 1, variance),
    stableNoise(avg, seed + 2, variance),
    stableNoise(avg, seed + 3, variance)
  ];
}

function stableNoise(avg, seed, variance){
  // deterministic pseudo-random (so it NEVER changes on refresh)
  const x = Math.sin(seed * 9999) * 10000;
  const rand = x - Math.floor(x);

  return Math.round(avg + (rand * 2 - 1) * variance);
}

/* =========================
   METRICS ENGINE
========================= */
function formAvg(p){
  return p.form.reduce((a,b)=>a+b,0) / 3;
}

function projection(p){
  return Math.round(formAvg(p) * 0.65 + p.avg * 0.35);
}

function ceiling(p){
  return Math.round(p.avg * 1.18);
}

function floor(p){
  return Math.round(p.avg * 0.82);
}

function valueScore(p, i){
  return p.avg / (i + 1);
}

/* =========================
   TIER SYSTEM
========================= */
function tier(avg){
  if(avg >= 110) return "elite";
  if(avg >= 95) return "premium";
  if(avg >= 80) return "value";
  return "avoid";
}

/* =========================
   FILTER
========================= */
function apply(list){
  if(!search) return list;
  return list.filter(p =>
    p.name.toLowerCase().includes(search)
  );
}

/* =========================
   INSIGHTS ENGINE
========================= */
function getInsights(list){
  const sorted = [...list].sort((a,b)=>b.avg-a.avg);
  const best = sorted[0];

  const bestCaptain = [...list]
    .sort((a,b)=>projection(b)-projection(a))[0];

  const bestForm = [...list]
    .sort((a,b)=>formAvg(b)-formAvg(a))[0];

  return `
    <div class="insights">
      <b>🔥 Fantasy Intelligence</b><br><br>

      🏆 Best Player: ${best?.name || "-"}<br>
      🎯 Captain Pick: ${bestCaptain?.name || "-"}<br>
      📈 In-Form Player: ${bestForm?.name || "-"}<br>
      ⚡ Projection Leader: ${bestCaptain?.name || "-"}
    </div>
  `;
}

/* =========================
   RENDER
========================= */
function render(){
  let list = [...players];
  list = apply(list);

  if(view === "top")
    list.sort((a,b)=>b.avg-a.avg);

  if(view === "value")
    list.sort((a,b)=>(b.avg/(b.points||1))-(a.avg/(a.points||1)));

  if(view === "form")
    list.sort((a,b)=>formAvg(b)-formAvg(a));

  document.getElementById("app").innerHTML = `
    ${getInsights(list)}

    ${list.map((p,i)=>`
      <div class="card ${tier(p.avg)}">
        <b>${p.name}</b><br>
        ${p.team}<br><br>

        Avg: ${p.avg.toFixed(1)}<br>
        Form: ${p.form.join(" / ")}<br><br>

        Form Avg: ${formAvg(p).toFixed(1)}<br>
        Projection: ${projection(p)}<br>
        Ceiling: ${ceiling(p)}<br>
        Floor: ${floor(p)}<br><br>

        Value: ${valueScore(p,i).toFixed(2)}<br>
        Tier: ${tier(p.avg).toUpperCase()}
      </div>
    `).join("")}
  `;
}

load();

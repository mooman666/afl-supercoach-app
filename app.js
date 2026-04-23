let squad = [];

// ---------------- NAV ----------------
function show(tab){
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(tab).classList.add('active');
}

// ---------------- CORE METRICS ----------------
function getMetrics(p){
  let trend = p.scores[2] - p.scores[0];

  let consistency =
    Math.abs(p.scores[0] - p.avg) +
    Math.abs(p.scores[1] - p.avg) +
    Math.abs(p.scores[2] - p.avg);

  let valueScore = p.avg / (p.price / 100000);

  let ceiling = Math.max(...p.scores);

  return {
    trend,
    consistency,
    valueScore,
    ceiling
  };
}

// ---------------- FIND ----------------
function find(input){
  input = input.toLowerCase().trim();
  return Object.keys(players).find(k =>
    input.includes(k) || players[k].name.toLowerCase().includes(input)
  );
}

// ---------------- ANALYSIS (UPGRADED) ----------------
function analyse(){
  let key = find(document.getElementById("player").value);
  if(!key) return out("result","Player not found");

  let p = players[key];
  let m = getMetrics(p);

  let verdict =
    m.valueScore > 1.8 && m.trend > 0 ? "🔥 BREAKOUT VALUE" :
    p.avg > 115 && m.consistency < 15 ? "🏆 ELITE PREMIUM" :
    m.valueScore < 1.3 ? "⚠️ OVERPRICED" :
    "✔ SOLID OPTION";

  out("result",
    `<b>${p.name}</b><br>
    Pos: ${p.pos}<br>
    Avg: ${p.avg}<br>
    Trend: ${m.trend >= 0 ? "📈 Rising" : "📉 Falling"}<br>
    Value Score: ${m.valueScore.toFixed(2)}<br>
    Consistency: ${m.consistency.toFixed(1)}<br>
    Ceiling: ${m.ceiling}<br><br>
    <b>${verdict}</b>`
  );
}

// ---------------- TRADE AI (UPGRADED) ----------------
function trade(){
  let key = find(document.getElementById("tradeInput").value);
  if(!key) return out("tradeResult","Player not found");

  let p = players[key];
  let m = getMetrics(p);

  let advice =
    m.valueScore > 1.8 ? "BUY (undervalued)" :
    p.avg > 115 && m.consistency < 15 ? "HOLD (premium lock)" :
    m.valueScore < 1.2 ? "SELL (overpriced)" :
    "HOLD / monitor";

  out("tradeResult",
    `<b>${p.name}</b><br>
    Value: ${m.valueScore.toFixed(2)}<br>
    Advice: ${advice}`
  );
}

// ---------------- SQUAD ENGINE ----------------
function addPlayer(){
  let key = find(document.getElementById("squadInput").value);
  if(!key) return;

  squad.push(key);
  renderSquad();
}

function renderSquad(){
  let list = document.getElementById("squadList");
  list.innerHTML = "";

  let totalValue = 0;
  let totalAvg = 0;

  squad.forEach(k => {
    let p = players[k];
    totalValue += p.price;
    totalAvg += p.avg;

    list.innerHTML += `<li>${p.name} (${p.pos}) - $${p.price}</li>`;
  });

  if(squad.length){
    list.innerHTML += `
      <li><b>Total Value:</b> $${totalValue}</li>
      <li><b>Avg Projection:</b> ${(totalAvg / squad.length).toFixed(1)}</li>
    `;
  }
}

// ---------------- INSIGHTS ENGINE ----------------
function loadFeed(){
  let feed = [];

  Object.values(players).forEach(p => {
    let m = getMetrics(p);

    if(m.valueScore > 1.7){
      feed.push(`🔥 ${p.name} is a VALUE BREAKOUT`);
    }

    if(p.avg > 118){
      feed.push(`🏆 ${p.name} elite premium form`);
    }

    if(m.trend > 5){
      feed.push(`📈 ${p.name} trending upward`);
    }
  });

  document.getElementById("feed").innerHTML =
    feed.map(f => `<p>${f}</p>`).join("");
}

// ---------------- OUTPUT ----------------
function out(id, html){
  document.getElementById(id).innerHTML = html;
}

// INIT
loadFeed();

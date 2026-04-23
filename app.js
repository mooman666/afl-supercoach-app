let squad = [];

// ---------------- NAV ----------------
function show(tab){
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(tab).classList.add('active');
}

// ---------------- FIND ----------------
function find(input){
  input = (input || "").toLowerCase();
  return Object.keys(players).find(k =>
    input.includes(k) || players[k].name.toLowerCase().includes(input)
  );
}

// ---------------- METRICS ----------------
function metrics(p){
  let trend = p.scores[2] - p.scores[0];

  let consistency =
    Math.abs(p.scores[0] - p.avg) +
    Math.abs(p.scores[1] - p.avg) +
    Math.abs(p.scores[2] - p.avg);

  let value = p.avg / (p.price / 100000);
  let ceiling = Math.max(...p.scores);

  return { trend, consistency, value, ceiling };
}

// ---------------- ANALYSIS ----------------
function analyse(){
  let key = find(document.getElementById("player").value);
  if(!key) return out("result","Player not found");

  let p = players[key];
  let m = metrics(p);

  let rating = (p.avg + m.value*10 - m.consistency).toFixed(1);

  let verdict =
    rating > 120 ? "🔥 ELITE PICK" :
    rating > 110 ? "🟡 STRONG" :
    rating > 100 ? "⚪ AVERAGE" :
    "🔴 DROP";

  out("result",
    `<b>${p.name}</b><br>
    Rating: ${rating}<br>
    Value: ${m.value.toFixed(2)}<br>
    Ceiling: ${m.ceiling}<br>
    <b>${verdict}</b>`
  );
}

// ---------------- TRADE ----------------
function trade(){
  let key = find(document.getElementById("tradeInput").value);
  if(!key) return out("tradeResult","Player not found");

  let p = players[key];
  let m = metrics(p);

  let decision =
    m.value > 1.8 ? "🟢 STRONG BUY" :
    m.value > 1.4 ? "🟡 BUY" :
    m.value > 1.1 ? "⚪ HOLD" :
    "🔴 SELL";

  out("tradeResult", `<b>${p.name}</b><br>${decision}`);
}

// ---------------- CAPTAIN ----------------
function captain(){
  let best = null;
  let bestScore = -999;

  Object.values(players).forEach(p => {
    let m = metrics(p);
    let score = p.avg + m.ceiling - m.consistency;

    if(score > bestScore){
      bestScore = score;
      best = p;
    }
  });

  out("captainResult",
    `🏆 Captain: <b>${best.name}</b><br>Score: ${bestScore.toFixed(1)}`
  );
}

// ---------------- SQUAD ----------------
function addPlayer(){
  let key = find(document.getElementById("squadInput").value);
  if(!key || squad.includes(key)) return;

  squad.push(key);
  renderSquad();
}

function renderSquad(){
  let list = document.getElementById("squadList");
  list.innerHTML = "";

  let total = 0;
  let avg = 0;

  squad.forEach(k => {
    let p = players[k];
    total += p.price;
    avg += p.avg;
    list.innerHTML += `<li>${p.name}</li>`;
  });

  document.getElementById("squadStats").innerHTML =
    `Value: $${total}<br>Strength: ${(avg / squad.length || 0).toFixed(1)}`;
}

// ---------------- CHART (NEW VISUAL LAYER) ----------------
function initChart(){
  let ctx = document.getElementById('teamChart');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.values(players).map(p => p.name),
      datasets: [{
        label: 'Average Score',
        data: Object.values(players).map(p => p.avg)
      }]
    }
  });
}

// ---------------- OUTPUT ----------------
function out(id, html){
  document.getElementById(id).innerHTML = html;
}

// INIT
initChart();

// ---------------- GLOBAL FIX ----------------
window.show = show;
window.analyse = analyse;
window.trade = trade;
window.addPlayer = addPlayer;
window.captain = captain;

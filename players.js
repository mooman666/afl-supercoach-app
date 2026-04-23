let squad = [];

// ---------------- NAV ----------------
function show(tab){
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(tab).classList.add('active');
}

// ---------------- METRICS ENGINE ----------------
function metrics(p){
  let trend = p.scores[2] - p.scores[0];

  let consistency =
    Math.abs(p.scores[0] - p.avg) +
    Math.abs(p.scores[1] - p.avg) +
    Math.abs(p.scores[2] - p.avg);

  let value = p.avg / (p.price / 100000);

  let ceiling = Math.max(...p.scores);

  let risk = consistency > 20 ? "HIGH" : "LOW";

  return { trend, consistency, value, ceiling, risk };
}

// ---------------- FIND ----------------
function find(input){
  input = input.toLowerCase();
  return Object.keys(players).find(k =>
    input.includes(k) || players[k].name.toLowerCase().includes(input)
  );
}

// ---------------- ANALYSIS ----------------
function analyse(){
  let key = find(document.getElementById("player").value);
  if(!key) return out("result","Not found");

  let p = players[key];
  let m = metrics(p);

  let rating = (p.avg + m.value*10 - m.consistency).toFixed(1);

  let verdict =
    rating > 120 ? "🔥 ELITE" :
    rating > 110 ? "🟡 GOOD" :
    rating > 100 ? "⚪ AVERAGE" :
    "🔴 DROP";

  out("result",
    `<b>${p.name}</b><br>
    Rating: ${rating}<br>
    Value: ${m.value.toFixed(2)}<br>
    Ceiling: ${m.ceiling}<br>
    Risk: ${m.risk}<br><br>
    <b>${verdict}</b>`
  );
}

// ---------------- TRADE ----------------
function trade(){
  let key = find(document.getElementById("tradeInput").value);
  if(!key) return out("tradeResult","Not found");

  let p = players[key];
  let m = metrics(p);

  let decision =
    m.value > 1.8 ? "🟢 STRONG BUY" :
    m.value > 1.4 ? "🟡 BUY" :
    m.value > 1.1 ? "⚪ HOLD" :
    "🔴 SELL";

  out("tradeResult",
    `<b>${p.name}</b><br>${decision}<br>Value: ${m.value.toFixed(2)}`
  );
}

// ---------------- SQUAD ----------------
function addPlayer(){
  let key = find(document.getElementById("squadInput").value);
  if(!key) return;

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

  let strength = squad.length ? (avg / squad.length).toFixed(1) : 0;

  document.getElementById("squadStats").innerHTML =
    `Total Value: $${total}<br>Team Strength: ${strength}`;
}

// ---------------- CAPTAIN ----------------
function captain(){
  let best = null;
  let bestScore = 0;

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

// ---------------- NEWS ----------------
function loadFeed(){
  let feed = Object.values(players).map(p => {
    let m = metrics(p);
    if(m.value > 1.6) return `🔥 ${p.name} is undervalued`;
    if(p.avg > 115) return `🏆 ${p.name} elite form`;
    if(m.risk === "HIGH") return `⚠️ ${p.name} inconsistent`;
  }).filter(Boolean);

  document.getElementById("feed").innerHTML =
    feed.map(f => `<p>${f}</p>`).join("");
}

// ---------------- OUTPUT ----------------
function out(id, html){
  document.getElementById(id).innerHTML = html;
}

loadFeed();

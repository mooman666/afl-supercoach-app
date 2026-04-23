let squad = [];

// ---------------- NAV ----------------
function show(tab){
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(tab).classList.add('active');
}

// ---------------- FIND PLAYER ----------------
function find(input){
  input = input.toLowerCase().trim();
  return Object.keys(players).find(k =>
    input.includes(k) || players[k].name.toLowerCase().includes(input)
  );
}

// ---------------- ANALYSIS ----------------
function analyse(){
  let key = find(document.getElementById("player").value);

  if(!key){
    document.getElementById("result").innerHTML = "❌ Player not found";
    return;
  }

  let p = players[key];
  let trend = p.scores[2] - p.scores[0];

  let verdict =
    p.avg > 115 ? "🔥 ELITE" :
    p.avg > 105 ? "✔ PREMIUM" :
    "⚠️ MID";

  document.getElementById("result").innerHTML =
    `<b>${p.name}</b><br>
     Avg: ${p.avg}<br>
     Pos: ${p.pos}<br>
     Trend: ${trend >= 0 ? "📈 Rising" : "📉 Falling"}<br>
     <b>${verdict}</b>`;
}

// ---------------- TRADE ----------------
function trade(){
  let key = find(document.getElementById("tradeInput").value);

  if(!key){
    document.getElementById("tradeResult").innerHTML = "❌ Player not found";
    return;
  }

  let p = players[key];

  let advice =
    p.avg > 115 ? "HOLD (elite)" :
    p.avg > 105 ? "HOLD / upgrade target" :
    "SELL / downgrade";

  document.getElementById("tradeResult").innerHTML =
    `<b>${p.name}</b><br>${advice}`;
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

  squad.forEach(k => {
    let p = players[k];
    list.innerHTML += `<li>${p.name} (${p.pos}) - $${p.price}</li>`;
  });
}

// ---------------- NEWS ----------------
function loadFeed(){
  let feed = [
    "🔥 Neale elite form continues",
    "📈 Bont trending upward",
    "💰 Dawson undervalued defender",
    "⚠️ Rowell inconsistent scoring"
  ];

  document.getElementById("feed").innerHTML =
    feed.map(f => `<p>${f}</p>`).join("");
}

// INIT
loadFeed();

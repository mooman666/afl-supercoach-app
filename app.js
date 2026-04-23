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
    Pos: ${p.pos}<br>
    Avg: ${p.avg}<br>
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

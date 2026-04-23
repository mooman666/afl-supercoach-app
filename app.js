function find(input){
  input = input.toLowerCase().trim();
  return Object.keys(players).find(k =>
    input.includes(k) || players[k].name.toLowerCase().includes(input)
  );
}

function analyse(){
  let key = find(document.getElementById("player").value);
  if(!key) return out("result","Player not found");

  let p = players[key];
  let trend = p.scores[2] - p.scores[0];

  let verdict =
    p.avg > 115 ? "🔥 ELITE" :
    p.avg > 105 ? "✔ PREMIUM" :
    "⚠️ MID";

  out("result",
    `<b>${p.name}</b><br>
     Avg: ${p.avg}<br>
     Pos: ${p.pos}<br>
     Trend: ${trend >= 0 ? "📈 Rising" : "📉 Falling"}<br>
     <b>${verdict}</b>`
  );
}

function trade(){
  let key = find(document.getElementById("tradeInput").value);
  if(!key) return out("tradeResult","Player not found");

  let p = players[key];

  let advice =
    p.avg > 115 ? "HOLD" :
    p.avg > 105 ? "HOLD / upgrade target" :
    "SELL";

  out("tradeResult", `<b>${p.name}</b><br>${advice}`);
}

function out(id, html){
  document.getElementById(id).innerHTML = html;
}

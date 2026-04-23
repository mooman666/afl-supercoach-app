function avg(arr){
  return arr.reduce((a,b)=>a+b,0)/arr.length;
}

function trend(scores){
  return scores[scores.length-1] - scores[0];
}

// 🔮 projection model
function project(scores){
  let last3 = scores.slice(-3);
  let weighted = (last3[2]*0.5 + last3[1]*0.3 + last3[0]*0.2);
  return (weighted + avg(scores)) / 2;
}

// 🧠 rank players by position
function rankByPosition(pos){
  return players
    .filter(p => p.position.includes(pos))
    .map(p => ({
      ...p,
      avg: avg(p.scores),
      proj: project(p.scores),
      trend: trend(p.scores)
    }))
    .sort((a,b)=>b.proj - a.proj);
}

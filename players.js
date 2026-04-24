const SHEET_URL =
"https://docs.google.com/spreadsheets/d/1ZYNGWyFP74w6ruXFtjLudu8sz6w0Y3KsuOJLm0Ro9fM/gviz/tq?tqx=out:csv";

let players = [];

async function loadPlayers(){
  const res = await fetch(SHEET_URL);
  const text = await res.text();

  const rows = text.trim().split("\n").map(r => r.split(","));

  // remove header row (exact match, we don’t rely on names)
  rows.shift();

  players = rows.map(r => ({
    rank: Number(r[0]),              // Season Rank
    name: r[1],                      // Name
    team: r[2],                      // Team
    total: Number(r[3]),             // Total yearly points
    avg: Number(r[4])                // Yearly average
  }))
  .filter(p =>
    p.name && !isNaN(p.avg)
  );

  window.onPlayersLoaded(players);
}

loadPlayers();

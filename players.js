const SHEET_URL =
"https://docs.google.com/spreadsheets/d/1ZYNGWyFP74w6ruXFtjLudu8sz6w0Y3KsuOJLm0Ro9fM/gviz/tq?tqx=out:csv";

let players = [];

async function loadPlayers(){
  const res = await fetch(SHEET_URL);
  const text = await res.text();

  const rows = text.trim().split("\n").map(r => r.split(","));
  rows.shift(); // headers

  players = rows.map(r => ({
    rank: Number(r[0]) || 0,
    name: r[1],
    team: r[2],
    total: Number(r[3]) || 0,
    avg: Number(r[4]) || 0
  })).filter(p => p.name);

  window.onPlayersLoaded(players);
}

loadPlayers();

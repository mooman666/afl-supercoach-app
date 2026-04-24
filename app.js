let chart;

let state = {
  players: [],
  filtered: []
};

window.onPlayersLoaded = (players) => {
  state.players = players;
  state.filtered = players;
  render();
  renderChart(players.slice(0, 10));
};

document.getElementById("search").addEventListener("input", (e) => {
  const v = e.target.value.toLowerCase();

  state.filtered = state.players.filter(p =>
    p.name.toLowerCase().includes(v)
  );

  render();
  renderChart(state.filtered.slice(0, 10));
});

function render(){
  document.getElementById("app").innerHTML =
    state.filtered.map(p => `
      <div class="card">
        <b>#${p.rank} ${p.name}</b> (${p.team})<br><br>
        Total: ${p.total}<br>
        Average: ${p.avg}
      </div>
    `).join("");
}

function renderChart(list){
  const ctx = document.getElementById("chart");

  const labels = list.map(p => p.name);
  const data = list.map(p => p.avg);

  if(chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Yearly Average",
        data
      }]
    }
  });
}

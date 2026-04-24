async function loadData() {
  try {
    const res = await fetch(SHEET_URL);

    if (!res.ok) {
      throw new Error("Sheet not reachable");
    }

    const text = await res.text();

    const rows = text.trim().split("\n").map(r => r.split(","));

    if (rows.length < 2) {
      throw new Error("No data returned from sheet");
    }

    rows.shift();

    players = rows.map(r => ({
      rank: Number(r[0]),
      name: r[1],
      team: r[2],
      points: Number(r[3]) || 0,
      avg: Number(r[4]) || 0
    })).filter(p => p.name);

    render();

  } catch (err) {
    document.getElementById("app").innerHTML = `
      <div class="card">
        ❌ Error loading data<br><br>
        ${err.message}
      </div>
    `;

    console.log(err);
  }
}

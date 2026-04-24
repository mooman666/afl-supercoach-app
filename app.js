let players = [];
let search = "";

const URL =
"https://opensheet.elk.sh/1ZYNGWyFP74w6ruXFtjLudu8sz6w0Y3KsuOJLm0Ro9fM/Sheet1";

/* LOAD DATA */
async function load(){
  const res = await fetch(URL);
  const data = await res.json();

  players = data.map(p=>{
    const v = Object.values(p);

    return {
      name: v[1],
      team: v[2],
      points: Number(v[3]) || 0,
      avg: Number(v[4]) || 0
    };
  });

  render();
}

window.setSearch = (s)=>{
  search = s.toLowerCase();
  render();
};

/* TIER */
function tier(avg){
  if(avg>=110) return "elite";
  if(avg>=95) return "premium";
  if(avg>=80) return "value";
  return "avoid";
}

/* FILTER */
function filter(list){
  if(!search) return list;
  return list.filter(p =>
    p.name.toLowerCase().includes(search)
  );
}

/* OPEN PROFILE */
async function openProfile(player){
  const name = player.name;

  const res = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`
  );

  const data = await res.json();

  document.getElementById("modal").style.display = "block";

  document.getElementById("profile").innerHTML = `
    <h2>${player.name}</h2>
    <p><b>${player.team}</b></p>

    ${data.thumbnail?.source ? `<img src="${data.thumbnail.source}"/>` : ""}

    <p>${data.extract || "No bio available."}</p>

    <hr>

    <p><b>Avg:</b> ${player.avg}</p>
    <p><b>Points:</b> ${player.points}</p>
  `;
}

window.closeProfile = ()=>{
  document.getElementById("modal").style.display = "none";
};

/* RENDER */
function render(){
  let list = [...players];
  list = filter(list);

  list.sort((a,b)=>b.avg-a.avg);

  document.getElementById("app").innerHTML = list.map(p=>`
    <div class="card ${tier(p.avg)}" onclick='openProfile(${JSON.stringify(p)})'>
      <b>${p.name}</b><br>
      ${p.team}<br>
      Avg: ${p.avg}<br>
      Points: ${p.points}
    </div>
  `).join("");
}

load();

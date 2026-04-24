// --- DATABASE: THE FULL AFL ADDER (100+ PLAYERS) ---
const database = [
    // ELITE PREMIUMS ($1M+)
    { name: "Bailey Smith", team: "Cats", pos: "MID", price: 1220000, be: 116, avg: 116, own: "25%", hist: "120, 115, 114" },
    { name: "Max Gawn", team: "Demons", pos: "RUC", price: 1188000, be: 113, avg: 113, own: "58%", hist: "145, 128, 130" },
    { name: "Marcus Bontempelli", team: "Bulldogs", pos: "MID", price: 1167000, be: 111, avg: 111, own: "81%", hist: "125, 138, 127" },
    { name: "Nasiah Wanganeen-Milera", team: "Saints", pos: "DEF", price: 1163000, be: 110, avg: 110, own: "31%", hist: "105, 118, 110" },
    { name: "Harry Sheezel", team: "Kangaroos", pos: "MID/FWD", price: 1145000, be: 109, avg: 109, own: "99%", hist: "141, 108, 123" },
    { name: "Nick Daicos", team: "Magpies", pos: "MID", price: 1134000, be: 108, avg: 108, own: "77%", hist: "135, 140, 112" },
    { name: "Jordan Dawson", team: "Crows", pos: "MID", price: 1156000, be: 110, avg: 110, own: "40%", hist: "112, 105, 115" },
    { name: "Brodie Grundy", team: "Swans", pos: "RUC", price: 1122000, be: 107, avg: 107, own: "15%", hist: "125, 130, 111" },
    { name: "Tristan Xerri", team: "Kangaroos", pos: "RUC", price: 1101000, be: 105, avg: 105, own: "53%", hist: "132, 128, 135" },

    // MID-PRICE & VALUE
    { name: "Zak Butters", team: "Power", pos: "MID", price: 1047000, be: 99, avg: 99, own: "96%", hist: "118, 154, 112" },
    { name: "Jordan Clark", team: "Dockers", pos: "DEF", price: 524000, be: 61, avg: 105, own: "15%", hist: "88, 92, 146" },
    { name: "Christian Petracca", team: "Suns", pos: "MID/FWD", price: 571100, be: 85, avg: 105, own: "5%", hist: "102, 110, 95" },

    // CASH COWS (The "Bubble" Rookies)
    { name: "Angus Anderson", team: "Magpies", pos: "MID", price: 113500, be: -75, avg: 79, own: "33%", hist: "68, 74, 95" },
    { name: "Milan Murdock", team: "Eagles", pos: "MID", price: 199900, be: -57, avg: 85, own: "22%", hist: "80, 90, 85" },
    { name: "Elijah Tsatas", team: "Bombers", pos: "MID", price: 223400, be: -49, avg: 91, own: "13%", hist: "88, 92, 94" },
    { name: "Jagga Smith", team: "Blues", pos: "MID", price: 298700, be: 45, avg: 82, own: "75%", hist: "78, 85, 83" },
    { name: "Wade Derksen", team: "Blues", pos: "DEF", price: 99100, be: -34, avg: 60, own: "18%", hist: "55, 65, 60" }
];

// --- SEARCH LOGIC: THE GLOBAL EVENT LISTENER ---
document.getElementById('mainSearch').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    
    // Filters through the entire hardcoded database instantly
    const filtered = database.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.team.toLowerCase().includes(query) ||
        p.pos.toLowerCase().includes(query)
    );
    
    render(filtered);
});

// --- RENDER FUNCTION ---
function render(list) {
    const container = document.getElementById('listContainer');
    container.innerHTML = list.map(p => `
        <div class="player-row" onclick="openModal('${p.name}')">
            <div>
                <strong>${p.name}</strong><br>
                <small>${p.team} | ${p.pos}</small>
            </div>
            <div style="text-align:right">
                <div style="color:var(--success); font-weight:800">$${p.price.toLocaleString()}</div>
                <small style="color:#94a3b8">BE: ${p.be}</small>
            </div>
        </div>
    `).join('');
}

// --- MODAL LOGIC ---
function openModal(name) {
    const p = database.find(x => x.name === name);
    if (!p) return;
    
    document.getElementById('mName').innerText = p.name;
    document.getElementById('mMeta').innerText = `${p.team} | ${p.pos}`;
    document.getElementById('mPrice').innerText = "$" + p.price.toLocaleString();
    document.getElementById('mStats').innerHTML = `
        <strong>2026 Average:</strong> ${p.avg}<br>
        <strong>Breakeven:</strong> ${p.be}<br>
        <strong>Ownership:</strong> ${p.own}<br>
        <strong>Last 3:</strong> ${p.hist}
    `;
    document.getElementById('pModal').classList.add('active');
}

// Initialize on Load
window.onload = () => render(database);

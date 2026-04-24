const playerBody = document.getElementById('playerBody');
const searchInput = document.getElementById('playerSearch');
const posFilter = document.getElementById('posFilter');

function renderPlayers(data) {
    playerBody.innerHTML = '';
    
    data.forEach(p => {
        const value = (p.avg / (p.price / 1000)).toFixed(2);
        const row = `
            <tr>
                <td><strong>${p.name}</strong></td>
                <td>${p.team}</td>
                <td><span class="badge ${p.pos}">${p.pos}</span></td>
                <td>$${p.price.toLocaleString()}</td>
                <td>${p.avg}</td>
                <td>${value}</td>
            </tr>
        `;
        playerBody.innerHTML += row;
    });
}

function filterData() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedPos = posFilter.value;

    const filtered = playerDatabase.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm) || 
                              p.team.toLowerCase().includes(searchTerm);
        const matchesPos = selectedPos === 'ALL' || p.pos.includes(selectedPos);
        return matchesSearch && matchesPos;
    });

    renderPlayers(filtered);
}

searchInput.addEventListener('input', filterData);
posFilter.addEventListener('change', filterData);

// Initial Load
renderPlayers(playerDatabase);

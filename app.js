const playerBody = document.getElementById('playerBody');
const searchInput = document.getElementById('playerSearch');
const posFilter = document.getElementById('posFilter');
const teamFilter = document.getElementById('teamFilter');
const newsFeed = document.getElementById('newsFeed');

let sortOrder = { column: 'price', ascending: false };

function renderNews() {
    newsFeed.innerHTML = newsUpdates.map(n => `
        <div class="news-item">
            <small>${n.date}</small>
            <p>${n.text}</p>
        </div>
    `).join('');
}

function renderPlayers(data) {
    playerBody.innerHTML = '';

    data.forEach(p => {
        const value = (p.avg / (p.price / 1000)).toFixed(2);
        const beClass = p.be < 50 ? 'val-good' : 'val-neutral';
        
        playerBody.innerHTML += `
            <tr>
                <td><strong>${p.name}</strong></td>
                <td>${p.team}</td>
                <td><span class="badge ${p.pos}">${p.pos}</span></td>
                <td>$${p.price.toLocaleString()}</td>
                <td>${p.avg}</td>
                <td>${p.last3}</td>
                <td class="${beClass}">${p.be}</td>
                <td>Rd ${p.bye}</td>
            </tr>
        `;
    });
}

function filterAndSort() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedPos = posFilter.value;
    const selectedTeam = teamFilter.value;

    let filtered = playerDatabase.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm);
        const matchesPos = selectedPos === 'ALL' || p.pos === selectedPos;
        const matchesTeam = selectedTeam === 'ALL' || p.team === selectedTeam;
        return matchesSearch && matchesPos && matchesTeam;
    });

    if (sortOrder.column) {
        filtered.sort((a, b) => {
            let valA = a[sortOrder.column];
            let valB = b[sortOrder.column];
            return sortOrder.ascending ? valA - valB : valB - valA;
        });
    }

    renderPlayers(filtered);
}

function handleSort(column) {
    sortOrder.ascending = (sortOrder.column === column) ? !sortOrder.ascending : false;
    sortOrder.column = column;
    filterAndSort();
}

searchInput.addEventListener('input', filterAndSort);
posFilter.addEventListener('change', filterAndSort);
teamFilter.addEventListener('change', filterAndSort);

// Init
renderNews();
renderPlayers(playerDatabase);

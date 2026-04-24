const playerBody = document.getElementById('playerBody');
const searchInput = document.getElementById('playerSearch');
const posFilter = document.getElementById('posFilter');
const teamFilter = document.getElementById('teamFilter');

let currentData = [...playerDatabase];
let sortOrder = { column: null, ascending: true };

function renderPlayers(data) {
    playerBody.innerHTML = '';

    data.forEach(p => {
        const value = (p.avg / (p.price / 1000)).toFixed(2);
        
        let valueClass = 'val-neutral';
        if (value >= 0.20) valueClass = 'val-good';
        if (value <= 0.13) valueClass = 'val-bad';

        playerBody.innerHTML += `
            <tr>
                <td><strong>${p.name}</strong></td>
                <td>${p.team}</td>
                <td><span class="badge ${p.pos}">${p.pos}</span></td>
                <td>$${p.price.toLocaleString()}</td>
                <td>${p.avg}</td>
                <td class="${valueClass}">${value}</td>
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
            
            if (sortOrder.column === 'value') {
                valA = a.avg / (a.price / 1000);
                valB = b.avg / (b.price / 1000);
            }

            return sortOrder.ascending ? valA - valB : valB - valA;
        });
    }

    renderPlayers(filtered);
}

function handleSort(column) {
    if (sortOrder.column === column) {
        sortOrder.ascending = !sortOrder.ascending;
    } else {
        sortOrder.column = column;
        sortOrder.ascending = false;
    }
    filterAndSort();
}

searchInput.addEventListener('input', filterAndSort);
posFilter.addEventListener('change', filterAndSort);
teamFilter.addEventListener('change', filterAndSort);

renderPlayers(playerDatabase);

const playerBody = document.getElementById('playerBody');
const searchInput = document.getElementById('playerSearch');
const posFilter = document.getElementById('posFilter');
const articleGrid = document.getElementById('articleGrid');
const newsTicker = document.getElementById('newsTicker');

let sortOrder = { column: 'price', ascending: false };

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.getElementById(tabName).style.display = 'block';
}

function renderNews() {
    newsTicker.innerHTML = newsUpdates.map(n => `<span>${n}</span>`).join(' | ');
}

function renderPlayers(data) {
    playerBody.innerHTML = data.map(p => {
        const val = (p.avg / (p.price / 1000)).toFixed(2);
        return `
            <tr>
                <td><strong>${p.name}</strong><br><small>${p.team}</small></td>
                <td><span class="badge ${p.pos.split('/')[0]}">${p.pos}</span></td>
                <td>$${p.price.toLocaleString()}</td>
                <td>${p.avg}</td>
                <td>${p.cba}</td>
                <td class="${p.be < 50 ? 'val-good' : ''}">${p.be}</td>
            </tr>
        `;
    }).join('');
}

function filterData() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedPos = posFilter.value;

    const filtered = playerDatabase.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm) || p.team.toLowerCase().includes(searchTerm);
        const matchesPos = selectedPos === 'ALL' || p.pos.includes(selectedPos);
        return matchesSearch && matchesPos;
    });
    renderPlayers(filtered);
}

function handleSort(column) {
    sortOrder.ascending = (sortOrder.column === column) ? !sortOrder.ascending : false;
    sortOrder.column = column;
    const sorted = [...playerDatabase].sort((a, b) => {
        return sortOrder.ascending ? a[column] - b[column] : b[column] - a[column];
    });
    renderPlayers(sorted);
}

function renderArticles() {
    articleGrid.innerHTML = articles.map(a => `
        <div class="article-card">
            <small>${a.category}</small>
            <h3>${a.title}</h3>
            <p>${a.content}</p>
        </div>
    `).join('');
}

searchInput.addEventListener('input', filterData);
posFilter.addEventListener('change', filterData);

// Init
renderNews();
renderPlayers(playerDatabase);
renderArticles();

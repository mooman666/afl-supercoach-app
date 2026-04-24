const playerBody = document.getElementById('playerBody');
const articleGrid = document.getElementById('articleGrid');
const newsTicker = document.getElementById('newsTicker');

// Navigation Logic
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.getElementById(tabName).style.display = 'block';
}

function renderNews() {
    newsTicker.innerHTML = newsUpdates.map(n => `<span>${n}</span>`).join(' | ');
}

function renderArticles() {
    articleGrid.innerHTML = articles.map(a => `
        <div class="article-card">
            <small>${a.category} • ${a.date}</small>
            <h3>${a.title}</h3>
            <p>${a.content.substring(0, 100)}...</p>
            <button class="read-btn">Read Full Article</button>
        </div>
    `).join('');
}

function renderPlayers(data) {
    playerBody.innerHTML = data.map(p => {
        const val = (p.avg / (p.price / 1000)).toFixed(2);
        return `
            <tr>
                <td><strong>${p.name}</strong></td>
                <td>${p.pos}</td>
                <td>$${p.price.toLocaleString()}</td>
                <td>${p.avg}</td>
                <td>${p.cba}</td>
                <td>${p.tog}</td>
                <td class="${p.be < 50 ? 'val-good' : ''}">${p.be}</td>
            </tr>
        `;
    }).join('');
}

// Initial Load
renderNews();
renderArticles();
renderPlayers(playerDatabase);

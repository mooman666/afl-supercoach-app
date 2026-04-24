function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.getElementById(tabId).style.display = 'block';
}

function renderPlayers(data) {
    const playerBody = document.getElementById('playerBody');
    playerBody.innerHTML = data.map(p => {
        const verdictClass = p.proVerdict.includes('BUY') ? 'buy-tag' : 'hold-tag';
        return `
            <tr>
                <td><strong>${p.name}</strong><br><small>${p.team}</small></td>
                <td><span class="badge ${p.pos.split('/')[0]}">${p.pos}</span></td>
                <td>$${p.price.toLocaleString()}</td>
                <td>${p.avg}</td>
                <td><span class="verdict ${verdictClass}">${p.be}</span></td>
                <td>${p.cba}</td>
            </tr>
        `;
    }).join('');
}

function renderArticles() {
    const articleGrid = document.getElementById('articleGrid');
    articleGrid.innerHTML = articles.map(a => `
        <div class="article-card" onclick="openArticle(${a.id})">
            <small>${a.date}</small>
            <h3>${a.title}</h3>
            <p>Read full premium analysis...</p>
        </div>
    `).join('');
}

function openArticle(id) {
    const article = articles.find(a => a.id === id);
    const modal = document.getElementById('articleModal');
    document.getElementById('modalTitle').innerText = article.title;
    document.getElementById('modalContent').innerHTML = `
        <img src="${article.img}" style="width:100%; border-radius:8px; margin-bottom:15px;">
        <p>${article.content}</p>
    `;
    modal.style.display = "flex";
}

function closeArticle() {
    document.getElementById('articleModal').style.display = "none";
}

// Initial Run
document.addEventListener('DOMContentLoaded', () => {
    renderPlayers(playerDatabase);
    renderArticles();
    document.getElementById('newsTicker').innerHTML = newsUpdates.map(n => `<span>${n}</span>`).join(' | ');
});

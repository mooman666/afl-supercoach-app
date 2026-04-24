// Modal System
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

function renderPlayers(data) {
    const playerBody = document.getElementById('playerBody');
    playerBody.innerHTML = data.map(p => {
        const verdictClass = p.proVerdict.includes('BUY') ? 'buy-tag' : 'hold-tag';
        return `
            <tr>
                <td><strong>${p.name}</strong><br><small>${p.team}</small></td>
                <td><span class="verdict ${verdictClass}">${p.proVerdict}</span></td>
                <td>$${p.price.toLocaleString()}</td>
                <td>${p.avg}</td>
                <td>${p.be}</td>
                <td>${p.cba}</td>
                <td><button class="insight-btn" onclick="alert('${p.insight}')">View</button></td>
            </tr>
        `;
    }).join('');
}

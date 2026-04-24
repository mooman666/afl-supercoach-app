function renderPlayers(data) {
    const playerBody = document.getElementById('playerBody');
    playerBody.innerHTML = data.map(p => {
        const vClass = p.verdict.includes('BUY') ? 'buy-tag' : (p.verdict.includes('SELL') ? 'sell-tag' : 'hold-tag');
        const roiColor = p.roi > 7 ? '#00ff88' : (p.roi < 2 ? '#ff4d4d' : '#eab308');
        
        return `
            <tr>
                <td><strong>${p.name}</strong><br><small>${p.team} • ${p.role}</small></td>
                <td><span class="badge ${p.pos.split('/')[0]}">${p.pos}</span></td>
                <td>$${p.price.toLocaleString()}</td>
                <td><span style="color:${roiColor}; font-weight:bold;">${p.roi}</span></td>
                <td><span class="verdict ${vClass}">${p.be}</span></td>
                <td>${p.cba}</td>
                <td><button class="insight-btn" onclick="alert('${p.insight}')">INFO</button></td>
            </tr>
        `;
    }).join('');
}

function openArticle(id) {
    const art = articles.find(a => a.id === id);
    const modal = document.getElementById('articleModal');
    document.getElementById('modalTitle').innerText = art.title;
    document.getElementById('modalContent').innerHTML = `
        <img src="${art.img}" style="width:100%; border-radius:10px; margin-bottom:15px; border:1px solid #38bdf8;">
        <p style="font-size:16px; line-height:1.6;">${art.content}</p>
    `;
    modal.style.display = "flex";
}
// Note: Ensure your showTab, closeArticle, and event listeners from previous version are kept!

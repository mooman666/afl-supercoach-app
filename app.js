// 🚨 EMERGENCY REBOOT LOGIC
function initApp() {
    console.log("Terminal Booting...");
    
    // Check if players.js data is loaded
    if (typeof playerDatabase !== 'undefined' && playerDatabase.length > 0) {
        console.log("Data Found! Rendering...");
        renderPlayers(playerDatabase);
        
        // Render Articles if they exist
        if (typeof articles !== 'undefined') {
            renderArticles();
        }

        // Fix the Ticker
        const ticker = document.getElementById('newsTicker');
        if (ticker && typeof newsUpdates !== 'undefined') {
            ticker.innerHTML = newsUpdates.map(n => `<span>${n}</span>`).join(' | ');
        }
    } else {
        // If data isn't there yet, wait 500ms and try again
        console.warn("Data missing, retrying...");
        setTimeout(initApp, 500);
    }
}

function renderPlayers(data) {
    const playerBody = document.getElementById('playerBody');
    if (!playerBody) return;
    
    playerBody.innerHTML = data.map(p => {
        const vClass = p.verdict && p.verdict.includes('BUY') ? 'buy-tag' : 'hold-tag';
        return `
            <tr>
                <td><strong>${p.name}</strong><br><small>${p.team || ''}</small></td>
                <td><span class="badge ${p.pos ? p.pos.split('/')[0] : ''}">${p.pos || 'MID'}</span></td>
                <td>$${(p.price || 0).toLocaleString()}</td>
                <td>${p.avg || 0}</td>
                <td><span class="verdict ${vClass}">${p.be || 0}</span></td>
                <td>${p.cba || '0%'}</td>
            </tr>
        `;
    }).join('');
}

function renderArticles() {
    const grid = document.getElementById('articleGrid');
    if (!grid || typeof articles === 'undefined') return;
    grid.innerHTML = articles.map(a => `
        <div class="article-card" onclick="openArticle(${a.id})">
            <h3>${a.title}</h3>
            <p>Click to read premium analysis...</p>
        </div>
    `).join('');
}

function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    const target = document.getElementById(tabId);
    if (target) target.style.display = 'block';
}

function openArticle(id) {
    const art = articles.find(a => a.id === id);
    const modal = document.getElementById('articleModal');
    if (!art || !modal) return;
    document.getElementById('modalTitle').innerText = art.title;
    document.getElementById('modalContent').innerHTML = `<p>${art.content}</p>`;
    modal.style.display = "flex";
}

function closeArticle() {
    const modal = document.getElementById('articleModal');
    if (modal) modal.style.display = "none";
}

// START THE ENGINE
window.onload = initApp;

function initApp() {
    console.log("Checking for data...");
    
    // Check if the playerDatabase exists in memory
    if (typeof playerDatabase !== 'undefined' && playerDatabase.length > 0) {
        console.log("Data loaded! Booting terminal...");
        
        // 1. Fill Table
        renderPlayers(playerDatabase);
        
        // 2. Fill Ticker
        const ticker = document.getElementById('newsTicker');
        if (ticker && typeof newsUpdates !== 'undefined') {
            ticker.innerHTML = newsUpdates.map(n => `<span>${n}</span>`).join(' | ');
        }
        
        // 3. Fill Articles
        if (typeof renderArticles === 'function') renderArticles();

    } else {
        // If data isn't found, don't crash. Wait and try again.
        console.warn("Waiting for players.js to load...");
        setTimeout(initApp, 1000);
    }
}

function renderPlayers(data) {
    const body = document.getElementById('playerBody');
    if (!body) return;
    
    body.innerHTML = data.map(p => `
        <tr>
            <td><strong>${p.name}</strong><br><small>${p.team}</small></td>
            <td>${p.pos}</td>
            <td>$${p.price.toLocaleString()}</td>
            <td>${p.avg}</td>
            <td><span class="verdict buy-tag">${p.be}</span></td>
            <td>${p.cba}</td>
        </tr>
    `).join('');
}

// Kickstart the app
window.onload = initApp;

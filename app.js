// Force the app to run as soon as everything is detected
function initApp() {
    console.log("Terminal Booting...");
    if (typeof playerDatabase !== 'undefined') {
        renderPlayers(playerDatabase);
        renderArticles();
        const ticker = document.getElementById('newsTicker');
        if (ticker && typeof newsUpdates !== 'undefined') {
            ticker.innerHTML = newsUpdates.map(n => `<span>${n}</span>`).join(' | ');
        }
    } else {
        console.error("Data not found. Retrying in 500ms...");
        setTimeout(initApp, 500);
    }
}

// Try both methods to ensure it fires on all phones
window.onload = initApp;
document.addEventListener('DOMContentLoaded', initApp);

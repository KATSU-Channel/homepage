document.addEventListener('DOMContentLoaded', () => {
    const bgContainer = document.getElementById('bg-container');
    const homeContent = document.getElementById('home-content');
    const appContainer = document.getElementById('app-container');
    const appIframe = document.getElementById('app-iframe');
    const appTitleDisplay = document.getElementById('active-app-title');
    const navItems = document.querySelectorAll('.nav-item');
    const projectCards = document.querySelectorAll('.project-card');
    const btnBackHome = document.getElementById('btn-back-home');

    // --- Particle Background ---
    function createParticles() {
        const particleCount = 40;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 3 + 1;
            const left = Math.random() * 100;
            const duration = Math.random() * 15 + 10;
            const delay = Math.random() * 10;

            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${left}%`;
            particle.style.setProperty('--duration', `${duration}s`);
            particle.style.animationDelay = `-${delay}s`;

            bgContainer.appendChild(particle);
        }
    }

    createParticles();

    // --- Navigation Logic ---
    function switchApp(appName) {
        // Reset navigation state
        navItems.forEach(item => item.classList.remove('active'));

        if (appName === 'home') {
            document.getElementById('btn-home').classList.add('active');
            homeContent.classList.remove('hidden');
            appContainer.classList.remove('visible');
            setTimeout(() => {
                appIframe.src = '';
                appTitleDisplay.textContent = 'App View';
            }, 300);
            return;
        }

        // Identify current button
        const activeBtn = document.querySelector(`.nav-item[data-app="${appName}"]`);
        if (activeBtn) activeBtn.classList.add('active');

        // Hide home, show app
        homeContent.classList.add('hidden');
        appContainer.classList.add('visible');

        const appData = {
            timer: { title: 'Retro Timer', path: 'timer/index.html' },
            transcriber: { title: 'AI Transcriber', path: 'transcriber/index.html' }
        };

        if (appData[appName]) {
            appIframe.src = appData[appName].path;
            appTitleDisplay.textContent = appData[appName].title;
        }
    }

    // Event Listeners
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const app = item.getAttribute('data-app') || 'home';
            switchApp(app);
        });
    });

    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const app = card.getAttribute('data-app');
            switchApp(app);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    btnBackHome.addEventListener('click', () => {
        switchApp('home');
    });

    // Initial state
    document.getElementById('btn-home').classList.add('active');
});

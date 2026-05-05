document.addEventListener('DOMContentLoaded', () => {
    const bgContainer = document.getElementById('bg-container');
    const welcomeScreen = document.getElementById('welcome-screen');
    const appContainer = document.getElementById('app-container');
    const appIframe = document.getElementById('app-iframe');
    const navItems = document.querySelectorAll('.nav-item');

    // --- Particle Background ---
    function createParticles() {
        const particleCount = 40;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random properties
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
            welcomeScreen.classList.remove('hidden');
            appContainer.classList.remove('visible');
            setTimeout(() => {
                appIframe.src = '';
            }, 300);
            return;
        }

        // Identify current button
        const activeBtn = document.querySelector(`[data-app="${appName}"]`);
        if (activeBtn) activeBtn.classList.add('active');

        // Hide welcome, show app
        welcomeScreen.classList.add('hidden');
        appContainer.classList.add('visible');

        // Set iframe source based on app name
        // Assumption: folders are sibling to 'homepage'
        const paths = {
            timer: '../timer/index.html',
            transcriber: '../transcriber/index.html'
        };

        if (paths[appName]) {
            appIframe.src = paths[appName];
        }
    }

    // Event Listeners
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const app = item.getAttribute('data-app') || 'home';
            switchApp(app);
        });
    });

    // Initial state
    document.getElementById('btn-home').classList.add('active');
});

document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('main-content');
    const loadingStages = [
        'Checking Game Cartridges...',
        'Warming Up Processors...',
        'Loading Pixel Memories...',
        'Calibrating Joysticks...'
    ];

    const subtext = loader.querySelector('.loading-subtext');
    let stageIndex = 0;

    const stageInterval = setInterval(() => {
        if (stageIndex < loadingStages.length) {
            subtext.textContent = loadingStages[stageIndex];
            stageIndex++;
        }
    }, 750);

    // Simulate loading time
    setTimeout(() => {
        clearInterval(stageInterval);
        loader.style.display = 'none';
        mainContent.style.display = 'block';
    }, 3000);
});

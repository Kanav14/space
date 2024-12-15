document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('main-content');

    // Simulate loading time
    setTimeout(() => {
        loader.style.display = 'none';
        mainContent.style.display = 'block';
    }, 3000); // 3 seconds loader
});

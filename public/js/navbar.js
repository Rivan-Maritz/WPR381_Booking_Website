    document.addEventListener('DOMContentLoaded', function() {
        const currentPath = window.location.pathname;
        const links = document.querySelectorAll('nav a');
        
        links.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            } else if (currentPath === '/' && link.getAttribute('href') === '/') {
                link.classList.add('active');
            } else if (currentPath.startsWith(link.getAttribute('href')) && link.getAttribute('href') !== '/') {
                link.classList.add('active');
            }
        });
    });

document.addEventListener('DOMContentLoaded', function() {
    // ========== CÓDIGO DO MENU HAMBÚRGUER ==========
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');

    if (menuToggle && menu) {
        menuToggle.addEventListener('click', () => {
            menu.classList.toggle('active');
        });
    }

    // ========== CARROSSEL ==========
    const slides = document.getElementsByClassName('slide');
    let currentIndex = 0;
    let slideInterval;
    const intervalTime = 5000;
    
    function showSlide(index) {
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = 'none';
            slides[i].style.opacity = '0';
        }
        slides[index].style.display = 'block';
        setTimeout(() => { slides[index].style.opacity = '1'; }, 10);
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    }
    
    function startCarousel() {
        showSlide(0);
        slideInterval = setInterval(nextSlide, intervalTime);
    }

    // ========== OUTRAS INICIALIZAÇÕES ==========
    startCarousel();

    // Botão para limpar filtros (caso existam na home)
    const resetFilterBtn = document.getElementById('reset-filter');
    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', () => console.log('Filtro resetado'));
    }

    // Evento para o logo - redireciona para index.html
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/index.html';
        });
    }
    
    // ========== BOTÕES DE NAVEGAÇÃO DO CARROSSEL ==========
    document.querySelector('.anterior')?.addEventListener('click', function() {
        clearInterval(slideInterval);
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(currentIndex);
        slideInterval = setInterval(nextSlide, intervalTime);
    });
    
    document.querySelector('.proximo')?.addEventListener('click', function() {
        clearInterval(slideInterval);
        nextSlide();
        slideInterval = setInterval(nextSlide, intervalTime);
    });
});
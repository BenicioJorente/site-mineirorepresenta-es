// Funções de inicialização
function initializePage() {
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');
    if (menuToggle && menu) {
        menuToggle.addEventListener('click', () => {
            menu.classList.toggle('active');
        });
    }

    setupBrandFilters();
    setupPdfViewer();
    
    const resetFilterBtn = document.getElementById('reset-filter');
    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', resetFilter);
    }
    
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '../index.html';
        });
    }
    
    loadFirstPdfOfBrand('all');
}

document.addEventListener('DOMContentLoaded', initializePage);

window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        initializePage();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            handleImageError(this);
        });
    });
});

// 2. CONFIGURAÇÃO DOS FILTROS POR MARCA
function setupBrandFilters() {
    const brands = document.querySelectorAll('.brand');
    brands.forEach(brand => {
        brand.addEventListener('click', function() {
            const brandName = this.getAttribute('data-brand');
            brands.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterPdfsByBrand(brandName);
            updateCatalogTitle(brandName);
            loadFirstPdfOfBrand(brandName);
        });
    });
}

// 3. FILTRAR PDFs POR MARCA
function filterPdfsByBrand(brand) {
    const pdfCards = document.querySelectorAll('.pdf-card');
    let hasVisibleCards = false;
    pdfCards.forEach(card => {
        const cardBrand = card.getAttribute('data-brand');
        if (brand === 'all' || cardBrand === brand) {
            card.style.display = 'block';
            hasVisibleCards = true;
        } else {
            card.style.display = 'none';
        }
    });
    if (!hasVisibleCards) {
        showNoResultsMessage(brand);
    } else {
        hideNoResultsMessage();
    }
}

// 4. ATUALIZAR TÍTULO DOS CATÁLOGOS
function updateCatalogTitle(brand) {
    const titleElement = document.getElementById('catalog-title');
    if (titleElement) {
        titleElement.textContent = brand === 'all' ? 'Catálogos Disponíveis' : `Catálogos ${brand}`;
    }
}

// 5. CARREGAR O PRIMEIRO PDF DA MARCA
function loadFirstPdfOfBrand(brand) {
    const pdfViewer = document.getElementById('pdf-viewer');
    const viewerTitle = document.getElementById('viewer-title');
    const pdfCards = document.querySelectorAll('.pdf-card');
    
    let firstVisibleCard;
    if (brand === 'all') {
        firstVisibleCard = Array.from(pdfCards).find(card => card.style.display !== 'none' && card.getAttribute('data-pdf'));
    } else {
        firstVisibleCard = Array.from(pdfCards).find(card => card.getAttribute('data-brand') === brand && card.style.display !== 'none');
    }
    
    if (firstVisibleCard) {
        const pdfFileName = firstVisibleCard.getAttribute('data-pdf');
        const pdfTitle = firstVisibleCard.getAttribute('data-title');
        const pdfPath = getPdfPath(pdfFileName);
        pdfViewer.src = pdfPath;
        viewerTitle.textContent = pdfTitle;
        pdfCards.forEach(c => c.classList.remove('selected'));
        firstVisibleCard.classList.add('selected');
    } else {
        pdfViewer.src = 'about:blank';
        viewerTitle.textContent = 'Nenhum catálogo disponível';
    }
}

// 6. CONFIGURAÇÃO DO VISUALIZADOR DE PDF
function setupPdfViewer() {
    const pdfViewer = document.getElementById('pdf-viewer');
    const pdfCards = document.querySelectorAll('.pdf-card');
    const viewerTitle = document.getElementById('viewer-title');

    if (!pdfViewer || !pdfCards.length || !viewerTitle) return;

    pdfCards.forEach(card => {
        card.addEventListener('click', function() {
            const pdfFileName = this.getAttribute('data-pdf');
            const pdfTitle = this.getAttribute('data-title');
            const pdfBrand = this.getAttribute('data-brand');
            const pdfPath = getPdfPath(pdfFileName);
            
            pdfViewer.src = pdfPath;
            viewerTitle.textContent = pdfTitle;
            pdfCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            
            const viewerContainer = document.querySelector('.pdf-viewer-container');
            if (viewerContainer) {
                viewerContainer.scrollIntoView({ behavior: 'smooth' });
            }
            updateBrandFilter(pdfBrand);
        });
    });
}

// 7. ATUALIZAR FILTRO DE MARCA
function updateBrandFilter(brand) {
    const brands = document.querySelectorAll('.brand');
    const catalogTitle = document.getElementById('catalog-title');
    brands.forEach(b => {
        b.classList.remove('active');
        if (b.getAttribute('data-brand') === brand) {
            b.classList.add('active');
        }
    });
    if (catalogTitle) {
        catalogTitle.textContent = `Catálogos ${brand}`;
    }
    filterPdfsByBrand(brand);
}

// 8. OBTER CAMINHO DO PDF
function getPdfPath(pdfFileName) {
    // Caminho para o visualizador do PDF.js
    const pdfJsViewerPath = '../assets/pdfjs/web/viewer.html';
    
    // O caminho do seu PDF é codificado e passado como parâmetro 'file'
    // Usamos um caminho absoluto a partir da raiz do servidor
    const pdfUrl = encodeURIComponent(`/assets/pdfs/${pdfFileName}`);
    
    return `${pdfJsViewerPath}?file=${pdfUrl}`;
}

// 9. MOSTRAR MENSAGEM DE NENHUM RESULTADO
function showNoResultsMessage(brand) {
    hideNoResultsMessage();
    const pdfList = document.querySelector('.pdf-list');
    if (!pdfList) return;
    const message = document.createElement('div');
    message.className = 'no-results-message';
    message.innerHTML = `<p>Nenhum catálogo encontrado para <strong>${brand}</strong></p><p>Tente selecionar outra marca ou <a href="#" id="reset-link">limpar os filtros</a></p>`;
    pdfList.appendChild(message);
    const resetLink = document.getElementById('reset-link');
    if (resetLink) {
        resetLink.addEventListener('click', function(e) {
            e.preventDefault();
            resetFilter();
        });
    }
}

// 10. ESCONDER MENSAGEM DE NENHUM RESULTADO
function hideNoResultsMessage() {
    const existingMessage = document.querySelector('.no-results-message');
    if (existingMessage) {
        existingMessage.remove();
    }
}

// 11. FUNÇÃO PARA LIMPAR FILTROS
function resetFilter() {
    const pdfViewer = document.getElementById('pdf-viewer');
    const viewerTitle = document.getElementById('viewer-title');
    if (pdfViewer) pdfViewer.src = 'about:blank';
    if (viewerTitle) viewerTitle.textContent = 'Selecione um catálogo';
    document.querySelectorAll('.pdf-card').forEach(card => {
        card.classList.remove('selected');
        card.style.display = 'block';
    });
    document.querySelectorAll('.brand').forEach(brand => brand.classList.remove('active'));
    document.querySelector('.brand[data-brand="all"]').classList.add('active');
    const titleElement = document.getElementById('catalog-title');
    if (titleElement) titleElement.textContent = 'Catálogos Disponíveis';
    hideNoResultsMessage();
    loadFirstPdfOfBrand('all');
}

// 12. TRATAMENTO DE ERROS DE IMAGEM
function handleImageError(img) {
    console.warn('Imagem não carregada:', img.src);
    img.onerror = null;
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjNmMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkeT0iLjM1ZW0iIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5Ij5JbWFnZW0gbmFvIGVuY29udHJhZGE8L3RleHQ+PC9zdmc+';
    if (img.parentElement) {
        img.parentElement.classList.add('error');
    }
}
// ================================================
// PRICELISTS-ITEMS.JS
// Gestion complète des articles d'une liste de prix
// ================================================

// État global
let currentPricelist = null;
let articles = [];
let filteredArticles = [];
let selectedArticleIds = [];
let currentPage = 1;
let itemsPerPage = 50;
let currentQuickFilter = 'all';
let selectedArticleToAdd = null;

// Données mock pour la recherche d'articles
let availableArticles = [];

// ================================================
// INITIALISATION
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation de la gestion des articles...');
    
    // Récupérer l'ID de la liste depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const pricelistId = urlParams.get('id');
    
    if (!pricelistId) {
        alert('❌ ID de liste de prix manquant');
        window.location.href = './pricelists-list.html';
        return;
    }
    
    loadPricelist(pricelistId);
    initMockData();
});

// ================================================
// CHARGEMENT DES DONNÉES
// ================================================

function loadPricelist(id) {
    // Simuler le chargement depuis une API
    currentPricelist = {
        id: id,
        code: 'TARIF-QUINC-2026',
        name: 'Quincaillerie 2026',
        type: 'SALE',
        currency: 'XAF',
        priority: 10
    };
    
    updateHeader();
    loadArticles();
}

function updateHeader() {
    document.getElementById('pricelist-code').textContent = currentPricelist.code;
    document.getElementById('pricelist-name').textContent = currentPricelist.name;
    document.getElementById('pricelist-type').textContent = currentPricelist.type === 'SALE' ? 'VENTE' : 'ACHAT';
    document.getElementById('pricelist-currency').textContent = currentPricelist.currency;
    document.getElementById('pricelist-priority').textContent = currentPricelist.priority;
    document.getElementById('pricelist-breadcrumb').textContent = currentPricelist.code;
}

function initMockData() {
    // Articles disponibles pour l'ajout
    availableArticles = [
        { id: 'ART001', code: 'CIM-CPJ425', name: 'Ciment CPJ 42.5', family: 'CIMENT', purchasePrice: 186 },
        { id: 'ART002', code: 'FER-TOR12', name: 'Fer à Béton Ø12mm', family: 'FER', purchasePrice: 2200 },
        { id: 'ART003', code: 'PEIN-INT-5L', name: 'Peinture Intérieure 5L', family: 'PEINTURE', purchasePrice: 5000 },
        { id: 'ART004', code: 'CARM-CER-30X30', name: 'Carrelage Céramique 30x30', family: 'CARRELAGE', purchasePrice: 5000 },
        { id: 'ART005', code: 'TUY-PVC-50', name: 'Tuyau PVC Ø50mm', family: 'TUYAU', purchasePrice: 1474 }
    ];
}

function loadArticles() {
    // Simuler des articles avec données complètes
    articles = [
        {
            id: 'ART001',
            code: 'CIM-CPJ425',
            name: 'Ciment CPJ 42.5',
            packaging: 'Sac 50kg',
            family: 'CIMENT',
            category: 'CONSTRUCTION',
            purchasePrice: 186,
            sellingPrice: 372,
            margin: 100,
            hasTiers: true,
            tiersCount: 3,
            tiers: [
                { minQty: 10, price: 360 },
                { minQty: 50, price: 345 },
                { minQty: 100, price: 335 }
            ],
            hasBonus: false,
            status: 'ACTIVE'
        },
        {
            id: 'ART002',
            code: 'FER-TOR12',
            name: 'Fer à Béton Ø12mm',
            packaging: 'Barre 12m',
            family: 'FER',
            category: 'CONSTRUCTION',
            purchasePrice: 2200,
            sellingPrice: 4850,
            margin: 120.5,
            hasTiers: true,
            tiersCount: 2,
            tiers: [
                { minQty: 20, price: 4750 },
                { minQty: 100, price: 4600 }
            ],
            hasBonus: true,
            bonusCount: 1,
            bonusRules: [
                { minQty: 50, bonusQty: 2, label: '50 achetés = 2 offerts' }
            ],
            status: 'ACTIVE'
        },
        {
            id: 'ART003',
            code: 'PEIN-INT-5L',
            name: 'Peinture Intérieure',
            packaging: 'Pot 5L',
            family: 'PEINTURE',
            category: 'FINITION',
            purchasePrice: 5000,
            sellingPrice: 8500,
            margin: 70,
            hasTiers: false,
            hasBonus: false,
            status: 'ACTIVE'
        },
        {
            id: 'ART004',
            code: 'CARM-CER-30X30',
            name: 'Carrelage Céramique',
            packaging: 'Carton (1m²)',
            family: 'CARRELAGE',
            category: 'FINITION',
            purchasePrice: 5000,
            sellingPrice: 12500,
            margin: 150,
            hasTiers: true,
            tiersCount: 2,
            tiers: [
                { minQty: 10, price: 12000 },
                { minQty: 30, price: 11500 }
            ],
            hasBonus: false,
            status: 'ACTIVE'
        },
        {
            id: 'ART005',
            code: 'TUY-PVC-50',
            name: 'Tuyau PVC Ø50mm',
            packaging: 'Barre 4m',
            family: 'TUYAU',
            category: 'CONSTRUCTION',
            purchasePrice: 1474,
            sellingPrice: 2800,
            margin: 89.9,
            hasTiers: true,
            tiersCount: 1,
            tiers: [
                { minQty: 50, price: 2700 }
            ],
            hasBonus: false,
            status: 'INACTIVE'
        }
    ];
    
    filteredArticles = [...articles];
    updateStats();
    renderArticles();
}

function updateStats() {
    document.getElementById('stat-total').textContent = articles.length;
    document.getElementById('stat-active').textContent = articles.filter(a => a.status === 'ACTIVE').length;
    document.getElementById('stat-tiers').textContent = articles.filter(a => a.hasTiers).length;
    document.getElementById('stat-bonus').textContent = articles.filter(a => a.hasBonus).length;
    
    const avgMargin = (articles.reduce((sum, a) => sum + a.margin, 0) / articles.length).toFixed(1);
    document.getElementById('stat-margin').textContent = `${avgMargin}%`;
    
    const avgPrice = (articles.reduce((sum, a) => sum + a.sellingPrice, 0) / articles.length).toLocaleString();
    document.getElementById('stat-avg-price').textContent = avgPrice;
}

// ================================================
// FILTRAGE ET RECHERCHE
// ================================================

function applyFilters() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const familyFilter = document.getElementById('filter-family').value;
    const categoryFilter = document.getElementById('filter-category').value;
    
    filteredArticles = articles.filter(article => {
        const matchesSearch = !searchTerm || 
            article.code.toLowerCase().includes(searchTerm) ||
            article.name.toLowerCase().includes(searchTerm) ||
            article.family.toLowerCase().includes(searchTerm);
        
        const matchesFamily = !familyFilter || article.family === familyFilter;
        const matchesCategory = !categoryFilter || article.category === categoryFilter;
        
        // Quick filter
        let matchesQuickFilter = true;
        if (currentQuickFilter === 'tiers') {
            matchesQuickFilter = article.hasTiers;
        } else if (currentQuickFilter === 'bonus') {
            matchesQuickFilter = article.hasBonus;
        } else if (currentQuickFilter === 'active') {
            matchesQuickFilter = article.status === 'ACTIVE';
        } else if (currentQuickFilter === 'inactive') {
            matchesQuickFilter = article.status === 'INACTIVE';
        }
        
        return matchesSearch && matchesFamily && matchesCategory && matchesQuickFilter;
    });
    
    currentPage = 1;
    renderArticles();
}

function resetFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('filter-family').value = '';
    document.getElementById('filter-category').value = '';
    currentQuickFilter = 'all';
    
    document.querySelectorAll('.quick-filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('[data-filter="all"]').classList.add('active');
    
    applyFilters();
}

function applyQuickFilter(filter) {
    currentQuickFilter = filter;
    
    document.querySelectorAll('.quick-filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
    
    applyFilters();
}

// ================================================
// AFFICHAGE DES ARTICLES
// ================================================

function renderArticles() {
    const tbody = document.getElementById('articles-tbody');
    const emptyState = document.getElementById('empty-state');
    
    if (filteredArticles.length === 0) {
        tbody.innerHTML = '';
        emptyState.classList.remove('hidden');
        document.querySelector('.articles-table').style.display = 'none';
        return;
    }
    
    emptyState.classList.add('hidden');
    document.querySelector('.articles-table').style.display = 'table';
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredArticles.length);
    const pageData = filteredArticles.slice(startIndex, endIndex);
    
    tbody.innerHTML = pageData.map((article, index) => {
        const isExpanded = false; // Par défaut replié
        const marginClass = article.margin >= 0 ? 'margin-positive' : 'margin-negative';
        const statusIcon = article.status === 'ACTIVE' ? '🟢' : '🔴';
        
        let tiersInfo = '-';
        if (article.hasTiers) {
            tiersInfo = `<span class="tier-indicator">
                <i class="fa-solid fa-layer-group"></i>
                ${article.tiersCount}
            </span>`;
            if (article.hasBonus) {
                tiersInfo += ` <span class="bonus-indicator">
                    <i class="fa-solid fa-gift"></i>
                    ${article.bonusCount}
                </span>`;
            }
        }
        
        return `
            <tr>
                <td>
                    <input type="checkbox" class="article-checkbox" data-id="${article.id}" 
                           onchange="updateSelection()">
                </td>
                <td>
                    <button class="btn-icon" onclick="toggleArticleExpand('${article.id}')" title="Détails">
                        <i class="fa-solid fa-chevron-${isExpanded ? 'up' : 'down'}" id="expand-icon-${article.id}"></i>
                    </button>
                </td>
                <td>
                    <div style="font-weight: 600; margin-bottom: 4px;">${article.code}</div>
                    <div style="font-size: 13px; color: var(--gray-600);">${article.name}</div>
                    <div style="font-size: 12px; color: var(--gray-500);">${article.packaging}</div>
                    
                    <div class="article-details" id="details-${article.id}">
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
                            <div>
                                <div style="font-weight: 600; margin-bottom: 8px;">Informations</div>
                                <div style="font-size: 13px; margin-bottom: 4px;">
                                    <strong>Famille:</strong> ${article.family}
                                </div>
                                <div style="font-size: 13px; margin-bottom: 4px;">
                                    <strong>Catégorie:</strong> ${article.category}
                                </div>
                                <div style="font-size: 13px;">
                                    <strong>PA:</strong> ${article.purchasePrice.toLocaleString()} XAF
                                </div>
                            </div>
                            
                            ${article.hasTiers ? `
                            <div>
                                <div style="font-weight: 600; margin-bottom: 8px;">Paliers de Prix</div>
                                <ul class="tier-list">
                                    ${article.tiers.map(t => `
                                        <li>≥${t.minQty}: ${t.price.toLocaleString()} XAF 
                                            <span style="color: #10B981;">(-${((article.sellingPrice - t.price) / article.sellingPrice * 100).toFixed(1)}%)</span>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                            ` : ''}
                        </div>
                        
                        ${article.hasBonus ? `
                        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--gray-300);">
                            <div style="font-weight: 600; margin-bottom: 8px;">Règles de Bonus</div>
                            ${article.bonusRules.map(b => `
                                <div style="font-size: 13px; padding: 6px 12px; background: #FEF3C7; border-radius: 6px; margin-bottom: 4px;">
                                    <i class="fa-solid fa-gift" style="color: #92400E;"></i>
                                    ${b.label}
                                </div>
                            `).join('')}
                        </div>
                        ` : ''}
                        
                        ${!article.hasTiers && !article.hasBonus ? `
                        <div style="color: var(--gray-500); font-style: italic;">
                            Aucun palier ou bonus configuré
                        </div>
                        ` : ''}
                    </div>
                </td>
                <td>
                    <span class="price-badge">${article.sellingPrice.toLocaleString()} XAF</span>
                    <div style="font-size: 12px; color: var(--gray-500); margin-top: 4px;">
                        PA: ${article.purchasePrice.toLocaleString()} XAF
                    </div>
                </td>
                <td style="text-align: center;">
                    <span class="margin-badge ${marginClass}">${article.margin.toFixed(1)}%</span>
                </td>
                <td style="text-align: center;">
                    ${tiersInfo}
                </td>
                <td style="text-align: center;">
                    <span style="font-size: 18px;">${statusIcon}</span>
                </td>
                <td style="text-align: center;">
                    <div class="action-buttons">
                        <button class="btn-icon" onclick="editArticlePrice('${article.id}')" title="Modifier Prix">
                            <i class="fa-solid fa-dollar-sign"></i>
                        </button>
                        <button class="btn-icon" onclick="configureRules('${article.id}')" title="Paliers & Bonus">
                            <i class="fa-solid fa-sliders"></i>
                        </button>
                        <button class="btn-icon" onclick="duplicateArticle('${article.id}')" title="Dupliquer">
                            <i class="fa-solid fa-copy"></i>
                        </button>
                        <button class="btn-icon btn-icon-danger" onclick="removeArticle('${article.id}')" title="Retirer">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    renderPagination();
}

function toggleArticleExpand(articleId) {
    const details = document.getElementById(`details-${articleId}`);
    const icon = document.getElementById(`expand-icon-${articleId}`);
    
    if (details.classList.contains('expanded')) {
        details.classList.remove('expanded');
        icon.className = 'fa-solid fa-chevron-down';
    } else {
        details.classList.add('expanded');
        icon.className = 'fa-solid fa-chevron-up';
    }
}

function renderPagination() {
    const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, filteredArticles.length);
    
    document.getElementById('pagination-info').textContent = 
        `Affichage de ${startIndex} à ${endIndex} sur ${filteredArticles.length} articles`;
    
    let controls = '';
    
    if (totalPages > 1) {
        controls += `
            <button class="btn-pagination" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
                <i class="fa-solid fa-chevron-left"></i>
            </button>
        `;
        
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                controls += `
                    <button class="btn-pagination ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">
                        ${i}
                    </button>
                `;
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                controls += `<span style="padding: 0 8px;">...</span>`;
            }
        }
        
        controls += `
            <button class="btn-pagination" onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
                <i class="fa-solid fa-chevron-right"></i>
            </button>
        `;
    }
    
    document.getElementById('pagination-controls').innerHTML = controls;
}

function goToPage(page) {
    const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    renderArticles();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ================================================
// SÉLECTION MULTIPLE
// ================================================

function toggleSelectAll() {
    const isChecked = document.getElementById('select-all').checked;
    document.querySelectorAll('.article-checkbox').forEach(cb => {
        cb.checked = isChecked;
    });
    updateSelection();
}

function updateSelection() {
    selectedArticleIds = Array.from(document.querySelectorAll('.article-checkbox:checked'))
        .map(cb => cb.dataset.id);
    
    const bulkBar = document.getElementById('bulk-actions-bar');
    const selectAll = document.getElementById('select-all');
    
    if (selectedArticleIds.length > 0) {
        bulkBar.classList.add('active');
        document.getElementById('selected-count').textContent = selectedArticleIds.length;
    } else {
        bulkBar.classList.remove('active');
        selectAll.checked = false;
    }
}

function clearSelection() {
    selectedArticleIds = [];
    document.querySelectorAll('.article-checkbox').forEach(cb => {
        cb.checked = false;
    });
    document.getElementById('select-all').checked = false;
    updateSelection();
}

// ================================================
// ACTIONS SUR LES ARTICLES
// ================================================

function editArticlePrice(articleId) {
    const article = articles.find(a => a.id === articleId);
    if (!article) return;
    
    document.getElementById('edit-article-name').textContent = `${article.code} - ${article.name}`;
    document.getElementById('edit-article-pa').textContent = `${article.purchasePrice.toLocaleString()} XAF`;
    document.getElementById('edit-selling-price').value = article.sellingPrice;
    document.getElementById('edit-margin').value = article.margin;
    
    document.getElementById('edit-price-modal').style.display = 'flex';
    document.getElementById('edit-price-modal').dataset.articleId = articleId;
}

function closeEditPriceModal() {
    document.getElementById('edit-price-modal').style.display = 'none';
}

function saveEditPrice() {
    const articleId = document.getElementById('edit-price-modal').dataset.articleId;
    const newPrice = parseFloat(document.getElementById('edit-selling-price').value);
    
    if (!newPrice || newPrice <= 0) {
        alert('⚠️ Prix invalide');
        return;
    }
    
    const article = articles.find(a => a.id === articleId);
    if (article) {
        article.sellingPrice = newPrice;
        article.margin = ((newPrice - article.purchasePrice) / article.purchasePrice * 100);
        renderArticles();
        closeEditPriceModal();
        alert('✅ Prix modifié avec succès');
    }
}

function configureRules(articleId) {
    window.location.href = `./pricelists-rules.html?pricelist=${currentPricelist.id}&article=${articleId}`;
}

function duplicateArticle(articleId) {
    if (confirm('Dupliquer cet article dans la liste?')) {
        console.log('Duplication:', articleId);
        alert('Fonctionnalité à implémenter');
    }
}

function removeArticle(articleId) {
    const article = articles.find(a => a.id === articleId);
    if (!article) return;
    
    if (confirm(`Retirer l'article ${article.code} de cette liste de prix?`)) {
        articles = articles.filter(a => a.id !== articleId);
        filteredArticles = filteredArticles.filter(a => a.id !== articleId);
        updateStats();
        renderArticles();
        alert('✅ Article retiré avec succès');
    }
}

// ================================================
// AJOUT D'ARTICLE
// ================================================

function openAddArticleModal() {
    document.getElementById('add-article-modal').style.display = 'flex';
    selectedArticleToAdd = null;
}

function closeAddArticleModal() {
    document.getElementById('add-article-modal').style.display = 'none';
    document.getElementById('add-article-form').reset();
    clearArticleSelection();
}

function searchArticles() {
    const searchTerm = document.getElementById('article-search').value.toLowerCase();
    const resultsDiv = document.getElementById('article-search-results');
    
    if (searchTerm.length < 2) {
        resultsDiv.style.display = 'none';
        return;
    }
    
    const filtered = availableArticles.filter(a => 
        a.code.toLowerCase().includes(searchTerm) ||
        a.name.toLowerCase().includes(searchTerm) ||
        a.family.toLowerCase().includes(searchTerm)
    );
    
    if (filtered.length === 0) {
        resultsDiv.innerHTML = '<div style="padding: 12px; text-align: center; color: var(--gray-500);">Aucun article trouvé</div>';
        resultsDiv.style.display = 'block';
        return;
    }
    
    resultsDiv.innerHTML = filtered.map(article => `
        <div style="padding: 12px; cursor: pointer; border-bottom: 1px solid var(--gray-200);"
             onmouseover="this.style.background='var(--gray-50)'"
             onmouseout="this.style.background='white'"
             onclick="selectArticleToAdd('${article.id}')">
            <div style="font-weight: 600; margin-bottom: 4px;">${article.code} - ${article.name}</div>
            <div style="font-size: 12px; color: var(--gray-600);">
                Famille: ${article.family} | PA: ${article.purchasePrice.toLocaleString()} XAF
            </div>
        </div>
    `).join('');
    
    resultsDiv.style.display = 'block';
}

function selectArticleToAdd(articleId) {
    selectedArticleToAdd = availableArticles.find(a => a.id === articleId);
    
    if (!selectedArticleToAdd) return;
    
    document.getElementById('selected-article-code').textContent = selectedArticleToAdd.code;
    document.getElementById('selected-article-name').textContent = selectedArticleToAdd.name;
    document.getElementById('selected-article-pa').textContent = `${selectedArticleToAdd.purchasePrice.toLocaleString()} XAF`;
    
    const suggestedPrice = selectedArticleToAdd.purchasePrice * 2;
    document.getElementById('selected-article-pv-suggest').textContent = `${suggestedPrice.toLocaleString()} XAF`;
    document.getElementById('selling-price').value = suggestedPrice;
    
    document.getElementById('selected-article-info').style.display = 'block';
    document.getElementById('article-search-results').style.display = 'none';
    document.getElementById('article-search').value = '';
    
    document.getElementById('pa-info').textContent = `Prix d'achat: ${selectedArticleToAdd.purchasePrice.toLocaleString()} XAF`;
    
    calculateMargin();
}

function clearArticleSelection() {
    selectedArticleToAdd = null;
    document.getElementById('selected-article-info').style.display = 'none';
    document.getElementById('selling-price').value = '';
    document.getElementById('margin-percent').value = '';
}

function calculateMargin() {
    if (!selectedArticleToAdd) return;
    
    const sellingPrice = parseFloat(document.getElementById('selling-price').value) || 0;
    if (sellingPrice > 0) {
        const margin = ((sellingPrice - selectedArticleToAdd.purchasePrice) / selectedArticleToAdd.purchasePrice * 100);
        document.getElementById('margin-percent').value = margin.toFixed(1);
    }
}

function calculatePriceFromMargin() {
    if (!selectedArticleToAdd) return;
    
    const margin = parseFloat(document.getElementById('margin-percent').value) || 0;
    if (margin >= 0) {
        const sellingPrice = selectedArticleToAdd.purchasePrice * (1 + margin / 100);
        document.getElementById('selling-price').value = sellingPrice.toFixed(2);
    }
}

function toggleMarginMode() {
    // Toggle entre saisie prix et saisie marge
    const sellingPriceInput = document.getElementById('selling-price');
    const marginInput = document.getElementById('margin-percent');
    
    if (sellingPriceInput.disabled) {
        sellingPriceInput.disabled = false;
        marginInput.disabled = true;
    } else {
        sellingPriceInput.disabled = true;
        marginInput.disabled = false;
    }
}

function saveArticle() {
    if (!selectedArticleToAdd) {
        alert('⚠️ Veuillez sélectionner un article');
        return;
    }
    
    const sellingPrice = parseFloat(document.getElementById('selling-price').value);
    if (!sellingPrice || sellingPrice <= 0) {
        alert('⚠️ Prix de vente invalide');
        return;
    }
    
    const status = document.querySelector('input[name="article-status"]:checked').value;
    const margin = ((sellingPrice - selectedArticleToAdd.purchasePrice) / selectedArticleToAdd.purchasePrice * 100);
    
    // Ajouter l'article à la liste
    const newArticle = {
        ...selectedArticleToAdd,
        packaging: 'À définir',
        category: 'CONSTRUCTION',
        sellingPrice: sellingPrice,
        margin: margin,
        hasTiers: false,
        tiersCount: 0,
        tiers: [],
        hasBonus: false,
        bonusCount: 0,
        bonusRules: [],
        status: status
    };
    
    articles.push(newArticle);
    filteredArticles = [...articles];
    
    updateStats();
    renderArticles();
    closeAddArticleModal();
    
    alert('✅ Article ajouté avec succès!');
    
    // Si configuration demandée
    if (document.getElementById('configure-tiers').checked || document.getElementById('configure-bonus').checked) {
        if (confirm('Voulez-vous configurer les paliers et bonus maintenant?')) {
            configureRules(newArticle.id);
        }
    }
}

// ================================================
// ACTIONS GROUPÉES
// ================================================

function bulkEditMargin() {
    if (selectedArticleIds.length === 0) return;
    
    const marginStr = prompt(`Modifier la marge pour ${selectedArticleIds.length} article(s)\n\nNouvelle marge en % :`);
    if (!marginStr) return;
    
    const margin = parseFloat(marginStr);
    if (isNaN(margin)) {
        alert('❌ Marge invalide');
        return;
    }
    
    selectedArticleIds.forEach(id => {
        const article = articles.find(a => a.id === id);
        if (article) {
            article.margin = margin;
            article.sellingPrice = article.purchasePrice * (1 + margin / 100);
        }
    });
    
    renderArticles();
    clearSelection();
    alert(`✅ Marge modifiée pour ${selectedArticleIds.length} article(s)`);
}

function bulkEditPrice() {
    alert('Modification de prix en masse à implémenter');
}

function bulkToggleStatus() {
    if (selectedArticleIds.length === 0) return;
    
    selectedArticleIds.forEach(id => {
        const article = articles.find(a => a.id === id);
        if (article) {
            article.status = article.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        }
    });
    
    renderArticles();
    clearSelection();
    alert(`✅ Statut modifié pour ${selectedArticleIds.length} article(s)`);
}

function bulkDelete() {
    if (selectedArticleIds.length === 0) return;
    
    if (confirm(`⚠️ Supprimer ${selectedArticleIds.length} article(s) de cette liste?`)) {
        articles = articles.filter(a => !selectedArticleIds.includes(a.id));
        filteredArticles = filteredArticles.filter(a => !selectedArticleIds.includes(a.id));
        
        updateStats();
        renderArticles();
        clearSelection();
        alert(`✅ ${selectedArticleIds.length} article(s) supprimé(s)`);
    }
}

// ================================================
// AUTRES ACTIONS
// ================================================

function addByFamily() {
    alert('Ajout par famille à implémenter');
}

function copyFromList() {
    alert('Copie depuis une autre liste à implémenter');
}

function saveAllChanges() {
    console.log('💾 Enregistrement de tous les changements');
    alert('✅ Toutes les modifications ont été enregistrées!');
}

function refreshData() {
    if (confirm('Recharger les données? Les modifications non enregistrées seront perdues.')) {
        location.reload();
    }
}

function importArticles() {
    alert('Fonctionnalité d\'import Excel à implémenter');
}

function exportArticles() {
    alert('Fonctionnalité d\'export Excel à implémenter');
}

function goBackToList() {
    window.location.href = `./pricelists-edit.html?id=${currentPricelist.id}&tab=articles`;
}








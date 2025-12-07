// ================================================
// PRICELISTS-EDIT.JS
// Gestion de l'édition d'une liste de prix (onglets)
// ================================================

// État global
let currentPricelist = null;
let currentTab = 'properties';
let articles = [];
let filteredArticles = [];
let currentEditSection = null;
let selectedArticleToAddModal = null;
let availableArticlesModal = [];

// ================================================
// INITIALISATION
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation de l\'édition de liste de prix...');
    
    // Récupérer l'ID de la liste depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const pricelistId = urlParams.get('id');
    const tab = urlParams.get('tab') || 'properties';
    
    if (!pricelistId) {
        alert('❌ ID de liste de prix manquant');
        window.location.href = './pricelists-list.html';
        return;
    }
    
    loadPricelist(pricelistId);
    switchTab(tab);
});

// ================================================
// CHARGEMENT DES DONNÉES
// ================================================

function loadPricelist(id) {
    // Simuler le chargement depuis une API
    // En production, remplacer par un vrai appel API
    currentPricelist = {
        id: id,
        code: 'TARIF-QUINC-2026',
        name: 'Quincaillerie 2026',
        description: 'Liste de prix dédiée aux revendeurs de quincaillerie pour l\'année 2026',
        type: 'SALE',
        priority: 10,
        currency: 'XAF',
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        status: 'ACTIVE',
        itemsCount: 372,
        partnersTarget: 'PARTNER_QUINCAILLERIE',
        specificPartners: [],
        createdAt: '2025-09-12T14:32:00',
        createdBy: 'Paul EMANE',
        updatedAt: '2025-10-15T09:15:00',
        updatedBy: 'Pierre NGONO'
    };
    
    updateHeader();
    loadArticles();
}

function updateHeader() {
    document.getElementById('pricelist-code').textContent = currentPricelist.code;
    document.getElementById('pricelist-name').textContent = currentPricelist.name;
    
    // Mettre à jour le badge de statut
    const statusBadge = document.getElementById('status-badge');
    statusBadge.className = `status-badge ${currentPricelist.status.toLowerCase()}`;
    
    let statusIcon = 'fa-check-circle';
    let statusText = 'ACTIVE';
    
    if (currentPricelist.status === 'DRAFT') {
        statusIcon = 'fa-file-pen';
        statusText = 'BROUILLON';
    } else if (currentPricelist.status === 'ARCHIVED') {
        statusIcon = 'fa-box-archive';
        statusText = 'ARCHIVÉ';
    }
    
    statusBadge.innerHTML = `
        <i class="fa-solid ${statusIcon}"></i>
        ${statusText}
    `;
    
    // Mettre à jour les propriétés
    updatePropertiesTab();
}

function updatePropertiesTab() {
    document.getElementById('prop-code').textContent = currentPricelist.code;
    document.getElementById('prop-name').textContent = currentPricelist.name;
    document.getElementById('prop-description').textContent = currentPricelist.description || 'Aucune description';
    document.getElementById('prop-priority').textContent = `${currentPricelist.priority} (Standard)`;
    document.getElementById('prop-currency').textContent = `${currentPricelist.currency} - Franc CFA`;
    document.getElementById('prop-start-date').textContent = formatDate(currentPricelist.startDate);
    document.getElementById('prop-end-date').textContent = currentPricelist.endDate ? formatDate(currentPricelist.endDate) : 'Permanent';
}

function loadArticles() {
    // Simuler des articles (MARGE EN MONTANT XAF)
    articles = [
        {
            id: 'ART001',
            code: 'CIM-CPJ425',
            name: 'Ciment CPJ 42.5',
            packaging: 'Sac 50kg',
            purchasePrice: 186,
            sellingPrice: 372,
            marginAmount: 186,  // Marge en XAF
            hasTiers: true,
            tiersCount: 3,
            hasBonus: false,
            status: 'ACTIVE'
        },
        {
            id: 'ART002',
            code: 'FER-TOR12',
            name: 'Fer à Béton Ø12mm',
            packaging: 'Barre 12m',
            purchasePrice: 2200,
            sellingPrice: 4850,
            marginAmount: 2650,  // Marge en XAF
            hasTiers: true,
            tiersCount: 2,
            hasBonus: true,
            bonusCount: 1,
            status: 'ACTIVE'
        },
        {
            id: 'ART003',
            code: 'PEIN-INT-5L',
            name: 'Peinture Intérieure',
            packaging: 'Pot 5L',
            purchasePrice: 5000,
            sellingPrice: 8500,
            marginAmount: 3500,  // Marge en XAF
            hasTiers: false,
            hasBonus: false,
            status: 'ACTIVE'
        },
        {
            id: 'ART004',
            code: 'CARM-CER-30X30',
            name: 'Carrelage Céramique',
            packaging: 'Carton (1m²)',
            purchasePrice: 5000,
            sellingPrice: 12500,
            marginAmount: 7500,  // Marge en XAF
            hasTiers: true,
            tiersCount: 2,
            hasBonus: false,
            status: 'ACTIVE'
        },
        {
            id: 'ART005',
            code: 'TUY-PVC-50',
            name: 'Tuyau PVC Ø50mm',
            packaging: 'Barre 4m',
            purchasePrice: 1474,
            sellingPrice: 2800,
            marginAmount: 1326,  // Marge en XAF
            hasTiers: true,
            tiersCount: 1,
            hasBonus: false,
            status: 'INACTIVE'
        }
    ];
    
    // Articles disponibles pour l'ajout
    availableArticlesModal = [
        { id: 'ART006', code: 'CIM-CPJ325', name: 'Ciment CPJ 32.5 - Sac 50kg', family: 'CIMENT', purchasePrice: 165 },
        { id: 'ART007', code: 'FER-TOR8', name: 'Fer à Béton Ø8mm - Barre 12m', family: 'FER', purchasePrice: 1500 },
        { id: 'ART008', code: 'PEIN-EXT-5L', name: 'Peinture Extérieure 5L - Pot', family: 'PEINTURE', purchasePrice: 6000 },
        { id: 'ART009', code: 'CARM-GRA-40X40', name: 'Carrelage Granite 40x40 - Carton', family: 'CARRELAGE', purchasePrice: 7500 },
        { id: 'ART010', code: 'TUY-PVC-100', name: 'Tuyau PVC Ø100mm - Barre 4m', family: 'TUYAU', purchasePrice: 2800 }
    ];
    
    filteredArticles = [...articles];
    renderArticlesTable();
}

// ================================================
// GESTION DES ONGLETS
// ================================================

function switchTab(tabName) {
    currentTab = tabName;
    
    // Mettre à jour les boutons d'onglets
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Mettre à jour le contenu
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`tab-${tabName}`).classList.add('active');
    
    // Charger les données si nécessaire
    if (tabName === 'articles' && articles.length === 0) {
        loadArticles();
    }
}

// ================================================
// GESTION DES ARTICLES
// ================================================

function renderArticlesTable() {
    const tbody = document.getElementById('articles-table-body');
    
    if (!tbody) return;
    
    tbody.innerHTML = filteredArticles.map(article => {
        const statusClass = article.status === 'ACTIVE' ? 'status-active' : 'status-inactive';
        const statusText = article.status === 'ACTIVE' ? '🟢' : '🔴';
        
        // Calculer le pourcentage de marge pour affichage
        const marginPercent = article.purchasePrice > 0 
            ? ((article.sellingPrice - article.purchasePrice) / article.purchasePrice * 100).toFixed(1)
            : 0;
        
        let tiersInfo = '-';
        if (article.hasTiers) {
            tiersInfo = `<span style="color: var(--primary-color); font-weight: 600;">
                🎯 ${article.tiersCount}
            </span>`;
            if (article.hasBonus) {
                tiersInfo += ` <span style="color: #F59E0B;">🎁 ${article.bonusCount}</span>`;
            }
        }
        
        return `
            <tr>
                <td>
                    <input type="checkbox" class="article-checkbox" data-id="${article.id}">
                </td>
                <td>
                    <div class="article-name">${article.code}</div>
                    <div style="font-size: 13px; color: var(--gray-600); margin-top: 2px;">
                        ${article.name}
                    </div>
                    <div class="article-code">${article.packaging}</div>
                </td>
                <td>
                    <span class="price-badge">${article.sellingPrice.toLocaleString()} XAF</span>
                    <div style="font-size: 12px; color: var(--gray-500); margin-top: 4px;">
                        PA: ${article.purchasePrice.toLocaleString()} XAF
                    </div>
                </td>
                <td style="text-align: center;">
                    <div style="font-weight: 600; font-size: 14px;">${marginPercent}%</div>
                    <div style="font-size: 12px; color: var(--gray-600); margin-top: 2px;">
                        ${article.marginAmount.toLocaleString()} XAF
                    </div>
                </td>
                <td style="text-align: center;">
                    ${tiersInfo}
                </td>
                <td style="text-align: center;">
                    <span style="font-size: 18px;">${statusText}</span>
                </td>
                <td style="text-align: center;">
                    <div class="action-buttons">
                        <button class="btn-icon" onclick="editArticlePrice('${article.id}')" title="Modifier">
                            <i class="fa-solid fa-edit"></i>
                        </button>
                        <button class="btn-icon" onclick="configureRules('${article.id}')" title="Paliers & Bonus">
                            <i class="fa-solid fa-sliders"></i>
                        </button>
                        <button class="btn-icon btn-icon-danger" onclick="removeArticle('${article.id}')" title="Retirer">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function filterArticles() {
    const searchTerm = document.getElementById('article-search')?.value.toLowerCase() || '';
    const familyFilter = document.getElementById('article-family-filter')?.value || '';
    const statusFilter = document.getElementById('article-status-filter')?.value || '';
    
    filteredArticles = articles.filter(article => {
        const matchesSearch = !searchTerm || 
            article.code.toLowerCase().includes(searchTerm) ||
            article.name.toLowerCase().includes(searchTerm);
        
        const matchesFamily = !familyFilter || article.code.startsWith(familyFilter);
        const matchesStatus = !statusFilter || article.status === statusFilter;
        
        return matchesSearch && matchesFamily && matchesStatus;
    });
    
    renderArticlesTable();
}

function toggleSelectAllArticles() {
    const checkboxes = document.querySelectorAll('.article-checkbox');
    const selectAll = event.target.checked;
    
    checkboxes.forEach(cb => {
        cb.checked = selectAll;
    });
}

function editArticlePrice(articleId) {
    const article = articles.find(a => a.id === articleId);
    if (!article) return;
    
    alert(`Édition du prix pour: ${article.code}\nFonctionnalité à implémenter`);
}

function configureRules(articleId) {
    const article = articles.find(a => a.id === articleId);
    if (!article) return;
    
    // Rediriger vers l'écran de configuration des règles
    window.location.href = `./pricelists-rules.html?pricelist=${currentPricelist.id}&article=${articleId}`;
}

function removeArticle(articleId) {
    const article = articles.find(a => a.id === articleId);
    if (!article) return;
    
    if (confirm(`Voulez-vous retirer l'article ${article.code} de cette liste de prix?`)) {
        articles = articles.filter(a => a.id !== articleId);
        filteredArticles = filteredArticles.filter(a => a.id !== articleId);
        renderArticlesTable();
        alert('Article retiré avec succès');
    }
}

function openAddArticleModal() {
    document.getElementById('add-article-modal').style.display = 'flex';
    selectedArticleToAddModal = null;
    document.getElementById('article-search-add').value = '';
    document.getElementById('article-search-results-add').style.display = 'none';
    document.getElementById('selected-article-info-add').style.display = 'none';
    document.getElementById('selling-price-add').value = '';
    document.getElementById('margin-amount-add').value = '';
    document.getElementById('configure-tiers-add').checked = false;
    document.getElementById('configure-bonus-add').checked = false;
}

function closeAddArticleModal() {
    document.getElementById('add-article-modal').style.display = 'none';
}

function searchArticlesModal() {
    const searchTerm = document.getElementById('article-search-add').value.toLowerCase();
    const resultsDiv = document.getElementById('article-search-results-add');
    
    if (searchTerm.length < 2) {
        resultsDiv.style.display = 'none';
        return;
    }
    
    const filtered = availableArticlesModal.filter(a => 
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
             onclick="selectArticleToAddInModal('${article.id}')">
            <div style="font-weight: 600; margin-bottom: 4px;">${article.code}</div>
            <div style="font-size: 13px; color: var(--gray-600);">${article.name}</div>
            <div style="font-size: 12px; color: var(--gray-500); margin-top: 4px;">
                Famille: ${article.family} | PA: ${article.purchasePrice.toLocaleString()} XAF
            </div>
        </div>
    `).join('');
    
    resultsDiv.style.display = 'block';
}

function selectArticleToAddInModal(articleId) {
    selectedArticleToAddModal = availableArticlesModal.find(a => a.id === articleId);
    
    if (!selectedArticleToAddModal) return;
    
    document.getElementById('selected-article-code-add').textContent = 
        `✅ ${selectedArticleToAddModal.code} - ${selectedArticleToAddModal.name}`;
    document.getElementById('selected-article-pa-add').textContent = 
        `${selectedArticleToAddModal.purchasePrice.toLocaleString()} XAF`;
    
    const suggestedPrice = selectedArticleToAddModal.purchasePrice * 2;
    document.getElementById('selected-article-pv-suggest-add').textContent = 
        `${suggestedPrice.toLocaleString()} XAF`;
    document.getElementById('selling-price-add').value = suggestedPrice;
    
    document.getElementById('selected-article-info-add').style.display = 'block';
    document.getElementById('article-search-results-add').style.display = 'none';
    document.getElementById('article-search-add').value = '';
    
    document.getElementById('pa-info-add').textContent = 
        `ℹ️ Prix d'achat: ${selectedArticleToAddModal.purchasePrice.toLocaleString()} XAF`;
    
    calculateMarginModal();
}

function clearArticleSelectionModal() {
    selectedArticleToAddModal = null;
    document.getElementById('selected-article-info-add').style.display = 'none';
    document.getElementById('selling-price-add').value = '';
    document.getElementById('margin-amount-add').value = '';
    document.getElementById('pa-info-add').textContent = 'ℹ️ Prix d\'achat: -';
}

function calculateMarginModal() {
    if (!selectedArticleToAddModal) return;
    
    const sellingPrice = parseFloat(document.getElementById('selling-price-add').value) || 0;
    if (sellingPrice > 0) {
        const marginAmount = sellingPrice - selectedArticleToAddModal.purchasePrice;
        document.getElementById('margin-amount-add').value = marginAmount.toFixed(2);
    }
}

function calculatePriceFromMarginModal() {
    if (!selectedArticleToAddModal) return;
    
    const marginAmount = parseFloat(document.getElementById('margin-amount-add').value) || 0;
    const sellingPrice = selectedArticleToAddModal.purchasePrice + marginAmount;
    document.getElementById('selling-price-add').value = sellingPrice.toFixed(2);
}

function autoCalculateModal() {
    if (!selectedArticleToAddModal) {
        alert('⚠️ Veuillez d\'abord sélectionner un article');
        return;
    }
    
    const sellingPrice = parseFloat(document.getElementById('selling-price-add').value) || 0;
    if (sellingPrice > 0) {
        calculateMarginModal();
    } else {
        const marginAmount = parseFloat(document.getElementById('margin-amount-add').value) || 0;
        if (marginAmount > 0) {
            calculatePriceFromMarginModal();
        }
    }
}

function saveArticleModal() {
    if (!selectedArticleToAddModal) {
        alert('⚠️ Veuillez sélectionner un article');
        return;
    }
    
    const sellingPrice = parseFloat(document.getElementById('selling-price-add').value);
    if (!sellingPrice || sellingPrice <= 0) {
        alert('⚠️ Prix de vente invalide');
        return;
    }
    
    const status = document.querySelector('input[name="article-status-add"]:checked').value;
    const marginAmount = sellingPrice - selectedArticleToAddModal.purchasePrice;
    
    // Ajouter l'article à la liste
    const newArticle = {
        id: selectedArticleToAddModal.id,
        code: selectedArticleToAddModal.code,
        name: selectedArticleToAddModal.name.split(' - ')[0],
        packaging: selectedArticleToAddModal.name.split(' - ')[1] || 'À définir',
        purchasePrice: selectedArticleToAddModal.purchasePrice,
        sellingPrice: sellingPrice,
        marginAmount: marginAmount,
        hasTiers: false,
        tiersCount: 0,
        hasBonus: false,
        bonusCount: 0,
        status: status
    };
    
    articles.push(newArticle);
    filteredArticles = [...articles];
    
    renderArticlesTable();
    closeAddArticleModal();
    
    alert('✅ Article ajouté avec succès!');
    
    // Si configuration demandée
    if (document.getElementById('configure-tiers-add').checked || 
        document.getElementById('configure-bonus-add').checked) {
        if (confirm('Voulez-vous configurer les paliers et bonus maintenant?')) {
            configureRules(newArticle.id);
        }
    }
}

function addByFamily() {
    alert('Ajout par famille à implémenter');
}

function copyFrom() {
    alert('Copie depuis une autre liste à implémenter');
}

// ================================================
// ÉDITION DES SECTIONS
// ================================================

function editSection(section) {
    currentEditSection = section;
    const modal = document.getElementById('edit-modal');
    const modalTitle = document.getElementById('edit-modal-title');
    const modalBody = document.getElementById('edit-modal-body');
    
    let content = '';
    
    switch(section) {
        case 'general':
            modalTitle.textContent = 'Modifier les Informations Générales';
            content = `
                <div class="form-group">
                    <label class="form-label required">Code</label>
                    <input type="text" class="form-input" id="edit-code" value="${currentPricelist.code}" disabled>
                    <small class="form-help">Le code ne peut pas être modifié</small>
                </div>
                <div class="form-group">
                    <label class="form-label required">Nom</label>
                    <input type="text" class="form-input" id="edit-name" value="${currentPricelist.name}">
                </div>
                <div class="form-group">
                    <label class="form-label">Description</label>
                    <textarea class="form-input" id="edit-description" rows="3">${currentPricelist.description}</textarea>
                </div>
            `;
            break;
            
        case 'type':
            modalTitle.textContent = 'Modifier Type & Priorité';
            content = `
                <div class="form-group">
                    <label class="form-label required">Priorité</label>
                    <input type="number" class="form-input" id="edit-priority" value="${currentPricelist.priority}" min="1" max="999">
                    <small class="form-help">Plus bas = prioritaire</small>
                </div>
                <div class="form-group">
                    <label class="form-label required">Devise</label>
                    <select class="form-input" id="edit-currency">
                        <option value="XAF" ${currentPricelist.currency === 'XAF' ? 'selected' : ''}>XAF - Franc CFA</option>
                        <option value="EUR" ${currentPricelist.currency === 'EUR' ? 'selected' : ''}>EUR - Euro</option>
                        <option value="USD" ${currentPricelist.currency === 'USD' ? 'selected' : ''}>USD - Dollar US</option>
                    </select>
                    <small class="form-help">⚠️ Attention: modifier la devise impactera tous les articles</small>
                </div>
            `;
            break;
            
        case 'validity':
            modalTitle.textContent = 'Modifier la Période de Validité';
            content = `
                <div class="form-group">
                    <label class="form-label required">Date de début</label>
                    <input type="date" class="form-input" id="edit-start-date" value="${currentPricelist.startDate}">
                </div>
                <div class="form-group">
                    <label class="form-label">Date de fin</label>
                    <input type="date" class="form-input" id="edit-end-date" value="${currentPricelist.endDate || ''}">
                    <label style="display: flex; align-items: center; gap: 8px; margin-top: 8px;">
                        <input type="checkbox" id="edit-no-end-date" ${!currentPricelist.endDate ? 'checked' : ''}>
                        Pas de date de fin (permanente)
                    </label>
                </div>
            `;
            break;
            
        case 'status':
            modalTitle.textContent = 'Modifier le Statut';
            content = `
                <div class="form-group">
                    <label class="form-label required">Statut</label>
                    <select class="form-input" id="edit-status">
                        <option value="DRAFT" ${currentPricelist.status === 'DRAFT' ? 'selected' : ''}>Brouillon</option>
                        <option value="ACTIVE" ${currentPricelist.status === 'ACTIVE' ? 'selected' : ''}>Actif</option>
                        <option value="ARCHIVED" ${currentPricelist.status === 'ARCHIVED' ? 'selected' : ''}>Archivé</option>
                    </select>
                </div>
            `;
            break;
            
        default:
            modalTitle.textContent = 'Modifier';
            content = `<p>Section: ${section}</p>`;
    }
    
    modalBody.innerHTML = content;
    modal.style.display = 'flex';
}

function closeEditModal() {
    document.getElementById('edit-modal').style.display = 'none';
    currentEditSection = null;
}

function saveEditModal() {
    if (!currentEditSection) return;
    
    switch(currentEditSection) {
        case 'general':
            currentPricelist.name = document.getElementById('edit-name').value;
            currentPricelist.description = document.getElementById('edit-description').value;
            break;
            
        case 'type':
            currentPricelist.priority = parseInt(document.getElementById('edit-priority').value);
            currentPricelist.currency = document.getElementById('edit-currency').value;
            break;
            
        case 'validity':
            currentPricelist.startDate = document.getElementById('edit-start-date').value;
            const noEndDate = document.getElementById('edit-no-end-date').checked;
            currentPricelist.endDate = noEndDate ? null : document.getElementById('edit-end-date').value;
            break;
            
        case 'status':
            currentPricelist.status = document.getElementById('edit-status').value;
            break;
    }
    
    updateHeader();
    closeEditModal();
    alert('✅ Modifications enregistrées');
}

// ================================================
// ACTIONS GLOBALES
// ================================================

function saveChanges() {
    console.log('💾 Enregistrement des modifications:', currentPricelist);
    alert('✅ Modifications enregistrées avec succès!');
}

function refreshData() {
    if (confirm('Recharger les données? Les modifications non enregistrées seront perdues.')) {
        location.reload();
    }
}

function duplicatePricelist() {
    if (confirm(`Dupliquer la liste "${currentPricelist.name}"?`)) {
        alert('Fonctionnalité de duplication à implémenter');
    }
}

function importItems() {
    alert('Fonctionnalité d\'import à implémenter');
}

function exportItems() {
    alert('Fonctionnalité d\'export à implémenter');
}

function archivePricelist() {
    if (confirm(`⚠️ Voulez-vous archiver la liste "${currentPricelist.name}"?\n\nElle ne sera plus appliquée mais restera consultable.`)) {
        currentPricelist.status = 'ARCHIVED';
        updateHeader();
        alert('✅ Liste archivée avec succès');
    }
}

function goBack() {
    window.location.href = './pricelists-list.html';
}

// ================================================
// HELPERS
// ================================================

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}


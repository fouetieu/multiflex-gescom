// ================================================
// PRICELISTS-ADD-ITEMS.JS
// Écran d'ajout d'articles dans une liste de prix
// ================================================

// État global
let currentPricelist = null;
let selectedMethod = null;
let selectedArticles = [];
let availableArticles = [];
let families = [];
let otherPricelists = [];
let articlesInCurrentList = [];

// ================================================
// INITIALISATION
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation de l\'ajout d\'articles...');
    
    const urlParams = new URLSearchParams(window.location.search);
    const pricelistId = urlParams.get('id');
    
    if (!pricelistId) {
        alert('❌ ID de liste de prix manquant');
        window.location.href = './pricelists-list.html';
        return;
    }
    
    loadData(pricelistId);
    initializeDragAndDrop();
});

// ================================================
// CHARGEMENT DES DONNÉES
// ================================================

function loadData(pricelistId) {
    // Charger la liste de prix
    currentPricelist = {
        id: pricelistId,
        code: 'TARIF-QUINC-2026',
        name: 'Quincaillerie 2026',
        currency: 'XAF'
    };
    
    document.getElementById('pricelist-name').textContent = 
        `${currentPricelist.code} - ${currentPricelist.name}`;
    
    // Articles déjà dans la liste
    articlesInCurrentList = ['ART001', 'ART002']; // IDs des articles déjà présents
    
    // Articles disponibles
    availableArticles = [
        { id: 'ART001', code: 'CIM-CPJ425', name: 'Ciment CPJ 42.5', family: 'CIMENT', purchasePrice: 186, inList: true },
        { id: 'ART002', code: 'FER-TOR12', name: 'Fer à Béton Ø12mm', family: 'FER', purchasePrice: 2200, inList: true },
        { id: 'ART003', code: 'PEIN-INT-5L', name: 'Peinture Intérieure 5L', family: 'PEINTURE', purchasePrice: 5000, inList: false },
        { id: 'ART004', code: 'CARM-CER-30X30', name: 'Carrelage Céramique 30x30', family: 'CARRELAGE', purchasePrice: 5000, inList: false },
        { id: 'ART005', code: 'TUY-PVC-50', name: 'Tuyau PVC Ø50mm', family: 'TUYAU', purchasePrice: 1474, inList: false },
        { id: 'ART006', code: 'CIM-CPJ325', name: 'Ciment CPJ 32.5', family: 'CIMENT', purchasePrice: 165, inList: false },
        { id: 'ART007', code: 'FER-TOR8', name: 'Fer à Béton Ø8mm', family: 'FER', purchasePrice: 1500, inList: false },
        { id: 'ART008', code: 'PEIN-EXT-5L', name: 'Peinture Extérieure 5L', family: 'PEINTURE', purchasePrice: 6000, inList: false },
        { id: 'ART009', code: 'CARM-GRA-40X40', name: 'Carrelage Granite 40x40', family: 'CARRELAGE', purchasePrice: 7500, inList: false },
        { id: 'ART010', code: 'TUY-PVC-100', name: 'Tuyau PVC Ø100mm', family: 'TUYAU', purchasePrice: 2800, inList: false }
    ];
    
    // Extraire les familles
    families = [
        { code: 'CIMENT', name: 'Ciment', count: availableArticles.filter(a => a.family === 'CIMENT' && !a.inList).length },
        { code: 'FER', name: 'Fer à Béton', count: availableArticles.filter(a => a.family === 'FER' && !a.inList).length },
        { code: 'PEINTURE', name: 'Peinture', count: availableArticles.filter(a => a.family === 'PEINTURE' && !a.inList).length },
        { code: 'CARRELAGE', name: 'Carrelage', count: availableArticles.filter(a => a.family === 'CARRELAGE' && !a.inList).length },
        { code: 'TUYAU', name: 'Tuyauterie', count: availableArticles.filter(a => a.family === 'TUYAU' && !a.inList).length }
    ];
    
    // Autres listes de prix
    otherPricelists = [
        { id: 'PL002', code: 'TARIF-TECH-2026', name: 'Techniciens 2026', articlesCount: 285 },
        { id: 'PL003', code: 'PROMO-BTP-Q4', name: 'Promo Matériaux BTP', articlesCount: 48 },
        { id: 'PL004', code: 'STANDARD-2025', name: 'Tarif Standard 2025', articlesCount: 512 }
    ];
}

// ================================================
// SÉLECTION DE LA MÉTHODE
// ================================================

function selectMethod(method) {
    selectedMethod = method;
    
    // Mettre à jour les cartes
    document.querySelectorAll('.method-card').forEach(card => {
        card.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    // Afficher l'étape correspondante après un court délai
    setTimeout(() => {
        document.getElementById('step-method').classList.add('hidden');
        
        switch(method) {
            case 'browse':
                document.getElementById('step-browse').classList.remove('hidden');
                initBrowse();
                break;
            case 'family':
                document.getElementById('step-family').classList.remove('hidden');
                initFamily();
                break;
            case 'import':
                document.getElementById('step-import').classList.remove('hidden');
                break;
            case 'copy':
                document.getElementById('step-copy').classList.remove('hidden');
                initCopy();
                break;
        }
    }, 300);
}

function backToMethod() {
    selectedArticles = [];
    
    document.querySelectorAll('.step-content').forEach(step => {
        step.classList.add('hidden');
    });
    document.getElementById('step-method').classList.remove('hidden');
}

// ================================================
// MÉTHODE 1 : PARCOURIR (BROWSE)
// ================================================

function initBrowse() {
    // Initialiser la liste des familles
    const familiesList = document.getElementById('families-list');
    familiesList.innerHTML = `
        <div class="family-item active" data-family="all" onclick="filterByFamily('all')">
            <span>Toutes les familles</span>
            <span style="background: var(--gray-300); padding: 2px 8px; border-radius: 10px; font-size: 12px;">
                ${availableArticles.filter(a => !a.inList).length}
            </span>
        </div>
        ${families.map(f => `
            <div class="family-item" data-family="${f.code}" onclick="filterByFamily('${f.code}')">
                <span>${f.name}</span>
                <span style="background: var(--gray-300); padding: 2px 8px; border-radius: 10px; font-size: 12px;">
                    ${f.count}
                </span>
            </div>
        `).join('')}
    `;
    
    renderBrowseArticles();
}

function renderBrowseArticles(familyFilter = 'all', searchTerm = '') {
    const articlesGrid = document.getElementById('articles-grid');
    
    let filtered = availableArticles.filter(a => {
        const matchesFamily = familyFilter === 'all' || a.family === familyFilter;
        const matchesSearch = !searchTerm || 
            a.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFamily && matchesSearch;
    });
    
    if (filtered.length === 0) {
        articlesGrid.innerHTML = `
            <div style="text-align: center; padding: 60px; color: var(--gray-500);">
                <i class="fa-solid fa-inbox" style="font-size: 64px; margin-bottom: 16px; opacity: 0.5;"></i>
                <p>Aucun article trouvé</p>
            </div>
        `;
        return;
    }
    
    articlesGrid.innerHTML = filtered.map(article => {
        const isSelected = selectedArticles.some(a => a.id === article.id);
        const isInList = article.inList;
        
        return `
            <div class="article-card ${isSelected ? 'selected' : ''} ${isInList ? 'already-in-list' : ''}"
                 ${!isInList ? `onclick="toggleArticleSelection('${article.id}')"` : ''}>
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                    <div style="flex: 1;">
                        <div style="font-weight: 600; margin-bottom: 4px;">${article.code}</div>
                        <div style="font-size: 14px; color: var(--gray-600);">${article.name}</div>
                    </div>
                    ${isSelected ? '<i class="fa-solid fa-check-circle" style="color: var(--primary-color); font-size: 24px;"></i>' : ''}
                    ${isInList ? '<i class="fa-solid fa-ban" style="color: var(--gray-400); font-size: 24px;"></i>' : ''}
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--gray-200);">
                    <div>
                        <div style="font-size: 12px; color: var(--gray-500);">Famille</div>
                        <div style="font-size: 13px; font-weight: 600;">${article.family}</div>
                    </div>
                    <div>
                        <div style="font-size: 12px; color: var(--gray-500);">PA</div>
                        <div style="font-size: 13px; font-weight: 600;">${article.purchasePrice.toLocaleString()} XAF</div>
                    </div>
                </div>
                ${isInList ? '<div style="margin-top: 8px; font-size: 12px; color: var(--gray-500); font-style: italic;">Déjà dans la liste</div>' : ''}
            </div>
        `;
    }).join('');
}

function filterByFamily(family) {
    document.querySelectorAll('.family-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-family="${family}"]`).classList.add('active');
    
    const searchTerm = document.getElementById('browse-search').value;
    renderBrowseArticles(family, searchTerm);
}

function filterBrowseArticles() {
    const searchTerm = document.getElementById('browse-search').value;
    const activeFamily = document.querySelector('.family-item.active').dataset.family;
    renderBrowseArticles(activeFamily, searchTerm);
}

function toggleArticleSelection(articleId) {
    const article = availableArticles.find(a => a.id === articleId);
    if (!article || article.inList) return;
    
    const index = selectedArticles.findIndex(a => a.id === articleId);
    if (index > -1) {
        selectedArticles.splice(index, 1);
    } else {
        const suggestedPrice = article.purchasePrice * 2;
        const marginAmount = suggestedPrice - article.purchasePrice;
        
        selectedArticles.push({
            ...article,
            sellingPrice: suggestedPrice,
            marginAmount: marginAmount,  // Marge en XAF
            status: 'ACTIVE'
        });
    }
    
    updateBrowseSelection();
}

function updateBrowseSelection() {
    const count = selectedArticles.length;
    document.getElementById('selected-count-browse').textContent = `(${count})`;
    document.getElementById('btn-proceed-browse').disabled = count === 0;
    
    const activeFamily = document.querySelector('.family-item.active').dataset.family;
    const searchTerm = document.getElementById('browse-search').value;
    renderBrowseArticles(activeFamily, searchTerm);
}

// ================================================
// MÉTHODE 2 : PAR FAMILLE
// ================================================

function initFamily() {
    const familiesGrid = document.getElementById('families-grid');
    
    familiesGrid.innerHTML = families.map(family => `
        <div class="method-card" data-family="${family.code}" onclick="toggleFamilySelection('${family.code}')">
            <div class="method-icon">
                <i class="fa-solid fa-layer-group"></i>
            </div>
            <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">
                ${family.name}
            </h3>
            <div style="font-size: 14px; color: var(--gray-600);">
                <strong>${family.count}</strong> article(s) disponible(s)
            </div>
        </div>
    `).join('');
}

function toggleFamilySelection(familyCode) {
    const card = document.querySelector(`[data-family="${familyCode}"]`);
    card.classList.toggle('active');
    
    // Mettre à jour la sélection
    selectedArticles = [];
    document.querySelectorAll('.method-card.active[data-family]').forEach(activeCard => {
        const family = activeCard.dataset.family;
        const familyArticles = availableArticles.filter(a => a.family === family && !a.inList);
        familyArticles.forEach(article => {
            const suggestedPrice = article.purchasePrice * 2;
            const marginAmount = suggestedPrice - article.purchasePrice;
            
            selectedArticles.push({
                ...article,
                sellingPrice: suggestedPrice,
                marginAmount: marginAmount,  // Marge en XAF
                status: 'ACTIVE'
            });
        });
    });
    
    const count = selectedArticles.length;
    document.getElementById('selected-count-family').textContent = `(${count} articles)`;
    document.getElementById('btn-proceed-family').disabled = count === 0;
}

// ================================================
// MÉTHODE 3 : IMPORT EXCEL
// ================================================

function initializeDragAndDrop() {
    const dropZone = document.getElementById('drop-zone');
    
    if (!dropZone) return;
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.add('drag-over');
        }, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.remove('drag-over');
        }, false);
    });
    
    dropZone.addEventListener('drop', handleDrop, false);
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    
    if (files.length > 0) {
        handleFileSelect({ target: { files: files } });
    }
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    
    if (!file) return;
    
    console.log('📄 Fichier sélectionné:', file.name);
    
    // Simuler le traitement du fichier
    document.getElementById('import-results').style.display = 'block';
    document.getElementById('import-results').innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <i class="fa-solid fa-spinner fa-spin" style="font-size: 48px; color: var(--primary-color); margin-bottom: 16px;"></i>
            <div style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">
                Traitement en cours...
            </div>
            <div style="font-size: 14px; color: var(--gray-600);">
                Lecture et validation du fichier ${file.name}
            </div>
        </div>
    `;
    
    // Simuler le résultat après 2 secondes
    setTimeout(() => {
        const importedArticles = [
            { code: 'PEIN-INT-5L', name: 'Peinture Intérieure 5L', sellingPrice: 8500, margin: 70, status: 'ACTIVE', valid: true },
            { code: 'CARM-CER-30X30', name: 'Carrelage Céramique 30x30', sellingPrice: 12500, margin: 150, status: 'ACTIVE', valid: true },
            { code: 'TUY-PVC-50', name: 'Tuyau PVC Ø50mm', sellingPrice: 2800, margin: 90, status: 'ACTIVE', valid: true }
        ];
        
        displayImportResults(importedArticles, file.name);
    }, 2000);
}

function displayImportResults(articles, filename) {
    const validCount = articles.filter(a => a.valid).length;
    const errorCount = articles.length - validCount;
    
    document.getElementById('import-results').innerHTML = `
        <div style="background: white; border-radius: 8px; padding: 24px; border: 2px solid ${validCount === articles.length ? '#10B981' : '#F59E0B'};">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
                <i class="fa-solid fa-${validCount === articles.length ? 'check-circle' : 'exclamation-triangle'}" 
                   style="font-size: 32px; color: ${validCount === articles.length ? '#10B981' : '#F59E0B'};"></i>
                <div>
                    <div style="font-size: 18px; font-weight: 600; margin-bottom: 4px;">
                        Import ${validCount === articles.length ? 'Réussi' : 'Avec Avertissements'}
                    </div>
                    <div style="font-size: 14px; color: var(--gray-600);">
                        Fichier: ${filename}
                    </div>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px;">
                <div style="text-align: center; padding: 12px; background: var(--gray-50); border-radius: 6px;">
                    <div style="font-size: 24px; font-weight: 700; color: var(--primary-color);">${articles.length}</div>
                    <div style="font-size: 13px; color: var(--gray-600);">Lignes lues</div>
                </div>
                <div style="text-align: center; padding: 12px; background: #D1FAE5; border-radius: 6px;">
                    <div style="font-size: 24px; font-weight: 700; color: #059669;">${validCount}</div>
                    <div style="font-size: 13px; color: #059669;">Valides</div>
                </div>
                <div style="text-align: center; padding: 12px; background: ${errorCount > 0 ? '#FEE2E2' : 'var(--gray-50)'}; border-radius: 6px;">
                    <div style="font-size: 24px; font-weight: 700; color: ${errorCount > 0 ? '#DC2626' : 'var(--gray-600)'};">${errorCount}</div>
                    <div style="font-size: 13px; color: ${errorCount > 0 ? '#DC2626' : 'var(--gray-600)'};">Erreurs</div>
                </div>
            </div>
            
            ${validCount > 0 ? `
                <button class="btn btn-primary" style="width: 100%;" onclick="confirmImport(${JSON.stringify(articles).replace(/"/g, '&quot;')})">
                    <i class="fa-solid fa-check"></i>
                    Confirmer l'Import (${validCount} articles)
                </button>
            ` : ''}
        </div>
    `;
}

function confirmImport(articles) {
    selectedArticles = articles.filter(a => a.valid).map(a => {
        const article = availableArticles.find(av => av.code === a.code);
        return {
            ...article,
            sellingPrice: a.sellingPrice,
            margin: a.margin,
            status: a.status
        };
    });
    
    proceedToPricing();
}

function downloadTemplate() {
    alert('📥 Téléchargement du template Excel...\n\nEn production, un fichier Excel sera téléchargé.');
}

// ================================================
// MÉTHODE 4 : COPIER D'UNE LISTE
// ================================================

function initCopy() {
    renderCopyLists();
}

function renderCopyLists(searchTerm = '') {
    const container = document.getElementById('copy-lists-container');
    
    const filtered = otherPricelists.filter(pl => 
        !searchTerm ||
        pl.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pl.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    container.innerHTML = filtered.map(pricelist => `
        <div class="copy-source-card" data-pricelist="${pricelist.id}" onclick="selectCopySource('${pricelist.id}')">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div>
                    <div style="font-weight: 600; font-size: 16px; margin-bottom: 4px;">
                        ${pricelist.code}
                    </div>
                    <div style="color: var(--gray-600); margin-bottom: 8px;">
                        ${pricelist.name}
                    </div>
                    <div style="font-size: 13px; color: var(--gray-500);">
                        <i class="fa-solid fa-box"></i>
                        ${pricelist.articlesCount} articles
                    </div>
                </div>
                <i class="fa-solid fa-circle-check" style="font-size: 24px; color: var(--gray-300);"></i>
            </div>
        </div>
    `).join('');
}

function filterCopyLists() {
    const searchTerm = document.getElementById('copy-search').value;
    renderCopyLists(searchTerm);
}

function selectCopySource(pricelistId) {
    document.querySelectorAll('.copy-source-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`[data-pricelist="${pricelistId}"]`).classList.add('selected');
    
    // Simuler le chargement des articles de cette liste
    const sourcePricelist = otherPricelists.find(pl => pl.id === pricelistId);
    
    // Copier quelques articles (simulation)
    selectedArticles = availableArticles
        .filter(a => !a.inList)
        .slice(0, 3)
        .map(article => {
            const suggestedPrice = article.purchasePrice * 1.8;
            const marginAmount = suggestedPrice - article.purchasePrice;
            
            return {
                ...article,
                sellingPrice: suggestedPrice,
                marginAmount: marginAmount,  // Marge en XAF
                status: 'ACTIVE'
            };
        });
    
    const count = selectedArticles.length;
    document.getElementById('selected-count-copy').textContent = `(${count} articles)`;
    document.getElementById('btn-proceed-copy').disabled = count === 0;
}

// ================================================
// ÉTAPE DE TARIFICATION
// ================================================

function proceedToPricing() {
    if (selectedArticles.length === 0) {
        alert('⚠️ Aucun article sélectionné');
        return;
    }
    
    // Cacher les étapes précédentes
    document.querySelectorAll('.step-content').forEach(step => {
        step.classList.add('hidden');
    });
    
    // Afficher l'étape de tarification
    document.getElementById('step-pricing').classList.remove('hidden');
    document.getElementById('summary-panel').style.display = 'block';
    
    renderPricingIndividual();
    updateSummary();
}

function backToPreviousStep() {
    document.getElementById('step-pricing').classList.add('hidden');
    document.getElementById('summary-panel').style.display = 'none';
    
    switch(selectedMethod) {
        case 'browse':
            document.getElementById('step-browse').classList.remove('hidden');
            break;
        case 'family':
            document.getElementById('step-family').classList.remove('hidden');
            break;
        case 'import':
            document.getElementById('step-import').classList.remove('hidden');
            break;
        case 'copy':
            document.getElementById('step-copy').classList.remove('hidden');
            break;
    }
}

function switchPricingMode(mode) {
    document.querySelectorAll('.pricing-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
    
    document.querySelectorAll('.pricing-mode-content').forEach(content => {
        content.classList.add('hidden');
    });
    document.getElementById(`pricing-${mode}`).classList.remove('hidden');
}

function renderPricingIndividual() {
    const tbody = document.getElementById('pricing-individual-tbody');
    document.getElementById('pricing-articles-count').textContent = selectedArticles.length;
    
    tbody.innerHTML = selectedArticles.map((article, index) => {
        const marginPercent = article.purchasePrice > 0 
            ? ((article.sellingPrice - article.purchasePrice) / article.purchasePrice * 100).toFixed(1)
            : 0;
        
        return `
        <tr>
            <td>${index + 1}</td>
            <td>
                <div style="font-weight: 600;">${article.code}</div>
                <div style="font-size: 13px; color: var(--gray-600);">${article.name}</div>
            </td>
            <td>${article.purchasePrice.toLocaleString()}</td>
            <td>
                <input type="number" step="0.01" class="form-input" 
                       value="${article.sellingPrice}"
                       onchange="updateArticlePrice(${index}, this.value)"
                       style="padding: 6px 10px;">
            </td>
            <td>
                <div style="font-weight: 600; font-size: 14px;">${marginPercent}%</div>
                <input type="number" step="0.01" class="form-input"
                       value="${article.marginAmount.toFixed(2)}"
                       onchange="updateArticleMarginAmount(${index}, this.value)"
                       style="padding: 6px 10px; margin-top: 4px;" placeholder="XAF">
            </td>
            <td>
                <select class="form-input" style="padding: 6px 10px;" onchange="updateArticleStatus(${index}, this.value)">
                    <option value="ACTIVE" ${article.status === 'ACTIVE' ? 'selected' : ''}>Actif</option>
                    <option value="INACTIVE" ${article.status === 'INACTIVE' ? 'selected' : ''}>Inactif</option>
                </select>
            </td>
            <td>
                <button class="btn-icon btn-icon-danger" onclick="removeArticleFromSelection(${index})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
    `;
    }).join('');
}

function updateArticlePrice(index, price) {
    const article = selectedArticles[index];
    article.sellingPrice = parseFloat(price);
    article.marginAmount = article.sellingPrice - article.purchasePrice;
    renderPricingIndividual();
    updateSummary();
}

function updateArticleMarginAmount(index, marginAmount) {
    const article = selectedArticles[index];
    article.marginAmount = parseFloat(marginAmount);
    article.sellingPrice = article.purchasePrice + article.marginAmount;
    renderPricingIndividual();
    updateSummary();
}

function updateArticleStatus(index, status) {
    selectedArticles[index].status = status;
    updateSummary();
}

function removeArticleFromSelection(index) {
    if (confirm('Retirer cet article de la sélection?')) {
        selectedArticles.splice(index, 1);
        renderPricingIndividual();
        updateSummary();
        
        if (selectedArticles.length === 0) {
            backToPreviousStep();
        }
    }
}

function applyMarginToAll() {
    const marginStr = prompt('Appliquer quelle marge à tous les articles?\n\nMarge en XAF :');
    if (!marginStr) return;
    
    const marginAmount = parseFloat(marginStr);
    if (isNaN(marginAmount)) {
        alert('❌ Marge invalide');
        return;
    }
    
    selectedArticles.forEach(article => {
        article.marginAmount = marginAmount;
        article.sellingPrice = article.purchasePrice + marginAmount;
    });
    
    renderPricingIndividual();
    updateSummary();
    alert(`✅ Marge de ${marginAmount} XAF appliquée à ${selectedArticles.length} article(s)`);
}

function applyGlobalMargin() {
    const margin = parseFloat(document.getElementById('global-margin').value);
    const rounding = parseInt(document.getElementById('global-rounding').value);
    
    if (!margin || margin < 0) {
        document.getElementById('global-preview').style.display = 'none';
        return;
    }
    
    const preview = document.getElementById('global-preview-content');
    const examples = selectedArticles.slice(0, 3);
    
    preview.innerHTML = examples.map(article => {
        let price = article.purchasePrice * (1 + margin / 100);
        
        if (rounding !== 'none') {
            price = Math.round(price / rounding) * rounding;
        }
        
        return `
            <div style="padding: 8px 0; border-bottom: 1px solid var(--gray-200);">
                <div style="font-weight: 600; margin-bottom: 4px;">${article.code}</div>
                <div style="display: flex; justify-content: space-between; font-size: 13px;">
                    <span>PA: ${article.purchasePrice.toLocaleString()} XAF</span>
                    <span style="color: var(--primary-color); font-weight: 600;">→ PV: ${price.toLocaleString()} XAF</span>
                </div>
            </div>
        `;
    }).join('');
    
    document.getElementById('global-preview').style.display = 'block';
}

function applyFormulaRules() {
    alert('📊 Application des règles de formule...\n\nFonctionnalité à implémenter');
}

function updateSummary() {
    const summaryItems = document.getElementById('summary-items');
    document.getElementById('summary-count').textContent = selectedArticles.length;
    
    summaryItems.innerHTML = selectedArticles.map((article, index) => {
        const marginPercent = article.purchasePrice > 0 
            ? ((article.sellingPrice - article.purchasePrice) / article.purchasePrice * 100).toFixed(1)
            : 0;
        
        return `
        <div class="selected-article-item">
            <div>
                <div style="font-weight: 600; margin-bottom: 2px;">${article.code}</div>
                <div style="font-size: 13px; color: var(--gray-600);">
                    ${article.sellingPrice.toLocaleString()} XAF (${marginPercent}% / ${article.marginAmount.toLocaleString()} XAF)
                </div>
            </div>
            <span style="color: ${article.status === 'ACTIVE' ? '#10B981' : '#6B7280'};">
                ${article.status === 'ACTIVE' ? '🟢' : '⚪'}
            </span>
        </div>
    `;
    }).join('');
}

// ================================================
// VALIDATION ET AJOUT
// ================================================

function validateAndAdd() {
    if (selectedArticles.length === 0) {
        alert('⚠️ Aucun article à ajouter');
        return;
    }
    
    // Vérifier que tous les prix sont valides
    const invalidArticles = selectedArticles.filter(a => !a.sellingPrice || a.sellingPrice <= 0);
    if (invalidArticles.length > 0) {
        alert(`⚠️ ${invalidArticles.length} article(s) ont un prix invalide`);
        return;
    }
    
    console.log('✅ Ajout de', selectedArticles.length, 'articles à la liste', currentPricelist.id);
    console.log('Articles:', selectedArticles);
    
    alert(`✅ ${selectedArticles.length} article(s) ajouté(s) avec succès!\n\nVous allez être redirigé vers la liste des articles.`);
    
    setTimeout(() => {
        window.location.href = `./pricelists-items.html?id=${currentPricelist.id}`;
    }, 1000);
}

// ================================================
// AUTRES ACTIONS
// ================================================

function cancelAndGoBack() {
    if (selectedArticles.length > 0) {
        if (!confirm('⚠️ Abandonner l\'ajout des articles?\n\nToutes les sélections seront perdues.')) {
            return;
        }
    }
    
    window.location.href = `./pricelists-items.html?id=${currentPricelist.id}`;
}


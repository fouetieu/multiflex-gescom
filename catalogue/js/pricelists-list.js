// ================================================
// PRICELISTS-LIST.JS
// Gestion de la liste des listes de prix
// ================================================

// État global
let pricelists = [];
let filteredPricelists = [];
let currentPage = 1;
let itemsPerPage = 25;
let sortColumn = 'priority';
let sortDirection = 'asc';
let currentQuickFilter = 'all';
let pricelistToDelete = null;

// ================================================
// INITIALISATION
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation de la gestion des listes de prix...');
    loadPricelists();
});

// ================================================
// CHARGEMENT DES DONNÉES
// ================================================

function loadPricelists() {
    // Simuler le chargement depuis une API
    // En production, remplacer par un vrai appel API
    pricelists = generateMockPricelists();
    
    filteredPricelists = [...pricelists];
    updateStats();
    updateQuickFilterCounts();
    applyFilters();
}

function generateMockPricelists() {
    const today = new Date();
    const endOf2026 = new Date('2026-12-31');
    const endOf2025 = new Date('2025-12-31');
    const endOfQ4 = new Date('2025-11-15');
    
    return [
        {
            id: 'PL001',
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
        },
        {
            id: 'PL002',
            code: 'PROMO-BTP-Q4',
            name: 'Promo Matériaux BTP',
            description: 'Promotion spéciale Q4 pour les matériaux de construction',
            type: 'SALE',
            priority: 5,
            currency: 'XAF',
            startDate: '2025-10-15',
            endDate: '2025-11-15',
            status: 'ACTIVE',
            itemsCount: 48,
            partnersTarget: 'Tous clients BTP',
            specificPartners: [],
            tags: ['Promo'],
            createdAt: '2025-10-01T10:00:00',
            createdBy: 'Pierre NGONO'
        },
        {
            id: 'PL003',
            code: 'ACHAT-CIM-2026',
            name: 'Achats Ciment 2026',
            description: 'Conditions d\'achat ciment 2026',
            type: 'PURCHASE',
            priority: 15,
            currency: 'XAF',
            startDate: '2026-01-01',
            endDate: null,
            status: 'ACTIVE',
            itemsCount: 12,
            partnersTarget: 'CIMENCAM',
            specificPartners: ['CIMENCAM'],
            createdAt: '2025-11-20T14:00:00',
            createdBy: 'Marie AKONO'
        },
        {
            id: 'PL004',
            code: 'TARIF-TECH-2026',
            name: 'Techniciens 2026',
            description: 'Tarifs spéciaux techniciens',
            type: 'SALE',
            priority: 10,
            currency: 'XAF',
            startDate: '2026-01-01',
            endDate: '2026-12-31',
            status: 'DRAFT',
            itemsCount: 285,
            partnersTarget: 'PARTNER_TECHNICIAN',
            specificPartners: [],
            createdAt: '2025-10-18T11:30:00',
            createdBy: 'Pierre NGONO'
        },
        {
            id: 'PL005',
            code: 'STANDARD-2025',
            name: 'Tarif Standard 2025',
            description: 'Tarif standard pour tous partenaires',
            type: 'SALE',
            priority: 20,
            currency: 'XAF',
            startDate: '2025-01-01',
            endDate: '2025-12-31',
            status: 'ARCHIVED',
            itemsCount: 512,
            partnersTarget: 'Tous partenaires',
            specificPartners: [],
            createdAt: '2024-12-01T09:00:00',
            createdBy: 'Admin System'
        },
        {
            id: 'PL006',
            code: 'ACHAT-PEINTURE-2026',
            name: 'Achats Peinture 2026',
            description: 'Conditions d\'achat peintures',
            type: 'PURCHASE',
            priority: 12,
            currency: 'XAF',
            startDate: '2026-01-01',
            endDate: null,
            status: 'ACTIVE',
            itemsCount: 45,
            partnersTarget: 'CAMI PEINTURES',
            specificPartners: ['CAMI'],
            createdAt: '2025-11-15T10:20:00',
            createdBy: 'Marie AKONO'
        }
    ];
}

// ================================================
// MISE À JOUR DES STATISTIQUES
// ================================================

function updateStats() {
    const total = pricelists.length;
    const sale = pricelists.filter(p => p.type === 'SALE').length;
    const purchase = pricelists.filter(p => p.type === 'PURCHASE').length;
    const active = pricelists.filter(p => p.status === 'ACTIVE').length;
    
    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-sale').textContent = sale;
    document.getElementById('stat-purchase').textContent = purchase;
    document.getElementById('stat-active').textContent = active;
}

function updateQuickFilterCounts() {
    const all = pricelists.length;
    const sale = pricelists.filter(p => p.type === 'SALE').length;
    const purchase = pricelists.filter(p => p.type === 'PURCHASE').length;
    const active = pricelists.filter(p => p.status === 'ACTIVE').length;
    const draft = pricelists.filter(p => p.status === 'DRAFT').length;
    
    document.getElementById('count-all').textContent = all;
    document.getElementById('count-sale').textContent = sale;
    document.getElementById('count-purchase').textContent = purchase;
    document.getElementById('count-active').textContent = active;
    document.getElementById('count-draft').textContent = draft;
}

// ================================================
// FILTRES RAPIDES
// ================================================

function applyQuickFilter(filter) {
    currentQuickFilter = filter;
    currentPage = 1;
    
    // Mettre à jour l'UI
    document.querySelectorAll('.quick-filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
    
    // Réinitialiser les filtres avancés
    document.getElementById('filter-type').value = '';
    document.getElementById('filter-status').value = '';
    
    applyFilters();
}

// ================================================
// FILTRAGE ET RECHERCHE
// ================================================

function applyFilters() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const typeFilter = document.getElementById('filter-type').value;
    const statusFilter = document.getElementById('filter-status').value;
    
    filteredPricelists = pricelists.filter(pricelist => {
        // Recherche textuelle
        const matchesSearch = !searchTerm || 
            pricelist.code.toLowerCase().includes(searchTerm) ||
            pricelist.name.toLowerCase().includes(searchTerm) ||
            pricelist.description?.toLowerCase().includes(searchTerm);
        
        // Filtre quick
        let matchesQuickFilter = true;
        if (currentQuickFilter === 'sale') {
            matchesQuickFilter = pricelist.type === 'SALE';
        } else if (currentQuickFilter === 'purchase') {
            matchesQuickFilter = pricelist.type === 'PURCHASE';
        } else if (currentQuickFilter === 'active') {
            matchesQuickFilter = pricelist.status === 'ACTIVE';
        } else if (currentQuickFilter === 'draft') {
            matchesQuickFilter = pricelist.status === 'DRAFT';
        }
        
        // Filtres avancés
        const matchesType = !typeFilter || pricelist.type === typeFilter;
        const matchesStatus = !statusFilter || pricelist.status === statusFilter;
        
        return matchesSearch && matchesQuickFilter && matchesType && matchesStatus;
    });
    
    renderTable();
    renderPagination();
}

function resetFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('filter-type').value = '';
    document.getElementById('filter-status').value = '';
    currentQuickFilter = 'all';
    
    document.querySelectorAll('.quick-filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('[data-filter="all"]').classList.add('active');
    
    currentPage = 1;
    applyFilters();
}

// ================================================
// TRI
// ================================================

function sortTable(column) {
    if (sortColumn === column) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn = column;
        sortDirection = 'asc';
    }
    
    filteredPricelists.sort((a, b) => {
        let aVal = a[column];
        let bVal = b[column];
        
        if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
        }
        
        if (sortDirection === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });
    
    renderTable();
}

// ================================================
// AFFICHAGE DU TABLEAU
// ================================================

function renderTable() {
    const tbody = document.getElementById('table-body');
    const emptyState = document.getElementById('empty-state');
    
    if (filteredPricelists.length === 0) {
        tbody.innerHTML = '';
        emptyState.classList.remove('hidden');
        document.getElementById('pagination').style.display = 'none';
        return;
    }
    
    emptyState.classList.add('hidden');
    document.getElementById('pagination').style.display = 'flex';
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredPricelists.length);
    const pageData = filteredPricelists.slice(startIndex, endIndex);
    
    tbody.innerHTML = pageData.map(pricelist => {
        const statusInfo = getStatusInfo(pricelist);
        const typeClass = pricelist.type === 'SALE' ? 'badge-type-sale' : 'badge-type-purchase';
        const validityText = getValidityText(pricelist);
        
        return `
            <tr>
                <td>
                    <input type="checkbox" class="row-checkbox" data-id="${pricelist.id}">
                </td>
                <td>
                    <div style="font-weight: 600;">${pricelist.code}</div>
                </td>
                <td>
                    <div style="font-weight: 600; margin-bottom: 4px;">${pricelist.name}</div>
                    <div class="pricelist-meta">
                        <span class="pricelist-meta-item">
                            <i class="fa-solid fa-box"></i>
                            ${pricelist.itemsCount} articles
                        </span>
                        <span class="pricelist-meta-item">
                            <i class="fa-solid fa-users"></i>
                            ${pricelist.partnersTarget}
                        </span>
                        ${pricelist.tags ? `<span class="pricelist-meta-item" style="color: #F59E0B;">
                            <i class="fa-solid fa-tag"></i>
                            ${pricelist.tags.join(', ')}
                        </span>` : ''}
                    </div>
                </td>
                <td class="text-center">
                    <span class="${typeClass}">${pricelist.type === 'SALE' ? 'VENTE' : 'ACHAT'}</span>
                </td>
                <td class="text-center">
                    <span class="priority-badge">${pricelist.priority}</span>
                    <div style="font-size: 12px; color: var(--gray-500); margin-top: 4px;">${pricelist.currency}</div>
                </td>
                <td>
                    <div style="font-size: 13px;">
                        ${formatDate(pricelist.startDate)} -<br>
                        ${pricelist.endDate ? formatDate(pricelist.endDate) : '∞'}
                    </div>
                    ${validityText}
                </td>
                <td class="text-center">
                    <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                        <span class="status-indicator status-${statusInfo.class}"></span>
                        <span style="font-weight: 600;">${statusInfo.label}</span>
                    </div>
                    ${statusInfo.sublabel ? `<div style="font-size: 12px; color: var(--gray-500); margin-top: 4px;">${statusInfo.sublabel}</div>` : ''}
                </td>
                <td class="text-center">
                    <div class="action-buttons">
                        <button class="btn-icon" onclick="viewPricelist('${pricelist.id}')" title="Voir">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        <button class="btn-icon" onclick="editPricelist('${pricelist.id}')" title="Modifier">
                            <i class="fa-solid fa-edit"></i>
                        </button>
                        <button class="btn-icon" onclick="duplicatePricelist('${pricelist.id}')" title="Dupliquer">
                            <i class="fa-solid fa-copy"></i>
                        </button>
                        <button class="btn-icon btn-icon-danger" onclick="openDeleteModal('${pricelist.id}')" title="Supprimer">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// ================================================
// HELPERS
// ================================================

function getStatusInfo(pricelist) {
    const today = new Date();
    const startDate = new Date(pricelist.startDate);
    const endDate = pricelist.endDate ? new Date(pricelist.endDate) : null;
    
    if (pricelist.status === 'DRAFT') {
        return { class: 'draft', label: 'Brouillon', sublabel: 'Draft' };
    }
    
    if (pricelist.status === 'ARCHIVED') {
        return { class: 'archived', label: 'Archivé', sublabel: 'Archived' };
    }
    
    if (endDate && endDate < today) {
        return { class: 'expired', label: 'Expiré', sublabel: 'Expired' };
    }
    
    return { class: 'active', label: 'Actif', sublabel: '' };
}

function getValidityText(pricelist) {
    const today = new Date();
    const endDate = pricelist.endDate ? new Date(pricelist.endDate) : null;
    
    if (!endDate) return '';
    
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
        return `<div style="font-size: 12px; color: #EF4444; margin-top: 4px;">
            <i class="fa-solid fa-exclamation-circle"></i> Expiré
        </div>`;
    }
    
    if (diffDays <= 30) {
        return `<div style="font-size: 12px; color: #F59E0B; margin-top: 4px;">
            <i class="fa-solid fa-clock"></i> ${diffDays} jours restants
        </div>`;
    }
    
    return '';
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

// ================================================
// PAGINATION
// ================================================

function renderPagination() {
    const totalPages = Math.ceil(filteredPricelists.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, filteredPricelists.length);
    
    document.getElementById('pagination-info').textContent = 
        `Affichage de ${startIndex} à ${endIndex} sur ${filteredPricelists.length} listes`;
    
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
    const totalPages = Math.ceil(filteredPricelists.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    renderTable();
    renderPagination();
}

// ================================================
// ACTIONS
// ================================================

function viewPricelist(id) {
    window.location.href = `./pricelists-edit.html?id=${id}`;
}

function editPricelist(id) {
    window.location.href = `./pricelists-edit.html?id=${id}`;
}

function duplicatePricelist(id) {
    const pricelist = pricelists.find(p => p.id === id);
    if (!pricelist) return;
    
    if (confirm(`Dupliquer la liste "${pricelist.name}" ?`)) {
        console.log('Duplication de la liste:', id);
        alert('Fonctionnalité de duplication à implémenter');
    }
}

function openDeleteModal(id) {
    pricelistToDelete = id;
    const pricelist = pricelists.find(p => p.id === id);
    
    if (pricelist) {
        document.getElementById('delete-pricelist-name').textContent = 
            `${pricelist.code} - ${pricelist.name}`;
        document.getElementById('delete-modal').style.display = 'flex';
    }
}

function closeDeleteModal() {
    pricelistToDelete = null;
    document.getElementById('delete-modal').style.display = 'none';
}

function confirmDelete() {
    if (!pricelistToDelete) return;
    
    console.log('Suppression de la liste:', pricelistToDelete);
    
    // Simuler la suppression
    pricelists = pricelists.filter(p => p.id !== pricelistToDelete);
    
    closeDeleteModal();
    updateStats();
    updateQuickFilterCounts();
    applyFilters();
    
    alert('Liste de prix supprimée avec succès');
}

// ================================================
// SÉLECTION MULTIPLE
// ================================================

function toggleSelectAll() {
    const isChecked = document.getElementById('select-all').checked;
    document.querySelectorAll('.row-checkbox').forEach(cb => {
        cb.checked = isChecked;
    });
}

// ================================================
// IMPORT / EXPORT
// ================================================

function importPricelists() {
    alert('Fonctionnalité d\'import à implémenter');
}

function exportPricelists() {
    alert('Fonctionnalité d\'export à implémenter');
}








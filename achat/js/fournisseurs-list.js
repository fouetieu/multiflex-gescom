// ================================================
// FOURNISSEURS-LIST.JS
// Gestion de la liste des fournisseurs
// ================================================

// État global
let suppliers = [];
let filteredSuppliers = [];
let currentPage = 1;
let itemsPerPage = 25;
let sortColumn = 'score';
let sortDirection = 'desc';
let currentQuickFilter = 'all';
let supplierToAction = null;

// ================================================
// INITIALISATION
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation de la gestion des fournisseurs...');
    loadSuppliers();
});

// ================================================
// CHARGEMENT DES DONNÉES
// ================================================

function loadSuppliers() {
    // Simuler le chargement depuis une API
    suppliers = generateMockSuppliers();
    
    filteredSuppliers = [...suppliers];
    updateStats();
    updateQuickFilterCounts();
    applyFilters();
}

function generateMockSuppliers() {
    return [
        {
            id: 'FOU-2024-001',
            code: 'FOU-2024-001',
            name: 'ABC SARL',
            category: 'RAW_MATERIALS',
            isInternal: false,
            nui: 'M01234567890',
            rccm: 'YA/DLA/2020/B/1234',
            contactName: 'Jean DUPONT',
            contactPhone: '+237 699 123 456',
            contactEmail: 'contact@abc-sarl.cm',
            status: 'ACTIVE',
            score: {
                quality: 85,
                delivery: 90,
                price: 75,
                service: 88,
                global: 84.5
            },
            createdAt: '2024-01-15',
            lastOrderDate: '2024-01-10',
            totalOrders: 24,
            totalAmount: 15000000
        },
        {
            id: 'FOU-2024-002',
            code: 'FOU-2024-002',
            name: 'IOLA DISTRIBUTION',
            category: 'FINISHED_GOODS',
            isInternal: true,
            internalCompany: 'IOLA DISTRIBUTION',
            nui: 'M09876543210',
            contactName: 'Marie NGONO',
            contactPhone: '+237 699 987 654',
            contactEmail: 'marie.ngono@iola.cm',
            status: 'ACTIVE',
            score: {
                quality: 95,
                delivery: 98,
                price: 92,
                service: 95,
                global: 95
            },
            createdAt: '2023-12-01',
            lastOrderDate: '2024-01-14',
            totalOrders: 48,
            totalAmount: 28000000
        },
        {
            id: 'FOU-2024-003',
            code: 'FOU-2024-003',
            name: 'XYZ TRADING Ltd',
            category: 'RAW_MATERIALS',
            isInternal: false,
            nui: 'M11223344556',
            rccm: 'YA/DLA/2019/B/5678',
            contactName: 'Paul KAMGA',
            contactPhone: '+237 677 111 222',
            contactEmail: 'info@xyz-trading.cm',
            status: 'ACTIVE',
            score: {
                quality: 72,
                delivery: 68,
                price: 85,
                service: 70,
                global: 73.75
            },
            createdAt: '2023-11-20',
            lastOrderDate: '2024-01-08',
            totalOrders: 18,
            totalAmount: 8500000
        },
        {
            id: 'FOU-2023-045',
            code: 'FOU-2023-045',
            name: 'CIMENCAM',
            category: 'RAW_MATERIALS',
            isInternal: false,
            nui: 'M99887766554',
            rccm: 'YA/DLA/2015/B/9999',
            contactName: 'Sophie MBARGA',
            contactPhone: '+237 699 555 777',
            contactEmail: 'commercial@cimencam.cm',
            status: 'ACTIVE',
            score: {
                quality: 90,
                delivery: 85,
                price: 78,
                service: 82,
                global: 83.75
            },
            createdAt: '2023-06-10',
            lastOrderDate: '2024-01-12',
            totalOrders: 52,
            totalAmount: 45000000
        },
        {
            id: 'FOU-2023-012',
            code: 'FOU-2023-012',
            name: 'CAMI PEINTURES',
            category: 'RAW_MATERIALS',
            isInternal: false,
            nui: 'M55443322110',
            rccm: 'YA/DLA/2018/B/3456',
            contactName: 'Pierre ESSOMBA',
            contactPhone: '+237 677 888 999',
            contactEmail: 'ventes@cami.cm',
            status: 'ACTIVE',
            score: {
                quality: 88,
                delivery: 92,
                price: 80,
                service: 85,
                global: 86.25
            },
            createdAt: '2023-02-15',
            lastOrderDate: '2024-01-11',
            totalOrders: 36,
            totalAmount: 22000000
        },
        {
            id: 'FOU-2024-004',
            code: 'FOU-2024-004',
            name: 'FOURNI-TECH',
            category: 'EQUIPMENT',
            isInternal: false,
            nui: 'M66778899001',
            rccm: 'YA/DLA/2021/B/7890',
            contactName: 'André TCHUENTE',
            contactPhone: '+237 699 444 333',
            contactEmail: 'contact@fournitech.cm',
            status: 'BLOCKED',
            score: {
                quality: 45,
                delivery: 40,
                price: 70,
                service: 35,
                global: 47.5
            },
            blockReason: 'QUALITE',
            blockDate: '2024-01-10',
            createdAt: '2024-01-05',
            lastOrderDate: '2024-01-08',
            totalOrders: 3,
            totalAmount: 1200000
        },
        {
            id: 'FOU-2023-089',
            code: 'FOU-2023-089',
            name: 'IOLA MANUFACTURE',
            category: 'FINISHED_GOODS',
            isInternal: true,
            internalCompany: 'IOLA MANUFACTURE',
            nui: 'M12398745632',
            contactName: 'Thomas NKOLO',
            contactPhone: '+237 699 321 654',
            contactEmail: 'thomas.nkolo@iola.cm',
            status: 'ACTIVE',
            score: {
                quality: 92,
                delivery: 95,
                price: 90,
                service: 93,
                global: 92.5
            },
            createdAt: '2023-09-01',
            lastOrderDate: '2024-01-13',
            totalOrders: 32,
            totalAmount: 18500000
        },
        {
            id: 'FOU-2023-067',
            code: 'FOU-2023-067',
            name: 'DEF & CO',
            category: 'SERVICES',
            isInternal: false,
            nui: 'M78945612301',
            rccm: 'YA/DLA/2020/B/4567',
            contactName: 'Françoise MANGA',
            contactPhone: '+237 677 222 111',
            contactEmail: 'f.manga@defco.cm',
            status: 'ACTIVE',
            score: {
                quality: 78,
                delivery: 82,
                price: 75,
                service: 80,
                global: 78.75
            },
            createdAt: '2023-07-20',
            lastOrderDate: '2024-01-09',
            totalOrders: 15,
            totalAmount: 6800000
        }
    ];
}

// ================================================
// MISE À JOUR DES STATISTIQUES
// ================================================

function updateStats() {
    const total = suppliers.length;
    const active = suppliers.filter(s => s.status === 'ACTIVE').length;
    const blocked = suppliers.filter(s => s.status === 'BLOCKED').length;
    const avgScore = (suppliers.reduce((sum, s) => sum + s.score.global, 0) / total).toFixed(1);
    
    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-active').textContent = active;
    document.getElementById('stat-score').textContent = avgScore + '/100';
    document.getElementById('stat-blocked').textContent = blocked;
}

function updateQuickFilterCounts() {
    const all = suppliers.length;
    const active = suppliers.filter(s => s.status === 'ACTIVE').length;
    const internal = suppliers.filter(s => s.isInternal).length;
    const external = suppliers.filter(s => !s.isInternal).length;
    const blocked = suppliers.filter(s => s.status === 'BLOCKED').length;
    
    document.getElementById('count-all').textContent = all;
    document.getElementById('count-active').textContent = active;
    document.getElementById('count-internal').textContent = internal;
    document.getElementById('count-external').textContent = external;
    document.getElementById('count-blocked').textContent = blocked;
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
    document.getElementById('filter-category').value = '';
    document.getElementById('filter-status').value = '';
    
    applyFilters();
}

// ================================================
// FILTRAGE ET RECHERCHE
// ================================================

function applyFilters() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const categoryFilter = document.getElementById('filter-category').value;
    const statusFilter = document.getElementById('filter-status').value;
    
    filteredSuppliers = suppliers.filter(supplier => {
        // Recherche textuelle
        const matchesSearch = !searchTerm || 
            supplier.code.toLowerCase().includes(searchTerm) ||
            supplier.name.toLowerCase().includes(searchTerm) ||
            supplier.nui?.toLowerCase().includes(searchTerm) ||
            supplier.contactName?.toLowerCase().includes(searchTerm);
        
        // Filtre quick
        let matchesQuickFilter = true;
        if (currentQuickFilter === 'active') {
            matchesQuickFilter = supplier.status === 'ACTIVE';
        } else if (currentQuickFilter === 'internal') {
            matchesQuickFilter = supplier.isInternal;
        } else if (currentQuickFilter === 'external') {
            matchesQuickFilter = !supplier.isInternal;
        } else if (currentQuickFilter === 'blocked') {
            matchesQuickFilter = supplier.status === 'BLOCKED';
        }
        
        // Filtres avancés
        const matchesCategory = !categoryFilter || supplier.category === categoryFilter;
        const matchesStatus = !statusFilter || supplier.status === statusFilter;
        
        return matchesSearch && matchesQuickFilter && matchesCategory && matchesStatus;
    });
    
    renderTable();
    renderPagination();
}

function resetFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('filter-category').value = '';
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
    
    filteredSuppliers.sort((a, b) => {
        let aVal = column === 'score' ? a.score.global : a[column];
        let bVal = column === 'score' ? b.score.global : b[column];
        
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
    
    if (filteredSuppliers.length === 0) {
        tbody.innerHTML = '';
        emptyState.classList.remove('hidden');
        document.getElementById('pagination').style.display = 'none';
        return;
    }
    
    emptyState.classList.add('hidden');
    document.getElementById('pagination').style.display = 'flex';
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredSuppliers.length);
    const pageData = filteredSuppliers.slice(startIndex, endIndex);
    
    tbody.innerHTML = pageData.map(supplier => {
        const typeClass = supplier.isInternal ? 'type-internal' : 'type-external';
        const typeLabel = supplier.isInternal ? '🏢 Interne' : '🚚 Externe';
        const categoryLabel = getCategoryLabel(supplier.category);
        const statusInfo = getStatusInfo(supplier);
        const rating = renderRating(supplier.score.global);
        
        return `
            <tr>
                <td>
                    <input type="checkbox" class="row-checkbox" data-id="${supplier.id}">
                </td>
                <td>
                    <div style="font-weight: 600; font-size: 13px;">${supplier.code}</div>
                </td>
                <td>
                    <div style="font-weight: 600; margin-bottom: 4px;">${supplier.name}</div>
                    <div class="supplier-meta">
                        ${supplier.isInternal ? `
                            <span class="supplier-meta-item" style="color: #10B981;">
                                <i class="fa-solid fa-building"></i>
                                ${supplier.internalCompany}
                            </span>
                        ` : `
                            <span class="supplier-meta-item">
                                <i class="fa-solid fa-id-card"></i>
                                NUI: ${supplier.nui}
                            </span>
                        `}
                    </div>
                </td>
                <td class="text-center">
                    <span class="supplier-type-badge ${typeClass}">${typeLabel}</span>
                </td>
                <td class="text-center">
                    <div style="font-size: 13px; color: var(--gray-700);">${categoryLabel}</div>
                </td>
                <td class="text-center">
                    <div class="supplier-rating">
                        ${rating}
                    </div>
                    <div class="score-badge">${supplier.score.global}/100</div>
                </td>
                <td>
                    <div style="font-weight: 500; font-size: 13px;">${supplier.contactName}</div>
                    <div style="font-size: 12px; color: var(--gray-500); margin-top: 2px;">
                        <i class="fa-solid fa-phone"></i> ${supplier.contactPhone}
                    </div>
                </td>
                <td class="text-center">
                    <div class="status-badge-table">
                        <span class="status-dot ${statusInfo.class}"></span>
                        <span style="font-weight: 600; font-size: 13px;">${statusInfo.label}</span>
                    </div>
                    ${supplier.status === 'BLOCKED' ? `
                        <div style="font-size: 11px; color: #F59E0B; margin-top: 4px;">
                            <i class="fa-solid fa-exclamation-triangle"></i> ${supplier.blockReason}
                        </div>
                    ` : ''}
                </td>
                <td class="text-center">
                    <div class="action-buttons">
                        <button class="btn-icon" onclick="viewSupplier('${supplier.id}')" title="Voir">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        <button class="btn-icon" onclick="editSupplier('${supplier.id}')" title="Modifier">
                            <i class="fa-solid fa-edit"></i>
                        </button>
                        <button class="btn-icon" onclick="evaluateSupplier('${supplier.id}')" title="Évaluer">
                            <i class="fa-solid fa-star"></i>
                        </button>
                        ${supplier.status !== 'BLOCKED' ? `
                            <button class="btn-icon btn-icon-danger" onclick="openBlockModal('${supplier.id}')" title="Bloquer">
                                <i class="fa-solid fa-ban"></i>
                            </button>
                        ` : `
                            <button class="btn-icon" onclick="unblockSupplier('${supplier.id}')" title="Débloquer" style="color: #10B981;">
                                <i class="fa-solid fa-unlock"></i>
                            </button>
                        `}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// ================================================
// HELPERS
// ================================================

function getCategoryLabel(category) {
    const labels = {
        'RAW_MATERIALS': 'Matières Premières',
        'FINISHED_GOODS': 'Produits Finis',
        'SERVICES': 'Services',
        'EQUIPMENT': 'Équipements'
    };
    return labels[category] || category;
}

function getStatusInfo(supplier) {
    if (supplier.status === 'ACTIVE') {
        return { class: 'active', label: 'Actif' };
    } else if (supplier.status === 'BLOCKED') {
        return { class: 'blocked', label: 'Bloqué' };
    } else {
        return { class: 'inactive', label: 'Inactif' };
    }
}

function renderRating(score) {
    const fullStars = Math.floor(score / 20);
    const emptyStars = 5 - fullStars;
    
    let html = '';
    for (let i = 0; i < fullStars; i++) {
        html += '<i class="fa-solid fa-star star-filled"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        html += '<i class="fa-solid fa-star star-empty"></i>';
    }
    
    return html;
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
    const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, filteredSuppliers.length);
    
    document.getElementById('pagination-info').textContent = 
        `Affichage de ${startIndex} à ${endIndex} sur ${filteredSuppliers.length} fournisseurs`;
    
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
    const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    renderTable();
    renderPagination();
}

// ================================================
// ACTIONS
// ================================================

function viewSupplier(id) {
    window.location.href = `./fournisseur-view.html?id=${id}`;
}

function editSupplier(id) {
    window.location.href = `./fournisseur-edit.html?id=${id}`;
}

function evaluateSupplier(id) {
    window.location.href = `./fournisseur-evaluate.html?id=${id}`;
}

function openBlockModal(id) {
    supplierToAction = id;
    const supplier = suppliers.find(s => s.id === id);
    
    if (supplier) {
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        const modalFooter = document.getElementById('modal-footer');
        
        modalTitle.textContent = 'Bloquer le fournisseur';
        
        modalBody.innerHTML = `
            <p>Êtes-vous sûr de vouloir bloquer ce fournisseur ?</p>
            <p style="color: var(--gray-600); margin-top: 12px; font-size: 14px;">
                <strong>${supplier.name}</strong>
            </p>
            <div style="margin-top: 16px;">
                <label class="form-label required">Motif du blocage</label>
                <select class="form-select" id="block-reason">
                    <option value="">Sélectionner un motif</option>
                    <option value="IMPAYES">Impayés</option>
                    <option value="QUALITE">Qualité</option>
                    <option value="ADMINISTRATIF">Administratif</option>
                    <option value="FRAUDE">Fraude</option>
                    <option value="AUTRE">Autre</option>
                </select>
            </div>
            <div style="margin-top: 12px;">
                <label class="form-label">Détails</label>
                <textarea class="form-textarea" id="block-details" placeholder="Précisez le motif du blocage..."></textarea>
            </div>
            <div class="warning-box" style="margin-top: 16px;">
                <i class="fa-solid fa-exclamation-triangle"></i>
                Les commandes en cours seront maintenues mais aucune nouvelle commande ne sera possible.
            </div>
        `;
        
        modalFooter.innerHTML = `
            <button class="btn btn-secondary" onclick="closeActionModal()">Annuler</button>
            <button class="btn btn-danger" onclick="confirmBlockSupplier()">
                <i class="fa-solid fa-ban"></i>
                Bloquer
            </button>
        `;
        
        document.getElementById('action-modal').style.display = 'flex';
    }
}

function confirmBlockSupplier() {
    const reason = document.getElementById('block-reason').value;
    const details = document.getElementById('block-details').value;
    
    if (!reason) {
        alert('Veuillez sélectionner un motif de blocage');
        return;
    }
    
    console.log('Blocage fournisseur:', supplierToAction, reason, details);
    
    // Simuler le blocage
    const supplier = suppliers.find(s => s.id === supplierToAction);
    if (supplier) {
        supplier.status = 'BLOCKED';
        supplier.blockReason = reason;
        supplier.blockDetails = details;
        supplier.blockDate = new Date().toISOString().split('T')[0];
    }
    
    closeActionModal();
    updateStats();
    updateQuickFilterCounts();
    applyFilters();
    
    alert('Fournisseur bloqué avec succès');
}

function unblockSupplier(id) {
    if (confirm('Débloquer ce fournisseur ?')) {
        console.log('Déblocage fournisseur:', id);
        
        const supplier = suppliers.find(s => s.id === id);
        if (supplier) {
            supplier.status = 'ACTIVE';
            delete supplier.blockReason;
            delete supplier.blockDetails;
            delete supplier.blockDate;
        }
        
        updateStats();
        updateQuickFilterCounts();
        applyFilters();
        
        alert('Fournisseur débloqué avec succès');
    }
}

function closeActionModal() {
    supplierToAction = null;
    document.getElementById('action-modal').style.display = 'none';
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

function importSuppliers() {
    alert('Fonctionnalité d\'import à implémenter');
}

function exportSuppliers() {
    alert('Fonctionnalité d\'export à implémenter');
}


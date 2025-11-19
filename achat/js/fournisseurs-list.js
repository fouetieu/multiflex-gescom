// ================================================
// FOURNISSEURS-LIST.JS
// Gestion de la liste des fournisseurs - Conforme aux spécifications ÉCRAN 8
// ================================================

// État global
let suppliers = [];
let filteredSuppliers = [];
let currentPage = 1;
let itemsPerPage = 20;
let sortColumn = 'code';
let sortDirection = 'asc';
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
            id: 'SUPP-001',
            code: 'SUPP-001',
            name: 'ChemTech SARL',
            type: 'EXTERNAL',
            taxId: 'P087201234567W',
            tradeRegister: 'CM-DLA-2015-B-1234',
            taxRegime: 'REEL',
            vatRecoverable: true,
            contactName: 'M. Paul NGUEMA',
            contactPhone: '+237 677 888 999',
            contactEmail: 'p.nguema@chemtech.cm',
            status: 'ACTIVE',
            certificate: {
                type: 'NON_LIABILITY_CERTIFICATE',
                number: 'CNR-2024-12345',
                expiryDate: '2024-01-28',
                status: 'EXPIRING_SOON',
                daysToExpiry: -8
            },
            score: {
                overall: 92,
                delivery: 18,
                quality: 19,
                price: 17,
                communication: 18,
                documentation: 20,
                grade: 'A'
            },
            createdAt: '2023-03-15',
            lastOrderDate: '2024-01-10',
            totalOrders: 156,
            totalAmount: 127450000
        },
        {
            id: 'SUPP-002',
            code: 'SUPP-002',
            name: 'GlobalTrade SA',
            type: 'EXTERNAL',
            taxId: 'P098765432109W',
            tradeRegister: 'CM-DLA-2018-B-5678',
            taxRegime: 'REEL',
            vatRecoverable: true,
            contactName: 'Mme Sylvie BELLA',
            contactPhone: '+237 699 555 777',
            contactEmail: 'contact@globaltrade.cm',
            status: 'ACTIVE',
            certificate: {
                type: 'NON_LIABILITY_CERTIFICATE',
                number: 'CNR-2024-67890',
                expiryDate: '2024-06-15',
                status: 'VALID',
                daysToExpiry: 150
            },
            score: {
                overall: 78,
                delivery: 15,
                quality: 16,
                price: 18,
                communication: 14,
                documentation: 15,
                grade: 'B'
            },
            createdAt: '2023-08-22',
            lastOrderDate: '2024-01-12',
            totalOrders: 89,
            totalAmount: 65230000
        },
        {
            id: 'SUPP-003',
            code: 'SUPP-003',
            name: 'MetalPro Industriel',
            type: 'EXTERNAL',
            taxId: 'P011223344556W',
            tradeRegister: 'CM-DLA-2020-B-9012',
            taxRegime: 'SIMPLIFIE',
            vatRecoverable: false,
            contactName: 'M. André FOTSO',
            contactPhone: '+237 677 111 333',
            contactEmail: 'contact@metalpro.cm',
            status: 'SUSPENDED',
            certificate: {
                type: 'NON_LIABILITY_CERTIFICATE',
                number: 'CNR-2024-11111',
                expiryDate: '2024-01-15',
                status: 'EXPIRED',
                daysToExpiry: -15
            },
            score: {
                overall: 45,
                delivery: 8,
                quality: 9,
                price: 12,
                communication: 7,
                documentation: 9,
                grade: 'C'
            },
            createdAt: '2023-05-10',
            lastOrderDate: '2023-12-20',
            totalOrders: 34,
            totalAmount: 18750000
        },
        {
            id: 'SUPP-004',
            code: 'SUPP-004',
            name: 'IOLA Transport',
            type: 'INTERNAL',
            internalCompany: 'IOLA TRANSPORT',
            taxId: 'M12345678901234',
            taxRegime: 'REEL',
            vatRecoverable: true,
            contactName: 'Société du groupe',
            contactPhone: '+237 699 000 111',
            contactEmail: 'transport@iola.cm',
            status: 'ACTIVE',
            certificate: {
                type: 'INTERNAL',
                status: 'N/A'
            },
            score: {
                overall: 98,
                delivery: 20,
                quality: 20,
                price: 19,
                communication: 19,
                documentation: 20,
                grade: 'A'
            },
            createdAt: '2022-01-01',
            lastOrderDate: '2024-01-14',
            totalOrders: 312,
            totalAmount: 245800000
        },
        {
            id: 'SUPP-005',
            code: 'SUPP-005',
            name: 'TechServices SARL',
            type: 'EXTERNAL',
            taxId: 'P055566677788W',
            tradeRegister: 'CM-DLA-2021-B-3333',
            taxRegime: 'REEL',
            vatRecoverable: true,
            contactName: 'M. Thomas NKOLO',
            contactPhone: '+237 677 999 888',
            contactEmail: 'info@techservices.cm',
            status: 'ACTIVE',
            certificate: {
                type: 'NON_LIABILITY_CERTIFICATE',
                number: 'CNR-2024-22222',
                expiryDate: '2024-02-28',
                status: 'EXPIRING_SOON',
                daysToExpiry: 35
            },
            score: {
                overall: 85,
                delivery: 17,
                quality: 17,
                price: 16,
                communication: 18,
                documentation: 17,
                grade: 'B'
            },
            createdAt: '2023-06-05',
            lastOrderDate: '2024-01-11',
            totalOrders: 67,
            totalAmount: 42350000
        },
        {
            id: 'SUPP-006',
            code: 'SUPP-006',
            name: 'EquipPro SARL',
            type: 'EXTERNAL',
            taxId: 'P066677788899W',
            tradeRegister: 'CM-DLA-2019-B-4444',
            taxRegime: 'LIBERATOIRE',
            vatRecoverable: false,
            contactName: 'Mme Francine MBARGA',
            contactPhone: '+237 699 222 444',
            contactEmail: 'contact@equippro.cm',
            status: 'BLOCKED',
            blockReason: 'Documents expirés',
            certificate: {
                type: 'NON_LIABILITY_CERTIFICATE',
                number: 'CNR-2023-99999',
                expiryDate: '2023-11-30',
                status: 'EXPIRED',
                daysToExpiry: -60
            },
            score: {
                overall: 32,
                delivery: 6,
                quality: 5,
                price: 8,
                communication: 6,
                documentation: 7,
                grade: 'D'
            },
            createdAt: '2023-04-12',
            lastOrderDate: '2023-10-15',
            totalOrders: 12,
            totalAmount: 8900000
        }
    ];
}

// ================================================
// MISE À JOUR DES STATISTIQUES
// ================================================

function updateStats() {
    const total = suppliers.length;
    const active = suppliers.filter(s => s.status === 'ACTIVE').length;
    const suspended = suppliers.filter(s => s.status === 'SUSPENDED').length;
    const blocked = suppliers.filter(s => s.status === 'BLOCKED').length;
    const certified = suppliers.filter(s => s.certificate.status === 'VALID').length;
    
    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-active').textContent = active;
    document.getElementById('stat-suspended').textContent = suspended;
    document.getElementById('stat-blocked').textContent = blocked;
    document.getElementById('stat-certified').textContent = certified;
}

function updateQuickFilterCounts() {
    const all = suppliers.length;
    const active = suppliers.filter(s => s.status === 'ACTIVE').length;
    const internal = suppliers.filter(s => s.type === 'INTERNAL').length;
    const external = suppliers.filter(s => s.type === 'EXTERNAL').length;
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
    document.getElementById('filter-type').value = '';
    document.getElementById('filter-status').value = '';
    document.getElementById('filter-regime').value = '';
    document.getElementById('filter-certificate').value = '';
    
    applyFilters();
}

// ================================================
// FILTRAGE ET RECHERCHE
// ================================================

function applyFilters() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const typeFilter = document.getElementById('filter-type').value;
    const statusFilter = document.getElementById('filter-status').value;
    const regimeFilter = document.getElementById('filter-regime').value;
    const certificateFilter = document.getElementById('filter-certificate').value;
    
    filteredSuppliers = suppliers.filter(supplier => {
        // Recherche textuelle
        const matchesSearch = !searchTerm || 
            supplier.code.toLowerCase().includes(searchTerm) ||
            supplier.name.toLowerCase().includes(searchTerm) ||
            supplier.taxId?.toLowerCase().includes(searchTerm) ||
            supplier.contactName?.toLowerCase().includes(searchTerm);
        
        // Filtre quick
        let matchesQuickFilter = true;
        if (currentQuickFilter === 'active') {
            matchesQuickFilter = supplier.status === 'ACTIVE';
        } else if (currentQuickFilter === 'internal') {
            matchesQuickFilter = supplier.type === 'INTERNAL';
        } else if (currentQuickFilter === 'external') {
            matchesQuickFilter = supplier.type === 'EXTERNAL';
        } else if (currentQuickFilter === 'blocked') {
            matchesQuickFilter = supplier.status === 'BLOCKED';
        }
        
        // Filtres avancés
        const matchesType = !typeFilter || supplier.type === typeFilter;
        const matchesStatus = !statusFilter || supplier.status === statusFilter;
        const matchesRegime = !regimeFilter || supplier.taxRegime === regimeFilter;
        const matchesCertificate = !certificateFilter || supplier.certificate.status === certificateFilter;
        
        return matchesSearch && matchesQuickFilter && matchesType && matchesStatus && matchesRegime && matchesCertificate;
    });
    
    renderTable();
    renderPagination();
}

function resetFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('filter-type').value = '';
    document.getElementById('filter-status').value = '';
    document.getElementById('filter-regime').value = '';
    document.getElementById('filter-certificate').value = '';
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
        let aVal = column === 'score' ? a.score.overall : a[column];
        let bVal = column === 'score' ? b.score.overall : b[column];
        
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
        const typeInfo = getTypeInfo(supplier);
        const regimeInfo = getRegimeInfo(supplier);
        const certificateInfo = getCertificateInfo(supplier);
        const statusInfo = getStatusInfo(supplier);
        const scoreInfo = getScoreInfo(supplier);
        
        return `
            <tr onclick="viewSupplier('${supplier.id}')" style="cursor: pointer;">
                <td>
                    <input type="checkbox" class="row-checkbox" data-id="${supplier.id}" onclick="event.stopPropagation();">
                </td>
                <td>
                    <div style="font-weight: 600; font-size: 14px; color: #263c89;">${supplier.code}</div>
                </td>
                <td>
                    <div style="font-weight: 600; margin-bottom: 4px;">${supplier.name}</div>
                    <div style="font-size: 12px; color: var(--gray-500);">
                        Contact: ${supplier.contactName}
                    </div>
                </td>
                <td class="text-center">
                    <span class="supplier-type-badge ${typeInfo.class}">${typeInfo.label}</span>
                </td>
                <td class="text-center">
                    <div style="font-size: 13px; font-weight: 500;">${regimeInfo.label}</div>
                    ${supplier.vatRecoverable ? '<div style="font-size: 11px; color: #10B981;">✓ TVA récupérable</div>' : ''}
                </td>
                <td class="text-center">
                    <span class="badge" style="background: ${certificateInfo.bgColor}; color: ${certificateInfo.color};">
                        ${certificateInfo.icon} ${certificateInfo.label}
                    </span>
                    ${certificateInfo.detail ? `<div style="font-size: 11px; color: ${certificateInfo.color}; margin-top: 4px;">${certificateInfo.detail}</div>` : ''}
                </td>
                <td class="text-center">
                    <div class="status-badge-table">
                        <span class="status-dot ${statusInfo.class}"></span>
                        <span style="font-weight: 600; font-size: 13px;">${statusInfo.label}</span>
                    </div>
                    ${supplier.status === 'BLOCKED' ? `
                        <div style="font-size: 11px; color: #F59E0B; margin-top: 4px;">
                            ${supplier.blockReason}
                        </div>
                    ` : ''}
                </td>
                <td class="text-center">
                    <div style="font-size: 18px; font-weight: 700; color: ${scoreInfo.color}; margin-bottom: 2px;">
                        ${scoreInfo.grade}
                    </div>
                    <div style="font-size: 12px; color: var(--gray-600);">
                        ${supplier.score.overall}/100
                    </div>
                </td>
                <td class="text-center" onclick="event.stopPropagation();">
                    <div class="action-buttons">
                        <button class="btn-icon" onclick="viewSupplier('${supplier.id}')" title="Voir détails">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        <button class="btn-icon" onclick="editSupplier('${supplier.id}')" title="Modifier">
                            <i class="fa-solid fa-edit"></i>
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

function getTypeInfo(supplier) {
    if (supplier.type === 'INTERNAL') {
        return { class: 'type-internal', label: '🏢 Interne' };
    }
    return { class: 'type-external', label: '🚚 Externe' };
}

function getRegimeInfo(supplier) {
    const labels = {
        'REEL': { label: 'RÉEL', color: '#10B981' },
        'SIMPLIFIE': { label: 'SIMPLIFIÉ', color: '#F59E0B' },
        'LIBERATOIRE': { label: 'LIBÉRATOIRE', color: '#3B82F6' }
    };
    return labels[supplier.taxRegime] || { label: supplier.taxRegime };
}

function getCertificateInfo(supplier) {
    if (supplier.certificate.status === 'N/A') {
        return {
            icon: '',
            label: 'N/A',
            bgColor: '#F3F4F6',
            color: '#6B7280',
            detail: null
        };
    }
    
    if (supplier.certificate.status === 'VALID') {
        return {
            icon: '✅',
            label: 'Valide',
            bgColor: '#D1FAE5',
            color: '#065F46',
            detail: formatDate(supplier.certificate.expiryDate)
        };
    }
    
    if (supplier.certificate.status === 'EXPIRING_SOON') {
        return {
            icon: '⚠️',
            label: 'À renouveler',
            bgColor: '#FFFBEB',
            color: '#92400E',
            detail: `Expire ${supplier.certificate.daysToExpiry}j`
        };
    }
    
    if (supplier.certificate.status === 'EXPIRED') {
        return {
            icon: '🔴',
            label: 'EXPIRÉ',
            bgColor: '#FEE2E2',
            color: '#991B1B',
            detail: formatDate(supplier.certificate.expiryDate)
        };
    }
}

function getStatusInfo(supplier) {
    if (supplier.status === 'ACTIVE') {
        return { class: 'active', label: '✅ ACTIF' };
    } else if (supplier.status === 'SUSPENDED') {
        return { class: 'blocked', label: '⏸️ SUSPENDU' };
    } else if (supplier.status === 'BLOCKED') {
        return { class: 'inactive', label: '🚫 BLOQUÉ' };
    }
    return { class: 'inactive', label: 'Inactif' };
}

function getScoreInfo(supplier) {
    const grade = supplier.score.grade;
    const colors = {
        'A': '#10B981',
        'B': '#3B82F6',
        'C': '#F59E0B',
        'D': '#EF4444'
    };
    return {
        grade: grade,
        color: colors[grade] || '#6B7280'
    };
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
    window.location.href = `./fournisseur-detail.html?id=${id}`;
}

function editSupplier(id) {
    window.location.href = `./fournisseur-edit.html?id=${id}`;
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
                <strong>${supplier.name}</strong> (${supplier.code})
            </p>
            <div style="margin-top: 16px;">
                <label class="form-label required">Motif du blocage</label>
                <select class="form-select" id="block-reason">
                    <option value="">Sélectionner un motif</option>
                    <option value="DOCUMENTS_EXPIRES">Documents expirés</option>
                    <option value="QUALITE">Problèmes de qualité</option>
                    <option value="RETARDS">Retards répétés</option>
                    <option value="LITIGES">Litiges non résolus</option>
                    <option value="AUTRE">Autre</option>
                </select>
            </div>
            <div style="margin-top: 12px;">
                <label class="form-label">Détails</label>
                <textarea class="form-textarea" id="block-details" placeholder="Précisez le motif du blocage..."></textarea>
            </div>
            <div class="warning-box" style="margin-top: 16px;">
                <i class="fa-solid fa-exclamation-triangle"></i>
                Aucune nouvelle commande ne sera possible. Les commandes en cours seront maintenues.
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

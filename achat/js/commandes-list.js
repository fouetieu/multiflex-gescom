// ================================================
// COMMANDES-LIST.JS
// Gestion de la liste des bons de commande
// ================================================

// État global
let allBCFs = [];
let filteredBCFs = [];
let currentPage = 1;
let itemsPerPage = 10;
let currentStatusFilter = 'all';
let currentBCF = null;

// ================================================
// INITIALISATION
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation liste BCF...');
    loadBCFs();
});

// ================================================
// CHARGEMENT DES DONNÉES
// ================================================

function loadBCFs() {
    allBCFs = generateMockBCFs();
    filteredBCFs = [...allBCFs];
    
    updateKPIs();
    renderTable();
    renderPagination();
}

function generateMockBCFs() {
    const statuses = ['BROUILLON', 'ENVOYE', 'ACCEPTE', 'EN_LIVRAISON', 'LIVRE_PARTIEL', 'LIVRE_COMPLET', 'ANNULE'];
    const suppliers = ['ABC SARL', 'XYZ Ltd', 'CIMENCAM', 'IOLA DISTRIBUTION'];
    
    return [
        {
            id: 'BCF-2024-1234',
            code: 'BCF-2024-1234',
            date: '2024-01-15',
            supplier: 'ABC SARL',
            status: 'BROUILLON',
            deliveryDate: '2024-01-25',
            amount: 1150000,
            sourceDAs: ['DA-2024-091', 'DA-2024-092'],
            receptionRate: 0,
            createdBy: 'Marie AKONO'
        },
        {
            id: 'BCF-2024-1235',
            code: 'BCF-2024-1235',
            date: '2024-01-14',
            supplier: 'XYZ Ltd',
            status: 'ENVOYE',
            deliveryDate: '2024-01-22',
            amount: 1850000,
            sourceDAs: ['DA-2024-093', 'DA-2024-094'],
            receptionRate: 0,
            createdBy: 'Paul DURAND'
        },
        {
            id: 'BCF-2024-1220',
            code: 'BCF-2024-1220',
            date: '2024-01-12',
            supplier: 'CIMENCAM',
            status: 'ACCEPTE',
            deliveryDate: '2024-01-20',
            amount: 900000,
            sourceDAs: ['DA-2024-100'],
            receptionRate: 0,
            createdBy: 'Sophie KAMGA'
        },
        {
            id: 'BCF-2024-1215',
            code: 'BCF-2024-1215',
            date: '2024-01-10',
            supplier: 'ABC SARL',
            status: 'EN_LIVRAISON',
            deliveryDate: '2024-01-18',
            amount: 420000,
            sourceDAs: ['DA-2024-095'],
            receptionRate: 0,
            createdBy: 'Marie AKONO'
        },
        {
            id: 'BCF-2024-1210',
            code: 'BCF-2024-1210',
            date: '2024-01-08',
            supplier: 'IOLA DISTRIBUTION',
            status: 'LIVRE_PARTIEL',
            deliveryDate: '2024-01-16',
            amount: 550000,
            sourceDAs: ['DA-2024-101'],
            receptionRate: 60,
            createdBy: 'Jean DUPONT'
        },
        {
            id: 'BCF-2024-1205',
            code: 'BCF-2024-1205',
            date: '2024-01-05',
            supplier: 'XYZ Ltd',
            status: 'LIVRE_COMPLET',
            deliveryDate: '2024-01-12',
            amount: 1200000,
            sourceDAs: ['DA-2024-088', 'DA-2024-089'],
            receptionRate: 100,
            createdBy: 'Paul DURAND'
        },
        {
            id: 'BCF-2024-1200',
            code: 'BCF-2024-1200',
            date: '2024-01-03',
            supplier: 'ABC SARL',
            status: 'LIVRE_COMPLET',
            deliveryDate: '2024-01-10',
            amount: 850000,
            sourceDAs: ['DA-2024-085'],
            receptionRate: 100,
            createdBy: 'Sophie KAMGA'
        },
        {
            id: 'BCF-2024-1198',
            code: 'BCF-2024-1198',
            date: '2024-01-02',
            supplier: 'CIMENCAM',
            status: 'ANNULE',
            deliveryDate: '2024-01-11',
            amount: 650000,
            sourceDAs: ['DA-2024-082'],
            receptionRate: 0,
            createdBy: 'Marie AKONO',
            cancelReason: 'Changement de spécifications techniques'
        },
        {
            id: 'BCF-2024-1190',
            code: 'BCF-2024-1190',
            date: '2023-12-28',
            supplier: 'XYZ Ltd',
            status: 'LIVRE_COMPLET',
            deliveryDate: '2024-01-08',
            amount: 2100000,
            sourceDAs: ['DA-2023-980', 'DA-2023-981', 'DA-2023-982'],
            receptionRate: 100,
            createdBy: 'Jean DUPONT'
        },
        {
            id: 'BCF-2024-1185',
            code: 'BCF-2024-1185',
            date: '2023-12-26',
            supplier: 'ABC SARL',
            status: 'LIVRE_PARTIEL',
            deliveryDate: '2024-01-05',
            amount: 780000,
            sourceDAs: ['DA-2023-975'],
            receptionRate: 45,
            createdBy: 'Marie AKONO'
        }
    ];
}

// ================================================
// KPI UPDATE
// ================================================

function updateKPIs() {
    const total = allBCFs.length;
    const pending = allBCFs.filter(bcf => ['ENVOYE', 'ACCEPTE', 'EN_LIVRAISON', 'LIVRE_PARTIEL'].includes(bcf.status)).length;
    const delivered = allBCFs.filter(bcf => bcf.status === 'LIVRE_COMPLET').length;
    const totalAmount = allBCFs.reduce((sum, bcf) => sum + bcf.amount, 0);
    
    // Late BCFs (delivery date passed and not fully delivered)
    const today = new Date();
    const late = allBCFs.filter(bcf => {
        if (bcf.status === 'LIVRE_COMPLET' || bcf.status === 'ANNULE') return false;
        const deliveryDate = new Date(bcf.deliveryDate);
        return deliveryDate < today;
    }).length;
    
    const deliveryRate = total > 0 ? Math.round((delivered / total) * 100) : 0;
    
    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-pending').textContent = pending;
    document.getElementById('stat-pending-late').textContent = late;
    document.getElementById('stat-delivered').textContent = delivered;
    document.getElementById('stat-delivery-rate').textContent = deliveryRate + '%';
    document.getElementById('stat-amount').textContent = formatCurrency(totalAmount);
}

// ================================================
// FILTRAGE
// ================================================

function filterByStatus(status) {
    currentStatusFilter = status;
    currentPage = 1;
    
    // Update active chip
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.classList.remove('active');
    });
    document.querySelector(`[data-status="${status}"]`).classList.add('active');
    
    applyFilters();
}

function applyFilters() {
    filteredBCFs = allBCFs.filter(bcf => {
        // Status filter
        if (currentStatusFilter !== 'all') {
            // Normalize status for "LIVRE" filter
            if (currentStatusFilter === 'LIVRE') {
                if (!['LIVRE_PARTIEL', 'LIVRE_COMPLET'].includes(bcf.status)) {
                    return false;
                }
            } else if (bcf.status !== currentStatusFilter) {
                return false;
            }
        }
        
        // Search filter
        const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
        if (searchTerm) {
            const matchesCode = bcf.code.toLowerCase().includes(searchTerm);
            const matchesSupplier = bcf.supplier.toLowerCase().includes(searchTerm);
            if (!matchesCode && !matchesSupplier) return false;
        }
        
        // Supplier filter
        const supplierFilter = document.getElementById('filter-supplier')?.value || '';
        if (supplierFilter && bcf.supplier !== supplierFilter) {
            return false;
        }
        
        // Date range filter
        const dateFrom = document.getElementById('filter-date-from')?.value || '';
        const dateTo = document.getElementById('filter-date-to')?.value || '';
        if (dateFrom && bcf.date < dateFrom) return false;
        if (dateTo && bcf.date > dateTo) return false;
        
        // Amount range filter
        const amountMin = parseFloat(document.getElementById('filter-amount-min')?.value) || 0;
        const amountMax = parseFloat(document.getElementById('filter-amount-max')?.value) || Infinity;
        if (bcf.amount < amountMin || bcf.amount > amountMax) return false;
        
        return true;
    });
    
    currentPage = 1;
    renderTable();
    renderPagination();
}

function resetFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('filter-supplier').value = '';
    document.getElementById('filter-date-from').value = '';
    document.getElementById('filter-date-to').value = '';
    document.getElementById('filter-amount-min').value = '';
    document.getElementById('filter-amount-max').value = '';
    
    applyFilters();
}

function toggleAdvancedFilters() {
    const filters = document.getElementById('advanced-filters');
    filters.style.display = filters.style.display === 'none' ? 'block' : 'none';
}

// ================================================
// AFFICHAGE TABLEAU
// ================================================

function renderTable() {
    const tbody = document.getElementById('bcf-table-body');
    const emptyState = document.getElementById('empty-state');
    
    if (filteredBCFs.length === 0) {
        tbody.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredBCFs.length);
    const pageItems = filteredBCFs.slice(startIndex, endIndex);
    
    tbody.innerHTML = pageItems.map(bcf => {
        const statusBadge = getStatusBadge(bcf.status);
        const isLate = isDeliveryLate(bcf);
        
        return `
            <tr onclick="viewBCFDetails('${bcf.id}')">
                <td>
                    <span style="font-weight: 600; color: #263c89;">${bcf.code}</span>
                </td>
                <td>${formatDate(bcf.date)}</td>
                <td>
                    <div style="font-weight: 500;">${bcf.supplier}</div>
                    ${bcf.sourceDAs.length > 0 ? `
                        <div style="font-size: 12px; color: #6B7280; margin-top: 2px;">
                            ${bcf.sourceDAs.length} DA source${bcf.sourceDAs.length > 1 ? 's' : ''}
                        </div>
                    ` : ''}
                </td>
                <td>${statusBadge}</td>
                <td>
                    ${formatDate(bcf.deliveryDate)}
                    ${isLate ? `
                        <div class="badge badge-danger" style="margin-top: 4px; font-size: 11px;">
                            <i class="fa-solid fa-exclamation-triangle"></i> Retard
                        </div>
                    ` : ''}
                </td>
                <td style="text-align: right; font-weight: 600;">${formatCurrency(bcf.amount)}</td>
                <td style="text-align: center;">
                    ${getReceptionBadge(bcf.receptionRate)}
                </td>
                <td style="text-align: center;">
                    <div class="action-buttons" onclick="event.stopPropagation();">
                        ${getContextualActions(bcf)}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// ================================================
// PAGINATION
// ================================================

function renderPagination() {
    const totalPages = Math.ceil(filteredBCFs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, filteredBCFs.length);
    
    document.getElementById('pagination-from').textContent = filteredBCFs.length > 0 ? startIndex : 0;
    document.getElementById('pagination-to').textContent = endIndex;
    document.getElementById('pagination-total').textContent = filteredBCFs.length;
    
    const controls = document.getElementById('pagination-controls');
    
    if (totalPages <= 1) {
        controls.innerHTML = '';
        return;
    }
    
    let html = `
        <button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="goToPage(${currentPage - 1})">
            <i class="fa-solid fa-chevron-left"></i>
        </button>
    `;
    
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `
                <button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += `<span style="padding: 0 8px; color: #9CA3AF;">...</span>`;
        }
    }
    
    html += `
        <button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="goToPage(${currentPage + 1})">
            <i class="fa-solid fa-chevron-right"></i>
        </button>
    `;
    
    controls.innerHTML = html;
}

function goToPage(page) {
    currentPage = page;
    renderTable();
    renderPagination();
}

// ================================================
// ACTIONS CONTEXTUELLES
// ================================================

function getContextualActions(bcf) {
    let actions = `
        <button class="btn-icon btn-icon-primary" onclick="viewBCFDetails('${bcf.id}')" title="Voir détails">
            <i class="fa-solid fa-eye"></i>
        </button>
    `;
    
    if (bcf.status === 'BROUILLON') {
        actions += `
            <button class="btn-icon btn-icon-success" onclick="editBCF('${bcf.id}')" title="Modifier">
                <i class="fa-solid fa-edit"></i>
            </button>
            <button class="btn-icon btn-icon-danger" onclick="showCancelBCFModal('${bcf.id}')" title="Annuler">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
    } else if (bcf.status === 'ENVOYE') {
        actions += `
            <button class="btn-icon btn-icon-warning" onclick="editBCF('${bcf.id}')" title="Modifier">
                <i class="fa-solid fa-edit"></i>
            </button>
            <button class="btn-icon btn-icon-danger" onclick="showCancelBCFModal('${bcf.id}')" title="Annuler">
                <i class="fa-solid fa-ban"></i>
            </button>
        `;
    } else if (bcf.status === 'ACCEPTE' || bcf.status === 'EN_LIVRAISON') {
        actions += `
            <button class="btn-icon btn-icon-success" onclick="createReception('${bcf.id}')" title="Créer réception">
                <i class="fa-solid fa-box-open"></i>
            </button>
        `;
    } else if (bcf.status === 'LIVRE_PARTIEL') {
        actions += `
            <button class="btn-icon btn-icon-success" onclick="createReception('${bcf.id}')" title="Nouvelle réception">
                <i class="fa-solid fa-box-open"></i>
            </button>
        `;
    } else if (bcf.status === 'LIVRE_COMPLET') {
        actions += `
            <button class="btn-icon btn-icon-primary" onclick="viewReceptions('${bcf.id}')" title="Voir réceptions">
                <i class="fa-solid fa-list"></i>
            </button>
        `;
    }
    
    return actions;
}

// ================================================
// MODAL DÉTAILS BCF
// ================================================

function viewBCFDetails(bcfId) {
    currentBCF = allBCFs.find(b => b.id === bcfId);
    if (!currentBCF) return;
    
    document.getElementById('modal-bcf-code').textContent = currentBCF.code;
    
    const content = `
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; margin-bottom: 24px;">
            <div>
                <div class="info-label">Fournisseur</div>
                <div class="info-value">${currentBCF.supplier}</div>
            </div>
            <div>
                <div class="info-label">Statut</div>
                <div class="info-value">${getStatusBadge(currentBCF.status)}</div>
            </div>
            <div>
                <div class="info-label">Date de Commande</div>
                <div class="info-value">${formatDate(currentBCF.date)}</div>
            </div>
            <div>
                <div class="info-label">Date de Livraison Prévue</div>
                <div class="info-value">
                    ${formatDate(currentBCF.deliveryDate)}
                    ${isDeliveryLate(currentBCF) ? `
                        <span class="badge badge-danger" style="margin-left: 8px;">
                            <i class="fa-solid fa-exclamation-triangle"></i> Retard
                        </span>
                    ` : ''}
                </div>
            </div>
            <div>
                <div class="info-label">Montant Total</div>
                <div class="info-value" style="color: #263c89; font-weight: 700; font-size: 18px;">
                    ${formatCurrency(currentBCF.amount)}
                </div>
            </div>
            <div>
                <div class="info-label">Taux de Réception</div>
                <div class="info-value">${getReceptionBadge(currentBCF.receptionRate)}</div>
            </div>
            <div>
                <div class="info-label">Créé par</div>
                <div class="info-value">${currentBCF.createdBy}</div>
            </div>
            <div>
                <div class="info-label">DA Source(s)</div>
                <div class="info-value">${currentBCF.sourceDAs.join(', ')}</div>
            </div>
        </div>
        
        ${currentBCF.status === 'ANNULE' && currentBCF.cancelReason ? `
            <div class="alert-box alert-danger" style="margin-top: 16px;">
                <i class="fa-solid fa-ban"></i>
                <div>
                    <strong>Raison d'annulation:</strong><br>
                    ${currentBCF.cancelReason}
                </div>
            </div>
        ` : ''}
    `;
    
    document.getElementById('modal-bcf-content').innerHTML = content;
    openModal('modal-bcf-details');
}

function editBCFFromModal() {
    if (currentBCF) {
        editBCF(currentBCF.id);
    }
}

// ================================================
// MODAL ANNULATION
// ================================================

function showCancelBCFModal(bcfId) {
    currentBCF = allBCFs.find(b => b.id === bcfId);
    if (!currentBCF) return;
    
    document.getElementById('cancel-bcf-code').textContent = currentBCF.code;
    document.getElementById('cancel-reason').value = '';
    openModal('modal-cancel-bcf');
}

function confirmCancelBCF() {
    const reason = document.getElementById('cancel-reason').value.trim();
    
    if (!reason) {
        alert('Veuillez préciser le motif d\'annulation');
        return;
    }
    
    if (!currentBCF) return;
    
    // Update BCF status
    currentBCF.status = 'ANNULE';
    currentBCF.cancelReason = reason;
    
    console.log(`BCF ${currentBCF.code} annulé. Motif: ${reason}`);
    
    closeModal('modal-cancel-bcf');
    
    // Refresh display
    updateKPIs();
    renderTable();
    
    alert(`BCF ${currentBCF.code} annulé avec succès`);
}

// ================================================
// NAVIGATION ACTIONS
// ================================================

function editBCF(bcfId) {
    window.location.href = `./commande-edit.html?id=${bcfId}`;
}

function createReception(bcfId) {
    window.location.href = `./reception-create.html?bcf=${bcfId}`;
}

function viewReceptions(bcfId) {
    window.location.href = `./receptions-list.html?bcf=${bcfId}`;
}

// ================================================
// HELPERS
// ================================================

function getStatusBadge(status) {
    const badges = {
        'BROUILLON': '<span class="badge badge-secondary"><i class="fa-solid fa-file"></i> Brouillon</span>',
        'ENVOYE': '<span class="badge badge-info"><i class="fa-solid fa-paper-plane"></i> Envoyé</span>',
        'ACCEPTE': '<span class="badge badge-success"><i class="fa-solid fa-check"></i> Accepté</span>',
        'EN_LIVRAISON': '<span class="badge badge-warning"><i class="fa-solid fa-truck"></i> En livraison</span>',
        'LIVRE_PARTIEL': '<span class="badge badge-warning"><i class="fa-solid fa-box-open"></i> Livré partiel</span>',
        'LIVRE_COMPLET': '<span class="badge badge-success"><i class="fa-solid fa-check-circle"></i> Livré complet</span>',
        'ANNULE': '<span class="badge badge-danger"><i class="fa-solid fa-ban"></i> Annulé</span>'
    };
    return badges[status] || status;
}

function getReceptionBadge(rate) {
    if (rate === 0) {
        return '<span class="badge badge-secondary">0%</span>';
    } else if (rate < 100) {
        return `<span class="badge badge-warning">${rate}%</span>`;
    } else {
        return '<span class="badge badge-success">100%</span>';
    }
}

function isDeliveryLate(bcf) {
    if (bcf.status === 'LIVRE_COMPLET' || bcf.status === 'ANNULE') return false;
    const today = new Date();
    const deliveryDate = new Date(bcf.deliveryDate);
    return deliveryDate < today;
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount) + ' XAF';
}

// ================================================
// MODAL MANAGEMENT
// ================================================

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    currentBCF = null;
}


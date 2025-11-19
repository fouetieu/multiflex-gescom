// ================================================
// RECEPTIONS-LIST.JS
// Gestion de la liste des réceptions
// ================================================

// État global
let allReceptions = [];
let filteredReceptions = [];
let currentPage = 1;
let itemsPerPage = 10;
let currentStatusFilter = 'all';

// ================================================
// INITIALISATION
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation liste réceptions...');
    loadReceptions();
});

// ================================================
// CHARGEMENT DES DONNÉES
// ================================================

function loadReceptions() {
    allReceptions = generateMockReceptions();
    filteredReceptions = [...allReceptions];
    
    updateKPIs();
    renderTable();
    renderPagination();
}

function generateMockReceptions() {
    return [
        {
            id: 'BR-001',
            code: 'BR-2024-0180',
            bcfCode: 'BCF-2024-1205',
            supplier: 'XYZ Ltd',
            receptionDate: '2024-01-12',
            itemsCount: 3,
            gapsCount: 0,
            status: 'VALIDEE',
            qualityStatus: 'CONFORME',
            receivedBy: 'Marie AKONO'
        },
        {
            id: 'BR-002',
            code: 'BR-2024-0175',
            bcfCode: 'BCF-2024-1234',
            supplier: 'ABC SARL',
            receptionDate: '2024-01-15',
            itemsCount: 2,
            gapsCount: 0,
            status: 'VALIDEE',
            qualityStatus: 'CONFORME',
            receivedBy: 'Jean DUPONT'
        },
        {
            id: 'BR-003',
            code: 'BR-2024-0170',
            bcfCode: 'BCF-2024-1220',
            supplier: 'CIMENCAM',
            receptionDate: '2024-01-10',
            itemsCount: 1,
            gapsCount: 0,
            status: 'VALIDEE',
            qualityStatus: 'CONFORME',
            receivedBy: 'Sophie KAMGA'
        },
        {
            id: 'BR-004',
            code: 'BR-2024-0145',
            bcfCode: 'BCF-2024-1210',
            supplier: 'IOLA DISTRIBUTION',
            receptionDate: '2024-01-08',
            itemsCount: 3,
            gapsCount: 3,
            status: 'AVEC_ECARTS',
            qualityStatus: 'RESERVE',
            receivedBy: 'Marie AKONO'
        },
        {
            id: 'BR-005',
            code: 'BR-2024-0140',
            bcfCode: 'BCF-2024-1215',
            supplier: 'ABC SARL',
            receptionDate: '2024-01-14',
            itemsCount: 2,
            gapsCount: 0,
            status: 'VALIDEE',
            qualityStatus: 'CONFORME',
            receivedBy: 'Paul DURAND'
        },
        {
            id: 'BR-006',
            code: 'BR-2024-0135',
            bcfCode: 'BCF-2024-1235',
            supplier: 'XYZ Ltd',
            receptionDate: '2024-01-16',
            itemsCount: 2,
            gapsCount: 1,
            status: 'AVEC_ECARTS',
            qualityStatus: 'RESERVE',
            receivedBy: 'Marie AKONO'
        },
        {
            id: 'BR-007',
            code: 'BR-2024-0130',
            bcfCode: 'BCF-2024-1200',
            supplier: 'ABC SARL',
            receptionDate: '2024-01-05',
            itemsCount: 1,
            gapsCount: 0,
            status: 'VALIDEE',
            qualityStatus: 'CONFORME',
            receivedBy: 'Sophie KAMGA'
        },
        {
            id: 'BR-008',
            code: 'BR-2024-0125',
            bcfCode: 'BCF-2024-1190',
            supplier: 'XYZ Ltd',
            receptionDate: '2024-01-02',
            itemsCount: 3,
            gapsCount: 0,
            status: 'VALIDEE',
            qualityStatus: 'CONFORME',
            receivedBy: 'Jean DUPONT'
        },
        {
            id: 'BR-009',
            code: 'BR-2024-0120',
            bcfCode: 'BCF-2024-1185',
            supplier: 'ABC SARL',
            receptionDate: '2024-01-01',
            itemsCount: 1,
            gapsCount: 1,
            status: 'AVEC_ECARTS',
            qualityStatus: 'NON_CONFORME',
            receivedBy: 'Marie AKONO'
        }
    ];
}

// ================================================
// KPI UPDATE
// ================================================

function updateKPIs() {
    const total = allReceptions.length;
    const withGaps = allReceptions.filter(r => r.gapsCount > 0).length;
    const compliant = allReceptions.filter(r => r.gapsCount === 0 && r.status === 'VALIDEE').length;
    const totalItems = allReceptions.reduce((sum, r) => sum + r.itemsCount, 0);
    const totalGaps = allReceptions.reduce((sum, r) => sum + r.gapsCount, 0);
    
    const complianceRate = total > 0 ? Math.round((compliant / total) * 100) : 0;
    
    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-with-gaps').textContent = withGaps;
    document.getElementById('stat-gaps-count').textContent = totalGaps;
    document.getElementById('stat-compliant').textContent = compliant;
    document.getElementById('stat-compliance-rate').textContent = complianceRate + '%';
    document.getElementById('stat-items').textContent = totalItems;
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
    filteredReceptions = allReceptions.filter(reception => {
        // Status filter
        if (currentStatusFilter !== 'all') {
            if (reception.status !== currentStatusFilter) {
                return false;
            }
        }
        
        // Search filter
        const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
        if (searchTerm) {
            const matchesBR = reception.code.toLowerCase().includes(searchTerm);
            const matchesBCF = reception.bcfCode.toLowerCase().includes(searchTerm);
            const matchesSupplier = reception.supplier.toLowerCase().includes(searchTerm);
            if (!matchesBR && !matchesBCF && !matchesSupplier) return false;
        }
        
        // Supplier filter
        const supplierFilter = document.getElementById('filter-supplier')?.value || '';
        if (supplierFilter && reception.supplier !== supplierFilter) {
            return false;
        }
        
        // Date range filter
        const dateFrom = document.getElementById('filter-date-from')?.value || '';
        const dateTo = document.getElementById('filter-date-to')?.value || '';
        if (dateFrom && reception.receptionDate < dateFrom) return false;
        if (dateTo && reception.receptionDate > dateTo) return false;
        
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
    const tbody = document.getElementById('receptions-table-body');
    const emptyState = document.getElementById('empty-state');
    
    if (filteredReceptions.length === 0) {
        tbody.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredReceptions.length);
    const pageItems = filteredReceptions.slice(startIndex, endIndex);
    
    tbody.innerHTML = pageItems.map(reception => {
        const statusBadge = getStatusBadge(reception.status);
        const gapsBadge = getGapsBadge(reception.gapsCount);
        
        return `
            <tr onclick="viewReceptionDetails('${reception.id}')">
                <td>
                    <span style="font-weight: 600; color: #263c89;">${reception.code}</span>
                </td>
                <td>
                    <span style="font-weight: 500;">${reception.bcfCode}</span>
                </td>
                <td>
                    <div style="font-weight: 500;">${reception.supplier}</div>
                    <div style="font-size: 12px; color: #6B7280; margin-top: 2px;">
                        Par: ${reception.receivedBy}
                    </div>
                </td>
                <td>${formatDate(reception.receptionDate)}</td>
                <td style="text-align: center;">
                    <span style="font-weight: 600;">${reception.itemsCount}</span>
                </td>
                <td style="text-align: center;">
                    ${gapsBadge}
                </td>
                <td style="text-align: center;">${statusBadge}</td>
                <td style="text-align: center;">
                    <div class="action-buttons" onclick="event.stopPropagation();">
                        ${getContextualActions(reception)}
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
    const totalPages = Math.ceil(filteredReceptions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, filteredReceptions.length);
    
    document.getElementById('pagination-from').textContent = filteredReceptions.length > 0 ? startIndex : 0;
    document.getElementById('pagination-to').textContent = endIndex;
    document.getElementById('pagination-total').textContent = filteredReceptions.length;
    
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

function getContextualActions(reception) {
    let actions = `
        <button class="btn-icon btn-icon-primary" onclick="viewReceptionDetails('${reception.id}')" title="Voir détails">
            <i class="fa-solid fa-eye"></i>
        </button>
    `;
    
    if (reception.gapsCount > 0 && reception.status === 'AVEC_ECARTS') {
        actions += `
            <button class="btn-icon btn-icon-warning" onclick="manageGaps('${reception.id}')" title="Gérer écarts">
                <i class="fa-solid fa-triangle-exclamation"></i>
            </button>
        `;
    }
    
    if (reception.status === 'BROUILLON') {
        actions += `
            <button class="btn-icon btn-icon-success" onclick="editReception('${reception.id}')" title="Modifier">
                <i class="fa-solid fa-edit"></i>
            </button>
        `;
    }
    
    return actions;
}

// ================================================
// NAVIGATION ACTIONS
// ================================================

function viewReceptionDetails(receptionId) {
    console.log('Voir détails réception:', receptionId);
    alert(`Affichage des détails de la réception ${receptionId}`);
}

function manageGaps(receptionId) {
    window.location.href = `./reception-gaps.html?id=${receptionId}`;
}

function editReception(receptionId) {
    window.location.href = `./reception-create.html?id=${receptionId}`;
}

// ================================================
// HELPERS
// ================================================

function getStatusBadge(status) {
    const badges = {
        'BROUILLON': '<span class="badge badge-secondary"><i class="fa-solid fa-file"></i> Brouillon</span>',
        'VALIDEE': '<span class="badge badge-success"><i class="fa-solid fa-check-circle"></i> Validée</span>',
        'AVEC_ECARTS': '<span class="badge badge-warning"><i class="fa-solid fa-triangle-exclamation"></i> Avec écarts</span>'
    };
    return badges[status] || status;
}

function getGapsBadge(count) {
    if (count === 0) {
        return '<span class="badge badge-success">0</span>';
    } else if (count <= 2) {
        return `<span class="badge badge-warning">${count}</span>`;
    } else {
        return `<span class="badge badge-danger">${count}</span>`;
    }
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}



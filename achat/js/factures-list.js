// ================================================
// FACTURES-LIST.JS
// Gestion de la liste des factures
// ================================================

// État global
let allInvoices = [];
let filteredInvoices = [];
let currentPage = 1;
let itemsPerPage = 10;
let currentStatusFilter = 'all';
let currentInvoice = null;

// ================================================
// INITIALISATION
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation liste factures...');
    loadInvoices();
});

// ================================================
// CHARGEMENT DES DONNÉES
// ================================================

function loadInvoices() {
    allInvoices = generateMockInvoices();
    filteredInvoices = [...allInvoices];
    
    updateKPIs();
    renderTable();
    renderPagination();
}

function generateMockInvoices() {
    return [
        {
            id: 'INV-001',
            invoiceNumber: 'F-2024-XYZ-189',
            bcfCode: 'BCF-2024-1205',
            supplier: 'XYZ Ltd',
            invoiceDate: '2024-01-12',
            dueDate: '2024-02-11',
            amountTTC: 1198500,
            status: 'VALIDEE',
            matchingStatus: 'MATCHED',
            createdBy: 'Marie AKONO'
        },
        {
            id: 'INV-002',
            invoiceNumber: 'F-2024-ABC-245',
            bcfCode: 'BCF-2024-1234',
            supplier: 'ABC SARL',
            invoiceDate: '2024-01-15',
            dueDate: '2024-02-14',
            amountTTC: 1150000,
            status: 'EN_ATTENTE',
            matchingStatus: 'PENDING',
            createdBy: 'Marie AKONO'
        },
        {
            id: 'INV-003',
            invoiceNumber: 'F-2024-IOLA-112',
            bcfCode: 'BCF-2024-1210',
            supplier: 'IOLA DISTRIBUTION',
            invoiceDate: '2024-01-08',
            dueDate: '2024-02-07',
            amountTTC: 550000,
            status: 'PAYEE',
            paymentDate: '2024-02-05',
            matchingStatus: 'MATCHED',
            createdBy: 'Jean DUPONT'
        },
        {
            id: 'INV-004',
            invoiceNumber: 'F-2024-CIM-089',
            bcfCode: 'BCF-2024-1220',
            supplier: 'CIMENCAM',
            invoiceDate: '2024-01-10',
            dueDate: '2024-01-20',
            amountTTC: 900000,
            status: 'EN_RETARD',
            matchingStatus: 'MATCHED',
            createdBy: 'Sophie KAMGA'
        },
        {
            id: 'INV-005',
            invoiceNumber: 'F-2024-ABC-250',
            bcfCode: 'BCF-2024-1215',
            supplier: 'ABC SARL',
            invoiceDate: '2024-01-14',
            dueDate: '2024-02-13',
            amountTTC: 420000,
            status: 'EN_ATTENTE',
            matchingStatus: 'MATCHED',
            createdBy: 'Marie AKONO'
        },
        {
            id: 'INV-006',
            invoiceNumber: 'F-2024-XYZ-195',
            bcfCode: 'BCF-2024-1235',
            supplier: 'XYZ Ltd',
            invoiceDate: '2024-01-16',
            dueDate: '2024-02-15',
            amountTTC: 1850000,
            status: 'BROUILLON',
            matchingStatus: null,
            createdBy: 'Paul DURAND'
        },
        {
            id: 'INV-007',
            invoiceNumber: 'F-2024-ABC-240',
            bcfCode: 'BCF-2024-1200',
            supplier: 'ABC SARL',
            invoiceDate: '2024-01-05',
            dueDate: '2024-02-04',
            amountTTC: 850000,
            status: 'PAYEE',
            paymentDate: '2024-01-30',
            matchingStatus: 'MATCHED',
            createdBy: 'Sophie KAMGA'
        },
        {
            id: 'INV-008',
            invoiceNumber: 'F-2024-XYZ-180',
            bcfCode: 'BCF-2024-1190',
            supplier: 'XYZ Ltd',
            invoiceDate: '2024-01-02',
            dueDate: '2024-02-01',
            amountTTC: 2100000,
            status: 'PAYEE',
            paymentDate: '2024-01-28',
            matchingStatus: 'MATCHED',
            createdBy: 'Jean DUPONT'
        }
    ];
}

// ================================================
// KPI UPDATE
// ================================================

function updateKPIs() {
    const total = allInvoices.length;
    const pending = allInvoices.filter(inv => ['VALIDEE', 'EN_ATTENTE', 'EN_RETARD'].includes(inv.status)).length;
    const paid = allInvoices.filter(inv => inv.status === 'PAYEE').length;
    const overdue = allInvoices.filter(inv => inv.status === 'EN_RETARD').length;
    
    const totalAmount = allInvoices.reduce((sum, inv) => sum + inv.amountTTC, 0);
    const toPay = allInvoices
        .filter(inv => ['VALIDEE', 'EN_ATTENTE', 'EN_RETARD'].includes(inv.status))
        .reduce((sum, inv) => sum + inv.amountTTC, 0);
    
    const paymentRate = total > 0 ? Math.round((paid / total) * 100) : 0;
    
    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-pending').textContent = pending;
    document.getElementById('stat-overdue').textContent = overdue;
    document.getElementById('stat-paid').textContent = paid;
    document.getElementById('stat-payment-rate').textContent = paymentRate + '%';
    document.getElementById('stat-amount').textContent = formatCurrency(totalAmount);
    document.getElementById('stat-to-pay').textContent = formatCurrency(toPay);
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
    const today = new Date();
    
    filteredInvoices = allInvoices.filter(inv => {
        // Status filter
        if (currentStatusFilter !== 'all') {
            if (currentStatusFilter === 'EN_RETARD') {
                const dueDate = new Date(inv.dueDate);
                if (inv.status === 'PAYEE' || dueDate >= today) {
                    return false;
                }
            } else if (inv.status !== currentStatusFilter) {
                return false;
            }
        }
        
        // Search filter
        const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
        if (searchTerm) {
            const matchesInvoice = inv.invoiceNumber.toLowerCase().includes(searchTerm);
            const matchesBCF = inv.bcfCode.toLowerCase().includes(searchTerm);
            const matchesSupplier = inv.supplier.toLowerCase().includes(searchTerm);
            if (!matchesInvoice && !matchesBCF && !matchesSupplier) return false;
        }
        
        // Supplier filter
        const supplierFilter = document.getElementById('filter-supplier')?.value || '';
        if (supplierFilter && inv.supplier !== supplierFilter) {
            return false;
        }
        
        // Date range filter
        const dateFrom = document.getElementById('filter-date-from')?.value || '';
        const dateTo = document.getElementById('filter-date-to')?.value || '';
        if (dateFrom && inv.invoiceDate < dateFrom) return false;
        if (dateTo && inv.invoiceDate > dateTo) return false;
        
        // Amount range filter
        const amountMin = parseFloat(document.getElementById('filter-amount-min')?.value) || 0;
        const amountMax = parseFloat(document.getElementById('filter-amount-max')?.value) || Infinity;
        if (inv.amountTTC < amountMin || inv.amountTTC > amountMax) return false;
        
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
    const tbody = document.getElementById('invoices-table-body');
    const emptyState = document.getElementById('empty-state');
    
    if (filteredInvoices.length === 0) {
        tbody.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredInvoices.length);
    const pageItems = filteredInvoices.slice(startIndex, endIndex);
    
    tbody.innerHTML = pageItems.map(inv => {
        const statusBadge = getStatusBadge(inv.status, inv.dueDate);
        const isOverdue = isInvoiceOverdue(inv);
        
        return `
            <tr onclick="viewInvoiceDetails('${inv.id}')">
                <td>
                    <span style="font-weight: 600; color: #263c89;">${inv.invoiceNumber}</span>
                </td>
                <td>
                    <span style="font-weight: 500;">${inv.bcfCode}</span>
                </td>
                <td>
                    <div style="font-weight: 500;">${inv.supplier}</div>
                </td>
                <td>${formatDate(inv.invoiceDate)}</td>
                <td>
                    ${formatDate(inv.dueDate)}
                    ${isOverdue ? `
                        <div class="badge badge-danger" style="margin-top: 4px; font-size: 11px;">
                            <i class="fa-solid fa-exclamation-triangle"></i> Retard
                        </div>
                    ` : ''}
                </td>
                <td style="text-align: right; font-weight: 600;">${formatCurrency(inv.amountTTC)}</td>
                <td style="text-align: center;">${statusBadge}</td>
                <td style="text-align: center;">
                    <div class="action-buttons" onclick="event.stopPropagation();">
                        ${getContextualActions(inv)}
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
    const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, filteredInvoices.length);
    
    document.getElementById('pagination-from').textContent = filteredInvoices.length > 0 ? startIndex : 0;
    document.getElementById('pagination-to').textContent = endIndex;
    document.getElementById('pagination-total').textContent = filteredInvoices.length;
    
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

function getContextualActions(inv) {
    let actions = `
        <button class="btn-icon btn-icon-primary" onclick="viewInvoiceDetails('${inv.id}')" title="Voir détails">
            <i class="fa-solid fa-eye"></i>
        </button>
    `;
    
    if (inv.status === 'BROUILLON') {
        actions += `
            <button class="btn-icon btn-icon-success" onclick="editInvoice('${inv.id}')" title="Modifier">
                <i class="fa-solid fa-edit"></i>
            </button>
        `;
    } else if (inv.status === 'VALIDEE') {
        actions += `
            <button class="btn-icon btn-icon-success" onclick="perform3WayMatching('${inv.id}')" title="Rapprochement 3-way">
                <i class="fa-solid fa-check-double"></i>
            </button>
        `;
    } else if (inv.status === 'EN_ATTENTE' || inv.status === 'EN_RETARD') {
        actions += `
            <button class="btn-icon btn-icon-success" onclick="registerPayment('${inv.id}')" title="Enregistrer paiement">
                <i class="fa-solid fa-coins"></i>
            </button>
        `;
    }
    
    return actions;
}

// ================================================
// MODAL DÉTAILS
// ================================================

function viewInvoiceDetails(invoiceId) {
    currentInvoice = allInvoices.find(inv => inv.id === invoiceId);
    if (!currentInvoice) return;
    
    document.getElementById('modal-invoice-number').textContent = currentInvoice.invoiceNumber;
    
    const content = `
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; margin-bottom: 24px;">
            <div>
                <div class="info-label">N° Facture</div>
                <div class="info-value">${currentInvoice.invoiceNumber}</div>
            </div>
            <div>
                <div class="info-label">N° BCF</div>
                <div class="info-value">${currentInvoice.bcfCode}</div>
            </div>
            <div>
                <div class="info-label">Fournisseur</div>
                <div class="info-value">${currentInvoice.supplier}</div>
            </div>
            <div>
                <div class="info-label">Statut</div>
                <div class="info-value">${getStatusBadge(currentInvoice.status, currentInvoice.dueDate)}</div>
            </div>
            <div>
                <div class="info-label">Date Facture</div>
                <div class="info-value">${formatDate(currentInvoice.invoiceDate)}</div>
            </div>
            <div>
                <div class="info-label">Date d'Échéance</div>
                <div class="info-value">
                    ${formatDate(currentInvoice.dueDate)}
                    ${isInvoiceOverdue(currentInvoice) ? `
                        <span class="badge badge-danger" style="margin-left: 8px;">
                            <i class="fa-solid fa-exclamation-triangle"></i> En retard
                        </span>
                    ` : ''}
                </div>
            </div>
            <div>
                <div class="info-label">Montant TTC</div>
                <div class="info-value" style="color: #263c89; font-weight: 700; font-size: 18px;">
                    ${formatCurrency(currentInvoice.amountTTC)}
                </div>
            </div>
            <div>
                <div class="info-label">Rapprochement 3-Way</div>
                <div class="info-value">
                    ${currentInvoice.matchingStatus === 'MATCHED' ? 
                        '<span class="badge badge-success"><i class="fa-solid fa-check"></i> Effectué</span>' : 
                        '<span class="badge badge-warning"><i class="fa-solid fa-clock"></i> En attente</span>'}
                </div>
            </div>
            ${currentInvoice.paymentDate ? `
                <div style="grid-column: 1 / -1;">
                    <div class="info-label">Date de Paiement</div>
                    <div class="info-value">${formatDate(currentInvoice.paymentDate)}</div>
                </div>
            ` : ''}
        </div>
    `;
    
    document.getElementById('modal-invoice-content').innerHTML = content;
    openModal('modal-invoice-details');
}

// ================================================
// NAVIGATION ACTIONS
// ================================================

function editInvoice(invoiceId) {
    window.location.href = `./facture-create.html?id=${invoiceId}`;
}

function perform3WayMatching(invoiceId) {
    const invoice = allInvoices.find(inv => inv.id === invoiceId);
    if (invoice) {
        window.location.href = `./rapprochement-3way.html?invoice=${invoiceId}&bcf=${invoice.bcfCode}`;
    }
}

function registerPayment(invoiceId) {
    if (confirm('Enregistrer le paiement de cette facture ?')) {
        console.log('💰 Paiement enregistré pour:', invoiceId);
        alert('Paiement enregistré avec succès');
        window.location.reload();
    }
}

function viewInvoicePDF() {
    if (currentInvoice) {
        console.log('📄 Ouverture PDF:', currentInvoice.invoiceNumber);
        alert('Ouverture du PDF de la facture...');
    }
}

// ================================================
// HELPERS
// ================================================

function getStatusBadge(status, dueDate) {
    // Check if overdue
    if (status !== 'PAYEE' && status !== 'BROUILLON') {
        const today = new Date();
        const due = new Date(dueDate);
        if (due < today) {
            return '<span class="badge badge-danger"><i class="fa-solid fa-exclamation-triangle"></i> En retard</span>';
        }
    }
    
    const badges = {
        'BROUILLON': '<span class="badge badge-secondary"><i class="fa-solid fa-file"></i> Brouillon</span>',
        'VALIDEE': '<span class="badge badge-info"><i class="fa-solid fa-check"></i> Validée</span>',
        'EN_ATTENTE': '<span class="badge badge-warning"><i class="fa-solid fa-clock"></i> En attente</span>',
        'PAYEE': '<span class="badge badge-success"><i class="fa-solid fa-check-circle"></i> Payée</span>',
        'EN_RETARD': '<span class="badge badge-danger"><i class="fa-solid fa-exclamation-triangle"></i> En retard</span>'
    };
    return badges[status] || status;
}

function isInvoiceOverdue(inv) {
    if (inv.status === 'PAYEE' || inv.status === 'BROUILLON') return false;
    const today = new Date();
    const dueDate = new Date(inv.dueDate);
    return dueDate < today;
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
    currentInvoice = null;
}



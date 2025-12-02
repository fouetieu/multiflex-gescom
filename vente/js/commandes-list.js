// ================================================
// COMMANDES-LIST.JS
// Gestion de la liste des bons de commande client
// Conforme au wireframe ECR-CMD-001
// ================================================

// État global
let currentPage = 1;
const itemsPerPage = 10;
let currentStatus = 'all';
let sortField = 'date';
let sortOrder = 'desc';
let selectedOrders = [];

// Données simulées
const ordersData = [
    {
        id: 1,
        ref: 'BC-CLI156-2024-00234',
        date: '28/01/2024',
        time: '10:30',
        clientCode: 'CLI-2024-00156',
        clientName: 'SONACOM SARL',
        clientType: 'ENTREPRISE',
        contactName: 'Pierre FOTSO',
        contactPhone: '+237 699 123 456',
        amount: 2500000,
        deliveryDate: '02/02/2024',
        daysToDelivery: 5,
        paymentMode: 'CREDIT',
        paymentTerms: 30,
        cautionPercent: 70,
        cautionStatus: 'ok',
        status: 'PENDING',
        statusLabel: 'En validation',
        urgent: false,
        validationLevel: null,
        commercial: 'Marie DJOMO',
        commercialCode: 'COM-025',
        items: 12,
        weight: 450,
        volume: 2.3,
        deliveryAddress: 'Boulevard Liberté, Bonanjo, Douala',
        transportPlanned: false,
        documentsOk: true
    },
    {
        id: 2,
        ref: 'BC-CLI089-2024-00089',
        date: '28/01/2024',
        time: '09:15',
        clientCode: 'CLI-2024-00089',
        clientName: 'QUINCAILLERIE MODERNE',
        clientType: 'QUINCAILLERIE',
        contactName: 'Jean NJOYA',
        contactPhone: '+237 677 890 123',
        amount: 850000,
        deliveryDate: '30/01/2024',
        daysToDelivery: 2,
        paymentMode: 'CASH',
        paymentTerms: 0,
        cautionPercent: null,
        cautionStatus: null,
        status: 'VALIDATED',
        statusLabel: 'Validé',
        urgent: false,
        validationLevel: null,
        commercial: 'Marie DJOMO',
        commercialCode: 'COM-025',
        items: 8,
        weight: 120,
        volume: 0.8,
        deliveryAddress: 'Marché Central, Douala',
        transportPlanned: true,
        documentsOk: true
    },
    {
        id: 3,
        ref: 'BC-CLI234-2024-00456',
        date: '27/01/2024',
        time: '14:20',
        clientCode: 'CLI-2024-00234',
        clientName: 'KAMGA Jean Paul',
        clientType: 'PARTICULIER',
        contactName: 'KAMGA Jean Paul',
        contactPhone: '+237 655 234 567',
        amount: 150000,
        deliveryDate: '29/01/2024',
        daysToDelivery: 0,
        paymentMode: 'CASH',
        paymentTerms: 0,
        cautionPercent: null,
        cautionStatus: null,
        status: 'IN_DELIVERY',
        statusLabel: 'En livraison',
        deliveryPercent: 50,
        urgent: true,
        validationLevel: null,
        commercial: 'Marie DJOMO',
        commercialCode: 'COM-025',
        items: 3,
        weight: 25,
        volume: 0.2,
        deliveryAddress: 'Akwa, Douala',
        transportPlanned: true,
        documentsOk: true
    },
    {
        id: 4,
        ref: 'BC-CLI312-2024-00178',
        date: '27/01/2024',
        time: '11:45',
        clientCode: 'CLI-2024-00312',
        clientName: 'TECHNI-BUILD',
        clientType: 'ENTREPRISE',
        contactName: 'Paul MBARGA',
        contactPhone: '+237 699 456 789',
        amount: 3200000,
        deliveryDate: '05/02/2024',
        daysToDelivery: 8,
        paymentMode: 'CREDIT',
        paymentTerms: 45,
        cautionPercent: 70,
        cautionStatus: 'insufficient',
        status: 'REJECTED',
        statusLabel: 'Rejeté',
        urgent: false,
        validationLevel: null,
        rejectReason: 'Caution insuffisante',
        commercial: 'Jean FOTSO',
        commercialCode: 'COM-018',
        items: 15,
        weight: 890,
        volume: 4.5,
        deliveryAddress: 'Zone Industrielle, Douala',
        transportPlanned: false,
        documentsOk: true
    },
    {
        id: 5,
        ref: 'BC-CLI445-2024-00067',
        date: '26/01/2024',
        time: '16:30',
        clientCode: 'CLI-2024-00445',
        clientName: 'ENTREPRISE XYZ',
        clientType: 'ENTREPRISE',
        contactName: 'Marie BELL',
        contactPhone: '+237 690 123 456',
        amount: 5500000,
        deliveryDate: '15/02/2024',
        daysToDelivery: 18,
        paymentMode: 'CREDIT',
        paymentTerms: 60,
        cautionPercent: 70,
        cautionStatus: 'ok',
        status: 'PENDING',
        statusLabel: 'En attente',
        urgent: false,
        validationLevel: 'N+2',
        validationReason: 'Montant > 5M XAF',
        commercial: 'Jean FOTSO',
        commercialCode: 'COM-018',
        items: 25,
        weight: 1200,
        volume: 8.5,
        deliveryAddress: 'Bassa, Douala',
        transportPlanned: false,
        documentsOk: true
    },
    {
        id: 6,
        ref: 'BC-CLI156-2024-00198',
        date: '25/01/2024',
        time: '08:45',
        clientCode: 'CLI-2024-00156',
        clientName: 'SONACOM SARL',
        clientType: 'ENTREPRISE',
        contactName: 'Pierre FOTSO',
        contactPhone: '+237 699 123 456',
        amount: 1850000,
        deliveryDate: '28/01/2024',
        daysToDelivery: -1,
        paymentMode: 'CREDIT',
        paymentTerms: 30,
        cautionPercent: 70,
        cautionStatus: 'ok',
        status: 'DELIVERED',
        statusLabel: 'Livré',
        urgent: false,
        validationLevel: null,
        commercial: 'Marie DJOMO',
        commercialCode: 'COM-025',
        items: 10,
        weight: 320,
        volume: 1.8,
        deliveryAddress: 'Boulevard Liberté, Bonanjo, Douala',
        transportPlanned: true,
        documentsOk: true
    },
    {
        id: 7,
        ref: 'BC-CLI089-2024-00056',
        date: '24/01/2024',
        time: '15:00',
        clientCode: 'CLI-2024-00089',
        clientName: 'QUINCAILLERIE MODERNE',
        clientType: 'QUINCAILLERIE',
        contactName: 'Jean NJOYA',
        contactPhone: '+237 677 890 123',
        amount: 620000,
        deliveryDate: '26/01/2024',
        daysToDelivery: -3,
        paymentMode: 'CASH',
        paymentTerms: 0,
        cautionPercent: null,
        cautionStatus: null,
        status: 'INVOICED',
        statusLabel: 'Facturé',
        urgent: false,
        validationLevel: null,
        invoiceRef: 'FA-2024-00234',
        commercial: 'Marie DJOMO',
        commercialCode: 'COM-025',
        items: 6,
        weight: 85,
        volume: 0.5,
        deliveryAddress: 'Marché Central, Douala',
        transportPlanned: true,
        documentsOk: true
    },
    {
        id: 8,
        ref: 'BC-CLI567-2024-00345',
        date: '23/01/2024',
        time: '11:20',
        clientCode: 'CLI-2024-00567',
        clientName: 'MENUISERIE FOKAM',
        clientType: 'TECHNICIEN',
        contactName: 'FOKAM Albert',
        contactPhone: '+237 699 567 890',
        amount: 450000,
        deliveryDate: '25/01/2024',
        daysToDelivery: -4,
        paymentMode: 'CREDIT',
        paymentTerms: 15,
        cautionPercent: 70,
        cautionStatus: 'ok',
        status: 'INVOICED',
        statusLabel: 'Facturé',
        urgent: false,
        validationLevel: null,
        invoiceRef: 'FA-2024-00212',
        commercial: 'Paul NGA',
        commercialCode: 'COM-032',
        items: 4,
        weight: 60,
        volume: 0.4,
        deliveryAddress: 'Ndokoti, Douala',
        transportPlanned: true,
        documentsOk: true
    }
];

// ================================================
// INITIALISATION
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Initialisation de la liste des commandes...');
    loadOrders();
    updateStats();
});

// ================================================
// CHARGEMENT DES DONNÉES
// ================================================

function loadOrders() {
    const filteredOrders = filterOrders();
    const sortedOrders = sortOrders(filteredOrders);
    const paginatedOrders = paginateOrders(sortedOrders);

    renderOrders(paginatedOrders);
    renderPagination(sortedOrders.length);
    updateBulkActions();
}

function filterOrders() {
    let filtered = [...ordersData];

    // Filter by status
    if (currentStatus !== 'all') {
        filtered = filtered.filter(o => o.status === currentStatus);
    }

    // Filter by reference
    const refFilter = document.getElementById('filter-ref')?.value?.trim().toLowerCase();
    if (refFilter) {
        filtered = filtered.filter(o => o.ref.toLowerCase().includes(refFilter));
    }

    // Filter by client
    const clientFilter = document.getElementById('filter-client')?.value?.trim().toLowerCase();
    if (clientFilter) {
        filtered = filtered.filter(o =>
            o.clientName.toLowerCase().includes(clientFilter) ||
            o.contactName.toLowerCase().includes(clientFilter)
        );
    }

    // Filter by commercial
    const commercialFilter = document.getElementById('filter-commercial')?.value;
    if (commercialFilter === 'mine') {
        filtered = filtered.filter(o => o.commercialCode === 'COM-025'); // Current user
    } else if (commercialFilter) {
        filtered = filtered.filter(o => o.commercialCode === commercialFilter);
    }

    // Filter by payment mode
    const paymentFilter = document.getElementById('filter-payment')?.value;
    if (paymentFilter) {
        filtered = filtered.filter(o => o.paymentMode === paymentFilter);
    }

    // Filter by urgency
    const urgencyFilter = document.getElementById('filter-urgency')?.value;
    if (urgencyFilter === 'urgent') {
        filtered = filtered.filter(o => o.urgent);
    } else if (urgencyFilter === 'normal') {
        filtered = filtered.filter(o => !o.urgent);
    }

    // Filter by amount
    const amountMin = parseFloat(document.getElementById('filter-amount-min')?.value) || 0;
    const amountMax = parseFloat(document.getElementById('filter-amount-max')?.value) || Infinity;
    filtered = filtered.filter(o => o.amount >= amountMin && o.amount <= amountMax);

    return filtered;
}

function sortOrders(orders) {
    return orders.sort((a, b) => {
        let comparison = 0;

        switch (sortField) {
            case 'ref':
                comparison = a.ref.localeCompare(b.ref);
                break;
            case 'date':
                comparison = new Date(a.date.split('/').reverse().join('-')) -
                             new Date(b.date.split('/').reverse().join('-'));
                break;
            case 'amount':
                comparison = a.amount - b.amount;
                break;
            case 'client':
                comparison = a.clientName.localeCompare(b.clientName);
                break;
            default:
                comparison = 0;
        }

        return sortOrder === 'asc' ? comparison : -comparison;
    });
}

function paginateOrders(orders) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return orders.slice(startIndex, startIndex + itemsPerPage);
}

// ================================================
// RENDU
// ================================================

function renderOrders(orders) {
    const tbody = document.getElementById('orders-table-body');
    const emptyState = document.getElementById('empty-state');

    if (orders.length === 0) {
        tbody.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    tbody.innerHTML = orders.map(order => {
        const rowClass = order.urgent ? 'order-row urgent' :
                         order.cautionStatus === 'insufficient' ? 'order-row caution-warning' : 'order-row';

        const statusClass = getStatusClass(order.status);
        const isSelected = selectedOrders.includes(order.id);

        return `
            <tr class="${rowClass}" data-id="${order.id}"
                onmouseenter="showTooltip(event, ${order.id})"
                onmouseleave="hideTooltip()">
                <td>
                    <input type="checkbox" ${isSelected ? 'checked' : ''} onchange="toggleOrderSelection(${order.id}, this.checked)">
                </td>
                <td>
                    <a href="#" onclick="viewOrder(${order.id})" style="color: #263c89; font-weight: 600; text-decoration: none;">
                        ${order.ref}
                    </a>
                    <div style="font-size: 11px; color: #9CA3AF;">${order.time}</div>
                </td>
                <td>
                    <div style="font-weight: 500;">${order.date}</div>
                </td>
                <td>
                    <div class="client-info">
                        <span class="client-name">${order.clientName}</span>
                        <span class="client-contact">└ ${order.contactName}</span>
                        <span class="client-phone">☎️ ${order.contactPhone.replace('+237 ', '')}</span>
                    </div>
                </td>
                <td style="text-align: right;">
                    <div style="font-weight: 600; color: #1F2937;">${formatMoney(order.amount)} XAF</div>
                </td>
                <td>
                    <div class="delivery-info">
                        <span class="delivery-date">${order.deliveryDate}</span>
                        ${order.daysToDelivery !== null ? `
                            <span class="delivery-days ${order.daysToDelivery <= 0 ? 'urgent' : ''}">
                                ${order.daysToDelivery < 0 ? 'Échu' : order.daysToDelivery === 0 ? 'Aujourd\'hui' : order.daysToDelivery + 'j'}
                            </span>
                        ` : ''}
                        ${order.urgent ? '<span class="urgent-badge"><i class="fa-solid fa-fire"></i> URG</span>' : ''}
                    </div>
                </td>
                <td>
                    <div class="payment-info">
                        <span class="payment-mode ${order.paymentMode.toLowerCase()}">${order.paymentMode === 'CREDIT' ? 'CRÉDIT' : 'CASH'}</span>
                        ${order.paymentMode === 'CREDIT' ? `
                            <span style="font-size: 11px; color: #6B7280;">${order.paymentTerms}j</span>
                            ${order.cautionStatus === 'insufficient' ?
                                '<span class="caution-indicator danger">!Cau Insuf</span>' :
                                `<span class="caution-indicator">${order.cautionPercent}% Caut</span>`
                            }
                        ` : '<span style="font-size: 11px; color: #10B981;">Comptant</span>'}
                    </div>
                </td>
                <td>
                    <span class="status-badge ${statusClass}">${order.statusLabel}</span>
                    ${order.validationLevel ? `<span class="validation-level">${order.validationLevel}</span>` : ''}
                    ${order.deliveryPercent ? `<div style="font-size: 10px; color: #6B7280; margin-top: 2px;">${order.deliveryPercent}%</div>` : ''}
                </td>
                <td style="text-align: center;">
                    <div class="action-buttons">
                        <button class="btn-icon" onclick="viewOrder(${order.id})" title="Voir">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        <div class="dropdown">
                            <button class="btn-icon" onclick="toggleDropdown(this)" title="Actions">
                                <i class="fa-solid fa-ellipsis-v"></i>
                            </button>
                            <div class="dropdown-menu">
                                <a href="#" onclick="editOrder(${order.id})"><i class="fa-solid fa-edit"></i> Modifier</a>
                                <a href="#" onclick="duplicateOrder(${order.id})"><i class="fa-solid fa-copy"></i> Dupliquer</a>
                                ${order.status === 'VALIDATED' ? `<a href="#" onclick="planDelivery(${order.id})"><i class="fa-solid fa-truck"></i> Planifier livraison</a>` : ''}
                                ${order.status === 'DELIVERED' ? `<a href="#" onclick="generateInvoice(${order.id})"><i class="fa-solid fa-file-invoice"></i> Générer facture</a>` : ''}
                                <a href="#" onclick="printOrder(${order.id})"><i class="fa-solid fa-print"></i> Imprimer</a>
                                <div class="dropdown-divider"></div>
                                <a href="#" onclick="cancelOrder(${order.id})" style="color: #EF4444;"><i class="fa-solid fa-ban"></i> Annuler</a>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function getStatusClass(status) {
    const statusClasses = {
        'PENDING': 'status-badge-warning',
        'VALIDATED': 'status-badge-success',
        'IN_DELIVERY': 'status-badge-info',
        'DELIVERED': 'status-badge-success',
        'INVOICED': 'status-badge-purple',
        'REJECTED': 'status-badge-danger',
        'CANCELLED': 'status-badge-secondary',
        'BLOCKED': 'status-badge-danger'
    };
    return statusClasses[status] || 'status-badge-secondary';
}

function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const from = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems);
    const to = Math.min(currentPage * itemsPerPage, totalItems);

    document.getElementById('pagination-from').textContent = from;
    document.getElementById('pagination-to').textContent = to;
    document.getElementById('pagination-total').textContent = totalItems;

    const controls = document.getElementById('pagination-controls');
    let html = '';

    // Previous button
    html += `<button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="goToPage(${currentPage - 1})">
        <i class="fa-solid fa-chevron-left"></i>
    </button>`;

    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
        html += `<button class="pagination-btn" onclick="goToPage(1)">1</button>`;
        if (startPage > 2) {
            html += `<span class="pagination-ellipsis">...</span>`;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        html += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            html += `<span class="pagination-ellipsis">...</span>`;
        }
        html += `<button class="pagination-btn" onclick="goToPage(${totalPages})">${totalPages}</button>`;
    }

    // Next button
    html += `<button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="goToPage(${currentPage + 1})">
        <i class="fa-solid fa-chevron-right"></i>
    </button>`;

    controls.innerHTML = html;
}

function updateStats() {
    // Ces valeurs seraient normalement calculées depuis les données
    document.getElementById('stat-pending').textContent = '45';
    document.getElementById('stat-validated').textContent = '12';
    document.getElementById('stat-amount').textContent = '15,450,000 XAF';
    document.getElementById('stat-caution').textContent = '45,230,000 XAF';
}

// ================================================
// FILTRES
// ================================================

function filterByStatus(status) {
    currentStatus = status;
    currentPage = 1;

    // Update UI
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.classList.remove('active');
        if (chip.dataset.status === status) {
            chip.classList.add('active');
        }
    });

    loadOrders();
}

function toggleAdvancedFilters() {
    const filters = document.getElementById('advanced-filters');
    filters.style.display = filters.style.display === 'none' ? 'block' : 'none';
}

function applyFilters() {
    currentPage = 1;
    loadOrders();
}

function resetFilters() {
    document.getElementById('filter-ref').value = '';
    document.getElementById('filter-client').value = '';
    document.getElementById('filter-commercial').value = '';
    document.getElementById('filter-period').value = 'week';
    document.getElementById('filter-urgency').value = '';
    document.getElementById('filter-payment').value = '';
    document.getElementById('filter-company').value = '';
    document.getElementById('filter-amount-min').value = '';
    document.getElementById('filter-amount-max').value = '';

    currentStatus = 'all';
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.classList.remove('active');
        if (chip.dataset.status === 'all') {
            chip.classList.add('active');
        }
    });

    currentPage = 1;
    loadOrders();
}

// ================================================
// TRI
// ================================================

function sortBy(field) {
    if (sortField === field) {
        sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        sortField = field;
        sortOrder = 'desc';
    }
    loadOrders();
}

// ================================================
// PAGINATION
// ================================================

function goToPage(page) {
    const filteredOrders = filterOrders();
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

    if (page < 1 || page > totalPages) return;

    currentPage = page;
    loadOrders();
}

// ================================================
// SÉLECTION
// ================================================

function toggleSelectAll() {
    const selectAllCheckbox = document.getElementById('select-all');
    const filteredOrders = filterOrders();
    const paginatedOrders = paginateOrders(filteredOrders);

    if (selectAllCheckbox.checked) {
        selectedOrders = [...new Set([...selectedOrders, ...paginatedOrders.map(o => o.id)])];
    } else {
        const pageIds = paginatedOrders.map(o => o.id);
        selectedOrders = selectedOrders.filter(id => !pageIds.includes(id));
    }

    loadOrders();
}

function toggleOrderSelection(orderId, checked) {
    if (checked) {
        if (!selectedOrders.includes(orderId)) {
            selectedOrders.push(orderId);
        }
    } else {
        selectedOrders = selectedOrders.filter(id => id !== orderId);
    }

    updateBulkActions();
}

function updateBulkActions() {
    const bulkActions = document.getElementById('bulk-actions');
    const selectedCount = document.getElementById('selected-count');
    const selectedTotal = document.getElementById('selected-total');

    if (selectedOrders.length > 0) {
        bulkActions.classList.add('visible');
        selectedCount.textContent = selectedOrders.length;

        const total = ordersData
            .filter(o => selectedOrders.includes(o.id))
            .reduce((sum, o) => sum + o.amount, 0);
        selectedTotal.textContent = formatMoney(total);
    } else {
        bulkActions.classList.remove('visible');
    }
}

// ================================================
// TOOLTIP
// ================================================

function showTooltip(event, orderId) {
    const order = ordersData.find(o => o.id === orderId);
    if (!order) return;

    const tooltip = document.getElementById('order-tooltip');

    tooltip.innerHTML = `
        <div class="tooltip-header">
            <span class="tooltip-title">${order.ref} - ${order.clientName}</span>
            <span class="status-badge ${getStatusClass(order.status)}">${order.statusLabel}</span>
        </div>
        <div class="tooltip-grid">
            <div class="tooltip-item">
                <span class="tooltip-label">Articles</span>
                <span class="tooltip-value">${order.items} lignes</span>
            </div>
            <div class="tooltip-item">
                <span class="tooltip-label">Poids</span>
                <span class="tooltip-value">${order.weight} kg</span>
            </div>
            <div class="tooltip-item">
                <span class="tooltip-label">Volume</span>
                <span class="tooltip-value">${order.volume} m³</span>
            </div>
            <div class="tooltip-item">
                <span class="tooltip-label">Commercial</span>
                <span class="tooltip-value">${order.commercial}</span>
            </div>
            <div class="tooltip-item" style="grid-column: 1 / -1;">
                <span class="tooltip-label">Adresse livraison</span>
                <span class="tooltip-value">${order.deliveryAddress}</span>
            </div>
            <div class="tooltip-item">
                <span class="tooltip-label">Transport</span>
                <span class="tooltip-value">${order.transportPlanned ? 'Planifié' : 'Non planifié'}</span>
            </div>
            <div class="tooltip-item">
                <span class="tooltip-label">Documents</span>
                <span class="tooltip-value">${order.documentsOk ? '<i class="fa-solid fa-check-circle" style="color: #10B981;"></i> OK' : '<i class="fa-solid fa-exclamation-triangle" style="color: #F59E0B;"></i> Incomplets'}</span>
            </div>
        </div>
        <div class="tooltip-actions">
            <button class="btn btn-secondary btn-sm" onclick="viewOrder(${order.id})">
                <i class="fa-solid fa-eye"></i> Voir
            </button>
            <button class="btn btn-secondary btn-sm" onclick="editOrder(${order.id})">
                <i class="fa-solid fa-edit"></i> Modifier
            </button>
            <button class="btn btn-secondary btn-sm" onclick="duplicateOrder(${order.id})">
                <i class="fa-solid fa-copy"></i> Dupliquer
            </button>
            ${order.status === 'VALIDATED' ? `
                <button class="btn btn-primary btn-sm" onclick="planDelivery(${order.id})">
                    <i class="fa-solid fa-truck"></i> Livrer
                </button>
            ` : ''}
        </div>
    `;

    // Position tooltip
    const rect = event.target.closest('tr').getBoundingClientRect();
    tooltip.style.top = (rect.bottom + window.scrollY + 5) + 'px';
    tooltip.style.left = Math.min(rect.left, window.innerWidth - 380) + 'px';
    tooltip.classList.add('visible');
}

function hideTooltip() {
    const tooltip = document.getElementById('order-tooltip');
    tooltip.classList.remove('visible');
}

// ================================================
// ACTIONS
// ================================================

function viewOrder(orderId) {
    const order = ordersData.find(o => o.id === orderId);
    if (!order) return;

    document.getElementById('modal-order-code').textContent = order.ref;

    const content = document.getElementById('modal-order-content');
    content.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
            <div>
                <h4 style="font-size: 14px; font-weight: 600; color: #263c89; margin-bottom: 12px;">
                    <i class="fa-solid fa-info-circle"></i> Informations Générales
                </h4>
                <div style="background: #F9FAFB; padding: 16px; border-radius: 8px;">
                    <div style="margin-bottom: 12px;">
                        <div style="font-size: 11px; color: #6B7280;">Référence</div>
                        <div style="font-weight: 600;">${order.ref}</div>
                    </div>
                    <div style="margin-bottom: 12px;">
                        <div style="font-size: 11px; color: #6B7280;">Date</div>
                        <div>${order.date} à ${order.time}</div>
                    </div>
                    <div style="margin-bottom: 12px;">
                        <div style="font-size: 11px; color: #6B7280;">Statut</div>
                        <div><span class="status-badge ${getStatusClass(order.status)}">${order.statusLabel}</span></div>
                    </div>
                    <div>
                        <div style="font-size: 11px; color: #6B7280;">Commercial</div>
                        <div>${order.commercial}</div>
                    </div>
                </div>
            </div>

            <div>
                <h4 style="font-size: 14px; font-weight: 600; color: #263c89; margin-bottom: 12px;">
                    <i class="fa-solid fa-user"></i> Client
                </h4>
                <div style="background: #F9FAFB; padding: 16px; border-radius: 8px;">
                    <div style="margin-bottom: 12px;">
                        <div style="font-size: 11px; color: #6B7280;">Nom</div>
                        <div style="font-weight: 600;">${order.clientName}</div>
                    </div>
                    <div style="margin-bottom: 12px;">
                        <div style="font-size: 11px; color: #6B7280;">Contact</div>
                        <div>${order.contactName}</div>
                    </div>
                    <div>
                        <div style="font-size: 11px; color: #6B7280;">Téléphone</div>
                        <div>${order.contactPhone}</div>
                    </div>
                </div>
            </div>

            <div>
                <h4 style="font-size: 14px; font-weight: 600; color: #263c89; margin-bottom: 12px;">
                    <i class="fa-solid fa-truck"></i> Livraison
                </h4>
                <div style="background: #F9FAFB; padding: 16px; border-radius: 8px;">
                    <div style="margin-bottom: 12px;">
                        <div style="font-size: 11px; color: #6B7280;">Date souhaitée</div>
                        <div style="font-weight: 500;">${order.deliveryDate}</div>
                    </div>
                    <div style="margin-bottom: 12px;">
                        <div style="font-size: 11px; color: #6B7280;">Adresse</div>
                        <div>${order.deliveryAddress}</div>
                    </div>
                    <div>
                        <div style="font-size: 11px; color: #6B7280;">Transport</div>
                        <div>${order.transportPlanned ? 'Planifié' : 'Non planifié'}</div>
                    </div>
                </div>
            </div>

            <div>
                <h4 style="font-size: 14px; font-weight: 600; color: #263c89; margin-bottom: 12px;">
                    <i class="fa-solid fa-coins"></i> Paiement
                </h4>
                <div style="background: #F9FAFB; padding: 16px; border-radius: 8px;">
                    <div style="margin-bottom: 12px;">
                        <div style="font-size: 11px; color: #6B7280;">Montant TTC</div>
                        <div style="font-size: 18px; font-weight: 700; color: #263c89;">${formatMoney(order.amount)} XAF</div>
                    </div>
                    <div style="margin-bottom: 12px;">
                        <div style="font-size: 11px; color: #6B7280;">Mode</div>
                        <div><span class="payment-mode ${order.paymentMode.toLowerCase()}">${order.paymentMode === 'CREDIT' ? 'CRÉDIT' : 'COMPTANT'}</span></div>
                    </div>
                    ${order.paymentMode === 'CREDIT' ? `
                    <div>
                        <div style="font-size: 11px; color: #6B7280;">Délai</div>
                        <div>${order.paymentTerms} jours</div>
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>

        <div style="margin-top: 24px;">
            <h4 style="font-size: 14px; font-weight: 600; color: #263c89; margin-bottom: 12px;">
                <i class="fa-solid fa-box"></i> Articles (${order.items} lignes)
            </h4>
            <div style="background: #F9FAFB; padding: 16px; border-radius: 8px; text-align: center; color: #6B7280;">
                Affichage des lignes de commande...
            </div>
        </div>
    `;

    openModal('modal-order-details');
}

function editOrder(orderId) {
    window.location.href = `./commande-create.html?edit=${orderId}`;
}

function duplicateOrder(orderId) {
    if (confirm('Dupliquer cette commande ?')) {
        alert('Commande dupliquée');
        window.location.href = `./commande-create.html?duplicate=${orderId}`;
    }
}

function cancelOrder(orderId) {
    const order = ordersData.find(o => o.id === orderId);
    if (!order) return;

    document.getElementById('cancel-order-code').textContent = order.ref;
    openModal('modal-cancel-order');
}

function confirmCancelOrder() {
    const reason = document.getElementById('cancel-reason').value.trim();
    if (!reason) {
        alert('Le motif d\'annulation est obligatoire');
        return;
    }

    closeModal('modal-cancel-order');
    alert('Commande annulée');
    loadOrders();
}

function planDelivery(orderId) {
    alert(`Planification livraison pour la commande ${orderId}`);
}

function generateInvoice(orderId) {
    alert(`Génération facture pour la commande ${orderId}`);
}

function printOrder(orderId) {
    alert(`Impression de la commande ${orderId}`);
}

function editOrderFromModal() {
    const code = document.getElementById('modal-order-code').textContent;
    const order = ordersData.find(o => o.ref === code);
    if (order) {
        editOrder(order.id);
    }
}

// ================================================
// ACTIONS GROUPÉES
// ================================================

function bulkDuplicate() {
    if (selectedOrders.length === 0) return;
    if (confirm(`Dupliquer ${selectedOrders.length} commande(s) ?`)) {
        alert(`${selectedOrders.length} commande(s) dupliquée(s)`);
        selectedOrders = [];
        loadOrders();
    }
}

function bulkPlanDelivery() {
    if (selectedOrders.length === 0) return;
    alert(`Planification livraison pour ${selectedOrders.length} commande(s)`);
}

function bulkTransform() {
    if (selectedOrders.length === 0) return;
    alert(`Transformation de ${selectedOrders.length} commande(s) en factures`);
}

function bulkCancel() {
    if (selectedOrders.length === 0) return;
    if (confirm(`Annuler ${selectedOrders.length} commande(s) ?`)) {
        alert(`${selectedOrders.length} commande(s) annulée(s)`);
        selectedOrders = [];
        loadOrders();
    }
}

// ================================================
// EXPORT & PIPELINE
// ================================================

function exportOrders() {
    alert('Export des commandes en cours...');
}

function viewPipeline() {
    alert('Affichage du pipeline des commandes');
}

// ================================================
// MODALS
// ================================================

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// ================================================
// DROPDOWNS
// ================================================

function toggleDropdown(button) {
    const dropdown = button.nextElementSibling;
    const isOpen = dropdown.classList.contains('show');

    // Close all dropdowns
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.classList.remove('show');
    });

    if (!isOpen) {
        dropdown.classList.add('show');
    }
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.remove('show');
        });
    }
});

// ================================================
// HELPERS
// ================================================

function formatMoney(amount) {
    return new Intl.NumberFormat('fr-FR').format(amount);
}

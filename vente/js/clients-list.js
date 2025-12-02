// ================================================
// CLIENTS-LIST.JS
// Gestion de la liste des clients - Conforme aux spécifications ECR-CLI-001
// ================================================

// État global
let customers = [];
let filteredCustomers = [];
let currentPage = 1;
let itemsPerPage = 20;
let sortColumn = 'code';
let sortDirection = 'asc';
let currentQuickFilter = 'all';
let customerToAction = null;
let selectedCustomers = [];

// ================================================
// INITIALISATION
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Initialisation de la gestion des clients...');
    loadCustomers();
});

// ================================================
// CHARGEMENT DES DONNÉES
// ================================================

function loadCustomers() {
    // Simuler le chargement depuis une API
    customers = generateMockCustomers();

    filteredCustomers = [...customers];
    updateStats();
    updateQuickFilterCounts();
    applyFilters();
}

function generateMockCustomers() {
    return [
        {
            id: 'CLI-2024-00156',
            code: 'CLI-2024-00156',
            businessName: 'SONACOM SARL',
            firstName: null,
            lastName: null,
            customerType: 'ENTREPRISE',
            taxId: 'P087201234567W',
            cniNumber: null,
            phone: '+237 699 123 456',
            email: 'contact@sonacom.cm',
            category: 'GROSSISTE',
            commercial: {
                id: 'COM001',
                name: 'M. DJOMO',
                cautionTotal: 5000000,
                cautionAvailable: 3000000
            },
            financials: {
                currentBalance: 2500000,
                creditLimit: 5000000,
                paymentTerms: 30,
                paymentCondition: 'CREDIT'
            },
            status: 'ACTIVE',
            blockedForSales: false,
            documents: [
                {
                    type: 'ATTESTATION_NON_REDEVANCE',
                    expiryDate: '2024-06-15',
                    status: 'VALID',
                    daysToExpiry: 180
                }
            ],
            paymentBehavior: 'EXCELLENT',
            lastOrderDate: '2024-01-10',
            totalOrders: 156,
            createdAt: '2023-03-15'
        },
        {
            id: 'CLI-2024-00234',
            code: 'CLI-2024-00234',
            businessName: null,
            firstName: 'Jean Paul',
            lastName: 'KAMGA',
            customerType: 'PARTICULIER',
            taxId: null,
            cniNumber: '1234567890123',
            phone: '+237 677 890 123',
            email: 'jp.kamga@email.cm',
            category: null,
            commercial: {
                id: 'COM002',
                name: 'P. NGONO',
                cautionTotal: 3000000,
                cautionAvailable: 2500000
            },
            financials: {
                currentBalance: 0,
                creditLimit: 0,
                paymentTerms: 0,
                paymentCondition: 'CASH'
            },
            status: 'ACTIVE',
            blockedForSales: false,
            documents: [],
            paymentBehavior: 'GOOD',
            lastOrderDate: '2024-01-08',
            totalOrders: 23,
            createdAt: '2024-01-02'
        },
        {
            id: 'CLI-2023-00089',
            code: 'CLI-2023-00089',
            businessName: 'QUINCAILLERIE MODERNE',
            firstName: null,
            lastName: null,
            customerType: 'QUINCAILLERIE',
            taxId: 'P098765432109W',
            cniNumber: null,
            phone: '+237 699 456 789',
            email: 'quinc.moderne@email.cm',
            category: 'DETAILLANT',
            commercial: {
                id: 'COM001',
                name: 'M. DJOMO',
                cautionTotal: 5000000,
                cautionAvailable: 0
            },
            financials: {
                currentBalance: 5200000,
                creditLimit: 5000000,
                paymentTerms: 30,
                paymentCondition: 'CREDIT'
            },
            status: 'BLOCKED',
            blockedForSales: true,
            blockReason: 'Limite crédit dépassée',
            documents: [
                {
                    type: 'ATTESTATION_NON_REDEVANCE',
                    expiryDate: '2024-02-01',
                    status: 'EXPIRING_SOON',
                    daysToExpiry: 15
                }
            ],
            paymentBehavior: 'POOR',
            lastOrderDate: '2023-12-20',
            totalOrders: 89,
            createdAt: '2023-05-10'
        },
        {
            id: 'CLI-2024-00312',
            code: 'CLI-2024-00312',
            businessName: 'TECHNI-BUILD',
            firstName: null,
            lastName: null,
            customerType: 'TECHNICIEN',
            taxId: 'P076543210987W',
            cniNumber: null,
            phone: '+237 655 234 567',
            email: 'contact@technibuild.cm',
            category: 'APPLICATEUR',
            commercial: {
                id: 'COM003',
                name: 'J. FOTSO',
                cautionTotal: 4000000,
                cautionAvailable: 2200000
            },
            financials: {
                currentBalance: 1800000,
                creditLimit: 3000000,
                paymentTerms: 30,
                paymentCondition: 'CREDIT'
            },
            status: 'ACTIVE',
            blockedForSales: false,
            documents: [
                {
                    type: 'ATTESTATION_NON_REDEVANCE',
                    expiryDate: '2024-08-15',
                    status: 'VALID',
                    daysToExpiry: 220
                }
            ],
            paymentBehavior: 'GOOD',
            lastOrderDate: '2024-01-12',
            totalOrders: 45,
            createdAt: '2024-01-05',
            overdueAmount: 500000,
            overdueDays: 25
        },
        {
            id: 'CLI-2023-00567',
            code: 'CLI-2023-00567',
            businessName: 'CONSTRUCTIONS RAPIDES SA',
            firstName: null,
            lastName: null,
            customerType: 'ENTREPRISE',
            taxId: 'P045678901234W',
            cniNumber: null,
            phone: '+237 699 888 777',
            email: 'contact@constructrap.cm',
            category: 'GROSSISTE',
            commercial: {
                id: 'COM002',
                name: 'P. NGONO',
                cautionTotal: 3000000,
                cautionAvailable: 1500000
            },
            financials: {
                currentBalance: 3500000,
                creditLimit: 8000000,
                paymentTerms: 45,
                paymentCondition: 'CREDIT'
            },
            status: 'ACTIVE',
            blockedForSales: false,
            documents: [
                {
                    type: 'ATTESTATION_NON_REDEVANCE',
                    expiryDate: '2024-12-31',
                    status: 'VALID',
                    daysToExpiry: 350
                }
            ],
            paymentBehavior: 'EXCELLENT',
            lastOrderDate: '2024-01-14',
            totalOrders: 234,
            createdAt: '2022-06-20'
        },
        {
            id: 'CLI-2024-00401',
            code: 'CLI-2024-00401',
            businessName: null,
            firstName: 'Marie',
            lastName: 'NKENG',
            customerType: 'PARTICULIER',
            taxId: null,
            cniNumber: '9876543210987',
            phone: '+237 677 111 222',
            email: 'marie.nkeng@email.cm',
            category: null,
            commercial: {
                id: 'COM003',
                name: 'J. FOTSO',
                cautionTotal: 4000000,
                cautionAvailable: 3500000
            },
            financials: {
                currentBalance: 0,
                creditLimit: 0,
                paymentTerms: 0,
                paymentCondition: 'CASH'
            },
            status: 'ACTIVE',
            blockedForSales: false,
            documents: [],
            paymentBehavior: 'GOOD',
            lastOrderDate: '2024-01-11',
            totalOrders: 12,
            createdAt: '2024-01-10'
        },
        {
            id: 'CLI-2023-00234',
            code: 'CLI-2023-00234',
            businessName: 'PEINTURE EXPRESS',
            firstName: null,
            lastName: null,
            customerType: 'TECHNICIEN',
            taxId: 'P034567890123W',
            cniNumber: null,
            phone: '+237 655 444 333',
            email: 'peinture.express@email.cm',
            category: 'APPLICATEUR',
            commercial: {
                id: 'COM001',
                name: 'M. DJOMO',
                cautionTotal: 5000000,
                cautionAvailable: 4200000
            },
            financials: {
                currentBalance: 800000,
                creditLimit: 2000000,
                paymentTerms: 15,
                paymentCondition: 'CREDIT'
            },
            status: 'SUSPENDED',
            blockedForSales: false,
            suspensionReason: 'En attente vérification documents',
            documents: [
                {
                    type: 'ATTESTATION_NON_REDEVANCE',
                    expiryDate: '2024-01-05',
                    status: 'EXPIRED',
                    daysToExpiry: -10
                }
            ],
            paymentBehavior: 'AVERAGE',
            lastOrderDate: '2023-12-28',
            totalOrders: 67,
            createdAt: '2023-04-15'
        },
        {
            id: 'CLI-2024-00078',
            code: 'CLI-2024-00078',
            businessName: 'MULTI-QUINCAILLERIE',
            firstName: null,
            lastName: null,
            customerType: 'QUINCAILLERIE',
            taxId: 'P012345678901W',
            cniNumber: null,
            phone: '+237 699 555 666',
            email: 'multi.quinc@email.cm',
            category: 'DETAILLANT',
            commercial: {
                id: 'COM002',
                name: 'P. NGONO',
                cautionTotal: 3000000,
                cautionAvailable: 2800000
            },
            financials: {
                currentBalance: 200000,
                creditLimit: 1500000,
                paymentTerms: 15,
                paymentCondition: 'CREDIT'
            },
            status: 'ACTIVE',
            blockedForSales: false,
            documents: [
                {
                    type: 'ATTESTATION_NON_REDEVANCE',
                    expiryDate: '2024-09-30',
                    status: 'VALID',
                    daysToExpiry: 260
                }
            ],
            paymentBehavior: 'EXCELLENT',
            lastOrderDate: '2024-01-13',
            totalOrders: 34,
            createdAt: '2024-01-03'
        }
    ];
}

// ================================================
// MISE À JOUR DES STATISTIQUES
// ================================================

function updateStats() {
    const active = customers.filter(c => c.status === 'ACTIVE').length;
    const newCustomers = customers.filter(c => {
        const created = new Date(c.createdAt);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return created >= thirtyDaysAgo;
    }).length;
    const blocked = customers.filter(c => c.status === 'BLOCKED').length;

    const totalEncours = customers.reduce((sum, c) => sum + (c.financials.currentBalance || 0), 0);
    const totalImpayes = customers.reduce((sum, c) => sum + (c.overdueAmount || 0), 0);

    document.getElementById('stat-active').textContent = formatNumber(active);
    document.getElementById('stat-new').textContent = newCustomers;
    document.getElementById('stat-blocked').textContent = blocked;
    document.getElementById('stat-encours').textContent = formatCurrency(totalEncours);
    document.getElementById('stat-impayes').textContent = formatCurrency(totalImpayes);
}

function updateQuickFilterCounts() {
    const all = customers.length;
    const active = customers.filter(c => c.status === 'ACTIVE').length;
    const entreprise = customers.filter(c => c.customerType === 'ENTREPRISE').length;
    const particulier = customers.filter(c => c.customerType === 'PARTICULIER').length;
    const technicien = customers.filter(c => c.customerType === 'TECHNICIEN').length;
    const quincaillerie = customers.filter(c => c.customerType === 'QUINCAILLERIE').length;
    const blocked = customers.filter(c => c.status === 'BLOCKED').length;

    document.getElementById('count-all').textContent = all;
    document.getElementById('count-active').textContent = active;
    document.getElementById('count-entreprise').textContent = entreprise;
    document.getElementById('count-particulier').textContent = particulier;
    document.getElementById('count-technicien').textContent = technicien;
    document.getElementById('count-quincaillerie').textContent = quincaillerie;
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
    document.getElementById('filter-category').value = '';
    document.getElementById('filter-commercial').value = '';
    document.getElementById('filter-status').value = '';
    document.getElementById('filter-balance').value = '';

    applyFilters();
}

// ================================================
// FILTRAGE ET RECHERCHE
// ================================================

function applyFilters() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const typeFilter = document.getElementById('filter-type').value;
    const categoryFilter = document.getElementById('filter-category').value;
    const commercialFilter = document.getElementById('filter-commercial').value;
    const statusFilter = document.getElementById('filter-status').value;
    const balanceFilter = document.getElementById('filter-balance').value;

    filteredCustomers = customers.filter(customer => {
        // Recherche textuelle
        const displayName = customer.businessName || `${customer.lastName} ${customer.firstName}`;
        const matchesSearch = !searchTerm ||
            customer.code.toLowerCase().includes(searchTerm) ||
            displayName.toLowerCase().includes(searchTerm) ||
            customer.taxId?.toLowerCase().includes(searchTerm) ||
            customer.cniNumber?.toLowerCase().includes(searchTerm) ||
            customer.phone?.toLowerCase().includes(searchTerm);

        // Filtre quick
        let matchesQuickFilter = true;
        switch(currentQuickFilter) {
            case 'active':
                matchesQuickFilter = customer.status === 'ACTIVE';
                break;
            case 'entreprise':
                matchesQuickFilter = customer.customerType === 'ENTREPRISE';
                break;
            case 'particulier':
                matchesQuickFilter = customer.customerType === 'PARTICULIER';
                break;
            case 'technicien':
                matchesQuickFilter = customer.customerType === 'TECHNICIEN';
                break;
            case 'quincaillerie':
                matchesQuickFilter = customer.customerType === 'QUINCAILLERIE';
                break;
            case 'blocked':
                matchesQuickFilter = customer.status === 'BLOCKED';
                break;
        }

        // Filtres avancés
        const matchesType = !typeFilter || customer.customerType === typeFilter;
        const matchesCategory = !categoryFilter || customer.category === categoryFilter;
        const matchesCommercial = !commercialFilter || customer.commercial.id === commercialFilter;
        const matchesStatus = !statusFilter || customer.status === statusFilter;

        let matchesBalance = true;
        if (balanceFilter === 'OK') {
            matchesBalance = customer.financials.currentBalance <= customer.financials.creditLimit && !customer.overdueAmount;
        } else if (balanceFilter === 'OVERDUE') {
            matchesBalance = customer.overdueAmount > 0;
        } else if (balanceFilter === 'EXCEEDED') {
            matchesBalance = customer.financials.currentBalance > customer.financials.creditLimit;
        }

        return matchesSearch && matchesQuickFilter && matchesType && matchesCategory &&
               matchesCommercial && matchesStatus && matchesBalance;
    });

    renderTable();
    renderPagination();
}

function resetFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('filter-type').value = '';
    document.getElementById('filter-category').value = '';
    document.getElementById('filter-commercial').value = '';
    document.getElementById('filter-status').value = '';
    document.getElementById('filter-balance').value = '';
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

    filteredCustomers.sort((a, b) => {
        let aVal, bVal;

        if (column === 'balance') {
            aVal = a.financials.currentBalance;
            bVal = b.financials.currentBalance;
        } else if (column === 'name') {
            aVal = a.businessName || `${a.lastName} ${a.firstName}`;
            bVal = b.businessName || `${b.lastName} ${b.firstName}`;
        } else {
            aVal = a[column];
            bVal = b[column];
        }

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

    if (filteredCustomers.length === 0) {
        tbody.innerHTML = '';
        emptyState.classList.remove('hidden');
        document.getElementById('pagination').style.display = 'none';
        return;
    }

    emptyState.classList.add('hidden');
    document.getElementById('pagination').style.display = 'flex';

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredCustomers.length);
    const pageData = filteredCustomers.slice(startIndex, endIndex);

    tbody.innerHTML = pageData.map(customer => {
        const typeInfo = getTypeInfo(customer);
        const statusInfo = getStatusInfo(customer);
        const balanceInfo = getBalanceInfo(customer);
        const displayName = customer.businessName || `${customer.lastName} ${customer.firstName}`;
        const identifier = customer.taxId ? `NUI: ${customer.taxId}` : (customer.cniNumber ? `CNI: ${customer.cniNumber}` : '');
        const documentAlert = getDocumentAlert(customer);

        return `
            <tr onclick="viewCustomer('${customer.id}')" style="cursor: pointer;">
                <td onclick="event.stopPropagation();">
                    <input type="checkbox" class="row-checkbox" data-id="${customer.id}" onchange="updateSelectedCount()">
                </td>
                <td>
                    <div style="font-weight: 600; font-size: 14px; color: #263c89;">${customer.code}</div>
                </td>
                <td>
                    <div style="font-weight: 600; margin-bottom: 4px;">${displayName}</div>
                    <div style="font-size: 12px; color: var(--gray-500);">
                        ${identifier}
                    </div>
                    <div class="customer-meta">
                        <span class="customer-meta-item">
                            <i class="fa-solid fa-phone" style="font-size: 11px;"></i>
                            ${customer.phone || '-'}
                        </span>
                    </div>
                    ${documentAlert ? `<div class="document-alert"><i class="fa-solid fa-exclamation-triangle"></i> ${documentAlert}</div>` : ''}
                </td>
                <td class="text-center">
                    <span class="customer-type-badge ${typeInfo.class}">${typeInfo.icon} ${typeInfo.label}</span>
                </td>
                <td class="text-center">
                    <div style="font-size: 13px; font-weight: 500;">${customer.category || '-'}</div>
                </td>
                <td class="text-center">
                    <div class="commercial-info">
                        <span class="commercial-name">${customer.commercial.name}</span>
                        ${customer.financials.paymentCondition === 'CREDIT' ? `
                            <span class="caution-info">Caution: ${formatCompact(customer.commercial.cautionAvailable)}</span>
                        ` : `
                            <span class="caution-info">Au comptant</span>
                        `}
                    </div>
                </td>
                <td class="text-center">
                    <div style="font-weight: 700; font-size: 14px;" class="${balanceInfo.class}">
                        ${formatCompact(customer.financials.currentBalance)}
                    </div>
                    ${customer.financials.creditLimit > 0 ? `
                        <div style="font-size: 11px; color: var(--gray-500);">
                            Limite: ${formatCompact(customer.financials.creditLimit)}
                        </div>
                    ` : ''}
                    ${balanceInfo.exceeded ? `
                        <div style="font-size: 11px; color: #EF4444; font-weight: 600;">Dépassé!</div>
                    ` : ''}
                </td>
                <td class="text-center">
                    <div class="status-badge-table">
                        <span class="status-dot ${statusInfo.dotClass}"></span>
                        <span style="font-weight: 600; font-size: 13px;">${statusInfo.label}</span>
                    </div>
                    ${customer.blockedForSales ? `
                        <div style="font-size: 11px; color: #EF4444; font-weight: 600; margin-top: 2px;">BL</div>
                    ` : ''}
                    ${customer.overdueDays ? `
                        <div style="font-size: 11px; color: #F59E0B; margin-top: 2px;">${customer.overdueDays}j retard</div>
                    ` : ''}
                </td>
                <td class="text-center" onclick="event.stopPropagation();">
                    <div class="action-buttons">
                        <button class="btn-icon" onclick="openQuickView('${customer.id}')" title="Aperçu">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        <button class="btn-icon" onclick="editCustomer('${customer.id}')" title="Modifier">
                            <i class="fa-solid fa-edit"></i>
                        </button>
                        <button class="btn-icon" onclick="createOrder('${customer.id}')" title="Nouvelle commande">
                            <i class="fa-solid fa-cart-plus"></i>
                        </button>
                        <button class="btn-icon" onclick="viewBalance('${customer.id}')" title="Solde">
                            <i class="fa-solid fa-wallet"></i>
                        </button>
                        ${!customer.blockedForSales ? `
                            <button class="btn-icon btn-icon-danger" onclick="openBlockModal('${customer.id}')" title="Bloquer">
                                <i class="fa-solid fa-ban"></i>
                            </button>
                        ` : `
                            <button class="btn-icon" onclick="unblockCustomer('${customer.id}')" title="Débloquer" style="color: #10B981;">
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

function getTypeInfo(customer) {
    const types = {
        'ENTREPRISE': { class: 'type-entreprise', label: 'ENTR', icon: '&#127970;' },
        'PARTICULIER': { class: 'type-particulier', label: 'PART', icon: '&#128100;' },
        'TECHNICIEN': { class: 'type-technicien', label: 'TECH', icon: '&#128119;' },
        'QUINCAILLERIE': { class: 'type-quincaillerie', label: 'QUIN', icon: '&#128295;' }
    };
    return types[customer.customerType] || { class: '', label: customer.customerType, icon: '' };
}

function getStatusInfo(customer) {
    if (customer.status === 'ACTIVE' && !customer.overdueAmount) {
        return { dotClass: 'active', label: 'Actif' };
    } else if (customer.status === 'ACTIVE' && customer.overdueAmount) {
        return { dotClass: 'warning', label: 'Attention' };
    } else if (customer.status === 'BLOCKED') {
        return { dotClass: 'blocked', label: 'Bloqué' };
    } else if (customer.status === 'SUSPENDED') {
        return { dotClass: 'warning', label: 'Suspendu' };
    }
    return { dotClass: '', label: customer.status };
}

function getBalanceInfo(customer) {
    const balance = customer.financials.currentBalance;
    const limit = customer.financials.creditLimit;
    const exceeded = limit > 0 && balance > limit;

    if (balance === 0) {
        return { class: 'balance-positive', exceeded: false };
    } else if (exceeded) {
        return { class: 'balance-negative', exceeded: true };
    } else if (customer.overdueAmount) {
        return { class: 'balance-warning', exceeded: false };
    }
    return { class: '', exceeded: false };
}

function getDocumentAlert(customer) {
    const anr = customer.documents.find(d => d.type === 'ATTESTATION_NON_REDEVANCE');
    if (anr) {
        if (anr.status === 'EXPIRED') {
            return 'ANR expirée';
        } else if (anr.status === 'EXPIRING_SOON') {
            return `ANR expire ${anr.daysToExpiry}j`;
        }
    }
    return null;
}

function formatNumber(num) {
    return new Intl.NumberFormat('fr-FR').format(num);
}

function formatCurrency(amount) {
    if (amount >= 1000000) {
        return (amount / 1000000).toFixed(1) + 'M XAF';
    } else if (amount >= 1000) {
        return (amount / 1000).toFixed(0) + 'K XAF';
    }
    return formatNumber(amount) + ' XAF';
}

function formatCompact(amount) {
    if (amount >= 1000000) {
        return (amount / 1000000).toFixed(1) + 'M';
    } else if (amount >= 1000) {
        return (amount / 1000).toFixed(0) + 'K';
    }
    return formatNumber(amount);
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
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, filteredCustomers.length);

    document.getElementById('pagination-info').textContent =
        `Affichage de ${startIndex} à ${endIndex} sur ${filteredCustomers.length} clients`;

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
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;

    currentPage = page;
    renderTable();
    renderPagination();
}

// ================================================
// ACTIONS CLIENT
// ================================================

function viewCustomer(id) {
    window.location.href = `./client-detail.html?id=${id}`;
}

function editCustomer(id) {
    window.location.href = `./client-edit.html?id=${id}`;
}

function createOrder(id) {
    window.location.href = `./commande-create.html?clientId=${id}`;
}

function viewBalance(id) {
    const customer = customers.find(c => c.id === id);
    if (customer) {
        alert(`Solde client ${customer.businessName || customer.lastName}:\n\nEncours: ${formatCurrency(customer.financials.currentBalance)}\nLimite crédit: ${formatCurrency(customer.financials.creditLimit)}\nDisponible: ${formatCurrency(customer.financials.creditLimit - customer.financials.currentBalance)}`);
    }
}

function openQuickView(id) {
    const customer = customers.find(c => c.id === id);
    if (!customer) return;

    customerToAction = id;
    const displayName = customer.businessName || `${customer.lastName} ${customer.firstName}`;

    document.getElementById('quickview-title').textContent = displayName;
    document.getElementById('quickview-body').innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
                <h4 style="margin-bottom: 12px; color: #263c89;">Informations générales</h4>
                <table style="width: 100%; font-size: 13px;">
                    <tr><td style="color: #6B7280; padding: 4px 0;">Code:</td><td style="font-weight: 600;">${customer.code}</td></tr>
                    <tr><td style="color: #6B7280; padding: 4px 0;">Type:</td><td>${getTypeInfo(customer).label}</td></tr>
                    <tr><td style="color: #6B7280; padding: 4px 0;">Catégorie:</td><td>${customer.category || '-'}</td></tr>
                    <tr><td style="color: #6B7280; padding: 4px 0;">Téléphone:</td><td>${customer.phone || '-'}</td></tr>
                    <tr><td style="color: #6B7280; padding: 4px 0;">Email:</td><td>${customer.email || '-'}</td></tr>
                    <tr><td style="color: #6B7280; padding: 4px 0;">Commercial:</td><td>${customer.commercial.name}</td></tr>
                </table>
            </div>
            <div>
                <h4 style="margin-bottom: 12px; color: #263c89;">Situation financière</h4>
                <table style="width: 100%; font-size: 13px;">
                    <tr><td style="color: #6B7280; padding: 4px 0;">Encours:</td><td style="font-weight: 600;">${formatCurrency(customer.financials.currentBalance)}</td></tr>
                    <tr><td style="color: #6B7280; padding: 4px 0;">Limite crédit:</td><td>${formatCurrency(customer.financials.creditLimit)}</td></tr>
                    <tr><td style="color: #6B7280; padding: 4px 0;">Conditions:</td><td>${customer.financials.paymentCondition === 'CREDIT' ? `${customer.financials.paymentTerms}j` : 'Comptant'}</td></tr>
                    <tr><td style="color: #6B7280; padding: 4px 0;">Comportement:</td><td>${customer.paymentBehavior}</td></tr>
                    <tr><td style="color: #6B7280; padding: 4px 0;">Dernière commande:</td><td>${formatDate(customer.lastOrderDate)}</td></tr>
                    <tr><td style="color: #6B7280; padding: 4px 0;">Total commandes:</td><td>${customer.totalOrders}</td></tr>
                </table>
            </div>
        </div>
    `;

    document.getElementById('quickview-modal').style.display = 'flex';
}

function closeQuickViewModal() {
    document.getElementById('quickview-modal').style.display = 'none';
    customerToAction = null;
}

function viewFullClient() {
    if (customerToAction) {
        viewCustomer(customerToAction);
    }
}

function openBlockModal(id) {
    customerToAction = id;
    const customer = customers.find(c => c.id === id);

    if (customer) {
        const displayName = customer.businessName || `${customer.lastName} ${customer.firstName}`;

        document.getElementById('modal-title').textContent = 'Bloquer le client';
        document.getElementById('modal-body').innerHTML = `
            <p>Êtes-vous sûr de vouloir bloquer ce client ?</p>
            <p style="color: var(--gray-600); margin-top: 12px; font-size: 14px;">
                <strong>${displayName}</strong> (${customer.code})
            </p>
            <div style="margin-top: 16px;">
                <label class="form-label required">Motif du blocage</label>
                <select class="form-select" id="block-reason">
                    <option value="">Sélectionner un motif</option>
                    <option value="CREDIT_EXCEEDED">Limite crédit dépassée</option>
                    <option value="PAYMENT_OVERDUE">Impayés en retard</option>
                    <option value="DOCUMENTS_EXPIRED">Documents expirés</option>
                    <option value="FRAUD_SUSPICION">Suspicion de fraude</option>
                    <option value="OTHER">Autre</option>
                </select>
            </div>
            <div style="margin-top: 12px;">
                <label class="form-label">Détails</label>
                <textarea class="form-textarea" id="block-details" placeholder="Précisez le motif du blocage..."></textarea>
            </div>
            <div class="warning-box" style="margin-top: 16px;">
                <i class="fa-solid fa-exclamation-triangle"></i>
                Aucune nouvelle vente ne sera possible pour ce client. Les commandes en cours seront maintenues.
            </div>
        `;

        document.getElementById('modal-footer').innerHTML = `
            <button class="btn btn-secondary" onclick="closeActionModal()">Annuler</button>
            <button class="btn btn-danger" onclick="confirmBlockCustomer()">
                <i class="fa-solid fa-ban"></i>
                Bloquer
            </button>
        `;

        document.getElementById('action-modal').style.display = 'flex';
    }
}

function confirmBlockCustomer() {
    const reason = document.getElementById('block-reason').value;
    const details = document.getElementById('block-details').value;

    if (!reason) {
        alert('Veuillez sélectionner un motif de blocage');
        return;
    }

    console.log('Blocage client:', customerToAction, reason, details);

    // Simuler le blocage
    const customer = customers.find(c => c.id === customerToAction);
    if (customer) {
        customer.status = 'BLOCKED';
        customer.blockedForSales = true;
        customer.blockReason = reason;
        customer.blockDetails = details;
        customer.blockDate = new Date().toISOString().split('T')[0];
    }

    closeActionModal();
    updateStats();
    updateQuickFilterCounts();
    applyFilters();

    alert('Client bloqué avec succès');
}

function unblockCustomer(id) {
    if (confirm('Débloquer ce client ?')) {
        console.log('Déblocage client:', id);

        const customer = customers.find(c => c.id === id);
        if (customer) {
            customer.status = 'ACTIVE';
            customer.blockedForSales = false;
            delete customer.blockReason;
            delete customer.blockDetails;
            delete customer.blockDate;
        }

        updateStats();
        updateQuickFilterCounts();
        applyFilters();

        alert('Client débloqué avec succès');
    }
}

function closeActionModal() {
    customerToAction = null;
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
    updateSelectedCount();
}

function updateSelectedCount() {
    const checkboxes = document.querySelectorAll('.row-checkbox:checked');
    const count = checkboxes.length;
    selectedCustomers = Array.from(checkboxes).map(cb => cb.dataset.id);

    document.getElementById('selected-count').textContent = count;
    document.getElementById('bulk-actions').style.display = count > 0 ? 'flex' : 'none';
}

// ================================================
// ACTIONS GROUPÉES
// ================================================

function sendBulkEmail() {
    if (selectedCustomers.length === 0) return;
    alert(`Envoi d'email groupé à ${selectedCustomers.length} client(s)`);
}

function generateBulkStatement() {
    if (selectedCustomers.length === 0) return;
    alert(`Génération de relevés pour ${selectedCustomers.length} client(s)`);
}

function blockSelectedClients() {
    if (selectedCustomers.length === 0) return;
    if (confirm(`Bloquer ${selectedCustomers.length} client(s) sélectionné(s) ?`)) {
        selectedCustomers.forEach(id => {
            const customer = customers.find(c => c.id === id);
            if (customer) {
                customer.status = 'BLOCKED';
                customer.blockedForSales = true;
            }
        });
        updateStats();
        updateQuickFilterCounts();
        applyFilters();
        alert('Clients bloqués avec succès');
    }
}

function unblockSelectedClients() {
    if (selectedCustomers.length === 0) return;
    if (confirm(`Débloquer ${selectedCustomers.length} client(s) sélectionné(s) ?`)) {
        selectedCustomers.forEach(id => {
            const customer = customers.find(c => c.id === id);
            if (customer) {
                customer.status = 'ACTIVE';
                customer.blockedForSales = false;
            }
        });
        updateStats();
        updateQuickFilterCounts();
        applyFilters();
        alert('Clients débloqués avec succès');
    }
}

function archiveSelectedClients() {
    if (selectedCustomers.length === 0) return;
    alert(`Archivage de ${selectedCustomers.length} client(s) - Fonctionnalité à implémenter`);
}

// ================================================
// EXPORT
// ================================================

function exportClients() {
    alert('Export Excel des clients - Fonctionnalité à implémenter');
}

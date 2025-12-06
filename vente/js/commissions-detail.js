/**
 * MultiFlex GESCOM - Détail Commissions
 * ECR-COM-002 : Détail des ventes et commissions
 */

// ============================================================================
// MOCK DATA
// ============================================================================

const salesData = [
    {
        doc: 'FA-CLI156-2024-00567',
        client: { name: 'SONACOM SARL', code: 'CLI-2024-00156' },
        date: '30/01/2024',
        category: 'construction',
        categoryLabel: 'Construction',
        amountHT: 2058824,
        rate: 2,
        commission: 41176,
        status: 'paid'
    },
    {
        doc: 'FA-CLI234-2024-00445',
        client: { name: 'TECHNI-BUILD SA', code: 'CLI-2024-00234' },
        date: '29/01/2024',
        category: 'construction',
        categoryLabel: 'Construction',
        amountHT: 4758403,
        rate: 3,
        commission: 142752,
        status: 'paid'
    },
    {
        doc: 'FA-CLI089-2024-00389',
        client: { name: 'KAMGA Jean Paul', code: 'CLI-2024-00089' },
        date: '28/01/2024',
        category: 'paint',
        categoryLabel: 'Peinture',
        amountHT: 746639,
        rate: 2,
        commission: 14933,
        status: 'pending'
    },
    {
        doc: 'FA-CLI045-2024-00312',
        client: { name: 'QUINCAILLERIE MODERNE', code: 'CLI-2024-00045' },
        date: '27/01/2024',
        category: 'construction',
        categoryLabel: 'Construction',
        amountHT: 2684832,
        rate: 2.5,
        commission: 67121,
        status: 'paid'
    },
    {
        doc: 'FA-CLI098-2024-00287',
        client: { name: 'BTP SERVICES', code: 'CLI-2024-00098' },
        date: '26/01/2024',
        category: 'plumbing',
        categoryLabel: 'Plomberie',
        amountHT: 1493277,
        rate: 2,
        commission: 29866,
        status: 'paid'
    },
    {
        doc: 'FA-CLI078-2024-00254',
        client: { name: 'DEPOT CENTRAL', code: 'CLI-2024-00078' },
        date: '25/01/2024',
        category: 'construction',
        categoryLabel: 'Construction',
        amountHT: 3775210,
        rate: 3,
        commission: 113256,
        status: 'pending'
    },
    {
        doc: 'FA-CLI201-2024-00223',
        client: { name: 'CONSTRUCTION PLUS', code: 'CLI-2024-00201' },
        date: '24/01/2024',
        category: 'paint',
        categoryLabel: 'Peinture',
        amountHT: 1762185,
        rate: 2,
        commission: 35244,
        status: 'blocked'
    },
    {
        doc: 'FA-CLI167-2024-00198',
        client: { name: 'ENTREPRISE XYZ', code: 'CLI-2024-00167' },
        date: '23/01/2024',
        category: 'electrical',
        categoryLabel: 'Électricité',
        amountHT: 5688235,
        rate: 3,
        commission: 170647,
        status: 'paid'
    },
    {
        doc: 'FA-CLI112-2024-00176',
        client: { name: 'MAISON DECO', code: 'CLI-2024-00112' },
        date: '22/01/2024',
        category: 'paint',
        categoryLabel: 'Peinture',
        amountHT: 1048950,
        rate: 2,
        commission: 20979,
        status: 'paid'
    },
    {
        doc: 'FA-CLI056-2024-00145',
        client: { name: 'BATIPRO SA', code: 'CLI-2024-00056' },
        date: '21/01/2024',
        category: 'construction',
        categoryLabel: 'Construction',
        amountHT: 7466387,
        rate: 3,
        commission: 223992,
        status: 'paid'
    },
    {
        doc: 'FA-CLI189-2024-00134',
        client: { name: 'MENUISERIE CENTRALE', code: 'CLI-2024-00189' },
        date: '20/01/2024',
        category: 'construction',
        categoryLabel: 'Construction',
        amountHT: 3200840,
        rate: 2.5,
        commission: 80021,
        status: 'paid'
    },
    {
        doc: 'FA-CLI223-2024-00112',
        client: { name: 'ELECTRICITE PLUS', code: 'CLI-2024-00223' },
        date: '19/01/2024',
        category: 'electrical',
        categoryLabel: 'Électricité',
        amountHT: 4521008,
        rate: 3,
        commission: 135630,
        status: 'pending'
    },
    {
        doc: 'FA-CLI145-2024-00098',
        client: { name: 'PLOMBERIE EXPRESS', code: 'CLI-2024-00145' },
        date: '18/01/2024',
        category: 'plumbing',
        categoryLabel: 'Plomberie',
        amountHT: 2890756,
        rate: 2,
        commission: 57815,
        status: 'paid'
    },
    {
        doc: 'FA-CLI267-2024-00087',
        client: { name: 'DECO INTERIEUR', code: 'CLI-2024-00267' },
        date: '17/01/2024',
        category: 'paint',
        categoryLabel: 'Peinture',
        amountHT: 1567227,
        rate: 2,
        commission: 31344,
        status: 'paid'
    },
    {
        doc: 'FA-CLI034-2024-00076',
        client: { name: 'GROS OEUVRE SARL', code: 'CLI-2024-00034' },
        date: '16/01/2024',
        category: 'construction',
        categoryLabel: 'Construction',
        amountHT: 8975630,
        rate: 3,
        commission: 269269,
        status: 'paid'
    }
];

const summaryData = {
    totalSales: 47,
    paidCommissions: 1856000,
    pendingCommissions: 608000,
    blockedCommissions: 42000,
    totalAmount: 125300000,
    totalCommission: 2506000
};

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    renderSummary();
    renderSalesTable();
});

// ============================================================================
// RENDER FUNCTIONS
// ============================================================================

/**
 * Render summary cards
 */
function renderSummary() {
    document.getElementById('totalSales').textContent = summaryData.totalSales;
    document.getElementById('paidCommissions').textContent = formatCurrency(summaryData.paidCommissions);
    document.getElementById('pendingCommissions').textContent = formatCurrency(summaryData.pendingCommissions);
    document.getElementById('blockedCommissions').textContent = formatCurrency(summaryData.blockedCommissions);
    document.getElementById('totalAmount').textContent = formatCurrency(summaryData.totalAmount);
    document.getElementById('totalCommission').textContent = formatCurrency(summaryData.totalCommission);
}

/**
 * Render sales table
 */
function renderSalesTable() {
    const tbody = document.getElementById('salesTableBody');

    const statusLabels = {
        paid: 'Versé',
        pending: 'En attente',
        blocked: 'Bloqué'
    };

    tbody.innerHTML = salesData.map(sale => `
        <tr>
            <td>
                <span class="doc-number">${sale.doc}</span>
            </td>
            <td>
                <div class="client-name">${sale.client.name}</div>
                <div class="client-code">${sale.client.code}</div>
            </td>
            <td>${sale.date}</td>
            <td>
                <span class="category-badge ${sale.category}">${sale.categoryLabel}</span>
            </td>
            <td class="amount-cell">${formatCurrency(sale.amountHT)}</td>
            <td>
                <span class="rate-badge">${sale.rate}%</span>
            </td>
            <td class="commission-cell">${formatCurrency(sale.commission)}</td>
            <td>
                <span class="status-badge ${sale.status}">${statusLabels[sale.status]}</span>
            </td>
            <td>
                <button class="action-btn" onclick="viewSale('${sale.doc}')" title="Voir détails">
                    <i class="fa-solid fa-eye"></i>
                </button>
                ${sale.status === 'blocked' ? `
                    <button class="action-btn" onclick="contestSale('${sale.doc}')" title="Contester" style="color: #DC2626;">
                        <i class="fa-solid fa-exclamation-triangle"></i>
                    </button>
                ` : ''}
            </td>
        </tr>
    `).join('');
}

// ============================================================================
// ACTIONS
// ============================================================================

/**
 * View sale details
 */
function viewSale(docNumber) {
    alert(`Ouverture des détails de la vente ${docNumber}...`);
    // In real app, would navigate to invoice detail
}

/**
 * Contest sale commission
 */
function contestSale(docNumber) {
    const reason = prompt(`Motif de contestation pour ${docNumber}:`);

    if (reason) {
        alert(`Contestation enregistrée!

Vente: ${docNumber}
Motif: ${reason}

Votre contestation sera examinée dans les 48h.`);
    }
}

/**
 * Apply filters
 */
function applyFilters() {
    const search = document.getElementById('searchInput').value;
    const period = document.getElementById('periodFilter').value;
    const status = document.getElementById('statusFilter').value;
    const category = document.getElementById('categoryFilter').value;

    // In real app, would filter data
    alert(`Filtres appliqués:
- Recherche: ${search || 'Tous'}
- Période: ${period}
- Statut: ${status}
- Catégorie: ${category}`);

    renderSalesTable();
}

/**
 * Export data
 */
function exportData() {
    alert('Export Excel en cours...\n\nLe fichier sera téléchargé automatiquement.');
}

/**
 * Print report
 */
function printReport() {
    alert('Génération du rapport PDF pour impression...');
}

/**
 * Go back
 */
function goBack() {
    window.location.href = './commissions-dashboard.html';
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format currency
 */
function formatCurrency(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' XAF';
}

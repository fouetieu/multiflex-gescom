/**
 * MultiFlex GESCOM - Dashboard Commissions
 * ECR-COM-001 : Tableau de bord des commissions commerciales
 */

// ============================================================================
// MOCK DATA
// ============================================================================

const currentUser = {
    name: 'Marie DJOMO',
    initials: 'MD',
    role: 'Commercial Senior',
    objective: 150000000
};

const commissionData = {
    total: 2506000,
    totalSales: 125300000,
    objectiveRate: 84,
    salesCount: 47,
    trend: '+15%',
    categories: [
        {
            name: 'Construction',
            icon: 'construction',
            iconClass: 'fa-building',
            amount: 1125000,
            detail: '3% de 37.5M XAF'
        },
        {
            name: 'Peinture',
            icon: 'paint',
            iconClass: 'fa-paint-roller',
            amount: 450000,
            detail: '2% de 22.5M XAF'
        },
        {
            name: 'Nouveaux clients',
            icon: 'new-client',
            iconClass: 'fa-user-plus',
            amount: 350000,
            detail: '5% de 7M XAF (prime)'
        },
        {
            name: 'Bonus objectif',
            icon: 'bonus',
            iconClass: 'fa-trophy',
            amount: 581000,
            detail: 'Atteint si ≥80%'
        }
    ],
    evolution: {
        labels: ['Août', 'Sept', 'Oct', 'Nov', 'Déc', 'Jan'],
        data: [1850000, 2100000, 1950000, 2300000, 2150000, 2506000]
    }
};

const salesData = [
    {
        doc: 'FA-CLI156-2024-00567',
        client: 'SONACOM SARL',
        date: '30/01/2024',
        amount: 2450000,
        rate: 2,
        commission: 49000,
        status: 'paid'
    },
    {
        doc: 'FA-CLI234-2024-00445',
        client: 'TECHNI-BUILD SA',
        date: '29/01/2024',
        amount: 5670000,
        rate: 3,
        commission: 170100,
        status: 'paid'
    },
    {
        doc: 'FA-CLI089-2024-00389',
        client: 'KAMGA Jean Paul',
        date: '28/01/2024',
        amount: 890000,
        rate: 2,
        commission: 17800,
        status: 'pending'
    },
    {
        doc: 'FA-CLI045-2024-00312',
        client: 'QUINCAILLERIE MODERNE',
        date: '27/01/2024',
        amount: 3200000,
        rate: 2.5,
        commission: 80000,
        status: 'paid'
    },
    {
        doc: 'FA-CLI098-2024-00287',
        client: 'BTP SERVICES',
        date: '26/01/2024',
        amount: 1780000,
        rate: 2,
        commission: 35600,
        status: 'paid'
    },
    {
        doc: 'FA-CLI078-2024-00254',
        client: 'DEPOT CENTRAL',
        date: '25/01/2024',
        amount: 4500000,
        rate: 3,
        commission: 135000,
        status: 'pending'
    },
    {
        doc: 'FA-CLI201-2024-00223',
        client: 'CONSTRUCTION PLUS',
        date: '24/01/2024',
        amount: 2100000,
        rate: 2,
        commission: 42000,
        status: 'blocked'
    },
    {
        doc: 'FA-CLI167-2024-00198',
        client: 'ENTREPRISE XYZ',
        date: '23/01/2024',
        amount: 6780000,
        rate: 3,
        commission: 203400,
        status: 'paid'
    },
    {
        doc: 'FA-CLI112-2024-00176',
        client: 'MAISON DECO',
        date: '22/01/2024',
        amount: 1250000,
        rate: 2,
        commission: 25000,
        status: 'paid'
    },
    {
        doc: 'FA-CLI056-2024-00145',
        client: 'BATIPRO SA',
        date: '21/01/2024',
        amount: 8900000,
        rate: 3,
        commission: 267000,
        status: 'paid'
    }
];

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    renderUserInfo();
    renderCategories();
    renderSalesTable();
    initChart();
});

// ============================================================================
// RENDER FUNCTIONS
// ============================================================================

/**
 * Render user info
 */
function renderUserInfo() {
    document.getElementById('userInitials').textContent = currentUser.initials;
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userRole').textContent = currentUser.role;
}

/**
 * Render category breakdown
 */
function renderCategories() {
    const container = document.getElementById('categoryList');

    container.innerHTML = commissionData.categories.map(cat => `
        <div class="category-item">
            <div class="category-icon ${cat.icon}">
                <i class="fa-solid ${cat.iconClass}"></i>
            </div>
            <div class="category-info">
                <div class="category-name">${cat.name}</div>
                <div class="category-detail">${cat.detail}</div>
            </div>
            <div class="category-amount">${formatCurrency(cat.amount)}</div>
        </div>
    `).join('');
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
            <td class="sale-doc">${sale.doc}</td>
            <td class="sale-client">${sale.client}</td>
            <td>${sale.date}</td>
            <td class="sale-amount">${formatCurrency(sale.amount)}</td>
            <td><span class="commission-rate">${sale.rate}%</span></td>
            <td class="sale-commission">${formatCurrency(sale.commission)}</td>
            <td>
                <span class="status-badge ${sale.status}">${statusLabels[sale.status]}</span>
            </td>
        </tr>
    `).join('');
}

/**
 * Initialize evolution chart
 */
function initChart() {
    const ctx = document.getElementById('evolutionChart').getContext('2d');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: commissionData.evolution.labels,
            datasets: [{
                label: 'Commissions',
                data: commissionData.evolution.data,
                borderColor: '#059669',
                backgroundColor: 'rgba(5, 150, 105, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#059669',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#1F2937',
                    titleFont: { size: 12 },
                    bodyFont: { size: 14 },
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            return formatCurrency(context.raw);
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: {
                        font: { size: 11 },
                        color: '#6B7280'
                    }
                },
                y: {
                    grid: {
                        color: '#F3F4F6'
                    },
                    ticks: {
                        font: { size: 11 },
                        color: '#6B7280',
                        callback: function(value) {
                            return (value / 1000000).toFixed(1) + 'M';
                        }
                    }
                }
            }
        }
    });
}

// ============================================================================
// ACTIONS
// ============================================================================

/**
 * Set period filter
 */
function setPeriod(period) {
    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // In real app, would reload data for selected period
    alert(`Période sélectionnée: ${period}`);
}

/**
 * Export data
 */
function exportData() {
    alert('Export des données de commission en cours...\n\nFormats disponibles:\n- Excel (.xlsx)\n- PDF\n- CSV');
}

/**
 * Open contestation form
 */
function openContestation() {
    const sale = prompt('Entrez le numéro de la vente à contester (ex: FA-CLI156-2024-00567):');

    if (sale) {
        const reason = prompt(`Motif de contestation pour ${sale}:`);

        if (reason) {
            alert(`Contestation enregistrée!

Vente: ${sale}
Motif: ${reason}

Votre contestation sera examinée par la Direction Commerciale dans les 48h.`);
        }
    }
}

/**
 * View details
 */
function viewDetails() {
    window.location.href = './commissions-detail.html';
}

/**
 * View all sales
 */
function viewAllSales() {
    window.location.href = './commissions-detail.html';
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

/**
 * Format compact number
 */
function formatCompact(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
}

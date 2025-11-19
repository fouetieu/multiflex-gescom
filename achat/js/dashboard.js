// ================================================
// DASHBOARD ACHATS - JS
// ================================================

// État global
let currentPeriod = 'current';
let lateOrders = [];
let pendingDAs = [];

// ================================================
// INITIALISATION
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation du Dashboard Achats...');
    
    // Load data
    loadDashboardData();
    
    // Initialize charts
    initEvolutionChart();
    initSuppliersChart();
    
    // Event listeners
    document.getElementById('period-selector')?.addEventListener('change', function(e) {
        currentPeriod = e.target.value;
        refreshDashboard();
    });
});

// ================================================
// CHARGEMENT DES DONNÉES
// ================================================

function loadDashboardData() {
    // Simuler le chargement depuis une API
    // En production, remplacer par de vrais appels API
    
    lateOrders = generateMockLateOrders();
    pendingDAs = generateMockPendingDAs();
    
    renderLateOrders();
    renderPendingDAs();
}

function generateMockLateOrders() {
    return [
        {
            id: 'BCF-2024-0145',
            supplier: 'ABC SARL',
            expectedDate: '2024-01-10',
            daysLate: 5,
            amount: '2,500,000 XAF'
        },
        {
            id: 'BCF-2024-0148',
            supplier: 'XYZ Ltd',
            expectedDate: '2024-01-12',
            daysLate: 3,
            amount: '1,800,000 XAF'
        },
        {
            id: 'BCF-2024-0151',
            supplier: 'CIMENCAM',
            expectedDate: '2024-01-13',
            daysLate: 2,
            amount: '5,200,000 XAF'
        },
        {
            id: 'BCF-2024-0153',
            supplier: 'DEF & Co',
            expectedDate: '2024-01-14',
            daysLate: 1,
            amount: '950,000 XAF'
        },
        {
            id: 'BCF-2024-0155',
            supplier: 'IOLA Distribution',
            expectedDate: '2024-01-14',
            daysLate: 1,
            amount: '1,200,000 XAF'
        }
    ];
}

function generateMockPendingDAs() {
    return [
        {
            id: 'DA-2024-0089',
            requester: 'Jean DUPONT',
            department: 'Production',
            amount: '500,000 XAF',
            priority: 'URGENT',
            date: '2024-01-15'
        },
        {
            id: 'DA-2024-0090',
            requester: 'Marie MARTIN',
            department: 'Logistique',
            amount: '1,200,000 XAF',
            priority: 'HAUTE',
            date: '2024-01-15'
        },
        {
            id: 'DA-2024-0091',
            requester: 'Paul DURAND',
            department: 'Administration',
            amount: '350,000 XAF',
            priority: 'NORMALE',
            date: '2024-01-14'
        },
        {
            id: 'DA-2024-0092',
            requester: 'Sophie KAMGA',
            department: 'Production',
            amount: '800,000 XAF',
            priority: 'HAUTE',
            date: '2024-01-14'
        },
        {
            id: 'DA-2024-0093',
            requester: 'Pierre NGONO',
            department: 'Maintenance',
            amount: '650,000 XAF',
            priority: 'NORMALE',
            date: '2024-01-13'
        }
    ];
}

// ================================================
// AFFICHAGE DES LISTES
// ================================================

function renderLateOrders() {
    const container = document.getElementById('late-orders-list');
    if (!container) return;
    
    container.innerHTML = lateOrders.map(order => `
        <div class="late-order-item">
            <div class="late-order-info">
                <div class="late-order-code">${order.id}</div>
                <div class="late-order-supplier">
                    ${order.supplier} • Prévu: ${formatDate(order.expectedDate)}
                </div>
            </div>
            <div style="text-align: right; margin-left: 16px;">
                <div class="late-badge">
                    <i class="fa-solid fa-clock"></i>
                    ${order.daysLate} jour${order.daysLate > 1 ? 's' : ''} de retard
                </div>
                <div style="font-size: 12px; color: #6B7280; margin-top: 4px;">
                    ${order.amount}
                </div>
            </div>
        </div>
    `).join('');
}

function renderPendingDAs() {
    const container = document.getElementById('pending-das-list');
    if (!container) return;
    
    container.innerHTML = pendingDAs.map(da => {
        const priorityClass = {
            'URGENT': 'urgent',
            'HAUTE': 'high',
            'NORMALE': 'normal',
            'BASSE': 'low'
        }[da.priority] || 'normal';
        
        const priorityIcon = {
            'URGENT': '🔴',
            'HAUTE': '🟠',
            'NORMALE': '🟡',
            'BASSE': '🟢'
        }[da.priority] || '🟡';
        
        return `
            <div class="late-order-item">
                <div class="late-order-info">
                    <div class="late-order-code">${da.id}</div>
                    <div class="late-order-supplier">
                        ${da.requester} • ${da.department} • ${formatDate(da.date)}
                    </div>
                </div>
                <div style="text-align: right; margin-left: 16px;">
                    <span class="badge-priority ${priorityClass}">
                        ${priorityIcon} ${da.priority}
                    </span>
                    <div style="font-size: 12px; color: #6B7280; margin-top: 4px;">
                        ${da.amount}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ================================================
// GRAPHIQUES
// ================================================

function initEvolutionChart() {
    const ctx = document.getElementById('evolutionChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Fév 23', 'Mar 23', 'Avr 23', 'Mai 23', 'Jun 23', 'Jul 23', 
                     'Aoû 23', 'Sep 23', 'Oct 23', 'Nov 23', 'Déc 23', 'Jan 24'],
            datasets: [{
                label: 'Volume Achats (M XAF)',
                data: [32, 35, 38, 42, 40, 45, 43, 48, 46, 50, 47, 45.5],
                borderColor: '#263c89',
                backgroundColor: 'rgba(38, 60, 137, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y + ' M XAF';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#E5E7EB',
                        drawBorder: false
                    },
                    ticks: {
                        callback: function(value) {
                            return value + 'M';
                        },
                        font: {
                            size: 12
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

function initSuppliersChart() {
    const ctx = document.getElementById('suppliersChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['ABC SARL', 'XYZ Ltd', 'IOLA Distrib.', 'DEF & Co', 'Autres'],
            datasets: [{
                data: [33, 18, 13, 11, 25],
                backgroundColor: [
                    '#263c89',
                    '#3B82F6',
                    '#10B981',
                    '#F59E0B',
                    '#6B7280'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: 10
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 10,
                        font: {
                            size: 11
                        },
                        boxWidth: 12,
                        boxHeight: 12
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            return `${label}: ${value}%`;
                        }
                    }
                }
            }
        }
    });
}

// ================================================
// ACTIONS
// ================================================

function refreshDashboard() {
    console.log('🔄 Actualisation du dashboard pour la période:', currentPeriod);
    
    // Simuler le rechargement
    loadDashboardData();
    
    // Notification
    showNotification('Dashboard actualisé', 'success');
}

function showNotification(message, type = 'info') {
    // Simple notification (à améliorer avec une vraie librairie de toasts)
    console.log(`[${type.toUpperCase()}] ${message}`);
}

// ================================================
// HELPERS
// ================================================

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XAF',
        minimumFractionDigits: 0
    }).format(amount);
}


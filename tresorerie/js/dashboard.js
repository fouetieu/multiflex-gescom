/**
 * MultiFlex GESCOM - Dashboard Trésorerie JavaScript
 * Tableau de bord principal du module Trésorerie
 * Conforme au wireframe ECR-TRES-010
 */

let evolutionChart = null;
let autoRefreshInterval = null;

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    initDashboard();
});

function initDashboard() {
    updateLastRefreshTime();
    initEvolutionChart();
    startAutoRefresh();
}

// ============================================================================
// CHART INITIALIZATION
// ============================================================================

function initEvolutionChart() {
    const ctx = document.getElementById('evolutionChart');
    if (!ctx) return;

    // Generate last 7 days labels
    const labels = [];
    const data = [];
    const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

    // Simulated data for 7 days evolution
    const baseValue = 120;
    const values = [120, 123, 125, 121, 127, 126, 127.5];

    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayIndex = date.getDay();
        labels.push(days[dayIndex === 0 ? 6 : dayIndex - 1]); // Convert to French week (L-D)
        data.push(values[6 - i]);
    }

    evolutionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Position Trésorerie (M XAF)',
                data: data,
                borderColor: '#263c89',
                backgroundColor: 'rgba(38, 60, 137, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#263c89',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
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
                    callbacks: {
                        label: function(context) {
                            return context.raw.toFixed(1) + 'M XAF';
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    min: 115,
                    max: 135,
                    ticks: {
                        callback: function(value) {
                            return value + 'M';
                        }
                    }
                }
            }
        }
    });
}

// ============================================================================
// REFRESH FUNCTIONS
// ============================================================================

function updateLastRefreshTime() {
    const now = new Date();
    const formatted = now.toLocaleDateString('fr-FR') + ' ' + now.toLocaleTimeString('fr-FR');
    const element = document.getElementById('lastUpdate');
    if (element) {
        element.textContent = formatted;
    }
}

function refreshDashboard() {
    showNotification('Actualisation des données...', 'info');

    // Update timestamp
    updateLastRefreshTime();

    // Simulate data refresh with animation
    const positionAmount = document.getElementById('totalDisponible');
    if (positionAmount) {
        positionAmount.style.opacity = '0.5';
        setTimeout(() => {
            positionAmount.style.opacity = '1';
        }, 500);
    }

    // Update chart with new data point
    if (evolutionChart) {
        const lastValue = evolutionChart.data.datasets[0].data[evolutionChart.data.datasets[0].data.length - 1];
        const variation = (Math.random() - 0.5) * 2; // ±1M variation
        const newValue = Math.max(115, Math.min(135, lastValue + variation));

        evolutionChart.data.datasets[0].data.push(newValue);
        evolutionChart.data.datasets[0].data.shift();

        evolutionChart.update('none');
    }

    setTimeout(() => {
        showNotification('Données actualisées', 'success');
    }, 500);
}

function startAutoRefresh() {
    // Auto-refresh every 30 seconds
    autoRefreshInterval = setInterval(() => {
        refreshDashboard();
    }, 30000);
}

function stopAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
    }
}

// ============================================================================
// EXPORT FUNCTIONS
// ============================================================================

function exportDashboard() {
    showNotification('Export du tableau de bord en cours...', 'info');

    // Collect dashboard data
    const data = {
        date: new Date().toISOString(),
        positionGlobale: {
            total: '127.5M XAF',
            banques: '120.2M XAF',
            caisses: '6.8M XAF',
            mobileMoney: '456K XAF'
        },
        fluxJour: {
            entrees: '12.45M XAF',
            sorties: '8.23M XAF',
            net: '4.22M XAF'
        },
        indicateurs: {
            dso: '35 jours',
            dpo: '42 jours',
            cashCycle: '-7 jours',
            tauxEncaissement: '78%',
            bfr: '-15.2M XAF',
            liquidite: '1.8',
            couvertureCharges: '45 jours'
        }
    };

    // Create CSV content
    let csv = 'Tableau de Bord Trésorerie - MultiFlex GESCOM\n';
    csv += `Date d'export: ${new Date().toLocaleString('fr-FR')}\n\n`;

    csv += 'POSITION GLOBALE\n';
    csv += `Total Disponible,${data.positionGlobale.total}\n`;
    csv += `Banques,${data.positionGlobale.banques}\n`;
    csv += `Caisses,${data.positionGlobale.caisses}\n`;
    csv += `Mobile Money,${data.positionGlobale.mobileMoney}\n\n`;

    csv += 'FLUX DU JOUR\n';
    csv += `Entrées,${data.fluxJour.entrees}\n`;
    csv += `Sorties,${data.fluxJour.sorties}\n`;
    csv += `Net,${data.fluxJour.net}\n\n`;

    csv += 'INDICATEURS CLÉS\n';
    csv += `DSO (Clients),${data.indicateurs.dso}\n`;
    csv += `DPO (Fournisseurs),${data.indicateurs.dpo}\n`;
    csv += `Cash Cycle,${data.indicateurs.cashCycle}\n`;
    csv += `Taux Encaissement,${data.indicateurs.tauxEncaissement}\n`;
    csv += `BFR,${data.indicateurs.bfr}\n`;
    csv += `Liquidité Immédiate,${data.indicateurs.liquidite}\n`;
    csv += `Couverture Charges,${data.indicateurs.couvertureCharges}\n`;

    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard_tresorerie_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    showNotification('Export Excel généré avec succès', 'success');
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatCurrency(amount) {
    if (!amount && amount !== 0) return '-';
    if (amount >= 1000000) {
        return (amount / 1000000).toFixed(1) + 'M XAF';
    } else if (amount >= 1000) {
        return (amount / 1000).toFixed(0) + 'K XAF';
    }
    return new Intl.NumberFormat('fr-FR').format(amount) + ' XAF';
}

function showNotification(message, type = 'info') {
    // Use existing notification system if available
    if (typeof window.showNotification === 'function' && window.showNotification !== showNotification) {
        window.showNotification(message, type);
        return;
    }

    // Simple fallback
    const colors = {
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6'
    };

    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 16px 24px;
        background: ${colors[type] || colors.info};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================================================
// CLEANUP ON PAGE UNLOAD
// ============================================================================

window.addEventListener('beforeunload', function() {
    stopAutoRefresh();
});

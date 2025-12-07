/**
 * MultiFlex GESCOM - Journal Detail JavaScript
 * Gestion du détail d'un journal de trésorerie
 */

// ============================================================================
// INITIALIZATION
// ============================================================================

let balanceChart = null;
let typeChart = null;
let flowChart = null;
let currentJournalCode = null;

document.addEventListener('DOMContentLoaded', function() {
    initPage();
});

function initPage() {
    const urlParams = new URLSearchParams(window.location.search);
    currentJournalCode = urlParams.get('code') || 'BNK-001';
    const tabParam = urlParams.get('tab');

    loadJournalData(currentJournalCode);

    // If tab specified in URL, switch to it
    if (tabParam === 'stats') {
        setTimeout(() => {
            showTab('statistics', document.querySelector('.tab-button:nth-child(4)'));
        }, 100);
    }
}

// ============================================================================
// DATA LOADING
// ============================================================================

function loadJournalData(code) {
    // Demo data - in real app, fetch from API
    const journalData = {
        code: code,
        name: 'BICEC PRINCIPAL',
        journalType: 'BANK_ACCOUNT',
        typeLabel: 'Compte Bancaire (BANK_ACCOUNT)',
        typeIcon: '🏦',
        owningCompanyName: 'IOLA BTP SARL',
        currency: 'XAF',
        multiCurrency: false,
        openingDate: '01/01/2024',
        status: 'ACTIF',
        bankDetails: {
            bankName: 'BICEC (Banque Internationale du Cameroun)',
            accountNumber: '12345678901234',
            iban: 'CM21 1000 1000 5012 3456 7890 1234',
            swift: 'BICECMCX',
            accountHolder: 'IOLA BTP SARL',
            accountType: 'Compte Courant'
        },
        balances: {
            book: 85234567,
            bank: 85100000,
            gap: 134567,
            available: 85234567
        },
        security: {
            overdraftLimit: 5000000,
            alertThreshold: 2000000,
            criticalThreshold: 500000,
            dualSignatureThreshold: 5000000,
            dailyLimit: 10000000,
            signatoriesCount: 3
        }
    };

    // Update UI elements
    updateHeaderInfo(journalData);
    updateOverviewTab(journalData);
}

function updateHeaderInfo(data) {
    document.getElementById('journalCodeBreadcrumb').textContent = data.code;
    document.getElementById('journalTitle').textContent = data.name;
    document.getElementById('journalCode').textContent = data.code;
    document.getElementById('journalCompany').textContent = data.owningCompanyName;
    document.getElementById('journalStatus').textContent = data.status;
    document.getElementById('journalTypeIcon').textContent = data.typeIcon;
}

function updateOverviewTab(data) {
    // Journal Info
    document.getElementById('infoType').textContent = data.typeLabel;
    document.getElementById('infoCode').textContent = data.code;
    document.getElementById('infoCompany').textContent = data.owningCompanyName;
    document.getElementById('infoCurrency').textContent = data.currency;
    document.getElementById('infoMultiCurrency').textContent = data.multiCurrency ? 'Activé' : 'Non activé';
    document.getElementById('infoOpenDate').textContent = data.openingDate;

    // Bank Details
    if (data.bankDetails) {
        document.getElementById('bankName').textContent = data.bankDetails.bankName;
        document.getElementById('accountNumber').textContent = data.bankDetails.accountNumber;
        document.getElementById('iban').textContent = data.bankDetails.iban;
        document.getElementById('swift').textContent = data.bankDetails.swift;
        document.getElementById('accountHolder').textContent = data.bankDetails.accountHolder;
        document.getElementById('accountType').textContent = data.bankDetails.accountType;
    }

    // Balances
    document.getElementById('bookBalance').textContent = formatCurrency(data.balances.book);
    document.getElementById('bankBalance').textContent = formatCurrency(data.balances.bank);
    document.getElementById('balanceGap').textContent = formatCurrency(data.balances.gap);
    document.getElementById('availableBalance').textContent = formatCurrency(data.balances.available);

    // Position gauge
    const position = Math.round((data.balances.book / 100000000) * 100);
    document.getElementById('currentPosition').textContent = position + '%';
    document.getElementById('positionGauge').style.width = position + '%';

    // Security
    document.getElementById('overdraftLimit').textContent = formatCurrency(data.security.overdraftLimit);
    document.getElementById('alertThreshold').textContent = formatCurrency(data.security.alertThreshold);
    document.getElementById('criticalThreshold').textContent = formatCurrency(data.security.criticalThreshold);
    document.getElementById('dualSignatureThreshold').textContent = formatCurrency(data.security.dualSignatureThreshold);
    document.getElementById('dailyLimit').textContent = formatCurrency(data.security.dailyLimit);
    document.getElementById('signatoriesCount').textContent = data.security.signatoriesCount + ' personnes';
}

// ============================================================================
// TABS
// ============================================================================

function showTab(tabId, btn) {
    // Update buttons
    document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Update content
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById('tab-' + tabId).classList.add('active');

    // Initialize charts if statistics tab
    if (tabId === 'statistics') {
        setTimeout(initCharts, 100);
    }
}

// ============================================================================
// CHARTS
// ============================================================================

function initCharts() {
    initBalanceChart();
    initTypeChart();
    initFlowChart();
}

function initBalanceChart() {
    const ctx = document.getElementById('balanceChart');
    if (!ctx) return;

    if (balanceChart) {
        balanceChart.destroy();
    }

    // Generate demo data for last 30 days
    const labels = [];
    const data = [];
    let balance = 70000000;

    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }));

        // Random fluctuation
        balance += Math.floor(Math.random() * 5000000) - 2000000;
        balance = Math.max(50000000, Math.min(90000000, balance));
        data.push(balance);
    }

    balanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Solde',
                data: data,
                borderColor: '#263c89',
                backgroundColor: 'rgba(38, 60, 137, 0.1)',
                fill: true,
                tension: 0.4
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
                            return formatCurrency(context.raw);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return formatCompact(value);
                        }
                    }
                }
            }
        }
    });
}

function initTypeChart() {
    const ctx = document.getElementById('typeChart');
    if (!ctx) return;

    if (typeChart) {
        typeChart.destroy();
    }

    typeChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Encaissements', 'Décaissements', 'Virements', 'Frais'],
            datasets: [{
                data: [45, 30, 20, 5],
                backgroundColor: ['#10B981', '#EF4444', '#3B82F6', '#6B7280'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        usePointStyle: true,
                        padding: 15
                    }
                }
            }
        }
    });
}

function initFlowChart() {
    const ctx = document.getElementById('flowChart');
    if (!ctx) return;

    if (flowChart) {
        flowChart.destroy();
    }

    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const currentMonth = new Date().getMonth();
    const labels = months.slice(0, currentMonth + 1);

    flowChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Entrées',
                    data: [45, 52, 48, 61, 55, 67, 72, 58, 63, 70, 75, 68].slice(0, currentMonth + 1),
                    backgroundColor: '#10B981'
                },
                {
                    label: 'Sorties',
                    data: [38, 45, 42, 52, 48, 55, 60, 50, 55, 58, 62, 55].slice(0, currentMonth + 1),
                    backgroundColor: '#EF4444'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.raw + 'M XAF';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
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
// ACTIONS
// ============================================================================

function modifyParams() {
    window.location.href = './journal-security.html?code=' + currentJournalCode;
}

function newMovement() {
    const choice = confirm('Quel type de mouvement?\n\nOK = Encaissement\nAnnuler = Décaissement');

    if (choice) {
        window.location.href = './encaissement-create.html?journal=' + currentJournalCode;
    } else {
        window.location.href = './decaissement-create.html?journal=' + currentJournalCode;
    }
}

function exportPDF() {
    showNotification('Génération du PDF en cours...', 'info');
    setTimeout(() => {
        showNotification('PDF généré avec succès!', 'success');
    }, 2000);
}

function refreshData() {
    showNotification('Actualisation des données...', 'info');
    setTimeout(() => {
        loadJournalData(currentJournalCode);
        showNotification('Données actualisées', 'success');
    }, 1000);
}

function viewSignatories() {
    window.location.href = './journal-security.html?code=' + currentJournalCode + '#signatories';
}

// Movements tab
function filterMovements() {
    showNotification('Filtrage des mouvements...', 'info');
}

function resetFilters() {
    document.getElementById('periodFilter').value = 'month';
    document.getElementById('typeFilter').value = '';
    document.getElementById('statusFilter').value = 'validated';
    document.getElementById('searchMovements').value = '';
    showNotification('Filtres réinitialisés', 'info');
}

function exportMovements() {
    showNotification('Export des mouvements en cours...', 'info');
    setTimeout(() => {
        showNotification('Export terminé!', 'success');
    }, 1500);
}

// Reconciliation tab
function importStatement() {
    showNotification('Ouverture de la fenêtre d\'import...', 'info');
}

function newReconciliation() {
    showNotification('Création d\'un nouveau rapprochement...', 'info');
}

function viewHistory() {
    showNotification('Affichage de l\'historique...', 'info');
}

function imputeOp(id) {
    showNotification('Imputation de l\'opération ' + id + '...', 'info');
}

function identifyOp(id) {
    showNotification('Identification de l\'opération ' + id + '...', 'info');
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatCurrency(amount) {
    if (amount === null || amount === undefined) return '-';
    const prefix = amount < 0 ? '-' : '';
    return prefix + Math.abs(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' XAF';
}

function formatCompact(num) {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + 'Md';
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
}

function showNotification(message, type = 'info') {
    // Use global notification function if available
    if (typeof window.showNotification === 'function' && window.showNotification !== showNotification) {
        window.showNotification(message, type);
        return;
    }

    // Simple fallback notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 24px;
        border-radius: 8px;
        color: white;
        font-size: 14px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : type === 'warning' ? '#F59E0B' : '#263c89'};
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

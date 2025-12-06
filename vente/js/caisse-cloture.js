/**
 * MultiFlex GESCOM - Clôture de Caisse
 * Logique de clôture de caisse POS
 */

// ============================================================================
// MOCK DATA
// ============================================================================

const sessionData = {
    sessionNumber: 'POS-2024-0089',
    cashRegister: 'CAISSE-01',
    cashier: {
        id: 'USR-001',
        name: 'Jean MBARGA',
        role: 'Caissier'
    },
    startTime: '2024-01-29T08:00:00',
    endTime: null,
    status: 'active'
};

const salesSummary = {
    totalTickets: 67,
    totalArticles: 489,
    clientsServed: 65,
    multipleVisits: 2,

    totalHT: 1234567,
    totalTVA: 237654,
    totalTTC: 1472221,
    totalRemises: 23450,
    netEncaisse: 1448771
};

const paymentBreakdown = [
    {
        mode: 'cash',
        label: 'Espèces',
        icon: 'fa-money-bill-wave',
        transactions: 45,
        amount: 856230,
        percent: 59.1,
        observation: 'Limite 100K respectée'
    },
    {
        mode: 'mobile',
        label: 'Mobile Money',
        icon: 'fa-mobile-screen',
        transactions: 15,
        amount: 423541,
        percent: 29.2,
        observation: 'Orange: 8, MTN: 7'
    },
    {
        mode: 'check',
        label: 'Chèque',
        icon: 'fa-money-check',
        transactions: 5,
        amount: 145000,
        percent: 10.0,
        observation: 'À déposer'
    },
    {
        mode: 'transfer',
        label: 'Virement',
        icon: 'fa-building-columns',
        transactions: 2,
        amount: 24000,
        percent: 1.7,
        observation: 'Références notées'
    }
];

const cashData = {
    fondCaisse: 50000,
    encaissements: 856230,
    sorties: 12500,
    theorique: 893730
};

const anomalies = [
    {
        type: 'Retour article',
        detail: 'Ticket 0015 - Peinture défectueuse (5L)',
        icon: 'fa-undo'
    },
    {
        type: 'Annulation',
        detail: 'Ticket 0034 - Client a changé d\'avis',
        icon: 'fa-ban'
    },
    {
        type: 'Remise exceptionnelle',
        detail: 'Ticket 0056 - Validation manager OK',
        icon: 'fa-percent'
    }
];

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    initializeSession();
    renderSalesSummary();
    renderPaymentTable();
    renderCashCounting();
    renderAnomalies();
    calculateCounted();
});

/**
 * Initialize session info
 */
function initializeSession() {
    document.getElementById('sessionNumber').textContent = sessionData.sessionNumber;

    const startDate = new Date(sessionData.startTime);
    document.getElementById('sessionStart').textContent = formatDateTime(startDate);

    // Calculate duration
    const now = new Date();
    const duration = now - startDate;
    document.getElementById('sessionDuration').textContent = formatDuration(duration);
}

/**
 * Render sales summary
 */
function renderSalesSummary() {
    document.getElementById('totalTickets').textContent = salesSummary.totalTickets;
    document.getElementById('totalArticles').textContent = salesSummary.totalArticles;
    document.getElementById('totalClients').textContent = salesSummary.clientsServed;
    document.getElementById('multipleVisits').textContent = `(${salesSummary.multipleVisits} passages multiples)`;

    document.getElementById('totalHT').textContent = formatCurrency(salesSummary.totalHT);
    document.getElementById('totalTVA').textContent = formatCurrency(salesSummary.totalTVA);
    document.getElementById('totalTTC').textContent = formatCurrency(salesSummary.totalTTC);
    document.getElementById('totalRemises').textContent = `-${formatCurrency(salesSummary.totalRemises)}`;
    document.getElementById('netEncaisse').textContent = formatCurrency(salesSummary.netEncaisse);
}

/**
 * Render payment breakdown table
 */
function renderPaymentTable() {
    const tbody = document.getElementById('paymentTableBody');

    let html = '';
    let totalTransactions = 0;
    let totalAmount = 0;

    paymentBreakdown.forEach(payment => {
        totalTransactions += payment.transactions;
        totalAmount += payment.amount;

        html += `
            <tr>
                <td>
                    <div class="payment-mode">
                        <div class="mode-icon ${payment.mode}">
                            <i class="fa-solid ${payment.icon}"></i>
                        </div>
                        <span>${payment.label}</span>
                    </div>
                </td>
                <td style="text-align: center;">${payment.transactions}</td>
                <td class="amount-cell">${formatCurrency(payment.amount)}</td>
                <td class="percent-cell">
                    <span class="percent-badge">${payment.percent.toFixed(1)}%</span>
                </td>
                <td class="observation-cell">${payment.observation}</td>
            </tr>
        `;
    });

    // Total row
    html += `
        <tr class="total-row">
            <td><strong>TOTAL</strong></td>
            <td style="text-align: center;"><strong>${totalTransactions}</strong></td>
            <td class="amount-cell"><strong>${formatCurrency(totalAmount)}</strong></td>
            <td class="percent-cell"><span class="percent-badge">100%</span></td>
            <td></td>
        </tr>
    `;

    tbody.innerHTML = html;
}

/**
 * Render cash counting section
 */
function renderCashCounting() {
    document.getElementById('fondCaisse').textContent = formatCurrency(cashData.fondCaisse);
    document.getElementById('encaissementsEspeces').textContent = `+${formatCurrency(cashData.encaissements)}`;
    document.getElementById('sortiesEspeces').textContent = `-${formatCurrency(cashData.sorties)}`;
    document.getElementById('totalTheorique').textContent = formatCurrency(cashData.theorique);
}

/**
 * Render anomalies list
 */
function renderAnomalies() {
    const container = document.getElementById('anomalyList');

    if (anomalies.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; color: #6B7280; padding: 20px;">
                <i class="fa-solid fa-check-circle" style="font-size: 32px; color: #059669; margin-bottom: 8px;"></i>
                <div>Aucune anomalie signalée</div>
            </div>
        `;
        return;
    }

    container.innerHTML = anomalies.map(anomaly => `
        <div class="anomaly-item">
            <div class="anomaly-icon">
                <i class="fa-solid ${anomaly.icon}"></i>
            </div>
            <div class="anomaly-content">
                <div class="anomaly-type">${anomaly.type}:</div>
                <div class="anomaly-detail">${anomaly.detail}</div>
            </div>
        </div>
    `).join('');
}

// ============================================================================
// CASH COUNTING CALCULATIONS
// ============================================================================

/**
 * Calculate total counted cash
 */
function calculateCounted() {
    const bills = {
        10000: parseInt(document.getElementById('bill10000').value) || 0,
        5000: parseInt(document.getElementById('bill5000').value) || 0,
        2000: parseInt(document.getElementById('bill2000').value) || 0,
        1000: parseInt(document.getElementById('bill1000').value) || 0
    };

    const coins = {
        500: parseInt(document.getElementById('coin500').value) || 0,
        100: parseInt(document.getElementById('coin100').value) || 0,
        50: parseInt(document.getElementById('coin50').value) || 0
    };

    const otherCoins = parseInt(document.getElementById('otherCoins').value) || 0;

    // Update individual results
    document.getElementById('result10000').textContent = formatNumber(bills[10000] * 10000);
    document.getElementById('result5000').textContent = formatNumber(bills[5000] * 5000);
    document.getElementById('result2000').textContent = formatNumber(bills[2000] * 2000);
    document.getElementById('result1000').textContent = formatNumber(bills[1000] * 1000);
    document.getElementById('result500').textContent = formatNumber(coins[500] * 500);
    document.getElementById('result100').textContent = formatNumber(coins[100] * 100);
    document.getElementById('result50').textContent = formatNumber(coins[50] * 50);
    document.getElementById('resultOther').textContent = formatNumber(otherCoins);

    // Calculate total
    const totalCounted =
        bills[10000] * 10000 +
        bills[5000] * 5000 +
        bills[2000] * 2000 +
        bills[1000] * 1000 +
        coins[500] * 500 +
        coins[100] * 100 +
        coins[50] * 50 +
        otherCoins;

    document.getElementById('totalCounted').textContent = formatCurrency(totalCounted);

    // Calculate variance
    const variance = totalCounted - cashData.theorique;
    updateVarianceDisplay(variance);

    return totalCounted;
}

/**
 * Update variance display
 */
function updateVarianceDisplay(variance) {
    const varianceBox = document.getElementById('varianceBox');
    const varianceAmount = document.getElementById('varianceAmount');
    const varianceIcon = document.getElementById('varianceIcon');

    // Remove existing classes
    varianceBox.classList.remove('ok', 'warning', 'error');

    if (variance === 0) {
        varianceBox.classList.add('ok');
        varianceAmount.textContent = '0 XAF';
        varianceIcon.textContent = '✅';
    } else if (Math.abs(variance) <= 1000) {
        varianceBox.classList.add('warning');
        varianceAmount.textContent = `${variance > 0 ? '+' : ''}${formatCurrency(variance)}`;
        varianceIcon.textContent = '⚠️';
    } else {
        varianceBox.classList.add('error');
        varianceAmount.textContent = `${variance > 0 ? '+' : ''}${formatCurrency(variance)}`;
        varianceIcon.textContent = '❌';
    }
}

// ============================================================================
// ACTIONS
// ============================================================================

/**
 * Open Print Z Modal
 */
function openPrintZModal() {
    generateZReport();
    document.getElementById('printZModal').classList.add('show');
}

/**
 * Close Print Z Modal
 */
function closePrintZModal() {
    document.getElementById('printZModal').classList.remove('show');
}

/**
 * Generate Z Report content
 */
function generateZReport() {
    const now = new Date();
    const totalCounted = calculateCounted();
    const variance = totalCounted - cashData.theorique;

    const report = `
════════════════════════════════════════════
            IOLA BTP DOUALA
          RAPPORT DE CLÔTURE Z
════════════════════════════════════════════

Session:     ${sessionData.sessionNumber}
Caisse:      ${sessionData.cashRegister}
Caissier:    ${sessionData.cashier.name}

Ouverture:   ${formatDateTime(new Date(sessionData.startTime))}
Clôture:     ${formatDateTime(now)}
────────────────────────────────────────────

RÉCAPITULATIF DES VENTES
────────────────────────────────────────────
Tickets émis:        ${salesSummary.totalTickets}
Articles vendus:     ${salesSummary.totalArticles}
Clients servis:      ${salesSummary.clientsServed}

Total HT:            ${formatCurrency(salesSummary.totalHT).padStart(15)}
TVA 19.25%:          ${formatCurrency(salesSummary.totalTVA).padStart(15)}
─────────────────────────────────────────
Total TTC:           ${formatCurrency(salesSummary.totalTTC).padStart(15)}
Remises:             ${('-' + formatCurrency(salesSummary.totalRemises)).padStart(15)}
─────────────────────────────────────────
NET ENCAISSÉ:        ${formatCurrency(salesSummary.netEncaisse).padStart(15)}

────────────────────────────────────────────
DÉTAIL PAR MODE DE PAIEMENT
────────────────────────────────────────────
${paymentBreakdown.map(p =>
    `${p.label.padEnd(15)} ${p.transactions.toString().padStart(3)} tr   ${formatCurrency(p.amount).padStart(12)}`
).join('\n')}
────────────────────────────────────────────
TOTAL               ${paymentBreakdown.reduce((s, p) => s + p.transactions, 0).toString().padStart(3)} tr   ${formatCurrency(salesSummary.netEncaisse).padStart(12)}

────────────────────────────────────────────
COMPTAGE ESPÈCES
────────────────────────────────────────────
Fond initial:        ${formatCurrency(cashData.fondCaisse).padStart(15)}
Encaissements:       ${formatCurrency(cashData.encaissements).padStart(15)}
Sorties:             ${('-' + formatCurrency(cashData.sorties)).padStart(15)}
─────────────────────────────────────────
Théorique:           ${formatCurrency(cashData.theorique).padStart(15)}
Compté:              ${formatCurrency(totalCounted).padStart(15)}
─────────────────────────────────────────
ÉCART:               ${(variance >= 0 ? '+' : '') + formatCurrency(variance).padStart(14)}  ${variance === 0 ? '✓' : '!'}

────────────────────────────────────────────
${anomalies.length > 0 ? 'ANOMALIES SIGNALÉES: ' + anomalies.length : 'AUCUNE ANOMALIE'}
────────────────────────────────────────────
${anomalies.map(a => `• ${a.type}: ${a.detail}`).join('\n')}

Commentaire: ${document.getElementById('cashierComment').value || 'RAS'}

════════════════════════════════════════════
Document généré le ${formatDateTime(now)}
MultiFlex GESCOM v1.0
════════════════════════════════════════════
    `.trim();

    document.getElementById('zReportContent').textContent = report;
}

/**
 * Print Z Report
 */
function printZReport() {
    const reportContent = document.getElementById('zReportContent').textContent;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Rapport Z - ${sessionData.sessionNumber}</title>
            <style>
                body {
                    font-family: 'Courier New', monospace;
                    font-size: 12px;
                    padding: 20px;
                    white-space: pre-wrap;
                    max-width: 400px;
                    margin: 0 auto;
                }
            </style>
        </head>
        <body>${reportContent}</body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();

    closePrintZModal();
}

/**
 * Show detailed statistics
 */
function showDetails() {
    alert('Affichage des statistiques détaillées...\n\nCette fonctionnalité affichera:\n- Détail par catégorie d\'articles\n- Historique des tickets\n- Graphiques de ventes par heure\n- Top produits vendus');
}

/**
 * Send report by email
 */
function sendReport() {
    const email = prompt('Entrez l\'adresse email pour recevoir le rapport:', 'comptabilite@iola-btp.cm');

    if (email) {
        alert(`Rapport envoyé à ${email}\n\nLe rapport de clôture de la session ${sessionData.sessionNumber} a été envoyé avec succès.`);
    }
}

/**
 * Open close confirmation modal
 */
function openCloseConfirmation() {
    const totalCounted = calculateCounted();
    const variance = totalCounted - cashData.theorique;

    const checklist = document.getElementById('confirmChecklist');

    const checks = [
        {
            label: 'Comptage espèces effectué',
            ok: true
        },
        {
            label: `Écart de caisse: ${variance === 0 ? '0 XAF' : formatCurrency(Math.abs(variance))}`,
            ok: Math.abs(variance) <= 1000
        },
        {
            label: 'Chèques mis de côté pour dépôt',
            ok: true
        },
        {
            label: 'Anomalies documentées',
            ok: anomalies.length === 0 || document.getElementById('cashierComment').value.trim() !== ''
        },
        {
            label: 'Rapport Z généré',
            ok: false
        }
    ];

    checklist.innerHTML = checks.map(check => `
        <div class="confirm-checklist-item">
            <i class="fa-solid ${check.ok ? 'fa-check-circle' : 'fa-times-circle'}"></i>
            <span>${check.label}</span>
        </div>
    `).join('');

    document.getElementById('confirmModal').classList.add('show');
}

/**
 * Close confirmation modal
 */
function closeConfirmModal() {
    document.getElementById('confirmModal').classList.remove('show');
}

/**
 * Confirm close session
 */
function confirmClose() {
    const totalCounted = calculateCounted();
    const variance = totalCounted - cashData.theorique;

    // Check for significant variance
    if (Math.abs(variance) > 1000) {
        const proceed = confirm(`Attention: Écart de ${formatCurrency(Math.abs(variance))} détecté.\n\nVoulez-vous quand même clôturer la session ?`);
        if (!proceed) return;
    }

    // Simulate closing
    alert(`Session ${sessionData.sessionNumber} clôturée avec succès!\n\nRécapitulatif:\n- Net encaissé: ${formatCurrency(salesSummary.netEncaisse)}\n- Écart: ${formatCurrency(variance)}\n- ${salesSummary.totalTickets} tickets\n\nRedirection vers l'écran de connexion...`);

    closeConfirmModal();

    // In real app, would redirect to login
    // window.location.href = './login.html';
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format number with thousands separator
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format currency
 */
function formatCurrency(amount) {
    return formatNumber(amount) + ' XAF';
}

/**
 * Format date and time
 */
function formatDateTime(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

/**
 * Format duration
 */
function formatDuration(ms) {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h${String(minutes).padStart(2, '0')}min`;
}

// ============================================================================
// KEYBOARD SHORTCUTS
// ============================================================================

document.addEventListener('keydown', function(e) {
    // ESC to close modals
    if (e.key === 'Escape') {
        closePrintZModal();
        closeConfirmModal();
    }

    // Ctrl+P to print Z
    if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        openPrintZModal();
    }
});

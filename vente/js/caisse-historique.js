/**
 * MultiFlex GESCOM - Historique Sessions Caisse
 * ECR-POS-006 : Consultation historique des sessions
 */

// ============================================================================
// MOCK DATA
// ============================================================================

const sessionsData = [
    {
        number: 'POS-2024-0089',
        caisse: 'CAISSE-01',
        cashier: 'Jean MBARGA',
        openTime: '29/01/2024 08:00',
        closeTime: '29/01/2024 18:35',
        duration: '10h35min',
        tickets: 67,
        returns: 3,
        cancels: 0,
        caHT: 1215650,
        caTVA: 234012,
        caTTC: 1449662,
        fondInitial: 50000,
        encaissements: 856230,
        theorique: 906230,
        compte: 906230,
        ecart: 0,
        status: 'ok'
    },
    {
        number: 'POS-2024-0088',
        caisse: 'CAISSE-01',
        cashier: 'Marie FOTSO',
        openTime: '28/01/2024 08:30',
        closeTime: '28/01/2024 17:50',
        duration: '9h20min',
        tickets: 55,
        returns: 1,
        cancels: 1,
        caHT: 1035420,
        caTVA: 199318,
        caTTC: 1234738,
        fondInitial: 50000,
        encaissements: 745000,
        theorique: 795000,
        compte: 794500,
        ecart: -500,
        status: 'warning'
    },
    {
        number: 'POS-2024-0087',
        caisse: 'CAISSE-02',
        cashier: 'Paul NGONO',
        openTime: '28/01/2024 08:00',
        closeTime: '28/01/2024 18:00',
        duration: '10h00min',
        tickets: 42,
        returns: 0,
        cancels: 0,
        caHT: 875300,
        caTVA: 168495,
        caTTC: 1043795,
        fondInitial: 50000,
        encaissements: 623500,
        theorique: 673500,
        compte: 673500,
        ecart: 0,
        status: 'ok'
    },
    {
        number: 'POS-2024-0086',
        caisse: 'CAISSE-01',
        cashier: 'Jean MBARGA',
        openTime: '27/01/2024 08:00',
        closeTime: '27/01/2024 18:30',
        duration: '10h30min',
        tickets: 58,
        returns: 2,
        cancels: 0,
        caHT: 1125890,
        caTVA: 216734,
        caTTC: 1342624,
        fondInitial: 50000,
        encaissements: 812000,
        theorique: 862000,
        compte: 862000,
        ecart: 0,
        status: 'ok'
    },
    {
        number: 'POS-2024-0085',
        caisse: 'CAISSE-02',
        cashier: 'Marie FOTSO',
        openTime: '27/01/2024 09:00',
        closeTime: '27/01/2024 17:30',
        duration: '8h30min',
        tickets: 38,
        returns: 0,
        cancels: 2,
        caHT: 685000,
        caTVA: 131862,
        caTTC: 816862,
        fondInitial: 50000,
        encaissements: 485000,
        theorique: 535000,
        compte: 535000,
        ecart: 0,
        status: 'ok'
    },
    {
        number: 'POS-2024-0084',
        caisse: 'CAISSE-01',
        cashier: 'Paul NGONO',
        openTime: '26/01/2024 08:00',
        closeTime: '26/01/2024 18:00',
        duration: '10h00min',
        tickets: 51,
        returns: 1,
        cancels: 0,
        caHT: 945600,
        caTVA: 182027,
        caTTC: 1127627,
        fondInitial: 50000,
        encaissements: 678000,
        theorique: 728000,
        compte: 728000,
        ecart: 0,
        status: 'ok'
    }
];

const mockTickets = [
    { number: '0067', time: '18:20', amount: 45600 },
    { number: '0066', time: '18:05', amount: 23400 },
    { number: '0065', time: '17:48', amount: 67800 },
    { number: '0064', time: '17:32', amount: 12500 },
    { number: '0063', time: '17:15', amount: 89000 },
    { number: '0062', time: '16:58', amount: 34500 },
    { number: '0061', time: '16:42', amount: 56700 },
    { number: '0060', time: '16:25', amount: 28900 }
];

let currentSession = null;

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    renderSessionsTable();
});

// ============================================================================
// RENDER
// ============================================================================

/**
 * Render sessions table
 */
function renderSessionsTable() {
    const tbody = document.getElementById('sessionsTableBody');

    tbody.innerHTML = sessionsData.map(session => {
        const ecartClass = session.ecart === 0 ? 'ok' :
                          Math.abs(session.ecart) <= 1000 ? 'warning' : 'error';
        const statusClass = session.status;

        return `
            <tr>
                <td>
                    <div class="session-number">${session.number}</div>
                    <div class="session-date">${session.openTime}</div>
                </td>
                <td>
                    <div class="cashier-name">${session.cashier}</div>
                    <div style="font-size: 12px; color: #6B7280;">${session.caisse}</div>
                </td>
                <td>
                    <span class="duration-badge">${session.duration}</span>
                </td>
                <td>
                    <div class="ca-amount">${formatCompact(session.caTTC)}</div>
                    <div class="session-details">${session.tickets} tickets</div>
                </td>
                <td>
                    <span class="variance-cell ${ecartClass}">
                        ${session.ecart === 0 ? '0' : (session.ecart > 0 ? '+' : '') + formatNumber(session.ecart)} XAF
                    </span>
                </td>
                <td>
                    <span class="status-badge ${statusClass}">
                        ${statusClass === 'ok' ? '🟢 OK' :
                          statusClass === 'warning' ? '🟡 Écart' : '🔵 En cours'}
                    </span>
                    <div class="session-details">
                        ${session.returns > 0 ? session.returns + ' retours' : ''}
                        ${session.cancels > 0 ? (session.returns > 0 ? ', ' : '') + session.cancels + ' annul.' : ''}
                        ${session.returns === 0 && session.cancels === 0 ? 'Aucune anomalie' : ''}
                    </div>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn" onclick="viewDetails('${session.number}')">
                            <i class="fa-solid fa-eye"></i> Détails
                        </button>
                        <button class="action-btn" onclick="printRapportZFor('${session.number}')">
                            <i class="fa-solid fa-print"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// ============================================================================
// DETAIL PANEL
// ============================================================================

/**
 * View session details
 */
function viewDetails(sessionNumber) {
    currentSession = sessionsData.find(s => s.number === sessionNumber);

    if (!currentSession) return;

    // Populate detail panel
    document.getElementById('detailSessionNumber').textContent = currentSession.number;
    document.getElementById('detailCaisse').textContent = currentSession.caisse;
    document.getElementById('detailCashier').textContent = currentSession.cashier;
    document.getElementById('detailOpen').textContent = currentSession.openTime;
    document.getElementById('detailClose').textContent = currentSession.closeTime;
    document.getElementById('detailDuration').textContent = currentSession.duration;

    document.getElementById('detailHT').textContent = formatCurrency(currentSession.caHT);
    document.getElementById('detailTVA').textContent = formatCurrency(currentSession.caTVA);
    document.getElementById('detailTTC').textContent = formatCurrency(currentSession.caTTC);

    document.getElementById('detailFond').textContent = formatCurrency(currentSession.fondInitial);
    document.getElementById('detailEncaiss').textContent = formatCurrency(currentSession.encaissements);
    document.getElementById('detailTheorique').textContent = formatCurrency(currentSession.theorique);
    document.getElementById('detailCompte').textContent = formatCurrency(currentSession.compte);

    const ecartEl = document.getElementById('detailEcart');
    if (currentSession.ecart === 0) {
        ecartEl.textContent = '0 XAF ✓';
        ecartEl.style.color = '#059669';
    } else {
        ecartEl.textContent = (currentSession.ecart > 0 ? '+' : '') + formatCurrency(currentSession.ecart);
        ecartEl.style.color = Math.abs(currentSession.ecart) <= 1000 ? '#D97706' : '#DC2626';
    }

    document.getElementById('detailTicketsCount').textContent = currentSession.tickets;

    // Render tickets list
    renderTicketsList();

    // Show panel
    document.getElementById('overlay').classList.add('show');
    document.getElementById('detailPanel').classList.add('show');
}

/**
 * Render tickets list in detail panel
 */
function renderTicketsList() {
    const container = document.getElementById('ticketsList');

    container.innerHTML = mockTickets.map(ticket => `
        <div class="ticket-item">
            <div class="ticket-info">
                <span class="ticket-num">#${ticket.number}</span>
                <span class="ticket-time">${ticket.time}</span>
            </div>
            <span class="ticket-amount">${formatCurrency(ticket.amount)}</span>
        </div>
    `).join('');
}

/**
 * Close detail panel
 */
function closeDetailPanel() {
    document.getElementById('overlay').classList.remove('show');
    document.getElementById('detailPanel').classList.remove('show');
    currentSession = null;
}

// ============================================================================
// FILTERS
// ============================================================================

/**
 * Apply filters
 */
function applyFilters() {
    // In real app, would filter data
    alert('Filtres appliqués!\n\nPériode: ' + document.getElementById('periodFilter').value +
          '\nCaisse: ' + document.getElementById('caisseFilter').value +
          '\nCaissier: ' + document.getElementById('cashierFilter').value);

    renderSessionsTable();
}

// ============================================================================
// ACTIONS
// ============================================================================

/**
 * Print Rapport Z
 */
function printRapportZ() {
    if (!currentSession) return;
    printRapportZFor(currentSession.number);
}

/**
 * Print Rapport Z for specific session
 */
function printRapportZFor(sessionNumber) {
    const session = sessionsData.find(s => s.number === sessionNumber);
    if (!session) return;

    alert(`Impression du Rapport Z\n\nSession: ${session.number}\nCaissier: ${session.cashier}\nCA TTC: ${formatCurrency(session.caTTC)}\n\nLe rapport sera envoyé à l'imprimante.`);
}

/**
 * Export current session
 */
function exportSession() {
    if (!currentSession) return;

    alert(`Export de la session ${currentSession.number}\n\nLe fichier Excel sera téléchargé.`);
}

/**
 * Export all sessions
 */
function exportSessions() {
    alert('Export de toutes les sessions de la période\n\nLe fichier Excel sera téléchargé.');
}

/**
 * Go back to POS
 */
function goBack() {
    window.location.href = './caisse.html';
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format number
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
 * Format compact
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

/**
 * MultiFlex GESCOM - Journals List JavaScript
 * Gestion de la liste des journaux de trésorerie
 */

// ============================================================================
// DEMO DATA - Aligned with wireframe structure
// ============================================================================

const demoJournals = [
    {
        code: 'BNK-001',
        name: 'BICEC Principal',
        journalType: 'BANK_ACCOUNT',
        owningCompanyId: 'IOLA_BTP',
        owningCompanyName: 'IOLA BTP',
        currency: 'XAF',
        currentBalance: 85234567,
        availableBalance: 80200000,
        bankDetails: {
            bankName: 'BICEC',
            accountNumber: '***1234',
            iban: 'CM21 1000 1000 5012 3456 7890 1234'
        },
        status: 'ACTIVE',
        healthStatus: 'normal',
        lastActivityDate: '07/12/2024 14:32'
    },
    {
        code: 'BNK-002',
        name: 'SCB Compte USD',
        journalType: 'BANK_ACCOUNT',
        owningCompanyId: 'IOLA_BTP',
        owningCompanyName: 'IOLA BTP',
        currency: 'USD',
        currentBalance: 125450,
        availableBalance: 125450,
        equivalentXAF: 82000000,
        multiCurrency: true,
        bankDetails: {
            bankName: 'SCB Cameroun',
            accountNumber: '***5678'
        },
        status: 'ACTIVE',
        healthStatus: 'normal',
        lastActivityDate: '07/12/2024 12:15'
    },
    {
        code: 'CSH-001',
        name: 'Caisse Douala',
        journalType: 'CASH_DESK',
        owningCompanyId: 'IOLA_BTP',
        owningCompanyName: 'IOLA BTP',
        currency: 'XAF',
        currentBalance: 3456789,
        cashLimit: 5000000,
        responsiblePerson: 'M. FOTSO',
        status: 'ACTIVE',
        healthStatus: 'normal',
        lastActivityDate: '07/12/2024 14:28'
    },
    {
        code: 'CSH-002',
        name: 'Caisse Yaoundé',
        journalType: 'CASH_DESK',
        owningCompanyId: 'IOLA_BTP',
        owningCompanyName: 'IOLA BTP',
        currency: 'XAF',
        currentBalance: 1234567,
        cashLimit: 5000000,
        alertThreshold: 2000000,
        responsiblePerson: 'Mme NGONO',
        status: 'ACTIVE',
        healthStatus: 'warning',
        alertMessage: '< Seuil 2M',
        lastActivityDate: '07/12/2024 11:45'
    },
    {
        code: 'MOB-001',
        name: 'Orange Money',
        journalType: 'MOBILE_MONEY',
        owningCompanyId: 'IOLA_BTP',
        owningCompanyName: 'IOLA BTP',
        currency: 'XAF',
        currentBalance: 456789,
        mobileDetails: {
            operator: 'Orange',
            phoneNumber: '699 123 456'
        },
        status: 'ACTIVE',
        healthStatus: 'normal',
        lastActivityDate: '07/12/2024 10:30'
    },
    {
        code: 'BNK-003',
        name: 'UBA Découvert',
        journalType: 'BANK_ACCOUNT',
        owningCompanyId: 'IOLA_INDUS',
        owningCompanyName: 'IOLA INDUS',
        currency: 'XAF',
        currentBalance: -2345678,
        overdraftLimit: -5000000,
        bankDetails: {
            bankName: 'UBA Cameroun',
            accountNumber: '***9012'
        },
        status: 'ACTIVE',
        healthStatus: 'critical',
        alertMessage: 'Découv: -5M',
        lastActivityDate: '06/12/2024 16:00'
    },
    {
        code: 'PTY-001',
        name: 'Petite Caisse Siège',
        journalType: 'PETTY_CASH',
        owningCompanyId: 'MULTIFLEX',
        owningCompanyName: 'MULTIFLEX',
        currency: 'XAF',
        currentBalance: 150000,
        cashLimit: 500000,
        responsiblePerson: 'Mme EBELLE',
        status: 'ACTIVE',
        healthStatus: 'normal',
        lastActivityDate: '07/12/2024 09:00'
    }
];

let currentJournals = [...demoJournals];
let selectedJournal = null;

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    renderJournals();
    updatePositionGlobale();
    updateLastUpdateTime();
    startAutoRefresh();
});

// ============================================================================
// RENDERING
// ============================================================================

function renderJournals() {
    const container = document.getElementById('journalsListBody');
    container.innerHTML = '';

    currentJournals.forEach(journal => {
        const row = createJournalRow(journal);
        container.appendChild(row);
    });
}

function createJournalRow(journal) {
    const row = document.createElement('div');
    row.className = 'journal-row';
    row.onclick = () => showQuickDetail(journal);
    row.style.cursor = 'pointer';

    // Type icon
    const typeIcon = getTypeIcon(journal.journalType);

    // Balance display
    const isNegative = journal.currentBalance < 0;
    const balanceClass = isNegative ? 'balance-negative' : '';

    // Status indicator
    const statusInfo = getStatusInfo(journal.healthStatus);

    // Build subinfo based on journal type
    let subInfo = '';
    if (journal.journalType === 'BANK_ACCOUNT' && journal.bankDetails) {
        subInfo = `N°: ${journal.bankDetails.accountNumber}`;
        if (journal.multiCurrency) {
            subInfo += '<br><span style="color: #8B5CF6;">Multi-devises</span>';
        }
    } else if (journal.journalType === 'CASH_DESK' || journal.journalType === 'PETTY_CASH') {
        subInfo = `Resp: ${journal.responsiblePerson || '-'}`;
    } else if (journal.journalType === 'MOBILE_MONEY' && journal.mobileDetails) {
        subInfo = journal.mobileDetails.phoneNumber;
    }

    // Build balance additional info
    let balanceExtra = '';
    if (journal.availableBalance && journal.availableBalance !== journal.currentBalance) {
        balanceExtra = `Disp: ${formatCompactAmount(journal.availableBalance)}`;
    } else if (journal.cashLimit) {
        balanceExtra = `Limite: ${formatCompactAmount(journal.cashLimit)}`;
    } else if (journal.overdraftLimit) {
        balanceExtra = `Découv: ${formatCompactAmount(journal.overdraftLimit)}`;
    } else if (journal.equivalentXAF) {
        balanceExtra = `~${formatCompactAmount(journal.equivalentXAF)} XAF`;
    }

    row.innerHTML = `
        <div class="journal-code">${journal.code}</div>
        <div class="journal-info">
            <div class="journal-name">${journal.name}</div>
            <div class="journal-subinfo">${subInfo}</div>
        </div>
        <div class="journal-type-icon">${typeIcon}</div>
        <div class="journal-company">${journal.owningCompanyName}</div>
        <div class="journal-balance">
            <div class="journal-balance-amount ${balanceClass}">${formatAmount(journal.currentBalance)}</div>
            <div class="journal-balance-currency">${journal.currency}</div>
            ${balanceExtra ? `<div class="journal-balance-available">${balanceExtra}</div>` : ''}
        </div>
        <div class="journal-status">
            <span class="status-indicator">${statusInfo.icon}</span>
            ${journal.alertMessage ? `<span class="status-badge">⚠️</span>` : ''}
        </div>
        <div class="journal-actions">
            <button class="btn-icon" title="Voir détail" onclick="event.stopPropagation(); viewJournal('${journal.code}')">
                <i class="fa-solid fa-arrow-right"></i>
            </button>
            <button class="btn-icon" title="Paramètres" onclick="event.stopPropagation(); manageSecurityJournal('${journal.code}')">
                <i class="fa-solid fa-cog"></i>
            </button>
            <button class="btn-icon" title="Statistiques" onclick="event.stopPropagation(); viewStats('${journal.code}')">
                <i class="fa-solid fa-chart-line"></i>
            </button>
        </div>
    `;

    return row;
}

function getTypeIcon(type) {
    const icons = {
        'BANK_ACCOUNT': '🏦',
        'CASH_DESK': '💵',
        'MOBILE_MONEY': '📱',
        'PETTY_CASH': '💳'
    };
    return icons[type] || '📋';
}

function getStatusInfo(status) {
    const statusMap = {
        'normal': { icon: '🟢', class: 'normal', label: 'Normal' },
        'warning': { icon: '🟡', class: 'warning', label: 'Attention' },
        'critical': { icon: '🔴', class: 'critical', label: 'Critique' }
    };
    return statusMap[status] || statusMap['normal'];
}

// ============================================================================
// POSITION GLOBALE
// ============================================================================

function updatePositionGlobale() {
    let totalBanques = 0;
    let totalCaisses = 0;
    let totalMobile = 0;

    demoJournals.forEach(journal => {
        if (journal.status !== 'ACTIVE') return;

        let amount = journal.currentBalance;
        if (journal.currency !== 'XAF' && journal.equivalentXAF) {
            amount = journal.equivalentXAF;
        }

        switch (journal.journalType) {
            case 'BANK_ACCOUNT':
                totalBanques += amount;
                break;
            case 'CASH_DESK':
            case 'PETTY_CASH':
                totalCaisses += amount;
                break;
            case 'MOBILE_MONEY':
                totalMobile += amount;
                break;
        }
    });

    const totalDisponible = totalBanques + totalCaisses + totalMobile;

    document.getElementById('totalDisponible').textContent = formatCurrency(totalDisponible);
    document.getElementById('totalBanques').textContent = formatCompactAmount(totalBanques);
    document.getElementById('totalCaisses').textContent = formatCompactAmount(totalCaisses);
    document.getElementById('totalMobile').textContent = formatCompactAmount(totalMobile);
}

function updateLastUpdateTime() {
    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('lastUpdate').textContent = `${dateStr} ${timeStr}`;
}

// ============================================================================
// FILTERING
// ============================================================================

function filterJournals() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const societe = document.getElementById('societeFilter').value;
    const type = document.getElementById('typeFilter').value;
    const status = document.getElementById('statusFilter').value;

    currentJournals = demoJournals.filter(journal => {
        const matchesSearch = !search ||
            journal.code.toLowerCase().includes(search) ||
            journal.name.toLowerCase().includes(search);
        const matchesSociete = !societe || journal.owningCompanyId === societe;
        const matchesType = !type || journal.journalType === type;
        const matchesStatus = !status || journal.status === status;

        return matchesSearch && matchesSociete && matchesType && matchesStatus;
    });

    renderJournals();
}

// ============================================================================
// MODAL & ACTIONS
// ============================================================================

function showQuickDetail(journal) {
    selectedJournal = journal;

    const typeIcon = getTypeIcon(journal.journalType);
    const statusInfo = getStatusInfo(journal.healthStatus);
    const isNegative = journal.currentBalance < 0;

    document.getElementById('modalTitle').textContent = `${typeIcon} ${journal.name}`;
    document.getElementById('modalBody').innerHTML = `
        <div class="info-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 20px;">
            <div>
                <div style="font-size: 12px; color: #6B7280; margin-bottom: 4px;">Code Journal</div>
                <div style="font-family: monospace; font-weight: 600; color: #263c89;">${journal.code}</div>
            </div>
            <div>
                <div style="font-size: 12px; color: #6B7280; margin-bottom: 4px;">Type</div>
                <div>${getTypeLabel(journal.journalType)}</div>
            </div>
            <div>
                <div style="font-size: 12px; color: #6B7280; margin-bottom: 4px;">Société</div>
                <div>${journal.owningCompanyName}</div>
            </div>
            <div>
                <div style="font-size: 12px; color: #6B7280; margin-bottom: 4px;">État</div>
                <div>${statusInfo.icon} ${statusInfo.label}</div>
            </div>
        </div>

        <div style="background: #F9FAFB; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="color: #6B7280;">Solde Actuel</span>
                <span style="font-size: 20px; font-weight: 700; ${isNegative ? 'color: #EF4444;' : ''}">${formatCurrency(journal.currentBalance)} ${journal.currency}</span>
            </div>
            ${journal.availableBalance ? `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="color: #6B7280;">Disponible</span>
                <span style="font-weight: 600;">${formatCurrency(journal.availableBalance)} ${journal.currency}</span>
            </div>
            ` : ''}
            ${journal.cashLimit ? `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="color: #6B7280;">Plafond Caisse</span>
                <span>${formatCurrency(journal.cashLimit)} XAF</span>
            </div>
            ` : ''}
            ${journal.equivalentXAF ? `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #6B7280;">Équivalent XAF</span>
                <span>~${formatCurrency(journal.equivalentXAF)} XAF</span>
            </div>
            ` : ''}
        </div>

        ${journal.bankDetails ? `
        <div style="background: #EFF6FF; border-radius: 8px; padding: 12px; margin-bottom: 16px;">
            <div style="font-weight: 600; color: #1E40AF; margin-bottom: 8px;">
                <i class="fa-solid fa-building-columns"></i> Détails Bancaires
            </div>
            <div style="font-size: 13px; color: #374151;">
                <div>Banque: ${journal.bankDetails.bankName}</div>
                <div>Compte: ${journal.bankDetails.accountNumber}</div>
                ${journal.bankDetails.iban ? `<div>IBAN: ${journal.bankDetails.iban}</div>` : ''}
            </div>
        </div>
        ` : ''}

        ${journal.mobileDetails ? `
        <div style="background: #FEF3C7; border-radius: 8px; padding: 12px; margin-bottom: 16px;">
            <div style="font-weight: 600; color: #92400E; margin-bottom: 8px;">
                <i class="fa-solid fa-mobile-screen"></i> Détails Mobile Money
            </div>
            <div style="font-size: 13px; color: #374151;">
                <div>Opérateur: ${journal.mobileDetails.operator}</div>
                <div>Numéro: ${journal.mobileDetails.phoneNumber}</div>
            </div>
        </div>
        ` : ''}

        ${journal.alertMessage ? `
        <div style="background: #FEF2F2; border: 1px solid #FCA5A5; border-radius: 8px; padding: 12px;">
            <div style="display: flex; align-items: center; gap: 8px; color: #B91C1C;">
                <i class="fa-solid fa-exclamation-triangle"></i>
                <strong>Alerte:</strong> ${journal.alertMessage}
            </div>
        </div>
        ` : ''}

        <div style="margin-top: 16px; font-size: 12px; color: #6B7280; text-align: right;">
            Dernière activité: ${journal.lastActivityDate}
        </div>
    `;

    document.getElementById('detailModal').classList.add('active');
}

function closeDetailModal() {
    document.getElementById('detailModal').classList.remove('active');
    selectedJournal = null;
}

function goToDetail() {
    if (selectedJournal) {
        window.location.href = `./journal-detail.html?code=${selectedJournal.code}`;
    }
}

function viewJournal(code) {
    window.location.href = `./journal-detail.html?code=${code}`;
}

function editJournal(code) {
    window.location.href = `./journal-create.html?code=${code}`;
}

function manageSecurityJournal(code) {
    window.location.href = `./journal-security.html?code=${code}`;
}

function viewStats(code) {
    window.location.href = `./journal-detail.html?code=${code}&tab=stats`;
}

// ============================================================================
// EXPORT & REFRESH
// ============================================================================

function exportToExcel() {
    showNotification('Export Excel en cours...', 'info');

    // Prepare CSV data
    let csv = 'Code,Libellé,Type,Société,Solde,Devise,État\n';

    currentJournals.forEach(journal => {
        csv += `"${journal.code}","${journal.name}","${getTypeLabel(journal.journalType)}","${journal.owningCompanyName}",${journal.currentBalance},"${journal.currency}","${journal.healthStatus}"\n`;
    });

    // Download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `journaux_tresorerie_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    showNotification('Export Excel terminé', 'success');
}

function refreshData() {
    showNotification('Actualisation des données...', 'info');

    setTimeout(() => {
        updatePositionGlobale();
        updateLastUpdateTime();
        renderJournals();
        showNotification('Données actualisées', 'success');
    }, 1000);
}

function startAutoRefresh() {
    // Auto-refresh every 5 minutes
    setInterval(() => {
        updateLastUpdateTime();
        updatePositionGlobale();
    }, 300000);
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatAmount(amount) {
    if (amount === null || amount === undefined) return '-';
    return Math.abs(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function formatCurrency(amount) {
    if (amount === null || amount === undefined) return '-';
    const prefix = amount < 0 ? '-' : '';
    return prefix + Math.abs(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function formatCompactAmount(amount) {
    if (amount === null || amount === undefined) return '-';
    const absAmount = Math.abs(amount);
    const prefix = amount < 0 ? '-' : '';

    if (absAmount >= 1000000000) {
        return prefix + (absAmount / 1000000000).toFixed(1) + 'Md';
    } else if (absAmount >= 1000000) {
        return prefix + (absAmount / 1000000).toFixed(1) + 'M';
    } else if (absAmount >= 1000) {
        return prefix + (absAmount / 1000).toFixed(0) + 'K';
    }
    return prefix + absAmount.toString();
}

function getTypeLabel(type) {
    const labels = {
        'BANK_ACCOUNT': 'Compte Bancaire',
        'CASH_DESK': 'Caisse',
        'MOBILE_MONEY': 'Mobile Money',
        'PETTY_CASH': 'Petite Caisse'
    };
    return labels[type] || type;
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

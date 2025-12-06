/**
 * MultiFlex GESCOM - Liste des Factures
 * Module Ventes - ECR-FAC-001
 */

// =====================================================
// MOCK DATA
// =====================================================

const mockInvoices = [
    {
        id: 'FA001',
        numero: 'FA-CLI156-2024-00567',
        date: '29/01/2024',
        client: {
            code: 'CLI156',
            nom: 'SONACOM SARL',
            nui: 'P0872012345',
            commercial: 'M. DJOMO',
            phone: '699 123 456'
        },
        montantTTC: 2500000,
        montantHT: 2095238,
        tva: 404762,
        retenue: 23048,
        netAPayer: 2476952,
        echeance: '28/02/2024',
        delaiJours: 30,
        paye: 0,
        pourcentPaye: 0,
        statut: 'pending',
        type: 'invoice',
        blSource: 'BL-CLI156-2024-00235',
        bcOrigine: 'BC-CLI156-2024-00234',
        paiements: []
    },
    {
        id: 'FA002',
        numero: 'FA-CLI089-2024-00566',
        date: '28/01/2024',
        client: {
            code: 'CLI089',
            nom: 'QUINCAILLERIE MODERNE',
            nui: 'P0654321098',
            commercial: 'J. FOTSO',
            phone: '677 890 123'
        },
        montantTTC: 850000,
        montantHT: 712866,
        tva: 137134,
        retenue: 7842,
        netAPayer: 842158,
        echeance: '28/01/2024',
        delaiJours: 0,
        paye: 850000,
        pourcentPaye: 100,
        statut: 'paid',
        type: 'invoice',
        blSource: 'BL-CLI089-2024-00198',
        bcOrigine: 'BC-CLI089-2024-00089',
        paiements: [{ date: '28/01/2024', montant: 850000, mode: 'Comptant' }]
    },
    {
        id: 'FA003',
        numero: 'FA-CLI234-2024-00565',
        date: '27/01/2024',
        client: {
            code: 'CLI234',
            nom: 'KAMGA Jean Paul',
            nui: 'Particulier',
            commercial: 'J. FOTSO',
            phone: '655 234 567',
            cni: '12345678901'
        },
        montantTTC: 150000,
        montantHT: 125784,
        tva: 24216,
        retenue: 0,
        netAPayer: 150000,
        echeance: '27/01/2024',
        delaiJours: 0,
        paye: 150000,
        pourcentPaye: 100,
        statut: 'paid',
        type: 'invoice',
        blSource: 'BL-CLI234-2024-00167',
        bcOrigine: 'BC-CLI234-2024-00456',
        paiements: [{ date: '27/01/2024', montant: 150000, mode: 'Espèces' }]
    },
    {
        id: 'FA004',
        numero: 'FA-CLI312-2024-00564',
        date: '25/01/2024',
        client: {
            code: 'CLI312',
            nom: 'TECHNI-BUILD',
            nui: 'P0765432109',
            commercial: 'P. NGONO',
            phone: '699 456 789'
        },
        montantTTC: 3200000,
        montantHT: 2683264,
        tva: 516736,
        retenue: 29516,
        netAPayer: 3170484,
        echeance: '25/03/2024',
        delaiJours: 60,
        joursRestants: 31,
        paye: 1200000,
        pourcentPaye: 37.5,
        statut: 'partial',
        type: 'invoice',
        blSource: 'BL-CLI312-2024-00145',
        bcOrigine: 'BC-CLI312-2024-00178',
        paiements: [{ date: '30/01/2024', montant: 1200000, mode: 'Virement' }]
    },
    {
        id: 'FA005',
        numero: 'FA-CLI445-2024-00563',
        date: '20/01/2024',
        client: {
            code: 'CLI445',
            nom: 'ENTREPRISE XYZ',
            nui: 'P0543210987',
            commercial: 'M. DJOMO',
            phone: '699 567 890',
            alert: 'Limite crédit dépassée'
        },
        montantTTC: 5500000,
        montantHT: 4612546,
        tva: 887454,
        retenue: 50738,
        netAPayer: 5449262,
        echeance: '19/02/2024',
        delaiJours: 30,
        joursEchu: 10,
        paye: 0,
        pourcentPaye: 0,
        statut: 'overdue',
        type: 'invoice',
        blSource: 'BL-CLI445-2024-00112',
        bcOrigine: 'BC-CLI445-2024-00098',
        paiements: [],
        needsRelance: true
    },
    {
        id: 'AV001',
        numero: 'AV-CLI156-2024-00023',
        date: '28/01/2024',
        client: {
            code: 'CLI156',
            nom: 'SONACOM SARL',
            nui: 'P0872012345',
            commercial: 'M. DJOMO',
            phone: '699 123 456'
        },
        montantTTC: -125000,
        montantHT: -104822,
        tva: -20178,
        retenue: 0,
        netAPayer: -125000,
        echeance: '-',
        delaiJours: 0,
        paye: 0,
        pourcentPaye: 0,
        statut: 'avoir',
        type: 'avoir',
        motif: 'Avoir retour marchandise',
        factureOrigine: 'FA-CLI156-2024-00564',
        paiements: []
    }
];

// =====================================================
// STATE
// =====================================================

let state = {
    selectedInvoices: [],
    currentInvoice: null,
    filters: {
        period: 'month',
        status: '',
        type: '',
        client: '',
        commercial: '',
        amountMin: '',
        amountMax: '',
        number: ''
    }
};

// =====================================================
// INITIALIZATION
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
    renderInvoicesTable();
    updateGroupedActions();
});

// =====================================================
// TABLE RENDERING
// =====================================================

function renderInvoicesTable() {
    const tbody = document.getElementById('invoicesTableBody');

    const rows = mockInvoices.map(invoice => {
        const statusBadge = getStatusBadge(invoice);
        const echeanceDisplay = getEcheanceDisplay(invoice);
        const payeDisplay = getPayeDisplay(invoice);

        return `
            <tr onclick="openDetailPanel('${invoice.id}')" data-invoice-id="${invoice.id}">
                <td onclick="event.stopPropagation()">
                    <input type="checkbox"
                           onchange="toggleInvoiceSelection('${invoice.id}', this.checked)"
                           ${state.selectedInvoices.includes(invoice.id) ? 'checked' : ''}>
                </td>
                <td>
                    <div class="invoice-number">${invoice.numero}</div>
                    <div class="invoice-date">${invoice.date}</div>
                </td>
                <td>
                    <div class="invoice-date">${invoice.date}</div>
                </td>
                <td>
                    <div class="client-name">${invoice.client.nom}</div>
                    <div class="client-details">
                        ${invoice.client.nui !== 'Particulier' ? `NUI: ${invoice.client.nui}` : `CNI: ${invoice.client.cni || '-'}`}
                    </div>
                    <div class="client-details">Com: ${invoice.client.commercial}</div>
                    <div class="client-details"><i class="fa-solid fa-phone" style="font-size: 10px;"></i> ${invoice.client.phone}</div>
                    ${invoice.client.alert ? `<div class="client-details" style="color: #DC2626;"><i class="fa-solid fa-exclamation-triangle"></i> ${invoice.client.alert}</div>` : ''}
                </td>
                <td style="text-align: right;">
                    <div class="amount-ttc">${formatMoney(invoice.montantTTC)} XAF</div>
                    ${invoice.type === 'avoir' ? `<div class="amount-sub">${invoice.motif}</div>` : ''}
                </td>
                <td>
                    ${echeanceDisplay}
                </td>
                <td style="text-align: right;">
                    ${payeDisplay}
                </td>
                <td>
                    ${statusBadge}
                </td>
                <td onclick="event.stopPropagation()">
                    <button class="action-btn" onclick="openDetailPanel('${invoice.id}')">
                        <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    tbody.innerHTML = rows;
}

function getStatusBadge(invoice) {
    const statusConfig = {
        pending: { class: 'status-pending', icon: 'fa-clock', label: '' },
        partial: { class: 'status-partial', icon: 'fa-coins', label: '' },
        paid: { class: 'status-paid', icon: 'fa-check', label: '' },
        overdue: { class: 'status-overdue', icon: 'fa-exclamation', label: '' },
        warning: { class: 'status-warning', icon: 'fa-triangle-exclamation', label: '' },
        avoir: { class: 'status-avoir', icon: 'fa-file', label: '' },
        contentieux: { class: 'status-contentieux', icon: 'fa-gavel', label: '' }
    };

    const config = statusConfig[invoice.statut] || statusConfig.pending;
    return `<span class="status-badge ${config.class}"><i class="fa-solid ${config.icon}"></i></span>`;
}

function getEcheanceDisplay(invoice) {
    if (invoice.type === 'avoir') {
        return `<div class="echeance-date">-</div>`;
    }

    let daysText = '';
    let daysClass = '';

    if (invoice.statut === 'paid') {
        daysText = invoice.delaiJours === 0 ? 'Comptant' : `${invoice.delaiJours}j`;
        daysClass = 'color: #059669;';
    } else if (invoice.joursEchu) {
        daysText = `Échu ${invoice.joursEchu}j`;
        daysClass = 'color: #DC2626; font-weight: 600;';
        if (invoice.needsRelance) {
            daysText += ' !Relance';
        }
    } else if (invoice.joursRestants !== undefined) {
        daysText = `${invoice.joursRestants}j rest.`;
        daysClass = 'color: #D97706;';
    } else {
        daysText = `${invoice.delaiJours}j`;
    }

    return `
        <div class="echeance-date">${invoice.echeance}</div>
        <div class="echeance-days" style="${daysClass}">${daysText}</div>
    `;
}

function getPayeDisplay(invoice) {
    if (invoice.type === 'avoir') {
        return `
            <div class="paid-amount" style="color: #4338CA;">Imputé</div>
            <div class="paid-percent">${invoice.factureOrigine}</div>
        `;
    }

    if (invoice.paye === 0) {
        return `
            <div class="paid-amount" style="color: #DC2626;">0</div>
            <div class="paid-percent">0%</div>
        `;
    }

    const color = invoice.pourcentPaye === 100 ? '#059669' : '#D97706';
    return `
        <div class="paid-amount" style="color: ${color};">${formatMoneyShort(invoice.paye)}</div>
        <div class="paid-percent">${invoice.pourcentPaye}%</div>
    `;
}

// =====================================================
// SELECTION
// =====================================================

function toggleSelectAll() {
    const checkbox = document.getElementById('selectAll');
    const allCheckboxes = document.querySelectorAll('#invoicesTableBody input[type="checkbox"]');

    if (checkbox.checked) {
        state.selectedInvoices = mockInvoices.map(inv => inv.id);
    } else {
        state.selectedInvoices = [];
    }

    allCheckboxes.forEach(cb => {
        cb.checked = checkbox.checked;
    });

    updateGroupedActions();
}

function toggleInvoiceSelection(invoiceId, checked) {
    if (checked) {
        if (!state.selectedInvoices.includes(invoiceId)) {
            state.selectedInvoices.push(invoiceId);
        }
    } else {
        state.selectedInvoices = state.selectedInvoices.filter(id => id !== invoiceId);
    }

    // Update select all checkbox
    const allCheckboxes = document.querySelectorAll('#invoicesTableBody input[type="checkbox"]');
    const selectAllCheckbox = document.getElementById('selectAll');
    selectAllCheckbox.checked = state.selectedInvoices.length === mockInvoices.length;

    updateGroupedActions();
}

function updateGroupedActions() {
    const count = state.selectedInvoices.length;
    const total = state.selectedInvoices.reduce((sum, id) => {
        const invoice = mockInvoices.find(inv => inv.id === id);
        return sum + (invoice ? Math.abs(invoice.montantTTC) : 0);
    }, 0);

    document.getElementById('selectedCount').textContent = count;
    document.getElementById('selectedTotal').textContent = `${formatMoney(total)} XAF`;
}

// =====================================================
// DETAIL PANEL
// =====================================================

function openDetailPanel(invoiceId) {
    const invoice = mockInvoices.find(inv => inv.id === invoiceId);
    if (!invoice) return;

    state.currentInvoice = invoice;

    // Update panel content
    document.getElementById('detailTitle').textContent = `${invoice.numero} - ${invoice.client.nom}`;
    document.getElementById('detailClientName').textContent = invoice.client.nom;
    document.getElementById('detailClientNUI').textContent = invoice.client.nui;
    document.getElementById('detailCommercial').textContent = invoice.client.commercial;
    document.getElementById('detailContact').textContent = invoice.client.phone;

    document.getElementById('detailDateEmission').textContent = invoice.date;
    document.getElementById('detailEcheance').textContent = invoice.echeance !== '-'
        ? `${invoice.echeance} (${invoice.delaiJours}j)`
        : '-';
    document.getElementById('detailBLSource').textContent = invoice.blSource || '-';
    document.getElementById('detailBCOrigine').textContent = invoice.bcOrigine || '-';

    document.getElementById('detailMontantHT').textContent = `${formatMoney(Math.abs(invoice.montantHT))} XAF`;
    document.getElementById('detailTVA').textContent = `${formatMoney(Math.abs(invoice.tva))} XAF`;
    document.getElementById('detailTTC').textContent = `${formatMoney(Math.abs(invoice.montantTTC))} XAF`;
    document.getElementById('detailRetenue').textContent = invoice.retenue ? `-${formatMoney(invoice.retenue)} XAF` : '-';
    document.getElementById('detailNetAPayer').textContent = `${formatMoney(Math.abs(invoice.netAPayer))} XAF`;

    // Payments
    const paiementsText = invoice.paiements.length > 0
        ? invoice.paiements.map(p => `${p.date}: ${formatMoney(p.montant)} XAF (${p.mode})`).join('<br>')
        : 'AUCUN';
    document.getElementById('detailPaiementsRecus').innerHTML = paiementsText;

    const soldeDu = invoice.type === 'avoir' ? 0 : Math.abs(invoice.netAPayer) - invoice.paye;
    document.getElementById('detailSoldeDu').textContent = `${formatMoney(soldeDu)} XAF`;

    // Alert
    const alertDiv = document.getElementById('detailAlert');
    if (invoice.client.alert || invoice.needsRelance) {
        alertDiv.style.display = 'block';
        document.getElementById('detailAlertText').textContent = invoice.client.alert || 'Relance recommandée';
    } else {
        alertDiv.style.display = 'none';
    }

    // Show panel
    document.getElementById('detailOverlay').classList.add('show');
    document.getElementById('detailPanel').classList.add('show');
}

function closeDetailPanel() {
    document.getElementById('detailOverlay').classList.remove('show');
    document.getElementById('detailPanel').classList.remove('show');
    state.currentInvoice = null;
}

// =====================================================
// FILTERS
// =====================================================

function applyFilters() {
    // Get filter values
    state.filters = {
        period: document.getElementById('filterPeriod').value,
        status: document.getElementById('filterStatus').value,
        type: document.getElementById('filterType').value,
        client: document.getElementById('filterClient').value,
        commercial: document.getElementById('filterCommercial').value,
        amountMin: document.getElementById('filterAmountMin').value,
        amountMax: document.getElementById('filterAmountMax').value,
        number: document.getElementById('filterNumber').value
    };

    // In a real app, this would filter the data
    showNotification('Filtres appliqués', 'success');
    renderInvoicesTable();
}

function resetFilters() {
    document.getElementById('filterPeriod').value = 'month';
    document.getElementById('filterStatus').value = '';
    document.getElementById('filterType').value = '';
    document.getElementById('filterClient').value = '';
    document.getElementById('filterCommercial').value = '';
    document.getElementById('filterAmountMin').value = '';
    document.getElementById('filterAmountMax').value = '';
    document.getElementById('filterNumber').value = '';
    document.getElementById('showAvoirs').checked = true;
    document.getElementById('showProforma').checked = false;

    state.filters = {
        period: 'month',
        status: '',
        type: '',
        client: '',
        commercial: '',
        amountMin: '',
        amountMax: '',
        number: ''
    };

    renderInvoicesTable();
    showNotification('Filtres réinitialisés', 'info');
}

// =====================================================
// ACTIONS
// =====================================================

function viewInvoice() {
    if (state.currentInvoice) {
        // In a real app, navigate to invoice detail
        showNotification(`Ouverture de ${state.currentInvoice.numero}...`, 'info');
    }
}

function sendInvoice() {
    if (state.currentInvoice) {
        showNotification(`Envoi de ${state.currentInvoice.numero} par email...`, 'success');
    }
}

function printInvoice() {
    if (state.currentInvoice) {
        showNotification(`Impression de ${state.currentInvoice.numero}...`, 'info');
    }
}

function recordPayment() {
    if (state.currentInvoice) {
        // In a real app, open payment modal
        showNotification('Ouverture du formulaire de paiement...', 'info');
    }
}

function createAvoir() {
    if (state.currentInvoice) {
        window.location.href = `./avoir-create.html?facture=${state.currentInvoice.id}`;
    }
}

function sendReminder() {
    if (state.currentInvoice) {
        showNotification(`Relance envoyée pour ${state.currentInvoice.numero}`, 'success');
    }
}

// Grouped actions
function sendGroupEmail() {
    if (state.selectedInvoices.length === 0) {
        showNotification('Veuillez sélectionner au moins une facture', 'warning');
        return;
    }
    showNotification(`Envoi groupé de ${state.selectedInvoices.length} facture(s)...`, 'success');
}

function sendReminders() {
    if (state.selectedInvoices.length === 0) {
        showNotification('Veuillez sélectionner au moins une facture', 'warning');
        return;
    }
    showNotification(`Relance envoyée pour ${state.selectedInvoices.length} facture(s)`, 'success');
}

function doLettrage() {
    if (state.selectedInvoices.length === 0) {
        showNotification('Veuillez sélectionner au moins une facture', 'warning');
        return;
    }
    showNotification('Ouverture du lettrage...', 'info');
}

function printSelected() {
    if (state.selectedInvoices.length === 0) {
        showNotification('Veuillez sélectionner au moins une facture', 'warning');
        return;
    }
    showNotification(`Impression de ${state.selectedInvoices.length} facture(s)...`, 'info');
}

function showAnalysis() {
    showNotification('Ouverture de l\'analyse des factures...', 'info');
}

function showBalance() {
    showNotification('Génération de la balance âgée...', 'info');
}

function exportData() {
    showNotification('Export des données en cours...', 'success');
}

// =====================================================
// UTILITIES
// =====================================================

function formatMoney(amount) {
    return new Intl.NumberFormat('fr-FR').format(Math.round(amount));
}

function formatMoneyShort(amount) {
    if (Math.abs(amount) >= 1000000) {
        return `${(amount / 1000000).toFixed(1)}M`;
    } else if (Math.abs(amount) >= 1000) {
        return `${(amount / 1000).toFixed(0)}K`;
    }
    return formatMoney(amount);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');

    const bgColors = {
        success: '#D1FAE5',
        warning: '#FEF3C7',
        danger: '#FEE2E2',
        info: '#DBEAFE'
    };

    const textColors = {
        success: '#065F46',
        warning: '#92400E',
        danger: '#991B1B',
        info: '#1E40AF'
    };

    const icons = {
        success: 'fa-check-circle',
        warning: 'fa-exclamation-triangle',
        danger: 'fa-times-circle',
        info: 'fa-info-circle'
    };

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 3000;
        min-width: 300px;
        padding: 12px 16px;
        border-radius: 8px;
        background: ${bgColors[type]};
        color: ${textColors[type]};
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 13px;
        animation: slideIn 0.3s ease;
    `;

    notification.innerHTML = `
        <i class="fa-solid ${icons[type]}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    // Add animation styles if not exists
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    // Remove after delay
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

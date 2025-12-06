/**
 * MultiFlex GESCOM - Création Facture Client
 * Module Ventes - ECR-FAC-002
 */

// =====================================================
// MOCK DATA
// =====================================================

const mockClients = {
    'CLI156': {
        code: 'CLI-2024-00156',
        nom: 'SONACOM SARL',
        nui: 'P087201234567W',
        regime: 'Réel - TVA 19.25%',
        contact: 'Pierre FOTSO - 699 123 456',
        email: 'comptabilite@sonacom.cm',
        commercial: 'Marie DJOMO (COM-025)',
        address: {
            siege: 'Boulevard de la Liberté\nBonanjo, Douala\nBP 12345 Douala\nCameroun',
            chantier: 'Zone Industrielle\nBassa, Douala\nCameroun'
        },
        paymentTerms: 30,
        creditLimit: 5000000,
        hasANR: true,
        anrExpiry: '31/12/2024',
        unpaidInvoice: 'FA-2024-00456',
        unpaidDays: 15
    },
    'CLI089': {
        code: 'CLI-2024-00089',
        nom: 'QUINCAILLERIE MODERNE',
        nui: 'P0654321098W',
        regime: 'Réel - TVA 19.25%',
        contact: 'Jean MBARGA - 677 890 123',
        email: 'quincaillerie.moderne@gmail.com',
        commercial: 'Jean FOTSO (COM-018)',
        address: {
            siege: 'Rue de la Paix\nAkwa, Douala\nCameroun'
        },
        paymentTerms: 0,
        creditLimit: 1000000,
        hasANR: true,
        anrExpiry: '30/06/2024',
        unpaidInvoice: null,
        unpaidDays: 0
    },
    'CLI312': {
        code: 'CLI-2024-00312',
        nom: 'TECHNI-BUILD',
        nui: 'P0765432109W',
        regime: 'Réel - TVA 19.25%',
        contact: 'Marie BELL - 690 123 456',
        email: 'contact@techni-build.cm',
        commercial: 'Paul NGONO (COM-032)',
        address: {
            siege: 'Avenue Kennedy\nLogbessou, Douala\nCameroun'
        },
        paymentTerms: 60,
        creditLimit: 10000000,
        hasANR: true,
        anrExpiry: '31/12/2024',
        unpaidInvoice: null,
        unpaidDays: 0
    }
};

const mockBLs = {
    'CLI156': [
        {
            id: 'BL001',
            numero: 'BL-CLI156-2024-00235',
            date: '29/01/2024',
            bcSource: 'BC-00234',
            bcDate: '28/01/2024',
            articles: 3,
            articlesTotal: 4,
            status: 'partial',
            montantTTC: 2500000,
            items: [
                { code: 'PEINT-BLC-05L', name: 'Peinture Blanche 5L Latex Mat', qty: 20, unit: 'POT 5L', puHT: 4200, remise: 0, tva: 19.25 },
                { code: 'CIMENT-50KG', name: 'Ciment Portland CEM II 42.5', qty: 100, unit: 'SAC 50KG', puHT: 6800, remise: 5, tva: 19.25 },
                { code: 'FER-12MM', name: 'Fer à béton 12mm x 12m', qty: 50, unit: 'BARRE 12M', puHT: 4500, remise: 0, tva: 19.25 }
            ]
        },
        {
            id: 'BL002',
            numero: 'BL-CLI156-2024-00198',
            date: '25/01/2024',
            bcSource: 'BC-00189',
            bcDate: '23/01/2024',
            articles: 10,
            articlesTotal: 10,
            status: 'complete',
            montantTTC: 1250000,
            items: [
                { code: 'TUBE-PVC-110', name: 'Tube PVC 110mm', qty: 50, unit: 'TUBE 4M', puHT: 8500, remise: 0, tva: 19.25 },
                { code: 'COUDE-PVC-110', name: 'Coude PVC 110mm', qty: 100, unit: 'PIECE', puHT: 1200, remise: 0, tva: 19.25 }
            ]
        },
        {
            id: 'BL003',
            numero: 'BL-CLI156-2024-00167',
            date: '20/01/2024',
            bcSource: 'BC-00156',
            bcDate: '18/01/2024',
            articles: 5,
            articlesTotal: 5,
            status: 'complete',
            montantTTC: 750000,
            items: [
                { code: 'CARREL-30x30', name: 'Carrelage 30x30 Blanc', qty: 100, unit: 'M²', puHT: 5500, remise: 3, tva: 19.25 }
            ]
        }
    ],
    'CLI089': [
        {
            id: 'BL004',
            numero: 'BL-CLI089-2024-00145',
            date: '28/01/2024',
            bcSource: 'BC-00201',
            bcDate: '27/01/2024',
            articles: 8,
            articlesTotal: 8,
            status: 'complete',
            montantTTC: 450000,
            items: [
                { code: 'CLOU-80MM', name: 'Clou tête plate 80mm', qty: 50, unit: 'KG', puHT: 2500, remise: 0, tva: 19.25 },
                { code: 'VIS-45MM', name: 'Vis à bois 45mm', qty: 100, unit: 'BOITE', puHT: 1800, remise: 0, tva: 19.25 }
            ]
        }
    ],
    'CLI312': []
};

// =====================================================
// STATE
// =====================================================

let state = {
    currentTab: 0,
    completedTabs: [],
    invoiceType: 'bl',
    selectedClient: null,
    selectedBLs: [],
    articles: [],
    totals: {
        brutHT: 0,
        remise: 0,
        netHT: 0,
        tva: 0,
        ttc: 0,
        retenue: 0,
        netAPayer: 0
    },
    paymentType: 'unique',
    invoiceNumber: '',
    invoiceDate: ''
};

// =====================================================
// INITIALIZATION
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
    initInvoiceNumber();
    initInvoiceDate();
    renderArticlesTable();
});

function initInvoiceNumber() {
    const year = new Date().getFullYear();
    const randomNum = String(Math.floor(Math.random() * 900) + 100).padStart(5, '0');
    state.invoiceNumber = `FA-XXXX-${year}-${randomNum}`;
    document.getElementById('invoiceNumber').textContent = state.invoiceNumber;
}

function initInvoiceDate() {
    const now = new Date();
    state.invoiceDate = now.toLocaleDateString('fr-FR');
    document.getElementById('invoiceDate').textContent = state.invoiceDate;

    // Set input date
    const dateInput = document.getElementById('invoiceDateInput');
    if (dateInput) {
        dateInput.value = now.toISOString().split('T')[0];
    }
}

// =====================================================
// TAB NAVIGATION
// =====================================================

function switchTab(index) {
    // Validate current tab before switching (if going forward)
    if (index > state.currentTab) {
        if (!validateCurrentTab()) {
            return;
        }
        markTabCompleted(state.currentTab);
    }

    state.currentTab = index;

    // Update tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
    });

    // Update tab content
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach((content, i) => {
        content.classList.toggle('active', i === index);
    });

    // Update recap on validation tab
    if (index === 4) {
        updateRecap();
    }
}

function nextTab() {
    if (state.currentTab < 4) {
        switchTab(state.currentTab + 1);
    }
}

function prevTab() {
    if (state.currentTab > 0) {
        switchTab(state.currentTab - 1);
    }
}

function markTabCompleted(index) {
    if (!state.completedTabs.includes(index)) {
        state.completedTabs.push(index);
    }

    const tabButtons = document.querySelectorAll('.tab-button');
    if (tabButtons[index]) {
        tabButtons[index].classList.add('completed');
    }
}

function validateCurrentTab() {
    switch (state.currentTab) {
        case 0: // Source
            if (state.invoiceType === 'bl' && state.selectedBLs.length === 0) {
                showNotification('Veuillez sélectionner au moins un BL', 'warning');
                return false;
            }
            break;
        case 1: // Client
            // Client is auto-filled from BL
            break;
        case 2: // Articles
            if (state.articles.length === 0) {
                showNotification('Aucun article à facturer', 'warning');
                return false;
            }
            break;
        case 3: // Paiement
            // Validate payment terms
            break;
    }
    return true;
}

// =====================================================
// INVOICE TYPE SELECTION
// =====================================================

function selectInvoiceType(type) {
    state.invoiceType = type;

    // Update radio options
    const options = document.querySelectorAll('#invoiceTypeGroup .radio-option');
    options.forEach(opt => {
        const radio = opt.querySelector('input[type="radio"]');
        opt.classList.toggle('selected', radio.value === type);
    });

    // Show/hide BL selection section
    const blSection = document.getElementById('blSelectionSection');
    if (blSection) {
        blSection.style.display = type === 'bl' ? 'block' : 'none';
    }
}

// =====================================================
// CLIENT AND BL SELECTION
// =====================================================

function loadClientBLs() {
    const clientId = document.getElementById('sourceClient').value;
    const tbody = document.getElementById('blTableBody');

    if (!clientId) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: #6B7280; padding: 30px;">
                    Sélectionnez un client pour voir les BL disponibles
                </td>
            </tr>
        `;
        state.selectedClient = null;
        state.selectedBLs = [];
        return;
    }

    state.selectedClient = mockClients[clientId];
    const bls = mockBLs[clientId] || [];

    if (bls.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: #6B7280; padding: 30px;">
                    Aucun BL à facturer pour ce client
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = bls.map(bl => `
        <tr>
            <td>
                <input type="checkbox" data-bl-id="${bl.id}" onchange="toggleBLSelection('${bl.id}', this.checked)">
            </td>
            <td>
                <div class="bl-number">${bl.numero}</div>
            </td>
            <td>${bl.date}</td>
            <td>
                <div>${bl.bcSource}</div>
                <div style="font-size: 11px; color: #6B7280;">${bl.bcDate}</div>
            </td>
            <td>
                <span class="bl-status ${bl.status === 'partial' ? 'bl-status-partial' : 'bl-status-complete'}">
                    ${bl.articles}/${bl.articlesTotal} ${bl.status === 'partial' ? 'Partiel' : 'Complet'}
                </span>
            </td>
            <td style="text-align: right; font-weight: 500;">
                ${formatMoney(bl.montantTTC)} XAF
            </td>
        </tr>
    `).join('');

    // Update client info in form
    updateClientInfo(state.selectedClient);

    // Update invoice number with client code
    updateInvoiceNumber(clientId);
}

function toggleBLSelection(blId, checked) {
    const clientId = document.getElementById('sourceClient').value;
    const bls = mockBLs[clientId] || [];
    const bl = bls.find(b => b.id === blId);

    if (!bl) return;

    if (checked) {
        if (!state.selectedBLs.includes(blId)) {
            state.selectedBLs.push(blId);
            // Add articles from BL
            bl.items.forEach(item => {
                state.articles.push({ ...item, blId: blId });
            });
        }
    } else {
        state.selectedBLs = state.selectedBLs.filter(id => id !== blId);
        // Remove articles from this BL
        state.articles = state.articles.filter(art => art.blId !== blId);
    }

    updateSelectedBLTotal();
    renderArticlesTable();
    calculateTotals();
}

function toggleSelectAllBLs() {
    const selectAll = document.getElementById('selectAllBLs').checked;
    const checkboxes = document.querySelectorAll('#blTableBody input[type="checkbox"]');

    checkboxes.forEach(cb => {
        if (cb.checked !== selectAll) {
            cb.checked = selectAll;
            toggleBLSelection(cb.dataset.blId, selectAll);
        }
    });
}

function updateSelectedBLTotal() {
    const clientId = document.getElementById('sourceClient').value;
    const bls = mockBLs[clientId] || [];

    const total = state.selectedBLs.reduce((sum, blId) => {
        const bl = bls.find(b => b.id === blId);
        return sum + (bl ? bl.montantTTC : 0);
    }, 0);

    document.getElementById('selectedBLTotal').textContent = `Total sélectionné: ${formatMoney(total)} XAF`;
    document.getElementById('headerAmount').textContent = `${formatMoney(total)} XAF`;
}

function updateInvoiceNumber(clientId) {
    const year = new Date().getFullYear();
    const randomNum = String(Math.floor(Math.random() * 900) + 100).padStart(5, '0');
    state.invoiceNumber = `FA-${clientId}-${year}-${randomNum}`;
    document.getElementById('invoiceNumber').textContent = state.invoiceNumber;
    document.getElementById('paymentRef').textContent = state.invoiceNumber;
}

// =====================================================
// CLIENT INFO
// =====================================================

function updateClientInfo(client) {
    if (!client) return;

    document.getElementById('clientCode').value = `${client.code} - ${client.nom}`;
    document.getElementById('clientNUI').value = client.nui;
    document.getElementById('clientRegime').value = client.regime;
    document.getElementById('clientContact').value = client.contact;
    document.getElementById('clientEmail').value = client.email;
    document.getElementById('commercial').value = client.commercial;

    // Update address
    if (client.address.siege) {
        document.getElementById('addressPreview').innerHTML = client.address.siege.replace(/\n/g, '<br>');
    }

    // Update verification items
    const unpaidWarning = document.getElementById('unpaidWarning');
    if (client.unpaidInvoice) {
        unpaidWarning.style.display = 'flex';
        unpaidWarning.querySelector('span').textContent =
            `Facture précédente ${client.unpaidInvoice} impayée (${client.unpaidDays} jours)`;
    } else {
        unpaidWarning.style.display = 'none';
    }

    // Update due date based on payment terms
    const invoiceDate = new Date(document.getElementById('invoiceDateInput').value);
    const dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + client.paymentTerms);
    document.getElementById('dueDate').value = dueDate.toISOString().split('T')[0];
}

// =====================================================
// ARTICLES TABLE
// =====================================================

function renderArticlesTable() {
    const tbody = document.getElementById('articlesTableBody');

    if (state.articles.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; color: #6B7280; padding: 30px;">
                    Sélectionnez des BL pour charger les articles
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = state.articles.map((article, index) => {
        const totalHT = (article.qty * article.puHT) * (1 - article.remise / 100);
        return `
            <tr>
                <td>${index + 1}</td>
                <td>
                    <div class="article-code">${article.code}</div>
                </td>
                <td>
                    <div class="article-name">${article.name}</div>
                </td>
                <td style="text-align: center;">${article.qty}</td>
                <td>${article.unit}</td>
                <td style="text-align: right;">${formatMoney(article.puHT)}</td>
                <td style="text-align: center;">
                    <input type="number" value="${article.remise}" min="0" max="100"
                           onchange="updateArticleRemise(${index}, this.value)">
                </td>
                <td style="text-align: right; font-weight: 500;">${formatMoney(totalHT)} XAF</td>
                <td>${article.tva}%</td>
            </tr>
        `;
    }).join('');

    calculateTotals();
}

function updateArticleRemise(index, value) {
    if (state.articles[index]) {
        state.articles[index].remise = parseFloat(value) || 0;
        renderArticlesTable();
    }
}

function addManualLine() {
    state.articles.push({
        code: '',
        name: 'Nouvelle ligne',
        qty: 1,
        unit: 'U',
        puHT: 0,
        remise: 0,
        tva: 19.25,
        blId: null
    });
    renderArticlesTable();
}

// =====================================================
// CALCULATIONS
// =====================================================

function calculateTotals() {
    let brutHT = 0;
    let totalRemise = 0;

    state.articles.forEach(article => {
        const lineTotal = article.qty * article.puHT;
        const lineRemise = lineTotal * (article.remise / 100);
        brutHT += lineTotal;
        totalRemise += lineRemise;
    });

    const netHT = brutHT - totalRemise;
    const tva = netHT * 0.1925; // 19.25%
    const ttc = netHT + tva;

    const applyRetenue = document.getElementById('applyRetenue')?.checked ?? true;
    const retenue = applyRetenue ? ttc * 0.011 : 0; // 1.1%
    const netAPayer = ttc - retenue;

    state.totals = {
        brutHT,
        remise: totalRemise,
        netHT,
        tva,
        ttc,
        retenue,
        netAPayer
    };

    // Update display
    document.getElementById('totalBrutHT').textContent = `${formatMoney(brutHT)} XAF`;
    document.getElementById('totalRemise').textContent = `-${formatMoney(totalRemise)} XAF`;
    document.getElementById('totalNetHT').textContent = `${formatMoney(netHT)} XAF`;
    document.getElementById('baseTVA').textContent = `${formatMoney(netHT)} XAF`;
    document.getElementById('montantTVA').textContent = `${formatMoney(tva)} XAF`;
    document.getElementById('totalTTC').textContent = `${formatMoney(ttc)} XAF`;
    document.getElementById('retenueAmount').textContent = applyRetenue ? `-${formatMoney(retenue)} XAF` : '-';
    document.getElementById('netAPayer').textContent = `${formatMoney(netAPayer)} XAF`;

    // Update header
    document.getElementById('headerAmount').textContent = `${formatMoney(ttc)} XAF`;
}

// =====================================================
// PAYMENT TYPE
// =====================================================

function selectPaymentType(type) {
    state.paymentType = type;

    // Update radio options
    const options = document.querySelectorAll('[name="paymentType"]');
    options.forEach(radio => {
        const parent = radio.closest('.radio-option');
        parent.classList.toggle('selected', radio.value === type);
    });

    // Show/hide schedule section
    const scheduleSection = document.getElementById('scheduleSection');
    if (scheduleSection) {
        scheduleSection.style.display = type === 'echelonne' ? 'block' : 'none';
    }
}

// =====================================================
// RECAP
// =====================================================

function updateRecap() {
    const clientId = document.getElementById('sourceClient').value;
    const client = mockClients[clientId];
    const bls = mockBLs[clientId] || [];
    const selectedBL = bls.find(bl => state.selectedBLs.includes(bl.id));

    document.getElementById('recapNumber').textContent = state.invoiceNumber;
    document.getElementById('recapDate').textContent = state.invoiceDate;

    if (client) {
        document.getElementById('recapClient').textContent = `${client.nom} (${client.code})`;
        document.getElementById('recapNUI').textContent = client.nui;
    }

    if (selectedBL) {
        document.getElementById('recapBL').textContent = `${selectedBL.numero} du ${selectedBL.date}`;
        document.getElementById('recapBC').textContent = `${selectedBL.bcSource} du ${selectedBL.bcDate}`;
    }

    document.getElementById('recapArticles').textContent = `${state.articles.length} lignes facturées`;
    document.getElementById('recapHT').textContent = `${formatMoney(state.totals.netHT)} XAF`;
    document.getElementById('recapTVA').textContent = `${formatMoney(state.totals.tva)} XAF`;
    document.getElementById('recapTTC').textContent = `${formatMoney(state.totals.ttc)} XAF`;
    document.getElementById('recapRetenue').textContent = state.totals.retenue > 0 ? `-${formatMoney(state.totals.retenue)} XAF` : '-';
    document.getElementById('recapNet').textContent = `${formatMoney(state.totals.netAPayer)} XAF`;

    // Echeance
    const dueDate = document.getElementById('dueDate').value;
    if (dueDate && client) {
        const dueDateObj = new Date(dueDate);
        document.getElementById('recapEcheance').textContent =
            `${dueDateObj.toLocaleDateString('fr-FR')} (${client.paymentTerms} jours)`;
    }

    document.getElementById('recapMode').textContent = 'Virement ou Chèque';
}

// =====================================================
// FORM ACTIONS
// =====================================================

function validateInvoice() {
    // Validate all tabs
    for (let i = 0; i < 4; i++) {
        state.currentTab = i;
        if (!validateCurrentTab()) {
            switchTab(i);
            return;
        }
    }

    // Show confirmation
    if (confirm('Confirmer la validation de la facture ?')) {
        const sendEmail = document.getElementById('sendEmail').checked;
        const printCopy = document.getElementById('printCopy').checked;

        let message = 'Facture validée avec succès';
        if (sendEmail) message += '\nEmail envoyé au client';
        if (printCopy) message += '\nImpression en cours...';

        showNotification(message, 'success');

        setTimeout(() => {
            window.location.href = './factures-list.html';
        }, 2000);
    }
}

function saveDraft() {
    showNotification('Brouillon sauvegardé', 'success');
}

function cancelForm() {
    if (confirm('Voulez-vous vraiment annuler ? Les modifications seront perdues.')) {
        window.location.href = './factures-list.html';
    }
}

function openFullPreview() {
    showNotification('Aperçu plein écran...', 'info');
}

function editRecipients() {
    const email = prompt('Destinataires (séparés par ;)', document.getElementById('clientEmail').value);
    if (email) {
        document.getElementById('clientEmail').value = email;
    }
}

// =====================================================
// UTILITIES
// =====================================================

function formatMoney(amount) {
    return new Intl.NumberFormat('fr-FR').format(Math.round(amount));
}

function showNotification(message, type = 'info') {
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
        white-space: pre-line;
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

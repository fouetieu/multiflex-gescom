/**
 * MultiFlex GESCOM - Encaissement Create JavaScript
 * Gestion de la création de bons d'encaissement clients
 */

// ============================================================================
// STATE
// ============================================================================

let currentStep = 1;
let selectedClient = null;
let selectedPaymentMethod = null;
let allocations = [];

// Demo data
const demoClients = [
    {
        code: 'CLI-2024-00156',
        name: 'SONACOM SARL',
        nui: 'P087201234567W',
        contact: 'M. FOTSO Pierre',
        phone: '699 123 456',
        email: 'p.fotso@sonacom.cm',
        encours: 15450000,
        echu: 3200000,
        echuCount: 3,
        oldestDays: 45,
        oldestInvoice: 'FA-2024-00123'
    },
    {
        code: 'CLI-2024-00089',
        name: 'ETS NKOULOU',
        nui: 'P098765432101X',
        contact: 'M. NKOULOU Jean',
        phone: '677 890 123',
        email: 'contact@nkoulou.cm',
        encours: 850000,
        echu: 0,
        echuCount: 0,
        oldestDays: 0,
        oldestInvoice: null
    },
    {
        code: 'CLI-2024-00045',
        name: 'QUINCAILLERIE MODERNE',
        nui: 'P123456789012Y',
        contact: 'Mme EYONG',
        phone: '691 234 567',
        email: 'info@quincmod.cm',
        encours: 1200000,
        echu: 500000,
        echuCount: 1,
        oldestDays: 30,
        oldestInvoice: 'FA-2024-00098'
    }
];

const demoInvoices = [
    { id: 1, number: 'FA-2024-00123', date: '15/12/2023', dueDate: '14/01/2024', dueDays: 45, original: 2500000, paid: 0, remaining: 2500000, status: 'overdue' },
    { id: 2, number: 'FA-2024-00145', date: '20/12/2023', dueDate: '19/01/2024', dueDays: 40, original: 700000, paid: 0, remaining: 700000, status: 'overdue' },
    { id: 3, number: 'FA-2024-00189', date: '28/12/2023', dueDate: '27/01/2024', dueDays: 2, original: 1800000, paid: 500000, remaining: 1300000, status: 'partial' },
    { id: 4, number: 'FA-2024-00234', date: '10/01/2024', dueDate: '09/02/2024', dueDays: -10, original: 3200000, paid: 0, remaining: 3200000, status: 'pending' },
    { id: 5, number: 'FA-2024-00256', date: '15/01/2024', dueDate: '14/02/2024', dueDays: -15, original: 5000000, paid: 0, remaining: 5000000, status: 'pending', discountAvailable: true }
];

const demoJournals = {
    'BNK-001': { name: 'BICEC Principal', balance: 85234567 },
    'CSH-001': { name: 'Caisse Douala', balance: 3456789 },
    'CSH-002': { name: 'Caisse Yaoundé', balance: 1234567 },
    'MOB-001': { name: 'Orange Money', balance: 456789 }
};

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    initPage();
});

function initPage() {
    // Set today's date
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    document.getElementById('receiptDate').value = todayStr;
    document.getElementById('valueDate').value = tomorrowStr;
    document.getElementById('docDate').textContent = today.toLocaleDateString('fr-FR');

    // Generate document number
    const docNum = 'ENC-2024-' + String(Math.floor(Math.random() * 99999)).padStart(5, '0');
    document.getElementById('docNumber').textContent = docNum;

    // Close search results when clicking outside
    document.addEventListener('click', function(e) {
        const searchContainer = document.getElementById('clientSearch')?.parentElement;
        if (searchContainer && !searchContainer.contains(e.target)) {
            document.getElementById('clientSearchResults').classList.remove('active');
        }
    });

    // Radio button handlers for unallocated amount
    document.querySelectorAll('input[name="unallocatedAction"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.getElementById('orderSearchInput').disabled = this.value !== 'order';
        });
    });
}

// ============================================================================
// CLIENT SEARCH
// ============================================================================

function searchClients(query) {
    const resultsDiv = document.getElementById('clientSearchResults');

    if (!query || query.length < 2) {
        resultsDiv.classList.remove('active');
        return;
    }

    const filtered = demoClients.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.code.toLowerCase().includes(query.toLowerCase()) ||
        c.nui.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length === 0) {
        resultsDiv.innerHTML = '<div class="client-result-item text-muted">Aucun client trouvé</div>';
    } else {
        resultsDiv.innerHTML = filtered.map(client => `
            <div class="client-result-item" onclick="selectClient(${JSON.stringify(client).replace(/"/g, '&quot;')})">
                <div class="font-semibold">${client.name}</div>
                <div class="text-sm text-muted">
                    ${client.code} | NUI: ${client.nui}
                </div>
                <div class="text-sm ${client.echu > 0 ? 'text-danger' : 'text-success'}">
                    Encours: ${formatCurrency(client.encours)} ${client.echu > 0 ? '(dont ' + formatCurrency(client.echu) + ' échu)' : ''}
                </div>
            </div>
        `).join('');
    }

    resultsDiv.classList.add('active');
}

function showClientResults() {
    const query = document.getElementById('clientSearch').value;
    if (query && query.length >= 2) {
        document.getElementById('clientSearchResults').classList.add('active');
    }
}

function openClientSearch() {
    document.getElementById('clientSearch').focus();
    showClientResults();
}

function selectClient(client) {
    selectedClient = client;

    // Update UI
    document.getElementById('clientSearch').value = client.name;
    document.getElementById('clientSearchResults').classList.remove('active');

    // Show selected client info
    document.getElementById('selectedClientName').textContent = client.name;
    document.getElementById('selectedClientCode').textContent = client.code;
    document.getElementById('selectedClientNUI').textContent = client.nui;
    document.getElementById('selectedClientContact').textContent = client.contact;
    document.getElementById('selectedClientPhone').textContent = client.phone;
    document.getElementById('selectedClientEmail').textContent = client.email;

    // Situation
    document.getElementById('clientEncours').textContent = formatCurrency(client.encours);
    document.getElementById('clientEchu').textContent = client.echu > 0
        ? formatCurrency(client.echu) + ' (' + client.echuCount + ' factures)'
        : '0 XAF';
    document.getElementById('clientOldest').textContent = client.oldestDays > 0
        ? client.oldestDays + ' jours (' + client.oldestInvoice + ')'
        : '-';

    document.getElementById('selectedClientInfo').style.display = 'block';
}

// ============================================================================
// PAYMENT METHOD
// ============================================================================

function selectPaymentMethod(method, element) {
    document.querySelectorAll('.payment-method-btn').forEach(btn => btn.classList.remove('selected'));
    element.classList.add('selected');

    selectedPaymentMethod = method;

    // Show/hide conditional sections
    document.getElementById('wireDetailsSection').style.display = method === 'WIRE_TRANSFER' ? 'block' : 'none';
    document.getElementById('checkDetailsSection').style.display = method === 'CHECK' ? 'block' : 'none';

    // Validate cash limit for espèces
    if (method === 'CASH') {
        validateAmount();
    }
}

function updateJournalInfo() {
    const journalCode = document.getElementById('destinationJournal').value;
    const journalInfo = document.getElementById('journalInfo');

    if (journalCode && demoJournals[journalCode]) {
        document.getElementById('journalBalance').textContent = formatCurrency(demoJournals[journalCode].balance);
        journalInfo.style.display = 'block';
    } else {
        journalInfo.style.display = 'none';
    }
}

function validateAmount() {
    const amount = parseFloat(document.getElementById('receiptAmount').value) || 0;

    // Check cash limit for espèces
    if (selectedPaymentMethod === 'CASH' && amount > 100000) {
        showNotification('Attention: La limite pour les paiements en espèces est de 100 000 XAF (réglementation CEMAC)', 'warning');
    }
}

// ============================================================================
// STEP NAVIGATION
// ============================================================================

function goToStep(step) {
    if (step > currentStep && !validateStep(currentStep)) {
        return;
    }

    // Update stepper UI
    for (let i = 1; i <= 3; i++) {
        const stepEl = document.getElementById('step' + i);
        const contentEl = document.getElementById('stepContent' + i);

        stepEl.classList.remove('active', 'completed');
        contentEl.style.display = 'none';

        if (i < step) {
            stepEl.classList.add('completed');
        } else if (i === step) {
            stepEl.classList.add('active');
            contentEl.style.display = 'block';
        }
    }

    currentStep = step;

    if (step === 2) {
        loadInvoicesTable();
    } else if (step === 3) {
        updateValidationSummary();
    }
}

function validateStep(step) {
    if (step === 1) {
        if (!selectedClient) {
            showNotification('Veuillez sélectionner un client', 'error');
            return false;
        }

        if (!selectedPaymentMethod) {
            showNotification('Veuillez sélectionner un mode de paiement', 'error');
            return false;
        }

        const journal = document.getElementById('destinationJournal').value;
        if (!journal) {
            showNotification('Veuillez sélectionner un journal de destination', 'error');
            return false;
        }

        const amount = parseFloat(document.getElementById('receiptAmount').value) || 0;
        if (amount <= 0) {
            showNotification('Veuillez saisir un montant valide', 'error');
            return false;
        }

        return true;
    }

    return true;
}

// ============================================================================
// INVOICES TABLE (Step 2)
// ============================================================================

function loadInvoicesTable() {
    const tbody = document.getElementById('invoicesTableBody');
    const amount = parseFloat(document.getElementById('receiptAmount').value) || 0;

    document.getElementById('amountToAllocate').textContent = formatCurrency(amount);
    document.getElementById('totalReceived').textContent = formatCurrency(amount);

    tbody.innerHTML = demoInvoices.map(inv => {
        let statusLabel = '';
        let statusClass = '';

        if (inv.status === 'overdue') {
            statusLabel = `Échu ${inv.dueDays}j`;
            statusClass = 'text-danger';
        } else if (inv.status === 'partial') {
            statusLabel = 'Échu ' + inv.dueDays + 'j<br>Partiel';
            statusClass = 'text-warning';
        } else {
            statusLabel = 'Non échu';
            statusClass = 'text-success';
        }

        return `
            <tr data-invoice-id="${inv.id}">
                <td class="text-center">
                    <input type="checkbox" class="invoice-checkbox" data-id="${inv.id}"
                           onchange="toggleInvoiceAllocation(${inv.id}, this.checked)">
                </td>
                <td>
                    <span class="font-mono font-semibold">${inv.number}</span>
                    ${inv.discountAvailable ? '<br><span class="text-xs text-purple-600">2% si &lt;10j</span>' : ''}
                </td>
                <td>${inv.date}</td>
                <td class="${statusClass}">${statusLabel}</td>
                <td class="text-right">${formatCurrency(inv.original)}</td>
                <td class="text-right">${formatCurrency(inv.paid)}</td>
                <td class="text-right">${formatCurrency(inv.remaining)}</td>
                <td class="text-right">
                    <input type="number" class="form-input allocation-input" style="width: 100px; text-align: right;"
                           data-id="${inv.id}" value="0" onchange="updateAllocationAmount(${inv.id}, this.value)">
                </td>
            </tr>
        `;
    }).join('');

    // Apply auto FIFO if checked
    if (document.getElementById('autoFifo').checked) {
        applyAutoFifo();
    }

    // Generate lettrage code
    document.getElementById('lettrageCode').textContent = 'LTR-2024-' + String(Math.floor(Math.random() * 99999)).padStart(5, '0');
}

function toggleInvoiceAllocation(invoiceId, checked) {
    const invoice = demoInvoices.find(i => i.id === invoiceId);
    const input = document.querySelector(`.allocation-input[data-id="${invoiceId}"]`);

    if (checked && invoice) {
        input.value = invoice.remaining;
    } else {
        input.value = 0;
    }

    recalculateAllocations();
}

function updateAllocationAmount(invoiceId, value) {
    const checkbox = document.querySelector(`.invoice-checkbox[data-id="${invoiceId}"]`);
    checkbox.checked = parseFloat(value) > 0;
    recalculateAllocations();
}

function applyAutoFifo() {
    const amount = parseFloat(document.getElementById('receiptAmount').value) || 0;
    let remaining = amount;

    // Sort invoices by due date (oldest first)
    const sortedInvoices = [...demoInvoices].sort((a, b) => b.dueDays - a.dueDays);

    // Reset all allocations
    document.querySelectorAll('.allocation-input').forEach(input => {
        input.value = 0;
    });
    document.querySelectorAll('.invoice-checkbox').forEach(cb => {
        cb.checked = false;
    });

    // Allocate FIFO
    for (const invoice of sortedInvoices) {
        if (remaining <= 0) break;

        const toAllocate = Math.min(remaining, invoice.remaining);
        if (toAllocate > 0) {
            const input = document.querySelector(`.allocation-input[data-id="${invoice.id}"]`);
            const checkbox = document.querySelector(`.invoice-checkbox[data-id="${invoice.id}"]`);

            if (input) {
                input.value = toAllocate;
                checkbox.checked = true;
                remaining -= toAllocate;
            }
        }
    }

    recalculateAllocations();
}

function refreshInvoices() {
    loadInvoicesTable();
    showNotification('Liste des factures actualisée', 'info');
}

function recalculateAllocations() {
    let totalSelected = 0;
    let discount = 0;

    document.querySelectorAll('.allocation-input').forEach(input => {
        const value = parseFloat(input.value) || 0;
        totalSelected += value;
    });

    // Demo: Apply discount if FA-00256 is selected
    const fa256Input = document.querySelector('.allocation-input[data-id="5"]');
    if (fa256Input && parseFloat(fa256Input.value) > 0) {
        discount = Math.round(parseFloat(fa256Input.value) * 0.02);
    }

    const totalAllocated = totalSelected - discount;
    const totalReceived = parseFloat(document.getElementById('receiptAmount').value) || 0;
    const unallocated = totalReceived - totalAllocated;

    document.getElementById('totalSelected').textContent = formatCurrency(totalSelected);
    document.getElementById('totalDiscount').textContent = discount > 0 ? '-' + formatCurrency(discount) : '0 XAF';
    document.getElementById('totalAllocated').textContent = formatCurrency(totalAllocated);
    document.getElementById('unallocatedAmount').innerHTML = '<strong>' + formatCurrency(unallocated) + '</strong>';

    // Show/hide unallocated section
    document.getElementById('unallocatedSection').style.display = unallocated > 0 ? 'block' : 'none';
}

// ============================================================================
// VALIDATION SUMMARY (Step 3)
// ============================================================================

function updateValidationSummary() {
    const paymentMethodLabels = {
        'CASH': 'Espèces',
        'WIRE_TRANSFER': 'Virement bancaire',
        'CHECK': 'Chèque',
        'MOBILE_MONEY': 'Mobile Money'
    };

    document.getElementById('summaryDocNumber').textContent = document.getElementById('docNumber').textContent;
    document.getElementById('summaryDate').textContent = document.getElementById('docDate').textContent;
    document.getElementById('summaryClient').textContent = selectedClient?.name || '-';
    document.getElementById('summaryPaymentMethod').textContent = paymentMethodLabels[selectedPaymentMethod] || '-';

    const journalSelect = document.getElementById('destinationJournal');
    document.getElementById('summaryJournal').textContent = journalSelect.options[journalSelect.selectedIndex]?.text || '-';
    document.getElementById('summaryReference').textContent = document.getElementById('paymentReference').value || '-';

    const amount = parseFloat(document.getElementById('receiptAmount').value) || 0;
    document.getElementById('summaryAmount').textContent = formatCurrency(amount);
    document.getElementById('summaryAllocated').textContent = document.getElementById('totalAllocated').textContent;
    document.getElementById('summaryAdvance').textContent = document.getElementById('unallocatedAmount').textContent.replace(/<[^>]*>/g, '');

    // Build allocated invoices list
    let invoicesHtml = '';
    document.querySelectorAll('.allocation-input').forEach(input => {
        const value = parseFloat(input.value) || 0;
        if (value > 0) {
            const id = input.dataset.id;
            const invoice = demoInvoices.find(i => i.id == id);
            if (invoice) {
                invoicesHtml += `<div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #E5E7EB;">
                    <span class="font-mono">${invoice.number}</span>
                    <span class="font-semibold">${formatCurrency(value)}</span>
                </div>`;
            }
        }
    });

    document.getElementById('allocatedInvoicesList').innerHTML = invoicesHtml || '<div class="text-gray-500">Aucune facture imputée (paiement en avance)</div>';
}

// ============================================================================
// ACTIONS
// ============================================================================

function saveDraft() {
    showNotification('Brouillon enregistré', 'success');
}

function confirmEncaissement() {
    const encaissementData = {
        documentNumber: document.getElementById('docNumber').textContent,
        client: selectedClient,
        paymentMethod: selectedPaymentMethod,
        journal: document.getElementById('destinationJournal').value,
        amount: parseFloat(document.getElementById('receiptAmount').value),
        reference: document.getElementById('paymentReference').value,
        description: document.getElementById('paymentDescription').value,
        printReceipt: document.getElementById('printReceipt').checked,
        sendEmail: document.getElementById('sendEmailReceipt').checked,
        createdAt: new Date().toISOString()
    };

    console.log('Creating encaissement:', encaissementData);

    showNotification('Encaissement validé avec succès!', 'success');

    setTimeout(() => {
        if (encaissementData.printReceipt) {
            showNotification('Impression du reçu...', 'info');
        }
        window.location.href = './dashboard.html';
    }, 2000);
}

function cancelEncaissement() {
    if (confirm('Voulez-vous vraiment annuler? Les données saisies seront perdues.')) {
        window.location.href = './dashboard.html';
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatCurrency(amount) {
    if (amount === null || amount === undefined) return '-';
    return Math.abs(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' XAF';
}

function showNotification(message, type = 'info') {
    if (typeof window.showNotification === 'function' && window.showNotification !== showNotification) {
        window.showNotification(message, type);
        return;
    }

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

/**
 * MultiFlex GESCOM - Décaissement Create JavaScript
 * Gestion de la création d'ordres de décaissement fournisseurs
 * Conforme au wireframe ECR-TRES-007
 */

// ============================================================================
// STATE & CONSTANTS
// ============================================================================

let selectedSupplier = null;
let selectedInvoices = [];

const DOUBLE_SIGNATURE_THRESHOLD = 5000000; // 5 millions XAF
const WITHHOLDING_TAX_RATE = 0.011; // 1.1% retenue à la source

// Demo data - Suppliers
const demoSuppliers = [
    {
        id: 'SUP-001',
        code: 'SUP-2024-00045',
        name: 'SUPPLIER TECH SARL',
        nui: 'P098765432109W',
        contact: 'M. NJOYA Paul',
        phone: '677 890 123',
        email: 'contact@suppliertech.cm',
        encours: 8750000,
        echu: 2100000,
        aEchoir30: 3500000,
        anrValid: true,
        anrExpiry: '31/12/2024'
    },
    {
        id: 'SUP-002',
        code: 'SUP-2024-00089',
        name: 'AFRILAND MATERIALS',
        nui: 'P076543210987W',
        contact: 'Mme BIYA Marie',
        phone: '699 456 789',
        email: 'achats@afriland-mat.cm',
        encours: 12500000,
        echu: 4200000,
        aEchoir30: 5000000,
        anrValid: true,
        anrExpiry: '30/06/2025'
    },
    {
        id: 'SUP-003',
        code: 'SUP-2024-00123',
        name: 'TECHNIP CAMEROUN',
        nui: 'P054321098765W',
        contact: 'M. KAMGA Pierre',
        phone: '655 789 012',
        email: 'finance@technip-cm.com',
        encours: 5200000,
        echu: 800000,
        aEchoir30: 2100000,
        anrValid: false,
        anrExpiry: '15/12/2023'
    }
];

// Demo data - Invoices per supplier
const demoInvoices = {
    'SUP-001': [
        {
            code: 'FF-2024-00234',
            bcfRef: 'BCF-00456',
            date: '10/01/24',
            dueDate: '09/02/24',
            dueDays: 0,
            isOverdue: false,
            amount: 1500000,
            paid: 0,
            remaining: 1500000
        },
        {
            code: 'FF-2024-00267',
            bcfRef: 'BCF-00489',
            date: '15/01/24',
            dueDate: '14/02/24',
            dueDays: 0,
            isOverdue: false,
            amount: 600000,
            paid: 0,
            remaining: 600000
        },
        {
            code: 'FF-2024-00289',
            bcfRef: 'BCF-00512',
            date: '20/01/24',
            dueDate: '19/02/24',
            dueDays: 0,
            isOverdue: false,
            amount: 2400000,
            paid: 0,
            remaining: 2400000
        }
    ],
    'SUP-002': [
        {
            code: 'FF-2024-00156',
            bcfRef: 'BCF-00234',
            date: '05/01/24',
            dueDate: '04/02/24',
            dueDays: 25,
            isOverdue: true,
            amount: 3500000,
            paid: 1000000,
            remaining: 2500000
        },
        {
            code: 'FF-2024-00198',
            bcfRef: 'BCF-00298',
            date: '12/01/24',
            dueDate: '11/02/24',
            dueDays: 18,
            isOverdue: true,
            amount: 1700000,
            paid: 0,
            remaining: 1700000
        }
    ],
    'SUP-003': [
        {
            code: 'FF-2024-00312',
            bcfRef: 'BCF-00567',
            date: '22/01/24',
            dueDate: '21/02/24',
            dueDays: 0,
            isOverdue: false,
            amount: 800000,
            paid: 0,
            remaining: 800000
        }
    ]
};

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    initPage();
});

function initPage() {
    generateDocumentNumber();
    setCurrentDate();
    setupEventListeners();
}

function generateDocumentNumber() {
    const today = new Date();
    const year = today.getFullYear();
    const seq = String(Math.floor(Math.random() * 900) + 100).padStart(5, '0');
    document.getElementById('documentNumber').textContent = `DEC-${year}-${seq}`;
}

function setCurrentDate() {
    const today = new Date();
    const formatted = today.toLocaleDateString('fr-FR');
    document.getElementById('documentDate').textContent = formatted;

    // Set date inputs
    const isoDate = today.toISOString().split('T')[0];
    document.getElementById('paymentDate').value = isoDate;

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('executionDate').value = tomorrow.toISOString().split('T')[0];
}

function setupEventListeners() {
    // Close search results on outside click
    document.addEventListener('click', function(e) {
        const searchBox = document.querySelector('.supplier-search-box');
        if (searchBox && !searchBox.contains(e.target)) {
            document.getElementById('supplierSearchResults').classList.remove('active');
        }
    });

    // Form validation listeners
    document.getElementById('sourceJournal').addEventListener('change', validateForm);
    document.getElementById('paymentMethod').addEventListener('change', validateForm);
}

// ============================================================================
// SUPPLIER SEARCH & SELECTION
// ============================================================================

function searchSuppliers(query) {
    const resultsDiv = document.getElementById('supplierSearchResults');

    if (!query || query.length < 2) {
        resultsDiv.classList.remove('active');
        return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = demoSuppliers.filter(s =>
        s.name.toLowerCase().includes(lowerQuery) ||
        s.code.toLowerCase().includes(lowerQuery) ||
        s.nui.toLowerCase().includes(lowerQuery)
    );

    if (filtered.length === 0) {
        resultsDiv.innerHTML = '<div class="supplier-result-item text-gray-500">Aucun fournisseur trouvé</div>';
    } else {
        resultsDiv.innerHTML = filtered.map(supplier => `
            <div class="supplier-result-item" onclick='selectSupplier(${JSON.stringify(supplier)})'>
                <div class="font-semibold text-[#263c89]">${supplier.name}</div>
                <div class="text-sm text-gray-500">
                    ${supplier.code} | NUI: ${supplier.nui}
                </div>
                <div class="text-sm">
                    Encours: <span class="font-semibold">${formatCurrency(supplier.encours)}</span>
                    ${supplier.echu > 0 ? `<span class="text-red-500 ml-2">Échu: ${formatCurrency(supplier.echu)}</span>` : ''}
                </div>
            </div>
        `).join('');
    }

    resultsDiv.classList.add('active');
}

function showSupplierResults() {
    const query = document.getElementById('supplierSearch').value;
    if (query && query.length >= 2) {
        searchSuppliers(query);
    }
}

function selectSupplier(supplier) {
    selectedSupplier = supplier;
    selectedInvoices = [];

    // Hide search, show selected info
    document.getElementById('supplierSearch').style.display = 'none';
    document.getElementById('supplierSearchResults').classList.remove('active');
    document.getElementById('selectedSupplierSection').style.display = 'block';

    // Populate supplier info
    document.getElementById('supplierName').textContent = supplier.name;
    document.getElementById('supplierCode').textContent = supplier.code;
    document.getElementById('supplierNUI').textContent = supplier.nui;
    document.getElementById('supplierContact').textContent = supplier.contact;
    document.getElementById('supplierPhone').textContent = supplier.phone;
    document.getElementById('supplierEmail').textContent = supplier.email;

    // ANR badge
    const badge = document.getElementById('attestationBadge');
    if (supplier.anrValid) {
        badge.className = 'attestation-badge valid';
        badge.innerHTML = '<i class="fa-solid fa-check-circle"></i> ANR Valide';
    } else {
        badge.className = 'attestation-badge expired';
        badge.innerHTML = '<i class="fa-solid fa-times-circle"></i> ANR Expiré';
    }

    // Situation
    document.getElementById('supplierEncours').textContent = formatCurrency(supplier.encours);
    document.getElementById('supplierEchu').textContent = formatCurrency(supplier.echu);
    document.getElementById('supplierAEchoir').textContent = formatCurrency(supplier.aEchoir30);
    document.getElementById('supplierANR').textContent = supplier.anrValid
        ? `Valide ${supplier.anrExpiry}`
        : `Expiré ${supplier.anrExpiry}`;
    document.getElementById('supplierANR').className = supplier.anrValid
        ? 'situation-item-value success'
        : 'situation-item-value danger';

    // Load invoices
    loadSupplierInvoices(supplier.id);

    // Show sections
    document.getElementById('invoicesSection').style.display = 'block';
    document.getElementById('paymentSection').style.display = 'block';

    // Enable draft button
    document.getElementById('btnSaveDraft').disabled = false;
}

function clearSupplier() {
    selectedSupplier = null;
    selectedInvoices = [];

    document.getElementById('supplierSearch').style.display = 'block';
    document.getElementById('supplierSearch').value = '';
    document.getElementById('selectedSupplierSection').style.display = 'none';
    document.getElementById('invoicesSection').style.display = 'none';
    document.getElementById('paymentSection').style.display = 'none';

    document.getElementById('btnSaveDraft').disabled = true;
    document.getElementById('btnSubmit').disabled = true;
}

// ============================================================================
// INVOICES MANAGEMENT
// ============================================================================

function loadSupplierInvoices(supplierId) {
    const invoices = demoInvoices[supplierId] || [];
    const tbody = document.getElementById('invoicesTableBody');

    if (invoices.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-gray-500 py-8">
                    Aucune facture en attente de paiement
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = invoices.map(inv => `
        <tr data-invoice-id="${inv.code}">
            <td>
                <input type="checkbox" class="invoice-checkbox w-4 h-4 accent-[#263c89]"
                       onchange="toggleInvoiceSelection('${inv.code}')"
                       data-remaining="${inv.remaining}">
            </td>
            <td>
                <div class="invoice-code">${inv.code}</div>
                <div class="bcf-ref">${inv.bcfRef}</div>
            </td>
            <td>${inv.date}</td>
            <td>
                ${inv.dueDate}
                ${inv.isOverdue ? `<div class="status-echu">Échu ${inv.dueDays}j</div>` : '<div class="text-green-600 text-xs">Non échu</div>'}
            </td>
            <td class="text-right">${formatCurrency(inv.amount)}</td>
            <td class="text-right text-green-600">${formatCurrency(inv.paid)}</td>
            <td class="text-right text-red-500 font-semibold">${formatCurrency(inv.remaining)}</td>
            <td class="text-right">
                <input type="number" class="amount-input"
                       id="pay_${inv.code}"
                       value="0"
                       min="0"
                       max="${inv.remaining}"
                       oninput="updatePaymentAmount('${inv.code}', this.value)"
                       disabled>
            </td>
        </tr>
    `).join('');
}

function toggleSelectAllInvoices() {
    const selectAll = document.getElementById('selectAllInvoices').checked;
    const checkboxes = document.querySelectorAll('.invoice-checkbox');

    checkboxes.forEach(cb => {
        cb.checked = selectAll;
        const invoiceCode = cb.closest('tr').dataset.invoiceId;
        toggleInvoiceSelection(invoiceCode, selectAll);
    });
}

function toggleAutoSelect() {
    const autoSelect = document.getElementById('autoSelectAll').checked;
    if (autoSelect) {
        // Select all and set max amounts
        const checkboxes = document.querySelectorAll('.invoice-checkbox');
        checkboxes.forEach(cb => {
            cb.checked = true;
            const invoiceCode = cb.closest('tr').dataset.invoiceId;
            const remaining = parseFloat(cb.dataset.remaining);
            const input = document.getElementById(`pay_${invoiceCode}`);
            if (input) {
                input.disabled = false;
                input.value = remaining;
            }
        });
        selectedInvoices = Object.values(demoInvoices[selectedSupplier.id] || []);
    }
    calculateTotals();
}

function toggleInvoiceSelection(invoiceCode, forceState = null) {
    const checkbox = document.querySelector(`tr[data-invoice-id="${invoiceCode}"] .invoice-checkbox`);
    const input = document.getElementById(`pay_${invoiceCode}`);

    const isChecked = forceState !== null ? forceState : checkbox.checked;

    if (isChecked) {
        input.disabled = false;
        const remaining = parseFloat(checkbox.dataset.remaining);
        input.value = remaining;

        // Add to selected
        const invoices = demoInvoices[selectedSupplier.id] || [];
        const inv = invoices.find(i => i.code === invoiceCode);
        if (inv && !selectedInvoices.find(i => i.code === invoiceCode)) {
            selectedInvoices.push({...inv, toPay: remaining});
        }
    } else {
        input.disabled = true;
        input.value = 0;
        selectedInvoices = selectedInvoices.filter(i => i.code !== invoiceCode);
    }

    calculateTotals();
}

function updatePaymentAmount(invoiceCode, value) {
    const amount = parseFloat(value) || 0;
    const inv = selectedInvoices.find(i => i.code === invoiceCode);
    if (inv) {
        inv.toPay = Math.min(amount, inv.remaining);
    }
    calculateTotals();
}

function refreshInvoices() {
    if (selectedSupplier) {
        loadSupplierInvoices(selectedSupplier.id);
        selectedInvoices = [];
        calculateTotals();
        showNotification('Factures actualisées', 'info');
    }
}

// ============================================================================
// PAYMENT CALCULATIONS
// ============================================================================

function calculateTotals() {
    const totalInvoices = selectedInvoices.reduce((sum, inv) => sum + (inv.toPay || 0), 0);
    const discount = 0; // Could be calculated based on early payment
    const withholdingTax = Math.round(totalInvoices * WITHHOLDING_TAX_RATE);
    const netToPay = totalInvoices - discount - withholdingTax;

    document.getElementById('totalInvoices').textContent = formatCurrency(totalInvoices);
    document.getElementById('discountAmount').textContent = formatCurrency(discount);
    document.getElementById('withholdingTax').textContent = `-${formatCurrency(withholdingTax)}`;
    document.getElementById('netToPay').textContent = formatCurrency(netToPay);

    // Check double signature threshold
    const alertDiv = document.getElementById('doubleSignatureAlert');
    if (netToPay >= DOUBLE_SIGNATURE_THRESHOLD) {
        alertDiv.style.display = 'flex';
    } else {
        alertDiv.style.display = 'none';
    }

    validateForm();
}

function updateJournalBalance() {
    const select = document.getElementById('sourceJournal');
    const option = select.options[select.selectedIndex];
    const balance = option?.dataset?.balance;

    document.getElementById('journalBalance').textContent = balance
        ? formatCurrency(parseInt(balance))
        : '-';

    validateForm();
}

// ============================================================================
// FORM VALIDATION
// ============================================================================

function validateForm() {
    const hasSupplier = selectedSupplier !== null;
    const hasInvoices = selectedInvoices.length > 0;
    const hasJournal = document.getElementById('sourceJournal').value !== '';
    const hasPaymentMethod = document.getElementById('paymentMethod').value !== '';

    const totalToPay = selectedInvoices.reduce((sum, inv) => sum + (inv.toPay || 0), 0);
    const hasAmount = totalToPay > 0;

    const isValid = hasSupplier && hasInvoices && hasJournal && hasPaymentMethod && hasAmount;

    document.getElementById('btnSubmit').disabled = !isValid;

    return isValid;
}

// ============================================================================
// FORM ACTIONS
// ============================================================================

function cancelDecaissement() {
    if (selectedSupplier || selectedInvoices.length > 0) {
        if (!confirm('Voulez-vous vraiment annuler? Les données saisies seront perdues.')) {
            return;
        }
    }
    window.location.href = './journals-list.html';
}

function saveDraft() {
    const data = collectFormData();
    data.status = 'DRAFT';

    console.log('Saving draft:', data);

    showNotification('Brouillon enregistré avec succès', 'success');
}

function submitForValidation() {
    if (!validateForm()) {
        showNotification('Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }

    const data = collectFormData();
    const netToPay = selectedInvoices.reduce((sum, inv) => sum + (inv.toPay || 0), 0) * (1 - WITHHOLDING_TAX_RATE);

    data.status = netToPay >= DOUBLE_SIGNATURE_THRESHOLD ? 'PENDING_APPROVAL' : 'APPROVED';

    console.log('Submitting for validation:', data);

    if (data.status === 'PENDING_APPROVAL') {
        showNotification('Ordre de décaissement soumis pour validation double signature', 'info');
        setTimeout(() => {
            window.location.href = './validation-double-signature.html';
        }, 1500);
    } else {
        showNotification('Ordre de décaissement créé avec succès!', 'success');
        setTimeout(() => {
            window.location.href = './journals-list.html';
        }, 1500);
    }
}

function collectFormData() {
    const totalInvoices = selectedInvoices.reduce((sum, inv) => sum + (inv.toPay || 0), 0);
    const withholdingTax = Math.round(totalInvoices * WITHHOLDING_TAX_RATE);

    return {
        documentNumber: document.getElementById('documentNumber').textContent,
        supplier: selectedSupplier,
        invoices: selectedInvoices.map(inv => ({
            code: inv.code,
            bcfRef: inv.bcfRef,
            amount: inv.toPay
        })),
        totalAmount: totalInvoices,
        withholdingTax: withholdingTax,
        netAmount: totalInvoices - withholdingTax,
        sourceJournal: document.getElementById('sourceJournal').value,
        paymentMethod: document.getElementById('paymentMethod').value,
        paymentDate: document.getElementById('paymentDate').value,
        executionDate: document.getElementById('executionDate').value,
        createdAt: new Date().toISOString()
    };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatCurrency(amount) {
    if (amount === null || amount === undefined) return '-';
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

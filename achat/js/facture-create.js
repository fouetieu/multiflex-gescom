// ================================================
// FACTURE-CREATE.JS
// Création facture fournisseur - Version 5 onglets
// ================================================

let currentTab = 0;
const TOTAL_TABS = 5;
let currentMode = 'with_order';
let supplierType = 'external';
let linkingMode = 'with_order';
let importOption = 'all';
let articleLines = [];
const TVA_RATE = 0.1925; // 19.25%

// ================================================
// INITIALISATION
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation création facture...');
    
    // Set today's date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('invoice-date').value = today;
    document.getElementById('reception-date').value = today;
    
    // Calculate due date (30 days by default)
    calculateDueDate();
    
    // Initialize with sample data
    initializeSampleData();
    
    // Calculate totals
    calculateTotals();
});

// ================================================
// TAB NAVIGATION
// ================================================

function switchTab(tabIndex) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`tab-${tabIndex}`).classList.add('active');
    document.querySelectorAll('.tab-button')[tabIndex].classList.add('active');
    
    currentTab = tabIndex;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ================================================
// ONGLET 1: MODE SAISIE
// ================================================

function setSupplierType(type) {
    supplierType = type;
    
    // Update radio pills
    document.querySelectorAll('[onclick^="setSupplierType"]').forEach(pill => {
        pill.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    // Show/hide group section
    const groupSection = document.getElementById('group-section');
    if (groupSection) {
        groupSection.style.display = type === 'group' ? 'block' : 'none';
    }
}

function selectSupplier() {
    // Update supplier info display
    console.log('Supplier selected');
}

function calculateDueDate() {
    const invoiceDate = document.getElementById('invoice-date')?.value;
    const paymentTerms = document.getElementById('payment-terms')?.value;
    
    if (invoiceDate && paymentTerms) {
        const date = new Date(invoiceDate);
        
        // Add days based on payment terms
        switch(paymentTerms) {
            case 'NET_30':
                date.setDate(date.getDate() + 30);
                break;
            case 'NET_60':
                date.setDate(date.getDate() + 60);
                break;
            case 'NET_90':
                date.setDate(date.getDate() + 90);
                break;
            default:
                date.setDate(date.getDate() + 30);
        }
        
        document.getElementById('due-date').value = date.toISOString().split('T')[0];
        updateDueDateDisplay();
    }
}

function updateDueDateDisplay() {
    const dueDate = document.getElementById('due-date')?.value;
    if (dueDate) {
        const formatted = formatDate(dueDate);
        const display = document.getElementById('due-date-display');
        if (display) display.textContent = formatted;
        
        // Calculate escompte date (10 days)
        const escDate = new Date(dueDate);
        escDate.setDate(escDate.getDate() - 20); // 10 days before due date
        const escDisplay = document.getElementById('escompte-date-display');
        if (escDisplay) escDisplay.textContent = formatDate(escDate.toISOString().split('T')[0]);
    }
}

function saveAndNext() {
    saveDraft();
    switchTab(1);
}

// ================================================
// ONGLET 2: DOCUMENTS
// ================================================

function setLinkingMode(mode) {
    linkingMode = mode;
    
    // Update radio pills
    document.querySelectorAll('[onclick^="setLinkingMode"]').forEach(pill => {
        pill.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    // Show/hide sections
    const bcfSection = document.getElementById('bcf-selection-section');
    const brSection = document.getElementById('br-selection-section');
    
    if (bcfSection && brSection) {
        if (mode === 'with_order') {
            bcfSection.style.display = 'block';
            brSection.style.display = 'block';
        } else {
            bcfSection.style.display = 'none';
            brSection.style.display = 'none';
        }
    }
}

function addBCFToList() {
    alert('Ajout du BCF à la liste');
}

function toggleBR(checkbox) {
    const parent = checkbox.closest('.br-checkbox');
    if (checkbox.checked) {
        parent.classList.add('selected');
    } else {
        parent.classList.remove('selected');
    }
}

function setImportOption(option) {
    importOption = option;
    
    // Update radio pills
    document.querySelectorAll('[onclick^="setImportOption"]').forEach(pill => {
        pill.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
}

function loadLinesFromBCFBR() {
    alert('Chargement des lignes depuis BCF/BR...');
    // This would populate articleLines from selected BCF/BR
    switchTab(2);
}

// ================================================
// ONGLET 3: ARTICLES
// ================================================

function initializeSampleData() {
    articleLines = [
        {
            id: 1,
            article: 'MP-PAINT-01',
            description: 'Peinture blanche acrylique mate',
            qtyBCF: 1000,
            qtyBR: 980,
            qtyInv: 1000,
            unitPriceBCF: 1450,
            unitPriceInv: 1450,
            total: 1450000
        },
        {
            id: 2,
            article: 'MP-SOLV-03',
            description: 'Solvant industriel',
            qtyBCF: 200,
            qtyBR: 200,
            qtyInv: 200,
            unitPriceBCF: 850,
            unitPriceInv: 850,
            total: 170000
        }
    ];
    
    renderArticlesTable();
}

function renderArticlesTable() {
    const tbody = document.getElementById('articles-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = articleLines.map((line, index) => {
        const ecart = line.qtyInv - line.qtyBR;
        const ecartPercent = line.qtyBR > 0 ? ((ecart / line.qtyBR) * 100).toFixed(1) : 0;
        const ecartClass = Math.abs(ecartPercent) > 2 ? 'text-red-600' : Math.abs(ecartPercent) > 0 ? 'text-yellow-600' : 'text-green-600';
        const ecartIcon = Math.abs(ecartPercent) > 2 ? '⚠️' : Math.abs(ecartPercent) > 0 ? '⚠️' : '✅';
        
        return `
        <tr>
            <td style="text-align: center; font-weight: 600; color: #6B7280;">${line.id}</td>
            <td>
                <input type="text" class="article-input" value="${line.article}" 
                       onchange="updateArticle(${index}, 'article', this.value)">
            </td>
            <td>
                <div style="margin-bottom: 8px;">
                    <input type="text" class="article-input" value="${line.description}" 
                           onchange="updateArticle(${index}, 'description', this.value)">
                </div>
                <div class="${ecartClass}" style="font-size: 11px; font-weight: 600;">
                    ${ecartIcon} ${Math.abs(ecartPercent) > 2 ? 'Écart' : Math.abs(ecartPercent) > 0 ? 'Écart' : 'Conforme'}: 
                    ${Math.abs(ecartPercent) > 0 ? `Qté facturée (${line.qtyInv}) ${ecart > 0 ? '>' : '<'} Qté reçue (${line.qtyBR})` : 'Quantités et prix correspondent'}
                </div>
                <div style="font-size: 11px; color: #6B7280; margin-top: 4px;">
                    Référence BCF: BCF-2024-0089 - Ligne ${line.id}
                </div>
                <div style="font-size: 11px; color: #6B7280;">
                    Référence BR: BR-2024-0156 - Ligne ${line.id}
                </div>
                <div style="font-size: 11px; color: #6B7280;">
                    Total ligne HT: ${formatCurrency(line.total)}
                </div>
            </td>
            <td style="text-align: center; font-size: 13px; color: #6B7280;">${line.qtyBCF} L</td>
            <td style="text-align: center; font-size: 13px; color: #6B7280;">${line.qtyBR} L</td>
            <td style="text-align: center;">
                <input type="number" class="article-input" value="${line.qtyInv}" 
                       onchange="updateArticle(${index}, 'qtyInv', this.value)" style="text-align: center; width: 80px;">
            </td>
            <td style="text-align: right; font-size: 13px; color: #6B7280;">${formatCurrency(line.unitPriceBCF)}</td>
            <td style="text-align: right;">
                <input type="number" class="article-input" value="${line.unitPriceInv}" 
                       onchange="updateArticle(${index}, 'unitPriceInv', this.value)" style="text-align: right; width: 100px;">
            </td>
            <td style="text-align: center;">
                <button type="button" class="btn-remove-line" onclick="removeLine(${index})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
    `;
    }).join('');
    
    // Check for ecarts
    checkEcarts();
}

function checkEcarts() {
    const hasEcart = articleLines.some(line => {
        const ecartPercent = line.qtyBR > 0 ? Math.abs(((line.qtyInv - line.qtyBR) / line.qtyBR) * 100) : 0;
        return ecartPercent > 2;
    });
    
    const warningDiv = document.getElementById('ecart-status-warning');
    const okDiv = document.getElementById('ecart-status-ok');
    const ecartActions = document.getElementById('ecart-actions');
    
    if (warningDiv) warningDiv.style.display = hasEcart ? 'block' : 'none';
    if (okDiv) okDiv.style.display = hasEcart ? 'none' : 'block';
    if (ecartActions) ecartActions.style.display = hasEcart ? 'block' : 'none';
}

function addArticleLine() {
    const newLine = {
        id: articleLines.length + 1,
        article: '',
        description: '',
        qtyBCF: 0,
        qtyBR: 0,
        qtyInv: 0,
        unitPriceBCF: 0,
        unitPriceInv: 0,
        total: 0
    };
    
    articleLines.push(newLine);
    renderArticlesTable();
}

function updateArticle(index, field, value) {
    articleLines[index][field] = field.includes('qty') || field.includes('Price') ? (parseFloat(value) || 0) : value;
    
    // Recalculate line
    const line = articleLines[index];
    line.total = line.qtyInv * line.unitPriceInv;
    
    renderArticlesTable();
    calculateTotals();
}

function removeLine(index) {
    articleLines.splice(index, 1);
    // Renumber lines
    articleLines.forEach((line, i) => {
        line.id = i + 1;
    });
    renderArticlesTable();
    calculateTotals();
}

function toggleFees() {
    const checkbox = document.getElementById('enable-fees');
    const feesSection = document.getElementById('fees-section');
    if (feesSection) {
        feesSection.style.display = checkbox.checked ? 'block' : 'none';
    }
}

// ================================================
// ONGLET 4: CALCULS
// ================================================

function calculateTotals() {
    // Total HT articles
    const totalArticlesHT = articleLines.reduce((sum, line) => sum + line.total, 0);
    
    // Total fees
    let totalFeesHT = 0;
    if (document.getElementById('enable-fees')?.checked) {
        totalFeesHT += parseFloat(document.getElementById('fee-transport')?.value || 0);
        totalFeesHT += parseFloat(document.getElementById('fee-insurance')?.value || 0);
        totalFeesHT += parseFloat(document.getElementById('fee-customs')?.value || 0);
        totalFeesHT += parseFloat(document.getElementById('fee-other')?.value || 0);
    }
    
    const totalHT = totalArticlesHT + totalFeesHT;
    
    // TVA
    const tvaDeductible = document.getElementById('tva-deductible-1925')?.checked;
    const totalTVA = totalHT * TVA_RATE;
    const tvaDeductibleAmount = tvaDeductible ? totalTVA : 0;
    const tvaNonDeductible = tvaDeductible ? 0 : totalTVA;
    
    // Total TTC
    const totalTTC = totalHT + totalTVA;
    
    // Escompte
    const escompteAmount = totalTTC * 0.02; // 2%
    const netWithEscompte = totalTTC - escompteAmount;
    
    // Update UI - Tab 3
    updateElement('total-bcf', formatCurrency(totalHT));
    updateElement('total-br', formatCurrency(totalHT * 0.98)); // Example: 98%
    updateElement('total-invoiced', formatCurrency(totalHT));
    
    // Update UI - Tab 4
    updateElement('base-ht-1925', formatCurrency(totalHT));
    updateElement('tva-1925', formatCurrency(totalTVA));
    updateElement('ttc-1925', formatCurrency(totalTTC));
    
    updateElement('total-articles-ht', formatCurrency(totalArticlesHT));
    updateElement('total-fees-ht', formatCurrency(totalFeesHT));
    updateElement('total-ht', formatCurrency(totalHT));
    updateElement('tva-deductible-amount', formatCurrency(tvaDeductibleAmount));
    updateElement('tva-non-deductible', formatCurrency(tvaNonDeductible));
    updateElement('total-tva', formatCurrency(totalTVA));
    updateElement('total-ttc', formatCurrency(totalTTC));
    updateElement('escompte-amount', formatCurrency(-escompteAmount));
    updateElement('net-with-escompte', formatCurrency(netWithEscompte));
    
    // Update amount in words
    updateElement('amount-in-words', convertToWords(totalTTC));
}

function updateElement(id, value) {
    const el = document.getElementById(id);
    if (el) {
        if (el.tagName === 'INPUT') {
            el.value = value;
        } else {
            el.textContent = value;
        }
    }
}

// ================================================
// ONGLET 5: FILE UPLOAD
// ================================================

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const display = document.getElementById('invoice-file-display');
        if (display) {
            display.style.display = 'block';
        }
    }
}

function handleOtherFiles(event) {
    console.log('Other files uploaded:', event.target.files);
}

// ================================================
// FORM ACTIONS
// ================================================

function saveDraft() {
    console.log('💾 Enregistrement brouillon facture');
    
    const formData = collectFormData();
    console.log('Form Data:', formData);
    
    alert('✅ Facture enregistrée en brouillon');
}

function validateInvoice() {
    if (!validateForm()) {
        return;
    }
    
    console.log('✅ Validation facture');
    
    const formData = collectFormData();
    console.log('Form Data:', formData);
    
    if (confirm('Valider et soumettre la facture ?')) {
        alert('✅ Facture validée avec succès !');
        window.location.href = './factures-list.html';
    }
}

function cancelInvoice() {
    if (confirm('Annuler la création de la facture ?')) {
        window.location.href = './factures-list.html';
    }
}

function validateForm() {
    // Check required fields
    const requiredFields = [
        { id: 'supplier-invoice-number', name: 'N° Facture fournisseur', tab: 0 },
        { id: 'invoice-date', name: 'Date facture', tab: 0 },
        { id: 'supplier-select', name: 'Fournisseur', tab: 0 },
        { id: 'company-select', name: 'Société', tab: 0 },
        { id: 'payment-terms', name: 'Conditions paiement', tab: 0 },
        { id: 'payment-mode', name: 'Mode règlement', tab: 0 }
    ];
    
    for (const field of requiredFields) {
        const value = document.getElementById(field.id)?.value;
        if (!value || value.trim() === '') {
            alert(`⚠️ ${field.name} est obligatoire`);
            switchTab(field.tab);
            return false;
        }
    }
    
    // Check articles
    if (articleLines.length === 0) {
        alert('⚠️ Veuillez ajouter au moins un article');
        switchTab(2);
        return false;
    }
    
    return true;
}

function collectFormData() {
    return {
        // Tab 1
        supplierInvoiceNumber: document.getElementById('supplier-invoice-number')?.value,
        invoiceDate: document.getElementById('invoice-date')?.value,
        receptionDate: document.getElementById('reception-date')?.value,
        dueDate: document.getElementById('due-date')?.value,
        currency: document.getElementById('currency')?.value,
        exchangeRate: document.getElementById('exchange-rate')?.value,
        supplier: document.getElementById('supplier-select')?.value,
        company: document.getElementById('company-select')?.value,
        service: document.getElementById('service-select')?.value,
        deliverySite: document.getElementById('delivery-site')?.value,
        paymentTerms: document.getElementById('payment-terms')?.value,
        paymentMode: document.getElementById('payment-mode')?.value,
        escompte: document.getElementById('escompte-checkbox')?.checked,
        
        // Tab 2
        linkingMode: linkingMode,
        
        // Tab 3
        articles: articleLines,
        enableFees: document.getElementById('enable-fees')?.checked,
        
        // Tab 4
        budgetLine: document.getElementById('budget-line')?.value,
        costCenter: document.getElementById('cost-center')?.value,
        project: document.getElementById('project')?.value,
        
        // Tab 5
        internalNotes: document.getElementById('internal-notes')?.value
    };
}

// ================================================
// HELPERS
// ================================================

function formatCurrency(amount) {
    if (!amount) return '0 XAF';
    return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount) + ' XAF';
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function convertToWords(amount) {
    // Simplified - in production use a proper library
    if (amount === 0) return 'Zéro francs CFA';
    return `${amount.toLocaleString('fr-FR')} francs CFA (conversion détaillée à implémenter)`;
}

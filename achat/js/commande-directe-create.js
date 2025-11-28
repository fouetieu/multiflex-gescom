// ================================================
// COMMANDE-DIRECTE-CREATE.JS
// Création directe de BCF sans DA
// ================================================

let currentTab = 0;
let selectedSupplier = null;
let articleLines = [];
let articlesCount = 0;

const TVA_RATE = 0.1925; // 19.25%

// Mock data
const mockSuppliers = [
    {
        id: 'SUP-001',
        code: 'CHEM-001',
        name: 'ChemTech SARL',
        type: 'EXTERNAL',
        niu: 'M012345678901234',
        certificate: 'Certifié',
        address: 'Zone Industrielle, Douala',
        phone: '+237 233 123 456',
        email: 'contact@chemtech.cm',
        paymentTerms: 'Net 30 jours',
        deliveryTime: '7 jours'
    },
    {
        id: 'SUP-002',
        code: 'IOLA-DIST',
        name: 'IOLA DISTRIBUTION',
        type: 'INTERNAL',
        niu: 'M987654321098765',
        certificate: 'Certifié',
        address: 'Siège Social, Yaoundé',
        phone: '+237 222 456 789',
        email: 'distribution@iola.cm',
        paymentTerms: 'Immédiat',
        deliveryTime: '2 jours'
    }
];

const mockCatalogArticles = [
    {
        id: 'ART-001',
        code: 'CHEM-001',
        name: 'Produit chimique A',
        description: 'Agent de traitement haute performance',
        unit: 'L',
        unitPrice: 25000,
        stockQty: 150
    },
    {
        id: 'ART-002',
        code: 'CHEM-002',
        name: 'Produit chimique B',
        description: 'Additif spécial pour production',
        unit: 'KG',
        unitPrice: 35000,
        stockQty: 200
    },
    {
        id: 'ART-003',
        code: 'MAT-001',
        name: 'Matière première C',
        description: 'Base de formulation',
        unit: 'KG',
        unitPrice: 15000,
        stockQty: 500
    }
];

// ================================================
// INITIALISATION
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation BCF Direct...');
    
    // Set today's date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('order-date').value = today;
    
    // Render suppliers list
    renderSuppliersList();
    
    // Initialize event listeners
    initializeEventListeners();
});

function initializeEventListeners() {
    // File upload
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
    }
    
    // Payment mode checkbox
    const earlyPaymentCheckbox = document.getElementById('early-payment-checkbox');
    if (earlyPaymentCheckbox) {
        earlyPaymentCheckbox.addEventListener('change', calculateTotals);
    }
    
    // Fees inputs
    ['fee-transport', 'fee-insurance', 'fee-customs', 'fee-handling', 'fee-other'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', calculateTotals);
        }
    });
}

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
}

// ================================================
// FOURNISSEURS
// ================================================

function renderSuppliersList() {
    const list = document.getElementById('suppliers-list');
    if (!list) return;
    
    list.innerHTML = mockSuppliers.map(supplier => `
        <div class="supplier-card ${selectedSupplier?.id === supplier.id ? 'selected' : ''}" 
             onclick="selectSupplier('${supplier.id}')">
            <div class="supplier-header">
                <h4>${supplier.name}</h4>
                <span class="status-pill ${supplier.type === 'INTERNAL' ? 'pill-warning' : 'pill-success'}">
                    ${supplier.type === 'INTERNAL' ? 'Interne' : 'Externe'}
                </span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; font-size: 12px; color: #6B7280; margin-top: 8px;">
                <div><strong>Code:</strong> ${supplier.code}</div>
                <div><strong>NIU:</strong> ${supplier.niu}</div>
                <div><strong>Délai:</strong> ${supplier.deliveryTime}</div>
                <div><strong>Paiement:</strong> ${supplier.paymentTerms}</div>
            </div>
            <div style="margin-top: 8px; font-size: 12px; color: #6B7280;">
                <i class="fa-solid fa-location-dot" style="color: #EF4444;"></i> ${supplier.address}
            </div>
        </div>
    `).join('');
}

function selectSupplier(supplierId) {
    selectedSupplier = mockSuppliers.find(s => s.id === supplierId);
    renderSuppliersList();
    
    // Update delivery leadtime
    if (selectedSupplier && document.getElementById('delivery-leadtime')) {
        document.getElementById('delivery-leadtime').value = selectedSupplier.deliveryTime;
    }
}

function searchSuppliers() {
    const search = document.getElementById('supplier-search').value.toLowerCase();
    const filtered = mockSuppliers.filter(s => 
        s.name.toLowerCase().includes(search) || 
        s.code.toLowerCase().includes(search)
    );
    
    const list = document.getElementById('suppliers-list');
    if (!list) return;
    
    list.innerHTML = filtered.map(supplier => `
        <div class="supplier-card ${selectedSupplier?.id === supplier.id ? 'selected' : ''}" 
             onclick="selectSupplier('${supplier.id}')">
            <div class="supplier-header">
                <h4>${supplier.name}</h4>
                <span class="status-pill ${supplier.type === 'INTERNAL' ? 'pill-warning' : 'pill-success'}">
                    ${supplier.type === 'INTERNAL' ? 'Interne' : 'Externe'}
                </span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; font-size: 12px; color: #6B7280; margin-top: 8px;">
                <div><strong>Code:</strong> ${supplier.code}</div>
                <div><strong>NIU:</strong> ${supplier.niu}</div>
                <div><strong>Délai:</strong> ${supplier.deliveryTime}</div>
                <div><strong>Paiement:</strong> ${supplier.paymentTerms}</div>
            </div>
            <div style="margin-top: 8px; font-size: 12px; color: #6B7280;">
                <i class="fa-solid fa-location-dot" style="color: #EF4444;"></i> ${supplier.address}
            </div>
        </div>
    `).join('');
}

// ================================================
// ÉMETTEUR DU BESOIN
// ================================================

function setOriginator(type) {
    // Update radio pills
    document.querySelectorAll('[onclick^="setOriginator"]').forEach(pill => {
        pill.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    // Show/hide other originator section
    const otherSection = document.getElementById('other-originator-section');
    if (otherSection) {
        otherSection.style.display = type === 'other' ? 'block' : 'none';
    }
}

// ================================================
// ARTICLES
// ================================================

function handleAddArticleLine() {
    const article = mockCatalogArticles[articlesCount % mockCatalogArticles.length];
    
    articlesCount++;
    
    const newLine = {
        id: `line-${articlesCount}`,
        articleId: article.id,
        articleCode: article.code,
        articleName: article.name,
        description: article.description,
        quantity: 1,
        unit: article.unit,
        unitPrice: article.unitPrice,
        discount: 0,
        subtotal: article.unitPrice
    };
    
    articleLines.push(newLine);
    renderArticlesTable();
    updateArticlesCount();
    calculateTotals();
}

function renderArticlesTable() {
    const tbody = document.getElementById('articles-body');
    if (!tbody) return;
    
    tbody.innerHTML = articleLines.map((line, index) => `
        <tr>
            <td style="text-align: center; font-weight: 600; color: #6B7280;">${index + 1}</td>
            <td>
                <select class="article-select" onchange="changeArticle(${index}, this.value)" style="font-weight: 600;">
                    ${mockCatalogArticles.map(art => `
                        <option value="${art.id}" ${art.id === line.articleId ? 'selected' : ''}>
                            ${art.code}
                        </option>
                    `).join('')}
                </select>
            </td>
            <td style="font-size: 12px; color: #6B7280;">${line.description}</td>
            <td>
                <input type="number" class="article-input" value="${line.quantity}" min="1" 
                       onchange="updateQuantity(${index}, this.value)">
            </td>
            <td style="text-align: center;">${line.unit}</td>
            <td style="text-align: right; font-weight: 600;">${formatCurrency(line.unitPrice)}</td>
            <td>
                <input type="number" class="article-input" value="${line.discount}" min="0" max="100" 
                       onchange="updateDiscount(${index}, this.value)" style="text-align: center;">
            </td>
            <td style="text-align: right; font-weight: 700; color: #263c89;">${formatCurrency(line.subtotal)}</td>
            <td style="text-align: center;">
                <button type="button" class="btn-remove-line" onclick="removeLine(${index})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function changeArticle(index, articleId) {
    const article = mockCatalogArticles.find(a => a.id === articleId);
    if (!article) return;
    
    articleLines[index].articleId = article.id;
    articleLines[index].articleCode = article.code;
    articleLines[index].articleName = article.name;
    articleLines[index].description = article.description;
    articleLines[index].unit = article.unit;
    articleLines[index].unitPrice = article.unitPrice;
    
    updateLineSubtotal(index);
    renderArticlesTable();
    calculateTotals();
}

function updateQuantity(index, qty) {
    articleLines[index].quantity = parseFloat(qty) || 1;
    updateLineSubtotal(index);
    renderArticlesTable();
    calculateTotals();
}

function updateDiscount(index, discount) {
    articleLines[index].discount = parseFloat(discount) || 0;
    updateLineSubtotal(index);
    renderArticlesTable();
    calculateTotals();
}

function updateLineSubtotal(index) {
    const line = articleLines[index];
    const baseAmount = line.quantity * line.unitPrice;
    const discountAmount = baseAmount * (line.discount / 100);
    line.subtotal = baseAmount - discountAmount;
}

function removeLine(index) {
    articleLines.splice(index, 1);
    renderArticlesTable();
    updateArticlesCount();
    calculateTotals();
}

function updateArticlesCount() {
    const countEl = document.getElementById('articles-count');
    if (countEl) {
        countEl.textContent = `${articleLines.length} ligne${articleLines.length > 1 ? 's' : ''}`;
    }
}

// ================================================
// CALCULS
// ================================================

function calculateTotals() {
    // Articles totals
    const totalArticlesHT = articleLines.reduce((sum, line) => sum + line.subtotal, 0);
    const totalDiscount = articleLines.reduce((sum, line) => {
        const baseAmount = line.quantity * line.unitPrice;
        return sum + (baseAmount * line.discount / 100);
    }, 0);
    
    // Fees
    const transport = parseFloat(document.getElementById('fee-transport')?.value || 0);
    const insurance = parseFloat(document.getElementById('fee-insurance')?.value || 0);
    const customs = parseFloat(document.getElementById('fee-customs')?.value || 0);
    const handling = parseFloat(document.getElementById('fee-handling')?.value || 0);
    const other = parseFloat(document.getElementById('fee-other')?.value || 0);
    const totalFees = transport + insurance + customs + handling + other;
    
    // Total HT
    const totalHT = totalArticlesHT + totalFees;
    
    // TVA
    const totalTVA = totalHT * TVA_RATE;
    
    // Total TTC
    let totalTTC = totalHT + totalTVA;
    
    // Early payment discount
    const earlyPaymentCheckbox = document.getElementById('early-payment-checkbox');
    let earlyPaymentDiscount = 0;
    if (earlyPaymentCheckbox?.checked) {
        earlyPaymentDiscount = totalTTC * 0.02;
        totalTTC = totalTTC - earlyPaymentDiscount;
    }
    
    // Update UI - Tab 2 (Articles)
    updateElement('total-articles-ht', formatCurrency(totalArticlesHT));
    updateElement('total-vat', formatCurrency(totalArticlesHT * TVA_RATE));
    updateElement('total-ttc', formatCurrency(totalArticlesHT + (totalArticlesHT * TVA_RATE)));
    updateElement('total-discount', formatCurrency(totalDiscount));
    
    // Update UI - Tab 5 (Frais & TVA)
    updateElement('base-articles', formatCurrency(totalArticlesHT));
    updateElement('base-fees', formatCurrency(totalFees));
    updateElement('total-ht-final', formatCurrency(totalHT));
    updateElement('total-tva-final', formatCurrency(totalTVA));
    updateElement('total-ttc-final', formatCurrency(totalTTC));
    
    // Early payment value
    updateElement('early-payment-value', formatCurrency(earlyPaymentDiscount));
    
    // Workflow amount
    updateElement('workflow-amount', formatCurrency(totalTTC));
    
    // Amount in words
    updateElement('amount-in-words', numberToWords(totalTTC));
}

function updateElement(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

// ================================================
// FILE UPLOAD
// ================================================

function handleFileUpload(event) {
    const files = event.target.files;
    const container = document.getElementById('uploaded-files');
    if (!container) return;
    
    container.innerHTML = '';
    
    Array.from(files).forEach((file, index) => {
        const fileDiv = document.createElement('div');
        fileDiv.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 10px; background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 6px; margin-bottom: 8px;';
        fileDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; font-size: 13px;">
                <i class="fa-solid fa-file" style="color: #6B7280;"></i>
                <span>${file.name}</span>
                <span style="color: #9CA3AF; font-size: 11px;">(${formatFileSize(file.size)})</span>
            </div>
            <button type="button" onclick="removeFile(${index})" style="background: none; border: none; color: #DC2626; cursor: pointer;">
                <i class="fa-solid fa-times"></i>
            </button>
        `;
        container.appendChild(fileDiv);
    });
}

function removeFile(index) {
    // Implementation for removing file
    console.log('Remove file:', index);
}

// ================================================
// FORM ACTIONS
// ================================================

function handleSaveDraft() {
    console.log('💾 Enregistrement brouillon BCF Direct');
    
    const formData = collectFormData();
    console.log('Form Data:', formData);
    
    alert('✅ Bon de commande enregistré en brouillon');
}

function handleSubmitValidation() {
    if (!validateForm()) {
        return;
    }
    
    console.log('📨 Soumission pour validation BCF Direct');
    
    const formData = collectFormData();
    console.log('Form Data:', formData);
    
    alert('✅ Bon de commande soumis pour validation !');
    window.location.href = './commandes-list.html';
}

function handleCancelDraft() {
    if (confirm('Annuler la création du bon de commande ?')) {
        window.location.href = './commandes-list.html';
    }
}

function validateForm() {
    // Check supplier
    if (!selectedSupplier) {
        alert('⚠️ Veuillez sélectionner un fournisseur');
        switchTab(0);
        return false;
    }
    
    // Check justification
    const justification = document.getElementById('direct-justification')?.value;
    if (!justification || justification.trim().length < 20) {
        alert('⚠️ Le motif détaillé doit contenir au moins 20 caractères');
        switchTab(0);
        return false;
    }
    
    // Check articles
    if (articleLines.length === 0) {
        alert('⚠️ Veuillez ajouter au moins un article');
        switchTab(1);
        return false;
    }
    
    // Check required fields
    const requiredFields = [
        { id: 'order-date', name: 'Date commande', tab: 0 },
        { id: 'buying-company', name: 'Société acheteuse', tab: 0 },
        { id: 'delivery-date', name: 'Date livraison', tab: 2 },
        { id: 'delivery-location', name: 'Lieu de livraison', tab: 2 },
        { id: 'delivery-incoterm', name: 'Incoterm', tab: 2 },
        { id: 'payment-terms', name: 'Conditions paiement', tab: 3 },
        { id: 'payment-mode', name: 'Mode paiement', tab: 3 }
    ];
    
    for (const field of requiredFields) {
        const value = document.getElementById(field.id)?.value;
        if (!value || value.trim() === '') {
            alert(`⚠️ ${field.name} est obligatoire`);
            switchTab(field.tab);
            return false;
        }
    }
    
    return true;
}

function collectFormData() {
    return {
        orderDate: document.getElementById('order-date')?.value,
        priority: document.getElementById('order-priority')?.value,
        supplier: selectedSupplier,
        buyingCompany: document.getElementById('buying-company')?.value,
        justification: document.getElementById('direct-justification')?.value,
        articles: articleLines,
        delivery: {
            date: document.getElementById('delivery-date')?.value,
            location: document.getElementById('delivery-location')?.value,
            incoterm: document.getElementById('delivery-incoterm')?.value,
            address: document.getElementById('delivery-address')?.value,
            contact: document.getElementById('delivery-contact')?.value,
            phone: document.getElementById('delivery-phone')?.value
        },
        payment: {
            terms: document.getElementById('payment-terms')?.value,
            mode: document.getElementById('payment-mode')?.value,
            currency: document.getElementById('currency-select')?.value,
            earlyPayment: document.getElementById('early-payment-checkbox')?.checked
        },
        fees: {
            transport: parseFloat(document.getElementById('fee-transport')?.value || 0),
            insurance: parseFloat(document.getElementById('fee-insurance')?.value || 0),
            customs: parseFloat(document.getElementById('fee-customs')?.value || 0),
            handling: parseFloat(document.getElementById('fee-handling')?.value || 0),
            other: parseFloat(document.getElementById('fee-other')?.value || 0),
            otherLabel: document.getElementById('fee-other-label')?.value
        },
        notes: {
            supplier: document.getElementById('supplier-notes')?.value,
            internal: document.getElementById('internal-notes')?.value
        }
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

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function numberToWords(amount) {
    // Simple implementation - you can expand this
    if (amount < 1000000) {
        return `${Math.round(amount / 1000)} mille francs CFA`;
    } else {
        const millions = Math.floor(amount / 1000000);
        const thousands = Math.round((amount % 1000000) / 1000);
        return `${millions} million${millions > 1 ? 's' : ''} ${thousands > 0 ? thousands + ' mille' : ''} francs CFA`;
    }
}

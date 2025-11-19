// ================================================
// COMMANDE-CREATE.JS
// Gestion de la création de bon de commande
// ================================================

let currentBCF = {
    code: 'BCF-2024-AUTO',
    date: null,
    company: 'HEAD',
    supplier: null,
    daSources: [],
    articles: [],
    deliveryDate: null,
    deliveryLocation: null,
    deliveryTerms: 'FOB',
    deliveryNotes: '',
    attachments: [],
    observations: ''
};

let mockSuppliers = [
    {
        id: 'FOU-001',
        name: 'ABC SARL',
        category: 'RAW_MATERIALS',
        rating: 4,
        score: 84,
        credit: 10000000,
        paymentTerms: 30,
        contact: 'J. Dupont',
        phone: '+237 699 123 456',
        isInternal: false
    },
    {
        id: 'FOU-002',
        name: 'DEF Industries',
        category: 'EQUIPMENT',
        rating: 5,
        score: 92,
        credit: 15000000,
        paymentTerms: 45,
        contact: 'M. Martin',
        phone: '+237 699 234 567',
        isInternal: true
    },
    {
        id: 'FOU-003',
        name: 'GHI Trading',
        category: 'CONSUMABLES',
        rating: 3,
        score: 71,
        credit: 5000000,
        paymentTerms: 30,
        contact: 'P. Durand',
        phone: '+237 699 345 678',
        isInternal: false
    }
];

let articleCounter = 1;

// ================================================
// INITIALISATION
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation création BCF...');
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('bcf-date').value = today;
    
    // Set default delivery date to +7 days
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7);
    document.getElementById('delivery-date').value = deliveryDate.toISOString().split('T')[0];
    
    // Add first article line
    addArticleLine();
    
    // Display suppliers
    renderSuppliersList();
});

// ================================================
// TAB NAVIGATION
// ================================================

function switchTab(tabIndex) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active state from buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`tab-${tabIndex}`).classList.add('active');
    event.target.closest('.tab-button').classList.add('active');
}

// ================================================
// SUPPLIER MANAGEMENT
// ================================================

function renderSuppliersList() {
    const search = document.getElementById('supplier-search').value.toLowerCase();
    const filtered = mockSuppliers.filter(s => 
        s.name.toLowerCase().includes(search) || 
        s.id.toLowerCase().includes(search)
    );
    
    const list = document.getElementById('suppliers-list');
    
    if (filtered.length === 0) {
        list.innerHTML = '<div style="padding: 16px; text-align: center; color: #9CA3AF;">Aucun fournisseur trouvé</div>';
        return;
    }
    
    list.innerHTML = filtered.map(supplier => `
        <div class="supplier-card ${currentBCF.supplier?.id === supplier.id ? 'selected' : ''}" onclick="selectSupplier(${filtered.indexOf(supplier)})">
            <div class="supplier-header">
                <span class="supplier-name">${supplier.id} | ${supplier.name}</span>
                <span class="supplier-rating">
                    ${'⭐'.repeat(supplier.rating)}${'☆'.repeat(5-supplier.rating)} (${supplier.score}/100)
                </span>
            </div>
            <div style="font-size: 12px; color: #6B7280; margin-top: 4px;">
                ${supplier.category}
            </div>
            <div class="supplier-meta">
                <div class="supplier-meta-item">
                    <span class="supplier-meta-label">Crédit</span>
                    <span class="supplier-meta-value">${formatCurrency(supplier.credit)}</span>
                </div>
                <div class="supplier-meta-item">
                    <span class="supplier-meta-label">Paiement</span>
                    <span class="supplier-meta-value">${supplier.paymentTerms}j</span>
                </div>
                <div class="supplier-meta-item">
                    <span class="supplier-meta-label">Contact</span>
                    <span class="supplier-meta-value">${supplier.contact} | ${supplier.phone}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function searchSuppliers() {
    renderSuppliersList();
}

function selectSupplier(index) {
    const suppliers = mockSuppliers.filter(s => {
        const search = document.getElementById('supplier-search').value.toLowerCase();
        return s.name.toLowerCase().includes(search) || s.id.toLowerCase().includes(search);
    });
    
    currentBCF.supplier = suppliers[index];
    
    // Show internal supplier alert if applicable
    const alertDiv = document.getElementById('selected-supplier-info');
    if (currentBCF.supplier.isInternal) {
        alertDiv.style.display = 'block';
    } else {
        alertDiv.style.display = 'none';
    }
    
    renderSuppliersList();
}

function openNewSupplierForm() {
    alert('Formulaire de création fournisseur (non implémenté dans cette démo)');
}

// ================================================
// DA SOURCES MANAGEMENT
// ================================================

function addDASource() {
    const daNumber = prompt('Entrez le numéro de DA (ex: DA-2024-001):');
    if (!daNumber) return;
    
    currentBCF.daSources.push({
        number: daNumber,
        amount: 500000 + Math.random() * 500000
    });
    
    renderDASources();
}

function renderDASources() {
    const list = document.getElementById('da-sources-list');
    
    if (currentBCF.daSources.length === 0) {
        list.innerHTML = '<div style="text-align: center; color: #9CA3AF; padding: 16px;">Aucune DA sélectionnée</div>';
    } else {
        list.innerHTML = currentBCF.daSources.map((da, idx) => `
            <div class="da-source-item">
                <span>• ${da.number} - Production - ${formatCurrency(da.amount)}</span>
                <button type="button" onclick="removeDASource(${idx})" style="background: none; border: none; color: #EF4444; cursor: pointer;">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
    
    // Update counts
    document.getElementById('da-count').textContent = currentBCF.daSources.length;
    document.getElementById('da-amount').textContent = formatCurrency(
        currentBCF.daSources.reduce((sum, da) => sum + da.amount, 0)
    );
}

function removeDASource(index) {
    currentBCF.daSources.splice(index, 1);
    renderDASources();
}

// ================================================
// ARTICLES MANAGEMENT
// ================================================

function addArticleLine() {
    const lineId = `article-${articleCounter++}`;
    currentBCF.articles.push({
        id: lineId,
        article: '',
        designation: '',
        quantity: '',
        unit: 'unité',
        unitPrice: '',
        discount: '',
        tva: 19.25,
        total: 0
    });
    
    renderArticles();
}

function renderArticles() {
    const tbody = document.getElementById('articles-tbody');
    
    tbody.innerHTML = currentBCF.articles.map((article, idx) => {
        const quantity = parseFloat(article.quantity) || 0;
        const unitPrice = parseFloat(article.unitPrice) || 0;
        const discount = parseFloat(article.discount) || 0;
        const ht = quantity * unitPrice;
        const htAfterDiscount = ht - discount;
        const tva = htAfterDiscount * (article.tva / 100);
        const ttc = htAfterDiscount + tva;
        
        // Update article total
        currentBCF.articles[idx].total = ttc;
        
        const priceNote = currentBCF.supplier?.isInternal ? 
            `<div class="transfer-price-note"><i class="fa-solid fa-info-circle"></i><div>Prix catalogue: 1,500 XAF<br>Prix transfert: 1,425 XAF (-5%) ✓ Appliqué</div></div>` : '';
        
        return `
            <tr>
                <td style="text-align: center; font-weight: 600; color: #6B7280;">${idx + 1}</td>
                <td>
                    <input 
                        type="text" 
                        placeholder="Rechercher..."
                        value="${article.article}"
                        onchange="updateArticle('${article.id}', 'article', this.value)"
                        style="position: relative;"
                    >
                </td>
                <td>
                    <input 
                        type="text" 
                        placeholder="Description"
                        value="${article.designation}"
                        onchange="updateArticle('${article.id}', 'designation', this.value)"
                    >
                </td>
                <td>
                    <input 
                        type="number" 
                        placeholder="0"
                        value="${article.quantity}"
                        onchange="updateArticle('${article.id}', 'quantity', this.value); calculateTotals()"
                        min="0"
                        step="0.01"
                    >
                </td>
                <td>
                    <select onchange="updateArticle('${article.id}', 'unit', this.value)">
                        <option value="unité" ${article.unit === 'unité' ? 'selected' : ''}>unité</option>
                        <option value="kg" ${article.unit === 'kg' ? 'selected' : ''}>kg</option>
                        <option value="L" ${article.unit === 'L' ? 'selected' : ''}>L</option>
                        <option value="m" ${article.unit === 'm' ? 'selected' : ''}>m</option>
                        <option value="m²" ${article.unit === 'm²' ? 'selected' : ''}>m²</option>
                        <option value="sac" ${article.unit === 'sac' ? 'selected' : ''}>sac</option>
                    </select>
                </td>
                <td>
                    <input 
                        type="number" 
                        placeholder="0"
                        value="${article.unitPrice}"
                        onchange="updateArticle('${article.id}', 'unitPrice', this.value); calculateTotals()"
                        min="0"
                        step="0.01"
                    >
                </td>
                <td>
                    <input 
                        type="number" 
                        placeholder="0"
                        value="${article.discount}"
                        onchange="updateArticle('${article.id}', 'discount', this.value); calculateTotals()"
                        min="0"
                    >
                </td>
                <td style="text-align: center;">19.25%</td>
                <td style="text-align: right; font-weight: 600; color: #263c89;">
                    ${formatCurrency(ttc)}
                </td>
                <td style="text-align: center;">
                    <button type="button" class="btn-remove-line" onclick="removeArticle('${article.id}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
            ${priceNote ? '<tr><td colspan="10">' + priceNote + '</td></tr>' : ''}
        `;
    }).join('');
    
    calculateTotals();
}

function updateArticle(articleId, field, value) {
    const article = currentBCF.articles.find(a => a.id === articleId);
    if (article) {
        article[field] = value;
    }
}

function removeArticle(articleId) {
    if (currentBCF.articles.length <= 1) {
        alert('Au moins une ligne d\'article est obligatoire');
        return;
    }
    
    currentBCF.articles = currentBCF.articles.filter(a => a.id !== articleId);
    renderArticles();
}

function calculateTotals() {
    let totalHT = 0;
    let totalDiscount = 0;
    let totalTVA = 0;
    let totalTTC = 0;
    
    currentBCF.articles.forEach(article => {
        const quantity = parseFloat(article.quantity) || 0;
        const unitPrice = parseFloat(article.unitPrice) || 0;
        const discount = parseFloat(article.discount) || 0;
        
        const ht = quantity * unitPrice;
        const htAfterDiscount = ht - discount;
        const tva = htAfterDiscount * (article.tva / 100);
        const ttc = htAfterDiscount + tva;
        
        totalHT += ht;
        totalDiscount += discount;
        totalTVA += tva;
        totalTTC += ttc;
    });
    
    // Update display
    document.getElementById('total-ht').textContent = formatCurrency(totalHT);
    document.getElementById('total-ht-box').textContent = formatCurrency(totalHT);
    document.getElementById('total-discount-box').textContent = formatCurrency(totalDiscount);
    document.getElementById('total-tva-box').textContent = formatCurrency(totalTVA);
    document.getElementById('total-ttc-box').textContent = formatCurrency(totalTTC);
    
    // DA ventilation
    if (currentBCF.daSources.length > 0) {
        const ventilation = currentBCF.daSources.map(da => {
            const percentage = (da.amount / totalTTC * 100).toFixed(1);
            return `${da.number}: ${formatCurrency(da.amount)} (${percentage}%)`;
        }).join(' | ');
        
        document.getElementById('da-ventilation').innerHTML = `
            <div style="font-size: 12px; color: #6B7280;">
                <strong>Ventilation par DA source:</strong><br>
                ${ventilation}
            </div>
        `;
    }
}

function importFromDA() {
    alert('Fonctionnalité import DA (à implémenter)');
}

function pasteArticles() {
    alert('Fonctionnalité copier-coller (à implémenter)');
}

// ================================================
// FILE UPLOAD
// ================================================

function handleFileUpload(event) {
    const files = event.target.files;
    
    Array.from(files).forEach(file => {
        if (file.size > 10 * 1024 * 1024) {
            alert(`Le fichier ${file.name} est trop volumineux (max 10 Mo)`);
            return;
        }
        
        currentBCF.attachments.push({
            id: Date.now() + Math.random(),
            name: file.name,
            size: file.size,
            type: file.type
        });
    });
    
    renderUploadedFiles();
    event.target.value = ''; // Reset input
}

function renderUploadedFiles() {
    const container = document.getElementById('uploaded-files');
    
    if (currentBCF.attachments.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = `
        <div style="margin-top: 16px;">
            ${currentBCF.attachments.map((file, idx) => `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: #F3F4F6; border-radius: 6px; margin-bottom: 8px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <i class="fa-solid fa-file" style="color: #9CA3AF;"></i>
                        <div>
                            <div style="font-weight: 600; font-size: 12px;">${file.name}</div>
                            <div style="font-size: 11px; color: #9CA3AF;">${formatFileSize(file.size)}</div>
                        </div>
                    </div>
                    <button type="button" onclick="removeAttachment(${idx})" style="background: none; border: none; color: #EF4444; cursor: pointer;">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `).join('')}
        </div>
    `;
}

function removeAttachment(index) {
    currentBCF.attachments.splice(index, 1);
    renderUploadedFiles();
}

// ================================================
// FORM ACTIONS
// ================================================

function saveDraft() {
    console.log('💾 Enregistrement brouillon BCF:', currentBCF);
    alert('Bon de commande enregistré en brouillon');
    window.location.href = './commandes-list.html';
}

function validateAndSend() {
    // Validation
    if (!currentBCF.supplier) {
        alert('Veuillez sélectionner un fournisseur');
        return;
    }
    
    if (currentBCF.articles.length === 0 || !currentBCF.articles[0].article) {
        alert('Veuillez ajouter au moins un article');
        return;
    }
    
    if (!document.getElementById('delivery-date').value) {
        alert('Veuillez saisir une date de livraison');
        return;
    }
    
    if (!document.getElementById('delivery-location').value) {
        alert('Veuillez sélectionner un lieu de livraison');
        return;
    }
    
    console.log('✅ Validation et envoi BCF:', currentBCF);
    alert('✅ Bon de commande créé et envoyé au fournisseur');
    window.location.href = './commande-send.html?bcf=BCF-2024-AUTO';
}

function cancelForm() {
    if (confirm('Abandonner la création du bon de commande ?')) {
        window.location.href = './commandes-list.html';
    }
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
    if (bytes < 1024) return bytes + ' o';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' Ko';
    return (bytes / (1024 * 1024)).toFixed(1) + ' Mo';
}

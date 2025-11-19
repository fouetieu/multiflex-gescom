// ================================================
// FOURNISSEUR-DETAIL.JS
// Écran de détail fournisseur - Conforme ÉCRAN 8B
// ================================================

let supplierId = null;
let supplierData = null;

// ================================================
// INITIALISATION
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    // Récupérer l'ID depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    supplierId = urlParams.get('id');
    
    if (!supplierId) {
        alert('Fournisseur non trouvé');
        window.location.href = './fournisseurs-list.html';
        return;
    }
    
    loadSupplierData();
});

// ================================================
// CHARGEMENT DES DONNÉES
// ================================================

function loadSupplierData() {
    // Simuler le chargement depuis l'API
    supplierData = getMockSupplierData(supplierId);
    
    if (!supplierData) {
        alert('Fournisseur non trouvé');
        window.location.href = './fournisseurs-list.html';
        return;
    }
    
    renderSupplierDetail();
}

function getMockSupplierData(id) {
    // Données de démonstration
    const suppliers = {
        'SUPP-001': {
            id: 'SUPP-001',
            code: 'SUPP-001',
            name: 'ChemTech SARL',
            type: 'EXTERNAL',
            category: 'Produits chimiques',
            status: 'ACTIVE',
            taxId: 'P087201234567W',
            niu: '2024156789',
            tradeRegister: 'CM-DLA-2015-B-1234',
            capital: 50000000,
            taxRegime: 'REEL',
            vatRecoverable: true,
            createdAt: '2023-03-15',
            createdBy: 'Admin KENGNE',
            address: {
                street: 'Zone Industrielle Bassa, BP 1234 Douala',
                city: 'Douala',
                country: 'Cameroun'
            },
            phone: '+237 233 456 789',
            fax: '+237 233 456 790',
            email: 'commande@chemtech.cm',
            website: 'www.chemtech.cm',
            contacts: {
                main: {
                    name: 'M. Paul NGUEMA',
                    function: 'Directeur Commercial',
                    mobile: '+237 677 888 999',
                    email: 'p.nguema@chemtech.cm'
                },
                accounting: {
                    name: 'Mme Alice MBARGA',
                    function: 'Chef Comptable',
                    mobile: '+237 699 111 222',
                    email: 'compta@chemtech.cm'
                }
            },
            commercial: {
                paymentMode: 'VIREMENT',
                paymentTerms: '30 JOURS',
                currency: 'XAF',
                incoterm: 'EXW',
                minimumOrder: 100000,
                freeDeliveryThreshold: 500000,
                volumeDiscounts: [
                    { threshold: 1000000, rate: 2 },
                    { threshold: 5000000, rate: 3 },
                    { threshold: 10000000, rate: 5 }
                ]
            },
            banking: {
                name: 'BICEC Douala',
                code: '10001',
                iban: 'CM21 10001 00020 12345678901 23',
                rib: 'RIB_ChemTech.pdf',
                ribVerified: '2024-01-10'
            },
            documents: [
                {
                    type: 'Patente',
                    number: 'PAT-2024-45678',
                    expiryDate: '2024-12-31',
                    status: 'VALID',
                    file: 'patente_chemtech.pdf'
                },
                {
                    type: 'Certificat de non-redevance',
                    number: 'CNR-2024-12345',
                    expiryDate: '2024-01-28',
                    status: 'EXPIRING_SOON',
                    daysToExpiry: -8,
                    file: 'cnr_chemtech.pdf'
                },
                {
                    type: 'Attestation de localisation',
                    number: 'LOC-2023-98765',
                    expiryDate: '2025-03-15',
                    status: 'VALID',
                    file: 'localisation_chemtech.pdf'
                },
                {
                    type: 'Registre de commerce',
                    number: 'RC-DLA-2015-1234',
                    expiryDate: null,
                    status: 'PERMANENT',
                    file: 'rccm_chemtech.pdf'
                },
                {
                    type: 'Carte contribuable',
                    number: 'P087201234567W',
                    expiryDate: '2024-03-31',
                    status: 'EXPIRING_SOON',
                    daysToExpiry: 60,
                    file: 'contrib_chemtech.pdf'
                },
                {
                    type: 'Agrément MINCOMMERCE',
                    number: 'AGR-2023-789',
                    expiryDate: '2024-06-30',
                    status: 'VALID',
                    file: 'agrement_chemtech.pdf'
                }
            ],
            evaluation: {
                overallScore: 92,
                grade: 'A',
                deliveryScore: 18,
                qualityScore: 19,
                priceScore: 17,
                communicationScore: 18,
                documentationScore: 20,
                period: '2024',
                conformityRate: 95,
                disputeRate: 1.9,
                averageDeliveryTime: 2.1,
                volume2024: 127450000,
                orders2024: 156,
                invoicesPaid: 148,
                avgDelay: '2.1 jours',
                disputes: '3 (1.9%)'
            },
            catalog: [
                {
                    code: 'CHEM-001',
                    description: 'Produit chimique A',
                    unit: 'L',
                    price: 850,
                    leadTime: '3j',
                    stock: 'AVAILABLE',
                    active: true
                },
                {
                    code: 'CHEM-002',
                    description: 'Produit chimique B',
                    unit: 'L',
                    price: 1100,
                    leadTime: '3j',
                    stock: 'AVAILABLE',
                    active: true
                },
                {
                    code: 'CHEM-003',
                    description: 'Additif spécial',
                    unit: 'KG',
                    price: 3500,
                    leadTime: '5j',
                    stock: 'LOW',
                    active: true
                },
                {
                    code: 'CHEM-004',
                    description: 'Solvant industriel',
                    unit: 'L',
                    price: 650,
                    leadTime: '2j',
                    stock: 'AVAILABLE',
                    active: true
                }
            ],
            history: [
                {
                    date: '2024-01-30',
                    user: 'Marie DJOMO',
                    action: 'Mise à jour conditions commerciales'
                },
                {
                    date: '2024-01-28',
                    user: 'Système',
                    action: '⚠️ Certificat de non-redevance expiré',
                    type: 'warning'
                },
                {
                    date: '2024-01-25',
                    user: 'Alphonse NJOYA',
                    action: 'Création litige LIT-2024-0089'
                },
                {
                    date: '2024-01-18',
                    user: 'Marie DJOMO',
                    action: 'Création BCF-2024-00456'
                }
            ]
        }
    };
    
    return suppliers[id];
}

// ================================================
// AFFICHAGE DES DONNÉES
// ================================================

function renderSupplierDetail() {
    // Header
    document.getElementById('supplier-name').textContent = supplierData.name;
    document.getElementById('supplier-code').textContent = supplierData.code;
    
    // Status
    const statusBadge = document.getElementById('supplier-status');
    const statusInfo = getStatusInfo(supplierData.status);
    statusBadge.className = 'status-badge-large';
    statusBadge.style.background = statusInfo.bgColor;
    statusBadge.style.color = statusInfo.color;
    statusBadge.innerHTML = statusInfo.icon + ' ' + statusInfo.label;
    
    // Score
    const scoreBadge = document.getElementById('supplier-score-badge');
    const scoreColor = getScoreColor(supplierData.evaluation.grade);
    scoreBadge.style.background = scoreColor;
    scoreBadge.textContent = supplierData.evaluation.grade;
    document.getElementById('supplier-score').textContent = supplierData.evaluation.overallScore;
    
    // Informations générales
    renderGeneralInfo();
    
    // Coordonnées
    renderCoordinates();
    
    // Conditions commerciales
    renderCommercialTerms();
    
    // Documents
    renderDocuments();
    
    // Évaluation
    renderEvaluation();
    
    // Catalogue
    renderCatalog();
    
    // Historique
    renderHistory();
}

function renderGeneralInfo() {
    const html = `
        <div class="info-item">
            <div class="info-label">Raison Sociale</div>
            <div class="info-value">${supplierData.name}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Code</div>
            <div class="info-value">${supplierData.code}</div>
        </div>
        <div class="info-item">
            <div class="info-label">N° Contribuable</div>
            <div class="info-value">${supplierData.taxId}</div>
        </div>
        <div class="info-item">
            <div class="info-label">NIU</div>
            <div class="info-value">${supplierData.niu}</div>
        </div>
        <div class="info-item">
            <div class="info-label">RCCM</div>
            <div class="info-value">${supplierData.tradeRegister}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Capital Social</div>
            <div class="info-value">${formatCurrency(supplierData.capital)} XAF</div>
        </div>
        <div class="info-item">
            <div class="info-label">Type</div>
            <div class="info-value">${supplierData.type === 'EXTERNAL' ? 'EXTERNE' : 'INTERNE'}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Catégorie</div>
            <div class="info-value">${supplierData.category}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Régime Fiscal</div>
            <div class="info-value">${supplierData.taxRegime}</div>
        </div>
        <div class="info-item">
            <div class="info-label">TVA Récupérable</div>
            <div class="info-value">${supplierData.vatRecoverable ? '✅ OUI' : '❌ NON'}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Date Création Fiche</div>
            <div class="info-value">${formatDate(supplierData.createdAt)}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Créé Par</div>
            <div class="info-value">${supplierData.createdBy}</div>
        </div>
    `;
    
    document.getElementById('general-info').innerHTML = html;
}

function renderCoordinates() {
    document.getElementById('address').textContent = supplierData.address.street;
    document.getElementById('phone').textContent = supplierData.phone;
    document.getElementById('fax').textContent = supplierData.fax || '-';
    document.getElementById('email').textContent = supplierData.email;
    document.getElementById('website').textContent = supplierData.website || '-';
    
    // Contact principal
    const mainContact = supplierData.contacts.main;
    document.getElementById('contact-main').innerHTML = `
        <div style="font-weight: 600; margin-bottom: 8px;">${mainContact.name}</div>
        <div style="font-size: 13px; color: var(--gray-600); margin-bottom: 4px;">${mainContact.function}</div>
        <div style="font-size: 13px; color: var(--gray-700);">
            <i class="fa-solid fa-mobile"></i> ${mainContact.mobile}
        </div>
        <div style="font-size: 13px; color: var(--gray-700); margin-top: 2px;">
            <i class="fa-solid fa-envelope"></i> ${mainContact.email}
        </div>
    `;
    
    // Contact comptabilité
    const accountingContact = supplierData.contacts.accounting;
    document.getElementById('contact-accounting').innerHTML = `
        <div style="font-weight: 600; margin-bottom: 8px;">${accountingContact.name}</div>
        <div style="font-size: 13px; color: var(--gray-600); margin-bottom: 4px;">${accountingContact.function}</div>
        <div style="font-size: 13px; color: var(--gray-700);">
            <i class="fa-solid fa-mobile"></i> ${accountingContact.mobile}
        </div>
        <div style="font-size: 13px; color: var(--gray-700); margin-top: 2px;">
            <i class="fa-solid fa-envelope"></i> ${accountingContact.email}
        </div>
    `;
}

function renderCommercialTerms() {
    const commercial = supplierData.commercial;
    const banking = supplierData.banking;
    
    document.getElementById('payment-mode').textContent = commercial.paymentMode;
    document.getElementById('payment-terms').textContent = commercial.paymentTerms;
    document.getElementById('currency').textContent = commercial.currency;
    document.getElementById('incoterm').textContent = commercial.incoterm;
    document.getElementById('min-order').textContent = formatCurrency(commercial.minimumOrder) + ' XAF';
    document.getElementById('free-delivery').textContent = formatCurrency(commercial.freeDeliveryThreshold) + ' XAF';
    
    // Remises volume
    const discounts = commercial.volumeDiscounts.map(d => 
        `<span class="discount-tag">${d.rate}% > ${formatCurrency(d.threshold)} XAF</span>`
    ).join(' ');
    document.getElementById('volume-discounts').innerHTML = discounts;
    
    // Banking
    document.getElementById('bank-name').textContent = banking.name;
    document.getElementById('bank-code').textContent = banking.code;
    document.getElementById('iban').textContent = banking.iban;
    document.getElementById('rib').innerHTML = `
        <a href="#" onclick="viewDocument('${banking.rib}')" style="color: var(--primary-color);">
            <i class="fa-solid fa-file-pdf"></i> ${banking.rib}
        </a>
        <span style="font-size: 12px; color: var(--gray-500); margin-left: 8px;">
            Vérifié le ${formatDate(banking.ribVerified)}
        </span>
    `;
}

function renderDocuments() {
    const header = `
        <div class="document-row">
            <div>Document</div>
            <div>Numéro</div>
            <div>Validité</div>
            <div>Statut</div>
            <div>Actions</div>
        </div>
    `;
    
    const rows = supplierData.documents.map(doc => {
        const statusInfo = getDocumentStatusInfo(doc);
        
        return `
            <div class="document-row">
                <div>${doc.type}</div>
                <div style="font-family: monospace; font-size: 13px;">${doc.number}</div>
                <div>${doc.expiryDate ? formatDate(doc.expiryDate) : 'Permanent'}</div>
                <div>
                    <span style="background: ${statusInfo.bgColor}; color: ${statusInfo.color}; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">
                        ${statusInfo.label}
                    </span>
                </div>
                <div style="display: flex; gap: 4px; justify-content: center;">
                    <button class="btn-icon" onclick="viewDocument('${doc.file}')" title="Voir">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                    <button class="btn-icon" onclick="downloadDocument('${doc.file}')" title="Télécharger">
                        <i class="fa-solid fa-download"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    document.getElementById('documents-list').innerHTML = header + rows;
}

function renderEvaluation() {
    const eval = supplierData.evaluation;
    
    document.getElementById('eval-score').textContent = `${eval.grade} (${eval.overallScore}/100)`;
    document.getElementById('volume-2024').textContent = formatCurrency(eval.volume2024) + ' XAF';
    document.getElementById('orders-2024').textContent = eval.orders2024;
    document.getElementById('invoices-paid').textContent = eval.invoicesPaid;
    document.getElementById('avg-delay').textContent = eval.avgDelay;
    document.getElementById('conformity-rate').textContent = eval.conformityRate + '%';
    document.getElementById('disputes').textContent = eval.disputes;
    
    // Critères d'évaluation avec barres
    const criteria = [
        { label: 'Respect délais livraison', score: eval.deliveryScore, max: 20 },
        { label: 'Qualité produits/services', score: eval.qualityScore, max: 20 },
        { label: 'Prix compétitifs', score: eval.priceScore, max: 20 },
        { label: 'Réactivité/Communication', score: eval.communicationScore, max: 20 },
        { label: 'Documents conformes', score: eval.documentationScore, max: 20 }
    ];
    
    const criteriaHtml = criteria.map(c => {
        const percentage = (c.score / c.max) * 100;
        return `
            <div style="margin-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <span style="font-size: 13px; color: var(--gray-700);">• ${c.label}</span>
                    <span style="font-size: 13px; font-weight: 600; color: var(--gray-900);">${c.score}/${c.max}</span>
                </div>
                <div class="score-bar">
                    <div class="score-bar-fill" style="width: ${percentage}%;">
                        ${percentage >= 30 ? percentage.toFixed(0) + '%' : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    document.getElementById('evaluation-criteria').innerHTML = criteriaHtml;
}

function renderCatalog() {
    const header = `
        <div class="catalog-row">
            <div>Code</div>
            <div>Description</div>
            <div>Unité</div>
            <div>Prix Unit.</div>
            <div>Délai</div>
            <div>Stock</div>
            <div>Actif</div>
        </div>
    `;
    
    const rows = supplierData.catalog.map(product => {
        const stockInfo = getStockInfo(product.stock);
        
        return `
            <div class="catalog-row">
                <div style="font-family: monospace; font-weight: 600;">${product.code}</div>
                <div>${product.description}</div>
                <div style="text-align: center;">${product.unit}</div>
                <div style="text-align: right; font-weight: 600;">${formatCurrency(product.price)} XAF</div>
                <div style="text-align: center;">${product.leadTime}</div>
                <div style="text-align: center;">${stockInfo}</div>
                <div style="text-align: center;">${product.active ? '✅' : '❌'}</div>
            </div>
        `;
    }).join('');
    
    document.getElementById('catalog-list').innerHTML = header + rows;
}

function renderHistory() {
    const rows = supplierData.history.map(item => {
        const warningClass = item.type === 'warning' ? 'style="color: var(--warning-color);"' : '';
        
        return `
            <div class="history-item">
                <div class="history-date">${formatDate(item.date)}</div>
                <div class="history-user">${item.user}</div>
                <div class="history-action" ${warningClass}>${item.action}</div>
            </div>
        `;
    }).join('');
    
    document.getElementById('history-list').innerHTML = rows;
}

// ================================================
// HELPERS
// ================================================

function getStatusInfo(status) {
    const statuses = {
        'ACTIVE': { icon: '✅', label: 'ACTIF', bgColor: '#D1FAE5', color: '#065F46' },
        'SUSPENDED': { icon: '⏸️', label: 'SUSPENDU', bgColor: '#FFFBEB', color: '#92400E' },
        'BLOCKED': { icon: '🚫', label: 'BLOQUÉ', bgColor: '#FEE2E2', color: '#991B1B' }
    };
    return statuses[status] || statuses['ACTIVE'];
}

function getScoreColor(grade) {
    const colors = {
        'A': '#10B981',
        'B': '#3B82F6',
        'C': '#F59E0B',
        'D': '#EF4444'
    };
    return colors[grade] || '#6B7280';
}

function getDocumentStatusInfo(doc) {
    if (doc.status === 'PERMANENT') {
        return { label: '✅', bgColor: '#D1FAE5', color: '#065F46' };
    }
    if (doc.status === 'VALID') {
        return { label: '✅', bgColor: '#D1FAE5', color: '#065F46' };
    }
    if (doc.status === 'EXPIRING_SOON') {
        return { label: `⚠️${doc.daysToExpiry}j`, bgColor: '#FFFBEB', color: '#92400E' };
    }
    return { label: '🔴', bgColor: '#FEE2E2', color: '#991B1B' };
}

function getStockInfo(stock) {
    if (stock === 'AVAILABLE') return '✅';
    if (stock === 'LOW') return '⚠️';
    return '❌';
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR').format(amount);
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// ================================================
// ACTIONS
// ================================================

function editSupplier() {
    window.location.href = `./fournisseur-edit.html?id=${supplierId}`;
}

function createOrder() {
    window.location.href = `./commande-create.html?supplier=${supplierId}`;
}

function generateReport() {
    alert('Génération du rapport fournisseur...');
}

function suspendSupplier() {
    if (confirm(`Suspendre le fournisseur ${supplierData.name} ?`)) {
        alert('Fournisseur suspendu');
    }
}

function blockSupplier() {
    if (confirm(`Bloquer le fournisseur ${supplierData.name} ?`)) {
        alert('Fournisseur bloqué');
    }
}

function addDocument() {
    alert('Ajouter un document...');
}

function sendRenewalReminder() {
    alert('Envoi du rappel de renouvellement...');
}

function viewDocument(file) {
    alert(`Affichage du document: ${file}`);
}

function downloadDocument(file) {
    alert(`Téléchargement du document: ${file}`);
}

function viewFullCatalog() {
    alert('Affichage du catalogue complet...');
}

function addProduct() {
    alert('Ajouter un produit au catalogue...');
}

function negotiatePrices() {
    alert('Négociation des prix...');
}

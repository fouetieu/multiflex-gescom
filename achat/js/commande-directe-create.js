'use strict';

const TAX_RATE = 19.25;

const referenceData = {
    originators: [
        { id: 'EMP-1001', name: 'Paul MBARGA', title: 'Chef Production', department: 'Production - Usine Douala' },
        { id: 'EMP-1034', name: 'Brigitte NGOH', title: 'Resp. Maintenance', department: 'Maintenance Centrale' },
        { id: 'EMP-1100', name: 'Serge NGOLO', title: 'Resp. Qualité', department: 'Qualité & Contrôle' }
    ],
    companies: [
        { id: 'IOLA-BTP', label: 'IOLA BTP - Douala' },
        { id: 'IOLA-IND', label: 'IOLA Industries - Bassa' }
    ],
    costCenters: [
        { id: 'WH-DLA-001', label: 'Usine Douala' },
        { id: 'PRJ-SONARA', label: 'Chantier SONARA - Limbé' },
        { id: 'PLANT-BON', label: 'Usine Bonabéri' }
    ],
    budgetLines: [
        { id: 'BUDGET-MP-PROD', label: 'Matières premières - Production' },
        { id: 'BUDGET-IND-OPS', label: 'Fonctionnement - Indirect' }
    ],
    deliveryLocations: [
        { id: 'WH-DLA-001', label: 'Entrepôt principal Douala', address: 'Zone Industrielle Bassa\nBP 12345 Douala, Cameroun', contact: 'André NJOYA - 699 887 766' },
        { id: 'PLANT-BON', label: 'Usine de production Bonabéri', address: 'Route industrielle Bonabéri\nDouala, Cameroun', contact: 'Mireille TCHAMI - 677 555 990' },
        { id: 'SITE-SONARA', label: 'Chantier SONARA - Limbé', address: 'Camp SONARA\nLimbé, Cameroun', contact: 'Patrick FOTABONG - 699 201 345' }
    ],
    incoterms: [
        { id: 'EXW', label: 'EXW - Ex Works (départ usine)' },
        { id: 'FCA', label: 'FCA - Free Carrier' },
        { id: 'FOB', label: 'FOB - Free On Board' },
        { id: 'CIF', label: 'CIF - Cost, Insurance & Freight' },
        { id: 'DAP', label: 'DAP - Delivered At Place' }
    ],
    transportResponsibilities: [
        { id: 'CUSTOMER', label: 'À notre charge' },
        { id: 'SUPPLIER', label: 'Charge fournisseur' }
    ],
    carriers: [
        { id: 'CAMRAIL', label: 'CAMRAIL Express' },
        { id: 'BOLLORÉ', label: 'Bolloré Logistics' },
        { id: 'DHL', label: 'DHL Supply Chain' }
    ],
    paymentTerms: [
        { id: 'CASH', label: 'Comptant', type: 'CASH', days: 0 },
        { id: 'NET15', label: '15 jours net', type: 'NET', days: 15 },
        { id: 'NET30', label: '30 jours net', type: 'NET', days: 30 },
        { id: 'NET45', label: '45 jours net', type: 'NET', days: 45 },
        { id: 'NET60FM', label: '60 jours fin de mois', type: 'NET', days: 60 }
    ],
    paymentModes: [
        { id: 'TRANSFER', label: 'Virement bancaire' },
        { id: 'CASH', label: 'Espèces (max 5M XAF)' },
        { id: 'CHEQUE', label: 'Chèque certifié' },
        { id: 'MOBILE', label: 'Mobile Money (max 1M XAF)' },
        { id: 'LC', label: 'Lettre de crédit' }
    ],
    catalogItems: [
        { id: 'MP-PAINT-01', label: 'MP-PAINT-01 | Peinture acrylique blanche', description: 'Peinture acrylique blanche mate', unit: 'L' },
        { id: 'MP-SOLV-03', label: 'MP-SOLV-03 | Solvant industriel', description: 'Solvant industriel haute pureté', unit: 'L' },
        { id: 'AD-XR-100', label: 'AD-XR-100 | Additif spécial', description: 'Additif spécial XR-100', unit: 'KG' }
    ],
    units: ['L', 'KG', 'UN', 'M', 'M²', 'SAC']
};

const purchaseOrder = {
    id: 'd3c0b714-b7f1-4a3f-9c11-bcf-2024-0091',
    orderNumber: 'BCF-2024-0091',
    status: 'DRAFT',
    hero: {
        updatedAt: '2024-01-31T10:12:00Z'
    },
    directPurchaseJustification: 'Urgence - Rupture stock critique',
    urgencyLevel: 'CRITIQUE',
    businessImpact: 'Production arrêtée ligne peinture MP-PAINT-01',
    orderDate: '2024-01-31',
    fiscalYear: 2024,
    orderType: 'STANDARD',
    priority: 'URGENT',
    purchaseCategory: 'DIRECT_MATERIAL',
    categoryLabel: 'DIRECT_MATERIAL - Production',
    supplier: {
        id: 'FOU-2024-00023',
        name: 'ChemTech SARL',
        type: 'EXTERNAL',
        code: 'FOU-2024-00023',
        niu: { value: 'P087201234567W', status: 'VALID' },
        certificate: { number: 'CNR-2024-12345', expiry: '2024-02-15', status: 'VALID' },
        address: 'Zone Industrielle Bassa, Douala',
        contact: { name: 'M. Jean FOTSO', phone: '677 123 456', email: 'commandes@chemtech.cm' },
        conditions: [
            'Paiement: NET 30 jours',
            'Minimum commande: 500,000 XAF',
            'Franco de port: à partir de 2,000,000 XAF'
        ]
    },
    requester: {
        originatorId: 'EMP-1001',
        originatorName: 'Paul MBARGA',
        originatorRole: 'Chef Production',
        department: 'Production - Usine Douala',
        buyerId: 'EMP-BUY-001',
        buyerName: 'Marie DJOMO',
        buyingCompanyId: 'IOLA-BTP',
        costCenterId: 'WH-DLA-001',
        projectCode: ''
    },
    delivery: {
        requestedDate: '2024-02-10',
        leadTime: '10 jours (hab: 7-10j)',
        locationId: 'WH-DLA-001',
        address: {
            street: 'Zone Industrielle Bassa',
            city: 'Douala',
            country: 'Cameroun',
            extra: 'BP 12345 Douala, Cameroun'
        },
        fullAddress: 'Zone Industrielle Bassa\nBP 12345 Douala, Cameroun',
        contact: 'André NJOYA - 699 887 766',
        incoterm: 'EXW',
        transportResponsibility: 'CUSTOMER',
        carrierId: 'CAMRAIL',
        transportMode: 'ROAD'
    },
    payment: {
        termsId: 'NET30',
        modeId: 'TRANSFER',
        currency: 'XAF',
        exchangeRate: 1,
        taxRegime: 'REEL',
        earlyPaymentDiscount: { rate: 2, days: 10, enabled: true }
    },
    fees: {
        transport: 25000,
        insurance: 5000,
        customs: 0,
        handling: 0,
        other: 0,
        otherLabel: ''
    },
    budget: {
        lineId: 'BUDGET-MP-PROD',
        label: 'Matières premières - Production',
        year: 2024,
        period: 'Janvier',
        allocated: 10000000,
        consumed: 4500000,
        committed: 1200000,
        available: null,
        thisOrder: null,
        remaining: null
    },
    documentsRequired: [
        { label: 'Devis fournisseur', type: 'SUPPLIER_QUOTE', required: true, fileName: 'Devis_ChemTech_2024.pdf', status: 'uploaded' },
        { label: 'Fiche technique', type: 'TECH_SHEET', required: false, fileName: null, status: 'missing' },
        { label: 'Certificat conformité', type: 'CONFORMITY', required: false, fileName: null, status: 'missing' },
        { label: 'Autre document', type: 'OTHER', required: false, fileName: null, status: 'optional' }
    ],
    notes: {
        supplier: 'Livraison urgente requise. Confirmer disponibilité stock. Emballer par lots de 100L pour faciliter manutention.',
        internal: 'Commande urgente suite rupture stock. Production arrêtée. Contacter Paul MBARGA pour coordination réception.'
    },
    workflow: {
        reason: 'DIRECT_PURCHASE',
        threshold: 2000000,
        slaHours: 4,
        amountTTC: 0,
        steps: [
            { stepNumber: 1, name: 'Paul MBARGA', role: 'Demandeur', status: 'PENDING' },
            { stepNumber: 2, name: 'Marie DJOMO', role: 'Acheteuse', status: 'PENDING' },
            { stepNumber: 3, name: 'Jean EKANI', role: 'Manager Achats', status: 'PENDING', condition: 'Montant > 2M XAF' }
        ]
    },
    warnings: [
        'Commande directe sans DA - justification fournie',
        'Stock critique sur MP-PAINT-01',
        'Certificat non-redevance fournisseur valide',
        'Budget disponible confirmé'
    ],
    actionsAfterValidation: [
        'Générer PDF bon de commande',
        'Envoyer au fournisseur par email',
        'Engager le budget (1,800,000 XAF HT)',
        'Créer ordre de réception dans le système',
        'Notifier le magasinier de la livraison attendue',
        'Alerter comptabilité pour provision'
    ]
};

purchaseOrder.lines = [
    {
        id: 'line-1',
        lineNumber: 1,
        productId: 'MP-PAINT-01',
        productName: 'Peinture acrylique blanche',
        description: 'Peinture acrylique blanche mate',
        quantity: 1000,
        unit: 'L',
        unitPrice: 1450,
        priceCatalog: 1500,
        discountRate: 3.33,
        lineType: 'CATALOG',
        stock: { status: 'critical', label: 'Stock actuel: 50 L (critique!)' },
        averageConsumption: '200 L/semaine',
        lastOrder: '15/01/2024 - 1,455 XAF/L',
        suggestedSupplier: 'ChemTech (principal)'
    },
    {
        id: 'line-2',
        lineNumber: 2,
        productId: 'MP-SOLV-03',
        productName: 'Solvant industriel',
        description: 'Solvant industriel usage peinture',
        quantity: 200,
        unit: 'L',
        unitPrice: 850,
        priceCatalog: 850,
        discountRate: 0,
        lineType: 'CATALOG',
        stock: { status: 'warning', label: 'Stock actuel: 150 L' },
        averageConsumption: '120 L/semaine',
        lastOrder: '20/12/2023 - 840 XAF/L',
        suggestedSupplier: 'ChemTech'
    },
    {
        id: 'line-3',
        lineNumber: 3,
        productId: 'TEXT-LINE',
        productName: 'Texte libre',
        description: 'Additif spécial XR-100',
        quantity: 50,
        unit: 'KG',
        unitPrice: 3000,
        priceCatalog: 3000,
        discountRate: 0,
        lineType: 'FREETEXT',
        stock: { status: 'ok', label: 'Article non stocké' },
        averageConsumption: 'Selon besoin',
        lastOrder: 'N/A - premier achat direct',
        suggestedSupplier: 'ChemTech (hors catalogue)'
    }
];

document.addEventListener('DOMContentLoaded', () => {
    hydrateScreen();
});

function hydrateScreen() {
    setHeroBanner();
    initializeJustificationSection();
    initializeGeneralInfo();
    initializeSelectors();
    renderSupplierCard();
    renderRequesterBlock();
    renderDeliveryBlock();
    renderPaymentBlock();
    renderFeeInputs();
    renderArticles();
    renderDocuments();
    populateNotes();
    renderBudgetValues();
    refreshWorkflowMeta();
    renderWorkflowTable();
    renderPostValidationActions();
    renderRecap();
    renderMapping();
}

function setHeroBanner() {
    const updatedAt = formatDateTime(purchaseOrder.hero.updatedAt);
    const heroStatusEl = document.getElementById('hero-status');
    const updatedAtEl = document.getElementById('hero-updated-at');
    if (heroStatusEl) {
        heroStatusEl.textContent = purchaseOrder.status === 'SUBMITTED' ? 'Soumis' : 'Brouillon';
    }
    if (updatedAtEl) {
        updatedAtEl.textContent = updatedAt;
    }
}

function initializeJustificationSection() {
    const justificationInput = document.getElementById('direct-justification');
    const urgencySelect = document.getElementById('direct-mode-urgency');
    const impactInput = document.getElementById('direct-impact');
    if (justificationInput) {
        justificationInput.value = purchaseOrder.directPurchaseJustification;
        justificationInput.addEventListener('input', (e) => {
            purchaseOrder.directPurchaseJustification = e.target.value;
            validateJustification();
            renderMapping();
        });
    }
    if (urgencySelect) {
        urgencySelect.value = purchaseOrder.urgencyLevel;
        urgencySelect.addEventListener('change', (e) => {
            purchaseOrder.urgencyLevel = e.target.value;
            refreshWorkflowMeta();
            renderRecap();
        });
    }
    if (impactInput) {
        impactInput.value = purchaseOrder.businessImpact;
        impactInput.addEventListener('input', (e) => {
            purchaseOrder.businessImpact = e.target.value;
        });
    }
    validateJustification();
}

function initializeGeneralInfo() {
    const numberInput = document.getElementById('order-number');
    const dateInput = document.getElementById('order-date');
    const fiscalInput = document.getElementById('fiscal-year');
    const prioritySelect = document.getElementById('order-priority');
    const categorySelect = document.getElementById('purchase-category');
    const categoryLabelInput = document.getElementById('category-label');
    if (numberInput) numberInput.value = purchaseOrder.orderNumber;
    if (dateInput) {
        dateInput.value = purchaseOrder.orderDate;
        dateInput.addEventListener('change', (e) => {
            purchaseOrder.orderDate = e.target.value;
            renderMapping();
        });
    }
    if (fiscalInput) {
        fiscalInput.value = purchaseOrder.fiscalYear;
        fiscalInput.addEventListener('input', (e) => {
            purchaseOrder.fiscalYear = Number(e.target.value) || purchaseOrder.fiscalYear;
            renderMapping();
        });
    }
    if (prioritySelect) {
        prioritySelect.value = purchaseOrder.priority;
        prioritySelect.addEventListener('change', (e) => {
            purchaseOrder.priority = e.target.value;
            renderRecap();
            renderMapping();
        });
    }
    if (categorySelect) {
        categorySelect.value = purchaseOrder.purchaseCategory;
        categorySelect.addEventListener('change', (e) => {
            purchaseOrder.purchaseCategory = e.target.value;
            renderMapping();
        });
    }
    if (categoryLabelInput) {
        categoryLabelInput.value = purchaseOrder.categoryLabel;
        categoryLabelInput.addEventListener('input', (e) => {
            purchaseOrder.categoryLabel = e.target.value;
        });
    }
    bindOrderTypePills();
}

function initializeSelectors() {
    populateSelect('originator-select', referenceData.originators.map((o) => ({ id: o.id, label: `${o.name} - ${o.title}` })), purchaseOrder.requester.originatorId);
    const originatorSelect = document.getElementById('originator-select');
    if (originatorSelect) {
        originatorSelect.addEventListener('change', (e) => {
            purchaseOrder.requester.originatorId = e.target.value;
            const selected = referenceData.originators.find((o) => o.id === e.target.value);
            if (selected) {
                purchaseOrder.requester.originatorName = selected.name;
                purchaseOrder.requester.originatorRole = selected.title;
                purchaseOrder.requester.department = selected.department;
                document.getElementById('originator-department').value = selected.department;
                renderWorkflowTable();
                renderMapping();
            }
        });
        const originator = referenceData.originators.find((o) => o.id === purchaseOrder.requester.originatorId);
        if (originator) {
            const deptInput = document.getElementById('originator-department');
            if (deptInput) deptInput.value = originator.department;
        }
    }

    populateSelect('buying-company', referenceData.companies, purchaseOrder.requester.buyingCompanyId);
    const buyingCompanySelect = document.getElementById('buying-company');
    if (buyingCompanySelect) {
        buyingCompanySelect.addEventListener('change', (e) => {
            purchaseOrder.requester.buyingCompanyId = e.target.value;
            renderMapping();
        });
    }

    populateSelect('cost-center', referenceData.costCenters, purchaseOrder.requester.costCenterId);
    const costCenterSelect = document.getElementById('cost-center');
    if (costCenterSelect) {
        costCenterSelect.addEventListener('change', (e) => {
            purchaseOrder.requester.costCenterId = e.target.value;
            renderMapping();
        });
    }

    populateSelect('budget-line', referenceData.budgetLines, purchaseOrder.budget.lineId);
    const budgetLineSelect = document.getElementById('budget-line');
    if (budgetLineSelect) {
        budgetLineSelect.addEventListener('change', (e) => {
            purchaseOrder.budget.lineId = e.target.value;
            renderMapping();
        });
    }
}

function renderSupplierCard() {
    const { supplier } = purchaseOrder;
    setInputValue('supplier-code', supplier.code);
    setInputValue('supplier-type', supplier.type === 'EXTERNAL' ? 'Externe' : 'Société du groupe');
    const supplierName = document.getElementById('supplier-name');
    if (supplierName) supplierName.textContent = supplier.name;
    const typePill = document.getElementById('supplier-type-pill');
    if (typePill) {
        typePill.textContent = supplier.type === 'EXTERNAL' ? 'Externe' : 'Groupe';
        typePill.className = `status-pill ${supplier.type === 'EXTERNAL' ? 'pill-success' : 'pill-warning'}`;
    }
    const niu = document.getElementById('supplier-niu');
    if (niu) {
        niu.textContent = `NIU: ${supplier.niu.value} - ${supplier.niu.status === 'VALID' ? 'Valide' : 'À vérifier'}`;
        niu.className = `status-pill ${supplier.niu.status === 'VALID' ? 'pill-success' : 'pill-danger'}`;
    }
    const cert = document.getElementById('supplier-certificate');
    if (cert) {
        cert.textContent = `Certificat non-redevance: ${supplier.certificate.status === 'VALID' ? 'Valide' : 'Expiré'} (jusqu'au ${formatDate(supplier.certificate.expiry)})`;
        cert.className = `status-pill ${supplier.certificate.status === 'VALID' ? 'pill-success' : 'pill-danger'}`;
    }
    setTextContent('supplier-address', supplier.address);
    setTextContent('supplier-contact', `${supplier.contact.name} - ${supplier.contact.phone}`);
    setTextContent('supplier-email', supplier.contact.email);
    const conditionsList = document.getElementById('supplier-conditions');
    if (conditionsList) {
        conditionsList.innerHTML = supplier.conditions.map((item) => `<li>${item}</li>`).join('');
    }
}

function renderRequesterBlock() {
    setInputValue('buyer-name', purchaseOrder.requester.buyerName);
    const projectInput = document.getElementById('project-code');
    if (projectInput) {
        projectInput.value = purchaseOrder.requester.projectCode || '';
        projectInput.addEventListener('input', (e) => {
            purchaseOrder.requester.projectCode = e.target.value;
        });
    }
}

function renderDeliveryBlock() {
    const deliveryDateInput = document.getElementById('delivery-date');
    if (deliveryDateInput) {
        deliveryDateInput.value = purchaseOrder.delivery.requestedDate;
        deliveryDateInput.addEventListener('change', (e) => {
            purchaseOrder.delivery.requestedDate = e.target.value;
            renderRecap();
            renderMapping();
        });
    }
    setInputValue('delivery-leadtime', purchaseOrder.delivery.leadTime);

    populateSelect('delivery-location', referenceData.deliveryLocations, purchaseOrder.delivery.locationId);
    const locationSelect = document.getElementById('delivery-location');
    const addressTextarea = document.getElementById('delivery-address');
    const contactInput = document.getElementById('delivery-contact');
    if (addressTextarea) {
        addressTextarea.value = purchaseOrder.delivery.fullAddress || '';
        addressTextarea.addEventListener('input', (e) => {
            purchaseOrder.delivery.fullAddress = e.target.value;
        });
    }
    if (contactInput) {
        contactInput.value = purchaseOrder.delivery.contact || '';
        contactInput.addEventListener('input', (e) => {
            purchaseOrder.delivery.contact = e.target.value;
        });
    }
    if (locationSelect) {
        locationSelect.addEventListener('change', (e) => {
            purchaseOrder.delivery.locationId = e.target.value;
            const selected = referenceData.deliveryLocations.find((loc) => loc.id === e.target.value);
            if (selected) {
                purchaseOrder.delivery.fullAddress = selected.address;
                purchaseOrder.delivery.contact = selected.contact;
                if (addressTextarea) addressTextarea.value = selected.address;
                if (contactInput) contactInput.value = selected.contact;
                renderRecap();
                renderMapping();
            }
        });
    }
    if (addressTextarea && !addressTextarea.value) {
        addressTextarea.value = purchaseOrder.delivery.fullAddress || '';
    }
    if (contactInput && !contactInput.value) {
        contactInput.value = purchaseOrder.delivery.contact || '';
    }

    populateSelect('delivery-incoterm', referenceData.incoterms, purchaseOrder.delivery.incoterm);
    const incotermSelect = document.getElementById('delivery-incoterm');
    if (incotermSelect) {
        incotermSelect.addEventListener('change', (e) => {
            purchaseOrder.delivery.incoterm = e.target.value;
            renderMapping();
        });
    }

    populateSelect('transport-mode', referenceData.transportResponsibilities, purchaseOrder.delivery.transportResponsibility);
    const transportSelect = document.getElementById('transport-mode');
    if (transportSelect) {
        transportSelect.addEventListener('change', (e) => {
            purchaseOrder.delivery.transportResponsibility = e.target.value;
            renderMapping();
        });
    }

    populateSelect('carrier-select', referenceData.carriers, purchaseOrder.delivery.carrierId);
    const carrierSelect = document.getElementById('carrier-select');
    if (carrierSelect) {
        carrierSelect.addEventListener('change', (e) => {
            purchaseOrder.delivery.carrierId = e.target.value;
        });
    }
}

function renderPaymentBlock() {
    populateSelect('payment-terms', referenceData.paymentTerms, purchaseOrder.payment.termsId);
    populateSelect('payment-mode', referenceData.paymentModes, purchaseOrder.payment.modeId);
    const termsSelect = document.getElementById('payment-terms');
    if (termsSelect) {
        termsSelect.addEventListener('change', (e) => {
            purchaseOrder.payment.termsId = e.target.value;
            renderMapping();
        });
    }
    const modeSelect = document.getElementById('payment-mode');
    if (modeSelect) {
        modeSelect.addEventListener('change', (e) => {
            purchaseOrder.payment.modeId = e.target.value;
            renderMapping();
        });
    }
    const currencySelect = document.getElementById('currency-select');
    if (currencySelect) {
        currencySelect.value = purchaseOrder.payment.currency;
        currencySelect.addEventListener('change', (e) => {
            purchaseOrder.payment.currency = e.target.value;
            renderMapping();
        });
    }
    const exchangeInput = document.getElementById('exchange-rate');
    if (exchangeInput) {
        exchangeInput.value = purchaseOrder.payment.exchangeRate;
        exchangeInput.addEventListener('input', (e) => {
            purchaseOrder.payment.exchangeRate = parseFloat(e.target.value) || 1;
        });
    }
    const earlyCheckbox = document.getElementById('early-payment-checkbox');
    if (earlyCheckbox) {
        earlyCheckbox.checked = purchaseOrder.payment.earlyPaymentDiscount.enabled;
        earlyCheckbox.addEventListener('change', (e) => {
            purchaseOrder.payment.earlyPaymentDiscount.enabled = e.target.checked;
            updateFinancials();
        });
    }
}

function renderFeeInputs() {
    ['transport', 'insurance', 'customs', 'handling', 'other'].forEach((feeKey) => {
        const input = document.getElementById(`fee-${feeKey}`);
        if (input) {
            input.value = purchaseOrder.fees[feeKey];
            input.addEventListener('input', (e) => {
                purchaseOrder.fees[feeKey] = parseFloat(e.target.value) || 0;
                updateFinancials();
            });
        }
    });
    const otherLabelInput = document.getElementById('fee-other-label');
    if (otherLabelInput) {
        otherLabelInput.value = purchaseOrder.fees.otherLabel;
        otherLabelInput.addEventListener('input', (e) => {
            purchaseOrder.fees.otherLabel = e.target.value;
        });
    }
}

function renderArticles() {
    const tbody = document.getElementById('articles-body');
    if (!tbody) return;
    tbody.innerHTML = purchaseOrder.lines.map((line, index) => renderArticleRow(line, index)).join('');
    const countLabel = document.getElementById('articles-count');
    if (countLabel) {
        countLabel.textContent = `${purchaseOrder.lines.length} ${purchaseOrder.lines.length > 1 ? 'lignes' : 'ligne'}`;
    }
    updateFinancials();
}

function renderArticleRow(line, index) {
    const catalogOptions = referenceData.catalogItems
        .map((item) => `<option value="${item.id}" ${item.id === line.productId ? 'selected' : ''}>${item.label}</option>`)
        .join('');
    const unitOptions = referenceData.units
        .map((unit) => `<option value="${unit}" ${unit === line.unit ? 'selected' : ''}>${unit}</option>`)
        .join('');
    const subtotal = line.quantity * line.unitPrice;
    const discountValue = Math.max(0, (line.priceCatalog - line.unitPrice) * line.quantity);
    return `
        <tr>
            <td style="font-weight:600; color:#374151;">${index + 1}</td>
            <td>
                <select class="article-name-select" onchange="updateLineField(${index}, 'productId', this.value)">
                    <option value="">Sélectionner...</option>
                    ${catalogOptions}
                </select>
                <div style="margin-top:8px; display:flex; gap:8px; flex-wrap:wrap;">
                    <button type="button" class="radio-pill ${line.lineType === 'CATALOG' ? 'active' : ''}" onclick="switchLineType(${index}, 'CATALOG')">Article catalogue</button>
                    <button type="button" class="radio-pill ${line.lineType === 'FREETEXT' ? 'active' : ''}" onclick="switchLineType(${index}, 'FREETEXT')">Texte libre</button>
                </div>
                <div class="article-meta">
                    <span><i class="fa-solid fa-handshake-simple"></i> ${line.suggestedSupplier}</span>
                    <span class="stock-indicator"><span class="stock-dot ${line.stock.status}"></span>${line.stock.label}</span>
                </div>
            </td>
            <td>
                <textarea class="article-input" rows="2" onchange="updateLineField(${index}, 'description', this.value)">${line.description || ''}</textarea>
                <div class="article-meta">
                    <span>Prix catalogue: ${formatCurrency(line.priceCatalog)}</span>
                    <span>Prix négocié: ${formatCurrency(line.unitPrice)} (${line.discountRate || 0}% )</span>
                </div>
            </td>
            <td><input type="number" class="article-input" min="0" step="0.01" value="${line.quantity}" oninput="updateLineField(${index}, 'quantity', this.value)"></td>
            <td>
                <select class="article-input" onchange="updateLineField(${index}, 'unit', this.value)">
                    ${unitOptions}
                </select>
            </td>
            <td><input type="number" class="article-input" min="0" step="0.01" value="${line.unitPrice}" oninput="updateLineField(${index}, 'unitPrice', this.value)"></td>
            <td><input type="number" class="article-input" min="0" step="0.01" value="${line.discountRate}" oninput="updateLineField(${index}, 'discountRate', this.value)"></td>
            <td style="font-weight:600; color:#111827;">${formatCurrency(subtotal)}</td>
            <td>
                <button type="button" style="border:none; background:#FEE2E2; color:#B91C1C; padding:6px 10px; border-radius:8px;" onclick="removeArticleLine(${index})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
        <tr>
            <td colspan="9">
                <div class="article-meta">
                    <span>Consommation moy.: ${line.averageConsumption}</span>
                    <span>Dernière commande: ${line.lastOrder}</span>
                    <span>Sous-total HT: ${formatCurrency(subtotal)}</span>
                    <span>Remise calculée: ${formatCurrency(discountValue)}</span>
                </div>
            </td>
        </tr>
    `;
}

function updateLineField(index, field, rawValue) {
    const line = purchaseOrder.lines[index];
    if (!line) return;
    let value = rawValue;
    if (['quantity', 'unitPrice', 'priceCatalog', 'discountRate'].includes(field)) {
        value = parseFloat(rawValue) || 0;
    }
    line[field] = value;
    if (field === 'productId') {
        const catalogItem = referenceData.catalogItems.find((item) => item.id === value);
        if (catalogItem && line.lineType === 'CATALOG') {
            line.productName = catalogItem.label;
            line.description = catalogItem.description;
            line.unit = catalogItem.unit;
        }
        renderArticles();
    } else if (field === 'lineType') {
        renderArticles();
    } else {
        updateFinancials();
    }
}

function switchLineType(index, type) {
    const line = purchaseOrder.lines[index];
    if (!line) return;
    line.lineType = type;
    if (type === 'FREETEXT') {
        line.productId = 'TEXT-LINE';
        line.productName = 'Texte libre';
    }
    renderArticles();
}

function handleAddArticleLine() {
    const newLine = {
        id: `line-${Date.now()}`,
        lineNumber: purchaseOrder.lines.length + 1,
        productId: '',
        productName: '',
        description: '',
        quantity: 0,
        unit: 'L',
        unitPrice: 0,
        priceCatalog: 0,
        discountRate: 0,
        lineType: 'CATALOG',
        stock: { status: 'ok', label: 'Stock inconnu' },
        averageConsumption: 'N/A',
        lastOrder: 'N/A',
        suggestedSupplier: purchaseOrder.supplier.name
    };
    purchaseOrder.lines.push(newLine);
    renderArticles();
}

function handleImportCatalog() {
    const availableItem = referenceData.catalogItems.find(
        (item) => !purchaseOrder.lines.some((line) => line.productId === item.id)
    );
    if (!availableItem) {
        alert('Tous les articles du catalogue de démonstration sont déjà ajoutés.');
        return;
    }
    purchaseOrder.lines.push({
        id: `line-${Date.now()}`,
        lineNumber: purchaseOrder.lines.length + 1,
        productId: availableItem.id,
        productName: availableItem.label,
        description: availableItem.description,
        quantity: 1,
        unit: availableItem.unit,
        unitPrice: 1000,
        priceCatalog: 1000,
        discountRate: 0,
        lineType: 'CATALOG',
        stock: { status: 'ok', label: 'Stock à vérifier' },
        averageConsumption: 'N/A',
        lastOrder: 'N/A',
        suggestedSupplier: purchaseOrder.supplier.name
    });
    renderArticles();
}

function handleCopyRequisition() {
    alert('Copie depuis une DA non disponible dans cette démo. Simulez une intégration API purchase_requisitions ici.');
}

function removeArticleLine(index) {
    if (purchaseOrder.lines.length === 1) {
        alert('Au moins une ligne doit rester.');
        return;
    }
    purchaseOrder.lines.splice(index, 1);
    purchaseOrder.lines.forEach((line, idx) => {
        line.lineNumber = idx + 1;
    });
    renderArticles();
}

function updateFinancials() {
    const totals = calculateTotals();
    setTextContent('articles-total-ht', formatCurrency(totals.articleHT));
    setTextContent('total-articles-label', formatCurrency(totals.articleHT));
    setTextContent('total-vat-label', formatCurrency(totals.taxAmount));
    setTextContent('total-ttc-label', formatCurrency(totals.totalTTC));
    setTextContent('total-discount-label', formatCurrency(totals.discountTotal));
    setTextContent('base-articles', formatCurrency(totals.articleHT));
    setTextContent('base-fees', formatCurrency(totals.feesHT));
    setTextContent('total-ht', formatCurrency(totals.totalHT));
    setTextContent('total-tva', formatCurrency(totals.taxAmount));
    setTextContent('total-ttc', formatCurrency(totals.totalTTC));
    setTextContent('amount-in-words', numberToWordsFr(Math.round(totals.totalTTC)) + ' francs CFA');

    purchaseOrder.workflow.amountTTC = totals.totalTTC;
    purchaseOrder.budget.thisOrder = totals.articleHT;
    const availableBefore = purchaseOrder.budget.allocated - purchaseOrder.budget.consumed - purchaseOrder.budget.committed;
    purchaseOrder.budget.available = availableBefore;
    purchaseOrder.budget.remaining = availableBefore - purchaseOrder.budget.thisOrder;

    const earlyPaymentBase = totals.articleHT;
    const earlyPaymentValue = purchaseOrder.payment.earlyPaymentDiscount.enabled
        ? (purchaseOrder.payment.earlyPaymentDiscount.rate / 100) * earlyPaymentBase
        : 0;
    setTextContent('early-payment-value', formatCurrency(earlyPaymentValue));

    renderBudgetValues();
    refreshWorkflowMeta();
    renderRecap();
    renderMapping();
}

function calculateTotals() {
    const articleHT = purchaseOrder.lines.reduce((sum, line) => sum + (line.quantity * line.unitPrice || 0), 0);
    const discountTotal = purchaseOrder.lines.reduce(
        (sum, line) => sum + Math.max(0, (line.priceCatalog - line.unitPrice) * line.quantity),
        0
    );
    const feesHT = purchaseOrder.fees.transport + purchaseOrder.fees.insurance + purchaseOrder.fees.customs +
        purchaseOrder.fees.handling + purchaseOrder.fees.other;
    const totalHT = articleHT + feesHT;
    const taxAmount = totalHT * (TAX_RATE / 100);
    const totalTTC = totalHT + taxAmount;
    return { articleHT, discountTotal, feesHT, totalHT, taxAmount, totalTTC };
}

function renderBudgetValues() {
    setTextContent('budget-allocated', formatCurrency(purchaseOrder.budget.allocated));
    setTextContent('budget-consumed', formatCurrency(purchaseOrder.budget.consumed));
    setTextContent('budget-committed', formatCurrency(purchaseOrder.budget.committed));
    setTextContent('budget-available', formatCurrency(purchaseOrder.budget.available || 0));
    setTextContent('budget-this-order', formatCurrency(purchaseOrder.budget.thisOrder || 0));
    setTextContent('budget-remaining', formatCurrency(purchaseOrder.budget.remaining || 0));
    setInputValue('budget-year', purchaseOrder.budget.year);
    setInputValue('budget-period', purchaseOrder.budget.period);

    const progress = Math.min(
        100,
        ((purchaseOrder.budget.consumed + purchaseOrder.budget.committed + (purchaseOrder.budget.thisOrder || 0)) /
            purchaseOrder.budget.allocated) * 100
    );
    const bar = document.getElementById('budget-progress-bar');
    if (bar) {
        bar.style.width = `${progress}%`;
    }
    const status = document.getElementById('budget-status');
    if (status) {
        status.textContent = purchaseOrder.budget.remaining >= 0 ? 'Budget disponible' : 'Budget insuffisant';
        status.className = `status-chip ${purchaseOrder.budget.remaining >= 0 ? 'pending' : 'pill-danger'}`;
    }
}

function renderDocuments() {
    const container = document.getElementById('documents-required');
    if (!container) return;
    container.innerHTML = purchaseOrder.documentsRequired
        .map((doc, index) => {
            const statusClass = doc.status === 'uploaded' ? 'pill-success' : doc.required ? 'pill-danger' : 'pill-warning';
            const statusLabel = doc.status === 'uploaded' ? 'Ajouté' : doc.required ? 'Obligatoire' : 'Optionnel';
            return `
                <div class="document-item">
                    <div>
                        <input type="checkbox" ${doc.status === 'uploaded' ? 'checked' : ''} onchange="toggleDocument(${index}, this.checked)">
                        <strong>${doc.label}${doc.required ? ' *' : ''}</strong>
                        <span class="status-pill ${statusClass}" style="margin-left:8px;">${statusLabel}</span>
                        ${doc.fileName ? `<span style="margin-left:12px;">📎 ${doc.fileName}</span>` : ''}
                    </div>
                    <div class="document-actions">
                        ${doc.fileName ? `<button type="button" onclick="previewDocument(${index})"><i class="fa-solid fa-eye"></i></button>` : ''}
                        <button type="button" onclick="uploadDocument(${index})"><i class="fa-solid fa-paperclip"></i></button>
                        ${doc.fileName ? `<button type="button" onclick="deleteDocument(${index})"><i class="fa-solid fa-trash"></i></button>` : ''}
                    </div>
                </div>
            `;
        })
        .join('');
}

function toggleDocument(index, checked) {
    const doc = purchaseOrder.documentsRequired[index];
    if (!doc) return;
    doc.status = checked ? 'uploaded' : doc.required ? 'missing' : 'optional';
    if (!checked) {
        doc.fileName = null;
    }
    renderDocuments();
}

function uploadDocument(index) {
    const doc = purchaseOrder.documentsRequired[index];
    if (!doc) return;
    doc.status = 'uploaded';
    if (!doc.fileName) {
        doc.fileName = `${doc.type}_${purchaseOrder.orderNumber}.pdf`;
    }
    renderDocuments();
}

function previewDocument(index) {
    const doc = purchaseOrder.documentsRequired[index];
    if (!doc || !doc.fileName) {
        alert('Aucun fichier à pré-visualiser.');
        return;
    }
    alert(`Prévisualisation de ${doc.fileName} (simulation).`);
}

function deleteDocument(index) {
    const doc = purchaseOrder.documentsRequired[index];
    if (!doc) return;
    doc.fileName = null;
    doc.status = doc.required ? 'missing' : 'optional';
    renderDocuments();
}

function populateNotes() {
    const supplierNotes = document.getElementById('supplier-notes');
    if (supplierNotes) {
        supplierNotes.value = purchaseOrder.notes.supplier;
        supplierNotes.addEventListener('input', (e) => {
            purchaseOrder.notes.supplier = e.target.value;
        });
    }
    const internalNotes = document.getElementById('internal-notes');
    if (internalNotes) {
        internalNotes.value = purchaseOrder.notes.internal;
        internalNotes.addEventListener('input', (e) => {
            purchaseOrder.notes.internal = e.target.value;
        });
    }
}

function refreshWorkflowMeta() {
    setTextContent('workflow-amount', formatCurrency(purchaseOrder.workflow.amountTTC));
    const slaLabel = document.getElementById('workflow-sla');
    if (slaLabel) {
        if (purchaseOrder.urgencyLevel === 'CRITIQUE') {
            slaLabel.textContent = 'Mode urgence activé: délai réduit à 4h ⚡';
            slaLabel.className = 'status-pill pill-danger';
        } else {
            slaLabel.textContent = 'Délai validation standard: 48h';
            slaLabel.className = 'status-pill pill-warning';
        }
    }
    const directFlag = document.getElementById('workflow-direct-flag');
    if (directFlag) {
        directFlag.style.display = purchaseOrder.directPurchaseJustification ? 'inline-flex' : 'none';
    }
}

function renderWorkflowTable() {
    const table = document.getElementById('workflow-steps');
    if (!table) return;
    const rows = purchaseOrder.workflow.steps
        .map((step) => {
            const chipClass = step.status === 'PENDING' ? 'pending' : step.status === 'APPROVED' ? 'pill-success' : 'pill-warning';
            const statusLabel = step.status === 'PENDING' ? '⏳ Attente' : step.status === 'APPROVED' ? '✅ Validé' : step.status;
            return `
                <tr>
                    <td>${step.stepNumber}</td>
                    <td>${step.name}</td>
                    <td>${step.role}</td>
                    <td>
                        <span class="status-chip ${chipClass}">${statusLabel}</span>
                        ${step.condition ? `<div style="font-size:11px; color:#6B7280;">${step.condition}</div>` : ''}
                    </td>
                </tr>
            `;
        })
        .join('');
    table.innerHTML = `
        <thead>
            <tr>
                <th>Étape</th>
                <th>Validateur</th>
                <th>Rôle</th>
                <th>Statut</th>
            </tr>
        </thead>
        <tbody>${rows}</tbody>
    `;
}

function renderPostValidationActions() {
    const list = document.getElementById('post-validation-actions');
    if (!list) return;
    list.innerHTML = purchaseOrder.actionsAfterValidation
        .map((action) => `<li>${action}</li>`)
        .join('');
}

function renderRecap() {
    setTextContent('recap-type', 'BCF Direct (sans DA)');
    setTextContent('recap-supplier', `${purchaseOrder.supplier.name} (${purchaseOrder.supplier.id})`);
    const location = referenceData.deliveryLocations.find((loc) => loc.id === purchaseOrder.delivery.locationId);
    setTextContent('recap-delivery', `${formatDate(purchaseOrder.delivery.requestedDate)} - ${location ? location.label : ''}`);
    setTextContent('recap-budget', `Solde après: ${formatCurrency(purchaseOrder.budget.remaining || 0)}`);
    setTextContent('recap-total', formatCurrency(purchaseOrder.workflow.amountTTC));
    const warningsList = document.getElementById('recap-warnings');
    if (warningsList) {
        warningsList.innerHTML = purchaseOrder.warnings.map((warning) => `<li>${warning}</li>`).join('');
    }
}

function renderMapping() {
    const mapping = buildPurchaseOrderPayload();
    const pre = document.getElementById('mapping-json');
    if (pre) {
        pre.textContent = JSON.stringify(mapping, null, 2);
    }
}

function buildPurchaseOrderPayload() {
    const totals = calculateTotals();
    return {
        id: purchaseOrder.id,
        orderNumber: purchaseOrder.orderNumber,
        orderType: purchaseOrder.orderType,
        orderDate: purchaseOrder.orderDate,
        fiscalYear: purchaseOrder.fiscalYear,
        purchaseCategory: purchaseOrder.purchaseCategory,
        priority: purchaseOrder.priority,
        supplierId: purchaseOrder.supplier.id,
        supplierName: purchaseOrder.supplier.name,
        supplierType: purchaseOrder.supplier.type,
        buyingCompanyId: purchaseOrder.requester.buyingCompanyId,
        buyerId: purchaseOrder.requester.buyerId,
        requisitionIds: [],
        needOriginatorId: purchaseOrder.requester.originatorId,
        needOriginatorName: purchaseOrder.requester.originatorName,
        directPurchaseJustification: purchaseOrder.directPurchaseJustification,
        taxRegime: purchaseOrder.payment.taxRegime,
        nonLiabilityCertificate: {
            certificateNumber: purchaseOrder.supplier.certificate.number,
            expiryDate: purchaseOrder.supplier.certificate.expiry,
            status: purchaseOrder.supplier.certificate.status
        },
        requestedDeliveryDate: purchaseOrder.delivery.requestedDate,
        deliveryLocationId: purchaseOrder.delivery.locationId,
        deliveryAddress: {
            street: purchaseOrder.delivery.address.street,
            city: purchaseOrder.delivery.address.city,
            country: 'CM'
        },
        incoterms: purchaseOrder.delivery.incoterm,
        transportMode: purchaseOrder.delivery.transportMode,
        paymentTerms: {
            id: purchaseOrder.payment.termsId,
            days: referenceData.paymentTerms.find((term) => term.id === purchaseOrder.payment.termsId)?.days || 0,
            earlyPaymentDiscount: purchaseOrder.payment.earlyPaymentDiscount.enabled
                ? purchaseOrder.payment.earlyPaymentDiscount
                : null
        },
        paymentMode: purchaseOrder.payment.modeId,
        currency: purchaseOrder.payment.currency,
        totalAmountHT: totals.totalHT,
        totalTaxAmount: totals.taxAmount,
        totalAmountTTC: totals.totalTTC,
        lines: purchaseOrder.lines.map((line, idx) => ({
            lineNumber: idx + 1,
            productId: line.productId,
            productCode: line.productId,
            productName: line.description,
            quantity: line.quantity,
            unit: line.unit,
            unitPrice: line.unitPrice,
            discount: line.discountRate,
            totalHT: line.quantity * line.unitPrice,
            requisitionLineRef: null,
            suggestedSupplierId: purchaseOrder.supplier.id
        })),
        budgetLineId: purchaseOrder.budget.lineId,
        budgetCheckResult: {
            available: purchaseOrder.budget.remaining >= 0,
            budgeted: purchaseOrder.budget.allocated,
            consumed: purchaseOrder.budget.consumed,
            committed: purchaseOrder.budget.committed,
            thisOrder: purchaseOrder.budget.thisOrder,
            remaining: purchaseOrder.budget.remaining
        },
        attachments: purchaseOrder.documentsRequired
            .filter((doc) => doc.status === 'uploaded')
            .map((doc) => ({
                type: doc.type,
                fileName: doc.fileName,
                required: doc.required,
                uploadedAt: purchaseOrder.hero.updatedAt
            })),
        approvalWorkflow: {
            reason: purchaseOrder.workflow.reason,
            steps: purchaseOrder.workflow.steps
        },
        status: purchaseOrder.status,
        createdBy: purchaseOrder.requester.buyerName,
        createdAt: purchaseOrder.hero.updatedAt
    };
}

function handleSaveDraft() {
    purchaseOrder.status = 'DRAFT';
    purchaseOrder.hero.updatedAt = new Date().toISOString();
    setHeroBanner();
    alert('Brouillon enregistré avec les dernières données.');
}

function handleSubmitValidation() {
    const errors = [];
    if (!purchaseOrder.directPurchaseJustification.trim()) {
        errors.push('Justification obligatoire manquante.');
    }
    const missingDocs = purchaseOrder.documentsRequired.filter((doc) => doc.required && doc.status !== 'uploaded');
    if (missingDocs.length) {
        errors.push(`Documents requis manquants: ${missingDocs.map((doc) => doc.label).join(', ')}`);
    }
    if (!purchaseOrder.lines.length) {
        errors.push('Ajouter au moins une ligne article.');
    }
    if (errors.length) {
        alert(`Impossible de soumettre:\n- ${errors.join('\n- ')}`);
        return;
    }
    purchaseOrder.status = 'SUBMITTED';
    purchaseOrder.hero.updatedAt = new Date().toISOString();
    purchaseOrder.workflow.steps[0].status = 'PENDING';
    purchaseOrder.workflow.steps[1].status = 'PENDING';
    purchaseOrder.workflow.steps[2].status = 'PENDING';
    setHeroBanner();
    renderWorkflowTable();
    alert('BCF soumis au circuit de validation (manager requis car > 2M XAF).');
}

function handleCancelDraft() {
    if (confirm('Annuler et réinitialiser les données ?')) {
        window.location.href = './commandes-list.html';
    }
}

function bindOrderTypePills() {
    const pills = document.querySelectorAll('#order-type-group .radio-pill');
    pills.forEach((pill) => {
        if (pill.dataset.value === purchaseOrder.orderType) {
            pill.classList.add('active');
        } else {
            pill.classList.remove('active');
        }
        pill.addEventListener('click', () => {
            pills.forEach((p) => p.classList.remove('active'));
            pill.classList.add('active');
            purchaseOrder.orderType = pill.dataset.value;
            renderMapping();
        });
    });
}

function validateJustification() {
    const helper = document.getElementById('justification-helper');
    if (!helper) return;
    if (!purchaseOrder.directPurchaseJustification.trim()) {
        helper.style.color = '#B91C1C';
        helper.textContent = 'Justification obligatoire pour toute création directe.';
    } else {
        helper.style.color = '#6B7280';
        helper.textContent = 'Requis avant soumission. Contexte rupture stock, urgence client, etc.';
    }
}

function populateSelect(selectId, options, selectedValue) {
    const select = document.getElementById(selectId);
    if (!select) return;
    select.innerHTML = options.map((option) => `<option value="${option.id}">${option.label}</option>`).join('');
    select.value = selectedValue;
}

function setInputValue(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value ?? '';
}

function setTextareaValue(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value ?? '';
}

function setTextContent(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value ?? '-';
}

function formatCurrency(value) {
    if (isNaN(value)) return '0 XAF';
    return `${Number(value).toLocaleString('fr-FR')} XAF`;
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('fr-FR');
}

function formatDateTime(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return `${d.toLocaleDateString('fr-FR')} ${d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
}

function numberToWordsFr(number) {
    if (number === 0) return 'zéro';
    const units = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize'];
    const tens = ['','dix','vingt','trente','quarante','cinquante','soixante','soixante','quatre-vingt','quatre-vingt'];

    function underHundred(n) {
        if (n < 17) return units[n];
        if (n < 20) return `dix-${units[n - 10]}`;
        if (n < 70) {
            const t = Math.floor(n / 10);
            const r = n % 10;
            if (r === 0) return tens[t];
            if (r === 1 && (t === 2 || t === 3 || t === 4 || t === 5 || t === 6)) return `${tens[t]} et un`;
            return `${tens[t]}-${units[r]}`;
        }
        if (n < 80) return `soixante-${underHundred(n - 60)}`;
        if (n < 100) {
            if (n === 80) return 'quatre-vingts';
            return `quatre-vingt-${underHundred(n - 80)}`;
        }
        return '';
    }

    function underThousand(n) {
        if (n < 100) return underHundred(n);
        const hundreds = Math.floor(n / 100);
        const remainder = n % 100;
        const hundredLabel = hundreds === 1 ? 'cent' : `${units[hundreds]} cent${remainder === 0 ? 's' : ''}`;
        if (remainder === 0) return hundredLabel;
        return `${hundredLabel} ${underHundred(remainder)}`;
    }

    let words = '';
    const million = Math.floor(number / 1000000);
    const thousand = Math.floor((number % 1000000) / 1000);
    const rest = number % 1000;
    if (million > 0) {
        words += million === 1 ? 'un million' : `${underThousand(million)} millions`;
    }
    if (thousand > 0) {
        words += words ? ' ' : '';
        words += thousand === 1 ? 'mille' : `${underThousand(thousand)} mille`;
    }
    if (rest > 0) {
        words += words ? ' ' : '';
        words += underThousand(rest);
    }
    return words;
}

window.handleAddArticleLine = handleAddArticleLine;
window.handleImportCatalog = handleImportCatalog;
window.handleCopyRequisition = handleCopyRequisition;
window.handleSaveDraft = handleSaveDraft;
window.handleSubmitValidation = handleSubmitValidation;
window.handleCancelDraft = handleCancelDraft;
window.updateLineField = updateLineField;
window.switchLineType = switchLineType;
window.removeArticleLine = removeArticleLine;
window.toggleDocument = toggleDocument;
window.previewDocument = previewDocument;
window.deleteDocument = deleteDocument;
window.uploadDocument = uploadDocument;

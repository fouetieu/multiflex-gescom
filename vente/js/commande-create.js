/**
 * MultiFlex GESCOM - Création Commande Client
 * JavaScript pour la gestion de création de commande
 */

// ============================================
// DONNÉES MOCK
// ============================================

const mockClients = [
    {
        id: 1,
        code: 'CLI-001',
        name: 'Entreprise ABC SARL',
        type: 'ENTREPRISE',
        phone: '699 123 456',
        email: 'contact@abc-sarl.cm',
        creditLimit: 5000000,
        creditUsed: 3200000,
        paymentCondition: 'CREDIT',
        paymentTerms: 'NET_30',
        addresses: [
            { id: 1, type: 'Siège social', address: '123 Avenue de la République', city: 'Douala', isDefault: true },
            { id: 2, type: 'Entrepôt', address: 'Zone Industrielle Bassa, Lot 45', city: 'Douala', isDefault: false }
        ],
        commercialId: 1
    },
    {
        id: 2,
        code: 'CLI-002',
        name: 'Quincaillerie du Centre',
        type: 'QUINCAILLERIE',
        phone: '677 888 999',
        email: 'qcentre@gmail.com',
        creditLimit: 10000000,
        creditUsed: 2500000,
        paymentCondition: 'CREDIT',
        paymentTerms: 'NET_45',
        addresses: [
            { id: 3, type: 'Magasin', address: '45 Rue du Commerce', city: 'Yaoundé', isDefault: true }
        ],
        commercialId: 1
    },
    {
        id: 3,
        code: 'CLI-003',
        name: 'Jean-Pierre Mbarga',
        type: 'PARTICULIER',
        phone: '690 555 444',
        email: 'jp.mbarga@email.com',
        creditLimit: 0,
        creditUsed: 0,
        paymentCondition: 'CASH',
        paymentTerms: null,
        addresses: [
            { id: 4, type: 'Domicile', address: '78 Quartier Bastos', city: 'Yaoundé', isDefault: true }
        ],
        commercialId: 2
    },
    {
        id: 4,
        code: 'CLI-004',
        name: 'Tech Solutions SARL',
        type: 'ENTREPRISE',
        phone: '655 777 888',
        email: 'info@techsolutions.cm',
        creditLimit: 8000000,
        creditUsed: 7800000,
        paymentCondition: 'CREDIT',
        paymentTerms: 'NET_30',
        addresses: [
            { id: 5, type: 'Bureau', address: '12 Boulevard de la Liberté', city: 'Douala', isDefault: true }
        ],
        commercialId: 1
    },
    {
        id: 5,
        code: 'CLI-005',
        name: 'Martin Fotso - Technicien',
        type: 'TECHNICIEN',
        phone: '670 222 333',
        email: 'mfotso@gmail.com',
        creditLimit: 2000000,
        creditUsed: 500000,
        paymentCondition: 'CREDIT',
        paymentTerms: 'NET_30',
        addresses: [
            { id: 6, type: 'Atelier', address: 'Carrefour Ndokoti', city: 'Douala', isDefault: true }
        ],
        commercialId: 2
    },
    {
        id: 6,
        code: 'CLI-006',
        name: 'Quincaillerie Express',
        type: 'QUINCAILLERIE',
        phone: '699 444 555',
        email: 'express@quincaillerie.cm',
        creditLimit: 15000000,
        creditUsed: 4000000,
        paymentCondition: 'CREDIT',
        paymentTerms: 'NET_60',
        addresses: [
            { id: 7, type: 'Magasin principal', address: 'Marché Central', city: 'Douala', isDefault: true },
            { id: 8, type: 'Dépôt', address: 'Pk14, Route de Bonabéri', city: 'Douala', isDefault: false }
        ],
        commercialId: 1
    }
];

const mockArticles = [
    { id: 1, ref: 'CIM-001', name: 'Ciment CIMENCAM 50kg', price: 5500, tva: 19.25, stock: 450, unit: 'Sac' },
    { id: 2, ref: 'CIM-002', name: 'Ciment DANGOTE 50kg', price: 5200, tva: 19.25, stock: 380, unit: 'Sac' },
    { id: 3, ref: 'FER-001', name: 'Fer à béton 8mm (barre 12m)', price: 3500, tva: 19.25, stock: 1200, unit: 'Barre' },
    { id: 4, ref: 'FER-002', name: 'Fer à béton 10mm (barre 12m)', price: 5200, tva: 19.25, stock: 950, unit: 'Barre' },
    { id: 5, ref: 'FER-003', name: 'Fer à béton 12mm (barre 12m)', price: 7500, tva: 19.25, stock: 720, unit: 'Barre' },
    { id: 6, ref: 'FER-004', name: 'Fer à béton 14mm (barre 12m)', price: 10200, tva: 19.25, stock: 540, unit: 'Barre' },
    { id: 7, ref: 'TOL-001', name: 'Tôle ondulée 2m - Ép. 0.25', price: 4500, tva: 19.25, stock: 850, unit: 'Feuille' },
    { id: 8, ref: 'TOL-002', name: 'Tôle ondulée 3m - Ép. 0.30', price: 7200, tva: 19.25, stock: 620, unit: 'Feuille' },
    { id: 9, ref: 'TOL-003', name: 'Tôle bac acier 2.5m', price: 12500, tva: 19.25, stock: 280, unit: 'Feuille' },
    { id: 10, ref: 'PVC-001', name: 'Tube PVC 100mm (4m)', price: 8500, tva: 19.25, stock: 320, unit: 'Tube' },
    { id: 11, ref: 'PVC-002', name: 'Tube PVC 50mm (4m)', price: 4200, tva: 19.25, stock: 450, unit: 'Tube' },
    { id: 12, ref: 'PVC-003', name: 'Coude PVC 100mm 90°', price: 1500, tva: 19.25, stock: 180, unit: 'Pièce' },
    { id: 13, ref: 'PLO-001', name: 'Robinet lavabo chromé', price: 15000, tva: 19.25, stock: 95, unit: 'Pièce' },
    { id: 14, ref: 'PLO-002', name: 'WC complet avec réservoir', price: 85000, tva: 19.25, stock: 35, unit: 'Kit' },
    { id: 15, ref: 'ELE-001', name: 'Câble électrique 2.5mm² (100m)', price: 45000, tva: 19.25, stock: 75, unit: 'Rouleau' },
    { id: 16, ref: 'ELE-002', name: 'Disjoncteur 20A', price: 8500, tva: 19.25, stock: 120, unit: 'Pièce' },
    { id: 17, ref: 'ELE-003', name: 'Tableau électrique 12 modules', price: 25000, tva: 19.25, stock: 45, unit: 'Pièce' },
    { id: 18, ref: 'SAB-001', name: 'Sable fin (camion 10m³)', price: 120000, tva: 19.25, stock: 50, unit: 'Camion' },
    { id: 19, ref: 'GRA-001', name: 'Gravier 5/15 (camion 10m³)', price: 150000, tva: 19.25, stock: 40, unit: 'Camion' },
    { id: 20, ref: 'BRI-001', name: 'Brique creuse 15x20x40', price: 350, tva: 19.25, stock: 5000, unit: 'Pièce' }
];

const mockCommercials = [
    { id: 1, name: 'Jean Dupont', initials: 'JD', team: 'Équipe Nord - Zone 1', cautionLimit: 8000000, cautionUsed: 3500000 },
    { id: 2, name: 'Marie Kouam', initials: 'MK', team: 'Équipe Sud - Zone 2', cautionLimit: 6000000, cautionUsed: 2000000 }
];

// ============================================
// ÉTAT DE L'APPLICATION
// ============================================

let state = {
    selectedClient: null,
    orderLines: [],
    deliveryMode: 'PICKUP',
    deliveryAddress: null,
    paymentMode: 'CASH',
    paymentTerms: 'NET_30',
    documents: [],
    globalDiscount: { type: 'NONE', value: 0, reason: '' },
    currentCommercial: mockCommercials[0]
};

// ============================================
// INITIALISATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initClientSearch();
    initArticleSearch();
    initDeliveryOptions();
    initPaymentOptions();
    initFileUpload();
    initFormHandlers();
    initAddressCards();
    setDefaultDate();
    updateCommercialInfo();
    updateTotals();
});

function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('orderDate').value = today;

    // Date de livraison par défaut : J+3
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    document.getElementById('deliveryDate').value = deliveryDate.toISOString().split('T')[0];
}

// ============================================
// NAVIGATION PAR ONGLETS
// ============================================

function switchTab(index) {
    // Mise à jour des boutons
    document.querySelectorAll('.tab-button').forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
    });

    // Mise à jour du contenu
    document.querySelectorAll('.tab-content').forEach((content, i) => {
        content.classList.toggle('active', i === index);
    });
}

// ============================================
// RECHERCHE CLIENT
// ============================================

function initClientSearch() {
    const searchInput = document.getElementById('clientSearch');
    const resultsContainer = document.getElementById('clientSearchResults');

    searchInput.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();

        if (query.length < 2) {
            resultsContainer.classList.remove('show');
            return;
        }

        const results = mockClients.filter(client =>
            client.name.toLowerCase().includes(query) ||
            client.code.toLowerCase().includes(query) ||
            client.phone.includes(query)
        );

        if (results.length === 0) {
            resultsContainer.innerHTML = '<div class="client-result-item"><em>Aucun client trouvé</em></div>';
        } else {
            resultsContainer.innerHTML = results.map(client => `
                <div class="client-result-item" onclick="selectClient(${client.id})">
                    <div class="client-result-info">
                        <div class="client-result-name">${client.name}</div>
                        <div class="client-result-code">${client.code} - ${client.phone}</div>
                    </div>
                    <span class="client-result-type ${client.type.toLowerCase()}">${formatClientType(client.type)}</span>
                </div>
            `).join('');
        }

        resultsContainer.classList.add('show');
    });

    // Fermer les résultats en cliquant ailleurs
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.client-search-container')) {
            resultsContainer.classList.remove('show');
        }
    });
}

function formatClientType(type) {
    const types = {
        'PARTICULIER': 'Particulier',
        'ENTREPRISE': 'Entreprise',
        'TECHNICIEN': 'Technicien',
        'QUINCAILLERIE': 'Quincaillerie'
    };
    return types[type] || type;
}

function getClientTypeClass(type) {
    return type.toLowerCase();
}

function selectClient(clientId) {
    const client = mockClients.find(c => c.id === clientId);
    if (!client) return;

    state.selectedClient = client;

    // Afficher la carte client
    const clientCard = document.getElementById('selectedClientCard');
    clientCard.style.display = 'block';

    // Remplir les informations
    document.getElementById('selectedClientName').textContent = client.name;
    document.getElementById('selectedClientCode').textContent = client.code;

    const typeBadge = document.getElementById('selectedClientType');
    typeBadge.textContent = formatClientType(client.type);
    typeBadge.className = 'client-type-badge ' + getClientTypeClass(client.type);

    document.getElementById('clientCreditLimit').textContent = formatCurrency(client.creditLimit);
    document.getElementById('clientCreditUsed').textContent = formatCurrency(client.creditUsed);

    const creditAvailable = client.creditLimit - client.creditUsed;
    const creditAvailableEl = document.getElementById('clientCreditAvailable');
    creditAvailableEl.textContent = formatCurrency(creditAvailable);

    // Colorer selon le niveau
    const usagePercent = client.creditLimit > 0 ? (client.creditUsed / client.creditLimit) * 100 : 0;
    if (usagePercent >= 100) {
        creditAvailableEl.className = 'client-meta-value danger';
    } else if (usagePercent >= 80) {
        creditAvailableEl.className = 'client-meta-value warning';
    } else {
        creditAvailableEl.className = 'client-meta-value success';
    }

    document.getElementById('clientPaymentCondition').textContent = client.paymentCondition === 'CASH' ? 'Comptant' : 'Crédit';

    // Mettre à jour les adresses
    updateAddressCards(client.addresses);

    // Vérifier le crédit
    checkCreditStatus(client);

    // Mettre à jour le mode de paiement selon le client
    if (client.paymentCondition === 'CASH') {
        document.querySelector('input[name="paymentMode"][value="CASH"]').checked = true;
        updatePaymentMode('CASH');
    }

    // Fermer les résultats
    document.getElementById('clientSearchResults').classList.remove('show');
    document.getElementById('clientSearch').value = '';

    // Activer le bouton de validation
    validateForm();
}

function changeClient() {
    state.selectedClient = null;
    document.getElementById('selectedClientCard').style.display = 'none';
    document.getElementById('creditAlert').style.display = 'none';
    document.getElementById('clientSearch').value = '';
    validateForm();
}

function checkCreditStatus(client) {
    const alertEl = document.getElementById('creditAlert');
    const creditAvailable = client.creditLimit - client.creditUsed;
    const usagePercent = client.creditLimit > 0 ? (client.creditUsed / client.creditLimit) * 100 : 0;

    if (client.creditLimit === 0) {
        // Client sans crédit
        alertEl.style.display = 'none';
        return;
    }

    let alertClass, icon, title, message;

    if (usagePercent >= 100) {
        alertClass = 'alert-danger';
        icon = 'fa-solid fa-triangle-exclamation';
        title = 'Limite de crédit atteinte';
        message = 'Ce client a atteint sa limite de crédit. Toute nouvelle commande à crédit nécessitera une validation hiérarchique.';
    } else if (usagePercent >= 80) {
        alertClass = 'alert-warning';
        icon = 'fa-solid fa-exclamation-circle';
        title = 'Crédit bientôt épuisé';
        message = `Il reste ${formatCurrency(creditAvailable)} de crédit disponible (${(100 - usagePercent).toFixed(0)}% de la limite).`;
    } else {
        alertClass = 'alert-success';
        icon = 'fa-solid fa-check-circle';
        title = 'Crédit disponible';
        message = `Ce client dispose de ${formatCurrency(creditAvailable)} de crédit disponible.`;
    }

    alertEl.className = alertClass;
    alertEl.innerHTML = `
        <i class="${icon}"></i>
        <div>
            <strong>${title}</strong><br>
            ${message}
        </div>
    `;
    alertEl.style.display = 'flex';
}

function updateAddressCards(addresses) {
    const container = document.getElementById('addressCards');

    let html = addresses.map((addr, index) => `
        <label class="address-card ${addr.isDefault ? 'selected' : ''}">
            <input type="radio" name="deliveryAddress" value="${addr.id}" ${addr.isDefault ? 'checked' : ''}>
            <div class="address-card-header">
                <span class="address-card-type">${addr.type}</span>
                ${addr.isDefault ? '<span class="address-card-default">Par défaut</span>' : ''}
            </div>
            <div class="address-card-content">
                ${addr.address}<br>
                ${addr.city}, Cameroun
            </div>
        </label>
    `).join('');

    html += `
        <div class="address-card" onclick="openNewAddressModal()" style="display: flex; align-items: center; justify-content: center; min-height: 120px;">
            <div style="text-align: center;">
                <i class="fa-solid fa-plus" style="font-size: 24px; color: #263c89; margin-bottom: 8px;"></i>
                <div style="color: #263c89; font-weight: 500; font-size: 13px;">Nouvelle adresse</div>
            </div>
        </div>
    `;

    container.innerHTML = html;

    // Réinitialiser les événements
    initAddressCards();

    // Stocker l'adresse par défaut
    const defaultAddr = addresses.find(a => a.isDefault);
    if (defaultAddr) {
        state.deliveryAddress = defaultAddr;
    }
}

function initAddressCards() {
    document.querySelectorAll('.address-card').forEach(card => {
        const radio = card.querySelector('input[type="radio"]');
        if (radio) {
            card.addEventListener('click', function() {
                document.querySelectorAll('.address-card').forEach(c => c.classList.remove('selected'));
                this.classList.add('selected');
                radio.checked = true;
            });
        }
    });
}

// ============================================
// RECHERCHE ET GESTION DES ARTICLES
// ============================================

function initArticleSearch() {
    const searchInput = document.getElementById('articleSearch');
    const resultsContainer = document.getElementById('articleSearchResults');

    searchInput.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();

        if (query.length < 2) {
            resultsContainer.classList.remove('show');
            return;
        }

        const results = mockArticles.filter(article =>
            article.ref.toLowerCase().includes(query) ||
            article.name.toLowerCase().includes(query)
        ).slice(0, 10);

        if (results.length === 0) {
            resultsContainer.innerHTML = '<div class="search-result-item"><em>Aucun article trouvé</em></div>';
        } else {
            resultsContainer.innerHTML = results.map(article => `
                <div class="search-result-item" onclick="addArticle(${article.id})">
                    <div>
                        <div style="font-weight: 600; color: #263c89;">${article.ref}</div>
                        <div style="font-size: 12px; color: #6B7280;">${article.name}</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-weight: 600; color: #059669;">${formatCurrency(article.price)}</div>
                        <div style="font-size: 11px; color: #6B7280;">Stock: ${article.stock} ${article.unit}</div>
                    </div>
                </div>
            `).join('');
        }

        resultsContainer.classList.add('show');
    });

    // Fermer les résultats en cliquant ailleurs
    document.addEventListener('click', function(e) {
        if (!e.target.closest('#articleSearch') && !e.target.closest('#articleSearchResults')) {
            resultsContainer.classList.remove('show');
        }
    });
}

function addArticle(articleId) {
    const article = mockArticles.find(a => a.id === articleId);
    if (!article) return;

    // Vérifier si l'article est déjà dans la liste
    const existingLine = state.orderLines.find(line => line.articleId === articleId);
    if (existingLine) {
        existingLine.quantity += 1;
        existingLine.totalHT = calculateLineTotal(existingLine);
    } else {
        state.orderLines.push({
            id: Date.now(),
            articleId: article.id,
            ref: article.ref,
            name: article.name,
            quantity: 1,
            unitPrice: article.price,
            discount: 0,
            tva: article.tva,
            totalHT: article.price,
            stock: article.stock,
            unit: article.unit
        });
    }

    renderArticlesTable();
    updateTotals();
    validateForm();

    // Effacer la recherche
    document.getElementById('articleSearch').value = '';
    document.getElementById('articleSearchResults').classList.remove('show');
}

function removeArticle(lineId) {
    state.orderLines = state.orderLines.filter(line => line.id !== lineId);
    renderArticlesTable();
    updateTotals();
    validateForm();
}

function updateLineQuantity(lineId, value) {
    const line = state.orderLines.find(l => l.id === lineId);
    if (!line) return;

    line.quantity = Math.max(1, parseInt(value) || 1);
    line.totalHT = calculateLineTotal(line);

    renderArticlesTable();
    updateTotals();
}

function updateLinePrice(lineId, value) {
    const line = state.orderLines.find(l => l.id === lineId);
    if (!line) return;

    line.unitPrice = Math.max(0, parseFloat(value) || 0);
    line.totalHT = calculateLineTotal(line);

    updateTotals();
}

function updateLineDiscount(lineId, value) {
    const line = state.orderLines.find(l => l.id === lineId);
    if (!line) return;

    line.discount = Math.min(100, Math.max(0, parseFloat(value) || 0));
    line.totalHT = calculateLineTotal(line);

    renderArticlesTable();
    updateTotals();
}

function calculateLineTotal(line) {
    const subtotal = line.quantity * line.unitPrice;
    const discountAmount = subtotal * (line.discount / 100);
    return subtotal - discountAmount;
}

function renderArticlesTable() {
    const tbody = document.getElementById('articlesTableBody');

    if (state.orderLines.length === 0) {
        tbody.innerHTML = `
            <tr id="emptyArticlesRow">
                <td colspan="9" style="text-align: center; padding: 40px; color: #6B7280;">
                    <i class="fa-solid fa-box-open" style="font-size: 32px; margin-bottom: 10px; display: block; color: #D1D5DB;"></i>
                    Aucun article. Utilisez la recherche ci-dessus pour ajouter des articles.
                </td>
            </tr>
        `;
        document.getElementById('articlesCount').textContent = '0';
        return;
    }

    tbody.innerHTML = state.orderLines.map((line, index) => {
        const stockWarning = line.quantity > line.stock;
        return `
            <tr>
                <td>${index + 1}</td>
                <td>
                    <strong style="color: #263c89;">${line.ref}</strong>
                </td>
                <td>
                    ${line.name}
                    ${stockWarning
                        ? `<div class="stock-warning"><i class="fa-solid fa-triangle-exclamation"></i> Stock insuffisant (${line.stock})</div>`
                        : `<div class="stock-ok">Stock: ${line.stock}</div>`}
                </td>
                <td>
                    <input type="number" value="${line.quantity}" min="1" style="text-align: center;"
                           onchange="updateLineQuantity(${line.id}, this.value)">
                </td>
                <td>
                    <input type="number" value="${line.unitPrice}" min="0" step="100" style="text-align: right;"
                           onchange="updateLinePrice(${line.id}, this.value)">
                </td>
                <td>
                    <input type="number" value="${line.discount}" min="0" max="100" step="0.5" style="text-align: center;"
                           onchange="updateLineDiscount(${line.id}, this.value)">
                </td>
                <td style="text-align: center;">${line.tva}%</td>
                <td style="text-align: right; font-weight: 600; color: #263c89;">
                    ${formatCurrency(line.totalHT)}
                </td>
                <td style="text-align: center;">
                    <button class="btn-remove-line" onclick="removeArticle(${line.id})" title="Supprimer">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    // Mettre à jour le badge
    document.getElementById('articlesCount').textContent = state.orderLines.length;
}

function openArticleCatalog() {
    alert('Catalogue des articles - Fonctionnalité à implémenter');
}

function addArticleLine() {
    // Focus sur le champ de recherche article
    document.getElementById('articleSearch').focus();
}

function pasteArticles() {
    alert('Coller articles depuis le presse-papier - Fonctionnalité à implémenter');
}

function cancelForm() {
    if (confirm('Êtes-vous sûr de vouloir annuler ? Les modifications non enregistrées seront perdues.')) {
        window.location.href = 'commandes-list.html';
    }
}

// ============================================
// CALCUL DES TOTAUX
// ============================================

function updateTotals() {
    // Sous-total HT (somme des lignes)
    const subtotalHT = state.orderLines.reduce((sum, line) => sum + line.totalHT, 0);

    // Remise globale
    let globalDiscountAmount = 0;
    if (state.globalDiscount.type === 'PERCENT') {
        globalDiscountAmount = subtotalHT * (state.globalDiscount.value / 100);
    } else if (state.globalDiscount.type === 'AMOUNT') {
        globalDiscountAmount = Math.min(state.globalDiscount.value, subtotalHT);
    }

    // Total HT après remise
    const totalHT = subtotalHT - globalDiscountAmount;

    // TVA (moyenne pondérée ou taux unique)
    const totalTVA = state.orderLines.reduce((sum, line) => {
        const lineHT = line.totalHT - (subtotalHT > 0 ? (line.totalHT * globalDiscountAmount / subtotalHT) : 0);
        return sum + (lineHT * line.tva / 100);
    }, 0);

    // Total TTC
    const totalTTC = totalHT + totalTVA;

    // Mise à jour de l'interface
    document.getElementById('subtotalHT').textContent = formatCurrency(subtotalHT);
    document.getElementById('globalDiscount').textContent = '-' + formatCurrency(globalDiscountAmount);
    document.getElementById('totalHT').textContent = formatCurrency(totalHT);
    document.getElementById('totalTVA').textContent = formatCurrency(totalTVA);
    document.getElementById('totalTTC').textContent = formatCurrency(totalTTC);

    // Toolbar total
    document.getElementById('toolbarTotalHT').textContent = formatCurrency(totalHT);

    // Mettre à jour la caution si paiement à crédit
    updateCautionInfo(totalTTC);

    return { subtotalHT, globalDiscountAmount, totalHT, totalTVA, totalTTC };
}

// ============================================
// OPTIONS DE LIVRAISON
// ============================================

function initDeliveryOptions() {
    const options = document.querySelectorAll('.delivery-option');

    options.forEach(option => {
        option.addEventListener('click', function() {
            options.forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');

            const mode = this.querySelector('input[type="radio"]').value;
            state.deliveryMode = mode;

            // Afficher/masquer la section adresse
            const addressSection = document.getElementById('deliveryAddressSection');
            if (mode === 'PICKUP') {
                addressSection.style.display = 'none';
            } else {
                addressSection.style.display = 'block';
            }
        });
    });
}

function openNewAddressModal() {
    alert('Ajout nouvelle adresse - Fonctionnalité à implémenter');
}

// ============================================
// OPTIONS DE PAIEMENT
// ============================================

function initPaymentOptions() {
    const options = document.querySelectorAll('.payment-mode');

    options.forEach(option => {
        option.addEventListener('click', function() {
            options.forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');

            const mode = this.querySelector('input[type="radio"]').value;
            updatePaymentMode(mode);
        });
    });

    // Gestion des termes de paiement
    document.getElementById('paymentTerms').addEventListener('change', function() {
        state.paymentTerms = this.value;
        calculateDueDate();
    });
}

function updatePaymentMode(mode) {
    state.paymentMode = mode;

    const creditSection = document.getElementById('creditDetailsSection');
    const cautionSection = document.getElementById('cautionSection');

    if (mode === 'CREDIT') {
        creditSection.style.display = 'block';
        cautionSection.classList.add('show');
        calculateDueDate();
        updateCautionInfo(getTotalTTC());
    } else {
        creditSection.style.display = 'none';
        cautionSection.classList.remove('show');
    }
}

function calculateDueDate() {
    const orderDate = new Date(document.getElementById('orderDate').value);
    const terms = state.paymentTerms;
    let dueDate = new Date(orderDate);

    switch (terms) {
        case 'NET_30':
            dueDate.setDate(dueDate.getDate() + 30);
            break;
        case 'NET_45':
            dueDate.setDate(dueDate.getDate() + 45);
            break;
        case 'NET_60':
            dueDate.setDate(dueDate.getDate() + 60);
            break;
        case 'NET_90':
            dueDate.setDate(dueDate.getDate() + 90);
            break;
        case 'END_OF_MONTH':
            dueDate.setMonth(dueDate.getMonth() + 1);
            dueDate.setDate(0);
            break;
        case 'END_OF_MONTH_30':
            dueDate.setMonth(dueDate.getMonth() + 1);
            dueDate.setDate(0);
            dueDate.setDate(dueDate.getDate() + 30);
            break;
    }

    document.getElementById('paymentDueDate').value = dueDate.toISOString().split('T')[0];
}

function getTotalTTC() {
    const subtotalHT = state.orderLines.reduce((sum, line) => sum + line.totalHT, 0);
    let globalDiscountAmount = 0;
    if (state.globalDiscount.type === 'PERCENT') {
        globalDiscountAmount = subtotalHT * (state.globalDiscount.value / 100);
    } else if (state.globalDiscount.type === 'AMOUNT') {
        globalDiscountAmount = Math.min(state.globalDiscount.value, subtotalHT);
    }
    const totalHT = subtotalHT - globalDiscountAmount;
    const totalTVA = state.orderLines.reduce((sum, line) => {
        const lineHT = line.totalHT - (line.totalHT * globalDiscountAmount / subtotalHT || 0);
        return sum + (lineHT * line.tva / 100);
    }, 0);
    return totalHT + totalTVA;
}

function updateCautionInfo(totalTTC) {
    if (state.paymentMode !== 'CREDIT') return;

    const commercial = state.currentCommercial;
    const cautionRequired = totalTTC * 0.7; // 70% du montant
    const cautionAvailable = commercial.cautionLimit - commercial.cautionUsed;
    const cautionDeficit = Math.max(0, cautionRequired - cautionAvailable);

    document.getElementById('cautionRequired').textContent = formatCurrency(cautionRequired);
    document.getElementById('cautionAvailable').textContent = formatCurrency(cautionAvailable);
    document.getElementById('cautionDeficit').textContent = formatCurrency(cautionDeficit);

    // Barre de progression
    const progressPercent = Math.min(100, (cautionAvailable / cautionRequired) * 100);
    document.getElementById('cautionProgressBar').style.width = progressPercent + '%';
}

// ============================================
// GESTION DES DOCUMENTS
// ============================================

function initFileUpload() {
    const fileInput = document.getElementById('fileInput');

    fileInput.addEventListener('change', function(e) {
        const files = Array.from(e.target.files);

        files.forEach(file => {
            if (file.size > 10 * 1024 * 1024) {
                alert(`Le fichier ${file.name} dépasse la limite de 10 MB`);
                return;
            }

            state.documents.push({
                id: Date.now() + Math.random(),
                name: file.name,
                size: file.size,
                type: file.type
            });
        });

        renderDocumentsList();
        fileInput.value = '';
    });
}

function renderDocumentsList() {
    const container = document.getElementById('documentsList');

    if (state.documents.length === 0) {
        container.innerHTML = '';
        document.getElementById('documentsCount').textContent = '0';
        return;
    }

    container.innerHTML = state.documents.map(doc => `
        <div class="document-item">
            <i class="fas ${getFileIcon(doc.type)}"></i>
            <div class="document-info">
                <div class="document-name">${doc.name}</div>
                <div class="document-size">${formatFileSize(doc.size)}</div>
            </div>
            <button class="document-remove" onclick="removeDocument(${doc.id})">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');

    document.getElementById('documentsCount').textContent = state.documents.length;
}

function removeDocument(docId) {
    state.documents = state.documents.filter(d => d.id !== docId);
    renderDocumentsList();
}

function getFileIcon(type) {
    if (type.includes('pdf')) return 'fa-file-pdf';
    if (type.includes('image')) return 'fa-file-image';
    if (type.includes('word') || type.includes('document')) return 'fa-file-word';
    if (type.includes('excel') || type.includes('spreadsheet')) return 'fa-file-excel';
    return 'fa-file';
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// ============================================
// GESTION DU FORMULAIRE
// ============================================

function initFormHandlers() {
    // Remise globale
    document.getElementById('globalDiscountType').addEventListener('change', function() {
        state.globalDiscount.type = this.value;
        updateTotals();
        updateFooterSummary();
    });

    document.getElementById('globalDiscountValue').addEventListener('input', function() {
        state.globalDiscount.value = parseFloat(this.value) || 0;
        updateTotals();
        updateFooterSummary();
    });

    document.getElementById('globalDiscountReason').addEventListener('change', function() {
        state.globalDiscount.reason = this.value;
    });

    // Boutons d'action
    document.getElementById('btnSaveDraft').addEventListener('click', saveDraft);
    document.getElementById('btnPreview').addEventListener('click', openPreviewModal);
    document.getElementById('btnValidate').addEventListener('click', openConfirmModal);

    // Date de commande change -> recalculer échéance
    document.getElementById('orderDate').addEventListener('change', calculateDueDate);
}

function validateForm() {
    const isValid = state.selectedClient !== null && state.orderLines.length > 0;
    document.getElementById('btnValidate').disabled = !isValid;
    return isValid;
}

function updateCommercialInfo() {
    const commercial = state.currentCommercial;
    document.getElementById('commercialAvatar').textContent = commercial.initials;
    document.getElementById('commercialName').textContent = commercial.name;
    document.getElementById('commercialTeam').textContent = commercial.team;
}

// ============================================
// ACTIONS
// ============================================

function saveDraft() {
    const orderData = collectOrderData();
    orderData.status = 'DRAFT';

    console.log('Sauvegarde brouillon:', orderData);
    alert('Brouillon enregistré avec succès !');
}

function openPreviewModal() {
    const totals = updateTotals();
    const orderData = collectOrderData();

    const previewContent = `
        <div style="padding: 20px; background: #f8f9fa; border-radius: 8px; margin-bottom: 20px;">
            <h4 style="margin: 0 0 15px 0;">Commande ${orderData.number || 'CMD-2024-XXXX'}</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div>
                    <strong>Client:</strong><br>
                    ${state.selectedClient?.name || '-'}<br>
                    ${state.selectedClient?.code || ''}
                </div>
                <div>
                    <strong>Date:</strong><br>
                    ${formatDate(orderData.orderDate)}<br>
                    <strong>Priorité:</strong> ${orderData.priority}
                </div>
            </div>
        </div>

        <h5>Articles (${state.orderLines.length})</h5>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
                <tr style="background: #e9ecef;">
                    <th style="padding: 8px; text-align: left;">Article</th>
                    <th style="padding: 8px; text-align: center;">Qté</th>
                    <th style="padding: 8px; text-align: right;">P.U. HT</th>
                    <th style="padding: 8px; text-align: right;">Total HT</th>
                </tr>
            </thead>
            <tbody>
                ${state.orderLines.map(line => `
                    <tr style="border-bottom: 1px solid #e9ecef;">
                        <td style="padding: 8px;">${line.ref} - ${line.name}</td>
                        <td style="padding: 8px; text-align: center;">${line.quantity}</td>
                        <td style="padding: 8px; text-align: right;">${formatCurrency(line.unitPrice)}</td>
                        <td style="padding: 8px; text-align: right;">${formatCurrency(line.totalHT)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <div style="display: flex; justify-content: flex-end;">
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; min-width: 250px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span>Total HT:</span>
                    <strong>${formatCurrency(totals.totalHT)}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span>TVA:</span>
                    <strong>${formatCurrency(totals.totalTVA)}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; padding-top: 8px; border-top: 2px solid #3498db; font-size: 1.1rem;">
                    <span>Total TTC:</span>
                    <strong style="color: #3498db;">${formatCurrency(totals.totalTTC)}</strong>
                </div>
            </div>
        </div>

        <div style="margin-top: 20px; padding: 15px; background: #e8f4fd; border-radius: 8px;">
            <strong>Livraison:</strong> ${getDeliveryModeLabel(state.deliveryMode)}<br>
            <strong>Paiement:</strong> ${state.paymentMode === 'CASH' ? 'Comptant' : 'À crédit - ' + state.paymentTerms}
        </div>
    `;

    document.getElementById('previewContent').innerHTML = previewContent;
    document.getElementById('previewModal').classList.add('show');
}

function closePreviewModal() {
    document.getElementById('previewModal').classList.remove('show');
}

function printPreview() {
    window.print();
}

function openConfirmModal() {
    if (!validateForm()) return;

    // Vérifier si validation hiérarchique requise
    const totalTTC = getTotalTTC();
    const needsValidation = checkIfNeedsValidation(totalTTC);

    document.getElementById('validationWarning').style.display = needsValidation ? 'flex' : 'none';
    document.getElementById('confirmModal').classList.add('show');
}

function closeConfirmModal() {
    document.getElementById('confirmModal').classList.remove('show');
}

function checkIfNeedsValidation(totalTTC) {
    if (!state.selectedClient || state.paymentMode !== 'CREDIT') return false;

    const client = state.selectedClient;
    const creditAvailable = client.creditLimit - client.creditUsed;

    // Vérifier dépassement crédit
    if (totalTTC > creditAvailable) return true;

    // Vérifier caution insuffisante
    const cautionRequired = totalTTC * 0.7;
    const cautionAvailable = state.currentCommercial.cautionLimit - state.currentCommercial.cautionUsed;
    if (cautionRequired > cautionAvailable) return true;

    return false;
}

function submitOrder() {
    const orderData = collectOrderData();
    const needsValidation = checkIfNeedsValidation(getTotalTTC());

    orderData.status = needsValidation ? 'PENDING_VALIDATION' : 'VALIDATED';

    console.log('Soumission commande:', orderData);

    closeConfirmModal();

    if (needsValidation) {
        alert('Commande créée et envoyée pour validation hiérarchique.');
    } else {
        alert('Commande validée avec succès !');
    }

    // Redirection vers la liste
    // window.location.href = 'commandes-list.html';
}

function collectOrderData() {
    return {
        number: 'CMD-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 10000)).padStart(4, '0'),
        clientId: state.selectedClient?.id,
        clientName: state.selectedClient?.name,
        orderDate: document.getElementById('orderDate').value,
        clientReference: document.getElementById('clientReference').value,
        priority: document.getElementById('orderPriority').value,
        commercialId: state.currentCommercial.id,
        lines: state.orderLines,
        globalDiscount: state.globalDiscount,
        deliveryMode: state.deliveryMode,
        deliveryAddressId: document.querySelector('input[name="deliveryAddress"]:checked')?.value,
        deliveryDate: document.getElementById('deliveryDate').value,
        deliveryTimeSlot: document.getElementById('deliveryTimeSlot').value,
        deliveryContact: document.getElementById('deliveryContact').value,
        deliveryInstructions: document.getElementById('deliveryInstructions').value,
        paymentMode: state.paymentMode,
        paymentTerms: state.paymentTerms,
        paymentDueDate: document.getElementById('paymentDueDate').value,
        paymentNotes: document.getElementById('paymentNotes').value,
        externalNotes: document.getElementById('externalNotes').value,
        internalNotes: document.getElementById('internalNotes').value,
        documents: state.documents,
        totals: updateTotals()
    };
}

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount) + ' XAF';
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function getDeliveryModeLabel(mode) {
    const labels = {
        'PICKUP': 'Retrait en magasin',
        'DELIVERY': 'Livraison',
        'THIRD_PARTY': 'Transporteur tiers'
    };
    return labels[mode] || mode;
}

function openNewClientModal() {
    alert('Création nouveau client - Fonctionnalité à implémenter');
}

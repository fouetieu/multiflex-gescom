// ================================================
// PRICELISTS-RULES.JS
// Configuration des règles de tarification avancées
// ================================================

// État global
let currentPricelist = null;
let currentArticle = null;
let tiers = [];
let bonusRules = [];
let currentTab = 'tiers';
let editingTierIndex = null;
let editingBonusIndex = null;

// ================================================
// INITIALISATION
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation des règles de tarification...');
    
    // Récupérer les paramètres depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const pricelistId = urlParams.get('pricelist');
    const articleId = urlParams.get('article');
    
    if (!pricelistId || !articleId) {
        alert('❌ Paramètres manquants');
        window.location.href = './pricelists-list.html';
        return;
    }
    
    loadData(pricelistId, articleId);
});

// ================================================
// CHARGEMENT DES DONNÉES
// ================================================

function loadData(pricelistId, articleId) {
    // Simuler le chargement depuis une API
    currentPricelist = {
        id: pricelistId,
        code: 'TARIF-QUINC-2026',
        name: 'Quincaillerie 2026'
    };
    
    currentArticle = {
        id: articleId,
        code: 'CIM-CPJ425',
        name: 'Ciment CPJ 42.5',
        packaging: 'Sac 50kg',
        purchasePrice: 186,
        basePrice: 372,
        margin: 100
    };
    
    // Charger les paliers existants (exemple)
    tiers = [
        { minQty: 10, price: 360, method: 'fixed' },
        { minQty: 50, price: 345, method: 'fixed' },
        { minQty: 100, price: 335, method: 'fixed' }
    ];
    
    // Charger les règles de bonus (exemple)
    bonusRules = [
        { minQty: 50, articleType: 'same', bonusQty: 2, label: 'Promo: 50 achetés = 2 offerts !' }
    ];
    
    updateHeader();
    renderTiers();
    renderBonusRules();
}

function updateHeader() {
    document.getElementById('pricelist-name').textContent = 
        `${currentPricelist.code} - ${currentPricelist.name}`;
    document.getElementById('pricelist-breadcrumb').textContent = currentPricelist.code;
    
    document.getElementById('article-code').textContent = 
        `${currentArticle.code} - ${currentArticle.name} - ${currentArticle.packaging}`;
    document.getElementById('purchase-price').textContent = `${currentArticle.purchasePrice} XAF`;
    document.getElementById('base-price').textContent = `${currentArticle.basePrice} XAF`;
    document.getElementById('margin').textContent = `${currentArticle.margin}%`;
}

// ================================================
// GESTION DES ONGLETS
// ================================================

function switchTab(tabName) {
    currentTab = tabName;
    
    // Mettre à jour les boutons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Mettre à jour le contenu
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`tab-${tabName}`).classList.add('active');
}

// ================================================
// PALIERS QUANTITATIFS
// ================================================

function toggleTiers() {
    const enabled = document.getElementById('enable-tiers').checked;
    const content = document.getElementById('tiers-content');
    content.style.opacity = enabled ? '1' : '0.5';
    content.style.pointerEvents = enabled ? 'auto' : 'none';
}

function renderTiers() {
    const tbody = document.getElementById('tiers-tbody');
    const emptyState = document.getElementById('tiers-empty');
    const preview = document.getElementById('tiers-preview');
    
    if (tiers.length === 0) {
        tbody.innerHTML = '';
        emptyState.style.display = 'block';
        document.getElementById('tiers-table').style.display = 'none';
        preview.style.display = 'none';
        return;
    }
    
    emptyState.style.display = 'none';
    document.getElementById('tiers-table').style.display = 'table';
    preview.style.display = 'block';
    
    // Trier par quantité min
    tiers.sort((a, b) => a.minQty - b.minQty);
    
    tbody.innerHTML = tiers.map((tier, index) => {
        const discount = ((currentArticle.basePrice - tier.price) / currentArticle.basePrice * 100).toFixed(1);
        const discountAmount = (currentArticle.basePrice - tier.price).toFixed(2);
        
        return `
            <tr>
                <td style="font-weight: 600;">${index + 1}</td>
                <td>≥ ${tier.minQty}</td>
                <td><strong>${tier.price} XAF</strong></td>
                <td style="color: #10B981; font-weight: 600;">-${discount}%</td>
                <td style="color: #10B981;">${discountAmount} XAF</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon" onclick="viewTier(${index})" title="Aperçu">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        <button class="btn-icon" onclick="editTier(${index})" title="Modifier">
                            <i class="fa-solid fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-icon-danger" onclick="deleteTier(${index})" title="Supprimer">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    renderTiersPreview();
}

function renderTiersPreview() {
    const previewBody = document.getElementById('tiers-preview-body');
    
    let ranges = [];
    
    // Créer les tranches
    for (let i = 0; i < tiers.length; i++) {
        const tier = tiers[i];
        const nextTier = tiers[i + 1];
        
        let rangeText = '';
        if (i === 0) {
            rangeText = `1-${tier.minQty - 1}`;
        }
        
        if (nextTier) {
            ranges.push({
                range: `${tier.minQty}-${nextTier.minQty - 1}`,
                price: tier.price,
                isBase: false
            });
        } else {
            ranges.push({
                range: `≥${tier.minQty}`,
                price: tier.price,
                isBase: false
            });
        }
    }
    
    // Ajouter la tranche de base si nécessaire
    if (tiers.length > 0 && tiers[0].minQty > 1) {
        ranges.unshift({
            range: `1-${tiers[0].minQty - 1}`,
            price: currentArticle.basePrice,
            isBase: true
        });
    }
    
    previewBody.innerHTML = ranges.map(range => {
        const minQty = parseInt(range.range.split('-')[0].replace('≥', ''));
        const maxQty = range.range.includes('-') ? parseInt(range.range.split('-')[1]) : minQty + 50;
        
        const minTotal = (minQty * range.price).toLocaleString();
        const maxTotal = (maxQty * range.price).toLocaleString();
        
        const savings = range.isBase ? '-' : 
            `${((minQty * (currentArticle.basePrice - range.price))).toLocaleString()}-${((maxQty * (currentArticle.basePrice - range.price))).toLocaleString()} XAF`;
        
        return `
            <tr>
                <td style="padding: 8px;">${range.range}</td>
                <td style="padding: 8px; text-align: right; font-weight: 600;">${range.price} XAF</td>
                <td style="padding: 8px; text-align: right;">${minTotal}-${maxTotal} XAF</td>
                <td style="padding: 8px; text-align: right; color: #10B981;">${savings}</td>
            </tr>
        `;
    }).join('');
}

function openTierModal(mode, index = null) {
    editingTierIndex = index;
    const modal = document.getElementById('tier-modal');
    const title = document.getElementById('tier-modal-title');
    
    if (mode === 'add') {
        title.textContent = 'Ajouter un Palier';
        document.getElementById('tier-form').reset();
        document.querySelector('input[name="tier-method"][value="fixed"]').checked = true;
    } else {
        title.textContent = 'Modifier le Palier';
        const tier = tiers[index];
        document.getElementById('tier-min-qty').value = tier.minQty;
        document.getElementById('tier-price').value = tier.price;
        document.querySelector(`input[name="tier-method"][value="${tier.method}"]`).checked = true;
    }
    
    document.getElementById('tier-article').textContent = currentArticle.code;
    document.getElementById('tier-base-price').textContent = `${currentArticle.basePrice} XAF`;
    
    modal.style.display = 'flex';
    calculateTierPreview();
}

function closeTierModal() {
    document.getElementById('tier-modal').style.display = 'none';
    editingTierIndex = null;
}

function updateTierMethod() {
    // Logique pour changer le mode de calcul si nécessaire
    calculateTierPreview();
}

function calculateTierPreview() {
    const minQty = parseFloat(document.getElementById('tier-min-qty')?.value) || 0;
    const price = parseFloat(document.getElementById('tier-price')?.value) || 0;
    const preview = document.getElementById('tier-calc-content');
    
    if (minQty === 0 || price === 0) {
        preview.innerHTML = '<div style="color: var(--gray-500);">Saisissez les valeurs pour voir l\'aperçu</div>';
        return;
    }
    
    const discount = ((currentArticle.basePrice - price) / currentArticle.basePrice * 100).toFixed(1);
    const discountAmount = (currentArticle.basePrice - price).toFixed(2);
    const exampleQty = minQty + 15;
    const exampleTotal = (exampleQty * price).toLocaleString();
    const exampleTotalBase = (exampleQty * currentArticle.basePrice).toLocaleString();
    const exampleSavings = (exampleQty * (currentArticle.basePrice - price)).toLocaleString();
    
    preview.innerHTML = `
        <div style="margin-bottom: 8px;">
            <strong>Remise par rapport au prix de base:</strong> -${discount}%
        </div>
        <div style="margin-bottom: 12px;">
            <strong>Économie par unité:</strong> ${discountAmount} XAF
        </div>
        <div style="padding-top: 12px; border-top: 1px solid #3730A3;">
            <div style="font-weight: 600; margin-bottom: 8px;">Exemple pour ${exampleQty} unités:</div>
            <div>• Prix total: ${exampleTotal} XAF (au lieu de ${exampleTotalBase} XAF)</div>
            <div>• Économie totale: ${exampleSavings} XAF</div>
        </div>
    `;
}

function saveTier() {
    const minQty = parseInt(document.getElementById('tier-min-qty').value);
    const price = parseFloat(document.getElementById('tier-price').value);
    const method = document.querySelector('input[name="tier-method"]:checked').value;
    
    // Validation
    if (!minQty || minQty < 1) {
        alert('⚠️ La quantité minimale doit être supérieure à 0');
        return;
    }
    
    if (!price || price <= 0) {
        alert('⚠️ Le prix doit être supérieur à 0');
        return;
    }
    
    if (price > currentArticle.basePrice) {
        if (!confirm('⚠️ Le prix du palier est supérieur au prix de base.\n\nContinuer quand même?')) {
            return;
        }
    }
    
    // Vérifier les doublons de quantité
    const existingIndex = tiers.findIndex((t, i) => t.minQty === minQty && i !== editingTierIndex);
    if (existingIndex !== -1) {
        alert('⚠️ Un palier existe déjà pour cette quantité');
        return;
    }
    
    const tier = { minQty, price, method };
    
    if (editingTierIndex !== null) {
        tiers[editingTierIndex] = tier;
    } else {
        tiers.push(tier);
    }
    
    renderTiers();
    closeTierModal();
    alert('✅ Palier enregistré');
}

function editTier(index) {
    openTierModal('edit', index);
}

function deleteTier(index) {
    if (confirm('Supprimer ce palier?')) {
        tiers.splice(index, 1);
        renderTiers();
        alert('✅ Palier supprimé');
    }
}

function viewTier(index) {
    const tier = tiers[index];
    const discount = ((currentArticle.basePrice - tier.price) / currentArticle.basePrice * 100).toFixed(1);
    alert(`Palier:\n\nQuantité min: ${tier.minQty}\nPrix: ${tier.price} XAF\nRemise: -${discount}%`);
}

function autoGenerateTiers() {
    const config = prompt(
        'Génération automatique de paliers\n\n' +
        'Format: quantité1:remise1,quantité2:remise2,quantité3:remise3\n' +
        'Exemple: 10:5,50:10,100:15\n\n' +
        'Les remises sont en %'
    );
    
    if (!config) return;
    
    try {
        const newTiers = [];
        const pairs = config.split(',');
        
        pairs.forEach(pair => {
            const [qty, discount] = pair.split(':').map(s => parseFloat(s.trim()));
            const price = currentArticle.basePrice * (1 - discount / 100);
            newTiers.push({ minQty: qty, price: Math.round(price), method: 'fixed' });
        });
        
        tiers = newTiers;
        renderTiers();
        alert('✅ Paliers générés automatiquement');
    } catch (e) {
        alert('❌ Format invalide');
    }
}

// ================================================
// RÈGLES DE BONUS
// ================================================

function toggleBonus() {
    const enabled = document.getElementById('enable-bonus').checked;
    const content = document.getElementById('bonus-content');
    content.style.display = enabled ? 'block' : 'none';
}

function renderBonusRules() {
    const tbody = document.getElementById('bonus-tbody');
    const emptyState = document.getElementById('bonus-empty');
    const examples = document.getElementById('bonus-examples');
    
    if (bonusRules.length === 0) {
        tbody.innerHTML = '';
        emptyState.style.display = 'block';
        document.getElementById('bonus-table').style.display = 'none';
        examples.style.display = 'none';
        return;
    }
    
    emptyState.style.display = 'none';
    document.getElementById('bonus-table').style.display = 'table';
    examples.style.display = 'block';
    
    tbody.innerHTML = bonusRules.map((rule, index) => {
        const articleName = rule.articleType === 'same' ? 
            `${currentArticle.code} (lui-même)` : 
            rule.articleName || 'Autre article';
        
        return `
            <tr>
                <td style="font-weight: 600;">${index + 1}</td>
                <td>≥ ${rule.minQty}</td>
                <td>${articleName}</td>
                <td style="text-align: center; font-weight: 600; color: #F59E0B;">${rule.bonusQty}</td>
                <td>
                    <div class="bonus-badge">${rule.label}</div>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon" onclick="editBonus(${index})" title="Modifier">
                            <i class="fa-solid fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-icon-danger" onclick="deleteBonus(${index})" title="Supprimer">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    renderBonusExamples();
}

function renderBonusExamples() {
    const content = document.getElementById('bonus-examples-content');
    
    const examples = [
        { qty: 75, triggered: [0], notTriggered: [] },
        { qty: 150, triggered: [0], notTriggered: [] }
    ];
    
    content.innerHTML = examples.map(ex => {
        const triggeredRules = ex.triggered.map(i => bonusRules[i]);
        const bonusItems = triggeredRules.map(r => 
            `+${r.bonusQty} ${r.articleType === 'same' ? currentArticle.code : 'autres'}`
        ).join(', ');
        
        return `
            <div style="margin-bottom: 16px; padding: 12px; background: white; border-radius: 6px;">
                <div style="font-weight: 600; margin-bottom: 8px;">
                    Commande de ${ex.qty} ${currentArticle.packaging}:
                </div>
                <div style="color: #10B981;">
                    ✅ ${triggeredRules.length} règle(s) déclenchée(s): ${bonusItems}
                </div>
                <div style="font-size: 13px; color: var(--gray-600); margin-top: 4px;">
                    Total: ${ex.qty} payés ${bonusItems ? '+ ' + bonusItems + ' offerts' : ''}
                </div>
            </div>
        `;
    }).join('');
}

function openBonusModal(mode, index = null) {
    editingBonusIndex = index;
    const modal = document.getElementById('bonus-modal');
    const title = document.getElementById('bonus-modal-title');
    
    if (mode === 'add') {
        title.textContent = 'Ajouter une Règle de Bonus';
        document.getElementById('bonus-form').reset();
        document.querySelector('input[name="bonus-article-type"][value="same"]').checked = true;
        toggleBonusArticleSelection();
    } else {
        title.textContent = 'Modifier la Règle de Bonus';
        const rule = bonusRules[index];
        document.getElementById('bonus-min-qty').value = rule.minQty;
        document.getElementById('bonus-qty').value = rule.bonusQty;
        document.getElementById('bonus-label').value = rule.label;
        document.querySelector(`input[name="bonus-article-type"][value="${rule.articleType}"]`).checked = true;
        toggleBonusArticleSelection();
    }
    
    document.getElementById('bonus-article').textContent = 
        `${currentArticle.code} - ${currentArticle.name}`;
    
    modal.style.display = 'flex';
    calculateBonusPreview();
}

function closeBonusModal() {
    document.getElementById('bonus-modal').style.display = 'none';
    editingBonusIndex = null;
}

function toggleBonusArticleSelection() {
    const articleType = document.querySelector('input[name="bonus-article-type"]:checked').value;
    const otherArticleDiv = document.getElementById('bonus-other-article');
    otherArticleDiv.style.display = articleType === 'other' ? 'block' : 'none';
}

function calculateBonusPreview() {
    const minQty = parseInt(document.getElementById('bonus-min-qty')?.value) || 0;
    const bonusQty = parseInt(document.getElementById('bonus-qty')?.value) || 0;
    const preview = document.getElementById('bonus-calc-content');
    
    if (minQty === 0 || bonusQty === 0) {
        preview.innerHTML = '<div style="color: var(--gray-500);">Saisissez les valeurs pour voir l\'aperçu</div>';
        return;
    }
    
    const bonusValue = (bonusQty * currentArticle.basePrice).toLocaleString();
    const equivalentDiscount = ((bonusQty / minQty) * 100).toFixed(1);
    
    preview.innerHTML = `
        <div style="margin-bottom: 8px;">
            <strong>Pour ${minQty} ${currentArticle.code} achetés:</strong>
        </div>
        <div style="margin-bottom: 12px; color: #10B981;">
            → +${bonusQty} ${currentArticle.code} offerts gratuitement
        </div>
        <div style="padding-top: 12px; border-top: 1px solid #3730A3;">
            <div>Valeur du bonus: <strong>${bonusValue} XAF</strong></div>
            <div>Remise équivalente: <strong>~${equivalentDiscount}%</strong> sur la commande totale</div>
        </div>
    `;
}

function saveBonus() {
    const minQty = parseInt(document.getElementById('bonus-min-qty').value);
    const bonusQty = parseInt(document.getElementById('bonus-qty').value);
    const label = document.getElementById('bonus-label').value.trim();
    const articleType = document.querySelector('input[name="bonus-article-type"]:checked').value;
    
    // Validation
    if (!minQty || minQty < 1) {
        alert('⚠️ La quantité minimale doit être supérieure à 0');
        return;
    }
    
    if (!bonusQty || bonusQty < 1) {
        alert('⚠️ La quantité offerte doit être supérieure à 0');
        return;
    }
    
    if (!label) {
        alert('⚠️ Le label promotionnel est obligatoire');
        return;
    }
    
    const rule = { minQty, bonusQty, label, articleType };
    
    if (editingBonusIndex !== null) {
        bonusRules[editingBonusIndex] = rule;
    } else {
        bonusRules.push(rule);
    }
    
    renderBonusRules();
    closeBonusModal();
    alert('✅ Règle de bonus enregistrée');
}

function editBonus(index) {
    openBonusModal('edit', index);
}

function deleteBonus(index) {
    if (confirm('Supprimer cette règle de bonus?')) {
        bonusRules.splice(index, 1);
        renderBonusRules();
        alert('✅ Règle supprimée');
    }
}

// ================================================
// SIMULATION
// ================================================

function runSimulation() {
    const qty = parseInt(document.getElementById('sim-quantity').value);
    
    if (!qty || qty < 1) {
        alert('⚠️ Quantité invalide');
        return;
    }
    
    // Trouver le palier applicable
    let appliedTier = null;
    for (let i = tiers.length - 1; i >= 0; i--) {
        if (qty >= tiers[i].minQty) {
            appliedTier = tiers[i];
            break;
        }
    }
    
    const unitPrice = appliedTier ? appliedTier.price : currentArticle.basePrice;
    const totalPrice = qty * unitPrice;
    const baseTotal = qty * currentArticle.basePrice;
    const savings = baseTotal - totalPrice;
    const savingsPercent = ((savings / baseTotal) * 100).toFixed(1);
    
    // Trouver les bonus applicables
    const appliedBonuses = bonusRules.filter(r => qty >= r.minQty);
    const totalBonusQty = appliedBonuses.reduce((sum, r) => sum + r.bonusQty, 0);
    const bonusValue = totalBonusQty * currentArticle.basePrice;
    
    // Afficher les résultats
    document.getElementById('simulation-results').style.display = 'block';
    
    const pricingDetails = document.getElementById('sim-pricing-details');
    pricingDetails.innerHTML = `
        <div class="result-row">
            <span class="result-label">Prix de base:</span>
            <span class="result-value">${currentArticle.basePrice} XAF/unité</span>
        </div>
        ${appliedTier ? `
            <div class="result-row">
                <span class="result-label">✅ Palier appliqué:</span>
                <span class="result-value">≥${appliedTier.minQty} unités → ${appliedTier.price} XAF/unité</span>
            </div>
            <div class="result-row">
                <span class="result-label">Remise par unité:</span>
                <span class="result-value" style="color: #10B981;">${(currentArticle.basePrice - appliedTier.price)} XAF (-${((1 - appliedTier.price/currentArticle.basePrice) * 100).toFixed(1)}%)</span>
            </div>
        ` : ''}
        <div class="result-row">
            <span class="result-label">Quantité payée:</span>
            <span class="result-value">${qty} unités</span>
        </div>
        <div class="result-row">
            <span class="result-label">Prix unitaire appliqué:</span>
            <span class="result-value">${unitPrice} XAF</span>
        </div>
        <div class="result-row">
            <span class="result-label">Montant HT:</span>
            <span class="result-value result-highlight">${totalPrice.toLocaleString()} XAF</span>
        </div>
        ${savings > 0 ? `
            <div class="result-row">
                <span class="result-label">Sans palier:</span>
                <span class="result-value">${baseTotal.toLocaleString()} XAF</span>
            </div>
            <div class="result-row">
                <span class="result-label">💰 Économie réalisée:</span>
                <span class="result-value" style="color: #10B981; font-size: 16px;">${savings.toLocaleString()} XAF (-${savingsPercent}%)</span>
            </div>
        ` : ''}
    `;
    
    // Bonus
    const bonusSection = document.getElementById('sim-bonus-section');
    if (appliedBonuses.length > 0) {
        bonusSection.style.display = 'block';
        const bonusDetails = document.getElementById('sim-bonus-details');
        bonusDetails.innerHTML = appliedBonuses.map(b => `
            <div class="result-row">
                <span class="result-label">✅ ${b.label}</span>
                <span class="result-value">+${b.bonusQty} offerts (valeur: ${(b.bonusQty * currentArticle.basePrice).toLocaleString()} XAF)</span>
            </div>
        `).join('');
    } else {
        bonusSection.style.display = 'none';
    }
    
    // Résumé
    const summary = document.getElementById('sim-summary');
    const totalDelivered = qty + totalBonusQty;
    const totalValue = totalDelivered * currentArticle.basePrice;
    const totalAdvantage = totalValue - totalPrice;
    const advantagePercent = ((totalAdvantage / totalValue) * 100).toFixed(1);
    
    summary.innerHTML = `
        <div class="result-row">
            <span class="result-label">Articles payés:</span>
            <span class="result-value">${qty} × ${currentArticle.code}</span>
        </div>
        ${totalBonusQty > 0 ? `
            <div class="result-row">
                <span class="result-label">Articles offerts:</span>
                <span class="result-value" style="color: #F59E0B;">${totalBonusQty} × ${currentArticle.code} (gratuit)</span>
            </div>
        ` : ''}
        <div class="result-row" style="border-top: 2px solid var(--gray-300); padding-top: 12px; margin-top: 8px;">
            <span class="result-label"><strong>Total livré:</strong></span>
            <span class="result-value result-highlight">${totalDelivered} ${currentArticle.packaging}</span>
        </div>
        <div class="result-row">
            <span class="result-label">Montant à facturer:</span>
            <span class="result-value">${totalPrice.toLocaleString()} XAF</span>
        </div>
        <div class="result-row">
            <span class="result-label">Valeur totale livrée:</span>
            <span class="result-value">${totalValue.toLocaleString()} XAF</span>
        </div>
        <div class="result-row">
            <span class="result-label">🎉 Avantage client total:</span>
            <span class="result-value" style="color: #10B981; font-size: 18px; font-weight: 700;">${totalAdvantage.toLocaleString()} XAF (-${advantagePercent}%)</span>
        </div>
    `;
    
    // Suggestions
    generateSuggestions(qty);
}

function generateSuggestions(currentQty) {
    const suggestions = document.getElementById('sim-suggestions-content');
    const nextTier = tiers.find(t => t.minQty > currentQty);
    
    if (!nextTier) {
        suggestions.innerHTML = '<div style="color: var(--gray-600);">Vous bénéficiez déjà du meilleur tarif disponible! 🎉</div>';
        return;
    }
    
    const currentPrice = tiers.find(t => currentQty >= t.minQty)?.price || currentArticle.basePrice;
    const additionalQty = nextTier.minQty - currentQty;
    const savingsPerUnit = currentPrice - nextTier.price;
    const totalSavings = nextTier.minQty * savingsPerUnit;
    
    suggestions.innerHTML = `
        <div style="margin-bottom: 12px;">
            <strong>Pour maximiser les avantages:</strong>
        </div>
        <div style="background: white; padding: 12px; border-radius: 6px; border-left: 3px solid #3B82F6;">
            <div style="font-weight: 600; margin-bottom: 8px;">
                📈 Commander ${nextTier.minQty} unités au lieu de ${currentQty}:
            </div>
            <div>→ Prix unitaire: ${nextTier.price} XAF (au lieu de ${currentPrice} XAF)</div>
            <div>→ Économie totale: ${totalSavings.toLocaleString()} XAF</div>
            <div style="color: var(--gray-600); font-size: 13px; margin-top: 4px;">
                Seulement ${additionalQty} unités de plus pour débloquer ce palier!
            </div>
        </div>
    `;
}

// ================================================
// ACTIONS GLOBALES
// ================================================

function saveAllRules() {
    const data = {
        pricelist: currentPricelist.id,
        article: currentArticle.id,
        tiersEnabled: document.getElementById('enable-tiers').checked,
        tiers: tiers,
        bonusEnabled: document.getElementById('enable-bonus').checked,
        bonusRules: bonusRules,
        bonusCumulMode: document.querySelector('input[name="bonus-cumul"]:checked')?.value || 'all'
    };
    
    console.log('💾 Enregistrement des règles:', data);
    alert('✅ Règles enregistrées avec succès!');
}

function resetRules() {
    if (confirm('⚠️ Réinitialiser toutes les règles?\n\nCette action est irréversible.')) {
        tiers = [];
        bonusRules = [];
        renderTiers();
        renderBonusRules();
        alert('✅ Règles réinitialisées');
    }
}

function goBackToList() {
    window.location.href = `./pricelists-edit.html?id=${currentPricelist.id}&tab=articles`;
}








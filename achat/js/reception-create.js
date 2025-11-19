// ================================================
// RECEPTION-CREATE.JS
// Wizard création bon de réception
// ================================================

let currentStep = 0;
let selectedBCF = null;
let receptionData = {
    brCode: 'BR-2024-AUTO',
    date: null,
    deliveryNote: '',
    warehouse: '',
    articles: [],
    summary: {
        received: 0,
        conformity: 0,
        gaps: 0
    }
};

let mockBCFs = [
    {
        id: 'BCF-001',
        code: 'BCF-2024-01',
        supplier: 'ABC SARL',
        date: '2024-01-15',
        amount: 800000,
        status: '40%',
        isInternal: false,
        articles: [
            { id: 'art-1', name: 'Peinture', commanded: 200, unit: 'L', status: 'OK' },
            { id: 'art-2', name: 'Diluant', commanded: 100, unit: 'L', status: 'PARTIAL' }
        ]
    },
    {
        id: 'BCF-002',
        code: 'BCF-2024-02',
        supplier: 'XYZ Ltd',
        date: '2024-01-14',
        amount: 1500000,
        status: '0%',
        isInternal: false,
        articles: [
            { id: 'art-3', name: 'Matière 1', commanded: 500, unit: 'kg', status: 'PENDING' },
            { id: 'art-4', name: 'Matière 2', commanded: 300, unit: 'kg', status: 'PENDING' }
        ]
    },
    {
        id: 'BCF-003',
        code: 'BCF-2024-03',
        supplier: 'IOLA DISTRIBUTION',
        date: '2024-01-13',
        amount: 500000,
        status: '80%',
        isInternal: true,
        articles: [
            { id: 'art-5', name: 'Produit A', commanded: 100, unit: 'carton', status: 'PARTIAL' }
        ]
    }
];

// ================================================
// INITIALISATION
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation wizard réception...');
    
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('reception-date').value = today;
    
    renderBCFsList();
});

// ================================================
// WIZARD NAVIGATION
// ================================================

function nextStep() {
    if (!validateCurrentStep()) return;
    
    if (currentStep < 2) {
        currentStep++;
        renderWizard();
    }
}

function previousStep() {
    if (currentStep > 0) {
        currentStep--;
        renderWizard();
    }
}

function renderWizard() {
    // Hide all contents
    document.querySelectorAll('.wizard-content').forEach(c => c.classList.remove('active'));
    
    // Show current content
    document.getElementById(`content-${currentStep}`).classList.add('active');
    
    // Update steps
    document.querySelectorAll('.wizard-step').forEach((step, idx) => {
        step.classList.remove('active', 'completed');
        if (idx < currentStep) step.classList.add('completed');
        if (idx === currentStep) step.classList.add('active');
    });
    
    // Update buttons
    document.getElementById('btn-prev').style.display = currentStep > 0 ? 'inline-flex' : 'none';
    document.getElementById('btn-next').style.display = currentStep < 2 ? 'inline-flex' : 'none';
    document.getElementById('btn-draft').style.display = currentStep < 2 ? 'inline-flex' : 'none';
    document.getElementById('btn-validate').style.display = currentStep === 2 ? 'inline-flex' : 'none';
    
    // Populate step 2 and 3
    if (currentStep === 1) {
        renderArticlesTable();
    } else if (currentStep === 2) {
        renderValidationSummary();
    }
}

// ================================================
// ÉTAPE 1: SÉLECTION BCF
// ================================================

function renderBCFsList() {
    const list = document.getElementById('bcfs-list');
    
    list.innerHTML = mockBCFs.map(bcf => `
        <div class="bcf-card ${selectedBCF?.id === bcf.id ? 'selected' : ''}" onclick="selectBCF('${bcf.id}')">
            <div class="bcf-radio"></div>
            <div class="bcf-info">
                <div class="bcf-header">
                    <span class="bcf-code">${bcf.code}</span>
                    <span class="bcf-amount">${formatCurrency(bcf.amount)}</span>
                </div>
                <div class="bcf-meta">
                    <div><strong>Fournisseur:</strong> ${bcf.supplier}</div>
                    <div><strong>Date:</strong> ${formatDate(bcf.date)}</div>
                    <div class="bcf-progress">
                        <span>Statut réception:</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${bcf.status}"></div>
                        </div>
                        <span>${bcf.status}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function selectBCF(bcfId) {
    selectedBCF = mockBCFs.find(b => b.id === bcfId);
    
    // Show internal supplier alert if applicable
    document.getElementById('internal-supplier-alert').style.display = selectedBCF.isInternal ? 'block' : 'none';
    
    renderBCFsList();
}

function filterBCFs() {
    const search = document.getElementById('bcf-search').value.toLowerCase();
    const filtered = mockBCFs.filter(bcf => 
        bcf.code.toLowerCase().includes(search) || 
        bcf.supplier.toLowerCase().includes(search)
    );
    
    const list = document.getElementById('bcfs-list');
    list.innerHTML = filtered.map(bcf => `
        <div class="bcf-card ${selectedBCF?.id === bcf.id ? 'selected' : ''}" onclick="selectBCF('${bcf.id}')">
            <div class="bcf-radio"></div>
            <div class="bcf-info">
                <div class="bcf-header">
                    <span class="bcf-code">${bcf.code}</span>
                    <span class="bcf-amount">${formatCurrency(bcf.amount)}</span>
                </div>
                <div class="bcf-meta">
                    <div><strong>Fournisseur:</strong> ${bcf.supplier}</div>
                    <div><strong>Date:</strong> ${formatDate(bcf.date)}</div>
                    <div class="bcf-progress">
                        <span>Statut réception:</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${bcf.status}"></div>
                        </div>
                        <span>${bcf.status}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function validateCurrentStep() {
    if (currentStep === 0) {
        if (!selectedBCF) {
            alert('Veuillez sélectionner un BCF');
            return false;
        }
        return true;
    } else if (currentStep === 1) {
        if (!document.getElementById('warehouse').value) {
            alert('Veuillez sélectionner un entrepôt');
            return false;
        }
        return true;
    }
    return true;
}

// ================================================
// ÉTAPE 2: SAISIE RÉCEPTION
// ================================================

function renderArticlesTable() {
    if (!selectedBCF) return;
    
    document.getElementById('selected-bcf-info').value = selectedBCF.code;
    
    const tbody = document.getElementById('articles-tbody');
    tbody.innerHTML = selectedBCF.articles.map((article, idx) => `
        <tr>
            <td style="text-align: center; font-weight: 600; color: #6B7280;">${idx + 1}</td>
            <td>${article.name}</td>
            <td style="text-align: center;">${article.commanded}</td>
            <td style="text-align: center;">80</td>
            <td style="text-align: center;">
                <input 
                    type="number" 
                    class="form-input"
                    value="120"
                    min="0"
                    onchange="updateArticleQty(${idx}, this.value)"
                    style="text-align: center;"
                >
            </td>
            <td>
                <select class="form-input" style="text-align: center;">
                    <option>OK</option>
                    <option>PARTIAL</option>
                    <option>ERROR</option>
                </select>
            </td>
            <td>
                <input type="text" class="form-input" placeholder="LOT001" value="LOT001">
            </td>
            <td style="text-align: center;">
                <input type="checkbox">
            </td>
            <td style="text-align: center;">
                <button type="button" class="btn btn-secondary" onclick="uploadPhoto()" style="padding: 6px 12px;">
                    <i class="fa-solid fa-camera"></i>
                </button>
            </td>
        </tr>
        <tr>
            <td colspan="9">
                <div class="ecart-note">
                    <i class="fa-solid fa-circle-info"></i>
                    <span>⚠ Écart: -5L (Tolérance: 2%)</span>
                </div>
            </td>
        </tr>
    `).join('');
}

function updateArticleQty(idx, qty) {
    receptionData.articles[idx] = receptionData.articles[idx] || {};
    receptionData.articles[idx].received = qty;
}

function uploadPhoto() {
    alert('Fonctionnalité upload photo');
}

// ================================================
// ÉTAPE 3: VALIDATION
// ================================================

function renderValidationSummary() {
    // Récapitulatif
    const recapHtml = `
        <div class="info-row">
            <span class="info-label">N° BR:</span>
            <span class="info-value">BR-2024-0089</span>
        </div>
        <div class="info-row">
            <span class="info-label">Date:</span>
            <span class="info-value">${formatDate(new Date().toISOString().split('T')[0])}</span>
        </div>
        <div class="info-row">
            <span class="info-label">BCF:</span>
            <span class="info-value">${selectedBCF?.code}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Fournisseur:</span>
            <span class="info-value">${selectedBCF?.supplier}</span>
        </div>
        <div class="info-row">
            <span class="info-label">N° BL Fournisseur:</span>
            <span class="info-value">${document.getElementById('delivery-note').value || '-'}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Entrepôt:</span>
            <span class="info-value">${document.getElementById('warehouse').value || '-'}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Magasinier:</span>
            <span class="info-value">J. Kamga</span>
        </div>
    `;
    
    document.getElementById('summary-recap').innerHTML = recapHtml;
    
    // Qualité & Écarts
    const qualityHtml = `
        <div style="margin-bottom: 12px;">
            <strong>Articles en quarantaine:</strong> 1 (95L Diluant - En attente contrôle)
        </div>
        <div style="margin-bottom: 12px;">
            <strong>Taux de conformité global:</strong> <span class="status-warning">93% (215L/300L commandés)</span>
        </div>
        <div style="margin-bottom: 12px;">
            <strong>Écarts détectés:</strong>
            <ul style="margin: 8px 0 0 20px;">
                <li>Quantité: -85L total (-28.3%)</li>
                <li style="margin-top: 4px;">→ Litige LITIGE-2024-015 créé automatiquement</li>
                <li style="margin-top: 8px;">Qualité: 1 article en quarantaine</li>
                <li style="margin-top: 4px;">→ Notification envoyée au service Qualité</li>
            </ul>
        </div>
    `;
    
    document.getElementById('quality-summary').innerHTML = qualityHtml;
    
    // Mouvements stock
    const movementsHtml = `
        <div style="margin-bottom: 16px;">
            <strong style="color: #10B981;">✓ ENTRÉE #MVT-2024-1234</strong>
            <ul style="margin: 8px 0 0 20px; font-size: 12px;">
                <li>Peinture: +120L → Stock physique: 1,520L</li>
                <li>PMP recalculé: 1,475 XAF/L</li>
            </ul>
        </div>
        <div>
            <strong style="color: #F59E0B;">⏳ EN ATTENTE #MVT-2024-1235</strong>
            <ul style="margin: 8px 0 0 20px; font-size: 12px;">
                <li>Diluant: 95L en quarantaine</li>
                <li>Libération après contrôle qualité</li>
            </ul>
        </div>
    `;
    
    document.getElementById('stock-movements').innerHTML = movementsHtml;
}

// ================================================
// FORM ACTIONS
// ================================================

function saveDraft() {
    console.log('💾 Enregistrement brouillon réception:', receptionData);
    alert('✅ Bon de réception enregistré en brouillon');
}

function validateReception() {
    if (!document.getElementById('supervisor-comment').value && !confirm('Valider sans commentaire superviseur ?')) {
        return;
    }
    
    console.log('✅ Validation réception:', {
        bcf: selectedBCF?.code,
        warehouse: document.getElementById('warehouse').value,
        date: document.getElementById('reception-date').value,
        comment: document.getElementById('supervisor-comment').value,
        signature: document.getElementById('signature').value
    });
    
    alert('✅ Bon de réception validé avec succès !');
    window.location.href = './receptions-list.html';
}

function signReception() {
    const signature = prompt('Veuillez entrer votre signature:');
    if (signature) {
        document.getElementById('signature').value = signature;
    }
}

function cancelWizard() {
    if (confirm('Annuler la création du bon de réception ?')) {
        window.location.href = './receptions-list.html';
    }
}

// ================================================
// HELPERS
// ================================================

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatCurrency(amount) {
    if (!amount) return '0 XAF';
    return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount) + ' XAF';
}

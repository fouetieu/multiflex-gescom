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
    qualityControl: {
        required: false,
        controlType: 'VISUAL',
        overallStatus: 'PENDING',
        comments: '',
        documents: []
    },
    validationRequired: false,
    gaps: [],
    gapAction: null,
    disputeComment: '',
    documents: {
        blFile: null,
        photos: [],
        qualityReport: null
    },
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
            { id: 'art-1', code: 'CHEM-001', name: 'Produit chimique A', commanded: 100, unit: 'L', alreadyReceived: 0 },
            { id: 'art-2', code: 'CHEM-002', name: 'Produit chimique B', commanded: 200, unit: 'L', alreadyReceived: 0 },
            { id: 'art-3', code: 'CHEM-003', name: 'Additif spécial', commanded: 50, unit: 'KG', alreadyReceived: 0 }
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
            { id: 'art-3', code: 'MAT-001', name: 'Matière 1', commanded: 500, unit: 'kg', alreadyReceived: 0 },
            { id: 'art-4', code: 'MAT-002', name: 'Matière 2', commanded: 300, unit: 'kg', alreadyReceived: 0 }
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
            { id: 'art-5', code: 'PROD-A01', name: 'Produit A', commanded: 100, unit: 'carton', alreadyReceived: 80 }
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
    
    // Event listeners for quality control
    document.getElementById('quality-control-required').addEventListener('change', function(e) {
        document.getElementById('quality-control-section').style.display = e.target.checked ? 'block' : 'none';
        receptionData.qualityControl.required = e.target.checked;
    });
    
    // Event listeners for validation
    document.getElementById('validation-required').addEventListener('change', function(e) {
        document.getElementById('validation-section').style.display = e.target.checked ? 'block' : 'none';
        receptionData.validationRequired = e.target.checked;
    });
    
    // File upload listeners
    document.getElementById('bl-file')?.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            document.getElementById('bl-preview').innerHTML = `<i class="fa-solid fa-check-circle"></i> ${e.target.files[0].name}`;
        }
    });
    
    document.getElementById('photos-file')?.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            document.getElementById('photos-preview').innerHTML = `<i class="fa-solid fa-check-circle" style="color: #10B981;"></i> ${e.target.files.length} photo(s) sélectionnée(s)`;
        }
    });
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
        
        // Check if at least one article has received quantity
        const hasReceived = receptionData.articles.some(a => (a.received || 0) > 0);
        if (!hasReceived) {
            alert('Veuillez saisir au moins une quantité reçue');
            return false;
        }
        
        // Check mandatory documents
        const blFile = document.getElementById('bl-file')?.files[0];
        const photos = document.getElementById('photos-file')?.files;
        
        if (!blFile) {
            alert('Le BL fournisseur est obligatoire');
            return false;
        }
        
        if (!photos || photos.length < 3) {
            alert('Au moins 3 photos de livraison sont obligatoires');
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
    tbody.innerHTML = selectedBCF.articles.map((article, idx) => {
        const receivedQty = receptionData.articles[idx]?.received || 0;
        const state = receptionData.articles[idx]?.state || 'BON';
        const qualityStatus = receptionData.articles[idx]?.qualityStatus || 'NOT_CHECKED';
        const acceptedQty = receptionData.articles[idx]?.acceptedQty || receivedQty;
        
        return `
        <tr>
            <td style="text-align: center; font-weight: 600; color: #6B7280;">${idx + 1}</td>
            <td>
                <div style="font-weight: 600;">${article.code}</div>
                <div style="font-size: 11px; color: #6B7280;">${article.name}</div>
            </td>
            <td style="text-align: center;">${article.commanded} ${article.unit}</td>
            <td style="text-align: center;">
                <input 
                    type="number" 
                    class="form-input"
                    value="${receivedQty}"
                    min="0"
                    onchange="updateArticleReceived(${idx}, this.value)"
                    style="text-align: center; width: 80px;"
                >
            </td>
            <td>
                <select class="form-input" onchange="updateArticleState(${idx}, this.value)" style="font-size: 11px;">
                    <option value="BON" ${state === 'BON' ? 'selected' : ''}>BON</option>
                    <option value="DÉGRADÉ" ${state === 'DÉGRADÉ' ? 'selected' : ''}>DÉGRADÉ</option>
                    <option value="DÉFECTUEUX" ${state === 'DÉFECTUEUX' ? 'selected' : ''}>DÉFECTUEUX</option>
                </select>
            </td>
            <td>
                <select class="form-input" onchange="updateArticleQuality(${idx}, this.value)" style="font-size: 11px;">
                    <option value="NOT_CHECKED" ${qualityStatus === 'NOT_CHECKED' ? 'selected' : ''}>[---]</option>
                    <option value="ACCEPTED" ${qualityStatus === 'ACCEPTED' ? 'selected' : ''}>[ACC] Accepté</option>
                    <option value="REJECTED" ${qualityStatus === 'REJECTED' ? 'selected' : ''}>[REJ] Rejeté</option>
                    <option value="QUARANTINE" ${qualityStatus === 'QUARANTINE' ? 'selected' : ''}>[QUA] Quarantaine</option>
                </select>
            </td>
            <td style="text-align: center; font-weight: 600; color: #10B981;">${acceptedQty} ${article.unit}</td>
        </tr>
        <tr id="article-${idx}-obs" style="display: none;">
            <td colspan="7" style="padding: 8px 12px;">
                <input 
                    type="text" 
                    class="form-input" 
                    placeholder="Observation qualité..."
                    id="quality-comment-${idx}"
                    onchange="updateArticleComment(${idx}, this.value)"
                    style="font-size: 12px;"
                >
            </td>
        </tr>
    `;
    }).join('');
    
    // Initialize articles in receptionData if needed
    if (receptionData.articles.length === 0) {
        receptionData.articles = selectedBCF.articles.map(art => ({
            id: art.id,
            received: 0,
            state: 'BON',
            qualityStatus: 'NOT_CHECKED',
            qualityComment: '',
            quarantineQty: 0,
            acceptedQty: 0
        }));
    }
}

function updateArticleReceived(idx, qty) {
    const parsedQty = parseFloat(qty) || 0;
    receptionData.articles[idx].received = parsedQty;
    
    // Auto-calculate accepted quantity based on quality status
    if (receptionData.articles[idx].qualityStatus === 'REJECTED') {
        receptionData.articles[idx].acceptedQty = 0;
        receptionData.articles[idx].quarantineQty = 0;
    } else if (receptionData.articles[idx].qualityStatus === 'QUARANTINE') {
        receptionData.articles[idx].acceptedQty = 0;
        receptionData.articles[idx].quarantineQty = parsedQty;
    } else {
        receptionData.articles[idx].acceptedQty = parsedQty;
        receptionData.articles[idx].quarantineQty = 0;
    }
    
    checkForGaps();
    renderArticlesTable();
}

function updateArticleState(idx, state) {
    receptionData.articles[idx].state = state;
    checkForGaps();
}

function updateArticleQuality(idx, qualityStatus) {
    receptionData.articles[idx].qualityStatus = qualityStatus;
    
    // Show/hide observation field
    const obsRow = document.getElementById(`article-${idx}-obs`);
    if (qualityStatus !== 'NOT_CHECKED') {
        obsRow.style.display = 'table-row';
    } else {
        obsRow.style.display = 'none';
    }
    
    // Recalculate accepted quantity
    const receivedQty = receptionData.articles[idx].received || 0;
    if (qualityStatus === 'REJECTED') {
        receptionData.articles[idx].acceptedQty = 0;
        receptionData.articles[idx].quarantineQty = 0;
    } else if (qualityStatus === 'QUARANTINE') {
        receptionData.articles[idx].acceptedQty = 0;
        receptionData.articles[idx].quarantineQty = receivedQty;
    } else if (qualityStatus === 'ACCEPTED') {
        receptionData.articles[idx].acceptedQty = receivedQty;
        receptionData.articles[idx].quarantineQty = 0;
    }
    
    renderArticlesTable();
}

function updateArticleComment(idx, comment) {
    receptionData.articles[idx].qualityComment = comment;
}

function checkForGaps() {
    const gaps = [];
    
    selectedBCF.articles.forEach((article, idx) => {
        const receivedQty = receptionData.articles[idx]?.received || 0;
        const state = receptionData.articles[idx]?.state || 'BON';
        const commanded = article.commanded;
        
        if (receivedQty < commanded) {
            const diff = commanded - receivedQty;
            const percent = ((diff / commanded) * 100).toFixed(1);
            gaps.push(`Ligne ${idx + 1}: -${diff} ${article.unit} sur ${commanded} ${article.unit} commandés (-${percent}%)`);
        }
        
        if (state !== 'BON') {
            gaps.push(`Ligne ${idx + 1}: État ${state}`);
        }
    });
    
    receptionData.gaps = gaps;
    
    // Update UI
    if (gaps.length > 0) {
        document.getElementById('gaps-detected').style.display = 'block';
        document.getElementById('no-gaps').style.display = 'none';
        
        const gapsList = document.getElementById('gaps-list');
        gapsList.innerHTML = gaps.map(gap => `<li>${gap}</li>`).join('');
    } else {
        document.getElementById('gaps-detected').style.display = 'none';
        document.getElementById('no-gaps').style.display = 'block';
    }
}

function uploadQualityDoc(type) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'lab-report' ? '.pdf' : '.pdf,.jpg,.png';
    input.onchange = function(e) {
        if (e.target.files.length > 0) {
            console.log(`📎 Document ${type} ajouté:`, e.target.files[0].name);
            receptionData.qualityControl.documents.push({
                type: type,
                file: e.target.files[0]
            });
        }
    };
    input.click();
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
    const quarantineCount = receptionData.articles.filter(a => a.qualityStatus === 'QUARANTINE').length;
    const rejectedCount = receptionData.articles.filter(a => a.qualityStatus === 'REJECTED').length;
    const totalReceived = receptionData.articles.reduce((sum, a) => sum + (a.received || 0), 0);
    const totalCommanded = selectedBCF.articles.reduce((sum, a) => sum + a.commanded, 0);
    const conformityRate = totalCommanded > 0 ? ((totalReceived / totalCommanded) * 100).toFixed(1) : 0;
    
    let qualityHtml = '<div style="margin-bottom: 12px;">';
    
    if (quarantineCount > 0) {
        qualityHtml += `<div><strong>Articles en quarantaine:</strong> ${quarantineCount}</div>`;
    }
    if (rejectedCount > 0) {
        qualityHtml += `<div><strong>Articles rejetés:</strong> ${rejectedCount}</div>`;
    }
    
    qualityHtml += `
        </div>
        <div style="margin-bottom: 12px;">
            <strong>Taux de conformité global:</strong> 
            <span class="${conformityRate >= 98 ? 'status-ok' : conformityRate >= 90 ? 'status-warning' : 'status-error'}">
                ${conformityRate}% (${totalReceived}/${totalCommanded} unités)
            </span>
        </div>
    `;
    
    if (receptionData.gaps.length > 0) {
        qualityHtml += `
        <div style="margin-bottom: 12px;">
            <strong>Écarts détectés:</strong>
            <ul style="margin: 8px 0 0 20px;">
                ${receptionData.gaps.map(gap => `<li>${gap}</li>`).join('')}
            </ul>
        </div>
        `;
    } else {
        qualityHtml += '<div style="color: #10B981; font-weight: 600;"><i class="fa-solid fa-check-circle"></i> Aucun écart détecté</div>';
    }
    
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

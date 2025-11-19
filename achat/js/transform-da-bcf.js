// ================================================
// TRANSFORM-DA-BCF.JS
// Transformation DA → BCF avec regroupement fournisseur
// ================================================

// État global
let currentStep = 1;
let availableDAs = [];
let filteredDAs = [];
let selectedDAs = [];
let supplierGroups = [];
let generatedBCFs = [];

// ================================================
// INITIALISATION
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation transformation DA → BCF...');
    loadValidatedDAs();
});

// ================================================
// CHARGEMENT DES DA VALIDÉES
// ================================================

function loadValidatedDAs() {
    // Simuler le chargement des DA validées
    availableDAs = generateMockValidatedDAs();
    filteredDAs = [...availableDAs];
    
    // Populate supplier filter
    const suppliers = [...new Set(availableDAs.map(da => da.suggestedSupplier).filter(s => s))];
    const supplierFilter = document.getElementById('filter-supplier');
    suppliers.forEach(supplier => {
        const option = document.createElement('option');
        option.value = supplier;
        option.textContent = supplier;
        supplierFilter.appendChild(option);
    });
    
    renderDATable();
}

function generateMockValidatedDAs() {
    return [
        {
            id: 'DA-2024-0234',
            code: 'DA-2024-0234',
            date: '2024-01-15',
            requester: 'Jean KAMGA',
            department: 'PRODUCTION',
            estimatedAmount: 265000,
            suggestedSupplier: null, // MIX - pas de fournisseur unique
            items: [
                { article: '(Libre)', description: 'Matériel spécial', qty: 10, unit: 'U', amount: 15000 },
                { article: 'CHEM-001', description: 'Produit chimique A', qty: 100, unit: 'L', amount: 250000 }
            ]
        },
        {
            id: 'DA-2024-0236',
            code: 'DA-2024-0236',
            date: '2024-01-16',
            requester: 'Luc TCHINDA',
            department: 'ADMINISTRATION',
            estimatedAmount: 85000,
            suggestedSupplier: 'ChemTech SARL',
            supplierId: 'SUPPLIER-001',
            items: [
                { article: 'CHEM-001', description: 'Produit chimique A', qty: 100, unit: 'L', amount: 85000 }
            ]
        },
        {
            id: 'DA-2024-0238',
            code: 'DA-2024-0238',
            date: '2024-01-17',
            requester: 'Paul MBARGA',
            department: 'PRODUCTION',
            estimatedAmount: 420000,
            suggestedSupplier: 'ChemTech SARL',
            supplierId: 'SUPPLIER-001',
            items: [
                { article: 'CHEM-002', description: 'Produit chimique B', qty: 200, unit: 'L', amount: 220000 },
                { article: 'CHEM-003', description: 'Additif spécial', qty: 50, unit: 'KG', amount: 175000 },
                { article: 'ELEC-015', description: 'Composant électro', qty: 25, unit: 'U', amount: 25000 }
            ]
        },
        {
            id: 'DA-2024-0239',
            code: 'DA-2024-0239',
            date: '2024-01-17',
            requester: 'Marie NONO',
            department: 'LOGISTIQUE',
            estimatedAmount: 150000,
            suggestedSupplier: 'ElectroTech SA',
            supplierId: 'SUPPLIER-002',
            items: [
                { article: 'ELEC-020', description: 'Câblage industriel', qty: 50, unit: 'M', amount: 75000 },
                { article: 'ELEC-021', description: 'Connecteurs', qty: 100, unit: 'U', amount: 75000 }
            ]
        }
    ];
}

// ================================================
// FILTRAGE
// ================================================

function applyFilters() {
    const departmentFilter = document.getElementById('filter-department').value;
    const priorityFilter = document.getElementById('filter-priority').value;
    const supplierFilter = document.getElementById('filter-supplier').value;
    
    filteredDAs = availableDAs.filter(da => {
        const matchesDepartment = !departmentFilter || da.department === departmentFilter;
        const matchesSupplier = !supplierFilter || da.suggestedSupplier === supplierFilter;
        
        return matchesDepartment && matchesSupplier;
    });
    
    // Reset selections when filtering
    selectedDAs = selectedDAs.filter(id => filteredDAs.some(da => da.id === id));
    
    renderDATable();
    updateSelectionSummary();
    validateStep1();
}

// ================================================
// AFFICHAGE TABLEAU
// ================================================

function renderDATable() {
    const tbody = document.getElementById('da-table-body');
    
    if (filteredDAs.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 48px; color: #9CA3AF;">
                    <i class="fa-solid fa-inbox" style="font-size: 48px; margin-bottom: 16px; opacity: 0.5; display: block;"></i>
                    Aucune DA validée disponible
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = filteredDAs.map(da => {
        const isSelected = selectedDAs.includes(da.id);
        
        return `
            <tr class="${isSelected ? 'selected' : ''}" onclick="toggleDASelection('${da.id}')">
                <td onclick="event.stopPropagation();">
                    <input 
                        type="checkbox" 
                        class="checkbox-large row-checkbox" 
                        data-id="${da.id}"
                        ${isSelected ? 'checked' : ''}
                        onchange="toggleDASelection('${da.id}')"
                    >
                </td>
                <td>
                    <span style="font-weight: 600;">${da.code}</span>
                </td>
                <td>${formatDate(da.date)}</td>
                <td>${da.requester}</td>
                <td>${da.items.length} ligne${da.items.length > 1 ? 's' : ''}</td>
                <td style="text-align: right; font-weight: 600;">${formatCurrency(da.estimatedAmount)}</td>
                <td>
                    ${da.suggestedSupplier ? `
                        <span style="font-weight: 500;">${da.suggestedSupplier}</span>
                    ` : `
                        <span style="color: #F59E0B; font-style: italic;">
                            <i class="fa-solid fa-exclamation-triangle"></i> À définir
                        </span>
                    `}
                </td>
            </tr>
        `;
    }).join('');
}

// ================================================
// SÉLECTION DES DA
// ================================================

function toggleSelectAll() {
    const isChecked = document.getElementById('select-all').checked;
    
    if (isChecked) {
        selectedDAs = filteredDAs.map(da => da.id);
    } else {
        selectedDAs = [];
    }
    
    renderDATable();
    updateSelectionSummary();
    validateStep1();
}

function toggleDASelection(daId) {
    const index = selectedDAs.indexOf(daId);
    
    if (index > -1) {
        selectedDAs.splice(index, 1);
    } else {
        selectedDAs.push(daId);
    }
    
    // Update select-all checkbox
    document.getElementById('select-all').checked = 
        selectedDAs.length === filteredDAs.length && filteredDAs.length > 0;
    
    renderDATable();
    updateSelectionSummary();
    validateStep1();
}

function updateSelectionSummary() {
    const summary = document.getElementById('selection-summary');
    const summaryText = document.getElementById('selection-text');
    
    if (selectedDAs.length === 0) {
        summary.style.display = 'none';
        return;
    }
    
    const selected = availableDAs.filter(da => selectedDAs.includes(da.id));
    const totalLines = selected.reduce((sum, da) => sum + da.items.length, 0);
    const totalAmount = selected.reduce((sum, da) => sum + da.estimatedAmount, 0);
    
    summary.style.display = 'block';
    summaryText.textContent = `Sélection: ${selectedDAs.length} DA | ${totalLines} lignes | Montant total: ${formatCurrency(totalAmount)}`;
}

// ================================================
// VALIDATION STEP 1
// ================================================

function validateStep1() {
    const btnNext = document.getElementById('btn-next');
    btnNext.disabled = selectedDAs.length === 0;
}

// ================================================
// GESTION DU WIZARD
// ================================================

function nextStep() {
    if (currentStep === 1) {
        analyzeAndGroup();
        currentStep = 2;
        showStep(2);
    } else if (currentStep === 2) {
        prepareBCFForms();
        currentStep = 3;
        showStep(3);
    } else if (currentStep === 3) {
        createBCFs();
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
}

function showStep(step) {
    // Hide all steps
    for (let i = 1; i <= 3; i++) {
        document.getElementById(`content-step-${i}`).style.display = 'none';
        document.getElementById(`step-${i}`).classList.remove('active', 'completed');
    }
    
    // Show current step
    document.getElementById(`content-step-${step}`).style.display = 'block';
    document.getElementById(`step-${step}`).classList.add('active');
    
    // Mark previous steps as completed
    for (let i = 1; i < step; i++) {
        document.getElementById(`step-${i}`).classList.add('completed');
    }
    
    // Update buttons
    const btnPrevious = document.getElementById('btn-previous');
    const btnNext = document.getElementById('btn-next');
    const btnCancel = document.getElementById('btn-cancel');
    
    if (step === 1) {
        btnPrevious.style.display = 'none';
        btnNext.innerHTML = 'Analyser <i class="fa-solid fa-chevron-right"></i>';
        btnNext.className = 'btn btn-primary';
        btnCancel.style.display = 'block';
        validateStep1();
    } else if (step === 2) {
        btnPrevious.style.display = 'block';
        btnNext.innerHTML = 'Continuer <i class="fa-solid fa-chevron-right"></i>';
        btnNext.className = 'btn btn-primary';
        btnNext.disabled = false;
        btnCancel.style.display = 'block';
    } else if (step === 3) {
        btnPrevious.style.display = 'block';
        btnNext.innerHTML = '<i class="fa-solid fa-check"></i> Créer les BCF';
        btnNext.className = 'btn btn-success';
        btnNext.disabled = false;
        btnCancel.style.display = 'block';
    }
}

// ================================================
// STEP 2: ANALYSE ET REGROUPEMENT
// ================================================

function analyzeAndGroup() {
    const selected = availableDAs.filter(da => selectedDAs.includes(da.id));
    
    // Group by supplier
    const groups = {};
    const noSupplier = [];
    
    selected.forEach(da => {
        // Flatten items with supplier info
        da.items.forEach(item => {
            const supplierId = da.supplierId || 'UNDEFINED';
            const supplierName = da.suggestedSupplier || 'FOURNISSEUR NON DÉFINI';
            
            if (!groups[supplierId]) {
                groups[supplierId] = {
                    supplierId: supplierId,
                    supplierName: supplierName,
                    lines: [],
                    totalAmount: 0,
                    certificate: supplierId === 'SUPPLIER-001' ? {
                        status: 'EXPIRING_SOON',
                        expiryDate: '2024-01-28',
                        daysRemaining: 10
                    } : supplierId === 'SUPPLIER-002' ? {
                        status: 'VALID',
                        expiryDate: '2024-06-15',
                        daysRemaining: 150
                    } : null,
                    conditions: supplierId === 'SUPPLIER-001' ? {
                        paymentMode: 'Virement bancaire',
                        paymentTerms: '30 jours',
                        taxRegime: 'REEL'
                    } : supplierId === 'SUPPLIER-002' ? {
                        paymentMode: 'Chèque',
                        paymentTerms: 'Comptant',
                        taxRegime: 'SIMPLIFIE'
                    } : null
                };
            }
            
            groups[supplierId].lines.push({
                daCode: da.code,
                ...item
            });
            groups[supplierId].totalAmount += item.amount;
        });
    });
    
    supplierGroups = Object.values(groups);
    
    renderGroupingAnalysis();
}

function renderGroupingAnalysis() {
    const container = document.getElementById('grouping-analysis');
    
    const suppliersCount = supplierGroups.filter(g => g.supplierId !== 'UNDEFINED').length;
    const hasUndefined = supplierGroups.some(g => g.supplierId === 'UNDEFINED');
    
    let alertHTML = '';
    if (suppliersCount > 1) {
        alertHTML = `
            <div class="alert-box alert-warning" style="margin-bottom: 24px;">
                <i class="fa-solid fa-exclamation-triangle"></i>
                <div>
                    <strong>Regroupement nécessaire :</strong> ${suppliersCount} fournisseurs différents détectés.
                    ${hasUndefined ? ' Certaines lignes nécessitent une assignation de fournisseur.' : ''}
                </div>
            </div>
        `;
    }
    
    const groupsHTML = supplierGroups.map((group, index) => {
        const isUndefined = group.supplierId === 'UNDEFINED';
        
        let certificateHTML = '';
        if (group.certificate) {
            const certClass = group.certificate.status === 'EXPIRING_SOON' ? 'warning' : 
                             group.certificate.status === 'VALID' ? 'success' : 'danger';
            const certIcon = group.certificate.status === 'EXPIRING_SOON' ? 'exclamation-triangle' : 
                            group.certificate.status === 'VALID' ? 'check-circle' : 'times-circle';
            const certMessage = group.certificate.status === 'EXPIRING_SOON' 
                ? `Certificat non-redevance expire le ${formatDate(group.certificate.expiryDate)} (dans ${group.certificate.daysRemaining} jours)`
                : `Certificat non-redevance valide jusqu'au ${formatDate(group.certificate.expiryDate)}`;
            
            certificateHTML = `
                <div class="certificate-alert ${certClass}">
                    <i class="fa-solid fa-${certIcon}"></i>
                    <span>${certMessage}</span>
                </div>
            `;
        }
        
        const linesHTML = group.lines.map(line => `
            <tr>
                <td><input type="checkbox" class="checkbox-large" checked></td>
                <td><strong>${line.daCode}</strong></td>
                <td>${line.article}</td>
                <td>${line.description}</td>
                <td style="text-align: right;">${line.qty}</td>
                <td>${line.unit}</td>
                <td style="text-align: right; font-weight: 600;">${formatCurrency(line.amount)}</td>
            </tr>
        `).join('');
        
        let conditionsHTML = '';
        if (group.conditions) {
            conditionsHTML = `
                <div class="supplier-conditions">
                    <strong style="font-size: 13px; color: #374151;">Conditions fournisseur:</strong>
                    <ul>
                        <li>Mode paiement: ${group.conditions.paymentMode}</li>
                        <li>Délai paiement: ${group.conditions.paymentTerms}</li>
                        <li>Régime fiscal: ${group.conditions.taxRegime}</li>
                    </ul>
                </div>
            `;
        }
        
        let actionHTML = '';
        if (isUndefined) {
            actionHTML = `
                <div style="margin-top: 16px;">
                    <label style="font-size: 13px; font-weight: 600; color: #374151; display: block; margin-bottom: 8px;">
                        Assigner à:
                    </label>
                    <select class="filter-select" id="assign-supplier-${index}" style="width: 100%;">
                        <option value="">Sélectionner fournisseur...</option>
                        <option value="SUPPLIER-001">SUPPLIER-001 - ChemTech SARL</option>
                        <option value="SUPPLIER-002">SUPPLIER-002 - ElectroTech SA</option>
                        <option value="SUPPLIER-003">SUPPLIER-003 - GlobalTrade</option>
                        <option value="NEW">+ Créer nouveau fournisseur</option>
                    </select>
                </div>
            `;
        } else {
            const bcfNumber = `BCF-2024-${(456 + index).toString().padStart(5, '0')}`;
            actionHTML = `
                <div style="margin-top: 16px; text-align: right;">
                    <button class="btn btn-primary btn-sm">
                        <i class="fa-solid fa-arrow-right"></i>
                        Créer ${bcfNumber}
                    </button>
                </div>
            `;
        }
        
        return `
            <div class="supplier-group">
                <div class="supplier-group-header">
                    <div>
                        <div class="supplier-group-title">
                            ${isUndefined ? '<i class="fa-solid fa-question-circle" style="color: #F59E0B;"></i>' : '<i class="fa-solid fa-building"></i>'}
                            GROUPE ${index + 1} : ${group.supplierName}
                        </div>
                    </div>
                    <div class="supplier-group-total">Total: ${formatCurrency(group.totalAmount)}</div>
                </div>
                <div class="supplier-group-body">
                    ${certificateHTML}
                    
                    ${isUndefined ? `
                        <div class="certificate-alert danger">
                            <i class="fa-solid fa-times-circle"></i>
                            <span>Fournisseur doit être assigné avant création BCF</span>
                        </div>
                    ` : ''}
                    
                    <table class="lines-table">
                        <thead>
                            <tr>
                                <th style="width: 40px;"><input type="checkbox" checked></th>
                                <th>DA Source</th>
                                <th>Article</th>
                                <th>Description</th>
                                <th style="text-align: right;">Qté</th>
                                <th>Unité</th>
                                <th style="text-align: right;">Montant</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${linesHTML}
                        </tbody>
                    </table>
                    
                    ${conditionsHTML}
                    ${actionHTML}
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = alertHTML + groupsHTML;
}

// ================================================
// STEP 3: FINALISATION BCF
// ================================================

function prepareBCFForms() {
    const validGroups = supplierGroups.filter(g => g.supplierId !== 'UNDEFINED');
    const container = document.getElementById('bcf-forms-container');
    
    if (validGroups.length === 0) {
        container.innerHTML = `
            <div class="alert-box alert-warning">
                <i class="fa-solid fa-exclamation-triangle"></i>
                <div>Aucun groupe valide pour la création de BCF. Veuillez retourner à l'étape précédente pour assigner les fournisseurs.</div>
            </div>
        `;
        return;
    }
    
    const subtitle = document.getElementById('bcf-creation-subtitle');
    subtitle.textContent = `${validGroups.length} bon${validGroups.length > 1 ? 's' : ''} de commande ${validGroups.length > 1 ? 'seront créés' : 'sera créé'}`;
    
    const formsHTML = validGroups.map((group, index) => {
        const bcfNumber = `BCF-2024-${(456 + index).toString().padStart(5, '0')}`;
        const today = new Date().toISOString().split('T')[0];
        
        // Calculate totals
        const totalHT = group.totalAmount;
        const tva = totalHT * 0.1925; // 19.25%
        const totalTTC = totalHT + tva;
        
        // Get DA sources
        const daSources = [...new Set(group.lines.map(l => l.daCode))];
        const originators = [...new Set(availableDAs.filter(da => daSources.includes(da.code)).map(da => da.requester))];
        
        return `
            <div style="border: 2px solid #263c89; border-radius: 8px; padding: 24px; margin-bottom: 24px; background: white;">
                <h4 style="font-size: 16px; font-weight: 600; color: #263c89; margin-bottom: 20px;">
                    <i class="fa-solid fa-file-invoice"></i>
                    CRÉATION BON DE COMMANDE - ${bcfNumber}
                </h4>
                
                <div class="bcf-details-grid">
                    <!-- Informations Générales -->
                    <div class="detail-section">
                        <div class="detail-section-title">
                            <i class="fa-solid fa-info-circle"></i>
                            INFORMATIONS GÉNÉRALES
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">N° BCF (auto)</span>
                            <span class="detail-value">${bcfNumber}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Date</span>
                            <input type="date" class="form-input" value="${today}" style="font-size: 13px; padding: 6px;">
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Type commande</span>
                            <select class="form-select" style="font-size: 13px; padding: 6px;">
                                <option value="STANDARD">Standard</option>
                                <option value="BLANKET">Contrat cadre</option>
                                <option value="CONTRACT">Contrat</option>
                            </select>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Exercice fiscal</span>
                            <span class="detail-value">2024</span>
                        </div>
                    </div>
                    
                    <!-- Fournisseur -->
                    <div class="detail-section">
                        <div class="detail-section-title">
                            <i class="fa-solid fa-building"></i>
                            FOURNISSEUR
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Code</span>
                            <span class="detail-value">${group.supplierId}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Nom</span>
                            <span class="detail-value">${group.supplierName}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Régime fiscal</span>
                            <span class="detail-value">${group.conditions?.taxRegime || 'REEL'}</span>
                        </div>
                        ${group.certificate ? `
                            <div style="margin-top: 12px; font-size: 12px; ${group.certificate.status === 'EXPIRING_SOON' ? 'color: #F59E0B;' : 'color: #10B981;'}">
                                <i class="fa-solid fa-${group.certificate.status === 'EXPIRING_SOON' ? 'exclamation-triangle' : 'check-circle'}"></i>
                                Certificat: ${group.certificate.status === 'EXPIRING_SOON' ? 'Expire dans ' + group.certificate.daysRemaining + ' jours' : 'Valide'}
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <!-- Conditions Commerciales -->
                <div class="detail-section" style="margin-bottom: 20px;">
                    <div class="detail-section-title">
                        <i class="fa-solid fa-handshake"></i>
                        CONDITIONS COMMERCIALES
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                        <div>
                            <label style="font-size: 12px; color: #6B7280; display: block; margin-bottom: 4px;">Mode paiement</label>
                            <select class="form-select" style="font-size: 13px; padding: 6px;">
                                <option value="VIREMENT" ${group.conditions?.paymentMode.includes('Virement') ? 'selected' : ''}>Virement</option>
                                <option value="CHEQUE" ${group.conditions?.paymentMode.includes('Chèque') ? 'selected' : ''}>Chèque</option>
                                <option value="ESPECES">Espèces</option>
                            </select>
                        </div>
                        <div>
                            <label style="font-size: 12px; color: #6B7280; display: block; margin-bottom: 4px;">Délai paiement</label>
                            <select class="form-select" style="font-size: 13px; padding: 6px;">
                                <option value="COMPTANT" ${group.conditions?.paymentTerms.includes('Comptant') ? 'selected' : ''}>Comptant</option>
                                <option value="30J" ${group.conditions?.paymentTerms.includes('30') ? 'selected' : ''}>30 jours</option>
                                <option value="60J">60 jours</option>
                            </select>
                        </div>
                        <div>
                            <label style="font-size: 12px; color: #6B7280; display: block; margin-bottom: 4px;">Incoterm</label>
                            <select class="form-select" style="font-size: 13px; padding: 6px;">
                                <option value="EXW">EXW</option>
                                <option value="FOB">FOB</option>
                                <option value="CIF">CIF</option>
                            </select>
                        </div>
                        <div>
                            <label style="font-size: 12px; color: #6B7280; display: block; margin-bottom: 4px;">Date livraison</label>
                            <input type="date" class="form-input" value="${new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0]}" style="font-size: 13px; padding: 6px;">
                        </div>
                    </div>
                </div>
                
                <!-- Lignes de commande -->
                <div style="margin-bottom: 20px;">
                    <h5 style="font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 12px;">
                        <i class="fa-solid fa-list"></i>
                        LIGNES DE COMMANDE
                    </h5>
                    <table class="bcf-summary-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>DA Orig</th>
                                <th>Article</th>
                                <th>Description</th>
                                <th style="text-align: right;">Qté</th>
                                <th>Unité</th>
                                <th style="text-align: right;">PU</th>
                                <th style="text-align: right;">Total HT</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${group.lines.map((line, idx) => `
                                <tr>
                                    <td>${idx + 1}</td>
                                    <td><strong>${line.daCode}</strong></td>
                                    <td>${line.article}</td>
                                    <td>${line.description}</td>
                                    <td style="text-align: right;">${line.qty}</td>
                                    <td>${line.unit}</td>
                                    <td style="text-align: right;">${formatCurrency(line.amount / line.qty)}</td>
                                    <td style="text-align: right; font-weight: 600;">${formatCurrency(line.amount)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="7" style="text-align: right;">Total HT:</td>
                                <td style="text-align: right;">${formatCurrency(totalHT)}</td>
                            </tr>
                            <tr>
                                <td colspan="7" style="text-align: right;">TVA (19.25%):</td>
                                <td style="text-align: right;">${formatCurrency(tva)}</td>
                            </tr>
                            <tr>
                                <td colspan="7" style="text-align: right; font-size: 15px;">TOTAL TTC:</td>
                                <td style="text-align: right; font-size: 15px;">${formatCurrency(totalTTC)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                
                <!-- Traçabilité -->
                <div class="detail-section" style="margin-bottom: 20px;">
                    <div class="detail-section-title">
                        <i class="fa-solid fa-route"></i>
                        TRAÇABILITÉ DES ORIGINES
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">DA Sources</span>
                        <span class="detail-value">${daSources.join(', ')}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Émetteurs besoin</span>
                        <span class="detail-value">${originators.join(', ')}</span>
                    </div>
                </div>
                
                <!-- Documents requis -->
                <div style="margin-bottom: 20px;">
                    <h5 style="font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 12px;">
                        <i class="fa-solid fa-paperclip"></i>
                        DOCUMENTS REQUIS
                    </h5>
                    ${group.certificate ? `
                        <div class="doc-requirement required">
                            <i class="fa-solid fa-check-circle" style="color: #10B981; font-size: 20px;"></i>
                            <div style="flex: 1;">
                                <strong>BON_NON_REDEVANCE (Obligatoire)</strong>
                                <div style="font-size: 12px; color: #6B7280; margin-top: 2px;">
                                    Copié depuis fournisseur • certificat_2024_${group.supplierId.toLowerCase()}.pdf
                                </div>
                            </div>
                        </div>
                    ` : ''}
                    ${totalTTC > 500000 ? `
                        <div class="doc-requirement warning">
                            <i class="fa-solid fa-exclamation-triangle" style="color: #F59E0B; font-size: 20px;"></i>
                            <div style="flex: 1;">
                                <strong>CONTRAT_CADRE (Requis si > 500K XAF)</strong>
                                <div style="font-size: 12px; color: #6B7280; margin-top: 2px;">
                                    Document requis pour ce montant
                                </div>
                            </div>
                        </div>
                    ` : `
                        <div class="doc-requirement optional">
                            <i class="fa-solid fa-info-circle" style="color: #6B7280; font-size: 20px;"></i>
                            <div style="flex: 1;">
                                <strong>CONTRAT_CADRE</strong>
                                <div style="font-size: 12px; color: #6B7280; margin-top: 2px;">
                                    Non requis (montant < 500K XAF)
                                </div>
                            </div>
                        </div>
                    `}
                </div>
                
                <!-- Workflow -->
                <div class="detail-section">
                    <div class="detail-section-title">
                        <i class="fa-solid fa-diagram-project"></i>
                        WORKFLOW D'APPROBATION
                    </div>
                    <div style="font-size: 13px; color: #374151;">
                        Circuit: Marie DJOMO → Chef Achats ${totalTTC > 1000000 ? '→ Direction' : ''}
                    </div>
                    <div style="margin-top: 8px;">
                        <span class="badge badge-draft">BROUILLON</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = formsHTML;
}

// ================================================
// CRÉATION DES BCF
// ================================================

function createBCFs() {
    const validGroups = supplierGroups.filter(g => g.supplierId !== 'UNDEFINED');
    
    generatedBCFs = validGroups.map((group, index) => {
        const bcfNumber = `BCF-2024-${(456 + index).toString().padStart(5, '0')}`;
        const daSources = [...new Set(group.lines.map(l => l.daCode))];
        
        return {
            code: bcfNumber,
            supplierId: group.supplierId,
            supplierName: group.supplierName,
            totalAmount: group.totalAmount,
            daSources: daSources,
            status: 'BROUILLON',
            createdAt: new Date().toISOString()
        };
    });
    
    console.log('BCF Créés:', generatedBCFs);
    
    showSuccessModal();
}

function showSuccessModal() {
    const modal = document.getElementById('success-modal');
    const body = document.getElementById('success-modal-body');
    
    const bcfsHTML = generatedBCFs.map(bcf => `
        <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <h4 style="font-size: 16px; font-weight: 600; color: #263c89;">
                    <i class="fa-solid fa-file-invoice"></i>
                    ${bcf.code}
                </h4>
                <span class="badge badge-draft">BROUILLON</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; font-size: 13px;">
                <div>
                    <span style="color: #6B7280;">Fournisseur:</span>
                    <strong style="display: block; margin-top: 2px;">${bcf.supplierName}</strong>
                </div>
                <div>
                    <span style="color: #6B7280;">Montant:</span>
                    <strong style="display: block; margin-top: 2px; color: #263c89;">${formatCurrency(bcf.totalAmount)}</strong>
                </div>
                <div style="grid-column: 1 / -1;">
                    <span style="color: #6B7280;">DA Sources:</span>
                    <strong style="display: block; margin-top: 2px;">${bcf.daSources.join(', ')}</strong>
                </div>
            </div>
        </div>
    `).join('');
    
    body.innerHTML = `
        <div style="text-align: center; padding: 24px 0; margin-bottom: 24px;">
            <div style="font-size: 64px; color: #10B981; margin-bottom: 16px;">
                <i class="fa-solid fa-check-circle"></i>
            </div>
            <h3 style="font-size: 20px; font-weight: 600; color: #1F2937; margin-bottom: 8px;">
                ${generatedBCFs.length} Bon${generatedBCFs.length > 1 ? 's' : ''} de Commande créé${generatedBCFs.length > 1 ? 's' : ''} avec succès !
            </h3>
            <p style="font-size: 14px; color: #6B7280;">
                Les BCF sont maintenant en statut BROUILLON et peuvent être modifiés
            </p>
        </div>
        
        ${bcfsHTML}
    `;
    
    modal.style.display = 'flex';
}

function closeSuccessModal() {
    document.getElementById('success-modal').style.display = 'none';
    window.location.href = './commandes-list.html';
}

function editFirstBCF() {
    if (generatedBCFs.length > 0) {
        window.location.href = `./commande-edit.html?id=${generatedBCFs[0].code}`;
    }
}

// ================================================
// ACTIONS
// ================================================

function cancelWizard() {
    if (confirm('Abandonner la transformation en BCF ? Les DA sélectionnées ne seront pas transformées.')) {
        window.location.href = './commandes-list.html';
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
    return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount) + ' XAF';
}

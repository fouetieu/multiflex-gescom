// ================================================
// TRANSFORM-DA-BCF.JS
// Gestion de la transformation DA en BCF
// ================================================

// État global
let currentStep = 1;
let availableDAs = [];
let filteredDAs = [];
let selectedDAs = [];
let generatedBCF = null;

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
    
    renderDATable();
}

function generateMockValidatedDAs() {
    return [
        {
            id: 'DA-2024-091',
            code: 'DA-2024-091',
            date: '2024-01-14',
            requester: 'Paul DURAND',
            department: 'ADMINISTRATION',
            estimatedAmount: 350000,
            suggestedSupplier: 'ABC SARL',
            items: 2
        },
        {
            id: 'DA-2024-092',
            code: 'DA-2024-092',
            date: '2024-01-14',
            requester: 'Sophie KAMGA',
            department: 'PRODUCTION',
            estimatedAmount: 800000,
            suggestedSupplier: 'ABC SARL',
            items: 1
        },
        {
            id: 'DA-2024-093',
            code: 'DA-2024-093',
            date: '2024-01-13',
            requester: 'Pierre NGONO',
            department: 'MAINTENANCE',
            estimatedAmount: 650000,
            suggestedSupplier: 'XYZ Ltd',
            items: 2
        },
        {
            id: 'DA-2024-094',
            code: 'DA-2024-094',
            date: '2024-01-13',
            requester: 'Marie MARTIN',
            department: 'LOGISTIQUE',
            estimatedAmount: 1200000,
            suggestedSupplier: 'XYZ Ltd',
            items: 2
        },
        {
            id: 'DA-2024-095',
            code: 'DA-2024-095',
            date: '2024-01-12',
            requester: 'Jean DUPONT',
            department: 'PRODUCTION',
            estimatedAmount: 420000,
            suggestedSupplier: 'ABC SARL',
            items: 2
        },
        {
            id: 'DA-2024-100',
            code: 'DA-2024-100',
            date: '2024-01-11',
            requester: 'Thomas NKOLO',
            department: 'PRODUCTION',
            estimatedAmount: 900000,
            suggestedSupplier: 'CIMENCAM',
            items: 1
        },
        {
            id: 'DA-2024-101',
            code: 'DA-2024-101',
            date: '2024-01-10',
            requester: 'Françoise MANGA',
            department: 'LOGISTIQUE',
            estimatedAmount: 550000,
            suggestedSupplier: 'IOLA DISTRIBUTION',
            items: 3
        }
    ];
}

// ================================================
// FILTRAGE
// ================================================

function applyFilters() {
    const supplierFilter = document.getElementById('filter-supplier').value;
    const departmentFilter = document.getElementById('filter-department').value;
    
    filteredDAs = availableDAs.filter(da => {
        const matchesSupplier = !supplierFilter || da.suggestedSupplier === supplierFilter;
        const matchesDepartment = !departmentFilter || da.department === departmentFilter;
        
        return matchesSupplier && matchesDepartment;
    });
    
    // Reset selections when filtering
    selectedDAs = selectedDAs.filter(id => filteredDAs.some(da => da.id === id));
    
    renderDATable();
    updateSelectionCount();
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
            <tr class="${isSelected ? 'selected' : ''}" onclick="toggleDASelection('${da.id}', event)">
                <td onclick="event.stopPropagation();">
                    <input 
                        type="checkbox" 
                        class="checkbox-large row-checkbox" 
                        data-id="${da.id}"
                        ${isSelected ? 'checked' : ''}
                        onchange="toggleDASelection('${da.id}', event)"
                    >
                </td>
                <td>
                    <span style="font-weight: 600;">${da.code}</span>
                </td>
                <td>${formatDate(da.date)}</td>
                <td>${da.requester}</td>
                <td>${getDepartmentLabel(da.department)}</td>
                <td>
                    ${da.suggestedSupplier ? `
                        <span style="font-weight: 500;">${da.suggestedSupplier}</span>
                    ` : `
                        <span style="color: #9CA3AF; font-style: italic;">Non suggéré</span>
                    `}
                </td>
                <td style="text-align: right; font-weight: 600;">${formatCurrency(da.estimatedAmount)}</td>
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
    updateSelectionCount();
    validateStep1();
    checkCompatibility();
}

function toggleDASelection(daId, event) {
    if (event) event.stopPropagation();
    
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
    updateSelectionCount();
    validateStep1();
    checkCompatibility();
}

function updateSelectionCount() {
    document.getElementById('selection-count').textContent = 
        `${selectedDAs.length} DA sélectionnée${selectedDAs.length > 1 ? 's' : ''}`;
}

// ================================================
// VALIDATION COMPATIBILITÉ
// ================================================

function checkCompatibility() {
    const alertContainer = document.getElementById('alert-container');
    
    if (selectedDAs.length === 0) {
        alertContainer.innerHTML = '';
        return;
    }
    
    const selected = availableDAs.filter(da => selectedDAs.includes(da.id));
    const suppliers = [...new Set(selected.map(da => da.suggestedSupplier))];
    const departments = [...new Set(selected.map(da => da.department))];
    
    let alerts = [];
    
    // Check different suppliers
    if (suppliers.length > 1) {
        alerts.push({
            type: 'danger',
            icon: 'times-circle',
            message: `Attention: Fournisseurs différents détectés (${suppliers.filter(s => s).join(', ')}). Un BCF doit concerner un seul fournisseur.`
        });
    }
    
    // Check no supplier
    if (suppliers.includes('') || suppliers.includes(undefined) || suppliers.includes(null)) {
        alerts.push({
            type: 'warning',
            icon: 'exclamation-triangle',
            message: 'Certaines DA n\'ont pas de fournisseur suggéré. Vous devrez le sélectionner manuellement.'
        });
    }
    
    // Check different departments
    if (departments.length > 1) {
        alerts.push({
            type: 'info',
            icon: 'info-circle',
            message: `Information: Départements différents (${departments.map(d => getDepartmentLabel(d)).join(', ')}). Assurez-vous que cette fusion est intentionnelle.`
        });
    }
    
    if (alerts.length > 0) {
        alertContainer.innerHTML = alerts.map(alert => `
            <div class="alert-box alert-${alert.type}" style="margin-top: 16px;">
                <i class="fa-solid fa-${alert.icon}"></i>
                <div>${alert.message}</div>
            </div>
        `).join('');
    } else {
        alertContainer.innerHTML = `
            <div class="alert-box alert-success" style="margin-top: 16px;">
                <i class="fa-solid fa-check-circle"></i>
                <div>Les DA sélectionnées sont compatibles pour la fusion</div>
            </div>
        `;
    }
}

// ================================================
// GESTION DU WIZARD
// ================================================

function validateStep1() {
    const btnNext = document.getElementById('btn-next');
    const selected = availableDAs.filter(da => selectedDAs.includes(da.id));
    const suppliers = [...new Set(selected.map(da => da.suggestedSupplier).filter(s => s))];
    
    // Enable next if at least one DA selected and all have same supplier
    const isValid = selectedDAs.length > 0 && suppliers.length <= 1;
    btnNext.disabled = !isValid;
}

function nextStep() {
    if (currentStep === 1) {
        // Move to step 2
        currentStep = 2;
        showStep(2);
        prepareStep2();
    } else if (currentStep === 2) {
        // Generate BCF
        generateBCF();
        currentStep = 3;
        showStep(3);
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
        btnNext.textContent = 'Suivant';
        btnNext.innerHTML = 'Suivant <i class="fa-solid fa-chevron-right"></i>';
        btnNext.className = 'btn btn-primary';
        btnCancel.style.display = 'block';
        validateStep1();
    } else if (step === 2) {
        btnPrevious.style.display = 'block';
        btnNext.textContent = 'Générer BCF';
        btnNext.innerHTML = '<i class="fa-solid fa-check"></i> Générer BCF';
        btnNext.className = 'btn btn-success';
        btnNext.disabled = false;
        btnCancel.style.display = 'block';
    } else if (step === 3) {
        btnPrevious.style.display = 'none';
        btnNext.style.display = 'none';
        btnCancel.style.display = 'none';
    }
}

// ================================================
// STEP 2: PRÉPARATION
// ================================================

function prepareStep2() {
    const selected = availableDAs.filter(da => selectedDAs.includes(da.id));
    
    // Summary
    const supplier = selected[0].suggestedSupplier || 'À définir';
    const departments = [...new Set(selected.map(da => getDepartmentLabel(da.department)))];
    const totalAmount = selected.reduce((sum, da) => sum + da.estimatedAmount, 0);
    
    document.getElementById('summary-da-count').textContent = 
        `${selected.length} DA (${selected.map(da => da.code).join(', ')})`;
    document.getElementById('summary-supplier').textContent = supplier;
    document.getElementById('summary-departments').textContent = departments.join(', ');
    document.getElementById('summary-total').textContent = formatCurrency(totalAmount);
    
    // Breakdown
    const breakdownHTML = selected.map(da => {
        const percentage = ((da.estimatedAmount / totalAmount) * 100).toFixed(1);
        
        return `
            <div class="da-breakdown-item">
                <div>
                    <div style="font-weight: 600; color: #1F2937;">${da.code}</div>
                    <div style="font-size: 12px; color: #6B7280; margin-top: 2px;">
                        ${da.requester} • ${getDepartmentLabel(da.department)}
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-weight: 600; color: #263c89;">${formatCurrency(da.estimatedAmount)}</div>
                    <div style="font-size: 12px; color: #6B7280; margin-top: 2px;">
                        ${percentage}%
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    document.getElementById('da-breakdown-list').innerHTML = breakdownHTML;
}

// ================================================
// GÉNÉRATION BCF
// ================================================

function generateBCF() {
    const selected = availableDAs.filter(da => selectedDAs.includes(da.id));
    const comment = document.getElementById('bcf-comment').value;
    
    const year = new Date().getFullYear();
    const sequence = Math.floor(Math.random() * 1000).toString().padStart(4, '0');
    const bcfCode = `BCF-${year}-${sequence}`;
    
    generatedBCF = {
        code: bcfCode,
        sourceDAs: selected.map(da => da.id),
        supplier: selected[0].suggestedSupplier,
        totalAmount: selected.reduce((sum, da) => sum + da.estimatedAmount, 0),
        comment: comment,
        status: 'BROUILLON',
        createdAt: new Date().toISOString(),
        createdBy: 'Marie AKONO'
    };
    
    console.log('BCF Généré:', generatedBCF);
    
    // Update confirmation view
    document.getElementById('generated-bcf-code').textContent = bcfCode;
    document.getElementById('confirm-das').textContent = selected.map(da => da.code).join(', ');
    document.getElementById('confirm-supplier').textContent = selected[0].suggestedSupplier;
    document.getElementById('confirm-amount').textContent = formatCurrency(generatedBCF.totalAmount);
}

// ================================================
// ACTIONS
// ================================================

function editBCF() {
    if (generatedBCF) {
        window.location.href = `./commande-edit.html?id=${generatedBCF.code}`;
    }
}

function cancelWizard() {
    if (confirm('Abandonner la transformation en BCF ? Les DA sélectionnées seront perdues.')) {
        window.location.href = './commandes-list.html';
    }
}

// ================================================
// HELPERS
// ================================================

function getDepartmentLabel(department) {
    const labels = {
        'PRODUCTION': 'Production',
        'LOGISTIQUE': 'Logistique',
        'ADMINISTRATION': 'Administration',
        'MAINTENANCE': 'Maintenance',
        'COMMERCIAL': 'Commercial'
    };
    return labels[department] || department;
}

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


/**
 * MultiFlex GESCOM - Journal Create JavaScript
 * Gestion de la création de journaux de trésorerie avec stepper 4 étapes
 */

// ============================================================================
// GLOBAL STATE
// ============================================================================

let currentStep = 1;
const totalSteps = 4;
let selectedType = null;

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    initPage();
});

function initPage() {
    // Set default date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('openingDate').value = today;

    // Setup event listeners
    setupEventListeners();

    // Initialize step 1
    updateStepperUI();
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

function setupEventListeners() {
    // Overdraft warning
    const overdraftInput = document.getElementById('overdraftLimit');
    if (overdraftInput) {
        overdraftInput.addEventListener('input', function() {
            const warning = document.getElementById('overdraftWarning');
            warning.style.display = this.value > 0 ? 'flex' : 'none';
        });
    }

    // Dual signature toggle
    const dualSignatureCheckbox = document.getElementById('dualSignatureEnabled');
    if (dualSignatureCheckbox) {
        dualSignatureCheckbox.addEventListener('change', function() {
            document.getElementById('dualSignatureSettings').style.display =
                this.checked ? 'block' : 'none';
        });
    }
}

// ============================================================================
// STEPPER NAVIGATION
// ============================================================================

function goToStep(step) {
    // Only allow going to completed steps or current step
    if (step > currentStep) {
        return;
    }
    currentStep = step;
    updateStepperUI();
    showStepContent();
}

function nextStep() {
    // Validate current step before proceeding
    if (!validateCurrentStep()) {
        return;
    }

    if (currentStep < totalSteps) {
        currentStep++;
        updateStepperUI();
        showStepContent();

        // Generate summary on last step
        if (currentStep === totalSteps) {
            generateSummary();
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepperUI();
        showStepContent();
    }
}

function updateStepperUI() {
    const steps = document.querySelectorAll('.step');

    steps.forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');

        if (stepNum < currentStep) {
            step.classList.add('completed');
            step.querySelector('.step-number').innerHTML = '<i class="fa-solid fa-check"></i>';
        } else if (stepNum === currentStep) {
            step.classList.add('active');
            step.querySelector('.step-number').textContent = stepNum;
        } else {
            step.querySelector('.step-number').textContent = stepNum;
        }
    });
}

function showStepContent() {
    // Hide all step contents
    document.querySelectorAll('.step-content').forEach(content => {
        content.classList.remove('active');
    });

    // Show current step content
    document.getElementById(`step${currentStep}`).classList.add('active');

    // Scroll to top of form
    document.querySelector('.card').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============================================================================
// TYPE SELECTION - ENHANCED DROPDOWN
// ============================================================================

let isDropdownOpen = false;

function toggleJournalTypeDropdown() {
    const trigger = document.querySelector('.enhanced-select-trigger');
    const dropdown = document.getElementById('journalTypeDropdown');

    isDropdownOpen = !isDropdownOpen;

    if (isDropdownOpen) {
        trigger.classList.add('open');
        dropdown.classList.add('open');
    } else {
        trigger.classList.remove('open');
        dropdown.classList.remove('open');
    }
}

function closeJournalTypeDropdown() {
    const trigger = document.querySelector('.enhanced-select-trigger');
    const dropdown = document.getElementById('journalTypeDropdown');

    isDropdownOpen = false;
    trigger.classList.remove('open');
    dropdown.classList.remove('open');
}

function selectJournalType(value, title, iconClass, iconName) {
    selectedType = value;

    // Update hidden input
    document.getElementById('journalType').value = value;

    // Update trigger display
    const trigger = document.querySelector('.enhanced-select-trigger');
    const placeholder = document.getElementById('journalTypePlaceholder');
    const selectedValueDiv = document.getElementById('journalTypeSelected');
    const selectedIcon = document.getElementById('selectedTypeIcon');
    const selectedTitle = document.getElementById('selectedTypeTitle');
    const selectedCode = document.getElementById('selectedTypeCode');

    placeholder.style.display = 'none';
    selectedValueDiv.style.display = 'flex';

    // Set icon
    selectedIcon.className = `type-icon ${iconClass}`;
    selectedIcon.innerHTML = `<i class="fa-solid ${iconName}"></i>`;

    // Set text
    selectedTitle.textContent = title;
    selectedCode.textContent = value;

    trigger.classList.add('selected');

    // Update dropdown options selection
    document.querySelectorAll('.enhanced-select-option').forEach(opt => {
        opt.classList.remove('selected');
        if (opt.dataset.value === value) {
            opt.classList.add('selected');
        }
    });

    // Close dropdown
    closeJournalTypeDropdown();

    // Show/hide relevant sections
    document.getElementById('bankDetailsSection').style.display =
        value === 'BANK_ACCOUNT' ? 'block' : 'none';
    document.getElementById('mobileMoneySection').style.display =
        value === 'MOBILE_MONEY' ? 'block' : 'none';

    // Auto-generate code prefix
    generateCodePrefix(value);
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const container = document.getElementById('journalTypeSelect');
    if (container && !container.contains(event.target)) {
        closeJournalTypeDropdown();
    }
});

// Legacy function for backwards compatibility
function selectType(type, element) {
    selectJournalType(type, element.querySelector('.font-medium').textContent, '', '');
}

function generateCodePrefix(type) {
    const codeInput = document.getElementById('journalCode');
    let prefix = '';

    switch(type) {
        case 'BANK_ACCOUNT':
            prefix = 'BNK-';
            break;
        case 'CASH_DESK':
            prefix = 'CSH-';
            break;
        case 'MOBILE_MONEY':
            prefix = 'MOB-';
            break;
        case 'PETTY_CASH':
            prefix = 'PTY-';
            break;
    }

    // Get existing journals count (demo)
    const count = String(Math.floor(Math.random() * 10) + 1).padStart(3, '0');
    codeInput.value = prefix + count;
}

// ============================================================================
// VALIDATION
// ============================================================================

function validateCurrentStep() {
    switch(currentStep) {
        case 1:
            return validateStep1();
        case 2:
            return validateStep2();
        case 3:
            return validateStep3();
        default:
            return true;
    }
}

function validateStep1() {
    // Check type selection
    if (!selectedType) {
        showNotification('Veuillez sélectionner un type de journal', 'error');
        return false;
    }

    // Check required fields
    const code = document.getElementById('journalCode').value.trim();
    const label = document.getElementById('journalLabel').value.trim();
    const company = document.getElementById('companyId').value;

    if (!code) {
        showNotification('Le code journal est requis', 'error');
        document.getElementById('journalCode').focus();
        return false;
    }

    if (!label) {
        showNotification('Le libellé est requis', 'error');
        document.getElementById('journalLabel').focus();
        return false;
    }

    if (!company) {
        showNotification('Veuillez sélectionner une société', 'error');
        document.getElementById('companyId').focus();
        return false;
    }

    // Validate bank details if BANK_ACCOUNT
    if (selectedType === 'BANK_ACCOUNT') {
        const bankName = document.getElementById('bankName').value;
        const accountNumber = document.getElementById('accountNumber').value.trim();

        if (!bankName) {
            showNotification('Veuillez sélectionner une banque', 'error');
            document.getElementById('bankName').focus();
            return false;
        }

        if (!accountNumber) {
            showNotification('Le numéro de compte est requis', 'error');
            document.getElementById('accountNumber').focus();
            return false;
        }
    }

    // Validate mobile money details if MOBILE_MONEY
    if (selectedType === 'MOBILE_MONEY') {
        const operator = document.getElementById('mobileOperator').value;
        const phone = document.getElementById('mobilePhone').value.trim();

        if (!operator) {
            showNotification('Veuillez sélectionner un opérateur', 'error');
            document.getElementById('mobileOperator').focus();
            return false;
        }

        if (!phone) {
            showNotification('Le numéro de téléphone est requis', 'error');
            document.getElementById('mobilePhone').focus();
            return false;
        }
    }

    return true;
}

function validateStep2() {
    const alertThreshold = parseFloat(document.getElementById('alertThreshold').value) || 0;
    const criticalThreshold = parseFloat(document.getElementById('criticalThreshold').value) || 0;

    if (criticalThreshold >= alertThreshold) {
        showNotification('Le seuil critique doit être inférieur au seuil d\'alerte', 'error');
        return false;
    }

    return true;
}

function validateStep3() {
    const dualSignatureEnabled = document.getElementById('dualSignatureEnabled').checked;

    if (dualSignatureEnabled) {
        // Count active signatories
        const activeSignatories = document.querySelectorAll('#signatoriesList input[type="checkbox"]:checked').length;

        if (activeSignatories < 2) {
            showNotification('Minimum 2 signataires requis pour la double signature', 'error');
            return false;
        }
    }

    return true;
}

// ============================================================================
// SUMMARY GENERATION
// ============================================================================

function generateSummary() {
    const summaryContent = document.getElementById('summaryContent');
    const validationAlerts = document.getElementById('validationAlerts');

    // Get form data
    const data = collectFormData();

    // Type labels
    const typeLabels = {
        'BANK_ACCOUNT': 'Compte Bancaire',
        'CASH_DESK': 'Caisse',
        'MOBILE_MONEY': 'Mobile Money',
        'PETTY_CASH': 'Petite Caisse'
    };

    // Build summary HTML
    let html = `
        <div class="grid grid-cols-2 gap-6">
            <div>
                <h4 class="font-semibold text-[#263c89] mb-3">
                    <i class="fa-solid fa-info-circle mr-2"></i>
                    Informations Générales
                </h4>
                <table class="text-sm w-full">
                    <tr><td class="text-gray-500 py-1">Type</td><td class="font-medium">${typeLabels[data.type] || data.type}</td></tr>
                    <tr><td class="text-gray-500 py-1">Code</td><td class="font-medium font-mono">${data.code}</td></tr>
                    <tr><td class="text-gray-500 py-1">Libellé</td><td class="font-medium">${data.label}</td></tr>
                    <tr><td class="text-gray-500 py-1">Société</td><td class="font-medium">${data.companyName}</td></tr>
                    <tr><td class="text-gray-500 py-1">Devise</td><td class="font-medium">${data.currency}</td></tr>
                    <tr><td class="text-gray-500 py-1">Multi-devises</td><td class="font-medium">${data.isMultiCurrency ? 'Oui' : 'Non'}</td></tr>
                </table>
            </div>
            <div>
                <h4 class="font-semibold text-[#263c89] mb-3">
                    <i class="fa-solid fa-sliders mr-2"></i>
                    Paramètres
                </h4>
                <table class="text-sm w-full">
                    <tr><td class="text-gray-500 py-1">Solde ouverture</td><td class="font-medium">${formatCurrency(data.openingBalance)}</td></tr>
                    <tr><td class="text-gray-500 py-1">Date ouverture</td><td class="font-medium">${formatDate(data.openingDate)}</td></tr>
                    <tr><td class="text-gray-500 py-1">Seuil alerte</td><td class="font-medium">${formatCurrency(data.alertThreshold)}</td></tr>
                    <tr><td class="text-gray-500 py-1">Seuil critique</td><td class="font-medium">${formatCurrency(data.criticalThreshold)}</td></tr>
                    <tr><td class="text-gray-500 py-1">Découvert autorisé</td><td class="font-medium">${formatCurrency(data.overdraftLimit)}</td></tr>
                </table>
            </div>
        </div>
    `;

    // Add type-specific details
    if (data.type === 'BANK_ACCOUNT' && data.bankDetails) {
        html += `
            <div class="mt-6 pt-6 border-t border-gray-200">
                <h4 class="font-semibold text-[#263c89] mb-3">
                    <i class="fa-solid fa-building-columns mr-2"></i>
                    Détails Bancaires
                </h4>
                <table class="text-sm w-full">
                    <tr><td class="text-gray-500 py-1 w-1/4">Banque</td><td class="font-medium">${data.bankDetails.bankName}</td></tr>
                    <tr><td class="text-gray-500 py-1">N° Compte</td><td class="font-medium font-mono">${data.bankDetails.accountNumber}</td></tr>
                    <tr><td class="text-gray-500 py-1">IBAN</td><td class="font-medium font-mono">${data.bankDetails.iban || '-'}</td></tr>
                    <tr><td class="text-gray-500 py-1">SWIFT</td><td class="font-medium font-mono">${data.bankDetails.swiftCode || '-'}</td></tr>
                </table>
            </div>
        `;
    }

    if (data.type === 'MOBILE_MONEY' && data.mobileMoneyDetails) {
        html += `
            <div class="mt-6 pt-6 border-t border-gray-200">
                <h4 class="font-semibold text-[#263c89] mb-3">
                    <i class="fa-solid fa-mobile-screen-button mr-2"></i>
                    Détails Mobile Money
                </h4>
                <table class="text-sm w-full">
                    <tr><td class="text-gray-500 py-1 w-1/4">Opérateur</td><td class="font-medium">${data.mobileMoneyDetails.operator}</td></tr>
                    <tr><td class="text-gray-500 py-1">Téléphone</td><td class="font-medium">${data.mobileMoneyDetails.phone}</td></tr>
                    <tr><td class="text-gray-500 py-1">Code marchand</td><td class="font-medium">${data.mobileMoneyDetails.merchantCode || '-'}</td></tr>
                </table>
            </div>
        `;
    }

    // Security section
    html += `
        <div class="mt-6 pt-6 border-t border-gray-200">
            <h4 class="font-semibold text-[#263c89] mb-3">
                <i class="fa-solid fa-shield-halved mr-2"></i>
                Sécurité
            </h4>
            <table class="text-sm w-full">
                <tr><td class="text-gray-500 py-1 w-1/4">Double signature</td><td class="font-medium">${data.dualSignatureEnabled ? 'Activée' : 'Désactivée'}</td></tr>
                ${data.dualSignatureEnabled ? `<tr><td class="text-gray-500 py-1">Seuil</td><td class="font-medium">${formatCurrency(data.dualSignatureThreshold)}</td></tr>` : ''}
                <tr><td class="text-gray-500 py-1">Statut initial</td><td class="font-medium"><span class="badge ${data.status === 'ACTIVE' ? 'badge-success' : 'badge-warning'}">${data.status}</span></td></tr>
                <tr><td class="text-gray-500 py-1">Journal par défaut</td><td class="font-medium">${data.isDefault ? 'Oui' : 'Non'}</td></tr>
            </table>
        </div>
    `;

    summaryContent.innerHTML = html;

    // Generate alerts
    let alertsHtml = '';

    if (data.overdraftLimit > 0) {
        alertsHtml += `
            <div class="alert-box alert-warning">
                <i class="fa-solid fa-exclamation-triangle"></i>
                <div>Le découvert autorisé de ${formatCurrency(data.overdraftLimit)} nécessite une validation DG.</div>
            </div>
        `;
    }

    if (data.dualSignatureEnabled) {
        alertsHtml += `
            <div class="alert-box alert-info">
                <i class="fa-solid fa-info-circle"></i>
                <div>Les transactions ≥ ${formatCurrency(data.dualSignatureThreshold)} nécessiteront une double signature.</div>
            </div>
        `;
    }

    validationAlerts.innerHTML = alertsHtml;
}

// ============================================================================
// DATA COLLECTION
// ============================================================================

function collectFormData() {
    const companySelect = document.getElementById('companyId');
    const companyName = companySelect.options[companySelect.selectedIndex]?.text || '';

    const data = {
        type: selectedType,
        code: document.getElementById('journalCode').value.trim(),
        label: document.getElementById('journalLabel').value.trim(),
        companyId: document.getElementById('companyId').value,
        companyName: companyName,
        currency: document.getElementById('currency').value,
        isMultiCurrency: document.getElementById('isMultiCurrency').checked,
        openingBalance: parseFloat(document.getElementById('openingBalance').value) || 0,
        openingDate: document.getElementById('openingDate').value,
        dailyWithdrawLimit: parseFloat(document.getElementById('dailyWithdrawLimit').value) || 0,
        overdraftLimit: parseFloat(document.getElementById('overdraftLimit').value) || 0,
        alertThreshold: parseFloat(document.getElementById('alertThreshold').value) || 0,
        criticalThreshold: parseFloat(document.getElementById('criticalThreshold').value) || 0,
        dualSignatureEnabled: document.getElementById('dualSignatureEnabled').checked,
        dualSignatureThreshold: parseFloat(document.getElementById('dualSignatureThreshold').value) || 0,
        status: document.querySelector('input[name="initialStatus"]:checked')?.value || 'ACTIVE',
        isDefault: document.getElementById('isDefault').checked,
        createdAt: new Date().toISOString()
    };

    // Bank details
    if (selectedType === 'BANK_ACCOUNT') {
        data.bankDetails = {
            bankName: document.getElementById('bankName').value,
            bankCode: document.getElementById('bankCode').value.trim(),
            branchCode: document.getElementById('branchCode').value.trim(),
            accountNumber: document.getElementById('accountNumber').value.trim(),
            iban: document.getElementById('iban').value.trim(),
            swiftCode: document.getElementById('swiftCode').value.trim(),
            accountType: document.getElementById('accountType').value,
            accountHolder: document.getElementById('accountHolder').value.trim()
        };
    }

    // Mobile Money details
    if (selectedType === 'MOBILE_MONEY') {
        data.mobileMoneyDetails = {
            operator: document.getElementById('mobileOperator').value,
            phone: document.getElementById('mobilePhone').value.trim(),
            merchantCode: document.getElementById('merchantCode').value.trim(),
            accountName: document.getElementById('mobileAccountName').value.trim()
        };
    }

    // Collect signatories
    if (data.dualSignatureEnabled) {
        data.signatories = [];
        document.querySelectorAll('#signatoriesList tr').forEach(row => {
            const checkbox = row.querySelector('input[type="checkbox"]');
            if (checkbox && checkbox.checked) {
                const cells = row.querySelectorAll('td');
                data.signatories.push({
                    name: cells[0]?.textContent.trim(),
                    role: cells[1]?.textContent.trim(),
                    email: cells[2]?.textContent.trim()
                });
            }
        });
    }

    return data;
}

// ============================================================================
// FORM ACTIONS
// ============================================================================

function createJournal() {
    const data = collectFormData();

    // Final validation
    if (!data.type || !data.code || !data.label) {
        showNotification('Données incomplètes. Veuillez vérifier le formulaire.', 'error');
        return;
    }

    console.log('Creating journal:', data);

    // Simulate API call
    showNotification('Création du journal en cours...', 'info');

    setTimeout(() => {
        showNotification(`Journal ${data.code} créé avec succès!`, 'success');

        setTimeout(() => {
            window.location.href = './journals-list.html';
        }, 1500);
    }, 1000);
}

function saveAsDraft() {
    const data = collectFormData();
    data.status = 'DRAFT';

    // Save to localStorage for demo
    const drafts = JSON.parse(localStorage.getItem('journalDrafts') || '[]');
    drafts.push(data);
    localStorage.setItem('journalDrafts', JSON.stringify(drafts));

    showNotification('Brouillon enregistré', 'success');
}

function addSignatory() {
    const name = prompt('Nom du signataire:');
    if (!name) return;

    const role = prompt('Rôle:');
    const email = prompt('Email:');

    const tbody = document.getElementById('signatoriesList');
    const newRow = document.createElement('tr');
    newRow.className = 'border-t border-gray-200';
    newRow.innerHTML = `
        <td class="py-2 font-medium">${name}</td>
        <td class="py-2 text-gray-600">${role || '-'}</td>
        <td class="py-2 text-gray-600">${email || '-'}</td>
        <td class="py-2 text-center">
            <input type="checkbox" checked class="w-4 h-4 accent-[#263c89]">
        </td>
    `;
    tbody.appendChild(newRow);

    showNotification('Signataire ajouté', 'success');
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatCurrency(amount) {
    if (!amount && amount !== 0) return '-';
    return new Intl.NumberFormat('fr-FR').format(amount) + ' XAF';
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

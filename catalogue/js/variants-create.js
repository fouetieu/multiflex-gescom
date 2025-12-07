/**
 * Wizard de Création de Conditionnement
 * MultiFlex GESCOM - Module Catalogue
 */

// État du wizard
let currentStep = 1;
const totalSteps = 7; // 1=Infos, 2=Unités, 3=Stock, 4=Appro, 5=Prix, 6=Production, 7=Média

// Données du formulaire
let variantData = {
    // Step 1: Informations générales
    productId: '',
    sku: '',
    designation: '',
    detailedDescription: '',
    conditionnementType: '', // Nouveau champ: POT, SAC, SCEAU, BIDON, PALETTE
    netWeight: null,
    grossWeight: null,
    volume: null,
    isSaleable: true,
    isPurchaseable: true,
    isStockable: true,
    isProducible: false,
    isDefaultVariant: false,
    // Spécifications techniques
    hasTechnicalSpecs: false,
    surfaceYield: null,
    surfaceYieldUnit: 'm²/L',
    realizationTime: null,
    dryingTime: null,
    recommendedCoats: null,
    defaultSafetyQuantity: null,
    productAdvice: '',
    
    // Step 2: Unités & Conversions
    stockUnit: 'UNITE',
    saleUnit: 'UNITE',
    purchaseUnit: null,
    purchaseCoefficient: null,
    productionUnit: 'KG',
    conversions: [], // Table de conversions
    
    // Step 3: Stock
    valuationMethod: 'PMP',
    securityStock: null,
    reorderPoint: null,
    maximumStock: null,
    defaultLocation: '',
    // Lots de production
    standardLotSize: null,
    minimumLotSize: null,
    maximumLotSize: null,
    
    // Step 4: Approvisionnement
    replenishmentMethod: 'REORDER_POINT',
    preferredSource: 'MAKE', // MAKE, BUY, BOTH
    manufacturingLeadTime: null,
    defaultSupplier: '',
    alternativeSuppliers: [],
    minimumOrderQuantity: null,
    leadTimeDays: null,
    // Alertes
    enableLowStockAlert: true,
    enableReorderAlert: true,
    enableOverstockAlert: false,
    notifiedUsers: [],
    // Prévision
    autoCalculateReorderPoint: false,
    averageDailyDemand: null,
    forecastMethod: 'MANUAL', // MANUAL, HISTORICAL, WEIGHTED
    
    // Step 5: Prix (simplifié)
    prixAchat: null,
    coefficient: null,
    prixVenteHT: null, // Calculé automatiquement
    
    // Step 6: Production
    bom: [], // Nomenclature
    routing: [], // Gamme
    
    // Step 7: Média
    uploadedImages: [],
    uploadedDocuments: [] // Avec type de document
};

// Mock Products pour le dropdown
const mockProducts = [
    { id: 'prd-mi100', code: 'MI100', designation: 'Peinture Intérieure Mate MI 100', type: 'MARCHANDISE' },
    { id: 'prd-mi300', code: 'MI300', designation: 'Peinture Intérieure Mate MI 300', type: 'MARCHANDISE' },
    { id: 'prd-me500', code: 'ME500', designation: 'Peinture Extérieure Mate ME 500', type: 'MARCHANDISE' },
    { id: 'prd-em1500', code: 'EM1500', designation: 'Enduit Multicoat EM 1500', type: 'MARCHANDISE' },
    { id: 'prd-cb300', code: 'CB300', designation: 'Colle à Bois CB 300', type: 'MARCHANDISE' },
    { id: 'prd-vi200', code: 'VI200', designation: 'Peinture Intérieure Velours VI 200', type: 'PRODUIT_FINI' }
];

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    populateProductSelect();
    initializeEventListeners();
    updateProgress();
    checkDraft();
    
    // Initialize production step visibility
    setTimeout(() => {
        updateProductionSection();
    }, 100);
});

// Populate product dropdown
function populateProductSelect() {
    const select = document.getElementById('product-id');
    
    mockProducts.forEach(prod => {
        const option = document.createElement('option');
        option.value = prod.id;
        option.textContent = `${prod.code} - ${prod.designation}`;
        option.dataset.type = prod.type;
        select.appendChild(option);
    });
}

// Event listeners
function initializeEventListeners() {
    // Step 1 listeners
    document.getElementById('is-purchaseable').addEventListener('change', updatePurchaseSection);
    document.getElementById('is-stockable').addEventListener('change', updateStockSection);
    document.getElementById('is-producible').addEventListener('change', () => {
        updateProductionSection();
        // Sync with step 2
        const checkbox2 = document.getElementById('is-producible-step2');
        if (checkbox2) {
            checkbox2.checked = document.getElementById('is-producible').checked;
            toggleProductionUnitFields();
        }
        // Update step 3
        togglePreferredSourceGroup();
    });
    
    // Step 2 listeners
    document.getElementById('stock-unit').addEventListener('change', () => {
        updateStockUnitInfo();
        updateUnitsRecap();
    });
    document.getElementById('sale-unit')?.addEventListener('change', updateUnitsRecap);
    document.getElementById('purchase-unit').addEventListener('change', () => {
        updatePurchaseUnitInfo();
        updateUnitsRecap();
    });
    document.getElementById('purchase-coefficient').addEventListener('input', () => {
        updatePurchaseUnitInfo();
        updateUnitsRecap();
    });
    document.getElementById('production-unit-select')?.addEventListener('change', () => {
        updateProductionConversionPreview();
        updateUnitsRecap();
    });
    document.getElementById('production-coefficient-step2')?.addEventListener('input', () => {
        updateProductionConversionPreview();
        updateUnitsRecap();
    });
    
    // Step 3 listeners
    document.getElementById('valuation-method').addEventListener('change', updateValuationInfo);
    document.getElementById('security-stock').addEventListener('input', checkThresholds);
    document.getElementById('reorder-point').addEventListener('input', checkThresholds);
    document.getElementById('auto-calculate-reorder')?.addEventListener('change', toggleForecastParams);
    
    // Step 5 listeners (Production - BOM & Routing only)
    // Note: Production unit listeners removed - now managed in step 2
}

// Navigation
function nextStep() {
    if (validateCurrentStep()) {
        saveCurrentStepData();
        
        if (currentStep < totalSteps) {
            currentStep++;
            
            // Skip step 6 (Production) if not producible
            if (currentStep === 6 && !variantData.isProducible) {
                currentStep = 7; // Go to Média
            }
            
            showStep(currentStep);
            updateProgress();
        }
    }
}

function previousStep() {
    if (currentStep > 1) {
        saveCurrentStepData();
        currentStep--;
        
        // Skip step 6 (Production) if not producible when going back
        if (currentStep === 6 && !variantData.isProducible) {
            currentStep = 5;
        }
        
        showStep(currentStep);
        updateProgress();
    }
}

function showStep(step) {
    // Hide all steps
    document.querySelectorAll('.step-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Show current step
    document.getElementById(`step-${step}`).classList.add('active');
    
    // Update step indicators
    document.querySelectorAll('.step').forEach((stepEl, index) => {
        const stepNum = index + 1;
        stepEl.classList.remove('active', 'completed');
        
        if (stepNum < step) {
            stepEl.classList.add('completed');
            stepEl.querySelector('.step-circle').innerHTML = '<i class="fa-solid fa-check"></i>';
        } else if (stepNum === step) {
            stepEl.classList.add('active');
            stepEl.querySelector('.step-circle').textContent = stepNum;
        } else {
            stepEl.querySelector('.step-circle').textContent = stepNum;
        }
    });
    
    // Update navigation buttons
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const btnFinish = document.getElementById('btn-finish');
    
    if (step === 1) {
        btnPrev.style.display = 'none';
    } else {
        btnPrev.style.display = 'inline-flex';
    }
    
    if (step === totalSteps) {
        btnNext.style.display = 'none';
        btnFinish.style.display = 'inline-flex';
        renderFullSummary();
    } else {
        btnNext.style.display = 'inline-flex';
        btnFinish.style.display = 'none';
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgress() {
    // Calculate effective total steps (skip production step 6 if not producible)
    const effectiveTotalSteps = variantData.isProducible ? totalSteps : totalSteps - 1;
    
    // Adjust current step for progress calculation if beyond step 6 and not producible
    let effectiveCurrentStep = currentStep;
    if (!variantData.isProducible && currentStep > 6) {
        effectiveCurrentStep = currentStep - 1; // Adjust for skipped production step
    }
    
    const progress = ((effectiveCurrentStep - 1) / (effectiveTotalSteps - 1)) * 100;
    document.getElementById('progress-line').style.width = progress + '%';
}

// Validation
function validateCurrentStep() {
    switch(currentStep) {
        case 1:
            return validateStep1();
        case 2:
            return validateStep2();
        case 3:
            return validateStep3();
        case 4:
            return validateStep4();
        case 5:
            return validateStep5();
        case 6:
            return validateStep6();
        case 7:
            return validateStep7();
        default:
            return true;
    }
}

function validateStep1() {
    const productId = document.getElementById('product-id').value;
    const sku = document.getElementById('sku').value.trim();
    const designation = document.getElementById('designation').value.trim();
    
    if (!productId) {
        alert('Veuillez sélectionner un article parent');
        return false;
    }
    
    if (!sku) {
        alert('Veuillez saisir un code SKU');
        return false;
    }
    
    if (!designation) {
        alert('Veuillez saisir une désignation');
        return false;
    }
    
    // Vérifier cohérence poids
    const netWeight = parseFloat(document.getElementById('net-weight').value) || 0;
    const grossWeight = parseFloat(document.getElementById('gross-weight').value) || 0;
    
    if (netWeight > 0 && grossWeight > 0 && grossWeight < netWeight) {
        if (!confirm('Le poids brut est inférieur au poids net. Voulez-vous continuer ?')) {
            return false;
        }
    }
    
    return true;
}

function validateStep2() {
    const stockUnit = document.getElementById('stock-unit').value;
    const purchaseUnit = document.getElementById('purchase-unit').value;
    const purchaseCoef = document.getElementById('purchase-coefficient').value;
    
    if (!stockUnit) {
        alert('Veuillez sélectionner une unité de stock');
        return false;
    }
    
    if (purchaseUnit && !purchaseCoef) {
        alert('Veuillez saisir le coefficient de conversion pour l\'unité d\'achat');
        return false;
    }
    
    return true;
}

function validateStep3() {
    const isStockable = variantData.isStockable;
    
    if (!isStockable) {
        return true; // Skip validation si non stockable
    }
    
    const valuationMethod = document.getElementById('valuation-method').value;
    
    if (!valuationMethod) {
        alert('Veuillez sélectionner une méthode de valorisation');
        return false;
    }
    
    return true;
}

function validateStep4() {
    // Étape 4 : Prix - Pas de validation stricte (tout est optionnel)
    return true;
}

function validateStep5() {
    // Étape 5 : Production - Optionnelle
    return true;
}

function validateStep6() {
    // Étape 6 : Média - Optionnelle
    return true;
}

function validateStep7() {
    // Étape 7 : Récapitulatif - Pas de validation
    return true;
}

// Save step data
function saveCurrentStepData() {
    switch(currentStep) {
        case 1:
            saveStep1Data();
            break;
        case 2:
            saveStep2Data();
            break;
        case 3:
            saveStep3Data();
            break;
        case 4:
            saveStep4Data();
            break;
        case 5:
            saveStep5Data();
            break;
        case 6:
            saveStep6Data();
            break;
        case 7:
            saveStep7Data();
            break;
    }
}

function saveStep1Data() {
    variantData.productId = document.getElementById('product-id').value;
    variantData.sku = document.getElementById('sku').value.trim();
    variantData.designation = document.getElementById('designation').value.trim();
    variantData.detailedDescription = document.getElementById('detailed-description')?.value.trim() || '';
    
    // Nouveau champ conditionnementType (remplace productType et barcode)
    variantData.conditionnementType = document.getElementById('conditionnement-type')?.value || '';
    variantData.netWeight = parseFloat(document.getElementById('net-weight').value) || null;
    variantData.grossWeight = parseFloat(document.getElementById('gross-weight').value) || null;
    variantData.volume = parseFloat(document.getElementById('volume').value) || null;
    variantData.isSaleable = document.getElementById('is-saleable').checked;
    variantData.isPurchaseable = document.getElementById('is-purchaseable').checked;
    variantData.isStockable = document.getElementById('is-stockable').checked;
    variantData.isProducible = document.getElementById('is-producible').checked;
    variantData.isDefaultVariant = document.getElementById('is-default').checked;
    
    // Spécifications techniques
    variantData.hasTechnicalSpecs = document.getElementById('has-technical-specs')?.checked || false;
    if (variantData.hasTechnicalSpecs) {
        variantData.surfaceYield = parseFloat(document.getElementById('surface-yield')?.value) || null;
        variantData.surfaceYieldUnit = document.getElementById('surface-yield-unit')?.value || 'm²/L';
        variantData.realizationTime = parseFloat(document.getElementById('realization-time')?.value) || null;
        variantData.dryingTime = parseFloat(document.getElementById('drying-time')?.value) || null;
        variantData.recommendedCoats = parseInt(document.getElementById('recommended-coats')?.value) || null;
        variantData.defaultSafetyQuantity = parseInt(document.getElementById('default-safety-quantity')?.value) || null;
        variantData.productAdvice = document.getElementById('product-advice')?.value.trim() || '';
    }
}

function saveStep2Data() {
    variantData.stockUnit = document.getElementById('stock-unit').value;
    variantData.saleUnit = document.getElementById('sale-unit')?.value || variantData.stockUnit;
    variantData.purchaseUnit = document.getElementById('purchase-unit').value || null;
    variantData.purchaseCoefficient = parseInt(document.getElementById('purchase-coefficient').value) || null;
    
    // Unités de production (si configurées dans step 2)
    const isProducibleStep2 = document.getElementById('is-producible-step2')?.checked;
    if (isProducibleStep2) {
        variantData.isProducible = true;
        variantData.productionUnit = document.getElementById('production-unit-select')?.value || 'KG';
        variantData.productionCoefficient = parseFloat(document.getElementById('production-coefficient-step2')?.value) || null;
    }
    
    // Conversions
    variantData.conversions = unitConversions;
}

function saveStep3Data() {
    variantData.valuationMethod = document.getElementById('valuation-method').value;
    variantData.securityStock = parseInt(document.getElementById('security-stock').value) || null;
    variantData.reorderPoint = parseInt(document.getElementById('reorder-point').value) || null;
    variantData.maximumStock = parseInt(document.getElementById('maximum-stock')?.value) || null;
    variantData.defaultLocation = document.getElementById('default-location').value || null;
    
    // Lots de production
    variantData.standardLotSize = parseInt(document.getElementById('standard-lot-size-step3')?.value) || null;
    variantData.minimumLotSize = parseInt(document.getElementById('minimum-lot-size')?.value) || null;
    variantData.maximumLotSize = parseInt(document.getElementById('maximum-lot-size')?.value) || null;
    
    // Approvisionnement
    variantData.replenishmentMethod = document.getElementById('replenishment-method')?.value || 'REORDER_POINT';
    variantData.preferredSource = document.querySelector('input[name="preferred-source"]:checked')?.value || 'MAKE';
    variantData.manufacturingLeadTime = parseInt(document.getElementById('manufacturing-lead-time')?.value) || null;
    variantData.defaultSupplier = document.getElementById('default-supplier').value || null;
    variantData.alternativeSuppliers = alternativeSuppliers;
    variantData.minimumOrderQuantity = parseInt(document.getElementById('minimum-order-quantity')?.value) || null;
    variantData.leadTimeDays = parseInt(document.getElementById('lead-time-days').value) || null;
    
    // Alertes
    variantData.enableLowStockAlert = document.getElementById('enable-low-stock-alert')?.checked || false;
    variantData.enableReorderAlert = document.getElementById('enable-reorder-alert')?.checked || false;
    variantData.enableOverstockAlert = document.getElementById('enable-overstock-alert')?.checked || false;
    variantData.notifiedUsers = notifiedUsers;
    
    // Prévision
    variantData.autoCalculateReorderPoint = document.getElementById('auto-calculate-reorder')?.checked || false;
    variantData.averageDailyDemand = parseFloat(document.getElementById('average-daily-demand')?.value) || null;
    variantData.forecastMethod = document.querySelector('input[name="forecast-method"]:checked')?.value || 'MANUAL';
}

function saveStep4Data() {
    // Step 4 : Approvisionnement
    variantData.replenishmentMethod = document.getElementById('replenishment-method')?.value || 'REORDER_POINT';
    
    // Source préférée (si productible ET achetable)
    const preferredSourceRadio = document.querySelector('input[name="preferred-source"]:checked');
    variantData.preferredSource = preferredSourceRadio?.value || 'MAKE';
    
    // Délai de fabrication
    variantData.manufacturingLeadTime = parseFloat(document.getElementById('manufacturing-lead-time')?.value) || null;
    
    // Fournisseur par défaut
    variantData.defaultSupplier = document.getElementById('default-supplier')?.value || '';
    
    // Fournisseurs alternatifs (gérés par alternativeSuppliers)
    variantData.alternativeSuppliers = alternativeSuppliers;
    
    // Quantité minimum de commande
    variantData.minimumOrderQuantity = parseFloat(document.getElementById('minimum-order-quantity')?.value) || null;
    
    // Délai d'approvisionnement
    variantData.leadTimeDays = parseFloat(document.getElementById('lead-time-days')?.value) || null;
    
    // Règles d'alerte
    variantData.enableLowStockAlert = document.getElementById('enable-low-stock-alert')?.checked || false;
    variantData.enableReorderAlert = document.getElementById('enable-reorder-alert')?.checked || false;
    variantData.enableOverstockAlert = document.getElementById('enable-overstock-alert')?.checked || false;
    
    // Utilisateurs notifiés (gérés par notifiedUsers)
    variantData.notifiedUsers = notifiedUsers;
    
    // Prévision de demande
    variantData.autoCalculateReorderPoint = document.getElementById('auto-calculate-reorder')?.checked || false;
    variantData.averageDailyDemand = parseFloat(document.getElementById('avg-daily-demand')?.value) || null;
    
    const forecastMethodRadio = document.querySelector('input[name="forecast-method"]:checked');
    variantData.forecastMethod = forecastMethodRadio?.value || 'MANUAL';
}

function saveStep5Data() {
    // Step 5 : Prix (simplifié)
    variantData.prixAchat = parseFloat(document.getElementById('prix-achat')?.value) || null;
    variantData.coefficient = parseFloat(document.getElementById('coefficient')?.value) || null;
    variantData.prixVenteHT = parseFloat(document.getElementById('prix-vente-ht')?.value) || null;
}

function saveStep6Data() {
    // Step 6 : Production - BOM et Routing uniquement
    // Note: Les unités de production sont gérées à l'étape 2
    if (variantData.isProducible) {
        // BOM et Routing sont gérés par bomComponents et routingPhases
        variantData.bom = bomComponents;
        variantData.routing = routingPhases;
    }
}

function saveStep7Data() {
    // Step 7 : Média
    // Les médias sont gérés par les arrays uploadedImages et uploadedDocuments
    variantData.uploadedImages = uploadedImages;
    variantData.uploadedDocuments = uploadedDocuments;
}

// Dynamic updates - Step 1
function updatePurchaseSection() {
    const isPurchaseable = document.getElementById('is-purchaseable').checked;
    const purchaseSection = document.getElementById('purchase-section');
    
    if (currentStep === 2 && purchaseSection) {
        // Will be handled in step 2
    }
    
    if (currentStep === 3) {
        const supplierSection = document.getElementById('supplier-section');
        if (supplierSection) {
            supplierSection.style.display = isPurchaseable ? 'block' : 'none';
        }
    }
}

function updateStockSection() {
    const isStockable = document.getElementById('is-stockable').checked;
    
    if (currentStep === 3) {
        const stockParamsContent = document.getElementById('stock-params-content');
        const stockDisabledInfo = document.getElementById('stock-disabled-info');
        
        if (isStockable) {
            stockParamsContent.style.display = 'block';
            stockDisabledInfo.style.display = 'none';
        } else {
            stockParamsContent.style.display = 'none';
            stockDisabledInfo.style.display = 'block';
        }
    }
}

function updateProductionSection() {
    const isProducible = document.getElementById('is-producible').checked;
    
    // Update variantData
    variantData.isProducible = isProducible;
    
    // Update visibility of production step in progress bar (Step 6, not Step 5)
    const productionStep = document.querySelector('.progress-steps .step[data-step="6"]');
    if (productionStep) {
        productionStep.style.display = isProducible ? 'flex' : 'none';
    }
    
    // Update step 2: production unit section
    if (currentStep === 2) {
        const checkbox = document.getElementById('is-producible-step2');
        if (checkbox) {
            checkbox.checked = isProducible;
            toggleProductionUnitFields();
        }
    }
    
    // Update production unit section visibility in step 2 (always update, not just when currentStep === 2)
    const productionUnitSection = document.getElementById('production-unit-section');
    if (productionUnitSection) {
        productionUnitSection.style.display = isProducible ? 'block' : 'none';
    }
    
    // Update step 3: production lots section
    const prodLotsSection = document.getElementById('production-lots-section');
    if (prodLotsSection) {
        prodLotsSection.style.display = isProducible ? 'block' : 'none';
    }
    togglePreferredSourceGroup();
    
    // Update step 6: production params (always update, not just when currentStep === 6)
    const productionParamsContent = document.getElementById('production-params-content');
    const productionDisabledInfo = document.getElementById('production-disabled-info');
    
    if (productionParamsContent && productionDisabledInfo) {
        if (isProducible) {
            productionParamsContent.style.display = 'block';
            productionDisabledInfo.innerHTML = '<i class="fa-solid fa-check-circle"></i> Cette variante est productible. Configurez les paramètres de production ci-dessous.';
            productionDisabledInfo.style.background = '#D1FAE5';
            productionDisabledInfo.style.borderColor = '#10B981';
        } else {
            productionParamsContent.style.display = 'none';
            productionDisabledInfo.innerHTML = '<i class="fa-solid fa-info-circle"></i> Cette variante n\'est pas productible. Les données de production ne sont pas nécessaires.';
            productionDisabledInfo.style.background = '#EEF2FF';
            productionDisabledInfo.style.borderColor = '#3730A3';
        }
    }
}

// Dynamic updates - Step 2
function updateStockUnitInfo() {
    const stockUnit = document.getElementById('stock-unit').value;
    const stockUnitText = stockUnit === 'UNITE' ? 'UNITE (POT, SAC, CARTON...)' : stockUnit;
    
    document.getElementById('stock-unit-info').textContent = `Stock géré en : ${stockUnitText} (1 unité = 1 unité stock)`;
    document.getElementById('recap-stock-unit').textContent = stockUnitText;
    document.getElementById('alert-unit').textContent = stockUnitText;
    
    updatePurchaseUnitInfo();
}

function updatePurchaseUnitInfo() {
    const purchaseUnit = document.getElementById('purchase-unit').value;
    const purchaseCoef = document.getElementById('purchase-coefficient').value;
    const stockUnit = document.getElementById('stock-unit').value;
    const stockUnitText = stockUnit === 'UNITE' ? 'POT' : stockUnit;
    
    const coefGroup = document.getElementById('purchase-coef-group');
    const purchaseSummary = document.getElementById('purchase-summary');
    const recapPurchaseRow = document.getElementById('recap-purchase-row');
    
    if (purchaseUnit) {
        coefGroup.style.display = 'block';
        document.getElementById('unit-conversion-text').textContent = `${stockUnitText} = 1 ${purchaseUnit}`;
        
        if (purchaseCoef) {
            purchaseSummary.style.display = 'block';
            document.getElementById('purchase-summary-text').textContent = 
                `1 ${purchaseUnit} contient ${purchaseCoef} ${stockUnitText}`;
            
            recapPurchaseRow.style.display = 'flex';
            document.getElementById('recap-purchase-unit').textContent = 
                `${purchaseUnit} (1 ${purchaseUnit} = ${purchaseCoef} ${stockUnitText})`;
            
            document.getElementById('example-content').textContent = 
                `Exemple : Si vous achetez 5 ${purchaseUnit}, le stock augmente de ${purchaseCoef * 5} ${stockUnitText}`;
        } else {
            purchaseSummary.style.display = 'none';
            recapPurchaseRow.style.display = 'none';
        }
    } else {
        coefGroup.style.display = 'none';
        purchaseSummary.style.display = 'none';
        recapPurchaseRow.style.display = 'none';
        document.getElementById('example-content').textContent = 'Configurez les unités pour voir un exemple';
    }
}

// Dynamic updates - Step 3
function updateValuationInfo() {
    const method = document.getElementById('valuation-method').value;
    const methodNames = {
        'PMP': 'Prix Moyen Pondéré',
        'FIFO': 'Premier Entré, Premier Sorti (First In, First Out)',
        'LIFO': 'Dernier Entré, Premier Sorti (Last In, First Out)'
    };
    
    document.getElementById('valuation-info').textContent = 
        `Le stock sera valorisé selon la méthode ${methodNames[method] || method}`;
}

function checkThresholds() {
    const securityStock = parseInt(document.getElementById('security-stock').value) || 0;
    const reorderPoint = parseInt(document.getElementById('reorder-point').value) || 0;
    const warning = document.getElementById('threshold-warning');
    
    if (securityStock > 0 && reorderPoint > 0 && reorderPoint < securityStock) {
        warning.style.display = 'block';
    } else {
        warning.style.display = 'none';
    }
}

// Dynamic updates - Step 4
// updateProductionInfo() removed - production units are now managed in step 2

// Final Summary
function updateFinalSummary() {
    saveCurrentStepData();
    
    const product = mockProducts.find(p => p.id === variantData.productId);
    const summaryDiv = document.getElementById('final-summary');
    
    const flags = [];
    if (variantData.isSaleable) flags.push('💰 Vendable');
    if (variantData.isPurchaseable) flags.push('📦 Achetable');
    if (variantData.isStockable) flags.push('📊 Stockable');
    if (variantData.isProducible) flags.push('🏭 Productible');
    
    let html = `
        <div class="summary-row">
            <span class="summary-label">Article parent:</span>
            <span class="summary-value">${product ? product.code + ' - ' + product.designation : '-'}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Code SKU:</span>
            <span class="summary-value"><strong>${variantData.sku}</strong></span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Désignation:</span>
            <span class="summary-value">${variantData.designation}</span>
        </div>
        ${variantData.barcode ? `
        <div class="summary-row">
            <span class="summary-label">Code-barres:</span>
            <span class="summary-value">${variantData.barcode}</span>
        </div>
        ` : ''}
        ${variantData.netWeight ? `
        <div class="summary-row">
            <span class="summary-label">Poids net:</span>
            <span class="summary-value">${variantData.netWeight} kg</span>
        </div>
        ` : ''}
        ${variantData.grossWeight ? `
        <div class="summary-row">
            <span class="summary-label">Poids brut:</span>
            <span class="summary-value">${variantData.grossWeight} kg</span>
        </div>
        ` : ''}
        ${variantData.volume ? `
        <div class="summary-row">
            <span class="summary-label">Volume:</span>
            <span class="summary-value">${variantData.volume} m³</span>
        </div>
        ` : ''}
        <div class="summary-row">
            <span class="summary-label">Flags de gestion:</span>
            <span class="summary-value">${flags.join(' ')}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Unité de stock:</span>
            <span class="summary-value">${variantData.stockUnit}</span>
        </div>
        ${variantData.purchaseUnit ? `
        <div class="summary-row">
            <span class="summary-label">Unité d'achat:</span>
            <span class="summary-value">${variantData.purchaseUnit} (1 = ${variantData.purchaseCoefficient} ${variantData.stockUnit})</span>
        </div>
        ` : ''}
        ${variantData.isStockable ? `
        <div class="summary-row">
            <span class="summary-label">Valorisation:</span>
            <span class="summary-value">${variantData.valuationMethod}</span>
        </div>
        ${variantData.securityStock ? `
        <div class="summary-row">
            <span class="summary-label">Stock de sécurité:</span>
            <span class="summary-value">${variantData.securityStock} ${variantData.stockUnit}</span>
        </div>
        ` : ''}
        ${variantData.reorderPoint ? `
        <div class="summary-row">
            <span class="summary-label">Point de commande:</span>
            <span class="summary-value">${variantData.reorderPoint} ${variantData.stockUnit}</span>
        </div>
        ` : ''}
        ` : ''}
        ${variantData.isProducible ? `
        <div class="summary-row">
            <span class="summary-label">Production:</span>
            <span class="summary-value">Activée (${variantData.productionUnit})</span>
        </div>
        ` : ''}
        ${variantData.isDefaultVariant ? `
        <div class="summary-row">
            <span class="summary-label">Variante par défaut:</span>
            <span class="summary-value">⭐ Oui</span>
        </div>
        ` : ''}
    `;
    
    summaryDiv.innerHTML = html;
}

// Draft Management
function saveDraft() {
    saveCurrentStepData();
    localStorage.setItem('variantDraft', JSON.stringify({
        data: variantData,
        currentStep: currentStep,
        timestamp: new Date().toISOString()
    }));
    alert('Brouillon sauvegardé avec succès !');
}

function checkDraft() {
    const draft = localStorage.getItem('variantDraft');
    if (draft) {
        try {
            const draftData = JSON.parse(draft);
            const draftDate = new Date(draftData.timestamp);
            const now = new Date();
            const hoursDiff = (now - draftDate) / (1000 * 60 * 60);
            
            // Si le brouillon a moins de 24h
            if (hoursDiff < 24) {
                if (confirm(`Un brouillon existe (${draftDate.toLocaleString()}).\nVoulez-vous le restaurer ?`)) {
                    loadDraft(draftData);
                }
            } else {
                // Supprimer les vieux brouillons
                localStorage.removeItem('variantDraft');
            }
        } catch (e) {
            console.error('Erreur lors du chargement du brouillon', e);
        }
    }
}

function loadDraft(draftData) {
    variantData = draftData.data;
    currentStep = draftData.currentStep;
    
    // Restaurer Step 1
    document.getElementById('product-id').value = variantData.productId || '';
    document.getElementById('sku').value = variantData.sku || '';
    document.getElementById('designation').value = variantData.designation || '';
    document.getElementById('barcode').value = variantData.barcode || '';
    document.getElementById('net-weight').value = variantData.netWeight || '';
    document.getElementById('gross-weight').value = variantData.grossWeight || '';
    document.getElementById('volume').value = variantData.volume || '';
    document.getElementById('is-saleable').checked = variantData.isSaleable;
    document.getElementById('is-purchaseable').checked = variantData.isPurchaseable;
    document.getElementById('is-stockable').checked = variantData.isStockable;
    document.getElementById('is-producible').checked = variantData.isProducible;
    document.getElementById('is-default').checked = variantData.isDefaultVariant;
    
    // Restaurer Step 2
    document.getElementById('stock-unit').value = variantData.stockUnit;
    document.getElementById('purchase-unit').value = variantData.purchaseUnit || '';
    document.getElementById('purchase-coefficient').value = variantData.purchaseCoefficient || '';
    
    // Restaurer Step 3
    document.getElementById('valuation-method').value = variantData.valuationMethod;
    document.getElementById('security-stock').value = variantData.securityStock || '';
    document.getElementById('reorder-point').value = variantData.reorderPoint || '';
    document.getElementById('default-location').value = variantData.defaultLocation || '';
    document.getElementById('default-supplier').value = variantData.defaultSupplier || '';
    document.getElementById('lead-time-days').value = variantData.leadTimeDays || '';
    
    // Restaurer Step 4
    document.getElementById('production-unit').value = variantData.productionUnit;
    document.getElementById('production-coefficient').value = variantData.productionCoefficient || '';
    document.getElementById('standard-lot-size').value = variantData.standardLotSize || '';
    
    showStep(currentStep);
    updateProgress();
    
    alert('Brouillon restauré avec succès !');
}

// Finish Wizard
function finishWizard() {
    if (!validateCurrentStep()) {
        return;
    }
    
    saveCurrentStepData();
    
    console.log('Données du conditionnement:', variantData);
    
    // Simuler la création
    alert('Conditionnement créé avec succès !\n\nSKU: ' + variantData.sku + '\nDésignation: ' + variantData.designation);
    
    // Clear draft
    localStorage.removeItem('variantDraft');
    
    // Rediriger vers la liste
    setTimeout(() => {
        window.location.href = './variants-list.html';
    }, 1000);
}

// Cancel Wizard
function cancelWizard() {
    if (confirm('Êtes-vous sûr de vouloir annuler ?\nLes données non sauvegardées seront perdues.')) {
        localStorage.removeItem('variantDraft');
        window.location.href = './variants-list.html';
    }
}

// Initialize step-specific features when showing
function initializeStep(step) {
    switch(step) {
        case 1:
            toggleTechnicalSpecsSection();
            updateProductionSection(); // Update production visibility based on checkbox
            break;
        case 2:
            updateStockUnitInfo();
            updatePurchaseSection();
            updateUnitsRecap();
            renderConversionsList();
            
            // Sync is-producible checkbox avec step 1
            const isProducibleMain = document.getElementById('is-producible')?.checked;
            const isProducibleStep2 = document.getElementById('is-producible-step2');
            if (isProducibleStep2 && isProducibleMain !== undefined) {
                isProducibleStep2.checked = isProducibleMain;
                toggleProductionUnitFields();
            }
            break;
        case 3:
            updateStockSection();
            updateValuationInfo();
            updateStep3Units();
            togglePreferredSourceGroup();
            renderAlternativeSuppliers();
            renderNotifiedUsers();
            updateLotEquivalent();
            break;
        case 4:
            // Prix - Initialisation si nécessaire
            renderPricesSummary();
            break;
        case 5:
            // Production (anciennement 4)
            updateProductionSection();
            updateProductionStatus(); // Update status with values from step 2
            renderBOMList();
            renderRoutingList();
            break;
        case 6:
            // Média
            renderMediaPreview();
            break;
        case 7:
            // Récapitulatif
            renderFullSummary();
            break;
    }
}

// Override showStep to include initialization
const originalShowStep = showStep;
showStep = function(step) {
    originalShowStep(step);
    initializeStep(step);
};

// ============================================================================
// ÉTAPE 1 - HELPERS
// ============================================================================

function toggleTechnicalSpecsSection() {
    const checkbox = document.getElementById('has-technical-specs');
    const section = document.getElementById('technical-specs-section');
    
    if (checkbox && section) {
        section.style.display = checkbox.checked ? 'block' : 'none';
    }
}

// ============================================================================
// ÉTAPE 2 - UNITÉS & CONVERSIONS HELPERS
// ============================================================================

// Variables globales pour les conversions
let unitConversions = [];
let editingConversionIndex = null;

function toggleProductionUnitFields() {
    const checkbox = document.getElementById('is-producible-step2');
    const fields = document.getElementById('production-unit-fields');
    
    if (checkbox && fields) {
        fields.style.display = checkbox.checked ? 'block' : 'none';
        
        // Sync avec le checkbox principal de l'étape 1
        const mainCheckbox = document.getElementById('is-producible');
        if (mainCheckbox) {
            mainCheckbox.checked = checkbox.checked;
            
            // Update variantData
            variantData.isProducible = checkbox.checked;
            
            // Update production step visibility
            updateProductionSection();
        }
    }
}

function updateProductionConversionPreview() {
    const prodUnit = document.getElementById('production-unit-select')?.value;
    const prodCoef = parseFloat(document.getElementById('production-coefficient-step2')?.value);
    const stockUnit = document.getElementById('stock-unit')?.value || 'UNITE';
    
    const conversionText = document.getElementById('production-conversion-text-step2');
    const preview = document.getElementById('production-conversion-preview');
    const previewText = document.getElementById('production-conversion-preview-text');
    
    if (conversionText && prodUnit) {
        conversionText.textContent = `${prodUnit} = 1 ${stockUnit}`;
    }
    
    if (preview && previewText && prodCoef && prodUnit) {
        const exampleQty = 200;
        const neededProdQty = prodCoef * exampleQty;
        
        previewText.innerHTML = `
            <strong>Exemple de calcul :</strong><br>
            • 1 ${stockUnit} = ${prodCoef} ${prodUnit}<br>
            • Pour produire ${exampleQty} ${stockUnit}, il faudra fabriquer ${neededProdQty} ${prodUnit}
        `;
        preview.style.display = 'block';
    } else if (preview) {
        preview.style.display = 'none';
    }
}

// Conversions management
function openConversionModal(mode = 'add', index = null) {
    document.getElementById('modal-conversion').style.display = 'flex';
    
    if (mode === 'edit' && index !== null) {
        editingConversionIndex = index;
        const conversion = unitConversions[index];
        
        document.getElementById('conversion-modal-title').textContent = 'Modifier la Conversion';
        document.getElementById('conversion-save-btn').innerHTML = '<i class="fa-solid fa-save"></i> Enregistrer';
        
        document.getElementById('conversion-from-unit').value = conversion.fromUnit;
        document.getElementById('conversion-to-unit').value = conversion.toUnit;
        document.getElementById('conversion-factor').value = conversion.factor;
        document.getElementById('conversion-is-default').checked = conversion.isDefault;
        
        updateConversionPreview();
    } else {
        editingConversionIndex = null;
        document.getElementById('conversion-modal-title').textContent = 'Ajouter une Conversion';
        document.getElementById('conversion-save-btn').innerHTML = '<i class="fa-solid fa-plus"></i> Ajouter';
        document.getElementById('conversion-form').reset();
    }
}

function closeConversionModal() {
    document.getElementById('modal-conversion').style.display = 'none';
    document.getElementById('conversion-form').reset();
    editingConversionIndex = null;
}

function updateConversionPreview() {
    const fromUnit = document.getElementById('conversion-from-unit').value;
    const toUnit = document.getElementById('conversion-to-unit').value;
    const factor = parseFloat(document.getElementById('conversion-factor').value);
    
    const preview = document.getElementById('conversion-preview');
    const previewText = document.getElementById('conversion-preview-text');
    const helpText = document.getElementById('conversion-help');
    
    if (fromUnit && toUnit && factor) {
        helpText.textContent = `${factor} ${fromUnit} = 1 ${toUnit}`;
        
        previewText.innerHTML = `
            <strong>Cette conversion signifie :</strong><br>
            • ${factor} ${fromUnit} = 1 ${toUnit}<br>
            • 1 ${toUnit} = ${factor} ${fromUnit}<br>
            • ${factor * 5} ${fromUnit} = 5 ${toUnit}
        `;
        preview.style.display = 'block';
    } else {
        preview.style.display = 'none';
        helpText.textContent = 'Ex: 100 SAC = 1 PALETTE';
    }
}

function saveConversion() {
    const fromUnit = document.getElementById('conversion-from-unit').value;
    const toUnit = document.getElementById('conversion-to-unit').value;
    const factor = parseFloat(document.getElementById('conversion-factor').value);
    const isDefault = document.getElementById('conversion-is-default').checked;
    
    if (!fromUnit || !toUnit || !factor) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }
    
    if (fromUnit === toUnit) {
        alert('Les unités source et cible doivent être différentes');
        return;
    }
    
    const conversion = {
        fromUnit,
        toUnit,
        factor,
        isDefault
    };
    
    if (editingConversionIndex !== null) {
        unitConversions[editingConversionIndex] = conversion;
    } else {
        // Si c'est la nouvelle conversion par défaut, retirer le flag des autres
        if (isDefault) {
            unitConversions.forEach(c => c.isDefault = false);
        }
        unitConversions.push(conversion);
    }
    
    renderConversionsList();
    updateUnitsRecap();
    closeConversionModal();
}

function editConversion(index) {
    openConversionModal('edit', index);
}

function removeConversion(index) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette conversion ?')) {
        unitConversions.splice(index, 1);
        renderConversionsList();
        updateUnitsRecap();
    }
}

function setConversionAsDefault(index) {
    unitConversions.forEach((c, i) => {
        c.isDefault = (i === index);
    });
    renderConversionsList();
}

function renderConversionsList() {
    const emptyState = document.getElementById('conversions-empty-state');
    const table = document.getElementById('conversions-list-table');
    const tbody = document.getElementById('conversions-list-body');
    
    if (unitConversions.length === 0) {
        emptyState.style.display = 'block';
        table.style.display = 'none';
        return;
    }
    
    emptyState.style.display = 'none';
    table.style.display = 'table';
    
    tbody.innerHTML = unitConversions.map((conv, index) => `
        <tr style="border-bottom: 1px solid var(--gray-200);">
            <td style="padding: 12px; font-weight: 600;">${conv.fromUnit}</td>
            <td style="padding: 12px; font-weight: 600;">${conv.toUnit}</td>
            <td style="padding: 12px;"><strong>${conv.factor}</strong></td>
            <td style="padding: 12px; text-align: center;">
                ${conv.isDefault ? '✅' : '<button type="button" class="btn btn-secondary" style="padding: 4px 8px; font-size: 11px;" onclick="setConversionAsDefault(' + index + ')">Définir</button>'}
            </td>
            <td style="padding: 12px; text-align: center;">
                <button type="button" class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px; margin-right: 4px;" onclick="editConversion(${index})">
                    <i class="fa-solid fa-edit"></i>
                </button>
                <button type="button" class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px; color: #EF4444;" onclick="removeConversion(${index})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function updateUnitsRecap() {
    const stockUnit = document.getElementById('stock-unit')?.value || 'UNITE';
    const saleUnit = document.getElementById('sale-unit')?.value || 'UNITE';
    const purchaseUnit = document.getElementById('purchase-unit')?.value;
    const purchaseCoef = document.getElementById('purchase-coefficient')?.value;
    const prodUnit = document.getElementById('production-unit-select')?.value;
    const prodCoef = document.getElementById('production-coefficient-step2')?.value;
    const isProducible = document.getElementById('is-producible-step2')?.checked;
    
    // Update recap
    document.getElementById('recap-stock-unit').textContent = stockUnit;
    document.getElementById('recap-sale-unit').textContent = saleUnit;
    
    const purchaseRow = document.getElementById('recap-purchase-row');
    if (purchaseUnit && purchaseCoef) {
        document.getElementById('recap-purchase-unit').textContent = `${purchaseUnit} (1 = ${purchaseCoef} ${stockUnit})`;
        purchaseRow.style.display = 'flex';
    } else {
        purchaseRow.style.display = 'none';
    }
    
    const productionRow = document.getElementById('recap-production-row');
    if (isProducible && prodUnit && prodCoef) {
        document.getElementById('recap-production-unit').textContent = `${prodCoef} ${prodUnit} = 1 ${stockUnit}`;
        productionRow.style.display = 'flex';
    } else {
        productionRow.style.display = 'none';
    }
    
    // Update example
    const exampleContent = document.getElementById('example-content');
    let exampleText = '';
    
    if (purchaseUnit && purchaseCoef) {
        exampleText += `<strong>Exemple :</strong><br>Si vous achetez 5 ${purchaseUnit}, le stock augmente de ${purchaseCoef * 5} ${stockUnit}`;
    }
    
    if (isProducible && prodUnit && prodCoef) {
        if (exampleText) exampleText += '<br><br>';
        const exampleQty = 800;
        const neededProdQty = prodCoef * exampleQty;
        exampleText += `<strong>Production :</strong><br>Pour produire ${exampleQty} ${stockUnit}, il faudra fabriquer ${neededProdQty} ${prodUnit}`;
    }
    
    if (unitConversions.length > 0) {
        if (exampleText) exampleText += '<br><br>';
        exampleText += '<strong>Conversions configurées :</strong><br>';
        unitConversions.forEach(conv => {
            exampleText += `• ${conv.factor} ${conv.fromUnit} = 1 ${conv.toUnit}${conv.isDefault ? ' ⭐' : ''}<br>`;
        });
    }
    
    exampleContent.innerHTML = exampleText || 'Configurez les unités pour voir un exemple de calcul';
}

// ============================================================================
// ÉTAPE 3 - STOCKS & APPROVISIONNEMENT HELPERS
// ============================================================================

// Variables globales pour étape 3
let alternativeSuppliers = [];
let notifiedUsers = [];

function updateLotEquivalent() {
    const lotSize = parseFloat(document.getElementById('standard-lot-size-step3')?.value);
    const prodCoef = variantData.productionCoefficient || parseFloat(document.getElementById('production-coefficient-step2')?.value);
    const prodUnit = variantData.productionUnit || document.getElementById('production-unit-select')?.value || 'KG';
    
    const equivText = document.getElementById('lot-equiv-text');
    if (equivText && lotSize && prodCoef) {
        const equiv = lotSize * prodCoef;
        equivText.textContent = `Équivalent : ${equiv} ${prodUnit}`;
    } else if (equivText) {
        equivText.textContent = `Équivalent : - ${prodUnit}`;
    }
}

function togglePreferredSourceGroup() {
    const isProducible = variantData.isProducible || document.getElementById('is-producible')?.checked;
    const isPurchaseable = variantData.isPurchaseable || document.getElementById('is-purchaseable')?.checked;
    
    const group = document.getElementById('preferred-source-group');
    if (group) {
        group.style.display = (isProducible && isPurchaseable) ? 'block' : 'none';
    }
    
    const mfgLeadTimeGroup = document.getElementById('manufacturing-lead-time-group');
    if (mfgLeadTimeGroup) {
        mfgLeadTimeGroup.style.display = isProducible ? 'block' : 'none';
    }
    
    const prodLotsSection = document.getElementById('production-lots-section');
    if (prodLotsSection) {
        prodLotsSection.style.display = isProducible ? 'block' : 'none';
    }
}

function addAlternativeSupplier() {
    const select = document.getElementById('alternative-supplier-select');
    const selectedValue = select.value;
    const selectedText = select.options[select.selectedIndex].text;
    
    if (!selectedValue) {
        alert('Veuillez sélectionner un fournisseur');
        return;
    }
    
    if (alternativeSuppliers.includes(selectedValue)) {
        alert('Ce fournisseur est déjà dans la liste');
        return;
    }
    
    alternativeSuppliers.push(selectedValue);
    renderAlternativeSuppliers();
    select.value = '';
}

function removeAlternativeSupplier(supplier) {
    alternativeSuppliers = alternativeSuppliers.filter(s => s !== supplier);
    renderAlternativeSuppliers();
}

function renderAlternativeSuppliers() {
    const container = document.getElementById('alternative-suppliers-list');
    
    if (!container) return;
    
    if (alternativeSuppliers.length === 0) {
        container.innerHTML = '<small style="color: var(--gray-500);">Aucun fournisseur alternatif</small>';
        return;
    }
    
    container.innerHTML = alternativeSuppliers.map(supplier => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background: var(--gray-100); border-radius: 4px; margin-bottom: 4px;">
            <span>${supplier}</span>
            <button type="button" class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px;" onclick="removeAlternativeSupplier('${supplier}')">
                <i class="fa-solid fa-times"></i>
            </button>
        </div>
    `).join('');
}

function addNotifiedUser() {
    const input = document.getElementById('notified-user-input');
    const userName = input.value.trim();
    
    if (!userName) {
        alert('Veuillez saisir un nom d\'utilisateur');
        return;
    }
    
    if (notifiedUsers.includes(userName)) {
        alert('Cet utilisateur est déjà dans la liste');
        return;
    }
    
    notifiedUsers.push(userName);
    renderNotifiedUsers();
    input.value = '';
}

function removeNotifiedUser(userName) {
    notifiedUsers = notifiedUsers.filter(u => u !== userName);
    renderNotifiedUsers();
}

function renderNotifiedUsers() {
    const container = document.getElementById('notified-users-list');
    
    if (!container) return;
    
    if (notifiedUsers.length === 0) {
        container.innerHTML = '<small style="color: var(--gray-500);">Aucun utilisateur configuré</small>';
        return;
    }
    
    container.innerHTML = notifiedUsers.map(user => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background: var(--gray-100); border-radius: 4px; margin-bottom: 4px;">
            <span><i class="fa-solid fa-user"></i> ${user}</span>
            <button type="button" class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px;" onclick="removeNotifiedUser('${user}')">
                <i class="fa-solid fa-times"></i>
            </button>
        </div>
    `).join('');
}

function toggleForecastParams() {
    const checkbox = document.getElementById('auto-calculate-reorder');
    const params = document.getElementById('forecast-params');
    
    if (checkbox && params) {
        params.style.display = checkbox.checked ? 'block' : 'none';
    }
}

function updateStep3Units() {
    const stockUnit = variantData.stockUnit || document.getElementById('stock-unit')?.value || 'UNITE';
    
    // Update all unit displays in step 3
    const alertUnitElem = document.getElementById('alert-unit');
    const minOrderUnitElem = document.getElementById('min-order-unit');
    const demandUnitElem = document.getElementById('demand-unit');
    
    if (alertUnitElem) alertUnitElem.textContent = stockUnit;
    if (minOrderUnitElem) minOrderUnitElem.textContent = stockUnit;
    if (demandUnitElem) demandUnitElem.textContent = `${stockUnit}/jour`;
}

// ============================================================================
// ÉTAPE 4 - PRIX HELPERS
// ============================================================================

// Variables globales pour étape 5 (Prix)
function calculatePrixVente() {
    const prixAchat = parseFloat(document.getElementById('prix-achat')?.value) || 0;
    const coefficient = parseFloat(document.getElementById('coefficient')?.value) || 0;
    const prixVenteHTInput = document.getElementById('prix-vente-ht');
    const preview = document.getElementById('prix-calculation-preview');
    const previewText = document.getElementById('prix-calculation-text');
    
    if (prixAchat > 0 && coefficient > 0) {
        const prixVenteHT = prixAchat * coefficient;
        if (prixVenteHTInput) {
            prixVenteHTInput.value = prixVenteHT.toFixed(2);
        }
        
        if (preview && previewText) {
            const marge = ((prixVenteHT - prixAchat) / prixVenteHT * 100).toFixed(2);
            previewText.innerHTML = `
                <strong>Calcul :</strong> ${prixAchat.toFixed(2)} FCFA × ${coefficient} = ${prixVenteHT.toFixed(2)} FCFA<br>
                <strong>Marge :</strong> ${marge}%
            `;
            preview.style.display = 'block';
        }
    } else {
        if (prixVenteHTInput) {
            prixVenteHTInput.value = '';
        }
        if (preview) {
            preview.style.display = 'none';
        }
    }
}

// Variables globales pour étape 4 (anciennes fonctions Prix - à supprimer ou adapter)
let priceLists = [];

function updateMarginPreview() {
    const salePrice = parseFloat(document.getElementById('standard-sale-price')?.value);
    const margin = parseFloat(document.getElementById('target-margin')?.value);
    const purchasePrice = parseFloat(document.getElementById('last-purchase-price')?.value);
    
    const preview = document.getElementById('margin-preview');
    const previewText = document.getElementById('margin-preview-text');
    
    if (preview && previewText && salePrice && margin) {
        const targetCost = salePrice * (1 - margin / 100);
        
        let html = `<strong>Calcul de marge :</strong><br>`;
        html += `• Prix de vente : ${salePrice.toFixed(2)} FCFA<br>`;
        html += `• Marge objectif : ${margin}%<br>`;
        html += `• Coût cible maximum : ${targetCost.toFixed(2)} FCFA`;
        
        if (purchasePrice) {
            const actualMargin = ((salePrice - purchasePrice) / salePrice * 100).toFixed(1);
            html += `<br><br><strong>Marge actuelle :</strong> ${actualMargin}%`;
            
            if (parseFloat(actualMargin) < margin) {
                html += ` <span style="color: #EF4444;">⚠️ Inférieure à l'objectif</span>`;
            } else {
                html += ` <span style="color: #10B981;">✅ Objectif atteint</span>`;
            }
        }
        
        previewText.innerHTML = html;
        preview.style.display = 'block';
    } else if (preview) {
        preview.style.display = 'none';
    }
}

function updateDiscountWarning() {
    const discount = parseFloat(document.getElementById('max-discount')?.value);
    const warning = document.getElementById('discount-warning');
    
    if (warning && discount > 20) {
        warning.style.display = 'block';
    } else if (warning) {
        warning.style.display = 'none';
    }
}

function addPriceList() {
    const select = document.getElementById('price-list-select');
    const selectedValue = select.value;
    const selectedText = select.options[select.selectedIndex].text;
    
    if (!selectedValue) {
        alert('Veuillez sélectionner une liste de prix');
        return;
    }
    
    if (priceLists.find(pl => pl.id === selectedValue)) {
        alert('Cette liste de prix est déjà ajoutée');
        return;
    }
    
    priceLists.push({
        id: selectedValue,
        name: selectedText
    });
    
    renderPriceLists();
    select.value = '';
}

function removePriceList(priceListId) {
    priceLists = priceLists.filter(pl => pl.id !== priceListId);
    renderPriceLists();
}

function renderPriceLists() {
    const container = document.getElementById('price-lists-container');
    
    if (!container) return;
    
    if (priceLists.length === 0) {
        container.innerHTML = '<small style="color: var(--gray-500);">Aucune liste de prix configurée</small>';
        return;
    }
    
    container.innerHTML = priceLists.map(pl => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background: var(--gray-100); border-radius: 4px; margin-bottom: 4px;">
            <span><i class="fa-solid fa-list"></i> ${pl.name}</span>
            <button type="button" class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px;" onclick="removePriceList('${pl.id}')">
                <i class="fa-solid fa-times"></i>
            </button>
        </div>
    `).join('');
}

function updatePriceUnits() {
    const saleUnit = variantData.saleUnit || document.getElementById('sale-unit')?.value || 'UNITE';
    
    const salePriceUnitElem = document.getElementById('sale-price-unit');
    if (salePriceUnitElem) {
        salePriceUnitElem.textContent = saleUnit;
    }
}

function renderPricesSummary() {
    updatePriceUnits();
    renderPriceLists();
    updateMarginPreview();
    updateDiscountWarning();
}

// ============================================================================
// ÉTAPE 6 - RÉCAPITULATIF HELPERS
// ============================================================================

function renderFullSummary() {
    saveCurrentStepData();
    
    const summaryContainer = document.getElementById('full-summary-container');
    if (!summaryContainer) return;
    
    const product = mockProducts.find(p => p.id === variantData.productId);
    
    let html = '<div style="display: flex; flex-direction: column; gap: 20px;">';
    
    // Section 1 : Informations générales
    html += generateSummarySectionGeneralInfo(product);
    
    // Section 2 : Unités & Conversions
    html += generateSummarySectionUnits();
    
    // Section 3 : Stocks & Approvisionnement
    html += generateSummarySectionStocks();
    
    // Section 4 : Prix
    html += generateSummarySectionPrices();
    
    // Section 5 : Production
    if (variantData.isProducible) {
        html += generateSummarySectionProduction();
    }
    
    html += '</div>';
    
    summaryContainer.innerHTML = html;
}

function generateSummarySectionGeneralInfo(product) {
    const flags = [];
    if (variantData.isSaleable) flags.push('✅ Vendable');
    if (variantData.isPurchaseable) flags.push('✅ Achetable');
    if (variantData.isStockable) flags.push('✅ Stockable');
    if (variantData.isProducible) flags.push('✅ Productible');
    
    return `
        <div class="summary-section">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div class="summary-title">✅ INFORMATIONS GÉNÉRALES</div>
                <button type="button" class="btn btn-secondary" style="padding: 6px 12px; font-size: 12px;" onclick="goToStep(1)">
                    <i class="fa-solid fa-edit"></i> Modifier
                </button>
            </div>
            <div class="summary-row">
                <span class="summary-label">Code :</span>
                <span class="summary-value"><strong>${variantData.sku}</strong></span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Désignation :</span>
                <span class="summary-value">${variantData.designation}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Statut :</span>
                <span class="summary-value">${variantData.status}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Article parent :</span>
                <span class="summary-value">${product ? product.code + ' - ' + product.designation : '-'}</span>
            </div>
            ${variantData.productType ? `
            <div class="summary-row">
                <span class="summary-label">Type de produit :</span>
                <span class="summary-value">${variantData.productType}</span>
            </div>
            ` : ''}
            ${variantData.detailedDescription ? `
            <div class="summary-row">
                <span class="summary-label">Description :</span>
                <span class="summary-value">${variantData.detailedDescription}</span>
            </div>
            ` : ''}
            ${variantData.hasTechnicalSpecs ? `
            <div style="margin-top: 12px; padding: 12px; background: var(--gray-100); border-radius: 6px;">
                <div style="font-weight: 600; margin-bottom: 8px;">Spécifications techniques :</div>
                ${variantData.surfaceYield ? `<div>• Rendement surfacique : ${variantData.surfaceYield} ${variantData.surfaceYieldUnit}</div>` : ''}
                ${variantData.realizationTime ? `<div>• Durée de réalisation : ${variantData.realizationTime} h/unité</div>` : ''}
                ${variantData.dryingTime ? `<div>• Durée de séchage : ${variantData.dryingTime} h</div>` : ''}
                ${variantData.recommendedCoats ? `<div>• Nombre de couches : ${variantData.recommendedCoats}</div>` : ''}
            </div>
            ` : ''}
            <div class="summary-row">
                <span class="summary-label">Flags de gestion :</span>
                <span class="summary-value">${flags.join(' ')}</span>
            </div>
        </div>
    `;
}

function generateSummarySectionUnits() {
    return `
        <div class="summary-section">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div class="summary-title">✅ UNITÉS & CONVERSIONS</div>
                <button type="button" class="btn btn-secondary" style="padding: 6px 12px; font-size: 12px;" onclick="goToStep(2)">
                    <i class="fa-solid fa-edit"></i> Modifier
                </button>
            </div>
            <div class="summary-row">
                <span class="summary-label">Unité de stock :</span>
                <span class="summary-value">${variantData.stockUnit}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Unité de vente :</span>
                <span class="summary-value">${variantData.saleUnit}</span>
            </div>
            ${variantData.purchaseUnit ? `
            <div class="summary-row">
                <span class="summary-label">Unité d'achat :</span>
                <span class="summary-value">${variantData.purchaseUnit} (1 = ${variantData.purchaseCoefficient} ${variantData.stockUnit})</span>
            </div>
            ` : ''}
            ${variantData.isProducible && variantData.productionUnit ? `
            <div class="summary-row">
                <span class="summary-label">Unité de production :</span>
                <span class="summary-value">${variantData.productionCoefficient} ${variantData.productionUnit} = 1 ${variantData.stockUnit}</span>
            </div>
            ` : ''}
            ${variantData.conversions && variantData.conversions.length > 0 ? `
            <div style="margin-top: 12px; padding: 12px; background: var(--gray-100); border-radius: 6px;">
                <div style="font-weight: 600; margin-bottom: 8px;">Conversions configurées :</div>
                ${variantData.conversions.map(c => `<div>• ${c.factor} ${c.fromUnit} = 1 ${c.toUnit}${c.isDefault ? ' ⭐' : ''}</div>`).join('')}
            </div>
            ` : ''}
        </div>
    `;
}

function generateSummarySectionStocks() {
    return `
        <div class="summary-section">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div class="summary-title">✅ STOCKS & APPROVISIONNEMENT</div>
                <button type="button" class="btn btn-secondary" style="padding: 6px 12px; font-size: 12px;" onclick="goToStep(3)">
                    <i class="fa-solid fa-edit"></i> Modifier
                </button>
            </div>
            ${variantData.isStockable ? `
            <div class="summary-row">
                <span class="summary-label">Valorisation :</span>
                <span class="summary-value">${variantData.valuationMethod}</span>
            </div>
            ${variantData.securityStock ? `
            <div class="summary-row">
                <span class="summary-label">Stock de sécurité :</span>
                <span class="summary-value">${variantData.securityStock} ${variantData.stockUnit}</span>
            </div>
            ` : ''}
            ${variantData.reorderPoint ? `
            <div class="summary-row">
                <span class="summary-label">Point de commande :</span>
                <span class="summary-value">${variantData.reorderPoint} ${variantData.stockUnit}</span>
            </div>
            ` : ''}
            ${variantData.maximumStock ? `
            <div class="summary-row">
                <span class="summary-label">Stock maximum :</span>
                <span class="summary-value">${variantData.maximumStock} ${variantData.stockUnit}</span>
            </div>
            ` : ''}
            ` : '<div style="color: var(--gray-500);">Non stockable</div>'}
            ${variantData.isProducible && variantData.standardLotSize ? `
            <div class="summary-row">
                <span class="summary-label">Lot standard :</span>
                <span class="summary-value">${variantData.standardLotSize} ${variantData.stockUnit}</span>
            </div>
            ` : ''}
            <div class="summary-row">
                <span class="summary-label">Méthode de réappro :</span>
                <span class="summary-value">${variantData.replenishmentMethod || 'REORDER_POINT'}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Source préférée :</span>
                <span class="summary-value">${variantData.preferredSource === 'MAKE' ? 'Toujours produire' : variantData.preferredSource === 'BUY' ? 'Toujours acheter' : 'Selon contexte'}</span>
            </div>
            ${variantData.defaultSupplier ? `
            <div class="summary-row">
                <span class="summary-label">Fournisseur par défaut :</span>
                <span class="summary-value">${variantData.defaultSupplier}</span>
            </div>
            ` : ''}
            ${variantData.leadTimeDays ? `
            <div class="summary-row">
                <span class="summary-label">Délai d'approvisionnement :</span>
                <span class="summary-value">${variantData.leadTimeDays} jours</span>
            </div>
            ` : ''}
            ${variantData.alternativeSuppliers && variantData.alternativeSuppliers.length > 0 ? `
            <div style="margin-top: 12px; padding: 12px; background: var(--gray-100); border-radius: 6px;">
                <div style="font-weight: 600; margin-bottom: 8px;">Fournisseurs alternatifs : ${variantData.alternativeSuppliers.join(', ')}</div>
            </div>
            ` : ''}
            ${variantData.notifiedUsers && variantData.notifiedUsers.length > 0 ? `
            <div style="margin-top: 12px; padding: 12px; background: var(--gray-100); border-radius: 6px;">
                <div style="font-weight: 600; margin-bottom: 8px;">Utilisateurs notifiés : ${variantData.notifiedUsers.join(', ')}</div>
            </div>
            ` : ''}
        </div>
    `;
}

function generateSummarySectionPrices() {
    const hasPrices = variantData.standardSalePrice || variantData.lastPurchasePrice || variantData.quoteStandardPrice;
    
    return `
        <div class="summary-section">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div class="summary-title">${hasPrices ? '✅' : '⚠️'} PRIX</div>
                <button type="button" class="btn btn-secondary" style="padding: 6px 12px; font-size: 12px;" onclick="goToStep(4)">
                    <i class="fa-solid fa-edit"></i> Modifier
                </button>
            </div>
            ${hasPrices ? `
                ${variantData.standardSalePrice ? `
                <div class="summary-row">
                    <span class="summary-label">Prix de vente standard :</span>
                    <span class="summary-value">${variantData.standardSalePrice.toFixed(2)} FCFA/${variantData.saleUnit || variantData.stockUnit}</span>
                </div>
                ` : ''}
                ${variantData.targetMargin ? `
                <div class="summary-row">
                    <span class="summary-label">Marge objectif :</span>
                    <span class="summary-value">${variantData.targetMargin}%</span>
                </div>
                ` : ''}
                ${variantData.promotionalPrice ? `
                <div class="summary-row">
                    <span class="summary-label">Prix promotionnel :</span>
                    <span class="summary-value">${variantData.promotionalPrice.toFixed(2)} FCFA (${variantData.promoStartDate || '?'} au ${variantData.promoEndDate || '?'})</span>
                </div>
                ` : ''}
                ${variantData.lastPurchasePrice ? `
                <div class="summary-row">
                    <span class="summary-label">Dernier prix d'achat :</span>
                    <span class="summary-value">${variantData.lastPurchasePrice.toFixed(2)} FCFA</span>
                </div>
                ` : ''}
                ${variantData.quoteStandardPrice ? `
                <div class="summary-row">
                    <span class="summary-label">Prix devis :</span>
                    <span class="summary-value">${variantData.quoteStandardPrice.toFixed(2)} FCFA (discount max: ${variantData.maxDiscount || 0}%)</span>
                </div>
                ` : ''}
                ${variantData.priceLists && variantData.priceLists.length > 0 ? `
                <div style="margin-top: 12px; padding: 12px; background: var(--gray-100); border-radius: 6px;">
                    <div style="font-weight: 600; margin-bottom: 8px;">Listes de prix :</div>
                    ${variantData.priceLists.map(pl => `<div>• ${pl.name}</div>`).join('')}
                </div>
                ` : ''}
            ` : '<div style="color: var(--gray-500);">Aucun prix configuré (optionnel)</div>'}
        </div>
    `;
}

function generateSummarySectionProduction() {
    const bomConfigured = bomComponents.length > 0;
    const routingConfigured = routingPhases.length > 0;
    const configComplete = bomConfigured && routingConfigured;
    
    return `
        <div class="summary-section">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div class="summary-title">${configComplete ? '✅' : '⚠️'} CONFIGURATION PRODUCTION</div>
                <button type="button" class="btn btn-secondary" style="padding: 6px 12px; font-size: 12px;" onclick="goToStep(5)">
                    ${configComplete ? '<i class="fa-solid fa-edit"></i> Modifier' : '<i class="fa-solid fa-cog"></i> Configurer'}
                </button>
            </div>
            ${configComplete ? `
                <div class="summary-row">
                    <span class="summary-label">Nomenclature (BOM) :</span>
                    <span class="summary-value">✅ ${bomComponents.length} composants</span>
                </div>
                <div class="summary-row">
                    <span class="summary-label">Gamme de fabrication :</span>
                    <span class="summary-value">✅ ${routingPhases.length} phases</span>
                </div>
            ` : `
                <div class="warning-box" style="margin: 12px 0 0 0;">
                    <i class="fa-solid fa-exclamation-triangle"></i>
                    <strong>Configuration production incomplète</strong>
                    <div style="margin-top: 8px; font-size: 13px;">
                        ${!bomConfigured ? '❌ Nomenclature (BOM) : Non configurée<br>' : ''}
                        ${!routingConfigured ? '❌ Gamme de fabrication (Routing) : Non configurée<br>' : ''}
                    </div>
                    <div style="margin-top: 8px; font-size: 13px;">
                        Vous pourrez configurer la production après création du conditionnement.
                    </div>
                </div>
            `}
        </div>
    `;
}

function goToStep(stepNumber) {
    // Don't allow going to step 6 (Production) if not producible
    if (stepNumber === 6 && !variantData.isProducible) {
        console.warn('Cannot go to production step when variant is not producible');
        return;
    }
    
    saveCurrentStepData();
    currentStep = stepNumber;
    showStep(currentStep);
    updateProgress();
}

// ============================================================================
// PRODUCTION BOM & ROUTING - Phase 2 Implementation
// ============================================================================

// Variables globales pour BOM et Routing
let bomComponents = [];
let routingPhases = [];

// Variables globales pour Média
let uploadedImages = [];
let uploadedDocuments = [];
let selectedComponent = null;
let selectedWorkstation = null;
let editingBOMIndex = null;
let editingRoutingIndex = null;

// Mock Components Data
const mockComponents = [
    { id: 'mp-cim-blc', code: 'MP-CIMENT-BLC', name: 'Ciment Blanc', unit: 'KG', stock: 2500, pmp: 1200, isPurchaseable: true },
    { id: 'mp-cim-gri', code: 'MP-CIMENT-GRI', name: 'Ciment Gris', unit: 'KG', stock: 1800, pmp: 980, isPurchaseable: true },
    { id: 'mp-cim-rap', code: 'MP-CIMENT-RAPIDE', name: 'Ciment Prise Rapide', unit: 'KG', stock: 320, pmp: 1500, isPurchaseable: true },
    { id: 'mp-sab-fin', code: 'MP-SABLE-FIN-01', name: 'Sable Fin Calibre 01', unit: 'KG', stock: 3800, pmp: 450, isPurchaseable: true },
    { id: 'mp-add-ret', code: 'MP-ADDITIF-RETEN', name: 'Additif Rétenteur', unit: 'KG', stock: 450, pmp: 2500, isPurchaseable: true },
    { id: 'mp-pig-blanc', code: 'MP-PIGMENT-BLANC', name: 'Pigment Blanc Titanium', unit: 'KG', stock: 180, pmp: 3800, isPurchaseable: true },
    { id: 'emb-sac-5kg', code: 'EMB-SAC-5KG-MP', name: 'Sac Emballage 5kg', unit: 'UNITE', stock: 1200, pmp: 350, isPurchaseable: true },
    { id: 'emb-pot-5l', code: 'EMB-POT-5L', name: 'Pot Plastique 5 Litres', unit: 'UNITE', stock: 850, pmp: 420, isPurchaseable: true },
    { id: 'mp-resine', code: 'MP-RESINE-ACR', name: 'Résine Acrylique', unit: 'KG', stock: 650, pmp: 2200, isPurchaseable: true },
    { id: 'mp-eau', code: 'MP-EAU-PURE', name: 'Eau Déminéralisée', unit: 'LITRE', stock: 5000, pmp: 50, isPurchaseable: true }
];

// Mock Workstations Data
const mockWorkstations = [
    { id: 'ws-pesage-01', code: 'POSTE-PESAGE-01', name: 'Poste de Pesage 01', type: 'MANUEL', charge: 67, machineCostPerHour: 0, laborCostPerHour: 9000, status: 'DISPONIBLE' },
    { id: 'ws-melange-01', code: 'POSTE-MELANGE-01', name: 'Mélangeur Industriel 01', type: 'MACHINE', charge: 45, machineCostPerHour: 4800, laborCostPerHour: 9000, status: 'DISPONIBLE' },
    { id: 'ws-broyage-01', code: 'POSTE-BROYAGE-01', name: 'Broyeur à Boulets 01', type: 'MACHINE', charge: 82, machineCostPerHour: 9000, laborCostPerHour: 15000, status: 'OCCUPE' },
    { id: 'ws-cond-03', code: 'POSTE-COND-03', name: 'Chaîne Conditionnement 03', type: 'MACHINE', charge: 100, machineCostPerHour: 1200, laborCostPerHour: 4500, status: 'SATURE' },
    { id: 'ws-peinture-01', code: 'POSTE-PEINTURE-01', name: 'Disperseur Peinture 01', type: 'MACHINE', charge: 35, machineCostPerHour: 6000, laborCostPerHour: 12000, status: 'DISPONIBLE' }
];

// ============================================================================
// BOM FUNCTIONS
// ============================================================================

function openBOMModal(mode, index = null) {
    document.getElementById('modal-bom').style.display = 'flex';
    
    if (mode === 'edit' && index !== null) {
        editingBOMIndex = index;
        const component = bomComponents[index];
        
        document.getElementById('bom-modal-title').textContent = 'Modifier le Composant';
        document.getElementById('bom-save-btn').innerHTML = '<i class="fa-solid fa-save"></i> Enregistrer';
        
        // Load component data
        selectedComponent = mockComponents.find(c => c.id === component.componentId);
        displaySelectedComponent();
        document.getElementById('bom-quantity').value = component.quantity;
        calculateBOMPreview();
        
    } else {
        editingBOMIndex = null;
        document.getElementById('bom-modal-title').textContent = 'Ajouter un Composant au BOM';
        document.getElementById('bom-save-btn').innerHTML = '<i class="fa-solid fa-plus"></i> Ajouter au BOM';
        document.getElementById('bom-form').reset();
        clearBOMComponentSelection();
    }
    
    updateBOMProductionRef();
}

function closeBOMModal() {
    document.getElementById('modal-bom').style.display = 'none';
    document.getElementById('bom-form').reset();
    selectedComponent = null;
    editingBOMIndex = null;
    clearBOMComponentSelection();
}

function searchBOMComponents() {
    const query = document.getElementById('bom-search').value.toLowerCase().trim();
    const resultsDiv = document.getElementById('bom-search-results');
    
    if (query.length < 2) {
        resultsDiv.style.display = 'none';
        return;
    }
    
    const filtered = mockComponents.filter(c => 
        c.code.toLowerCase().includes(query) || 
        c.name.toLowerCase().includes(query)
    );
    
    if (filtered.length === 0) {
        resultsDiv.innerHTML = '<div style="padding: 16px; text-align: center; color: var(--gray-500);">Aucun composant trouvé</div>';
        resultsDiv.style.display = 'block';
        return;
    }
    
    resultsDiv.innerHTML = filtered.map(c => `
        <div style="padding: 12px; border-bottom: 1px solid var(--gray-200); cursor: pointer; transition: background 0.2s;" 
             onmouseover="this.style.background='var(--gray-50)'" 
             onmouseout="this.style.background='white'"
             onclick="selectBOMComponent('${c.id}')">
            <div style="font-weight: 600; margin-bottom: 4px;">${c.code} | ${c.name}</div>
            <div style="font-size: 13px; color: var(--gray-600);">
                Stock: ${c.stock.toLocaleString()} ${c.unit} | PMP: ${c.pmp.toLocaleString()} FCFA/${c.unit}
            </div>
            <div style="font-size: 12px; margin-top: 4px;">
                <span style="background: #10B981; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px;">✓ Achetable</span>
                <span style="margin-left: 8px; color: var(--gray-500);">Unité: ${c.unit}</span>
            </div>
        </div>
    `).join('');
    
    resultsDiv.style.display = 'block';
}

function selectBOMComponent(id) {
    selectedComponent = mockComponents.find(c => c.id === id);
    if (selectedComponent) {
        displaySelectedComponent();
        document.getElementById('bom-search-results').style.display = 'none';
        document.getElementById('bom-search').value = '';
        calculateBOMPreview();
    }
}

function displaySelectedComponent() {
    if (!selectedComponent) return;
    
    document.getElementById('bom-selected-component').style.display = 'block';
    document.getElementById('bom-component-code').textContent = selectedComponent.code;
    document.getElementById('bom-component-name').textContent = selectedComponent.name;
    document.getElementById('bom-component-stock').textContent = `${selectedComponent.stock.toLocaleString()} ${selectedComponent.unit}`;
    document.getElementById('bom-component-pmp').textContent = `${selectedComponent.pmp.toLocaleString()} FCFA/${selectedComponent.unit}`;
    document.getElementById('bom-component-unit').textContent = selectedComponent.unit;
}

function clearBOMComponentSelection() {
    selectedComponent = null;
    document.getElementById('bom-selected-component').style.display = 'none';
    document.getElementById('bom-preview').style.display = 'none';
}

function updateBOMProductionRef() {
    const prodUnit = document.getElementById('production-unit').value || 'KG';
    const prodCoef = parseFloat(document.getElementById('production-coefficient').value) || 1;
    const stockUnit = document.getElementById('stock-unit').value || 'UNITE';
    
    const refText = `${prodCoef} ${prodUnit} (1 ${stockUnit})`;
    document.getElementById('bom-production-ref').textContent = refText;
}

function calculateBOMPreview() {
    if (!selectedComponent) {
        document.getElementById('bom-preview').style.display = 'none';
        return;
    }
    
    const quantity = parseFloat(document.getElementById('bom-quantity').value) || 0;
    if (quantity <= 0) {
        document.getElementById('bom-preview').style.display = 'none';
        return;
    }
    
    const unitCost = selectedComponent.pmp;
    const totalCost = quantity * unitCost;
    const prodCoef = parseFloat(document.getElementById('production-coefficient').value) || 1;
    const stockUnit = document.getElementById('stock-unit').value || 'UNITE';
    
    // Example: pour 800 SAC
    const exampleQty = 800;
    const neededQty = quantity * exampleQty;
    const stockCheck = neededQty <= selectedComponent.stock;
    
    document.getElementById('bom-preview-content').innerHTML = `
        <div style="margin-bottom: 8px;"><strong>Composant:</strong> ${selectedComponent.code}</div>
        <div style="margin-bottom: 8px;"><strong>Quantité:</strong> ${quantity} ${selectedComponent.unit}</div>
        <div style="margin-bottom: 8px;"><strong>Coût unitaire:</strong> ${unitCost.toLocaleString()} FCFA/${selectedComponent.unit} (PMP actuel)</div>
        <div style="margin-bottom: 16px;"><strong>Coût total:</strong> ${totalCost.toLocaleString()} FCFA</div>
        
        <div style="border-top: 1px solid #C7D2FE; padding-top: 12px;">
            <div style="margin-bottom: 4px; color: #3730A3; font-weight: 500;">Pour produire ${exampleQty} ${stockUnit}, il faudra:</div>
            <div style="margin-bottom: 8px;">${exampleQty} × ${quantity} ${selectedComponent.unit} = <strong>${neededQty.toLocaleString()} ${selectedComponent.unit}</strong> de ce composant</div>
            <div style="font-weight: 600; color: ${stockCheck ? '#10B981' : '#EF4444'};">
                Stock disponible: ${selectedComponent.stock.toLocaleString()} ${selectedComponent.unit} ${stockCheck ? '✅ Suffisant' : '⚠️ Insuffisant'}
            </div>
        </div>
    `;
    
    document.getElementById('bom-preview').style.display = 'block';
}

function saveBOMComponent() {
    if (!selectedComponent) {
        alert('Veuillez sélectionner un composant');
        return;
    }
    
    const quantity = parseFloat(document.getElementById('bom-quantity').value);
    if (!quantity || quantity <= 0) {
        alert('Veuillez saisir une quantité valide');
        return;
    }
    
    const component = {
        componentId: selectedComponent.id,
        code: selectedComponent.code,
        name: selectedComponent.name,
        unit: selectedComponent.unit,
        quantity: quantity,
        unitCost: selectedComponent.pmp,
        totalCost: quantity * selectedComponent.pmp,
        stock: selectedComponent.stock
    };
    
    if (editingBOMIndex !== null) {
        bomComponents[editingBOMIndex] = component;
    } else {
        bomComponents.push(component);
    }
    
    renderBOMList();
    updateProductionStatus();
    closeBOMModal();
}

function editBOM(index) {
    openBOMModal('edit', index);
}

function removeBOM(index) {
    if (confirm('Êtes-vous sûr de vouloir retirer ce composant du BOM ?')) {
        bomComponents.splice(index, 1);
        renderBOMList();
        updateProductionStatus();
    }
}

function renderBOMList() {
    const emptyState = document.getElementById('bom-empty-state');
    const table = document.getElementById('bom-list-table');
    const tbody = document.getElementById('bom-list-body');
    const totalContainer = document.getElementById('bom-total-container');
    
    if (bomComponents.length === 0) {
        emptyState.style.display = 'block';
        table.style.display = 'none';
        totalContainer.style.display = 'none';
        return;
    }
    
    emptyState.style.display = 'none';
    table.style.display = 'table';
    totalContainer.style.display = 'block';
    
    // Get production unit from step 2 or variantData
    const prodCoef = variantData.productionCoefficient || parseFloat(document.getElementById('production-coefficient-step2')?.value) || 1;
    const prodUnit = variantData.productionUnit || document.getElementById('production-unit-select')?.value || 'KG';
    const stockUnit = variantData.stockUnit || document.getElementById('stock-unit')?.value || 'UNITE';
    
    document.getElementById('bom-unit-info').textContent = `- Pour ${prodCoef} ${prodUnit} (1 ${stockUnit})`;
    
    tbody.innerHTML = bomComponents.map((comp, index) => `
        <tr style="border-bottom: 1px solid var(--gray-200);">
            <td style="padding: 12px; font-weight: 600;">${index + 1}</td>
            <td style="padding: 12px;">
                <div style="font-weight: 600;">${comp.code}</div>
                <div style="font-size: 12px; color: var(--gray-500);">Stock: ${comp.stock.toLocaleString()} ${comp.unit}</div>
            </td>
            <td style="padding: 12px; color: var(--gray-600);">${comp.name}</td>
            <td style="padding: 12px; font-weight: 500;">${comp.quantity} ${comp.unit}</td>
            <td style="padding: 12px;">${comp.unitCost.toLocaleString()} F</td>
            <td style="padding: 12px; font-weight: 600;">${comp.totalCost.toLocaleString()} F</td>
            <td style="padding: 12px; text-align: center;">
                <div style="position: relative; display: inline-block;">
                    <button type="button" onclick="toggleBOMMenu(${index})" style="background: none; border: none; cursor: pointer; font-size: 18px; padding: 4px 8px;">⋮</button>
                    <div id="bom-menu-${index}" style="display: none; position: absolute; right: 0; top: 100%; background: white; border: 1px solid var(--gray-300); border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); min-width: 150px; z-index: 1000;">
                        <div onclick="editBOM(${index})" style="padding: 10px 16px; cursor: pointer; border-bottom: 1px solid var(--gray-200);" onmouseover="this.style.background='var(--gray-50)'" onmouseout="this.style.background='white'">
                            <i class="fa-solid fa-edit" style="margin-right: 8px;"></i>Modifier
                        </div>
                        <div onclick="removeBOM(${index})" style="padding: 10px 16px; cursor: pointer; color: #EF4444;" onmouseover="this.style.background='#FEE2E2'" onmouseout="this.style.background='white'">
                            <i class="fa-solid fa-trash" style="margin-right: 8px;"></i>Retirer
                        </div>
                    </div>
                </div>
            </td>
        </tr>
    `).join('');
    
    const totalCost = bomComponents.reduce((sum, comp) => sum + comp.totalCost, 0);
    document.getElementById('bom-total-cost').textContent = totalCost.toLocaleString();
    document.getElementById('bom-total-unit').textContent = `pour 1 ${stockUnit} (${prodCoef} ${prodUnit})`;
}

function toggleBOMMenu(index) {
    const menu = document.getElementById(`bom-menu-${index}`);
    // Close all other menus
    document.querySelectorAll('[id^="bom-menu-"]').forEach(m => {
        if (m.id !== `bom-menu-${index}`) m.style.display = 'none';
    });
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

// Close menus when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('[onclick^="toggleBOMMenu"]')) {
        document.querySelectorAll('[id^="bom-menu-"]').forEach(m => m.style.display = 'none');
    }
    if (!e.target.closest('[onclick^="toggleRoutingMenu"]')) {
        document.querySelectorAll('[id^="routing-menu-"]').forEach(m => m.style.display = 'none');
    }
});

// ============================================================================
// ROUTING FUNCTIONS
// ============================================================================

function openRoutingModal(mode, index = null) {
    document.getElementById('modal-routing').style.display = 'flex';
    populateWorkstationSelect();
    
    if (mode === 'edit' && index !== null) {
        editingRoutingIndex = index;
        const phase = routingPhases[index];
        
        document.getElementById('routing-modal-title').textContent = `Modifier la Phase ${phase.sequence}`;
        document.getElementById('routing-save-btn').innerHTML = '<i class="fa-solid fa-save"></i> Enregistrer';
        
        // Load phase data
        document.getElementById('routing-sequence').value = phase.sequence;
        document.getElementById('routing-operation-name').value = phase.operationName;
        document.getElementById('routing-operation-desc').value = phase.operationDesc || '';
        document.getElementById('routing-workstation').value = phase.workstationId;
        selectRoutingWorkstation();
        document.getElementById('routing-setup-time').value = phase.setupTime;
        document.getElementById('routing-unit-time').value = phase.unitTime;
        calculateRoutingPreview();
        
        // Show impact
        document.getElementById('routing-impact').style.display = 'block';
        
    } else {
        editingRoutingIndex = null;
        document.getElementById('routing-modal-title').textContent = 'Ajouter une Phase Opératoire';
        document.getElementById('routing-save-btn').innerHTML = '<i class="fa-solid fa-plus"></i> Ajouter Phase';
        document.getElementById('routing-form').reset();
        
        // Auto sequence
        const nextSeq = routingPhases.length + 1;
        document.getElementById('routing-sequence').value = nextSeq;
        
        document.getElementById('routing-impact').style.display = 'none';
    }
    
    updateRoutingSequenceHelp();
}

function closeRoutingModal() {
    document.getElementById('modal-routing').style.display = 'none';
    document.getElementById('routing-form').reset();
    selectedWorkstation = null;
    editingRoutingIndex = null;
}

function populateWorkstationSelect() {
    const select = document.getElementById('routing-workstation');
    select.innerHTML = '<option value="">-- Sélectionner un poste --</option>';
    
    mockWorkstations.forEach(ws => {
        const option = document.createElement('option');
        option.value = ws.id;
        option.textContent = `${ws.code} - ${ws.name}`;
        select.appendChild(option);
    });
}

function selectRoutingWorkstation() {
    const wsId = document.getElementById('routing-workstation').value;
    if (!wsId) {
        document.getElementById('routing-workstation-details').style.display = 'none';
        selectedWorkstation = null;
        return;
    }
    
    selectedWorkstation = mockWorkstations.find(w => w.id === wsId);
    if (!selectedWorkstation) return;
    
    const statusColor = selectedWorkstation.status === 'DISPONIBLE' ? '#10B981' : (selectedWorkstation.status === 'OCCUPE' ? '#F59E0B' : '#EF4444');
    const statusIcon = selectedWorkstation.status === 'DISPONIBLE' ? '🟢' : (selectedWorkstation.status === 'OCCUPE' ? '🟡' : '🔴');
    
    const totalCostPerHour = selectedWorkstation.machineCostPerHour + selectedWorkstation.laborCostPerHour;
    const totalCostPerMin = Math.round(totalCostPerHour / 60);
    const machineCostPerMin = Math.round(selectedWorkstation.machineCostPerHour / 60);
    const laborCostPerMin = Math.round(selectedWorkstation.laborCostPerHour / 60);
    
    document.getElementById('routing-workstation-details').innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
            <div><strong>Type:</strong> ${selectedWorkstation.type}</div>
            <div><strong>Charge actuelle:</strong> ${selectedWorkstation.charge}%</div>
            <div><strong>Coût machine:</strong> ${selectedWorkstation.machineCostPerHour.toLocaleString()} F/h (${machineCostPerMin} F/min)</div>
            <div><strong>Coût MO:</strong> ${selectedWorkstation.laborCostPerHour.toLocaleString()} F/h (${laborCostPerMin} F/min)</div>
            <div colspan="2"><strong>Statut:</strong> <span style="color: ${statusColor};">${statusIcon} ${selectedWorkstation.status}</span></div>
        </div>
    `;
    document.getElementById('routing-workstation-details').style.display = 'block';
    
    calculateRoutingPreview();
}

function updateRoutingSequenceHelp() {
    const count = routingPhases.length;
    if (count === 0) {
        document.getElementById('routing-sequence-help').textContent = 'Phases actuelles : aucune';
    } else {
        document.getElementById('routing-sequence-help').textContent = `Phases actuelles : ${count} phases (1 à ${count})`;
    }
}

function calculateRoutingPreview() {
    if (!selectedWorkstation) {
        document.getElementById('routing-preview').style.display = 'none';
        return;
    }
    
    const setupTime = parseFloat(document.getElementById('routing-setup-time').value) || 0;
    const unitTime = parseFloat(document.getElementById('routing-unit-time').value) || 0;
    
    if (setupTime === 0 && unitTime === 0) {
        document.getElementById('routing-preview').style.display = 'none';
        return;
    }
    
    const exampleQty = 800;
    const totalTime = setupTime + (unitTime * exampleQty);
    const totalHours = Math.floor(totalTime / 60);
    const totalMins = Math.round(totalTime % 60);
    
    const totalCostPerMin = Math.round((selectedWorkstation.machineCostPerHour + selectedWorkstation.laborCostPerHour) / 60);
    const laborCostPerMin = Math.round(selectedWorkstation.laborCostPerHour / 60);
    const machineCostPerMin = Math.round(selectedWorkstation.machineCostPerHour / 60);
    
    const totalLaborCost = Math.round(totalTime * laborCostPerMin);
    const totalMachineCost = Math.round(totalTime * machineCostPerMin);
    const totalPhaseCost = totalLaborCost + totalMachineCost;
    const unitPhaseCost = Math.round(totalPhaseCost / exampleQty);
    
    const stockUnit = document.getElementById('stock-unit').value || 'UNITE';
    
    document.getElementById('routing-preview-content').innerHTML = `
        <div style="margin-bottom: 12px;">Pour produire ${exampleQty} ${stockUnit}:</div>
        
        <div style="background: white; padding: 12px; border-radius: 4px; margin-bottom: 12px;">
            <div style="font-weight: 600; margin-bottom: 8px;">Temps total:</div>
            <div style="font-family: monospace; font-size: 13px;">
                = Temps réglage + (Temps unitaire × Quantité)<br>
                = ${setupTime} min + (${unitTime} min × ${exampleQty})<br>
                = ${setupTime} min + ${(unitTime * exampleQty).toFixed(0)} min<br>
                = <strong>${totalTime.toFixed(0)} min (${totalHours}h ${totalMins}min)</strong>
            </div>
        </div>
        
        <div style="background: white; padding: 12px; border-radius: 4px;">
            <div style="margin-bottom: 4px;">Coût main d'œuvre: ${totalTime.toFixed(0)} min × ${laborCostPerMin} F/min = <strong>${totalLaborCost.toLocaleString()} FCFA</strong></div>
            <div style="margin-bottom: 4px;">Coût machine: ${totalTime.toFixed(0)} min × ${machineCostPerMin} F/min = <strong>${totalMachineCost.toLocaleString()} FCFA</strong></div>
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #C7D2FE; font-weight: 600;">
                Coût total phase: <strong>${totalPhaseCost.toLocaleString()} FCFA</strong> (${unitPhaseCost} FCFA/${stockUnit})
            </div>
        </div>
    `;
    
    document.getElementById('routing-preview').style.display = 'block';
}

function saveRoutingPhase() {
    const sequence = parseInt(document.getElementById('routing-sequence').value);
    const operationName = document.getElementById('routing-operation-name').value.trim();
    const operationDesc = document.getElementById('routing-operation-desc').value.trim();
    const wsId = document.getElementById('routing-workstation').value;
    const setupTime = parseFloat(document.getElementById('routing-setup-time').value);
    const unitTime = parseFloat(document.getElementById('routing-unit-time').value);
    
    if (!sequence || !operationName || !wsId || setupTime === null || unitTime === null) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }
    
    if (!selectedWorkstation) {
        alert('Veuillez sélectionner un poste de charge');
        return;
    }
    
    const laborCostPerMin = Math.round(selectedWorkstation.laborCostPerHour / 60);
    const machineCostPerMin = Math.round(selectedWorkstation.machineCostPerHour / 60);
    const unitCostPerUnit = Math.round((laborCostPerMin + machineCostPerMin) * unitTime);
    
    const phase = {
        sequence: sequence,
        operationName: operationName,
        operationDesc: operationDesc,
        workstationId: selectedWorkstation.id,
        workstationCode: selectedWorkstation.code,
        workstationName: selectedWorkstation.name,
        workstationType: selectedWorkstation.type,
        workstationStatus: selectedWorkstation.status,
        workstationCharge: selectedWorkstation.charge,
        setupTime: setupTime,
        unitTime: unitTime,
        laborCostPerMin: laborCostPerMin,
        machineCostPerMin: machineCostPerMin,
        unitCostPerUnit: unitCostPerUnit
    };
    
    if (editingRoutingIndex !== null) {
        routingPhases[editingRoutingIndex] = phase;
    } else {
        routingPhases.push(phase);
    }
    
    // Sort by sequence
    routingPhases.sort((a, b) => a.sequence - b.sequence);
    
    renderRoutingList();
    updateProductionStatus();
    closeRoutingModal();
}

function editRouting(index) {
    openRoutingModal('edit', index);
}

function removeRouting(index) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette phase ?')) {
        routingPhases.splice(index, 1);
        // Resequence
        routingPhases.forEach((phase, i) => {
            phase.sequence = i + 1;
        });
        renderRoutingList();
        updateProductionStatus();
    }
}

function renderRoutingList() {
    const emptyState = document.getElementById('routing-empty-state');
    const table = document.getElementById('routing-list-table');
    const tbody = document.getElementById('routing-list-body');
    const totalContainer = document.getElementById('routing-total-container');
    
    if (routingPhases.length === 0) {
        emptyState.style.display = 'block';
        table.style.display = 'none';
        totalContainer.style.display = 'none';
        return;
    }
    
    emptyState.style.display = 'none';
    table.style.display = 'table';
    totalContainer.style.display = 'block';
    
    const stockUnit = document.getElementById('stock-unit').value || 'UNITE';
    document.getElementById('routing-unit-info').textContent = `- Pour 1 ${stockUnit}`;
    
    tbody.innerHTML = routingPhases.map((phase, index) => {
        const statusIcon = phase.workstationStatus === 'DISPONIBLE' ? '✅' : (phase.workstationStatus === 'OCCUPE' ? '⚠️' : '🔴');
        const statusText = phase.workstationStatus === 'DISPONIBLE' ? 'Actif' : phase.workstationStatus;
        
        return `
        <tr style="border-bottom: 1px solid var(--gray-200);">
            <td style="padding: 12px; text-align: center;">
                <div style="display: flex; align-items: center; gap: 4px;">
                    <button type="button" onclick="movePhaseUp(${index})" ${index === 0 ? 'disabled' : ''} style="background: none; border: none; cursor: pointer; padding: 2px; ${index === 0 ? 'opacity: 0.3; cursor: not-allowed;' : ''}">
                        <i class="fa-solid fa-arrow-up"></i>
                    </button>
                    <span style="font-weight: 600; font-size: 16px;">${phase.sequence}</span>
                    <button type="button" onclick="movePhaseDown(${index})" ${index === routingPhases.length - 1 ? 'disabled' : ''} style="background: none; border: none; cursor: pointer; padding: 2px; ${index === routingPhases.length - 1 ? 'opacity: 0.3; cursor: not-allowed;' : ''}">
                        <i class="fa-solid fa-arrow-down"></i>
                    </button>
                </div>
            </td>
            <td style="padding: 12px;">
                <div style="font-weight: 600; margin-bottom: 4px;">${phase.operationName}</div>
                ${phase.operationDesc ? `<div style="font-size: 12px; color: var(--gray-500);">${phase.operationDesc}</div>` : ''}
            </td>
            <td style="padding: 12px;">
                <div style="font-weight: 500; margin-bottom: 4px;">${phase.workstationCode}</div>
                <div style="font-size: 12px; color: var(--gray-500);">${phase.workstationCharge}% charge</div>
            </td>
            <td style="padding: 12px; font-size: 13px;">
                <div>Réglage: ${phase.setupTime} min</div>
                <div>Unit: ${phase.unitTime} min</div>
            </td>
            <td style="padding: 12px; font-weight: 600;">${phase.unitCostPerUnit} F</td>
            <td style="padding: 12px; text-align: center;">
                <div style="position: relative; display: inline-block;">
                    <button type="button" onclick="toggleRoutingMenu(${index})" style="background: none; border: none; cursor: pointer; font-size: 18px; padding: 4px 8px;">⋮</button>
                    <div id="routing-menu-${index}" style="display: none; position: absolute; right: 0; top: 100%; background: white; border: 1px solid var(--gray-300); border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); min-width: 150px; z-index: 1000;">
                        <div onclick="editRouting(${index})" style="padding: 10px 16px; cursor: pointer; border-bottom: 1px solid var(--gray-200);" onmouseover="this.style.background='var(--gray-50)'" onmouseout="this.style.background='white'">
                            <i class="fa-solid fa-edit" style="margin-right: 8px;"></i>Modifier
                        </div>
                        <div onclick="removeRouting(${index})" style="padding: 10px 16px; cursor: pointer; color: #EF4444;" onmouseover="this.style.background='#FEE2E2'" onmouseout="this.style.background='white'">
                            <i class="fa-solid fa-trash" style="margin-right: 8px;"></i>Supprimer
                        </div>
                    </div>
                </div>
            </td>
        </tr>
    `}).join('');
    
    // Calculate totals
    const totalSetupTime = routingPhases.reduce((sum, p) => sum + p.setupTime, 0);
    const totalUnitTime = routingPhases.reduce((sum, p) => sum + p.unitTime, 0);
    const totalCostPerUnit = routingPhases.reduce((sum, p) => sum + p.unitCostPerUnit, 0);
    
    document.getElementById('routing-phase-count').textContent = routingPhases.length;
    document.getElementById('routing-total-time').textContent = totalUnitTime.toFixed(2);
    document.getElementById('routing-setup-time').textContent = totalSetupTime.toFixed(0);
    document.getElementById('routing-total-cost').textContent = totalCostPerUnit.toLocaleString();
}

function toggleRoutingMenu(index) {
    const menu = document.getElementById(`routing-menu-${index}`);
    // Close all other menus
    document.querySelectorAll('[id^="routing-menu-"]').forEach(m => {
        if (m.id !== `routing-menu-${index}`) m.style.display = 'none';
    });
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function movePhaseUp(index) {
    if (index === 0) return;
    
    const temp = routingPhases[index];
    routingPhases[index] = routingPhases[index - 1];
    routingPhases[index - 1] = temp;
    
    // Resequence
    routingPhases.forEach((phase, i) => {
        phase.sequence = i + 1;
    });
    
    renderRoutingList();
}

function movePhaseDown(index) {
    if (index === routingPhases.length - 1) return;
    
    const temp = routingPhases[index];
    routingPhases[index] = routingPhases[index + 1];
    routingPhases[index + 1] = temp;
    
    // Resequence
    routingPhases.forEach((phase, i) => {
        phase.sequence = i + 1;
    });
    
    renderRoutingList();
}

// ============================================================================
// PRODUCTION STATUS UPDATE
// ============================================================================

function updateProductionStatus() {
    // Update units status - Get from step 2 (variantData or step 2 fields)
    const prodUnit = variantData.productionUnit || document.getElementById('production-unit-select')?.value;
    const prodCoef = variantData.productionCoefficient || parseFloat(document.getElementById('production-coefficient-step2')?.value);
    const unitsConfigured = prodUnit && prodCoef;
    
    document.getElementById('status-units').textContent = unitsConfigured ? '✅' : '⬜';
    document.getElementById('status-units-text').textContent = unitsConfigured 
        ? 'Unités de production configurées (Étape 2)' 
        : 'Unités de production non configurées (Étape 2)';
    
    // Update BOM status
    document.getElementById('status-bom').textContent = bomComponents.length > 0 ? '✅' : '⬜';
    document.getElementById('status-bom-text').textContent = `Nomenclature (BOM) : ${bomComponents.length} composants`;
    
    // Update Routing status
    document.getElementById('status-routing').textContent = routingPhases.length > 0 ? '✅' : '⬜';
    document.getElementById('status-routing-text').textContent = `Gamme (Routing) : ${routingPhases.length} phases`;
    
    // Update global status
    const configComplete = unitsConfigured && bomComponents.length > 0 && routingPhases.length > 0;
    const configStatusDiv = document.getElementById('production-config-status');
    
    if (configComplete) {
        configStatusDiv.style.background = '#D1FAE5';
        configStatusDiv.style.borderColor = '#10B981';
        configStatusDiv.innerHTML = '<i class="fa-solid fa-check-circle" style="color: #10B981;"></i> <strong>Configuration complète - Prêt pour production</strong>';
    } else if (unitsConfigured || bomComponents.length > 0 || routingPhases.length > 0) {
        configStatusDiv.style.background = '#FEF3C7';
        configStatusDiv.style.borderColor = '#92400E';
        configStatusDiv.innerHTML = '<i class="fa-solid fa-exclamation-triangle" style="color: #92400E;"></i> <strong>Configuration incomplète</strong>';
    } else {
        configStatusDiv.style.background = '#FEE2E2';
        configStatusDiv.style.borderColor = '#EF4444';
        configStatusDiv.innerHTML = '<i class="fa-solid fa-times-circle" style="color: #EF4444;"></i> <strong>Configuration non démarrée</strong>';
    }
}

// updateProductionUnitsPreview() removed - production units are now managed in step 2

// ============================================================================
// ÉTAPE 6 - MÉDIA HELPERS
// ============================================================================

function handleImageUpload(event) {
    const files = event.target.files;
    for (let file of files) {
        if (file.size > 5 * 1024 * 1024) { // 5MB
            alert(`L'image ${file.name} dépasse la taille maximale de 5 MB`);
            continue;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedImages.push({
                name: file.name,
                url: e.target.result,
                type: file.type,
                size: file.size
            });
            renderMediaPreview();
        };
        reader.readAsDataURL(file);
    }
}

function handleDocumentUpload(event) {
    const files = event.target.files;
    for (let file of files) {
        if (file.size > 10 * 1024 * 1024) { // 10MB
            alert(`Le document ${file.name} dépasse la taille maximale de 10 MB`);
            continue;
        }
        
        uploadedDocuments.push({
            name: file.name,
            type: file.type,
            size: file.size
        });
        renderMediaPreview();
    }
}

function removeImage(index) {
    uploadedImages.splice(index, 1);
    renderMediaPreview();
}

function removeDocument(index) {
    uploadedDocuments.splice(index, 1);
    renderMediaPreview();
}

function renderMediaPreview() {
    // Render images
    const imagesContainer = document.getElementById('images-preview-container');
    if (imagesContainer) {
        if (uploadedImages.length === 0) {
            imagesContainer.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--gray-500); padding: 24px;">Aucune image ajoutée</div>';
        } else {
            imagesContainer.innerHTML = uploadedImages.map((img, index) => `
                <div style="position: relative; border: 2px solid var(--gray-300); border-radius: 8px; overflow: hidden;">
                    <img src="${img.url}" style="width: 100%; height: 150px; object-fit: cover;">
                    <div style="position: absolute; top: 4px; right: 4px;">
                        <button type="button" onclick="removeImage(${index})" style="background: rgba(239, 68, 68, 0.9); border: none; color: white; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                            <i class="fa-solid fa-times"></i>
                        </button>
                    </div>
                    <div style="padding: 8px; background: white; font-size: 11px; color: var(--gray-600);">
                        ${img.name}
                    </div>
                </div>
            `).join('');
        }
    }
    
    // Render documents
    const documentsContainer = document.getElementById('documents-list-container');
    if (documentsContainer) {
        if (uploadedDocuments.length === 0) {
            documentsContainer.innerHTML = '<div style="text-align: center; color: var(--gray-500); padding: 16px;">Aucun document ajouté</div>';
        } else {
            documentsContainer.innerHTML = uploadedDocuments.map((doc, index) => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: var(--gray-100); border-radius: 6px; margin-bottom: 8px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <i class="fa-solid fa-file-pdf" style="font-size: 24px; color: #EF4444;"></i>
                        <div>
                            <div style="font-weight: 600; font-size: 14px;">${doc.name}</div>
                            <div style="font-size: 12px; color: var(--gray-500);">${(doc.size / 1024).toFixed(0)} KB</div>
                        </div>
                    </div>
                    <button type="button" onclick="removeDocument(${index})" class="btn btn-secondary" style="padding: 6px 12px; font-size: 12px;">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `).join('');
        }
    }
}


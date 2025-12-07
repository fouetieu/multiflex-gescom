/**
 * Gestion des Conditionnements/Variantes
 * MultiFlex GESCOM - Module Catalogue
 */

// Mock Data - Products (for dropdown)
const mockProducts = [
    { id: 'prd-mi100', code: 'MI100', designation: 'Peinture Intérieure Mate MI 100' },
    { id: 'prd-mi300', code: 'MI300', designation: 'Peinture Intérieure Mate MI 300' },
    { id: 'prd-me500', code: 'ME500', designation: 'Peinture Extérieure Mate ME 500' },
    { id: 'prd-em1500', code: 'EM1500', designation: 'Enduit Multicoat EM 1500' },
    { id: 'prd-cb300', code: 'CB300', designation: 'Colle à Bois CB 300' },
    { id: 'prd-vi200', code: 'VI200', designation: 'Peinture Intérieure Velours VI 200' }
];

// Mock Data - Variants
let variants = [
    {
        id: 'var-mi300-05kg',
        sku: 'MI300-05KG',
        designation: 'Peinture MI 300 - Pot de 5kg',
        productId: 'prd-mi300',
        productCode: 'MI300',
        productName: 'Peinture Intérieure Mate MI 300',
        barcode: '3250123456789',
        netWeight: 5.00,
        grossWeight: 5.50,
        volume: 0.005,
        stockUnit: 'UNITE',
        purchaseUnit: 'PALETTE',
        purchaseCoefficient: 100,
        isSaleable: true,
        isPurchaseable: true,
        isStockable: true,
        isProducible: false,
        isDefaultVariant: true,
        securityStock: 50,
        reorderPoint: 100,
        valuationMethod: 'PMP',
        status: 'ACTIVE',
        createdAt: '2024-01-15',
        updatedAt: '2024-10-01'
    },
    {
        id: 'var-mi300-30kg',
        sku: 'MI300-30KG',
        designation: 'Peinture MI 300 - Pot de 30kg',
        productId: 'prd-mi300',
        productCode: 'MI300',
        productName: 'Peinture Intérieure Mate MI 300',
        barcode: '3250123456796',
        netWeight: 30.00,
        grossWeight: 31.00,
        volume: 0.030,
        stockUnit: 'UNITE',
        purchaseUnit: 'PALETTE',
        purchaseCoefficient: 40,
        isSaleable: true,
        isPurchaseable: true,
        isStockable: true,
        isProducible: false,
        isDefaultVariant: false,
        securityStock: 20,
        reorderPoint: 50,
        valuationMethod: 'PMP',
        status: 'ACTIVE',
        createdAt: '2024-01-15',
        updatedAt: '2024-09-20'
    },
    {
        id: 'var-me500-05kg',
        sku: 'ME500-05KG',
        designation: 'Peinture ME 500 - Pot de 5kg',
        productId: 'prd-me500',
        productCode: 'ME500',
        productName: 'Peinture Extérieure Mate ME 500',
        barcode: '3250123457001',
        netWeight: 5.00,
        grossWeight: 5.50,
        volume: 0.005,
        stockUnit: 'UNITE',
        purchaseUnit: 'PALETTE',
        purchaseCoefficient: 100,
        isSaleable: true,
        isPurchaseable: true,
        isStockable: true,
        isProducible: false,
        isDefaultVariant: true,
        securityStock: 30,
        reorderPoint: 80,
        valuationMethod: 'PMP',
        status: 'ACTIVE',
        createdAt: '2024-02-01',
        updatedAt: '2024-09-15'
    },
    {
        id: 'var-em1500-25kg',
        sku: 'EM1500-25KG',
        designation: 'Enduit Multicoat - Pot de 25kg',
        productId: 'prd-em1500',
        productCode: 'EM1500',
        productName: 'Enduit Multicoat EM 1500',
        barcode: '3250123458001',
        netWeight: 25.00,
        grossWeight: 26.00,
        volume: 0.025,
        stockUnit: 'UNITE',
        purchaseUnit: 'PALETTE',
        purchaseCoefficient: 48,
        isSaleable: true,
        isPurchaseable: true,
        isStockable: true,
        isProducible: false,
        isDefaultVariant: true,
        securityStock: 20,
        reorderPoint: 50,
        valuationMethod: 'PMP',
        status: 'ACTIVE',
        createdAt: '2024-02-10',
        updatedAt: '2024-08-30'
    },
    {
        id: 'var-cb300-01kg',
        sku: 'CB300-01KG',
        designation: 'Colle à Bois - Boîte de 1kg',
        productId: 'prd-cb300',
        productCode: 'CB300',
        productName: 'Colle à Bois CB 300',
        barcode: '3250123459001',
        netWeight: 1.00,
        grossWeight: 1.10,
        volume: 0.001,
        stockUnit: 'UNITE',
        purchaseUnit: 'CARTON',
        purchaseCoefficient: 24,
        isSaleable: true,
        isPurchaseable: true,
        isStockable: true,
        isProducible: false,
        isDefaultVariant: true,
        securityStock: 100,
        reorderPoint: 200,
        valuationMethod: 'PMP',
        status: 'ACTIVE',
        createdAt: '2024-03-01',
        updatedAt: '2024-08-15'
    }
];

// State
let filteredVariants = [...variants];
let currentPage = 1;
let itemsPerPage = 10;
let currentSort = { field: 'sku', direction: 'asc' };
let currentVariantId = null;

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    updateStats();
    populateProductSelects();
    renderTable();
});

// Mise à jour des statistiques
function updateStats() {
    const activeVariants = variants.filter(v => v.status === 'ACTIVE').length;
    const saleableVariants = variants.filter(v => v.isSaleable).length;
    const stockableVariants = variants.filter(v => v.isStockable).length;
    
    document.getElementById('stat-total').textContent = variants.length;
    document.getElementById('stat-active').textContent = activeVariants;
    document.getElementById('stat-saleable').textContent = saleableVariants;
    document.getElementById('stat-stockable').textContent = stockableVariants;
}

// Populate product dropdowns
function populateProductSelects() {
    const createSelect = document.getElementById('variant-product');
    const filterSelect = document.getElementById('filter-product');
    
    // Create/Edit modal
    createSelect.innerHTML = '<option value="">-- Sélectionner un article --</option>';
    mockProducts.forEach(prod => {
        const option = document.createElement('option');
        option.value = prod.id;
        option.textContent = `${prod.code} - ${prod.designation}`;
        createSelect.appendChild(option);
    });
    
    // Filter dropdown
    mockProducts.forEach(prod => {
        const option = document.createElement('option');
        option.value = prod.id;
        option.textContent = prod.code;
        filterSelect.appendChild(option);
    });
}

// Filtres
function applyFilters() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const productFilter = document.getElementById('filter-product').value;
    const statusFilter = document.getElementById('filter-status').value;
    const saleableFilter = document.getElementById('filter-saleable').checked;
    const stockableFilter = document.getElementById('filter-stockable').checked;
    
    filteredVariants = variants.filter(variant => {
        const matchSearch = !searchTerm || 
            variant.sku.toLowerCase().includes(searchTerm) ||
            variant.designation.toLowerCase().includes(searchTerm) ||
            variant.barcode?.toLowerCase().includes(searchTerm);
        
        const matchProduct = !productFilter || variant.productId === productFilter;
        const matchStatus = !statusFilter || variant.status === statusFilter;
        const matchSaleable = !saleableFilter || variant.isSaleable;
        const matchStockable = !stockableFilter || variant.isStockable;
        
        return matchSearch && matchProduct && matchStatus && matchSaleable && matchStockable;
    });
    
    currentPage = 1;
    renderTable();
}

function resetFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('filter-product').value = '';
    document.getElementById('filter-status').value = '';
    document.getElementById('filter-saleable').checked = false;
    document.getElementById('filter-stockable').checked = false;
    applyFilters();
}

// Tri
function sortTable(field) {
    if (currentSort.field === field) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        currentSort.field = field;
        currentSort.direction = 'asc';
    }
    
    filteredVariants.sort((a, b) => {
        let aVal = a[field];
        let bVal = b[field];
        
        if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
        }
        
        if (currentSort.direction === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });
    
    // Mise à jour des icônes de tri
    document.querySelectorAll('.sortable').forEach(th => {
        th.classList.remove('sort-asc', 'sort-desc');
    });
    const sortedTh = document.querySelector(`.sortable[data-sort="${field}"]`);
    if (sortedTh) {
        sortedTh.classList.add(`sort-${currentSort.direction}`);
    }
    
    renderTable();
}

// Rendu du tableau
function renderTable() {
    const tbody = document.getElementById('table-body');
    const emptyState = document.getElementById('empty-state');
    const pagination = document.getElementById('pagination');
    
    if (filteredVariants.length === 0) {
        tbody.innerHTML = '';
        emptyState.classList.remove('hidden');
        pagination.classList.add('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    pagination.classList.remove('hidden');
    
    // Pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredVariants.length);
    const pageData = filteredVariants.slice(startIndex, endIndex);
    
    // Rendu des lignes
    tbody.innerHTML = pageData.map(variant => {
        const flags = [];
        if (variant.isSaleable) flags.push('💰 V');
        if (variant.isPurchaseable) flags.push('📦 A');
        if (variant.isStockable) flags.push('📊 S');
        if (variant.isProducible) flags.push('🏭 P');
        
        return `
            <tr>
                <td>
                    <strong>${variant.sku}</strong>
                    ${variant.isDefaultVariant ? '<span class="badge badge-default" style="margin-left: 8px;">⭐ Par défaut</span>' : ''}
                </td>
                <td>
                    <div style="font-weight: 500;">${variant.designation}</div>
                    ${variant.barcode ? `<div style="font-size: 11px; color: #6B7280;">Code-barres: ${variant.barcode}</div>` : ''}
                </td>
                <td>
                    <div style="font-weight: 500;">${variant.productCode}</div>
                    <div style="font-size: 12px; color: #6B7280;">${variant.productName}</div>
                </td>
                <td>${variant.stockUnit}</td>
                <td class="text-center">
                    <div style="font-size: 12px;">${flags.join(' ')}</div>
                </td>
                <td>
                    <span class="badge badge-${variant.status.toLowerCase()}">
                        ${variant.status === 'ACTIVE' ? '🟢 Actif' : '🔴 Inactif'}
                    </span>
                </td>
                <td class="actions text-center">
                    <button class="action-btn" onclick="viewVariant('${variant.id}')" title="Voir détails">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                    <button class="action-btn" onclick="editVariant('${variant.id}')" title="Modifier">
                        <i class="fa-solid fa-edit"></i>
                    </button>
                    <button class="action-btn" onclick="duplicateVariant('${variant.id}')" title="Dupliquer">
                        <i class="fa-solid fa-copy"></i>
                    </button>
                    <button class="action-btn danger" onclick="deleteVariant('${variant.id}')" title="Supprimer">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
    
    renderPagination();
}

// Pagination
function renderPagination() {
    const totalPages = Math.ceil(filteredVariants.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, filteredVariants.length);
    
    document.getElementById('pagination-info').textContent = 
        `Affichage de ${startIndex} à ${endIndex} sur ${filteredVariants.length} conditionnement${filteredVariants.length > 1 ? 's' : ''}`;
    
    let paginationHTML = '';
    
    paginationHTML += `
        <button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">
            <i class="fa-solid fa-chevron-left"></i>
        </button>
    `;
    
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHTML += `
                <button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += '<span style="padding: 0 8px;">...</span>';
        }
    }
    
    paginationHTML += `
        <button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">
            <i class="fa-solid fa-chevron-right"></i>
        </button>
    `;
    
    document.getElementById('pagination-controls').innerHTML = paginationHTML;
}

function changePage(page) {
    currentPage = page;
    renderTable();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Modal Création/Édition
function openCreateModal() {
    document.getElementById('modal-title').textContent = 'Nouveau Conditionnement';
    document.getElementById('variant-form').reset();
    document.getElementById('variant-id').value = '';
    document.getElementById('variant-status').value = 'ACTIVE';
    document.getElementById('variant-valuation').value = 'PMP';
    document.getElementById('variant-stock-unit').value = 'UNITE';
    document.getElementById('variant-saleable').checked = true;
    document.getElementById('variant-purchaseable').checked = true;
    document.getElementById('variant-stockable').checked = true;
    document.getElementById('modal-overlay').classList.add('active');
}

function editVariant(id) {
    const variant = variants.find(v => v.id === id);
    if (!variant) return;
    
    currentVariantId = id;
    document.getElementById('modal-title').textContent = 'Modifier le Conditionnement';
    document.getElementById('variant-id').value = variant.id;
    document.getElementById('variant-product').value = variant.productId;
    document.getElementById('variant-sku').value = variant.sku;
    document.getElementById('variant-designation').value = variant.designation;
    document.getElementById('variant-barcode').value = variant.barcode || '';
    document.getElementById('variant-net-weight').value = variant.netWeight || '';
    document.getElementById('variant-gross-weight').value = variant.grossWeight || '';
    document.getElementById('variant-volume').value = variant.volume || '';
    document.getElementById('variant-stock-unit').value = variant.stockUnit;
    document.getElementById('variant-purchase-unit').value = variant.purchaseUnit || '';
    document.getElementById('variant-purchase-coef').value = variant.purchaseCoefficient || '';
    document.getElementById('variant-saleable').checked = variant.isSaleable;
    document.getElementById('variant-purchaseable').checked = variant.isPurchaseable;
    document.getElementById('variant-stockable').checked = variant.isStockable;
    document.getElementById('variant-producible').checked = variant.isProducible;
    document.getElementById('variant-default').checked = variant.isDefaultVariant;
    document.getElementById('variant-security-stock').value = variant.securityStock || '';
    document.getElementById('variant-reorder-point').value = variant.reorderPoint || '';
    document.getElementById('variant-valuation').value = variant.valuationMethod;
    document.getElementById('variant-status').value = variant.status;
    
    document.getElementById('modal-overlay').classList.add('active');
}

function duplicateVariant(id) {
    const variant = variants.find(v => v.id === id);
    if (!variant) return;
    
    openCreateModal();
    document.getElementById('modal-title').textContent = 'Dupliquer le Conditionnement';
    document.getElementById('variant-product').value = variant.productId;
    document.getElementById('variant-sku').value = variant.sku + '-COPY';
    document.getElementById('variant-designation').value = variant.designation + ' (Copie)';
    document.getElementById('variant-barcode').value = '';
    document.getElementById('variant-net-weight').value = variant.netWeight || '';
    document.getElementById('variant-gross-weight').value = variant.grossWeight || '';
    document.getElementById('variant-volume').value = variant.volume || '';
    document.getElementById('variant-stock-unit').value = variant.stockUnit;
    document.getElementById('variant-purchase-unit').value = variant.purchaseUnit || '';
    document.getElementById('variant-purchase-coef').value = variant.purchaseCoefficient || '';
    document.getElementById('variant-saleable').checked = variant.isSaleable;
    document.getElementById('variant-purchaseable').checked = variant.isPurchaseable;
    document.getElementById('variant-stockable').checked = variant.isStockable;
    document.getElementById('variant-producible').checked = variant.isProducible;
    document.getElementById('variant-default').checked = false; // Ne pas dupliquer le flag défaut
    document.getElementById('variant-security-stock').value = variant.securityStock || '';
    document.getElementById('variant-reorder-point').value = variant.reorderPoint || '';
    document.getElementById('variant-valuation').value = variant.valuationMethod;
}

function saveVariant() {
    const id = document.getElementById('variant-id').value;
    const productId = document.getElementById('variant-product').value;
    const sku = document.getElementById('variant-sku').value.trim().toUpperCase();
    const designation = document.getElementById('variant-designation').value.trim();
    const barcode = document.getElementById('variant-barcode').value.trim();
    const netWeight = parseFloat(document.getElementById('variant-net-weight').value) || null;
    const grossWeight = parseFloat(document.getElementById('variant-gross-weight').value) || null;
    const volume = parseFloat(document.getElementById('variant-volume').value) || null;
    const stockUnit = document.getElementById('variant-stock-unit').value;
    const purchaseUnit = document.getElementById('variant-purchase-unit').value || null;
    const purchaseCoef = parseInt(document.getElementById('variant-purchase-coef').value) || null;
    const isSaleable = document.getElementById('variant-saleable').checked;
    const isPurchaseable = document.getElementById('variant-purchaseable').checked;
    const isStockable = document.getElementById('variant-stockable').checked;
    const isProducible = document.getElementById('variant-producible').checked;
    const isDefault = document.getElementById('variant-default').checked;
    const securityStock = parseInt(document.getElementById('variant-security-stock').value) || null;
    const reorderPoint = parseInt(document.getElementById('variant-reorder-point').value) || null;
    const valuation = document.getElementById('variant-valuation').value;
    const status = document.getElementById('variant-status').value;
    
    // Validation
    if (!productId || !sku || !designation || !stockUnit) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }
    
    // Vérifier unicité du SKU
    const existingSku = variants.find(v => v.sku === sku && v.id !== id);
    if (existingSku) {
        alert(`Le code SKU "${sku}" existe déjà`);
        return;
    }
    
    // Vérifier unicité du code-barres si renseigné
    if (barcode) {
        const existingBarcode = variants.find(v => v.barcode === barcode && v.id !== id);
        if (existingBarcode) {
            alert(`Le code-barres "${barcode}" est déjà utilisé par ${existingBarcode.sku}`);
            return;
        }
    }
    
    // Récupérer les infos du produit parent
    const product = mockProducts.find(p => p.id === productId);
    
    if (id) {
        // Modification
        const variant = variants.find(v => v.id === id);
        if (variant) {
            variant.sku = sku;
            variant.designation = designation;
            variant.productId = productId;
            variant.productCode = product.code;
            variant.productName = product.designation;
            variant.barcode = barcode || null;
            variant.netWeight = netWeight;
            variant.grossWeight = grossWeight;
            variant.volume = volume;
            variant.stockUnit = stockUnit;
            variant.purchaseUnit = purchaseUnit;
            variant.purchaseCoefficient = purchaseCoef;
            variant.isSaleable = isSaleable;
            variant.isPurchaseable = isPurchaseable;
            variant.isStockable = isStockable;
            variant.isProducible = isProducible;
            variant.isDefaultVariant = isDefault;
            variant.securityStock = securityStock;
            variant.reorderPoint = reorderPoint;
            variant.valuationMethod = valuation;
            variant.status = status;
            variant.updatedAt = new Date().toISOString().split('T')[0];
        }
        alert(`Conditionnement "${sku}" modifié avec succès !`);
    } else {
        // Création
        const newVariant = {
            id: 'var-' + Date.now(),
            sku,
            designation,
            productId,
            productCode: product.code,
            productName: product.designation,
            barcode: barcode || null,
            netWeight,
            grossWeight,
            volume,
            stockUnit,
            purchaseUnit,
            purchaseCoefficient: purchaseCoef,
            isSaleable,
            isPurchaseable,
            isStockable,
            isProducible,
            isDefaultVariant: isDefault,
            securityStock,
            reorderPoint,
            valuationMethod: valuation,
            status,
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0]
        };
        variants.push(newVariant);
        alert(`Conditionnement "${sku}" créé avec succès !`);
    }
    
    closeModal();
    applyFilters();
    updateStats();
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
    currentVariantId = null;
}

// Modal Vue Détails
function viewVariant(id) {
    const variant = variants.find(v => v.id === id);
    if (!variant) return;
    
    currentVariantId = id;
    document.getElementById('view-modal-title').textContent = `${variant.sku} - ${variant.designation}`;
    
    const flags = [];
    if (variant.isSaleable) flags.push('<span style="background: #D1FAE5; color: #065F46; padding: 4px 8px; border-radius: 4px;">✅ Vendable</span>');
    if (variant.isPurchaseable) flags.push('<span style="background: #DBEAFE; color: #1E40AF; padding: 4px 8px; border-radius: 4px;">✅ Achetable</span>');
    if (variant.isStockable) flags.push('<span style="background: #FEF3C7; color: #92400E; padding: 4px 8px; border-radius: 4px;">✅ Stockable</span>');
    if (variant.isProducible) flags.push('<span style="background: #FCE7F3; color: #9F1239; padding: 4px 8px; border-radius: 4px;">✅ Productible</span>');
    
    const content = `
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px;">
            <div>
                <h3 style="color: var(--primary-color); margin-bottom: 16px;">Identification</h3>
                <div class="form-group">
                    <strong>Code SKU :</strong> ${variant.sku}
                    ${variant.isDefaultVariant ? '<span class="badge badge-default" style="margin-left: 8px;">⭐ Variante par défaut</span>' : ''}
                </div>
                <div class="form-group">
                    <strong>Désignation :</strong> ${variant.designation}
                </div>
                <div class="form-group">
                    <strong>Code-barres :</strong> ${variant.barcode || 'Non renseigné'}
                </div>
                <div class="form-group">
                    <strong>Statut :</strong> 
                    <span class="badge badge-${variant.status.toLowerCase()}">
                        ${variant.status === 'ACTIVE' ? '🟢 Actif' : '🔴 Inactif'}
                    </span>
                </div>
            </div>
            
            <div>
                <h3 style="color: var(--primary-color); margin-bottom: 16px;">Article Parent</h3>
                <div class="form-group">
                    <strong>Code :</strong> ${variant.productCode}
                </div>
                <div class="form-group">
                    <strong>Nom :</strong> ${variant.productName}
                </div>
            </div>
        </div>
        
        <hr style="margin: 24px 0; border: none; border-top: 1px solid var(--gray-200);">
        
        <h3 style="color: var(--primary-color); margin-bottom: 16px;">Propriétés Physiques</h3>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
            <div><strong>Poids net :</strong> ${variant.netWeight ? variant.netWeight + ' kg' : 'Non renseigné'}</div>
            <div><strong>Poids brut :</strong> ${variant.grossWeight ? variant.grossWeight + ' kg' : 'Non renseigné'}</div>
            <div><strong>Volume :</strong> ${variant.volume ? variant.volume + ' m³' : 'Non renseigné'}</div>
        </div>
        
        <hr style="margin: 24px 0; border: none; border-top: 1px solid var(--gray-200);">
        
        <h3 style="color: var(--primary-color); margin-bottom: 16px;">Unités de Gestion</h3>
        <div class="form-group">
            <strong>Unité de stock :</strong> ${variant.stockUnit}
        </div>
        ${variant.purchaseUnit ? `
        <div class="form-group">
            <strong>Unité d'achat :</strong> ${variant.purchaseUnit} 
            ${variant.purchaseCoefficient ? `(1 ${variant.purchaseUnit} = ${variant.purchaseCoefficient} ${variant.stockUnit})` : ''}
        </div>
        ` : ''}
        
        <hr style="margin: 24px 0; border: none; border-top: 1px solid var(--gray-200);">
        
        <h3 style="color: var(--primary-color); margin-bottom: 16px;">Flags de Gestion</h3>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            ${flags.join('')}
            ${flags.length === 0 ? '<p style="color: #6B7280;">Aucun flag actif</p>' : ''}
        </div>
        
        <hr style="margin: 24px 0; border: none; border-top: 1px solid var(--gray-200);">
        
        <h3 style="color: var(--primary-color); margin-bottom: 16px;">Paramètres de Stock</h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
            <div><strong>Stock de sécurité :</strong> ${variant.securityStock || 'Non défini'} ${variant.stockUnit}</div>
            <div><strong>Point de commande :</strong> ${variant.reorderPoint || 'Non défini'} ${variant.stockUnit}</div>
            <div><strong>Méthode de valorisation :</strong> ${variant.valuationMethod}</div>
        </div>
        
        <hr style="margin: 24px 0; border: none; border-top: 1px solid var(--gray-200);">
        
        <h3 style="color: var(--primary-color); margin-bottom: 16px;">Métadonnées</h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; font-size: 13px; color: var(--gray-600);">
            <div><strong>Créé le :</strong> ${variant.createdAt}</div>
            <div><strong>Modifié le :</strong> ${variant.updatedAt}</div>
        </div>
    `;
    
    document.getElementById('view-modal-body').innerHTML = content;
    document.getElementById('view-modal-overlay').classList.add('active');
}

function editFromView() {
    closeViewModal();
    editVariant(currentVariantId);
}

function closeViewModal() {
    document.getElementById('view-modal-overlay').classList.remove('active');
    currentVariantId = null;
}

// Suppression
function deleteVariant(id) {
    const variant = variants.find(v => v.id === id);
    if (!variant) return;
    
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le conditionnement "${variant.sku}" ?\n\nCette action est irréversible.`)) {
        return;
    }
    
    variants = variants.filter(v => v.id !== id);
    alert(`Conditionnement "${variant.sku}" supprimé avec succès !`);
    
    applyFilters();
    updateStats();
}

// Export
function exportData() {
    alert('Export Excel/PDF à implémenter avec une bibliothèque dédiée');
}

// Fermeture des modals au clic en dehors
document.getElementById('modal-overlay').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});

document.getElementById('view-modal-overlay').addEventListener('click', function(e) {
    if (e.target === this) closeViewModal();
});










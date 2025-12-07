/**
 * Gestion des Articles/Produits
 * MultiFlex GESCOM - Module Catalogue
 */

// Mock Data - Categories (subset for dropdown)
const mockCategories = [
    { id: 'cat-pein-int-mat', code: 'PEIN-INT-MAT', name: 'Peintures Mates', fullPath: 'PEINTURES > PEINTURES INTÉRIEURES > PEINTURES MATES' },
    { id: 'cat-pein-int-vel', code: 'PEIN-INT-VEL', name: 'Peintures Velours', fullPath: 'PEINTURES > PEINTURES INTÉRIEURES > PEINTURES VELOURS' },
    { id: 'cat-pein-int-sat', code: 'PEIN-INT-SAT', name: 'Peintures Satinées', fullPath: 'PEINTURES > PEINTURES INTÉRIEURES > PEINTURES SATINÉES' },
    { id: 'cat-pein-ext-mat', code: 'PEIN-EXT-MAT', name: 'Peintures Mates Ext', fullPath: 'PEINTURES > PEINTURES EXTÉRIEURES > PEINTURES MATES' },
    { id: 'cat-endu-pat', code: 'ENDU-PAT', name: 'Enduits en Pâte', fullPath: 'ENDUITS > ENDUITS EN PÂTE' },
    { id: 'cat-endu-pou', code: 'ENDU-POU', name: 'Enduits en Poudre', fullPath: 'ENDUITS > ENDUITS EN POUDRE' },
    { id: 'cat-coll-boi', code: 'COLL-BOI', name: 'Colles à Bois', fullPath: 'COLLES & ADHÉSIFS > COLLES À BOIS' },
    { id: 'cat-coll-cim', code: 'COLL-CIM', name: 'Ciments Colles', fullPath: 'COLLES & ADHÉSIFS > CIMENTS COLLES' }
];

// Mock Data - Products
let products = [
    {
        id: 'prd-mi100',
        code: 'MI100',
        designation: 'Peinture Intérieure Mate MI 100',
        categoryId: 'cat-pein-int-mat',
        categoryName: 'Peintures Mates',
        type: 'MARCHANDISE',
        description: 'Gamme de peintures intérieures à finition mate, excellent pouvoir couvrant',
        imageUrl: null,
        status: 'ACTIVE',
        variantCount: 2,
        createdAt: '2024-01-15',
        updatedAt: '2024-10-01'
    },
    {
        id: 'prd-mi300',
        code: 'MI300',
        designation: 'Peinture Intérieure Mate MI 300',
        categoryId: 'cat-pein-int-mat',
        categoryName: 'Peintures Mates',
        type: 'MARCHANDISE',
        description: 'Gamme de peintures intérieures à finition mate, rendement 195m² pour conditionnement 30kg',
        imageUrl: null,
        status: 'ACTIVE',
        variantCount: 2,
        createdAt: '2024-01-15',
        updatedAt: '2024-09-20'
    },
    {
        id: 'prd-me500',
        code: 'ME500',
        designation: 'Peinture Extérieure Mate ME 500',
        categoryId: 'cat-pein-ext-mat',
        categoryName: 'Peintures Mates Ext',
        type: 'MARCHANDISE',
        description: 'Peinture extérieure mate haute résistance aux intempéries',
        imageUrl: null,
        status: 'ACTIVE',
        variantCount: 2,
        createdAt: '2024-02-01',
        updatedAt: '2024-09-15'
    },
    {
        id: 'prd-em1500',
        code: 'EM1500',
        designation: 'Enduit Multicoat EM 1500',
        categoryId: 'cat-endu-pat',
        categoryName: 'Enduits en Pâte',
        type: 'MARCHANDISE',
        description: 'Enduit en pâte multifonction pour murs et plafonds',
        imageUrl: null,
        status: 'ACTIVE',
        variantCount: 1,
        createdAt: '2024-02-10',
        updatedAt: '2024-08-30'
    },
    {
        id: 'prd-cb300',
        code: 'CB300',
        designation: 'Colle à Bois CB 300',
        categoryId: 'cat-coll-boi',
        categoryName: 'Colles à Bois',
        type: 'MARCHANDISE',
        description: 'Colle à bois universelle haute performance',
        imageUrl: null,
        status: 'ACTIVE',
        variantCount: 1,
        createdAt: '2024-03-01',
        updatedAt: '2024-08-15'
    },
    {
        id: 'prd-vi200',
        code: 'VI200',
        designation: 'Peinture Intérieure Velours VI 200',
        categoryId: 'cat-pein-int-vel',
        categoryName: 'Peintures Velours',
        type: 'MARCHANDISE',
        description: 'Peinture velours lavable pour intérieur',
        imageUrl: null,
        status: 'ACTIVE',
        variantCount: 2,
        createdAt: '2024-03-15',
        updatedAt: '2024-07-20'
    },
    {
        id: 'prd-ep800',
        code: 'EP800',
        designation: 'Enduit en Poudre EP 800',
        categoryId: 'cat-endu-pou',
        categoryName: 'Enduits en Poudre',
        type: 'MARCHANDISE',
        description: 'Enduit en poudre pour rebouchage et lissage',
        imageUrl: null,
        status: 'INACTIVE',
        variantCount: 1,
        createdAt: '2024-04-01',
        updatedAt: '2024-06-10'
    }
];

// State
let filteredProducts = [...products];
let currentPage = 1;
let itemsPerPage = 10;
let currentSort = { field: 'code', direction: 'asc' };
let currentProductId = null;
let viewMode = 'table'; // 'table' or 'grid'

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    updateStats();
    populateCategorySelect();
    populateCategoryFilter();
    renderView();
});

// Mise à jour des statistiques
function updateStats() {
    const activeProducts = products.filter(p => p.status === 'ACTIVE').length;
    const totalVariants = products.reduce((sum, p) => sum + p.variantCount, 0);
    const uniqueCategories = new Set(products.map(p => p.categoryId)).size;
    
    document.getElementById('stat-total').textContent = products.length;
    document.getElementById('stat-active').textContent = activeProducts;
    document.getElementById('stat-variants').textContent = totalVariants;
    document.getElementById('stat-categories').textContent = uniqueCategories;
}

// Populate category dropdowns
function populateCategorySelect() {
    const select = document.getElementById('product-category');
    select.innerHTML = '<option value="">-- Choisir une catégorie --</option>';
    
    mockCategories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.fullPath;
        option.dataset.path = cat.fullPath;
        select.appendChild(option);
    });
}

function populateCategoryFilter() {
    const select = document.getElementById('filter-category');
    
    mockCategories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        select.appendChild(option);
    });
}

// Toggle View Mode
function toggleView() {
    viewMode = viewMode === 'table' ? 'grid' : 'table';
    const icon = document.getElementById('view-icon');
    const text = document.getElementById('view-text');
    
    if (viewMode === 'grid') {
        icon.className = 'fa-solid fa-list';
        text.textContent = 'Liste';
    } else {
        icon.className = 'fa-solid fa-th';
        text.textContent = 'Grille';
    }
    
    renderView();
}

function renderView() {
    const tableView = document.getElementById('table-view');
    const gridView = document.getElementById('grid-view');
    
    if (viewMode === 'table') {
        tableView.classList.remove('hidden');
        gridView.classList.add('hidden');
        renderTable();
    } else {
        tableView.classList.add('hidden');
        gridView.classList.remove('hidden');
        renderGrid();
    }
}

// Filtres
function applyFilters() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const categoryFilter = document.getElementById('filter-category').value;
    const typeFilter = document.getElementById('filter-type').value;
    const statusFilter = document.getElementById('filter-status').value;
    
    filteredProducts = products.filter(product => {
        const matchSearch = !searchTerm || 
            product.code.toLowerCase().includes(searchTerm) ||
            product.designation.toLowerCase().includes(searchTerm) ||
            (product.description && product.description.toLowerCase().includes(searchTerm));
        
        const matchCategory = !categoryFilter || product.categoryId === categoryFilter;
        const matchType = !typeFilter || product.type === typeFilter;
        const matchStatus = !statusFilter || product.status === statusFilter;
        
        return matchSearch && matchCategory && matchType && matchStatus;
    });
    
    currentPage = 1;
    renderView();
}

function resetFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('filter-category').value = '';
    document.getElementById('filter-type').value = '';
    document.getElementById('filter-status').value = '';
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
    
    filteredProducts.sort((a, b) => {
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
    
    if (filteredProducts.length === 0) {
        tbody.innerHTML = '';
        emptyState.classList.remove('hidden');
        pagination.classList.add('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    pagination.classList.remove('hidden');
    
    // Pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredProducts.length);
    const pageData = filteredProducts.slice(startIndex, endIndex);
    
    // Rendu des lignes
    tbody.innerHTML = pageData.map(product => `
        <tr>
            <td style="text-align: center;">
                ${product.imageUrl 
                    ? `<img src="${product.imageUrl}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">` 
                    : '<div style="width: 40px; height: 40px; background: #F3F4F6; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 20px;">🖼️</div>'}
            </td>
            <td><strong>${product.code}</strong></td>
            <td>
                <div style="font-weight: 500; color: #111827;">${product.designation}</div>
            </td>
            <td>${product.categoryName}</td>
            <td><span style="font-size: 12px; background: #F3F4F6; padding: 4px 8px; border-radius: 4px;">${product.type}</span></td>
            <td class="text-center">${product.variantCount}</td>
            <td>
                <span class="badge badge-${product.status.toLowerCase()}">
                    ${product.status === 'ACTIVE' ? '🟢 Actif' : '🔴 Inactif'}
                </span>
            </td>
            <td class="actions text-center">
                <button class="action-btn" onclick="viewProduct('${product.id}')" title="Voir détails">
                    <i class="fa-solid fa-eye"></i>
                </button>
                <button class="action-btn" onclick="editProduct('${product.id}')" title="Modifier">
                    <i class="fa-solid fa-edit"></i>
                </button>
                <button class="action-btn" onclick="duplicateProduct('${product.id}')" title="Dupliquer">
                    <i class="fa-solid fa-copy"></i>
                </button>
                <button class="action-btn danger" onclick="deleteProduct('${product.id}')" title="Supprimer">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
    
    renderPagination();
}

// Rendu en grille
function renderGrid() {
    const gridView = document.getElementById('grid-view');
    
    if (filteredProducts.length === 0) {
        gridView.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon"><i class="fa-solid fa-box"></i></div>
                <h3 class="empty-state-title">Aucun article trouvé</h3>
                <p class="empty-state-description">Commencez par créer votre premier article</p>
                <button class="btn btn-primary mt-4" onclick="openCreateModal()">
                    <i class="fa-solid fa-plus"></i> Nouvel Article
                </button>
            </div>
        `;
        return;
    }
    
    gridView.innerHTML = filteredProducts.map(product => `
        <div class="product-card" onclick="viewProduct('${product.id}')">
            <div class="product-image">
                ${product.imageUrl 
                    ? `<img src="${product.imageUrl}" style="width: 100%; height: 100%; object-fit: cover;">` 
                    : '🖼️'}
            </div>
            <div class="product-info">
                <div class="product-code">${product.code}</div>
                <div class="product-name">${product.designation}</div>
                <div class="product-variants">
                    <span class="badge badge-${product.status.toLowerCase()}">
                        ${product.status === 'ACTIVE' ? '🟢' : '🔴'}
                    </span>
                    ${product.variantCount} variante${product.variantCount > 1 ? 's' : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Pagination
function renderPagination() {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, filteredProducts.length);
    
    document.getElementById('pagination-info').textContent = 
        `Affichage de ${startIndex} à ${endIndex} sur ${filteredProducts.length} article${filteredProducts.length > 1 ? 's' : ''}`;
    
    let paginationHTML = '';
    
    // Bouton Précédent
    paginationHTML += `
        <button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">
            <i class="fa-solid fa-chevron-left"></i>
        </button>
    `;
    
    // Numéros de page
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
    
    // Bouton Suivant
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
    document.getElementById('modal-title').textContent = 'Nouvel Article';
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
    document.getElementById('product-status').value = 'ACTIVE';
    document.getElementById('product-type').value = 'MARCHANDISE';
    document.getElementById('category-path').textContent = '';
    document.getElementById('modal-overlay').classList.add('active');
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    currentProductId = id;
    document.getElementById('modal-title').textContent = 'Modifier l\'Article';
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-code').value = product.code;
    document.getElementById('product-designation').value = product.designation;
    document.getElementById('product-category').value = product.categoryId;
    document.getElementById('product-type').value = product.type;
    document.getElementById('product-description').value = product.description || '';
    document.getElementById('product-image').value = product.imageUrl || '';
    document.getElementById('product-status').value = product.status;
    
    updateCategoryPath();
    
    document.getElementById('modal-overlay').classList.add('active');
}

function duplicateProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    openCreateModal();
    document.getElementById('modal-title').textContent = 'Dupliquer l\'Article';
    document.getElementById('product-code').value = product.code + '-COPY';
    document.getElementById('product-designation').value = product.designation + ' (Copie)';
    document.getElementById('product-category').value = product.categoryId;
    document.getElementById('product-type').value = product.type;
    document.getElementById('product-description').value = product.description || '';
    document.getElementById('product-image').value = product.imageUrl || '';
    
    updateCategoryPath();
}

function updateCategoryPath() {
    const categorySelect = document.getElementById('product-category');
    const selectedOption = categorySelect.options[categorySelect.selectedIndex];
    const pathElement = document.getElementById('category-path');
    
    if (selectedOption && selectedOption.dataset.path) {
        pathElement.textContent = '📁 ' + selectedOption.dataset.path;
    } else {
        pathElement.textContent = '';
    }
}

// Listener pour afficher le chemin de la catégorie
document.addEventListener('DOMContentLoaded', function() {
    const categorySelect = document.getElementById('product-category');
    if (categorySelect) {
        categorySelect.addEventListener('change', updateCategoryPath);
    }
});

function saveProduct() {
    const id = document.getElementById('product-id').value;
    const code = document.getElementById('product-code').value.trim().toUpperCase();
    const designation = document.getElementById('product-designation').value.trim();
    const categoryId = document.getElementById('product-category').value;
    const type = document.getElementById('product-type').value;
    const description = document.getElementById('product-description').value.trim();
    const imageUrl = document.getElementById('product-image').value.trim();
    const status = document.getElementById('product-status').value;
    
    // Validation
    if (!code || !designation || !categoryId) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }
    
    // Vérifier unicité du code
    const existingCode = products.find(p => p.code === code && p.id !== id);
    if (existingCode) {
        alert(`Le code "${code}" existe déjà`);
        return;
    }
    
    // Récupérer le nom de la catégorie
    const category = mockCategories.find(c => c.id === categoryId);
    const categoryName = category ? category.name : '';
    
    if (id) {
        // Modification
        const product = products.find(p => p.id === id);
        if (product) {
            product.code = code;
            product.designation = designation;
            product.categoryId = categoryId;
            product.categoryName = categoryName;
            product.type = type;
            product.description = description;
            product.imageUrl = imageUrl || null;
            product.status = status;
            product.updatedAt = new Date().toISOString().split('T')[0];
        }
        alert(`Article "${code}" modifié avec succès !`);
    } else {
        // Création
        const newProduct = {
            id: 'prd-' + Date.now(),
            code,
            designation,
            categoryId,
            categoryName,
            type,
            description,
            imageUrl: imageUrl || null,
            status,
            variantCount: 0,
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0]
        };
        products.push(newProduct);
        
        alert(`Article "${code}" créé avec succès !\n\nVous pouvez maintenant créer des conditionnements pour cet article.`);
    }
    
    closeModal();
    applyFilters();
    updateStats();
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
    currentProductId = null;
}

// Modal Vue Détails
function viewProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    currentProductId = id;
    document.getElementById('view-modal-title').textContent = `${product.code} - ${product.designation}`;
    
    const category = mockCategories.find(c => c.id === product.categoryId);
    const categoryPath = category ? category.fullPath : 'Non renseignée';
    
    const content = `
        <div style="display: grid; grid-template-columns: 200px 1fr; gap: 24px;">
            <div>
                <div style="width: 180px; height: 180px; background: #F3F4F6; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 64px; border: 2px solid var(--gray-200);">
                    ${product.imageUrl 
                        ? `<img src="${product.imageUrl}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">` 
                        : '🖼️'}
                </div>
            </div>
            <div>
                <h3 style="color: var(--primary-color); margin-bottom: 16px;">Informations Générales</h3>
                <div class="form-group">
                    <strong>Code :</strong> ${product.code}
                </div>
                <div class="form-group">
                    <strong>Désignation :</strong> ${product.designation}
                </div>
                <div class="form-group">
                    <strong>Catégorie :</strong><br>
                    📁 ${categoryPath}
                </div>
                <div class="form-group">
                    <strong>Type :</strong> <span style="background: #F3F4F6; padding: 4px 12px; border-radius: 4px;">${product.type}</span>
                </div>
                <div class="form-group">
                    <strong>Description :</strong><br>
                    ${product.description || 'Non renseignée'}
                </div>
                <div class="form-group">
                    <strong>Statut :</strong> 
                    <span class="badge badge-${product.status.toLowerCase()}">
                        ${product.status === 'ACTIVE' ? '🟢 Actif' : '🔴 Inactif'}
                    </span>
                </div>
            </div>
        </div>
        
        <hr style="margin: 24px 0; border: none; border-top: 1px solid var(--gray-200);">
        
        <h3 style="color: var(--primary-color); margin-bottom: 16px;">
            Conditionnements (${product.variantCount})
            <button class="btn btn-primary btn-sm" style="float: right;" onclick="alert('Redirection vers création de conditionnement')">
                <i class="fa-solid fa-plus"></i> Ajouter variante
            </button>
        </h3>
        
        ${product.variantCount > 0 
            ? `<div style="background: #F9FAFB; padding: 16px; border-radius: 6px; border: 1px solid var(--gray-200);">
                <p style="color: var(--gray-600); margin: 0;">
                    <i class="fa-solid fa-boxes-stacked"></i> Cet article possède ${product.variantCount} conditionnement(s). 
                    <a href="./variants-list.html" style="color: var(--primary-color); text-decoration: none;">Voir tous les conditionnements →</a>
                </p>
               </div>` 
            : `<div style="background: #FEF3C7; padding: 16px; border-radius: 6px; border: 1px solid #F59E0B;">
                <p style="color: #92400E; margin: 0;">
                    <i class="fa-solid fa-exclamation-triangle"></i> Aucun conditionnement créé. Créez au moins un conditionnement pour pouvoir gérer le stock et les prix.
                </p>
               </div>`}
        
        <hr style="margin: 24px 0; border: none; border-top: 1px solid var(--gray-200);">
        
        <h3 style="color: var(--primary-color); margin-bottom: 16px;">Métadonnées</h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; font-size: 13px; color: var(--gray-600);">
            <div><strong>Créé le :</strong> ${product.createdAt}</div>
            <div><strong>Modifié le :</strong> ${product.updatedAt}</div>
        </div>
    `;
    
    document.getElementById('view-modal-body').innerHTML = content;
    document.getElementById('view-modal-overlay').classList.add('active');
}

function editFromView() {
    closeViewModal();
    editProduct(currentProductId);
}

function closeViewModal() {
    document.getElementById('view-modal-overlay').classList.remove('active');
    currentProductId = null;
}

// Suppression
function deleteProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    // Vérifier s'il y a des variantes
    if (product.variantCount > 0) {
        alert(`Impossible de supprimer "${product.code}".\nCet article possède ${product.variantCount} conditionnement(s).\n\nSupprimez d'abord tous les conditionnements.`);
        return;
    }
    
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'article "${product.code}" ?\n\nCette action est irréversible.`)) {
        return;
    }
    
    products = products.filter(p => p.id !== id);
    alert(`Article "${product.code}" supprimé avec succès !`);
    
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










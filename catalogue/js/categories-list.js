/**
 * Gestion des Catégories - Vue Arborescence
 * MultiFlex GESCOM - Module Catalogue
 */

// Mock Data - Catégories
let categories = [
    {
        id: 'cat-pein',
        code: 'PEIN',
        name: 'PEINTURES',
        description: 'Gamme complète de peintures intérieures et extérieures',
        parentId: null,
        level: 0,
        isLeaf: false,
        status: 'ACTIVE',
        productCount: 0,
        createdAt: '2024-01-15',
        updatedAt: '2024-10-01'
    },
    {
        id: 'cat-pein-int',
        code: 'PEIN-INT',
        name: 'PEINTURES INTÉRIEURES',
        description: 'Peintures pour usage intérieur',
        parentId: 'cat-pein',
        level: 1,
        isLeaf: false,
        status: 'ACTIVE',
        productCount: 0,
        createdAt: '2024-01-15',
        updatedAt: '2024-09-20'
    },
    {
        id: 'cat-pein-int-mat',
        code: 'PEIN-INT-MAT',
        name: 'PEINTURES MATES',
        description: 'Peintures mates pour usage intérieur',
        parentId: 'cat-pein-int',
        level: 2,
        isLeaf: true,
        status: 'ACTIVE',
        productCount: 12,
        createdAt: '2024-01-15',
        updatedAt: '2024-09-15'
    },
    {
        id: 'cat-pein-int-vel',
        code: 'PEIN-INT-VEL',
        name: 'PEINTURES VELOURS',
        description: 'Peintures velours pour usage intérieur',
        parentId: 'cat-pein-int',
        level: 2,
        isLeaf: true,
        status: 'ACTIVE',
        productCount: 5,
        createdAt: '2024-01-15',
        updatedAt: '2024-08-10'
    },
    {
        id: 'cat-pein-int-sat',
        code: 'PEIN-INT-SAT',
        name: 'PEINTURES SATINÉES',
        description: 'Peintures satinées pour usage intérieur',
        parentId: 'cat-pein-int',
        level: 2,
        isLeaf: true,
        status: 'ACTIVE',
        productCount: 8,
        createdAt: '2024-01-15',
        updatedAt: '2024-07-25'
    },
    {
        id: 'cat-pein-ext',
        code: 'PEIN-EXT',
        name: 'PEINTURES EXTÉRIEURES',
        description: 'Peintures pour usage extérieur',
        parentId: 'cat-pein',
        level: 1,
        isLeaf: false,
        status: 'ACTIVE',
        productCount: 0,
        createdAt: '2024-01-15',
        updatedAt: '2024-09-01'
    },
    {
        id: 'cat-pein-ext-mat',
        code: 'PEIN-EXT-MAT',
        name: 'PEINTURES MATES',
        description: 'Peintures mates pour usage extérieur',
        parentId: 'cat-pein-ext',
        level: 2,
        isLeaf: true,
        status: 'ACTIVE',
        productCount: 15,
        createdAt: '2024-01-15',
        updatedAt: '2024-08-15'
    },
    {
        id: 'cat-endu',
        code: 'ENDU',
        name: 'ENDUITS',
        description: 'Gamme complète d\'enduits',
        parentId: null,
        level: 0,
        isLeaf: false,
        status: 'ACTIVE',
        productCount: 0,
        createdAt: '2024-02-01',
        updatedAt: '2024-09-10'
    },
    {
        id: 'cat-endu-pat',
        code: 'ENDU-PAT',
        name: 'ENDUITS EN PÂTE',
        description: 'Enduits en pâte prêts à l\'emploi',
        parentId: 'cat-endu',
        level: 1,
        isLeaf: true,
        status: 'ACTIVE',
        productCount: 3,
        createdAt: '2024-02-01',
        updatedAt: '2024-08-20'
    },
    {
        id: 'cat-endu-pou',
        code: 'ENDU-POU',
        name: 'ENDUITS EN POUDRE',
        description: 'Enduits en poudre à mélanger',
        parentId: 'cat-endu',
        level: 1,
        isLeaf: true,
        status: 'ACTIVE',
        productCount: 4,
        createdAt: '2024-02-01',
        updatedAt: '2024-07-30'
    },
    {
        id: 'cat-coll',
        code: 'COLL',
        name: 'COLLES & ADHÉSIFS',
        description: 'Gamme de colles et adhésifs',
        parentId: null,
        level: 0,
        isLeaf: false,
        status: 'ACTIVE',
        productCount: 0,
        createdAt: '2024-03-01',
        updatedAt: '2024-09-05'
    },
    {
        id: 'cat-coll-boi',
        code: 'COLL-BOI',
        name: 'COLLES À BOIS',
        description: 'Colles spécifiques pour le bois',
        parentId: 'cat-coll',
        level: 1,
        isLeaf: true,
        status: 'ACTIVE',
        productCount: 6,
        createdAt: '2024-03-01',
        updatedAt: '2024-08-25'
    },
    {
        id: 'cat-coll-cim',
        code: 'COLL-CIM',
        name: 'CIMENTS COLLES',
        description: 'Ciments colles pour carrelage',
        parentId: 'cat-coll',
        level: 1,
        isLeaf: true,
        status: 'ACTIVE',
        productCount: 5,
        createdAt: '2024-03-01',
        updatedAt: '2024-07-15'
    }
];

// State
let filteredCategories = [...categories];
let expandedNodes = new Set();
let currentCategoryId = null;

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    updateStats();
    renderTree();
    populateParentSelect();
});

// Mise à jour des statistiques
function updateStats() {
    const activeCategories = categories.filter(c => c.status === 'ACTIVE').length;
    const leafCategories = categories.filter(c => c.isLeaf).length;
    const totalProducts = categories.reduce((sum, c) => sum + c.productCount, 0);
    
    document.getElementById('stat-total').textContent = categories.length;
    document.getElementById('stat-active').textContent = activeCategories;
    document.getElementById('stat-leaf').textContent = leafCategories;
    document.getElementById('stat-products').textContent = totalProducts;
}

// Filtres
function applyFilters() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const statusFilter = document.getElementById('filter-status').value;
    const levelFilter = document.getElementById('filter-level').value;
    
    filteredCategories = categories.filter(category => {
        const matchSearch = !searchTerm || 
            category.name.toLowerCase().includes(searchTerm) ||
            category.code.toLowerCase().includes(searchTerm) ||
            (category.description && category.description.toLowerCase().includes(searchTerm));
        
        const matchStatus = !statusFilter || category.status === statusFilter;
        const matchLevel = !levelFilter || category.level.toString() === levelFilter;
        
        return matchSearch && matchStatus && matchLevel;
    });
    
    renderTree();
}

function resetFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('filter-status').value = '';
    document.getElementById('filter-level').value = '';
    applyFilters();
}

// Rendu de l'arborescence
function renderTree() {
    const treeView = document.getElementById('tree-view');
    const emptyState = document.getElementById('empty-state');
    
    if (filteredCategories.length === 0) {
        treeView.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    
    // Construire l'arborescence
    const rootCategories = filteredCategories.filter(c => !c.parentId);
    
    let html = '<div class="tree-view">';
    rootCategories.forEach(category => {
        html += renderTreeNode(category);
    });
    html += '</div>';
    
    treeView.innerHTML = html;
}

function renderTreeNode(category, depth = 0) {
    const hasChildren = filteredCategories.some(c => c.parentId === category.id);
    const isExpanded = expandedNodes.has(category.id);
    const icon = category.isLeaf ? '📄' : '📁';
    const statusColor = category.status === 'ACTIVE' ? '🟢' : '🔴';
    const statusText = category.status === 'ACTIVE' ? 'Actif' : 'Inactif';
    
    let html = `
        <div style="margin-left: ${depth * 24}px;">
            <div class="tree-item" style="display: flex; align-items: center; gap: 8px; padding: 8px; cursor: pointer; border-radius: 6px;" 
                 onmouseover="this.style.background='#F3F4F6'" 
                 onmouseout="this.style.background='transparent'">
    `;
    
    // Toggle button si a des enfants
    if (hasChildren) {
        html += `
            <span class="tree-toggle ${isExpanded ? 'expanded' : ''}" 
                  onclick="toggleNode('${category.id}', event)" 
                  style="cursor: pointer; font-size: 12px;">
                ${isExpanded ? '▼' : '▶'}
            </span>
        `;
    } else {
        html += `<span style="width: 12px;"></span>`;
    }
    
    html += `
                <span style="font-size: 20px;">${icon}</span>
                <span style="flex: 1; font-weight: ${depth === 0 ? 'bold' : 'normal'};">
                    ${category.name} <span style="color: #6B7280; font-size: 12px;">[${category.code}]</span>
                </span>
                <span class="badge badge-${category.status.toLowerCase()}">${statusColor} ${statusText}</span>
    `;
    
    if (category.isLeaf && category.productCount > 0) {
        html += `
            <span style="color: #6B7280; font-size: 12px;">
                ${category.productCount} produit${category.productCount > 1 ? 's' : ''}
            </span>
        `;
    }
    
    html += `
                <div class="actions" style="display: flex; gap: 4px;">
                    <button class="action-btn" onclick="viewCategory('${category.id}')" title="Voir détails">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                    <button class="action-btn" onclick="editCategory('${category.id}')" title="Modifier">
                        <i class="fa-solid fa-edit"></i>
                    </button>
                    ${!category.isLeaf ? `
                    <button class="action-btn" onclick="addSubCategory('${category.id}')" title="Ajouter sous-catégorie">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                    ` : ''}
                    <button class="action-btn danger" onclick="deleteCategory('${category.id}')" title="Supprimer">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
    `;
    
    // Enfants si expanded
    if (hasChildren && isExpanded) {
        const children = filteredCategories.filter(c => c.parentId === category.id);
        children.forEach(child => {
            html += renderTreeNode(child, depth + 1);
        });
    }
    
    html += '</div>';
    
    return html;
}

function toggleNode(categoryId, event) {
    event.stopPropagation();
    if (expandedNodes.has(categoryId)) {
        expandedNodes.delete(categoryId);
    } else {
        expandedNodes.add(categoryId);
    }
    renderTree();
}

// Modal Création/Édition
function openCreateModal() {
    document.getElementById('modal-title').textContent = 'Nouvelle Catégorie';
    document.getElementById('category-form').reset();
    document.getElementById('category-id').value = '';
    document.getElementById('category-status').value = 'ACTIVE';
    populateParentSelect();
    document.getElementById('modal-overlay').classList.add('active');
}

function editCategory(id) {
    const category = categories.find(c => c.id === id);
    if (!category) return;
    
    currentCategoryId = id;
    document.getElementById('modal-title').textContent = 'Modifier la Catégorie';
    document.getElementById('category-id').value = category.id;
    document.getElementById('category-code').value = category.code;
    document.getElementById('category-name').value = category.name;
    document.getElementById('category-description').value = category.description || '';
    document.getElementById('category-status').value = category.status;
    
    populateParentSelect(category.id);
    document.getElementById('category-parent').value = category.parentId || '';
    
    document.getElementById('modal-overlay').classList.add('active');
}

function addSubCategory(parentId) {
    openCreateModal();
    document.getElementById('modal-title').textContent = 'Nouvelle Sous-Catégorie';
    populateParentSelect();
    document.getElementById('category-parent').value = parentId;
}

function populateParentSelect(excludeId = null) {
    const select = document.getElementById('category-parent');
    const currentValue = select.value;
    
    select.innerHTML = '<option value="">-- Catégorie racine --</option>';
    
    // Filtrer les catégories qui ne sont pas des feuilles et exclure la catégorie en cours d'édition
    const eligibleParents = categories.filter(c => !c.isLeaf && c.id !== excludeId);
    
    eligibleParents.forEach(category => {
        const indent = '&nbsp;&nbsp;'.repeat(category.level);
        const option = document.createElement('option');
        option.value = category.id;
        option.innerHTML = `${indent}${category.name}`;
        select.appendChild(option);
    });
    
    // Restaurer la valeur si possible
    if (currentValue) {
        select.value = currentValue;
    }
}

function saveCategory() {
    const id = document.getElementById('category-id').value;
    const code = document.getElementById('category-code').value.trim().toUpperCase();
    const name = document.getElementById('category-name').value.trim();
    const parentId = document.getElementById('category-parent').value || null;
    const description = document.getElementById('category-description').value.trim();
    const status = document.getElementById('category-status').value;
    
    // Validation
    if (!code || !name) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }
    
    // Vérifier unicité du code
    const existingCode = categories.find(c => c.code === code && c.id !== id);
    if (existingCode) {
        alert(`Le code "${code}" existe déjà`);
        return;
    }
    
    // Calculer le niveau
    let level = 0;
    if (parentId) {
        const parent = categories.find(c => c.id === parentId);
        level = parent ? parent.level + 1 : 0;
    }
    
    if (id) {
        // Modification
        const category = categories.find(c => c.id === id);
        if (category) {
            category.code = code;
            category.name = name;
            category.parentId = parentId;
            category.description = description;
            category.status = status;
            category.level = level;
            category.updatedAt = new Date().toISOString().split('T')[0];
            
            // Mettre à jour isLeaf de l'ancien parent si besoin
            updateParentLeafStatus();
        }
        alert(`Catégorie "${name}" modifiée avec succès !`);
    } else {
        // Création
        const newCategory = {
            id: 'cat-' + Date.now(),
            code,
            name,
            description,
            parentId,
            level,
            isLeaf: true, // Par défaut feuille, sera mis à jour si on ajoute des enfants
            status,
            productCount: 0,
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0]
        };
        categories.push(newCategory);
        
        // Mettre à jour isLeaf du parent
        if (parentId) {
            const parent = categories.find(c => c.id === parentId);
            if (parent) {
                parent.isLeaf = false;
            }
        }
        
        alert(`Catégorie "${name}" créée avec succès !`);
    }
    
    closeModal();
    applyFilters();
    updateStats();
    populateParentSelect();
}

function updateParentLeafStatus() {
    categories.forEach(category => {
        const hasChildren = categories.some(c => c.parentId === category.id);
        category.isLeaf = !hasChildren;
    });
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
    currentCategoryId = null;
}

// Modal Vue Détails
function viewCategory(id) {
    const category = categories.find(c => c.id === id);
    if (!category) return;
    
    currentCategoryId = id;
    document.getElementById('view-modal-title').textContent = `Détails - ${category.name}`;
    
    // Construire le chemin hiérarchique
    let path = [];
    let current = category;
    while (current) {
        path.unshift(current);
        current = current.parentId ? categories.find(c => c.id === current.parentId) : null;
    }
    
    const pathStr = path.map((c, i) => {
        const icon = c.isLeaf ? '📄' : '📁';
        return `${icon} ${c.name}`;
    }).join(' > ');
    
    // Compter les sous-catégories
    const subCategories = categories.filter(c => c.parentId === category.id);
    
    const content = `
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
            <div>
                <h3 style="color: var(--primary-color); margin-bottom: 16px;">Informations Générales</h3>
                <div class="form-group">
                    <strong>Code :</strong> ${category.code}
                </div>
                <div class="form-group">
                    <strong>Nom :</strong> ${category.name}
                </div>
                <div class="form-group">
                    <strong>Description :</strong><br>
                    ${category.description || 'Non renseignée'}
                </div>
                <div class="form-group">
                    <strong>Statut :</strong> 
                    <span class="badge badge-${category.status.toLowerCase()}">
                        ${category.status === 'ACTIVE' ? '🟢 Actif' : '🔴 Inactif'}
                    </span>
                </div>
                <div class="form-group">
                    <strong>Type :</strong> 
                    ${category.isLeaf 
                        ? '<span class="badge badge-leaf">📄 Catégorie feuille</span>' 
                        : '<span class="badge badge-parent">📁 Catégorie parente</span>'}
                </div>
            </div>
            
            <div>
                <h3 style="color: var(--primary-color); margin-bottom: 16px;">Hiérarchie</h3>
                <div class="form-group">
                    <strong>Chemin :</strong><br>
                    ${pathStr}
                </div>
                <div class="form-group">
                    <strong>Niveau :</strong> ${category.level}
                </div>
                <div class="form-group">
                    <strong>Catégorie parente :</strong><br>
                    ${category.parentId ? categories.find(c => c.id === category.parentId)?.name || '-' : 'Aucune (racine)'}
                </div>
                <div class="form-group">
                    <strong>Sous-catégories :</strong> ${subCategories.length}
                </div>
            </div>
        </div>
        
        <hr style="margin: 24px 0; border: none; border-top: 1px solid var(--gray-200);">
        
        <h3 style="color: var(--primary-color); margin-bottom: 16px;">Produits</h3>
        <div class="form-group">
            <strong>Nombre de produits :</strong> ${category.productCount}
        </div>
        
        <hr style="margin: 24px 0; border: none; border-top: 1px solid var(--gray-200);">
        
        <h3 style="color: var(--primary-color); margin-bottom: 16px;">Métadonnées</h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; font-size: 13px; color: var(--gray-600);">
            <div><strong>Créé le :</strong> ${category.createdAt}</div>
            <div><strong>Modifié le :</strong> ${category.updatedAt}</div>
        </div>
    `;
    
    document.getElementById('view-modal-body').innerHTML = content;
    document.getElementById('view-modal-overlay').classList.add('active');
}

function editFromView() {
    closeViewModal();
    editCategory(currentCategoryId);
}

function closeViewModal() {
    document.getElementById('view-modal-overlay').classList.remove('active');
    currentCategoryId = null;
}

// Suppression
function deleteCategory(id) {
    const category = categories.find(c => c.id === id);
    if (!category) return;
    
    // Vérifier s'il y a des sous-catégories
    const hasChildren = categories.some(c => c.parentId === id);
    if (hasChildren) {
        alert(`Impossible de supprimer "${category.name}".\nCette catégorie contient des sous-catégories.`);
        return;
    }
    
    // Vérifier s'il y a des produits
    if (category.productCount > 0) {
        if (!confirm(`La catégorie "${category.name}" contient ${category.productCount} produit(s).\n\nÊtes-vous sûr de vouloir la supprimer ?`)) {
            return;
        }
    }
    
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${category.name}" ?\n\nCette action est irréversible.`)) {
        return;
    }
    
    categories = categories.filter(c => c.id !== id);
    
    // Mettre à jour le parent si c'était le dernier enfant
    updateParentLeafStatus();
    
    alert(`Catégorie "${category.name}" supprimée avec succès !`);
    
    applyFilters();
    updateStats();
    populateParentSelect();
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










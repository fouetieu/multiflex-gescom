// ================================================
// DEMANDES-ACHAT-LIST.JS
// Gestion de la liste des demandes d'achat
// ================================================

// État global
let demandes = [];
let filteredDemandes = [];
let currentPage = 1;
let itemsPerPage = 25;
let sortColumn = 'date';
let sortDirection = 'desc';
let currentQuickFilter = 'all';

// ================================================
// INITIALISATION
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation de la gestion des demandes d\'achat...');
    loadDemandes();
});

// ================================================
// CHARGEMENT DES DONNÉES
// ================================================

function loadDemandes() {
    // Simuler le chargement depuis une API
    demandes = generateMockDemandes();
    
    filteredDemandes = [...demandes];
    updateStats();
    updateQuickFilterCounts();
    applyFilters();
}

function generateMockDemandes() {
    return [
        {
            id: 'DA-2024-089',
            code: 'DA-2024-089',
            date: '2024-01-15',
            requester: 'Jean DUPONT',
            department: 'PRODUCTION',
            priority: 'URGENTE',
            estimatedAmount: 500000,
            deliveryDate: '2024-01-22',
            status: 'EN_VALIDATION',
            items: [
                { description: 'Base peinture acrylique', quantity: 200, unit: 'L', unitPrice: 1500, total: 300000 },
                { description: 'Pigments colorants', quantity: 50, unit: 'kg', unitPrice: 4000, total: 200000 }
            ],
            reason: 'Production urgente pour commande client prioritaire',
            attachments: ['devis_abc.pdf'],
            createdAt: '2024-01-15T08:30:00',
            workflow: [
                { step: 'Création', user: 'Jean DUPONT', date: '2024-01-15T08:30:00', status: 'DONE' },
                { step: 'Validation N+1', user: 'Paul KAMGA', date: null, status: 'CURRENT' },
                { step: 'Validation Achats', user: null, date: null, status: 'PENDING' }
            ]
        },
        {
            id: 'DA-2024-090',
            code: 'DA-2024-090',
            date: '2024-01-15',
            requester: 'Marie MARTIN',
            department: 'LOGISTIQUE',
            priority: 'HAUTE',
            estimatedAmount: 1200000,
            deliveryDate: '2024-01-25',
            status: 'EN_VALIDATION',
            items: [
                { description: 'Palettes EUR', quantity: 100, unit: 'unité', unitPrice: 8000, total: 800000 },
                { description: 'Film étirable', quantity: 40, unit: 'rouleau', unitPrice: 10000, total: 400000 }
            ],
            reason: 'Réapprovisionnement stock logistique',
            attachments: [],
            createdAt: '2024-01-15T10:15:00',
            workflow: [
                { step: 'Création', user: 'Marie MARTIN', date: '2024-01-15T10:15:00', status: 'DONE' },
                { step: 'Validation N+1', user: 'Sophie MBARGA', date: null, status: 'CURRENT' },
                { step: 'Validation Achats', user: null, date: null, status: 'PENDING' }
            ]
        },
        {
            id: 'DA-2024-091',
            code: 'DA-2024-091',
            date: '2024-01-14',
            requester: 'Paul DURAND',
            department: 'ADMINISTRATION',
            priority: 'NORMALE',
            estimatedAmount: 350000,
            deliveryDate: '2024-02-01',
            status: 'VALIDEE',
            items: [
                { description: 'Fournitures bureau', quantity: 1, unit: 'lot', unitPrice: 250000, total: 250000 },
                { description: 'Cartouches imprimante', quantity: 20, unit: 'unité', unitPrice: 5000, total: 100000 }
            ],
            reason: 'Consommables mensuels',
            attachments: [],
            createdAt: '2024-01-14T14:20:00',
            validatedAt: '2024-01-14T16:45:00',
            validatedBy: 'Marie AKONO',
            workflow: [
                { step: 'Création', user: 'Paul DURAND', date: '2024-01-14T14:20:00', status: 'DONE' },
                { step: 'Validation N+1', user: 'André TCHUENTE', date: '2024-01-14T15:30:00', status: 'DONE' },
                { step: 'Validation Achats', user: 'Marie AKONO', date: '2024-01-14T16:45:00', status: 'DONE' }
            ]
        },
        {
            id: 'DA-2024-092',
            code: 'DA-2024-092',
            date: '2024-01-14',
            requester: 'Sophie KAMGA',
            department: 'PRODUCTION',
            priority: 'HAUTE',
            estimatedAmount: 800000,
            deliveryDate: '2024-01-20',
            status: 'VALIDEE',
            items: [
                { description: 'Ciment gris 42.5', quantity: 100, unit: 'sac', unitPrice: 8000, total: 800000 }
            ],
            reason: 'Production béton',
            attachments: [],
            createdAt: '2024-01-14T09:00:00',
            validatedAt: '2024-01-14T11:30:00',
            validatedBy: 'Marie AKONO',
            workflow: [
                { step: 'Création', user: 'Sophie KAMGA', date: '2024-01-14T09:00:00', status: 'DONE' },
                { step: 'Validation N+1', user: 'Paul KAMGA', date: '2024-01-14T10:15:00', status: 'DONE' },
                { step: 'Validation Achats', user: 'Marie AKONO', date: '2024-01-14T11:30:00', status: 'DONE' }
            ]
        },
        {
            id: 'DA-2024-093',
            code: 'DA-2024-093',
            date: '2024-01-13',
            requester: 'Pierre NGONO',
            department: 'MAINTENANCE',
            priority: 'NORMALE',
            estimatedAmount: 650000,
            deliveryDate: '2024-01-28',
            status: 'TRAITEE',
            items: [
                { description: 'Pièces détachées pompe', quantity: 1, unit: 'lot', unitPrice: 450000, total: 450000 },
                { description: 'Huile hydraulique', quantity: 20, unit: 'L', unitPrice: 10000, total: 200000 }
            ],
            reason: 'Maintenance préventive',
            attachments: [],
            createdAt: '2024-01-13T11:00:00',
            validatedAt: '2024-01-13T14:30:00',
            validatedBy: 'Marie AKONO',
            bcfGenerated: 'BCF-2024-0145',
            bcfDate: '2024-01-13T15:00:00',
            workflow: [
                { step: 'Création', user: 'Pierre NGONO', date: '2024-01-13T11:00:00', status: 'DONE' },
                { step: 'Validation N+1', user: 'Thomas NKOLO', date: '2024-01-13T12:30:00', status: 'DONE' },
                { step: 'Validation Achats', user: 'Marie AKONO', date: '2024-01-13T14:30:00', status: 'DONE' },
                { step: 'Transformation BCF', user: 'Marie AKONO', date: '2024-01-13T15:00:00', status: 'DONE' }
            ]
        },
        {
            id: 'DA-2024-094',
            code: 'DA-2024-094',
            date: '2024-01-12',
            requester: 'Françoise MANGA',
            department: 'COMMERCIAL',
            priority: 'BASSE',
            estimatedAmount: 180000,
            deliveryDate: '2024-02-05',
            status: 'REFUSEE',
            items: [
                { description: 'Goodies publicitaires', quantity: 500, unit: 'unité', unitPrice: 360, total: 180000 }
            ],
            reason: 'Campagne marketing Q1',
            attachments: [],
            createdAt: '2024-01-12T13:45:00',
            rejectedAt: '2024-01-12T16:20:00',
            rejectedBy: 'Marie AKONO',
            rejectionReason: 'Budget marketing déjà consommé pour Q1',
            workflow: [
                { step: 'Création', user: 'Françoise MANGA', date: '2024-01-12T13:45:00', status: 'DONE' },
                { step: 'Validation N+1', user: 'André TCHUENTE', date: '2024-01-12T15:00:00', status: 'DONE' },
                { step: 'Validation Achats', user: 'Marie AKONO', date: '2024-01-12T16:20:00', status: 'REJECTED' }
            ]
        },
        {
            id: 'DA-2024-095',
            code: 'DA-2024-095',
            date: '2024-01-15',
            requester: 'Jean DUPONT',
            department: 'PRODUCTION',
            priority: 'BASSE',
            estimatedAmount: 420000,
            deliveryDate: '2024-02-10',
            status: 'BROUILLON',
            items: [
                { description: 'Gants de protection', quantity: 200, unit: 'paire', unitPrice: 1500, total: 300000 },
                { description: 'Lunettes de sécurité', quantity: 100, unit: 'unité', unitPrice: 1200, total: 120000 }
            ],
            reason: 'EPI équipe production',
            attachments: [],
            createdAt: '2024-01-15T16:30:00',
            workflow: []
        },
        {
            id: 'DA-2024-096',
            code: 'DA-2024-096',
            date: '2024-01-14',
            requester: 'Thomas NKOLO',
            department: 'MAINTENANCE',
            priority: 'URGENTE',
            estimatedAmount: 2500000,
            deliveryDate: '2024-01-18',
            status: 'EN_VALIDATION',
            items: [
                { description: 'Groupe électrogène 50 kVA', quantity: 1, unit: 'unité', unitPrice: 2500000, total: 2500000 }
            ],
            reason: 'Panne groupe actuel - Arrêt production imminent',
            attachments: ['devis_generateur.pdf', 'rapport_panne.pdf'],
            createdAt: '2024-01-14T17:00:00',
            workflow: [
                { step: 'Création', user: 'Thomas NKOLO', date: '2024-01-14T17:00:00', status: 'DONE' },
                { step: 'Validation N+1', user: 'Pierre ESSOMBA', date: null, status: 'CURRENT' },
                { step: 'Validation Direction', user: null, date: null, status: 'PENDING' }
            ]
        }
    ];
}

// ================================================
// MISE À JOUR DES STATISTIQUES
// ================================================

function updateStats() {
    const total = demandes.length;
    const pending = demandes.filter(d => d.status === 'EN_VALIDATION').length;
    const validated = demandes.filter(d => d.status === 'VALIDEE').length;
    const totalAmount = demandes.reduce((sum, d) => sum + d.estimatedAmount, 0);
    
    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-pending').textContent = pending;
    document.getElementById('stat-validated').textContent = validated;
    document.getElementById('stat-amount').textContent = formatCurrency(totalAmount);
}

function updateQuickFilterCounts() {
    const all = demandes.length;
    const draft = demandes.filter(d => d.status === 'BROUILLON').length;
    const pending = demandes.filter(d => d.status === 'EN_VALIDATION').length;
    const validated = demandes.filter(d => d.status === 'VALIDEE').length;
    const rejected = demandes.filter(d => d.status === 'REFUSEE').length;
    const urgent = demandes.filter(d => d.priority === 'URGENTE').length;
    
    document.getElementById('count-all').textContent = all;
    document.getElementById('count-draft').textContent = draft;
    document.getElementById('count-pending').textContent = pending;
    document.getElementById('count-validated').textContent = validated;
    document.getElementById('count-rejected').textContent = rejected;
    document.getElementById('count-urgent').textContent = urgent;
}

// ================================================
// FILTRES RAPIDES
// ================================================

function applyQuickFilter(filter) {
    currentQuickFilter = filter;
    currentPage = 1;
    
    // Mettre à jour l'UI
    document.querySelectorAll('.quick-filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
    
    // Réinitialiser les filtres avancés
    document.getElementById('filter-department').value = '';
    document.getElementById('filter-priority').value = '';
    document.getElementById('filter-status').value = '';
    
    applyFilters();
}

// ================================================
// FILTRAGE ET RECHERCHE
// ================================================

function applyFilters() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const departmentFilter = document.getElementById('filter-department').value;
    const priorityFilter = document.getElementById('filter-priority').value;
    const statusFilter = document.getElementById('filter-status').value;
    
    filteredDemandes = demandes.filter(demande => {
        // Recherche textuelle
        const matchesSearch = !searchTerm || 
            demande.code.toLowerCase().includes(searchTerm) ||
            demande.requester.toLowerCase().includes(searchTerm) ||
            demande.department.toLowerCase().includes(searchTerm);
        
        // Filtre quick
        let matchesQuickFilter = true;
        if (currentQuickFilter === 'draft') {
            matchesQuickFilter = demande.status === 'BROUILLON';
        } else if (currentQuickFilter === 'pending') {
            matchesQuickFilter = demande.status === 'EN_VALIDATION';
        } else if (currentQuickFilter === 'validated') {
            matchesQuickFilter = demande.status === 'VALIDEE';
        } else if (currentQuickFilter === 'rejected') {
            matchesQuickFilter = demande.status === 'REFUSEE';
        } else if (currentQuickFilter === 'urgent') {
            matchesQuickFilter = demande.priority === 'URGENTE';
        }
        
        // Filtres avancés
        const matchesDepartment = !departmentFilter || demande.department === departmentFilter;
        const matchesPriority = !priorityFilter || demande.priority === priorityFilter;
        const matchesStatus = !statusFilter || demande.status === statusFilter;
        
        return matchesSearch && matchesQuickFilter && matchesDepartment && matchesPriority && matchesStatus;
    });
    
    renderTable();
    renderPagination();
}

function resetFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('filter-department').value = '';
    document.getElementById('filter-priority').value = '';
    document.getElementById('filter-status').value = '';
    currentQuickFilter = 'all';
    
    document.querySelectorAll('.quick-filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('[data-filter="all"]').classList.add('active');
    
    currentPage = 1;
    applyFilters();
}

// ================================================
// TRI
// ================================================

function sortTable(column) {
    if (sortColumn === column) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn = column;
        sortDirection = 'asc';
    }
    
    filteredDemandes.sort((a, b) => {
        let aVal = a[column];
        let bVal = b[column];
        
        if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
        }
        
        if (sortDirection === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });
    
    renderTable();
}

// ================================================
// AFFICHAGE DU TABLEAU
// ================================================

function renderTable() {
    const tbody = document.getElementById('table-body');
    const emptyState = document.getElementById('empty-state');
    
    if (filteredDemandes.length === 0) {
        tbody.innerHTML = '';
        emptyState.classList.remove('hidden');
        document.getElementById('pagination').style.display = 'none';
        return;
    }
    
    emptyState.classList.add('hidden');
    document.getElementById('pagination').style.display = 'flex';
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredDemandes.length);
    const pageData = filteredDemandes.slice(startIndex, endIndex);
    
    tbody.innerHTML = pageData.map(demande => {
        const priorityBadge = getPriorityBadge(demande.priority);
        const statusBadge = getStatusBadge(demande.status);
        const departmentLabel = getDepartmentLabel(demande.department);
        
        return `
            <tr>
                <td>
                    <input type="checkbox" class="row-checkbox" data-id="${demande.id}">
                </td>
                <td>
                    <div style="font-weight: 600; font-size: 14px;">${demande.code}</div>
                    ${demande.bcfGenerated ? `
                        <div style="font-size: 11px; color: #10B981; margin-top: 4px;">
                            <i class="fa-solid fa-link"></i> ${demande.bcfGenerated}
                        </div>
                    ` : ''}
                </td>
                <td>
                    <div style="font-size: 13px;">${formatDate(demande.date)}</div>
                    <div style="font-size: 11px; color: var(--gray-500); margin-top: 2px;">
                        <i class="fa-solid fa-clock"></i> ${formatTime(demande.createdAt)}
                    </div>
                </td>
                <td>
                    <div style="font-weight: 500;">${demande.requester}</div>
                </td>
                <td>
                    <div style="font-size: 13px;">${departmentLabel}</div>
                </td>
                <td class="text-center">
                    ${priorityBadge}
                </td>
                <td class="text-right">
                    <div style="font-weight: 600; font-size: 14px;">${formatCurrency(demande.estimatedAmount)}</div>
                    <div class="da-meta" style="justify-content: flex-end;">
                        <span class="da-meta-item">
                            <i class="fa-solid fa-box"></i>
                            ${demande.items.length} article${demande.items.length > 1 ? 's' : ''}
                        </span>
                    </div>
                </td>
                <td class="text-center">
                    ${statusBadge}
                    ${demande.status === 'EN_VALIDATION' ? `
                        <div style="font-size: 11px; color: #F59E0B; margin-top: 4px;">
                            <i class="fa-solid fa-user-clock"></i> ${getCurrentValidatorLabel(demande)}
                        </div>
                    ` : ''}
                </td>
                <td class="text-center">
                    <div class="action-buttons">
                        <button class="btn-icon" onclick="viewDemande('${demande.id}')" title="Voir">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        ${demande.status === 'BROUILLON' || demande.status === 'REFUSEE' ? `
                            <button class="btn-icon" onclick="editDemande('${demande.id}')" title="Modifier">
                                <i class="fa-solid fa-edit"></i>
                            </button>
                        ` : ''}
                        ${demande.status === 'VALIDEE' ? `
                            <button class="btn-icon" onclick="transformToBCF('${demande.id}')" title="Transformer en BCF" style="color: #10B981;">
                                <i class="fa-solid fa-shopping-cart"></i>
                            </button>
                        ` : ''}
                        ${demande.status === 'BROUILLON' ? `
                            <button class="btn-icon btn-icon-danger" onclick="deleteDemande('${demande.id}')" title="Supprimer">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// ================================================
// HELPERS
// ================================================

function getPriorityBadge(priority) {
    const badges = {
        'BASSE': '<span class="badge-priority low">🟢 Basse</span>',
        'NORMALE': '<span class="badge-priority normal">🟡 Normale</span>',
        'HAUTE': '<span class="badge-priority high">🟠 Haute</span>',
        'URGENTE': '<span class="badge-priority urgent">🔴 Urgente</span>'
    };
    return badges[priority] || priority;
}

function getStatusBadge(status) {
    const badges = {
        'BROUILLON': '<span class="badge-status badge-draft"><i class="fa-solid fa-file-pen"></i> Brouillon</span>',
        'EN_VALIDATION': '<span class="badge-status badge-pending"><i class="fa-solid fa-clock"></i> En Validation</span>',
        'VALIDEE': '<span class="badge-status badge-validated"><i class="fa-solid fa-check-circle"></i> Validée</span>',
        'REFUSEE': '<span class="badge-status badge-rejected"><i class="fa-solid fa-times-circle"></i> Refusée</span>',
        'TRAITEE': '<span class="badge-status badge-sent"><i class="fa-solid fa-check-double"></i> Traitée</span>'
    };
    return badges[status] || status;
}

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

function getCurrentValidatorLabel(demande) {
    const currentStep = demande.workflow?.find(w => w.status === 'CURRENT');
    return currentStep ? currentStep.user : 'En attente';
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatTime(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount) + ' XAF';
}

// ================================================
// PAGINATION
// ================================================

function renderPagination() {
    const totalPages = Math.ceil(filteredDemandes.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, filteredDemandes.length);
    
    document.getElementById('pagination-info').textContent = 
        `Affichage de ${startIndex} à ${endIndex} sur ${filteredDemandes.length} demandes`;
    
    let controls = '';
    
    if (totalPages > 1) {
        controls += `
            <button class="btn-pagination" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
                <i class="fa-solid fa-chevron-left"></i>
            </button>
        `;
        
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                controls += `
                    <button class="btn-pagination ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">
                        ${i}
                    </button>
                `;
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                controls += `<span style="padding: 0 8px;">...</span>`;
            }
        }
        
        controls += `
            <button class="btn-pagination" onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
                <i class="fa-solid fa-chevron-right"></i>
            </button>
        `;
    }
    
    document.getElementById('pagination-controls').innerHTML = controls;
}

function goToPage(page) {
    const totalPages = Math.ceil(filteredDemandes.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    renderTable();
    renderPagination();
}

// ================================================
// ACTIONS
// ================================================

function viewDemande(id) {
    const demande = demandes.find(d => d.id === id);
    if (!demande) return;
    
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    modalTitle.textContent = `Demande d'Achat ${demande.code}`;
    
    modalBody.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
            <div>
                <strong style="color: #6B7280; font-size: 12px; text-transform: uppercase;">Demandeur</strong>
                <div style="font-size: 15px; font-weight: 500; margin-top: 4px;">${demande.requester}</div>
            </div>
            <div>
                <strong style="color: #6B7280; font-size: 12px; text-transform: uppercase;">Département</strong>
                <div style="font-size: 15px; font-weight: 500; margin-top: 4px;">${getDepartmentLabel(demande.department)}</div>
            </div>
            <div>
                <strong style="color: #6B7280; font-size: 12px; text-transform: uppercase;">Date</strong>
                <div style="font-size: 15px; font-weight: 500; margin-top: 4px;">${formatDate(demande.date)}</div>
            </div>
            <div>
                <strong style="color: #6B7280; font-size: 12px; text-transform: uppercase;">Priorité</strong>
                <div style="margin-top: 4px;">${getPriorityBadge(demande.priority)}</div>
            </div>
            <div>
                <strong style="color: #6B7280; font-size: 12px; text-transform: uppercase;">Date Livraison Souhaitée</strong>
                <div style="font-size: 15px; font-weight: 500; margin-top: 4px;">${formatDate(demande.deliveryDate)}</div>
            </div>
            <div>
                <strong style="color: #6B7280; font-size: 12px; text-transform: uppercase;">Statut</strong>
                <div style="margin-top: 4px;">${getStatusBadge(demande.status)}</div>
            </div>
        </div>
        
        <div style="margin-bottom: 24px;">
            <strong style="color: #6B7280; font-size: 12px; text-transform: uppercase;">Motif</strong>
            <div style="font-size: 14px; margin-top: 4px; color: #374151;">${demande.reason}</div>
        </div>
        
        <div style="margin-bottom: 24px;">
            <strong style="color: #6B7280; font-size: 12px; text-transform: uppercase; margin-bottom: 12px; display: block;">Articles Demandés</strong>
            <table style="width: 100%; font-size: 13px;">
                <thead style="background: #F3F4F6;">
                    <tr>
                        <th style="padding: 8px; text-align: left;">Description</th>
                        <th style="padding: 8px; text-align: center;">Quantité</th>
                        <th style="padding: 8px; text-align: right;">PU Estimé</th>
                        <th style="padding: 8px; text-align: right;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${demande.items.map(item => `
                        <tr style="border-bottom: 1px solid #E5E7EB;">
                            <td style="padding: 8px;">${item.description}</td>
                            <td style="padding: 8px; text-align: center;">${item.quantity} ${item.unit}</td>
                            <td style="padding: 8px; text-align: right;">${formatCurrency(item.unitPrice)}</td>
                            <td style="padding: 8px; text-align: right; font-weight: 600;">${formatCurrency(item.total)}</td>
                        </tr>
                    `).join('')}
                </tbody>
                <tfoot style="background: #F9FAFB; font-weight: 600;">
                    <tr>
                        <td colspan="3" style="padding: 12px; text-align: right;">Total Estimé:</td>
                        <td style="padding: 12px; text-align: right; font-size: 16px; color: #263c89;">${formatCurrency(demande.estimatedAmount)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
        
        ${demande.workflow && demande.workflow.length > 0 ? `
            <div>
                <strong style="color: #6B7280; font-size: 12px; text-transform: uppercase; margin-bottom: 12px; display: block;">Workflow de Validation</strong>
                <div style="display: flex; align-items: center; gap: 8px;">
                    ${demande.workflow.map((step, index) => `
                        ${index > 0 ? '<div class="workflow-line' + (step.status === 'DONE' ? ' done' : '') + '"></div>' : ''}
                        <div style="text-align: center;">
                            <div class="workflow-step ${step.status === 'DONE' ? 'done' : step.status === 'CURRENT' ? 'current' : 'pending'}">
                                ${step.status === 'DONE' ? '<i class="fa-solid fa-check"></i>' : 
                                  step.status === 'REJECTED' ? '<i class="fa-solid fa-times"></i>' : 
                                  index + 1}
                            </div>
                            <div style="font-size: 11px; font-weight: 500; margin-top: 6px; max-width: 100px;">${step.step}</div>
                            ${step.user ? `<div style="font-size: 10px; color: #6B7280; margin-top: 2px;">${step.user}</div>` : ''}
                            ${step.date ? `<div style="font-size: 10px; color: #6B7280;">${formatDate(step.date)}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : ''}
        
        ${demande.rejectionReason ? `
            <div class="alert-box alert-danger" style="margin-top: 20px;">
                <i class="fa-solid fa-exclamation-triangle"></i>
                <div>
                    <strong>Motif de rejet:</strong><br>
                    ${demande.rejectionReason}
                </div>
            </div>
        ` : ''}
    `;
    
    document.getElementById('view-modal').style.display = 'flex';
}

function closeViewModal() {
    document.getElementById('view-modal').style.display = 'none';
}

function editDemande(id) {
    window.location.href = `./demande-achat-edit.html?id=${id}`;
}

function deleteDemande(id) {
    if (confirm('Supprimer cette demande d\'achat ?')) {
        console.log('Suppression DA:', id);
        demandes = demandes.filter(d => d.id !== id);
        updateStats();
        updateQuickFilterCounts();
        applyFilters();
        alert('Demande d\'achat supprimée');
    }
}

function transformToBCF(id) {
    window.location.href = `./commande-create.html?da=${id}`;
}

// ================================================
// SÉLECTION MULTIPLE
// ================================================

function toggleSelectAll() {
    const isChecked = document.getElementById('select-all').checked;
    document.querySelectorAll('.row-checkbox').forEach(cb => {
        cb.checked = isChecked;
    });
}

// ================================================
// EXPORT
// ================================================

function exportDAs() {
    alert('Fonctionnalité d\'export à implémenter');
}


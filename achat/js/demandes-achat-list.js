// ================================================
// DEMANDES-ACHAT-LIST.JS
// Gestion de la liste des demandes d'achat
// ================================================

// État global
let demandes = [];
let filteredDemandes = [];
let currentPage = 1;
let itemsPerPage = 10;
let sortColumn = 'date';
let sortDirection = 'desc';
let currentQuickFilter = 'all';
let selectedDAs = new Set();

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
            id: 'DA-2024-0234',
            code: 'DA-2024-0234',
            date: '2024-01-15',
            requester: 'H. MBOUOMBOUO',
            needOriginator: 'J. KAMGA',
            department: 'PROD',
            priority: 'URGENTE',
            estimatedAmount: 265000,
            deliveryDate: '2024-01-25',
            status: 'EN_VALIDATION',
            items: [
                { description: 'Produit chimique A', catalogCode: 'CHEM-001', quantity: 100, unit: 'L', unitPrice: 2500, total: 250000 },
                { description: 'Matériel électrique spécial', catalogCode: null, quantity: 15, unit: 'U', unitPrice: 1000, total: 15000 }
            ],
            reason: 'Renouvellement urgent du stock de matières premières suite à la rupture de notre fournisseur principal',
            attachments: [
                { type: 'DEVIS_FOURNISSEUR', name: 'devis_supplier_001.pdf', size: '2.3 MB', required: true },
                { type: 'JUSTIFICATIF_URGENCE', name: 'memo_urgence_production.pdf', size: '450 KB', required: true },
                { type: 'SPECIFICATIONS_TECHNIQUES', name: 'spec_technique_materiel.pdf', size: '1.2 MB', required: false }
            ],
            createdAt: '2024-01-15T10:30:00',
            workflow: [
                { step: 'Créée', user: 'Herman MBOUOMBOUO', date: '2024-01-15T10:30:00', status: 'DONE' },
                { step: 'Soumise pour validation', user: null, date: '2024-01-15T10:45:00', status: 'DONE' },
                { step: 'Assignée', user: 'Paul NGA', date: '2024-01-15T11:00:00', status: 'CURRENT' }
            ]
        },
        {
            id: 'DA-2024-0235',
            code: 'DA-2024-0235',
            date: '2024-01-16',
            requester: 'P. NJOYA',
            needOriginator: 'P. NJOYA',
            department: 'MAIN',
            priority: 'NORMALE',
            estimatedAmount: 150000,
            deliveryDate: '2024-01-28',
            status: 'EN_VALIDATION',
            items: [
                { description: 'Pièces détachées pompe', quantity: 1, unit: 'lot', unitPrice: 150000, total: 150000 }
            ],
            reason: 'Maintenance préventive',
            attachments: [],
            createdAt: '2024-01-16T09:15:00',
            workflow: [
                { step: 'Créée', user: 'P. NJOYA', date: '2024-01-16T09:15:00', status: 'DONE' },
                { step: 'En attente validation', user: 'Paul NGA', date: null, status: 'CURRENT' }
            ]
        },
        {
            id: 'DA-2024-0236',
            code: 'DA-2024-0236',
            date: '2024-01-16',
            requester: 'M. FOTSO',
            needOriginator: 'L. TCHINDA',
            department: 'IT',
            priority: 'BASSE',
            estimatedAmount: 85000,
            deliveryDate: '2024-02-05',
            status: 'VALIDEE',
            items: [
                { description: 'Câbles réseau CAT6', quantity: 50, unit: 'unité', unitPrice: 1000, total: 50000 },
                { description: 'Switch 24 ports', quantity: 1, unit: 'unité', unitPrice: 35000, total: 35000 }
            ],
            reason: 'Extension réseau informatique',
            attachments: [],
            createdAt: '2024-01-16T14:20:00',
            validatedAt: '2024-01-16T16:45:00',
            validatedBy: 'Paul NGA',
            workflow: [
                { step: 'Créée', user: 'M. FOTSO', date: '2024-01-16T14:20:00', status: 'DONE' },
                { step: 'Validée', user: 'Paul NGA', date: '2024-01-16T16:45:00', status: 'DONE' }
            ]
        },
        {
            id: 'DA-2024-0237',
            code: 'DA-2024-0237',
            date: '2024-01-17',
            requester: 'K. BELLA',
            needOriginator: 'K. BELLA',
            department: 'PROD',
            priority: 'NORMALE',
            estimatedAmount: 520000,
            deliveryDate: '2024-01-30',
            status: 'REFUSEE',
            items: [
                { description: 'Équipements protection', quantity: 100, unit: 'lot', unitPrice: 5200, total: 520000 }
            ],
            reason: 'EPI équipe production',
            attachments: [],
            createdAt: '2024-01-17T11:00:00',
            rejectedAt: '2024-01-17T14:30:00',
            rejectedBy: 'Paul NGA',
            rejectionReason: 'Budget épuisé pour ce trimestre. Reporter au T2.',
            workflow: [
                { step: 'Créée', user: 'K. BELLA', date: '2024-01-17T11:00:00', status: 'DONE' },
                { step: 'Rejetée', user: 'Paul NGA', date: '2024-01-17T14:30:00', status: 'REJECTED' }
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
    const rejected = demandes.filter(d => d.status === 'REFUSEE').length;
    const totalAmountPending = demandes.filter(d => d.status === 'EN_VALIDATION').reduce((sum, d) => sum + d.estimatedAmount, 0);
    
    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-pending').textContent = pending;
    document.getElementById('stat-validated').textContent = validated;
    document.getElementById('stat-rejected').textContent = rejected;
    document.getElementById('stat-amount').textContent = formatCurrency(totalAmountPending);
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
    
    applyFilters();
}

// ================================================
// FILTRAGE ET RECHERCHE
// ================================================

function applyFilters() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const searchEmetteur = document.getElementById('search-emetteur').value.toLowerCase();
    const departmentFilter = document.getElementById('filter-department').value;
    const priorityFilter = document.getElementById('filter-priority').value;
    const statusFilter = document.getElementById('filter-status').value;
    const periodFilter = document.getElementById('filter-period').value;
    
    filteredDemandes = demandes.filter(demande => {
        // Recherche textuelle
        const matchesSearch = !searchTerm || 
            demande.code.toLowerCase().includes(searchTerm) ||
            demande.requester.toLowerCase().includes(searchTerm);
        
        // Recherche émetteur
        const matchesEmetteur = !searchEmetteur || 
            demande.needOriginator.toLowerCase().includes(searchEmetteur);
        
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
        
        // Filtre période
        let matchesPeriod = true;
        if (periodFilter) {
            const daDate = new Date(demande.date);
            const today = new Date();
            const diffDays = (today - daDate) / (1000 * 60 * 60 * 24);
            
            if (periodFilter === 'today' && diffDays > 1) matchesPeriod = false;
            if (periodFilter === 'week' && diffDays > 7) matchesPeriod = false;
            if (periodFilter === 'month' && diffDays > 30) matchesPeriod = false;
            if (periodFilter === 'quarter' && diffDays > 90) matchesPeriod = false;
        }
        
        return matchesSearch && matchesEmetteur && matchesQuickFilter && matchesDepartment && matchesPriority && matchesStatus && matchesPeriod;
    });
    
    renderTable();
    renderPagination();
}

function resetFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('search-emetteur').value = '';
    document.getElementById('filter-department').value = '';
    document.getElementById('filter-priority').value = '';
    document.getElementById('filter-status').value = '';
    document.getElementById('filter-period').value = '';
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
        const departmentLabel = demande.department;
        
        return `
            <tr ${selectedDAs.has(demande.id) ? 'style="background: #EFF6FF;"' : ''}>
                <td>
                    <input type="checkbox" class="row-checkbox" data-id="${demande.id}" 
                        ${selectedDAs.has(demande.id) ? 'checked' : ''}
                        onchange="toggleSelectDA('${demande.id}')">
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
                </td>
                <td>
                    <div style="font-weight: 500; font-size: 14px;">${demande.requester}</div>
                    <div style="font-size: 12px; color: #6B7280; margin-top: 2px;">
                        └→ ${demande.needOriginator}
                    </div>
                </td>
                <td>
                    <div style="font-size: 13px;">${departmentLabel}</div>
                </td>
                <td class="text-center">
                    ${priorityBadge}
                </td>
                <td class="text-right">
                    <div style="font-weight: 600; font-size: 14px;">${formatCurrency(demande.estimatedAmount)}</div>
                </td>
                <td class="text-center">
                    ${statusBadge}
                </td>
                <td class="text-center">
                    <div class="action-buttons">
                        <button class="btn-icon" onclick="viewDemande('${demande.id}')" title="Voir">
                            👁
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    updateBulkActions();
}

// ================================================
// SÉLECTION MULTIPLE
// ================================================

function toggleSelectAll() {
    const isChecked = document.getElementById('select-all').checked;
    if (isChecked) {
        filteredDemandes.forEach(d => selectedDAs.add(d.id));
    } else {
        selectedDAs.clear();
    }
    renderTable();
}

function toggleSelectDA(id) {
    if (selectedDAs.has(id)) {
        selectedDAs.delete(id);
    } else {
        selectedDAs.add(id);
    }
    renderTable();
}

function updateBulkActions() {
    const bulkActionsDiv = document.getElementById('bulk-actions');
    const count = selectedDAs.size;
    
    if (count > 0) {
        bulkActionsDiv.style.display = 'block';
        document.getElementById('selected-count').textContent = count;
        
        const total = Array.from(selectedDAs)
            .map(id => demandes.find(d => d.id === id))
            .filter(d => d)
            .reduce((sum, d) => sum + d.estimatedAmount, 0);
        
        document.getElementById('selected-total').textContent = formatCurrency(total);
    } else {
        bulkActionsDiv.style.display = 'none';
    }
}

// ================================================
// ACTIONS GROUPÉES
// ================================================

function bulkValidate() {
    const count = selectedDAs.size;
    if (confirm(`Valider ${count} demandes d'achat sélectionnées ?`)) {
        console.log('Validation groupée:', Array.from(selectedDAs));
        alert(`${count} DA validées avec succès !`);
        selectedDAs.clear();
        renderTable();
    }
}

function bulkReject() {
    const count = selectedDAs.size;
    if (confirm(`Rejeter ${count} demandes d'achat sélectionnées ?`)) {
        console.log('Rejet groupé:', Array.from(selectedDAs));
        alert(`${count} DA rejetées.`);
        selectedDAs.clear();
        renderTable();
    }
}

function bulkTransfer() {
    const count = selectedDAs.size;
    alert(`Transfert de ${count} DA - Fonctionnalité à implémenter`);
}

function bulkCreateBCF() {
    const count = selectedDAs.size;
    alert(`Création BCF pour ${count} DA - Fonctionnalité à implémenter`);
}

// ================================================
// HELPERS
// ================================================

function getPriorityBadge(priority) {
    const badges = {
        'BASSE': '<span class="badge-priority low" style="font-size: 11px;">🟢 BAS</span>',
        'NORMALE': '<span class="badge-priority normal" style="font-size: 11px;">🟡 NORM</span>',
        'HAUTE': '<span class="badge-priority high" style="font-size: 11px;">🟠 HAUTE</span>',
        'URGENTE': '<span class="badge-priority urgent" style="font-size: 11px;">🔴 URG</span>'
    };
    return badges[priority] || priority;
}

function getStatusBadge(status) {
    const badges = {
        'BROUILLON': '<span class="badge-status badge-draft" style="font-size: 12px;"><i class="fa-solid fa-file-pen"></i> Brouillon</span>',
        'EN_VALIDATION': '<span class="badge-status badge-pending" style="font-size: 12px;">⏳VAL</span>',
        'VALIDEE': '<span class="badge-status badge-validated" style="font-size: 12px;">✅VAL</span>',
        'REFUSEE': '<span class="badge-status badge-rejected" style="font-size: 12px;">❌REJ</span>',
        'TRAITEE': '<span class="badge-status badge-sent" style="font-size: 12px;"><i class="fa-solid fa-check-double"></i> Traitée</span>'
    };
    return badges[status] || status;
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' });
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
        `Affichage ${startIndex}-${endIndex} sur ${filteredDemandes.length}`;
    
    let controls = '';
    
    if (totalPages > 1) {
        controls += `
            <button class="btn-pagination" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
                ◀
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
                ▶
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
                <strong style="color: #6B7280; font-size: 12px; text-transform: uppercase;">N° DA</strong>
                <div style="font-size: 15px; font-weight: 500; margin-top: 4px;">${demande.code}</div>
            </div>
            <div>
                <strong style="color: #6B7280; font-size: 12px; text-transform: uppercase;">Statut</strong>
                <div style="margin-top: 4px;">${getStatusBadge(demande.status)}</div>
            </div>
            <div>
                <strong style="color: #6B7280; font-size: 12px; text-transform: uppercase;">Demandeur</strong>
                <div style="font-size: 15px; font-weight: 500; margin-top: 4px;">${demande.requester}</div>
            </div>
            <div>
                <strong style="color: #6B7280; font-size: 12px; text-transform: uppercase;">Émetteur besoin</strong>
                <div style="font-size: 15px; font-weight: 500; margin-top: 4px;">${demande.needOriginator}</div>
            </div>
            <div>
                <strong style="color: #6B7280; font-size: 12px; text-transform: uppercase;">Département</strong>
                <div style="font-size: 15px; font-weight: 500; margin-top: 4px;">${demande.department}</div>
            </div>
            <div>
                <strong style="color: #6B7280; font-size: 12px; text-transform: uppercase;">Priorité</strong>
                <div style="margin-top: 4px;">${getPriorityBadge(demande.priority)}</div>
            </div>
            <div>
                <strong style="color: #6B7280; font-size: 12px; text-transform: uppercase;">Montant total</strong>
                <div style="font-size: 16px; font-weight: 600; margin-top: 4px; color: #263c89;">${formatCurrency(demande.estimatedAmount)}</div>
            </div>
            <div>
                <strong style="color: #6B7280; font-size: 12px; text-transform: uppercase;">Livraison souhaitée</strong>
                <div style="font-size: 15px; font-weight: 500; margin-top: 4px;">${formatDate(demande.deliveryDate)}</div>
            </div>
        </div>
        
        <div style="margin-bottom: 24px;">
            <strong style="color: #6B7280; font-size: 12px; text-transform: uppercase;">Justification du besoin</strong>
            <div style="font-size: 14px; margin-top: 8px; color: #374151; padding: 12px; background: #F9FAFB; border-radius: 6px;">${demande.reason}</div>
        </div>
        
        <div style="margin-bottom: 24px;">
            <strong style="color: #6B7280; font-size: 12px; text-transform: uppercase; margin-bottom: 12px; display: block;">Détail des lignes</strong>
            ${demande.items.map((item, idx) => `
                <div style="padding: 12px; border: 1px solid #E5E7EB; border-radius: 6px; margin-bottom: 8px;">
                    <div style="font-weight: 600; margin-bottom: 4px;">${idx + 1}. ${item.catalogCode || 'Article non catalogué'} - ${item.description}</div>
                    <div style="font-size: 13px; color: #6B7280;">
                        Quantité: ${item.quantity} ${item.unit} | PU: ${formatCurrency(item.unitPrice)} | Total: <strong>${formatCurrency(item.total)}</strong>
                    </div>
                </div>
            `).join('')}
        </div>
        
        ${demande.attachments && demande.attachments.length > 0 ? `
            <div style="margin-bottom: 24px;">
                <strong style="color: #6B7280; font-size: 12px; text-transform: uppercase; margin-bottom: 12px; display: block;">Documents attachés</strong>
                ${demande.attachments.map(att => `
                    <div style="padding: 10px; background: ${att.required ? '#FEF3C7' : '#F3F4F6'}; border-radius: 6px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="font-weight: 600; font-size: 13px;">${att.required ? '✅' : '📎'} ${att.type.replace(/_/g, ' ')}</div>
                            <div style="font-size: 12px; color: #6B7280;">${att.name} (${att.size})</div>
                        </div>
                        <div>
                            <button class="btn-icon" title="Voir">👁</button>
                            <button class="btn-icon" title="Télécharger">📥</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        ` : ''}
        
        ${demande.workflow && demande.workflow.length > 0 ? `
            <div>
                <strong style="color: #6B7280; font-size: 12px; text-transform: uppercase; margin-bottom: 12px; display: block;">Historique du workflow</strong>
                ${demande.workflow.map(step => `
                    <div style="padding: 8px 0; border-bottom: 1px solid #E5E7EB; font-size: 13px;">
                        ${step.date ? formatDate(step.date) + ' - ' : '⏳ '} ${step.step} ${step.user ? '- ' + step.user : ''}
                    </div>
                `).join('')}
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

function exportDAs() {
    alert('Export Excel - Fonctionnalité à implémenter');
}

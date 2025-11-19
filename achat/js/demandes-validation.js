// ================================================
// DEMANDES-VALIDATION.JS
// Gestion de la validation des demandes d'achat
// ================================================

let allDAs = [];
let filteredDAs = [];
let currentDA = null;
let selectedDAIds = new Set();

// ================================================
// INITIALISATION
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation validation DA...');
    
    loadDAs();
    renderTable();
});

// ================================================
// CHARGEMENT DONNÉES
// ================================================

function loadDAs() {
    // Mock data: Demandes d'Achat en attente
    allDAs = [
        {
            id: 'DA-001',
            code: 'DA-2024-001',
            date: '2024-01-15',
            requester: 'Jean DUPONT',
            department: 'PRODUCTION',
            amount: 500000,
            priority: 'URGENTE',
            status: 'EN_ATTENTE',
            deliveryDate: '2024-01-20',
            budgetAvailable: 2500000,
            items: [
                { name: 'Base peinture acrylique', quantity: 200, unit: 'L', unitPrice: 1500, total: 300000 },
                { name: 'Pigments colorants', quantity: 50, unit: 'kg', unitPrice: 4000, total: 200000 }
            ],
            reason: 'Besoin urgent pour production nouvelle commande client'
        },
        {
            id: 'DA-002',
            code: 'DA-2024-002',
            date: '2024-01-15',
            requester: 'Marie MARTIN',
            department: 'LOGISTIQUE',
            amount: 1200000,
            priority: 'HAUTE',
            status: 'EN_ATTENTE',
            deliveryDate: '2024-01-22',
            budgetAvailable: 1500000,
            items: [
                { name: 'Cartons de rangement', quantity: 500, unit: 'unité', unitPrice: 2000, total: 1000000 },
                { name: 'Étiquettes code-barres', quantity: 1000, unit: 'lot', unitPrice: 200, total: 200000 }
            ],
            reason: 'Réorganisation entrepôt logistique'
        },
        {
            id: 'DA-003',
            code: 'DA-2024-003',
            date: '2024-01-14',
            requester: 'Pierre DURAND',
            department: 'ADMINISTRATION',
            amount: 350000,
            priority: 'NORMALE',
            status: 'EN_ATTENTE',
            deliveryDate: '2024-01-25',
            budgetAvailable: 500000,
            items: [
                { name: 'Fournitures bureautiques', quantity: 50, unit: 'lot', unitPrice: 7000, total: 350000 }
            ],
            reason: 'Renouvellement stocks administrative'
        },
        {
            id: 'DA-004',
            code: 'DA-2024-004',
            date: '2024-01-13',
            requester: 'Sophie LENOIR',
            department: 'MAINTENANCE',
            amount: 750000,
            priority: 'HAUTE',
            status: 'EN_ATTENTE',
            deliveryDate: '2024-01-18',
            budgetAvailable: 1000000,
            items: [
                { name: 'Pièces détachées moteurs', quantity: 20, unit: 'lot', unitPrice: 30000, total: 600000 },
                { name: 'Huile hydraulique', quantity: 100, unit: 'L', unitPrice: 1500, total: 150000 }
            ],
            reason: 'Maintenance préventive équipements'
        },
        {
            id: 'DA-005',
            code: 'DA-2024-005',
            date: '2024-01-12',
            requester: 'Marc BERNARD',
            department: 'PRODUCTION',
            amount: 420000,
            priority: 'NORMALE',
            status: 'EN_ATTENTE',
            deliveryDate: '2024-01-28',
            budgetAvailable: 800000,
            items: [
                { name: 'Ciment Portland 42.5', quantity: 50, unit: 'sac', unitPrice: 8000, total: 400000 },
                { name: 'Additifs ciment', quantity: 10, unit: 'kg', unitPrice: 2000, total: 20000 }
            ],
            reason: 'Matières premières production ciment'
        }
    ];
    
    filteredDAs = [...allDAs];
    updatePendingCount();
}

// ================================================
// AFFICHAGE TABLEAU
// ================================================

function renderTable() {
    const tbody = document.getElementById('da-tbody');
    
    tbody.innerHTML = filteredDAs.map(da => `
        <tr class="${selectedDAIds.has(da.id) ? 'selected' : ''}">
            <td class="checkbox-cell">
                <input 
                    type="checkbox" 
                    data-da-id="${da.id}"
                    onchange="toggleDA('${da.id}')"
                    ${selectedDAIds.has(da.id) ? 'checked' : ''}
                >
            </td>
            <td>
                <a href="javascript:void(0)" class="da-code" onclick="openValidationModal('${da.id}')">
                    ${da.code}
                </a>
            </td>
            <td>${formatDate(da.date)}</td>
            <td>${da.requester}</td>
            <td>${da.department}</td>
            <td style="text-align: right; font-weight: 600; color: #263c89;">
                ${formatCurrency(da.amount)}
            </td>
            <td>
                <span class="priority-badge priority-${da.priority.toLowerCase()}">
                    ${getPriorityIcon(da.priority)} ${da.priority}
                </span>
            </td>
            <td>
                <span class="status-badge status-${da.status.toLowerCase().replace('_', '-')}">
                    🟡 En attente
                </span>
            </td>
            <td style="text-align: center;">
                <button 
                    class="btn btn-primary" 
                    onclick="openValidationModal('${da.id}')"
                    style="padding: 8px 12px; font-size: 12px;"
                    title="Valider"
                >
                    <i class="fa-solid fa-check"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// ================================================
// SÉLECTION CHECKBOX
// ================================================

function toggleDA(daId) {
    if (selectedDAIds.has(daId)) {
        selectedDAIds.delete(daId);
    } else {
        selectedDAIds.add(daId);
    }
    renderTable();
}

function toggleSelectAll() {
    const checkbox = document.getElementById('select-all');
    if (checkbox.checked) {
        filteredDAs.forEach(da => selectedDAIds.add(da.id));
    } else {
        selectedDAIds.clear();
    }
    renderTable();
}

// ================================================
// FILTRES
// ================================================

function applyFilters() {
    const search = document.getElementById('search-input').value.toLowerCase();
    const department = document.getElementById('filter-department').value;
    const priority = document.getElementById('filter-priority').value;
    const period = document.getElementById('filter-period').value;
    const amount = document.getElementById('filter-amount').value;
    
    filteredDAs = allDAs.filter(da => {
        // Search
        if (search && !da.code.toLowerCase().includes(search) && !da.requester.toLowerCase().includes(search)) {
            return false;
        }
        
        // Department
        if (department && da.department !== department) {
            return false;
        }
        
        // Priority
        if (priority && da.priority !== priority) {
            return false;
        }
        
        // Period
        if (period) {
            const daDate = new Date(da.date);
            const today = new Date();
            const diffDays = (today - daDate) / (1000 * 60 * 60 * 24);
            
            if (period === 'today' && diffDays > 1) return false;
            if (period === 'week' && diffDays > 7) return false;
            if (period === 'month' && diffDays > 30) return false;
        }
        
        // Amount ranges
        if (amount) {
            if (amount === '0-500k' && da.amount > 500000) return false;
            if (amount === '500k-1m' && (da.amount <= 500000 || da.amount > 1000000)) return false;
            if (amount === '1m+' && da.amount <= 1000000) return false;
        }
        
        return true;
    });
    
    renderTable();
}

// ================================================
// MODAL VALIDATION
// ================================================

function openValidationModal(daId) {
    currentDA = allDAs.find(da => da.id === daId);
    if (!currentDA) return;
    
    // Populate modal
    document.getElementById('modal-requester').textContent = currentDA.requester;
    document.getElementById('modal-department').textContent = currentDA.department;
    document.getElementById('modal-amount').textContent = formatCurrency(currentDA.amount);
    
    const budgetStatus = currentDA.budgetAvailable >= currentDA.amount ? 'budget-ok' : 'budget-danger';
    document.getElementById('modal-budget').innerHTML = `
        <span class="${budgetStatus}">
            ✓ ${formatCurrency(currentDA.budgetAvailable)}
        </span>
    `;
    
    document.getElementById('modal-priority').innerHTML = `
        <span class="priority-badge priority-${currentDA.priority.toLowerCase()}">
            ${getPriorityIcon(currentDA.priority)} ${currentDA.priority}
        </span>
    `;
    
    document.getElementById('modal-delivery').textContent = formatDate(currentDA.deliveryDate);
    
    // Render items
    const itemsHtml = currentDA.items.map(item => `
        <div class="item-line">
            <div class="item-name">
                <strong>${item.name}</strong> - ${item.quantity}${item.unit}
            </div>
            <div class="item-amount">
                ${formatCurrency(item.total)}
            </div>
        </div>
    `).join('');
    
    document.getElementById('modal-items').innerHTML = itemsHtml;
    
    // Clear form
    document.getElementById('validation-comment').value = '';
    document.getElementById('suggested-supplier').value = '';
    
    document.getElementById('validation-modal').style.display = 'flex';
}

function closeValidationModal() {
    document.getElementById('validation-modal').style.display = 'none';
    currentDA = null;
}

// ================================================
// ACTIONS VALIDATION
// ================================================

function validateDA() {
    if (!currentDA) return;
    
    const comment = document.getElementById('validation-comment').value;
    const supplier = document.getElementById('suggested-supplier').value;
    
    console.log('✅ Validation DA:', {
        code: currentDA.code,
        comment: comment,
        supplier: supplier,
        timestamp: new Date().toISOString()
    });
    
    alert(`✅ Demande d'achat ${currentDA.code} validée avec succès !`);
    
    // Update status
    currentDA.status = 'VALIDEE';
    
    closeValidationModal();
    applyFilters();
}

function requestInfo() {
    if (!currentDA) return;
    
    console.log('❓ Demande d\'informations pour:', currentDA.code);
    alert('Email de demande d\'informations envoyé au demandeur pour: ' + currentDA.code);
    closeValidationModal();
}

function openRejectModal() {
    if (!currentDA) return;
    
    document.getElementById('reject-da-code').textContent = currentDA.code;
    document.getElementById('reject-reason').value = '';
    
    document.getElementById('validation-modal').style.display = 'none';
    document.getElementById('reject-modal').style.display = 'flex';
}

function closeRejectModal() {
    document.getElementById('reject-modal').style.display = 'none';
    document.getElementById('validation-modal').style.display = 'flex';
}

function confirmReject() {
    if (!currentDA) return;
    
    const reason = document.getElementById('reject-reason').value.trim();
    
    if (!reason) {
        alert('Veuillez saisir le motif du rejet');
        return;
    }
    
    console.log('❌ Rejet DA:', {
        code: currentDA.code,
        reason: reason,
        timestamp: new Date().toISOString()
    });
    
    alert(`❌ Demande d'achat ${currentDA.code} rejetée.\nLe demandeur a été notifié.`);
    
    // Update status
    currentDA.status = 'REJETEE';
    
    closeRejectModal();
    closeValidationModal();
    applyFilters();
}

// ================================================
// HELPERS
// ================================================

function updatePendingCount() {
    const pending = allDAs.filter(da => da.status === 'EN_ATTENTE').length;
    document.getElementById('pending-count').textContent = pending;
}

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

function getPriorityIcon(priority) {
    const icons = {
        'BASSE': '🟢',
        'NORMALE': '🟡',
        'HAUTE': '🟠',
        'URGENTE': '🔴'
    };
    return icons[priority] || '';
}

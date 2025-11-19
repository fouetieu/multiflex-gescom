/**
 * Gestion des Litiges Fournisseurs - Liste
 * MultiFlex GESCOM
 */

// Mock data - litiges
let disputesData = [
    {
        disputeNumber: 'LIT-2024-0089',
        disputeDate: '2024-01-25',
        supplierId: 'SUPPLIER-001',
        supplierName: 'ChemTech SARL',
        disputeType: 'QUALITE',
        category: 'RECEPTION',
        status: 'OUVERT',
        priority: 'HAUTE',
        discrepancyAmount: 19200,
        purchaseOrderId: 'BCF-2024-00456',
        receptionId: 'BR-2024-00234',
        raisedBy: 'Alphonse NJOYA',
        assignedTo: 'Marie DJOMO',
        daysOpen: 8,
        description: 'Réception non conforme - manquants et emballage endommagé'
    },
    {
        disputeNumber: 'LIT-2024-0088',
        disputeDate: '2024-01-22',
        supplierId: 'SUPPLIER-002',
        supplierName: 'GlobalTrade SA',
        disputeType: 'QUANTITE',
        category: 'RECEPTION',
        status: 'EN_COURS',
        priority: 'NORMALE',
        discrepancyAmount: 45000,
        purchaseOrderId: 'BCF-2024-00445',
        receptionId: 'BR-2024-00229',
        raisedBy: 'Alphonse NJOYA',
        assignedTo: 'Marie DJOMO',
        daysOpen: 11,
        description: 'Quantités livrées inférieures à la commande'
    },
    {
        disputeNumber: 'LIT-2024-0087',
        disputeDate: '2024-01-20',
        supplierId: 'SUPPLIER-003',
        supplierName: 'MetalPro Industries',
        disputeType: 'PRIX',
        category: 'FACTURATION',
        status: 'EN_COURS',
        priority: 'HAUTE',
        discrepancyAmount: 125000,
        purchaseOrderId: 'BCF-2024-00432',
        invoiceId: 'INV-SUP-2024-456',
        raisedBy: 'Marie DJOMO',
        assignedTo: 'Marie DJOMO',
        daysOpen: 13,
        description: 'Écart de prix entre BCF et facture'
    },
    {
        disputeNumber: 'LIT-2024-0086',
        disputeDate: '2024-01-18',
        supplierId: 'SUPPLIER-004',
        supplierName: 'Transport Express',
        disputeType: 'LIVRAISON',
        category: 'RECEPTION',
        status: 'RESOLU',
        priority: 'NORMALE',
        discrepancyAmount: 12000,
        purchaseOrderId: 'BCF-2024-00432',
        receptionId: 'BR-2024-00220',
        raisedBy: 'Alphonse NJOYA',
        assignedTo: 'Marie DJOMO',
        daysOpen: 5,
        resolvedDate: '2024-01-23',
        resolution: 'Avoir accordé',
        description: 'Retard de livraison important'
    },
    {
        disputeNumber: 'LIT-2024-0085',
        disputeDate: '2024-01-15',
        supplierId: 'SUPPLIER-005',
        supplierName: 'Plastiques Cameroun',
        disputeType: 'DOMMAGE',
        category: 'RECEPTION',
        status: 'RESOLU',
        priority: 'HAUTE',
        discrepancyAmount: 78000,
        purchaseOrderId: 'BCF-2024-00410',
        receptionId: 'BR-2024-00215',
        raisedBy: 'Alphonse NJOYA',
        assignedTo: 'Marie DJOMO',
        daysOpen: 7,
        resolvedDate: '2024-01-22',
        resolution: 'Remplacement effectué',
        description: 'Articles endommagés lors du transport'
    },
    {
        disputeNumber: 'LIT-2024-0084',
        disputeDate: '2024-01-12',
        supplierId: 'SUPPLIER-001',
        supplierName: 'ChemTech SARL',
        disputeType: 'QUALITE',
        category: 'RECEPTION',
        status: 'EN_COURS',
        priority: 'CRITIQUE',
        discrepancyAmount: 156000,
        purchaseOrderId: 'BCF-2024-00398',
        receptionId: 'BR-2024-00210',
        raisedBy: 'Alphonse NJOYA',
        assignedTo: 'Marie DJOMO',
        daysOpen: 21,
        escalated: true,
        escalationLevel: 'N+1',
        description: 'Produit non conforme aux spécifications'
    },
    {
        disputeNumber: 'LIT-2024-0083',
        disputeDate: '2024-01-10',
        supplierId: 'SUPPLIER-006',
        supplierName: 'Fournitures Bureau Plus',
        disputeType: 'QUANTITE',
        category: 'RECEPTION',
        status: 'OUVERT',
        priority: 'BASSE',
        discrepancyAmount: 8500,
        purchaseOrderId: 'BCF-2024-00385',
        receptionId: 'BR-2024-00205',
        raisedBy: 'Alphonse NJOYA',
        assignedTo: 'Marie DJOMO',
        daysOpen: 23,
        description: 'Manque quelques articles de faible valeur'
    },
    {
        disputeNumber: 'LIT-2024-0082',
        disputeDate: '2024-01-08',
        supplierId: 'SUPPLIER-002',
        supplierName: 'GlobalTrade SA',
        disputeType: 'PRIX',
        category: 'FACTURATION',
        status: 'RESOLU',
        priority: 'NORMALE',
        discrepancyAmount: 34000,
        purchaseOrderId: 'BCF-2024-00372',
        invoiceId: 'INV-SUP-2024-423',
        raisedBy: 'Marie DJOMO',
        assignedTo: 'Marie DJOMO',
        daysOpen: 6,
        resolvedDate: '2024-01-14',
        resolution: 'Erreur de facturation corrigée',
        description: 'Surfacturation sur certains articles'
    }
];

// État actuel de l'application
let currentPage = 1;
const itemsPerPage = 10;
let filteredDisputes = [...disputesData];
let currentStatusFilter = 'all';

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initialisation de la gestion des litiges...');
    updateSummary();
    renderDisputesTable();
});

// Mise à jour du résumé
function updateSummary() {
    const openDisputes = disputesData.filter(d => d.status === 'OUVERT').length;
    const inProgressDisputes = disputesData.filter(d => d.status === 'EN_COURS').length;
    const resolvedDisputes = disputesData.filter(d => d.status === 'RESOLU').length;
    const totalImpact = disputesData.reduce((sum, d) => sum + d.discrepancyAmount, 0);
    
    document.getElementById('summary-open').textContent = openDisputes;
    document.getElementById('summary-in-progress').textContent = inProgressDisputes;
    document.getElementById('summary-resolved').textContent = resolvedDisputes;
    document.getElementById('summary-amount').textContent = formatCurrency(totalImpact);
}

// Rendu du tableau
function renderDisputesTable() {
    const tbody = document.getElementById('disputes-table-body');
    const emptyState = document.getElementById('empty-state');
    
    if (filteredDisputes.length === 0) {
        tbody.innerHTML = '';
        emptyState.style.display = 'block';
        updatePagination(0);
        return;
    }
    
    emptyState.style.display = 'none';
    
    // Pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredDisputes.length);
    const pageDisputes = filteredDisputes.slice(startIndex, endIndex);
    
    tbody.innerHTML = pageDisputes.map(dispute => `
        <tr>
            <td>
                <div style="font-weight: 600; color: #1F2937;">${dispute.disputeNumber}</div>
            </td>
            <td>
                <div>${formatDate(dispute.disputeDate)}</div>
            </td>
            <td>
                <div style="font-weight: 500; color: #1F2937;">${dispute.supplierName}</div>
                <div style="font-size: 12px; color: #6B7280; margin-top: 2px;">
                    ${dispute.purchaseOrderId}${dispute.receptionId ? '/' + dispute.receptionId : ''}
                </div>
            </td>
            <td style="text-align: center;">
                ${getDisputeTypeBadge(dispute.disputeType)}
            </td>
            <td style="text-align: right;">
                <div style="font-weight: 600; color: #1F2937;">${formatCurrency(dispute.discrepancyAmount)}</div>
            </td>
            <td style="text-align: center;">
                ${getDisputeStatusBadge(dispute.status, dispute.daysOpen, dispute.escalated)}
            </td>
            <td style="text-align: center;">
                <div class="action-buttons">
                    <button class="btn-icon" onclick="viewDispute('${dispute.disputeNumber}')" title="Voir détails">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    updatePagination(filteredDisputes.length);
}

// Obtenir le badge de type de litige
function getDisputeTypeBadge(type) {
    const types = {
        'QUANTITE': { label: 'Quantité', class: 'type-quantite' },
        'QUALITE': { label: 'Qualité', class: 'type-qualite' },
        'PRIX': { label: 'Prix', class: 'type-prix' },
        'LIVRAISON': { label: 'Livraison', class: 'type-livraison' },
        'DOMMAGE': { label: 'Dommage', class: 'type-dommage' }
    };
    
    const typeInfo = types[type] || { label: type, class: '' };
    return `<span class="dispute-type-badge ${typeInfo.class}">${typeInfo.label}</span>`;
}

// Obtenir le badge de statut
function getDisputeStatusBadge(status, daysOpen, escalated) {
    const statuses = {
        'OUVERT': { 
            emoji: '🔴', 
            label: 'OUVERT', 
            color: '#EF4444',
            bgColor: '#FEE2E2'
        },
        'EN_COURS': { 
            emoji: '🟡', 
            label: 'EN COURS', 
            color: '#F59E0B',
            bgColor: '#FEF3C7'
        },
        'RESOLU': { 
            emoji: '✅', 
            label: 'RÉSOLU', 
            color: '#10B981',
            bgColor: '#D1FAE5'
        },
        'REJETE': { 
            emoji: '❌', 
            label: 'REJETÉ', 
            color: '#6B7280',
            bgColor: '#F3F4F6'
        }
    };
    
    const statusInfo = statuses[status] || statuses['OUVERT'];
    const escalationBadge = escalated ? '<br><span style="font-size: 10px; color: #DC2626;">⚠️ ESCALADÉ</span>' : '';
    
    return `
        <div style="display: inline-block;">
            <span style="padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; 
                        background: ${statusInfo.bgColor}; color: ${statusInfo.color};">
                ${statusInfo.emoji} ${statusInfo.label}
            </span>
            <div style="font-size: 11px; color: #6B7280; margin-top: 4px;">
                ${daysOpen} jour${daysOpen > 1 ? 's' : ''}
            </div>
            ${escalationBadge}
        </div>
    `;
}

// Filtrer par statut
function filterByStatus(status) {
    currentStatusFilter = status;
    currentPage = 1;
    
    // Mettre à jour les boutons actifs
    document.querySelectorAll('.filter-chip').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.filter-chip').classList.add('active');
    
    applyFilters();
}

// Toggle filtres avancés
function toggleAdvancedFilters() {
    const advancedFilters = document.getElementById('advanced-filters');
    advancedFilters.style.display = advancedFilters.style.display === 'none' ? 'block' : 'none';
}

// Appliquer les filtres
function applyFilters() {
    const disputeNumber = document.getElementById('filter-dispute-number')?.value.toLowerCase() || '';
    const supplier = document.getElementById('filter-supplier')?.value.toLowerCase() || '';
    const type = document.getElementById('filter-type')?.value || '';
    const priority = document.getElementById('filter-priority')?.value || '';
    const dateFrom = document.getElementById('filter-date-from')?.value || '';
    const dateTo = document.getElementById('filter-date-to')?.value || '';
    
    filteredDisputes = disputesData.filter(dispute => {
        // Filtre par statut
        if (currentStatusFilter !== 'all' && dispute.status !== currentStatusFilter) {
            return false;
        }
        
        // Filtre par numéro
        if (disputeNumber && !dispute.disputeNumber.toLowerCase().includes(disputeNumber)) {
            return false;
        }
        
        // Filtre par fournisseur
        if (supplier && !dispute.supplierName.toLowerCase().includes(supplier)) {
            return false;
        }
        
        // Filtre par type
        if (type && dispute.disputeType !== type) {
            return false;
        }
        
        // Filtre par priorité
        if (priority && dispute.priority !== priority) {
            return false;
        }
        
        // Filtre par date
        if (dateFrom && dispute.disputeDate < dateFrom) {
            return false;
        }
        if (dateTo && dispute.disputeDate > dateTo) {
            return false;
        }
        
        return true;
    });
    
    currentPage = 1;
    renderDisputesTable();
}

// Réinitialiser les filtres
function resetFilters() {
    document.getElementById('filter-dispute-number').value = '';
    document.getElementById('filter-supplier').value = '';
    document.getElementById('filter-type').value = '';
    document.getElementById('filter-priority').value = '';
    document.getElementById('filter-date-from').value = '';
    document.getElementById('filter-date-to').value = '';
    
    currentStatusFilter = 'all';
    
    // Réactiver le bouton "Tous"
    document.querySelectorAll('.filter-chip').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('.filter-chip[data-status="all"]').classList.add('active');
    
    applyFilters();
}

// Voir détails d'un litige
function viewDispute(disputeNumber) {
    window.location.href = `./litige-detail.html?id=${disputeNumber}`;
}

// Créer un nouveau litige
function createDispute() {
    window.location.href = './litige-detail.html?new=true';
}

// Mise à jour de la pagination
function updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    
    document.getElementById('pagination-from').textContent = startItem;
    document.getElementById('pagination-to').textContent = endItem;
    document.getElementById('pagination-total').textContent = totalItems;
    
    const paginationControls = document.getElementById('pagination-controls');
    
    if (totalPages <= 1) {
        paginationControls.innerHTML = '';
        return;
    }
    
    let html = `
        <button class="btn-pagination" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fa-solid fa-chevron-left"></i>
        </button>
    `;
    
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `
                <button class="btn-pagination ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += '<span style="padding: 8px;">...</span>';
        }
    }
    
    html += `
        <button class="btn-pagination" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            <i class="fa-solid fa-chevron-right"></i>
        </button>
    `;
    
    paginationControls.innerHTML = html;
}

// Changer de page
function changePage(page) {
    const totalPages = Math.ceil(filteredDisputes.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    renderDisputesTable();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Formatage de la date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit',
        year: 'numeric'
    });
}

// Formatage de la monnaie
function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' XAF';
}

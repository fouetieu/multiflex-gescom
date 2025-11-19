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
    setupDecisionRadios();
});

// ================================================
// CHARGEMENT DONNÉES
// ================================================

function loadDAs() {
    // Mock data: Demandes d'Achat en attente
    allDAs = [
        {
            id: 'DA-2024-0234',
            code: 'DA-2024-0234',
            date: '2024-01-15',
            requester: 'H. MBOUOMBOUO',
            needOriginator: 'J. KAMGA',
            department: 'PROD',
            amount: 265000,
            priority: 'URGENTE',
            status: 'EN_VALIDATION',
            deliveryDate: '2024-01-25',
            items: [
                { code: 'CHEM-001', name: 'Produit chimique A', quantity: 100, unit: 'L', unitPrice: 2500, total: 250000, suggestedSupplier: 'SUPPLIER-001' },
                { code: null, name: 'Matériel électrique spécial', quantity: 15, unit: 'U', unitPrice: 1000, total: 15000, suggestedSupplier: null }
            ],
            reason: 'Renouvellement urgent du stock de matières premières suite à la rupture de notre fournisseur principal. Production Q1 2024 en risque si pas d\'approvisionnement avant fin janvier.',
            attachments: [
                { type: 'DEVIS_FOURNISSEUR', name: 'devis_supplier_001.pdf', size: '2.3 MB', required: true },
                { type: 'JUSTIFICATIF_URGENCE', name: 'memo_urgence_production.pdf', size: '450 KB', required: true },
                { type: 'SPECIFICATIONS_TECHNIQUES', name: 'spec_technique_materiel.pdf', size: '1.2 MB', required: false }
            ],
            workflow: [
                { date: '2024-01-15T10:30:00', action: 'Créée par Herman MBOUOMBOUO', status: 'DONE' },
                { date: '2024-01-15T10:45:00', action: 'Soumise pour validation', status: 'DONE' },
                { date: '2024-01-15T11:00:00', action: 'Assignée à Paul NGA (Chef Service)', status: 'DONE' },
                { date: null, action: '⏳ En attente de validation...', status: 'CURRENT' }
            ]
        },
        {
            id: 'DA-2024-0235',
            code: 'DA-2024-0235',
            date: '2024-01-16',
            requester: 'P. NJOYA',
            needOriginator: 'P. NJOYA',
            department: 'MAIN',
            amount: 150000,
            priority: 'NORMALE',
            status: 'EN_VALIDATION',
            deliveryDate: '2024-02-05',
            items: [
                { code: 'MAINT-045', name: 'Pièces détachées pompe', quantity: 1, unit: 'lot', unitPrice: 150000, total: 150000, suggestedSupplier: 'TECH-EQUIPEMENTS' }
            ],
            reason: 'Maintenance préventive trimestrielle équipement production',
            attachments: [
                { type: 'DEVIS_FOURNISSEUR', name: 'devis_tech_equipements.pdf', size: '1.1 MB', required: true }
            ],
            workflow: [
                { date: '2024-01-16T09:15:00', action: 'Créée par P. NJOYA', status: 'DONE' },
                { date: '2024-01-16T09:20:00', action: 'Soumise pour validation', status: 'DONE' },
                { date: null, action: '⏳ En attente de validation...', status: 'CURRENT' }
            ]
        }
    ];
    
    filteredDAs = [...allDAs];
    updateSummary();
    updatePendingCount();
}

// ================================================
// AFFICHAGE TABLEAU
// ================================================

function renderTable() {
    const tbody = document.getElementById('da-tbody');
    
    if (filteredDAs.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 40px; color: #6B7280;">
                    Aucune demande d'achat à valider
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = filteredDAs.map(da => `
        <tr ${selectedDAIds.has(da.id) ? 'style="background: #EFF6FF;"' : ''}>
            <td style="padding: 12px;">
                <input 
                    type="checkbox" 
                    data-da-id="${da.id}"
                    onchange="toggleDA('${da.id}')"
                    ${selectedDAIds.has(da.id) ? 'checked' : ''}
                >
            </td>
            <td style="padding: 12px;">
                <div style="font-weight: 600; font-size: 13px; color: #263c89;">${da.code}</div>
            </td>
            <td style="padding: 12px;">
                <div style="font-size: 12px;">${formatDateShort(da.date)}</div>
            </td>
            <td style="padding: 12px;">
                <div style="font-weight: 500; font-size: 13px;">${da.requester}</div>
                <div style="font-size: 11px; color: #6B7280;">└→ ${da.needOriginator}</div>
            </td>
            <td style="padding: 12px;">
                <div style="font-size: 12px;">${da.department}</div>
            </td>
            <td style="padding: 12px; text-align: center;">
                ${getPriorityBadge(da.priority)}
            </td>
            <td style="padding: 12px; text-align: right;">
                <div style="font-weight: 600; font-size: 13px; color: #263c89;">${formatCurrency(da.amount)}</div>
                <div style="font-size: 11px; color: #6B7280;">XAF</div>
            </td>
            <td style="padding: 12px; text-align: center;">
                ${getStatusBadge(da.status)}
            </td>
            <td style="padding: 12px; text-align: center;">
                <button 
                    class="btn btn-primary btn-sm" 
                    onclick="openValidationModal('${da.id}')"
                    style="padding: 6px 12px; font-size: 12px;"
                    title="Valider"
                >
                    [→]
                </button>
            </td>
        </tr>
    `).join('');
    
    updateBulkActions();
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

function updateBulkActions() {
    const bulkActionsDiv = document.getElementById('bulk-actions');
    const count = selectedDAIds.size;
    
    if (count > 0) {
        bulkActionsDiv.style.display = 'block';
        document.getElementById('selected-count').textContent = count;
        
        const total = Array.from(selectedDAIds)
            .map(id => allDAs.find(d => d.id === id))
            .filter(d => d)
            .reduce((sum, d) => sum + d.amount, 0);
        
        document.getElementById('selected-total').textContent = formatCurrency(total);
    } else {
        bulkActionsDiv.style.display = 'none';
    }
}

// ================================================
// FILTRES
// ================================================

function applyFilters() {
    const search = document.getElementById('filter-numero')?.value.toLowerCase() || '';
    const emetteur = document.getElementById('filter-emetteur')?.value.toLowerCase() || '';
    const department = document.getElementById('filter-department')?.value || '';
    const priority = document.getElementById('filter-priority')?.value || '';
    const status = document.getElementById('filter-status')?.value || '';
    const period = document.getElementById('filter-period')?.value || '';
    
    filteredDAs = allDAs.filter(da => {
        // Search
        if (search && !da.code.toLowerCase().includes(search)) {
            return false;
        }
        
        // Emetteur
        if (emetteur && !da.needOriginator.toLowerCase().includes(emetteur)) {
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
        
        // Status
        if (status && da.status !== status) {
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
        
        return true;
    });
    
    renderTable();
}

function resetFilters() {
    document.getElementById('filter-numero').value = '';
    document.getElementById('filter-emetteur').value = '';
    document.getElementById('filter-department').value = '';
    document.getElementById('filter-priority').value = '';
    document.getElementById('filter-status').value = 'EN_VALIDATION';
    document.getElementById('filter-period').value = 'month';
    applyFilters();
}

// ================================================
// MODAL VALIDATION
// ================================================

function openValidationModal(daId) {
    currentDA = allDAs.find(da => da.id === daId);
    if (!currentDA) return;
    
    // Populate modal
    document.getElementById('modal-title').textContent = `VALIDATION DEMANDE D'ACHAT - ${currentDA.code}`;
    document.getElementById('modal-code').textContent = currentDA.code;
    document.getElementById('modal-status').innerHTML = getStatusBadge(currentDA.status);
    document.getElementById('modal-date').textContent = formatDate(currentDA.date);
    document.getElementById('modal-priority').innerHTML = getPriorityBadge(currentDA.priority);
    document.getElementById('modal-requester').textContent = currentDA.requester + ' (Achats)';
    document.getElementById('modal-originator').textContent = currentDA.needOriginator + ' (' + currentDA.department + ')';
    document.getElementById('modal-amount').textContent = formatCurrency(currentDA.amount);
    document.getElementById('modal-delivery').textContent = formatDate(currentDA.deliveryDate);
    document.getElementById('modal-reason').textContent = currentDA.reason;
    
    // Render items
    const itemsHtml = currentDA.items.map((item, idx) => `
        <div class="item-line">
            <div style="font-weight: 600; margin-bottom: 4px;">
                ${idx + 1}. ${item.code || 'Article non catalogué'} - ${item.name}
            </div>
            <div style="font-size: 13px; color: #6B7280; display: flex; justify-content: space-between;">
                <span>Quantité: ${item.quantity} ${item.unit} | PU: ${formatCurrency(item.unitPrice)}</span>
                <strong style="color: #263c89;">Total: ${formatCurrency(item.total)}</strong>
            </div>
            ${item.suggestedSupplier ? `
                <div style="font-size: 12px; color: #10B981; margin-top: 4px;">
                    Fournisseur suggéré: ${item.suggestedSupplier}
                </div>
            ` : `
                <div style="font-size: 12px; color: #EF4444; margin-top: 4px;">
                    Fournisseur suggéré: (Non défini)
                </div>
            `}
        </div>
    `).join('');
    
    document.getElementById('modal-items').innerHTML = itemsHtml;
    
    // Render attachments
    const attachmentsHtml = currentDA.attachments.map(att => `
        <div class="attachment-item ${att.required ? '' : 'optional'}">
            <div>
                <div style="font-weight: 600; font-size: 13px;">
                    ${att.required ? '✅' : '📎'} ${att.type.replace(/_/g, ' ')} ${att.required ? '(Obligatoire)' : '(Optionnel - 1/3 fichiers)'}
                </div>
                <div style="font-size: 12px; color: #6B7280; margin-top: 2px;">
                    • ${att.name} (${att.size})
                </div>
            </div>
            <div style="display: flex; gap: 8px;">
                <button class="btn btn-secondary btn-sm" onclick="viewDocument('${att.name}')" title="Voir">[👁]</button>
                <button class="btn btn-secondary btn-sm" onclick="downloadDocument('${att.name}')" title="Télécharger">[📥]</button>
            </div>
        </div>
    `).join('');
    
    document.getElementById('modal-attachments').innerHTML = attachmentsHtml;
    
    // Render workflow
    const workflowHtml = currentDA.workflow.map(step => `
        <div class="workflow-step ${step.status.toLowerCase()}">
            <div style="font-size: 13px; color: #1F2937;">
                ${step.date ? formatDateTime(step.date) : ''} ${step.action}
            </div>
        </div>
    `).join('');
    
    document.getElementById('modal-workflow').innerHTML = workflowHtml;
    
    // Show escalation warning if amount > 200k
    if (currentDA.amount > 200000) {
        document.getElementById('escalation-warning').style.display = 'flex';
    } else {
        document.getElementById('escalation-warning').style.display = 'none';
    }
    
    // Clear form
    document.getElementById('validation-comment').value = '';
    document.querySelectorAll('input[name="decision"]').forEach(r => r.checked = false);
    
    document.getElementById('validation-modal').style.display = 'flex';
}

function closeValidationModal() {
    document.getElementById('validation-modal').style.display = 'none';
    currentDA = null;
}

// ================================================
// GESTION DÉCISION
// ================================================

function setupDecisionRadios() {
    document.querySelectorAll('input[name="decision"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const commentRequired = document.getElementById('comment-required');
            if (this.value === 'reject') {
                commentRequired.style.display = 'inline';
            } else {
                commentRequired.style.display = 'none';
            }
        });
    });
}

function confirmDecision() {
    if (!currentDA) return;
    
    const decision = document.querySelector('input[name="decision"]:checked')?.value;
    const comment = document.getElementById('validation-comment').value.trim();
    
    if (!decision) {
        alert('Veuillez sélectionner une décision');
        return;
    }
    
    if (decision === 'reject' && !comment) {
        alert('Le commentaire est obligatoire pour un rejet');
        return;
    }
    
    console.log('Décision:', {
        daCode: currentDA.code,
        decision: decision,
        comment: comment,
        timestamp: new Date().toISOString()
    });
    
    if (decision === 'validate') {
        if (currentDA.amount > 200000) {
            alert(`✅ DA ${currentDA.code} validée.\n\n⚠️ Montant > 200,000 XAF : La demande sera transmise à la Direction pour validation finale.`);
        } else {
            alert(`✅ Demande d'achat ${currentDA.code} validée avec succès !`);
        }
        currentDA.status = 'VALIDEE';
    } else if (decision === 'reject') {
        alert(`❌ Demande d'achat ${currentDA.code} rejetée.\n\nLe demandeur a été notifié par email avec le motif du rejet.`);
        currentDA.status = 'REFUSEE';
    } else if (decision === 'request') {
        alert(`ℹ️ Demande d'informations complémentaires envoyée pour DA ${currentDA.code}`);
    }
    
    closeValidationModal();
    applyFilters();
    updateSummary();
}

function saveDraft() {
    if (!currentDA) return;
    alert('Brouillon sauvegardé - Vous pouvez reprendre la validation plus tard');
}

// ================================================
// ACTIONS DOCUMENTS
// ================================================

function viewDocument(filename) {
    alert(`Ouverture du document: ${filename}`);
}

function downloadDocument(filename) {
    alert(`Téléchargement du document: ${filename}`);
}

function downloadAllDocs() {
    if (!currentDA) return;
    alert(`Téléchargement de ${currentDA.attachments.length} documents`);
}

// ================================================
// ACTIONS GROUPÉES
// ================================================

function bulkValidate() {
    const count = selectedDAIds.size;
    if (confirm(`Valider ${count} demandes d'achat sélectionnées ?`)) {
        console.log('Validation groupée:', Array.from(selectedDAIds));
        alert(`✅ ${count} DA validées avec succès !`);
        selectedDAIds.clear();
        renderTable();
    }
}

function bulkReject() {
    const count = selectedDAIds.size;
    const reason = prompt(`Motif du rejet pour les ${count} DA sélectionnées:`);
    if (reason) {
        console.log('Rejet groupé:', Array.from(selectedDAIds), 'Motif:', reason);
        alert(`❌ ${count} DA rejetées.`);
        selectedDAIds.clear();
        renderTable();
    }
}

function bulkTransfer() {
    const count = selectedDAIds.size;
    alert(`Transfert de ${count} DA - Fonctionnalité à implémenter`);
}

function bulkCreateBCF() {
    const count = selectedDAIds.size;
    if (confirm(`Créer des BCF pour ${count} DA validées ?`)) {
        alert(`📋 ${count} BCF créés avec succès !`);
        selectedDAIds.clear();
        renderTable();
    }
}

// ================================================
// HELPERS
// ================================================

function updateSummary() {
    const pending = allDAs.filter(d => d.status === 'EN_VALIDATION').length;
    const validated = allDAs.filter(d => d.status === 'VALIDEE').length;
    const rejected = allDAs.filter(d => d.status === 'REFUSEE').length;
    const totalAmount = allDAs.filter(d => d.status === 'EN_VALIDATION').reduce((sum, d) => sum + d.amount, 0);
    
    document.getElementById('resume-pending').textContent = pending;
    document.getElementById('resume-validated').textContent = validated;
    document.getElementById('resume-rejected').textContent = rejected;
    document.getElementById('resume-amount').textContent = formatCurrency(totalAmount);
}

function updatePendingCount() {
    const pending = allDAs.filter(da => da.status === 'EN_VALIDATION').length;
    document.getElementById('sidebar-pending').textContent = pending;
    document.getElementById('notif-count').textContent = pending;
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatDateShort(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

function formatDateTime(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) + ' ' + 
           date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function formatCurrency(amount) {
    if (!amount) return '0';
    return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function getPriorityBadge(priority) {
    const badges = {
        'BASSE': '<span style="font-size: 11px; padding: 4px 8px; border-radius: 4px; background: #DBEAFE; color: #1E40AF; font-weight: 600;">🟢 BAS</span>',
        'NORMALE': '<span style="font-size: 11px; padding: 4px 8px; border-radius: 4px; background: #E0E7FF; color: #3730A3; font-weight: 600;">🟡 NORM</span>',
        'HAUTE': '<span style="font-size: 11px; padding: 4px 8px; border-radius: 4px; background: #FED7AA; color: #9A3412; font-weight: 600;">🟠 HAUTE</span>',
        'URGENTE': '<span style="font-size: 11px; padding: 4px 8px; border-radius: 4px; background: #FEE2E2; color: #991B1B; font-weight: 600;">🔴 URG</span>'
    };
    return badges[priority] || priority;
}

function getStatusBadge(status) {
    const badges = {
        'EN_VALIDATION': '<span style="font-size: 11px; padding: 4px 8px; border-radius: 4px; background: #FEF3C7; color: #92400E; font-weight: 600;">⏳VAL</span>',
        'VALIDEE': '<span style="font-size: 11px; padding: 4px 8px; border-radius: 4px; background: #D1FAE5; color: #065F46; font-weight: 600;">✅VAL</span>',
        'REFUSEE': '<span style="font-size: 11px; padding: 4px 8px; border-radius: 4px; background: #FEE2E2; color: #991B1B; font-weight: 600;">❌REJ</span>'
    };
    return badges[status] || status;
}

function exportExcel() {
    alert('Export Excel - Fonctionnalité à implémenter');
}

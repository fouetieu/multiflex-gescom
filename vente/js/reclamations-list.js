/**
 * MultiFlex GESCOM - Liste Réclamations Clients
 * ECR-RCL-001 : Liste des réclamations clients
 */

// ============================================================================
// MOCK DATA
// ============================================================================

const claimsData = [
    {
        number: 'RCL-2024-00234',
        client: { name: 'SONACOM SARL', code: 'CLI-2024-00156' },
        date: '30/01/2024 09:15',
        type: 'quality',
        typeLabel: 'Qualité produit',
        subject: 'Peinture ne tient pas après 2 jours',
        priority: 'critical',
        assignedTo: 'Service Qualité',
        slaDeadline: '30/01/2024 13:15',
        slaStatus: 'warning',
        slaRemaining: '2h restantes',
        status: 'in_progress',
        relatedDoc: 'FA-CLI156-2024-00567'
    },
    {
        number: 'RCL-2024-00233',
        client: { name: 'KAMGA Jean Paul', code: 'CLI-2024-00089' },
        date: '30/01/2024 08:30',
        type: 'delay',
        typeLabel: 'Délai livraison',
        subject: 'Livraison attendue depuis 3 jours',
        priority: 'high',
        assignedTo: 'Logistique',
        slaDeadline: '30/01/2024 16:30',
        slaStatus: 'ok',
        slaRemaining: '5h restantes',
        status: 'in_progress',
        relatedDoc: 'CMD-CLI089-2024-00345'
    },
    {
        number: 'RCL-2024-00232',
        client: { name: 'TECHNI-BUILD SA', code: 'CLI-2024-00234' },
        date: '29/01/2024 16:45',
        type: 'billing',
        typeLabel: 'Facturation',
        subject: 'Erreur de prix sur 3 articles',
        priority: 'medium',
        assignedTo: 'Comptabilité',
        slaDeadline: '31/01/2024 16:45',
        slaStatus: 'ok',
        slaRemaining: '24h restantes',
        status: 'pending',
        relatedDoc: 'FA-CLI234-2024-00445'
    },
    {
        number: 'RCL-2024-00231',
        client: { name: 'QUINCAILLERIE MODERNE', code: 'CLI-2024-00045' },
        date: '29/01/2024 14:20',
        type: 'quality',
        typeLabel: 'Qualité produit',
        subject: 'Ciment humide, inutilisable',
        priority: 'critical',
        assignedTo: 'Service Qualité',
        slaDeadline: '29/01/2024 18:20',
        slaStatus: 'breach',
        slaRemaining: 'Dépassé de 15h',
        status: 'open',
        relatedDoc: 'BL-CLI045-2024-00187'
    },
    {
        number: 'RCL-2024-00230',
        client: { name: 'BTP SERVICES', code: 'CLI-2024-00098' },
        date: '29/01/2024 11:00',
        type: 'service',
        typeLabel: 'Service',
        subject: 'Mauvais accueil par commercial',
        priority: 'low',
        assignedTo: 'Direction Commerciale',
        slaDeadline: '01/02/2024 11:00',
        slaStatus: 'ok',
        slaRemaining: '48h restantes',
        status: 'in_progress',
        relatedDoc: null
    },
    {
        number: 'RCL-2024-00229',
        client: { name: 'DEPOT CENTRAL', code: 'CLI-2024-00078' },
        date: '28/01/2024 15:30',
        type: 'delay',
        typeLabel: 'Délai livraison',
        subject: 'Commande urgente non livrée',
        priority: 'high',
        assignedTo: 'Logistique',
        slaDeadline: '28/01/2024 23:30',
        slaStatus: 'breach',
        slaRemaining: 'Dépassé de 24h',
        status: 'resolved',
        relatedDoc: 'CMD-CLI078-2024-00289'
    },
    {
        number: 'RCL-2024-00228',
        client: { name: 'CONSTRUCTION PLUS', code: 'CLI-2024-00201' },
        date: '28/01/2024 10:15',
        type: 'quality',
        typeLabel: 'Qualité produit',
        subject: 'Fer à béton rouillé',
        priority: 'medium',
        assignedTo: 'Service Qualité',
        slaDeadline: '29/01/2024 10:15',
        slaStatus: 'ok',
        slaRemaining: 'Traité dans les délais',
        status: 'resolved',
        relatedDoc: 'BL-CLI201-2024-00165'
    },
    {
        number: 'RCL-2024-00227',
        client: { name: 'ENTREPRISE XYZ', code: 'CLI-2024-00167' },
        date: '27/01/2024 09:00',
        type: 'billing',
        typeLabel: 'Facturation',
        subject: 'TVA mal calculée',
        priority: 'medium',
        assignedTo: 'Comptabilité',
        slaDeadline: '29/01/2024 09:00',
        slaStatus: 'ok',
        slaRemaining: 'Traité dans les délais',
        status: 'closed',
        relatedDoc: 'FA-CLI167-2024-00156'
    },
    {
        number: 'RCL-2024-00226',
        client: { name: 'MAISON DECO', code: 'CLI-2024-00112' },
        date: '26/01/2024 14:45',
        type: 'service',
        typeLabel: 'Service',
        subject: 'Demande de conseil technique ignorée',
        priority: 'low',
        assignedTo: 'Service Technique',
        slaDeadline: '30/01/2024 14:45',
        slaStatus: 'ok',
        slaRemaining: 'Traité dans les délais',
        status: 'closed',
        relatedDoc: null
    },
    {
        number: 'RCL-2024-00225',
        client: { name: 'BATIPRO SA', code: 'CLI-2024-00056' },
        date: '25/01/2024 11:30',
        type: 'quality',
        typeLabel: 'Qualité produit',
        subject: 'Couleur peinture ne correspond pas',
        priority: 'medium',
        assignedTo: 'Service Qualité',
        slaDeadline: '26/01/2024 11:30',
        slaStatus: 'ok',
        slaRemaining: 'Traité dans les délais',
        status: 'resolved',
        relatedDoc: 'FA-CLI056-2024-00098'
    }
];

let activeDropdown = null;

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    renderTable();
    updateStats();

    // Close dropdown on outside click
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.action-dropdown')) {
            closeAllDropdowns();
        }
    });
});

// ============================================================================
// RENDER
// ============================================================================

/**
 * Render claims table
 */
function renderTable() {
    const tbody = document.getElementById('claimsTableBody');

    tbody.innerHTML = claimsData.map((claim, index) => {
        const statusLabel = {
            open: 'Ouvert',
            in_progress: 'En cours',
            pending: 'En attente',
            resolved: 'Résolu',
            closed: 'Clôturé'
        }[claim.status];

        const priorityLabel = {
            critical: 'Critique',
            high: 'Haute',
            medium: 'Moyenne',
            low: 'Basse'
        }[claim.priority];

        const typeIcon = {
            quality: 'fa-flask',
            delay: 'fa-truck',
            billing: 'fa-file-invoice',
            service: 'fa-user-tie'
        }[claim.type];

        return `
            <tr>
                <td>
                    <div class="claim-number">${claim.number}</div>
                    <div style="font-size: 11px; color: #6B7280;">${claim.date}</div>
                </td>
                <td>
                    <div class="client-name">${claim.client.name}</div>
                    <div class="client-code">${claim.client.code}</div>
                </td>
                <td>
                    <div class="claim-type">
                        <span class="type-icon ${claim.type}">
                            <i class="fa-solid ${typeIcon}"></i>
                        </span>
                        ${claim.typeLabel}
                    </div>
                </td>
                <td style="max-width: 200px;">
                    <div style="font-weight: 500; color: #1F2937;">${claim.subject}</div>
                    ${claim.relatedDoc ? `<div style="font-size: 11px; color: #6B7280;">→ ${claim.relatedDoc}</div>` : ''}
                </td>
                <td>
                    <span class="priority-badge ${claim.priority}">
                        ${claim.priority === 'critical' ? '<i class="fa-solid fa-fire"></i>' : ''}
                        ${priorityLabel}
                    </span>
                </td>
                <td style="font-size: 13px;">${claim.assignedTo}</td>
                <td>
                    <div class="sla-indicator ${claim.slaStatus}">
                        <i class="fa-solid ${claim.slaStatus === 'ok' ? 'fa-check-circle' : claim.slaStatus === 'warning' ? 'fa-exclamation-triangle' : 'fa-times-circle'}"></i>
                        ${claim.slaRemaining}
                    </div>
                </td>
                <td>
                    <span class="status-badge ${claim.status}">${statusLabel}</span>
                </td>
                <td>
                    <div class="action-dropdown">
                        <button class="action-btn" onclick="toggleDropdown(${index})">
                            Actions <i class="fa-solid fa-chevron-down"></i>
                        </button>
                        <div class="dropdown-menu" id="dropdown-${index}">
                            <div class="dropdown-item" onclick="viewClaim('${claim.number}')">
                                <i class="fa-solid fa-eye"></i> Voir détails
                            </div>
                            ${claim.status !== 'closed' && claim.status !== 'resolved' ? `
                                <div class="dropdown-item" onclick="addAction('${claim.number}')">
                                    <i class="fa-solid fa-comment"></i> Ajouter action
                                </div>
                                <div class="dropdown-item" onclick="reassignClaim('${claim.number}')">
                                    <i class="fa-solid fa-user-plus"></i> Réassigner
                                </div>
                            ` : ''}
                            ${claim.status === 'open' || claim.status === 'in_progress' ? `
                                <div class="dropdown-item" onclick="escalateClaim('${claim.number}')">
                                    <i class="fa-solid fa-arrow-up"></i> Escalader
                                </div>
                            ` : ''}
                            ${claim.status === 'in_progress' || claim.status === 'pending' ? `
                                <div class="dropdown-item" onclick="resolveClaim('${claim.number}')">
                                    <i class="fa-solid fa-check"></i> Résoudre
                                </div>
                            ` : ''}
                            ${claim.status === 'resolved' ? `
                                <div class="dropdown-item" onclick="closeClaim('${claim.number}')">
                                    <i class="fa-solid fa-lock"></i> Clôturer
                                </div>
                            ` : ''}
                            <div class="dropdown-item" onclick="createReturn('${claim.number}')">
                                <i class="fa-solid fa-rotate-left"></i> Créer retour
                            </div>
                            <div class="dropdown-item" onclick="createAvoir('${claim.number}')">
                                <i class="fa-solid fa-file-invoice-dollar"></i> Créer avoir
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * Update stats
 */
function updateStats() {
    const total = claimsData.length;
    const critical = claimsData.filter(c => c.priority === 'critical' && c.status !== 'closed' && c.status !== 'resolved').length;
    const pending = claimsData.filter(c => c.status === 'in_progress' || c.status === 'pending' || c.status === 'open').length;
    const resolved = claimsData.filter(c => c.status === 'resolved' || c.status === 'closed').length;
    const slaOk = claimsData.filter(c => c.slaStatus === 'ok').length;

    document.getElementById('totalClaims').textContent = total;
    document.getElementById('criticalClaims').textContent = critical;
    document.getElementById('pendingClaims').textContent = pending;
    document.getElementById('resolvedClaims').textContent = resolved;
    document.getElementById('slaRate').textContent = Math.round((slaOk / total) * 100) + '%';
}

// ============================================================================
// DROPDOWN
// ============================================================================

/**
 * Toggle dropdown
 */
function toggleDropdown(index) {
    const dropdown = document.getElementById(`dropdown-${index}`);

    closeAllDropdowns();

    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
    } else {
        dropdown.classList.add('show');
        activeDropdown = dropdown;
    }

    event.stopPropagation();
}

/**
 * Close all dropdowns
 */
function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-menu').forEach(d => d.classList.remove('show'));
    activeDropdown = null;
}

// ============================================================================
// ACTIONS
// ============================================================================

/**
 * Create new claim
 */
function createClaim() {
    window.location.href = './reclamation-detail.html?mode=create';
}

/**
 * View claim details
 */
function viewClaim(number) {
    closeAllDropdowns();
    window.location.href = `./reclamation-detail.html?id=${number}`;
}

/**
 * Add action to claim
 */
function addAction(number) {
    closeAllDropdowns();
    const action = prompt(`Ajouter une action au ticket ${number}:\n\nExemples:\n- Contact client par téléphone\n- Visite technique programmée\n- Attente pièces justificatives`);
    if (action) {
        alert(`Action ajoutée au ticket ${number}:\n"${action}"`);
    }
}

/**
 * Reassign claim
 */
function reassignClaim(number) {
    closeAllDropdowns();
    const assignee = prompt(`Réassigner le ticket ${number} à:\n\n1. Service Qualité\n2. Logistique\n3. Comptabilité\n4. Direction Commerciale\n5. Service Technique\n\nEntrez le numéro (1-5):`);

    const services = {
        '1': 'Service Qualité',
        '2': 'Logistique',
        '3': 'Comptabilité',
        '4': 'Direction Commerciale',
        '5': 'Service Technique'
    };

    if (assignee && services[assignee]) {
        alert(`Ticket ${number} réassigné à ${services[assignee]}`);
    }
}

/**
 * Escalate claim
 */
function escalateClaim(number) {
    closeAllDropdowns();
    if (confirm(`Escalader le ticket ${number} vers la Direction ?\n\nCette action notifiera automatiquement la direction générale.`)) {
        alert(`Ticket ${number} escaladé vers la Direction.\n\nUne notification a été envoyée.`);
    }
}

/**
 * Resolve claim
 */
function resolveClaim(number) {
    closeAllDropdowns();
    const resolution = prompt(`Résolution du ticket ${number}:\n\nDécrivez la solution apportée:`);
    if (resolution) {
        alert(`Ticket ${number} marqué comme résolu.\n\nSolution: ${resolution}\n\nLe client sera notifié.`);
    }
}

/**
 * Close claim
 */
function closeClaim(number) {
    closeAllDropdowns();
    if (confirm(`Clôturer définitivement le ticket ${number} ?\n\nCette action est irréversible.`)) {
        alert(`Ticket ${number} clôturé avec succès.`);
        renderTable();
    }
}

/**
 * Create return from claim
 */
function createReturn(number) {
    closeAllDropdowns();
    window.location.href = `./retour-create.html?claim=${number}`;
}

/**
 * Create avoir from claim
 */
function createAvoir(number) {
    closeAllDropdowns();
    window.location.href = `./avoir-create.html?claim=${number}`;
}

/**
 * Export list
 */
function exportList() {
    alert('Export de la liste des réclamations en cours...');
}

/**
 * Apply filters
 */
function applyFilters() {
    const ticketNumber = document.getElementById('filter-ticket-number')?.value?.trim().toUpperCase() || '';
    const client = document.getElementById('filter-client')?.value?.trim().toLowerCase() || '';
    const type = document.getElementById('filter-type')?.value || '';
    const priority = document.getElementById('filter-priority')?.value || '';
    const dateFrom = document.getElementById('filter-date-from')?.value || '';
    const dateTo = document.getElementById('filter-date-to')?.value || '';

    let filtered = [...claimsData];

    if (ticketNumber) {
        filtered = filtered.filter(c => c.number.includes(ticketNumber));
    }

    if (client) {
        filtered = filtered.filter(c => c.client.name.toLowerCase().includes(client) || c.client.code.toLowerCase().includes(client));
    }

    if (type) {
        filtered = filtered.filter(c => c.type === type);
    }

    if (priority) {
        filtered = filtered.filter(c => c.priority === priority);
    }

    // Apply status filter if active
    const activeChip = document.querySelector('.filter-chip.active');
    if (activeChip && activeChip.dataset.status !== 'all') {
        filtered = filtered.filter(c => c.status === activeChip.dataset.status);
    }

    renderTableWithData(filtered);
    updatePagination(filtered.length);
}

/**
 * Filter by status (quick filters)
 */
function filterByStatus(status) {
    // Update active chip
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.status === status);
    });

    applyFilters();
}

/**
 * Toggle advanced filters
 */
function toggleAdvancedFilters() {
    const filters = document.getElementById('advanced-filters');
    filters.style.display = filters.style.display === 'none' ? 'block' : 'none';
}

/**
 * Reset filters
 */
function resetFilters() {
    document.getElementById('filter-ticket-number').value = '';
    document.getElementById('filter-client').value = '';
    document.getElementById('filter-type').value = '';
    document.getElementById('filter-priority').value = '';
    document.getElementById('filter-date-from').value = '';
    document.getElementById('filter-date-to').value = '';

    // Reset status filter to 'all'
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.status === 'all');
    });

    renderTable();
    updatePagination(claimsData.length);
}

/**
 * Render table with specific data
 */
function renderTableWithData(data) {
    const tbody = document.getElementById('claimsTableBody');
    const emptyState = document.getElementById('empty-state');

    if (data.length === 0) {
        tbody.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    tbody.innerHTML = data.map((claim, index) => {
        const statusLabel = {
            open: 'Ouvert',
            in_progress: 'En cours',
            pending: 'En attente',
            resolved: 'Résolu',
            closed: 'Clôturé'
        }[claim.status];

        const priorityLabel = {
            critical: 'Critique',
            high: 'Haute',
            medium: 'Moyenne',
            low: 'Basse'
        }[claim.priority];

        const typeIcon = {
            quality: 'fa-flask',
            delay: 'fa-truck',
            billing: 'fa-file-invoice',
            service: 'fa-user-tie'
        }[claim.type];

        return `
            <tr>
                <td>
                    <div class="claim-number">${claim.number}</div>
                    <div style="font-size: 11px; color: #6B7280;">${claim.date}</div>
                </td>
                <td>
                    <div class="client-name">${claim.client.name}</div>
                    <div class="client-code">${claim.client.code}</div>
                </td>
                <td>
                    <div class="claim-type">
                        <span class="type-icon ${claim.type}">
                            <i class="fa-solid ${typeIcon}"></i>
                        </span>
                        ${claim.typeLabel}
                    </div>
                </td>
                <td style="max-width: 200px;">
                    <div style="font-weight: 500; color: #1F2937;">${claim.subject}</div>
                    ${claim.relatedDoc ? `<div style="font-size: 11px; color: #6B7280;">→ ${claim.relatedDoc}</div>` : ''}
                </td>
                <td>
                    <span class="priority-badge ${claim.priority}">
                        ${claim.priority === 'critical' ? '<i class="fa-solid fa-fire"></i>' : ''}
                        ${priorityLabel}
                    </span>
                </td>
                <td style="font-size: 13px;">${claim.assignedTo}</td>
                <td>
                    <div class="sla-indicator ${claim.slaStatus}">
                        <i class="fa-solid ${claim.slaStatus === 'ok' ? 'fa-check-circle' : claim.slaStatus === 'warning' ? 'fa-exclamation-triangle' : 'fa-times-circle'}"></i>
                        ${claim.slaRemaining}
                    </div>
                </td>
                <td>
                    <span class="status-badge ${claim.status}">${statusLabel}</span>
                </td>
                <td>
                    <div class="action-dropdown">
                        <button class="action-btn" onclick="toggleDropdown(${index})">
                            Actions <i class="fa-solid fa-chevron-down"></i>
                        </button>
                        <div class="dropdown-menu" id="dropdown-${index}">
                            <div class="dropdown-item" onclick="viewClaim('${claim.number}')">
                                <i class="fa-solid fa-eye"></i> Voir détails
                            </div>
                            ${claim.status !== 'closed' && claim.status !== 'resolved' ? `
                                <div class="dropdown-item" onclick="addAction('${claim.number}')">
                                    <i class="fa-solid fa-comment"></i> Ajouter action
                                </div>
                                <div class="dropdown-item" onclick="reassignClaim('${claim.number}')">
                                    <i class="fa-solid fa-user-plus"></i> Réassigner
                                </div>
                            ` : ''}
                            ${claim.status === 'open' || claim.status === 'in_progress' ? `
                                <div class="dropdown-item" onclick="escalateClaim('${claim.number}')">
                                    <i class="fa-solid fa-arrow-up"></i> Escalader
                                </div>
                            ` : ''}
                            ${claim.status === 'in_progress' || claim.status === 'pending' ? `
                                <div class="dropdown-item" onclick="resolveClaim('${claim.number}')">
                                    <i class="fa-solid fa-check"></i> Résoudre
                                </div>
                            ` : ''}
                            ${claim.status === 'resolved' ? `
                                <div class="dropdown-item" onclick="closeClaim('${claim.number}')">
                                    <i class="fa-solid fa-lock"></i> Clôturer
                                </div>
                            ` : ''}
                            <div class="dropdown-item" onclick="createReturn('${claim.number}')">
                                <i class="fa-solid fa-rotate-left"></i> Créer retour
                            </div>
                            <div class="dropdown-item" onclick="createAvoir('${claim.number}')">
                                <i class="fa-solid fa-file-invoice-dollar"></i> Créer avoir
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * Update pagination
 */
function updatePagination(total) {
    document.getElementById('pagination-from').textContent = total > 0 ? '1' : '0';
    document.getElementById('pagination-to').textContent = total;
    document.getElementById('pagination-total').textContent = total;
}

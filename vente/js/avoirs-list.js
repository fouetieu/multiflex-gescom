/**
 * MultiFlex GESCOM - Liste Avoirs Client
 * ECR-FAC-005 : Liste des avoirs clients
 */

// ============================================================================
// MOCK DATA
// ============================================================================

const avoirsData = [
    {
        number: 'AV-2024-00090',
        client: { name: 'SONACOM SARL', code: 'CLI-2024-00156' },
        date: '30/01/2024',
        sourceInvoice: 'FA-CLI156-2024-00567',
        motif: 'Retour marchandise',
        motifCode: 'return',
        amountHT: 84000,
        amountTTC: 100170,
        status: 'pending',
        appliedTo: null
    },
    {
        number: 'AV-2024-00089',
        client: { name: 'TECHNI-BUILD SA', code: 'CLI-2024-00234' },
        date: '29/01/2024',
        sourceInvoice: 'FA-CLI234-2024-00445',
        motif: 'Retour marchandise',
        motifCode: 'return',
        amountHT: 196639,
        amountTTC: 234500,
        status: 'applied',
        appliedTo: 'FA-CLI234-2024-00512'
    },
    {
        number: 'AV-2024-00088',
        client: { name: 'QUINCAILLERIE MODERNE', code: 'CLI-2024-00045' },
        date: '28/01/2024',
        sourceInvoice: 'FA-CLI045-2024-00389',
        motif: 'Erreur facturation',
        motifCode: 'error',
        amountHT: 65409,
        amountTTC: 78000,
        status: 'applied',
        appliedTo: 'FA-CLI045-2024-00401'
    },
    {
        number: 'AV-2024-00087',
        client: { name: 'BTP SERVICES', code: 'CLI-2024-00098' },
        date: '27/01/2024',
        sourceInvoice: 'FA-CLI098-2024-00312',
        motif: 'Produit défectueux',
        motifCode: 'defect',
        amountHT: 74685,
        amountTTC: 89000,
        status: 'applied',
        appliedTo: 'FA-CLI098-2024-00345'
    },
    {
        number: 'AV-2024-00086',
        client: { name: 'DEPOT CENTRAL', code: 'CLI-2024-00078' },
        date: '26/01/2024',
        sourceInvoice: 'FA-CLI078-2024-00267',
        motif: 'Retour marchandise',
        motifCode: 'return',
        amountHT: 196303,
        amountTTC: 234000,
        status: 'applied',
        appliedTo: 'Remboursement'
    },
    {
        number: 'AV-2024-00085',
        client: { name: 'KAMGA Jean Paul', code: 'CLI-2024-00089' },
        date: '25/01/2024',
        sourceInvoice: 'FA-CLI089-2024-00234',
        motif: 'Geste commercial',
        motifCode: 'commercial',
        amountHT: 25146,
        amountTTC: 29987,
        status: 'validated',
        appliedTo: null
    },
    {
        number: 'AV-2024-00084',
        client: { name: 'CONSTRUCTION PLUS', code: 'CLI-2024-00201' },
        date: '24/01/2024',
        sourceInvoice: 'FA-CLI201-2024-00198',
        motif: 'Erreur facturation',
        motifCode: 'error',
        amountHT: 130899,
        amountTTC: 156000,
        status: 'pending',
        appliedTo: null
    },
    {
        number: 'AV-2024-00083',
        client: { name: 'ENTREPRISE XYZ', code: 'CLI-2024-00167' },
        date: '23/01/2024',
        sourceInvoice: 'FA-CLI167-2024-00156',
        motif: 'Produit défectueux',
        motifCode: 'defect',
        amountHT: 419413,
        amountTTC: 500000,
        status: 'applied',
        appliedTo: 'FA-CLI167-2024-00201'
    },
    {
        number: 'AV-2024-00082',
        client: { name: 'MAISON DECO', code: 'CLI-2024-00112' },
        date: '22/01/2024',
        sourceInvoice: 'FA-CLI112-2024-00134',
        motif: 'Retour marchandise',
        motifCode: 'return',
        amountHT: 37736,
        amountTTC: 45000,
        status: 'draft',
        appliedTo: null
    },
    {
        number: 'AV-2024-00081',
        client: { name: 'BATIPRO SA', code: 'CLI-2024-00056' },
        date: '21/01/2024',
        sourceInvoice: 'FA-CLI056-2024-00098',
        motif: 'Geste commercial',
        motifCode: 'commercial',
        amountHT: 150753,
        amountTTC: 179773,
        status: 'cancelled',
        appliedTo: null
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
 * Render avoirs table
 */
function renderTable() {
    const tbody = document.getElementById('avoirsTableBody');

    tbody.innerHTML = avoirsData.map((avoir, index) => {
        const statusLabel = {
            draft: 'Brouillon',
            pending: 'En attente',
            validated: 'Validé',
            applied: 'Appliqué',
            cancelled: 'Annulé'
        }[avoir.status];

        return `
            <tr>
                <td>
                    <div class="avoir-number">${avoir.number}</div>
                </td>
                <td>
                    <div class="client-name">${avoir.client.name}</div>
                    <div class="client-code">${avoir.client.code}</div>
                </td>
                <td>${avoir.date}</td>
                <td>
                    <div class="doc-ref">${avoir.sourceInvoice}</div>
                </td>
                <td>${avoir.motif}</td>
                <td class="amount-cell">-${formatCurrency(avoir.amountTTC)}</td>
                <td>
                    <span class="status-badge ${avoir.status}">${statusLabel}</span>
                    ${avoir.appliedTo ? `<div style="font-size: 11px; color: #059669; margin-top: 4px;">→ ${avoir.appliedTo}</div>` : ''}
                </td>
                <td>
                    <div class="action-dropdown">
                        <button class="action-btn" onclick="toggleDropdown(${index})">
                            Actions <i class="fa-solid fa-chevron-down"></i>
                        </button>
                        <div class="dropdown-menu" id="dropdown-${index}">
                            <div class="dropdown-item" onclick="viewAvoir('${avoir.number}')">
                                <i class="fa-solid fa-eye"></i> Voir détails
                            </div>
                            ${avoir.status === 'draft' ? `
                                <div class="dropdown-item" onclick="editAvoir('${avoir.number}')">
                                    <i class="fa-solid fa-edit"></i> Modifier
                                </div>
                                <div class="dropdown-item" onclick="validateAvoir('${avoir.number}')">
                                    <i class="fa-solid fa-check"></i> Valider
                                </div>
                            ` : ''}
                            ${avoir.status === 'pending' || avoir.status === 'validated' ? `
                                <div class="dropdown-item" onclick="applyAvoir('${avoir.number}')">
                                    <i class="fa-solid fa-hand-holding-dollar"></i> Appliquer
                                </div>
                            ` : ''}
                            ${avoir.status !== 'applied' && avoir.status !== 'cancelled' ? `
                                <div class="dropdown-item" onclick="cancelAvoir('${avoir.number}')">
                                    <i class="fa-solid fa-times"></i> Annuler
                                </div>
                            ` : ''}
                            <div class="dropdown-item" onclick="printAvoir('${avoir.number}')">
                                <i class="fa-solid fa-print"></i> Imprimer
                            </div>
                            <div class="dropdown-item" onclick="duplicateAvoir('${avoir.number}')">
                                <i class="fa-solid fa-copy"></i> Dupliquer
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
    const total = avoirsData.length;
    const pending = avoirsData.filter(a => a.status === 'pending' || a.status === 'validated').length;
    const applied = avoirsData.filter(a => a.status === 'applied').length;
    const amount = avoirsData.filter(a => a.status !== 'cancelled').reduce((sum, a) => sum + a.amountTTC, 0);

    document.getElementById('totalAvoirs').textContent = total;
    document.getElementById('pendingAvoirs').textContent = pending;
    document.getElementById('appliedAvoirs').textContent = applied;
    document.getElementById('totalAmount').textContent = formatCompact(amount);
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
 * Create new avoir
 */
function createAvoir() {
    window.location.href = './avoir-create.html';
}

/**
 * View avoir details
 */
function viewAvoir(number) {
    closeAllDropdowns();
    window.location.href = `./avoir-create.html?view=${number}`;
}

/**
 * Edit avoir
 */
function editAvoir(number) {
    closeAllDropdowns();
    window.location.href = `./avoir-create.html?edit=${number}`;
}

/**
 * Validate avoir
 */
function validateAvoir(number) {
    closeAllDropdowns();
    if (confirm(`Valider l'avoir ${number} ?\n\nCette action permettra d'appliquer l'avoir sur les futures factures.`)) {
        alert(`Avoir ${number} validé avec succès!`);
        renderTable();
    }
}

/**
 * Apply avoir
 */
function applyAvoir(number) {
    closeAllDropdowns();
    const mode = prompt(`Comment appliquer l'avoir ${number} ?\n\n1 = Sur prochaine facture\n2 = Remboursement\n3 = Sur facture spécifique\n\nEntrez 1, 2 ou 3:`);

    if (mode === '1') {
        alert(`L'avoir ${number} sera déduit automatiquement de la prochaine facture du client.`);
    } else if (mode === '2') {
        alert(`Remboursement enregistré pour l'avoir ${number}.\nVeuillez procéder au remboursement (espèces/virement).`);
    } else if (mode === '3') {
        const invoiceNum = prompt('Entrez le numéro de facture:');
        if (invoiceNum) {
            alert(`Avoir ${number} appliqué sur la facture ${invoiceNum}.`);
        }
    }
    renderTable();
}

/**
 * Cancel avoir
 */
function cancelAvoir(number) {
    closeAllDropdowns();
    const reason = prompt(`Motif d'annulation de l'avoir ${number}:`);
    if (reason) {
        alert(`Avoir ${number} annulé.\nMotif: ${reason}`);
        renderTable();
    }
}

/**
 * Print avoir
 */
function printAvoir(number) {
    closeAllDropdowns();
    alert(`Impression de l'avoir ${number}...`);
}

/**
 * Duplicate avoir
 */
function duplicateAvoir(number) {
    closeAllDropdowns();
    if (confirm(`Créer un nouvel avoir basé sur ${number} ?`)) {
        window.location.href = `./avoir-create.html?duplicate=${number}`;
    }
}

/**
 * Export list
 */
function exportList() {
    alert('Export de la liste des avoirs en cours...');
}

/**
 * Apply filters
 */
function applyFilters() {
    alert('Filtres appliqués!');
    renderTable();
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format currency
 */
function formatCurrency(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' XAF';
}

/**
 * Format compact
 */
function formatCompact(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
}

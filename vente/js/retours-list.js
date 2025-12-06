/**
 * MultiFlex GESCOM - Liste Bons de Retour Client
 * ECR-RET-001 : Liste des retours clients
 */

// ============================================================================
// MOCK DATA
// ============================================================================

const returnsData = [
    {
        number: 'RET-2024-00045',
        client: { name: 'SONACOM SARL', code: 'CLI-2024-00156' },
        date: '30/01/2024',
        sourceDoc: 'BL-CLI156-2024-00235',
        sourceType: 'BL',
        motif: 'Défaut fabrication',
        motifCode: 'defect',
        articles: 3,
        amount: 125000,
        status: 'pending',
        avoirNumber: null
    },
    {
        number: 'RET-2024-00044',
        client: { name: 'KAMGA Jean Paul', code: 'CLI-2024-00089' },
        date: '29/01/2024',
        sourceDoc: 'FA-CLI089-2024-00567',
        sourceType: 'FA',
        motif: 'Produit non conforme',
        motifCode: 'wrong',
        articles: 2,
        amount: 45600,
        status: 'validated',
        avoirNumber: null
    },
    {
        number: 'RET-2024-00043',
        client: { name: 'TECHNI-BUILD SA', code: 'CLI-2024-00234' },
        date: '28/01/2024',
        sourceDoc: 'BL-CLI234-2024-00198',
        sourceType: 'BL',
        motif: 'Endommagé transport',
        motifCode: 'damaged',
        articles: 5,
        amount: 234500,
        status: 'processed',
        avoirNumber: 'AV-2024-00089'
    },
    {
        number: 'RET-2024-00042',
        client: { name: 'QUINCAILLERIE MODERNE', code: 'CLI-2024-00045' },
        date: '27/01/2024',
        sourceDoc: 'BL-CLI045-2024-00187',
        sourceType: 'BL',
        motif: 'Défaut fabrication',
        motifCode: 'defect',
        articles: 1,
        amount: 78000,
        status: 'processed',
        avoirNumber: 'AV-2024-00088'
    },
    {
        number: 'RET-2024-00041',
        client: { name: 'ENTREPRISE XYZ', code: 'CLI-2024-00167' },
        date: '26/01/2024',
        sourceDoc: 'FA-CLI167-2024-00445',
        sourceType: 'FA',
        motif: 'Périmé',
        motifCode: 'expired',
        articles: 8,
        amount: 567000,
        status: 'rejected',
        avoirNumber: null
    },
    {
        number: 'RET-2024-00040',
        client: { name: 'BTP SERVICES', code: 'CLI-2024-00098' },
        date: '25/01/2024',
        sourceDoc: 'BL-CLI098-2024-00176',
        sourceType: 'BL',
        motif: 'Produit non conforme',
        motifCode: 'wrong',
        articles: 2,
        amount: 89000,
        status: 'processed',
        avoirNumber: 'AV-2024-00087'
    },
    {
        number: 'RET-2024-00039',
        client: { name: 'CONSTRUCTION PLUS', code: 'CLI-2024-00201' },
        date: '24/01/2024',
        sourceDoc: 'BL-CLI201-2024-00165',
        sourceType: 'BL',
        motif: 'Défaut fabrication',
        motifCode: 'defect',
        articles: 4,
        amount: 156000,
        status: 'pending',
        avoirNumber: null
    },
    {
        number: 'RET-2024-00038',
        client: { name: 'DEPOT CENTRAL', code: 'CLI-2024-00078' },
        date: '23/01/2024',
        sourceDoc: 'FA-CLI078-2024-00389',
        sourceType: 'FA',
        motif: 'Endommagé transport',
        motifCode: 'damaged',
        articles: 3,
        amount: 234000,
        status: 'processed',
        avoirNumber: 'AV-2024-00086'
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
 * Render returns table
 */
function renderTable() {
    const tbody = document.getElementById('returnsTableBody');

    tbody.innerHTML = returnsData.map((ret, index) => {
        const statusLabel = {
            pending: 'En attente',
            validated: 'Validé',
            processed: 'Traité',
            rejected: 'Rejeté'
        }[ret.status];

        return `
            <tr>
                <td>
                    <div class="return-number">${ret.number}</div>
                </td>
                <td>
                    <div class="client-name">${ret.client.name}</div>
                    <div class="client-code">${ret.client.code}</div>
                </td>
                <td>${ret.date}</td>
                <td>
                    <div class="doc-ref">${ret.sourceDoc}</div>
                    <div style="font-size: 11px; color: #6B7280;">${ret.sourceType === 'BL' ? 'Bon de livraison' : 'Facture'}</div>
                </td>
                <td>${ret.motif}</td>
                <td style="text-align: center;">${ret.articles}</td>
                <td class="amount-cell">-${formatCurrency(ret.amount)}</td>
                <td>
                    <span class="status-badge ${ret.status}">${statusLabel}</span>
                    ${ret.avoirNumber ? `<div style="font-size: 11px; color: #059669; margin-top: 4px;">→ ${ret.avoirNumber}</div>` : ''}
                </td>
                <td>
                    <div class="action-dropdown">
                        <button class="action-btn" onclick="toggleDropdown(${index})">
                            Actions <i class="fa-solid fa-chevron-down"></i>
                        </button>
                        <div class="dropdown-menu" id="dropdown-${index}">
                            <div class="dropdown-item" onclick="viewReturn('${ret.number}')">
                                <i class="fa-solid fa-eye"></i> Voir détails
                            </div>
                            ${ret.status === 'pending' ? `
                                <div class="dropdown-item" onclick="validateReturn('${ret.number}')">
                                    <i class="fa-solid fa-check"></i> Valider
                                </div>
                                <div class="dropdown-item" onclick="rejectReturn('${ret.number}')">
                                    <i class="fa-solid fa-times"></i> Rejeter
                                </div>
                            ` : ''}
                            ${ret.status === 'validated' ? `
                                <div class="dropdown-item" onclick="generateAvoir('${ret.number}')">
                                    <i class="fa-solid fa-file-invoice"></i> Générer avoir
                                </div>
                            ` : ''}
                            ${ret.avoirNumber ? `
                                <div class="dropdown-item" onclick="viewAvoir('${ret.avoirNumber}')">
                                    <i class="fa-solid fa-file-alt"></i> Voir avoir
                                </div>
                            ` : ''}
                            <div class="dropdown-item" onclick="printReturn('${ret.number}')">
                                <i class="fa-solid fa-print"></i> Imprimer
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
    const total = returnsData.length;
    const pending = returnsData.filter(r => r.status === 'pending').length;
    const processed = returnsData.filter(r => r.status === 'processed').length;
    const amount = returnsData.reduce((sum, r) => sum + r.amount, 0);

    document.getElementById('totalReturns').textContent = total;
    document.getElementById('pendingReturns').textContent = pending;
    document.getElementById('processedReturns').textContent = processed;
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
 * Create new return
 */
function createReturn() {
    window.location.href = './retour-create.html';
}

/**
 * View return details
 */
function viewReturn(number) {
    closeAllDropdowns();
    window.location.href = `./retour-create.html?view=${number}`;
}

/**
 * Validate return
 */
function validateReturn(number) {
    closeAllDropdowns();
    if (confirm(`Valider le retour ${number} ?\n\nCette action permettra de générer un avoir.`)) {
        alert(`Retour ${number} validé avec succès!`);
        renderTable();
    }
}

/**
 * Reject return
 */
function rejectReturn(number) {
    closeAllDropdowns();
    const reason = prompt('Motif du rejet:');
    if (reason) {
        alert(`Retour ${number} rejeté.\nMotif: ${reason}`);
        renderTable();
    }
}

/**
 * Generate avoir
 */
function generateAvoir(number) {
    closeAllDropdowns();
    window.location.href = `./avoir-create.html?source=${number}`;
}

/**
 * View avoir
 */
function viewAvoir(number) {
    closeAllDropdowns();
    window.location.href = `./avoir-create.html?view=${number}`;
}

/**
 * Print return
 */
function printReturn(number) {
    closeAllDropdowns();
    alert(`Impression du bon de retour ${number}...`);
}

/**
 * Export list
 */
function exportList() {
    alert('Export de la liste des retours en cours...');
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

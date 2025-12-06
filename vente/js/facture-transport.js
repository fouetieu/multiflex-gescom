/**
 * MultiFlex GESCOM - Facture Transport Subventionné
 * ECR-FAC-003 : Création d'une facture de transport subventionné
 */

// ============================================================================
// MOCK DATA
// ============================================================================

const mockBLs = {
    'BL-CLI156-2024-00235': {
        number: 'BL-CLI156-2024-00235',
        date: '29/01/2024',
        client: {
            name: 'SONACOM SARL',
            code: 'CLI-2024-00156',
            initials: 'SS'
        },
        orderAmount: 2450000,
        hasSubsidizedTransport: true,
        transport: {
            carrier: 'KAMGA Transport',
            vehicle: 'Camion 10T - LT 1234 AB',
            origin: 'Dépôt Central - Douala',
            destination: 'Yaoundé - Quartier Bastos',
            distance: 245,
            weight: 2500,
            costHT: 125840,
            customerDeposit: 150000,
            depositPaid: true,
            subsidyRate: 0.30
        }
    },
    'BL-CLI234-2024-00198': {
        number: 'BL-CLI234-2024-00198',
        date: '28/01/2024',
        client: {
            name: 'TECHNI-BUILD SA',
            code: 'CLI-2024-00234',
            initials: 'TB'
        },
        orderAmount: 5670000,
        hasSubsidizedTransport: true,
        transport: {
            carrier: 'Express Fret Cameroun',
            vehicle: 'Camion 20T - CE 5678 CD',
            origin: 'Dépôt Central - Douala',
            destination: 'Bafoussam - Zone Industrielle',
            distance: 310,
            weight: 8500,
            costHT: 285000,
            customerDeposit: 320000,
            depositPaid: true,
            subsidyRate: 0.30
        }
    },
    'BL-CLI089-2024-00145': {
        number: 'BL-CLI089-2024-00145',
        date: '27/01/2024',
        client: {
            name: 'KAMGA Jean Paul',
            code: 'CLI-2024-00089',
            initials: 'KJ'
        },
        orderAmount: 890000,
        hasSubsidizedTransport: true,
        transport: {
            carrier: 'Trans Logistique',
            vehicle: 'Fourgon 3T - LT 9012 EF',
            origin: 'Dépôt Central - Douala',
            destination: 'Kribi - Centre Ville',
            distance: 150,
            weight: 800,
            costHT: 45000,
            customerDeposit: 50000,
            depositPaid: true,
            subsidyRate: 0.25
        }
    }
};

let currentBL = null;
const TVA_RATE = 0.1925;

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Check URL params
    const urlParams = new URLSearchParams(window.location.search);
    const blNumber = urlParams.get('bl');

    if (blNumber && mockBLs[blNumber]) {
        document.getElementById('blSelect').value = blNumber;
        loadBL();
    }
});

// ============================================================================
// LOAD BL
// ============================================================================

/**
 * Load selected BL
 */
function loadBL() {
    const blNumber = document.getElementById('blSelect').value;

    if (!blNumber) {
        document.getElementById('detailsSection').classList.add('hidden-section');
        currentBL = null;
        return;
    }

    const bl = mockBLs[blNumber];

    if (!bl) {
        alert('Bon de livraison non trouvé.');
        return;
    }

    if (!bl.hasSubsidizedTransport) {
        alert('Ce bon de livraison n\'a pas de transport subventionné.');
        return;
    }

    currentBL = bl;

    // Show details section
    document.getElementById('detailsSection').classList.remove('hidden-section');

    // Populate client info
    document.getElementById('clientInitials').textContent = bl.client.initials;
    document.getElementById('clientName').textContent = bl.client.name;
    document.getElementById('clientCode').textContent = bl.client.code;
    document.getElementById('deliveryDate').textContent = bl.date;
    document.getElementById('orderAmount').textContent = formatCurrency(bl.orderAmount);

    // Populate transport info
    document.getElementById('carrierName').textContent = bl.transport.carrier;
    document.getElementById('vehicleInfo').textContent = bl.transport.vehicle;
    document.getElementById('origin').textContent = bl.transport.origin;
    document.getElementById('destination').textContent = bl.transport.destination;
    document.getElementById('distance').textContent = `${bl.transport.distance} km`;
    document.getElementById('totalWeight').textContent = `${bl.transport.weight.toLocaleString()} kg`;

    // Calculate amounts
    calculateAmounts();
}

/**
 * Calculate invoice amounts
 */
function calculateAmounts() {
    const transport = currentBL.transport;

    // Transport cost HT
    document.getElementById('transportCost').textContent = formatCurrency(transport.costHT);

    // Customer deposit
    document.getElementById('customerDeposit').textContent = formatCurrency(transport.customerDeposit);

    // Subsidy (percentage of transport cost)
    const subsidyAmount = Math.round(transport.costHT * transport.subsidyRate);
    document.getElementById('subsidyAmount').textContent = formatCurrency(subsidyAmount);

    // Net before TVA
    const netBeforeTVA = transport.costHT - subsidyAmount;

    // TVA
    const tvaAmount = Math.round(netBeforeTVA * TVA_RATE);
    document.getElementById('tvaAmount').textContent = formatCurrency(tvaAmount);

    // Net total TTC
    const netTotal = netBeforeTVA + tvaAmount;
    document.getElementById('netTotal').textContent = formatCurrency(netTotal);
}

/**
 * Search BL
 */
function searchBL() {
    const searchTerm = prompt('Rechercher un bon de livraison:\n\nEntrez le numéro du BL ou le nom du client:');

    if (searchTerm) {
        const searchUpper = searchTerm.toUpperCase();

        // Search in mock data
        for (const key in mockBLs) {
            const bl = mockBLs[key];
            if (key.toUpperCase().includes(searchUpper) ||
                bl.client.name.toUpperCase().includes(searchUpper)) {

                document.getElementById('blSelect').value = key;
                loadBL();
                return;
            }
        }

        alert(`Aucun bon de livraison trouvé pour "${searchTerm}".`);
    }
}

// ============================================================================
// ACTIONS
// ============================================================================

/**
 * Validate invoice
 */
function validateInvoice() {
    if (!currentBL) {
        alert('Veuillez sélectionner un bon de livraison.');
        return;
    }

    const transport = currentBL.transport;
    const subsidyAmount = Math.round(transport.costHT * transport.subsidyRate);
    const netBeforeTVA = transport.costHT - subsidyAmount;
    const tvaAmount = Math.round(netBeforeTVA * TVA_RATE);
    const netTotal = netBeforeTVA + tvaAmount;

    if (confirm(`Valider la facture transport ?

Client: ${currentBL.client.name}
BL source: ${currentBL.number}
Transporteur: ${transport.carrier}

Coût transport HT: ${formatCurrency(transport.costHT)}
Subvention (${transport.subsidyRate * 100}%): -${formatCurrency(subsidyAmount)}
TVA 19.25%: ${formatCurrency(tvaAmount)}
Net à facturer TTC: ${formatCurrency(netTotal)}`)) {

        alert(`Facture transport créée avec succès!

N° Facture: FT-2024-00015
Montant TTC: ${formatCurrency(netTotal)}

La facture a été enregistrée et sera disponible dans la liste des factures.`);

        window.location.href = './factures-list.html';
    }
}

/**
 * Preview PDF
 */
function preview() {
    if (!currentBL) {
        alert('Veuillez sélectionner un bon de livraison.');
        return;
    }

    alert('Génération de l\'aperçu PDF...');
}

/**
 * Save draft
 */
function saveDraft() {
    if (!currentBL) {
        alert('Veuillez sélectionner un bon de livraison.');
        return;
    }

    alert('Brouillon enregistré avec succès!');
}

/**
 * Go back
 */
function goBack() {
    if (currentBL) {
        if (confirm('Voulez-vous vraiment annuler ? Les modifications seront perdues.')) {
            window.history.back();
        }
    } else {
        window.history.back();
    }
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

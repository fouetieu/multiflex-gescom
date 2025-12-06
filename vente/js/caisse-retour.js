/**
 * MultiFlex GESCOM - Retour/Annulation Ticket POS
 * ECR-POS-004/005 : Recherche ticket et traitement retour/annulation
 */

// ============================================================================
// MOCK DATA
// ============================================================================

const mockTickets = {
    '0015': {
        number: '0015',
        date: '29/01/2024 10:45',
        client: {
            name: 'KAMGA Jean Paul',
            type: 'Particulier',
            initials: 'KJ'
        },
        total: 51107,
        paymentMethod: 'Espèces',
        invoiceRequested: true,
        articles: [
            { code: 'PEINT-BLC-05L', name: 'Peinture Blanche 5L', qty: 2, price: 4500, total: 9000 },
            { code: 'CIMENT-50KG', name: 'Ciment Portland 50kg', qty: 5, price: 7200, total: 36000 },
            { code: 'VIS-6X60-B100', name: 'Vis 6x60 Boîte 100', qty: 3, price: 1200, total: 3600 },
            { code: 'GANTS-TRAV-L', name: 'Gants travail L', qty: 1, price: 2507, total: 2507 }
        ]
    },
    '0034': {
        number: '0034',
        date: '29/01/2024 14:20',
        client: {
            name: 'Client de passage',
            type: 'Passage',
            initials: 'CP'
        },
        total: 28500,
        paymentMethod: 'Mobile Money',
        invoiceRequested: false,
        articles: [
            { code: 'FER-12MM-6M', name: 'Fer à béton 12mm 6m', qty: 10, price: 2850, total: 28500 }
        ]
    }
};

let currentTicket = null;
let operationType = 'return';
let returnItems = {};

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    updateTime();
    setInterval(updateTime, 1000);

    // Handle Enter key in search
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchTicket();
        }
    });

    // Setup auth modal PIN inputs
    setupAuthPinInputs();
});

/**
 * Update time display
 */
function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('currentTime').textContent = `${hours}:${minutes}`;
}

// ============================================================================
// SEARCH
// ============================================================================

/**
 * Search for ticket
 */
function searchTicket() {
    const query = document.getElementById('searchInput').value.trim();

    if (!query) {
        showNoResult();
        return;
    }

    // Search in mock data
    const ticket = mockTickets[query];

    if (ticket) {
        displayTicket(ticket);
    } else {
        showNoResult();
    }
}

/**
 * Show no result message
 */
function showNoResult() {
    document.getElementById('noResult').classList.add('show');
    document.getElementById('ticketCard').classList.remove('show');
    currentTicket = null;
}

/**
 * Display ticket details
 */
function displayTicket(ticket) {
    currentTicket = ticket;
    returnItems = {};

    // Hide no result, show ticket card
    document.getElementById('noResult').classList.remove('show');
    document.getElementById('ticketCard').classList.add('show');

    // Populate ticket info
    document.getElementById('ticketNumber').textContent = ticket.number;
    document.getElementById('ticketDate').textContent = ticket.date;
    document.getElementById('ticketAmount').textContent = formatCurrency(ticket.total);
    document.getElementById('paymentMethod').textContent = ticket.paymentMethod;

    // Populate client info
    document.getElementById('clientName').textContent = ticket.client.name;
    document.getElementById('clientType').textContent = ticket.client.type;
    document.getElementById('clientInitials').textContent = ticket.client.initials;

    const invoiceBadge = document.getElementById('invoiceBadge');
    if (ticket.invoiceRequested) {
        invoiceBadge.textContent = 'Facture demandée';
        invoiceBadge.classList.remove('no');
    } else {
        invoiceBadge.textContent = 'Sans facture';
        invoiceBadge.classList.add('no');
    }

    // Populate articles table
    renderArticlesTable(ticket.articles);

    // Initialize return items
    ticket.articles.forEach((article, index) => {
        returnItems[index] = {
            selected: false,
            returnQty: 0,
            motif: ''
        };
    });

    // Reset refund amount
    calculateRefund();
}

/**
 * Render articles table
 */
function renderArticlesTable(articles) {
    const tbody = document.getElementById('articlesTableBody');

    tbody.innerHTML = articles.map((article, index) => `
        <tr>
            <td>
                <input type="checkbox" class="article-checkbox"
                       onchange="toggleArticle(${index})" id="check-${index}">
            </td>
            <td>
                <div class="article-info">
                    <span class="article-code">${article.code}</span>
                    <span class="article-name">${article.name}</span>
                </div>
            </td>
            <td style="text-align: center;">
                ${article.qty}
            </td>
            <td>
                <div class="qty-selector">
                    <button class="qty-btn" onclick="updateReturnQty(${index}, -1)">-</button>
                    <input type="number" class="qty-input" id="qty-${index}"
                           value="0" min="0" max="${article.qty}"
                           onchange="setReturnQty(${index})" disabled>
                    <button class="qty-btn" onclick="updateReturnQty(${index}, 1)">+</button>
                    <span class="qty-max">/ ${article.qty}</span>
                </div>
            </td>
            <td>
                <select class="motif-select" id="motif-${index}"
                        onchange="setMotif(${index})" disabled>
                    <option value="">Motif...</option>
                    <option value="defect">Défectueux</option>
                    <option value="wrong">Non conforme</option>
                    <option value="damaged">Endommagé</option>
                    <option value="expired">Périmé</option>
                </select>
            </td>
            <td class="line-total" id="total-${index}">
                0 XAF
            </td>
        </tr>
    `).join('');
}

// ============================================================================
// OPERATION TYPE
// ============================================================================

/**
 * Select operation type
 */
function selectOperation(type) {
    operationType = type;

    // Update UI
    document.querySelectorAll('.operation-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    event.target.closest('.operation-option').classList.add('selected');

    if (type === 'cancel') {
        // Select all articles for cancellation
        document.getElementById('articlesSection').style.opacity = '0.5';
        currentTicket.articles.forEach((article, index) => {
            returnItems[index] = {
                selected: true,
                returnQty: article.qty,
                motif: 'cancel'
            };
            document.getElementById(`check-${index}`).checked = true;
            document.getElementById(`qty-${index}`).value = article.qty;
            document.getElementById(`total-${index}`).textContent = formatCurrency(article.total);
        });
        calculateRefund();
    } else {
        // Reset for partial return
        document.getElementById('articlesSection').style.opacity = '1';
        currentTicket.articles.forEach((article, index) => {
            returnItems[index] = {
                selected: false,
                returnQty: 0,
                motif: ''
            };
            document.getElementById(`check-${index}`).checked = false;
            document.getElementById(`qty-${index}`).value = 0;
            document.getElementById(`qty-${index}`).disabled = true;
            document.getElementById(`motif-${index}`).disabled = true;
            document.getElementById(`total-${index}`).textContent = '0 XAF';
        });
        calculateRefund();
    }
}

// ============================================================================
// ARTICLE SELECTION
// ============================================================================

/**
 * Toggle article selection
 */
function toggleArticle(index) {
    const checkbox = document.getElementById(`check-${index}`);
    const qtyInput = document.getElementById(`qty-${index}`);
    const motifSelect = document.getElementById(`motif-${index}`);

    returnItems[index].selected = checkbox.checked;

    if (checkbox.checked) {
        qtyInput.disabled = false;
        motifSelect.disabled = false;
        qtyInput.value = 1;
        returnItems[index].returnQty = 1;
        updateLineTotal(index);
    } else {
        qtyInput.disabled = true;
        motifSelect.disabled = true;
        qtyInput.value = 0;
        returnItems[index].returnQty = 0;
        returnItems[index].motif = '';
        motifSelect.value = '';
        document.getElementById(`total-${index}`).textContent = '0 XAF';
    }

    calculateRefund();
}

/**
 * Update return quantity
 */
function updateReturnQty(index, delta) {
    if (!returnItems[index].selected) return;

    const qtyInput = document.getElementById(`qty-${index}`);
    const maxQty = currentTicket.articles[index].qty;
    let newQty = parseInt(qtyInput.value) + delta;

    newQty = Math.max(0, Math.min(newQty, maxQty));
    qtyInput.value = newQty;
    returnItems[index].returnQty = newQty;

    updateLineTotal(index);
    calculateRefund();
}

/**
 * Set return quantity from input
 */
function setReturnQty(index) {
    const qtyInput = document.getElementById(`qty-${index}`);
    const maxQty = currentTicket.articles[index].qty;
    let qty = parseInt(qtyInput.value) || 0;

    qty = Math.max(0, Math.min(qty, maxQty));
    qtyInput.value = qty;
    returnItems[index].returnQty = qty;

    updateLineTotal(index);
    calculateRefund();
}

/**
 * Set motif
 */
function setMotif(index) {
    const motifSelect = document.getElementById(`motif-${index}`);
    returnItems[index].motif = motifSelect.value;
}

/**
 * Update line total
 */
function updateLineTotal(index) {
    const article = currentTicket.articles[index];
    const returnQty = returnItems[index].returnQty;
    const lineTotal = returnQty * article.price;

    document.getElementById(`total-${index}`).textContent = formatCurrency(lineTotal);
}

/**
 * Calculate total refund
 */
function calculateRefund() {
    let total = 0;

    if (operationType === 'cancel') {
        total = currentTicket.total;
    } else {
        currentTicket.articles.forEach((article, index) => {
            if (returnItems[index].selected) {
                total += returnItems[index].returnQty * article.price;
            }
        });
    }

    document.getElementById('refundAmount').textContent = formatCurrency(total);

    // Enable/disable validate button
    const hasItems = operationType === 'cancel' ||
                     Object.values(returnItems).some(item => item.selected && item.returnQty > 0);
    document.getElementById('validateBtn').disabled = !hasItems;
}

// ============================================================================
// AUTHORIZATION
// ============================================================================

/**
 * Setup auth PIN inputs
 */
function setupAuthPinInputs() {
    for (let i = 1; i <= 4; i++) {
        const input = document.getElementById(`authPin${i}`);

        input.addEventListener('input', function() {
            if (this.value.length === 1 && i < 4) {
                document.getElementById(`authPin${i + 1}`).focus();
            }
        });

        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && this.value === '' && i > 1) {
                document.getElementById(`authPin${i - 1}`).focus();
            }
        });
    }
}

/**
 * Open authorization modal
 */
function openAuthModal() {
    // Check if motifs are selected for return items
    if (operationType === 'return') {
        let missingMotif = false;
        currentTicket.articles.forEach((article, index) => {
            if (returnItems[index].selected && returnItems[index].returnQty > 0 && !returnItems[index].motif) {
                missingMotif = true;
            }
        });

        if (missingMotif) {
            alert('Veuillez sélectionner un motif pour chaque article à retourner.');
            return;
        }
    }

    // Check general motif
    if (!document.getElementById('generalMotif').value) {
        alert('Veuillez sélectionner un motif général.');
        return;
    }

    document.getElementById('authModal').classList.add('show');
    document.getElementById('authPin1').focus();
}

/**
 * Close authorization modal
 */
function closeAuthModal() {
    document.getElementById('authModal').classList.remove('show');

    // Clear PIN inputs
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`authPin${i}`).value = '';
    }
}

/**
 * Validate return after authorization
 */
function validateReturn() {
    // Get entered PIN
    let pin = '';
    for (let i = 1; i <= 4; i++) {
        pin += document.getElementById(`authPin${i}`).value;
    }

    // Validate PIN (mock: any 4-digit PIN)
    if (pin.length !== 4) {
        alert('Veuillez saisir un code à 4 chiffres.');
        return;
    }

    // Mock validation
    closeAuthModal();

    const refundAmount = document.getElementById('refundAmount').textContent;
    const refundMethod = document.getElementById('refundMethod').value;
    const methodLabel = refundMethod === 'cash' ? 'Espèces' :
                        refundMethod === 'avoir' ? 'Avoir client' : 'Mobile Money';

    const operationLabel = operationType === 'cancel' ? 'ANNULATION' : 'RETOUR';

    alert(`${operationLabel} validé avec succès!\n\n` +
          `Ticket: #${currentTicket.number}\n` +
          `Montant remboursé: ${refundAmount}\n` +
          `Mode: ${methodLabel}\n\n` +
          `Un bon de retour a été généré.`);

    // Redirect back to POS
    window.location.href = './caisse.html';
}

// ============================================================================
// NAVIGATION
// ============================================================================

/**
 * Cancel operation
 */
function cancelOperation() {
    if (confirm('Voulez-vous vraiment annuler cette opération ?')) {
        window.location.href = './caisse.html';
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

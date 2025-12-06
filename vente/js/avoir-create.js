/**
 * MultiFlex GESCOM - Création Avoir Client
 * ECR-FAC-004 : Création d'un avoir client
 */

// ============================================================================
// MOCK DATA
// ============================================================================

const mockSources = {
    'FA-CLI156-2024-00567': {
        type: 'FA',
        number: 'FA-CLI156-2024-00567',
        date: '25/01/2024',
        client: {
            name: 'SONACOM SARL',
            code: 'CLI-2024-00156'
        },
        amount: 456780,
        articles: [
            { code: 'PEINT-BLC-05L', name: 'Peinture Blanche 5L', qtyInvoiced: 20, price: 4200 },
            { code: 'CIMENT-50KG', name: 'Ciment Portland 50kg', qtyInvoiced: 100, price: 7200 },
            { code: 'VIS-6X60-B100', name: 'Vis 6x60 Boîte 100', qtyInvoiced: 50, price: 1200 },
            { code: 'AGGLO-15', name: 'Agglo 15cm', qtyInvoiced: 200, price: 450 }
        ]
    },
    'RET-2024-00045': {
        type: 'RET',
        number: 'RET-2024-00045',
        date: '30/01/2024',
        sourceInvoice: 'FA-CLI156-2024-00235',
        client: {
            name: 'SONACOM SARL',
            code: 'CLI-2024-00156'
        },
        amount: 125000,
        articles: [
            { code: 'PEINT-BLC-05L', name: 'Peinture Blanche 5L', qtyInvoiced: 5, price: 4200 },
            { code: 'VIS-6X60-B100', name: 'Vis 6x60 Boîte 100', qtyInvoiced: 10, price: 1200 }
        ]
    }
};

let currentSource = null;
let avoirItems = {};
let selectedApplication = 'next';

const TVA_RATE = 0.1925;

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Check URL params
    const urlParams = new URLSearchParams(window.location.search);
    const sourceNumber = urlParams.get('source');
    const viewNumber = urlParams.get('view');

    if (sourceNumber) {
        // Load from source (return or invoice)
        loadSource(sourceNumber);
    } else if (viewNumber) {
        // View existing avoir
        loadExistingAvoir(viewNumber);
    } else {
        // Default: load first mock source
        loadSource('FA-CLI156-2024-00567');
    }
});

// ============================================================================
// LOAD SOURCE
// ============================================================================

/**
 * Load source document (invoice or return)
 */
function loadSource(sourceNumber) {
    const source = mockSources[sourceNumber];

    if (!source) {
        // If not found, try to find by return number
        for (const key in mockSources) {
            if (mockSources[key].type === 'RET' && mockSources[key].number === sourceNumber) {
                currentSource = mockSources[key];
                break;
            }
        }
        if (!currentSource) {
            alert(`Document source "${sourceNumber}" non trouvé.`);
            currentSource = mockSources['FA-CLI156-2024-00567'];
        }
    } else {
        currentSource = source;
    }

    // Update source info
    document.getElementById('sourceDoc').textContent = currentSource.number;
    document.getElementById('sourceDate').textContent = currentSource.date;
    document.getElementById('sourceAmount').textContent = formatCurrency(currentSource.amount);
    document.getElementById('clientName').textContent = currentSource.client.name;
    document.getElementById('clientCode').textContent = currentSource.client.code;

    // If source is a return, pre-fill return reference
    if (currentSource.type === 'RET') {
        document.getElementById('returnRef').value = currentSource.number;
        document.getElementById('motifSelect').value = 'return';
    }

    // Initialize avoir items
    currentSource.articles.forEach((article, index) => {
        avoirItems[index] = {
            selected: false,
            qtyAvoir: 0
        };
    });

    // Render articles
    renderArticlesTable();
    calculateTotals();
}

/**
 * Load existing avoir (view mode)
 */
function loadExistingAvoir(number) {
    document.getElementById('avoirNumber').textContent = number;
    // In real app, would load from API
    loadSource('FA-CLI156-2024-00567');
    alert(`Chargement de l'avoir ${number}...`);
}

// ============================================================================
// ARTICLES TABLE
// ============================================================================

/**
 * Render articles table
 */
function renderArticlesTable() {
    const tbody = document.getElementById('articlesTableBody');

    tbody.innerHTML = currentSource.articles.map((article, index) => {
        const item = avoirItems[index];
        const lineTotal = item.qtyAvoir * article.price;

        return `
            <tr>
                <td>
                    <input type="checkbox" class="article-checkbox"
                           id="check-${index}" onchange="toggleArticle(${index})">
                </td>
                <td>
                    <div class="article-info">
                        <span class="article-code">${article.code}</span>
                        <span class="article-name">${article.name}</span>
                    </div>
                </td>
                <td style="text-align: center;">${article.qtyInvoiced}</td>
                <td>
                    <input type="number" class="qty-input" id="qty-${index}"
                           value="${item.qtyAvoir}" min="0" max="${article.qtyInvoiced}"
                           onchange="setQty(${index})" disabled>
                    <span class="qty-max">/ ${article.qtyInvoiced}</span>
                </td>
                <td style="text-align: right;">${formatCurrency(article.price)}</td>
                <td class="line-total" id="total-${index}">${formatCurrency(lineTotal)}</td>
            </tr>
        `;
    }).join('');
}

/**
 * Toggle article selection
 */
function toggleArticle(index) {
    const checkbox = document.getElementById(`check-${index}`);
    const qtyInput = document.getElementById(`qty-${index}`);
    const article = currentSource.articles[index];

    avoirItems[index].selected = checkbox.checked;

    if (checkbox.checked) {
        qtyInput.disabled = false;
        qtyInput.value = article.qtyInvoiced;
        avoirItems[index].qtyAvoir = article.qtyInvoiced;
        updateLineTotal(index);
    } else {
        qtyInput.disabled = true;
        qtyInput.value = 0;
        avoirItems[index].qtyAvoir = 0;
        document.getElementById(`total-${index}`).textContent = '0 XAF';
    }

    calculateTotals();
}

/**
 * Set quantity
 */
function setQty(index) {
    const qtyInput = document.getElementById(`qty-${index}`);
    const maxQty = currentSource.articles[index].qtyInvoiced;
    let qty = parseInt(qtyInput.value) || 0;

    qty = Math.max(0, Math.min(qty, maxQty));
    qtyInput.value = qty;
    avoirItems[index].qtyAvoir = qty;

    updateLineTotal(index);
    calculateTotals();
}

/**
 * Update line total
 */
function updateLineTotal(index) {
    const article = currentSource.articles[index];
    const qty = avoirItems[index].qtyAvoir;
    const total = qty * article.price;

    document.getElementById(`total-${index}`).textContent = formatCurrency(total);
}

// ============================================================================
// TOTALS CALCULATION
// ============================================================================

/**
 * Calculate totals
 */
function calculateTotals() {
    let totalHT = 0;

    currentSource.articles.forEach((article, index) => {
        if (avoirItems[index].selected && avoirItems[index].qtyAvoir > 0) {
            totalHT += avoirItems[index].qtyAvoir * article.price;
        }
    });

    const tva = Math.round(totalHT * TVA_RATE);
    const totalTTC = totalHT + tva;

    document.getElementById('avoirHT').textContent = formatCurrency(totalHT);
    document.getElementById('avoirTVA').textContent = formatCurrency(tva);
    document.getElementById('avoirTTC').textContent = formatCurrency(totalTTC);
}

// ============================================================================
// APPLICATION MODE
// ============================================================================

/**
 * Select application mode
 */
function selectApplication(mode) {
    selectedApplication = mode;

    document.querySelectorAll('.application-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    event.target.closest('.application-option').classList.add('selected');
}

// ============================================================================
// ACTIONS
// ============================================================================

/**
 * Validate avoir
 */
function validateAvoir() {
    // Validate form
    const motif = document.getElementById('motifSelect').value;

    if (!motif) {
        alert('Veuillez sélectionner un motif.');
        return;
    }

    let hasItems = false;
    currentSource.articles.forEach((article, index) => {
        if (avoirItems[index].selected && avoirItems[index].qtyAvoir > 0) {
            hasItems = true;
        }
    });

    if (!hasItems) {
        alert('Veuillez sélectionner au moins un article à créditer.');
        return;
    }

    // Calculate final amount
    let totalHT = 0;
    currentSource.articles.forEach((article, index) => {
        if (avoirItems[index].selected) {
            totalHT += avoirItems[index].qtyAvoir * article.price;
        }
    });
    const totalTTC = totalHT + Math.round(totalHT * TVA_RATE);

    const applicationLabel = {
        'next': 'Sur prochaine facture',
        'refund': 'Remboursement',
        'manual': 'Application manuelle'
    }[selectedApplication];

    if (confirm(`Valider l'avoir ?

Client: ${currentSource.client.name}
Montant TTC: ${formatCurrency(totalTTC)}
Application: ${applicationLabel}`)) {
        alert(`Avoir créé avec succès!

N° Avoir: AV-2024-00090
Montant: ${formatCurrency(totalTTC)}
Mode: ${applicationLabel}`);

        window.location.href = './avoirs-list.html';
    }
}

/**
 * Preview PDF
 */
function preview() {
    alert('Génération de l\'aperçu PDF...');
}

/**
 * Go back
 */
function goBack() {
    if (confirm('Voulez-vous vraiment annuler ? Les modifications seront perdues.')) {
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

/**
 * MultiFlex GESCOM - Création Bon de Retour
 * ECR-RET-002 : Création d'un nouveau bon de retour client
 */

// ============================================================================
// MOCK DATA
// ============================================================================

const mockDocuments = {
    'BL-CLI156-2024-00235': {
        type: 'BL',
        number: 'BL-CLI156-2024-00235',
        date: '29/01/2024',
        client: {
            name: 'SONACOM SARL',
            code: 'CLI-2024-00156',
            initials: 'SS'
        },
        maxReturnDate: '05/02/2024',
        articles: [
            { code: 'PEINT-BLC-05L', name: 'Peinture Blanche 5L', qtyDelivered: 20, price: 4200, available: 20 },
            { code: 'CIMENT-50KG', name: 'Ciment Portland 50kg', qtyDelivered: 100, price: 7200, available: 100 },
            { code: 'VIS-6X60-B100', name: 'Vis 6x60 Boîte 100', qtyDelivered: 50, price: 1200, available: 50 }
        ]
    },
    'FA-CLI089-2024-00567': {
        type: 'FA',
        number: 'FA-CLI089-2024-00567',
        date: '28/01/2024',
        client: {
            name: 'KAMGA Jean Paul',
            code: 'CLI-2024-00089',
            initials: 'KJ'
        },
        maxReturnDate: '04/02/2024',
        articles: [
            { code: 'FER-12MM-6M', name: 'Fer à béton 12mm 6m', qtyDelivered: 50, price: 2850, available: 50 },
            { code: 'AGGLO-15', name: 'Agglo 15cm', qtyDelivered: 200, price: 450, available: 200 }
        ]
    }
};

let currentDocument = null;
let returnItems = {};
let selectedAction = 'avoir';

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Check for URL params
    const urlParams = new URLSearchParams(window.location.search);
    const viewNumber = urlParams.get('view');
    const sourceDoc = urlParams.get('source');
    const blNumber = urlParams.get('bl');
    const faNumber = urlParams.get('facture');

    if (viewNumber) {
        // View mode - load existing return
        loadExistingReturn(viewNumber);
    } else if (sourceDoc || blNumber || faNumber) {
        // Pre-load document from URL parameter
        const docNumber = sourceDoc || blNumber || faNumber;
        document.getElementById('docSearch').value = docNumber;
        setTimeout(() => searchDocument(), 100);
    }

    // Allow Enter key to search
    document.getElementById('docSearch').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchDocument();
        }
    });
});

// ============================================================================
// DOCUMENT SEARCH
// ============================================================================

/**
 * Search for document
 */
function searchDocument() {
    const query = document.getElementById('docSearch').value.trim().toUpperCase();

    if (!query) {
        showNotification('Veuillez saisir un numéro de document', 'warning');
        return;
    }

    // Search in mock data - exact match first
    let doc = mockDocuments[query];

    // If not found, try partial match
    if (!doc) {
        const keys = Object.keys(mockDocuments);
        const matchedKey = keys.find(key => key.includes(query) || query.includes(key.split('-').pop()));
        if (matchedKey) {
            doc = mockDocuments[matchedKey];
        }
    }

    if (doc) {
        loadDocument(doc);
        showNotification(`Document ${doc.number} chargé avec succès`, 'success');
    } else {
        showNotification(`Document "${query}" non trouvé`, 'danger');
        showAvailableDocuments();
    }
}

/**
 * Show available documents for demo
 */
function showAvailableDocuments() {
    const keys = Object.keys(mockDocuments);
    const docList = keys.map(key => {
        const doc = mockDocuments[key];
        return `• ${key} (${doc.client.name})`;
    }).join('\n');

    alert(`Documents disponibles pour test:\n\n${docList}`);
}

/**
 * Load document
 */
function loadDocument(doc) {
    currentDocument = doc;
    returnItems = {};

    // Show client box
    document.getElementById('clientBox').style.display = 'flex';
    document.getElementById('clientInitials').textContent = doc.client.initials;
    document.getElementById('clientName').textContent = doc.client.name;
    document.getElementById('clientCode').textContent = doc.client.code;
    document.getElementById('docNumber').textContent = doc.number;
    document.getElementById('docDate').textContent = `Date ${doc.type === 'BL' ? 'livraison' : 'facture'}: ${doc.date}`;

    // Show other sections
    document.getElementById('returnInfoSection').style.display = 'block';
    document.getElementById('articlesSection').style.display = 'block';
    document.getElementById('actionSection').style.display = 'grid';
    document.getElementById('summarySection').style.display = 'grid';

    // Set today's date for return date
    const returnDateInput = document.getElementById('returnDate');
    if (returnDateInput) {
        returnDateInput.value = new Date().toISOString().split('T')[0];
    }

    // Initialize return items
    doc.articles.forEach((article, index) => {
        returnItems[index] = {
            selected: false,
            qtyReturn: 0,
            motif: '',
            etat: 'neuf'
        };
    });

    // Render articles table
    renderArticlesTable();

    // Calculate initial totals
    calculateTotal();
}

// ============================================================================
// ARTICLES TABLE
// ============================================================================

/**
 * Render articles table
 */
function renderArticlesTable() {
    const tbody = document.getElementById('articlesTableBody');

    tbody.innerHTML = currentDocument.articles.map((article, index) => `
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
            <td style="text-align: center;">${article.qtyDelivered}</td>
            <td>
                <input type="number" class="qty-input" id="qty-${index}"
                       value="0" min="0" max="${article.available}"
                       onchange="setQty(${index})" disabled>
                <span class="qty-max">/ ${article.available}</span>
            </td>
            <td>
                <select class="motif-select" id="motif-${index}" onchange="setMotif(${index})" disabled>
                    <option value="">Sélectionner...</option>
                    <option value="defect">Défaut fabrication</option>
                    <option value="wrong">Non conforme</option>
                    <option value="damaged">Endommagé</option>
                    <option value="expired">Périmé</option>
                </select>
            </td>
            <td>
                <div class="etat-options" id="etat-${index}">
                    <span class="etat-option ${returnItems[index].etat === 'neuf' ? 'selected' : ''}"
                          onclick="setEtat(${index}, 'neuf')">Neuf</span>
                    <span class="etat-option ${returnItems[index].etat === 'endommage' ? 'selected' : ''}"
                          onclick="setEtat(${index}, 'endommage')">Endommagé</span>
                    <span class="etat-option ${returnItems[index].etat === 'perime' ? 'selected' : ''}"
                          onclick="setEtat(${index}, 'perime')">Périmé</span>
                </div>
            </td>
            <td class="line-total" id="total-${index}">0 XAF</td>
        </tr>
    `).join('');
}

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
        returnItems[index].qtyReturn = 1;
        updateLineTotal(index);
    } else {
        qtyInput.disabled = true;
        motifSelect.disabled = true;
        qtyInput.value = 0;
        returnItems[index].qtyReturn = 0;
        returnItems[index].motif = '';
        motifSelect.value = '';
        document.getElementById(`total-${index}`).textContent = '0 XAF';
    }

    calculateTotal();
}

/**
 * Set quantity
 */
function setQty(index) {
    const qtyInput = document.getElementById(`qty-${index}`);
    const maxQty = currentDocument.articles[index].available;
    let qty = parseInt(qtyInput.value) || 0;

    qty = Math.max(0, Math.min(qty, maxQty));
    qtyInput.value = qty;
    returnItems[index].qtyReturn = qty;

    updateLineTotal(index);
    calculateTotal();
}

/**
 * Set motif
 */
function setMotif(index) {
    returnItems[index].motif = document.getElementById(`motif-${index}`).value;
}

/**
 * Set etat
 */
function setEtat(index, etat) {
    if (!returnItems[index].selected) return;

    returnItems[index].etat = etat;

    // Update UI
    document.querySelectorAll(`#etat-${index} .etat-option`).forEach(opt => {
        opt.classList.remove('selected');
    });
    event.target.classList.add('selected');
}

/**
 * Update line total
 */
function updateLineTotal(index) {
    const article = currentDocument.articles[index];
    const qty = returnItems[index].qtyReturn;
    const total = qty * article.price;

    document.getElementById(`total-${index}`).textContent = formatCurrency(total);
}

/**
 * Calculate total
 */
function calculateTotal() {
    let total = 0;
    let count = 0;

    currentDocument.articles.forEach((article, index) => {
        if (returnItems[index].selected && returnItems[index].qtyReturn > 0) {
            total += returnItems[index].qtyReturn * article.price;
            count++;
        }
    });

    document.getElementById('totalAmount').textContent = formatCurrency(total);
    document.getElementById('avoirAmount').textContent = formatCurrency(total);
    document.getElementById('summaryDetail').textContent = `${count} article(s) sélectionné(s)`;
}

// ============================================================================
// ACTION SELECTION
// ============================================================================

/**
 * Select action
 */
function selectAction(action) {
    selectedAction = action;

    document.querySelectorAll('.action-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    event.target.closest('.action-option').classList.add('selected');
}

// ============================================================================
// PHOTOS
// ============================================================================

/**
 * Add photo
 */
function addPhoto(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const container = document.querySelector('.photos-grid');

            // Create photo preview
            const photoDiv = document.createElement('div');
            photoDiv.style.cssText = `
                width: 100px;
                height: 100px;
                border-radius: 10px;
                overflow: hidden;
                position: relative;
            `;
            photoDiv.innerHTML = `
                <img src="${e.target.result}" style="width: 100%; height: 100%; object-fit: cover;">
                <button onclick="this.parentElement.remove()" style="
                    position: absolute;
                    top: 4px;
                    right: 4px;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: #DC2626;
                    color: white;
                    border: none;
                    cursor: pointer;
                    font-size: 12px;
                ">×</button>
            `;

            container.insertBefore(photoDiv, container.lastElementChild);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// ============================================================================
// ACTIONS
// ============================================================================

/**
 * Validate return
 */
function validateReturn() {
    // Validate form
    let hasItems = false;
    let missingMotif = false;

    currentDocument.articles.forEach((article, index) => {
        if (returnItems[index].selected && returnItems[index].qtyReturn > 0) {
            hasItems = true;
            if (!returnItems[index].motif) {
                missingMotif = true;
            }
        }
    });

    if (!hasItems) {
        alert('Veuillez sélectionner au moins un article à retourner.');
        return;
    }

    if (missingMotif) {
        alert('Veuillez sélectionner un motif pour chaque article.');
        return;
    }

    // Calculate total
    let total = 0;
    currentDocument.articles.forEach((article, index) => {
        if (returnItems[index].selected) {
            total += returnItems[index].qtyReturn * article.price;
        }
    });

    const actionLabel = selectedAction === 'avoir' ? 'Avoir client' :
                        selectedAction === 'exchange' ? 'Échange standard' : 'Réparation';

    if (confirm(`Valider le bon de retour ?\n\nClient: ${currentDocument.client.name}\nMontant: ${formatCurrency(total)}\nAction: ${actionLabel}`)) {
        alert('Bon de retour créé avec succès!\n\n' +
              `N° Retour: RET-2024-00045\n` +
              `Montant: ${formatCurrency(total)}\n\n` +
              (selectedAction === 'avoir' ? 'Un avoir sera généré après validation.' : ''));

        window.location.href = './retours-list.html';
    }
}

/**
 * Save draft
 */
function saveDraft() {
    alert('Brouillon enregistré avec succès!');
}

/**
 * Go back
 */
function goBack() {
    if (confirm('Voulez-vous vraiment annuler ? Les modifications seront perdues.')) {
        window.location.href = './retours-list.html';
    }
}

/**
 * Load existing return (view mode)
 */
function loadExistingReturn(number) {
    // In real app, would load from API
    document.getElementById('returnNumber').textContent = number;
    alert(`Chargement du retour ${number}...`);
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
 * Show notification
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotif = document.querySelector('.notification-toast');
    if (existingNotif) existingNotif.remove();

    const notification = document.createElement('div');
    notification.className = 'notification-toast';

    const bgColors = {
        success: '#D1FAE5',
        warning: '#FEF3C7',
        danger: '#FEE2E2',
        info: '#DBEAFE'
    };

    const textColors = {
        success: '#065F46',
        warning: '#92400E',
        danger: '#991B1B',
        info: '#1E40AF'
    };

    const icons = {
        success: 'fa-check-circle',
        warning: 'fa-exclamation-triangle',
        danger: 'fa-times-circle',
        info: 'fa-info-circle'
    };

    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        padding: 14px 18px;
        border-radius: 8px;
        background: ${bgColors[type]};
        color: ${textColors[type]};
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 14px;
        font-weight: 500;
        animation: slideInRight 0.3s ease;
    `;

    notification.innerHTML = `
        <i class="fa-solid ${icons[type]}"></i>
        <span>${message}</span>
    `;

    // Add animation styles if not exist
    if (!document.getElementById('notification-animation-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-animation-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

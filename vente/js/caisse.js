/**
 * MultiFlex GESCOM - Point de Vente (POS)
 * Module Ventes - ECR-POS-003
 */

// =====================================================
// MOCK DATA
// =====================================================

const mockArticles = [
    { code: 'PEINT-BLC-05L', name: 'Peinture Blanche 5L', description: 'Latex Mat', category: 'peinture', stock: 125, price: 4500, tva: 19.25 },
    { code: 'PEINT-BLC-20L', name: 'Peinture Blanche 20L', description: 'Latex Mat', category: 'peinture', stock: 45, price: 16000, tva: 19.25 },
    { code: 'PEINT-JAU-05L', name: 'Peinture Jaune 5L', description: 'Latex Satin', category: 'peinture', stock: 78, price: 4800, tva: 19.25 },
    { code: 'CIMENT-32.5', name: 'Ciment CEM I 32.5 R', description: 'Sac 50kg - Prise rapide', category: 'ciment', stock: 234, price: 6500, tva: 19.25 },
    { code: 'CIMENT-42.5', name: 'Ciment CEM II 42.5 N', description: 'Sac 50kg - Standard', category: 'ciment', stock: 450, price: 6800, tva: 19.25 },
    { code: 'CIMENT-52.5', name: 'Ciment CEM I 52.5 R', description: 'Sac 50kg - Haute perf.', category: 'ciment', stock: 89, price: 7200, tva: 19.25 },
    { code: 'CIMENT-BLANC', name: 'Ciment blanc décoratif', description: 'Sac 25kg', category: 'ciment', stock: 45, price: 9500, tva: 19.25 },
    { code: 'FER-10MM', name: 'Fer à béton HA 10mm', description: 'Barre 12m', category: 'fer', stock: 320, price: 3800, tva: 19.25 },
    { code: 'FER-12MM', name: 'Fer à béton HA 12mm', description: 'Barre 12m', category: 'fer', stock: 280, price: 4500, tva: 19.25 },
    { code: 'FER-14MM', name: 'Fer à béton HA 14mm', description: 'Barre 12m', category: 'fer', stock: 150, price: 5200, tva: 19.25 },
    { code: 'VIS-6X60-B100', name: 'Vis 6x60 Boîte 100', description: 'Vis bois zinguée', category: 'visserie', stock: 456, price: 1200, tva: 19.25 },
    { code: 'VIS-8X80-B50', name: 'Vis 8x80 Boîte 50', description: 'Vis bois zinguée', category: 'visserie', stock: 234, price: 1500, tva: 19.25 },
    { code: 'CLOU-80MM-KG', name: 'Clou tête plate 80mm', description: 'Par kg', category: 'visserie', stock: 89, price: 2500, tva: 19.25 },
    { code: 'GANTS-TRAV-L', name: 'Gants travail L', description: 'Paire - Taille L', category: 'divers', stock: 67, price: 2500, tva: 19.25 },
    { code: 'AGGLO-15', name: 'Agglo creux 15cm', description: 'Unité', category: 'agglos', stock: 1200, price: 450, tva: 19.25 },
    { code: 'AGGLO-20', name: 'Agglo creux 20cm', description: 'Unité', category: 'agglos', stock: 800, price: 550, tva: 19.25 }
];

const mockClients = [
    { id: 'CLI001', name: 'KAMGA Jean Paul', type: 'Particulier', cni: '123456789012345', phone: '655 234 567' },
    { id: 'CLI002', name: 'SONACOM SARL', type: 'Entreprise', nui: 'P087201234567W', phone: '699 123 456' },
    { id: 'CLI003', name: 'MBARGA Pierre', type: 'Particulier', cni: '987654321098765', phone: '677 890 123' }
];

// =====================================================
// STATE
// =====================================================

let state = {
    sessionNumber: 'POS-2024-0089',
    ticketNumber: 24,
    cart: [],
    currentClient: mockClients[0],
    clientType: 'registered',
    requestInvoice: false,
    paymentMethod: 'cash',
    selectedOperator: null,
    discount: 0,
    totals: {
        subtotalHT: 0,
        tva: 0,
        totalTTC: 0
    },
    heldTickets: []
};

// =====================================================
// INITIALIZATION
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
    updateTime();
    setInterval(updateTime, 1000);
    renderCart();
    loadSearchResults();
    setupKeyboardShortcuts();

    // Add some demo items
    addToCart('PEINT-BLC-05L', 2);
    addToCart('CIMENT-42.5', 5);
    addToCart('VIS-6X60-B100', 3);
    addToCart('GANTS-TRAV-L', 1);
});

function updateTime() {
    const now = new Date();
    document.getElementById('currentTime').textContent = now.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F1') { e.preventDefault(); openSearchModal(); }
        if (e.key === 'F2') { e.preventDefault(); openClientModal(); }
        if (e.key === 'F3') { e.preventDefault(); applyManualDiscount(); }
        if (e.key === 'F4') { e.preventDefault(); holdTicket(); }
        if (e.key === 'F5') { e.preventDefault(); recallTicket(); }
        if (e.key === 'F6') { e.preventDefault(); processReturn(); }
        if (e.key === 'F7') { e.preventDefault(); cancelTicket(); }
        if (e.key === 'F8') { e.preventDefault(); openDrawer(); }
        if (e.key === 'F9') { e.preventDefault(); showHistory(); }
        if (e.key === 'F10') { e.preventDefault(); openPaymentModal(); }
        if (e.key === 'Escape') { closeAllModals(); }
    });
}

// =====================================================
// CART MANAGEMENT
// =====================================================

function handleBarcodeInput(event) {
    if (event.key === 'Enter') {
        const code = event.target.value.trim().toUpperCase();
        if (code) {
            const article = mockArticles.find(a => a.code === code);
            if (article) {
                addToCart(code, 1);
                event.target.value = '';
            } else {
                showNotification('Article non trouvé', 'warning');
            }
        }
    }
}

function addToCart(code, qty = 1) {
    const article = mockArticles.find(a => a.code === code);
    if (!article) return;

    const existingItem = state.cart.find(item => item.code === code);
    if (existingItem) {
        existingItem.qty += qty;
    } else {
        state.cart.push({
            code: article.code,
            name: article.name,
            price: article.price,
            qty: qty,
            tva: article.tva
        });
    }

    renderCart();
    calculateTotals();
}

function updateQuantity(code, delta) {
    const item = state.cart.find(i => i.code === code);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
            removeFromCart(code);
        } else {
            renderCart();
            calculateTotals();
        }
    }
}

function removeFromCart(code) {
    state.cart = state.cart.filter(item => item.code !== code);
    renderCart();
    calculateTotals();
}

function renderCart() {
    const container = document.getElementById('cartItems');

    if (state.cart.length === 0) {
        container.innerHTML = `
            <div class="cart-empty">
                <i class="fa-solid fa-shopping-cart"></i>
                <div>Panier vide</div>
                <div style="font-size: 12px;">Scannez ou recherchez un article</div>
            </div>
        `;
        return;
    }

    container.innerHTML = state.cart.map(item => `
        <div class="cart-item">
            <div class="item-info">
                <div class="item-code">${item.code}</div>
                <div class="item-name">${item.name}</div>
            </div>
            <div class="item-qty">
                <button class="qty-btn" onclick="updateQuantity('${item.code}', -1)">-</button>
                <span class="qty-value">${item.qty}</span>
                <button class="qty-btn" onclick="updateQuantity('${item.code}', 1)">+</button>
            </div>
            <div class="item-price">${formatMoney(item.price)}</div>
            <div class="item-total">${formatMoney(item.price * item.qty)}</div>
            <button class="item-delete" onclick="removeFromCart('${item.code}')">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `).join('');

    // Update footer
    const totalQty = state.cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('totalArticles').textContent = state.cart.length;
    document.getElementById('totalQty').textContent = totalQty;
}

function calculateTotals() {
    let totalTTC = 0;

    state.cart.forEach(item => {
        totalTTC += item.price * item.qty;
    });

    // Apply discount
    if (state.discount > 0) {
        totalTTC = totalTTC * (1 - state.discount / 100);
    }

    const subtotalHT = totalTTC / 1.1925;
    const tva = totalTTC - subtotalHT;

    state.totals = {
        subtotalHT,
        tva,
        totalTTC
    };

    document.getElementById('subtotalHT').textContent = formatMoney(subtotalHT);
    document.getElementById('totalVAT').textContent = formatMoney(tva);
    document.getElementById('totalTTC').textContent = `${formatMoney(totalTTC)} XAF`;
}

function toggleDiscount() {
    const checkbox = document.getElementById('applyDiscount');
    const input = document.getElementById('discountPercent');
    input.disabled = !checkbox.checked;

    if (!checkbox.checked) {
        input.value = 0;
        state.discount = 0;
        calculateTotals();
    }
}

// =====================================================
// CLIENT MANAGEMENT
// =====================================================

function selectClientType(type) {
    state.clientType = type;

    document.getElementById('btnPassage').classList.toggle('active', type === 'passage');
    document.getElementById('btnEnregistre').classList.toggle('active', type === 'registered');

    if (type === 'passage') {
        state.currentClient = null;
        document.getElementById('clientInfo').innerHTML = `
            <div class="client-name">Client de passage</div>
            <div class="client-detail">
                <i class="fa-solid fa-user"></i>
                <span>Non identifié</span>
            </div>
        `;
    } else if (state.currentClient) {
        updateClientDisplay();
    }
}

function searchClient() {
    const query = document.getElementById('clientSearch').value.toLowerCase();
    const client = mockClients.find(c =>
        c.name.toLowerCase().includes(query) ||
        (c.cni && c.cni.includes(query)) ||
        c.phone.includes(query)
    );

    if (client) {
        state.currentClient = client;
        state.clientType = 'registered';
        document.getElementById('btnEnregistre').classList.add('active');
        document.getElementById('btnPassage').classList.remove('active');
        updateClientDisplay();
        showNotification(`Client trouvé: ${client.name}`, 'success');
    } else {
        showNotification('Client non trouvé', 'warning');
    }
}

function updateClientDisplay() {
    const client = state.currentClient;
    if (!client) return;

    document.getElementById('clientName').textContent = client.name;
    document.getElementById('clientType').textContent = client.type;
    document.getElementById('clientCNI').textContent = client.cni ? `CNI: ${client.cni}` : `NUI: ${client.nui}`;
    document.getElementById('clientPhone').textContent = client.phone;
}

function toggleInvoiceRequest() {
    state.requestInvoice = document.getElementById('requestInvoice').checked;
}

// =====================================================
// PAYMENT
// =====================================================

function selectPaymentMethod(method) {
    state.paymentMethod = method;

    document.querySelectorAll('.payment-option').forEach(opt => {
        const radio = opt.querySelector('input[type="radio"]');
        opt.classList.toggle('active', radio.value === method);
    });
}

function openPaymentModal() {
    if (state.cart.length === 0) {
        showNotification('Panier vide', 'warning');
        return;
    }

    if (state.paymentMethod === 'mobile') {
        openMobileMoneyModal();
        return;
    }

    // Update payment modal
    document.getElementById('modalTicketNumber').textContent = String(state.ticketNumber).padStart(4, '0');
    document.getElementById('paymentAmount').textContent = `${formatMoney(state.totals.totalTTC)} XAF`;

    // Client info
    if (state.currentClient) {
        document.getElementById('paymentClientName').textContent = `Client: ${state.currentClient.name}`;
        document.getElementById('paymentClientCNI').textContent =
            state.currentClient.cni ? `CNI: ${state.currentClient.cni}` : `NUI: ${state.currentClient.nui}`;
    } else {
        document.getElementById('paymentClientName').textContent = 'Client: De passage';
        document.getElementById('paymentClientCNI').textContent = '';
    }
    document.getElementById('paymentInvoiceStatus').textContent =
        `Facture demandée: ${state.requestInvoice ? 'OUI' : 'NON'}`;

    // Cash limit warning
    const cashLimitWarning = document.getElementById('cashLimitWarning');
    if (state.paymentMethod === 'cash') {
        cashLimitWarning.style.display = 'flex';
        document.getElementById('limitStatus').textContent =
            state.totals.totalTTC <= 100000 ? 'Montant OK ✅' : 'Dépassé ⚠️';
    } else {
        cashLimitWarning.style.display = 'none';
    }

    // Articles list
    document.getElementById('paymentArticlesList').innerHTML = state.cart.map(item =>
        `<div style="padding: 4px 0;">• ${item.name} (${item.qty})</div>`
    ).join('') + `<div style="font-weight: 600; margin-top: 8px;">Total: ${state.cart.reduce((s, i) => s + i.qty, 0)} articles</div>`;

    // Reset received amount
    document.getElementById('receivedAmount').value = '';
    calculateChange();

    document.getElementById('paymentModal').classList.add('show');
}

function closePaymentModal() {
    document.getElementById('paymentModal').classList.remove('show');
}

function addBill(amount) {
    const input = document.getElementById('receivedAmount');
    const current = parseInt(input.value) || 0;
    input.value = current + amount;
    calculateChange();
}

function setQuickAmount(amount) {
    const input = document.getElementById('receivedAmount');
    const current = parseInt(input.value) || 0;
    input.value = current + amount;
    calculateChange();
}

function calculateChange() {
    const received = parseInt(document.getElementById('receivedAmount').value) || 0;
    const change = received - state.totals.totalTTC;

    document.getElementById('changeAmount').textContent = `${formatMoney(Math.max(0, change))} XAF`;

    const changeBox = document.getElementById('changeBox');
    const suggestionDiv = document.getElementById('changeSuggestion');

    if (change > 0) {
        changeBox.style.background = '#D1FAE5';
        changeBox.style.borderColor = '#059669';

        // Calculate change suggestion
        suggestionDiv.style.display = 'block';
        document.getElementById('changeSuggestionList').innerHTML = getChangeSuggestion(change);
    } else if (change === 0) {
        changeBox.style.background = '#D1FAE5';
        changeBox.style.borderColor = '#059669';
        suggestionDiv.style.display = 'none';
    } else {
        changeBox.style.background = '#FEE2E2';
        changeBox.style.borderColor = '#DC2626';
        suggestionDiv.style.display = 'none';
    }
}

function getChangeSuggestion(amount) {
    const denominations = [10000, 5000, 2000, 1000, 500, 100, 50, 25, 10, 5, 1];
    const result = [];
    let remaining = amount;

    for (const denom of denominations) {
        if (remaining >= denom) {
            const count = Math.floor(remaining / denom);
            remaining = remaining % denom;
            result.push(`<span class="change-coin">${count} x ${formatMoney(denom)}</span>`);
        }
    }

    return result.join('');
}

function validatePayment() {
    const received = parseInt(document.getElementById('receivedAmount').value) || 0;

    if (received < state.totals.totalTTC) {
        showNotification('Montant insuffisant', 'danger');
        return;
    }

    // Simulate payment validation
    showNotification('Paiement validé - Impression du ticket...', 'success');

    setTimeout(() => {
        // Reset for next ticket
        state.cart = [];
        state.ticketNumber++;
        document.getElementById('ticketNumber').textContent = String(state.ticketNumber).padStart(4, '0');
        renderCart();
        calculateTotals();
        closePaymentModal();
        document.getElementById('barcodeInput').focus();
    }, 1500);
}

// =====================================================
// MOBILE MONEY
// =====================================================

function openMobileMoneyModal() {
    document.getElementById('mmPaymentAmount').textContent = `${formatMoney(state.totals.totalTTC)} XAF`;
    document.getElementById('mmInstructionAmount').textContent = `${formatMoney(state.totals.totalTTC)} XAF`;

    if (state.currentClient) {
        document.getElementById('mmPhone').value = state.currentClient.phone;
    }

    document.getElementById('mobileMoneyModal').classList.add('show');
}

function closeMobileMoneyModal() {
    document.getElementById('mobileMoneyModal').classList.remove('show');
}

function selectOperator(operator) {
    state.selectedOperator = operator;

    document.querySelectorAll('.operator-card').forEach(card => {
        card.classList.toggle('selected', card.dataset.operator === operator);
    });

    // Update instructions based on operator
    const instructions = {
        orange: '*150*14#',
        mtn: '*126*1#',
        express: '*505#'
    };

    document.querySelector('#mmInstructions ol li:first-child').textContent =
        `Client compose ${instructions[operator] || '*150*14#'} sur son téléphone`;
}

function checkMobileStatus() {
    showNotification('Vérification en cours...', 'info');
    // Simulate check
    setTimeout(() => {
        showNotification('En attente de confirmation du client', 'warning');
    }, 1000);
}

function confirmMobilePayment() {
    const transRef = document.getElementById('mmTransactionRef').value;

    if (!transRef) {
        showNotification('Veuillez entrer la référence de transaction', 'warning');
        return;
    }

    showNotification('Paiement Mobile Money confirmé!', 'success');

    setTimeout(() => {
        state.cart = [];
        state.ticketNumber++;
        document.getElementById('ticketNumber').textContent = String(state.ticketNumber).padStart(4, '0');
        renderCart();
        calculateTotals();
        closeMobileMoneyModal();
    }, 1500);
}

function switchToMixedPayment() {
    closeMobileMoneyModal();
    selectPaymentMethod('mixed');
    showNotification('Mode paiement mixte activé', 'info');
}

// =====================================================
// SEARCH MODAL
// =====================================================

function openSearchModal() {
    loadSearchResults();
    document.getElementById('searchModal').classList.add('show');
    document.getElementById('searchQuery').focus();
}

function closeSearchModal() {
    document.getElementById('searchModal').classList.remove('show');
    document.getElementById('barcodeInput').focus();
}

function loadSearchResults() {
    filterArticles();
}

function filterArticles() {
    const query = (document.getElementById('searchQuery')?.value || '').toLowerCase();
    const category = document.getElementById('searchCategory')?.value || '';
    const stockOnly = document.getElementById('stockOnly')?.checked ?? true;

    let filtered = mockArticles.filter(article => {
        const matchQuery = !query ||
            article.code.toLowerCase().includes(query) ||
            article.name.toLowerCase().includes(query);
        const matchCategory = !category || article.category === category;
        const matchStock = !stockOnly || article.stock > 0;

        return matchQuery && matchCategory && matchStock;
    });

    document.getElementById('resultsCount').textContent = filtered.length;

    const container = document.getElementById('searchResultsList');
    container.innerHTML = filtered.map(article => `
        <div class="search-result-item">
            <div class="result-code">${article.code}</div>
            <div class="result-name">
                ${article.name}
                <small>${article.description}</small>
            </div>
            <div class="result-stock">${article.stock} <small>unités</small></div>
            <div class="result-price">${formatMoney(article.price)} XAF</div>
            <div class="result-actions">
                <button class="result-add-btn" onclick="addFromSearch('${article.code}')">
                    <i class="fa-solid fa-plus"></i> Ajouter
                </button>
            </div>
        </div>
    `).join('');
}

function addFromSearch(code) {
    addToCart(code, 1);
    showNotification('Article ajouté au panier', 'success');
}

// =====================================================
// FUNCTION KEYS ACTIONS
// =====================================================

function openClientModal() {
    document.getElementById('clientSearch').focus();
    showNotification('Recherche client activée', 'info');
}

function applyManualDiscount() {
    const percent = prompt('Pourcentage de remise:', '0');
    if (percent !== null) {
        const value = parseFloat(percent) || 0;
        if (value >= 0 && value <= 100) {
            state.discount = value;
            document.getElementById('applyDiscount').checked = value > 0;
            document.getElementById('discountPercent').value = value;
            document.getElementById('discountPercent').disabled = value === 0;
            calculateTotals();
            showNotification(`Remise de ${value}% appliquée`, 'success');
        }
    }
}

function holdTicket() {
    if (state.cart.length === 0) {
        showNotification('Panier vide', 'warning');
        return;
    }

    state.heldTickets.push({
        ticketNumber: state.ticketNumber,
        cart: [...state.cart],
        client: state.currentClient,
        totals: { ...state.totals }
    });

    state.cart = [];
    state.ticketNumber++;
    document.getElementById('ticketNumber').textContent = String(state.ticketNumber).padStart(4, '0');
    renderCart();
    calculateTotals();

    showNotification(`Ticket mis en attente (${state.heldTickets.length} en attente)`, 'success');
}

function recallTicket() {
    if (state.heldTickets.length === 0) {
        showNotification('Aucun ticket en attente', 'warning');
        return;
    }

    const ticket = state.heldTickets.pop();
    state.cart = ticket.cart;
    state.currentClient = ticket.client;

    renderCart();
    calculateTotals();
    updateClientDisplay();

    showNotification(`Ticket ${String(ticket.ticketNumber).padStart(4, '0')} rappelé`, 'success');
}

function processReturn() {
    showNotification('Fonction Retour - En développement', 'info');
}

function cancelTicket() {
    if (state.cart.length === 0) {
        showNotification('Panier déjà vide', 'warning');
        return;
    }

    if (confirm('Voulez-vous vraiment annuler ce ticket ?')) {
        state.cart = [];
        renderCart();
        calculateTotals();
        showNotification('Ticket annulé', 'success');
    }
}

function openDrawer() {
    showNotification('Ouverture du tiroir-caisse...', 'info');
}

function showHistory() {
    showNotification('Historique des ventes - En développement', 'info');
}

function addFavorite(category) {
    openSearchModal();
    document.getElementById('searchCategory').value = category;
    filterArticles();
}

function closeAllModals() {
    document.getElementById('paymentModal').classList.remove('show');
    document.getElementById('mobileMoneyModal').classList.remove('show');
    document.getElementById('searchModal').classList.remove('show');
}

// =====================================================
// NAVIGATION
// =====================================================

function goToMenu() {
    if (state.cart.length > 0) {
        if (!confirm('Vous avez des articles dans le panier. Voulez-vous vraiment quitter ?\n\nLe panier sera conservé pour cette session.')) {
            return;
        }
    }
    window.location.href = './dashboard.html';
}

function confirmExit() {
    if (state.cart.length > 0) {
        if (!confirm('Attention: Vous avez des articles dans le panier!\n\nPour quitter proprement, veuillez:\n1. Terminer ou annuler la vente en cours\n2. Effectuer la clôture de caisse\n\nVoulez-vous vraiment quitter sans clôturer ?')) {
            return;
        }
    } else {
        if (!confirm('Voulez-vous quitter la caisse ?\n\nPour une fermeture propre, utilisez le bouton "Clôture" pour fermer votre session.')) {
            return;
        }
    }
    window.location.href = './caisse-ouverture.html';
}

// =====================================================
// UTILITIES
// =====================================================

function formatMoney(amount) {
    return new Intl.NumberFormat('fr-FR').format(Math.round(amount));
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');

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
        z-index: 3000;
        min-width: 280px;
        padding: 12px 16px;
        border-radius: 8px;
        background: ${bgColors[type]};
        color: ${textColors[type]};
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 13px;
        animation: slideIn 0.3s ease;
    `;

    notification.innerHTML = `
        <i class="fa-solid ${icons[type]}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

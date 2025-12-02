// ================================================
// COMMANDES-VALIDATION.JS
// Gestion de la validation des commandes crédit
// Conforme au wireframe ECR-CMD-002
// ================================================

// État global
let currentIndex = 0;
let currentFilter = 'all';

// Données simulées des commandes en attente de validation
const pendingOrders = [
    {
        id: 1,
        ref: 'BC-CLI445-2024-00234',
        amount: 5500000,
        clientCode: 'CLI-2024-00445',
        clientName: 'ENTREPRISE XYZ',
        commercialCode: 'COM-018',
        commercialName: 'Jean FOTSO',
        createdAt: '28/01/2024 16:30',
        createdAgo: 'Il y a 2 heures',
        deliveryDate: '02/02/2024',
        daysToDelivery: 5,
        urgent: true,
        isNewClient: false,
        // Credit analysis
        creditLimit: 8000000,
        currentOutstanding: 3200000,
        outstandingPercent: 40,
        creditAvailable: 4800000,
        creditExcess: 700000,
        hasCreditExcess: true,
        // Caution analysis
        cautionRequired: 3850000,
        cautionAvailable: 2100000,
        cautionDeficit: 1750000,
        hasCautionDeficit: true,
        // Client history
        clientSince: '15/03/2023',
        clientMonths: 10,
        totalOrders: 45,
        totalOrdersAmount: 67890000,
        paymentRate: 92,
        lastOrderDate: '15/01/2024',
        lastOrderAmount: 1250000,
        lastOrderPaid: true,
        incidents: [
            { type: 'late', description: '1 retard > 30j en Oct 2023' }
        ]
    },
    {
        id: 2,
        ref: 'BC-CLI312-2024-00567',
        amount: 3200000,
        clientCode: 'CLI-2024-00312',
        clientName: 'TECHNI-BUILD',
        commercialCode: 'COM-018',
        commercialName: 'Jean FOTSO',
        createdAt: '28/01/2024 14:00',
        createdAgo: 'Il y a 4 heures',
        deliveryDate: '05/02/2024',
        daysToDelivery: 8,
        urgent: false,
        isNewClient: false,
        creditLimit: 5000000,
        currentOutstanding: 2800000,
        outstandingPercent: 56,
        creditAvailable: 2200000,
        creditExcess: 1000000,
        hasCreditExcess: true,
        cautionRequired: 2240000,
        cautionAvailable: 1500000,
        cautionDeficit: 740000,
        hasCautionDeficit: true,
        clientSince: '10/06/2022',
        clientMonths: 19,
        totalOrders: 78,
        totalOrdersAmount: 125000000,
        paymentRate: 85,
        lastOrderDate: '20/01/2024',
        lastOrderAmount: 890000,
        lastOrderPaid: true,
        incidents: []
    },
    {
        id: 3,
        ref: 'BC-CLI678-2024-00123',
        amount: 2500000,
        clientCode: 'CLI-2024-00678',
        clientName: 'MENUISERIE PRO',
        commercialCode: 'COM-025',
        commercialName: 'Marie DJOMO',
        createdAt: '28/01/2024 11:30',
        createdAgo: 'Il y a 6 heures',
        deliveryDate: '30/01/2024',
        daysToDelivery: 2,
        urgent: true,
        isNewClient: false,
        creditLimit: 4000000,
        currentOutstanding: 1200000,
        outstandingPercent: 30,
        creditAvailable: 2800000,
        creditExcess: 0,
        hasCreditExcess: false,
        cautionRequired: 1750000,
        cautionAvailable: 2000000,
        cautionDeficit: 0,
        hasCautionDeficit: false,
        clientSince: '05/01/2024',
        clientMonths: 1,
        totalOrders: 3,
        totalOrdersAmount: 4500000,
        paymentRate: 100,
        lastOrderDate: '15/01/2024',
        lastOrderAmount: 1500000,
        lastOrderPaid: true,
        incidents: []
    },
    {
        id: 4,
        ref: 'BC-CLI999-2024-00789',
        amount: 1800000,
        clientCode: 'CLI-2024-00999',
        clientName: 'NOUVELLE ENTREPRISE SARL',
        commercialCode: 'COM-032',
        commercialName: 'Paul NGA',
        createdAt: '28/01/2024 09:00',
        createdAgo: 'Il y a 9 heures',
        deliveryDate: '03/02/2024',
        daysToDelivery: 6,
        urgent: false,
        isNewClient: true,
        creditLimit: 2000000,
        currentOutstanding: 0,
        outstandingPercent: 0,
        creditAvailable: 2000000,
        creditExcess: 0,
        hasCreditExcess: false,
        cautionRequired: 1260000,
        cautionAvailable: 1500000,
        cautionDeficit: 0,
        hasCautionDeficit: false,
        clientSince: '25/01/2024',
        clientMonths: 0,
        totalOrders: 0,
        totalOrdersAmount: 0,
        paymentRate: null,
        lastOrderDate: null,
        lastOrderAmount: null,
        lastOrderPaid: null,
        incidents: []
    },
    {
        id: 5,
        ref: 'BC-CLI156-2024-00456',
        amount: 4200000,
        clientCode: 'CLI-2024-00156',
        clientName: 'SONACOM SARL',
        commercialCode: 'COM-025',
        commercialName: 'Marie DJOMO',
        createdAt: '27/01/2024 17:00',
        createdAgo: 'Il y a 1 jour',
        deliveryDate: '01/02/2024',
        daysToDelivery: 4,
        urgent: true,
        isNewClient: false,
        creditLimit: 5000000,
        currentOutstanding: 2500000,
        outstandingPercent: 50,
        creditAvailable: 2500000,
        creditExcess: 1700000,
        hasCreditExcess: true,
        cautionRequired: 2940000,
        cautionAvailable: 3500000,
        cautionDeficit: 0,
        hasCautionDeficit: false,
        clientSince: '15/01/2024',
        clientMonths: 0,
        totalOrders: 8,
        totalOrdersAmount: 18500000,
        paymentRate: 100,
        lastOrderDate: '25/01/2024',
        lastOrderAmount: 2500000,
        lastOrderPaid: false,
        incidents: []
    },
    {
        id: 6,
        ref: 'BC-CLI234-2024-00321',
        amount: 6500000,
        clientCode: 'CLI-2024-00234',
        clientName: 'BATIMENT PLUS',
        commercialCode: 'COM-018',
        commercialName: 'Jean FOTSO',
        createdAt: '27/01/2024 14:30',
        createdAgo: 'Il y a 1 jour',
        deliveryDate: '10/02/2024',
        daysToDelivery: 13,
        urgent: false,
        isNewClient: false,
        creditLimit: 10000000,
        currentOutstanding: 4500000,
        outstandingPercent: 45,
        creditAvailable: 5500000,
        creditExcess: 1000000,
        hasCreditExcess: true,
        cautionRequired: 4550000,
        cautionAvailable: 4000000,
        cautionDeficit: 550000,
        hasCautionDeficit: true,
        clientSince: '20/05/2022',
        clientMonths: 20,
        totalOrders: 120,
        totalOrdersAmount: 350000000,
        paymentRate: 88,
        lastOrderDate: '22/01/2024',
        lastOrderAmount: 3200000,
        lastOrderPaid: true,
        incidents: [
            { type: 'late', description: '2 retards > 15j en 2023' }
        ]
    },
    {
        id: 7,
        ref: 'BC-CLI567-2024-00654',
        amount: 950000,
        clientCode: 'CLI-2024-00567',
        clientName: 'QUINCAILLERIE DU CENTRE',
        commercialCode: 'COM-025',
        commercialName: 'Marie DJOMO',
        createdAt: '27/01/2024 10:00',
        createdAgo: 'Il y a 1 jour',
        deliveryDate: '29/01/2024',
        daysToDelivery: 1,
        urgent: false,
        isNewClient: false,
        creditLimit: 2000000,
        currentOutstanding: 500000,
        outstandingPercent: 25,
        creditAvailable: 1500000,
        creditExcess: 0,
        hasCreditExcess: false,
        cautionRequired: 665000,
        cautionAvailable: 1000000,
        cautionDeficit: 0,
        hasCautionDeficit: false,
        clientSince: '10/08/2023',
        clientMonths: 5,
        totalOrders: 15,
        totalOrdersAmount: 8500000,
        paymentRate: 95,
        lastOrderDate: '18/01/2024',
        lastOrderAmount: 650000,
        lastOrderPaid: true,
        incidents: []
    },
    {
        id: 8,
        ref: 'BC-CLI890-2024-00987',
        amount: 7800000,
        clientCode: 'CLI-2024-00890',
        clientName: 'GRANDS TRAVAUX CM',
        commercialCode: 'COM-032',
        commercialName: 'Paul NGA',
        createdAt: '26/01/2024 16:00',
        createdAgo: 'Il y a 2 jours',
        deliveryDate: '15/02/2024',
        daysToDelivery: 18,
        urgent: false,
        isNewClient: false,
        creditLimit: 15000000,
        currentOutstanding: 8000000,
        outstandingPercent: 53,
        creditAvailable: 7000000,
        creditExcess: 800000,
        hasCreditExcess: true,
        cautionRequired: 5460000,
        cautionAvailable: 5000000,
        cautionDeficit: 460000,
        hasCautionDeficit: true,
        clientSince: '01/03/2021',
        clientMonths: 34,
        totalOrders: 250,
        totalOrdersAmount: 850000000,
        paymentRate: 78,
        lastOrderDate: '20/01/2024',
        lastOrderAmount: 5500000,
        lastOrderPaid: false,
        incidents: [
            { type: 'late', description: '5 retards en 2023' },
            { type: 'dispute', description: '1 litige résolu' }
        ]
    }
];

// ================================================
// INITIALISATION
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Initialisation de la validation des commandes...');
    loadOrder(currentIndex);
    updateNavigationButtons();
    updateStats();
});

// ================================================
// CHARGEMENT COMMANDE
// ================================================

function loadOrder(index) {
    const filteredOrders = getFilteredOrders();

    if (filteredOrders.length === 0) {
        showNoOrdersMessage();
        return;
    }

    if (index < 0) index = 0;
    if (index >= filteredOrders.length) index = filteredOrders.length - 1;

    currentIndex = index;
    const order = filteredOrders[index];

    // Update card class
    const card = document.getElementById('validation-card');
    card.className = 'validation-card';
    if (order.urgent) card.classList.add('urgent');
    else if (order.hasCautionDeficit || order.hasCreditExcess) card.classList.add('caution-warning');
    else if (order.isNewClient) card.classList.add('new-client');

    // Update header
    updatePriorityBadge(order);
    document.getElementById('order-ref').textContent = order.ref;
    document.getElementById('order-amount').textContent = formatMoney(order.amount) + ' XAF';

    // Update info grid
    document.getElementById('client-name').textContent = `${order.clientName} (${order.clientCode})`;
    document.getElementById('commercial-name').textContent = `${order.commercialName} (${order.commercialCode})`;
    document.getElementById('created-date').textContent = `${order.createdAt} (${order.createdAgo})`;

    let deliveryHtml = `${order.deliveryDate} (${order.daysToDelivery} jours)`;
    if (order.urgent) {
        deliveryHtml += ' <i class="fa-solid fa-fire" style="color: #EF4444;"></i> URGENT';
    }
    document.getElementById('delivery-date').innerHTML = deliveryHtml;

    // Update credit analysis
    document.getElementById('credit-limit').textContent = formatMoney(order.creditLimit) + ' XAF';
    document.getElementById('current-outstanding').textContent = `${formatMoney(order.currentOutstanding)} XAF (${order.outstandingPercent}%)`;
    document.getElementById('credit-available').textContent = formatMoney(order.creditAvailable) + ' XAF';
    document.getElementById('credit-available').className = 'analysis-item-value ' + (order.hasCreditExcess ? 'warning' : 'success');
    document.getElementById('order-value').textContent = formatMoney(order.amount) + ' XAF';

    const excessEl = document.getElementById('credit-excess');
    if (order.hasCreditExcess) {
        excessEl.parentElement.style.display = 'flex';
        excessEl.textContent = formatMoney(order.creditExcess) + ' XAF';
    } else {
        excessEl.parentElement.style.display = 'none';
    }

    // Update credit bar
    updateCreditBar(order);

    // Update caution analysis
    document.getElementById('caution-required').textContent = formatMoney(order.cautionRequired) + ' XAF';
    document.getElementById('caution-available').textContent = formatMoney(order.cautionAvailable) + ' XAF';
    document.getElementById('caution-available').className = 'analysis-item-value ' + (order.hasCautionDeficit ? 'warning' : 'success');

    const deficitEl = document.getElementById('caution-deficit');
    if (order.hasCautionDeficit) {
        deficitEl.parentElement.style.display = 'flex';
        deficitEl.textContent = formatMoney(order.cautionDeficit) + ' XAF';
    } else {
        deficitEl.parentElement.style.display = 'none';
    }

    // Update client history
    document.getElementById('client-since').textContent = `${order.clientSince} (${order.clientMonths} mois)`;
    document.getElementById('total-orders').textContent = `${order.totalOrders} pour ${formatMoney(order.totalOrdersAmount)} XAF`;

    if (order.paymentRate !== null) {
        document.getElementById('payment-rate').textContent = order.paymentRate + '%';
        document.getElementById('payment-rate').className = 'analysis-item-value ' +
            (order.paymentRate >= 90 ? 'success' : order.paymentRate >= 70 ? 'warning' : 'danger');
    } else {
        document.getElementById('payment-rate').textContent = 'N/A (Nouveau client)';
        document.getElementById('payment-rate').className = 'analysis-item-value';
    }

    if (order.lastOrderDate) {
        let lastOrderHtml = `${order.lastOrderDate} (${formatMoney(order.lastOrderAmount)} XAF)`;
        if (order.lastOrderPaid) {
            lastOrderHtml += ' <span class="history-badge paid"><i class="fa-solid fa-check"></i> Payée</span>';
        } else {
            lastOrderHtml += ' <span class="history-badge incident"><i class="fa-solid fa-clock"></i> En attente</span>';
        }
        document.getElementById('last-order').innerHTML = lastOrderHtml;
    } else {
        document.getElementById('last-order').innerHTML = '<span style="color: #6B7280;">Première commande</span>';
    }

    let incidentsHtml = '';
    if (order.incidents.length > 0) {
        incidentsHtml = order.incidents.map(inc =>
            `<span class="history-badge incident"><i class="fa-solid fa-exclamation"></i> ${inc.description}</span>`
        ).join(' ');
    } else {
        incidentsHtml = '<span style="color: #10B981;"><i class="fa-solid fa-check-circle"></i> Aucun incident</span>';
    }
    document.getElementById('incidents').innerHTML = incidentsHtml;

    // Update navigation
    document.getElementById('current-index').textContent = index + 1;
    document.getElementById('total-count').textContent = filteredOrders.length;
    updateNavigationButtons();

    // Clear comment
    document.getElementById('decision-comment').value = '';
    document.getElementById('opt-exceptional').checked = false;
    document.getElementById('opt-guarantee').checked = false;
}

function updatePriorityBadge(order) {
    const headerLeft = document.querySelector('.card-header-left');
    const existingBadge = headerLeft.querySelector('.priority-badge');

    let badgeHtml = '';
    if (order.urgent) {
        badgeHtml = '<span class="priority-badge urgent"><i class="fa-solid fa-fire"></i> URGENT</span>';
    } else if (order.hasCautionDeficit || order.hasCreditExcess) {
        badgeHtml = '<span class="priority-badge warning"><i class="fa-solid fa-exclamation-triangle"></i> DÉPASSEMENT</span>';
    } else if (order.isNewClient) {
        badgeHtml = '<span class="priority-badge new"><i class="fa-solid fa-user-plus"></i> NOUVEAU CLIENT</span>';
    }

    if (existingBadge) {
        existingBadge.outerHTML = badgeHtml;
    }
}

function updateCreditBar(order) {
    const barFill = document.querySelector('.credit-bar-fill');
    const barOverflow = document.querySelector('.credit-bar-overflow');

    // Fill percentage
    const fillPercent = Math.min(order.outstandingPercent, 100);
    barFill.style.width = fillPercent + '%';

    // Color based on utilization
    barFill.className = 'credit-bar-fill';
    if (order.outstandingPercent >= 80) {
        barFill.classList.add('danger');
    } else if (order.outstandingPercent >= 50) {
        barFill.classList.add('warning');
    } else {
        barFill.classList.add('ok');
    }

    // Overflow for excess
    if (order.hasCreditExcess) {
        const overflowPercent = (order.creditExcess / order.creditLimit) * 100;
        barOverflow.style.width = Math.min(overflowPercent, 15) + '%';
        barOverflow.style.display = 'block';
    } else {
        barOverflow.style.display = 'none';
    }

    // Update labels
    const labels = document.querySelector('.credit-labels');
    labels.innerHTML = `
        <span>0 XAF</span>
        <span style="color: ${order.outstandingPercent >= 80 ? '#EF4444' : order.outstandingPercent >= 50 ? '#F59E0B' : '#10B981'};">
            Encours: ${order.outstandingPercent}%
        </span>
        <span>Limite: ${formatMoney(order.creditLimit)} XAF</span>
    `;
}

function updateNavigationButtons() {
    const filteredOrders = getFilteredOrders();
    document.getElementById('btn-prev').disabled = currentIndex <= 0;
    document.getElementById('btn-next').disabled = currentIndex >= filteredOrders.length - 1;
}

function showNoOrdersMessage() {
    const card = document.getElementById('validation-card');
    card.innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
            <i class="fa-solid fa-check-circle" style="font-size: 64px; color: #10B981; margin-bottom: 16px;"></i>
            <h3 style="font-size: 20px; color: #1F2937; margin-bottom: 8px;">Aucune commande en attente</h3>
            <p style="color: #6B7280;">Toutes les commandes ont été traitées pour ce filtre.</p>
            <a href="./commandes-list.html" class="btn btn-primary" style="margin-top: 20px;">
                <i class="fa-solid fa-arrow-left"></i> Retour à la liste
            </a>
        </div>
    `;
}

// ================================================
// FILTRES
// ================================================

function filterValidation(filter) {
    currentFilter = filter;
    currentIndex = 0;

    // Update chips UI
    document.querySelectorAll('.quick-chip').forEach(chip => {
        chip.classList.remove('active');
        if (chip.dataset.filter === filter) {
            chip.classList.add('active');
        }
    });

    loadOrder(0);
}

function getFilteredOrders() {
    switch (currentFilter) {
        case 'urgent':
            return pendingOrders.filter(o => o.urgent);
        case 'caution':
            return pendingOrders.filter(o => o.hasCautionDeficit || o.hasCreditExcess);
        case 'new':
            return pendingOrders.filter(o => o.isNewClient);
        default:
            return pendingOrders;
    }
}

// ================================================
// NAVIGATION
// ================================================

function previousOrder() {
    if (currentIndex > 0) {
        loadOrder(currentIndex - 1);
    }
}

function nextOrder() {
    const filteredOrders = getFilteredOrders();
    if (currentIndex < filteredOrders.length - 1) {
        loadOrder(currentIndex + 1);
    }
}

// ================================================
// ACTIONS DE DÉCISION
// ================================================

function validateOrder() {
    const comment = document.getElementById('decision-comment').value.trim();
    const exceptional = document.getElementById('opt-exceptional').checked;

    const filteredOrders = getFilteredOrders();
    const order = filteredOrders[currentIndex];

    // Check if exceptional authorization is needed
    if ((order.hasCreditExcess || order.hasCautionDeficit) && !exceptional) {
        if (!confirm('Cette commande présente un dépassement.\n\nVoulez-vous autoriser de manière exceptionnelle ?')) {
            return;
        }
        document.getElementById('opt-exceptional').checked = true;
    }

    if (!comment && (order.hasCreditExcess || order.hasCautionDeficit)) {
        alert('Un commentaire est obligatoire pour les commandes avec dépassement.');
        document.getElementById('decision-comment').focus();
        return;
    }

    // Process validation
    console.log('Validation:', {
        orderId: order.id,
        ref: order.ref,
        decision: 'VALIDATED',
        comment: comment,
        exceptional: exceptional
    });

    alert(`Commande ${order.ref} validée avec succès !`);

    // Remove from list and go to next
    removeCurrentOrderAndAdvance();
}

function rejectOrder() {
    const comment = document.getElementById('decision-comment').value.trim();

    if (!comment) {
        alert('Un commentaire est obligatoire pour rejeter une commande.');
        document.getElementById('decision-comment').focus();
        return;
    }

    const filteredOrders = getFilteredOrders();
    const order = filteredOrders[currentIndex];

    if (!confirm(`Êtes-vous sûr de vouloir rejeter la commande ${order.ref} ?`)) {
        return;
    }

    console.log('Rejection:', {
        orderId: order.id,
        ref: order.ref,
        decision: 'REJECTED',
        comment: comment
    });

    alert(`Commande ${order.ref} rejetée.`);

    removeCurrentOrderAndAdvance();
}

function holdOrder() {
    const comment = document.getElementById('decision-comment').value.trim();
    const guarantee = document.getElementById('opt-guarantee').checked;

    if (!comment) {
        alert('Un commentaire est obligatoire pour mettre en attente.');
        document.getElementById('decision-comment').focus();
        return;
    }

    const filteredOrders = getFilteredOrders();
    const order = filteredOrders[currentIndex];

    console.log('Hold:', {
        orderId: order.id,
        ref: order.ref,
        decision: 'ON_HOLD',
        comment: comment,
        requestGuarantee: guarantee
    });

    alert(`Commande ${order.ref} mise en attente.${guarantee ? '\nDemande de garantie envoyée.' : ''}`);

    removeCurrentOrderAndAdvance();
}

function escalateOrder() {
    const filteredOrders = getFilteredOrders();
    const order = filteredOrders[currentIndex];

    if (confirm(`Escalader la commande ${order.ref} à la Direction ?`)) {
        console.log('Escalation:', {
            orderId: order.id,
            ref: order.ref,
            escalatedTo: 'DIRECTION'
        });

        alert(`Commande ${order.ref} escaladée à la Direction.`);
        removeCurrentOrderAndAdvance();
    }
}

function requestInfo() {
    const filteredOrders = getFilteredOrders();
    const order = filteredOrders[currentIndex];

    const info = prompt('Quelle information souhaitez-vous demander ?');
    if (info) {
        console.log('Info Request:', {
            orderId: order.id,
            ref: order.ref,
            request: info
        });

        alert(`Demande d'information envoyée au commercial ${order.commercialName}.`);
    }
}

function viewClientFile() {
    const filteredOrders = getFilteredOrders();
    const order = filteredOrders[currentIndex];
    window.open(`./client-detail.html?code=${order.clientCode}`, '_blank');
}

function viewOrderDetails() {
    const filteredOrders = getFilteredOrders();
    const order = filteredOrders[currentIndex];
    window.open(`./commande-detail.html?ref=${order.ref}`, '_blank');
}

function removeCurrentOrderAndAdvance() {
    const filteredOrders = getFilteredOrders();
    const order = filteredOrders[currentIndex];

    // Remove from pendingOrders array
    const globalIndex = pendingOrders.findIndex(o => o.id === order.id);
    if (globalIndex !== -1) {
        pendingOrders.splice(globalIndex, 1);
    }

    // Update stats
    updateStats();

    // Load next order or show empty message
    const newFilteredOrders = getFilteredOrders();
    if (newFilteredOrders.length === 0) {
        showNoOrdersMessage();
    } else {
        if (currentIndex >= newFilteredOrders.length) {
            currentIndex = newFilteredOrders.length - 1;
        }
        loadOrder(currentIndex);
    }
}

// ================================================
// STATS
// ================================================

function updateStats() {
    const urgent = pendingOrders.filter(o => o.urgent).length;
    const caution = pendingOrders.filter(o => o.hasCautionDeficit || o.hasCreditExcess).length;
    const newClients = pendingOrders.filter(o => o.isNewClient).length;
    const total = pendingOrders.length;
    const totalAmount = pendingOrders.reduce((sum, o) => sum + o.amount, 0);

    // Update banner
    const bannerTitle = document.querySelector('.alert-banner-title');
    const bannerSubtitle = document.querySelector('.alert-banner-subtitle');

    if (total > 0) {
        bannerTitle.textContent = `${total} commandes en attente de validation | Total: ${formatMoney(totalAmount)} XAF`;
        bannerSubtitle.textContent = `Dont ${urgent} urgentes | ${caution} dépassements | ${newClients} nouveau${newClients > 1 ? 'x' : ''} client${newClients > 1 ? 's' : ''}`;
    } else {
        bannerTitle.textContent = 'Aucune commande en attente';
        bannerSubtitle.textContent = 'Toutes les commandes ont été traitées';
    }

    // Update chips
    document.querySelectorAll('.quick-chip').forEach(chip => {
        const filter = chip.dataset.filter;
        const badge = chip.querySelector('.badge');
        if (badge) {
            switch (filter) {
                case 'urgent':
                    badge.textContent = urgent;
                    break;
                case 'caution':
                    badge.textContent = caution;
                    break;
                case 'new':
                    badge.textContent = newClients;
                    break;
                case 'all':
                    badge.textContent = total;
                    break;
            }
        }
    });
}

// ================================================
// HELPERS
// ================================================

function formatMoney(amount) {
    return new Intl.NumberFormat('fr-FR').format(amount);
}

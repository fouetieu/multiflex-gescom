/**
 * MultiFlex GESCOM - Liste des Livraisons
 * JavaScript pour la gestion de la liste et du planning des livraisons
 */

// ============================================
// DONNÉES MOCK
// ============================================

const mockDeliveries = [
    {
        id: 1,
        blNumber: 'BL-CLI156-2024-00234',
        bcSource: 'BC-00234',
        bcDate: '2024-01-28',
        bcAmount: 2500000,
        client: {
            name: 'SONACOM SARL',
            contact: 'Paul NJOYA',
            phone: '677 890 123',
            articles: 125
        },
        vehicle: {
            code: 'CAMION-01',
            capacity: '10T',
            transporter: 'KAMGA Transport',
            plate: 'LT-2345-DLA'
        },
        driver: {
            name: 'MBOUOMBOUO Herman',
            cni: '123456789',
            phone: '677 111 222'
        },
        loader: 'FOTSO Paul',
        warehouseKeeper: 'DJOMO Marie',
        schedule: {
            date: '2024-01-29',
            loadingTime: '08:00',
            departureTime: '08:30',
            arrivalTime: '09:15',
            returnTime: '10:30'
        },
        zone: 'Bassa',
        distance: 12,
        status: 'IN_TRANSIT',
        isUrgent: false,
        cashOnDelivery: null,
        gps: { lat: 4.0511, lng: 9.7679 }
    },
    {
        id: 2,
        blNumber: 'BL-CLI089-2024-00089',
        bcSource: 'BC-00089',
        bcDate: '2024-01-28',
        bcAmount: 850000,
        client: {
            name: 'QUINCAILLERIE MODERNE',
            contact: 'Jean MBARGA',
            phone: '699 456 789',
            articles: 45
        },
        vehicle: {
            code: 'CAMION-02',
            capacity: '5T',
            transporter: 'NJOYA Logistics',
            plate: 'CE-5678-YDE'
        },
        driver: {
            name: 'FOTSO Jean',
            cni: '987654321',
            phone: '677 222 333'
        },
        loader: 'DJOMO Jean',
        warehouseKeeper: 'BELLE Sophie',
        schedule: {
            date: '2024-01-29',
            loadingTime: '07:00',
            departureTime: '07:30',
            arrivalTime: '08:00',
            returnTime: '09:00'
        },
        zone: 'Akwa',
        distance: 5,
        status: 'DELIVERED',
        isUrgent: false,
        cashOnDelivery: null,
        gps: { lat: 4.0535, lng: 9.7085 }
    },
    {
        id: 3,
        blNumber: 'BL-CLI234-2024-00456',
        bcSource: 'BC-00456',
        bcDate: '2024-01-27',
        bcAmount: 150000,
        client: {
            name: 'KAMGA Jean Paul',
            contact: 'Particulier',
            phone: '655 234 567',
            articles: 8
        },
        vehicle: {
            code: 'CAMION-02',
            capacity: '5T',
            transporter: 'NJOYA Logistics',
            plate: 'CE-5678-YDE'
        },
        driver: {
            name: 'FOTSO Jean',
            cni: '987654321',
            phone: '677 222 333'
        },
        loader: 'DJOMO Jean',
        warehouseKeeper: 'BELLE Sophie',
        schedule: {
            date: '2024-01-29',
            loadingTime: '09:00',
            departureTime: '09:30',
            arrivalTime: '10:00',
            returnTime: '10:30'
        },
        zone: 'Bonanjo',
        distance: 8,
        status: 'PREPARED',
        isUrgent: true,
        cashOnDelivery: 100000,
        gps: { lat: 4.0456, lng: 9.6934 }
    },
    {
        id: 4,
        blNumber: 'BL-CLI312-2024-00178',
        bcSource: 'BC-00178',
        bcDate: '2024-01-27',
        bcAmount: 3200000,
        client: {
            name: 'TECHNI-BUILD',
            contact: 'Marie BELL',
            phone: '690 123 456',
            articles: 200
        },
        vehicle: {
            code: 'PICKUP-03',
            capacity: '2T',
            transporter: 'Interne',
            plate: 'LT-9012-DLA'
        },
        driver: {
            name: 'NKENG Paul',
            cni: '456789123',
            phone: '677 444 555'
        },
        loader: 'FOTSO Paul',
        warehouseKeeper: 'DJOMO Marie',
        schedule: {
            date: '2024-01-29',
            loadingTime: '13:30',
            departureTime: '14:00',
            arrivalTime: '15:00',
            returnTime: '16:00'
        },
        zone: 'Logbessou',
        distance: 15,
        status: 'PLANNED',
        isUrgent: false,
        cashOnDelivery: null,
        gps: { lat: 4.0789, lng: 9.7456 },
        requiresANR: true
    },
    {
        id: 5,
        blNumber: 'BL-CLI045-2024-00512',
        bcSource: 'BC-00512',
        bcDate: '2024-01-28',
        bcAmount: 1800000,
        client: {
            name: 'CONSTRUCT PLUS SARL',
            contact: 'Pierre ATANGANA',
            phone: '699 888 777',
            articles: 78
        },
        vehicle: {
            code: 'CAMION-01',
            capacity: '10T',
            transporter: 'KAMGA Transport',
            plate: 'LT-2345-DLA'
        },
        driver: {
            name: 'MBOUOMBOUO Herman',
            cni: '123456789',
            phone: '677 111 222'
        },
        loader: 'FOTSO Paul',
        warehouseKeeper: 'DJOMO Marie',
        schedule: {
            date: '2024-01-29',
            loadingTime: '14:00',
            departureTime: '14:30',
            arrivalTime: '15:30',
            returnTime: '16:30'
        },
        zone: 'Bonabéri',
        distance: 18,
        status: 'PLANNED',
        isUrgent: false,
        cashOnDelivery: null,
        gps: { lat: 4.0923, lng: 9.6789 }
    },
    {
        id: 6,
        blNumber: 'BL-CLI078-2024-00523',
        bcSource: 'BC-00523',
        bcDate: '2024-01-29',
        bcAmount: 450000,
        client: {
            name: 'MENUISERIE EXCELLENCE',
            contact: 'Joseph NGONO',
            phone: '677 999 000',
            articles: 25
        },
        vehicle: null,
        driver: null,
        loader: null,
        warehouseKeeper: null,
        schedule: {
            date: '2024-01-29',
            loadingTime: null,
            departureTime: null,
            arrivalTime: null,
            returnTime: null
        },
        zone: 'Akwa',
        distance: 6,
        status: 'PREPARED',
        isUrgent: false,
        cashOnDelivery: null,
        gps: { lat: 4.0512, lng: 9.7123 }
    },
    {
        id: 7,
        blNumber: 'BL-CLI156-2024-00498',
        bcSource: 'BC-00498',
        bcDate: '2024-01-26',
        bcAmount: 920000,
        client: {
            name: 'BATIMENT EXPRESS',
            contact: 'André FOKAM',
            phone: '690 555 444',
            articles: 56
        },
        vehicle: {
            code: 'PICKUP-03',
            capacity: '2T',
            transporter: 'Interne',
            plate: 'LT-9012-DLA'
        },
        driver: {
            name: 'NKENG Paul',
            cni: '456789123',
            phone: '677 444 555'
        },
        loader: 'DJOMO Jean',
        warehouseKeeper: 'BELLE Sophie',
        schedule: {
            date: '2024-01-29',
            loadingTime: '08:00',
            departureTime: '08:30',
            arrivalTime: '09:00',
            returnTime: '09:30'
        },
        zone: 'Bassa',
        distance: 4,
        status: 'DELIVERED',
        isUrgent: false,
        cashOnDelivery: null,
        gps: { lat: 4.0489, lng: 9.7234 }
    },
    {
        id: 8,
        blNumber: 'BL-CLI089-2024-00534',
        bcSource: 'BC-00534',
        bcDate: '2024-01-29',
        bcAmount: 2100000,
        client: {
            name: 'GROUPE IMMOBILIER CAMEROUN',
            contact: 'Samuel ESSOMBA',
            phone: '677 666 555',
            articles: 150
        },
        vehicle: null,
        driver: null,
        loader: null,
        warehouseKeeper: null,
        schedule: {
            date: '2024-01-30',
            loadingTime: null,
            departureTime: null,
            arrivalTime: null,
            returnTime: null
        },
        zone: 'Bonanjo',
        distance: 10,
        status: 'PREPARED',
        isUrgent: true,
        cashOnDelivery: 500000,
        gps: { lat: 4.0467, lng: 9.6945 }
    }
];

const mockVehicles = [
    {
        code: 'CAMION-01',
        name: 'Camion 10T',
        capacity: '10T',
        transporter: 'KAMGA Transport',
        plate: 'LT-2345-DLA',
        status: 'available',
        driver: 'MBOUOMBOUO Herman'
    },
    {
        code: 'CAMION-02',
        name: 'Camion 5T',
        capacity: '5T',
        transporter: 'NJOYA Logistics',
        plate: 'CE-5678-YDE',
        status: 'busy',
        driver: 'FOTSO Jean'
    },
    {
        code: 'PICKUP-03',
        name: 'Pickup 2T',
        capacity: '2T',
        transporter: 'Interne',
        plate: 'LT-9012-DLA',
        status: 'available',
        driver: 'NKENG Paul'
    },
    {
        code: 'CAMION-04',
        name: 'Camion 8T',
        capacity: '8T',
        transporter: 'KAMGA Transport',
        plate: 'LT-3456-DLA',
        status: 'unavailable',
        driver: null
    }
];

// ============================================
// ÉTAT DE L'APPLICATION
// ============================================

let state = {
    currentView: 'list',
    currentDate: new Date(),
    filters: {
        date: '',
        zone: '',
        status: '',
        transporter: '',
        bl: '',
        client: ''
    },
    selectedDeliveries: [],
    currentDelivery: null
};

// ============================================
// INITIALISATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initFilters();
    renderDeliveriesList();
    renderPlanningView();
    initEventListeners();
    setDefaultDate();
});

function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('filterDate').value = today;
}

function initFilters() {
    // Listeners pour les filtres
    document.getElementById('filterDate').addEventListener('change', applyFilters);
    document.getElementById('filterZone').addEventListener('change', applyFilters);
    document.getElementById('filterStatus').addEventListener('change', applyFilters);
    document.getElementById('filterTransporter').addEventListener('change', applyFilters);
}

function initEventListeners() {
    // Checkbox select all
    document.getElementById('selectAll').addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.delivery-checkbox');
        checkboxes.forEach(cb => {
            cb.checked = this.checked;
            toggleDeliverySelection(cb.dataset.id, this.checked);
        });
        updateBulkActions();
    });

    // Vehicle options in modal
    document.querySelectorAll('.vehicle-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.vehicle-option').forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
            this.querySelector('input[type="radio"]').checked = true;
        });
    });
}

// ============================================
// NAVIGATION DES VUES
// ============================================

function switchView(view) {
    state.currentView = view;

    // Update toggle buttons
    document.querySelectorAll('.view-toggle-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.view-toggle-btn').classList.add('active');

    // Show/hide views
    document.querySelectorAll('.view-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById('view-' + view).classList.add('active');

    // Refresh if needed
    if (view === 'planning') {
        renderPlanningView();
    }
}

// ============================================
// RENDU DE LA LISTE
// ============================================

function renderDeliveriesList() {
    const tbody = document.getElementById('deliveriesTableBody');
    const filteredDeliveries = filterDeliveries(mockDeliveries);

    if (filteredDeliveries.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 40px; color: #6B7280;">
                    <i class="fa-solid fa-truck" style="font-size: 32px; color: #D1D5DB; margin-bottom: 10px; display: block;"></i>
                    Aucune livraison ne correspond aux filtres
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filteredDeliveries.map(delivery => `
        <tr onmouseenter="showTooltip(event, ${delivery.id})" onmouseleave="hideTooltip()">
            <td>
                <input type="checkbox" class="delivery-checkbox" data-id="${delivery.id}"
                       onchange="toggleDeliverySelection(${delivery.id}, this.checked)">
            </td>
            <td>
                <div class="bl-number">${delivery.blNumber}</div>
                <div class="bl-date">${formatDate(delivery.schedule.date)} ${delivery.schedule.departureTime || '--:--'}</div>
            </td>
            <td>
                <div class="bc-ref">${delivery.bcSource}</div>
                <div class="bl-date">${formatDate(delivery.bcDate)}</div>
                <div class="bc-amount">${formatCurrency(delivery.bcAmount)}</div>
                ${delivery.isUrgent ? '<span class="urgent-badge">🔥 URGENT</span>' : ''}
            </td>
            <td>
                <div class="client-name">${delivery.client.name}</div>
                <div class="client-contact">└ ${delivery.client.contact}</div>
                <div class="client-phone">☎️ ${delivery.client.phone}</div>
                <div class="client-articles">📦 ${delivery.client.articles} articles</div>
                ${delivery.cashOnDelivery ? `<div class="cash-badge"><i class="fa-solid fa-money-bill"></i> Espèces ${formatCurrency(delivery.cashOnDelivery)}</div>` : ''}
            </td>
            <td class="vehicle-cell">
                ${delivery.vehicle ? `
                    <div><strong>${delivery.vehicle.code}</strong></div>
                    <div style="font-size: 11px; color: #6B7280;">${delivery.vehicle.capacity}</div>
                    <div class="transporter-name">${delivery.vehicle.transporter}</div>
                ` : `
                    <button class="btn btn-outline" style="padding: 6px 12px; font-size: 11px;" onclick="openAssignModal(${delivery.id})">
                        <i class="fa-solid fa-plus"></i> Affecter
                    </button>
                `}
            </td>
            <td class="time-cell">
                <div class="time-range">${delivery.schedule.departureTime || '--:--'} - ${delivery.schedule.arrivalTime || '--:--'}</div>
                ${delivery.schedule.departureTime ? `<div class="time-duration">${calculateDuration(delivery.schedule.departureTime, delivery.schedule.arrivalTime)}</div>` : ''}
            </td>
            <td class="zone-cell">
                <div class="zone-name">${delivery.zone}</div>
                <div class="zone-distance">${delivery.distance} km</div>
            </td>
            <td>
                ${getStatusBadge(delivery.status)}
            </td>
            <td class="actions-cell">
                <button class="action-btn primary" title="Voir détail" onclick="viewDelivery(${delivery.id})">
                    <i class="fa-solid fa-eye"></i>
                </button>
                <button class="action-btn" title="Modifier" onclick="editDelivery(${delivery.id})">
                    <i class="fa-solid fa-edit"></i>
                </button>
                <button class="action-btn success" title="Tracker" onclick="trackDelivery(${delivery.id})">
                    <i class="fa-solid fa-map-marker-alt"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function getStatusBadge(status) {
    const statusConfig = {
        'PREPARED': { class: 'prepared', icon: 'fa-clipboard-list', label: 'Préparé' },
        'PLANNED': { class: 'planned', icon: 'fa-clock', label: 'Planifié' },
        'IN_TRANSIT': { class: 'in-transit', icon: 'fa-truck', label: 'En cours' },
        'DELIVERED': { class: 'delivered', icon: 'fa-check', label: 'Livré' },
        'FAILED': { class: 'failed', icon: 'fa-times', label: 'Échec' },
        'POSTPONED': { class: 'postponed', icon: 'fa-rotate', label: 'Reporté' }
    };

    const config = statusConfig[status] || statusConfig['PREPARED'];
    return `<span class="status-badge ${config.class}"><i class="fa-solid ${config.icon}"></i> ${config.label}</span>`;
}

// ============================================
// RENDU DU PLANNING
// ============================================

function renderPlanningView() {
    renderTimelineHeader();
    renderTimelineBody();
}

function renderTimelineHeader() {
    const hoursContainer = document.getElementById('timelineHours');
    let html = '';

    for (let h = 7; h <= 18; h++) {
        html += `<div class="timeline-hour">${h}h</div>`;
    }

    hoursContainer.innerHTML = html;
}

function renderTimelineBody() {
    const body = document.getElementById('timelineBody');
    const dateStr = state.currentDate.toISOString().split('T')[0];

    body.innerHTML = mockVehicles.map(vehicle => {
        const vehicleDeliveries = mockDeliveries.filter(d =>
            d.vehicle && d.vehicle.code === vehicle.code && d.schedule.date === dateStr
        );

        return `
            <div class="timeline-row">
                <div class="timeline-vehicle">
                    <div class="vehicle-name">${vehicle.code}</div>
                    <div class="vehicle-info">${vehicle.transporter} - ${vehicle.capacity}</div>
                    <span class="vehicle-status ${vehicle.status}">${getVehicleStatusLabel(vehicle.status)}</span>
                </div>
                <div class="timeline-slots">
                    ${renderTimelineSlots()}
                    ${renderDeliveryBlocks(vehicleDeliveries)}
                </div>
            </div>
        `;
    }).join('');
}

function renderTimelineSlots() {
    let html = '';
    for (let h = 7; h <= 18; h++) {
        html += `<div class="timeline-slot"></div>`;
    }
    return html;
}

function renderDeliveryBlocks(deliveries) {
    return deliveries.map(delivery => {
        if (!delivery.schedule.departureTime) return '';

        const startHour = parseInt(delivery.schedule.departureTime.split(':')[0]);
        const endHour = delivery.schedule.returnTime ? parseInt(delivery.schedule.returnTime.split(':')[0]) : startHour + 2;

        const left = (startHour - 7) * 80;
        const width = (endHour - startHour) * 80;

        const statusClass = delivery.status === 'DELIVERED' ? 'delivered' :
                           delivery.status === 'IN_TRANSIT' ? 'in-transit' : 'loading';

        return `
            <div class="delivery-block ${statusClass}"
                 style="left: ${left}px; width: ${width}px;"
                 onclick="viewDelivery(${delivery.id})"
                 title="${delivery.blNumber} - ${delivery.client.name}">
                <div class="delivery-block-title">${delivery.blNumber.split('-').pop()}</div>
                <div class="delivery-block-info">${delivery.client.name.substring(0, 15)}${delivery.client.name.length > 15 ? '...' : ''}</div>
            </div>
        `;
    }).join('');
}

function getVehicleStatusLabel(status) {
    const labels = {
        'available': 'Disponible',
        'busy': 'Occupé',
        'unavailable': 'Indisponible'
    };
    return labels[status] || status;
}

// ============================================
// NAVIGATION DU PLANNING
// ============================================

function prevDay() {
    state.currentDate.setDate(state.currentDate.getDate() - 1);
    updatePlanningDate();
    renderPlanningView();
}

function nextDay() {
    state.currentDate.setDate(state.currentDate.getDate() + 1);
    updatePlanningDate();
    renderPlanningView();
}

function goToday() {
    state.currentDate = new Date();
    updatePlanningDate();
    renderPlanningView();
}

function updatePlanningDate() {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    document.getElementById('planningDate').textContent =
        state.currentDate.toLocaleDateString('fr-FR', options);
}

// ============================================
// FILTRES
// ============================================

function filterDeliveries(deliveries) {
    return deliveries.filter(delivery => {
        if (state.filters.date && delivery.schedule.date !== state.filters.date) return false;
        if (state.filters.zone && delivery.zone !== state.filters.zone) return false;
        if (state.filters.status && delivery.status !== state.filters.status) return false;
        if (state.filters.transporter && (!delivery.vehicle || !delivery.vehicle.transporter.includes(state.filters.transporter))) return false;
        if (state.filters.bl && !delivery.blNumber.toLowerCase().includes(state.filters.bl.toLowerCase())) return false;
        if (state.filters.client && !delivery.client.name.toLowerCase().includes(state.filters.client.toLowerCase())) return false;
        return true;
    });
}

function applyFilters() {
    state.filters = {
        date: document.getElementById('filterDate').value,
        zone: document.getElementById('filterZone').value,
        status: document.getElementById('filterStatus').value,
        transporter: document.getElementById('filterTransporter').value,
        bl: document.getElementById('filterBL').value,
        client: document.getElementById('filterClient').value
    };

    renderDeliveriesList();
}

function resetFilters() {
    document.getElementById('filterDate').value = '';
    document.getElementById('filterZone').value = '';
    document.getElementById('filterStatus').value = '';
    document.getElementById('filterTransporter').value = '';
    document.getElementById('filterBL').value = '';
    document.getElementById('filterClient').value = '';

    state.filters = {
        date: '',
        zone: '',
        status: '',
        transporter: '',
        bl: '',
        client: ''
    };

    renderDeliveriesList();
}

// ============================================
// SÉLECTION ET ACTIONS EN MASSE
// ============================================

function toggleDeliverySelection(id, selected) {
    if (selected) {
        if (!state.selectedDeliveries.includes(id)) {
            state.selectedDeliveries.push(id);
        }
    } else {
        state.selectedDeliveries = state.selectedDeliveries.filter(d => d !== id);
    }
    updateBulkActions();
}

function updateBulkActions() {
    const hasSelection = state.selectedDeliveries.length > 0;
    document.getElementById('bulkAssign').disabled = !hasSelection;
    document.getElementById('bulkPrint').disabled = !hasSelection;
}

// ============================================
// TOOLTIP
// ============================================

function showTooltip(event, deliveryId) {
    const delivery = mockDeliveries.find(d => d.id === deliveryId);
    if (!delivery) return;

    const tooltip = document.getElementById('deliveryTooltip');

    document.getElementById('tooltipTitle').textContent = delivery.blNumber;
    document.getElementById('tooltipSubtitle').textContent = delivery.client.name;
    document.getElementById('tooltipDriver').textContent = delivery.driver?.name || 'Non assigné';
    document.getElementById('tooltipCNI').textContent = delivery.driver?.cni || '-';
    document.getElementById('tooltipPhone').textContent = delivery.driver?.phone || '-';
    document.getElementById('tooltipDistance').textContent = delivery.distance + ' km';
    document.getElementById('tooltipDuration').textContent = calculateDuration(delivery.schedule.departureTime, delivery.schedule.arrivalTime) || '-';

    // Update status badge
    const statusEl = document.getElementById('tooltipStatus');
    statusEl.innerHTML = getStatusBadge(delivery.status);

    // Position tooltip
    const rect = event.target.closest('tr').getBoundingClientRect();
    tooltip.style.top = (rect.bottom + 10) + 'px';
    tooltip.style.left = Math.min(rect.left, window.innerWidth - 370) + 'px';
    tooltip.classList.add('show');
}

function hideTooltip() {
    document.getElementById('deliveryTooltip').classList.remove('show');
}

// ============================================
// MODAL AFFECTATION VÉHICULE
// ============================================

function openAssignModal(deliveryId) {
    const delivery = mockDeliveries.find(d => d.id === deliveryId);
    if (!delivery) return;

    state.currentDelivery = delivery;

    // Update modal content
    document.getElementById('modalClient').textContent = `${delivery.client.name} - ${delivery.zone}`;
    document.getElementById('modalDistance').textContent = delivery.distance + ' km';
    document.getElementById('modalWeight').textContent = '2,500 kg'; // Mock
    document.getElementById('modalVolume').textContent = '8.3 m³'; // Mock
    document.getElementById('modalSlot').textContent = `${formatDate(delivery.schedule.date)} - Matin (8h-12h)`;

    document.getElementById('assignVehicleModal').classList.add('show');
}

function closeAssignModal() {
    document.getElementById('assignVehicleModal').classList.remove('show');
    state.currentDelivery = null;
}

function confirmAssignment() {
    if (!state.currentDelivery) return;

    const selectedVehicle = document.querySelector('input[name="vehicle"]:checked')?.value;
    const driver = document.getElementById('modalDriver').value;
    const driverCNI = document.getElementById('modalDriverCNI').value;
    const loader = document.getElementById('modalLoader').value;
    const warehouseKeeper = document.getElementById('modalWarehouse').value;

    if (!selectedVehicle || !driver || !driverCNI || !loader || !warehouseKeeper) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }

    // Mock update
    console.log('Affectation confirmée:', {
        deliveryId: state.currentDelivery.id,
        vehicle: selectedVehicle,
        driver,
        driverCNI,
        loader,
        warehouseKeeper
    });

    alert('Affectation confirmée avec succès !');
    closeAssignModal();
    renderDeliveriesList();
}

// ============================================
// ACTIONS
// ============================================

function viewDelivery(id) {
    // Navigate to detail page
    console.log('Voir livraison:', id);
    alert('Navigation vers le détail de la livraison ' + id);
}

function editDelivery(id) {
    console.log('Modifier livraison:', id);
    alert('Modification de la livraison ' + id);
}

function trackDelivery(id) {
    const delivery = mockDeliveries.find(d => d.id === id);
    if (delivery && delivery.gps) {
        console.log('Tracker livraison:', id, delivery.gps);
        alert(`GPS: ${delivery.gps.lat}, ${delivery.gps.lng}\nOuvrir dans Google Maps...`);
    }
}

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount) + ' XAF';
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
    });
}

function calculateDuration(startTime, endTime) {
    if (!startTime || !endTime) return null;

    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);

    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    const diff = endMinutes - startMinutes;

    if (diff < 60) {
        return diff + ' min';
    } else {
        const hours = Math.floor(diff / 60);
        const mins = diff % 60;
        return hours + 'h' + (mins > 0 ? mins : '');
    }
}

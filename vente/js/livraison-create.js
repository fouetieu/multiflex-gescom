/**
 * MultiFlex GESCOM - Création Bon de Livraison
 * Module Ventes - ECR-LIV-002
 */

// =====================================================
// MOCK DATA
// =====================================================

const mockBonsCommande = [
    {
        id: 'BC001',
        numero: 'BC-CLI156-2024-00234',
        client: 'SONACOM SARL',
        clientCode: 'CLI156',
        dateCommande: '28/01/2024',
        montant: 2500000,
        nbArticles: 4,
        statut: 'validated',
        statutLabel: '✓ Validé',
        creditStatus: 'OK',
        adresseLivraison: 'Zone Industrielle, Bassa, Douala',
        contactLivraison: 'Paul NJOYA',
        phoneLivraison: '677 890 123',
        gps: '4.0234, 9.7123',
        articles: [
            { ref: 'CIM-42.5R', nom: 'Ciment DANGOTE 42.5R', qteCommandee: 100, unite: 'Sac', stock: 250, emplacement: 'MAG-A01', poids: 50, volume: 0.025 },
            { ref: 'FER-10', nom: 'Fer à béton HA 10mm', qteCommandee: 50, unite: 'Barre', stock: 120, emplacement: 'MAG-B02', poids: 12, volume: 0.01 },
            { ref: 'GRV-0/15', nom: 'Gravier concassé 0/15', qteCommandee: 30, unite: 'M³', stock: 45, emplacement: 'EXT-Z01', poids: 1500, volume: 1 },
            { ref: 'SAB-RIV', nom: 'Sable de rivière', qteCommandee: 20, unite: 'M³', stock: 8, emplacement: 'EXT-Z02', poids: 1600, volume: 1 }
        ]
    },
    {
        id: 'BC002',
        numero: 'BC-CLI087-2024-00235',
        client: 'BTP CAMEROUN SA',
        clientCode: 'CLI087',
        dateCommande: '27/01/2024',
        montant: 4750000,
        nbArticles: 6,
        statut: 'validated',
        statutLabel: '✓ Validé',
        creditStatus: 'OK',
        adresseLivraison: 'Chantier Carrefour Ndokoti, Douala',
        contactLivraison: 'Jean KAMGA',
        phoneLivraison: '699 123 456',
        gps: '4.0312, 9.6981',
        articles: [
            { ref: 'CIM-42.5R', nom: 'Ciment DANGOTE 42.5R', qteCommandee: 200, unite: 'Sac', stock: 250, emplacement: 'MAG-A01', poids: 50, volume: 0.025 },
            { ref: 'FER-12', nom: 'Fer à béton HA 12mm', qteCommandee: 100, unite: 'Barre', stock: 95, emplacement: 'MAG-B02', poids: 16, volume: 0.015 },
            { ref: 'FER-14', nom: 'Fer à béton HA 14mm', qteCommandee: 80, unite: 'Barre', stock: 200, emplacement: 'MAG-B03', poids: 22, volume: 0.02 },
            { ref: 'GRV-0/25', nom: 'Gravier concassé 0/25', qteCommandee: 50, unite: 'M³', stock: 60, emplacement: 'EXT-Z01', poids: 1500, volume: 1 },
            { ref: 'SAB-RIV', nom: 'Sable de rivière', qteCommandee: 40, unite: 'M³', stock: 8, emplacement: 'EXT-Z02', poids: 1600, volume: 1 },
            { ref: 'AGG-5/10', nom: 'Agrégats 5/10', qteCommandee: 25, unite: 'M³', stock: 30, emplacement: 'EXT-Z03', poids: 1400, volume: 1 }
        ]
    },
    {
        id: 'BC003',
        numero: 'BC-CLI201-2024-00230',
        client: 'CONSTRUCTION PLUS',
        clientCode: 'CLI201',
        dateCommande: '26/01/2024',
        montant: 850000,
        nbArticles: 3,
        statut: 'validated',
        statutLabel: '✓ Validé',
        creditStatus: 'WARNING',
        adresseLivraison: 'Akwa Nord, Douala',
        contactLivraison: 'Marie FOUDA',
        phoneLivraison: '655 789 012',
        gps: '4.0456, 9.7201',
        articles: [
            { ref: 'CIM-32.5R', nom: 'Ciment CIMAF 32.5R', qteCommandee: 50, unite: 'Sac', stock: 180, emplacement: 'MAG-A02', poids: 50, volume: 0.025 },
            { ref: 'BRQ-PL', nom: 'Briques pleines 15x20x40', qteCommandee: 500, unite: 'Pièce', stock: 800, emplacement: 'MAG-C01', poids: 4, volume: 0.012 },
            { ref: 'TUI-ROM', nom: 'Tuiles romaines', qteCommandee: 200, unite: 'Pièce', stock: 350, emplacement: 'MAG-C02', poids: 2.5, volume: 0.008 }
        ]
    }
];

const mockVehicles = [
    {
        id: 'VEH001',
        nom: 'CAMION-01',
        transporteur: 'KAMGA Transport',
        immatriculation: 'LT-2345-DLA',
        capacitePoids: 10000, // kg
        capaciteVolume: 40, // m³
        statut: 'disponible'
    },
    {
        id: 'VEH002',
        nom: 'CAMION-02',
        transporteur: 'KAMGA Transport',
        immatriculation: 'LT-3456-DLA',
        capacitePoids: 15000,
        capaciteVolume: 60,
        statut: 'disponible'
    },
    {
        id: 'VEH003',
        nom: 'SEMI-01',
        transporteur: 'NJOYA Logistics',
        immatriculation: 'LT-4567-DLA',
        capacitePoids: 25000,
        capaciteVolume: 80,
        statut: 'en_mission'
    },
    {
        id: 'VEH004',
        nom: 'FOURGON-01',
        transporteur: 'Interne',
        immatriculation: 'CE-7890-DLA',
        capacitePoids: 3500,
        capaciteVolume: 20,
        statut: 'disponible'
    }
];

// =====================================================
// STATE
// =====================================================

let state = {
    selectedBC: null,
    selectedArticles: [],
    selectedVehicle: null,
    isPartialDelivery: false,
    totalWeight: 0,
    totalVolume: 0,
    blNumber: '',
    blDate: '',
    // Tab navigation state
    currentTab: 0,
    tabsSaved: [false, false, false, false], // Track if each tab has been saved at least once
    isEditMode: false // Mode édition si on vient d'un BL existant
};

// =====================================================
// INITIALIZATION
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
    initBLNumber();
    initBLDate();
    setupEventListeners();
    initVehicleCards();
    initDefaultDate();
    initTabNavigation();
});

function initBLNumber() {
    const year = new Date().getFullYear();
    const randomNum = String(Math.floor(Math.random() * 900) + 100).padStart(5, '0');
    state.blNumber = `BL-XXXX-${year}-${randomNum}`;
    document.getElementById('blNumber').textContent = state.blNumber;
}

function initBLDate() {
    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR');
    const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    state.blDate = `${dateStr} ${timeStr}`;
    document.getElementById('blDate').textContent = state.blDate;
}

function initDefaultDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateInput = document.getElementById('deliveryDate');
    if (dateInput) {
        dateInput.value = tomorrow.toISOString().split('T')[0];
    }

    // Default times
    document.getElementById('loadingTime').value = '07:30';
    document.getElementById('departureTime').value = '08:00';
    document.getElementById('arrivalTime').value = '10:00';
    document.getElementById('returnTime').value = '14:00';
}

function setupEventListeners() {
    // BC Search
    const bcSearch = document.getElementById('bcSearch');
    if (bcSearch) {
        bcSearch.addEventListener('input', handleBCSearch);
        bcSearch.addEventListener('focus', () => {
            if (bcSearch.value.length > 0) {
                handleBCSearch({ target: bcSearch });
            }
        });
    }

    // Close search results on outside click
    document.addEventListener('click', (e) => {
        const searchContainer = document.querySelector('.bc-search-container');
        if (searchContainer && !searchContainer.contains(e.target)) {
            document.getElementById('bcSearchResults').classList.remove('show');
        }
    });

    // Partial delivery checkbox
    const partialDeliveryCheckbox = document.getElementById('partialDelivery');
    if (partialDeliveryCheckbox) {
        partialDeliveryCheckbox.addEventListener('change', (e) => {
            state.isPartialDelivery = e.target.checked;
        });
    }

    // Subsidized transport
    const subsidizedCheckbox = document.getElementById('subsidizedTransport');
    if (subsidizedCheckbox) {
        subsidizedCheckbox.addEventListener('change', (e) => {
            const section = document.getElementById('subsidizedSection');
            const transportDocCheck = document.getElementById('transportDocCheck');
            if (e.target.checked) {
                section.style.display = 'block';
                transportDocCheck.style.display = 'flex';
            } else {
                section.style.display = 'none';
                transportDocCheck.style.display = 'none';
            }
        });
    }

    // Transporter selection
    const transporterSelect = document.getElementById('transporter');
    if (transporterSelect) {
        transporterSelect.addEventListener('change', handleTransporterChange);
    }

    // Vehicle selection
    const vehicleSelect = document.getElementById('vehicle');
    if (vehicleSelect) {
        vehicleSelect.addEventListener('change', handleVehicleSelectChange);
    }

    // Time calculations
    const loadingTime = document.getElementById('loadingTime');
    const loadingDuration = document.getElementById('loadingDuration');
    if (loadingTime && loadingDuration) {
        loadingTime.addEventListener('change', calculateScheduleTimes);
        loadingDuration.addEventListener('change', calculateScheduleTimes);
    }

    // Save draft button
    const btnSaveDraft = document.getElementById('btnSaveDraft');
    if (btnSaveDraft) {
        btnSaveDraft.addEventListener('click', saveDraft);
    }

    // Print button
    const btnPrint = document.getElementById('btnPrint');
    if (btnPrint) {
        btnPrint.addEventListener('click', () => {
            openPreviewModal();
            setTimeout(printBL, 500);
        });
    }
}

// =====================================================
// TAB NAVIGATION
// =====================================================

const TOTAL_TABS = 4;

function initTabNavigation() {
    // Check if we're in edit mode (URL parameter)
    const urlParams = new URLSearchParams(window.location.search);
    const blId = urlParams.get('id');
    if (blId) {
        state.isEditMode = true;
        // En mode édition, tous les onglets sont considérés comme déjà sauvegardés
        state.tabsSaved = [true, true, true, true];
    }

    // Initialize navigation buttons visibility
    updateNavigationButtons();
}

function switchTab(index) {
    // Validate index
    if (index < 0 || index >= TOTAL_TABS) return;

    state.currentTab = index;

    // Update tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
    });

    // Update tab content
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach((content, i) => {
        content.classList.toggle('active', i === index);
    });

    // Update navigation buttons
    updateNavigationButtons();

    // Update recap on validation tab
    if (index === 3) {
        updateRecap();
    }
}

function nextTab() {
    // Save current tab data
    if (saveCurrentTab()) {
        // Mark as saved
        state.tabsSaved[state.currentTab] = true;

        // Navigate to next tab if not last
        if (state.currentTab < TOTAL_TABS - 1) {
            switchTab(state.currentTab + 1);
            showNotification('Données enregistrées', 'success');
        }
    }
}

function prevTab() {
    if (state.currentTab > 0) {
        switchTab(state.currentTab - 1);
    }
}

function skipTab() {
    // Can only skip if tab has been saved at least once
    if (state.tabsSaved[state.currentTab]) {
        if (state.currentTab < TOTAL_TABS - 1) {
            switchTab(state.currentTab + 1);
        }
    } else {
        showNotification('Vous devez enregistrer cet onglet au moins une fois avant de pouvoir l\'ignorer.', 'warning');
    }
}

function saveCurrentTab() {
    const tabIndex = state.currentTab;
    let isValid = true;
    let errors = [];

    switch(tabIndex) {
        case 0: // Commande source
            if (!state.selectedBC) {
                errors.push('Veuillez sélectionner un bon de commande source');
                isValid = false;
            }
            break;

        case 1: // Articles
            const selectedArticles = state.selectedArticles.filter(a => a.selected && a.qteALivrer > 0);
            if (selectedArticles.length === 0) {
                errors.push('Veuillez sélectionner au moins un article à livrer');
                isValid = false;
            }
            break;

        case 2: // Transport
            if (!state.selectedVehicle) {
                errors.push('Veuillez sélectionner un véhicule');
                isValid = false;
            }
            if (!document.getElementById('driverName').value.trim()) {
                errors.push('Veuillez renseigner le nom du chauffeur');
                isValid = false;
            }
            if (!document.getElementById('driverCNI').value.trim()) {
                errors.push('Veuillez renseigner le N° CNI du chauffeur');
                isValid = false;
            }
            if (!document.getElementById('deliveryDate').value) {
                errors.push('Veuillez renseigner la date de livraison');
                isValid = false;
            }
            break;

        case 3: // Validation
            // Final validation - all previous tabs must be valid
            isValid = true;
            break;
    }

    if (!isValid) {
        showNotification(errors.join('<br>'), 'warning');
    }

    return isValid;
}

function updateNavigationButtons() {
    const currentTab = state.currentTab;
    const isFirstTab = currentTab === 0;
    const isLastTab = currentTab === TOTAL_TABS - 1;
    const tabWasSaved = state.tabsSaved[currentTab];

    // Previous button - hide on first tab
    const btnPrev = document.getElementById('btnPrevTab');
    if (btnPrev) {
        btnPrev.style.display = isFirstTab ? 'none' : 'inline-flex';
    }

    // Skip button - show only if tab was saved at least once and not on last tab
    const btnSkip = document.getElementById('btnSkipTab');
    if (btnSkip) {
        btnSkip.style.display = (tabWasSaved && !isLastTab) ? 'inline-flex' : 'none';
    }

    // Next/Save button - hide on last tab
    const btnNext = document.getElementById('btnNextTab');
    if (btnNext) {
        btnNext.style.display = isLastTab ? 'none' : 'inline-flex';
        // Update button text based on tab state
        if (tabWasSaved) {
            btnNext.innerHTML = '<i class="fa-solid fa-save"></i> Mettre à jour et Suivant <i class="fa-solid fa-arrow-right"></i>';
        } else {
            btnNext.innerHTML = '<i class="fa-solid fa-save"></i> Enregistrer et Suivant <i class="fa-solid fa-arrow-right"></i>';
        }
    }

    // Preview and Validate buttons - show only on last tab
    const btnPreview = document.getElementById('btnPreview');
    const btnValidate = document.getElementById('btnValidate');
    if (btnPreview) {
        btnPreview.style.display = isLastTab ? 'inline-flex' : 'none';
    }
    if (btnValidate) {
        btnValidate.style.display = isLastTab ? 'inline-flex' : 'none';
    }
}

// =====================================================
// BC SEARCH & SELECTION
// =====================================================

function handleBCSearch(e) {
    const query = e.target.value.toLowerCase();
    const resultsContainer = document.getElementById('bcSearchResults');

    if (query.length < 2) {
        resultsContainer.classList.remove('show');
        return;
    }

    const filteredBCs = mockBonsCommande.filter(bc =>
        bc.numero.toLowerCase().includes(query) ||
        bc.client.toLowerCase().includes(query) ||
        bc.clientCode.toLowerCase().includes(query)
    );

    if (filteredBCs.length === 0) {
        resultsContainer.innerHTML = `
            <div style="padding: 16px; text-align: center; color: #6B7280;">
                <i class="fa-solid fa-search" style="font-size: 24px; margin-bottom: 8px;"></i>
                <p>Aucun bon de commande trouvé</p>
            </div>
        `;
    } else {
        resultsContainer.innerHTML = filteredBCs.map(bc => `
            <div class="bc-result-item" onclick="selectBC('${bc.id}')">
                <div class="bc-result-number">${bc.numero}</div>
                <div class="bc-result-client">${bc.client}</div>
                <div class="bc-result-meta">
                    <span><i class="fa-solid fa-calendar"></i> ${bc.dateCommande}</span>
                    <span><i class="fa-solid fa-boxes-stacked"></i> ${bc.nbArticles} articles</span>
                    <span><i class="fa-solid fa-coins"></i> ${formatMoney(bc.montant)} XAF</span>
                </div>
            </div>
        `).join('');
    }

    resultsContainer.classList.add('show');
}

function selectBC(bcId) {
    const bc = mockBonsCommande.find(b => b.id === bcId);
    if (!bc) return;

    state.selectedBC = bc;

    // Update BL number with client code
    const year = new Date().getFullYear();
    const randomNum = String(Math.floor(Math.random() * 900) + 100).padStart(5, '0');
    state.blNumber = `BL-${bc.clientCode}-${year}-${randomNum}`;
    document.getElementById('blNumber').textContent = state.blNumber;

    // Update selected BC card
    document.getElementById('selectedBCNumber').textContent = bc.numero;
    document.getElementById('selectedBCClient').textContent = `${bc.client} - ${bc.dateCommande}`;
    document.getElementById('selectedBCAmount').textContent = `${formatMoney(bc.montant)} XAF`;
    document.getElementById('selectedBCArticles').textContent = bc.nbArticles;
    document.getElementById('selectedBCStatus').textContent = bc.statutLabel;
    document.getElementById('selectedBCCredit').textContent = bc.creditStatus === 'OK' ? '✓ OK' : '⚠ Limite';
    document.getElementById('selectedBCCard').classList.add('show');

    // Hide search results
    document.getElementById('bcSearchResults').classList.remove('show');
    document.getElementById('bcSearch').value = bc.numero;

    // Load articles
    loadArticles(bc);

    // Update delivery address
    updateDeliveryAddress(bc);
}

function clearSelectedBC() {
    state.selectedBC = null;
    state.selectedArticles = [];

    document.getElementById('selectedBCCard').classList.remove('show');
    document.getElementById('bcSearch').value = '';
    document.getElementById('articlesTableBody').innerHTML = '';

    // Reset BL number
    initBLNumber();
}

// =====================================================
// ARTICLES MANAGEMENT
// =====================================================

function loadArticles(bc) {
    const tbody = document.getElementById('articlesTableBody');
    state.selectedArticles = [];
    let hasStockIssue = false;

    const rows = bc.articles.map((article, index) => {
        const stockOk = article.stock >= article.qteCommandee;
        const maxQty = Math.min(article.stock, article.qteCommandee);
        const qtyToDeliver = stockOk ? article.qteCommandee : article.stock;
        const reste = article.qteCommandee - qtyToDeliver;

        if (!stockOk) hasStockIssue = true;

        // Add to selected articles by default
        state.selectedArticles.push({
            ...article,
            qteALivrer: qtyToDeliver,
            reste: reste,
            selected: true
        });

        let stockClass = 'stock-ok';
        let stockText = `✓ ${article.stock} dispo`;

        if (article.stock === 0) {
            stockClass = 'stock-error';
            stockText = '✗ Rupture';
        } else if (!stockOk) {
            stockClass = 'stock-warning';
            stockText = `⚠ ${article.stock} dispo`;
        }

        return `
            <tr data-index="${index}">
                <td>
                    <input type="checkbox" checked onchange="toggleArticle(${index}, this.checked)">
                </td>
                <td>
                    <div class="article-ref">${article.ref}</div>
                    <div class="article-name">${article.nom}</div>
                </td>
                <td style="text-align: center; font-weight: 500;">
                    ${article.qteCommandee}
                </td>
                <td class="${stockClass}">
                    ${stockText}
                </td>
                <td>
                    <input type="number"
                           value="${qtyToDeliver}"
                           min="0"
                           max="${maxQty}"
                           onchange="updateArticleQty(${index}, this.value)"
                           ${article.stock === 0 ? 'disabled' : ''}>
                </td>
                <td style="text-align: center; color: #6B7280; font-size: 12px;">
                    ${article.unite}
                </td>
                <td style="text-align: center; ${reste > 0 ? 'color: #D97706; font-weight: 500;' : 'color: #9CA3AF;'}">
                    ${reste}
                </td>
                <td>
                    <span class="location-badge">
                        <i class="fa-solid fa-warehouse" style="margin-right: 4px;"></i>
                        ${article.emplacement}
                    </span>
                </td>
            </tr>
        `;
    }).join('');

    tbody.innerHTML = rows;

    // Show partial delivery alert if needed
    const partialAlert = document.getElementById('partialDeliveryAlert');
    if (hasStockIssue) {
        partialAlert.style.display = 'flex';
        document.getElementById('partialDelivery').checked = true;
        state.isPartialDelivery = true;
    } else {
        partialAlert.style.display = 'none';
    }

    updateArticlesSummary();
}

function toggleArticle(index, checked) {
    if (state.selectedArticles[index]) {
        state.selectedArticles[index].selected = checked;
        updateArticlesSummary();
    }
}

function updateArticleQty(index, value) {
    const qty = parseInt(value) || 0;
    if (state.selectedArticles[index]) {
        const article = state.selectedArticles[index];
        const maxQty = Math.min(article.stock, article.qteCommandee);
        article.qteALivrer = Math.min(qty, maxQty);
        article.reste = article.qteCommandee - article.qteALivrer;

        // Update reste display
        const row = document.querySelector(`tr[data-index="${index}"]`);
        if (row) {
            const resteCell = row.querySelector('td:nth-child(7)');
            resteCell.textContent = article.reste;
            resteCell.style.color = article.reste > 0 ? '#D97706' : '#9CA3AF';
            resteCell.style.fontWeight = article.reste > 0 ? '500' : 'normal';
        }

        updateArticlesSummary();
    }
}

function selectAllArticles() {
    const checkboxes = document.querySelectorAll('#articlesTableBody input[type="checkbox"]');
    checkboxes.forEach((cb, index) => {
        cb.checked = true;
        if (state.selectedArticles[index]) {
            state.selectedArticles[index].selected = true;
        }
    });
    updateArticlesSummary();
}

function updateArticlesSummary() {
    const selected = state.selectedArticles.filter(a => a.selected);
    const total = state.selectedArticles.length;

    let totalWeight = 0;
    let totalVolume = 0;

    selected.forEach(article => {
        totalWeight += article.poids * article.qteALivrer;
        totalVolume += article.volume * article.qteALivrer;
    });

    state.totalWeight = totalWeight;
    state.totalVolume = totalVolume;

    document.getElementById('summaryArticles').textContent = `${selected.length}/${total} articles`;
    document.getElementById('summaryWeight').textContent = `${formatNumber(totalWeight)} kg`;
    document.getElementById('summaryVolume').textContent = `${totalVolume.toFixed(1)} m³`;

    // Update partial delivery check in validation tab
    const hasPartial = state.selectedArticles.some(a => a.reste > 0);
    const partialCheck = document.getElementById('partialCheck');
    if (partialCheck) {
        partialCheck.style.display = hasPartial ? 'flex' : 'none';
    }

    // Update vehicle capacity indicators
    updateVehicleCapacity();
}

// =====================================================
// TRANSPORT MANAGEMENT
// =====================================================

function handleTransporterChange(e) {
    const transporteur = e.target.value;
    const vehicleSelect = document.getElementById('vehicle');

    // Filter vehicles by transporter
    const filteredVehicles = transporteur === 'INTERNAL'
        ? mockVehicles.filter(v => v.transporteur === 'Interne')
        : transporteur
            ? mockVehicles.filter(v => v.transporteur.includes(transporteur) || v.transporteur === 'Interne')
            : mockVehicles;

    vehicleSelect.innerHTML = '<option value="">Sélectionner...</option>' +
        filteredVehicles.map(v => `
            <option value="${v.id}" ${v.statut !== 'disponible' ? 'disabled' : ''}>
                ${v.nom} - ${v.capacitePoids/1000}T ${v.statut !== 'disponible' ? '(Indisponible)' : ''}
            </option>
        `).join('');

    // Update vehicle cards display
    updateVehicleCardsDisplay(transporteur);
}

function handleVehicleSelectChange(e) {
    const vehicleId = e.target.value;
    selectVehicle(vehicleId);
}

function initVehicleCards() {
    const container = document.getElementById('vehicleCards');
    if (!container) return;

    const cards = mockVehicles.map(vehicle => {
        const isDisabled = vehicle.statut !== 'disponible';
        return `
            <div class="vehicle-card ${isDisabled ? 'disabled' : ''}"
                 data-vehicle-id="${vehicle.id}"
                 onclick="${isDisabled ? '' : `selectVehicle('${vehicle.id}')`}">
                <input type="radio" name="vehicle" value="${vehicle.id}" ${isDisabled ? 'disabled' : ''}>
                <div class="vehicle-card-header">
                    <span class="vehicle-card-name">
                        <i class="fa-solid fa-truck" style="margin-right: 6px; color: #263c89;"></i>
                        ${vehicle.nom}
                    </span>
                    <span class="vehicle-card-capacity">${vehicle.capacitePoids/1000}T / ${vehicle.capaciteVolume}m³</span>
                </div>
                <div class="vehicle-card-transporter">${vehicle.transporteur}</div>
                <div class="vehicle-card-plate">${vehicle.immatriculation}</div>
                <div class="vehicle-card-status" id="capacity-${vehicle.id}">
                    ${isDisabled ? '<span style="color: #DC2626;">● Indisponible</span>' : '<span style="color: #059669;">● Disponible</span>'}
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = cards;
}

function selectVehicle(vehicleId) {
    const vehicle = mockVehicles.find(v => v.id === vehicleId);
    if (!vehicle || vehicle.statut !== 'disponible') return;

    state.selectedVehicle = vehicle;

    // Update vehicle cards selection
    document.querySelectorAll('.vehicle-card').forEach(card => {
        card.classList.remove('selected');
        if (card.dataset.vehicleId === vehicleId) {
            card.classList.add('selected');
            card.querySelector('input[type="radio"]').checked = true;
        }
    });

    // Update form fields
    document.getElementById('vehicle').value = vehicleId;
    document.getElementById('vehiclePlate').value = vehicle.immatriculation;

    // Update transporter if not already set
    const transporterSelect = document.getElementById('transporter');
    if (!transporterSelect.value) {
        if (vehicle.transporteur.includes('KAMGA')) {
            transporterSelect.value = 'KAMGA';
        } else if (vehicle.transporteur.includes('NJOYA')) {
            transporterSelect.value = 'NJOYA';
        } else {
            transporterSelect.value = 'INTERNAL';
        }
    }

    updateVehicleCapacity();
}

function updateVehicleCapacity() {
    if (!state.selectedVehicle) return;

    const vehicle = state.selectedVehicle;
    const weightPercent = (state.totalWeight / vehicle.capacitePoids) * 100;
    const volumePercent = (state.totalVolume / vehicle.capaciteVolume) * 100;

    const capacityElement = document.getElementById(`capacity-${vehicle.id}`);
    if (capacityElement) {
        let statusClass = 'capacity-ok';
        let statusText = '● Capacité OK';

        if (weightPercent > 100 || volumePercent > 100) {
            statusClass = 'capacity-error';
            statusText = '● Capacité dépassée';
        } else if (weightPercent > 80 || volumePercent > 80) {
            statusClass = 'capacity-warning';
            statusText = '● Capacité ~80%';
        }

        capacityElement.innerHTML = `
            <span class="${statusClass}">${statusText}</span>
            <div style="font-size: 10px; color: #6B7280; margin-top: 4px;">
                Poids: ${formatNumber(state.totalWeight)}/${formatNumber(vehicle.capacitePoids)} kg (${weightPercent.toFixed(0)}%)
                | Vol: ${state.totalVolume.toFixed(1)}/${vehicle.capaciteVolume} m³ (${volumePercent.toFixed(0)}%)
            </div>
        `;
    }
}

function updateVehicleCardsDisplay(transporteur) {
    document.querySelectorAll('.vehicle-card').forEach(card => {
        const vehicleId = card.dataset.vehicleId;
        const vehicle = mockVehicles.find(v => v.id === vehicleId);

        if (!transporteur) {
            card.style.display = 'block';
        } else if (transporteur === 'INTERNAL' && vehicle.transporteur === 'Interne') {
            card.style.display = 'block';
        } else if (vehicle.transporteur.includes(transporteur) || vehicle.transporteur === 'Interne') {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// =====================================================
// SCHEDULE CALCULATIONS
// =====================================================

function calculateScheduleTimes() {
    const loadingTime = document.getElementById('loadingTime').value;
    const loadingDuration = parseInt(document.getElementById('loadingDuration').value) || 30;

    if (!loadingTime) return;

    const [hours, minutes] = loadingTime.split(':').map(Number);
    let loadingEnd = new Date();
    loadingEnd.setHours(hours, minutes + loadingDuration, 0);

    // Departure = loading end + 15 min buffer
    let departure = new Date(loadingEnd);
    departure.setMinutes(departure.getMinutes() + 15);
    document.getElementById('departureTime').value = formatTime(departure);

    // Arrival = departure + estimated travel time (default 2h)
    let arrival = new Date(departure);
    arrival.setHours(arrival.getHours() + 2);
    document.getElementById('arrivalTime').value = formatTime(arrival);

    // Return = arrival + 2h for unloading + return
    let returnTime = new Date(arrival);
    returnTime.setHours(returnTime.getHours() + 4);
    document.getElementById('returnTime').value = formatTime(returnTime);
}

function formatTime(date) {
    return date.toTimeString().slice(0, 5);
}

// =====================================================
// DELIVERY ADDRESS
// =====================================================

function updateDeliveryAddress(bc) {
    document.getElementById('deliveryClientName').textContent = bc.client;
    document.getElementById('deliveryAddress').textContent = bc.adresseLivraison;
    document.getElementById('deliveryGPS').textContent = bc.gps;
    document.getElementById('deliveryContact').value = bc.contactLivraison;
    document.getElementById('deliveryPhone').value = bc.phoneLivraison;
}

function openMap() {
    if (state.selectedBC && state.selectedBC.gps) {
        const [lat, lng] = state.selectedBC.gps.split(',').map(s => s.trim());
        window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
    }
}

// =====================================================
// CNI UPLOAD
// =====================================================

function uploadCNI() {
    // Simulate file upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';

    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // In a real app, this would upload the file
            showNotification('Photo CNI enregistrée', 'success');

            // Update checklist
            const cniCheck = document.querySelector('#validationChecklist .checklist-item:nth-child(3) i');
            if (cniCheck) {
                cniCheck.className = 'fa-solid fa-check-circle';
            }
        }
    };

    input.click();
}

// =====================================================
// VALIDATION & RECAP
// =====================================================

function updateRecap() {
    // BC Info
    if (state.selectedBC) {
        document.getElementById('recapBC').textContent = state.selectedBC.numero;
        document.getElementById('recapClient').textContent = `${state.selectedBC.client} - ${state.selectedBC.adresseLivraison.split(',')[0]}`;
    }

    // Articles
    const selectedCount = state.selectedArticles.filter(a => a.selected).length;
    const totalCount = state.selectedArticles.length;
    const hasPartial = state.selectedArticles.some(a => a.reste > 0);
    document.getElementById('recapArticles').textContent = hasPartial
        ? `${selectedCount}/${totalCount} (livraison partielle)`
        : `${selectedCount}/${totalCount}`;

    // Vehicle
    if (state.selectedVehicle) {
        const transporter = document.getElementById('transporter');
        const transporterName = transporter.options[transporter.selectedIndex]?.text || '';
        document.getElementById('recapVehicle').textContent = `${state.selectedVehicle.nom} - ${transporterName}`;
    }

    // Driver
    const driverName = document.getElementById('driverName').value;
    const driverCNI = document.getElementById('driverCNI').value;
    document.getElementById('recapDriver').textContent = driverName
        ? `${driverName} ${driverCNI ? '(CNI OK)' : '(CNI manquant)'}`
        : 'Non renseigné';

    // Departure
    const deliveryDate = document.getElementById('deliveryDate').value;
    const departureTime = document.getElementById('departureTime').value;
    if (deliveryDate && departureTime) {
        const dateObj = new Date(deliveryDate);
        const dateStr = dateObj.toLocaleDateString('fr-FR');
        document.getElementById('recapDeparture').textContent = `${dateStr} à ${departureTime}`;
    }

    // Update checklist
    updateValidationChecklist();
}

function updateValidationChecklist() {
    const checklist = document.getElementById('validationChecklist');
    if (!checklist) return;

    // Stock check
    const allStockOk = state.selectedArticles.filter(a => a.selected).every(a => a.qteALivrer > 0);
    updateChecklistItem(checklist, 0, allStockOk);

    // Vehicle check
    const vehicleOk = state.selectedVehicle !== null;
    updateChecklistItem(checklist, 1, vehicleOk);

    // CNI check
    const cniOk = document.getElementById('driverCNI').value.length > 5;
    updateChecklistItem(checklist, 2, cniOk);
}

function updateChecklistItem(checklist, index, isValid) {
    const items = checklist.querySelectorAll('.checklist-item');
    if (items[index]) {
        const icon = items[index].querySelector('i');
        icon.className = isValid
            ? 'fa-solid fa-check-circle'
            : 'fa-solid fa-exclamation-circle';
    }
}

function validateBL() {
    // Validate required fields
    const errors = [];

    if (!state.selectedBC) {
        errors.push('Veuillez sélectionner un bon de commande source');
    }

    const selectedArticles = state.selectedArticles.filter(a => a.selected && a.qteALivrer > 0);
    if (selectedArticles.length === 0) {
        errors.push('Veuillez sélectionner au moins un article à livrer');
    }

    if (!state.selectedVehicle) {
        errors.push('Veuillez sélectionner un véhicule');
    }

    if (!document.getElementById('driverName').value) {
        errors.push('Veuillez renseigner le nom du chauffeur');
    }

    if (!document.getElementById('driverCNI').value) {
        errors.push('Veuillez renseigner le N° CNI du chauffeur');
    }

    if (!document.getElementById('deliveryDate').value) {
        errors.push('Veuillez renseigner la date de livraison');
    }

    if (errors.length > 0) {
        alert('Erreurs de validation:\n\n' + errors.join('\n'));
        return;
    }

    // Simulate validation
    if (confirm('Confirmer la validation du bon de livraison ?')) {
        showNotification('Bon de livraison validé avec succès', 'success');
        setTimeout(() => {
            window.location.href = './livraisons-list.html';
        }, 1500);
    }
}

// =====================================================
// PRINT PREVIEW
// =====================================================

function openPreviewModal() {
    updatePrintPreview();
    document.getElementById('previewModal').classList.add('show');
}

function closePreviewModal() {
    document.getElementById('previewModal').classList.remove('show');
}

function updatePrintPreview() {
    // Header info
    document.getElementById('printBLNumber').textContent = `N° ${state.blNumber}`;

    // Date
    const deliveryDate = document.getElementById('deliveryDate').value;
    if (deliveryDate) {
        const dateObj = new Date(deliveryDate);
        document.getElementById('printDate').textContent = dateObj.toLocaleDateString('fr-FR');
    }

    // Client info
    if (state.selectedBC) {
        document.getElementById('printClientName').textContent = state.selectedBC.client;
        document.getElementById('printClientAddress').textContent = state.selectedBC.adresseLivraison;
        document.getElementById('printClientContact').textContent = document.getElementById('deliveryContact').value;
        document.getElementById('printClientPhone').textContent = document.getElementById('deliveryPhone').value;
        document.getElementById('printBCRef').textContent = state.selectedBC.numero;
    }

    // Transport info
    const transporter = document.getElementById('transporter');
    document.getElementById('printTransport').textContent = transporter.options[transporter.selectedIndex]?.text || '-';

    if (state.selectedVehicle) {
        document.getElementById('printVehicle').textContent = `${state.selectedVehicle.nom} (${state.selectedVehicle.immatriculation})`;
    }

    document.getElementById('printDriver').textContent = document.getElementById('driverName').value || '-';
    document.getElementById('printDriverCNI').textContent = document.getElementById('driverCNI').value || '-';

    // Articles table
    const tbody = document.getElementById('printArticlesBody');
    const selectedArticles = state.selectedArticles.filter(a => a.selected);

    tbody.innerHTML = selectedArticles.map((article, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${article.ref} - ${article.nom}</td>
            <td style="text-align: center;">${article.qteCommandee} ${article.unite}</td>
            <td style="text-align: center;">${article.qteALivrer} ${article.unite}</td>
            <td></td>
        </tr>
    `).join('');
}

function printBL() {
    const content = document.getElementById('printPreviewContent');
    const printWindow = window.open('', '_blank');

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>BL - ${state.blNumber}</title>
            <style>
                * { font-family: Arial, sans-serif; }
                body { padding: 20px; font-size: 12px; }
                .print-header { display: flex; justify-content: space-between; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #1F2937; }
                .print-title { text-align: center; font-size: 18px; font-weight: 700; margin: 20px 0; }
                .print-parties { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 20px; }
                .print-party h4 { font-size: 12px; font-weight: 600; margin: 0 0 8px 0; color: #6B7280; }
                .print-party p { margin: 4px 0; }
                .print-info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 20px; font-size: 11px; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #D1D5DB; padding: 8px; text-align: left; font-size: 11px; }
                th { background: #F3F4F6; font-weight: 600; }
                .print-signatures { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 40px; }
                .print-signature-box { border-top: 1px solid #1F2937; padding-top: 8px; font-size: 11px; }
                .print-signature-line { height: 60px; border-bottom: 1px dotted #6B7280; margin: 10px 0; }
                @media print { body { padding: 0; } }
            </style>
        </head>
        <body>
            ${content.innerHTML}
        </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
}

// =====================================================
// FORM ACTIONS
// =====================================================

function saveDraft() {
    // Simulate saving
    showNotification('Brouillon sauvegardé', 'success');
}

function cancelForm() {
    if (confirm('Voulez-vous vraiment annuler ? Les modifications non sauvegardées seront perdues.')) {
        window.location.href = './livraisons-list.html';
    }
}

// =====================================================
// UTILITIES
// =====================================================

function formatMoney(amount) {
    return new Intl.NumberFormat('fr-FR').format(amount);
}

function formatNumber(num) {
    return new Intl.NumberFormat('fr-FR').format(num);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 3000;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
    `;

    const icon = type === 'success' ? 'fa-check-circle' :
                 type === 'warning' ? 'fa-exclamation-triangle' :
                 type === 'danger' ? 'fa-times-circle' : 'fa-info-circle';

    notification.innerHTML = `
        <i class="fa-solid ${icon}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    // Add animation styles if not exists
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

    // Remove after delay
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

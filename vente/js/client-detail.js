// ================================================
// CLIENT-DETAIL.JS
// Gestion de la fiche client complète (10 onglets)
// Conforme au wireframe ECR-CLI-004
// ================================================

// Données client simulées
const clientData = {
    // Informations générales
    code: 'CLI-2024-00156',
    status: 'ACTIVE',
    customerType: 'ENTREPRISE',
    subType: 'Grossiste',
    businessName: 'SONACOM SARL',
    tradeName: 'SONACOM DISTRIBUTION',
    legalForm: 'SARL',
    legalFormFull: 'Société à Responsabilité Limitée',
    rccm: 'RC/DLA/2020/B/1234',
    taxId: 'P087201234567W',
    taxIdVerified: true,
    capital: 50000000,
    employeeCount: '51-100',
    industry: 'BTP / Distribution matériaux',
    website: 'www.sonacom.cm',

    // Dates
    createdAt: '15/01/2024',
    updatedAt: '28/01/2024',
    createdBy: 'Marie DJOMO',

    // Régime Fiscal
    taxRegime: 'REEL',
    taxRegimeLabel: 'RÉEL (TVA 19.25%)',
    vatSubject: true,
    withholdingTax: true,
    withholdingRate: 1.1,
    taxpayerNumber: 'P087201234567W',

    // Adresses
    addresses: [
        {
            id: 'addr-1',
            type: 'SIEGE',
            label: 'Siège Social',
            street: 'Boulevard de la Liberté',
            neighborhood: 'Bonanjo',
            city: 'Douala',
            region: 'Littoral',
            country: 'Cameroun',
            gpsLat: '4.0511',
            gpsLng: '9.7679',
            contactName: 'M. NJOYA',
            contactPhone: '+237 699 456 789',
            isDefaultBilling: true,
            isDefaultDelivery: false
        },
        {
            id: 'addr-2',
            type: 'LIVRAISON',
            label: 'Entrepôt Bassa',
            street: 'Zone Industrielle Bassa',
            neighborhood: 'Bassa',
            city: 'Douala',
            region: 'Littoral',
            country: 'Cameroun',
            gpsLat: '4.0234',
            gpsLng: '9.7123',
            contactName: 'Paul NJOYA',
            contactPhone: '+237 677 890 123',
            deliveryInstructions: 'Entrée par le portail principal',
            isDefaultBilling: false,
            isDefaultDelivery: true
        }
    ],

    // Contacts
    contacts: [
        {
            id: 'contact-1',
            isPrimary: true,
            civility: 'M.',
            firstName: 'Pierre',
            lastName: 'FOTSO',
            role: 'Directeur Commercial',
            service: 'Direction',
            emailPro: 'p.fotso@sonacom.cm',
            mobile: '+237 699 123 456',
            phone: '+237 233 456 789',
            whatsapp: '+237 699 123 456',
            preferredChannel: 'WHATSAPP',
            contactHours: '8h-18h en semaine',
            isDecisionMaker: true,
            receiveInvoices: true
        },
        {
            id: 'contact-2',
            isPrimary: false,
            civility: 'Mme',
            firstName: 'Marie',
            lastName: 'NGONO',
            role: 'Comptable',
            service: 'Comptabilité',
            emailPro: 'comptabilite@sonacom.cm',
            mobile: '+237 677 234 567',
            preferredChannel: 'EMAIL',
            receiveInvoices: true,
            receiveReminders: true
        }
    ],

    // Commercial
    assignedCommercial: {
        code: 'COM-025',
        name: 'Marie DJOMO',
        zone: 'Douala - Secteur Centre',
        email: 'm.djomo@multiflex.cm',
        phone: '+237 677 234 567',
        since: '15/01/2024',
        daysSince: 14,
        totalCaution: 5000000,
        availableCaution: 3500000,
        usedCaution: 1500000,
        cautionDetails: [
            { ref: 'BC-2024-00234', amount: 1000000, status: 'En cours' },
            { ref: 'BC-2024-00189', amount: 500000, status: 'En cours' }
        ]
    },

    // Conditions de paiement
    paymentMode: 'CREDIT',
    creditLimit: 5000000,
    creditUsed: 2500000,
    creditAvailable: 2500000,
    paymentTerms: 30,
    earlyPaymentDiscount: 2,
    earlyPaymentDays: 10,
    paymentMethods: {
        virement: true,
        cheque: true,
        mobileMoney: false,
        especes: false
    },
    validatePreviousBalance: true,
    autoBlockOverdue: true,
    deliveryFeeExempt: false,
    minOrderAmount: 50000,

    // Tarification
    priceList: 'TARIF-GROSSISTE-2024',
    priceListType: 'Prix de gros B2B',
    priceListValidity: '01/01/2024 - 31/12/2024',
    permanentDiscount: 0,
    specialPrices: [
        { code: 'PEINT-BLC-05L', name: 'Peinture Blanche 5L', specialPrice: 4200, normalPrice: 4500 },
        { code: 'CIMENT-50KG', name: 'Ciment 50kg', specialPrice: 6800, normalPrice: 7000 },
        { code: 'FER-12MM', name: 'Fer à béton 12mm', specialPrice: 4500, normalPrice: 4750 }
    ],

    // Financier
    currentBalance: 2500000,
    totalOutstanding: 3750000,
    limitUsagePercent: 75,
    balanceByCompany: [
        { company: 'IOLA BTP', invoiced: 5500000, paid: 3500000, balance: 2000000, status: 'warning' },
        { company: 'IOLA INDUSTRIE', invoiced: 1200000, paid: 700000, balance: 500000, status: 'ok' },
        { company: 'IOLA SERVICES', invoiced: 0, paid: 0, balance: 0, status: 'ok' }
    ],
    schedule: [
        { ref: 'FA-2024-0234', date: '02/01/24', amount: 800000, dueDate: '01/02/24', daysLeft: -27, status: 'overdue' },
        { ref: 'FA-2024-0256', date: '10/01/24', amount: 700000, dueDate: '09/02/24', daysLeft: 11, status: 'warning' },
        { ref: 'FA-2024-0289', date: '15/01/24', amount: 500000, dueDate: '14/02/24', daysLeft: 16, status: 'ok' },
        { ref: 'FA-2024-0301', date: '20/01/24', amount: 500000, dueDate: '19/02/24', daysLeft: 21, status: 'ok' }
    ],
    metrics: {
        totalRevenue: 125450000,
        yearRevenue: 15230000,
        monthRevenue: 3500000,
        avgMonthlyRevenue: 10454167,
        avgBasket: 750000,
        avgPaymentDelay: 35,
        onTimePaymentRate: 65,
        creditScore: 'B+',
        creditScoreLabel: 'Bon payeur avec retards'
    },

    // Documents
    documents: [
        { type: 'RCCM', label: 'Registre de Commerce', number: 'RC/DLA/2020/B/1234', issueDate: '15/01/2020', expiryDate: null, status: 'valid', file: 'rccm_sonacom.pdf' },
        { type: 'ANR', label: 'Attestation Non-Redevance', number: 'ANR/2024/0001234', issueDate: '01/01/2024', expiryDate: '31/12/2024', daysToExpiry: 15, status: 'expiring', file: 'anr_sonacom_2024.pdf' },
        { type: 'CARTE_CONTRIBUABLE', label: 'Carte Contribuable', number: 'P087201234567W', issueDate: '10/03/2020', expiryDate: '10/03/2025', status: 'valid', file: 'carte_contribuable.pdf' }
    ],
    optionalDocuments: [
        { type: 'STATUTS', label: 'Statuts de la société', file: 'statuts_sonacom.pdf' },
        { type: 'CONTRAT', label: 'Contrat cadre', file: 'contrat_2024.pdf' }
    ],

    // Alertes
    alerts: [
        { type: 'warning', icon: 'exclamation-triangle', message: 'Attestation Non-Redevance expire dans 15 jours (31/12/2024)' },
        { type: 'info', icon: 'info-circle', message: 'Dernière commande il y a 5 jours' },
        { type: 'success', icon: 'check-circle', message: 'Tous les documents obligatoires sont à jour' }
    ],

    // Historique
    history: [
        { date: '28/01/2024', time: '10:15', type: 'ORDER', icon: 'shopping-cart', title: 'COMMANDE CRÉÉE', description: 'BC-2024-00456 - Montant: 1,250,000 XAF', user: 'Marie DJOMO', status: 'En validation', color: 'info' },
        { date: '25/01/2024', time: '14:30', type: 'PAYMENT', icon: 'money-bill-wave', title: 'PAIEMENT REÇU', description: 'Facture FA-2024-0234 - Montant: 800,000 XAF\nMode: Virement - Référence: VIR-2024-1234', color: 'success' },
        { date: '20/01/2024', time: '11:45', type: 'REMINDER', icon: 'envelope', title: 'RELANCE ENVOYÉE', description: 'Facture FA-2024-0189 en retard de 15 jours\nEmail envoyé à: comptabilite@sonacom.cm', color: 'warning' },
        { date: '15/01/2024', time: '09:00', type: 'DELIVERY', icon: 'truck', title: 'LIVRAISON EFFECTUÉE', description: 'BL-2024-0301 - 15 articles livrés\nTransporteur: KAMGA Transport - Reçu par: P. NJOYA', color: 'success' },
        { date: '10/01/2024', time: '16:20', type: 'INVOICE', icon: 'file-invoice', title: 'FACTURE GÉNÉRÉE', description: 'FA-2024-0289 depuis BL-2024-0278\nMontant: 500,000 XAF - Échéance: 09/02/2024', color: 'info' },
        { date: '05/01/2024', time: '13:15', type: 'ALERT', icon: 'exclamation-circle', title: 'LIMITE CRÉDIT ATTEINTE', description: 'Limite: 5,000,000 XAF - Utilisé: 5,000,000 XAF\nNouvelles commandes nécessitent validation Direction', color: 'danger' },
        { date: '02/01/2024', time: '10:00', type: 'MODIFICATION', icon: 'edit', title: 'MODIFICATION FICHE', description: 'Limite crédit augmentée de 3M à 5M XAF\nPar: Paul NGA (Direction Commerciale)\nMotif: Client stratégique - Volume en croissance', color: 'info' }
    ],

    // Commandes
    orders: [
        { ref: 'BC-2024-00456', date: '28/01/2024', amount: 1250000, status: 'PENDING', statusLabel: 'En validation', items: 8 },
        { ref: 'BC-2024-00398', date: '20/01/2024', amount: 890000, status: 'DELIVERED', statusLabel: 'Livrée', items: 5 },
        { ref: 'BC-2024-00345', date: '15/01/2024', amount: 1500000, status: 'DELIVERED', statusLabel: 'Livrée', items: 12 },
        { ref: 'BC-2024-00289', date: '10/01/2024', amount: 750000, status: 'INVOICED', statusLabel: 'Facturée', items: 6 },
        { ref: 'BC-2024-00234', date: '05/01/2024', amount: 1100000, status: 'INVOICED', statusLabel: 'Facturée', items: 9 }
    ],

    // Factures
    invoices: [
        { ref: 'FA-2024-0301', date: '20/01/2024', amount: 500000, dueDate: '19/02/2024', status: 'PENDING', statusLabel: 'En attente', amountPaid: 0 },
        { ref: 'FA-2024-0289', date: '15/01/2024', amount: 500000, dueDate: '14/02/2024', status: 'PENDING', statusLabel: 'En attente', amountPaid: 0 },
        { ref: 'FA-2024-0256', date: '10/01/2024', amount: 700000, dueDate: '09/02/2024', status: 'PENDING', statusLabel: 'En attente', amountPaid: 0 },
        { ref: 'FA-2024-0234', date: '02/01/2024', amount: 800000, dueDate: '01/02/2024', status: 'PAID', statusLabel: 'Payée', amountPaid: 800000 },
        { ref: 'FA-2023-1289', date: '15/12/2023', amount: 950000, dueDate: '14/01/2024', status: 'PAID', statusLabel: 'Payée', amountPaid: 950000 }
    ],

    // Notes
    notes: [
        { id: 1, date: '25/01/2024', author: 'Marie DJOMO', content: 'Client très réactif pour les paiements malgré quelques retards. Préfère être contacté par WhatsApp.' },
        { id: 2, date: '15/01/2024', author: 'Paul NGA', content: 'Augmentation limite crédit validée. Client stratégique avec fort potentiel de croissance.' },
        { id: 3, date: '02/01/2024', author: 'Marie DJOMO', content: 'Demande de tarifs spéciaux sur les peintures et ciments. À négocier avec Direction.' }
    ],

    // Stats période
    periodStats: {
        orders: 12,
        deliveries: 10,
        invoices: 10,
        payments: 8,
        returns: 1,
        creditNotes: 1,
        complaints: 0
    }
};

// ================================================
// INITIALISATION
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Initialisation de la fiche client...');

    // Charger les données dans l'en-tête
    loadHeaderData();

    // Charger l'onglet Général par défaut
    loadGeneralTab();

    // Charger tous les onglets en arrière-plan
    loadAddressesTab();
    loadContactsTab();
    loadCommercialTab();
    loadFinancialTab();
    loadDocumentsTab();
    loadHistoryTab();
    loadOrdersTab();
    loadInvoicesTab();
    loadNotesTab();
});

// ================================================
// NAVIGATION ONGLETS
// ================================================

function switchTab(tabId) {
    // Désactiver tous les onglets
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    // Activer l'onglet sélectionné
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(`tab-${tabId}`).classList.add('active');
}

// ================================================
// CHARGEMENT EN-TÊTE
// ================================================

function loadHeaderData() {
    document.getElementById('client-name').textContent = clientData.businessName;
    document.getElementById('client-code').textContent = clientData.code;
    document.getElementById('created-date').textContent = clientData.createdAt;
    document.getElementById('updated-date').textContent = clientData.updatedAt;

    // Statut
    const statusEl = document.getElementById('client-status');
    const statusClass = clientData.status === 'ACTIVE' ? 'status-active' :
                        clientData.status === 'DRAFT' ? 'status-draft' :
                        clientData.status === 'BLOCKED' ? 'status-blocked' : 'status-suspended';
    const statusLabel = clientData.status === 'ACTIVE' ? 'ACTIF' :
                        clientData.status === 'DRAFT' ? 'BROUILLON' :
                        clientData.status === 'BLOCKED' ? 'BLOQUÉ' : 'SUSPENDU';
    statusEl.className = `status-badge-large ${statusClass}`;
    statusEl.innerHTML = `<i class="fa-solid fa-circle" style="font-size: 8px;"></i> ${statusLabel}`;
}

// ================================================
// ONGLET GÉNÉRAL
// ================================================

function loadGeneralTab() {
    // Identification
    const identificationHtml = `
        <div class="info-item">
            <div class="info-label">Type Client</div>
            <div class="info-value"><i class="fa-solid fa-building" style="color: #263c89; margin-right: 6px;"></i>${clientData.customerType} - ${clientData.subType}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Raison Sociale</div>
            <div class="info-value highlight">${clientData.businessName}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Nom Commercial</div>
            <div class="info-value">${clientData.tradeName}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Forme Juridique</div>
            <div class="info-value">${clientData.legalForm} (${clientData.legalFormFull})</div>
        </div>
        <div class="info-item">
            <div class="info-label">RCCM</div>
            <div class="info-value">${clientData.rccm}</div>
        </div>
        <div class="info-item">
            <div class="info-label">NUI</div>
            <div class="info-value">${clientData.taxId} ${clientData.taxIdVerified ? '<i class="fa-solid fa-check-circle check-icon"></i> Vérifié' : ''}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Capital Social</div>
            <div class="info-value">${formatMoney(clientData.capital)} XAF</div>
        </div>
        <div class="info-item">
            <div class="info-label">Effectif</div>
            <div class="info-value">${clientData.employeeCount} employés</div>
        </div>
        <div class="info-item">
            <div class="info-label">Secteur</div>
            <div class="info-value">${clientData.industry}</div>
        </div>
    `;
    document.getElementById('identification-info').innerHTML = identificationHtml;

    // Régime Fiscal
    const fiscalHtml = `
        <div class="info-item">
            <div class="info-label">Régime Imposition</div>
            <div class="info-value">${clientData.taxRegimeLabel}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Assujetti TVA</div>
            <div class="info-value">${clientData.vatSubject ? '<i class="fa-solid fa-check check-icon"></i> Oui - Collecte et déduit la TVA' : '<i class="fa-solid fa-times cross-icon"></i> Non'}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Retenue Source</div>
            <div class="info-value">${clientData.withholdingTax ? `<i class="fa-solid fa-check check-icon"></i> Oui - Taux ${clientData.withholdingRate}%` : '<i class="fa-solid fa-times cross-icon"></i> Non'}</div>
        </div>
        <div class="info-item">
            <div class="info-label">N° Contribuable</div>
            <div class="info-value">${clientData.taxpayerNumber}</div>
        </div>
    `;
    document.getElementById('fiscal-info').innerHTML = fiscalHtml;

    // Coordonnées principales
    const mainAddress = clientData.addresses.find(a => a.type === 'SIEGE') || clientData.addresses[0];
    const mainContact = clientData.contacts.find(c => c.isPrimary) || clientData.contacts[0];

    const coordinatesHtml = `
        <div class="info-grid" style="margin-bottom: 16px;">
            <div class="info-item" style="grid-column: 1 / -1;">
                <div class="info-label"><i class="fa-solid fa-map-marker-alt" style="margin-right: 6px;"></i> Adresse Siège</div>
                <div class="info-value">
                    ${mainAddress.street}, ${mainAddress.neighborhood}<br>
                    ${mainAddress.city}, ${mainAddress.region}, ${mainAddress.country}
                    ${mainAddress.gpsLat ? `<br><span style="font-size: 12px; color: #6B7280;">GPS: ${mainAddress.gpsLat}, ${mainAddress.gpsLng}</span> <a href="#" onclick="viewMap('${mainAddress.gpsLat}', '${mainAddress.gpsLng}')" style="color: #263c89; font-size: 12px;"><i class="fa-solid fa-map"></i> Voir carte</a>` : ''}
                </div>
            </div>
        </div>
        <div class="info-grid">
            <div class="info-item">
                <div class="info-label"><i class="fa-solid fa-user" style="margin-right: 6px;"></i> Contact Principal</div>
                <div class="info-value">${mainContact.civility} ${mainContact.firstName} ${mainContact.lastName} - ${mainContact.role}</div>
            </div>
            <div class="info-item">
                <div class="info-label"><i class="fa-solid fa-phone" style="margin-right: 6px;"></i> Téléphone</div>
                <div class="info-value">${mainContact.mobile} (Mobile/WhatsApp)</div>
            </div>
            <div class="info-item">
                <div class="info-label"><i class="fa-solid fa-envelope" style="margin-right: 6px;"></i> Email</div>
                <div class="info-value"><a href="mailto:${mainContact.emailPro}" style="color: #263c89;">${mainContact.emailPro}</a></div>
            </div>
            <div class="info-item">
                <div class="info-label"><i class="fa-solid fa-globe" style="margin-right: 6px;"></i> Site Web</div>
                <div class="info-value"><a href="https://${clientData.website}" target="_blank" style="color: #263c89;">${clientData.website}</a></div>
            </div>
        </div>
    `;
    document.getElementById('main-coordinates').innerHTML = coordinatesHtml;

    // Alertes
    const alertsHtml = clientData.alerts.map(alert => `
        <div class="alert-box alert-${alert.type}">
            <i class="fa-solid fa-${alert.icon}"></i>
            <div>${alert.message}</div>
        </div>
    `).join('');
    document.getElementById('alerts-container').innerHTML = alertsHtml;
}

// ================================================
// ONGLET ADRESSES
// ================================================

function loadAddressesTab() {
    const addressesHtml = clientData.addresses.map((address, index) => `
        <div class="address-card">
            <div class="card-header">
                <div class="card-title">
                    <i class="fa-solid fa-map-marker-alt" style="color: #263c89;"></i>
                    ${address.label}
                    ${address.isDefaultBilling ? '<span class="card-badge">Facturation</span>' : ''}
                    ${address.isDefaultDelivery ? '<span class="card-badge" style="background: #D1FAE5; color: #065F46;">Livraison</span>' : ''}
                </div>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-secondary btn-sm" onclick="editAddress('${address.id}')">
                        <i class="fa-solid fa-edit"></i>
                    </button>
                    ${index > 0 ? `<button class="btn btn-secondary btn-sm" style="color: #EF4444;" onclick="deleteAddress('${address.id}')"><i class="fa-solid fa-trash"></i></button>` : ''}
                </div>
            </div>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Type</div>
                    <div class="info-value">${address.type}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Adresse</div>
                    <div class="info-value">${address.street}, ${address.neighborhood}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Ville</div>
                    <div class="info-value">${address.city}, ${address.region}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">GPS</div>
                    <div class="info-value">${address.gpsLat}, ${address.gpsLng} <a href="#" onclick="viewMap('${address.gpsLat}', '${address.gpsLng}')" style="color: #263c89;"><i class="fa-solid fa-map"></i></a></div>
                </div>
                <div class="info-item">
                    <div class="info-label">Contact</div>
                    <div class="info-value">${address.contactName}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Téléphone</div>
                    <div class="info-value">${address.contactPhone}</div>
                </div>
                ${address.deliveryInstructions ? `
                <div class="info-item" style="grid-column: 1 / -1;">
                    <div class="info-label">Instructions Livraison</div>
                    <div class="info-value">${address.deliveryInstructions}</div>
                </div>
                ` : ''}
            </div>
        </div>
    `).join('');
    document.getElementById('addresses-list').innerHTML = addressesHtml;
}

// ================================================
// ONGLET CONTACTS
// ================================================

function loadContactsTab() {
    const contactsHtml = clientData.contacts.map((contact, index) => `
        <div class="contact-card">
            <div class="card-header">
                <div class="card-title">
                    <i class="fa-solid fa-user" style="color: #263c89;"></i>
                    ${contact.civility} ${contact.firstName} ${contact.lastName}
                    ${contact.isPrimary ? '<span class="card-badge">Principal</span>' : ''}
                    ${contact.isDecisionMaker ? '<span class="card-badge" style="background: #FEF3C7; color: #92400E;">Décisionnaire</span>' : ''}
                </div>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-secondary btn-sm" onclick="editContact('${contact.id}')">
                        <i class="fa-solid fa-edit"></i>
                    </button>
                    ${!contact.isPrimary ? `<button class="btn btn-secondary btn-sm" style="color: #EF4444;" onclick="deleteContact('${contact.id}')"><i class="fa-solid fa-trash"></i></button>` : ''}
                </div>
            </div>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Fonction</div>
                    <div class="info-value">${contact.role}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Service</div>
                    <div class="info-value">${contact.service || '-'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Email</div>
                    <div class="info-value"><a href="mailto:${contact.emailPro}" style="color: #263c89;">${contact.emailPro}</a></div>
                </div>
                <div class="info-item">
                    <div class="info-label">Mobile</div>
                    <div class="info-value">${contact.mobile}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Canal Préféré</div>
                    <div class="info-value">${contact.preferredChannel}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Horaires</div>
                    <div class="info-value">${contact.contactHours || '-'}</div>
                </div>
            </div>
            <div style="margin-top: 12px; font-size: 12px; color: #6B7280;">
                ${contact.receiveInvoices ? '<i class="fa-solid fa-check check-icon"></i> Reçoit les factures ' : ''}
                ${contact.receiveReminders ? '<i class="fa-solid fa-check check-icon"></i> Reçoit les relances' : ''}
            </div>
        </div>
    `).join('');
    document.getElementById('contacts-list').innerHTML = contactsHtml;
}

// ================================================
// ONGLET COMMERCIAL
// ================================================

function loadCommercialTab() {
    const commercial = clientData.assignedCommercial;

    // Commercial Attitré
    const commercialHtml = `
        <div class="info-grid" style="margin-bottom: 20px;">
            <div class="info-item">
                <div class="info-label">Commercial</div>
                <div class="info-value highlight">${commercial.name} (${commercial.code})</div>
            </div>
            <div class="info-item">
                <div class="info-label">Zone</div>
                <div class="info-value">${commercial.zone}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Depuis</div>
                <div class="info-value">${commercial.since} (${commercial.daysSince} jours)</div>
            </div>
            <div class="info-item">
                <div class="info-label">Email</div>
                <div class="info-value"><a href="mailto:${commercial.email}" style="color: #263c89;">${commercial.email}</a></div>
            </div>
            <div class="info-item">
                <div class="info-label">Téléphone</div>
                <div class="info-value">${commercial.phone}</div>
            </div>
        </div>
        <div style="background: #EFF6FF; border: 1px solid #3B82F6; border-radius: 8px; padding: 16px;">
            <h4 style="font-size: 14px; font-weight: 600; color: #1E40AF; margin-bottom: 12px;">
                <i class="fa-solid fa-shield-halved"></i> Caution du Commercial
            </h4>
            <div class="info-grid-3">
                <div class="info-item">
                    <div class="info-label">Caution Totale</div>
                    <div class="info-value">${formatMoney(commercial.totalCaution)} XAF</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Disponible</div>
                    <div class="info-value" style="color: #10B981;">${formatMoney(commercial.availableCaution)} XAF (70%)</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Utilisée</div>
                    <div class="info-value" style="color: #F59E0B;">${formatMoney(commercial.usedCaution)} XAF</div>
                </div>
            </div>
            ${commercial.cautionDetails.length > 0 ? `
            <div style="margin-top: 12px; font-size: 13px; color: #374151;">
                ${commercial.cautionDetails.map(d => `<div style="margin-left: 16px;">- ${d.ref}: ${formatMoney(d.amount)} XAF (${d.status})</div>`).join('')}
            </div>
            ` : ''}
        </div>
    `;
    document.getElementById('commercial-info').innerHTML = commercialHtml;

    // Conditions de Paiement
    const paymentHtml = `
        <div class="info-grid" style="margin-bottom: 20px;">
            <div class="info-item">
                <div class="info-label">Mode Principal</div>
                <div class="info-value highlight">${clientData.paymentMode === 'CREDIT' ? 'CRÉDIT AUTORISÉ' : 'COMPTANT UNIQUEMENT'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Limite de Crédit</div>
                <div class="info-value">${formatMoney(clientData.creditLimit)} XAF</div>
            </div>
            <div class="info-item">
                <div class="info-label">Crédit Utilisé</div>
                <div class="info-value" style="color: #F59E0B;">${formatMoney(clientData.creditUsed)} XAF (${Math.round(clientData.creditUsed / clientData.creditLimit * 100)}%)</div>
            </div>
            <div class="info-item">
                <div class="info-label">Crédit Disponible</div>
                <div class="info-value" style="color: #10B981;">${formatMoney(clientData.creditAvailable)} XAF</div>
            </div>
            <div class="info-item">
                <div class="info-label">Délai Paiement</div>
                <div class="info-value">NET ${clientData.paymentTerms} jours</div>
            </div>
            <div class="info-item">
                <div class="info-label">Escompte</div>
                <div class="info-value">${clientData.earlyPaymentDiscount}% si paiement < ${clientData.earlyPaymentDays} jours</div>
            </div>
        </div>
        <div class="info-grid" style="margin-bottom: 16px;">
            <div class="info-item">
                <div class="info-label">Modes Autorisés</div>
                <div class="info-value">
                    ${clientData.paymentMethods.virement ? '<i class="fa-solid fa-check check-icon"></i> Virement ' : '<i class="fa-solid fa-times cross-icon"></i> Virement '}
                    ${clientData.paymentMethods.cheque ? '<i class="fa-solid fa-check check-icon"></i> Chèque ' : '<i class="fa-solid fa-times cross-icon"></i> Chèque '}
                    ${clientData.paymentMethods.mobileMoney ? '<i class="fa-solid fa-check check-icon"></i> Mobile Money ' : '<i class="fa-solid fa-times cross-icon"></i> Mobile Money '}
                    ${clientData.paymentMethods.especes ? '<i class="fa-solid fa-check check-icon"></i> Espèces' : '<i class="fa-solid fa-times cross-icon"></i> Espèces (Limite 100K)'}
                </div>
            </div>
            <div class="info-item">
                <div class="info-label">Min. Commande</div>
                <div class="info-value">${formatMoney(clientData.minOrderAmount)} XAF</div>
            </div>
        </div>
        <div class="info-item">
            <div class="info-label">Conditions</div>
            <div class="info-value" style="font-size: 13px;">
                ${clientData.validatePreviousBalance ? '<i class="fa-solid fa-check check-icon"></i>' : '<i class="fa-solid fa-times cross-icon"></i>'} Validation solde précédent obligatoire<br>
                ${clientData.autoBlockOverdue ? '<i class="fa-solid fa-check check-icon"></i>' : '<i class="fa-solid fa-times cross-icon"></i>'} Blocage si impayé > ${clientData.paymentTerms} jours<br>
                ${clientData.deliveryFeeExempt ? '<i class="fa-solid fa-check check-icon"></i>' : '<i class="fa-solid fa-times cross-icon"></i>'} Exonéré frais livraison
            </div>
        </div>
    `;
    document.getElementById('payment-conditions').innerHTML = paymentHtml;

    // Tarification
    const pricingHtml = `
        <div class="info-grid" style="margin-bottom: 20px;">
            <div class="info-item">
                <div class="info-label">Liste de Prix</div>
                <div class="info-value highlight">${clientData.priceList}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Type</div>
                <div class="info-value">${clientData.priceListType}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Validité</div>
                <div class="info-value">${clientData.priceListValidity}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Remise Permanente</div>
                <div class="info-value">${clientData.permanentDiscount}% (Pas de remise par défaut)</div>
            </div>
        </div>
        ${clientData.specialPrices.length > 0 ? `
        <div>
            <div class="info-label" style="margin-bottom: 8px;">Tarifs Spéciaux (${clientData.specialPrices.length} articles)</div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Désignation</th>
                        <th>Prix Spécial</th>
                        <th>Prix Normal</th>
                        <th>Remise</th>
                    </tr>
                </thead>
                <tbody>
                    ${clientData.specialPrices.map(p => `
                    <tr>
                        <td>${p.code}</td>
                        <td>${p.name}</td>
                        <td style="font-weight: 600; color: #10B981;">${formatMoney(p.specialPrice)} XAF</td>
                        <td style="text-decoration: line-through; color: #9CA3AF;">${formatMoney(p.normalPrice)} XAF</td>
                        <td><span style="background: #D1FAE5; color: #065F46; padding: 2px 8px; border-radius: 10px; font-size: 11px;">-${Math.round((1 - p.specialPrice / p.normalPrice) * 100)}%</span></td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        ` : ''}
    `;
    document.getElementById('pricing-info').innerHTML = pricingHtml;
}

// ================================================
// ONGLET FINANCIER
// ================================================

function loadFinancialTab() {
    // Soldes et Encours
    const balanceStatus = clientData.limitUsagePercent >= 90 ? 'negative' :
                          clientData.limitUsagePercent >= 70 ? 'warning' : 'positive';

    const balancesHtml = `
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 24px;">
            <div class="solde-card">
                <div class="solde-value">${formatMoney(clientData.currentBalance)} XAF</div>
                <div class="solde-label">SOLDE ACTUEL</div>
            </div>
            <div class="metric-card">
                <div class="metric-value" style="color: ${balanceStatus === 'negative' ? '#EF4444' : balanceStatus === 'warning' ? '#F59E0B' : '#10B981'};">${formatMoney(clientData.totalOutstanding)} XAF</div>
                <div class="metric-label">ENCOURS TOTAL</div>
                <div class="metric-indicator ${balanceStatus}">
                    <i class="fa-solid fa-${balanceStatus === 'positive' ? 'check-circle' : 'exclamation-triangle'}"></i>
                    ${clientData.limitUsagePercent}% de la limite
                </div>
            </div>
        </div>

        <h4 style="font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 12px;">Détail par Société IOLA</h4>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Société</th>
                    <th>Facturé</th>
                    <th>Payé</th>
                    <th>Solde</th>
                </tr>
            </thead>
            <tbody>
                ${clientData.balanceByCompany.map(c => `
                <tr>
                    <td style="font-weight: 500;">${c.company}</td>
                    <td>${formatMoney(c.invoiced)} XAF</td>
                    <td>${formatMoney(c.paid)} XAF</td>
                    <td style="font-weight: 600; color: ${c.status === 'warning' ? '#F59E0B' : c.status === 'danger' ? '#EF4444' : '#10B981'};">
                        ${formatMoney(c.balance)} XAF
                        <i class="fa-solid fa-circle" style="font-size: 8px; margin-left: 4px;"></i>
                    </td>
                </tr>
                `).join('')}
                <tr style="font-weight: 600; background: #F3F4F6;">
                    <td>TOTAL GROUPE</td>
                    <td>${formatMoney(clientData.balanceByCompany.reduce((sum, c) => sum + c.invoiced, 0))} XAF</td>
                    <td>${formatMoney(clientData.balanceByCompany.reduce((sum, c) => sum + c.paid, 0))} XAF</td>
                    <td>${formatMoney(clientData.balanceByCompany.reduce((sum, c) => sum + c.balance, 0))} XAF</td>
                </tr>
            </tbody>
        </table>
    `;
    document.getElementById('balances-info').innerHTML = balancesHtml;

    // Échéancier
    const scheduleHtml = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>N° Facture</th>
                    <th>Date</th>
                    <th>Montant</th>
                    <th>Échéance</th>
                    <th>Jours</th>
                    <th>Statut</th>
                </tr>
            </thead>
            <tbody>
                ${clientData.schedule.map(s => `
                <tr>
                    <td><a href="#" style="color: #263c89;">${s.ref}</a></td>
                    <td>${s.date}</td>
                    <td>${formatMoney(s.amount)} XAF</td>
                    <td>${s.dueDate}</td>
                    <td style="font-weight: 600; color: ${s.status === 'overdue' ? '#EF4444' : s.status === 'warning' ? '#F59E0B' : '#10B981'};">
                        ${s.daysLeft < 0 ? 'Échu' : s.daysLeft + ' j'}
                    </td>
                    <td>
                        <i class="fa-solid fa-circle" style="font-size: 10px; color: ${s.status === 'overdue' ? '#EF4444' : s.status === 'warning' ? '#F59E0B' : '#10B981'};"></i>
                    </td>
                </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    document.getElementById('schedule-info').innerHTML = scheduleHtml;

    // Métriques
    const metricsHtml = `
        <div class="info-grid" style="margin-bottom: 20px;">
            <div class="info-item">
                <div class="info-label">CA Total (historique)</div>
                <div class="info-value highlight">${formatMoney(clientData.metrics.totalRevenue)} XAF</div>
            </div>
            <div class="info-item">
                <div class="info-label">CA Année en cours</div>
                <div class="info-value">${formatMoney(clientData.metrics.yearRevenue)} XAF</div>
            </div>
            <div class="info-item">
                <div class="info-label">CA Mois en cours</div>
                <div class="info-value">${formatMoney(clientData.metrics.monthRevenue)} XAF</div>
            </div>
            <div class="info-item">
                <div class="info-label">CA Moyen mensuel</div>
                <div class="info-value">${formatMoney(clientData.metrics.avgMonthlyRevenue)} XAF</div>
            </div>
        </div>
        <div class="info-grid">
            <div class="info-item">
                <div class="info-label">Panier Moyen</div>
                <div class="info-value">${formatMoney(clientData.metrics.avgBasket)} XAF</div>
            </div>
            <div class="info-item">
                <div class="info-label">Délai Moyen Paiement</div>
                <div class="info-value">${clientData.metrics.avgPaymentDelay} jours</div>
            </div>
            <div class="info-item">
                <div class="info-label">Taux Paiement à temps</div>
                <div class="info-value" style="color: ${clientData.metrics.onTimePaymentRate >= 80 ? '#10B981' : clientData.metrics.onTimePaymentRate >= 60 ? '#F59E0B' : '#EF4444'};">${clientData.metrics.onTimePaymentRate}%</div>
            </div>
            <div class="info-item">
                <div class="info-label">Score Crédit</div>
                <div class="info-value">
                    <span class="score-badge b">${clientData.metrics.creditScore}</span>
                    <span style="margin-left: 8px; font-size: 12px; color: #6B7280;">${clientData.metrics.creditScoreLabel}</span>
                </div>
            </div>
        </div>
    `;
    document.getElementById('financial-metrics').innerHTML = metricsHtml;
}

// ================================================
// ONGLET DOCUMENTS
// ================================================

function loadDocumentsTab() {
    // Documents obligatoires
    const requiredDocsHtml = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Type</th>
                    <th>N° Document</th>
                    <th>Émis le</th>
                    <th>Expire le</th>
                    <th>Statut</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${clientData.documents.map(doc => `
                <tr>
                    <td style="font-weight: 500;">${doc.label}</td>
                    <td>${doc.number}</td>
                    <td>${doc.issueDate}</td>
                    <td>${doc.expiryDate || 'Permanent'}</td>
                    <td>
                        <span class="doc-status ${doc.status}">
                            <i class="fa-solid fa-${doc.status === 'valid' ? 'check-circle' : doc.status === 'expiring' ? 'exclamation-triangle' : 'times-circle'}"></i>
                            ${doc.status === 'valid' ? 'Valide' : doc.status === 'expiring' ? `Expire dans ${doc.daysToExpiry}j` : 'Expiré'}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-secondary btn-sm" onclick="viewDocument('${doc.file}')">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        <button class="btn btn-secondary btn-sm" onclick="downloadDocument('${doc.file}')">
                            <i class="fa-solid fa-download"></i>
                        </button>
                    </td>
                </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    document.getElementById('required-documents').innerHTML = requiredDocsHtml;

    // Documents optionnels
    const optionalDocsHtml = clientData.optionalDocuments.length > 0 ? `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Type</th>
                    <th>Fichier</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${clientData.optionalDocuments.map(doc => `
                <tr>
                    <td style="font-weight: 500;">${doc.label}</td>
                    <td>${doc.file}</td>
                    <td>
                        <button class="btn btn-secondary btn-sm" onclick="viewDocument('${doc.file}')">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        <button class="btn btn-secondary btn-sm" onclick="downloadDocument('${doc.file}')">
                            <i class="fa-solid fa-download"></i>
                        </button>
                        <button class="btn btn-secondary btn-sm" style="color: #EF4444;" onclick="deleteDocument('${doc.file}')">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>
                `).join('')}
            </tbody>
        </table>
    ` : '<p style="color: #6B7280; font-size: 14px;">Aucun document optionnel</p>';
    document.getElementById('optional-documents').innerHTML = optionalDocsHtml;
}

// ================================================
// ONGLET HISTORIQUE
// ================================================

function loadHistoryTab() {
    const timelineHtml = `
        <div class="timeline">
            ${clientData.history.map(event => `
            <div class="timeline-item ${event.color}">
                <div class="timeline-date">${event.date} - ${event.time}</div>
                <div class="timeline-title">
                    <i class="fa-solid fa-${event.icon}" style="margin-right: 6px;"></i>
                    ${event.title}
                </div>
                <div class="timeline-content">${event.description.replace(/\n/g, '<br>')}</div>
                ${event.user ? `<div style="font-size: 12px; color: #6B7280; margin-top: 4px;">Par: ${event.user}${event.status ? ` - Statut: ${event.status}` : ''}</div>` : ''}
                <a href="#" class="timeline-link">Voir les détails <i class="fa-solid fa-arrow-right"></i></a>
            </div>
            `).join('')}
        </div>
    `;
    document.getElementById('history-timeline').innerHTML = timelineHtml;

    // Stats période
    const statsHtml = `
        <div class="info-grid-4">
            <div class="metric-card">
                <div class="metric-value" style="font-size: 20px;">${clientData.periodStats.orders}</div>
                <div class="metric-label">Commandes</div>
            </div>
            <div class="metric-card">
                <div class="metric-value" style="font-size: 20px;">${clientData.periodStats.deliveries}</div>
                <div class="metric-label">Livraisons</div>
            </div>
            <div class="metric-card">
                <div class="metric-value" style="font-size: 20px;">${clientData.periodStats.invoices}</div>
                <div class="metric-label">Factures</div>
            </div>
            <div class="metric-card">
                <div class="metric-value" style="font-size: 20px;">${clientData.periodStats.payments}</div>
                <div class="metric-label">Paiements</div>
            </div>
            <div class="metric-card">
                <div class="metric-value" style="font-size: 20px; color: #F59E0B;">${clientData.periodStats.returns}</div>
                <div class="metric-label">Retours</div>
            </div>
            <div class="metric-card">
                <div class="metric-value" style="font-size: 20px; color: #F59E0B;">${clientData.periodStats.creditNotes}</div>
                <div class="metric-label">Avoirs</div>
            </div>
            <div class="metric-card">
                <div class="metric-value" style="font-size: 20px; color: ${clientData.periodStats.complaints > 0 ? '#EF4444' : '#10B981'};">${clientData.periodStats.complaints}</div>
                <div class="metric-label">Réclamations</div>
            </div>
        </div>
    `;
    document.getElementById('period-stats').innerHTML = statsHtml;
}

// ================================================
// ONGLET COMMANDES
// ================================================

function loadOrdersTab() {
    const ordersHtml = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Référence</th>
                    <th>Date</th>
                    <th>Montant</th>
                    <th>Articles</th>
                    <th>Statut</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${clientData.orders.map(order => `
                <tr>
                    <td><a href="#" style="color: #263c89; font-weight: 500;">${order.ref}</a></td>
                    <td>${order.date}</td>
                    <td style="font-weight: 500;">${formatMoney(order.amount)} XAF</td>
                    <td>${order.items} articles</td>
                    <td>
                        <span class="status-badge ${order.status === 'PENDING' ? 'status-badge-warning' : order.status === 'DELIVERED' ? 'status-badge-success' : 'status-badge-info'}">
                            ${order.statusLabel}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-secondary btn-sm" onclick="viewOrder('${order.ref}')">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        <button class="btn btn-secondary btn-sm" onclick="printOrder('${order.ref}')">
                            <i class="fa-solid fa-print"></i>
                        </button>
                    </td>
                </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    document.getElementById('orders-list').innerHTML = ordersHtml;
}

// ================================================
// ONGLET FACTURES
// ================================================

function loadInvoicesTab() {
    const invoicesHtml = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Référence</th>
                    <th>Date</th>
                    <th>Montant</th>
                    <th>Échéance</th>
                    <th>Payé</th>
                    <th>Statut</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${clientData.invoices.map(invoice => `
                <tr>
                    <td><a href="#" style="color: #263c89; font-weight: 500;">${invoice.ref}</a></td>
                    <td>${invoice.date}</td>
                    <td style="font-weight: 500;">${formatMoney(invoice.amount)} XAF</td>
                    <td>${invoice.dueDate}</td>
                    <td>${formatMoney(invoice.amountPaid)} XAF</td>
                    <td>
                        <span class="status-badge ${invoice.status === 'PAID' ? 'status-badge-success' : 'status-badge-warning'}">
                            ${invoice.statusLabel}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-secondary btn-sm" onclick="viewInvoice('${invoice.ref}')">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        <button class="btn btn-secondary btn-sm" onclick="printInvoice('${invoice.ref}')">
                            <i class="fa-solid fa-print"></i>
                        </button>
                        ${invoice.status !== 'PAID' ? `
                        <button class="btn btn-secondary btn-sm" onclick="recordPayment('${invoice.ref}')">
                            <i class="fa-solid fa-money-bill"></i>
                        </button>
                        ` : ''}
                    </td>
                </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    document.getElementById('invoices-list').innerHTML = invoicesHtml;
}

// ================================================
// ONGLET NOTES
// ================================================

function loadNotesTab() {
    const notesHtml = clientData.notes.length > 0 ? clientData.notes.map(note => `
        <div class="contact-card" style="margin-bottom: 12px;">
            <div class="card-header">
                <div class="card-title" style="font-size: 13px;">
                    <i class="fa-solid fa-sticky-note" style="color: #F59E0B;"></i>
                    ${note.date} - ${note.author}
                </div>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-secondary btn-sm" onclick="editNote(${note.id})">
                        <i class="fa-solid fa-edit"></i>
                    </button>
                    <button class="btn btn-secondary btn-sm" style="color: #EF4444;" onclick="deleteNote(${note.id})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
            <p style="font-size: 14px; color: #374151; margin: 0;">${note.content}</p>
        </div>
    `).join('') : '<p style="color: #6B7280; font-size: 14px;">Aucune note pour ce client</p>';
    document.getElementById('notes-list').innerHTML = notesHtml;
}

// ================================================
// HELPERS
// ================================================

function formatMoney(amount) {
    return new Intl.NumberFormat('fr-FR').format(amount);
}

// ================================================
// ACTIONS
// ================================================

function editClient() {
    window.location.href = `./client-create.html?edit=${clientData.code}`;
}

function newOrder() {
    alert('Redirection vers création commande pour ' + clientData.businessName);
}

function generateStatement() {
    alert('Génération du relevé de compte pour ' + clientData.businessName);
}

function sendEmail() {
    const mainContact = clientData.contacts.find(c => c.isPrimary);
    window.location.href = `mailto:${mainContact.emailPro}`;
}

function blockClient() {
    if (confirm('Êtes-vous sûr de vouloir bloquer ce client ?\n\nLe client ne pourra plus passer de commandes.')) {
        alert('Client bloqué');
    }
}

function editSection(section) {
    alert(`Édition de la section: ${section}`);
}

function viewMap(lat, lng) {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
}

function addAddress() {
    alert('Ajout d\'une nouvelle adresse');
}

function editAddress(id) {
    alert(`Édition de l'adresse: ${id}`);
}

function deleteAddress(id) {
    if (confirm('Supprimer cette adresse ?')) {
        alert(`Adresse ${id} supprimée`);
    }
}

function addContact() {
    alert('Ajout d\'un nouveau contact');
}

function editContact(id) {
    alert(`Édition du contact: ${id}`);
}

function deleteContact(id) {
    if (confirm('Supprimer ce contact ?')) {
        alert(`Contact ${id} supprimé`);
    }
}

function refreshBalances() {
    alert('Actualisation des soldes...');
}

function exportSchedule() {
    alert('Export de l\'échéancier en cours...');
}

function sendReminder() {
    alert('Envoi d\'une relance par email...');
}

function createPaymentPlan() {
    alert('Création d\'un plan de paiement...');
}

function showFinancialChart() {
    alert('Affichage du graphique d\'évolution sur 12 mois...');
}

function uploadDocument() {
    alert('Upload d\'un nouveau document...');
}

function viewDocument(file) {
    alert(`Visualisation du document: ${file}`);
}

function downloadDocument(file) {
    alert(`Téléchargement du document: ${file}`);
}

function deleteDocument(file) {
    if (confirm(`Supprimer le document ${file} ?`)) {
        alert('Document supprimé');
    }
}

function filterHistory() {
    const type = document.getElementById('history-type-filter').value;
    const period = document.getElementById('history-period-filter').value;
    alert(`Filtrage: Type=${type || 'Tous'}, Période=${period} mois`);
}

function loadMoreHistory() {
    alert('Chargement de plus d\'événements...');
}

function viewOrder(ref) {
    alert(`Voir commande: ${ref}`);
}

function printOrder(ref) {
    alert(`Impression commande: ${ref}`);
}

function viewInvoice(ref) {
    alert(`Voir facture: ${ref}`);
}

function printInvoice(ref) {
    alert(`Impression facture: ${ref}`);
}

function recordPayment(ref) {
    alert(`Enregistrer paiement pour: ${ref}`);
}

function exportInvoices() {
    alert('Export des factures...');
}

function addNote() {
    const content = prompt('Nouvelle note:');
    if (content) {
        alert('Note ajoutée');
    }
}

function editNote(id) {
    alert(`Édition de la note: ${id}`);
}

function deleteNote(id) {
    if (confirm('Supprimer cette note ?')) {
        alert('Note supprimée');
    }
}

// ================================================
// CLIENT-CREATE.JS
// Gestion du formulaire de création de client (5 étapes)
// Conforme au wireframe ECR-CLI-003
// ================================================

// État global
let currentStep = 1;
const totalSteps = 5;
let selectedCustomerType = null;
let formData = {
    addresses: [],
    contacts: [],
    documents: [],
    optionalDocuments: []
};
let addressIdCounter = 1;
let contactIdCounter = 1;
let documentIdCounter = 1;

// ================================================
// INITIALISATION
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Initialisation du formulaire client (5 étapes)...');

    // Initialiser la date d'attribution par défaut (aujourd'hui)
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('assignment-date').value = today;

    // Update stepper
    updateStepper();
});

// ================================================
// GESTION DES ÉTAPES
// ================================================

function goToStep(step) {
    if (step < 1 || step > totalSteps) return;

    // Empêcher d'aller aux étapes non complétées (sauf retour)
    if (step > currentStep) {
        if (!validateCurrentStep()) {
            return;
        }
    }

    // Hide all steps
    for (let i = 1; i <= totalSteps; i++) {
        const stepContent = document.getElementById(`step-${i}`);
        if (stepContent) {
            stepContent.classList.remove('active');
        }
    }

    // Show target step
    const targetStep = document.getElementById(`step-${step}`);
    if (targetStep) {
        targetStep.classList.add('active');
    }

    currentStep = step;
    updateStepper();

    // Actions spécifiques par étape
    if (step === 2) {
        // Initialiser une adresse si aucune
        if (formData.addresses.length === 0) {
            addAddress();
        }
    } else if (step === 3) {
        // Initialiser un contact si aucun
        if (formData.contacts.length === 0) {
            addContact(true);
        }
    } else if (step === 5) {
        // Générer les documents requis et le récapitulatif
        generateRequiredDocuments();
        updateCreationSummary();
    }
}

function nextStep() {
    if (!validateCurrentStep()) {
        return;
    }

    if (currentStep < totalSteps) {
        goToStep(currentStep + 1);
    }
}

function previousStep() {
    if (currentStep > 1) {
        goToStep(currentStep - 1);
    }
}

function updateStepper() {
    // Update step items
    const stepItems = document.querySelectorAll('.step-item');
    stepItems.forEach((item, index) => {
        const stepNum = index + 1;
        item.classList.remove('active', 'completed');

        if (stepNum === currentStep) {
            item.classList.add('active');
        } else if (stepNum < currentStep) {
            item.classList.add('completed');
        }
    });

    // Update progress bar
    const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
    document.getElementById('stepper-progress').style.width = progress + '%';

    // Update buttons
    document.getElementById('btn-previous').style.display = currentStep > 1 ? 'inline-flex' : 'none';
    document.getElementById('btn-next').style.display = currentStep < totalSteps ? 'inline-flex' : 'none';
    document.getElementById('btn-submit').style.display = currentStep === totalSteps ? 'inline-flex' : 'none';
}

function validateCurrentStep() {
    const errors = [];

    switch (currentStep) {
        case 1: // Type et Identification
            if (!selectedCustomerType) {
                errors.push('Veuillez sélectionner un type de client');
            }

            if (selectedCustomerType === 'ENTREPRISE' || selectedCustomerType === 'QUINCAILLERIE') {
                const businessName = document.getElementById('business-name').value.trim();
                const legalForm = document.getElementById('legal-form').value;
                const rccm = document.getElementById('rccm').value.trim();
                const taxId = document.getElementById('tax-id').value.trim();
                const industry = document.getElementById('industry').value;

                if (!businessName) errors.push('La raison sociale est obligatoire');
                if (!legalForm) errors.push('La forme juridique est obligatoire');
                if (!rccm) errors.push('Le RCCM est obligatoire');
                if (!taxId) errors.push('Le NUI est obligatoire');
                if (!industry) errors.push('Le secteur d\'activité est obligatoire');

                // Vérifier le régime fiscal
                const taxRegime = document.querySelector('input[name="tax-regime"]:checked');
                if (!taxRegime) errors.push('Le régime fiscal est obligatoire');

            } else if (selectedCustomerType === 'PARTICULIER' || selectedCustomerType === 'TECHNICIEN') {
                const civility = document.getElementById('civility').value;
                const lastName = document.getElementById('last-name').value.trim();
                const firstName = document.getElementById('first-name').value.trim();
                const cniNumber = document.getElementById('cni-number').value.trim();
                const docExpiry = document.getElementById('doc-expiry').value;

                if (!civility) errors.push('La civilité est obligatoire');
                if (!lastName) errors.push('Le nom est obligatoire');
                if (!firstName) errors.push('Le prénom est obligatoire');
                if (!cniNumber) errors.push('Le numéro de pièce est obligatoire');
                if (!docExpiry) errors.push('La date d\'expiration est obligatoire');

                // Vérifier le régime fiscal pour technicien
                if (selectedCustomerType === 'TECHNICIEN') {
                    const taxRegime = document.querySelector('input[name="tax-regime"]:checked');
                    if (!taxRegime) errors.push('Le régime fiscal est obligatoire');
                }
            }
            break;

        case 2: // Adresses
            if (formData.addresses.length === 0) {
                errors.push('Au moins une adresse est obligatoire');
            } else {
                // Vérifier que l'adresse principale est complète
                const primaryAddress = formData.addresses[0];
                if (!primaryAddress.street) errors.push('La rue/avenue est obligatoire');
                if (!primaryAddress.neighborhood) errors.push('Le quartier est obligatoire');
                if (!primaryAddress.city) errors.push('La ville est obligatoire');
            }
            break;

        case 3: // Contacts
            if (selectedCustomerType === 'ENTREPRISE' || selectedCustomerType === 'QUINCAILLERIE') {
                // Contact principal obligatoire pour entreprises
                const primaryContact = formData.contacts.find(c => c.isPrimary);
                if (!primaryContact) {
                    errors.push('Un contact principal est obligatoire');
                } else {
                    if (!primaryContact.firstName) errors.push('Le prénom du contact principal est obligatoire');
                    if (!primaryContact.lastName) errors.push('Le nom du contact principal est obligatoire');
                    if (!primaryContact.email) errors.push('L\'email du contact principal est obligatoire');
                    if (!primaryContact.mobile) errors.push('Le téléphone du contact principal est obligatoire');
                }
            }
            break;

        case 4: // Commercial
            const assignedCommercial = document.getElementById('assigned-commercial').value;
            const priceList = document.getElementById('price-list').value;

            if (!assignedCommercial) errors.push('Le commercial attitré est obligatoire');
            if (!priceList) errors.push('La liste de prix est obligatoire');

            // Vérifier limite crédit vs caution si crédit autorisé
            const paymentCredit = document.getElementById('payment-credit').checked;
            if (paymentCredit) {
                const creditLimit = parseFloat(document.getElementById('credit-limit').value) || 0;
                const commercialSelect = document.getElementById('assigned-commercial');
                const selectedOption = commercialSelect.options[commercialSelect.selectedIndex];
                const caution = parseFloat(selectedOption?.dataset?.caution) || 0;
                const maxCredit = caution * 0.7;

                if (creditLimit > maxCredit) {
                    errors.push(`La limite de crédit ne peut pas dépasser 70% de la caution du commercial (${formatMoney(maxCredit)} XAF)`);
                }
            }
            break;

        case 5: // Documents
            // Vérifier les documents obligatoires
            const requiredDocs = document.querySelectorAll('.required-doc-upload');
            let allDocsUploaded = true;
            requiredDocs.forEach(doc => {
                if (!doc.files || doc.files.length === 0) {
                    allDocsUploaded = false;
                }
            });

            // Pas bloquant, mais affiche un warning
            if (!allDocsUploaded) {
                // Warning affiché dans le récapitulatif, pas d'erreur bloquante
            }
            break;
    }

    if (errors.length > 0) {
        alert('Erreurs de validation:\n\n' + errors.join('\n'));
        return false;
    }

    return true;
}

// ================================================
// SÉLECTION TYPE CLIENT
// ================================================

function selectCustomerType(type) {
    selectedCustomerType = type;

    // Mettre à jour l'affichage des cartes
    document.querySelectorAll('.customer-type-card').forEach(card => {
        card.classList.remove('selected');
        if (card.dataset.type === type) {
            card.classList.add('selected');
        }
    });

    // Afficher/masquer les sections conditionnelles
    const entrepriseSection = document.getElementById('entreprise-section');
    const particulierSection = document.getElementById('particulier-section');
    const fiscalSection = document.getElementById('fiscal-section');
    const verificationBox = document.getElementById('verification-box');

    // Reset
    entrepriseSection.style.display = 'none';
    particulierSection.style.display = 'none';
    fiscalSection.style.display = 'none';
    verificationBox.style.display = 'none';

    switch (type) {
        case 'ENTREPRISE':
        case 'QUINCAILLERIE':
            entrepriseSection.style.display = 'block';
            fiscalSection.style.display = 'block';
            verificationBox.style.display = 'block';
            break;
        case 'PARTICULIER':
            particulierSection.style.display = 'block';
            break;
        case 'TECHNICIEN':
            particulierSection.style.display = 'block';
            fiscalSection.style.display = 'block';
            break;
    }
}

// ================================================
// GESTION DES ADRESSES
// ================================================

function addAddress() {
    const addressId = `addr-${addressIdCounter++}`;
    const isPrimary = formData.addresses.length === 0;

    const address = {
        id: addressId,
        type: isPrimary ? 'SIEGE' : 'LIVRAISON',
        label: isPrimary ? 'Siège principal' : '',
        street: '',
        neighborhood: '',
        city: '',
        postalCode: '',
        region: '',
        country: 'Cameroun',
        gpsLat: '',
        gpsLng: '',
        contactName: '',
        contactPhone: '',
        deliveryInstructions: '',
        isDefaultBilling: isPrimary,
        isDefaultDelivery: isPrimary
    };

    formData.addresses.push(address);
    renderAddresses();
}

function removeAddress(addressId) {
    if (formData.addresses.length <= 1) {
        alert('Au moins une adresse est obligatoire');
        return;
    }

    if (confirm('Supprimer cette adresse ?')) {
        formData.addresses = formData.addresses.filter(a => a.id !== addressId);
        renderAddresses();
    }
}

function updateAddress(addressId, field, value) {
    const address = formData.addresses.find(a => a.id === addressId);
    if (address) {
        address[field] = value;
    }
}

function renderAddresses() {
    const container = document.getElementById('addresses-container');

    if (formData.addresses.length === 0) {
        container.innerHTML = '<p style="color: #9CA3AF; font-size: 13px;">Aucune adresse ajoutée</p>';
        return;
    }

    container.innerHTML = formData.addresses.map((address, index) => {
        const isPrimary = index === 0;

        return `
            <div class="address-card">
                <div class="card-header">
                    <div class="card-title">
                        <i class="fa-solid fa-map-marker-alt" style="color: #263c89;"></i>
                        ADRESSE ${index + 1} ${isPrimary ? '(Principal)' : ''}
                    </div>
                    ${!isPrimary ? `
                        <button type="button" class="btn-remove" onclick="removeAddress('${address.id}')">
                            <i class="fa-solid fa-trash"></i> Supprimer
                        </button>
                    ` : ''}
                </div>

                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label required">Type</label>
                        <select class="form-select" onchange="updateAddress('${address.id}', 'type', this.value)">
                            <option value="SIEGE" ${address.type === 'SIEGE' ? 'selected' : ''}>Siège Social</option>
                            <option value="FACTURATION" ${address.type === 'FACTURATION' ? 'selected' : ''}>Facturation</option>
                            <option value="LIVRAISON" ${address.type === 'LIVRAISON' ? 'selected' : ''}>Livraison</option>
                            <option value="OPERATIONNEL" ${address.type === 'OPERATIONNEL' ? 'selected' : ''}>Opérationnel</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label required">Libellé</label>
                        <input type="text" class="form-input" value="${address.label}" placeholder="Ex: Siège principal"
                            onchange="updateAddress('${address.id}', 'label', this.value)">
                    </div>

                    <div class="form-group form-full">
                        <label class="form-label required">Rue/Avenue</label>
                        <input type="text" class="form-input" value="${address.street}" placeholder="Boulevard de la Liberté"
                            onchange="updateAddress('${address.id}', 'street', this.value)">
                    </div>

                    <div class="form-group">
                        <label class="form-label required">Quartier</label>
                        <input type="text" class="form-input" value="${address.neighborhood}" placeholder="Bonanjo"
                            onchange="updateAddress('${address.id}', 'neighborhood', this.value)">
                    </div>

                    <div class="form-group">
                        <label class="form-label required">Ville</label>
                        <select class="form-select" onchange="updateAddress('${address.id}', 'city', this.value)">
                            <option value="">Sélectionner</option>
                            <option value="Douala" ${address.city === 'Douala' ? 'selected' : ''}>Douala</option>
                            <option value="Yaoundé" ${address.city === 'Yaoundé' ? 'selected' : ''}>Yaoundé</option>
                            <option value="Bafoussam" ${address.city === 'Bafoussam' ? 'selected' : ''}>Bafoussam</option>
                            <option value="Garoua" ${address.city === 'Garoua' ? 'selected' : ''}>Garoua</option>
                            <option value="Bamenda" ${address.city === 'Bamenda' ? 'selected' : ''}>Bamenda</option>
                            <option value="Kribi" ${address.city === 'Kribi' ? 'selected' : ''}>Kribi</option>
                            <option value="Limbe" ${address.city === 'Limbe' ? 'selected' : ''}>Limbe</option>
                            <option value="Autre" ${address.city === 'Autre' ? 'selected' : ''}>Autre</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Code Postal</label>
                        <input type="text" class="form-input" value="${address.postalCode}" placeholder="BP 1234"
                            onchange="updateAddress('${address.id}', 'postalCode', this.value)">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Région</label>
                        <select class="form-select" onchange="updateAddress('${address.id}', 'region', this.value)">
                            <option value="">Sélectionner</option>
                            <option value="Littoral" ${address.region === 'Littoral' ? 'selected' : ''}>Littoral</option>
                            <option value="Centre" ${address.region === 'Centre' ? 'selected' : ''}>Centre</option>
                            <option value="Ouest" ${address.region === 'Ouest' ? 'selected' : ''}>Ouest</option>
                            <option value="Nord" ${address.region === 'Nord' ? 'selected' : ''}>Nord</option>
                            <option value="Sud" ${address.region === 'Sud' ? 'selected' : ''}>Sud</option>
                            <option value="Est" ${address.region === 'Est' ? 'selected' : ''}>Est</option>
                            <option value="Adamaoua" ${address.region === 'Adamaoua' ? 'selected' : ''}>Adamaoua</option>
                            <option value="Extrême-Nord" ${address.region === 'Extrême-Nord' ? 'selected' : ''}>Extrême-Nord</option>
                            <option value="Nord-Ouest" ${address.region === 'Nord-Ouest' ? 'selected' : ''}>Nord-Ouest</option>
                            <option value="Sud-Ouest" ${address.region === 'Sud-Ouest' ? 'selected' : ''}>Sud-Ouest</option>
                        </select>
                    </div>
                </div>

                <h5 style="font-weight: 600; margin-top: 20px; margin-bottom: 12px; font-size: 13px;">
                    <i class="fa-solid fa-map-pin" style="color: #F26F21;"></i> Coordonnées GPS
                </h5>

                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label">Latitude</label>
                        <input type="text" class="form-input" value="${address.gpsLat}" placeholder="4.0511"
                            id="gps-lat-${address.id}" onchange="updateAddress('${address.id}', 'gpsLat', this.value)">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Longitude</label>
                        <input type="text" class="form-input" value="${address.gpsLng}" placeholder="9.7679"
                            id="gps-lng-${address.id}" onchange="updateAddress('${address.id}', 'gpsLng', this.value)">
                    </div>

                    <div class="form-group">
                        <button type="button" class="btn btn-secondary btn-sm" onclick="locateGPS('${address.id}')" style="margin-top: 24px;">
                            <i class="fa-solid fa-location-crosshairs"></i> Localiser
                        </button>
                    </div>
                </div>

                <h5 style="font-weight: 600; margin-top: 20px; margin-bottom: 12px; font-size: 13px;">
                    <i class="fa-solid fa-user" style="color: #10B981;"></i> Contact sur place
                </h5>

                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label">Nom Contact</label>
                        <input type="text" class="form-input" value="${address.contactName}" placeholder="Jean MBARGA"
                            onchange="updateAddress('${address.id}', 'contactName', this.value)">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Téléphone Contact</label>
                        <input type="tel" class="form-input" value="${address.contactPhone}" placeholder="+237 699 123 456"
                            onchange="updateAddress('${address.id}', 'contactPhone', this.value)">
                    </div>

                    <div class="form-group form-full">
                        <label class="form-label">Instructions de Livraison</label>
                        <textarea class="form-input" rows="2" placeholder="Entrée par le portail principal, bureau au 2ème étage"
                            onchange="updateAddress('${address.id}', 'deliveryInstructions', this.value)">${address.deliveryInstructions}</textarea>
                    </div>
                </div>

                <div class="form-grid" style="margin-top: 12px;">
                    <div class="checkbox-item">
                        <input type="checkbox" id="billing-${address.id}" ${address.isDefaultBilling ? 'checked' : ''}
                            onchange="updateAddress('${address.id}', 'isDefaultBilling', this.checked)">
                        <label for="billing-${address.id}">Adresse de Facturation par défaut</label>
                    </div>

                    <div class="checkbox-item">
                        <input type="checkbox" id="delivery-${address.id}" ${address.isDefaultDelivery ? 'checked' : ''}
                            onchange="updateAddress('${address.id}', 'isDefaultDelivery', this.checked)">
                        <label for="delivery-${address.id}">Adresse de Livraison par défaut</label>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ================================================
// GESTION DES CONTACTS
// ================================================

function addContact(isPrimary = false) {
    const contactId = `contact-${contactIdCounter++}`;

    const contact = {
        id: contactId,
        isPrimary: isPrimary || formData.contacts.length === 0,
        civility: '',
        firstName: '',
        lastName: '',
        role: isPrimary ? 'DIRECTION' : '',
        service: '',
        emailPro: '',
        emailPerso: '',
        mobile: '',
        phone: '',
        whatsapp: '',
        preferredChannel: 'WHATSAPP',
        contactHours: '8h-18h',
        language: 'FR',
        isDecisionMaker: isPrimary,
        receiveInvoices: isPrimary,
        receiveReminders: false
    };

    formData.contacts.push(contact);
    renderContacts();
}

function removeContact(contactId) {
    const contact = formData.contacts.find(c => c.id === contactId);
    if (contact && contact.isPrimary) {
        alert('Impossible de supprimer le contact principal');
        return;
    }

    if (confirm('Supprimer ce contact ?')) {
        formData.contacts = formData.contacts.filter(c => c.id !== contactId);
        renderContacts();
    }
}

function updateContact(contactId, field, value) {
    const contact = formData.contacts.find(c => c.id === contactId);
    if (contact) {
        contact[field] = value;
    }
}

function setPrimaryContact(contactId) {
    formData.contacts.forEach(c => {
        c.isPrimary = c.id === contactId;
    });
    renderContacts();
}

function renderContacts() {
    const container = document.getElementById('contacts-container');

    if (formData.contacts.length === 0) {
        container.innerHTML = '<p style="color: #9CA3AF; font-size: 13px;">Aucun contact ajouté</p>';
        return;
    }

    container.innerHTML = formData.contacts.map((contact, index) => {
        return `
            <div class="contact-card">
                <div class="card-header">
                    <div class="card-title">
                        <i class="fa-solid fa-user" style="color: #263c89;"></i>
                        CONTACT ${index + 1} ${contact.isPrimary ? '<span style="margin-left: 8px; background: #DBEAFE; color: #1E40AF; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 600;">PRINCIPAL</span>' : ''}
                    </div>
                    <div style="display: flex; gap: 8px;">
                        ${!contact.isPrimary ? `
                            <button type="button" class="btn btn-secondary btn-sm" onclick="setPrimaryContact('${contact.id}')">
                                <i class="fa-solid fa-star"></i>
                            </button>
                            <button type="button" class="btn-remove" onclick="removeContact('${contact.id}')">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>

                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label">Civilité</label>
                        <select class="form-select" onchange="updateContact('${contact.id}', 'civility', this.value)">
                            <option value="">-</option>
                            <option value="M." ${contact.civility === 'M.' ? 'selected' : ''}>M.</option>
                            <option value="Mme" ${contact.civility === 'Mme' ? 'selected' : ''}>Mme</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label ${contact.isPrimary ? 'required' : ''}">Prénom</label>
                        <input type="text" class="form-input" value="${contact.firstName}" placeholder="Pierre"
                            onchange="updateContact('${contact.id}', 'firstName', this.value)">
                    </div>

                    <div class="form-group">
                        <label class="form-label ${contact.isPrimary ? 'required' : ''}">Nom</label>
                        <input type="text" class="form-input" value="${contact.lastName}" placeholder="FOTSO"
                            onchange="updateContact('${contact.id}', 'lastName', this.value)">
                    </div>

                    <div class="form-group">
                        <label class="form-label ${contact.isPrimary ? 'required' : ''}">Fonction/Rôle</label>
                        <select class="form-select" onchange="updateContact('${contact.id}', 'role', this.value)">
                            <option value="">Sélectionner</option>
                            <option value="DIRECTION" ${contact.role === 'DIRECTION' ? 'selected' : ''}>Direction</option>
                            <option value="COMMERCIAL" ${contact.role === 'COMMERCIAL' ? 'selected' : ''}>Commercial</option>
                            <option value="COMPTABLE" ${contact.role === 'COMPTABLE' ? 'selected' : ''}>Comptable</option>
                            <option value="TECHNIQUE" ${contact.role === 'TECHNIQUE' ? 'selected' : ''}>Technique</option>
                            <option value="ACHAT" ${contact.role === 'ACHAT' ? 'selected' : ''}>Achat</option>
                            <option value="AUTRE" ${contact.role === 'AUTRE' ? 'selected' : ''}>Autre</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Service</label>
                        <input type="text" class="form-input" value="${contact.service}" placeholder="Direction"
                            onchange="updateContact('${contact.id}', 'service', this.value)">
                    </div>

                    <div class="form-group">
                        <label class="form-label ${contact.isPrimary ? 'required' : ''}">Email Pro</label>
                        <input type="email" class="form-input" value="${contact.emailPro}" placeholder="p.fotso@sonacom.cm"
                            onchange="updateContact('${contact.id}', 'emailPro', this.value)">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Email Perso</label>
                        <input type="email" class="form-input" value="${contact.emailPerso}" placeholder="perso@email.com"
                            onchange="updateContact('${contact.id}', 'emailPerso', this.value)">
                    </div>

                    <div class="form-group">
                        <label class="form-label ${contact.isPrimary ? 'required' : ''}">Tél. Mobile</label>
                        <input type="tel" class="form-input" value="${contact.mobile}" placeholder="+237 699 123 456"
                            onchange="updateContact('${contact.id}', 'mobile', this.value)">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Tél. Fixe</label>
                        <input type="tel" class="form-input" value="${contact.phone}" placeholder="+237 233 456 789"
                            onchange="updateContact('${contact.id}', 'phone', this.value)">
                    </div>

                    <div class="form-group">
                        <label class="form-label">WhatsApp</label>
                        <input type="tel" class="form-input" value="${contact.whatsapp}" placeholder="+237 699 123 456"
                            onchange="updateContact('${contact.id}', 'whatsapp', this.value)">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Canal Préféré</label>
                        <select class="form-select" onchange="updateContact('${contact.id}', 'preferredChannel', this.value)">
                            <option value="WHATSAPP" ${contact.preferredChannel === 'WHATSAPP' ? 'selected' : ''}>WhatsApp</option>
                            <option value="EMAIL" ${contact.preferredChannel === 'EMAIL' ? 'selected' : ''}>Email</option>
                            <option value="TELEPHONE" ${contact.preferredChannel === 'TELEPHONE' ? 'selected' : ''}>Téléphone</option>
                            <option value="SMS" ${contact.preferredChannel === 'SMS' ? 'selected' : ''}>SMS</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Heures Contact</label>
                        <input type="text" class="form-input" value="${contact.contactHours}" placeholder="8h-18h en semaine"
                            onchange="updateContact('${contact.id}', 'contactHours', this.value)">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Langue</label>
                        <select class="form-select" onchange="updateContact('${contact.id}', 'language', this.value)">
                            <option value="FR" ${contact.language === 'FR' ? 'selected' : ''}>Français</option>
                            <option value="EN" ${contact.language === 'EN' ? 'selected' : ''}>Anglais</option>
                        </select>
                    </div>
                </div>

                <div class="form-grid" style="margin-top: 16px;">
                    <div class="checkbox-item">
                        <input type="checkbox" id="decision-${contact.id}" ${contact.isDecisionMaker ? 'checked' : ''}
                            onchange="updateContact('${contact.id}', 'isDecisionMaker', this.checked)">
                        <label for="decision-${contact.id}">Décisionnaire pour les achats</label>
                    </div>

                    <div class="checkbox-item">
                        <input type="checkbox" id="invoices-${contact.id}" ${contact.receiveInvoices ? 'checked' : ''}
                            onchange="updateContact('${contact.id}', 'receiveInvoices', this.checked)">
                        <label for="invoices-${contact.id}">Recevoir les factures</label>
                    </div>

                    <div class="checkbox-item">
                        <input type="checkbox" id="reminders-${contact.id}" ${contact.receiveReminders ? 'checked' : ''}
                            onchange="updateContact('${contact.id}', 'receiveReminders', this.checked)">
                        <label for="reminders-${contact.id}">Recevoir les relances</label>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ================================================
// GESTION DES DOCUMENTS
// ================================================

function generateRequiredDocuments() {
    const container = document.getElementById('required-documents-container');
    let requiredDocs = [];

    if (selectedCustomerType === 'ENTREPRISE' || selectedCustomerType === 'QUINCAILLERIE') {
        requiredDocs = [
            { type: 'RCCM', label: 'REGISTRE DE COMMERCE (RCCM)', required: true },
            { type: 'ANR', label: 'ATTESTATION NON-REDEVANCE (ANR)', required: true },
            { type: 'CARTE_CONTRIBUABLE', label: 'CARTE CONTRIBUABLE', required: true }
        ];
    } else if (selectedCustomerType === 'TECHNICIEN') {
        requiredDocs = [
            { type: 'CNI', label: 'CARTE NATIONALE D\'IDENTITÉ', required: true },
            { type: 'ATTESTATION_FORMATION', label: 'ATTESTATION DE FORMATION', required: false }
        ];
    } else if (selectedCustomerType === 'PARTICULIER') {
        requiredDocs = [
            { type: 'CNI', label: 'CARTE NATIONALE D\'IDENTITÉ', required: true }
        ];
    }

    container.innerHTML = requiredDocs.map(doc => `
        <div class="document-card">
            <div class="card-header">
                <div class="card-title">
                    <i class="fa-solid fa-file-pdf" style="color: #EF4444;"></i>
                    ${doc.label} ${doc.required ? '<span style="color: #EF4444;">*</span>' : ''}
                </div>
                <span class="doc-status" id="doc-status-${doc.type}">
                    <i class="fa-solid fa-times-circle" style="color: #EF4444;"></i> Non fourni
                </span>
            </div>

            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Document</label>
                    <input type="file" class="form-input required-doc-upload"
                        data-doc-type="${doc.type}"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onchange="handleDocumentUpload('${doc.type}', this)">
                </div>

                <div class="form-group">
                    <label class="form-label">N° Document</label>
                    <input type="text" class="form-input" id="doc-number-${doc.type}" placeholder="Numéro du document">
                </div>

                <div class="form-group">
                    <label class="form-label">Date Émission</label>
                    <input type="date" class="form-input" id="doc-issue-${doc.type}">
                </div>

                <div class="form-group">
                    <label class="form-label">Date Expiration</label>
                    <input type="date" class="form-input" id="doc-expiry-${doc.type}">
                </div>
            </div>
        </div>
    `).join('');
}

function handleDocumentUpload(docType, input) {
    const statusEl = document.getElementById(`doc-status-${docType}`);

    if (input.files && input.files.length > 0) {
        const file = input.files[0];
        statusEl.innerHTML = `
            <i class="fa-solid fa-check-circle" style="color: #10B981;"></i>
            ${file.name} (${formatFileSize(file.size)})
        `;
    } else {
        statusEl.innerHTML = `
            <i class="fa-solid fa-times-circle" style="color: #EF4444;"></i>
            Non fourni
        `;
    }

    // Mettre à jour le récapitulatif
    updateCreationSummary();
}

function addOptionalDocument() {
    const docId = `opt-doc-${documentIdCounter++}`;

    const container = document.getElementById('optional-documents-container');
    const docCard = document.createElement('div');
    docCard.className = 'document-card';
    docCard.id = docId;

    docCard.innerHTML = `
        <div class="card-header">
            <div class="card-title">
                <i class="fa-solid fa-paperclip" style="color: #6B7280;"></i>
                DOCUMENT OPTIONNEL
            </div>
            <button type="button" class="btn-remove" onclick="removeOptionalDocument('${docId}')">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>

        <div class="form-grid">
            <div class="form-group">
                <label class="form-label">Type de document</label>
                <select class="form-select">
                    <option value="STATUTS">Statuts de la société</option>
                    <option value="CONTRAT">Contrat cadre</option>
                    <option value="ACCORD_TARIFAIRE">Accord tarifaire spécial</option>
                    <option value="AUTRE">Autre</option>
                </select>
            </div>

            <div class="form-group">
                <label class="form-label">Fichier</label>
                <input type="file" class="form-input" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx">
            </div>

            <div class="form-group form-full">
                <label class="form-label">Description</label>
                <input type="text" class="form-input" placeholder="Description du document">
            </div>
        </div>
    `;

    container.appendChild(docCard);
}

function removeOptionalDocument(docId) {
    const docCard = document.getElementById(docId);
    if (docCard) {
        docCard.remove();
    }
}

// ================================================
// RÉCAPITULATIF DE CRÉATION
// ================================================

function updateCreationSummary() {
    const summary = document.getElementById('creation-summary');
    const warning = document.getElementById('creation-warning');

    // Récupérer les informations
    let clientName = '-';
    if (selectedCustomerType === 'ENTREPRISE' || selectedCustomerType === 'QUINCAILLERIE') {
        clientName = document.getElementById('business-name')?.value || '-';
    } else {
        const lastName = document.getElementById('last-name')?.value || '';
        const firstName = document.getElementById('first-name')?.value || '';
        clientName = `${firstName} ${lastName}`.trim() || '-';
    }

    const taxId = document.getElementById('tax-id')?.value || '-';

    const commercialSelect = document.getElementById('assigned-commercial');
    const commercialName = commercialSelect?.options[commercialSelect.selectedIndex]?.text || '-';

    const paymentCredit = document.getElementById('payment-credit')?.checked;
    let creditInfo = 'Comptant uniquement';
    if (paymentCredit) {
        const creditLimit = document.getElementById('credit-limit')?.value || 0;
        const paymentTerms = document.getElementById('payment-terms')?.value || 30;
        creditInfo = `${formatMoney(creditLimit)} XAF (${paymentTerms} jours)`;
    }

    // Compter les documents
    const requiredDocs = document.querySelectorAll('.required-doc-upload');
    let uploadedCount = 0;
    requiredDocs.forEach(input => {
        if (input.files && input.files.length > 0) {
            uploadedCount++;
        }
    });

    const docsStatus = `${uploadedCount}/${requiredDocs.length} obligatoires`;
    const allDocsUploaded = uploadedCount === requiredDocs.length;

    summary.innerHTML = `
        <div class="recap-grid">
            <span class="recap-label">Type:</span>
            <span class="recap-value">${selectedCustomerType || '-'}</span>

            <span class="recap-label">${selectedCustomerType === 'ENTREPRISE' || selectedCustomerType === 'QUINCAILLERIE' ? 'Raison:' : 'Nom:'}</span>
            <span class="recap-value">${clientName}</span>

            ${selectedCustomerType === 'ENTREPRISE' || selectedCustomerType === 'QUINCAILLERIE' ? `
                <span class="recap-label">NUI:</span>
                <span class="recap-value">${taxId}</span>
            ` : ''}

            <span class="recap-label">Commercial:</span>
            <span class="recap-value">${commercialName}</span>

            <span class="recap-label">Crédit:</span>
            <span class="recap-value">${creditInfo}</span>

            <span class="recap-label">Documents:</span>
            <span class="recap-value" style="color: ${allDocsUploaded ? '#10B981' : '#F59E0B'};">
                ${docsStatus} ${allDocsUploaded ? '<i class="fa-solid fa-check-circle"></i>' : '<i class="fa-solid fa-exclamation-triangle"></i>'}
            </span>
        </div>

        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #E5E7EB;">
            <strong style="font-size: 14px;">Statut après création :</strong>
            <div style="display: flex; align-items: center; gap: 8px; margin-top: 8px;">
                ${allDocsUploaded ? `
                    <span class="status-badge status-active">ACTIF</span>
                    <span style="font-size: 13px; color: #6B7280;">Client prêt pour les commandes</span>
                ` : `
                    <span class="status-badge status-draft">DRAFT</span>
                    <span style="font-size: 13px; color: #6B7280;">Documents à compléter</span>
                `}
            </div>
        </div>
    `;

    // Afficher/masquer le warning
    if (!allDocsUploaded) {
        warning.style.display = 'flex';
        document.getElementById('warning-message').textContent =
            `${requiredDocs.length - uploadedCount} document(s) obligatoire(s) manquant(s)`;
    } else {
        warning.style.display = 'none';
    }
}

// ================================================
// GESTION COMMERCIAL
// ================================================

function updateCommercialInfo() {
    const select = document.getElementById('assigned-commercial');
    const infoBox = document.getElementById('commercial-info');

    if (!select.value) {
        infoBox.style.display = 'none';
        return;
    }

    const selectedOption = select.options[select.selectedIndex];
    const name = selectedOption.dataset.name || '-';
    const zone = selectedOption.dataset.zone || '-';
    const caution = selectedOption.dataset.caution || 0;

    document.getElementById('commercial-name-display').textContent = name;
    document.getElementById('commercial-code-display').textContent = select.value;
    document.getElementById('commercial-zone-display').textContent = zone;
    document.getElementById('commercial-caution-display').textContent = formatMoney(caution);

    infoBox.style.display = 'flex';
}

function toggleCreditSection() {
    const creditSection = document.getElementById('credit-section');
    const isCredit = document.getElementById('payment-credit').checked;
    creditSection.style.display = isCredit ? 'block' : 'none';
}

// ================================================
// HELPERS
// ================================================

function verifyNUI() {
    const nui = document.getElementById('tax-id').value.trim();
    if (!nui) {
        alert('Veuillez saisir un NUI');
        return;
    }

    // Vérifier le format
    const nuiRegex = /^P0\d{9,12}W$/;
    if (!nuiRegex.test(nui)) {
        alert('Format NUI invalide. Le format attendu est P0XXXXXXXXXW');
        return;
    }

    // Mettre à jour les vérifications
    updateVerifications({
        nuiFormat: true,
        nuiUnique: true
    });

    alert('Vérification NUI en cours...\n\nNUI valide (simulation)');
}

function updateVerifications(checks) {
    const container = document.getElementById('verification-items');

    let html = '';

    if (checks.nuiFormat !== undefined) {
        html += `
            <div class="verification-item ${checks.nuiFormat ? 'valid' : 'invalid'}">
                <i class="fa-solid fa-${checks.nuiFormat ? 'check-circle' : 'times-circle'}"></i>
                Format NUI ${checks.nuiFormat ? 'valide' : 'invalide'}
            </div>
        `;
    }

    if (checks.nuiUnique !== undefined) {
        html += `
            <div class="verification-item ${checks.nuiUnique ? 'valid' : 'pending'}">
                <i class="fa-solid fa-${checks.nuiUnique ? 'check-circle' : 'hourglass-half'}"></i>
                ${checks.nuiUnique ? 'NUI unique confirmé' : 'Vérification unicité en cours...'}
            </div>
        `;
    }

    container.innerHTML = html;
}

function toggleVatExemption() {
    const details = document.getElementById('vat-exemption-details');
    const isExempt = document.getElementById('vat-exempt').checked;
    details.style.display = isExempt ? 'block' : 'none';
}

function locateGPS(addressId) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latInput = document.getElementById(`gps-lat-${addressId}`);
                const lngInput = document.getElementById(`gps-lng-${addressId}`);

                if (latInput && lngInput) {
                    latInput.value = position.coords.latitude.toFixed(6);
                    lngInput.value = position.coords.longitude.toFixed(6);

                    // Mettre à jour l'objet adresse
                    updateAddress(addressId, 'gpsLat', latInput.value);
                    updateAddress(addressId, 'gpsLng', lngInput.value);
                }
            },
            (error) => {
                alert('Impossible d\'obtenir la position GPS: ' + error.message);
            }
        );
    } else {
        alert('La géolocalisation n\'est pas supportée par votre navigateur');
    }
}

function formatMoney(amount) {
    return new Intl.NumberFormat('fr-FR').format(amount);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ================================================
// ACTIONS DU FORMULAIRE
// ================================================

function collectAllFormData() {
    const data = {
        // Metadata
        customerType: selectedCustomerType,
        status: 'DRAFT',

        // Étape 1: Identification
        businessName: document.getElementById('business-name')?.value.trim(),
        tradeName: document.getElementById('trade-name')?.value.trim(),
        legalForm: document.getElementById('legal-form')?.value,
        rccm: document.getElementById('rccm')?.value.trim(),
        taxId: document.getElementById('tax-id')?.value.trim(),
        capital: document.getElementById('capital')?.value,
        employeeCount: document.getElementById('employee-count')?.value,
        industry: document.getElementById('industry')?.value,

        // Particulier
        civility: document.getElementById('civility')?.value,
        lastName: document.getElementById('last-name')?.value.trim(),
        firstName: document.getElementById('first-name')?.value.trim(),
        birthDate: document.getElementById('birth-date')?.value,
        documentType: document.querySelector('input[name="doc-type"]:checked')?.value,
        documentNumber: document.getElementById('cni-number')?.value.trim(),
        documentExpiry: document.getElementById('doc-expiry')?.value,
        documentPlace: document.getElementById('doc-place')?.value.trim(),
        profession: document.getElementById('profession')?.value.trim(),
        employer: document.getElementById('employer')?.value.trim(),

        // Fiscal
        taxRegime: document.querySelector('input[name="tax-regime"]:checked')?.value,
        withholdingTax: document.getElementById('withholding-tax')?.checked,
        vatExempt: document.getElementById('vat-exempt')?.checked,
        exemptionNumber: document.getElementById('exemption-number')?.value.trim(),

        // Étape 2: Adresses
        addresses: formData.addresses,

        // Étape 3: Contacts
        contacts: formData.contacts,

        // Étape 4: Commercial
        assignedCommercial: document.getElementById('assigned-commercial')?.value,
        assignmentDate: document.getElementById('assignment-date')?.value,
        paymentMode: document.querySelector('input[name="payment-mode"]:checked')?.value,
        creditLimit: document.getElementById('credit-limit')?.value,
        paymentTerms: document.getElementById('payment-terms')?.value,
        paymentMethods: {
            virement: document.getElementById('method-virement')?.checked,
            cheque: document.getElementById('method-cheque')?.checked,
            mobileMoney: document.getElementById('method-mobile')?.checked,
            especes: document.getElementById('method-especes')?.checked
        },
        validatePreviousBalance: document.getElementById('validate-previous-balance')?.checked,
        autoBlockOverdue: document.getElementById('auto-block-overdue')?.checked,
        deliveryFeeExempt: document.getElementById('delivery-fee-exempt')?.checked,
        minOrderAmount: document.getElementById('min-order-amount')?.value,
        priceList: document.getElementById('price-list')?.value,
        permanentDiscount: document.getElementById('permanent-discount')?.value,

        // Audit
        createdAt: new Date().toISOString(),
        createdBy: 'Marie DJOMO'
    };

    return data;
}

function saveDraft() {
    console.log('Enregistrement brouillon...');

    const data = collectAllFormData();
    data.status = 'DRAFT';

    console.log('Form Data (Draft):', data);

    // Simuler l'enregistrement
    setTimeout(() => {
        const code = 'CLI-' + new Date().getFullYear() + '-' + Math.floor(Math.random() * 10000).toString().padStart(5, '0');
        alert('Client enregistré en brouillon\n\nCode: ' + code);
        window.location.href = './clients-list.html';
    }, 500);
}

function submitForm() {
    console.log('Validation et création client...');

    // Valider toutes les étapes
    for (let step = 1; step <= totalSteps; step++) {
        currentStep = step;
        if (!validateCurrentStep()) {
            goToStep(step);
            return;
        }
    }

    // Reset à l'étape 5
    currentStep = totalSteps;

    const data = collectAllFormData();

    // Vérifier si tous les documents requis sont fournis
    const requiredDocs = document.querySelectorAll('.required-doc-upload');
    let allDocsUploaded = true;
    requiredDocs.forEach(input => {
        if (!input.files || input.files.length === 0) {
            allDocsUploaded = false;
        }
    });

    data.status = allDocsUploaded ? 'ACTIVE' : 'DRAFT';

    console.log('Form Data:', data);

    // Simuler l'enregistrement
    setTimeout(() => {
        const code = 'CLI-' + new Date().getFullYear() + '-' + Math.floor(Math.random() * 10000).toString().padStart(5, '0');

        if (data.status === 'ACTIVE') {
            alert('Client créé et activé avec succès !\n\nCode: ' + code + '\n\nLe client est maintenant disponible pour les commandes.');
        } else {
            alert('Client créé en brouillon\n\nCode: ' + code + '\n\nComplétez les documents manquants pour activer le client.');
        }

        window.location.href = './clients-list.html';
    }, 500);
}

function cancelForm() {
    if (confirm('Abandonner la création du client ?\n\nLes données non enregistrées seront perdues.')) {
        window.location.href = './clients-list.html';
    }
}

function closeForm() {
    cancelForm();
}

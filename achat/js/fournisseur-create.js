// ================================================
// FOURNISSEUR-CREATE.JS
// Gestion du formulaire de création de fournisseur (5 étapes)
// Conforme au modèle Partner
// ================================================

// État global
let currentStep = 1;
const totalSteps = 5;
let formData = {
    tags: [],
    contacts: [],
    certificates: [],
    discounts: []
};
let contactIdCounter = 1;
let certificateIdCounter = 1;
let discountIdCounter = 1;

// ================================================
// INITIALISATION
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation du formulaire fournisseur (5 étapes)...');
    
    // Initialiser avec un contact par défaut
    addContact('COMMERCIAL');
    
    // Initialiser avec un certificat par défaut
    addCertificate();
    
    // Initialiser avec un palier de remise par défaut
    addDiscount();
    
    // Update stepper
    updateStepper();
});

// ================================================
// GESTION DES ÉTAPES
// ================================================

function goToStep(step) {
    if (step < 1 || step > totalSteps) return;
    
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
    
    // Update validation summary if on step 5
    if (step === 5) {
        updateValidationSummary();
    }
}

function nextStep() {
    // Validate current step before proceeding
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
    document.getElementById('btn-previous').style.display = currentStep > 1 ? 'block' : 'none';
    document.getElementById('btn-next').style.display = currentStep < totalSteps ? 'block' : 'none';
    document.getElementById('btn-submit').style.display = currentStep === totalSteps ? 'block' : 'none';
}

function validateCurrentStep() {
    const errors = [];
    
    switch (currentStep) {
        case 1: // Informations générales
            const subtype = document.querySelector('input[name="subtype"]:checked');
            const personType = document.querySelector('input[name="person-type"]:checked');
            const businessCategory = document.getElementById('business-category').value;
            
            if (!subtype) errors.push('Le sous-type est obligatoire');
            if (!personType) errors.push('Le type de personne est obligatoire');
            
            if (personType && personType.value === 'moral') {
                const companyName = document.getElementById('company-name').value.trim();
                const legalForm = document.getElementById('legal-form').value;
                if (!companyName) errors.push('La raison sociale est obligatoire');
                if (!legalForm) errors.push('La forme juridique est obligatoire');
            } else if (personType && personType.value === 'physical') {
                const lastname = document.getElementById('individual-lastname').value.trim();
                const firstname = document.getElementById('individual-firstname').value.trim();
                const id = document.getElementById('individual-id').value.trim();
                if (!lastname) errors.push('Le nom est obligatoire');
                if (!firstname) errors.push('Le prénom est obligatoire');
                if (!id) errors.push('Le CNI/Passeport est obligatoire');
            }
            
            if (!businessCategory) errors.push('La catégorie métier est obligatoire');
            break;
            
        case 2: // Légales et fiscales
            const niu = document.getElementById('niu').value.trim();
            const rccm = document.getElementById('rccm').value.trim();
            const tribunal = document.getElementById('tribunal').value;
            const taxRegime = document.getElementById('tax-regime').value;
            
            if (!niu) errors.push('Le NIU est obligatoire');
            if (!rccm) errors.push('Le RCCM est obligatoire');
            if (!tribunal) errors.push('Le tribunal est obligatoire');
            if (!taxRegime) errors.push('Le régime d\'imposition est obligatoire');
            
            // Check if at least one certificate
            if (formData.certificates.length === 0) {
                errors.push('Au moins un certificat obligatoire doit être renseigné');
            }
            break;
            
        case 3: // Contacts et adresses
            const street = document.getElementById('street').value.trim();
            const city = document.getElementById('city').value;
            
            if (!street) errors.push('La rue/avenue est obligatoire');
            if (!city) errors.push('La ville est obligatoire');
            
            // Check if at least one contact with required fields
            const primaryContact = formData.contacts.find(c => c.type === 'COMMERCIAL');
            if (!primaryContact || !primaryContact.name || !primaryContact.phone || !primaryContact.email) {
                errors.push('Le contact commercial principal est obligatoire (nom, téléphone, email)');
            }
            break;
            
        case 4: // Conditions commerciales
            const paymentMode = document.getElementById('payment-mode').value;
            const paymentDays = document.getElementById('payment-days').value;
            const bankName = document.getElementById('bank-name').value.trim();
            const accountNumber = document.getElementById('account-number').value.trim();
            
            if (!paymentMode) errors.push('Le mode de paiement est obligatoire');
            if (!paymentDays) errors.push('Le délai de paiement est obligatoire');
            if (!bankName) errors.push('Le nom de la banque est obligatoire');
            if (!accountNumber) errors.push('Le numéro de compte est obligatoire');
            break;
            
        case 5: // Validation
            const assignedBuyer = document.getElementById('assigned-buyer').value;
            if (!assignedBuyer) errors.push('L\'acheteur assigné est obligatoire');
            
            // Check at least one company selected
            const companies = [
                document.getElementById('company-iola-sarl').checked,
                document.getElementById('company-iola-btp').checked,
                document.getElementById('company-iola-agro').checked,
                document.getElementById('company-iola-transport').checked
            ];
            if (!companies.some(c => c)) {
                errors.push('Au moins une société doit être autorisée');
            }
            break;
    }
    
    if (errors.length > 0) {
        alert('❌ Erreurs de validation:\n\n' + errors.join('\n'));
        return false;
    }
    
    return true;
}

// ================================================
// GESTION TYPE PERSONNE
// ================================================

function togglePersonType() {
    const isMoral = document.getElementById('person-moral').checked;
    const moralSection = document.getElementById('moral-section');
    const physicalSection = document.getElementById('physical-section');
    
    if (isMoral) {
        moralSection.style.display = 'block';
        physicalSection.style.display = 'none';
    } else {
        moralSection.style.display = 'none';
        physicalSection.style.display = 'block';
    }
}

// ================================================
// GESTION DES TAGS
// ================================================

function addTag() {
    const input = document.getElementById('tag-input');
    const tag = input.value.trim();
    
    if (!tag) return;
    
    if (formData.tags.includes(tag)) {
        alert('Ce tag existe déjà');
        return;
    }
    
    formData.tags.push(tag);
    input.value = '';
    renderTags();
}

function removeTag(tag) {
    formData.tags = formData.tags.filter(t => t !== tag);
    renderTags();
}

function renderTags() {
    const container = document.getElementById('tags-container');
    
    if (formData.tags.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = formData.tags.map(tag => `
        <div class="tag-item">
            ${tag}
            <span class="remove-tag" onclick="removeTag('${tag}')">×</span>
        </div>
    `).join('');
}

// ================================================
// GESTION DES CERTIFICATS
// ================================================

function addCertificate() {
    const certificateId = `cert-${certificateIdCounter++}`;
    const certificate = {
        id: certificateId,
        type: '',
        number: '',
        issueDate: '',
        expiryDate: ''
    };
    
    formData.certificates.push(certificate);
    renderCertificates();
}

function removeCertificate(certId) {
    if (confirm('Supprimer ce certificat ?')) {
        formData.certificates = formData.certificates.filter(c => c.id !== certId);
        renderCertificates();
    }
}

function updateCertificate(certId, field, value) {
    const cert = formData.certificates.find(c => c.id === certId);
    if (cert) {
        cert[field] = value;
    }
}

function renderCertificates() {
    const container = document.getElementById('certificates-container');
    
    if (formData.certificates.length === 0) {
        container.innerHTML = '<p style="color: #9CA3AF; font-size: 13px;">Aucun certificat ajouté</p>';
        return;
    }
    
    container.innerHTML = formData.certificates.map((cert, index) => `
        <div class="certificate-card">
            <div class="card-header">
                <div class="card-title">
                    <i class="fa-solid fa-certificate"></i>
                    Certificat #${index + 1}
                </div>
                <button type="button" class="btn-remove" onclick="removeCertificate('${cert.id}')">
                    <i class="fa-solid fa-trash"></i> Supprimer
                </button>
            </div>
            
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label required">Type</label>
                    <select class="form-select" onchange="updateCertificate('${cert.id}', 'type', this.value)">
                        <option value="">Sélectionner</option>
                        <option value="NON_LIABILITY_CERTIFICATE" ${cert.type === 'NON_LIABILITY_CERTIFICATE' ? 'selected' : ''}>Non-redevance DGI</option>
                        <option value="LOCATION_CERTIFICATE" ${cert.type === 'LOCATION_CERTIFICATE' ? 'selected' : ''}>Attestation de localisation</option>
                        <option value="TAXPAYER_CARD" ${cert.type === 'TAXPAYER_CARD' ? 'selected' : ''}>Carte contribuable</option>
                        <option value="APPROVAL" ${cert.type === 'APPROVAL' ? 'selected' : ''}>Agrément</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">N° Document</label>
                    <input type="text" class="form-input" value="${cert.number}" 
                        onchange="updateCertificate('${cert.id}', 'number', this.value)">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Émis le</label>
                    <input type="date" class="form-input" value="${cert.issueDate}" 
                        onchange="updateCertificate('${cert.id}', 'issueDate', this.value)">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Expire le</label>
                    <input type="date" class="form-input" value="${cert.expiryDate}" 
                        onchange="updateCertificate('${cert.id}', 'expiryDate', this.value)">
                </div>
                
                <div class="form-group">
                    <label class="form-label">📎 Document</label>
                    <input type="file" class="form-input" accept=".pdf,.jpg,.png">
                </div>
            </div>
        </div>
    `).join('');
}

// ================================================
// GESTION DES CONTACTS
// ================================================

function addContact(type = 'OTHER') {
    const contactId = `contact-${contactIdCounter++}`;
    const contact = {
        id: contactId,
        type: type,
        title: '',
        name: '',
        firstName: '',
        role: '',
        phone: '',
        mobile: '',
        email: '',
        defaultForOrders: type === 'COMMERCIAL',
        receiveCopyInvoices: type === 'ACCOUNTING'
    };
    
    formData.contacts.push(contact);
    renderContacts();
}

function removeContact(contactId) {
    if (formData.contacts.length <= 1) {
        alert('Au moins un contact est obligatoire');
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

function renderContacts() {
    const container = document.getElementById('contacts-container');
    
    if (formData.contacts.length === 0) {
        container.innerHTML = '<p style="color: #9CA3AF; font-size: 13px;">Aucun contact ajouté</p>';
        return;
    }
    
    container.innerHTML = formData.contacts.map((contact, index) => {
        const isCommercial = contact.type === 'COMMERCIAL';
        const isAccounting = contact.type === 'ACCOUNTING';
        
        let title = 'Contact';
        if (isCommercial) title = 'CONTACT PRINCIPAL (Commercial)';
        else if (isAccounting) title = 'CONTACT COMPTABILITÉ';
        else title = `Contact #${index + 1}`;
        
        return `
            <div class="contact-card">
                <div class="card-header">
                    <div class="card-title">
                        <i class="fa-solid fa-user"></i>
                        ${title}
                        ${isCommercial ? '<span style="margin-left: 8px; background: #DBEAFE; color: #1E40AF; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 600;">PRINCIPAL</span>' : ''}
                    </div>
                    ${!isCommercial ? `
                        <button type="button" class="btn-remove" onclick="removeContact('${contact.id}')">
                            <i class="fa-solid fa-trash"></i> Supprimer
                        </button>
                    ` : ''}
                </div>
                
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label ${isCommercial ? 'required' : ''}">Nom</label>
                        <div style="display: flex; gap: 8px;">
                            <select class="form-select" style="width: 80px;" onchange="updateContact('${contact.id}', 'title', this.value)">
                                <option value="">-</option>
                                <option value="M." ${contact.title === 'M.' ? 'selected' : ''}>M.</option>
                                <option value="Mme" ${contact.title === 'Mme' ? 'selected' : ''}>Mme</option>
                            </select>
                            <input type="text" class="form-input" value="${contact.name}" placeholder="DUPONT"
                                onchange="updateContact('${contact.id}', 'name', this.value)" 
                                ${isCommercial ? 'required' : ''} style="flex: 1;">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Prénom</label>
                        <input type="text" class="form-input" value="${contact.firstName}" placeholder="Jean"
                            onchange="updateContact('${contact.id}', 'firstName', this.value)">
                    </div>
                    
                    <div class="form-group form-full">
                        <label class="form-label">Fonction</label>
                        <input type="text" class="form-input" value="${contact.role}" 
                            placeholder="${isCommercial ? 'Directeur Commercial' : isAccounting ? 'Comptable' : 'Fonction'}"
                            onchange="updateContact('${contact.id}', 'role', this.value)">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label ${isCommercial ? 'required' : ''}">Téléphone</label>
                        <input type="tel" class="form-input" value="${contact.phone}" placeholder="+237 6________"
                            onchange="updateContact('${contact.id}', 'phone', this.value)" 
                            ${isCommercial ? 'required' : ''}>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Mobile</label>
                        <input type="tel" class="form-input" value="${contact.mobile}" placeholder="+237 6________"
                            onchange="updateContact('${contact.id}', 'mobile', this.value)">
                    </div>
                    
                    <div class="form-group form-full">
                        <label class="form-label ${isCommercial ? 'required' : ''}">Email</label>
                        <input type="email" class="form-input" value="${contact.email}" 
                            placeholder="contact@example.com"
                            onchange="updateContact('${contact.id}', 'email', this.value)" 
                            ${isCommercial ? 'required' : ''}>
                    </div>
                    
                    ${isCommercial ? `
                        <div class="form-group form-full">
                            <div class="checkbox-item">
                                <input type="checkbox" id="default-orders-${contact.id}" 
                                    ${contact.defaultForOrders ? 'checked' : ''}
                                    onchange="updateContact('${contact.id}', 'defaultForOrders', this.checked)">
                                <label for="default-orders-${contact.id}">Contact par défaut pour les commandes</label>
                            </div>
                        </div>
                    ` : ''}
                    
                    ${isAccounting ? `
                        <div class="form-group form-full">
                            <div class="checkbox-item">
                                <input type="checkbox" id="copy-invoices-${contact.id}" 
                                    ${contact.receiveCopyInvoices ? 'checked' : ''}
                                    onchange="updateContact('${contact.id}', 'receiveCopyInvoices', this.checked)">
                                <label for="copy-invoices-${contact.id}">Recevoir copies factures</label>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// ================================================
// GESTION DES REMISES
// ================================================

function addDiscount() {
    const discountId = `discount-${discountIdCounter++}`;
    const discount = {
        id: discountId,
        threshold: '',
        rate: '',
        application: 'ON_INVOICE'
    };
    
    formData.discounts.push(discount);
    renderDiscounts();
}

function removeDiscount(discountId) {
    if (confirm('Supprimer ce palier de remise ?')) {
        formData.discounts = formData.discounts.filter(d => d.id !== discountId);
        renderDiscounts();
    }
}

function updateDiscount(discountId, field, value) {
    const discount = formData.discounts.find(d => d.id === discountId);
    if (discount) {
        discount[field] = value;
    }
}

function renderDiscounts() {
    const container = document.getElementById('discounts-container');
    
    if (formData.discounts.length === 0) {
        container.innerHTML = '<p style="color: #9CA3AF; font-size: 13px;">Aucun palier de remise</p>';
        return;
    }
    
    container.innerHTML = formData.discounts.map((discount, index) => `
        <div class="discount-tier">
            <div class="card-header">
                <div class="card-title">
                    <i class="fa-solid fa-percent"></i>
                    Palier #${index + 1}
                </div>
                <button type="button" class="btn-remove" onclick="removeDiscount('${discount.id}')">
                    <i class="fa-solid fa-trash"></i> Supprimer
                </button>
            </div>
            
            <div class="form-grid-3">
                <div class="form-group">
                    <label class="form-label">Seuil (XAF)</label>
                    <input type="number" class="form-input" value="${discount.threshold}" 
                        placeholder="1000000"
                        onchange="updateDiscount('${discount.id}', 'threshold', this.value)">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Taux remise (%)</label>
                    <input type="number" class="form-input" value="${discount.rate}" 
                        placeholder="2" step="0.1"
                        onchange="updateDiscount('${discount.id}', 'rate', this.value)">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Application</label>
                    <select class="form-select" onchange="updateDiscount('${discount.id}', 'application', this.value)">
                        <option value="ON_INVOICE" ${discount.application === 'ON_INVOICE' ? 'selected' : ''}>Sur facture</option>
                        <option value="CREDIT_NOTE_QUARTERLY" ${discount.application === 'CREDIT_NOTE_QUARTERLY' ? 'selected' : ''}>Avoir trimestriel</option>
                        <option value="CREDIT_NOTE_ANNUAL" ${discount.application === 'CREDIT_NOTE_ANNUAL' ? 'selected' : ''}>Avoir annuel</option>
                    </select>
                </div>
            </div>
        </div>
    `).join('');
}

// ================================================
// HELPERS
// ================================================

function verifyNIU() {
    const niu = document.getElementById('niu').value.trim();
    if (!niu) {
        alert('Veuillez saisir un NIU');
        return;
    }
    
    // Simuler vérification DGI
    alert('🔍 Vérification DGI en cours...\n\n✅ NIU valide (simulation)');
}

function locateGPS() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                document.getElementById('gps-lat').value = position.coords.latitude.toFixed(6);
                document.getElementById('gps-lng').value = position.coords.longitude.toFixed(6);
            },
            (error) => {
                alert('Impossible d\'obtenir la position GPS');
            }
        );
    } else {
        alert('La géolocalisation n\'est pas supportée par votre navigateur');
    }
}

// ================================================
// VALIDATION SUMMARY
// ================================================

function updateValidationSummary() {
    const summary = document.getElementById('validation-summary');
    const checks = [];
    
    // Check step 1
    const companyName = document.getElementById('company-name').value.trim();
    const businessCategory = document.getElementById('business-category').value;
    checks.push({
        status: companyName && businessCategory ? 'success' : 'error',
        message: 'Informations générales complètes'
    });
    
    // Check step 2
    const niu = document.getElementById('niu').value.trim();
    checks.push({
        status: niu ? 'success' : 'error',
        message: 'NIU vérifié et valide'
    });
    
    // Check certificates expiry
    const hasCertExpiring = formData.certificates.some(cert => {
        if (!cert.expiryDate) return false;
        const expiryDate = new Date(cert.expiryDate);
        const today = new Date();
        const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry > 0 && daysUntilExpiry <= 15;
    });
    
    if (hasCertExpiring) {
        checks.push({
            status: 'warning',
            message: 'Certificat non-redevance expire dans 15 jours'
        });
    }
    
    // Check step 3
    const hasContact = formData.contacts.some(c => c.type === 'COMMERCIAL' && c.name && c.email);
    checks.push({
        status: hasContact ? 'success' : 'error',
        message: 'Au moins un contact défini'
    });
    
    // Check step 4
    const accountNumber = document.getElementById('account-number').value.trim();
    checks.push({
        status: accountNumber ? 'success' : 'error',
        message: 'Coordonnées bancaires renseignées'
    });
    
    const paymentMode = document.getElementById('payment-mode').value;
    checks.push({
        status: paymentMode ? 'success' : 'error',
        message: 'Conditions commerciales définies'
    });
    
    // Render summary
    summary.innerHTML = checks.map(check => `
        <div class="validation-item ${check.status}">
            <i class="fa-solid fa-${check.status === 'success' ? 'check-circle' : check.status === 'warning' ? 'exclamation-triangle' : 'times-circle'}"></i>
            ${check.message}
        </div>
    `).join('');
    
    // Add status change info
    summary.innerHTML += `
        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #E5E7EB;">
            <strong style="font-size: 14px;">Statut après validation :</strong><br>
            <div style="display: flex; align-items: center; gap: 8px; margin-top: 8px;">
                <span class="status-badge status-draft">DRAFT</span>
                <i class="fa-solid fa-arrow-right" style="color: #9CA3AF;"></i>
                <span class="status-badge status-active">ACTIVE</span>
                <span style="font-size: 13px; color: #6B7280;">(après vérification manager)</span>
            </div>
        </div>
    `;
}

// ================================================
// ACTIONS DU FORMULAIRE
// ================================================

function collectAllFormData() {
    const personType = document.querySelector('input[name="person-type"]:checked').value;
    
    const data = {
        // Metadata
        partnerType: 'SUPPLIER',
        subtype: document.querySelector('input[name="subtype"]:checked')?.value,
        language: document.querySelector('input[name="language"]:checked')?.value,
        status: 'DRAFT',
        
        // Step 1: General
        isPhysical: personType === 'physical',
        companyName: document.getElementById('company-name')?.value.trim(),
        tradeName: document.getElementById('trade-name')?.value.trim(),
        legalForm: document.getElementById('legal-form')?.value,
        individualLastname: document.getElementById('individual-lastname')?.value.trim(),
        individualFirstname: document.getElementById('individual-firstname')?.value.trim(),
        individualId: document.getElementById('individual-id')?.value.trim(),
        businessCategory: document.getElementById('business-category').value,
        tags: formData.tags,
        internalNotes: document.getElementById('internal-notes').value.trim(),
        
        // Step 2: Legal & Fiscal
        niu: document.getElementById('niu').value.trim(),
        rccm: document.getElementById('rccm').value.trim(),
        tribunal: document.getElementById('tribunal').value,
        patent: document.getElementById('patent').value.trim(),
        patentValidity: document.getElementById('patent-validity').value,
        capital: document.getElementById('capital').value,
        taxRegime: document.getElementById('tax-regime').value,
        vatSubject: document.getElementById('vat-subject').checked,
        vatRecoverable: document.getElementById('vat-recoverable').checked,
        certificates: formData.certificates,
        
        // Step 3: Contacts & Addresses
        street: document.getElementById('street').value.trim(),
        district: document.getElementById('district').value.trim(),
        poBox: document.getElementById('po-box').value.trim(),
        city: document.getElementById('city').value,
        region: document.getElementById('region').value,
        country: document.getElementById('country').value,
        gpsLat: document.getElementById('gps-lat').value,
        gpsLng: document.getElementById('gps-lng').value,
        contacts: formData.contacts,
        
        // Step 4: Commercial & Banking
        paymentMode: document.getElementById('payment-mode').value,
        paymentDays: document.getElementById('payment-days').value,
        paymentType: document.getElementById('payment-type').value,
        earlyDiscount: document.getElementById('early-discount').value,
        earlyDays: document.getElementById('early-days').value,
        currencyMain: document.getElementById('currency-main').value,
        currencySecondary: document.getElementById('currency-secondary').value,
        incoterm: document.getElementById('incoterm').value,
        minOrder: document.getElementById('min-order').value,
        freeDelivery: document.getElementById('free-delivery').value,
        creditLimit: document.getElementById('credit-limit').value,
        discounts: formData.discounts,
        
        // Banking
        bankName: document.getElementById('bank-name').value.trim(),
        bankCode: document.getElementById('bank-code').value.trim(),
        branchCode: document.getElementById('branch-code').value.trim(),
        accountNumber: document.getElementById('account-number').value.trim(),
        ribKey: document.getElementById('rib-key').value.trim(),
        iban: document.getElementById('iban').value.trim(),
        swift: document.getElementById('swift').value.trim(),
        bankLocation: document.getElementById('bank-location').value.trim(),
        ribVerified: document.getElementById('rib-verified').checked,
        ribVerificationDate: document.getElementById('rib-verification-date').value,
        
        // Step 5: Assignment
        assignedBuyer: document.getElementById('assigned-buyer').value,
        authorizedCompanies: {
            iolaSarl: document.getElementById('company-iola-sarl').checked,
            iolaBtp: document.getElementById('company-iola-btp').checked,
            iolaAgro: document.getElementById('company-iola-agro').checked,
            iolaTransport: document.getElementById('company-iola-transport').checked
        },
        interCompanyShare: document.querySelector('input[name="inter-company-share"]:checked')?.value,
        qualityScore: document.getElementById('quality-score').value,
        deliveryScore: document.getElementById('delivery-score').value,
        priceScore: document.getElementById('price-score').value,
        classification: document.querySelector('input[name="classification"]:checked')?.value,
        
        // Audit
        createdAt: new Date().toISOString(),
        createdBy: 'Marie DJOMO'
    };
    
    return data;
}

function saveDraft() {
    console.log('💾 Enregistrement brouillon...');
    
    const data = collectAllFormData();
    data.status = 'DRAFT';
    
    console.log('Form Data (Draft):', data);
    
    // Simuler l'enregistrement
    setTimeout(() => {
        alert('✅ Fournisseur enregistré en brouillon\n\nCode: FOU-2024-' + Math.floor(Math.random() * 1000).toString().padStart(5, '0'));
        window.location.href = './fournisseurs-list.html';
    }, 500);
}

function submitForm() {
    console.log('✅ Validation et activation fournisseur...');
    
    // Validate all steps
    let allValid = true;
    for (let step = 1; step <= totalSteps; step++) {
        currentStep = step;
        if (!validateCurrentStep()) {
            allValid = false;
            goToStep(step);
            return;
        }
    }
    
    // Reset to step 5
    currentStep = totalSteps;
    
    const data = collectAllFormData();
    data.status = 'ACTIVE';
    
    console.log('Form Data (Active):', data);
    
    // Simuler l'enregistrement
    setTimeout(() => {
        const code = 'FOU-2024-' + Math.floor(Math.random() * 1000).toString().padStart(5, '0');
        alert('✅ Fournisseur créé et activé avec succès !\n\nCode: ' + code + '\n\nLe fournisseur est maintenant disponible pour les commandes.');
        window.location.href = './fournisseurs-list.html';
    }, 500);
}

function cancelForm() {
    if (confirm('Abandonner la création du fournisseur ?\n\nLes données non enregistrées seront perdues.')) {
        window.location.href = './fournisseurs-list.html';
    }
}

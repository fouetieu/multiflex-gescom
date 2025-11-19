// ================================================
// FOURNISSEUR-CREATE.JS
// Gestion du formulaire de création de fournisseur
// ================================================

// État global
let currentTab = 'identity';
let contacts = [];
let uploadedFiles = {};
let contactIdCounter = 1;

// ================================================
// INITIALISATION
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation du formulaire fournisseur...');
    
    // Add first contact by default
    addContact();
});

// ================================================
// GESTION DES ONGLETS
// ================================================

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`tab-${tabName}`).classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    currentTab = tabName;
    console.log('Tab switched to:', tabName);
}

// ================================================
// GESTION DU TYPE DE FOURNISSEUR
// ================================================

function toggleSupplierType() {
    const isInternal = document.getElementById('type-internal').checked;
    const internalNotice = document.getElementById('internal-notice');
    const internalCompanyGroup = document.getElementById('internal-company-group');
    const transferPriceGroup = document.getElementById('transfer-price-group');
    
    if (isInternal) {
        internalNotice.style.display = 'flex';
        internalCompanyGroup.style.display = 'block';
        transferPriceGroup.style.display = 'block';
    } else {
        internalNotice.style.display = 'none';
        internalCompanyGroup.style.display = 'none';
        transferPriceGroup.style.display = 'none';
    }
}

// ================================================
// GESTION DES CONTACTS
// ================================================

function addContact() {
    const contactId = `contact-${contactIdCounter++}`;
    const contact = {
        id: contactId,
        name: '',
        role: '',
        phone: '',
        email: '',
        isPrimary: contacts.length === 0
    };
    
    contacts.push(contact);
    renderContacts();
}

function removeContact(contactId) {
    if (contacts.length <= 1) {
        alert('Au moins un contact est obligatoire');
        return;
    }
    
    if (confirm('Supprimer ce contact ?')) {
        contacts = contacts.filter(c => c.id !== contactId);
        renderContacts();
    }
}

function renderContacts() {
    const container = document.getElementById('contacts-container');
    
    if (contacts.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #9CA3AF;">
                <i class="fa-solid fa-user-plus" style="font-size: 48px; margin-bottom: 16px; opacity: 0.5;"></i>
                <p>Aucun contact ajouté</p>
                <p style="font-size: 13px;">Cliquez sur "Ajouter un contact" pour commencer</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = contacts.map((contact, index) => `
        <div class="contact-card">
            <div class="contact-card-header">
                <div class="contact-card-title">
                    <i class="fa-solid fa-user"></i>
                    Contact #${index + 1}
                    ${contact.isPrimary ? '<span style="margin-left: 8px; background: #DBEAFE; color: #1E40AF; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 600;">PRINCIPAL</span>' : ''}
                </div>
                ${contacts.length > 1 ? `
                    <button type="button" class="btn-remove-contact" onclick="removeContact('${contact.id}')">
                        <i class="fa-solid fa-trash"></i>
                        Supprimer
                    </button>
                ` : ''}
            </div>
            
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label ${contact.isPrimary ? 'required' : ''}">Nom Complet</label>
                    <input 
                        type="text" 
                        class="form-input" 
                        placeholder="Ex: Jean DUPONT"
                        value="${contact.name}"
                        onchange="updateContact('${contact.id}', 'name', this.value)"
                        ${contact.isPrimary ? 'required' : ''}
                    >
                </div>
                
                <div class="form-group">
                    <label class="form-label">Fonction</label>
                    <input 
                        type="text" 
                        class="form-input" 
                        placeholder="Ex: Directeur Commercial"
                        value="${contact.role}"
                        onchange="updateContact('${contact.id}', 'role', this.value)"
                    >
                </div>
                
                <div class="form-group">
                    <label class="form-label ${contact.isPrimary ? 'required' : ''}">Téléphone</label>
                    <input 
                        type="tel" 
                        class="form-input" 
                        placeholder="+237 699 123 456"
                        value="${contact.phone}"
                        onchange="updateContact('${contact.id}', 'phone', this.value)"
                        ${contact.isPrimary ? 'required' : ''}
                    >
                </div>
                
                <div class="form-group">
                    <label class="form-label ${contact.isPrimary ? 'required' : ''}">Email</label>
                    <input 
                        type="email" 
                        class="form-input" 
                        placeholder="contact@example.cm"
                        value="${contact.email}"
                        onchange="updateContact('${contact.id}', 'email', this.value)"
                        ${contact.isPrimary ? 'required' : ''}
                    >
                </div>
            </div>
            
            ${!contact.isPrimary ? `
                <div class="checkbox-item" style="margin-top: 12px;">
                    <input 
                        type="checkbox" 
                        id="primary-${contact.id}" 
                        ${contact.isPrimary ? 'checked' : ''}
                        onchange="setPrimaryContact('${contact.id}')"
                    >
                    <label for="primary-${contact.id}">Définir comme contact principal</label>
                </div>
            ` : ''}
        </div>
    `).join('');
}

function updateContact(contactId, field, value) {
    const contact = contacts.find(c => c.id === contactId);
    if (contact) {
        contact[field] = value;
    }
}

function setPrimaryContact(contactId) {
    contacts.forEach(c => {
        c.isPrimary = (c.id === contactId);
    });
    renderContacts();
}

// ================================================
// GESTION DES FICHIERS
// ================================================

function handleFileUpload(input, type) {
    const files = input.files;
    
    if (files.length === 0) return;
    
    const container = document.getElementById(`uploaded-${type}`);
    
    if (!uploadedFiles[type]) {
        uploadedFiles[type] = [];
    }
    
    // Add new files
    for (let file of files) {
        // Validate file size (5 MB max)
        if (file.size > 5 * 1024 * 1024) {
            alert(`Le fichier "${file.name}" dépasse 5 MB`);
            continue;
        }
        
        uploadedFiles[type].push({
            name: file.name,
            size: file.size,
            type: file.type,
            file: file
        });
    }
    
    renderUploadedFiles(type);
}

function renderUploadedFiles(type) {
    const container = document.getElementById(`uploaded-${type}`);
    const files = uploadedFiles[type] || [];
    
    if (files.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = files.map((file, index) => `
        <div class="uploaded-file">
            <div class="uploaded-file-info">
                <div class="uploaded-file-icon">
                    <i class="fa-solid fa-file-${getFileIcon(file.name)}"></i>
                </div>
                <div>
                    <div style="font-weight: 500; font-size: 14px; color: #1F2937;">${file.name}</div>
                    <div style="font-size: 12px; color: #6B7280;">${formatFileSize(file.size)}</div>
                </div>
            </div>
            <button type="button" class="btn-icon btn-icon-danger" onclick="removeFile('${type}', ${index})" title="Supprimer">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function removeFile(type, index) {
    if (confirm('Supprimer ce fichier ?')) {
        uploadedFiles[type].splice(index, 1);
        renderUploadedFiles(type);
    }
}

function getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const icons = {
        pdf: 'pdf',
        doc: 'word',
        docx: 'word',
        xls: 'excel',
        xlsx: 'excel',
        jpg: 'image',
        jpeg: 'image',
        png: 'image'
    };
    return icons[ext] || 'alt';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// ================================================
// VALIDATION DU FORMULAIRE
// ================================================

function validateForm() {
    const errors = [];
    
    // Tab Identity
    const supplierType = document.querySelector('input[name="supplier-type"]:checked').value;
    const name = document.getElementById('name').value.trim();
    const nui = document.getElementById('nui').value.trim();
    const category = document.getElementById('category').value;
    
    if (!name) errors.push('La raison sociale est obligatoire');
    if (!nui) errors.push('Le NUI est obligatoire');
    if (!category) errors.push('La catégorie est obligatoire');
    
    if (supplierType === 'internal') {
        const internalCompany = document.getElementById('internal-company').value;
        if (!internalCompany) errors.push('Veuillez sélectionner l\'entreprise IOLA');
    }
    
    // Tab Contacts
    const primaryContact = contacts.find(c => c.isPrimary);
    if (!primaryContact || !primaryContact.name || !primaryContact.phone || !primaryContact.email) {
        errors.push('Les informations du contact principal sont obligatoires (nom, téléphone, email)');
    }
    
    // Validate email format
    if (primaryContact && primaryContact.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(primaryContact.email)) {
            errors.push('L\'email du contact principal n\'est pas valide');
        }
    }
    
    return errors;
}

// ================================================
// ACTIONS DU FORMULAIRE
// ================================================

function saveDraft() {
    console.log('💾 Enregistrement brouillon...');
    
    const formData = collectFormData();
    formData.status = 'DRAFT';
    
    console.log('Form Data (Draft):', formData);
    
    // Simuler l'enregistrement
    setTimeout(() => {
        alert('✅ Fournisseur enregistré en brouillon');
        window.location.href = './fournisseurs-list.html';
    }, 500);
}

function submitForm() {
    console.log('✅ Validation et activation fournisseur...');
    
    // Validate
    const errors = validateForm();
    
    if (errors.length > 0) {
        alert('❌ Erreurs de validation:\n\n' + errors.join('\n'));
        return;
    }
    
    const formData = collectFormData();
    formData.status = 'ACTIVE';
    
    console.log('Form Data (Active):', formData);
    
    // Simuler l'enregistrement
    setTimeout(() => {
        alert('✅ Fournisseur activé avec succès !');
        window.location.href = './fournisseurs-list.html';
    }, 500);
}

function collectFormData() {
    const supplierType = document.querySelector('input[name="supplier-type"]:checked').value;
    
    const data = {
        // Identity
        isInternal: supplierType === 'internal',
        internalCompany: document.getElementById('internal-company')?.value || null,
        category: document.getElementById('category').value,
        enableTransferPrice: document.getElementById('enable-transfer-price')?.checked || false,
        
        // Legal
        name: document.getElementById('name').value.trim(),
        legalForm: document.getElementById('legal-form').value,
        capital: document.getElementById('capital').value,
        rccm: document.getElementById('rccm').value.trim(),
        nui: document.getElementById('nui').value.trim(),
        taxNumber: document.getElementById('tax-number').value.trim(),
        
        // Address
        address: document.getElementById('address').value.trim(),
        city: document.getElementById('city').value.trim(),
        postalCode: document.getElementById('postal-code').value.trim(),
        country: document.getElementById('country').value,
        gpsLat: document.getElementById('gps-lat').value,
        gpsLng: document.getElementById('gps-lng').value,
        
        // Contacts
        contacts: contacts,
        
        // Commercial
        currency: document.getElementById('currency').value,
        incoterm: document.getElementById('incoterm').value,
        deliveryDelay: document.getElementById('delivery-delay').value,
        paymentTerms: document.getElementById('payment-terms').value,
        paymentMethod: document.getElementById('payment-method').value,
        discount: document.getElementById('discount').value,
        minOrder: document.getElementById('min-order').value,
        
        // Banking
        bankName: document.getElementById('bank-name').value.trim(),
        iban: document.getElementById('iban').value.trim(),
        swift: document.getElementById('swift').value.trim(),
        accountNumber: document.getElementById('account-number').value.trim(),
        
        // Documents
        documents: uploadedFiles,
        
        // Metadata
        createdAt: new Date().toISOString(),
        createdBy: 'Marie AKONO'
    };
    
    return data;
}

function cancelForm() {
    if (confirm('Abandonner la création du fournisseur ? Les données non enregistrées seront perdues.')) {
        window.location.href = './fournisseurs-list.html';
    }
}

// ================================================
// HELPERS
// ================================================

function generateSupplierCode() {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `FOU-${year}-${random}`;
}


// ================================================
// COMMANDE-SEND.JS
// Envoi du BCF au fournisseur
// ================================================

let currentBCF = null;
let supplierContacts = [];
let selectedMethod = 'email';

// ================================================
// INITIALISATION
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation envoi BCF...');
    loadBCFData();
    loadSupplierContacts();
});

// ================================================
// CHARGEMENT DES DONNÉES
// ================================================

function loadBCFData() {
    // Simulate loading BCF data
    currentBCF = {
        code: 'BCF-2024-1234',
        date: '2024-01-15',
        supplier: 'ABC SARL',
        supplierAddress: 'Zone Industrielle, Douala',
        deliveryDate: '2024-01-25',
        paymentTerms: '30 jours',
        totalAmount: 1150000
    };
    
    // Populate fields
    document.getElementById('bcf-code').textContent = currentBCF.code;
    document.getElementById('bcf-date').textContent = formatDate(currentBCF.date);
    document.getElementById('supplier-name').textContent = currentBCF.supplier;
    document.getElementById('supplier-address').textContent = currentBCF.supplierAddress;
    document.getElementById('delivery-date').textContent = formatDate(currentBCF.deliveryDate);
    document.getElementById('payment-terms').textContent = currentBCF.paymentTerms;
    document.getElementById('total-amount').textContent = formatCurrency(currentBCF.totalAmount);
    document.getElementById('email-subject').value = `Bon de Commande ${currentBCF.code}`;
}

function loadSupplierContacts() {
    // Simulate loading supplier contacts
    supplierContacts = [
        {
            id: 1,
            name: 'Jean DUPONT',
            role: 'Responsable Commercial',
            email: 'j.dupont@abc-sarl.cm',
            phone: '+237 690 00 11 22',
            isPrimary: true
        },
        {
            id: 2,
            name: 'Marie NGONO',
            role: 'Service Achats',
            email: 'm.ngono@abc-sarl.cm',
            phone: '+237 690 00 33 44',
            isPrimary: false
        }
    ];
    
    renderContacts();
}

function renderContacts() {
    const container = document.getElementById('contacts-list');
    
    container.innerHTML = supplierContacts.map(contact => `
        <div class="contact-item">
            <input type="checkbox" id="contact-${contact.id}" ${contact.isPrimary ? 'checked' : ''}>
            <div style="flex: 1;">
                <div style="font-weight: 600; margin-bottom: 2px;">
                    ${contact.name}
                    ${contact.isPrimary ? '<span class="badge badge-primary" style="margin-left: 8px; font-size: 10px;">Principal</span>' : ''}
                </div>
                <div style="font-size: 12px; color: #6B7280;">
                    ${contact.role} • ${contact.email}
                </div>
            </div>
        </div>
    `).join('');
}

// ================================================
// MÉTHODE D'ENVOI
// ================================================

function selectSendMethod(method) {
    selectedMethod = method;
    
    // Update UI
    document.getElementById('method-email').classList.remove('selected');
    document.getElementById('method-portal').classList.remove('selected');
    document.getElementById(`method-${method}`).classList.add('selected');
    
    // Show/hide sections
    document.getElementById('email-section').style.display = method === 'email' ? 'block' : 'none';
    document.getElementById('portal-section').style.display = method === 'portal' ? 'block' : 'none';
}

// ================================================
// APERÇU PDF
// ================================================

function previewPDF() {
    console.log('📄 Génération aperçu PDF...');
    alert('Aperçu PDF: Cette fonctionnalité ouvrira le BCF dans un nouvel onglet');
    // window.open(`./bcf-pdf.html?id=${currentBCF.code}`, '_blank');
}

// ================================================
// VALIDATION & ENVOI
// ================================================

function confirmSend() {
    if (selectedMethod === 'email') {
        return sendByEmail();
    } else {
        return sendToPortal();
    }
}

function sendByEmail() {
    // Check at least one contact selected
    const selectedContacts = supplierContacts.filter((contact, index) => {
        return document.getElementById(`contact-${contact.id}`).checked;
    });
    
    if (selectedContacts.length === 0) {
        alert('Veuillez sélectionner au moins un destinataire');
        return;
    }
    
    const additionalEmails = document.getElementById('additional-emails').value.trim();
    const subject = document.getElementById('email-subject').value.trim();
    const message = document.getElementById('email-message').value.trim();
    const attachPDF = document.getElementById('attach-pdf').checked;
    
    if (!subject) {
        alert('Veuillez saisir l\'objet de l\'email');
        return;
    }
    
    if (!message) {
        alert('Veuillez saisir le message');
        return;
    }
    
    const emailData = {
        bcfCode: currentBCF.code,
        recipients: selectedContacts.map(c => c.email),
        additionalEmails: additionalEmails ? additionalEmails.split(',').map(e => e.trim()) : [],
        subject: subject,
        message: message,
        attachPDF: attachPDF,
        sentAt: new Date().toISOString(),
        sentBy: 'Marie AKONO'
    };
    
    console.log('📧 Envoi email:', emailData);
    
    // Simulate sending
    alert(`BCF envoyé par email à ${selectedContacts.length} destinataire(s)`);
    window.location.href = './commandes-list.html';
}

function sendToPortal() {
    const comment = document.getElementById('portal-comment').value.trim();
    
    const portalData = {
        bcfCode: currentBCF.code,
        comment: comment,
        publishedAt: new Date().toISOString(),
        publishedBy: 'Marie AKONO'
    };
    
    console.log('🌐 Publication portail:', portalData);
    
    // Simulate publishing
    alert('BCF publié sur le portail fournisseur');
    window.location.href = './commandes-list.html';
}

function cancelSend() {
    if (confirm('Annuler l\'envoi du bon de commande ?')) {
        window.location.href = './commandes-list.html';
    }
}

// ================================================
// HELPERS
// ================================================

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount) + ' XAF';
}



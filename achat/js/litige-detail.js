/**
 * Gestion des Litiges Fournisseurs - Détail
 * MultiFlex GESCOM
 */

// Mock data - Détail complet d'un litige
const disputeDetailData = {
    'LIT-2024-0089': {
        disputeNumber: 'LIT-2024-0089',
        disputeDate: '2024-01-25',
        supplierId: 'SUPPLIER-001',
        supplierName: 'ChemTech SARL',
        disputeType: 'QUALITE',
        category: 'RECEPTION',
        status: 'OUVERT',
        priority: 'HAUTE',
        discrepancyAmount: 19200,
        purchaseOrderId: 'BCF-2024-00456',
        receptionId: 'BR-2024-00234',
        invoiceId: null,
        raisedBy: 'Alphonse NJOYA',
        assignedTo: 'Marie DJOMO',
        daysOpen: 8,
        description: `Réception non conforme sur BCF-2024-00456:
- Article CHEM-001: Manque 2L sur 100L commandés (-2%)
- Article CHEM-003: Manque 5KG sur 50KG (-10%) + emballage endommagé rendant le produit inutilisable`,
        expectedValue: `• 100L CHEM-001 en bon état
• 50KG CHEM-003 en bon état`,
        actualValue: `• 98L CHEM-001 conforme
• 45KG CHEM-003 avec emballage percé (produit contaminé)`,
        requestedAction: 'AVOIR',
        requestedAmount: 19200,
        supplierResponse: `Accord pour avoir de 15,000 XAF correspondant aux quantités manquantes. Refuse responsabilité pour emballage endommagé.`,
        counterProposal: `Maintien demande 19,200 XAF ou remplacement complet CHEM-003`,
        photos: [
            {
                name: 'photo_emballage_perce.jpg',
                description: 'Vue du conteneur endommagé',
                uploadDate: '2024-01-25',
                size: '2.4 MB'
            },
            {
                name: 'photo_produit_contamine.jpg',
                description: 'État du produit',
                uploadDate: '2024-01-25',
                size: '1.8 MB'
            },
            {
                name: 'photo_bon_livraison.jpg',
                description: 'BL annoté par magasinier',
                uploadDate: '2024-01-25',
                size: '1.2 MB'
            }
        ],
        documents: [
            {
                name: 'rapport_reception_BR234.pdf',
                description: 'Rapport détaillé de réception',
                uploadDate: '2024-01-25',
                size: '456 KB'
            },
            {
                name: 'correspondance_fournisseur.pdf',
                description: 'Échanges emails',
                uploadDate: '2024-01-29',
                size: '234 KB'
            }
        ],
        correspondences: [
            {
                date: '2024-01-30T15:30:00',
                from: 'Marie DJOMO',
                to: 'Fournisseur',
                type: 'EMAIL',
                message: 'Relance sur notre demande d\'avoir de 19,200 XAF'
            },
            {
                date: '2024-01-29T09:15:00',
                from: 'Fournisseur',
                to: 'Marie DJOMO',
                type: 'EMAIL',
                message: 'Proposition avoir 15,000 XAF pour quantités'
            },
            {
                date: '2024-01-27T14:00:00',
                from: 'Marie DJOMO',
                to: 'Fournisseur',
                type: 'EMAIL',
                message: 'Notification litige avec preuves photos'
            },
            {
                date: '2024-01-25T16:45:00',
                from: 'Système',
                to: 'Alphonse NJOYA',
                type: 'SYSTEM',
                message: 'Litige créé automatiquement depuis BR-234'
            }
        ],
        escalated: false,
        escalationLevel: null
    }
};

// État actuel
let currentDispute = null;

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initialisation du détail litige...');
    
    // Récupérer l'ID du litige depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const disputeId = urlParams.get('id');
    
    if (disputeId) {
        loadDisputeDetails(disputeId);
    } else {
        // Mode création
        initNewDispute();
    }
});

// Charger les détails d'un litige
function loadDisputeDetails(disputeId) {
    currentDispute = disputeDetailData[disputeId];
    
    if (!currentDispute) {
        alert('Litige non trouvé');
        goBack();
        return;
    }
    
    // Remplir les informations générales
    document.getElementById('dispute-number').textContent = currentDispute.disputeNumber;
    document.getElementById('dispute-status').innerHTML = getStatusBadge(currentDispute.status);
    document.getElementById('dispute-priority').innerHTML = getPriorityBadge(currentDispute.priority);
    document.getElementById('dispute-date').textContent = formatDate(currentDispute.disputeDate);
    document.getElementById('dispute-type').textContent = getTypeLabel(currentDispute.disputeType);
    document.getElementById('dispute-category').textContent = currentDispute.category;
    document.getElementById('dispute-supplier').innerHTML = `
        <strong>${currentDispute.supplierName}</strong><br>
        <span style="font-size: 12px; color: #6B7280;">${currentDispute.supplierId}</span>
    `;
    document.getElementById('dispute-amount').textContent = formatCurrency(currentDispute.discrepancyAmount);
    document.getElementById('dispute-raised-by').textContent = currentDispute.raisedBy;
    document.getElementById('dispute-assigned-to').textContent = currentDispute.assignedTo;
    
    // Documents sources
    renderSourceDocuments();
    
    // Description
    document.getElementById('dispute-description').textContent = currentDispute.description;
    document.getElementById('dispute-expected').textContent = currentDispute.expectedValue;
    document.getElementById('dispute-actual').textContent = currentDispute.actualValue;
    
    // Négociation
    document.getElementById('requested-amount').value = currentDispute.requestedAmount;
    if (currentDispute.requestedAction) {
        document.getElementById(`action-${currentDispute.requestedAction.toLowerCase()}`).checked = true;
    }
    
    if (currentDispute.supplierResponse) {
        document.getElementById('supplier-response-container').style.display = 'block';
        document.getElementById('supplier-response').textContent = currentDispute.supplierResponse;
    }
    
    if (currentDispute.counterProposal) {
        document.getElementById('counter-proposal').value = currentDispute.counterProposal;
    }
    
    // Preuves et documents
    renderEvidenceDocuments();
    
    // Correspondances
    renderCorrespondences();
}

// Rendu des documents sources
function renderSourceDocuments() {
    const container = document.getElementById('source-documents');
    let html = '';
    
    if (currentDispute.purchaseOrderId) {
        html += `
            <div class="document-item">
                <div class="document-info">
                    <div class="document-icon" style="background: #E0E7FF; color: #4338CA;">
                        <i class="fa-solid fa-shopping-cart"></i>
                    </div>
                    <div>
                        <div style="font-weight: 600; color: #1F2937;">BCF: ${currentDispute.purchaseOrderId}</div>
                        <div style="font-size: 12px; color: #6B7280;">Bon de commande fournisseur</div>
                    </div>
                </div>
                <div class="document-actions">
                    <button class="btn-icon" onclick="viewDocument('bcf', '${currentDispute.purchaseOrderId}')" title="Voir">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                </div>
            </div>
        `;
    }
    
    if (currentDispute.receptionId) {
        html += `
            <div class="document-item">
                <div class="document-info">
                    <div class="document-icon" style="background: #DBEAFE; color: #1E40AF;">
                        <i class="fa-solid fa-box-open"></i>
                    </div>
                    <div>
                        <div style="font-weight: 600; color: #1F2937;">BR: ${currentDispute.receptionId}</div>
                        <div style="font-size: 12px; color: #6B7280;">Bon de réception</div>
                    </div>
                </div>
                <div class="document-actions">
                    <button class="btn-icon" onclick="viewDocument('br', '${currentDispute.receptionId}')" title="Voir">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                </div>
            </div>
        `;
    }
    
    if (currentDispute.invoiceId) {
        html += `
            <div class="document-item">
                <div class="document-info">
                    <div class="document-icon" style="background: #FEE2E2; color: #991B1B;">
                        <i class="fa-solid fa-file-invoice"></i>
                    </div>
                    <div>
                        <div style="font-weight: 600; color: #1F2937;">Facture: ${currentDispute.invoiceId}</div>
                        <div style="font-size: 12px; color: #6B7280;">Facture fournisseur</div>
                    </div>
                </div>
                <div class="document-actions">
                    <button class="btn-icon" onclick="viewDocument('invoice', '${currentDispute.invoiceId}')" title="Voir">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

// Rendu des preuves et documents
function renderEvidenceDocuments() {
    const container = document.getElementById('evidence-documents');
    let html = '';
    
    // Photos
    if (currentDispute.photos && currentDispute.photos.length > 0) {
        html += '<div style="margin-bottom: 16px;"><strong style="font-size: 14px; color: #374151;">Photos (' + currentDispute.photos.length + ')</strong></div>';
        currentDispute.photos.forEach((photo, index) => {
            html += `
                <div class="document-item">
                    <div class="document-info">
                        <div class="document-icon photo-icon">
                            <i class="fa-solid fa-camera"></i>
                        </div>
                        <div>
                            <div style="font-weight: 600; color: #1F2937;">${photo.name}</div>
                            <div style="font-size: 12px; color: #6B7280;">${photo.description} • ${photo.size}</div>
                        </div>
                    </div>
                    <div class="document-actions">
                        <button class="btn-icon" onclick="viewPhoto(${index})" title="Voir">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        <button class="btn-icon" onclick="downloadPhoto(${index})" title="Télécharger">
                            <i class="fa-solid fa-download"></i>
                        </button>
                    </div>
                </div>
            `;
        });
    }
    
    // Documents
    if (currentDispute.documents && currentDispute.documents.length > 0) {
        html += '<div style="margin: 20px 0 16px;"><strong style="font-size: 14px; color: #374151;">Documents (' + currentDispute.documents.length + ')</strong></div>';
        currentDispute.documents.forEach((doc, index) => {
            html += `
                <div class="document-item">
                    <div class="document-info">
                        <div class="document-icon file-icon">
                            <i class="fa-solid fa-file-pdf"></i>
                        </div>
                        <div>
                            <div style="font-weight: 600; color: #1F2937;">${doc.name}</div>
                            <div style="font-size: 12px; color: #6B7280;">${doc.description} • ${doc.size}</div>
                        </div>
                    </div>
                    <div class="document-actions">
                        <button class="btn-icon" onclick="viewFile(${index})" title="Voir">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        <button class="btn-icon" onclick="downloadFile(${index})" title="Télécharger">
                            <i class="fa-solid fa-download"></i>
                        </button>
                    </div>
                </div>
            `;
        });
    }
    
    container.innerHTML = html;
}

// Rendu des correspondances
function renderCorrespondences() {
    const container = document.getElementById('correspondence-list');
    
    if (!currentDispute.correspondences || currentDispute.correspondences.length === 0) {
        container.innerHTML = '<p style="color: #6B7280; font-size: 14px;">Aucune communication enregistrée</p>';
        return;
    }
    
    const html = currentDispute.correspondences.map(corr => {
        const isSystem = corr.type === 'SYSTEM';
        const borderColor = isSystem ? '#6366F1' : '#E5E7EB';
        
        return `
            <div class="correspondence-item" style="border-left-color: ${borderColor};">
                <div class="correspondence-header">
                    <div>
                        <span class="correspondence-from">${corr.from} → ${corr.to}</span>
                        ${isSystem ? '<span style="margin-left: 8px; font-size: 11px; padding: 2px 8px; background: #E0E7FF; color: #3730A3; border-radius: 10px; font-weight: 600;">SYSTÈME</span>' : ''}
                    </div>
                    <span class="correspondence-date">${formatDateTime(corr.date)}</span>
                </div>
                <div class="correspondence-message">"${corr.message}"</div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = html;
}

// Obtenir le badge de statut
function getStatusBadge(status) {
    const statuses = {
        'OUVERT': { emoji: '🔴', label: 'OUVERT', color: '#EF4444', bgColor: '#FEE2E2' },
        'EN_COURS': { emoji: '🟡', label: 'EN COURS', color: '#F59E0B', bgColor: '#FEF3C7' },
        'RESOLU': { emoji: '✅', label: 'RÉSOLU', color: '#10B981', bgColor: '#D1FAE5' },
        'REJETE': { emoji: '❌', label: 'REJETÉ', color: '#6B7280', bgColor: '#F3F4F6' }
    };
    
    const statusInfo = statuses[status] || statuses['OUVERT'];
    return `<span style="padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; background: ${statusInfo.bgColor}; color: ${statusInfo.color};">${statusInfo.emoji} ${statusInfo.label}</span>`;
}

// Obtenir le badge de priorité
function getPriorityBadge(priority) {
    const priorities = {
        'BASSE': { label: 'Basse', class: 'priority-basse' },
        'NORMALE': { label: 'Normale', class: 'priority-normale' },
        'HAUTE': { label: 'Haute', class: 'priority-haute' },
        'CRITIQUE': { label: 'Critique', class: 'priority-critique' }
    };
    
    const priorityInfo = priorities[priority] || priorities['NORMALE'];
    return `<span class="priority-badge ${priorityInfo.class}">${priorityInfo.label}</span>`;
}

// Obtenir le label du type
function getTypeLabel(type) {
    const types = {
        'QUANTITE': 'Quantité',
        'QUALITE': 'Qualité',
        'PRIX': 'Prix',
        'LIVRAISON': 'Livraison',
        'DOMMAGE': 'Dommage'
    };
    return types[type] || type;
}

// Actions
function viewDocument(type, id) {
    alert(`Affichage du document ${type.toUpperCase()}: ${id}`);
    // Rediriger vers la page du document
}

function viewPhoto(index) {
    const photo = currentDispute.photos[index];
    alert(`Affichage de la photo: ${photo.name}`);
}

function downloadPhoto(index) {
    const photo = currentDispute.photos[index];
    alert(`Téléchargement de: ${photo.name}`);
}

function viewFile(index) {
    const doc = currentDispute.documents[index];
    alert(`Affichage du fichier: ${doc.name}`);
}

function downloadFile(index) {
    const doc = currentDispute.documents[index];
    alert(`Téléchargement de: ${doc.name}`);
}

function addPhoto() {
    alert('Fonctionnalité d\'ajout de photo à implémenter');
}

function addDocument() {
    alert('Fonctionnalité d\'ajout de document à implémenter');
}

function sendMessage() {
    const recipient = document.getElementById('message-recipient').value;
    const type = document.getElementById('message-type').value;
    const message = document.getElementById('new-message').value;
    
    if (!message.trim()) {
        alert('Veuillez saisir un message');
        return;
    }
    
    alert(`Message envoyé à ${recipient} par ${type}`);
    
    // Ajouter à l'historique
    currentDispute.correspondences.unshift({
        date: new Date().toISOString(),
        from: 'Marie DJOMO',
        to: recipient,
        type: type,
        message: message
    });
    
    // Recharger l'historique
    renderCorrespondences();
    
    // Réinitialiser le formulaire
    document.getElementById('new-message').value = '';
}

function acceptProposal() {
    if (confirm('Accepter la proposition du fournisseur ?')) {
        alert('Proposition acceptée. Le litige sera marqué comme résolu.');
        goBack();
    }
}

function escalate() {
    if (confirm('Escalader ce litige au niveau N+1 ?')) {
        alert('Litige escaladé avec succès');
        currentDispute.escalated = true;
        currentDispute.escalationLevel = 'N+1';
    }
}

function closeDispute() {
    if (confirm('Clôturer ce litige définitivement ?')) {
        alert('Litige clôturé avec succès');
        goBack();
    }
}

function putOnHold() {
    if (confirm('Mettre ce litige en attente ?')) {
        alert('Litige mis en attente');
    }
}

function goBack() {
    window.location.href = './litiges-list.html';
}

function initNewDispute() {
    // Mode création d'un nouveau litige
    document.getElementById('dispute-number').textContent = 'NOUVEAU';
    document.getElementById('resolution-status').textContent = 'Nouveau litige en cours de création';
}

// Formatage de la date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit',
        year: 'numeric'
    });
}

// Formatage de la date/heure
function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Formatage de la monnaie
function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' XAF';
}

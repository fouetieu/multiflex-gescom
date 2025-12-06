/**
 * MultiFlex GESCOM - Détail Réclamation Client
 * ECR-RCL-002 : Gestion d'un ticket de réclamation
 */

// ============================================================================
// MOCK DATA
// ============================================================================

const mockClaims = {
    'RCL-2024-00234': {
        number: 'RCL-2024-00234',
        client: {
            name: 'SONACOM SARL',
            code: 'CLI-2024-00156',
            initials: 'SS',
            contact: 'M. NKOULOU',
            phone: '+237 699 123 456',
            email: 'contact@sonacom.cm'
        },
        type: 'quality',
        typeLabel: 'Qualité produit',
        subject: 'Peinture ne tient pas après 2 jours',
        description: `Peinture qui ne tient pas après 2 jours, problème de qualité sur lot PEINT-0124-B.
Le client signale que la peinture s'écaille et se décolle sur plusieurs murs.
Demande un remplacement complet du lot.`,
        priority: 'critical',
        status: 'in_progress',
        assignedTo: 'Service Qualité',
        creationDate: '30/01/2024 09:15',
        slaDeadline: '30/01/2024 13:15',
        slaStatus: 'warning',
        slaRemaining: '2h restantes',
        relatedDocs: [
            { type: 'FA', number: 'FA-CLI156-2024-00567', label: 'Facture du 25/01/2024' },
            { type: 'BL', number: 'BL-CLI156-2024-00235', label: 'Bon de livraison' }
        ],
        timeline: [
            {
                date: '30/01/2024 11:00',
                type: 'action',
                title: 'Visite technique programmée',
                text: 'Technicien envoyé sur site pour constater les dégâts',
                author: 'Marie DJOMO - Service Qualité'
            },
            {
                date: '30/01/2024 10:00',
                type: 'action',
                title: 'Contact client par téléphone',
                text: 'Client contacté pour obtenir plus de détails et photos',
                author: 'Jean MBARGA - Service Qualité'
            },
            {
                date: '30/01/2024 09:20',
                type: 'system',
                title: 'Assigné à Service Qualité',
                text: 'Ticket automatiquement assigné selon le type de réclamation',
                author: 'Système'
            },
            {
                date: '30/01/2024 09:15',
                type: 'system',
                title: 'Réclamation créée',
                text: 'Ticket ouvert suite à appel client',
                author: 'Réception - FOTSO Paul'
            }
        ],
        resolution: null
    },
    'RCL-2024-00229': {
        number: 'RCL-2024-00229',
        client: {
            name: 'DEPOT CENTRAL',
            code: 'CLI-2024-00078',
            initials: 'DC',
            contact: 'M. TCHATCHOUA',
            phone: '+237 677 456 789',
            email: 'depot.central@email.cm'
        },
        type: 'delay',
        typeLabel: 'Délai livraison',
        subject: 'Commande urgente non livrée',
        description: 'Commande CMD-CLI078-2024-00289 commandée en urgence pour un chantier. Délai initial de 24h non respecté.',
        priority: 'high',
        status: 'resolved',
        assignedTo: 'Logistique',
        creationDate: '28/01/2024 15:30',
        slaDeadline: '28/01/2024 23:30',
        slaStatus: 'breach',
        slaRemaining: 'Dépassé de 24h',
        relatedDocs: [
            { type: 'CMD', number: 'CMD-CLI078-2024-00289', label: 'Commande urgente' }
        ],
        timeline: [
            {
                date: '29/01/2024 10:00',
                type: 'action',
                title: 'Réclamation résolue',
                text: 'Livraison effectuée avec remise de 15% pour le désagrément',
                author: 'Logistique - KAMGA Pierre'
            },
            {
                date: '29/01/2024 08:00',
                type: 'action',
                title: 'Livraison en cours',
                text: 'Camion parti du dépôt',
                author: 'Logistique'
            },
            {
                date: '28/01/2024 16:00',
                type: 'escalation',
                title: 'Escalade vers Direction',
                text: 'SLA dépassé, escalade automatique',
                author: 'Système'
            }
        ],
        resolution: 'Livraison effectuée avec remise commerciale de 15% sur la commande'
    }
};

let currentClaim = null;

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Get claim ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const claimId = urlParams.get('id') || 'RCL-2024-00234';

    loadClaim(claimId);
});

// ============================================================================
// LOAD CLAIM
// ============================================================================

/**
 * Load claim data
 */
function loadClaim(claimId) {
    const claim = mockClaims[claimId];

    if (!claim) {
        // Default to first mock claim
        currentClaim = mockClaims['RCL-2024-00234'];
    } else {
        currentClaim = claim;
    }

    renderClaim();
}

/**
 * Render claim data
 */
function renderClaim() {
    // Header
    document.getElementById('ticketNumber').textContent = currentClaim.number;

    // Status badge
    const statusBadge = document.getElementById('statusBadge');
    const statusLabels = {
        open: 'Ouvert',
        in_progress: 'En cours',
        pending: 'En attente',
        resolved: 'Résolu',
        closed: 'Clôturé'
    };
    statusBadge.textContent = statusLabels[currentClaim.status];
    statusBadge.className = `status-badge ${currentClaim.status}`;

    // Info
    document.getElementById('claimType').textContent = currentClaim.typeLabel;
    document.getElementById('creationDate').textContent = currentClaim.creationDate;
    document.getElementById('assignedTo').textContent = currentClaim.assignedTo;

    // Priority
    const priorityBadge = document.getElementById('priorityBadge');
    const priorityLabels = {
        critical: 'Critique',
        high: 'Haute',
        medium: 'Moyenne',
        low: 'Basse'
    };
    priorityBadge.innerHTML = currentClaim.priority === 'critical'
        ? `<i class="fa-solid fa-fire"></i> ${priorityLabels[currentClaim.priority]}`
        : priorityLabels[currentClaim.priority];
    priorityBadge.className = `priority-badge ${currentClaim.priority}`;

    // SLA
    const slaBox = document.getElementById('slaBox');
    slaBox.className = `sla-box ${currentClaim.slaStatus}`;
    document.getElementById('slaTime').textContent = currentClaim.slaRemaining;
    document.getElementById('slaDeadline').textContent = `Échéance: ${currentClaim.slaDeadline}`;

    // Description
    document.getElementById('claimSubject').value = currentClaim.subject;
    document.getElementById('claimDescription').textContent = currentClaim.description;

    // Client
    document.getElementById('clientInitials').textContent = currentClaim.client.initials;
    document.getElementById('clientName').textContent = currentClaim.client.name;
    document.getElementById('clientCode').textContent = currentClaim.client.code;

    // Related docs
    renderRelatedDocs();

    // Timeline
    renderTimeline();

    // Resolution (if resolved)
    if (currentClaim.resolution) {
        document.getElementById('resolutionCard').style.display = 'block';
        document.getElementById('resolutionText').textContent = currentClaim.resolution;
    } else {
        document.getElementById('resolutionCard').style.display = 'none';
    }

    // Update header buttons based on status
    updateHeaderButtons();
}

/**
 * Render related documents
 */
function renderRelatedDocs() {
    const container = document.getElementById('relatedDocs');

    const iconMap = {
        'FA': 'fa-file-invoice',
        'BL': 'fa-truck',
        'CMD': 'fa-shopping-cart',
        'RET': 'fa-rotate-left',
        'AV': 'fa-file-invoice-dollar'
    };

    container.innerHTML = currentClaim.relatedDocs.map(doc => `
        <a href="#" class="doc-link" onclick="viewDocument('${doc.number}')">
            <i class="fa-solid ${iconMap[doc.type] || 'fa-file'}"></i>
            <div>
                <div style="font-weight: 500;">${doc.number}</div>
                <div style="font-size: 11px; color: #6B7280;">${doc.label}</div>
            </div>
        </a>
    `).join('');
}

/**
 * Render timeline
 */
function renderTimeline() {
    const container = document.getElementById('timeline');

    container.innerHTML = currentClaim.timeline.map(item => `
        <div class="timeline-item">
            <div class="timeline-dot ${item.type}"></div>
            <div class="timeline-date">${item.date}</div>
            <div class="timeline-content">
                <div class="timeline-title">${item.title}</div>
                <div class="timeline-text">${item.text}</div>
                <div class="timeline-author">${item.author}</div>
            </div>
        </div>
    `).join('');
}

/**
 * Update header buttons based on status
 */
function updateHeaderButtons() {
    // In a real app, would show/hide buttons based on status
}

// ============================================================================
// ACTIONS
// ============================================================================

/**
 * Add action to timeline
 */
function addAction() {
    const actionType = prompt(`Type d'action:\n\n1. Contact téléphonique\n2. Email envoyé\n3. Visite programmée\n4. Document demandé\n5. Autre\n\nEntrez le numéro:`);

    const actionTypes = {
        '1': 'Contact téléphonique',
        '2': 'Email envoyé',
        '3': 'Visite programmée',
        '4': 'Document demandé',
        '5': 'Autre'
    };

    if (actionType && actionTypes[actionType]) {
        const details = prompt(`Détails de l'action "${actionTypes[actionType]}":`);

        if (details) {
            // Add to timeline (in real app, would save to API)
            const newAction = {
                date: new Date().toLocaleString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                type: 'action',
                title: actionTypes[actionType],
                text: details,
                author: 'Utilisateur actuel'
            };

            currentClaim.timeline.unshift(newAction);
            renderTimeline();

            alert('Action ajoutée avec succès!');
        }
    }
}

/**
 * Escalate claim
 */
function escalateClaim() {
    if (confirm(`Escalader le ticket ${currentClaim.number} vers la Direction ?

Cette action va:
- Notifier la direction générale
- Augmenter la priorité à "Critique"
- Réduire le délai SLA

Confirmer l'escalade ?`)) {
        // Add escalation to timeline
        const escalation = {
            date: new Date().toLocaleString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            type: 'escalation',
            title: 'Escalade vers Direction',
            text: 'Ticket escaladé manuellement par l\'utilisateur',
            author: 'Utilisateur actuel'
        };

        currentClaim.timeline.unshift(escalation);
        currentClaim.priority = 'critical';
        renderClaim();

        alert(`Ticket ${currentClaim.number} escaladé!

La direction a été notifiée.`);
    }
}

/**
 * Resolve claim
 */
function resolveClaim() {
    const resolution = prompt(`Résolution du ticket ${currentClaim.number}:

Décrivez la solution apportée au client:`);

    if (resolution) {
        // Update claim
        currentClaim.status = 'resolved';
        currentClaim.resolution = resolution;

        // Add to timeline
        const resolveAction = {
            date: new Date().toLocaleString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            type: 'action',
            title: 'Réclamation résolue',
            text: resolution,
            author: 'Utilisateur actuel'
        };

        currentClaim.timeline.unshift(resolveAction);
        renderClaim();

        alert(`Ticket ${currentClaim.number} résolu!

Le client sera notifié de la résolution.`);
    }
}

/**
 * Create return from claim
 */
function createReturn() {
    window.location.href = `./retour-create.html?claim=${currentClaim.number}`;
}

/**
 * Create avoir from claim
 */
function createAvoir() {
    window.location.href = `./avoir-create.html?claim=${currentClaim.number}`;
}

/**
 * Contact client
 */
function contactClient() {
    alert(`Appel client: ${currentClaim.client.phone}

Contact: ${currentClaim.client.contact}
Email: ${currentClaim.client.email}`);
}

/**
 * Schedule visit
 */
function scheduleVisit() {
    const date = prompt('Date de la visite (JJ/MM/AAAA):');
    const time = prompt('Heure de la visite (HH:MM):');

    if (date && time) {
        // Add to timeline
        const visitAction = {
            date: new Date().toLocaleString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            type: 'action',
            title: 'Visite programmée',
            text: `Visite technique prévue le ${date} à ${time}`,
            author: 'Utilisateur actuel'
        };

        currentClaim.timeline.unshift(visitAction);
        renderTimeline();

        alert(`Visite programmée pour le ${date} à ${time}.

Un rappel sera envoyé au client.`);
    }
}

/**
 * View related document
 */
function viewDocument(docNumber) {
    alert(`Ouverture du document ${docNumber}...`);
    // In real app, would navigate to document
}

/**
 * Print claim
 */
function printClaim() {
    alert(`Impression du ticket ${currentClaim.number}...`);
}

/**
 * Go back
 */
function goBack() {
    window.location.href = './reclamations-list.html';
}

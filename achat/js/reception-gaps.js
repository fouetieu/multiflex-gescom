// ================================================
// RECEPTION-GAPS.JS
// Gestion des écarts de réception
// ================================================

let gaps = [
    {
        id: 'gap-1',
        article: 'Diluant',
        type: 'QUANTITÉ',
        commanded: '100L',
        received: '95L',
        ecart: '-5L (-5%)',
        severity: 'warning',
        description: 'Manque 5L de diluant sur commande',
        photos: [],
        action: 'COMPLEMENT_LIVRAISON',
        amount: 7500
    },
    {
        id: 'gap-2',
        article: 'Peinture',
        type: 'QUALITÉ',
        commanded: 'OK',
        received: 'NOK',
        ecart: 'Emballage endommagé',
        severity: 'error',
        description: 'Emballage endommagé à la réception',
        photos: [],
        action: 'RETOUR',
        amount: 0
    }
];

let uploadedFiles = [];

// ================================================
// INITIALISATION
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation gestion écarts...');
    
    renderGapsTable();
    renderGapsAccordions();
});

// ================================================
// TABLEAU ÉCARTS
// ================================================

function renderGapsTable() {
    const tbody = document.getElementById('gaps-tbody');
    
    tbody.innerHTML = gaps.map((gap, idx) => `
        <tr onclick="toggleAccordion('accordion-${gap.id}')">
            <td style="font-weight: 600; color: #6B7280; text-align: center;">${idx + 1}</td>
            <td>${gap.article}</td>
            <td>
                <span class="gap-type-badge ${gap.type === 'QUANTITÉ' ? 'gap-quantite' : 'gap-qualite'}">
                    ${gap.type === 'QUANTITÉ' ? '📦' : '⚠️'} ${gap.type}
                </span>
            </td>
            <td style="text-align: center;">${gap.commanded}</td>
            <td style="text-align: center;">${gap.received}</td>
            <td>
                <span class="ecart-value">${gap.ecart}</span>
            </td>
        </tr>
    `).join('');
}

// ================================================
// ACCORDIONS LITIGES
// ================================================

function renderGapsAccordions() {
    const container = document.getElementById('gaps-accordions');
    
    container.innerHTML = gaps.map((gap, idx) => `
        <div class="accordion" id="accordion-${gap.id}">
            <div class="accordion-header" onclick="toggleAccordion('accordion-${gap.id}')">
                <div>
                    <i class="fa-solid fa-${gap.type === 'QUANTITÉ' ? 'weight' : 'flask'}"></i>
                    Création Dossier Litige #${idx + 1} - ${gap.article}
                </div>
                <i class="fa-solid fa-chevron-down accordion-icon"></i>
            </div>
            
            <div class="accordion-content" id="content-${gap.id}">
                <div class="info-box">
                    <div class="info-row">
                        <span class="info-label">Article:</span>
                        <span class="info-value">${gap.article}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Type d'écart:</span>
                        <span class="info-value">${gap.type}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Écart détecté:</span>
                        <span class="info-value">${gap.ecart}</span>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Type d'écart <span style="color: #EF4444;">*</span></label>
                    <select class="form-select" id="gap-type-${gap.id}" required>
                        <option value="QUANTITÉ_MANQUANTE" ${gap.type === 'QUANTITÉ' ? 'selected' : ''}>Quantité manquante</option>
                        <option value="QUANTITÉ_SURPLUS">Quantité en surplus</option>
                        <option value="QUALITÉ_DÉFAUT" ${gap.type === 'QUALITÉ' ? 'selected' : ''}>Défaut de qualité</option>
                        <option value="EMBALLAGE_ENDOMMAGÉ">Emballage endommagé</option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">Description <span style="color: #EF4444;">*</span></label>
                    <textarea class="form-textarea" id="gap-description-${gap.id}" placeholder="Détail de l'écart..." required>${gap.description}</textarea>
                </div>

                <div class="form-group">
                    <label class="form-label">Photos/Preuves</label>
                    <div class="file-upload-zone" onclick="document.getElementById('file-${gap.id}').click()">
                        <i class="fa-solid fa-image"></i>
                        <p>Ajouter des photos...</p>
                    </div>
                    <input type="file" id="file-${gap.id}" style="display: none;" accept="image/*" multiple onchange="handleFileUpload(event, '${gap.id}')">
                    <div id="files-${gap.id}" style="margin-top: 12px;">
                        <!-- Files displayed here -->
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Action souhaitée <span style="color: #EF4444;">*</span></label>
                    <div class="radio-group" style="flex-direction: column;">
                        <div class="radio-item">
                            <input type="radio" id="action-avoir-${gap.id}" name="action-${gap.id}" value="AVOIR">
                            <label for="action-avoir-${gap.id}">Avoir (crédit)</label>
                        </div>
                        <div class="radio-item">
                            <input type="radio" id="action-complement-${gap.id}" name="action-${gap.id}" value="COMPLEMENT_LIVRAISON" ${gap.action === 'COMPLEMENT_LIVRAISON' ? 'checked' : ''}>
                            <label for="action-complement-${gap.id}">Complément de livraison</label>
                        </div>
                        <div class="radio-item">
                            <input type="radio" id="action-retour-${gap.id}" name="action-${gap.id}" value="RETOUR" ${gap.action === 'RETOUR' ? 'checked' : ''}>
                            <label for="action-retour-${gap.id}">Retour marchandise</label>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Montant réclamé <span style="color: #EF4444;">*</span></label>
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <input type="number" class="form-input" id="gap-amount-${gap.id}" value="${gap.amount}" min="0" style="flex: 1;">
                        <span style="font-weight: 600; color: #263c89;">XAF</span>
                    </div>
                </div>

                <div style="display: flex; gap: 12px; margin-top: 20px;">
                    <button type="button" class="btn btn-success" onclick="createDispute('${gap.id}')">
                        <i class="fa-solid fa-check"></i>
                        Créer litige et notifier fournisseur
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function toggleAccordion(accordionId) {
    const accordion = document.getElementById(accordionId);
    const header = accordion.querySelector('.accordion-header');
    const content = accordion.querySelector('.accordion-content');
    
    // Close all other accordions
    document.querySelectorAll('.accordion').forEach(acc => {
        if (acc.id !== accordionId) {
            acc.querySelector('.accordion-header').classList.remove('active');
            acc.querySelector('.accordion-content').classList.remove('active');
        }
    });
    
    // Toggle current
    header.classList.toggle('active');
    content.classList.toggle('active');
}

// ================================================
// FILE MANAGEMENT
// ================================================

function handleFileUpload(event, gapId) {
    const files = event.target.files;
    const container = document.getElementById(`files-${gapId}`);
    
    Array.from(files).forEach(file => {
        if (file.size > 10 * 1024 * 1024) {
            alert(`${file.name} est trop volumineux (max 10 Mo)`);
            return;
        }
        
        uploadedFiles.push({
            gapId: gapId,
            name: file.name,
            size: file.size
        });
    });
    
    renderUploadedFiles(gapId, container);
    event.target.value = '';
}

function renderUploadedFiles(gapId, container) {
    const gapFiles = uploadedFiles.filter(f => f.gapId === gapId);
    
    container.innerHTML = gapFiles.map((file, idx) => `
        <div class="file-item">
            <i class="fa-solid fa-file-image"></i>
            <span>${file.name}</span>
            <button type="button" class="file-item-remove" onclick="removeFile('${gapId}', ${idx})">
                <i class="fa-solid fa-times"></i>
            </button>
        </div>
    `).join('');
}

function removeFile(gapId, index) {
    const gapFiles = uploadedFiles.filter(f => f.gapId === gapId);
    uploadedFiles = uploadedFiles.filter(f => 
        !(f.gapId === gapId && uploadedFiles.indexOf(f) === uploadedFiles.indexOf(gapFiles[index]))
    );
    
    renderUploadedFiles(gapId, document.getElementById(`files-${gapId}`));
}

// ================================================
// ACTIONS
// ================================================

function createDispute(gapId) {
    const gap = gaps.find(g => g.id === gapId);
    const gapType = document.getElementById(`gap-type-${gapId}`).value;
    const description = document.getElementById(`gap-description-${gapId}`).value;
    const action = document.querySelector(`input[name="action-${gapId}"]:checked`)?.value;
    const amount = document.getElementById(`gap-amount-${gapId}`).value;
    
    if (!gapType || !description || !action) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }
    
    console.log('📋 Création litige:', {
        gapId,
        article: gap.article,
        type: gapType,
        description,
        action,
        amount,
        files: uploadedFiles.filter(f => f.gapId === gapId)
    });
    
    alert(`✅ Litige créé avec succès !\n\nN° Litige: LITIGE-2024-015\nNotification envoyée au fournisseur`);
    
    // Close accordion
    const accordion = document.getElementById(`accordion-${gapId}`);
    accordion.querySelector('.accordion-header').classList.remove('active');
    accordion.querySelector('.accordion-content').classList.remove('active');
}

// ================================================
// DEMANDE-ACHAT-CREATE.JS
// Gestion du formulaire de création de DA
// ================================================

// État global
let items = [];
let itemIdCounter = 1;
let uploadedFiles = [];
let documentConfigs = [];
let documentsByType = {}; // { docTypeCode: [files] }

// ================================================
// INITIALISATION
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation du formulaire DA...');
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
    
    // Set default delivery date to +7 days
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7);
    document.getElementById('delivery-date').value = deliveryDate.toISOString().split('T')[0];
    
    // Load document configurations
    loadDocumentConfigs();
    
    // Add first item by default
    addItem();
    
    // Update priority indicator
    updatePriorityIndicator();
    
    // Setup event listeners
    document.getElementById('date').addEventListener('change', checkDeliveryDelay);
    document.getElementById('delivery-date').addEventListener('change', checkDeliveryDelay);
    
    // Listen to priority changes for document requirements
    document.querySelectorAll('input[name="priority"]').forEach(radio => {
        radio.addEventListener('change', updateDocumentRequirements);
    });
    
    checkDeliveryDelay();
    updateWorkflowDisplay();
});

// ================================================
// GESTION DE LA PRIORITÉ
// ================================================

function updatePriorityIndicator() {
    const priority = document.querySelector('input[name="priority"]:checked').value;
    const indicator = document.getElementById('priority-indicator');
    
    const messages = {
        'BASSE': {
            class: 'basse',
            icon: '🟢',
            text: 'Traitement standard - Délai normal',
            desc: 'La demande sera traitée selon les délais habituels'
        },
        'NORMALE': {
            class: 'normale',
            icon: '🟡',
            text: 'Priorité normale - Traitement standard',
            desc: 'Délai de livraison standard respecté'
        },
        'HAUTE': {
            class: 'haute',
            icon: '🟠',
            text: 'Priorité haute - Traitement accéléré',
            desc: 'La demande sera traitée en priorité'
        },
        'URGENTE': {
            class: 'urgente',
            icon: '🔴',
            text: 'URGENCE - Traitement immédiat requis',
            desc: 'Validation et traitement prioritaires. Justification obligatoire.'
        }
    };
    
    const info = messages[priority];
    indicator.innerHTML = `
        <div class="priority-indicator ${info.class}">
            ${info.icon} ${info.text}
        </div>
        <div style="font-size: 12px; color: #6B7280; margin-top: 6px;">
            ${info.desc}
        </div>
    `;
}

// ================================================
// VALIDATION DU DÉLAI
// ================================================

function checkDeliveryDelay() {
    const dateInput = document.getElementById('date').value;
    const deliveryInput = document.getElementById('delivery-date').value;
    const priority = document.querySelector('input[name="priority"]:checked').value;
    const infoElement = document.getElementById('delivery-delay-info');
    
    if (!dateInput || !deliveryInput) {
        infoElement.textContent = '';
        return;
    }
    
    const requestDate = new Date(dateInput);
    const deliveryDate = new Date(deliveryInput);
    const diffTime = deliveryDate - requestDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
        infoElement.textContent = '⚠️ Date de livraison antérieure à la date de demande';
        infoElement.style.color = '#EF4444';
    } else if (diffDays < 7 && priority !== 'URGENTE') {
        infoElement.textContent = `⚠️ Délai court (${diffDays} jours) - Considérer priorité URGENTE`;
        infoElement.style.color = '#F59E0B';
    } else {
        infoElement.textContent = `✓ Délai: ${diffDays} jours`;
        infoElement.style.color = '#10B981';
    }
}

// ================================================
// GESTION DES ARTICLES
// ================================================

function addItem() {
    const itemId = `item-${itemIdCounter++}`;
    const item = {
        id: itemId,
        type: 'CATALOGUED', // CATALOGUED or FREE_TEXT
        article: '',
        articleId: '',
        productCode: '',
        productName: '',
        description: '',
        quantity: '',
        unit: 'U',
        unitPrice: '',
        total: 0,
        suggestedSupplierId: '',
        notes: ''
    };
    
    items.push(item);
    renderItems();
    
    // Focus on type field of new item
    setTimeout(() => {
        document.querySelector(`#${itemId}-type`)?.focus();
    }, 100);
}

function removeItem(itemId) {
    if (items.length <= 1) {
        alert('Au moins un article est obligatoire');
        return;
    }
    
    items = items.filter(i => i.id !== itemId);
    renderItems();
    calculateTotal();
}

function updateItem(itemId, field, value) {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    
    item[field] = value;
    
    // Recalculate total for this item
    if (field === 'quantity' || field === 'unitPrice') {
        const quantity = parseFloat(item.quantity) || 0;
        const unitPrice = parseFloat(item.unitPrice) || 0;
        item.total = quantity * unitPrice;
        
        // Update total display for this row
        const totalEl = document.getElementById(`${itemId}-total`);
        if (totalEl) {
            totalEl.textContent = formatCurrency(item.total);
        }
    }
    
    calculateTotal();
}

// ================================================
// RECHERCHE ARTICLES
// ================================================

function openArticleSearch(itemId) {
    // Mock articles database
    const mockArticles = [
        { id: 'ART-001', name: 'Ciment Portland 42.5', unit: 'sac' },
        { id: 'ART-002', name: 'Fer à béton Ø12mm', unit: 'barre' },
        { id: 'ART-003', name: 'Sable de rivière', unit: 'm³' },
        { id: 'ART-004', name: 'Gravier concassé', unit: 'm³' },
        { id: 'ART-005', name: 'Carrelage 40x40', unit: 'm²' },
        { id: 'ART-006', name: 'Tuiles canal', unit: 'unité' },
        { id: 'ART-007', name: 'Peinture acrylique blanc', unit: 'L' },
        { id: 'ART-008', name: 'Vernis polyuréthane', unit: 'L' }
    ];
    
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    
    const searchTerm = item.article.toLowerCase();
    const filtered = mockArticles.filter(art => 
        art.name.toLowerCase().includes(searchTerm) || art.id.includes(searchTerm)
    );
    
    // Show a simple list or modal-like behavior
    if (filtered.length === 0) {
        alert('Aucun article trouvé pour: ' + item.article);
        return;
    }
    
    // For now, auto-select first match or show options
    if (filtered.length === 1) {
        selectArticle(itemId, filtered[0]);
    } else {
        // Show selection prompt
        let msg = 'Articles trouvés:\n\n';
        filtered.forEach((art, idx) => {
            msg += `${idx + 1}. ${art.name} (${art.id})\n`;
        });
        msg += '\nVeuillez cliquer sur un article ou continuer la saisie manuelle.';
        console.log(msg);
    }
}

function selectArticle(itemId, article) {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    
    item.articleId = article.id;
    item.article = article.name;
    item.description = article.name;
    item.unit = article.unit;
    
    renderItems();
    
    // Focus on quantity
    setTimeout(() => {
        document.querySelector(`#${itemId}-quantity`)?.focus();
    }, 100);
}

function renderItems() {
    const tbody = document.getElementById('items-tbody');
    
    tbody.innerHTML = items.map((item, index) => {
        const isCatalogued = item.type === 'CATALOGUED';
        
        return `
        <tr>
            <td style="text-align: center; font-weight: 600; color: #6B7280;">${index + 1}</td>
            <td>
                <select id="${item.id}-type" onchange="updateItem('${item.id}', 'type', this.value); renderItems();" 
                    style="padding: 8px; border: 1px solid #D1D5DB; border-radius: 6px; width: 100%; font-size: 14px;">
                    <option value="CATALOGUED" ${isCatalogued ? 'selected' : ''}>[C] Catalogué</option>
                    <option value="FREE_TEXT" ${!isCatalogued ? 'selected' : ''}>[L] Libre</option>
                </select>
            </td>
            <td>
                ${isCatalogued ? `
                    <div style="position: relative;">
                        <i class="fa-solid fa-search" style="position: absolute; left: 8px; top: 50%; transform: translateY(-50%); color: #9CA3AF; pointer-events: none;"></i>
                        <input 
                            type="text" 
                            id="${item.id}-article"
                            placeholder="🔍 Rechercher..."
                            value="${item.article}"
                            onchange="updateItem('${item.id}', 'article', this.value)"
                            onclick="openArticleSearch('${item.id}')"
                            style="padding-left: 32px;"
                            required
                        >
                    </div>
                    ${item.productCode ? `<div style="font-size: 11px; color: #6B7280; margin-top: 2px;">Code: ${item.productCode}</div>` : ''}
                    ${item.productName ? `<div style="font-size: 11px; color: #374151; margin-top: 2px;">Nom: ${item.productName}</div>` : ''}
                ` : `
                    <textarea 
                        id="${item.id}-description"
                        placeholder="Description libre..."
                        onchange="updateItem('${item.id}', 'description', this.value)"
                        style="width: 100%; min-height: 60px; padding: 8px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 14px; resize: vertical;"
                        required
                    >${item.description}</textarea>
                `}
                ${item.notes ? `<div style="font-size: 11px; color: #6B7280; margin-top: 4px;">Notes: ${item.notes}</div>` : ''}
            </td>
            <td>
                <input 
                    type="number" 
                    id="${item.id}-quantity"
                    placeholder="0"
                    value="${item.quantity}"
                    onchange="updateItem('${item.id}', 'quantity', this.value)"
                    min="0"
                    step="0.01"
                    required
                >
            </td>
            <td>
                <input 
                    type="text" 
                    id="${item.id}-unit"
                    placeholder="U"
                    value="${item.unit}"
                    onchange="updateItem('${item.id}', 'unit', this.value)"
                    style="text-align: center;"
                    required
                >
            </td>
            <td>
                <input 
                    type="number" 
                    id="${item.id}-unitPrice"
                    placeholder="0"
                    value="${item.unitPrice}"
                    onchange="updateItem('${item.id}', 'unitPrice', this.value)"
                    min="0"
                    step="0.01"
                    required
                >
            </td>
            <td style="font-weight: 600; text-align: right; padding-right: 12px;" id="${item.id}-total">
                ${formatCurrency(item.total)}<br>
                <span style="font-size: 11px; color: #6B7280; font-weight: 400;">XAF</span>
            </td>
            <td style="text-align: center;">
                <input 
                    type="text" 
                    id="${item.id}-supplier"
                    placeholder="SUP-XXX"
                    value="${item.suggestedSupplierId || ''}"
                    onchange="updateItem('${item.id}', 'suggestedSupplierId', this.value)"
                    style="width: 70px; font-size: 11px; padding: 4px;"
                >
            </td>
            <td style="text-align: center;">
                <button type="button" class="btn-remove-item" onclick="removeItem('${item.id}')" title="Supprimer">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
    `}).join('');
}

function calculateTotal() {
    const total = items.reduce((sum, item) => sum + item.total, 0);
    document.getElementById('total-amount').textContent = formatCurrency(total);
    
    // Update workflow display based on amount
    updateWorkflowDisplay();
}

// ================================================
// GESTION DES DOCUMENTS
// ================================================

// Configuration des documents
function loadDocumentConfigs() {
    // Mock configuration - à remplacer par appel API
    documentConfigs = [
        {
            code: 'DEVIS_FOURNISSEUR',
            name: 'Devis Fournisseur',
            required: true,
            conditional: false,
            multipleAllowed: false,
            maxFiles: 1,
            maxFileSizeBytes: 5242880, // 5 MB
            allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
            allowedExtensions: ['PDF', 'JPG', 'PNG'],
            displayOrder: 1
        },
        {
            code: 'JUSTIFICATIF_URGENCE',
            name: "Justificatif d'urgence",
            required: 'conditional', // Si priorité URGENTE
            conditional: true,
            conditionField: 'priority',
            conditionValue: 'URGENTE',
            multipleAllowed: false,
            maxFiles: 1,
            maxFileSizeBytes: 2097152, // 2 MB
            allowedMimeTypes: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
            allowedExtensions: ['PDF', 'DOCX'],
            displayOrder: 2
        },
        {
            code: 'SPECIFICATIONS_TECHNIQUES',
            name: 'Spécifications techniques',
            required: false,
            conditional: false,
            multipleAllowed: true,
            maxFiles: 3,
            maxFileSizeBytes: 10485760, // 10 MB
            allowedMimeTypes: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
            allowedExtensions: ['PDF', 'DOCX', 'XLSX'],
            displayOrder: 3
        },
        {
            code: 'COMPARATIF_PRIX',
            name: 'Comparatif prix',
            required: false,
            conditional: false,
            multipleAllowed: false,
            maxFiles: 1,
            maxFileSizeBytes: 5242880, // 5 MB
            allowedMimeTypes: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/pdf'],
            allowedExtensions: ['XLSX', 'PDF'],
            displayOrder: 4
        },
        {
            code: 'PHOTOS_ECHANTILLONS',
            name: 'Photos échantillons',
            required: false,
            conditional: false,
            multipleAllowed: true,
            maxFiles: 10,
            maxFileSizeBytes: 2097152, // 2 MB
            allowedMimeTypes: ['image/jpeg', 'image/png'],
            allowedExtensions: ['JPG', 'PNG'],
            displayOrder: 5
        }
    ];
    
    renderDocumentSections();
}

function renderDocumentSections() {
    const priority = document.querySelector('input[name="priority"]:checked')?.value || 'NORMALE';
    
    const requiredDocs = documentConfigs.filter(doc => {
        if (doc.conditional && doc.conditionField === 'priority') {
            return doc.conditionValue === priority;
        }
        return doc.required === true;
    });
    
    const optionalDocs = documentConfigs.filter(doc => !doc.required && !doc.conditional);
    
    // Render required documents
    const requiredContainer = document.getElementById('required-docs-container');
    requiredContainer.innerHTML = requiredDocs.map(doc => renderDocumentBlock(doc, true)).join('');
    
    // Render optional documents
    const optionalContainer = document.getElementById('optional-docs-container');
    optionalContainer.innerHTML = optionalDocs.map(doc => renderDocumentBlock(doc, false)).join('');
    
    updateDocumentValidationStatus();
}

function renderDocumentBlock(docConfig, isRequired) {
    const files = documentsByType[docConfig.code] || [];
    const maxSizeMB = (docConfig.maxFileSizeBytes / (1024 * 1024)).toFixed(0);
    const hasFiles = files.length > 0;
    
    return `
        <div style="border: 2px solid ${isRequired ? '#F59E0B' : '#D1D5DB'}; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                ${isRequired ? '<i class="fa-solid fa-exclamation-triangle" style="color: #F59E0B;"></i>' : ''}
                <strong style="font-size: 13px; color: #1F2937;">${docConfig.name}</strong>
                ${isRequired ? '<span style="color: #EF4444; font-size: 12px;">(${docConfig.maxFiles} fichier requis)</span>' : ''}
                ${docConfig.conditional ? '<span style="color: #6B7280; font-size: 12px;"> - Si priorité ${docConfig.conditionValue}</span>' : ''}
            </div>
            
            <div style="font-size: 11px; color: #6B7280; margin-bottom: 12px;">
                Types acceptés: ${docConfig.allowedExtensions.join(', ')} | Max: ${maxSizeMB} MB ${docConfig.multipleAllowed ? '| Max ' + docConfig.maxFiles + ' fichiers' : ''}
            </div>
            
            <div style="border: 2px dashed #D1D5DB; border-radius: 6px; padding: 16px; background: #F9FAFB; text-align: center; cursor: pointer; transition: all 0.2s;"
                 onmouseover="this.style.borderColor='#263c89'; this.style.background='#F3F4F6'"
                 onmouseout="this.style.borderColor='#D1D5DB'; this.style.background='#F9FAFB'"
                 onclick="document.getElementById('file-${docConfig.code}').click()">
                <i class="fa-solid fa-paperclip" style="color: #6B7280; font-size: 20px; margin-bottom: 8px;"></i>
                <div style="font-size: 13px; color: #374151; font-weight: 500;">Parcourir... ou glisser-déposer ici</div>
                <input type="file" 
                       id="file-${docConfig.code}" 
                       style="display: none;" 
                       accept="${docConfig.allowedMimeTypes.map(m => '.' + m.split('/').pop()).join(',')}"
                       ${docConfig.multipleAllowed ? 'multiple' : ''}
                       onchange="handleDocumentUpload('${docConfig.code}', this)">
            </div>
            
            <div id="files-${docConfig.code}" style="margin-top: 12px;">
                ${files.map((file, idx) => `
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px; background: white; border-radius: 6px; margin-top: 8px; border: 1px solid #E5E7EB;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <i class="fa-solid fa-check-circle" style="color: #10B981;"></i>
                            <div>
                                <div style="font-size: 13px; font-weight: 500; color: #1F2937;">${file.name}</div>
                                <div style="font-size: 11px; color: #6B7280;">${formatFileSize(file.size)}</div>
                            </div>
                        </div>
                        <div style="display: flex; gap: 4px;">
                            <button type="button" class="btn-icon" onclick="previewFile('${docConfig.code}', ${idx})" title="Aperçu">
                                <i class="fa-solid fa-eye"></i>
                            </button>
                            <button type="button" class="btn-icon btn-icon-danger" onclick="removeDocumentFile('${docConfig.code}', ${idx})" title="Supprimer">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
                ${files.length === 0 ? `
                    <div style="padding: 8px; text-align: center; color: #EF4444; font-size: 12px; display: ${isRequired ? 'block' : 'none'};">
                        <i class="fa-solid fa-times-circle"></i> Fichier manquant - Requis
                    </div>
                ` : ''}
                ${docConfig.multipleAllowed && files.length > 0 ? `
                    <div style="font-size: 11px; color: #6B7280; margin-top: 8px; text-align: center;">
                        ${files.length}/${docConfig.maxFiles} fichier(s) utilisé(s)
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

function handleDocumentUpload(docCode, input) {
    const docConfig = documentConfigs.find(d => d.code === docCode);
    if (!docConfig) return;
    
    const files = Array.from(input.files);
    if (files.length === 0) return;
    
    if (!documentsByType[docCode]) {
        documentsByType[docCode] = [];
    }
    
    for (let file of files) {
        // Check file count limit
        if (!docConfig.multipleAllowed && documentsByType[docCode].length >= 1) {
            alert(`Vous ne pouvez ajouter qu'un seul fichier pour "${docConfig.name}"`);
            break;
        }
        
        if (documentsByType[docCode].length >= docConfig.maxFiles) {
            alert(`Limite de ${docConfig.maxFiles} fichier(s) atteinte pour "${docConfig.name}"`);
            break;
        }
        
        // Validate file size
        if (file.size > docConfig.maxFileSizeBytes) {
            alert(`Le fichier "${file.name}" dépasse ${(docConfig.maxFileSizeBytes / (1024*1024)).toFixed(0)} MB`);
            continue;
        }
        
        // Validate file type
        const isValidType = docConfig.allowedMimeTypes.some(mime => {
            return file.type === mime || file.name.toLowerCase().endsWith('.' + mime.split('/').pop());
        });
        
        if (!isValidType) {
            alert(`Type de fichier non autorisé pour "${file.name}". Types acceptés: ${docConfig.allowedExtensions.join(', ')}`);
            continue;
        }
        
        documentsByType[docCode].push({
            name: file.name,
            size: file.size,
            type: file.type,
            file: file
        });
    }
    
    // Reset input
    input.value = '';
    
    renderDocumentSections();
}

function removeDocumentFile(docCode, fileIndex) {
    if (confirm('Supprimer ce fichier ?')) {
        documentsByType[docCode].splice(fileIndex, 1);
        renderDocumentSections();
    }
}

function previewFile(docCode, fileIndex) {
    const file = documentsByType[docCode][fileIndex];
    if (!file) return;
    
    // Simple preview - just show file info
    alert(`Aperçu: ${file.name}\nTaille: ${formatFileSize(file.size)}\nType: ${file.type}\n\n(Fonctionnalité de prévisualisation complète à implémenter)`);
}

function updateDocumentRequirements() {
    renderDocumentSections();
}

function updateDocumentValidationStatus() {
    const priority = document.querySelector('input[name="priority"]:checked')?.value || 'NORMALE';
    
    const requiredDocs = documentConfigs.filter(doc => {
        if (doc.conditional && doc.conditionField === 'priority') {
            return doc.conditionValue === priority && doc.required !== false;
        }
        return doc.required === true;
    });
    
    const providedCount = requiredDocs.filter(doc => {
        const files = documentsByType[doc.code] || [];
        return files.length >= doc.maxFiles;
    }).length;
    
    const totalRequired = requiredDocs.length;
    const statusElement = document.getElementById('docs-validation-status');
    const textElement = document.getElementById('docs-validation-text');
    
    if (providedCount >= totalRequired && totalRequired > 0) {
        statusElement.style.background = '#D1FAE5';
        statusElement.style.borderColor = '#10B981';
        textElement.innerHTML = `<i class="fa-solid fa-check-circle"></i> Validation documents: ${providedCount}/${totalRequired} documents obligatoires fournis ✅`;
        textElement.style.color = '#065F46';
    } else {
        statusElement.style.background = '#FFFBEB';
        statusElement.style.borderColor = '#F59E0B';
        textElement.innerHTML = `<i class="fa-solid fa-exclamation-triangle"></i> Validation documents: ${providedCount}/${totalRequired} documents obligatoires fournis ⚠️`;
        textElement.style.color = '#92400E';
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
// WORKFLOW DE VALIDATION
// ================================================

function updateWorkflowDisplay() {
    const total = items.reduce((sum, item) => sum + item.total, 0);
    const validationThreshold = 100000; // 100,000 XAF
    
    const requiredElement = document.getElementById('validation-required');
    const reasonElement = document.getElementById('validation-reason');
    const circuitElement = document.getElementById('workflow-circuit');
    
    if (total > validationThreshold) {
        requiredElement.textContent = 'OUI';
        requiredElement.style.color = '#059669';
        reasonElement.textContent = `(Montant > ${formatCurrency(validationThreshold)})`;
        circuitElement.textContent = 'Vous → Chef Service (Paul NGA) → Direction Achats';
    } else if (total > 50000) {
        requiredElement.textContent = 'OUI';
        requiredElement.style.color = '#059669';
        reasonElement.textContent = `(Montant > 50,000 XAF)`;
        circuitElement.textContent = 'Vous → Chef Service (Paul NGA)';
    } else {
        requiredElement.textContent = 'NON';
        requiredElement.style.color = '#6B7280';
        reasonElement.textContent = '(Montant < 50,000 XAF)';
        circuitElement.textContent = 'Approbation automatique';
    }
}

// ================================================
// GESTION ÉMETTEUR
// ================================================

function toggleOriginatorFields() {
    const originatorType = document.querySelector('input[name="originator-type"]:checked').value;
    const otherFields = document.getElementById('originator-other-fields');
    
    if (originatorType === 'OTHER') {
        otherFields.style.display = 'block';
    } else {
        otherFields.style.display = 'none';
    }
}

function selectOriginator() {
    // Mock user selection
    const mockUsers = [
        { id: 'USR-001', name: 'Jean KAMGA', department: 'Production' },
        { id: 'USR-002', name: 'Marie NKOA', department: 'Logistique' },
        { id: 'USR-003', name: 'Paul TCHUENTE', department: 'Commercial' }
    ];
    
    const selectedUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
    document.getElementById('originator-name').value = `${selectedUser.name} (${selectedUser.department})`;
}

// ================================================
// SECTIONS REPLIABLES
// ================================================

function toggleSection(sectionId) {
    const section = document.getElementById(`section-${sectionId}`);
    const icon = document.getElementById(`icon-${sectionId}`);
    
    if (section.style.display === 'none') {
        section.style.display = 'block';
        icon.className = 'fa-solid fa-chevron-down';
    } else {
        section.style.display = 'none';
        icon.className = 'fa-solid fa-chevron-right';
    }
}

function validateForm() {
    const errors = [];
    
    // General info
    const date = document.getElementById('date').value;
    const company = document.getElementById('company').value;
    const deliveryDate = document.getElementById('delivery-date').value;
    const department = document.getElementById('department').value;
    const priority = document.querySelector('input[name="priority"]:checked').value;
    const reason = document.getElementById('reason').value.trim();
    const deliveryLocation = document.getElementById('delivery-location').value;
    
    if (!date) errors.push('La date de demande est obligatoire');
    if (!company) errors.push('La société est obligatoire');
    if (!deliveryDate) errors.push('La date de livraison souhaitée est obligatoire');
    if (!department) errors.push('Le département est obligatoire');
    if (!deliveryLocation) errors.push('Le lieu de livraison est obligatoire');
    if (!reason) errors.push('La justification du besoin est obligatoire');
    
    // Check originator
    const originatorType = document.querySelector('input[name="originator-type"]:checked').value;
    if (originatorType === 'OTHER') {
        const originatorName = document.getElementById('originator-name').value.trim();
        if (!originatorName) {
            errors.push('L\'émetteur réel doit être sélectionné');
        }
    }
    
    // Check delivery delay
    if (date && deliveryDate) {
        const requestDate = new Date(date);
        const deliveryDateObj = new Date(deliveryDate);
        const diffDays = Math.ceil((deliveryDateObj - requestDate) / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
            errors.push('La date de livraison ne peut pas être antérieure à la date de demande');
        }
        
        if (diffDays < 7 && priority !== 'URGENTE') {
            errors.push('Un délai de moins de 7 jours nécessite une priorité URGENTE');
        }
    }
    
    // Items validation
    if (items.length === 0) {
        errors.push('Au moins un article est obligatoire');
    }
    
    let hasValidItem = false;
    items.forEach((item, index) => {
        const isCatalogued = item.type === 'CATALOGUED';
        const hasDescription = isCatalogued ? item.article : item.description;
        
        if (!hasDescription || !item.quantity || !item.unitPrice) {
            errors.push(`Article #${index + 1}: ${isCatalogued ? 'Article' : 'Description'}, quantité et prix unitaire sont obligatoires`);
        } else if (parseFloat(item.quantity) <= 0) {
            errors.push(`Article #${index + 1}: La quantité doit être supérieure à 0`);
        } else if (parseFloat(item.unitPrice) <= 0) {
            errors.push(`Article #${index + 1}: Le prix unitaire doit être supérieur à 0`);
        } else {
            hasValidItem = true;
        }
    });
    
    if (!hasValidItem && items.length > 0) {
        errors.push('Au moins un article valide est obligatoire');
    }
    
    // Total amount check
    const total = items.reduce((sum, item) => sum + item.total, 0);
    if (total === 0) {
        errors.push('Le montant total doit être supérieur à 0');
    }
    
    // Document validation
    const requiredDocs = documentConfigs.filter(doc => {
        if (doc.conditional && doc.conditionField === 'priority') {
            return doc.conditionValue === priority && doc.required !== false;
        }
        return doc.required === true;
    });
    
    requiredDocs.forEach(doc => {
        const files = documentsByType[doc.code] || [];
        if (files.length < doc.maxFiles) {
            errors.push(`Document obligatoire manquant: ${doc.name}`);
        }
    });
    
    return errors;
}

// ================================================
// ACTIONS DU FORMULAIRE
// ================================================

function saveDraft() {
    console.log('💾 Enregistrement brouillon DA...');
    
    const formData = collectFormData();
    formData.status = 'BROUILLON';
    
    console.log('Form Data (Draft):', formData);
    
    // Simuler l'enregistrement
    setTimeout(() => {
        alert('✅ Demande d\'achat enregistrée en brouillon');
        window.location.href = './demandes-achat-list.html';
    }, 500);
}

function submitForm() {
    console.log('✅ Soumission DA pour validation...');
    
    // Validate
    const errors = validateForm();
    
    if (errors.length > 0) {
        alert('❌ Erreurs de validation:\n\n' + errors.join('\n'));
        return;
    }
    
    const formData = collectFormData();
    formData.status = 'EN_VALIDATION';
    
    console.log('Form Data (Submitted):', formData);
    
    // Simuler l'enregistrement
    setTimeout(() => {
        alert('✅ Demande d\'achat soumise pour validation !\n\nVous recevrez une notification dès la validation par votre responsable.');
        window.location.href = './demandes-achat-list.html';
    }, 500);
}

function collectFormData() {
    const priority = document.querySelector('input[name="priority"]:checked').value;
    const originatorType = document.querySelector('input[name="originator-type"]:checked').value;
    
    const data = {
        // General
        requisitionNumber: document.getElementById('da-code').value,
        requisitionDate: document.getElementById('date').value,
        companyId: document.getElementById('company').value,
        departmentId: document.getElementById('department').value,
        priority: priority,
        requestedDeliveryDate: document.getElementById('delivery-date').value,
        deliveryLocationId: document.getElementById('delivery-location').value,
        
        // Originator
        needOriginatorType: originatorType,
        needOriginatorId: originatorType === 'SELF' ? 'Herman MBOUOMBOUO' : document.getElementById('originator-name').value,
        needJustification: document.getElementById('reason').value.trim(),
        
        // Items - with proper mapping
        items: items.filter(item => {
            const isCatalogued = item.type === 'CATALOGUED';
            return (isCatalogued ? item.article : item.description) && item.quantity && item.unitPrice;
        }).map(item => ({
            lineNumber: items.indexOf(item) + 1,
            itemType: item.type,
            productId: item.type === 'CATALOGUED' ? item.articleId : null,
            productCode: item.productCode || null,
            productName: item.productName || null,
            freeTextDescription: item.type === 'FREE_TEXT' ? item.description : null,
            quantity: parseFloat(item.quantity),
            unit: item.unit,
            estimatedUnitPrice: parseFloat(item.unitPrice),
            estimatedTotalPrice: item.total,
            suggestedSupplierId: item.suggestedSupplierId || null,
            notes: item.notes || null
        })),
        
        // Total
        totalEstimatedAmount: items.reduce((sum, item) => sum + item.total, 0),
        
        // Documents - properly structured
        documents: Object.keys(documentsByType).flatMap(docCode => {
            return documentsByType[docCode].map(file => ({
                mediaTypeCode: docCode,
                fileName: file.name,
                fileSize: file.size,
                mimeType: file.type,
                file: file.file
            }));
        }),
        
        // Metadata
        createdAt: new Date().toISOString(),
        createdBy: 'Herman MBOUOMBOUO',
        requesterId: 'Herman MBOUOMBOUO'
    };
    
    return data;
}

function cancelForm() {
    if (confirm('Abandonner la création de la demande d\'achat ? Les données non enregistrées seront perdues.')) {
        window.location.href = './demandes-achat-list.html';
    }
}

// ================================================
// HELPERS
// ================================================

function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount) + ' XAF';
}

// ================================================
// KEYBOARD SHORTCUTS
// ================================================

document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        submitForm();
    }
    
    // Ctrl/Cmd + S to save draft
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveDraft();
    }
});


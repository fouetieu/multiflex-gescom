// ================================================
// DEMANDE-ACHAT-CREATE.JS
// Gestion du formulaire de création de DA
// ================================================

// État global
let items = [];
let itemIdCounter = 1;
let uploadedFiles = [];

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
    
    // Add first item by default
    addItem();
    
    // Update priority indicator
    updatePriorityIndicator();
    
    // Setup event listeners
    document.getElementById('date').addEventListener('change', checkDeliveryDelay);
    document.getElementById('delivery-date').addEventListener('change', checkDeliveryDelay);
    
    checkDeliveryDelay();
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
        article: '',
        articleId: '',
        description: '',
        quantity: '',
        unit: 'unité',
        unitPrice: '',
        total: 0
    };
    
    items.push(item);
    renderItems();
    
    // Focus on article field of new item
    setTimeout(() => {
        document.querySelector(`#${itemId}-article`)?.focus();
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
    
    tbody.innerHTML = items.map((item, index) => `
        <tr>
            <td style="text-align: center; font-weight: 600; color: #6B7280;">${index + 1}</td>
            <td>
                <div style="position: relative; display: flex; align-items: center;">
                    <i class="fa-solid fa-search" style="position: absolute; left: 8px; color: #9CA3AF; pointer-events: none;"></i>
                    <input 
                        type="text" 
                        id="${item.id}-article"
                        placeholder="Rechercher..."
                        value="${item.article}"
                        onchange="updateItem('${item.id}', 'article', this.value); openArticleSearch('${item.id}')"
                        onclick="openArticleSearch('${item.id}')"
                        style="padding-left: 32px;"
                        required
                    >
                </div>
            </td>
            <td>
                <input 
                    type="text" 
                    id="${item.id}-description"
                    placeholder="Description..."
                    value="${item.description}"
                    onchange="updateItem('${item.id}', 'description', this.value)"
                    required
                >
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
                ${formatCurrency(item.total)}
            </td>
            <td style="text-align: center;">
                <button type="button" class="btn-remove-item" onclick="removeItem('${item.id}')" title="Supprimer">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function calculateTotal() {
    const total = items.reduce((sum, item) => sum + item.total, 0);
    document.getElementById('total-amount').textContent = formatCurrency(total);
}

// ================================================
// GESTION DES FICHIERS
// ================================================

function handleFileUpload(input) {
    const files = input.files;
    
    if (files.length === 0) return;
    
    // Add new files
    for (let file of files) {
        // Validate file size (5 MB max)
        if (file.size > 5 * 1024 * 1024) {
            alert(`Le fichier "${file.name}" dépasse 5 MB`);
            continue;
        }
        
        uploadedFiles.push({
            name: file.name,
            size: file.size,
            type: file.type,
            file: file
        });
    }
    
    renderUploadedFiles();
    
    // Reset input
    input.value = '';
}

function renderUploadedFiles() {
    const container = document.getElementById('uploaded-files');
    
    if (uploadedFiles.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = uploadedFiles.map((file, index) => `
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
            <button type="button" class="btn-icon btn-icon-danger" onclick="removeFile(${index})" title="Supprimer">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function removeFile(index) {
    if (confirm('Supprimer ce fichier ?')) {
        uploadedFiles.splice(index, 1);
        renderUploadedFiles();
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
    
    // General info
    const date = document.getElementById('date').value;
    const deliveryDate = document.getElementById('delivery-date').value;
    const department = document.getElementById('department').value;
    const priority = document.querySelector('input[name="priority"]:checked').value;
    const reason = document.getElementById('reason').value.trim();
    
    if (!date) errors.push('La date de demande est obligatoire');
    if (!deliveryDate) errors.push('La date de livraison souhaitée est obligatoire');
    if (!department) errors.push('Le département est obligatoire');
    if (!reason) errors.push('Le motif de la demande est obligatoire');
    
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
        if (!item.description || !item.quantity || !item.unitPrice) {
            errors.push(`Article #${index + 1}: Description, quantité et prix unitaire sont obligatoires`);
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
    
    const data = {
        // General
        date: document.getElementById('date').value,
        deliveryDate: document.getElementById('delivery-date').value,
        requester: document.getElementById('requester').value,
        department: document.getElementById('department').value,
        budget: document.getElementById('budget').value,
        priority: priority,
        reason: document.getElementById('reason').value.trim(),
        
        // Items
        items: items.filter(item => item.description && item.quantity && item.unitPrice),
        
        // Total
        estimatedAmount: items.reduce((sum, item) => sum + item.total, 0),
        
        // Attachments
        attachments: uploadedFiles,
        
        // Metadata
        createdAt: new Date().toISOString(),
        createdBy: document.getElementById('requester').value
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


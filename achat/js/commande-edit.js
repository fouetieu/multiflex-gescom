// ================================================
// COMMANDE-EDIT.JS
// Gestion de la modification de bon de commande
// ================================================

let currentBCF = {
    code: 'BCF-2024-0145',
    date: '2024-01-15',
    status: 'BROUILLON',
    supplier: {
        id: 'FOU-2024-001',
        name: 'ABC SARL'
    },
    articles: [
        {
            id: 'art-1',
            article: 'MP-001',
            designation: 'Matière première 1',
            quantity: 100,
            unit: 'kg',
            unitPrice: 5000,
            total: 595000
        },
        {
            id: 'art-2',
            article: 'MP-002',
            designation: 'Matière première 2',
            quantity: 50,
            unit: 'L',
            unitPrice: 8000,
            total: 476000
        }
    ],
    history: [
        {
            dateTime: '2024-01-15 10:30',
            user: 'J. Dupont',
            action: 'Création initiale'
        },
        {
            dateTime: '2024-01-15 14:15',
            user: 'M. Martin',
            action: 'Ajout ligne article MP-001'
        },
        {
            dateTime: '2024-01-15 16:45',
            user: 'M. Martin',
            action: 'Modification quantité: 100→150'
        }
    ],
    originalData: null // Store original data for cancel functionality
};

let articleCounter = 1;
let modificationsMade = false;

// ================================================
// INITIALISATION
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation modification BCF...');
    
    // Store original data
    currentBCF.originalData = JSON.parse(JSON.stringify(currentBCF));
    
    // Set status banner
    updateStatusBanner();
    
    // Render articles
    renderArticles();
    
    // Render history
    renderHistory();
    
    // Update modification info
    updateModificationInfo();
    
    // Track changes
    document.getElementById('bcf-form').addEventListener('change', function() {
        modificationsMade = true;
        updateModificationInfo();
    });
});

// ================================================
// TAB NAVIGATION
// ================================================

function switchTab(tabIndex) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active state from buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`tab-${tabIndex}`).classList.add('active');
    event.target.closest('.tab-button').classList.add('active');
}

// ================================================
// STATUS & INFO
// ================================================

function updateStatusBanner() {
    const banner = document.getElementById('status-banner');
    const statusText = document.getElementById('status-text');
    
    const statuses = {
        'BROUILLON': { class: 'status-draft', text: 'BROUILLON', icon: '✏️', message: 'Modification autorisée' },
        'ENVOYEE': { class: 'status-sent', text: 'ENVOYÉE', icon: '📤', message: 'Modification non autorisée' },
        'VALIDEE': { class: 'status-validated', text: 'VALIDÉE', icon: '✓', message: 'Modification non autorisée' }
    };
    
    const status = statuses[currentBCF.status];
    
    banner.className = `status-banner ${status.class.split('-')[1]}`;
    statusText.textContent = status.text;
    banner.innerHTML = `
        <i class="fa-solid fa-info-circle"></i>
        <div>
            <strong>Statut: ${status.icon} ${status.text}</strong> - ${status.message}
        </div>
    `;
}

function updateModificationInfo() {
    const info = document.getElementById('modification-info');
    const now = new Date();
    const timestamp = now.toLocaleString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    if (modificationsMade) {
        info.innerHTML = `
            <div style="color: #F59E0B; font-weight: 600;">
                <i class="fa-solid fa-circle-exclamation"></i> Modifications non enregistrées
            </div>
            <div style="font-size: 11px; color: #9CA3AF; margin-top: 4px;">
                Dernier changement: ${timestamp}
            </div>
        `;
    } else {
        info.innerHTML = `
            <div style="color: #065F46;">
                <i class="fa-solid fa-check-circle"></i> Aucune modification en cours
            </div>
        `;
    }
}

// ================================================
// ARTICLES MANAGEMENT
// ================================================

function renderArticles() {
    const tbody = document.getElementById('articles-tbody');
    
    tbody.innerHTML = currentBCF.articles.map((article, idx) => {
        const quantity = parseFloat(article.quantity) || 0;
        const unitPrice = parseFloat(article.unitPrice) || 0;
        const ht = quantity * unitPrice;
        const tva = ht * 0.1925;
        const ttc = ht + tva;
        
        return `
            <tr>
                <td style="text-align: center; font-weight: 600; color: #6B7280;">${idx + 1}</td>
                <td>
                    <input 
                        type="text" 
                        value="${article.article}"
                        onchange="updateArticle('${article.id}', 'article', this.value)"
                    >
                </td>
                <td>
                    <input 
                        type="text" 
                        value="${article.designation}"
                        onchange="updateArticle('${article.id}', 'designation', this.value)"
                    >
                </td>
                <td>
                    <input 
                        type="number" 
                        value="${article.quantity}"
                        onchange="updateArticle('${article.id}', 'quantity', this.value); calculateTotals()"
                        min="0"
                        step="0.01"
                    >
                </td>
                <td>
                    <select onchange="updateArticle('${article.id}', 'unit', this.value)">
                        <option value="kg" ${article.unit === 'kg' ? 'selected' : ''}>kg</option>
                        <option value="L" ${article.unit === 'L' ? 'selected' : ''}>L</option>
                        <option value="m" ${article.unit === 'm' ? 'selected' : ''}>m</option>
                        <option value="sac" ${article.unit === 'sac' ? 'selected' : ''}>sac</option>
                    </select>
                </td>
                <td>
                    <input 
                        type="number" 
                        value="${article.unitPrice}"
                        onchange="updateArticle('${article.id}', 'unitPrice', this.value); calculateTotals()"
                        min="0"
                        step="0.01"
                    >
                </td>
                <td style="text-align: right; font-weight: 600; color: #263c89;">
                    ${formatCurrency(ttc)}
                </td>
                <td style="text-align: center;">
                    <button type="button" class="btn-remove-line" onclick="removeArticle('${article.id}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
    
    calculateTotals();
}

function updateArticle(articleId, field, value) {
    const article = currentBCF.articles.find(a => a.id === articleId);
    if (article) {
        article[field] = value;
        modificationsMade = true;
        updateModificationInfo();
        
        // Log modification to history
        if (field === 'quantity') {
            const oldValue = article.quantity;
            addHistoryEntry(`Modification quantité: ${oldValue}→${value} pour ${article.article}`);
        }
    }
}

function removeArticle(articleId) {
    if (currentBCF.articles.length <= 1) {
        alert('Au moins une ligne d\'article est obligatoire');
        return;
    }
    
    const article = currentBCF.articles.find(a => a.id === articleId);
    addHistoryEntry(`Suppression ligne article: ${article.article}`);
    
    currentBCF.articles = currentBCF.articles.filter(a => a.id !== articleId);
    modificationsMade = true;
    updateModificationInfo();
    renderArticles();
}

function addArticleLine() {
    const newArticle = {
        id: `art-${Date.now()}`,
        article: '',
        designation: '',
        quantity: '',
        unit: 'kg',
        unitPrice: '',
        total: 0
    };
    
    currentBCF.articles.push(newArticle);
    modificationsMade = true;
    updateModificationInfo();
    
    addHistoryEntry('Ajout nouvelle ligne article');
    renderArticles();
    
    // Focus on article field
    setTimeout(() => {
        const inputs = document.querySelectorAll('#articles-tbody input[type="text"]');
        inputs[inputs.length - 1]?.focus();
    }, 100);
}

function calculateTotals() {
    let totalHT = 0;
    let totalTVA = 0;
    let totalTTC = 0;
    
    currentBCF.articles.forEach(article => {
        const quantity = parseFloat(article.quantity) || 0;
        const unitPrice = parseFloat(article.unitPrice) || 0;
        const ht = quantity * unitPrice;
        const tva = ht * 0.1925;
        const ttc = ht + tva;
        
        totalHT += ht;
        totalTVA += tva;
        totalTTC += ttc;
    });
    
    document.getElementById('total-ht-box').textContent = formatCurrency(totalHT);
    document.getElementById('total-tva-box').textContent = formatCurrency(totalTVA);
    document.getElementById('total-ttc-box').textContent = formatCurrency(totalTTC);
}

// ================================================
// HISTORIQUE
// ================================================

function renderHistory() {
    const tbody = document.getElementById('history-tbody');
    
    tbody.innerHTML = currentBCF.history.map(entry => `
        <tr>
            <td class="history-time">${entry.dateTime}</td>
            <td class="history-user">${entry.user}</td>
            <td class="history-action">
                <i class="fa-solid fa-circle-info" style="margin-right: 6px; color: #263c89;"></i>
                ${entry.action}
            </td>
        </tr>
    `).join('');
}

function addHistoryEntry(action) {
    const now = new Date();
    const dateTime = now.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).replace(',', '');
    
    currentBCF.history.unshift({
        dateTime: dateTime,
        user: 'Marie AKONO', // Current user
        action: action
    });
    
    // Keep only last 10 entries
    if (currentBCF.history.length > 10) {
        currentBCF.history.pop();
    }
}

// ================================================
// FORM ACTIONS
// ================================================

function saveDraft() {
    if (!modificationsMade) {
        alert('Aucune modification à enregistrer');
        return;
    }
    
    console.log('💾 Enregistrement modifications BCF:', currentBCF);
    
    addHistoryEntry('Enregistrement brouillon');
    modificationsMade = false;
    updateModificationInfo();
    renderHistory();
    
    alert('✅ Modifications enregistrées');
}

function validateAndSend() {
    if (!modificationsMade) {
        const confirmed = confirm('Aucune modification en cours. Voulez-vous envoyer le BCF actuel ?');
        if (!confirmed) return;
    }
    
    // Validation
    if (currentBCF.articles.length === 0 || !currentBCF.articles[0].article) {
        alert('Veuillez ajouter au moins un article');
        return;
    }
    
    console.log('✅ Validation et envoi BCF:', currentBCF);
    
    addHistoryEntry('Validation et envoi au fournisseur');
    currentBCF.status = 'ENVOYEE';
    
    alert('✅ Bon de commande envoyé au fournisseur');
    window.location.href = './commandes-list.html';
}

function cancelModifications() {
    if (!modificationsMade) {
        alert('Aucune modification à annuler');
        return;
    }
    
    const confirmed = confirm('Êtes-vous sûr de vouloir annuler toutes les modifications ?');
    if (!confirmed) return;
    
    console.log('❌ Annulation des modifications');
    
    // Restore original data
    currentBCF = JSON.parse(JSON.stringify(currentBCF.originalData));
    
    modificationsMade = false;
    updateModificationInfo();
    renderArticles();
    renderHistory();
    
    alert('✅ Modifications annulées');
}

// ================================================
// HELPERS
// ================================================

function formatCurrency(amount) {
    if (!amount) return '0 XAF';
    return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount) + ' XAF';
}


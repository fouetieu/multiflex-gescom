// ================================================
// FACTURE-CREATE.JS
// Saisie facture fournisseur avec articles
// ================================================

let currentBCF = null;
let bcfArticles = [];
let uploadedFile = null;

// ================================================
// INITIALISATION
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation saisie facture...');
    
    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('invoice-date').value = today;
    
    loadBCFData();
    updateDueDate();
});

// ================================================
// CHARGEMENT DES DONNÉES
// ================================================

function loadBCFData() {
    const bcfCode = document.getElementById('bcf-select').value;
    
    // Mock BCF data
    const bcfMap = {
        'BCF-2024-1205': {
            code: 'BCF-2024-1205',
            supplier: 'ABC SARL',
            date: '2024-01-15',
            status: 'LIVRE_COMPLET',
            totalHT: 1200000
        },
        'BCF-2024-1206': {
            code: 'BCF-2024-1206',
            supplier: 'XYZ Ltd',
            date: '2024-01-14',
            status: 'LIVRE_COMPLET',
            totalHT: 800000
        },
        'BCF-2024-1207': {
            code: 'BCF-2024-1207',
            supplier: 'DEF Corp',
            date: '2024-01-13',
            status: 'LIVRE_COMPLET',
            totalHT: 950000
        }
    };
    
    currentBCF = bcfMap[bcfCode];
    document.getElementById('supplier-name').value = currentBCF.supplier;
}



// ================================================
// CALCUL DES TOTAUX
// ================================================

function calculateTotals() {
    const amountHT = parseFloat(document.getElementById('amount-ht').value) || 0;
    const tva = amountHT * 0.1925;
    const totalTTC = amountHT + tva;
    
    document.getElementById('amount-tva').value = Math.round(tva);
    document.getElementById('amount-ttc').textContent = formatCurrency(totalTTC);
}



// ================================================
// GESTION FICHIER
// ================================================

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
        alert('Seuls les fichiers PDF sont acceptés');
        event.target.value = '';
        return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
        alert('Le fichier est trop volumineux (max 10 Mo)');
        event.target.value = '';
        return;
    }
    
    uploadedFile = {
        name: file.name,
        size: file.size
    };
    
    document.getElementById('file-display').textContent = file.name;
    event.target.value = '';
}

// ================================================
// VALIDATION & SOUMISSION
// ================================================

function validateForm() {
    if (!document.getElementById('bcf-select').value) {
        alert('Veuillez sélectionner un BCF');
        return false;
    }
    
    if (!document.getElementById('invoice-number').value.trim()) {
        alert('Veuillez saisir le numéro de facture');
        return false;
    }
    
    if (!document.getElementById('invoice-date').value) {
        alert('Veuillez saisir la date de facture');
        return false;
    }
    
    if (!document.getElementById('due-date').value) {
        alert('Veuillez saisir la date d\'échéance');
        return false;
    }
    
    if (!document.getElementById('amount-ht').value) {
        alert('Veuillez saisir le montant HT');
        return false;
    }
    
    if (!uploadedFile) {
        alert('Veuillez joindre la facture PDF');
        return false;
    }
    
    return true;
}

function saveInvoice() {
    if (!validateForm()) return;
    
    const invoiceData = collectFormData();
    console.log('💾 Enregistrement facture:', invoiceData);
    
    alert('✅ Facture enregistrée');
    window.location.href = './factures-list.html';
}

function launch3WayMatching() {
    if (!validateForm()) return;
    
    console.log('🔄 Lancement rapprochement 3-way');
    
    const invoiceData = collectFormData();
    alert(`✅ Facture enregistrée\n\nLancement du rapprochement 3-way (BCF / Réception / Facture)...`);
    
    window.location.href = `./rapprochement-3way.html?bcf=${currentBCF.code}&invoice=${document.getElementById('invoice-number').value}`;
}

function collectFormData() {
    const amountHT = parseFloat(document.getElementById('amount-ht').value) || 0;
    const tva = amountHT * 0.1925;
    const totalTTC = amountHT + tva;
    
    return {
        bcf: document.getElementById('bcf-select').value,
        supplier: currentBCF.supplier,
        invoiceNumber: document.getElementById('invoice-number').value,
        invoiceDate: document.getElementById('invoice-date').value,
        dueDate: document.getElementById('due-date').value,
        amountHT: amountHT,
        tva: tva,
        totalTTC: totalTTC,
        vatDeductible: document.getElementById('vat-deductible').checked,
        file: uploadedFile,
        createdAt: new Date().toISOString()
    };
}

function cancelForm() {
    if (confirm('Abandonner la saisie de la facture ?')) {
        window.location.href = './factures-list.html';
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

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' o';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' Ko';
    return (bytes / (1024 * 1024)).toFixed(1) + ' Mo';
}

// Add event listener for invoice date change
document.addEventListener('DOMContentLoaded', function() {
    const invoiceDateEl = document.getElementById('invoice-date');
    if (invoiceDateEl) {
        invoiceDateEl.addEventListener('change', updateDueDate);
    }
});

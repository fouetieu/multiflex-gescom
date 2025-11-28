// ================================================
// AVOIR-FOURNISSEUR-CREATE.JS
// Gestion de l'écran de création d'Avoir Fournisseur
// ================================================

let currentTab = 0;
const TOTAL_TABS = 5;

let avoirData = {
    // Onglet 1: Informations générales
    internalNumber: 'AVF-2024-AUTO',
    status: 'EN_SAISIE',
    supplierAvoirNumber: '',
    avoirDate: '',
    receptionDate: '',
    supplierId: 'FOU-001',
    supplierName: 'ChemTech SARL',
    regularisationType: 'RETOUR_MARCHANDISE',
    description: '',
    applicationMode: 'deduction', // deduction, report, refund

    // Onglet 2: Lignes de l'avoir
    lines: [
        {
            id: 1,
            article: 'MP-PAINT-01',
            description: 'Peinture blanche - Lot B45 défect.',
            qtyInvoiced: 1000,
            qtyAvoir: -50,
            unit: 'L',
            unitPrice: 1450,
            totalHT: -72500,
            invoiceRef: 'FFS-2024-0156 - Ligne 1',
            justification: 'Non-conformité qualité - Viscosité hors normes'
        },
        {
            id: 2,
            article: 'TRANSPORT',
            description: 'Frais transport - À déduire',
            qtyInvoiced: 1,
            qtyAvoir: -1,
            unit: '',
            unitPrice: 2500,
            totalHT: -2500,
            invoiceRef: 'FFS-2024-0156 - Ligne frais',
            justification: 'Frais de transport sur marchandise retournée'
        }
    ],
    totalHT: -75000,
    totalTVA: -14438,
    totalTTC: -89438,

    // Onglet 3: Documents liés
    linkedInvoices: ['FFS-2024-0156'],
    linkedBCF: 'BCF-2024-0089',
    linkedBR: 'BR-2024-0156',
    linkedLitige: 'LIT-2024-0089',

    // Onglet 4: Retour marchandise
    returnStatus: 'yes',
    returnNumber: 'RET-2024-0023',
    returnDate: '',
    returnTime: '14:30',
    transportMode: 'supplier', // supplier, our, direct
    transporterName: 'CAMRAIL Express',
    waybillNumber: 'LV-2024-456789',
    driverName: 'Jean KAMGA',
    driverContact: '677 999 888',
    goodsState: 'defective', // new, defective, damaged, expired
    destination: 'destroy', // restock, destroy, return, pending
    returnReceiver: 'EMP-001',
    storageLocation: 'Zone retours - Entrepôt principal',
    returnObservations: '',

    // Onglet 5: Pièces jointes
    attachedFiles: {
        avoirOriginal: null,
        accord: null,
        pvRetour: null,
        photosDefauts: [],
        labReport: null,
        others: []
    }
};

// Mock data
let mockSuppliers = [
    {
        id: 'FOU-001',
        code: 'FOU-2024-00023',
        name: 'ChemTech SARL',
        niu: 'P087201234567W',
        contact: 'M. Jean FOTSO - 677 123 456',
        email: 'compta@chemtech.cm',
        balance: 4865000,
        openInvoices: 3
    },
    {
        id: 'FOU-002',
        code: 'FOU-2024-00024',
        name: 'IOLA DISTRIBUTION',
        niu: 'P087201234568X',
        contact: 'Mme Marie EKANI - 699 987 654',
        email: 'comptabilite@iola.cm',
        balance: 2450000,
        openInvoices: 2
    }
];

// ================================================
// INITIALISATION
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation Avoir Fournisseur...');
    
    // Set today's date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('avoir-date').value = today;
    document.getElementById('reception-date').value = today;
    document.getElementById('return-date').value = today;
    
    avoirData.avoirDate = today;
    avoirData.receptionDate = today;
    avoirData.returnDate = today;
    
    // Initialize lines table
    renderLinesTable();
    
    // Initialize navigation
    updateNavigationButtons();
});

// ================================================
// TAB NAVIGATION
// ================================================

function switchTab(tabIndex) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`tab-${tabIndex}`).classList.add('active');
    document.querySelectorAll('.tab-button')[tabIndex].classList.add('active');
    
    currentTab = tabIndex;
    updateNavigationButtons();
}

function nextTab() {
    if (currentTab < TOTAL_TABS - 1) {
        switchTab(currentTab + 1);
    }
}

function previousTab() {
    if (currentTab > 0) {
        switchTab(currentTab - 1);
    }
}

function updateNavigationButtons() {
    // Scroll to top when changing tabs
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ================================================
// ONGLET 1: INFORMATIONS GÉNÉRALES
// ================================================

function selectSupplier() {
    const select = document.getElementById('supplier-select');
    const supplierId = select.value;
    const supplier = mockSuppliers.find(s => s.id === supplierId);
    
    if (supplier) {
        avoirData.supplierId = supplier.id;
        avoirData.supplierName = supplier.name;
        
        // Update supplier info display
        document.getElementById('supplier-info').innerHTML = `
            <div style="margin-bottom: 8px;"><strong style="color: #1F2937;">Raison sociale:</strong> ${supplier.name}</div>
            <div style="margin-bottom: 8px;"><strong style="color: #1F2937;">NIU:</strong> ${supplier.niu}</div>
            <div style="margin-bottom: 8px;"><strong style="color: #1F2937;">Contact principal:</strong> ${supplier.contact}</div>
            <div style="margin-bottom: 12px;"><strong style="color: #1F2937;">Email:</strong> ${supplier.email}</div>
            <div style="padding-top: 12px; border-top: 1px solid #E5E7EB;">
                <strong style="color: #1F2937;">Solde compte:</strong> 
                <span style="color: #DC2626; font-weight: 700;">${formatCurrency(supplier.balance)}</span> 
                <span>(${supplier.openInvoices} factures en cours)</span>
            </div>
        `;
    }
}

function setApplicationMode(mode) {
    avoirData.applicationMode = mode;
    
    // Update UI - toggle radio pills
    document.querySelectorAll('label.radio-pill').forEach(label => {
        const radio = label.querySelector('input[name="application-mode"]');
        if (radio && radio.value === mode) {
            label.classList.add('active');
            radio.checked = true;
        } else if (radio) {
            label.classList.remove('active');
            radio.checked = false;
        }
    });
}

// ================================================
// ONGLET 2: LIGNES DE L'AVOIR
// ================================================

function renderLinesTable() {
    const tbody = document.getElementById('lines-tbody');
    
    if (avoirData.lines.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; color: #9CA3AF; padding: 32px;">
                    Aucune ligne. Utilisez "+ Nouvelle ligne" ou "Importer depuis facture"
                </td>
            </tr>
        `;
    } else {
        tbody.innerHTML = avoirData.lines.map((line, idx) => `
            <tr>
                <td style="text-align: center; font-weight: 600;">${idx + 1}</td>
                <td>
                    <input type="text" class="article-input" value="${line.article}" onchange="updateLineField(${line.id}, 'article', this.value)">
                </td>
                <td>
                    <div style="font-weight: 600; margin-bottom: 4px;">${line.description}</div>
                    <div style="font-size: 11px; color: #6B7280; margin-bottom: 8px;">
                        Référence facture: ${line.invoiceRef}
                    </div>
                    <div style="font-size: 11px; color: #6B7280;">
                        Justification: ${line.justification}
                    </div>
                    <div style="margin-top: 8px; display: flex; gap: 8px;">
                        <button type="button" class="btn btn-secondary" style="font-size: 10px; padding: 4px 8px;" onclick="editLine(${line.id})">
                            <i class="fa-solid fa-pen"></i> Modifier
                        </button>
                        <button type="button" class="btn btn-secondary" style="font-size: 10px; padding: 4px 8px;" onclick="duplicateLine(${line.id})">
                            <i class="fa-solid fa-copy"></i> Dupliquer
                        </button>
                    </div>
                </td>
                <td style="text-align: center;">
                    ${line.qtyInvoiced} ${line.unit}
                </td>
                <td style="text-align: center;">
                    <input type="number" class="article-input" value="${line.qtyAvoir}" onchange="updateLineField(${line.id}, 'qtyAvoir', this.value)" style="width: 80px; color: #DC2626; font-weight: 700;">
                    ${line.unit}
                    ${line.qtyAvoir < 0 ? '<div style="font-size: 10px; color: #DC2626;">🔴 Retour</div>' : ''}
                </td>
                <td style="text-align: right;">${formatCurrency(line.unitPrice)}</td>
                <td style="text-align: right; font-weight: 700; color: #DC2626;">${formatCurrency(line.totalHT)}</td>
                <td style="text-align: center;">
                    <button type="button" class="btn-remove-line" onclick="removeLine(${line.id})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    calculateTotals();
}

function addLine() {
    const newLine = {
        id: Date.now(),
        article: '',
        description: '',
        qtyInvoiced: 0,
        qtyAvoir: 0,
        unit: '',
        unitPrice: 0,
        totalHT: 0,
        invoiceRef: '',
        justification: ''
    };
    
    avoirData.lines.push(newLine);
    renderLinesTable();
}

function removeLine(lineId) {
    if (confirm('Supprimer cette ligne ?')) {
        avoirData.lines = avoirData.lines.filter(l => l.id !== lineId);
        renderLinesTable();
    }
}

function updateLineField(lineId, field, value) {
    const line = avoirData.lines.find(l => l.id === lineId);
    if (line) {
        line[field] = value;
        
        // Recalculate total for this line
        if (field === 'qtyAvoir' || field === 'unitPrice') {
            line.totalHT = line.qtyAvoir * line.unitPrice;
        }
        
        renderLinesTable();
    }
}

function editLine(lineId) {
    alert('Fonctionnalité "Modifier ligne" non implémentée (ouvrira un modal détaillé).');
}

function duplicateLine(lineId) {
    const line = avoirData.lines.find(l => l.id === lineId);
    if (line) {
        const newLine = { ...line, id: Date.now() };
        avoirData.lines.push(newLine);
        renderLinesTable();
    }
}

function importFromInvoice() {
    alert('Fonctionnalité "Importer depuis facture" non implémentée (ouvrira un modal de sélection).');
}

function calculateTotals() {
    let totalHT = 0;
    
    avoirData.lines.forEach(line => {
        totalHT += line.totalHT;
    });
    
    const totalTVA = totalHT * 0.1925; // 19.25%
    const totalTTC = totalHT + totalTVA;
    
    avoirData.totalHT = totalHT;
    avoirData.totalTVA = totalTVA;
    avoirData.totalTTC = totalTTC;
    
    // Update display
    document.getElementById('total-ht').textContent = formatCurrency(totalHT);
    document.getElementById('total-tva').textContent = formatCurrency(totalTVA);
    document.getElementById('total-ttc').textContent = formatCurrency(totalTTC);
    document.getElementById('amount-in-words').textContent = convertToWords(Math.abs(totalTTC));
}

// ================================================
// ONGLET 3: DOCUMENTS LIÉS
// ================================================

function toggleFacture(checkbox) {
    const parent = checkbox.closest('.facture-checkbox');
    if (checkbox.checked) {
        parent.classList.add('selected');
    } else {
        parent.classList.remove('selected');
    }
}

// ================================================
// ONGLET 4: RETOUR MARCHANDISE
// ================================================

function setReturnStatus(status) {
    avoirData.returnStatus = status;
    
    // Toggle UI
    document.querySelectorAll('label.radio-pill').forEach(label => {
        const radio = label.querySelector('input[name="return-status"]');
        if (radio && radio.value === status) {
            label.classList.add('active');
            radio.checked = true;
        } else if (radio) {
            label.classList.remove('active');
            radio.checked = false;
        }
    });
    
    // Show/hide return details section
    const detailsSection = document.getElementById('return-details-section');
    if (status === 'yes') {
        detailsSection.style.display = 'block';
    } else {
        detailsSection.style.display = 'none';
    }
}

function setTransportMode(mode) {
    avoirData.transportMode = mode;
    
    // Toggle UI
    document.querySelectorAll('label.radio-pill').forEach(label => {
        const radio = label.querySelector('input[name="transport-mode"]');
        if (radio && radio.value === mode) {
            label.classList.add('active');
            radio.checked = true;
        } else if (radio) {
            label.classList.remove('active');
            radio.checked = false;
        }
    });
}

function setGoodsState(state) {
    avoirData.goodsState = state;
    
    // Toggle UI
    document.querySelectorAll('label.radio-pill').forEach(label => {
        const radio = label.querySelector('input[name="goods-state"]');
        if (radio && radio.value === state) {
            label.classList.add('active');
            radio.checked = true;
        } else if (radio) {
            label.classList.remove('active');
            radio.checked = false;
        }
    });
}

function setDestination(dest) {
    avoirData.destination = dest;
    
    // Toggle UI
    document.querySelectorAll('label.radio-pill').forEach(label => {
        const radio = label.querySelector('input[name="destination"]');
        if (radio && radio.value === dest) {
            label.classList.add('active');
            radio.checked = true;
        } else if (radio) {
            label.classList.remove('active');
            radio.checked = false;
        }
    });
}

// ================================================
// ONGLET 5: PIÈCES JOINTES
// ================================================

function handleOtherFilesUpload(event) {
    const files = event.target.files;
    const container = document.getElementById('other-files-list');
    
    Array.from(files).forEach(file => {
        avoirData.attachedFiles.others.push(file);
        
        const fileItem = document.createElement('div');
        fileItem.className = 'file-list-item';
        fileItem.innerHTML = `
            <div>
                <div style="font-weight: 600; font-size: 13px;">📎 ${file.name}</div>
                <div style="font-size: 11px; color: #6B7280;">${(file.size / 1024).toFixed(1)} KB</div>
            </div>
            <button type="button" class="btn btn-secondary" style="padding: 6px 10px; font-size: 11px; background: #FEE2E2; color: #991B1B;" onclick="removeOtherFile('${file.name}')">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        container.appendChild(fileItem);
    });
}

function removeOtherFile(fileName) {
    avoirData.attachedFiles.others = avoirData.attachedFiles.others.filter(f => f.name !== fileName);
    
    // Re-render
    const container = document.getElementById('other-files-list');
    container.innerHTML = '';
    avoirData.attachedFiles.others.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-list-item';
        fileItem.innerHTML = `
            <div>
                <div style="font-weight: 600; font-size: 13px;">📎 ${file.name}</div>
                <div style="font-size: 11px; color: #6B7280;">${(file.size / 1024).toFixed(1)} KB</div>
            </div>
            <button type="button" class="btn btn-secondary" style="padding: 6px 10px; font-size: 11px; background: #FEE2E2; color: #991B1B;" onclick="removeOtherFile('${file.name}')">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        container.appendChild(fileItem);
    });
}

// ================================================
// FORM ACTIONS
// ================================================

function validateAvoir() {
    if (!validateForm()) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return;
    }
    
    if (confirm('Valider cet avoir fournisseur ?')) {
        console.log('✅ Validation avoir:', avoirData);
        alert('✅ Avoir fournisseur validé avec succès !');
        window.location.href = './factures-list.html';
    }
}

function saveDraft() {
    console.log('💾 Enregistrement brouillon avoir:', avoirData);
    alert('✅ Avoir enregistré en brouillon.');
}

function cancelForm() {
    if (confirm('Annuler la création de l\'avoir ?')) {
        window.location.href = './factures-list.html';
    }
}

function cancelAvoir() {
    if (confirm('Voulez-vous annuler cet avoir ?')) {
        console.log('❌ Annulation avoir');
        window.location.href = './factures-list.html';
    }
}

function validateForm() {
    // Check required fields
    if (!avoirData.supplierAvoirNumber || avoirData.supplierAvoirNumber === '') {
        alert('Le N° Avoir Fournisseur est obligatoire.');
        return false;
    }
    
    if (!avoirData.avoirDate || avoirData.avoirDate === '') {
        alert('La date d\'avoir est obligatoire.');
        return false;
    }
    
    if (!avoirData.regularisationType || avoirData.regularisationType === '') {
        alert('Le type de régularisation est obligatoire.');
        return false;
    }
    
    if (!avoirData.description || avoirData.description === '') {
        alert('La description détaillée est obligatoire.');
        return false;
    }
    
    if (avoirData.lines.length === 0) {
        alert('Veuillez ajouter au moins une ligne d\'avoir.');
        return false;
    }
    
    return true;
}

// ================================================
// HELPERS
// ================================================

function formatCurrency(amount) {
    if (typeof amount !== 'number') return '0 XAF';
    return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount) + ' XAF';
}

function convertToWords(num) {
    // Simplified - in production use a proper library
    if (num === 0) return 'Zéro francs CFA';
    
    const absNum = Math.abs(num);
    const prefix = num < 0 ? 'Moins ' : '';
    
    // Placeholder for French number-to-words conversion
    return `${prefix}${absNum.toLocaleString('fr-FR')} francs CFA (conversion à implémenter)`;
}

// Add missing CSS for alert-success
const style = document.createElement('style');
style.textContent = `
    .alert-success {
        background: #D1FAE5;
        border: 1px solid #6EE7B7;
        border-radius: 6px;
        padding: 12px;
        font-size: 12px;
        color: #065F46;
        display: flex;
        gap: 8px;
        align-items: center;
    }
`;
document.head.appendChild(style);


// ================================================
// RAPPROCHEMENT-3WAY.JS
// Rapprochement BCF / Réception / Facture
// ================================================

let bcfData = null;
let receptionData = null;
let invoiceData = null;
let comparisonItems = [];

// ================================================
// INITIALISATION
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation rapprochement 3-way...');
    loadMatchingData();
});

// ================================================
// CHARGEMENT DES DONNÉES
// ================================================

function loadMatchingData() {
    // Simulate loading data from BCF, Reception, and Invoice
    bcfData = {
        code: 'BCF-2024-1205',
        date: '2024-01-05',
        supplier: 'XYZ Ltd',
        amountTTC: 1200000,
        items: [
            { id: 1, designation: 'Ciment Portland 42.5', quantity: 50, unitPrice: 6500, totalPrice: 325000 },
            { id: 2, designation: 'Fer à béton Ø12mm', quantity: 200, unitPrice: 2500, totalPrice: 500000 },
            { id: 3, designation: 'Sable de rivière', quantity: 15, unitPrice: 25000, totalPrice: 375000 }
        ]
    };
    
    receptionData = {
        code: 'BR-2024-0180',
        date: '2024-01-12',
        items: [
            { id: 1, designation: 'Ciment Portland 42.5', receivedQuantity: 50 },
            { id: 2, designation: 'Fer à béton Ø12mm', receivedQuantity: 200 },
            { id: 3, designation: 'Sable de rivière', receivedQuantity: 15 }
        ]
    };
    
    invoiceData = {
        number: 'F-2024-XYZ-189',
        date: '2024-01-12',
        dueDate: '2024-02-11',
        amountTTC: 1198500,
        items: [
            { id: 1, designation: 'Ciment Portland 42.5', quantity: 50, unitPrice: 6500 },
            { id: 2, designation: 'Fer à béton Ø12mm', quantity: 200, unitPrice: 2480 },
            { id: 3, designation: 'Sable de rivière', quantity: 15, unitPrice: 25000 }
        ]
    };
    
    populateCards();
    performComparison();
    renderComparison();
    displayResults();
}

// ================================================
// REMPLISSAGE DES CARTES
// ================================================

function populateCards() {
    // BCF Card
    document.getElementById('bcf-code').textContent = bcfData.code;
    document.getElementById('bcf-date').textContent = formatDate(bcfData.date);
    document.getElementById('bcf-supplier').textContent = bcfData.supplier;
    document.getElementById('bcf-amount').textContent = formatCurrency(bcfData.amountTTC);
    
    // Reception Card
    const receptionRate = calculateReceptionRate();
    document.getElementById('reception-code').textContent = receptionData.code;
    document.getElementById('reception-date').textContent = formatDate(receptionData.date);
    document.getElementById('reception-rate').textContent = receptionRate + '%';
    document.getElementById('reception-amount').textContent = formatCurrency(bcfData.amountTTC);
    
    // Invoice Card
    document.getElementById('invoice-number').textContent = invoiceData.number;
    document.getElementById('invoice-date').textContent = formatDate(invoiceData.date);
    document.getElementById('invoice-due').textContent = formatDate(invoiceData.dueDate);
    document.getElementById('invoice-amount').textContent = formatCurrency(invoiceData.amountTTC);
}

function calculateReceptionRate() {
    const totalOrdered = bcfData.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalReceived = receptionData.items.reduce((sum, item) => sum + item.receivedQuantity, 0);
    return totalOrdered > 0 ? Math.round((totalReceived / totalOrdered) * 100) : 0;
}

// ================================================
// COMPARAISON
// ================================================

function performComparison() {
    comparisonItems = bcfData.items.map(bcfItem => {
        const receptionItem = receptionData.items.find(r => r.id === bcfItem.id);
        const invoiceItem = invoiceData.items.find(i => i.id === bcfItem.id);
        
        const receivedQty = receptionItem ? receptionItem.receivedQuantity : 0;
        const invoiceQty = invoiceItem ? invoiceItem.quantity : 0;
        const invoicePrice = invoiceItem ? invoiceItem.unitPrice : 0;
        
        // Check matching
        const qtyMatch = bcfItem.quantity === receivedQty && receivedQty === invoiceQty;
        const priceMatch = bcfItem.unitPrice === invoicePrice;
        const priceDiff = Math.abs(bcfItem.unitPrice - invoicePrice);
        const priceDiffPercent = bcfItem.unitPrice > 0 ? (priceDiff / bcfItem.unitPrice) * 100 : 0;
        
        let status = 'ok';
        if (!qtyMatch || priceDiffPercent > 5) {
            status = 'error';
        } else if (priceDiffPercent > 0 && priceDiffPercent <= 5) {
            status = 'warning';
        }
        
        return {
            id: bcfItem.id,
            designation: bcfItem.designation,
            orderedQty: bcfItem.quantity,
            receivedQty: receivedQty,
            invoiceQty: invoiceQty,
            bcfUnitPrice: bcfItem.unitPrice,
            invoiceUnitPrice: invoicePrice,
            qtyMatch: qtyMatch,
            priceMatch: priceMatch,
            priceDiff: priceDiff,
            priceDiffPercent: priceDiffPercent,
            status: status
        };
    });
}

function renderComparison() {
    const tbody = document.getElementById('comparison-tbody');
    
    tbody.innerHTML = comparisonItems.map(item => {
        let statusBadge = '';
        let qtyStyle = '';
        let priceStyle = '';
        
        if (item.status === 'ok') {
            statusBadge = '<span class="match-status match-ok"><i class="fa-solid fa-check"></i> Conforme</span>';
            qtyStyle = 'color: #10B981;';
            priceStyle = 'color: #10B981;';
        } else if (item.status === 'warning') {
            statusBadge = '<span class="match-status match-warning"><i class="fa-solid fa-exclamation-triangle"></i> Écart mineur</span>';
            qtyStyle = item.qtyMatch ? 'color: #10B981;' : 'color: #F59E0B;';
            priceStyle = 'color: #F59E0B;';
        } else {
            statusBadge = '<span class="match-status match-error"><i class="fa-solid fa-times"></i> Écart majeur</span>';
            qtyStyle = item.qtyMatch ? 'color: #10B981;' : 'color: #DC2626;';
            priceStyle = 'color: #DC2626;';
        }
        
        return `
            <tr>
                <td>
                    <div style="font-weight: 600;">${item.designation}</div>
                </td>
                <td style="text-align: center;">
                    <span style="font-weight: 600;">${item.orderedQty}</span>
                </td>
                <td style="text-align: center;">
                    <span style="font-weight: 600; ${qtyStyle}">${item.receivedQty}</span>
                    ${item.receivedQty !== item.orderedQty ? `
                        <br><span style="font-size: 11px; color: #DC2626;">(${item.receivedQty - item.orderedQty > 0 ? '+' : ''}${item.receivedQty - item.orderedQty})</span>
                    ` : ''}
                </td>
                <td style="text-align: right;">
                    <span style="font-weight: 600;">${formatCurrency(item.bcfUnitPrice)}</span>
                </td>
                <td style="text-align: right;">
                    <span style="font-weight: 600; ${priceStyle}">${formatCurrency(item.invoiceUnitPrice)}</span>
                    ${item.priceDiff > 0 ? `
                        <br><span style="font-size: 11px; color: #DC2626;">(${item.invoiceUnitPrice - item.bcfUnitPrice > 0 ? '+' : ''}${formatCurrency(item.priceDiff)})</span>
                    ` : ''}
                </td>
                <td style="text-align: center;">
                    ${statusBadge}
                </td>
            </tr>
        `;
    }).join('');
}

// ================================================
// RÉSULTATS
// ================================================

function displayResults() {
    const okCount = comparisonItems.filter(i => i.status === 'ok').length;
    const warningCount = comparisonItems.filter(i => i.status === 'warning').length;
    const errorCount = comparisonItems.filter(i => i.status === 'error').length;
    const totalCount = comparisonItems.length;
    const conformityRate = totalCount > 0 ? Math.round((okCount / totalCount) * 100) : 0;
    
    document.getElementById('result-ok').textContent = okCount;
    document.getElementById('result-warning').textContent = warningCount;
    document.getElementById('result-error').textContent = errorCount;
    document.getElementById('result-rate').textContent = conformityRate + '%';
    
    // Summary
    const financialDiff = bcfData.amountTTC - invoiceData.amountTTC;
    document.getElementById('summary-bcf').textContent = formatCurrency(bcfData.amountTTC);
    document.getElementById('summary-invoice').textContent = formatCurrency(invoiceData.amountTTC);
    
    const diffElement = document.getElementById('summary-diff');
    diffElement.textContent = (financialDiff > 0 ? '- ' : '+ ') + formatCurrency(Math.abs(financialDiff));
    
    if (financialDiff === 0) {
        diffElement.style.color = '#10B981';
    } else if (Math.abs(financialDiff) <= 5000) {
        diffElement.style.color = '#F59E0B';
    } else {
        diffElement.style.color = '#DC2626';
    }
    
    // Status overview
    showStatusOverview(conformityRate, errorCount, warningCount);
    
    // Validation message
    showValidationMessage(conformityRate, errorCount, warningCount, financialDiff);
}

function showStatusOverview(rate, errors, warnings) {
    const container = document.getElementById('status-overview');
    
    let alertClass = 'alert-success';
    let icon = 'fa-check-circle';
    let title = 'Rapprochement Conforme';
    let message = 'Tous les éléments correspondent entre le BCF, la réception et la facture.';
    
    if (errors > 0) {
        alertClass = 'alert-danger';
        icon = 'fa-times-circle';
        title = 'Écarts Majeurs Détectés';
        message = `${errors} article(s) présentent des écarts majeurs nécessitant une clarification.`;
    } else if (warnings > 0) {
        alertClass = 'alert-warning';
        icon = 'fa-exclamation-triangle';
        title = 'Écarts Mineurs Détectés';
        message = `${warnings} article(s) présentent des écarts mineurs (< 5%).`;
    }
    
    container.innerHTML = `
        <div class="alert-box ${alertClass}">
            <i class="fa-solid ${icon}"></i>
            <div>
                <strong>${title}</strong><br>
                ${message}
            </div>
        </div>
    `;
}

function showValidationMessage(rate, errors, warnings, financialDiff) {
    const container = document.getElementById('validation-message');
    
    if (errors > 0 || Math.abs(financialDiff) > 5000) {
        container.innerHTML = `
            <div class="alert-box alert-danger">
                <i class="fa-solid fa-times-circle"></i>
                <div>
                    <strong>Action Requise</strong><br>
                    Des écarts majeurs ont été détectés. Il est recommandé de demander une clarification au fournisseur avant de valider le rapprochement.
                </div>
            </div>
        `;
        document.getElementById('btn-clarification').style.display = 'inline-flex';
    } else if (warnings > 0 || Math.abs(financialDiff) > 0) {
        container.innerHTML = `
            <div class="alert-box alert-warning">
                <i class="fa-solid fa-exclamation-triangle"></i>
                <div>
                    <strong>Écarts Mineurs</strong><br>
                    Quelques écarts mineurs ont été détectés. Vous pouvez valider le rapprochement ou demander des clarifications.
                </div>
            </div>
        `;
        document.getElementById('btn-clarification').style.display = 'inline-flex';
    } else {
        container.innerHTML = `
            <div class="alert-box alert-success">
                <i class="fa-solid fa-check-circle"></i>
                <div>
                    <strong>Rapprochement Parfait</strong><br>
                    Aucun écart détecté. Vous pouvez valider le rapprochement en toute confiance.
                </div>
            </div>
        `;
        document.getElementById('btn-clarification').style.display = 'none';
    }
}

// ================================================
// ACTIONS
// ================================================

function validateMatching() {
    const errorCount = comparisonItems.filter(i => i.status === 'error').length;
    const financialDiff = Math.abs(bcfData.amountTTC - invoiceData.amountTTC);
    
    if (errorCount > 0 || financialDiff > 5000) {
        const confirmMsg = `Attention: ${errorCount} écart(s) majeur(s) détecté(s).\n\nÊtes-vous sûr de vouloir valider ce rapprochement ?`;
        if (!confirm(confirmMsg)) {
            return;
        }
    }
    
    const matchingData = {
        bcfCode: bcfData.code,
        receptionCode: receptionData.code,
        invoiceNumber: invoiceData.number,
        conformityRate: parseInt(document.getElementById('result-rate').textContent),
        okCount: parseInt(document.getElementById('result-ok').textContent),
        warningCount: parseInt(document.getElementById('result-warning').textContent),
        errorCount: parseInt(document.getElementById('result-error').textContent),
        financialDiff: bcfData.amountTTC - invoiceData.amountTTC,
        status: 'VALIDATED',
        validatedAt: new Date().toISOString(),
        validatedBy: 'Marie AKONO'
    };
    
    console.log('✅ Rapprochement 3-way validé:', matchingData);
    
    alert('Rapprochement validé avec succès. La facture est prête pour le paiement.');
    window.location.href = './factures-list.html';
}

function requestClarification() {
    const errorItems = comparisonItems.filter(i => i.status === 'error' || i.status === 'warning');
    
    if (errorItems.length === 0) {
        alert('Aucun écart nécessitant une clarification');
        return;
    }
    
    const clarificationData = {
        bcfCode: bcfData.code,
        invoiceNumber: invoiceData.number,
        supplier: bcfData.supplier,
        items: errorItems.map(item => ({
            designation: item.designation,
            issue: !item.qtyMatch ? 'Quantité différente' : 'Prix unitaire différent',
            bcfValue: !item.qtyMatch ? item.orderedQty : item.bcfUnitPrice,
            invoiceValue: !item.qtyMatch ? item.invoiceQty : item.invoiceUnitPrice
        })),
        requestedAt: new Date().toISOString(),
        requestedBy: 'Marie AKONO'
    };
    
    console.log('📧 Demande de clarification:', clarificationData);
    
    alert(`Demande de clarification envoyée au fournisseur pour ${errorItems.length} article(s)`);
}

function cancelMatching() {
    if (confirm('Annuler le rapprochement et revenir à la liste des factures ?')) {
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



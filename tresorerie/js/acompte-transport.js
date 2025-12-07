/**
 * MultiFlex GESCOM - Acompte Transport Subventionné JavaScript
 * Gestion des acomptes transport pour les BC avec transport subventionné
 */

// Données de démonstration
const orderData = {
    orderNumber: 'BC-CLI156-2024-00234',
    customer: 'SONACOM SARL',
    orderAmount: 15450000,
    transportCost: 450000,
    companyShare: 0.30,
    clientShare: 0.70,
    transporter: 'KAMGA LOGISTICS',
    orderDate: '2024-01-28',
    commercial: 'M. FOTSO Pierre'
};

// Calcul automatique de l'acompte
function calculateDeposit() {
    const transportCost = orderData.transportCost;
    const companyPart = Math.round(transportCost * orderData.companyShare);
    const clientPart = Math.round(transportCost * orderData.clientShare);

    return {
        transportCost,
        companyPart,
        clientPart,
        requiredDeposit: clientPart
    };
}

// Validation de l'acompte
function validateAcompte() {
    const paymentMode = document.getElementById('paymentMode').value;
    const journal = document.getElementById('journal').value;
    const amountReceived = parseFloat(document.getElementById('amountReceived').value) || 0;
    const receiptDate = document.getElementById('receiptDate').value;

    // Validation des champs obligatoires
    if (!paymentMode) {
        showNotification('Veuillez sélectionner un mode de réception', 'error');
        return;
    }

    if (!journal) {
        showNotification('Veuillez sélectionner un journal', 'error');
        return;
    }

    if (amountReceived <= 0) {
        showNotification('Veuillez saisir un montant valide', 'error');
        return;
    }

    if (!receiptDate) {
        showNotification('Veuillez sélectionner une date de réception', 'error');
        return;
    }

    const deposit = calculateDeposit();

    // Vérification du montant
    if (amountReceived < deposit.requiredDeposit) {
        const confirm = window.confirm(
            `Le montant reçu (${formatCurrency(amountReceived)}) est inférieur au montant requis (${formatCurrency(deposit.requiredDeposit)}).\n\nVoulez-vous continuer avec un acompte partiel ?`
        );
        if (!confirm) return;
    }

    // Création de l'acompte
    const acompteData = {
        advanceNumber: 'AVA-2024-00089',
        advanceType: 'TRANSPORT_DEPOSIT',
        sourceDocument: {
            documentType: 'ORDER',
            documentId: orderData.orderNumber
        },
        customerId: 'CLI-156',
        customerName: orderData.customer,
        originalAmount: deposit.requiredDeposit,
        receivedAmount: amountReceived,
        paymentMethod: paymentMode,
        journalId: journal,
        receiptDate: receiptDate,
        reference: document.getElementById('paymentRef').value,
        status: 'ACTIVE',
        createdAt: new Date().toISOString()
    };

    console.log('Acompte créé:', acompteData);

    // Afficher le modal de succès
    document.getElementById('successModal').classList.add('active');
}

// Impression du reçu
function printReceipt() {
    const paymentMode = document.getElementById('paymentMode').value;
    const journal = document.getElementById('journal').value;
    const amountReceived = parseFloat(document.getElementById('amountReceived').value) || 0;

    if (!paymentMode || !journal || amountReceived <= 0) {
        showNotification('Veuillez remplir tous les champs obligatoires avant d\'imprimer', 'warning');
        return;
    }

    // Ouvrir une nouvelle fenêtre pour l'impression
    const printWindow = window.open('', '_blank');
    const deposit = calculateDeposit();

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Reçu Acompte Transport - AVA-2024-00089</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 40px; }
                .header { text-align: center; margin-bottom: 30px; }
                .header h1 { font-size: 24px; margin: 0; }
                .header p { color: #666; margin: 5px 0; }
                .info-section { margin-bottom: 20px; }
                .info-section h3 { font-size: 14px; color: #666; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
                .info-row { display: flex; justify-content: space-between; padding: 5px 0; }
                .info-row .label { color: #666; }
                .info-row .value { font-weight: bold; }
                .amount-box { background: #f0f9ff; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
                .amount-box .amount { font-size: 28px; font-weight: bold; color: #0369a1; }
                .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
                .signature { margin-top: 60px; display: flex; justify-content: space-between; }
                .signature-box { width: 200px; text-align: center; }
                .signature-line { border-top: 1px solid #000; margin-top: 50px; padding-top: 5px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>REÇU D'ACOMPTE TRANSPORT</h1>
                <p>N° AVA-2024-00089</p>
                <p>Date: ${new Date().toLocaleDateString('fr-FR')}</p>
            </div>

            <div class="info-section">
                <h3>BON DE COMMANDE</h3>
                <div class="info-row">
                    <span class="label">N° BC:</span>
                    <span class="value">${orderData.orderNumber}</span>
                </div>
                <div class="info-row">
                    <span class="label">Client:</span>
                    <span class="value">${orderData.customer}</span>
                </div>
                <div class="info-row">
                    <span class="label">Transporteur:</span>
                    <span class="value">${orderData.transporter}</span>
                </div>
            </div>

            <div class="info-section">
                <h3>DÉTAIL CALCUL</h3>
                <div class="info-row">
                    <span class="label">Coût transport total:</span>
                    <span class="value">${formatCurrency(deposit.transportCost)}</span>
                </div>
                <div class="info-row">
                    <span class="label">Part société (30%):</span>
                    <span class="value">${formatCurrency(deposit.companyPart)}</span>
                </div>
                <div class="info-row">
                    <span class="label">Part client (70%):</span>
                    <span class="value">${formatCurrency(deposit.clientPart)}</span>
                </div>
            </div>

            <div class="amount-box">
                <div>MONTANT REÇU</div>
                <div class="amount">${formatCurrency(amountReceived)}</div>
            </div>

            <div class="info-section">
                <h3>MODE DE PAIEMENT</h3>
                <div class="info-row">
                    <span class="label">Mode:</span>
                    <span class="value">${getPaymentModeLabel(paymentMode)}</span>
                </div>
                <div class="info-row">
                    <span class="label">Référence:</span>
                    <span class="value">${document.getElementById('paymentRef').value || '-'}</span>
                </div>
            </div>

            <div class="signature">
                <div class="signature-box">
                    <div class="signature-line">Agent Commercial</div>
                </div>
                <div class="signature-box">
                    <div class="signature-line">Client</div>
                </div>
            </div>

            <div class="footer">
                <p>Document généré par MultiFlex GESCOM</p>
                <p>${new Date().toLocaleString('fr-FR')}</p>
            </div>
        </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.print();
}

// Fermer le modal de succès
function closeSuccessModal() {
    document.getElementById('successModal').classList.remove('active');
}

// Formatage monétaire
function formatCurrency(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' XAF';
}

// Libellé mode de paiement
function getPaymentModeLabel(mode) {
    const labels = {
        'WIRE_TRANSFER': 'Virement bancaire',
        'CASH': 'Espèces',
        'CHECK': 'Chèque',
        'MOBILE_MONEY': 'Mobile Money'
    };
    return labels[mode] || mode;
}

// Notification (utilise la fonction globale si disponible)
function showNotification(message, type = 'info') {
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
    } else {
        alert(message);
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Pré-remplir la date du jour
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('receiptDate').value = today;

    // Mettre à jour le montant requis
    const deposit = calculateDeposit();
    document.getElementById('amountReceived').value = deposit.requiredDeposit;

    console.log('Acompte Transport module initialized');
    console.log('Deposit calculation:', deposit);
});

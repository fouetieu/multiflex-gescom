/**
 * MultiFlex GESCOM - Encaissement Imputation JavaScript
 * Gestion de l'imputation FIFO des encaissements
 */

let encaissementAmount = 0;

document.addEventListener('DOMContentLoaded', function() {
    // Check URL params
    const urlParams = new URLSearchParams(window.location.search);
    const encId = urlParams.get('enc');
    if (encId) {
        document.getElementById('encaissementSelect').value = encId;
        loadEncaissement();
    }
});

function loadEncaissement() {
    const select = document.getElementById('encaissementSelect');
    const value = select.value;

    if (!value) {
        document.getElementById('encaissementInfo').style.display = 'none';
        document.getElementById('imputationCard').style.display = 'none';
        return;
    }

    // Demo data based on selection
    const encaissements = {
        'ENC-001': { client: 'SONACOM SARL', amount: 500000, mode: 'Espèces', date: '15/01/2024' },
        'ENC-002': { client: 'ETS NKOULOU', amount: 200000, mode: 'Chèque', date: '14/01/2024' },
        'ENC-003': { client: 'PAINT HOUSE', amount: 1000000, mode: 'Virement', date: '13/01/2024' }
    };

    const enc = encaissements[value];
    if (enc) {
        encaissementAmount = enc.amount;

        document.getElementById('encClientName').textContent = enc.client;
        document.getElementById('encAmount').textContent = formatCurrency(enc.amount);
        document.getElementById('encMode').textContent = enc.mode;
        document.getElementById('encDate').textContent = enc.date;
        document.getElementById('encaissementInfo').style.display = 'flex';

        document.getElementById('summaryEncAmount').textContent = formatCurrency(enc.amount);
        document.getElementById('summaryRemaining').textContent = formatCurrency(enc.amount);
        document.getElementById('imputationCard').style.display = 'block';

        // Reset all inputs
        document.querySelectorAll('.imputation-input').forEach(input => {
            input.value = 0;
        });
        updateImputationTotals();
    }
}

function updateImputationTotals() {
    let totalImputed = 0;
    let hasError = false;

    document.querySelectorAll('.imputation-input').forEach(input => {
        const value = parseFloat(input.value) || 0;
        const max = parseFloat(input.dataset.max) || 0;

        if (value > max) {
            input.classList.add('error');
            hasError = true;
        } else {
            input.classList.remove('error');
        }

        totalImputed += value;
    });

    // Check if total exceeds encaissement amount
    if (totalImputed > encaissementAmount) {
        hasError = true;
        showNotification('Le total imputé ne peut pas dépasser le montant de l\'encaissement', 'error');
    }

    const remaining = encaissementAmount - totalImputed;

    document.getElementById('summaryImputed').textContent = formatCurrency(totalImputed);
    document.getElementById('summaryRemaining').textContent = formatCurrency(remaining);

    // Update remaining color
    const remainingEl = document.getElementById('summaryRemaining');
    if (remaining === 0) {
        remainingEl.className = 'text-success';
    } else if (remaining < encaissementAmount) {
        remainingEl.className = 'text-warning';
    } else {
        remainingEl.className = 'text-danger';
    }

    // Enable/disable validate button
    document.getElementById('btnValidate').disabled = hasError || totalImputed === 0;
}

function autoImputeFIFO() {
    let remainingToImpute = encaissementAmount;

    // Reset all inputs first
    document.querySelectorAll('.imputation-input').forEach(input => {
        input.value = 0;
    });

    // Impute in order (FIFO - oldest first)
    document.querySelectorAll('.imputation-row:not(.header)').forEach(row => {
        if (remainingToImpute <= 0) return;

        const input = row.querySelector('.imputation-input');
        const maxAmount = parseFloat(input.dataset.max) || 0;
        const toImpute = Math.min(remainingToImpute, maxAmount);

        input.value = toImpute;
        remainingToImpute -= toImpute;
    });

    updateImputationTotals();
    showNotification('Imputation FIFO appliquée automatiquement', 'success');
}

function validateImputation() {
    const imputations = [];

    document.querySelectorAll('.imputation-row:not(.header)').forEach(row => {
        const input = row.querySelector('.imputation-input');
        const value = parseFloat(input.value) || 0;

        if (value > 0) {
            imputations.push({
                invoice: row.dataset.code,
                amount: value
            });
        }
    });

    if (imputations.length === 0) {
        showNotification('Aucune imputation à valider', 'error');
        return;
    }

    console.log('Validating imputations:', imputations);

    showNotification('Imputation validée avec succès!', 'success');

    setTimeout(() => {
        window.location.href = './dashboard.html';
    }, 1500);
}

function cancelImputation() {
    if (confirm('Voulez-vous vraiment annuler?')) {
        window.location.href = './dashboard.html';
    }
}

function formatCurrency(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' XAF';
}

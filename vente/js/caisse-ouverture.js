/**
 * MultiFlex GESCOM - Ouverture Session Caisse
 * ECR-POS-001 : Ouverture session de caisse
 */

// ============================================================================
// MOCK DATA
// ============================================================================

const cashiers = {
    'USR-001': { name: 'Jean MBARGA', pin: '1234' },
    'USR-002': { name: 'Marie FOTSO', pin: '5678' },
    'USR-003': { name: 'Paul NGONO', pin: '9012' }
};

const caisses = {
    'CAISSE-01': { status: 'available', currentUser: null },
    'CAISSE-02': { status: 'available', currentUser: null },
    'CAISSE-03': { status: 'busy', currentUser: 'Marie FOTSO' }
};

const lastSession = {
    number: 'POS-2024-0088',
    closedAt: '28/01/2024 à 18:45',
    cashier: 'Marie FOTSO',
    status: 'closed',
    balance: 50000
};

let selectedCaisse = 'CAISSE-01';
let enteredPin = '';
let selectedCashier = null;

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    updateDateTime();
    setInterval(updateDateTime, 1000);
    checkLastSession();
});

/**
 * Update date and time display
 */
function updateDateTime() {
    const now = new Date();

    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    document.getElementById('currentDate').textContent = now.toLocaleDateString('fr-FR', options);

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('currentTime').textContent = `${hours}:${minutes}`;
}

/**
 * Check last session status
 */
function checkLastSession() {
    document.getElementById('lastSessionNumber').textContent = lastSession.number;
    document.getElementById('lastSessionDate').textContent = lastSession.closedAt;
    document.getElementById('lastSessionCashier').textContent = lastSession.cashier;
    document.getElementById('previousBalance').textContent = formatCurrency(lastSession.balance);

    if (lastSession.status === 'open') {
        document.getElementById('lastSessionStatus').className = 'session-status open';
        document.getElementById('lastSessionStatus').innerHTML = '<i class="fa-solid fa-exclamation-circle"></i> Non clôturée';
        document.getElementById('warningBox').classList.add('show');
        document.getElementById('openSessionBtn').disabled = true;
    }

    calculateTotal();
}

// ============================================================================
// CASHIER SELECTION
// ============================================================================

/**
 * Handle cashier change
 */
function onCashierChange() {
    const select = document.getElementById('cashierSelect');
    selectedCashier = select.value;

    // Reset PIN
    resetPin();

    // Enable/disable open button
    validateForm();
}

// ============================================================================
// PIN HANDLING
// ============================================================================

/**
 * Handle PIN input
 */
function handlePinInput(position) {
    const input = document.getElementById(`pin${position}`);

    if (input.value.length === 1) {
        input.classList.add('filled');

        // Move to next input
        if (position < 4) {
            document.getElementById(`pin${position + 1}`).focus();
        }
    }

    // Update entered PIN
    updateEnteredPin();
    validateForm();
}

/**
 * Handle PIN keydown (for backspace)
 */
function handlePinKeydown(event, position) {
    const input = document.getElementById(`pin${position}`);

    if (event.key === 'Backspace' && input.value === '' && position > 1) {
        const prevInput = document.getElementById(`pin${position - 1}`);
        prevInput.value = '';
        prevInput.classList.remove('filled');
        prevInput.focus();
    }
}

/**
 * Update entered PIN from inputs
 */
function updateEnteredPin() {
    enteredPin = '';
    for (let i = 1; i <= 4; i++) {
        enteredPin += document.getElementById(`pin${i}`).value;
    }
}

/**
 * Reset PIN inputs
 */
function resetPin() {
    for (let i = 1; i <= 4; i++) {
        const input = document.getElementById(`pin${i}`);
        input.value = '';
        input.classList.remove('filled');
    }
    enteredPin = '';
    document.getElementById('pin1').focus();
}

/**
 * Validate PIN
 */
function validatePin() {
    if (!selectedCashier || enteredPin.length !== 4) return false;

    const cashier = cashiers[selectedCashier];
    return cashier && cashier.pin === enteredPin;
}

// ============================================================================
// CAISSE SELECTION
// ============================================================================

/**
 * Select caisse
 */
function selectCaisse(element) {
    if (element.classList.contains('disabled')) return;

    // Remove selected from all
    document.querySelectorAll('.caisse-option').forEach(opt => {
        opt.classList.remove('selected');
    });

    // Add selected to clicked
    element.classList.add('selected');
    selectedCaisse = element.dataset.caisse;

    validateForm();
}

// ============================================================================
// FOND DE CAISSE
// ============================================================================

/**
 * Calculate total fond de caisse
 */
function calculateTotal() {
    const previousBalance = lastSession.balance;
    const adjustment = parseInt(document.getElementById('adjustment').value) || 0;
    const total = previousBalance + adjustment;

    document.getElementById('totalFond').textContent = formatCurrency(total);
}

// ============================================================================
// FORM VALIDATION
// ============================================================================

/**
 * Validate form
 */
function validateForm() {
    const isValid = selectedCashier && enteredPin.length === 4 && selectedCaisse && lastSession.status !== 'open';
    document.getElementById('openSessionBtn').disabled = !isValid;
}

// ============================================================================
// SESSION OPENING
// ============================================================================

/**
 * Open session
 */
function openSession() {
    hideError();

    // Validate PIN
    if (!validatePin()) {
        showError('Code PIN incorrect. Veuillez réessayer.');
        resetPin();
        return;
    }

    // Validate caisse availability
    if (caisses[selectedCaisse].status === 'busy') {
        showError('Cette caisse est déjà occupée. Veuillez en sélectionner une autre.');
        return;
    }

    // Generate new session number
    const sessionNumber = generateSessionNumber();
    const cashierName = cashiers[selectedCashier].name;
    const fondCaisse = lastSession.balance + (parseInt(document.getElementById('adjustment').value) || 0);

    // Store session info
    sessionStorage.setItem('posSession', JSON.stringify({
        sessionNumber: sessionNumber,
        caisse: selectedCaisse,
        cashierId: selectedCashier,
        cashierName: cashierName,
        fondCaisse: fondCaisse,
        startTime: new Date().toISOString(),
        status: 'open'
    }));

    // Show success and redirect
    alert(`Session ${sessionNumber} ouverte avec succès!\n\nCaissier: ${cashierName}\nCaisse: ${selectedCaisse}\nFond de caisse: ${formatCurrency(fondCaisse)}`);

    window.location.href = './caisse.html';
}

/**
 * Generate session number
 */
function generateSessionNumber() {
    const year = new Date().getFullYear();
    const lastNum = parseInt(lastSession.number.split('-').pop()) || 0;
    const newNum = String(lastNum + 1).padStart(4, '0');
    return `POS-${year}-${newNum}`;
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * Show error message
 */
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    document.getElementById('errorText').textContent = message;
    errorDiv.classList.add('show');
}

/**
 * Hide error message
 */
function hideError() {
    document.getElementById('errorMessage').classList.remove('show');
}

// ============================================================================
// NAVIGATION
// ============================================================================

/**
 * Go back
 */
function goBack() {
    if (confirm('Voulez-vous vraiment annuler l\'ouverture de session ?')) {
        window.location.href = '../index.html';
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format currency
 */
function formatCurrency(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' XAF';
}

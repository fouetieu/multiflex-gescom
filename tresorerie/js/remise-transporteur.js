/**
 * MultiFlex GESCOM - Remise Transporteur JavaScript
 * Gestion des remises de fonds aux transporteurs agréés
 */

let selectedTransporter = null;
let currentBordereau = null;

function showNewRemiseForm() {
    document.getElementById('newRemiseForm').style.display = 'block';
    document.getElementById('newRemiseForm').scrollIntoView({ behavior: 'smooth' });
}

function hideNewRemiseForm() {
    document.getElementById('newRemiseForm').style.display = 'none';
    resetForm();
}

function resetForm() {
    selectedTransporter = null;
    document.querySelectorAll('.transporter-card').forEach(c => c.classList.remove('selected'));
    document.getElementById('sourceJournal').value = '';
    document.getElementById('remiseAmount').value = '';
    document.getElementById('destBank').value = '';
    document.getElementById('remiseNotes').value = '';
}

function selectTransporter(transporter, element) {
    document.querySelectorAll('.transporter-card').forEach(c => c.classList.remove('selected'));
    element.classList.add('selected');
    selectedTransporter = transporter;
}

function createRemise() {
    if (!selectedTransporter) {
        showNotification('Veuillez sélectionner un transporteur', 'error');
        return;
    }

    const sourceJournal = document.getElementById('sourceJournal').value;
    const amount = parseFloat(document.getElementById('remiseAmount').value) || 0;
    const destBank = document.getElementById('destBank').value;

    if (!sourceJournal || !amount || !destBank) {
        showNotification('Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }

    // Generate bordereau number
    const bordereauNum = 'BOR-2024-' + String(Math.floor(Math.random() * 1000)).padStart(5, '0');

    const remiseData = {
        bordereau: bordereauNum,
        transporter: selectedTransporter,
        sourceJournal: sourceJournal,
        amount: amount,
        destBank: destBank,
        notes: document.getElementById('remiseNotes').value,
        status: 'EN_COURS',
        createdAt: new Date().toISOString()
    };

    console.log('Creating remise:', remiseData);

    showNotification(`Bordereau ${bordereauNum} généré avec succès!`, 'success');

    // Add to table
    addRemiseToTable(remiseData);
    hideNewRemiseForm();
}

function addRemiseToTable(remise) {
    const tbody = document.querySelector('.card:nth-child(2) tbody'); // In-progress table
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td class="font-mono font-semibold text-[#263c89]">${remise.bordereau}</td>
        <td>${new Date().toLocaleDateString('fr-FR')} ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</td>
        <td>${remise.transporter}</td>
        <td>${document.getElementById('sourceJournal').options[document.getElementById('sourceJournal').selectedIndex].text.split(' (')[0]}</td>
        <td class="text-right font-semibold">${formatCurrency(remise.amount)}</td>
        <td class="text-center">
            <span class="remise-status en-cours">
                <i class="fa-solid fa-clock"></i>
                En cours
            </span>
        </td>
        <td class="text-center">
            <button class="btn btn-secondary btn-sm" onclick="updateStatus('${remise.bordereau}')">
                <i class="fa-solid fa-edit"></i>
                Mettre à jour
            </button>
        </td>
    `;

    tbody.insertBefore(newRow, tbody.firstChild);
}

function updateStatus(bordereau) {
    const newStatus = prompt('Nouveau statut?\n1 = Pris en charge\n2 = Déposé\n3 = Confirmé');

    if (!newStatus) return;

    let statusHtml = '';
    switch (newStatus) {
        case '1':
            statusHtml = '<span class="remise-status pris-en-charge"><i class="fa-solid fa-truck"></i> Pris en charge</span>';
            break;
        case '2':
            statusHtml = '<span class="remise-status depose"><i class="fa-solid fa-building-columns"></i> Déposé</span>';
            break;
        case '3':
            confirmDeposit(bordereau);
            return;
    }

    // Find and update the row
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
        if (row.querySelector('.font-mono')?.textContent === bordereau) {
            row.querySelector('td:nth-child(6)').innerHTML = statusHtml;

            if (newStatus === '1') {
                row.querySelector('td:last-child').innerHTML = `
                    <button class="btn btn-success btn-sm" onclick="confirmDeposit('${bordereau}')">
                        <i class="fa-solid fa-check"></i>
                        Confirmer Dépôt
                    </button>
                `;
            }
        }
    });

    showNotification('Statut mis à jour', 'success');
}

function confirmDeposit(bordereau) {
    currentBordereau = bordereau;
    document.getElementById('modalBordereau').textContent = bordereau;

    // Find amount from table
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
        if (row.querySelector('.font-mono')?.textContent === bordereau) {
            document.getElementById('modalAmount').textContent = row.querySelector('td:nth-child(5)').textContent;
        }
    });

    document.getElementById('confirmDepositModal').classList.add('active');
}

function closeConfirmModal() {
    document.getElementById('confirmDepositModal').classList.remove('active');
    document.getElementById('bankReference').value = '';
    currentBordereau = null;
}

function submitConfirmation() {
    const bankRef = document.getElementById('bankReference').value;

    if (!bankRef) {
        showNotification('Veuillez saisir la référence bancaire', 'error');
        return;
    }

    showNotification('Dépôt confirmé avec succès!', 'success');
    closeConfirmModal();

    // Move from in-progress to completed
    moveToCompleted(currentBordereau);
}

function moveToCompleted(bordereau) {
    // Find the row in the in-progress table
    const inProgressTable = document.querySelector('.card:nth-child(3) tbody');
    const completedTable = document.querySelector('.card:nth-child(4) tbody');

    const rows = inProgressTable.querySelectorAll('tr');
    rows.forEach(row => {
        if (row.querySelector('.font-mono')?.textContent === bordereau) {
            // Create completed row
            const now = new Date();
            const dateStr = now.toLocaleDateString('fr-FR');
            const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td class="font-mono">${bordereau}</td>
                <td>${row.querySelector('td:nth-child(2)').textContent}</td>
                <td>${dateStr} ${timeStr}</td>
                <td>${row.querySelector('td:nth-child(3)').textContent}</td>
                <td class="text-right font-semibold">${row.querySelector('td:nth-child(5)').textContent}</td>
                <td class="text-center">
                    <span class="remise-status confirme">
                        <i class="fa-solid fa-check-circle"></i>
                        Confirmé
                    </span>
                </td>
            `;

            completedTable.insertBefore(newRow, completedTable.firstChild);

            // Remove from in-progress
            row.remove();
        }
    });
}

function formatCurrency(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' XAF';
}

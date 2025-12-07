/**
 * MultiFlex GESCOM - Validation Double Signature JavaScript
 * Gestion de la validation des transactions nécessitant double signature
 */

let currentTransactionId = null;

function viewDetails(transactionId) {
    showNotification('Affichage des détails de ' + transactionId, 'info');
}

function viewAttachments(transactionId) {
    showNotification('Ouverture des pièces jointes...', 'info');
}

function requestInfo(transactionId) {
    const comment = prompt('Quelle information souhaitez-vous obtenir?');
    if (comment) {
        showNotification('Demande d\'information envoyée au demandeur', 'success');
    }
}

function approveTransaction(transactionId) {
    if (confirm(`Confirmez-vous l'approbation de la transaction ${transactionId}?`)) {
        showNotification('Transaction approuvée avec succès!', 'success');

        // Remove card from view
        setTimeout(() => {
            const cards = document.querySelectorAll('.validation-card');
            cards.forEach(card => {
                if (card.querySelector('.font-mono')?.textContent === transactionId) {
                    card.style.opacity = '0.5';
                    card.innerHTML = `
                        <div class="text-center py-8">
                            <i class="fa-solid fa-check-circle text-success text-4xl mb-3"></i>
                            <div class="font-semibold text-success">Transaction Approuvée</div>
                            <div class="text-muted text-sm">${transactionId} - En cours d'exécution</div>
                        </div>
                    `;
                }
            });

            // Update stats
            updatePendingCount();
        }, 500);
    }
}

function rejectTransaction(transactionId) {
    currentTransactionId = transactionId;
    document.getElementById('rejectModal').classList.add('active');
}

function closeRejectModal() {
    document.getElementById('rejectModal').classList.remove('active');
    document.getElementById('rejectReason').value = '';
    document.getElementById('rejectComment').value = '';
    currentTransactionId = null;
}

function confirmReject() {
    const reason = document.getElementById('rejectReason').value;
    const comment = document.getElementById('rejectComment').value;

    if (!reason) {
        showNotification('Veuillez sélectionner un motif de rejet', 'error');
        return;
    }

    closeRejectModal();
    showNotification('Transaction rejetée', 'warning');

    // Update card
    setTimeout(() => {
        const cards = document.querySelectorAll('.validation-card');
        cards.forEach(card => {
            if (card.querySelector('.font-mono')?.textContent === currentTransactionId) {
                card.style.opacity = '0.5';
                card.innerHTML = `
                    <div class="text-center py-8">
                        <i class="fa-solid fa-times-circle text-danger text-4xl mb-3"></i>
                        <div class="font-semibold text-danger">Transaction Rejetée</div>
                        <div class="text-muted text-sm">${currentTransactionId}</div>
                    </div>
                `;
            }
        });

        updatePendingCount();
    }, 500);
}

function updatePendingCount() {
    // Update badge count in sidebar
    const badge = document.querySelector('.sidebar-link[data-page="validation-double-signature"] .rounded-full');
    if (badge) {
        const currentCount = parseInt(badge.textContent) || 0;
        if (currentCount > 0) {
            badge.textContent = currentCount - 1;
            if (currentCount - 1 === 0) {
                badge.style.display = 'none';
            }
        }
    }

    // Update stat card
    const statValue = document.querySelector('.stat-card .stat-value[style*="F59E0B"]');
    if (statValue) {
        const current = parseInt(statValue.textContent) || 0;
        if (current > 0) {
            statValue.textContent = current - 1;
        }
    }
}

// Search & Filter functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const typeFilter = document.getElementById('typeFilter');
    const urgencyFilter = document.getElementById('urgencyFilter');

    if (searchInput) {
        searchInput.addEventListener('input', filterCards);
    }
    if (typeFilter) {
        typeFilter.addEventListener('change', filterCards);
    }
    if (urgencyFilter) {
        urgencyFilter.addEventListener('change', filterCards);
    }
});

function filterCards() {
    const search = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const urgency = document.getElementById('urgencyFilter')?.value || '';

    document.querySelectorAll('.validation-card').forEach(card => {
        const text = card.textContent.toLowerCase();
        const isUrgent = card.classList.contains('urgent');

        let show = true;

        if (search && !text.includes(search)) {
            show = false;
        }

        if (urgency === 'urgent' && !isUrgent) {
            show = false;
        }

        if (urgency === 'normal' && isUrgent) {
            show = false;
        }

        card.style.display = show ? 'block' : 'none';
    });
}

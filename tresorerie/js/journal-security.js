/**
 * MultiFlex GESCOM - Journal Security JavaScript
 * Gestion des paramètres de sécurité des journaux de trésorerie
 */

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    initPage();
});

function initPage() {
    setupEventListeners();
    loadJournalData();
}

function setupEventListeners() {
    // Toggle dual signature settings visibility
    const dualSignatureCheckbox = document.getElementById('dualSignatureEnabled');
    if (dualSignatureCheckbox) {
        dualSignatureCheckbox.addEventListener('change', function() {
            document.getElementById('dualSignatureSettings').style.display =
                this.checked ? 'block' : 'none';
        });
    }

    // Overdraft limit warning
    const overdraftInput = document.getElementById('overdraftLimit');
    if (overdraftInput) {
        overdraftInput.addEventListener('input', function() {
            // Could trigger validation or warning here
        });
    }
}

function loadJournalData() {
    // In production: fetch journal data from API based on URL param
    const urlParams = new URLSearchParams(window.location.search);
    const journalCode = urlParams.get('code') || 'BNK-001';

    console.log('Loading security settings for journal:', journalCode);
}

// ============================================================================
// PERMISSION TOGGLE
// ============================================================================

function togglePermission(element) {
    element.classList.toggle('active');

    // Log the change for audit trail
    const userRow = element.closest('.user-row');
    const userName = userRow?.querySelector('.font-semibold')?.textContent;
    const permissionIndex = Array.from(element.closest('div').parentElement.children).indexOf(element.closest('div'));

    const permissions = ['Lecture', 'Écriture', 'Validation', 'Admin'];
    const permissionName = permissions[permissionIndex - 1] || 'Permission';

    const isActive = element.classList.contains('active');

    console.log(`Permission "${permissionName}" ${isActive ? 'activée' : 'désactivée'} pour ${userName}`);

    showNotification(`Permission ${permissionName} ${isActive ? 'activée' : 'désactivée'}`, 'info');
}

// ============================================================================
// USER MANAGEMENT
// ============================================================================

function showAddUserModal() {
    document.getElementById('addUserModal').classList.add('active');
}

function closeAddUserModal() {
    document.getElementById('addUserModal').classList.remove('active');
    // Reset form
    document.getElementById('newUserSelect').value = '';
    document.getElementById('perm_read').checked = true;
    document.getElementById('perm_write').checked = false;
    document.getElementById('perm_validate').checked = false;
    document.getElementById('perm_admin').checked = false;
    document.getElementById('newUserLimit').value = '';
}

function addUser() {
    const userSelect = document.getElementById('newUserSelect');
    const selectedUser = userSelect.value;

    if (!selectedUser) {
        showNotification('Veuillez sélectionner un utilisateur', 'error');
        return;
    }

    const userName = userSelect.options[userSelect.selectedIndex].text;
    const [name, role] = userName.split(' - ');

    const permissions = {
        read: document.getElementById('perm_read').checked,
        write: document.getElementById('perm_write').checked,
        validate: document.getElementById('perm_validate').checked,
        admin: document.getElementById('perm_admin').checked
    };

    const limit = document.getElementById('newUserLimit').value;
    const limitDisplay = limit ? `${parseInt(limit).toLocaleString('fr-FR')} XAF` : 'N/A';

    // Get initials
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

    // Generate random color
    const colors = ['#263c89', '#F26F21', '#10B981', '#8B5CF6', '#EC4899'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    // Add new row to permissions table
    const container = document.querySelector('.section-card:nth-child(4) .section-card-body');
    const newRow = document.createElement('div');
    newRow.className = 'user-row';
    newRow.innerHTML = `
        <div style="flex: 2; display: flex; align-items: center; gap: 12px;">
            <div class="w-10 h-10 rounded-full text-white flex items-center justify-center font-semibold text-sm" style="background: ${randomColor};">${initials}</div>
            <div>
                <div class="font-semibold text-[#1F2937]">${name}</div>
                <div class="text-xs text-[#6B7280]">${role || 'Utilisateur'}</div>
            </div>
        </div>
        <div style="width: 90px; text-align: center;">
            <div class="permission-toggle ${permissions.read ? 'active' : ''}" onclick="togglePermission(this)"></div>
        </div>
        <div style="width: 90px; text-align: center;">
            <div class="permission-toggle ${permissions.write ? 'active' : ''}" onclick="togglePermission(this)"></div>
        </div>
        <div style="width: 90px; text-align: center;">
            <div class="permission-toggle ${permissions.validate ? 'active' : ''}" onclick="togglePermission(this)"></div>
        </div>
        <div style="width: 90px; text-align: center;">
            <div class="permission-toggle ${permissions.admin ? 'active' : ''}" onclick="togglePermission(this)"></div>
        </div>
        <div style="width: 120px; text-align: center;">
            <span class="text-sm ${limit ? 'font-semibold text-[#1F2937]' : 'text-[#6B7280]'}">${limitDisplay}</span>
        </div>
        <div style="width: 80px; text-align: center;">
            <button type="button" class="btn-icon" title="Modifier" onclick="editUserPermissions('${selectedUser}')">
                <i class="fa-solid fa-edit"></i>
            </button>
            <button type="button" class="btn-icon text-red-500" title="Retirer" onclick="removeUserAccess('${selectedUser}')">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `;

    container.appendChild(newRow);

    closeAddUserModal();
    showNotification(`${name} ajouté avec succès`, 'success');
}

function editUserPermissions(userId) {
    showNotification('Modification des permissions...', 'info');
    // In production: open edit modal with user data
}

function removeUserAccess(userId) {
    if (confirm('Êtes-vous sûr de vouloir retirer l\'accès de cet utilisateur?')) {
        // Find and remove the row
        const rows = document.querySelectorAll('.user-row');
        rows.forEach(row => {
            const editBtn = row.querySelector(`[onclick="editUserPermissions('${userId}')"]`);
            if (editBtn) {
                row.remove();
            }
        });

        showNotification('Accès utilisateur retiré', 'success');
    }
}

// ============================================================================
// SIGNATORY MANAGEMENT
// ============================================================================

function showAddSignatoryModal() {
    document.getElementById('addSignatoryModal').classList.add('active');
}

function closeAddSignatoryModal() {
    document.getElementById('addSignatoryModal').classList.remove('active');
    document.getElementById('newSignatorySelect').value = '';
    document.getElementById('newSignatoryEmail').value = '';
}

function addSignatory() {
    const signatorySelect = document.getElementById('newSignatorySelect');
    const email = document.getElementById('newSignatoryEmail').value;

    if (!signatorySelect.value) {
        showNotification('Veuillez sélectionner un signataire', 'error');
        return;
    }

    const signatoryName = signatorySelect.options[signatorySelect.selectedIndex].text;
    const [name, role] = signatoryName.split(' - ');

    const tbody = document.getElementById('signatoriesList');
    const newRow = document.createElement('tr');
    newRow.className = 'border-t border-gray-200 hover:bg-gray-50';
    newRow.innerHTML = `
        <td class="px-4 py-3 font-medium">${name}</td>
        <td class="px-4 py-3 text-gray-600">${role || '-'}</td>
        <td class="px-4 py-3 text-gray-600">${email || '-'}</td>
        <td class="px-4 py-3 text-center">
            <input type="checkbox" checked class="w-4 h-4 accent-[#10B981]">
        </td>
        <td class="px-4 py-3 text-center">
            <button type="button" class="btn-icon text-red-500" onclick="removeSignatory(this)" title="Retirer">
                <i class="fa-solid fa-times"></i>
            </button>
        </td>
    `;

    tbody.appendChild(newRow);

    closeAddSignatoryModal();
    showNotification(`Signataire ${name} ajouté`, 'success');
}

function removeSignatory(button) {
    const row = button.closest('tr');
    const name = row.querySelector('td:first-child').textContent;

    // Check minimum signatories
    const remainingSignatories = document.querySelectorAll('#signatoriesList tr').length;

    if (remainingSignatories <= 2) {
        showNotification('Minimum 2 signataires requis', 'error');
        return;
    }

    if (confirm(`Retirer ${name} des signataires?`)) {
        row.remove();
        showNotification('Signataire retiré', 'success');
    }
}

// ============================================================================
// FORM ACTIONS
// ============================================================================

function saveSecuritySettings() {
    // Collect all form data
    const data = {
        limits: {
            openingBalance: parseFloat(document.getElementById('openingBalance').value) || 0,
            openingDate: document.getElementById('openingDate').value,
            overdraftLimit: parseFloat(document.getElementById('overdraftLimit').value) || 0,
            dailyWithdrawLimit: parseFloat(document.getElementById('dailyWithdrawLimit').value) || 0,
            alertThreshold: parseFloat(document.getElementById('alertThreshold').value) || 0,
            criticalThreshold: parseFloat(document.getElementById('criticalThreshold').value) || 0
        },
        dualSignature: {
            enabled: document.getElementById('dualSignatureEnabled').checked,
            threshold: parseFloat(document.getElementById('dualSignatureThreshold').value) || 0,
            signatories: []
        },
        status: document.querySelector('input[name="journalStatus"]:checked')?.value || 'ACTIVE',
        isDefault: document.getElementById('isDefault').checked,
        permissions: []
    };

    // Collect signatories
    document.querySelectorAll('#signatoriesList tr').forEach(row => {
        const checkbox = row.querySelector('input[type="checkbox"]');
        if (checkbox) {
            const cells = row.querySelectorAll('td');
            data.dualSignature.signatories.push({
                name: cells[0]?.textContent.trim(),
                role: cells[1]?.textContent.trim(),
                email: cells[2]?.textContent.trim(),
                active: checkbox.checked
            });
        }
    });

    // Collect user permissions
    document.querySelectorAll('.section-card:nth-child(4) .user-row:not(:first-child)').forEach(row => {
        const toggles = row.querySelectorAll('.permission-toggle');
        const userName = row.querySelector('.font-semibold')?.textContent;

        if (userName) {
            data.permissions.push({
                user: userName,
                read: toggles[0]?.classList.contains('active') || false,
                write: toggles[1]?.classList.contains('active') || false,
                validate: toggles[2]?.classList.contains('active') || false,
                admin: toggles[3]?.classList.contains('active') || false
            });
        }
    });

    // Validation
    if (data.limits.criticalThreshold >= data.limits.alertThreshold) {
        showNotification('Le seuil critique doit être inférieur au seuil d\'alerte', 'error');
        return;
    }

    if (data.dualSignature.enabled) {
        const activeSignatories = data.dualSignature.signatories.filter(s => s.active).length;
        if (activeSignatories < 2) {
            showNotification('Minimum 2 signataires actifs requis', 'error');
            return;
        }
    }

    console.log('Saving security settings:', data);

    // Simulate API call
    showNotification('Enregistrement des paramètres...', 'info');

    setTimeout(() => {
        showNotification('Paramètres de sécurité enregistrés avec succès!', 'success');

        // Add to audit trail (visual only for demo)
        addAuditEntry('Modification des paramètres de sécurité', 'Jean KAMGA a modifié les paramètres de sécurité du journal');
    }, 1000);
}

function resetForm() {
    if (confirm('Voulez-vous vraiment réinitialiser le formulaire? Les modifications non enregistrées seront perdues.')) {
        location.reload();
    }
}

// ============================================================================
// AUDIT TRAIL
// ============================================================================

function addAuditEntry(title, description) {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;

    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR') + ' - ' + now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    const newEntry = document.createElement('div');
    newEntry.className = 'timeline-item info';
    newEntry.innerHTML = `
        <div class="timeline-content">
            <div class="timeline-date">${dateStr}</div>
            <div class="timeline-title">${title}</div>
            <div class="timeline-description">${description}</div>
        </div>
    `;

    timeline.insertBefore(newEntry, timeline.firstChild);
}

function exportAuditLog() {
    showNotification('Export du journal d\'audit en cours...', 'info');

    // Collect audit entries
    const entries = [];
    document.querySelectorAll('.timeline-item').forEach(item => {
        entries.push({
            date: item.querySelector('.timeline-date')?.textContent || '',
            title: item.querySelector('.timeline-title')?.textContent || '',
            description: item.querySelector('.timeline-description')?.textContent || ''
        });
    });

    // Create CSV
    let csv = 'Date,Action,Description\n';
    entries.forEach(entry => {
        csv += `"${entry.date}","${entry.title}","${entry.description}"\n`;
    });

    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audit_log_BNK-001.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    showNotification('Journal d\'audit exporté', 'success');
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatCurrency(amount) {
    if (!amount && amount !== 0) return '-';
    return new Intl.NumberFormat('fr-FR').format(amount) + ' XAF';
}

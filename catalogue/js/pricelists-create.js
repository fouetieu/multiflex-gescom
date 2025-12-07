// ================================================
// PRICELISTS-CREATE.JS
// Gestion de la création d'une liste de prix
// ================================================

// État global
let selectedPartners = [];
let mockPartners = [];

// ================================================
// INITIALISATION
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation du formulaire de création...');
    
    // Initialiser les données mock
    initMockData();
    
    // Définir la date du jour par défaut
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('start-date').value = today;
    
    // Écouteurs d'événements
    document.getElementById('pricelist-form').addEventListener('submit', handleSubmit);
    
    // Listener pour valider les dates
    document.getElementById('start-date').addEventListener('change', validateDates);
    document.getElementById('end-date').addEventListener('change', validateDates);
});

function initMockData() {
    // Partenaires fictifs pour la recherche
    mockPartners = [
        { id: 'P001', code: 'QUINC-001', name: 'Quincaillerie Moderne', type: 'PARTNER_QUINCAILLERIE' },
        { id: 'P002', code: 'TECH-001', name: 'Jean MVONDO - Technicien', type: 'PARTNER_TECHNICIAN' },
        { id: 'P003', code: 'QUINC-002', name: 'Quincaillerie du Centre', type: 'PARTNER_QUINCAILLERIE' },
        { id: 'P004', code: 'PATRON-001', name: 'Paul EKANI - Patron', type: 'PARTNER_PATRON' },
        { id: 'P005', code: 'WHOLE-001', name: 'Grossiste CAMI', type: 'PARTNER_WHOLESALER' },
        { id: 'P006', code: 'TECH-002', name: 'Marie AKONO - Technicienne', type: 'PARTNER_TECHNICIAN' }
    ];
}

// ================================================
// GÉNÉRATION AUTOMATIQUE DU CODE
// ================================================

function generateCode() {
    const type = document.querySelector('input[name="type"]:checked').value;
    const name = document.getElementById('name').value;
    const year = new Date().getFullYear();
    
    let prefix = 'TARIF';
    
    if (type === 'PURCHASE') {
        prefix = 'ACHAT';
    }
    
    // Extraire les premiers mots du nom
    let suffix = '';
    if (name) {
        const words = name.toUpperCase().split(' ').filter(w => w.length > 2);
        suffix = words.slice(0, 2).join('-');
    }
    
    let code = `${prefix}-`;
    
    if (suffix) {
        code += `${suffix}-`;
    }
    
    code += year;
    
    document.getElementById('code').value = code;
}

// ================================================
// PRIORITÉ
// ================================================

function incrementPriority() {
    const input = document.getElementById('priority');
    const currentValue = parseInt(input.value) || 10;
    if (currentValue < 999) {
        input.value = currentValue + 1;
    }
}

function decrementPriority() {
    const input = document.getElementById('priority');
    const currentValue = parseInt(input.value) || 10;
    if (currentValue > 1) {
        input.value = currentValue - 1;
    }
}

// ================================================
// DATE DE FIN
// ================================================

function toggleEndDate() {
    const checkbox = document.getElementById('no-end-date');
    const endDateInput = document.getElementById('end-date');
    
    if (checkbox.checked) {
        endDateInput.value = '';
        endDateInput.disabled = true;
        endDateInput.style.opacity = '0.5';
    } else {
        endDateInput.disabled = false;
        endDateInput.style.opacity = '1';
    }
}

function validateDates() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const noEndDate = document.getElementById('no-end-date').checked;
    
    if (!noEndDate && startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (end <= start) {
            alert('⚠️ La date de fin doit être postérieure à la date de début');
            document.getElementById('end-date').value = '';
            return false;
        }
    }
    
    return true;
}

// ================================================
// RECHERCHE DE PARTENAIRES
// ================================================

function searchPartners() {
    const searchTerm = document.getElementById('partner-search').value.toLowerCase();
    const resultsDiv = document.getElementById('partner-search-results');
    
    if (searchTerm.length < 2) {
        resultsDiv.style.display = 'none';
        return;
    }
    
    const filtered = mockPartners.filter(p => 
        p.code.toLowerCase().includes(searchTerm) ||
        p.name.toLowerCase().includes(searchTerm)
    );
    
    if (filtered.length === 0) {
        resultsDiv.innerHTML = '<div style="padding: 12px; text-align: center; color: var(--gray-500);">Aucun partenaire trouvé</div>';
        resultsDiv.style.display = 'block';
        return;
    }
    
    resultsDiv.innerHTML = filtered.map(partner => `
        <div style="padding: 12px; cursor: pointer; border-bottom: 1px solid var(--gray-200); transition: background 0.2s;"
             onmouseover="this.style.background='var(--gray-50)'"
             onmouseout="this.style.background='white'"
             onclick="selectPartner('${partner.id}')">
            <div style="font-weight: 600; margin-bottom: 4px;">${partner.code} - ${partner.name}</div>
            <div style="font-size: 12px; color: var(--gray-600);">${partner.type}</div>
        </div>
    `).join('');
    
    resultsDiv.style.display = 'block';
}

function selectPartner(partnerId) {
    const partner = mockPartners.find(p => p.id === partnerId);
    
    if (!partner) return;
    
    // Vérifier si déjà sélectionné
    if (selectedPartners.find(p => p.id === partnerId)) {
        alert('Ce partenaire est déjà sélectionné');
        return;
    }
    
    selectedPartners.push(partner);
    renderSelectedPartners();
    
    // Réinitialiser la recherche
    document.getElementById('partner-search').value = '';
    document.getElementById('partner-search-results').style.display = 'none';
}

function removePartner(partnerId) {
    selectedPartners = selectedPartners.filter(p => p.id !== partnerId);
    renderSelectedPartners();
}

function renderSelectedPartners() {
    const container = document.getElementById('selected-partners');
    
    if (selectedPartners.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = selectedPartners.map(partner => `
        <div class="partner-chip">
            <span>${partner.code}</span>
            <button onclick="removePartner('${partner.id}')" title="Retirer">
                <i class="fa-solid fa-times"></i>
            </button>
        </div>
    `).join('');
}

// ================================================
// VALIDATION ET SOUMISSION
// ================================================

function handleSubmit(e) {
    e.preventDefault();
    
    // Validation
    if (!validateForm()) {
        return;
    }
    
    const formData = collectFormData();
    
    console.log('📦 Données du formulaire:', formData);
    
    // Simuler l'enregistrement
    alert('✅ Liste de prix créée avec succès!\n\nVous allez être redirigé vers la gestion des articles.');
    
    // Redirection vers l'écran d'édition (avec les articles)
    // En production, utiliser l'ID retourné par l'API
    setTimeout(() => {
        window.location.href = `./pricelists-edit.html?id=PL_NEW&tab=items`;
    }, 1000);
}

function validateForm() {
    // Validation du code
    const code = document.getElementById('code').value.trim();
    if (!code) {
        alert('⚠️ Le code de la liste est obligatoire');
        document.getElementById('code').focus();
        return false;
    }
    
    // Validation du nom
    const name = document.getElementById('name').value.trim();
    if (!name) {
        alert('⚠️ Le nom de la liste est obligatoire');
        document.getElementById('name').focus();
        return false;
    }
    
    // Validation de la priorité
    const priority = parseInt(document.getElementById('priority').value);
    if (!priority || priority < 1 || priority > 999) {
        alert('⚠️ La priorité doit être comprise entre 1 et 999');
        document.getElementById('priority').focus();
        return false;
    }
    
    // Validation de la date de début
    const startDate = document.getElementById('start-date').value;
    if (!startDate) {
        alert('⚠️ La date de début est obligatoire');
        document.getElementById('start-date').focus();
        return false;
    }
    
    // Validation des dates
    if (!validateDates()) {
        return false;
    }
    
    // Validation du ciblage
    const partnerTypes = document.querySelectorAll('input[name="partner-types"]:checked');
    if (partnerTypes.length === 0 && selectedPartners.length === 0) {
        if (!confirm('⚠️ Aucun partenaire cible défini.\n\nVoulez-vous continuer? La liste ne s\'appliquera à aucun partenaire.')) {
            return false;
        }
    }
    
    return true;
}

function collectFormData() {
    const code = document.getElementById('code').value.trim();
    const name = document.getElementById('name').value.trim();
    const description = document.getElementById('description').value.trim();
    const type = document.querySelector('input[name="type"]:checked').value;
    const priority = parseInt(document.getElementById('priority').value);
    const currency = document.getElementById('currency').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('no-end-date').checked ? null : document.getElementById('end-date').value;
    const status = document.querySelector('input[name="status"]:checked').value;
    
    // Récupérer les types de partenaires
    const partnerTypes = Array.from(document.querySelectorAll('input[name="partner-types"]:checked'))
        .map(cb => cb.value);
    
    return {
        code,
        name,
        description,
        type,
        priority,
        currency,
        startDate,
        endDate,
        status,
        partnerTypes,
        specificPartners: selectedPartners.map(p => p.id),
        createdAt: new Date().toISOString(),
        createdBy: 'Pierre NGONO'
    };
}

// ================================================
// ACTIONS
// ================================================

function cancelForm() {
    if (confirm('⚠️ Voulez-vous vraiment annuler?\n\nToutes les modifications seront perdues.')) {
        window.location.href = './pricelists-list.html';
    }
}

function saveDraft() {
    // Forcer le statut à DRAFT
    document.querySelector('input[name="status"][value="DRAFT"]').checked = true;
    
    if (!validateForm()) {
        return;
    }
    
    const formData = collectFormData();
    formData.status = 'DRAFT';
    
    console.log('📝 Enregistrement comme brouillon:', formData);
    
    alert('✅ Liste de prix enregistrée comme brouillon!\n\nVous pourrez la compléter plus tard.');
    
    setTimeout(() => {
        window.location.href = './pricelists-list.html';
    }, 1000);
}








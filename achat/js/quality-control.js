// ================================================
// QUALITY-CONTROL.JS
// Contrôle qualité réceptions en quarantaine
// ================================================

let quarantineItems = [
    {
        id: 'quar-1',
        br: 'BR-2024-089',
        article: 'Peinture',
        quantity: '120L',
        lot: 'LOT001',
        supplier: 'ABC SARL',
        tests: [
            { name: 'Viscosité', value: '1.2', unit: 'Pa.s', spec: '1.0-1.5', status: 'OK' },
            { name: 'Densité', value: '1.35', unit: 'g/cm³', spec: '1.3-1.4', status: 'OK' },
            { name: 'Couleur', value: 'OK', unit: '', spec: 'RAL 9016', status: 'OK' },
            { name: 'pH', value: '7.8', unit: '', spec: '7.5-8.5', status: 'OK' }
        ],
        decision: 'ACCEPTÉ',
        controller: 'M. Tchana',
        comments: 'Conforme aux spécifications'
    },
    {
        id: 'quar-2',
        br: 'BR-2024-090',
        article: 'Diluant',
        quantity: '95L',
        lot: 'LOT002',
        supplier: 'ABC SARL',
        tests: [
            { name: 'Flash Point', value: '35', unit: '°C', spec: '25-40', status: 'OK' },
            { name: 'Viscosité', value: '0.8', unit: 'Pa.s', spec: '0.7-0.9', status: 'OK' },
            { name: 'Odeur', value: 'Normal', unit: '', spec: 'Caractéristique', status: 'OK' }
        ],
        decision: 'ACCEPTÉ',
        controller: 'M. Tchana',
        comments: 'Qualité conforme'
    },
    {
        id: 'quar-3',
        br: 'BR-2024-091',
        article: 'Pigment',
        quantity: '50kg',
        lot: 'LOT003',
        supplier: 'XYZ Ltd',
        tests: [
            { name: 'Granulométrie', value: '15µm', unit: '', spec: '10-20µm', status: 'OK' },
            { name: 'Humidité', value: '2.1', unit: '%', spec: '<3%', status: 'OK' },
            { name: 'pH', value: '6.9', unit: '', spec: '6.5-7.5', status: 'OK' }
        ],
        decision: 'EN_ATTENTE',
        controller: null,
        comments: ''
    }
];

let selectedItem = null;

// ================================================
// INITIALISATION
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation contrôle qualité...');
    
    renderQuarantineTable();
});

// ================================================
// TABLEAU QUARANTAINE
// ================================================

function renderQuarantineTable() {
    const tbody = document.getElementById('quarantine-tbody');
    
    tbody.innerHTML = quarantineItems.map(item => `
        <tr onclick="selectItem('${item.id}')">
            <td class="checkbox-cell">
                <input type="checkbox" onclick="event.stopPropagation()">
            </td>
            <td><strong>${item.br}</strong></td>
            <td>${item.article}</td>
            <td style="text-align: center;">${item.quantity}</td>
            <td>${item.lot}</td>
            <td>${item.supplier}</td>
            <td style="text-align: center;">
                <button type="button" class="btn-control" onclick="event.stopPropagation(); openControlPanel('${item.id}')">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    Contrôler
                </button>
            </td>
        </tr>
    `).join('');
}

function toggleSelectAll() {
    const checked = document.getElementById('select-all').checked;
    document.querySelectorAll('.checkbox-cell input[type="checkbox"]').forEach(cb => {
        cb.checked = checked;
    });
}

// ================================================
// CONTROL PANEL
// ================================================

function selectItem(itemId) {
    selectedItem = quarantineItems.find(item => item.id === itemId);
    
    // Update table selection
    document.querySelectorAll('tbody tr').forEach(tr => {
        tr.style.background = 'transparent';
    });
    event.target.closest('tr').style.background = '#EFF6FF';
}

function openControlPanel(itemId) {
    selectedItem = quarantineItems.find(item => item.id === itemId);
    if (!selectedItem) return;
    
    const panel = document.getElementById('control-panel');
    
    const testsHtml = selectedItem.tests.map(test => `
        <div class="test-item">
            <div class="test-label">☑ ${test.name}</div>
            <input type="text" class="test-input" value="${test.value}" placeholder="Valeur">
            <div class="test-spec">
                <span>Norme: ${test.spec}</span>
                <span class="test-result result-ok">
                    <i class="fa-solid fa-check"></i> ✓
                </span>
            </div>
        </div>
    `).join('');
    
    panel.innerHTML = `
        <h3 style="font-size: 16px; font-weight: 600; color: #1F2937; margin-bottom: 20px;">
            <i class="fa-solid fa-flask"></i>
            Fiche de Contrôle - ${selectedItem.article} Lot ${selectedItem.lot}
        </h3>

        <div style="background: #DBEAFE; border: 1px solid #93C5FD; border-radius: 6px; padding: 12px; margin-bottom: 20px; font-size: 13px; color: #1E40AF;">
            <strong>BR:</strong> ${selectedItem.br} | <strong>Quantité:</strong> ${selectedItem.quantity} | <strong>Fournisseur:</strong> ${selectedItem.supplier}
        </div>

        <h4 class="section-title">Tests effectués:</h4>
        <div style="margin-bottom: 24px;">
            ${testsHtml}
        </div>

        <h4 class="section-title">Décision</h4>
        <div class="form-group">
            <label class="form-label">Résultat du contrôle <span style="color: #EF4444;">*</span></label>
            <div class="radio-group" style="flex-direction: column;">
                <div class="radio-item">
                    <input type="radio" id="decision-accepte-${selectedItem.id}" name="decision-${selectedItem.id}" value="ACCEPTÉ" ${selectedItem.decision === 'ACCEPTÉ' ? 'checked' : ''}>
                    <label for="decision-accepte-${selectedItem.id}">Accepté</label>
                </div>
                <div class="radio-item">
                    <input type="radio" id="decision-rejeté-${selectedItem.id}" name="decision-${selectedItem.id}" value="REJETÉ">
                    <label for="decision-rejeté-${selectedItem.id}">Rejeté</label>
                </div>
                <div class="radio-item">
                    <input type="radio" id="decision-reserve-${selectedItem.id}" name="decision-${selectedItem.id}" value="ACCEPTÉ_RÉSERVE">
                    <label for="decision-reserve-${selectedItem.id}">Accepté avec réserve</label>
                </div>
            </div>
        </div>

        <div class="form-group">
            <label class="form-label">Contrôleur <span style="color: #EF4444;">*</span></label>
            <select class="form-select">
                <option value="M. Tchana" ${selectedItem.controller === 'M. Tchana' ? 'selected' : ''}>M. Tchana - Responsable Qualité</option>
                <option value="Mlle. Ange">Mlle. Ange - Technicienne</option>
                <option value="M. Kouam">M. Kouam - Inspecteur</option>
            </select>
        </div>

        <div class="form-group">
            <label class="form-label">Commentaires</label>
            <textarea class="form-textarea" placeholder="Notes du contrôle...">${selectedItem.comments}</textarea>
        </div>

        <div style="display: flex; gap: 12px; margin-top: 20px;">
            <button type="button" class="btn btn-secondary" onclick="closeControlPanel()">
                <i class="fa-solid fa-times"></i>
                Fermer
            </button>
            <button type="button" class="btn btn-success" onclick="validateControl('${selectedItem.id}')">
                <i class="fa-solid fa-check"></i>
                Valider contrôle → Libération stock
            </button>
        </div>
    `;
    
    panel.style.display = 'block';
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeControlPanel() {
    document.getElementById('control-panel').style.display = 'none';
    selectedItem = null;
}

// ================================================
// ACTIONS
// ================================================

function validateControl(itemId) {
    if (!selectedItem) return;
    
    const decision = document.querySelector(`input[name="decision-${itemId}"]:checked`)?.value;
    
    if (!decision) {
        alert('Veuillez sélectionner une décision');
        return;
    }
    
    console.log('✅ Validation contrôle qualité:', {
        br: selectedItem.br,
        article: selectedItem.article,
        lot: selectedItem.lot,
        decision: decision,
        timestamp: new Date().toISOString()
    });
    
    alert(`✅ Contrôle validé !\n\nMouvements de stock générés:\n• MVT-2024-1236: Libération stock\n• Emplacement: A1-B3-R2`);
    
    // Remove from quarantine
    quarantineItems = quarantineItems.filter(item => item.id !== itemId);
    document.getElementById('quarantine-count').textContent = quarantineItems.length;
    
    renderQuarantineTable();
    closeControlPanel();
}


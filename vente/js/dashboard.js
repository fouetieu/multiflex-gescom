/**
 * MultiFlex GESCOM - Dashboard Commercial
 * Logique et données du tableau de bord commercial
 */

// ============================================================================
// MOCK DATA
// ============================================================================

const kpiData = {
    caMois: 458750000,
    caJour: 45670000,
    objectifMois: 600000000,
    nouveauxClients: 45,
    objectifClients: 50,
    dso: 35,
    dsoCible: 30,
    encours: 234500000,
    limiteEncours: 300000000,
    impayes: 45230000,
    impayesCritiques: 15200000,
    tauxConversion: 78,
    panierMoyen: 750000
};

const evolutionData = {
    labels: ['Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc', 'Jan'],
    realise: [280, 310, 340, 360, 380, 400, 390, 410, 420, 440, 450, 458.75],
    objectif: [300, 330, 360, 390, 420, 450, 480, 510, 540, 560, 580, 600]
};

const clientTypeData = [
    { label: 'Entreprises', value: 298200000, percent: 65, color: '#263c89' },
    { label: 'Quincailleries', value: 69000000, percent: 15, color: '#3B82F6' },
    { label: 'Particuliers', value: 46000000, percent: 10, color: '#8B5CF6' },
    { label: 'Techniciens', value: 45550000, percent: 10, color: '#EC4899' }
];

const productCategoryData = [
    { label: 'Construction', value: 206000000, percent: 45, color: '#263c89' },
    { label: 'Peinture', value: 115000000, percent: 25, color: '#3B82F6' },
    { label: 'Plomberie', value: 69000000, percent: 15, color: '#059669' },
    { label: 'Électricité', value: 37000000, percent: 8, color: '#D97706' },
    { label: 'Outillage', value: 23000000, percent: 5, color: '#DC2626' },
    { label: 'Autres', value: 9000000, percent: 2, color: '#6B7280' }
];

const zoneData = [
    { label: 'Douala', value: 252000000, percent: 55, color: '#263c89' },
    { label: 'Yaoundé', value: 92000000, percent: 20, color: '#3B82F6' },
    { label: 'Bafoussam', value: 46000000, percent: 10, color: '#059669' },
    { label: 'Bamenda', value: 37000000, percent: 8, color: '#D97706' },
    { label: 'Garoua', value: 23000000, percent: 5, color: '#DC2626' },
    { label: 'Autres', value: 9000000, percent: 2, color: '#6B7280' }
];

const commercialData = [
    { name: 'M. DJOMO', ca: 125300000, objectif: 150, taux: 84, rang: 1 },
    { name: 'J. FOTSO', ca: 98700000, objectif: 120, taux: 82, rang: 2 },
    { name: 'P. NGONO', ca: 87200000, objectif: 110, taux: 79, rang: 3 },
    { name: 'S. KAMGA', ca: 76500000, objectif: 100, taux: 77, rang: 4 },
    { name: 'L. MBARGA', ca: 45200000, objectif: 80, taux: 57, rang: 5 },
    { name: 'K. TCHINDA', ca: 26100000, objectif: 60, taux: 44, rang: 6 }
];

const pipelineData = [
    { status: 'pending', label: 'En validation', icon: '⏳', count: 12, amount: 45200000, delay: '< 2h', actions: '8 crédit, 4 caution' },
    { status: 'validated', label: 'Validées', icon: '✅', count: 34, amount: 89300000, delay: 'J+1', actions: 'Planifier livraison' },
    { status: 'delivery', label: 'En livraison', icon: '🚚', count: 15, amount: 28700000, delay: 'Aujourd\'hui', actions: '3 retards signalés' },
    { status: 'delivered', label: 'Livrées', icon: '📦', count: 8, amount: 15300000, delay: 'J-1', actions: 'À facturer' }
];

const opportunitiesData = [
    { client: 'TECHNI-BUILD', project: 'Extension entrepôt', amount: 25000000, prob: 80, status: 'Devis envoyé' },
    { client: 'SONACOM SARL', project: 'Chantier Bonanjo', amount: 18500000, prob: 60, status: 'Négociation' },
    { client: 'ENTREPRISE XYZ', project: 'Rénovation siège', amount: 15200000, prob: 40, status: 'Premier contact' },
    { client: 'KAMGA & FILS', project: 'Nouvelle boutique', amount: 12800000, prob: 90, status: 'Verbal OK' },
    { client: 'QUINCAILLERIE M.', project: 'Stock annuel', amount: 8500000, prob: 70, status: 'RDV planifié' }
];

const alertsData = {
    critical: [
        { text: 'ENTREPRISE XYZ: Impayé 5.5M XAF depuis 45 jours', action: 'Relancer' },
        { text: 'Stock CIMENT-50KG critique: 45 sacs (seuil: 100)', action: 'Commander' },
        { text: 'Commercial TCHINDA K.: Réalisation 44% objectif', action: 'Analyser' }
    ],
    warning: [
        { text: '8 commandes en attente validation > 2h', action: 'Traiter' },
        { text: 'ANR expire dans 15j pour 3 clients', action: 'Notifier' },
        { text: 'Caution DJOMO M. utilisée à 85% (4.25M/5M)', action: 'Surveiller' },
        { text: 'Retard livraison BL-00234 (2h)', action: 'Appeler' },
        { text: 'Objectif mensuel: 76.5% avec 3 jours restants', action: 'Analyser' }
    ],
    info: [
        { text: 'Nouveau client CONSTRUCTION PLUS validé aujourd\'hui', icon: '✓' },
        { text: 'Paiement 2.5M reçu de SONACOM SARL', icon: '✓' },
        { text: 'Livraison spéciale programmée demain 6h', icon: '📅' },
        { text: 'Formation équipe vente prévue vendredi', icon: '📚' }
    ]
};

const metricsData = [
    { name: 'Panier moyen', jan: '750K', dec: '680K', var: '+10.3%', avg: '710K' },
    { name: 'Taux conversion', jan: '78%', dec: '72%', var: '+8.3%', avg: '75%' },
    { name: 'Nouveaux/Total', jan: '12%', dec: '8%', var: '+50%', avg: '10%' },
    { name: 'Délai livraison', jan: '1.8j', dec: '2.1j', var: '-14.3%', avg: '2.0j' },
    { name: 'Satisfaction', jan: '4.2/5', dec: '4.0/5', var: '+5%', avg: '4.1/5' },
    { name: 'Réclamations', jan: '3', dec: '7', var: '-57%', avg: '5' }
];

const topClientsData = [
    { rang: 1, name: 'SONACOM SARL', ca: 45200000, commands: 12, encours: 12300000, status: 'ok' },
    { rang: 2, name: 'TECHNI-BUILD', ca: 38700000, commands: 8, encours: 5200000, status: 'ok' },
    { rang: 3, name: 'ENTREPRISE XYZ', ca: 32100000, commands: 6, encours: 15500000, status: 'blocked' },
    { rang: 4, name: 'QUINCAILLERIE MOD', ca: 28500000, commands: 23, encours: 0, status: 'ok' },
    { rang: 5, name: 'KAMGA Jean Paul', ca: 24300000, commands: 15, encours: 3200000, status: 'watch' },
    { rang: 6, name: 'CONSTRUCTION PLUS', ca: 19800000, commands: 4, encours: 8700000, status: 'ok' },
    { rang: 7, name: 'BTP SERVICES', ca: 17200000, commands: 7, encours: 2100000, status: 'ok' },
    { rang: 8, name: 'NJOYA & FILS', ca: 15600000, commands: 9, encours: 0, status: 'ok' },
    { rang: 9, name: 'DEPOT CENTRAL', ca: 13400000, commands: 11, encours: 4500000, status: 'ok' },
    { rang: 10, name: 'MULTI-TRAVAUX', ca: 11200000, commands: 5, encours: 1800000, status: 'ok' }
];

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    renderEvolutionChart();
    renderTopClientsWidget();
});

// ============================================================================
// CHARTS
// ============================================================================

let evolutionChart = null;
let clientTypeChart = null;

/**
 * Render Evolution Chart
 */
function renderEvolutionChart() {
    const ctx = document.getElementById('evolutionChart').getContext('2d');

    evolutionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: evolutionData.labels,
            datasets: [
                {
                    label: 'Réalisé',
                    data: evolutionData.realise,
                    borderColor: '#263c89',
                    backgroundColor: 'rgba(38, 60, 137, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#263c89'
                },
                {
                    label: 'Objectif',
                    data: evolutionData.objectif,
                    borderColor: '#D1D5DB',
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0.4,
                    pointRadius: 3,
                    pointBackgroundColor: '#D1D5DB'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.raw + 'M XAF';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 700,
                    ticks: {
                        callback: function(value) {
                            return value + 'M';
                        }
                    },
                    grid: {
                        color: '#F3F4F6'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

/**
 * Render Top 5 Clients Widget
 */
function renderTopClientsWidget() {
    const container = document.getElementById('topClientsContainer');
    if (!container) return;

    const top5 = topClientsData.slice(0, 5);
    const maxCA = Math.max(...top5.map(c => c.ca));

    container.innerHTML = top5.map((client, index) => {
        const percent = (client.ca / maxCA * 100).toFixed(0);
        const rankColors = ['#FFD700', '#C0C0C0', '#CD7F32', '#263c89', '#263c89'];
        const rankBg = ['#FEF3C7', '#F3F4F6', '#FEE2E2', '#EEF2FF', '#EEF2FF'];

        return `
            <div style="display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #F3F4F6;">
                <div style="width: 28px; height: 28px; border-radius: 50%; background: ${rankBg[index]}; color: ${rankColors[index]}; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px;">
                    ${index + 1}
                </div>
                <div style="flex: 1; min-width: 0;">
                    <div style="font-size: 13px; font-weight: 500; color: #1F2937; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        ${client.name}
                    </div>
                    <div style="height: 6px; background: #E5E7EB; border-radius: 3px; margin-top: 4px; overflow: hidden;">
                        <div style="height: 100%; width: ${percent}%; background: linear-gradient(90deg, #263c89, #3B82F6); border-radius: 3px;"></div>
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 13px; font-weight: 600; color: #263c89;">
                        ${formatCompact(client.ca)}
                    </div>
                    <div style="font-size: 11px; color: #6B7280;">
                        ${client.commands} cmd
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Add "Voir tous" link
    container.innerHTML += `
        <div style="text-align: center; padding-top: 12px;">
            <a href="./clients-list.html" style="color: #263c89; font-size: 13px; font-weight: 500; text-decoration: none;">
                Voir tous les clients <i class="fa-solid fa-arrow-right" style="font-size: 11px;"></i>
            </a>
        </div>
    `;
}

/**
 * Render Product Category Bars
 */
function renderProductCategoryBars() {
    const container = document.getElementById('productCategoryBars');

    container.innerHTML = productCategoryData.map(item => `
        <div class="bar-item">
            <span class="bar-label">${item.label}</span>
            <div class="bar-track">
                <div class="bar-fill" style="width: ${item.percent}%; background: ${item.color};">
                    ${item.percent}%
                </div>
            </div>
            <span class="bar-value">${formatCompact(item.value)}</span>
        </div>
    `).join('');
}

/**
 * Render Zone Bars
 */
function renderZoneBars() {
    const container = document.getElementById('zoneBars');

    container.innerHTML = zoneData.map(item => `
        <div class="bar-item">
            <span class="bar-label">${item.label}</span>
            <div class="bar-track">
                <div class="bar-fill" style="width: ${item.percent}%; background: ${item.color};">
                    ${item.percent}%
                </div>
            </div>
            <span class="bar-value">${formatCompact(item.value)}</span>
        </div>
    `).join('');
}

// ============================================================================
// TABLES
// ============================================================================

/**
 * Render Commercial Table
 */
function renderCommercialTable() {
    const tbody = document.getElementById('commercialTableBody');

    tbody.innerHTML = commercialData.map(item => {
        const rankClass = item.rang === 1 ? 'gold' : item.rang === 2 ? 'silver' : item.rang === 3 ? 'bronze' : 'default';

        return `
            <tr>
                <td>${item.name}</td>
                <td style="font-weight: 600;">${formatCompact(item.ca)}</td>
                <td>${item.objectif}M</td>
                <td style="color: ${item.taux >= 80 ? '#059669' : item.taux >= 60 ? '#D97706' : '#DC2626'}; font-weight: 600;">
                    ${item.taux}%
                </td>
                <td>
                    <span class="rank-badge ${rankClass}">${item.rang}</span>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * Render Pipeline Table
 */
function renderPipelineTable() {
    const tbody = document.getElementById('pipelineTableBody');

    let totalCount = 0;
    let totalAmount = 0;

    let html = pipelineData.map(item => {
        totalCount += item.count;
        totalAmount += item.amount;

        return `
            <tr>
                <td>
                    <span class="status-badge ${item.status}">
                        ${item.icon} ${item.label}
                    </span>
                </td>
                <td style="text-align: center; font-weight: 600;">${item.count}</td>
                <td style="font-weight: 600;">${formatCompact(item.amount)}</td>
                <td>${item.delay}</td>
                <td class="actions-required">${item.actions}</td>
            </tr>
        `;
    }).join('');

    // Total row
    html += `
        <tr class="pipeline-total">
            <td>TOTAL</td>
            <td style="text-align: center;">${totalCount}</td>
            <td>${formatCompact(totalAmount)}</td>
            <td></td>
            <td></td>
        </tr>
    `;

    tbody.innerHTML = html;
}

/**
 * Render Opportunity Table
 */
function renderOpportunityTable() {
    const tbody = document.getElementById('opportunityTableBody');

    let totalPondere = 0;

    let html = opportunitiesData.map(item => {
        totalPondere += item.amount * (item.prob / 100);
        const probClass = item.prob >= 70 ? 'high' : item.prob >= 50 ? 'medium' : 'low';

        return `
            <tr>
                <td style="font-weight: 500;">${item.client}</td>
                <td>${item.project}</td>
                <td style="font-weight: 600;">${formatCompact(item.amount)}</td>
                <td><span class="prob-badge ${probClass}">${item.prob}%</span></td>
                <td class="opportunity-status">${item.status}</td>
            </tr>
        `;
    }).join('');

    // Total row
    html += `
        <tr style="background: #F9FAFB; font-weight: 600;">
            <td></td>
            <td>TOTAL PONDÉRÉ</td>
            <td style="color: #263c89;">${formatCompact(totalPondere)}</td>
            <td></td>
            <td></td>
        </tr>
    `;

    tbody.innerHTML = html;
}

/**
 * Render Alerts
 */
function renderAlerts() {
    const container = document.getElementById('alertsContainer');

    let html = '';

    // Critical alerts
    if (alertsData.critical.length > 0) {
        html += `
            <div class="alert-group critical">
                <div class="alert-group-header">
                    <i class="fa-solid fa-circle-exclamation"></i>
                    CRITIQUES
                    <span class="alert-count">${alertsData.critical.length}</span>
                </div>
                <div class="alert-list">
                    ${alertsData.critical.map(alert => `
                        <div class="alert-item">
                            <span class="alert-text">• ${alert.text}</span>
                            <button class="alert-action">${alert.action}</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Warning alerts
    if (alertsData.warning.length > 0) {
        html += `
            <div class="alert-group warning">
                <div class="alert-group-header">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    IMPORTANTES
                    <span class="alert-count">${alertsData.warning.length}</span>
                </div>
                <div class="alert-list">
                    ${alertsData.warning.map(alert => `
                        <div class="alert-item">
                            <span class="alert-text">• ${alert.text}</span>
                            <button class="alert-action">${alert.action}</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Info alerts
    if (alertsData.info.length > 0) {
        html += `
            <div class="alert-group info">
                <div class="alert-group-header">
                    <i class="fa-solid fa-circle-info"></i>
                    INFORMATIONS
                    <span class="alert-count">${alertsData.info.length}</span>
                </div>
                <div class="alert-list">
                    ${alertsData.info.map(alert => `
                        <div class="alert-item">
                            <span class="alert-text">• ${alert.text}</span>
                            <span class="alert-icon">${alert.icon}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    container.innerHTML = html;
}

/**
 * Render Metrics Table
 */
function renderMetricsTable() {
    const tbody = document.getElementById('metricsTableBody');

    tbody.innerHTML = metricsData.map(item => {
        const isPositive = item.var.startsWith('+') || (item.var.startsWith('-') && item.name === 'Délai livraison') || (item.var.startsWith('-') && item.name === 'Réclamations');

        return `
            <tr>
                <td class="metric-name">${item.name}</td>
                <td>${item.jan}</td>
                <td>${item.dec}</td>
                <td class="${isPositive ? 'var-positive' : 'var-negative'}">${item.var}</td>
                <td>${item.avg}</td>
            </tr>
        `;
    }).join('');
}

/**
 * Render Top Clients Table
 */
function renderTopClientsTable() {
    const tbody = document.getElementById('topClientsTableBody');

    tbody.innerHTML = topClientsData.map(item => {
        const rankClass = item.rang === 1 ? 'gold' : item.rang === 2 ? 'silver' : item.rang === 3 ? 'bronze' : 'default';
        const statusIcon = item.status === 'ok' ? '🟢' : item.status === 'blocked' ? '🔴' : '🟡';
        const statusText = item.status === 'ok' ? 'OK' : item.status === 'blocked' ? 'Bloqué' : 'Surveillance';
        const statusClass = item.status;

        return `
            <tr>
                <td><span class="rank-badge ${rankClass}">${item.rang}</span></td>
                <td style="font-weight: 500;">${item.name}</td>
                <td style="font-weight: 600;">${formatCompact(item.ca)}</td>
                <td style="text-align: center;">${item.commands}</td>
                <td>${item.encours > 0 ? formatCompact(item.encours) : '-'}</td>
                <td>
                    <span class="client-status ${statusClass}">
                        ${statusIcon} ${statusText}
                    </span>
                </td>
            </tr>
        `;
    }).join('');
}

// ============================================================================
// ACTIONS
// ============================================================================

/**
 * Refresh Dashboard
 */
function refreshDashboard() {
    const btn = event.target.closest('.refresh-btn');
    const icon = btn.querySelector('i');

    icon.classList.add('fa-spin');

    setTimeout(() => {
        icon.classList.remove('fa-spin');
        alert('Données actualisées avec succès!');
    }, 1000);
}

/**
 * Show Chart Details
 */
function showChartDetails() {
    alert('Affichage des détails du graphique...\n\nCette fonctionnalité affichera:\n- Données mensuelles détaillées\n- Comparaison N/N-1\n- Export des données');
}

/**
 * View All Opportunities
 */
function viewAllOpportunities() {
    alert('Affichage de toutes les opportunités...');
}

/**
 * Configure Alerts
 */
function configureAlerts() {
    alert('Configuration des alertes...\n\nCette fonctionnalité permettra de:\n- Définir les seuils d\'alerte\n- Configurer les notifications\n- Personnaliser les règles');
}

/**
 * View All Clients
 */
function viewAllClients() {
    window.location.href = './clients-list.html';
}

/**
 * Generate Detailed Report
 */
function generateDetailedReport() {
    alert('Génération du rapport détaillé en cours...');
}

/**
 * Send Summary
 */
function sendSummary() {
    const email = prompt('Entrez l\'adresse email:', 'direction@iola-btp.cm');
    if (email) {
        alert(`Synthèse envoyée à ${email}`);
    }
}

/**
 * Print Dashboard
 */
function printDashboard() {
    window.print();
}

/**
 * Customize Dashboard
 */
function customizeDashboard() {
    alert('Personnalisation du tableau de bord...\n\nCette fonctionnalité permettra de:\n- Réorganiser les widgets\n- Choisir les KPIs affichés\n- Configurer les graphiques');
}

/**
 * Schedule Report
 */
function scheduleReport() {
    alert('Programmation d\'envoi...\n\nChoisissez la fréquence:\n- Quotidien\n- Hebdomadaire\n- Mensuel');
}

/**
 * Save View
 */
function saveView() {
    const viewName = prompt('Nom de la vue:', 'Ma vue personnalisée');
    if (viewName) {
        alert(`Vue "${viewName}" sauvegardée avec succès!`);
    }
}

/**
 * Export to Excel
 */
function exportExcel() {
    alert('Export Excel en cours...\n\nLe fichier sera téléchargé automatiquement.');
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format number with thousands separator
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format currency
 */
function formatCurrency(amount) {
    return formatNumber(amount) + ' XAF';
}

/**
 * Format compact number (e.g., 1.5M)
 */
function formatCompact(num) {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + 'B';
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
}

// ============================================================================
// AUTO-REFRESH (optional)
// ============================================================================

// Uncomment to enable auto-refresh every 5 minutes
// setInterval(() => {
//     console.log('Auto-refreshing dashboard...');
//     // Reload data here
// }, 300000);

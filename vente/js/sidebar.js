/**
 * MultiFlex GESCOM - Sidebar Menu JavaScript
 * Gestion du menu latéral unifié pour le module ventes
 */

// ============================================================================
// SIDEBAR STATE MANAGEMENT
// ============================================================================

const SIDEBAR_STATE_KEY = 'multiflex_sidebar_collapsed';

/**
 * Initialize sidebar
 * @param {string} activePage - The current page identifier
 */
function initSidebar(activePage) {
    // Load sidebar state from localStorage
    const isCollapsed = localStorage.getItem(SIDEBAR_STATE_KEY) === 'true';

    if (isCollapsed) {
        document.querySelector('.app-layout').classList.add('sidebar-collapsed');
    }

    // Set active page
    setActivePage(activePage);

    // Add tooltips for collapsed state
    addTooltips();

    // Handle responsive
    handleResponsive();
    window.addEventListener('resize', handleResponsive);
}

/**
 * Toggle sidebar collapsed state
 */
function toggleSidebar() {
    const appLayout = document.querySelector('.app-layout');
    appLayout.classList.toggle('sidebar-collapsed');

    const isCollapsed = appLayout.classList.contains('sidebar-collapsed');
    localStorage.setItem(SIDEBAR_STATE_KEY, isCollapsed);
}

/**
 * Set the active page in the navigation
 * @param {string} pageName - The page identifier
 */
function setActivePage(pageName) {
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Add active class to current page
    const activeItem = document.querySelector(`.nav-item[data-page="${pageName}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }
}

/**
 * Add tooltips to nav items for collapsed state
 */
function addTooltips() {
    document.querySelectorAll('.nav-item').forEach(item => {
        const text = item.querySelector('span');
        if (text) {
            item.setAttribute('data-tooltip', text.textContent);
        }
    });
}

/**
 * Handle responsive behavior
 */
function handleResponsive() {
    const appLayout = document.querySelector('.app-layout');
    const isMobile = window.innerWidth <= 1024;

    if (isMobile) {
        appLayout.classList.remove('sidebar-collapsed');
        appLayout.classList.remove('sidebar-open');
    }
}

/**
 * Toggle mobile sidebar
 */
function toggleMobileSidebar() {
    const appLayout = document.querySelector('.app-layout');
    appLayout.classList.toggle('sidebar-open');
}

/**
 * Close mobile sidebar
 */
function closeMobileSidebar() {
    const appLayout = document.querySelector('.app-layout');
    appLayout.classList.remove('sidebar-open');
}

/**
 * Show settings modal (placeholder)
 */
function showSettings() {
    alert('Paramètres - Fonctionnalité à venir');
}

// ============================================================================
// NAVIGATION HELPERS
// ============================================================================

/**
 * Navigate to a page
 * @param {string} url - The URL to navigate to
 */
function navigateTo(url) {
    window.location.href = url;
}

/**
 * Navigate to client detail
 * @param {string} clientCode - The client code
 */
function viewClient(clientCode) {
    window.location.href = `./client-detail.html?code=${clientCode}`;
}

/**
 * Navigate to order detail
 * @param {string} orderNumber - The order number
 */
function viewOrder(orderNumber) {
    window.location.href = `./commande-detail.html?num=${orderNumber}`;
}

/**
 * Navigate to invoice detail
 * @param {string} invoiceNumber - The invoice number
 */
function viewInvoice(invoiceNumber) {
    window.location.href = `./facture-detail.html?num=${invoiceNumber}`;
}

/**
 * Navigate to delivery detail
 * @param {string} deliveryNumber - The delivery number
 */
function viewDelivery(deliveryNumber) {
    window.location.href = `./livraison-detail.html?num=${deliveryNumber}`;
}

/**
 * Create new order for a client
 * @param {string} clientCode - The client code
 */
function createOrderForClient(clientCode) {
    window.location.href = `./commande-create.html?client=${clientCode}`;
}

/**
 * Create invoice from delivery
 * @param {string} deliveryNumber - The delivery number
 */
function createInvoiceFromDelivery(deliveryNumber) {
    window.location.href = `./facture-create.html?bl=${deliveryNumber}`;
}

/**
 * Create credit note from invoice
 * @param {string} invoiceNumber - The invoice number
 */
function createCreditNote(invoiceNumber) {
    window.location.href = `./avoir-create.html?source=${invoiceNumber}`;
}

/**
 * Transform order to delivery
 * @param {string} orderNumber - The order number
 */
function transformOrderToDelivery(orderNumber) {
    window.location.href = `./livraison-create.html?bc=${orderNumber}`;
}

// ============================================================================
// BREADCRUMB HELPER
// ============================================================================

/**
 * Set breadcrumb
 * @param {Array} items - Array of breadcrumb items [{label, url}]
 */
function setBreadcrumb(items) {
    const breadcrumb = document.querySelector('.breadcrumb');
    if (!breadcrumb) return;

    let html = '<a href="./dashboard.html">Accueil</a>';

    items.forEach((item, index) => {
        html += ' <i class="fa-solid fa-chevron-right"></i> ';

        if (index === items.length - 1 || !item.url) {
            html += `<span>${item.label}</span>`;
        } else {
            html += `<a href="${item.url}">${item.label}</a>`;
        }
    });

    breadcrumb.innerHTML = html;
}

// ============================================================================
// USER MENU
// ============================================================================

/**
 * Current user data (would come from API in real app)
 */
const currentUser = {
    name: 'Marie DJOMO',
    initials: 'MD',
    role: 'Commercial Senior'
};

/**
 * Initialize user menu
 */
function initUserMenu() {
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const userRole = document.getElementById('userRole');

    if (userAvatar) userAvatar.textContent = currentUser.initials;
    if (userName) userName.textContent = currentUser.name;
    if (userRole) userRole.textContent = currentUser.role;
}

/**
 * Logout user
 */
function logout() {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
        window.location.href = '../index.html';
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format currency (XAF)
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' XAF';
}

/**
 * Format date
 * @param {Date|string} date - The date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
    if (typeof date === 'string') {
        return date;
    }
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

/**
 * Format compact number
 * @param {number} num - The number to format
 * @returns {string} Formatted compact string
 */
function formatCompact(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

/**
 * Show notification toast
 * @param {string} message - The message to display
 * @param {string} type - Type: success, warning, error, info
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fa-solid ${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
            <i class="fa-solid fa-times"></i>
        </button>
    `;

    // Add to container (create if not exists)
    let container = document.querySelector('.notification-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }

    container.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

/**
 * Get notification icon based on type
 */
function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        warning: 'fa-exclamation-triangle',
        error: 'fa-times-circle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

// ============================================================================
// DYNAMIC SIDEBAR LOADING
// ============================================================================

// Mapping des pages aux data-page pour les pages de détail/création
const pageAliases = {
    'client-detail': 'clients-list',
    'avoir-create': 'avoirs-list',
    'retour-create': 'retours-list',
    'reclamation-detail': 'reclamations-list',
    'commissions-detail': 'commissions-dashboard',
    'caisse-retour': 'caisse'
};

/**
 * Load sidebar component dynamically (for server environments)
 * For local file:// usage, sidebar is embedded directly in HTML
 */
function loadSidebarComponent() {
    const sidebarContainer = document.getElementById('sidebar-container');
    if (!sidebarContainer) {
        // Sidebar is already embedded in HTML, just highlight current page
        highlightCurrentPageAuto();
        return;
    }

    // Try to fetch for server environments
    fetch('./components/sidebar.html')
        .then(response => response.text())
        .then(html => {
            sidebarContainer.innerHTML = html;
            highlightCurrentPageAuto();
        })
        .catch(error => {
            console.error('Erreur de chargement du sidebar:', error);
        });
}

/**
 * Highlight current page automatically based on URL
 */
function highlightCurrentPageAuto() {
    // Get page name from URL
    const path = window.location.pathname;
    const pageName = path.split('/').pop().replace('.html', '');

    // Check for alias
    const targetPage = pageAliases[pageName] || pageName;

    // Remove active class from all links
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
        link.style.background = '';
        link.style.borderLeft = '';
    });

    // Add active class to matching link
    const activeLink = document.querySelector(`.sidebar-link[data-page="${targetPage}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
        activeLink.style.background = '#152045';
        activeLink.style.borderLeft = '4px solid #F26F21';
    }
}

// Inject sidebar link styles
const sidebarLinkStyles = `
    .sidebar-link {
        display: block;
        padding: 8px 16px;
        font-size: 14px;
        color: white;
        text-decoration: none;
        transition: background 0.2s;
    }

    .sidebar-link:hover {
        background: #152045;
    }

    .sidebar-link.active {
        background: #152045;
        border-left: 4px solid #F26F21;
    }
`;

function injectSidebarLinkStyles() {
    if (!document.getElementById('sidebar-link-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'sidebar-link-styles';
        styleElement.textContent = sidebarLinkStyles;
        document.head.appendChild(styleElement);
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    initUserMenu();
    injectSidebarLinkStyles();

    // Highlight current page in sidebar
    highlightCurrentPageAuto();
});

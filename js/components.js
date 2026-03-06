/**
 * BankDash - Component Loader with Fixed Sidebar Container
 */

const BankDash = {
    // Konfigurasi
    config: {
        componentsPath: '../layouts/',
        iconsPath: '../imgs/icons/',
        transitionSpeed: 300
    },

    // Inisialisasi
    init: async function () {
        try {
            this.setupPageTransition();

            document.body.style.opacity = '0';
            document.body.style.transition = `opacity ${this.config.transitionSpeed}ms ease`;

            await this.loadComponents();

            // PERBAIKAN: Setup container setelah sidebar di-load
            this.setupSidebarContainer();

            this.injectMobileElements();
            this.setupSidebarToggle();
            this.setActiveMenu();
            this.updatePageTitle();
            this.initKeyboardShortcuts();
            this.setupNavigationInterception();

            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 50);

        } catch (error) {
            console.error('Failed to load components:', error);
            document.body.style.opacity = '1';
        }
    },

    /**
     * PERBAIKAN: Setup sidebar container dengan lebar dinamis
     */
    setupSidebarContainer: function () {
        const sidebarContainer = document.getElementById('sidebar-container');
        if (!sidebarContainer) return;

        // Di desktop: lebar 64 (w-64)
        // Di mobile: lebar 0 ketika sidebar tersembunyi
        const updateContainerWidth = () => {
            if (window.innerWidth >= 1024) {
                // Desktop: selalu w-64
                sidebarContainer.classList.add('w-64');
                sidebarContainer.classList.remove('w-0');
            } else {
                // Mobile: w-64 ketika sidebar terbuka, w-0 ketika tersembunyi
                const sidebar = sidebarContainer.firstElementChild;
                if (sidebar && sidebar.classList.contains('-translate-x-full')) {
                    sidebarContainer.classList.add('w-0');
                    sidebarContainer.classList.remove('w-64');
                } else {
                    sidebarContainer.classList.add('w-64');
                    sidebarContainer.classList.remove('w-0');
                }
            }
        };

        // Initial update
        updateContainerWidth();

        // Update on resize
        window.addEventListener('resize', updateContainerWidth);

        // Simpan fungsi untuk dipakai di toggle
        this.updateContainerWidth = updateContainerWidth;
    },

    /**
     * Inject tombol hamburger dan overlay
     */
    injectMobileElements: function () {
        if (document.getElementById('menu-toggle')) return;
        if (document.getElementById('overlay')) return;

        // Overlay
        const overlay = document.createElement('div');
        overlay.id = 'overlay';
        overlay.className = 'fixed inset-0 bg-black bg-opacity-50 hidden z-20 lg:hidden';
        document.body.appendChild(overlay);

        // Tombol hamburger
        const menuToggle = document.createElement('button');
        menuToggle.id = 'menu-toggle';
        menuToggle.className = 'lg:hidden fixed top-7 left-4 z-40 p-0 bg-transparent border-none shadow-none hover:opacity-80 transition-opacity';
        menuToggle.innerHTML = `<img src="/imgs/icons/hamburger.png" alt="Menu" class="w-3 h-3">`;
        document.body.appendChild(menuToggle);
    },

    /**
     * PERBAIKAN: Setup toggle sidebar dengan update lebar container
     */
    /**
 * PERBAIKAN: Setup toggle sidebar
 */
    setupSidebarToggle: function () {
    console.log('Setting up sidebar toggle...');

    const sidebar = document.querySelector('#sidebar-container > div');
    const overlay = document.getElementById('overlay');
    const menuToggle = document.getElementById('menu-toggle');

    if (!sidebar || !overlay || !menuToggle) {
        console.error('Sidebar elements not found');
        return;
    }

    const openSidebar = () => {
        sidebar.classList.remove('-translate-x-full');
        sidebar.classList.add('translate-x-0');

        overlay.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    };

    const closeSidebar = () => {
        sidebar.classList.remove('translate-x-0');
        sidebar.classList.add('-translate-x-full');

        overlay.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    };

    const toggleSidebar = () => {
        if (sidebar.classList.contains('-translate-x-full')) {
            openSidebar();
        } else {
            closeSidebar();
        }
    };

    menuToggle.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', closeSidebar);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSidebar();
        }
    });

    console.log('Sidebar toggle ready');
},

    // Load components
    loadComponents: async function () {
        const [header, sidebar] = await Promise.all([
            fetch(this.config.componentsPath + 'header.html').then(res => {
                if (!res.ok) throw new Error('Header not found');
                return res.text();
            }),
            fetch(this.config.componentsPath + 'sidebar.html').then(res => {
                if (!res.ok) throw new Error('Sidebar not found');
                return res.text();
            })
        ]);

        document.getElementById('header-container').innerHTML = header;
        document.getElementById('sidebar-container').innerHTML = sidebar;
    },

    // Set active menu
    setActiveMenu: function () {
        const path = window.location.pathname.toLowerCase();
        let activeMenu = 'dashboard';

        if (path.includes('transactions')) activeMenu = 'transactions';
        else if (path.includes('accounts')) activeMenu = 'accounts';
        else if (path.includes('investments')) activeMenu = 'investments';
        else if (path.includes('credit-cards')) activeMenu = 'credit-cards';
        else if (path.includes('loans')) activeMenu = 'loans';
        else if (path.includes('services')) activeMenu = 'services';
        else if (path.includes('privileges')) activeMenu = 'privileges';
        else if (path.includes('setting')) activeMenu = 'setting';

        const menuItems = document.querySelectorAll('[data-menu-id]');

        menuItems.forEach(item => {
            item.classList.remove('text-[#1814F3]', 'bg-[#F0F2F9]', 'active');
            item.classList.add('text-[#B1B1B1]');

            const normalIcon = item.querySelector('.normal-icon');
            const activeIcon = item.querySelector('.active-icon');
            const activeLine = item.querySelector('.active-line');

            if (normalIcon) normalIcon.classList.remove('hidden');
            if (activeIcon) activeIcon.classList.add('hidden');
            if (activeLine) activeLine.classList.add('hidden');

            if (item.getAttribute('data-menu-id') === activeMenu) {
                item.classList.remove('text-[#B1B1B1]');
                item.classList.add('text-[#1814F3]', 'bg-[#F0F2F9]', 'active');

                if (normalIcon) normalIcon.classList.add('hidden');
                if (activeIcon) activeIcon.classList.remove('hidden');
                if (activeLine) activeLine.classList.remove('hidden');
            }
        });
    },

    // Update page title
    updatePageTitle: function () {
        const path = window.location.pathname.toLowerCase();
        const fileName = path.split('/').pop().replace('.html', '');

        const titles = {
            'index': 'Overview',
            'transactions': 'Transactions',
            'accounts': 'Accounts',
            'investments': 'Investments',
            'credit-cards': 'Credit Cards',
            'loans': 'Loans',
            'services': 'Services',
            'privileges': 'My Privileges',
            'setting': 'Settings'
        };

        const title = titles[fileName] || 'Overview';

        const titleElement = document.getElementById('page-title');
        if (titleElement) titleElement.textContent = title;

        document.title = 'BankDash - ' + title;
    },

    // Keyboard shortcuts
    initKeyboardShortcuts: function () {
        document.addEventListener('keydown', function (e) {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.querySelector('input[type="text"]');
                if (searchInput) {
                    searchInput.focus();
                    searchInput.classList.add('ring-2', 'ring-blue-500');
                }
            }

            if (e.key === 'Escape') {
                const searchInput = document.querySelector('input[type="text"]');
                if (searchInput) {
                    searchInput.classList.remove('ring-2', 'ring-blue-500');
                    searchInput.blur();
                }
            }
        });
    },

    // Setup page transition
    setupPageTransition: function () {
        if (document.getElementById('page-transition-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'page-transition-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: #F5F7FA;
            z-index: 9999;
            pointer-events: none;
            opacity: 0;
            transition: opacity ${this.config.transitionSpeed}ms ease;
        `;
        document.body.appendChild(overlay);
    },

    // Setup navigation interception
    setupNavigationInterception: function () {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;

            const href = link.getAttribute('href');

            if (!href ||
                href.startsWith('http') ||
                href.startsWith('#') ||
                href === '' ||
                href.startsWith('javascript:') ||
                link.target === '_blank') {
                return;
            }

            e.preventDefault();
            this.navigateTo(href);
        });

        window.addEventListener('popstate', () => {
            const path = window.location.pathname;
            this.loadPage(path, false);
        });
    },

    // Navigate to page
    navigateTo: function (url) {
        this.showTransitionOverlay();
        setTimeout(() => {
            window.location.href = url;
        }, this.config.transitionSpeed);
    },

    // Show transition overlay
    showTransitionOverlay: function () {
        const overlay = document.getElementById('page-transition-overlay');
        if (overlay) {
            overlay.style.opacity = '1';
        }
    },

    // Hide transition overlay
    hideTransitionOverlay: function () {
        const overlay = document.getElementById('page-transition-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
        }
    }
};

// Jalankan saat DOM siap
document.addEventListener('DOMContentLoaded', () => BankDash.init());
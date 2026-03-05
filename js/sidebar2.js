/**
 * Sidebar JavaScript - BankDash
 * Menangani interaktivitas sidebar (toggle, active menu, dll)
 */

document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const menuToggle = document.getElementById('menu-toggle');
    const menuItems = document.querySelectorAll('.menu-item');

    // Fungsi untuk membuka sidebar
    function openSidebar() {
        sidebar.classList.remove('-translate-x-full');
        overlay.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    }

    // Fungsi untuk menutup sidebar
    function closeSidebar() {
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }

    // Toggle sidebar saat tombol menu diklik
    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            if (sidebar.classList.contains('-translate-x-full')) {
                openSidebar();
            } else {
                closeSidebar();
            }
        });
    }

    // Tutup sidebar saat overlay diklik
    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }

    // Cegah klik di dalam sidebar menutup sidebar
    sidebar.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Tutup sidebar dengan tombol Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !sidebar.classList.contains('-translate-x-full') && window.innerWidth < 1024) {
            closeSidebar();
        }
    });

    // Handle resize window
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 1024) {
            sidebar.classList.remove('-translate-x-full');
            overlay.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        } else {
            sidebar.classList.add('-translate-x-full');
        }
    });

    // Set active menu berdasarkan halaman saat ini
    function setActiveMenu() {
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

        menuItems.forEach(item => {
            // Reset semua
            item.classList.remove('active');
            
            // Aktifkan yang sesuai
            if (item.getAttribute('data-menu-id') === activeMenu) {
                item.classList.add('active');
            }
        });
    }

    // Panggil setActiveMenu
    setActiveMenu();

    // Update page title jika ada elemen page-title
    const titleElement = document.getElementById('page-title');
    if (titleElement) {
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
        titleElement.textContent = titles[fileName] || 'Overview';
    }

    console.log('Sidebar initialized');
});
/**
 * Sidebar functionality for BankDash
 * Menangani toggle sidebar di mobile dan active state menu
 */

// Tunggu sampai DOM siap
document.addEventListener('DOMContentLoaded', function() {
    
    // ========== SIDEBAR TOGGLE (MOBILE) ==========
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const menuToggle = document.getElementById('menu-toggle');
    
    // Cek apakah elemen-elemen yang diperlukan ada
    if (!sidebar || !overlay || !menuToggle) {
        console.error('Sidebar elements not found!');
        return;
    }
    
    // Fungsi untuk membuka sidebar
    function openSidebar() {
        sidebar.classList.remove('-translate-x-full');
        overlay.classList.remove('hidden');
        document.body.classList.add('overflow-hidden'); // Mencegah scroll di belakang overlay
    }
    
    // Fungsi untuk menutup sidebar
    function closeSidebar() {
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }
    
    // Event listener untuk tombol menu
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        if (sidebar.classList.contains('-translate-x-full')) {
            openSidebar();
        } else {
            closeSidebar();
        }
    });
    
    // Event listener untuk overlay (klik di luar sidebar)
    overlay.addEventListener('click', closeSidebar);
    
    // Mencegah klik di dalam sidebar menutup sidebar
    sidebar.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // ========== ACTIVE MENU STATE ==========
    // Menentukan menu mana yang aktif berdasarkan URL atau halaman saat ini
    
    // Ambil path dari URL (contoh: /pages/transactions.html)
    const currentPath = window.location.pathname;
    
    // Cari semua menu items
    const menuItems = document.querySelectorAll('.menu-item');
    
    // Fungsi untuk mengatur active menu
    function setActiveMenu(menuId) {
        // Hapus class active dari semua menu
        menuItems.forEach(item => {
            item.classList.remove('active');
        });
        
        // Tambahkan class active ke menu yang sesuai
        const activeMenu = document.querySelector(`.menu-item[data-menu-id="${menuId}"]`);
        if (activeMenu) {
            activeMenu.classList.add('active');
        }
    }
    
    // Tentukan menu aktif berdasarkan URL
    menuItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href && currentPath.includes(href)) {
            item.classList.add('active');
        }
        
        // Tambahkan event listener untuk klik
        item.addEventListener('click', function(e) {
            // Jika ini link yang valid dan bukan di halaman yang sama
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                // Biarkan link bekerja normal (navigasi ke halaman lain)
                // Active state akan diatur saat halaman baru dimuat
                return;
            }
            
            // Untuk demo/preview, kita bisa set active manual
            e.preventDefault(); // Hanya untuk demo
            
            // Hapus active dari semua menu
            menuItems.forEach(menu => {
                menu.classList.remove('active');
            });
            
            // Tambah active ke menu yang diklik
            this.classList.add('active');
            
            // Tutup sidebar di mobile setelah klik menu
            if (window.innerWidth < 1024) { // lg breakpoint
                closeSidebar();
            }
        });
    });
    
    // ========== RESPONSIVE HANDLING ==========
    // Menangani perubahan ukuran layar
    
    function handleResize() {
        if (window.innerWidth >= 1024) { // lg breakpoint
            // Di desktop, pastikan sidebar terlihat
            sidebar.classList.remove('-translate-x-full');
            overlay.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        } else {
            // Di mobile, pastikan sidebar tersembunyi secara default
            sidebar.classList.add('-translate-x-full');
            overlay.classList.add('hidden');
        }
    }
    
    // Jalankan saat pertama kali load
    handleResize();
    
    // Jalankan saat window diresize
    window.addEventListener('resize', handleResize);
    
    // ========== KEYBOARD ACCESSIBILITY ==========
    // Menutup sidebar dengan tombol Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && 
            !sidebar.classList.contains('-translate-x-full') && 
            window.innerWidth < 1024) {
            closeSidebar();
        }
    });
    
    console.log('Sidebar initialized successfully!');
});
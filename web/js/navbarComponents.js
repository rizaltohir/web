// Dropdown Menu Functionality
class DropdownManager {
    constructor() {
        this.dropdownButton = document.getElementById('more-menu');
        this.dropdownContent = document.getElementById('more-menu-content');
        this.init();
    }

    init() {
        if (!this.dropdownButton || !this.dropdownContent) return;

        this.dropdownButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.dropdownContent.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.dropdownButton.contains(e.target)) {
                this.dropdownContent.classList.remove('show');
            }
        });
    }
}

// Theme Toggle Functionality
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.isDarkMode = localStorage.getItem('darkMode') === 'true';
        this.init();
    }

    init() {
        // Set initial theme
        this.setTheme(this.isDarkMode);

        // Add event listener
        this.themeToggle?.addEventListener('click', () => {
            this.isDarkMode = !this.isDarkMode;
            this.setTheme(this.isDarkMode);
            localStorage.setItem('darkMode', this.isDarkMode);
        });
    }

    setTheme(isDark) {
        if (!this.themeToggle) return;
        const icon = this.themeToggle.querySelector('i');
        if (isDark) {
            document.body.classList.add('dark-mode');
            icon?.classList.replace('fa-moon', 'fa-sun');
        } else {
            document.body.classList.remove('dark-mode');
            icon?.classList.replace('fa-sun', 'fa-moon');
        }
    }
}

// Notification System
class NotificationSystem {
    constructor() {
        this.bell = document.getElementById('notification-bell');
        this.badge = this.bell.querySelector('.notification-badge');
        this.notifications = [];
        this.init();
    }

    init() {
        this.bell.addEventListener('click', () => this.showNotifications());
        this.checkNewNotifications();
    }

    async checkNewNotifications() {
        try {
            // Simulate fetching notifications from server
            const response = await this.fetchNotifications();
            this.updateBadge(response.length);
            this.notifications = response;
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    }

    async fetchNotifications() {
        // Simulasi data notifikasi
        return [
            {
                id: 1,
                message: 'Proyek baru ditambahkan di wilayah Anda',
                time: '5 menit yang lalu'
            }
        ];
    }

    updateBadge(count) {
        this.badge.textContent = count;
        this.badge.style.display = count > 0 ? 'block' : 'none';
    }

    showNotifications() {
        const existingPopup = document.querySelector('.notification-popup');
        if (existingPopup) {
            existingPopup.remove();
            return;
        }

        const popup = document.createElement('div');
        popup.className = 'notification-popup';
        popup.innerHTML = `
            <div class="notification-header">
                <h3>Notifikasi</h3>
                <button class="close-notifications">×</button>
            </div>
            <div class="notification-list">
                ${this.notifications.length ? 
                    this.notifications.map(notif => `
                        <div class="notification-item">
                            <i class="fas fa-info-circle"></i>
                            <div class="notification-content">
                                <p>${notif.message}</p>
                                <small>${notif.time}</small>
                            </div>
                        </div>
                    `).join('') : 
                    '<p class="no-notifications">Tidak ada notifikasi baru</p>'
                }
            </div>
        `;

        this.bell.appendChild(popup);

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!popup.contains(e.target) && !this.bell.contains(e.target)) {
                popup.remove();
            }
        });

        // Close button
        popup.querySelector('.close-notifications').addEventListener('click', () => {
            popup.remove();
        });
    }
}

// Search Functionality
class SearchManager {
    constructor() {
        this.searchInput = document.getElementById('search-input');
        this.searchTimeout = null;
        this.isMobile = window.innerWidth <= 768;
        this.init();
        this.setupMobileSearch();
    }

    init() {
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => {
                    this.handleSearch(e.target.value);
                }, 300);
            });

            this.searchInput.addEventListener('focus', () => {
                this.searchInput.parentElement.classList.add('focused');
            });

            this.searchInput.addEventListener('blur', () => {
                this.searchInput.parentElement.classList.remove('focused');
            });
        }
    }

    setupMobileSearch() {
        if (this.isMobile) {
            // Create mobile search trigger button
            const searchTrigger = document.createElement('button');
            searchTrigger.className = 'mobile-search-trigger';
            searchTrigger.innerHTML = '<i class="fas fa-search"></i>';
            document.body.appendChild(searchTrigger);

            // Create mobile search overlay
            const searchOverlay = document.createElement('div');
            searchOverlay.className = 'mobile-search-overlay';
            searchOverlay.innerHTML = `
                <div class="mobile-search-header">
                    <input type="text" class="mobile-search-box" placeholder="Cari proyek...">
                    <button class="mobile-search-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            document.body.appendChild(searchOverlay);

            // Setup event listeners
            const mobileSearchBox = searchOverlay.querySelector('.mobile-search-box');
            const closeButton = searchOverlay.querySelector('.mobile-search-close');

            searchTrigger.addEventListener('click', () => {
                searchOverlay.classList.add('active');
                mobileSearchBox.focus();
            });

            closeButton.addEventListener('click', () => {
                searchOverlay.classList.remove('active');
            });

            mobileSearchBox.addEventListener('input', (e) => {
                clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => {
                    this.handleSearch(e.target.value);
                }, 300);
            });
        }
    }

    async handleSearch(query) {
        if (!query.trim()) return;

        try {
            const results = await this.searchProjects(query);
            this.showSearchResults(results);
        } catch (error) {
            console.error('Error searching projects:', error);
        }
    }

    async searchProjects(query) {
        // Implementasi pencarian proyek akan ditambahkan nanti
        return [];
    }

    showSearchResults(results) {
        // Implementasi menampilkan hasil pencarian akan ditambahkan nanti
    }
}

    async handleSearch(query) {
        if (!query.trim()) return;

        try {
            // Simulasi pencarian
            const results = await this.searchProjects(query);
            this.showSearchResults(results);
        } catch (error) {
            console.error('Error searching projects:', error);
        }
    }

    async searchProjects(query) {
        // Implementasi pencarian proyek akan ditambahkan nanti
        return [];
    }

    showSearchResults(results) {
        // Implementasi menampilkan hasil pencarian akan ditambahkan nanti
    }
}

// User Menu
class UserMenuManager {
    constructor() {
        this.userMenu = document.getElementById('user-menu');
        this.init();
    }

    init() {
        this.renderUserMenu();
        this.setupEventListeners();
    }

    renderUserMenu() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        
        if (isLoggedIn) {
            const userData = JSON.parse(localStorage.getItem('userData')) || {};
            this.userMenu.innerHTML = `
                <div class="user-profile">
                    <img src="${userData.avatar || 'images/default-avatar.png'}" alt="User Avatar" class="user-avatar">
                    <div class="user-dropdown">
                        <div class="user-info">
                            <strong>${userData.name || 'Pengguna'}</strong>
                            <small>${userData.email || ''}</small>
                        </div>
                        <div class="dropdown-divider"></div>
                        <a href="profile.html" class="dropdown-item">
                            <i class="fas fa-user"></i> Profil Saya
                        </a>
                        <a href="settings.html" class="dropdown-item">
                            <i class="fas fa-cog"></i> Pengaturan
                        </a>
                        <div class="dropdown-divider"></div>
                        <button class="dropdown-item text-danger" id="logout-button">
                            <i class="fas fa-sign-out-alt"></i> Keluar
                        </button>
                    </div>
                </div>
            `;
        } else {
            this.userMenu.innerHTML = `
                <div class="auth-buttons">
                    <a href="login.html" class="nav-button">
                        <i class="fas fa-sign-in-alt"></i>
                        <span>Masuk</span>
                    </a>
                </div>
            `;
        }
    }

    setupEventListeners() {
        const userProfile = this.userMenu.querySelector('.user-profile');
        if (userProfile) {
            userProfile.addEventListener('click', () => {
                userProfile.classList.toggle('active');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!userProfile.contains(e.target)) {
                    userProfile.classList.remove('active');
                }
            });

            // Logout handler
            const logoutButton = this.userMenu.querySelector('#logout-button');
            if (logoutButton) {
                logoutButton.addEventListener('click', () => {
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('userData');
                    window.location.href = 'login.html';
                });
            }
        }
    }
}

// Initialize all components
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new NotificationSystem();
    new DropdownManager();
    new UserMenuManager();
});

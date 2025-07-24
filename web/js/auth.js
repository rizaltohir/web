// File: web/js/auth.js

/**
 * Mengambil token otentikasi dari Local Storage.
 * @returns {string|null} Token atau null jika tidak ada.
 */
function getAuthToken() {
    return localStorage.getItem('auth_token');
}

/**
 * Mengambil data pengguna dari Local Storage.
 * @returns {object|null} Objek data pengguna atau null jika tidak ada.
 */
function getUserData() {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
}

/**
 * Memeriksa apakah pengguna sudah login.
 * @returns {boolean} True jika login, false jika tidak.
 */
function isLoggedIn() {
    return getAuthToken() !== null;
}

/**
 * Membuat header HTTP yang diperlukan untuk permintaan yang aman.
 * Termasuk 'Authorization' header dengan Bearer Token.
 * @returns {object} Objek headers.
 */
function createAuthHeaders() {
    const token = getAuthToken();
    if (!token) {
        console.error('Token otentikasi tidak ditemukan. Pengguna mungkin belum login.');
        // Jika tidak ada token, kita hanya kirim header standar
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
    }
    
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}` // Header otentikasi yang penting!
    };
}

/**
 * Menghapus data sesi dari Local Storage saat logout.
 */
function logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    // Arahkan ke halaman utama setelah logout
    window.location.href = 'index.html';
}

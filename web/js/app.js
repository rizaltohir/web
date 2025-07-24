// File: web/js/app.js

document.addEventListener('DOMContentLoaded', function() {

    // --- 1. Ambil semua elemen penting dari halaman ---
    const projectListContainer = document.getElementById('project-list');
    const navigationBar = document.getElementById('navigation-bar');
    const addProjectButtonContainer = document.getElementById('add-project-button-container');
    const mapContainer = document.getElementById('map');

    // --- 2. Logika untuk Menampilkan UI Berdasarkan Status Login ---
    // Fungsi ini akan mengatur tombol apa yang muncul di kanan atas.
    function setupNavigationBar() {
        if (isLoggedIn()) {
            const user = getUserData();
            // Jika login, tampilkan nama dan tombol logout
            navigationBar.innerHTML = `
                <span>Selamat datang, <strong>${user.name}</strong>!</span>
                <button id="logout-button" class="button-danger" style="margin-left: 10px;">Logout</button>
            `;
            // Tampilkan juga tombol untuk menambah proyek
            addProjectButtonContainer.innerHTML = `
                <a href="tambah-proyek.html" class="button-primary" style="margin-bottom: 20px;">Tambah Proyek Baru</a>
            `;

            // Tambahkan fungsi ke tombol logout
            document.getElementById('logout-button').addEventListener('click', function() {
                fetch('http://127.0.0.1:8000/api/logout', { 
                    method: 'POST', 
                    headers: createAuthHeaders( ) 
                })
                .finally(() => {
                    // Apapun hasilnya, logout dari sisi klien
                    logout();
                });
            });
        } else {
            // Jika tidak login, tampilkan tombol Login dan Register
            navigationBar.innerHTML = `
                <a href="login.html" class="button-primary">Login</a>
                <a href="register.html" style="margin-left: 10px;">Register</a>
            `;
            addProjectButtonContainer.innerHTML = ''; // Kosongkan tombol tambah proyek
        }
    }

    // --- 3. Logika untuk Inisialisasi Peta ---
    // Fungsi ini membuat peta dasar.
    function initializeMap() {
        // Cek jika elemen peta ada sebelum membuat peta
        if (!mapContainer) return null;

        // Tentukan koordinat tengah (misal: Tugu Yogyakarta) dan level zoom
        const map = L.map('map').setView([-7.78278, 110.36722], 11); // Zoom sedikit diperlebar

        // Tambahkan 'tile layer' (gambar peta dasar) dari OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        } ).addTo(map);

        return map; // Kembalikan objek peta agar bisa digunakan nanti
    }

    // --- 4. Logika untuk Mengambil dan Menampilkan Data ---
    // Fungsi ini mengambil data dari API dan menampilkannya di daftar & peta.
    function fetchAndDisplayProjects(map) {
        fetch('http://127.0.0.1:8000/api/projects' )
            .then(response => {
                if (!response.ok) throw new Error('Gagal memuat proyek.');
                return response.json();
            })
            .then(projects => {
                projectListContainer.innerHTML = ''; // Kosongkan pesan "Memuat..."
                if (projects.length === 0) {
                    projectListContainer.innerHTML = '<p>Saat ini belum ada proyek yang tersedia.</p>';
                    return;
                }

                projects.forEach(project => {
                    // Bagian A: Tampilkan proyek di daftar di bawah peta
                    const projectCard = document.createElement('div');
                    projectCard.className = 'project-card';
                    projectCard.innerHTML = `
                        <h3><a href="detail-proyek.html?id=${project.id}">${project.title}</a></h3>
                        <p class="location">${project.location}</p>
                        <p>${project.description}</p>
                        <p><strong>Status:</strong> ${project.status}</p>
                    `;
                    projectListContainer.appendChild(projectCard);

                    // Bagian B: Tampilkan proyek sebagai marker di peta
                    // Hanya jalankan jika peta berhasil dibuat dan proyek punya koordinat
                    if (map && project.latitude && project.longitude) {
                        const marker = L.marker([project.latitude, project.longitude]).addTo(map);
                        
                        // Tambahkan popup yang akan muncul saat marker diklik
                        marker.bindPopup(`
                            <strong>${project.title}</strong>  

                            ${project.location}  

                            <a href="detail-proyek.html?id=${project.id}">Lihat Detail</a>
                        `);
                    }
                });
            })
            .catch(error => {
                console.error('Error:', error);
                projectListContainer.innerHTML = `<p style="color: red;">${error.message}</p>`;
            });
    }

    // --- 5. Jalankan Semua Fungsi ---
    setupNavigationBar();
    const map = initializeMap();
    fetchAndDisplayProjects(map);

});

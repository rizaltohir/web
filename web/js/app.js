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

        // Inisialisasi peta dengan opsi kontrol
        const map = L.map('map', {
            center: [-2.548926, 118.014863], // Posisi default di tengah Indonesia
            zoom: 5,
            zoomControl: false, // Nonaktifkan kontrol zoom default
            minZoom: 4, // Batasi zoom minimum
            maxZoom: 18 // Batasi zoom maximum
        });

        // Tambahkan 'tile layer' (gambar peta dasar) dari OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Tambahkan kontrol zoom kustom
        L.control.zoom({
            position: 'bottomright',
            zoomInText: '+',
            zoomOutText: '-',
            zoomInTitle: 'Perbesar',
            zoomOutTitle: 'Perkecil'
        }).addTo(map);

        // Tambahkan skala peta
        L.control.scale({
            position: 'bottomleft',
            imperial: false, // Hanya tampilkan skala metrik
            maxWidth: 200
        }).addTo(map);

        // Tambahkan tombol lokasi saat ini
        L.control.locate({
            position: 'bottomright',
            strings: {
                title: 'Tunjukkan lokasi saya'
            },
            locateOptions: {
                enableHighAccuracy: true
            }
        }).addTo(map);

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

                // Konversi status dan kategori ke bahasa Indonesia
                const statusMap = {
                    'preparation': 'Persiapan',
                    'ongoing': 'Sedang Berjalan',
                    'completed': 'Selesai'
                };

                const categoryMap = {
                    'environment': 'Lingkungan',
                    'social': 'Sosial',
                    'education': 'Pendidikan',
                    'health': 'Kesehatan',
                    'culture': 'Budaya',
                    'technology': 'Teknologi',
                    'other': 'Lainnya'
                };

                projects.forEach(project => {
                    // Format tanggal
                    const startDate = project.start_date ? new Date(project.start_date).toLocaleDateString('id-ID') : 'Belum ditentukan';
                    
                    // Generate tags HTML
                    const tagsHtml = Array.isArray(project.tags) && project.tags.length > 0
                        ? `<div class="project-tags">
                            ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                           </div>`
                        : '';

                    // Bagian A: Tampilkan proyek di daftar di bawah peta
                    const projectCard = document.createElement('div');
                    projectCard.className = 'project-card';
                    projectCard.innerHTML = `
                        <h3><a href="detail-proyek.html?id=${project.id}">${project.title}</a></h3>
                        <div class="project-meta">
                            <span class="category-badge">${categoryMap[project.category] || 'Kategori tidak diset'}</span>
                            <span class="status-badge status-${project.status}">${statusMap[project.status] || 'Status tidak diset'}</span>
                        </div>
                        ${tagsHtml}
                        <p class="location">${project.location}</p>
                        <p class="description">${project.description.length > 200 ? 
                            project.description.substring(0, 200) + '...' : 
                            project.description}</p>
                        <div class="project-card-footer">
                            <span>Mulai: ${startDate}</span>
                        </div>
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

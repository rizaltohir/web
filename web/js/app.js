// File: web/js/app.js

document.addEventListener('DOMContentLoaded', function( ) {

    const projectListContainer = document.getElementById('project-list');
    const navigationBar = document.getElementById('navigation-bar');
    const addProjectButtonContainer = document.getElementById('add-project-button-container');

    // --- Logika untuk Menampilkan UI Berdasarkan Status Login ---
    if (isLoggedIn()) {
        const user = getUserData();
        // Tampilkan info pengguna dan tombol logout
        navigationBar.innerHTML = `
            <span>Selamat datang, <strong>${user.name}</strong>!</span>
            <button id="logout-button" class="button-danger" style="margin-left: 10px;">Logout</button>
        `;
        // Tampilkan tombol Tambah Proyek
        addProjectButtonContainer.innerHTML = `
            <a href="tambah-proyek.html" class="button-primary" style="margin-bottom: 20px;">Tambah Proyek Baru</a>
        `;

        // Tambahkan event listener untuk tombol logout
        document.getElementById('logout-button').addEventListener('click', function() {
            const token = getAuthToken();
            // Panggil API logout di server
            fetch('http://127.0.0.1:8000/api/logout', {
                method: 'POST',
                headers: createAuthHeaders( )
            })
            .finally(() => {
                // Apapun respons server, hapus data di sisi klien dan redirect
                logout();
            });
        });

    } else {
        // Jika belum login, tampilkan tombol Login dan Register
        navigationBar.innerHTML = `
            <a href="login.html" class="button-primary">Login</a>
            <a href="register.html" style="margin-left: 10px;">Register</a>
        `;
    }

    // --- Logika untuk Mengambil dan Menampilkan Daftar Proyek (Tetap Sama) ---
    fetch('http://127.0.0.1:8000/api/projects' )
        .then(response => {
            if (!response.ok) throw new Error('Gagal memuat proyek.');
            return response.json();
        })
        .then(projects => {
            projectListContainer.innerHTML = '';
            if (projects.length === 0) {
                projectListContainer.innerHTML = '<p>Saat ini belum ada proyek yang tersedia.</p>';
                return;
            }
            projects.forEach(project => {
                const projectCard = document.createElement('div');
                projectCard.className = 'project-card';
                projectCard.innerHTML = `
                    <h3><a href="detail-proyek.html?id=${project.id}">${project.title}</a></h3>
                    <p class="location">${project.location}</p>
                    <p>${project.description}</p>
                    <p><strong>Status:</strong> ${project.status}</p>
                `;
                projectListContainer.appendChild(projectCard);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            projectListContainer.innerHTML = `<p style="color: red;">${error.message}</p>`;
        });
});

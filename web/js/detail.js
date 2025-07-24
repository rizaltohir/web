// File: web/js/detail.js

document.addEventListener('DOMContentLoaded', function() {
    const detailContainer = document.getElementById('project-detail-container');
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('id');

    if (!projectId) {
        detailContainer.innerHTML = '<p style="color: red;">Error: ID Proyek tidak ditemukan di URL.</p>';
        return;
    }

    const apiUrl = `http://127.0.0.1:8000/api/projects/${projectId}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error('Proyek tidak ditemukan atau terjadi kesalahan.');
            return response.json();
        })
        .then(project => {
            document.title = `${project.title} - SatuBumi`;
            const goalAmountFormatted = project.goal_amount
                ? new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0
                  }).format(project.goal_amount)
                : 'Tidak ada target donasi';

            // --- LOGIKA OTORISASI DI FRONTEND ---
            let actionButtons = '';
            const currentUser = getUserData(); // Ambil data pengguna yang sedang login

            // Tampilkan tombol HANYA jika pengguna sudah login DAN ID-nya sama dengan ID pemilik proyek
            if (isLoggedIn() && currentUser && currentUser.id === project.user_id) {
                actionButtons = `
                    <hr>
                    <div class="action-buttons">
                        <a href="edit-proyek.html?id=${project.id}" class="button-primary">Edit Proyek</a>
                        <button id="delete-button" class="button-danger">Hapus Proyek Ini</button>
                    </div>
                `;
            }

            detailContainer.innerHTML = `
                <h1>${project.title}</h1>
                <p class="location" style="font-style: italic; color: #666;">
                  Lokasi: ${project.location}
                </p>
                <hr>
                <p>${project.description.replace(/\n/g, '<br>')}</p>
                <hr>
                <p><strong>Status Proyek:</strong> ${project.status || 'N/A'}</p>
                <p><strong>Target Donasi:</strong> ${goalAmountFormatted}</p>
                <small>Diperbarui pada: ${new Date(project.updated_at).toLocaleDateString('id-ID')}</small>
                ${actionButtons}
            `;

            // Tambahkan event listener HANYA jika tombol hapus ada di halaman
            if (isLoggedIn() && currentUser && currentUser.id === project.user_id) {
                const deleteButton = document.getElementById('delete-button');
                deleteButton.addEventListener('click', function() {
                    if (confirm('Apakah Anda yakin ingin menghapus proyek ini? Aksi ini tidak dapat dibatalkan.')) {
                        fetch(apiUrl, {
                            method: 'DELETE',
                            headers: createAuthHeaders()
                        })
                        .then(response => {
                            if (response.ok) {
                                alert('Proyek berhasil dihapus!');
                                window.location.href = 'index.html';
                            } else {
                                // Tangani error dari server (misal: 403 Forbidden)
                                return response.json().then(err => { throw err; });
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            alert(error.message || 'Gagal menghapus proyek.');
                        });
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            detailContainer.innerHTML = `<p style="color: red;">${error.message}</p>`;
        });
});

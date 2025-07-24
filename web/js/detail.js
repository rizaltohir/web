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

            // Konversi status ke bahasa Indonesia
            const statusMap = {
                'preparation': 'Persiapan',
                'ongoing': 'Sedang Berjalan',
                'completed': 'Selesai'
            };

            // Konversi kategori ke bahasa Indonesia
            const categoryMap = {
                'environment': 'Lingkungan',
                'social': 'Sosial',
                'education': 'Pendidikan',
                'health': 'Kesehatan',
                'culture': 'Budaya',
                'technology': 'Teknologi',
                'other': 'Lainnya'
            };

            // Format tanggal ke bahasa Indonesia
            const formatDate = (dateString) => {
                if (!dateString) return 'Belum ditentukan';
                return new Date(dateString).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            };

            // Generate tags HTML
            const tagsHtml = Array.isArray(project.tags) && project.tags.length > 0
                ? `<div class="project-tags">
                    ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                   </div>`
                : '';

            detailContainer.innerHTML = `
                <h1>${project.title}</h1>
                <p class="location" style="font-style: italic; color: #666;">
                    Lokasi: ${project.location}
                </p>
                
                <div class="project-meta">
                    <span class="category-badge">${categoryMap[project.category] || 'Kategori tidak diset'}</span>
                    <span class="status-badge status-${project.status}">${statusMap[project.status] || 'Status tidak diset'}</span>
                </div>

                ${tagsHtml}
                
                <div id="map" style="height: 400px; margin: 20px 0; border: 2px solid #ddd; border-radius: 8px;"></div>
                
                <hr>
                <div class="project-description">
                    <h2>Deskripsi Proyek</h2>
                    <p>${project.description.replace(/\n/g, '<br>')}</p>
                </div>
                
                <hr>
                <div class="project-details">
                    <h2>Detail Proyek</h2>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <strong>Status:</strong>
                            <span class="status-badge status-${project.status}">${statusMap[project.status] || 'Belum diset'}</span>
                        </div>
                        <div class="detail-item">
                            <strong>Kategori:</strong>
                            <span>${categoryMap[project.category] || 'Belum diset'}</span>
                        </div>
                        <div class="detail-item">
                            <strong>Tanggal Mulai:</strong>
                            <span>${formatDate(project.start_date)}</span>
                        </div>
                        <div class="detail-item">
                            <strong>Perkiraan Selesai:</strong>
                            <span>${formatDate(project.end_date)}</span>
                        </div>
                        <div class="detail-item">
                            <strong>Target Donasi:</strong>
                            <span>${goalAmountFormatted}</span>
                        </div>
                    </div>
                </div>

                <div class="project-footer">
                    <small>Dibuat pada: ${formatDate(project.created_at)}</small>
                    <br>
                    <small>Terakhir diperbarui: ${formatDate(project.updated_at)}</small>
                </div>

                ${actionButtons}
            `;

            // Inisialisasi peta setelah container HTML dibuat
            const map = L.map('map').setView([project.latitude, project.longitude], 13);
            
            // Tambahkan layer peta
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            // Tambahkan marker dengan popup
            L.marker([project.latitude, project.longitude])
                .addTo(map)
                .bindPopup('<strong>' + project.title + '</strong><br>' + project.location)
                .openPopup();

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

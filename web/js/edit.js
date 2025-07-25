// File: web/js/edit.js

if (!isLoggedIn()) {
    alert('Anda harus login untuk mengedit proyek.');
    window.location.href = 'login.html';
}

// Utility functions for handling loading and errors
function showLoading(container, message = 'Memuat...') {
    container.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <p>${message}</p>
        </div>
    `;
}

function showError(container, message) {
    container.innerHTML = `
        <div class="error-message">
            ${message}
        </div>
    `;
}

function showSuccess(container, message) {
    container.innerHTML = `
        <div class="success-message">
            ${message}
        </div>
    `;
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Force reflow
    toast.offsetHeight;

    // Show toast
    toast.classList.add('show');

    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function() {
    const projectForm = document.getElementById('form-edit-proyek');
    const messageContainer = document.getElementById('message-container');
    const backLink = document.getElementById('back-link');
    const locationInput = document.getElementById('location');
    const latitudeInput = document.getElementById('latitude');
    const longitudeInput = document.getElementById('longitude');
    
    // Map initialization
    const searchInput = document.getElementById('search-location');
    const searchButton = document.getElementById('search-button');
    const searchResults = document.getElementById('search-results');
    
    // Inisialisasi peta dengan opsi kontrol
    const map = L.map('map', {
        center: [-2.548926, 118.014863],
        zoom: 5,
        zoomControl: false,
        minZoom: 4,
        maxZoom: 18
    });
    
    // Tambahkan layer peta
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
        imperial: false,
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

    // Variabel untuk menyimpan marker
    let marker;
    
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('id');

    if (!projectId) {
        document.body.innerHTML = '<p style="color: red;">Error: ID Proyek tidak ditemukan.</p>';
        return;
    }

    const apiUrl = `http://127.0.0.1:8000/api/projects/${projectId}`;
    backLink.href = `detail-proyek.html?id=${projectId}`;

    // 1. Mengisi form dengan data yang ada
    // Tags functions
    function updateTags() {
        tagsContainer.innerHTML = '';
        tags.forEach((tag, index) => {
            const tagElement = document.createElement('span');
            tagElement.className = 'tag';
            tagElement.innerHTML = `
                ${tag}
                <button type="button" class="remove-tag" data-index="${index}">&times;</button>
            `;
            tagsContainer.appendChild(tagElement);
        });
        tagsHiddenInput.value = JSON.stringify(tags);
    }

    // Setup tags event listeners
    tagsInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const tag = this.value.trim().toLowerCase();
            if (tag && !tags.includes(tag)) {
                tags.push(tag);
                updateTags();
                this.value = '';
            }
        }
    });

    tagsContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-tag')) {
            const index = parseInt(e.target.dataset.index);
            tags.splice(index, 1);
            updateTags();
        }
    });

    // Date validation
    const startDateInput = document.getElementById('start_date');
    const endDateInput = document.getElementById('end_date');

    startDateInput.addEventListener('change', function() {
        endDateInput.min = this.value;
        if (endDateInput.value && endDateInput.value < this.value) {
            endDateInput.value = this.value;
            showToast('Tanggal selesai disesuaikan dengan tanggal mulai', 'warning');
        }
    });

    endDateInput.addEventListener('change', function() {
        if (this.value < startDateInput.value) {
            this.value = startDateInput.value;
            showToast('Tanggal selesai tidak boleh lebih awal dari tanggal mulai', 'warning');
        }
    });

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error('Gagal memuat data proyek.');
            return response.json();
        })
        .then(project => {
            document.getElementById('title').value = project.title;
            document.getElementById('description').value = project.description;
            document.getElementById('category').value = project.category || '';
            tags = Array.isArray(project.tags) ? project.tags : [];
            updateTags();
            document.getElementById('status').value = project.status || 'preparation';
            document.getElementById('start_date').value = project.start_date || '';
            document.getElementById('end_date').value = project.end_date || '';
            locationInput.value = project.location;
            latitudeInput.value = project.latitude;
            longitudeInput.value = project.longitude;
            document.getElementById('goal_amount').value = project.goal_amount;

            // Tambahkan marker ke peta pada posisi proyek
            const projectLat = parseFloat(project.latitude);
            const projectLng = parseFloat(project.longitude);
            
            map.setView([projectLat, projectLng], 12);
            marker = L.marker([projectLat, projectLng]).addTo(map);
        })
        .catch(error => {
            console.error('Error:', error);
            messageContainer.innerHTML = `<p style="color: red;">${error.message}</p>`;
        });

    // Fungsi pencarian lokasi
    function searchLocation(query) {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                searchResults.innerHTML = '';
                searchResults.style.display = data.length > 0 ? 'block' : 'none';
                
                data.forEach(result => {
                    const div = document.createElement('div');
                    div.textContent = result.display_name;
                    div.addEventListener('click', () => {
                        const lat = parseFloat(result.lat);
                        const lon = parseFloat(result.lon);
                        
                        // Update marker dan peta
                        if (marker) {
                            map.removeLayer(marker);
                        }
                        marker = L.marker([lat, lon]).addTo(map);
                        map.setView([lat, lon], 16);
                        
                        // Update form fields
                        latitudeInput.value = lat.toFixed(8);
                        longitudeInput.value = lon.toFixed(8);
                        locationInput.value = result.display_name;
                        
                        // Sembunyikan hasil pencarian
                        searchResults.style.display = 'none';
                        searchInput.value = result.display_name;
                    });
                    searchResults.appendChild(div);
                });
            })
            .catch(error => {
                console.error('Search error:', error);
                searchResults.innerHTML = '<div>Terjadi kesalahan saat mencari lokasi</div>';
                searchResults.style.display = 'block';
            });
    }

    // Event listener untuk tombol pencarian
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            searchLocation(query);
        }
    });

    // Event listener untuk input pencarian (search on enter)
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                searchLocation(query);
            }
        }
    });

    // Sembunyikan hasil pencarian saat klik di luar
    document.addEventListener('click', (e) => {
        if (!searchResults.contains(e.target) && e.target !== searchInput) {
            searchResults.style.display = 'none';
        }
    });

    // Event handler untuk klik pada peta
    map.on('click', function(e) {
        const latlng = e.latlng;
        
        // Hapus marker lama jika ada
        if (marker) {
            map.removeLayer(marker);
        }

        // Tambah marker baru
        marker = L.marker(latlng).addTo(map);
        
        // Update input fields
        latitudeInput.value = latlng.lat.toFixed(8);
        longitudeInput.value = latlng.lng.toFixed(8);

        // Lakukan reverse geocoding untuk mendapatkan alamat
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`)
            .then(response => response.json())
            .then(data => {
                if (data.display_name) {
                    locationInput.value = data.display_name;
                }
            })
            .catch(error => {
                console.error('Reverse geocoding error:', error);
            });
    });

    // 3. Mengirim perubahan saat form di-submit
    projectForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(projectForm);
        const data = Object.fromEntries(formData.entries());

        // Validasi koordinat
        if (!data.latitude || !data.longitude) {
            showError(messageContainer, 'Silakan pilih lokasi pada peta terlebih dahulu.');
            return;
        }

        // Validasi tanggal
        const startDate = new Date(data.start_date);
        const endDate = new Date(data.end_date);
        
        if (endDate < startDate) {
            showError(messageContainer, 'Tanggal selesai tidak boleh lebih awal dari tanggal mulai');
            return;
        }

        // Parse tags
        try {
            data.tags = JSON.parse(data.tags || '[]');
        } catch (e) {
            data.tags = [];
        }

        if (!messageContainer) {
            messageContainer = document.createElement('div');
            messageContainer.id = 'message-container';
            projectForm.appendChild(messageContainer);
        }

        // Disable form while submitting
        const formElements = projectForm.elements;
        for (let i = 0; i < formElements.length; i++) {
            formElements[i].disabled = true;
        }

        showLoading(messageContainer, 'Menyimpan perubahan...');
        fetch(apiUrl, {
            method: 'PUT',
            headers: createAuthHeaders(),
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) throw new Error('Otentikasi gagal.');
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then(result => {
            if (result.message) {
                showSuccess(messageContainer, result.message);
                showToast('Perubahan berhasil disimpan', 'success');
                setTimeout(() => {
                    window.location.href = `detail-proyek.html?id=${projectId}`;
                }, 2000);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            let errorMessage = 'Terjadi kesalahan.';
            if (error.message) {
                errorMessage = error.message;
            } else if (error.errors) {
                errorMessage = '<strong>Update gagal:</strong><ul>';
                for (const key in error.errors) {
                    errorMessage += `<li>${error.errors[key][0]}</li>`;
                }
                errorMessage += '</ul>';
            }
            showError(messageContainer, errorMessage);
            showToast('Gagal menyimpan perubahan', 'error');

            // Re-enable form after error
            for (let i = 0; i < formElements.length; i++) {
                formElements[i].disabled = false;
            }
        });
    });
});

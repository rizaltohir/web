// File: web/js/tambah.js

if (!isLoggedIn()) {
    alert('Anda harus login untuk menambah proyek.');
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
    console.log('Document loaded');
    const projectForm = document.getElementById('form-tambah-proyek');
    const messageContainer = document.getElementById('message-container');
    const locationInput = document.getElementById('location');
    const latitudeInput = document.getElementById('latitude');
    const longitudeInput = document.getElementById('longitude');
    const searchInput = document.getElementById('search-location');
    const searchButton = document.getElementById('search-button');
    const searchResults = document.getElementById('search-results');
    
    // Date validation

    // Date validation
    const startDateInput = document.getElementById('start_date');
    const endDateInput = document.getElementById('end_date');

    startDateInput.addEventListener('change', function() {
        endDateInput.min = this.value;
    });

    endDateInput.addEventListener('change', function() {
        if (this.value < startDateInput.value) {
            this.value = startDateInput.value;
            showToast('Tanggal selesai tidak boleh lebih awal dari tanggal mulai', 'warning');
        }
    });

    // Inisialisasi peta dengan opsi kontrol
    const map = L.map('map', {
        center: [-2.548926, 118.014863], // Posisi default di tengah Indonesia
        zoom: 5,
        zoomControl: false, // Nonaktifkan kontrol zoom default
        minZoom: 4, // Batasi zoom minimum
        maxZoom: 18 // Batasi zoom maximum
    });
    
    // Tambahkan layer peta dari OpenStreetMap
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

    // Variabel untuk menyimpan marker
    let marker;

    // Fungsi pencarian lokasi
    function searchLocation(query) {
        // Show loading state
        searchResults.innerHTML = `
            <div class="loading-container" style="padding: 10px;">
                <div class="loading-spinner"></div>
                <p>Mencari lokasi...</p>
            </div>
        `;
        searchResults.style.display = 'block';
        
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
        
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Gagal terhubung ke layanan pencarian');
                }
                return response.json();
            })
            .then(data => {
                searchResults.innerHTML = '';
                
                if (data.length === 0) {
                    searchResults.innerHTML = `
                        <div class="error-message" style="margin: 0; border-radius: 0;">
                            Lokasi tidak ditemukan. Coba kata kunci lain.
                        </div>
                    `;
                    return;
                }

                data.forEach(result => {
                    const div = document.createElement('div');
                    div.textContent = result.display_name;
                    div.addEventListener('click', () => {
                        const lat = parseFloat(result.lat);
                        const lon = parseFloat(result.lon);
                        
                        try {
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

                            // Show success toast
                            showToast('Lokasi berhasil dipilih', 'success');
                        } catch (error) {
                            console.error('Error updating map:', error);
                            showToast('Gagal menampilkan lokasi di peta', 'error');
                        }
                    });
                    searchResults.appendChild(div);
                });
                
                searchResults.style.display = 'block';
            })
            .catch(error => {
                console.error('Search error:', error);
                searchResults.innerHTML = `
                    <div class="error-message" style="margin: 0; border-radius: 0;">
                        ${error.message || 'Terjadi kesalahan saat mencari lokasi'}
                    </div>
                `;
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

    // Event handler ketika peta diklik
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
    // Submit handler untuk form
    projectForm.addEventListener('submit', function(event) {
        event.preventDefault();
        console.log('Form submitted');
        
        const formData = new FormData(projectForm);
        const data = Object.fromEntries(formData.entries());
        console.log('Form data:', data);
        console.log('Tags value:', data.tags);
        
        // Validasi tanggal
        const startDate = new Date(data.start_date);
        const endDate = new Date(data.end_date);
        
        if (endDate < startDate) {
            showError(messageContainer, 'Tanggal selesai tidak boleh lebih awal dari tanggal mulai');
            return;
        }

        // Parse tags dari JSON string
        try {
            data.tags = JSON.parse(data.tags || '[]');
        } catch (e) {
            data.tags = [];
        }

        if (!data.latitude || !data.longitude) {
            showError(messageContainer, 'Silakan pilih lokasi pada peta terlebih dahulu.');
            return;
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

        showLoading(messageContainer, 'Menyimpan proyek...');

        fetch('http://127.0.0.1:8000/api/projects', {
            method: 'POST',
            headers: createAuthHeaders(),
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) throw new Error('Otentikasi gagal. Silakan login kembali.');
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then(result => {
            if (result.message) {
                showSuccess(messageContainer, result.message);
                showToast('Proyek berhasil disimpan', 'success');
                projectForm.reset();
                
                // Reset peta
                if (marker) {
                    map.removeLayer(marker);
                }
                map.setView([-2.548926, 118.014863], 5);

                // Re-enable form after success
                for (let i = 0; i < formElements.length; i++) {
                    formElements[i].disabled = false;
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            let errorMessage = 'Terjadi kesalahan.';
            if (error.message) {
                errorMessage = error.message;
            } else if (error.errors) {
                errorMessage = '<strong>Penyimpanan gagal:</strong><ul>';
                for (const key in error.errors) {
                    errorMessage += `<li>${error.errors[key][0]}</li>`;
                }
                errorMessage += '</ul>';
            }
            showError(messageContainer, errorMessage);
            showToast('Gagal menyimpan proyek', 'error');

            // Re-enable form after error
            for (let i = 0; i < formElements.length; i++) {
                formElements[i].disabled = false;
            }
        });
    });
});

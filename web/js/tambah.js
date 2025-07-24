// File: web/js/tambah.js

if (!isLoggedIn()) {
    alert('Anda harus login untuk menambah proyek.');
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', function() {
    const projectForm = document.getElementById('form-tambah-proyek');
    const messageContainer = document.getElementById('message-container');
    const geocodeButton = document.getElementById('geocode-button');
    const geocodeStatus = document.getElementById('geocode-status');
    const locationInput = document.getElementById('location');
    const latitudeInput = document.getElementById('latitude');
    const longitudeInput = document.getElementById('longitude');

    geocodeButton.addEventListener('click', function() {
        const locationQuery = locationInput.value;
        if (!locationQuery) {
            alert('Silakan masukkan alamat atau nama lokasi terlebih dahulu.');
            return;
        }

        geocodeStatus.textContent = 'Mencari koordinat...';
        geocodeStatus.style.color = 'black';

        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationQuery)}`)
            .then(response => {
                if (!response.ok) throw new Error('Gagal menghubungi server geocoding.');
                return response.json();
            })
            .then(data => {
                if (data && data.length > 0) {
                    const firstResult = data[0];
                    latitudeInput.value = parseFloat(firstResult.lat).toFixed(8);
                    longitudeInput.value = parseFloat(firstResult.lon).toFixed(8);
                    geocodeStatus.textContent = `Koordinat ditemukan untuk: ${firstResult.display_name}`;
                    geocodeStatus.style.color = 'green';
                } else {
                    geocodeStatus.textContent = 'Koordinat tidak dapat ditemukan. Coba gunakan alamat yang lebih spesifik.';
                    geocodeStatus.style.color = 'red';
                    latitudeInput.value = '';
                    longitudeInput.value = '';
                }
            })
            .catch(error => {
                console.error('Geocoding error:', error);
                geocodeStatus.textContent = 'Terjadi kesalahan saat mencari koordinat.';
                geocodeStatus.style.color = 'red';
            });
    });

    projectForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(projectForm);
        const data = Object.fromEntries(formData.entries());

        if (!data.latitude || !data.longitude) {
            alert('Koordinat belum diisi. Silakan cari koordinat dari alamat terlebih dahulu.');
            return;
        }

        messageContainer.innerHTML = '<p>Menyimpan proyek...</p>';
        messageContainer.style.color = 'black';

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
                messageContainer.innerHTML = `<p style="color: green;">${result.message}</p>`;
                projectForm.reset();
                geocodeStatus.textContent = '';
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
            messageContainer.innerHTML = `<p style="color: red;">${errorMessage}</p>`;
        });
    });
});

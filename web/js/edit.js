// File: web/js/edit.js

if (!isLoggedIn()) {
    alert('Anda harus login untuk mengedit proyek.');
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', function() {
    const projectForm = document.getElementById('form-edit-proyek');
    const messageContainer = document.getElementById('message-container');
    const backLink = document.getElementById('back-link');
    const geocodeButton = document.getElementById('geocode-button');
    const geocodeStatus = document.getElementById('geocode-status');
    const locationInput = document.getElementById('location');
    const latitudeInput = document.getElementById('latitude');
    const longitudeInput = document.getElementById('longitude');
    
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('id');

    if (!projectId) {
        document.body.innerHTML = '<p style="color: red;">Error: ID Proyek tidak ditemukan.</p>';
        return;
    }

    const apiUrl = `http://127.0.0.1:8000/api/projects/${projectId}`;
    backLink.href = `detail-proyek.html?id=${projectId}`;

    // 1. Mengisi form dengan data yang ada
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error('Gagal memuat data proyek.');
            return response.json();
        })
        .then(project => {
            document.getElementById('title').value = project.title;
            document.getElementById('description').value = project.description;
            locationInput.value = project.location;
            latitudeInput.value = project.latitude;
            longitudeInput.value = project.longitude;
            document.getElementById('goal_amount').value = project.goal_amount;
        })
        .catch(error => {
            console.error('Error:', error);
            messageContainer.innerHTML = `<p style="color: red;">${error.message}</p>`;
        });

    // 2. Fungsi Geocoding
    geocodeButton.addEventListener('click', function() {
        const locationQuery = locationInput.value;
        if (!locationQuery) {
            alert('Silakan masukkan alamat atau nama lokasi terlebih dahulu.');
            return;
        }
        geocodeStatus.textContent = 'Mencari koordinat...';
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationQuery)}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const firstResult = data[0];
                    latitudeInput.value = parseFloat(firstResult.lat).toFixed(8);
                    longitudeInput.value = parseFloat(firstResult.lon).toFixed(8);
                    geocodeStatus.textContent = `Koordinat ditemukan untuk: ${firstResult.display_name}`;
                    geocodeStatus.style.color = 'green';
                } else {
                    geocodeStatus.textContent = 'Koordinat tidak dapat ditemukan.';
                    geocodeStatus.style.color = 'red';
                }
            })
            .catch(error => {
                console.error('Geocoding error:', error);
                geocodeStatus.textContent = 'Terjadi kesalahan saat mencari koordinat.';
            });
    });

    // 3. Mengirim perubahan saat form di-submit
    projectForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(projectForm);
        const data = Object.fromEntries(formData.entries());

        if (!data.latitude || !data.longitude) {
            alert('Koordinat belum diisi. Silakan cari koordinat dari alamat terlebih dahulu.');
            return;
        }

        messageContainer.innerHTML = '<p>Menyimpan perubahan...</p>';
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
                messageContainer.innerHTML = `<p style="color: green;">${result.message}</p>`;
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
            messageContainer.innerHTML = `<p style="color: red;">${errorMessage}</p>`;
        });
    });
});

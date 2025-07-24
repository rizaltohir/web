// File: web/js/tambah.js

// Pertama, kita langsung panggil auth.js untuk memeriksa login
// Jika belum login, tendang kembali ke halaman login
if (!isLoggedIn()) {
    alert('Anda harus login untuk menambah proyek.');
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', function() {
    const projectForm = document.getElementById('form-tambah-proyek');
    const messageContainer = document.getElementById('message-container');

    projectForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(projectForm);
        const data = Object.fromEntries(formData.entries());

        messageContainer.innerHTML = '<p>Menyimpan proyek...</p>';
        messageContainer.style.color = 'black';

        fetch('http://127.0.0.1:8000/api/projects', {
            method: 'POST',
            headers: createAuthHeaders( ), // <-- MENGGUNAKAN HELPER
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                // Jika token tidak valid atau error lain, tangani di sini
                if (response.status === 401) throw new Error('Otentikasi gagal. Silakan login kembali.');
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then(result => {
            if (result.message) {
                messageContainer.innerHTML = `<p style="color: green;">${result.message}</p>`;
                projectForm.reset();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            let errorMessage = 'Terjadi kesalahan.';
            if (error.message) {
                errorMessage = error.message;
            } else if (error.errors) {
                errorMessage = '<strong>Registrasi gagal:</strong><ul>';
                for (const key in error.errors) {
                    errorMessage += `<li>${error.errors[key][0]}</li>`;
                }
                errorMessage += '</ul>';
            }
            messageContainer.innerHTML = `<p style="color: red;">${errorMessage}</p>`;
        });
    });
});
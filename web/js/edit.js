
if (!isLoggedIn()) {
    alert('Anda harus login untuk mengedit proyek.');
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', function() {
    const projectForm = document.getElementById('form-edit-proyek');
    const messageContainer = document.getElementById('message-container');
    const backLink = document.getElementById('back-link');
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('id');

    if (!projectId) {
        document.body.innerHTML = '<p style="color: red;">Error: ID Proyek tidak ditemukan.</p>';
        return;
    }

    const apiUrl = `http://127.0.0.1:8000/api/projects/${projectId}`;
    backLink.href = `detail-proyek.html?id=${projectId}`;

    // Mengambil data untuk mengisi form (tidak perlu token karena rute GET publik )
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error('Gagal memuat data proyek.');
            return response.json();
        })
        .then(project => {
            document.getElementById('title').value = project.title;
            document.getElementById('description').value = project.description;
            document.getElementById('location').value = project.location;
            document.getElementById('goal_amount').value = project.goal_amount;
        })
        .catch(error => {
            console.error('Error:', error);
            messageContainer.innerHTML = `<p style="color: red;">${error.message}</p>`;
        });

    // Mengirim perubahan saat form di-submit
    projectForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(projectForm);
        const data = Object.fromEntries(formData.entries());

        messageContainer.innerHTML = '<p>Menyimpan perubahan...</p>';
        messageContainer.style.color = 'black';

        fetch(apiUrl, {
            method: 'PUT',
            headers: createAuthHeaders(), // <-- MENGGUNAKAN HELPER
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

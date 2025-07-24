// Tunggu hingga seluruh konten halaman HTML selesai dimuat
document.addEventListener('DOMContentLoaded', function() {

    // Ambil elemen formulir dan wadah pesan
    const registerForm = document.getElementById('form-register');
    const messageContainer = document.getElementById('message-container');

    // Tambahkan 'event listener' yang akan berjalan saat formulir di-submit
    registerForm.addEventListener('submit', function(event) {
        
        // Mencegah perilaku default formulir (yang akan me-reload halaman)
        event.preventDefault();

        // Kumpulkan semua data dari input formulir
        const formData = new FormData(registerForm);
        const data = Object.fromEntries(formData.entries());

        // Tampilkan pesan "Loading..."
        messageContainer.innerHTML = '<p>Mendaftarkan akun...</p>';
        messageContainer.style.color = 'black';

        // Kirim data ke API registrasi menggunakan Fetch
        fetch('http://127.0.0.1:8000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data ) // Ubah objek data JavaScript menjadi string JSON
        })
        .then(response => response.json())
        .then(result => {
            // Proses hasil dari server
            if (result.message.includes('berhasil')) {
                // Jika sukses, tampilkan pesan sukses
                messageContainer.innerHTML = `<p style="color: green;">${result.message} Anda akan diarahkan ke halaman login.</p>`;
                registerForm.reset(); // Kosongkan formulir

                // Setelah 3 detik, arahkan ke halaman login
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 3000);

            } else if (result.errors) {
                // Jika ada error validasi dari Laravel
                let errorMessages = '<strong>Registrasi gagal:</strong><ul>';
                for (const key in result.errors) {
                    // Ambil pesan error pertama untuk setiap field
                    errorMessages += `<li>${result.errors[key][0]}</li>`;
                }
                errorMessages += '</ul>';
                messageContainer.innerHTML = errorMessages;
                messageContainer.style.color = 'red';
            }
        })
        .catch(error => {
            // Jika terjadi error jaringan
            console.error('Error:', error);
            messageContainer.innerHTML = '<p style="color: red;">Tidak dapat terhubung ke server. Pastikan server berjalan.</p>';
        });
    });
});

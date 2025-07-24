// Tunggu hingga seluruh konten halaman HTML selesai dimuat
document.addEventListener('DOMContentLoaded', function() {

    // Ambil elemen formulir dan wadah pesan
    const loginForm = document.getElementById('form-login');
    const messageContainer = document.getElementById('message-container');

    // Tambahkan 'event listener' yang akan berjalan saat formulir di-submit
    loginForm.addEventListener('submit', function(event) {
        
        // Mencegah perilaku default formulir (reload halaman)
        event.preventDefault();

        // Kumpulkan data dari input formulir
        const formData = new FormData(loginForm);
        const data = Object.fromEntries(formData.entries());

        // Tampilkan pesan "Loading..."
        messageContainer.innerHTML = '<p>Memproses login...</p>';
        messageContainer.style.color = 'black';

        // Kirim data ke API login menggunakan Fetch
        fetch('http://127.0.0.1:8000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data )
        })
        .then(response => {
            // Kita perlu menangani respons secara manual karena error 401 tidak akan masuk ke .catch
            if (!response.ok) {
                // Jika status bukan 2xx (misal: 401 Unauthorized), lempar error
                return response.json().then(err => { throw err; });
            }
            return response.json(); // Jika sukses, lanjutkan
        })
        .then(result => {
            // Jika login berhasil, server akan mengembalikan token dan data user
            
            // =================================================================
            // BAGIAN PALING PENTING: MENYIMPAN SESI LOGIN DI BROWSER
            // =================================================================
            localStorage.setItem('auth_token', result.access_token);
            localStorage.setItem('user_data', JSON.stringify(result.user));

            // Tampilkan pesan sukses
            messageContainer.innerHTML = `<p style="color: green;">${result.message} Anda akan diarahkan ke halaman utama.</p>`;
            
            // Setelah 2 detik, arahkan ke halaman utama
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        })
        .catch(error => {
            // Tangkap error dari validasi atau otentikasi
            console.error('Error:', error);
            let errorMessage = 'Terjadi kesalahan. Silakan coba lagi.';
            if (error.message) {
                errorMessage = error.message; // Ambil pesan error dari server (misal: "Email atau password salah.")
            }
            messageContainer.innerHTML = `<p style="color: red;">${errorMessage}</p>`;
        });
    });
});

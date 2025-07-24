// Tunggu hingga seluruh konten halaman HTML selesai dimuat
document.addEventListener('DOMContentLoaded', function() {

    // Ambil elemen formulir dan wadah pesan
    const loginForm = document.getElementById('form-login');
    const messageContainer = document.getElementById('message-container');

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const submitButton = document.getElementById('submit-button');

    // Validasi email saat input
    emailInput.addEventListener('input', function() {
        if (this.validity.typeMismatch || !this.value.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i)) {
            emailError.textContent = 'Masukkan alamat email yang valid';
            this.setCustomValidity('Invalid email');
        } else {
            emailError.textContent = '';
            this.setCustomValidity('');
        }
    });

    // Validasi password saat input
    passwordInput.addEventListener('input', function() {
        if (this.value.length < 8) {
            passwordError.textContent = 'Password minimal 8 karakter';
            this.setCustomValidity('Password too short');
        } else {
            passwordError.textContent = '';
            this.setCustomValidity('');
        }
    });

    // Tambahkan 'event listener' yang akan berjalan saat formulir di-submit
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Validasi sebelum submit
        if (!emailInput.checkValidity() || !passwordInput.checkValidity()) {
            return;
        }

        // Tampilkan loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="loading-spinner"></span> Memproses...';

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

            // Tampilkan pesan sukses dengan animasi
            messageContainer.innerHTML = `
                <div class="success-message">
                    <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                        <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                        <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                    </svg>
                    <p>${result.message}</p>
                    <p class="redirect-text">Anda akan diarahkan ke halaman utama dalam <span id="countdown">2</span> detik...</p>
                </div>
            `;
            
            // Countdown timer
            let timeLeft = 2;
            const countdownElement = document.getElementById('countdown');
            const countdownInterval = setInterval(() => {
                timeLeft--;
                countdownElement.textContent = timeLeft;
                if (timeLeft <= 0) {
                    clearInterval(countdownInterval);
                    window.location.href = 'index.html';
                }
            }, 1000);
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

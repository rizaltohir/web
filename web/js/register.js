// Tunggu hingga seluruh konten halaman HTML selesai dimuat
document.addEventListener('DOMContentLoaded', function() {

    // Ambil elemen formulir dan wadah pesan
    const registerForm = document.getElementById('form-register');
    const messageContainer = document.getElementById('message-container');

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordConfirmInput = document.getElementById('password_confirmation');
    const submitButton = document.getElementById('submit-button');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const passwordConfirmError = document.getElementById('password-confirmation-error');

    // Validasi nama saat input
    nameInput.addEventListener('input', function() {
        if (this.value.length < 3) {
            nameError.textContent = 'Nama minimal 3 karakter';
            this.setCustomValidity('Nama terlalu pendek');
        } else {
            nameError.textContent = '';
            this.setCustomValidity('');
        }
    });

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
    passwordInput.addEventListener('input', validatePasswords);
    passwordConfirmInput.addEventListener('input', validatePasswords);

    function validatePasswords() {
        const password = passwordInput.value;
        const confirmation = passwordConfirmInput.value;

        if (password.length < 8) {
            passwordError.textContent = 'Password minimal 8 karakter';
            passwordInput.setCustomValidity('Password terlalu pendek');
        } else if (!/\d/.test(password)) {
            passwordError.textContent = 'Password harus mengandung angka';
            passwordInput.setCustomValidity('Password harus mengandung angka');
        } else if (!/[a-zA-Z]/.test(password)) {
            passwordError.textContent = 'Password harus mengandung huruf';
            passwordInput.setCustomValidity('Password harus mengandung huruf');
        } else {
            passwordError.textContent = '';
            passwordInput.setCustomValidity('');
        }

        if (confirmation && password !== confirmation) {
            passwordConfirmError.textContent = 'Password tidak sama';
            passwordConfirmInput.setCustomValidity('Password tidak sama');
        } else {
            passwordConfirmError.textContent = '';
            passwordConfirmInput.setCustomValidity('');
        }
    }

    // Tambahkan 'event listener' yang akan berjalan saat formulir di-submit
    registerForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Validasi sebelum submit
        if (!nameInput.checkValidity() || !emailInput.checkValidity() || 
            !passwordInput.checkValidity() || !passwordConfirmInput.checkValidity()) {
            return;
        }

        // Tampilkan loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="loading-spinner"></span> Mendaftarkan...';

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
                // Jika sukses, tampilkan pesan sukses dengan animasi
                messageContainer.innerHTML = `
                    <div class="success-message">
                        <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                            <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                            <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                        </svg>
                        <p>${result.message}</p>
                        <p class="redirect-text">Anda akan diarahkan ke halaman login dalam <span id="countdown">3</span> detik...</p>
                    </div>
                `;
                
                registerForm.reset(); // Kosongkan formulir
                submitButton.disabled = true;

                // Countdown timer
                let timeLeft = 3;
                const countdownElement = document.getElementById('countdown');
                const countdownInterval = setInterval(() => {
                    timeLeft--;
                    countdownElement.textContent = timeLeft;
                    if (timeLeft <= 0) {
                        clearInterval(countdownInterval);
                        window.location.href = 'login.html';
                    }
                }, 1000);

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

Lingkungan Pengembangan Lokal:
•	Sistem Operasi: Linux (Ubuntu/Debian), macOS, atau Windows (dengan WSL/Laragon/XAMPP/WAMP).
•	PHP: Versi 8.2 atau lebih tinggi (sesuai composer.json).
•	Composer: Terinstal.
•	Node.js & npm/yarn: Terinstal.
•	Git: Terinstal.
•	Database: MySQL/MariaDB atau PostgreSQL (SQLite juga bisa untuk pengembangan cepat).
Langkah-langkah Pemasangan dan Penggunaan:
1.	Kloning Repositori: Buka terminal atau command prompt Anda dan kloning repositori GitHub: git clone https://github.com/rizaltohir/web.git 
2.	Pemasangan Backend (API):
–	Masuk ke direktori api: bash     cd api
–	Instal dependensi Composer: bash     composer install
–	Buat file .env dari .env.example: bash     cp .env.example .env
–	Generate application key: bash     php artisan key:generate
–	Konfigurasi database di file .env. Sesuaikan DB_CONNECTION, DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, dan DB_PASSWORD sesuai dengan konfigurasi database lokal Anda. Contoh untuk MySQL: DB_CONNECTION=mysql     DB_HOST=127.0.0.1     DB_PORT=3306     DB_DATABASE=nama_database_anda     DB_USERNAME=username_database_anda     DB_PASSWORD=password_database_anda
–	Jalankan migrasi database untuk membuat tabel: bash     php artisan migrate
–	(Opsional) Jalankan seeder untuk mengisi data dummy: bash     php artisan db:seed
–	Jalankan server pengembangan Laravel: bash     php artisan serve Ini akan menjalankan backend API di http://127.0.0.1:8000 (atau port lain yang tersedia).
3.	Pemasangan Frontend (Web):
–	Buka terminal baru dan masuk ke direktori web (dari root repositori web): bash     cd ../web
–	Instal dependensi Node.js: bash     npm install     # atau jika menggunakan yarn     # yarn install
–	Karena frontend ini adalah aplikasi HTML/CSS/JS statis, Anda bisa langsung membukanya di browser. Namun, jika ada kebutuhan untuk menjalankan server lokal untuk pengembangan (misalnya untuk hot-reloading atau mengatasi masalah CORS), Anda bisa menggunakan live-server atau sejenisnya: bash     # Instal live-server secara global jika belum ada     npm install -g live-server     # Jalankan live-server di direktori web     live-server Ini akan menjalankan frontend di http://127.0.0.1:8080 (atau port lain yang tersedia).
Cara Penggunaan:
Setelah backend dan frontend berjalan:
4.	Akses frontend melalui browser Anda (misalnya http://127.0.0.1:8080).
5.	Lakukan registrasi akun baru melalui halaman register.html.
6.	Login menggunakan akun yang baru dibuat melalui halaman login.html.
7.	Setelah login, Anda dapat mengakses halaman manajemen proyek (misalnya tambah-proyek.html, detail-proyek.html, edit-proyek.html) untuk menambah, melihat, mengedit, atau menghapus proyek. Pastikan URL API di konfigurasi frontend mengarah ke http://127.0.0.1:8000/api.
8.	Untuk melihat daftar proyek publik, Anda dapat mengakses index.html atau detail-proyek.html tanpa perlu login.

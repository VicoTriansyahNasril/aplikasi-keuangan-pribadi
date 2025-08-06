# FinanceApp - Aplikasi Keuangan Pribadi Modern

![FinanceApp Showcase](public/screenshots/showcase.png)

<p align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
</p>

<p align="center">
  Sebuah aplikasi web manajemen keuangan pribadi yang dibangun dari awal menggunakan React.js, dirancang untuk memberikan pengalaman pengguna yang intuitif, modern, dan kaya fitur. Lacak setiap pemasukan dan pengeluaran, atur anggaran, dan dapatkan wawasan mendalam tentang kesehatan finansial Anda.
</p>

<p align="center">
  <strong><a href="https://URL_DEPLOY_VERCEL_ANDA">Lihat Demo Langsung »</a></strong>
</p>

---

## ✨ Fitur Utama

Aplikasi ini dirancang dengan serangkaian fitur komprehensif untuk memberikan kontrol penuh atas keuangan Anda:

*   **🔐 Autentikasi Pengguna:** Sistem registrasi dan login yang aman menggunakan **Firebase Authentication**, lengkap dengan validasi dan alur yang profesional.
*   **📊 Dashboard Interaktif:** Ringkasan visual instan dari total saldo, pemasukan, dan pengeluaran bulanan.
*   **💼 Manajemen Multi-Akun:** Buat dan kelola beberapa "dompet" virtual (misalnya, Rekening Bank, Tunai, E-Wallet) untuk pencatatan yang akurat.
*   **🔄 Pencatatan Transaksi (CRUD):** Tambah, lihat, **edit**, dan hapus pemasukan atau pengeluaran dengan formulir cerdas yang memiliki format angka otomatis.
*   **🎨 Kategori Dinamis:** Personalisasi aplikasi dengan membuat dan menghapus kategori pengeluaran Anda sendiri.
*   **🎯 Anggaran Bulanan:** Tetapkan batas pengeluaran untuk setiap kategori dan lacak progres pemakaian secara visual dengan *progress bar*. Dapatkan notifikasi saat anggaran terlampaui.
*   **💰 Tujuan Menabung (Savings Goals):** Buat target finansial, alokasikan dana, dan lacak progres tabungan Anda untuk mencapai impian.
*   **🔁 Template Transaksi:** Simpan transaksi rutin (seperti gaji atau tagihan) sebagai template untuk input data yang lebih cepat dengan satu klik.
*   **📈 Analisis & Visualisasi Data:**
    *   Grafik batang perbandingan pemasukan vs. pengeluaran dari waktu ke waktu.
    *   Grafik garis interaktif untuk melihat tren pengeluaran per kategori, lengkap dengan filter rentang waktu dan pemilih kategori.
*   **🌓 Tema Terang & Gelap:** Beralih antara mode terang dan gelap yang indah, lengkap dengan animasi latar belakang partikel yang unik dan dinamis untuk setiap tema.
*   **📱 Desain Responsif (Mobile-First):** Tampilan yang dioptimalkan untuk pengalaman yang mulus di perangkat desktop, tablet, dan mobile.
*   **💎 Interaksi Modern:** Dilengkapi dengan notifikasi *toast*, modal konfirmasi SweetAlert2 yang sesuai tema, dan animasi halus menggunakan Framer Motion.

---

## 🎨 Tampilan & Desain

#### Mode Gelap (Cosmic Theme)
![Dark Mode](public/screenshots/dark-mode.png)

#### Mode Terang (Sky Theme)
![Light Mode](public/screenshots/light-mode.png)

#### Tampilan Responsif
<p align="center">
  <img src="public/screenshots/mobile-view.png" width="300" alt="Mobile View">
</p>

---

## 🛠️ Tumpukan Teknologi

Aplikasi ini dibangun menggunakan ekosistem JavaScript modern:

*   **Framework:** [React.js](https://react.dev/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Backend & Database:** [Firebase](https://firebase.google.com/) (Authentication & Firestore)
*   **Styling:** CSS Modules & Variabel CSS
*   **Routing:** [React Router](https://reactrouter.com/)
*   **Manajemen State:** React Context API
*   **Visualisasi Data:** [Recharts](https://recharts.org/)
*   **Animasi:** [Framer Motion](https://www.framer.com/motion/) & [React TSParticles](https://github.com/matteobruni/tsparticles)
*   **Komponen UI:** [React Select](https://react-select.com/), [SweetAlert2](https://sweetalert2.github.io/), [React Hot Toast](https://react-hot-toast.com/)
*   **Ikon:** [React Icons](https://react-icons.github.io/react-icons/)
*   **Deployment:** [Vercel](https://vercel.com/)

---

## 🚀 Menjalankan Proyek Secara Lokal

Untuk menjalankan proyek ini di mesin lokal Anda, ikuti langkah-langkah berikut:

1.  **Clone repository ini:**
    ```bash
    git clone https://github.com/VicoTriansyahNasril/aplikasi-keuangan-pribadi.git
    cd aplikasi-keuangan-pribadi
    ```

2.  **Install semua dependensi:**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables:**
    *   Buat akun di [Firebase](https://firebase.google.com/) dan buat proyek baru.
    *   Aktifkan **Authentication** (Email/Password) dan **Firestore Database**.
    *   Buat file `.env.local` di root proyek.
    *   Salin kunci konfigurasi Firebase Anda ke dalam file `.env.local` dengan format berikut:
    ```
    VITE_FIREBASE_API_KEY=xxx
    VITE_FIREBASE_AUTH_DOMAIN=xxx
    VITE_FIREBASE_PROJECT_ID=xxx
    VITE_FIREBASE_STORAGE_BUCKET=xxx
    VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
    VITE_FIREBASE_APP_ID=xxx
    ```

4.  **Jalankan aplikasi:**
    ```bash
    npm run dev
    ```
    Aplikasi akan berjalan di `http://localhost:5173`.

---

Terima kasih telah melihat proyek ini!

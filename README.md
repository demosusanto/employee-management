# CorpFlow - Employee Management Backoffice

Aplikasi web *Employee Management Backoffice* berbasis **Angular** dan **Tailwind CSS** dengan desain *responsive* untuk desktop maupun mobile.

## Fitur Utama

1. **Authentication (Login Page)**
   - Validasi input username & password menggunakan Angular Reactive Forms.
   - Autentikasi berbasis kredensial *hardcoded* dengan persistensi sesi (`localStorage`) serta proteksi halaman menggunakan *Route Guards* (`authGuard` & `guestGuard`).

2. **Employee List Page**
   - Menampilkan **120 data dummy karyawan** secara terstruktur (tampilan tabel pada desktop dan kartu pada mobile).
   - **Multi-Parameter Search (AND Rule)**: Kombinasi pencarian kata kunci (nama/username/email), filter *Group*, dan filter *Status*.
   - **Sorting**: Pengurutan menaik/menurun pada kolom *Employee*, *Email*, *Group*, *Basic Salary*, dan *Status*.
   - **Pagination & Page Size**: Navigasi halaman lengkap dengan pilihan jumlah data per halaman (`5`, `10`, `20`, `50`).
   - **Action & Toast Notification**: Fitur *Edit* (notifikasi warna **kuning**) dan *Delete* dengan modal konfirmasi (notifikasi warna **merah**).

3. **Add & Edit Employee Page**
   - Seluruh 9 atribut data bersifat *mandatory* (tidak dapat disimpan bila ada kolom kosong).
   - Validasi *Birth Date* menggunakan *datetime picker* dengan batas maksimal hari ini.
   - Validasi format *Email* dan validasi numerik *Basic Salary* lengkap dengan pratinjau format Rupiah.
   - Komponen kustom *Searchable Dropdown* pada input *Group* dengan 10 pilihan grup.
   - Mendukung mode penambahan baru (*Add*) dan pembaruan data (*Edit*) dalam satu komponen *reusable*.

4. **Employee Detail Page**
   - Menampilkan seluruh rincian atribut karyawan dengan pemformatan data (contoh: `Basic Salary` ditampilkan dalam format `Rp. xx.xxx,xx` menggunakan custom `RupiahPipe`, serta format tanggal & waktu yang mudah dibaca).
   - Tombol **OK** kembali ke halaman *Employee List* dengan tetap mempertahankan *state* pencarian, filter, *sorting*, dan halaman sebelumnya.

---

## Tech Stack & Environment

| Komponen | Spesifikasi |
| :--- | :--- |
| **Framework** | Angular (Standalone Components, Signals, Reactive Forms, Lazy-Loaded Routes) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Runtime** | Node.js v20+ (LTS direkomendasikan) |
| **Package Manager** | npm v10+ |

---

## Struktur Proyek

```text
src/app/
├── core/
│   ├── data/        # Generator 120 dummy employee
│   ├── guards/      # authGuard & guestGuard
│   ├── models/      # Interface Employee, filter state, dan konstanta grup
│   └── services/    # AuthService, EmployeeService (Signal state), ToastService
├── features/
│   ├── auth/        # Halaman Login
│   └── employees/   # Halaman Employee List, Add/Edit Employee, Employee Detail
└── shared/
    ├── components/  # MainLayout, ToastContainer, SearchableDropdown
    └── pipes/       # RupiahPipe (format Rp. xx.xxx,xx)
```

---

## Cara Menjalankan Aplikasi

1. **Clone repositori**
   ```bash
   git clone [https://github.com/](https://github.com/)demosusanto/employee-management.git
   cd employee-management
   ```

2. **Install dependensi**
   ```bash
   npm install
   ```

3. **Jalankan server development**
   ```bash
   npm start
   ```
   atau:
   ```bash
   ng serve
   ```

4. **Buka di browser**
   Akses `http://localhost:4200`.

5. **Build untuk produksi (opsional)**
   ```bash
   npm run build
   ```

---

## Akun Demo (Login)

| Field | Nilai |
| :--- | :--- |
| **Username** | `admin` |
| **Password** | `password123` |

*(Tersedia juga tombol **Isi Otomatis** pada halaman Login untuk mempercepat pengujian.)*

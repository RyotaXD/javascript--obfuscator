# JavaScript Obfuscator

Tool proteksi dan obfuscation kode JavaScript berbasis Node.js yang menggabungkan **SHA Family Encryption (`SHA-256`, `SHA-512`, `SHA3-256`, `SHA3-512`, `HMAC-SHA512`)**, pengacakan array & string, validasi lisensi `RYXD`, penguncian integritas file (*SHA-256 Body Lock*), serta mekanisme *Anti-Tamper*.

---

## Fitur Utama

* **SHA Stream & Byte Rotation**: Mengamankan payload melalui 100 lapisan transformasi deterministik menggunakan keluarga algoritma SHA.
* **Integritas File & Anti-Beautify (`SHA-256 Lock`)**: Mendeteksi perubahan sekecil apa pun pada file hasil obfuscate (termasuk spasi, komentar, atau *code beautifier*).
* **Validasi Lisensi**
(`RYXD`)**: Memverifikasi format, checksum `SHA-256`, `SHA3-256`, dan tanda tangan `HMAC-SHA512` sebelum mengeksekusi kode utama.
* **Anti-Debug & Anti-Hook**: Memblokir flag `--inspect`, `--debug`, `-r` / `--require`, serta modifikasi pada fungsi bawaan (`Function.prototype.toString`, `Buffer.from`).
* **Zero External Dependencies**: Berjalan langsung memakai modul bawaan Node.js (`fs`, `path`, `readline`, `crypto`) sehingga ringan di Termux maupun server.

---

## Persyaratan Sistem

* **Node.js** versi `18.0.0` atau lebih baru (direkomendasikan Node.js v20 – v24).
* Mendukung **Android (Termux)**, Linux, macOS, dan Windows.

---

## Cara Penginstalan

### 1. Di Android (Termux)

```bash
pkg update && pkg upgrade -y
pkg install nodejs git -y
git clone https://github.com/RyotaXD/javascript--obfuscator.git
cd javascript--obfuscator
```

### 2. Di Linux / Windows / macOS

```bash
git clone https://github.com/RyotaXD/javascript--obfuscator.git
cd javascript--obfuscator
```

---

## Struktur Direktori

```text
javascript--obfuscator/
├── run.js          # Obfuscator utama (mode interaktif & CLI)
├── package.json    # Konfigurasi proyek
├── README.md       # Dokumentasi instalasi & pemakaian
└── test.js         # Contoh file target yang akan di-obfuscate
```

---

## Cara Pemakaian

### A. Mode Interaktif

1. Jalankan skrip utama:
   ```bash
   npm start
   ```
   atau:
   ```bash
   node run.js
   ```
2. Masukkan nama file sumber (`.js`) dan nama file output yang diinginkan:
   ```text
   [?] Masukin nama file (.js)  : test.js
   [?] Nama file output (.js)   : hasil.js
   ```
3. Jalankan file hasil obfuscate:
   ```bash
   node hasil.js
   ```

### B. Mode Argumen CLI (Langsung)

```bash
node run.js test.js hasil.js
```

---

## Catatan Penting

* **Jangan Mengedit File Output**: Mengubah karakter, menambah baris kosong, atau merapikan (*beautify*) file hasil obfuscate akan menggagalkan validasi `SHA-256 Lock` dan memicu pesan trap.
* **Anti-Debug Aktif**: Menjalankan file dengan flag `--inspect`, `--debug`, atau `-r` / `--require` akan otomatis menghentikan eksekusi.
* **Environment Lock**: Kunci dekripsi terikat pada versi Node.js, arsitektur CPU, dan sistem operasi saat proses build (`process.version|arch|platform`). Jalankan file output pada environment Node.js yang sama.

---

## Repository & Author

* **GitHub Repo**: RyotaXD/javascript--obfuscator
* **Author**: RyotaXD (`OfficialRyotaStore`)

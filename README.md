# Cika's 21st — A Birthday Keepsake 🎂

Website gift ulang tahun untuk Cika: sebuah *digital keepsake* dengan lilin interaktif, galeri, surat, dan wish jar.

Dibuat dengan HTML, CSS, dan JavaScript murni — **tanpa build tool dan tanpa dependency**. Font sudah di-host lokal, jadi seluruh tampilan tetap jalan offline. Untuk lagu penuh **Monokrom — Tulus**, tambahkan file MP3-mu sendiri ke `assets/audio/` (lihat bagian Musik).

---

## Cara membuka

**Cara cepat:** klik dua kali `index.html`.

**Cara disarankan:**

```bash
cd D:\Project_Birthday\ultah_cika
python -m http.server 4173
```

Lalu buka `http://localhost:4173` di browser.

> Lilin ditiup dengan klik/tap. Semua fitur inti tetap berjalan tanpa server, termasuk saat `index.html` dibuka langsung.

---

## Fitur

- **Candle gate** — tiup 3 lilin (klik/tap) untuk membuka kado.
- **Play Tune** — memutar **Monokrom — Tulus** dari `assets/audio/monokrom.mp3`. Kalau file belum ada, situs mencoba preview resmi 30 detik (butuh internet), lalu fallback ke melodi music-box bawaan.
- **Hero keepsake** — foto polaroid dengan caption, badge, dan animasi lembut.
- **Chapter XXI in Frames** — kolase foto + quote card.
- **Sweet Letter** — surat dengan wax seal yang bisa ditekan (keluar hati kecil).
- **Raise a Glass** — tombol toast dengan konfeti.
- **Wish jar** — dinding wish berisi doa-doa untuk Cika (tanpa form input).
- **Responsif** — nyaman dari layar 320px sampai desktop lebar.
- **Aksesibel** — navigasi keyboard, `aria-live`, dukungan `prefers-reduced-motion`.

---

## Kustomisasi

### Nama & teks
Buka `index.html` lalu cari `Cika`. Ganti nama, ucapan, judul, dan caption sesuai kebutuhan.

### Isi surat
Edit bagian `<div class="envelope__letter"> ... </div>` di `index.html`. Kalimat yang sekarang sudah dirapikan dari draft desain — silakan ganti dengan tulisanmu sendiri.

### Foto
- Foto utama (hero & foto besar galeri) memakai `assets/img/cika.jpg`.
- Foto kedua di galeri memakai `assets/img/foto-kedua.jpg`.
- Untuk mengganti foto, timpa file dengan nama yang sama (disarankan rasio potret **3:4**), atau ubah `src` pada tag `<img>` terkait di `index.html`.
- Objek foto kedua diatur lewat CSS (`object-position` di `.collage__photo--crop img`).

### Warna & font
- Palet warna ada di `:root` pada `assets/css/style.css`.
- Font self-hosted ada di `assets/fonts/`:
  - Cormorant Garamond (judul & surat)
  - Jost (body)
  - Parisienne (script)
- Ganti font dengan menaruh file `.woff2` baru dan memperbarui blok `@font-face` di bagian atas CSS.

### Musik (Monokrom — Tulus)
Situs memutar lagu secara berurutan dari sumber berikut:

1. **`assets/audio/monokrom.mp3`** — lagu penuh milikmu (paling disarankan, bisa offline).
2. **Preview resmi 30 detik** dari Apple — dipakai otomatis kalau MP3 belum ada (butuh internet).
3. **Music-box fallback** — melodi bawaan di `MELODY` (`assets/js/main.js`) kalau keduanya tidak tersedia.

Cara memasang lagu penuh:

```text
assets/audio/monokrom.mp3
```

Lalu reload halaman. Volume, fade, dan loop sudah diatur otomatis. Detail ada di `assets/audio/README.md`.

> File lagu tidak disertakan karena lagu berhak cipta. Gunakan salinan lagu yang kamu miliki secara legal. Untuk memakai lagu lain, ganti file/`TRACK_SRC` dan (opsional) `PREVIEW_SRC` di `assets/js/main.js`.

### Tanggal footer
Cari `© 2026` di `index.html`.

### Isi wish jar
Wish yang tampil diatur dari array `seedWishes` di `assets/js/main.js`. Tinggal edit, tambah, atau hapus item di sana — tidak ada form input di halaman.

> Karena wish jar sekarang hanya menampilkan wish yang sudah disiapkan, tidak ada data pengunjung yang disimpan.

---

## Struktur file

```
ultah_cika/
├── index.html
├── README.md
└── assets/
    ├── css/
    │   └── style.css
    ├── js/
    │   └── main.js
    ├── audio/
    │   ├── README.md
    │   └── monokrom.mp3   ← tambahkan file lagu di sini
    ├── fonts/
    │   ├── cormorant-garamond-normal.woff2
    │   ├── cormorant-garamond-italic.woff2
    │   ├── jost.woff2
    │   └── parisienne.woff2
    └── img/
        ├── cika.jpg
        └── foto-kedua.jpg
```

---

## Deploy (opsional)

Karena ini situs statis, cukup upload seluruh folder `ultah_cika` ke:

- **Netlify Drop** — drag & drop folder, langsung dapat link.
- **Vercel** — import folder sebagai static project.
- **GitHub Pages** — push isi folder ke repo, aktifkan Pages.
- **VPS / hosting biasa** — upload ke `public_html`.

Untuk hasil terbaik saat dibagikan, gunakan HTTPS.

---

Dibuat dengan ♥ untuk Cika's 21st Chapter.

# Lagu latar

Letakkan file lagu penuh di folder ini dengan nama:

```
monokrom.mp3
```

Jadi path lengkapnya:

```
assets/audio/monokrom.mp3
```

Lalu reload halaman. Tombol **Play Tune** akan memutar lagu tersebut (loop, dengan fade in/out).

## Kalau file belum ada

Situs akan mencoba memutar **preview resmi 30 detik** dari Apple (butuh koneksi internet). Kalau preview juga tidak bisa diputar, situs memakai melodi music-box bawaan supaya tetap ada suara.

## Catatan

- Gunakan file lagu yang kamu miliki secara legal (misalnya hasil unduhan dari layanan musik yang kamu beli).
- Format yang didukung mengikuti browser. MP3 paling aman.
- Kalau ingin memakai lagu lain, ganti file ini dan ubah `TRACK_SRC` di `assets/js/main.js`.
- File lagu tidak disertakan di project ini karena lagu berhak cipta.

# Geats portfolio

Portfolio Akhmad Fauzi, vanilla HTML/CSS/JavaScript dengan ES modules. Tidak ada framework, bundler, atau build step. Three.js dipin ke `0.160.0` melalui import map jsDelivr. Font Instrument Sans dan Geist Mono memakai Google Fonts.

## Jalankan lokal

```sh
npx serve@14.2.4 -l 4173
```

Buka `http://localhost:4173`. Gunakan server, bukan `file://`, karena modul JavaScript membutuhkan HTTP. `serve.json` memberi respons gambar transparan untuk slot screenshot yang belum diisi, sehingga placeholder tetap tampil tanpa request 404. File gambar nyata selalu didahulukan.

Deploy di Vercel sebagai situs statis, tanpa build command, dengan root repository sebagai output. `vercel.json` memakai urutan filesystem lalu fallback gambar. Hosting statis lain tetap dapat digunakan; gambar gagal dimuat tetap menjadi placeholder, tetapi tambahkan aturan fallback setara jika ingin menghindari 404 di console.

## Struktur

- `index.html`: struktur halaman, metadata, kartu HTML, dialog.
- `assets/css/styles.css`: token Graphite & Signal, layout responsif, komponen, reduced motion.
- `assets/js/main.js`: navigasi, konten terstruktur, render proyek, modal, lightbox, i18n, aktivasi scene.
- `assets/js/i18n.js`: kamus `I18N.en` / `I18N.id`, termasuk ARIA, metadata, dan teks canvas. Preferensi bahasa disimpan di `portfolio_lang`.
- `assets/js/projects-data.js`: satu sumber data kartu dan modal proyek.
- `assets/js/scene.js`: kartu ID three.js, spring pendulum, drag, flip, resource disposal.
- `assets/projects/<slug>/`: tiga slot screenshot tiap proyek.

`ace.jpeg`, `geats.png`, `CV-Akhmad Fauzi.pdf`, serta `pdf-version.html` tersedia di repository. CV diperbarui menjadi dua halaman dengan tiga peran utama, pengalaman magang KAI, dan lima proyek pilihan. Salinan PDF sebelum revisi disimpan lokal sebagai `CV-Akhmad Fauzi.before-revision.pdf` dan diabaikan Git. Versi index sebelumnya tersedia di riwayat Git; tidak ada halaman legacy yang ikut dipublikasikan.

## Isi proyek

Letakkan gambar rasio **16:10**, disarankan 1600 × 1000 px, di:

```text
assets/projects/finance-workspace-api/01.webp
assets/projects/finance-workspace-api/02.webp
assets/projects/finance-workspace-api/03.webp
assets/projects/papanclip/01.webp
assets/projects/papanclip/02.webp
assets/projects/papanclip/03.webp
assets/projects/easykan/01.webp
assets/projects/easykan/02.webp
assets/projects/easykan/03.webp
```

Gambar muncul otomatis setelah file tersedia; tidak perlu mengubah JavaScript. Screenshot memakai lazy loading, rasio tetap, crop `object-fit: cover`, dan lightbox. File kosong/tidak valid tetap menjadi placeholder. Gambar transparan 1 × 1 px hanya penanda teknis untuk file yang belum tersedia, bukan screenshot contoh.

Isi `links.live` dan `links.repo` dalam `projects-data.js` dengan URL publik yang sudah dikonfirmasi. Nilai kosong menandakan akses privat: modal menampilkan keterangan serta tautan email untuk membahas detail proyek, dengan judul proyek dalam subjek. Tautan publik yang sudah tersedia tetap ditampilkan. Peran Papanclip dan Finance Workspace API adalah Backend Developer; EasyKan, K2-Net, dan Antre-In adalah Fullstack Developer. Semua peran dan keterangan akses tersedia dalam EN/ID.

Deep link contoh: `/#project=finance-workspace-api`. Modal mendukung Tab/Shift+Tab, Escape, backdrop, tombol sebelumnya/berikutnya, browser Back/Forward, dan pengembalian fokus ke kartu pemicu.

## Kartu ID

Drag kartu mengikuti arah pointer, termasuk tarikan ke bawah dengan mouse. Lepaskan untuk melenting ke atas dan memantul hingga kembali ke posisi semula. Lanyard mengikuti posisi klip. Klik/ketuk kartu untuk membalik; gestur vertikal pada layar sentuh tetap menggulir halaman. Tidak ada tombol atau petunjuk tambahan di bawah kartu. Saat kartu mendapat fokus keyboard, Enter/Spasi membalik, panah bawah memicu pantulan, dan P menjeda atau melanjutkan gerakan. Kartu HTML juga dapat dibalik dengan klik atau Enter/Spasi. Tekstur 2048 × 3168 px dan ukuran kartu lebih besar membantu keterbacaan. Tidak menggunakan giroskop atau library fisika.

Kartu HTML langsung tersedia sebelum scene dimuat. Reduced motion, WebGL tidak tersedia, kegagalan CDN, kehilangan context, atau perangkat dengan ≤2 logical cores / ≤2 GB deviceMemory memakai kartu HTML. Nilai perangkat merupakan heuristik konservatif, bukan benchmark. Render berhenti saat kartu di luar viewport, tab tersembunyi, atau dijeda melalui keyboard. Geometry, material, texture, observer, dan event listener dilepas saat scene dihentikan. Nomor AF-2026-0001 dan barcode bersifat dekoratif.

## Arah desain

Portfolio untuk calon rekan kerja, recruiter, dan klien, dengan bahasa visual editorial teknis. ENERGY 2 / RHYTHM 3 / MOTION 2. Prioritas: Antislop, UI/UX Pro Max, lalu three.js.

- Graphite memenuhi brief identitas; amber hanya pada aksi, fokus, status aktif, dan penanda kecil.
- Instrument Sans mengutamakan keterbacaan; Geist Mono membedakan metadata dari konten.
- Nomor section dan garis 1 px memberi navigasi visual. Keahlian berupa daftar, layanan berupa baris, proyek pertama diberi ruang lebih besar, pengalaman berupa kronologi.
- Kartu ID dengan foto asli menghubungkan identitas personal dengan peran teknis. Foil hanya berada pada kartu fisik; tidak ada glow atau grid latar halaman.
- Panah menunjukkan aksi membuka detail atau tautan kontak. Badge hanya untuk teknologi dan status pengalaman yang sudah ada.
- Reveal 12 px membantu mengikuti urutan konten. Tidak ada loop dekoratif lain di luar kartu ID.

## TODO pemilik

- [ ] Perbarui screenshot apabila tampilan proyek berubah; 15 screenshot untuk lima proyek sudah tersedia.
- [ ] Tinjau ulang klaim fitur proyek, terutama Papanclip, sebelum mengirim CV ke lowongan tertentu.
- [ ] Sesuaikan ringkasan CV dengan kata kunci lowongan yang dituju; tata letak yang mudah dibaca ATS tidak menjamin lolos seleksi.

`QA.md` dan `docs/qa/` menyimpan hasil verifikasi lokal dan diabaikan Git, bersama `.agents/`, cache, serta konfigurasi pribadi. File aplikasi, screenshot proyek, dan konfigurasi hosting tetap disimpan di repository.

## Deployment

Repository terhubung ke Vercel. Push ke `main` memicu deployment produksi. Situs memakai preset Other, tanpa build command, dengan root repository sebagai output; tidak perlu menjalankan server lokal untuk pengunjung. Semua file dalam `assets/` harus ikut dipublikasikan bersama `index.html`, foto, favicon, dan PDF. `vercel.json` sudah menyertakan aturan fallback screenshot dan unduhan CV.

Domain produksi: https://geats-portfolio.vercel.app/. Canonical, `og:url`, serta URL gambar Open Graph/Twitter memakai domain ini.

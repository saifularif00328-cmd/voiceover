# VoiceOver Studio: Panduan Penggunaan

by: Saiful Arif

Aplikasi voice over berbasis Gemini TTS: 30 suara, 1 atau 2 pembicara, gaya, aksen, tempo, emosi, tag ekspresi, dan editor audio dengan buang jeda otomatis.
Tanpa login, tanpa Firebase, tanpa server. Semua berjalan di browser.

## Isi folder

| File | Fungsi |
|---|---|
| `index.html` | Seluruh aplikasi dalam satu file (HTML, CSS, JS) |
| `manifest.webmanifest` | Manifest PWA (nama, ikon, warna, pintasan) |
| `sw.js` | Service worker: cache aplikasi untuk mode offline dan pembaruan |
| `icons/` | Ikon PWA (192, 512, maskable 512, apple-touch 180, favicon) |
| `PANDUAN.md` | Dokumen ini |

## Cara menjalankan

**Cara tercepat:** klik dua kali `index.html`. Semua fitur bisa dipakai, tetapi PWA dan mode offline tidak aktif karena browser hanya mengizinkannya lewat HTTPS.

**Sebagai PWA (dipasang seperti aplikasi):** unggah SELURUH isi folder (`index.html`, `manifest.webmanifest`, `sw.js`, folder `icons`) ke hosting statis HTTPS, misalnya GitHub Pages, Netlify, atau Cloudflare Pages, di folder yang sama. Buka alamatnya di Chrome atau Edge lalu tekan **Pasang aplikasi** (di bilah atas atau menu Pengaturan). Di iPhone atau iPad (Safari): Bagikan, lalu Tambahkan ke Layar Utama.

- **Offline:** setelah dibuka sekali saat online, aplikasi tersimpan di perangkat. Offline Anda tetap bisa menulis naskah, memakai Editor audio, melihat Pustaka, dan menyiapkan paket. Generate suara, saran Gemini, dan pencarian visual atau musik butuh internet. Lencana Offline muncul di bilah atas.
- **Pembaruan:** jika file aplikasi diganti di hosting, muncul pesan "Versi baru aplikasi tersedia" dengan tombol Muat ulang. Saat memperbarui `index.html`, naikkan nilai `VERSION` di `sw.js` supaya cache lama diganti.
- **Pintasan:** menekan ikon aplikasi lama menampilkan pintasan ke Studio dan Editor.
- Menu Pengaturan > Aplikasi (PWA) menampilkan status, tombol periksa pembaruan, dan kosongkan cache.

## Langkah pertama

1. Buka https://aistudio.google.com/apikey lalu buat API key.
2. Di aplikasi, buka menu **Pengaturan**, tempel key, tekan **Simpan key**, lalu **Uji semua key**.
3. Pilih model TTS. Bawaan: `gemini-2.5-flash-preview-tts`. Jika Google memberi nama model baru, pilih "Lainnya" lalu ketik namanya.

### Beberapa API key (rotasi otomatis)
- Tekan **+ Tambah key** untuk menambah baris, atau tempel banyak key sekaligus (satu per baris) ke kolom mana pun.
- Aplikasi memakai key pertama. Jika sebuah key kehabisan kuota atau ditolak Google, aplikasi langsung beralih ke key berikutnya, lalu memutar kembali ke awal bila semuanya sudah dicoba. Berlaku untuk generate suara, penulisan naskah, saran Gemini, dan pratinjau suara.
- Masa tunggu: kuota per menit sekitar 1 menit, kuota harian sampai reset sekitar pukul 14:00 WIB. Key yang ditolak (tidak valid) dilewati sampai Anda menyimpan ulang. Status tiap key tampil di Pengaturan, dan masa tunggu tetap tersimpan walau halaman dimuat ulang.
- Jika semua key sedang dibatasi dan yang tercepat siap dalam 90 detik, aplikasi menunggu lalu mencoba lagi. Jika lebih lama, muncul pesan dengan perkiraan jam siap.
- Opsi **Putar bergantian tiap permintaan** membagi beban ke semua key, bukan hanya saat satu key habis.
- Penting: kuota gratis dihitung per **proyek Google Cloud**. Buat tiap key di proyek yang berbeda; beberapa key dari proyek yang sama berbagi kuota yang sama sehingga rotasi tidak membantu. "Uji semua key" hanya memeriksa validitas, bukan sisa kuota.

Semua API key hanya disimpan di browser Anda (localStorage) dan hanya dikirim ke Google. Jangan memakai aplikasi ini di komputer umum, dan jangan membagikan file yang sudah berisi key.

## Transkrip Audio

Menu **Transkrip** mengubah audio jadi teks dengan timestamp, lalu mengunduhnya sebagai **JSON** (juga SRT, VTT, dan TXT).

1. **Sumber audio.** Unggah file (mp3, wav, m4a, ogg, mp4, dan sejenisnya, maksimal 200 MB), pilih proyek dari Pustaka, atau tekan "Pakai hasil Studio terakhir" / "Pakai audio di Editor". Tombol **Transkrip JSON** juga ada di hasil Studio dan di tiap proyek Pustaka.
2. **Pengaturan.** Pilih bahasa audio (atau biarkan otomatis), ukuran potongan, dan centang **Tandai pembicara** bila ada lebih dari satu orang. Untuk audio dari Studio, opsi "Pakai naskah Studio sebagai acuan ejaan" membantu nama dan istilah tertulis benar.
3. **Buat transkrip.** Audio dipotong tiap 3 sampai 7 menit, diubah ke mono 16 kHz di browser, lalu dikirim ke Gemini. Potongan yang hening dilewati supaya kuota tidak terbuang. Waktu awal tiap potongan diketahui pasti, jadi timestamp antarbagian tetap nyambung.
4. **Edit dan unduh.** Teks tiap segmen bisa diperbaiki langsung di halaman sebelum diunduh.

Format JSON:

```json
{
  "versi": 1,
  "sumber": { "nama_file": "voice-over.wav", "durasi_detik": 72.4 },
  "model": "gemini-2.5-flash",
  "jumlah_segmen": 2,
  "teks_lengkap": "Halo semua... ",
  "segmen": [
    { "id": 1, "mulai": 3, "selesai": 9, "waktu_mulai": "00:00:03.000", "waktu_selesai": "00:00:09.000", "teks": "Halo semua, selamat datang.", "pembicara": "Pembicara 1" }
  ]
}
```

Kolom `pembicara` hanya muncul jika opsi tanda pembicara dipakai. `mulai` dan `selesai` dalam detik; `selesai` diambil dari awal segmen berikutnya (maksimal 10 detik).

Catatan:
- Timestamp berasal dari perkiraan Gemini, akurasinya sekitar 1 sampai 2 detik, bukan per milidetik atau per kata. Untuk subtitle yang presisi, cek di pemutar dan sesuaikan.
- Transkrip memakai kuota Gemini (rotasi beberapa API key tetap berlaku). Nama, istilah, dan angka bisa salah dengar, jadi periksa sebelum dipakai.
- Di menu **Bedah YT**, transkrip tiap video sekarang juga bisa diunduh sebagai JSON dengan format yang sama (tombol JSON per video, dan folder `json/` di ZIP semua hasil).

## Bedah YouTube

Menu **Bedah YT** membedah channel atau video YouTube: daftar video, transkrip berwaktu (SRT), analisis topik, dan ide topik baru.

1. **Sumber.** Tempel URL satu per baris: channel (`@handle`, `/channel/UC...`, `/user/...`, `/c/...`), playlist, atau video (`watch`, `youtu.be`, `shorts`). Pilih jumlah video terbaru yang diambil, batas durasi video yang diproses, dan jumlah ide topik. Tekan **Ambil data**.
2. **Pilih video.** Daftar tampil dengan judul, tayangan, tanggal, dan durasi. Urutkan menurut terbaru, terpopuler, atau terpanjang, lalu centang video yang mau dibedah. Tekan **Bedah video terpilih**. Tiap video diproses berurutan: transkrip dulu, lalu analisis (topik utama, subtopik, ringkasan, hook, struktur, kata kunci, target penonton, ide turunan). Tombol Hentikan tersedia kapan saja.
3. **Ide topik dan pola channel.** Tekan **Buat ide topik**: pola judul, topik dominan, celah konten, dan sejumlah ide topik baru lengkap dengan sudut, hook, dan alasan.
4. **Unduh.** Semua SRT (ZIP), ide topik (.md atau .json), daftar video (.csv), atau semua hasil (ZIP berisi SRT, transkrip TXT, analisis JSON, ide topik, CSV, dan laporan.json).

Yang perlu diketahui:
- **Cara kerjanya.** Aplikasi di browser tidak bisa membaca YouTube langsung, jadi daftar video diambil lewat **YouTube Data API v3** (key gratis, isi di Setelan) dan transkrip dibuat oleh **Gemini** yang menonton video publik dari URL-nya. Itu artinya transkrip adalah hasil pendengaran AI, bukan teks subtitle asli YouTube; nama, istilah teknis, dan angka bisa salah dengar. Periksa sebelum dipakai.
- **Key YouTube Data API (wajib untuk URL channel dan playlist).** URL video tunggal tetap jalan tanpa key, tetapi judul dan statistiknya kosong. Kolom key ada di bagian atas halaman Bedah YT (dan juga di Setelan). Cara mendapatkannya, gratis, sekitar 3 menit:
  1. Buka https://console.cloud.google.com/projectcreate, masuk dengan akun Google, beri nama proyek bebas, klik Create. Sudah punya proyek? Pakai saja.
  2. Buka https://console.cloud.google.com/apis/library/youtube.googleapis.com, pastikan proyek di bagian atas sudah benar, klik Enable.
  3. Buka https://console.cloud.google.com/apis/credentials, klik Create credentials, pilih API key, salin key (diawali `AIza`).
  4. Disarankan: Edit API key, di API restrictions pilih Restrict key, centang YouTube Data API v3, Save.
  5. Tempel key di kolom, klik Simpan, lalu Uji key. Muncul "Key valid" berarti siap.
  - Key Gemini dari https://aistudio.google.com/apikey juga dibuat di sebuah proyek Google Cloud. Jika langkah 2 dilakukan di proyek yang sama, key itu bisa dipakai di sini.
  - Kuota gratis 10.000 unit per hari; satu channel 25 video memakai sekitar 5 unit. Pesan "belum diaktifkan" berarti langkah 2 belum dilakukan di proyek yang tepat.
- **Kuota Gemini.** Membaca video memakai kuota besar. Paket gratis Google membatasi total durasi video YouTube per hari, jadi mulai dari beberapa video. Rotasi beberapa API key tetap berlaku. Video lebih dari 20 menit dipotong per 10 menit agar hasilnya utuh.
- **Tidak bisa diproses:** video privat, dibatasi umur, siaran langsung, atau tanpa ucapan. Statusnya ditandai Gagal atau Dilewati dan video lain tetap jalan.
- Hasil tersimpan di browser (Riwayat bedah di bawah halaman) dan bisa dibuka lagi.
- Gunakan hasilnya untuk riset dan inspirasi. Ide topik jangan disalin mentah-mentah, dan hormati hak cipta transkrip milik pembuat video.

## Menu

### Beranda
- Sapaan sesuai waktu, tombol **Mulai Generate**, dan chip model TTS aktif.
- **Lanjutkan Proyek:** proyek terakhir, tombol langsung membukanya di Editor.
- **Fitur Utama:** pintasan ke Studio, Editor, Pustaka, Preset.
- **Suara Populer:** klik untuk memilih suara, tombol putar untuk mendengar contoh.
- **Target Harian:** cincin progres menit audio yang dibuat hari ini, plus penanda 7 hari. Targetnya diubah di Pengaturan.
- **Suara Favorit:** peringkat suara yang paling sering Anda pakai.
- Kolom pencarian di atas mencari suara. Tekan Enter untuk membuka Studio dengan hasil pencarian. Chip api adalah streak hari berturut-turut, chip permata adalah jumlah proyek.

### Studio
- **1 atau 2 pembicara.** Mode 2 pembicara memakai format dialog per baris: `Nama: kalimat`. Nama harus sama dengan kolom nama pembicara.
- **30 suara** Gemini, bisa dicari berdasarkan nama atau karakter, dan bisa didengarkan contohnya (tiap contoh memakai kuota API).
- **Gaya dan ekspresi:** preset gaya, instruksi bebas, bahasa, aksen, tempo, emosi, serta gaya khusus per pembicara.
- **Tag ekspresi** seperti `[whispers]` dan `[laughs]`. Dukungan tergantung model.
- Naskah panjang dipotong otomatis per bagian, lalu disambung. Jeda antar bagian diatur di Pengaturan.
- Opsi **Buang jeda otomatis setelah generate** menjalankan pemangkas jeda langsung pada hasil.

### Editor
- Muat audio dari Pustaka, dari file unggahan (WAV, MP3, M4A, dan lainnya), atau dari hasil Studio.
- **Buang jeda otomatis:**
  - *Ambang hening* (dB): suara di bawah level ini dianggap hening. Tekan **Kalibrasi ambang otomatis** untuk menebak nilai yang cocok.
  - *Jeda minimum*: hening yang lebih pendek dari ini dibiarkan.
  - *Sisa jeda natural*: jeda panjang tidak dihapus total, tetapi dipendekkan sampai sebesar ini supaya ritme bicara tetap wajar. Isi 0 untuk membuang total.
  - *Potong hening di awal dan akhir*.
  - **Analisis** menampilkan jeda terdeteksi (merah di gelombang) dan hemat durasinya. **Terapkan** mengeksekusi. **Urungkan** membatalkan.
- Alat lain: potong ke seleksi, hapus bagian terseleksi, normalisasi, gain, fade, kecepatan (nada ikut berubah), urungkan, kembali ke asli.
- Ekspor **WAV** (langsung) dan **MP3** (butuh internet sekali untuk memuat encoder).

### Pustaka, Preset, Pengaturan
- **Pustaka:** riwayat hasil, tersimpan di browser (IndexedDB). Bisa putar, edit, unduh, ganti nama, hapus.
- **Preset:** 5 preset bawaan, ditambah preset buatan sendiri dari tombol "Simpan sebagai preset" di Studio.
- **Pengaturan:** API key, model, jeda antar bagian, target harian, simpan otomatis, hapus semua data.

## Catatan penting

- **Ini Gemini TTS (teks jadi suara).** Aplikasi tidak mengubah rekaman suara menjadi suara lain.
- Data (Pustaka, preset, key) terikat pada browser dan alamat yang dipakai. Berpindah browser atau alamat berarti data kosong. Unduh WAV untuk arsip.
- Jika muncul "Kuota API habis", tunggu beberapa saat atau cek batas penggunaan di Google AI Studio. Aplikasi mencoba ulang otomatis untuk gangguan sementara.
- Jika muncul "Model tidak ditemukan", ganti model di Pengaturan.
- Hasil audio berformat 16-bit mono, 24 kHz.

## Model TTS terbaru dan suara baru

**Model.** Pilihan baru di Setelan > Model TTS:
- `gemini-3.8-flash-tts`: kualitas utama, sekarang jadi bawaan.
- `gemini-3.8-flash-lite-tts`: lebih cepat dan hemat kuota.
- `gemini-3.1-flash-tts-preview` ditutup Google pada 17 November 2026; `gemini-2.5-*` tetap ada sebagai model lama.

Pengaturan lama yang masih memakai 3.1 preview atau 2.5 flash dipindah otomatis ke 3.8 satu kali. Kalau model pilihan Anda dijawab "tidak ditemukan", aplikasi mencoba model 3.8 lain sendiri.

**Suara.** 30 suara bawaan tetap ada. Di menu Studio > Pilih suara ada dua tombol baru:
1. *Voice Library*: cari suara tambahan (filter kata kunci, bahasa seperti `id-ID`, gender, jenis), dengarkan, lalu Tambah. Suara yang ditambah muncul paling atas di daftar, bertanda latar biru muda; tombol × menghapusnya dari daftar.
2. *Rancang suara baru*: tulis 1-2 kalimat deskripsi, aplikasi membuat suara lewat Google dan menyimpannya (maksimal 200 per project, berlaku sekitar 1 tahun).
3. Punya ID `voice_...` dari AI Studio? Tempel di kolom "Tambah lewat ID".

**Dua pembicara.** Google hanya menerima 30 suara bawaan dalam satu permintaan multi-pembicara. Kalau salah satu pembicara memakai suara kustom, aplikasi membuat audio per giliran bicara lalu menyambungnya, jadi jumlah panggilan API lebih banyak.

## Suara kresek: apa yang diperbaiki

Kresek biasanya datang dari tiga hal: letupan sesaat di audio Google, sambungan antar bagian naskah yang terpotong kasar, dan volume yang loncat antar bagian. Sekarang setiap bagian otomatis diproses (Setelan > Kualitas audio):
- offset DC dibuang, letupan 1-3 sampel diperbaiki;
- sunyi di ujung dipotong di titik nol lalu di-fade, jadi sambungan tidak klik;
- volume antar bagian disamakan, lalu hasil akhir dinaikkan ke puncak -1 dB;
- bagian yang masih penuh letupan dibuat ulang otomatis (maksimal 2 kali);
- pengisi desah (dither) saat menyimpan WAV 16-bit, dan opsi 48 kHz untuk pemutar yang kurang bagus saat mengubah sample rate.
Slider *Kestabilan suara* (default 0,8) menurunkan suhu model supaya hasil lebih stabil. Kalau terasa datar, naikkan ke 1,0.

## Semua model dan semua suara

- Setelan > Model TTS > *Muat semua model TTS dari Google* menambahkan model TTS apa pun yang terdaftar untuk key Anda.
- Studio > Voice Library > *Muat semua suara* mengambil seluruh katalog dan memasukkannya ke daftar suara (disimpan di browser, bisa dicari; tombol "Tampilkan lebih banyak" di bawah daftar).

## Instruksi gaya tidak lagi dibaca, dan kresek di ujung

- Model 3.8 menganggap isi naskah sebagai transkrip persis, jadi instruksi yang dicampur ke naskah ikut dibacakan. Sekarang naskah dan gaya dikirim terpisah: naskah murni di teks, gaya (bahasa apa pun, termasuk Indonesia) lewat jalur gaya resmi Gemini 3.8 (`speech_metadata.style`).
- Kalau jalur itu ditolak Google, aplikasi pakai pembungkus yang melarang instruksi diucapkan.
- Opsi "Cek otomatis instruksi gaya tidak terbaca" (Setelan > Kualitas audio) memeriksa hasil bagian pertama dengan Gemini. Kalau instruksi masih terdengar, aplikasi mengulang dengan format lebih ketat, dan sebagai pilihan terakhir tanpa gaya.
- Dua pembicara di model 3.8 dibuat per giliran bicara, jadi tiap pembicara punya gaya sendiri.
- Kresek di ujung audio berasal dari ledakan noise yang dikirim model setelah jeda sunyi. Sekarang dipotong otomatis di awal dan akhir tiap bagian, sebelum volume dinaikkan.

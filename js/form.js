//Key penyimpanan preferensi di localStorage (dicek di DevTools > Application > Local Storage)
const STORAGE_KEY = "kopi-nusa-preferensi-kontak";

//DOM selection
const form = document.querySelector("#form-kontak");
const preview = document.querySelector("#preview-form");
const formFeedback = document.querySelector("#form-feedback");
//Field yang divalidasi lewat Constraint Validation API (topik ditangani terpisah karena berupa grup radio)
const fields = ["nama", "email", "whatsapp", "paket", "pesan", "setuju"].map((id) => document.querySelector("#" + id));
const topikInputs = document.querySelectorAll('input[name="topik"]');
const channels = document.querySelectorAll("[data-channel]");
const tombolSimpan = document.querySelector("#simpan-preferensi");
const tombolHapus = document.querySelector("#hapus-preferensi");

//Menulis status umum di #form-feedback; sukses=true -> class "success" (hijau)
function setStatus(pesan, sukses = false) {
  formFeedback.textContent = pesan;
  formFeedback.classList.toggle("success", sukses);
}

//Membaca objek field.validity (hasil atribut required/minlength/type/pattern) lalu memilih pesan yang jelas
function getFieldError(field) {
  const validity = field.validity;

  if (validity.valueMissing) { return field.type === "checkbox" ? "Centang persetujuan untuk melanjutkan." : "Bagian ini wajib diisi.";}
  if (validity.typeMismatch) return "Format data belum sesuai.";
  if (validity.tooShort) return `Isi minimal ${field.minLength} karakter.`;
  if (validity.patternMismatch) return "Format belum sesuai contoh, misalnya 628123456789.";
  return "";
}

//Menampilkan pesan di <p id="ID-error"> dan menandai field dengan aria-invalid
//setCustomValidity(pesan) membuat field benar-benar "invalid" sehingga checkValidity() dan :invalid ikut bekerja
function tampilkanError(field, pesan) {
  const error = document.querySelector(`#${field.id}-error`);
  field.setCustomValidity(pesan);
  field.setAttribute("aria-invalid", pesan ? "true" : "false");
  if (error) {
    error.textContent = pesan;
  }
}

//Validasi satu field, true jika valid. setCustomValidity("") dulu agar status lama tidak ikut terbaca
function validasiField(field) {
  field.setCustomValidity("");
  const pesan = getFieldError(field);
  tampilkanError(field, pesan);
  return pesan === "";
}

//Grup radio topik: valid jika salah satu radio dipilih
function validasiTopik() {
  const valid = Array.from(topikInputs).some((input) => input.checked);
  document.querySelector("#topik-error").textContent = valid ? "" : "Pilih salah satu topik.";
  return valid;
}

//Preview (hanya dipanggil saat form valid)
function tampilkanPreview() {
  const data = new FormData(form);
  preview.textContent = [
    `Nama: ${data.get("nama")}`,
    `Email: ${data.get("email")}`,
    `WhatsApp: ${data.get("whatsapp") || "-"}`,
    `Paket: ${data.get("paket")}`,
    `Topik: ${data.get("topik")}`,
    `Waktu kontak: ${data.get("waktu") || "-"}`,
    `Pesan: ${data.get("pesan")}`,
  ].join("\n");

  setStatus("Form valid. Preview berhasil dibuat.", true);
}

//Simpan: object diubah jadi teks dengan JSON.stringify (localStorage hanya menyimpan string)
function simpanPreferensi() {
  const data = new FormData(form);
  const preferensi = {
    paket: data.get("paket"),
    topik: data.get("topik"),
    channel: Array.from(channels).filter((item) => item.checked).map((item) => item.value),
    updatedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferensi));
    setStatus("Preferensi tersimpan di localStorage.", true);
  } catch (error) {
    //Bisa gagal bila penyimpanan diblokir/penuh (misalnya mode privat)
    console.warn("Preferensi tidak dapat disimpan.", error);
    setStatus("Preferensi tidak dapat disimpan di browser ini.");
  }
}

//Muat: teks dikembalikan jadi object dengan JSON.parse; try...catch menjaga halaman bila data rusak
function muatPreferensi() {
  try {
    const tersimpan = localStorage.getItem(STORAGE_KEY);
    if (!tersimpan) return;

    const preferensi = JSON.parse(tersimpan);
    document.querySelector("#paket").value = preferensi.paket ?? "";
    const topik = document.querySelector(`input[name="topik"][value="${preferensi.topik}"]`);
    if (topik) topik.checked = true;
    channels.forEach((item) => {
      item.checked = preferensi.channel?.includes(item.value) ?? false;
    });
    setStatus("Preferensi berhasil dimuat.", true);
  } catch (error) {
    //JSON rusak: hapus data supaya tidak error terus setiap halaman dibuka
    console.warn("Preferensi tidak valid.", error);
    localStorage.removeItem(STORAGE_KEY);
    setStatus("Data preferensi rusak dan sudah dihapus.");
  }
}

function hapusPreferensi() {
  localStorage.removeItem(STORAGE_KEY);
  setStatus("Preferensi dihapus dari localStorage.", true);
}

//Event listener
//Validasi langsung saat mengetik/mengubah: pesan error hilang begitu field diperbaiki
fields.forEach((field) => field.addEventListener("input", () => validasiField(field)));
topikInputs.forEach((input) => input.addEventListener("change", validasiTopik));
tombolSimpan.addEventListener("click", simpanPreferensi);
tombolHapus.addEventListener("click", hapusPreferensi);

form.addEventListener("submit", (event) => {
  event.preventDefault(); // tahan pengiriman bawaan browser

  //map (bukan every) supaya SEMUA field dicek dan semua pesan error tampil sekaligus
  const hasil = fields.map((field) => validasiField(field));
  const topikValid = validasiTopik();

  if (!hasil.every(Boolean) || !topikValid || !form.checkValidity()) {
    setStatus("Periksa kembali bagian yang ditandai.");
    preview.textContent = "Data form akan muncul setelah form valid.";
    form.reportValidity();
    //Focus management: fokus ke field invalid pertama.
    //Selector dibatasi ke input/select/textarea karena fieldset juga cocok dengan :invalid tetapi tidak bisa difokus
    form.querySelector("input:invalid, select:invalid, textarea:invalid")?.focus();
    return;
  }

  tampilkanPreview();
});

//Isi ulang form dari preferensi tersimpan saat halaman dibuka
muatPreferensi();
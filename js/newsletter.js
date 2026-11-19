//Contoh penyimpanan preferensi non-sensitif: hanya pilihan minat yang disimpan, email TIDAK disimpan.
//Dibungkus IIFE agar nama variabel tidak bentrok dengan js/form.js (keduanya dimuat di kontak.html).
(function () {
  const NEWS_KEY = "kopi-nusa-newsletter";

  //Berhenti diam-diam jika halaman ini tidak punya form newsletter
  const newsForm = document.querySelector("#form-newsletter");
  if (!newsForm) return;

  const newsEmail = document.querySelector("#news-email");
  const newsEmailError = document.querySelector("#news-email-error");
  const newsStatus = document.querySelector("#news-status");
  const minatInputs = document.querySelectorAll("[data-minat]");

  //Validasi email dengan Constraint Validation API; true jika valid
  function validasiEmail() {
    newsEmail.setCustomValidity("");
    const valid = newsEmail.checkValidity();
    const pesan = valid
      ? ""
      : newsEmail.validity.valueMissing ? "Email wajib diisi." : "Format email belum sesuai.";

    newsEmail.setCustomValidity(pesan);
    newsEmail.setAttribute("aria-invalid", valid ? "false" : "true");
    newsEmailError.textContent = pesan;
    return valid;
  }

  //Simpan hanya daftar minat (array) + waktu simpan, diubah ke teks dengan JSON.stringify
  function simpanNewsletter() {
    const minat = Array.from(minatInputs).filter((i) => i.checked).map((i) => i.value);
    const data = { minat, updatedAt: new Date().toISOString() };

    try {
      localStorage.setItem(NEWS_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.warn("Newsletter tidak dapat disimpan.", error);
      return false;
    }
  }

  //Baca dengan JSON.parse di dalam try...catch; data rusak dihapus
  function muatNewsletter() {
    try {
      const tersimpan = localStorage.getItem(NEWS_KEY);
      if (!tersimpan) return;

      const data = JSON.parse(tersimpan);
      minatInputs.forEach((input) => {
        input.checked = Array.isArray(data.minat) && data.minat.includes(input.value);
      });
    } catch (error) {
      console.warn("Data newsletter tidak valid.", error);
      localStorage.removeItem(NEWS_KEY);
    }
  }

  //Pesan error hilang begitu email diperbaiki (hanya jika sebelumnya ditandai salah)
  newsEmail.addEventListener("input", () => {
    if (newsEmail.getAttribute("aria-invalid") === "true") validasiEmail();
  });

  newsForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validasiEmail()) {
      newsStatus.textContent = "Periksa kembali email Anda.";
      newsStatus.classList.remove("success");
      newsEmail.focus(); //focus management: kembali ke field yang salah
      return;
    }

    newsEmail.value = ""; //email tidak disimpan, jadi dikosongkan
    const berhasil = simpanNewsletter();
    newsStatus.textContent = berhasil
      ? "Terima kasih. Pilihan minat tersimpan di browser ini."
      : "Pilihan minat tidak dapat disimpan di browser ini.";
    newsStatus.classList.toggle("success", berhasil);
  });

  //Isi ulang pilihan minat dari penyimpanan saat halaman dibuka
  muatNewsletter();
})();
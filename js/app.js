"use strict";

console.log("P09 JavaScript aktif");

const produkUmkm = [
  { nama: "Kopi Gayo", kategori: "Kopi Unggulan", harga: 15000, stok: 12, unggulan: true, diskon: 10 },
  { nama: "Kopi Tubruk", kategori: "Kopi Tradisional", harga: 10000, stok: 8, unggulan: false, diskon: 0 },
  { nama: "Kopi Susu Gula Aren", kategori: "Minuman Kopi", harga: 18000, stok: 5, unggulan: true, diskon: 20 },
  { nama: "Es Kopi Nusantara", kategori: "Minuman Kopi", harga: 17000, stok: 0, unggulan: false, diskon: 0 },
  { nama: "Kopi Robusta", kategori: "Kopi Tradisional", harga: 14000, stok: 6, unggulan: false, diskon: 5 },
  { nama: "Kopi Susu Pandan", kategori: "Minuman Kopi", harga: 20000, stok: 4, unggulan: false, diskon: 5 },
];

console.table(produkUmkm);

const formatRupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

console.log(formatRupiah.format(produkUmkm[0].harga));

function statusStok(stok) {
  if (stok === 0) {
    return { label: "Habis", className: "empty" };
  }

  if (stok <= 5) {
    return { label: "Stok terbatas", className: "warning" };
  }

  return { label: "Tersedia", className: "" };
}

function labelKategori(kategori) {
  switch (kategori) {
    case "Kopi Unggulan":
      return "Kopi pilihan unggulan";
    case "Kopi Tradisional":
      return "Cita rasa tradisional";
    case "Minuman Kopi":
      return "Minuman kopi siap dinikmati";
    default:
      return "Produk UMKM";
  }
}

function renderProduk() {
  const grid = document.querySelector("#produk-dinamis");
  const ringkasan = document.querySelector("#produk-ringkasan");

  if (!grid || !ringkasan) {
    return;
  }

  let jumlahTersedia = 0;
  let markup = "";

  for (const produk of produkUmkm) {
    const status = statusStok(produk.stok);
    const kategori = labelKategori(produk.kategori);
    const labelAksi = produk.stok > 0 ? "Siap dipesan" : "Hubungi admin";
    const labelUnggulan = produk.unggulan ? "Produk unggulan" : "Produk reguler";

    const adaDiskon = produk.diskon > 0;
    const hargaAkhir = Math.round(produk.harga * (100 - produk.diskon) / 100);
    const tampilanHarga = adaDiskon
      ? `<s>${formatRupiah.format(produk.harga)}</s> ${formatRupiah.format(hargaAkhir)}`
      : formatRupiah.format(produk.harga);
    const labelDiskon = adaDiskon ? `Diskon ${produk.diskon}%` : "Tanpa diskon";

    if (produk.stok > 0) {
      jumlahTersedia = jumlahTersedia + 1;
    }

    markup = markup + `
      <article class="js-product-card">
        <span class="stock-badge ${status.className}">${status.label}</span>
        <h3>${produk.nama}</h3>
        <p>${kategori}</p>
        <p class="price">${tampilanHarga}</p>
        <p>${labelDiskon}</p>
        <p>${labelUnggulan}</p>
        <p>${labelAksi}</p>
      </article>
    `;
  }

  grid.innerHTML = markup;
  ringkasan.textContent = `${jumlahTersedia} produk tersedia dari ${produkUmkm.length} data.`;
}

document.addEventListener("DOMContentLoaded", renderProduk);

function aktifkanMenu() {
  const tombol = document.querySelector(".nav-toggle");
  const menu = document.querySelector("#menu");

  if (!tombol || !menu) {
    return;
  }

  const label = tombol.querySelector(".sr-only");

  tombol.addEventListener("click", function () {
    const terbuka = menu.classList.toggle("is-open");
    tombol.setAttribute("aria-expanded", String(terbuka));
    if (label) {
      label.textContent = terbuka ? "Tutup menu" : "Buka menu";
    }
  });
}

document.addEventListener("DOMContentLoaded", aktifkanMenu);
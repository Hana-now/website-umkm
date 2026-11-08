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

function formatRupiah(nilai) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(nilai);
}

console.log(formatRupiah(85000));

function hitungHargaAkhir(harga, diskon) {
  return Math.round(harga * (100 - diskon) / 100);
}

function statusStok(stok) {
  if (stok <= 0) {
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
console.log(statusStok(0));
console.log(statusStok(3));
console.log(statusStok(12));

function buatKartuProduk(produk) {
  const status = statusStok(produk.stok);
  const kategori = labelKategori(produk.kategori);
  const labelAksi = produk.stok > 0 ? "Siap dipesan" : "Hubungi admin";
  const labelUnggulan = produk.unggulan ? "Produk unggulan" : "Produk reguler";

  const adaDiskon = produk.diskon > 0;
  const hargaAkhir = hitungHargaAkhir(produk.harga, produk.diskon);
  const tampilanHarga = adaDiskon
    ? `<s>${formatRupiah(produk.harga)}</s> ${formatRupiah(hargaAkhir)}`
    : formatRupiah(produk.harga);
  const labelDiskon = adaDiskon ? `Diskon ${produk.diskon}%` : "Tanpa diskon";

  return `
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

console.log(buatKartuProduk(produkUmkm[0]));

produkUmkm.forEach((produk) => {
  console.log("Debug produk:", produk.nama, "stok:", produk.stok);
});

function renderProduk() {
  const grid = document.querySelector("#produk-dinamis");
  const ringkasan = document.querySelector("#produk-ringkasan");
  const unggulan = document.querySelector("#produk-unggulan");

  if (!grid || !ringkasan) {
    return;
  }

  const produkTersedia = produkUmkm.filter((produk) => produk.stok > 0);
  const produkUnggulan = produkUmkm.find((produk) => produk.unggulan === true);
  const markupProduk = produkUmkm.map(buatKartuProduk).join("");

  console.log("Hasil filter:", produkTersedia);
  console.log("Jumlah produk tersedia:", produkTersedia.length);
  console.log("Hasil find:", produkUnggulan);

  grid.innerHTML = markupProduk;
  ringkasan.textContent = `${produkTersedia.length} produk tersedia dari ${produkUmkm.length} data.`;

  if (unggulan) {
    unggulan.textContent = produkUnggulan
      ? `Produk unggulan: ${produkUnggulan.nama}`
      : "Belum ada produk unggulan.";
  }

  console.table(produkUmkm);
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
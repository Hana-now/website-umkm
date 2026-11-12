"use strict";

console.log("P09 JavaScript aktif");

const produkUmkm = [
  { nama: "Kopi Gayo", foto: "assets/images/KopiGayo.jpg", alt: "Secangkir kopi Gayo hitam dengan biji kopi di piring", kategori: "Kopi Unggulan", harga: 15000, stok: 12, unggulan: true, diskon: 10 },
  { nama: "Kopi Tubruk", foto: "assets/images/KopiTubruk.jpg", alt: "Secangkir kopi tubruk dengan ampas di atas cangkir putih", kategori: "Kopi Tradisional", harga: 68000, stok: 8, unggulan: false, diskon: 0 },
  { nama: "Kopi Susu Gula Aren", foto: "assets/images/gula-aren.jpg", alt: "Es kopi susu gula aren di samping potongan gula aren", kategori: "Minuman Kopi", harga: 18000, stok: 5, unggulan: true, diskon: 20 },
  { nama: "Es Kopi Nusantara", foto: "assets/images/EsKopiNusantara.jpg", alt: "Es kopi Nusantara berlapis susu dan cendol hijau", kategori: "Minuman Kopi", harga: 17000, stok: 0, unggulan: false, diskon: 0 },
  { nama: "Kopi Robusta", foto: "assets/images/KopiRobusta.png", alt: "Semangkuk biji kopi robusta di atas karung goni", kategori: "Kopi Tradisional", harga: 75000, stok: 6, unggulan: false, diskon: 5 },
  { nama: "Kopi Susu Pandan", foto: "assets/images/KopiSGA.jpg", alt: "Segelas es kopi susu dengan sedotan", kategori: "Minuman Kopi", harga: 20000, stok: 4, unggulan: false, diskon: 5 },
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

//P11: DOM selection
const produkGrid = document.querySelector("#produk-grid");
const produkStatus = document.querySelector("#produk-status");
const produkUnggulan = document.querySelector("#produk-unggulan");
const produkPenghitung = document.querySelector("#produk-penghitung");
const tombolFilter = document.querySelectorAll("[data-filter]");
const tombolStok = document.querySelectorAll("[data-stok]");

//State filter aktif (kategori + status stok bekerja bersamaan)
const filterAktif = { kategori: "Semua", stok: "Semua" };

//P11: membuat satu elemen kartu produk
function buatElemenProduk(produk) {
  const card = document.createElement("article");
  card.classList.add("product-card");

  const photo = document.createElement("img");
  photo.src = produk.foto;
  photo.alt = produk.alt;
  photo.width = 600;
  photo.height = 480;
  photo.loading = "lazy";
  photo.decoding = "async";

  const title = document.createElement("h3");
  title.textContent = produk.nama;

  const category = document.createElement("p");
  category.classList.add("category-note");
  category.textContent = produk.kategori;

  const price = document.createElement("p");
  price.classList.add("price");
  if (produk.diskon > 0) {
    const hargaAsli = document.createElement("s");
    hargaAsli.textContent = formatRupiah(produk.harga);
    const hargaAkhir = document.createTextNode(formatRupiah(hitungHargaAkhir(produk.harga, produk.diskon)));
    const labelDiskon = document.createElement("span");
    labelDiskon.classList.add("discount-badge");
    labelDiskon.textContent = `Diskon ${produk.diskon}%`;
    price.append(hargaAsli, hargaAkhir, labelDiskon);
  } else {
    price.textContent = formatRupiah(produk.harga);
  }

  const stock = document.createElement("span");
  const status = statusStok(produk.stok);
  stock.classList.add("stock-badge");
  if (status.className) {
    stock.classList.add(status.className);
  }
  stock.textContent = status.label;

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.textContent = "Sembunyikan";
  removeButton.classList.add("ghost-button");
  removeButton.addEventListener("click", () => {
    card.remove();
    produkStatus.textContent = "Satu kartu disembunyikan dari tampilan sementara.";
    perbaruiPenghitung(produkGrid.querySelectorAll(".product-card").length);
  });

  card.append(photo, title, category, price, stock, removeButton);
  return card;
}

function buatEmptyState(kategori, stok = "Semua") {
  const empty = document.createElement("p");
  empty.classList.add("empty-state");
  empty.textContent = stok === "Semua"
    ? `Belum ada produk pada kategori ${kategori}.`
    : `Belum ada produk pada kategori ${kategori} dengan status stok ${stok}.`;
  return empty;
}

//Challenge: teks penghitung kategori aktif
function perbaruiPenghitung(jumlahTampil) {
  if (!produkPenghitung) {
    return;
  }

  const catatanStok = filterAktif.stok === "Semua" ? "" : `, status ${filterAktif.stok}`;
  produkPenghitung.textContent =
    `Kategori ${filterAktif.kategori}${catatanStok} menampilkan ${jumlahTampil} produk dari ${produkUmkm.length} total produk.`;
}

//P11: menggambar ulang daftar produk sesuai kategori
function renderProduk(kategoriAktif = "Semua", stokAktif = "Semua") {
  if (!produkGrid || !produkStatus) {
    console.warn("Target render produk tidak ditemukan.");
    return;
  }

  filterAktif.kategori = kategoriAktif;
  filterAktif.stok = stokAktif;

  const produkTampil = produkUmkm.filter((produk) => {
    const cocokKategori = kategoriAktif === "Semua" || produk.kategori === kategoriAktif;
    const cocokStok = stokAktif === "Semua" || statusStok(produk.stok).label === stokAktif;
    return cocokKategori && cocokStok;
  });

  produkGrid.replaceChildren();
  perbaruiPenghitung(produkTampil.length);

  if (produkTampil.length === 0) {
    produkGrid.append(buatEmptyState(kategoriAktif, stokAktif));
    produkStatus.textContent = "0 produk ditemukan.";
    return;
  }

  produkTampil.forEach((produk) => {
    produkGrid.append(buatElemenProduk(produk));
  });

  produkStatus.textContent = `${produkTampil.length} produk ditampilkan.`;
}

function tampilkanUnggulan() {
  if (!produkUnggulan) {
    return;
  }

  const unggulan = produkUmkm.find((produk) => produk.unggulan === true);
  produkUnggulan.textContent = unggulan
    ? `Produk unggulan: ${unggulan.nama}`
    : "Belum ada produk unggulan.";
}

// ===== P11: event listener filter + classList =====
function setTombolAktif(daftarTombol, tombolAktif) {
  daftarTombol.forEach((item) => {
    item.classList.remove("is-active");
    item.setAttribute("aria-pressed", "false");
  });
  tombolAktif.classList.add("is-active");
  tombolAktif.setAttribute("aria-pressed", "true");
}

tombolFilter.forEach((tombol) => {
  tombol.addEventListener("click", (event) => {
    const tombolAktif = event.currentTarget;

    setTombolAktif(tombolFilter, tombolAktif);
    renderProduk(tombolAktif.dataset.filter, filterAktif.stok);
  });
});

tombolStok.forEach((tombol) => {
  tombol.addEventListener("click", (event) => {
    const tombolAktif = event.currentTarget;

    setTombolAktif(tombolStok, tombolAktif);
    renderProduk(filterAktif.kategori, tombolAktif.dataset.stok);
  });
});

if (produkGrid) {
  renderProduk();
  tampilkanUnggulan();
}

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
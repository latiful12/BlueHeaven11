
const menus = [
    {
      id: 1,
      name: "Espresso",
      category: "Kopi",
      price: 18000,
      description: "Kopi pekat dengan aroma yang kuat.",
      image: "photo-1510707577719-ae7c14805e3a"
    },
    {
      id: 2,
      name: "Cappuccino",
      category: "Kopi",
      price: 25000,
      description: "Espresso dengan susu dan foam lembut.",
      image: "photo-1572442388796-11668a67e53d"
    },
    {
      id: 3,
      name: "Cafe Latte",
      category: "Kopi",
      price: 27000,
      description: "Kopi susu creamy untuk menemani harimu.",
      image: "photo-1461023058943-07fcbe16d735"
    },
    {
      id: 4,
      name: "Caramel Macchiato",
      category: "Kopi",
      price: 30000,
      description: "Perpaduan espresso, susu, dan karamel.",
      image: "photo-1461023058943-07fcbe16d735"
    },
    {
      id: 5,
      name: "Matcha Latte",
      category: "Non-Kopi",
      price: 28000,
      description: "Matcha dengan susu yang lembut.",
      image: "photo-1515823064-d6e0c04616a7"
    },
    {
      id: 6,
      name: "Chocolate Frappe",
      category: "Non-Kopi",
      price: 30000,
      description: "Cokelat dingin dengan tekstur creamy.",
      image: "photo-1572490122747-3968b75cc699"
    },
    
{
    id: 7,
    name: "Lemon Tea",
    category: "Non-Kopi",
    price: 18000,
    description: "Teh segar dengan sentuhan lemon.",
    image: "photo-1513558161293-cdaf765edfd7"
  },
  {
    id: 8,
    name: "Blue Ocean",
    category: "Non-Kopi",
    price: 22000,
    description: "Minuman biru menyegarkan dengan citrus.",
    image: "photo-1536935338788846bb9981813"
  },
    {
      id: 9,
      name: "Chicken Sandwich",
      category: "Makanan",
      price: 32000,
      description: "Roti lembut dengan ayam dan sayuran.",
      image: "photo-1528735602780-2552fd46c7af"
    },
    {
      id: 10,
      name: "French Fries",
      category: "Makanan",
      price: 20000,
      description: "Kentang goreng renyah dan gurih.",
      image: "photo-1573080496219-bb080dd4f877"
    },
    {
      id: 11,
      name: "Classic Pancake",
      category: "Dessert",
      price: 27000,
      description: "Pancake lembut dengan sirup manis.",
      image: "photo-1528207776546-365bb710ee93"
    },
    {
      id: 12,
      name: "Chocolate Cake",
      category: "Dessert",
      price: 28000,
      description: "Kue cokelat lembut untuk pencinta manis.",
      image: "photo-1578985545062-69928b1d9587"
    }
  ];
  
  const menuGrid = document.getElementById("menuGrid");
  const searchInput = document.getElementById("searchInput");
  const categoryList = document.getElementById("categoryList");
  const emptyState = document.getElementById("emptyState");
  
  const cartDrawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("overlay");
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");
  
  const orderDialog = document.getElementById("orderDialog");
  const orderSummary = document.getElementById("orderSummary");
  const copyStatus = document.getElementById("copyStatus");
  
  let activeCategory = "Semua";
  let searchTerm = "";
  let cart = {};
  
  function formatRupiah(amount) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(amount);
  }
  
  function getImageUrl(photoId, width = 600) {
    return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&q=80`;
  }
  
  // Menampilkan menu berdasarkan kategori dan pencarian.
  function renderMenus() {
    const filteredMenus = menus.filter(menu => {
      const matchesCategory =
        activeCategory === "Semua" ||
        menu.category === activeCategory;
  
      const matchesSearch =
        `${menu.name} ${menu.category} ${menu.description}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
  
      return matchesCategory && matchesSearch;
    });
  
    menuGrid.innerHTML = filteredMenus.map(menu => `
      <article class="menu-card">
        <div class="menu-image">
          <img
            src="${getImageUrl(menu.image)}"
            alt="${menu.name}"
            loading="lazy"
            onerror="this.onerror=null;this.src='https://placehold.co/600x400/eaf3ff/102b4e?text=Blue+Haven'"
          >
          <span class="menu-category">${menu.category}</span>
        </div>
  
        <div class="menu-info">
          <h3>${menu.name}</h3>
          <p>${menu.description}</p>
  
          <div class="menu-bottom">
            <span class="menu-price">${formatRupiah(menu.price)}</span>
            <button
              class="add-button"
              data-add="${menu.id}"
              aria-label="Tambah ${menu.name} ke pesanan"
              title="Tambah ke pesanan"
            >+</button>
          </div>
        </div>
      </article>
    `).join("");
  
    emptyState.hidden = filteredMenus.length !== 0;
  }
  
  // Filter kategori.
  categoryList.addEventListener("click", event => {
    const button = event.target.closest("[data-category]");
  
    if (!button) return;
  
    activeCategory = button.dataset.category;
  
    categoryList.querySelectorAll(".category-button").forEach(item => {
      item.classList.toggle("active", item === button);
    });
  
    renderMenus();
  });
  
  // Pencarian menu.
  searchInput.addEventListener("input", event => {
    searchTerm = event.target.value.trim();
    renderMenus();
  });
  
  // Menambahkan produk ke keranjang.
  menuGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-add]");
  
    if (!button) return;
  
    const id = Number(button.dataset.add);
    cart[id] = (cart[id] || 0) + 1;
  
    renderCart();
    button.textContent = "✓";
  
    setTimeout(() => {
      if (button.isConnected) button.textContent = "+";
    }, 500);
  });
  
  // Menghitung jumlah item dan total harga.
  function getCartDetails() {
    return Object.entries(cart)
      .map(([id, quantity]) => {
        const menu = menus.find(item => item.id === Number(id));
  
        return menu ? { ...menu, quantity } : null;
      })
      .filter(Boolean);
  }
  
  function renderCart() {
    const items = getCartDetails();
  
    const totalQuantity = items.reduce(
      (sum, item) => sum + item.quantity, 0
    );
  
    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity, 0
    );
  
    cartCount.textContent = totalQuantity;
    cartTotal.textContent = formatRupiah(totalPrice);
  
    if (items.length === 0) {
      cartItems.innerHTML = `
        <div class="cart-empty">
          <div style="font-size:36px;margin-bottom:12px">🛒</div>
          <strong>Keranjangmu masih kosong.</strong>
          <p style="margin-top:8px">Pilih menu favoritmu terlebih dahulu.</p>
        </div>
      `;
      return;
    }
  
    cartItems.innerHTML = items.map(item => `
      <div class="cart-row">
        <img src="${getImageUrl(item.image, 150)}" alt="${item.name}">
        <div class="cart-row-info">
          <h3>${item.name}</h3>
          <p>${formatRupiah(item.price * item.quantity)}</p>
        </div>
  
        <div class="quantity-controls">
          <button data-change="${item.id}" data-delta="-1"
            aria-label="Kurangi ${item.name}">−</button>
          <span>${item.quantity}</span>
          <button data-change="${item.id}" data-delta="1"
            aria-label="Tambah ${item.name}">+</button>
        </div>
      </div>
    `).join("");
  }
  
  // Mengubah jumlah produk di keranjang.
  cartItems.addEventListener("click", event => {
    const button = event.target.closest("[data-change]");
  
    if (!button) return;
  
    const id = Number(button.dataset.change);
    const delta = Number(button.dataset.delta);
  
    cart[id] = (cart[id] || 0) + delta;
  
    if (cart[id] <= 0) {
      delete cart[id];
    }
  
    renderCart();
  });
  
  // Membuka dan menutup keranjang.
  function openCart() {
    cartDrawer.classList.add("open");
    overlay.classList.add("visible");
    cartDrawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    document.getElementById("closeCart").focus();
  }
  
  function closeCart() {
    cartDrawer.classList.remove("open");
    overlay.classList.remove("visible");
    cartDrawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    document.getElementById("openCart").focus();
  }
  
  document.getElementById("openCart").addEventListener("click", openCart);
  document.getElementById("closeCart").addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);
  
  // Membuat ringkasan pesanan.
  function buildOrderSummary() {
    const items = getCartDetails();
  
    if (items.length === 0) {
      return null;
    }
  
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity, 0
    );
  
    const date = new Date().toLocaleString("id-ID");
  
    const lines = [
      "BLUE HAVEN CAFE",
      "RINGKASAN PESANAN",
      `Tanggal: ${date}`,
      "",
      ...items.map(item =>
        `${item.name} x${item.quantity} = ${formatRupiah(item.price * item.quantity)}`
      ),
      "",
      `TOTAL: ${formatRupiah(total)}`,
      "",
      "Catatan: Pesanan ini belum dikirim ke kafe."
    ];
  
    return { items, total, text: lines.join("\n") };
  }
  
  document.getElementById("checkoutButton").addEventListener("click", () => {
    const order = buildOrderSummary();
  
    if (!order) {
      alert("Keranjang masih kosong. Silakan pilih menu terlebih dahulu.");
      return;
    }
  
    orderSummary.innerHTML = `
      ${order.items.map(item => `
        <div class="summary-row">
          <span>${item.name} × ${item.quantity}</span>
          <strong>${formatRupiah(item.price * item.quantity)}</strong>
        </div>
      `).join("")}
  
      <div class="summary-row summary-total">
        <span>Total</span>
        <span>${formatRupiah(order.total)}</span>
      </div>
      <p class="dialog-note">
        Ringkasan ini hanya untuk demonstrasi dan belum menjadi transaksi nyata.
      </p>
    `;
  
    copyStatus.textContent = "";
    closeCart();
    orderDialog.showModal();
  });
  
  // Menyalin ringkasan pesanan.
  document.getElementById("copyOrder").addEventListener("click", async () => {
    const order = buildOrderSummary();
  
    if (!order) {
      copyStatus.textContent = "Keranjang kosong.";
      return;
    }
  
    try {
      await navigator.clipboard.writeText(order.text);
      copyStatus.textContent = "Ringkasan berhasil disalin!";
    } catch {
      // Alternatif jika akses clipboard tidak tersedia.
      const textarea = document.createElement("textarea");
      textarea.value = order.text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
  
      document.body.appendChild(textarea);
      textarea.select();
  
      const success = document.execCommand("copy");
      textarea.remove();
  
      copyStatus.textContent = success
        ? "Ringkasan berhasil disalin!"
        : "Gagal menyalin. Silakan coba melalui browser lain.";
    }
  });
  
  document.getElementById("closeOrder").addEventListener("click", () => {
    orderDialog.close();
  });
  
  orderDialog.addEventListener("click", event => {
    if (event.target === orderDialog) {
      orderDialog.close();
    }
  });
  
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && cartDrawer.classList.contains("open")) {
      closeCart();
    }
  });
  
  // Navigasi mobile.
  const mobileToggle = document.getElementById("mobileToggle");
  const navLinks = document.getElementById("navLinks");
  
  mobileToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("show");
    mobileToggle.setAttribute("aria-expanded", String(isOpen));
    mobileToggle.setAttribute(
      "aria-label",
      isOpen ? "Tutup navigasi" : "Buka navigasi"
    );
    mobileToggle.textContent = isOpen ? "×" : "☰";
  });
  
  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("show");
      mobileToggle.setAttribute("aria-expanded", "false");
      mobileToggle.setAttribute("aria-label", "Buka navigasi");
      mobileToggle.textContent = "☰";
    });
  });
  
  // Tahun footer dan tampilan awal.
  document.getElementById("year").textContent = new Date().getFullYear();
  
  renderMenus();
  renderCart();
document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const shopId = params.get("shop");
  const storeName = document.getElementById("storeName");
  const itemList = document.getElementById("itemList");
  const cartButton = document.getElementById("cartButton");
  const cartPopup = document.getElementById("cartPopup");
  const cartItemsDiv = document.getElementById("cartItems");
  const cartTotalDiv = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  try {
    const res = await fetch("../data/grocery-menus.json");
    const data = await res.json();
<<<<<<< HEAD
    // data.menus for correct structure!
    const shop = (data.menus || data).find((s) => 
      (s.id || s.shopId || s.providerId || s.pharmacyId).toString() === shopId
    );
=======
    const shop = data.find((s) => s.id === shopId);
>>>>>>> 5d13609e6d06b06c6b93100619b736bd835f3b3f
    if (!shop) {
      storeName.textContent = "Shop not found.";
      return;
    }
<<<<<<< HEAD
    storeName.textContent = `Order from ${shop.shop || shop.restaurant || shop.name || shop.pharmacy}`;
=======

    storeName.textContent = `Order from ${shop.name}`;
>>>>>>> 5d13609e6d06b06c6b93100619b736bd835f3b3f
    renderItems(shop.menu);
  } catch (err) {
    console.error("Error loading menu:", err);
    storeName.textContent = "Error loading items.";
  }

  function renderItems(items) {
    itemList.innerHTML = "";
    items.forEach((item) => {
      const card = document.createElement("div");
      card.classList.add("item-card");
      card.innerHTML = `
        <div class="item-left">
          <img src="${item.image}" alt="${item.name}">
          <div class="item-info">
            <h3>${item.name}</h3>
            <p>₹${item.price}</p>
          </div>
        </div>
        <div class="item-right">
          <input type="number" id="qty-${item.itemId}" min="1" value="1" />
          <button data-id="${item.itemId}" data-name="${item.name}" data-price="${item.price}">
            Add
          </button>
        </div>`;
      itemList.appendChild(card);
    });

    // Add to cart
    document.querySelectorAll(".item-right button").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = btn.dataset.id;
        const name = btn.dataset.name;
        const price = parseFloat(btn.dataset.price);
<<<<<<< HEAD
        const qtyInput = document.getElementById(`qty-${id}`);
        const qty = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
=======
        const qty = parseInt(document.getElementById(`qty-${id}`).value) || 1;
>>>>>>> 5d13609e6d06b06c6b93100619b736bd835f3b3f

        const existing = cart.find((i) => i.id === id);
        if (existing) existing.qty += qty;
        else cart.push({ id, name, price, qty });

        localStorage.setItem("cart", JSON.stringify(cart));
        alert(`${name} added to cart!`);
      });
    });
  }

  cartButton.addEventListener("click", () => {
    cartPopup.style.display = cartPopup.style.display === "block" ? "none" : "block";
    renderCart();
  });

  function renderCart() {
    cartItemsDiv.innerHTML = "";
    if (cart.length === 0) {
      cartItemsDiv.innerHTML = "<p style='text-align:center;color:#aaa;'>Cart is empty</p>";
      cartTotalDiv.textContent = "Total: ₹0";
      return;
    }

    let total = 0;
    cart.forEach((item) => {
      const div = document.createElement("div");
      div.classList.add("cart-item");
      div.innerHTML = `<span>${item.name} ×${item.qty}</span><span>₹${item.price * item.qty}</span>`;
      cartItemsDiv.appendChild(div);
      total += item.price * item.qty;
    });

    cartTotalDiv.textContent = `Total: ₹${total}`;
  }

  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    alert("✅ Order placed successfully!");
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  });
});

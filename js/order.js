const API_URL = 'http://localhost:5500/api';

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const shopId = params.get("shop");
  
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    alert('Please login to place an order');
    window.location.href = 'Login.html';
    return;
  }

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
    const shop = data.find((s) => s.id === shopId);
    if (!shop) {
      storeName.textContent = "Shop not found.";
      return;
    }

    storeName.textContent = `Order from ${shop.name}`;
    renderItems(shop.menu);
  } catch (err) {
    console.error("Error loading shop:", err);
    storeName.textContent = "Shop not found.";
  }

  // Render items
  function renderItems(items) {
    itemList.innerHTML = "";
    
    if (!items || items.length === 0) {
      itemList.innerHTML = '<p style="text-align:center;color:#ccc;">No items available</p>';
      return;
    }

    items.forEach((item) => {
      const card = document.createElement("div");
      card.classList.add("item-card");
      
      card.innerHTML = `
        <div class="item-left">
          <img src="${item.image || 'https://via.placeholder.com/60'}" alt="${item.name}">
          <div class="item-info">
            <h3>${item.name}</h3>
            <p>₹${item.base_price}</p>
          </div>
        </div>
        <div class="item-right">
          <input type="number" id="qty-${item.id}" min="1" value="1" />
          <button data-id="${item.id}" data-name="${item.name}" data-price="${item.base_price}">
            Add
          </button>
        </div>`;
      
      itemList.appendChild(card);
    });

    // Add to cart functionality
    document.querySelectorAll(".item-right button").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = btn.dataset.id;
        const name = btn.dataset.name;
        const price = parseFloat(btn.dataset.price);
        const qty = parseInt(document.getElementById(`qty-${id}`).value) || 1;

        const existing = cart.find((i) => i.id === id);
        if (existing) {
          existing.qty += qty;
        } else {
          cart.push({ id, name, price, qty });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        alert(`${name} added to cart!`);
        renderCart();
      });
    });
  }

  // Cart toggle
  cartButton.addEventListener("click", () => {
    cartPopup.style.display = cartPopup.style.display === "block" ? "none" : "block";
    renderCart();
  });

  // Render cart
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
      div.innerHTML = `
        <span>${item.name} ×${item.qty}</span>
        <span>₹${item.price * item.qty}</span>
      `;
      cartItemsDiv.appendChild(div);
      total += item.price * item.qty;
    });

    cartTotalDiv.textContent = `Total: ₹${total}`;
  }

  // Checkout - send to MySQL
  checkoutBtn.addEventListener("click", async () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const orderData = {
      provider_id: parseInt(shopId),
      total_amount: cart.reduce((sum, item) => sum + (item.price * item.qty), 0),
      delivery_address: 'User Address', // TODO: Get from user profile
      items: cart
    };

    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (response.ok) {
        alert(`✅ Order placed successfully! Order ID: ${result.orderId}`);
        cart = [];
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
        
        // Redirect to orders page or dashboard
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1500);
      } else {
        alert(`❌ Error: ${result.message || 'Order failed'}`);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  });
});

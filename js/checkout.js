const API_URL = 'http://localhost:5500/api';

document.addEventListener("DOMContentLoaded", () => {
  const orderList = document.getElementById("orderList");
  const orderTotal = document.getElementById("orderTotal");
  const checkoutForm = document.getElementById("checkoutForm");

  // Auth handling (hide/show logout button)
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const loginLink = document.getElementById("loginLink");
  const registerLink = document.getElementById("registerLink");
  const profileLink = document.getElementById("profileLink");
  const logoutLink = document.getElementById("logoutLink");

  if (isLoggedIn === "true") {
    loginLink.style.display = "none";
    registerLink.style.display = "none";
    profileLink.style.display = "inline-block";
    logoutLink.style.display = "inline-block";
  } else {
    profileLink.style.display = "none";
    logoutLink.style.display = "none";
  }

  document.getElementById("logoutBtn").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("currentUserEmail");
    localStorage.removeItem("currentUserFullName");
    alert("You have been logged out successfully!");
    window.location.href = "../index.html";
  });

  // Load cart from localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    orderList.innerHTML = `<p style="text-align:center;color:#ccc;">Your cart is empty.</p>`;
    return;
  }

  // Display ordered items
  let total = 0;
  cart.forEach((item) => {
<<<<<<< HEAD
    const qty = item.qty ? item.qty : 1;
    const div = document.createElement("div");
    div.classList.add("order-item");
    div.innerHTML = `<span>${item.name} x${qty}</span><span>₹${item.price * qty}</span>`;
    orderList.appendChild(div);
    total += item.price * qty;
=======
    const div = document.createElement("div");
    div.classList.add("order-item");
    div.innerHTML = `<span>${item.name} x${item.qty}</span><span>₹${item.price * item.qty}</span>`;
    orderList.appendChild(div);
    total += item.price * item.qty;
>>>>>>> 5d13609e6d06b06c6b93100619b736bd835f3b3f
  });
  orderTotal.textContent = `Total: ₹${total}`;

  // Handle checkout submission
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const address = document.getElementById("address").value.trim();

    if (!name || !email || !address) {
      alert("Please fill out all fields before placing your order.");
      return;
    }

    alert(`✅ Order placed successfully!\n\nThank you, ${name}!\nYour items will be delivered soon.`);
    localStorage.removeItem("cart");
    window.location.href = "../index.html";
  });
});

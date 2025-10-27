document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const service = params.get("service");
  const id = params.get("id");
  const panel = document.getElementById("bookingPanel");
  if (!service) {
    panel.innerHTML = "<p>Select a service or item to continue.</p>";
    return;
  }
  
  if (service === "plumber" || service === "electrician") {
    // Provider booking form
    panel.innerHTML = `
      <h2>Book a ${service.charAt(0).toUpperCase() + service.slice(1)} Provider</h2>
      <form id="bookingForm">
        <input type="text" id="name" placeholder="Your Name" required>
        <input type="email" id="email" placeholder="Your Email" required>
        <input type="text" id="address" placeholder="Your Address" required>
        <input type="date" id="date" required>
        <input type="time" id="time" required>
        <textarea id="workDescription" placeholder="Work Required" required></textarea>
        <button type="submit">Submit Booking</button>
      </form>
    `;
    document.getElementById("bookingForm").addEventListener("submit", function(e) {
      e.preventDefault();
      // Save booking in localStorage
      let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
      bookings.push({
        service,
        providerId: id,
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        address: document.getElementById("address").value,
        date: document.getElementById("date").value,
        time: document.getElementById("time").value,
        description: document.getElementById("workDescription").value,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem("bookings", JSON.stringify(bookings));
      alert("Booking successful!");
      this.reset();
    });
  } else {
    // Item Orders: Just show current cart/order basket
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    if (orders.length === 0) {
      panel.innerHTML = `<p>Your order basket is empty!</p>`;
      return;
    }
    let total = 0;
    let html = "<h2>Review Your Order</h2>";
    html += '<ul style="list-style:none;padding:0;">';
    orders.forEach(item => {
      total += item.price;
      html += `
        <li style="margin:8px 0;">
          <img src="${item.image}" style="width:35px;vertical-align:middle;"> 
          <strong>${item.name}</strong> from ${item.shop || item.serviceType} - ₹${item.price}
        </li>`;
    });
    html += "</ul>";
    html += `<p><strong>Total:</strong> ₹${total}</p>`;
    html += `<button id="confirmOrderBtn">Place Order</button>`;
    panel.innerHTML = html;
    
    document.getElementById("confirmOrderBtn").addEventListener("click", () => {
      localStorage.setItem("lastOrder", JSON.stringify(orders));
      localStorage.removeItem("orders");
      alert("Order placed! Thank you.");
      panel.innerHTML = "<p>Your order is confirmed! You can view it in Profile.</p>";
    });
  }
});

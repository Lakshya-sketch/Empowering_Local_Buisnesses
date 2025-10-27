document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const selectedService = params.get("service") || "plumber";

  if (["grocery", "medicine", "readytoeat", "ready-to-eat"].includes(selectedService.toLowerCase())) {
    await loadOrderData(selectedService);
  } else {
    await loadServiceData(selectedService);
  }

  updateActiveFilter(selectedService);

  // ===== hamburger toggle =====
  const hamburger = document.querySelector(".hamburger-menu");
  const mobileNav = document.querySelector(".mobile-nav");
  if (hamburger) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      mobileNav.classList.toggle("show-menu");
    });
  }
  document.querySelectorAll(".mobile-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      mobileNav.classList.remove("show-menu");
    });
  });
});

// ===================================================================
// 📦 NORMAL SERVICE PROVIDERS (BOOKING TYPE)
// ===================================================================
async function loadServiceData(serviceName) {
  try {
    const jsonFile = `../data/${serviceName}-data.json`;
    const response = await fetch(jsonFile);

    if (!response.ok) throw new Error(`Failed to load ${serviceName} data`);

    const serviceData = await response.json();
    document.getElementById("serviceTitle").textContent = serviceData.title;
    document.getElementById("serviceDescription").textContent = serviceData.description;
    document.title = `${serviceData.title} - LocalBizConnect`;

    generateProviderCards(serviceData.providers, serviceData.serviceName);
  } catch (error) {
    console.error("Error loading service data:", error);
    showErrorMessage(serviceName);
  }
}

function generateProviderCards(providers, serviceName) {
  const container = document.getElementById("providerListings");
  if (!container) return;

  container.innerHTML = "";

  if (!providers || providers.length === 0) {
    container.innerHTML = `<p style="text-align: center; color: #ccc;">No providers available.</p>`;
    return;
  }

  providers.forEach((provider) => {
    const card = createProviderCard(provider, serviceName);
    container.appendChild(card);
  });
}

function createProviderCard(provider, serviceName) {
  const card = document.createElement("div");
  card.className = "provider-card";

  const statusClass = provider.status === "available" ? "available" : "busy";
  const statusText = provider.status === "available" ? "Available" : "Busy";
  const buttonText = provider.status === "available" ? "Book Now" : "Notify Me";
  const buttonClass = provider.status === "available" ? "btn-primary" : "btn-secondary";
  const skillsHTML = provider.skills.map((s) => `<span>${s}</span>`).join("");

  card.innerHTML = `
    <div class="profile-section">
      <img src="${provider.image}" alt="${provider.name}">
      <div class="profile-info">
        <h3>${provider.name}</h3>
        <p class="location">${provider.location}</p>
      </div>
    </div>
    <div class="details-section">
      <div class="detail-item availability ${statusClass}">
        <strong>Status:</strong> <span>${statusText}</span>
      </div>
      <div class="detail-item"><strong>Experience:</strong> ${provider.experience}</div>
      <div class="detail-item"><strong>Hiring Cost:</strong> ${provider.cost}</div>
      <div class="detail-item skills">
        <strong>Skills:</strong><div>${skillsHTML}</div>
      </div>
    </div>
    <div class="action-section">
      <a href="Booking.html?service=${serviceName}">
        <button class="btn ${buttonClass}">${buttonText}</button>
      </a>
    </div>`;
  return card;
}
async function loadOrderData(category) {
  try {
    const response = await fetch("../data/grocery-menus.json");
    if (!response.ok) throw new Error("Failed to load shop data");

    const allShops = await response.json();
    const filteredShops = allShops.filter(
      (shop) =>
        (shop.category || "").replace("-", "").replace(" ", "").toLowerCase()
        === category.replace("-", "").replace(" ", "").toLowerCase()
    );

    renderOrderShops(filteredShops, category);
  } catch (error) {
    console.error("Error in loadOrderData:", error);
    showErrorMessage(category);
  }
}

function renderOrderShops(stores, category) {
  const container = document.getElementById("providerListings");
  if (!container) return;
  container.innerHTML = "";

  if (!stores || stores.length === 0) {
    container.innerHTML = `<p style="text-align:center;color:#ccc;">No ${category} shops available.</p>`;
    return;
  }

  stores.forEach((shop) => {
    const isAvailable =
      shop.status && (shop.status.toLowerCase() === "available" || shop.status.toLowerCase() === "open");
    const statusClass = isAvailable ? "available" : "busy";
    const buttonText = isAvailable ? "Order Now" : "Closed";
    const buttonClass = isAvailable ? "btn-primary" : "btn-secondary";

    const specialities =
      shop.Specialities || shop.Speciality || ["General Store"];

    const skillsHTML = specialities.map((s) => `<span>${s}</span>`).join("");

    const card = document.createElement("div");
    card.className = "provider-card";

    card.innerHTML = `
      <div class="profile-section">
        <img src="${shop.image}" alt="${shop.name}">
        <div class="profile-info">
          <h3>${shop.name}</h3>
          <p class="location">${shop.city}</p>
        </div>
      </div>
      <div class="details-section">
        <div class="detail-item availability ${statusClass}">
          <strong>Status:</strong> <span>${shop.status}</span>
        </div>
        <div class="detail-item">
          <strong>Delivery:</strong> ${shop.delivery}
        </div>
        <div class="detail-item skills">
          <strong>Specialities:</strong><div>${skillsHTML}</div>
        </div>
      </div>
      <div class="action-section">
        <button class="btn ${buttonClass}" 
                data-id="${shop.id}" 
                data-cat="${category}" 
                ${!isAvailable ? "disabled" : ""}>
          ${buttonText}
        </button>
      </div>
    `;

    container.appendChild(card);
  });

  document.querySelectorAll(".btn.btn-primary").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      const cat = e.target.dataset.cat;
      if (!id || !cat) return;
      window.location.href = `order.html?shop=${id}&category=${cat}`;
    });
  });
}

// ===================================================================
// 🧭 FILTER & ERROR HANDLING
// ===================================================================
function updateActiveFilter(serviceName) {
  document.querySelectorAll(".filter-link").forEach((link) => {
    const card = link.querySelector(".filter-card");
    if (link.dataset.service === serviceName) {
      card.classList.add("active");
    } else {
      card.classList.remove("active");
    }
  });
}

function showErrorMessage(serviceName) {
  const container = document.getElementById("providerListings");
  if (container) {
    container.innerHTML = `
      <div style="text-align:center;padding:40px;color:#ccc;">
        <h3>Unable to load ${serviceName} data</h3>
        <p>Please make sure you're running a local server.</p>
        <p style="font-size:0.9rem;color:#999;">
          Example: <code>python -m http.server 8000</code>
        </p>
      </div>`;
  }
}

const API_URL = 'http://localhost:5500/api';

// Category ID mapping
const CATEGORY_MAP = {
  'plumber': 1,
  'electrician': 2,
  'carpenter': 3,
  'grocery': 4,
  'medicine': 5,
  'readytoeat': 6,
  'ready-to-eat': 6
};

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const selectedService = params.get("service") || "plumber";

  // Load data based on service type
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
      mobileNav.classList.remove("active");
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

    generateProviderCards(providers, serviceName);
    
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
    container.innerHTML = `
      <p style="text-align: center; color: #ccc; padding: 40px;">
        No providers available at this time.
      </p>`;
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

  // Map database status to UI status
  const isAvailable = provider.status === 'active';
  const statusClass = isAvailable ? "available" : "busy";
  const statusText = isAvailable ? "Available" : "Busy";
  const buttonText = isAvailable ? "Book Now" : "Notify Me";
  const buttonClass = isAvailable ? "btn-primary" : "btn-secondary";
  
  // Extract skills from description (if available)
  const skills = provider.description ? 
    provider.description.split(',').slice(0, 3) : 
    ['Service Provider'];
  const skillsHTML = skills.map((s) => `<span>${s.trim()}</span>`).join("");

  card.innerHTML = `
    <div class="profile-section">
      <img src="${provider.profile_image || 'https://via.placeholder.com/100'}" 
           alt="${provider.name}">
      <div class="profile-info">
        <h3>${provider.name}</h3>
        <p class="location">${provider.business_address || 'Location not specified'}</p>
      </div>
    </div>
    <div class="details-section">
      <div class="detail-item availability ${statusClass}">
        <strong>Status:</strong> <span>${statusText}</span>
      </div>
      <div class="detail-item">
        <strong>Experience:</strong> ${provider.experience || 'N/A'}
      </div>
      <div class="detail-item">
        <strong>Hiring Cost:</strong> ₹${provider.hourly_rate || 'N/A'}/hr
      </div>
      <div class="detail-item skills">
        <strong>Skills:</strong><div>${skillsHTML}</div>
      </div>
    </div>
    <div class="action-section">
      <button class="btn ${buttonClass}" 
              onclick="bookProvider(${provider.id}, '${serviceName}')"
              ${!isAvailable ? 'disabled' : ''}>
        ${buttonText}
      </button>
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
    container.innerHTML = `
      <p style="text-align:center;color:#ccc;padding:40px;">
        No ${category} shops available.
      </p>`;
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
        <img src="${shop.profile_image || 'https://via.placeholder.com/100'}" 
             alt="${shop.name}">
        <div class="profile-info">
          <h3>${shop.name}</h3>
          <p class="location">${shop.business_address || 'Location not specified'}</p>
        </div>
      </div>
      <div class="details-section">
        <div class="detail-item availability ${statusClass}">
          <strong>Status:</strong> <span>${isAvailable ? 'Open' : 'Closed'}</span>
        </div>
        <div class="detail-item">
          <strong>Delivery:</strong> Available
        </div>
        <div class="detail-item skills">
          <strong>Specialities:</strong><div>${skillsHTML}</div>
        </div>
      </div>
      <div class="action-section">
        <button class="btn ${buttonClass}" 
                onclick="orderFromShop(${shop.id}, '${category}')"
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
        <p>Please ensure the backend server is running.</p>
        <p style="font-size:0.9rem;color:#999;">
          Run: <code>cd server && npm run dev</code>
        </p>
      </div>`;
  }
}

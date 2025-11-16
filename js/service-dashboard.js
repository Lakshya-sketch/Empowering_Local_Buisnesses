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

  // Mobile menu
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
// 📦 NORMAL SERVICE PROVIDERS (FROM MYSQL)
// ===================================================================
async function loadServiceData(serviceName) {
  try {
    const categoryId = CATEGORY_MAP[serviceName.toLowerCase()];
    
    if (!categoryId) {
      throw new Error('Invalid service category');
    }

    // Fetch from MySQL API
    const response = await fetch(`${API_URL}/providers?category_id=${categoryId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const providers = await response.json();
    
    // Update page title
    document.getElementById("serviceTitle").textContent = 
      `${serviceName.charAt(0).toUpperCase() + serviceName.slice(1)} Services`;
    document.getElementById("serviceDescription").textContent = 
      `Find trusted ${serviceName} providers in your area`;
    document.title = `${serviceName} Services - LocalBizConnect`;

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

function bookProvider(providerId, serviceName) {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    alert('Please login to book a service');
    window.location.href = 'Login.html';
    return;
  }
  
  window.location.href = `Booking.html?provider=${providerId}&service=${serviceName}`;
}

// ===================================================================
// 🛒 ORDERABLE SHOPS (FROM MYSQL)
// ===================================================================
async function loadOrderData(category) {
  try {
    const categoryId = CATEGORY_MAP[category.toLowerCase().replace('-', '')];
    
    if (!categoryId) {
      throw new Error('Invalid category');
    }

    // Fetch shops from MySQL API
    const response = await fetch(`${API_URL}/providers?category_id=${categoryId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const shops = await response.json();
    
    // Update page title
    document.getElementById("serviceTitle").textContent = 
      `${category.charAt(0).toUpperCase() + category.slice(1)} Stores`;
    document.getElementById("serviceDescription").textContent = 
      `Order from local ${category} providers`;

    renderOrderShops(shops, category);
    
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
    const isAvailable = shop.status === 'active';
    const statusClass = isAvailable ? "available" : "busy";
    const buttonText = isAvailable ? "Order Now" : "Closed";
    const buttonClass = isAvailable ? "btn-primary" : "btn-secondary";

    // Extract specialities from description
    const specialities = shop.description ? 
      shop.description.split(',').slice(0, 3) : 
      ['General Store'];
    const skillsHTML = specialities.map((s) => `<span>${s.trim()}</span>`).join("");

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
}

function orderFromShop(shopId, category) {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    alert('Please login to place an order');
    window.location.href = 'Login.html';
    return;
  }
  
  window.location.href = `order.html?shop=${shopId}&category=${category}`;
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

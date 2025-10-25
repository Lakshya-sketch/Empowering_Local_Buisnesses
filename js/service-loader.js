document.addEventListener("DOMContentLoaded", async () => {
    const currentPage = window.location.pathname.split('/').pop();
    let dataFile = '';

    // Map page names to JSON data files
    const pageToDataMap = {
        'carpenters.html': 'carpenter-data.json',
        'electricians.html': 'electrician-data.json',
        'Service-Template.html': 'plumber-data.json',
        'plumbers.html': 'plumbers-data.json'
    };

    dataFile = pageToDataMap[currentPage] || 'plumbers-data.json';

    try {
        // Fetch the JSON data
        const response = await fetch(dataFile);
        if (!response.ok) throw new Error('Failed to load service data');
        
        const serviceData = await response.json();

        // Update page title and description
        updatePageHeader(serviceData);

        // Generate provider cards
        generateProviderCards(serviceData.providers, serviceData.serviceName.toLowerCase());

    } catch (error) {
        console.error('Error loading service data:', error);
        showErrorMessage();
    }

    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger-menu');
    const mobileNav = document.querySelector('.mobile-nav');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('show-menu');
        });
    }
});

// Update page header with service info
function updatePageHeader(serviceData) {
    const titleElement = document.querySelector('.services-hero h1');
    const descElement = document.querySelector('.services-hero p');

    if (titleElement) titleElement.textContent = serviceData.serviceTitle;
    if (descElement) descElement.textContent = serviceData.serviceDescription;
}

// Generate provider cards dynamically
function generateProviderCards(providers, serviceName) {
    const providerListings = document.querySelector('.provider-listings');
    
    if (!providerListings) return;

    // Clear existing content
    providerListings.innerHTML = '';

    // Generate each provider card
    providers.forEach(provider => {
        const card = createProviderCard(provider, serviceName);
        providerListings.appendChild(card);
    });
}

// Create individual provider card
function createProviderCard(provider, serviceName) {
    const card = document.createElement('div');
    card.className = 'provider-card';

    // Determine status class and text
    const statusClass = provider.status === 'available' ? 'available' : 'busy';
    const statusText = provider.status === 'available' ? 'Available' : 'Busy';
    const buttonDisabled = provider.status !== 'available' ? 'disabled' : '';
    const buttonText = provider.status === 'available' ? 'Book Now' : 'Notify Me';
    const buttonClass = provider.status === 'available' ? 'btn-primary' : 'btn-secondary';

    // Generate skills HTML
    const skillsHTML = provider.skills.map(skill => `<span>${skill}</span>`).join('');

    // Build card HTML
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
            <div class="detail-item">
                <strong>Experience:</strong> ${provider.experience}
            </div>
            <div class="detail-item">
                <strong>Hiring Cost:</strong> ${provider.cost}
            </div>
            <div class="detail-item skills">
                <strong>Skills:</strong>
                <div>${skillsHTML}</div>
            </div>
        </div>
        <div class="action-section">
            <a href="booking.html?service=${serviceName}" style="text-decoration: none;">
                <button class="btn ${buttonClass}" ${buttonDisabled}>${buttonText}</button>
            </a>
        </div>
    `;

    return card;
}

// Show error message if data fails to load
function showErrorMessage() {
    const providerListings = document.querySelector('.provider-listings');
    if (providerListings) {
        providerListings.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #ccc;">
                <h3>Unable to load service providers</h3>
                <p>Please try again later or contact support.</p>
            </div>
        `;
    }
}

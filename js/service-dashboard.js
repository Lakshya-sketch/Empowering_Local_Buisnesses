document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const selectedService = params.get("service") || "plumber";

    await loadServiceData(selectedService);
    updateActiveFilter(selectedService);

    const hamburger = document.querySelector('.hamburger-menu');
    const mobileNav = document.querySelector('.mobile-nav');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('show-menu');
        });
    }

    document.querySelectorAll('.mobile-nav a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('show-menu');
        });
    });
});

async function loadServiceData(serviceName) {
    try {
        const jsonFile = `../data/${serviceName}-data.json`;
        const response = await fetch(jsonFile);
        
        if (!response.ok) {
            throw new Error(`Failed to load ${serviceName} data`);
        }
        
        const serviceData = await response.json();
        
        document.getElementById('serviceTitle').textContent = serviceData.title;
        document.getElementById('serviceDescription').textContent = serviceData.description;
        document.title = `${serviceData.title} - LocalBizConnect`;

        console.log('Loading from endpoint:', serviceData.endpoint);
        
        generateProviderCards(serviceData.providers, serviceData.serviceName);
        
    } catch (error) {
        console.error('Error loading service data:', error);
        showErrorMessage(serviceName);
    }
}

function generateProviderCards(providers, serviceName) {
    const container = document.getElementById('providerListings');
    
    if (!container) return;

    container.innerHTML = '';

    if (!providers || providers.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #ccc;">No providers available at this time.</p>';
        return;
    }

    providers.forEach(provider => {
        const card = createProviderCard(provider, serviceName);
        container.appendChild(card);
    });
}

function createProviderCard(provider, serviceName) {
    const card = document.createElement('div');
    card.className = 'provider-card';

    const statusClass = provider.status === 'available' ? 'available' : 'busy';
    const statusText = provider.status === 'available' ? 'Available' : 'Busy';
    const buttonDisabled = provider.status !== 'available' ? 'disabled' : '';
    const buttonText = provider.status === 'available' ? 'Book Now' : 'Notify Me';
    const buttonClass = provider.status === 'available' ? 'btn-primary' : 'btn-secondary';

    const skillsHTML = provider.skills.map(skill => `<span>${skill}</span>`).join('');

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
            <a href="Booking.html?service=${serviceName}" style="text-decoration: none;">
                <button class="btn ${buttonClass}" ${buttonDisabled}>${buttonText}</button>
            </a>
        </div>
    `;

    return card;
}

function updateActiveFilter(serviceName) {
    document.querySelectorAll('.filter-link').forEach(link => {
        const card = link.querySelector('.filter-card');
        if (link.dataset.service === serviceName) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });
}

function showErrorMessage(serviceName) {
    const container = document.getElementById('providerListings');
    if (container) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #ccc;">
                <h3>Unable to load ${serviceName} data</h3>
                <p>Please make sure you're running a local server.</p>
                <p style="font-size: 0.9rem; color: #999;">
                    Try: odede>python -m http.server 8000</code>
                </p>
            </div>
        `;
    }
}

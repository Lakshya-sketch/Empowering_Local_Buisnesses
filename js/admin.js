const API_URL = 'http://localhost:5500/api';

let currentSection = 'overview';
let editingId = null;
let deleteId = null;

// Category mapping
const categoryMap = {
    'plumber': 1,
    'electrician': 2,
    'carpenter': 3,
    'grocery': 4,
    'medicine': 5,
    'ready-to-eat': 6
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initializeDashboard();
    setupEventListeners();
});

// Check authentication
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');
    
    if (!isLoggedIn || userRole !== 'admin') {
        showLoginModal();
    }
}

// Show login modal
function showLoginModal() {
    const username = prompt('Enter admin username:');
    const password = prompt('Enter admin password:');
    
    if (username === 'admin@admin' && password === 'admin') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('adminName', 'Admin');
        initializeDashboard();
    } else {
        alert('Invalid credentials');
        window.location.href = '../index.html';
    }
}

// Logout function
function logout() {
    localStorage.clear();
    window.location.href = '../index.html';
}

// Initialize dashboard
async function initializeDashboard() {
    await loadDashboardStats();
    showSection('overview');
}

// Setup event listeners
function setupEventListeners() {
    // Menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const section = e.currentTarget.dataset.section;
            
            // Update active state
            document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            showSection(section);
        });
    });

    // Form submission
    const form = document.getElementById('providerForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

// Show section
function showSection(section) {
    currentSection = section;
    
    // Hide all sections
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    
    // Show selected section
    const sectionElement = document.getElementById(section);
    if (sectionElement) {
        sectionElement.classList.add('active');
    }
    
    // Load providers for service sections
    if (section !== 'overview') {
        loadProviders(section);
    }
}

// Load dashboard stats
async function loadDashboardStats() {
    try {
        const [providersRes, productsRes, servicesRes] = await Promise.all([
            fetch(`${API_URL}/providers`),
            fetch(`${API_URL}/products`),
            fetch(`${API_URL}/services`)
        ]);

        const providers = await providersRes.json();
        const products = await productsRes.json();
        const services = await servicesRes.json();

        document.getElementById('totalProviders').textContent = providers.length || 0;
        document.getElementById('totalProducts').textContent = products.length || 0;
        document.getElementById('totalServices').textContent = services.length || 0;

    } catch (error) {
        console.error('Error loading stats:', error);
        showAlert('Error loading dashboard stats');
    }
}

// Load providers for a category
async function loadProviders(section) {
    try {
        const categoryId = categoryMap[section];
        if (!categoryId) return;

        const response = await fetch(`${API_URL}/providers?category_id=${categoryId}`);
        
        if (!response.ok) {
            throw new Error('Failed to load providers');
        }

        const providers = await response.json();
        
        const gridId = `${section}Grid`;
        const grid = document.getElementById(gridId);
        
        if (!grid) return;
        
        grid.innerHTML = '';
        
        if (!providers || providers.length === 0) {
            grid.innerHTML = '<div class="no-data"><p>No providers yet. Click "Add" button to create one.</p></div>';
            return;
        }
        
        providers.forEach(provider => {
            const card = createProviderCard(provider);
            grid.appendChild(card);
        });
        
    } catch (error) {
        console.error('Error loading providers:', error);
        const grid = document.getElementById(`${section}Grid`);
        if (grid) {
            grid.innerHTML = '<div class="error-message"><p>Failed to load providers. Please try again.</p></div>';
        }
    }
}

// Create provider card
function createProviderCard(provider) {
    const card = document.createElement('div');
    card.className = 'provider-card';
    
    card.innerHTML = `
        <img src="${provider.profile_image || 'https://via.placeholder.com/200'}" 
             alt="${provider.name}"
             onerror="this.src='https://via.placeholder.com/200'">
        <h3>${provider.name}</h3>
        <p class="provider-info">
            <strong>Email:</strong> ${provider.email || 'N/A'}<br>
            <strong>Phone:</strong> ${provider.phone || 'N/A'}<br>
            <strong>Rate:</strong> ₹${provider.hourly_rate || 0}/hr<br>
            <strong>Experience:</strong> ${provider.experience || 'N/A'}
        </p>
        <span class="status-badge ${provider.status}">${provider.status || 'active'}</span>
        <div class="card-actions">
            <button onclick="editProvider(${provider.id})" class="btn-edit">✏️ Edit</button>
            <button onclick="confirmDeleteProvider(${provider.id})" class="btn-delete">🗑️ Delete</button>
        </div>
    `;
    
    return card;
}

// Open add modal
function openAddModal(section) {
    currentSection = section;
    editingId = null;
    
    document.getElementById('modalTitle').textContent = `Add New ${getSectionTitle(section)}`;
    document.getElementById('providerForm').reset();
    document.getElementById('modal').style.display = 'flex';
}

// Get section title
function getSectionTitle(section) {
    const titles = {
        'plumber': 'Plumber',
        'electrician': 'Electrician',
        'carpenter': 'Carpenter',
        'grocery': 'Grocery Shop',
        'medicine': 'Pharmacy',
        'ready-to-eat': 'Ready-to-Eat Shop'
    };
    return titles[section] || 'Provider';
}

// Close modal
function closeModal() {
    document.getElementById('modal').style.display = 'none';
    editingId = null;
}

// Handle form submit
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    const providerData = {
        name: formData.get('name'),
        email: formData.get('email') || null,
        phone: formData.get('phone') || null,
        category_id: categoryMap[currentSection],
        business_address: formData.get('location') || null,
        hourly_rate: parseFloat(formData.get('cost')) || 0,
        experience: formData.get('experience') || null,
        profile_image: formData.get('image') || null,
        status: formData.get('status') || 'active',
        description: formData.get('skills') || null
    };

    if (editingId) {
        updateProvider(editingId, providerData);
    } else {
        addProvider(providerData);
    }
}

// Add provider
async function addProvider(providerData) {
    try {
        const response = await fetch(`${API_URL}/providers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(providerData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to add provider');
        }

        showAlert('Provider added successfully!', 'success');
        closeModal();
        loadProviders(currentSection);
        loadDashboardStats();
        
    } catch (error) {
        console.error('Error adding provider:', error);
        showAlert('Failed to add provider: ' + error.message, 'error');
    }
}

// Edit provider
async function editProvider(id) {
    try {
        const response = await fetch(`${API_URL}/providers/${id}`);
        const provider = await response.json();

        if (!response.ok) {
            throw new Error('Failed to load provider details');
        }

        editingId = id;
        
        document.getElementById('modalTitle').textContent = 'Edit Provider';
        document.getElementById('name').value = provider.name;
        document.getElementById('email').value = provider.email || '';
        document.getElementById('phone').value = provider.phone || '';
        document.getElementById('location').value = provider.business_address || '';
        document.getElementById('cost').value = provider.hourly_rate || 0;
        document.getElementById('experience').value = provider.experience || '';
        document.getElementById('image').value = provider.profile_image || '';
        document.getElementById('skills').value = provider.description || '';
        document.getElementById('status').value = provider.status || 'active';
        
        document.getElementById('modal').style.display = 'flex';
        
    } catch (error) {
        console.error('Error loading provider:', error);
        showAlert('Failed to load provider details', 'error');
    }
}

// Update provider
async function updateProvider(id, providerData) {
    try {
        const response = await fetch(`${API_URL}/providers/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(providerData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to update provider');
        }

        showAlert('Provider updated successfully!', 'success');
        closeModal();
        loadProviders(currentSection);
        
    } catch (error) {
        console.error('Error updating provider:', error);
        showAlert('Failed to update provider: ' + error.message, 'error');
    }
}

// Confirm delete
function confirmDeleteProvider(id) {
    deleteId = id;
    document.getElementById('deleteModal').style.display = 'flex';
}

// Close delete modal
function closeDeleteModal() {
    document.getElementById('deleteModal').style.display = 'none';
    deleteId = null;
}

// Delete provider
async function confirmDelete() {
    if (!deleteId) return;

    try {
        const response = await fetch(`${API_URL}/providers/${deleteId}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to delete provider');
        }

        showAlert('Provider deleted successfully!', 'success');
        closeDeleteModal();
        loadProviders(currentSection);
        loadDashboardStats();
        
    } catch (error) {
        console.error('Error deleting provider:', error);
        showAlert('Failed to delete provider: ' + error.message, 'error');
    }
}

// Show alert
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
}

// Close modals on outside click
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    const deleteModal = document.getElementById('deleteModal');
    
    if (event.target === modal) {
        closeModal();
    }
    if (event.target === deleteModal) {
        closeDeleteModal();
    }
}

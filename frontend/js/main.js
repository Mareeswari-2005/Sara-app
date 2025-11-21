console.log('SARA - Smart Road Assistance loaded');

const Sara = {
  formatPhone: (phone) => {
    return phone.replace(/\D/g, '');
  },

  calculateDistance: (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
  },

  showNotification: (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `message message-${type}`;
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '1000';
    notification.style.maxWidth = '300px';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }
};

// Single Page Application (SPA) routing to prevent refreshes
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded - Initializing SPA routing');
  
  // Prevent default form submissions
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      // Only prevent if it's not a Netlify form
      if (!this.hasAttribute('data-netlify')) {
        e.preventDefault();
        console.log('Form submission handled by JavaScript');
        handleFormSubmit(this);
      }
    });
  });

  // Handle all internal navigation
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.href) {
      const href = link.getAttribute('href');
      // Check if it's an internal .html link
      if (href && href.endsWith('.html') && !href.startsWith('http')) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Internal navigation to:', href);
        loadPage(href);
        return false;
      }
    }
  });

  // Handle browser back/forward buttons
  window.addEventListener('popstate', function() {
    const path = window.location.pathname;
    console.log('Popstate - loading:', path);
    loadCurrentPage();
  });

  // Load the current page based on URL
  loadCurrentPage();
});

// Load page based on current URL
function loadCurrentPage() {
  const path = window.location.pathname;
  let page = 'login.html'; // default page
  
  if (path.includes('home') || path.includes('index')) {
    page = 'index.html';
  } else if (path.includes('mechanics')) {
    page = 'mechanics.html';
  } else if (path.includes('register')) {
    page = 'register.html';
  } else if (path.includes('emergency')) {
    page = 'emergency.html';
  } else if (path.includes('login')) {
    page = 'login.html';
  }
  
  console.log('Loading current page:', page);
  loadPage(page);
}

// Load a page without refresh
function loadPage(page) {
  console.log('Loading page:', page);
  
  // Update browser URL without reloading page
  const newUrl = window.location.origin + '/' + page;
  window.history.pushState({ page }, '', newUrl);
  
  // Show loading state
  document.body.style.opacity = '0.7';
  
  // Fetch and load the page content
  fetch(page)
    .then(response => {
      if (!response.ok) {
        throw new Error('Page not found');
      }
      return response.text();
    })
    .then(html => {
      // Parse the HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Replace content
      document.head.innerHTML = doc.head.innerHTML;
      document.body.innerHTML = doc.body.innerHTML;
      document.title = doc.title;
      
      // Re-initialize the page
      setTimeout(() => {
        document.body.style.opacity = '1';
        initializePage();
      }, 100);
    })
    .catch(error => {
      console.error('Error loading page:', error);
      document.body.style.opacity = '1';
      // Fallback to default navigation
      window.location.href = page;
    });
}

// Initialize page after load
function initializePage() {
  console.log('Initializing page:', window.location.pathname);
  
  // Re-attach all event listeners
  const buttons = document.querySelectorAll('button[type="submit"]');
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      if(this.form && !this.form.checkValidity()) {
        e.preventDefault();
        Sara.showNotification('Please fill all required fields', 'error');
      }
    });
  });
  
  // Check authentication and redirect if needed
  checkAuthAndRedirect();
}

// Check authentication status
function checkAuthAndRedirect() {
  const authManager = window.authManager;
  const currentPage = window.location.pathname;
  
  if (authManager && typeof authManager.isLoggedIn === 'function') {
    const isLoggedIn = authManager.isLoggedIn();
    
    if (isLoggedIn) {
      // User is logged in - redirect from login/register to home
      if (currentPage.includes('login.html') || currentPage.includes('register.html')) {
        console.log('Redirecting logged in user to home');
        loadPage('index.html');
      }
    } else {
      // User is not logged in - redirect to login
      if (!currentPage.includes('login.html') && !currentPage.includes('register.html')) {
        console.log('Redirecting to login');
        loadPage('login.html');
      }
    }
  }
}

// Handle form submissions
function handleFormSubmit(form) {
  console.log('Handling form submission for:', form.id || form.className);
  
  // Add your form handling logic here
  Sara.showNotification('Form submitted successfully!', 'success');
  
  // Simulate form processing
  setTimeout(() => {
    if (form.id === 'login-form') {
      loadPage('index.html');
    } else if (form.id === 'register-form') {
      loadPage('login.html');
    }
  }, 1000);
}

// Your existing utility functions
function formatPhoneNumber(phone) {
  return phone.replace(/(\d{2})(\d{4})(\d{4})/, '$1 $2 $3');
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function formatDistance(distance) {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
  `;
  
  if (type === 'success') {
    notification.style.background = '#059669';
  } else if (type === 'error') {
    notification.style.background = '#dc2626';
  } else {
    notification.style.background = '#3b82f6';
  }
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

window.saraUtils = {
  formatPhoneNumber,
  calculateDistance,
  formatDistance,
  debounce,
  showNotification,
  navigateTo: loadPage
};

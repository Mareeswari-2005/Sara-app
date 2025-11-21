class AuthManager {
  constructor() {
    this.tokenKey = 'sara_token';
    this.userKey = 'sara_user';
    this.apiBase = ''; // Use relative paths
  }

  setUser(user, token) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
    localStorage.setItem(this.tokenKey, token);
  }

  getCurrentUser() {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn() {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.tokenKey);
    // Use SPA navigation instead of full page reload
    if (typeof loadPage === 'function') {
      loadPage('login.html');
    } else {
      window.location.href = 'login.html';
    }
  }

  getAuthHeaders() {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async verifyToken() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const response = await fetch('/api/auth/check', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  }

  async login(email, password) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      const data = await response.json();
      this.setUser(data.user, data.token);
      
      // Use SPA navigation
      if (typeof loadPage === 'function') {
        loadPage('index.html');
      } else {
        window.location.href = 'index.html';
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }

      const data = await response.json();
      this.setUser(data.user, data.token);
      
      // Use SPA navigation
      if (typeof loadPage === 'function') {
        loadPage('index.html');
      } else {
        window.location.href = 'index.html';
      }
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }
}

const authManager = new AuthManager();
window.authManager = authManager;

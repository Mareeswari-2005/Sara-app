class AuthManager {
  constructor() {
    this.tokenKey = 'sara_token';
    this.userKey = 'sara_user';
  }

  
  setUser(user, token) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
    localStorage.setItem(this.tokenKey, token);
  }

  // Get current user
  getCurrentUser() {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  // Get token
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  // Check if user is logged in
  isLoggedIn() {
    return !!this.getToken();
  }

  // Logout
  logout() {
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.tokenKey);
    window.location.href = '/';
  }

  // Get headers with auth token
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
      return false;
    }
  }
}


const authManager = new AuthManager();
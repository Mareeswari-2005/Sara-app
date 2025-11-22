const authManager = {
  setUser(user, token) {
    localStorage.setItem('sara_user', JSON.stringify(user));
    localStorage.setItem('sara_token', token);
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('sara_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken() {
    return localStorage.getItem('sara_token');
  },

  isLoggedIn() {
    return !!this.getToken() && !!this.getCurrentUser();
  },

 

logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    sessionStorage.removeItem('splashShown'); 
    window.location.href = '/';
}
};

window.authManager = authManager;
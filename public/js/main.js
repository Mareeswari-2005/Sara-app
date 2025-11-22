function safeSetText(elementId, text) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = text;
  }
}

function setupAuth() {
  const currentPath = window.location.pathname;
  const isLoginPage = currentPath === '/login';
  const isSplashPage = currentPath === '/';
  
  if (!isLoginPage && !isSplashPage) {
    if (!authManager.isLoggedIn()) {
      window.location.href = '/login';
      return false;
    }

    const user = authManager.getCurrentUser();
    safeSetText('userName', user ? `Hello, ${user.name}` : '');

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        authManager.logout();
      });
    }
    
    return true;
  } else if (isLoginPage) {
    if (authManager.isLoggedIn()) {
      window.location.href = '/home';
      return false;
    }
    return true;
  }
  
  return true;
}

document.addEventListener('DOMContentLoaded', function() {
  setupAuth();
});
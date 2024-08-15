import decode from 'jwt-decode';

class AuthService {
  // Get user data from token
  getProfile() {
    return decode(this.getToken());
  }

  // Check if user is logged in
  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // Check if token is expired
  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      // Token expiration time is in seconds
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      console.error('Failed to decode token:', err);
      return true;
    }
  }

  // Get token from localStorage
  getToken() {
    return localStorage.getItem('id_token');
  }

  // Save token to localStorage and redirect to homepage
  login(idToken) {
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }

  // Clear token from localStorage and redirect to homepage
  logout() {
    localStorage.removeItem('id_token');
    window.location.assign('/');
  }
}

export default new AuthService();

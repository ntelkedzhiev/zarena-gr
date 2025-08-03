/**
 * Restricted Collection Access Script
 * 
 * This script checks if the user has authentication to view a restricted collection.
 * If the user is not authenticated, they are redirected to the landing page.
 */

(function() {
  // Configuration
  const RESTRICTED_COLLECTIONS = [
    '/collections/prolet-lyato-25',
  ];
  
  const LANDING_PAGE = '/pages/restricted-access-ss25';
  
  // Check if current page is a restricted collection
  function isRestrictedCollection() {
    const currentPath = window.location.pathname.toLowerCase();
    return RESTRICTED_COLLECTIONS.some(collection => 
      currentPath === collection || 
      currentPath === collection + '/' ||
      currentPath.startsWith(collection + '?')
    );
  }
  
  // Check if user is authenticated for the current collection
  function isAuthenticated() {
    const currentPath = window.location.pathname.toLowerCase();
    const authToken = localStorage.getItem('restrictedCollectionAuth');
    
    if (!authToken) return false;
    
    try {
      const authData = JSON.parse(authToken);
      // Check if auth data is valid without expiration check
      const isValid = authData.authenticated && 
                     (currentPath.startsWith(authData.collection) || 
                      currentPath === authData.collection);
      
      return isValid;
    } catch (e) {
      // Invalid token
      localStorage.removeItem('restrictedCollectionAuth');
      return false;
    }
  }
  
  // Redirect unauthenticated users
  function init() {
    if (isRestrictedCollection() && !isAuthenticated()) {
      window.location.href = LANDING_PAGE;
    }
  }
  
  // Run authentication check when DOM is loaded
  document.addEventListener('DOMContentLoaded', init);
})();
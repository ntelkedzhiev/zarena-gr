/* 
 * COLLECTION POPUP CONFIGURATION
 * The collection popup is disabled by default.
 * It will only show when:
 * 1. The URL parameter show_collection_popup=true is present
 * 2. The announcement bar is clicked
 * 
 * The announcement bar is always visible if COLLECTION_PREVIEW_ENABLED is true.
 * 
 * To re-enable the collection popup, just set COLLECTION_PREVIEW_ENABLED to true.
 */
const COLLECTION_PREVIEW_ENABLED = false; // Controls if announcement bar is shown
const COLLECTION_URL = '/collections/novi-letni-predlozhenia-25'; // URL of the collection

document.addEventListener('DOMContentLoaded', function() {
  // Always update the announcement bar if preview is enabled
  if (COLLECTION_PREVIEW_ENABLED) {
    updateAnnouncementBar();
    
    // Add click event to announcement bar
    setupAnnouncementBarClick();
  }
  
  // Check if we should explicitly show the popup via URL parameter
  const params = new URLSearchParams(window.location.search);
  const showCollectionPopupParam = params.get('show_collection_popup');
  
  // Only show the popup automatically if URL parameter is present
  if (COLLECTION_PREVIEW_ENABLED && showCollectionPopupParam === 'true') {
    // Show the popup after a short delay
    setTimeout(() => {
      showCollectionPopup();
    }, 500);
  }
});

// Function to check if we should show the collection popup
function checkForCollectionPopupConditions() {
  // First, check if we should show the gift popup instead (higher priority)
  const params = new URLSearchParams(window.location.search);
  const showGiftPopup = params.get('show_gift_popup');
  const popupInfl = params.get('popup_infl');
  
  // If gift popup conditions are met, don't show collection popup
  if (showGiftPopup === 'true' || popupInfl === 'zarena') {
    return false;
  }

  const customerEmail = localStorage.getItem('customerEmail');
  
  // Check if we already have the user's email
  if (customerEmail) {
    return false;
  }
  
  // Check if we're on the collection page and we don't have their email
  const currentUrl = window.location.href;
  const isOnCollectionPage = currentUrl.includes(COLLECTION_URL);
  if (isOnCollectionPage && !customerEmail) {
    return true;
  }

  if (sessionStorage.getItem('emailCollectionPopupShown') === 'true') {
    // Popup has already been shown in this session
    return false;
  }
  
  // Only show when explicitly triggered
  return false;
}

// Function to update the announcement bar text
function updateAnnouncementBar() {
  const announcementBar = document.querySelector('.cc-announcement');
  
  if (announcementBar) {
    // Add special class for styling
    announcementBar.classList.add('collection-announcement');
    
    // Update text content
    const announcementText = announcementBar.querySelector('.cc-announcement__inner');
    if (announcementText) {
      announcementText.innerHTML = 'НОВИ МОДЕЛИ! Кликни тук за достъп до ексклузивната колекция! <span class="blink-icon">→</span>';
    }
  }
}

// Function to setup click event on announcement bar
function setupAnnouncementBarClick() {
  const announcementBar = document.querySelector('.cc-announcement');
  
  if (announcementBar) {
    announcementBar.style.cursor = 'pointer';
    announcementBar.addEventListener('click', function(event) {
      event.preventDefault();
      
      // If there's a link, prevent its default behavior
      if (event.target.closest('a')) {
        event.stopPropagation();
      }
      
      // If we have the customer's email or authenticated status, just navigate
      if (localStorage.getItem('customerEmail') || checkForAuthentication()) {
        // Redirect directly to the collection
        window.location.href = COLLECTION_URL;
      } else {
        // Otherwise show the collection popup to collect email
        showCollectionPopup();
      }
    });
  }
}

// Helper function to check authentication status
function checkForAuthentication() {
  const authToken = localStorage.getItem('collectionAccessAuth');
  if (authToken) {
    try {
      const authData = JSON.parse(authToken);
      if (authData.authenticated) {
        return true;
      }
    } catch (e) {
      // Invalid token, reset it
      localStorage.removeItem('collectionAccessAuth');
    }
  }
  return false;
}

// Function to show the collection popup
function showCollectionPopup() {
  // Check if user is already authenticated - if so, don't show popup
  if (checkForAuthentication()) {
    return;
  }

  // Create popup element
  const popup = document.createElement('div');
  popup.className = 'collection-popup';
  popup.id = 'collection-popup';
  
  // Prepare HTML content for popup
  popup.innerHTML = `
    <div class="collection-popup-background"></div>
    <div class="collection-popup-content">
      <div class="collection-popup-container">
        <div class="collection-popup-image">
          <img src="https://cdn.shopify.com/s/files/1/0573/1565/5835/files/IMG_3065_441b3e5d-969c-4568-a6ac-3058ed94e18e.jpg?v=1747421686" alt="New Collection">
          <div class="collection-label">
            <span>НОВА КОЛЕКЦИЯ</span>
          </div>
        </div>
        
        <div class="collection-popup-text">
          <h2 class="collection-popup-title">Ексклузивна колекция</h2>
          
          <div id="signupStep" class="form-step active">
            <div class="collection-popup-message">
              <p>Въведи своя имейл за ексклузивен достъп до нашата нова колекция!</p>
              
              <div class="collection-features">
                <div class="feature-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#D57D1B">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                  </svg>
                  <span>Лимитирана серия</span>
                </div>
                <div class="feature-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#D57D1B">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                  </svg>
                  <span>Ексклузивни модели</span>
                </div>
                <div class="feature-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#D57D1B">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                  </svg>
                  <span>Специални отстъпки</span>
                </div>
              </div>
            </div>
            
            <div class="email-field">
              <input type="email" id="collectionPopupEmail" placeholder="Твоят имейл" required>
              <p id="emailError" class="email-error" style="display: none;">Моля, въведи валиден имейл адрес</p>
            </div>
            
            <div class="collection-popup-actions">
              <button type="button" class="collection-button" id="submitCollectionEmail">Получи достъп</button>
            </div>
          </div>
          
          <div id="thankYouStep" class="form-step">
            <div class="success-message">
              <p>Поздравления! Вече имаш достъп до нашата ексклузивна колекция.</p>
            </div>
            <div class="collection-popup-actions">
              <a href="/collections/novi-letni-predlozhenia-25" class="collection-button access-button">Разгледай колекцията сега</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Append popup to body
  document.body.appendChild(popup);
  
  // Only add event listener for background click (X button removed)
  const background = popup.querySelector('.collection-popup-background');
  background.addEventListener('click', () => {
    closeCollectionPopup();
  });
  
  // Email submission
  const submitBtn = popup.querySelector('#submitCollectionEmail');
  const emailInput = popup.querySelector('#collectionPopupEmail');
  const emailError = popup.querySelector('#emailError');
  const signupStep = popup.querySelector('#signupStep');
  const thankYouStep = popup.querySelector('#thankYouStep');
  
  submitBtn.addEventListener('click', () => {
    // Validate email
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email || !emailRegex.test(email)) {
      emailError.style.display = 'block';
      emailInput.classList.add('error');
      return;
    }
    
    // Clear any errors
    emailError.style.display = 'none';
    emailInput.classList.remove('error');
    
    // Store email in local storage
    localStorage.setItem('customerEmail', email);
    
    // Save authentication status
    const authData = {
      authenticated: true,
      timestamp: new Date().getTime()
    };
    localStorage.setItem('collectionAccessAuth', JSON.stringify(authData));
    
    // Identify user in Klaviyo
    if (window._learnq) {
      window._learnq.push(['identify', {
        $email: email
      }]);
      
      // Track event in Klaviyo
      window._learnq.push(['track', 'Entered Email for Collection Access', {
        $email: email
      }]);
    }
    
    // Show success step
    signupStep.classList.remove('active');
    thankYouStep.classList.add('active');
  });
  
  // Add styles
  addCollectionPopupStyles();
  
  // Show popup
  setTimeout(() => {
    popup.classList.add('active');

    sessionStorage.setItem('emailCollectionPopupShown', 'true');
  }, 100);
}

// Function to close the collection popup
function closeCollectionPopup() {
  const isOnCollectionPage = window.location.href.includes(COLLECTION_URL);
  const customerEmail = localStorage.getItem('customerEmail');

  if (isOnCollectionPage && !customerEmail) {
    return;
  }

  const popup = document.getElementById('collection-popup');
  if (popup) {
    popup.classList.remove('active');
    setTimeout(() => {
      popup.remove();
    }, 300);
  }
}

// Function to add styles for the collection popup
function addCollectionPopupStyles() {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .collection-popup {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2147483647;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s, visibility 0.3s;
    }
    
    .collection-popup.active {
      opacity: 1;
      visibility: visible;
    }
    
    .collection-popup-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.75);
    }
    
    .collection-popup-content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 90%;
      max-width: 650px;
      max-height: 90vh;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    
    /* Close button removed */
    
    .collection-popup-container {
      display: flex;
      flex-direction: column;
      padding: 20px;
      overflow-y: auto;
      max-height: calc(90vh - 40px);
    }
    
    .collection-popup-image {
      position: relative;
      text-align: center;
      margin-bottom: 15px;
      overflow: hidden;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    
    .collection-popup-image img {
      width: 100%;
      height: auto;
      display: block;
    }
    
    .collection-label {
      position: absolute;
      top: 15px;
      right: -50px; /* Make it extend further */
      background-color: #D57D1B;
      color: white;
      padding: 8px 40px;
      font-weight: bold;
      transform: rotate(45deg);
      font-size: 12px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      z-index: 2; /* Ensure it's above other elements */
      width: 180px; /* Set a fixed width to ensure text fits */
      text-align: center;
    }
    
    .collection-popup-title {
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 12px;
      text-align: center;
      color: #000;
    }
    
    .collection-popup-message {
      margin-bottom: 15px;
      text-align: center;
    }
    
    .collection-popup-message p {
      margin-top: 0;
      margin-bottom: 12px;
    }
    
    .form-step {
      display: none;
    }
    
    .form-step.active {
      display: block;
    }
    
    .email-field {
      margin-bottom: 15px;
    }
    
    .email-field input {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 16px;
    }
    
    .email-field input.error {
      border-color: #d82c0d;
    }
    
    .email-error {
      color: #d82c0d;
      font-size: 14px;
      margin-top: 5px;
      text-align: left;
    }
    
    .success-message {
      background-color: #f8f9fa;
      border-left: 4px solid #4CAF50;
      padding: 15px;
      margin-bottom: 20px;
      color: #4CAF50;
      font-weight: 500;
    }
    
    .collection-features {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin: 15px 0;
    }
    
    .feature-item {
      display: flex;
      align-items: center;
      font-size: 14px;
    }
    
    .feature-item svg {
      margin-right: 10px;
      color: #D57D1B;
      flex-shrink: 0;
    }
    
    .collection-popup-actions {
      text-align: center;
    }
    
    .collection-button {
      display: inline-block;
      padding: 12px 30px;
      background-color: #D57D1B;
      color: #fff;
      border-radius: 5px;
      border: 1px solid #D57D1B;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s;
      cursor: pointer;
      outline: none;
      width: 100%;
    }
    
    .collection-button:hover {
      background-color: #B16615;
      border-color: #000;
    }
    
    .access-button {
      background-color: #32a852; /* Green for proceed/continue */
      border-color: #32a852;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      animation: bounce 1.5s infinite;
    }
    
    .access-button:hover {
      background-color: #268c40;
      border-color: #268c40;
    }
    
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-5px);
      }
      60% {
        transform: translateY(-2px);
      }
    }
    
    /* Special styling for the announcement bar */
    .collection-announcement {
      background-color: #D57D1B !important;
      color: white !important;
      animation: pulse-announcement 2s infinite;
    }
    
    .collection-announcement a,
    .collection-announcement .cc-announcement__inner {
      color: white !important;
    }
    
    .blink-icon {
      display: inline-block;
      animation: blink-animation 1s steps(5, start) infinite;
      font-weight: bold;
      font-size: 18px;
    }
    
    @keyframes blink-animation {
      to {
        visibility: hidden;
      }
    }
    
    @keyframes pulse-announcement {
      0% {
        box-shadow: 0 0 0 0 rgba(213, 125, 27, 0.4);
      }
      70% {
        box-shadow: 0 0 0 10px rgba(213, 125, 27, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(213, 125, 27, 0);
      }
    }
    
    @media (min-width: 768px) {
      .collection-popup-container {
        flex-direction: row;
        padding: 30px;
      }
      
      .collection-popup-image {
        flex: 0 0 250px;
        margin-right: 30px;
        margin-bottom: 0;
        max-height: 350px;
        overflow: hidden;
      }
      
      .collection-popup-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .collection-popup-title {
        font-size: 24px;
        margin-bottom: 15px;
        text-align: left;
      }
      
      .collection-popup-message {
        text-align: left;
      }
      
      .collection-features {
        align-items: flex-start;
      }
      
      .collection-popup-text {
        flex: 1;
      }
      
      .collection-popup-actions {
        text-align: left;
      }
    }
  `;
  
  document.head.appendChild(styleElement);
}
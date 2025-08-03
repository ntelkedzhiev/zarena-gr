document.addEventListener('DOMContentLoaded', function() {
  // Check for gift popup parameter in URL
  const showGiftPopup = checkForGiftPopupParam();
  
  // Show popup if parameter is present
  if (showGiftPopup) {
    // Show the popup after a short delay
    setTimeout(() => {
      showGiftClaimPopup();
    }, 350);
  }
});

// Function to check for the gift popup parameter in URL
function checkForGiftPopupParam() {
  const params = new URLSearchParams(window.location.search);
  const showGiftPopup = params.get('show_gift_popup');
  const popupInfl = params.get('popup_infl');
  
  // Always show gift popup if show_gift_popup=true
  if (showGiftPopup === 'true') {
    return true;
  }
  
  // Don't show gift popup for popup_infl=zarena
  if (popupInfl === 'zarena') {
    return false; // Never show gift popup for zarena
  }
  
  return false;
}

// Function to show the gift claim popup
function showGiftClaimPopup() {
  // Create popup element
  const popup = document.createElement('div');
  popup.className = 'gift-popup';
  popup.id = 'gift-popup';
  
  // Prepare HTML content for popup
  popup.innerHTML = `
    <div class="gift-popup-background"></div>
    <div class="gift-popup-content">
      <button type="button" class="gift-popup-close">×</button>
      
      <div class="gift-popup-container">
        <div class="gift-popup-product-image">
          <img src="https://zarenabags.com/cdn/shop/files/DSC4569_1.jpg?v=1738576806" alt="Чантичка за телефон с принт">
          <div class="gift-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#c81853">
              <path d="M20,7h-4.2c0.1-0.3,0.2-0.6,0.2-1c0-1.7-1.3-3-3-3c-1,0-1.8,0.5-2.4,1.2C10,3.5,9.2,3,8.1,3C6.3,3,5,4.3,5,6c0,0.4,0.1,0.7,0.2,1H1C0.4,7,0,7.4,0,8v3c0,0.6,0.4,1,1,1h1v8c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2v-8h1c0.6,0,1-0.4,1-1V8C24,7.4,23.6,7,23,7zM13,4c0.6,0,1,0.4,1,1c0,0.6-0.4,1-1,1h-2C11,4.9,11.9,4,13,4zM8,6c0-0.6,0.4-1,1-1c0.6,0,1,0.4,1,1H8zM2,10V8h10v2H2zM4,12h8v8H4V12zM20,20h-6v-8h6V20zM22,10H12V8h10V10z"/>
            </svg>
          </div>
        </div>
        
        <div class="gift-popup-text">
          <h2 class="gift-popup-title">Ти спечели подарък!</h2>
          
          <div class="gift-popup-message">
            <p>Въведи твоя имейл и ще получиш специален код за твоя подарък!</p>
            
            <div class="gift-discount">
              <div class="discount-item discount-item--highlight">
                <div class="tiered-discounts">
                  <div class="discount-row">
                    <img class="discount-icon" src="https://cdn.shopify.com/s/files/1/0573/1565/5835/files/gift-box.png" alt="Gift icon">
                    <div class="discount-text discount-text--large discount-text--bold">
                      <span>Твоят специален подарък те очаква!</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="gift-popup-form">
            <div class="email-field">
              <input type="email" id="giftPopupEmail" placeholder="Твоят имейл" required>
              <p id="emailError" class="email-error" style="display: none;">Моля, въведи валиден имейл адрес</p>
            </div>
            <div class="gift-popup-actions">
              <button type="button" class="gift-button" id="submitGiftEmail">Вземи своя подарък</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Append popup to body
  document.body.appendChild(popup);
  
  // Add event listeners
  const closeBtn = popup.querySelector('.gift-popup-close');
  closeBtn.addEventListener('click', () => {
    closeGiftPopup();
  });
  
  // Also close when clicking on background
  const background = popup.querySelector('.gift-popup-background');
  background.addEventListener('click', () => {
    closeGiftPopup();
  });

  // Email submission
  const submitBtn = popup.querySelector('#submitGiftEmail');
  const emailInput = popup.querySelector('#giftPopupEmail');
  const emailError = popup.querySelector('#emailError');
  
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
    
    // Identify user in Klaviyo
    if (window._learnq) {
      window._learnq.push(['identify', {
        $email: email
      }]);
      
      // Track event in Klaviyo
      window._learnq.push(['track', 'Entered Email on Gift Popup', {
        $email: email
      }]);
    }
    
    // Show success message
    const formContainer = popup.querySelector('.gift-popup-form');
    const messageContainer = popup.querySelector('.gift-popup-message');
    
    // Clear the "enter your email" text
    messageContainer.innerHTML = '';
    
    // Update form with success message
    formContainer.innerHTML = `
      <div class="success-message">
        <p>Твоят подарък е на път! Провери имейла си за специален код.</p>
        <p>Въведи този код при плащане и ще получиш подаръка си!</p>
      </div>
      <div class="gift-popup-actions">
        <button type="button" class="continue-button" onclick="closeGiftPopup()">
          <span>Продължи пазаруването</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14"></path>
            <path d="M12 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    `;
  });
  
  // Add styles
  addGiftPopupStyles();
  
  // Show popup
  setTimeout(() => {
    popup.classList.add('active');
    // Mark email collection popup as shown for this session
    sessionStorage.setItem('emailCollectionPopupShown', 'true');
  }, 100);
}

// Function to close the gift popup
function closeGiftPopup() {
  const popup = document.getElementById('gift-popup');
  if (popup) {
    popup.classList.remove('active');
    setTimeout(() => {
      popup.remove();
    }, 300);
  }
}

// Function to add styles for the gift popup
function addGiftPopupStyles() {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .gift-popup {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2147483647; /* Maximum possible z-index value to ensure it's above all other elements */
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s, visibility 0.3s;
    }
    
    .gift-popup.active {
      opacity: 1;
      visibility: visible;
    }
    
    .gift-popup-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.75);
    }
    
    .gift-popup-content {
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
    
    .gift-popup-close {
      position: absolute;
      top: 15px;
      right: 15px;
      width: 30px;
      height: 30px;
      background: none;
      border: none;
      font-size: 24px;
      line-height: 30px;
      text-align: center;
      cursor: pointer;
      z-index: 10;
    }
    
    .gift-popup-container {
      display: flex;
      flex-direction: column;
      padding: 20px;
      overflow-y: auto;
      max-height: calc(90vh - 40px);
    }
    
    .gift-popup-product-image {
      position: relative;
      text-align: center;
      margin-bottom: 15px;
      overflow: hidden;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    
    .gift-popup-product-image:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(200, 24, 83, 0.4);
      z-index: 1;
    }
    
    .gift-popup-product-image:after {
      content: '?';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 80px;
      font-weight: bold;
      color: rgba(255, 255, 255, 0.8);
      z-index: 2;
    }
    
    .gift-popup-product-image img {
      width: 100%;
      height: auto;
      display: block;
      filter: blur(8px) grayscale(50%);
    }
    
    .gift-icon {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 60px;
      height: 60px;
      background-color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
      z-index: 3;
      animation: pulse 2s infinite;
    }
    
    .gift-icon svg {
      width: 40px;
      height: 40px;
    }
    
    @keyframes pulse {
      0% {
        transform: scale(1);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
      }
      50% {
        transform: scale(1.1);
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.35);
      }
      100% {
        transform: scale(1);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
      }
    }
    
    .gift-popup-title {
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 12px;
      text-align: center;
      color: #c81853;
    }
    
    .gift-popup-message {
      margin-bottom: 15px;
      text-align: center;
    }
    
    .gift-popup-message p {
      margin-top: 0;
      margin-bottom: 12px;
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
    
    .discount-row, .discount-text {
      text-align: left;
    }
    
    .gift-discount {
      margin: 15px 0;
      background-color: #f9f9f9;
      border-radius: 8px;
      padding: 12px;
    }
    
    .discount-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 15px;
    }
    
    .discount-item--highlight {
      background-color: #fff4f7;
      border-radius: 6px;
      padding: 10px;
      margin: -5px -5px 15px -5px;
      border: 1px solid #ffcad8;
    }
    
    .discount-item:last-child {
      margin-bottom: 0;
    }
    
    .discount-icon {
      width: 34px;
      height: 34px;
      margin-right: 10px;
      flex-shrink: 0;
      margin-top: 0;
    }
    
    .discount-row .discount-icon {
      margin-top: 3px;
    }
    
    .tiered-discounts {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .discount-row {
      display: flex;
      align-items: center;
    }
    
    .discount-text {
      font-size: 13px;
      line-height: 1.4;
    }
    
    .discount-text--large {
      font-size: 14px;
      font-weight: 500;
    }
    
    .discount-text--bold {
      font-weight: 700;
    }
    
    .gift-popup-actions {
      text-align: center;
    }
    
    .gift-button {
      display: inline-block;
      padding: 12px 30px;
      background-color: #c81853;
      color: #fff;
      border-radius: 5px;
      border: 1px solid #c81853;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s;
      cursor: pointer;
      outline: none;
      width: 100%;
    }
    
    .gift-button:hover {
      background-color: #a01445;
      border-color: #000;
    }
    
    .continue-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 14px 30px;
      background-color: #32a852; /* Green for proceed/continue */
      color: #fff;
      border-radius: 5px;
      border: none;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s;
      cursor: pointer;
      outline: none;
      width: 100%;
      animation: bounce 1.5s infinite;
    }
    
    .continue-button:hover {
      background-color: #268c40;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
    
    .continue-button svg {
      transition: transform 0.3s;
    }
    
    .continue-button:hover svg {
      transform: translateX(5px);
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
    
    @media (min-width: 768px) {
      .gift-popup-container {
        flex-direction: row;
        padding: 30px;
      }
      
      .gift-popup-product-image {
        flex: 0 0 250px;
        margin-right: 30px;
        margin-bottom: 0;
        max-height: 350px;
        overflow: hidden;
      }
      
      .gift-popup-product-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .gift-popup-title {
        font-size: 24px;
        margin-bottom: 15px;
      }
      
      .gift-discount {
        margin: 20px 0;
        padding: 15px;
      }
      
      .discount-item--highlight {
        padding: 12px;
      }
      
      .discount-text {
        font-size: 14px;
      }
      
      .discount-text--large {
        font-size: 15px;
      }
      
      .gift-popup-text {
        flex: 1;
      }
      
      .gift-popup-title {
        text-align: left;
      }
      
      .gift-popup-message {
        text-align: left;
      }
      
      .gift-popup-actions {
        text-align: left;
      }
      
      .gift-button {
        width: 100%;
        padding-left: 0;
        padding-right: 0;
        text-align: center;
      }
    }
  `;
  
  document.head.appendChild(styleElement);
}
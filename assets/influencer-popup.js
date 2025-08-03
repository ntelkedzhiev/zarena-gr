document.addEventListener('DOMContentLoaded', function() {
  // Check for influencer UTM parameters in URL
  const influencerCode = getInfluencerCodeFromUtm();
  
  if (influencerCode) {
    // For 'zarena' or any other influencer code, show the influencer popup
    setTimeout(() => {
      showInfluencerPopup(influencerCode);
    }, 350);
  }
});

// Function to get influencer code from UTM parameters
function getInfluencerCodeFromUtm() {
  const params = new URLSearchParams(window.location.search);
  const influencer = params.get('popup_infl');
  
  // Check if the influencer parameter exists
  if (influencer) {
    return influencer.toLowerCase();
  }
  
  return null;
}

// Function to show the influencer popup
function showInfluencerPopup(code) {
  // Get the influencer config
  const influencerConfig = window.influencerConfig && window.influencerConfig[code] 
    ? window.influencerConfig[code] 
    : null;
  
  if (!influencerConfig) {
    console.error('No configuration found for influencer code:', code);
    return;
  }
  
  // Create popup element
  const popup = document.createElement('div');
  popup.className = 'influencer-popup';
  popup.id = 'influencer-popup';
  
  // Prepare HTML content for popup
  popup.innerHTML = `
    <div class="influencer-popup-background"></div>
    <div class="influencer-popup-content">
      <button type="button" class="influencer-popup-close">×</button>
      
      <div class="influencer-popup-container">
        <div class="influencer-popup-image">
          <img src="${influencerConfig.profilePic}" alt="${influencerConfig.name}">
        </div>
        
        <div class="influencer-popup-text">
          <h2 class="influencer-popup-title">Специална оферта от ${influencerConfig.name}</h2>
          
          <div class="influencer-popup-message">
            <p>Благодарим, че използваш моя специален линк! Ето твоите ексклузивни отстъпки:</p>
            
            <div class="influencer-discount">
              <div class="discount-item discount-item--highlight">
                <div class="tiered-discounts">
                  <div class="discount-row">
                    <img class="discount-icon" src="https://cdn.shopify.com/s/files/1/0573/1565/5835/files/sale-icon-full-colored.png?v=1743522049" alt="Discount icon">
                    <div class="discount-text discount-text--large discount-text--bold">
                      <span class="discount-percent discount-percent--black">-10%</span> <strong>отстъпка при поръчка над 200 лв.</strong>
                    </div>
                  </div>
                  <div class="discount-row">
                    <img class="discount-icon" src="https://cdn.shopify.com/s/files/1/0573/1565/5835/files/sale-icon-full-colored.png?v=1743522049" alt="Discount icon">
                    <div class="discount-text discount-text--large discount-text--highlight">
                      <span class="discount-percent">-20%</span> ексклузивна отстъпка при поръчка над 350 лв.
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="discount-item discount-item--gift">
                <img class="discount-icon" src="https://cdn.shopify.com/s/files/1/0573/1565/5835/files/gift-box.png?v=1743522070" alt="Gift icon">
                <span class="discount-text">+ Подарък <a href="https://zarenabags.com/products/%D1%87%D0%B0%D0%BD%D1%82%D0%B8%D1%87%D0%BA%D0%B0-%D0%B7%D0%B0-%D1%82%D0%B5%D0%BB%D0%B5%D1%84%D0%BE%D0%BD-%D1%81-%D0%BF%D1%80%D0%B8%D0%BD%D1%82">чантичка за телефон</a> при поръчка над 300 лв.</span>
              </div>
            </div>
          </div>
          
          <div class="influencer-popup-actions">
            <button type="button" class="influencer-button" onclick="closeInfluencerPopup()">Разгледай продуктите</button>
            <div class="auto-discount-note">Отстъпката ще бъде приложена автоматично при добавяне в количката.</div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Append popup to body
  document.body.appendChild(popup);
  
  // Add event listeners
  const closeBtn = popup.querySelector('.influencer-popup-close');
  closeBtn.addEventListener('click', () => {
    closeInfluencerPopup();
  });
  
  // Also close when clicking on background
  const background = popup.querySelector('.influencer-popup-background');
  background.addEventListener('click', () => {
    closeInfluencerPopup();
  });
  
  // Add styles
  addInfluencerPopupStyles();
  
  // Show popup
  setTimeout(() => {
    popup.classList.add('active');
  }, 100);
}

// Function to close the influencer popup
function closeInfluencerPopup() {
  const popup = document.getElementById('influencer-popup');
  if (popup) {
    popup.classList.remove('active');
    setTimeout(() => {
      popup.remove();
    }, 300);
  }
}

// Function to add styles for the influencer popup
function addInfluencerPopupStyles() {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .influencer-popup {
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
    
    .influencer-popup.active {
      opacity: 1;
      visibility: visible;
    }
    
    .influencer-popup-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.75);
    }
    
    .influencer-popup-content {
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
    
    .influencer-popup-close {
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
    
    .influencer-popup-container {
      display: flex;
      flex-direction: column;
      padding: 20px;
      overflow-y: auto;
      max-height: calc(90vh - 40px);
    }
    
    .influencer-popup-image {
      text-align: center;
      margin-bottom: 15px;
    }
    
    .influencer-popup-image img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid #c81853;
    }
    
    .influencer-popup-title {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 12px;
      text-align: center;
      color: #c81853;
    }
    
    .influencer-popup-message {
      margin-bottom: 15px;
      text-align: center;
    }
    
    .influencer-popup-message p {
      margin-top: 0;
      margin-bottom: 12px;
    }
    
    .discount-row, .discount-text {
      text-align: left;
    }
    
    .influencer-discount {
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
    
    .discount-item--gift {
      font-size: 13px;
      opacity: 0.9;
      border-top: 1px dashed #e8e8e8;
      padding-top: 12px;
      margin-top: 5px;
      text-align: left;
      display: flex;
      align-items: center;
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
    
    .discount-text--highlight {
      color: #c81853;
      font-weight: 700;
    }
    
    .discount-percent {
      font-weight: 700;
      color: #c81853;
      font-size: 18px;
    }
    
    .discount-percent--black {
      color: #000000;
    }
    
    .discount-text a {
      color: #c81853;
      text-decoration: underline;
    }
    
    .influencer-popup-actions {
      text-align: center;
    }
    
    .influencer-button {
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
    }
    
    .influencer-button:hover {
      background-color: #a01445;
      border-color: #000;
    }
    
    .auto-discount-note {
      font-size: 14px;
      color: #666;
      margin-top: 12px;
      font-style: italic;
      text-align: center;
    }
    
    @media (min-width: 768px) {
      .influencer-popup-container {
        flex-direction: row;
        padding: 30px;
      }
      
      .influencer-popup-image {
        flex: 0 0 150px;
        margin-right: 30px;
        margin-bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .influencer-popup-image img {
        width: 120px;
        height: 120px;
      }
      
      .influencer-popup-title {
        font-size: 22px;
        margin-bottom: 15px;
      }
      
      .influencer-discount {
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
      
      .influencer-popup-text {
        flex: 1;
      }
      
      .influencer-popup-title {
        text-align: left;
      }
      
      .influencer-popup-message {
        text-align: left;
      }
      
      .influencer-popup-actions {
        text-align: left;
      }
      
      .influencer-button {
        width: 100%;
        padding-left: 0;
        padding-right: 0;
        text-align: center;
      }
      
      .auto-discount-note {
        text-align: left;
      }
    }
  `;
  
  document.head.appendChild(styleElement);
}
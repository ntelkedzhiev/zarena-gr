document.addEventListener('DOMContentLoaded', function() {
  // Check for bestsellers flash sale parameter or zarena influencer parameter in URL
  const params = new URLSearchParams(window.location.search);
  const showBestsellers = params.get('popup_bestsellers');
  const influencerCode = params.get('popup_infl');
  
  if (showBestsellers || influencerCode === 'zarena') {
    setTimeout(() => {
      showBestsellersPopup();
    }, 350);
  }
});

// Function to show the bestsellers flash sale popup
function showBestsellersPopup() {
  // Create popup element
  const popup = document.createElement('div');
  popup.className = 'bestsellers-popup';
  popup.id = 'bestsellers-popup';
  
  // Prepare HTML content for popup
  popup.innerHTML = `
    <div class="bestsellers-popup-background"></div>
    <div class="bestsellers-popup-content">
      <button type="button" class="bestsellers-popup-close">×</button>
      
      <div class="bestsellers-popup-container">
        <div class="bestsellers-popup-text">
          <h2 class="bestsellers-popup-title">BEST SELLERS на -25% СЕГА</h2>
          
          <div class="bestsellers-popup-message">
            <p>Ограничено време! Специална отстъпка на най-продаваните продукти.</p>
            
            <div class="bestsellers-discount">
              <div class="discount-item discount-item--highlight">
                <div class="flash-discount-row">
                  <div class="discount-badge">
                    <span class="discount-percent">-25%</span>
                  </div>
                  <div class="discount-details">
                    <div class="discount-text discount-text--large discount-text--bold">
                      25% отстъпка с код <strong>BEST25</strong>
                    </div>
                    <div class="limited-time">⏰ Ограничено време - Не чакай!</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bestsellers-popup-actions">
            <button type="button" class="bestsellers-button" onclick="closeBestsellersPopup()">ВЪЗПОЛЗВАЙ СЕ СЕГА</button>
            <div class="disclaimer-note">Въведи код BEST25 при финализиране на поръчката за да получиш отстъпката. Важи за определени продукти.</div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Append popup to body
  document.body.appendChild(popup);
  
  // Add event listeners
  const closeBtn = popup.querySelector('.bestsellers-popup-close');
  closeBtn.addEventListener('click', () => {
    closeBestsellersPopup();
  });
  
  // Also close when clicking on background
  const background = popup.querySelector('.bestsellers-popup-background');
  background.addEventListener('click', () => {
    closeBestsellersPopup();
  });
  
  // Add styles
  addBestsellersPopupStyles();
  
  // Show popup
  setTimeout(() => {
    popup.classList.add('active');
  }, 100);
}

// Function to close the bestsellers popup
function closeBestsellersPopup() {
  const popup = document.getElementById('bestsellers-popup');
  if (popup) {
    popup.classList.remove('active');
    setTimeout(() => {
      popup.remove();
    }, 300);
  }
}

// Function to add styles for the bestsellers popup
function addBestsellersPopupStyles() {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .bestsellers-popup {
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
    
    .bestsellers-popup.active {
      opacity: 1;
      visibility: visible;
    }
    
    .bestsellers-popup-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, rgba(249, 202, 36, 0.9), rgba(240, 147, 43, 0.9));
    }
    
    .bestsellers-popup-content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 90%;
      max-width: 650px;
      max-height: 90vh;
      background-color: #fff;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      animation: popupEnter 0.3s ease-out;
    }
    
    @keyframes popupEnter {
      from {
        transform: translate(-50%, -50%) scale(0.8);
        opacity: 0;
      }
      to {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
      }
    }
    
    .bestsellers-popup-close {
      position: absolute;
      top: 0px;
      right: 4px;
      width: 40px;
      height: 40px;
      background: transparent;
      border: none;
      font-size: 30px;
      line-height: 40px;
      text-align: center;
      cursor: pointer;
      z-index: 10;
      color: #333;
      font-weight: bold;
    }
    
    .bestsellers-popup-close:hover {
      color: #000;
    }
    
    .bestsellers-popup-container {
      display: flex;
      flex-direction: column;
      padding: 25px;
      overflow-y: auto;
      max-height: calc(90vh - 50px);
    }
    
    .bestsellers-popup-image {
      text-align: center;
      margin-bottom: 20px;
    }
    
    .flash-sale-badge {
      display: inline-block;
      background: linear-gradient(135deg, #f9ca24, #f0932b);
      color: #333;
      padding: 12px 20px;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 3px 10px rgba(249, 202, 36, 0.3);
    }
    
    .flash-sale-text {
      display: block;
      font-size: 12px;
      font-weight: 500;
      letter-spacing: 2px;
      margin-bottom: 2px;
    }
    
    .bestsellers-text {
      display: block;
      font-size: 14px;
      font-weight: 700;
      line-height: 1.3;
      text-align: center;
    }
    
    .bestsellers-popup-title {
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 15px;
      text-align: center;
      color: #333;
      border-bottom: 3px solid #f9ca24;
      padding-bottom: 8px;
      display: inline-block;
      width: 100%;
    }
    
    .bestsellers-popup-message {
      margin-bottom: 20px;
      text-align: center;
    }
    
    .bestsellers-popup-message p {
      margin-top: 0;
      margin-bottom: 15px;
      font-size: 16px;
      color: #333;
    }
    
    .bestsellers-discount {
      margin: 20px 0;
      background: #fffbf0;
      border-radius: 8px;
      padding: 20px;
      border: 2px solid #f9ca24;
    }
    
    .discount-item--highlight {
      background: transparent;
      border-radius: 8px;
      padding: 0;
      margin: 0;
      border: none;
    }
    
    .flash-discount-row {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    
    .discount-badge {
      flex-shrink: 0;
      background: linear-gradient(135deg, #f9ca24, #f0932b);
      color: #333;
      border-radius: 50%;
      width: 70px;
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 3px 10px rgba(249, 202, 36, 0.3);
    }
    
    .discount-percent {
      font-size: 20px;
      font-weight: 800;
      color: #333;
    }
    
    .discount-details {
      flex: 1;
      text-align: left;
    }
    
    .discount-text--large {
      font-size: 18px;
      font-weight: 700;
      color: #333;
      margin-bottom: 8px;
      line-height: 1.3;
    }
    
    .limited-time {
      font-size: 16px;
      color: #f0932b;
      font-weight: 600;
      margin-top: 5px;
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.6; }
      100% { opacity: 1; }
    }
    
    .bestsellers-popup-actions {
      text-align: center;
    }
    
    .bestsellers-button {
      display: inline-block;
      padding: 12px 30px;
      background: linear-gradient(135deg, #f9ca24, #f0932b);
      color: #333;
      border-radius: 6px;
      border: none;
      font-weight: 700;
      font-size: 15px;
      text-decoration: none;
      transition: all 0.3s;
      cursor: pointer;
      outline: none;
      box-shadow: 0 3px 10px rgba(249, 202, 36, 0.3);
    }
    
    .bestsellers-button:hover {
      background: linear-gradient(135deg, #f0932b, #f9ca24);
      transform: translateY(-1px);
      box-shadow: 0 5px 15px rgba(249, 202, 36, 0.4);
    }
    
    .disclaimer-note {
      font-size: 12px;
      color: #666;
      margin-top: 15px;
      text-align: center;
      line-height: 1.4;
      font-weight: 500;
    }
    
    @media (min-width: 768px) {
      .bestsellers-popup-container {
        padding: 40px;
      }
      
      .bestsellers-popup-title {
        font-size: 24px;
        margin-bottom: 20px;
        text-align: center;
        border-bottom: 4px solid #f9ca24;
        padding-bottom: 10px;
        width: 100%;
      }
      
      .bestsellers-popup-message {
        text-align: center;
      }
      
      .bestsellers-popup-message p {
        font-size: 17px;
      }
      
      .bestsellers-discount {
        margin: 25px 0;
        padding: 25px;
      }
      
      .flash-discount-row {
        gap: 25px;
      }
      
      .discount-badge {
        width: 80px;
        height: 80px;
      }
      
      .discount-percent {
        font-size: 22px;
      }
      
      .discount-text--large {
        font-size: 20px;
      }
      
      .bestsellers-popup-text {
        flex: 1;
      }
      
      .bestsellers-popup-actions {
        text-align: center;
      }
      
      .bestsellers-button {
        padding: 15px 40px;
        font-size: 16px;
      }
      
      .disclaimer-note {
        text-align: center;
        font-size: 13px;
      }
    }
  `;
  
  document.head.appendChild(styleElement);
}
document.addEventListener('DOMContentLoaded', function() {
    // Function to get URL parameter
    const promoCodeFromUrl = getPromoCodeFromUrl();
    if (promoCodeFromUrl) {
        setPromoCode(promoCodeFromUrl)
    }
});

function setPromoCode(promoCode) {
    const now = new Date();

    const data = {
        value: promoCode,
        expiry: now.getTime() + 3*24*60*60*1000,
    };

    localStorage.setItem('promo_code', JSON.stringify(data));
}

function getPromoCodeFromUrl() {
    function getURLParams(paramName) {
        var params = new URLSearchParams(window.location.search);
        return params.get(paramName);
    }

    const promoCodeParam = getURLParams('promo_code'); 
    return promoCodeParam;
}

function getPromoCodeFromLocalStorage() {
    const promoCodeStr = localStorage.getItem('promo_code');
    if (!promoCodeStr) {
      return null;
    }

    const promoCodeObj = JSON.parse(promoCodeStr);
    const now = new Date();

    if (now.getTime() > promoCodeObj.expiry) {
      localStorage.removeItem('promo_code');
      return null;
    }

    return promoCodeObj.value;
}

function addPromoCodeLabels() {
    const url = window.location.pathname;
    if (url.includes('outlet')) {
      return;
    }

    const promoCode = getPromoCodeFromUrl() || getPromoCodeFromLocalStorage();
    if (promoCode) {
        const priceElements = document.querySelectorAll('.product-price:not(.promo-code-processed)');
        priceElements.forEach((priceElement) => {
          // Remove existing promo code labels if any
          const existingDiscountElement = priceElement?.parentNode?.querySelector('.product-block__price-wrapper');
          if (existingDiscountElement) {
            existingDiscountElement.remove();
          }

          const productPriceStr = priceElement.textContent || priceElement.innerText;

          const productPrice = parseFloat(productPriceStr.replace(/[^\d.]/g, ''));

          // Calculate the discount
          const discountPercentage = promoCode.slice(-2) || 20;
          const multiplier = 1 - discountPercentage / 100;
          const discountedPrice = productPrice * multiplier;

          // Format the discounted price as money (adapt this to match your site's currency formatting)
          const discountedPriceFormatted = new Intl.NumberFormat('bg-BG', { style: 'currency', currency: 'BGN' }).format(discountedPrice);

          const discountElement = document.createElement('div');
          discountElement.classList.add('product-block__price-wrapper'); // Add a class for styling if needed
          discountElement.innerHTML = `<div class="discount_code" style="display: block;">${discountedPriceFormatted} с код ${promoCode}</div>`;

          // Insert the new element above the current price element
          priceElement.parentNode.insertBefore(discountElement, priceElement);
          priceElement.classList.add('promo-code-processed');
      });
    }
  }
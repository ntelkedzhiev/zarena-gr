(async function () {
    const settings = window.discountSettings;
    if (settings && settings.showDiscountCodePromotion) {
      const discountCodeText = document.getElementById('discount_code_text');
      if (discountCodeText) {
        const discountCode = settings.discountCode;
        const apiUrl = `https://api.zarena.bg/discount-codes/${discountCode}/remaining-uses`;
        try {
          const response = await fetch(apiUrl);
          const data = await response.json();
  
          if (data.remainingUses !== undefined) {
            discountCodeText.innerHTML = settings.discountCodePromotionText.replace('%CODE_NAME%', data.remainingUses);
          }
        } catch (error) {
          console.error('Error fetching discount data:', error);
        }
      }
    }
  })();
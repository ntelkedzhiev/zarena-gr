function addItemToCart(variantId, quantity) {
    return fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: variantId,
        quantity: quantity,
      }),
    }).then((response) => {
      if (!response.ok) {
        throw new Error('Error adding item to cart');
      }
      return response.json();
    });
  }
  
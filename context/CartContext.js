'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeCart = async () => {
      const storedCartId = typeof window !== 'undefined' ? localStorage.getItem('cartId') : null;
      
      if (!storedCartId) {
        try {
          setIsLoading(true);
          const response = await fetch('/api/cart/create', {
            method: 'POST',
          });
          
          if (!response.ok) throw new Error('Failed to create cart');
          
          const { cartId, checkoutUrl } = await response.json();
          if (typeof window !== 'undefined') {
            localStorage.setItem('cartId', cartId);
            localStorage.setItem('checkoutUrl', checkoutUrl);
          }
          
          setCart({
            id: cartId,
            checkoutUrl,
            lines: [],
            estimatedCost: {
              subtotalAmount: { amount: '0.00', currencyCode: 'USD' },
              totalAmount: { amount: '0.00', currencyCode: 'USD' }
            }
          });
        } catch (err) {
          setError(err.message);
          console.error('Error initializing cart:', err);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    initializeCart();
  }, []);

  const addToCart = async (variantId, quantity = 1) => {
    try {
      setIsLoading(true);
      
      let cartId = typeof window !== 'undefined' ? localStorage.getItem('cartId') : null;
      
      if (!cartId) {
        const response = await fetch('/api/cart/create', {
          method: 'POST',
        });
        
        if (!response.ok) throw new Error('Failed to create cart');
        
        const data = await response.json();
        cartId = data.cartId;
        if (typeof window !== 'undefined') {
          localStorage.setItem('cartId', cartId);
          localStorage.setItem('checkoutUrl', data.checkoutUrl);
        }
      }
      
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartId,
          variantId,
          quantity,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to add item to cart');
      
      const { cart: updatedCart } = await response.json();
      setCart(updatedCart);
      
      return updatedCart;
    } catch (err) {
      setError(err.message);
      console.error('Error adding to cart:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const checkout = () => {
    const checkoutUrl = typeof window !== 'undefined' ? localStorage.getItem('checkoutUrl') : null;
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    } else {
      setError('No checkout URL found');
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        error,
        addToCart,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ShopifyCart } from '@/types';

interface CartContextType {
  cart: ShopifyCart | null;
  isLoading: boolean;
  error: string | null;
  addToCart: (variantId: string, quantity?: number) => Promise<ShopifyCart | undefined>;
  checkout: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
            lines: { edges: [] },
            estimatedCost: {
              subtotalAmount: { amount: '0.00', currencyCode: 'USD' },
              totalAmount: { amount: '0.00', currencyCode: 'USD' }
            }
          });
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          setError(errorMessage);
          console.error('Error initializing cart:', err);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    initializeCart();
  }, []);

  const addToCart = async (variantId: string, quantity: number = 1): Promise<ShopifyCart | undefined> => {
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
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
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

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
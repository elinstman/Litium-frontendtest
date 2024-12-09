'use client';
import { Cart } from 'models/cart';
import { createContext, useEffect, useRef, useState } from 'react';
import { get } from 'services/cartService.client';

export const EmptyCart: Cart = {
  discountInfos: [],
  grandTotal: 0,
  rows: [],
  productCount: 0,
  discountCodes: [],
  productTotalIncludingVat: 0,
  currency: {
    code: 'SEK',
  },
};

type CartType = {
  cart: Cart;
  setCart: (cart: Cart) => void;
  hasCartChanged: boolean;
  setHasCartChanged: (value: boolean) => void;
};

export const CartContext = createContext<CartType>({
  cart: EmptyCart,
  setCart: (_) => {},
  hasCartChanged: false,
  setHasCartChanged: (_) => {},
});

export default function CartContextProvider({
  value,
  children,
}: {
  value?: Cart;
  children: React.ReactNode;
}) {
  const [cart, setCart] = useState<Cart>(value ?? EmptyCart);
  const [hasCartChanged, setHasCartChanged] = useState(false);
  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current) {
      const loadCart = async () => {
        const cart = await get();
        setCart(cart);
      };
      !value && loadCart().catch(console.error);
      initialized.current = true;
    }
  }, [value]);
  return (
    <CartContext.Provider
      value={{ cart, setCart, hasCartChanged, setHasCartChanged }}
    >
      {children}
    </CartContext.Provider>
  );
}

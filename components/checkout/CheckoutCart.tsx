'use client';
import CartContent from 'components/cart/CartContent';
import Currency from 'components/Currency';
import { Heading2 } from 'components/elements/Heading';
import { Text } from 'components/elements/Text';
import CaretDown from 'components/icons/caret-down';
import { CartContext } from 'contexts/cartContext';
import { useTranslations } from 'hooks/useTranslations';
import { Fragment, useContext, useState } from 'react';
import { calculateTotalDiscounts } from 'services/discountService';

/**
 * Renders cart's information of checkout page.
 */
function CheckoutCart() {
  const cartContext = useContext(CartContext);
  const { rows, discountInfos, grandTotal } = cartContext.cart;
  const [showCartContent, setShowCartContent] = useState(true);
  const t = useTranslations();
  const totalDiscounts = Math.abs(calculateTotalDiscounts(discountInfos));

  return (
    <Fragment>
      <div className="mb-4 flex justify-between">
        <Heading2>{t('checkoutcart.title')}</Heading2>
        <CaretDown
          alt="collapse"
          className="h-6 w-6 lg:hidden"
          onClick={() => setShowCartContent(!showCartContent)}
          data-testid="cart__toggle"
        ></CaretDown>
      </div>
      {showCartContent && (
        <div data-testid="cart__content">
          <CartContent
            totalDiscounts={totalDiscounts}
            rows={rows}
            showDiscountCode={true}
          ></CartContent>
          <div className="mb-3 flex justify-between text-lg">
            <Text className="font-bold">{t('checkoutcart.total')}</Text>
            <Currency data-testid="cart__grand-total" price={grandTotal} />
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default CheckoutCart;

'use client';
import Currency from 'components/Currency';
import { Button } from 'components/elements/Button';
import { Text } from 'components/elements/Text';
import Cart from 'components/icons/cart';
import Close from 'components/icons/close';
import { CartContext } from 'contexts/cartContext';
import { useTranslations } from 'hooks/useTranslations';
import Link from 'next/link';
import { Fragment, useCallback, useContext, useState } from 'react';
import { calculateTotalDiscounts } from 'services/discountService';
import { DiscountType } from 'utils/constants';
import Sidebar from '../Sidebar';
import CartContent from './CartContent';

/**
 * Renders a mini cart's information.
 */
function MiniCart({ checkoutPageUrl }: { checkoutPageUrl: string }) {
  const [showCartInfo, setShowCartInfo] = useState(false);
  const onClose = useCallback(() => setShowCartInfo(false), [setShowCartInfo]);
  const cartContext = useContext(CartContext);
  const { rows, productCount, productTotalIncludingVat, discountInfos } =
    cartContext.cart;
  const t = useTranslations();
  const productDiscountLines = discountInfos.filter(
    (item) =>
      item.discountType === DiscountType.DiscountedProductPrice ||
      item.discountType === DiscountType.ProductDiscount
  );
  const totalProductDiscounts = Math.abs(
    calculateTotalDiscounts(productDiscountLines)
  );
  const totalInMiniCart = productTotalIncludingVat - totalProductDiscounts;

  return (
    <Fragment>
      <div className="relative" onClick={() => setShowCartInfo(true)}>
        <Cart alt="cart" data-testid="mini-cart__bag" />
        {productCount ? <Badge count={productCount} /> : ''}
      </div>
      <Sidebar
        visible={showCartInfo}
        onClose={onClose}
        className="flex flex-col overflow-auto sm:w-[400px]"
        data-testid="mini-cart__sidebar"
        fullscreen={true}
        blockScroll={true}
      >
        {/* header sidebar */}
        <div className="flex items-center justify-between">
          <Text inline={true} className="text-lg sm:text-2xl">
            {t('minicart.title')}
          </Text>
          <Close alt="close" onClick={onClose} />
        </div>
        {/* body sidebar */}
        <div className="my-5 flex-1">
          <CartContent
            onClose={onClose}
            totalDiscounts={totalProductDiscounts}
            rows={rows}
          ></CartContent>
        </div>
        {/* footer sidebar */}
        <div className="sticky -bottom-5 -my-5 bg-primary pb-5">
          <div className="mb-3 flex justify-between">
            <Text inline={true}>{t('minicart.total')}</Text>
            <Currency price={totalInMiniCart} />
          </div>
          <Link href={checkoutPageUrl || ''} data-testid="checkout-button">
            <Button
              className="border !p-2 text-xl"
              fluid={true}
              rounded={true}
              onClick={onClose}
              disabled={!productCount}
            >
              {t('minicart.button.checkout')}
            </Button>
          </Link>
        </div>
      </Sidebar>
    </Fragment>
  );
}

const Badge = ({ count }: { count: number }) => (
  <Text
    inline={true}
    className="absolute -right-2 -top-1 flex h-5 w-5 items-center justify-center rounded-2xl bg-secondary text-xs font-bold text-secondary"
    data-testid="mini-cart__count"
  >
    {count}
  </Text>
);

export default MiniCart;

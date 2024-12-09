'use client';
import Currency from 'components/Currency';
import CheckoutDiscountCodes from 'components/checkout/CheckoutDiscountCodes';
import { Button } from 'components/elements/Button';
import { Text } from 'components/elements/Text';
import { WebsiteContext } from 'contexts/websiteContext';
import { useTranslations } from 'hooks/useTranslations';
import { OrderRow } from 'models/order';
import Link from 'next/link';
import { Fragment, useContext } from 'react';
import { getMultipleDiscountInfoMap } from 'services/discountService';
import { DiscountType } from 'utils/constants';
import CartLineItem from './CartLineItem';

/**
 * Renders cart's content.
 * @param showDiscountCode a flag to show/hide cart discount code
 * @param showShippingFee a flag to show/hide shipping fee
 * @param showFee a flag to show/hide all fee
 * @param rows a list of order row
 * @param showTotalDiscounts a flag to indicate whether total discounts should be displayed
 * @param totalDiscounts a total discounts
 * @param updatable a flag to indicate that the item count can be updated
 * @param onClose an event occurs when clicking the keep shopping button
 */
function CartContent({
  showDiscountCode = false,
  totalDiscounts = 0,
  onClose = () => {},
  showShippingFee = false,
  showFee = false,
  showTotalDiscounts = true,
  rows,
  updatable = true,
}: {
  totalDiscounts: number;
  showDiscountCode?: boolean;
  showShippingFee?: boolean;
  showFee?: boolean;
  showTotalDiscounts?: boolean;
  rows: OrderRow[];
  updatable?: boolean;
  onClose?: () => void;
}) {
  const productLineItems = rows.filter((item) => item.rowType === 'PRODUCT');
  const shippingFeeLine = rows.filter(
    (item) => item.rowType === 'SHIPPING_FEE'
  );
  const totalShippingFees = shippingFeeLine.reduce(
    (acc, shippingFee) => acc + shippingFee.totalIncludingVat,
    0
  );
  const feeLines = rows.filter((item) => item.rowType === 'FEE');
  const totalFees = feeLines.reduce(
    (acc, fee) => acc + fee.totalIncludingVat,
    0
  );
  const multipleDiscountInfoMap = getMultipleDiscountInfoMap(productLineItems);
  const isEmptyCart = productLineItems?.length === 0;
  const t = useTranslations();
  const homePageUrl = useContext(WebsiteContext).homePageUrl || '/';

  if (isEmptyCart) {
    return (
      <div
        className="mt-10 flex flex-col items-center gap-y-8"
        data-testid="cart-content__empty-cart"
      >
        <Text>{t('cartcontent.empty')}</Text>
        <Link
          data-testid="cart-content__keep-shopping"
          href={homePageUrl}
          onClick={onClose}
        >
          <Button className="px-9" rounded={true}>
            {t('cartcontent.button.keepshopping')}
          </Button>
        </Link>
      </div>
    );
  }
  return (
    <Fragment>
      {productLineItems.map((item) => (
        <CartLineItem
          item={item}
          asterisk={multipleDiscountInfoMap[item.articleNumber]}
          key={`cartItem-${item.articleNumber}`}
          updatable={
            updatable &&
            item.discountInfos[0]?.discountType !== DiscountType.FreeGift
          }
        />
      ))}
      {showDiscountCode && <CheckoutDiscountCodes></CheckoutDiscountCodes>}
      {showFee && (
        <div className="my-2 flex flex-wrap justify-between text-sm">
          <Text>{t('cartcontent.fee.title')}</Text>
          <Currency price={totalFees} />
        </div>
      )}
      {showShippingFee && (
        <div className="my-2 flex flex-wrap justify-between text-sm">
          <Text>{t('cartcontent.delivery.title')}</Text>
          <Currency price={totalShippingFees} />
        </div>
      )}
      {showTotalDiscounts && totalDiscounts > 0 && (
        <div className="my-2 flex flex-wrap justify-between text-sm">
          <Text>{t('cartcontent.discounts.title')}</Text>
          <Currency price={totalDiscounts} />
          {Object.values(multipleDiscountInfoMap).includes(true) && (
            <Text className="basis-full text-xs text-tertiary">
              {t('cartcontent.discounts.description')}
            </Text>
          )}
        </div>
      )}
    </Fragment>
  );
}

export default CartContent;

'use client';
import Currency from 'components/Currency';
import { Text } from 'components/elements/Text';
import { CartContext } from 'contexts/cartContext';
import { WebsiteContext } from 'contexts/websiteContext';
import { useTranslations } from 'hooks/useTranslations';
import { OrderRow } from 'models/order';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useContext, useEffect, useState } from 'react';
import { remove, update } from 'services/cartService.client';
import {
  calculateTotalDiscounts,
  shouldShowOriginalPrice,
} from 'services/discountService';
import { getAbsoluteImageUrl } from 'services/imageService';
import { DiscountType } from 'utils/constants';
import QuantityInput from './QuantityInput';

/**
 * Renders a line item in cart.
 * @param item a cart line item object.
 */
function CartLineItem({
  item,
  asterisk = false,
  updatable = true,
}: {
  item: OrderRow;
  asterisk?: boolean;
  updatable?: boolean;
}) {
  const cartContext = useContext(CartContext);
  const handleChangeQuantity = async (value: number) => {
    const cart = await update(item.rowId, value);
    cartContext.setCart(cart);
    cartContext.setHasCartChanged(true);
  };
  const removeRow = async (rowId: string) => {
    const cart = await remove(rowId);
    cartContext.setCart(cart);
    cartContext.setHasCartChanged(true);
  };
  const [discountedPrice, setDiscountedPrice] = useState(
    item.totalIncludingVat
  );
  const website = useContext(WebsiteContext);

  useEffect(() => {
    if (
      item.discountInfos.length > 0 &&
      item.discountInfos[0].discountType === DiscountType.FreeGift
    ) {
      setDiscountedPrice(0);
    } else if (shouldShowOriginalPrice(item.discountInfos)) {
      const totalDiscountsPrice = calculateTotalDiscounts(item.discountInfos);
      setDiscountedPrice(item.totalIncludingVat + totalDiscountsPrice);
    } else {
      setDiscountedPrice(item.totalIncludingVat);
    }
  }, [item.discountInfos, item.totalIncludingVat]);

  const t = useTranslations();

  if (!item.product) {
    return <Fragment></Fragment>;
  }
  return (
    <div className="my-2 flex" data-testid={item.articleNumber}>
      <div className="h-20 w-20 flex-none">
        {item.product.url ? (
          <Link href={item.product.url ?? ''}>
            <Image
              src={getAbsoluteImageUrl(
                item.product.smallImages[0],
                website.imageServerUrl
              )}
              alt={`img-${item.articleNumber}`}
              width={item.product.smallImages[0]?.dimension?.width}
              height={item.product.smallImages[0]?.dimension?.height}
              className="mx-auto"
            />
          </Link>
        ) : (
          <Image
            src={getAbsoluteImageUrl(
              item.product.smallImages[0],
              website.imageServerUrl
            )}
            alt={`img-${item.articleNumber}`}
            width={item.product.smallImages[0]?.dimension?.width}
            height={item.product.smallImages[0]?.dimension?.height}
            className="mx-auto"
          />
        )}
      </div>
      <div className="ml-3 flex-1">
        <div className="mb-2 flex justify-between">
          <div className="w-44">
            {item.product.url ? (
              <Link href={item.product.url ?? ''} className="text-hyperlink">
                <Text
                  className="truncate text-sm"
                  title={item.product.name ?? ''}
                  data-testid={`${item.articleNumber}__name`}
                >
                  {item.product.name}
                </Text>
              </Link>
            ) : (
              <Text
                className="truncate text-sm"
                title={item.product.name ?? ''}
                data-testid={`${item.articleNumber}__name`}
              >
                {item.product.name}
              </Text>
            )}
            <Text
              className="truncate text-[10px] text-tertiary"
              title={item.articleNumber}
              data-testid={`${item.articleNumber}__article-number`}
            >
              {item.articleNumber}
            </Text>
          </div>
          <div>
            <Currency
              className="inline text-xs"
              price={discountedPrice}
              data-testid={`${item.articleNumber}__discount-price`}
            />
            {asterisk && (
              <Text
                inline={true}
                className="text-xs"
                data-testid={`${item.articleNumber}__asterisk`}
              >
                &nbsp;*
              </Text>
            )}
            {shouldShowOriginalPrice(item.discountInfos) && (
              <Currency
                className="text-[10px] text-tertiary"
                price={item.totalIncludingVat}
                data-testid={`${item.articleNumber}__original-price`}
                strikethrough
              />
            )}
          </div>
        </div>
        {updatable && (
          <div className="flex items-center justify-between">
            <QuantityInput
              value={item.quantity}
              onChange={handleChangeQuantity}
            />
            <div
              className="cursor-pointer text-[10px] text-tertiary"
              onClick={() => removeRow(item.rowId)}
              data-testid={`${item.articleNumber}__remove-btn`}
            >
              {t('cartlineitem.button.remove')}
            </div>
          </div>
        )}
        {!updatable && (
          <Text className="text-end text-xs">
            {t('cartlineitem.quantity.title')} {item.quantity}
          </Text>
        )}
      </div>
    </div>
  );
}

export default CartLineItem;

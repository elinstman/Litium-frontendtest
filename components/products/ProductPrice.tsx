import clsx from 'clsx';
import Currency from 'components/Currency';
import { ProductPriceItem } from 'models/price';

/**
 * Represents a component to render a Product price as a formatted string, with
 * currency and Vat being taken into account.
 * @param price a ProductPriceItem object.
 * @param className optional custom css class name.
 * @returns
 */
function ProductPrice({
  price,
  className = '',
  ...props
}: {
  price: ProductPriceItem;
  className?: string;
}) {
  // TODO check the VAT setting to display price with or without VAT.
  return (
    <div className="flex items-baseline gap-x-5">
      {!!price?.discountPriceIncludingVat && (
        <Currency price={price.discountPriceIncludingVat} {...props}></Currency>
      )}
      <Currency
        className={clsx(
          className,
          !!price?.discountPriceIncludingVat && 'text-secondary-2 line-through'
        )}
        price={price?.unitPriceIncludingVat}
        {...props}
      />
    </div>
  );
}

export default ProductPrice;

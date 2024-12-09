import clsx from 'clsx';
import { Text } from 'components/elements/Text';

function CurrencyServerComponent({
  price,
  strikethrough = false,
  className = '',
  currency,
  culture,
  ...props
}: {
  price?: number;
  strikethrough?: boolean;
  className?: string;
  currency: string;
  culture: string;
}) {
  return (
    <Text
      className={clsx(strikethrough && 'line-through', className)}
      {...props}
    >
      {format(price, culture, currency)}
    </Text>
  );
}

function format(
  price?: number,
  cultureCode?: string,
  currencyCode?: string
): string {
  if (typeof price === 'undefined') {
    return '';
  }
  const formatter = new Intl.NumberFormat(cultureCode, {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
    currencyDisplay: 'code',
  });
  return formatter.format(price);
}

export default CurrencyServerComponent;

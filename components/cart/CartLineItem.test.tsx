import { render, screen } from '@testing-library/react';
import { generateCartLineItemData } from '__mock__/generateMockData';
import WebsiteContextProvider, { EmptyWebsite } from 'contexts/websiteContext';
import { OrderRow } from 'models/order';
import { DiscountType } from 'utils/constants';
import CartLineItem from './CartLineItem';

const MockWebsite = {
  ...EmptyWebsite,
  imageServerUrl: 'https://localhost/',
};

describe('Cart Line Item Component', () => {
  test('should render information of Cart Line Item correctly with asterisk flag by default value is false', () => {
    const item: OrderRow = generateCartLineItemData(1, 1, 0).rows[0];
    render(
      <WebsiteContextProvider value={MockWebsite}>
        <CartLineItem item={item} />
      </WebsiteContextProvider>
    );
    expect(screen.getByTestId('abc-xyz-0__name')).toHaveTextContent(
      'Product name 0'
    );
    expect(screen.getByTestId('abc-xyz-0__article-number')).toHaveTextContent(
      'abc-xyz-0'
    );
    expect(screen.getByTestId('abc-xyz-0__discount-price')).toHaveTextContent(
      '698 SEK'
    );
    expect(screen.queryByTestId('abc-xyz-0__original-price')).toBeNull();
    expect(screen.queryByTestId('abc-xyz-0__asterisk')).toBeNull();
    expect(screen.getByTestId('quantity-input__select')).toHaveValue('1');
  });

  test('should render asterisk if asterisk flag is true ', () => {
    const item: OrderRow = generateCartLineItemData(1, 1, 0).rows[0];
    render(
      <WebsiteContextProvider value={MockWebsite}>
        <CartLineItem item={item} asterisk={true} />
      </WebsiteContextProvider>
    );
    expect(screen.queryByTestId('abc-xyz-0__asterisk')).toBeInTheDocument();
  });

  test('should render the currency format correctly with the price is greater than 1000', () => {
    const item: OrderRow = generateCartLineItemData(1, 10, 0).rows[0];
    render(
      <WebsiteContextProvider value={MockWebsite}>
        <CartLineItem item={item} />
      </WebsiteContextProvider>
    );
    expect(screen.getByTestId('abc-xyz-0__discount-price')).toHaveTextContent(
      '6 980 SEK'
    );
  });

  test('should not render original price if discount type is "BuyXGetCheapestDiscount" or "MatchAndMix"', () => {
    const item: OrderRow = generateCartLineItemData(
      1,
      1,
      1,
      false,
      DiscountType.BuyXGetCheapestDiscount
    ).rows[0];
    render(
      <WebsiteContextProvider value={MockWebsite}>
        <CartLineItem item={item} />
      </WebsiteContextProvider>
    );
    expect(screen.getByTestId('abc-xyz-0__name')).toHaveTextContent(
      'Product name 0'
    );
    expect(screen.getByTestId('abc-xyz-0__article-number')).toHaveTextContent(
      'abc-xyz-0'
    );
    expect(screen.getByTestId('abc-xyz-0__discount-price')).toHaveTextContent(
      '698 SEK'
    );
    expect(screen.queryByTestId('abc-xyz-0__original-price')).toBeNull();
    expect(screen.queryByTestId('abc-xyz-0__asterisk')).toBeNull();
    expect(screen.getByTestId('quantity-input__select')).toHaveValue('1');
  });

  test('should render original price if discount type is "ProductDiscount" or "DiscountedProductPrice"', () => {
    const item: OrderRow = generateCartLineItemData(
      1,
      1,
      1,
      false,
      DiscountType.ProductDiscount
    ).rows[0];
    render(
      <WebsiteContextProvider value={MockWebsite}>
        <CartLineItem item={item} />
      </WebsiteContextProvider>
    );
    expect(screen.getByTestId('abc-xyz-0__name')).toHaveTextContent(
      'Product name 0'
    );
    expect(screen.getByTestId('abc-xyz-0__article-number')).toHaveTextContent(
      'abc-xyz-0'
    );
    expect(screen.getByTestId('abc-xyz-0__discount-price')).toHaveTextContent(
      '300 SEK'
    );
    expect(screen.getByTestId('abc-xyz-0__original-price')).toHaveTextContent(
      '698 SEK'
    );
    expect(screen.queryByTestId('abc-xyz-0__asterisk')).toBeNull();
    expect(screen.getByTestId('quantity-input__select')).toHaveValue('1');
  });
});

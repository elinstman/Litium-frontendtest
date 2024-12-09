import { render, screen } from '@testing-library/react';
import { generateCartLineItemData } from '__mock__/generateMockData';
import WebsiteContextProvider, { EmptyWebsite } from 'contexts/websiteContext';
import { Cart } from 'models/cart';
import { calculateTotalDiscounts } from 'services/discountService';
import { DiscountType } from 'utils/constants';
import CartContent from './CartContent';

const MockWebsite = {
  ...EmptyWebsite,
  imageServerUrl: 'https://localhost/',
};

describe('Cart Content Component', () => {
  test('should render asterisk and text explain if product discount and order discount are applied for order row', () => {
    const cart: Cart = generateCartLineItemData(1, 10, 2, true);
    const totalDiscounts = Math.abs(
      calculateTotalDiscounts(cart.discountInfos)
    );
    render(
      <WebsiteContextProvider value={MockWebsite}>
        <CartContent rows={cart.rows} totalDiscounts={totalDiscounts} />
      </WebsiteContextProvider>
    );
    expect(screen.queryByTestId('abc-xyz-0__asterisk')).toBeInTheDocument();
  });
  test('should not render asterisk if only product discount or order discount is applied for order row', () => {
    const cart: Cart = generateCartLineItemData(
      1,
      1,
      1,
      false,
      DiscountType.ProductDiscount
    );
    const totalDiscounts = Math.abs(
      calculateTotalDiscounts(cart.discountInfos)
    );
    render(
      <WebsiteContextProvider value={MockWebsite}>
        <CartContent rows={cart.rows} totalDiscounts={totalDiscounts} />
      </WebsiteContextProvider>
    );
    expect(screen.queryByTestId('abc-xyz-0__asterisk')).toBeNull();
  });
  test('should render empty cart content if there is no items', () => {
    const cart: Cart = generateCartLineItemData(0, 10, 2, true);
    render(
      <WebsiteContextProvider value={MockWebsite}>
        <CartContent rows={cart.rows} totalDiscounts={0} />
      </WebsiteContextProvider>
    );
    expect(screen.getByTestId('cart-content__empty-cart')).toBeInTheDocument();
  });
  test('should call onClose function on clicking the keep shopping button', async () => {
    const cart: Cart = generateCartLineItemData(0, 10, 2, true);
    const onClose = jest.fn();
    render(
      <WebsiteContextProvider value={MockWebsite}>
        <CartContent onClose={onClose} rows={cart.rows} totalDiscounts={0} />
      </WebsiteContextProvider>
    );
    expect(screen.getByTestId('cart-content__empty-cart')).toBeInTheDocument();
    await screen.getByTestId('cart-content__keep-shopping').click();
    expect(onClose).toHaveBeenCalled();
  });
});

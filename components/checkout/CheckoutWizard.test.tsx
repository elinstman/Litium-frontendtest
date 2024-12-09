import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { generateCartLineItemData } from '__mock__/generateMockData';
import CartContextProvider from 'contexts/cartContext';
import WebsiteContextProvider, { EmptyWebsite } from 'contexts/websiteContext';
import { Checkout } from 'models/checkout';
import * as checkoutServiceClient from 'services/checkoutService.client';
import CheckoutWizard from './CheckoutWizard';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

const MockWebsite = {
  ...EmptyWebsite,
  imageServerUrl: 'https://localhost/',
};

jest.mock('services/checkoutService.client', () => ({
  createCheckoutSession: jest.fn(),
  updateAddresses: jest.fn(),
  updateBillingAddress: jest.fn(),
}));

describe('Checkout Wizard component', () => {
  describe('The payment method and delivery method are empty', () => {
    test('should not render component if payment options and delivery options are empty', async () => {
      const checkout: Checkout = {
        shippingAddress: {
          address1: '',
          zipCode: '',
          city: '',
          country: '',
          email: '',
          firstName: '',
          lastName: '',
          organizationName: '',
          phoneNumber: '',
        },
        shippingOptions: [],
        billingAddress: {
          address1: '',
          zipCode: '',
          city: '',
          country: '',
          email: '',
          firstName: '',
          lastName: '',
          organizationName: '',
          phoneNumber: '',
        },
        paymentOptions: [],
        paymentHtmlSnippet: 'widget payment',
        checkoutFlowInfo: {
          receiptPageUrl: '',
        },
      };
      jest
        .spyOn(checkoutServiceClient, 'createCheckoutSession')
        .mockResolvedValue(checkout);
      const cart = generateCartLineItemData(1, 10, 2, true);
      render(
        <WebsiteContextProvider value={MockWebsite}>
          <CartContextProvider value={cart}>
            <CheckoutWizard state={checkout} />
          </CartContextProvider>
        </WebsiteContextProvider>
      );
      const { container } = render(<CheckoutWizard />);
      await waitFor(() => {
        expect(container.childElementCount).toEqual(0);
      });
    });
  });

  describe('The payment method of type iframe checkout and the delivery method of type payment checkout', () => {
    test('should render only iframe from payment provider', async () => {
      const checkout: Checkout = {
        shippingAddress: {
          address1: '',
          zipCode: '',
          city: '',
          country: '',
          email: '',
          firstName: '',
          lastName: '',
          organizationName: '',
          phoneNumber: '',
        },
        shippingOptions: [
          {
            id: 'DirectShipment:integratedShipping',
            name: 'DirectShipment:integratedShipping',
            description: null,
            price: 100,
            selected: true,
            integrationType: 'PAYMENT_CHECKOUT',
          },
        ],
        billingAddress: {
          address1: '',
          zipCode: '',
          city: '',
          country: '',
          email: '',
          firstName: '',
          lastName: '',
          organizationName: '',
          phoneNumber: '',
        },
        paymentOptions: [
          {
            description: null,
            id: 'klarnapayment:SE Checkout',
            name: 'klarnapayment:SE Checkout',
            price: 0,
            selected: true,
            integrationType: 'IFRAME_CHECKOUT',
          },
        ],
        paymentHtmlSnippet: 'widget payment',
        checkoutFlowInfo: {
          receiptPageUrl: '',
        },
      };
      jest
        .spyOn(checkoutServiceClient, 'createCheckoutSession')
        .mockResolvedValue(checkout);
      const cart = generateCartLineItemData(1, 10, 2, true);
      render(
        <WebsiteContextProvider value={MockWebsite}>
          <CartContextProvider value={cart}>
            <CheckoutWizard state={checkout} />
          </CartContextProvider>
        </WebsiteContextProvider>
      );
      await waitFor(() => {
        expect(
          screen.queryByTestId('STEP_DELIVERY_ADDRESS')
        ).not.toBeInTheDocument();
        expect(
          screen.queryByTestId('STEP_DELIVERY_OPTION')
        ).not.toBeInTheDocument();
        expect(screen.getByTestId('STEP_PAYMENT')).toBeInTheDocument();
        expect(
          screen.getByTestId('checkout-wizard__widget')
        ).toBeInTheDocument();
      });
    });
  });

  describe('The payment method of type iframe checkout and the delivery method of type inline', () => {
    test('should render delivery options and iframe from payment provider', async () => {
      const checkout: Checkout = {
        shippingAddress: {
          address1: '',
          zipCode: '',
          city: '',
          country: '',
          email: '',
          firstName: '',
          lastName: '',
          organizationName: '',
          phoneNumber: '',
        },
        shippingOptions: [
          {
            id: 'DirectShipment:expressPackage',
            name: 'DirectShipment:expressPackage',
            description: null,
            price: 100,
            selected: true,
            integrationType: 'INLINE',
          },
        ],
        billingAddress: {
          address1: '',
          zipCode: '',
          city: '',
          country: '',
          email: '',
          firstName: '',
          lastName: '',
          organizationName: '',
          phoneNumber: '',
        },
        paymentOptions: [
          {
            description: null,
            id: 'klarnapayment:SE Checkout',
            name: 'klarnapayment:SE Checkout',
            price: 0,
            selected: true,
            integrationType: 'IFRAME_CHECKOUT',
          },
        ],
        paymentHtmlSnippet: 'widget payment',
        checkoutFlowInfo: {
          receiptPageUrl: '',
        },
      };
      jest
        .spyOn(checkoutServiceClient, 'createCheckoutSession')
        .mockResolvedValue(checkout);
      const cart = generateCartLineItemData(1, 10, 2, true);
      render(
        <WebsiteContextProvider value={MockWebsite}>
          <CartContextProvider value={cart}>
            <CheckoutWizard state={checkout} />
          </CartContextProvider>
        </WebsiteContextProvider>
      );
      await waitFor(async () => {
        expect(
          screen.queryByTestId('STEP_DELIVERY_ADDRESS')
        ).not.toBeInTheDocument();
        expect(
          screen.queryByTestId('STEP_DELIVERY_OPTION')
        ).toBeInTheDocument();
        await userEvent.click(
          screen.getByTestId('checkout-wizard__delivery-option-continue')
        );
        expect(screen.queryByTestId('STEP_PAYMENT')).toBeInTheDocument();
        expect(
          screen.queryByTestId('checkout-wizard__widget')
        ).toBeInTheDocument();
      });
    });
  });

  describe('The payment method of type payment checkout and the delivery method of type inline', () => {
    let checkout: Checkout;
    beforeEach(() => {
      checkout = {
        shippingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          address1: '123 Main St',
          zipCode: '12345',
          country: 'SE',
          city: 'USA',
          organizationName: 'AnyCompany',
          email: 'test@mail.com',
          phoneNumber: '12345678',
        },
        shippingOptions: [
          {
            id: 'DirectShipment:expressPackage',
            name: 'DirectShipment:expressPackage',
            description: null,
            price: 100,
            selected: true,
            integrationType: 'INLINE',
          },
        ],
        billingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          address1: '123 Main St',
          zipCode: '12345',
          country: 'SE',
          city: 'USA',
          organizationName: 'AnyCompany',
          email: 'test@mail.com',
          phoneNumber: '12345678',
        },
        paymentOptions: [
          {
            id: 'directpayment:DirectPay',
            name: 'directpayment:DirectPay',
            price: 0,
            selected: false,
            description: null,
            integrationType: 'DIRECT_PAYMENT',
          },
          {
            id: 'adyenpayment:SE Dropin',
            name: 'adyenpayment:SE Dropin',
            price: 0,
            selected: true,
            description: null,
            integrationType: 'PAYMENT_WIDGETS',
          },
        ],
        paymentHtmlSnippet: 'widget payment',
        checkoutFlowInfo: {
          receiptPageUrl: '',
        },
      };
      jest
        .spyOn(checkoutServiceClient, 'createCheckoutSession')
        .mockResolvedValue(checkout);
      jest
        .spyOn(checkoutServiceClient, 'updateAddresses')
        .mockResolvedValue(checkout);
      jest
        .spyOn(checkoutServiceClient, 'updateBillingAddress')
        .mockResolvedValue(checkout);
    });
    test('should show the inline or payment checkout if iframe checkout are not configured', async () => {
      const cart = generateCartLineItemData(1, 10, 2, true);
      render(
        <WebsiteContextProvider value={MockWebsite}>
          <CartContextProvider value={cart}>
            <CheckoutWizard state={checkout} />
          </CartContextProvider>
        </WebsiteContextProvider>
      );
      await waitFor(async () => {
        expect(
          screen.queryByTestId('STEP_DELIVERY_ADDRESS')
        ).toBeInTheDocument();
        await userEvent.click(screen.getByTestId('address-form__submit'));
        expect(
          screen.queryByTestId('STEP_DELIVERY_OPTION')
        ).toBeInTheDocument();
        expect(
          screen.queryByTestId('checkout-wizard__delivery-address-summary')
        ).toBeInTheDocument();
        await userEvent.click(
          screen.getByTestId('checkout-wizard__delivery-option-continue')
        );
        expect(screen.queryByTestId('STEP_PAYMENT')).toBeInTheDocument();
        expect(
          screen.queryByTestId('checkout-wizard__payment-option')
        ).toBeInTheDocument();
        expect(screen.queryAllByTestId('listBox__item').length).toBe(2);
        expect(screen.queryAllByTestId('listBox__item')[0]).toHaveTextContent(
          'directpayment:DirectPay'
        );
        expect(screen.queryAllByTestId('listBox__item')[1]).toHaveTextContent(
          'adyenpayment:SE Dropin'
        );
      });
    });
    test('should render delivery address form, delivery options, billing same as delivery and iframe from payment provider', async () => {
      const cart = generateCartLineItemData(1, 10, 2, true);
      render(
        <WebsiteContextProvider value={MockWebsite}>
          <CartContextProvider value={cart}>
            <CheckoutWizard state={checkout} />
          </CartContextProvider>
        </WebsiteContextProvider>
      );
      await waitFor(async () => {
        expect(
          screen.queryByTestId('STEP_DELIVERY_ADDRESS')
        ).toBeInTheDocument();
        await userEvent.click(screen.getByTestId('address-form__submit'));
        expect(
          screen.queryByTestId('STEP_DELIVERY_OPTION')
        ).toBeInTheDocument();
        expect(
          screen.queryByTestId('checkout-wizard__delivery-address-summary')
        ).toBeInTheDocument();
        // edit delivery address summary
        await userEvent.click(screen.getByTestId('address-summary__btnEdit'));
        expect(
          screen.queryByTestId('STEP_DELIVERY_ADDRESS')
        ).toBeInTheDocument();
        await userEvent.click(screen.getByTestId('address-form__submit'));
        expect(
          screen.queryByTestId('checkout-wizard__delivery-address-summary')
        ).toBeInTheDocument();
        await userEvent.click(
          screen.getByTestId('checkout-wizard__delivery-option-continue')
        );
        expect(screen.queryByTestId('STEP_PAYMENT')).toBeInTheDocument();
        expect(screen.getByTestId('checkout-wizard__checkbox')).toBeChecked();
        expect(
          screen.queryByTestId('checkout-wizard__widget')
        ).toBeInTheDocument();
      });
    });
    test('should render delivery address form, delivery options, billing address form and iframe from payment provider', async () => {
      const cart = generateCartLineItemData(1, 10, 2, true);
      render(
        <WebsiteContextProvider value={MockWebsite}>
          <CartContextProvider value={cart}>
            <CheckoutWizard state={checkout} />
          </CartContextProvider>
        </WebsiteContextProvider>
      );
      await waitFor(async () => {
        expect(
          screen.queryByTestId('STEP_DELIVERY_ADDRESS')
        ).toBeInTheDocument();
        await userEvent.click(screen.getByTestId('address-form__submit'));
        expect(
          screen.queryByTestId('STEP_DELIVERY_OPTION')
        ).toBeInTheDocument();
        expect(
          screen.queryByTestId('checkout-wizard__delivery-address-summary')
        ).toBeInTheDocument();
        await userEvent.click(
          screen.getByTestId('checkout-wizard__delivery-option-continue')
        );
        expect(screen.queryByTestId('STEP_PAYMENT')).toBeInTheDocument();
        expect(screen.getByTestId('checkout-wizard__checkbox')).toBeChecked();
        // billing address form not same as delivery
        await userEvent.click(screen.getByTestId('checkout-wizard__checkbox'));
        expect(
          screen.queryByTestId('checkout-wizard__billing-address-form')
        ).toBeInTheDocument();
        await userEvent.click(screen.getByTestId('address-form__submit'));
        expect(
          screen.queryByTestId('checkout-wizard__billing-address-summary')
        ).toBeInTheDocument();
        // edit billing address form
        await userEvent.click(screen.getByTestId('address-summary__btnEdit'));
        expect(
          screen.queryByTestId('checkout-wizard__billing-address-form')
        ).toBeInTheDocument();
        await userEvent.click(screen.getByTestId('address-form__submit'));
        expect(
          screen.queryByTestId('checkout-wizard__billing-address-summary')
        ).toBeInTheDocument();
        expect(
          screen.queryByTestId('checkout-wizard__widget')
        ).toBeInTheDocument();
      });
    });
  });

  describe('The payment method of type inline and the delivery method of type inline', () => {
    let checkout: Checkout;
    beforeEach(() => {
      checkout = {
        shippingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          address1: '123 Main St',
          zipCode: '12345',
          country: 'SE',
          city: 'USA',
          organizationName: 'AnyCompany',
          email: 'test@mail.com',
          phoneNumber: '12345678',
        },
        shippingOptions: [
          {
            id: 'DirectShipment:expressPackage',
            name: 'DirectShipment:expressPackage',
            description: null,
            price: 100,
            selected: true,
            integrationType: 'INLINE',
          },
        ],
        billingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          address1: '123 Main St',
          zipCode: '12345',
          country: 'SE',
          city: 'USA',
          organizationName: 'AnyCompany',
          email: 'test@mail.com',
          phoneNumber: '12345678',
        },
        paymentOptions: [
          {
            id: 'directpayment:DirectPay',
            name: 'directpayment:DirectPay',
            price: 0,
            selected: true,
            description: null,
            integrationType: 'DIRECT_PAYMENT',
          },
        ],
        paymentHtmlSnippet: '',
        checkoutFlowInfo: {
          receiptPageUrl: '',
        },
      };
      jest
        .spyOn(checkoutServiceClient, 'createCheckoutSession')
        .mockResolvedValue(checkout);
      jest
        .spyOn(checkoutServiceClient, 'updateAddresses')
        .mockResolvedValue(checkout);
      jest
        .spyOn(checkoutServiceClient, 'updateBillingAddress')
        .mockResolvedValue(checkout);
    });
    test('should render delivery address form, delivery options, billing same as delivery and total order section', async () => {
      const cart = generateCartLineItemData(1, 10, 2, true);
      render(
        <WebsiteContextProvider value={MockWebsite}>
          <CartContextProvider value={cart}>
            <CheckoutWizard state={checkout} />
          </CartContextProvider>
        </WebsiteContextProvider>
      );
      await waitFor(async () => {
        expect(
          screen.queryByTestId('STEP_DELIVERY_ADDRESS')
        ).toBeInTheDocument();
        await userEvent.click(screen.getByTestId('address-form__submit'));
        expect(
          screen.queryByTestId('STEP_DELIVERY_OPTION')
        ).toBeInTheDocument();
        expect(
          screen.queryByTestId('checkout-wizard__delivery-address-summary')
        ).toBeInTheDocument();
        await userEvent.click(
          screen.getByTestId('checkout-wizard__delivery-option-continue')
        );
        expect(screen.queryByTestId('STEP_PAYMENT')).toBeInTheDocument();
        expect(screen.getByTestId('checkout-wizard__checkbox')).toBeChecked();
        expect(
          screen.queryByTestId('checkout-wizard__widget')
        ).not.toBeInTheDocument();
        expect(
          screen.queryByTestId('checkout-wizard__total-summary')
        ).toBeInTheDocument();
      });
    });
    test('should render delivery address form, delivery options, billing address form and total order section', async () => {
      const cart = generateCartLineItemData(1, 10, 2, true);
      render(
        <WebsiteContextProvider value={MockWebsite}>
          <CartContextProvider value={cart}>
            <CheckoutWizard state={checkout} />
          </CartContextProvider>
        </WebsiteContextProvider>
      );
      await waitFor(async () => {
        expect(
          screen.queryByTestId('STEP_DELIVERY_ADDRESS')
        ).toBeInTheDocument();
        await userEvent.click(screen.getByTestId('address-form__submit'));
        expect(
          screen.queryByTestId('STEP_DELIVERY_OPTION')
        ).toBeInTheDocument();
        expect(
          screen.queryByTestId('checkout-wizard__delivery-address-summary')
        ).toBeInTheDocument();
        await userEvent.click(
          screen.getByTestId('checkout-wizard__delivery-option-continue')
        );
        expect(screen.queryByTestId('STEP_PAYMENT')).toBeInTheDocument();
        expect(
          screen.queryByTestId('checkout-wizard__delivery-summary')
        ).toBeInTheDocument();
        // edit delivery option
        await userEvent.click(screen.getByTestId('delivery-summary__edit'));
        expect(
          screen.queryByTestId('STEP_DELIVERY_OPTION')
        ).toBeInTheDocument();
        await userEvent.click(
          screen.getByTestId('checkout-wizard__delivery-option-continue')
        );
        expect(screen.getByTestId('checkout-wizard__checkbox')).toBeChecked();
        // billing address form not same as delivery
        await userEvent.click(screen.getByTestId('checkout-wizard__checkbox'));
        expect(
          screen.queryByTestId('checkout-wizard__billing-address-form')
        ).toBeInTheDocument();
        await userEvent.click(screen.getByTestId('address-form__submit'));
        expect(
          screen.queryByTestId('checkout-wizard__billing-address-summary')
        ).toBeInTheDocument();
        // edit billing address form
        await userEvent.click(screen.getByTestId('address-summary__btnEdit'));
        expect(
          screen.queryByTestId('checkout-wizard__billing-address-form')
        ).toBeInTheDocument();
        await userEvent.click(screen.getByTestId('address-form__submit'));
        expect(
          screen.queryByTestId('checkout-wizard__billing-address-summary')
        ).toBeInTheDocument();
        expect(
          screen.queryByTestId('checkout-wizard__widget')
        ).not.toBeInTheDocument();
        expect(
          screen.queryByTestId('checkout-wizard__total-summary')
        ).toBeInTheDocument();
      });
    });
  });
});

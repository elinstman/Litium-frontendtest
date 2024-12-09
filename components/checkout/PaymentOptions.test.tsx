import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CartContextProvider, { EmptyCart } from 'contexts/cartContext';
import WebsiteContextProvider, { EmptyWebsite } from 'contexts/websiteContext';
import { CheckoutOption } from 'models/checkout';
import PaymentOptions from './PaymentOptions';

describe('Payment Options Component', () => {
  test('should be able to render payment options', () => {
    const checkoutOptions: CheckoutOption[] = [
      {
        id: '1',
        name: 'option name 1',
        description: 'option description 1',
        price: 100,
        selected: false,
        integrationType: '',
      },
      {
        id: '2',
        name: 'option name 2',
        description: 'option description 2',
        price: 100,
        selected: false,
        integrationType: '',
      },
    ];
    render(
      <WebsiteContextProvider value={EmptyWebsite}>
        <CartContextProvider value={EmptyCart}>
          <PaymentOptions
            value={checkoutOptions}
            errors={{}}
            onChange={() => {}}
            selectedOption={checkoutOptions[0]}
          ></PaymentOptions>
        </CartContextProvider>
      </WebsiteContextProvider>
    );
    expect(screen.queryByTestId('listBox__list')).toBeInTheDocument();
    expect(screen.queryAllByTestId('listBox__item')).toHaveLength(2);
  });
  test('should be able to render selected payment option', () => {
    const checkoutOptions: CheckoutOption[] = [
      {
        id: '1',
        name: 'option name 1',
        description: 'option description 1',
        price: 100,
        selected: false,
        integrationType: '',
      },
      {
        id: '2',
        name: 'option name 2',
        description: 'option description 2',
        price: 100,
        selected: false,
        integrationType: '',
      },
    ];
    render(
      <WebsiteContextProvider value={EmptyWebsite}>
        <CartContextProvider value={EmptyCart}>
          <PaymentOptions
            value={checkoutOptions}
            errors={{}}
            onChange={() => {}}
            selectedOption={checkoutOptions[1]}
          ></PaymentOptions>
        </CartContextProvider>
      </WebsiteContextProvider>
    );
    expect(screen.queryAllByTestId('listBox__item')[1]).toHaveClass(
      'border-black'
    );
  });
  test('should render error message if available', () => {
    const checkoutOptions: CheckoutOption[] = [
      {
        id: '1',
        name: 'option name',
        description: 'option description',
        price: 100,
        selected: false,
        integrationType: '',
      },
    ];
    render(
      <WebsiteContextProvider value={EmptyWebsite}>
        <CartContextProvider value={EmptyCart}>
          <PaymentOptions
            value={checkoutOptions}
            errors={{ message: 'error' }}
            onChange={() => {}}
            selectedOption={checkoutOptions[0]}
          ></PaymentOptions>
        </CartContextProvider>
      </WebsiteContextProvider>
    );
    expect(screen.getByTestId('error-text')).toHaveTextContent('error');
  });
  test('should call onChange function when selecting option', async () => {
    const checkoutOptions: CheckoutOption[] = [
      {
        id: '1',
        name: 'option name',
        description: 'option description',
        price: 100,
        selected: false,
        integrationType: '',
      },
    ];
    render(
      <WebsiteContextProvider value={EmptyWebsite}>
        <CartContextProvider value={EmptyCart}>
          <PaymentOptions
            value={checkoutOptions}
            errors={{}}
            onChange={() => {
              console.log('foo');
            }}
            selectedOption={checkoutOptions[0]}
          ></PaymentOptions>
        </CartContextProvider>
      </WebsiteContextProvider>
    );
    console.log = jest.fn();

    await userEvent.click(screen.getAllByTestId('listBox__item')[0]);
    expect(console.log).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('foo');
  });
});
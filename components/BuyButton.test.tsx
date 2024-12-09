import { fireEvent, render, screen } from '@testing-library/react';
import BuyButton from './BuyButton';

describe('Buy Button', () => {
  test('should render buy button with correct label', async () => {
    render(
      <BuyButton
        label="Add to cart"
        articleNumber="article-number-1"
      ></BuyButton>
    );
    expect(screen.getByTestId('buy-button')).toBeVisible();
    expect(screen.getByTestId('buy-button')).toHaveTextContent('Add to cart');
  });
  test('should render buy button without link when product has article number', async () => {
    render(
      <BuyButton
        label="Add to cart"
        articleNumber="article-number-1"
      ></BuyButton>
    );
    expect(screen.getByTestId('buy-button')).toBeVisible();
    expect(screen.getByTestId('buy-button')).not.toHaveAttribute('a');
  });
  test('should show loading spinner after clicking on buy button', async () => {
    render(
      <BuyButton
        label="Add to cart"
        articleNumber="article-number-1"
      ></BuyButton>
    );
    fireEvent.click(screen.getByTestId('buy-button'));
    expect(screen.getByTestId('reactive-wrapper')).toHaveClass(
      'reactive-button--loading'
    );
  });
});

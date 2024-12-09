import { render } from '@testing-library/react';
import { EmptyWebsite } from 'contexts/websiteContext';
import ReactDOM from 'react-dom';
import B2C from './page';

jest.mock('react-dom', () => ({
  ...jest.requireActual<typeof ReactDOM>('react-dom'),
  useFormState: jest.fn().mockReturnValue([{}, jest.fn()]),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

const mockGetWebsite = jest.fn();
jest.mock('services/websiteService.server', () => ({
  get: () => mockGetWebsite(),
}));

const mockGetUserAddresses = jest.fn();
jest.mock('services/userService.server', () => ({
  getUserAddresses: () => mockGetUserAddresses(),
}));

describe('My account addresses Page - B2C', () => {
  beforeEach(() => {
    mockGetUserAddresses.mockResolvedValue({
      me: {
        person: {
          id: 'foo',
          addresses: [
            {
              id: 'bar',
              address1: '123 Main St',
              zipCode: '12345',
              country: 'SE',
              city: 'USA',
              phoneNumber: '12345678',
            },
          ],
        },
      },
    });

    mockGetWebsite.mockResolvedValue({
      ...EmptyWebsite,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render correct page tilte', async () => {
    const Result = await B2C();
    const container = render(Result);
    expect(
      container.getByTestId('my-account-address-b2c__title')
    ).toHaveTextContent('customeraddress.b2c.title');
  });

  test('should get current user address info on page load', async () => {
    const Result = await B2C();
    render(Result);

    expect(mockGetUserAddresses).toHaveBeenCalled();
  });

  test('should get website texts on page load', async () => {
    const Result = await B2C();
    render(Result);

    expect(mockGetWebsite).toHaveBeenCalled();
  });
});

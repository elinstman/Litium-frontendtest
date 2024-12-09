'use client';
import { Button } from 'components/elements/Button';
import { Checkbox } from 'components/elements/Checkbox';
import { Heading2 } from 'components/elements/Heading';
import { Text } from 'components/elements/Text';
import { CartContext } from 'contexts/cartContext';
import { WebsiteContext } from 'contexts/websiteContext';
import { useTranslations } from 'hooks/useTranslations';
import { OrderAddress } from 'models/address';
import {
  Checkout,
  CheckoutOption,
  OrderCustomerDetails,
} from 'models/checkout';
import { usePathname, useRouter } from 'next/navigation';
import { Fragment, useCallback, useContext, useEffect, useState } from 'react';
import { get } from 'services/cartService.client';
import {
  createCheckoutSession,
  placeOrder,
  updateAddresses,
  updateBillingAddress,
  updateCheckoutOptions,
  updateShippingWidget,
} from 'services/checkoutService.client';
import {
  PaymentIntegrationType,
  ShippingIntegrationType,
} from 'utils/constants';
import AddressForm from './AddressForm';
import AddressSummary from './AddressSummary';
import DeliveryOptions from './DeliveryOptions';
import DeliverySummary from './DeliverySummary';
import PaymentOptions from './PaymentOptions';
import TotalSummary from './TotalSummary';
import PaymentWidget from './payments/PaymentWidget';
import ShipmentWidget from './shipments/ShipmentWidget';

const STEP_DELIVERY_ADDRESS = 0;
const STEP_DELIVERY_OPTION = 1;
const STEP_PAYMENT = 2;

/**
 * Renders checkout steps in sequence.
 */
function CheckoutWizard(props: { state?: Checkout }) {
  const t = useTranslations();
  const { checkoutPageUrl, receiptPageUrl } = useContext(WebsiteContext);
  const cartContext = useContext(CartContext);
  const { rows } = cartContext.cart;
  const hasCartChanged = cartContext.hasCartChanged;
  const getCart = useCallback(async () => {
    const cart = await get();
    cartContext.setCart(cart);
  }, [cartContext]);
  const [checkout, setCheckout] = useState<Checkout>(
    props.state ?? DefaultCheckoutState
  );
  const {
    shippingAddress,
    shippingOptions,
    billingAddress,
    paymentHtmlSnippet,
    shipmentHtmlSnippet,
  } = checkout;
  const [paymentOptions, setPaymentOptions] = useState<CheckoutOption[]>(
    filterPayment(checkout.paymentOptions)
  );
  useEffect(() => {
    setPaymentOptions(filterPayment(checkout.paymentOptions));
  }, [checkout.paymentOptions]);
  const saveBillingAddress = async (billingAddress: OrderAddress) => {
    const result = await updateBillingAddress(billingAddress);
    setCheckout(result);
  };
  const savePaymentOptions = async (id: string) => {
    const checkoutOption = {
      paymentOptionId: id,
    };
    const result = await updateCheckoutOptions(checkoutOption);
    setCheckout(result);
  };
  const saveShippingOptions = async (id: string) => {
    const checkoutOption = {
      shippingOptionId: id,
    };
    const result = await updateCheckoutOptions(checkoutOption);
    setCheckout(result);
  };
  const saveShippingWidget = async (id: string) => {
    const result = await updateShippingWidget(id);
    setCheckout(result);
  };
  const confirmOrder = async () => {
    await placeOrder();
  };
  const saveAddresses = async ({
    shippingAddress,
    billingAddress,
    customerDetails,
  }: {
    shippingAddress: OrderAddress;
    billingAddress: OrderAddress;
    customerDetails: OrderCustomerDetails;
  }) => {
    const result = await updateAddresses({
      shippingAddress,
      billingAddress,
      customerDetails,
    });
    setCheckout(result);
  };
  const {
    initialStep,
    showAddress,
    showDelivery,
    showPaymentOptions,
    showSummary,
  } = getDisplayLogic(paymentOptions, shippingOptions);
  const [step, setStep] = useState(initialStep || 0);
  const [useSameAddress, setUseSameAddress] = useState(true);
  const [hasAltAddress, setHasAltAddress] = useState(false);
  const [errors, setErrors] = useState([]);
  const [selectedShipmentWidget, setSelectedShipmentWidget] = useState('');
  const selectedDeliveryOption = getSelectedOption(shippingOptions);
  const selectedPaymentOption = getSelectedOption(paymentOptions);
  const router = useRouter();
  const pathname = usePathname();
  const createSession = useCallback(async () => {
    const host = window.location.origin;
    const checkoutState = await createCheckoutSession(
      {
        checkoutPageUrl: `${host}${checkoutPageUrl}`,
        cancelPageUrl: `${host}${checkoutPageUrl}`,
        receiptPageUrl: `${host}${receiptPageUrl}`,
        allowSeparateShippingAddress: true,
        disablePaymentShippingOptions: false,
      },
      {
        orderConfirmedUrl: `${host}/api/email/orderConfirmation${pathname}`,
      }
    );
    setCheckout(checkoutState);
  }, [checkoutPageUrl, receiptPageUrl, pathname]);

  // create new checkout session onload or when cart content is changed
  // so payment widget got the latest data.
  useEffect(() => {
    createSession();
  }, [rows, createSession]);

  const withErrorCatch = async (fn: () => Promise<void>) => {
    try {
      await fn();
      setErrors([]);
    } catch (error: any) {
      if (error?.length) {
        setErrors(error[0].message);
      } else {
        setErrors(error.networkError?.result?.errors);
      }
    }
  };

  useEffect(() => {
    if (hasCartChanged) {
      if (
        selectedDeliveryOption &&
        selectedDeliveryOption.integrationType ===
          ShippingIntegrationType.DeliveryCheckout
      ) {
        setSelectedShipmentWidget('');
        if (step === STEP_PAYMENT) {
          setStep(STEP_DELIVERY_OPTION);
        }
      }
      cartContext.setHasCartChanged(false);
    }
  }, [selectedDeliveryOption, hasCartChanged, step, cartContext]);

  useEffect(() => {
    setStep(initialStep);
  }, [initialStep]);

  useEffect(() => {
    if (
      paymentOptions.length &&
      paymentOptions.every((item) => item.selected === false) &&
      step === STEP_PAYMENT
    ) {
      savePaymentOptions(paymentOptions[0].id).finally(getCart);
    }

    if (
      shippingOptions.length &&
      shippingOptions.every((item) => item.selected === false)
    ) {
      if (
        hasIntegrationType(
          paymentOptions,
          PaymentIntegrationType.IframeCheckout
        ) &&
        hasIntegrationType(
          shippingOptions,
          ShippingIntegrationType.PaymentCheckout
        )
      ) {
        const filterShipping = shippingOptions.filter(
          (item) =>
            item.integrationType === ShippingIntegrationType.PaymentCheckout
        );
        saveShippingOptions(filterShipping[0].id).finally(getCart);
      } else if (step === STEP_DELIVERY_OPTION) {
        if (
          hasIntegrationType(
            shippingOptions,
            ShippingIntegrationType.DeliveryCheckout
          )
        ) {
          const filterShipping = shippingOptions.filter(
            (item) =>
              item.integrationType === ShippingIntegrationType.DeliveryCheckout
          );
          saveShippingOptions(filterShipping[0].id).finally(getCart);
        } else {
          const filterShipping = shippingOptions.filter(
            (item) =>
              item.integrationType !== ShippingIntegrationType.PaymentCheckout
          );
          saveShippingOptions(filterShipping[0].id).finally(getCart);
        }
      }
    }
  }, [getCart, paymentOptions, shippingOptions, step]);

  const listenMessageHandler = useCallback((event: any) => {
    if (
      event.data.type == 'litium-connect-shipping' &&
      event.data.event == 'optionChanging'
    ) {
      setSelectedShipmentWidget(event.data.data.value);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('message', listenMessageHandler);
    return () => window.removeEventListener('message', listenMessageHandler);
  }, [listenMessageHandler]);

  switch (step) {
    case STEP_DELIVERY_ADDRESS:
      return (
        <div data-testid="STEP_DELIVERY_ADDRESS">
          <Heading2 className="mb-5">
            {t('checkoutwizard.deliveryaddress.title')}
          </Heading2>
          <AddressForm
            value={shippingAddress}
            onSubmit={async (address: OrderAddress) => {
              const customerDetails: OrderCustomerDetails = {
                firstName: address.firstName,
                lastName: address.lastName,
                email: address.email,
                phone: address.phoneNumber,
                customerType: 'PERSON',
              };
              await saveAddresses({
                shippingAddress: address,
                billingAddress: address,
                customerDetails,
              });
              setStep(STEP_DELIVERY_OPTION);
            }}
          />
        </div>
      );
    case STEP_DELIVERY_OPTION:
      return (
        <div data-testid="STEP_DELIVERY_OPTION">
          <Heading2 className="mb-5">
            {t('checkoutwizard.deliveryaddress.title')}
          </Heading2>
          {showAddress && (
            <div data-testid="checkout-wizard__delivery-address-summary">
              <AddressSummary
                value={shippingAddress}
                onEdit={() => setStep(STEP_DELIVERY_ADDRESS)}
                className="mb-8"
              />
            </div>
          )}
          <Heading2 className="mb-5">
            {t('checkoutwizard.deliveryoption.title')}
          </Heading2>
          {!hasIntegrationType(
            shippingOptions,
            ShippingIntegrationType.DeliveryCheckout
          ) && (
            <div data-testid="checkout-wizard__delivery-option">
              <DeliveryOptions
                value={shippingOptions}
                selectedOption={selectedDeliveryOption}
                onChange={async (id: string) => {
                  withErrorCatch(async () => {
                    await saveShippingOptions(id);
                    getCart();
                  });
                }}
                errors={errors}
              />
            </div>
          )}
          {shipmentHtmlSnippet && (
            <div data-testid="checkout-wizard__widget">
              <ShipmentWidget
                responseString={shipmentHtmlSnippet}
                rows={rows}
              />
            </div>
          )}
          <Button
            rounded={true}
            className="w-full p-2"
            onClick={() => {
              if (
                selectedDeliveryOption.integrationType ===
                ShippingIntegrationType.DeliveryCheckout
              ) {
                saveShippingWidget(selectedShipmentWidget).finally(getCart);
              }
              setStep(STEP_PAYMENT);
            }}
            data-testid="checkout-wizard__delivery-option-continue"
            disabled={
              selectedDeliveryOption.integrationType ===
                ShippingIntegrationType.DeliveryCheckout &&
              !selectedShipmentWidget
            }
          >
            {t('checkoutwizard.deliveryoption.button.continue')}
          </Button>
        </div>
      );
    case STEP_PAYMENT:
      return (
        <div data-testid="STEP_PAYMENT">
          {showDelivery && (
            <div data-testid="checkout-wizard__delivery-summary">
              <DeliverySummary
                shippingAddress={checkout.shippingAddress}
                selectedDeliveryOption={selectedDeliveryOption}
                onEdit={() => {
                  if (
                    selectedDeliveryOption.integrationType ===
                    ShippingIntegrationType.DeliveryCheckout
                  ) {
                    setSelectedShipmentWidget('');
                  }
                  setStep(STEP_DELIVERY_OPTION);
                }}
                showAddress={showAddress}
              />
            </div>
          )}
          {showAddress && (
            <Fragment>
              <Heading2>{t('checkoutwizard.payment.title')}</Heading2>
              <div className="mb-5">
                <Checkbox
                  checked={useSameAddress}
                  onChange={() => setUseSameAddress(!useSameAddress)}
                  data-testid="checkout-wizard__checkbox"
                >
                  <Text inline={true} className="text-sm">
                    {t('checkoutwizard.payment.billingaddress')}
                  </Text>
                </Checkbox>
              </div>
            </Fragment>
          )}
          {!useSameAddress && !hasAltAddress && (
            <div data-testid="checkout-wizard__billing-address-form">
              <AddressForm
                value={billingAddress}
                onSubmit={(address: OrderAddress) =>
                  saveBillingAddress(address).finally(() => {
                    setHasAltAddress(true);
                  })
                }
              />
            </div>
          )}
          {!useSameAddress && hasAltAddress && (
            <div data-testid="checkout-wizard__billing-address-summary">
              <AddressSummary
                value={billingAddress}
                onEdit={() => setHasAltAddress(false)}
                className="mb-8"
              />
            </div>
          )}
          {(useSameAddress || hasAltAddress) && (
            <Fragment>
              {showPaymentOptions && (
                <div data-testid="checkout-wizard__payment-option">
                  <PaymentOptions
                    value={paymentOptions}
                    selectedOption={selectedPaymentOption}
                    onChange={async (id: string) => {
                      withErrorCatch(async () => {
                        await savePaymentOptions(id);
                        getCart();
                      });
                    }}
                    errors={errors}
                  />
                </div>
              )}
              {paymentHtmlSnippet && (
                <div data-testid="checkout-wizard__widget">
                  <PaymentWidget
                    responseString={paymentHtmlSnippet}
                    rows={rows}
                  />
                </div>
              )}
              {!paymentHtmlSnippet && showSummary && (
                <div data-testid="checkout-wizard__total-summary">
                  <TotalSummary
                    errors={errors}
                    onClick={async () => {
                      withErrorCatch(async () => {
                        await confirmOrder();
                        const timestamp = Date.now();
                        router.push(`${receiptPageUrl}?q=${timestamp}`);
                      });
                    }}
                  />
                </div>
              )}
            </Fragment>
          )}
        </div>
      );
    default:
      return <Fragment></Fragment>;
  }
}

const hasIntegrationType = (
  options: CheckoutOption[],
  integrationType: string
) => {
  return options.some((item) => item.integrationType === integrationType);
};

const getDisplayLogic = (
  paymentOptions: CheckoutOption[],
  shippingOptions: CheckoutOption[]
) => {
  if (!paymentOptions.length && !shippingOptions.length) {
    return {
      initialStep: 'Empty',
      showAddress: false,
      showDelivery: false,
      showPaymentOptions: false,
      showSummary: false,
    };
  }
  if (
    hasIntegrationType(paymentOptions, PaymentIntegrationType.IframeCheckout) &&
    hasIntegrationType(shippingOptions, ShippingIntegrationType.PaymentCheckout)
  ) {
    return {
      initialStep: STEP_PAYMENT,
      showAddress: false,
      showDelivery: false,
      showPaymentOptions: false,
      showSummary: false,
    };
  }
  if (
    hasIntegrationType(paymentOptions, PaymentIntegrationType.IframeCheckout) &&
    hasIntegrationType(shippingOptions, ShippingIntegrationType.Inline)
  ) {
    return {
      initialStep: STEP_DELIVERY_OPTION,
      showAddress: false,
      showDelivery: true,
      showPaymentOptions: true,
      showSummary: false,
    };
  }
  return {
    initialStep: STEP_DELIVERY_ADDRESS,
    showAddress: true,
    showDelivery: true,
    showPaymentOptions: true,
    showSummary: true,
  };
};

const getSelectedOption = (options: CheckoutOption[]): CheckoutOption => {
  return options.find((option) => option.selected) || options[0];
};

const filterPayment = (paymentOptions: CheckoutOption[]) => {
  if (
    hasIntegrationType(paymentOptions, PaymentIntegrationType.IframeCheckout)
  ) {
    return [
      paymentOptions.filter(
        (item) => item.integrationType === PaymentIntegrationType.IframeCheckout
      )[0],
    ];
  }
  return paymentOptions;
};

const DefaultCheckoutState = {
  shippingAddress: {
    address1: '',
    firstName: '',
    lastName: '',
    zipCode: '',
    city: '',
    country: '',
    organizationName: '',
    email: '',
    phoneNumber: '',
  },
  billingAddress: {
    address1: '',
    firstName: '',
    lastName: '',
    zipCode: '',
    city: '',
    country: '',
    organizationName: '',
    email: '',
    phoneNumber: '',
  },
  shippingOptions: [],
  paymentOptions: [],
  paymentHtmlSnippet: '',
  shipmentHtmlSnippet: '',
  checkoutFlowInfo: {
    receiptPageUrl: '',
  },
};

export default CheckoutWizard;

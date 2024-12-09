import {
  Body,
  Button,
  Column,
  Head,
  Heading,
  Html,
  Img,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import { OrderAddress } from 'models/address';
import { DiscountInfo } from 'models/cart';
import { OrderRow } from 'models/order';
import { get as getCart } from 'services/cartService.server';
import {
  calculateTotalDiscounts,
  getMultipleDiscountInfoMap,
  shouldShowOriginalPrice,
} from 'services/discountService';
import { getAbsoluteImageUrl } from 'services/imageService';
import { get as getWebsite } from 'services/websiteService.server';
import Currency from '../Currency.server';

async function EmailOrderConfirmation(
  receipt: {
    rows: OrderRow[];
    discountInfos: DiscountInfo[];
    shippingAddress: OrderAddress;
    orderNumber: string;
    totalVat: number;
    grandTotal: number;
    customerDetails: {
      email: string;
      phone: string;
    };
  },
  myPagesPageUrl?: string,
  websiteTexts?: { key: string; value: string }[]
) {
  const {
    rows,
    discountInfos,
    shippingAddress,
    grandTotal,
    totalVat,
    orderNumber,
    customerDetails,
  } = receipt;
  const productLineItems = rows.filter((item) => item.rowType === 'PRODUCT');
  const shippingFeeLine = rows.filter(
    (item) => item.rowType === 'SHIPPING_FEE'
  );
  const totalShippingFees = shippingFeeLine.reduce(
    (acc, shippingFee) => acc + shippingFee.totalIncludingVat,
    0
  );
  const feeLines = rows.filter((item) => item.rowType === 'FEE');
  const totalFees = feeLines.reduce(
    (acc, fee) => acc + fee.totalIncludingVat,
    0
  );
  const multipleDiscountInfoMap = getMultipleDiscountInfoMap(productLineItems);
  const totalDiscounts = Math.abs(calculateTotalDiscounts(discountInfos));
  const translate = (key: string) =>
    websiteTexts?.filter((item) => item.key === key)[0]?.value || key;
  const website = await getWebsite();
  const cart = await getCart();

  return (
    <Html lang="en">
      <Head />
      <Tailwind>
        <Body className="mx-auto w-[30rem] rounded-md border border-solid border-slate-800 bg-white p-5 font-sans">
          <Heading as="h1">
            {translate('emailorderconfirmation.title')} {orderNumber}
          </Heading>
          <Text className="m-0 mt-2">
            {translate('emailorderconfirmation.sayhi')}{' '}
            {shippingAddress?.firstName},
          </Text>
          <Text className="m-0 mt-2">
            {translate('emailorderconfirmation.thankyou')} {orderNumber}
          </Text>
          <Section className="mt-10">
            <Text className="m-0 font-bold">
              {translate('emailorderconfirmation.deliveryaddress.title')}
            </Text>
            <Text className="m-0 mt-2">
              {shippingAddress?.firstName} {shippingAddress?.lastName}
            </Text>
            <Text className="m-0 mt-2">{shippingAddress?.address1}</Text>
            <Text className="m-0 mt-2">{shippingAddress?.zipCode}</Text>
            <Text className="m-0 mt-2">{shippingAddress?.city}</Text>
            <Text className="m-0 mt-2">{shippingAddress?.country}</Text>
          </Section>
          <Section className="mt-10">
            <Text className="m-0 font-bold">
              {translate('emailorderconfirmation.contactinfo.title')}
            </Text>
            <Text className="m-0 mt-2">{customerDetails?.email}</Text>
            <Text className="m-0 mt-2">{customerDetails?.phone}</Text>
          </Section>
          <Section className="mt-10">
            <Text className="m-0 font-bold">
              {translate('emailorderconfirmation.ordernumber')} {orderNumber}
            </Text>
            {productLineItems.map((item) => {
              const props = {
                translate,
                asterisk: multipleDiscountInfoMap[item.articleNumber],
                ...item,
              };
              return (
                <ProductLineItem
                  key={item.articleNumber}
                  culture={website.culture.code}
                  currency={cart.currency.code}
                  {...props}
                />
              );
            })}
            <Row className="mt-2">
              <Column>
                <Text className="m-0">
                  {translate('emailorderconfirmation.fee.title')}
                </Text>
              </Column>
              <Column align="right">
                <Currency
                  className="m-0"
                  price={totalFees}
                  culture={website.culture.code}
                  currency={cart.currency.code}
                />
              </Column>
            </Row>
            <Row>
              <Column>
                <Text className="m-0">
                  {translate('emailorderconfirmation.delivery.title')}
                </Text>
              </Column>
              <Column align="right">
                <Currency
                  className="m-0"
                  price={totalShippingFees}
                  culture={website.culture.code}
                  currency={cart.currency.code}
                />
              </Column>
            </Row>
            <Row>
              <Column>
                <Text className="m-0">
                  {translate('emailorderconfirmation.discount.title')}
                </Text>
              </Column>
              <Column align="right">
                <Currency
                  className="m-0"
                  price={totalDiscounts}
                  culture={website.culture.code}
                  currency={cart.currency.code}
                />
              </Column>
            </Row>
            <Row>
              <Column>
                <Text className="m-0">
                  {translate('emailorderconfirmation.VAT.title')}
                </Text>
              </Column>
              <Column align="right">
                <Currency
                  className="m-0"
                  price={totalVat}
                  culture={website.culture.code}
                  currency={cart.currency.code}
                />
              </Column>
            </Row>
            <Row className="font-bold">
              <Column>
                <Text className="m-0">
                  {translate('emailorderconfirmation.total.title')}
                </Text>
              </Column>
              <Column align="right">
                <Currency
                  className="m-0"
                  price={grandTotal}
                  culture={website.culture.code}
                  currency={cart.currency.code}
                />
              </Column>
            </Row>
          </Section>
          <Section className="mt-5">
            <Text className="m-0">
              {translate('emailorderconfirmation.anyquestions')}
            </Text>
            <Row className="mt-5 text-center">
              <Button
                style={{ padding: '10px 0px' }}
                className="mx-auto block w-48 rounded-md bg-black text-center text-white"
                href={myPagesPageUrl ?? '/'}
              >
                {translate('emailorderconfirmation.mypages')}
              </Button>
            </Row>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default EmailOrderConfirmation;

function ProductLineItem(props: any) {
  const {
    quantity,
    totalIncludingVat,
    articleNumber,
    product,
    discountInfos,
    asterisk,
    translate,
    currency,
    culture,
  } = props;

  const discountedPrice = (() => {
    if (shouldShowOriginalPrice(discountInfos)) {
      const totalDiscountsPrice = calculateTotalDiscounts(discountInfos);
      return totalIncludingVat + totalDiscountsPrice;
    }
    return totalIncludingVat;
  })();

  return (
    <Row>
      <Column>
        <Img
          src={getAbsoluteImageUrl(product.smallImages[0])}
          alt={`img-${articleNumber}`}
          style={{ float: 'left' }}
          width={product.smallImages[0]?.dimension?.width}
          height={product.smallImages[0]?.dimension?.height}
        />
      </Column>
      <Column>
        <Row>
          <Column>
            <Text className="m-0 w-44 truncate text-sm">{product?.name}</Text>
            <Text className="m-0 w-44 truncate text-[10px]">
              {articleNumber}
            </Text>
          </Column>
          <Column className="text-end align-top" align="right">
            <Currency
              className="inline text-xs"
              price={discountedPrice}
              culture={culture}
              currency={currency}
            />
            {asterisk && <span className="text-xs">&nbsp;*</span>}
            {shouldShowOriginalPrice(discountInfos) && (
              <Currency
                className="text-[10px]"
                price={totalIncludingVat}
                strikethrough
                culture={culture}
                currency={currency}
              />
            )}
            <Text className="m-0 text-end text-xs">
              {translate('emailorderconfirmation.quantity.title')} {quantity}
            </Text>
          </Column>
        </Row>
      </Column>
    </Row>
  );
}

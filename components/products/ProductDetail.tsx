'use client';
import { Accordion, AccordionPanel } from 'components/Accordion';
import BuyButton from 'components/BuyButton';
import ImageGallery from 'components/ImageGallery';
import StockStatus from 'components/StockStatus';
import { Button } from 'components/elements/Button';
import { Heading2 } from 'components/elements/Heading';
import { HtmlText } from 'components/elements/HtmlText';
import { Text } from 'components/elements/Text';
import HorizontalProductList from 'components/products/HorizontalProductList';
import { WebsiteContext } from 'contexts/websiteContext';
import { useTranslations } from 'hooks/useTranslations';
import { ProductItem } from 'models/products';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useContext } from 'react';
import { getAbsoluteImageUrl } from 'services/imageService';
import ProductPrice from './ProductPrice';

/**
 * Renders a product's information.
 * @param props a product object.
 */
function ProductDetail(props: ProductItem) {
  const {
    name,
    fields,
    price,
    thumbnailImages,
    stockStatus,
    largeImages,
    articleNumber,
    parent,
    rawData,
    relationships,
    fieldGroups,
  } = props;

  const t = useTranslations();
  const website = useContext(WebsiteContext);
  const variants = rawData.variants;
  const currentColor = fields.color ? fields.color[0].name : null;
  const currentSize = fields.size ? fields.size[0].name : null;

  const colors = Array.from(
    new Set(
      variants
        .filter((item: any) => item.fields.color)
        .map((item: any) => item.fields.color[0].name)
        .sort()
    )
  );

  const sizes = Array.from(
    new Set(
      variants
        .filter((item: any) => item.fields.size)
        .map((item: any) => item.fields.size[0].name)
        .sort()
    )
  );

  const getVariant = (size: any, color: any) => {
    return variants.find((item) => {
      const itemColor = item.fields.color ? item.fields.color[0].name : null;
      const itemSize = item.fields.size ? item.fields.size[0].name : null;
      return itemColor === color && itemSize === size;
    });
  };

  const getVariantUrl = (size: any, color: any) => {
    let variant = getVariant(size, color);
    if (!variant) {
      // get the first matched value for the selected color if the variant doesn't match any color or size
      if (color !== currentColor) {
        variant = variants.find((item) =>
          item.fields.color ? item.fields.color[0].name === color : false
        );
      }
      // get the first matched value for the selected size if the variant doesn't match any color or size
      if (size !== currentSize) {
        variant = variants.find((item) =>
          item.fields.size ? item.fields.size[0].name === size : false
        );
      }
    }
    return variant?.url;
  };

  const getFieldValue = (field: any) => {
    // Field options
    if (!isEmpty(field.textOptionFieldValues)) {
      return field.textOptionFieldValues
        .map((item: any) => item.name)
        .join('; ');
    }
    // Field value
    if (!isEmpty(field.stringValue)) {
      return <HtmlText innerHTML={field.stringValue} />;
    }
    // Media file
    if (!isEmpty(field.pointerMediaFileValue)) {
      return (
        <Link
          href={field.pointerMediaFileValue.item?.url}
          target="_blank"
          title={
            field.pointerMediaFileValue.item?.alt ||
            field.pointerMediaFileValue.item?.filename
          }
          data-testid="product-detail__field-file"
        >
          {field.pointerMediaFileValue.item?.filename}
        </Link>
      );
    }
    // Field link
    if (!isEmpty(field.linkFieldValue)) {
      return (
        <Link
          href={field.linkFieldValue.url}
          target="_blank"
          title={field.linkFieldValue.text}
          data-testid="product-detail__field-link"
        >
          {field.linkFieldValue.text}
        </Link>
      );
    }

    //Field image
    if (!isEmpty(field.pointerMediaImageValue)) {
      return (
        <Image
          src={getAbsoluteImageUrl(
            field.pointerMediaImageValue.item,
            website.imageServerUrl
          )}
          alt={field.pointerMediaImageValue.item?.filename}
          width={field.pointerMediaImageValue.item?.dimension?.width}
          height={field.pointerMediaImageValue.item?.dimension?.height}
          data-testid={'product-detail__field-image'}
        ></Image>
      );
    }

    if (!isEmpty(field.booleanValue))
      return t(`productdetail.field.boolean.${field.booleanValue}`);

    if (!isEmpty(field.longValue)) return field.longValue;

    if (!isEmpty(field.intValue)) return field.intValue;

    if (!isEmpty(field.intOptionFieldValues))
      return field.intOptionFieldValues
        .map((item: any) => item.name)
        .join('; ');

    if (!isEmpty(field.decimalValue)) return field.decimalValue;

    if (!isEmpty(field.dateTimeValue)) return field.dateTimeValue;
  };

  const getFieldKey = (field: any) => {
    return field.field || field.name;
  };

  return (
    <Fragment>
      <div className="my-4 text-center">
        <Link
          className="text-xs text-secondary-2"
          href={parent.url}
          data-testid="product-detail__category"
        >
          {parent.name}
        </Link>
      </div>
      <div className="mb-3.5 flex flex-col justify-center lg:flex-row">
        <div className="lg:mr-4">
          {thumbnailImages && largeImages && (
            <ImageGallery
              thumbnailImages={thumbnailImages}
              largeImages={largeImages}
              alternativeText={name ?? ''}
            />
          )}
        </div>
        <div className="w-full lg:w-80">
          <Heading2 className="mb-6" data-testid="product-detail__name">
            {name ?? ''}
          </Heading2>
          <div className="mb-6">
            <Text className="mb-2 text-sm">{t('productdetail.color')}</Text>
            <div className="flex flex-wrap gap-2">
              {colors.map((color, index) => (
                <Button
                  className="h-12 min-w-[60px]"
                  key={`color__${color}-${index}`}
                  type="link"
                  title={color}
                  url={getVariantUrl(currentSize, color)}
                  rounded={true}
                  active={color === currentColor}
                  disabled={!getVariant(currentSize, color)}
                  data-testid="product-detail__color"
                ></Button>
              ))}
            </div>
          </div>
          {sizes.length > 0 && (
            <div className="mb-6">
              <Text className="mb-2 text-sm">{t('productdetail.size')}</Text>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size, index) => (
                  <Button
                    className="h-12 min-w-[60px]"
                    key={`size__${size}-${index}`}
                    type="link"
                    title={size}
                    url={getVariantUrl(size, currentColor)}
                    rounded={true}
                    active={size === currentSize}
                    disabled={!getVariant(size, currentColor)}
                    data-testid="product-detail__size"
                  ></Button>
                ))}
              </div>
            </div>
          )}
          <div className="mb-3.5 flex justify-between text-sm">
            <StockStatus
              className="uppercase"
              inStockQuantity={stockStatus.inStockQuantity}
              data-testid="product-detail__status"
            />
            <ProductPrice price={price} data-testid="product-detail__price" />
          </div>
          <BuyButton
            label={'productdetail.button.add'}
            successLabel={'productdetail.button.add.success'}
            fluid={true}
            articleNumber={articleNumber}
            disabled={stockStatus.inStockQuantity == 0}
          ></BuyButton>
        </div>
      </div>
      <Accordion
        classCssHeader="[&>p]:text-h2 [&>p]:pl-5 [&>svg]:mr-5 -mx-5 lg:-mr-10 xl:ml-0 xl:-mr-5"
        classCssContent="-mx-5 px-5 lg:-mr-10 xl:ml-0 xl:-mr-5"
        classCssIcon="text-h2 h-5 w-5"
      >
        {fieldGroups &&
          fieldGroups.map((group) => {
            const { fieldGroupId, name, fields } = group;
            return (
              <AccordionPanel
                key={name || fieldGroupId}
                header={name || fieldGroupId}
              >
                <Fragment>
                  {fields
                    ?.filter((field: any) => field.field)
                    .map((field: any, index) => {
                      return (
                        <Fragment key={`${getFieldKey(field)}-${index}`}>
                          <Text
                            className="mb-1 mt-2 font-bold"
                            data-testid="product-detail__field-name"
                          >
                            {field.name}
                          </Text>
                          <div
                            className="mb-7 last-of-type:mb-0"
                            data-testid="product-detail__field-value"
                          >
                            {getFieldValue(field)}
                          </div>
                        </Fragment>
                      );
                    })}
                </Fragment>
              </AccordionPanel>
            );
          })}
      </Accordion>
      <HorizontalProductList
        items={relationships?.similarProducts?.items?.nodes}
        title={relationships?.similarProducts?.name}
        className="xl:px-5"
      />
      <HorizontalProductList
        items={relationships?.accessory?.items?.nodes}
        title={relationships?.accessory?.name}
        className="xl:px-5"
      />
    </Fragment>
  );
}

export default ProductDetail;

function isEmpty(value: any) {
  return (
    // null or undefined
    value == null ||
    // has length and it's zero
    (value.hasOwnProperty('length') && value.length === 0) ||
    // is an Object and has no keys
    (value.constructor === Object && Object.keys(value).length === 0)
  );
}

'use client';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, SecondaryButon } from 'components/elements/Button';
import { Input } from 'components/elements/Input';
import DropdownField from 'components/form/DropdownField';
import ErrorText from 'components/form/ErrorText';
import InputField from 'components/form/InputField';
import { WebsiteContext } from 'contexts/websiteContext';
import { useTranslations } from 'hooks/useTranslations';
import { CustomerAddress, ManageAddressForPersonPayload } from 'models/address';
import { usePathname, useRouter } from 'next/navigation';
import { Fragment, useContext, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { localeSensitiveCompare } from 'utils/string';
import * as yup from 'yup';

/**
 * Renders an address form of my account address page.
 * @param value an object to contain address value.
 * @param onSubmit event occurs when address form is submitted.
 * @param showCancelBtn a flag to show/hide the cancel button
 * @param shouldRedirect a flag to send a redirect URL on submitting
 * ```
 *  <AddressForm value={value} onSubmit={onSubmit} showCancelBtn={true} />
 * ```
 */
function AddressForm({
  value,
  onSubmit,
  showCancelBtn = false,
  shouldRedirect = true,
}: {
  value?: CustomerAddress;
  onSubmit: (
    formData: CustomerAddress
  ) => Promise<ManageAddressForPersonPayload>;
  showCancelBtn?: boolean;
  shouldRedirect?: boolean;
}) {
  const schemaAddress = yup.object({
    address1: yup.string(),
    zipCode: yup.string(),
    city: yup.string(),
    country: yup.string(),
    phoneNumber: yup.string(),
    id: yup.string(),
  });
  const pathname = usePathname();
  const [errors, setErrors] = useState<any>([]);

  type AddressFormData = yup.InferType<typeof schemaAddress>;
  const { control, handleSubmit, reset } = useForm<AddressFormData>({
    resolver: yupResolver(schemaAddress),
    defaultValues: useMemo(() => {
      return {
        address1: value?.address1 ?? '',
        zipCode: value?.zipCode ?? '',
        city: value?.city ?? '',
        country: value?.country ?? '',
        phoneNumber: value?.phoneNumber ?? '',
        id: value?.id ?? '',
      };
    }, [value]),
  });
  const onFormSubmit = async (data: any) => {
    try {
      const result = await onSubmit(data);
      if (result.customerAddress) {
        reset(result.customerAddress);
      }
      setErrors(result.errors);
      if (!result.errors && shouldRedirect) {
        router.replace(pathname);
        router.refresh();
      }
    } catch (error) {
      setErrors(error);
    }
  };
  const websites = useContext(WebsiteContext);
  const { countries, culture } = websites;
  const sortedCountries = countries.sort((a, b) =>
    localeSensitiveCompare(a.name, b.name, culture.code)
  );
  const t = useTranslations();
  const router = useRouter();

  return (
    <Fragment>
      <form
        className="flex w-full flex-col gap-2 sm:max-w-96"
        onSubmit={handleSubmit(onFormSubmit)}
      >
        <InputField
          control={control}
          name="address1"
          placeholder={t('addressform.address')}
          data-testid="customer-address__address"
        />
        <InputField
          control={control}
          name="zipCode"
          placeholder={t('addressform.zip')}
          data-testid="customer-address__zipcode"
        />
        <InputField
          control={control}
          name="city"
          placeholder={t('addressform.city')}
          data-testid="customer-address__city"
        />
        <DropdownField
          control={control}
          name="country"
          dataTestId="customer-address__country"
          placeholder={t('addressform.country')}
          items={sortedCountries}
        />
        <InputField
          control={control}
          name="phoneNumber"
          placeholder={t('addressform.phone')}
          data-testid="customer-address__phone-number"
        />
        <Input
          type="hidden"
          name="id"
          data-testid="customer-address__id"
          value={value?.id}
        />
        {showCancelBtn && (
          <div className="grid grid-cols-2 gap-3">
            <SecondaryButon
              className="p-3 text-sm"
              rounded
              data-testid="customer-address__cancel"
              onClick={() => {
                router.replace(pathname);
              }}
            >
              {t('customeraddress.button.cancel')}
            </SecondaryButon>
            <Button
              type="submit"
              className="p-3 text-sm"
              data-testid="customer-address__submit"
              rounded
              fluid
            >
              {t('customeraddress.button.save')}
            </Button>
          </div>
        )}
        {!showCancelBtn && (
          <Button
            type="submit"
            className="p-3 text-sm"
            data-testid="customer-address__submit"
            rounded
            fluid
          >
            {t('customeraddress.button.save')}
          </Button>
        )}
      </form>
      {!!errors && (
        <ErrorText errors={errors} className="py-2 text-base"></ErrorText>
      )}
    </Fragment>
  );
}

export default AddressForm;

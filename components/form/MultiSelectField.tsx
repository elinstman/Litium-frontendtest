import Select from 'components/Select';
import { Fragment } from 'react';
import { Controller } from 'react-hook-form';
import ErrorText from './ErrorText';

function MultiSelectField({
  control,
  name = '',
  placeholder = '',
  items = [],
  idSelector = (option: any) => option,
  textSelector = (option: any) => option,
  multiSelect,
  disabled = false,
  ...props
}: {
  control: any;
  name: string;
  placeholder: string;
  items?: any[];
  idSelector?: (option: any) => string;
  textSelector?: (option: any) => string;
  multiSelect?: boolean;
  disabled?: boolean;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Fragment>
          <Select
            options={items}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            textSelector={textSelector}
            idSelector={idSelector}
            multiSelect={multiSelect}
            className={error && '!border-error'}
            disabled={disabled}
            {...props}
          />
          {error && <ErrorText errors={error} className="py-1" />}
        </Fragment>
      )}
    />
  );
}

export default MultiSelectField;

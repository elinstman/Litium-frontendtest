import { Checkbox } from 'components/elements/Checkbox';
import { Controller } from 'react-hook-form';
import ErrorText from './ErrorText';

function CheckboxField({
  control,
  name,
  placeholder,
  disabled = false,
  ...props
}: {
  control: any;
  name: string;
  placeholder: string;
  disabled?: boolean;
}) {
  return (
    <Controller
      // @ts-ignore
      rules={{ disabled: disabled }}
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div>
          <Checkbox
            checked={value}
            onChange={onChange}
            disabled={disabled}
            {...props}
          >
            <span>{placeholder}</span>
          </Checkbox>
          {error && <ErrorText errors={error} className="mx-3 py-1" />}
        </div>
      )}
    />
  );
}

export default CheckboxField;

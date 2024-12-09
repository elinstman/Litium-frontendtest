import Textarea from 'components/elements/Textarea';
import { Fragment } from 'react';
import { Controller } from 'react-hook-form';
import ErrorText from './ErrorText';

function TextareaField({
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
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Fragment>
          <Textarea
            id={name}
            value={value}
            onChange={onChange}
            className={error && '!border-error'}
            placeholder={placeholder}
            disabled={disabled}
            {...props}
          />
          {error && <ErrorText errors={error} className="mx-3 py-1" />}
        </Fragment>
      )}
    />
  );
}

export default TextareaField;

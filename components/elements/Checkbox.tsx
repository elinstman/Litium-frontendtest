import clsx from 'clsx';
import { ChangeEvent } from 'react';
import { Input } from './Input';

export function Checkbox({
  className = '',
  checked,
  children,
  onChange,
  disabled = false,
  ...props
}: {
  className?: string;
  checked: boolean;
  children: React.ReactNode;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}) {
  return (
    <label
      className={clsx(
        'whitespace-nowrap',
        disabled && 'cursor-default',
        !disabled && 'cursor-pointer'
      )}
    >
      <Input
        className="peer hidden"
        type="checkbox"
        onChange={onChange}
        checked={checked}
        disabled={disabled}
        {...props}
      />
      <span
        className={clsx(
          `flex items-center before:mr-1 before:inline-block before:h-5 before:w-5 before:rounded-md before:border before:border-tertiary `,
          !disabled &&
            `before:hoverable:hover:bg-[url('/images/check-hover.svg')]  before:hoverable:hover:bg-center before:hoverable:hover:bg-no-repeat`,
          `before:peer-checked:bg-black before:peer-checked:bg-[url('/images/check.svg')] before:peer-checked:bg-center before:peer-checked:bg-no-repeat`,
          `before:peer-checked:border-black`,
          `peer-disabled:text-tertiary before:peer-disabled:border-disabled-border before:peer-disabled:bg-tertiary`,
          className
        )}
      >
        {children}
      </span>
    </label>
  );
}

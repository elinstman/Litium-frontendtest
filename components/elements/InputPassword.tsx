'use client';
import clsx from 'clsx';
import HiddenEye from 'components/icons/hidden-eye';
import ViewEye from 'components/icons/view-eye';
import React, { useState } from 'react';
import { InputText, InputTextProps } from './Input';

/**
 * Renders an input element with type "password"
 * @param value a default value of an input password element
 * @param onChange event occurs when the value of an input password is changed
 * @param placeholder a label display by a placeholder
 * @param id an unique id of the input
 * @param className a customize class name
 */
export const InputPassword = React.forwardRef<HTMLInputElement, InputTextProps>(
  (
    { value = '', onChange, placeholder = '', id, className = '', ...props },
    ref
  ) => {
    const [showPlainText, setShowPlainText] = useState(false);
    return (
      <div className="relative">
        <InputText
          className={clsx('relative', className)}
          onChange={onChange}
          value={value}
          type={showPlainText ? 'text' : 'password'}
          id={id}
          ref={ref}
          placeholder={placeholder}
          {...props}
        />
        {showPlainText && (
          <div onClick={() => setShowPlainText(false)}>
            <ViewEye className="absolute right-3 top-[50%] -translate-y-2/4 cursor-pointer" />
          </div>
        )}
        {!showPlainText && (
          <div onClick={() => setShowPlainText(true)}>
            <HiddenEye className="absolute right-3 top-[50%] -translate-y-2/4 cursor-pointer" />
          </div>
        )}
      </div>
    );
  }
);

InputPassword.displayName = 'InputPassword';

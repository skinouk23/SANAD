import * as React from 'react';

import { formatTunisiaPhoneInput, TUNISIA_PHONE_PLACEHOLDER } from '@/utils/input-validation';

import { Input, type InputProps } from './input';
import { InputGroupInput } from './input-group';

export interface TunisiaPhoneInputProps extends Omit<InputProps, 'type' | 'placeholder'> {
  inputVariant?: 'default' | 'group' | 'unstyled';
  onValueChange?: (value: string) => void;
  placeholder?: string;
}

export const TunisiaPhoneInput = React.forwardRef<HTMLInputElement, TunisiaPhoneInputProps>(
  function TunisiaPhoneInput(
    {
      onChange,
      onValueChange,
      placeholder = TUNISIA_PHONE_PLACEHOLDER,
      inputVariant = 'default',
      value,
      ...props
    },
    ref,
  ) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const formattedValue = formatTunisiaPhoneInput(event.currentTarget.value);

      event.currentTarget.value = formattedValue;
      onValueChange?.(formattedValue);
      onChange?.(event);
    };

    const inputProps = {
      ...props,
      autoComplete: props.autoComplete ?? 'tel',
      inputMode: props.inputMode ?? 'tel',
      onChange: handleChange,
      placeholder,
      type: 'tel',
      value: typeof value === 'string' ? formatTunisiaPhoneInput(value) : value,
    } satisfies React.ComponentPropsWithoutRef<'input'>;

    if (inputVariant === 'unstyled') {
      return <input {...inputProps} ref={ref} />;
    }

    if (inputVariant === 'group') {
      return <InputGroupInput {...inputProps} ref={ref} />;
    }

    return <Input {...inputProps} ref={ref} />;
  },
);

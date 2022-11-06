import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import cn from 'classnames';
import Label from './Label';
import Error from './Error';
import Tip from './Tip';

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  tip?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
};

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      tip,
      error,
      startAdornment = null,
      endAdornment = null,
      id,
      className,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const showError = !!error && !disabled;
    const showTip = !showError && !!tip;

    return (
      <div className="w-full">
        {label && (
          <div className="mb-2">
            <Label
              htmlFor={id}
              error={showError}
              disabled={disabled}
              required={required}
            >
              {label}
            </Label>
          </div>
        )}
        <div
          className={cn('flex items-center border text-sm rounded-lg w-full', {
            'bg-zinc-50': !disabled,
            'bg-zinc-100': !!disabled,
            'border-zinc-300': !error || !!disabled,
            'border-red-600': !!error && !disabled,
            'text-zinc-900': !error && !disabled,
            'text-red-600': !!error && !disabled,
            'text-zinc-400 cursor-not-allowed': !!disabled,
          })}
        >
          {startAdornment && (
            <div className="text-zinc-500 border-r border-zinc-300 p-2">
              {startAdornment}
            </div>
          )}
          <input
            id={id}
            ref={ref}
            disabled={disabled}
            {...props}
            className={cn(
              'w-full bg-transparent placeholder:text-zinc-400 focus-ring p-2',
              className,
              {
                'rounded-l-lg': !startAdornment,
                'rounded-r-lg': !endAdornment,
              }
            )}
          />
          {endAdornment && (
            <div className="text-zinc-500 border-l border-zinc-300 p-2 ml-[1px]">
              {endAdornment}
            </div>
          )}
        </div>
        {showTip && (
          <div className="mt-1">
            <Tip>{tip}</Tip>
          </div>
        )}
        {showError && (
          <div className="mt-1">
            <Error>{error}</Error>
          </div>
        )}
      </div>
    );
  }
);
TextField.displayName = 'TextField';

export default TextField;

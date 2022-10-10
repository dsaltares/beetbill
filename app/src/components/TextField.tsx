import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import cn from 'classnames';

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  tip?: string;
};

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, tip, error, id, className, disabled, ...props }, ref) => {
    const showError = !!error && !disabled;
    const showTip = !showError && !!tip;

    return (
      <div className="w-full">
        {label && (
          <div className="mb-2">
            <label
              htmlFor={id}
              className={cn('text-sm font-medium', {
                'text-zinc-900': !error && !disabled,
                'text-red-600': !!error && !disabled,
                'text-zinc-400': !!disabled,
              })}
            >
              {label}
            </label>
          </div>
        )}
        <input
          id={id}
          ref={ref}
          disabled={disabled}
          {...props}
          className={cn(
            'border text-sm rounded-lg focus-ring block w-full p-2.5 placeholder:text-zinc-400',
            className,
            {
              'bg-gray-50': !disabled,
              'bg-gray-100': !!disabled,
              'border-gray-300': !error || !!disabled,
              'border-red-600': !!error && !disabled,
              'text-zinc-900': !error && !disabled,
              'text-red-600': !!error && !disabled,
              'text-zinc-400 cursor-not-allowed': !!disabled,
            }
          )}
        />
        {showTip && (
          <div className="mt-2">
            <span
              className={cn('text-sm ', {
                'text-zinc-900': !disabled,
                'text-zinc-400': !!disabled,
              })}
            >
              {tip}
            </span>
          </div>
        )}
        {showError && (
          <div className="mt-2">
            <span role="alert" className="text-sm text-red-600">
              {error}
            </span>
          </div>
        )}
      </div>
    );
  }
);
TextField.displayName = 'TextField';

export default TextField;

import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import cn from 'classnames';

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  tip?: string;
};

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, tip, error, id, className, disabled, ...props }, ref) => (
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
          'border text-sm rounded-lg focus-ring block w-full p-2.5',
          className,
          {
            'bg-gray-50': !disabled,
            'bg-gray-100': !!disabled,
            'border-gray-300': !error,
            'border-red-600': !!error,
            'text-zinc-900': !error && !disabled,
            'text-red-600': !!error && !disabled,
            'text-zinc-400': !!disabled,
          }
        )}
      />
      {!error && tip && (
        <div className="mt-2">
          <span role="alert" className="text-sm text-zinc-900">
            {tip}
          </span>
        </div>
      )}
      {error && (
        <div className="mt-2">
          <span role="alert" className="text-sm text-red-600">
            {error}
          </span>
        </div>
      )}
    </div>
  )
);

TextField.displayName = 'TextField';

export default TextField;

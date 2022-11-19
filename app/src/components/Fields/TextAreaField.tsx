import type { TextareaHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import cn from 'classnames';
import Label from './Label';
import Error from './Error';
import Tip from './Tip';

type TextAreaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  tip?: string;
};

const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  (
    {
      label,
      tip,
      error,
      id,
      className,
      disabled,
      required,
      rows = 2,
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
          <textarea
            id={id}
            ref={ref}
            disabled={disabled}
            {...props}
            className={cn(
              'w-full bg-transparent placeholder:text-zinc-400 focus-ring p-2 rounded-lg',
              className
            )}
            rows={rows}
          />
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
TextAreaField.displayName = 'TextField';

export default TextAreaField;

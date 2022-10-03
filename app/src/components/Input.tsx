import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import cn from 'classnames';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className, ...props }, ref) => (
    <div className="w-full">
      <input
        ref={ref}
        {...props}
        className={cn(
          'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus-ring block w-full p-2.5',
          className
        )}
      />
      {error && (
        <span role="alert" className="ml-3.5 mt-1 text-xs text-red-700">
          {error}
        </span>
      )}
    </div>
  )
);

Input.displayName = 'Input';

export default Input;

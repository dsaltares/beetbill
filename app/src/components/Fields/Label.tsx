import type { PropsWithChildren } from 'react';
import cn from 'classnames';

type LabelProps = PropsWithChildren<{
  htmlFor?: string;
  error?: boolean;
  disabled?: boolean;
  required?: boolean;
}>;

const Label = ({
  htmlFor,
  error,
  disabled,
  required,
  children,
}: LabelProps) => (
  <label
    htmlFor={htmlFor}
    className={cn('text-sm font-medium', {
      'text-zinc-900': !error && !disabled,
      'text-red-600': !!error && !disabled,
      'text-zinc-400': !!disabled,
      "after:content-['*'] after:ml-0.5 after:text-red-500": !!required,
    })}
  >
    {children}
  </label>
);

export default Label;

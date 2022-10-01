import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import cn from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary';
    mode?: 'default' | 'light' | 'outlined' | 'borderless';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    startIcon?: IconDefinition;
    endIcon?: IconDefinition;
  }
>;

const Button = ({
  variant = 'primary',
  mode = 'default',
  size = 'md',
  fullWidth = false,
  children,
  disabled,
  startIcon,
  endIcon,
  ...buttonProps
}: ButtonProps) => (
  <button
    className={cn('rounded-md text-base', {
      'bg-violet-700 text-white':
        !disabled && variant === 'primary' && mode === 'default',
      'bg-violet-100 text-violet-900':
        !disabled && variant === 'primary' && mode === 'light',
      'bg-white text-violet-800 border border-violet-800':
        !disabled && variant === 'primary' && mode === 'outlined',
      'bg-white text-violet-800 border border-violet-50':
        !disabled && variant === 'primary' && mode === 'borderless',
      'bg-zinc-800 text-white':
        !disabled && variant === 'secondary' && mode === 'default',
      'bg-zinc-200 text-zinc-800':
        !disabled && variant === 'secondary' && mode === 'light',
      'bg-white text-zinc-800 border border-zinc-800':
        !disabled && variant === 'secondary' && mode === 'outlined',
      'bg-white text-zinc-800 border border-zinc-100':
        !disabled && variant === 'secondary' && mode === 'borderless',
      'bg-zinc-100 text-zinc-400': !!disabled,
      'p-2': size === 'sm',
      'p-3': size === 'md',
      'p-4': size === 'lg',
      'w-full': fullWidth,
    })}
    disabled={disabled}
    {...buttonProps}
  >
    {startIcon && <FontAwesomeIcon className="w-4 h-4 mr-2" icon={startIcon} />}
    {children}
    {endIcon && <FontAwesomeIcon className="w-4 h-4 ml-2" icon={endIcon} />}
  </button>
);

export default Button;

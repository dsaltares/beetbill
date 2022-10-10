import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import cn from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import type { Icon } from './Icons/types';

type IconProp = IconDefinition | Icon;

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    color?: 'primary' | 'secondary';
    variant?: 'solid' | 'light' | 'outlined' | 'borderless';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    startIcon?: IconProp;
    endIcon?: IconProp;
  }
>;

const renderIcon = (Icon: IconProp | undefined, className: string) => {
  const finalClassName = cn('w-4 h-4', className);
  if (!Icon) {
    return null;
  }
  if (typeof Icon === 'function') {
    return <Icon className={finalClassName} />;
  }
  return <FontAwesomeIcon icon={Icon} className={finalClassName} />;
};

const Button = ({
  color = 'primary',
  variant = 'solid',
  size = 'md',
  fullWidth = false,
  children,
  disabled,
  startIcon,
  endIcon,
  ...buttonProps
}: ButtonProps) => (
  <button
    className={cn(
      'flex items-center justify-center rounded-md text-base focus-ring',
      {
        'bg-violet-700 text-white hover:bg-violet-900':
          !disabled && color === 'primary' && variant === 'solid',
        'bg-violet-100 text-violet-900 hover:bg-violet-300':
          !disabled && color === 'primary' && variant === 'light',
        'bg-white text-violet-800 border border-violet-800 hover:bg-violet-100':
          !disabled && color === 'primary' && variant === 'outlined',
        'bg-white text-violet-800 underline hover:bg-violet-100':
          !disabled && color === 'primary' && variant === 'borderless',
        'bg-zinc-800 text-white hover:bg-zinc-900':
          !disabled && color === 'secondary' && variant === 'solid',
        'bg-zinc-200 text-zinc-800 hover:bg-zinc-400':
          !disabled && color === 'secondary' && variant === 'light',
        'bg-white text-zinc-800 border border-zinc-800 hover:bg-zinc-200':
          !disabled && color === 'secondary' && variant === 'outlined',
        'bg-white text-zinc-800 underline hover:bg-zinc-200':
          !disabled && color === 'secondary' && variant === 'borderless',
        'bg-zinc-100 text-zinc-400 cursor-not-allowed': !!disabled,
        'p-2': size === 'sm',
        'p-3': size === 'md',
        'p-4': size === 'lg',
        'w-full': fullWidth,
      }
    )}
    disabled={disabled}
    {...buttonProps}
  >
    {renderIcon(startIcon, 'mr-2')}
    {children}
    {renderIcon(endIcon, 'ml-2')}
  </button>
);

export default Button;

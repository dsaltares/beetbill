import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import cn from 'classnames';
import Spinner from './Spinner';
import type { IconProp } from './Icons/types';
import Icon from './Icons/Icon';

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    color?: 'primary' | 'secondary' | 'tertiary' | 'danger';
    variant?: 'solid' | 'light' | 'outlined' | 'borderless';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    startIcon?: IconProp;
    endIcon?: IconProp;
    loading?: boolean;
  }
>;

const Button = ({
  color = 'primary',
  variant = 'solid',
  size = 'md',
  fullWidth = false,
  children,
  disabled,
  startIcon,
  endIcon,
  loading = false,
  onClick,
  ...buttonProps
}: ButtonProps) => {
  const iconClassName = cn({
    'text-xs w-3 h-3': size === 'sm',
    'text-base w-4 h-4': size !== 'sm',
  });

  return (
    <button
      className={cn(
        'relative flex items-center justify-center rounded-md text-base font-normal focus-ring text-left gap-2',
        {
          'bg-violet-700 text-zinc-50 hover:bg-violet-900':
            !disabled && color === 'primary' && variant === 'solid',
          'bg-violet-100 text-violet-900 hover:bg-violet-300':
            !disabled && color === 'primary' && variant === 'light',
          'bg-white text-violet-800 border border-violet-800 hover:bg-violet-100':
            !disabled && color === 'primary' && variant === 'outlined',
          'bg-transparent text-violet-800 underline hover:bg-violet-100':
            !disabled && color === 'primary' && variant === 'borderless',
          'bg-zinc-800 text-zinc-50 hover:bg-zinc-900':
            !disabled && color === 'secondary' && variant === 'solid',
          'bg-zinc-200 text-zinc-800 hover:bg-zinc-400':
            !disabled && color === 'secondary' && variant === 'light',
          'bg-white text-zinc-800 border border-zinc-800 hover:bg-zinc-200':
            !disabled && color === 'secondary' && variant === 'outlined',
          'bg-transparent text-zinc-800 underline hover:bg-zinc-200':
            !disabled && color === 'secondary' && variant === 'borderless',
          'bg-transparent text-zinc-50 underline hover:bg-violet-900':
            !disabled && color === 'tertiary' && variant === 'borderless',
          'bg-red-700 text-zinc-50 hover:bg-red-800':
            !disabled && color === 'danger',
          'bg-zinc-100 text-zinc-400 cursor-not-allowed': !!disabled,
          'text-transparent': !!loading,
          'py-1.5 px-3 text-sm': size === 'sm',
          'py-2 px-4': size === 'md',
          'py-2.5 px-5': size === 'lg',
          'w-full': fullWidth,
        }
      )}
      disabled={disabled}
      onClick={(e) => {
        if (!loading && onClick) {
          onClick(e);
        }
      }}
      {...buttonProps}
    >
      {loading && (
        <div className="absolute flex items-center justify-center">
          <Spinner size="sm" />
        </div>
      )}
      <Icon className={iconClassName} icon={startIcon} />
      {children}
      <Icon className={iconClassName} icon={endIcon} />
    </button>
  );
};

export default Button;

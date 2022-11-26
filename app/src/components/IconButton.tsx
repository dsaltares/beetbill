import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import cn from 'classnames';
import Spinner from './Spinner';
import type { IconProp } from './Icons/types';
import Icon from './Icons/Icon';

type IconButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    color?: 'primary' | 'secondary' | 'danger';
    variant?: 'solid' | 'light' | 'outlined' | 'borderless';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    icon: IconProp;
    loading?: boolean;
    draggable?: boolean;
  }
>;

const IconButton = ({
  color = 'primary',
  variant = 'solid',
  size = 'md',
  fullWidth = false,
  disabled,
  icon,
  loading = false,
  onClick,
  draggable,
  ...buttonProps
}: IconButtonProps) => (
  <button
    className={cn(
      'relative flex items-center justify-center rounded-md focus-ring text-left',
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
        'bg-red-700 text-zinc-50 hover:bg-red-800':
          !disabled && color === 'danger',
        'bg-zinc-100 text-zinc-400 cursor-not-allowed': !!disabled,
        'text-transparent': !!loading,
        'p-2': size === 'sm',
        'p-2.5': size === 'md',
        'p-3': size === 'lg',
        'w-full': fullWidth,
        'cursor-move text-zinc-400': !!draggable,
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
    <Icon className="text-xl w-5 h-5" icon={icon} />
  </button>
);

export default IconButton;

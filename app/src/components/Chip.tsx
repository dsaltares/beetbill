import cn from 'classnames';
import type { PropsWithChildren } from 'react';
import Icon from './Icons/Icon';
import type { IconProp } from './Icons/types';

export type ChipProps = PropsWithChildren<{
  color?: 'primary' | 'secondary' | 'danger';
  variant?: 'solid' | 'light' | 'outlined';
  size?: 'sm' | 'md';
  startIcon?: IconProp;
  endIcon?: IconProp;
}>;

const Chip = ({
  color = 'primary',
  variant = 'light',
  size = 'md',
  startIcon,
  endIcon,
  children,
}: ChipProps) => (
  <div
    className={cn(
      'inline-flex flex-row px-3 text-base self-start items-center justify-center gap-2 rounded-3xl',
      {
        'py-2': size === 'md',
        'bg-violet-700 text-white': color === 'primary' && variant === 'solid',
        'bg-violet-100 text-violet-800':
          color === 'primary' && variant === 'light',
        'bg-white text-violet-800 border border-violet-800  ':
          color === 'primary' && variant === 'outlined',
        'bg-zinc-800 text-white': color === 'secondary' && variant === 'solid',
        'bg-zinc-200 text-zinc-800':
          color === 'secondary' && variant === 'light',
        'bg-white text-zinc-800 border border-zinc-800':
          color === 'secondary' && variant === 'outlined',
        'bg-red-700 text-zinc-50 hover:bg-red-800': color === 'danger',
        'py-0': size === 'sm',
        'py-1': size === 'md',
      }
    )}
  >
    <Icon icon={startIcon} />
    {children}
    <Icon icon={endIcon} />
  </div>
);

export default Chip;

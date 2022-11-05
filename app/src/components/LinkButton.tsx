import type { AnchorHTMLAttributes, PropsWithChildren } from 'react';
import cn from 'classnames';
import Link from 'next/link';
import type { IconProp } from './Icons/types';
import Icon from './Icons/Icon';

type ButtonProps = PropsWithChildren<
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    color?: 'primary' | 'secondary';
    variant?: 'solid' | 'light' | 'outlined' | 'borderless';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    startIcon?: IconProp;
    endIcon?: IconProp;
    href: string;
  }
>;

const LinkButton = ({
  color = 'primary',
  variant = 'solid',
  size = 'md',
  fullWidth = false,
  children,
  startIcon,
  endIcon,
  href,
  ...anchorProps
}: ButtonProps) => (
  <div
    className={cn('flex', {
      'w-full': fullWidth,
    })}
  >
    <Link
      href={href}
      className={cn('rounded-md text-base focus-ring text-left gap-2', {
        'bg-violet-700 text-zinc-50 hover:bg-violet-900':
          color === 'primary' && variant === 'solid',
        'bg-violet-100 text-violet-900 hover:bg-violet-300':
          color === 'primary' && variant === 'light',
        'bg-white text-violet-800 border border-violet-800 hover:bg-violet-100':
          color === 'primary' && variant === 'outlined',
        'bg-transparent text-violet-800 underline hover:bg-violet-100':
          color === 'primary' && variant === 'borderless',
        'bg-zinc-800 text-zinc-50 hover:bg-zinc-900':
          color === 'secondary' && variant === 'solid',
        'bg-zinc-200 text-zinc-800 hover:bg-zinc-400':
          color === 'secondary' && variant === 'light',
        'bg-white text-zinc-800 border border-zinc-800 hover:bg-zinc-200':
          color === 'secondary' && variant === 'outlined',
        'bg-transparent text-zinc-800 underline hover:bg-zinc-200':
          color === 'secondary' && variant === 'borderless',
        'py-1.5 px-3': size === 'sm',
        'py-2 px-4': size === 'md',
        'py-2.5 px-5': size === 'lg',
        'w-full': fullWidth,
      })}
      {...anchorProps}
    >
      <div className="flex items-center justify-center">
        <Icon icon={startIcon} />
        {children}
        <Icon icon={endIcon} />
      </div>
    </Link>
  </div>
);

export default LinkButton;

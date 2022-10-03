import type { AnchorHTMLAttributes, PropsWithChildren } from 'react';
import cn from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import type { Icon } from './Icons/types';

type IconProp = IconDefinition | Icon;

type ButtonProps = PropsWithChildren<
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    variant?: 'primary' | 'secondary';
    mode?: 'default' | 'light' | 'outlined' | 'borderless';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    startIcon?: IconProp;
    endIcon?: IconProp;
    href: string;
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
  variant = 'primary',
  mode = 'default',
  size = 'md',
  fullWidth = false,
  children,
  startIcon,
  endIcon,
  href,
  ...anchorProps
}: ButtonProps) => (
  <Link href={href}>
    <a
      className={cn('flex items-center justify-center rounded-md text-base', {
        'bg-violet-700 text-white': variant === 'primary' && mode === 'default',
        'bg-violet-100 text-violet-900':
          variant === 'primary' && mode === 'light',
        'bg-white text-violet-800 border border-violet-800':
          variant === 'primary' && mode === 'outlined',
        'bg-white text-violet-800 border border-violet-50':
          variant === 'primary' && mode === 'borderless',
        'bg-zinc-800 text-white': variant === 'secondary' && mode === 'default',
        'bg-zinc-200 text-zinc-800':
          variant === 'secondary' && mode === 'light',
        'bg-white text-zinc-800 border border-zinc-800':
          variant === 'secondary' && mode === 'outlined',
        'bg-white text-zinc-800 border border-zinc-100':
          variant === 'secondary' && mode === 'borderless',
        'p-2': size === 'sm',
        'p-3': size === 'md',
        'p-4': size === 'lg',
        'w-full': fullWidth,
      })}
      {...anchorProps}
    >
      {renderIcon(startIcon, 'mr-2')}
      {children}
      {renderIcon(endIcon, 'ml-2')}
    </a>
  </Link>
);

export default Button;

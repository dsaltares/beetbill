import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cn from 'classnames';
import type { ButtonHTMLAttributes } from 'react';
import type { IconProp } from '../Icons/types';

type SidebarButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  variant?: 'primary' | 'secondary';
  icon: IconProp;
};

const SidebarButton = ({
  label,
  variant = 'primary',
  icon: Icon,
  ...buttonProps
}: SidebarButtonProps) => {
  const iconClassName = cn('text-2xl w-8 h-8', {});
  return (
    <button
      className={cn(
        'relative flex items-center justify-center w-10 h-10 rounded-lg focus-ring',
        {
          'hover:bg-violet-100': variant === 'primary',
          'text-violet-700': variant === 'primary',
          'text-white': variant === 'secondary',
        }
      )}
      aria-label={label}
      {...buttonProps}
    >
      {typeof Icon === 'function' ? (
        <Icon className={iconClassName} />
      ) : (
        <FontAwesomeIcon icon={Icon} className={iconClassName} />
      )}
    </button>
  );
};

export default SidebarButton;

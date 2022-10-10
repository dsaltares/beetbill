import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cn from 'classnames';
import type { ButtonHTMLAttributes } from 'react';
import type { Icon } from './Icons/types';

type IconProp = IconDefinition | Icon;

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  variant?: 'primary' | 'secondary';
  icon: IconProp;
};

const IconButton = ({
  label,
  variant = 'primary',
  icon: Icon,
  ...buttonProps
}: IconButtonProps) => {
  const iconClassName = cn('text-2xl w-8 h-8', {
    'text-violet-700': variant === 'primary',
    'text-white': variant === 'secondary',
  });
  return (
    <button
      className={cn(
        'flex items-center justify-center w-10 h-10 rounded-lg focus-ring',
        {
          'hover:bg-violet-100': variant === 'primary',
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

export default IconButton;

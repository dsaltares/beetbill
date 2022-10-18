import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cn from 'classnames';
import type { ButtonHTMLAttributes } from 'react';
import type { Icon } from './Icons/types';
import Spinner from './Spinner';

type IconProp = IconDefinition | Icon;

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  variant?: 'primary' | 'secondary';
  icon: IconProp;
  loading?: boolean;
};

const IconButton = ({
  label,
  variant = 'primary',
  icon: Icon,
  loading = false,
  ...buttonProps
}: IconButtonProps) => {
  const iconClassName = cn('text-2xl w-8 h-8', {
    'text-violet-700': variant === 'primary',
    'text-white': variant === 'secondary',
    'text-transparent': !!loading,
  });
  return (
    <button
      className={cn(
        'relative flex items-center justify-center w-10 h-10 rounded-lg focus-ring',
        {
          'hover:bg-violet-100': variant === 'primary',
        }
      )}
      aria-label={label}
      {...buttonProps}
    >
      {loading && (
        <div className="absolute flex items-center justify-center">
          <Spinner size="sm" />
        </div>
      )}
      {typeof Icon === 'function' ? (
        <Icon className={iconClassName} />
      ) : (
        <FontAwesomeIcon icon={Icon} className={iconClassName} />
      )}
    </button>
  );
};

export default IconButton;

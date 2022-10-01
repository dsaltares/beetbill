import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cn from 'classnames';
import type { ButtonHTMLAttributes } from 'react';

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  variant?: 'primary' | 'secondary';
  icon: IconDefinition;
};

const IconButton = ({
  label,
  variant = 'primary',
  icon,
  ...buttonProps
}: IconButtonProps) => (
  <button
    className="flex items-center justify-center w-10 h-10"
    aria-label={label}
    {...buttonProps}
  >
    <FontAwesomeIcon
      className={cn('text-2xl w-8 h-8', {
        'text-violet-700': variant === 'primary',
        'text-white': variant === 'secondary',
      })}
      icon={icon}
    />
  </button>
);

export default IconButton;

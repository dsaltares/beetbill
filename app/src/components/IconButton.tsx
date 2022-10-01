import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cn from 'classnames';

type IconButtonProps = {
  label: string;
  variant: 'primary' | 'secondary';
  icon: IconDefinition;
  onClick: () => void;
};

const IconButton = ({ label, variant, icon, onClick }: IconButtonProps) => (
  <button className="w-10 h-10" aria-label={label} onClick={onClick}>
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

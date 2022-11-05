import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cn from 'classnames';
import type { IconProp } from './types';

type IconProps = {
  icon?: IconProp;
  className?: string;
};

const Icon = ({ icon: Icon, className }: IconProps) => {
  const finalClassName = cn({
    'w-4 h-4': !className,
    ...(className && { [className]: true }),
  });
  if (!Icon) {
    return null;
  }
  if (typeof Icon === 'function') {
    return <Icon className={finalClassName} />;
  }
  return <FontAwesomeIcon icon={Icon} className={finalClassName} />;
};

export default Icon;

import {
  faCircleInfo,
  faTriangleExclamation,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cn from 'classnames';
import React from 'react';

type MessageProps = {
  color?: 'primary' | 'secondary' | 'danger';
  variant?: 'solid' | 'light';
  message: string;
  onClose?: () => void;
};

const Message = ({ color, variant, message, onClose }: MessageProps) => (
  <div
    className={cn(
      'flex min-w-[100%] sm:min-w-[400px] max-w-full flex-row items-center justify-between align-middle text-base px-4 py-2 rounded-md',
      {
        'text-white': variant === 'solid',
        'bg-violet-700': color === 'primary' && variant === 'solid',
        'text-violet-800 bg-violet-100':
          color === 'primary' && variant === 'light',
        'bg-zinc-800': color === 'secondary' && variant === 'solid',
        'text-zinc-700 bg-zinc-100':
          color === 'secondary' && variant === 'light',
        'bg-red-700': color === 'danger' && variant === 'solid',
        'text-red-700 bg-red-100': color === 'danger' && variant === 'light',
      }
    )}
  >
    <div className="flex w-full flex-row items-center gap-2">
      <FontAwesomeIcon
        className="w-4 h-4"
        icon={color === 'danger' ? faTriangleExclamation : faCircleInfo}
      />
      <span>{message}</span>
    </div>
    <div className="ml-5">
      <button aria-label="dismiss" onClick={onClose}>
        <FontAwesomeIcon className="w-4 h-4" icon={faXmark} />
      </button>
    </div>
  </div>
);

export default Message;

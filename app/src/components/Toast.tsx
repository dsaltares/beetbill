import {
  faCircleInfo,
  faTriangleExclamation,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cn from 'classnames';
import React from 'react';
import baseToast from 'react-hot-toast';

export type ToastArgs = {
  color?: 'primary' | 'secondary' | 'danger';
  message: string;
};

const toast = ({ color = 'primary', message }: ToastArgs) => {
  baseToast(
    (t) => (
      <div className="flex w-full flex-row items-center justify-between align-middle text-base px-1.5 py-4 text-zinc-50">
        <div className="flex w-full flex-row items-center gap-3">
          <FontAwesomeIcon
            className={cn('w-4 h-4 pr-3 border-r', {
              'border-r-zinc-50': color !== 'secondary',
              'border-r-zinc-500': color === 'secondary',
            })}
            icon={color === 'danger' ? faTriangleExclamation : faCircleInfo}
          />
          <span>{message}</span>
        </div>
        <div className="ml-5">
          <button aria-label="dismiss" onClick={() => baseToast.dismiss(t.id)}>
            <FontAwesomeIcon className="w-4 h-4" icon={faXmark} />
          </button>
        </div>
      </div>
    ),
    {
      className: 'min-w-[100%] sm:min-w-[400px]',
      style: {
        ...(color === 'primary' && { background: '#6B26D9' }),
        ...(color === 'secondary' && { background: '#27272A' }),
        ...(color === 'danger' && { background: '#B91C1C' }),
        borderRadius: 6,
        padding: 0,
        margin: 0,
      },
      ariaProps: {
        role: 'status',
        'aria-live': 'polite',
      },
      duration: 10000,
    }
  );
};

export default toast;

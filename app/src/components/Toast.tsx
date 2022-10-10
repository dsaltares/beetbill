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
  variant?: 'solid' | 'light';
  message: string;
};

const toast = ({
  color = 'primary',
  variant = 'solid',
  message,
}: ToastArgs) => {
  baseToast(
    (t) => (
      <div
        className={cn(
          'flex w-full flex-row items-center justify-between align-middle text-base px-1 py-0.5',
          {
            'text-white': variant === 'solid',
            'text-violet-800': color === 'primary' && variant === 'light',
            'text-zinc-700': color === 'secondary' && variant === 'light',
            'text-red-700': color === 'danger' && variant === 'light',
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
          <button aria-label="dismiss" onClick={() => baseToast.dismiss(t.id)}>
            <FontAwesomeIcon className="w-4 h-4" icon={faXmark} />
          </button>
        </div>
      </div>
    ),
    {
      className: 'min-w-[100%] sm:min-w-[400px]',
      style: {
        ...(color === 'primary' &&
          variant === 'solid' && { background: '#6B26D9' }),
        ...(color === 'primary' &&
          variant === 'light' && { background: '#EBE7FE' }),
        ...(color === 'secondary' &&
          variant === 'solid' && { background: '#27272A' }),
        ...(color === 'secondary' &&
          variant === 'light' && { background: '#F4F4F5' }),
        ...(color === 'danger' &&
          variant === 'solid' && { background: '#B91C1C' }),
        ...(color === 'danger' &&
          variant === 'light' && { background: '#FEE2E2' }),
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

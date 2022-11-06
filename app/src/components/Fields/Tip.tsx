import type { PropsWithChildren } from 'react';
import cn from 'classnames';

type TipProps = PropsWithChildren<{
  disabled?: boolean;
}>;

const Tip = ({ disabled, children }: TipProps) => (
  <span
    className={cn('text-sm ', {
      'text-zinc-900': !disabled,
      'text-zinc-400': !!disabled,
    })}
  >
    {children}
  </span>
);

export default Tip;

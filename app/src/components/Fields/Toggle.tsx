import cn from 'classnames';
import type { InputHTMLAttributes } from 'react';

type ToggleProps = {
  id?: InputHTMLAttributes<HTMLInputElement>['id'];
  name?: InputHTMLAttributes<HTMLInputElement>['name'];
  onChange?: InputHTMLAttributes<HTMLInputElement>['onChange'];
  disabled?: InputHTMLAttributes<HTMLInputElement>['disabled'];
  checked?: InputHTMLAttributes<HTMLInputElement>['checked'];
  label?: string;
};

const Toggle = ({
  id,
  name,
  onChange,
  disabled = false,
  checked,
  label,
}: ToggleProps) => (
  <label
    htmlFor={id}
    className={cn('flex flex-col text-sm font-medium', {
      'text-zinc-900 cursor-pointer': !disabled,
      'text-zinc-400 cursor-not-allowed': disabled,
    })}
  >
    <div className="mb-2 leading-6">{label}</div>
    <div className="relative my-[5px]">
      <input
        type="checkbox"
        value=""
        className="sr-only peer"
        name={name}
        id={id}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      <div
        className={cn(
          "w-[54px] h-7 bg-zinc-200 peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-violet-500 peer-focus:ring-offset-0 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-zinc-50 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:border-zinc-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-violet-700",
          {
            'after:bg-zinc-50': !disabled,
            'after:bg-zinc-100': !!disabled,
          }
        )}
      ></div>
    </div>
  </label>
);

export default Toggle;

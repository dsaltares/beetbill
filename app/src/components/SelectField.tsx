import { Listbox, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import cn from 'classnames';
import { Fragment } from 'react';

type SelectFieldProps<Option> = {
  value?: Option;
  options: Option[];
  optionToLabel: (option: Option) => string;
  optionToKey: (option: Option) => string;
  onChange: (option?: Option) => void;
  label?: string;
  error?: string;
  tip?: string;
  disabled?: boolean;
  id?: string;
  placeholder?: string;
};

function SelectField<Option>({
  id,
  label,
  error,
  tip,
  disabled,
  value,
  options,
  onChange,
  optionToLabel,
  optionToKey,
  placeholder,
}: SelectFieldProps<Option>) {
  const showError = !!error && !disabled;
  const showTip = !showError && !!tip;

  return (
    <div className="w-full">
      {label && (
        <div className="mb-2">
          <label
            htmlFor={id}
            className={cn('text-sm font-medium', {
              'text-zinc-900': !error && !disabled,
              'text-red-600': !!error && !disabled,
              'text-zinc-400': !!disabled,
            })}
          >
            {label}
          </label>
        </div>
      )}
      <Listbox value={value} onChange={onChange} disabled={disabled}>
        {({ open }) => (
          <div className="relative">
            <Listbox.Button
              className={cn(
                'relative w-full text-left text-base rounded-lg p-2 border focus-ring',
                {
                  'bg-gray-50 cursor-default': !disabled,
                  'bg-gray-100 text-zinc-400 cursor-not-allowed': !!disabled,
                  'border-zinc-300': (!error || !!disabled) && !open,
                  'border-violet-500': open,
                  'border-red-600': !!error && !disabled,
                  'text-zinc-900': !error && !disabled && !!value,
                  'text-zinc-400': !error && !disabled && !value,
                  'text-red-600': !!error && !disabled,
                }
              )}
            >
              <span className={cn('block truncate')}>
                {value ? optionToLabel(value) : placeholder}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <FontAwesomeIcon
                  className="h-5 w-5 text-zinc-800"
                  icon={open ? faCaretUp : faCaretDown}
                />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-xl border border-violet-500 focus-ring">
                {options.map((option) => (
                  <Listbox.Option
                    key={optionToKey(option)}
                    className={({ active, selected }) =>
                      cn('relative cursor-default select-none py-2 px-3', {
                        'bg-violet-50': selected && !active,
                        'bg-violet-100': active,
                        'bg-white': !active && !selected,
                      })
                    }
                    value={option}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={cn('block truncate', {
                            'font-medium text-violet-800': selected,
                            'font-normal': !selected,
                          })}
                        >
                          {optionToLabel(option)}
                        </span>
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        )}
      </Listbox>
      {showTip && (
        <div className="mt-1">
          <span
            className={cn('text-sm ', {
              'text-zinc-900': !disabled,
              'text-zinc-400': !!disabled,
            })}
          >
            {tip}
          </span>
        </div>
      )}
      {showError && (
        <div className="mt-1">
          <span role="alert" className="text-sm text-red-600">
            {error}
          </span>
        </div>
      )}
    </div>
  );
}

export default SelectField;

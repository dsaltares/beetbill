import { Combobox, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import cn from 'classnames';
import { useMemo, useState } from 'react';
import Label from './Label';
import Error from './Error';
import Tip from './Tip';

type AutocompleteFieldProps<Option> = {
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
  required?: boolean;
};

function AutocompleteField<Option>({
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
  required = false,
}: AutocompleteFieldProps<Option>) {
  const showError = !!error && !disabled;
  const showTip = !showError && !!tip;
  const [query, setQuery] = useState(value ? optionToLabel(value) : '');
  const filteredOptions = useMemo(
    () =>
      options.filter((option) =>
        optionToLabel(option).toLowerCase().includes(query.toLowerCase())
      ),
    [options, optionToLabel, query]
  );

  return (
    <div className="w-full">
      {label && (
        <div className="mb-2">
          <Label
            htmlFor={id}
            error={showError}
            disabled={disabled}
            required={required}
          >
            {label}
          </Label>
        </div>
      )}
      <Combobox value={value} onChange={onChange} disabled={disabled}>
        {({ open }) => (
          <div className="relative">
            <div
              className={cn('relative w-full text-left text-sm', {
                'bg-zinc-50 cursor-default': !disabled,
                'bg-zinc-100 text-zinc-400 cursor-not-allowed': !!disabled,
                'border-zinc-300': (!error || !!disabled) && !open,
                'border-violet-500': open,
                'border-red-600': !!error && !disabled,
                'text-zinc-900': !error && !disabled && !!value,
                'text-zinc-400': !error && !disabled && !value,
                'text-red-600': !!error && !disabled,
              })}
            >
              <Combobox.Input
                className="w-full bg-transparent rounded-lg p-2 border focus-ring"
                displayValue={optionToLabel}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={placeholder}
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                <FontAwesomeIcon
                  className="w-5 h-5"
                  icon={open ? faChevronUp : faChevronDown}
                />
              </Combobox.Button>
            </div>
            <Transition
              as={'div'}
              className="relative z-10"
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-xl border border-violet-500 focus-ring">
                {filteredOptions.map((option) => (
                  <Combobox.Option
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
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            </Transition>
          </div>
        )}
      </Combobox>
      {showTip && (
        <div className="mt-1">
          <Tip>{tip}</Tip>
        </div>
      )}
      {showError && (
        <div className="mt-1">
          <Error>{error}</Error>
        </div>
      )}
    </div>
  );
}

export default AutocompleteField;

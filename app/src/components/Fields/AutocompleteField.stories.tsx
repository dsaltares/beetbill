import React, { useState } from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import AutocompleteField from './AutocompleteField';

export default {
  title: 'AutocompleteField',
  component: AutocompleteField,
  argTypes: {
    disabled: { control: 'boolean' },
    value: { control: { disable: true } },
    options: { control: { disable: true } },
    id: { control: { disable: true } },
  },
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof AutocompleteField>;

const Template: ComponentStory<typeof AutocompleteField> = (args) => {
  const [value, setValue] = useState<string | undefined>(undefined);
  return (
    <div className="w-full p-8">
      <AutocompleteField
        id="autocomplete-field"
        {...args}
        value={value as string}
        options={['Spiderman', 'Wolverine', 'Cyclops']}
        onChange={setValue}
        optionToLabel={(option: string) => option}
        optionToKey={(option: string) => option}
      />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  placeholder: 'Superhero',
  disabled: false,
  error: '',
  tip: 'This is a tip',
  label: 'Options',
};

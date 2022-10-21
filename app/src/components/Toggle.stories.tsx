import React, { useState } from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import Toggle from './Toggle';

export default {
  title: 'Toggle',
  component: Toggle,
  argTypes: {
    disabled: { control: 'boolean' },
    checked: { control: { disable: true } },
    id: { control: { disable: true } },
    name: { control: { disable: true } },
    onChange: { control: { disable: true } },
  },
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof Toggle>;

const Template: ComponentStory<typeof Toggle> = (args) => {
  const [checked, setChecked] = useState(false);
  return (
    <Toggle
      {...args}
      checked={checked}
      onChange={(e) => {
        setChecked(e.target.checked);
      }}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  label: 'Toggle me',
  disabled: false,
};

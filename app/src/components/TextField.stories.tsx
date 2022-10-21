import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import TextField from './TextField';

export default {
  title: 'TextField',
  component: TextField,
  argTypes: {
    disabled: { control: 'boolean' },
    onFocus: { action: 'focus' },
    onBlur: { action: 'onBlur' },
    endAdornment: { control: 'text' },
    startAdornment: { control: 'text' },
  },
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof TextField>;

const Template: ComponentStory<typeof TextField> = (args) => (
  <div className="w-full p-8">
    <TextField id="text-field" {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  placeholder: 'Company number',
  disabled: false,
  error: '',
  tip: 'This is a tip',
  label: 'Company ID',
  startAdornment: undefined,
  endAdornment: '%',
};

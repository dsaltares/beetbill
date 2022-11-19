import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import TextAreaField from './TextAreaField';

export default {
  title: 'TextAreaField',
  component: TextAreaField,
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
} as ComponentMeta<typeof TextAreaField>;

const Template: ComponentStory<typeof TextAreaField> = (args) => (
  <div className="w-full p-8">
    <TextAreaField id="text-field" {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  placeholder: 'Company number',
  disabled: false,
  error: '',
  tip: 'This is a tip',
  label: 'Company ID',
  rows: 3,
};

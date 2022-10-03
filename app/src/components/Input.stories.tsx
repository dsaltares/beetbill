import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import Input from './Input';

export default {
  title: 'Input',
  component: Input,
  argTypes: {
    disabled: { control: 'boolean' },
    onFocus: { action: 'focus' },
    onBlur: { action: 'onBlur' },
  },
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof Input>;

const Template: ComponentStory<typeof Input> = (args) => <Input {...args} />;

export const Default = Template.bind({});
Default.args = {
  placeholder: 'Placeholder',
  disabled: false,
  error: '',
};

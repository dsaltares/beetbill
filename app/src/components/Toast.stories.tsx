import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { Toaster } from 'react-hot-toast';
import Toast, { type ToastArgs } from './Toast';
import Button from './Button';

const ToastComponent = (_args: ToastArgs) => <h1>hello</h1>;

export default {
  title: 'Toast',
  component: ToastComponent,
  argTypes: {
    color: {
      control: { type: 'radio' },
      options: ['primary', 'secondary', 'danger'],
    },
    variant: {
      control: { type: 'radio' },
      options: ['solid', 'light'],
    },
  },
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof ToastComponent>;

const Template: ComponentStory<typeof ToastComponent> = (args) => (
  <>
    <Button onClick={() => Toast(args)}>Toast</Button>
    <Toaster position="bottom-center" />
  </>
);

export const Default = Template.bind({});
Default.args = {
  color: 'primary',
  variant: 'solid',
  message: 'Toast message',
};

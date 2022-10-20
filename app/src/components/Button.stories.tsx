import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import {
  faBoxOpen,
  faBriefcase,
  faFileInvoice,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import Button from './Button';
import GoogleIcon from './Icons/GoogleIcon';

const Icons = {
  none: undefined,
  faBriefcase,
  faUsers,
  faBoxOpen,
  faFileInvoice,
  GoogleIcon,
};
const IconInputType = {
  options: Object.keys(Icons),
  mapping: Icons,
  control: { type: 'select' },
};

export default {
  title: 'Button',
  component: Button,
  argTypes: {
    disabled: { control: 'boolean' },
    onClick: { action: 'clicked' },
    startIcon: IconInputType,
    endIcon: IconInputType,
    color: {
      control: { type: 'radio', options: ['primary', 'secondary', 'danger'] },
    },
  },
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
  color: 'primary',
  variant: 'solid',
  children: 'Button',
  startIcon: faBriefcase,
  disabled: false,
  size: 'md',
  fullWidth: false,
};

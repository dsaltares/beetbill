import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import {
  faBoxOpen,
  faBriefcase,
  faFileInvoice,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import IconButton from './IconButton';
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
  title: 'IconButton',
  component: IconButton,
  argTypes: {
    disabled: { control: 'boolean' },
    onClick: { action: 'clicked' },
    icon: IconInputType,
    color: {
      control: { type: 'radio' },
      options: ['primary', 'secondary', 'danger'],
    },
  },
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof IconButton>;

const Template: ComponentStory<typeof IconButton> = (args) => (
  <IconButton {...args} />
);

export const Default = Template.bind({});
Default.args = {
  color: 'primary',
  variant: 'solid',
  children: 'Button',
  icon: faBriefcase,
  disabled: false,
  size: 'md',
  fullWidth: false,
};

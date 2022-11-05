import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import {
  faBoxOpen,
  faBriefcase,
  faFileInvoice,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import LinkIconButton from './LinkIconButton';
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
  title: 'LinkIconButton',
  component: LinkIconButton,
  argTypes: {
    disabled: { control: 'boolean' },
    icon: IconInputType,
    color: {
      control: { type: 'radio' },
      options: ['primary', 'secondary', 'danger'],
    },
  },
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof LinkIconButton>;

const Template: ComponentStory<typeof LinkIconButton> = (args) => (
  <LinkIconButton {...args} />
);

export const Default = Template.bind({});
Default.args = {
  color: 'primary',
  variant: 'solid',
  children: 'Button',
  icon: faBriefcase,
  size: 'md',
  fullWidth: false,
  href: '/',
};

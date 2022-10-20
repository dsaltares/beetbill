import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import {
  faBoxOpen,
  faBriefcase,
  faFileInvoice,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import LinkButton from './LinkButton';
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
  title: 'LinkButton',
  component: LinkButton,
  argTypes: {
    startIcon: IconInputType,
    endIcon: IconInputType,
    color: {
      control: { type: 'radio', options: ['primary', 'secondary'] },
    },
  },
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof LinkButton>;

const Template: ComponentStory<typeof LinkButton> = (args) => (
  <LinkButton {...args} />
);

export const Default = Template.bind({});
Default.args = {
  color: 'primary',
  variant: 'solid',
  children: 'Button',
  startIcon: faBriefcase,
  size: 'md',
  fullWidth: false,
  href: '/',
};

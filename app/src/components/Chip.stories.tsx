import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import {
  faBoxOpen,
  faBriefcase,
  faFileInvoice,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import Chip from './Chip';
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
  title: 'Chip',
  component: Chip,
  argTypes: {
    startIcon: IconInputType,
    endIcon: IconInputType,
    color: {
      control: { type: 'radio', options: ['primary', 'secondary'] },
    },
    variant: {
      control: { type: 'radio', options: ['solid', 'light', 'outlined'] },
    },
  },
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof Chip>;

const Template: ComponentStory<typeof Chip> = (args) => <Chip {...args} />;

export const Default = Template.bind({});
Default.args = {
  color: 'primary',
  variant: 'solid',
  children: 'Chip',
  startIcon: faBriefcase,
  size: 'md',
};

import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import IconButton from './IconButton';
import GoogleIcon from './Icons/GoogleIcon';

const Icons = {
  none: undefined,
  faBars,
  faXmark,
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
    onClick: { action: 'clicked' },
    icon: IconInputType,
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
  variant: 'primary',
  label: 'menu',
  icon: faBars,
};

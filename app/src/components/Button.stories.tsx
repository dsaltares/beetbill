import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import Button from './Button';

export default {
  title: 'Button',
  component: Button,
  argTypes: {
    disabled: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
  variant: 'primary',
  mode: 'default',
  children: 'Button',
};

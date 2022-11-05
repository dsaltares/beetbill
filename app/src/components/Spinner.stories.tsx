import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import Spinner from './Spinner';
export default {
  title: 'Spinner',
  component: Spinner,
  argTypes: {
    size: {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg'],
    },
  },
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof Spinner>;

const Template: ComponentStory<typeof Spinner> = (args) => (
  <Spinner {...args} />
);

export const Default = Template.bind({
  size: 'md',
});

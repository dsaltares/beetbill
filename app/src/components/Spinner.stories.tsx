import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import Spinner from './Spinner';
export default {
  title: 'Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof Spinner>;

const Template: ComponentStory<typeof Spinner> = () => <Spinner />;

export const Default = Template.bind({});

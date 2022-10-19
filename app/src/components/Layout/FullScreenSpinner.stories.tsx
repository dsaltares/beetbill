import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import FullScreenSpinner from './FullScreenSpinner';
export default {
  title: 'FullScreenSpinner',
  component: FullScreenSpinner,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof FullScreenSpinner>;

const Template: ComponentStory<typeof FullScreenSpinner> = () => (
  <FullScreenSpinner />
);

export const Default = Template.bind({});

import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import Card from './Card';
export default {
  title: 'Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof Card>;

const Template: ComponentStory<typeof Card> = (args) => <Card {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Content',
};

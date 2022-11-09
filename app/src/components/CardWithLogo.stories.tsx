import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import CardWithLogo from './CardWithLogo';

export default {
  title: 'CardWithLogo',
  component: CardWithLogo,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof CardWithLogo>;

const Template: ComponentStory<typeof CardWithLogo> = (args) => (
  <CardWithLogo {...args} />
);

export const Default = Template.bind({});
Default.args = {
  children: 'Content',
};

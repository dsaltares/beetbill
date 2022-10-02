import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import EmptyContent from './EmptyContent';

export default {
  title: 'EmptyContent',
  component: EmptyContent,
  argTypes: {
    onClick: { action: 'clicked' },
  },
} as ComponentMeta<typeof EmptyContent>;

const Template: ComponentStory<typeof EmptyContent> = (args) => (
  <div className="h-screen">
    <EmptyContent {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  message: "You don't have any invoices yet",
  actionLabel: 'Add invoices',
};

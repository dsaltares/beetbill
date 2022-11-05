import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import type { CustomIcon } from './types';
import GoogleIcon from './GoogleIcon';
import UserPlaceholderIcon from './UserPlaceholderIcon';

export default {
  title: 'Icons',
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<CustomIcon>;

const Template: ComponentStory<CustomIcon> = () => {
  const className = 'w-6 h-6';
  return (
    <div className="grid grid-cols-2 gap-4">
      <GoogleIcon className={className} />
      <UserPlaceholderIcon className={className} />
    </div>
  );
};

export const Default = Template.bind({});

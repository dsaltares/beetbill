import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import type { Icon } from './types';
import GoogleIcon from './GoogleIcon';

export default {
  title: 'Icons',
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<Icon>;

const Template: ComponentStory<Icon> = () => {
  const className = 'w-6 h-6';
  return (
    <div className="grid grid-cols-4 gap-4">
      <GoogleIcon className={className} />
    </div>
  );
};

export const Default = Template.bind({});

import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import Avatar from './Avatar';

export default {
  title: 'Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof Avatar>;

const Template: ComponentStory<typeof Avatar> = (args) => <Avatar {...args} />;

export const WithImage = Template.bind({});
export const WithInitials = Template.bind({});
export const WithInitialFromEmail = Template.bind({});
export const WithPlaceholder = Template.bind({});

WithImage.args = {
  user: {
    image: 'https://avatars.githubusercontent.com/u/570314?v=4',
  },
};
WithInitials.args = {
  user: {
    name: 'Ada Lovelace',
  },
};
WithInitialFromEmail.args = {
  user: {
    email: 'ada.lovelace@company.com',
  },
};
WithPlaceholder.args = {
  user: {},
};

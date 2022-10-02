import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import NavLinks from './NavLinks';

export default {
  title: 'NavLinks',
  component: NavLinks,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof NavLinks>;

const Template: ComponentStory<typeof NavLinks> = () => <NavLinks />;

export const Default = Template.bind({});
Default.args = {};
Default.story = {
  parameters: {
    nextRouter: {
      pathname: '/company',
      asPath: '/company',
      query: {},
    },
  },
};

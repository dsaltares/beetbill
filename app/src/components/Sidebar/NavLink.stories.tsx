import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import {
  faBoxOpen,
  faBriefcase,
  faFileInvoice,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import NavLink from './NavLink';

const Icons = {
  faBriefcase,
  faUsers,
  faBoxOpen,
  faFileInvoice,
};

export default {
  title: 'NavLink',
  component: NavLink,
  argTypes: {
    icon: {
      options: Object.keys(Icons),
      mapping: Icons,
      control: { type: 'select' },
    },
  },
} as ComponentMeta<typeof NavLink>;

const Template: ComponentStory<typeof NavLink> = (args) => (
  <NavLink {...args} />
);

export const Default = Template.bind({});
Default.args = {
  label: 'Company',
  href: '/company',
  icon: faBriefcase,
  selected: false,
};

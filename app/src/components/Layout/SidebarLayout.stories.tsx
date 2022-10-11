import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { rest } from 'msw';
import Providers from '@components/Providers';
import SidebarLayout from './SidebarLayout';

export default {
  title: 'SidebarLayout',
  component: SidebarLayout,
  layout: 'fullscreen',
} as ComponentMeta<typeof SidebarLayout>;

const Template: ComponentStory<typeof SidebarLayout> = (args) => (
  <Providers>
    <SidebarLayout {...args}>
      <div>
        <p className="text-xl font-semibold">Content goes here</p>
      </div>
    </SidebarLayout>
  </Providers>
);

export const Default = Template.bind({});
Default.args = {};
Default.parameters = {
  nextRouter: {
    pathname: '/company',
    asPath: '/company',
    query: {},
  },
  msw: {
    handlers: [
      rest.get('http://localhost:6006/api/auth/session', (_req, res, ctx) =>
        res(
          ctx.json({
            user: {
              name: 'David Saltares',
              email: 'david.saltares@gmail.com',
            },
            userId: 'user_1',
            companyId: 'company_1',
          })
        )
      ),
    ],
  },
};

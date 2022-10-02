import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { rest } from 'msw';
import Providers from '@components/Providers';
import Sidebar from './Sidebar';

export default {
  title: 'Sidebar',
  component: Sidebar,
  layout: 'fullscreen',
  argTypes: {
    onClose: { action: 'closed' },
  },
} as ComponentMeta<typeof Sidebar>;

const Template: ComponentStory<typeof Sidebar> = (args) => (
  <Providers>
    <div className="h-screen">
      <Sidebar {...args} />
    </div>
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

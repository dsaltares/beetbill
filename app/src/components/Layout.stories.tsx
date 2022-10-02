import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { rest } from 'msw';
import Providers from '@components/Providers';
import Layout from './Layout';

export default {
  title: 'Layout',
  component: Layout,
  layout: 'fullscreen',
} as ComponentMeta<typeof Layout>;

const Template: ComponentStory<typeof Layout> = (args) => (
  <Providers>
    <div className="h-screen">
      <Layout {...args}>
        <div>
          <p className="text-xl font-semibold">Content goes here</p>
        </div>
      </Layout>
    </div>
  </Providers>
);

export const Default = Template.bind({});
Default.args = {};
Default.story = {
  parameters: {
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
  },
};

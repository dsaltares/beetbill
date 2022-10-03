import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import type { ClientSafeProvider } from 'next-auth/react';
import SignInForm from './SignInForm';

export default {
  title: 'SignInForm',
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof SignInForm>;

const providers: Record<string, ClientSafeProvider> = {
  google: {
    id: 'google',
    name: 'Google',
    type: 'oauth',
    signinUrl: '/api/auth/signin/google',
    callbackUrl: '/api/auth/callback/google',
  },
  email: {
    id: 'email',
    name: 'Email',
    type: 'email',
    signinUrl: '/api/auth/signin/email',
    callbackUrl: '/api/auth/callback/email',
  },
};

const Template: ComponentStory<typeof SignInForm> = () => (
  <SignInForm providers={providers} />
);

export const Default = Template.bind({});

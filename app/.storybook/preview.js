import '../src/styles/globals.css';
import 'tailwindcss/tailwind.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { initialize, mswDecorator } from 'msw-storybook-addon';

initialize();

config.autoAddCss = false;

export const decorators = [mswDecorator];

export const parameters = {
  layout: 'fullscreen',
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      date: /Date$/,
    },
  },
  nextRouter: {
    Provider: RouterContext.Provider,
  },
};

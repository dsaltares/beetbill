import '@testing-library/jest-dom';

import { TextEncoder, TextDecoder } from 'util';
import type { PropsWithChildren } from 'react';
import React from 'react';

// https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// https://github.com/tailwindlabs/headlessui/blob/main/packages/%40headlessui-vue/src/components/dialog/dialog.test.ts#L37
class FakeInteractionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds = [];
}
window.IntersectionObserver = FakeInteractionObserver;
global.IntersectionObserver = FakeInteractionObserver;

const originalLink = jest.requireActual('next/link');

jest.mock('next/link', () =>
  // eslint-disable-next-line react/display-name
  React.forwardRef(({ children, ...props }: PropsWithChildren, ref) =>
    // eslint-disable-next-line react/no-children-prop
    React.createElement(originalLink, {
      ...props,
      ref,
      // eslint-disable-next-line react/no-children-prop
      children: React.createElement('a', { children, ...props }),
    })
  )
);

// https://github.com/inrupt/solid-client-authn-js/issues/1676
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

class FakeDOMRect {
  x: number;
  y: number;
  width: number;
  height: number;
  top: number;
  right: number;
  bottom: number;
  left: number;
  constructor() {
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.top = 0;
    this.right = 0;
    this.bottom = 0;
    this.left = 0;
  }

  toJSON() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      top: this.top,
      right: this.right,
      bottom: this.bottom,
      left: this.left,
    };
  }

  static fromRect(other?: DOMRectInit | undefined): DOMRect {
    const rect = new FakeDOMRect();
    if (other) {
      rect.x = other.x || 0;
      rect.y = other.y || 0;
      rect.width = other.width || 0;
      rect.height = other.height || 0;
    }
    return rect;
  }
}
global.DOMRect = FakeDOMRect;

jest.mock('@react-pdf/renderer', () => ({
  Font: { register: jest.fn() },
  Document: ({ children }: PropsWithChildren) => <div>{children}</div>,
  Image: ({ children }: PropsWithChildren) => <div>{children}</div>,
  Page: ({ children }: PropsWithChildren) => <div>{children}</div>,
  PDFViewer: ({ children }: PropsWithChildren) => <div>{children}</div>,
  Text: ({ children }: PropsWithChildren) => <div>{children}</div>,
  View: ({ children }: PropsWithChildren) => <div>{children}</div>,
}));

process.env.TEST_ENVIRONMENT = 'true';

import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
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
}
window.IntersectionObserver = FakeInteractionObserver;
global.IntersectionObserver = FakeInteractionObserver;

const originalLink = jest.requireActual('next/link');

jest.mock('next/link', () =>
  React.forwardRef(({ children, ...props }, ref) =>
    React.createElement(originalLink, {
      ...props,
      ref,
      children: React.createElement('a', { children, ...props }),
    })
  )
);

// https://github.com/inrupt/solid-client-authn-js/issues/1676
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

class FakeDOMRect {
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
}
global.DOMRect = FakeDOMRect;

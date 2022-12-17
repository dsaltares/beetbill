import { Font } from '@react-pdf/renderer';

Font.register({
  family: 'Inter',
  fonts: [
    { src: '/fonts/Inter-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/Inter-Medium.ttf', fontWeight: 500 },
    { src: '/fonts/Inter-SemiBold.ttf', fontWeight: 600 },
    { src: '/fonts/Inter-Bold.ttf', fontWeight: 700 },
  ],
});

export const sizes = {
  '0.5': 2,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
};

export const fontSizes = {
  sm: 10,
  base: 12,
  lg: 20,
};

export const colors = {
  primary: '#6d28d9',
  secondary: '#a1a1aa',
  white: '#ffffff',
};

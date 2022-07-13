import prisma from '@lib/prisma';

describe('dummy', () => {
  it('should pass', () => {
    expect(prisma).toBeDefined();
  });
});

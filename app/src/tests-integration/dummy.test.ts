import prisma from '@server/prisma';

describe('dummy', () => {
  it('should pass', () => {
    expect(prisma).toBeDefined();
  });
});

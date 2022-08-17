import { z } from 'zod';
import { procedure } from '@server/trpc';

export const HelloInput = z.object({
  text: z.string(),
});

export const HelloOutput = z.string();

export type HelloArgs = z.infer<typeof HelloInput>;
export type HelloResult = z.infer<typeof HelloOutput>;

const hello = procedure
  .meta({ hasAuth: true })
  .input(HelloInput)
  .output(HelloOutput)
  .query(({ input }) => `hello ${input.text}`);

export default hello;

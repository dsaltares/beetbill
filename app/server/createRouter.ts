import { router } from '@trpc/server';
import type { Context } from './context';

const createRouter = () => router<Context>();

export default createRouter;

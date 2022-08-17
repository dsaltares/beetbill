import { useQuery } from '@tanstack/react-query';
import type { HelloArgs } from '@server/procedures/hello';
import trcp from './trpc';

const useHello = (args: HelloArgs) =>
  useQuery(['hello', args], () => trcp.hello.query(args));

export default useHello;

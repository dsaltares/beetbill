import { useQuery } from '@tanstack/react-query';
import trcp from './trpc';

const useHello = () => useQuery(['hello'], () => trcp.query('hello'));

export default useHello;

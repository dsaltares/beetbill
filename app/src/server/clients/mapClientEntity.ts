import type { Client, ClientState } from '@prisma/client';
import type { Client as APIClient } from './types';

type Entity = Client & { states: ClientState[] };

const mapClientEntity = ({ states, ...client }: Entity): APIClient => ({
  ...states[0],
  ...client,
  createdAt: client.createdAt.toISOString(),
  updatedAt: client.updatedAt.toISOString(),
});

export default mapClientEntity;

import Fastify, { FastifyReply, FastifyRequest } from 'fastify';

import FastifyConfig from '../../fastify.config.json';
import { IRouteOption } from '@root/types/custom-types';
import { routeHook } from './hooks/route';

const server = Fastify(FastifyConfig);

export const routesOptions: IRouteOption[] = [];

export async function startHttpServer() {
  server.addHook("preHandler", async (request: FastifyRequest, reply: FastifyReply) => {
    await routeHook(request, reply);
  })

  return server.listen({ port: Number(process.env.APP_PORT ?? 3000), host: '0.0.0.0' });
}

export default server;

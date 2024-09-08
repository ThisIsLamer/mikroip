import { FastifyReply, FastifyRequest } from "fastify";
import { routesOptions } from "../fastify";
import { Rest } from "../rest";

export async function routeHook(request: FastifyRequest, reply: FastifyReply) {
  const route = routesOptions.find(v => 
    v.path === (request.routeOptions.url ?? request.url) && v.method?.toLowerCase() === request.method.toLowerCase()
  );
  if (!route) return reply.code(404).send(Rest.error(request.method, `Route \`${request.url}\` not found`, 404));

  request.route = route;
}
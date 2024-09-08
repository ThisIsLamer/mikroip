/* eslint-disable @typescript-eslint/no-unsafe-member-access */
 
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import server, { routesOptions } from "../core/fastify";
import { BodyParams, IRouteOption, QueryParams } from "../../types/custom-types";
import { FastifyRequest, FastifyReply } from 'fastify';

export function Query(paramName?: string) {
  return function(target: object, propertyKey: string, index: number) {
    Reflect.defineMetadata(`custom:param:${index}`, 
      (req: FastifyRequest<{ Querystring: QueryParams }>) =>
        paramName 
          ? (req.query ? req.query[paramName] : undefined) 
          : req.query,
      target, propertyKey);
  };
}

export function Body(paramName?: string) {
  return function(target: object, propertyKey: string, index: number) {
    Reflect.defineMetadata(`custom:param:${index}`, 
      (req: FastifyRequest<{ Body: BodyParams }>) => 
        paramName
          ? (req.body ? req.body[paramName] : undefined)
          : req.body,
      target, propertyKey
    );
  };
}

export function Request() {
  return function(target: object, propertyKey: string, index: number) {
    Reflect.defineMetadata(`custom:param:${index}`, (req: FastifyRequest) => req, target , propertyKey);
  };
}

export function Reply() {
  return function(target: object, propertyKey: string, index: number) {
    Reflect.defineMetadata(
      `custom:param:${index}`, 
      (req: FastifyRequest, reply: FastifyReply) => reply,
      target, propertyKey
    );
  };
}

export type THTTPMethods = 'get' | 'post' | 'put' | 'delete'

function addRouteOption(path: string, method: string, target: unknown, propertyKey: string, config: IRouteOption['config']) {
  const data = routesOptions.find(v => (v.path === path && v.method === method) || (v.fn.target === target && v.fn.propertyKey === propertyKey));
  if (!data) return routesOptions.push({ path, method, config, fn: { target, propertyKey } });

  data.path = path;
  data.method = method;
  data.config = { ...data.config, config: { ...config } }
}

export function Roles(...args: string[]) {
  return (target: unknown, key: string, descriptor: PropertyDescriptor) => {
    descriptor.roles = args;
  };
}

export function Public() {
  return (target: unknown, key: string, descriptor: PropertyDescriptor) => {
    descriptor.isPublic = true;
  };
}

export function Route(method: THTTPMethods, path: string) {
  return function(target: object, propertyKey: string, descriptor: PropertyDescriptor) {
    addRouteOption(path, method, target, propertyKey, { 
      isPublic: Boolean(descriptor.isPublic),

      roles: descriptor.roles 
    })
    const originalMethod = descriptor.value;

    descriptor.value = async function(request: FastifyRequest, reply: FastifyReply) {
      const args = Reflect.getMetadata('design:paramtypes', target, propertyKey)
        .map((_: () => void, index: number) => {
          return Reflect.getMetadata(`custom:param:${index}`, target, propertyKey)(request, reply);
        })

      const result = await originalMethod.apply(this, args);
      reply.send(result);
    };
 
    if (!server[method]) {
      throw new Error(`HTTP method ${method} is not supported by the server`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    server[method](path, descriptor.value);
  }
}

export function Get(path: string) {
  return Route('get', path)
}

export function Post(path: string) {
  return Route('post', path)
}

export function Put(path: string) {
  return Route('put', path)
}

export function Delete(path: string) {
  return Route('delete', path)
}
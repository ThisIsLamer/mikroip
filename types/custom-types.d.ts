import 'fastify'

type QueryParams = Record<string, string | string[] | undefined>;
type BodyParams = Record<string, string | string[] | number | object>

interface IRouteOption {
  path?: string;
  method?: string;
  config: { 
    isPublic?: boolean;
    
    roles?: string[];

    [x: string]: object | string | boolean | string[] | undefined;
  };
  fn: { target: unknown, propertyKey: string }
}

declare global {
  interface PropertyDescriptor {
    isPublic?: boolean;

    roles?: string[];
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    route: IRouteOption;
  }
}


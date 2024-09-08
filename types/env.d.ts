declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly API: string;

      readonly DB_CONNECT: string;
      readonly REDIS_CONNECT: string;

      readonly CACHE_TIMEOUT?: string;
      
      readonly APP_PORT?: string;
    }
  }
}

export {}


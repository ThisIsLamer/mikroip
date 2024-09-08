import 'reflect-metadata';
import 'dotenv/config'

import { startHttpServer } from './core/fastify';

void (async () => {
  await import('./controllers');
  
  void startHttpServer();
})()

import { FastifyRequest } from 'fastify';
import { IncomingMessage, ServerResponse } from 'http';

export interface Request extends IncomingMessage, Pick<FastifyRequest, 'ip'> {
  originalUrl?: string;
}
export interface Reply extends ServerResponse {}

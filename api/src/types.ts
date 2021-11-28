import type { FastifyReply, FastifyRequest } from 'fastify'

export interface RouteDefinition {
	run(req: FastifyRequest, res: FastifyReply): void | Promise<void>;
  
	method: string;
	path: string;
}

export const enum MetadataKeys {
	APIRoute = '$apex::api-routes'
}
import type { NextFunction, Request, Response } from "express"

export default function(_req: Request, res: Response, next: NextFunction) {
	res.setHeader('x-powered-by', 'ArtieFuzzz | Australian TypeScript Developer ')
	next()
}
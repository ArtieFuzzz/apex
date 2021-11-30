import { HttpStatusCode } from "./HttpStatusCode"

export interface Message {
	code: HttpStatusCode
	error: boolean
	message: string
}
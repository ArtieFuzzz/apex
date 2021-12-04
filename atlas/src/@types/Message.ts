import { HttpStatusCode } from "./HttpStatusCode"

export interface Message {
	code: HttpStatusCode
	error: boolean
	error_message?: string
	message: string
}
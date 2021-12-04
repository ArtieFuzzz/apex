import { model, Schema } from 'mongoose'

const url = new Schema({
	url: { type: String, required: true },
	id: { type: String, required: true }
})

interface URL {
	url: string
	id: string
}

export default model<URL>('URL', url)
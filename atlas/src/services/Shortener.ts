import { ComponentOrServiceHooks, Service } from '@augu/lilith'
import mongoose from 'mongoose'
import { customAlphabet } from 'nanoid'
import config from '../config'
import ShortURL from '../lib/Models/URL'

@Service({
	priority: 0,
	name: 'shortener'
})
export default class URLShortener implements ComponentOrServiceHooks {
	public async load() {
		await mongoose.connect(config.mongoURI)
	}

	public async Generate(link: string): Promise<{ url: string, id: string }> {
		const url = new ShortURL({
			url: link,
			id: this.genID()
		})

		const data = await url.save()

		return { url: data.url, id: data.id }
	}

	public async GetURL(id: string) {
		const data = await ShortURL.findOne({ id })

		if (!data) return null

		return data.url
	}

	private genID() {
		const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    	const nano = customAlphabet(alphabet, 7)

    	return nano()
	}
}

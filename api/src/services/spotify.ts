import { SpotifyTrackFullObject } from '#types'
import { ComponentOrServiceHooks, Service } from '@augu/lilith'
import SpotifyWebApi from 'spotify-web-api-node'
import config from '../config'

@Service({
	priority: 2,
	name: 'spotify'
})
export default class SpotifyService implements ComponentOrServiceHooks {
	protected spotify!: SpotifyWebApi

	public async load() {
		this.spotify = new SpotifyWebApi({
			clientId: config.spotify.client_id,
			clientSecret: config.spotify.client_secret,
			refreshToken: config.spotify.refresh_token
		})
		
		await this.generateAccessToken()
	}

	protected async generateAccessToken() {
		const { body: { access_token } } = await this.spotify.refreshAccessToken()

		return this.spotify.setAccessToken(access_token)
	}

	public async getCurrentTrack() {
		const data: SpotifyTrackFullObject = (await this.spotify.getMyCurrentPlayingTrack()).body
		const item = data.item

		if (item && data.is_playing) {
			// TODO: Filter data out

			return data
		} else {
			return null // { message: 'I\'m not listening to anything right now!', error: false, code: 200 }
		}
	}
}

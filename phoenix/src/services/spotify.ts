import { Artist, SpotifyTrackFullObject } from '#types'
import { ComponentOrServiceHooks, Service } from '@augu/lilith'
import humanizeDuration from 'humanize-duration'
import SpotifyWebApi from 'spotify-web-api-node'
import config from '../config'

/**
 * * Inspired by: https://github.com/newtykins/newtt.me/blob/main/lib/spotify.ts
 * @license MIT
 * @copyright 2021
 */

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
		const { item, is_playing, progress_ms }: SpotifyTrackFullObject = (await this.spotify.getMyCurrentPlayingTrack()).body

		if (item && is_playing) {
			return {
				album_data: {
					images: item.album.images,
					name: item.album.name
				},
				artists: this.formatArtists(item.artists),
				duration: this.formatDuration(item.duration_ms),
				explicit: item.explicit,
				popularity: item.popularity,
				progress: this.formatDuration(progress_ms),
				track_number: item.track_number,
				url: item.external_urls.spotify
			}
		} else {
			return null // { message: 'I\'m not listening to anything right now!', error: false, code: 200 }
		}
	}

	private formatArtists(artists: Artist[]) {
		return artists.map((a) => { return { name: a.name, url: a.external_urls.spotify } })
	}

	private formatDuration(duration: number) {
		return humanizeDuration(duration, {
			round: true,
			conjunction: " and "
		})
	}
}

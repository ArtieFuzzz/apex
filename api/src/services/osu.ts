import { ComponentOrServiceHooks, Service } from '@augu/lilith'
import { fetch, FetchMethods, FetchResultTypes } from '@sapphire/fetch'
import config from '../config'
import constants from '../constants'
import { OsuAuthResponse, OsuUserResponse } from '../types'

@Service({
	priority: 1,
	name: 'osu'
})
export default class osu implements ComponentOrServiceHooks {
	protected token!: string
	protected renew!: NodeJS.Timer

	load() {
		this.renewToken()

		this.renew = setInterval(async () => {
			this.renewToken()
		}, 86000)

		return
	}

	public dispose() {
		clearInterval(this.renew)
	}

	public async getUser(username: string) {
		const req = await fetch<OsuUserResponse>(`${constants.urls.get_user}/${username}/osu`, {
			headers: {
				authorization: `Bearer ${this.token}`,
				accept: 'application/json'
			}
		}, FetchResultTypes.JSON)

		const grades = req.statistics.grade_counts

		return {
			accuracy: req.statistics.hit_accuracy.toFixed(2),
			avatarUrl: req.avatar_url,
			country: req.country,
			countryRank: req.statistics.country_rank,
			grades,
			globalRank: req.statistics.global_rank,
			id: req.id,
			username: req.username,
			totalHits: req.statistics.total_hits,
			totalScore: req.statistics.total_score,
			joinDate: req.join_date,
		}
	}

	async renewToken() {
		const data = await fetch<OsuAuthResponse>('https://osu.ppy.sh/oauth/token', {
			method: FetchMethods.Post,
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				"client_id": config.osu.client_id,
				"client_secret": config.osu.client_secret,
				"grant_type": "client_credentials",
				"scope": "public"
			})
		}, FetchResultTypes.JSON)

		this.token = data.access_token
	}
}

import { OsuAuthResponse, OsuUserResponse } from '#types'
import { request, SendAs } from '@artiefuzzz/lynx'
import { ComponentOrServiceHooks, Service } from '@augu/lilith'
import config from '../config'
import constants from '../constants'

@Service({
	priority: 1,
	name: 'osu'
})
export default class OsuService implements ComponentOrServiceHooks {
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
		const res = await request<OsuUserResponse>(`${constants.urls.get_user}/${username}/osu`).headers({
			authorization: `Bearer ${this.token}`,
			accept: 'application/json'
		}).send()

		const req = res.json
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
		const data = await request<OsuAuthResponse>('https://osu.ppy.sh/oauth/token', 'POST').body({
			"client_id": config.osu.client_id,
			"client_secret": config.osu.client_secret,
			"grant_type": "client_credentials",
			"scope": "public"
		}, SendAs.JSON).send()

		this.token = data.json.access_token
	}
}

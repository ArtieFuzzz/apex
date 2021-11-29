import type { FastifyReply, FastifyRequest } from 'fastify'

export interface RouteDefinition {
	run(req: FastifyRequest, res: FastifyReply): void | Promise<void>
  
	method: string
	path: string
}

export const enum MetadataKeys {
	APIRoute = '$apex::api-route'
}

export interface OsuAuthResponse {
	"access_token": string
	"expires_in": number
	"refresh_token": string
	"token_type": string
}

export interface OsuUserResponse {
	avatar_url:                           string
	country_code:                         string
	default_group:                        string
	id:                                   number
	is_active:                            boolean
	is_bot:                               boolean
	is_deleted:                           boolean
	is_online:                            boolean
	is_supporter:                         boolean
	last_visit:                           string
	pm_friends_only:                      boolean
	profile_colour:                       null
	username:                             string
	cover_url:                            string
	discord:                              string
	has_supported:                        boolean
	interests:                            string
	join_date:                            string
	kudosu:                               Kudosu
	location:                             string
	max_blocks:                           number
	max_friends:                          number
	occupation:                           null
	playmode:                             string
	playstyle:                            string[]
	post_count:                           number
	profile_order:                        string[]
	title:                                null
	title_url:                            null
	twitter:                              null
	website:                              null
	country:                              Country
	cover:                                Cover
	account_history:                      any[]
	active_tournament_banner:             null
	badges:                               any[]
	beatmap_playcounts_count:             number
	comments_count:                       number
	favourite_beatmapset_count:           number
	follower_count:                       number
	graveyard_beatmapset_count:           number
	groups:                               any[]
	loved_beatmapset_count:               number
	mapping_follower_count:               number
	monthly_playcounts:                   MonthlyPlaycount[]
	page:                                 Page
	pending_beatmapset_count:             number
	previous_usernames:                   any[]
	ranked_beatmapset_count:              number
	replays_watched_counts:               any[]
	scores_best_count:                    number
	scores_first_count:                   number
	scores_recent_count:                  number
	statistics:                           Statistics
	support_level:                        number
	user_achievements:                    UserAchievement[]
	rankHistory:                          RankHistory
	rank_history:                         RankHistory
	ranked_and_approved_beatmapset_count: number
	unranked_beatmapset_count:            number
}

interface Country {
	code: string
	name: string
}

interface Cover {
	custom_url: null
	url:        string
	id:         string
}

interface Kudosu {
	total:     number
	available: number
}

interface MonthlyPlaycount {
	start_date: string
	count:      number
}

interface Page {
	html: string
	raw:  string
}

interface RankHistory {
	mode: string
	data: number[]
}

interface Statistics {
	level:                     Level
	global_rank:               number
	pp:                        number
	ranked_score:              number
	hit_accuracy:              number
	play_count:                number
	play_time:                 number
	total_score:               number
	total_hits:                number
	maximum_combo:             number
	replays_watched_by_others: number
	is_ranked:                 boolean
	grade_counts:              GradeCounts
	country_rank:              number
	rank:                      Rank
}

interface GradeCounts {
	ss:  number
	ssh: number
	s:   number
	sh:  number
	a:   number
}

interface Level {
	current:  number
	progress: number
}

interface Rank {
	country: number
}

interface UserAchievement {
	achieved_at:    string
	achievement_id: number
}

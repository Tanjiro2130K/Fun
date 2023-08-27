import { Utils } from '.'

export class RedditFetcher {
    constructor(private reddit: string) {}

    public fetch = async (): Promise<IRedditResponse | { error: string }> => {
        return await this.utils
            .fetch<IRedditResponse>(`https://meme-api.herokuapp.com/gimme/${this.reddit}`)
            .then((res) => {
                if (!res.url) return { error: 'An error occurred' }
                return res
            })
            .catch(() => {
                return { error: 'An error occurred' }
            })
    }

    private utils = new Utils()
}

export interface IRedditResponse {
    postLink: string
    subreddit: string
    title: string
    url: string
    nsfw: boolean
    spoiler: boolean
    author: string
    ups: number
    preview: string[]
}

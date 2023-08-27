import Spotify from 'spotifydl-core'

export class spotify extends Spotify {
    constructor(public url: string) {
        super({
            clientId: 'acc6302297e040aeb6e4ac1fbdfd62c3',
            clientSecret: '0e8439a1280a43aba9a5bc0a16f3f009'
        })
    }

    public getInfo = async (): Promise<spotifyInfo> => {
        try {
            return await this.getTrack(this.url)
        } catch {
            return { error: `Error Fetching ${this.url}` }
        }
    }

    public download = async (): Promise<Buffer> => await this.downloadTrack<undefined>(this.url)
}

interface spotifyInfo {
    name?: string
    artists?: string[]
    album_name?: string
    release_date?: string
    cover_url?: string
    error?: string
}

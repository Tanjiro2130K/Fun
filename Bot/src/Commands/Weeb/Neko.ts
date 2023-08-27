import { BaseCommand, Command, Message } from '../../Structures'

@Command('neko', {
    description: 'Sends a random neko image',
    usage: 'neko',
    cooldown: 5,
    category: 'weeb',
    exp: 15
})
export default class command extends BaseCommand {
    override execute = async ({ reply }: Message): Promise<void> => {
        const { results } = await this.client.utils.fetch<{
            results: { artist_href: string; artist_name: string; source_url: string; url: string }[]
        }>('https://nekos.best/api/v2/neko')
        return void (await reply(await this.client.utils.getBuffer(results[0].url), 'image'))
    }
}

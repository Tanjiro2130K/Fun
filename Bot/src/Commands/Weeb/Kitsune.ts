import { BaseCommand, Command, Message } from '../../Structures'

@Command('kitsune', {
    description: 'Sends a random kitsune image',
    usage: 'kitsune',
    cooldown: 5,
    category: 'weeb',
    exp: 20
})
export default class command extends BaseCommand {
    override execute = async ({ reply }: Message): Promise<void> => {
        const { results } = await this.client.utils.fetch<{
            results: { artist_href: string; artist_name: string; source_url: string; url: string }[]
        }>('https://nekos.best/api/v2/kitsune')
        return void (await reply(await this.client.utils.getBuffer(results[0].url), 'image'))
    }
}

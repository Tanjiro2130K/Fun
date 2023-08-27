import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { RedditFetcher, IRedditResponse } from '../../lib'
import { AnyMessageContent } from '@adiwajshing/baileys'

@Command('subreddit', {
    aliases: ['sr', 'reddit', 'subred'],
    description: 'Sends post from reddit',
    category: 'media',
    usage: 'subreddit [reddit]',
    exp: 10,
    cooldown: 10
})
export default class command extends BaseCommand {
    override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        if (!context) return void M.reply('Provide the reddit you want')
        const query = context.toLowerCase().trim()
        const reddit = await new RedditFetcher(query).fetch()
        if ((reddit as { error: string }).error) return void M.reply('Invalid Subreddit')
        const { url, nsfw, spoiler, title, author, subreddit, postLink } = reddit as IRedditResponse
        const group = await this.client.DB.getGroup(M.from)
        if (nsfw && !group.nsfw) return void M.reply("Cannot display NFSW content as the group hasn't enabled NSFW")
        if (spoiler)
            await M.reply(
                this.client.assets.get('spoiler') as Buffer,
                'image',
                undefined,
                undefined,
                `⚠ *SPOILER WARNING* ⚠`
            )
        const urlSplit = url.split('.')
        const text = `🖌️ *Title: ${title}*\n*👨‍🎨 Author: ${author}*\n*🎏 Subreddit: ${subreddit}*`
        let buffer = await this.client.utils.getBuffer(url)
        const gif = urlSplit[urlSplit.length - 1] === 'gif'
        if (gif) buffer = await this.client.utils.gifToMp4(buffer)
        const type: 'video' | 'image' = gif ? 'video' : 'image'
        return void (await this.client.sendMessage(
            M.from,
            {
                [type]: buffer,
                gifPlayback: gif ? true : undefined,
                caption: text,
                contextInfo: {
                    externalAdReply: {
                        title,
                        sourceUrl: postLink,
                        thumbnail: buffer,
                        mediaType: 1
                    }
                }
            } as unknown as AnyMessageContent,
            {
                quoted: M.message
            }
        ))
    }
}

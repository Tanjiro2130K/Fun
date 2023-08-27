import { AnyMessageContent } from '@adiwajshing/baileys'
import { BaseCommand, Command, Message } from '../../Structures'
import { WaifuResponse } from '../../Types'

@Command('hg', {
    description: "Displays user's haigusha",
    usage: '${helper.config.prefix}hg [tag/quote user]',
    category: 'weeb',
    cooldown: 15,
    exp: 10
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        const users = M.mentioned
        if (M.quoted && !users.includes(M.quoted.sender.jid)) users.push(M.quoted.sender.jid)
        while (users.length < 1) users.push(M.sender.jid)
        let user = users[0]
        if (M.type === 'buttonsResponseMessage') user = M.sender.jid
        const { haigusha: Haigusha, username: name } = await this.client.DB.getUser(user)
        if (!Haigusha.married)
            return void M.reply(
                `${user === M.sender.jid ? "You aren't" : `*@${user.split('@')[0]}* isn't`} married to anyone`,
                'text',
                undefined,
                undefined,
                undefined,
                user === M.sender.jid ? undefined : [user]
            )
        let username = this.client.contact.getContact(user).jid
        if (user === M.sender.jid) username = M.sender.username
        if (name.custom) username = name.name as string
        const haigusha = Haigusha.data as WaifuResponse
        const appearances = haigusha.appearances as WaifuResponse['series'][]
        let text = `🎐 *Name:* ${haigusha.name}\n\n`
        if (haigusha.original_name && haigusha.original_name !== null && haigusha.original_name !== '')
            text += `🎗 *Original Name:* ${haigusha.original_name}\n\n`
        text += `❤️‍🩹 *Married to:* ${username}\n\n`
        if (haigusha.age && haigusha.age !== null) text += `🍀 *Age:* ${haigusha.age}\n\n`
        text += `🎀 *Gender:* ${haigusha.husbando ? 'Male' : 'Female'}\n\n🔗 *Appearance:* ${
            haigusha.series !== null || haigusha.series ? haigusha.series?.name : appearances[0]?.name
        }\n\n❄ *Description:* ${haigusha.description}`
        const buffer = await this.client.utils.getBuffer(haigusha.display_picture as string)
        return void (await this.client.sendMessage(
            M.from,
            {
                image: buffer,
                caption: text,
                jpegThumbnail: buffer.toString('base64'),
                contextInfo: {
                    externalAdReply: {
                        title: haigusha.name,
                        mediaType: 1,
                        thumbnail: buffer,
                        sourceUrl: `https://mywaifulist.moe/waifu/${haigusha.slug}`
                    }
                }
            } as unknown as AnyMessageContent,
            {
                quoted: M.message
            }
        ))
    }
}

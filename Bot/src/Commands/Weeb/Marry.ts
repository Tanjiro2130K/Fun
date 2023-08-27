import { BaseCommand, Command, Message } from '../../Structures'
import { Ship } from '@shineiichijo/canvas-chan'
import { AnyMessageContent } from '@adiwajshing/baileys'

@Command('marry', {
    description: 'Marries the summoned haigusha',
    usage: 'marry',
    cooldown: 45,
    category: 'weeb',
    exp: 10
})
export default class command extends BaseCommand {
    override execute = async ({ from, sender, reply, message }: Message): Promise<void> => {
        if (!this.handler.haigushaResponse.has(from))
            return void reply(
                `There are no summoned haigusha to marry. Use *${this.client.config.prefix}haigusha* to marry one`
            )
        const { haigusha } = await this.client.DB.getUser(sender.jid)
        if (haigusha.married) {
            const buttons = [
                {
                    buttonId: 'id1',
                    buttonText: { displayText: `${this.client.config.prefix}divorce` },
                    type: 1
                }
            ]
            const buttonMessage = {
                text: `You are already married to *${haigusha.data?.name}*`,
                footer: '',
                headerType: 1,
                buttons: buttons
            }
            return void (await this.client.sendMessage(from, buttonMessage, {
                quoted: message
            }))
        }
        const slugs = await this.client.DB.getMarriedSlugs()
        const res = this.handler.haigushaResponse.get(from)
        if (slugs.includes(res?.slug as string)) return void reply('💔 Already taken')
        await this.client.DB.characters.updateOne({ mwl: 'married' }, { $push: { slugs: res?.slug } })
        await this.client.DB.user.updateOne(
            { jid: sender.jid },
            { $set: { 'haigusha.married': true, 'haigusha.data': res } }
        )
        this.handler.haigushaResponse.delete(from)
        let pfp: Buffer
        try {
            pfp = await this.client.utils.getBuffer((await this.client.profilePictureUrl(sender.jid, 'image')) || '')
        } catch (error) {
            pfp = this.client.assets.get('404') as Buffer
        }
        const ship = [
            {
                name: sender.username,
                image: pfp
            },
            {
                name: res?.name as string,
                image: await this.client.utils.getBuffer(res?.display_picture as string)
            }
        ]
        const percentage = Math.floor(Math.random() * (100 - 65) + 65)
        const buffer = await new Ship(ship, percentage).build()
        const buttons = [
            {
                buttonId: 'id1',
                buttonText: { displayText: `${this.client.config.prefix}hg` },
                type: 1
            }
        ]
        const buttonMessage = {
            image: buffer,
            caption: `🎉 You are now married to *${res?.name}*`,
            footer: '',
            jpegThumbnail: buffer.toString('base64'),
            buttons: buttons,
            headerType: 4
        }
        return void (await this.client.sendMessage(from, buttonMessage as AnyMessageContent, {
            quoted: message
        }))
    }
}

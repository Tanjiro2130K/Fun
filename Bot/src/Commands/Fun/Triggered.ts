import { Triggered } from '@shineiichijo/canvas-chan'
import { proto } from '@adiwajshing/baileys'
import { BaseCommand, Command, Message } from '../../Structures'

@Command('triggered', {
    description: "Makes a triggered meme of the given image/user's picture",
    aliases: ['trigger'],
    category: 'fun',
    cooldown: 15,
    exp: 15,
    usage: 'triggered [tag/quote users]'
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        let buffer!: Buffer
        if (M.type === 'imageMessage') buffer = await M.downloadMediaMessage(M.message.message as proto.IMessage)
        if (M.quoted && M.quoted.type === 'imageMessage') buffer = await M.downloadMediaMessage(M.quoted.message)
        if (M.quoted && M.quoted.type !== 'imageMessage')
            buffer = await this.client.utils.getBuffer(
                (await this.client.profilePictureUrl(M.quoted.sender.jid, 'image')) || ''
            )
        if (!M.quoted && M.type !== 'imageMessage' && M.mentioned.length >= 1)
            buffer = await this.client.utils.getBuffer(
                (await this.client.profilePictureUrl(M.mentioned[0], 'image')) || ''
            )
        if (!M.quoted && M.type !== 'imageMessage' && M.mentioned.length < 1)
            buffer = await this.client.utils.getBuffer(
                (await this.client.profilePictureUrl(M.sender.jid, 'image')) || ''
            )
        if (!buffer) return void M.reply('*Provide an image*')
        return void (await M.reply(
            await this.client.utils.gifToMp4(await new Triggered(buffer).build()),
            'video',
            true
        ))
    }
}

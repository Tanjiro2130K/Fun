import { Command, BaseCommand, Message } from '../../Structures'
import { Simp } from '@shineiichijo/canvas-chan'
import { proto } from '@adiwajshing/baileys'

@Command('simp', {
    description: 'Makes a person simp',
    category: 'fun',
    exp: 20,
    cooldown: 15,
    usage: 'simp [tag/quote users]'
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
        const simp = new Simp(buffer)
        return void (await M.reply(await simp.build(), 'image'))
    }
}

import { BaseCommand, Command, Message } from '../../Structures'

@Command('delete', {
    description: 'Deletes the quoted message',
    category: 'moderation',
    usage: 'delete [quote_message]',
    exp: 10,
    cooldown: 15,
    aliases: ['del']
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        if (!M.quoted) return void M.reply('Quote the message that you want me to delete')
        const bot = this.client.correctJid(this.client.user?.id || '')
        M.quoted.key
        const isAdmin = M.groupMetadata?.admins?.includes(bot)
        if (M.quoted.sender.jid !== bot && !isAdmin) return void M.reply("Make me an admin to delete someone's message")
        return void (await this.client.sendMessage(M.from, {
            delete: M.quoted.key
        }))
    }
}

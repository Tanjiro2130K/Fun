import { BaseCommand, Command, Message } from '../../Structures'

@Command('tcard-delete', {
    description: 'Deletes the ongoing card trade',
    usage: 'tcard-delete',
    category: 'cards',
    aliases: ['tcard-del'],
    exp: 10,
    cooldown: 20
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        const res = this.handler.cardTradeResponse.get(M.from)
        if (!res) return void M.reply('There are no card trade ongoing for this group right now')
        if (res.creator !== M.sender.jid) return void M.reply('The one who started this trade can only delete it')
        this.handler.cardTradeResponse.delete(M.from)
        this.handler.userTradeSet.delete(M.sender.jid)
        return void M.reply('Card trade deleted')
    }
}

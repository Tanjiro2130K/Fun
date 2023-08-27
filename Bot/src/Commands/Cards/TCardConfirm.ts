import { BaseCommand, Command, Message } from '../../Structures'

@Command('tcard-confirm', {
    description: 'Confirms the ongoing card trade',
    category: 'cards',
    cooldown: 10,
    exp: 25,
    usage: 'tcard-confirm'
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        const res = this.handler.cardTradeResponse.get(M.from)
        if (!res) return void M.reply("There aren't any card trade ongoing for this group at the moment")
        if (res.creator === M.sender.jid) return void M.reply("You can't trade with yourself")
        const { deck } = await this.client.DB.getUser(M.sender.jid)
        const index = deck.findIndex((x) => x.tier === res.with.tier && x.name === res.with.name)
        if (index < 0)
            return void M.reply(
                `You can't proceed this trade as you don't have *${res.with.name} - ${res.with.tier}* in your deck`
            )
        const { deck: Deck } = await this.client.DB.getUser(res.creator)
        const card = deck[index]
        Deck[res.index] = card
        deck[index] = res.offer
        this.handler.cardTradeResponse.delete(M.from)
        this.handler.userTradeSet.delete(res.creator)
        await this.client.DB.user.updateOne({ jid: res.creator }, { $set: { deck: Deck } })
        await this.client.DB.user.updateOne({ jid: M.sender.jid }, { $set: { deck } })
        return void M.reply(
            `🎊 *Trade Completed!* 🎊\n\n*${card.name} - ${card.tier}* -----> *@${res.creator.split('@')[0]}*\n\n*${
                res.offer.name
            } - ${res.offer.tier}* -----> *@${M.sender.jid.split('@')[0]}*`,
            'text',
            undefined,
            undefined,
            undefined,
            [M.sender.jid, res.creator]
        )
    }
}

import { Command, BaseCommand, Message } from '../../Structures'

@Command('swap-card', {
    description: 'Swaps the indexes of cards in your deck',
    category: 'cards',
    usage: 'swap-card <index_number_of_the_card_in_your_deck_to_be_swapped> <index_number_of_the_card_in_your_deck_to_be_swapped_with>',
    cooldown: 10,
    exp: 10,
    aliases: ['sc'],
    antiTrade: true
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        if (M.numbers.length < 2)
            return void M.reply(
                `Provide the index numbers of cards to be swapped. Example: *${this.client.config.prefix}swap-card 1 4*`
            )
        const data = await this.client.DB.getUser(M.sender.jid)
        if (M.numbers[0] > data.deck.length || M.numbers[1] > data.deck.length || M.numbers[0] < 1 || M.numbers[1] < 1)
            return void M.reply('Invaild index number of a card in your deck')
        const t = data.deck[M.numbers[0] - 1]
        data.deck[M.numbers[0] - 1] = data.deck[M.numbers[1] - 1]
        data.deck[M.numbers[1] - 1] = t
        await this.client.DB.user.updateOne({ jid: M.sender.jid }, { $set: { deck: data.deck } })
        return void M.reply(`🟩 *Swapped ${M.numbers[0]} & ${M.numbers[1]}*`)
    }
}

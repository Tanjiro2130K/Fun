import { BaseCommand, Command, Message } from '../../Structures'

@Command('t2collection', {
    category: 'cards',
    description: "Transfers a card in a user's deck to the collection",
    usage: 't2collection <index_number_of_a_card_in_your_deck>',
    cooldown: 15,
    exp: 35,
    aliases: ['t2coll', 't2collec'],
    antiTrade: true
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        const { deck, cardCollection } = await this.client.DB.getUser(M.sender.jid)
        if (M.numbers.length < 2)
            return void M.reply(
                'Provide the index number of a card in your deck that you wanna store in your collection'
            )
        const i = M.numbers[1]
        if (i < 1 || i > deck.length) return void M.reply('Invalid index number of a card in your deck')
        const data = deck[i - 1]
        cardCollection.push(data)
        deck.splice(i - 1, 1)
        await this.client.DB.user.updateOne({ jid: M.sender.jid }, { $set: { deck, cardCollection } })
        const buttons = [
            {
                buttonId: 'id1',
                buttonText: { displayText: `${this.client.config.prefix}deck` },
                type: 1
            },
            {
                buttonId: 'id2',
                buttonText: { displayText: `${this.client.config.prefix}collection` },
                type: 1
            }
        ]
        const buttonMessage = {
            text: `*${data.name} - ${data.tier}* has been stored in your collection`,
            footer: '',
            buttons: buttons,
            headerType: 1
        }
        return void (await this.client.sendMessage(M.from, buttonMessage, {
            quoted: M.message
        }))
    }
}

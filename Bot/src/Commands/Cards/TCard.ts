import { BaseCommand, Command, Message } from '../../Structures'
import { Card } from '../../Database'
import { IArgs, TCardsTier } from '../../Types'

@Command('tcard', {
    description: "Trades a card in user's deck with another user's card",
    category: 'cards',
    usage: 'tcard <index_number_of_the_card_in_your_deck_that_you_wanna_trade> | <name_of_the_card_that_you_wanna_trade_with> | <tier_of_the_card_that_you_wanna_trade_with>',
    exp: 10,
    cooldown: 15
})
export default class command extends BaseCommand {
    override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const terms = context.split('|')
        if (!terms[0] || !terms[1] || !terms[2])
            return void M.reply(
                `Invalid Usage. Example: *${this.client.config.prefix}tcard 2 (which is the index number of the card in your deck that you wanna trade) | Chitoge Kirisaki (which is the name of the card that you want for the trade) | 5 (which is the tier of the card that you want for the trade)*`
            )
        const index = parseInt(terms[0].trim())
        const { deck } = await this.client.DB.getUser(M.sender.jid)
        if (isNaN(index) || index > deck.length || index < 1)
            return void M.reply('Invalid index number of a card in your deck')
        const tier = terms[2].trim() as TCardsTier
        if (!this.tiers.includes(tier)) return void M.reply('Invalid card tier')
        const valid = await this.validate(terms[1].trim(), tier)
        if (!valid) return void M.reply(`Couldn\'t find any card | *"${terms[1].trim()} - ${tier}"*`)
        this.handler.cardTradeResponse.set(M.from, {
            creator: M.sender.jid,
            offer: deck[index - 1],
            index: index - 1,
            with: {
                name: terms[1].trim(),
                tier
            }
        })
        this.handler.userTradeSet.add(M.sender.jid)
        const buttons = [
            {
                buttonId: 'id1',
                buttonText: { displayText: `${this.client.config.prefix}tcard-confirm` },
                type: 1
            },
            {
                buttonId: 'id2',
                buttonText: { displayText: `${this.client.config.prefix}tcard-delete` },
                type: 1
            }
        ]
        const text = `🃏 *Card Trade Started* 🃏\n\n🍥 *Offer:* ${deck[index - 1].name} - ${
            deck[index - 1].tier
        }\n\n🔮 *For:* ${terms[1].trim()} - ${tier}`
        const buttonMessage = {
            text,
            footer: '',
            buttons: buttons,
            headerType: 1
        }
        await this.client.sendMessage(M.from, buttonMessage, {
            quoted: M.message
        })
        setTimeout(() => {
            if (!this.handler.cardTradeResponse.has(M.from)) return void null
            this.handler.cardTradeResponse.delete(M.from)
            this.handler.userTradeSet.delete(M.sender.jid)
            return void M.reply('Card trade cancelled')
        }, 6 * 10000)
    }

    private tiers: TCardsTier[] = ['1', '2', '3', '4', '5', '6', 'S']

    private validate = async (name: string, tier: TCardsTier): Promise<boolean> => {
        const claimedCards = (await this.client.DB.getClaimedCards()).data
        const cards = claimedCards.filter((x) => x.tier === tier).map((x) => x.name)
        return cards.includes(name)
    }
}

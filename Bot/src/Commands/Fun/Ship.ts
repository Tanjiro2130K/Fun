import { Ship, IShipOptions } from '@shineiichijo/canvas-chan'
import { BaseCommand, Command, Message } from '../../Structures'

@Command('ship', {
    description: 'Best way to ship people',
    category: 'fun',
    exp: 15,
    cooldown: 10,
    usage: 'ship [tag/quote users]'
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        const users = M.mentioned
        if (M.quoted && !users.includes(M.quoted.sender.jid)) users.push(M.quoted.sender.jid)
        while (users.length < 2) users.push(M.sender.jid)
        const bot = `${this.client.user?.id.split('@')[0].split(':')[0]}@s.whatsapp.net`
        if (users[0] === bot || users[1] === bot) return void M.reply("Don't include me, Baka!")
        const ship: IShipOptions[] = []
        for (const user of users) {
            const name = this.client.contact.getContact(user).username
            let pfp: Buffer
            try {
                pfp = await this.client.utils.getBuffer((await this.client.profilePictureUrl(user, 'image')) || '')
            } catch (error) {
                pfp = this.client.assets.get('404') as Buffer
            }
            ship.push({ name, image: pfp })
        }
        const percentage = Math.floor(Math.random() * 100)
        let text!: string
        if (percentage === 0 || (percentage > 0 && percentage < 10)) text = 'Awful'
        else if (percentage >= 10 && percentage < 25) text = 'Very Bad'
        else if (percentage >= 25 && percentage < 50) text = 'Poor'
        else if (percentage >= 50 && percentage < 75) text = 'Average'
        else if (percentage >= 75 && percentage < 80) text = 'Good'
        else if (percentage >= 80 && percentage < 90) text = 'Great'
        else if (percentage >= 90) text = 'Amazing'
        let caption = `*~Compatability Meter~*\n`
        caption += `\t\t---------------------------------\n`
        caption += `*@${users[0].split('@')[0]}*  x  *@${users[1].split('@')[0]}*\n`
        caption += `\t\t---------------------------------\n`
        caption += `\t\t\t\t\t*ShipCent: ${percentage}%*\n\t\t*${text}*`
        const image = new Ship(ship, percentage, text)
        return void M.reply(await image.build(), 'image', undefined, undefined, caption, [users[0], users[1]])
    }
}

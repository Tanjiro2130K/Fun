import { Friendship, IFriendShip } from '@shineiichijo/canvas-chan'
import { BaseCommand, Command, Message } from '../../Structures'

@Command('friendship', {
    description: 'Measures friendship level of the tagged users',
    category: 'fun',
    exp: 30,
    cooldown: 25,
    usage: 'friendship [tag/quote users]'
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        const users = M.mentioned
        if (M.quoted && !users.includes(M.quoted.sender.jid)) users.push(M.quoted.sender.jid)
        while (users.length < 2) users.push(M.sender.jid)
        const bot = `${this.client.user?.id.split('@')[0].split(':')[0]}@s.whatsapp.net`
        if (users[0] === bot || users[1] === bot) return void M.reply("Don't include me, Baka!")
        const friendship: IFriendShip[] = []
        for (const user of users) {
            const name = this.client.contact.getContact(user).username
            let pfp!: string
            try {
                pfp =
                    (await this.client.profilePictureUrl(user, 'image')) ||
                    'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'
            } catch (error) {
                pfp = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'
            }
            friendship.push({ name, image: pfp })
        }
        let text!: string
        if (this.percentage === 0 || (this.percentage > 0 && this.percentage < 10)) text = 'Awful'
        else if (this.percentage >= 10 && this.percentage < 25) text = 'Very Bad'
        else if (this.percentage >= 25 && this.percentage < 50) text = 'Poor'
        else if (this.percentage >= 50 && this.percentage < 75) text = 'Average'
        else if (this.percentage >= 75 && this.percentage < 80) text = 'Good'
        else if (this.percentage >= 80 && this.percentage < 90) text = 'Great'
        else if (this.percentage >= 90 && this.percentage < 95) text = 'Best Friends'
        else if (this.percentage >= 95) text = 'Soulmates'
        let caption = `*~Friendship Meter~*\n`
        caption += `\t\t---------------------------------\n`
        caption += `*@${users[0].split('@')[0]}*  x  *@${users[1].split('@')[0]}*\n`
        caption += `\t\t---------------------------------\n`
        caption += `\t\t\t\t\t*Level: ${this.percentage}%*\n\t\t*${text}*`
        return void (await M.reply(
            await new Friendship(friendship, this.percentage, text).build(),
            'image',
            undefined,
            undefined,
            caption,
            [users[0], users[1]]
        ))
    }

    private percentage = Math.floor(Math.random() * 100)
}

import { BaseCommand, Command, Message } from '../../Structures'

@Command('divorce', {
    description: 'Divorce married haigusha',
    cooldown: 45,
    exp: 10,
    category: 'weeb',
    usage: 'divorce'
})
export default class command extends BaseCommand {
    override execute = async ({ from, sender, reply, message }: Message): Promise<void> => {
        const { haigusha } = await this.client.DB.getUser(sender.jid)
        if (!haigusha.married) return void reply("You aren't married to anyone")
        const buttons = [
            {
                buttonId: 'od1',
                buttonText: { displayText: `${this.client.config.prefix}haigusha` },
                type: 1
            }
        ]
        const buttonMessage = {
            text: `💔 You divorced *${haigusha.data?.name}*`,
            headerType: 1,
            footer: '',
            buttons: buttons
        }
        await this.client.DB.characters.updateOne({ mwl: 'married' }, { $pull: { slugs: haigusha.data?.slug } })
        await this.client.DB.user.updateOne(
            { jid: sender.jid },
            { $set: { 'haigusha.married': false }, $unset: { 'haigusha.data': '' } }
        )
        return void (await this.client.sendMessage(from, buttonMessage, { quoted: message }))
    }
}

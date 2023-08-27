import { BaseCommand, Command, Message } from '../../Structures'

@Command('open', {
    description: 'Enables everyone in a group to send message',
    adminRequired: true,
    category: 'moderation',
    usage: 'open',
    exp: 5,
    cooldown: 10
})
export default class command extends BaseCommand {
    override execute = async ({ from, reply, groupMetadata }: Message): Promise<void> => {
        if (!groupMetadata) return void reply('*Try Again!*')
        const { announce } = await this.client.groupMetadata(from)
        if (!announce) return void reply("The group's already opened")
        return void (await this.client.groupSettingUpdate(from, 'not_announcement'))
    }
}

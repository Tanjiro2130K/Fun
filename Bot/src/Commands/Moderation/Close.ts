import { BaseCommand, Command, Message } from '../../Structures'

@Command('close', {
    description: 'Disables everyone in a group to send message except for the admins',
    adminRequired: true,
    category: 'moderation',
    usage: '${helper.config.prefix}close',
    exp: 5,
    cooldown: 10
})
export default class command extends BaseCommand {
    override execute = async ({ from, reply, groupMetadata }: Message): Promise<void> => {
        if (!groupMetadata) return void reply('*Try Again!*')
        const { announce } = groupMetadata
        if (announce) return void reply("The group's already closed")
        return void (await this.client.groupSettingUpdate(from, 'announcement'))
    }
}
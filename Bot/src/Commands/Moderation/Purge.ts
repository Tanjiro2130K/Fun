import { BaseCommand, Command, Message } from '../../Structures'

@Command('purge', {
    description: 'Removes all of the user in a group',
    category: 'moderation',
    exp: 5,
    cooldown: 5,
    usage: 'purge',
    adminRequired: true
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        if (!M.groupMetadata) return void M.reply('*Try Again!*')
        const { participants, owner } = M.groupMetadata
        if (M.sender.jid !== owner) return void M.reply('This command can only be used by the owner of the group')
        if (this.purgeSet.has(M.from)) {
            const arr = participants.map((participant) => participant.id)
            if (arr.includes(owner as string)) arr.splice(arr.indexOf(owner as string), 1)
            await this.client
                .groupParticipantsUpdate(M.from, arr, 'remove')
                .then(async () => {
                    M.reply('Done')
                    this.purgeSet.delete(M.from)
                    return void (await this.client.groupLeave(M.from))
                })
                .catch(() => {
                    return void M.reply('*Try Again*')
                })
        }
        this.purgeSet.add(M.from)
        M.reply(
            'Are you sure? This will remove all of the members in this group. Use this command again if you want to proceed (within 1 minute)'
        )
        setTimeout(() => {
            if (!this.purgeSet.has(M.from)) return void null
            this.purgeSet.delete(M.from)
        }, 6 * 1000)
    }

    private purgeSet = new Set<string>()
}

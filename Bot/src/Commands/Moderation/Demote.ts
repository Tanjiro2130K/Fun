import { BaseCommand, Command, Message } from '../../Structures'

@Command('demote', {
    description: 'Demotes the mentioned users',
    category: 'moderation',
    usage: 'demote [tag_users]',
    exp: 10,
    cooldown: 10,
    adminRequired: true
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        if (!M.groupMetadata) return void M.reply('*Try Again!*')
        const users = M.mentioned
        if (M.quoted && !users.includes(M.quoted.sender.jid)) users.push(M.quoted.sender.jid)
        if (!users.length || users.length < 1)
            return void M.reply('Tag or quote the users that you want to demote, Baka!')
        let flag = false
        const skipped: string[] = []
        const arr: string[] = []
        let text = '➰ *Demoted:*\n'
        let Text = ''
        let botFlag = false
        const bot = this.client.correctJid(this.client.user?.id || '')
        for (const user of users) {
            const isAdmin = M.groupMetadata.admins?.includes(user)
            if (!isAdmin) {
                Text += `I have skipped myself`
                botFlag = true
                skipped.push(user)
                continue
            }
            if (user === bot) {
                flag = true
                continue
            }
            text += `\n*@${user.split('@')[0]}`
            arr.push(user)
        }
        if (botFlag) M.reply(Text)
        if (flag)
            M.reply(
                `Skipped *${skipped.map((jid) => `@${jid.split('@')[0]}`).join(' ')}* as ${
                    skipped.length > 1 ? 'they are already not an admin' : 'he/she is already not an admin'
                }`,
                'text',
                undefined,
                undefined,
                undefined,
                skipped
            )
        if (arr.length < 0)
            return void M.reply(
                `There are no users left to demote as ${
                    users.length > 1 ? 'all of them are already not an admin' : "the user's already not an admin"
                }`
            )
        await this.client.groupParticipantsUpdate(M.from, arr, 'demote')
        return void M.reply(text, 'text', undefined, undefined, undefined, arr)
    }
}

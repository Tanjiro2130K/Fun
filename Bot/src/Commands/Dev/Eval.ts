import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs } from '../../Types'

@Command('eval', {
    description: 'Evaluates JavaScript',
    category: 'dev',
    exp: 10,
    cooldown: 3,
    dm: true,
    usage: 'eval [JavaScript code]'
})
export default class command extends BaseCommand {
    override execute = async (M: Message, args: IArgs): Promise<void> => {
        let out: string
        try {
            const result = eval(args.context)
            out = JSON.stringify(result, null, '\t') || 'Evaluated JavaScript'
        } catch (error: any) {
            out = error.message
        }
        return void M.reply(out)
    }
}

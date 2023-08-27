import { IArgs, WaifuResponse } from '../../Types'
import { BaseCommand, Command, Message } from '../../Structures'
import { AnyMessageContent } from '@adiwajshing/baileys'

@Command('haigusha', {
    description: 'Summons a random anime character to marry',
    cooldown: 15,
    exp: 20,
    category: 'weeb',
    usage: 'haigusha || haigusha --waifu || haigusha --husbando'
})
export default class command extends BaseCommand {
    override execute = async ({ from, message }: Message, { flags }: IArgs): Promise<void> => {
        let haigusha = await this.client.utils.fetch<WaifuResponse>(
            'https://shooting-star-unique-api.vercel.app/api/mwl/random'
        )
        if (flags.includes('--waifu'))
            haigusha = await this.client.utils.fetch<WaifuResponse>(
                'https://shooting-star-unique-api.vercel.app/api/mwl/random/husbando'
            )
        else if (flags.includes('--husbando'))
            haigusha = await this.client.utils.fetch<WaifuResponse>(
                'https://shooting-star-unique-api.vercel.app/api/mwl/random/waifu'
            )
        const appearances = haigusha.appearances as WaifuResponse['series'][]
        this.handler.haigushaResponse.set(from, haigusha)
        let text = `🎐 *Name:* ${haigusha.name}\n\n`
        if (haigusha.original_name && haigusha.original_name !== null && haigusha.original_name !== '')
            text += `🎗 *Original Name:* ${haigusha.original_name}\n\n`
        if (haigusha.age && haigusha.age !== null) text += `🍀 *Age:* ${haigusha.age}\n\n`
        text += `🎀 *Gender:* ${haigusha.husbando ? 'Male' : 'Female'}\n\n🔗 *Appearance:* ${
            haigusha.series !== null || haigusha.series ? haigusha.series?.name : appearances[0]?.name
        }\n\n❄ *Description:* ${haigusha.description}`
        const buttons = [
            {
                buttonId: 'id1',
                buttonText: { displayText: `${this.client.config.prefix}marry` },
                type: 1
            }
        ]
        const buffer = await this.client.utils.getBuffer(haigusha.display_picture as string)
        const buttonMessage = {
            image: buffer,
            caption: text,
            footer: '',
            buttons: buttons,
            headerType: 4,
            jpegThumbnail: buffer.toString('base64'),
            contextInfo: {
                externalAdReply: {
                    title: haigusha.name,
                    mediaType: 1,
                    thumbnail: buffer,
                    sourceUrl: `https://mywaifulist.moe/waifu/${haigusha.slug}`
                }
            }
        }
        return void (await this.client.sendMessage(from, buttonMessage as unknown as AnyMessageContent, {
            quoted: message
        }))
    }
}

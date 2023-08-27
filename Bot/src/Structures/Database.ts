import { Contact } from '@adiwajshing/baileys'
import {
    userSchema,
    groupSchema,
    contactSchema,
    sessionSchema,
    disabledCommandsSchema,
    TCommandModel,
    TGroupModel,
    TSessionModel,
    TUserModel,
    User,
    Group,
    featureSchema,
    characterSchema,
    TFeatureModel,
    cardsSchema,
    TCardsModel,
    CardSchema
} from '../Database'
import moment from 'moment-timezone'
import { Utils } from '../lib'

export class Database {
    public getUser = async (jid: string): Promise<TUserModel> =>
        (await this.user.findOne({ jid })) ||
        (await new this.user({ jid, tag: this.utils.generateRandomUniqueTag() }).save())

    public setExp = async (jid: string, experience: number): Promise<void> => {
        experience = experience + Math.floor(Math.random() * 25)
        await this.updateUser(jid, 'experience', 'inc', experience)
    }

    public updateUser = async (
        jid: string,
        field: keyof User,
        method: 'inc' | 'set',
        update: User[typeof field]
    ): Promise<void> => {
        await this.getUser(jid)
        await this.user.updateOne({ jid }, { [`$${method}`]: { [field]: update } })
    }

    public banUser = async (jid: string, bannedBy: string, bannedIn: string, reason: string) => {
        await this.getUser(jid)
        const time = moment.tz('Etc/GMT').format('MMM D, YYYY HH:mm:ss')
        await this.user.updateOne(
            { jid },
            {
                $set: {
                    'ban.banned': true,
                    'ban.bannedBy': bannedBy,
                    'ban.bannedIn': bannedIn,
                    'ban.time': time,
                    'ban.reason': reason
                }
            }
        )
    }

    public unbanUser = async (jid: string) => {
        await this.user.updateOne(
            { jid },
            {
                $set: { 'ban.banned': false },
                $unset: {
                    'ban.bannedBy': '',
                    'ban.bannedIn': '',
                    'ban.time': '',
                    'ban.reason': ''
                }
            }
        )
    }

    public setGold = async (jid: string, gold: number, field: 'wallet' | 'bank' = 'wallet'): Promise<void> => {
        await this.updateUser(jid, field, 'inc', gold)
    }

    public removeUser = async (jid: string): Promise<void> => {
        await this.user.deleteOne({ jid })
    }

    public getGroup = async (jid: string): Promise<TGroupModel> =>
        (await this.group.findOne({ jid })) || (await new this.group({ jid }).save())

    public updateGroup = async (jid: string, field: keyof Group, update: boolean | string): Promise<void> => {
        await this.getGroup(jid)
        await this.group.updateOne({ jid }, { $set: { [field]: update } })
    }

    public getMarriedSlugs = async (): Promise<string[]> => {
        const result =
            (await this.characters.findOne({ mwl: 'married' })) ||
            (await new this.characters({ mwl: 'married' }).save())
        return result.slugs
    }

    public getSession = async (sessionId: string): Promise<TSessionModel | null> =>
        await this.session.findOne({ sessionId })

    public saveNewSession = async (sessionId: string): Promise<void> => {
        await new this.session({ sessionId }).save()
    }

    public updateSession = async (sessionId: string, session: string): Promise<void> => {
        await this.session.updateOne({ sessionId }, { $set: { session } })
    }

    public removeSession = async (sessionId: string): Promise<void> => {
        await this.session.deleteOne({ sessionId })
    }

    public getContacts = async (): Promise<Contact[]> => {
        const result = (await this.contact.findOne({ ID: 'contacts' })) || (await new this.contact({ ID: 'contacts' }))
        return result.data
    }

    public useInventoryItem = async (jid: string, item: string): Promise<void> => {
        const { inventory } = await this.getUser(jid)
        const index = inventory.findIndex((Item) => Item.item.toLowerCase() === item.toLowerCase())
        if (index < 0) return
        if (!inventory[index].usageLeft || inventory[index].usageLeft > 15) return
        const left = inventory[index].usageLeft
        if (left <= 1) inventory.splice(index, 1)
        else inventory[index].usageLeft -= 1
        await this.user.updateOne({ jid }, { inventory })
    }

    public denyCommand = async (command: string, reason: string, username: string) => {
        const disabledCommands = await this.getDisabledCommands()
        const time = moment.tz('Etc/GMT').format('MMM D, YYYY HH:mm:ss')
        disabledCommands.push({ command, reason, time, deniedBy: username })
        await this.disabledCommands.updateOne({ title: 'commands' }, { $set: { disabledCommands } })
    }

    public acceptCommand = async (index: number) => {
        const disabledCommands = await this.getDisabledCommands()
        disabledCommands.splice(index, 1)
        await this.disabledCommands.updateOne({ title: 'commands' }, { $set: { disabledCommands } })
    }

    public getClaimedCards = async (): Promise<TCardsModel> =>
        (await this.card.findOne({ title: 'cards' })) || (await new this.card({ title: 'cards' }).save())

    public updateClaimedCards = async (data: CardSchema['data']): Promise<void> => {
        await this.getClaimedCards()
        await this.card.updateOne({ title: 'cards' }, { $set: { data } })
    }

    public addItem = async (
        name: string,
        description: string,
        emoji: string,
        price: number,
        usageLimit: number = 30
    ): Promise<void> => {
        const { items } = await this.getFeature('store')
        items.push({ name, emoji, description, price, usageLimit, id: items.length + 1 })
        await this.feature.updateOne({ feature: 'store' }, { $set: { items } })
    }

    public getStore = async (): Promise<string> => {
        const { items } = await this.getFeature('store')
        let text = '🏬 *Store* 🏬\n'
        for (const item of items)
            text += `\n${item.emoji} *#${item.id} ${item.name
                .split(' ')
                .map((name) => this.utils.capitalize(name))
                .join(' ')}*\n\t💬 *Description:* ${item.description}\n\t🔖 *Price:* ${item.price}\n`
        return text
    }

    public getFeature = async (feature: string): Promise<TFeatureModel> =>
        (await this.feature.findOne({ feature })) || (await new this.feature({ feature }).save())

    public getDisabledCommands = async (): Promise<TCommandModel['disabledCommands']> => {
        const result =
            (await this.disabledCommands.findOne({ title: 'commands' })) ||
            (await new this.disabledCommands({ title: 'commands' }).save())
        return result.disabledCommands
    }

    public updateDisabledCommands = async (update: TCommandModel['disabledCommands']): Promise<void> => {
        await this.getDisabledCommands()
        await this.disabledCommands.updateOne({ title: 'commands' }, { $set: { disabledCommands: update } })
    }

    private utils = new Utils()

    public user = userSchema

    public group = groupSchema

    public contact = contactSchema

    public session = sessionSchema

    public disabledCommands = disabledCommandsSchema

    public feature = featureSchema

    public characters = characterSchema

    public card = cardsSchema
}

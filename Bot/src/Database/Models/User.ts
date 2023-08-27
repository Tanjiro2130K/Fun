import { prop, getModelForClass, modelOptions, Severity } from '@typegoose/typegoose'
import { Document } from 'mongoose'
import { ICharacter } from '@shineiichijo/marika'
import { WaifuResponse, TCardsTier } from '../../Types'

class Gallery implements ICharacter {
    @prop({ required: true })
    public mal_id!: ICharacter['mal_id']

    @prop({ type: String, required: true })
    public url!: string

    @prop({ type: Object, required: true })
    public images!: ICharacter['images']

    @prop({ type: String, required: true })
    public name!: string

    @prop({ type: () => [String], required: true, default: [] })
    public nicknames!: string[]

    @prop({ type: String, required: true })
    public about!: string

    @prop({ required: true })
    public favorites!: number
}

class Ban {
    @prop({ type: Boolean, required: true, default: false })
    public banned!: boolean

    @prop({ type: String })
    public reason?: string

    @prop({ type: String })
    public bannedBy?: string

    @prop({ type: String })
    public bannedIn?: string

    @prop({ type: String })
    public time?: string
}

class PokemonStats {
    @prop({ type: Number, required: true })
    public change!: number

    @prop({ type: String, required: true })
    public target!: string
}

export class PokemonMove {
    @prop({ type: String, required: true })
    public name!: string

    @prop({ type: Number, required: true })
    public pp!: number

    @prop({ type: Number, required: true })
    public maxPp!: number

    @prop({ type: Number, required: true })
    public id!: number

    @prop({ type: Number, required: true })
    public power!: number

    @prop({ type: Number, required: true })
    public accuracy!: number

    @prop({ type: String, required: true, default: 'normal' })
    public type!: string

    @prop({ type: Number, required: true })
    public priority!: number

    @prop({ type: () => PokemonStats, required: true, default: [] })
    public stat_change!: PokemonStats[]

    @prop({ type: String, required: true })
    public effect!: string

    @prop({ type: Number, required: true })
    public healing!: number

    @prop({ type: Number, required: true })
    public drain!: number

    @prop({ type: String, required: true })
    public description!: string
}

class PokemonState {
    @prop({ type: String, required: true })
    public status!: string

    @prop({ type: Number, required: true })
    public movesUsed!: number
}

export class Pokemon {
    @prop({ type: String, required: true })
    public name!: string

    @prop({ type: String, required: true })
    public image!: string

    @prop({ type: Number, required: true })
    public id!: number

    @prop({ type: Number, required: true })
    public level!: number

    @prop({ type: Number, required: true })
    public exp!: number

    @prop({ type: Number, required: true })
    public displayExp!: number

    @prop({ type: Number, required: true })
    public maxHp!: number

    @prop({ type: Number, required: true })
    public hp!: number

    @prop({ type: Number, required: true })
    public maxAttack!: number

    @prop({ type: Number, required: true })
    public attack!: number

    @prop({ type: Number, required: true })
    public maxDefense!: number

    @prop({ type: Number, required: true })
    public defense!: number

    @prop({ type: Number, required: true })
    public speed!: number

    @prop({ type: Number, required: true })
    public maxSpeed!: number

    @prop({ type: () => PokemonMove, required: true, default: [] })
    public moves!: PokemonMove[]

    @prop({ type: () => [String], required: true, default: [] })
    public types!: string[]

    @prop({ type: () => [String], required: true, default: [] })
    public rejectedMoves!: string[]

    @prop({ type: () => PokemonState, required: true, default: () => ({ status: '', movesUsed: 0 }) })
    public state!: PokemonState

    @prop({ type: Boolean, required: true, default: false })
    public female!: boolean

    @prop({ type: String, required: true })
    public tag!: string
}

export class Card {
    @prop({ type: String, required: true })
    public id!: string

    @prop({ type: String, required: true })
    public name!: string

    @prop({ type: String, required: true })
    public tier!: TCardsTier

    @prop({ type: String, required: true })
    public image!: string

    @prop({ type: String, required: true })
    public url!: string

    @prop({ type: String, required: true })
    public description!: string
}

class Inventory {
    @prop({ type: String, required: true })
    public item!: string

    @prop({ type: Number, required: true })
    public usageLeft!: number
}

class Icon {
    @prop({ type: Boolean, required: true, default: false })
    public custom!: boolean

    @prop({ type: String })
    public hash?: string

    @prop({ type: String })
    public url?: string
}

class About {
    @prop({ type: Boolean, required: true, default: false })
    public custom!: boolean

    @prop({ type: String })
    public bio?: string
}

class Username {
    @prop({ type: Boolean, required: true, default: false })
    public custom!: boolean

    @prop({ type: String })
    public name?: string
}

@modelOptions({
    options: {
        allowMixed: Severity.ALLOW
    }
})
class Haigusha {
    @prop({ type: Boolean, required: true, default: false })
    public married!: boolean

    @prop({ type: Object, required: true, default: () => ({}) })
    public data!: WaifuResponse
}

@modelOptions({
    options: {
        allowMixed: Severity.ALLOW
    }
})
export class User {
    @prop({ type: String, required: true, unique: true })
    public jid!: string

    @prop({ type: Number, required: true, default: 0 })
    public experience!: number

    @prop({ type: Number, required: true, default: 0 })
    public wallet!: number

    @prop({ type: Number, required: true, default: 0 })
    public bank!: number

    @prop({ type: Number, required: true, default: 0 })
    public quizWins!: number

    @prop({ type: Number, required: true, default: 0 })
    public lastDaily!: number

    @prop({ type: Number, required: true, default: 0 })
    public lastRob!: number

    @prop({ type: () => Ban, required: true, default: () => ({ banned: false }) })
    public ban!: Ban

    @prop({ type: Number, required: true, default: 1 })
    public level!: number

    @prop({ type: String, required: true })
    public tag!: string

    @prop({ type: () => Pokemon, required: true, default: [] })
    public party!: Pokemon[]

    @prop({ type: () => Pokemon, required: true, default: [] })
    public pc!: Pokemon[]

    @prop({ type: () => Card, required: true, default: [] })
    public deck!: Card[]

    @prop({ type: () => Card, required: true, default: [] })
    public cardCollection!: Card[]

    @prop({ type: () => Inventory, required: true, default: [] })
    public inventory!: Inventory[]

    @prop({ type: () => Icon, required: true, default: () => ({ custom: false }) })
    public icon!: Icon

    @prop({ type: () => About, required: true, default: () => ({ custom: false }) })
    public about!: About

    @prop({ type: () => Username, required: true, default: () => ({ custom: false }) })
    public username!: Username

    @prop({ type: () => Haigusha, required: true, default: () => ({ married: false, data: {} }) })
    public haigusha!: Haigusha

    @prop({ type: String, required: true, default: 'None' })
    public companion!: string

    @prop({ type: Number, required: true, default: 0 })
    public lastHeal!: number

    @prop({ type: () => Gallery, required: true, default: [] })
    public gallery!: Gallery[]
}

export type TUserModel = User & Document

export const userSchema = getModelForClass(User)

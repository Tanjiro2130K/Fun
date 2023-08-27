import { prop, getModelForClass } from '@typegoose/typegoose'
import { Document } from 'mongoose'

export class Feature {
    @prop({ type: String, required: true, unique: true })
    public feature!: string

    @prop({ type: String, required: true, default: '' })
    public newsId!: string

    @prop({ type: () => Items, required: true })
    public items!: Items[]
}

class Items {
    @prop({ type: Number, required: true })
    public id!: number

    @prop({ type: String, required: true })
    public emoji!: string

    @prop({ type: String, required: true })
    public name!: string

    @prop({ type: Number, required: true })
    public description!: string

    @prop({ type: Number, required: true })
    public usageLimit!: number

    @prop({ type: Number, required: true })
    public price!: number
}

export type TFeatureModel = Feature & Document

export const featureSchema = getModelForClass(Feature)

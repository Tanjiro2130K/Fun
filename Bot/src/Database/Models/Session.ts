import { prop, getModelForClass } from '@typegoose/typegoose'
import { Document } from 'mongoose'

export class SessionSchema {
    @prop({ type: String, required: true, unique: true })
    public sessionId!: string

    @prop({ type: String })
    public session?: string
}

export type TSessionModel = SessionSchema & Document

export const sessionSchema = getModelForClass(SessionSchema)

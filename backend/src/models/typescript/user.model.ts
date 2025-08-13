import { ObjectId } from "mongodb"

export interface UserTSModel {
    _id: string | ObjectId
    phone: string
}
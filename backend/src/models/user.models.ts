import { ObjectId } from "mongodb"

export interface UserModel {
    _id: string | ObjectId
    phone: string
}
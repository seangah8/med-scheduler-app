import mongoose from 'mongoose'
import { faker } from '@faker-js/faker'
import { UserMongoModel } from "../models/mongo/user.model"
import { UserTSModel } from '../models/typescript/user.model'

export async function seedUsers(amount:number) : Promise<(UserTSModel & { _id: mongoose.Types.ObjectId })[]> {

    const now = new Date()

    const users = await UserMongoModel.insertMany(
        Array.from({ length: amount }).map(() => ({
            phone: `05${faker.number.int({ min: 10000000, max: 99999999 })}`,
            createdAt: now,
            isUserNew: Math.random() < 0.05, // 5% new
        }))
    )

    return users
}

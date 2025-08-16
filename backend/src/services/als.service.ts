import { AsyncLocalStorage } from 'async_hooks'
import { AlsStoreModel } from '../models/typescript/alsStore.model'

export const asyncLocalStorage = new AsyncLocalStorage<AlsStoreModel>()
